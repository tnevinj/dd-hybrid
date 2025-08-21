// Import from unified domain types
export { 
  ScreeningCriterion as DealScreeningCriterion,
  ScreeningTemplate as DealScreeningTemplate,
  DealOpportunity
} from './investment-domain';

// Re-export common types for convenience
export type { Priority, RiskLevel, AssetType } from './shared-domain';

export interface TemplateAnalytics {
  usageCount: number;
  successRate: number;
  averageScore: number;
  lastUsed: string;
  dealsClosed: number;
  totalDealsEvaluated: number;
  timesSaved?: number; // AI-specific metric
  automationRate?: number; // AI-specific metric
}

export interface DealScreeningTemplate {
  id: string;
  name: string;
  description: string;
  criteria: DealScreeningCriterion[];
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  isDefault: boolean;
  aiEnhanced?: boolean; // Hybrid-specific
  automationLevel?: 'none' | 'assisted' | 'autonomous'; // Hybrid-specific
  analytics?: TemplateAnalytics;
  modeSpecificConfig?: {
    traditional: { showAllCriteria: boolean; enableShortcuts: boolean };
    assisted: { aiSuggestions: boolean; autoScoring: boolean; showConfidence: boolean };
    autonomous: { aiSuggestions: boolean; autoScoring: boolean; requireApproval: boolean };
  };
  assetTypeSpecific?: {
    assetType: 'fund' | 'direct' | 'co-investment' | 'gp-led' | 'other';
    specificCriteria: string[]; // IDs of criteria specific to this asset type
  };
}

// DealOpportunity is now imported from unified types above

export interface DealScore {
  criterionId: string;
  value: number;
  normalizedScore: number; // 0-1
  weightedScore: number; // normalized * weight
  notes?: string;
  aiGenerated?: boolean; // Hybrid-specific: was this score AI-generated?
  confidence?: number; // AI confidence in this score
}

export interface AIRecommendation {
  id: string;
  type: 'suggestion' | 'automation' | 'insight' | 'warning' | 'opportunity';
  priority: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  actions?: RecommendedAction[];
  confidence: number; // 0-1
  reasoning?: string;
  category: 'scoring' | 'comparison' | 'workflow' | 'analysis';
}

export interface RecommendedAction {
  label: string;
  action: string;
  params?: Record<string, any>;
  timeEstimate?: number; // minutes saved
}

// Post-screening workflow interfaces
export interface PostScreeningWorkflow {
  id: string;
  opportunityId: string;
  screeningResultId: string;
  currentStage: 'routing' | 'committee_review' | 'due_diligence' | 'approval' | 'documentation' | 'completed';
  nextSteps: WorkflowStep[];
  assignments: StakeholderAssignment[];
  notifications: NotificationRecord[];
  documents: GeneratedDocument[];
  createdAt: string;
  updatedAt: string;
  automationLevel: 'manual' | 'assisted' | 'autonomous';
}

export interface WorkflowStep {
  id: string;
  type: 'review' | 'approval' | 'due_diligence' | 'document_generation' | 'meeting' | 'notification';
  title: string;
  description: string;
  assignedTo: string[];
  dueDate?: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'in_progress' | 'completed' | 'skipped' | 'blocked';
  dependencies?: string[]; // IDs of prerequisite steps
  estimatedDuration?: number; // minutes
  aiGenerated?: boolean;
  completedAt?: string;
  completedBy?: string;
}

export interface StakeholderAssignment {
  userId: string;
  role: 'analyst' | 'senior_analyst' | 'director' | 'committee_member' | 'legal' | 'ops';
  responsibilities: string[];
  notificationPreferences: {
    email: boolean;
    slack: boolean;
    dashboard: boolean;
  };
}

export interface NotificationRecord {
  id: string;
  type: 'screening_complete' | 'review_required' | 'approval_needed' | 'deadline_approaching' | 'status_update';
  recipientId: string;
  title: string;
  message: string;
  sent: boolean;
  sentAt?: string;
  readAt?: string;
  actionRequired: boolean;
  actionUrl?: string;
}

export interface GeneratedDocument {
  id: string;
  type: 'investment_summary' | 'committee_memo' | 'due_diligence_plan' | 'risk_assessment' | 'benchmark_analysis';
  title: string;
  content: string;
  format: 'pdf' | 'docx' | 'html' | 'markdown';
  generatedBy: 'ai' | 'template' | 'user';
  createdAt: string;
  downloadUrl?: string;
  templateId?: string;
}

export interface DealScreeningResult {
  id: string;
  opportunityId: string;
  templateId: string;
  totalScore: number; // 0-100
  criteriaScores: DealScore[];
  recommendation: 'highly_recommended' | 'recommended' | 'neutral' | 'not_recommended' | 'rejected';
  notes: string;
  
  // AI Enhancement fields
  aiProcessingTime?: number; // seconds
  humanReviewTime?: number; // seconds
  automationLevel: 'manual' | 'assisted' | 'autonomous';
  
  createdAt: string;
  createdBy: string;
  reviewedBy?: string;
  reviewedAt?: string;
}

export interface DealComparisonItem {
  opportunityId: string;
  opportunityName: string;
  totalScore: number;
  criteriaScores: {
    criterionId: string;
    criterionName: string;
    score: number;
  }[];
  financialMetrics: {
    expectedReturn: number;
    expectedRisk: number;
    expectedMultiple: number;
    expectedIRR: number;
    navPercentage: number;
    askPrice: number;
  };
  aiSimilarityScore?: number; // How similar to other deals
}

export interface HistoricalDeal {
  id: string;
  name: string;
  assetType: string;
  vintage: string;
  sector: string;
  geography: string;
  purchaseDate: string;
  purchasePrice: number;
  navAtPurchase: number;
  navPercentage: number;
  actualReturn: number;
  actualMultiple: number;
  actualIRR: number;
  holdingPeriod: number;
  exitDate?: string;
  exitValue?: number;
  status: 'active' | 'exited' | 'written_off';
  
  // AI learning data
  screeningScore?: number;
  screeningAccuracy?: number; // how accurate the screening was
}

// Navigation mode-specific interfaces
export interface DealScreeningNavigationState {
  mode: 'traditional' | 'assisted' | 'autonomous';
  showAIPanel: boolean;
  activeOpportunityId?: string;
  activeView: 'dashboard' | 'opportunities' | 'templates' | 'analysis' | 'comparison';
  sidebarCollapsed: boolean;
}

export interface DealScreeningAIState {
  recommendations: AIRecommendation[];
  processingTasks: string[]; // Task IDs being processed by AI
  automatedActions: AutomatedAction[];
  pendingApprovals: PendingApproval[];
}

export interface TemplateSelection {
  recommendedTemplates: DealScreeningTemplate[];
  selectedTemplate?: DealScreeningTemplate;
  customizations: {
    criterionId: string;
    customWeight?: number;
    isHidden?: boolean;
    aiOverride?: boolean;
  }[];
}

export interface ScreeningWorkflow {
  id: string;
  opportunityId: string;
  templateId: string;
  currentStep: number;
  totalSteps: number;
  status: 'not_started' | 'in_progress' | 'ai_processing' | 'human_review' | 'completed' | 'rejected';
  mode: 'traditional' | 'assisted' | 'autonomous';
  completedCriteria: string[];
  
  // Mode-specific workflow data
  traditionalData?: {
    manualOverrides: Record<string, any>;
    reviewNotes: string[];
  };
  assistedData?: {
    aiSuggestions: Record<string, number>;
    acceptedSuggestions: string[];
    humanInputRequired: string[];
  };
  autonomousData?: {
    aiCompletedCriteria: string[];
    pendingApprovals: string[];
    autoApprovedThreshold: number;
  };
  
  startedAt: string;
  completedAt?: string;
  estimatedTimeRemaining?: number; // minutes
}

export interface AutomatedAction {
  id: string;
  type: 'scoring' | 'analysis' | 'comparison' | 'documentation';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  description: string;
  createdAt: string;
  completedAt?: string;
  result?: any;
}

export interface PendingApproval {
  id: string;
  actionType: string;
  description: string;
  impact: 'low' | 'medium' | 'high';
  deadline?: string;
  data: any;
}

export interface DealScreeningState {
  // Core data
  templates: DealScreeningTemplate[];
  activeTemplate: DealScreeningTemplate | null;
  opportunities: DealOpportunity[];
  activeOpportunity: DealOpportunity | null;
  screeningResults: DealScreeningResult[];
  historicalDeals: HistoricalDeal[];
  comparisonList: string[]; // Array of opportunity IDs to compare
  
  // Navigation state
  navigationState: DealScreeningNavigationState;
  
  // AI state
  aiState: DealScreeningAIState;
  
  // Loading and error states
  isLoading: boolean;
  error: string | null;
  
  // Performance metrics
  metrics: {
    totalOpportunities: number;
    activeScreenings: number;
    completedScreenings: number;
    averageScreeningTime: number;
    conversionRate: number;
    aiEfficiencyGains: number;
  };
}

// Hook interfaces for the hybrid system
export interface UseDealScreeningOptions {
  mode?: 'traditional' | 'assisted' | 'autonomous';
  autoLoad?: boolean;
  enableAI?: boolean;
}

export interface DealScreeningActions {
  // Core actions
  createOpportunity: (opportunity: Partial<DealOpportunity>) => Promise<DealOpportunity>;
  updateOpportunity: (id: string, updates: Partial<DealOpportunity>) => Promise<DealOpportunity>;
  deleteOpportunity: (id: string) => Promise<void>;
  
  // Screening actions
  startScreening: (opportunityId: string, templateId: string) => Promise<DealScreeningResult>;
  updateScreeningScore: (resultId: string, scores: DealScore[]) => Promise<DealScreeningResult>;
  completeScreening: (resultId: string, notes: string) => Promise<DealScreeningResult>;
  
  // AI actions
  generateAIRecommendations: (opportunityId: string) => Promise<AIRecommendation[]>;
  executeAutomation: (actionId: string) => Promise<AutomatedAction>;
  approveAIAction: (approvalId: string) => Promise<void>;
  
  // Navigation actions
  switchMode: (mode: 'traditional' | 'assisted' | 'autonomous') => void;
  setActiveOpportunity: (opportunityId: string | null) => void;
  toggleAIPanel: () => void;
}