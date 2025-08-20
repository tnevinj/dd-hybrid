// Advanced Analytics Type Definitions

export type NavigationMode = 'traditional' | 'assisted' | 'autonomous';

// Analytics Model Types
export type ModelType = 
  | 'CORRELATION' 
  | 'REGRESSION' 
  | 'TIME_SERIES' 
  | 'MACHINE_LEARNING' 
  | 'MONTE_CARLO' 
  | 'VAR' 
  | 'SCENARIO';

export type AnalyticsCategory = 
  | 'PORTFOLIO_ANALYSIS' 
  | 'RISK_MODELING' 
  | 'PERFORMANCE_ATTRIBUTION' 
  | 'STRESS_TESTING' 
  | 'FORECASTING';

export type RunStatus = 
  | 'PENDING' 
  | 'RUNNING' 
  | 'COMPLETED' 
  | 'FAILED' 
  | 'CANCELLED';

// Correlation Analysis Types
export type CorrelationMethod = 'PEARSON' | 'SPEARMAN' | 'KENDALL';

export type PortfolioScope = 
  | 'FULL_PORTFOLIO' 
  | 'FUND' 
  | 'SECTOR' 
  | 'GEOGRAPHY' 
  | 'CUSTOM'
  | 'COMPANY';

export type Frequency = 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'YEARLY';

// Risk Model Types
export type RiskModelType = 
  | 'VAR' 
  | 'CVAR' 
  | 'EXPECTED_SHORTFALL' 
  | 'MONTE_CARLO' 
  | 'STRESS_TEST';

// Scenario Types
export type ScenarioType = 
  | 'STRESS_TEST' 
  | 'MONTE_CARLO' 
  | 'SENSITIVITY' 
  | 'HISTORICAL' 
  | 'HYPOTHETICAL';

export type StressScenarioType = 
  | 'HISTORICAL' 
  | 'HYPOTHETICAL' 
  | 'REGULATORY' 
  | 'MARKET_SHOCK' 
  | 'LIQUIDITY_CRISIS';

export type StressSeverity = 'MILD' | 'MODERATE' | 'SEVERE' | 'EXTREME';

// Forecast Types
export type ForecastType = 
  | 'VALUATION' 
  | 'CASH_FLOW' 
  | 'PERFORMANCE' 
  | 'RISK' 
  | 'MACRO_ECONOMIC';

export type ForecastMethodology = 
  | 'REGRESSION' 
  | 'TIME_SERIES' 
  | 'MACHINE_LEARNING' 
  | 'SIMULATION';

export type EntityType = 'PORTFOLIO' | 'FUND' | 'COMPANY' | 'MARKET';

export type Visibility = 'PUBLIC' | 'INTERNAL' | 'RESTRICTED';

export type AccessLevel = 'ALL' | 'SENIOR_ONLY' | 'IC_ONLY';

// Interfaces
export interface ModelParameter {
  name: string;
  type: 'NUMBER' | 'STRING' | 'BOOLEAN' | 'DATE' | 'ARRAY';
  value: any;
  description?: string;
  required: boolean;
  defaultValue?: any;
  constraints?: {
    min?: number;
    max?: number;
    options?: string[];
  };
}

export interface ModelInput {
  name: string;
  type: string;
  description: string;
  required: boolean;
  source?: string;
}

export interface ModelOutput {
  name: string;
  type: string;
  description: string;
  unit?: string;
}

export interface BacktestResult {
  period: {
    start: Date;
    end: Date;
  };
  accuracy: number;
  rmse: number;
  mae: number;
  hitRate: number;
  maxError: number;
  avgError: number;
}

export interface CorrelationData {
  entityA: string;
  entityB: string;
  correlation: number;
  pValue?: number;
  significance: boolean;
  observations: number;
}

export interface RiskFactor {
  name: string;
  type: 'MARKET' | 'SECTOR' | 'CURRENCY' | 'INTEREST_RATE' | 'COMMODITY' | 'MACRO';
  volatility?: number;
  weight?: number;
  distribution?: {
    type: 'NORMAL' | 'LOGNORMAL' | 'T_DISTRIBUTION' | 'HISTORICAL';
    parameters: any;
  };
}

export interface RiskComponent {
  name: string;
  contribution: number;
  percentage: number;
  marginalRisk: number;
}

export interface ShockDefinition {
  factor: string;
  shockType: 'ABSOLUTE' | 'RELATIVE';
  shockSize: number;
  unit?: string;
}

export interface ScenarioDefinition {
  name: string;
  description?: string;
  probability?: number;
  shocks: ShockDefinition[];
  duration?: number;
}

export interface MarketShock {
  factor: string;
  baseline: number;
  stressed: number;
  change: number;
  changePercent: number;
}

export interface ComponentImpact {
  name: string;
  baselineValue: number;
  stressedValue: number;
  impact: number;
  impactPercent: number;
  contribution: number;
}

export interface ForecastPoint {
  date: Date;
  value: number;
  confidence?: number;
  lowerBound?: number;
  upperBound?: number;
}

export interface PerformanceComponent {
  name: string;
  return: number;
  weight: number;
  contribution: number;
}

// Main Entity Interfaces
export interface AnalyticsModel {
  id: string;
  name: string;
  description?: string;
  modelType: ModelType;
  category: AnalyticsCategory;
  algorithm: string;
  parameters: ModelParameter[];
  inputs: ModelInput[];
  outputs: ModelOutput[];
  accuracy?: number;
  rSquared?: number;
  pValue?: number;
  confidence: number;
  backtestResults?: BacktestResult;
  validationScore?: number;
  lastTested?: Date;
  testResults?: any;
  isActive: boolean;
  version: string;
  lastCalibrated?: Date;
  nextCalibration?: Date;
  usage: number;
  visibility: Visibility;
  accessLevel: AccessLevel;
  createdBy: string;
  maintainedBy?: string;
  createdAt: Date;
  updatedAt: Date;
  runs?: AnalyticsRun[];
  scenarios?: ScenarioAnalysis[];
}

export interface AnalyticsRun {
  id: string;
  modelId: string;
  name?: string;
  description?: string;
  status: RunStatus;
  startTime: Date;
  endTime?: Date;
  duration?: number;
  inputData: any;
  dataSource?: string;
  dataRange?: any;
  results?: any;
  metadata?: any;
  executionTime?: number;
  memoryUsage?: number;
  errorLog?: string;
  triggeredBy: string;
  purpose?: string;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
  model?: AnalyticsModel;
}

export interface CorrelationMatrix {
  id: string;
  name: string;
  description?: string;
  portfolioScope: PortfolioScope;
  entityIds?: string[];
  startDate: Date;
  endDate: Date;
  frequency: Frequency;
  correlationData: CorrelationData[];
  pValues?: any;
  observations: number;
  method: CorrelationMethod;
  minObservations: number;
  significance: number;
  strongCorrelations?: CorrelationData[];
  averageCorrelation?: number;
  maxCorrelation?: number;
  minCorrelation?: number;
  calculatedAt: Date;
  calculatedBy: string;
  version: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface RiskModel {
  id: string;
  name: string;
  description?: string;
  modelType: RiskModelType;
  confidenceLevel: number;
  timeHorizon: number;
  lookbackPeriod: number;
  riskFactors: RiskFactor[];
  correlationMatrix?: any;
  volatilities?: any;
  distributions?: any;
  calibrationDate?: Date;
  calibrationData?: any;
  backtestResults?: BacktestResult;
  isActive: boolean;
  lastUsed?: Date;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  calculations?: RiskCalculation[];
  stressTests?: StressTestScenario[];
}

export interface RiskCalculation {
  id: string;
  modelId: string;
  name?: string;
  portfolioScope: PortfolioScope;
  entityIds?: string[];
  var95?: number;
  var99?: number;
  expectedShortfall?: number;
  volatility?: number;
  componentRisks?: RiskComponent[];
  correlationRisk?: number;
  specificRisk?: number;
  calculationDate: Date;
  asOfDate: Date;
  riskContribution?: RiskComponent[];
  marginalRisk?: RiskComponent[];
  confidence: number;
  methodology?: string;
  calculatedBy: string;
  createdAt: Date;
  model?: RiskModel;
}

export interface ScenarioAnalysis {
  id: string;
  modelId?: string;
  name: string;
  description?: string;
  scenarioType: ScenarioType;
  scenarios: ScenarioDefinition[];
  shockFactors?: ShockDefinition[];
  probability?: number;
  portfolioScope: PortfolioScope;
  entityIds?: string[];
  asOfDate: Date;
  baselineValue: number;
  scenarioResults: any;
  worstCase?: number;
  bestCase?: number;
  expectedValue?: number;
  downsideRisk?: number;
  upsidePotential?: number;
  riskReward?: number;
  sensitivityData?: any;
  keyDrivers?: any;
  runDate: Date;
  runBy: string;
  version: number;
  createdAt: Date;
  updatedAt: Date;
  model?: AnalyticsModel;
}

export interface StressTestScenario {
  id: string;
  modelId?: string;
  name: string;
  description: string;
  scenarioType: StressScenarioType;
  shockDefinition: ShockDefinition[];
  duration?: number;
  severity: StressSeverity;
  marketShocks: MarketShock[];
  macroFactors?: any;
  liquidity?: any;
  historicalPeriod?: string;
  frequency?: string;
  lastRun?: Date;
  isActive: boolean;
  createdBy: string;
  createdAt: Date;
  updatedBy?: string;
  updatedAt: Date;
  model?: RiskModel;
  tests?: StressTestResult[];
}

export interface StressTestResult {
  id: string;
  scenarioId: string;
  name?: string;
  portfolioScope: PortfolioScope;
  entityIds?: string[];
  baselineValue: number;
  stressedValue: number;
  pnlImpact: number;
  percentImpact: number;
  componentImpacts?: ComponentImpact[];
  sectorImpacts?: ComponentImpact[];
  geographyImpacts?: ComponentImpact[];
  maxDrawdown?: number;
  recoveryTime?: number;
  liquidityImpact?: any;
  primaryDrivers?: string[];
  correlationEffects?: number;
  testDate: Date;
  asOfDate: Date;
  testedBy: string;
  createdAt: Date;
  scenario?: StressTestScenario;
}

export interface PerformanceAttribution {
  id: string;
  name: string;
  description?: string;
  portfolioScope: PortfolioScope;
  entityIds?: string[];
  benchmarkId?: string;
  startDate: Date;
  endDate: Date;
  frequency: Frequency;
  totalReturn: number;
  benchmarkReturn?: number;
  activeReturn?: number;
  trackingError?: number;
  allocationEffect?: number;
  selectionEffect?: number;
  interactionEffect?: number;
  currencyEffect?: number;
  sectorAttribution?: PerformanceComponent[];
  geoAttribution?: PerformanceComponent[];
  riskAttribution?: PerformanceComponent[];
  specificReturn?: number;
  positionReturns?: any;
  weights?: any;
  benchmarkWeights?: any;
  calculatedAt: Date;
  calculatedBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ForecastModel {
  id: string;
  name: string;
  description?: string;
  forecastType: ForecastType;
  methodology: ForecastMethodology;
  algorithm?: string;
  features: any[];
  parameters: ModelParameter[];
  trainingPeriod: any;
  validationPeriod?: any;
  accuracy?: number;
  rmse?: number;
  mae?: number;
  horizonDays: number;
  granularity: Frequency;
  isActive: boolean;
  lastTrained?: Date;
  nextRetraining?: Date;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  forecasts?: ForecastResult[];
}

export interface ForecastResult {
  id: string;
  modelId: string;
  name?: string;
  entityType: EntityType;
  entityId?: string;
  forecastDate: Date;
  asOfDate: Date;
  forecastHorizon: number;
  pointForecast: ForecastPoint[];
  intervalForecast?: any;
  distributionForecast?: any;
  confidence?: number;
  uncertainty?: number;
  scenarios?: any;
  assumptions?: any;
  actualValues?: any;
  forecastError?: any;
  lastValidated?: Date;
  generatedBy: string;
  createdAt: Date;
  model?: ForecastModel;
}

// Dashboard and UI Types
export interface AdvancedAnalyticsStats {
  totalModels: number;
  activeModels: number;
  completedRuns: number;
  runningAnalyses: number;
  correlationMatrices: number;
  stressTests: number;
  forecasts: number;
  totalExecutionTime: number;
}

export interface ModelSummary {
  id: string;
  name: string;
  modelType: ModelType;
  category: AnalyticsCategory;
  accuracy?: number;
  lastRun?: Date;
  usage: number;
  status: 'ACTIVE' | 'INACTIVE' | 'CALIBRATING' | 'ERROR';
}

export interface RecentRun {
  id: string;
  modelName: string;
  status: RunStatus;
  startTime: Date;
  duration?: number;
  triggeredBy: string;
  purpose?: string;
}

export interface CorrelationInsight {
  id: string;
  entityA: string;
  entityB: string;
  correlation: number;
  significance: 'HIGH' | 'MEDIUM' | 'LOW';
  trend: 'INCREASING' | 'DECREASING' | 'STABLE';
  businessImplication?: string;
}

export interface RiskAlert {
  id: string;
  title: string;
  description: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  riskType: 'VAR_BREACH' | 'CORRELATION_CHANGE' | 'VOLATILITY_SPIKE' | 'STRESS_FAILURE';
  triggeredAt: Date;
  entityAffected?: string;
  recommendation?: string;
}

export interface ScenarioInsight {
  id: string;
  scenarioName: string;
  worstCaseImpact: number;
  bestCaseUpside: number;
  keyDrivers: string[];
  probability?: number;
  recommendation: string;
}

// Hybrid Mode Specific Types
export interface HybridModeContent {
  traditional: {
    showAllModels: boolean;
    enableManualCalibration: boolean;
    showDetailedResults: boolean;
    advancedConfiguration: boolean;
  };
  assisted: {
    showModelRecommendations: boolean;
    highlightAnomalies: boolean;
    smartParameterSuggestions: boolean;
    contextualInsights: boolean;
  };
  autonomous: {
    autoModelSelection: boolean;
    autoCalibration: boolean;
    predictiveAlerts: boolean;
    intelligentScenarios: boolean;
    adaptiveParameters: boolean;
  };
}

// API Response Types
export interface AdvancedAnalyticsResponse {
  stats: AdvancedAnalyticsStats;
  models: AnalyticsModel[];
  modelSummaries: ModelSummary[];
  recentRuns: RecentRun[];
  correlationMatrices: CorrelationMatrix[];
  correlationInsights: CorrelationInsight[];
  riskModels: RiskModel[];
  riskCalculations: RiskCalculation[];
  riskAlerts: RiskAlert[];
  scenarios: ScenarioAnalysis[];
  scenarioInsights: ScenarioInsight[];
  stressTests: StressTestScenario[];
  stressTestResults: StressTestResult[];
  performanceAttributions: PerformanceAttribution[];
  forecastModels: ForecastModel[];
  forecastResults: ForecastResult[];
}

// Filter and Search Types
export interface ModelFilter {
  categories?: AnalyticsCategory[];
  modelTypes?: ModelType[];
  status?: ('ACTIVE' | 'INACTIVE')[];
  createdBy?: string[];
  lastRunRange?: {
    start: Date;
    end: Date;
  };
}

export interface RunFilter {
  statuses?: RunStatus[];
  modelIds?: string[];
  triggeredBy?: string[];
  dateRange?: {
    start: Date;
    end: Date;
  };
}

export interface SearchOptions {
  query?: string;
  modelFilters?: ModelFilter;
  runFilters?: RunFilter;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

// Component Props
export interface AdvancedAnalyticsDashboardProps {
  navigationMode: NavigationMode;
  onModeChange: (mode: NavigationMode) => void;
}

export interface ModelLibraryProps {
  models: AnalyticsModel[];
  summaries: ModelSummary[];
  onModelSelect: (model: AnalyticsModel) => void;
  onRunModel: (modelId: string, parameters?: any) => void;
  navigationMode: NavigationMode;
}

export interface CorrelationAnalysisProps {
  matrices: CorrelationMatrix[];
  insights: CorrelationInsight[];
  onMatrixSelect: (matrix: CorrelationMatrix) => void;
  onRunAnalysis: (config: any) => void;
  navigationMode: NavigationMode;
}

export interface RiskAnalysisProps {
  models: RiskModel[];
  calculations: RiskCalculation[];
  alerts: RiskAlert[];
  onModelSelect: (model: RiskModel) => void;
  navigationMode: NavigationMode;
}

export interface ScenarioAnalysisProps {
  scenarios: ScenarioAnalysis[];
  insights: ScenarioInsight[];
  stressTests: StressTestScenario[];
  onScenarioSelect: (scenario: ScenarioAnalysis) => void;
  navigationMode: NavigationMode;
}

export interface ForecastingProps {
  models: ForecastModel[];
  results: ForecastResult[];
  onModelSelect: (model: ForecastModel) => void;
  onGenerateForecast: (modelId: string, config: any) => void;
  navigationMode: NavigationMode;
}