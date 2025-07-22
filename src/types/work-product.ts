export type WorkProductType = 
  | 'DD_REPORT'
  | 'IC_MEMO'
  | 'INVESTMENT_SUMMARY'
  | 'MARKET_ANALYSIS'
  | 'RISK_ASSESSMENT'
  | 'FINANCIAL_MODEL'
  | 'PRESENTATION'
  | 'TERM_SHEET'
  | 'CUSTOM';

export type WorkProductStatus = 
  | 'DRAFT'
  | 'IN_REVIEW'
  | 'UNDER_REVISION'
  | 'APPROVED'
  | 'FINAL'
  | 'ARCHIVED';

export type ExportFormat = 'PDF' | 'DOCX' | 'HTML' | 'MARKDOWN' | 'JSON' | 'CSV';

export type SharePermission = 'VIEW' | 'COMMENT' | 'EDIT' | 'ADMIN';

export interface DocumentSection {
  id: string;
  title: string;
  order: number;
  content: string;
  type: 'text' | 'table' | 'chart' | 'financial_block' | 'data_block';
  required: boolean;
  template?: string;
  metadata?: Record<string, any>;
}

export interface WorkProduct {
  id: string;
  workspaceId: string;
  title: string;
  type: WorkProductType;
  status: WorkProductStatus;
  templateId?: string;
  
  // Content
  sections: DocumentSection[];
  metadata: Record<string, any>;
  
  // Collaboration
  createdBy: string;
  lastEditedBy?: string;
  assignedReviewers?: string[];
  currentReviewer?: string;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  lastEditedAt?: Date;
  reviewDueDate?: Date;
  approvedAt?: Date;
  
  // Version control
  version: string;
  versionHistory: DocumentVersion[];
  
  // Export and sharing
  shareSettings?: ShareSettings;
  exportHistory?: ExportRecord[];
  
  // Analytics
  wordCount: number;
  readingTime: number;
  collaboratorCount: number;
  commentCount: number;
  editCount: number;
}

export interface DocumentVersion {
  id: string;
  version: string;
  createdBy: string;
  createdAt: Date;
  changeLog: string;
  snapshot: DocumentSection[];
}

export interface ShareSettings {
  id: string;
  workProductId: string;
  shareUrl?: string;
  permission: SharePermission;
  expiresAt?: Date;
  passwordProtected: boolean;
  watermark?: string;
  allowDownload: boolean;
  trackAccess: boolean;
  createdBy: string;
  createdAt: Date;
}

export interface ExportRecord {
  id: string;
  workProductId: string;
  format: ExportFormat;
  fileName: string;
  fileSize: number;
  exportedBy: string;
  exportedAt: Date;
  options: ExportOptions;
}

export interface ExportOptions {
  includeComments: boolean;
  includeSensitiveData: boolean;
  watermark?: string;
  passwordProtect?: boolean;
  selectedSections?: string[];
  format?: {
    fontSize?: number;
    fontFamily?: string;
    margins?: { top: number; bottom: number; left: number; right: number };
    headerFooter?: boolean;
  };
}

export interface DocumentTemplate {
  id: string;
  name: string;
  description?: string;
  type: WorkProductType;
  category: string;
  industry?: string;
  
  // Template structure
  sections: Omit<DocumentSection, 'id' | 'content'>[];
  defaultMetadata: Record<string, any>;
  
  // Template settings
  isDefault: boolean;
  isPublic: boolean;
  tags: string[];
  
  // Usage analytics
  usageCount: number;
  rating?: number;
  
  // Timestamps
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface DocumentComment {
  id: string;
  workProductId: string;
  sectionId?: string;
  parentId?: string;
  content: string;
  authorId: string;
  authorName: string;
  createdAt: Date;
  updatedAt?: Date;
  resolved: boolean;
  position?: {
    start: number;
    end: number;
  };
  replies?: DocumentComment[];
}

export interface ApprovalWorkflow {
  id: string;
  workProductId: string;
  workspaceId: string;
  
  // Workflow definition
  stages: ApprovalStage[];
  currentStage: number;
  status: 'PENDING' | 'IN_PROGRESS' | 'APPROVED' | 'REJECTED' | 'CANCELLED';
  
  // Timestamps
  initiatedBy: string;
  initiatedAt: Date;
  completedAt?: Date;
  
  // History
  history: ApprovalAction[];
}

export interface ApprovalStage {
  id: string;
  name: string;
  order: number;
  required: boolean;
  parallel: boolean; // Can multiple reviewers approve in parallel
  reviewers: string[];
  deadline?: Date;
  instructions?: string;
}

export interface ApprovalAction {
  id: string;
  stageId: string;
  reviewerId: string;
  reviewerName: string;
  action: 'APPROVED' | 'REJECTED' | 'REQUESTED_CHANGES' | 'COMMENTED';
  comment?: string;
  timestamp: Date;
  changes?: string[];
}

export interface FinancialBlock {
  id: string;
  type: 'metrics' | 'table' | 'calculation' | 'chart';
  title: string;
  data: Record<string, any>;
  formula?: string;
  formatting: {
    decimals?: number;
    currency?: string;
    percentage?: boolean;
    thousands?: boolean;
  };
  dependencies?: string[];
  lastUpdated: Date;
}

export interface DocumentAnalytics {
  workProductId: string;
  
  // Usage metrics
  viewCount: number;
  editCount: number;
  collaboratorCount: number;
  commentCount: number;
  shareCount: number;
  downloadCount: number;
  
  // Time metrics
  timeToComplete: number; // minutes
  totalEditTime: number; // minutes
  avgSessionTime: number; // minutes
  
  // Collaboration metrics
  peakConcurrentUsers: number;
  conflictCount: number;
  revisionCount: number;
  
  // Quality metrics
  wordCount: number;
  readingTime: number; // minutes
  complexityScore?: number;
  readabilityScore?: number;
  
  // Performance metrics
  loadTime: number; // milliseconds
  saveTime: number; // milliseconds
  
  // Timeline
  createdAt: Date;
  lastAccessed: Date;
  mostActiveDay: Date;
}

export interface WorkProductCreateRequest {
  workspaceId: string;
  title: string;
  type: WorkProductType;
  templateId?: string;
  assignedReviewers?: string[];
  reviewDueDate?: Date;
  metadata?: Record<string, any>;
}

export interface WorkProductUpdateRequest {
  title?: string;
  status?: WorkProductStatus;
  sections?: DocumentSection[];
  assignedReviewers?: string[];
  reviewDueDate?: Date;
  metadata?: Record<string, any>;
}

export interface DocumentSearchFilters {
  workspaceId?: string;
  type?: WorkProductType[];
  status?: WorkProductStatus[];
  createdBy?: string;
  assignedToMe?: boolean;
  dateRange?: {
    from: Date;
    to: Date;
  };
  tags?: string[];
  search?: string;
}