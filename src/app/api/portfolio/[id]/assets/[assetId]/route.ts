import { NextRequest, NextResponse } from 'next/server';
import { InvestmentService } from '@/lib/services/database/investment-service';
import { UnifiedAsset } from '@/types/portfolio';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; assetId: string }> }
) {
  try {
    const { id: portfolioId, assetId } = await params;
    
    // Get investment from database using unified investments API
    const investment = InvestmentService.getById(assetId);
    
    if (!investment) {
      return NextResponse.json(
        { error: 'Asset not found' },
        { status: 404 }
      );
    }
    
    // Convert unified investment to portfolio asset format
    const apiAsset = {
      id: investment.id,
      name: investment.name,
      assetType: investment.asset_type,
      description: investment.description,
      acquisitionDate: investment.acquisition_date,
      acquisitionValue: investment.acquisition_value ? investment.acquisition_value / 100 : 0, // Convert cents to dollars
      currentValue: investment.current_value ? investment.current_value / 100 : 0, // Convert cents to dollars
      location: {
        country: investment.location_country || '',
        region: investment.location_region || '',
        city: investment.location_city || '',
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
      lastUpdated: investment.last_updated || investment.created_at || new Date().toISOString(),
    } as UnifiedAsset;
    
    return NextResponse.json(apiAsset, { status: 200 });
  } catch (error) {
    console.error('Error fetching asset:', error);
    return NextResponse.json(
      { error: 'Failed to fetch asset' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; assetId: string }> }
) {
  try {
    const { id: portfolioId, assetId } = await params;
    const body = await request.json();
    
    // Convert API format to unified investment format
    const updates: any = {
      name: body.name,
      description: body.description,
      acquisition_date: body.acquisitionDate,
      acquisition_value: Math.round(body.acquisitionValue * 100), // Convert dollars to cents
      current_value: Math.round(body.currentValue * 100), // Convert dollars to cents
      location_country: body.location?.country,
      location_region: body.location?.region,
      location_city: body.location?.city,
      sector: body.sector,
      tags: body.tags,
      risk_rating: body.riskRating,
      specific_metrics: body.specificMetrics,
    };
    
    // Remove undefined values
    Object.keys(updates).forEach(key => {
      if (updates[key] === undefined) {
        delete updates[key];
      }
    });
    
    // Update investment in database
    const updatedInvestment = InvestmentService.update(assetId, updates);
    
    if (!updatedInvestment) {
      return NextResponse.json(
        { error: 'Asset not found' },
        { status: 404 }
      );
    }
    
    // Convert unified investment to portfolio asset format
    const apiAsset = {
      id: updatedInvestment.id,
      name: updatedInvestment.name,
      assetType: updatedInvestment.asset_type,
      description: updatedInvestment.description,
      acquisitionDate: updatedInvestment.acquisition_date,
      acquisitionValue: updatedInvestment.acquisition_value ? updatedInvestment.acquisition_value / 100 : 0, // Convert cents to dollars
      currentValue: updatedInvestment.current_value ? updatedInvestment.current_value / 100 : 0, // Convert cents to dollars
      location: {
        country: updatedInvestment.location_country || '',
        region: updatedInvestment.location_region || '',
        city: updatedInvestment.location_city || '',
      },
      performance: {
        irr: 0, // These would need to be calculated or stored separately
        moic: 0,
        totalReturn: 0,
      },
      esgMetrics: updatedInvestment.esg_scores ? {
        environmentalScore: updatedInvestment.esg_scores.environmental || 0,
        socialScore: updatedInvestment.esg_scores.social || 0,
        governanceScore: updatedInvestment.esg_scores.governance || 0,
        overallScore: updatedInvestment.esg_scores.overall || 0,
        jobsCreated: updatedInvestment.jobs_created,
        carbonFootprint: updatedInvestment.carbon_footprint,
        sustainabilityCertifications: updatedInvestment.sustainability_certifications || [],
      } : {
        environmentalScore: 0,
        socialScore: 0,
        governanceScore: 0,
        overallScore: 0,
        jobsCreated: 0,
        carbonFootprint: 0,
        sustainabilityCertifications: [],
      },
      status: updatedInvestment.status,
      riskRating: updatedInvestment.risk_rating,
      sector: updatedInvestment.sector,
      tags: updatedInvestment.tags || [],
      specificMetrics: updatedInvestment.specific_metrics || {},
      lastUpdated: updatedInvestment.last_updated || updatedInvestment.created_at || new Date().toISOString(),
    } as UnifiedAsset;
    
    return NextResponse.json(apiAsset, { status: 200 });
  } catch (error) {
    console.error('Error updating asset:', error);
    return NextResponse.json(
      { error: 'Failed to update asset' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; assetId: string }> }
) {
  try {
    const { id: portfolioId, assetId } = await params;
    
    // Delete investment from database
    const success = InvestmentService.delete(assetId);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Asset not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { message: 'Asset deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting asset:', error);
    return NextResponse.json(
      { error: 'Failed to delete asset' },
      { status: 500 }
    );
  }
}
