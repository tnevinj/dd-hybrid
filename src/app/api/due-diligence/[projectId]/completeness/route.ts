import { NextRequest, NextResponse } from 'next/server';
import { 
  OperationalAssessmentService,
  OperationalProcessService,
  OperationalBenchmarkService,
  ManagementAssessmentService,
  ManagementTeamMemberService,
  QualificationAssessmentService
} from '@/lib/services/database';

export interface CompletenessReport {
  project_id: string;
  overall_completeness: number;
  operational_completeness: number;
  management_completeness: number;
  missing_components: string[];
  recommendations: string[];
  data_quality_score: number;
  last_updated: string;
}

// GET /api/due-diligence/[projectId]/completeness
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const { projectId } = await params;
    
    const completenessReport = await generateCompletenessReport(projectId);
    
    return NextResponse.json(completenessReport);
  } catch (error) {
    console.error('Error generating completeness report:', error);
    return NextResponse.json(
      { error: 'Failed to generate completeness report' },
      { status: 500 }
    );
  }
}

async function generateCompletenessReport(projectId: string): Promise<CompletenessReport> {
  const missingComponents: string[] = [];
  const recommendations: string[] = [];
  
  // Check operational assessment
  const operationalAssessment = OperationalAssessmentService.getByProjectId(projectId);
  let operationalCompleteness = 0;
  
  if (!operationalAssessment) {
    missingComponents.push('Operational assessment not found');
    operationalCompleteness = 0;
  } else {
    const processes = OperationalProcessService.getByAssessmentId(operationalAssessment.id);
    const benchmarks = OperationalBenchmarkService.getByAssessmentId(operationalAssessment.id);
    
    let operationalScore = 0;
    
    // Check operational scores (30 points)
    if (operationalAssessment.overall_score > 0) operationalScore += 10;
    if (operationalAssessment.process_efficiency_score > 0) operationalScore += 5;
    if (operationalAssessment.digital_maturity_score > 0) operationalScore += 5;
    if (operationalAssessment.quality_management_score > 0) operationalScore += 5;
    if (operationalAssessment.supply_chain_score > 0) operationalScore += 5;
    
    // Check processes (40 points)
    if (processes.length === 0) {
      missingComponents.push('No operational processes defined');
      recommendations.push('Add operational processes to enable detailed assessment');
    } else {
      operationalScore += Math.min(40, processes.length * 10); // Up to 4 processes for full score
    }
    
    // Check benchmarks (30 points)
    if (benchmarks.length === 0) {
      missingComponents.push('No operational benchmarks defined');
      recommendations.push('Add industry benchmarks for score context');
    } else {
      operationalScore += Math.min(30, benchmarks.length * 5); // Up to 6 benchmarks for full score
    }
    
    operationalCompleteness = Math.min(100, operationalScore);
  }
  
  // Check management assessment
  const managementAssessment = ManagementAssessmentService.getByProjectId(projectId);
  let managementCompleteness = 0;
  
  if (!managementAssessment) {
    missingComponents.push('Management assessment not found');
    managementCompleteness = 0;
  } else {
    const teamMembers = ManagementTeamMemberService.getByAssessmentId(managementAssessment.id);
    
    let managementScore = 0;
    
    // Check management scores (40 points)
    if (managementAssessment.overall_team_score > 0) managementScore += 15;
    if (managementAssessment.leadership_score > 0) managementScore += 5;
    if (managementAssessment.strategic_thinking_score > 0) managementScore += 5;
    if (managementAssessment.execution_capability_score > 0) managementScore += 5;
    if (managementAssessment.succession_readiness_score > 0) managementScore += 5;
    if (managementAssessment.retention_risk_score > 0) managementScore += 5;
    
    // Check team members (40 points)
    if (teamMembers.length === 0) {
      missingComponents.push('No team members defined');
      recommendations.push('Add key management team members');
    } else {
      managementScore += Math.min(40, teamMembers.length * 10); // Up to 4 members for full score
      
      // Check qualification assessments (20 points)
      let qualificationCount = 0;
      for (const member of teamMembers) {
        const qualifications = QualificationAssessmentService.getByTeamMemberId(member.id);
        if (qualifications.length > 0) {
          qualificationCount++;
        }
      }
      
      if (qualificationCount === 0) {
        missingComponents.push('No qualification assessments completed');
        recommendations.push('Complete qualification assessments for team members');
      } else {
        managementScore += Math.min(20, (qualificationCount / teamMembers.length) * 20);
      }
    }
    
    managementCompleteness = Math.min(100, managementScore);
  }
  
  // Calculate overall completeness
  const overallCompleteness = Math.round((operationalCompleteness + managementCompleteness) / 2);
  
  // Calculate data quality score
  let dataQualityScore = 100;
  
  // Penalize for missing components
  dataQualityScore -= missingComponents.length * 10;
  
  // Penalize for low scores (indicates empty or placeholder data)
  if (operationalAssessment && operationalAssessment.overall_score === 0) {
    dataQualityScore -= 15;
  }
  if (managementAssessment && managementAssessment.overall_team_score === 0) {
    dataQualityScore -= 15;
  }
  
  dataQualityScore = Math.max(0, dataQualityScore);
  
  // Generate additional recommendations based on completeness
  if (overallCompleteness < 50) {
    recommendations.push('Consider using the seed data API to populate comprehensive demo data');
  }
  if (operationalCompleteness < managementCompleteness) {
    recommendations.push('Focus on completing operational assessment components');
  } else if (managementCompleteness < operationalCompleteness) {
    recommendations.push('Focus on completing management assessment components');
  }
  
  if (operationalCompleteness > 80 && managementCompleteness > 80) {
    recommendations.push('Assessment data is comprehensive - ready for analysis');
  }
  
  return {
    project_id: projectId,
    overall_completeness: overallCompleteness,
    operational_completeness: operationalCompleteness,
    management_completeness: managementCompleteness,
    missing_components: missingComponents,
    recommendations: recommendations,
    data_quality_score: dataQualityScore,
    last_updated: new Date().toISOString()
  };
}