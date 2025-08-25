/**
 * AI Deal Structuring Service
 * Provides intelligent deal structuring recommendations, pattern recognition,
 * and automated analysis across different modes
 */

import { DealStructuringProject, AIRecommendation } from '@/types/deal-structuring';
import { ThandoContext, ClaudeRequest, ClaudeResponse } from '@/types/thando-context';

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

  /**
   * Generate real AI recommendations using Claude integration
   */
  static async generateRealAIRecommendations(
    deal: DealStructuringProject,
    context: Partial<ThandoContext>,
    mode: 'traditional' | 'assisted' | 'autonomous'
  ): Promise<StructuringRecommendation[]> {
    try {
      // Build comprehensive prompt for Claude
      const prompt = this.buildDealAnalysisPrompt(deal, mode);
      
      // Create thando context for the request
      const thandoContext: ThandoContext = {
        currentModule: 'deal-structuring',
        currentPage: `/deal-structuring/${deal.id}`,
        navigationMode: mode,
        userId: 'system',
        userRole: 'analyst',
        userPreferences: {
          preferredAnalysisDepth: 'detailed',
          communicationStyle: 'formal',
          defaultTimeframe: 'YTD',
          focusAreas: ['private-equity', 'deal-structuring'],
          notificationFrequency: 'real-time',
          preferredChartTypes: ['bar', 'line'],
          riskTolerance: 'medium'
        },
        activeProjects: [],
        activeDeals: [],
        portfolioMetrics: {
          totalAUM: 0,
          totalValue: 0,
          netIRR: 0,
          grossIRR: 0,
          totalValueMultiple: 0,
          distributionsToDate: 0,
          unrealizedValue: 0,
          cashFlow: {
            quarterlyDistributions: 0,
            quarterlyContributions: 0,
            netCashFlow: 0
          },
          performance: {
            ytdReturn: 0,
            quarterlyReturn: 0,
            benchmarkComparison: 0
          }
        },
        recentActivity: [],
        conversationHistory: [],
        availableActions: [],
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
          totalPortfolios: 0,
          totalDeals: 0,
          teamSize: 0,
          lastLogin: new Date(),
          systemAlerts: [],
          marketConditions: {
            sentiment: 'neutral',
            volatilityIndex: 0,
            keyTrends: []
          }
        },
        timeContext: {
          currentQuarter: 'Q1',
          fiscalYearEnd: new Date(),
          lastReportingDate: new Date(),
          upcomingDeadlines: []
        },
        ...context
      };

      // Call thando chat API
      const response = await fetch('/api/thando/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: prompt,
          context: thandoContext,
          options: {
            includeActions: true,
            maxTokens: 2000,
            temperature: 0.1
          }
        } as ClaudeRequest),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const claudeResponse: ClaudeResponse = await response.json();
      
      // Parse Claude response into structured recommendations
      return this.parseClaudeRecommendations(claudeResponse, deal);

    } catch (error) {
      console.error('Failed to generate AI recommendations:', error);
      // Fall back to mock recommendations if AI fails
      return this.generateStructuringRecommendations(deal, mode);
    }
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

  /**
   * Build comprehensive prompt for deal analysis
   */
  private static buildDealAnalysisPrompt(deal: DealStructuringProject, mode: string): string {
    return `
Analyze this deal structure and provide specific recommendations:

## Deal Details:
- **Name**: ${deal.name}
- **Type**: ${deal.type}
- **Target Value**: $${(deal.targetValue / 1000000).toFixed(1)}M
- **Current Stage**: ${deal.stage}
- **Progress**: ${deal.progress}%
- **Risk Level**: ${deal.riskLevel}

## Key Metrics:
${JSON.stringify(deal.keyMetrics, null, 2)}

## Team:
${deal.team.map(member => `- ${member.name} (${member.role})`).join('\n')}

## Analysis Mode: ${mode.toUpperCase()}

Please provide specific structuring recommendations including:
1. Capital structure optimization opportunities
2. Pricing strategy analysis
3. Risk assessment and mitigation strategies
4. Recommended financial models and assumptions
5. Timeline optimization suggestions
6. Comparable deal patterns and benchmarks

Format your response as structured recommendations with:
- Clear titles and descriptions
- Confidence scores (0-100%)
- Specific actions to take
- Expected impact on IRR, risk, and timeline
- Supporting data and benchmarks
`;
  }

  /**
   * Parse Claude response into structured recommendations
   */
  private static parseClaudeRecommendations(claudeResponse: ClaudeResponse, deal: DealStructuringProject): StructuringRecommendation[] {
    const recommendations: StructuringRecommendation[] = [];
    
    // Extract recommendations from Claude response
    // This is a simplified parser - in production would use more sophisticated parsing
    const content = claudeResponse.content;
    
    // Look for recommendation patterns in the response
    const recommendationPatterns = [
      /(?:recommendation|suggestion|advice)[:\s]+(.*?)(?=\n\n|\n•|\n-|$)/gi,
      /(?:optimize|improve|consider)[:\s]+(.*?)(?=\n\n|\n•|\n-|$)/gi,
      /(?:action|next step)[:\s]+(.*?)(?=\n\n|\n•|\n-|$)/gi
    ];
    
    let match;
    let recommendationCount = 0;
    
    for (const pattern of recommendationPatterns) {
      while ((match = pattern.exec(content)) !== null) {
        recommendationCount++;
        recommendations.push({
          id: `claude-rec-${deal.id}-${recommendationCount}`,
          type: 'optimization',
          priority: 'medium',
          title: `AI Recommendation #${recommendationCount}`,
          description: match[1].trim(),
          reasoning: 'Generated by Claude AI based on deal analysis',
          confidence: claudeResponse.confidence || 0.75,
          potentialImpact: {
            irr: 1.5 + (Math.random() * 3), // Random impact for demo
            riskReduction: 5 + (Math.random() * 10),
            timeToClose: -7 - (Math.random() * 14),
            costSavings: 0.5 + (Math.random() * 1.5)
          },
          actions: [
            {
              id: `execute-rec-${recommendationCount}`,
              label: 'Implement Recommendation',
              action: 'EXECUTE_AI_RECOMMENDATION',
              params: { recommendation: match[1].trim() },
              estimatedTime: 60
            }
          ],
          supportingData: {
            benchmarkData: this.getBenchmarkData(deal.type),
            comparableDeals: ['AI-generated pattern match']
          }
        });
      }
    }
    
    // If no specific recommendations found, create a general one
    if (recommendations.length === 0) {
      recommendations.push({
        id: `claude-general-${deal.id}`,
        type: 'analysis',
        priority: 'medium',
        title: 'AI Deal Analysis',
        description: 'Claude AI has analyzed this deal structure',
        reasoning: content.substring(0, 200) + '...',
        confidence: claudeResponse.confidence || 0.80,
        potentialImpact: {
          irr: 2.0,
          riskReduction: 8,
          timeToClose: -10,
          costSavings: 1.0
        },
        actions: claudeResponse.actions ? claudeResponse.actions.map(action => ({
          id: action.id,
          label: action.description,
          action: action.name,
          params: action.inputSchema,
          estimatedTime: 30
        })) : [{
          id: 'review-analysis',
          label: 'Review AI Analysis',
          action: 'REVIEW_ANALYSIS',
          estimatedTime: 15
        }],
        supportingData: {
          benchmarkData: this.getBenchmarkData(deal.type)
        }
      });
    }
    
    return recommendations;
  }
}
