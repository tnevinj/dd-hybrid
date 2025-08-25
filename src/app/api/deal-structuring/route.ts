import { NextRequest, NextResponse } from 'next/server';
import { InvestmentService } from '@/lib/services/database/investment-service';
import { DealStructuringProject, DealStructuringMetrics } from '@/types/deal-structuring';

// Transform unified investment to deal structuring project format
function transformInvestmentToDealProject(investment: any): DealStructuringProject {
  // Safely parse JSON fields with error handling
  const safeJsonParse = (jsonString: any, defaultValue: any) => {
    // Handle null, undefined, or non-string values
    if (jsonString === null || jsonString === undefined || typeof jsonString !== 'string') {
      return defaultValue;
    }
    
    // Handle empty or whitespace-only strings
    if (jsonString.trim() === '' || jsonString === '[]' || jsonString === '{}') {
      return defaultValue;
    }
    
    try {
      return JSON.parse(jsonString);
    } catch (error) {
      console.error('Error parsing JSON:', error, 'String:', jsonString);
      return defaultValue;
    }
  };

  const project: DealStructuringProject = {
    id: investment.id,
    name: investment.name,
    type: investment.deal_type as any || 'single_asset_continuation',
    stage: investment.stage as any || 'structuring',
    targetValue: investment.target_value || investment.acquisition_value ? investment.acquisition_value / 100 : 0,
    progress: investment.progress || 0,
    team: safeJsonParse(investment.team, []),
    lastUpdated: new Date(investment.last_updated || investment.updated_at),
    keyMetrics: safeJsonParse(investment.key_metrics, {}),
    riskLevel: investment.risk_rating as 'low' | 'medium' | 'high' || 'medium',
    nextMilestone: investment.next_milestone,
    aiRecommendations: safeJsonParse(investment.ai_recommendations, [])
  };
  
  // Handle optional currentValuation with exactOptionalPropertyTypes
  if (investment.current_value !== undefined && investment.current_value !== null) {
    project.currentValuation = investment.current_value / 100;
  }
  
  return project;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const includeDetails = searchParams.get('includeDetails') === 'true';
    const stage = searchParams.get('stage');
    const type = searchParams.get('type');

    console.log('Fetching deal structuring projects...');
    
    // Get deal structuring projects from unified investments (filter by status)
    let investments = InvestmentService.getByStatus('structuring');
    console.log('Found investments:', investments.length);
    
    // Apply additional filters
    if (stage) {
      investments = investments.filter((inv: any) => inv.stage === stage.toLowerCase());
    }
    
    if (type) {
      investments = investments.filter((inv: any) => inv.deal_type === type.toLowerCase());
    }

    console.log('After filtering:', investments.length);
    
    // Transform to deal structuring format
    const projects = investments.map(transformInvestmentToDealProject);
    console.log('Transformed projects:', projects.length);

    // Get metrics
    const totalValue = projects.reduce((sum: number, p: DealStructuringProject) => sum + p.targetValue, 0);
    const averageProgress = projects.length > 0 
      ? Math.round(projects.reduce((sum: number, p: DealStructuringProject) => sum + p.progress, 0) / projects.length)
      : 0;

    const metrics: DealStructuringMetrics = {
      activeDeals: projects.filter((p: DealStructuringProject) => p.stage !== 'completed').length,
      totalValue,
      averageProgress,
      upcomingDeadlines: 0, // Would need to calculate from activities
      completedThisMonth: projects.filter((p: DealStructuringProject) => 
        p.stage === 'completed' && 
        new Date(p.lastUpdated).getMonth() === new Date().getMonth() &&
        new Date(p.lastUpdated).getFullYear() === new Date().getFullYear()
      ).length,
      pendingApprovals: projects.filter((p: DealStructuringProject) => 
        p.stage === 'investment_committee'
      ).length
    };

    const response = {
      success: true,
      metrics,
      deals: includeDetails ? projects : projects.map((p: DealStructuringProject) => ({ 
        id: p.id, 
        name: p.name, 
        stage: p.stage,
        type: p.type,
        progress: p.progress
      })),
      timestamp: new Date().toISOString()
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching deal structuring data:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch deal structuring data',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Convert deal structuring format to unified investment format
    const investmentData = {
      name: body.name,
      investment_type: 'external' as const,
      asset_type: 'deal_opportunity',
      deal_type: body.type,
      stage: body.stage || 'structuring',
      status: 'structuring' as const,
      target_value: body.targetValue,
      current_value: body.currentValuation ? Math.round(body.currentValuation * 100) : 0,
      acquisition_value: Math.round(body.targetValue * 100), // Convert to cents
      progress: body.progress || 0,
      risk_rating: body.riskLevel?.toLowerCase(),
      team: body.team ? JSON.stringify(body.team) : '[]',
      key_metrics: body.keyMetrics ? JSON.stringify(body.keyMetrics) : '{}',
      next_milestone: body.nextMilestone,
      ai_recommendations: body.aiRecommendations || []
    };

    // Create investment in database
    const newInvestment = InvestmentService.create(investmentData);
    
    // Transform back to deal structuring format
    const project = transformInvestmentToDealProject(newInvestment);

    return NextResponse.json({
      success: true,
      project,
      message: 'Deal structuring project created successfully'
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating deal structuring project:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create deal structuring project',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}
