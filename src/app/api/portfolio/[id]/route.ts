import { NextRequest, NextResponse } from 'next/server';
import { PortfolioService, PortfolioAssetService } from '@/lib/services/database';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: portfolioId } = await params;
    console.log('Portfolio Detail API: GET request for portfolio:', portfolioId);
    
    // Get portfolio from database
    const portfolio = PortfolioService.getById(portfolioId);
    if (!portfolio) {
      return NextResponse.json(
        { error: 'Portfolio not found' },
        { status: 404 }
      );
    }
    
    // Get assets for this portfolio
    const assets = PortfolioAssetService.getByPortfolioId(portfolioId);
    
    // Convert database format to API format
    const convertedAssets = assets.map(asset => ({
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
        environmentalScore: asset.environmental_score,
        socialScore: asset.social_score,
        governanceScore: asset.governance_score,
        overallScore: asset.overall_esg_score,
        jobsCreated: asset.jobs_created,
        carbonFootprint: asset.carbon_footprint,
        sustainabilityCertifications: asset.sustainability_certifications,
      },
      status: asset.status,
      riskRating: asset.risk_rating,
      sector: asset.sector,
      tags: asset.tags,
      specificMetrics: asset.specific_metrics,
    }));
    
    const portfolioWithAssets = {
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
    
    return NextResponse.json(portfolioWithAssets, { status: 200 });
  } catch (error) {
    console.error('Error fetching portfolio:', error);
    return NextResponse.json(
      { error: 'Failed to fetch portfolio' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: portfolioId } = await params;
    const body = await request.json();
    
    // Update portfolio in database
    const updatedPortfolio = PortfolioService.update(portfolioId, {
      name: body.name,
      description: body.description,
      asset_types: body.assetTypes,
      allocation_targets: body.allocationTargets,
      risk_profile: body.riskProfile,
    });
    
    if (!updatedPortfolio) {
      return NextResponse.json(
        { error: 'Portfolio not found' },
        { status: 404 }
      );
    }
    
    // Convert to API format
    const apiPortfolio = {
      id: updatedPortfolio.id,
      name: updatedPortfolio.name,
      description: updatedPortfolio.description,
      assetTypes: updatedPortfolio.asset_types,
      totalValue: updatedPortfolio.total_value / 100,
      totalInvested: updatedPortfolio.total_invested / 100,
      totalRealized: updatedPortfolio.total_realized / 100,
      unrealizedValue: updatedPortfolio.unrealized_value / 100,
      performanceMetrics: {
        irr: updatedPortfolio.irr,
        moic: updatedPortfolio.moic,
        totalReturn: updatedPortfolio.total_return,
      },
      allocationTargets: updatedPortfolio.allocation_targets,
      riskProfile: updatedPortfolio.risk_profile,
      managerId: updatedPortfolio.manager_id,
      createdAt: updatedPortfolio.created_at,
      updatedAt: updatedPortfolio.updated_at,
    };
    
    return NextResponse.json(apiPortfolio, { status: 200 });
  } catch (error) {
    console.error('Error updating portfolio:', error);
    return NextResponse.json(
      { error: 'Failed to update portfolio' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: portfolioId } = await params;
    
    const success = PortfolioService.delete(portfolioId);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Portfolio not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error deleting portfolio:', error);
    return NextResponse.json(
      { error: 'Failed to delete portfolio' },
      { status: 500 }
    );
  }
}