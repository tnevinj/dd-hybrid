import { NextResponse } from 'next/server';
import { getInvestmentOpportunities } from '@/lib/database';

export async function GET() {
  try {
    const opportunities = getInvestmentOpportunities();
    
    return NextResponse.json(opportunities);
  } catch (error) {
    console.error('Error fetching investment opportunities:', error);
    return NextResponse.json(
      { error: 'Failed to fetch investment opportunities data' },
      { status: 500 }
    );
  }
}
