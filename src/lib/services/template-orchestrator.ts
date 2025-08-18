/**
 * Template Orchestrator Service
 * Integrates template engine with autonomous chat for intelligent
 * template selection, content generation, and user interaction
 */

import { 
  ContentGenerationRequest,
  ContentGenerationResult,
  SmartTemplate,
  ProjectContext,
  WorkProduct,
  WorkProductType
} from '@/types/work-product';
import { ThandoContext, AIAction } from '@/types/thando-context';
import { templateEngine, TemplateMatchResult } from './template-engine';
import { contentTransformationPipeline } from './content-transformation-pipeline';
import { UnifiedWorkspaceDataService } from '@/lib/data/unified-workspace-data';

export interface TemplateRecommendation {
  template: SmartTemplate;
  relevanceScore: number;
  reasoning: string;
  estimatedTime: number;
  automationLevel: number;
  customizationSuggestions: string[];
  actionable: boolean;
}

export interface ContentGenerationAction extends AIAction {
  templateId: string;
  workProductType: WorkProductType;
  estimatedGeneration: {
    timeMinutes: number;
    automationLevel: number;
    qualityExpected: number;
  };
  requirements: {
    dataAccess: string[];
    approvals: string[];
    customizations: Record<string, any>;
  };
}

export interface TemplateSelectionContext {
  userIntent: string;
  projectContext: ProjectContext;
  navigationMode: 'traditional' | 'assisted' | 'autonomous';
  userPreferences: {
    preferredTemplates: string[];
    customizationLevel: 'minimal' | 'moderate' | 'extensive';
    outputFormat: string[];
    qualityThreshold: number;
  };
  constraints: {
    timeLimit?: number;
    approvalRequired?: boolean;
    dataRestrictions?: string[];
  };
}

export class TemplateOrchestrator {
  private static instance: TemplateOrchestrator;

  static getInstance(): TemplateOrchestrator {
    if (!TemplateOrchestrator.instance) {
      TemplateOrchestrator.instance = new TemplateOrchestrator();
    }
    return TemplateOrchestrator.instance;
  }

  /**
   * Analyze user message and provide template-based actions
   */
  async analyzeUserIntent(
    message: string,
    context: ThandoContext
  ): Promise<{
    templateRecommendations: TemplateRecommendation[];
    suggestedActions: ContentGenerationAction[];
    quickActions: AIAction[];
    confidence: number;
  }> {
    const userIntent = this.extractUserIntent(message);
    const projectContext = this.buildProjectContext(context);
    
    const selectionContext: TemplateSelectionContext = {
      userIntent,
      projectContext,
      navigationMode: context.navigationMode,
      userPreferences: this.extractUserPreferences(context),
      constraints: this.extractConstraints(context)
    };

    // Get template recommendations
    const templateRecommendations = await this.getTemplateRecommendations(selectionContext);
    
    // Generate actionable suggestions
    const suggestedActions = await this.generateContentActions(templateRecommendations, selectionContext);
    
    // Create quick actions for autonomous mode
    const quickActions = this.generateQuickActions(templateRecommendations, selectionContext);
    
    // Calculate confidence based on intent clarity and template availability
    const confidence = this.calculateIntentConfidence(userIntent, templateRecommendations);

    return {
      templateRecommendations,
      suggestedActions,
      quickActions,
      confidence
    };
  }

  /**
   * Execute content generation based on user selection
   */
  async executeContentGeneration(
    action: ContentGenerationAction,
    context: ThandoContext,
    customizations?: Record<string, any>
  ): Promise<{
    result: ContentGenerationResult;
    followUpActions: AIAction[];
    userMessage: string;
  }> {
    try {
      const projectContext = this.buildProjectContext(context);
      
      const request: ContentGenerationRequest = {
        templateId: action.templateId,
        workspaceId: projectContext.projectId,
        projectContext,
        customFields: customizations,
        generationMode: context.navigationMode,
        options: {
          includeDataBindings: true,
          generateAllSections: context.navigationMode === 'autonomous',
          validateContent: true,
          optimizeForReadability: true
        }
      };

      // Execute content generation
      const result = await contentTransformationPipeline.transformToWorkProduct(request);
      
      // Generate follow-up actions
      const followUpActions = this.generateFollowUpActions(result, context);
      
      // Create user-friendly message
      const userMessage = this.generateSuccessMessage(result, action);

      return {
        result,
        followUpActions,
        userMessage
      };

    } catch (error) {
      console.error('Content generation failed:', error);
      throw new Error(`Content generation failed: ${error.message}`);
    }
  }

  /**
   * Provide real-time template suggestions during conversation
   */
  async getRealtimeTemplateSuggestions(
    conversationContext: string[],
    currentProject: any
  ): Promise<{
    suggestions: TemplateRecommendation[];
    triggerPhrases: string[];
    contextualHints: string[];
  }> {
    // Analyze conversation for template triggers
    const triggerPhrases = this.extractTemplateTriggers(conversationContext);
    
    if (triggerPhrases.length === 0) {
      return {
        suggestions: [],
        triggerPhrases: [],
        contextualHints: []
      };
    }

    const projectContext = this.buildProjectContextFromProject(currentProject);
    
    // Get contextual template suggestions
    const suggestions = await this.getContextualTemplateSuggestions(
      triggerPhrases,
      projectContext
    );

    // Generate contextual hints
    const contextualHints = this.generateContextualHints(suggestions, projectContext);

    return {
      suggestions: suggestions.slice(0, 3), // Limit to top 3
      triggerPhrases,
      contextualHints
    };
  }

  /**
   * Handle template customization requests
   */
  async handleTemplateCustomization(
    templateId: string,
    customizationRequest: string,
    context: ThandoContext
  ): Promise<{
    customizedTemplate: SmartTemplate;
    customizationSummary: string;
    previewUrl?: string;
  }> {
    await templateEngine.initializeTemplateLibrary();
    
    // Parse customization request
    const customizations = this.parseCustomizationRequest(customizationRequest);
    
    // Apply customizations to template
    const baseTemplate = await templateEngine.getTemplate(templateId);
    if (!baseTemplate) {
      throw new Error(`Template not found: ${templateId}`);
    }

    const customizedTemplate = this.applyTemplateCustomizations(baseTemplate, customizations);
    
    // Generate summary
    const customizationSummary = this.generateCustomizationSummary(customizations);

    return {
      customizedTemplate,
      customizationSummary,
      previewUrl: `/api/templates/preview/${customizedTemplate.id}`
    };
  }

  /**
   * Auto-select best template for autonomous mode
   */
  async autoSelectTemplate(
    context: ThandoContext,
    workProductType?: WorkProductType
  ): Promise<{
    selectedTemplate: SmartTemplate;
    selectionReasoning: string;
    confidence: number;
    alternatives: TemplateRecommendation[];
  }> {
    const projectContext = this.buildProjectContext(context);
    
    // Infer work product type if not provided
    const inferredType = workProductType || this.inferWorkProductType(context);
    
    // Get template matches
    const templateMatches = await templateEngine.findOptimalTemplate(
      projectContext,
      inferredType,
      'autonomous'
    );

    if (templateMatches.length === 0) {
      throw new Error('No suitable templates found for autonomous selection');
    }

    const bestMatch = templateMatches[0];
    
    return {
      selectedTemplate: bestMatch.template,
      selectionReasoning: bestMatch.reasoning,
      confidence: bestMatch.relevanceScore,
      alternatives: templateMatches.slice(1, 4).map(match => ({
        template: match.template,
        relevanceScore: match.relevanceScore,
        reasoning: match.reasoning,
        estimatedTime: match.estimatedGeneration.timeMinutes,
        automationLevel: match.estimatedGeneration.automationLevel,
        customizationSuggestions: match.customizationSuggestions,
        actionable: true
      }))
    };
  }

  // Private helper methods

  private extractUserIntent(message: string): string {
    const intentKeywords = {
      'generate': ['generate', 'create', 'build', 'make', 'produce'],
      'analyze': ['analyze', 'review', 'assess', 'evaluate', 'examine'],
      'summarize': ['summarize', 'summary', 'overview', 'brief'],
      'report': ['report', 'document', 'memo', 'presentation'],
      'financial': ['financial', 'model', 'projections', 'valuation'],
      'risk': ['risk', 'assessment', 'mitigation', 'analysis'],
      'market': ['market', 'industry', 'competitive', 'landscape'],
      'due-diligence': ['due diligence', 'dd', 'diligence', 'investigation']
    };

    for (const [intent, keywords] of Object.entries(intentKeywords)) {
      if (keywords.some(keyword => message.toLowerCase().includes(keyword))) {
        return intent;
      }
    }

    return 'general';
  }

  private buildProjectContext(context: ThandoContext): ProjectContext {
    const activeProject = context.activeProjects[0]; // Use first active project
    
    return {
      projectId: activeProject?.id || '',
      projectName: activeProject?.name || 'Current Project',
      projectType: activeProject?.type || 'analysis',
      dealValue: activeProject?.metadata?.dealValue,
      sector: activeProject?.metadata?.sector,
      geography: activeProject?.metadata?.geography,
      stage: activeProject?.metadata?.stage,
      riskRating: activeProject?.metadata?.riskRating,
      teamSize: activeProject?.teamMembers?.length || 0,
      progress: activeProject?.progress || 0,
      deadline: activeProject?.deadline,
      metadata: activeProject?.metadata || {}
    };
  }

  private buildProjectContextFromProject(project: any): ProjectContext {
    return {
      projectId: project?.id || '',
      projectName: project?.name || 'Current Project',
      projectType: project?.type || 'analysis',
      dealValue: project?.metadata?.dealValue,
      sector: project?.metadata?.sector,
      geography: project?.metadata?.geography,
      stage: project?.metadata?.stage,
      riskRating: project?.metadata?.riskRating,
      teamSize: project?.teamSize || 0,
      progress: project?.progress || 0,
      deadline: project?.deadline,
      metadata: project?.metadata || {}
    };
  }

  private extractUserPreferences(context: ThandoContext): any {
    return {
      preferredTemplates: [],
      customizationLevel: 'moderate',
      outputFormat: ['PDF', 'DOCX'],
      qualityThreshold: context.userPreferences.preferredAnalysisDepth === 'detailed' ? 0.9 : 0.8
    };
  }

  private extractConstraints(context: ThandoContext): any {
    return {
      timeLimit: undefined,
      approvalRequired: context.userRole !== 'partner',
      dataRestrictions: []
    };
  }

  private async getTemplateRecommendations(
    context: TemplateSelectionContext
  ): Promise<TemplateRecommendation[]> {
    await templateEngine.initializeTemplateLibrary();
    
    const workProductType = this.inferWorkProductTypeFromIntent(context.userIntent);
    const templateMatches = await templateEngine.findOptimalTemplate(
      context.projectContext,
      workProductType,
      context.navigationMode
    );

    return templateMatches.map(match => ({
      template: match.template,
      relevanceScore: match.relevanceScore,
      reasoning: match.reasoning,
      estimatedTime: match.estimatedGeneration.timeMinutes,
      automationLevel: match.estimatedGeneration.automationLevel,
      customizationSuggestions: match.customizationSuggestions,
      actionable: match.relevanceScore > 0.5
    }));
  }

  private async generateContentActions(
    recommendations: TemplateRecommendation[],
    context: TemplateSelectionContext
  ): Promise<ContentGenerationAction[]> {
    return recommendations
      .filter(rec => rec.actionable)
      .slice(0, 3) // Limit to top 3
      .map(rec => ({
        id: `generate-${rec.template.id}`,
        name: `Generate ${rec.template.name}`,
        description: `Create ${rec.template.name} using AI-powered content generation`,
        category: 'reporting',
        inputSchema: {
          templateId: rec.template.id,
          customizations: rec.customizationSuggestions
        },
        estimatedDuration: `${rec.estimatedTime} minutes`,
        riskLevel: 'low',
        prerequisites: [],
        impacts: [`Generate professional ${rec.template.name}`, 'Save time with AI automation'],
        availability: {
          modules: ['workspace', 'due-diligence'],
          userRoles: ['analyst', 'associate', 'vice-president', 'partner'],
          conditions: []
        },
        templateId: rec.template.id,
        workProductType: rec.template.workProductType,
        estimatedGeneration: {
          timeMinutes: rec.estimatedTime,
          automationLevel: rec.automationLevel,
          qualityExpected: 0.85
        },
        requirements: {
          dataAccess: this.determineDataRequirements(rec.template),
          approvals: context.constraints.approvalRequired ? ['manager'] : [],
          customizations: {}
        }
      }));
  }

  private generateQuickActions(
    recommendations: TemplateRecommendation[],
    context: TemplateSelectionContext
  ): AIAction[] {
    if (context.navigationMode !== 'autonomous') {
      return [];
    }

    const topRecommendation = recommendations[0];
    if (!topRecommendation || topRecommendation.relevanceScore < 0.7) {
      return [];
    }

    return [{
      id: `quick-generate-${topRecommendation.template.id}`,
      name: `Quick Generate: ${topRecommendation.template.name}`,
      description: `Instantly generate ${topRecommendation.template.name} with optimal settings`,
      category: 'execution',
      inputSchema: {},
      estimatedDuration: 'Instant',
      riskLevel: 'low',
      prerequisites: [],
      impacts: ['Generate document immediately', 'Use AI-optimized template'],
      availability: {
        modules: ['workspace'],
        userRoles: ['vice-president', 'partner'],
        conditions: ['autonomous-mode']
      }
    }];
  }

  private calculateIntentConfidence(
    intent: string,
    recommendations: TemplateRecommendation[]
  ): number {
    if (intent === 'general') return 0.3;
    if (recommendations.length === 0) return 0.2;
    
    const bestScore = Math.max(...recommendations.map(r => r.relevanceScore));
    return Math.min(0.95, 0.5 + (bestScore * 0.5));
  }

  private generateFollowUpActions(
    result: ContentGenerationResult,
    context: ThandoContext
  ): AIAction[] {
    const actions: AIAction[] = [];

    // Review action
    actions.push({
      id: `review-${result.workProduct.id}`,
      name: 'Review Generated Document',
      description: 'Review and edit the generated document',
      category: 'communication',
      inputSchema: {},
      estimatedDuration: '10-15 minutes',
      riskLevel: 'low',
      prerequisites: [],
      impacts: ['Ensure document quality', 'Make final adjustments'],
      availability: {
        modules: ['workspace'],
        userRoles: ['analyst', 'associate', 'vice-president', 'partner']
      }
    });

    // Export action
    actions.push({
      id: `export-${result.workProduct.id}`,
      name: 'Export Document',
      description: 'Export document to PDF, DOCX, or other formats',
      category: 'execution',
      inputSchema: {},
      estimatedDuration: '1-2 minutes',
      riskLevel: 'low',
      prerequisites: [],
      impacts: ['Create shareable document', 'Professional formatting'],
      availability: {
        modules: ['workspace'],
        userRoles: ['analyst', 'associate', 'vice-president', 'partner']
      }
    });

    // Share action if quality is good
    if (result.generationMetrics.qualityScore > 0.8) {
      actions.push({
        id: `share-${result.workProduct.id}`,
        name: 'Share with Team',
        description: 'Share the document with team members for collaboration',
        category: 'communication',
        inputSchema: {},
        estimatedDuration: '2-3 minutes',
        riskLevel: 'low',
        prerequisites: [],
        impacts: ['Enable team collaboration', 'Get feedback'],
        availability: {
          modules: ['workspace'],
          userRoles: ['associate', 'vice-president', 'partner']
        }
      });
    }

    return actions;
  }

  private generateSuccessMessage(
    result: ContentGenerationResult,
    action: ContentGenerationAction
  ): string {
    const metrics = result.generationMetrics;
    const quality = metrics.qualityScore > 0.85 ? 'high-quality' : 'good-quality';
    const automation = Math.round(metrics.automationLevel * 100);

    return `✅ **${action.name} Complete!**

**Document Generated:** ${result.workProduct.title}
**Quality Score:** ${Math.round(metrics.qualityScore * 100)}% (${quality})
**Automation Level:** ${automation}%
**Generation Time:** ${Math.round(metrics.generationTime / 1000)}s
**Sections Generated:** ${metrics.generatedSections}/${metrics.totalSections}

${metrics.validationsFailed > 0 ? 
  `⚠️ **${metrics.validationsFailed} validation(s) need attention**` : 
  '✅ **All validations passed**'
}

The document is ready for review and can be exported to your preferred format.`;
  }

  private extractTemplateTriggers(conversationContext: string[]): string[] {
    const triggers = [];
    const triggerPhrases = [
      'generate report', 'create memo', 'due diligence', 'investment summary',
      'financial analysis', 'risk assessment', 'market analysis', 'executive summary'
    ];

    for (const message of conversationContext) {
      for (const phrase of triggerPhrases) {
        if (message.toLowerCase().includes(phrase)) {
          triggers.push(phrase);
        }
      }
    }

    return [...new Set(triggers)]; // Remove duplicates
  }

  private async getContextualTemplateSuggestions(
    triggerPhrases: string[],
    projectContext: ProjectContext
  ): Promise<TemplateRecommendation[]> {
    const suggestions: TemplateRecommendation[] = [];

    for (const phrase of triggerPhrases) {
      const workProductType = this.mapPhraseToWorkProductType(phrase);
      const templateMatches = await templateEngine.findOptimalTemplate(
        projectContext,
        workProductType,
        'assisted'
      );

      if (templateMatches.length > 0) {
        const match = templateMatches[0];
        suggestions.push({
          template: match.template,
          relevanceScore: match.relevanceScore,
          reasoning: `Suggested for: "${phrase}"`,
          estimatedTime: match.estimatedGeneration.timeMinutes,
          automationLevel: match.estimatedGeneration.automationLevel,
          customizationSuggestions: match.customizationSuggestions,
          actionable: true
        });
      }
    }

    return suggestions;
  }

  private generateContextualHints(
    suggestions: TemplateRecommendation[],
    projectContext: ProjectContext
  ): string[] {
    const hints = [];

    if (suggestions.length > 0) {
      hints.push(`💡 I can help generate ${suggestions[0].template.name} for ${projectContext.projectName}`);
    }

    if (projectContext.sector) {
      hints.push(`📊 I have ${projectContext.sector}-specific templates available`);
    }

    if (projectContext.dealValue && projectContext.dealValue > 100000000) {
      hints.push(`💰 Large deal templates available for $${Math.round(projectContext.dealValue / 1000000)}M+ transactions`);
    }

    return hints;
  }

  private parseCustomizationRequest(request: string): Record<string, any> {
    // Parse natural language customization request
    const customizations: Record<string, any> = {};

    if (request.includes('shorter') || request.includes('concise')) {
      customizations.length = 'concise';
    }
    if (request.includes('detailed') || request.includes('comprehensive')) {
      customizations.length = 'detailed';
    }
    if (request.includes('formal')) {
      customizations.tone = 'formal';
    }
    if (request.includes('charts') || request.includes('graphs')) {
      customizations.includeCharts = true;
    }

    return customizations;
  }

  private applyTemplateCustomizations(
    template: SmartTemplate,
    customizations: Record<string, any>
  ): SmartTemplate {
    const customizedTemplate = { ...template };
    customizedTemplate.id = `${template.id}-custom-${Date.now()}`;
    customizedTemplate.name = `${template.name} (Customized)`;

    // Apply customizations to template structure
    if (customizations.length === 'concise') {
      customizedTemplate.sections = customizedTemplate.sections.filter(s => s.required);
    }

    return customizedTemplate;
  }

  private generateCustomizationSummary(customizations: Record<string, any>): string {
    const changes = Object.entries(customizations).map(([key, value]) => 
      `${key}: ${value}`
    );
    return `Applied customizations: ${changes.join(', ')}`;
  }

  private inferWorkProductType(context: ThandoContext): WorkProductType {
    const activeProject = context.activeProjects[0];
    
    if (activeProject?.type === 'due-diligence') {
      return 'DD_REPORT';
    } else if (activeProject?.metadata?.stage === 'investment-committee') {
      return 'IC_MEMO';
    } else {
      return 'INVESTMENT_SUMMARY';
    }
  }

  private inferWorkProductTypeFromIntent(intent: string): WorkProductType {
    const intentMap: Record<string, WorkProductType> = {
      'due-diligence': 'DD_REPORT',
      'financial': 'FINANCIAL_MODEL',
      'risk': 'RISK_ASSESSMENT',
      'market': 'MARKET_ANALYSIS',
      'report': 'DD_REPORT',
      'analyze': 'MARKET_ANALYSIS'
    };

    return intentMap[intent] || 'INVESTMENT_SUMMARY';
  }

  private mapPhraseToWorkProductType(phrase: string): WorkProductType {
    if (phrase.includes('due diligence')) return 'DD_REPORT';
    if (phrase.includes('memo')) return 'IC_MEMO';
    if (phrase.includes('financial')) return 'FINANCIAL_MODEL';
    if (phrase.includes('risk')) return 'RISK_ASSESSMENT';
    if (phrase.includes('market')) return 'MARKET_ANALYSIS';
    return 'INVESTMENT_SUMMARY';
  }

  private determineDataRequirements(template: SmartTemplate): string[] {
    const requirements = [];
    
    if (template.sections.some(s => s.type === 'financial_block')) {
      requirements.push('financial-data');
    }
    if (template.category === 'due-diligence') {
      requirements.push('deal-metrics', 'company-data');
    }
    if (template.category === 'market-research') {
      requirements.push('market-data', 'competitive-data');
    }

    return requirements;
  }
}

export const templateOrchestrator = TemplateOrchestrator.getInstance();