import { NextRequest, NextResponse } from 'next/server';
import { WorkspaceService } from '@/lib/services/database/workspace-service';
import { WorkProductService } from '@/lib/services/database/work-product-service';
import { seedProjectData } from '@/lib/seed-data';
import { 
  OperationalAssessmentService,
  ManagementAssessmentService,
  ManagementTeamMemberService,
  QualificationAssessmentService 
} from '@/lib/services/database';

interface IndustryTemplate {
  name: string;
  sector: string;
  dealValue: number;
  teamMembers: string[];
  stage: string;
  geography: string;
  riskRating: 'low' | 'medium' | 'high';
  template: 'technology' | 'manufacturing' | 'financial' | 'healthcare';
  metadata: any;
}

const INDUSTRY_TEMPLATES: IndustryTemplate[] = [
  {
    name: 'TechCorp AI Platform Due Diligence',
    sector: 'Technology',
    dealValue: 75000000, // $75M
    teamMembers: ['Sarah Chen', 'Michael Rodriguez', 'Lisa Wong', 'David Kim'],
    stage: 'due-diligence',
    geography: 'North America',
    riskRating: 'medium',
    template: 'technology',
    metadata: {
      deal_type: 'growth_equity',
      target_irr: 25,
      hold_period: 5,
      competitive_process: true,
      management_rollover: 30,
      key_metrics: {
        arr: 15000000,
        growth_rate: 35,
        gross_margin: 85,
        nrr: 98
      }
    }
  },
  {
    name: 'FinanceFirst Digital Banking Acquisition',
    sector: 'Financial Services',
    dealValue: 125000000, // $125M
    teamMembers: ['Patricia Williams', 'James Martinez', 'Angela Chen', 'Michael Thompson'],
    stage: 'investment-committee',
    geography: 'North America',
    riskRating: 'high',
    template: 'financial',
    metadata: {
      deal_type: 'buyout',
      regulatory_approval_required: true,
      compliance_rating: 'A',
      capital_ratio: 12.5,
      key_metrics: {
        assets_under_management: 2500000000,
        cost_income_ratio: 58,
        digital_adoption: 84,
        regulatory_score: 92
      }
    }
  },
  {
    name: 'HealthTech Regional Hospital Network',
    sector: 'Healthcare',
    dealValue: 95000000, // $95M
    teamMembers: ['Dr. Sarah Johnson', 'Robert Martinez', 'Dr. Lisa Chen', 'Jennifer Thompson'],
    stage: 'due-diligence',
    geography: 'North America',
    riskRating: 'medium',
    template: 'healthcare',
    metadata: {
      deal_type: 'buyout',
      regulatory_oversight: 'CMS',
      accreditation: 'Joint_Commission',
      key_metrics: {
        beds: 450,
        patient_satisfaction: 87,
        clinical_quality: 91,
        ebitda_margin: 18
      }
    }
  },
  {
    name: 'IndustrialTech Manufacturing Platform',
    sector: 'Manufacturing',
    dealValue: 180000000, // $180M
    teamMembers: ['Robert Steel', 'Maria Gonzalez', 'James Patterson', 'Susan Clarke'],
    stage: 'sourcing',
    geography: 'Global',
    riskRating: 'medium',
    template: 'manufacturing',
    metadata: {
      deal_type: 'buyout',
      geographic_presence: ['North America', 'Europe', 'Asia'],
      key_metrics: {
        revenue: 450000000,
        oee: 82,
        first_pass_yield: 88,
        automation_level: 65
      }
    }
  }
];

// POST /api/workspace-integration/seed
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { industry, all } = body;

    const results = [];

    if (all) {
      // Seed all industry templates
      for (const template of INDUSTRY_TEMPLATES) {
        const result = await createIntegratedWorkspace(template);
        results.push(result);
      }
    } else if (industry && INDUSTRY_TEMPLATES.find(t => t.template === industry)) {
      // Seed specific industry
      const template = INDUSTRY_TEMPLATES.find(t => t.template === industry)!;
      const result = await createIntegratedWorkspace(template);
      results.push(result);
    } else {
      return NextResponse.json(
        { error: 'Invalid industry template. Use: technology, financial, healthcare, manufacturing, or set all=true' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      message: 'Successfully created integrated workspace(s)',
      results: results
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating integrated workspace:', error);
    return NextResponse.json(
      { error: 'Failed to create integrated workspace' },
      { status: 500 }
    );
  }
}

async function createIntegratedWorkspace(template: IndustryTemplate) {
  const projectId = `${template.template}-project-${Date.now()}`;
  
  // Step 1: Seed due diligence assessment data
  console.log(`Seeding assessment data for project: ${projectId}`);
  const assessmentData = seedProjectData(projectId, template.template);
  
  // Step 2: Create workspace linked to the project
  console.log(`Creating workspace for project: ${projectId}`);
  const workspace = WorkspaceService.create({
    name: template.name,
    type: 'deal',
    status: 'active',
    sector: template.sector,
    deal_value: template.dealValue * 100, // Convert to cents
    stage: template.stage,
    geography: template.geography,
    risk_rating: template.riskRating,
    priority: 'high',
    progress: 75,
    team_members: template.teamMembers,
    metadata: {
      ...template.metadata,
      project_id: projectId, // Link to due diligence project
      operational_assessment_id: assessmentData.operational.id,
      management_assessment_id: assessmentData.management.id,
      industry_template: template.template
    }
  });

  // Step 3: Generate assessment-informed work product
  console.log(`Generating work product for workspace: ${workspace.id}`);
  const workProduct = await generateAssessmentInformedWorkProduct(workspace, projectId, template);

  return {
    workspace_id: workspace.id,
    project_id: projectId,
    operational_assessment_id: assessmentData.operational.id,
    management_assessment_id: assessmentData.management.id,
    work_product_id: workProduct.id,
    industry: template.template
  };
}

async function generateAssessmentInformedWorkProduct(workspace: any, projectId: string, template: IndustryTemplate) {
  // Get assessment data
  const operationalAssessment = OperationalAssessmentService.getByProjectId(projectId);
  const managementAssessment = ManagementAssessmentService.getByProjectId(projectId);
  const teamMembers = managementAssessment ? ManagementTeamMemberService.getByAssessmentId(managementAssessment.id) : [];
  
  // Get qualification assessments for team members
  const qualificationData: any[] = [];
  for (const member of teamMembers) {
    const qualifications = QualificationAssessmentService.getByTeamMemberId(member.id);
    if (qualifications.length > 0) {
      qualificationData.push({
        member: member,
        qualifications: qualifications
      });
    }
  }

  // Generate content based on assessment data
  const executiveSummary = generateExecutiveSummary(workspace, operationalAssessment, managementAssessment, template);
  const investmentThesis = generateInvestmentThesis(operationalAssessment, managementAssessment, qualificationData, template);
  const managementAssessmentSection = generateManagementSection(managementAssessment, qualificationData, template);
  const operationalDueDiligence = generateOperationalSection(operationalAssessment, template);

  // Create work product with assessment-informed content
  const workProduct = WorkProductService.create({
    workspace_id: workspace.id,
    title: `${template.name} - Investment Committee Memo`,
    type: 'IC_MEMO',
    status: 'DRAFT',
    sections: [
      {
        id: 'exec-summary',
        title: 'Executive Summary',
        order: 1,
        content: executiveSummary,
        type: 'text',
        required: true,
        generationStrategy: 'assessment-informed'
      },
      {
        id: 'investment-thesis',
        title: 'Investment Thesis',
        order: 2,
        content: investmentThesis,
        type: 'text',
        required: true,
        generationStrategy: 'assessment-informed'
      },
      {
        id: 'management-assessment',
        title: 'Management Team Assessment',
        order: 3,
        content: managementAssessmentSection,
        type: 'text',
        required: true,
        generationStrategy: 'assessment-informed'
      },
      {
        id: 'operational-dd',
        title: 'Operational Due Diligence',
        order: 4,
        content: operationalDueDiligence,
        type: 'text',
        required: true,
        generationStrategy: 'assessment-informed'
      }
    ],
    metadata: {
      projectContext: {
        projectId: projectId,
        workspaceId: workspace.id,
        operationalAssessmentId: operationalAssessment?.id,
        managementAssessmentId: managementAssessment?.id,
        industryTemplate: template.template
      },
      generatedAt: new Date().toISOString(),
      generationMode: 'assessment-informed'
    },
    created_by: 'system@platform.com'
  });

  return workProduct;
}

function generateExecutiveSummary(workspace: any, operationalAssessment: any, managementAssessment: any, template: IndustryTemplate): string {
  const dealSize = (workspace.deal_value / 100 / 1000000).toFixed(0); // Convert to millions
  const overallScore = operationalAssessment?.overall_score || 75;
  const teamScore = managementAssessment?.overall_team_score || 85;
  
  return `# Executive Summary

${template.name} represents a compelling $${dealSize}M ${template.metadata.deal_type.replace('_', ' ')} investment opportunity in the ${template.sector.toLowerCase()} sector.

**Key Investment Highlights:**
- **Operational Excellence**: Overall operational score of ${overallScore}/100 based on comprehensive process assessment
- **Strong Management Team**: Team effectiveness score of ${teamScore}/100 with experienced industry leaders
- **Market Position**: ${template.riskRating === 'low' ? 'Low-risk' : template.riskRating === 'medium' ? 'Moderate-risk' : 'High-reward'} opportunity in ${template.geography}
- **Growth Trajectory**: Currently in ${template.stage.replace('-', ' ')} stage with strong fundamentals

**Assessment Summary:**
Our comprehensive due diligence assessment reveals ${overallScore >= 80 ? 'strong' : overallScore >= 70 ? 'solid' : 'developing'} operational capabilities and ${teamScore >= 85 ? 'exceptional' : teamScore >= 75 ? 'strong' : 'capable'} management team performance.

**Investment Recommendation:** ${overallScore >= 75 && teamScore >= 80 ? 'Proceed with investment' : 'Consider with conditions'} - target IRR of ${template.metadata.target_irr || 20}% over ${template.metadata.hold_period || 5}-year hold period.`;
}

function generateInvestmentThesis(operationalAssessment: any, managementAssessment: any, qualificationData: any[], template: IndustryTemplate): string {
  const processEfficiency = operationalAssessment?.process_efficiency_score || 75;
  const digitalMaturity = operationalAssessment?.digital_maturity_score || 70;
  const successionReadiness = managementAssessment?.succession_readiness_score || 70;
  
  return `# Investment Thesis

## Operational Foundation
Our assessment reveals ${processEfficiency >= 80 ? 'highly efficient' : processEfficiency >= 70 ? 'well-structured' : 'developing'} operational processes with a process efficiency score of ${processEfficiency}/100. Digital maturity stands at ${digitalMaturity}/100, ${digitalMaturity >= 80 ? 'indicating strong technology adoption' : digitalMaturity >= 70 ? 'showing solid digital capabilities' : 'presenting modernization opportunities'}.

## Management Excellence
The leadership team demonstrates ${managementAssessment?.overall_team_score >= 85 ? 'exceptional' : managementAssessment?.overall_team_score >= 75 ? 'strong' : 'capable'} performance across key dimensions:
- **Leadership Score**: ${managementAssessment?.leadership_score || 85}/100
- **Strategic Thinking**: ${managementAssessment?.strategic_thinking_score || 87}/100  
- **Execution Capability**: ${managementAssessment?.execution_capability_score || 91}/100
- **Succession Readiness**: ${successionReadiness}/100

## Qualification Assessment Insights
${qualificationData.length > 0 ? `Our comprehensive qualification assessments of ${qualificationData.length} key team members reveal:
${qualificationData.slice(0, 2).map(qd => `- **${qd.member.name}** (${qd.member.position}): ${qd.qualifications.length} completed assessments with strong validation across skills, references, and performance`).join('\n')}` : 'Management qualification assessments pending completion.'}

## Value Creation Strategy
Based on our operational assessment, key value creation opportunities include:
${operationalAssessment?.recommendations?.slice(0, 2).map((rec: any) => `- **${rec.title}**: ${rec.description} (Est. Impact: ${rec.estimated_impact}/100)`).join('\n') || '- Process optimization and digital transformation initiatives'}

## Risk Assessment
${template.riskRating === 'low' ? 'Low risk profile supported by strong operational metrics and proven management team.' : 
  template.riskRating === 'medium' ? 'Moderate risk profile balanced by solid fundamentals and experienced leadership.' :
  'Higher risk profile offset by significant upside potential and strong value creation opportunities.'}`;
}

function generateManagementSection(managementAssessment: any, qualificationData: any[], template: IndustryTemplate): string {
  if (!managementAssessment) {
    return `# Management Team Assessment\n\nAssessment data not available for ${template.name}.`;
  }

  return `# Management Team Assessment

## Overall Team Performance
**Team Effectiveness Score**: ${managementAssessment.overall_team_score}/100

### Core Leadership Metrics
- **Leadership Capability**: ${managementAssessment.leadership_score}/100
- **Strategic Thinking**: ${managementAssessment.strategic_thinking_score}/100
- **Execution Capability**: ${managementAssessment.execution_capability_score}/100
- **Financial Acumen**: ${managementAssessment.financial_acumen_score}/100
- **Industry Expertise**: ${managementAssessment.industry_expertise_score}/100

## Key Strengths
${managementAssessment.key_strengths?.map((strength: string) => `- ${strength}`).join('\n') || 'Assessment data pending'}

## Areas of Focus
${managementAssessment.key_concerns?.map((concern: string) => `- ${concern}`).join('\n') || 'No significant concerns identified'}

## Qualification Assessment Summary
${qualificationData.length > 0 ? `Completed comprehensive qualification assessments for ${qualificationData.length} key team members:

${qualificationData.map(qd => {
  const skillsCount = qd.qualifications.filter((q: any) => q.assessment_type === 'skills').length;
  const referencesCount = qd.qualifications.filter((q: any) => q.assessment_type === 'references').length;
  const avgScore = qd.qualifications.reduce((sum: number, q: any) => sum + q.overall_qualification_score, 0) / qd.qualifications.length;
  
  return `### ${qd.member.name} - ${qd.member.position}
- **Tenure**: ${qd.member.tenure_years} years
- **Qualification Score**: ${avgScore.toFixed(0)}/100 (${qd.qualifications.length} assessments)
- **Assessment Coverage**: ${skillsCount > 0 ? 'Skills validation' : ''}${referencesCount > 0 ? ', Reference checks' : ''}${qd.qualifications.some((q: any) => q.assessment_type === 'performance') ? ', Performance validation' : ''}
- **Flight Risk**: ${qd.member.retention_risk || 'Low'}`;
}).join('\n\n')}` : 'Qualification assessments in progress for key team members.'}

## Succession Planning
**Succession Readiness Score**: ${managementAssessment.succession_readiness_score}/100

### Identified Gaps
${managementAssessment.succession_gaps?.map((gap: string) => `- ${gap}`).join('\n') || 'No critical succession gaps identified'}

### Retention Strategies
${managementAssessment.retention_strategies?.map((strategy: string) => `- ${strategy}`).join('\n') || 'Standard retention programs in place'}`;
}

function generateOperationalSection(operationalAssessment: any, template: IndustryTemplate): string {
  if (!operationalAssessment) {
    return `# Operational Due Diligence\n\nOperational assessment data not available for ${template.name}.`;
  }

  return `# Operational Due Diligence

## Operational Performance Overview
**Overall Operational Score**: ${operationalAssessment.overall_score}/100

### Key Performance Metrics
- **Process Efficiency**: ${operationalAssessment.process_efficiency_score}/100
- **Digital Maturity**: ${operationalAssessment.digital_maturity_score}/100
- **Quality Management**: ${operationalAssessment.quality_management_score}/100
- **Supply Chain Performance**: ${operationalAssessment.supply_chain_score}/100
- **Automation Readiness**: ${operationalAssessment.automation_readiness_score}/100
- **Cost Efficiency**: ${operationalAssessment.cost_efficiency_score}/100
- **Scalability**: ${operationalAssessment.scalability_score}/100

## Strategic Recommendations
Based on our operational assessment, we have identified the following value creation opportunities:

${operationalAssessment.recommendations?.map((rec: any, index: number) => 
  `### ${index + 1}. ${rec.title}
**Category**: ${rec.category} | **Priority**: ${rec.priority} | **Impact Score**: ${rec.estimated_impact}/100

${rec.description}

- **Estimated Investment**: $${(rec.estimated_cost / 1000).toFixed(0)}K
- **Implementation Timeline**: ${rec.estimated_timeframe} months
- **Expected ROI**: ${rec.expected_roi}x
- **Complexity**: ${rec.implementation_complexity}
- **Confidence Level**: ${(rec.confidence_level * 100).toFixed(0)}%`
).join('\n\n') || 'Detailed recommendations under development'}

## Industry Positioning
${template.template === 'technology' ? 
  'Strong position in technology sector with above-average digital maturity and automation readiness.' :
  template.template === 'financial' ?
  'Solid positioning in financial services with strong regulatory compliance and risk management capabilities.' :
  template.template === 'healthcare' ?
  'Well-positioned in healthcare sector with strong quality management and patient care focus.' :
  'Strong manufacturing operations with opportunities for lean improvement and automation enhancement.'}

## Risk Mitigation
**Overall Risk Rating**: ${template.riskRating}

Key operational risks and mitigation strategies have been assessed as part of our comprehensive due diligence process. ${operationalAssessment.overall_score >= 80 ? 'Operational risks are well-managed with strong processes in place.' : operationalAssessment.overall_score >= 70 ? 'Moderate operational risks with clear improvement pathways identified.' : 'Operational risks require active management and improvement initiatives.'}`;
}