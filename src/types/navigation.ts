// Core navigation types for the hybrid navigation system
export interface UserNavigationMode {
  mode: 'traditional' | 'assisted' | 'autonomous';
  aiPermissions: {
    suggestions: boolean;
    autoComplete: boolean;
    proactiveActions: boolean;
    autonomousExecution: boolean;
  };
  preferredDensity: 'compact' | 'comfortable' | 'spacious';
}

export interface AIAssistanceContext {
  userId: string;
  currentModule: string;
  userMode: UserNavigationMode;
  historicalPatterns: UserPattern[];
  activeDeals: Deal[];
  upcomingDeadlines: Deadline[];
  teamContext: TeamActivity[];
}

export interface AIRecommendation {
  id: string;
  type: 'suggestion' | 'automation' | 'insight' | 'warning';
  priority: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  actions: RecommendedAction[];
  confidence: number; // 0-1
  reasoning?: string; // For transparency
  moduleContext?: string;
  timestamp: Date;
}

export interface RecommendedAction {
  id: string;
  label: string;
  action: string;
  params?: Record<string, any>;
  primary?: boolean;
  destructive?: boolean;
  estimatedTimeSaving?: number; // minutes
}

export interface UserPattern {
  id: string;
  userId: string;
  patternType: string;
  patternData: Record<string, any>;
  frequency: number;
  lastObserved: Date;
  confidenceScore: number; // 0-1
}

export interface Deal {
  id: string;
  name: string;
  status: 'screening' | 'due-diligence' | 'structuring' | 'closed' | 'declined';
  priority: 'low' | 'medium' | 'high' | 'critical';
  lastActivity: Date;
  nextAction?: string;
  riskLevel?: 'low' | 'medium' | 'high';
}

export interface Deadline {
  id: string;
  dealId: string;
  dealName: string;
  title: string;
  dueDate: Date;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'in-progress' | 'completed' | 'overdue';
  assignedTo?: string;
}

export interface TeamActivity {
  id: string;
  userId: string;
  userName: string;
  dealId: string;
  dealName: string;
  activity: string;
  timestamp: Date;
  module: string;
}

export interface NavigationItem {
  id: string;
  label: string;
  icon?: string;
  href: string;
  badge?: string | number;
  children?: NavigationItem[];
  permissions?: string[];
  aiEnhanced?: boolean;
  description?: string;
}

export interface AIInsight {
  id: string;
  type: 'pattern' | 'prediction' | 'recommendation' | 'alert';
  title: string;
  description: string;
  confidence: number;
  impact: 'low' | 'medium' | 'high';
  module: string;
  actionable: boolean;
  actions?: RecommendedAction[];
}

export interface NavigationState {
  currentMode: UserNavigationMode;
  currentModule: string;
  navigationItems: NavigationItem[];
  recommendations: AIRecommendation[];
  insights: AIInsight[];
  isAIPanelOpen: boolean;
  preferences: UserPreferences;
}

export interface UserPreferences {
  navigationMode: 'traditional' | 'assisted' | 'autonomous';
  aiAdoptionLevel: number; // 0-10
  aiPermissions: AIPermissions;
  uiDensity: 'compact' | 'comfortable' | 'spacious';
  showAIHints: boolean;
  autoSaveEnabled: boolean;
  notificationSettings: NotificationSettings;
}

export interface AIPermissions {
  suggestions: boolean;
  autoComplete: boolean;
  proactiveActions: boolean;
  autonomousExecution: boolean;
  dataAnalysis: boolean;
  reportGeneration: boolean;
  meetingScheduling: boolean;
  documentProcessing: boolean;
}

export interface NotificationSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  aiRecommendations: boolean;
  deadlineReminders: boolean;
  teamUpdates: boolean;
}

export interface ModuleConfig {
  id: string;
  name: string;
  description: string;
  icon: string;
  route: string;
  aiCapabilities: AICapability[];
  permissions: string[];
  features: ModuleFeature[];
}

export interface AICapability {
  id: string;
  name: string;
  description: string;
  confidence: number;
  timeSaving: number; // estimated minutes saved
  complexity: 'low' | 'medium' | 'high';
}

export interface ModuleFeature {
  id: string;
  name: string;
  description: string;
  aiEnhanced: boolean;
  traditional: boolean;
}

// Action types for state management
export type NavigationAction =
  | { type: 'SET_MODE'; payload: UserNavigationMode }
  | { type: 'SET_MODULE'; payload: string }
  | { type: 'ADD_RECOMMENDATION'; payload: AIRecommendation }
  | { type: 'REMOVE_RECOMMENDATION'; payload: string }
  | { type: 'TOGGLE_AI_PANEL' }
  | { type: 'UPDATE_PREFERENCES'; payload: Partial<UserPreferences> }
  | { type: 'ADD_INSIGHT'; payload: AIInsight }
  | { type: 'CLEAR_INSIGHTS' }
  | { type: 'EXECUTE_ACTION'; payload: { actionId: string; params?: any } };