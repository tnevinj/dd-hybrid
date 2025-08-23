import { NextRequest, NextResponse } from 'next/server';
import { PortfolioService } from '@/lib/services/database';
import { InvestmentService } from '@/lib/services/database/investment-service';

export async function GET(request: NextRequest) {
  console.log('Portfolio API: GET request received');
  try {
    const searchParams = request.nextUrl.searchParams;
    const managerId = searchParams.get('managerId') || 'user-1';
    console.log('Portfolio API: Looking for portfolios for manager:', managerId);
    
    // Get portfolios from SQLite database
    const dbPortfolios = PortfolioService.getByManagerId(managerId);
    console.log('Portfolio API: Found portfolios:', dbPortfolios.length);
    
    // Get assets for each portfolio using unified investments API
    const portfoliosWithAssets = dbPortfolios.map(portfolio => {
      // Get investments for this portfolio
      const investments = InvestmentService.getByPortfolioId(portfolio.id);
      
      // Convert unified investments to portfolio assets format
      const convertedAssets = investments.map(investment => ({
        id: investment.id,
        name: investment.name,
        assetType: investment.asset_type,
        description: investment.description,
        acquisitionDate: investment.acquisition_date,
        acquisitionValue: investment.acquisition_value ? investment.acquisition_value / 100 : 0, // Convert cents to dollars
        currentValue: investment.current_value ? investment.current_value / 100 : 0, // Convert cents to dollars
        location: {
          country: investment.location_country,
          region: investment.location_region,
          city: investment.location_city,
        },
        performance: {
          irr: 0, // These would need to be calculated or stored separately
          moic: 0,
          totalReturn: 0,
        },
        esgMetrics: investment.esg_scores ? {
          environmentalScore: investment.esg_scores.environmental || 0,
          socialScore: investment.esg_scores.social || 0,
          governanceScore: investment.esg_scores.governance || 0,
          overallScore: investment.esg_scores.overall || 0,
          jobsCreated: investment.jobs_created,
          carbonFootprint: investment.carbon_footprint,
          sustainabilityCertifications: investment.sustainability_certifications || [],
        } : {
          environmentalScore: 0,
          socialScore: 0,
          governanceScore: 0,
          overallScore: 0,
          jobsCreated: 0,
          carbonFootprint: 0,
          sustainabilityCertifications: [],
        },
        status: investment.status,
        riskRating: investment.risk_rating,
        sector: investment.sector,
        tags: investment.tags || [],
        specificMetrics: investment.specific_metrics || {},
      }));
      
      return {
        id: portfolio.id,
        name: portfolio.name,
        description: portfolio.description,
        assetTypes: portfolio.asset_types,
        assets: convertedAssets,
        totalValue: portfolio.total_value / 100, // Convert cents to dollars
        totalInvested: portfolio.total_invested / 100, // Convert cents to dollars
        totalRealized: portfolio.total_realized / 100, // Convert cents to dollars
        unrealizedValue: portfolio.unrealized_value / 100, // Convert cents to dollars
        performanceMetrics: {
          irr: portfolio.irr,
          moic: portfolio.moic,
          totalReturn: portfolio.total_return,
        },
        allocationTargets: portfolio.allocation_targets,
        riskProfile: portfolio.risk_profile,
        managerId: portfolio.manager_id,
        createdAt: portfolio.created_at,
        updatedAt: portfolio.updated_at,
      };
    });
    
    return NextResponse.json({ portfolios: portfoliosWithAssets }, { status: 200 });
  } catch (error) {
    console.error('Error fetching portfolios:', error);
    return NextResponse.json(
      { error: 'Failed to fetch portfolios' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Create new portfolio in database
    const newPortfolio = PortfolioService.create({
      name: body.name,
      description: body.description,
      asset_types: body.assetTypes || [],
      allocation_targets: body.allocationTargets || {},
      risk_profile: body.riskProfile || 'medium',
      manager_id: body.managerId || 'user-1'
    });
    
    // Convert to API format
    const apiPortfolio = {
      id: newPortfolio.id,
      name: newPortfolio.name,
      description: newPortfolio.description,
      assetTypes: newPortfolio.asset_types,
      assets: [], // Empty for new portfolio
      totalValue: 0,
      totalInvested: 0,
      totalRealized: 0,
      unrealizedValue: 0,
      performanceMetrics: {
        irr: 0,
        moic: 0,
        totalReturn: 0,
      },
      allocationTargets: newPortfolio.allocation_targets,
      riskProfile: newPortfolio.risk_profile,
      managerId: newPortfolio.manager_id,
      createdAt: newPortfolio.created_at,
      updatedAt: newPortfolio.updated_at,
    };
    
    return NextResponse.json(apiPortfolio, { status: 201 });
  } catch (error) {
    console.error('Error creating portfolio:', error);
    return NextResponse.json(
      { error: 'Failed to create portfolio' },
      { status: 500 }
    );
  }
}
