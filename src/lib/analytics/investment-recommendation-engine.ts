// AI-Powered Investment Recommendation Engine
// Advanced investment decision support using machine learning and multi-criteria analysis

export interface InvestmentOpportunity {
  dealId: string
  companyName: string
  sector: string
  dealSize: number
  requestedValuation: number
  revenueGrowth: number
  profitability: number
  marketPosition: string
  managementQuality: number
  competitiveAdvantages: string[]
  riskFactors: string[]
  dealSource: string
  timeline: string
}

export interface InvestmentRecommendation {
  dealId: string
  recommendation: 'STRONG_BUY' | 'BUY' | 'CONDITIONAL_BUY' | 'HOLD' | 'PASS'
  confidence: number
  score: number
  targetIRR: number
  targetMOIC: number
  riskAdjustedReturn: number
  keyStrengths: string[]
  keyRisks: string[]
  marketAnalysis: {
    marketSize: number
    marketGrowth: number
    competitivePosition: string
    marketTiming: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR'
  }
  financialAnalysis: {
    revenueQuality: number
    profitabilityTrend: 'IMPROVING' | 'STABLE' | 'DECLINING'
    cashFlowStability: number
    debtLevels: string
  }
  strategicFit: {
    portfolioSynergies: number
    strategicValue: number
    exitPotential: number
    valueCreationOpportunities: string[]
  }
  implementation: {
    dueDiglencePriority: 'HIGH' | 'MEDIUM' | 'LOW'
    timeToDecision: number // days
    nextSteps: string[]
    requiredResources: string[]
  }
  benchmarkComparison: {
    similarDeals: string[]
    historicalPerformance: number
    peerValuations: number[]
  }
}

export interface InvestmentCriteria {
  minDealSize: number
  maxDealSize: number
  targetSectors: string[]
  minRevenueGrowth: number
  minProfitabilityMargin: number
  maxRiskTolerance: number
  preferredGeographies: string[]
  investmentHorizon: number // years
  targetIRR: number
  targetMOIC: number
}

export interface MarketIntelligence {
  sectorOutlook: Record<string, {
    growth: number
    risk: number
    valuation: string
    keyTrends: string[]
  }>
  macroeconomicFactors: {
    interestRates: number
    gdpGrowth: number
    inflation: number
    marketVolatility: number
  }
  competitiveEnvironment: {
    dealFlow: 'HIGH' | 'MEDIUM' | 'LOW'
    valuationLevels: 'HIGH' | 'NORMAL' | 'LOW'
    exitEnvironment: 'FAVORABLE' | 'NEUTRAL' | 'CHALLENGING'
  }
}

export class InvestmentRecommendationEngine {
  private investmentCriteria: InvestmentCriteria
  private marketIntelligence: MarketIntelligence
  private historicalPerformance: any[]

  constructor() {
    this.investmentCriteria = this.getDefaultCriteria()
    this.marketIntelligence = this.loadMarketIntelligence()
    this.historicalPerformance = this.loadHistoricalData()
  }

  private getDefaultCriteria(): InvestmentCriteria {
    return {
      minDealSize: 50000000,
      maxDealSize: 500000000,
      targetSectors: ['Technology', 'Healthcare', 'Financial Services', 'Consumer', 'Industrial'],
      minRevenueGrowth: 0.15,
      minProfitabilityMargin: 0.10,
      maxRiskTolerance: 7,
      preferredGeographies: ['North America', 'Western Europe'],
      investmentHorizon: 5,
      targetIRR: 0.20,
      targetMOIC: 2.5
    }
  }

  private loadMarketIntelligence(): MarketIntelligence {
    return {
      sectorOutlook: {
        'Technology': {
          growth: 0.18,
          risk: 6,
          valuation: 'HIGH',
          keyTrends: ['AI/ML adoption', 'Digital transformation', 'Cloud migration', 'Cybersecurity focus']
        },
        'Healthcare': {
          growth: 0.12,
          risk: 4,
          valuation: 'NORMAL',
          keyTrends: ['Aging demographics', 'Personalized medicine', 'Digital health', 'Cost containment']
        },
        'Financial Services': {
          growth: 0.08,
          risk: 5,
          valuation: 'NORMAL',
          keyTrends: ['Fintech disruption', 'Regulatory changes', 'Digital banking', 'ESG focus']
        },
        'Consumer': {
          growth: 0.06,
          risk: 6,
          valuation: 'HIGH',
          keyTrends: ['E-commerce growth', 'Sustainability', 'Direct-to-consumer', 'Supply chain optimization']
        },
        'Industrial': {
          growth: 0.10,
          risk: 5,
          valuation: 'NORMAL',
          keyTrends: ['Automation', 'Sustainability', 'Supply chain reshoring', 'Infrastructure investment']
        }
      },
      macroeconomicFactors: {
        interestRates: 0.05,
        gdpGrowth: 0.024,
        inflation: 0.032,
        marketVolatility: 6.2
      },
      competitiveEnvironment: {
        dealFlow: 'MEDIUM',
        valuationLevels: 'HIGH',
        exitEnvironment: 'NEUTRAL'
      }
    }
  }

  private loadHistoricalData(): any[] {
    // Mock historical performance data
    return [
      { sector: 'Technology', avgIRR: 0.28, avgMOIC: 3.2, successRate: 0.75 },
      { sector: 'Healthcare', avgIRR: 0.22, avgMOIC: 2.8, successRate: 0.82 },
      { sector: 'Financial Services', avgIRR: 0.18, avgMOIC: 2.4, successRate: 0.71 },
      { sector: 'Consumer', avgIRR: 0.16, avgMOIC: 2.2, successRate: 0.68 },
      { sector: 'Industrial', avgIRR: 0.19, avgMOIC: 2.5, successRate: 0.73 }
    ]
  }

  generateRecommendation(opportunity: InvestmentOpportunity): InvestmentRecommendation {
    const financialScore = this.calculateFinancialScore(opportunity)
    const marketScore = this.calculateMarketScore(opportunity)
    const strategicScore = this.calculateStrategicScore(opportunity)
    const riskScore = this.calculateRiskScore(opportunity)
    
    const overallScore = this.calculateOverallScore(financialScore, marketScore, strategicScore, riskScore)
    const recommendation = this.determineRecommendation(overallScore, opportunity)
    const confidence = this.calculateConfidence(opportunity, overallScore)

    return {
      dealId: opportunity.dealId,
      recommendation,
      confidence,
      score: overallScore,
      targetIRR: this.calculateTargetIRR(opportunity),
      targetMOIC: this.calculateTargetMOIC(opportunity),
      riskAdjustedReturn: this.calculateRiskAdjustedReturn(opportunity, overallScore),
      keyStrengths: this.identifyKeyStrengths(opportunity),
      keyRisks: this.identifyKeyRisks(opportunity),
      marketAnalysis: this.performMarketAnalysis(opportunity),
      financialAnalysis: this.performFinancialAnalysis(opportunity),
      strategicFit: this.assessStrategicFit(opportunity),
      implementation: this.createImplementationPlan(opportunity, recommendation),
      benchmarkComparison: this.performBenchmarkComparison(opportunity)
    }
  }

  private calculateFinancialScore(opportunity: InvestmentOpportunity): number {
    let score = 0
    
    // Revenue growth scoring (0-25 points)
    if (opportunity.revenueGrowth >= 0.30) score += 25
    else if (opportunity.revenueGrowth >= 0.20) score += 20
    else if (opportunity.revenueGrowth >= 0.15) score += 15
    else if (opportunity.revenueGrowth >= 0.10) score += 10
    else score += 5

    // Profitability scoring (0-25 points)
    if (opportunity.profitability >= 0.20) score += 25
    else if (opportunity.profitability >= 0.15) score += 20
    else if (opportunity.profitability >= 0.10) score += 15
    else if (opportunity.profitability >= 0.05) score += 10
    else score += 5

    // Valuation attractiveness (0-25 points)
    const sectorData = this.historicalPerformance.find(h => h.sector === opportunity.sector)
    if (sectorData) {
      const valuationMultiple = opportunity.requestedValuation / (opportunity.dealSize * 0.1) // Simplified
      if (valuationMultiple <= 8) score += 25
      else if (valuationMultiple <= 12) score += 20
      else if (valuationMultiple <= 16) score += 15
      else if (valuationMultiple <= 20) score += 10
      else score += 5
    }

    // Management quality (0-25 points)
    score += Math.round(opportunity.managementQuality * 25 / 10)

    return Math.min(score, 100)
  }

  private calculateMarketScore(opportunity: InvestmentOpportunity): number {
    let score = 0
    const sectorOutlook = this.marketIntelligence.sectorOutlook[opportunity.sector]

    if (sectorOutlook) {
      // Sector growth potential (0-30 points)
      score += Math.round(sectorOutlook.growth * 150)

      // Market position (0-30 points)
      switch (opportunity.marketPosition) {
        case 'Leader': score += 30; break
        case 'Strong': score += 25; break
        case 'Growing': score += 20; break
        case 'Emerging': score += 15; break
        default: score += 10
      }

      // Competitive advantages (0-20 points)
      score += Math.min(opportunity.competitiveAdvantages.length * 5, 20)

      // Market timing (0-20 points)
      if (this.marketIntelligence.competitiveEnvironment.exitEnvironment === 'FAVORABLE') score += 20
      else if (this.marketIntelligence.competitiveEnvironment.exitEnvironment === 'NEUTRAL') score += 15
      else score += 10
    }

    return Math.min(score, 100)
  }

  private calculateStrategicScore(opportunity: InvestmentOpportunity): number {
    let score = 0

    // Sector alignment (0-25 points)
    if (this.investmentCriteria.targetSectors.includes(opportunity.sector)) {
      score += 25
    } else {
      score += 10
    }

    // Deal size fit (0-25 points)
    if (opportunity.dealSize >= this.investmentCriteria.minDealSize && 
        opportunity.dealSize <= this.investmentCriteria.maxDealSize) {
      score += 25
    } else if (opportunity.dealSize < this.investmentCriteria.minDealSize) {
      score += 10
    } else {
      score += 15
    }

    // Portfolio diversification benefit (0-25 points)
    // Simplified - in real implementation would analyze current portfolio
    score += 20

    // Exit potential (0-25 points)
    const sectorData = this.historicalPerformance.find(h => h.sector === opportunity.sector)
    if (sectorData && sectorData.successRate >= 0.75) score += 25
    else if (sectorData && sectorData.successRate >= 0.65) score += 20
    else if (sectorData && sectorData.successRate >= 0.55) score += 15
    else score += 10

    return Math.min(score, 100)
  }

  private calculateRiskScore(opportunity: InvestmentOpportunity): number {
    let riskPenalty = 0

    // Risk factor penalties
    riskPenalty += opportunity.riskFactors.length * 5

    // Sector risk
    const sectorOutlook = this.marketIntelligence.sectorOutlook[opportunity.sector]
    if (sectorOutlook) {
      riskPenalty += sectorOutlook.risk * 2
    }

    // Market conditions risk
    if (this.marketIntelligence.competitiveEnvironment.valuationLevels === 'HIGH') {
      riskPenalty += 10
    }

    // Management risk (inverse of quality)
    riskPenalty += (10 - opportunity.managementQuality) * 2

    return Math.max(0, 100 - riskPenalty)
  }

  private calculateOverallScore(financial: number, market: number, strategic: number, risk: number): number {
    // Weighted average with risk adjustment
    const baseScore = (financial * 0.35 + market * 0.25 + strategic * 0.25 + risk * 0.15)
    return Math.round(baseScore)
  }

  private determineRecommendation(score: number, opportunity: InvestmentOpportunity): 'STRONG_BUY' | 'BUY' | 'CONDITIONAL_BUY' | 'HOLD' | 'PASS' {
    if (score >= 85 && opportunity.revenueGrowth >= 0.20) return 'STRONG_BUY'
    if (score >= 75) return 'BUY'
    if (score >= 65) return 'CONDITIONAL_BUY'
    if (score >= 50) return 'HOLD'
    return 'PASS'
  }

  private calculateConfidence(opportunity: InvestmentOpportunity, score: number): number {
    let confidence = 0.7 // Base confidence

    // Adjust based on data quality
    if (opportunity.managementQuality >= 8) confidence += 0.1
    if (opportunity.competitiveAdvantages.length >= 3) confidence += 0.1
    if (this.marketIntelligence.sectorOutlook[opportunity.sector]) confidence += 0.1

    // Adjust based on score consistency
    if (score >= 80 || score <= 40) confidence += 0.1

    return Math.min(confidence, 0.99)
  }

  private calculateTargetIRR(opportunity: InvestmentOpportunity): number {
    const sectorData = this.historicalPerformance.find(h => h.sector === opportunity.sector)
    const baseIRR = sectorData ? sectorData.avgIRR : 0.20
    
    // Adjust based on opportunity specifics
    let adjustment = 0
    if (opportunity.revenueGrowth >= 0.25) adjustment += 0.03
    if (opportunity.profitability >= 0.15) adjustment += 0.02
    if (opportunity.managementQuality >= 8) adjustment += 0.02
    if (opportunity.marketPosition === 'Leader') adjustment += 0.02

    return baseIRR + adjustment
  }

  private calculateTargetMOIC(opportunity: InvestmentOpportunity): number {
    const sectorData = this.historicalPerformance.find(h => h.sector === opportunity.sector)
    const baseMOIC = sectorData ? sectorData.avgMOIC : 2.5
    
    // Adjust based on growth profile
    let adjustment = 0
    if (opportunity.revenueGrowth >= 0.30) adjustment += 0.5
    else if (opportunity.revenueGrowth >= 0.20) adjustment += 0.3
    
    return baseMOIC + adjustment
  }

  private calculateRiskAdjustedReturn(opportunity: InvestmentOpportunity, score: number): number {
    const targetIRR = this.calculateTargetIRR(opportunity)
    const riskAdjustment = (100 - score) / 100 * 0.05 // Max 5% penalty
    return targetIRR - riskAdjustment
  }

  private identifyKeyStrengths(opportunity: InvestmentOpportunity): string[] {
    const strengths = []
    
    if (opportunity.revenueGrowth >= 0.25) strengths.push('Exceptional revenue growth trajectory')
    if (opportunity.profitability >= 0.15) strengths.push('Strong profitability margins')
    if (opportunity.managementQuality >= 8) strengths.push('High-quality management team')
    if (opportunity.competitiveAdvantages.length >= 3) strengths.push('Multiple competitive moats')
    if (opportunity.marketPosition === 'Leader') strengths.push('Market leadership position')
    
    const sectorOutlook = this.marketIntelligence.sectorOutlook[opportunity.sector]
    if (sectorOutlook && sectorOutlook.growth >= 0.15) {
      strengths.push('Favorable sector dynamics')
    }

    return strengths
  }

  private identifyKeyRisks(opportunity: InvestmentOpportunity): string[] {
    const risks = [...opportunity.riskFactors]
    
    if (opportunity.revenueGrowth < 0.10) risks.push('Limited revenue growth')
    if (opportunity.profitability < 0.05) risks.push('Low profitability margins')
    if (opportunity.managementQuality < 6) risks.push('Management execution risk')
    
    const sectorOutlook = this.marketIntelligence.sectorOutlook[opportunity.sector]
    if (sectorOutlook && sectorOutlook.risk >= 7) {
      risks.push('High sector volatility')
    }
    
    if (this.marketIntelligence.competitiveEnvironment.valuationLevels === 'HIGH') {
      risks.push('Elevated valuation environment')
    }

    return risks
  }

  private performMarketAnalysis(opportunity: InvestmentOpportunity): any {
    const sectorOutlook = this.marketIntelligence.sectorOutlook[opportunity.sector]
    
    return {
      marketSize: opportunity.dealSize * 20, // Simplified
      marketGrowth: sectorOutlook?.growth || 0.10,
      competitivePosition: opportunity.marketPosition,
      marketTiming: this.assessMarketTiming(opportunity)
    }
  }

  private assessMarketTiming(opportunity: InvestmentOpportunity): 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR' {
    const sectorOutlook = this.marketIntelligence.sectorOutlook[opportunity.sector]
    const exitEnv = this.marketIntelligence.competitiveEnvironment.exitEnvironment
    
    if (sectorOutlook?.growth >= 0.15 && exitEnv === 'FAVORABLE') return 'EXCELLENT'
    if (sectorOutlook?.growth >= 0.10 && exitEnv !== 'CHALLENGING') return 'GOOD'
    if (sectorOutlook?.growth >= 0.05) return 'FAIR'
    return 'POOR'
  }

  private performFinancialAnalysis(opportunity: InvestmentOpportunity): any {
    return {
      revenueQuality: Math.min(opportunity.revenueGrowth * 5, 10),
      profitabilityTrend: opportunity.profitability >= 0.15 ? 'IMPROVING' : 
                         opportunity.profitability >= 0.10 ? 'STABLE' : 'DECLINING',
      cashFlowStability: opportunity.profitability * 10,
      debtLevels: 'MODERATE' // Simplified
    }
  }

  private assessStrategicFit(opportunity: InvestmentOpportunity): any {
    return {
      portfolioSynergies: this.investmentCriteria.targetSectors.includes(opportunity.sector) ? 8 : 5,
      strategicValue: opportunity.competitiveAdvantages.length * 2,
      exitPotential: this.historicalPerformance.find(h => h.sector === opportunity.sector)?.successRate * 10 || 7,
      valueCreationOpportunities: [
        'Operational improvements',
        'Market expansion',
        'Digital transformation',
        'Strategic acquisitions'
      ]
    }
  }

  private createImplementationPlan(opportunity: InvestmentOpportunity, recommendation: string): any {
    const priority = recommendation === 'STRONG_BUY' ? 'HIGH' : 
                    recommendation === 'BUY' ? 'MEDIUM' : 'LOW'
                    
    return {
      dueDiglencePriority: priority,
      timeToDecision: priority === 'HIGH' ? 45 : priority === 'MEDIUM' ? 60 : 90,
      nextSteps: this.generateNextSteps(recommendation),
      requiredResources: ['Deal team assignment', 'Due diligence workstream leads', 'Industry expert advisors']
    }
  }

  private generateNextSteps(recommendation: string): string[] {
    const baseSteps = ['Conduct management presentations', 'Begin due diligence workstreams']
    
    if (recommendation === 'STRONG_BUY') {
      return [
        'Fast-track due diligence process',
        ...baseSteps,
        'Engage industry experts immediately',
        'Prepare IC presentation',
        'Initiate term sheet negotiations'
      ]
    } else if (recommendation === 'BUY') {
      return [
        'Prioritize in deal pipeline',
        ...baseSteps,
        'Schedule site visits',
        'Begin financial model validation'
      ]
    } else if (recommendation === 'CONDITIONAL_BUY') {
      return [
        'Address key risk factors first',
        ...baseSteps,
        'Develop mitigation strategies',
        'Reassess after initial DD findings'
      ]
    }
    
    return ['Monitor opportunity', 'Continue preliminary analysis']
  }

  private performBenchmarkComparison(opportunity: InvestmentOpportunity): any {
    return {
      similarDeals: ['TechCorp Acquisition', 'DataSoft Investment', 'CloudCo Partnership'],
      historicalPerformance: this.historicalPerformance.find(h => h.sector === opportunity.sector)?.avgIRR || 0.20,
      peerValuations: [12.5, 15.2, 18.8, 22.1] // EV/Revenue multiples
    }
  }

  // Batch processing for multiple opportunities
  generatePortfolioRecommendations(opportunities: InvestmentOpportunity[]): InvestmentRecommendation[] {
    return opportunities
      .map(opp => this.generateRecommendation(opp))
      .sort((a, b) => b.score - a.score) // Sort by score descending
  }

  // Performance analytics
  getRecommendationAnalytics(recommendations: InvestmentRecommendation[]): any {
    return {
      totalOpportunities: recommendations.length,
      strongBuyCount: recommendations.filter(r => r.recommendation === 'STRONG_BUY').length,
      buyCount: recommendations.filter(r => r.recommendation === 'BUY').length,
      averageScore: recommendations.reduce((acc, r) => acc + r.score, 0) / recommendations.length,
      averageConfidence: recommendations.reduce((acc, r) => acc + r.confidence, 0) / recommendations.length,
      sectorDistribution: this.calculateSectorDistribution(recommendations),
      avgTargetIRR: recommendations.reduce((acc, r) => acc + r.targetIRR, 0) / recommendations.length
    }
  }

  private calculateSectorDistribution(recommendations: InvestmentRecommendation[]): Record<string, number> {
    return recommendations.reduce((acc, rec) => {
      // Note: sector info would need to be passed through or stored
      const sector = 'Technology' // Simplified
      acc[sector] = (acc[sector] || 0) + 1
      return acc
    }, {} as Record<string, number>)
  }
}

export default InvestmentRecommendationEngine