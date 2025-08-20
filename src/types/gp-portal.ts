// GP Portal Type Definitions
// Comprehensive types for GP onboarding, deal submission, and management

export interface GPCompany {
  id: string;
  name: string;
  description?: string;
  website?: string;
  sector?: string;
  subsector?: string;
  geography?: string;
  foundedYear?: number;
  employeeCount?: number;
  headquarters?: string;
  
  // Contact Information
  primaryContactName: string;
  primaryContactEmail: string;
  primaryContactPhone?: string;
  
  // Company Details
  businessModel?: string;
  revenueModel?: string;
  competitivePosition?: string;
  keyMetrics?: Record<string, any>;
  
  // Status and Verification
  onboardingStatus: GPOnboardingStatus;
  verificationStatus: GPVerificationStatus;
  lastUpdated: Date;
  createdAt: Date;
  
  // Relationships
  deals?: GPDealSubmission[];
  documents?: GPDocument[];
  communications?: GPCommunication[];
  onboardingData?: GPOnboardingData[];
}

export interface GPOnboardingData {
  id: string;
  companyId: string;
  
  // Investment Focus
  investmentStrategy?: string;
  targetDealSize?: string;
  targetSectors?: string[];
  targetGeographies?: string[];
  investmentPhase?: string;
  
  // Track Record
  previousDeals?: DealHistory[];
  portfolioCompanies?: PortfolioCompany[];
  teamMembers?: TeamMember[];
  
  // Compliance & Legal
  regulatoryStatus?: RegulatoryInfo[];
  complianceChecks?: ComplianceCheck[];
  legalStructure?: string;
  
  // Performance Data
  historicalReturns?: PerformanceMetric[];
  fundSize?: number;
  aum?: number;
  
  step: GPOnboardingStep;
  completedSteps: string[];
  isComplete: boolean;
  
  createdAt: Date;
  updatedAt: Date;
}

export interface GPDealSubmission {
  id: string;
  companyId: string;
  
  // Deal Overview
  dealName: string;
  targetCompanyName: string;
  targetCompanyDescription?: string;
  dealType: DealType;
  investmentType?: InvestmentType;
  
  // Financial Information
  dealSize?: number;
  proposedInvestment?: number;
  targetValuation?: number;
  enterpriseValue?: number;
  revenue?: number;
  ebitda?: number;
  
  // Deal Metrics
  revenueMultiple?: number;
  ebitdaMultiple?: number;
  targetIRR?: number;
  targetMultiple?: number;
  paybackPeriod?: number;
  
  // Investment Details
  targetOwnership?: number;
  boardSeats?: number;
  liquidationPreference?: string;
  useOfFunds?: string[];
  
  // Strategic Information
  investmentThesis?: string;
  riskFactors?: string[];
  exitStrategy?: string;
  competitivePosition?: string;
  
  // Due Diligence Data
  financialStatements?: FinancialStatement[];
  legalDocuments?: LegalDocumentInfo[];
  operationalDueDiligence?: OperationalAssessment;
  technicalDueDiligence?: TechnicalAssessment;
  
  // Submission Status
  status: DealSubmissionStatus;
  submissionStage: SubmissionStage;
  priority: Priority;
  
  // Dates
  sourceDate: Date;
  submittedAt?: Date;
  reviewStartedAt?: Date;
  completedAt?: Date;
  targetClosingDate?: Date;
  
  // Review Information
  assignedAnalyst?: string;
  reviewNotes?: ReviewNote[];
  feedback?: GPFeedback[];
  
  createdAt: Date;
  updatedAt: Date;
  
  // Relationships
  company?: GPCompany;
  documents?: GPDocument[];
  communications?: GPCommunication[];
  dealWorkspace?: any; // InvestmentWorkspace type from existing system
}

export interface GPDocument {
  id: string;
  companyId: string;
  dealSubmissionId?: string;
  
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
  
  // Status and Processing
  status: DocumentStatus;
  analysisStatus?: string;
  analysisResults?: DocumentAnalysis;
  
  // Hybrid Mode Features
  aiSuggestions?: AISuggestion[];
  autoExtractedData?: ExtractedData;
  complianceCheck?: ComplianceCheckResult;
  
  // Metadata
  uploadedBy?: string;
  uploadedAt: Date;
  reviewedAt?: Date;
  reviewedBy?: string;
  updatedAt: Date;
  
  // Relationships
  company?: GPCompany;
  dealSubmission?: GPDealSubmission;
}

export interface GPCommunication {
  id: string;
  companyId: string;
  dealSubmissionId?: string;
  
  // Communication Details
  type: CommunicationType;
  subject: string;
  content: string;
  direction: CommunicationDirection;
  
  // Recipients/Participants
  fromContact?: string;
  toContacts?: string[];
  participants?: string[];
  
  // Status and Tracking
  status: CommunicationStatus;
  priority: Priority;
  requiresResponse: boolean;
  responseDeadline?: Date;
  
  // Hybrid Features
  aiGeneratedContent?: AIGeneratedContent;
  sentimentAnalysis?: SentimentAnalysis;
  followUpSuggestions?: FollowUpSuggestion[];
  
  // Metadata
  createdBy?: string;
  createdAt: Date;
  sentAt?: Date;
  readAt?: Date;
  respondedAt?: Date;
  updatedAt: Date;
  
  // Relationships
  company?: GPCompany;
  dealSubmission?: GPDealSubmission;
}

// Enums and Supporting Types
export type GPOnboardingStatus = 'DRAFT' | 'SUBMITTED' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED';
export type GPVerificationStatus = 'PENDING' | 'VERIFIED' | 'REQUIRES_UPDATE';
export type GPOnboardingStep = 'COMPANY_INFO' | 'INVESTMENT_FOCUS' | 'TRACK_RECORD' | 'COMPLIANCE' | 'PERFORMANCE' | 'REVIEW';

export type DealType = 'ACQUISITION' | 'INVESTMENT' | 'MERGER' | 'BUYOUT' | 'GROWTH_CAPITAL' | 'RECAPITALIZATION';
export type InvestmentType = 'PRIMARY' | 'SECONDARY' | 'CO_INVESTMENT';
export type DealSubmissionStatus = 'DRAFT' | 'SUBMITTED' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED';
export type SubmissionStage = 'INITIAL' | 'DETAILED' | 'FINAL';
export type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type DocumentCategory = 'FINANCIAL' | 'LEGAL' | 'OPERATIONAL' | 'TECHNICAL' | 'MARKETING' | 'COMPLIANCE';
export type DocumentStatus = 'UPLOADED' | 'PROCESSING' | 'ANALYZED' | 'APPROVED' | 'REJECTED';

export type CommunicationType = 'EMAIL' | 'MESSAGE' | 'MEETING' | 'CALL' | 'DOCUMENT_REQUEST' | 'NOTIFICATION';
export type CommunicationDirection = 'INBOUND' | 'OUTBOUND';
export type CommunicationStatus = 'PENDING' | 'SENT' | 'DELIVERED' | 'READ' | 'RESPONDED';

// Supporting Interfaces
export interface DealHistory {
  dealName: string;
  targetCompany: string;
  dealSize: number;
  closingDate: Date;
  outcome: string;
  irr?: number;
  multiple?: number;
}

export interface PortfolioCompany {
  name: string;
  sector: string;
  investmentDate: Date;
  currentValuation: number;
  ownership: number;
  status: 'ACTIVE' | 'EXITED' | 'WRITTEN_OFF';
}

export interface TeamMember {
  name: string;
  title: string;
  experience: number;
  background: string;
  expertise: string[];
}

export interface RegulatoryInfo {
  jurisdiction: string;
  licenseType: string;
  licenseNumber: string;
  status: 'ACTIVE' | 'PENDING' | 'EXPIRED';
  expiryDate?: Date;
}

export interface ComplianceCheck {
  checkType: 'KYC' | 'AML' | 'BACKGROUND' | 'REFERENCE';
  status: 'PENDING' | 'PASSED' | 'FAILED' | 'REQUIRES_UPDATE';
  completedDate?: Date;
  notes?: string;
}

export interface PerformanceMetric {
  periodStart: Date;
  periodEnd: Date;
  irr: number;
  multiple: number;
  fundSize: number;
  deployed: number;
  realized: number;
}

export interface FinancialStatement {
  statementType: 'INCOME' | 'BALANCE_SHEET' | 'CASH_FLOW';
  period: string;
  currency: string;
  data: Record<string, number>;
}

export interface LegalDocumentInfo {
  documentName: string;
  documentType: string;
  status: 'DRAFT' | 'EXECUTED' | 'PENDING_SIGNATURE';
  parties: string[];
  keyTerms: Record<string, any>;
}

export interface OperationalAssessment {
  managementTeam: TeamMember[];
  operationalMetrics: Record<string, any>;
  businessModel: string;
  competitivePosition: string;
  marketPosition: string;
  riskFactors: string[];
}

export interface TechnicalAssessment {
  technologyStack: string[];
  ipPortfolio: string[];
  technicalRisks: string[];
  scalabilityAssessment: string;
  competitiveTechAdvantage: string;
}

export interface ReviewNote {
  id: string;
  reviewer: string;
  category: string;
  content: string;
  priority: Priority;
  status: 'OPEN' | 'ADDRESSED' | 'CLOSED';
  createdAt: Date;
}

export interface GPFeedback {
  id: string;
  category: string;
  message: string;
  actionRequired: boolean;
  dueDate?: Date;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  createdAt: Date;
}

// AI and Hybrid Features
export interface DocumentAnalysis {
  extractedMetrics: Record<string, any>;
  riskFlags: string[];
  complianceIssues: string[];
  qualityScore: number;
  recommendations: string[];
}

export interface AISuggestion {
  type: 'IMPROVEMENT' | 'COMPLETION' | 'RISK_MITIGATION' | 'OPTIMIZATION';
  title: string;
  description: string;
  priority: Priority;
  confidence: number;
  actionable: boolean;
}

export interface ExtractedData {
  keyMetrics: Record<string, any>;
  dates: Date[];
  amounts: number[];
  entities: string[];
  relationships: string[];
}

export interface ComplianceCheckResult {
  passed: boolean;
  issues: string[];
  recommendations: string[];
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

export interface AIGeneratedContent {
  originalPrompt: string;
  generatedText: string;
  confidence: number;
  alternatives: string[];
  tone: 'FORMAL' | 'CASUAL' | 'URGENT' | 'FRIENDLY';
}

export interface SentimentAnalysis {
  sentiment: 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE';
  confidence: number;
  emotionalTone: string[];
  urgencyLevel: number;
}

export interface FollowUpSuggestion {
  type: 'IMMEDIATE' | 'SCHEDULED' | 'CONDITIONAL';
  action: string;
  timing: string;
  priority: Priority;
  automated: boolean;
}

// View Models for Different Hybrid Modes
export interface GPTraditionalDashboard {
  companies: GPCompany[];
  activeDeals: GPDealSubmission[];
  pendingDocuments: GPDocument[];
  recentCommunications: GPCommunication[];
  metrics: GPMetrics;
}

export interface GPAssistedDashboard extends GPTraditionalDashboard {
  aiRecommendations: AISuggestion[];
  automationOpportunities: AutomationOpportunity[];
  insightsSummary: InsightsSummary;
}

export interface GPAutonomousDashboard {
  priorityActions: PriorityAction[];
  automatedTasks: AutomatedTask[];
  decisionsRequired: DecisionRequired[];
  performanceSummary: PerformanceSummary;
}

export interface GPMetrics {
  totalSubmissions: number;
  activeSubmissions: number;
  approvedDeals: number;
  averageProcessingTime: number;
  successRate: number;
}

export interface AutomationOpportunity {
  task: string;
  timesSaved: number;
  effort: 'LOW' | 'MEDIUM' | 'HIGH';
  impact: 'LOW' | 'MEDIUM' | 'HIGH';
  canAutomate: boolean;
}

export interface InsightsSummary {
  trendingDeals: string[];
  marketOpportunities: string[];
  riskAlerts: string[];
  performanceInsights: string[];
}

export interface PriorityAction {
  id: string;
  type: 'REVIEW_REQUIRED' | 'APPROVAL_NEEDED' | 'FOLLOW_UP' | 'DEADLINE_APPROACHING';
  title: string;
  description: string;
  urgency: Priority;
  estimatedTime: number;
  autoExecutable: boolean;
}

export interface AutomatedTask {
  id: string;
  task: string;
  status: 'COMPLETED' | 'IN_PROGRESS' | 'SCHEDULED';
  completedAt?: Date;
  nextExecution?: Date;
  result?: string;
}

export interface DecisionRequired {
  id: string;
  decision: string;
  context: string;
  options: DecisionOption[];
  deadline?: Date;
  impact: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

export interface DecisionOption {
  option: string;
  pros: string[];
  cons: string[];
  recommendation: boolean;
  confidence: number;
}

export interface PerformanceSummary {
  efficiency: number;
  accuracy: number;
  timesSaved: number;
  automationRate: number;
  userSatisfaction: number;
}

// API Response Types
export interface GPAPIResponse<T> {
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

export interface GPOnboardingProgress {
  currentStep: GPOnboardingStep;
  completedSteps: string[];
  totalSteps: number;
  progressPercentage: number;
  estimatedTimeRemaining: number;
  blockers: string[];
}

export interface DealSubmissionValidation {
  isValid: boolean;
  requiredFields: string[];
  missingFields: string[];
  warnings: string[];
  recommendations: string[];
}