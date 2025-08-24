import { NextResponse } from 'next/server';
import { getFundBenchmarkData } from '@/lib/database';

export async function GET() {
  try {
    const benchmarkData = getFundBenchmarkData();
    
    return NextResponse.json(benchmarkData);
  } catch (error) {
    console.error('Error fetching benchmark data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch benchmark data' },
      { status: 500 }
    );
  }
}
