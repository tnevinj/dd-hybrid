// Investment Committee Type Definitions

// Enums
export enum CommitteeType {
  MAIN = 'MAIN',
  SPECIAL_SITUATIONS = 'SPECIAL_SITUATIONS',
  FOLLOW_ON = 'FOLLOW_ON',
  ADVISORY = 'ADVISORY'
}

export enum MemberRole {
  CHAIR = 'CHAIR',
  MEMBER = 'MEMBER',
  OBSERVER = 'OBSERVER',
  SECRETARY = 'SECRETARY'
}

export enum MemberStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  RETIRED = 'RETIRED'
}

export enum MeetingType {
  REGULAR = 'REGULAR',
  SPECIAL = 'SPECIAL',
  EMERGENCY = 'EMERGENCY'
}

export enum MeetingFormat {
  IN_PERSON = 'IN_PERSON',
  VIRTUAL = 'VIRTUAL',
  HYBRID = 'HYBRID'
}

export enum MeetingStatus {
  SCHEDULED = 'SCHEDULED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export enum ProposalType {
  NEW_INVESTMENT = 'NEW_INVESTMENT',
  FOLLOW_ON = 'FOLLOW_ON',
  EXIT = 'EXIT',
  WRITE_OFF = 'WRITE_OFF',
  OTHER = 'OTHER'
}

export enum ProposalStatus {
  SUBMITTED = 'SUBMITTED',
  UNDER_REVIEW = 'UNDER_REVIEW',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  DEFERRED = 'DEFERRED'
}

export enum Priority {
  LOW = 'LOW',
  NORMAL = 'NORMAL',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
  CRITICAL = 'CRITICAL'
}

export enum VotingStatus {
  PENDING = 'PENDING',
  VOTING = 'VOTING',
  COMPLETED = 'COMPLETED'
}

export enum VoteType {
  APPROVE = 'APPROVE',
  REJECT = 'REJECT',
  ABSTAIN = 'ABSTAIN',
  DEFER = 'DEFER'
}

export enum VoteMethod {
  IN_MEETING = 'IN_MEETING',
  EMAIL = 'EMAIL',
  ELECTRONIC = 'ELECTRONIC'
}

export enum DecisionOutcome {
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  DEFERRED = 'DEFERRED',
  WITHDRAWN = 'WITHDRAWN'
}

export enum ImplementationStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  DELAYED = 'DELAYED'
}

export enum ActionItemStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  OVERDUE = 'OVERDUE',
  CANCELLED = 'CANCELLED'
}

export enum TemplateType {
  AGENDA = 'AGENDA',
  PROPOSAL = 'PROPOSAL',
  DECISION_MEMO = 'DECISION_MEMO',
  MINUTES = 'MINUTES'
}

export enum DDStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED'
}

// Main Investment Committee Interface
export interface InvestmentCommittee {
  id: string;
  name: string;
  description?: string;
  
  // Committee Structure
  committeeType: CommitteeType;
  isActive: boolean;
  
  // Meeting Configuration
  quorumRequirement: number;
  majorityThreshold: number;
  superMajorityThreshold?: number;
  
  // Decision Authority
  maxInvestmentAmount?: number;
  cumulativeLimit?: number;
  requiresUnanimity: boolean;
  
  // Administrative
  chairPersonId?: string;
  secretaryId?: string;
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  
  // Relationships
  members?: ICMember[];
  meetings?: ICMeeting[];
}

// IC Member Interface
export interface ICMember {
  id: string;
  committeeId: string;
  
  // Member Information
  userId?: string;
  memberName: string;
  memberTitle?: string;
  memberEmail: string;
  
  // Member Role and Status
  role: MemberRole;
  status: MemberStatus;
  votingRights: boolean;
  
  // Terms
  appointmentDate: Date;
  termEndDate?: Date;
  isVotingMember: boolean;
  conflictDeclarations?: ConflictDeclaration[];
  
  // Participation Tracking
  meetingsAttended: number;
  meetingsEligible: number;
  attendanceRate: number;
  
  createdAt: Date;
  updatedAt: Date;
  
  // Relationships
  committee?: InvestmentCommittee;
  votes?: ICVote[];
}

// IC Meeting Interface
export interface ICMeeting {
  id: string;
  committeeId: string;
  
  // Meeting Details
  meetingNumber: number;
  meetingDate: Date;
  meetingTime?: string;
  duration?: number;
  
  // Meeting Type and Format
  meetingType: MeetingType;
  format: MeetingFormat;
  
  // Location/Access
  location?: string;
  meetingLink?: string;
  dialInDetails?: DialInInfo;
  
  // Meeting Status
  status: MeetingStatus;
  
  // Agenda and Documentation
  agendaItems?: AgendaItem[];
  materials?: MeetingMaterial[];
  minutes?: string;
  recordingLink?: string;
  
  // Attendance Tracking
  expectedAttendees?: string[];
  actualAttendees?: string[];
  quorumMet: boolean;
  attendanceCount: number;
  
  // Meeting Outcomes
  decisionsCount: number;
  approvalsCount: number;
  rejectionsCount: number;
  deferredCount: number;
  
  // Administrative
  chairPersonId?: string;
  secretaryId?: string;
  preparedBy?: string;
  
  // Meeting Preparation
  materialsDeadline?: Date;
  rsvpDeadline?: Date;
  
  // Follow-up
  actionItems?: ActionItemSummary[];
  nextMeetingDate?: Date;
  
  createdAt: Date;
  updatedAt: Date;
  
  // Relationships
  committee?: InvestmentCommittee;
  proposals?: ICProposal[];
}

// IC Proposal Interface
export interface ICProposal {
  id: string;
  meetingId: string;
  
  // Proposal Identification
  proposalNumber: string;
  proposalTitle: string;
  
  // Investment Details
  targetCompany: string;
  sector: string;
  geography?: string;
  proposalType: ProposalType;
  
  // Financial Information
  requestedAmount: number;
  totalDealSize?: number;
  proposedValuation?: number;
  ownershipPercentage?: number;
  
  // Investment Structure
  investmentType: string;
  securityType?: string;
  liquidationPreference?: string;
  boardSeats?: number;
  
  // Strategic Information
  investmentThesis?: string;
  keyRisks?: RiskFactor[];
  exitStrategy?: string;
  expectedHoldingPeriod?: number;
  
  // Returns Projections
  projectedIRR?: number;
  projectedMOIC?: number;
  baseCase?: FinancialProjection;
  upside?: FinancialProjection;
  downside?: FinancialProjection;
  
  // Due Diligence
  ddStatus: DDStatus;
  ddFirms?: DDFirm[];
  ddFindings?: DDFinding[];
  ddRecommendation?: string;
  
  // Proposal Status
  status: ProposalStatus;
  priority: Priority;
  
  // Presentation Details
  presentingPartner: string;
  presentationMaterials?: PresentationMaterial[];
  presentationDuration?: number;
  
  // Decision Tracking
  votingStatus: VotingStatus;
  votingDeadline?: Date;
  decisionDate?: Date;
  decisionRationale?: string;
  
  // Conditions and Follow-up
  approvalConditions?: ApprovalCondition[];
  actionItems?: ActionItemDetail[];
  followUpRequired: boolean;
  followUpDate?: Date;
  
  // Hybrid Features
  aiRiskScore?: number;
  aiRecommendation?: string;
  benchmarkAnalysis?: BenchmarkAnalysis;
  
  // Administrative
  submittedBy: string;
  submittedAt: Date;
  lastReviewed?: Date;
  reviewedBy?: string;
  
  createdAt: Date;
  updatedAt: Date;
  
  // Relationships
  meeting?: ICMeeting;
  votes?: ICVote[];
  decision?: ICDecision;
}

// IC Vote Interface
export interface ICVote {
  id: string;
  proposalId: string;
  memberId: string;
  
  // Vote Details
  vote: VoteType;
  voteCast: Date;
  
  // Vote Rationale
  comments?: string;
  conditions?: VoteCondition[];
  concerns?: string[];
  
  // Conflict of Interest
  conflictDeclared: boolean;
  conflictDetails?: string;
  recusal: boolean;
  
  // Vote Weighting
  voteWeight: number;
  isBindingVote: boolean;
  
  // Audit Trail
  voteMethod: VoteMethod;
  ipAddress?: string;
  deviceInfo?: string;
  
  createdAt: Date;
  updatedAt: Date;
  
  // Relationships
  proposal?: ICProposal;
  member?: ICMember;
}

// IC Decision Interface
export interface ICDecision {
  id: string;
  proposalId: string;
  
  // Decision Outcome
  decision: DecisionOutcome;
  decisionDate: Date;
  
  // Voting Results
  totalVotes: number;
  approvingVotes: number;
  rejectingVotes: number;
  abstentions: number;
  recusals: number;
  
  // Vote Analysis
  approvalPercentage: number;
  quorumMet: boolean;
  majorityAchieved: boolean;
  unanimousDecision: boolean;
  
  // Decision Details
  decisionSummary?: string;
  keyPoints?: string[];
  dissenting?: DissentingOpinion[];
  
  // Conditions and Requirements
  approvalConditions?: ApprovalCondition[];
  requiredActions?: RequiredAction[];
  reportingRequirements?: ReportingRequirement[];
  
  // Implementation
  implementationDeadline?: Date;
  responsibleParty?: string;
  implementationStatus: ImplementationStatus;
  
  // Follow-up and Monitoring
  reviewDate?: Date;
  monitoringRequirements?: MonitoringRequirement[];
  escalationTriggers?: EscalationTrigger[];
  
  // Documentation
  decisionMemo?: string;
  attachedDocuments?: DocumentReference[];
  legalReview: boolean;
  complianceSign: boolean;
  
  // Audit and Compliance
  auditTrail?: AuditTrailEntry[];
  regulatoryNotification: boolean;
  disclosureRequired: boolean;
  
  createdAt: Date;
  updatedAt: Date;
  
  // Relationships
  proposal?: ICProposal;
}

// IC Action Item Interface
export interface ICActionItem {
  id: string;
  meetingId?: string;
  proposalId?: string;
  
  // Action Item Details
  title: string;
  description: string;
  category?: string;
  
  // Assignment
  assignedTo: string;
  assignedBy: string;
  assignedDate: Date;
  
  // Timeline
  dueDate: Date;
  priority: Priority;
  
  // Status Tracking
  status: ActionItemStatus;
  completedDate?: Date;
  completedBy?: string;
  
  // Progress Tracking
  progressNotes?: string;
  attachments?: DocumentReference[];
  
  // Dependencies
  dependencies?: string[];
  blockers?: string[];
  
  // Reminders and Escalation
  reminderSent: boolean;
  escalationLevel: number;
  escalationDate?: Date;
  
  createdAt: Date;
  updatedAt: Date;
}

// IC Template Interface
export interface ICTemplate {
  id: string;
  
  // Template Details
  templateName: string;
  templateType: TemplateType;
  description?: string;
  
  // Template Content
  templateContent: TemplateContent;
  requiredFields?: TemplateField[];
  optionalFields?: TemplateField[];
  
  // Template Configuration
  isDefault: boolean;
  isActive: boolean;
  version: string;
  
  // Usage Analytics
  usageCount: number;
  lastUsed?: Date;
  
  // Template Metadata
  createdBy: string;
  lastModifiedBy?: string;
  
  createdAt: Date;
  updatedAt: Date;
}

// Supporting Interfaces and Types

export interface ConflictDeclaration {
  investmentId: string;
  investmentName: string;
  conflictType: 'FINANCIAL' | 'PERSONAL' | 'PROFESSIONAL';
  description: string;
  declaredDate: Date;
}

export interface DialInInfo {
  phoneNumber: string;
  accessCode: string;
  internationalNumbers?: { country: string; number: string }[];
}

export interface AgendaItem {
  id: string;
  order: number;
  title: string;
  description?: string;
  duration?: number;
  presenter?: string;
  type: 'PROPOSAL' | 'DISCUSSION' | 'UPDATE' | 'OTHER';
  attachments?: DocumentReference[];
}

export interface MeetingMaterial {
  id: string;
  title: string;
  type: 'PRESENTATION' | 'MEMO' | 'FINANCIALS' | 'DD_REPORT' | 'OTHER';
  url: string;
  uploadDate: Date;
  uploadedBy: string;
  isConfidential: boolean;
}

export interface ActionItemSummary {
  title: string;
  assignedTo: string;
  dueDate: Date;
  priority: Priority;
}

export interface RiskFactor {
  category: 'MARKET' | 'FINANCIAL' | 'OPERATIONAL' | 'REGULATORY' | 'TECHNOLOGY';
  risk: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  mitigation?: string;
}

export interface FinancialProjection {
  year1Revenue: number;
  year2Revenue: number;
  year3Revenue: number;
  year4Revenue: number;
  year5Revenue: number;
  terminalValue: number;
  projectedIRR: number;
  projectedMOIC: number;
  assumptions: string[];
}

export interface DDFirm {
  name: string;
  type: 'FINANCIAL' | 'COMMERCIAL' | 'TECHNICAL' | 'LEGAL' | 'ESG';
  status: 'ENGAGED' | 'IN_PROGRESS' | 'COMPLETED';
  cost: number;
  deliverables: string[];
}

export interface DDFinding {
  category: string;
  finding: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  impact: string;
  recommendation: string;
}

export interface PresentationMaterial {
  title: string;
  type: 'SLIDES' | 'HANDOUT' | 'MODEL' | 'REPORT';
  url: string;
  pageCount?: number;
  isConfidential: boolean;
}

export interface ApprovalCondition {
  condition: string;
  category: 'FINANCIAL' | 'LEGAL' | 'OPERATIONAL' | 'GOVERNANCE';
  deadline?: Date;
  responsibleParty: string;
  status: 'PENDING' | 'SATISFIED' | 'WAIVED';
}

export interface ActionItemDetail {
  title: string;
  description: string;
  assignedTo: string;
  dueDate: Date;
  priority: Priority;
}

export interface BenchmarkAnalysis {
  peerComparisons: PeerComparison[];
  marketMetrics: MarketMetric[];
  riskScore: number;
  recommendation: string;
}

export interface PeerComparison {
  companyName: string;
  sector: string;
  valuation: number;
  multiple: number;
  growth: number;
}

export interface MarketMetric {
  metric: string;
  value: number;
  benchmark: number;
  percentile: number;
}

export interface VoteCondition {
  condition: string;
  category: 'FINANCIAL' | 'LEGAL' | 'OPERATIONAL' | 'GOVERNANCE';
  priority: Priority;
}

export interface DissentingOpinion {
  memberName: string;
  opinion: string;
  keyPoints: string[];
}

export interface RequiredAction {
  action: string;
  assignedTo: string;
  deadline: Date;
  priority: Priority;
}

export interface ReportingRequirement {
  reportType: string;
  frequency: string;
  recipients: string[];
  deadline?: Date;
}

export interface MonitoringRequirement {
  metric: string;
  threshold: number;
  frequency: string;
  responsibleParty: string;
}

export interface EscalationTrigger {
  trigger: string;
  threshold: number;
  escalationAction: string;
  notifyParties: string[];
}

export interface DocumentReference {
  id: string;
  title: string;
  type: string;
  url: string;
  uploadDate: Date;
}

export interface AuditTrailEntry {
  action: string;
  performedBy: string;
  timestamp: Date;
  details: Record<string, any>;
}

export interface TemplateContent {
  sections: TemplateSection[];
  formatting: TemplateFormatting;
}

export interface TemplateSection {
  id: string;
  title: string;
  order: number;
  content: string;
  isRequired: boolean;
  fieldType: 'TEXT' | 'RICH_TEXT' | 'NUMBER' | 'DATE' | 'LIST' | 'TABLE';
}

export interface TemplateField {
  fieldName: string;
  fieldType: string;
  description?: string;
  validation?: FieldValidation;
}

export interface TemplateFormatting {
  fontFamily: string;
  fontSize: number;
  margins: { top: number; right: number; bottom: number; left: number };
  header?: string;
  footer?: string;
}

export interface FieldValidation {
  required: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
}

// Hybrid Mode Specific Types
export interface TraditionalICView {
  showDetailedVoting: boolean;
  showFullProposals: boolean;
  groupBy: 'DATE' | 'STATUS' | 'TYPE' | 'PRIORITY';
  sortBy: string;
  filterCriteria: ICFilterCriteria;
}

export interface AssistedICView {
  aiRecommendations: ICRecommendation[];
  smartInsights: ICInsight[];
  automationSuggestions: ICAutomationSuggestion[];
  riskAlerts: ICRiskAlert[];
}

export interface AutonomousICView {
  priorityDecisions: ICPriorityDecision[];
  automatedAnalysis: AutomatedAnalysis[];
  decisionQueue: ICDecisionQueue[];
  performanceAlerts: ICPerformanceAlert[];
}

export interface ICRecommendation {
  type: 'PROPOSAL_REVIEW' | 'VOTING_STRATEGY' | 'RISK_MITIGATION' | 'PROCESS_IMPROVEMENT';
  priority: Priority;
  title: string;
  description: string;
  rationale: string;
  expectedImpact: string;
  confidence: number;
  actions: string[];
  timeline: string;
}

export interface ICInsight {
  category: 'VOTING_PATTERNS' | 'PROPOSAL_TRENDS' | 'MEMBER_ENGAGEMENT' | 'DECISION_OUTCOMES';
  title: string;
  description: string;
  relevantProposals: string[];
  trendDirection: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL';
  significance: 'LOW' | 'MEDIUM' | 'HIGH';
  actionable: boolean;
}

export interface ICFilterCriteria {
  statuses?: ProposalStatus[];
  types?: ProposalType[];
  priorities?: Priority[];
  sectors?: string[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  amountRange?: {
    min: number;
    max: number;
  };
}