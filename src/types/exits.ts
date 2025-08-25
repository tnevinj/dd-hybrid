// Exit Management Domain Types
// Comprehensive type definitions for exit strategy and process management

import {
  BaseEntity,
  TimestampedEntity,
  StatusEntity,
  Priority,
  RiskLevel
} from './shared-domain';

// Core Exit Types
export type ExitStrategy = 
  | 'ipo' 
  | 'strategic-sale' 
  | 'secondary-sale' 
  | 'management-buyout' 
  | 'dividend-recapitalization' 
  | 'other';

export type ExitStatus = 
  | 'planning' 
  | 'preparation' 
  | 'execution' 
  | 'completed' 
  | 'cancelled';

export type PreparationStage = 
  | 'not-started' 
  | 'planning' 
  | 'preparation' 
  | 'execution' 
  | 'completed';

export type MarketConditions = 
  | 'excellent' 
  | 'good' 
  | 'fair' 
  | 'poor';

export type AutomationLevel = 
  | 'manual' 
  | 'assisted' 
  | 'autonomous';

export type ComplianceStatus = 
  | 'pending' 
  | 'in-progress' 
  | 'completed';

export type ProcessCategory = 
  | 'financial' 
  | 'legal' 
  | 'operational' 
  | 'marketing' 
  | 'strategic' 
  | 'compliance';

export type TaskStatus = 
  | 'pending' 
  | 'in-progress' 
  | 'completed' 
  | 'on-hold' 
  | 'cancelled';

export type ValuationType = 
  | 'dcf' 
  | 'comparable-companies' 
  | 'precedent-transactions' 
  | 'asset-based' 
  | 'ai-model';

export type DocumentType = 
  | 'memo' 
  | 'report' 
  | 'presentation' 
  | 'model' 
  | 'contract' 
  | 'compliance' 
  | 'marketing';

export type DocumentCategory = 
  | 'internal' 
  | 'external' 
  | 'confidential' 
  | 'public';

export type AccessLevel = 
  | 'public' 
  | 'internal' 
  | 'confidential' 
  | 'restricted';

export type AnalysisType = 
  | 'performance' 
  | 'market-timing' 
  | 'readiness' 
  | 'risk-assessment' 
  | 'ai-insights';

export type ValidationStatus = 
  | 'pending' 
  | 'validated' 
  | 'approved';

// AI Enhancement Types
export interface AIInsight {
  id: string;
  type: 'opportunity' | 'warning' | 'recommendation' | 'insight';
  title: string;
  description: string;
  confidence: number; // 0-100
  actionable: boolean;
  priority: Priority;
  category: ProcessCategory;
  created_at: Date;
  expires_at?: Date;
  metadata?: Record<string, any>;
}

export interface MarketIntelligence {
  timing_score: number; // 0-10
  conditions: MarketConditions;
  trends: string[];
  peer_multiples: Record<string, number>;
  transaction_multiples: Record<string, number>;
  public_market_multiples: Record<string, number>;
  strategic_buyers: string[];
  financial_buyers: string[];
  competitive_landscape: any[];
  data_sources: string[];
  confidence_score: number; // 0-1
  ai_insights: AIInsight[];
  ai_timing_recommendation?: string;
  ai_strategy_recommendations: string[];
}

// Core Exit Entities
export interface ExitOpportunity extends BaseEntity, TimestampedEntity {
  // Basic Information
  portfolio_asset_id?: string;
  investment_id?: string;
  workspace_id?: string;
  company_name: string;
  sector?: string;
  exit_strategy: ExitStrategy;
  status: ExitStatus;
  preparation_stage: PreparationStage;
  progress: number; // 0-100

  // Financial Data
  current_valuation?: number; // in cents
  target_exit_value?: number; // in cents
  ai_predicted_value?: number; // in cents
  original_investment?: number; // in cents
  expected_irr?: number;
  expected_moic?: number;

  // Timing
  target_exit_date?: Date;
  ai_optimal_exit_date?: Date;
  actual_exit_date?: Date;
  holding_period_months?: number;

  // Market Assessment
  market_timing_score: number; // 0-10
  ai_exit_score: number; // 0-10
  market_conditions: MarketConditions;

  // Process Management
  exit_team_lead?: string;
  exit_advisors: string[];
  potential_buyers: string[];
  key_selling_points: string[];
  areas_for_improvement: string[];

  // Documentation
  exit_memo_id?: string;
  valuation_report_id?: string;
  legal_documents: string[];
  compliance_status: ComplianceStatus;

  // AI Enhancement
  ai_insights: AIInsight[];
  automation_level: AutomationLevel;

  // Metadata
  priority: Priority;
  risk_factors: string[];
  mitigation_strategies: string[];

  // Related Data
  processes?: ExitProcess[];
  tasks?: ExitTask[];
  market_intelligence?: ExitMarketIntelligence;
  valuations?: ExitValuation[];
  documents?: ExitDocument[];
  analytics?: ExitAnalytics[];
}

export interface ExitProcess extends BaseEntity, TimestampedEntity {
  exit_opportunity_id: string;
  process_name: string;
  process_category: ProcessCategory;
  status: TaskStatus;

  // Process Details
  description?: string;
  owner?: string;
  team_members: string[];
  dependencies: string[];

  // Timeline
  start_date?: Date;
  target_completion_date?: Date;
  actual_completion_date?: Date;
  estimated_hours?: number;
  actual_hours?: number;

  // Progress and Quality
  progress: number; // 0-100
  quality_score: number; // 0-10
  automation_level: AutomationLevel;

  // Deliverables
  tasks: string[];
  deliverables: string[];
  documents: string[];

  // AI Enhancement
  ai_recommendations: AIInsight[];
  ai_risk_assessment: Record<string, any>;

  // Related Data
  exit_tasks?: ExitTask[];
}

export interface ExitTask extends BaseEntity, TimestampedEntity {
  exit_opportunity_id: string;
  exit_process_id?: string;
  task_name: string;
  task_category: ProcessCategory;

  // Task Details
  description?: string;
  priority: Priority;
  status: TaskStatus;

  // Assignment
  assignee?: string;
  reviewer?: string;
  approver?: string;

  // Timeline
  due_date?: Date;
  completion_date?: Date;
  estimated_hours?: number;
  actual_hours?: number;

  // Dependencies
  dependencies: string[];
  blocking_factors: string[];

  // Progress
  progress: number; // 0-100
  deliverables: string[];
  documents: string[];
  notes?: string;

  // AI Enhancement
  automation_eligible: boolean;
  ai_suggestions: AIInsight[];
}

export interface ExitMarketIntelligence extends BaseEntity, TimestampedEntity {
  exit_opportunity_id?: string;
  sector: string;
  geography?: string;

  // Market Assessment
  market_timing_score: number; // 0-10
  market_conditions: MarketConditions;
  market_trends: string[];

  // Valuation Data
  peer_multiples: Record<string, number>;
  transaction_multiples: Record<string, number>;
  public_market_multiples: Record<string, number>;

  // Buyer Landscape
  strategic_buyers: string[];
  financial_buyers: string[];
  competitive_landscape: any[];

  // Data Quality
  data_sources: string[];
  data_freshness_date?: Date;
  confidence_score: number; // 0-1

  // AI Analysis
  ai_market_insights: AIInsight[];
  ai_timing_recommendation?: string;
  ai_strategy_recommendations: string[];
}

export interface ExitValuation extends BaseEntity, TimestampedEntity {
  exit_opportunity_id: string;
  valuation_type: ValuationType;
  valuation_date: Date;

  // Valuation Results
  enterprise_value?: number; // in cents
  equity_value?: number; // in cents
  per_share_value?: number; // in cents
  valuation_multiple?: number;

  // Methodology
  methodology_description?: string;
  key_assumptions: Record<string, any>;
  sensitivity_analysis: Record<string, any>;
  discount_rate?: number;
  terminal_growth_rate?: number;

  // Comparables
  comparable_companies: any[];
  transaction_comparables: any[];

  // Quality Assessment
  confidence_level: 'low' | 'medium' | 'high';
  quality_score: number; // 0-10
  peer_review_status: 'pending' | 'reviewed' | 'approved';

  // AI Enhancement
  ai_generated: boolean;
  ai_confidence_score: number; // 0-1
  ai_adjustments: AIInsight[];

  // Version Control
  version: string;
  previous_version_id?: string;

  // Authorship
  created_by?: string;
  reviewed_by?: string;
  approved_by?: string;
}

export interface ExitDocument extends BaseEntity, TimestampedEntity {
  exit_opportunity_id: string;
  document_name: string;
  document_type: DocumentType;
  document_category?: DocumentCategory;

  // Document Details
  description?: string;
  file_path?: string;
  file_size?: number;
  mime_type?: string;

  // Workflow
  status: 'draft' | 'review' | 'approved' | 'final' | 'archived';
  version: string;
  version_history: any[];

  // Authorship
  author?: string;
  reviewers: string[];
  approvers: string[];

  // Security
  access_level: AccessLevel;
  sharing_restrictions: string[];

  // AI Generation
  ai_generated: boolean;
  ai_template_used?: string;
  generation_metadata: Record<string, any>;

  // Metadata
  tags: string[];
  expiry_date?: Date;
}

export interface ExitAnalytics extends BaseEntity, TimestampedEntity {
  exit_opportunity_id?: string;
  analysis_date: Date;
  analysis_type: AnalysisType;

  // Analysis Results
  overall_score: number; // 0-10
  detailed_scores: Record<string, number>;
  recommendations: string[];
  risks: string[];
  opportunities: string[];

  // Market Analysis
  market_timing_score: number;
  sector_conditions: Record<string, any>;
  competitive_position: Record<string, any>;

  // Readiness Assessment
  financial_readiness_score: number;
  operational_readiness_score: number;
  legal_readiness_score: number;
  strategic_readiness_score: number;

  // AI Enhancement
  ai_generated: boolean;
  ai_model_version?: string;
  ai_confidence_score: number;
  ai_insights: AIInsight[];

  // Quality
  data_quality_score: number;
  validation_status: ValidationStatus;
  peer_review_completed: boolean;

  // Authorship
  created_by?: string;
}

// Aggregate Types for UI Components
export interface ExitOpportunityWithDetails extends ExitOpportunity {
  processes: ExitProcess[];
  tasks: ExitTask[];
  market_intelligence: ExitMarketIntelligence[];
  valuations: ExitValuation[];
  documents: ExitDocument[];
  analytics: ExitAnalytics[];
}

export interface ExitPipelineMetrics {
  total_opportunities: number;
  total_pipeline_value: number;
  average_ai_score: number;
  active_insights: number;
  optimal_timing_count: number;
  by_stage: Record<PreparationStage, number>;
  by_strategy: Record<ExitStrategy, number>;
  by_market_conditions: Record<MarketConditions, number>;
}

export interface ExitProcessMetrics {
  total_processes: number;
  completed_processes: number;
  overdue_processes: number;
  average_completion_time: number;
  automation_rate: number;
  quality_score: number;
}

export interface ExitTaskMetrics {
  total_tasks: number;
  completed_tasks: number;
  overdue_tasks: number;
  by_priority: Record<Priority, number>;
  by_status: Record<TaskStatus, number>;
  by_category: Record<ProcessCategory, number>;
  automation_eligible: number;
}

// Form and Input Types
export interface ExitOpportunityFormData {
  company_name: string;
  sector: string;
  exit_strategy: ExitStrategy;
  current_valuation?: number;
  target_exit_value?: number;
  target_exit_date?: string;
  exit_team_lead?: string;
  priority: Priority;
  description?: string;
}

export interface ExitProcessFormData {
  process_name: string;
  process_category: ProcessCategory;
  description?: string;
  owner?: string;
  target_completion_date?: string;
  estimated_hours?: number;
  automation_level: AutomationLevel;
}

export interface ExitTaskFormData {
  task_name: string;
  task_category: ProcessCategory;
  description?: string;
  priority: Priority;
  assignee?: string;
  due_date?: string;
  estimated_hours?: number;
  automation_eligible: boolean;
}

// Filter and Search Types
export interface ExitFilters {
  status?: ExitStatus[];
  exit_strategy?: ExitStrategy[];
  preparation_stage?: PreparationStage[];
  market_conditions?: MarketConditions[];
  sector?: string[];
  priority?: Priority[];
  automation_level?: AutomationLevel[];
  date_range?: {
    start: Date;
    end: Date;
  };
  value_range?: {
    min: number;
    max: number;
  };
  search?: string;
}

export interface ExitSearchParams {
  query?: string;
  filters: ExitFilters;
  sort_by?: string;
  sort_direction?: 'asc' | 'desc';
  page?: number;
  per_page?: number;
}

// API Response Types
export interface ExitOpportunityResponse {
  opportunities: ExitOpportunity[];
  total: number;
  page: number;
  per_page: number;
  has_more: boolean;
}

export interface ExitMetricsResponse {
  pipeline_metrics: ExitPipelineMetrics;
  process_metrics: ExitProcessMetrics;
  task_metrics: ExitTaskMetrics;
  market_metrics: {
    favorable_conditions: number;
    average_timing_score: number;
    total_market_intelligence: number;
  };
}

// State Management Types
export interface ExitState {
  opportunities: ExitOpportunity[];
  selected_opportunity?: ExitOpportunity;
  filters: ExitFilters;
  search_params: ExitSearchParams;
  loading: boolean;
  error?: string;
  metrics?: ExitMetricsResponse;
}

export interface ExitAction {
  type: 'SET_OPPORTUNITIES' 
      | 'SET_SELECTED_OPPORTUNITY' 
      | 'UPDATE_OPPORTUNITY' 
      | 'ADD_OPPORTUNITY' 
      | 'REMOVE_OPPORTUNITY' 
      | 'SET_FILTERS' 
      | 'SET_SEARCH_PARAMS' 
      | 'SET_LOADING' 
      | 'SET_ERROR' 
      | 'CLEAR_ERROR' 
      | 'SET_METRICS';
  payload?: any;
}

// Export namespace for organized imports
export namespace Exits {
  export type {
    ExitStrategy,
    ExitStatus,
    PreparationStage,
    MarketConditions,
    AutomationLevel,
    ProcessCategory,
    TaskStatus,
    ValuationType,
    DocumentType,
    DocumentCategory,
    AccessLevel,
    AnalysisType,
    ValidationStatus,
    ExitOpportunity,
    ExitProcess,
    ExitTask,
    ExitMarketIntelligence,
    ExitValuation,
    ExitDocument,
    ExitAnalytics,
    ExitOpportunityWithDetails,
    ExitPipelineMetrics,
    ExitProcessMetrics,
    ExitTaskMetrics,
    ExitOpportunityFormData,
    ExitProcessFormData,
    ExitTaskFormData,
    ExitFilters,
    ExitSearchParams,
    ExitOpportunityResponse,
    ExitMetricsResponse,
    ExitState,
    ExitAction,
    AIInsight,
    MarketIntelligence
  };
}