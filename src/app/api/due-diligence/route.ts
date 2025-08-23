import { NextRequest, NextResponse } from 'next/server';
import { InvestmentService } from '@/lib/services/database/investment-service';

// Simple interface for due diligence project data
interface DueDiligenceProject {
  id: string;
  name: string;
  targetCompany: string;
  dealValue: number;
  sector: string;
  stage: string;
  location: string;
  status: string;
  priority: string;
  progress: number;
  riskLevel: string;
  startDate: string;
  targetClose?: string;
  leadAnalyst: string;
  teamSize: number;
  totalTasks: number;
  completedTasks: number;
  findings: any[];
  riskAssessment: {
    overall: number;
    financial: number;
    operational: number;
    strategic: number;
    legal: number;
    market: number;
  };
  keyMetrics: {
    revenue: number;
    ebitda: number;
    employees: number;
    marketShare: number;
  };
  lastUpdated: string;
}

// Transform unified investment to due diligence project format
function transformInvestmentToDDProject(investment: any): DueDiligenceProject {
  return {
    id: investment.id,
    name: investment.name,
    targetCompany: investment.target_company || investment.name,
    dealValue: investment.acquisition_value ? investment.acquisition_value / 100 : 0,
    sector: investment.sector || '',
    stage: investment.stage || 'initial',
    location: investment.location_city && investment.location_country 
      ? `${investment.location_city}, ${investment.location_country}`
      : investment.location_region || 'Unknown',
    status: investment.status || 'in-progress',
    priority: investment.priority || 'medium',
    progress: investment.progress || 0,
    riskLevel: investment.risk_rating || 'medium',
    startDate: investment.start_date || investment.created_at,
    targetClose: investment.target_close_date,
    leadAnalyst: investment.lead_analyst || 'Unassigned',
    teamSize: investment.team_size || 0,
    totalTasks: investment.total_tasks || 0,
    completedTasks: investment.completed_tasks || 0,
    findings: investment.findings ? JSON.parse(investment.findings) : [],
    riskAssessment: investment.risk_assessment ? JSON.parse(investment.risk_assessment) : {
      overall: 5.0,
      financial: 5.0,
      operational: 5.0,
      strategic: 5.0,
      legal: 5.0,
      market: 5.0
    },
    keyMetrics: investment.key_metrics ? JSON.parse(investment.key_metrics) : {
      revenue: 0,
      ebitda: 0,
      employees: 0,
      marketShare: 0
    },
    lastUpdated: investment.last_updated || investment.updated_at
  };
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const includeDetails = searchParams.get('includeDetails') === 'true';
    const status = searchParams.get('status');
    const priority = searchParams.get('priority');

    // Get due diligence projects from unified investments (filter by status)
    let investments = InvestmentService.getByStatus('due_diligence');
    
    // Apply additional filters
    if (status) {
      investments = investments.filter((inv: any) => inv.status === status.toLowerCase());
    }
    
    if (priority) {
      investments = investments.filter((inv: any) => inv.priority === priority.toLowerCase());
    }

    // Transform to due diligence format
    const projects = investments.map(transformInvestmentToDDProject);

    // Get metrics
    const totalDealValue = projects.reduce((sum: number, p: DueDiligenceProject) => sum + p.dealValue, 0);
    const averageProgress = projects.length > 0 
      ? Math.round(projects.reduce((sum: number, p: DueDiligenceProject) => sum + p.progress, 0) / projects.length)
      : 0;
    const averageRisk = projects.length > 0
      ? Math.round(projects.reduce((sum: number, p: DueDiligenceProject) => sum + p.riskAssessment.overall, 0) / projects.length * 10) / 10
      : 5.0;

    const metrics = {
      activeProjects: projects.filter((p: DueDiligenceProject) => p.status !== 'completed').length,
      totalDealValue,
      averageProgress,
      averageRisk,
      highPriority: projects.filter((p: DueDiligenceProject) => p.priority === 'high').length,
      upcomingDeadlines: projects.filter((p: DueDiligenceProject) => 
        p.targetClose && new Date(p.targetClose) > new Date() &&
        new Date(p.targetClose) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      ).length
    };

    const response = {
      success: true,
      metrics,
      projects: includeDetails ? projects : projects.map((p: DueDiligenceProject) => ({ 
        id: p.id, 
        name: p.name, 
        status: p.status, 
        progress: p.progress 
      })),
      timestamp: new Date().toISOString()
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching due diligence data:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch due diligence data',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Convert due diligence format to unified investment format
    const investmentData = {
      name: body.name,
      investment_type: 'external' as const, // Use external for due diligence projects
      asset_type: 'due_diligence',
      target_company: body.targetCompany,
      acquisition_value: Math.round(body.dealValue * 100), // Convert to cents
      sector: body.sector,
      stage: body.stage,
      location_city: body.location?.split(',')[0]?.trim(),
      location_country: body.location?.split(',')[1]?.trim(),
      status: 'due_diligence' as const,
      priority: body.priority?.toLowerCase(),
      progress: body.progress || 0,
      risk_rating: body.riskLevel?.toLowerCase(),
      start_date: body.startDate,
      target_close_date: body.targetClose,
      lead_analyst: body.leadAnalyst,
      team_size: body.teamSize || 0,
      total_tasks: body.totalTasks || 0,
      completed_tasks: body.completedTasks || 0,
      findings: body.findings ? JSON.stringify(body.findings) : '[]',
      risk_assessment: body.riskAssessment ? JSON.stringify(body.riskAssessment) : '{}',
      key_metrics: body.keyMetrics ? JSON.stringify(body.keyMetrics) : '{}'
    };

    // Create investment in database
    const newInvestment = InvestmentService.create(investmentData);
    
    // Transform back to due diligence format
    const project = transformInvestmentToDDProject(newInvestment);

    return NextResponse.json({
      success: true,
      project,
      message: 'Due diligence project created successfully'
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating due diligence project:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create due diligence project',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}
