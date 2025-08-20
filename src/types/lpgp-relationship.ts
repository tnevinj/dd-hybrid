// LPGP Relationship Management Type Definitions

export type NavigationMode = 'traditional' | 'assisted' | 'autonomous';

// LP Organization Types
export type OrganizationType = 
  | 'PENSION_FUND' 
  | 'SOVEREIGN_WEALTH' 
  | 'ENDOWMENT' 
  | 'FOUNDATION' 
  | 'INSURANCE' 
  | 'FUND_OF_FUNDS' 
  | 'FAMILY_OFFICE' 
  | 'CORPORATE' 
  | 'GOVERNMENT' 
  | 'OTHER';

export type RelationshipStatus = 
  | 'PROSPECT' 
  | 'ACTIVE_LP' 
  | 'FORMER_LP' 
  | 'DECLINED';

export type RelationshipTier = 'TIER_1' | 'TIER_2' | 'TIER_3' | 'PROSPECT';

export type RiskProfile = 'CONSERVATIVE' | 'MODERATE' | 'AGGRESSIVE';

export type LiquidityNeeds = 'LOW' | 'MEDIUM' | 'HIGH';

// LP Contact Types
export type ContactRole = 
  | 'PRIMARY_CONTACT' 
  | 'INVESTMENT_COMMITTEE' 
  | 'COMPLIANCE' 
  | 'OPERATIONS' 
  | 'LEGAL' 
  | 'OTHER';

export type Seniority = 'JUNIOR' | 'SENIOR' | 'EXECUTIVE' | 'C_SUITE';

export type DecisionMaking = 'DECISION_MAKER' | 'INFLUENCER' | 'GATEKEEPER' | 'USER';

export type TrustLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'VERY_HIGH';

export type CommunicationStyle = 'FORMAL' | 'CASUAL' | 'TECHNICAL' | 'EXECUTIVE';

// Investment Types
export type InvestmentStatus = 
  | 'COMMITTED' 
  | 'ACTIVE' 
  | 'FULLY_INVESTED' 
  | 'LIQUIDATED' 
  | 'DEFAULTED';

// Communication Types
export type CommunicationType = 
  | 'EMAIL' 
  | 'PHONE' 
  | 'MEETING' 
  | 'LETTER' 
  | 'PRESENTATION' 
  | 'WEBINAR' 
  | 'CONFERENCE_CALL';

export type CommunicationDirection = 'INBOUND' | 'OUTBOUND';

export type CommunicationStatus = 'SCHEDULED' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';

export type CommunicationCategory = 
  | 'FUNDRAISING' 
  | 'REPORTING' 
  | 'RELATIONSHIP' 
  | 'OPERATIONAL' 
  | 'COMPLIANCE' 
  | 'OTHER';

// Meeting Types
export type MeetingType = 
  | 'ANNUAL_MEETING' 
  | 'QUARTERLY_UPDATE' 
  | 'DUE_DILIGENCE' 
  | 'FUNDRAISING' 
  | 'ADVISORY' 
  | 'SOCIAL' 
  | 'OTHER';

export type MeetingFormat = 'IN_PERSON' | 'VIDEO_CALL' | 'PHONE_CALL' | 'HYBRID';

export type MeetingStatus = 
  | 'SCHEDULED' 
  | 'IN_PROGRESS' 
  | 'COMPLETED' 
  | 'CANCELLED' 
  | 'POSTPONED';

// Report Types
export type ReportType = 
  | 'QUARTERLY' 
  | 'ANNUAL' 
  | 'CAPITAL_CALL' 
  | 'DISTRIBUTION' 
  | 'SPECIAL' 
  | 'COMPLIANCE' 
  | 'TAX';

export type ReportStatus = 
  | 'DRAFT' 
  | 'REVIEW' 
  | 'APPROVED' 
  | 'SENT' 
  | 'DELIVERED';

export type DistributionMethod = 'EMAIL' | 'PORTAL' | 'COURIER' | 'ENCRYPTED_EMAIL';

export type ConfidentialityLevel = 'PUBLIC' | 'INTERNAL' | 'CONFIDENTIAL' | 'RESTRICTED';

// Task Types
export type TaskType = 
  | 'FOLLOW_UP' 
  | 'PREPARE_REPORT' 
  | 'SCHEDULE_MEETING' 
  | 'DUE_DILIGENCE' 
  | 'COMPLIANCE' 
  | 'OTHER';

export type TaskStatus = 
  | 'PENDING' 
  | 'IN_PROGRESS' 
  | 'COMPLETED' 
  | 'CANCELLED' 
  | 'ON_HOLD';

export type TaskCategory = 'CLIENT_SERVICE' | 'FUNDRAISING' | 'REPORTING' | 'COMPLIANCE';

export type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

// Relationship Plan Types
export type PlanType = 'ACQUISITION' | 'RETENTION' | 'EXPANSION' | 'RE_ENGAGEMENT';

export type EngagementLevel = 'HIGH_TOUCH' | 'MEDIUM_TOUCH' | 'LOW_TOUCH';

export type PlanStatus = 'DRAFT' | 'ACTIVE' | 'ON_HOLD' | 'COMPLETED' | 'CANCELLED';

// CRM Activity Types
export type ActivityType = 
  | 'CALL' 
  | 'EMAIL' 
  | 'MEETING' 
  | 'NOTE' 
  | 'TASK' 
  | 'OPPORTUNITY' 
  | 'PROPOSAL' 
  | 'CONTRACT';

export type ActivityImpact = 'LOW' | 'MEDIUM' | 'HIGH';

export type Sentiment = 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE';

export type ActivityCategory = 'FUNDRAISING' | 'RELATIONSHIP' | 'SERVICE' | 'OPPORTUNITY';

// Interfaces
export interface ContactPreferences {
  preferredCommunication: CommunicationType[];
  bestTimeToContact: string;
  timeZone: string;
  languagePreference: string;
  communicationFrequency: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY';
  interests: string[];
  personalNotes: string[];
}

export interface InvestmentStrategy {
  allocationTargets: {
    assetClass: string;
    targetPercentage: number;
    currentPercentage?: number;
  }[];
  geographicPreferences: string[];
  sectorPreferences: string[];
  investmentSize: {
    minimum: number;
    maximum: number;
    typical: number;
  };
  dueDiligenceFocus: string[];
}

export interface Participant {
  id: string;
  name: string;
  email?: string;
  role?: string;
  organization?: string;
  isExternal: boolean;
}

export interface AgendaItem {
  id: string;
  title: string;
  description?: string;
  duration: number; // minutes
  presenter?: string;
  materials?: string[];
  order: number;
}

export interface ActionItem {
  id: string;
  description: string;
  assignedTo: string;
  dueDate?: Date;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  priority: Priority;
}

export interface Attachment {
  id: string;
  fileName: string;
  filePath: string;
  fileSize: number;
  fileType: string;
  uploadedBy: string;
  uploadedAt: Date;
}

export interface Milestone {
  id: string;
  title: string;
  description?: string;
  targetDate: Date;
  completedDate?: Date;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'DELAYED';
  successCriteria: string[];
}

export interface StrategicObjective {
  id: string;
  objective: string;
  description?: string;
  targetValue?: number;
  currentValue?: number;
  unit?: string;
  targetDate: Date;
  priority: Priority;
  owner: string;
}

export interface TouchpointPlan {
  id: string;
  type: CommunicationType;
  frequency: 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'ANNUALLY';
  purpose: string;
  participants: string[];
  template?: string;
}

export interface PerformanceMetric {
  id: string;
  metricName: string;
  currentValue: number;
  targetValue: number;
  unit: string;
  trend: 'IMPROVING' | 'DECLINING' | 'STABLE';
  lastUpdated: Date;
}

// Main Entity Interfaces
export interface LPContact {
  id: string;
  lpOrganizationId: string;
  firstName: string;
  lastName: string;
  title?: string;
  department?: string;
  email: string;
  phoneOffice?: string;
  phoneMobile?: string;
  linkedIn?: string;
  role: ContactRole;
  seniority: Seniority;
  decisionMaking: DecisionMaking;
  relationshipTier: RelationshipTier;
  trustLevel: TrustLevel;
  communicationStyle: CommunicationStyle;
  preferences?: ContactPreferences;
  notes?: string;
  tags?: string[];
  lastContact?: Date;
  nextFollowUp?: Date;
  meetingFrequency?: string;
  isActive: boolean;
  createdBy: string;
  createdAt: Date;
  updatedBy?: string;
  updatedAt: Date;
  lpOrganization?: LPOrganization;
  communications?: Communication[];
  meetings?: Meeting[];
  tasks?: Task[];
}

export interface LPOrganization {
  id: string;
  name: string;
  legalName?: string;
  organizationType: OrganizationType;
  description?: string;
  website?: string;
  headquarters?: string;
  aum?: number;
  currency: string;
  investmentStrategy?: InvestmentStrategy;
  allocationTargets?: any;
  riskProfile: RiskProfile;
  investmentHorizon?: number;
  liquidityNeeds: LiquidityNeeds;
  relationshipStatus: RelationshipStatus;
  relationshipTier: RelationshipTier;
  onboardingDate?: Date;
  lastInvestment?: Date;
  totalCommitments: number;
  totalInvested: number;
  totalDistributions: number;
  numberOfFunds: number;
  jurisdiction?: string;
  regulatoryConstraints?: any;
  taxConsiderations?: any;
  dueDiligenceRequirements?: any;
  reportingRequirements?: any;
  meetingPreferences?: any;
  isActive: boolean;
  notes?: string;
  tags?: string[];
  createdBy: string;
  createdAt: Date;
  updatedBy?: string;
  updatedAt: Date;
  contacts?: LPContact[];
  investments?: LPInvestment[];
  communications?: Communication[];
  meetings?: Meeting[];
  reports?: LPReport[];
  tasks?: Task[];
  relationshipPlan?: RelationshipPlan;
}

export interface LPInvestment {
  id: string;
  lpOrganizationId: string;
  fundId?: string;
  fundName: string;
  commitmentAmount: number;
  commitmentDate: Date;
  currency: string;
  status: InvestmentStatus;
  calledAmount: number;
  investedAmount: number;
  distributedAmount: number;
  navValue?: number;
  irr?: number;
  tvpi?: number;
  dpi?: number;
  rvpi?: number;
  firstDrawdown?: Date;
  lastDrawdown?: Date;
  firstDistribution?: Date;
  lastDistribution?: Date;
  expectedMaturity?: Date;
  lpa?: string;
  sideLetters?: any;
  createdAt: Date;
  updatedAt: Date;
  lpOrganization?: LPOrganization;
}

export interface Communication {
  id: string;
  lpOrganizationId?: string;
  lpContactId?: string;
  type: CommunicationType;
  subject: string;
  content?: string;
  direction: CommunicationDirection;
  participants: Participant[];
  primaryContact?: string;
  scheduledAt?: Date;
  occurredAt: Date;
  duration?: number;
  purpose?: string;
  outcome?: string;
  followUpRequired: boolean;
  followUpDate?: Date;
  status: CommunicationStatus;
  priority: Priority;
  attachments?: Attachment[];
  relatedDocuments?: any;
  recordingUrl?: string;
  category?: CommunicationCategory;
  tags?: string[];
  isConfidential: boolean;
  createdBy: string;
  createdAt: Date;
  updatedBy?: string;
  updatedAt: Date;
  lpOrganization?: LPOrganization;
  lpContact?: LPContact;
}

export interface Meeting {
  id: string;
  lpOrganizationId?: string;
  lpContactId?: string;
  title: string;
  description?: string;
  meetingType: MeetingType;
  scheduledStart: Date;
  scheduledEnd: Date;
  actualStart?: Date;
  actualEnd?: Date;
  timeZone: string;
  format: MeetingFormat;
  location?: string;
  meetingUrl?: string;
  organizer: string;
  attendees: Participant[];
  requiredAttendees?: Participant[];
  optionalAttendees?: Participant[];
  agenda?: AgendaItem[];
  materials?: Attachment[];
  preMeetingNotes?: string;
  status: MeetingStatus;
  outcome?: string;
  actionItems?: ActionItem[];
  followUpRequired: boolean;
  recordingUrl?: string;
  transcriptUrl?: string;
  meetingNotes?: string;
  priority: Priority;
  isRecurring: boolean;
  recurrenceRule?: string;
  createdBy: string;
  createdAt: Date;
  updatedBy?: string;
  updatedAt: Date;
  lpOrganization?: LPOrganization;
  lpContact?: LPContact;
}

export interface LPReport {
  id: string;
  lpOrganizationId?: string;
  title: string;
  reportType: ReportType;
  period: string;
  content?: string;
  summary?: string;
  keyMetrics?: any;
  fileName?: string;
  filePath?: string;
  fileSize?: number;
  fileType?: string;
  status: ReportStatus;
  generatedAt: Date;
  reviewedBy?: string;
  reviewedAt?: Date;
  approvedBy?: string;
  approvedAt?: Date;
  sentAt?: Date;
  deliveredAt?: Date;
  recipients?: any;
  distributionMethod?: DistributionMethod;
  complianceChecks?: any;
  confidentialityLevel: ConfidentialityLevel;
  tags?: string[];
  notes?: string;
  createdBy: string;
  createdAt: Date;
  updatedBy?: string;
  updatedAt: Date;
  lpOrganization?: LPOrganization;
}

export interface Task {
  id: string;
  lpOrganizationId?: string;
  lpContactId?: string;
  title: string;
  description?: string;
  taskType: TaskType;
  priority: Priority;
  assignedTo: string;
  assignedBy?: string;
  dueDate?: Date;
  estimatedHours?: number;
  actualHours?: number;
  status: TaskStatus;
  progress: number;
  completedAt?: Date;
  completedBy?: string;
  completionNotes?: string;
  dependencies?: string[];
  relatedEntities?: any;
  reminderDate?: Date;
  escalationDate?: Date;
  escalationTo?: string;
  category?: TaskCategory;
  tags?: string[];
  createdBy: string;
  createdAt: Date;
  updatedBy?: string;
  updatedAt: Date;
  lpOrganization?: LPOrganization;
  lpContact?: LPContact;
}

export interface RelationshipPlan {
  id: string;
  lpOrganizationId: string;
  name: string;
  description?: string;
  planType: PlanType;
  objectives: StrategicObjective[];
  targetOutcomes: any[];
  keyMetrics: PerformanceMetric[];
  startDate: Date;
  endDate: Date;
  milestones: Milestone[];
  engagementLevel: EngagementLevel;
  communicationPlan: any;
  touchpointPlan: TouchpointPlan[];
  targetCommitment?: number;
  investmentGoals?: any;
  fundMatching?: any;
  allocatedResources?: any;
  budget?: number;
  teamAssignment: any;
  status: PlanStatus;
  progress: number;
  lastReview?: Date;
  nextReview?: Date;
  successCriteria?: any;
  performanceMetrics?: PerformanceMetric[];
  createdBy: string;
  createdAt: Date;
  updatedBy?: string;
  updatedAt: Date;
  lpOrganization?: LPOrganization;
}

export interface CRMActivity {
  id: string;
  lpOrganizationId?: string;
  lpContactId?: string;
  activityType: ActivityType;
  subject: string;
  description?: string;
  activityDate: Date;
  duration?: number;
  primaryContact: string;
  participants?: Participant[];
  outcome?: string;
  impact: ActivityImpact;
  sentiment: Sentiment;
  followUpRequired: boolean;
  followUpDate?: Date;
  followUpNotes?: string;
  opportunityValue?: number;
  stage?: string;
  probability?: number;
  category?: ActivityCategory;
  tags?: string[];
  attachments?: Attachment[];
  relatedRecords?: any;
  createdBy: string;
  createdAt: Date;
  updatedBy?: string;
  updatedAt: Date;
  lpOrganization?: LPOrganization;
  lpContact?: LPContact;
}

// Dashboard and UI Types
export interface LPGPRelationshipStats {
  totalLPs: number;
  activeLPs: number;
  prospectLPs: number;
  totalCommitments: number;
  totalContacts: number;
  pendingTasks: number;
  upcomingMeetings: number;
  overdueFollowUps: number;
}

export interface RelationshipSummary {
  lpOrganization: LPOrganization;
  primaryContact?: LPContact;
  lastActivity?: Date;
  nextActivity?: Date;
  relationshipScore: number;
  commitmentPotential: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  healthStatus: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR';
}

export interface RecentActivity {
  id: string;
  type: 'COMMUNICATION' | 'MEETING' | 'TASK' | 'REPORT';
  description: string;
  lpOrganizationName?: string;
  contactName?: string;
  timestamp: Date;
  priority?: Priority;
  status?: string;
}

export interface UpcomingActivity {
  id: string;
  type: 'MEETING' | 'TASK' | 'FOLLOW_UP' | 'REPORT_DUE';
  title: string;
  description?: string;
  lpOrganizationName?: string;
  contactName?: string;
  dueDate: Date;
  priority: Priority;
  status: string;
}

export interface FundraisingOpportunity {
  id: string;
  lpOrganizationName: string;
  contactName: string;
  fundName: string;
  potentialCommitment: number;
  probability: number;
  stage: string;
  expectedClose: Date;
  lastActivity: Date;
  relationshipTier: RelationshipTier;
}

// Hybrid Mode Specific Types
export interface HybridModeContent {
  traditional: {
    showAllContacts: boolean;
    enableManualScheduling: boolean;
    showDetailedReports: boolean;
    manualTaskAssignment: boolean;
  };
  assisted: {
    showRecommendedActions: boolean;
    smartScheduling: boolean;
    automatedReminders: boolean;
    relationshipInsights: boolean;
  };
  autonomous: {
    autoTaskCreation: boolean;
    intelligentScheduling: boolean;
    predictiveAnalytics: boolean;
    autoReportGeneration: boolean;
    adaptiveEngagement: boolean;
  };
}

// API Response Types
export interface LPGPRelationshipResponse {
  stats: LPGPRelationshipStats;
  lpOrganizations: LPOrganization[];
  relationshipSummaries: RelationshipSummary[];
  recentActivities: RecentActivity[];
  upcomingActivities: UpcomingActivity[];
  fundraisingOpportunities: FundraisingOpportunity[];
  contacts: LPContact[];
  communications: Communication[];
  meetings: Meeting[];
  tasks: Task[];
  reports: LPReport[];
}

// Filter and Search Types
export interface OrganizationFilter {
  organizationTypes?: OrganizationType[];
  relationshipStatuses?: RelationshipStatus[];
  relationshipTiers?: RelationshipTier[];
  commitmentRange?: {
    min: number;
    max: number;
  };
  regions?: string[];
  aumRange?: {
    min: number;
    max: number;
  };
}

export interface ContactFilter {
  roles?: ContactRole[];
  seniority?: Seniority[];
  decisionMaking?: DecisionMaking[];
  relationshipTiers?: RelationshipTier[];
  lastContactRange?: {
    start: Date;
    end: Date;
  };
}

export interface ActivityFilter {
  activityTypes?: ActivityType[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  priority?: Priority[];
  status?: string[];
  categories?: string[];
}

export interface SearchOptions {
  query?: string;
  organizationFilters?: OrganizationFilter;
  contactFilters?: ContactFilter;
  activityFilters?: ActivityFilter;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

// Component Props
export interface LPGPRelationshipDashboardProps {
  navigationMode: NavigationMode;
  onModeChange: (mode: NavigationMode) => void;
}

export interface LPDirectoryProps {
  organizations: LPOrganization[];
  summaries: RelationshipSummary[];
  onOrganizationSelect: (org: LPOrganization) => void;
  navigationMode: NavigationMode;
  filters?: OrganizationFilter;
}

export interface ContactManagementProps {
  contacts: LPContact[];
  onContactSelect: (contact: LPContact) => void;
  onContactEdit: (contact: LPContact) => void;
  navigationMode: NavigationMode;
}

export interface CommunicationCenterProps {
  communications: Communication[];
  meetings: Meeting[];
  onScheduleMeeting: (meeting: Partial<Meeting>) => void;
  onSendCommunication: (communication: Partial<Communication>) => void;
  navigationMode: NavigationMode;
}

export interface TaskManagementProps {
  tasks: Task[];
  onTaskUpdate: (task: Task) => void;
  onTaskCreate: (task: Partial<Task>) => void;
  navigationMode: NavigationMode;
}

export interface FundraisingPipelineProps {
  opportunities: FundraisingOpportunity[];
  onOpportunityUpdate: (opportunity: FundraisingOpportunity) => void;
  navigationMode: NavigationMode;
}