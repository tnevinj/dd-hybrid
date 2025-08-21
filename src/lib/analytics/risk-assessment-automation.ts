// Risk Assessment Automation System
// Comprehensive automated risk analysis across all fund management modules

export interface RiskFactor {
  id: string
  category: 'MARKET' | 'OPERATIONAL' | 'FINANCIAL' | 'REGULATORY' | 'STRATEGIC' | 'TECHNOLOGY' | 'ESG' | 'LIQUIDITY'
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'
  probability: number // 0-1
  impact: number // 0-10
  description: string
  source: string // Which module identified this risk
  indicators: string[]
  mitigation: string[]
  status: 'ACTIVE' | 'MONITORING' | 'MITIGATED' | 'ESCALATED'
  detectedAt: Date
  lastAssessed: Date
}

export interface RiskAssessment {
  entityId: string
  entityType: 'PORTFOLIO_COMPANY' | 'DEAL' | 'FUND' | 'MARKET_SECTOR'
  overallRiskScore: number // 0-10
  riskGrade: 'A' | 'B' | 'C' | 'D' | 'F'
  risks: RiskFactor[]
  riskTrends: {
    direction: 'INCREASING' | 'STABLE' | 'DECREASING'
    velocity: number
    driverFactors: string[]
  }
  recommendations: {
    immediate: string[]
    shortTerm: string[]
    longTerm: string[]
  }
  alertLevel: 'NONE' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  generatedAt: Date
}

export interface RiskScenario {
  id: string
  name: string
  description: string
  probability: number
  riskFactors: string[]
  potentialImpact: {
    financial: number
    operational: number
    reputational: number
  }
  timeHorizon: 'IMMEDIATE' | 'SHORT_TERM' | 'MEDIUM_TERM' | 'LONG_TERM'
  mitigation: string[]
}

export interface RiskMetrics {
  moduleRiskScores: Record<string, number>
  portfolioRiskDistribution: Record<string, number>
  riskTrends: Array<{
    date: Date
    overallRisk: number
    categoryBreakdown: Record<string, number>
  }>
  alertSummary: {
    critical: number
    high: number
    medium: number
    low: number
  }
  mitigationEffectiveness: Record<string, number>
}

export class RiskAssessmentEngine {
  private riskModels: Record<string, any>
  private riskThresholds: Record<string, any>
  private historicalData: any[]

  constructor() {
    this.riskModels = this.initializeRiskModels()
    this.riskThresholds = this.loadRiskThresholds()
    this.historicalData = this.loadHistoricalRiskData()
  }

  private initializeRiskModels(): Record<string, any> {
    return {
      portfolio: {
        concentration: { maxSingleInvestment: 0.15, maxSectorExposure: 0.35 },
        liquidity: { minCashReserve: 0.05, maxIlliquidAssets: 0.8 },
        performance: { minIRR: 0.12, maxVolatility: 0.25 }
      },
      market: {
        volatility: { vixThreshold: 25, correlationAlert: 0.7 },
        liquidity: { bidAskSpread: 0.02, volumeDecline: 0.3 },
        valuation: { peRatioAlert: 25, priceToBookAlert: 4 }
      },
      operational: {
        efficiency: { minProcessingRate: 0.8, maxErrorRate: 0.02 },
        staffing: { maxTurnover: 0.15, minCapacityUtilization: 0.7 },
        technology: { maxDowntime: 0.01, minSecurityScore: 8 }
      },
      regulatory: {
        compliance: { minScore: 90, maxViolations: 2 },
        reporting: { maxDelay: 5, accuracyThreshold: 0.98 },
        governance: { minBoardIndependence: 0.5, auditFrequency: 4 }
      }
    }
  }

  private loadRiskThresholds(): Record<string, any> {
    return {
      CRITICAL: { score: 8.5, requiresImmediateAction: true },
      HIGH: { score: 7.0, requiresWeeklyReview: true },
      MEDIUM: { score: 5.0, requiresMonthlyReview: true },
      LOW: { score: 3.0, requiresQuarterlyReview: true }
    }
  }

  private loadHistoricalRiskData(): any[] {
    // Mock historical risk data
    return [
      { date: '2024-01-01', overallRisk: 4.2, marketRisk: 5.1, operationalRisk: 3.8 },
      { date: '2024-02-01', overallRisk: 4.5, marketRisk: 5.8, operationalRisk: 3.6 },
      { date: '2024-03-01', overallRisk: 3.9, marketRisk: 4.2, operationalRisk: 3.4 }
    ]
  }

  // Portfolio Risk Assessment
  assessPortfolioRisk(portfolioData: any): RiskAssessment {
    const risks: RiskFactor[] = []
    
    // Concentration Risk
    if (portfolioData.largestPosition > this.riskModels.portfolio.concentration.maxSingleInvestment) {
      risks.push({
        id: 'CONC-001',
        category: 'FINANCIAL',
        severity: 'HIGH',
        probability: 0.7,
        impact: 7,
        description: 'Portfolio concentration exceeds prudent limits',
        source: 'Portfolio Management',
        indicators: [`Largest position: ${(portfolioData.largestPosition * 100).toFixed(1)}%`],
        mitigation: ['Reduce position size', 'Diversify holdings', 'Implement position limits'],
        status: 'ACTIVE',
        detectedAt: new Date(),
        lastAssessed: new Date()
      })
    }

    // Liquidity Risk
    if (portfolioData.liquidityRatio < this.riskModels.portfolio.liquidity.minCashReserve) {
      risks.push({
        id: 'LIQ-001',
        category: 'LIQUIDITY',
        severity: 'MEDIUM',
        probability: 0.6,
        impact: 6,
        description: 'Low liquidity may constrain operational flexibility',
        source: 'Fund Operations',
        indicators: [`Liquidity ratio: ${(portfolioData.liquidityRatio * 100).toFixed(1)}%`],
        mitigation: ['Increase cash reserves', 'Establish credit facilities', 'Improve asset liquidity'],
        status: 'MONITORING',
        detectedAt: new Date(),
        lastAssessed: new Date()
      })
    }

    // Performance Risk
    if (portfolioData.recentPerformance < this.riskModels.portfolio.performance.minIRR) {
      risks.push({
        id: 'PERF-001',
        category: 'FINANCIAL',
        severity: 'MEDIUM',
        probability: 0.5,
        impact: 8,
        description: 'Recent performance below target thresholds',
        source: 'Portfolio Management',
        indicators: [`Recent IRR: ${(portfolioData.recentPerformance * 100).toFixed(1)}%`],
        mitigation: ['Review value creation strategies', 'Accelerate portfolio improvements', 'Consider strategic exits'],
        status: 'ACTIVE',
        detectedAt: new Date(),
        lastAssessed: new Date()
      })
    }

    const overallRiskScore = this.calculateOverallRiskScore(risks)
    
    return {
      entityId: 'PORTFOLIO-MAIN',
      entityType: 'FUND',
      overallRiskScore,
      riskGrade: this.calculateRiskGrade(overallRiskScore),
      risks,
      riskTrends: this.analyzeRiskTrends(overallRiskScore, 'portfolio'),
      recommendations: this.generateRecommendations(risks),
      alertLevel: this.determineAlertLevel(overallRiskScore),
      generatedAt: new Date()
    }
  }

  // Due Diligence Risk Assessment
  assessDueDiligenceRisk(ddData: any): RiskAssessment {
    const risks: RiskFactor[] = []

    // Data Quality Risk
    if (ddData.dataCompleteness < 0.85) {
      risks.push({
        id: 'DD-001',
        category: 'OPERATIONAL',
        severity: 'HIGH',
        probability: 0.8,
        impact: 7,
        description: 'Incomplete due diligence data may mask critical risks',
        source: 'Due Diligence',
        indicators: [`Data completeness: ${(ddData.dataCompleteness * 100).toFixed(1)}%`],
        mitigation: ['Extend due diligence period', 'Request additional documentation', 'Engage specialist advisors'],
        status: 'ACTIVE',
        detectedAt: new Date(),
        lastAssessed: new Date()
      })
    }

    // Timeline Risk
    if (ddData.daysRemaining < 10 && ddData.completeness < 0.8) {
      risks.push({
        id: 'DD-002',
        category: 'OPERATIONAL',
        severity: 'HIGH',
        probability: 0.9,
        impact: 6,
        description: 'Insufficient time to complete thorough due diligence',
        source: 'Due Diligence',
        indicators: [`Days remaining: ${ddData.daysRemaining}`, `Completeness: ${(ddData.completeness * 100).toFixed(1)}%`],
        mitigation: ['Request deadline extension', 'Prioritize critical workstreams', 'Increase resource allocation'],
        status: 'ESCALATED',
        detectedAt: new Date(),
        lastAssessed: new Date()
      })
    }

    // Red Flag Detection
    if (ddData.redFlags && ddData.redFlags.length > 0) {
      risks.push({
        id: 'DD-003',
        category: 'STRATEGIC',
        severity: 'CRITICAL',
        probability: 1.0,
        impact: 9,
        description: 'Critical red flags identified during due diligence',
        source: 'Due Diligence',
        indicators: ddData.redFlags,
        mitigation: ['Investigate thoroughly', 'Consider deal termination', 'Negotiate protective provisions'],
        status: 'ESCALATED',
        detectedAt: new Date(),
        lastAssessed: new Date()
      })
    }

    const overallRiskScore = this.calculateOverallRiskScore(risks)
    
    return {
      entityId: ddData.dealId || 'DD-ASSESSMENT',
      entityType: 'DEAL',
      overallRiskScore,
      riskGrade: this.calculateRiskGrade(overallRiskScore),
      risks,
      riskTrends: this.analyzeRiskTrends(overallRiskScore, 'duediligence'),
      recommendations: this.generateRecommendations(risks),
      alertLevel: this.determineAlertLevel(overallRiskScore),
      generatedAt: new Date()
    }
  }

  // Legal & Compliance Risk Assessment
  assessLegalComplianceRisk(legalData: any): RiskAssessment {
    const risks: RiskFactor[] = []

    // Compliance Score Risk
    if (legalData.complianceScore < this.riskModels.regulatory.compliance.minScore) {
      risks.push({
        id: 'LEGAL-001',
        category: 'REGULATORY',
        severity: 'HIGH',
        probability: 0.8,
        impact: 8,
        description: 'Compliance score below acceptable threshold',
        source: 'Legal Management',
        indicators: [`Compliance score: ${legalData.complianceScore}/100`],
        mitigation: ['Conduct compliance audit', 'Implement remediation plan', 'Enhance monitoring systems'],
        status: 'ACTIVE',
        detectedAt: new Date(),
        lastAssessed: new Date()
      })
    }

    // Regulatory Changes
    if (legalData.pendingRegulations && legalData.pendingRegulations.length > 2) {
      risks.push({
        id: 'LEGAL-002',
        category: 'REGULATORY',
        severity: 'MEDIUM',
        probability: 0.7,
        impact: 6,
        description: 'Multiple pending regulatory changes may impact operations',
        source: 'Legal Management',
        indicators: [`Pending regulations: ${legalData.pendingRegulations.length}`],
        mitigation: ['Monitor regulatory developments', 'Engage regulatory counsel', 'Prepare adaptation strategies'],
        status: 'MONITORING',
        detectedAt: new Date(),
        lastAssessed: new Date()
      })
    }

    // Legal Cost Overruns
    if (legalData.legalCostRatio > 0.05) {
      risks.push({
        id: 'LEGAL-003',
        category: 'FINANCIAL',
        severity: 'MEDIUM',
        probability: 0.6,
        impact: 5,
        description: 'Legal costs exceeding budget parameters',
        source: 'Legal Management',
        indicators: [`Legal cost ratio: ${(legalData.legalCostRatio * 100).toFixed(2)}%`],
        mitigation: ['Review legal spend', 'Negotiate fee arrangements', 'Optimize legal processes'],
        status: 'MONITORING',
        detectedAt: new Date(),
        lastAssessed: new Date()
      })
    }

    const overallRiskScore = this.calculateOverallRiskScore(risks)
    
    return {
      entityId: 'LEGAL-COMPLIANCE',
      entityType: 'FUND',
      overallRiskScore,
      riskGrade: this.calculateRiskGrade(overallRiskScore),
      risks,
      riskTrends: this.analyzeRiskTrends(overallRiskScore, 'legal'),
      recommendations: this.generateRecommendations(risks),
      alertLevel: this.determineAlertLevel(overallRiskScore),
      generatedAt: new Date()
    }
  }

  // Market Risk Assessment
  assessMarketRisk(marketData: any): RiskAssessment {
    const risks: RiskFactor[] = []

    // Volatility Risk
    if (marketData.vix > this.riskModels.market.volatility.vixThreshold) {
      risks.push({
        id: 'MKT-001',
        category: 'MARKET',
        severity: 'HIGH',
        probability: 0.9,
        impact: 7,
        description: 'Elevated market volatility may impact portfolio valuations',
        source: 'Market Intelligence',
        indicators: [`VIX: ${marketData.vix}`, `Threshold: ${this.riskModels.market.volatility.vixThreshold}`],
        mitigation: ['Implement hedging strategies', 'Review position sizing', 'Prepare for market dislocations'],
        status: 'ACTIVE',
        detectedAt: new Date(),
        lastAssessed: new Date()
      })
    }

    // Interest Rate Risk
    if (marketData.rateChangeVelocity > 0.5) {
      risks.push({
        id: 'MKT-002',
        category: 'MARKET',
        severity: 'MEDIUM',
        probability: 0.7,
        impact: 6,
        description: 'Rapid interest rate changes affecting valuation multiples',
        source: 'Market Intelligence',
        indicators: [`Rate change velocity: ${marketData.rateChangeVelocity}`],
        mitigation: ['Assess interest rate sensitivity', 'Review debt financing terms', 'Consider rate hedging'],
        status: 'MONITORING',
        detectedAt: new Date(),
        lastAssessed: new Date()
      })
    }

    // Sector Concentration Risk
    if (marketData.sectorConcentration > 0.4) {
      risks.push({
        id: 'MKT-003',
        category: 'STRATEGIC',
        severity: 'MEDIUM',
        probability: 0.6,
        impact: 7,
        description: 'High sector concentration increases correlation risk',
        source: 'Market Intelligence',
        indicators: [`Sector concentration: ${(marketData.sectorConcentration * 100).toFixed(1)}%`],
        mitigation: ['Diversify sector exposure', 'Monitor sector-specific risks', 'Adjust investment strategy'],
        status: 'ACTIVE',
        detectedAt: new Date(),
        lastAssessed: new Date()
      })
    }

    const overallRiskScore = this.calculateOverallRiskScore(risks)
    
    return {
      entityId: 'MARKET-ASSESSMENT',
      entityType: 'MARKET_SECTOR',
      overallRiskScore,
      riskGrade: this.calculateRiskGrade(overallRiskScore),
      risks,
      riskTrends: this.analyzeRiskTrends(overallRiskScore, 'market'),
      recommendations: this.generateRecommendations(risks),
      alertLevel: this.determineAlertLevel(overallRiskScore),
      generatedAt: new Date()
    }
  }

  // Operational Risk Assessment
  assessOperationalRisk(operationsData: any): RiskAssessment {
    const risks: RiskFactor[] = []

    // Process Efficiency Risk
    if (operationsData.processingEfficiency < this.riskModels.operational.efficiency.minProcessingRate) {
      risks.push({
        id: 'OPS-001',
        category: 'OPERATIONAL',
        severity: 'MEDIUM',
        probability: 0.7,
        impact: 5,
        description: 'Processing efficiency below optimal levels',
        source: 'Fund Operations',
        indicators: [`Efficiency: ${(operationsData.processingEfficiency * 100).toFixed(1)}%`],
        mitigation: ['Process optimization review', 'Automation implementation', 'Staff training programs'],
        status: 'ACTIVE',
        detectedAt: new Date(),
        lastAssessed: new Date()
      })
    }

    // Technology Risk
    if (operationsData.systemUptime < 0.99) {
      risks.push({
        id: 'OPS-002',
        category: 'TECHNOLOGY',
        severity: 'HIGH',
        probability: 0.8,
        impact: 7,
        description: 'System reliability issues affecting operations',
        source: 'Fund Operations',
        indicators: [`System uptime: ${(operationsData.systemUptime * 100).toFixed(2)}%`],
        mitigation: ['Infrastructure upgrades', 'Redundancy implementation', 'Disaster recovery testing'],
        status: 'ACTIVE',
        detectedAt: new Date(),
        lastAssessed: new Date()
      })
    }

    // Staff Turnover Risk
    if (operationsData.staffTurnover > this.riskModels.operational.staffing.maxTurnover) {
      risks.push({
        id: 'OPS-003',
        category: 'OPERATIONAL',
        severity: 'HIGH',
        probability: 0.6,
        impact: 6,
        description: 'High staff turnover affecting operational continuity',
        source: 'Fund Operations',
        indicators: [`Staff turnover: ${(operationsData.staffTurnover * 100).toFixed(1)}%`],
        mitigation: ['Retention programs', 'Knowledge management systems', 'Succession planning'],
        status: 'MONITORING',
        detectedAt: new Date(),
        lastAssessed: new Date()
      })
    }

    const overallRiskScore = this.calculateOverallRiskScore(risks)
    
    return {
      entityId: 'OPERATIONS',
      entityType: 'FUND',
      overallRiskScore,
      riskGrade: this.calculateRiskGrade(overallRiskScore),
      risks,
      riskTrends: this.analyzeRiskTrends(overallRiskScore, 'operations'),
      recommendations: this.generateRecommendations(risks),
      alertLevel: this.determineAlertLevel(overallRiskScore),
      generatedAt: new Date()
    }
  }

  // Comprehensive Risk Assessment across all modules
  generateComprehensiveRiskAssessment(moduleData: Record<string, any>): {
    overallAssessment: RiskAssessment
    moduleAssessments: Record<string, RiskAssessment>
    crossModuleRisks: RiskFactor[]
    riskMetrics: RiskMetrics
  } {
    const moduleAssessments: Record<string, RiskAssessment> = {}
    const allRisks: RiskFactor[] = []

    // Assess each module
    if (moduleData.portfolio) {
      moduleAssessments.portfolio = this.assessPortfolioRisk(moduleData.portfolio)
      allRisks.push(...moduleAssessments.portfolio.risks)
    }

    if (moduleData.dueDiligence) {
      moduleAssessments.dueDiligence = this.assessDueDiligenceRisk(moduleData.dueDiligence)
      allRisks.push(...moduleAssessments.dueDiligence.risks)
    }

    if (moduleData.legal) {
      moduleAssessments.legal = this.assessLegalComplianceRisk(moduleData.legal)
      allRisks.push(...moduleAssessments.legal.risks)
    }

    if (moduleData.market) {
      moduleAssessments.market = this.assessMarketRisk(moduleData.market)
      allRisks.push(...moduleAssessments.market.risks)
    }

    if (moduleData.operations) {
      moduleAssessments.operations = this.assessOperationalRisk(moduleData.operations)
      allRisks.push(...moduleAssessments.operations.risks)
    }

    // Identify cross-module risks
    const crossModuleRisks = this.identifyCrossModuleRisks(allRisks, moduleAssessments)

    // Calculate overall assessment
    const overallRiskScore = this.calculateAggregateRiskScore(Object.values(moduleAssessments))
    const overallAssessment: RiskAssessment = {
      entityId: 'FUND-OVERALL',
      entityType: 'FUND',
      overallRiskScore,
      riskGrade: this.calculateRiskGrade(overallRiskScore),
      risks: [...allRisks, ...crossModuleRisks],
      riskTrends: this.analyzeRiskTrends(overallRiskScore, 'overall'),
      recommendations: this.generateComprehensiveRecommendations(allRisks, crossModuleRisks),
      alertLevel: this.determineAlertLevel(overallRiskScore),
      generatedAt: new Date()
    }

    // Generate risk metrics
    const riskMetrics = this.calculateRiskMetrics(moduleAssessments, allRisks)

    return {
      overallAssessment,
      moduleAssessments,
      crossModuleRisks,
      riskMetrics
    }
  }

  private calculateOverallRiskScore(risks: RiskFactor[]): number {
    if (risks.length === 0) return 0

    const weightedScore = risks.reduce((acc, risk) => {
      const severityWeight = {
        'CRITICAL': 1.0,
        'HIGH': 0.8,
        'MEDIUM': 0.6,
        'LOW': 0.4
      }[risk.severity]
      
      return acc + (risk.probability * risk.impact * severityWeight)
    }, 0)

    return Math.min(weightedScore / risks.length, 10)
  }

  private calculateRiskGrade(score: number): 'A' | 'B' | 'C' | 'D' | 'F' {
    if (score <= 2) return 'A'
    if (score <= 4) return 'B'
    if (score <= 6) return 'C'
    if (score <= 8) return 'D'
    return 'F'
  }

  private analyzeRiskTrends(currentScore: number, module: string): any {
    // Simplified trend analysis
    const recentScores = this.historicalData.slice(-3).map(d => d[`${module}Risk`] || currentScore)
    const avgRecent = recentScores.reduce((acc, s) => acc + s, 0) / recentScores.length
    
    let direction: 'INCREASING' | 'STABLE' | 'DECREASING'
    if (currentScore > avgRecent * 1.1) direction = 'INCREASING'
    else if (currentScore < avgRecent * 0.9) direction = 'DECREASING'
    else direction = 'STABLE'

    return {
      direction,
      velocity: Math.abs(currentScore - avgRecent) / avgRecent,
      driverFactors: this.identifyTrendDrivers(direction)
    }
  }

  private identifyTrendDrivers(direction: string): string[] {
    const drivers = {
      'INCREASING': ['Market volatility', 'Regulatory changes', 'Operational stress'],
      'STABLE': ['Consistent operations', 'Stable market conditions'],
      'DECREASING': ['Improved processes', 'Risk mitigation success', 'Market stabilization']
    }
    return drivers[direction] || []
  }

  private generateRecommendations(risks: RiskFactor[]): any {
    const immediate = risks
      .filter(r => r.severity === 'CRITICAL')
      .map(r => r.mitigation[0])
      .slice(0, 3)

    const shortTerm = risks
      .filter(r => r.severity === 'HIGH')
      .map(r => r.mitigation[0])
      .slice(0, 3)

    const longTerm = risks
      .filter(r => r.severity === 'MEDIUM')
      .map(r => r.mitigation[0])
      .slice(0, 3)

    return {
      immediate: immediate.length > 0 ? immediate : ['Continue monitoring risk levels'],
      shortTerm: shortTerm.length > 0 ? shortTerm : ['Maintain current risk controls'],
      longTerm: longTerm.length > 0 ? longTerm : ['Regular risk assessment reviews']
    }
  }

  private determineAlertLevel(score: number): 'NONE' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' {
    if (score >= 8.5) return 'CRITICAL'
    if (score >= 7.0) return 'HIGH'
    if (score >= 5.0) return 'MEDIUM'
    if (score >= 3.0) return 'LOW'
    return 'NONE'
  }

  private identifyCrossModuleRisks(allRisks: RiskFactor[], moduleAssessments: Record<string, RiskAssessment>): RiskFactor[] {
    const crossModuleRisks: RiskFactor[] = []

    // Systemic risk from multiple high-risk modules
    const highRiskModules = Object.values(moduleAssessments).filter(a => a.overallRiskScore >= 7).length
    if (highRiskModules >= 2) {
      crossModuleRisks.push({
        id: 'CROSS-001',
        category: 'STRATEGIC',
        severity: 'HIGH',
        probability: 0.8,
        impact: 8,
        description: 'Multiple modules showing elevated risk levels indicating systemic issues',
        source: 'Cross-Module Analysis',
        indicators: [`High-risk modules: ${highRiskModules}`],
        mitigation: ['Comprehensive risk review', 'Resource reallocation', 'Executive attention required'],
        status: 'ESCALATED',
        detectedAt: new Date(),
        lastAssessed: new Date()
      })
    }

    // Liquidity risk correlation
    const liquidityRisks = allRisks.filter(r => r.category === 'LIQUIDITY').length
    if (liquidityRisks >= 2) {
      crossModuleRisks.push({
        id: 'CROSS-002',
        category: 'LIQUIDITY',
        severity: 'MEDIUM',
        probability: 0.6,
        impact: 6,
        description: 'Liquidity constraints affecting multiple operational areas',
        source: 'Cross-Module Analysis',
        indicators: [`Liquidity-related risks: ${liquidityRisks}`],
        mitigation: ['Liquidity management review', 'Credit facility evaluation', 'Asset liquidity enhancement'],
        status: 'ACTIVE',
        detectedAt: new Date(),
        lastAssessed: new Date()
      })
    }

    return crossModuleRisks
  }

  private calculateAggregateRiskScore(assessments: RiskAssessment[]): number {
    if (assessments.length === 0) return 0
    
    // Weighted average with emphasis on highest risks
    const scores = assessments.map(a => a.overallRiskScore).sort((a, b) => b - a)
    const weights = [0.4, 0.3, 0.2, 0.1] // Higher weight for top risks
    
    let weightedSum = 0
    let totalWeight = 0
    
    for (let i = 0; i < Math.min(scores.length, weights.length); i++) {
      weightedSum += scores[i] * weights[i]
      totalWeight += weights[i]
    }
    
    return totalWeight > 0 ? weightedSum / totalWeight : scores[0] || 0
  }

  private generateComprehensiveRecommendations(allRisks: RiskFactor[], crossModuleRisks: RiskFactor[]): any {
    const combinedRisks = [...allRisks, ...crossModuleRisks]
    return this.generateRecommendations(combinedRisks)
  }

  private calculateRiskMetrics(moduleAssessments: Record<string, RiskAssessment>, allRisks: RiskFactor[]): RiskMetrics {
    const moduleRiskScores: Record<string, number> = {}
    Object.entries(moduleAssessments).forEach(([module, assessment]) => {
      moduleRiskScores[module] = assessment.overallRiskScore
    })

    const portfolioRiskDistribution = allRisks.reduce((acc, risk) => {
      acc[risk.category] = (acc[risk.category] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const alertSummary = allRisks.reduce((acc, risk) => {
      const severity = risk.severity.toLowerCase()
      acc[severity] = (acc[severity] || 0) + 1
      return acc
    }, { critical: 0, high: 0, medium: 0, low: 0 })

    return {
      moduleRiskScores,
      portfolioRiskDistribution,
      riskTrends: this.historicalData.map(d => ({
        date: new Date(d.date),
        overallRisk: d.overallRisk,
        categoryBreakdown: {
          market: d.marketRisk,
          operational: d.operationalRisk,
          financial: d.overallRisk * 0.8 // Simplified
        }
      })),
      alertSummary,
      mitigationEffectiveness: {
        'Process Improvement': 0.85,
        'Technology Upgrade': 0.78,
        'Policy Changes': 0.72
      }
    }
  }
}

export default RiskAssessmentEngine