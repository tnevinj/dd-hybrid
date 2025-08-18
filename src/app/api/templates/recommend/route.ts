import { NextRequest, NextResponse } from 'next/server';
import { 
  ProjectContext,
  WorkProductType
} from '@/types/work-product';
import { templateEngine } from '@/lib/services/template-engine';
import { templateOrchestrator } from '@/lib/services/template-orchestrator';

// POST /api/templates/recommend
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      projectContext,
      workProductType,
      userIntent,
      navigationMode = 'assisted',
      preferences = {}
    } = body;

    // Validate required fields
    if (!projectContext) {
      return NextResponse.json(
        { 
          error: 'Missing required field: projectContext is required',
          success: false 
        },
        { status: 400 }
      );
    }

    console.log(`Getting template recommendations for ${projectContext.projectName} (${workProductType || 'auto-detect'})`);

    let recommendations;

    if (userIntent) {
      // Use orchestrator for intent-based recommendations
      const mockThandoContext = this.buildMockThandoContext(projectContext, navigationMode, preferences);
      const intentAnalysis = await templateOrchestrator.analyzeUserIntent(userIntent, mockThandoContext);
      
      recommendations = {
        recommendations: intentAnalysis.templateRecommendations,
        suggestedActions: intentAnalysis.suggestedActions,
        quickActions: intentAnalysis.quickActions,
        confidence: intentAnalysis.confidence,
        analysisType: 'intent-based'
      };
    } else {
      // Use template engine for context-based recommendations
      await templateEngine.initializeTemplateLibrary();
      
      const inferredWorkProductType = workProductType || this.inferWorkProductType(projectContext);
      const templateMatches = await templateEngine.findOptimalTemplate(
        projectContext,
        inferredWorkProductType,
        navigationMode
      );

      recommendations = {
        recommendations: templateMatches.map(match => ({
          template: match.template,
          relevanceScore: match.relevanceScore,
          reasoning: match.reasoning,
          estimatedTime: match.estimatedGeneration.timeMinutes,
          automationLevel: match.estimatedGeneration.automationLevel,
          customizationSuggestions: match.customizationSuggestions,
          actionable: match.relevanceScore > 0.5
        })),
        suggestedActions: [],
        quickActions: [],
        confidence: templateMatches.length > 0 ? Math.max(...templateMatches.map(m => m.relevanceScore)) : 0,
        analysisType: 'context-based'
      };
    }

    // Add metadata and insights
    const response = {
      ...recommendations,
      metadata: {
        projectId: projectContext.projectId,
        projectName: projectContext.projectName,
        inferredWorkProductType: workProductType || this.inferWorkProductType(projectContext),
        analysisTimestamp: new Date().toISOString(),
        navigationMode,
        totalRecommendations: recommendations.recommendations.length
      },
      insights: this.generateRecommendationInsights(recommendations.recommendations, projectContext),
      nextSteps: this.generateNextSteps(recommendations.recommendations, navigationMode)
    };

    console.log(`Generated ${recommendations.recommendations.length} template recommendations`);

    return NextResponse.json({
      data: response,
      success: true,
      message: `Found ${recommendations.recommendations.length} relevant templates`
    });

  } catch (error) {
    console.error('Template recommendation API error:', error);
    
    return NextResponse.json(
      { 
        error: error.message || 'Template recommendation failed',
        success: false,
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

// GET /api/templates/recommend - Get recommendation capabilities and options
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const mode = searchParams.get('mode') || 'assisted';

    const capabilities = {
      traditional: {
        analysisDepth: 'basic',
        templateLibrary: 'standard',
        customization: false,
        intentAnalysis: false,
        realTimeUpdates: false,
        maxRecommendations: 3
      },
      assisted: {
        analysisDepth: 'advanced',
        templateLibrary: 'full',
        customization: true,
        intentAnalysis: true,
        realTimeUpdates: false,
        aiOptimization: true,
        maxRecommendations: 6
      },
      autonomous: {
        analysisDepth: 'comprehensive',
        templateLibrary: 'full',
        customization: true,
        intentAnalysis: true,
        realTimeUpdates: true,
        aiOptimization: true,
        autoSelection: true,
        dynamicTemplateCreation: true,
        maxRecommendations: 10
      }
    };

    const supportedWorkProductTypes = [
      {
        type: 'DD_REPORT',
        name: 'Due Diligence Report',
        description: 'Comprehensive analysis report with executive summary, financial review, and risk assessment',
        avgGenerationTime: '15-25 minutes',
        complexity: 'high',
        recommendedFor: ['due-diligence', 'investment-analysis']
      },
      {
        type: 'IC_MEMO',
        name: 'Investment Committee Memo',
        description: 'Formal investment recommendation for committee review and decision',
        avgGenerationTime: '8-12 minutes',
        complexity: 'medium',
        recommendedFor: ['investment-committee', 'decision-making']
      },
      {
        type: 'INVESTMENT_SUMMARY',
        name: 'Investment Summary',
        description: 'Executive-level summary of investment opportunity and key metrics',
        avgGenerationTime: '5-8 minutes',
        complexity: 'low',
        recommendedFor: ['executive-briefing', 'initial-review']
      },
      {
        type: 'MARKET_ANALYSIS',
        name: 'Market Analysis',
        description: 'Detailed market sizing, competitive landscape, and growth projections',
        avgGenerationTime: '10-15 minutes',
        complexity: 'medium',
        recommendedFor: ['market-research', 'strategic-planning']
      },
      {
        type: 'RISK_ASSESSMENT',
        name: 'Risk Assessment',
        description: 'Comprehensive risk analysis with mitigation strategies and impact assessment',
        avgGenerationTime: '12-18 minutes',
        complexity: 'medium',
        recommendedFor: ['risk-management', 'compliance']
      },
      {
        type: 'FINANCIAL_MODEL',
        name: 'Financial Model',
        description: 'Interactive financial projections with scenarios and sensitivity analysis',
        avgGenerationTime: '20-30 minutes',
        complexity: 'high',
        recommendedFor: ['financial-analysis', 'valuation']
      }
    ];

    const recommendationFactors = {
      projectContext: {
        sector: 'Industry alignment and specialized templates',
        dealValue: 'Deal size appropriate templates and complexity',
        stage: 'Investment stage specific requirements',
        geography: 'Regional compliance and market considerations',
        riskRating: 'Risk-appropriate templates and analysis depth'
      },
      userPreferences: {
        analysisDepth: 'Detailed vs summary-focused templates',
        outputFormat: 'Format-optimized template selection',
        customizationLevel: 'Template flexibility and modification options',
        timeline: 'Time-appropriate template complexity'
      },
      templateCharacteristics: {
        successRate: 'Historical template performance and outcomes',
        usageCount: 'Popular and proven template selection',
        industryFocus: 'Industry-specific template optimization',
        automationLevel: 'AI generation capability matching'
      }
    };

    return NextResponse.json({
      data: {
        capabilities: capabilities[mode as keyof typeof capabilities] || capabilities.assisted,
        supportedWorkProductTypes,
        recommendationFactors,
        intentKeywords: {
          'generate': ['generate', 'create', 'build', 'make', 'produce'],
          'analyze': ['analyze', 'review', 'assess', 'evaluate', 'examine'],
          'summarize': ['summarize', 'summary', 'overview', 'brief'],
          'report': ['report', 'document', 'memo', 'presentation'],
          'financial': ['financial', 'model', 'projections', 'valuation'],
          'risk': ['risk', 'assessment', 'mitigation', 'analysis'],
          'market': ['market', 'industry', 'competitive', 'landscape'],
          'due-diligence': ['due diligence', 'dd', 'diligence', 'investigation']
        }
      },
      success: true
    });

  } catch (error) {
    console.error('Template recommendation options API error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to retrieve recommendation options',
        success: false 
      },
      { status: 500 }
    );
  }
}

// Helper functions
function buildMockThandoContext(projectContext: ProjectContext, navigationMode: string, preferences: any): any {
  return {
    currentModule: 'workspace' as const,
    currentPage: '/workspace',
    navigationMode,
    userId: 'api-user',
    userRole: 'associate' as const,
    userPreferences: {
      preferredAnalysisDepth: preferences.analysisDepth || 'detailed' as const,
      communicationStyle: preferences.communicationStyle || 'professional' as const,
      defaultTimeframe: '1Y' as const,
      focusAreas: [projectContext.sector || 'technology'],
      notificationFrequency: 'daily' as const,
      preferredChartTypes: preferences.chartTypes || ['line', 'bar'],
      riskTolerance: preferences.riskTolerance || 'medium' as const
    },
    activeProjects: [{
      id: projectContext.projectId,
      name: projectContext.projectName,
      type: projectContext.projectType as any,
      status: 'active' as const,
      priority: 'medium' as const,
      progress: projectContext.progress || 50,
      teamMembers: [],
      lastActivity: new Date(),
      metadata: projectContext.metadata || {}
    }],
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

function inferWorkProductType(projectContext: ProjectContext): WorkProductType {
  if (projectContext.projectType === 'due-diligence') {
    return 'DD_REPORT';
  } else if (projectContext.stage === 'investment-committee') {
    return 'IC_MEMO';
  } else if (projectContext.projectType === 'market-research') {
    return 'MARKET_ANALYSIS';
  } else if (projectContext.projectType === 'risk-assessment') {
    return 'RISK_ASSESSMENT';
  } else if (projectContext.projectType === 'financial-analysis') {
    return 'FINANCIAL_MODEL';
  } else {
    return 'INVESTMENT_SUMMARY';
  }
}

function generateRecommendationInsights(recommendations: any[], projectContext: ProjectContext): any {
  const insights = {
    totalRecommendations: recommendations.length,
    highConfidenceRecommendations: recommendations.filter(r => r.relevanceScore > 0.8).length,
    averageRelevanceScore: recommendations.length > 0 
      ? recommendations.reduce((sum, r) => sum + r.relevanceScore, 0) / recommendations.length 
      : 0,
    industrySpecificRecommendations: recommendations.filter(r => 
      r.template.industryFocus.includes(projectContext.sector?.toLowerCase() || '')
    ).length,
    estimatedTimeRange: {
      min: Math.min(...recommendations.map(r => r.estimatedTime)),
      max: Math.max(...recommendations.map(r => r.estimatedTime)),
      average: recommendations.length > 0 
        ? Math.round(recommendations.reduce((sum, r) => sum + r.estimatedTime, 0) / recommendations.length)
        : 0
    },
    automationLevels: {
      high: recommendations.filter(r => r.automationLevel > 0.8).length,
      medium: recommendations.filter(r => r.automationLevel > 0.5 && r.automationLevel <= 0.8).length,
      low: recommendations.filter(r => r.automationLevel <= 0.5).length
    }
  };

  return insights;
}

function generateNextSteps(recommendations: any[], navigationMode: string): string[] {
  const steps = [];

  if (recommendations.length === 0) {
    steps.push('Consider providing more specific project context for better recommendations');
    steps.push('Try using different search keywords or work product types');
    return steps;
  }

  const topRecommendation = recommendations[0];
  
  if (topRecommendation.relevanceScore > 0.8) {
    steps.push(`Start with "${topRecommendation.template.name}" - highest relevance match`);
  } else {
    steps.push('Review top recommendations and select the most appropriate template');
  }

  if (topRecommendation.customizationSuggestions.length > 0) {
    steps.push('Consider suggested customizations to improve template fit');
  }

  if (navigationMode === 'autonomous') {
    steps.push('Generate content automatically using the top recommendation');
  } else {
    steps.push('Review template details and initiate content generation');
  }

  steps.push('Preview generated content and apply optimizations as needed');

  return steps;
}