// Enhanced Portfolio Management Type Definitions

// Enums
export enum InvestmentStage {
  SEED = 'SEED',
  SERIES_A = 'SERIES_A',
  SERIES_B = 'SERIES_B',
  SERIES_C = 'SERIES_C',
  GROWTH = 'GROWTH',
  BUYOUT = 'BUYOUT',
  MEZZANINE = 'MEZZANINE',
  DISTRESSED = 'DISTRESSED'
}

export enum InvestmentType {
  PRIMARY = 'PRIMARY',
  SECONDARY = 'SECONDARY',
  CO_INVESTMENT = 'CO_INVESTMENT'
}

export enum CompanyStatus {
  ACTIVE = 'ACTIVE',
  EXITED = 'EXITED',
  WRITTEN_OFF = 'WRITTEN_OFF',
  UNDER_REVIEW = 'UNDER_REVIEW'
}

export enum RiskLevel {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

export enum ESGRating {
  A_PLUS = 'A+',
  A = 'A',
  B_PLUS = 'B+',
  B = 'B',
  C_PLUS = 'C+',
  C = 'C',
  D = 'D'
}

export enum ReportType {
  QUARTERLY = 'QUARTERLY',
  ANNUAL = 'ANNUAL',
  MONTHLY = 'MONTHLY'
}

export enum ReportStatus {
  DRAFT = 'DRAFT',
  UNDER_REVIEW = 'UNDER_REVIEW',
  APPROVED = 'APPROVED',
  PUBLISHED = 'PUBLISHED'
}

export enum AssessmentType {
  QUARTERLY = 'QUARTERLY',
  ANNUAL = 'ANNUAL',
  AD_HOC = 'AD_HOC',
  DUE_DILIGENCE = 'DUE_DILIGENCE'
}

export enum RiskTrend {
  IMPROVING = 'IMPROVING',
  STABLE = 'STABLE',
  DETERIORATING = 'DETERIORATING'
}

export enum AnalysisType {
  PORTFOLIO_OVERVIEW = 'PORTFOLIO_OVERVIEW',
  SECTOR_ANALYSIS = 'SECTOR_ANALYSIS',
  VINTAGE_ANALYSIS = 'VINTAGE_ANALYSIS',
  RISK_ANALYSIS = 'RISK_ANALYSIS'
}

// Portfolio Company Interface
export interface PortfolioCompany {
  id: string;
  name: string;
  description?: string;
  sector: string;
  subsector?: string;
  geography: string;
  website?: string;
  
  // Investment Details
  investmentDate: Date;
  initialInvestment: number;
  totalInvestment: number;
  currentValuation?: number;
  exitValuation?: number;
  exitDate?: Date;
  
  // Investment Stage & Type
  investmentStage: InvestmentStage;
  investmentType: InvestmentType;
  ownershipPercentage?: number;
  boardSeats: number;
  
  // Performance Metrics
  irr?: number;
  moic?: number;
  unrealizedGain?: number;
  realizedGain?: number;
  
  // Status
  status: CompanyStatus;
  riskRating: RiskLevel;
  
  // ESG Data
  esgScore?: number;
  environmentalScore?: number;
  socialScore?: number;
  governanceScore?: number;
  esgRating?: ESGRating;
  
  // Operating Metrics
  lastRevenue?: number;
  lastEbitda?: number;
  employeeCount?: number;
  customerCount?: number;
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  
  // Relationships
  performanceReports?: PerformanceReport[];
  esgReports?: ESGReport[];
  riskAssessments?: RiskAssessment[];
  quarterlyUpdates?: QuarterlyUpdate[];
  investmentThesis?: InvestmentThesis[];
}

// Performance Report Interface
export interface PerformanceReport {
  id: string;
  portfolioCompanyId: string;
  reportType: ReportType;
  reportPeriod: string;
  
  // Financial Performance
  revenue?: number;
  revenueGrowth?: number;
  grossProfit?: number;
  grossMargin?: number;
  ebitda?: number;
  ebitdaMargin?: number;
  netIncome?: number;
  
  // Operational Metrics
  customerGrowth?: number;
  customerRetention?: number;
  customerAcquisitionCost?: number;
  lifetimeValue?: number;
  
  // Market Metrics
  marketShare?: number;
  marketGrowth?: number;
  competitorAnalysis?: CompetitorData[];
  
  // Key Highlights
  achievements?: string[];
  challenges?: string[];
  milestones?: Milestone[];
  
  // Performance Analysis
  varianceAnalysis?: VarianceAnalysis;
  kpiPerformance?: KPIMetric[];
  managementCommentary?: string;
  
  // Risk Factors
  identifiedRisks?: RiskFactor[];
  mitigationPlans?: MitigationPlan[];
  
  // Future Outlook
  forecast?: FinancialForecast;
  upcomingInitiatives?: Initiative[];
  capitalRequirements?: number;
  
  // Status
  status: ReportStatus;
  reviewedBy?: string;
  reviewedAt?: Date;
  
  createdAt: Date;
  updatedAt: Date;
}

// ESG Report Interface
export interface ESGReport {
  id: string;
  portfolioCompanyId: string;
  reportPeriod: string;
  
  // Environmental Metrics
  carbonEmissions?: number;
  energyConsumption?: number;
  renewableEnergyPct?: number;
  wasteReduction?: number;
  waterUsage?: number;
  
  // Social Metrics
  employeeSatisfaction?: number;
  diversityMetrics?: DiversityMetrics;
  trainingHours?: number;
  safetyIncidents?: number;
  communityInvestment?: number;
  
  // Governance Metrics
  boardIndependence?: number;
  boardDiversity?: BoardDiversityMetrics;
  executiveCompensation?: ExecutiveCompensationData;
  complianceScore?: number;
  auditFindings?: number;
  
  // ESG Initiatives
  environmentalInitiatives?: Initiative[];
  socialInitiatives?: Initiative[];
  governanceImprovements?: Initiative[];
  
  // Performance vs Targets
  environmentalTargets?: ESGTarget[];
  socialTargets?: ESGTarget[];
  governanceTargets?: ESGTarget[];
  
  // Third-party Assessments
  sustainabilityRating?: string;
  certifications?: Certification[];
  benchmarkComparison?: BenchmarkData;
  
  // Overall Assessment
  overallScore?: number;
  improvementAreas?: string[];
  strengths?: string[];
  
  // Action Plans
  improvementPlan?: ImprovementPlan;
  timeline?: Timeline;
  responsibleParty?: string;
  
  createdAt: Date;
  updatedAt: Date;
}

// Risk Assessment Interface
export interface RiskAssessment {
  id: string;
  portfolioCompanyId: string;
  assessmentDate: Date;
  assessmentType: AssessmentType;
  
  // Risk Categories
  financialRisks?: RiskFactor[];
  operationalRisks?: RiskFactor[];
  marketRisks?: RiskFactor[];
  regulatoryRisks?: RiskFactor[];
  technologyRisks?: RiskFactor[];
  esgRisks?: RiskFactor[];
  
  // Risk Scoring
  overallRiskScore?: number;
  riskLevel: RiskLevel;
  riskTrend: RiskTrend;
  
  // Risk Mitigation
  mitigationStrategies?: MitigationStrategy[];
  contingencyPlans?: ContingencyPlan[];
  insuranceCoverage?: InsuranceCoverage[];
  
  // Monitoring
  keyRiskIndicators?: KeyRiskIndicator[];
  monitoringFrequency?: string;
  escalationProcedure?: EscalationProcedure;
  
  // Assessment Results
  highPriorityRisks?: RiskFactor[];
  emergingRisks?: RiskFactor[];
  riskAppetite?: RiskAppetiteStatement[];
  
  // Action Items
  actionPlan?: ActionPlan;
  responsibleParties?: ResponsibleParty[];
  dueDate?: Date;
  
  // Review and Approval
  reviewedBy?: string;
  reviewedAt?: Date;
  approvedBy?: string;
  approvedAt?: Date;
  nextReviewDate?: Date;
  
  createdAt: Date;
  updatedAt: Date;
}

// Quarterly Update Interface
export interface QuarterlyUpdate {
  id: string;
  portfolioCompanyId: string;
  quarter: string;
  year: number;
  
  // Executive Summary
  executiveSummary?: string;
  keyHighlights?: string[];
  concernAreas?: string[];
  
  // Financial Update
  financialHighlights?: FinancialHighlight[];
  budgetVariance?: BudgetVariance;
  cashFlow?: CashFlowAnalysis;
  forecastUpdate?: ForecastUpdate;
  
  // Operational Update
  operationalMetrics?: OperationalMetric[];
  teamUpdates?: TeamUpdate[];
  customerUpdates?: CustomerUpdate[];
  productUpdates?: ProductUpdate[];
  
  // Market Update
  marketDevelopments?: MarketDevelopment[];
  competitiveLandscape?: CompetitiveLandscape;
  marketOpportunities?: MarketOpportunity[];
  marketThreats?: MarketThreat[];
  
  // Strategic Initiatives
  strategicProjects?: StrategicProject[];
  initiativeProgress?: InitiativeProgress[];
  upcomingMilestones?: Milestone[];
  
  // Board and Governance
  boardMeetingNotes?: string;
  governanceUpdates?: GovernanceUpdate[];
  complianceUpdates?: ComplianceUpdate[];
  
  // ESG Update
  esgProgress?: ESGProgress[];
  sustainabilityMetrics?: SustainabilityMetric[];
  
  // Support Needed
  supportRequests?: SupportRequest[];
  introducedNeeds?: IntroductionRequest[];
  advisoryNeeds?: AdvisoryRequest[];
  
  // Attachments and Documents
  attachments?: DocumentReference[];
  presentationMaterials?: DocumentReference[];
  
  // Status and Review
  status: ReportStatus;
  submittedAt?: Date;
  reviewedAt?: Date;
  reviewedBy?: string;
  
  createdAt: Date;
  updatedAt: Date;
}

// Portfolio Analytics Interface
export interface PortfolioAnalytics {
  id: string;
  analysisDate: Date;
  analysisType: AnalysisType;
  
  // Portfolio Composition
  totalInvestments?: number;
  totalCommittedCapital?: number;
  totalInvestedCapital?: number;
  totalCurrentValue?: number;
  
  // Performance Metrics
  portfolioIRR?: number;
  portfolioMOIC?: number;
  portfolioDPI?: number;
  portfolioRVPI?: number;
  portfolioTVPI?: number;
  
  // Sector Analysis
  sectorAllocation?: SectorAllocation[];
  sectorPerformance?: SectorPerformance[];
  sectorTrends?: SectorTrend[];
  
  // Vintage Analysis
  vintagePerformance?: VintagePerformance[];
  vintageMaturity?: VintageMaturity[];
  
  // Geographic Analysis
  geographicAllocation?: GeographicAllocation[];
  geographicPerformance?: GeographicPerformance[];
  
  // Risk Analysis
  riskDistribution?: RiskDistribution[];
  concentrationRisk?: ConcentrationRisk[];
  correlationAnalysis?: CorrelationAnalysis[];
  
  // ESG Analysis
  esgScoreDistribution?: ESGScoreDistribution[];
  esgTrends?: ESGTrend[];
  esgBenchmarking?: ESGBenchmark[];
  
  // Market Analysis
  marketComparison?: MarketComparison[];
  peerAnalysis?: PeerAnalysis[];
  
  // Predictive Analytics
  performancePrediction?: PerformancePrediction[];
  riskForecasting?: RiskForecast[];
  scenarioAnalysis?: ScenarioAnalysis[];
  
  // Action Insights
  recommendations?: AIRecommendation[];
  opportunities?: Opportunity[];
  concerns?: Concern[];
  
  // Data Sources
  dataSources?: DataSource[];
  dataQuality?: DataQualityMetric[];
  lastUpdateDate?: Date;
  
  createdAt: Date;
  updatedAt: Date;
}

// Investment Thesis Interface
export interface InvestmentThesis {
  id: string;
  portfolioCompanyId: string;
  
  // Thesis Overview
  title: string;
  summary: string;
  investmentRationale: string;
  
  // Market Opportunity
  marketSize?: number;
  marketGrowth?: number;
  marketDrivers?: MarketDriver[];
  competitiveLandscape?: CompetitiveLandscape;
  
  // Company Positioning
  competitiveAdvantage?: CompetitiveAdvantage[];
  valueProposition?: string;
  businessModel?: string;
  
  // Investment Strategy
  valueCreationPlan?: ValueCreationInitiative[];
  exitStrategy?: ExitStrategy[];
  timelineExpectations?: TimelineExpectation[];
  
  // Financial Projections
  revenueProjections?: RevenueProjection[];
  profitabilityTargets?: ProfitabilityTarget[];
  returnExpectations?: ReturnExpectation[];
  
  // Key Risks
  primaryRisks?: RiskFactor[];
  mitigationStrategies?: MitigationStrategy[];
  
  // Success Metrics
  successMetrics?: SuccessMetric[];
  milestones?: Milestone[];
  
  // Team and Governance
  managementAssessment?: ManagementAssessment;
  boardComposition?: BoardComposition;
  governanceRights?: GovernanceRight[];
  
  // ESG Considerations
  esgOpportunities?: ESGOpportunity[];
  esgRisks?: ESGRisk[];
  
  // Status and Review
  status: string;
  lastReviewDate?: Date;
  nextReviewDate?: Date;
  
  createdAt: Date;
  updatedAt: Date;
}

// Supporting Interfaces and Types

export interface CompetitorData {
  name: string;
  marketShare?: number;
  revenue?: number;
  strengths: string[];
  weaknesses: string[];
}

export interface Milestone {
  id: string;
  title: string;
  description?: string;
  targetDate: Date;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'OVERDUE';
  importance: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

export interface VarianceAnalysis {
  budgetedRevenue: number;
  actualRevenue: number;
  revenueVariance: number;
  revenueVariancePercent: number;
  budgetedCosts: number;
  actualCosts: number;
  costVariance: number;
  costVariancePercent: number;
  explanation?: string;
}

export interface KPIMetric {
  name: string;
  value: number;
  target: number;
  previousValue?: number;
  unit: string;
  trend: 'UP' | 'DOWN' | 'STABLE';
  status: 'ON_TRACK' | 'AT_RISK' | 'OFF_TRACK';
}

export interface RiskFactor {
  id: string;
  category: string;
  title: string;
  description: string;
  likelihood: 'LOW' | 'MEDIUM' | 'HIGH';
  impact: 'LOW' | 'MEDIUM' | 'HIGH';
  riskScore: number;
  status: 'IDENTIFIED' | 'ASSESSING' | 'MITIGATING' | 'RESOLVED';
  owner?: string;
  dueDate?: Date;
}

export interface MitigationPlan {
  riskId: string;
  strategy: string;
  actions: string[];
  timeline: string;
  owner: string;
  status: 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED';
}

export interface FinancialForecast {
  period: string;
  revenue: number;
  revenueGrowth: number;
  grossProfit: number;
  ebitda: number;
  netIncome: number;
  assumptions: string[];
  confidence: 'LOW' | 'MEDIUM' | 'HIGH';
}

export interface Initiative {
  id: string;
  title: string;
  description: string;
  category: string;
  status: 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED' | 'ON_HOLD';
  progress: number;
  owner: string;
  startDate?: Date;
  targetDate?: Date;
  budget?: number;
}

export interface DiversityMetrics {
  genderDiversity: {
    male: number;
    female: number;
    nonBinary: number;
    preferNotToSay: number;
  };
  ethnicDiversity: {
    [key: string]: number;
  };
  ageDistribution: {
    [key: string]: number;
  };
}

export interface BoardDiversityMetrics {
  totalMembers: number;
  independentMembers: number;
  genderBreakdown: {
    male: number;
    female: number;
    nonBinary: number;
  };
  ethnicBreakdown: {
    [key: string]: number;
  };
  expertiseAreas: {
    [key: string]: number;
  };
}

export interface ExecutiveCompensationData {
  ceoCompensation: {
    baseSalary: number;
    bonus: number;
    equity: number;
    total: number;
  };
  executiveTeam: Array<{
    role: string;
    baseSalary: number;
    bonus: number;
    equity: number;
    total: number;
  }>;
  payRatio: number;
  benchmarkComparison: string;
}

export interface ESGTarget {
  metric: string;
  target: number;
  current: number;
  unit: string;
  deadline: Date;
  progress: number;
  status: 'ON_TRACK' | 'AT_RISK' | 'OFF_TRACK';
}

export interface Certification {
  name: string;
  issuingBody: string;
  dateIssued: Date;
  expiryDate?: Date;
  status: 'ACTIVE' | 'EXPIRED' | 'PENDING';
}

export interface BenchmarkData {
  metric: string;
  companyScore: number;
  peerAverage: number;
  industryAverage: number;
  bestInClass: number;
  percentile: number;
}

export interface ImprovementPlan {
  objectives: string[];
  initiatives: Initiative[];
  budget: number;
  timeline: string;
  expectedImpact: string;
  successMetrics: string[];
}

export interface Timeline {
  phases: Array<{
    name: string;
    startDate: Date;
    endDate: Date;
    deliverables: string[];
    milestones: string[];
  }>;
}

// Hybrid Mode Specific Types
export interface TraditionalPortfolioView {
  showDetailedMetrics: boolean;
  showAllCompanies: boolean;
  groupBy: 'SECTOR' | 'VINTAGE' | 'STAGE' | 'GEOGRAPHY' | 'STATUS';
  sortBy: string;
  filterCriteria: FilterCriteria;
}

export interface AssistedPortfolioView {
  aiRecommendations: PortfolioRecommendation[];
  smartInsights: PortfolioInsight[];
  automationSuggestions: AutomationSuggestion[];
  riskAlerts: RiskAlert[];
}

export interface AutonomousPortfolioView {
  priorityActions: PriorityAction[];
  decisionQueue: Decision[];
  automatedReports: AutomatedReport[];
  performanceAlerts: PerformanceAlert[];
}

export interface PortfolioRecommendation {
  type: 'REBALANCE' | 'RISK_MITIGATION' | 'VALUE_CREATION' | 'EXIT_STRATEGY';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  title: string;
  description: string;
  rationale: string;
  expectedImpact: string;
  confidence: number;
  actions: string[];
  timeline: string;
}

export interface PortfolioInsight {
  category: 'PERFORMANCE' | 'RISK' | 'ESG' | 'MARKET' | 'OPERATIONAL';
  title: string;
  description: string;
  relevantCompanies: string[];
  trendDirection: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL';
  significance: 'LOW' | 'MEDIUM' | 'HIGH';
  actionable: boolean;
}

export interface FilterCriteria {
  sectors?: string[];
  geographies?: string[];
  investmentStages?: InvestmentStage[];
  riskLevels?: RiskLevel[];
  esgRatings?: ESGRating[];
  vintageYears?: number[];
  performanceRange?: {
    minIRR?: number;
    maxIRR?: number;
    minMOIC?: number;
    maxMOIC?: number;
  };
}