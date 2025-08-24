import { NextRequest, NextResponse } from 'next/server';
import { InvestmentService } from '@/lib/services/database/investment-service';
import { UnifiedInvestment } from '@/types/unified-investment';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    // Parse query parameters
    const investmentType = searchParams.get('investmentType');
    const assetType = searchParams.get('assetType');
    const status = searchParams.get('status');
    const riskRating = searchParams.get('riskRating');
    const sector = searchParams.get('sector');
    const portfolioId = searchParams.get('portfolioId');
    const workspaceId = searchParams.get('workspaceId');
    const module = searchParams.get('module');
    
    // Get investments from database
    let investments;
    
    if (portfolioId) {
      investments = InvestmentService.getByPortfolioId(portfolioId);
    } else if (workspaceId) {
      investments = InvestmentService.getByWorkspaceId(workspaceId);
    } else {
      investments = InvestmentService.getAll();
    }
    
    // Apply module-specific filtering
    if (module) {
      switch (module) {
        case 'dashboard':
          // Dashboard: Show all investments with focus on active and recent ones
          investments = investments.filter(inv => 
            inv.status === 'active' || 
            inv.status === 'due_diligence' ||
            inv.status === 'structuring'
          );
          break;
          
        case 'deal-screening':
          // Deal Screening: Focus on external investments for assessment
          investments = investments.filter(inv => 
            inv.investment_type === 'external' && 
            (inv.status === 'screening' || inv.status === 'due_diligence')
          );
          break;
          
        case 'due-diligence':
          // Due Diligence: Active due diligence processes
          investments = investments.filter(inv => 
            inv.status === 'due_diligence'
          );
          break;
          
        case 'portfolio':
          // Portfolio: Current active holdings
          investments = investments.filter(inv => 
            inv.status === 'active' && 
            inv.investment_type === 'internal'
          );
          break;
          
        case 'workspace':
          // Workspace: Investments associated with workspaces for analysis
          investments = investments.filter(inv => 
            inv.workspace_id != null
          );
          break;
          
        default:
          // No additional filtering for unknown modules
          break;
      }
    }
    
    // Apply filters
    let filteredInvestments = investments;
    
    if (investmentType) {
      filteredInvestments = filteredInvestments.filter(inv => inv.investment_type === investmentType);
    }
    
    if (assetType) {
      filteredInvestments = filteredInvestments.filter(inv => inv.asset_type === assetType);
    }
    
    if (status) {
      filteredInvestments = filteredInvestments.filter(inv => inv.status === status);
    }
    
    if (riskRating) {
      filteredInvestments = filteredInvestments.filter(inv => inv.risk_rating === riskRating);
    }
    
    if (sector) {
      filteredInvestments = filteredInvestments.filter(inv => inv.sector === sector);
    }
    
    // Convert database format to API format
    const apiInvestments = filteredInvestments.map(inv => {
      const baseInvestment = {
        id: inv.id,
        name: inv.name,
        investmentType: inv.investment_type as 'internal' | 'external' | 'co_investment' | 'fund',
        assetType: inv.asset_type,
        description: inv.description || undefined,
        status: inv.status,
        riskRating: inv.risk_rating as 'low' | 'medium' | 'high' | 'critical',
        sector: inv.sector,
        geography: inv.geography,
        created: inv.created_at,
        lastUpdated: inv.updated_at,
      };
      
      // Add investment type specific fields
      if (inv.investment_type === 'internal') {
        return {
          ...baseInvestment,
          currentValue: inv.current_value ? inv.current_value / 100 : undefined, // Convert cents to dollars
          acquisitionValue: inv.acquisition_value ? inv.acquisition_value / 100 : undefined, // Convert cents to dollars
          acquisitionDate: inv.acquisition_date,
          location: {
            country: inv.location_country,
            region: inv.location_region,
            city: inv.location_city,
          },
          esgMetrics: inv.esg_scores ? {
            environmentalScore: inv.esg_scores.environmental || 0,
            socialScore: inv.esg_scores.social || 0,
            governanceScore: inv.esg_scores.governance || 0,
            overallScore: inv.esg_scores.overall || 0,
            jobsCreated: inv.jobs_created,
            carbonFootprint: inv.carbon_footprint,
            sustainabilityCertifications: inv.sustainability_certifications || [],
          } : undefined,
          specificMetrics: inv.specific_metrics,
          tags: inv.tags || [],
          portfolioId: inv.portfolio_id,
        } as UnifiedInvestment;
      } else {
        return {
          ...baseInvestment,
          targetValue: inv.target_value ? inv.target_value / 100 : undefined, // Convert cents to dollars
          expectedReturn: inv.expected_return,
          expectedRisk: inv.expected_risk,
          expectedMultiple: inv.expected_multiple,
          expectedIrr: inv.expected_irr,
          expectedHoldingPeriod: inv.expected_holding_period,
          seller: inv.seller,
          vintage: inv.vintage,
          navPercentage: inv.nav_percentage,
          dueDiligenceProjectId: inv.due_diligence_project_id,
          submissionId: inv.submission_id,
          aiConfidence: inv.ai_confidence,
          similarInvestments: inv.similar_investments || [],
          aiRecommendations: inv.ai_recommendations || [],
          workspaceId: inv.workspace_id,
        } as UnifiedInvestment;
      }
    });
    
    return NextResponse.json(apiInvestments, { status: 200 });
  } catch (error) {
    console.error('Error fetching investments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch investments' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Convert API format to database format
    const investmentData = {
      name: body.name,
      investment_type: body.investmentType,
      asset_type: body.assetType,
      description: body.description,
      status: body.status || 'active',
      risk_rating: body.riskRating || 'medium',
      sector: body.sector,
      geography: body.geography,
    };
    
    // Add investment type specific fields
    if (body.investmentType === 'internal') {
      Object.assign(investmentData, {
        current_value: body.currentValue ? Math.round(body.currentValue * 100) : undefined, // Convert dollars to cents
        acquisition_value: body.acquisitionValue ? Math.round(body.acquisitionValue * 100) : undefined, // Convert dollars to cents
        acquisition_date: body.acquisitionDate,
        location_country: body.location?.country,
        location_region: body.location?.region,
        location_city: body.location?.city,
        jobs_created: body.esgMetrics?.jobsCreated,
        carbon_footprint: body.esgMetrics?.carbonFootprint,
        sustainability_certifications: body.esgMetrics?.sustainabilityCertifications || [],
        esg_scores: body.esgMetrics ? {
          environmental: body.esgMetrics.environmentalScore || 0,
          social: body.esgMetrics.socialScore || 0,
          governance: body.esgMetrics.governanceScore || 0,
          overall: body.esgMetrics.overallScore || 0,
        } : undefined,
        specific_metrics: body.specificMetrics || {},
        tags: body.tags || [],
        portfolio_id: body.portfolioId,
      });
    } else {
      Object.assign(investmentData, {
        target_value: body.targetValue ? Math.round(body.targetValue * 100) : undefined, // Convert dollars to cents
        expected_return: body.expectedReturn,
        expected_risk: body.expectedRisk,
        expected_multiple: body.expectedMultiple,
        expected_irr: body.expectedIrr,
        expected_holding_period: body.expectedHoldingPeriod,
        seller: body.seller,
        vintage: body.vintage,
        nav_percentage: body.navPercentage,
        due_diligence_project_id: body.dueDiligenceProjectId,
        submission_id: body.submissionId,
        ai_confidence: body.aiConfidence,
        similar_investments: body.similarInvestments || [],
        ai_recommendations: body.aiRecommendations || [],
        workspace_id: body.workspaceId,
      });
    }
    
    // Create investment in database
    const newInvestment = InvestmentService.create(investmentData);
    
    // Convert back to API format for response
    const apiInvestment = {
      id: newInvestment.id,
      name: newInvestment.name,
      investmentType: newInvestment.investment_type,
      assetType: newInvestment.asset_type,
      description: newInvestment.description,
      status: newInvestment.status,
      riskRating: newInvestment.risk_rating,
      sector: newInvestment.sector,
      geography: newInvestment.geography,
      created: newInvestment.created_at,
      lastUpdated: newInvestment.updated_at,
    };
    
    // Add investment type specific fields to response
    if (newInvestment.investment_type === 'internal') {
      Object.assign(apiInvestment, {
        currentValue: newInvestment.current_value ? newInvestment.current_value / 100 : undefined,
        acquisitionValue: newInvestment.acquisition_value ? newInvestment.acquisition_value / 100 : undefined,
        acquisitionDate: newInvestment.acquisition_date,
        location: {
          country: newInvestment.location_country,
          region: newInvestment.location_region,
          city: newInvestment.location_city,
        },
        esgMetrics: newInvestment.esg_scores ? {
          environmentalScore: newInvestment.esg_scores.environmental || 0,
          socialScore: newInvestment.esg_scores.social || 0,
          governanceScore: newInvestment.esg_scores.governance || 0,
          overallScore: newInvestment.esg_scores.overall || 0,
          jobsCreated: newInvestment.jobs_created,
          carbonFootprint: newInvestment.carbon_footprint,
          sustainabilityCertifications: newInvestment.sustainability_certifications || [],
        } : undefined,
        specificMetrics: newInvestment.specific_metrics,
        tags: newInvestment.tags || [],
        portfolioId: newInvestment.portfolio_id,
      });
    } else {
      Object.assign(apiInvestment, {
        targetValue: newInvestment.target_value ? newInvestment.target_value / 100 : undefined,
        expectedReturn: newInvestment.expected_return,
        expectedRisk: newInvestment.expected_risk,
        expectedMultiple: newInvestment.expected_multiple,
        expectedIrr: newInvestment.expected_irr,
        expectedHoldingPeriod: newInvestment.expected_holding_period,
        seller: newInvestment.seller,
        vintage: newInvestment.vintage,
        navPercentage: newInvestment.nav_percentage,
        dueDiligenceProjectId: newInvestment.due_diligence_project_id,
        submissionId: newInvestment.submission_id,
        aiConfidence: newInvestment.ai_confidence,
        similarInvestments: newInvestment.similar_investments || [],
        aiRecommendations: newInvestment.ai_recommendations || [],
        workspaceId: newInvestment.workspace_id,
      });
    }
    
    return NextResponse.json(apiInvestment, { status: 201 });
  } catch (error) {
    console.error('Error creating investment:', error);
    return NextResponse.json(
      { error: 'Failed to create investment' },
      { status: 500 }
    );
  }
}
