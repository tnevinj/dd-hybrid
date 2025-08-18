/**
 * Enhanced Template Engine Service
 * Provides intelligent template management, selection, and content generation
 * with context-aware AI assistance and data binding capabilities
 */

import { 
  SmartTemplate, 
  TemplateSection, 
  ProjectContext, 
  ContentGenerationRequest,
  ContentGenerationResult,
  DataBinding,
  SectionValidationRule,
  WorkProduct,
  DocumentSection,
  WorkProductType
} from '@/types/work-product';
import { UnifiedWorkspaceDataService } from '@/lib/data/unified-workspace-data';

export interface TemplateMatchResult {
  template: SmartTemplate;
  relevanceScore: number;
  reasoning: string;
  customizationSuggestions: string[];
  estimatedGeneration: {
    timeMinutes: number;
    automationLevel: number;
    qualityExpected: number;
  };
}

export interface TemplateLibrary {
  category: string;
  templates: SmartTemplate[];
  industrySpecific: Record<string, SmartTemplate[]>;
  userCustom: SmartTemplate[];
}

export class TemplateEngine {
  private static instance: TemplateEngine;
  private templateCache: Map<string, SmartTemplate> = new Map();
  private templateLibrary: TemplateLibrary | null = null;

  static getInstance(): TemplateEngine {
    if (!TemplateEngine.instance) {
      TemplateEngine.instance = new TemplateEngine();
    }
    return TemplateEngine.instance;
  }

  /**
   * Initialize template library with default and custom templates
   */
  async initializeTemplateLibrary(): Promise<void> {
    this.templateLibrary = {
      category: 'private-equity',
      templates: await this.loadDefaultTemplates(),
      industrySpecific: await this.loadIndustryTemplates(),
      userCustom: await this.loadUserCustomTemplates()
    };

    // Cache frequently used templates
    this.templateLibrary.templates.forEach(template => {
      this.templateCache.set(template.id, template);
    });
  }

  /**
   * Find optimal template for a given project context
   */
  async findOptimalTemplate(
    context: ProjectContext, 
    workProductType: WorkProductType,
    mode: 'traditional' | 'assisted' | 'autonomous' = 'assisted'
  ): Promise<TemplateMatchResult[]> {
    await this.ensureLibraryLoaded();
    
    const allTemplates = this.getAllRelevantTemplates(workProductType);
    const matchResults: TemplateMatchResult[] = [];

    for (const template of allTemplates) {
      const relevanceScore = this.calculateRelevanceScore(template, context);
      
      if (relevanceScore > 0.3) { // Only include reasonably relevant templates
        matchResults.push({
          template,
          relevanceScore,
          reasoning: this.generateMatchReasoning(template, context, relevanceScore),
          customizationSuggestions: this.generateCustomizationSuggestions(template, context),
          estimatedGeneration: this.estimateGenerationMetrics(template, context, mode)
        });
      }
    }

    // Sort by relevance score descending
    return matchResults.sort((a, b) => b.relevanceScore - a.relevanceScore);
  }

  /**
   * Generate content using template and context
   */
  async generateContent(request: ContentGenerationRequest): Promise<ContentGenerationResult> {
    const startTime = Date.now();
    
    const template = await this.getTemplate(request.templateId);
    if (!template) {
      throw new Error(`Template not found: ${request.templateId}`);
    }

    // Initialize work product structure
    const workProduct: WorkProduct = {
      id: `wp-${Date.now()}`,
      workspaceId: request.workspaceId,
      title: `${request.projectContext.projectName} - ${template.name}`,
      type: template.workProductType,
      status: 'DRAFT',
      templateId: template.id,
      sections: [],
      metadata: {
        templateId: template.id,
        generationMode: request.generationMode,
        projectContext: request.projectContext
      },
      createdBy: 'ai-generator',
      createdAt: new Date(),
      updatedAt: new Date(),
      version: '1.0',
      versionHistory: [],
      wordCount: 0,
      readingTime: 0,
      collaboratorCount: 1,
      commentCount: 0,
      editCount: 0
    };

    // Generate sections
    const generationMetrics = {
      totalSections: template.sections.length,
      generatedSections: 0,
      automationLevel: 0,
      qualityScore: 0,
      generationTime: 0,
      dataBindingsApplied: 0,
      validationsPassed: 0,
      validationsFailed: 0
    };

    const warnings: any[] = [];
    const suggestions: any[] = [];

    for (const templateSection of template.sections) {
      try {
        const documentSection = await this.generateSection(
          templateSection, 
          request.projectContext, 
          request.generationMode,
          request.options
        );
        
        workProduct.sections.push(documentSection);
        generationMetrics.generatedSections++;
        
        // Apply data bindings if requested
        if (request.options?.includeDataBindings && templateSection.dataBindings.length > 0) {
          await this.applyDataBindings(documentSection, templateSection.dataBindings);
          generationMetrics.dataBindingsApplied += templateSection.dataBindings.length;
        }

        // Validate content if requested
        if (request.options?.validateContent) {
          const validationResults = await this.validateSection(documentSection, templateSection.validationRules);
          generationMetrics.validationsPassed += validationResults.passed;
          generationMetrics.validationsFailed += validationResults.failed;
          warnings.push(...validationResults.warnings);
        }

      } catch (error) {
        warnings.push({
          id: `warning-${templateSection.id}`,
          type: 'generation-failed',
          sectionId: templateSection.id,
          severity: 'error',
          message: `Failed to generate section "${templateSection.title}": ${error.message}`,
          suggestedFix: 'Review template configuration and try again'
        });
      }
    }

    // Calculate final metrics
    generationMetrics.automationLevel = generationMetrics.generatedSections / generationMetrics.totalSections;
    generationMetrics.qualityScore = this.calculateOverallQuality(workProduct.sections);
    generationMetrics.generationTime = Date.now() - startTime;

    // Update work product metadata
    workProduct.wordCount = this.calculateWordCount(workProduct.sections);
    workProduct.readingTime = Math.ceil(workProduct.wordCount / 200); // Assume 200 words per minute

    // Generate suggestions for improvement
    suggestions.push(...this.generateImprovementSuggestions(workProduct, template));

    return {
      workProduct,
      generationMetrics,
      suggestions,
      warnings
    };
  }

  /**
   * Create custom template from existing work product
   */
  async createCustomTemplate(
    workProduct: WorkProduct,
    templateName: string,
    description: string,
    category: SmartTemplate['category']
  ): Promise<SmartTemplate> {
    const customTemplate: SmartTemplate = {
      id: `custom-${Date.now()}`,
      name: templateName,
      description,
      category,
      industryFocus: [workProduct.metadata.projectContext?.sector || 'general'],
      dealStages: [workProduct.metadata.projectContext?.stage || 'general'],
      workProductType: workProduct.type,
      
      sections: workProduct.sections.map(section => this.convertToTemplateSection(section)),
      dynamicFields: this.extractDynamicFields(workProduct),
      conditionalLogic: [],
      
      aiGenerationPrompts: this.generateDefaultPrompts(workProduct.type),
      dataIntegrationPoints: [],
      contentValidationRules: [],
      
      version: '1.0',
      createdBy: 'user',
      createdAt: new Date(),
      updatedAt: new Date(),
      usageCount: 0,
      successRate: 0,
      averageQualityScore: 0,
      tags: [category, workProduct.type.toLowerCase()]
    };

    // Save to user custom templates
    await this.saveCustomTemplate(customTemplate);
    
    return customTemplate;
  }

  // Private helper methods

  private async loadDefaultTemplates(): Promise<SmartTemplate[]> {
    // In a real implementation, this would load from a database or configuration
    return [
      {
        id: 'dd-comprehensive-template',
        name: 'Comprehensive Due Diligence Report',
        description: 'Complete due diligence analysis with executive summary, financial review, market analysis, and risk assessment',
        category: 'due-diligence',
        industryFocus: ['technology', 'healthcare', 'financial-services'],
        dealStages: ['due-diligence', 'investment-committee'],
        workProductType: 'DD_REPORT',
        
        sections: [
          {
            id: 'exec-summary',
            title: 'Executive Summary',
            description: 'High-level overview of investment opportunity',
            order: 1,
            required: true,
            type: 'text',
            generationStrategy: 'ai-generated',
            aiPrompt: 'Generate a compelling executive summary for a {sector} investment opportunity valued at {dealValue}. Focus on key investment highlights, strategic rationale, and expected returns.',
            dataBindings: [
              {
                id: 'deal-metrics-binding',
                sourceType: 'deal-metrics',
                sourceId: 'primary',
                fieldMapping: {
                  'dealValue': 'investment.value',
                  'sector': 'company.sector',
                  'expectedReturns': 'projections.irr'
                },
                transformationRules: [
                  {
                    id: 'format-currency',
                    type: 'format',
                    sourceField: 'dealValue',
                    targetField: 'formattedValue',
                    operation: 'formatCurrency',
                    parameters: { currency: 'USD', millions: true }
                  }
                ],
                refreshPolicy: 'on-demand'
              }
            ],
            validationRules: [
              {
                id: 'summary-completeness',
                type: 'completeness',
                description: 'Executive summary must include key investment highlights',
                severity: 'error',
                validationFunction: 'validateExecutiveSummary',
                parameters: { minWords: 150, maxWords: 500 }
              }
            ],
            estimatedLength: 300,
            dependencies: []
          },
          {
            id: 'investment-thesis',
            title: 'Investment Thesis',
            description: 'Detailed rationale for the investment',
            order: 2,
            required: true,
            type: 'text',
            generationStrategy: 'ai-generated',
            aiPrompt: 'Develop a comprehensive investment thesis for a {sector} company. Address market opportunity, competitive advantages, management team strength, and value creation potential.',
            dataBindings: [],
            validationRules: [],
            estimatedLength: 800,
            dependencies: ['exec-summary']
          },
          {
            id: 'financial-analysis',
            title: 'Financial Analysis',
            description: 'Comprehensive financial review and projections',
            order: 3,
            required: true,
            type: 'financial_block',
            generationStrategy: 'data-driven',
            dataBindings: [
              {
                id: 'financial-data-binding',
                sourceType: 'financial-model',
                sourceId: 'primary',
                fieldMapping: {
                  'revenue': 'financials.revenue',
                  'ebitda': 'financials.ebitda',
                  'projections': 'financials.projections'
                },
                transformationRules: [],
                refreshPolicy: 'real-time'
              }
            ],
            validationRules: [
              {
                id: 'financial-accuracy',
                type: 'accuracy',
                description: 'Financial data must be current and accurate',
                severity: 'error',
                validationFunction: 'validateFinancialData',
                parameters: { dataAge: 90 }
              }
            ],
            estimatedLength: 1200,
            dependencies: []
          }
        ],
        
        dynamicFields: [
          {
            id: 'deal-value',
            name: 'Deal Value',
            type: 'currency',
            required: true,
            description: 'Total investment amount'
          },
          {
            id: 'sector',
            name: 'Industry Sector',
            type: 'select',
            required: true,
            options: ['Technology', 'Healthcare', 'Financial Services', 'Manufacturing', 'Retail'],
            description: 'Primary industry sector'
          }
        ],
        
        conditionalLogic: [],
        aiGenerationPrompts: {
          'exec-summary': 'Generate executive summary focusing on {sector} sector dynamics',
          'investment-thesis': 'Develop investment thesis emphasizing competitive advantages',
          'financial-analysis': 'Analyze financial performance with focus on growth metrics'
        },
        dataIntegrationPoints: [],
        contentValidationRules: [],
        
        version: '1.0',
        createdBy: 'system',
        createdAt: new Date(),
        updatedAt: new Date(),
        usageCount: 0,
        successRate: 0.85,
        averageQualityScore: 0.82,
        tags: ['due-diligence', 'comprehensive', 'standard']
      }
    ];
  }

  private async loadIndustryTemplates(): Promise<Record<string, SmartTemplate[]>> {
    // Industry-specific templates would be loaded here
    return {
      'technology': [],
      'healthcare': [],
      'financial-services': []
    };
  }

  private async loadUserCustomTemplates(): Promise<SmartTemplate[]> {
    // User custom templates would be loaded from database
    return [];
  }

  private getAllRelevantTemplates(workProductType: WorkProductType): SmartTemplate[] {
    if (!this.templateLibrary) return [];
    
    return this.templateLibrary.templates.filter(template => 
      template.workProductType === workProductType
    );
  }

  private calculateRelevanceScore(template: SmartTemplate, context: ProjectContext): number {
    let score = 0;

    // Industry match
    if (context.sector && template.industryFocus.includes(context.sector.toLowerCase())) {
      score += 0.3;
    }

    // Deal stage match
    if (context.stage && template.dealStages.includes(context.stage)) {
      score += 0.2;
    }

    // Deal size consideration
    if (context.dealValue) {
      const dealSize = context.dealValue / 1000000; // Convert to millions
      if (dealSize >= 10 && dealSize <= 500) { // Sweet spot for PE deals
        score += 0.2;
      }
    }

    // Template success rate
    score += template.successRate * 0.2;

    // Usage popularity
    if (template.usageCount > 10) {
      score += 0.1;
    }

    return Math.min(1.0, score);
  }

  private generateMatchReasoning(template: SmartTemplate, context: ProjectContext, score: number): string {
    const reasons = [];

    if (context.sector && template.industryFocus.includes(context.sector.toLowerCase())) {
      reasons.push(`Perfect match for ${context.sector} sector`);
    }

    if (template.successRate > 0.8) {
      reasons.push(`High success rate (${Math.round(template.successRate * 100)}%)`);
    }

    if (template.usageCount > 15) {
      reasons.push('Proven and well-tested template');
    }

    if (score > 0.8) {
      reasons.push('Excellent fit for project requirements');
    } else if (score > 0.6) {
      reasons.push('Good fit with minor customization needed');
    }

    return reasons.join('; ');
  }

  private generateCustomizationSuggestions(template: SmartTemplate, context: ProjectContext): string[] {
    const suggestions = [];

    if (context.sector && !template.industryFocus.includes(context.sector.toLowerCase())) {
      suggestions.push(`Customize industry focus for ${context.sector}`);
    }

    if (context.dealValue && context.dealValue > 200000000) {
      suggestions.push('Add large deal specific sections (regulatory, integration planning)');
    }

    if (context.riskRating === 'high') {
      suggestions.push('Enhance risk assessment sections');
    }

    return suggestions;
  }

  private estimateGenerationMetrics(template: SmartTemplate, context: ProjectContext, mode: string) {
    const baseTime = template.sections.reduce((total, section) => 
      total + (section.estimatedLength || 500) / 100, 0
    );

    const modeMultipliers = {
      'traditional': { time: 1.0, automation: 0.3, quality: 0.7 },
      'assisted': { time: 0.6, automation: 0.7, quality: 0.85 },
      'autonomous': { time: 0.3, automation: 0.95, quality: 0.9 }
    };

    const multiplier = modeMultipliers[mode] || modeMultipliers.assisted;

    return {
      timeMinutes: Math.ceil(baseTime * multiplier.time),
      automationLevel: multiplier.automation,
      qualityExpected: multiplier.quality
    };
  }

  private async generateSection(
    templateSection: TemplateSection,
    context: ProjectContext,
    mode: string,
    options?: any
  ): Promise<DocumentSection> {
    const section: DocumentSection = {
      id: `section-${templateSection.id}-${Date.now()}`,
      title: templateSection.title,
      order: templateSection.order,
      content: '',
      type: templateSection.type,
      required: templateSection.required,
      template: templateSection.id,
      metadata: {
        generatedAt: new Date(),
        generationMode: mode
      },
      generationStrategy: templateSection.generationStrategy,
      dataBindings: templateSection.dataBindings,
      validationRules: templateSection.validationRules,
      aiPrompt: templateSection.aiPrompt,
      lastGenerated: new Date()
    };

    // Generate content based on strategy
    switch (templateSection.generationStrategy) {
      case 'ai-generated':
        section.content = await this.generateAIContent(templateSection, context);
        section.qualityScore = 0.85;
        break;
      case 'data-driven':
        section.content = await this.generateDataDrivenContent(templateSection, context);
        section.qualityScore = 0.90;
        break;
      case 'hybrid':
        section.content = await this.generateHybridContent(templateSection, context);
        section.qualityScore = 0.88;
        break;
      default:
        section.content = `[${templateSection.title} - Content to be added]`;
        section.qualityScore = 0.6;
    }

    return section;
  }

  private async generateAIContent(templateSection: TemplateSection, context: ProjectContext): Promise<string> {
    if (!templateSection.aiPrompt) {
      return `# ${templateSection.title}\n\n[AI-generated content for ${templateSection.title}]`;
    }

    // Replace template variables in prompt
    let prompt = templateSection.aiPrompt;
    Object.keys(context).forEach(key => {
      prompt = prompt.replace(new RegExp(`{${key}}`, 'g'), String(context[key] || ''));
    });

    // In a real implementation, this would call an AI service
    return `# ${templateSection.title}\n\n[AI-generated content based on: ${prompt}]\n\nThis section would contain intelligent analysis based on the project context including ${context.projectName} (${context.sector}, $${(context.dealValue || 0) / 1000000}M).`;
  }

  private async generateDataDrivenContent(templateSection: TemplateSection, context: ProjectContext): Promise<string> {
    // This would fetch and format data from various sources
    return `# ${templateSection.title}\n\n[Data-driven content with live metrics and analysis]\n\n**Project:** ${context.projectName}\n**Sector:** ${context.sector}\n**Deal Value:** $${(context.dealValue || 0) / 1000000}M\n**Stage:** ${context.stage}`;
  }

  private async generateHybridContent(templateSection: TemplateSection, context: ProjectContext): Promise<string> {
    const aiContent = await this.generateAIContent(templateSection, context);
    const dataContent = await this.generateDataDrivenContent(templateSection, context);
    
    return `${aiContent}\n\n---\n\n${dataContent}`;
  }

  private async applyDataBindings(section: DocumentSection, bindings: DataBinding[]): Promise<void> {
    for (const binding of bindings) {
      try {
        const data = await this.fetchDataFromSource(binding);
        section.content = this.applyDataToContent(section.content, data, binding);
      } catch (error) {
        console.warn(`Failed to apply data binding ${binding.id}:`, error);
      }
    }
  }

  private async fetchDataFromSource(binding: DataBinding): Promise<any> {
    // This would fetch data from various sources based on sourceType
    switch (binding.sourceType) {
      case 'deal-metrics':
        return UnifiedWorkspaceDataService.getProjectById(binding.sourceId);
      case 'financial-model':
        // Fetch from financial modeling service
        return {};
      default:
        return {};
    }
  }

  private applyDataToContent(content: string, data: any, binding: DataBinding): string {
    let updatedContent = content;
    
    Object.entries(binding.fieldMapping).forEach(([sourceField, targetField]) => {
      const value = this.getNestedValue(data, sourceField);
      if (value !== undefined) {
        updatedContent = updatedContent.replace(
          new RegExp(`\\{${targetField}\\}`, 'g'),
          String(value)
        );
      }
    });

    return updatedContent;
  }

  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }

  private async validateSection(section: DocumentSection, rules: SectionValidationRule[]): Promise<{passed: number, failed: number, warnings: any[]}> {
    let passed = 0;
    let failed = 0;
    const warnings: any[] = [];

    for (const rule of rules) {
      try {
        const isValid = await this.executeValidationRule(section, rule);
        if (isValid) {
          passed++;
        } else {
          failed++;
          warnings.push({
            id: `validation-${rule.id}`,
            type: 'validation-failed',
            sectionId: section.id,
            severity: rule.severity,
            message: rule.description,
            suggestedFix: 'Review and update section content'
          });
        }
      } catch (error) {
        failed++;
        warnings.push({
          id: `validation-error-${rule.id}`,
          type: 'validation-failed',
          sectionId: section.id,
          severity: 'error',
          message: `Validation failed: ${error.message}`,
          suggestedFix: 'Check validation rule configuration'
        });
      }
    }

    return { passed, failed, warnings };
  }

  private async executeValidationRule(section: DocumentSection, rule: SectionValidationRule): Promise<boolean> {
    // This would execute various validation functions
    switch (rule.type) {
      case 'completeness':
        const wordCount = section.content.split(/\s+/).length;
        const minWords = rule.parameters.minWords || 0;
        const maxWords = rule.parameters.maxWords || 10000;
        return wordCount >= minWords && wordCount <= maxWords;
      
      case 'readability':
        // Implement readability scoring
        return section.content.length > 50;
      
      default:
        return true;
    }
  }

  private calculateOverallQuality(sections: DocumentSection[]): number {
    if (sections.length === 0) return 0;
    
    const scores = sections.map(section => section.qualityScore || 0.5);
    return scores.reduce((sum, score) => sum + score, 0) / scores.length;
  }

  private calculateWordCount(sections: DocumentSection[]): number {
    return sections.reduce((total, section) => 
      total + section.content.split(/\s+/).length, 0
    );
  }

  private generateImprovementSuggestions(workProduct: WorkProduct, template: SmartTemplate): any[] {
    const suggestions = [];
    
    // Check for empty sections
    workProduct.sections.forEach(section => {
      if (section.content.length < 100) {
        suggestions.push({
          id: `suggestion-${section.id}`,
          type: 'improvement',
          sectionId: section.id,
          title: 'Expand section content',
          description: `Section "${section.title}" appears to be underdeveloped`,
          priority: 'medium',
          effort: 'moderate',
          impact: 'medium',
          suggestedAction: 'Add more detailed analysis and supporting data'
        });
      }
    });

    return suggestions;
  }

  private convertToTemplateSection(section: DocumentSection): TemplateSection {
    return {
      id: section.id,
      title: section.title,
      order: section.order,
      required: section.required,
      type: section.type,
      generationStrategy: section.generationStrategy || 'static',
      aiPrompt: section.aiPrompt,
      dataBindings: section.dataBindings || [],
      validationRules: section.validationRules || [],
      estimatedLength: section.content.split(/\s+/).length,
      dependencies: []
    };
  }

  private extractDynamicFields(workProduct: WorkProduct): any[] {
    // Extract dynamic fields from work product metadata
    return [];
  }

  private generateDefaultPrompts(workProductType: WorkProductType): Record<string, string> {
    const promptMap = {
      'DD_REPORT': 'Generate comprehensive due diligence analysis',
      'IC_MEMO': 'Create investment committee recommendation',
      'INVESTMENT_SUMMARY': 'Summarize investment opportunity',
      'MARKET_ANALYSIS': 'Analyze market dynamics and opportunity',
      'RISK_ASSESSMENT': 'Assess investment risks and mitigation strategies',
      'FINANCIAL_MODEL': 'Build financial projections and analysis'
    };

    return { default: promptMap[workProductType] || 'Generate professional content' };
  }

  private async saveCustomTemplate(template: SmartTemplate): Promise<void> {
    // Save to database or storage
    this.templateCache.set(template.id, template);
    if (this.templateLibrary) {
      this.templateLibrary.userCustom.push(template);
    }
  }

  private async getTemplate(templateId: string): Promise<SmartTemplate | null> {
    return this.templateCache.get(templateId) || null;
  }

  private async ensureLibraryLoaded(): Promise<void> {
    if (!this.templateLibrary) {
      await this.initializeTemplateLibrary();
    }
  }
}

export const templateEngine = TemplateEngine.getInstance();