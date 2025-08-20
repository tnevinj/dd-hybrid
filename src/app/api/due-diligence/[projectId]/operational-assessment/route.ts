import { NextRequest, NextResponse } from 'next/server';
import { 
  OperationalAssessmentService, 
  OperationalMetricsService, 
  OperationalProcessService, 
  OperationalBenchmarkService,
  CreateOperationalAssessmentData,
  UpdateOperationalAssessmentData
} from '@/lib/services/database';

// GET /api/due-diligence/[projectId]/operational-assessment
export async function GET(
  request: NextRequest,
  { params }: { params: { projectId: string } }
) {
  try {
    const { projectId } = params;
    
    // Get operational assessment for project
    const assessment = OperationalAssessmentService.getByProjectId(projectId);
    
    if (!assessment) {
      return NextResponse.json(
        { error: 'Operational assessment not found' },
        { status: 404 }
      );
    }

    // Get related data
    const metrics = OperationalMetricsService.getByAssessmentId(assessment.id);
    const processes = OperationalProcessService.getByAssessmentId(assessment.id);
    const benchmarks = OperationalBenchmarkService.getByAssessmentId(assessment.id);

    // Return comprehensive assessment data
    const fullAssessment = {
      ...assessment,
      metrics,
      processes,
      benchmarks
    };

    return NextResponse.json(fullAssessment);
  } catch (error) {
    console.error('Error fetching operational assessment:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/due-diligence/[projectId]/operational-assessment
export async function POST(
  request: NextRequest,
  { params }: { params: { projectId: string } }
) {
  try {
    const { projectId } = params;
    const body = await request.json();
    
    // Check if assessment already exists for this project
    const existingAssessment = OperationalAssessmentService.getByProjectId(projectId);
    if (existingAssessment) {
      return NextResponse.json(
        { error: 'Operational assessment already exists for this project' },
        { status: 409 }
      );
    }

    // Create new assessment
    const assessmentData: CreateOperationalAssessmentData = {
      project_id: projectId,
      workspace_id: body.workspace_id,
      assessor_name: body.assessor_name,
      notes: body.notes,
      recommendations: body.recommendations || []
    };

    const assessment = OperationalAssessmentService.create(assessmentData);

    // Create initial metrics if provided
    if (body.metrics && Array.isArray(body.metrics)) {
      for (const metric of body.metrics) {
        OperationalMetricsService.create(assessment.id, metric);
      }
    }

    // Create initial processes if provided
    if (body.processes && Array.isArray(body.processes)) {
      for (const process of body.processes) {
        OperationalProcessService.create(assessment.id, process);
      }
    }

    // Create initial benchmarks if provided
    if (body.benchmarks && Array.isArray(body.benchmarks)) {
      for (const benchmark of body.benchmarks) {
        OperationalBenchmarkService.create(assessment.id, benchmark);
      }
    }

    // Return complete assessment with related data
    const metrics = OperationalMetricsService.getByAssessmentId(assessment.id);
    const processes = OperationalProcessService.getByAssessmentId(assessment.id);
    const benchmarks = OperationalBenchmarkService.getByAssessmentId(assessment.id);

    const fullAssessment = {
      ...assessment,
      metrics,
      processes,
      benchmarks
    };

    return NextResponse.json(fullAssessment, { status: 201 });
  } catch (error) {
    console.error('Error creating operational assessment:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/due-diligence/[projectId]/operational-assessment
export async function PUT(
  request: NextRequest,
  { params }: { params: { projectId: string } }
) {
  try {
    const { projectId } = params;
    const body = await request.json();
    
    // Get existing assessment
    const existingAssessment = OperationalAssessmentService.getByProjectId(projectId);
    if (!existingAssessment) {
      return NextResponse.json(
        { error: 'Operational assessment not found' },
        { status: 404 }
      );
    }

    // Update assessment data
    const updateData: UpdateOperationalAssessmentData = {
      overall_score: body.overall_score,
      process_efficiency_score: body.process_efficiency_score,
      digital_maturity_score: body.digital_maturity_score,
      quality_management_score: body.quality_management_score,
      supply_chain_score: body.supply_chain_score,
      automation_readiness_score: body.automation_readiness_score,
      cost_efficiency_score: body.cost_efficiency_score,
      scalability_score: body.scalability_score,
      status: body.status,
      assessor_name: body.assessor_name,
      notes: body.notes,
      recommendations: body.recommendations
    };

    // Remove undefined values
    const cleanUpdateData = Object.fromEntries(
      Object.entries(updateData).filter(([_, value]) => value !== undefined)
    ) as UpdateOperationalAssessmentData;

    const updatedAssessment = OperationalAssessmentService.update(
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
    const metrics = OperationalMetricsService.getByAssessmentId(updatedAssessment.id);
    const processes = OperationalProcessService.getByAssessmentId(updatedAssessment.id);
    const benchmarks = OperationalBenchmarkService.getByAssessmentId(updatedAssessment.id);

    const fullAssessment = {
      ...updatedAssessment,
      metrics,
      processes,
      benchmarks
    };

    return NextResponse.json(fullAssessment);
  } catch (error) {
    console.error('Error updating operational assessment:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/due-diligence/[projectId]/operational-assessment
export async function DELETE(
  request: NextRequest,
  { params }: { params: { projectId: string } }
) {
  try {
    const { projectId } = params;
    
    // Get existing assessment
    const existingAssessment = OperationalAssessmentService.getByProjectId(projectId);
    if (!existingAssessment) {
      return NextResponse.json(
        { error: 'Operational assessment not found' },
        { status: 404 }
      );
    }

    // Delete assessment (cascades to related data)
    const deleted = OperationalAssessmentService.delete(existingAssessment.id);
    
    if (!deleted) {
      return NextResponse.json(
        { error: 'Failed to delete assessment' },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: 'Assessment deleted successfully' });
  } catch (error) {
    console.error('Error deleting operational assessment:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}