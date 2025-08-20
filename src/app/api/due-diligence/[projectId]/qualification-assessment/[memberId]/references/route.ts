import { NextRequest, NextResponse } from 'next/server';
import { ReferenceCheckService } from '@/lib/services/database';

// GET /api/due-diligence/[projectId]/qualification-assessment/[memberId]/references
export async function GET(
  request: NextRequest,
  { params }: { params: { projectId: string; memberId: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const assessmentId = searchParams.get('assessmentId');
    
    if (!assessmentId) {
      return NextResponse.json(
        { error: 'Assessment ID is required' },
        { status: 400 }
      );
    }
    
    const referenceChecks = ReferenceCheckService.getByAssessmentId(assessmentId);
    return NextResponse.json(referenceChecks);
  } catch (error) {
    console.error('Error fetching reference checks:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reference checks' },
      { status: 500 }
    );
  }
}

// POST /api/due-diligence/[projectId]/qualification-assessment/[memberId]/references
export async function POST(
  request: NextRequest,
  { params }: { params: { projectId: string; memberId: string } }
) {
  try {
    const body = await request.json();
    const { qualificationAssessmentId, ...referenceData } = body;
    
    if (!qualificationAssessmentId) {
      return NextResponse.json(
        { error: 'Qualification assessment ID is required' },
        { status: 400 }
      );
    }
    
    const referenceCheck = ReferenceCheckService.create(qualificationAssessmentId, referenceData);
    return NextResponse.json(referenceCheck, { status: 201 });
  } catch (error) {
    console.error('Error creating reference check:', error);
    return NextResponse.json(
      { error: 'Failed to create reference check' },
      { status: 500 }
    );
  }
}

// PUT /api/due-diligence/[projectId]/qualification-assessment/[memberId]/references
export async function PUT(
  request: NextRequest,
  { params }: { params: { projectId: string; memberId: string } }
) {
  try {
    const body = await request.json();
    const { referenceId, ...updateData } = body;
    
    if (!referenceId) {
      return NextResponse.json(
        { error: 'Reference ID is required' },
        { status: 400 }
      );
    }
    
    const updatedReference = ReferenceCheckService.update(referenceId, updateData);
    
    if (!updatedReference) {
      return NextResponse.json(
        { error: 'Reference check not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(updatedReference);
  } catch (error) {
    console.error('Error updating reference check:', error);
    return NextResponse.json(
      { error: 'Failed to update reference check' },
      { status: 500 }
    );
  }
}