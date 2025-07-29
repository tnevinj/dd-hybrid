'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUnifiedPortfolio } from '../contexts/UnifiedPortfolioContext';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  source: string;
  publishedAt: string;
  category: 'market' | 'portfolio' | 'sector' | 'regulatory' | 'economic';
  sentiment: 'positive' | 'neutral' | 'negative';
  relevanceScore: number;
  relatedAssets: string[];
  tags: string[];
  impact: 'high' | 'medium' | 'low';
}

interface EconomicIndicator {
  id: string;
  name: string;
  value: number;
  previousValue: number;
  change: number;
  changePercent: number;
  lastUpdated: string;
  trend: 'up' | 'down' | 'stable';
  category: 'inflation' | 'employment' | 'growth' | 'interest_rates' | 'market';
}

interface MarketTrend {
  sector: string;
  trend: 'bullish' | 'bearish' | 'neutral';
  confidence: number;
  timeframe: '1M' | '3M' | '6M' | '1Y';
  keyDrivers: string[];
  portfolioExposure: number;
  potentialImpact: 'high' | 'medium' | 'low';
}

interface PeerBenchmark {
  metric: string;
  portfolioValue: number;
  peerAverage: number;
  topQuartile: number;
  percentile: number;
  category: 'performance' | 'risk' | 'allocation' | 'fees';
}

export function MarketIntelligence() {
  const { state, analytics } = useUnifiedPortfolio();
  const [selectedTab, setSelectedTab] = useState('news');
  const [newsFilter, setNewsFilter] = useState<string>('all');

  // Mock news data
  const newsItems: NewsItem[] = useMemo(() => [
    {
      id: 'news-1',
      title: 'Private Equity Dry Powder Reaches Record High at $4.7 Trillion',
      summary: 'Global private equity firms are sitting on unprecedented levels of undeployed capital, creating competitive pressures in the market and driving up valuations across sectors.',
      source: 'Private Equity International',
      publishedAt: '2024-01-15T10:30:00Z',
      category: 'market',
      sentiment: 'neutral',
      relevanceScore: 0.92,
      relatedAssets: [],
      tags: ['private equity', 'dry powder', 'valuations'],
      impact: 'high'
    },
    {
      id: 'news-2',
      title: 'Technology Sector Faces Headwinds from Rising Interest Rates',
      summary: 'Higher borrowing costs are pressuring tech valuations, particularly affecting growth-stage companies in the portfolio. Multiple compression expected to continue through Q2.',
      source: 'TechCrunch',
      publishedAt: '2024-01-14T15:45:00Z',
      category: 'sector',
      sentiment: 'negative',
      relevanceScore: 0.88,
      relatedAssets: ['asset-1'], // TechCorp Inc
      tags: ['technology', 'interest rates', 'valuations'],
      impact: 'high'
    },
    {
      id: 'news-3',
      title: 'Infrastructure Investment Demand Surges Amid ESG Focus',
      summary: 'Renewable energy and sustainable infrastructure assets are seeing increased investor interest, with multiples expanding 15-20% year-over-year.',
      source: 'Infrastructure Investor',
      publishedAt: '2024-01-13T09:15:00Z',
      category: 'sector',
      sentiment: 'positive',
      relevanceScore: 0.85,
      relatedAssets: ['asset-3'], // Solar Energy Facility
      tags: ['infrastructure', 'ESG', 'renewable energy'],
      impact: 'medium'
    },
    {
      id: 'news-4',
      title: 'Fed Signals Potential Rate Cuts in H2 2024',
      summary: 'Federal Reserve officials hint at possible monetary policy easing if inflation continues to moderate, potentially benefiting portfolio companies with high debt loads.',
      source: 'Wall Street Journal',
      publishedAt: '2024-01-12T14:20:00Z',
      category: 'economic',
      sentiment: 'positive',
      relevanceScore: 0.79,
      relatedAssets: [],
      tags: ['federal reserve', 'interest rates', 'monetary policy'],
      impact: 'high'
    },
    {
      id: 'news-5',
      title: 'Real Estate Market Shows Signs of Stabilization',
      summary: 'Commercial real estate transactions increased 8% in Q4, suggesting market conditions may be improving after 18 months of decline.',
      source: 'Commercial Observer',
      publishedAt: '2024-01-11T11:30:00Z',
      category: 'sector',
      sentiment: 'positive',
      relevanceScore: 0.82,
      relatedAssets: ['asset-2'], // Downtown Office Complex
      tags: ['real estate', 'commercial', 'transactions'],
      impact: 'medium'
    }
  ], []);

  // Mock economic indicators
  const economicIndicators: EconomicIndicator[] = useMemo(() => [
    {
      id: 'cpi',
      name: 'Consumer Price Index',
      value: 3.1,
      previousValue: 3.4,
      change: -0.3,
      changePercent: -8.8,
      lastUpdated: '2024-01-12T08:30:00Z',
      trend: 'down',
      category: 'inflation'
    },
    {
      id: 'unemployment',
      name: 'Unemployment Rate',
      value: 3.7,
      previousValue: 3.9,
      change: -0.2,
      changePercent: -5.1,
      lastUpdated: '2024-01-05T08:30:00Z',
      trend: 'down',
      category: 'employment'
    },
    {
      id: 'gdp',
      name: 'GDP Growth (QoQ)',
      value: 2.1,
      previousValue: 1.8,
      change: 0.3,
      changePercent: 16.7,
      lastUpdated: '2024-01-10T08:30:00Z',
      trend: 'up',
      category: 'growth'
    },
    {
      id: 'fed-rate',
      name: 'Federal Funds Rate',
      value: 5.25,
      previousValue: 5.25,
      change: 0,
      changePercent: 0,
      lastUpdated: '2024-01-08T14:00:00Z',
      trend: 'stable',
      category: 'interest_rates'
    },
    {
      id: 'sp500',
      name: 'S&P 500',
      value: 4850.2,
      previousValue: 4820.1,
      change: 30.1,
      changePercent: 0.62,
      lastUpdated: '2024-01-15T16:00:00Z',
      trend: 'up',
      category: 'market'
    }
  ], []);

  // Mock market trends
  const marketTrends: MarketTrend[] = useMemo(() => [
    {
      sector: 'Technology',
      trend: 'bearish',
      confidence: 0.75,
      timeframe: '6M',
      keyDrivers: ['Rising interest rates', 'Multiple compression', 'Reduced growth funding'],
      portfolioExposure: 0.35,
      potentialImpact: 'high'
    },
    {
      sector: 'Infrastructure',
      trend: 'bullish',
      confidence: 0.82,
      timeframe: '1Y',
      keyDrivers: ['ESG focus', 'Government spending', 'Energy transition'],
      portfolioExposure: 0.28,
      potentialImpact: 'medium'
    },
    {
      sector: 'Real Estate',
      trend: 'neutral',
      confidence: 0.68,
      timeframe: '3M',
      keyDrivers: ['Stabilizing rates', 'Occupancy recovery', 'Regional variations'],
      portfolioExposure: 0.25,
      potentialImpact: 'medium'
    },
    {
      sector: 'Healthcare',
      trend: 'bullish',
      confidence: 0.71,
      timeframe: '1Y',
      keyDrivers: ['Aging demographics', 'Innovation pipeline', 'Defensive characteristics'],
      portfolioExposure: 0.12,
      potentialImpact: 'low'
    }
  ], []);

  // Mock peer benchmarks
  const peerBenchmarks: PeerBenchmark[] = useMemo(() => [
    {
      metric: 'Net IRR',
      portfolioValue: 0.178,
      peerAverage: 0.145,
      topQuartile: 0.195,
      percentile: 72,
      category: 'performance'
    },
    {
      metric: 'TVPI',
      portfolioValue: 1.85,
      peerAverage: 1.62,
      topQuartile: 1.95,
      percentile: 68,
      category: 'performance'
    },
    {
      metric: 'Portfolio Beta',
      portfolioValue: 1.12,
      peerAverage: 1.08,
      topQuartile: 0.95,
      percentile: 42,
      category: 'risk'
    },
    {
      metric: 'Concentration Risk',
      portfolioValue: 0.18,
      peerAverage: 0.22,
      topQuartile: 0.15,
      percentile: 65,
      category: 'risk'
    }
  ], []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${(value * 100).toFixed(1)}%`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'bg-green-100 text-green-800';
      case 'negative': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up':
      case 'bullish': return 'text-green-600';
      case 'down':
      case 'bearish': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredNews = newsItems.filter(item => 
    newsFilter === 'all' || item.category === newsFilter
  );

  if (!state.currentPortfolio) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">No portfolio data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="news">Market News</TabsTrigger>
          <TabsTrigger value="indicators">Economic Data</TabsTrigger>
          <TabsTrigger value="trends">Market Trends</TabsTrigger>
          <TabsTrigger value="benchmarks">Peer Benchmarks</TabsTrigger>
        </TabsList>

        {/* Market News Tab */}
        <TabsContent value="news" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Market Intelligence & News</h3>
            <div className="flex items-center space-x-4">
              <select
                value={newsFilter}
                onChange={(e) => setNewsFilter(e.target.value)}
                className="px-3 py-1 text-sm border border-gray-300 rounded-md"
              >
                <option value="all">All Categories</option>
                <option value="market">Market</option>
                <option value="sector">Sector</option>
                <option value="economic">Economic</option>
                <option value="regulatory">Regulatory</option>
                <option value="portfolio">Portfolio</option>
              </select>
              <Button size="sm">Configure Alerts</Button>
            </div>
          </div>

          <div className="space-y-4">
            {filteredNews.map((item) => (
              <Card key={item.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-lg leading-tight">{item.title}</CardTitle>
                      <div className="flex items-center space-x-2 mt-2">
                        <Badge variant="outline">{item.source}</Badge>
                        <Badge className={getSentimentColor(item.sentiment)}>
                          {item.sentiment}
                        </Badge>
                        <Badge className={getImpactColor(item.impact)}>
                          {item.impact} impact
                        </Badge>
                        <span className="text-sm text-gray-500">
                          {formatDate(item.publishedAt)}
                        </span>
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      <div className="text-sm font-medium">Relevance</div>
                      <div className="text-lg font-bold text-blue-600">
                        {(item.relevanceScore * 100).toFixed(0)}%
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-3">{item.summary}</p>
                  
                  {item.relatedAssets.length > 0 && (
                    <div className="mb-3">
                      <span className="text-sm font-medium text-gray-600">Related Portfolio Assets: </span>
                      {item.relatedAssets.map((assetId) => {
                        const asset = state.currentPortfolio?.assets.find(a => a.id === assetId);
                        return asset ? (
                          <Badge key={assetId} variant="outline" className="ml-1">
                            {asset.name}
                          </Badge>
                        ) : null;
                      })}
                    </div>
                  )}
                  
                  <div className="flex flex-wrap gap-1">
                    {item.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Economic Indicators Tab */}
        <TabsContent value="indicators" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Economic Indicators</h3>
            <Button size="sm">Add Indicator</Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {economicIndicators.map((indicator) => (
              <Card key={indicator.id}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">{indicator.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-end">
                    <div>
                      <div className="text-2xl font-bold">
                        {indicator.category === 'market' ? formatCurrency(indicator.value) : 
                         indicator.category === 'interest_rates' ? `${indicator.value}%` :
                         `${indicator.value}%`}
                      </div>
                      <div className={`text-sm font-medium ${getTrendColor(indicator.trend)}`}>
                        {indicator.change >= 0 ? '+' : ''}{indicator.changePercent.toFixed(1)}%
                      </div>
                    </div>
                    <div className={`text-2xl ${getTrendColor(indicator.trend)}`}>
                      {indicator.trend === 'up' ? '↗️' : 
                       indicator.trend === 'down' ? '↘️' : '➡️'}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Updated {formatDate(indicator.lastUpdated)}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Economic Indicators Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Economic Indicators Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={economicIndicators.map(ind => ({
                  name: ind.name.split(' ')[0],
                  current: ind.value,
                  previous: ind.previousValue,
                  change: ind.changePercent
                }))}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="change" 
                    stroke="#0088FE" 
                    strokeWidth={3}
                    name="% Change"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Market Trends Tab */}
        <TabsContent value="trends" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Market Trends Analysis</h3>
            <Button size="sm">Update Analysis</Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {marketTrends.map((trend) => (
              <Card key={trend.sector}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{trend.sector}</CardTitle>
                    <div className="text-right">
                      <Badge className={
                        trend.trend === 'bullish' ? 'bg-green-100 text-green-800' :
                        trend.trend === 'bearish' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }>
                        {trend.trend.toUpperCase()}
                      </Badge>
                      <div className="text-sm text-gray-600 mt-1">
                        {trend.timeframe} outlook
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm text-gray-600">Confidence:</span>
                      <div className="font-semibold">{(trend.confidence * 100).toFixed(0)}%</div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${trend.confidence * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Portfolio Exposure:</span>
                      <div className="font-semibold">{formatPercentage(trend.portfolioExposure)}</div>
                      <Badge className={getImpactColor(trend.potentialImpact)} size="sm">
                        {trend.potentialImpact} impact
                      </Badge>
                    </div>
                  </div>

                  <div>
                    <span className="text-sm font-medium text-gray-700">Key Drivers:</span>
                    <ul className="mt-1 space-y-1">
                      {trend.keyDrivers.map((driver, index) => (
                        <li key={index} className="text-sm text-gray-600 flex items-center">
                          <span className="w-1 h-1 bg-gray-400 rounded-full mr-2"></span>
                          {driver}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Peer Benchmarks Tab */}
        <TabsContent value="benchmarks" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Peer Benchmarking</h3>
            <Button size="sm">Update Benchmarks</Button>
          </div>

          <div className="space-y-4">
            {peerBenchmarks.map((benchmark) => (
              <Card key={benchmark.metric}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-semibold text-lg">{benchmark.metric}</h4>
                    <Badge variant="outline">
                      {benchmark.percentile}th percentile
                    </Badge>
                  </div>

                  <div className="grid grid-cols-3 gap-6 mb-4">
                    <div className="text-center">
                      <div className="text-sm text-gray-600">Portfolio</div>
                      <div className="text-xl font-bold text-blue-600">
                        {benchmark.category === 'performance' ? 
                          (benchmark.metric.includes('IRR') ? formatPercentage(benchmark.portfolioValue) : 
                           `${benchmark.portfolioValue.toFixed(2)}x`) :
                         benchmark.portfolioValue.toFixed(2)}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-600">Peer Average</div>
                      <div className="text-xl font-bold text-gray-600">
                        {benchmark.category === 'performance' ? 
                          (benchmark.metric.includes('IRR') ? formatPercentage(benchmark.peerAverage) : 
                           `${benchmark.peerAverage.toFixed(2)}x`) :
                         benchmark.peerAverage.toFixed(2)}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-600">Top Quartile</div>
                      <div className="text-xl font-bold text-green-600">
                        {benchmark.category === 'performance' ? 
                          (benchmark.metric.includes('IRR') ? formatPercentage(benchmark.topQuartile) : 
                           `${benchmark.topQuartile.toFixed(2)}x`) :
                         benchmark.topQuartile.toFixed(2)}
                      </div>
                    </div>
                  </div>

                  <div className="relative">
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full ${
                          benchmark.percentile >= 75 ? 'bg-green-500' :
                          benchmark.percentile >= 50 ? 'bg-blue-500' :
                          benchmark.percentile >= 25 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${benchmark.percentile}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>0th</span>
                      <span>25th</span>
                      <span>50th</span>
                      <span>75th</span>
                      <span>100th</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}