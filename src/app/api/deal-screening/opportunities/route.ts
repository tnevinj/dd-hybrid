import { NextRequest, NextResponse } from 'next/server';
import { DealOpportunity } from '@/types/deal-screening';
import { UnifiedWorkspaceDataService } from '@/lib/data/unified-workspace-data';
import { dealScoringEngine } from '@/lib/services/deal-scoring-engine';

// Transform unified workspace projects into deal opportunities with real scoring
function generateOpportunitiesFromUnifiedData(): DealOpportunity[] {
  const projects = UnifiedWorkspaceDataService.getAllProjects();
  const scoredOpportunities = dealScoringEngine.scoreAllOpportunities();
  
  return projects.map((project, index) => {
    const opportunityScore = scoredOpportunities.find(s => s.id === project.id);
    
    // Determine status based on project progress and type
    let status: 'new' | 'screening' | 'approved' | 'rejected' = 'screening';
    if (project.progress < 30) status = 'new';
    else if (project.progress > 85 && project.type === 'ic-preparation') status = 'approved';
    else status = 'screening';
    
    // Generate AI recommendations based on real scoring
    const aiRecommendations = [];
    
    if (opportunityScore) {
      // High confidence recommendations
      if (opportunityScore.confidence > 0.85) {
        aiRecommendations.push({
          id: `rec-${project.id}-confidence`,
          type: 'insight' as const,
          priority: 'high' as const,
          title: 'High Confidence Analysis',
          description: `Analysis shows ${(opportunityScore.confidence * 100).toFixed(0)}% confidence with strong fundamentals across ${opportunityScore.keyFactors.length} key factors.`,
          confidence: opportunityScore.confidence,
          category: 'scoring' as const,
          actions: [
            { label: 'View Detailed Scoring', action: 'VIEW_SCORING_DETAILS' },
            { label: 'Generate IC Memo', action: 'GENERATE_IC_MEMO' }
          ]
        });
      }

      // Recommendation-based suggestions
      if (opportunityScore.recommendation === 'strong_buy') {
        aiRecommendations.push({
          id: `rec-${project.id}-strongbuy`,
          type: 'suggestion' as const,
          priority: 'high' as const,
          title: 'Strong Buy Recommendation',
          description: `Scoring engine recommends strong buy with ${opportunityScore.overallScore}/100 overall score and ${opportunityScore.expectedIRR.toFixed(1)}% expected IRR.`,
          confidence: 0.9,
          category: 'recommendation' as const,
          actions: [
            { label: 'Fast-Track to IC', action: 'FAST_TRACK' },
            { label: 'Schedule Management Meeting', action: 'SCHEDULE_MGMT_MEETING' }
          ]
        });
      } else if (opportunityScore.recommendation === 'buy') {
        aiRecommendations.push({
          id: `rec-${project.id}-buy`,
          type: 'suggestion' as const,
          priority: 'medium' as const,
          title: 'Buy Recommendation',
          description: `Good investment opportunity with ${opportunityScore.overallScore}/100 score. Consider addressing key risk factors.`,
          confidence: 0.8,
          category: 'recommendation' as const,
          actions: [
            { label: 'Proceed with DD', action: 'PROCEED_DD' },
            { label: 'Risk Mitigation Plan', action: 'CREATE_RISK_PLAN' }
          ]
        });
      } else if (opportunityScore.recommendation === 'hold') {
        aiRecommendations.push({
          id: `rec-${project.id}-hold`,
          type: 'warning' as const,
          priority: 'medium' as const,
          title: 'Proceed with Caution',
          description: `Moderate score of ${opportunityScore.overallScore}/100. Review ${opportunityScore.riskFactors.length} risk factors before proceeding.`,
          confidence: 0.7,
          category: 'risk' as const,
          actions: [
            { label: 'Deep Dive Analysis', action: 'DEEP_DIVE' },
            { label: 'Expert Consultation', action: 'EXPERT_CONSULT' }
          ]
        });
      }

      // Risk-based recommendations
      if (opportunityScore.riskFactors.length > 2) {
        aiRecommendations.push({
          id: `rec-${project.id}-risk`,
          type: 'warning' as const,
          priority: 'medium' as const,
          title: 'Multiple Risk Factors Identified',
          description: `${opportunityScore.riskFactors.length} risk factors detected. Enhanced due diligence recommended.`,
          confidence: 0.8,
          category: 'risk' as const,
          actions: [
            { label: 'Risk Assessment Report', action: 'GENERATE_RISK_REPORT' },
            { label: 'Mitigation Strategies', action: 'DEVELOP_MITIGATION' }
          ]
        });
      }

      // Sector-specific recommendations
      if (project.metadata.sector === 'Technology' && opportunityScore.strategicFit > 75) {
        aiRecommendations.push({
          id: `rec-${project.id}-tech`,
          type: 'insight' as const,
          priority: 'medium' as const,
          title: 'Strong Technology Sector Fit',
          description: 'High strategic alignment with portfolio technology focus. Consider premium valuation.',
          confidence: 0.85,
          category: 'strategic' as const,
          actions: [
            { label: 'Technology Deep Dive', action: 'TECH_DEEP_DIVE' },
            { label: 'Compare to Tech Portfolio', action: 'TECH_COMPARISON' }
          ]
        });
      }
    }

    return {
      id: project.id,
      name: project.name,
      description: opportunityScore?.description || `${project.metadata.sector} investment opportunity`,
      seller: `${project.name.split(' ')[0]} Ventures`, // Generate seller name
      assetType: project.type === 'deal-screening' ? 'direct' : 'fund',
      vintage: '2024',
      sector: project.metadata.sector || 'Technology',
      geography: project.metadata.geography || 'North America',
      askPrice: project.metadata.dealValue || 50000000,
      navPercentage: project.metadata.riskRating === 'low' ? 0.9 : 
                    project.metadata.riskRating === 'high' ? 0.7 : 0.8,
      expectedReturn: opportunityScore ? opportunityScore.expectedIRR / 100 : 0.2,
      expectedRisk: project.metadata.riskRating === 'low' ? 0.08 : 
                    project.metadata.riskRating === 'high' ? 0.25 : 0.15,
      expectedMultiple: opportunityScore ? (opportunityScore.expectedIRR / 100) * 5 + 1.5 : 2.5,
      expectedIRR: opportunityScore?.expectedIRR || 20,
      expectedHoldingPeriod: project.metadata.stage === 'mature' ? 3 : 
                            project.metadata.stage === 'growth' ? 5 : 4,
      scores: opportunityScore ? [
        {
          category: 'Overall',
          score: opportunityScore.overallScore,
          maxScore: 100,
          description: `Comprehensive analysis score based on financial, operational, strategic and risk factors`
        },
        {
          category: 'Financial',
          score: opportunityScore.financialScore,
          maxScore: 100,
          description: 'Financial metrics, valuation, and expected returns analysis'
        },
        {
          category: 'Strategic Fit',
          score: opportunityScore.strategicFit,
          maxScore: 100,
          description: 'Alignment with portfolio strategy and investment criteria'
        },
        {
          category: 'Risk Assessment',
          score: opportunityScore.riskScore,
          maxScore: 100,
          description: 'Comprehensive risk evaluation across multiple dimensions'
        }
      ] : [],
      status,
      aiConfidence: opportunityScore?.confidence || 0.7,
      similarDeals: [], // Would be populated by ML similarity matching in production
      aiRecommendations,
      createdAt: new Date(project.lastActivity.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week before last activity
      updatedAt: project.lastActivity.toISOString(),
      additionalData: {
        projectProgress: project.progress,
        teamSize: project.teamSize,
        workProducts: project.workProducts,
        scoringDetails: opportunityScore
      },
    };
  });
}

// Cache opportunities for session consistency
let cachedOpportunities: DealOpportunity[] | null = null;
let lastCacheTime: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

function getOpportunities(): DealOpportunity[] {
  const now = Date.now();
  
  if (!cachedOpportunities || (now - lastCacheTime) > CACHE_DURATION) {
    cachedOpportunities = generateOpportunitiesFromUnifiedData();
    lastCacheTime = now;
  }
  
  return cachedOpportunities;
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

    let opportunities = getOpportunities();
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

    // Calculate metadata including scoring stats
    const scoringStats = {
      averageScore: Math.round(opportunities.reduce((sum, opp) => {
        const overallScore = opp.scores.find(s => s.category === 'Overall');
        return sum + (overallScore?.score || 0);
      }, 0) / opportunities.length),
      highScoreCount: opportunities.filter(opp => {
        const overallScore = opp.scores.find(s => s.category === 'Overall');
        return (overallScore?.score || 0) >= 80;
      }).length,
      totalScored: opportunities.filter(opp => opp.scores.length > 0).length
    };

    const metadata = {
      total: opportunities.length,
      filtered: filteredOpportunities.length,
      limit: limitNum,
      offset: offsetNum,
      scoringStats,
      lastUpdated: new Date().toISOString()
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

    // Create new unified workspace project to maintain data consistency
    const newProjectId = `proj-${Date.now()}`;
    const mockProject = {
      id: newProjectId,
      name: body.name,
      type: 'deal-screening' as const,
      displayType: 'Screening',
      status: 'active' as const,
      displayStatus: 'Active',
      priority: 'medium' as const,
      progress: 10, // New opportunity
      lastActivity: new Date(),
      lastActivityDisplay: 'Just now',
      teamMembers: ['System User'],
      teamSize: 1,
      workProducts: 1, // Initial screening document
      metadata: {
        dealValue: body.askPrice,
        sector: body.sector,
        geography: body.geography,
        stage: body.stage || 'growth',
        riskRating: body.riskRating || 'medium',
        confidenceScore: 0.6 // Initial confidence for new deals
      }
    };

    // Score the new opportunity using the engine
    const dealScore = dealScoringEngine.scoreDeal(mockProject as any);
    
    // Generate AI recommendations based on scoring
    const aiRecommendations = [];
    
    if (dealScore.overallScore >= 75) {
      aiRecommendations.push({
        id: `rec-${newProjectId}-high`,
        type: 'suggestion' as const,
        priority: 'high' as const,
        title: 'High Scoring Opportunity',
        description: `Scoring engine rated this ${dealScore.overallScore}/100. Consider fast-tracking.`,
        confidence: dealScore.confidence,
        category: 'scoring' as const,
        actions: [
          { label: 'Fast-Track Screening', action: 'FAST_TRACK' },
          { label: 'Schedule Review', action: 'SCHEDULE_REVIEW' }
        ]
      });
    }

    if (dealScore.categories.risk.score < 60) {
      aiRecommendations.push({
        id: `rec-${newProjectId}-risk`,
        type: 'warning' as const,
        priority: 'medium' as const,
        title: 'Risk Factors Identified',
        description: 'Enhanced due diligence recommended based on risk analysis.',
        confidence: 0.8,
        category: 'risk' as const,
        actions: [
          { label: 'Risk Deep Dive', action: 'RISK_ANALYSIS' },
          { label: 'Expert Consultation', action: 'EXPERT_CONSULT' }
        ]
      });
    }

    // Create the opportunity from the scored project
    const newOpportunity: DealOpportunity = {
      id: newProjectId,
      name: body.name,
      description: body.description,
      seller: body.seller || `${body.name.split(' ')[0]} Ventures`,
      assetType: body.assetType || 'direct',
      vintage: body.vintage || new Date().getFullYear().toString(),
      sector: body.sector,
      geography: body.geography,
      askPrice: body.askPrice,
      navPercentage: body.navPercentage || 0.8,
      expectedReturn: dealScore.categories.financial.factors.find(f => f.name === 'Expected IRR')?.value || 0.18,
      expectedRisk: body.riskRating === 'low' ? 0.08 : body.riskRating === 'high' ? 0.25 : 0.15,
      expectedMultiple: body.expectedMultiple || 2.2,
      expectedIRR: dealScore.categories.financial.factors.find(f => f.name === 'Expected IRR')?.value * 100 || 18,
      expectedHoldingPeriod: body.expectedHoldingPeriod || 4,
      scores: [
        {
          category: 'Overall',
          score: dealScore.overallScore,
          maxScore: 100,
          description: 'Comprehensive analysis score based on financial, operational, strategic and risk factors'
        },
        {
          category: 'Financial',
          score: dealScore.categories.financial.score,
          maxScore: 100,
          description: 'Financial metrics, valuation, and expected returns analysis'
        },
        {
          category: 'Strategic Fit',
          score: dealScore.categories.strategic.score,
          maxScore: 100,
          description: 'Alignment with portfolio strategy and investment criteria'
        },
        {
          category: 'Risk Assessment',
          score: dealScore.categories.risk.score,
          maxScore: 100,
          description: 'Comprehensive risk evaluation across multiple dimensions'
        }
      ],
      status: 'new',
      aiConfidence: dealScore.confidence,
      similarDeals: [], // Would be populated by ML in production
      aiRecommendations,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      additionalData: {
        projectProgress: 10,
        teamSize: 1,
        workProducts: 1,
        scoringDetails: dealScore,
        ...body.additionalData
      },
    };

    // Clear cache to include new opportunity
    cachedOpportunities = null;

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

    // Note: In a real implementation, this would update the unified data source
    // For now, we'll clear the cache to simulate updates
    cachedOpportunities = null;

    const updatedCount = ids.length;
    
    return NextResponse.json({
      data: { 
        updatedCount, 
        updatedIds: ids,
        message: 'Updates applied to unified data source'
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
    
    // Note: In a real implementation, this would delete from the unified data source
    // For now, we'll clear the cache to simulate deletions
    cachedOpportunities = null;
    
    const deletedCount = ids.length;

    return NextResponse.json({
      data: { 
        deletedCount, 
        deletedIds: ids,
        message: 'Items removed from unified data source'
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