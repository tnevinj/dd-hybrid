import { NextRequest, NextResponse } from 'next/server';
import { PostScreeningWorkflow, WorkflowStep } from '@/types/deal-screening';

// Mock data store for workflows
let workflows: PostScreeningWorkflow[] = [];

// GET /api/deal-screening/opportunities/[id]/workflow
// Get workflow for a specific opportunity
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    // Find workflow for this opportunity
    const workflow = workflows.find(w => w.opportunityId === id);
    
    if (!workflow) {
      return NextResponse.json(
        { error: 'Workflow not found for this opportunity', success: false },
        { status: 404 }
      );
    }

    // Calculate workflow progress
    const completedSteps = workflow.nextSteps.filter(step => step.status === 'completed');
    const totalSteps = workflow.nextSteps.length;
    const progress = totalSteps > 0 ? (completedSteps.length / totalSteps) * 100 : 0;
    
    // Get pending actions requiring attention
    const pendingActions = workflow.nextSteps
      .filter(step => step.status === 'pending' || step.status === 'in_progress')
      .sort((a, b) => {
        const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      });
    
    // Get unread notifications
    const unreadNotifications = workflow.notifications.filter(n => !n.readAt);
    
    return NextResponse.json({
      data: {
        workflow,
        progress: Math.round(progress),
        completedSteps: completedSteps.length,
        totalSteps,
        pendingActions: pendingActions.slice(0, 5),
        unreadNotifications: unreadNotifications.length,
        estimatedCompletion: calculateEstimatedCompletion(workflow),
        status: {
          stage: workflow.currentStage,
          health: calculateWorkflowHealth(workflow),
          blockers: identifyBlockers(workflow)
        }
      },
      success: true,
    });

  } catch (error) {
    console.error('Error fetching workflow:', error);
    return NextResponse.json(
      { error: 'Failed to fetch workflow', success: false },
      { status: 500 }
    );
  }
}

// POST /api/deal-screening/opportunities/[id]/workflow
// Create new workflow or update existing workflow stage
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { action, stepId, data } = body;
    
    // Find existing workflow
    const workflowIndex = workflows.findIndex(w => w.opportunityId === id);
    
    if (workflowIndex === -1) {
      return NextResponse.json(
        { error: 'Workflow not found', success: false },
        { status: 404 }
      );
    }

    let updatedWorkflow = workflows[workflowIndex];

    switch (action) {
      case 'complete_step':
        updatedWorkflow = await completeWorkflowStep(updatedWorkflow, stepId, data);
        break;
        
      case 'update_stage':
        updatedWorkflow = await updateWorkflowStage(updatedWorkflow, data.newStage);
        break;
        
      case 'add_step':
        updatedWorkflow = await addWorkflowStep(updatedWorkflow, data);
        break;
        
      case 'reassign_step':
        updatedWorkflow = await reassignWorkflowStep(updatedWorkflow, stepId, data.assignee);
        break;
        
      case 'mark_notification_read':
        updatedWorkflow = await markNotificationRead(updatedWorkflow, data.notificationId);
        break;
        
      default:
        return NextResponse.json(
          { error: 'Invalid action', success: false },
          { status: 400 }
        );
    }

    // Update workflow in store
    workflows[workflowIndex] = updatedWorkflow;
    
    // Generate status update notifications if stage changed
    if (action === 'complete_step' || action === 'update_stage') {
      const { PostScreeningWorkflowService } = await import('@/lib/services/post-screening-workflow-service');
      const statusNotifications = PostScreeningWorkflowService.generateStatusUpdate(
        updatedWorkflow,
        { id } as any, // Simplified opportunity object
        action === 'update_stage' ? 'stage_change' : 'step_completed'
      );
      
      // Add notifications to workflow
      updatedWorkflow.notifications.push(...statusNotifications);
    }

    return NextResponse.json({
      data: {
        workflow: updatedWorkflow,
        actionCompleted: action,
        message: getActionCompletionMessage(action, stepId)
      },
      success: true,
    }, { status: 200 });

  } catch (error) {
    console.error('Error updating workflow:', error);
    return NextResponse.json(
      { error: 'Failed to update workflow', success: false },
      { status: 500 }
    );
  }
}

// PUT /api/deal-screening/opportunities/[id]/workflow
// Store new workflow (called from screening completion)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const workflow: PostScreeningWorkflow = await request.json();
    
    // Validate workflow data
    if (!workflow.id || workflow.opportunityId !== id) {
      return NextResponse.json(
        { error: 'Invalid workflow data', success: false },
        { status: 400 }
      );
    }

    // Check if workflow already exists
    const existingIndex = workflows.findIndex(w => w.opportunityId === id);
    
    if (existingIndex !== -1) {
      // Update existing workflow
      workflows[existingIndex] = workflow;
    } else {
      // Add new workflow
      workflows.push(workflow);
    }

    console.log(`Workflow stored for opportunity ${id}: ${workflow.currentStage} stage`);

    return NextResponse.json({
      data: {
        workflow,
        stored: true,
        nextActions: workflow.nextSteps
          .filter(step => step.status === 'pending')
          .slice(0, 3)
          .map(step => ({
            id: step.id,
            title: step.title,
            assignedTo: step.assignedTo,
            dueDate: step.dueDate,
            priority: step.priority
          }))
      },
      success: true,
    }, { status: 201 });

  } catch (error) {
    console.error('Error storing workflow:', error);
    return NextResponse.json(
      { error: 'Failed to store workflow', success: false },
      { status: 500 }
    );
  }
}

// Helper functions

async function completeWorkflowStep(
  workflow: PostScreeningWorkflow, 
  stepId: string, 
  data: any
): Promise<PostScreeningWorkflow> {
  const stepIndex = workflow.nextSteps.findIndex(step => step.id === stepId);
  
  if (stepIndex === -1) {
    throw new Error('Step not found');
  }

  // Mark step as completed
  workflow.nextSteps[stepIndex] = {
    ...workflow.nextSteps[stepIndex],
    status: 'completed',
    completedAt: new Date().toISOString(),
    completedBy: data.completedBy || 'current-user'
  };

  // Check if completion triggers stage progression
  const completedSteps = workflow.nextSteps.filter(step => step.status === 'completed');
  const totalSteps = workflow.nextSteps.length;
  
  // Auto-progress to next stage if all steps completed
  if (completedSteps.length === totalSteps) {
    workflow = await progressToNextStage(workflow);
  }

  workflow.updatedAt = new Date().toISOString();
  return workflow;
}

async function updateWorkflowStage(
  workflow: PostScreeningWorkflow, 
  newStage: PostScreeningWorkflow['currentStage']
): Promise<PostScreeningWorkflow> {
  
  workflow.currentStage = newStage;
  workflow.updatedAt = new Date().toISOString();
  
  // Generate new steps for the new stage if needed
  if (newStage === 'due_diligence' && !workflow.nextSteps.some(step => step.type === 'due_diligence')) {
    // Add due diligence steps
    const ddSteps: WorkflowStep[] = [
      {
        id: `dd-plan-${Date.now()}`,
        type: 'due_diligence',
        title: 'Complete Due Diligence Plan',
        description: 'Develop comprehensive DD plan and assign workstreams',
        assignedTo: ['senior-analyst-1'],
        priority: 'high',
        status: 'pending',
        estimatedDuration: 240,
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 1 week
      },
      {
        id: `dd-execute-${Date.now()}`,
        type: 'due_diligence',
        title: 'Execute Due Diligence Workstreams',
        description: 'Complete all due diligence activities',
        assignedTo: ['analyst-primary', 'senior-analyst-1'],
        priority: 'high',
        status: 'pending',
        estimatedDuration: 2400,
        dependencies: [`dd-plan-${Date.now()}`],
        dueDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString() // 3 weeks
      }
    ];
    
    workflow.nextSteps.push(...ddSteps);
  }
  
  return workflow;
}

async function progressToNextStage(workflow: PostScreeningWorkflow): Promise<PostScreeningWorkflow> {
  const stageProgression: Record<string, PostScreeningWorkflow['currentStage']> = {
    'routing': 'committee_review',
    'committee_review': 'due_diligence',
    'due_diligence': 'approval',
    'approval': 'documentation',
    'documentation': 'completed'
  };
  
  const nextStage = stageProgression[workflow.currentStage];
  if (nextStage) {
    workflow = await updateWorkflowStage(workflow, nextStage);
  }
  
  return workflow;
}

async function addWorkflowStep(
  workflow: PostScreeningWorkflow, 
  stepData: Partial<WorkflowStep>
): Promise<PostScreeningWorkflow> {
  const newStep: WorkflowStep = {
    id: `step-${Date.now()}`,
    type: stepData.type || 'review',
    title: stepData.title || 'New Step',
    description: stepData.description || '',
    assignedTo: stepData.assignedTo || ['analyst-primary'],
    priority: stepData.priority || 'medium',
    status: 'pending',
    estimatedDuration: stepData.estimatedDuration || 60,
    dueDate: stepData.dueDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    aiGenerated: false
  };
  
  workflow.nextSteps.push(newStep);
  workflow.updatedAt = new Date().toISOString();
  
  return workflow;
}

async function reassignWorkflowStep(
  workflow: PostScreeningWorkflow, 
  stepId: string, 
  assignee: string
): Promise<PostScreeningWorkflow> {
  const stepIndex = workflow.nextSteps.findIndex(step => step.id === stepId);
  
  if (stepIndex !== -1) {
    workflow.nextSteps[stepIndex].assignedTo = [assignee];
    workflow.updatedAt = new Date().toISOString();
  }
  
  return workflow;
}

async function markNotificationRead(
  workflow: PostScreeningWorkflow, 
  notificationId: string
): Promise<PostScreeningWorkflow> {
  const notificationIndex = workflow.notifications.findIndex(n => n.id === notificationId);
  
  if (notificationIndex !== -1) {
    workflow.notifications[notificationIndex].readAt = new Date().toISOString();
  }
  
  return workflow;
}

function calculateEstimatedCompletion(workflow: PostScreeningWorkflow): string {
  const pendingSteps = workflow.nextSteps.filter(step => 
    step.status === 'pending' || step.status === 'in_progress'
  );
  
  const totalEstimatedMinutes = pendingSteps.reduce((total, step) => 
    total + (step.estimatedDuration || 60), 0
  );
  
  // Convert to working days (assuming 8 hours per day)
  const estimatedDays = Math.ceil(totalEstimatedMinutes / (8 * 60));
  
  const completionDate = new Date();
  completionDate.setDate(completionDate.getDate() + estimatedDays);
  
  return completionDate.toISOString();
}

function calculateWorkflowHealth(workflow: PostScreeningWorkflow): 'excellent' | 'good' | 'warning' | 'critical' {
  const now = new Date().getTime();
  const overdueTasks = workflow.nextSteps.filter(step => {
    if (!step.dueDate || step.status === 'completed') return false;
    return new Date(step.dueDate).getTime() < now;
  });
  
  const totalTasks = workflow.nextSteps.length;
  const completedTasks = workflow.nextSteps.filter(step => step.status === 'completed').length;
  const completionRate = totalTasks > 0 ? completedTasks / totalTasks : 1;
  
  if (overdueTasks.length > 2) return 'critical';
  if (overdueTasks.length > 0 || completionRate < 0.3) return 'warning';
  if (completionRate > 0.7) return 'excellent';
  return 'good';
}

function identifyBlockers(workflow: PostScreeningWorkflow): string[] {
  const blockers: string[] = [];
  const now = new Date().getTime();
  
  // Check for overdue high-priority tasks
  const overdueHighPriority = workflow.nextSteps.filter(step => {
    if (!step.dueDate || step.status === 'completed') return false;
    return step.priority === 'critical' && new Date(step.dueDate).getTime() < now;
  });
  
  if (overdueHighPriority.length > 0) {
    blockers.push(`${overdueHighPriority.length} critical task(s) overdue`);
  }
  
  // Check for tasks with unmet dependencies
  const blockedTasks = workflow.nextSteps.filter(step => {
    if (step.status === 'completed' || !step.dependencies) return false;
    return step.dependencies.some(depId => {
      const depStep = workflow.nextSteps.find(s => s.id === depId);
      return depStep && depStep.status !== 'completed';
    });
  });
  
  if (blockedTasks.length > 0) {
    blockers.push(`${blockedTasks.length} task(s) blocked by dependencies`);
  }
  
  return blockers;
}

function getActionCompletionMessage(action: string, stepId?: string): string {
  const messages: Record<string, string> = {
    'complete_step': `Step ${stepId} has been marked as completed`,
    'update_stage': 'Workflow stage has been updated successfully',
    'add_step': 'New workflow step has been added',
    'reassign_step': `Step ${stepId} has been reassigned`,
    'mark_notification_read': 'Notification marked as read'
  };
  
  return messages[action] || 'Action completed successfully';
}

// Export workflows for other modules to access
export { workflows };