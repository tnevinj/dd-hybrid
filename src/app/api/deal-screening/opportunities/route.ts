import { NextRequest, NextResponse } from 'next/server';
import { DealOpportunityService, DealScoreService } from '@/lib/services/database';

// Transform database opportunities to API format with scores
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

// GET /api/deal-screening/opportunities
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Filter parameters
    const status = searchParams.get('status');
    const sector = searchParams.get('sector');
    const geography = searchParams.get('geography');
    const assetType = searchParams.get('assetType');
    const limit = searchParams.get('limit');
    const offset = searchParams.get('offset');

    // Get all opportunities from database
    let dbOpportunities = DealOpportunityService.getAll();
    
    // Apply filters
    if (status) {
      dbOpportunities = dbOpportunities.filter(opp => opp.status === status);
    }
    if (sector) {
      dbOpportunities = dbOpportunities.filter(opp => opp.sector === sector);
    }
    if (geography) {
      dbOpportunities = dbOpportunities.filter(opp => opp.geography === geography);
    }
    if (assetType) {
      dbOpportunities = dbOpportunities.filter(opp => opp.asset_type === assetType);
    }

    // Transform to API format
    const opportunities = dbOpportunities.map(transformOpportunityWithScores);

    // Apply pagination
    const limitNum = limit ? parseInt(limit) : undefined;
    const offsetNum = offset ? parseInt(offset) : 0;
    
    let paginatedOpportunities = opportunities;
    if (limitNum) {
      paginatedOpportunities = opportunities.slice(offsetNum, offsetNum + limitNum);
    }

    // Calculate metadata including scoring stats
    const totalScores = opportunities.reduce((sum, opp) => {
      const totalScore = opp.scores.reduce((scoreSum, score) => scoreSum + score.value, 0);
      return sum + (totalScore / opp.scores.length || 0);
    }, 0);

    const scoringStats = {
      averageScore: opportunities.length > 0 ? Math.round(totalScores / opportunities.length) : 0,
      highScoreCount: opportunities.filter(opp => {
        const avgScore = opp.scores.reduce((sum, score) => sum + score.value, 0) / (opp.scores.length || 1);
        return avgScore >= 80;
      }).length,
      totalScored: opportunities.filter(opp => opp.scores.length > 0).length
    };

    const metadata = {
      total: opportunities.length,
      filtered: paginatedOpportunities.length,
      limit: limitNum,
      offset: offsetNum,
      scoringStats,
      lastUpdated: new Date().toISOString()
    };

    return NextResponse.json({
      opportunities: paginatedOpportunities,
      metadata,
      success: true,
    });
  } catch (error) {
    console.error('Error fetching opportunities:', error);
    return NextResponse.json(
      { error: 'Failed to fetch opportunities', success: false },
      { status: 500 }
    );
  }
}

// POST /api/deal-screening/opportunities
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const requiredFields = ['name', 'sector', 'geography'];
    const missingFields = requiredFields.filter(field => !body[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { 
          error: `Missing required fields: ${missingFields.join(', ')}`,
          success: false 
        },
        { status: 400 }
      );
    }

    // Create new opportunity in database
    const newOpportunity = DealOpportunityService.create({
      name: body.name,
      description: body.description,
      seller: body.seller,
      asset_type: body.assetType || 'direct',
      vintage: body.vintage || new Date().getFullYear().toString(),
      sector: body.sector,
      geography: body.geography,
      ask_price: body.askPrice ? body.askPrice * 100 : undefined, // Convert dollars to cents
      nav_percentage: body.navPercentage,
      expected_return: body.expectedReturn,
      expected_risk: body.expectedRisk,
      expected_multiple: body.expectedMultiple,
      expected_irr: body.expectedIRR,
      expected_holding_period: body.expectedHoldingPeriod,
      workspace_id: body.workspaceId
    });

    // Transform to API format
    const apiOpportunity = transformOpportunityWithScores(newOpportunity);

    return NextResponse.json({
      data: apiOpportunity,
      success: true,
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating opportunity:', error);
    return NextResponse.json(
      { error: 'Failed to create opportunity', success: false },
      { status: 500 }
    );
  }
}

// PUT /api/deal-screening/opportunities (bulk update)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { ids, updates } = body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { error: 'No opportunity IDs provided', success: false },
        { status: 400 }
      );
    }

    // Update each opportunity in the database
    const updatedOpportunities = [];
    let updatedCount = 0;

    for (const id of ids) {
      const opportunity = DealOpportunityService.update(id, updates);
      if (opportunity) {
        updatedOpportunities.push(transformOpportunityWithScores(opportunity));
        updatedCount++;
      }
    }
    
    return NextResponse.json({
      data: { 
        updatedCount, 
        updatedIds: ids.slice(0, updatedCount),
        opportunities: updatedOpportunities
      },
      success: true,
    });

  } catch (error) {
    console.error('Error bulk updating opportunities:', error);
    return NextResponse.json(
      { error: 'Failed to update opportunities', success: false },
      { status: 500 }
    );
  }
}

// DELETE /api/deal-screening/opportunities (bulk delete)
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const idsParam = searchParams.get('ids');
    
    if (!idsParam) {
      return NextResponse.json(
        { error: 'No opportunity IDs provided', success: false },
        { status: 400 }
      );
    }

    const ids = idsParam.split(',');
    
    // Delete each opportunity from database
    let deletedCount = 0;
    const deletedIds = [];

    for (const id of ids) {
      const success = DealOpportunityService.delete(id);
      if (success) {
        deletedCount++;
        deletedIds.push(id);
      }
    }

    return NextResponse.json({
      data: { 
        deletedCount, 
        deletedIds,
        message: `Successfully deleted ${deletedCount} opportunities from database`
      },
      success: true,
    });

  } catch (error) {
    console.error('Error deleting opportunities:', error);
    return NextResponse.json(
      { error: 'Failed to delete opportunities', success: false },
      { status: 500 }
    );
  }
}