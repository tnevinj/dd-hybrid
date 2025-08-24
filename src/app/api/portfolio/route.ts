import { NextRequest, NextResponse } from 'next/server';
import { PortfolioService, PortfolioAssetService } from '@/lib/services/database';

export async function GET(request: NextRequest) {
  console.log('Portfolio API: GET request received');
  try {
    const searchParams = request.nextUrl.searchParams;
    const managerId = searchParams.get('managerId') || 'user-1';
    console.log('Portfolio API: Looking for portfolios for manager:', managerId);
    
    // Get portfolios from SQLite database
    const dbPortfolios = PortfolioService.getByManagerId(managerId);
    console.log('Portfolio API: Found portfolios:', dbPortfolios.length);
    
    // Get assets for each portfolio using portfolio assets
    const portfoliosWithAssets = dbPortfolios.map(portfolio => {
      // Get portfolio assets for this portfolio
      const portfolioAssets = PortfolioAssetService.getByPortfolioId(portfolio.id);
      
      // Convert portfolio assets to API format
      const convertedAssets = portfolioAssets.map(asset => ({
        id: asset.id,
        name: asset.name,
        assetType: asset.asset_type,
        description: asset.description,
        acquisitionDate: asset.acquisition_date,
        acquisitionValue: asset.acquisition_value / 100, // Convert cents to dollars
        currentValue: asset.current_value / 100, // Convert cents to dollars
        location: {
          country: asset.location_country,
          region: asset.location_region,
          city: asset.location_city,
        },
        performance: {
          irr: asset.irr,
          moic: asset.moic,
          totalReturn: asset.total_return,
        },
        esgMetrics: {
          environmentalScore: asset.environmental_score || 0,
          socialScore: asset.social_score || 0,
          governanceScore: asset.governance_score || 0,
          overallScore: asset.overall_esg_score || 0,
          jobsCreated: asset.jobs_created,
          carbonFootprint: asset.carbon_footprint,
          sustainabilityCertifications: asset.sustainability_certifications || [],
        },
        status: asset.status,
        riskRating: asset.risk_rating,
        sector: asset.sector,
        tags: asset.tags || [],
        specificMetrics: asset.specific_metrics || {},
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
