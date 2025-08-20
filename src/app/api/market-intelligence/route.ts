import { NextResponse } from 'next/server';
import {
  MarketIntelligenceResponse,
  MarketIndicator,
  CurrencyPair,
  CurrencySnapshot,
  GeopoliticalEvent,
  MarketAlert,
  EventSummary,
  TrendingIndicator,
  AFMESummary,
  AFMEMetric,
  MarketIntelligenceStats,
  MarketDataPoint,
  CurrencyRate,
  MarketCorrelation,
  MarketReport
} from '@/types/market-intelligence';

// Mock data generation
const generateMockMarketIndicators = (): MarketIndicator[] => {
  const indicators: MarketIndicator[] = [
    {
      id: 'ind-001',
      name: 'S&P 500 Index',
      category: 'FINANCIAL',
      subcategory: 'Equity Index',
      source: 'S&P Dow Jones Indices',
      sourceUrl: 'https://www.spglobal.com/spdji/',
      region: 'US',
      dataType: 'INDEX',
      unit: 'Points',
      frequency: 'DAILY',
      isActive: true,
      priority: 'CRITICAL',
      description: 'Market-capitalization-weighted index of 500 large companies listed on US stock exchanges',
      methodology: 'Float-adjusted market capitalization weighted',
      tags: ['equity', 'index', 'us-market', 'benchmark'],
      lastUpdated: new Date('2024-07-20T16:00:00Z'),
      nextUpdate: new Date('2024-07-21T16:00:00Z'),
      dataPoints: 5847,
      createdBy: 'system',
      createdAt: new Date('2020-01-01'),
      updatedAt: new Date('2024-07-20T16:00:00Z'),
      latestDataPoint: {
        id: 'dp-001',
        indicatorId: 'ind-001',
        timestamp: new Date('2024-07-20T16:00:00Z'),
        value: 5459.10,
        confidence: 1.0,
        isEstimated: false,
        isRevised: false,
        revisionCount: 0,
        previousValue: 5505.00,
        changeAbsolute: -45.90,
        changePercent: -0.83,
        createdAt: new Date('2024-07-20T16:05:00Z'),
      },
      recentChange: {
        absolute: -45.90,
        percent: -0.83,
        timeframe: '1D'
      }
    },
    {
      id: 'ind-002',
      name: 'VIX Volatility Index',
      category: 'FINANCIAL',
      subcategory: 'Volatility',
      source: 'CBOE',
      region: 'US',
      dataType: 'PERCENTAGE',
      unit: '%',
      frequency: 'DAILY',
      isActive: true,
      priority: 'HIGH',
      description: 'Measure of market volatility based on S&P 500 index options',
      lastUpdated: new Date('2024-07-20T16:00:00Z'),
      dataPoints: 2341,
      createdBy: 'system',
      createdAt: new Date('2020-01-01'),
      updatedAt: new Date('2024-07-20T16:00:00Z'),
      latestDataPoint: {
        id: 'dp-002',
        indicatorId: 'ind-002',
        timestamp: new Date('2024-07-20T16:00:00Z'),
        value: 15.67,
        confidence: 1.0,
        isEstimated: false,
        isRevised: false,
        revisionCount: 0,
        previousValue: 14.23,
        changeAbsolute: 1.44,
        changePercent: 10.12,
        createdAt: new Date('2024-07-20T16:05:00Z'),
      },
      recentChange: {
        absolute: 1.44,
        percent: 10.12,
        timeframe: '1D'
      }
    },
    {
      id: 'ind-003',
      name: 'US 10-Year Treasury Yield',
      category: 'FINANCIAL',
      subcategory: 'Interest Rates',
      source: 'US Treasury',
      region: 'US',
      dataType: 'PERCENTAGE',
      unit: '%',
      frequency: 'DAILY',
      isActive: true,
      priority: 'CRITICAL',
      description: '10-year US Treasury constant maturity rate',
      lastUpdated: new Date('2024-07-20T17:00:00Z'),
      dataPoints: 3456,
      createdBy: 'system',
      createdAt: new Date('2020-01-01'),
      updatedAt: new Date('2024-07-20T17:00:00Z'),
      latestDataPoint: {
        id: 'dp-003',
        indicatorId: 'ind-003',
        timestamp: new Date('2024-07-20T17:00:00Z'),
        value: 4.287,
        confidence: 1.0,
        isEstimated: false,
        isRevised: false,
        revisionCount: 0,
        previousValue: 4.301,
        changeAbsolute: -0.014,
        changePercent: -0.33,
        createdAt: new Date('2024-07-20T17:05:00Z'),
      },
      recentChange: {
        absolute: -0.014,
        percent: -0.33,
        timeframe: '1D'
      }
    },
    {
      id: 'ind-004',
      name: 'EU STOXX 600',
      category: 'FINANCIAL',
      subcategory: 'Equity Index',
      source: 'STOXX Ltd',
      region: 'EU',
      dataType: 'INDEX',
      unit: 'Points',
      frequency: 'DAILY',
      isActive: true,
      priority: 'HIGH',
      description: 'Broad European stock market index covering 600 companies across 17 European countries',
      lastUpdated: new Date('2024-07-20T17:35:00Z'),
      dataPoints: 4123,
      createdBy: 'system',
      createdAt: new Date('2020-01-01'),
      updatedAt: new Date('2024-07-20T17:35:00Z'),
      latestDataPoint: {
        id: 'dp-004',
        indicatorId: 'ind-004',
        timestamp: new Date('2024-07-20T17:35:00Z'),
        value: 518.45,
        confidence: 1.0,
        isEstimated: false,
        isRevised: false,
        revisionCount: 0,
        previousValue: 520.12,
        changeAbsolute: -1.67,
        changePercent: -0.32,
        createdAt: new Date('2024-07-20T17:40:00Z'),
      },
      recentChange: {
        absolute: -1.67,
        percent: -0.32,
        timeframe: '1D'
      }
    },
    {
      id: 'ind-005',
      name: 'Gold Price (London PM Fix)',
      category: 'COMMODITY',
      subcategory: 'Precious Metals',
      source: 'LBMA',
      region: 'GLOBAL',
      dataType: 'NUMERIC',
      unit: 'USD/oz',
      frequency: 'DAILY',
      isActive: true,
      priority: 'HIGH',
      description: 'London Bullion Market Association PM gold price fix',
      lastUpdated: new Date('2024-07-20T15:00:00Z'),
      dataPoints: 2987,
      createdBy: 'system',
      createdAt: new Date('2020-01-01'),
      updatedAt: new Date('2024-07-20T15:00:00Z'),
      latestDataPoint: {
        id: 'dp-005',
        indicatorId: 'ind-005',
        timestamp: new Date('2024-07-20T15:00:00Z'),
        value: 2401.50,
        confidence: 1.0,
        isEstimated: false,
        isRevised: false,
        revisionCount: 0,
        previousValue: 2395.75,
        changeAbsolute: 5.75,
        changePercent: 0.24,
        createdAt: new Date('2024-07-20T15:05:00Z'),
      },
      recentChange: {
        absolute: 5.75,
        percent: 0.24,
        timeframe: '1D'
      }
    },
    {
      id: 'ind-006',
      name: 'WTI Crude Oil',
      category: 'COMMODITY',
      subcategory: 'Energy',
      source: 'NYMEX',
      region: 'US',
      dataType: 'NUMERIC',
      unit: 'USD/barrel',
      frequency: 'DAILY',
      isActive: true,
      priority: 'HIGH',
      description: 'West Texas Intermediate crude oil futures price',
      lastUpdated: new Date('2024-07-20T14:30:00Z'),
      dataPoints: 3241,
      createdBy: 'system',
      createdAt: new Date('2020-01-01'),
      updatedAt: new Date('2024-07-20T14:30:00Z'),
      latestDataPoint: {
        id: 'dp-006',
        indicatorId: 'ind-006',
        timestamp: new Date('2024-07-20T14:30:00Z'),
        value: 81.74,
        confidence: 1.0,
        isEstimated: false,
        isRevised: false,
        revisionCount: 0,
        previousValue: 82.85,
        changeAbsolute: -1.11,
        changePercent: -1.34,
        createdAt: new Date('2024-07-20T14:35:00Z'),
      },
      recentChange: {
        absolute: -1.11,
        percent: -1.34,
        timeframe: '1D'
      }
    }
  ];

  return indicators;
};

const generateTrendingIndicators = (indicators: MarketIndicator[]): TrendingIndicator[] => {
  return [
    {
      id: 'trend-001',
      name: 'VIX Volatility Spike',
      category: 'FINANCIAL',
      currentValue: 15.67,
      change: {
        absolute: 1.44,
        percent: 10.12,
        direction: 'UP'
      },
      significance: 'HIGH',
      region: 'US'
    },
    {
      id: 'trend-002',
      name: 'Gold Price Strength',
      category: 'COMMODITY',
      currentValue: 2401.50,
      change: {
        absolute: 23.75,
        percent: 1.00,
        direction: 'UP'
      },
      significance: 'MEDIUM',
      region: 'GLOBAL'
    },
    {
      id: 'trend-003',
      name: 'Treasury Yield Decline',
      category: 'FINANCIAL',
      currentValue: 4.287,
      change: {
        absolute: -0.057,
        percent: -1.31,
        direction: 'DOWN'
      },
      significance: 'MEDIUM',
      region: 'US'
    }
  ];
};

const generateCurrencyPairs = (): CurrencyPair[] => {
  return [
    {
      id: 'pair-001',
      baseCurrency: 'EUR',
      quoteCurrency: 'USD',
      symbol: 'EURUSD',
      name: 'Euro to US Dollar',
      isActive: true,
      isMajorPair: true,
      priority: 'CRITICAL',
      volatilityThreshold: 0.02,
      trendThreshold: 0.05,
      region: 'Global',
      createdAt: new Date('2020-01-01'),
      updatedAt: new Date('2024-07-20'),
    },
    {
      id: 'pair-002',
      baseCurrency: 'GBP',
      quoteCurrency: 'USD',
      symbol: 'GBPUSD',
      name: 'British Pound to US Dollar',
      isActive: true,
      isMajorPair: true,
      priority: 'HIGH',
      volatilityThreshold: 0.025,
      trendThreshold: 0.05,
      region: 'Global',
      createdAt: new Date('2020-01-01'),
      updatedAt: new Date('2024-07-20'),
    },
    {
      id: 'pair-003',
      baseCurrency: 'USD',
      quoteCurrency: 'JPY',
      symbol: 'USDJPY',
      name: 'US Dollar to Japanese Yen',
      isActive: true,
      isMajorPair: true,
      priority: 'HIGH',
      volatilityThreshold: 0.02,
      trendThreshold: 0.05,
      region: 'Global',
      createdAt: new Date('2020-01-01'),
      updatedAt: new Date('2024-07-20'),
    },
    {
      id: 'pair-004',
      baseCurrency: 'USD',
      quoteCurrency: 'CHF',
      symbol: 'USDCHF',
      name: 'US Dollar to Swiss Franc',
      isActive: true,
      isMajorPair: true,
      priority: 'MEDIUM',
      volatilityThreshold: 0.015,
      trendThreshold: 0.04,
      region: 'Global',
      createdAt: new Date('2020-01-01'),
      updatedAt: new Date('2024-07-20'),
    }
  ];
};

const generateCurrencySnapshots = (pairs: CurrencyPair[]): CurrencySnapshot[] => {
  const snapshots: CurrencySnapshot[] = [
    {
      pair: pairs[0], // EURUSD
      rate: 1.0842,
      change24h: -0.0023,
      changePercent24h: -0.21,
      volatility: 0.0156,
      trend: 'WEAKENING',
      alertLevel: 'LOW'
    },
    {
      pair: pairs[1], // GBPUSD
      rate: 1.2945,
      change24h: 0.0078,
      changePercent24h: 0.61,
      volatility: 0.0234,
      trend: 'STRENGTHENING',
      alertLevel: 'MEDIUM'
    },
    {
      pair: pairs[2], // USDJPY
      rate: 157.23,
      change24h: -0.45,
      changePercent24h: -0.29,
      volatility: 0.0187,
      trend: 'STABLE',
      alertLevel: 'LOW'
    },
    {
      pair: pairs[3], // USDCHF
      rate: 0.8956,
      change24h: -0.0012,
      changePercent24h: -0.13,
      volatility: 0.0098,
      trend: 'STABLE',
      alertLevel: 'NONE'
    }
  ];

  return snapshots;
};

const generateGeopoliticalEvents = (): GeopoliticalEvent[] => {
  return [
    {
      id: 'geo-001',
      title: 'US-China Trade Relations Update',
      description: 'New bilateral trade discussions initiated following recent tariff adjustments',
      category: 'TRADE_WAR',
      severity: 'HIGH',
      confidence: 0.85,
      regions: ['US', 'Asia', 'Global'],
      countries: ['United States', 'China'],
      eventDate: new Date('2024-07-19'),
      discoveredAt: new Date('2024-07-19T08:00:00Z'),
      lastUpdated: new Date('2024-07-20T12:00:00Z'),
      economicImpact: 'MIXED',
      marketImpact: 'VOLATILE',
      expectedDuration: 'MEDIUM_TERM',
      affectedSectors: ['Technology', 'Manufacturing', 'Agriculture'],
      affectedAssets: ['Equities', 'Commodities', 'Currencies'],
      isResolved: false,
      sources: [
        { id: 's1', name: 'Reuters', url: 'reuters.com', reliability: 0.95 },
        { id: 's2', name: 'Bloomberg', url: 'bloomberg.com', reliability: 0.93 }
      ],
      keyPoints: [
        { id: 'kp1', point: 'Technology sector tariffs under review', impact: 'HIGH', evidence: 'Official trade representative statement' },
        { id: 'kp2', point: 'Agricultural imports quota negotiations ongoing', impact: 'MEDIUM', evidence: 'Bilateral meeting minutes' }
      ],
      riskFactors: [
        { id: 'rf1', factor: 'Escalation to broader trade restrictions', probability: 0.3, impact: 0.8 },
        { id: 'rf2', factor: 'Supply chain disruptions', probability: 0.6, impact: 0.6 }
      ],
      createdBy: 'auto-detector',
      createdAt: new Date('2024-07-19T08:00:00Z'),
      updatedAt: new Date('2024-07-20T12:00:00Z'),
    },
    {
      id: 'geo-002',
      title: 'ECB Policy Meeting Anticipation',
      description: 'European Central Bank preparing for key interest rate decision amid inflation concerns',
      category: 'POLICY_CHANGE',
      severity: 'MEDIUM',
      confidence: 0.92,
      regions: ['EU'],
      countries: ['Germany', 'France', 'Italy', 'Spain'],
      eventDate: new Date('2024-07-25'),
      discoveredAt: new Date('2024-07-18T14:00:00Z'),
      lastUpdated: new Date('2024-07-20T09:00:00Z'),
      economicImpact: 'POSITIVE',
      marketImpact: 'BULLISH',
      expectedDuration: 'SHORT_TERM',
      affectedSectors: ['Banking', 'Real Estate'],
      affectedAssets: ['EUR', 'European Bonds', 'Banking Stocks'],
      isResolved: false,
      sources: [
        { id: 's3', name: 'ECB Press Release', url: 'ecb.europa.eu', reliability: 1.0 },
        { id: 's4', name: 'Financial Times', url: 'ft.com', reliability: 0.91 }
      ],
      keyPoints: [
        { id: 'kp3', point: '25bps rate cut expected by majority of economists', impact: 'HIGH', evidence: 'Market consensus survey' },
        { id: 'kp4', point: 'Inflation target of 2% within reach', impact: 'MEDIUM', evidence: 'Recent CPI data' }
      ],
      createdBy: 'auto-detector',
      createdAt: new Date('2024-07-18T14:00:00Z'),
      updatedAt: new Date('2024-07-20T09:00:00Z'),
    },
    {
      id: 'geo-003',
      title: 'UK General Election Aftermath',
      description: 'New government economic policies and Brexit implications under review',
      category: 'ELECTION',
      severity: 'MEDIUM',
      confidence: 0.88,
      regions: ['UK'],
      countries: ['United Kingdom'],
      eventDate: new Date('2024-07-04'),
      discoveredAt: new Date('2024-07-05T06:00:00Z'),
      lastUpdated: new Date('2024-07-20T11:00:00Z'),
      economicImpact: 'POSITIVE',
      marketImpact: 'BULLISH',
      expectedDuration: 'LONG_TERM',
      affectedSectors: ['Financial Services', 'Energy', 'Healthcare'],
      affectedAssets: ['GBP', 'UK Equities', 'Gilts'],
      isResolved: false,
      sources: [
        { id: 's5', name: 'BBC', url: 'bbc.co.uk', reliability: 0.94 },
        { id: 's6', name: 'The Guardian', url: 'theguardian.com', reliability: 0.89 }
      ],
      keyPoints: [
        { id: 'kp5', point: 'Pro-business policies expected to boost investment', impact: 'HIGH', evidence: 'Manifesto commitments' },
        { id: 'kp6', point: 'EU relationship normalization anticipated', impact: 'MEDIUM', evidence: 'Pre-election statements' }
      ],
      createdBy: 'auto-detector',
      createdAt: new Date('2024-07-05T06:00:00Z'),
      updatedAt: new Date('2024-07-20T11:00:00Z'),
    }
  ];
};

const generateEventSummaries = (events: GeopoliticalEvent[]): EventSummary[] => {
  return events.map(event => ({
    id: event.id,
    title: event.title,
    category: event.category,
    severity: event.severity,
    regions: event.regions,
    impact: {
      economic: event.economicImpact,
      market: event.marketImpact
    },
    timeline: {
      discovered: event.discoveredAt,
      event: event.eventDate,
      updated: event.lastUpdated
    },
    status: event.isResolved ? 'RESOLVED' : 'ACTIVE'
  }));
};

const generateMarketAlerts = (): MarketAlert[] => {
  return [
    {
      id: 'alert-001',
      title: 'VIX Volatility Spike Alert',
      description: 'VIX has increased by over 10% in the last trading session, indicating heightened market uncertainty',
      alertType: 'VOLATILITY',
      severity: 'HIGH',
      status: 'ACTIVE',
      indicatorId: 'ind-002',
      triggerValue: 15.67,
      thresholdValue: 15.0,
      currentValue: 15.67,
      triggeredAt: new Date('2024-07-20T16:05:00Z'),
      impact: 'Increased market volatility may affect portfolio valuations and trading strategies',
      recommendations: [
        {
          id: 'rec1',
          action: 'Review portfolio hedging strategies',
          rationale: 'Higher volatility increases downside risk exposure',
          priority: 'HIGH',
          timeframe: 'Immediate',
          confidence: 0.85
        },
        {
          id: 'rec2',
          action: 'Consider reducing position sizes',
          rationale: 'Volatility spike often precedes broader market movements',
          priority: 'MEDIUM',
          timeframe: '24 hours',
          confidence: 0.70
        }
      ],
      createdAt: new Date('2024-07-20T16:05:00Z'),
      updatedAt: new Date('2024-07-20T16:05:00Z'),
    },
    {
      id: 'alert-002',
      title: 'EURUSD Trend Break Alert',
      description: 'EUR/USD has broken below key technical support level with increased volume',
      alertType: 'TREND',
      severity: 'MEDIUM',
      status: 'ACTIVE',
      currencyPairId: 'pair-001',
      triggerValue: 1.0842,
      thresholdValue: 1.0850,
      currentValue: 1.0842,
      triggeredAt: new Date('2024-07-20T14:30:00Z'),
      impact: 'EUR weakness may affect European equity valuations and cross-border investments',
      recommendations: [
        {
          id: 'rec3',
          action: 'Monitor EUR-denominated positions',
          rationale: 'Currency weakness may impact returns for USD-based investors',
          priority: 'MEDIUM',
          timeframe: 'This week',
          confidence: 0.75
        }
      ],
      createdAt: new Date('2024-07-20T14:30:00Z'),
      updatedAt: new Date('2024-07-20T14:30:00Z'),
    },
    {
      id: 'alert-003',
      title: 'Gold Price Momentum Alert',
      description: 'Gold price showing strong upward momentum amid geopolitical tensions',
      alertType: 'TREND',
      severity: 'LOW',
      status: 'ACKNOWLEDGED',
      indicatorId: 'ind-005',
      triggerValue: 2401.50,
      thresholdValue: 2400.00,
      currentValue: 2401.50,
      triggeredAt: new Date('2024-07-20T15:05:00Z'),
      acknowledgedAt: new Date('2024-07-20T15:30:00Z'),
      acknowledgedBy: 'trader-001',
      impact: 'Precious metals strength indicates flight-to-safety sentiment',
      createdAt: new Date('2024-07-20T15:05:00Z'),
      updatedAt: new Date('2024-07-20T15:30:00Z'),
    }
  ];
};

const generateAFMEMetrics = (): AFMEMetric[] => {
  return [
    {
      id: 'afme-001',
      metricName: 'EU Investment Banking Revenue',
      category: 'CAPITAL_MARKETS',
      subcategory: 'Investment Banking',
      value: 15.2,
      unit: 'EUR Billion',
      currency: 'EUR',
      period: 'H1 2024',
      reportDate: new Date('2024-07-15'),
      dataDate: new Date('2024-06-30'),
      region: 'EU',
      description: 'Total investment banking revenue across EU member states',
      previousValue: 14.8,
      changeAbsolute: 0.4,
      changePercent: 2.7,
      isEstimate: false,
      confidence: 0.95,
      source: 'AFME',
      createdAt: new Date('2024-07-15'),
      updatedAt: new Date('2024-07-15'),
    },
    {
      id: 'afme-002',
      metricName: 'Corporate Bond Issuance',
      category: 'CAPITAL_MARKETS',
      subcategory: 'Debt Markets',
      value: 485.7,
      unit: 'EUR Billion',
      currency: 'EUR',
      period: 'H1 2024',
      reportDate: new Date('2024-07-15'),
      dataDate: new Date('2024-06-30'),
      region: 'EU',
      description: 'Total corporate bond issuance in European markets',
      previousValue: 512.3,
      changeAbsolute: -26.6,
      changePercent: -5.2,
      isEstimate: false,
      confidence: 0.98,
      source: 'AFME',
      createdAt: new Date('2024-07-15'),
      updatedAt: new Date('2024-07-15'),
    },
    {
      id: 'afme-003',
      metricName: 'Sustainable Finance Volume',
      category: 'ESG',
      subcategory: 'Green Finance',
      value: 128.9,
      unit: 'EUR Billion',
      currency: 'EUR',
      period: 'H1 2024',
      reportDate: new Date('2024-07-15'),
      dataDate: new Date('2024-06-30'),
      region: 'EU',
      description: 'Green and sustainable finance instrument issuance',
      previousValue: 95.4,
      changeAbsolute: 33.5,
      changePercent: 35.1,
      isEstimate: false,
      confidence: 0.92,
      source: 'AFME',
      createdAt: new Date('2024-07-15'),
      updatedAt: new Date('2024-07-15'),
    },
    {
      id: 'afme-004',
      metricName: 'EU Banking Sector ROE',
      category: 'BANKING',
      subcategory: 'Performance',
      value: 8.7,
      unit: '%',
      period: 'Q2 2024',
      reportDate: new Date('2024-07-20'),
      dataDate: new Date('2024-06-30'),
      region: 'EU',
      description: 'Average Return on Equity for major EU banks',
      previousValue: 8.2,
      changeAbsolute: 0.5,
      changePercent: 6.1,
      isEstimate: false,
      confidence: 0.96,
      source: 'AFME',
      createdAt: new Date('2024-07-20'),
      updatedAt: new Date('2024-07-20'),
    },
    {
      id: 'afme-005',
      metricName: 'FinTech Investment Volume',
      category: 'FINTECH',
      subcategory: 'Venture Capital',
      value: 3.8,
      unit: 'EUR Billion',
      currency: 'EUR',
      period: 'H1 2024',
      reportDate: new Date('2024-07-18'),
      dataDate: new Date('2024-06-30'),
      region: 'EU',
      description: 'Total venture capital and private equity investment in EU FinTech',
      previousValue: 4.2,
      changeAbsolute: -0.4,
      changePercent: -9.5,
      isEstimate: false,
      confidence: 0.89,
      source: 'AFME',
      createdAt: new Date('2024-07-18'),
      updatedAt: new Date('2024-07-18'),
    }
  ];
};

const generateAFMESummaries = (metrics: AFMEMetric[]): AFMESummary[] => {
  const categories = ['CAPITAL_MARKETS', 'BANKING', 'ESG', 'FINTECH'] as const;
  
  return categories.map(category => {
    const categoryMetrics = metrics.filter(m => m.category === category);
    return {
      category,
      metrics: {
        total: categoryMetrics.length,
        updated: categoryMetrics.filter(m => 
          new Date(m.updatedAt).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000
        ).length,
        alerts: categoryMetrics.filter(m => 
          Math.abs(m.changePercent || 0) > 10
        ).length,
      },
      keyMetrics: categoryMetrics.slice(0, 3).map(m => ({
        name: m.metricName,
        value: m.value,
        change: m.changePercent || 0,
        unit: m.unit,
      })),
      lastUpdate: new Date(Math.max(...categoryMetrics.map(m => new Date(m.updatedAt).getTime()))),
    };
  });
};

const generateMarketReports = (): MarketReport[] => {
  return [
    {
      id: 'report-001',
      title: 'Weekly Market Intelligence Summary',
      reportType: 'WEEKLY',
      category: 'MARKET_OVERVIEW',
      summary: 'Global markets showed mixed performance this week with increased volatility across major indices',
      content: '# Weekly Market Summary\n\n## Key Developments\n\n- VIX volatility spike indicates market uncertainty\n- European markets outperformed US counterparts\n- Gold reached new highs amid geopolitical tensions\n\n## Outlook\n\nContinued monitoring of central bank policies and geopolitical developments recommended.',
      keyFindings: [
        'Volatility increased across all major markets',
        'European equities showed relative strength',
        'Currency markets experienced heightened activity',
        'Commodity prices reflected safe-haven demand'
      ],
      recommendations: [
        {
          id: 'rec-r1',
          action: 'Increase portfolio hedging',
          rationale: 'Rising volatility environment',
          priority: 'MEDIUM',
          confidence: 0.8
        }
      ],
      regions: ['Global', 'US', 'EU', 'Asia'],
      timeframe: 'July 14-20, 2024',
      status: 'PUBLISHED',
      publishedAt: new Date('2024-07-20T18:00:00Z'),
      tags: ['weekly', 'volatility', 'global-markets'],
      createdBy: 'system-reporter',
      createdAt: new Date('2024-07-20T17:00:00Z'),
      updatedAt: new Date('2024-07-20T18:00:00Z'),
    }
  ];
};

export async function GET() {
  try {
    const indicators = generateMockMarketIndicators();
    const trendingIndicators = generateTrendingIndicators(indicators);
    const currencyPairs = generateCurrencyPairs();
    const currencySnapshots = generateCurrencySnapshots(currencyPairs);
    const geopoliticalEvents = generateGeopoliticalEvents();
    const eventSummaries = generateEventSummaries(geopoliticalEvents);
    const alerts = generateMarketAlerts();
    const afmeMetrics = generateAFMEMetrics();
    const afmeSummaries = generateAFMESummaries(afmeMetrics);
    const reports = generateMarketReports();

    const stats: MarketIntelligenceStats = {
      totalIndicators: indicators.length,
      activeAlerts: alerts.filter(a => a.status === 'ACTIVE').length,
      currencyPairs: currencyPairs.length,
      geopoliticalEvents: geopoliticalEvents.filter(e => !e.isResolved).length,
      criticalAlerts: alerts.filter(a => a.severity === 'CRITICAL').length,
      dataPointsToday: indicators.reduce((sum, ind) => sum + (ind.latestDataPoint ? 1 : 0), 0),
      correlationsAnalyzed: 45, // Mock value
      reportsGenerated: reports.length,
    };

    const response: MarketIntelligenceResponse = {
      stats,
      indicators,
      trendingIndicators,
      currencyPairs,
      currencySnapshots,
      geopoliticalEvents,
      eventSummaries,
      alerts,
      correlations: [], // Would be populated with correlation data
      afmeMetrics,
      afmeSummaries,
      reports,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error in market intelligence API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch market intelligence data' },
      { status: 500 }
    );
  }
}