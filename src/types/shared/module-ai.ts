/**
 * Shared AI state management types for all modules
 * Eliminates duplication across module-specific AI state interfaces
 */

import type { HybridMode } from '@/components/shared'

export interface BaseAIRecommendation {
  id: string
  type: 'suggestion' | 'automation' | 'warning' | 'insight'
  priority: 'low' | 'medium' | 'high' | 'critical'
  title: string
  description: string
  actions: BaseRecommendedAction[]
  confidence: number
  moduleContext: string
  timestamp: Date
}

export interface BaseRecommendedAction {
  id: string
  label: string
  action: string
  primary?: boolean
  estimatedTimeSaving?: number
  estimatedImpact?: string
}

export interface BaseProcessingTask {
  id: string
  type: string
  description: string
  progress: number
  estimatedCompletion: Date
}

export interface BaseAutomatedAction {
  id: string
  action: string
  description: string
  timestamp: Date
  status: 'completed' | 'in_progress' | 'failed'
  rollbackable: boolean
}

export interface BasePendingApproval {
  id: string
  action: string
  description: string
  risk: 'low' | 'medium' | 'high'
  impact: string[]
  requestedAt: Date
}

/**
 * Base AI state interface that all modules should extend
 */
export interface BaseModuleAIState {
  recommendations: BaseAIRecommendation[]
  processingTasks: BaseProcessingTask[]
  automatedActions: BaseAutomatedAction[]
  pendingApprovals: BasePendingApproval[]
}

/**
 * Module-specific AI state extensions
 */
export interface ModuleAIStateExtensions {
  'advanced-analytics': {
    analyticsType?: string
    modelType?: string
    dataSize?: string
    accuracy?: number
    confidence?: number
    aiScore?: number
  }
  'portfolio': {
    estimatedImpact?: string
    assetId?: string
    optimizationType?: 'rebalancing' | 'optimization' | 'risk' | 'opportunity'
    assetType?: 'traditional' | 'real_estate' | 'infrastructure'
    riskScore?: number
    predictedGrowth?: number
    aiOptimizationScore?: number
  }
  'due-diligence': {
    projectId?: string
    riskLevel?: 'low' | 'medium' | 'high' | 'critical'
    completionPercentage?: number
    findingsCount?: number
    tasksRemaining?: number
    documentsAnalyzed?: number
    assessmentType?: 'financial' | 'operational' | 'legal' | 'management' | 'technical'
    dueDiligencePhase?: 'initial' | 'deep_dive' | 'final_review' | 'completed'
  }
  'deal-screening': {
    dealId?: string
    screeningStage?: 'initial' | 'detailed' | 'final' | 'approved' | 'rejected'
    assetType?: 'fund' | 'direct' | 'co-investment' | 'gp-led' | 'other'
    sector?: string
    geography?: string
    aiScore?: number
    valuationMatch?: number
    riskProfile?: 'low' | 'medium' | 'high' | 'critical'
    expectedIRR?: number
    expectedMultiple?: number
    screeningCriteriaMet?: number
    totalCriteria?: number
    priorityLevel?: 'low' | 'medium' | 'high' | 'critical'
  }
  'deal-structuring': {
    dealId?: string
    structureType?: string
  }
  'fund-operations': {
    fundId?: string
    operationType?: 'nav' | 'distributions' | 'capital_calls' | 'reporting' | 'compliance'
    calculationType?: 'automatic' | 'manual' | 'hybrid'
    accuracyLevel?: number
    processingTime?: number
    complianceStatus?: 'compliant' | 'warning' | 'violation' | 'pending'
    distributionAmount?: number
    navAccuracy?: number
    auditReadiness?: number
    regulatoryRisk?: 'low' | 'medium' | 'high' | 'critical'
  }
  'investment-committee': {
    meetingId?: string
    proposalId?: string
    committeeStage?: 'preparation' | 'review' | 'meeting' | 'decision' | 'follow_up'
    decisionType?: 'investment' | 'divestment' | 'follow_on' | 'policy' | 'strategic'
    voteResult?: 'approved' | 'rejected' | 'deferred' | 'conditional'
    consensusLevel?: number
    riskAssessment?: 'low' | 'medium' | 'high' | 'critical'
    dueProcess?: 'complete' | 'pending' | 'incomplete'
    materialPreparedness?: number
    attendanceRate?: number
    timeToDecision?: number
  }
  'legal-management': {
    documentType?: 'contract' | 'agreement' | 'policy' | 'compliance' | 'regulation'
    legalStatus?: 'draft' | 'review' | 'approved' | 'executed' | 'expired'
    complianceRisk?: 'low' | 'medium' | 'high' | 'critical'
    reviewStage?: 'initial' | 'detailed' | 'final' | 'executed'
    automatablePercent?: number
    legalComplexity?: 'simple' | 'moderate' | 'complex' | 'very_complex'
    jurisdictionRisk?: 'low' | 'medium' | 'high'
  }
  'market-intelligence': {
    dataSource?: 'internal' | 'external' | 'third_party' | 'public' | 'proprietary'
    analysisType?: 'trend' | 'competitive' | 'sector' | 'macro' | 'forecast'
    confidenceLevel?: number
    timeHorizon?: 'short_term' | 'medium_term' | 'long_term'
    marketSegment?: string
    geographicScope?: 'local' | 'regional' | 'national' | 'global'
    updateFrequency?: 'real_time' | 'daily' | 'weekly' | 'monthly' | 'quarterly'
    dataQuality?: number
  }
  'gp-portal': {
    portalUserType?: 'gp' | 'admin' | 'analyst' | 'viewer'
    contentType?: 'report' | 'update' | 'performance' | 'communication' | 'document'
    accessLevel?: 'public' | 'restricted' | 'confidential' | 'internal'
    engagementScore?: number
    automationLevel?: number
    userSatisfaction?: number
  }
  'lp-portal': {
    portalUserType?: 'lp' | 'limited_partner' | 'investor' | 'viewer'
    contentType?: 'statement' | 'report' | 'update' | 'performance' | 'distribution'
    accessLevel?: 'public' | 'restricted' | 'confidential' | 'investor_only'
    investorSegment?: 'institutional' | 'family_office' | 'individual' | 'corporate'
    engagementScore?: number
    communicationFreq?: 'daily' | 'weekly' | 'monthly' | 'quarterly'
  }
}

/**
 * Type-safe module AI state with extensions
 */
export type ModuleAIState<T extends keyof ModuleAIStateExtensions> = BaseModuleAIState & {
  recommendations: (BaseAIRecommendation & ModuleAIStateExtensions[T])[]
}

/**
 * AI action handlers interface
 */
export interface BaseAIActionHandlers {
  onExecuteAIAction: (actionId: string) => void
  onApproveAction: (approvalId: string) => void
  onRejectAction: (approvalId: string) => void
  onDismissRecommendation: (id: string) => void
}

/**
 * Module metrics interface
 */
export interface BaseModuleMetrics {
  [key: string]: number | string
  aiEfficiencyGains: number
  automationLevel: number
  accuracyImprovement: number
  timeSavedHours: number
  costReduction: number
}

/**
 * Base module props interface
 */
export interface BaseModuleProps {
  metrics: BaseModuleMetrics
  isLoading?: boolean
  onSwitchMode?: (mode: HybridMode) => void
}

/**
 * Traditional mode props interface
 */
export interface TraditionalModeProps extends BaseModuleProps {
  // Traditional mode specific props
}

/**
 * Assisted mode props interface
 */
export interface AssistedModeProps extends BaseModuleProps {
  aiRecommendations: BaseAIRecommendation[]
  onExecuteAIAction: (actionId: string) => void
  onDismissRecommendation: (id: string) => void
}

/**
 * Autonomous mode props interface
 */
export interface AutonomousModeProps {
  onSwitchMode?: (mode: HybridMode) => void
}