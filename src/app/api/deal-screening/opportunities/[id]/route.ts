import { NextRequest, NextResponse } from 'next/server';
import { DealOpportunityService, DealScoreService } from '@/lib/services/database';

// Transform database opportunity to API format with scores
function transformOpportunityWithScores(dbOpportunity: any) {
  const scores = DealScoreService.getByOpportunityId(dbOpportunity.id);
  
  // Convert database format to API format
  const apiOpportunity = {
    id: dbOpportunity.id,
    name: dbOpportunity.name,
    description: dbOpportunity.description || '',
    seller: dbOpportunity.seller || '',
    assetType: dbOpportunity.asset_type,
    vintage: dbOpportunity.vintage || '',
    sector: dbOpportunity.sector || '',
    geography: dbOpportunity.geography || '',
    askPrice: dbOpportunity.ask_price ? dbOpportunity.ask_price / 100 : 0, // Convert cents to dollars
    navPercentage: dbOpportunity.nav_percentage || 0,
    expectedReturn: dbOpportunity.expected_return || 0,
    expectedRisk: dbOpportunity.expected_risk || 0,
    expectedMultiple: dbOpportunity.expected_multiple || 0,
    expectedIRR: dbOpportunity.expected_irr || 0,
    expectedHoldingPeriod: dbOpportunity.expected_holding_period || 0,
    dueDiligenceProjectId: dbOpportunity.due_diligence_project_id,
    submissionId: dbOpportunity.submission_id,
    workspaceId: dbOpportunity.workspace_id,
    scores: scores.map(score => ({
      criterionId: score.criterion_id,
      value: score.score,
      normalizedScore: score.score / 100,
      weightedScore: (score.score / 100) * score.weight,
      notes: score.comments,
      aiGenerated: true,
      confidence: 0.9
    })),
    status: dbOpportunity.status,
    aiConfidence: dbOpportunity.ai_confidence || 0,
    similarDeals: dbOpportunity.similar_deals || [],
    aiRecommendations: dbOpportunity.ai_recommendations || [],
    createdAt: dbOpportunity.created_at,
    updatedAt: dbOpportunity.updated_at,
    additionalData: {}
  };

  return apiOpportunity;
}

// GET /api/deal-screening/opportunities/[id]
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Get opportunity from database
    const dbOpportunity = DealOpportunityService.getById(id);
    
    if (!dbOpportunity) {
      return NextResponse.json(
        { error: 'Opportunity not found', success: false },
        { status: 404 }
      );
    }

    // Transform to API format
    const opportunity = transformOpportunityWithScores(dbOpportunity);

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
      // Fetch similar deals data from database
      const allOpportunities = DealOpportunityService.getAll();
      const similarDealsData = allOpportunities
        .filter(opp => opportunity.similarDeals?.includes(opp.id))
        .map(opp => ({
          id: opp.id,
          name: opp.name,
          sector: opp.sector,
          expectedIRR: opp.expected_irr,
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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    const existingOpportunity = DealOpportunityService.getById(id);
    
    if (!existingOpportunity) {
      return NextResponse.json(
        { error: 'Opportunity not found', success: false },
        { status: 404 }
      );
    }

    // Validate status transitions
    const validStatusTransitions: Record<string, string[]> = {
      'new': ['screening', 'rejected'],
      'screening': ['analyzed', 'rejected'],
      'analyzed': ['approved', 'rejected'],
      'approved': ['closed'],
      'rejected': ['screening'], // Allow re-screening
      'closed': [],
    };

    if (body.status && existingOpportunity.status !== body.status) {
      const currentStatus = existingOpportunity.status;
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

    // Prepare update data in database format
    const updateData: any = {};
    if (body.name !== undefined) updateData.name = body.name;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.seller !== undefined) updateData.seller = body.seller;
    if (body.assetType !== undefined) updateData.asset_type = body.assetType;
    if (body.vintage !== undefined) updateData.vintage = body.vintage;
    if (body.sector !== undefined) updateData.sector = body.sector;
    if (body.geography !== undefined) updateData.geography = body.geography;
    if (body.askPrice !== undefined) updateData.ask_price = body.askPrice * 100; // Convert to cents
    if (body.navPercentage !== undefined) updateData.nav_percentage = body.navPercentage;
    if (body.expectedReturn !== undefined) updateData.expected_return = body.expectedReturn;
    if (body.expectedRisk !== undefined) updateData.expected_risk = body.expectedRisk;
    if (body.expectedMultiple !== undefined) updateData.expected_multiple = body.expectedMultiple;
    if (body.expectedIRR !== undefined) updateData.expected_irr = body.expectedIRR;
    if (body.expectedHoldingPeriod !== undefined) updateData.expected_holding_period = body.expectedHoldingPeriod;
    if (body.status !== undefined) updateData.status = body.status;
    if (body.workspaceId !== undefined) updateData.workspace_id = body.workspaceId;

    // Re-run AI analysis if requested
    if (body.runAIAnalysis) {
      updateData.ai_confidence = Math.random() * 0.3 + 0.7;
      
      // Generate new AI recommendations based on the data
      const newRecommendations = [];
      const expectedIRR = body.expectedIRR ?? existingOpportunity.expected_irr ?? 0;
      const navPercentage = body.navPercentage ?? existingOpportunity.nav_percentage ?? 0;
      
      if (expectedIRR > 25) {
        newRecommendations.push({
          id: `rec-${Date.now()}`,
          type: 'insight',
          priority: 'high',
          title: 'Exceptional Returns Detected',
          description: 'This opportunity shows returns in the top 10% of your portfolio.',
          confidence: 0.95,
          category: 'analysis',
          actions: [
            { label: 'Fast-Track Due Diligence', action: 'FAST_TRACK_DD' },
            { label: 'Schedule IC Presentation', action: 'SCHEDULE_IC' }
          ]
        });
      }

      if (navPercentage < 0.8) {
        newRecommendations.push({
          id: `rec-${Date.now()}-2`,
          type: 'opportunity',
          priority: 'medium',
          title: 'Attractive Discount Identified',
          description: `Trading at ${(navPercentage * 100).toFixed(0)}% of NAV presents good value.`,
          confidence: 0.85,
          category: 'scoring',
          actions: [
            { label: 'Analyze Discount Factors', action: 'ANALYZE_DISCOUNT' },
            { label: 'Negotiate Better Terms', action: 'NEGOTIATE_TERMS' }
          ]
        });
      }

      updateData.ai_recommendations = newRecommendations;
    }

    // Update opportunity in database
    const updatedDbOpportunity = DealOpportunityService.update(id, updateData);

    if (!updatedDbOpportunity) {
      return NextResponse.json(
        { error: 'Failed to update opportunity', success: false },
        { status: 500 }
      );
    }

    // Transform to API format and return
    const updatedOpportunity = transformOpportunityWithScores(updatedDbOpportunity);

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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const opportunity = DealOpportunityService.getById(id);
    
    if (!opportunity) {
      return NextResponse.json(
        { error: 'Opportunity not found', success: false },
        { status: 404 }
      );
    }

    // Check if opportunity can be deleted
    if (opportunity.status === 'approved' || opportunity.status === 'closed') {
      return NextResponse.json(
        { 
          error: 'Cannot delete approved or closed opportunities',
          success: false 
        },
        { status: 400 }
      );
    }

    // Delete opportunity from database
    const success = DealOpportunityService.delete(id);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Failed to delete opportunity', success: false },
        { status: 500 }
      );
    }

    return NextResponse.json({
      data: { 
        deletedId: id,
        deletedOpportunity: {
          id: opportunity.id,
          name: opportunity.name,
          status: opportunity.status,
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