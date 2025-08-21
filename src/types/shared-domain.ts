// Unified domain types shared across all modules

// Common value types
export type Priority = 'low' | 'medium' | 'high' | 'critical';
export type Status = 'active' | 'completed' | 'draft' | 'review' | 'cancelled';
export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';
export type Currency = 'USD' | 'EUR' | 'GBP' | 'JPY';

// Geographic regions
export type Geography = 'North America' | 'Europe' | 'Asia Pacific' | 'Latin America' | 'Middle East & Africa' | 'Global';

// Business sectors
export type Sector = 
  | 'Technology'
  | 'Healthcare' 
  | 'Financial Services'
  | 'Energy'
  | 'Consumer'
  | 'Industrial'
  | 'Real Estate'
  | 'Telecommunications'
  | 'Media & Entertainment'
  | 'Education'
  | 'Government'
  | 'Other';

// Investment stages
export type InvestmentStage = 
  | 'seed'
  | 'series-a'
  | 'series-b'
  | 'series-c'
  | 'series-d'
  | 'growth'
  | 'buyout'
  | 'mezzanine'
  | 'distressed'
  | 'turnaround';

// Asset types
export type AssetType = 
  | 'fund'
  | 'direct'
  | 'co-investment'
  | 'gp-led'
  | 'secondary'
  | 'real-estate'
  | 'infrastructure'
  | 'credit'
  | 'other';

// Common entity interfaces
export interface BaseEntity {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TimestampedEntity {
  createdAt: Date;
  updatedAt: Date;
  createdBy?: string;
  updatedBy?: string;
}

export interface StatusEntity {
  status: Status;
  priority: Priority;
}

export interface ValuedEntity {
  value: number;
  currency: Currency;
  valueDate?: Date;
}

// Financial metrics (commonly used across modules)
export interface FinancialMetrics {
  irr?: number; // Internal Rate of Return
  moic?: number; // Multiple on Invested Capital
  dpi?: number; // Distributions to Paid-In
  rvpi?: number; // Residual Value to Paid-In
  tvpi?: number; // Total Value to Paid-In
  realizedGain?: number;
  unrealizedGain?: number;
  totalReturn?: number;
}

// Performance metrics
export interface PerformanceMetrics extends FinancialMetrics {
  revenue?: number;
  revenueGrowth?: number;
  ebitda?: number;
  ebitdaMargin?: number;
  netIncome?: number;
  grossMargin?: number;
}

// ESG scoring (used across portfolio and due diligence)
export interface ESGMetrics {
  overallScore: number; // 0-100
  environmentalScore: number;
  socialScore: number;
  governanceScore: number;
  rating?: 'A+' | 'A' | 'B+' | 'B' | 'C+' | 'C' | 'D';
  lastAssessment?: Date;
  assessor?: string;
  improvementAreas?: string[];
  strengths?: string[];
}

// Team and contact information
export interface TeamMember {
  id: string;
  name: string;
  role: string;
  email?: string;
  phone?: string;
  department?: string;
  isLead?: boolean;
}

export interface ContactInfo {
  email?: string;
  phone?: string;
  address?: Address;
  website?: string;
  linkedIn?: string;
}

export interface Address {
  street: string;
  city: string;
  state?: string;
  country: string;
  postalCode: string;
}

// Document management (used across modules)
export interface Document {
  id: string;
  name: string;
  type: DocumentType;
  url: string;
  size?: number;
  uploadedBy: string;
  uploadedAt: Date;
  tags?: string[];
  confidentiality?: 'public' | 'internal' | 'confidential' | 'restricted';
  version?: string;
  parentDocumentId?: string;
}

export type DocumentType = 
  | 'financial-statement'
  | 'legal-document'
  | 'presentation'
  | 'report'
  | 'memo'
  | 'contract'
  | 'due-diligence'
  | 'compliance'
  | 'marketing'
  | 'other';

// Deal/Investment common structure
export interface BaseDeal extends BaseEntity, StatusEntity, TimestampedEntity {
  dealType: AssetType;
  sector: Sector;
  subsector?: string;
  geography: Geography;
  stage?: InvestmentStage;
  riskLevel?: RiskLevel;
  team: TeamMember[];
  documents?: Document[];
  tags?: string[];
  dealValue?: number;
  currency?: Currency;
  targetIRR?: number;
  targetMultiple?: number;
  holdingPeriod?: number; // years
  exitStrategy?: string[];
  competitors?: string[];
  keyRisks?: string[];
  keyOpportunities?: string[];
  nextMilestones?: Milestone[];
}

// Milestone tracking (used across modules)
export interface Milestone {
  id: string;
  title: string;
  description?: string;
  dueDate: Date;
  completedDate?: Date;
  status: 'pending' | 'in-progress' | 'completed' | 'overdue';
  assignee?: string;
  priority: Priority;
  dependencies?: string[]; // IDs of other milestones
}

// Audit trail (used across modules)
export interface AuditEntry {
  id: string;
  entityId: string;
  entityType: string;
  action: 'create' | 'update' | 'delete' | 'view' | 'export';
  changes?: Record<string, { before: unknown; after: unknown }>;
  userId: string;
  userName: string;
  timestamp: Date;
  ipAddress?: string;
  userAgent?: string;
  reason?: string;
}

// Comment/Note system (used across modules)
export interface Note {
  id: string;
  content: string;
  author: string;
  authorName: string;
  createdAt: Date;
  updatedAt?: Date;
  parentId?: string; // For threaded comments
  attachments?: Document[];
  tags?: string[];
  mentions?: string[]; // User IDs mentioned in the note
  isPrivate?: boolean;
  category?: 'general' | 'risk' | 'opportunity' | 'action-item' | 'decision';
}

// Notification system (used across modules)
export interface Notification {
  id: string;
  recipientId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  category: 'deadline' | 'approval' | 'update' | 'milestone' | 'ai-insight' | 'system';
  read: boolean;
  readAt?: Date;
  createdAt: Date;
  actionUrl?: string;
  actionLabel?: string;
  metadata?: Record<string, unknown>;
}

// Search and filtering (used across modules)
export interface SearchFilter {
  field: string;
  operator: 'equals' | 'contains' | 'starts-with' | 'ends-with' | 'greater-than' | 'less-than' | 'between' | 'in' | 'not-in';
  value: string | number | boolean | (string | number)[];
}

export interface SortOption {
  field: string;
  direction: 'asc' | 'desc';
}

export interface SearchQuery {
  query?: string;
  filters?: SearchFilter[];
  sort?: SortOption[];
  page?: number;
  pageSize?: number;
  includeArchived?: boolean;
}

export interface SearchResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Approval workflow (used across modules)
export interface ApprovalRequest {
  id: string;
  title: string;
  description: string;
  requesterId: string;
  requesterName: string;
  entityId: string;
  entityType: string;
  approvalType: 'investment' | 'expense' | 'contract' | 'document' | 'process' | 'other';
  requiredApprovers: string[];
  optionalApprovers?: string[];
  approvals: Approval[];
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  priority: Priority;
  dueDate?: Date;
  createdAt: Date;
  completedAt?: Date;
  metadata?: Record<string, unknown>;
}

export interface Approval {
  approverId: string;
  approverName: string;
  decision: 'approved' | 'rejected' | 'delegated';
  comment?: string;
  decidedAt: Date;
  delegatedTo?: string;
}

// Integration with external systems
export interface ExternalSystemRef {
  systemName: string;
  externalId: string;
  lastSyncAt?: Date;
  syncStatus?: 'success' | 'error' | 'pending';
  syncError?: string;
  metadata?: Record<string, unknown>;
}

// Common utility types
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type WithRequired<T, K extends keyof T> = T & { [P in K]-?: T[P] };
export type WithOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

// API response wrapper
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  metadata?: {
    timestamp: Date;
    requestId: string;
    version: string;
    [key: string]: unknown;
  };
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination?: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
}

// Export all types as a single namespace for convenience
export namespace Domain {
  export type {
    Priority,
    Status,
    RiskLevel,
    Currency,
    Geography,
    Sector,
    InvestmentStage,
    AssetType,
    BaseEntity,
    TimestampedEntity,
    StatusEntity,
    ValuedEntity,
    FinancialMetrics,
    PerformanceMetrics,
    ESGMetrics,
    TeamMember,
    ContactInfo,
    Address,
    Document,
    DocumentType,
    BaseDeal,
    Milestone,
    AuditEntry,
    Note,
    Notification,
    SearchFilter,
    SortOption,
    SearchQuery,
    SearchResult,
    ApprovalRequest,
    Approval,
    ExternalSystemRef,
    DeepPartial,
    WithRequired,
    WithOptional,
    ApiResponse,
    PaginatedResponse
  };
}