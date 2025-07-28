import { NextRequest, NextResponse } from 'next/server';
import { UnifiedAsset } from '@/types/portfolio';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const portfolioId = params.id;
    const body = await request.json();
    
    // Create new asset
    const newAsset: UnifiedAsset = {
      id: `asset-${Date.now()}`,
      name: body.name,
      assetType: body.assetType,
      description: body.description,
      acquisitionDate: body.acquisitionDate,
      acquisitionValue: body.acquisitionValue,
      currentValue: body.currentValue,
      location: body.location,
      performance: body.performance || {
        irr: 0,
        moic: 1,
        totalReturn: 0,
      },
      esgMetrics: body.esgMetrics || {
        environmentalScore: 0,
        socialScore: 0,
        governanceScore: 0,
        overallScore: 0,
        sustainabilityCertifications: [],
      },
      status: body.status || 'active',
      riskRating: body.riskRating || 'medium',
      sector: body.sector,
      tags: body.tags || [],
      specificMetrics: body.specificMetrics,
      lastUpdated: new Date().toISOString(),
    };
    
    // Add asset-type-specific fields
    if (body.assetType === 'traditional') {
      (newAsset as any).companyInfo = body.companyInfo;
    } else if (body.assetType === 'real_estate') {
      (newAsset as any).propertyDetails = body.propertyDetails;
      (newAsset as any).leaseInfo = body.leaseInfo;
    } else if (body.assetType === 'infrastructure') {
      (newAsset as any).operationalData = body.operationalData;
      (newAsset as any).contractualInfo = body.contractualInfo;
    }
    
    // In a real application, this would save to database and update portfolio
    
    return NextResponse.json(newAsset, { status: 201 });
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
  { params }: { params: { id: string } }
) {
  try {
    const portfolioId = params.id;
    const searchParams = request.nextUrl.searchParams;
    
    // Parse query parameters
    const assetType = searchParams.get('assetType');
    const status = searchParams.get('status');
    const riskRating = searchParams.get('riskRating');
    const sector = searchParams.get('sector');
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined;
    const offset = searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : 0;
    
    // In a real application, this would fetch from database with filters
    // For now, return empty array as this is handled by portfolio detail route
    
    return NextResponse.json([], { status: 200 });
  } catch (error) {
    console.error('Error fetching assets:', error);
    return NextResponse.json(
      { error: 'Failed to fetch assets' },
      { status: 500 }
    );
  }
}