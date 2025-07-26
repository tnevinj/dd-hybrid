import { NextRequest, NextResponse } from 'next/server';
import { DealOpportunity } from '@/types/deal-screening';

// Mock data store (in production, this would use a database)
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
    aiRecommendations: [
      {
        id: 'rec-1',
        type: 'suggestion',
        priority: 'high',
        title: 'Similar Deal Pattern Detected',
        description: 'This deal is 87% similar to your successful CloudCo investment from 2022.',
        confidence: 0.87,
        category: 'comparison',
        actions: [
          { label: 'Apply CloudCo Template', action: 'APPLY_TEMPLATE', params: { templateId: 'cloudco' } },
          { label: 'View Comparison', action: 'VIEW_COMPARISON' }
        ]
      }
    ],
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T14:20:00Z',
    additionalData: {},
  },
  {
    id: '2',
    name: 'HealthTech Solutions',
    description: 'Digital health platform serving emerging markets with strong patient outcomes.',
    seller: 'HealthVentures LP',
    assetType: 'fund',
    vintage: '2024',
    sector: 'Healthcare',
    geography: 'Africa',
    askPrice: 25000000,
    navPercentage: 0.78,
    expectedReturn: 0.18,
    expectedRisk: 0.12,
    expectedMultiple: 2.2,
    expectedIRR: 18.2,
    scores: [],
    status: 'approved',
    aiConfidence: 0.92,
    aiRecommendations: [],
    createdAt: '2024-01-14T14:20:00Z',
    updatedAt: '2024-01-14T16:45:00Z',
    additionalData: {},
  }
];

// GET /api/deal-screening/opportunities/[id]
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

    // Include additional data based on query parameters
    const { searchParams } = new URL(request.url);
    const includeAI = searchParams.get('includeAI') === 'true';
    const includeSimilar = searchParams.get('includeSimilar') === 'true';

    let responseData = { ...opportunity };

    if (includeAI && opportunity.aiRecommendations) {
      // Enhance AI recommendations with real-time data
      responseData.aiRecommendations = opportunity.aiRecommendations.map(rec => ({
        ...rec,
        reasoning: `Analysis based on ${Math.floor(Math.random() * 50) + 10} similar deals in portfolio`,
      }));
    }

    if (includeSimilar && opportunity.similarDeals) {
      // Fetch similar deals data
      const similarDealsData = opportunities.filter(opp => 
        opportunity.similarDeals?.includes(opp.id)
      ).map(opp => ({
        id: opp.id,
        name: opp.name,
        sector: opp.sector,
        expectedIRR: opp.expectedIRR,
        status: opp.status,
      }));
      
      responseData.additionalData = {
        ...responseData.additionalData,
        similarDealsData,
      };
    }

    return NextResponse.json({
      opportunity: responseData,
      success: true,
    });

  } catch (error) {
    console.error('Error fetching opportunity:', error);
    return NextResponse.json(
      { error: 'Failed to fetch opportunity', success: false },
      { status: 500 }
    );
  }
}

// PUT /api/deal-screening/opportunities/[id]
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    
    const opportunityIndex = opportunities.findIndex(opp => opp.id === id);
    
    if (opportunityIndex === -1) {
      return NextResponse.json(
        { error: 'Opportunity not found', success: false },
        { status: 404 }
      );
    }

    // Update opportunity
    const updatedOpportunity = {
      ...opportunities[opportunityIndex],
      ...body,
      updatedAt: new Date().toISOString(),
    };

    // Validate status transitions
    const validStatusTransitions: Record<string, string[]> = {
      'new': ['screening', 'rejected'],
      'screening': ['analyzed', 'rejected'],
      'analyzed': ['approved', 'rejected'],
      'approved': ['closed'],
      'rejected': ['screening'], // Allow re-screening
      'closed': [],
    };

    if (body.status && opportunities[opportunityIndex].status !== body.status) {
      const currentStatus = opportunities[opportunityIndex].status;
      const newStatus = body.status;
      
      if (!validStatusTransitions[currentStatus]?.includes(newStatus)) {
        return NextResponse.json(
          { 
            error: `Invalid status transition from ${currentStatus} to ${newStatus}`,
            success: false 
          },
          { status: 400 }
        );
      }
    }

    // Re-run AI analysis if requested
    if (body.runAIAnalysis) {
      updatedOpportunity.aiConfidence = Math.random() * 0.3 + 0.7;
      
      // Generate new AI recommendations
      const newRecommendations = [];
      
      if (updatedOpportunity.expectedIRR > 25) {
        newRecommendations.push({
          id: `rec-${Date.now()}`,
          type: 'insight' as const,
          priority: 'high' as const,
          title: 'Exceptional Returns Detected',
          description: 'This opportunity shows returns in the top 10% of your portfolio.',
          confidence: 0.95,
          category: 'analysis' as const,
          actions: [
            { label: 'Fast-Track Due Diligence', action: 'FAST_TRACK_DD' },
            { label: 'Schedule IC Presentation', action: 'SCHEDULE_IC' }
          ]
        });
      }

      if (updatedOpportunity.navPercentage < 0.8) {
        newRecommendations.push({
          id: `rec-${Date.now()}-2`,
          type: 'opportunity' as const,
          priority: 'medium' as const,
          title: 'Attractive Discount Identified',
          description: `Trading at ${(updatedOpportunity.navPercentage * 100).toFixed(0)}% of NAV presents good value.`,
          confidence: 0.85,
          category: 'scoring' as const,
          actions: [
            { label: 'Analyze Discount Factors', action: 'ANALYZE_DISCOUNT' },
            { label: 'Negotiate Better Terms', action: 'NEGOTIATE_TERMS' }
          ]
        });
      }

      updatedOpportunity.aiRecommendations = newRecommendations;
    }

    opportunities[opportunityIndex] = updatedOpportunity;

    return NextResponse.json({
      data: updatedOpportunity,
      success: true,
    });

  } catch (error) {
    console.error('Error updating opportunity:', error);
    return NextResponse.json(
      { error: 'Failed to update opportunity', success: false },
      { status: 500 }
    );
  }
}

// DELETE /api/deal-screening/opportunities/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    const opportunityIndex = opportunities.findIndex(opp => opp.id === id);
    
    if (opportunityIndex === -1) {
      return NextResponse.json(
        { error: 'Opportunity not found', success: false },
        { status: 404 }
      );
    }

    // Check if opportunity can be deleted
    const opportunity = opportunities[opportunityIndex];
    if (opportunity.status === 'approved' || opportunity.status === 'closed') {
      return NextResponse.json(
        { 
          error: 'Cannot delete approved or closed opportunities',
          success: false 
        },
        { status: 400 }
      );
    }

    // Remove opportunity
    const deletedOpportunity = opportunities.splice(opportunityIndex, 1)[0];

    return NextResponse.json({
      data: { 
        deletedId: id,
        deletedOpportunity: {
          id: deletedOpportunity.id,
          name: deletedOpportunity.name,
          status: deletedOpportunity.status,
        }
      },
      success: true,
    });

  } catch (error) {
    console.error('Error deleting opportunity:', error);
    return NextResponse.json(
      { error: 'Failed to delete opportunity', success: false },
      { status: 500 }
    );
  }
}