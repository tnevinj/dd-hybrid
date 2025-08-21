import { CrossModuleIntelligenceEngine } from './cross-module-intelligence'

// Decision Support Framework Types
export interface DecisionContext {
  dealId?: string
  moduleContext: 'portfolio' | 'due-diligence' | 'legal' | 'deal-screening' | 'fund-operations' | 'investment-committee'
  decisionType: 'investment' | 'exit' | 'risk-management' | 'compliance' | 'operational' | 'strategic'
  urgency: 'low' | 'medium' | 'high' | 'critical'
  stakeholders: string[]
  dataInputs: Record<string, any>
}

export interface DecisionRecommendation {
  id: string
  recommendation: string
  confidence: number
  reasoning: string[]
  supportingEvidence: Array<{
    source: string
    metric: string
    value: any
    weight: number
  }>
  risks: Array<{
    type: string
    probability: number
    impact: string
    mitigation: string
  }>
  alternatives: Array<{
    option: string
    pros: string[]
    cons: string[]
    score: number
  }>
  timeline: {
    immediate: string[]
    shortTerm: string[]
    longTerm: string[]
  }
  requiredApprovals: string[]
  estimatedImpact: {
    financial: number
    operational: number
    strategic: number
  }
}

export interface DecisionWorkflow {
  id: string
  name: string
  steps: Array<{
    id: string
    name: string
    description: string
    requiredInputs: string[]
    outputs: string[]
    automated: boolean
    estimatedTime: number
  }>
  dependencies: string[]
  approvalGates: Array<{
    step: string
    approvers: string[]
    criteria: string[]
  }>
}

export class DecisionSupportFramework {
  private crossModuleEngine: CrossModuleIntelligenceEngine
  private decisionHistory: DecisionRecommendation[] = []
  
  constructor() {
    this.crossModuleEngine = new CrossModuleIntelligenceEngine()
  }

  async generateRecommendation(context: DecisionContext): Promise<DecisionRecommendation> {
    const moduleAnalytics = await this.crossModuleEngine.generateCrossModuleInsights()
    
    const recommendation: DecisionRecommendation = {
      id: `decision-${Date.now()}`,
      recommendation: await this.analyzeDecisionContext(context),
      confidence: this.calculateConfidence(context, moduleAnalytics),
      reasoning: await this.generateReasoning(context, moduleAnalytics),
      supportingEvidence: await this.gatherEvidence(context, moduleAnalytics),
      risks: await this.assessRisks(context),
      alternatives: await this.generateAlternatives(context),
      timeline: await this.createTimeline(context),
      requiredApprovals: this.determineApprovals(context),
      estimatedImpact: await this.estimateImpact(context)
    }

    this.decisionHistory.push(recommendation)
    return recommendation
  }

  private async analyzeDecisionContext(context: DecisionContext): Promise<string> {
    switch (context.decisionType) {
      case 'investment':
        return await this.generateInvestmentRecommendation(context)
      case 'exit':
        return await this.generateExitRecommendation(context)
      case 'risk-management':
        return await this.generateRiskRecommendation(context)
      case 'compliance':
        return await this.generateComplianceRecommendation(context)
      case 'operational':
        return await this.generateOperationalRecommendation(context)
      case 'strategic':
        return await this.generateStrategicRecommendation(context)
      default:
        return 'Comprehensive analysis required across multiple decision factors'
    }
  }

  private async generateInvestmentRecommendation(context: DecisionContext): Promise<string> {
    const dealData = context.dataInputs
    const marketAnalysis = await this.crossModuleEngine.generateMarketInsights()
    
    if (dealData.irr > 20 && dealData.riskScore < 3 && marketAnalysis.marketTiming === 'favorable') {
      return 'RECOMMEND INVESTMENT: Strong financial metrics with favorable market conditions'
    } else if (dealData.irr > 15 && dealData.riskScore < 4) {
      return 'CONDITIONAL RECOMMEND: Good metrics but requires risk mitigation strategies'
    } else {
      return 'RECOMMEND PASS: Financial metrics or risk profile do not meet investment criteria'
    }
  }

  private async generateExitRecommendation(context: DecisionContext): Promise<string> {
    const portfolioData = context.dataInputs
    const marketConditions = await this.crossModuleEngine.generateMarketInsights()
    
    if (portfolioData.currentValuation > portfolioData.targetValuation * 1.2 && marketConditions.exitEnvironment === 'favorable') {
      return 'RECOMMEND IMMEDIATE EXIT: Target exceeded with favorable exit environment'
    } else if (portfolioData.holdPeriod > 5 && portfolioData.growthTrend === 'declining') {
      return 'RECOMMEND STRATEGIC EXIT: Consider exit due to declining performance and extended hold period'
    } else {
      return 'RECOMMEND HOLD: Continue value creation initiatives'
    }
  }

  private async generateRiskRecommendation(context: DecisionContext): Promise<string> {
    const riskData = context.dataInputs
    
    if (riskData.aggregatedRisk > 8) {
      return 'IMMEDIATE ACTION REQUIRED: Implement comprehensive risk mitigation plan'
    } else if (riskData.aggregatedRisk > 6) {
      return 'HEIGHTENED MONITORING: Increase risk oversight and reporting frequency'
    } else {
      return 'MAINTAIN CURRENT POSTURE: Risk levels within acceptable parameters'
    }
  }

  private async generateComplianceRecommendation(context: DecisionContext): Promise<string> {
    const complianceData = context.dataInputs
    
    if (complianceData.criticalViolations > 0) {
      return 'CRITICAL COMPLIANCE ACTION: Address violations immediately to prevent regulatory issues'
    } else if (complianceData.pendingDeadlines > 5) {
      return 'COMPLIANCE ACCELERATION: Prioritize pending regulatory requirements'
    } else {
      return 'MAINTAIN COMPLIANCE SCHEDULE: Current compliance posture is adequate'
    }
  }

  private async generateOperationalRecommendation(context: DecisionContext): Promise<string> {
    const opData = context.dataInputs
    
    if (opData.efficiency < 0.7) {
      return 'OPERATIONAL IMPROVEMENT REQUIRED: Implement process optimization initiatives'
    } else if (opData.capacity > 0.9) {
      return 'CAPACITY EXPANSION: Consider resource allocation or team expansion'
    } else {
      return 'OPTIMIZE CURRENT OPERATIONS: Fine-tune existing processes for enhanced performance'
    }
  }

  private async generateStrategicRecommendation(context: DecisionContext): Promise<string> {
    const strategicData = context.dataInputs
    const marketInsights = await this.crossModuleEngine.generateMarketInsights()
    
    if (marketInsights.marketTrend === 'bullish' && strategicData.competitivePosition === 'strong') {
      return 'AGGRESSIVE GROWTH STRATEGY: Capitalize on favorable market conditions and competitive advantages'
    } else if (marketInsights.marketTrend === 'bearish') {
      return 'DEFENSIVE STRATEGY: Focus on portfolio protection and selective investments'
    } else {
      return 'BALANCED STRATEGY: Maintain diversified approach with measured growth initiatives'
    }
  }

  private calculateConfidence(context: DecisionContext, analytics: any): number {
    let baseConfidence = 0.7
    
    // Adjust based on data quality
    const dataQuality = Object.keys(context.dataInputs).length / 10
    baseConfidence += Math.min(dataQuality * 0.1, 0.2)
    
    // Adjust based on urgency (less time = lower confidence)
    if (context.urgency === 'critical') baseConfidence -= 0.1
    if (context.urgency === 'low') baseConfidence += 0.1
    
    // Adjust based on cross-module consistency
    if (analytics.consistencyScore > 0.8) baseConfidence += 0.1
    
    return Math.min(Math.max(baseConfidence, 0.1), 0.99)
  }

  private async generateReasoning(context: DecisionContext, analytics: any): Promise<string[]> {
    const reasoning = []
    
    // Add module-specific insights
    reasoning.push(`Cross-module analysis shows ${analytics.fundGrade} overall fund performance`)
    reasoning.push(`Market conditions are ${analytics.marketTiming} for ${context.decisionType} decisions`)
    
    // Add context-specific reasoning
    if (context.decisionType === 'investment') {
      reasoning.push('Investment metrics exceed threshold requirements')
      reasoning.push('Risk-adjusted returns align with fund strategy')
    }
    
    if (context.urgency === 'critical') {
      reasoning.push('Time-sensitive decision requires immediate action')
    }
    
    return reasoning
  }

  private async gatherEvidence(context: DecisionContext, analytics: any): Promise<Array<{source: string, metric: string, value: any, weight: number}>> {
    return [
      {
        source: 'Portfolio Management',
        metric: 'Portfolio Performance',
        value: analytics.portfolioMetrics?.irr || '15.2%',
        weight: 0.3
      },
      {
        source: 'Due Diligence',
        metric: 'Risk Assessment',
        value: context.dataInputs.riskScore || 3.2,
        weight: 0.25
      },
      {
        source: 'Market Intelligence',
        metric: 'Market Timing',
        value: analytics.marketTiming || 'Favorable',
        weight: 0.2
      },
      {
        source: 'Legal Management',
        metric: 'Compliance Status',
        value: context.dataInputs.complianceScore || 'Green',
        weight: 0.15
      },
      {
        source: 'Fund Operations',
        metric: 'Operational Efficiency',
        value: context.dataInputs.efficiency || '87%',
        weight: 0.1
      }
    ]
  }

  private async assessRisks(context: DecisionContext): Promise<Array<{type: string, probability: number, impact: string, mitigation: string}>> {
    return [
      {
        type: 'Market Risk',
        probability: 0.3,
        impact: 'Moderate negative impact on valuation',
        mitigation: 'Implement hedging strategies and diversification'
      },
      {
        type: 'Execution Risk',
        probability: 0.2,
        impact: 'Potential delays in value creation',
        mitigation: 'Establish clear milestones and monitoring frameworks'
      },
      {
        type: 'Regulatory Risk',
        probability: 0.15,
        impact: 'Compliance costs and operational constraints',
        mitigation: 'Proactive regulatory engagement and compliance monitoring'
      }
    ]
  }

  private async generateAlternatives(context: DecisionContext): Promise<Array<{option: string, pros: string[], cons: string[], score: number}>> {
    const alternatives = []
    
    if (context.decisionType === 'investment') {
      alternatives.push({
        option: 'Full Investment',
        pros: ['Maximum upside potential', 'Strong market position'],
        cons: ['Higher risk exposure', 'Significant capital commitment'],
        score: 8.2
      })
      
      alternatives.push({
        option: 'Phased Investment',
        pros: ['Risk mitigation', 'Flexibility to adjust'],
        cons: ['Reduced upside', 'Complexity in execution'],
        score: 7.5
      })
      
      alternatives.push({
        option: 'Pass',
        pros: ['Capital preservation', 'Wait for better opportunities'],
        cons: ['Missed opportunity', 'Idle capital'],
        score: 5.0
      })
    }
    
    return alternatives
  }

  private async createTimeline(context: DecisionContext): Promise<{immediate: string[], shortTerm: string[], longTerm: string[]}> {
    return {
      immediate: [
        'Finalize decision framework',
        'Secure stakeholder alignment',
        'Initiate implementation planning'
      ],
      shortTerm: [
        'Execute approved strategy',
        'Monitor key performance indicators',
        'Adjust based on early results'
      ],
      longTerm: [
        'Evaluate strategic outcomes',
        'Incorporate learnings for future decisions',
        'Optimize decision-making processes'
      ]
    }
  }

  private determineApprovals(context: DecisionContext): string[] {
    const approvals = []
    
    if (context.decisionType === 'investment' && context.dataInputs.dealValue > 100000000) {
      approvals.push('Investment Committee', 'General Partner', 'Limited Partner Advisory Committee')
    } else if (context.urgency === 'critical') {
      approvals.push('Managing Director', 'Risk Committee')
    } else {
      approvals.push('Managing Director')
    }
    
    return approvals
  }

  private async estimateImpact(context: DecisionContext): Promise<{financial: number, operational: number, strategic: number}> {
    // Impact scores from 1-10
    return {
      financial: context.decisionType === 'investment' ? 8.5 : 
                context.decisionType === 'exit' ? 9.0 : 6.0,
      operational: context.decisionType === 'operational' ? 8.0 : 
                  context.urgency === 'critical' ? 7.0 : 5.0,
      strategic: context.decisionType === 'strategic' ? 9.0 : 
                context.decisionType === 'investment' ? 7.5 : 4.0
    }
  }

  // Decision Workflow Management
  async createDecisionWorkflow(decisionType: string): Promise<DecisionWorkflow> {
    const workflows: Record<string, DecisionWorkflow> = {
      investment: {
        id: 'investment-workflow',
        name: 'Investment Decision Workflow',
        steps: [
          {
            id: 'initial-screening',
            name: 'Initial Deal Screening',
            description: 'Preliminary assessment of investment opportunity',
            requiredInputs: ['deal_summary', 'financial_highlights', 'market_overview'],
            outputs: ['screening_score', 'go_no_go_recommendation'],
            automated: true,
            estimatedTime: 4
          },
          {
            id: 'due-diligence',
            name: 'Comprehensive Due Diligence',
            description: 'Detailed analysis of all aspects of the investment',
            requiredInputs: ['financial_statements', 'management_interviews', 'market_analysis'],
            outputs: ['dd_report', 'risk_assessment', 'valuation_model'],
            automated: false,
            estimatedTime: 40
          },
          {
            id: 'investment-committee',
            name: 'Investment Committee Review',
            description: 'Formal IC presentation and decision',
            requiredInputs: ['dd_report', 'investment_memo', 'term_sheet'],
            outputs: ['ic_decision', 'approved_terms', 'conditions_precedent'],
            automated: false,
            estimatedTime: 8
          }
        ],
        dependencies: ['legal-review', 'compliance-check'],
        approvalGates: [
          {
            step: 'initial-screening',
            approvers: ['Deal Partner'],
            criteria: ['Meets minimum IRR threshold', 'Aligns with fund strategy']
          },
          {
            step: 'investment-committee',
            approvers: ['Investment Committee Members'],
            criteria: ['Unanimous approval for >$100M', 'Majority for <$100M']
          }
        ]
      },
      exit: {
        id: 'exit-workflow',
        name: 'Exit Decision Workflow',
        steps: [
          {
            id: 'exit-readiness',
            name: 'Exit Readiness Assessment',
            description: 'Evaluate portfolio company readiness for exit',
            requiredInputs: ['company_performance', 'market_conditions', 'strategic_alternatives'],
            outputs: ['readiness_score', 'optimal_timing', 'exit_strategy'],
            automated: true,
            estimatedTime: 8
          },
          {
            id: 'exit-execution',
            name: 'Exit Process Execution',
            description: 'Manage the exit process from preparation to closing',
            requiredInputs: ['exit_strategy', 'company_preparation', 'market_positioning'],
            outputs: ['exit_proceeds', 'realized_returns', 'lessons_learned'],
            automated: false,
            estimatedTime: 120
          }
        ],
        dependencies: ['portfolio-optimization', 'market-analysis'],
        approvalGates: [
          {
            step: 'exit-readiness',
            approvers: ['Portfolio Manager', 'Deal Partner'],
            criteria: ['Company performance meets exit criteria', 'Market timing is favorable']
          }
        ]
      }
    }
    
    return workflows[decisionType] || workflows.investment
  }

  // Performance Analytics
  getDecisionAnalytics(): any {
    return {
      totalDecisions: this.decisionHistory.length,
      averageConfidence: this.decisionHistory.reduce((acc, d) => acc + d.confidence, 0) / this.decisionHistory.length,
      decisionsByType: this.decisionHistory.reduce((acc, d) => {
        const context = d.recommendation.includes('INVESTMENT') ? 'investment' : 
                       d.recommendation.includes('EXIT') ? 'exit' : 'other'
        acc[context] = (acc[context] || 0) + 1
        return acc
      }, {} as Record<string, number>),
      successRate: 0.85, // This would be calculated based on actual outcomes
      averageImpact: {
        financial: this.decisionHistory.reduce((acc, d) => acc + d.estimatedImpact.financial, 0) / this.decisionHistory.length,
        operational: this.decisionHistory.reduce((acc, d) => acc + d.estimatedImpact.operational, 0) / this.decisionHistory.length,
        strategic: this.decisionHistory.reduce((acc, d) => acc + d.estimatedImpact.strategic, 0) / this.decisionHistory.length
      }
    }
  }
}

export default DecisionSupportFramework