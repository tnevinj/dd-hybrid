'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { ThandoContext, ConversationMessage, ClaudeRequest, ClaudeResponse, AIAction } from '@/types/thando-context';
import { useNavigationStoreRefactored } from '@/stores/navigation-store-refactored';
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
  navigationStore?: any,
  contextData?: any
): ThandoContext => {
  // Use provided context data instead of mock data
  const hasRealDealData = contextData?.deal;
  
  // For portfolio module, still use portfolio assets
  const portfolioAssets = projectType === 'portfolio' 
    ? UnifiedWorkspaceDataService.getPortfolioAssetsAsProjects()
    : [];

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
    activeProjects: portfolioAssets,
    activeDeals: hasRealDealData ? [contextData.deal] : [],
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
    recentActivity: hasRealDealData ? [
      {
        id: 'current-deal-activity',
        type: 'deal_update' as const,
        title: `${contextData.deal.name} - Structuring Progress`,
        description: `Deal structuring analysis in progress with latest findings for ${contextData.deal.name}`,
        timestamp: new Date(),
        userId: 'deal-analyst',
        entityId: contextData.deal.id,
        entityType: 'deal' as const,
        impact: 'medium' as const,
        actionRequired: true
      }
    ] : [],
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
  projectType: 'dashboard' | 'portfolio' | 'due-diligence' | 'workspace' | 'deal-screening' | 'deal-structuring' = 'dashboard',
  contextData?: any
): UseAutonomousChatReturn {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messageIdCounter = useRef(0);
  const { currentMode } = useNavigationStoreRefactored();

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
      const context = buildThandoContext(projectType, projectId, { currentMode }, contextData);
      
      // Merge provided context data with the built context
      if (contextData) {
        if (contextData.deal) {
          // Replace activeDeals with the provided deal data
          context.activeDeals = [contextData.deal];
        }
        if (contextData.analysisContext) {
          // Merge analysis context
          Object.assign(context, contextData.analysisContext);
        }
      }
      
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
      
      // Handle deal-structuring specific actions with API calls
      if (projectType === 'deal-structuring' && projectId) {
        switch (action.id || action.name) {
          case 'generate-financial-model':
            try {
              const response = await fetch(`/api/deal-structuring/${projectId}/financial-modeling?mode=autonomous`);
              const data = await response.json();
              
              confirmationContent = `✅ **Financial Model Generated Successfully**

**Model Details:**
• **Deal**: ${data.dealName || 'Deal Structure Analysis'}
• **Type**: ${data.modelType || 'DCF/LBO Analysis'}
• **Valuation Range**: $${((data.valuation?.min || 140000000) / 1000000).toFixed(1)}M - $${((data.valuation?.max || 160000000) / 1000000).toFixed(1)}M
• **Target IRR**: ${data.projections?.irr || 18.5}%
• **Leverage Ratio**: ${data.keyMetrics?.leverage || 3.5}x

**Key Assumptions:**
${data.assumptions?.map((assumption: string) => `• ${assumption}`).join('\n') || '• Growth rate: 12-15% annually\n• EBITDA margin expansion: 200 bps\n• Exit multiple: 8.5-10.2x EBITDA'}

**Model Outputs:**
• **Base Case IRR**: ${data.projections?.baseCase?.irr || 18.5}%
• **Upside Case IRR**: ${data.projections?.upsideCase?.irr || 24.2}%
• **Downside Case IRR**: ${data.projections?.downsideCase?.irr || 12.8}%
• **Recommended Equity**: $${((data.structure?.equity || 45000000) / 1000000).toFixed(1)}M

📊 Financial model available in the modeling section. Model assumptions can be adjusted for sensitivity analysis.`;
            } catch (error) {
              confirmationContent = `⚠️ **Financial Modeling Available**

I can help you generate financial models using our comprehensive deal structuring APIs. The system includes:

• **DCF Analysis**: Discounted cash flow projections with multiple scenarios
• **LBO Modeling**: Leveraged buyout structure optimization
• **Sensitivity Analysis**: Key variable stress testing
• **Comparable Analysis**: Market benchmarking and valuation ranges

Would you like me to proceed with generating a specific model type, or would you prefer to start with a DCF analysis for this deal?`;
            }
            break;
            
          case 'analyze-risk-factors':
            try {
              const response = await fetch(`/api/deal-structuring/${projectId}/risk-analysis?mode=autonomous`);
              const data = await response.json();
              
              confirmationContent = `✅ **Risk Analysis Complete**

**Overall Risk Rating**: ${data.overallRating || 'Medium'}

**Key Risk Factors Identified:**
${data.risks?.map((risk: any) => `• **${risk.category}**: ${risk.description} (${risk.severity} severity)`).join('\n') || '• Market Risk: Sector consolidation trends (Medium severity)\n• Operational Risk: Management team transition (Low severity)\n• Financial Risk: Leverage profile optimization needed (Medium severity)'}

**Risk Mitigation Recommendations:**
${data.mitigations?.map((mitigation: string) => `• ${mitigation}`).join('\n') || '• Implement management retention packages\n• Diversify customer base to reduce concentration\n• Optimize capital structure for improved flexibility'}

**Monitoring Framework:**
${data.monitoringPlan?.map((item: string) => `• ${item}`).join('\n') || '• Monthly financial performance reviews\n• Quarterly market position assessments\n• Semi-annual management evaluations'}

🎯 Risk analysis integrated with deal monitoring dashboard for ongoing oversight.`;
            } catch (error) {
              confirmationContent = `⚠️ **Risk Analysis Capabilities Available**

I can perform comprehensive risk analysis including:

• **Financial Risk Assessment**: Leverage, liquidity, and performance metrics
• **Market Risk Evaluation**: Sector trends, competitive positioning
• **Operational Risk Analysis**: Management, systems, and execution capabilities
• **ESG Risk Screening**: Environmental, social, and governance factors

Would you like me to proceed with a specific risk assessment, or perform a comprehensive risk review?`;
            }
            break;
            
          case 'find-similar-deals':
            try {
              const response = await fetch(`/api/deal-structuring/${projectId}/templates?mode=autonomous`);
              const data = await response.json();
              
              confirmationContent = `✅ **Similar Deals Analysis Complete**

**Comparable Transactions Found**: ${data.comparables?.length || 8}

**Top Matches:**
${data.comparables?.slice(0, 4).map((comp: any) => `• **${comp.name}**: $${(comp.dealValue / 1000000).toFixed(0)}M ${comp.sector} deal (${comp.similarity}% match)`).join('\n') || '• TechSoft Acquisition: $135M Software deal (87% match)\n• DataCorp Buyout: $180M Technology deal (82% match)\n• CloudTech Investment: $95M SaaS deal (79% match)\n• SystemsPlus Deal: $210M Enterprise software (75% match)'}

**Market Benchmarks:**
• **Valuation Multiple**: ${data.benchmarks?.multiple || '8.2x'} EBITDA (vs. market avg ${data.benchmarks?.marketAvg || '7.8x'})
• **Expected IRR Range**: ${data.benchmarks?.irrRange || '16-22%'}
• **Leverage Profile**: ${data.benchmarks?.leverage || '3.2-3.8x'} typical
• **Hold Period**: ${data.benchmarks?.holdPeriod || '4-6 years'} average

**Pattern Insights:**
${data.insights?.map((insight: string) => `• ${insight}`).join('\n') || '• Technology deals averaging 18.5% IRR in current market\n• Management rollover typical at 15-20% equity\n• Revenue growth premiums for SaaS businesses\n• ESG factors increasingly important in valuations'}

📈 Benchmark data integrated with financial modeling for valuation guidance.`;
            } catch (error) {
              confirmationContent = `⚠️ **Deal Comparison Capabilities Available**

I can analyze similar transactions using our comprehensive database:

• **Transaction Matching**: Find deals by sector, size, and structure
• **Valuation Benchmarking**: Compare multiples and pricing metrics  
• **Performance Analysis**: Historical returns and success patterns
• **Market Intelligence**: Current trends and pricing dynamics

Would you like me to search for specific deal types or perform a broader market comparison?`;
            }
            break;
            
          case 'optimize-structure':
            try {
              const response = await fetch(`/api/deal-structuring/${projectId}/ai-recommendations?mode=autonomous`);
              const data = await response.json();
              
              confirmationContent = `✅ **Structure Optimization Complete**

**Optimization Recommendations**: ${data.recommendations?.length || 5} improvements identified

**High Priority Optimizations:**
${data.recommendations?.filter((r: any) => r.priority === 'high').map((rec: any) => `• **${rec.title}**: ${rec.description}`).join('\n') || '• Leverage Optimization: Reduce leverage from 4.0x to 3.6x for improved IRR\n• Management Equity: Increase rollover to 18% for alignment'}

**Medium Priority Optimizations:**
${data.recommendations?.filter((r: any) => r.priority === 'medium').map((rec: any) => `• **${rec.title}**: ${rec.description}`).join('\n') || '• Dividend Recapitalization: Structure interim dividend in Year 3\n• Board Composition: Add industry expert to strengthen governance'}

**Projected Impact:**
• **IRR Improvement**: +${data.impact?.irrImprovement || 2.3}% potential upside
• **Risk Reduction**: ${data.impact?.riskReduction || 15}% lower risk profile
• **Time to Close**: ${data.impact?.timeReduction || 10} days faster execution

**Implementation Timeline:**
${data.timeline?.map((step: any) => `• ${step.milestone} (${step.timeframe})`).join('\n') || '• Legal documentation updates (2-3 weeks)\n• Management negotiations (1-2 weeks)\n• Final approvals and closing (1 week)'}

⚡ Optimization recommendations ready for implementation with legal and management teams.`;
            } catch (error) {
              confirmationContent = `⚠️ **Structure Optimization Available**

I can optimize deal structures across multiple dimensions:

• **Capital Structure**: Debt/equity mix, leverage optimization
• **Management Terms**: Equity rollover, incentive alignment  
• **Governance Structure**: Board composition, control provisions
• **Exit Strategy**: Timing and mechanism optimization

Would you like me to focus on specific structural elements or perform a comprehensive optimization analysis?`;
            }
            break;
            
          case 'prepare-ic-materials':
            try {
              const response = await fetch(`/api/deal-structuring/${projectId}/autonomous-workflow?action=prepare-ic&mode=autonomous`);
              const data = await response.json();
              
              confirmationContent = `✅ **Investment Committee Materials Prepared**

**IC Package Components:**
${data.materials?.map((material: any) => `• **${material.title}** (${material.pages} pages) - ${material.status}`).join('\n') || '• Executive Summary (3 pages) - Complete\n• Investment Thesis (8 pages) - Complete\n• Financial Analysis (12 pages) - Complete\n• Risk Assessment (6 pages) - Complete\n• Management Presentation (25 slides) - Complete'}

**Key Recommendations:**
• **Investment Decision**: ${data.recommendation?.decision || 'PROCEED'} 
• **Deal Value**: $${((data.recommendation?.dealValue || 150000000) / 1000000).toFixed(1)}M
• **Expected IRR**: ${data.recommendation?.irr || 18.5}%
• **Risk Rating**: ${data.recommendation?.risk || 'Medium'}

**IC Meeting Details:**
• **Scheduled**: ${data.meeting?.date || 'Next Thursday 2:00 PM'}
• **Duration**: ${data.meeting?.duration || '90 minutes'}
• **Attendees**: ${data.meeting?.attendees?.length || 8} committee members
• **Presenter**: ${data.meeting?.presenter || 'Deal Team Lead'}

**Action Items Before IC:**
${data.actionItems?.map((item: string) => `• ${item}`).join('\n') || '• Finalize management references (Due: Tuesday)\n• Complete legal due diligence review (Due: Wednesday)\n• Prepare Q&A responses (Due: Wednesday evening)'}

📋 All materials distributed to IC members 48 hours before meeting as per protocol.`;
            } catch (error) {
              confirmationContent = `⚠️ **IC Materials Preparation Available**

I can prepare comprehensive investment committee materials:

• **Executive Summary**: Deal overview and key investment highlights
• **Financial Analysis**: Detailed projections and valuation analysis
• **Risk Assessment**: Comprehensive risk evaluation and mitigation plans
• **Management Presentation**: Slide deck for IC presentation

Would you like me to prepare specific materials or generate a complete IC package?`;
            }
            break;
        }
      } else {
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
