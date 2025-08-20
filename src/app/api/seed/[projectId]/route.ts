import { NextRequest, NextResponse } from 'next/server';
import { seedProjectData } from '@/lib/seed-data';

// POST /api/seed/[projectId]
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const { projectId } = await params;
    const { searchParams } = new URL(request.url);
    const template = searchParams.get('template') as 'technology' | 'manufacturing' | 'financial' | 'healthcare' || 'technology';
    
    // Seed data for the project
    const result = seedProjectData(projectId, template);
    
    return NextResponse.json({
      message: `Successfully seeded data for project ${projectId}`,
      operational: result.operational.id,
      management: result.management.id
    }, { status: 201 });
  } catch (error) {
    console.error('Error seeding project data:', error);
    return NextResponse.json(
      { error: 'Failed to seed project data' },
      { status: 500 }
    );
  }
}