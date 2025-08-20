import { NextRequest, NextResponse } from 'next/server';
import { 
  ManagementAssessmentService, 
  ManagementTeamMemberService, 
  GPRelationshipService,
  CreateManagementAssessmentData,
  UpdateManagementAssessmentData
} from '@/lib/services/database';

// GET /api/due-diligence/[projectId]/management-assessment
export async function GET(
  request: NextRequest,
  { params }: { params: { projectId: string } }
) {
  try {
    const { projectId } = params;
    
    // Get management assessment for project
    const assessment = ManagementAssessmentService.getByProjectId(projectId);
    
    if (!assessment) {
      return NextResponse.json(
        { error: 'Management assessment not found' },
        { status: 404 }
      );
    }

    // Get related data
    const teamMembers = ManagementTeamMemberService.getByAssessmentId(assessment.id);
    const gpRelationships = GPRelationshipService.getByAssessmentId(assessment.id);

    // Return comprehensive assessment data
    const fullAssessment = {
      ...assessment,
      teamMembers,
      gpRelationships
    };

    return NextResponse.json(fullAssessment);
  } catch (error) {
    console.error('Error fetching management assessment:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/due-diligence/[projectId]/management-assessment
export async function POST(
  request: NextRequest,
  { params }: { params: { projectId: string } }
) {
  try {
    const { projectId } = params;
    const body = await request.json();
    
    // Check if assessment already exists for this project
    const existingAssessment = ManagementAssessmentService.getByProjectId(projectId);
    if (existingAssessment) {
      return NextResponse.json(
        { error: 'Management assessment already exists for this project' },
        { status: 409 }
      );
    }

    // Create new assessment
    const assessmentData: CreateManagementAssessmentData = {
      project_id: projectId,
      workspace_id: body.workspace_id,
      assessor_name: body.assessor_name,
      key_strengths: body.key_strengths || [],
      key_concerns: body.key_concerns || [],
      succession_gaps: body.succession_gaps || [],
      retention_strategies: body.retention_strategies || []
    };

    const assessment = ManagementAssessmentService.create(assessmentData);

    // Create team members if provided
    if (body.teamMembers && Array.isArray(body.teamMembers)) {
      for (const member of body.teamMembers) {
        ManagementTeamMemberService.create(assessment.id, member);
      }
    }

    // Create GP relationships if provided
    if (body.gpRelationships && Array.isArray(body.gpRelationships)) {
      for (const relationship of body.gpRelationships) {
        GPRelationshipService.create(assessment.id, relationship);
      }
    }

    // Return complete assessment with related data
    const teamMembers = ManagementTeamMemberService.getByAssessmentId(assessment.id);
    const gpRelationships = GPRelationshipService.getByAssessmentId(assessment.id);

    const fullAssessment = {
      ...assessment,
      teamMembers,
      gpRelationships
    };

    return NextResponse.json(fullAssessment, { status: 201 });
  } catch (error) {
    console.error('Error creating management assessment:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/due-diligence/[projectId]/management-assessment
export async function PUT(
  request: NextRequest,
  { params }: { params: { projectId: string } }
) {
  try {
    const { projectId } = params;
    const body = await request.json();
    
    // Get existing assessment
    const existingAssessment = ManagementAssessmentService.getByProjectId(projectId);
    if (!existingAssessment) {
      return NextResponse.json(
        { error: 'Management assessment not found' },
        { status: 404 }
      );
    }

    // Update assessment data
    const updateData: UpdateManagementAssessmentData = {
      overall_team_score: body.overall_team_score,
      leadership_score: body.leadership_score,
      strategic_thinking_score: body.strategic_thinking_score,
      execution_capability_score: body.execution_capability_score,
      financial_acumen_score: body.financial_acumen_score,
      industry_expertise_score: body.industry_expertise_score,
      team_dynamics_score: body.team_dynamics_score,
      succession_readiness_score: body.succession_readiness_score,
      retention_risk_score: body.retention_risk_score,
      status: body.status,
      assessor_name: body.assessor_name,
      key_strengths: body.key_strengths,
      key_concerns: body.key_concerns,
      succession_gaps: body.succession_gaps,
      retention_strategies: body.retention_strategies
    };

    // Remove undefined values
    const cleanUpdateData = Object.fromEntries(
      Object.entries(updateData).filter(([_, value]) => value !== undefined)
    ) as UpdateManagementAssessmentData;

    const updatedAssessment = ManagementAssessmentService.update(
      existingAssessment.id, 
      cleanUpdateData
    );

    if (!updatedAssessment) {
      return NextResponse.json(
        { error: 'Failed to update assessment' },
        { status: 500 }
      );
    }

    // Get related data
    const teamMembers = ManagementTeamMemberService.getByAssessmentId(updatedAssessment.id);
    const gpRelationships = GPRelationshipService.getByAssessmentId(updatedAssessment.id);

    const fullAssessment = {
      ...updatedAssessment,
      teamMembers,
      gpRelationships
    };

    return NextResponse.json(fullAssessment);
  } catch (error) {
    console.error('Error updating management assessment:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/due-diligence/[projectId]/management-assessment
export async function DELETE(
  request: NextRequest,
  { params }: { params: { projectId: string } }
) {
  try {
    const { projectId } = params;
    
    // Get existing assessment
    const existingAssessment = ManagementAssessmentService.getByProjectId(projectId);
    if (!existingAssessment) {
      return NextResponse.json(
        { error: 'Management assessment not found' },
        { status: 404 }
      );
    }

    // Delete assessment (cascades to related data)
    const deleted = ManagementAssessmentService.delete(existingAssessment.id);
    
    if (!deleted) {
      return NextResponse.json(
        { error: 'Failed to delete assessment' },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: 'Assessment deleted successfully' });
  } catch (error) {
    console.error('Error deleting management assessment:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}