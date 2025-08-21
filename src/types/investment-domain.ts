// Investment-specific domain types that extend shared-domain

import {
  BaseDeal,
  BaseEntity,
  TimestampedEntity,
  StatusEntity,
  FinancialMetrics,
  PerformanceMetrics,
  ESGMetrics,
  TeamMember,
  Document,
  Milestone,
  Note,
  Priority,
  RiskLevel,
  InvestmentStage,
  AssetType,
  Sector,
  Geography
} from './shared-domain';

// Deal Screening Domain
export interface DealOpportunity extends BaseDeal {
  source: 'referral' | 'proprietary' | 'broker' | 'marketplace' | 'other';
  sourceDetails?: string;
  contactPerson?: string;
  contactInfo?: string;
  
  // Preliminary metrics
  askPrice: number;
  navPercentage: number; // Price as percentage of NAV
  expectedReturn: number;
  expectedIRR: number;
  expectedMultiple: number;
  
  // Screening status
  screeningStatus: 'not-started' | 'in-progress' | 'completed' | 'passed' | 'rejected';
  screeningScore?: number; // 0-100
  passedCriteria?: string[];
  failedCriteria?: string[];
  screeningNotes?: string;
  
  // AI enhancement
  aiScore?: number;
  aiConfidence?: number;
  aiInsights?: string[];
  similarDeals?: string[]; // IDs of similar deals in portfolio
  
  lastContactDate?: Date;
  nextFollowUp?: Date;
}

export interface ScreeningCriterion {
  id: string;
  name: string;
  category: 'financial' | 'operational' | 'strategic' | 'impact' | 'risk' | 'esg';
  description: string;
  weight: number; // 0-1
  scoreFunction: 'linear' | 'exponential' | 'threshold' | 'custom';
  minValue: number;
  maxValue: number;
  thresholdValue?: number;
  isRequired: boolean;
  isActive: boolean;
}

export interface ScreeningTemplate {
  id: string;
  name: string;
  description: string;
  assetTypes: AssetType[];
  sectors?: Sector[];
  criteria: ScreeningCriterion[];
  aiEnhanced: boolean;
  isDefault: boolean;
  createdBy: string;
  createdAt: Date;
  lastUsed?: Date;
  usageCount: number;
  successRate: number;
}

// Due Diligence Domain
export interface DueDiligenceProject extends BaseDeal {
  phase: 'initial' | 'commercial' | 'financial' | 'legal' | 'operational' | 'final' | 'completed';
  
  // DD Structure
  workstreams: DDWorkstream[];
  checklist: DDChecklistItem[];
  findings: DDFinding[];
  recommendations: DDRecommendation[];
  
  // Timeline
  kickoffDate: Date;
  targetCompletionDate: Date;
  actualCompletionDate?: Date;
  
  // Investment Committee
  icDate?: Date;
  icMemo?: Document;
  icDecision?: 'approved' | 'rejected' | 'conditional' | 'deferred';
  icConditions?: string[];
  
  // Data Room
  dataRoomUrl?: string;
  dataRoomAccess: DataRoomAccess[];
  
  // External advisors
  advisors: ExternalAdvisor[];
  
  // Progress tracking
  overallProgress: number; // 0-100
  workstreamProgress: Record<string, number>;
  
  // Risk assessment
  riskMatrix: RiskItem[];
  mitigationPlan?: Document;
}

export interface DDWorkstream {
  id: string;
  name: string;
  type: 'commercial' | 'financial' | 'legal' | 'operational' | 'technology' | 'esg' | 'tax' | 'insurance';
  lead: string;
  team: TeamMember[];
  status: 'not-started' | 'in-progress' | 'review' | 'completed';
  progress: number; // 0-100
  startDate: Date;
  targetDate: Date;
  completionDate?: Date;
  budget?: number;
  actualCost?: number;
  deliverables: DDDeliverable[];
}

export interface DDChecklistItem {
  id: string;
  workstreamId: string;
  item: string;
  description?: string;
  priority: Priority;
  status: 'pending' | 'in-progress' | 'completed' | 'not-applicable';
  assignee: string;
  dueDate?: Date;
  completedDate?: Date;
  notes?: string;
  documents?: Document[];
  dependencies?: string[];
}

export interface DDFinding {
  id: string;
  workstreamId: string;
  title: string;
  description: string;
  category: 'red-flag' | 'concern' | 'observation' | 'opportunity';
  riskLevel: RiskLevel;
  impact: 'high' | 'medium' | 'low';
  likelihood: 'high' | 'medium' | 'low';
  discoveredBy: string;
  discoveredDate: Date;
  status: 'open' | 'investigating' | 'mitigated' | 'accepted' | 'resolved';
  mitigationPlan?: string;
  mitigationOwner?: string;
  followUpRequired: boolean;
  followUpDate?: Date;
  relatedFindings?: string[];
  supportingDocuments?: Document[];
  notes: Note[];
}

export interface DDRecommendation {
  id: string;
  title: string;
  description: string;
  type: 'proceed' | 'proceed-with-conditions' | 'pass' | 'further-investigation';
  rationale: string;
  conditions?: string[];
  author: string;
  createdDate: Date;
  supportingFindings: string[];
  impactOnValuation?: number;
  confidenceLevel: 'high' | 'medium' | 'low';
}

export interface DDDeliverable {
  id: string;
  name: string;
  type: 'report' | 'memo' | 'presentation' | 'model' | 'checklist' | 'other';
  status: 'draft' | 'review' | 'final';
  author: string;
  reviewers?: string[];
  dueDate: Date;
  deliveredDate?: Date;
  document?: Document;
}

export interface DataRoomAccess {
  userId: string;
  userName: string;
  role: 'admin' | 'contributor' | 'viewer';
  grantedDate: Date;
  expiryDate?: Date;
  isActive: boolean;
  permissions: string[];
}

export interface ExternalAdvisor {
  id: string;
  name: string;
  firm: string;
  type: 'legal' | 'financial' | 'technical' | 'commercial' | 'other';
  contactInfo: string;
  workstreams: string[];
  engagementLetter?: Document;
  budget?: number;
  actualCost?: number;
  performance?: 'excellent' | 'good' | 'satisfactory' | 'poor';
}

export interface RiskItem {
  id: string;
  category: 'market' | 'operational' | 'financial' | 'legal' | 'regulatory' | 'technology' | 'esg' | 'team';
  risk: string;
  description: string;
  probability: 'low' | 'medium' | 'high';
  impact: 'low' | 'medium' | 'high';
  riskScore: number; // calculated from probability x impact
  currentMitigation?: string;
  proposedMitigation?: string;
  mitigationOwner?: string;
  status: 'identified' | 'assessing' | 'mitigating' | 'monitoring' | 'closed';
  residualRisk?: 'low' | 'medium' | 'high';
  lastReviewDate?: Date;
  nextReviewDate?: Date;
}

// Portfolio Management Domain
export interface PortfolioCompany extends BaseEntity, StatusEntity, TimestampedEntity {
  // Basic information
  legalName: string;
  sector: Sector;
  subsector?: string;
  geography: Geography;
  website?: string;
  
  // Investment details
  investmentDate: Date;
  exitDate?: Date;
  initialInvestment: number;
  totalInvestment: number;
  currentValuation: number;
  exitValuation?: number;
  investmentStage: InvestmentStage;
  investmentType: 'primary' | 'secondary' | 'co-investment';
  
  // Ownership
  ownershipPercentage: number;
  boardSeats: number;
  boardObserverRights: boolean;
  
  // Performance
  performance: PerformanceMetrics;
  esgMetrics: ESGMetrics;
  
  // Operational
  ceo?: string;
  cfo?: string;
  keyPersonnel: TeamMember[];
  employeeCount?: number;
  customerCount?: number;
  
  // Reporting
  reportingFrequency: 'monthly' | 'quarterly' | 'annually';
  lastReportDate?: Date;
  nextReportDate?: Date;
  reportingQuality: 'excellent' | 'good' | 'fair' | 'poor';
  
  // Monitoring
  riskRating: RiskLevel;
  watchListStatus?: 'normal' | 'watch' | 'concern' | 'critical';
  lastBoardMeeting?: Date;
  nextBoardMeeting?: Date;
  
  // Value creation
  valueCreationPlan?: Document;
  valueCreationInitiatives: ValueCreationInitiative[];
  
  // Exit planning
  exitStrategy?: 'ipo' | 'strategic-sale' | 'secondary-sale' | 'management-buyout' | 'other';
  exitTimeline?: string;
  exitPreparation?: ExitPreparation;
}

export interface ValueCreationInitiative {
  id: string;
  name: string;
  category: 'revenue-growth' | 'cost-reduction' | 'operational-improvement' | 'digital-transformation' | 'esg' | 'other';
  description: string;
  owner: string;
  status: 'planned' | 'in-progress' | 'completed' | 'on-hold' | 'cancelled';
  startDate: Date;
  targetDate: Date;
  completionDate?: Date;
  expectedImpact: number; // monetary value
  actualImpact?: number;
  investmentRequired?: number;
  kpis: string[];
  milestones: Milestone[];
  risks: string[];
}

export interface ExitPreparation {
  phase: 'not-started' | 'planning' | 'preparation' | 'execution' | 'completed';
  targetExitDate?: Date;
  preparationTasks: ExitTask[];
  advisors: ExternalAdvisor[];
  potentialBuyers?: string[];
  valuationRange?: { min: number; max: number };
  keySellingPoints: string[];
  areasForImprovement: string[];
}

export interface ExitTask {
  id: string;
  task: string;
  category: 'financial' | 'legal' | 'operational' | 'marketing' | 'strategic';
  priority: Priority;
  status: 'not-started' | 'in-progress' | 'completed';
  assignee: string;
  dueDate: Date;
  completionDate?: Date;
  dependencies?: string[];
  notes?: string;
}

// Fund Operations Domain
export interface Fund extends BaseEntity, TimestampedEntity {
  fundNumber: number;
  fundType: 'growth-equity' | 'buyout' | 'venture' | 'credit' | 'infrastructure' | 'real-estate';
  vintage: number;
  
  // Fund structure
  targetSize: number;
  commitmentSize: number;
  finalClose?: Date;
  fundTerm: number; // years
  investmentPeriod: number; // years
  
  // Economics
  managementFee: number; // percentage
  carriedInterest: number; // percentage
  hurdle?: number; // percentage
  catchup?: number; // percentage
  
  // Status
  fundStatus: 'fundraising' | 'investing' | 'harvesting' | 'liquidating' | 'liquidated';
  
  // Commitments
  commitments: LPCommitment[];
  
  // Investments
  investments: FundInvestment[];
  
  // Financials
  totalCommitted: number;
  totalCalled: number;
  totalInvested: number;
  totalDistributed: number;
  nav: number;
  
  // Performance
  performance: FinancialMetrics;
  
  // Reporting
  lastReportDate?: Date;
  nextReportDate?: Date;
  reportingSchedule: ReportingSchedule[];
}

export interface LPCommitment {
  id: string;
  investorId: string;
  investorName: string;
  investorType: 'pension-fund' | 'endowment' | 'insurance' | 'sovereign-wealth' | 'family-office' | 'fund-of-funds' | 'corporate' | 'individual';
  commitmentAmount: number;
  commitmentDate: Date;
  status: 'active' | 'transferred' | 'defaulted' | 'cancelled';
  
  // Calls and distributions
  totalCalled: number;
  totalDistributed: number;
  outstandingCommitment: number;
  
  // Performance
  dpi: number;
  rvpi: number;
  tvpi: number;
}

export interface FundInvestment {
  id: string;
  companyId: string;
  companyName: string;
  investmentDate: Date;
  exitDate?: Date;
  originalCost: number;
  totalInvested: number;
  currentValue: number;
  realizedValue?: number;
  
  // Performance
  performance: FinancialMetrics;
  
  // Status
  status: 'active' | 'partially-exited' | 'fully-exited' | 'written-off';
  
  // Ownership
  ownershipPercentage: number;
  fullyDilutedShares?: number;
}

export interface ReportingSchedule {
  id: string;
  reportType: 'quarterly' | 'annual' | 'capital-call' | 'distribution' | 'special';
  frequency: string;
  dueDate: Date;
  recipients: string[];
  template?: Document;
  lastSent?: Date;
  status: 'scheduled' | 'in-preparation' | 'sent' | 'overdue';
}

// Investment Committee Domain
export interface ICMeeting extends BaseEntity, TimestampedEntity {
  meetingDate: Date;
  meetingType: 'regular' | 'special' | 'emergency';
  location?: string;
  isVirtual: boolean;
  
  // Attendees
  chairperson: string;
  members: ICMember[];
  observers?: string[];
  
  // Agenda
  agenda: ICAgendaItem[];
  
  // Decisions
  decisions: ICDecision[];
  
  // Documentation
  preRead?: Document[];
  minutes?: Document;
  recordingUrl?: string;
  
  // Status
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  
  // Follow-up
  actionItems: ICActionItem[];
  nextMeetingDate?: Date;
}

export interface ICMember {
  memberId: string;
  memberName: string;
  role: 'voting-member' | 'observer' | 'advisor';
  attendance: 'present' | 'absent' | 'remote';
  hasVotingRights: boolean;
  expertise?: string[];
}

export interface ICAgendaItem {
  id: string;
  order: number;
  title: string;
  type: 'investment-decision' | 'portfolio-update' | 'fund-matters' | 'operational' | 'strategic';
  presenter: string;
  timeAllotted: number; // minutes
  actualTime?: number;
  documents?: Document[];
  notes?: string;
}

export interface ICDecision {
  id: string;
  agendaItemId?: string;
  title: string;
  description: string;
  type: 'investment-approval' | 'exit-approval' | 'policy-change' | 'strategic-direction' | 'other';
  
  // Voting
  votingMethod: 'unanimous' | 'majority' | 'consensus';
  votes: ICVote[];
  outcome: 'approved' | 'rejected' | 'deferred' | 'conditional';
  
  // Conditions and follow-up
  conditions?: string[];
  followUpActions?: string[];
  
  // Financial impact
  financialImpact?: number;
  budgetImpact?: string;
  
  // Timing
  effectiveDate?: Date;
  reviewDate?: Date;
}

export interface ICVote {
  memberId: string;
  memberName: string;
  vote: 'approve' | 'reject' | 'abstain';
  comment?: string;
  conditions?: string[];
}

export interface ICActionItem {
  id: string;
  description: string;
  assignee: string;
  dueDate: Date;
  priority: Priority;
  status: 'open' | 'in-progress' | 'completed' | 'overdue';
  completionDate?: Date;
  notes?: string;
  followUpRequired: boolean;
}

// Export all investment types in a namespace
export namespace Investment {
  export type {
    DealOpportunity,
    ScreeningCriterion,
    ScreeningTemplate,
    DueDiligenceProject,
    DDWorkstream,
    DDChecklistItem,
    DDFinding,
    DDRecommendation,
    DDDeliverable,
    DataRoomAccess,
    ExternalAdvisor,
    RiskItem,
    PortfolioCompany,
    ValueCreationInitiative,
    ExitPreparation,
    ExitTask,
    Fund,
    LPCommitment,
    FundInvestment,
    ReportingSchedule,
    ICMeeting,
    ICMember,
    ICAgendaItem,
    ICDecision,
    ICVote,
    ICActionItem
  };
}