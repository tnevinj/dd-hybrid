/**
 * Enhanced Thando Assistant Context Types
 * Comprehensive context structure for intelligent AI responses
 */

export interface FinancialMetrics {
  totalAUM: number;
  totalValue: number;
  netIRR: number;
  grossIRR: number;
  totalValueMultiple: number;
  distributionsToDate: number;
  unrealizedValue: number;
  cashFlow: {
    quarterlyDistributions: number;
    quarterlyContributions: number;
    netCashFlow: number;
  };
  performance: {
    ytdReturn: number;
    quarterlyReturn: number;
    benchmarkComparison: number;
  };
}

export interface Project {
  id: string;
  name: string;
  type: 'portfolio' | 'deal' | 'company' | 'report' | 'analysis' | 'due-diligence';
  status: 'active' | 'completed' | 'draft' | 'review' | 'on-hold';
  priority: 'high' | 'medium' | 'low' | 'critical';
  progress: number;
  teamMembers: string[];
  lastActivity: Date;
  deadline?: Date;
  budget?: number;
  metadata: {
    dealValue?: number;
    sector?: string;
    geography?: string;
    stage?: string;
    riskRating?: 'low' | 'medium' | 'high';
    confidenceScore?: number;
  };
}

export interface Deal {
  id: string;
  name: string;
  status: 'sourcing' | 'screening' | 'due-diligence' | 'negotiation' | 'closed' | 'rejected';
  dealValue: number;
  equity: number;
  debt?: number;
  sector: string;
  geography: string;
  stage: 'seed' | 'series-a' | 'series-b' | 'growth' | 'buyout' | 'secondary';
  targetReturns: {
    irr: number;
    multiple: number;
  };
  timeline: {
    sourceDate: Date;
    ddStartDate?: Date;
    expectedCloseDate?: Date;
  };
  team: {
    lead: string;
    analyst: string[];
    advisors: string[];
  };
  keyMetrics: {
    revenue: number;
    ebitda: number;
    ebitdaMargin: number;
    growthRate: number;
  };
}

export interface Activity {
  id: string;
  type: 'deal_update' | 'portfolio_change' | 'report_generated' | 'meeting' | 'analysis' | 'action_executed';
  title: string;
  description: string;
  timestamp: Date;
  userId: string;
  entityId: string; // Deal ID, Portfolio ID, etc.
  entityType: 'deal' | 'portfolio' | 'company' | 'report';
  impact: 'low' | 'medium' | 'high';
  actionRequired: boolean;
  metadata?: Record<string, any>;
}

export interface UserPreferences {
  preferredAnalysisDepth: 'summary' | 'detailed' | 'comprehensive';
  communicationStyle: 'formal' | 'conversational' | 'concise';
  defaultTimeframe: '1M' | '3M' | '6M' | '1Y' | 'YTD';
  focusAreas: string[]; // e.g., ['healthcare', 'technology', 'secondary-deals']
  notificationFrequency: 'real-time' | 'hourly' | 'daily' | 'weekly';
  preferredChartTypes: string[];
  riskTolerance: 'low' | 'medium' | 'high';
}

export interface AIAction {
  id: string;
  name: string;
  description: string;
  category: 'analysis' | 'reporting' | 'execution' | 'communication' | 'data-management';
  inputSchema: Record<string, any>;
  estimatedDuration: string;
  riskLevel: 'low' | 'medium' | 'high';
  prerequisites: string[];
  impacts: string[];
  availability: {
    modules: string[];
    userRoles: string[];
    conditions?: string[];
  };
}

export interface ConversationMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  context?: {
    moduleContext: string;
    referenceData?: Record<string, any>;
    userIntent?: string;
    confidence?: number;
  };
  actions?: AIAction[];
  status: 'sending' | 'sent' | 'error' | 'processed';
}

export interface ThandoContext {
  // Current Session Context
  currentModule: 'dashboard' | 'portfolio' | 'due-diligence' | 'workspace' | 'deal-screening';
  currentPage: string;
  navigationMode: 'traditional' | 'assisted' | 'autonomous';
  
  // User Context
  userId: string;
  userRole: 'analyst' | 'associate' | 'vice-president' | 'partner' | 'admin';
  userPreferences: UserPreferences;
  
  // Data Context
  activeProjects: Project[];
  activeDeals: Deal[];
  portfolioMetrics: FinancialMetrics;
  recentActivity: Activity[];
  
  // AI Context
  conversationHistory: ConversationMessage[];
  availableActions: AIAction[];
  currentCapabilities: {
    proactiveInsights: boolean;
    automaticAnalysis: boolean;
    smartSuggestions: boolean;
    contextualRecommendations: boolean;
    realTimeAlerts: boolean;
    documentAnalysis: boolean;
    functionCalling: boolean;
  };
  
  // Platform Context
  platformData: {
    totalPortfolios: number;
    totalDeals: number;
    teamSize: number;
    lastLogin: Date;
    systemAlerts: string[];
    marketConditions: {
      sentiment: 'bullish' | 'bearish' | 'neutral';
      volatilityIndex: number;
      keyTrends: string[];
    };
  };
  
  // Temporal Context
  timeContext: {
    currentQuarter: string;
    fiscalYearEnd: Date;
    lastReportingDate: Date;
    upcomingDeadlines: Array<{
      type: string;
      date: Date;
      description: string;
    }>;
  };
}

export interface ClaudeRequest {
  message: string;
  context: ThandoContext;
  options?: {
    includeActions: boolean;
    maxTokens: number;
    temperature: number;
    systemPromptOverride?: string;
  };
}

export interface ClaudeResponse {
  content: string;
  actions?: AIAction[];
  confidence: number;
  reasoning?: string;
  followUpQuestions?: string[];
  contextUsed: string[];
  processingTime: number;
}

export interface DemoScenario {
  id: string;
  name: string;
  description: string;
  triggers: string[];
  context: Partial<ThandoContext>;
  expectedResponses: Array<{
    weight: number;
    content: string;
    actions?: AIAction[];
    followUps?: string[];
  }>;
  complexity: 'simple' | 'moderate' | 'complex';
  moduleRelevance: string[];
}