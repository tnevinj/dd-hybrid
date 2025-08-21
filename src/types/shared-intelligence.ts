// Shared Intelligence Layer - Unified Data Model for Cross-Module Integration

// Core Entity Identifiers
export type EntityId = string;
export type EntityType = 
  | 'FUND' 
  | 'PORTFOLIO_COMPANY' 
  | 'LP_ORGANIZATION' 
  | 'INVESTMENT' 
  | 'DEAL' 
  | 'DOCUMENT' 
  | 'CONTACT' 
  | 'USER';

// Shared Enums
export enum DataFreshness {
  REAL_TIME = 'REAL_TIME',
  MINUTES = 'MINUTES', 
  HOURS = 'HOURS',
  DAYS = 'DAYS',
  STALE = 'STALE'
}

export enum RiskLevel {
  VERY_LOW = 'VERY_LOW',
  LOW = 'LOW',
  MEDIUM = 'MEDIUM', 
  HIGH = 'HIGH',
  VERY_HIGH = 'VERY_HIGH',
  CRITICAL = 'CRITICAL'
}

export enum Priority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
  CRITICAL = 'CRITICAL'
}

export enum ConfidenceLevel {
  VERY_LOW = 0.0,
  LOW = 0.25,
  MEDIUM = 0.5,
  HIGH = 0.75,
  VERY_HIGH = 0.9,
  CERTAIN = 1.0
}

export enum TrendDirection {
  STRONGLY_DECLINING = 'STRONGLY_DECLINING',
  DECLINING = 'DECLINING',
  STABLE = 'STABLE',
  RISING = 'RISING',
  STRONGLY_RISING = 'STRONGLY_RISING'
}

// Cross-Module Navigation Types
export interface NavigationContext {
  currentModule: string;
  previousModule?: string;
  entityContext?: {
    type: EntityType;
    id: EntityId;
    name?: string;
  };
  decisionContext?: DecisionContext;
  breadcrumbs: NavigationBreadcrumb[];
}

export interface NavigationBreadcrumb {
  module: string;
  label: string;
  url: string;
  entityType?: EntityType;
  entityId?: EntityId;
}

export interface DecisionContext {
  type: 'INVESTMENT' | 'OPERATIONAL' | 'COMPLIANCE' | 'RELATIONSHIP';
  stage: 'RESEARCH' | 'ANALYSIS' | 'REVIEW' | 'APPROVAL' | 'EXECUTION';
  priority: Priority;
  deadline?: Date;
  stakeholders: string[];
  relatedEntities: {
    type: EntityType;
    id: EntityId;
    relevance: 'PRIMARY' | 'SECONDARY' | 'SUPPORTING';
  }[];
}

// Data Quality and Freshness
export interface DataQualityIndicator {
  lastUpdated: Date;
  source: string;
  freshness: DataFreshness;
  accuracy: number; // 0-1 scale
  completeness: number; // 0-1 scale
  consistency: number; // 0-1 scale
  validationStatus: 'PENDING' | 'VALIDATED' | 'ERROR' | 'STALE';
  warnings?: string[];
  errors?: string[];
}

// Cross-Module Relationship Graph
export interface EntityRelationship {
  fromEntity: {
    type: EntityType;
    id: EntityId;
  };
  toEntity: {
    type: EntityType;
    id: EntityId;
  };
  relationshipType: string;
  strength: number; // 0-1 scale
  direction: 'BIDIRECTIONAL' | 'FORWARD' | 'REVERSE';
  metadata?: Record<string, any>;
  createdAt: Date;
  lastValidated?: Date;
}

// Intelligent Insights Framework
export interface IntelligentInsight {
  id: string;
  type: 'PREDICTIVE' | 'DESCRIPTIVE' | 'PRESCRIPTIVE' | 'DIAGNOSTIC';
  category: 'PERFORMANCE' | 'RISK' | 'OPPORTUNITY' | 'COMPLIANCE' | 'OPERATIONAL';
  title: string;
  description: string;
  recommendation?: string;
  confidence: ConfidenceLevel;
  impact: 'LOW' | 'MEDIUM' | 'HIGH';
  urgency: Priority;
  
  // Supporting Data
  evidence: InsightEvidence[];
  relatedEntities: EntityReference[];
  
  // Metadata
  generatedAt: Date;
  validUntil?: Date;
  tags: string[];
  source: 'AI_MODEL' | 'RULE_ENGINE' | 'USER_INPUT' | 'EXTERNAL_DATA';
  
  // Actions
  suggestedActions: SuggestedAction[];
  acknowledgmentRequired: boolean;
  acknowledgedBy?: string;
  acknowledgedAt?: Date;
}

export interface InsightEvidence {
  type: 'METRIC' | 'TREND' | 'CORRELATION' | 'ANOMALY' | 'BENCHMARK';
  description: string;
  value?: number;
  unit?: string;
  sourceData: {
    module: string;
    entityType: EntityType;
    entityId: EntityId;
    metric?: string;
  };
  timeframe?: string;
}

export interface SuggestedAction {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  module: string;
  actionType: 'NAVIGATE' | 'CREATE' | 'UPDATE' | 'APPROVE' | 'REVIEW' | 'NOTIFY';
  estimatedDuration?: number; // minutes
  deadline?: Date;
  assignedTo?: string;
  prerequisites?: string[];
}

export interface EntityReference {
  type: EntityType;
  id: EntityId;
  name: string;
  relevance: 'HIGH' | 'MEDIUM' | 'LOW';
  module?: string;
}

// Cross-Module Metrics and KPIs
export interface UnifiedMetric {
  id: string;
  name: string;
  category: 'FINANCIAL' | 'OPERATIONAL' | 'RISK' | 'RELATIONSHIP' | 'COMPLIANCE';
  value: number;
  unit: string;
  previousValue?: number;
  target?: number;
  benchmark?: number;
  trend: TrendDirection;
  
  // Quality and Context
  dataQuality: DataQualityIndicator;
  calculationMethod?: string;
  contributingFactors?: MetricContributor[];
  
  // Metadata
  reportingPeriod: string;
  frequency: 'REAL_TIME' | 'HOURLY' | 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY';
  lastCalculated: Date;
  nextUpdate?: Date;
}

export interface MetricContributor {
  source: {
    module: string;
    entityType: EntityType;
    entityId: EntityId;
    metric: string;
  };
  weight: number; // 0-1 scale
  contribution: number;
}

// Predictive Analytics Framework
export interface PredictiveModel {
  id: string;
  name: string;
  type: 'CLASSIFICATION' | 'REGRESSION' | 'TIME_SERIES' | 'CLUSTERING';
  category: 'PERFORMANCE' | 'RISK' | 'MARKET' | 'RELATIONSHIP';
  
  // Model Metadata
  algorithm: string;
  version: string;
  accuracy: number; // 0-1 scale
  confidence: ConfidenceLevel;
  
  // Training Data
  trainedOn: Date;
  trainingDataSources: ModelDataSource[];
  featureSet: ModelFeature[];
  
  // Performance Metrics
  backtestResults?: BacktestResult[];
  validationMetrics?: ValidationMetric[];
  
  // Operational Status
  isActive: boolean;
  lastPrediction?: Date;
  nextRetraining?: Date;
  usage: number; // prediction count
}

export interface ModelDataSource {
  module: string;
  entityType: EntityType;
  dataRange: {
    from: Date;
    to: Date;
  };
  sampleSize: number;
}

export interface ModelFeature {
  name: string;
  type: 'NUMERIC' | 'CATEGORICAL' | 'TEXT' | 'DATETIME';
  importance: number; // 0-1 scale
  source: {
    module: string;
    field: string;
  };
}

export interface BacktestResult {
  period: {
    from: Date;
    to: Date;
  };
  accuracy: number;
  precision: number;
  recall: number;
  f1Score?: number;
  mse?: number; // for regression
  mae?: number; // for regression
}

export interface ValidationMetric {
  metric: string;
  value: number;
  threshold: number;
  passed: boolean;
}

// Risk and Compliance Framework
export interface RiskAssessment {
  id: string;
  entityType: EntityType;
  entityId: EntityId;
  
  // Risk Evaluation
  overallRisk: RiskLevel;
  riskScore: number; // 0-100 scale
  riskFactors: RiskFactor[];
  
  // Mitigation
  mitigationStrategies: MitigationStrategy[];
  residualRisk: RiskLevel;
  
  // Monitoring
  monitoringFrequency: 'REAL_TIME' | 'DAILY' | 'WEEKLY' | 'MONTHLY';
  lastReview: Date;
  nextReview: Date;
  reviewedBy: string;
  
  // Compliance
  complianceStatus: ComplianceStatus;
  regulatoryRequirements: RegulatoryRequirement[];
}

export interface RiskFactor {
  id: string;
  category: 'MARKET' | 'CREDIT' | 'OPERATIONAL' | 'REGULATORY' | 'REPUTATION';
  name: string;
  description: string;
  likelihood: number; // 0-1 scale
  impact: number; // 0-1 scale
  riskScore: number; // likelihood * impact
  trend: TrendDirection;
  source: {
    module: string;
    evidence: string[];
  };
}

export interface MitigationStrategy {
  id: string;
  strategy: string;
  description: string;
  effectiveness: number; // 0-1 scale
  implementationCost: 'LOW' | 'MEDIUM' | 'HIGH';
  timeToImplement: number; // days
  status: 'PLANNED' | 'IN_PROGRESS' | 'IMPLEMENTED' | 'DEFERRED';
  assignedTo?: string;
  dueDate?: Date;
}

export interface ComplianceStatus {
  overall: 'COMPLIANT' | 'NON_COMPLIANT' | 'PENDING_REVIEW' | 'EXCEPTION_GRANTED';
  frameworks: ComplianceFramework[];
  violations?: ComplianceViolation[];
  exceptions?: ComplianceException[];
  lastAudit?: Date;
  nextAudit?: Date;
}

export interface ComplianceFramework {
  name: string;
  version: string;
  status: 'COMPLIANT' | 'NON_COMPLIANT' | 'PENDING_REVIEW';
  requirements: RegulatoryRequirement[];
  lastCheck: Date;
  evidence?: string[];
}

export interface RegulatoryRequirement {
  id: string;
  framework: string;
  requirement: string;
  description: string;
  mandatory: boolean;
  status: 'MET' | 'NOT_MET' | 'PARTIAL' | 'NOT_APPLICABLE';
  evidence?: string[];
  dueDate?: Date;
  reviewer?: string;
}

export interface ComplianceViolation {
  id: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  framework: string;
  requirement: string;
  description: string;
  detectedAt: Date;
  reportedBy: string;
  status: 'OPEN' | 'INVESTIGATING' | 'RESOLVED' | 'EXCEPTION_GRANTED';
  remediationPlan?: string;
  dueDate?: Date;
}

export interface ComplianceException {
  id: string;
  framework: string;
  requirement: string;
  justification: string;
  approvedBy: string;
  approvedAt: Date;
  validUntil?: Date;
  conditions?: string[];
}

// Workflow and Decision Support
export interface DecisionWorkflow {
  id: string;
  name: string;
  type: 'INVESTMENT' | 'OPERATIONAL' | 'COMPLIANCE' | 'RELATIONSHIP';
  description?: string;
  
  // Workflow Definition
  steps: WorkflowStep[];
  currentStep: number;
  status: 'DRAFT' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED' | 'ON_HOLD';
  
  // Context
  initiatedBy: string;
  initiatedAt: Date;
  priority: Priority;
  deadline?: Date;
  
  // Participants
  stakeholders: WorkflowStakeholder[];
  currentAssignee?: string;
  
  // Data Context
  relatedEntities: EntityReference[];
  requiredData: DataRequirement[];
  attachedDocuments?: string[];
  
  // Progress Tracking
  completedSteps: number;
  estimatedCompletion?: Date;
  actualCompletion?: Date;
  blockers?: WorkflowBlocker[];
}

export interface WorkflowStep {
  id: string;
  name: string;
  description?: string;
  type: 'REVIEW' | 'APPROVAL' | 'DATA_ENTRY' | 'ANALYSIS' | 'DECISION' | 'NOTIFICATION';
  order: number;
  
  // Assignment
  assignedTo?: string;
  assignedRole?: string;
  assignedAt?: Date;
  
  // Execution
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'SKIPPED' | 'REJECTED';
  startedAt?: Date;
  completedAt?: Date;
  completedBy?: string;
  
  // Requirements
  requiredData?: string[];
  requiredApprovals?: string[];
  timeLimit?: number; // hours
  
  // Results
  outcome?: 'APPROVED' | 'REJECTED' | 'NEEDS_MORE_INFO' | 'ESCALATED';
  comments?: string;
  attachments?: string[];
}

export interface WorkflowStakeholder {
  userId: string;
  name: string;
  role: 'INITIATOR' | 'APPROVER' | 'REVIEWER' | 'OBSERVER' | 'ASSIGNEE';
  permissions: string[];
  notificationPreferences: NotificationPreference[];
}

export interface DataRequirement {
  source: {
    module: string;
    entityType: EntityType;
    entityId?: EntityId;
  };
  fields: string[];
  required: boolean;
  freshness?: DataFreshness;
  quality?: 'ANY' | 'VALIDATED' | 'HIGH_QUALITY';
}

export interface WorkflowBlocker {
  id: string;
  type: 'DATA_MISSING' | 'APPROVAL_PENDING' | 'RESOURCE_UNAVAILABLE' | 'EXTERNAL_DEPENDENCY';
  description: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
  blockedSince: Date;
  estimatedResolution?: Date;
  assignedTo?: string;
}

export interface NotificationPreference {
  channel: 'EMAIL' | 'SMS' | 'IN_APP' | 'WEBHOOK';
  events: string[];
  frequency: 'IMMEDIATE' | 'HOURLY' | 'DAILY' | 'WEEKLY';
  enabled: boolean;
}

// System Integration and Performance
export interface SystemHealthMetric {
  component: string;
  status: 'HEALTHY' | 'WARNING' | 'ERROR' | 'OFFLINE';
  responseTime?: number; // milliseconds
  uptime: number; // percentage
  lastCheck: Date;
  errorRate?: number; // percentage
  throughput?: number; // requests per minute
  warnings?: string[];
  errors?: string[];
}

export interface IntegrationPoint {
  id: string;
  name: string;
  type: 'API' | 'DATABASE' | 'FILE_SYSTEM' | 'WEBHOOK' | 'MESSAGE_QUEUE';
  sourceModule: string;
  targetModule: string;
  dataTypes: string[];
  
  // Configuration
  endpoint?: string;
  authentication?: string;
  rateLimits?: RateLimit;
  
  // Health and Performance
  status: 'ACTIVE' | 'INACTIVE' | 'ERROR' | 'RATE_LIMITED';
  lastSync?: Date;
  syncFrequency: string;
  errorCount: number;
  successRate: number; // percentage
  
  // Monitoring
  healthChecks: SystemHealthMetric[];
  alerts?: Alert[];
}

export interface RateLimit {
  requests: number;
  window: number; // seconds
  burst?: number;
}

export interface Alert {
  id: string;
  type: 'INFO' | 'WARNING' | 'ERROR' | 'CRITICAL';
  message: string;
  source: string;
  createdAt: Date;
  acknowledgedBy?: string;
  acknowledgedAt?: Date;
  resolvedAt?: Date;
  metadata?: Record<string, any>;
}

// Export all shared functionality for use across modules
export interface CrossModuleService {
  // Navigation
  navigateToEntity(entityType: EntityType, entityId: EntityId, context?: DecisionContext): void;
  buildBreadcrumbs(currentPath: string, entityContext?: EntityReference): NavigationBreadcrumb[];
  
  // Data Quality
  validateDataQuality(data: any, source: string): DataQualityIndicator;
  getDataFreshness(lastUpdated: Date): DataFreshness;
  
  // Intelligence
  generateInsights(entityType: EntityType, entityId: EntityId): Promise<IntelligentInsight[]>;
  getRelatedEntities(entityType: EntityType, entityId: EntityId): Promise<EntityRelationship[]>;
  
  // Risk and Compliance
  assessRisk(entityType: EntityType, entityId: EntityId): Promise<RiskAssessment>;
  checkCompliance(entityType: EntityType, entityId: EntityId): Promise<ComplianceStatus>;
  
  // Workflows
  initiateWorkflow(type: string, context: DecisionContext): Promise<DecisionWorkflow>;
  getActiveWorkflows(userId?: string): Promise<DecisionWorkflow[]>;
}