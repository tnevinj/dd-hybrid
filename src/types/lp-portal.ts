// LP Portal Type Definitions
// Comprehensive types for LP dashboards, capital calls, distributions, and co-investments

export interface LPEntity {
  id: string;
  name: string;
  entityType: LPEntityType;
  jurisdiction?: string;
  aum?: number; // Assets under management
  
  // Contact Information
  primaryContactName: string;
  primaryContactEmail: string;
  primaryContactPhone?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  
  // Investment Profile
  investmentPolicy?: Record<string, any>;
  riskProfile?: RiskProfile;
  targetAllocation?: Record<string, number>;
  minInvestmentSize?: number;
  maxInvestmentSize?: number;
  preferredSectors?: string[];
  geographicPreferences?: string[];
  
  // Status and Verification
  onboardingStatus: OnboardingStatus;
  verificationStatus: VerificationStatus;
  kycStatus: KYCStatus;
  accreditationStatus: AccreditationStatus;
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
  
  // Relationships
  commitments?: LPCommitment[];
  capitalCalls?: LPCapitalCall[];
  distributions?: LPDistribution[];
  communications?: LPCommunication[];
  documents?: LPDocument[];
  coInvestments?: LPCoInvestment[];
  elections?: LPElection[];
}

export interface LPCommitment {
  id: string;
  lpEntityId: string;
  fundName: string;
  fundId?: string;
  
  // Commitment Details
  commitmentAmount: number;
  currency: string;
  commitmentDate: Date;
  vintage?: number; // Fund vintage year
  
  // Investment Terms
  managementFee?: number; // Annual management fee percentage
  carriedInterest?: number; // Carried interest percentage
  hurdle?: number; // Hurdle rate percentage
  catchUp?: number; // Catch-up percentage
  
  // Status and Progress
  status: CommitmentStatus;
  calledAmount: number;
  distributedAmount: number;
  currentNAV: number;
  
  // Performance Metrics
  irr?: number; // Internal rate of return
  moic?: number; // Multiple of invested capital
  dpi?: number; // Distributions to paid-in capital
  rvpi?: number; // Residual value to paid-in capital
  tvpi?: number; // Total value to paid-in capital
  
  // Dates
  firstCallDate?: Date;
  lastCallDate?: Date;
  lastDistributionDate?: Date;
  expectedFinalDate?: Date;
  
  createdAt: Date;
  updatedAt: Date;
  
  // Relationships
  lpEntity?: LPEntity;
  capitalCalls?: LPCapitalCall[];
  distributions?: LPDistribution[];
}

export interface LPCapitalCall {
  id: string;
  lpEntityId: string;
  commitmentId: string;
  
  // Call Details
  callNumber: number;
  callAmount: number;
  currency: string;
  dueDate: Date;
  purpose?: string; // Purpose of the capital call
  
  // Status and Response
  status: CapitalCallStatus;
  responseStatus?: string; // LP response status
  responseDate?: Date;
  fundingDate?: Date;
  actualAmount?: number; // Amount actually funded
  
  // Payment Information
  paymentInstructions?: PaymentInstructions;
  reference?: string; // Payment reference/memo
  
  // Hybrid Features
  autoAcknowledgment: boolean;
  aiRiskAssessment?: AIRiskAssessment;
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  issuedAt: Date;
  
  // Relationships
  lpEntity?: LPEntity;
  commitment?: LPCommitment;
}

export interface LPDistribution {
  id: string;
  lpEntityId: string;
  commitmentId: string;
  
  // Distribution Details
  distributionNumber: number;
  distributionAmount: number;
  currency: string;
  distributionDate: Date;
  distributionType: DistributionType;
  
  // Source Information
  sourceDescription?: string; // Description of distribution source
  sourceInvestments?: SourceInvestment[];
  
  // Tax Information
  taxableAmount?: number;
  taxWithheld?: number;
  taxDocuments?: TaxDocument[];
  
  // Performance Context
  portfolioValue?: number; // Portfolio value at time of distribution
  performanceMetrics?: PerformanceMetrics;
  
  // Payment Status
  status: DistributionStatus;
  paymentDate?: Date;
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  
  // Relationships
  lpEntity?: LPEntity;
  commitment?: LPCommitment;
}

export interface LPCoInvestment {
  id: string;
  lpEntityId: string;
  
  // Opportunity Details
  opportunityName: string;
  targetCompany: string;
  description?: string;
  sector?: string;
  geography?: string;
  
  // Investment Terms
  minimumInvestment: number;
  maximumInvestment: number;
  targetInvestment?: number;
  currency: string;
  
  // Timeline
  offerDate: Date;
  responseDeadline: Date;
  expectedClosingDate?: Date;
  
  // Status
  status: CoInvestmentStatus;
  responseDate?: Date;
  investmentAmount?: number; // Actual investment amount
  
  // Due Diligence
  dueDiligencePackage?: DDPackage[];
  riskFactors?: string[];
  
  // Performance (post-investment)
  currentValue?: number;
  performanceMetrics?: PerformanceMetrics;
  
  createdAt: Date;
  updatedAt: Date;
  
  // Relationships
  lpEntity?: LPEntity;
}

export interface LPElection {
  id: string;
  lpEntityId: string;
  
  // Election Details
  title: string;
  description: string;
  electionType: ElectionType;
  
  // Options
  options: ElectionOption[];
  allowMultipleSelect: boolean;
  
  // Timeline
  startDate: Date;
  endDate: Date;
  announcementDate: Date;
  
  // Participation
  eligibleCommitments?: string[];
  minimumCommitment?: number;
  votingPower?: VotingPower;
  
  // Status
  status: ElectionStatus;
  votingStatus?: string;
  selectedOptions?: string[];
  voteDate?: Date;
  
  // Results (after election closes)
  results?: ElectionResults;
  
  createdAt: Date;
  updatedAt: Date;
  
  // Relationships
  lpEntity?: LPEntity;
}

export interface LPDocument {
  id: string;
  lpEntityId: string;
  
  // Document Information
  name: string;
  description?: string;
  category: DocumentCategory;
  documentType?: string;
  
  // File Information
  fileName?: string;
  filePath?: string;
  fileSize?: number;
  mimeType?: string;
  
  // Access Control
  accessLevel: AccessLevel;
  downloadAllowed: boolean;
  viewOnly: boolean;
  expiryDate?: Date;
  
  // Status
  status: DocumentStatus;
  readStatus: ReadStatus;
  
  // Hybrid Features
  aiSummary?: string;
  keyInsights?: KeyInsight[];
  riskHighlights?: RiskHighlight[];
  
  // Metadata
  publishedAt: Date;
  createdAt: Date;
  updatedAt: Date;
  
  // Relationships
  lpEntity?: LPEntity;
}

export interface LPCommunication {
  id: string;
  lpEntityId: string;
  
  // Communication Details
  type: CommunicationType;
  subject: string;
  content: string;
  priority: Priority;
  
  // Delivery
  deliveryMethod: DeliveryMethod;
  status: CommunicationStatus;
  
  // Response Tracking
  requiresResponse: boolean;
  responseDeadline?: Date;
  responseReceived: boolean;
  responseContent?: string;
  responseDate?: Date;
  
  // Targeting
  audienceSegment?: string;
  fundSpecific?: string;
  
  // Hybrid Features
  personalizedContent?: PersonalizedContent;
  engagementAnalytics?: EngagementAnalytics;
  
  // Metadata
  sentAt: Date;
  createdAt: Date;
  updatedAt: Date;
  
  // Relationships
  lpEntity?: LPEntity;
}

// Enums and Supporting Types
export type LPEntityType = 'PENSION_FUND' | 'INSURANCE' | 'ENDOWMENT' | 'FAMILY_OFFICE' | 'SOVEREIGN_WEALTH' | 'CORPORATE' | 'INDIVIDUAL';
export type RiskProfile = 'CONSERVATIVE' | 'MODERATE' | 'AGGRESSIVE';
export type OnboardingStatus = 'DRAFT' | 'SUBMITTED' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED';
export type VerificationStatus = 'PENDING' | 'VERIFIED' | 'REQUIRES_UPDATE';
export type KYCStatus = 'PENDING' | 'SUBMITTED' | 'APPROVED' | 'REJECTED';
export type AccreditationStatus = 'PENDING' | 'ACCREDITED' | 'NOT_ACCREDITED';
export type CommitmentStatus = 'ACTIVE' | 'CLOSED' | 'CANCELLED' | 'SUSPENDED';
export type CapitalCallStatus = 'PENDING' | 'ACKNOWLEDGED' | 'FUNDED' | 'OVERDUE' | 'DEFAULTED';
export type DistributionType = 'CAPITAL_RETURN' | 'INCOME' | 'CARRIED_INTEREST' | 'TAX_RETURN' | 'OTHER';
export type DistributionStatus = 'ANNOUNCED' | 'PAID' | 'RECEIVED';
export type CoInvestmentStatus = 'OFFERED' | 'ACCEPTED' | 'DECLINED' | 'CLOSED' | 'CANCELLED';
export type ElectionType = 'ADVISORY_COMMITTEE' | 'BOARD_APPOINTMENT' | 'POLICY_CHANGE' | 'FUND_AMENDMENT' | 'OTHER';
export type ElectionStatus = 'ACTIVE' | 'CLOSED' | 'CANCELLED';
export type DocumentCategory = 'PERFORMANCE_REPORT' | 'FINANCIAL_STATEMENT' | 'TAX_DOCUMENT' | 'LEGAL_NOTICE' | 'CO_INVESTMENT' | 'COMPLIANCE';
export type AccessLevel = 'PRIVATE' | 'RESTRICTED' | 'PUBLIC';
export type DocumentStatus = 'AVAILABLE' | 'ARCHIVED' | 'RESTRICTED';
export type ReadStatus = 'UNREAD' | 'READ' | 'DOWNLOADED';
export type CommunicationType = 'EMAIL' | 'NEWSLETTER' | 'ANNOUNCEMENT' | 'MEETING_INVITE' | 'SURVEY' | 'ALERT';
export type Priority = 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';
export type DeliveryMethod = 'EMAIL' | 'PORTAL' | 'SMS' | 'MAIL';
export type CommunicationStatus = 'DRAFT' | 'SENT' | 'DELIVERED' | 'READ' | 'RESPONDED';

// Supporting Interfaces
export interface PaymentInstructions {
  bankName: string;
  accountName: string;
  accountNumber: string;
  routingNumber?: string;
  swiftCode?: string;
  iban?: string;
  specialInstructions?: string;
}

export interface AIRiskAssessment {
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  flags: string[];
  recommendations: string[];
  confidence: number;
  analysis: string;
}

export interface SourceInvestment {
  companyName: string;
  investmentType: string;
  originalCost: number;
  saleProceeds: number;
  gain: number;
  irr: number;
}

export interface TaxDocument {
  documentType: string;
  documentId: string;
  taxYear: number;
  jurisdiction: string;
  filingRequirements?: string;
}

export interface PerformanceMetrics {
  irr?: number;
  moic?: number;
  dpi?: number;
  rvpi?: number;
  tvpi?: number;
  benchmarkComparison?: BenchmarkComparison;
}

export interface BenchmarkComparison {
  benchmarkName: string;
  relativePerformance: number;
  percentile: number;
}

export interface DDPackage {
  documentName: string;
  category: string;
  uploadDate: Date;
  status: 'AVAILABLE' | 'RESTRICTED' | 'EXPIRED';
}

export interface ElectionOption {
  id: string;
  title: string;
  description: string;
  supportingInfo?: string;
}

export interface VotingPower {
  calculation: 'EQUAL' | 'COMMITMENT_BASED' | 'AUM_BASED' | 'CUSTOM';
  multiplier?: number;
  customRules?: string;
}

export interface ElectionResults {
  totalVotes: number;
  participationRate: number;
  results: Record<string, number>;
  winner?: string;
  summary: string;
}

export interface KeyInsight {
  category: string;
  insight: string;
  importance: 'LOW' | 'MEDIUM' | 'HIGH';
  actionRequired?: boolean;
}

export interface RiskHighlight {
  riskType: string;
  description: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  mitigation?: string;
}

export interface PersonalizedContent {
  originalContent: string;
  personalizedContent: string;
  personalizationFactors: string[];
  confidence: number;
}

export interface EngagementAnalytics {
  openRate?: number;
  clickRate?: number;
  responseRate?: number;
  timeSpent?: number;
  engagementScore: number;
}

// Dashboard and View Models
export interface LPDashboardData {
  entity: LPEntity;
  commitments: LPCommitment[];
  activeCapitalCalls: LPCapitalCall[];
  recentDistributions: LPDistribution[];
  coInvestmentOpportunities: LPCoInvestment[];
  unreadDocuments: LPDocument[];
  activeElections: LPElection[];
  summary: LPSummary;
  alerts: LPAlert[];
}

export interface LPSummary {
  totalCommitments: number;
  totalCalled: number;
  totalDistributed: number;
  currentNAV: number;
  weightedAverageIRR: number;
  averageMOIC: number;
  activeCapitalCallsCount: number;
  pendingResponsesCount: number;
  unreadDocumentsCount: number;
}

export interface LPAlert {
  id: string;
  type: 'CAPITAL_CALL' | 'DISTRIBUTION' | 'DOCUMENT' | 'ELECTION' | 'DEADLINE' | 'PERFORMANCE';
  title: string;
  message: string;
  severity: 'INFO' | 'WARNING' | 'ERROR' | 'CRITICAL';
  actionRequired: boolean;
  actionUrl?: string;
  deadline?: Date;
  createdAt: Date;
}

// Hybrid Mode Specific Types
export interface LPTraditionalDashboard extends LPDashboardData {
  // Traditional view shows all data in familiar formats
}

export interface LPAssistedDashboard extends LPDashboardData {
  aiRecommendations: AIRecommendation[];
  automationSuggestions: AutomationSuggestion[];
  performanceInsights: PerformanceInsight[];
  trendingTopics: string[];
}

export interface LPAutonomousDashboard {
  priorityActions: PriorityAction[];
  automatedActivities: AutomatedActivity[];
  decisionsRequired: DecisionPoint[];
  intelligentSummary: IntelligentSummary;
  automationMetrics: AutomationMetrics;
}

export interface AIRecommendation {
  id: string;
  type: 'RESPONSE' | 'INVESTMENT' | 'RISK' | 'OPTIMIZATION';
  title: string;
  description: string;
  priority: Priority;
  confidence: number;
  actionable: boolean;
  estimatedImpact?: string;
}

export interface AutomationSuggestion {
  id: string;
  task: string;
  frequency: string;
  timeSaving: number; // minutes per occurrence
  effort: 'LOW' | 'MEDIUM' | 'HIGH';
  enabled: boolean;
}

export interface PerformanceInsight {
  type: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL';
  metric: string;
  value: number;
  comparison: string;
  trend: 'UP' | 'DOWN' | 'STABLE';
  explanation: string;
}

export interface PriorityAction {
  id: string;
  type: 'RESPOND' | 'REVIEW' | 'DECIDE' | 'APPROVE';
  title: string;
  description: string;
  urgency: Priority;
  deadline?: Date;
  estimatedTime: number; // minutes
  autoExecutable: boolean;
}

export interface AutomatedActivity {
  id: string;
  activity: string;
  status: 'COMPLETED' | 'IN_PROGRESS' | 'SCHEDULED' | 'FAILED';
  completedAt?: Date;
  scheduledFor?: Date;
  result?: string;
  errorMessage?: string;
}

export interface DecisionPoint {
  id: string;
  decision: string;
  context: string;
  options: DecisionOption[];
  deadline?: Date;
  impact: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  recommendations: string[];
}

export interface DecisionOption {
  id: string;
  title: string;
  description: string;
  pros: string[];
  cons: string[];
  aiRecommendation: boolean;
  confidence: number;
}

export interface IntelligentSummary {
  todaysHighlights: string[];
  upcomingDeadlines: DeadlineItem[];
  performanceSummary: string;
  riskAlerts: string[];
  opportunityHighlights: string[];
}

export interface DeadlineItem {
  type: string;
  description: string;
  deadline: Date;
  daysRemaining: number;
  criticalPath: boolean;
}

export interface AutomationMetrics {
  tasksAutomated: number;
  timeSavedHours: number;
  accuracyRate: number;
  userSatisfaction: number;
  automationCoverage: number; // percentage
}

// API Response Types
export interface LPAPIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  metadata?: {
    total?: number;
    page?: number;
    limit?: number;
    hasMore?: boolean;
  };
}

export interface CapitalCallResponse {
  callId: string;
  response: 'ACKNOWLEDGE' | 'FUND' | 'PARTIAL_FUND' | 'REQUEST_EXTENSION' | 'DISPUTE';
  amount?: number;
  notes?: string;
  expectedFundingDate?: Date;
  paymentMethod?: string;
}

export interface CoInvestmentResponse {
  opportunityId: string;
  response: 'ACCEPT' | 'DECLINE' | 'REQUEST_INFO';
  investmentAmount?: number;
  conditions?: string[];
  notes?: string;
}

export interface ElectionVote {
  electionId: string;
  selectedOptions: string[];
  notes?: string;
  votingPowerUsed?: number;
}