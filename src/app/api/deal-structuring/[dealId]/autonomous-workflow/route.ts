import { NextRequest, NextResponse } from 'next/server';
import { AIDealStructuringService } from '@/lib/services/ai-deal-structuring-service';
import { DealStructuringProject } from '@/types/deal-structuring';

// Mock deal data (same as recommendations route for consistency)
const mockDeals: Record<string, DealStructuringProject> = {
  '1': {
    id: '1',
    name: 'TechCorp Secondary',
    type: 'SINGLE_ASSET_CONTINUATION',
    stage: 'STRUCTURING',
    targetValue: 150000000,
    currentValuation: 145000000,
    progress: 75,
    team: [
      { id: '1', name: 'Sarah Chen', role: 'Lead Analyst' },
      { id: '2', name: 'Michael Park', role: 'Vice President' }
    ],
    lastUpdated: new Date(),
    keyMetrics: {
      irr: 18.5,
      multiple: 2.3,
      paybackPeriod: 4.2,
      leverage: 3.5,
      equityContribution: 45000000
    },
    riskLevel: 'medium',
    nextMilestone: 'Financial Model Review'
  },
  '2': {
    id: '2',
    name: 'GreenEnergy Fund II',
    type: 'MULTI_ASSET_CONTINUATION',
    stage: 'DUE_DILIGENCE',
    targetValue: 200000000,
    progress: 45,
    team: [
      { id: '3', name: 'Emma Rodriguez', role: 'Director' },
      { id: '4', name: 'David Kim', role: 'Associate' }
    ],
    lastUpdated: new Date(Date.now() - 24 * 60 * 60 * 1000),
    keyMetrics: {
      irr: 22.1,
      multiple: 2.8,
      paybackPeriod: 3.8,
      leverage: 2.9,
      equityContribution: 70000000
    },
    riskLevel: 'low',
    nextMilestone: 'Management Presentation'
  },
  '3': {
    id: '3',
    name: 'HealthTech Acquisition',
    type: 'LBO_STRUCTURE',
    stage: 'INVESTMENT_COMMITTEE',
    targetValue: 100000000,
    progress: 90,
    team: [
      { id: '5', name: 'Jennifer Lee', role: 'Managing Director' },
      { id: '6', name: 'Alex Johnson', role: 'Principal' }
    ],
    lastUpdated: new Date(Date.now() - 12 * 60 * 60 * 1000),
    keyMetrics: {
      irr: 25.3,
      multiple: 3.1,
      paybackPeriod: 3.2,
      leverage: 4.2,
      equityContribution: 25000000
    },
    riskLevel: 'high',
    nextMilestone: 'IC Vote'
  }
};

interface AutonomousTask {
  id: string;
  type: 'analysis' | 'modeling' | 'reporting' | 'communication' | 'monitoring';
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  estimatedTime: number; // minutes
  confidence: number;
  status: 'pending' | 'in_progress' | 'completed' | 'requires_approval' | 'failed';
  dependencies?: string[];
  result?: any;
  completedAt?: string;
}

interface WorkflowSession {
  id: string;
  dealId: string;
  startedAt: string;
  status: 'active' | 'paused' | 'completed';
  tasks: AutonomousTask[];
  completedTasks: AutonomousTask[];
  pendingApprovals: AutonomousTask[];
  metrics: {
    totalTasks: number;
    completedTasks: number;
    timeSaved: number; // minutes
    confidenceScore: number;
  };
  nextRecommendedAction?: {
    type: 'continue' | 'review' | 'approve_pending' | 'manual_intervention';
    description: string;
  };
}

// In-memory workflow sessions (in production, store in database)
let workflowSessions: Record<string, WorkflowSession> = {};

// GET /api/deal-structuring/[dealId]/autonomous-workflow
export async function GET(
  request: NextRequest,
  { params }: { params: { dealId: string } }
) {
  try {
    const { dealId } = params;
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');

    const deal = mockDeals[dealId];
    if (!deal) {
      return NextResponse.json(
        { error: 'Deal not found', success: false },
        { status: 404 }
      );
    }

    // If sessionId provided, return existing session
    if (sessionId && workflowSessions[sessionId]) {
      return NextResponse.json({
        data: workflowSessions[sessionId],
        success: true,
      });
    }

    // Create new workflow session
    const newSessionId = `session-${dealId}-${Date.now()}`;
    const tasks = generateAutonomousTasks(deal);
    
    const session: WorkflowSession = {
      id: newSessionId,
      dealId,
      startedAt: new Date().toISOString(),
      status: 'active',
      tasks,
      completedTasks: [],
      pendingApprovals: [],
      metrics: {
        totalTasks: tasks.length,
        completedTasks: 0,
        timeSaved: 0,
        confidenceScore: tasks.reduce((sum, t) => sum + t.confidence, 0) / tasks.length
      },
      nextRecommendedAction: {
        type: 'continue',
        description: 'Start autonomous task execution'
      }
    };

    workflowSessions[newSessionId] = session;

    console.log(`Created autonomous workflow session ${newSessionId} for ${deal.name}`);

    return NextResponse.json({
      data: session,
      success: true,
    });

  } catch (error) {
    console.error('Error creating autonomous workflow:', error);
    return NextResponse.json(
      { error: 'Failed to create autonomous workflow', success: false },
      { status: 500 }
    );
  }
}

// POST /api/deal-structuring/[dealId]/autonomous-workflow
export async function POST(
  request: NextRequest,
  { params }: { params: { dealId: string } }
) {
  try {
    const { dealId } = params;
    const body = await request.json();
    const { action, sessionId, taskIds, approvals } = body;

    const deal = mockDeals[dealId];
    if (!deal) {
      return NextResponse.json(
        { error: 'Deal not found', success: false },
        { status: 404 }
      );
    }

    const session = workflowSessions[sessionId];
    if (!session) {
      return NextResponse.json(
        { error: 'Workflow session not found', success: false },
        { status: 404 }
      );
    }

    let updatedSession = { ...session };

    switch (action) {
      case 'execute_tasks':
        updatedSession = await executeAutonomousTasks(updatedSession, taskIds || []);
        break;
        
      case 'approve_tasks':
        updatedSession = await approvePendingTasks(updatedSession, approvals || []);
        break;
        
      case 'pause_workflow':
        updatedSession.status = 'paused';
        break;
        
      case 'resume_workflow':
        updatedSession.status = 'active';
        break;
        
      case 'complete_workflow':
        updatedSession = await completeWorkflow(updatedSession);
        break;
        
      default:
        return NextResponse.json(
          { error: 'Invalid action', success: false },
          { status: 400 }
        );
    }

    // Update stored session
    workflowSessions[sessionId] = updatedSession;

    return NextResponse.json({
      data: updatedSession,
      action,
      success: true,
    });

  } catch (error) {
    console.error('Error updating autonomous workflow:', error);
    return NextResponse.json(
      { error: 'Failed to update workflow', success: false },
      { status: 500 }
    );
  }
}

// Helper functions
function generateAutonomousTasks(deal: DealStructuringProject): AutonomousTask[] {
  const baseTasks = [
    {
      id: 'update-financial-model',
      type: 'modeling' as const,
      title: 'Update Financial Model',
      description: `Incorporate latest actuals and assumptions for ${deal.name}`,
      priority: 'high' as const,
      estimatedTime: 45,
      confidence: 0.88,
      status: 'pending' as const
    },
    {
      id: 'generate-risk-assessment',
      type: 'analysis' as const,
      title: 'Generate Risk Assessment',
      description: 'Comprehensive risk analysis with sector benchmarking',
      priority: 'medium' as const,
      estimatedTime: 30,
      confidence: 0.82,
      status: 'pending' as const,
      dependencies: ['update-financial-model']
    },
    {
      id: 'benchmark-analysis',
      type: 'analysis' as const,
      title: 'Benchmark Against Comparables',
      description: 'Compare deal metrics against recent transactions',
      priority: 'medium' as const,
      estimatedTime: 25,
      confidence: 0.91,
      status: 'pending' as const
    },
    {
      id: 'prepare-ic-materials',
      type: 'reporting' as const,
      title: 'Prepare IC Materials',
      description: 'Generate investment committee presentation and memo',
      priority: 'high' as const,
      estimatedTime: 90,
      confidence: 0.76,
      status: 'pending' as const,
      dependencies: ['update-financial-model', 'generate-risk-assessment']
    },
    {
      id: 'schedule-meetings',
      type: 'communication' as const,
      title: 'Schedule Stakeholder Meetings',
      description: 'Coordinate calendar and send meeting invitations',
      priority: 'low' as const,
      estimatedTime: 15,
      confidence: 0.95,
      status: 'pending' as const
    }
  ];

  // Add deal-specific tasks based on stage and characteristics
  if (deal.stage === 'STRUCTURING') {
    baseTasks.push({
      id: 'optimize-structure',
      type: 'analysis' as const,
      title: 'Optimize Deal Structure',
      description: 'Analyze alternative structures for better returns',
      priority: 'high' as const,
      estimatedTime: 60,
      confidence: 0.73,
      status: 'pending' as const
    });
  }

  if (deal.keyMetrics?.leverage && deal.keyMetrics.leverage > 4.0) {
    baseTasks.push({
      id: 'leverage-analysis',
      type: 'analysis' as const,
      title: 'Leverage Optimization Analysis',
      description: 'Review and optimize capital structure',
      priority: 'critical' as const,
      estimatedTime: 40,
      confidence: 0.85,
      status: 'pending' as const
    });
  }

  return baseTasks;
}

async function executeAutonomousTasks(
  session: WorkflowSession, 
  taskIds: string[]
): Promise<WorkflowSession> {
  const updatedSession = { ...session };
  
  for (const taskId of taskIds) {
    const taskIndex = updatedSession.tasks.findIndex(t => t.id === taskId);
    if (taskIndex === -1) continue;

    const task = updatedSession.tasks[taskIndex];
    
    // Check dependencies
    if (task.dependencies) {
      const uncompletedDeps = task.dependencies.filter(depId => 
        !updatedSession.completedTasks.some(ct => ct.id === depId)
      );
      
      if (uncompletedDeps.length > 0) {
        console.log(`Task ${taskId} has unmet dependencies: ${uncompletedDeps.join(', ')}`);
        continue;
      }
    }

    // Execute task based on confidence
    if (task.confidence >= 0.80) {
      // High confidence - execute automatically
      updatedSession.tasks[taskIndex] = {
        ...task,
        status: 'in_progress'
      };

      // Simulate task execution
      const result = await AIDealStructuringService.executeAutonomousTasks(
        mockDeals[session.dealId], 
        [task.title]
      );

      updatedSession.tasks[taskIndex] = {
        ...task,
        status: 'completed',
        result: result[0],
        completedAt: new Date().toISOString()
      };

      // Move to completed tasks
      updatedSession.completedTasks.push(updatedSession.tasks[taskIndex]);
      updatedSession.metrics.completedTasks++;
      updatedSession.metrics.timeSaved += task.estimatedTime;
      
    } else {
      // Low confidence - requires approval
      updatedSession.tasks[taskIndex] = {
        ...task,
        status: 'requires_approval'
      };
      
      updatedSession.pendingApprovals.push(task);
    }
  }

  // Update next recommended action
  const remainingTasks = updatedSession.tasks.filter(t => t.status === 'pending').length;
  const pendingApprovals = updatedSession.pendingApprovals.length;
  
  if (pendingApprovals > 0) {
    updatedSession.nextRecommendedAction = {
      type: 'approve_pending',
      description: `${pendingApprovals} task(s) require your approval`
    };
  } else if (remainingTasks > 0) {
    updatedSession.nextRecommendedAction = {
      type: 'continue',
      description: `Continue with ${remainingTasks} remaining tasks`
    };
  } else {
    updatedSession.nextRecommendedAction = {
      type: 'review',
      description: 'All tasks completed - ready for review'
    };
    updatedSession.status = 'completed';
  }

  return updatedSession;
}

async function approvePendingTasks(
  session: WorkflowSession,
  approvals: Array<{ taskId: string; approved: boolean; notes?: string }>
): Promise<WorkflowSession> {
  const updatedSession = { ...session };

  for (const approval of approvals) {
    const taskIndex = updatedSession.tasks.findIndex(t => t.id === approval.taskId);
    if (taskIndex === -1) continue;

    const task = updatedSession.tasks[taskIndex];
    
    if (approval.approved) {
      // Execute approved task
      updatedSession.tasks[taskIndex] = {
        ...task,
        status: 'completed',
        result: { approved: true, notes: approval.notes },
        completedAt: new Date().toISOString()
      };
      
      updatedSession.completedTasks.push(updatedSession.tasks[taskIndex]);
      updatedSession.metrics.completedTasks++;
      updatedSession.metrics.timeSaved += task.estimatedTime;
    } else {
      // Mark as failed/rejected
      updatedSession.tasks[taskIndex] = {
        ...task,
        status: 'failed',
        result: { approved: false, notes: approval.notes }
      };
    }

    // Remove from pending approvals
    updatedSession.pendingApprovals = updatedSession.pendingApprovals.filter(
      t => t.id !== approval.taskId
    );
  }

  return updatedSession;
}

async function completeWorkflow(session: WorkflowSession): Promise<WorkflowSession> {
  return {
    ...session,
    status: 'completed',
    nextRecommendedAction: {
      type: 'review',
      description: 'Workflow completed successfully'
    }
  };
}