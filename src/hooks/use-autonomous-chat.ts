'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { ThandoContext, ConversationMessage, ClaudeRequest, ClaudeResponse, AIAction } from '@/types/thando-context';
import { useNavigationStore } from '@/stores/navigation-store';

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
  // This would typically be populated from actual app state
  // For now, providing realistic demo data
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
    activeProjects: [
      {
        id: 'proj-1',
        name: 'TechCorp Due Diligence',
        type: 'due-diligence',
        status: 'active',
        priority: 'high',
        progress: 75,
        teamMembers: ['Sarah Chen', 'Mike Rodriguez', 'Alex Johnson'],
        lastActivity: new Date(Date.now() - 86400000),
        metadata: {
          dealValue: 50000000,
          sector: 'Technology',
          stage: 'growth',
          riskRating: 'medium',
          confidenceScore: 0.85
        }
      },
      {
        id: 'proj-2',
        name: 'HealthCo Investment Committee',
        type: 'report',
        status: 'review',
        priority: 'high',
        progress: 90,
        teamMembers: ['Jennifer Park', 'David Kim'],
        lastActivity: new Date(Date.now() - 43200000),
        deadline: new Date(Date.now() + 604800000),
        metadata: {
          dealValue: 125000000,
          sector: 'Healthcare',
          stage: 'buyout',
          riskRating: 'low'
        }
      }
    ],
    activeDeals: [
      {
        id: 'deal-1',
        name: 'TechCorp Acquisition',
        status: 'due-diligence',
        dealValue: 50000000,
        equity: 40000000,
        debt: 10000000,
        sector: 'Technology',
        geography: 'North America',
        stage: 'growth',
        targetReturns: { irr: 25, multiple: 3.2 },
        timeline: {
          sourceDate: new Date('2024-09-15'),
          ddStartDate: new Date('2024-10-01'),
          expectedCloseDate: new Date('2024-12-15')
        },
        team: {
          lead: 'Sarah Chen',
          analyst: ['Mike Rodriguez'],
          advisors: ['Industry Expert 1', 'Tech Consultant']
        },
        keyMetrics: {
          revenue: 15000000,
          ebitda: 4500000,
          ebitdaMargin: 0.30,
          growthRate: 0.45
        }
      },
      {
        id: 'deal-2',
        name: 'HealthCo Investment',
        status: 'negotiation',
        dealValue: 125000000,
        equity: 100000000,
        debt: 25000000,
        sector: 'Healthcare',
        geography: 'North America',
        stage: 'buyout',
        targetReturns: { irr: 22, multiple: 2.8 },
        timeline: {
          sourceDate: new Date('2024-08-01'),
          ddStartDate: new Date('2024-09-01'),
          expectedCloseDate: new Date('2024-11-30')
        },
        team: {
          lead: 'Jennifer Park',
          analyst: ['David Kim'],
          advisors: ['Healthcare Expert', 'Regulatory Consultant']
        },
        keyMetrics: {
          revenue: 35000000,
          ebitda: 8750000,
          ebitdaMargin: 0.25,
          growthRate: 0.18
        }
      }
    ],
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
    recentActivity: [
      {
        id: 'act-1',
        type: 'deal_update',
        title: 'TechCorp DD Phase 2 Complete',
        description: 'Financial and technical due diligence completed, moving to final negotiations',
        timestamp: new Date(Date.now() - 86400000),
        userId: 'sarah-chen',
        entityId: 'deal-1',
        entityType: 'deal',
        impact: 'high',
        actionRequired: true
      },
      {
        id: 'act-2',
        type: 'portfolio_change',
        title: 'Q3 Portfolio Performance Update',
        description: 'Portfolio outperformed benchmark by 2.1%, driven by technology sector',
        timestamp: new Date(Date.now() - 172800000),
        userId: 'system',
        entityId: 'portfolio-main',
        entityType: 'portfolio',
        impact: 'medium',
        actionRequired: false
      }
    ],
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
• **Deal**: ${action.inputSchema?.deal_id || 'Selected Deal'}
• **Type**: ${action.inputSchema?.template_type || 'Full Memo'}
• **Pages**: 15-20 pages with comprehensive analysis

**Sections Included:**
• Executive Summary
• Investment Thesis
• Market Analysis
• Financial Projections
• Risk Assessment
• Investment Committee Recommendation

📄 The memo has been saved to the workspace and shared with relevant team members.`;
          break;
          
        case 'analyze_portfolio_performance':
          confirmationContent = `✅ **Portfolio Analysis Complete**

**Analysis Period**: ${action.inputSchema?.time_period || 'Q4 2024'}

**Key Findings:**
• Net IRR: 18.5% (vs 16.2% benchmark)
• Technology sector leading with 24% returns
• Healthcare showing strong resilience
• 3 deals ready for potential exit in Q1 2025

**Report Generated:**
• 25-page detailed analysis
• Sector performance breakdown
• Individual asset analysis
• Risk assessment summary

📊 Full analysis report is available in the portfolio dashboard.`;
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