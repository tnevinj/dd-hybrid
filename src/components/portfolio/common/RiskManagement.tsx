'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUnifiedPortfolio } from '../contexts/UnifiedPortfolioContext';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ComposedChart,
  PieChart,
  Pie,
  Cell
} from 'recharts';

interface StressTestScenario {
  id: string;
  name: string;
  description: string;
  type: 'market_crash' | 'interest_rate' | 'credit_crisis' | 'inflation' | 'custom';
  severity: 'mild' | 'moderate' | 'severe' | 'extreme';
  parameters: {
    equityShock?: number;
    creditSpread?: number;
    interestRateShift?: number;
    inflationShock?: number;
    duration?: number; // months
  };
  historicalPrecedent?: string;
}

interface StressTestResult {
  scenarioId: string;
  portfolioValue: number;
  portfolioChange: number;
  portfolioChangePercent: number;
  maxDrawdown: number;
  timeToRecover: number; // months
  assetImpacts: Array<{
    assetId: string;
    assetName: string;
    valueChange: number;
    changePercent: number;
  }>;
  riskMetrics: {
    var95: number;
    var99: number;
    expectedShortfall: number;
    volatility: number;
  };
}

interface RiskAlert {
  id: string;
  type: 'concentration' | 'liquidity' | 'correlation' | 'leverage' | 'market' | 'credit';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  recommendation: string;
  triggeredAt: string;
  threshold: number;
  currentValue: number;
  assetIds?: string[];
}

interface RiskLimit {
  id: string;
  name: string;
  type: 'portfolio' | 'asset' | 'sector' | 'geography';
  metric: 'var' | 'concentration' | 'leverage' | 'liquidity' | 'correlation';
  limit: number;
  currentValue: number;
  utilization: number;
  status: 'safe' | 'warning' | 'breach';
}

export function RiskManagement() {
  const { state, analytics, professionalMetrics } = useUnifiedPortfolio();
  const [selectedTab, setSelectedTab] = useState('overview');
  const [selectedScenario, setSelectedScenario] = useState<string>('market_crash_2008');

  // Mock stress test scenarios
  const stressTestScenarios: StressTestScenario[] = useMemo(() => [
    {
      id: 'market_crash_2008',
      name: '2008 Financial Crisis',
      description: 'Global financial market collapse scenario',
      type: 'market_crash',
      severity: 'extreme',
      parameters: {
        equityShock: -0.45,
        creditSpread: 0.08,
        interestRateShift: -0.03,
        duration: 18
      },
      historicalPrecedent: 'September 2008 - March 2009'
    },
    {
      id: 'covid_crash_2020',
      name: 'COVID-19 Market Shock',
      description: 'Pandemic-induced market volatility',
      type: 'market_crash',
      severity: 'severe',
      parameters: {
        equityShock: -0.35,
        creditSpread: 0.05,
        duration: 6
      },
      historicalPrecedent: 'February - March 2020'
    },
    {
      id: 'interest_rate_shock',
      name: 'Interest Rate Shock',
      description: 'Rapid interest rate increase scenario',
      type: 'interest_rate',
      severity: 'moderate',
      parameters: {
        interestRateShift: 0.04,
        duration: 12
      }
    },
    {
      id: 'inflation_crisis',
      name: 'High Inflation Environment',
      description: 'Persistent high inflation scenario',
      type: 'inflation',
      severity: 'moderate',
      parameters: {
        inflationShock: 0.06,
        interestRateShift: 0.03,
        duration: 24
      }
    },
    {
      id: 'credit_crisis',
      name: 'Credit Market Freeze',
      description: 'Liquidity crisis in credit markets',
      type: 'credit_crisis',
      severity: 'severe',
      parameters: {
        creditSpread: 0.12,
        equityShock: -0.25,
        duration: 12
      }
    }
  ], []);

  // Mock stress test results
  const stressTestResults: StressTestResult[] = useMemo(() => {
    if (!state.currentPortfolio || !analytics) return [];

    return stressTestScenarios.map(scenario => {
      const baseValue = analytics.totalPortfolioValue;
      let portfolioShock = 0;

      // Calculate portfolio shock based on scenario parameters
      if (scenario.parameters.equityShock) {
        portfolioShock += scenario.parameters.equityShock * 0.7; // Assume 70% equity exposure
      }
      if (scenario.parameters.creditSpread) {
        portfolioShock += scenario.parameters.creditSpread * -0.3; // Credit spread impact
      }

      const newValue = baseValue * (1 + portfolioShock);
      const valueChange = newValue - baseValue;

      return {
        scenarioId: scenario.id,
        portfolioValue: newValue,
        portfolioChange: valueChange,
        portfolioChangePercent: portfolioShock,
        maxDrawdown: Math.abs(portfolioShock) * 1.2,
        timeToRecover: scenario.parameters.duration || 12,
        assetImpacts: state.currentPortfolio.assets.slice(0, 5).map(asset => ({
          assetId: asset.id,
          assetName: asset.name,
          valueChange: asset.currentValue * portfolioShock * (0.8 + Math.random() * 0.4),
          changePercent: portfolioShock * (0.8 + Math.random() * 0.4)
        })),
        riskMetrics: {
          var95: Math.abs(valueChange) * 0.8,
          var99: Math.abs(valueChange) * 1.2,
          expectedShortfall: Math.abs(valueChange) * 1.5,
          volatility: Math.abs(portfolioShock) * 1.5
        }
      };
    });
  }, [stressTestScenarios, state.currentPortfolio, analytics]);

  // Mock risk alerts
  const riskAlerts: RiskAlert[] = useMemo(() => [
    {
      id: 'alert-1',
      type: 'concentration',
      severity: 'high',
      title: 'High Sector Concentration',
      description: 'Technology sector exposure exceeds risk tolerance at 35%',
      recommendation: 'Consider reducing technology exposure by 10-15%',
      triggeredAt: '2024-01-15T10:30:00Z',
      threshold: 30,
      currentValue: 35,
      assetIds: ['asset-1']
    },
    {
      id: 'alert-2',
      type: 'correlation',
      severity: 'medium',
      title: 'Increased Asset Correlation',
      description: 'Portfolio correlation has increased to 0.75, reducing diversification benefits',
      recommendation: 'Add uncorrelated assets or alternative investments',
      triggeredAt: '2024-01-14T15:45:00Z',
      threshold: 0.70,
      currentValue: 0.75
    },
    {
      id: 'alert-3',
      type: 'liquidity',
      severity: 'medium',
      title: 'Reduced Portfolio Liquidity',
      description: 'Liquid assets represent only 25% of portfolio, below 30% target',
      recommendation: 'Increase allocation to liquid assets or establish credit facilities',
      triggeredAt: '2024-01-13T09:15:00Z',
      threshold: 30,
      currentValue: 25
    }
  ], []);

  // Mock risk limits
  const riskLimits: RiskLimit[] = useMemo(() => [
    {
      id: 'limit-1',
      name: 'Portfolio VaR (95%)',
      type: 'portfolio',
      metric: 'var',
      limit: 15000000,
      currentValue: 12500000,
      utilization: 83.3,
      status: 'warning'
    },
    {
      id: 'limit-2',
      name: 'Single Asset Concentration',
      type: 'asset',
      metric: 'concentration',
      limit: 25,
      currentValue: 22,
      utilization: 88,
      status: 'warning'
    },
    {
      id: 'limit-3',
      name: 'Sector Concentration',
      type: 'sector',
      metric: 'concentration',
      limit: 30,
      currentValue: 35,
      utilization: 116.7,
      status: 'breach'
    },
    {
      id: 'limit-4',
      name: 'Portfolio Liquidity',
      type: 'portfolio',
      metric: 'liquidity',
      limit: 30,
      currentValue: 25,
      utilization: 83.3,
      status: 'warning'
    }
  ], []);

  // Risk dashboard metrics
  const riskDashboardData = useMemo(() => {
    if (!professionalMetrics) return null;

    return [
      { name: 'VaR (95%)', value: professionalMetrics.valueAtRisk95, max: 20000000, status: 'safe' },
      { name: 'VaR (99%)', value: professionalMetrics.valueAtRisk99, max: 30000000, status: 'warning' },
      { name: 'Max Drawdown', value: professionalMetrics.maxDrawdown * 100, max: 25, status: 'safe' },
      { name: 'Volatility', value: professionalMetrics.volatility * 100, max: 30, status: 'safe' },
      { name: 'Concentration', value: professionalMetrics.concentrationRisk * 100, max: 25, status: 'warning' },
      { name: 'Correlation', value: 75, max: 80, status: 'warning' }
    ];
  }, [professionalMetrics]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'breach': return 'bg-red-100 text-red-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'safe': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!state.currentPortfolio || !analytics) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">No portfolio data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Risk Overview</TabsTrigger>
          <TabsTrigger value="stress-testing">Stress Testing</TabsTrigger>
          <TabsTrigger value="alerts">Risk Alerts</TabsTrigger>
          <TabsTrigger value="limits">Risk Limits</TabsTrigger>
          <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
        </TabsList>

        {/* Risk Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Risk Management Overview</h3>
            <Button size="sm">Generate Risk Report</Button>
          </div>

          {/* Risk Dashboard */}
          {riskDashboardData && (
            <Card>
              <CardHeader>
                <CardTitle>Risk Dashboard</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={riskDashboardData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <PolarRadiusAxis 
                      angle={90} 
                      domain={[0, 'dataMax']} 
                      tick={{ fontSize: 10 }}
                    />
                    <Radar
                      name="Current Level"
                      dataKey="value"
                      stroke="#0088FE"
                      fill="#0088FE"
                      fillOpacity={0.3}
                      strokeWidth={2}
                    />
                    <Radar
                      name="Risk Limit"
                      dataKey="max"
                      stroke="#FF8042"
                      fill="transparent"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                    />
                    <Tooltip />
                    <Legend />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}

          {/* Key Risk Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Risk Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">7.2/10</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Moderate-High Risk
                </p>
                <Progress value={72} className="h-2 mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {riskAlerts.filter(alert => alert.severity === 'high' || alert.severity === 'critical').length}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Require attention
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Risk Limit Breaches</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {riskLimits.filter(limit => limit.status === 'breach').length}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Limits exceeded
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Worst Case Loss</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {formatCurrency(Math.max(...stressTestResults.map(r => Math.abs(r.portfolioChange))))}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Extreme scenario
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Risk Trend Analysis */}
          <Card>
            <CardHeader>
              <CardTitle>Risk Trend Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={[
                  { date: '2024-01', portfolioRisk: 6.8, marketRisk: 7.2, creditRisk: 5.5 },
                  { date: '2024-02', portfolioRisk: 7.1, marketRisk: 7.8, creditRisk: 5.8 },
                  { date: '2024-03', portfolioRisk: 7.5, marketRisk: 8.2, creditRisk: 6.2 },
                  { date: '2024-04', portfolioRisk: 7.2, marketRisk: 7.9, creditRisk: 6.0 },
                  { date: '2024-05', portfolioRisk: 7.0, marketRisk: 7.5, creditRisk: 5.9 }
                ]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="portfolioRisk" stroke="#0088FE" strokeWidth={3} name="Portfolio Risk" />
                  <Line type="monotone" dataKey="marketRisk" stroke="#00C49F" strokeWidth={2} name="Market Risk" />
                  <Line type="monotone" dataKey="creditRisk" stroke="#FFBB28" strokeWidth={2} name="Credit Risk" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Stress Testing Tab */}
        <TabsContent value="stress-testing" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Stress Testing & Scenario Analysis</h3>
            <Button size="sm">Run All Scenarios</Button>
          </div>

          {/* Scenario Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Stress Test Scenarios</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {stressTestScenarios.map((scenario) => (
                  <div
                    key={scenario.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedScenario === scenario.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedScenario(scenario.id)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium">{scenario.name}</h4>
                      <Badge className={getSeverityColor(scenario.severity)}>
                        {scenario.severity}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{scenario.description}</p>
                    {scenario.historicalPrecedent && (
                      <p className="text-xs text-gray-500">
                        Historical: {scenario.historicalPrecedent}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Stress Test Results */}
          {selectedScenario && (
            <div className="space-y-6">
              {(() => {
                const result = stressTestResults.find(r => r.scenarioId === selectedScenario);
                if (!result) return null;

                return (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium">Portfolio Impact</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold text-red-600">
                            {formatPercentage(result.portfolioChangePercent * 100)}
                          </div>
                          <div className="text-sm text-gray-600">
                            {formatCurrency(result.portfolioChange)}
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium">Max Drawdown</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold text-red-600">
                            -{formatPercentage(result.maxDrawdown * 100)}
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            Peak to trough loss
                          </p>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium">Recovery Time</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold text-orange-600">
                            {result.timeToRecover}
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            Months to recover
                          </p>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium">Expected Shortfall</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold text-red-600">
                            {formatCurrency(result.riskMetrics.expectedShortfall)}
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            Average loss beyond VaR
                          </p>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Asset Impact Analysis */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Asset Impact Analysis</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                          <BarChart data={result.assetImpacts}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis 
                              dataKey="assetName" 
                              tick={{ fontSize: 12 }}
                              angle={-45}
                              textAnchor="end"
                              height={80}
                            />
                            <YAxis tick={{ fontSize: 12 }} />
                            <Tooltip 
                              formatter={(value, name) => [
                                name === 'changePercent' ? `${Number(value).toFixed(1)}%` : formatCurrency(Number(value)),
                                name === 'changePercent' ? 'Change %' : 'Value Change'
                              ]}
                            />
                            <Bar dataKey="changePercent" fill="#FF8042" name="Impact %" />
                          </BarChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>
                  </>
                );
              })()}
            </div>
          )}

          {/* Scenario Comparison */}
          <Card>
            <CardHeader>
              <CardTitle>Scenario Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={stressTestResults.map(result => ({
                  scenario: stressTestScenarios.find(s => s.id === result.scenarioId)?.name || result.scenarioId,
                  portfolioLoss: Math.abs(result.portfolioChangePercent) * 100,
                  maxDrawdown: result.maxDrawdown * 100,
                  recoveryTime: result.timeToRecover
                }))}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="scenario" tick={{ fontSize: 10 }} angle={-45} textAnchor="end" height={80} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="portfolioLoss" fill="#FF8042" name="Portfolio Loss %" />
                  <Bar dataKey="maxDrawdown" fill="#FFBB28" name="Max Drawdown %" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Risk Alerts Tab */}
        <TabsContent value="alerts" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Risk Alerts & Notifications</h3>
            <Button size="sm">Configure Alerts</Button>
          </div>

          <div className="space-y-4">
            {riskAlerts.map((alert) => (
              <Card key={alert.id} className="border-l-4 border-l-orange-500">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge className={getSeverityColor(alert.severity)}>
                          {alert.severity.toUpperCase()}
                        </Badge>
                        <Badge variant="outline">{alert.type.replace('_', ' ').toUpperCase()}</Badge>
                        <span className="text-sm text-gray-500">
                          {new Date(alert.triggeredAt).toLocaleDateString()}
                        </span>
                      </div>
                      <h4 className="font-semibold text-gray-900 mb-1">{alert.title}</h4>
                      <p className="text-sm text-gray-700 mb-2">{alert.description}</p>
                      <p className="text-sm text-blue-600 font-medium">
                        💡 {alert.recommendation}
                      </p>
                    </div>
                    <div className="text-right ml-4">
                      <div className="text-lg font-bold">
                        {alert.type === 'correlation' ? 
                          alert.currentValue.toFixed(2) : 
                          `${alert.currentValue}${alert.type.includes('concentration') ? '%' : ''}`
                        }
                      </div>
                      <div className="text-sm text-gray-600">
                        Limit: {alert.type === 'correlation' ? 
                          alert.threshold.toFixed(2) : 
                          `${alert.threshold}${alert.type.includes('concentration') ? '%' : ''}`
                        }
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Risk Limits Tab */}
        <TabsContent value="limits" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Risk Limits & Controls</h3>
            <Button size="sm">Update Limits</Button>
          </div>

          <div className="space-y-4">
            {riskLimits.map((limit) => (
              <Card key={limit.id}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h4 className="font-semibold text-lg">{limit.name}</h4>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="outline">{limit.type}</Badge>
                        <Badge variant="outline">{limit.metric}</Badge>
                        <Badge className={getStatusColor(limit.status)}>
                          {limit.status.toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">
                        {formatPercentage(limit.utilization)}
                      </div>
                      <div className="text-sm text-gray-600">utilization</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div>
                      <span className="text-sm text-gray-600">Current Value:</span>
                      <div className="font-semibold">
                        {limit.metric === 'var' ? 
                          formatCurrency(limit.currentValue) : 
                          `${limit.currentValue}${limit.metric === 'concentration' ? '%' : ''}`
                        }
                      </div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Limit:</span>
                      <div className="font-semibold">
                        {limit.metric === 'var' ? 
                          formatCurrency(limit.limit) : 
                          `${limit.limit}${limit.metric === 'concentration' ? '%' : ''}`
                        }
                      </div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Available:</span>
                      <div className="font-semibold text-green-600">
                        {limit.metric === 'var' ? 
                          formatCurrency(limit.limit - limit.currentValue) : 
                          `${limit.limit - limit.currentValue}${limit.metric === 'concentration' ? '%' : ''}`
                        }
                      </div>
                    </div>
                  </div>

                  <div className="relative">
                    <Progress value={limit.utilization} className="h-3" />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>0%</span>
                      <span>50%</span>
                      <span>100%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Risk Monitoring Tab */}
        <TabsContent value="monitoring" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Real-Time Risk Monitoring</h3>
            <Button size="sm">Export Risk Report</Button>
          </div>

          {/* Real-time Risk Metrics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Risk Heatmap</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 gap-2">
                  {state.currentPortfolio.assets.slice(0, 16).map((asset, index) => (
                    <div
                      key={asset.id}
                      className={`p-2 text-center text-xs rounded ${
                        index % 3 === 0 ? 'bg-red-100 text-red-800' :
                        index % 3 === 1 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}
                    >
                      <div className="font-medium">{asset.name.substring(0, 8)}...</div>
                      <div className="text-xs">
                        {index % 3 === 0 ? 'High' : index % 3 === 1 ? 'Med' : 'Low'}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Risk Attribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Market Risk', value: 45, fill: '#0088FE' },
                        { name: 'Credit Risk', value: 25, fill: '#00C49F' },
                        { name: 'Liquidity Risk', value: 15, fill: '#FFBB28' },
                        { name: 'Operational Risk', value: 10, fill: '#FF8042' },
                        { name: 'Other', value: 5, fill: '#8884d8' }
                      ]}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    />
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Risk Monitoring Alerts */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Risk Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { time: '10:30 AM', event: 'VaR limit utilization increased to 85%', severity: 'medium' },
                  { time: '09:45 AM', event: 'Technology sector concentration reached 35%', severity: 'high' },
                  { time: '09:15 AM', event: 'Portfolio correlation increased to 0.75', severity: 'medium' },
                  { time: '08:30 AM', event: 'Daily P&L variance exceeded 2 standard deviations', severity: 'low' }
                ].map((event, index) => (
                  <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                    <div className="text-sm font-medium text-gray-600">{event.time}</div>
                    <div className="flex-1 text-sm">{event.event}</div>
                    <Badge className={getSeverityColor(event.severity)}>
                      {event.severity}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}