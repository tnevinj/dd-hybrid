/**
 * Post-Screening Workflow Service
 * Handles intelligent routing and next-step orchestration after screening completion
 */

import { 
  DealOpportunity, 
  DealScreeningResult, 
  PostScreeningWorkflow, 
  WorkflowStep, 
  StakeholderAssignment, 
  NotificationRecord,
  GeneratedDocument 
} from '@/types/deal-screening';

export interface WorkflowRoutingDecision {
  nextStage: PostScreeningWorkflow['currentStage'];
  priority: 'low' | 'medium' | 'high' | 'critical';
  automatedSteps: string[];
  requiredApprovals: string[];
  estimatedTimeToDecision: number; // days
  reasoning: string;
}

export interface DocumentGenerationRequest {
  type: GeneratedDocument['type'];
  priority: number;
  automationLevel: 'ai' | 'template' | 'manual';
  estimatedTime: number; // minutes
}

export class PostScreeningWorkflowService {
  
  /**
   * Initialize post-screening workflow based on screening results
   */
  static async createWorkflow(
    opportunity: DealOpportunity,
    screeningResult: DealScreeningResult,
    mode: 'traditional' | 'assisted' | 'autonomous'
  ): Promise<PostScreeningWorkflow> {
    const routing = this.analyzeWorkflowRouting(opportunity, screeningResult, mode);
    const assignments = this.generateStakeholderAssignments(opportunity, screeningResult, routing);
    const nextSteps = this.generateWorkflowSteps(opportunity, screeningResult, routing, mode);
    const notifications = this.generateInitialNotifications(assignments, routing, opportunity);
    const documents = this.planDocumentGeneration(opportunity, screeningResult, routing, mode);

    const workflow: PostScreeningWorkflow = {
      id: `workflow-${opportunity.id}-${Date.now()}`,
      opportunityId: opportunity.id,
      screeningResultId: screeningResult.id,
      currentStage: routing.nextStage,
      nextSteps,
      assignments,
      notifications,
      documents,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      automationLevel: mode === 'traditional' ? 'manual' : mode === 'assisted' ? 'assisted' : 'autonomous'
    };

    return workflow;
  }

  /**
   * Analyze screening results to determine optimal workflow routing
   */
  private static analyzeWorkflowRouting(
    opportunity: DealOpportunity,
    screeningResult: DealScreeningResult,
    mode: 'traditional' | 'assisted' | 'autonomous'
  ): WorkflowRoutingDecision {
    const score = screeningResult.totalScore;
    const recommendation = screeningResult.recommendation;
    const dealSize = opportunity.askPrice;
    
    // Score-based routing logic
    let nextStage: PostScreeningWorkflow['currentStage'] = 'routing';
    let priority: WorkflowRoutingDecision['priority'] = 'medium';
    let automatedSteps: string[] = [];
    let requiredApprovals: string[] = [];
    let estimatedTimeToDecision = 14; // default 2 weeks
    
    // High-scoring deals get fast-tracked
    if (score >= 85 && recommendation === 'highly_recommended') {
      nextStage = 'committee_review';
      priority = 'high';
      estimatedTimeToDecision = 7;
      automatedSteps = ['generate_investment_summary', 'schedule_committee_review'];
      
      if (dealSize > 100000000) { // $100M+ deals
        priority = 'critical';
        requiredApprovals = ['senior_partner', 'investment_committee'];
        estimatedTimeToDecision = 10;
      } else {
        requiredApprovals = ['investment_committee'];
      }
    }
    
    // Medium-scoring deals need enhanced due diligence
    else if (score >= 65 && (recommendation === 'recommended' || recommendation === 'highly_recommended')) {
      nextStage = 'due_diligence';
      priority = 'medium';
      estimatedTimeToDecision = 21; // 3 weeks
      automatedSteps = ['generate_dd_plan', 'identify_risk_areas'];
      requiredApprovals = ['senior_analyst', 'investment_committee'];
    }
    
    // Lower-scoring deals get thorough analysis or rejection
    else if (score >= 45) {
      nextStage = 'committee_review';
      priority = 'low';
      estimatedTimeToDecision = 14;
      automatedSteps = ['generate_risk_assessment'];
      requiredApprovals = ['senior_analyst'];
    } else {
      // Auto-reject very low scoring deals in autonomous mode
      if (mode === 'autonomous' && score < 35) {
        nextStage = 'completed';
        priority = 'low';
        estimatedTimeToDecision = 1;
        automatedSteps = ['generate_rejection_notice'];
      } else {
        nextStage = 'committee_review';
        priority = 'low';
        estimatedTimeToDecision = 7;
        requiredApprovals = ['senior_analyst'];
      }
    }

    // Sector-specific adjustments
    if (['Technology', 'Healthcare'].includes(opportunity.sector)) {
      estimatedTimeToDecision += 3; // These sectors need extra analysis
      automatedSteps.push('generate_sector_analysis');
    }

    // Geographic risk adjustments
    if (opportunity.geography.includes('Emerging')) {
      estimatedTimeToDecision += 7;
      requiredApprovals.push('risk_committee');
      automatedSteps.push('generate_geographic_risk_assessment');
    }

    const reasoning = this.generateRoutingReasoning(score, recommendation, dealSize, opportunity.sector, priority);

    return {
      nextStage,
      priority,
      automatedSteps,
      requiredApprovals,
      estimatedTimeToDecision,
      reasoning
    };
  }

  /**
   * Generate stakeholder assignments based on deal characteristics
   */
  private static generateStakeholderAssignments(
    opportunity: DealOpportunity,
    screeningResult: DealScreeningResult,
    routing: WorkflowRoutingDecision
  ): StakeholderAssignment[] {
    const assignments: StakeholderAssignment[] = [];

    // Primary analyst (always assigned)
    assignments.push({
      userId: 'analyst-primary',
      role: 'analyst',
      responsibilities: ['Initial analysis', 'Data validation', 'Research coordination'],
      notificationPreferences: {
        email: true,
        slack: true,
        dashboard: true
      }
    });

    // Senior analyst for higher-value deals
    if (opportunity.askPrice > 50000000 || screeningResult.totalScore >= 70) {
      assignments.push({
        userId: 'senior-analyst-1',
        role: 'senior_analyst',
        responsibilities: ['Analysis review', 'Risk assessment', 'Final recommendations'],
        notificationPreferences: {
          email: true,
          slack: true,
          dashboard: true
        }
      });
    }

    // Committee members for committee review stage
    if (routing.nextStage === 'committee_review' || routing.requiredApprovals.includes('investment_committee')) {
      assignments.push({
        userId: 'committee-chair',
        role: 'committee_member',
        responsibilities: ['Investment decision', 'Strategic review', 'Portfolio fit assessment'],
        notificationPreferences: {
          email: true,
          slack: false,
          dashboard: true
        }
      });
    }

    // Legal for large deals or complex structures
    if (opportunity.askPrice > 100000000 || opportunity.assetType === 'gp-led') {
      assignments.push({
        userId: 'legal-counsel',
        role: 'legal',
        responsibilities: ['Legal structure review', 'Documentation review', 'Compliance assessment'],
        notificationPreferences: {
          email: true,
          slack: false,
          dashboard: true
        }
      });
    }

    // Operations for due diligence stage
    if (routing.nextStage === 'due_diligence') {
      assignments.push({
        userId: 'ops-lead',
        role: 'ops',
        responsibilities: ['Operational due diligence', 'Process coordination', 'Timeline management'],
        notificationPreferences: {
          email: true,
          slack: true,
          dashboard: true
        }
      });
    }

    return assignments;
  }

  /**
   * Generate workflow steps based on routing decision and mode
   */
  private static generateWorkflowSteps(
    opportunity: DealOpportunity,
    screeningResult: DealScreeningResult,
    routing: WorkflowRoutingDecision,
    mode: 'traditional' | 'assisted' | 'autonomous'
  ): WorkflowStep[] {
    const steps: WorkflowStep[] = [];
    let stepCounter = 1;

    // Document generation steps (automated)
    routing.automatedSteps.forEach(stepType => {
      const step = this.createDocumentGenerationStep(stepType, stepCounter++, mode);
      if (step) steps.push(step);
    });

    // Review and approval steps based on routing
    if (routing.nextStage === 'committee_review') {
      steps.push({
        id: `step-${stepCounter++}`,
        type: 'review',
        title: 'Investment Committee Review',
        description: `Present ${opportunity.name} to investment committee for decision`,
        assignedTo: ['committee-chair', 'senior-analyst-1'],
        dueDate: this.calculateDueDate(routing.estimatedTimeToDecision - 3),
        priority: routing.priority,
        status: 'pending',
        estimatedDuration: 90,
        aiGenerated: mode !== 'traditional'
      });

      steps.push({
        id: `step-${stepCounter++}`,
        type: 'meeting',
        title: 'Committee Decision Meeting',
        description: 'Formal committee meeting to make investment decision',
        assignedTo: ['committee-chair'],
        dueDate: this.calculateDueDate(routing.estimatedTimeToDecision),
        priority: routing.priority,
        status: 'pending',
        dependencies: [`step-${stepCounter - 2}`],
        estimatedDuration: 120,
        aiGenerated: mode !== 'traditional'
      });
    }

    if (routing.nextStage === 'due_diligence') {
      steps.push({
        id: `step-${stepCounter++}`,
        type: 'due_diligence',
        title: 'Due Diligence Planning',
        description: 'Develop comprehensive due diligence plan and timeline',
        assignedTo: ['senior-analyst-1', 'ops-lead'],
        dueDate: this.calculateDueDate(5),
        priority: 'high',
        status: 'pending',
        estimatedDuration: 240,
        aiGenerated: mode !== 'traditional'
      });

      steps.push({
        id: `step-${stepCounter++}`,
        type: 'due_diligence',
        title: 'Execute Due Diligence',
        description: 'Complete all due diligence workstreams',
        assignedTo: ['analyst-primary', 'senior-analyst-1', 'legal-counsel'],
        dueDate: this.calculateDueDate(routing.estimatedTimeToDecision - 7),
        priority: routing.priority,
        status: 'pending',
        dependencies: [`step-${stepCounter - 2}`],
        estimatedDuration: 2400, // 40 hours
        aiGenerated: mode !== 'traditional'
      });
    }

    // Final approval step for all workflows
    steps.push({
      id: `step-${stepCounter++}`,
      type: 'approval',
      title: 'Final Investment Approval',
      description: 'Obtain final investment approval and authorize execution',
      assignedTo: routing.requiredApprovals.length > 0 ? routing.requiredApprovals : ['senior-analyst-1'],
      dueDate: this.calculateDueDate(routing.estimatedTimeToDecision),
      priority: routing.priority,
      status: 'pending',
      dependencies: steps.length > 0 ? [steps[steps.length - 1].id] : undefined,
      estimatedDuration: 60,
      aiGenerated: mode !== 'traditional'
    });

    return steps;
  }

  /**
   * Create document generation workflow step
   */
  private static createDocumentGenerationStep(
    stepType: string, 
    stepNumber: number, 
    mode: 'traditional' | 'assisted' | 'autonomous'
  ): WorkflowStep | null {
    const stepMap: Record<string, Partial<WorkflowStep>> = {
      'generate_investment_summary': {
        type: 'document_generation',
        title: 'Generate Investment Summary',
        description: 'Create comprehensive investment summary document',
        estimatedDuration: mode === 'autonomous' ? 15 : mode === 'assisted' ? 30 : 90
      },
      'generate_dd_plan': {
        type: 'document_generation',
        title: 'Generate Due Diligence Plan',
        description: 'Create structured due diligence plan and checklist',
        estimatedDuration: mode === 'autonomous' ? 20 : mode === 'assisted' ? 45 : 120
      },
      'generate_risk_assessment': {
        type: 'document_generation',
        title: 'Generate Risk Assessment',
        description: 'Comprehensive risk analysis and mitigation strategies',
        estimatedDuration: mode === 'autonomous' ? 25 : mode === 'assisted' ? 60 : 150
      },
      'schedule_committee_review': {
        type: 'notification',
        title: 'Schedule Committee Review',
        description: 'Coordinate committee calendar and send meeting invitations',
        estimatedDuration: mode === 'autonomous' ? 5 : 15
      }
    };

    const template = stepMap[stepType];
    if (!template) return null;

    return {
      id: `step-${stepNumber}`,
      ...template,
      assignedTo: template.type === 'document_generation' ? ['analyst-primary'] : ['ops-lead'],
      dueDate: this.calculateDueDate(1),
      priority: 'medium',
      status: mode === 'autonomous' ? 'in_progress' : 'pending',
      aiGenerated: mode !== 'traditional'
    } as WorkflowStep;
  }

  /**
   * Generate initial notifications for workflow stakeholders
   */
  private static generateInitialNotifications(
    assignments: StakeholderAssignment[],
    routing: WorkflowRoutingDecision,
    opportunity: DealOpportunity
  ): NotificationRecord[] {
    const notifications: NotificationRecord[] = [];

    assignments.forEach(assignment => {
      if (assignment.notificationPreferences.email || assignment.notificationPreferences.slack) {
        notifications.push({
          id: `notification-${assignment.userId}-${Date.now()}`,
          type: 'screening_complete',
          recipientId: assignment.userId,
          title: `New Deal Assignment: ${opportunity.name}`,
          message: `You've been assigned to work on ${opportunity.name} (${opportunity.sector}, $${(opportunity.askPrice / 1000000).toFixed(1)}M). Priority: ${routing.priority}. ${routing.reasoning}`,
          sent: false,
          actionRequired: true,
          actionUrl: `/deal-screening/opportunity/${opportunity.id}`
        });
      }
    });

    return notifications;
  }

  /**
   * Plan document generation based on workflow routing
   */
  private static planDocumentGeneration(
    opportunity: DealOpportunity,
    screeningResult: DealScreeningResult,
    routing: WorkflowRoutingDecision,
    mode: 'traditional' | 'assisted' | 'autonomous'
  ): GeneratedDocument[] {
    const documents: GeneratedDocument[] = [];
    
    // Always generate investment summary
    documents.push({
      id: `doc-summary-${Date.now()}`,
      type: 'investment_summary',
      title: `Investment Summary - ${opportunity.name}`,
      content: '', // Will be populated during generation
      format: 'pdf',
      generatedBy: mode === 'traditional' ? 'template' : 'ai',
      createdAt: new Date().toISOString()
    });

    // Generate committee memo for committee review
    if (routing.nextStage === 'committee_review') {
      documents.push({
        id: `doc-memo-${Date.now()}`,
        type: 'committee_memo',
        title: `Investment Committee Memo - ${opportunity.name}`,
        content: '',
        format: 'pdf',
        generatedBy: mode === 'traditional' ? 'template' : 'ai',
        createdAt: new Date().toISOString()
      });
    }

    // Generate DD plan for due diligence stage
    if (routing.nextStage === 'due_diligence' || routing.automatedSteps.includes('generate_dd_plan')) {
      documents.push({
        id: `doc-ddplan-${Date.now()}`,
        type: 'due_diligence_plan',
        title: `Due Diligence Plan - ${opportunity.name}`,
        content: '',
        format: 'docx',
        generatedBy: mode === 'autonomous' ? 'ai' : 'template',
        createdAt: new Date().toISOString()
      });
    }

    // Generate risk assessment if needed
    if (routing.automatedSteps.includes('generate_risk_assessment')) {
      documents.push({
        id: `doc-risk-${Date.now()}`,
        type: 'risk_assessment',
        title: `Risk Assessment - ${opportunity.name}`,
        content: '',
        format: 'pdf',
        generatedBy: mode === 'traditional' ? 'template' : 'ai',
        createdAt: new Date().toISOString()
      });
    }

    return documents;
  }

  /**
   * Generate contextual reasoning for workflow routing decision
   */
  private static generateRoutingReasoning(
    score: number,
    recommendation: string,
    dealSize: number,
    sector: string,
    priority: string
  ): string {
    let reasoning = `Screening score of ${score}/100 with "${recommendation}" recommendation indicates `;
    
    if (score >= 85) {
      reasoning += 'strong investment potential requiring accelerated review. ';
    } else if (score >= 65) {
      reasoning += 'promising opportunity requiring thorough due diligence. ';
    } else {
      reasoning += 'opportunity requiring careful evaluation before proceeding. ';
    }

    if (dealSize > 100000000) {
      reasoning += `Large transaction size ($${(dealSize / 1000000).toFixed(1)}M) requires senior oversight and enhanced approval process. `;
    }

    if (['Technology', 'Healthcare'].includes(sector)) {
      reasoning += `${sector} sector expertise required for thorough evaluation. `;
    }

    reasoning += `Workflow priority set to ${priority} based on score, deal size, and sector considerations.`;

    return reasoning;
  }

  /**
   * Calculate due date relative to current date
   */
  private static calculateDueDate(daysFromNow: number): string {
    const date = new Date();
    date.setDate(date.getDate() + daysFromNow);
    return date.toISOString();
  }

  /**
   * Update workflow stage and progress
   */
  static updateWorkflowStage(
    workflow: PostScreeningWorkflow,
    newStage: PostScreeningWorkflow['currentStage'],
    completedStepId?: string
  ): PostScreeningWorkflow {
    const updatedWorkflow = { ...workflow };
    
    updatedWorkflow.currentStage = newStage;
    updatedWorkflow.updatedAt = new Date().toISOString();

    // Mark completed step
    if (completedStepId) {
      const stepIndex = updatedWorkflow.nextSteps.findIndex(step => step.id === completedStepId);
      if (stepIndex !== -1) {
        updatedWorkflow.nextSteps[stepIndex] = {
          ...updatedWorkflow.nextSteps[stepIndex],
          status: 'completed',
          completedAt: new Date().toISOString(),
          completedBy: 'current-user' // In real app, get from auth
        };
      }
    }

    return updatedWorkflow;
  }

  /**
   * Generate status update for stakeholders
   */
  static generateStatusUpdate(
    workflow: PostScreeningWorkflow,
    opportunity: DealOpportunity,
    updateType: 'stage_change' | 'step_completed' | 'deadline_approaching'
  ): NotificationRecord[] {
    const notifications: NotificationRecord[] = [];
    
    workflow.assignments.forEach(assignment => {
      if (assignment.notificationPreferences.dashboard) {
        notifications.push({
          id: `update-${assignment.userId}-${Date.now()}`,
          type: 'status_update',
          recipientId: assignment.userId,
          title: `Workflow Update: ${opportunity.name}`,
          message: `Workflow has progressed to ${workflow.currentStage} stage. Review your assigned tasks for next steps.`,
          sent: false,
          actionRequired: updateType === 'deadline_approaching',
          actionUrl: `/deal-screening/opportunity/${opportunity.id}/workflow`
        });
      }
    });

    return notifications;
  }
}