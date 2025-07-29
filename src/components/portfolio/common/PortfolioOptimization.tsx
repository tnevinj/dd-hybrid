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
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

interface OptimizationObjective {
  id: string;
  name: string;
  description: string;
  type: 'risk_parity' | 'max_sharpe' | 'min_variance' | 'target_return' | 'max_diversification';
  targetReturn?: number;
  riskTolerance?: number;
}

interface RebalancingRecommendation {
  assetId: string;
  assetName: string;
  currentWeight: number;
  targetWeight: number;
  currentValue: number;
  targetValue: number;
  action: 'buy' | 'sell' | 'hold';
  amount: number;
  deviation: number;
  priority: 'high' | 'medium' | 'low';
}

interface OptimizationScenario {
  id: string;
  name: string;
  description: string;
  expectedReturn: number;
  expectedRisk: number;
  sharpeRatio: number;
  maxDrawdown: number;
  allocations: { [assetId: string]: number };
  constraints: string[];
}

interface EfficientFrontierPoint {
  risk: number;
  return: number;
  sharpeRatio: number;
  allocations: { [assetId: string]: number };
}

export function PortfolioOptimization() {
  const { state, analytics, professionalMetrics } = useUnifiedPortfolio();
  const [selectedTab, setSelectedTab] = useState('optimization');
  const [selectedObjective, setSelectedObjective] = useState<string>('max_sharpe');
  const [rebalanceThreshold, setRebalanceThreshold] = useState(5); // 5% threshold

  // Mock optimization objectives
  const optimizationObjectives: OptimizationObjective[] = useMemo(() => [
    {
      id: 'max_sharpe',
      name: 'Maximum Sharpe Ratio',
      description: 'Maximize risk-adjusted returns',
      type: 'max_sharpe'
    },
    {
      id: 'min_variance',
      name: 'Minimum Variance',
      description: 'Minimize portfolio volatility',
      type: 'min_variance'
    },
    {
      id: 'risk_parity',
      name: 'Risk Parity',
      description: 'Equal risk contribution from each asset',
      type: 'risk_parity'
    },
    {
      id: 'target_return',
      name: 'Target Return',
      description: 'Achieve specific return target with minimum risk',
      type: 'target_return',
      targetReturn: 0.12
    },
    {
      id: 'max_diversification',
      name: 'Maximum Diversification',
      description: 'Maximize portfolio diversification ratio',
      type: 'max_diversification'
    }
  ], []);

  // Mock rebalancing recommendations
  const rebalancingRecommendations: RebalancingRecommendation[] = useMemo(() => {
    if (!state.currentPortfolio) return [];
    
    const totalValue = state.currentPortfolio.assets.reduce((sum, asset) => sum + asset.currentValue, 0);
    
    return state.currentPortfolio.assets.map((asset, index) => {
      const currentWeight = (asset.currentValue / totalValue) * 100;
      
      // Mock target weights based on optimization
      const targetWeights = [25, 20, 15, 15, 10, 8, 7]; // Example target allocations
      const targetWeight = targetWeights[index] || 5;
      
      const deviation = Math.abs(currentWeight - targetWeight);
      const targetValue = (targetWeight / 100) * totalValue;
      const amount = Math.abs(targetValue - asset.currentValue);
      
      return {
        assetId: asset.id,
        assetName: asset.name,
        currentWeight,
        targetWeight,
        currentValue: asset.currentValue,
        targetValue,
        action: asset.currentValue > targetValue ? 'sell' : 'buy' as 'buy' | 'sell' | 'hold',
        amount,
        deviation,
        priority: deviation > 10 ? 'high' : deviation > 5 ? 'medium' : 'low' as 'high' | 'medium' | 'low'
      };
    }).filter(rec => rec.deviation > 1); // Only show meaningful deviations
  }, [state.currentPortfolio]);

  // Mock optimization scenarios
  const optimizationScenarios: OptimizationScenario[] = useMemo(() => [
    {
      id: 'conservative',
      name: 'Conservative Growth',
      description: 'Low risk, steady returns',
      expectedReturn: 0.08,
      expectedRisk: 0.12,
      sharpeRatio: 0.67,
      maxDrawdown: 0.08,
      allocations: {
        'asset-1': 0.15, 'asset-2': 0.25, 'asset-3': 0.20,
        'asset-4': 0.15, 'asset-5': 0.25
      },
      constraints: ['Max 30% in any single asset', 'Min 60% in defensive assets']
    },
    {
      id: 'balanced',
      name: 'Balanced Portfolio',
      description: 'Moderate risk and return balance',
      expectedReturn: 0.12,
      expectedRisk: 0.16,
      sharpeRatio: 0.75,
      maxDrawdown: 0.15,
      allocations: {
        'asset-1': 0.25, 'asset-2': 0.20, 'asset-3': 0.15,
        'asset-4': 0.20, 'asset-5': 0.20
      },
      constraints: ['Max 25% in any single asset', 'Min 15% in each major sector']
    },
    {
      id: 'aggressive',
      name: 'Growth Focused',
      description: 'Higher risk for maximum returns',
      expectedReturn: 0.18,
      expectedRisk: 0.24,
      sharpeRatio: 0.75,
      maxDrawdown: 0.25,
      allocations: {
        'asset-1': 0.35, 'asset-2': 0.15, 'asset-3': 0.10,
        'asset-4': 0.25, 'asset-5': 0.15
      },
      constraints: ['Max 35% in growth assets', 'Min 10% cash buffer']
    }
  ], []);

  // Mock efficient frontier data
  const efficientFrontierData: EfficientFrontierPoint[] = useMemo(() => {
    const points: EfficientFrontierPoint[] = [];
    
    // Generate efficient frontier points
    for (let risk = 0.08; risk <= 0.30; risk += 0.02) {
      const expectedReturn = Math.min(0.05 + (risk - 0.08) * 0.8, 0.25);
      const sharpeRatio = expectedReturn / risk;
      
      points.push({
        risk: risk * 100,
        return: expectedReturn * 100,
        sharpeRatio,
        allocations: {} // Mock allocations would go here
      });
    }
    
    return points;
  }, []);

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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'buy': return 'text-green-600';
      case 'sell': return 'text-red-600';
      case 'hold': return 'text-gray-600';
      default: return 'text-gray-600';
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
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="optimization">Optimization</TabsTrigger>
          <TabsTrigger value="rebalancing">Rebalancing</TabsTrigger>
          <TabsTrigger value="scenarios">Scenarios</TabsTrigger>
          <TabsTrigger value="frontier">Efficient Frontier</TabsTrigger>
        </TabsList>

        {/* Portfolio Optimization Tab */}
        <TabsContent value="optimization" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Portfolio Optimization</h3>
            <Button size="sm">Run Optimization</Button>
          </div>

          {/* Optimization Objectives */}
          <Card>
            <CardHeader>
              <CardTitle>Optimization Objectives</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {optimizationObjectives.map((objective) => (
                  <div
                    key={objective.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedObjective === objective.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedObjective(objective.id)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{objective.name}</h4>
                      {selectedObjective === objective.id && (
                        <Badge className="bg-blue-100 text-blue-800">Selected</Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{objective.description}</p>
                    {objective.targetReturn && (
                      <p className="text-xs text-gray-500 mt-1">
                        Target Return: {formatPercentage(objective.targetReturn * 100)}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Current vs Optimized Allocation */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Current Allocation</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={state.currentPortfolio.assets.map((asset, index) => ({
                        name: asset.name.substring(0, 10) + '...',
                        value: asset.currentValue,
                        fill: `hsl(${index * 45}, 70%, 50%)`
                      }))}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {state.currentPortfolio.assets.map((asset, index) => (
                        <Cell key={`cell-${index}`} fill={`hsl(${index * 45}, 70%, 50%)`} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Optimized Allocation</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={optimizationScenarios[1].allocations ? 
                        Object.entries(optimizationScenarios[1].allocations).map(([assetId, weight], index) => {
                          const asset = state.currentPortfolio?.assets.find(a => a.id === assetId);
                          return {
                            name: asset?.name.substring(0, 10) + '...' || assetId,
                            value: weight * analytics.totalPortfolioValue,
                            fill: `hsl(${index * 45}, 70%, 60%)`
                          };
                        }) : []
                      }
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {Object.keys(optimizationScenarios[1].allocations || {}).map((_, index) => (
                        <Cell key={`cell-${index}`} fill={`hsl(${index * 45}, 70%, 60%)`} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Optimization Results */}
          <Card>
            <CardHeader>
              <CardTitle>Optimization Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {formatPercentage(optimizationScenarios[1].expectedReturn * 100)}
                  </div>
                  <div className="text-sm text-gray-600">Expected Return</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {formatPercentage(optimizationScenarios[1].expectedRisk * 100)}
                  </div>
                  <div className="text-sm text-gray-600">Expected Risk</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {optimizationScenarios[1].sharpeRatio.toFixed(2)}
                  </div>
                  <div className="text-sm text-gray-600">Sharpe Ratio</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">
                    -{formatPercentage(optimizationScenarios[1].maxDrawdown * 100)}
                  </div>
                  <div className="text-sm text-gray-600">Max Drawdown</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Rebalancing Tab */}
        <TabsContent value="rebalancing" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Portfolio Rebalancing</h3>
            <div className="flex items-center space-x-4">
              <label className="text-sm">
                Threshold: 
                <select 
                  value={rebalanceThreshold} 
                  onChange={(e) => setRebalanceThreshold(Number(e.target.value))}
                  className="ml-2 px-2 py-1 text-sm border border-gray-300 rounded"
                >
                  <option value={3}>3%</option>
                  <option value={5}>5%</option>
                  <option value={7}>7%</option>
                  <option value={10}>10%</option>
                </select>
              </label>
              <Button size="sm">Execute Rebalancing</Button>
            </div>
          </div>

          {/* Rebalancing Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Assets to Rebalance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {rebalancingRecommendations.length}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Above {rebalanceThreshold}% threshold
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Rebalancing</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">
                  {formatCurrency(rebalancingRecommendations.reduce((sum, rec) => sum + rec.amount, 0))}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Transaction volume needed
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">High Priority</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {rebalancingRecommendations.filter(r => r.priority === 'high').length}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Require immediate attention
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Rebalancing Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle>Rebalancing Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {rebalancingRecommendations.map((recommendation) => (
                  <div key={recommendation.assetId} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-medium">{recommendation.assetName}</h4>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge className={getPriorityColor(recommendation.priority)}>
                            {recommendation.priority} priority
                          </Badge>
                          <Badge variant="outline" className={getActionColor(recommendation.action)}>
                            {recommendation.action.toUpperCase()}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-lg">
                          {formatPercentage(recommendation.deviation)}
                        </div>
                        <div className="text-sm text-gray-600">deviation</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <span className="text-sm text-gray-600">Current Weight:</span>
                        <div className="font-medium">{formatPercentage(recommendation.currentWeight)}</div>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Target Weight:</span>
                        <div className="font-medium">{formatPercentage(recommendation.targetWeight)}</div>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Current Value:</span>
                        <div className="font-medium">{formatCurrency(recommendation.currentValue)}</div>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Action Amount:</span>
                        <div className={`font-medium ${getActionColor(recommendation.action)}`}>
                          {recommendation.action === 'buy' ? '+' : '-'}{formatCurrency(recommendation.amount)}
                        </div>
                      </div>
                    </div>

                    <div className="mt-3">
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>Progress to Target</span>
                        <span>{formatPercentage(100 - recommendation.deviation)}</span>
                      </div>
                      <Progress value={100 - recommendation.deviation} className="h-2" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Optimization Scenarios Tab */}
        <TabsContent value="scenarios" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Optimization Scenarios</h3>
            <Button size="sm">Create Custom Scenario</Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {optimizationScenarios.map((scenario) => (
              <Card key={scenario.id} className="relative">
                <CardHeader>
                  <CardTitle className="text-lg">{scenario.name}</CardTitle>
                  <p className="text-sm text-gray-600">{scenario.description}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm text-gray-600">Expected Return:</span>
                      <div className="font-semibold text-green-600">
                        {formatPercentage(scenario.expectedReturn * 100)}
                      </div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Expected Risk:</span>
                      <div className="font-semibold text-orange-600">
                        {formatPercentage(scenario.expectedRisk * 100)}
                      </div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Sharpe Ratio:</span>
                      <div className="font-semibold text-blue-600">
                        {scenario.sharpeRatio.toFixed(2)}
                      </div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Max Drawdown:</span>
                      <div className="font-semibold text-red-600">
                        -{formatPercentage(scenario.maxDrawdown * 100)}
                      </div>
                    </div>
                  </div>

                  <div>
                    <span className="text-sm font-medium text-gray-700">Constraints:</span>
                    <ul className="mt-1 space-y-1">
                      {scenario.constraints.map((constraint, index) => (
                        <li key={index} className="text-xs text-gray-600 flex items-center">
                          <span className="w-1 h-1 bg-gray-400 rounded-full mr-2"></span>
                          {constraint}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Button className="w-full" variant="outline" size="sm">
                    Apply This Scenario
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Scenario Comparison Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Scenario Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <ScatterChart data={optimizationScenarios.map(scenario => ({
                  ...scenario,
                  risk: scenario.expectedRisk * 100,
                  return: scenario.expectedReturn * 100
                }))}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="risk" 
                    type="number"
                    domain={['dataMin - 1', 'dataMax + 1']}
                    label={{ value: 'Risk (%)', position: 'insideBottom', offset: -5 }}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis 
                    dataKey="return" 
                    type="number"
                    domain={['dataMin - 1', 'dataMax + 1']}
                    label={{ value: 'Return (%)', angle: -90, position: 'insideLeft' }}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip 
                    formatter={(value, name) => {
                      if (name === 'return' || name === 'risk') return [`${Number(value).toFixed(1)}%`, name];
                      if (name === 'sharpeRatio') return [Number(value).toFixed(2), 'Sharpe Ratio'];
                      return [value, name];
                    }}
                    labelFormatter={(value, payload) => {
                      if (payload && payload[0]) {
                        return payload[0].payload.name;
                      }
                      return '';
                    }}
                  />
                  <Scatter dataKey="return" fill="#0088FE" name="Scenarios" />
                </ScatterChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Efficient Frontier Tab */}
        <TabsContent value="frontier" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Efficient Frontier Analysis</h3>
            <Button size="sm">Recalculate Frontier</Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Efficient Frontier</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <ScatterChart data={efficientFrontierData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="risk"
                    type="number"
                    domain={['dataMin - 1', 'dataMax + 1']}
                    label={{ value: 'Risk (%)', position: 'insideBottom', offset: -5 }}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis 
                    dataKey="return"
                    type="number"
                    domain={['dataMin - 1', 'dataMax + 1']}
                    label={{ value: 'Expected Return (%)', angle: -90, position: 'insideLeft' }}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip 
                    formatter={(value, name) => {
                      if (name === 'return' || name === 'risk') return [`${Number(value).toFixed(1)}%`, name];
                      if (name === 'sharpeRatio') return [Number(value).toFixed(2), 'Sharpe Ratio'];
                      return [value, name];
                    }}
                  />
                  <Scatter dataKey="return" fill="#0088FE" name="Efficient Portfolios" />
                </ScatterChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Portfolio Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Current Portfolio Risk:</span>
                    <span className="font-medium">
                      {professionalMetrics ? formatPercentage(professionalMetrics.volatility * 100) : 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Current Portfolio Return:</span>
                    <span className="font-medium">
                      {professionalMetrics ? formatPercentage(professionalMetrics.timeWeightedReturn * 100) : 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Current Sharpe Ratio:</span>
                    <span className="font-medium">
                      {professionalMetrics ? professionalMetrics.sharpeRatio.toFixed(2) : 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Optimal Sharpe Ratio:</span>
                    <span className="font-medium text-green-600">
                      {Math.max(...efficientFrontierData.map(p => p.sharpeRatio)).toFixed(2)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Optimization Potential</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="font-medium text-blue-800">Return Enhancement</span>
                    </div>
                    <p className="text-sm text-blue-700 mt-1">
                      Potential to increase returns by up to 2.3% while maintaining current risk level.
                    </p>
                  </div>
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="font-medium text-green-800">Risk Reduction</span>
                    </div>
                    <p className="text-sm text-green-700 mt-1">
                      Opportunity to reduce risk by 15% while maintaining target returns.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}