export { HybridModeSwitcher, type HybridMode, type ModeConfig, type HybridModeSwitcherProps } from './HybridModeSwitcher'
export { HybridModeExplanation, type HybridModeExplanationProps } from './HybridModeExplanation'
export { HybridModeHeader, type HybridModeHeaderProps } from './HybridModeHeader'
export { ErrorBoundary, withErrorBoundary } from '../ErrorBoundary'
export { createModuleComponent, type BaseModuleComponentProps, type ModeModeComponents } from './BaseModuleComponent'

// AI Components
export { 
  AIRecommendationPanel, 
  AIInsightsPanel, 
  AIMetricsCard, 
  ModeIndicator,
  type AIMetric 
} from './ai'

// Standardized Design System Components
export {
  StandardizedKPICard,
  EfficiencyKPICard,
  PerformanceKPICard,
  AIScoreKPICard,
  type StandardizedKPICardProps,
  type KPITrend,
  type KPIType
} from './StandardizedKPICard'

export {
  StandardizedAIPanel,
  QuickAIInsights,
  AIProcessingStatus,
  type StandardizedAIPanelProps,
  type AIRecommendation,
  type RecommendationType,
  type ImpactLevel
} from './StandardizedAIPanel'

export {
  StandardizedSearchFilter,
  QuickSearchBar,
  type StandardizedSearchFilterProps,
  type FilterOption,
  type FilterCategory
} from './StandardizedSearchFilter'

export {
  StandardizedLoading,
  AIAnalysisLoading,
  DataSyncLoading,
  StandardizedEmpty,
  NoResultsEmpty,
  NoDataEmpty,
  StandardizedError,
  NetworkError,
  PermissionError,
  ValidationError,
  StandardizedSuccess,
  type StandardizedLoadingProps,
  type StandardizedEmptyProps,
  type StandardizedErrorProps,
  type StandardizedSuccessProps
} from './StandardizedStates'

// Design System Constants and Utilities
export { DESIGN_SYSTEM, getStatusColor, getPriorityColor } from '../../lib/design-system'
export { generateModuleData } from '../../lib/mock-data-generator'

// Standardized Module Components
export { InvestmentCommitteeTraditionalStandardized } from '../investment-committee/InvestmentCommitteeTraditionalStandardized'
export { InvestmentCommitteeAssistedStandardized } from '../investment-committee/InvestmentCommitteeAssistedStandardized'
export { DueDiligenceTraditionalStandardized } from '../due-diligence/DueDiligenceTraditionalStandardized'
export { DueDiligenceAssistedStandardized } from '../due-diligence/DueDiligenceAssistedStandardized'
export { DealScreeningTraditionalStandardized } from '../deal-screening/DealScreeningTraditionalStandardized'
export { DealScreeningAssistedStandardized } from '../deal-screening/DealScreeningAssistedStandardized'
export { PortfolioTraditionalStandardized } from '../portfolio/PortfolioTraditionalStandardized'
export { PortfolioAssistedStandardized } from '../portfolio/PortfolioAssistedStandardized'
export { LegalManagementTraditionalStandardized } from '../legal-management/LegalManagementTraditionalStandardized'
export { LegalManagementAssistedStandardized } from '../legal-management/LegalManagementAssistedStandardized'
export { FundOperationsTraditionalStandardized } from '../fund-operations/FundOperationsTraditionalStandardized'
export { FundOperationsAssistedStandardized } from '../fund-operations/FundOperationsAssistedStandardized'