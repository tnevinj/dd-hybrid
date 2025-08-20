// Core Due Diligence Types - Ported from secondary-edge-nextjs

// Project Types
export interface DueDiligenceProject {
  id: string
  dealId: string
  name: string
  description?: string
  status: DueDiligenceProjectStatus
  stage: DueDiligenceStage
  type: DueDiligenceProjectType
  priority: 'low' | 'medium' | 'high' | 'critical'
  startDate: Date
  targetDate?: Date
  completedDate?: Date
  assignedToId: string
  assignedTo?: User
  createdAt: Date
  updatedAt: Date
  
  // Progress tracking
  progressPercentage: number
  tasksTotal: number
  tasksCompleted: number
  
  // Risk assessment
  riskLevel: RiskLevel
  overallRiskScore: number
  
  // Relations
  deal?: Deal
  findings: DueDiligenceFinding[]
  risks: DueDiligenceRisk[]
  tasks: DueDiligenceTask[]
  documents: DueDiligenceDocument[]
  interviews: DueDiligenceInterview[]
  activities: DueDiligenceActivity[]
  
  // AI enhancements
  aiInsights: AIInsight[]
  automatedTasks: string[]
  similarProjects: string[]
}

export type DueDiligenceProjectStatus = 
  | 'planning'
  | 'active'
  | 'in-progress'
  | 'review'
  | 'completed'
  | 'on-hold'
  | 'cancelled'

export type DueDiligenceStage = 
  | 'initial'
  | 'preliminary'
  | 'detailed'
  | 'confirmatory'
  | 'final'

export type DueDiligenceProjectType = 
  | 'buyout'
  | 'growth'
  | 'venture'
  | 'special-situations'
  | 'distressed'

// Risk Management
export interface DueDiligenceRisk {
  id: string
  projectId: string
  title: string
  description: string
  category: RiskCategory
  level: RiskLevel
  probability: RiskProbability
  impact: RiskImpact
  riskScore: number // Calculated score
  mitigation?: string
  mitigationPlan?: string
  mitigationStatus: MitigationStatus
  status: RiskStatus
  identifiedBy: string
  assignedTo?: string
  identifiedDate: Date
  targetResolutionDate?: Date
  actualResolutionDate?: Date
  createdAt: Date
  updatedAt: Date
  
  // AI enhancements
  aiGenerated: boolean
  confidenceLevel: number
  similarRisks: string[]
  recommendedActions: RecommendedAction[]
}

export type RiskCategory = 
  | 'financial'
  | 'operational'
  | 'legal'
  | 'regulatory'
  | 'market'
  | 'technology'
  | 'management'
  | 'environmental'
  | 'reputation'
  | 'strategic'

export type RiskLevel = 'low' | 'medium' | 'high' | 'critical'
export type RiskProbability = 'low' | 'medium' | 'high' | 'very-high'
export type RiskImpact = 'low' | 'medium' | 'high' | 'severe'
export type RiskStatus = 'identified' | 'assessing' | 'mitigating' | 'monitoring' | 'resolved' | 'accepted'
export type MitigationStatus = 'not-started' | 'in-progress' | 'completed' | 'ineffective'

// Findings Management
export interface DueDiligenceFinding {
  id: string
  projectId: string
  title: string
  description: string
  category: FindingCategory
  severity: FindingSeverity
  status: FindingStatus
  source: FindingSource
  evidence?: string[]
  documentIds: string[]
  assignedTo?: string
  discoveredBy: string
  discoveredDate: Date
  targetResolutionDate?: Date
  actualResolutionDate?: Date
  resolution?: string
  followUpRequired: boolean
  createdAt: Date
  updatedAt: Date
  
  // AI enhancements
  aiGenerated: boolean
  confidenceLevel: number
  relatedFindings: string[]
  suggestedResolution?: string
}

export type FindingCategory = 
  | 'financial'
  | 'legal'
  | 'operational'
  | 'commercial'
  | 'technical'
  | 'compliance'
  | 'governance'
  | 'hr'
  | 'environmental'

export type FindingSeverity = 'info' | 'low' | 'medium' | 'high' | 'critical'
export type FindingStatus = 'open' | 'investigating' | 'pending-resolution' | 'resolved' | 'closed'
export type FindingSource = 'document-review' | 'interview' | 'site-visit' | 'data-analysis' | 'ai-analysis' | 'external-report'

// Document Management
export interface DueDiligenceDocument {
  id: string
  projectId: string
  name: string
  originalName: string
  description?: string
  category: DocumentCategory
  type: DocumentType
  filePath?: string
  fileSize?: number
  mimeType?: string
  uploadedBy: string
  uploadedAt: Date
  lastAccessedAt?: Date
  version: number
  status: DDDocumentStatus
  confidentialityLevel: ConfidentialityLevel
  
  // Document analysis
  aiAnalyzed: boolean
  analysisStatus: AnalysisStatus
  analysisResults?: DocumentAnalysisResult
  extractedData?: Record<string, any>
  keyMetrics?: DocumentMetric[]
  
  // Organization
  tags: string[]
  folder?: string
  parentDocumentId?: string
  relatedDocuments: string[]
  
  createdAt: Date
  updatedAt: Date
}

export type DocumentCategory = 
  | 'financial'
  | 'legal'
  | 'commercial'
  | 'operational'
  | 'technical'
  | 'compliance'
  | 'hr'
  | 'environmental'
  | 'other'

export type DocumentType = 
  | 'financial-statement'
  | 'management-account'
  | 'budget-forecast'
  | 'contract'
  | 'legal-opinion'
  | 'compliance-report'
  | 'technical-specification'
  | 'presentation'
  | 'spreadsheet'
  | 'report'
  | 'email'
  | 'other'

export type DDDocumentStatus = 'pending' | 'processing' | 'analyzed' | 'reviewed' | 'approved' | 'rejected'
export type ConfidentialityLevel = 'public' | 'internal' | 'confidential' | 'highly-confidential'
export type AnalysisStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'skipped'

export interface DocumentAnalysisResult {
  summary: string
  keyFindings: string[]
  riskFlags: string[]
  extractedMetrics: Record<string, number>
  confidence: number
  processingTime: number
  aiModel: string
}

export interface DocumentMetric {
  name: string
  value: number | string
  unit?: string
  confidence: number
  source: 'extracted' | 'calculated' | 'manual'
}

// Task Management
export interface DueDiligenceTask {
  id: string
  projectId: string
  title: string
  description?: string
  category: TaskCategory
  type: TaskType
  priority: TaskPriority
  status: TaskStatus
  assignedTo?: string
  assignedBy: string
  estimatedHours?: number
  actualHours?: number
  dependencies: string[]
  dueDate?: Date
  completedAt?: Date
  createdAt: Date
  updatedAt: Date
  
  // Progress tracking
  progressPercentage: number
  checklistItems: TaskChecklistItem[]
  
  // AI automation
  automatable: boolean
  aiAssisted: boolean
  aiRecommendations: string[]
  
  // Relations
  relatedFindings: string[]
  relatedRisks: string[]
  relatedDocuments: string[]
}

export type TaskCategory = 
  | 'document-review'
  | 'data-analysis'
  | 'interview'
  | 'site-visit'
  | 'verification'
  | 'report-writing'
  | 'risk-assessment'
  | 'compliance-check'

export type TaskType = 'standard' | 'milestone' | 'deliverable' | 'review' | 'approval'
export type TaskPriority = 'low' | 'medium' | 'high' | 'critical'
export type TaskStatus = 'not-started' | 'in-progress' | 'blocked' | 'review' | 'completed' | 'cancelled'

export interface TaskChecklistItem {
  id: string
  description: string
  completed: boolean
  completedBy?: string
  completedAt?: Date
  notes?: string
}

// Interview Management
export interface DueDiligenceInterview {
  id: string
  projectId: string
  title: string
  description?: string
  interviewType: InterviewType
  status: InterviewStatus
  scheduledDate?: Date
  actualDate?: Date
  duration?: number // minutes
  location?: string
  isVirtual: boolean
  meetingLink?: string
  
  // Participants
  interviewer: string
  interviewees: InterviewParticipant[]
  
  // Content
  questions: InterviewQuestion[]
  notes?: string
  transcript?: string
  recording?: string
  keyTakeaways: string[]
  actionItems: InterviewActionItem[]
  
  // Follow-up
  followUpRequired: boolean
  followUpDate?: Date
  
  createdAt: Date
  updatedAt: Date
}

export type InterviewType = 
  | 'management'
  | 'technical'
  | 'financial'
  | 'commercial'
  | 'operational'
  | 'legal'
  | 'hr'
  | 'customer'
  | 'supplier'
  | 'reference'

export type InterviewStatus = 'planned' | 'scheduled' | 'in-progress' | 'completed' | 'cancelled' | 'rescheduled'

export interface InterviewParticipant {
  id: string
  name: string
  role: string
  company?: string
  email?: string
  phone?: string
  type: 'internal' | 'target-company' | 'external'
}

export interface InterviewQuestion {
  id: string
  category: string
  question: string
  priority: 'low' | 'medium' | 'high'
  asked: boolean
  response?: string
  followUpRequired: boolean
}

export interface InterviewActionItem {
  id: string
  description: string
  assignedTo?: string
  dueDate?: Date
  status: 'open' | 'in-progress' | 'completed'
  priority: 'low' | 'medium' | 'high'
}

// Activity Tracking
export interface DueDiligenceActivity {
  id: string
  projectId: string
  userId: string
  activityType: ActivityType
  title: string
  description?: string
  entityType?: EntityType
  entityId?: string
  oldValue?: any
  newValue?: any
  metadata?: Record<string, any>
  timestamp: Date
}

export type ActivityType = 
  | 'project-created'
  | 'project-updated'
  | 'status-changed'
  | 'task-created'
  | 'task-completed'
  | 'finding-added'
  | 'risk-identified'
  | 'document-uploaded'
  | 'document-analyzed'
  | 'interview-scheduled'
  | 'interview-completed'
  | 'comment-added'
  | 'ai-recommendation'

export type EntityType = 'project' | 'task' | 'finding' | 'risk' | 'document' | 'interview'

// Dashboard and Analytics
export interface DueDiligenceDashboardMetrics {
  totalProjects: number
  activeProjects: number
  completedProjects: number
  overdueProjects: number
  
  totalTasks: number
  completedTasks: number
  overdueTasks: number
  
  totalFindings: number
  openFindings: number
  criticalFindings: number
  
  totalRisks: number
  highRisks: number
  unresolvedRisks: number
  
  totalDocuments: number
  analyzedDocuments: number
  pendingDocuments: number
  
  averageProjectDuration: number
  averageTaskCompletionTime: number
  
  aiAutomationSavings: number // hours saved
  aiAccuracyRate: number
}

export interface DueDiligenceAnalytics {
  projectStatusDistribution: Record<DueDiligenceProjectStatus, number>
  riskCategoryDistribution: Record<RiskCategory, number>
  findingSeverityDistribution: Record<FindingSeverity, number>
  taskCompletionTrends: TimeSeriesData[]
  documentAnalysisTrends: TimeSeriesData[]
  teamProductivityMetrics: TeamProductivityMetric[]
}

export interface TimeSeriesData {
  date: string
  value: number
  category?: string
}

export interface TeamProductivityMetric {
  userId: string
  userName: string
  tasksCompleted: number
  averageTaskTime: number
  findingsIdentified: number
  documentsReviewed: number
  aiUsageRate: number
}

// AI Integration Types
export interface AIInsight {
  id: string
  projectId: string
  type: AIInsightType
  title: string
  description: string
  confidence: number
  impact: 'low' | 'medium' | 'high'
  category: string
  actionable: boolean
  actions?: RecommendedAction[]
  evidence: string[]
  createdAt: Date
  dismissed: boolean
}

export type AIInsightType = 
  | 'pattern-detected'
  | 'anomaly-found'
  | 'risk-identified'
  | 'opportunity-detected'
  | 'efficiency-suggestion'
  | 'quality-issue'
  | 'benchmark-comparison'

export interface RecommendedAction {
  id: string
  label: string
  description: string
  action: string
  params?: Record<string, any>
  estimatedTimeSaving?: number
  confidence: number
  priority: 'low' | 'medium' | 'high'
}

// Operational Excellence Assessment Types
export interface OperationalMetrics {
  processEfficiency: number // 0-100
  costOptimization: number // 0-100
  qualityScore: number // 0-100
  technologyScore: number // 0-100
  supplyChainResilience: number // 0-100
  operationalScalability: number // 0-100
  automationLevel: number // 0-100
  digitalMaturity: number // 0-100
}

export interface OperationalAssessment {
  id: string
  projectId: string
  assessmentDate: Date
  assessorId: string
  operationalMetrics: OperationalMetrics
  keyProcesses: OperationalProcess[]
  inefficiencies: OperationalInefficiency[]
  improvementOpportunities: ImprovementOpportunity[]
  benchmarkComparison: OperationalBenchmark
  overallScore: number // 0-100
  confidenceLevel: number // 0-1
  createdAt: Date
  updatedAt: Date
}

export interface OperationalProcess {
  id: string
  name: string
  description: string
  category: 'core' | 'support' | 'strategic'
  maturityLevel: 'initial' | 'developing' | 'defined' | 'managed' | 'optimized'
  efficiencyScore: number // 0-100
  automationPotential: number // 0-100
  criticalityLevel: 'low' | 'medium' | 'high' | 'critical'
  currentState: string
  targetState?: string
  keyMetrics: ProcessMetric[]
}

export interface ProcessMetric {
  name: string
  value: number
  unit: string
  benchmark: number
  trend: 'improving' | 'stable' | 'declining'
}

export interface OperationalInefficiency {
  id: string
  processId: string
  type: 'waste' | 'bottleneck' | 'redundancy' | 'manual_process' | 'quality_issue'
  description: string
  impact: 'low' | 'medium' | 'high' | 'critical'
  estimatedCost: number
  frequency: 'rare' | 'occasional' | 'frequent' | 'constant'
  rootCause?: string
  identifiedBy: string
  identifiedDate: Date
}

export interface ImprovementOpportunity {
  id: string
  title: string
  description: string
  category: 'process' | 'technology' | 'people' | 'structure'
  priority: 'low' | 'medium' | 'high' | 'critical'
  estimatedImpact: number // 0-100
  estimatedCost: number
  estimatedTimeframe: number // months
  expectedROI: number
  implementationComplexity: 'low' | 'medium' | 'high'
  relatedProcesses: string[]
  aiRecommended: boolean
  confidenceLevel?: number
}

export interface OperationalBenchmark {
  industry: string
  region: string
  companySize: 'small' | 'medium' | 'large'
  benchmarkMetrics: {
    [key: string]: {
      value: number
      percentile: number
      source: string
    }
  }
  lastUpdated: Date
}

// Management Team Assessment Types
export interface ManagementTeamMember {
  id: string
  name: string
  role: string
  tenure: number // years
  previousExperience: Experience[]
  educationBackground: Education[]
  competencyScores: ManagementCompetencies
  performanceHistory: PerformanceRecord[]
  riskFactors: ManagementRiskFactor[]
  retentionRisk: 'low' | 'medium' | 'high'
  successorIdentified: boolean
}

export interface Experience {
  company: string
  role: string
  duration: number // years
  sector: string
  relevanceScore: number // 0-100
  achievements: string[]
}

export interface Education {
  institution: string
  degree: string
  field: string
  graduationYear: number
  relevanceScore: number // 0-100
}

export interface ManagementCompetencies {
  leadership: number // 0-100
  strategicThinking: number // 0-100
  operationalExecution: number // 0-100
  financialAcumen: number // 0-100
  industryExpertise: number // 0-100
  teamBuilding: number // 0-100
  communication: number // 0-100
  adaptability: number // 0-100
  integrityScore: number // 0-100
}

export interface PerformanceRecord {
  year: number
  kpiAchievement: number // 0-100
  revenueGrowth: number
  profitabilityImprovement: number
  teamSatisfaction: number // 0-100
  stakeholderFeedback: number // 0-100
  majorAchievements: string[]
  challenges: string[]
}

export interface ManagementRiskFactor {
  type: 'succession' | 'retention' | 'performance' | 'governance' | 'external'
  description: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  probability: number // 0-1
  impact: number // 0-100
  mitigationStrategy?: string
  monitoringRequired: boolean
}

export interface ManagementAssessment {
  id: string
  projectId: string
  assessmentDate: Date
  assessorId: string
  teamMembers: ManagementTeamMember[]
  teamDynamics: TeamDynamics
  governanceStructure: GovernanceStructure
  successionPlanning: SuccessionPlanning
  retentionStrategies: RetentionStrategy[]
  overallTeamScore: number // 0-100
  keyRisks: ManagementRiskFactor[]
  recommendations: ManagementRecommendation[]
  confidenceLevel: number // 0-1
  createdAt: Date
  updatedAt: Date
}

export interface TeamDynamics {
  cohesion: number // 0-100
  communication: number // 0-100
  decisionMaking: number // 0-100
  conflictResolution: number // 0-100
  workDistribution: number // 0-100
  overallEffectiveness: number // 0-100
}

export interface GovernanceStructure {
  boardComposition: BoardMember[]
  decisionMakingProcess: string
  reportingStructure: string
  controlMechanisms: string[]
  complianceScore: number // 0-100
  transparencyLevel: number // 0-100
}

export interface BoardMember {
  name: string
  role: string
  independence: 'independent' | 'affiliated' | 'insider'
  expertise: string[]
  tenure: number // years
  contributionScore: number // 0-100
}

export interface SuccessionPlanning {
  keyRolesIdentified: string[]
  successorsIdentified: number // percentage
  developmentPrograms: SuccessionProgram[]
  timeToReplaceCriticalRoles: number // months
  successionReadiness: number // 0-100
}

export interface SuccessionProgram {
  role: string
  successor: string
  readinessLevel: number // 0-100
  developmentPlan: string[]
  timeToReadiness: number // months
}

export interface RetentionStrategy {
  targetRole: string
  strategy: 'compensation' | 'equity' | 'development' | 'recognition' | 'culture'
  description: string
  effectiveness: number // 0-100
  cost: number
  implementationStatus: 'planned' | 'active' | 'completed'
}

export interface ManagementRecommendation {
  id: string
  type: 'hiring' | 'development' | 'retention' | 'structure' | 'governance'
  priority: 'low' | 'medium' | 'high' | 'critical'
  description: string
  expectedImpact: number // 0-100
  estimatedCost: number
  timeframe: number // months
  implementationComplexity: 'low' | 'medium' | 'high'
  aiGenerated: boolean
  confidenceLevel?: number
}

// GP Relationship Management Types
export interface GPRelationship {
  id: string
  gpId: string
  gpName: string
  firmName: string
  relationshipStart: Date
  relationshipManager: string
  relationshipQuality: number // 0-100
  communicationFrequency: 'weekly' | 'monthly' | 'quarterly' | 'annual'
  lastInteraction: Date
  dealHistory: GPDealHistory[]
  performanceTrack: GPPerformanceTrack[]
  riskAssessment: GPRiskAssessment
  strategicValue: number // 0-100
  futureOpportunities: GPOpportunity[]
}

export interface GPDealHistory {
  dealId: string
  dealName: string
  dealDate: Date
  dealSize: number
  sector: string
  outcome: 'successful' | 'neutral' | 'unsuccessful'
  irr: number
  multiple: number
  holdingPeriod: number // months
  lessonsLearned: string[]
}

export interface GPPerformanceTrack {
  fundName: string
  vintage: number
  fundSize: number
  currentIRR: number
  currentMultiple: number
  dpi: number
  rvpi: number
  topQuartile: boolean
  benchmarkPerformance: number // vs industry
  consistencyScore: number // 0-100
}

export interface GPRiskAssessment {
  keyPersonRisk: 'low' | 'medium' | 'high'
  teamStability: number // 0-100
  fundRaisingRisk: 'low' | 'medium' | 'high'
  strategyDrift: number // 0-100
  operationalCapability: number // 0-100
  complianceRecord: number // 0-100
  overallRiskScore: number // 0-100
}

export interface GPOpportunity {
  type: 'co-investment' | 'fund_investment' | 'strategic_partnership' | 'deal_sourcing'
  description: string
  estimatedValue: number
  probability: number // 0-1
  timeframe: number // months
  strategicAlignment: number // 0-100
}

// Supporting Types
export interface User {
  id: string
  name: string
  email: string
  role: string
  avatar?: string
}

export interface Deal {
  id: string
  name: string
  status: string
  value?: number
  currency?: string
  sector?: string
  region?: string
}