'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { ThandoContext, ConversationMessage, ClaudeRequest, ClaudeResponse, AIAction } from '@/types/thando-context';
import { useNavigationStore } from '@/stores/navigation-store';
import { UnifiedWorkspaceDataService } from '@/lib/data/unified-workspace-data';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  actions?: AIAction[];
  status?: 'sending' | 'sent' | 'error';
  confidence?: number;
  contextUsed?: string[];
}

interface ChatAction extends AIAction {
  // Extend AIAction for backward compatibility
  type: 'execute' | 'view' | 'analyze' | 'generate' | 'update';
  label: string;
  data?: any;
  estimatedTime?: string;
  riskLevel?: 'low' | 'medium' | 'high';
  prerequisites?: string[];
  impacts?: string[];
}

interface UseAutonomousChatReturn {
  messages: Message[];
  sendMessage: (content: string) => Promise<void>;
  executeAction: (action: ChatAction) => Promise<void>;
  clearChat: () => void;
  isLoading: boolean;
  error: string | null;
}


// Enhanced context building
const buildThandoContext = (
  projectType: string,
  projectId?: string,
  navigationStore?: any
): ThandoContext => {
  // Get all projects first
  const allProjects = projectType === 'portfolio' 
    ? UnifiedWorkspaceDataService.getPortfolioAssetsAsProjects()
    : UnifiedWorkspaceDataService.getThandoProjects();

  // Filter to selected project if projectId is provided, otherwise use all projects
  const contextProjects = projectId 
    ? allProjects.filter(project => project.id === projectId)
    : allProjects;

  return {
    currentModule: projectType as any,
    currentPage: window.location.pathname,
    navigationMode: navigationStore?.currentMode?.mode || 'autonomous',
    userId: 'demo-user-001',
    userRole: 'vice-president',
    userPreferences: {
      preferredAnalysisDepth: 'detailed',
      communicationStyle: 'conversational',
      defaultTimeframe: '1Y',
      focusAreas: ['technology', 'healthcare', 'growth-equity'],
      notificationFrequency: 'daily',
      preferredChartTypes: ['line', 'bar', 'pie'],
      riskTolerance: 'medium'
    },
    activeProjects: contextProjects,
    activeDeals: contextProjects.map(project => ({
      id: project.id + '-deal',
      name: project.name.replace('Due Diligence', 'Acquisition').replace('Investment Committee', 'Investment'),
      status: project.status === 'active' ? 'due-diligence' : project.status === 'review' ? 'negotiation' : 'sourcing',
      dealValue: project.metadata?.dealValue || 50000000,
      equity: (project.metadata?.dealValue || 50000000) * 0.8,
      debt: (project.metadata?.dealValue || 50000000) * 0.2,
      sector: project.metadata?.sector || 'Technology',
      geography: project.metadata?.geography || 'North America',
      stage: project.metadata?.stage || 'growth',
      targetReturns: { irr: 25, multiple: 3.2 },
      timeline: {
        sourceDate: new Date(project.lastActivity.getTime() - 30 * 24 * 60 * 60 * 1000),
        ddStartDate: new Date(project.lastActivity.getTime() - 15 * 24 * 60 * 60 * 1000),
        expectedCloseDate: project.deadline || new Date(Date.now() + 60 * 24 * 60 * 60 * 1000)
      },
      team: {
        lead: project.teamMembers[0] || 'Team Lead',
        analyst: project.teamMembers.slice(1, 2),
        advisors: ['Industry Expert', 'Technical Consultant']
      },
      keyMetrics: {
        revenue: (project.metadata?.dealValue || 50000000) * 0.3,
        ebitda: (project.metadata?.dealValue || 50000000) * 0.09,
        ebitdaMargin: 0.30,
        growthRate: project.metadata?.stage === 'growth' ? 0.45 : 0.18
      }
    })),
    portfolioMetrics: {
      totalAUM: 3880000000,
      totalValue: 3880000000,
      netIRR: 18.5,
      grossIRR: 22.3,
      totalValueMultiple: 2.4,
      distributionsToDate: 1200000000,
      unrealizedValue: 2680000000,
      cashFlow: {
        quarterlyDistributions: 75000000,
        quarterlyContributions: 150000000,
        netCashFlow: -75000000
      },
      performance: {
        ytdReturn: 12.5,
        quarterlyReturn: 3.8,
        benchmarkComparison: 2.1
      }
    },
    recentActivity: contextProjects.map((project, index) => ({
      id: `act-${index + 1}`,
      type: projectType === 'portfolio' ? 'portfolio_change' : 
            project.type === 'due-diligence' ? 'deal_update' : 
            project.type === 'ic-preparation' ? 'investment_update' : 
            project.type === 'portfolio-monitoring' ? 'portfolio_change' : 'project_update',
      title: projectType === 'portfolio' 
        ? `${project.name} - Performance Update`
        : `${project.name} - ${project.metadata?.progress || 50}% Complete`,
      description: projectType === 'portfolio'
        ? `Portfolio asset showing ${project.metadata?.irr ? (project.metadata.irr * 100).toFixed(1) + '% IRR' : 'strong performance'} with ${project.metadata?.riskRating || 'medium'} risk profile`
        : project.type === 'due-diligence' ? 'Due diligence analysis in progress with latest findings' :
          project.type === 'ic-preparation' ? 'Investment committee preparation materials being finalized' :
          project.type === 'portfolio-monitoring' ? 'Portfolio performance review and optimization ongoing' :
          'Project analysis and recommendations being developed',
      timestamp: project.lastActivity,
      userId: 'portfolio-manager',
      entityId: project.id,
      entityType: projectType === 'portfolio' ? 'asset' : 
                  project.type === 'due-diligence' ? 'deal' : 
                  project.type === 'portfolio-monitoring' ? 'portfolio' : 'project',
      impact: project.priority === 'high' || project.priority === 'critical' ? 'high' : 
              project.priority === 'low' ? 'low' : 'medium',
      actionRequired: project.status === 'active' && (project.priority === 'high' || project.priority === 'critical')
    })),
    conversationHistory: [],
    availableActions: [], // Will be populated by API
    currentCapabilities: {
      proactiveInsights: true,
      automaticAnalysis: true,
      smartSuggestions: true,
      contextualRecommendations: true,
      realTimeAlerts: true,
      documentAnalysis: true,
      functionCalling: true
    },
    platformData: {
      totalPortfolios: 8,
      totalDeals: 24,
      teamSize: 15,
      lastLogin: new Date(Date.now() - 3600000),
      systemAlerts: [],
      marketConditions: {
        sentiment: 'neutral',
        volatilityIndex: 18.5,
        keyTrends: ['Rising interest rates', 'AI/ML adoption', 'ESG focus']
      }
    },
    timeContext: {
      currentQuarter: 'Q4 2024',
      fiscalYearEnd: new Date('2024-12-31'),
      lastReportingDate: new Date('2024-09-30'),
      upcomingDeadlines: [
        {
          type: 'Investment Committee Meeting',
          date: new Date(Date.now() + 604800000),
          description: 'Review HealthCo investment decision'
        }
      ]
    }
  };
};

export function useAutonomousChat(
  projectId?: string,
  projectType: 'dashboard' | 'portfolio' | 'due-diligence' | 'workspace' | 'deal-screening' = 'dashboard'
): UseAutonomousChatReturn {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messageIdCounter = useRef(0);
  const { currentMode } = useNavigationStore();

  const generateMessageId = () => {
    messageIdCounter.current += 1;
    return `msg-${messageIdCounter.current}-${Date.now()}`;
  };

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;

    const userMessage: Message = {
      id: generateMessageId(),
      content,
      role: 'user',
      timestamp: new Date(),
      status: 'sent'
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    try {
      // Build comprehensive context for Claude
      const context = buildThandoContext(projectType, projectId, { currentMode });
      
      // Prepare Claude request
      const claudeRequest: ClaudeRequest = {
        message: content,
        context,
        options: {
          includeActions: true,
          maxTokens: 4096,
          temperature: 0.1
        }
      };

      // Call Claude API
      const response = await fetch('/api/thando/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(claudeRequest),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const claudeResponse: ClaudeResponse = await response.json();
      
      const assistantMessage: Message = {
        id: generateMessageId(),
        content: claudeResponse.content,
        role: 'assistant',
        timestamp: new Date(),
        actions: claudeResponse.actions,
        status: 'sent',
        confidence: claudeResponse.confidence,
        contextUsed: claudeResponse.contextUsed
      };

      setMessages(prev => [...prev, assistantMessage]);
      
      // Store conversation in context for future reference
      context.conversationHistory.push({
        id: userMessage.id,
        content: userMessage.content,
        role: 'user',
        timestamp: userMessage.timestamp,
        status: 'sent'
      });
      
      context.conversationHistory.push({
        id: assistantMessage.id,
        content: assistantMessage.content,
        role: 'assistant',
        timestamp: assistantMessage.timestamp,
        actions: assistantMessage.actions,
        status: 'sent'
      });

    } catch (err) {
      console.error('Error sending message:', err);
      setError('Failed to send message. Please try again.');
      
      // Remove the user message if there was an error
      setMessages(prev => prev.filter(msg => msg.id !== userMessage.id));
    } finally {
      setIsLoading(false);
    }
  }, [projectId, projectType, currentMode]);

  const executeAction = useCallback(async (action: ChatAction) => {
    setIsLoading(true);
    setError(null);

    // Add user message showing the action being executed
    const actionMessage: Message = {
      id: generateMessageId(),
      content: `Executing: ${action.name || action.label}`,
      role: 'user',
      timestamp: new Date(),
      status: 'sent'
    };

    setMessages(prev => [...prev, actionMessage]);

    try {
      // In a real implementation, this would call specific APIs
      // For demo, we'll simulate realistic action execution
      const executionTime = action.estimatedDuration === 'Instant' ? 500 : 
                           action.estimatedTime?.includes('minute') ? 2000 : 1500;
      
      await new Promise(resolve => setTimeout(resolve, executionTime));

      let confirmationContent = '';
      
      // Generate realistic confirmation based on action type
      switch (action.name) {
        case 'update_dashboard_metrics':
          confirmationContent = `✅ **Dashboard Updated Successfully**

**Metrics Updated:**
• Portfolio performance indicators refreshed
• Latest deal pipeline status integrated
• Q4 2024 performance data synchronized

**Changes Applied:**
${action.impacts?.map(impact => `• ${impact}`).join('\n') || '• Dashboard metrics updated with latest data'}

The executive dashboard now reflects the most current portfolio performance and deal status information.`;
          break;
          
        case 'generate_investment_memo':
          confirmationContent = `✅ **Investment Memo Generated**

**Memo Details:**
• **Deal**: TechCorp Due Diligence ($50M Technology sector)
• **Type**: ${action.inputSchema?.template_type || 'Due Diligence Report'}
• **Pages**: 15-20 pages with comprehensive analysis
• **Work Product ID**: wp-1

**Sections Included:**
• Executive Summary (TechCorp growth potential)
• Investment Thesis (Mid-market CRM leadership)
• Market Analysis (Technology sector)
• Financial Projections ($50M deal value)
• Risk Assessment (Medium risk rating)
• Team Recommendations (4 team members)

📄 The memo has been linked to TechCorp Due Diligence project and shared with Sarah Chen, Mike Rodriguez, Alex Johnson, and Lisa Park.

💡 **You can now view this document in the Documents section of the right panel, or click "View Work Product" to open it.`;
          break;
          
        case 'analyze_portfolio_performance':
          confirmationContent = `✅ **Portfolio Analysis Complete**

**Analysis Period**: ${action.inputSchema?.time_period || 'Q4 2024'}

**Active Projects Analyzed:**
• TechCorp Due Diligence: $50M, Technology, 75% complete, Medium risk
• HealthCo Investment Committee: $125M, Healthcare, 90% complete, Low risk
• RetailCo Deal Screening: $35M, Retail, 45% complete, Medium risk
• Manufacturing Portfolio Review: $80M, Manufacturing, 20% complete, Low risk

**Key Findings:**
• Total deal pipeline: $290M across 4 active projects
• Technology and Healthcare sectors leading
• Average completion: 57.5% across all projects
• Team utilization: 21 members across projects

📊 Full analysis integrates with workspace project data and team assignments.`;
          break;

        case 'screen_investment_opportunity':
          confirmationContent = `✅ **Deal Screening Complete**

**Opportunity Analyzed:**
• SaaS Startup Pipeline: $25M Series A, Technology sector
• Screening Criteria: Series A, North America, Technology focus
• Team: Alex Thompson, Rachel Martinez, Kevin Liu, Sarah Park

**Screening Results:**
• **Score**: 75/100 (Medium-High potential)
• **Risk Rating**: Medium
• **Sector Fit**: Strong (Technology focus area)
• **Stage Alignment**: Series A target range
• **Geographic Fit**: North America preferred

**Key Findings:**
• Strong revenue growth (45% YoY)
• Competitive SaaS metrics (LTV/CAC ratio)
• Experienced management team
• Moderate competition risk

📄 Screening report has been added to SaaS Pipeline project (wp-6) and shared with screening team members.`;
          break;
          
        default:
          confirmationContent = `✅ **Action "${action.label}" Completed Successfully**

${action.description || 'The requested action has been executed.'}

**Results:**
${action.impacts?.map(impact => `• ${impact}`).join('\n') || '• Action completed as requested'}

**Next Steps:**
You can view the results in the relevant section of the application. If you need further analysis or have questions about the results, please let me know.`;
      }

      const confirmationMessage: Message = {
        id: generateMessageId(),
        content: confirmationContent,
        role: 'assistant',
        timestamp: new Date(),
        status: 'sent',
        confidence: 0.95
      };

      setMessages(prev => [...prev, confirmationMessage]);
      
    } catch (err) {
      console.error('Error executing action:', err);
      setError('Failed to execute action. Please try again.');
      
      const errorMessage: Message = {
        id: generateMessageId(),
        content: `❌ **Action Failed**\n\nThere was an error executing "${action.label}". Please try again or contact support if the issue persists.\n\n**Error Details**: ${err instanceof Error ? err.message : 'Unknown error'}`,
        role: 'assistant',
        timestamp: new Date(),
        status: 'error'
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearChat = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  return {
    messages,
    sendMessage,
    executeAction,
    clearChat,
    isLoading,
    error
  };
}