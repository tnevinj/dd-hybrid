import { EntityType, IntelligentInsight, RiskLevel } from '@/types/shared-intelligence';

export interface DecisionWorkflow {
  id: string;
  title: string;
  type: DecisionType;
  priority: Priority;
  entityType: EntityType;
  entityId: string;
  requiredApprovals: ApprovalLevel[];
  currentStage: WorkflowStage;
  context: DecisionContext;
  timeline: WorkflowTimeline;
  stakeholders: Stakeholder[];
  status: WorkflowStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface DecisionContext {
  summary: string;
  riskAssessment: RiskAssessment;
  financialImpact: FinancialImpact;
  strategicImplications: string[];
  supportingData: SupportingData[];
  relatedDecisions: string[];
  recommendations: IntelligentInsight[];
}

export interface RiskAssessment {
  overallRisk: RiskLevel;
  categories: RiskCategory[];
  mitigationStrategies: MitigationStrategy[];
  contingencyPlans: string[];
}

export interface RiskCategory {
  type: 'financial' | 'operational' | 'regulatory' | 'reputational' | 'strategic';
  level: RiskLevel;
  description: string;
  impact: number;
  probability: number;
}

export interface FinancialImpact {
  estimatedValue: number;
  currency: string;
  timeHorizon: string;
  confidenceLevel: number;
  breakdown: FinancialBreakdown[];
}

export interface FinancialBreakdown {
  category: string;
  amount: number;
  description: string;
}

export interface SupportingData {
  id: string;
  type: 'document' | 'analysis' | 'report' | 'metric' | 'external';
  title: string;
  source: string;
  relevanceScore: number;
  lastUpdated: Date;
  url?: string;
}

export interface ApprovalLevel {
  role: StakeholderRole;
  required: boolean;
  completed: boolean;
  approver?: string;
  approvedAt?: Date;
  comments?: string;
}

export interface Stakeholder {
  id: string;
  name: string;
  role: StakeholderRole;
  department: string;
  influence: 'low' | 'medium' | 'high' | 'critical';
  notification: boolean;
}

export interface WorkflowStage {
  id: string;
  name: string;
  description: string;
  requiredActions: string[];
  completedActions: string[];
  estimatedDuration: string;
  actualDuration?: string;
  startedAt?: Date;
  completedAt?: Date;
}

export interface WorkflowTimeline {
  created: Date;
  targetDecision: Date;
  actualDecision?: Date;
  milestones: Milestone[];
  escalations: Escalation[];
}

export interface Milestone {
  id: string;
  title: string;
  targetDate: Date;
  completedDate?: Date;
  status: 'pending' | 'in_progress' | 'completed' | 'overdue';
  description: string;
}

export interface Escalation {
  id: string;
  reason: string;
  escalatedTo: StakeholderRole;
  escalatedAt: Date;
  resolvedAt?: Date;
  resolution?: string;
}

export interface MitigationStrategy {
  id: string;
  riskCategory: string;
  strategy: string;
  implementation: string;
  owner: string;
  timeline: string;
  effectiveness: number;
}

export type DecisionType = 
  | 'investment' 
  | 'divestment' 
  | 'strategic' 
  | 'operational' 
  | 'regulatory' 
  | 'partnership' 
  | 'resource_allocation' 
  | 'risk_management';

export type Priority = 'low' | 'medium' | 'high' | 'critical' | 'urgent';

export type WorkflowStatus = 
  | 'draft' 
  | 'under_review' 
  | 'pending_approval' 
  | 'approved' 
  | 'rejected' 
  | 'on_hold' 
  | 'implemented' 
  | 'cancelled';

export type StakeholderRole = 
  | 'managing_partner' 
  | 'investment_committee' 
  | 'portfolio_manager' 
  | 'risk_manager' 
  | 'compliance_officer' 
  | 'legal_counsel' 
  | 'operations_manager' 
  | 'analyst' 
  | 'external_advisor';

export class DecisionWorkflowEngine {
  private workflows: Map<string, DecisionWorkflow> = new Map();
  private templates: Map<DecisionType, WorkflowTemplate> = new Map();

  constructor() {
    this.initializeTemplates();
  }

  createWorkflow(params: CreateWorkflowParams): DecisionWorkflow {
    const template = this.templates.get(params.type);
    if (!template) {
      throw new Error(`No template found for decision type: ${params.type}`);
    }

    const workflow: DecisionWorkflow = {
      id: this.generateWorkflowId(),
      title: params.title,
      type: params.type,
      priority: params.priority,
      entityType: params.entityType,
      entityId: params.entityId,
      requiredApprovals: template.approvalLevels.map(level => ({
        ...level,
        completed: false
      })),
      currentStage: template.stages[0],
      context: params.context,
      timeline: {
        created: new Date(),
        targetDecision: params.targetDecision,
        milestones: template.milestones,
        escalations: []
      },
      stakeholders: this.identifyStakeholders(params.type, params.priority),
      status: 'draft',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.workflows.set(workflow.id, workflow);
    this.notifyStakeholders(workflow, 'created');
    return workflow;
  }

  updateWorkflowStage(workflowId: string, stageId: string, updates: Partial<WorkflowStage>): void {
    const workflow = this.workflows.get(workflowId);
    if (!workflow) throw new Error('Workflow not found');

    if (workflow.currentStage.id === stageId) {
      workflow.currentStage = { ...workflow.currentStage, ...updates };
      workflow.updatedAt = new Date();

      if (updates.completedAt) {
        const template = this.templates.get(workflow.type);
        const nextStage = this.getNextStage(template!, workflow.currentStage.id);
        if (nextStage) {
          workflow.currentStage = nextStage;
        } else {
          workflow.status = 'pending_approval';
        }
      }

      this.workflows.set(workflowId, workflow);
      this.notifyStakeholders(workflow, 'stage_updated');
    }
  }

  processApproval(workflowId: string, approverRole: StakeholderRole, decision: 'approved' | 'rejected', comments?: string): void {
    const workflow = this.workflows.get(workflowId);
    if (!workflow) throw new Error('Workflow not found');

    const approval = workflow.requiredApprovals.find(a => a.role === approverRole);
    if (!approval) throw new Error('Approval level not found');

    approval.completed = true;
    approval.approver = this.getCurrentUser(); // Would get from auth context
    approval.approvedAt = new Date();
    approval.comments = comments;

    if (decision === 'rejected') {
      workflow.status = 'rejected';
    } else if (this.areAllApprovalsCompleted(workflow)) {
      workflow.status = 'approved';
    }

    workflow.updatedAt = new Date();
    this.workflows.set(workflowId, workflow);
    this.notifyStakeholders(workflow, decision === 'approved' ? 'approved' : 'rejected');
  }

  getWorkflowsForUser(userId: string, role: StakeholderRole): DecisionWorkflow[] {
    return Array.from(this.workflows.values()).filter(workflow => 
      workflow.stakeholders.some(s => s.id === userId || s.role === role) ||
      workflow.requiredApprovals.some(a => a.role === role && !a.completed)
    );
  }

  getWorkflowInsights(workflowId: string): WorkflowInsights {
    const workflow = this.workflows.get(workflowId);
    if (!workflow) throw new Error('Workflow not found');

    const bottlenecks = this.identifyBottlenecks(workflow);
    const predictions = this.generateTimePredictions(workflow);
    const recommendations = this.generateRecommendations(workflow);

    return {
      bottlenecks,
      predictions,
      recommendations,
      riskFactors: this.assessWorkflowRisks(workflow),
      efficiency: this.calculateEfficiency(workflow)
    };
  }

  private initializeTemplates(): void {
    // Investment Decision Template
    this.templates.set('investment', {
      stages: [
        { id: 'initial_review', name: 'Initial Review', description: 'Preliminary assessment', requiredActions: ['due_diligence', 'risk_assessment'], completedActions: [], estimatedDuration: '3 days' },
        { id: 'detailed_analysis', name: 'Detailed Analysis', description: 'Comprehensive evaluation', requiredActions: ['financial_modeling', 'market_analysis'], completedActions: [], estimatedDuration: '7 days' },
        { id: 'committee_review', name: 'Investment Committee Review', description: 'Committee evaluation', requiredActions: ['presentation_preparation', 'committee_meeting'], completedActions: [], estimatedDuration: '5 days' }
      ],
      approvalLevels: [
        { role: 'portfolio_manager', required: true, completed: false },
        { role: 'risk_manager', required: true, completed: false },
        { role: 'investment_committee', required: true, completed: false },
        { role: 'managing_partner', required: true, completed: false }
      ],
      milestones: [
        { id: 'due_diligence_complete', title: 'Due Diligence Complete', targetDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), status: 'pending', description: 'Initial due diligence completed' },
        { id: 'committee_decision', title: 'Committee Decision', targetDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), status: 'pending', description: 'Investment committee decision' }
      ]
    });

    // Strategic Decision Template
    this.templates.set('strategic', {
      stages: [
        { id: 'strategic_assessment', name: 'Strategic Assessment', description: 'Strategic impact evaluation', requiredActions: ['market_analysis', 'competitive_analysis'], completedActions: [], estimatedDuration: '5 days' },
        { id: 'stakeholder_consultation', name: 'Stakeholder Consultation', description: 'Stakeholder input gathering', requiredActions: ['stakeholder_meetings', 'feedback_analysis'], completedActions: [], estimatedDuration: '7 days' },
        { id: 'executive_review', name: 'Executive Review', description: 'Executive team evaluation', requiredActions: ['executive_presentation', 'decision_meeting'], completedActions: [], estimatedDuration: '3 days' }
      ],
      approvalLevels: [
        { role: 'operations_manager', required: true, completed: false },
        { role: 'managing_partner', required: true, completed: false }
      ],
      milestones: [
        { id: 'assessment_complete', title: 'Strategic Assessment Complete', targetDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), status: 'pending', description: 'Strategic assessment completed' },
        { id: 'executive_decision', title: 'Executive Decision', targetDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), status: 'pending', description: 'Executive team decision' }
      ]
    });
  }

  private generateWorkflowId(): string {
    return `workflow_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private identifyStakeholders(type: DecisionType, priority: Priority): Stakeholder[] {
    const stakeholders: Stakeholder[] = [];

    switch (type) {
      case 'investment':
        stakeholders.push(
          { id: '1', name: 'Portfolio Manager', role: 'portfolio_manager', department: 'Investments', influence: 'high', notification: true },
          { id: '2', name: 'Risk Manager', role: 'risk_manager', department: 'Risk', influence: 'high', notification: true },
          { id: '3', name: 'Investment Committee', role: 'investment_committee', department: 'Executive', influence: 'critical', notification: true }
        );
        break;
      case 'strategic':
        stakeholders.push(
          { id: '1', name: 'Managing Partner', role: 'managing_partner', department: 'Executive', influence: 'critical', notification: true },
          { id: '2', name: 'Operations Manager', role: 'operations_manager', department: 'Operations', influence: 'high', notification: true }
        );
        break;
    }

    return stakeholders;
  }

  private getNextStage(template: WorkflowTemplate, currentStageId: string): WorkflowStage | null {
    const currentIndex = template.stages.findIndex(s => s.id === currentStageId);
    return currentIndex < template.stages.length - 1 ? template.stages[currentIndex + 1] : null;
  }

  private areAllApprovalsCompleted(workflow: DecisionWorkflow): boolean {
    return workflow.requiredApprovals.filter(a => a.required).every(a => a.completed);
  }

  private notifyStakeholders(workflow: DecisionWorkflow, event: string): void {
    // Implementation would send notifications to relevant stakeholders
    console.log(`Notifying stakeholders of workflow ${workflow.id} - event: ${event}`);
  }

  private getCurrentUser(): string {
    // Would integrate with authentication system
    return 'current_user';
  }

  private identifyBottlenecks(workflow: DecisionWorkflow): string[] {
    const bottlenecks: string[] = [];
    
    // Check for overdue approvals
    workflow.requiredApprovals.forEach(approval => {
      if (!approval.completed && approval.required) {
        bottlenecks.push(`Pending approval from ${approval.role}`);
      }
    });

    // Check for overdue milestones
    workflow.timeline.milestones.forEach(milestone => {
      if (milestone.status === 'overdue') {
        bottlenecks.push(`Overdue milestone: ${milestone.title}`);
      }
    });

    return bottlenecks;
  }

  private generateTimePredictions(workflow: DecisionWorkflow): TimePredictions {
    const estimatedCompletion = new Date(workflow.createdAt);
    estimatedCompletion.setDate(estimatedCompletion.getDate() + 15); // Default 15 days

    return {
      estimatedCompletion,
      confidence: 0.75,
      factors: ['Historical data', 'Current workload', 'Complexity assessment']
    };
  }

  private generateRecommendations(workflow: DecisionWorkflow): string[] {
    const recommendations: string[] = [];

    if (workflow.priority === 'urgent' || workflow.priority === 'critical' || workflow.priority === 'high') {
      recommendations.push('Consider expedited review process');
    }

    if (workflow.context.riskAssessment.overallRisk === 'high') {
      recommendations.push('Engage additional risk review');
    }

    return recommendations;
  }

  private assessWorkflowRisks(workflow: DecisionWorkflow): WorkflowRisk[] {
    return [
      {
        type: 'timeline',
        level: 'medium',
        description: 'Potential for timeline extension due to complexity',
        impact: 0.3
      },
      {
        type: 'approval',
        level: 'low',
        description: 'Standard approval process',
        impact: 0.1
      }
    ];
  }

  private calculateEfficiency(workflow: DecisionWorkflow): number {
    // Calculate efficiency based on timeline adherence, approval speed, etc.
    return 0.85;
  }
}

interface CreateWorkflowParams {
  title: string;
  type: DecisionType;
  priority: Priority;
  entityType: EntityType;
  entityId: string;
  context: DecisionContext;
  targetDecision: Date;
}

interface WorkflowTemplate {
  stages: WorkflowStage[];
  approvalLevels: ApprovalLevel[];
  milestones: Milestone[];
}

interface WorkflowInsights {
  bottlenecks: string[];
  predictions: TimePredictions;
  recommendations: string[];
  riskFactors: WorkflowRisk[];
  efficiency: number;
}

interface TimePredictions {
  estimatedCompletion: Date;
  confidence: number;
  factors: string[];
}

interface WorkflowRisk {
  type: string;
  level: RiskLevel;
  description: string;
  impact: number;
}