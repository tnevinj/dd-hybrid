// Legal Management Type Definitions

export type NavigationMode = 'traditional' | 'assisted' | 'autonomous';

// Document Types
export type DocumentType = 
  | 'CONTRACT' 
  | 'AGREEMENT' 
  | 'REGULATION' 
  | 'POLICY' 
  | 'MEMO' 
  | 'OPINION' 
  | 'LITIGATION' 
  | 'COMPLIANCE' 
  | 'OTHER';

export type DocumentCategory = 
  | 'INVESTMENT' 
  | 'OPERATIONAL' 
  | 'REGULATORY' 
  | 'LITIGATION' 
  | 'CORPORATE' 
  | 'TAX';

export type DocumentStatus = 
  | 'DRAFT' 
  | 'UNDER_REVIEW' 
  | 'APPROVED' 
  | 'EXECUTED' 
  | 'EXPIRED' 
  | 'TERMINATED';

export type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type ConfidentialityLevel = 'PUBLIC' | 'INTERNAL' | 'CONFIDENTIAL' | 'RESTRICTED';

export type ComplianceStatus = 'PENDING' | 'COMPLIANT' | 'NON_COMPLIANT' | 'UNDER_REVIEW';

// Event Types
export type EventType = 
  | 'DEADLINE' 
  | 'HEARING' 
  | 'FILING' 
  | 'MEETING' 
  | 'NEGOTIATION' 
  | 'SIGNING' 
  | 'AMENDMENT' 
  | 'TERMINATION';

export type EventStatus = 
  | 'SCHEDULED' 
  | 'IN_PROGRESS' 
  | 'COMPLETED' 
  | 'CANCELLED' 
  | 'POSTPONED';

// Reminder Types
export type ReminderType = 
  | 'DEADLINE' 
  | 'RENEWAL' 
  | 'REVIEW' 
  | 'COMPLIANCE' 
  | 'PAYMENT' 
  | 'FILING';

export type ReminderStatus = 'ACTIVE' | 'SENT' | 'COMPLETED' | 'CANCELLED';

// Framework Types
export type FrameworkType = 'REGULATORY' | 'INTERNAL' | 'INDUSTRY' | 'INTERNATIONAL';

export type FrameworkStatus = 'ACTIVE' | 'DEPRECATED' | 'UNDER_REVIEW';

// Assessment Types
export type AssessmentType = 
  | 'LEGAL' 
  | 'COMPLIANCE' 
  | 'OPERATIONAL' 
  | 'FINANCIAL' 
  | 'REPUTATIONAL';

export type AssessmentStatus = 
  | 'DRAFT' 
  | 'IN_PROGRESS' 
  | 'COMPLETED' 
  | 'UNDER_REVIEW' 
  | 'APPROVED';

export type RiskCategory = 
  | 'REGULATORY' 
  | 'CONTRACTUAL' 
  | 'LITIGATION' 
  | 'OPERATIONAL' 
  | 'STRATEGIC';

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

// Workflow Types
export type WorkflowType = 
  | 'REVIEW' 
  | 'APPROVAL' 
  | 'NEGOTIATION' 
  | 'EXECUTION' 
  | 'COMPLIANCE_CHECK';

export type WorkflowStatus = 
  | 'PENDING' 
  | 'IN_PROGRESS' 
  | 'COMPLETED' 
  | 'CANCELLED' 
  | 'ON_HOLD';

// Comment Types
export type CommentType = 
  | 'GENERAL' 
  | 'SUGGESTION' 
  | 'QUESTION' 
  | 'CONCERN' 
  | 'APPROVAL';

export type CommentStatus = 'ACTIVE' | 'RESOLVED' | 'ARCHIVED';

export type CommentVisibility = 'PRIVATE' | 'TEAM' | 'ALL_PARTIES';

// Audit Types
export type AuditEventType = 
  | 'CREATED' 
  | 'UPDATED' 
  | 'DELETED' 
  | 'VIEWED' 
  | 'SHARED' 
  | 'APPROVED' 
  | 'EXECUTED';

// Interfaces
export interface Party {
  id: string;
  name: string;
  type: 'INDIVIDUAL' | 'ORGANIZATION';
  role: string;
  contactInfo?: {
    email?: string;
    phone?: string;
    address?: string;
  };
}

export interface KeyTerm {
  id: string;
  term: string;
  definition: string;
  section?: string;
  importance: Priority;
}

export interface RegulatoryRequirement {
  id: string;
  regulation: string;
  requirement: string;
  authority: string;
  deadline?: Date;
  status: ComplianceStatus;
}

export interface ReminderConfiguration {
  id: string;
  type: 'BEFORE_DUE' | 'ON_DUE' | 'AFTER_DUE';
  offset: number; // Days
  method: 'EMAIL' | 'SMS' | 'IN_APP';
  recipients: string[];
}

export interface RecurrenceConfig {
  frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'YEARLY';
  interval: number;
  endDate?: Date;
  maxOccurrences?: number;
}

export interface EscalationRule {
  level: number;
  triggerAfterDays: number;
  escalateTo: string[];
  method: 'EMAIL' | 'SMS' | 'IN_APP';
}

export interface ComplianceRequirement {
  id: string;
  title: string;
  description: string;
  mandatory: boolean;
  deadline?: Date;
  status: ComplianceStatus;
  evidence?: string[];
}

export interface RiskScenario {
  id: string;
  scenario: string;
  probability: number;
  impact: number;
  mitigation?: string;
}

export interface MitigationStrategy {
  id: string;
  strategy: string;
  owner: string;
  dueDate?: Date;
  status: 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED';
  effectiveness?: number;
}

export interface WorkflowStage {
  id: string;
  name: string;
  description?: string;
  assignedTo?: string;
  dueDate?: Date;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'SKIPPED';
  requirements?: string[];
  outputs?: string[];
}

export interface ActionItem {
  id: string;
  description: string;
  assignedTo: string;
  dueDate?: Date;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  priority: Priority;
}

export interface ExternalParty {
  id: string;
  name: string;
  organization?: string;
  role: string;
  contactInfo: {
    email?: string;
    phone?: string;
  };
}

// Main Entity Interfaces
export interface LegalDocument {
  id: string;
  title: string;
  fileName: string;
  filePath?: string;
  fileSize?: number;
  documentType: DocumentType;
  category: DocumentCategory;
  status: DocumentStatus;
  priority: Priority;
  confidentiality: ConfidentialityLevel;
  description?: string;
  summary?: string;
  keyTerms?: KeyTerm[];
  tags?: string[];
  portfolioCompanies?: string[];
  funds?: string[];
  jurisdiction?: string;
  governingLaw?: string;
  contractValue?: number;
  currency?: string;
  effectiveDate?: Date;
  expirationDate?: Date;
  renewalDate?: Date;
  terminationDate?: Date;
  parties?: Party[];
  internalOwner?: string;
  externalCounsel?: string;
  assignedTo?: string;
  reviewers?: string[];
  approvers?: string[];
  regulatoryReqs?: RegulatoryRequirement[];
  complianceStatus: ComplianceStatus;
  version: number;
  isTemplate: boolean;
  templateId?: string;
  parentId?: string;
  createdBy: string;
  createdAt: Date;
  updatedBy?: string;
  updatedAt: Date;
  events?: LegalEvent[];
  reminders?: LegalReminder[];
  assessments?: RiskAssessment[];
  workflows?: LegalWorkflow[];
  comments?: LegalComment[];
  auditLogs?: LegalAuditLog[];
}

export interface LegalEvent {
  id: string;
  documentId?: string;
  title: string;
  description?: string;
  eventType: EventType;
  status: EventStatus;
  priority: Priority;
  scheduledDate: Date;
  startTime?: Date;
  endTime?: Date;
  completedAt?: Date;
  organizer: string;
  participants?: string[];
  externalParties?: ExternalParty[];
  location?: string;
  agenda?: string;
  outcome?: string;
  actionItems?: ActionItem[];
  reminders?: ReminderConfiguration[];
  createdBy: string;
  createdAt: Date;
  updatedBy?: string;
  updatedAt: Date;
  document?: LegalDocument;
}

export interface LegalReminder {
  id: string;
  documentId?: string;
  eventId?: string;
  title: string;
  description?: string;
  reminderType: ReminderType;
  status: ReminderStatus;
  priority: Priority;
  dueDate: Date;
  reminderDates: ReminderConfiguration[];
  assignedTo: string;
  recipients?: string[];
  recurring: boolean;
  recurrence?: RecurrenceConfig;
  escalation?: EscalationRule[];
  createdBy: string;
  createdAt: Date;
  completedAt?: Date;
  document?: LegalDocument;
}

export interface ComplianceFramework {
  id: string;
  name: string;
  description?: string;
  frameworkType: FrameworkType;
  jurisdiction?: string;
  authority?: string;
  version?: string;
  effectiveDate?: Date;
  lastUpdated?: Date;
  requirements: ComplianceRequirement[];
  riskLevel: RiskLevel;
  applicability?: string[];
  status: FrameworkStatus;
  createdBy: string;
  createdAt: Date;
  updatedBy?: string;
  updatedAt: Date;
  assessments?: RiskAssessment[];
}

export interface RiskAssessment {
  id: string;
  documentId?: string;
  frameworkId?: string;
  title: string;
  description?: string;
  assessmentType: AssessmentType;
  status: AssessmentStatus;
  riskCategory: RiskCategory;
  probabilityScore: number;
  impactScore: number;
  overallRisk: RiskLevel;
  methodology?: string;
  assumptions?: string[];
  scenarios?: RiskScenario[];
  mitigationPlans?: MitigationStrategy[];
  assessmentDate: Date;
  reviewDate?: Date;
  nextReviewDue?: Date;
  assessor: string;
  reviewer?: string;
  approver?: string;
  createdBy: string;
  createdAt: Date;
  updatedBy?: string;
  updatedAt: Date;
  document?: LegalDocument;
  framework?: ComplianceFramework;
}

export interface LegalWorkflow {
  id: string;
  documentId: string;
  workflowType: WorkflowType;
  name: string;
  description?: string;
  status: WorkflowStatus;
  priority: Priority;
  stages: WorkflowStage[];
  currentStage: number;
  initiatedBy: string;
  assignedTo?: string;
  participants?: string[];
  startDate: Date;
  dueDate?: Date;
  completedAt?: Date;
  autoAdvance: boolean;
  notifications?: any;
  createdAt: Date;
  updatedAt: Date;
  document: LegalDocument;
}

export interface LegalComment {
  id: string;
  documentId: string;
  parentId?: string;
  content: string;
  commentType: CommentType;
  status: CommentStatus;
  section?: string;
  lineNumber?: number;
  context?: string;
  isInternal: boolean;
  visibility: CommentVisibility;
  authorId: string;
  createdAt: Date;
  updatedAt: Date;
  resolvedBy?: string;
  resolvedAt?: Date;
  document: LegalDocument;
  replies?: LegalComment[];
  parent?: LegalComment;
}

export interface LegalAuditLog {
  id: string;
  documentId?: string;
  eventType: AuditEventType;
  description: string;
  userId: string;
  userRole?: string;
  ipAddress?: string;
  userAgent?: string;
  previousValue?: any;
  newValue?: any;
  fieldChanged?: string;
  timestamp: Date;
  document?: LegalDocument;
}

// Dashboard and UI Types
export interface LegalDashboardStats {
  totalDocuments: number;
  activeWorkflows: number;
  upcomingDeadlines: number;
  complianceIssues: number;
  highRiskItems: number;
  overdueReminders: number;
  recentActivity: number;
  documentsThisMonth: number;
}

export interface WorkflowSummary {
  id: string;
  name: string;
  documentTitle: string;
  type: WorkflowType;
  status: WorkflowStatus;
  progress: number;
  dueDate?: Date;
  assignedTo?: string;
  priority: Priority;
}

export interface DeadlineSummary {
  id: string;
  title: string;
  type: 'DOCUMENT' | 'EVENT' | 'REMINDER' | 'COMPLIANCE';
  dueDate: Date;
  priority: Priority;
  status: string;
  assignedTo?: string;
  daysUntilDue: number;
}

export interface ComplianceAlert {
  id: string;
  title: string;
  description: string;
  severity: Priority;
  type: 'DEADLINE' | 'VIOLATION' | 'REQUIREMENT' | 'FRAMEWORK';
  dueDate?: Date;
  status: ComplianceStatus;
  assignedTo?: string;
  documentId?: string;
}

export interface ActivitySummary {
  id: string;
  type: AuditEventType;
  description: string;
  userName: string;
  timestamp: Date;
  documentTitle?: string;
  documentId?: string;
}

// Hybrid Mode Specific Types
export interface HybridModeContent {
  traditional: {
    showFullDetails: boolean;
    enableManualWorkflows: boolean;
    showAllDocuments: boolean;
  };
  assisted: {
    showRecommendations: boolean;
    autoSuggestTags: boolean;
    smartDeadlineReminders: boolean;
    riskAssessmentHints: boolean;
  };
  autonomous: {
    autoWorkflowAdvancement: boolean;
    smartDocumentClassification: boolean;
    predictiveComplianceAlerts: boolean;
    autoRiskAssessment: boolean;
    intelligentDocumentRouting: boolean;
  };
}

// API Response Types
export interface LegalManagementResponse {
  documents: LegalDocument[];
  stats: LegalDashboardStats;
  workflowSummaries: WorkflowSummary[];
  upcomingDeadlines: DeadlineSummary[];
  complianceAlerts: ComplianceAlert[];
  recentActivity: ActivitySummary[];
  complianceFrameworks: ComplianceFramework[];
  riskAssessments: RiskAssessment[];
}

// Filter and Search Types
export interface DocumentFilter {
  category?: DocumentCategory[];
  status?: DocumentStatus[];
  priority?: Priority[];
  confidentiality?: ConfidentialityLevel[];
  dateRange?: {
    start: Date;
    end: Date;
    field: 'createdAt' | 'updatedAt' | 'effectiveDate' | 'expirationDate';
  };
  assignedTo?: string[];
  tags?: string[];
  complianceStatus?: ComplianceStatus[];
}

export interface SearchOptions {
  query: string;
  filters: DocumentFilter;
  sortBy: 'title' | 'createdAt' | 'updatedAt' | 'priority' | 'dueDate';
  sortOrder: 'asc' | 'desc';
  page: number;
  limit: number;
}

// Component Props
export interface LegalManagementDashboardProps {
  navigationMode: NavigationMode;
  onModeChange: (mode: NavigationMode) => void;
}

export interface DocumentListProps {
  documents: LegalDocument[];
  onDocumentSelect: (document: LegalDocument) => void;
  onDocumentEdit: (document: LegalDocument) => void;
  navigationMode: NavigationMode;
  filters?: DocumentFilter;
}

export interface WorkflowPanelProps {
  workflows: LegalWorkflow[];
  onWorkflowSelect: (workflow: LegalWorkflow) => void;
  navigationMode: NavigationMode;
}

export interface CompliancePanelProps {
  frameworks: ComplianceFramework[];
  alerts: ComplianceAlert[];
  assessments: RiskAssessment[];
  navigationMode: NavigationMode;
}