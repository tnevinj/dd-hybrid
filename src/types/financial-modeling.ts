export interface FinancialModel {
  id: string;
  name: string;
  description: string;
  category: ModelCategory;
  subCategory: string;
  complexity: ModelComplexity;
  businessValue: BusinessValue;
  status: ModelStatus;
  version: string;
  lastUpdated: Date;
  estimatedValue: number;
  clientDemand: ClientDemand;
  prerequisites: string[];
  dependencies: string[];
  componentPath: string;
  icon: string;
  tags: string[];
  usageCount: number;
  averageRating: number;
  estimatedTimeToComplete: number; // in minutes
  requiredSkillLevel: SkillLevel;
}

export enum ModelCategory {
  CORE = 'core',
  VALUATION = 'valuation', 
  STRUCTURED_PRODUCTS = 'structured_products',
  TAX_LEGAL = 'tax_legal',
  ESG = 'esg',
  MULTI_JURISDICTION = 'multi_jurisdiction',
  PORTFOLIO_ANALYTICS = 'portfolio_analytics',
  RISK_MANAGEMENT = 'risk_management'
}

export enum ModelComplexity {
  BASIC = 'basic',
  INTERMEDIATE = 'intermediate', 
  ADVANCED = 'advanced',
  EXPERT = 'expert'
}

export enum BusinessValue {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

export enum ModelStatus {
  AVAILABLE = 'available',
  IN_DEVELOPMENT = 'in_development',
  BETA = 'beta',
  DEPRECATED = 'deprecated',
  PLANNED = 'planned'
}

export enum ClientDemand {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  VERY_HIGH = 'very_high'
}

export enum SkillLevel {
  ANALYST = 'analyst',
  ASSOCIATE = 'associate',
  VP = 'vp',
  DIRECTOR = 'director',
  MD = 'md'
}

export interface ModelFilter {
  category?: ModelCategory;
  complexity?: ModelComplexity;
  status?: ModelStatus;
  businessValue?: BusinessValue;
  skillLevel?: SkillLevel;
  searchTerm?: string;
  tags?: string[];
  minRating?: number;
}

export interface ModelRegistry {
  [key: string]: FinancialModel;
}

export interface ModelResult {
  modelId: string;
  results: any;
  confidence: number;
  warnings: string[];
  recommendations: string[];
  timestamp: Date;
}

export interface ModelSession {
  id: string;
  dealId: string;
  userId: string;
  activeModels: string[];
  results: { [modelId: string]: ModelResult };
  lastSaved: Date;
  isAutoSaveEnabled: boolean;
}

export interface ModelComparison {
  models: string[];
  metrics: string[];
  results: { [metric: string]: { [modelId: string]: number } };
  recommendations: string[];
}

export interface ModelTemplate {
  id: string;
  name: string;
  description: string;
  modelId: string;
  template: any;
  isPublic: boolean;
  createdBy: string;
  usageCount: number;
  tags: string[];
}

// Multi-Round Pricing Types
export interface MultiRoundPricingInputs {
  fundId: string;
  fundName: string;
  totalCommitments: number;
  currentNAV: number;
  targetRaise: number;
  existingInvestors: ExistingInvestor[];
  marketConditions: MarketConditions;
  pricingStrategy: PricingStrategy;
  offerStructure: OfferStructure;
}

export interface ExistingInvestor {
  id: string;
  name: string;
  type: 'institutional' | 'individual' | 'strategic' | 'sovereign_wealth';
  commitment: number;
  unfundedCommitment: number;
  contributionHistory: InvestorContribution[];
  liquidityProfile: LiquidityProfile;
  relationshipTier: 'tier_1' | 'tier_2' | 'tier_3';
}

export interface InvestorContribution {
  date: Date;
  amount: number;
  nav: number;
  vintage: string;
}

export interface LiquidityProfile {
  preferredLiquidity: number;
  liquidityUrgency: 'low' | 'medium' | 'high';
  cashflowNeeds: CashflowNeed[];
}

export interface CashflowNeed {
  date: Date;
  amount: number;
  confidence: number;
}

export interface MarketConditions {
  secondaryMarketDiscount: number;
  demandSupplyRatio: number;
  interestRates: number;
  marketVolatility: number;
  sectorPerformance: number;
}

export interface PricingStrategy {
  baseMethod: 'nav_based' | 'market_based' | 'hybrid';
  discountRange: { min: number; max: number };
  premiumFactors: PremiumFactor[];
  tieredPricing: boolean;
  volumeDiscounts: VolumeDiscount[];
}

export interface PremiumFactor {
  factor: string;
  impact: number;
  rationale: string;
}

export interface VolumeDiscount {
  threshold: number;
  discount: number;
}

export interface OfferStructure {
  offerType: 'tender_offer' | 'continuation_fund' | 'stapled_secondary';
  minimumCommitment: number;
  maximumCommitment: number;
  allocationMethod: 'pro_rata' | 'preferential' | 'auction';
  closingConditions: string[];
}

// Sum of Parts Types
export interface SOTPInputs {
  companyName: string;
  analysisDate: Date;
  currency: string;
  segments: BusinessSegment[];
  corporateAdjustments: CorporateAdjustments;
  marketAssumptions: MarketAssumptions;
  analysisSettings: AnalysisSettings;
}

export interface BusinessSegment {
  id: string;
  name: string;
  description: string;
  classification: SegmentClassification;
  financials: SegmentFinancials;
  valuationMethods: ValuationMethods;
  adjustments: SegmentAdjustments;
  ownership: OwnershipStructure;
}

export interface SegmentClassification {
  type: 'operating_business' | 'investment' | 'real_estate' | 'intellectual_property' | 'other';
  industry: string;
  sector: string;
  geography: string[];
  operatingStatus: 'active' | 'discontinued' | 'held_for_sale';
}

export interface SegmentFinancials {
  revenue: number;
  ebitda: number;
  ebit: number;
  netIncome: number;
  assets: number;
  liabilities: number;
  capex: number;
  freeCashFlow: number;
  revenueGrowth: number;
  ebitdaGrowth: number;
  ebitdaMargin: number;
  netMargin: number;
  assetTurnover: number;
  returnOnAssets: number;
}

export interface ValuationMethods {
  primary: 'multiples' | 'dcf' | 'market_value' | 'asset_based';
  multiples?: MultiplesValuation;
  dcf?: DCFValuation;
  marketValue?: MarketValueValuation;
  assetBased?: AssetBasedValuation;
}

export interface MultiplesValuation {
  industryMultiples: IndustryMultiples;
  selectedMultiples: SelectedMultiples;
}

export interface IndustryMultiples {
  evRevenue: { min: number; median: number; max: number };
  evEbitda: { min: number; median: number; max: number };
  evEbit: { min: number; median: number; max: number };
  peRatio: { min: number; median: number; max: number };
}

export interface SelectedMultiples {
  evRevenue?: number;
  evEbitda?: number;
  evEbit?: number;
  peRatio?: number;
}

export interface MarketValueValuation {
  sharePrice: number;
  sharesOwned: number;
  ownershipPercentage: number;
  marketCapitalization: number;
  marketValueOfPosition: number;
  marketPremiumDiscount: number;
}

export interface SegmentAdjustments {
  operationalAdjustments: OperationalAdjustment[];
  marketAdjustments: MarketAdjustments;
  riskAdjustments: RiskAdjustments;
}

export interface MarketAdjustments {
  sizeAdjustment: number;
  liquidityAdjustment: number;
  controlAdjustment: number;
  keyPersonAdjustment: number;
}

export interface RiskAdjustments {
  businessRiskPremium: number;
  operationalRiskDiscount: number;
  regulatoryRiskDiscount: number;
  concentrationRiskDiscount: number;
}

export interface CorporateAdjustments {
  holdingCompanyDiscount: HoldingCompanyDiscount;
  conglomerateAdjustment: ConglomerateAdjustment;
  corporateCosts: CorporateCosts;
  taxAdjustments: TaxAdjustments;
  financialItems: FinancialItems;
}

export interface HoldingCompanyDiscount {
  enabled: boolean;
  discountRate: number;
  rationale: string;
}

export interface ConglomerateAdjustment {
  enabled: boolean;
  adjustmentRate: number;
  rationale: string;
  diversificationBenefit: number;
  synergyCost: number;
  managementComplexity: number;
}

export interface CorporateCosts {
  annualCorporateOverhead: number;
  presentValueOfOverheads: number;
  discountRate: number;
  perpetualCostAssumption: boolean;
}

export interface TaxAdjustments {
  taxBenefitsFromStructure: number;
  taxCostsFromReorganization: number;
  netTaxImpact: number;
}

export interface FinancialItems {
  excess_cash: number;
  marketable_securities: number;
  pension_obligations: number;
  debt: number;
  other_liabilities: number;
  contingent_liabilities: number;
}

// Tender Offer Types
export interface TenderOfferInputs {
  fundInformation: FundInformation;
  offerStructure: TenderOfferStructure;
  participantUniverse: ParticipantUniverse;
  pricingStrategy: TenderPricingStrategy;
  executionAssumptions: ExecutionAssumptions;
}

export interface FundInformation {
  fundName: string;
  vintage: number;
  totalCommitments: number;
  currentNAV: number;
  unfundedCommitments: number;
  assetClass: string;
  geography: string;
  strategy: string;
}

export interface TenderOfferStructure {
  offerType: 'full_liquidity' | 'partial_liquidity' | 'continuation_vehicle';
  targetSize: number;
  minimumSize: number;
  maximumSize: number;
  pricingMechanism: 'fixed_price' | 'auction' | 'market_clearing';
  allocationPriority: AllocationPriority[];
}

export interface AllocationPriority {
  tier: number;
  criteria: string;
  allocation: number;
}

export interface ParticipantUniverse {
  totalInvestors: number;
  investorSegments: InvestorSegment[];
  participationAssumptions: ParticipationAssumptions;
}

export interface InvestorSegment {
  segmentName: string;
  investorCount: number;
  totalCommitment: number;
  avgCommitmentSize: number;
  liquidityProfile: InvestorLiquidityProfile;
  behaviorProfile: InvestorBehaviorProfile;
}

export interface InvestorLiquidityProfile {
  liquidityNeed: 'low' | 'medium' | 'high';
  priceElasticity: number;
  timeHorizon: number;
  alternativeLiquidity: number;
}

export interface InvestorBehaviorProfile {
  participationProbability: number;
  volumeSensitivity: number;
  priceSensitivity: number;
  decisionTimeframe: number;
}

export interface ParticipationAssumptions {
  baseParticipationRate: number;
  priceElasticity: number;
  sizeConstraints: SizeConstraints;
  marketConditionImpact: number;
}

export interface SizeConstraints {
  minimumParticipation: number;
  maximumParticipation: number;
  concentrationLimits: number;
}

export interface TenderPricingStrategy {
  pricingMethod: 'nav_discount' | 'irr_targeting' | 'market_clearing';
  baseDiscount: number;
  pricingRange: { min: number; max: number };
  benchmarkReturns: BenchmarkReturns;
  competitiveConsiderations: CompetitiveConsiderations;
}

export interface BenchmarkReturns {
  targetIRR: number;
  referenceReturns: ReferenceReturn[];
  riskAdjustments: number;
}

export interface ReferenceReturn {
  benchmark: string;
  return: number;
  relevance: number;
}

export interface CompetitiveConsiderations {
  alternativeOpportunities: AlternativeOpportunity[];
  marketDynamics: MarketDynamics;
  timingFactors: TimingFactor[];
}

export interface AlternativeOpportunity {
  opportunity: string;
  expectedReturn: number;
  probability: number;
  impact: number;
}

export interface MarketDynamics {
  supplyDemandBalance: number;
  recentTransactionPricing: number;
  marketSentiment: 'positive' | 'neutral' | 'negative';
}

export interface TimingFactor {
  factor: string;
  impact: number;
  urgency: 'low' | 'medium' | 'high';
}

export interface ExecutionAssumptions {
  processTimeline: ProcessTimeline;
  marketingStrategy: MarketingStrategy;
  riskFactors: RiskFactor[];
  successFactors: SuccessFactor[];
}

export interface ProcessTimeline {
  preparationPhase: number;
  marketingPhase: number;
  biddingPhase: number;
  closingPhase: number;
  totalDuration: number;
}

export interface MarketingStrategy {
  targetChannels: string[];
  geographicFocus: string[];
  communicationFrequency: number;
  differentiationFactors: string[];
}

export interface RiskFactor {
  risk: string;
  probability: number;
  impact: number;
  mitigation: string;
}

export interface SuccessFactor {
  factor: string;
  importance: number;
  currentStatus: 'strong' | 'moderate' | 'weak';
}

// Cross-Border Tax Types
export interface CrossBorderTaxInputs {
  transactions: CrossBorderTransaction[];
  jurisdictions: TaxJurisdiction[];
  treaties: TaxTreaty[];
  optimizationObjective: OptimizationObjective;
}

export interface CrossBorderTransaction {
  id: string;
  description: string;
  type: TransactionType;
  amount: number;
  currency: string;
  sourceJurisdiction: string;
  destinationJurisdiction: string;
  frequency: TransactionFrequency;
  treatyEligible: boolean;
}

export interface TaxJurisdiction {
  code: string;
  name: string;
  corporateTaxRate: number;
  withholdingRates: WithholdingRate[];
  treatyNetwork: string[];
  incentives: TaxIncentive[];
}

export interface WithholdingRate {
  incomeType: TransactionType;
  standardRate: number;
  treatyRate: number;
  conditions: string[];
}

export interface TaxTreaty {
  jurisdictions: [string, string];
  benefits: TreatyBenefit[];
  limitations: TreatyLimitation[];
}

export interface TreatyBenefit {
  incomeType: TransactionType;
  reduction: number;
  conditions: string[];
}

// ESG Compliance Types
export interface ESGComplianceInputs {
  entity: ComplianceEntity;
  frameworks: ESGFramework[];
  requirements: ComplianceRequirement[];
  deadlines: ComplianceDeadline[];
  riskAssessment: ComplianceRiskAssessment;
}

export interface ComplianceEntity {
  id: string;
  name: string;
  type: 'fund' | 'portfolio_company' | 'fund_manager';
  jurisdiction: string;
  industry: string;
  size: EntitySize;
}

export interface ESGFramework {
  id: string;
  name: string;
  type: 'SASB' | 'GRI' | 'TCFD' | 'EU_TAXONOMY' | 'UNGC' | 'CDP';
  applicability: FrameworkApplicability;
  requirements: FrameworkRequirement[];
}

export interface FrameworkApplicability {
  mandatory: boolean;
  jurisdictions: string[];
  entityTypes: string[];
  thresholds: ApplicabilityThreshold[];
}

export interface ComplianceRequirement {
  id: string;
  framework: string;
  category: RequirementCategory;
  priority: 'critical' | 'high' | 'medium' | 'low';
  deadline: Date;
  status: ComplianceStatus;
  evidence: ComplianceEvidence[];
}

export enum ComplianceStatus {
  COMPLIANT = 'compliant',
  PARTIAL = 'partial',
  NON_COMPLIANT = 'non_compliant',
  NOT_APPLICABLE = 'not_applicable'
}

export interface ComplianceEvidence {
  id: string;
  type: 'document' | 'process' | 'system' | 'certification';
  description: string;
  verificationStatus: 'verified' | 'pending' | 'rejected';
  expiryDate?: Date;
}

export interface ComplianceDeadline {
  id: string;
  requirement: string;
  dueDate: Date;
  priority: 'critical' | 'high' | 'medium' | 'low';
  status: 'pending' | 'in_progress' | 'completed' | 'overdue';
}

export interface ComplianceRiskAssessment {
  overallRisk: 'low' | 'medium' | 'high' | 'critical';
  riskFactors: ComplianceRiskFactor[];
  mitigationPlan: MitigationPlan;
}

export interface ComplianceRiskFactor {
  factor: string;
  impact: 'low' | 'medium' | 'high' | 'critical';
  likelihood: number;
  mitigation: string;
}

// Anti-Dilution Types
export interface AntiDilutionInputs {
  originalInvestment: OriginalInvestment;
  newFinancing: NewFinancing;
  protectionType: AntiDilutionProtectionType;
  capitalStructure: CapitalStructure;
}

export interface OriginalInvestment {
  amount: number;
  pricePerShare: number;
  shares: number;
  liquidationPreference: number;
  participationRights: boolean;
}

export interface NewFinancing {
  amount: number;
  pricePerShare: number;
  shares: number;
  isDownRound: boolean;
  discountPercentage: number;
}

export enum AntiDilutionProtectionType {
  NONE = 'none',
  FULL_RATCHET = 'full_ratchet',
  WEIGHTED_AVERAGE_NARROW = 'weighted_average_narrow',
  WEIGHTED_AVERAGE_BROAD = 'weighted_average_broad'
}

export interface CapitalStructure {
  commonShares: number;
  preferredShares: number;
  optionPool: number;
  convertibleSecurities: number;
  warrants: number;
}

export interface AntiDilutionResults {
  adjustedPrice: number;
  adjustedShares: number;
  dilutionImpact: number;
  economicImpact: number;
  ownershipPercentage: OwnershipAnalysis;
}

export interface OwnershipAnalysis {
  before: number;
  after: number;
  change: number;
  protection: number;
}

// Additional missing type definitions
export interface OperationalAdjustment {
  id: string;
  description: string;
  impact: number;
  rationale: string;
}

export interface MarketAssumptions {
  riskFreeRate: number;
  marketRiskPremium: number;
  countryRiskPremium: number;
  illiquidityDiscount: number;
}

export interface AnalysisSettings {
  includeScenarioAnalysis: boolean;
  includeSensitivityAnalysis: boolean;
  includeMonteCarloAnalysis: boolean;
  confidenceLevels: number[];
}

export interface OwnershipStructure {
  parentOwnershipPercentage: number;
  minorityInterests: number;
  consolidationMethod: 'full' | 'equity_method' | 'proportional';
}

export interface DCFValuation {
  projectionYears: number;
  terminalGrowthRate: number;
  discountRate: number;
  terminalMultiple: number;
}

export interface AssetBasedValuation {
  bookValue: number;
  adjustments: AssetAdjustment[];
  liquidationValue: number;
  replacementCost: number;
}

export interface AssetAdjustment {
  asset: string;
  bookValue: number;
  marketValue: number;
  adjustment: number;
}

export enum TransactionType {
  DIVIDENDS = 'dividends',
  INTEREST = 'interest',
  ROYALTIES = 'royalties',
  MANAGEMENT_FEES = 'management_fees',
  CAPITAL_GAINS = 'capital_gains'
}

export enum TransactionFrequency {
  ONE_TIME = 'one_time',
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly',
  ANNUALLY = 'annually'
}

export interface OptimizationObjective {
  primary: 'minimize_tax' | 'maximize_efficiency' | 'reduce_compliance_cost';
  constraints: OptimizationConstraint[];
  weights: { [objective: string]: number };
}

export interface OptimizationConstraint {
  type: 'budget' | 'timeline' | 'risk' | 'regulatory';
  value: number;
  description: string;
}

export interface TaxIncentive {
  name: string;
  type: 'credit' | 'deduction' | 'exemption';
  benefit: number;
  conditions: string[];
}

export interface TreatyLimitation {
  type: 'substance_requirement' | 'beneficial_ownership' | 'limitation_on_benefits';
  description: string;
  conditions: string[];
}

export interface EntitySize {
  employees: number;
  revenue: number;
  assets: number;
  classification: 'small' | 'medium' | 'large' | 'very_large';
}

export interface FrameworkRequirement {
  id: string;
  category: RequirementCategory;
  description: string;
  mandatory: boolean;
  deadline?: Date;
}

export enum RequirementCategory {
  DISCLOSURE = 'disclosure',
  MEASUREMENT = 'measurement',
  REPORTING = 'reporting',
  GOVERNANCE = 'governance',
  RISK_MANAGEMENT = 'risk_management'
}

export interface ApplicabilityThreshold {
  metric: 'revenue' | 'assets' | 'employees' | 'market_cap';
  threshold: number;
  currency?: string;
}

export interface MitigationPlan {
  id: string;
  description: string;
  actions: MitigationAction[];
  timeline: number;
  budget: number;
  owner: string;
}

export interface MitigationAction {
  id: string;
  description: string;
  deadline: Date;
  status: 'pending' | 'in_progress' | 'completed';
  assignee: string;
}

// Results interfaces for all new models
export interface MultiRoundPricingResults {
  recommendedPricing: RecommendedPricing;
  investorResponse: InvestorResponse;
  marketAnalysis: MarketAnalysis;
  scenarios: PricingScenario[];
  riskAnalysis: RiskAnalysis;
}

export interface RecommendedPricing {
  basePrice: number;
  discountRange: { min: number; max: number };
  tieredPricing: TieredPrice[];
  allocationMethod: string;
}

export interface TieredPrice {
  tier: string;
  price: number;
  discount: number;
  allocation: number;
}

export interface InvestorResponse {
  expectedParticipation: number;
  demandByTier: { [tier: string]: number };
  priceElasticity: number;
  feedbackSummary: string[];
}

export interface MarketAnalysis {
  competitivePricing: number;
  marketDemand: 'low' | 'medium' | 'high';
  liquidityPremium: number;
  marketConditionsImpact: number;
}

export interface PricingScenario {
  name: string;
  price: number;
  participation: number;
  totalRaise: number;
  probability: number;
}

export interface RiskAnalysis {
  pricingRisk: 'low' | 'medium' | 'high';
  executionRisk: 'low' | 'medium' | 'high';
  marketRisk: 'low' | 'medium' | 'high';
  mitigationStrategies: string[];
}

export interface SOTPResults {
  valuationSummary: ValuationSummary;
  segmentAnalysis: SegmentAnalysis;
  corporateAnalysis: CorporateAnalysisResults;
  scenarioAnalysis?: ScenarioAnalysis;
  sensitivityAnalysis?: SensitivityAnalysis;
}

export interface ValuationSummary {
  sumOfParts: number;
  netAssetValue: number;
  valuePerShare: number;
  corporateAdjustments: number;
  impliedMultiple: number;
}

export interface SegmentAnalysis {
  contributionAnalysis: SegmentContribution[];
  aggregateMetrics: AggregateMetrics;
  performanceMetrics: SegmentPerformanceMetrics[];
}

export interface SegmentContribution {
  segmentId: string;
  segmentName: string;
  value: number;
  percentageOfTotal: number;
  valuePerShare: number;
}

export interface AggregateMetrics {
  totalRevenue: number;
  totalEbitda: number;
  weightedAverageMargins: WeightedAverageMargins;
  weightedAverageGrowth: WeightedAverageGrowth;
}

export interface WeightedAverageMargins {
  ebitdaMargin: number;
  netMargin: number;
  returnOnAssets: number;
}

export interface WeightedAverageGrowth {
  revenueGrowth: number;
  ebitdaGrowth: number;
}

export interface SegmentPerformanceMetrics {
  segmentId: string;
  roi: number;
  growthRate: number;
  marginProfile: number;
  riskAdjustedReturn: number;
}

export interface CorporateAnalysisResults {
  holdingCompanyDiscountImpact: number;
  corporateCostsImpact: number;
  netCorporateImpact: number;
  financialItemsBreakdown: FinancialItemsBreakdown;
}

export interface FinancialItemsBreakdown {
  netCash: number;
  netDebt: number;
  netFinancialItems: number;
  otherAdjustments: number;
}

export interface ScenarioAnalysis {
  scenarios: ValuationScenario[];
  probabilityWeightedValue: number;
  valueAtRisk: number;
}

export interface ValuationScenario {
  name: string;
  probability: number;
  value: number;
  keyAssumptions: { [key: string]: number };
}

export interface SensitivityAnalysis {
  keyDrivers: SensitivityDriver[];
  tornadoChart: TornadoChartData[];
  correlationMatrix: { [driver1: string]: { [driver2: string]: number } };
}

export interface SensitivityDriver {
  driver: string;
  baseCase: number;
  sensitivity: number;
  impact: number;
}

export interface TornadoChartData {
  variable: string;
  lowValue: number;
  highValue: number;
  lowImpact: number;
  highImpact: number;
}

export interface TenderOfferResults {
  executiveSummary: TenderExecutiveSummary;
  pricingAnalysis: TenderPricingAnalysis;
  participationAnalysis: TenderParticipationAnalysis;
  executionAnalysis: TenderExecutionAnalysis;
  recommendations: TenderRecommendation[];
}

export interface TenderExecutiveSummary {
  recommendedPrice: number;
  expectedParticipation: number;
  totalLiquidity: number;
  successProbability: number;
  keyRisks: string[];
}

export interface TenderPricingAnalysis {
  priceRange: { min: number; max: number };
  marketComparables: number;
  discountToNAV: number;
  impliedReturns: ImpliedReturns;
}

export interface ImpliedReturns {
  irr: number;
  multiple: number;
  cashOnCash: number;
}

export interface TenderParticipationAnalysis {
  participationBySegment: ParticipationBySegment[];
  priceElasticity: number;
  demandCurve: DemandPoint[];
}

export interface ParticipationBySegment {
  segment: string;
  participation: number;
  volume: number;
  averageSize: number;
}

export interface DemandPoint {
  price: number;
  demand: number;
  participation: number;
}

export interface TenderExecutionAnalysis {
  timeToClose: number;
  executionRisks: ExecutionRisk[];
  successFactors: ExecutionSuccessFactor[];
}

export interface ExecutionRisk {
  risk: string;
  probability: number;
  impact: 'low' | 'medium' | 'high';
  mitigation: string;
}

export interface ExecutionSuccessFactor {
  factor: string;
  importance: 'low' | 'medium' | 'high';
  currentStatus: 'weak' | 'moderate' | 'strong';
}

export interface TenderRecommendation {
  category: 'pricing' | 'structure' | 'marketing' | 'execution';
  recommendation: string;
  rationale: string;
  priority: 'low' | 'medium' | 'high';
}

export interface CrossBorderTaxResults {
  totalTaxCost: number;
  treatySavings: number;
  effectiveTaxRate: number;
  optimizationOpportunities: TaxOptimizationOpportunity[];
  complianceRequirements: TaxComplianceRequirement[];
}

export interface TaxOptimizationOpportunity {
  opportunity: string;
  potentialSavings: number;
  implementationCost: number;
  netBenefit: number;
  feasibility: 'low' | 'medium' | 'high';
}

export interface TaxComplianceRequirement {
  jurisdiction: string;
  requirement: string;
  deadline: Date;
  status: 'pending' | 'in_progress' | 'completed';
}

export interface ESGComplianceResults {
  overallComplianceScore: number;
  frameworkCompliance: { [framework: string]: number };
  riskAssessment: ESGRiskAssessment;
  actionPlan: ESGActionPlan;
  reportingStatus: ESGReportingStatus;
}

export interface ESGRiskAssessment {
  overallRisk: 'low' | 'medium' | 'high' | 'critical';
  risksByCategory: { [category: string]: number };
  priorityActions: string[];
}

export interface ESGActionPlan {
  actions: ESGAction[];
  timeline: number;
  budget: number;
  responsibleParties: string[];
}

export interface ESGAction {
  action: string;
  deadline: Date;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'in_progress' | 'completed';
  assignee: string;
}

export interface ESGReportingStatus {
  upcomingDeadlines: ESGDeadline[];
  completedReports: ESGReport[];
  pendingRequirements: string[];
}

export interface ESGDeadline {
  framework: string;
  requirement: string;
  deadline: Date;
  status: 'on_track' | 'at_risk' | 'overdue';
}

export interface ESGReport {
  framework: string;
  reportType: string;
  submissionDate: Date;
  status: 'submitted' | 'approved' | 'rejected';
}