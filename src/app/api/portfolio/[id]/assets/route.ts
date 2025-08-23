import { NextRequest, NextResponse } from 'next/server';
import { InvestmentService } from '@/lib/services/database/investment-service';
import { UnifiedAsset } from '@/types/portfolio';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const portfolioId = params.id;
    const body = await request.json();
    
    // Convert API format to unified investment format
    const investmentData = {
      name: body.name,
      investment_type: 'internal' as const,
      asset_type: body.assetType,
      description: body.description,
      acquisition_date: body.acquisitionDate,
      acquisition_value: Math.round(body.acquisitionValue * 100), // Convert dollars to cents
      current_value: Math.round(body.currentValue * 100), // Convert dollars to cents
      location_country: body.location?.country,
      location_region: body.location?.region,
      location_city: body.location?.city,
      sector: body.sector,
      tags: body.tags || [],
      risk_rating: body.riskRating || 'medium',
      status: 'active' as const,
      specific_metrics: body.specificMetrics || {},
      portfolio_id: portfolioId,
    };
    
    // Create investment in database
    const newInvestment = InvestmentService.create(investmentData);
    
    // Convert unified investment to portfolio asset format with proper type handling
    const baseAsset = {
      id: newInvestment.id,
      name: newInvestment.name,
      assetType: newInvestment.asset_type,
      description: newInvestment.description,
      acquisitionDate: newInvestment.acquisition_date,
      acquisitionValue: newInvestment.acquisition_value ? newInvestment.acquisition_value / 100 : 0, // Convert cents to dollars
      currentValue: newInvestment.current_value ? newInvestment.current_value / 100 : 0, // Convert cents to dollars
      location: {
        country: newInvestment.location_country || '',
        region: newInvestment.location_region || '',
        city: newInvestment.location_city || '',
      },
      performance: {
        irr: 0, // These would need to be calculated or stored separately
        moic: 0,
        totalReturn: 0,
      },
      esgMetrics: {
        environmentalScore: 0,
        socialScore: 0,
        governanceScore: 0,
        overallScore: 0,
        jobsCreated: 0,
        carbonFootprint: 0,
        sustainabilityCertifications: [],
      },
      status: newInvestment.status,
      riskRating: newInvestment.risk_rating,
      sector: newInvestment.sector,
      tags: newInvestment.tags || [],
      lastUpdated: newInvestment.created_at, // Use created timestamp
    };

    // Create the appropriate asset type with specific metrics
    let apiAsset: UnifiedAsset;
    
    if (newInvestment.asset_type === 'traditional') {
      apiAsset = {
        ...baseAsset,
        assetType: 'traditional',
        specificMetrics: newInvestment.specific_metrics || {
          companyStage: 'seed',
          fundingRounds: 1,
          employeeCount: 10,
          revenue: 0,
          ebitda: 0,
          debtToEquity: 0,
          boardSeats: 0,
          ownershipPercentage: 0
        },
        companyInfo: body.companyInfo || {
          foundedYear: new Date().getFullYear(),
          businessModel: '',
          keyProducts: [],
          competitiveAdvantages: []
        }
      } as UnifiedAsset;
    } else if (newInvestment.asset_type === 'real_estate') {
      apiAsset = {
        ...baseAsset,
        assetType: 'real_estate',
        specificMetrics: newInvestment.specific_metrics || {
          propertyType: 'office',
          totalSqFt: 0,
          occupancyRate: 0,
          avgLeaseLength: 0,
          capRate: 0,
          noiYield: 0,
          vacancyRate: 0,
          avgRentPsf: 0
        },
        propertyDetails: body.propertyDetails || {
          yearBuilt: new Date().getFullYear(),
          amenities: [],
          zoning: '',
          propertyTaxes: 0
        },
        leaseInfo: body.leaseInfo || {
          majorTenants: []
        }
      } as UnifiedAsset;
    } else {
      apiAsset = {
        ...baseAsset,
        assetType: 'infrastructure',
        specificMetrics: newInvestment.specific_metrics || {
          assetCategory: 'energy',
          capacityUtilization: 0,
          operationalEfficiency: 0,
          maintenanceScore: 0,
          regulatoryCompliance: 0,
          contractedRevenue: 0,
          availabilityRate: 0,
          averageLifespan: 0
        },
        operationalData: body.operationalData || {
          commissionDate: new Date().toISOString().split('T')[0],
          designLife: 0,
          currentAge: 0
        },
        contractualInfo: body.contractualInfo || {
          contractType: 'availability',
          contractorName: '',
          contractExpiry: new Date().toISOString().split('T')[0],
          renewalOptions: 0
        }
      } as UnifiedAsset;
    }
    
    return NextResponse.json(apiAsset, { status: 201 });
  } catch (error) {
    console.error('Error creating asset:', error);
    return NextResponse.json(
      { error: 'Failed to create asset' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: portfolioId } = await params;
    const searchParams = request.nextUrl.searchParams;
    
    // Parse query parameters
    const assetType = searchParams.get('assetType');
    const status = searchParams.get('status');
    const riskRating = searchParams.get('riskRating');
    const sector = searchParams.get('sector');
    
    // Get investments for this portfolio using unified investments API
    const investments = InvestmentService.getByPortfolioId(portfolioId);
    
    // Apply filters
    let filteredInvestments = investments;
    
    if (assetType) {
      filteredInvestments = filteredInvestments.filter(investment => investment.asset_type === assetType);
    }
    
    if (status) {
      filteredInvestments = filteredInvestments.filter(investment => investment.status === status);
    }
    
    if (riskRating) {
      filteredInvestments = filteredInvestments.filter(investment => investment.risk_rating === riskRating);
    }
    
    if (sector) {
      filteredInvestments = filteredInvestments.filter(investment => investment.sector === sector);
    }
    
    // Convert unified investments to portfolio assets format
    const apiAssets = filteredInvestments.map(investment => ({
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
      lastUpdated: investment.last_updated || investment.created_at,
    }));
    
    return NextResponse.json(apiAssets, { status: 200 });
  } catch (error) {
    console.error('Error fetching assets:', error);
    return NextResponse.json(
      { error: 'Failed to fetch assets' },
      { status: 500 }
    );
  }
}
