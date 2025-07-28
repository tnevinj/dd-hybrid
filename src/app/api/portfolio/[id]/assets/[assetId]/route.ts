import { NextRequest, NextResponse } from 'next/server';
import { UnifiedAsset } from '@/types/portfolio';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string; assetId: string } }
) {
  try {
    const portfolioId = params.id;
    const assetId = params.assetId;
    
    // In a real application, this would fetch from database
    // For now, return a mock asset based on the ID
    
    return NextResponse.json(
      { error: 'Asset not found' },
      { status: 404 }
    );
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
  { params }: { params: { id: string; assetId: string } }
) {
  try {
    const portfolioId = params.id;
    const assetId = params.assetId;
    const body = await request.json();
    
    // In a real application, this would update the database
    const updatedAsset = {
      ...body,
      id: assetId,
      lastUpdated: new Date().toISOString(),
    };
    
    return NextResponse.json(updatedAsset, { status: 200 });
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
  { params }: { params: { id: string; assetId: string } }
) {
  try {
    const portfolioId = params.id;
    const assetId = params.assetId;
    
    // In a real application, this would delete from database
    // and update portfolio totals
    
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