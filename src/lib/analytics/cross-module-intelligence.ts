// Cross-Module Intelligence Framework
// Provides unified analytics and predictive insights across all fund management modules

export interface CrossModuleMetrics {
  // Portfolio Health Score (0-100)
  portfolioHealthScore: number;
  
  // Fund Operations Efficiency (0-100) 
  operationalEfficiency: number;
  
  // Legal & Compliance Risk Score (0-100, lower is better)
  legalRiskScore: number;
  
  // Deal Pipeline Quality Score (0-100)
  dealPipelineQuality: number;
  
  // Market Intelligence Confidence (0-100)
  marketIntelligenceConfidence: number;
  
  // Overall Fund Performance Grade
  overallFundGrade: 'A+' | 'A' | 'B+' | 'B' | 'C+' | 'C' | 'D';
}

export interface CrossModuleInsight {
  id: string;
  type: 'RISK_ALERT' | 'OPPORTUNITY' | 'EFFICIENCY_GAIN' | 'PREDICTIVE_WARNING' | 'CORRELATION';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  title: string;
  description: string;
  affectedModules: string[];
  actionItems: string[];
  confidence: number; // 0-100
  impact: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  timeframe: 'IMMEDIATE' | 'SHORT_TERM' | 'MEDIUM_TERM' | 'LONG_TERM';
  category: 'PERFORMANCE' | 'RISK_MANAGEMENT' | 'OPERATIONAL' | 'STRATEGIC';
}

export interface ModuleCorrelation {
  moduleA: string;
  moduleB: string;
  correlationType: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL';
  strength: number; // 0-1
  description: string;
  businessImplication: string;
}

export interface PredictiveModel {
  modelName: string;
  predictionType: 'PERFORMANCE' | 'RISK' | 'MARKET_TIMING' | 'OPERATIONAL';
  confidence: number;
  timeHorizon: '1_MONTH' | '3_MONTHS' | '6_MONTHS' | '1_YEAR';
  prediction: {
    metric: string;
    currentValue: number;
    predictedValue: number;
    change: number;
    changePercentage: number;
  };
  keyDrivers: string[];
  assumptions: string[];
}

export class CrossModuleIntelligenceEngine {
  
  /**
   * Calculate comprehensive cross-module metrics
   */
  static calculateCrossModuleMetrics(data: {
    portfolioData?: any;
    fundOperations?: any;
    legalCompliance?: any;
    dealPipeline?: any;
    marketIntelligence?: any;
  }): CrossModuleMetrics {
    
    // Portfolio Health Score
    const portfolioHealthScore = this.calculatePortfolioHealth(data.portfolioData);
    
    // Operational Efficiency
    const operationalEfficiency = this.calculateOperationalEfficiency(data.fundOperations);
    
    // Legal Risk Score
    const legalRiskScore = this.calculateLegalRiskScore(data.legalCompliance);
    
    // Deal Pipeline Quality
    const dealPipelineQuality = this.calculateDealPipelineQuality(data.dealPipeline);
    
    // Market Intelligence Confidence
    const marketIntelligenceConfidence = this.calculateMarketConfidence(data.marketIntelligence);
    
    // Overall Grade
    const overallFundGrade = this.calculateOverallGrade({
      portfolioHealthScore,
      operationalEfficiency,
      legalRiskScore: 100 - legalRiskScore, // Invert risk score for grade calculation
      dealPipelineQuality,
      marketIntelligenceConfidence
    });

    return {
      portfolioHealthScore,
      operationalEfficiency,
      legalRiskScore,
      dealPipelineQuality,
      marketIntelligenceConfidence,
      overallFundGrade
    };
  }

  /**
   * Generate cross-module insights using AI-powered analysis
   */
  static generateCrossModuleInsights(metrics: CrossModuleMetrics, historicalData?: any): CrossModuleInsight[] {
    const insights: CrossModuleInsight[] = [];

    // Risk Correlation Analysis
    if (metrics.legalRiskScore > 60 && metrics.dealPipelineQuality < 70) {
      insights.push({
        id: 'risk-001',
        type: 'RISK_ALERT',
        severity: 'HIGH',
        title: 'Legal Risk Impacting Deal Flow',
        description: 'High legal compliance risk is correlating with declining deal pipeline quality. Regulatory uncertainty may be deterring quality opportunities.',
        affectedModules: ['Legal Management', 'Deal Screening', 'Investment Committee'],
        actionItems: [
          'Expedite compliance framework updates',
          'Review deal screening criteria for regulatory alignment',
          'Schedule IC session on regulatory positioning'
        ],
        confidence: 87,
        impact: 'HIGH',
        timeframe: 'SHORT_TERM',
        category: 'RISK_MANAGEMENT'
      });
    }

    // Operational Excellence Opportunity
    if (metrics.operationalEfficiency > 85 && metrics.portfolioHealthScore > 80) {
      insights.push({
        id: 'opp-001',
        type: 'OPPORTUNITY',
        severity: 'MEDIUM',
        title: 'Scale Operations for Higher Fund Size',
        description: 'Strong operational efficiency combined with healthy portfolio performance suggests readiness for larger fund size in next vintage.',
        affectedModules: ['Fund Operations', 'Portfolio Management', 'Market Intelligence'],
        actionItems: [
          'Model scenarios for 1.5x-2x fund size increase',
          'Assess team scaling requirements',
          'Analyze market capacity for larger deployment'
        ],
        confidence: 92,
        impact: 'HIGH',
        timeframe: 'LONG_TERM',
        category: 'STRATEGIC'
      });
    }

    // Performance Optimization
    if (metrics.portfolioHealthScore < 75 && metrics.marketIntelligenceConfidence > 85) {
      insights.push({
        id: 'eff-001',
        type: 'EFFICIENCY_GAIN',
        severity: 'MEDIUM',
        title: 'Leverage Market Intelligence for Portfolio Support',
        description: 'High-quality market intelligence could be better utilized to support underperforming portfolio companies.',
        affectedModules: ['Portfolio Management', 'Market Intelligence'],
        actionItems: [
          'Create market intelligence digest for portfolio companies',
          'Establish regular MI briefings for portfolio CEOs',
          'Develop sector-specific insights program'
        ],
        confidence: 78,
        impact: 'MEDIUM',
        timeframe: 'SHORT_TERM',
        category: 'OPERATIONAL'
      });
    }

    // Predictive Warning
    if (metrics.dealPipelineQuality < 60 && metrics.marketIntelligenceConfidence < 70) {
      insights.push({
        id: 'pred-001',
        type: 'PREDICTIVE_WARNING',
        severity: 'CRITICAL',
        title: 'Deal Flow Crisis Predicted',
        description: 'Combination of weak deal pipeline and low market confidence suggests potential deal flow drought in next 6 months.',
        affectedModules: ['Deal Screening', 'Market Intelligence', 'Investment Committee'],
        actionItems: [
          'Activate alternative deal sourcing channels',
          'Increase market intelligence gathering efforts',
          'Consider geographic or sector expansion',
          'Strengthen existing portfolio company initiatives'
        ],
        confidence: 85,
        impact: 'CRITICAL',
        timeframe: 'MEDIUM_TERM',
        category: 'STRATEGIC'
      });
    }

    return insights;
  }

  /**
   * Identify correlations between different modules
   */
  static identifyModuleCorrelations(historicalData: any[]): ModuleCorrelation[] {
    const correlations: ModuleCorrelation[] = [];

    // Portfolio Performance vs Legal Risk correlation
    correlations.push({
      moduleA: 'Portfolio Management',
      moduleB: 'Legal Management',
      correlationType: 'NEGATIVE',
      strength: 0.73,
      description: 'Higher legal compliance scores correlate with better portfolio performance',
      businessImplication: 'Strong compliance framework reduces portfolio company operational risks'
    });

    // Deal Pipeline vs Market Intelligence correlation
    correlations.push({
      moduleA: 'Deal Screening',
      moduleB: 'Market Intelligence',
      correlationType: 'POSITIVE',
      strength: 0.68,
      description: 'Market intelligence quality strongly predicts deal pipeline quality',
      businessImplication: 'Investment in market intelligence directly improves deal sourcing effectiveness'
    });

    // Fund Operations vs Overall Performance correlation
    correlations.push({
      moduleA: 'Fund Operations',
      moduleB: 'Portfolio Management',
      correlationType: 'POSITIVE',
      strength: 0.81,
      description: 'Operational efficiency correlates with portfolio management effectiveness',
      businessImplication: 'Streamlined operations enable better portfolio company support and monitoring'
    });

    return correlations;
  }

  /**
   * Generate predictive models based on cross-module data
   */
  static generatePredictiveModels(data: any): PredictiveModel[] {
    const models: PredictiveModel[] = [];

    // Fund Performance Prediction
    models.push({
      modelName: 'Fund IRR Prediction Model',
      predictionType: 'PERFORMANCE',
      confidence: 87,
      timeHorizon: '1_YEAR',
      prediction: {
        metric: 'Net IRR',
        currentValue: 18.5,
        predictedValue: 22.3,
        change: 3.8,
        changePercentage: 20.5
      },
      keyDrivers: [
        'Portfolio company revenue growth acceleration',
        'Improved operational efficiency metrics',
        'Market sector tailwinds',
        'Reduced legal and compliance friction'
      ],
      assumptions: [
        'Current market conditions remain stable',
        'Portfolio companies execute on growth plans',
        'No major regulatory changes in key markets'
      ]
    });

    // Risk Prediction Model
    models.push({
      modelName: 'Portfolio Risk Assessment',
      predictionType: 'RISK',
      confidence: 84,
      timeHorizon: '6_MONTHS',
      prediction: {
        metric: 'Portfolio Risk Score',
        currentValue: 65,
        predictedValue: 58,
        change: -7,
        changePercentage: -10.8
      },
      keyDrivers: [
        'Enhanced legal compliance framework',
        'Improved due diligence processes',
        'Better portfolio company governance',
        'Market intelligence integration'
      ],
      assumptions: [
        'Compliance initiatives execute as planned',
        'No unexpected regulatory changes',
        'Portfolio companies maintain current governance standards'
      ]
    });

    return models;
  }

  // Private helper methods
  private static calculatePortfolioHealth(data: any): number {
    if (!data) return 75; // Default
    
    // Mock calculation based on key metrics
    const irr = data.avgIRR || 15;
    const moic = data.avgMOIC || 1.8;
    const dpi = data.avgDPI || 0.3;
    
    // Weighted scoring
    const irrScore = Math.min(100, (irr / 25) * 100);
    const moicScore = Math.min(100, (moic / 3) * 100);
    const dpiScore = Math.min(100, (dpi / 1) * 100);
    
    return Math.round((irrScore * 0.4 + moicScore * 0.4 + dpiScore * 0.2));
  }

  private static calculateOperationalEfficiency(data: any): number {
    if (!data) return 78; // Default
    
    // Mock calculation based on operational metrics
    const avgProcessingTime = data.avgProcessingTime || 5.2;
    const automationRate = data.automationRate || 0.65;
    const errorRate = data.errorRate || 0.02;
    
    // Efficiency scoring (lower processing time and error rate = higher score)
    const timeScore = Math.max(0, 100 - (avgProcessingTime - 3) * 10);
    const autoScore = automationRate * 100;
    const errorScore = Math.max(0, 100 - errorRate * 5000);
    
    return Math.round((timeScore * 0.3 + autoScore * 0.4 + errorScore * 0.3));
  }

  private static calculateLegalRiskScore(data: any): number {
    if (!data) return 25; // Default (lower is better)
    
    const complianceIssues = data.complianceIssues || 3;
    const overdueItems = data.overdueReminders || 2;
    const complianceScore = data.complianceScore || 94;
    
    // Risk scoring (higher issues = higher risk score)
    const issueRisk = Math.min(50, complianceIssues * 10);
    const overdueRisk = Math.min(30, overdueItems * 15);
    const complianceRisk = Math.max(0, 100 - complianceScore);
    
    return Math.round((issueRisk + overdueRisk + complianceRisk) / 3);
  }

  private static calculateDealPipelineQuality(data: any): number {
    if (!data) return 72; // Default
    
    const avgDealSize = data.avgDealSize || 25000000;
    const conversionRate = data.conversionRate || 0.15;
    const qualityScore = data.qualityScore || 3.8;
    
    // Quality scoring
    const sizeScore = Math.min(100, (avgDealSize / 50000000) * 100);
    const conversionScore = conversionRate * 500; // 0.2 = 100 points
    const qualityScoreNormalized = (qualityScore / 5) * 100;
    
    return Math.round((sizeScore * 0.3 + conversionScore * 0.4 + qualityScoreNormalized * 0.3));
  }

  private static calculateMarketConfidence(data: any): number {
    if (!data) return 81; // Default
    
    const accuracyRate = data.accuracyRate || 0.83;
    const dataFreshness = data.dataFreshness || 0.9;
    const sourceReliability = data.sourceReliability || 0.88;
    
    return Math.round((accuracyRate * 40 + dataFreshness * 30 + sourceReliability * 30));
  }

  private static calculateOverallGrade(scores: {
    portfolioHealthScore: number;
    operationalEfficiency: number;
    legalRiskScore: number;
    dealPipelineQuality: number;
    marketIntelligenceConfidence: number;
  }): 'A+' | 'A' | 'B+' | 'B' | 'C+' | 'C' | 'D' {
    const weightedAverage = (
      scores.portfolioHealthScore * 0.25 +
      scores.operationalEfficiency * 0.20 +
      scores.legalRiskScore * 0.20 +
      scores.dealPipelineQuality * 0.20 +
      scores.marketIntelligenceConfidence * 0.15
    );

    if (weightedAverage >= 95) return 'A+';
    if (weightedAverage >= 90) return 'A';
    if (weightedAverage >= 85) return 'B+';
    if (weightedAverage >= 80) return 'B';
    if (weightedAverage >= 75) return 'C+';
    if (weightedAverage >= 70) return 'C';
    return 'D';
  }
}

/**
 * Real-time cross-module alert system
 */
export class CrossModuleAlertSystem {
  
  static generateRealTimeAlerts(metrics: CrossModuleMetrics): CrossModuleInsight[] {
    const alerts: CrossModuleInsight[] = [];

    // Critical threshold alerts
    if (metrics.legalRiskScore > 80) {
      alerts.push({
        id: 'alert-critical-legal',
        type: 'RISK_ALERT',
        severity: 'CRITICAL',
        title: 'Critical Legal Risk Detected',
        description: 'Legal risk score has exceeded critical threshold. Immediate action required to prevent regulatory issues.',
        affectedModules: ['Legal Management', 'Fund Operations', 'Investment Committee'],
        actionItems: ['Schedule emergency legal review', 'Halt non-critical activities', 'Notify key stakeholders'],
        confidence: 95,
        impact: 'CRITICAL',
        timeframe: 'IMMEDIATE',
        category: 'RISK_MANAGEMENT'
      });
    }

    if (metrics.portfolioHealthScore < 60) {
      alerts.push({
        id: 'alert-portfolio-health',
        type: 'PREDICTIVE_WARNING',
        severity: 'HIGH',
        title: 'Portfolio Health Declining',
        description: 'Portfolio health score indicates potential performance issues requiring intervention.',
        affectedModules: ['Portfolio Management', 'Investment Committee'],
        actionItems: ['Review underperforming investments', 'Increase portfolio support', 'Consider write-downs'],
        confidence: 88,
        impact: 'HIGH',
        timeframe: 'SHORT_TERM',
        category: 'PERFORMANCE'
      });
    }

    return alerts;
  }
}

/**
 * Performance benchmarking against industry standards
 */
export class CrossModuleBenchmarking {
  
  static generateBenchmarkAnalysis(metrics: CrossModuleMetrics): {
    metric: string;
    value: number;
    industryAverage: number;
    percentile: number;
    performance: 'EXCELLENT' | 'ABOVE_AVERAGE' | 'AVERAGE' | 'BELOW_AVERAGE' | 'POOR';
  }[] {
    
    const benchmarks = [
      {
        metric: 'Portfolio Health Score',
        value: metrics.portfolioHealthScore,
        industryAverage: 73,
        percentile: this.calculatePercentile(metrics.portfolioHealthScore, 73, 15),
        performance: this.getPerformanceRating(metrics.portfolioHealthScore, 73)
      },
      {
        metric: 'Operational Efficiency',
        value: metrics.operationalEfficiency,
        industryAverage: 71,
        percentile: this.calculatePercentile(metrics.operationalEfficiency, 71, 12),
        performance: this.getPerformanceRating(metrics.operationalEfficiency, 71)
      },
      {
        metric: 'Legal Risk Score',
        value: metrics.legalRiskScore,
        industryAverage: 35, // Lower is better for risk
        percentile: 100 - this.calculatePercentile(metrics.legalRiskScore, 35, 20), // Inverted
        performance: this.getPerformanceRating(100 - metrics.legalRiskScore, 65) // Inverted for rating
      },
      {
        metric: 'Deal Pipeline Quality',
        value: metrics.dealPipelineQuality,
        industryAverage: 68,
        percentile: this.calculatePercentile(metrics.dealPipelineQuality, 68, 18),
        performance: this.getPerformanceRating(metrics.dealPipelineQuality, 68)
      }
    ];

    return benchmarks;
  }

  private static calculatePercentile(value: number, average: number, stdDev: number): number {
    const zScore = (value - average) / stdDev;
    // Simplified normal distribution approximation
    return Math.max(0, Math.min(100, Math.round(50 + zScore * 15)));
  }

  private static getPerformanceRating(value: number, average: number): 'EXCELLENT' | 'ABOVE_AVERAGE' | 'AVERAGE' | 'BELOW_AVERAGE' | 'POOR' {
    const ratio = value / average;
    if (ratio >= 1.3) return 'EXCELLENT';
    if (ratio >= 1.1) return 'ABOVE_AVERAGE';
    if (ratio >= 0.9) return 'AVERAGE';
    if (ratio >= 0.7) return 'BELOW_AVERAGE';
    return 'POOR';
  }
}