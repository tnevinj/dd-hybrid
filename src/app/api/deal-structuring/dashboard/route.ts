import { NextRequest, NextResponse } from 'next/server';
import { 
  DealStructuringProject, 
  DealStructuringMetrics, 
  DealStructuringActivity, 
  DealStructuringDeadline 
} from '@/types/deal-structuring';
import { 
  DealStructuringService, 
  DealStructuringActivityService, 
  DealStructuringDeadlineService 
} from '@/lib/services/database';

// Transform database project to API format
function transformProject(dbProject: any): DealStructuringProject {
  return {
    id: dbProject.id,
    name: dbProject.name,
    type: dbProject.type as any,
    stage: dbProject.stage as any,
    targetValue: dbProject.target_value,
    currentValuation: dbProject.current_valuation,
    progress: dbProject.progress,
    team: dbProject.team ? JSON.parse(dbProject.team) : [],
    lastUpdated: new Date(dbProject.last_updated),
    keyMetrics: dbProject.key_metrics ? JSON.parse(dbProject.key_metrics) : {},
    riskLevel: dbProject.risk_level as any,
    nextMilestone: dbProject.next_milestone,
    aiRecommendations: dbProject.ai_recommendations ? JSON.parse(dbProject.ai_recommendations) : []
  };
}

// Transform database activity to API format
function transformActivity(dbActivity: any): DealStructuringActivity {
  return {
    id: dbActivity.id,
    title: dbActivity.title,
    deal: dbActivity.deal_id,
    type: dbActivity.type as any,
    status: dbActivity.status as any,
    date: new Date(dbActivity.date),
    user: dbActivity.user
  };
}

// Transform database deadline to API format
function transformDeadline(dbDeadline: any): DealStructuringDeadline {
  return {
    id: dbDeadline.id,
    title: dbDeadline.title,
    dueDate: new Date(dbDeadline.due_date),
    deal: dbDeadline.deal_id,
    priority: dbDeadline.priority as any
  };
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const includeDetails = searchParams.get('includeDetails') === 'true';

    // Get real data from database
    const metrics = DealStructuringService.getMetrics();
    
    // Get all projects from database
    const dbProjects = DealStructuringService.getAll();
    const projects = dbProjects.map(transformProject);
    
    // Get activities and deadlines if details are requested
    let activities: DealStructuringActivity[] = [];
    let deadlines: DealStructuringDeadline[] = [];
    
    if (includeDetails) {
      const dbActivities = DealStructuringActivityService.getAll();
      activities = dbActivities.map(transformActivity);
      
      const dbDeadlines = DealStructuringDeadlineService.getAll();
      deadlines = dbDeadlines.map(transformDeadline);
    }

    const response = {
      success: true,
      metrics,
      deals: includeDetails ? projects : projects.map(d => ({ id: d.id, name: d.name, stage: d.stage })),
      activities: includeDetails ? activities : [],
      deadlines: includeDetails ? deadlines : [],
      timestamp: new Date().toISOString()
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching deal structuring dashboard data:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch dashboard data',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}
