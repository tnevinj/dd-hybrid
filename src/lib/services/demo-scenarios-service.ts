/**
 * Enhanced Demo Scenarios Service
 * Provides intelligent, context-aware demo responses for Thando Assistant
 */

import { ThandoContext, DemoScenario, ClaudeResponse, AIAction } from '@/types/thando-context';

export class DemoScenariosService {
  private scenarios: DemoScenario[] = [
    {
      id: 'portfolio-performance-analysis',
      name: 'Portfolio Performance Analysis',
      description: 'Comprehensive portfolio performance review with actionable insights',
      triggers: ['portfolio performance', 'how is our portfolio', 'portfolio analysis', 'performance review'],
      context: {},
      expectedResponses: [
        {
          weight: 0.6,
          content: `**Q4 2024 Portfolio Performance Summary**

I've analyzed your current portfolio performance across all key metrics:

**Financial Performance:**
• **Total Portfolio Value**: $3.88B (up 8.3% from Q3)
• **Net IRR**: 18.5% (vs 16.2% industry benchmark)
• **Total Value Multiple**: 2.4x (strong performance vs 2.1x target)
• **YTD Return**: 12.5% (outperforming market by 420 bps)

**Sector Performance Leaders:**
• **Technology**: 24% returns (driven by AI/ML companies)
• **Healthcare**: 19% returns (resilient growth post-COVID)
• **Industrial**: 15% returns (benefiting from infrastructure spend)

**Deal Spotlight:**
• **TechCorp**: On track for 25% IRR (vs 20% target)
• **HealthCo**: Strong EBITDA growth at 18% annually
• **RetailCo**: Successful digital transformation showing results

**Key Insights:**
• 3 portfolio companies ready for potential exits in Q1 2025
• Strong cash generation across technology holdings
• ESG initiatives driving premium valuations

**Risk Factors:**
• Rising interest rates impacting some leveraged positions
• Technology sector showing some volatility
• Regulatory changes in healthcare requiring monitoring

The portfolio is well-positioned entering 2025. Would you like me to prepare detailed reports for any specific sectors or deals?`,
          actions: [
            {
              id: 'generate-quarterly-report',
              name: 'generate_quarterly_report',
              description: 'Generate comprehensive Q4 2024 LP report',
              category: 'reporting',
              inputSchema: { quarter: 'Q4_2024', include_projections: true },
              estimatedDuration: '3-5 minutes',
              riskLevel: 'low',
              prerequisites: [],
              impacts: ['Quarterly LP report generated', 'Performance analysis completed', 'Stakeholder summary prepared'],
              availability: { modules: ['portfolio', 'dashboard'], userRoles: ['all'] }
            },
            {
              id: 'schedule-lp-meeting',
              name: 'schedule_stakeholder_meeting',
              description: 'Schedule LP update meeting for Q4 results',
              category: 'execution',
              inputSchema: { meeting_type: 'quarterly_review', urgency: 'medium' },
              estimatedDuration: '1-2 minutes',
              riskLevel: 'low',
              prerequisites: [],
              impacts: ['Meeting scheduled', 'Calendar invites sent', 'Agenda prepared'],
              availability: { modules: ['portfolio', 'dashboard'], userRoles: ['partner', 'vice-president'] }
            }
          ],
          followUps: [
            'Would you like to dive deeper into technology sector performance?',
            'Should I analyze exit opportunities for Q1 2025?',
            'Do you want me to prepare risk mitigation strategies?'
          ]
        }
      ],
      complexity: 'moderate',
      moduleRelevance: ['portfolio', 'dashboard']
    },
    {
      id: 'deal-analysis-techcorp',
      name: 'TechCorp Deal Analysis',
      description: 'Deep dive analysis of TechCorp acquisition opportunity',
      triggers: ['techcorp', 'techcorp deal', 'techcorp analysis', 'analyze techcorp'],
      context: {},
      expectedResponses: [
        {
          weight: 0.8,
          content: `**TechCorp Acquisition - Comprehensive Analysis**

I've conducted a thorough analysis of the TechCorp opportunity based on our due diligence findings:

**Deal Overview:**
• **Valuation**: $50M (4.2x Revenue, 11.1x EBITDA)
• **Structure**: $40M equity + $10M debt financing
• **Our Investment**: $25M for 62.5% stake
• **Expected IRR**: 25-28% (vs 20% hurdle)
• **Projected Multiple**: 3.2x over 5 years

**Business Fundamentals:**
• **Revenue**: $15M (45% CAGR over 3 years)
• **EBITDA**: $4.5M (30% margin, expanding)
• **Market Position**: Leading AI-powered SaaS platform
• **Customer Base**: 250+ enterprise clients, 98% retention
• **Recurring Revenue**: 85% of total revenue

**Investment Thesis Validation:**
✅ **Market Opportunity**: TAM of $12B, growing at 28% annually
✅ **Competitive Moat**: Proprietary AI algorithms, 18-month lead
✅ **Management Team**: Proven track record, previous exit at $200M
✅ **Financial Performance**: Rule of 40 score of 75%

**Due Diligence Status:**
• **Financial DD**: Complete ✅ (PwC confirmed numbers)
• **Technical DD**: Complete ✅ (Architecture review passed)
• **Commercial DD**: Complete ✅ (Customer references strong)
• **Legal DD**: 95% complete (minor IP items remaining)

**Key Risk Factors:**
• **Competition**: Large tech companies entering space
• **Key Person Risk**: CTO critical to product development
• **Market Risk**: Economic downturn could impact enterprise spending

**Recommendation:**
**PROCEED TO INVESTMENT COMMITTEE** - Deal meets all investment criteria with strong risk-adjusted returns. Recommend negotiating slightly better terms on liquidation preference.`,
          actions: [
            {
              id: 'generate-ic-memo',
              name: 'generate_investment_memo',
              description: 'Generate comprehensive IC memo for TechCorp deal',
              category: 'reporting',
              inputSchema: { 
                deal_id: 'techcorp-deal-1', 
                template_type: 'full_memo',
                include_comparables: true,
                sections: ['executive_summary', 'investment_thesis', 'market_analysis', 'financial_projections', 'risk_assessment', 'recommendation']
              },
              estimatedDuration: '5-7 minutes',
              riskLevel: 'low',
              prerequisites: [],
              impacts: ['IC memo generated', 'Financial models attached', 'Risk analysis included'],
              availability: { modules: ['deal-screening', 'due-diligence'], userRoles: ['analyst', 'associate', 'vice-president', 'partner'] }
            },
            {
              id: 'schedule-ic-meeting',
              name: 'schedule_stakeholder_meeting',
              description: 'Schedule Investment Committee meeting for TechCorp',
              category: 'execution',
              inputSchema: { 
                meeting_type: 'investment_committee',
                attendees: ['partners', 'investment_team', 'advisors'],
                agenda_items: ['TechCorp deal review', 'Financial projections', 'Risk assessment', 'Vote'],
                urgency: 'high'
              },
              estimatedDuration: '2 minutes',
              riskLevel: 'low',
              prerequisites: ['IC memo completion'],
              impacts: ['IC meeting scheduled', 'Materials distributed', 'Voting process initiated'],
              availability: { modules: ['deal-screening', 'due-diligence'], userRoles: ['partner', 'vice-president'] }
            }
          ],
          followUps: [
            'Should I prepare comparable deal analysis?',
            'Would you like me to model different valuation scenarios?',
            'Do you want me to create a negotiation strategy document?'
          ]
        }
      ],
      complexity: 'complex',
      moduleRelevance: ['deal-screening', 'due-diligence', 'workspace']
    },
    {
      id: 'risk-assessment-portfolio',
      name: 'Portfolio Risk Assessment',
      description: 'Comprehensive risk analysis across portfolio holdings',
      triggers: ['risk assessment', 'portfolio risk', 'risk analysis', 'what are our risks'],
      context: {},
      expectedResponses: [
        {
          weight: 0.7,
          content: `**Portfolio Risk Assessment - Q4 2024**

I've conducted a comprehensive risk analysis across our $3.88B portfolio:

**Overall Risk Profile: MODERATE**
*Risk-adjusted returns remain strong with manageable exposure levels*

**Sector Risk Analysis:**

**🔴 HIGH RISK AREAS:**
• **Interest Rate Exposure**: 35% of portfolio leveraged (avg 3.2x debt/EBITDA)
  - Impact: $850M in deals sensitive to rate increases
  - Mitigation: 60% have rate caps through 2025

**🟡 MEDIUM RISK AREAS:**
• **Technology Concentration**: 40% of portfolio in tech sector
  - Diversification risk but strong fundamentals
  - Regulatory scrutiny on AI companies increasing
• **Key Person Dependencies**: 
  - 3 companies heavily dependent on founder-CEOs
  - Succession planning in progress for 2 companies

**🟢 LOW RISK AREAS:**
• **Healthcare Portfolio**: Recession-resistant, strong cash flows
• **Geographic Diversification**: Well-balanced across regions
• **ESG Compliance**: 95% of portfolio meets ESG standards

**Quantitative Risk Metrics:**
• **Portfolio Beta**: 1.15 (slightly higher than market)
• **Value at Risk (95%)**: $185M over 12 months
• **Stress Test Results**: Portfolio can withstand 20% market decline
• **Liquidity Coverage**: 18 months operating expenses covered

**Emerging Risk Factors:**
• **Geopolitical Tensions**: Supply chain impacts on industrial holdings
• **Regulatory Changes**: New PE regulations in development
• **Cyber Security**: Increased threats to portfolio companies

**Risk Mitigation Strategies:**
• Enhanced monitoring of leveraged positions
• Accelerated digital transformation initiatives
• Expanded insurance coverage across portfolio
• Regular stress testing and scenario planning

**Immediate Actions Required:**
1. Review debt covenants for 3 highly leveraged deals
2. Implement enhanced cybersecurity protocols
3. Diversify technology sector exposure in new deals

Would you like me to deep-dive into any specific risk area or create mitigation plans?`,
          actions: [
            {
              id: 'generate-risk-report',
              name: 'generate_risk_assessment_report',
              description: 'Generate detailed risk assessment report with mitigation strategies',
              category: 'reporting',
              inputSchema: { 
                scope: 'full_portfolio',
                include_stress_tests: true,
                mitigation_plans: true
              },
              estimatedDuration: '7-10 minutes',
              riskLevel: 'low',
              prerequisites: [],
              impacts: ['Comprehensive risk report generated', 'Mitigation strategies outlined', 'Action items identified'],
              availability: { modules: ['portfolio', 'dashboard'], userRoles: ['all'] }
            },
            {
              id: 'update-risk-monitoring',
              name: 'update_dashboard_metrics',
              description: 'Update risk monitoring dashboard with latest assessments',
              category: 'execution',
              inputSchema: { 
                metrics: 'risk_indicators',
                alerts: true,
                notifications: true
              },
              estimatedDuration: '2 minutes',
              riskLevel: 'low',
              prerequisites: [],
              impacts: ['Risk dashboard updated', 'Alert thresholds set', 'Monitoring enhanced'],
              availability: { modules: ['portfolio', 'dashboard'], userRoles: ['analyst', 'associate', 'vice-president', 'partner'] }
            }
          ],
          followUps: [
            'Should I create specific mitigation plans for high-risk areas?',
            'Would you like stress test scenarios for different market conditions?',
            'Do you want me to benchmark our risk profile against industry peers?'
          ]
        }
      ],
      complexity: 'complex',
      moduleRelevance: ['portfolio', 'dashboard', 'workspace']
    }
  ];

  /**
   * Find the best matching scenario for a given message and context
   */
  findMatchingScenario(message: string, context: ThandoContext): DemoScenario | null {
    const lowerMessage = message.toLowerCase();
    
    for (const scenario of this.scenarios) {
      for (const trigger of scenario.triggers) {
        if (lowerMessage.includes(trigger.toLowerCase())) {
          // Check if scenario is relevant to current module
          if (scenario.moduleRelevance.includes(context.currentModule)) {
            return scenario;
          }
        }
      }
    }
    
    return null;
  }

  /**
   * Generate a contextual response based on scenario and current context
   */
  generateScenarioResponse(scenario: DemoScenario, context: ThandoContext): ClaudeResponse {
    // Select response based on weight (for now, just take the first one)
    const selectedResponse = scenario.expectedResponses[0];
    
    // Customize response content with actual context data
    let content = selectedResponse.content;
    
    // Replace placeholders with actual context data
    content = content.replace(/\$\{portfolioValue\}/g, `$${(context.portfolioMetrics.totalValue / 1000000000).toFixed(2)}B`);
    content = content.replace(/\$\{netIRR\}/g, `${context.portfolioMetrics.netIRR.toFixed(1)}%`);
    content = content.replace(/\$\{ytdReturn\}/g, `${context.portfolioMetrics.performance.ytdReturn.toFixed(1)}%`);
    
    return {
      content,
      actions: selectedResponse.actions || [],
      confidence: 0.92,
      followUpQuestions: selectedResponse.followUps,
      contextUsed: ['portfolio_metrics', 'active_deals', 'recent_activity', 'market_conditions'],
      processingTime: 1200 + Math.random() * 800 // Realistic processing time
    };
  }

  /**
   * Generate a fallback response when no scenario matches
   */
  generateFallbackResponse(message: string, context: ThandoContext): ClaudeResponse {
    const { currentModule, activeProjects, activeDeals, portfolioMetrics } = context;
    
    return {
      content: `I understand you're asking about "${message}". As your AI assistant, I have comprehensive access to your ${currentModule} data and can help with:

**Current Context:**
• **Active Projects**: ${activeProjects.length} (${activeProjects.filter(p => p.priority === 'high').length} high priority)
• **Deal Pipeline**: ${activeDeals.length} opportunities worth $${(activeDeals.reduce((sum, d) => sum + d.dealValue, 0) / 1000000).toFixed(0)}M
• **Portfolio Performance**: ${portfolioMetrics.performance.ytdReturn.toFixed(1)}% YTD return

**I can help you with:**
• **Deep Analysis**: Portfolio performance, deal evaluation, risk assessment
• **Strategic Insights**: Market analysis, competitive intelligence, trend identification  
• **Action Execution**: Report generation, dashboard updates, meeting scheduling
• **Data Intelligence**: Export reports, create visualizations, track metrics

What specific area would you like to explore? I can provide detailed analysis tailored to your current priorities and objectives.`,
      actions: [
        {
          id: 'show-capabilities',
          name: 'show_detailed_capabilities',
          description: 'Show comprehensive AI capabilities for current module',
          category: 'communication',
          inputSchema: { module: currentModule },
          estimatedDuration: 'Instant',
          riskLevel: 'low',
          prerequisites: [],
          impacts: ['Display capability overview'],
          availability: { modules: ['all'], userRoles: ['all'] }
        },
        {
          id: 'context-summary',
          name: 'provide_context_summary',
          description: 'Provide detailed summary of current business context',
          category: 'analysis',
          inputSchema: { include_metrics: true, include_deals: true },
          estimatedDuration: '1 minute',
          riskLevel: 'low',
          prerequisites: [],
          impacts: ['Context summary provided', 'Key metrics highlighted'],
          availability: { modules: ['all'], userRoles: ['all'] }
        }
      ],
      confidence: 0.85,
      followUpQuestions: [
        'Would you like a portfolio performance summary?',
        'Should I analyze your current deal pipeline?',
        'Do you want insights on market trends affecting your investments?'
      ],
      contextUsed: ['current_module', 'active_projects', 'portfolio_metrics'],
      processingTime: 800
    };
  }
}

// Export singleton instance
export const demoScenariosService = new DemoScenariosService();