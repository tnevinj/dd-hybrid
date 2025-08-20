import { NextRequest, NextResponse } from 'next/server';
import { DealScreeningResult, DealScore, DealOpportunity } from '@/types/deal-screening';

// Mock data stores
let opportunities: DealOpportunity[] = [
  {
    id: '1',
    name: 'TechCorp Series B',
    description: 'AI-powered enterprise software company with strong growth metrics and market position.',
    seller: 'TechCorp Ventures',
    assetType: 'direct',
    vintage: '2023',
    sector: 'Technology',
    geography: 'North America',
    askPrice: 50000000,
    navPercentage: 0.85,
    expectedReturn: 0.25,
    expectedRisk: 0.15,
    expectedMultiple: 2.8,
    expectedIRR: 25.5,
    expectedHoldingPeriod: 4,
    scores: [],
    status: 'screening',
    aiConfidence: 0.87,
    similarDeals: ['deal-2', 'deal-5'],
    aiRecommendations: [],
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T14:20:00Z',
    additionalData: {},
  }
];

let screeningResults: DealScreeningResult[] = [];

// POST /api/deal-screening/opportunities/[id]/screen
// Start or complete a screening process
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    // Import database services to use real data instead of mock
    const { DealOpportunityService } = await import('@/lib/services/database');
    const dbOpportunity = DealOpportunityService.getById(id);
    
    if (!dbOpportunity) {
      return NextResponse.json(
        { error: 'Opportunity not found', success: false },
        { status: 404 }
      );
    }

    // Transform to API format for consistency
    const opportunity = {
      id: dbOpportunity.id,
      name: dbOpportunity.name,
      description: dbOpportunity.description || '',
      seller: dbOpportunity.seller || '',
      assetType: dbOpportunity.asset_type,
      vintage: dbOpportunity.vintage || '',
      sector: dbOpportunity.sector || '',
      geography: dbOpportunity.geography || '',
      askPrice: dbOpportunity.ask_price ? dbOpportunity.ask_price / 100 : 0,
      navPercentage: dbOpportunity.nav_percentage || 0,
      expectedReturn: dbOpportunity.expected_return || 0,
      expectedRisk: dbOpportunity.expected_risk || 0,
      expectedMultiple: dbOpportunity.expected_multiple || 0,
      expectedIRR: dbOpportunity.expected_irr || 0,
      expectedHoldingPeriod: dbOpportunity.expected_holding_period || 0,
      scores: [],
      status: dbOpportunity.status,
      aiConfidence: dbOpportunity.ai_confidence || 0,
      similarDeals: dbOpportunity.similar_deals || [],
      aiRecommendations: dbOpportunity.ai_recommendations || [],
      createdAt: dbOpportunity.created_at,
      updatedAt: dbOpportunity.updated_at,
      additionalData: {}
    };

    const { 
      templateId, 
      scores, 
      notes, 
      mode = 'traditional',
      autoComplete = false 
    } = body;

    // Validate required fields
    if (!templateId) {
      return NextResponse.json(
        { error: 'Template ID is required', success: false },
        { status: 400 }
      );
    }

    // Calculate total score
    const totalScore = scores?.reduce((sum: number, score: DealScore) => sum + score.weightedScore, 0) || 0;

    // Determine recommendation based on score - use consistent thresholds across all modes
    // Mode affects interaction/process, not investment decision criteria
    let recommendation: 'highly_recommended' | 'recommended' | 'neutral' | 'not_recommended' | 'rejected';
    
    if (totalScore >= 80) recommendation = 'highly_recommended';
    else if (totalScore >= 65) recommendation = 'recommended';
    else if (totalScore >= 45) recommendation = 'neutral';
    else if (totalScore >= 25) recommendation = 'not_recommended';
    else recommendation = 'rejected';

    // Create screening result
    const screeningResult: DealScreeningResult = {
      id: `screening-${Date.now()}`,
      opportunityId: id,
      templateId,
      totalScore,
      criteriaScores: scores || [],
      recommendation,
      notes: notes || '',
      automationLevel: mode === 'traditional' ? 'manual' : mode === 'assisted' ? 'assisted' : 'autonomous',
      aiProcessingTime: mode === 'autonomous' ? Math.random() * 10 + 5 : undefined,
      humanReviewTime: mode !== 'autonomous' ? Math.random() * 300 + 180 : undefined,
      createdAt: new Date().toISOString(),
      createdBy: 'current-user', // In real app, get from auth
    };

    // Save screening result
    screeningResults.push(screeningResult);

    // Update opportunity status in database
    const updateData: any = {
      status: autoComplete ? 'analyzed' : 'screening',
      updated_at: new Date().toISOString()
    };
    
    // Also store scores in database if provided
    if (scores && scores.length > 0) {
      // In a real implementation, you might want to save scores to a separate scores table
      // For now, we'll just update the status
      DealOpportunityService.update(id, updateData);
    } else {
      DealOpportunityService.update(id, updateData);
    }

    // Generate AI insights and initialize post-screening workflow
    let aiInsights = {};
    let postScreeningWorkflow = null;
    
    if (mode === 'assisted' || mode === 'autonomous') {
      // Import services dynamically to avoid circular dependencies
      const { PostScreeningWorkflowService } = await import('@/lib/services/post-screening-workflow-service');
      const { DocumentGenerationService } = await import('@/lib/services/document-generation-service');
      
      // Generate enhanced AI insights
      aiInsights = {
        processingTime: screeningResult.aiProcessingTime || 8.3,
        confidence: Math.random() * 0.2 + 0.8, // 0.8-1.0
        benchmarkComparison: {
          percentile: Math.floor(Math.random() * 40) + 60, // 60-100 percentile
          similarDealsCount: Math.floor(Math.random() * 50) + 10,
          sectorAverage: totalScore * (Math.random() * 0.4 + 0.8), // 80-120% of current score
        },
        riskFactors: [
          'Management team transition in progress',
          'Market competition intensifying', 
          'Regulatory environment changing',
        ].slice(0, Math.floor(Math.random() * 3) + 1),
        opportunities: [
          'Strong sector tailwinds',
          'Favorable valuation multiple',
          'Experienced management team',
        ].slice(0, Math.floor(Math.random() * 3) + 1),
      };

      // Initialize post-screening workflow if auto-complete is enabled
      if (autoComplete) {
        try {
          postScreeningWorkflow = await PostScreeningWorkflowService.createWorkflow(
            opportunity,
            screeningResult,
            mode as 'traditional' | 'assisted' | 'autonomous'
          );
          
          // Update opportunity status based on workflow routing
          const workflowStage = postScreeningWorkflow.currentStage;
          let newStatus = opportunity.status;
          
          if (workflowStage === 'committee_review') {
            newStatus = 'pending_committee_review';
          } else if (workflowStage === 'due_diligence') {
            newStatus = 'in_due_diligence';
          } else if (workflowStage === 'approval') {
            newStatus = 'awaiting_approval';
          }
          
          // Update opportunity status in database
          DealOpportunityService.update(id, {
            status: newStatus,
            updated_at: new Date().toISOString()
          });
          
          console.log(`Post-screening workflow initiated for ${opportunity.name}: ${workflowStage} stage`);
          
        } catch (workflowError) {
          console.error('Error creating post-screening workflow:', workflowError);
          // Continue without workflow if there's an error
        }
      }
    }

    // Get updated opportunity from database for response
    const updatedDbOpportunity = DealOpportunityService.getById(id);
    const updatedOpportunity = updatedDbOpportunity ? {
      id: updatedDbOpportunity.id,
      name: updatedDbOpportunity.name,
      description: updatedDbOpportunity.description || '',
      seller: updatedDbOpportunity.seller || '',
      assetType: updatedDbOpportunity.asset_type,
      vintage: updatedDbOpportunity.vintage || '',
      sector: updatedDbOpportunity.sector || '',
      geography: updatedDbOpportunity.geography || '',
      askPrice: updatedDbOpportunity.ask_price ? updatedDbOpportunity.ask_price / 100 : 0,
      status: updatedDbOpportunity.status,
      updatedAt: updatedDbOpportunity.updated_at
    } : opportunity;

    return NextResponse.json({
      data: {
        screeningResult,
        updatedOpportunity,
        aiInsights: Object.keys(aiInsights).length > 0 ? aiInsights : undefined,
        postScreeningWorkflow,
        workflowInitiated: !!postScreeningWorkflow,
        nextSteps: postScreeningWorkflow?.nextSteps?.slice(0, 3) || [],
        notifications: postScreeningWorkflow?.notifications?.filter(n => n.actionRequired) || []
      },
      success: true,
    }, { status: 201 });

  } catch (error) {
    console.error('Error processing screening:', error);
    return NextResponse.json(
      { error: 'Failed to process screening', success: false },
      { status: 500 }
    );
  }
}

// GET /api/deal-screening/opportunities/[id]/screen
// Get existing screening results for an opportunity
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Import database services to use real data
    const { DealOpportunityService } = await import('@/lib/services/database');
    const dbOpportunity = DealOpportunityService.getById(id);
    
    if (!dbOpportunity) {
      return NextResponse.json(
        { error: 'Opportunity not found', success: false },
        { status: 404 }
      );
    }

    // Transform to API format for consistency
    const opportunity = {
      id: dbOpportunity.id,
      name: dbOpportunity.name,
      description: dbOpportunity.description || '',
      seller: dbOpportunity.seller || '',
      assetType: dbOpportunity.asset_type,
      vintage: dbOpportunity.vintage || '',
      sector: dbOpportunity.sector || '',
      geography: dbOpportunity.geography || '',
      askPrice: dbOpportunity.ask_price ? dbOpportunity.ask_price / 100 : 0,
      navPercentage: dbOpportunity.nav_percentage || 0,
      expectedReturn: dbOpportunity.expected_return || 0,
      expectedRisk: dbOpportunity.expected_risk || 0,
      expectedMultiple: dbOpportunity.expected_multiple || 0,
      expectedIRR: dbOpportunity.expected_irr || 0,
      expectedHoldingPeriod: dbOpportunity.expected_holding_period || 0,
      scores: [],
      status: dbOpportunity.status,
      aiConfidence: dbOpportunity.ai_confidence || 0,
      similarDeals: dbOpportunity.similar_deals || [],
      aiRecommendations: dbOpportunity.ai_recommendations || [],
      createdAt: dbOpportunity.created_at,
      updatedAt: dbOpportunity.updated_at,
      additionalData: {}
    };

    // Get all screening results for this opportunity
    const opportunityScreeningResults = screeningResults.filter(
      result => result.opportunityId === id
    ).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    // Get latest screening result
    const latestResult = opportunityScreeningResults[0] || null;

    return NextResponse.json({
      data: {
        opportunity,
        screeningResults: opportunityScreeningResults,
        latestResult,
        hasExistingScreening: opportunityScreeningResults.length > 0,
      },
      success: true,
    });

  } catch (error) {
    console.error('Error fetching screening data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch screening data', success: false },
      { status: 500 }
    );
  }
}

// PUT /api/deal-screening/opportunities/[id]/screen
// Update an existing screening result
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { screeningResultId, updates } = body;

    if (!screeningResultId) {
      return NextResponse.json(
        { error: 'Screening result ID is required', success: false },
        { status: 400 }
      );
    }

    const resultIndex = screeningResults.findIndex(result => result.id === screeningResultId);
    
    if (resultIndex === -1) {
      return NextResponse.json(
        { error: 'Screening result not found', success: false },
        { status: 404 }
      );
    }

    // Update screening result
    const updatedResult = {
      ...screeningResults[resultIndex],
      ...updates,
      // Recalculate total score if scores updated
      totalScore: updates.criteriaScores ? 
        updates.criteriaScores.reduce((sum: number, score: DealScore) => sum + score.weightedScore, 0) :
        screeningResults[resultIndex].totalScore,
    };

    screeningResults[resultIndex] = updatedResult;

    // Update opportunity scores if provided
    if (updates.criteriaScores) {
      // Import database service
      const { DealOpportunityService } = await import('@/lib/services/database');
      DealOpportunityService.update(id, {
        updated_at: new Date().toISOString()
      });
    }

    // Get updated opportunity from database for response
    const { DealOpportunityService } = await import('@/lib/services/database');
    const updatedDbOpportunity = DealOpportunityService.getById(id);
    
    const updatedOpportunity = updatedDbOpportunity ? {
      id: updatedDbOpportunity.id,
      name: updatedDbOpportunity.name,
      status: updatedDbOpportunity.status,
      updatedAt: updatedDbOpportunity.updated_at
    } : null;

    return NextResponse.json({
      data: {
        screeningResult: updatedResult,
        updatedOpportunity,
      },
      success: true,
    });

  } catch (error) {
    console.error('Error updating screening:', error);
    return NextResponse.json(
      { error: 'Failed to update screening', success: false },
      { status: 500 }
    );
  }
}