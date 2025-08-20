import { NextRequest, NextResponse } from 'next/server';
import { 
  QualificationAssessmentService,
  SkillValidationService,
  ReferenceCheckService,
  PerformanceValidationService,
  CompetencyValidationService,
  CulturalFitAssessmentService,
  QualificationDocumentService
} from '@/lib/services/database';

// GET /api/due-diligence/[projectId]/qualification-assessment/[memberId]
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string; memberId: string }> }
) {
  try {
    const { memberId } = await params;
    
    // Get all qualification assessments for the team member
    const assessments = QualificationAssessmentService.getByTeamMemberId(memberId);
    
    // For each assessment, get the related data
    const enrichedAssessments = assessments.map(assessment => {
      const skillValidations = SkillValidationService.getByAssessmentId(assessment.id);
      const referenceChecks = ReferenceCheckService.getByAssessmentId(assessment.id);
      const performanceValidations = PerformanceValidationService.getByAssessmentId(assessment.id);
      const competencyValidations = CompetencyValidationService.getByAssessmentId(assessment.id);
      const culturalFitAssessments = CulturalFitAssessmentService.getByAssessmentId(assessment.id);
      const documents = QualificationDocumentService.getByAssessmentId(assessment.id);
      
      return {
        ...assessment,
        skillValidations,
        referenceChecks,
        performanceValidations,
        competencyValidations,
        culturalFitAssessments,
        documents
      };
    });
    
    return NextResponse.json(enrichedAssessments);
  } catch (error) {
    console.error('Error fetching qualification assessments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch qualification assessments' },
      { status: 500 }
    );
  }
}

// POST /api/due-diligence/[projectId]/qualification-assessment/[memberId]
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string; memberId: string }> }
) {
  try {
    const { memberId } = await params;
    const body = await request.json();
    
    // Create the qualification assessment
    const assessment = QualificationAssessmentService.create(memberId, body);
    
    return NextResponse.json(assessment, { status: 201 });
  } catch (error) {
    console.error('Error creating qualification assessment:', error);
    return NextResponse.json(
      { error: 'Failed to create qualification assessment' },
      { status: 500 }
    );
  }
}

// PUT /api/due-diligence/[projectId]/qualification-assessment/[memberId]
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string; memberId: string }> }
) {
  try {
    const { memberId } = await params;
    const body = await request.json();
    const { assessmentId, ...updateData } = body;
    
    if (!assessmentId) {
      return NextResponse.json(
        { error: 'Assessment ID is required' },
        { status: 400 }
      );
    }
    
    // Update the qualification assessment
    const updatedAssessment = QualificationAssessmentService.update(assessmentId, updateData);
    
    if (!updatedAssessment) {
      return NextResponse.json(
        { error: 'Qualification assessment not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(updatedAssessment);
  } catch (error) {
    console.error('Error updating qualification assessment:', error);
    return NextResponse.json(
      { error: 'Failed to update qualification assessment' },
      { status: 500 }
    );
  }
}