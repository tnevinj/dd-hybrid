export enum DealStructureType {
  SINGLE_ASSET_CONTINUATION = 'single_asset_continuation',
  MULTI_ASSET_CONTINUATION = 'multi_asset_continuation', 
  TENDER_OFFER = 'tender_offer',
  FEEDER_FUND = 'feeder_fund',
  PREFERRED_EQUITY = 'preferred_equity',
  REVENUE_PARTICIPATION = 'revenue_participation',
  LBO_STRUCTURE = 'lbo_structure',
  SYNTHETIC_SECONDARY = 'synthetic_secondary'
}

export enum DealStage {
  SCREENING = 'screening',
  STRUCTURING = 'structuring', 
  DUE_DILIGENCE = 'due_diligence',
  INVESTMENT_COMMITTEE = 'investment_committee',
  EXECUTION = 'execution',
  COMPLETED = 'completed'
}

export enum ValuationMethod {
  DCF = 'dcf',
  LBO = 'lbo',
  COMPARABLE_COMPANY = 'comparable_company',
  PRECEDENT_TRANSACTION = 'precedent_transaction',
  SUM_OF_PARTS = 'sum_of_parts',
  NAV_BASED = 'nav_based'
}

export interface DealStructuringProject {
  id: string;
  name: string;
  type: DealStructureType;
  stage: DealStage;
  targetValue: number;
  currentValuation?: number;
  progress: number;
  team: TeamMember[];
  lastUpdated: Date;
  keyMetrics: DealKeyMetrics;
  riskLevel: 'low' | 'medium' | 'high';
  nextMilestone?: string;
  aiRecommendations?: AIRecommendation[];
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  email?: string;
}

export interface DealKeyMetrics {
  irr?: number;
  multiple?: number;
  paybackPeriod?: number;
  npv?: number;
  leverage?: number;
  equityContribution?: number;
  debtAmount?: number;
}

export interface AIRecommendation {
  id: string;
  type: 'suggestion' | 'automation' | 'insight' | 'warning';
  priority: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  actions: RecommendedAction[];
  confidence: number;
  reasoning?: string;
}

export interface RecommendedAction {
  label: string;
  action: string;
  params?: Record<string, any>;
}

export interface DCFInputs {
  projectionYears: number;
  terminalGrowthRate: number;
  discountRate: number;
  terminalValueMethod: 'perpetuity' | 'multiple';
  exitMultiple: number;
  taxRate: number;
  cashFlows: DCFCashFlow[];
  costOfEquity: number;
  costOfDebt: number;
  marketValueEquity: number;
  marketValueDebt: number;
}

export interface DCFCashFlow {
  year: number;
  revenue: number;
  ebitda: number;
  capex: number;
  workingCapital: number;
}

export interface DCFResults {
  enterpriseValue: number;
  equityValue: number;
  npv: number;
  irr: number;
  pvOfProjections: number;
  pvOfTerminalValue: number;
  terminalValue: number;
  wacc: number;
}

export interface LBOInputs {
  purchasePrice: number;
  debtFunding: DebtStructure[];
  equityFunding: number;
  managementRollover?: number;
  transactionFees: number;
  projectionYears: number;
  exitMultiple: number;
  exitYear: number;
  taxRate: number;
}

export interface DebtStructure {
  id: string;
  type: 'senior_debt' | 'subordinated_debt' | 'mezzanine' | 'bridge';
  amount: number;
  interestRate: number;
  term: number;
  amortizationSchedule: 'none' | 'straight_line' | 'cash_sweep';
}

export interface LBOResults {
  equityIRR: number;
  equityMultiple: number;
  cashOnCashReturn: number;
  totalReturn: number;
  peakLeverage: number;
  avgLeverage: number;
  exitEquityValue: number;
  totalEquityInvested: number;
}

export interface WaterfallInputs {
  participants: WaterfallParticipant[];
  tiers: WaterfallTier[];
  distributionAmount: number;
  totalCommittedCapital: number;
  totalContributions: number;
}

export interface WaterfallParticipant {
  id: string;
  name: string;
  type: 'LP' | 'GP' | 'Management';
  ownershipPercentage: number;
}

export interface WaterfallTier {
  id: string;
  name: string;
  order: number;
  type: 'return_of_capital' | 'preferred_return' | 'catch_up' | 'carry_split';
  threshold?: number;
  percentage: number;
}

export interface WaterfallResults {
  totalDistributed: number;
  remainingAmount: number;
  participantSummary: ParticipantSummary[];
  performanceMetrics: PerformanceMetrics;
}

export interface ParticipantSummary {
  participantId: string;
  participantName: string;
  totalAllocation: number;
  returnOfCapital: number;
  preferredReturn: number;
  carryAllocation: number;
  effectiveReturn: number;
}

export interface PerformanceMetrics {
  totalReturnMultiple: number;
  lpIRR: number;
  gpCarryEarned: number;
  preferredReturnCoverage: number;
}

export interface DealStructuringActivity {
  id: string;
  title: string;
  deal: string;
  type: 'financial' | 'legal' | 'strategic' | 'operational';
  status: 'completed' | 'in_progress' | 'pending';
  date: Date;
  user: string;
}

export interface DealStructuringDeadline {
  id: string;
  title: string;
  dueDate: Date;
  deal: string;
  priority: 'high' | 'medium' | 'low';
}

export interface DealStructuringMetrics {
  activeDeals: number;
  totalValue: number;
  averageProgress: number;
  upcomingDeadlines: number;
  completedThisMonth: number;
  pendingApprovals: number;
}