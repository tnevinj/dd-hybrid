/**
 * AI-Powered Risk Analysis Engine
 * Implements intelligent risk scoring, pattern matching, and mitigation strategies
 */

export interface RiskPattern {
  id: string
  name: string
  description: string
  indicators: string[]
  historicalSuccess: number
  mitigationStrategies: MitigationStrategy[]
  industries: string[]
  dealTypes: string[]
  confidenceThreshold: number
}

export interface MitigationStrategy {
  id: string
  name: string
  description: string
  estimatedCost: number
  estimatedTime: number
  successRate: number
  complexity: 'low' | 'medium' | 'high'
  requirements: string[]
  risks: string[]
  benefits: string[]
}

export interface RiskAnalysisResult {
  riskId: string
  calculatedScore: number
  confidence: number
  contributingFactors: RiskFactor[]
  matchedPatterns: RiskPattern[]
  recommendedMitigations: MitigationStrategy[]
  industryBenchmark: number
  riskTrend: 'increasing' | 'stable' | 'decreasing'
  urgencyLevel: 'low' | 'medium' | 'high' | 'critical'
}

export interface RiskFactor {
  category: string
  weight: number
  score: number
  description: string
  dataSource: string
}

// Industry benchmarks for risk scoring
const INDUSTRY_BENCHMARKS = {
  'saas': {
    customerConcentration: 0.35,
    marginDecline: 0.15,
    churnRate: 0.08,
    techDebt: 0.25
  },
  'ecommerce': {
    customerConcentration: 0.45,
    marginDecline: 0.20,
    seasonality: 0.30,
    logisticsRisk: 0.15
  },
  'manufacturing': {
    supplierConcentration: 0.40,
    regulatoryCompliance: 0.25,
    equipmentAge: 0.35,
    laborCosts: 0.20
  },
  'healthcare': {
    regulatoryCompliance: 0.15,
    patientConcentration: 0.30,
    staffRetention: 0.25,
    techObsolescence: 0.20
  }
}

// Pre-defined risk patterns from historical deal analysis
const RISK_PATTERNS: RiskPattern[] = [
  {
    id: 'customer-concentration',
    name: 'Customer Concentration Risk',
    description: 'High dependency on few customers creating revenue vulnerability',
    indicators: [
      'top3_customers_revenue_pct > 50',
      'largest_customer_revenue_pct > 25',
      'customer_churn_trend > industry_avg'
    ],
    historicalSuccess: 0.78,
    mitigationStrategies: [],
    industries: ['saas', 'manufacturing', 'services'],
    dealTypes: ['acquisition', 'growth_equity'],
    confidenceThreshold: 0.85
  },
  {
    id: 'margin-compression',
    name: 'Margin Compression Pattern',
    description: 'Declining profitability margins over multiple periods',
    indicators: [
      'ebitda_margin_trend < -5',
      'gross_margin_decline > 2_years',
      'cost_inflation > revenue_growth'
    ],
    historicalSuccess: 0.65,
    mitigationStrategies: [],
    industries: ['manufacturing', 'retail', 'saas'],
    dealTypes: ['acquisition', 'distressed'],
    confidenceThreshold: 0.80
  },
  {
    id: 'key-person-dependency',
    name: 'Key Person Dependency',
    description: 'Over-reliance on specific individuals for business operations',
    indicators: [
      'founder_ownership > 50',
      'single_decision_maker',
      'limited_management_depth'
    ],
    historicalSuccess: 0.72,
    mitigationStrategies: [],
    industries: ['all'],
    dealTypes: ['acquisition', 'growth_equity'],
    confidenceThreshold: 0.75
  }
]

// AI Risk Scoring Algorithm
export class AIRiskEngine {
  private patterns: RiskPattern[]
  private industryBenchmarks: Record<string, Record<string, number>>

  constructor() {
    this.patterns = RISK_PATTERNS
    this.industryBenchmarks = INDUSTRY_BENCHMARKS
  }

  /**
   * Calculate AI-powered risk score using multiple factors and pattern matching
   */
  calculateRiskScore(riskData: any, companyData: any, industryContext: string): RiskAnalysisResult {
    const contributingFactors = this.analyzeRiskFactors(riskData, companyData, industryContext)
    const matchedPatterns = this.matchPatterns(riskData, companyData, industryContext)
    
    // Base score calculation using weighted factors
    const baseScore = this.calculateBaseScore(contributingFactors)
    
    // Pattern-based adjustments
    const patternAdjustment = this.calculatePatternAdjustment(matchedPatterns)
    
    // Industry benchmark comparison
    const benchmarkAdjustment = this.calculateBenchmarkAdjustment(riskData, industryContext)
    
    // Final score calculation
    const calculatedScore = Math.min(10, Math.max(0, 
      baseScore + patternAdjustment + benchmarkAdjustment
    ))

    // Confidence calculation based on data quality and pattern matches
    const confidence = this.calculateConfidence(contributingFactors, matchedPatterns)
    
    // Risk trend analysis
    const riskTrend = this.analyzeRiskTrend(riskData, companyData)
    
    // Urgency level determination
    const urgencyLevel = this.determineUrgency(calculatedScore, riskTrend, matchedPatterns)
    
    // Industry benchmark
    const industryBenchmark = this.getIndustryBenchmark(riskData.category, industryContext)
    
    // Mitigation recommendations
    const recommendedMitigations = this.recommendMitigations(matchedPatterns, riskData)

    return {
      riskId: riskData.id,
      calculatedScore,
      confidence,
      contributingFactors,
      matchedPatterns,
      recommendedMitigations,
      industryBenchmark,
      riskTrend,
      urgencyLevel
    }
  }

  private analyzeRiskFactors(riskData: any, companyData: any, industryContext: string): RiskFactor[] {
    const factors: RiskFactor[] = []
    
    // Financial factors
    if (riskData.category === 'financial') {
      factors.push({
        category: 'Financial Performance',
        weight: 0.4,
        score: this.scoreFinancialHealth(companyData.financials),
        description: 'Overall financial health and trend analysis',
        dataSource: 'financial_statements'
      })
    }
    
    // Operational factors
    if (riskData.category === 'operational') {
      factors.push({
        category: 'Operational Efficiency',
        weight: 0.35,
        score: this.scoreOperationalEfficiency(companyData.operations),
        description: 'Process efficiency and scalability assessment',
        dataSource: 'operational_metrics'
      })
    }
    
    // Market factors
    factors.push({
      category: 'Market Position',
      weight: 0.25,
      score: this.scoreMarketPosition(companyData.market, industryContext),
      description: 'Competitive position and market dynamics',
      dataSource: 'market_analysis'
    })
    
    return factors
  }

  private matchPatterns(riskData: any, companyData: any, industryContext: string): RiskPattern[] {
    return this.patterns.filter(pattern => {
      // Check if pattern applies to industry
      if (!pattern.industries.includes(industryContext) && !pattern.industries.includes('all')) {
        return false
      }
      
      // Check pattern indicators
      const matchScore = this.evaluatePatternIndicators(pattern.indicators, riskData, companyData)
      return matchScore >= pattern.confidenceThreshold
    })
  }

  private calculateBaseScore(factors: RiskFactor[]): number {
    return factors.reduce((score, factor) => {
      return score + (factor.score * factor.weight)
    }, 0)
  }

  private calculatePatternAdjustment(patterns: RiskPattern[]): number {
    if (patterns.length === 0) return 0
    
    // Higher pattern matches increase risk score
    const patternRisk = patterns.reduce((risk, pattern) => {
      return risk + (1 - pattern.historicalSuccess) * 2
    }, 0)
    
    return Math.min(2, patternRisk) // Cap at +2 points
  }

  private calculateBenchmarkAdjustment(riskData: any, industryContext: string): number {
    const benchmark = this.getIndustryBenchmark(riskData.category, industryContext)
    if (!benchmark) return 0
    
    // Compare current risk level to industry benchmark
    const currentLevel = riskData.currentValue || 0
    const deviation = (currentLevel - benchmark) / benchmark
    
    // Adjust score based on deviation from benchmark
    return Math.max(-1, Math.min(1.5, deviation * 2))
  }

  private calculateConfidence(factors: RiskFactor[], patterns: RiskPattern[]): number {
    let confidence = 0.5 // Base confidence
    
    // Increase confidence with more data factors
    confidence += Math.min(0.3, factors.length * 0.1)
    
    // Increase confidence with pattern matches
    confidence += Math.min(0.2, patterns.length * 0.05)
    
    // Data source quality adjustment
    const hasReliableData = factors.some(f => 
      f.dataSource === 'financial_statements' || f.dataSource === 'audited_reports'
    )
    if (hasReliableData) confidence += 0.1
    
    return Math.min(1, confidence)
  }

  private analyzeRiskTrend(riskData: any, companyData: any): 'increasing' | 'stable' | 'decreasing' {
    // Simple trend analysis based on historical data
    if (!riskData.historicalData || riskData.historicalData.length < 2) {
      return 'stable'
    }
    
    const recent = riskData.historicalData.slice(-3)
    const trend = recent[recent.length - 1] - recent[0]
    
    if (trend > 0.5) return 'increasing'
    if (trend < -0.5) return 'decreasing'
    return 'stable'
  }

  private determineUrgency(score: number, trend: 'increasing' | 'stable' | 'decreasing', patterns: RiskPattern[]): 'low' | 'medium' | 'high' | 'critical' {
    if (score >= 8 || (score >= 6 && trend === 'increasing')) return 'critical'
    if (score >= 6 || patterns.length >= 2) return 'high'
    if (score >= 4 || trend === 'increasing') return 'medium'
    return 'low'
  }

  private getIndustryBenchmark(category: string, industry: string): number {
    const benchmarks = this.industryBenchmarks[industry]
    if (!benchmarks) return 5 // Default mid-range
    
    return benchmarks[category] ? benchmarks[category] * 10 : 5
  }

  private recommendMitigations(patterns: RiskPattern[], riskData: any): MitigationStrategy[] {
    const strategies: MitigationStrategy[] = []
    
    // Add pattern-based mitigations
    patterns.forEach(pattern => {
      strategies.push(...pattern.mitigationStrategies)
    })
    
    // Add general mitigations based on risk category
    if (riskData.category === 'commercial') {
      strategies.push({
        id: 'diversification-plan',
        name: 'Customer Diversification Strategy',
        description: 'Develop systematic approach to reduce customer concentration',
        estimatedCost: 150000,
        estimatedTime: 180, // days
        successRate: 0.75,
        complexity: 'medium',
        requirements: ['Sales team expansion', 'Marketing investment', 'Product positioning'],
        risks: ['Customer acquisition costs', 'Longer sales cycles'],
        benefits: ['Reduced dependency risk', 'Stable revenue base', 'Higher valuation']
      })
    }
    
    return strategies
  }

  // Helper scoring methods
  private scoreFinancialHealth(financials: any): number {
    if (!financials) return 5
    
    let score = 5 // Base score
    
    // Revenue growth
    if (financials.revenueGrowth > 0.2) score += 1
    else if (financials.revenueGrowth < 0) score -= 2
    
    // Profitability
    if (financials.ebitdaMargin > 0.2) score += 1
    else if (financials.ebitdaMargin < 0.1) score -= 1
    
    // Cash flow
    if (financials.freeCashFlow > 0) score += 0.5
    else score -= 1
    
    return Math.max(0, Math.min(10, score))
  }

  private scoreOperationalEfficiency(operations: any): number {
    if (!operations) return 5
    
    let score = 5 // Base score
    
    // Process automation
    if (operations.automationLevel > 0.7) score += 1
    else if (operations.automationLevel < 0.3) score -= 1
    
    // Scalability
    if (operations.scalabilityScore > 7) score += 1
    else if (operations.scalabilityScore < 4) score -= 1
    
    return Math.max(0, Math.min(10, score))
  }

  private scoreMarketPosition(market: any, industry: string): number {
    if (!market) return 5
    
    let score = 5 // Base score
    
    // Market share
    if (market.marketShare > 0.1) score += 1
    else if (market.marketShare < 0.02) score -= 1
    
    // Competitive advantage
    if (market.competitiveAdvantage === 'strong') score += 1
    else if (market.competitiveAdvantage === 'weak') score -= 1
    
    return Math.max(0, Math.min(10, score))
  }

  private evaluatePatternIndicators(indicators: string[], riskData: any, companyData: any): number {
    // Simplified indicator evaluation
    // In a real implementation, this would parse and evaluate the indicator expressions
    return Math.random() * 0.3 + 0.7 // Mock evaluation returning 0.7-1.0
  }
}

// Export singleton instance
export const aiRiskEngine = new AIRiskEngine()

// Utility functions for risk analysis
export const RiskAnalysisUtils = {
  /**
   * Generate risk recommendations based on analysis results
   */
  generateRecommendations(analysisResult: RiskAnalysisResult): string[] {
    const recommendations: string[] = []
    
    if (analysisResult.urgencyLevel === 'critical') {
      recommendations.push('Immediate management attention required')
      recommendations.push('Consider deal-breaker evaluation')
    }
    
    if (analysisResult.calculatedScore > analysisResult.industryBenchmark + 2) {
      recommendations.push('Significantly above industry benchmark - requires mitigation')
    }
    
    if (analysisResult.riskTrend === 'increasing') {
      recommendations.push('Risk trending upward - monitor closely')
    }
    
    return recommendations
  },

  /**
   * Format risk score for display
   */
  formatRiskScore(score: number): { score: string, color: string, label: string } {
    if (score >= 8) return { score: score.toFixed(1), color: 'red', label: 'Critical' }
    if (score >= 6) return { score: score.toFixed(1), color: 'orange', label: 'High' }
    if (score >= 4) return { score: score.toFixed(1), color: 'yellow', label: 'Medium' }
    return { score: score.toFixed(1), color: 'green', label: 'Low' }
  },

  /**
   * Calculate time savings from AI automation
   */
  calculateTimeSavings(baseline: number, aiEfficiency: number): number {
    return baseline * (1 - aiEfficiency)
  }
}