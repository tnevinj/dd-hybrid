import { NextRequest, NextResponse } from 'next/server';
import { 
  ContentGenerationRequest,
  ContentGenerationResult,
  ProjectContext
} from '@/types/work-product';
import { contentTransformationPipeline } from '@/lib/services/content-transformation-pipeline';
import { templateOrchestrator } from '@/lib/services/template-orchestrator';

// POST /api/content-transformation/generate
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      templateId, 
      workspaceId, 
      projectContext, 
      customFields, 
      generationMode = 'assisted',
      options = {}
    } = body;

    // Validate required fields
    if (!workspaceId || !projectContext) {
      return NextResponse.json(
        { 
          error: 'Missing required fields: workspaceId and projectContext are required',
          success: false 
        },
        { status: 400 }
      );
    }

    console.log(`Starting content generation for workspace ${workspaceId} in ${generationMode} mode`);

    let generationRequest: ContentGenerationRequest;

    if (templateId) {
      // Direct template usage
      generationRequest = {
        templateId,
        workspaceId,
        projectContext,
        customFields,
        generationMode,
        options: {
          includeDataBindings: true,
          generateAllSections: generationMode === 'autonomous',
          validateContent: true,
          optimizeForReadability: true,
          ...options
        }
      };
    } else {
      // Auto-select template based on context
      console.log('No template specified, auto-selecting optimal template...');
      
      const mockThandoContext = {
        currentModule: 'workspace' as const,
        currentPage: '/workspace',
        navigationMode: generationMode,
        userId: 'api-user',
        userRole: 'associate' as const,
        userPreferences: {
          preferredAnalysisDepth: 'detailed' as const,
          communicationStyle: 'professional' as const,
          defaultTimeframe: '1Y' as const,
          focusAreas: [projectContext.sector || 'technology'],
          notificationFrequency: 'daily' as const,
          preferredChartTypes: ['line', 'bar'],
          riskTolerance: 'medium' as const
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
          totalAUM: 0,
          totalValue: 0,
          netIRR: 0,
          grossIRR: 0,
          totalValueMultiple: 0,
          distributionsToDate: 0,
          unrealizedValue: 0,
          cashFlow: { quarterlyDistributions: 0, quarterlyContributions: 0, netCashFlow: 0 },
          performance: { ytdReturn: 0, quarterlyReturn: 0, benchmarkComparison: 0 }
        },
        recentActivity: [],
        conversationHistory: [],
        availableActions: [],
        currentCapabilities: {
          proactiveInsights: true,
          automaticAnalysis: true,
          smartSuggestions: true,
          contextualRecommendations: true,
          realTimeAlerts: true,
          documentAnalysis: true,
          functionCalling: true
        },
        platformData: {
          totalPortfolios: 0,
          totalDeals: 0,
          teamSize: 0,
          lastLogin: new Date(),
          systemAlerts: [],
          marketConditions: { sentiment: 'neutral' as const, volatilityIndex: 0, keyTrends: [] }
        },
        timeContext: {
          currentQuarter: 'Q4 2024',
          fiscalYearEnd: new Date(),
          lastReportingDate: new Date(),
          upcomingDeadlines: []
        }
      };

      const autoSelection = await templateOrchestrator.autoSelectTemplate(mockThandoContext);
      
      generationRequest = {
        templateId: autoSelection.selectedTemplate.id,
        workspaceId,
        projectContext,
        customFields,
        generationMode,
        options: {
          includeDataBindings: true,
          generateAllSections: generationMode === 'autonomous',
          validateContent: true,
          optimizeForReadability: true,
          ...options
        }
      };

      console.log(`Auto-selected template: ${autoSelection.selectedTemplate.name} (confidence: ${autoSelection.confidence})`);
    }

    // Execute content generation
    const result = await contentTransformationPipeline.transformToWorkProduct(generationRequest);

    // Add API-specific metadata
    const apiResult = {
      ...result,
      metadata: {
        apiVersion: '1.0',
        generatedAt: new Date().toISOString(),
        generationMode,
        requestId: `req-${Date.now()}`,
        ...result.workProduct.metadata
      }
    };

    console.log(`Content generation completed successfully. Quality score: ${result.generationMetrics.qualityScore}`);

    return NextResponse.json({
      data: apiResult,
      success: true,
      message: `Successfully generated ${result.workProduct.title}`
    });

  } catch (error) {
    console.error('Content generation API error:', error);
    
    return NextResponse.json(
      { 
        error: error.message || 'Content generation failed',
        success: false,
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

// GET /api/content-transformation/generate - Get generation status and options
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const mode = searchParams.get('mode') || 'assisted';
    const projectType = searchParams.get('projectType') || 'analysis';

    // Return available generation options and capabilities
    const capabilities = {
      traditional: {
        automationLevel: 0.3,
        templateLibrary: 'standard',
        customization: 'limited',
        aiGeneration: false,
        dataIntegration: false,
        qualityAssurance: 'basic'
      },
      assisted: {
        automationLevel: 0.7,
        templateLibrary: 'full',
        customization: 'moderate',
        aiGeneration: true,
        dataIntegration: true,
        qualityAssurance: 'enhanced'
      },
      autonomous: {
        automationLevel: 0.95,
        templateLibrary: 'full',
        customization: 'extensive',
        aiGeneration: true,
        dataIntegration: true,
        qualityAssurance: 'comprehensive',
        autoOptimization: true,
        realTimeUpdates: true
      }
    };

    const supportedFormats = ['PDF', 'DOCX', 'HTML', 'MARKDOWN', 'JSON'];
    
    const workProductTypes = [
      { type: 'DD_REPORT', name: 'Due Diligence Report', estimatedTime: '15-25 minutes' },
      { type: 'IC_MEMO', name: 'Investment Committee Memo', estimatedTime: '8-12 minutes' },
      { type: 'INVESTMENT_SUMMARY', name: 'Investment Summary', estimatedTime: '5-8 minutes' },
      { type: 'MARKET_ANALYSIS', name: 'Market Analysis', estimatedTime: '10-15 minutes' },
      { type: 'RISK_ASSESSMENT', name: 'Risk Assessment', estimatedTime: '12-18 minutes' },
      { type: 'FINANCIAL_MODEL', name: 'Financial Model', estimatedTime: '20-30 minutes' }
    ];

    return NextResponse.json({
      data: {
        capabilities: capabilities[mode as keyof typeof capabilities] || capabilities.assisted,
        supportedFormats,
        workProductTypes,
        maxProjectsPerRequest: 1,
        maxCustomFields: 20,
        estimatedGenerationTime: {
          simple: '2-5 minutes',
          standard: '5-15 minutes',
          complex: '15-30 minutes'
        }
      },
      success: true
    });

  } catch (error) {
    console.error('Generation options API error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to retrieve generation options',
        success: false 
      },
      { status: 500 }
    );
  }
}