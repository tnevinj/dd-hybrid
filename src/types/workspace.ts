import { WorkProduct } from './work-product';

export type WorkspaceStatus = 'DRAFT' | 'ACTIVE' | 'REVIEW' | 'COMPLETED' | 'ARCHIVED';
export type WorkspaceType = 'SCREENING' | 'DUE_DILIGENCE' | 'IC_PREPARATION' | 'MONITORING' | 'UNIFIED';
export type WorkspacePhase = 'PLANNING' | 'EXECUTION' | 'REVIEW' | 'PRESENTATION';
export type ParticipantRole = 'LEAD' | 'ANALYST' | 'REVIEWER' | 'OBSERVER';
export type EvidenceType = 'DOCUMENT' | 'FINDING' | 'RISK' | 'MODEL' | 'INTERVIEW' | 'EXTERNAL_DATA';

export interface WorkspaceParticipant {
  id: string;
  userId: string;
  role: ParticipantRole;
  joinedAt: Date;
  lastActive?: Date;
}

export interface WorkspaceComment {
  id: string;
  content: string;
  authorId: string;
  authorName: string;
  createdAt: Date;
  updatedAt?: Date;
  parentId?: string;
  replies?: WorkspaceComment[];
}

export interface EvidenceLink {
  id: string;
  type: EvidenceType;
  title: string;
  description?: string;
  sourceUrl?: string;
  sourceSystem?: string;
  relevanceScore?: number;
  reliabilityScore?: number;
  attachedBy: string;
  attachedAt: Date;
  metadata?: Record<string, any>;
}

export interface AnalysisComponent {
  id: string;
  type: string;
  title: string;
  description?: string;
  assignedTo?: string;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'UNDER_REVIEW' | 'COMPLETED';
  progress: number;
  dueDate?: Date;
  completedAt?: Date;
  findings?: string;
  evidence: EvidenceLink[];
  metadata?: Record<string, any>;
}

export interface WorkspaceActivity {
  id: string;
  type: 'CREATED' | 'UPDATED' | 'COMMENTED' | 'EVIDENCE_ADDED' | 'STATUS_CHANGED' | 'MEMBER_ADDED' | 'COMPONENT_UPDATED';
  description: string;
  userId: string;
  userName: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export interface AIRecommendation {
  id: string;
  type: 'suggestion' | 'automation' | 'insight' | 'warning';
  priority: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  confidence: number;
  reasoning?: string;
  actions?: {
    label: string;
    action: string;
    params?: Record<string, any>;
  }[];
}

export interface InvestmentWorkspace {
  id: string;
  title: string;
  description?: string;
  type: WorkspaceType;
  status: WorkspaceStatus;
  phase: WorkspacePhase;
  
  // Associations
  dealName?: string;
  dealId?: string;
  screeningOpportunityId?: string;
  ddProjectId?: string;
  structuringProjectId?: string;
  
  // Metadata
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
  targetCompletionDate?: Date;
  
  // Team
  participants: WorkspaceParticipant[];
  leadAnalyst?: string;
  
  // Content
  analysisComponents: AnalysisComponent[];
  evidence: EvidenceLink[];
  comments: WorkspaceComment[];
  activities: WorkspaceActivity[];
  
  // AI Features
  aiRecommendations?: AIRecommendation[];
  aiInsights?: string[];
  
  // Progress tracking
  overallProgress: number;
  completedComponents: number;
  totalComponents: number;
  
  // Work Products
  workProducts?: WorkProduct[];
  
  // Tags and categorization
  tags?: string[];
  sector?: string;
  region?: string;
  investmentSize?: string;
}

export interface WorkspaceCreateRequest {
  title: string;
  description?: string;
  type: WorkspaceType;
  dealName?: string;
  dealId?: string;
  targetCompletionDate?: Date;
  participants?: {
    userId: string;
    role: ParticipantRole;
  }[];
  templateId?: string;
  tags?: string[];
}

export interface WorkspaceUpdateRequest {
  title?: string;
  description?: string;
  status?: WorkspaceStatus;
  phase?: WorkspacePhase;
  targetCompletionDate?: Date;
  tags?: string[];
}

export interface WorkspaceFilters {
  status?: WorkspaceStatus[];
  type?: WorkspaceType[];
  phase?: WorkspacePhase[];
  assignedToMe?: boolean;
  createdByMe?: boolean;
  sector?: string[];
  tags?: string[];
  search?: string;
  dateRange?: {
    from: Date;
    to: Date;
  };
}

export interface WorkspaceTemplate {
  id: string;
  name: string;
  description?: string;
  type: WorkspaceType;
  components: Omit<AnalysisComponent, 'id' | 'evidence' | 'assignedTo' | 'completedAt'>[];
  tags?: string[];
  isDefault?: boolean;
  createdBy: string;
  createdAt: Date;
}

export interface WorkspaceQuickCreateOption {
  id: string;
  title: string;
  description: string;
  type: WorkspaceType;
  templateId?: string;
  estimatedDuration: string;
  complexity: 'Simple' | 'Standard' | 'Complex';
}

export interface UnifiedWorkspaceView {
  workspace: InvestmentWorkspace;
  screeningData?: any;
  ddData?: any;
  structuringData?: any;
  externalIntegrations?: {
    systemName: string;
    status: 'connected' | 'disconnected' | 'error';
    lastSync?: Date;
    dataCount?: number;
  }[];
}