'use client';

import { 
  FinancialModel, 
  ModelCategory, 
  ModelComplexity, 
  BusinessValue, 
  ModelStatus,
  ClientDemand,
  SkillLevel,
  ModelFilter,
  ModelRegistry 
} from '@/types/financial-modeling';

export class FinancialModelRegistry {
  private registry: ModelRegistry = {};
  private initialized = false;

  constructor() {
    this.initializeRegistry();
  }

  private async initializeRegistry() {
    try {
      // In production, this would load from API
      const response = await fetch('/api/financial-models/registry');
      if (response.ok) {
        const data = await response.json();
        this.registry = data.models || {};
      } else {
        this.initializeFallbackRegistry();
      }
    } catch (error) {
      console.warn('Failed to load model registry from API, using fallback');
      this.initializeFallbackRegistry();
    } finally {
      this.initialized = true;
    }
  }

  private initializeFallbackRegistry() {
    this.registry = {
      'dcf-valuation': {
        id: 'dcf-valuation',
        name: 'DCF Valuation Model',
        description: 'Comprehensive discounted cash flow analysis with WACC calculation and sensitivity testing',
        category: ModelCategory.CORE,
        subCategory: 'fundamental-valuation',
        complexity: ModelComplexity.ADVANCED,
        businessValue: BusinessValue.HIGH,
        status: ModelStatus.AVAILABLE,
        version: '2.1.0',
        lastUpdated: new Date('2024-01-15'),
        estimatedValue: 2500000,
        clientDemand: ClientDemand.VERY_HIGH,
        prerequisites: ['basic-finance', 'excel-modeling'],
        dependencies: ['financial-statements', 'market-data'],
        componentPath: '/financial/DCFModelingCard',
        icon: 'Calculator',
        tags: ['valuation', 'dcf', 'enterprise-value', 'wacc'],
        usageCount: 1250,
        averageRating: 4.7,
        estimatedTimeToComplete: 45,
        requiredSkillLevel: SkillLevel.ASSOCIATE
      },
      'lbo-analysis': {
        id: 'lbo-analysis',
        name: 'LBO Returns Analysis',
        description: 'Leveraged buyout modeling with debt structuring and return optimization',
        category: ModelCategory.CORE,
        subCategory: 'buyout-modeling',
        complexity: ModelComplexity.ADVANCED,
        businessValue: BusinessValue.CRITICAL,
        status: ModelStatus.AVAILABLE,
        version: '1.8.0',
        lastUpdated: new Date('2024-01-10'),
        estimatedValue: 3200000,
        clientDemand: ClientDemand.VERY_HIGH,
        prerequisites: ['dcf-valuation', 'debt-analysis'],
        dependencies: ['credit-analysis', 'covenant-modeling'],
        componentPath: '/financial/LBOModelingCard',
        icon: 'TrendingUp',
        tags: ['lbo', 'leverage', 'returns', 'debt-structure'],
        usageCount: 980,
        averageRating: 4.8,
        estimatedTimeToComplete: 60,
        requiredSkillLevel: SkillLevel.VP
      },
      'waterfall-modeling': {
        id: 'waterfall-modeling',
        name: 'Waterfall Distribution Model',
        description: 'LP/GP waterfall calculations with carried interest and catch-up provisions',
        category: ModelCategory.CORE,
        subCategory: 'fund-economics',
        complexity: ModelComplexity.EXPERT,
        businessValue: BusinessValue.CRITICAL,
        status: ModelStatus.AVAILABLE,
        version: '1.5.0',
        lastUpdated: new Date('2024-01-05'),
        estimatedValue: 1800000,
        clientDemand: ClientDemand.HIGH,
        prerequisites: ['fund-structures', 'partnership-agreements'],
        dependencies: ['legal-docs', 'tax-calculations'],
        componentPath: '/financial/WaterfallModelingCard',
        icon: 'BarChart3',
        tags: ['waterfall', 'carry', 'distribution', 'gp-lp'],
        usageCount: 650,
        averageRating: 4.6,
        estimatedTimeToComplete: 90,
        requiredSkillLevel: SkillLevel.DIRECTOR
      },
      'comp-analysis': {
        id: 'comp-analysis',
        name: 'Comparable Company Analysis',
        description: 'Public market comparable valuation with trading and transaction multiples',
        category: ModelCategory.VALUATION,
        subCategory: 'market-based',
        complexity: ModelComplexity.INTERMEDIATE,
        businessValue: BusinessValue.HIGH,
        status: ModelStatus.AVAILABLE,
        version: '1.3.0',
        lastUpdated: new Date('2024-01-12'),
        estimatedValue: 900000,
        clientDemand: ClientDemand.HIGH,
        prerequisites: ['financial-analysis'],
        dependencies: ['market-data', 'screening-tools'],
        componentPath: '/valuation/ComparableCompanyCard',
        icon: 'BarChart',
        tags: ['comps', 'multiples', 'trading', 'precedent'],
        usageCount: 1100,
        averageRating: 4.4,
        estimatedTimeToComplete: 30,
        requiredSkillLevel: SkillLevel.ANALYST
      },
      'precedent-transactions': {
        id: 'precedent-transactions',
        name: 'Precedent Transaction Analysis',
        description: 'M&A transaction analysis with deal premium and synergy calculations',
        category: ModelCategory.VALUATION,
        subCategory: 'transaction-based',
        complexity: ModelComplexity.INTERMEDIATE,
        businessValue: BusinessValue.MEDIUM,
        status: ModelStatus.AVAILABLE,
        version: '1.2.0',
        lastUpdated: new Date('2024-01-08'),
        estimatedValue: 750000,
        clientDemand: ClientDemand.MEDIUM,
        prerequisites: ['comp-analysis'],
        dependencies: ['deal-database', 'synergy-models'],
        componentPath: '/valuation/PrecedentTransactionCard',
        icon: 'Activity',
        tags: ['precedent', 'ma', 'premiums', 'synergies'],
        usageCount: 420,
        averageRating: 4.2,
        estimatedTimeToComplete: 40,
        requiredSkillLevel: SkillLevel.ASSOCIATE
      },
      'preferred-equity': {
        id: 'preferred-equity',
        name: 'Preferred Equity Structure',
        description: 'Complex preferred equity with liquidation preferences and conversion features',
        category: ModelCategory.STRUCTURED_PRODUCTS,
        subCategory: 'equity-derivatives',
        complexity: ModelComplexity.EXPERT,
        businessValue: BusinessValue.HIGH,
        status: ModelStatus.BETA,
        version: '0.9.0',
        lastUpdated: new Date('2024-01-20'),
        estimatedValue: 2100000,
        clientDemand: ClientDemand.MEDIUM,
        prerequisites: ['option-pricing', 'legal-structures'],
        dependencies: ['derivatives-pricing', 'legal-docs'],
        componentPath: '/structured/PreferredEquityCard',
        icon: 'Layers',
        tags: ['preferred', 'liquidation', 'conversion', 'derivatives'],
        usageCount: 180,
        averageRating: 4.5,
        estimatedTimeToComplete: 120,
        requiredSkillLevel: SkillLevel.DIRECTOR
      },
      'revenue-participation': {
        id: 'revenue-participation',
        name: 'Revenue Participation Rights',
        description: 'Alternative investment structure with revenue-based returns',
        category: ModelCategory.STRUCTURED_PRODUCTS,
        subCategory: 'alternative-structures',
        complexity: ModelComplexity.ADVANCED,
        businessValue: BusinessValue.MEDIUM,
        status: ModelStatus.IN_DEVELOPMENT,
        version: '0.5.0',
        lastUpdated: new Date('2024-01-25'),
        estimatedValue: 1200000,
        clientDemand: ClientDemand.LOW,
        prerequisites: ['cash-flow-analysis'],
        dependencies: ['revenue-forecasting'],
        componentPath: '/structured/RevenueParticipationCard',
        icon: 'DollarSign',
        tags: ['revenue-based', 'alternative', 'cash-flow'],
        usageCount: 45,
        averageRating: 3.8,
        estimatedTimeToComplete: 75,
        requiredSkillLevel: SkillLevel.VP
      },
      'tax-optimization': {
        id: 'tax-optimization',
        name: 'Multi-Jurisdiction Tax Optimization',
        description: 'Cross-border tax structuring with treaty optimization',
        category: ModelCategory.TAX_LEGAL,
        subCategory: 'international-tax',
        complexity: ModelComplexity.EXPERT,
        businessValue: BusinessValue.CRITICAL,
        status: ModelStatus.AVAILABLE,
        version: '1.0.0',
        lastUpdated: new Date('2024-02-18'),
        estimatedValue: 4500000,
        clientDemand: ClientDemand.HIGH,
        prerequisites: ['international-tax', 'treaty-analysis'],
        dependencies: ['tax-databases', 'legal-research'],
        componentPath: '/financial/TaxOptimizationCard',
        icon: 'Globe',
        tags: ['tax', 'international', 'optimization', 'treaties'],
        usageCount: 75,
        averageRating: 4.8,
        estimatedTimeToComplete: 180,
        requiredSkillLevel: SkillLevel.MD
      },
      'esg-impact': {
        id: 'esg-impact',
        name: 'ESG Impact Assessment',
        description: 'Environmental, social, and governance impact measurement and reporting',
        category: ModelCategory.ESG,
        subCategory: 'impact-measurement',
        complexity: ModelComplexity.INTERMEDIATE,
        businessValue: BusinessValue.HIGH,
        status: ModelStatus.AVAILABLE,
        version: '1.0.0',
        lastUpdated: new Date('2024-02-16'),
        estimatedValue: 1600000,
        clientDemand: ClientDemand.HIGH,
        prerequisites: ['sustainability-frameworks'],
        dependencies: ['esg-databases', 'impact-metrics'],
        componentPath: '/financial/ESGImpactCard',
        icon: 'Target',
        tags: ['esg', 'sustainability', 'impact', 'reporting'],
        usageCount: 320,
        averageRating: 4.3,
        estimatedTimeToComplete: 50,
        requiredSkillLevel: SkillLevel.ASSOCIATE
      },
      'capital-structure': {
        id: 'capital-structure',
        name: 'Capital Structure Analysis',
        description: 'Comprehensive capital structure optimization with debt/equity mix analysis and WACC calculations',
        category: ModelCategory.CORE,
        subCategory: 'capital-structure',
        complexity: ModelComplexity.ADVANCED,
        businessValue: BusinessValue.CRITICAL,
        status: ModelStatus.AVAILABLE,
        version: '2.0.0',
        lastUpdated: new Date('2024-02-01'),
        estimatedValue: 4000000,
        clientDemand: ClientDemand.VERY_HIGH,
        prerequisites: ['financial-analysis', 'debt-markets'],
        dependencies: ['market-data', 'credit-ratings'],
        componentPath: '/financial/CapitalStructureCard',
        icon: 'Building2',
        tags: ['capital-structure', 'wacc', 'leverage', 'optimization'],
        usageCount: 890,
        averageRating: 4.8,
        estimatedTimeToComplete: 75,
        requiredSkillLevel: SkillLevel.VP
      },
      'term-sheet': {
        id: 'term-sheet',
        name: 'Term Sheet Modeling & Analysis',
        description: 'Comprehensive term sheet analysis, benchmarking, and negotiation guidance',
        category: ModelCategory.CORE,
        subCategory: 'deal-terms',
        complexity: ModelComplexity.EXPERT,
        businessValue: BusinessValue.CRITICAL,
        status: ModelStatus.AVAILABLE,
        version: '1.5.0',
        lastUpdated: new Date('2024-01-28'),
        estimatedValue: 3500000,
        clientDemand: ClientDemand.VERY_HIGH,
        prerequisites: ['deal-structuring', 'market-benchmarks'],
        dependencies: ['legal-databases', 'market-standards'],
        componentPath: '/financial/TermSheetCard',
        icon: 'FileText',
        tags: ['term-sheet', 'negotiation', 'benchmarking', 'deal-terms'],
        usageCount: 1150,
        averageRating: 4.7,
        estimatedTimeToComplete: 90,
        requiredSkillLevel: SkillLevel.DIRECTOR
      },
      'financial-statements': {
        id: 'financial-statements',
        name: 'Financial Statement Projections',
        description: 'Comprehensive three-statement financial modeling with integrated P&L, Balance Sheet, and Cash Flow projections',
        category: ModelCategory.CORE,
        subCategory: 'financial-modeling',
        complexity: ModelComplexity.ADVANCED,
        businessValue: BusinessValue.CRITICAL,
        status: ModelStatus.AVAILABLE,
        version: '2.2.0',
        lastUpdated: new Date('2024-02-05'),
        estimatedValue: 3000000,
        clientDemand: ClientDemand.VERY_HIGH,
        prerequisites: ['financial-analysis', 'accounting-fundamentals'],
        dependencies: ['market-data', 'historical-financials'],
        componentPath: '/financial/FinancialStatementsCard',
        icon: 'FileSpreadsheet',
        tags: ['financial-statements', 'projections', 'modeling', 'three-statement'],
        usageCount: 1350,
        averageRating: 4.6,
        estimatedTimeToComplete: 120,
        requiredSkillLevel: SkillLevel.ASSOCIATE
      },
      'revenue-forecast': {
        id: 'revenue-forecast',
        name: 'Revenue & Cost Forecasting',
        description: 'Comprehensive revenue modeling with multiple streams, customer metrics, and scenario analysis',
        category: ModelCategory.CORE,
        subCategory: 'revenue-modeling',
        complexity: ModelComplexity.ADVANCED,
        businessValue: BusinessValue.CRITICAL,
        status: ModelStatus.AVAILABLE,
        version: '1.8.0',
        lastUpdated: new Date('2024-02-03'),
        estimatedValue: 2500000,
        clientDemand: ClientDemand.VERY_HIGH,
        prerequisites: ['revenue-analysis', 'customer-metrics'],
        dependencies: ['market-data', 'customer-data'],
        componentPath: '/financial/RevenueForecastCard',
        icon: 'TrendingUp',
        tags: ['revenue-forecast', 'customer-metrics', 'scenarios', 'growth-modeling'],
        usageCount: 980,
        averageRating: 4.5,
        estimatedTimeToComplete: 90,
        requiredSkillLevel: SkillLevel.ASSOCIATE
      },
      'working-capital': {
        id: 'working-capital',
        name: 'Working Capital Analysis',
        description: 'Working capital optimization with cash conversion cycle and liquidity management',
        category: ModelCategory.CORE,
        subCategory: 'cash-management',
        complexity: ModelComplexity.INTERMEDIATE,
        businessValue: BusinessValue.HIGH,
        status: ModelStatus.AVAILABLE,
        version: '1.4.0',
        lastUpdated: new Date('2024-02-08'),
        estimatedValue: 2000000,
        clientDemand: ClientDemand.HIGH,
        prerequisites: ['financial-analysis', 'cash-flow'],
        dependencies: ['financial-data', 'industry-benchmarks'],
        componentPath: '/financial/WorkingCapitalCard',
        icon: 'RefreshCw',
        tags: ['working-capital', 'cash-conversion', 'liquidity', 'optimization'],
        usageCount: 720,
        averageRating: 4.4,
        estimatedTimeToComplete: 60,
        requiredSkillLevel: SkillLevel.ASSOCIATE
      },
      'project-finance': {
        id: 'project-finance',
        name: 'Project Finance & Infrastructure',
        description: 'Infrastructure project finance modeling with multi-tranche debt structuring and covenant analysis',
        category: ModelCategory.SPECIALIZED,
        subCategory: 'infrastructure',
        complexity: ModelComplexity.EXPERT,
        businessValue: BusinessValue.HIGH,
        status: ModelStatus.AVAILABLE,
        version: '1.2.0',
        lastUpdated: new Date('2024-02-10'),
        estimatedValue: 1800000,
        clientDemand: ClientDemand.MEDIUM,
        prerequisites: ['debt-modeling', 'cash-flow-analysis'],
        dependencies: ['infrastructure-data', 'covenant-modeling'],
        componentPath: '/financial/ProjectFinanceCard',
        icon: 'Building',
        tags: ['project-finance', 'infrastructure', 'debt-structuring', 'covenants'],
        usageCount: 290,
        averageRating: 4.6,
        estimatedTimeToComplete: 150,
        requiredSkillLevel: SkillLevel.VP
      },
      'enhanced-preferred-equity': {
        id: 'enhanced-preferred-equity',
        name: 'Enhanced Preferred Equity',
        description: 'Complex preferred equity structuring with conversion and liquidation analysis',
        category: ModelCategory.STRUCTURED_PRODUCTS,
        subCategory: 'equity-derivatives',
        complexity: ModelComplexity.EXPERT,
        businessValue: BusinessValue.HIGH,
        status: ModelStatus.AVAILABLE,
        version: '1.0.0',
        lastUpdated: new Date('2024-02-12'),
        estimatedValue: 2100000,
        clientDemand: ClientDemand.MEDIUM,
        prerequisites: ['option-pricing', 'preferred-equity'],
        dependencies: ['derivatives-pricing', 'conversion-models'],
        componentPath: '/financial/EnhancedPreferredEquityCard',
        icon: 'Layers',
        tags: ['preferred-equity', 'conversion', 'liquidation', 'structured-products'],
        usageCount: 180,
        averageRating: 4.7,
        estimatedTimeToComplete: 120,
        requiredSkillLevel: SkillLevel.DIRECTOR
      },
      'pme-analysis': {
        id: 'pme-analysis',
        name: 'PME Analysis',
        description: 'Public Market Equivalent performance comparison and attribution analysis',
        category: ModelCategory.ANALYTICS,
        subCategory: 'performance-analysis',
        complexity: ModelComplexity.ADVANCED,
        businessValue: BusinessValue.HIGH,
        status: ModelStatus.AVAILABLE,
        version: '1.0.0',
        lastUpdated: new Date('2024-02-14'),
        estimatedValue: 1500000,
        clientDemand: ClientDemand.HIGH,
        prerequisites: ['portfolio-analysis', 'benchmarking'],
        dependencies: ['market-data', 'performance-attribution'],
        componentPath: '/financial/PMEAnalysisCard',
        icon: 'BarChart3',
        tags: ['pme', 'performance', 'benchmarking', 'attribution'],
        usageCount: 450,
        averageRating: 4.5,
        estimatedTimeToComplete: 90,
        requiredSkillLevel: SkillLevel.VP
      },
      'revenue-participation': {
        id: 'revenue-participation',
        name: 'Revenue Participation Rights',
        description: 'Alternative investment structure with revenue-based returns',
        category: ModelCategory.STRUCTURED_PRODUCTS,
        subCategory: 'alternative-structures',
        complexity: ModelComplexity.ADVANCED,
        businessValue: BusinessValue.MEDIUM,
        status: ModelStatus.AVAILABLE,
        version: '0.5.0',
        lastUpdated: new Date('2024-02-20'),
        estimatedValue: 1200000,
        clientDemand: ClientDemand.LOW,
        prerequisites: ['cash-flow-analysis'],
        dependencies: ['revenue-forecasting'],
        componentPath: '/financial/RevenueParticipationCard',
        icon: 'DollarSign',
        tags: ['revenue-based', 'alternative', 'cash-flow'],
        usageCount: 45,
        averageRating: 3.8,
        estimatedTimeToComplete: 75,
        requiredSkillLevel: SkillLevel.VP
      }
    };
  }

  public async waitForInitialization(): Promise<void> {
    while (!this.initialized) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }

  public async getAllModels(): Promise<FinancialModel[]> {
    await this.waitForInitialization();
    return Object.values(this.registry);
  }

  public async getModel(id: string): Promise<FinancialModel | undefined> {
    await this.waitForInitialization();
    return this.registry[id];
  }

  public async getModelsByCategory(category: ModelCategory): Promise<FinancialModel[]> {
    await this.waitForInitialization();
    return Object.values(this.registry).filter(model => model.category === category);
  }

  public async searchModels(filter: ModelFilter): Promise<FinancialModel[]> {
    await this.waitForInitialization();
    let models = Object.values(this.registry);

    if (filter.category) {
      models = models.filter(m => m.category === filter.category);
    }
    if (filter.complexity) {
      models = models.filter(m => m.complexity === filter.complexity);
    }
    if (filter.status) {
      models = models.filter(m => m.status === filter.status);
    }
    if (filter.businessValue) {
      models = models.filter(m => m.businessValue === filter.businessValue);
    }
    if (filter.skillLevel) {
      models = models.filter(m => m.requiredSkillLevel === filter.skillLevel);
    }
    if (filter.searchTerm) {
      const term = filter.searchTerm.toLowerCase();
      models = models.filter(m => 
        m.name.toLowerCase().includes(term) ||
        m.description.toLowerCase().includes(term) ||
        m.tags.some(tag => tag.toLowerCase().includes(term))
      );
    }
    if (filter.tags) {
      models = models.filter(m => 
        filter.tags!.some(tag => m.tags.includes(tag))
      );
    }
    if (filter.minRating !== undefined) {
      models = models.filter(m => m.averageRating >= filter.minRating!);
    }

    return models.sort((a, b) => {
      // Sort by business value, then by client demand, then by rating
      const valueOrder = { critical: 0, high: 1, medium: 2, low: 3 };
      const demandOrder = { very_high: 0, high: 1, medium: 2, low: 3 };
      
      if (a.businessValue !== b.businessValue) {
        return valueOrder[a.businessValue] - valueOrder[b.businessValue];
      }
      if (a.clientDemand !== b.clientDemand) {
        return demandOrder[a.clientDemand] - demandOrder[b.clientDemand];
      }
      return b.averageRating - a.averageRating;
    });
  }

  public async getPopularModels(limit: number = 5): Promise<FinancialModel[]> {
    await this.waitForInitialization();
    return Object.values(this.registry)
      .filter(m => m.status === ModelStatus.AVAILABLE)
      .sort((a, b) => b.usageCount - a.usageCount)
      .slice(0, limit);
  }

  public async getRecommendedModels(skillLevel: SkillLevel, limit: number = 5): Promise<FinancialModel[]> {
    await this.waitForInitialization();
    const skillOrder = { analyst: 0, associate: 1, vp: 2, director: 3, md: 4 };
    const userLevel = skillOrder[skillLevel];
    
    return Object.values(this.registry)
      .filter(m => 
        m.status === ModelStatus.AVAILABLE &&
        skillOrder[m.requiredSkillLevel] <= userLevel + 1 // Allow slightly above skill level
      )
      .sort((a, b) => {
        // Prioritize models at or slightly above user's skill level
        const aSkillDiff = Math.abs(skillOrder[a.requiredSkillLevel] - userLevel);
        const bSkillDiff = Math.abs(skillOrder[b.requiredSkillLevel] - userLevel);
        
        if (aSkillDiff !== bSkillDiff) {
          return aSkillDiff - bSkillDiff;
        }
        
        // Then by business value and rating
        const valueOrder = { critical: 0, high: 1, medium: 2, low: 3 };
        if (a.businessValue !== b.businessValue) {
          return valueOrder[a.businessValue] - valueOrder[b.businessValue];
        }
        
        return b.averageRating - a.averageRating;
      })
      .slice(0, limit);
  }

  public async incrementUsage(modelId: string): Promise<void> {
    const model = this.registry[modelId];
    if (model) {
      model.usageCount++;
      // In production, would also update the backend
      try {
        await fetch(`/api/financial-models/${modelId}/usage`, {
          method: 'POST'
        });
      } catch (error) {
        console.warn('Failed to update usage count on server:', error);
      }
    }
  }
}

// Export singleton instance
export const financialModelRegistry = new FinancialModelRegistry();