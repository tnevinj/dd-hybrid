import { NextRequest, NextResponse } from 'next/server';
import { PortfolioService } from '@/lib/services/database';
import { InvestmentService } from '@/lib/services/database/investment-service';

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
    
    // Get investments for this portfolio using unified investments API
    const investments = InvestmentService.getByPortfolioId(portfolioId);
    
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
