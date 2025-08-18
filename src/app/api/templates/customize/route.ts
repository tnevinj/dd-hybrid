import { NextRequest, NextResponse } from 'next/server';
import { 
  SmartTemplate,
  TemplateSection,
  TemplateField
} from '@/types/work-product';
import { templateEngine } from '@/lib/services/template-engine';
import { templateOrchestrator } from '@/lib/services/template-orchestrator';

// POST /api/templates/customize
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      templateId,
      customizations,
      customizationRequest,
      projectContext,
      saveAsNew = true,
      name
    } = body;

    // Validate required fields
    if (!templateId) {
      return NextResponse.json(
        { 
          error: 'Missing required field: templateId is required',
          success: false 
        },
        { status: 400 }
      );
    }

    console.log(`Customizing template ${templateId} with ${Object.keys(customizations || {}).length} customizations`);

    await templateEngine.initializeTemplateLibrary();
    
    let customizedTemplate: SmartTemplate;

    if (customizationRequest) {
      // Natural language customization
      const mockThandoContext = this.buildMockThandoContext(projectContext);
      const result = await templateOrchestrator.handleTemplateCustomization(
        templateId,
        customizationRequest,
        mockThandoContext
      );
      customizedTemplate = result.customizedTemplate;
    } else if (customizations) {
      // Direct customization object
      customizedTemplate = await this.applyDirectCustomizations(templateId, customizations, name);
    } else {
      return NextResponse.json(
        { 
          error: 'Either customizations object or customizationRequest string is required',
          success: false 
        },
        { status: 400 }
      );
    }

    // Generate customization analysis
    const analysis = this.analyzeCustomizations(customizedTemplate, customizations || {});

    // Validate customized template
    const validation = await this.validateCustomizedTemplate(customizedTemplate);

    const response = {
      customizedTemplate,
      customizationAnalysis: analysis,
      validation,
      previewUrl: `/api/templates/preview/${customizedTemplate.id}`,
      metadata: {
        originalTemplateId: templateId,
        customizationTimestamp: new Date().toISOString(),
        customizationType: customizationRequest ? 'natural-language' : 'direct',
        saveAsNew
      }
    };

    console.log(`Template customization completed. New template ID: ${customizedTemplate.id}`);

    return NextResponse.json({
      data: response,
      success: true,
      message: `Successfully customized template: ${customizedTemplate.name}`
    });

  } catch (error) {
    console.error('Template customization API error:', error);
    
    return NextResponse.json(
      { 
        error: error.message || 'Template customization failed',
        success: false,
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

// GET /api/templates/customize - Get customization options for a template
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const templateId = searchParams.get('templateId');

    if (!templateId) {
      return NextResponse.json(
        { 
          error: 'templateId parameter is required',
          success: false 
        },
        { status: 400 }
      );
    }

    await templateEngine.initializeTemplateLibrary();
    
    // Get template details
    const template = await templateEngine.getTemplate(templateId);
    if (!template) {
      return NextResponse.json(
        { 
          error: `Template not found: ${templateId}`,
          success: false 
        },
        { status: 404 }
      );
    }

    // Generate customization options
    const customizationOptions = {
      structuralCustomizations: {
        sections: {
          description: 'Add, remove, or modify template sections',
          options: [
            { type: 'add', description: 'Add new sections' },
            { type: 'remove', description: 'Remove optional sections' },
            { type: 'reorder', description: 'Change section order' },
            { type: 'modify', description: 'Edit section properties' }
          ],
          currentSections: template.sections.map(section => ({
            id: section.id,
            title: section.title,
            required: section.required,
            type: section.type,
            customizable: !section.required
          }))
        },
        fields: {
          description: 'Customize dynamic fields and inputs',
          options: [
            { type: 'add', description: 'Add custom fields' },
            { type: 'modify', description: 'Edit field properties' },
            { type: 'remove', description: 'Remove optional fields' }
          ],
          currentFields: template.dynamicFields.map(field => ({
            id: field.id,
            name: field.name,
            type: field.type,
            required: field.required,
            customizable: !field.required
          }))
        }
      },
      contentCustomizations: {
        tone: {
          description: 'Adjust content tone and style',
          options: ['formal', 'professional', 'conversational'],
          current: 'professional'
        },
        length: {
          description: 'Control content length and detail',
          options: ['concise', 'standard', 'detailed'],
          current: 'standard'
        },
        industry: {
          description: 'Industry-specific terminology and focus',
          options: ['technology', 'healthcare', 'financial-services', 'manufacturing', 'retail'],
          current: template.industryFocus
        },
        audience: {
          description: 'Target audience optimization',
          options: ['executives', 'analysts', 'legal', 'technical'],
          current: 'executives'
        }
      },
      aiCustomizations: {
        generationStrategy: {
          description: 'AI content generation approach',
          options: [
            { value: 'ai-generated', description: 'Fully AI-generated content' },
            { value: 'data-driven', description: 'Data-focused content' },
            { value: 'hybrid', description: 'AI + data combination' },
            { value: 'static', description: 'Template-based content' }
          ]
        },
        prompts: {
          description: 'Customize AI generation prompts',
          customizable: template.sections.filter(s => s.aiPrompt).map(s => ({
            sectionId: s.id,
            sectionTitle: s.title,
            currentPrompt: s.aiPrompt,
            editable: true
          }))
        },
        dataBindings: {
          description: 'Configure data source integrations',
          available: ['deal-metrics', 'financial-model', 'risk-assessment', 'market-data', 'team-data']
        }
      },
      validationCustomizations: {
        rules: {
          description: 'Content validation and quality rules',
          options: [
            { type: 'completeness', description: 'Content completeness validation' },
            { type: 'accuracy', description: 'Data accuracy validation' },
            { type: 'consistency', description: 'Style consistency validation' },
            { type: 'compliance', description: 'Regulatory compliance validation' },
            { type: 'readability', description: 'Readability and clarity validation' }
          ]
        },
        thresholds: {
          description: 'Quality score thresholds and requirements',
          configurable: ['qualityScore', 'readabilityScore', 'completenessScore']
        }
      }
    };

    const naturalLanguageExamples = [
      'Make the content more concise and executive-focused',
      'Add more detailed financial analysis sections',
      'Include industry-specific terminology for healthcare',
      'Focus on risk assessment and mitigation strategies',
      'Optimize for investment committee presentation',
      'Add competitive analysis and market positioning',
      'Include ESG considerations and impact assessment',
      'Emphasize technology and digital transformation aspects'
    ];

    return NextResponse.json({
      data: {
        template: {
          id: template.id,
          name: template.name,
          description: template.description,
          category: template.category,
          industryFocus: template.industryFocus,
          workProductType: template.workProductType
        },
        customizationOptions,
        naturalLanguageExamples,
        customizationCapabilities: {
          structuralFlexibility: 'high',
          contentAdaptability: 'advanced',
          aiIntegration: 'comprehensive',
          validationCustomization: 'extensive'
        }
      },
      success: true
    });

  } catch (error) {
    console.error('Template customization options API error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to retrieve customization options',
        success: false 
      },
      { status: 500 }
    );
  }
}

// Helper functions
function buildMockThandoContext(projectContext?: any): any {
  return {
    currentModule: 'workspace' as const,
    currentPage: '/workspace',
    navigationMode: 'assisted' as const,
    userId: 'api-user',
    userRole: 'associate' as const,
    userPreferences: {
      preferredAnalysisDepth: 'detailed' as const,
      communicationStyle: 'professional' as const,
      defaultTimeframe: '1Y' as const,
      focusAreas: [projectContext?.sector || 'technology'],
      notificationFrequency: 'daily' as const,
      preferredChartTypes: ['line', 'bar'],
      riskTolerance: 'medium' as const
    },
    activeProjects: projectContext ? [{
      id: projectContext.projectId,
      name: projectContext.projectName,
      type: projectContext.projectType,
      status: 'active' as const,
      priority: 'medium' as const,
      progress: projectContext.progress || 50,
      teamMembers: [],
      lastActivity: new Date(),
      metadata: projectContext.metadata || {}
    }] : [],
    activeDeals: [],
    portfolioMetrics: {
      totalAUM: 0, totalValue: 0, netIRR: 0, grossIRR: 0,
      totalValueMultiple: 0, distributionsToDate: 0, unrealizedValue: 0,
      cashFlow: { quarterlyDistributions: 0, quarterlyContributions: 0, netCashFlow: 0 },
      performance: { ytdReturn: 0, quarterlyReturn: 0, benchmarkComparison: 0 }
    },
    recentActivity: [],
    conversationHistory: [],
    availableActions: [],
    currentCapabilities: {
      proactiveInsights: true, automaticAnalysis: true, smartSuggestions: true,
      contextualRecommendations: true, realTimeAlerts: true, documentAnalysis: true, functionCalling: true
    },
    platformData: {
      totalPortfolios: 0, totalDeals: 0, teamSize: 0, lastLogin: new Date(),
      systemAlerts: [], marketConditions: { sentiment: 'neutral' as const, volatilityIndex: 0, keyTrends: [] }
    },
    timeContext: {
      currentQuarter: 'Q4 2024', fiscalYearEnd: new Date(),
      lastReportingDate: new Date(), upcomingDeadlines: []
    }
  };
}

async function applyDirectCustomizations(
  templateId: string, 
  customizations: any, 
  name?: string
): Promise<SmartTemplate> {
  const originalTemplate = await templateEngine.getTemplate(templateId);
  if (!originalTemplate) {
    throw new Error(`Template not found: ${templateId}`);
  }

  const customizedTemplate: SmartTemplate = {
    ...originalTemplate,
    id: `${templateId}-custom-${Date.now()}`,
    name: name || `${originalTemplate.name} (Customized)`,
    version: `${originalTemplate.version}-custom`,
    updatedAt: new Date(),
    usageCount: 0
  };

  // Apply structural customizations
  if (customizations.sections) {
    customizedTemplate.sections = this.applySectionCustomizations(
      originalTemplate.sections, 
      customizations.sections
    );
  }

  // Apply field customizations
  if (customizations.fields) {
    customizedTemplate.dynamicFields = this.applyFieldCustomizations(
      originalTemplate.dynamicFields, 
      customizations.fields
    );
  }

  // Apply content customizations
  if (customizations.content) {
    this.applyContentCustomizations(customizedTemplate, customizations.content);
  }

  // Apply AI customizations
  if (customizations.ai) {
    this.applyAICustomizations(customizedTemplate, customizations.ai);
  }

  return customizedTemplate;
}

function applySectionCustomizations(
  originalSections: TemplateSection[], 
  sectionCustomizations: any
): TemplateSection[] {
  let sections = [...originalSections];

  // Add new sections
  if (sectionCustomizations.add) {
    sectionCustomizations.add.forEach((newSection: any) => {
      sections.push({
        id: `custom-section-${Date.now()}-${Math.random()}`,
        title: newSection.title,
        description: newSection.description,
        order: sections.length + 1,
        required: newSection.required || false,
        type: newSection.type || 'text',
        generationStrategy: newSection.generationStrategy || 'static',
        dataBindings: [],
        validationRules: [],
        dependencies: []
      });
    });
  }

  // Remove sections
  if (sectionCustomizations.remove) {
    sections = sections.filter(section => 
      !sectionCustomizations.remove.includes(section.id) && section.required
    );
  }

  // Modify sections
  if (sectionCustomizations.modify) {
    sections = sections.map(section => {
      const modification = sectionCustomizations.modify[section.id];
      return modification ? { ...section, ...modification } : section;
    });
  }

  // Reorder sections
  if (sectionCustomizations.reorder) {
    sections.sort((a, b) => {
      const aOrder = sectionCustomizations.reorder[a.id] || a.order;
      const bOrder = sectionCustomizations.reorder[b.id] || b.order;
      return aOrder - bOrder;
    });
  }

  return sections;
}

function applyFieldCustomizations(
  originalFields: TemplateField[], 
  fieldCustomizations: any
): TemplateField[] {
  let fields = [...originalFields];

  // Add new fields
  if (fieldCustomizations.add) {
    fieldCustomizations.add.forEach((newField: any) => {
      fields.push({
        id: `custom-field-${Date.now()}-${Math.random()}`,
        name: newField.name,
        type: newField.type,
        required: newField.required || false,
        defaultValue: newField.defaultValue,
        options: newField.options,
        description: newField.description,
        placeholder: newField.placeholder
      });
    });
  }

  // Remove fields
  if (fieldCustomizations.remove) {
    fields = fields.filter(field => 
      !fieldCustomizations.remove.includes(field.id) && field.required
    );
  }

  // Modify fields
  if (fieldCustomizations.modify) {
    fields = fields.map(field => {
      const modification = fieldCustomizations.modify[field.id];
      return modification ? { ...field, ...modification } : field;
    });
  }

  return fields;
}

function applyContentCustomizations(template: SmartTemplate, contentCustomizations: any): void {
  if (contentCustomizations.tone) {
    // Update AI prompts to reflect tone
    template.sections.forEach(section => {
      if (section.aiPrompt) {
        section.aiPrompt = this.adjustPromptForTone(section.aiPrompt, contentCustomizations.tone);
      }
    });
  }

  if (contentCustomizations.length) {
    // Adjust section length expectations
    template.sections.forEach(section => {
      if (section.estimatedLength) {
        const multiplier = contentCustomizations.length === 'concise' ? 0.7 : 
                          contentCustomizations.length === 'detailed' ? 1.5 : 1.0;
        section.estimatedLength = Math.round(section.estimatedLength * multiplier);
      }
    });
  }

  if (contentCustomizations.industry) {
    template.industryFocus = [contentCustomizations.industry];
  }
}

function applyAICustomizations(template: SmartTemplate, aiCustomizations: any): void {
  if (aiCustomizations.generationStrategy) {
    template.sections.forEach(section => {
      section.generationStrategy = aiCustomizations.generationStrategy;
    });
  }

  if (aiCustomizations.prompts) {
    template.sections.forEach(section => {
      const customPrompt = aiCustomizations.prompts[section.id];
      if (customPrompt) {
        section.aiPrompt = customPrompt;
      }
    });
  }

  if (aiCustomizations.dataBindings) {
    // Add new data bindings to sections
    template.sections.forEach(section => {
      const sectionBindings = aiCustomizations.dataBindings[section.id];
      if (sectionBindings) {
        section.dataBindings.push(...sectionBindings);
      }
    });
  }
}

function adjustPromptForTone(prompt: string, tone: string): string {
  const toneAdjustments = {
    formal: 'Use formal, academic language with precise terminology.',
    professional: 'Use professional business language appropriate for executives.',
    conversational: 'Use clear, approachable language that is easy to understand.'
  };

  const adjustment = toneAdjustments[tone as keyof typeof toneAdjustments];
  return adjustment ? `${prompt} ${adjustment}` : prompt;
}

function analyzeCustomizations(template: SmartTemplate, customizations: any): any {
  return {
    structuralChanges: {
      sectionsModified: Object.keys(customizations.sections?.modify || {}).length,
      sectionsAdded: (customizations.sections?.add || []).length,
      sectionsRemoved: (customizations.sections?.remove || []).length,
      fieldsModified: Object.keys(customizations.fields?.modify || {}).length,
      fieldsAdded: (customizations.fields?.add || []).length,
      fieldsRemoved: (customizations.fields?.remove || []).length
    },
    contentChanges: {
      toneAdjusted: !!customizations.content?.tone,
      lengthAdjusted: !!customizations.content?.length,
      industryFocusChanged: !!customizations.content?.industry,
      audienceOptimized: !!customizations.content?.audience
    },
    aiChanges: {
      generationStrategyChanged: !!customizations.ai?.generationStrategy,
      promptsCustomized: Object.keys(customizations.ai?.prompts || {}).length,
      dataBindingsAdded: Object.keys(customizations.ai?.dataBindings || {}).length
    },
    impactAssessment: {
      complexityChange: this.assessComplexityChange(customizations),
      estimatedTimeChange: this.assessTimeChange(customizations),
      qualityImpact: this.assessQualityImpact(customizations)
    }
  };
}

function assessComplexityChange(customizations: any): string {
  const addedSections = (customizations.sections?.add || []).length;
  const addedFields = (customizations.fields?.add || []).length;
  
  if (addedSections > 2 || addedFields > 3) return 'increased';
  if (customizations.sections?.remove?.length > 1) return 'decreased';
  return 'unchanged';
}

function assessTimeChange(customizations: any): string {
  if (customizations.content?.length === 'detailed') return '+20-30%';
  if (customizations.content?.length === 'concise') return '-15-25%';
  if ((customizations.sections?.add || []).length > 1) return '+10-20%';
  return 'minimal change';
}

function assessQualityImpact(customizations: any): string {
  if (customizations.ai?.generationStrategy === 'hybrid') return 'improved';
  if (customizations.content?.industry) return 'improved';
  if (customizations.sections?.remove?.length > 2) return 'potentially reduced';
  return 'maintained';
}

async function validateCustomizedTemplate(template: SmartTemplate): Promise<any> {
  const validation = {
    structural: {
      valid: true,
      issues: [] as string[],
      warnings: [] as string[]
    },
    content: {
      valid: true,
      issues: [] as string[],
      warnings: [] as string[]
    },
    ai: {
      valid: true,
      issues: [] as string[],
      warnings: [] as string[]
    },
    overall: {
      valid: true,
      score: 0
    }
  };

  // Structural validation
  if (template.sections.length === 0) {
    validation.structural.valid = false;
    validation.structural.issues.push('Template must have at least one section');
  }

  const requiredSections = template.sections.filter(s => s.required);
  if (requiredSections.length === 0) {
    validation.structural.warnings.push('Template has no required sections');
  }

  // Content validation
  const sectionsWithoutPrompts = template.sections.filter(s => 
    s.generationStrategy === 'ai-generated' && !s.aiPrompt
  );
  if (sectionsWithoutPrompts.length > 0) {
    validation.content.issues.push(`${sectionsWithoutPrompts.length} AI-generated sections missing prompts`);
    validation.content.valid = false;
  }

  // AI validation
  const inconsistentStrategies = template.sections.filter(s => 
    s.generationStrategy === 'data-driven' && s.dataBindings.length === 0
  );
  if (inconsistentStrategies.length > 0) {
    validation.ai.warnings.push(`${inconsistentStrategies.length} data-driven sections without data bindings`);
  }

  // Overall validation
  validation.overall.valid = validation.structural.valid && validation.content.valid && validation.ai.valid;
  validation.overall.score = validation.overall.valid ? 
    (validation.structural.warnings.length + validation.content.warnings.length + validation.ai.warnings.length === 0 ? 1.0 : 0.8) : 0.5;

  return validation;
}