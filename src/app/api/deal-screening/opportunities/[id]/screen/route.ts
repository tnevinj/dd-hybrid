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
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    
    const opportunity = opportunities.find(opp => opp.id === id);
    
    if (!opportunity) {
      return NextResponse.json(
        { error: 'Opportunity not found', success: false },
        { status: 404 }
      );
    }

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

    // Determine recommendation based on score and mode
    let recommendation: 'highly_recommended' | 'recommended' | 'neutral' | 'not_recommended' | 'rejected';
    
    if (mode === 'autonomous') {
      // AI-driven recommendation logic
      if (totalScore >= 85) recommendation = 'highly_recommended';
      else if (totalScore >= 70) recommendation = 'recommended';
      else if (totalScore >= 50) recommendation = 'neutral';
      else if (totalScore >= 30) recommendation = 'not_recommended';
      else recommendation = 'rejected';
    } else {
      // Human-driven or assisted recommendation
      if (totalScore >= 80) recommendation = 'highly_recommended';
      else if (totalScore >= 65) recommendation = 'recommended';
      else if (totalScore >= 45) recommendation = 'neutral';
      else if (totalScore >= 25) recommendation = 'not_recommended';
      else recommendation = 'rejected';
    }

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

    // Update opportunity status and scores
    const opportunityIndex = opportunities.findIndex(opp => opp.id === id);
    if (opportunityIndex !== -1) {
      opportunities[opportunityIndex] = {
        ...opportunities[opportunityIndex],
        scores: scores || [],
        status: autoComplete ? 'analyzed' : 'screening',
        updatedAt: new Date().toISOString(),
      };
    }

    // Generate AI insights for assisted and autonomous modes
    let aiInsights = {};
    if (mode === 'assisted' || mode === 'autonomous') {
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
    }

    return NextResponse.json({
      data: {
        screeningResult,
        updatedOpportunity: opportunities[opportunityIndex],
        aiInsights: Object.keys(aiInsights).length > 0 ? aiInsights : undefined,
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
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    const opportunity = opportunities.find(opp => opp.id === id);
    
    if (!opportunity) {
      return NextResponse.json(
        { error: 'Opportunity not found', success: false },
        { status: 404 }
      );
    }

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
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
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
      const opportunityIndex = opportunities.findIndex(opp => opp.id === id);
      if (opportunityIndex !== -1) {
        opportunities[opportunityIndex] = {
          ...opportunities[opportunityIndex],
          scores: updates.criteriaScores,
          updatedAt: new Date().toISOString(),
        };
      }
    }

    return NextResponse.json({
      data: {
        screeningResult: updatedResult,
        updatedOpportunity: opportunities.find(opp => opp.id === id),
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