// Document Workflow and Approval Process Types

export interface DocumentWorkflow {
  id: string;
  name: string;
  description?: string;
  documentType: DocumentType;
  triggerType: WorkflowTriggerType;
  triggerConditions?: Record<string, any>;
  isActive: boolean;
  fundId: string;
  createdById: string;
  approvalSteps: DocumentApprovalStep[];
  automationRules: DocumentAutomationRule[];
  workflowExecutions: DocumentWorkflowExecution[];
  createdAt: Date;
  updatedAt: Date;
}

export interface DocumentApprovalStep {
  id: string;
  workflowId: string;
  stepNumber: number;
  stepName: string;
  approverType: ApproverType;
  requiredApprovers?: Record<string, any>;
  parallelApproval: boolean;
  conditionalLogic?: Record<string, any>;
  timeoutHours?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface DocumentAutomationRule {
  id: string;
  workflowId: string;
  ruleName: string;
  conditions: Record<string, any>;
  actions: Record<string, any>;
  executeAfterStep?: number;
  priority: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface DocumentWorkflowExecution {
  id: string;
  workflowId: string;
  documentId: string;
  documentType: DocumentType;
  status: WorkflowExecutionStatus;
  currentStep?: number;
  startedById: string;
  completedAt?: Date;
  approvalHistory: DocumentApprovalHistory[];
  automationLogs: DocumentAutomationLog[];
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface DocumentApprovalHistory {
  id: string;
  executionId: string;
  stepNumber: number;
  approverId: string;
  approver: {
    id: string;
    name: string;
    email: string;
  };
  status: ApprovalStatus;
  comments?: string;
  approvedAt?: Date;
  metadata?: Record<string, any>;
  createdAt: Date;
}

export interface DocumentAutomationLog {
  id: string;
  executionId: string;
  ruleId: string;
  action: string;
  result: AutomationResult;
  resultMessage?: string;
  executedAt: Date;
  metadata?: Record<string, any>;
}

export interface ApprovalProcess {
  id: string;
  name: string;
  description?: string;
  processType: ApprovalProcessType;
  entityType: string;
  fundId: string;
  createdById: string;
  approvalLevels: ApprovalLevel[];
  processExecutions: ApprovalProcessExecution[];
  isActive: boolean;
  thresholds?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface ApprovalLevel {
  id: string;
  processId: string;
  levelNumber: number;
  levelName: string;
  requiredApprovers: Record<string, any>;
  minimumApprovals: number;
  parallelApproval: boolean;
  escalationHours?: number;
  escalationTo?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface ApprovalProcessExecution {
  id: string;
  processId: string;
  entityId: string;
  entityType: string;
  requestedById: string;
  requestedBy: {
    id: string;
    name: string;
    email: string;
  };
  status: WorkflowExecutionStatus;
  currentLevel?: number;
  priority: ApprovalPriority;
  deadline?: Date;
  completedAt?: Date;
  approvalRecords: ApprovalRecord[];
  escalationLogs: ApprovalEscalationLog[];
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface ApprovalRecord {
  id: string;
  executionId: string;
  levelNumber: number;
  approverId: string;
  approver: {
    id: string;
    name: string;
    email: string;
  };
  status: ApprovalStatus;
  comments?: string;
  approvedAt?: Date;
  delegatedTo?: string;
  delegatedUser?: {
    id: string;
    name: string;
    email: string;
  };
  metadata?: Record<string, any>;
  createdAt: Date;
}

export interface ApprovalEscalationLog {
  id: string;
  executionId: string;
  fromLevel: number;
  toLevel: number;
  escalatedById?: string;
  escalatedBy?: {
    id: string;
    name: string;
    email: string;
  };
  reason: EscalationReason;
  escalatedAt: Date;
  metadata?: Record<string, any>;
}

// Enums
export enum DocumentType {
  INVESTMENT_MEMORANDUM = 'INVESTMENT_MEMORANDUM',
  SIDE_LETTER = 'SIDE_LETTER',
  SUBSCRIPTION_AGREEMENT = 'SUBSCRIPTION_AGREEMENT',
  LIMITED_PARTNERSHIP_AGREEMENT = 'LIMITED_PARTNERSHIP_AGREEMENT',
  FUND_FORMATION_DOCUMENT = 'FUND_FORMATION_DOCUMENT',
  COMPLIANCE_REPORT = 'COMPLIANCE_REPORT',
  FINANCIAL_STATEMENT = 'FINANCIAL_STATEMENT',
  AUDIT_REPORT = 'AUDIT_REPORT',
  TAX_DOCUMENT = 'TAX_DOCUMENT',
  REGULATORY_FILING = 'REGULATORY_FILING',
  BOARD_RESOLUTION = 'BOARD_RESOLUTION',
  INVESTOR_REPORT = 'INVESTOR_REPORT',
  MARKETING_MATERIAL = 'MARKETING_MATERIAL',
  OTHER = 'OTHER'
}

export enum WorkflowTriggerType {
  MANUAL = 'MANUAL',
  DOCUMENT_UPLOAD = 'DOCUMENT_UPLOAD',
  DOCUMENT_UPDATE = 'DOCUMENT_UPDATE',
  STATUS_CHANGE = 'STATUS_CHANGE',
  DATE_BASED = 'DATE_BASED',
  THRESHOLD_BASED = 'THRESHOLD_BASED',
  CONDITIONAL = 'CONDITIONAL'
}

export enum ApproverType {
  SPECIFIC_USER = 'SPECIFIC_USER',
  ROLE_BASED = 'ROLE_BASED',
  HIERARCHICAL = 'HIERARCHICAL',
  COMMITTEE = 'COMMITTEE',
  EXTERNAL = 'EXTERNAL',
  CONDITIONAL = 'CONDITIONAL'
}

export enum WorkflowExecutionStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  CANCELLED = 'CANCELLED',
  ESCALATED = 'ESCALATED',
  COMPLETED = 'COMPLETED'
}

export enum ApprovalStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  DELEGATED = 'DELEGATED',
  ESCALATED = 'ESCALATED',
  EXPIRED = 'EXPIRED'
}

export enum ApprovalProcessType {
  INVESTMENT_APPROVAL = 'INVESTMENT_APPROVAL',
  EXPENSE_APPROVAL = 'EXPENSE_APPROVAL',
  CONTRACT_APPROVAL = 'CONTRACT_APPROVAL',
  DOCUMENT_APPROVAL = 'DOCUMENT_APPROVAL',
  POLICY_APPROVAL = 'POLICY_APPROVAL',
  BUDGET_APPROVAL = 'BUDGET_APPROVAL',
  VENDOR_APPROVAL = 'VENDOR_APPROVAL',
  CUSTOM = 'CUSTOM'
}

export enum ApprovalPriority {
  LOW = 'LOW',
  NORMAL = 'NORMAL',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
  CRITICAL = 'CRITICAL'
}

export enum EscalationReason {
  TIMEOUT = 'TIMEOUT',
  MANUAL_ESCALATION = 'MANUAL_ESCALATION',
  APPROVER_UNAVAILABLE = 'APPROVER_UNAVAILABLE',
  THRESHOLD_EXCEEDED = 'THRESHOLD_EXCEEDED',
  POLICY_VIOLATION = 'POLICY_VIOLATION',
  SYSTEM_ESCALATION = 'SYSTEM_ESCALATION'
}

export enum AutomationResult {
  SUCCESS = 'SUCCESS',
  FAILURE = 'FAILURE',
  PARTIAL = 'PARTIAL',
  SKIPPED = 'SKIPPED',
  ERROR = 'ERROR'
}

// Navigation Mode Interface
export interface WorkflowNavigationMode {
  mode: 'traditional' | 'assisted' | 'autonomous';
  aiSuggestions?: boolean;
  autoRouting?: boolean;
  smartFiltering?: boolean;
}

// Dashboard Analytics Interfaces
export interface WorkflowAnalytics {
  totalWorkflows: number;
  activeExecutions: number;
  averageProcessingTime: number;
  approvalSuccess: number;
  pendingApprovals: number;
  automationEfficiency: number;
  workflowPerformance: WorkflowPerformanceMetric[];
}

export interface WorkflowPerformanceMetric {
  workflowId: string;
  workflowName: string;
  executionsCount: number;
  averageProcessingTime: number;
  successRate: number;
  automationRate: number;
  bottlenecks: string[];
}

// AI Assistant Interfaces
export interface WorkflowAIInsight {
  id: string;
  type: 'optimization' | 'bottleneck' | 'automation' | 'risk' | 'efficiency';
  title: string;
  description: string;
  confidence: number;
  impact: 'low' | 'medium' | 'high';
  actionable: boolean;
  suggestedAction?: string;
  relatedWorkflowId?: string;
}

export interface AutomationRecommendation {
  id: string;
  workflowId: string;
  stepNumber: number;
  automationType: 'email' | 'notification' | 'data_update' | 'document_generation' | 'approval_routing';
  description: string;
  potentialSavings: number; // in hours/week
  complexity: 'low' | 'medium' | 'high';
  riskLevel: 'low' | 'medium' | 'high';
}