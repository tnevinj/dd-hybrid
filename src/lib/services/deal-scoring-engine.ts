/**
 * Deal Scoring Engine Service
 * Provides real financial analysis and scoring for workspace projects
 * Uses unified workspace data to generate authentic deal scores and insights
 */

import { UnifiedWorkspaceProject, UnifiedWorkspaceDataService } from '@/lib/data/unified-workspace-data';

export interface DealScoreCategory {
  score: number; // 0-100
  weight: number; // 0-1 (how much this category contributes to overall score)
  factors: ScoringFactor[];
  confidence: number; // 0-1
}

export interface ScoringFactor {
  name: string;
  value: number;
  impact: 'positive' | 'negative' | 'neutral';
  description: string;
  weight: number;
}

export interface DealScore {
  projectId: string;
  projectName: string;
  overallScore: number; // 0-100
  riskAdjustedScore: number; // Adjusted for risk rating
  categories: {
    financial: DealScoreCategory;
    operational: DealScoreCategory;
    strategic: DealScoreCategory;
    risk: DealScoreCategory;
  };
  benchmarks: {
    sectorAverage: number;
    portfolioAverage: number;
    stageAverage: number;
  };
  recommendations: string[];
  confidence: number;
  lastUpdated: Date;
}

export interface OpportunityScore {
  id: string;
  name: string;
  description: string;
  overallScore: number;
  financialScore: number;
  marketScore: number;
  riskScore: number;
  strategicFit: number;
  expectedIRR: number;
  riskAdjustedReturn: number;
  confidence: number;
  recommendation: 'strong_buy' | 'buy' | 'hold' | 'pass';
  keyFactors: string[];
  riskFactors: string[];
}

class DealScoringEngine {
  private sectorBenchmarks = {
    'Technology': { avgMultiple: 8.5, avgIRR: 22.5, riskPremium: 1.15 },
    'Healthcare': { avgMultiple: 12.0, avgIRR: 18.5, riskPremium: 0.95 },
    'Retail': { avgMultiple: 4.2, avgIRR: 15.0, riskPremium: 1.25 },
    'Manufacturing': { avgMultiple: 6.8, avgIRR: 16.5, riskPremium: 1.05 },
    'Financial Services': { avgMultiple: 2.5, avgIRR: 14.0, riskPremium: 1.35 }
  };

  private stageBenchmarks = {
    'growth': { progressExpectation: 0.65, teamSizeMultiplier: 1.2, riskAdjustment: 1.1 },
    'buyout': { progressExpectation: 0.75, teamSizeMultiplier: 1.5, riskAdjustment: 0.9 },
    'mature': { progressExpectation: 0.45, teamSizeMultiplier: 0.8, riskAdjustment: 0.8 }
  };

  /**
   * Calculate comprehensive deal score for a workspace project
   */
  scoreDeal(project: UnifiedWorkspaceProject): DealScore {
    const financialScore = this.calculateFinancialScore(project);
    const operationalScore = this.calculateOperationalScore(project);
    const strategicScore = this.calculateStrategicScore(project);
    const riskScore = this.calculateRiskScore(project);

    // Calculate weighted overall score
    const overallScore = Math.round(
      financialScore.score * financialScore.weight +
      operationalScore.score * operationalScore.weight +
      strategicScore.score * strategicScore.weight +
      riskScore.score * riskScore.weight
    );

    // Apply risk adjustment
    const riskMultiplier = this.getRiskMultiplier(project.metadata.riskRating);
    const riskAdjustedScore = Math.round(overallScore * riskMultiplier);

    const benchmarks = this.calculateBenchmarks(project);
    const recommendations = this.generateRecommendations(project, overallScore, {
      financialScore,
      operationalScore,
      strategicScore,
      riskScore
    });

    return {
      projectId: project.id,
      projectName: project.name,
      overallScore,
      riskAdjustedScore,
      categories: {
        financial: financialScore,
        operational: operationalScore,
        strategic: strategicScore,
        risk: riskScore
      },
      benchmarks,
      recommendations,
      confidence: this.calculateConfidence(project),
      lastUpdated: new Date()
    };
  }

  /**
   * Calculate financial category score based on deal metrics
   */
  private calculateFinancialScore(project: UnifiedWorkspaceProject): DealScoreCategory {
    const factors: ScoringFactor[] = [];
    let totalScore = 0;
    let totalWeight = 0;

    const dealValue = project.metadata.dealValue || 0;
    const sector = project.metadata.sector || 'Technology';
    const stage = project.metadata.stage || 'growth';

    // Deal size factor (20-50M is sweet spot for mid-market PE)
    const dealSizeFactor = this.calculateDealSizeFactor(dealValue);
    factors.push(dealSizeFactor);
    totalScore += dealSizeFactor.value * dealSizeFactor.weight;
    totalWeight += dealSizeFactor.weight;

    // Sector multiple comparison
    const sectorMultipleFactor = this.calculateSectorMultipleFactor(dealValue, sector);
    factors.push(sectorMultipleFactor);
    totalScore += sectorMultipleFactor.value * sectorMultipleFactor.weight;
    totalWeight += sectorMultipleFactor.weight;

    // Expected IRR calculation
    const irrFactor = this.calculateExpectedIRRFactor(project);
    factors.push(irrFactor);
    totalScore += irrFactor.value * irrFactor.weight;
    totalWeight += irrFactor.weight;

    // Confidence score impact
    const confidenceFactor = this.calculateConfidenceFactor(project.metadata.confidenceScore || 0.5);
    factors.push(confidenceFactor);
    totalScore += confidenceFactor.value * confidenceFactor.weight;
    totalWeight += confidenceFactor.weight;

    return {
      score: Math.round(totalScore / totalWeight * 100),
      weight: 0.35, // 35% of overall score
      factors,
      confidence: project.metadata.confidenceScore || 0.7
    };
  }

  /**
   * Calculate operational category score based on team and progress
   */
  private calculateOperationalScore(project: UnifiedWorkspaceProject): DealScoreCategory {
    const factors: ScoringFactor[] = [];
    let totalScore = 0;
    let totalWeight = 0;

    // Progress efficiency
    const progressFactor = this.calculateProgressFactor(project);
    factors.push(progressFactor);
    totalScore += progressFactor.value * progressFactor.weight;
    totalWeight += progressFactor.weight;

    // Team optimization
    const teamFactor = this.calculateTeamFactor(project);
    factors.push(teamFactor);
    totalScore += teamFactor.value * teamFactor.weight;
    totalWeight += teamFactor.weight;

    // Work products quality
    const workProductFactor = this.calculateWorkProductFactor(project);
    factors.push(workProductFactor);
    totalScore += workProductFactor.value * workProductFactor.weight;
    totalWeight += workProductFactor.weight;

    // Deadline adherence
    const timelineFactor = this.calculateTimelineFactor(project);
    factors.push(timelineFactor);
    totalScore += timelineFactor.value * timelineFactor.weight;
    totalWeight += timelineFactor.weight;

    return {
      score: Math.round(totalScore / totalWeight * 100),
      weight: 0.25, // 25% of overall score
      factors,
      confidence: 0.85
    };
  }

  /**
   * Calculate strategic category score
   */
  private calculateStrategicScore(project: UnifiedWorkspaceProject): DealScoreCategory {
    const factors: ScoringFactor[] = [];
    let totalScore = 0;
    let totalWeight = 0;

    // Sector fit
    const sectorFactor = this.calculateSectorStrategicFit(project.metadata.sector);
    factors.push(sectorFactor);
    totalScore += sectorFactor.value * sectorFactor.weight;
    totalWeight += sectorFactor.weight;

    // Geographic fit
    const geoFactor = this.calculateGeographicFit(project.metadata.geography);
    factors.push(geoFactor);
    totalScore += geoFactor.value * geoFactor.weight;
    totalWeight += geoFactor.weight;

    // Deal stage alignment
    const stageFactor = this.calculateStageAlignment(project.metadata.stage);
    factors.push(stageFactor);
    totalScore += stageFactor.value * stageFactor.weight;
    totalWeight += stageFactor.weight;

    // Portfolio diversification benefit
    const diversificationFactor = this.calculateDiversificationBenefit(project);
    factors.push(diversificationFactor);
    totalScore += diversificationFactor.value * diversificationFactor.weight;
    totalWeight += diversificationFactor.weight;

    return {
      score: Math.round(totalScore / totalWeight * 100),
      weight: 0.20, // 20% of overall score
      factors,
      confidence: 0.75
    };
  }

  /**
   * Calculate risk category score
   */
  private calculateRiskScore(project: UnifiedWorkspaceProject): DealScoreCategory {
    const factors: ScoringFactor[] = [];
    let totalScore = 0;
    let totalWeight = 0;

    // Base risk rating
    const riskRatingFactor = this.calculateRiskRatingFactor(project.metadata.riskRating);
    factors.push(riskRatingFactor);
    totalScore += riskRatingFactor.value * riskRatingFactor.weight;
    totalWeight += riskRatingFactor.weight;

    // Sector risk
    const sectorRiskFactor = this.calculateSectorRisk(project.metadata.sector);
    factors.push(sectorRiskFactor);
    totalScore += sectorRiskFactor.value * sectorRiskFactor.weight;
    totalWeight += sectorRiskFactor.weight;

    // Geographic risk
    const geoRiskFactor = this.calculateGeographicRisk(project.metadata.geography);
    factors.push(geoRiskFactor);
    totalScore += geoRiskFactor.value * geoRiskFactor.weight;
    totalWeight += geoRiskFactor.weight;

    // Execution risk based on progress and timeline
    const executionRiskFactor = this.calculateExecutionRisk(project);
    factors.push(executionRiskFactor);
    totalScore += executionRiskFactor.value * executionRiskFactor.weight;
    totalWeight += executionRiskFactor.weight;

    return {
      score: Math.round(totalScore / totalWeight * 100),
      weight: 0.20, // 20% of overall score
      factors,
      confidence: 0.90
    };
  }

  // Helper methods for factor calculations

  private calculateDealSizeFactor(dealValue: number): ScoringFactor {
    let score = 0.5;
    let impact: 'positive' | 'negative' | 'neutral' = 'neutral';
    
    if (dealValue >= 20000000 && dealValue <= 100000000) {
      score = 0.8; // Sweet spot
      impact = 'positive';
    } else if (dealValue > 100000000) {
      score = 0.65; // Larger deals, more complexity
      impact = 'neutral';
    } else if (dealValue < 20000000) {
      score = 0.4; // Too small for efficient execution
      impact = 'negative';
    }

    return {
      name: 'Deal Size Optimization',
      value: score,
      impact,
      description: `Deal size of $${(dealValue/1000000).toFixed(1)}M ${impact === 'positive' ? 'is optimal for mid-market PE' : impact === 'negative' ? 'may be too small for efficient execution' : 'is manageable but requires careful resource allocation'}`,
      weight: 0.3
    };
  }

  private calculateSectorMultipleFactor(dealValue: number, sector: string): ScoringFactor {
    const benchmark = this.sectorBenchmarks[sector as keyof typeof this.sectorBenchmarks];
    if (!benchmark) {
      return {
        name: 'Sector Multiple Analysis',
        value: 0.5,
        impact: 'neutral',
        description: 'Sector benchmarks not available',
        weight: 0.25
      };
    }

    // Assume EBITDA of 15% of deal value for scoring purposes
    const impliedEBITDA = dealValue * 0.15;
    const impliedMultiple = dealValue / impliedEBITDA;
    const multipleDifference = impliedMultiple / benchmark.avgMultiple;

    let score = 0.5;
    let impact: 'positive' | 'negative' | 'neutral' = 'neutral';

    if (multipleDifference < 0.9) {
      score = 0.85; // Attractive valuation
      impact = 'positive';
    } else if (multipleDifference > 1.2) {
      score = 0.3; // Expensive
      impact = 'negative';
    } else {
      score = 0.6; // Fair valuation
      impact = 'neutral';
    }

    return {
      name: 'Valuation Multiple',
      value: score,
      impact,
      description: `Implied multiple of ${impliedMultiple.toFixed(1)}x vs sector average of ${benchmark.avgMultiple}x`,
      weight: 0.25
    };
  }

  private calculateExpectedIRRFactor(project: UnifiedWorkspaceProject): ScoringFactor {
    const sector = project.metadata.sector || 'Technology';
    const benchmark = this.sectorBenchmarks[sector as keyof typeof this.sectorBenchmarks];
    const targetIRR = benchmark?.avgIRR || 20;
    
    // Calculate expected IRR based on deal characteristics
    let expectedIRR = targetIRR;
    
    // Adjust based on risk rating
    const riskRating = project.metadata.riskRating;
    if (riskRating === 'low') expectedIRR -= 2;
    else if (riskRating === 'high') expectedIRR += 4;
    
    // Adjust based on progress (higher progress = more certainty = lower required return)
    const progressAdjustment = (project.progress - 50) / 50 * 2; // -2% to +2%
    expectedIRR -= progressAdjustment;

    let score = 0.5;
    let impact: 'positive' | 'negative' | 'neutral' = 'neutral';

    if (expectedIRR > 25) {
      score = 0.9;
      impact = 'positive';
    } else if (expectedIRR > 18) {
      score = 0.7;
      impact = 'positive';
    } else if (expectedIRR < 12) {
      score = 0.2;
      impact = 'negative';
    }

    return {
      name: 'Expected IRR',
      value: score,
      impact,
      description: `Projected IRR of ${expectedIRR.toFixed(1)}% vs sector target of ${targetIRR}%`,
      weight: 0.3
    };
  }

  private calculateConfidenceFactor(confidenceScore: number): ScoringFactor {
    return {
      name: 'Analysis Confidence',
      value: confidenceScore,
      impact: confidenceScore > 0.8 ? 'positive' : confidenceScore < 0.6 ? 'negative' : 'neutral',
      description: `${(confidenceScore * 100).toFixed(0)}% confidence in analysis accuracy`,
      weight: 0.15
    };
  }

  private calculateProgressFactor(project: UnifiedWorkspaceProject): ScoringFactor {
    const stage = project.metadata.stage || 'growth';
    const benchmark = this.stageBenchmarks[stage as keyof typeof this.stageBenchmarks];
    const expectedProgress = benchmark?.progressExpectation * 100 || 50;
    
    const progressRatio = project.progress / expectedProgress;
    let score = Math.min(progressRatio, 1.2) / 1.2; // Cap at 120% of expected
    
    return {
      name: 'Progress Efficiency',
      value: score,
      impact: score > 0.8 ? 'positive' : score < 0.6 ? 'negative' : 'neutral',
      description: `${project.progress}% progress vs ${expectedProgress.toFixed(0)}% expected for ${stage} stage`,
      weight: 0.4
    };
  }

  private calculateTeamFactor(project: UnifiedWorkspaceProject): ScoringFactor {
    const dealValue = project.metadata.dealValue || 50000000;
    const teamSize = project.teamSize;
    
    // Optimal team size calculation based on deal complexity
    let optimalTeamSize = 3; // Base team
    if (dealValue > 75000000) optimalTeamSize += 2; // Larger deals need more people
    if (project.metadata.sector === 'Healthcare') optimalTeamSize += 1; // Healthcare requires specialized knowledge
    if (project.metadata.riskRating === 'high') optimalTeamSize += 1; // High risk needs more oversight
    
    const teamEfficiency = Math.min(teamSize / optimalTeamSize, 1.5) / 1.5;
    
    return {
      name: 'Team Optimization',
      value: teamEfficiency,
      impact: teamEfficiency > 0.8 ? 'positive' : teamEfficiency < 0.6 ? 'negative' : 'neutral',
      description: `Team of ${teamSize} vs optimal ${optimalTeamSize} for this deal complexity`,
      weight: 0.3
    };
  }

  private calculateWorkProductFactor(project: UnifiedWorkspaceProject): ScoringFactor {
    const workProductRatio = project.workProducts / 10; // Assume 10 is excellent
    const score = Math.min(workProductRatio, 1.2) / 1.2;
    
    return {
      name: 'Work Product Quality',
      value: score,
      impact: score > 0.7 ? 'positive' : score < 0.4 ? 'negative' : 'neutral',
      description: `${project.workProducts} work products indicating ${score > 0.7 ? 'thorough' : score < 0.4 ? 'limited' : 'adequate'} analysis depth`,
      weight: 0.2
    };
  }

  private calculateTimelineFactor(project: UnifiedWorkspaceProject): ScoringFactor {
    if (!project.deadline) {
      return {
        name: 'Timeline Management',
        value: 0.6,
        impact: 'neutral',
        description: 'No deadline specified',
        weight: 0.1
      };
    }

    const daysToDeadline = (project.deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24);
    const progressRate = project.progress / 100;
    const remainingWork = 1 - progressRate;
    const workPerDay = remainingWork / Math.max(daysToDeadline, 1);

    let score = 0.5;
    let impact: 'positive' | 'negative' | 'neutral' = 'neutral';

    if (workPerDay < 0.02) { // Less than 2% work per day
      score = 0.9;
      impact = 'positive';
    } else if (workPerDay > 0.05) { // More than 5% work per day
      score = 0.3;
      impact = 'negative';
    }

    return {
      name: 'Timeline Adherence',
      value: score,
      impact,
      description: `${daysToDeadline.toFixed(0)} days remaining, ${(remainingWork * 100).toFixed(0)}% work left`,
      weight: 0.1
    };
  }

  private calculateSectorStrategicFit(sector?: string): ScoringFactor {
    const sectorScores: { [key: string]: number } = {
      'Technology': 0.9, // High strategic priority
      'Healthcare': 0.85, // High strategic priority
      'Manufacturing': 0.6, // Medium strategic priority
      'Retail': 0.5, // Lower strategic priority due to disruption
      'Financial Services': 0.7 // Medium-high strategic priority
    };

    const score = sectorScores[sector || 'Technology'] || 0.5;

    return {
      name: 'Sector Strategic Fit',
      value: score,
      impact: score > 0.75 ? 'positive' : score < 0.55 ? 'negative' : 'neutral',
      description: `${sector} aligns ${score > 0.75 ? 'strongly' : score < 0.55 ? 'weakly' : 'moderately'} with portfolio strategy`,
      weight: 0.4
    };
  }

  private calculateGeographicFit(geography?: string): ScoringFactor {
    const geoScores: { [key: string]: number } = {
      'North America': 0.9,
      'Europe': 0.75,
      'Asia Pacific': 0.6,
      'Latin America': 0.4,
      'Africa': 0.3,
      'Middle East': 0.4
    };

    const score = geoScores[geography || 'North America'] || 0.5;

    return {
      name: 'Geographic Fit',
      value: score,
      impact: score > 0.75 ? 'positive' : score < 0.5 ? 'negative' : 'neutral',
      description: `${geography} matches ${score > 0.75 ? 'core' : score < 0.5 ? 'non-core' : 'secondary'} geographic focus`,
      weight: 0.3
    };
  }

  private calculateStageAlignment(stage?: string): ScoringFactor {
    const stageScores: { [key: string]: number } = {
      'growth': 0.9,
      'buyout': 0.85,
      'mature': 0.6,
      'venture': 0.4,
      'distressed': 0.3
    };

    const score = stageScores[stage || 'growth'] || 0.5;

    return {
      name: 'Deal Stage Alignment',
      value: score,
      impact: score > 0.8 ? 'positive' : score < 0.5 ? 'negative' : 'neutral',
      description: `${stage} stage ${score > 0.8 ? 'strongly matches' : score < 0.5 ? 'misaligns with' : 'fits'} investment criteria`,
      weight: 0.3
    };
  }

  private calculateDiversificationBenefit(project: UnifiedWorkspaceProject): ScoringFactor {
    // This would ideally check against existing portfolio
    // For now, assume moderate diversification benefit
    const sector = project.metadata.sector;
    const geography = project.metadata.geography;
    
    // Simplified diversification logic
    let score = 0.6; // Baseline
    
    if (sector === 'Technology' || sector === 'Healthcare') {
      score += 0.1; // High-growth sectors
    }
    
    if (geography === 'Europe' || geography === 'Asia Pacific') {
      score += 0.1; // Geographic diversification
    }

    return {
      name: 'Portfolio Diversification',
      value: Math.min(score, 1.0),
      impact: score > 0.7 ? 'positive' : 'neutral',
      description: `Deal adds ${score > 0.7 ? 'strong' : 'moderate'} diversification benefit`,
      weight: 0.3
    };
  }

  private calculateRiskRatingFactor(riskRating?: string): ScoringFactor {
    const riskScores: { [key: string]: number } = {
      'low': 0.9,
      'medium': 0.7,
      'high': 0.4,
      'critical': 0.1
    };

    const score = riskScores[riskRating || 'medium'] || 0.7;

    return {
      name: 'Base Risk Assessment',
      value: score,
      impact: score > 0.8 ? 'positive' : score < 0.5 ? 'negative' : 'neutral',
      description: `${riskRating} risk rating indicates ${score > 0.8 ? 'low' : score < 0.5 ? 'high' : 'moderate'} investment risk`,
      weight: 0.4
    };
  }

  private calculateSectorRisk(sector?: string): ScoringFactor {
    const sectorRisks: { [key: string]: number } = {
      'Technology': 0.6, // High volatility but good returns
      'Healthcare': 0.8, // Lower volatility, regulatory risk
      'Manufacturing': 0.7, // Cyclical but stable
      'Retail': 0.4, // High disruption risk
      'Financial Services': 0.5 // Regulatory and market risk
    };

    const score = sectorRisks[sector || 'Technology'] || 0.6;

    return {
      name: 'Sector Risk Profile',
      value: score,
      impact: score > 0.75 ? 'positive' : score < 0.5 ? 'negative' : 'neutral',
      description: `${sector} sector has ${score > 0.75 ? 'low' : score < 0.5 ? 'high' : 'moderate'} inherent risk`,
      weight: 0.3
    };
  }

  private calculateGeographicRisk(geography?: string): ScoringFactor {
    const geoRisks: { [key: string]: number } = {
      'North America': 0.9,
      'Europe': 0.8,
      'Asia Pacific': 0.6,
      'Latin America': 0.4,
      'Africa': 0.2,
      'Middle East': 0.3
    };

    const score = geoRisks[geography || 'North America'] || 0.6;

    return {
      name: 'Geographic Risk',
      value: score,
      impact: score > 0.75 ? 'positive' : score < 0.5 ? 'negative' : 'neutral',
      description: `${geography} has ${score > 0.75 ? 'low' : score < 0.5 ? 'high' : 'moderate'} political/economic risk`,
      weight: 0.2
    };
  }

  private calculateExecutionRisk(project: UnifiedWorkspaceProject): ScoringFactor {
    let score = 0.7; // Base execution capability

    // Adjust based on progress vs timeline
    if (project.deadline) {
      const daysToDeadline = (project.deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24);
      const progressRate = project.progress / 100;
      
      if (progressRate > 0.8 && daysToDeadline > 0) {
        score += 0.2; // Good progress with time remaining
      } else if (progressRate < 0.3 && daysToDeadline < 30) {
        score -= 0.3; // Poor progress with deadline approaching
      }
    }

    // Team size adequacy
    const teamSize = project.teamSize;
    const dealValue = project.metadata.dealValue || 50000000;
    const expectedTeamSize = dealValue > 100000000 ? 6 : dealValue > 50000000 ? 4 : 3;
    
    if (teamSize >= expectedTeamSize) {
      score += 0.1;
    } else if (teamSize < expectedTeamSize * 0.7) {
      score -= 0.2;
    }

    score = Math.max(0, Math.min(1, score));

    return {
      name: 'Execution Risk',
      value: score,
      impact: score > 0.8 ? 'positive' : score < 0.5 ? 'negative' : 'neutral',
      description: `${score > 0.8 ? 'Low' : score < 0.5 ? 'High' : 'Moderate'} execution risk based on progress and resources`,
      weight: 0.3
    };
  }

  private getRiskMultiplier(riskRating?: string): number {
    const multipliers: { [key: string]: number } = {
      'low': 1.05,
      'medium': 1.0,
      'high': 0.9,
      'critical': 0.75
    };

    return multipliers[riskRating || 'medium'] || 1.0;
  }

  private calculateBenchmarks(project: UnifiedWorkspaceProject) {
    const sector = project.metadata.sector || 'Technology';
    const stage = project.metadata.stage || 'growth';
    
    // Get all projects for portfolio average
    const allProjects = UnifiedWorkspaceDataService.getAllProjects();
    const portfolioScores = allProjects.map(p => this.quickScore(p));
    const portfolioAverage = portfolioScores.reduce((sum, score) => sum + score, 0) / portfolioScores.length;

    // Sector average (would be from database in production)
    const sectorAverage = this.sectorBenchmarks[sector as keyof typeof this.sectorBenchmarks]?.avgIRR || 70;

    // Stage average
    const stageProjects = allProjects.filter(p => p.metadata.stage === stage);
    const stageScores = stageProjects.map(p => this.quickScore(p));
    const stageAverage = stageScores.length > 0 
      ? stageScores.reduce((sum, score) => sum + score, 0) / stageScores.length 
      : portfolioAverage;

    return {
      sectorAverage,
      portfolioAverage,
      stageAverage
    };
  }

  private quickScore(project: UnifiedWorkspaceProject): number {
    // Simplified scoring for benchmarks
    let score = 50; // Base score
    
    if (project.metadata.riskRating === 'low') score += 20;
    else if (project.metadata.riskRating === 'high') score -= 15;
    
    score += (project.progress - 50) * 0.4; // Progress factor
    score += (project.metadata.confidenceScore || 0.5) * 20; // Confidence factor
    
    if (project.metadata.sector === 'Technology' || project.metadata.sector === 'Healthcare') {
      score += 10; // Strategic sectors
    }
    
    return Math.max(0, Math.min(100, score));
  }

  private generateRecommendations(
    project: UnifiedWorkspaceProject, 
    overallScore: number, 
    categoryScores: {
      financialScore: DealScoreCategory;
      operationalScore: DealScoreCategory;
      strategicScore: DealScoreCategory;
      riskScore: DealScoreCategory;
    }
  ): string[] {
    const recommendations: string[] = [];

    // Overall score recommendations
    if (overallScore >= 80) {
      recommendations.push('STRONG BUY: Excellent opportunity with strong fundamentals across all categories');
    } else if (overallScore >= 65) {
      recommendations.push('BUY: Solid investment opportunity with good risk-adjusted returns');
    } else if (overallScore >= 45) {
      recommendations.push('HOLD: Proceed with caution - address key risk factors before committing');
    } else {
      recommendations.push('PASS: Significant concerns across multiple evaluation criteria');
    }

    // Category-specific recommendations
    if (categoryScores.financialScore.score < 60) {
      recommendations.push('Consider renegotiating valuation terms or deal structure');
    }

    if (categoryScores.operationalScore.score < 60) {
      recommendations.push('Increase team resources or extend timeline to improve execution probability');
    }

    if (categoryScores.riskScore.score < 60) {
      recommendations.push('Implement additional risk mitigation measures before proceeding');
    }

    if (categoryScores.strategicScore.score > 80) {
      recommendations.push('High strategic value - consider fast-tracking through approval process');
    }

    // Deal-specific recommendations
    const dealValue = project.metadata.dealValue || 0;
    if (dealValue > 100000000) {
      recommendations.push('Large deal size - ensure adequate capital allocation and resources');
    }

    if (project.metadata.riskRating === 'high') {
      recommendations.push('High risk designation - consider co-investment or structured protection');
    }

    return recommendations;
  }

  private calculateConfidence(project: UnifiedWorkspaceProject): number {
    let confidence = 0.7; // Base confidence

    // Higher confidence for more complete projects
    confidence += (project.progress / 100) * 0.2;

    // Higher confidence for larger teams (more eyes on analysis)
    confidence += Math.min(project.teamSize / 6, 1) * 0.1;

    // Confidence from metadata
    if (project.metadata.confidenceScore) {
      confidence = (confidence + project.metadata.confidenceScore) / 2;
    }

    return Math.min(0.99, Math.max(0.5, confidence));
  }

  /**
   * Score all workspace projects as deal opportunities
   */
  scoreAllOpportunities(): OpportunityScore[] {
    const projects = UnifiedWorkspaceDataService.getAllProjects();
    
    return projects.map(project => {
      const dealScore = this.scoreDeal(project);
      
      return {
        id: project.id,
        name: project.name,
        description: this.generateOpportunityDescription(project),
        overallScore: dealScore.overallScore,
        financialScore: dealScore.categories.financial.score,
        marketScore: dealScore.categories.strategic.score,
        riskScore: dealScore.categories.risk.score,
        strategicFit: dealScore.categories.strategic.score,
        expectedIRR: this.calculateExpectedIRR(project),
        riskAdjustedReturn: dealScore.riskAdjustedScore,
        confidence: dealScore.confidence,
        recommendation: this.getRecommendation(dealScore.riskAdjustedScore),
        keyFactors: this.extractKeyFactors(dealScore),
        riskFactors: this.extractRiskFactors(dealScore)
      };
    });
  }

  private generateOpportunityDescription(project: UnifiedWorkspaceProject): string {
    const sector = project.metadata.sector;
    const geography = project.metadata.geography;
    const stage = project.metadata.stage;
    const dealValue = project.metadata.dealValue;

    let description = `${sector} ${stage} opportunity`;
    
    if (dealValue) {
      description += ` valued at $${(dealValue / 1000000).toFixed(0)}M`;
    }
    
    if (geography) {
      description += ` based in ${geography}`;
    }
    
    description += `. Current analysis shows ${project.progress}% completion with ${project.teamSize} team members conducting comprehensive due diligence.`;
    
    return description;
  }

  private calculateExpectedIRR(project: UnifiedWorkspaceProject): number {
    const sector = project.metadata.sector || 'Technology';
    const benchmark = this.sectorBenchmarks[sector as keyof typeof this.sectorBenchmarks];
    let expectedIRR = benchmark?.avgIRR || 20;
    
    // Adjust based on risk
    const riskRating = project.metadata.riskRating;
    if (riskRating === 'low') expectedIRR -= 2;
    else if (riskRating === 'high') expectedIRR += 3;
    
    // Adjust based on progress (more analysis = more confidence = lower required return)
    const progressAdjustment = (project.progress - 50) / 50 * 2;
    expectedIRR -= progressAdjustment;
    
    return Math.max(8, Math.min(35, expectedIRR));
  }

  private getRecommendation(score: number): 'strong_buy' | 'buy' | 'hold' | 'pass' {
    if (score >= 80) return 'strong_buy';
    if (score >= 65) return 'buy';
    if (score >= 45) return 'hold';
    return 'pass';
  }

  private extractKeyFactors(dealScore: DealScore): string[] {
    const factors: string[] = [];
    
    // Get top positive factors from each category
    Object.values(dealScore.categories).forEach(category => {
      const positiveFactors = category.factors
        .filter(f => f.impact === 'positive')
        .sort((a, b) => b.value - a.value)
        .slice(0, 1);
      
      positiveFactors.forEach(factor => {
        factors.push(factor.description);
      });
    });

    return factors.slice(0, 4); // Top 4 key factors
  }

  private extractRiskFactors(dealScore: DealScore): string[] {
    const factors: string[] = [];
    
    // Get negative factors from each category
    Object.values(dealScore.categories).forEach(category => {
      const negativeFactors = category.factors
        .filter(f => f.impact === 'negative')
        .sort((a, b) => a.value - b.value)
        .slice(0, 1);
      
      negativeFactors.forEach(factor => {
        factors.push(factor.description);
      });
    });

    return factors.slice(0, 3); // Top 3 risk factors
  }
}

// Export singleton instance
export const dealScoringEngine = new DealScoringEngine();
export default dealScoringEngine;
