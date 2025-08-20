// Market Intelligence Type Definitions

export type NavigationMode = 'traditional' | 'assisted' | 'autonomous';

// Market Indicator Types
export type IndicatorCategory = 
  | 'ECONOMIC' 
  | 'FINANCIAL' 
  | 'GEOPOLITICAL' 
  | 'REGULATORY' 
  | 'INDUSTRY' 
  | 'COMMODITY';

export type DataType = 'NUMERIC' | 'PERCENTAGE' | 'INDEX' | 'CATEGORICAL' | 'BOOLEAN';

export type Frequency = 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'YEARLY';

export type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type Region = 'GLOBAL' | 'US' | 'EU' | 'ASIA' | 'EMERGING' | 'UK' | 'CHINA' | 'LATAM';

// Currency Types
export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'JPY' | 'CHF' | 'CAD' | 'AUD' | 'CNY' | 'HKD';

// Geopolitical Event Types
export type EventCategory = 
  | 'TRADE_WAR' 
  | 'SANCTIONS' 
  | 'POLICY_CHANGE' 
  | 'ELECTION' 
  | 'CONFLICT' 
  | 'TREATY' 
  | 'REGULATORY';

export type EventSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type EconomicImpact = 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL' | 'MIXED';

export type MarketImpact = 'BULLISH' | 'BEARISH' | 'NEUTRAL' | 'VOLATILE';

export type EventDuration = 'SHORT_TERM' | 'MEDIUM_TERM' | 'LONG_TERM';

// Alert Types
export type AlertType = 'THRESHOLD' | 'TREND' | 'VOLATILITY' | 'ANOMALY' | 'EVENT' | 'CORRELATION';

export type AlertStatus = 'ACTIVE' | 'ACKNOWLEDGED' | 'RESOLVED' | 'DISMISSED';

// Correlation Types
export type CorrelationMethod = 'PEARSON' | 'SPEARMAN' | 'KENDALL';

export type CorrelationStrength = 'WEAK' | 'MODERATE' | 'STRONG' | 'VERY_STRONG';

// Report Types
export type ReportType = 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'SPECIAL' | 'ALERT';

export type ReportCategory = 
  | 'MARKET_OVERVIEW' 
  | 'CURRENCY_ANALYSIS' 
  | 'GEOPOLITICAL' 
  | 'SECTOR_ANALYSIS' 
  | 'RISK_ASSESSMENT';

export type ReportStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

// AFME Types
export type AFMECategory = 
  | 'BANKING' 
  | 'CAPITAL_MARKETS' 
  | 'INSURANCE' 
  | 'FINTECH' 
  | 'ESG' 
  | 'REGULATORY';

// Interfaces
export interface AlertThreshold {
  type: 'ABOVE' | 'BELOW' | 'CHANGE' | 'VOLATILITY';
  value: number;
  enabled: boolean;
  recipients: string[];
}

export interface TradingSession {
  name: string;
  start: string; // HH:mm format
  end: string;   // HH:mm format
  timezone: string;
  isActive: boolean;
}

export interface Source {
  id: string;
  name: string;
  url?: string;
  reliability: number; // 0-1 scale
  lastVerified?: Date;
}

export interface KeyPoint {
  id: string;
  point: string;
  impact: 'HIGH' | 'MEDIUM' | 'LOW';
  evidence?: string;
}

export interface RiskFactor {
  id: string;
  factor: string;
  probability: number; // 0-1 scale
  impact: number;      // 0-1 scale
  mitigation?: string;
}

export interface Opportunity {
  id: string;
  opportunity: string;
  potential: number; // 0-1 scale
  timeframe: EventDuration;
  requirements?: string[];
}

export interface NotificationRecord {
  id: string;
  method: 'EMAIL' | 'SMS' | 'IN_APP' | 'WEBHOOK';
  recipient: string;
  sentAt: Date;
  delivered: boolean;
  error?: string;
}

export interface Recommendation {
  id: string;
  action: string;
  rationale: string;
  priority: Priority;
  timeframe?: string;
  confidence: number; // 0-1 scale
}

// Main Entity Interfaces
export interface MarketIndicator {
  id: string;
  name: string;
  category: IndicatorCategory;
  subcategory?: string;
  source: string;
  sourceUrl?: string;
  region: Region;
  dataType: DataType;
  unit?: string;
  frequency: Frequency;
  isActive: boolean;
  priority: Priority;
  alertThresholds?: AlertThreshold[];
  description?: string;
  methodology?: string;
  tags?: string[];
  lastUpdated?: Date;
  nextUpdate?: Date;
  dataPoints: number;
  createdBy: string;
  createdAt: Date;
  updatedBy?: string;
  updatedAt: Date;
  latestDataPoint?: MarketDataPoint;
  recentChange?: {
    absolute: number;
    percent: number;
    timeframe: string;
  };
}

export interface MarketDataPoint {
  id: string;
  indicatorId: string;
  timestamp: Date;
  value: number;
  rawValue?: string;
  confidence: number;
  isEstimated: boolean;
  isRevised: boolean;
  revisionCount: number;
  notes?: string;
  sourceReference?: string;
  previousValue?: number;
  changeAbsolute?: number;
  changePercent?: number;
  createdAt: Date;
  indicator?: MarketIndicator;
}

export interface CurrencyPair {
  id: string;
  baseCurrency: CurrencyCode;
  quoteCurrency: CurrencyCode;
  symbol: string;
  name: string;
  isActive: boolean;
  isMajorPair: boolean;
  priority: Priority;
  volatilityThreshold: number;
  trendThreshold: number;
  region?: string;
  tradingHours?: TradingSession[];
  createdAt: Date;
  updatedAt: Date;
  currentRate?: CurrencyRate;
  dayChange?: {
    absolute: number;
    percent: number;
  };
}

export interface CurrencyRate {
  id: string;
  pairId: string;
  timestamp: Date;
  rate: number;
  bid?: number;
  ask?: number;
  spread?: number;
  volume?: number;
  high24h?: number;
  low24h?: number;
  change24h?: number;
  changePercent24h?: number;
  volatility?: number;
  source: string;
  confidence: number;
  createdAt: Date;
  pair?: CurrencyPair;
}

export interface GeopoliticalEvent {
  id: string;
  title: string;
  description?: string;
  category: EventCategory;
  severity: EventSeverity;
  confidence: number;
  regions: string[];
  countries?: string[];
  eventDate?: Date;
  discoveredAt: Date;
  lastUpdated: Date;
  economicImpact?: EconomicImpact;
  marketImpact?: MarketImpact;
  expectedDuration?: EventDuration;
  affectedSectors?: string[];
  affectedAssets?: string[];
  isResolved: boolean;
  resolutionDate?: Date;
  sources: Source[];
  sourceUrl?: string;
  keyPoints?: KeyPoint[];
  riskFactors?: RiskFactor[];
  opportunities?: Opportunity[];
  createdBy: string;
  createdAt: Date;
  updatedBy?: string;
  updatedAt: Date;
}

export interface MarketAlert {
  id: string;
  title: string;
  description: string;
  alertType: AlertType;
  severity: EventSeverity;
  status: AlertStatus;
  indicatorId?: string;
  currencyPairId?: string;
  geopoliticalEventId?: string;
  triggerValue?: number;
  thresholdValue?: number;
  currentValue?: number;
  triggeredAt: Date;
  acknowledgedAt?: Date;
  acknowledgedBy?: string;
  resolvedAt?: Date;
  resolvedBy?: string;
  notificationsSent?: NotificationRecord[];
  recipients?: string[];
  impact?: string;
  recommendations?: Recommendation[];
  createdAt: Date;
  updatedAt: Date;
  indicator?: MarketIndicator;
  currencyPair?: CurrencyPair;
  geopoliticalEvent?: GeopoliticalEvent;
}

export interface MarketCorrelation {
  id: string;
  indicatorId: string;
  correlatedWith: string;
  correlation: number;
  pValue?: number;
  rSquared?: number;
  startDate: Date;
  endDate: Date;
  dataPoints: number;
  calculationMethod: CorrelationMethod;
  timeframe: string;
  isSignificant: boolean;
  strength: CorrelationStrength;
  calculatedAt: Date;
  indicator?: MarketIndicator;
  correlatedIndicator?: MarketIndicator;
}

export interface MarketReport {
  id: string;
  title: string;
  reportType: ReportType;
  category: ReportCategory;
  summary: string;
  content: string;
  keyFindings: string[];
  recommendations?: Recommendation[];
  regions?: string[];
  timeframe: string;
  indicators?: string[];
  currencyPairs?: string[];
  events?: string[];
  status: ReportStatus;
  publishedAt?: Date;
  tags?: string[];
  attachments?: any[];
  createdBy: string;
  createdAt: Date;
  updatedBy?: string;
  updatedAt: Date;
}

export interface AFMEMetric {
  id: string;
  metricName: string;
  category: AFMECategory;
  subcategory?: string;
  value: number;
  unit?: string;
  currency?: string;
  period: string;
  reportDate: Date;
  dataDate: Date;
  region: string;
  countries?: string[];
  description?: string;
  methodology?: string;
  notes?: string;
  previousValue?: number;
  changeAbsolute?: number;
  changePercent?: number;
  isEstimate: boolean;
  confidence: number;
  source: string;
  sourceUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Dashboard and UI Types
export interface MarketIntelligenceStats {
  totalIndicators: number;
  activeAlerts: number;
  currencyPairs: number;
  geopoliticalEvents: number;
  criticalAlerts: number;
  dataPointsToday: number;
  correlationsAnalyzed: number;
  reportsGenerated: number;
}

export interface TrendingIndicator {
  id: string;
  name: string;
  category: IndicatorCategory;
  currentValue: number;
  change: {
    absolute: number;
    percent: number;
    direction: 'UP' | 'DOWN' | 'FLAT';
  };
  significance: 'HIGH' | 'MEDIUM' | 'LOW';
  region: Region;
}

export interface CurrencySnapshot {
  pair: CurrencyPair;
  rate: number;
  change24h: number;
  changePercent24h: number;
  volatility: number;
  trend: 'STRENGTHENING' | 'WEAKENING' | 'STABLE';
  alertLevel: 'NONE' | 'LOW' | 'MEDIUM' | 'HIGH';
}

export interface EventSummary {
  id: string;
  title: string;
  category: EventCategory;
  severity: EventSeverity;
  regions: string[];
  impact: {
    economic?: EconomicImpact;
    market?: MarketImpact;
  };
  timeline: {
    discovered: Date;
    event?: Date;
    updated: Date;
  };
  status: 'ACTIVE' | 'MONITORING' | 'RESOLVED';
}

export interface AFMESummary {
  category: AFMECategory;
  metrics: {
    total: number;
    updated: number;
    alerts: number;
  };
  keyMetrics: Array<{
    name: string;
    value: number;
    change: number;
    unit?: string;
  }>;
  lastUpdate: Date;
}

// Hybrid Mode Specific Types
export interface HybridModeContent {
  traditional: {
    showRawData: boolean;
    enableManualAnalysis: boolean;
    showAllIndicators: boolean;
    detailedCharts: boolean;
  };
  assisted: {
    showTrendAnalysis: boolean;
    highlightAnomalies: boolean;
    suggestCorrelations: boolean;
    smartAlerts: boolean;
    contextualInsights: boolean;
  };
  autonomous: {
    autoGenerateReports: boolean;
    predictiveAnalytics: boolean;
    smartEventDetection: boolean;
    autoCorrelationAnalysis: boolean;
    intelligentAlerting: boolean;
    dynamicThresholds: boolean;
  };
}

// API Response Types
export interface MarketIntelligenceResponse {
  stats: MarketIntelligenceStats;
  indicators: MarketIndicator[];
  trendingIndicators: TrendingIndicator[];
  currencyPairs: CurrencyPair[];
  currencySnapshots: CurrencySnapshot[];
  geopoliticalEvents: GeopoliticalEvent[];
  eventSummaries: EventSummary[];
  alerts: MarketAlert[];
  correlations: MarketCorrelation[];
  afmeMetrics: AFMEMetric[];
  afmeSummaries: AFMESummary[];
  reports: MarketReport[];
}

// Filter and Search Types
export interface IndicatorFilter {
  categories?: IndicatorCategory[];
  regions?: Region[];
  priority?: Priority[];
  frequency?: Frequency[];
  isActive?: boolean;
  dateRange?: {
    start: Date;
    end: Date;
  };
}

export interface EventFilter {
  categories?: EventCategory[];
  severity?: EventSeverity[];
  regions?: string[];
  isResolved?: boolean;
  dateRange?: {
    start: Date;
    end: Date;
    field: 'eventDate' | 'discoveredAt' | 'lastUpdated';
  };
}

export interface AlertFilter {
  types?: AlertType[];
  severity?: EventSeverity[];
  status?: AlertStatus[];
  dateRange?: {
    start: Date;
    end: Date;
  };
}

export interface SearchOptions {
  query?: string;
  indicatorFilters?: IndicatorFilter;
  eventFilters?: EventFilter;
  alertFilters?: AlertFilter;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

// Component Props
export interface MarketIntelligenceDashboardProps {
  navigationMode: NavigationMode;
  onModeChange: (mode: NavigationMode) => void;
}

export interface IndicatorsPanelProps {
  indicators: MarketIndicator[];
  trendingIndicators: TrendingIndicator[];
  onIndicatorSelect: (indicator: MarketIndicator) => void;
  navigationMode: NavigationMode;
}

export interface CurrencyPanelProps {
  currencyPairs: CurrencyPair[];
  snapshots: CurrencySnapshot[];
  onPairSelect: (pair: CurrencyPair) => void;
  navigationMode: NavigationMode;
}

export interface GeopoliticalPanelProps {
  events: GeopoliticalEvent[];
  summaries: EventSummary[];
  onEventSelect: (event: GeopoliticalEvent) => void;
  navigationMode: NavigationMode;
}

export interface AlertsPanelProps {
  alerts: MarketAlert[];
  onAlertAction: (alertId: string, action: 'acknowledge' | 'resolve' | 'dismiss') => void;
  navigationMode: NavigationMode;
}

export interface AFMEPanelProps {
  metrics: AFMEMetric[];
  summaries: AFMESummary[];
  onCategorySelect: (category: AFMECategory) => void;
  navigationMode: NavigationMode;
}

export interface ReportsPanelProps {
  reports: MarketReport[];
  onReportSelect: (report: MarketReport) => void;
  onGenerateReport: (type: ReportType, category: ReportCategory) => void;
  navigationMode: NavigationMode;
}