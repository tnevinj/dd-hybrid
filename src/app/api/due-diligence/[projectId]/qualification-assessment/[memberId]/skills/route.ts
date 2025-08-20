import { NextRequest, NextResponse } from 'next/server';
import { SkillValidationService } from '@/lib/services/database';

// GET /api/due-diligence/[projectId]/qualification-assessment/[memberId]/skills
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
    
    const skillValidations = SkillValidationService.getByAssessmentId(assessmentId);
    return NextResponse.json(skillValidations);
  } catch (error) {
    console.error('Error fetching skill validations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch skill validations' },
      { status: 500 }
    );
  }
}

// POST /api/due-diligence/[projectId]/qualification-assessment/[memberId]/skills
export async function POST(
  request: NextRequest,
  { params }: { params: { projectId: string; memberId: string } }
) {
  try {
    const body = await request.json();
    const { qualificationAssessmentId, ...skillData } = body;
    
    if (!qualificationAssessmentId) {
      return NextResponse.json(
        { error: 'Qualification assessment ID is required' },
        { status: 400 }
      );
    }
    
    const skillValidation = SkillValidationService.create(qualificationAssessmentId, skillData);
    return NextResponse.json(skillValidation, { status: 201 });
  } catch (error) {
    console.error('Error creating skill validation:', error);
    return NextResponse.json(
      { error: 'Failed to create skill validation' },
      { status: 500 }
    );
  }
}

// PUT /api/due-diligence/[projectId]/qualification-assessment/[memberId]/skills
export async function PUT(
  request: NextRequest,
  { params }: { params: { projectId: string; memberId: string } }
) {
  try {
    const body = await request.json();
    const { skillId, ...updateData } = body;
    
    if (!skillId) {
      return NextResponse.json(
        { error: 'Skill ID is required' },
        { status: 400 }
      );
    }
    
    const updatedSkill = SkillValidationService.update(skillId, updateData);
    
    if (!updatedSkill) {
      return NextResponse.json(
        { error: 'Skill validation not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(updatedSkill);
  } catch (error) {
    console.error('Error updating skill validation:', error);
    return NextResponse.json(
      { error: 'Failed to update skill validation' },
      { status: 500 }
    );
  }
}