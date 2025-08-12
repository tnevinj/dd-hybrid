/**
 * AI Deal Structuring Service
 * Provides intelligent deal structuring recommendations, pattern recognition,
 * and automated analysis across different modes
 */

import { DealStructuringProject, AIRecommendation } from '@/types/deal-structuring';

export interface StructuringRecommendation {
  id: string;
  type: 'structure' | 'pricing' | 'risk' | 'optimization' | 'template';
  priority: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  reasoning: string;
  confidence: number;
  potentialImpact: {
    irr: number;
    riskReduction: number;
    timeToClose: number;
    costSavings: number;
  };
  actions: Array<{
    id: string;
    label: string;
    action: string;
    params?: Record<string, any>;
    estimatedTime?: number;
  }>;
  supportingData: {
    benchmarkData?: any;
    riskFactors?: string[];
    comparableDeals?: string[];
  };
}

export interface FinancialModelSuggestion {
  modelType: 'DCF' | 'LBO' | 'SOP' | 'NAV' | 'Comparable';
  parameters: Record<string, number>;
  assumptions: Array<{
    parameter: string;
    value: number;
    reasoning: string;
    confidence: number;
  }>;
  sensitivity: Array<{
    variable: string;
    impact: number;
    scenarios: { bear: number; base: number; bull: number };
  }>;
}

export interface RiskAssessment {
  overallRisk: 'low' | 'medium' | 'high' | 'critical';
  riskScore: number; // 0-100
  categories: Array<{
    category: 'financial' | 'operational' | 'market' | 'regulatory' | 'execution';
    risk: 'low' | 'medium' | 'high';
    factors: string[];
    mitigation: string[];
    impact: number;
  }>;
  monitoring: Array<{
    metric: string;
    threshold: number;
    frequency: 'daily' | 'weekly' | 'monthly';
    alertLevel: 'info' | 'warning' | 'critical';
  }>;
}

export interface PatternMatch {
  dealId: string;
  dealName: string;
  similarity: number;
  matchedAttributes: string[];
  outcomes: {
    irr: number;
    multiple: number;
    exitTime: number;
    success: boolean;
  };
  applicableStrategies: string[];
}

export class AIDealStructuringService {
  
  /**
   * Generate intelligent structuring recommendations for a deal
   */
  static generateStructuringRecommendations(
    deal: DealStructuringProject,
    mode: 'traditional' | 'assisted' | 'autonomous'
  ): StructuringRecommendation[] {
    const recommendations: StructuringRecommendation[] = [];
    
    // Analyze deal characteristics for structure optimization
    if (deal.keyMetrics?.leverage && deal.keyMetrics.leverage > 4.0) {
      recommendations.push({
        id: `leverage-opt-${deal.id}`,
        type: 'risk',
        priority: 'high',
        title: 'Leverage Optimization Opportunity',
        description: `Current leverage of ${deal.keyMetrics.leverage.toFixed(1)}x may be optimized for better risk-return profile`,
        reasoning: `Based on ${deal.type} deals in ${this.getSectorFromType(deal.type)}, optimal leverage ranges 3.2-3.8x for similar risk profiles`,
        confidence: 0.87,
        potentialImpact: {
          irr: 2.3,
          riskReduction: 15,
          timeToClose: -10,
          costSavings: 0
        },
        actions: [
          {
            id: 'analyze-leverage',
            label: 'Analyze Capital Structure',
            action: 'OPTIMIZE_LEVERAGE',
            params: { currentLeverage: deal.keyMetrics.leverage, targetRange: [3.2, 3.8] },
            estimatedTime: 120
          },
          {
            id: 'model-scenarios',
            label: 'Model Scenarios',
            action: 'RUN_LEVERAGE_SCENARIOS',
            estimatedTime: 180
          }
        ],
        supportingData: {
          benchmarkData: this.getBenchmarkData(deal.type),
          riskFactors: ['Interest rate sensitivity', 'Cash flow volatility', 'Covenant headroom'],
          comparableDeals: ['TechCorp-2023', 'CloudCo-2023', 'DataTech-2024']
        }
      });
    }

    // Pricing optimization based on deal characteristics
    if (deal.currentValuation && deal.targetValue) {
      const discount = ((deal.targetValue - deal.currentValuation) / deal.targetValue) * 100;
      if (discount < 5) {
        recommendations.push({
          id: `pricing-opt-${deal.id}`,
          type: 'pricing',
          priority: 'medium',
          title: 'Pricing Strategy Review',
          description: `Current ${discount.toFixed(1)}% discount may not adequately reflect execution risk`,
          reasoning: 'Similar transactions typically trade at 8-12% discount to NAV for comparable risk profiles',
          confidence: 0.73,
          potentialImpact: {
            irr: 1.8,
            riskReduction: 8,
            timeToClose: 0,
            costSavings: 0
          },
          actions: [
            {
              id: 'pricing-analysis',
              label: 'Deep Dive Pricing',
              action: 'ANALYZE_PRICING',
              params: { currentDiscount: discount, targetRange: [8, 12] }
            }
          ],
          supportingData: {
            benchmarkData: { sectorMedian: 10.2, recentDeals: [8.5, 11.3, 9.8] }
          }
        });
      }
    }

    // Structure type optimization
    const structureRecommendation = this.analyzeOptimalStructure(deal);
    if (structureRecommendation) {
      recommendations.push(structureRecommendation);
    }

    // Add more recommendations based on mode
    if (mode === 'assisted' || mode === 'autonomous') {
      recommendations.push(...this.generateAdvancedRecommendations(deal));
    }

    return recommendations.sort((a, b) => {
      const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  }

  /**
   * Generate financial modeling suggestions
   */
  static generateFinancialModelSuggestions(deal: DealStructuringProject): FinancialModelSuggestion {
    const baseModel = this.getBaseModelType(deal.type);
    
    return {
      modelType: baseModel,
      parameters: this.generateModelParameters(deal),
      assumptions: this.generateModelAssumptions(deal),
      sensitivity: this.generateSensitivityAnalysis(deal)
    };
  }

  /**
   * Perform comprehensive risk assessment
   */
  static performRiskAssessment(deal: DealStructuringProject): RiskAssessment {
    const riskCategories = this.analyzeRiskCategories(deal);
    const overallRisk = this.calculateOverallRisk(riskCategories);
    
    return {
      overallRisk,
      riskScore: this.calculateRiskScore(riskCategories),
      categories: riskCategories,
      monitoring: this.generateMonitoringPlan(deal, riskCategories)
    };
  }

  /**
   * Find similar deals and patterns
   */
  static findSimilarDeals(deal: DealStructuringProject): PatternMatch[] {
    // Mock similar deals - in production would query deal database
    const mockSimilarDeals = [
      {
        dealId: 'tech-2023-q2',
        dealName: 'CloudCo Secondary',
        similarity: 0.89,
        matchedAttributes: ['Sector', 'Deal Size', 'Structure Type', 'Geography'],
        outcomes: { irr: 22.1, multiple: 2.8, exitTime: 3.2, success: true },
        applicableStrategies: ['Aggressive growth capex', 'Management rollover', 'Dividend recap timing']
      },
      {
        dealId: 'tech-2023-q4', 
        dealName: 'DataTech Continuation',
        similarity: 0.76,
        matchedAttributes: ['Sector', 'Structure Type', 'Risk Profile'],
        outcomes: { irr: 18.9, multiple: 2.4, exitTime: 4.1, success: true },
        applicableStrategies: ['Conservative leverage', 'Operational improvements', 'Multiple expansion focus']
      }
    ];

    return mockSimilarDeals.sort((a, b) => b.similarity - a.similarity);
  }

  /**
   * Execute autonomous tasks based on confidence and complexity
   */
  static async executeAutonomousTasks(
    deal: DealStructuringProject,
    tasks: string[]
  ): Promise<Array<{task: string; status: 'completed' | 'failed' | 'requires_approval'; result?: any; confidence?: number}>> {
    const results = [];

    for (const task of tasks) {
      const confidence = this.calculateTaskConfidence(task, deal);
      
      if (confidence >= 0.80) {
        // Auto-execute high confidence tasks
        const result = await this.executeTask(task, deal);
        results.push({
          task,
          status: 'completed' as const,
          result,
          confidence
        });
      } else {
        // Flag for human approval
        results.push({
          task,
          status: 'requires_approval' as const,
          confidence
        });
      }
    }

    return results;
  }

  // Private helper methods
  private static getSectorFromType(dealType: string): string {
    const sectorMap = {
      'LBO_STRUCTURE': 'Technology',
      'SINGLE_ASSET_CONTINUATION': 'Technology', 
      'MULTI_ASSET_CONTINUATION': 'Diversified'
    };
    return sectorMap[dealType] || 'Technology';
  }

  private static getBenchmarkData(dealType: string) {
    return {
      averageLeverage: 3.4,
      medianDiscount: 9.8,
      typicalIRR: 19.2,
      successRate: 0.78
    };
  }

  private static analyzeOptimalStructure(deal: DealStructuringProject): StructuringRecommendation | null {
    // Analysis logic for structure optimization
    if (deal.type === 'LBO_STRUCTURE' && deal.keyMetrics?.irr && deal.keyMetrics.irr < 20) {
      return {
        id: `structure-opt-${deal.id}`,
        type: 'structure',
        priority: 'medium',
        title: 'Consider Hybrid Structure',
        description: 'Current LBO structure may benefit from preferred equity component',
        reasoning: 'Hybrid structures typically achieve 2-3% higher IRR for similar risk profiles',
        confidence: 0.71,
        potentialImpact: { irr: 2.5, riskReduction: 10, timeToClose: 5, costSavings: 0 },
        actions: [{
          id: 'model-hybrid',
          label: 'Model Hybrid Structure',
          action: 'MODEL_HYBRID_STRUCTURE'
        }],
        supportingData: {}
      };
    }
    return null;
  }

  private static generateAdvancedRecommendations(deal: DealStructuringProject): StructuringRecommendation[] {
    // Additional AI-driven recommendations for assisted/autonomous modes
    return [
      {
        id: `timing-opt-${deal.id}`,
        type: 'optimization',
        priority: 'low',
        title: 'Market Timing Analysis',
        description: 'Current market conditions favor accelerated closing timeline',
        reasoning: 'Credit spreads are 50bps below 12-month average, suggesting favorable financing window',
        confidence: 0.65,
        potentialImpact: { irr: 0.8, riskReduction: 5, timeToClose: -30, costSavings: 2.5 },
        actions: [{
          id: 'accelerate-timeline',
          label: 'Accelerate Process',
          action: 'ACCELERATE_TIMELINE'
        }],
        supportingData: {}
      }
    ];
  }

  private static getBaseModelType(dealType: string): FinancialModelSuggestion['modelType'] {
    const modelMap = {
      'LBO_STRUCTURE': 'LBO' as const,
      'SINGLE_ASSET_CONTINUATION': 'NAV' as const,
      'MULTI_ASSET_CONTINUATION': 'SOP' as const
    };
    return modelMap[dealType] || 'DCF';
  }

  private static generateModelParameters(deal: DealStructuringProject): Record<string, number> {
    return {
      discountRate: 12.5,
      terminalGrowth: 3.0,
      leverageTarget: deal.keyMetrics?.leverage || 3.5,
      equityContribution: deal.keyMetrics?.equityContribution || 50000000
    };
  }

  private static generateModelAssumptions(deal: DealStructuringProject): FinancialModelSuggestion['assumptions'] {
    return [
      {
        parameter: 'Revenue Growth',
        value: 8.5,
        reasoning: 'Based on sector median and company historical performance',
        confidence: 0.82
      },
      {
        parameter: 'EBITDA Margin',
        value: 35.2,
        reasoning: 'Consistent with operational improvement plan',
        confidence: 0.76
      }
    ];
  }

  private static generateSensitivityAnalysis(deal: DealStructuringProject): FinancialModelSuggestion['sensitivity'] {
    return [
      {
        variable: 'Revenue Growth',
        impact: 15.3,
        scenarios: { bear: 5.2, base: 8.5, bull: 12.1 }
      },
      {
        variable: 'Exit Multiple',
        impact: 22.7,
        scenarios: { bear: 8.5, base: 10.2, bull: 12.8 }
      }
    ];
  }

  private static analyzeRiskCategories(deal: DealStructuringProject): RiskAssessment['categories'] {
    const categories = [
      {
        category: 'financial' as const,
        risk: deal.keyMetrics?.leverage && deal.keyMetrics.leverage > 4 ? 'high' as const : 'medium' as const,
        factors: ['High leverage ratio', 'Cash flow concentration', 'Working capital variability'],
        mitigation: ['Covenant headroom monitoring', 'Diversification strategy', 'Cash management optimization'],
        impact: deal.keyMetrics?.leverage && deal.keyMetrics.leverage > 4 ? 8.5 : 5.2
      },
      {
        category: 'operational' as const,
        risk: 'medium' as const,
        factors: ['Management transition', 'Integration complexity', 'Operational scalability'],
        mitigation: ['Management retention program', 'Staged integration plan', 'System upgrades'],
        impact: 6.1
      }
    ];

    return categories;
  }

  private static calculateOverallRisk(categories: RiskAssessment['categories']): RiskAssessment['overallRisk'] {
    const highRiskCount = categories.filter(c => c.risk === 'high').length;
    const mediumRiskCount = categories.filter(c => c.risk === 'medium').length;
    
    if (highRiskCount > 1) return 'critical';
    if (highRiskCount > 0) return 'high';
    if (mediumRiskCount > 2) return 'medium';
    return 'low';
  }

  private static calculateRiskScore(categories: RiskAssessment['categories']): number {
    const totalImpact = categories.reduce((sum, cat) => sum + cat.impact, 0);
    const avgImpact = totalImpact / categories.length;
    return Math.min(100, Math.max(0, Math.round(avgImpact * 10)));
  }

  private static generateMonitoringPlan(deal: DealStructuringProject, categories: RiskAssessment['categories']): RiskAssessment['monitoring'] {
    return [
      {
        metric: 'Leverage Ratio',
        threshold: 4.5,
        frequency: 'monthly',
        alertLevel: 'warning'
      },
      {
        metric: 'Cash Flow Coverage',
        threshold: 1.2,
        frequency: 'weekly',
        alertLevel: 'critical'
      },
      {
        metric: 'Covenant Headroom',
        threshold: 15,
        frequency: 'monthly',
        alertLevel: 'warning'
      }
    ];
  }

  private static calculateTaskConfidence(task: string, deal: DealStructuringProject): number {
    // Simple confidence calculation based on task complexity and deal characteristics
    const baseConfidence = {
      'UPDATE_FINANCIAL_MODEL': 0.85,
      'GENERATE_RISK_REPORT': 0.82,
      'BENCHMARK_ANALYSIS': 0.88,
      'SCHEDULE_MEETINGS': 0.95,
      'PREPARE_MATERIALS': 0.78,
      'COVENANT_ANALYSIS': 0.73
    };

    return baseConfidence[task] || 0.70;
  }

  private static async executeTask(task: string, deal: DealStructuringProject): Promise<any> {
    // Mock task execution - in production would perform actual operations
    await new Promise(resolve => setTimeout(resolve, 100)); // Simulate processing time
    
    return {
      task,
      completed: true,
      timestamp: new Date().toISOString(),
      details: `Completed ${task} for ${deal.name}`
    };
  }
}