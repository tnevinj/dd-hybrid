// Fund Operations Type Definitions

// Enums
export enum FundType {
  GROWTH_EQUITY = 'GROWTH_EQUITY',
  BUYOUT = 'BUYOUT',
  VENTURE = 'VENTURE',
  DEBT = 'DEBT',
  INFRASTRUCTURE = 'INFRASTRUCTURE',
  REAL_ESTATE = 'REAL_ESTATE',
  SECONDARY = 'SECONDARY',
  FUND_OF_FUNDS = 'FUND_OF_FUNDS'
}

export enum FundStatus {
  FUNDRAISING = 'FUNDRAISING',
  INVESTING = 'INVESTING',
  HARVESTING = 'HARVESTING',
  LIQUIDATING = 'LIQUIDATING',
  CLOSED = 'CLOSED'
}

export enum InvestorType {
  LP_ENTITY = 'LP_ENTITY',
  GP_COMMITMENT = 'GP_COMMITMENT',
  EMPLOYEE_POOL = 'EMPLOYEE_POOL',
  MANAGEMENT_COMPANY = 'MANAGEMENT_COMPANY'
}

export enum CommitmentStatus {
  ACTIVE = 'ACTIVE',
  TRANSFERRED = 'TRANSFERRED',
  DEFAULTED = 'DEFAULTED',
  CANCELLED = 'CANCELLED'
}

export enum CapitalCallPurpose {
  INVESTMENT = 'INVESTMENT',
  MANAGEMENT_FEE = 'MANAGEMENT_FEE',
  EXPENSES = 'EXPENSES',
  BRIDGING = 'BRIDGING'
}

export enum CapitalCallStatus {
  ISSUED = 'ISSUED',
  ACKNOWLEDGED = 'ACKNOWLEDGED',
  FUNDED = 'FUNDED',
  OVERDUE = 'OVERDUE',
  CANCELLED = 'CANCELLED'
}

export enum AllocationResponseStatus {
  PENDING = 'PENDING',
  ACKNOWLEDGED = 'ACKNOWLEDGED',
  FUNDED = 'FUNDED',
  DEFAULTED = 'DEFAULTED'
}

export enum DistributionSourceType {
  REALIZATION = 'REALIZATION',
  DIVIDEND = 'DIVIDEND',
  RECALLABLE = 'RECALLABLE',
  OTHER = 'OTHER'
}

export enum DistributionStatus {
  DECLARED = 'DECLARED',
  PROCESSING = 'PROCESSING',
  PAID = 'PAID',
  COMPLETED = 'COMPLETED'
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  HELD = 'HELD'
}

export enum InvestmentSecurityType {
  EQUITY = 'EQUITY',
  DEBT = 'DEBT',
  CONVERTIBLE = 'CONVERTIBLE',
  WARRANT = 'WARRANT',
  PREFERRED = 'PREFERRED',
  COMMON = 'COMMON'
}

export enum InvestmentStatus {
  ACTIVE = 'ACTIVE',
  PARTIAL_EXIT = 'PARTIAL_EXIT',
  FULLY_EXITED = 'FULLY_EXITED',
  WRITTEN_OFF = 'WRITTEN_OFF'
}

export enum ExpenseCategory {
  MANAGEMENT_FEE = 'MANAGEMENT_FEE',
  LEGAL = 'LEGAL',
  AUDIT = 'AUDIT',
  ADMIN = 'ADMIN',
  TRAVEL = 'TRAVEL',
  CONSULTANT = 'CONSULTANT',
  DUE_DILIGENCE = 'DUE_DILIGENCE',
  REGULATORY = 'REGULATORY'
}

export enum ExpenseType {
  FUND_EXPENSE = 'FUND_EXPENSE',
  DEAL_EXPENSE = 'DEAL_EXPENSE',
  ORGANIZATIONAL = 'ORGANIZATIONAL'
}

export enum ExpenseStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  PAID = 'PAID',
  REJECTED = 'REJECTED'
}

export enum AllocationType {
  PRO_RATA = 'PRO_RATA',
  SPECIFIC = 'SPECIFIC',
  DEAL_RELATED = 'DEAL_RELATED'
}

export enum NAVReportType {
  MONTHLY = 'MONTHLY',
  QUARTERLY = 'QUARTERLY',
  ANNUAL = 'ANNUAL',
  INTERIM = 'INTERIM'
}

export enum NAVReportStatus {
  DRAFT = 'DRAFT',
  UNDER_REVIEW = 'UNDER_REVIEW',
  APPROVED = 'APPROVED',
  PUBLISHED = 'PUBLISHED'
}

export enum FundUpdateType {
  QUARTERLY = 'QUARTERLY',
  ANNUAL = 'ANNUAL',
  MONTHLY = 'MONTHLY',
  SPECIAL = 'SPECIAL'
}

export enum TaxReportingStatus {
  PENDING = 'PENDING',
  REPORTED = 'REPORTED',
  COMPLETED = 'COMPLETED'
}

// Main Fund Interface
export interface Fund {
  id: string;
  name: string;
  fundNumber: string;
  fundType: FundType;
  strategy: string;
  
  // Fund Structure
  targetSize: number;
  hardCap?: number;
  minimumSize?: number;
  managementFee: number;
  carriedInterest: number;
  hurdleRate?: number;
  
  // Fund Status and Timeline
  status: FundStatus;
  vintage: number;
  fundLife: number;
  investmentPeriod: number;
  
  // Fundraising Progress
  totalCommitments: number;
  totalCalled: number;
  totalInvested: number;
  totalDistributed: number;
  currentNAV: number;
  
  // Key Dates
  firstCloseDate?: Date;
  finalCloseDate?: Date;
  investmentPeriodEnd?: Date;
  fundMaturityDate?: Date;
  
  // Performance Metrics
  grossIRR?: number;
  netIRR?: number;
  grossMOIC?: number;
  netMOIC?: number;
  dpi?: number;
  rvpi?: number;
  tvpi?: number;
  
  // Fund Economics
  totalManagementFees: number;
  totalCarriedInterest: number;
  totalExpenses: number;
  
  // Regulatory and Compliance
  domicile?: string;
  regulatoryStatus?: string;
  auditFirm?: string;
  administrator?: string;
  
  // Metadata
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  
  // Relationships
  commitments?: FundCommitment[];
  capitalCalls?: FundCapitalCall[];
  distributions?: FundDistribution[];
  investments?: FundInvestment[];
  expenses?: FundExpense[];
  navReports?: NAVReport[];
  fundUpdates?: FundUpdate[];
}

// Fund Commitment Interface
export interface FundCommitment {
  id: string;
  fundId: string;
  
  // Investor Information
  investorName: string;
  investorType: InvestorType;
  investorId?: string;
  
  // Commitment Details
  commitmentAmount: number;
  currency: string;
  commitmentDate: Date;
  
  // Commitment Terms
  managementFeeRate?: number;
  carriedInterestRate?: number;
  preferredReturn?: number;
  
  // Status and Progress
  status: CommitmentStatus;
  calledAmount: number;
  distributedAmount: number;
  currentNAV: number;
  
  // Special Terms
  sideLetterTerms?: SideLetterTerms;
  keyPersonClause: boolean;
  noFaultClause: boolean;
  mostFavoredNation: boolean;
  
  // Transfer History
  originalCommitment?: number;
  transferHistory?: TransferRecord[];
  
  createdAt: Date;
  updatedAt: Date;
  
  // Relationships
  fund?: Fund;
  capitalCallAllocations?: FundCapitalCallAllocation[];
  distributionAllocations?: FundDistributionAllocation[];
}

// Fund Capital Call Interface
export interface FundCapitalCall {
  id: string;
  fundId: string;
  
  // Call Details
  callNumber: number;
  callDate: Date;
  dueDate: Date;
  totalCallAmount: number;
  currency: string;
  
  // Call Purpose
  purpose: CapitalCallPurpose;
  description?: string;
  
  // Investment Details
  targetInvestment?: string;
  investmentAmount?: number;
  managementFeeAmount?: number;
  expenseAmount?: number;
  
  // Status and Processing
  status: CapitalCallStatus;
  issuedDate: Date;
  acknowledgmentDeadline?: Date;
  
  // Payment Information
  paymentInstructions?: PaymentInstructions;
  fundingAccount?: string;
  
  // Collections
  totalAcknowledged: number;
  totalFunded: number;
  totalOutstanding: number;
  
  // Hybrid Features
  aiRiskScore?: number;
  automatedReminders: boolean;
  
  createdAt: Date;
  updatedAt: Date;
  
  // Relationships
  fund?: Fund;
  allocations?: FundCapitalCallAllocation[];
}

// Fund Capital Call Allocation Interface
export interface FundCapitalCallAllocation {
  id: string;
  capitalCallId: string;
  commitmentId: string;
  
  // Allocation Details
  allocationAmount: number;
  currency: string;
  allocationPercentage: number;
  
  // Response Tracking
  responseStatus: AllocationResponseStatus;
  responseDate?: Date;
  fundedDate?: Date;
  fundedAmount?: number;
  
  // Payment Details
  paymentReference?: string;
  paymentMethod?: string;
  
  createdAt: Date;
  updatedAt: Date;
  
  // Relationships
  capitalCall?: FundCapitalCall;
  commitment?: FundCommitment;
}

// Fund Distribution Interface
export interface FundDistribution {
  id: string;
  fundId: string;
  
  // Distribution Details
  distributionNumber: number;
  distributionDate: Date;
  totalDistributionAmount: number;
  currency: string;
  
  // Distribution Source
  sourceType: DistributionSourceType;
  sourceDescription?: string;
  sourceInvestments?: SourceInvestment[];
  
  // Distribution Breakdown
  returnOfCapital: number;
  capitalGains: number;
  dividendIncome: number;
  interestIncome: number;
  carriedInterest: number;
  
  // Tax Information
  totalTaxableAmount: number;
  witholdingTax: number;
  taxReportingStatus: TaxReportingStatus;
  
  // Status and Processing
  status: DistributionStatus;
  paymentDate?: Date;
  recordDate: Date;
  
  // Payment Information
  paymentInstructions?: PaymentInstructions;
  
  createdAt: Date;
  updatedAt: Date;
  
  // Relationships
  fund?: Fund;
  allocations?: FundDistributionAllocation[];
}

// Fund Distribution Allocation Interface
export interface FundDistributionAllocation {
  id: string;
  distributionId: string;
  commitmentId: string;
  
  // Allocation Details
  allocationAmount: number;
  currency: string;
  allocationPercentage: number;
  
  // Distribution Breakdown
  returnOfCapital: number;
  capitalGains: number;
  dividendIncome: number;
  interestIncome: number;
  
  // Tax Information
  taxableAmount: number;
  witholdingTax: number;
  
  // Payment Status
  paymentStatus: PaymentStatus;
  paymentDate?: Date;
  paymentReference?: string;
  
  createdAt: Date;
  updatedAt: Date;
  
  // Relationships
  distribution?: FundDistribution;
  commitment?: FundCommitment;
}

// Fund Investment Interface
export interface FundInvestment {
  id: string;
  fundId: string;
  portfolioCompanyId?: string;
  
  // Investment Details
  investmentName: string;
  investmentDate: Date;
  totalInvestment: number;
  currency: string;
  
  // Investment Structure
  investmentType: InvestmentSecurityType;
  securityType?: string;
  ownershipPercentage?: number;
  liquidationPreference?: number;
  
  // Valuation and Performance
  initialCost: number;
  currentValue: number;
  unrealizedGain: number;
  realizedGain: number;
  
  // Investment Status
  status: InvestmentStatus;
  exitDate?: Date;
  exitValue?: number;
  exitMultiple?: number;
  
  // Performance Metrics
  irr?: number;
  moic?: number;
  
  // Investment Committee
  icApprovalDate?: Date;
  icMeeting?: string;
  
  createdAt: Date;
  updatedAt: Date;
  
  // Relationships
  fund?: Fund;
  portfolioCompany?: any; // Reference to PortfolioCompany
}

// Fund Expense Interface
export interface FundExpense {
  id: string;
  fundId: string;
  
  // Expense Details
  expenseDate: Date;
  description: string;
  amount: number;
  currency: string;
  
  // Expense Categories
  category: ExpenseCategory;
  subcategory?: string;
  expenseType: ExpenseType;
  
  // Vendor Information
  vendorName?: string;
  vendorType?: string;
  invoiceNumber?: string;
  invoiceDate?: Date;
  
  // Approval and Processing
  status: ExpenseStatus;
  approvedBy?: string;
  approvedDate?: Date;
  paidDate?: Date;
  
  // Allocation
  allocationType: AllocationType;
  allocationNotes?: string;
  
  // Supporting Documentation
  supportingDocuments?: DocumentReference[];
  receiptAttached: boolean;
  
  // Budget Tracking
  budgetCategory?: string;
  budgetYear?: number;
  budgetVariance?: number;
  
  createdAt: Date;
  updatedAt: Date;
  
  // Relationships
  fund?: Fund;
}

// NAV Report Interface
export interface NAVReport {
  id: string;
  fundId: string;
  
  // Report Details
  reportDate: Date;
  reportPeriod: string;
  reportType: NAVReportType;
  
  // NAV Calculation
  grossAssetValue: number;
  cashAndEquivalents: number;
  otherAssets: number;
  totalAssets: number;
  
  // Liabilities
  managementFees: number;
  carriedInterest: number;
  accruals: number;
  otherLiabilities: number;
  totalLiabilities: number;
  
  // Net Asset Value
  netAssetValue: number;
  navPerUnit?: number;
  
  // Performance Metrics
  periodReturn?: number;
  sinceInceptionReturn?: number;
  quarterlyReturn?: number;
  annualizedReturn?: number;
  
  // Benchmarking
  benchmarkComparison?: BenchmarkData[];
  peerComparison?: PeerComparison[];
  
  // Investment Breakdown
  investmentValuations?: InvestmentValuation[];
  sectorialBreakdown?: SectorialBreakdown[];
  geographicalBreakdown?: GeographicalBreakdown[];
  
  // Cash Flow Analysis
  capitalCalled: number;
  capitalDistributed: number;
  netCashFlow: number;
  
  // Valuation Methodology
  valuationDate: Date;
  valuationMethod?: ValuationMethod[];
  externalValuer?: string;
  
  // Status and Approval
  status: NAVReportStatus;
  preparedBy?: string;
  reviewedBy?: string;
  approvedBy?: string;
  approvedDate?: Date;
  publishedDate?: Date;
  
  // Audit Trail
  previousNAV?: number;
  navMovement?: NAVMovement[];
  
  createdAt: Date;
  updatedAt: Date;
  
  // Relationships
  fund?: Fund;
}

// Fund Update Interface
export interface FundUpdate {
  id: string;
  fundId: string;
  
  // Update Details
  updateDate: Date;
  updateType: FundUpdateType;
  updatePeriod: string;
  
  // Executive Summary
  executiveSummary?: string;
  keyHighlights?: string[];
  performanceOverview?: string;
  
  // Fund Performance
  fundPerformance?: FundPerformanceMetrics;
  portfolioPerformance?: PortfolioPerformanceData;
  newInvestments?: NewInvestmentData[];
  exits?: ExitData[];
  
  // Market Commentary
  marketOverview?: string;
  marketTrends?: MarketTrend[];
  sectorInsights?: SectorInsight[];
  
  // Fund Operations
  fundraisingUpdate?: FundraisingUpdate;
  operationalUpdates?: OperationalUpdate[];
  teamUpdates?: TeamUpdate[];
  
  // Financial Summary
  financialHighlights?: FinancialHighlight[];
  expenseSummary?: ExpenseSummary;
  cashflowSummary?: CashflowSummary;
  
  // ESG and Impact
  esgUpdates?: ESGUpdate[];
  impactMetrics?: ImpactMetric[];
  
  // Risk and Compliance
  riskAssessment?: RiskAssessmentSummary;
  complianceUpdates?: ComplianceUpdate[];
  
  // Outlook
  marketOutlook?: string;
  fundOutlook?: string;
  upcomingInitiatives?: Initiative[];
  
  // Distribution and Status
  status: NAVReportStatus;
  distributedDate?: Date;
  recipients?: UpdateRecipient[];
  
  // Attachments
  attachments?: DocumentReference[];
  presentations?: DocumentReference[];
  
  createdAt: Date;
  updatedAt: Date;
  
  // Relationships
  fund?: Fund;
}

// Supporting Interfaces and Types

export interface SideLetterTerms {
  provisions: string[];
  exemptions?: string[];
  specialRights?: string[];
  additionalTerms?: Record<string, any>;
}

export interface TransferRecord {
  date: Date;
  transferType: 'FULL' | 'PARTIAL';
  transferredAmount: number;
  transferee: string;
  reason: string;
}

export interface PaymentInstructions {
  bankName: string;
  accountName: string;
  accountNumber: string;
  routingNumber: string;
  swiftCode?: string;
  iban?: string;
  reference: string;
  additionalInstructions?: string;
}

export interface SourceInvestment {
  investmentId: string;
  investmentName: string;
  exitValue: number;
  exitType: 'IPO' | 'ACQUISITION' | 'SECONDARY_SALE' | 'DIVIDEND';
  exitDate: Date;
}

export interface DocumentReference {
  id: string;
  name: string;
  type: string;
  url: string;
  uploadDate: Date;
}

export interface BenchmarkData {
  benchmarkName: string;
  benchmarkValue: number;
  comparisonPeriod: string;
  outperformance: number;
}

export interface PeerComparison {
  peerGroup: string;
  peerAverage: number;
  percentile: number;
  ranking: number;
}

export interface InvestmentValuation {
  investmentId: string;
  investmentName: string;
  sector: string;
  currentValue: number;
  costBasis: number;
  unrealizedGain: number;
  valuationMethod: string;
  lastValuationDate: Date;
}

export interface SectorialBreakdown {
  sector: string;
  value: number;
  percentage: number;
  count: number;
}

export interface GeographicalBreakdown {
  region: string;
  value: number;
  percentage: number;
  count: number;
}

export interface ValuationMethod {
  method: string;
  description: string;
  applicableInvestments: string[];
}

export interface NAVMovement {
  component: string;
  previousValue: number;
  currentValue: number;
  movement: number;
  movementPercentage: number;
}

export interface FundPerformanceMetrics {
  netIRR: number;
  grossIRR: number;
  netMOIC: number;
  grossMOIC: number;
  dpi: number;
  rvpi: number;
  tvpi: number;
  periodReturn: number;
}

export interface PortfolioPerformanceData {
  totalValue: number;
  unrealizedGain: number;
  realizedGain: number;
  topPerformers: InvestmentPerformance[];
  underperformers: InvestmentPerformance[];
}

export interface InvestmentPerformance {
  investmentName: string;
  sector: string;
  irr: number;
  moic: number;
  currentValue: number;
}

export interface NewInvestmentData {
  investmentName: string;
  sector: string;
  investmentAmount: number;
  investmentDate: Date;
  description: string;
}

export interface ExitData {
  investmentName: string;
  sector: string;
  exitValue: number;
  exitDate: Date;
  exitType: string;
  exitMultiple: number;
  irr: number;
}

export interface MarketTrend {
  category: string;
  trend: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL';
  description: string;
  impact: 'LOW' | 'MEDIUM' | 'HIGH';
}

export interface SectorInsight {
  sector: string;
  outlook: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL';
  keyDrivers: string[];
  risks: string[];
  opportunities: string[];
}

export interface FundraisingUpdate {
  targetSize: number;
  commitedAmount: number;
  percentageRaised: number;
  newCommitments: CommitmentData[];
  timeline: FundraisingMilestone[];
}

export interface CommitmentData {
  investorName: string;
  commitmentAmount: number;
  commitmentDate: Date;
}

export interface FundraisingMilestone {
  milestone: string;
  targetDate: Date;
  status: 'COMPLETED' | 'IN_PROGRESS' | 'PENDING';
}

export interface OperationalUpdate {
  area: string;
  description: string;
  impact: string;
  timeline: string;
}

export interface TeamUpdate {
  type: 'HIRE' | 'PROMOTION' | 'DEPARTURE';
  name: string;
  role: string;
  date: Date;
  description: string;
}

export interface FinancialHighlight {
  metric: string;
  value: number;
  previousValue?: number;
  change?: number;
  changePercentage?: number;
}

export interface ExpenseSummary {
  totalExpenses: number;
  budgetVariance: number;
  majorCategories: ExpenseCategory[];
  expenseBreakdown: ExpenseBreakdownItem[];
}

export interface ExpenseBreakdownItem {
  category: string;
  amount: number;
  percentage: number;
}

export interface CashflowSummary {
  openingCash: number;
  capitalCalled: number;
  capitalDeployed: number;
  distributionsPaid: number;
  expenses: number;
  closingCash: number;
}

export interface ESGUpdate {
  area: 'ENVIRONMENTAL' | 'SOCIAL' | 'GOVERNANCE';
  initiative: string;
  progress: string;
  impact: string;
}

export interface ImpactMetric {
  metric: string;
  value: number;
  unit: string;
  previousValue?: number;
  trend: 'UP' | 'DOWN' | 'STABLE';
}

export interface RiskAssessmentSummary {
  overallRiskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  keyRisks: string[];
  mitigationActions: string[];
  newRisks: string[];
}

export interface ComplianceUpdate {
  area: string;
  status: 'COMPLIANT' | 'NON_COMPLIANT' | 'UNDER_REVIEW';
  description: string;
  actionRequired?: string;
}

export interface Initiative {
  name: string;
  description: string;
  timeline: string;
  owner: string;
  status: 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED';
}

export interface UpdateRecipient {
  type: 'LP' | 'ADVISORY_BOARD' | 'INTERNAL';
  name: string;
  email: string;
  deliveryMethod: 'EMAIL' | 'PORTAL' | 'BOTH';
}

// Hybrid Mode Specific Types
export interface TraditionalFundView {
  showDetailedFinancials: boolean;
  showAllTransactions: boolean;
  groupBy: 'DATE' | 'TYPE' | 'INVESTOR' | 'STATUS';
  sortBy: string;
  filterCriteria: FundFilterCriteria;
}

export interface AssistedFundView {
  aiRecommendations: FundRecommendation[];
  smartInsights: FundInsight[];
  automationSuggestions: FundAutomationSuggestion[];
  complianceAlerts: ComplianceAlert[];
}

export interface AutonomousFundView {
  priorityActions: FundPriorityAction[];
  decisionQueue: FundDecision[];
  automatedProcesses: AutomatedProcess[];
  performanceAlerts: FundPerformanceAlert[];
}

export interface FundRecommendation {
  type: 'CAPITAL_CALL' | 'DISTRIBUTION' | 'EXPENSE_OPTIMIZATION' | 'COMPLIANCE';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  title: string;
  description: string;
  rationale: string;
  expectedImpact: string;
  confidence: number;
  actions: string[];
  timeline: string;
}

export interface FundInsight {
  category: 'PERFORMANCE' | 'CASH_FLOW' | 'COMPLIANCE' | 'OPERATIONAL';
  title: string;
  description: string;
  relevantFunds: string[];
  trendDirection: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL';
  significance: 'LOW' | 'MEDIUM' | 'HIGH';
  actionable: boolean;
}

export interface FundFilterCriteria {
  fundTypes?: FundType[];
  statuses?: FundStatus[];
  vintageYears?: number[];
  performanceRange?: {
    minIRR?: number;
    maxIRR?: number;
    minMOIC?: number;
    maxMOIC?: number;
  };
}