import { NextResponse } from 'next/server';
import {
  AdvancedAnalyticsResponse,
  AnalyticsModel,
  ModelSummary,
  RecentRun,
  CorrelationMatrix,
  CorrelationInsight,
  RiskModel,
  RiskAlert,
  ScenarioAnalysis,
  ScenarioInsight,
  StressTestScenario,
  ForecastModel,
  AdvancedAnalyticsStats,
  ModelParameter,
  ModelInput,
  ModelOutput,
  CorrelationData
} from '@/types/advanced-analytics';

// Mock data generation
const generateMockAnalyticsModels = (): AnalyticsModel[] => {
  const models: AnalyticsModel[] = [
    {
      id: 'model-001',
      name: 'Portfolio Risk Factor Model',
      description: 'Multi-factor risk model for portfolio risk decomposition and attribution',
      modelType: 'VAR',
      category: 'RISK_MODELING',
      algorithm: 'Historical Simulation VaR',
      parameters: [
        { name: 'confidence_level', type: 'NUMBER', value: 0.95, description: 'VaR confidence level', required: true, defaultValue: 0.95, constraints: { min: 0.9, max: 0.99 } },
        { name: 'lookback_days', type: 'NUMBER', value: 252, description: 'Historical lookback period in days', required: true, defaultValue: 252, constraints: { min: 100, max: 500 } },
        { name: 'time_horizon', type: 'NUMBER', value: 21, description: 'Risk time horizon in days', required: true, defaultValue: 21, constraints: { min: 1, max: 90 } }
      ],
      inputs: [
        { name: 'portfolio_positions', type: 'ARRAY', description: 'Portfolio holdings and weights', required: true, source: 'portfolio_db' },
        { name: 'return_history', type: 'TIMESERIES', description: 'Historical return data', required: true, source: 'market_data' },
        { name: 'risk_factors', type: 'ARRAY', description: 'Risk factor exposures', required: true, source: 'risk_db' }
      ],
      outputs: [
        { name: 'portfolio_var', type: 'NUMBER', description: 'Portfolio Value at Risk', unit: 'USD' },
        { name: 'component_var', type: 'ARRAY', description: 'Component VaR by position', unit: 'USD' },
        { name: 'marginal_var', type: 'ARRAY', description: 'Marginal VaR by position', unit: 'USD' }
      ],
      accuracy: 0.87,
      rSquared: 0.72,
      confidence: 0.95,
      backtestResults: {
        period: { start: new Date('2023-01-01'), end: new Date('2024-06-30') },
        accuracy: 0.87,
        rmse: 0.023,
        mae: 0.018,
        hitRate: 0.94,
        maxError: 0.089,
        avgError: 0.014
      },
      validationScore: 0.83,
      lastTested: new Date('2024-07-15'),
      isActive: true,
      version: '2.1',
      lastCalibrated: new Date('2024-07-01'),
      nextCalibration: new Date('2024-10-01'),
      usage: 156,
      visibility: 'INTERNAL',
      accessLevel: 'ALL',
      createdBy: 'user-quant-001',
      maintainedBy: 'user-quant-001',
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-07-15')
    },
    {
      id: 'model-002',
      name: 'Portfolio Correlation Matrix',
      description: 'Dynamic correlation analysis across portfolio holdings with regime detection',
      modelType: 'CORRELATION',
      category: 'PORTFOLIO_ANALYSIS',
      algorithm: 'Dynamic Conditional Correlation',
      parameters: [
        { name: 'correlation_method', type: 'STRING', value: 'PEARSON', description: 'Correlation calculation method', required: true, defaultValue: 'PEARSON', constraints: { options: ['PEARSON', 'SPEARMAN', 'KENDALL'] } },
        { name: 'window_size', type: 'NUMBER', value: 126, description: 'Rolling correlation window size', required: true, defaultValue: 126, constraints: { min: 30, max: 252 } },
        { name: 'significance_level', type: 'NUMBER', value: 0.05, description: 'Statistical significance level', required: true, defaultValue: 0.05, constraints: { min: 0.01, max: 0.1 } }
      ],
      inputs: [
        { name: 'return_matrix', type: 'MATRIX', description: 'Asset return time series matrix', required: true, source: 'market_data' },
        { name: 'asset_metadata', type: 'ARRAY', description: 'Asset identifiers and metadata', required: true, source: 'asset_db' }
      ],
      outputs: [
        { name: 'correlation_matrix', type: 'MATRIX', description: 'Asset correlation matrix', unit: 'correlation' },
        { name: 'significant_correlations', type: 'ARRAY', description: 'Statistically significant correlations', unit: 'correlation' },
        { name: 'correlation_changes', type: 'ARRAY', description: 'Recent correlation regime changes', unit: 'change' }
      ],
      accuracy: 0.91,
      rSquared: 0.84,
      pValue: 0.001,
      confidence: 0.95,
      isActive: true,
      version: '1.5',
      lastCalibrated: new Date('2024-06-15'),
      usage: 89,
      visibility: 'INTERNAL',
      accessLevel: 'ALL',
      createdBy: 'user-quant-002',
      maintainedBy: 'user-quant-002',
      createdAt: new Date('2024-02-01'),
      updatedAt: new Date('2024-06-20')
    },
    {
      id: 'model-003',
      name: 'Monte Carlo Scenario Engine',
      description: 'Monte Carlo simulation engine for portfolio stress testing and scenario analysis',
      modelType: 'MONTE_CARLO',
      category: 'STRESS_TESTING',
      algorithm: 'Quasi Monte Carlo with Sobol sequences',
      parameters: [
        { name: 'num_simulations', type: 'NUMBER', value: 10000, description: 'Number of Monte Carlo simulations', required: true, defaultValue: 10000, constraints: { min: 1000, max: 100000 } },
        { name: 'time_steps', type: 'NUMBER', value: 252, description: 'Number of time steps in simulation', required: true, defaultValue: 252, constraints: { min: 50, max: 500 } },
        { name: 'confidence_intervals', type: 'ARRAY', value: [0.05, 0.25, 0.75, 0.95], description: 'Confidence intervals to calculate', required: true }
      ],
      inputs: [
        { name: 'asset_parameters', type: 'ARRAY', description: 'Asset return parameters and distributions', required: true },
        { name: 'correlation_structure', type: 'MATRIX', description: 'Asset correlation matrix', required: true },
        { name: 'scenario_shocks', type: 'ARRAY', description: 'Stress scenario shock definitions', required: false }
      ],
      outputs: [
        { name: 'simulation_results', type: 'MATRIX', description: 'Full simulation path results', unit: 'returns' },
        { name: 'percentile_outcomes', type: 'ARRAY', description: 'Percentile outcome distribution', unit: 'returns' },
        { name: 'risk_metrics', type: 'OBJECT', description: 'Comprehensive risk metrics', unit: 'various' }
      ],
      accuracy: 0.89,
      confidence: 0.99,
      backtestResults: {
        period: { start: new Date('2023-01-01'), end: new Date('2024-05-31') },
        accuracy: 0.89,
        rmse: 0.019,
        mae: 0.015,
        hitRate: 0.91,
        maxError: 0.067,
        avgError: 0.012
      },
      isActive: true,
      version: '3.0',
      lastCalibrated: new Date('2024-05-15'),
      usage: 234,
      visibility: 'INTERNAL',
      accessLevel: 'SENIOR_ONLY',
      createdBy: 'user-quant-001',
      maintainedBy: 'user-quant-003',
      createdAt: new Date('2023-11-01'),
      updatedAt: new Date('2024-05-20')
    },
    {
      id: 'model-004',
      name: 'Performance Attribution Model',
      description: 'Multi-factor performance attribution with sector and style analysis',
      modelType: 'REGRESSION',
      category: 'PERFORMANCE_ATTRIBUTION',
      algorithm: 'Multi-Factor Regression Analysis',
      parameters: [
        { name: 'attribution_method', type: 'STRING', value: 'BRINSON', description: 'Attribution methodology', required: true, defaultValue: 'BRINSON', constraints: { options: ['BRINSON', 'FAMA_FRENCH', 'CARHART'] } },
        { name: 'benchmark_id', type: 'STRING', value: 'SP500', description: 'Benchmark index identifier', required: true },
        { name: 'rebalancing_frequency', type: 'STRING', value: 'MONTHLY', description: 'Portfolio rebalancing frequency', required: true, constraints: { options: ['DAILY', 'WEEKLY', 'MONTHLY', 'QUARTERLY'] } }
      ],
      inputs: [
        { name: 'portfolio_returns', type: 'TIMESERIES', description: 'Portfolio return time series', required: true },
        { name: 'benchmark_returns', type: 'TIMESERIES', description: 'Benchmark return time series', required: true },
        { name: 'factor_returns', type: 'MATRIX', description: 'Risk factor return matrix', required: true },
        { name: 'portfolio_weights', type: 'TIMESERIES', description: 'Portfolio weight history', required: true }
      ],
      outputs: [
        { name: 'total_attribution', type: 'NUMBER', description: 'Total active return', unit: 'percent' },
        { name: 'allocation_effect', type: 'NUMBER', description: 'Asset allocation contribution', unit: 'percent' },
        { name: 'selection_effect', type: 'NUMBER', description: 'Security selection contribution', unit: 'percent' },
        { name: 'interaction_effect', type: 'NUMBER', description: 'Allocation-selection interaction', unit: 'percent' }
      ],
      accuracy: 0.94,
      rSquared: 0.88,
      confidence: 0.95,
      isActive: true,
      version: '1.8',
      lastCalibrated: new Date('2024-06-01'),
      usage: 67,
      visibility: 'INTERNAL',
      accessLevel: 'ALL',
      createdBy: 'user-quant-002',
      createdAt: new Date('2024-03-01'),
      updatedAt: new Date('2024-06-05')
    },
    {
      id: 'model-005',
      name: 'ML Portfolio Forecast Model',
      description: 'Machine learning model for portfolio return and volatility forecasting',
      modelType: 'MACHINE_LEARNING',
      category: 'FORECASTING',
      algorithm: 'Random Forest with Feature Selection',
      parameters: [
        { name: 'n_estimators', type: 'NUMBER', value: 200, description: 'Number of trees in random forest', required: true, defaultValue: 200, constraints: { min: 50, max: 500 } },
        { name: 'max_depth', type: 'NUMBER', value: 10, description: 'Maximum tree depth', required: true, defaultValue: 10, constraints: { min: 3, max: 20 } },
        { name: 'forecast_horizon', type: 'NUMBER', value: 30, description: 'Forecast horizon in days', required: true, defaultValue: 30, constraints: { min: 1, max: 90 } },
        { name: 'feature_selection', type: 'BOOLEAN', value: true, description: 'Enable automatic feature selection', required: false, defaultValue: true }
      ],
      inputs: [
        { name: 'historical_features', type: 'MATRIX', description: 'Historical feature matrix', required: true },
        { name: 'target_returns', type: 'TIMESERIES', description: 'Historical portfolio returns', required: true },
        { name: 'macro_features', type: 'MATRIX', description: 'Macroeconomic feature data', required: false }
      ],
      outputs: [
        { name: 'return_forecast', type: 'TIMESERIES', description: 'Expected return forecasts', unit: 'percent' },
        { name: 'volatility_forecast', type: 'TIMESERIES', description: 'Volatility forecasts', unit: 'percent' },
        { name: 'confidence_bands', type: 'MATRIX', description: 'Forecast confidence intervals', unit: 'percent' },
        { name: 'feature_importance', type: 'ARRAY', description: 'Feature importance rankings', unit: 'importance' }
      ],
      accuracy: 0.76,
      rSquared: 0.58,
      confidence: 0.85,
      backtestResults: {
        period: { start: new Date('2022-01-01'), end: new Date('2024-06-30') },
        accuracy: 0.76,
        rmse: 0.034,
        mae: 0.027,
        hitRate: 0.73,
        maxError: 0.112,
        avgError: 0.021
      },
      validationScore: 0.71,
      lastTested: new Date('2024-07-10'),
      isActive: true,
      version: '2.3',
      lastCalibrated: new Date('2024-06-30'),
      nextCalibration: new Date('2024-09-30'),
      usage: 45,
      visibility: 'INTERNAL',
      accessLevel: 'SENIOR_ONLY',
      createdBy: 'user-quant-003',
      maintainedBy: 'user-quant-003',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-07-01')
    }
  ];

  return models;
};

const generateModelSummaries = (models: AnalyticsModel[]): ModelSummary[] => {
  return models.map(model => ({
    id: model.id,
    name: model.name,
    modelType: model.modelType,
    category: model.category,
    accuracy: model.accuracy,
    lastRun: model.lastCalibrated ? new Date(model.lastCalibrated.getTime() + Math.random() * 30 * 24 * 60 * 60 * 1000) : undefined,
    usage: model.usage,
    status: model.isActive ? 'ACTIVE' : 'INACTIVE'
  }));
};

const generateRecentRuns = (): RecentRun[] => {
  return [
    {
      id: 'run-001',
      modelName: 'Portfolio Risk Factor Model',
      status: 'COMPLETED',
      startTime: new Date(Date.now() - 2 * 60 * 60 * 1000),
      duration: 187,
      triggeredBy: 'Sarah Chen',
      purpose: 'Weekly risk assessment'
    },
    {
      id: 'run-002',
      modelName: 'Monte Carlo Scenario Engine',
      status: 'RUNNING',
      startTime: new Date(Date.now() - 15 * 60 * 1000),
      triggeredBy: 'Michael Rodriguez',
      purpose: 'Stress test analysis'
    },
    {
      id: 'run-003',
      modelName: 'Portfolio Correlation Matrix',
      status: 'COMPLETED',
      startTime: new Date(Date.now() - 4 * 60 * 60 * 1000),
      duration: 56,
      triggeredBy: 'Emily Johnson',
      purpose: 'Quarterly correlation review'
    },
    {
      id: 'run-004',
      modelName: 'Performance Attribution Model',
      status: 'FAILED',
      startTime: new Date(Date.now() - 6 * 60 * 60 * 1000),
      duration: 23,
      triggeredBy: 'David Kumar',
      purpose: 'Monthly performance attribution'
    },
    {
      id: 'run-005',
      modelName: 'ML Portfolio Forecast Model',
      status: 'COMPLETED',
      startTime: new Date(Date.now() - 8 * 60 * 60 * 1000),
      duration: 345,
      triggeredBy: 'Jennifer Wong',
      purpose: 'Monthly return forecast'
    },
    {
      id: 'run-006',
      modelName: 'Portfolio Risk Factor Model',
      status: 'COMPLETED',
      startTime: new Date(Date.now() - 12 * 60 * 60 * 1000),
      duration: 203,
      triggeredBy: 'Robert Thompson',
      purpose: 'Daily risk monitoring'
    },
    {
      id: 'run-007',
      modelName: 'Monte Carlo Scenario Engine',
      status: 'CANCELLED',
      startTime: new Date(Date.now() - 18 * 60 * 60 * 1000),
      duration: 87,
      triggeredBy: 'Sarah Chen',
      purpose: 'Market stress simulation'
    },
    {
      id: 'run-008',
      modelName: 'Portfolio Correlation Matrix',
      status: 'COMPLETED',
      startTime: new Date(Date.now() - 24 * 60 * 60 * 1000),
      duration: 67,
      triggeredBy: 'Michael Rodriguez',
      purpose: 'Regime change detection'
    }
  ];
};

const generateCorrelationInsights = (): CorrelationInsight[] => {
  return [
    {
      id: 'corr-001',
      entityA: 'TechGrowth Fund',
      entityB: 'Innovation Portfolio',
      correlation: 0.847,
      significance: 'HIGH',
      trend: 'INCREASING',
      businessImplication: 'Strong positive correlation indicates potential concentration risk in technology sector exposure'
    },
    {
      id: 'corr-002',
      entityA: 'Energy Sector Holdings',
      entityB: 'Commodity Futures',
      correlation: 0.623,
      significance: 'MEDIUM',
      trend: 'STABLE',
      businessImplication: 'Moderate correlation provides partial hedge against energy price volatility'
    },
    {
      id: 'corr-003',
      entityA: 'European Equities',
      entityB: 'USD/EUR Exchange Rate',
      correlation: -0.456,
      significance: 'MEDIUM',
      trend: 'DECREASING',
      businessImplication: 'Negative correlation suggests currency hedging may be effective for European positions'
    },
    {
      id: 'corr-004',
      entityA: 'Growth Fund A',
      entityB: 'Value Fund B',
      correlation: 0.234,
      significance: 'LOW',
      trend: 'STABLE',
      businessImplication: 'Low correlation between growth and value strategies provides good diversification benefits'
    },
    {
      id: 'corr-005',
      entityA: 'Private Equity Fund',
      entityB: 'Public Market Index',
      correlation: 0.678,
      significance: 'HIGH',
      trend: 'INCREASING',
      businessImplication: 'Rising correlation may indicate reduced diversification benefits from private equity allocation'
    }
  ];
};

const generateRiskAlerts = (): RiskAlert[] => {
  return [
    {
      id: 'alert-001',
      title: 'Portfolio VaR Breach Detected',
      description: '95% VaR exceeded established threshold of $2.5M. Current VaR: $2.8M representing 3.2% of portfolio value.',
      severity: 'HIGH',
      riskType: 'VAR_BREACH',
      triggeredAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
      entityAffected: 'Growth Fund III',
      recommendation: 'Review position sizing in high-volatility holdings and consider risk reduction measures'
    },
    {
      id: 'alert-002',
      title: 'Correlation Regime Change',
      description: 'Significant increase in cross-asset correlations detected. Average pairwise correlation increased from 0.34 to 0.67 over the past 5 trading days.',
      severity: 'MEDIUM',
      riskType: 'CORRELATION_CHANGE',
      triggeredAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
      entityAffected: 'Full Portfolio',
      recommendation: 'Monitor for potential diversification breakdown and consider defensive positioning'
    },
    {
      id: 'alert-003',
      title: 'Technology Sector Volatility Spike',
      description: 'Technology sector realized volatility has increased to 28.5% from 18.2% baseline, indicating elevated market stress.',
      severity: 'MEDIUM',
      riskType: 'VOLATILITY_SPIKE',
      triggeredAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
      entityAffected: 'Technology Holdings',
      recommendation: 'Assess technology concentration and evaluate hedge opportunities'
    }
  ];
};

const generateScenarioInsights = (): ScenarioInsight[] => {
  return [
    {
      id: 'scenario-001',
      scenarioName: 'Interest Rate Shock (+200bp)',
      worstCaseImpact: -0.127,
      bestCaseUpside: -0.034,
      keyDrivers: ['Bond Duration', 'Growth Stocks', 'Real Estate'],
      probability: 0.15,
      recommendation: 'Consider reducing duration exposure and increasing floating rate allocations'
    },
    {
      id: 'scenario-002',
      scenarioName: 'Global Recession Scenario',
      worstCaseImpact: -0.235,
      bestCaseUpside: -0.089,
      keyDrivers: ['Equity Beta', 'Credit Spreads', 'Commodity Exposure'],
      probability: 0.25,
      recommendation: 'Increase defensive positioning and cash reserves; consider counter-cyclical investments'
    },
    {
      id: 'scenario-003',
      scenarioName: 'Technology Disruption',
      worstCaseImpact: -0.086,
      bestCaseUpside: 0.142,
      keyDrivers: ['Legacy Tech', 'AI Companies', 'Digital Transformation'],
      probability: 0.35,
      recommendation: 'Rotate from legacy technology to AI and digital transformation themes'
    },
    {
      id: 'scenario-004',
      scenarioName: 'Geopolitical Crisis',
      worstCaseImpact: -0.178,
      bestCaseUpside: 0.023,
      keyDrivers: ['Energy Security', 'Defense Spending', 'Supply Chain'],
      probability: 0.20,
      recommendation: 'Increase allocation to energy security and defense sectors; diversify supply chain exposure'
    }
  ];
};

const generateCorrelationMatrices = (): CorrelationMatrix[] => {
  const correlationData: CorrelationData[] = [
    { entityA: 'Fund A', entityB: 'Fund B', correlation: 0.847, pValue: 0.001, significance: true, observations: 252 },
    { entityA: 'Fund A', entityB: 'Fund C', correlation: 0.623, pValue: 0.003, significance: true, observations: 252 },
    { entityA: 'Fund B', entityB: 'Fund C', correlation: 0.456, pValue: 0.012, significance: true, observations: 252 },
    { entityA: 'Fund A', entityB: 'Benchmark', correlation: 0.789, pValue: 0.000, significance: true, observations: 252 },
    { entityA: 'Fund B', entityB: 'Benchmark', correlation: 0.678, pValue: 0.001, significance: true, observations: 252 }
  ];

  return [
    {
      id: 'corr-matrix-001',
      name: 'Q2 2024 Portfolio Correlation Analysis',
      description: 'Quarterly correlation analysis across all major portfolio holdings',
      portfolioScope: 'FULL_PORTFOLIO',
      startDate: new Date('2024-04-01'),
      endDate: new Date('2024-06-30'),
      frequency: 'DAILY',
      correlationData,
      observations: 252,
      method: 'PEARSON',
      minObservations: 50,
      significance: 0.05,
      strongCorrelations: correlationData.filter(c => Math.abs(c.correlation) > 0.7),
      averageCorrelation: 0.679,
      maxCorrelation: 0.847,
      minCorrelation: 0.456,
      calculatedAt: new Date('2024-07-01'),
      calculatedBy: 'user-quant-002',
      version: 1,
      createdAt: new Date('2024-07-01'),
      updatedAt: new Date('2024-07-01')
    }
  ];
};

const generateRiskModels = (): RiskModel[] => {
  return [
    {
      id: 'risk-001',
      name: 'Multi-Factor Risk Model',
      description: 'Comprehensive risk factor model covering market, sector, and style factors',
      modelType: 'VAR',
      confidenceLevel: 0.95,
      timeHorizon: 21,
      lookbackPeriod: 252,
      riskFactors: [
        { name: 'Market Factor', type: 'MARKET', volatility: 0.18, weight: 0.6 },
        { name: 'Technology Sector', type: 'SECTOR', volatility: 0.25, weight: 0.2 },
        { name: 'Growth Factor', type: 'MARKET', volatility: 0.22, weight: 0.15 },
        { name: 'USD Currency', type: 'CURRENCY', volatility: 0.12, weight: 0.05 }
      ],
      calibrationDate: new Date('2024-07-01'),
      backtestResults: {
        period: { start: new Date('2023-01-01'), end: new Date('2024-06-30') },
        accuracy: 0.89,
        rmse: 0.021,
        mae: 0.017,
        hitRate: 0.92,
        maxError: 0.078,
        avgError: 0.013
      },
      isActive: true,
      lastUsed: new Date('2024-07-20'),
      createdBy: 'user-quant-001',
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-07-01')
    }
  ];
};

const generateStressTestScenarios = (): StressTestScenario[] => {
  return [
    {
      id: 'stress-001',
      name: '2008 Financial Crisis Replay',
      description: 'Historical stress test based on 2008 financial crisis market conditions',
      scenarioType: 'HISTORICAL',
      shockDefinition: [
        { factor: 'Equity Markets', shockType: 'RELATIVE', shockSize: -0.45, unit: 'percent' },
        { factor: 'Credit Spreads', shockType: 'ABSOLUTE', shockSize: 400, unit: 'basis_points' },
        { factor: 'VIX Index', shockType: 'ABSOLUTE', shockSize: 45, unit: 'points' }
      ],
      duration: 180,
      severity: 'EXTREME',
      marketShocks: [
        { factor: 'S&P 500', baseline: 4500, stressed: 2475, change: -2025, changePercent: -45 },
        { factor: 'Credit Spreads', baseline: 150, stressed: 550, change: 400, changePercent: 267 },
        { factor: 'VIX', baseline: 18, stressed: 45, change: 27, changePercent: 150 }
      ],
      historicalPeriod: 'September 2008 - March 2009',
      frequency: 'Once in 15-20 years',
      lastRun: new Date('2024-07-15'),
      isActive: true,
      createdBy: 'user-quant-001',
      createdAt: new Date('2024-03-01'),
      updatedAt: new Date('2024-07-01')
    },
    {
      id: 'stress-002',
      name: 'Technology Bubble Burst',
      description: 'Hypothetical scenario modeling a severe technology sector correction',
      scenarioType: 'HYPOTHETICAL',
      shockDefinition: [
        { factor: 'Technology Stocks', shockType: 'RELATIVE', shockSize: -0.60, unit: 'percent' },
        { factor: 'Growth Stocks', shockType: 'RELATIVE', shockSize: -0.35, unit: 'percent' },
        { factor: 'NASDAQ', shockType: 'RELATIVE', shockSize: -0.50, unit: 'percent' }
      ],
      duration: 120,
      severity: 'SEVERE',
      marketShocks: [
        { factor: 'Technology Sector', baseline: 100, stressed: 40, change: -60, changePercent: -60 },
        { factor: 'Growth Stocks', baseline: 100, stressed: 65, change: -35, changePercent: -35 },
        { factor: 'NASDAQ', baseline: 15000, stressed: 7500, change: -7500, changePercent: -50 }
      ],
      frequency: 'Once in 10-15 years',
      isActive: true,
      createdBy: 'user-quant-002',
      createdAt: new Date('2024-04-01'),
      updatedAt: new Date('2024-06-01')
    }
  ];
};

const generateForecastModels = (): ForecastModel[] => {
  return [
    {
      id: 'forecast-001',
      name: 'Portfolio Return Forecast Model',
      description: 'Machine learning model for forecasting portfolio returns using macro and technical factors',
      forecastType: 'PERFORMANCE',
      methodology: 'MACHINE_LEARNING',
      algorithm: 'Random Forest Regressor',
      features: [
        'Historical Returns',
        'Volatility Measures',
        'Interest Rates',
        'Credit Spreads',
        'Market Sentiment',
        'Sector Momentum'
      ],
      parameters: [
        { name: 'forecast_horizon', type: 'NUMBER', value: 30, description: 'Forecast horizon in days', required: true, defaultValue: 30 },
        { name: 'confidence_level', type: 'NUMBER', value: 0.90, description: 'Confidence level for intervals', required: true, defaultValue: 0.90 }
      ],
      trainingPeriod: { start: '2020-01-01', end: '2024-06-30' },
      validationPeriod: { start: '2024-01-01', end: '2024-06-30' },
      accuracy: 0.73,
      rmse: 0.024,
      mae: 0.019,
      horizonDays: 30,
      granularity: 'DAILY',
      isActive: true,
      lastTrained: new Date('2024-07-01'),
      nextRetraining: new Date('2024-10-01'),
      createdBy: 'user-quant-003',
      createdAt: new Date('2024-02-01'),
      updatedAt: new Date('2024-07-01')
    }
  ];
};

export async function GET() {
  try {
    const models = generateMockAnalyticsModels();
    const modelSummaries = generateModelSummaries(models);
    const recentRuns = generateRecentRuns();
    const correlationInsights = generateCorrelationInsights();
    const riskAlerts = generateRiskAlerts();
    const scenarioInsights = generateScenarioInsights();
    const correlationMatrices = generateCorrelationMatrices();
    const riskModels = generateRiskModels();
    const stressTests = generateStressTestScenarios();
    const forecastModels = generateForecastModels();

    const stats: AdvancedAnalyticsStats = {
      totalModels: models.length,
      activeModels: models.filter(m => m.isActive).length,
      completedRuns: recentRuns.filter(r => r.status === 'COMPLETED').length,
      runningAnalyses: recentRuns.filter(r => r.status === 'RUNNING').length,
      correlationMatrices: correlationMatrices.length,
      stressTests: stressTests.length,
      forecasts: forecastModels.length,
      totalExecutionTime: recentRuns.reduce((sum, r) => sum + (r.duration || 0), 0)
    };

    const response: AdvancedAnalyticsResponse = {
      stats,
      models,
      modelSummaries,
      recentRuns,
      correlationMatrices,
      correlationInsights,
      riskModels,
      riskCalculations: [], // Would be populated with actual calculations
      riskAlerts,
      scenarios: [], // Would be populated with scenario analyses
      scenarioInsights,
      stressTests,
      stressTestResults: [], // Would be populated with test results
      performanceAttributions: [], // Would be populated with attribution analyses
      forecastModels,
      forecastResults: [] // Would be populated with forecast results
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error in advanced analytics API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch advanced analytics data' },
      { status: 500 }
    );
  }
}