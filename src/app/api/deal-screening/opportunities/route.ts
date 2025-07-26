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

    let filteredOpportunities = [...opportunities];

    // Apply filters
    if (status) {
      filteredOpportunities = filteredOpportunities.filter(opp => opp.status === status);
    }
    if (sector) {
      filteredOpportunities = filteredOpportunities.filter(opp => opp.sector === sector);
    }
    if (geography) {
      filteredOpportunities = filteredOpportunities.filter(opp => opp.geography === geography);
    }
    if (assetType) {
      filteredOpportunities = filteredOpportunities.filter(opp => opp.assetType === assetType);
    }

    // Apply pagination
    const limitNum = limit ? parseInt(limit) : undefined;
    const offsetNum = offset ? parseInt(offset) : 0;
    
    if (limitNum) {
      filteredOpportunities = filteredOpportunities.slice(offsetNum, offsetNum + limitNum);
    }

    // Calculate metadata
    const metadata = {
      total: opportunities.length,
      filtered: filteredOpportunities.length,
      limit: limitNum,
      offset: offsetNum,
    };

    return NextResponse.json({
      opportunities: filteredOpportunities,
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
    const requiredFields = ['name', 'description', 'sector', 'geography', 'askPrice'];
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

    // Create new opportunity
    const newOpportunity: DealOpportunity = {
      id: `opp-${Date.now()}`,
      name: body.name,
      description: body.description,
      seller: body.seller,
      assetType: body.assetType || 'fund',
      vintage: body.vintage || new Date().getFullYear().toString(),
      sector: body.sector,
      geography: body.geography,
      askPrice: body.askPrice,
      navPercentage: body.navPercentage || 1.0,
      expectedReturn: body.expectedReturn || 0.15,
      expectedRisk: body.expectedRisk || 0.1,
      expectedMultiple: body.expectedMultiple || 2.0,
      expectedIRR: body.expectedIRR || 15,
      expectedHoldingPeriod: body.expectedHoldingPeriod || 3,
      scores: [],
      status: 'new',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      additionalData: body.additionalData || {},
    };

    // Add AI enhancements if requested
    if (body.enableAI) {
      // Simulate AI analysis
      newOpportunity.aiConfidence = Math.random() * 0.3 + 0.7; // 0.7-1.0
      
      // Generate AI recommendations based on sector and other factors
      const aiRecommendations = [];
      
      if (newOpportunity.sector === 'Technology' || newOpportunity.sector === 'Healthcare') {
        aiRecommendations.push({
          id: `rec-${Date.now()}`,
          type: 'suggestion' as const,
          priority: 'medium' as const,
          title: 'Sector Analysis Available',
          description: `Strong performance patterns detected in ${newOpportunity.sector} sector.`,
          confidence: 0.8,
          category: 'analysis' as const,
          actions: [
            { label: 'View Sector Analysis', action: 'VIEW_SECTOR_ANALYSIS' },
            { label: 'Compare to Peers', action: 'COMPARE_PEERS' }
          ]
        });
      }

      if (newOpportunity.expectedIRR > 20) {
        aiRecommendations.push({
          id: `rec-${Date.now()}-2`,
          type: 'insight' as const,
          priority: 'high' as const,
          title: 'High-Return Opportunity',
          description: 'Expected IRR exceeds portfolio average. Consider prioritizing this deal.',
          confidence: 0.9,
          category: 'scoring' as const,
          actions: [
            { label: 'Fast-Track Screening', action: 'FAST_TRACK' },
            { label: 'Schedule Review', action: 'SCHEDULE_REVIEW' }
          ]
        });
      }

      newOpportunity.aiRecommendations = aiRecommendations;
    }

    // Add to mock store
    opportunities.push(newOpportunity);

    return NextResponse.json({
      data: newOpportunity,
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

    const updatedOpportunities = opportunities.map(opp => {
      if (ids.includes(opp.id)) {
        return {
          ...opp,
          ...updates,
          updatedAt: new Date().toISOString(),
        };
      }
      return opp;
    });

    // Update mock store
    opportunities = updatedOpportunities;

    const updatedCount = ids.length;
    
    return NextResponse.json({
      data: { updatedCount, updatedIds: ids },
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
    const originalCount = opportunities.length;
    
    // Remove opportunities
    opportunities = opportunities.filter(opp => !ids.includes(opp.id));
    
    const deletedCount = originalCount - opportunities.length;

    return NextResponse.json({
      data: { deletedCount, deletedIds: ids.slice(0, deletedCount) },
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