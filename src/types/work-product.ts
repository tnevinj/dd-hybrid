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
  // Enhanced content transformation features
  generationStrategy?: 'static' | 'ai-generated' | 'data-driven' | 'hybrid';
  dataBindings?: DataBinding[];
  validationRules?: SectionValidationRule[];
  aiPrompt?: string;
  lastGenerated?: Date;
  qualityScore?: number;
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
  context?: {
    projectName?: string;
    sector?: string;
    dealValue?: number;
    geography?: string;
    stage?: string;
    progress?: number;
    teamSize?: number;
    riskRating?: string;
    dealScore?: any;
    aiInsights?: any[];
  };
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

// Enhanced content transformation types
export interface DataBinding {
  id: string;
  sourceType: 'deal-metrics' | 'financial-model' | 'risk-assessment' | 'market-data' | 'team-data' | 'external-api';
  sourceId: string;
  fieldMapping: Record<string, string>;
  transformationRules: TransformationRule[];
  refreshPolicy: 'static' | 'on-demand' | 'real-time';
  lastUpdated?: Date;
}

export interface TransformationRule {
  id: string;
  type: 'format' | 'calculate' | 'filter' | 'aggregate' | 'validate';
  sourceField: string;
  targetField: string;
  operation: string;
  parameters: Record<string, any>;
}

export interface SectionValidationRule {
  id: string;
  type: 'completeness' | 'accuracy' | 'consistency' | 'compliance' | 'readability';
  description: string;
  severity: 'error' | 'warning' | 'info';
  validationFunction: string; // Function name or validation expression
  parameters: Record<string, any>;
}

export interface SmartTemplate {
  id: string;
  name: string;
  description: string;
  category: 'due-diligence' | 'investment-memo' | 'risk-assessment' | 'financial-analysis' | 'market-research' | 'legal-docs';
  industryFocus: string[];
  dealStages: string[];
  workProductType: WorkProductType;
  
  // Template structure
  sections: TemplateSection[];
  dynamicFields: TemplateField[];
  conditionalLogic: ConditionalRule[];
  
  // AI capabilities
  aiGenerationPrompts: Record<string, string>;
  dataIntegrationPoints: DataConnection[];
  contentValidationRules: ValidationRule[];
  
  // Metadata
  version: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  usageCount: number;
  successRate: number;
  averageQualityScore: number;
  tags: string[];
}

export interface TemplateSection {
  id: string;
  title: string;
  description?: string;
  order: number;
  required: boolean;
  type: DocumentSection['type'];
  generationStrategy: DocumentSection['generationStrategy'];
  aiPrompt?: string;
  dataBindings: DataBinding[];
  validationRules: SectionValidationRule[];
  estimatedLength?: number;
  dependencies?: string[];
}

export interface TemplateField {
  id: string;
  name: string;
  type: 'text' | 'number' | 'date' | 'select' | 'multiselect' | 'boolean' | 'currency' | 'percentage';
  required: boolean;
  defaultValue?: any;
  options?: string[];
  validation?: FieldValidation;
  description?: string;
  placeholder?: string;
}

export interface FieldValidation {
  min?: number;
  max?: number;
  pattern?: string;
  customValidation?: string;
}

export interface ConditionalRule {
  id: string;
  condition: string; // Boolean expression
  actions: ConditionalAction[];
  description?: string;
}

export interface ConditionalAction {
  type: 'show' | 'hide' | 'require' | 'populate' | 'validate';
  target: string; // Section or field ID
  value?: any;
}

export interface DataConnection {
  id: string;
  sourceType: DataBinding['sourceType'];
  connectionString: string;
  queryTemplate: string;
  parameters: Record<string, any>;
  cacheDuration?: number;
}

export interface ValidationRule {
  id: string;
  type: SectionValidationRule['type'];
  scope: 'section' | 'document' | 'template';
  implementation: string;
  parameters: Record<string, any>;
}

export interface ContentGenerationRequest {
  templateId: string;
  workspaceId: string;
  projectContext: ProjectContext;
  customFields?: Record<string, any>;
  generationMode: 'traditional' | 'assisted' | 'autonomous';
  options?: {
    includeDataBindings?: boolean;
    generateAllSections?: boolean;
    validateContent?: boolean;
    optimizeForReadability?: boolean;
  };
}

export interface ProjectContext {
  projectId: string;
  projectName: string;
  projectType: string;
  dealValue?: number;
  sector?: string;
  geography?: string;
  stage?: string;
  riskRating?: string;
  teamSize?: number;
  progress?: number;
  deadline?: Date;
  metadata?: Record<string, any>;
}

export interface ContentGenerationResult {
  workProduct: WorkProduct;
  generationMetrics: {
    totalSections: number;
    generatedSections: number;
    automationLevel: number;
    qualityScore: number;
    generationTime: number;
    dataBindingsApplied: number;
    validationsPassed: number;
    validationsFailed: number;
  };
  suggestions?: ContentSuggestion[];
  warnings?: ContentWarning[];
}

export interface ContentSuggestion {
  id: string;
  type: 'improvement' | 'addition' | 'formatting' | 'data-update';
  sectionId?: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  effort: 'minimal' | 'moderate' | 'significant';
  impact: 'low' | 'medium' | 'high';
  suggestedAction: string;
}

export interface ContentWarning {
  id: string;
  type: 'missing-data' | 'validation-failed' | 'quality-concern' | 'compliance-issue';
  sectionId?: string;
  severity: 'info' | 'warning' | 'error';
  message: string;
  suggestedFix?: string;
}