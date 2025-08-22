// Industry Benchmarking System
// Comprehensive benchmarking across all fund management modules

export interface BenchmarkData {
  metric: string
  fundValue: number
  industryMedian: number
  industryTopQuartile: number
  industryTopDecile: number
  benchmark: 'peer-median' | 'top-quartile' | 'top-decile'
  percentile: number
  trend: 'improving' | 'declining' | 'stable'
  lastUpdated: Date
}

export interface ModuleBenchmark {
  moduleName: string
  overallScore: number
  grade: 'A+' | 'A' | 'B+' | 'B' | 'C+' | 'C' | 'D'
  metrics: BenchmarkData[]
  strengths: string[]
  improvementAreas: string[]
  peerComparison: {
    betterThan: number // percentage of peers
    similarTo: string[] // peer fund names
    laggingBehind: string[] // areas where fund is below median
  }
}

export interface IndustryBenchmarks {
  portfolioManagement: ModuleBenchmark
  dueDiligence: ModuleBenchmark
  legalManagement: ModuleBenchmark
  dealScreening: ModuleBenchmark
  fundOperations: ModuleBenchmark
  investmentCommittee: ModuleBenchmark
  marketIntelligence: ModuleBenchmark
  overallFundRanking: {
    industryRank: number
    totalFunds: number
    percentile: number
    grade: string
  }
}

export class IndustryBenchmarkingEngine {
  private static industryData = {
    // Portfolio Management Benchmarks
    portfolioMetrics: {
      irr: { median: 15.2, topQuartile: 19.8, topDecile: 24.5 },
      moic: { median: 2.1, topQuartile: 2.8, topDecile: 3.5 },
      dpi: { median: 0.42, topQuartile: 0.65, topDecile: 0.85 },
      tvpi: { median: 1.85, topQuartile: 2.45, topDecile: 3.15 },
      holdPeriod: { median: 4.8, topQuartile: 4.2, topDecile: 3.8 }, // years (lower is better)
      exitSuccess: { median: 0.68, topQuartile: 0.82, topDecile: 0.92 } // percentage
    },
    // Due Diligence Benchmarks
    dueDiligenceMetrics: {
      avgDDDuration: { median: 95, topQuartile: 75, topDecile: 60 }, // days (lower is better)
      ddAccuracy: { median: 0.78, topQuartile: 0.88, topDecile: 0.95 },
      riskIdentification: { median: 0.72, topQuartile: 0.85, topDecile: 0.94 },
      postDealPerformance: { median: 0.65, topQuartile: 0.80, topDecile: 0.92 },
      ddCostEfficiency: { median: 0.68, topQuartile: 0.82, topDecile: 0.91 }
    },
    // Legal Management Benchmarks
    legalMetrics: {
      complianceScore: { median: 88, topQuartile: 95, topDecile: 98 },
      legalCosts: { median: 0.045, topQuartile: 0.032, topDecile: 0.025 }, // % of AUM (lower is better)
      documentTurnaround: { median: 12, topQuartile: 8, topDecile: 5 }, // days (lower is better)
      regulatoryIssues: { median: 2.1, topQuartile: 0.8, topDecile: 0.2 }, // per year (lower is better)
      contractNegotiation: { median: 0.72, topQuartile: 0.86, topDecile: 0.94 } // success rate
    },
    // Deal Screening Benchmarks
    dealScreeningMetrics: {
      screeningAccuracy: { median: 0.71, topQuartile: 0.84, topDecile: 0.92 },
      timeToDeal: { median: 145, topQuartile: 95, topDecile: 65 }, // days (lower is better)
      dealConversion: { median: 0.18, topQuartile: 0.28, topDecile: 0.38 },
      sourcingEfficiency: { median: 0.65, topQuartile: 0.79, topDecile: 0.89 },
      dealQuality: { median: 7.2, topQuartile: 8.4, topDecile: 9.1 } // out of 10
    },
    // Fund Operations Benchmarks
    operationsMetrics: {
      operationalEfficiency: { median: 0.75, topQuartile: 0.87, topDecile: 0.94 },
      costRatio: { median: 0.025, topQuartile: 0.018, topDecile: 0.012 }, // operating costs as % of AUM (lower is better)
      reportingSpeed: { median: 18, topQuartile: 12, topDecile: 7 }, // days (lower is better)
      dataAccuracy: { median: 0.89, topQuartile: 0.95, topDecile: 0.98 },
      stakeholderSatisfaction: { median: 7.8, topQuartile: 8.9, topDecile: 9.4 } // out of 10
    },
    // Investment Committee Benchmarks
    investmentCommitteeMetrics: {
      decisionSpeed: { median: 28, topQuartile: 18, topDecile: 12 }, // days (lower is better)
      decisionAccuracy: { median: 0.74, topQuartile: 0.86, topDecile: 0.93 },
      meetingEfficiency: { median: 0.68, topQuartile: 0.82, topDecile: 0.91 },
      portfolioAlignment: { median: 0.76, topQuartile: 0.88, topDecile: 0.95 },
      riskAssessment: { median: 0.71, topQuartile: 0.84, topDecile: 0.92 }
    },
    // Market Intelligence Benchmarks
    marketIntelligenceMetrics: {
      forecastAccuracy: { median: 0.68, topQuartile: 0.81, topDecile: 0.91 },
      dataTimeliness: { median: 0.74, topQuartile: 0.87, topDecile: 0.94 },
      insightQuality: { median: 7.1, topQuartile: 8.3, topDecile: 9.2 }, // out of 10
      marketCoverage: { median: 0.72, topQuartile: 0.85, topDecile: 0.93 },
      competitiveIntel: { median: 0.69, topQuartile: 0.82, topDecile: 0.91 }
    }
  }

  static calculatePercentile(value: number, benchmarks: any, lowerIsBetter = false): number {
    const { median, topQuartile, topDecile } = benchmarks
    
    if (lowerIsBetter) {
      if (value <= topDecile) return 90
      if (value <= topQuartile) return 75
      if (value <= median) return 50
      if (value <= median * 1.5) return 25
      return 10
    } else {
      if (value >= topDecile) return 90
      if (value >= topQuartile) return 75
      if (value >= median) return 50
      if (value >= median * 0.7) return 25
      return 10
    }
  }

  static calculateGrade(percentile: number): 'A+' | 'A' | 'B+' | 'B' | 'C+' | 'C' | 'D' {
    if (percentile >= 95) return 'A+'
    if (percentile >= 85) return 'A'
    if (percentile >= 75) return 'B+'
    if (percentile >= 65) return 'B'
    if (percentile >= 50) return 'C+'
    if (percentile >= 35) return 'C'
    return 'D'
  }

  static benchmarkPortfolioManagement(fundData: any): ModuleBenchmark {
    const metrics: BenchmarkData[] = [
      {
        metric: 'Internal Rate of Return (IRR)',
        fundValue: fundData.irr || 17.4,
        industryMedian: this.industryData.portfolioMetrics.irr.median,
        industryTopQuartile: this.industryData.portfolioMetrics.irr.topQuartile,
        industryTopDecile: this.industryData.portfolioMetrics.irr.topDecile,
        benchmark: 'top-quartile',
        percentile: this.calculatePercentile(fundData.irr || 17.4, this.industryData.portfolioMetrics.irr),
        trend: 'improving',
        lastUpdated: new Date()
      },
      {
        metric: 'Multiple of Invested Capital (MOIC)',
        fundValue: fundData.moic || 2.3,
        industryMedian: this.industryData.portfolioMetrics.moic.median,
        industryTopQuartile: this.industryData.portfolioMetrics.moic.topQuartile,
        industryTopDecile: this.industryData.portfolioMetrics.moic.topDecile,
        benchmark: 'top-quartile',
        percentile: this.calculatePercentile(fundData.moic || 2.3, this.industryData.portfolioMetrics.moic),
        trend: 'stable',
        lastUpdated: new Date()
      },
      {
        metric: 'Distributions to Paid-in (DPI)',
        fundValue: fundData.dpi || 0.58,
        industryMedian: this.industryData.portfolioMetrics.dpi.median,
        industryTopQuartile: this.industryData.portfolioMetrics.dpi.topQuartile,
        industryTopDecile: this.industryData.portfolioMetrics.dpi.topDecile,
        benchmark: 'top-quartile',
        percentile: this.calculatePercentile(fundData.dpi || 0.58, this.industryData.portfolioMetrics.dpi),
        trend: 'improving',
        lastUpdated: new Date()
      }
    ]

    const avgPercentile = metrics.reduce((acc, m) => acc + m.percentile, 0) / metrics.length

    return {
      moduleName: 'Portfolio Management',
      overallScore: avgPercentile,
      grade: this.calculateGrade(avgPercentile),
      metrics,
      strengths: avgPercentile >= 75 ? ['Strong IRR performance', 'Excellent portfolio returns'] : ['Solid foundation'],
      improvementAreas: avgPercentile < 50 ? ['Portfolio optimization', 'Exit timing'] : [],
      peerComparison: {
        betterThan: avgPercentile,
        similarTo: ['Apollo Global', 'Blackstone', 'KKR'],
        laggingBehind: avgPercentile < 50 ? ['IRR optimization', 'Value creation'] : []
      }
    }
  }

  static benchmarkDueDiligence(fundData: any): ModuleBenchmark {
    const metrics: BenchmarkData[] = [
      {
        metric: 'Due Diligence Duration (Days)',
        fundValue: fundData.ddDuration || 78,
        industryMedian: this.industryData.dueDiligenceMetrics.avgDDDuration.median,
        industryTopQuartile: this.industryData.dueDiligenceMetrics.avgDDDuration.topQuartile,
        industryTopDecile: this.industryData.dueDiligenceMetrics.avgDDDuration.topDecile,
        benchmark: 'top-quartile',
        percentile: this.calculatePercentile(fundData.ddDuration || 78, this.industryData.dueDiligenceMetrics.avgDDDuration, true),
        trend: 'improving',
        lastUpdated: new Date()
      },
      {
        metric: 'DD Accuracy Score',
        fundValue: fundData.ddAccuracy || 0.86,
        industryMedian: this.industryData.dueDiligenceMetrics.ddAccuracy.median,
        industryTopQuartile: this.industryData.dueDiligenceMetrics.ddAccuracy.topQuartile,
        industryTopDecile: this.industryData.dueDiligenceMetrics.ddAccuracy.topDecile,
        benchmark: 'top-quartile',
        percentile: this.calculatePercentile(fundData.ddAccuracy || 0.86, this.industryData.dueDiligenceMetrics.ddAccuracy),
        trend: 'stable',
        lastUpdated: new Date()
      },
      {
        metric: 'Risk Identification Rate',
        fundValue: fundData.riskIdentification || 0.89,
        industryMedian: this.industryData.dueDiligenceMetrics.riskIdentification.median,
        industryTopQuartile: this.industryData.dueDiligenceMetrics.riskIdentification.topQuartile,
        industryTopDecile: this.industryData.dueDiligenceMetrics.riskIdentification.topDecile,
        benchmark: 'top-quartile',
        percentile: this.calculatePercentile(fundData.riskIdentification || 0.89, this.industryData.dueDiligenceMetrics.riskIdentification),
        trend: 'improving',
        lastUpdated: new Date()
      }
    ]

    const avgPercentile = metrics.reduce((acc, m) => acc + m.percentile, 0) / metrics.length

    return {
      moduleName: 'Due Diligence',
      overallScore: avgPercentile,
      grade: this.calculateGrade(avgPercentile),
      metrics,
      strengths: avgPercentile >= 75 ? ['Efficient DD process', 'Strong risk identification'] : ['Thorough analysis'],
      improvementAreas: avgPercentile < 50 ? ['Speed optimization', 'Accuracy improvement'] : [],
      peerComparison: {
        betterThan: avgPercentile,
        similarTo: ['Carlyle Group', 'TPG Capital', 'Warburg Pincus'],
        laggingBehind: avgPercentile < 50 ? ['Process efficiency', 'Technology adoption'] : []
      }
    }
  }

  static benchmarkLegalManagement(fundData: any): ModuleBenchmark {
    const metrics: BenchmarkData[] = [
      {
        metric: 'Compliance Score',
        fundValue: fundData.complianceScore || 96,
        industryMedian: this.industryData.legalMetrics.complianceScore.median,
        industryTopQuartile: this.industryData.legalMetrics.complianceScore.topQuartile,
        industryTopDecile: this.industryData.legalMetrics.complianceScore.topDecile,
        benchmark: 'top-quartile',
        percentile: this.calculatePercentile(fundData.complianceScore || 96, this.industryData.legalMetrics.complianceScore),
        trend: 'stable',
        lastUpdated: new Date()
      },
      {
        metric: 'Legal Cost Efficiency (% AUM)',
        fundValue: fundData.legalCosts || 0.028,
        industryMedian: this.industryData.legalMetrics.legalCosts.median,
        industryTopQuartile: this.industryData.legalMetrics.legalCosts.topQuartile,
        industryTopDecile: this.industryData.legalMetrics.legalCosts.topDecile,
        benchmark: 'top-quartile',
        percentile: this.calculatePercentile(fundData.legalCosts || 0.028, this.industryData.legalMetrics.legalCosts, true),
        trend: 'improving',
        lastUpdated: new Date()
      },
      {
        metric: 'Document Turnaround (Days)',
        fundValue: fundData.documentTurnaround || 7,
        industryMedian: this.industryData.legalMetrics.documentTurnaround.median,
        industryTopQuartile: this.industryData.legalMetrics.documentTurnaround.topQuartile,
        industryTopDecile: this.industryData.legalMetrics.documentTurnaround.topDecile,
        benchmark: 'top-quartile',
        percentile: this.calculatePercentile(fundData.documentTurnaround || 7, this.industryData.legalMetrics.documentTurnaround, true),
        trend: 'improving',
        lastUpdated: new Date()
      }
    ]

    const avgPercentile = metrics.reduce((acc, m) => acc + m.percentile, 0) / metrics.length

    return {
      moduleName: 'Legal Management',
      overallScore: avgPercentile,
      grade: this.calculateGrade(avgPercentile),
      metrics,
      strengths: avgPercentile >= 75 ? ['Excellent compliance', 'Cost efficiency'] : ['Strong regulatory posture'],
      improvementAreas: avgPercentile < 50 ? ['Document automation', 'Cost optimization'] : [],
      peerComparison: {
        betterThan: avgPercentile,
        similarTo: ['Bain Capital', 'General Atlantic', 'Silver Lake'],
        laggingBehind: avgPercentile < 50 ? ['Process automation', 'Regulatory efficiency'] : []
      }
    }
  }

  static benchmarkFundOperations(fundData: any): ModuleBenchmark {
    const metrics: BenchmarkData[] = [
      {
        metric: 'Operational Efficiency',
        fundValue: fundData.operationalEfficiency || 0.89,
        industryMedian: this.industryData.operationsMetrics.operationalEfficiency.median,
        industryTopQuartile: this.industryData.operationsMetrics.operationalEfficiency.topQuartile,
        industryTopDecile: this.industryData.operationsMetrics.operationalEfficiency.topDecile,
        benchmark: 'top-quartile',
        percentile: this.calculatePercentile(fundData.operationalEfficiency || 0.89, this.industryData.operationsMetrics.operationalEfficiency),
        trend: 'improving',
        lastUpdated: new Date()
      },
      {
        metric: 'Cost Ratio (% AUM)',
        fundValue: fundData.costRatio || 0.016,
        industryMedian: this.industryData.operationsMetrics.costRatio.median,
        industryTopQuartile: this.industryData.operationsMetrics.costRatio.topQuartile,
        industryTopDecile: this.industryData.operationsMetrics.costRatio.topDecile,
        benchmark: 'top-quartile',
        percentile: this.calculatePercentile(fundData.costRatio || 0.016, this.industryData.operationsMetrics.costRatio, true),
        trend: 'stable',
        lastUpdated: new Date()
      },
      {
        metric: 'Data Accuracy',
        fundValue: fundData.dataAccuracy || 0.96,
        industryMedian: this.industryData.operationsMetrics.dataAccuracy.median,
        industryTopQuartile: this.industryData.operationsMetrics.dataAccuracy.topQuartile,
        industryTopDecile: this.industryData.operationsMetrics.dataAccuracy.topDecile,
        benchmark: 'top-quartile',
        percentile: this.calculatePercentile(fundData.dataAccuracy || 0.96, this.industryData.operationsMetrics.dataAccuracy),
        trend: 'stable',
        lastUpdated: new Date()
      }
    ]

    const avgPercentile = metrics.reduce((acc, m) => acc + m.percentile, 0) / metrics.length

    return {
      moduleName: 'Fund Operations',
      overallScore: avgPercentile,
      grade: this.calculateGrade(avgPercentile),
      metrics,
      strengths: avgPercentile >= 75 ? ['Excellent operational efficiency', 'Cost leadership'] : ['Strong operations'],
      improvementAreas: avgPercentile < 50 ? ['Cost optimization', 'Process automation'] : [],
      peerComparison: {
        betterThan: avgPercentile,
        similarTo: ['Vista Equity Partners', 'Leonard Green', 'Advent International'],
        laggingBehind: avgPercentile < 50 ? ['Technology adoption', 'Operational scaling'] : []
      }
    }
  }

  static benchmarkDealScreening(fundData: any): ModuleBenchmark {
    const metrics: BenchmarkData[] = [
      {
        metric: 'Screening Accuracy',
        fundValue: fundData.screeningAccuracy || 0.84,
        industryMedian: this.industryData.dealScreeningMetrics.screeningAccuracy.median,
        industryTopQuartile: this.industryData.dealScreeningMetrics.screeningAccuracy.topQuartile,
        industryTopDecile: this.industryData.dealScreeningMetrics.screeningAccuracy.topDecile,
        benchmark: 'top-quartile',
        percentile: this.calculatePercentile(fundData.screeningAccuracy || 0.84, this.industryData.dealScreeningMetrics.screeningAccuracy),
        trend: 'improving',
        lastUpdated: new Date()
      },
      {
        metric: 'Time to Deal (Days)',
        fundValue: fundData.timeToDeal || 95,
        industryMedian: this.industryData.dealScreeningMetrics.timeToDeal.median,
        industryTopQuartile: this.industryData.dealScreeningMetrics.timeToDeal.topQuartile,
        industryTopDecile: this.industryData.dealScreeningMetrics.timeToDeal.topDecile,
        benchmark: 'top-quartile',
        percentile: this.calculatePercentile(fundData.timeToDeal || 95, this.industryData.dealScreeningMetrics.timeToDeal, true),
        trend: 'improving',
        lastUpdated: new Date()
      },
      {
        metric: 'Deal Conversion Rate',
        fundValue: fundData.dealConversion || 0.28,
        industryMedian: this.industryData.dealScreeningMetrics.dealConversion.median,
        industryTopQuartile: this.industryData.dealScreeningMetrics.dealConversion.topQuartile,
        industryTopDecile: this.industryData.dealScreeningMetrics.dealConversion.topDecile,
        benchmark: 'top-quartile',
        percentile: this.calculatePercentile(fundData.dealConversion || 0.28, this.industryData.dealScreeningMetrics.dealConversion),
        trend: 'stable',
        lastUpdated: new Date()
      }
    ]

    const avgPercentile = metrics.reduce((acc, m) => acc + m.percentile, 0) / metrics.length

    return {
      moduleName: 'Deal Screening',
      overallScore: avgPercentile,
      grade: this.calculateGrade(avgPercentile),
      metrics,
      strengths: avgPercentile >= 75 ? ['Strong deal flow', 'Quality screening', 'Efficient conversion'] : ['Solid screening process'],
      improvementAreas: avgPercentile < 50 ? ['Screening speed', 'Deal quality'] : [],
      peerComparison: {
        betterThan: avgPercentile,
        similarTo: ['Hellman & Friedman', 'Francisco Partners', 'Thoma Bravo'],
        laggingBehind: avgPercentile < 50 ? ['Deal sourcing', 'Screening efficiency'] : []
      }
    }
  }

  static benchmarkInvestmentCommittee(fundData: any): ModuleBenchmark {
    const metrics: BenchmarkData[] = [
      {
        metric: 'Decision Speed (Days)',
        fundValue: fundData.decisionSpeed || 18,
        industryMedian: this.industryData.investmentCommitteeMetrics.decisionSpeed.median,
        industryTopQuartile: this.industryData.investmentCommitteeMetrics.decisionSpeed.topQuartile,
        industryTopDecile: this.industryData.investmentCommitteeMetrics.decisionSpeed.topDecile,
        benchmark: 'top-quartile',
        percentile: this.calculatePercentile(fundData.decisionSpeed || 18, this.industryData.investmentCommitteeMetrics.decisionSpeed, true),
        trend: 'improving',
        lastUpdated: new Date()
      },
      {
        metric: 'Decision Accuracy',
        fundValue: fundData.decisionAccuracy || 0.86,
        industryMedian: this.industryData.investmentCommitteeMetrics.decisionAccuracy.median,
        industryTopQuartile: this.industryData.investmentCommitteeMetrics.decisionAccuracy.topQuartile,
        industryTopDecile: this.industryData.investmentCommitteeMetrics.decisionAccuracy.topDecile,
        benchmark: 'top-quartile',
        percentile: this.calculatePercentile(fundData.decisionAccuracy || 0.86, this.industryData.investmentCommitteeMetrics.decisionAccuracy),
        trend: 'stable',
        lastUpdated: new Date()
      },
      {
        metric: 'Meeting Efficiency',
        fundValue: fundData.meetingEfficiency || 0.82,
        industryMedian: this.industryData.investmentCommitteeMetrics.meetingEfficiency.median,
        industryTopQuartile: this.industryData.investmentCommitteeMetrics.meetingEfficiency.topQuartile,
        industryTopDecile: this.industryData.investmentCommitteeMetrics.meetingEfficiency.topDecile,
        benchmark: 'top-quartile',
        percentile: this.calculatePercentile(fundData.meetingEfficiency || 0.82, this.industryData.investmentCommitteeMetrics.meetingEfficiency),
        trend: 'improving',
        lastUpdated: new Date()
      }
    ]

    const avgPercentile = metrics.reduce((acc, m) => acc + m.percentile, 0) / metrics.length

    return {
      moduleName: 'Investment Committee',
      overallScore: avgPercentile,
      grade: this.calculateGrade(avgPercentile),
      metrics,
      strengths: avgPercentile >= 75 ? ['Efficient decisions', 'Strong governance', 'Fast turnaround'] : ['Good decision process'],
      improvementAreas: avgPercentile < 50 ? ['Decision speed', 'Meeting efficiency'] : [],
      peerComparison: {
        betterThan: avgPercentile,
        similarTo: ['CVC Capital', 'EQT Partners', 'Cinven'],
        laggingBehind: avgPercentile < 50 ? ['Decision processes', 'Committee efficiency'] : []
      }
    }
  }

  static benchmarkMarketIntelligence(fundData: any): ModuleBenchmark {
    const metrics: BenchmarkData[] = [
      {
        metric: 'Forecast Accuracy',
        fundValue: fundData.forecastAccuracy || 0.81,
        industryMedian: this.industryData.marketIntelligenceMetrics.forecastAccuracy.median,
        industryTopQuartile: this.industryData.marketIntelligenceMetrics.forecastAccuracy.topQuartile,
        industryTopDecile: this.industryData.marketIntelligenceMetrics.forecastAccuracy.topDecile,
        benchmark: 'top-quartile',
        percentile: this.calculatePercentile(fundData.forecastAccuracy || 0.81, this.industryData.marketIntelligenceMetrics.forecastAccuracy),
        trend: 'improving',
        lastUpdated: new Date()
      },
      {
        metric: 'Data Timeliness',
        fundValue: fundData.dataTimeliness || 0.87,
        industryMedian: this.industryData.marketIntelligenceMetrics.dataTimeliness.median,
        industryTopQuartile: this.industryData.marketIntelligenceMetrics.dataTimeliness.topQuartile,
        industryTopDecile: this.industryData.marketIntelligenceMetrics.dataTimeliness.topDecile,
        benchmark: 'top-quartile',
        percentile: this.calculatePercentile(fundData.dataTimeliness || 0.87, this.industryData.marketIntelligenceMetrics.dataTimeliness),
        trend: 'stable',
        lastUpdated: new Date()
      },
      {
        metric: 'Market Coverage',
        fundValue: fundData.marketCoverage || 0.85,
        industryMedian: this.industryData.marketIntelligenceMetrics.marketCoverage.median,
        industryTopQuartile: this.industryData.marketIntelligenceMetrics.marketCoverage.topQuartile,
        industryTopDecile: this.industryData.marketIntelligenceMetrics.marketCoverage.topDecile,
        benchmark: 'top-quartile',
        percentile: this.calculatePercentile(fundData.marketCoverage || 0.85, this.industryData.marketIntelligenceMetrics.marketCoverage),
        trend: 'improving',
        lastUpdated: new Date()
      }
    ]

    const avgPercentile = metrics.reduce((acc, m) => acc + m.percentile, 0) / metrics.length

    return {
      moduleName: 'Market Intelligence',
      overallScore: avgPercentile,
      grade: this.calculateGrade(avgPercentile),
      metrics,
      strengths: avgPercentile >= 75 ? ['Good market coverage', 'Accurate forecasting', 'Timely insights'] : ['Solid market analysis'],
      improvementAreas: avgPercentile < 50 ? ['Predictive analytics', 'Competitive intelligence'] : avgPercentile < 75 ? ['Predictive analytics'] : [],
      peerComparison: {
        betterThan: avgPercentile,
        similarTo: ['Permira', 'PAI Partners', 'Nordic Capital'],
        laggingBehind: avgPercentile < 50 ? ['Competitive intelligence', 'Market timing'] : []
      }
    }
  }

  static generateComprehensiveBenchmarks(fundData: any): IndustryBenchmarks {
    const portfolioManagement = this.benchmarkPortfolioManagement(fundData.portfolio || {})
    const dueDiligence = this.benchmarkDueDiligence(fundData.dueDiligence || {})
    const legalManagement = this.benchmarkLegalManagement(fundData.legal || {})
    const fundOperations = this.benchmarkFundOperations(fundData.operations || {})
    const dealScreening = this.benchmarkDealScreening(fundData.dealScreening || {})
    const investmentCommittee = this.benchmarkInvestmentCommittee(fundData.investmentCommittee || {})
    const marketIntelligence = this.benchmarkMarketIntelligence(fundData.marketIntelligence || {})

    const overallScore = (
      portfolioManagement.overallScore +
      dueDiligence.overallScore +
      legalManagement.overallScore +
      dealScreening.overallScore +
      fundOperations.overallScore +
      investmentCommittee.overallScore +
      marketIntelligence.overallScore
    ) / 7

    return {
      portfolioManagement,
      dueDiligence,
      legalManagement,
      dealScreening,
      fundOperations,
      investmentCommittee,
      marketIntelligence,
      overallFundRanking: {
        industryRank: Math.max(1, Math.floor((100 - overallScore) * 5)), // Out of ~500 funds
        totalFunds: 487,
        percentile: overallScore,
        grade: this.calculateGrade(overallScore)
      }
    }
  }

  static getBenchmarkInsights(benchmarks: IndustryBenchmarks): Array<{
    type: 'strength' | 'opportunity' | 'risk' | 'trend'
    module: string
    title: string
    description: string
    impact: 'high' | 'medium' | 'low'
    actionable: boolean
  }> {
    const insights = []

    // Identify top performers
    const modules = [
      benchmarks.portfolioManagement,
      benchmarks.dueDiligence,
      benchmarks.legalManagement,
      benchmarks.dealScreening,
      benchmarks.fundOperations,
      benchmarks.investmentCommittee,
      benchmarks.marketIntelligence
    ]

    const topPerformer = modules.reduce((best, current) => 
      current.overallScore > best.overallScore ? current : best
    )

    insights.push({
      type: 'strength',
      module: topPerformer.moduleName,
      title: `${topPerformer.moduleName} Excellence`,
      description: `Leading performance in ${topPerformer.moduleName} with ${topPerformer.grade} grade (${topPerformer.overallScore.toFixed(0)}th percentile)`,
      impact: 'high',
      actionable: false
    })

    // Identify improvement opportunities
    const underperformers = modules.filter(m => m.overallScore < 50)
    underperformers.forEach(module => {
      insights.push({
        type: 'opportunity',
        module: module.moduleName,
        title: `${module.moduleName} Optimization`,
        description: `Below median performance (${module.overallScore.toFixed(0)}th percentile). Focus on: ${module.improvementAreas.join(', ')}`,
        impact: 'high',
        actionable: true
      })
    })

    // Overall fund ranking insight
    const ranking = benchmarks.overallFundRanking
    insights.push({
      type: ranking.percentile >= 75 ? 'strength' as const : 'opportunity' as const,
      module: 'Overall Fund',
      title: `Industry Ranking: #${ranking.industryRank} of ${ranking.totalFunds}`,
      description: `Fund ranks in ${ranking.percentile.toFixed(0)}th percentile with ${ranking.grade} grade`,
      impact: 'high' as const,
      actionable: ranking.percentile < 75
    })

    return insights
  }
}

export default IndustryBenchmarkingEngine
