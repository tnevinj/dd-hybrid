'use client';

import React, { useState } from 'react';
import { useUnifiedPortfolio } from '../contexts/UnifiedPortfolioContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  PerformanceChart, 
  AttributionChart, 
  AllocationPieChart, 
  RiskDecompositionChart,
  CorrelationHeatmap,
  ScenarioAnalysisChart 
} from './InteractiveCharts';
import {
  PrivateEquityMetricsCard,
  VintageAnalysisChart,
  JCurveChart,
  StageAnalysisChart,
  SectorPerformanceChart
} from './AdvancedPerformanceAnalytics';

export function ProfessionalAnalytics() {
  const { state, analytics, professionalMetrics } = useUnifiedPortfolio();
  const [selectedCorrelationAsset, setSelectedCorrelationAsset] = useState<string | null>(null);

  if (!state.currentPortfolio || !analytics || !professionalMetrics) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading professional analytics...</p>
        </div>
      </div>
    );
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${(value * 100).toFixed(2)}%`;
  };

  const formatDecimal = (value: number) => {
    return value.toFixed(3);
  };

  const getRiskColor = (value: number, thresholds: { low: number; medium: number; high: number }) => {
    if (value <= thresholds.low) return 'text-green-600';
    if (value <= thresholds.medium) return 'text-yellow-600';
    if (value <= thresholds.high) return 'text-orange-600';
    return 'text-red-600';
  };

  const getPerformanceColor = (value: number) => {
    if (value >= 0.15) return 'text-green-600';
    if (value >= 0.08) return 'text-blue-600';
    if (value >= 0) return 'text-gray-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="performance" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="private-equity">Private Equity</TabsTrigger>
          <TabsTrigger value="risk">Risk Metrics</TabsTrigger>
          <TabsTrigger value="attribution">Attribution</TabsTrigger>
          <TabsTrigger value="correlation">Correlation</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>

        {/* Performance Metrics Tab */}
        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Time-Weighted Return</CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${getPerformanceColor(professionalMetrics.timeWeightedReturn)}`}>
                  {formatPercentage(professionalMetrics.timeWeightedReturn)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Annualized TWR
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Sharpe Ratio</CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${
                  professionalMetrics.sharpeRatio > 1.5 ? 'text-green-600' :
                  professionalMetrics.sharpeRatio > 1.0 ? 'text-blue-600' :
                  professionalMetrics.sharpeRatio > 0.5 ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {formatDecimal(professionalMetrics.sharpeRatio)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Risk-adjusted return
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Sortino Ratio</CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${
                  professionalMetrics.sortinoRatio > 2.0 ? 'text-green-600' :
                  professionalMetrics.sortinoRatio > 1.0 ? 'text-blue-600' : 'text-yellow-600'
                }`}>
                  {formatDecimal(professionalMetrics.sortinoRatio)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Downside risk-adjusted
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Information Ratio</CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${getPerformanceColor(professionalMetrics.informationRatio)}`}>
                  {formatDecimal(professionalMetrics.informationRatio)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Active return efficiency
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Alpha & Beta Analysis</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Alpha</span>
                  <span className={`text-lg font-bold ${
                    professionalMetrics.alpha > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {formatPercentage(professionalMetrics.alpha)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Beta</span>
                  <span className="text-lg font-bold text-gray-900">
                    {formatDecimal(professionalMetrics.beta)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Tracking Error</span>
                  <span className="text-lg font-bold text-gray-900">
                    {formatPercentage(professionalMetrics.trackingError)}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Risk-Adjusted Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Calmar Ratio</span>
                  <span className="text-lg font-bold text-gray-900">
                    {formatDecimal(professionalMetrics.calmarRatio)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Max Drawdown</span>
                  <span className="text-lg font-bold text-red-600">
                    -{formatPercentage(professionalMetrics.maxDrawdown)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Volatility</span>
                  <span className="text-lg font-bold text-gray-900">
                    {formatPercentage(professionalMetrics.volatility)}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Interactive Performance Visualization */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <PerformanceChart />
            <AllocationPieChart />
          </div>
        </TabsContent>

        {/* Private Equity Metrics Tab */}
        <TabsContent value="private-equity" className="space-y-6">
          {/* PE Core Metrics */}
          <PrivateEquityMetricsCard />
          
          {/* PE Analysis Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <VintageAnalysisChart />
            <JCurveChart />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <StageAnalysisChart />
            <SectorPerformanceChart />
          </div>
        </TabsContent>

        {/* Risk Metrics Tab */}
        <TabsContent value="risk" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Value at Risk (95%)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {formatCurrency(professionalMetrics.valueAtRisk95)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Potential 1-day loss
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Value at Risk (99%)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {formatCurrency(professionalMetrics.valueAtRisk99)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Extreme loss scenario
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Conditional VaR</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {formatCurrency(professionalMetrics.conditionalVaR)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Expected shortfall
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Portfolio Diversification</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Diversification Ratio</span>
                  <span className="text-lg font-bold text-blue-600">
                    {formatDecimal(professionalMetrics.diversificationRatio)}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${Math.min(professionalMetrics.diversificationRatio * 50, 100)}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-600">
                  Higher ratios indicate better diversification
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Concentration Risk</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Herfindahl Index</span>
                  <span className={`text-lg font-bold ${
                    professionalMetrics.concentrationRisk < 0.1 ? 'text-green-600' :
                    professionalMetrics.concentrationRisk < 0.25 ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {formatDecimal(professionalMetrics.concentrationRisk)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Liquidity Score</span>
                  <span className="text-lg font-bold text-blue-600">
                    {formatPercentage(professionalMetrics.liquidityScore)}
                  </span>
                </div>
                <Progress 
                  value={professionalMetrics.liquidityScore * 100} 
                  className="h-2"
                />
              </CardContent>
            </Card>
          </div>

          {/* Interactive Risk Visualization */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RiskDecompositionChart />
            <ScenarioAnalysisChart />
          </div>
        </TabsContent>

        {/* Attribution Analysis Tab */}
        <TabsContent value="attribution" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Sector Attribution Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(professionalMetrics.sectorAttribution).map(([sector, attribution]) => (
                  <div key={sector} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium text-gray-900">{sector}</h4>
                      <Badge className={attribution.total >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                        {attribution.total >= 0 ? '+' : ''}{formatPercentage(attribution.total)}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Allocation:</span>
                        <span className={`ml-2 font-medium ${attribution.allocation >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {attribution.allocation >= 0 ? '+' : ''}{formatPercentage(attribution.allocation)}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Selection:</span>
                        <span className={`ml-2 font-medium ${attribution.selection >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {attribution.selection >= 0 ? '+' : ''}{formatPercentage(attribution.selection)}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Interaction:</span>
                        <span className={`ml-2 font-medium ${attribution.interaction >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {attribution.interaction >= 0 ? '+' : ''}{formatPercentage(attribution.interaction)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Geographic Attribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(professionalMetrics.geographicAttribution).slice(0, 5).map(([country, attribution]) => (
                    <div key={country} className="flex justify-between items-center">
                      <span className="text-sm font-medium">{country}</span>
                      <span className={`text-sm font-bold ${attribution.total >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {attribution.total >= 0 ? '+' : ''}{formatPercentage(attribution.total)}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Asset Type Attribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(professionalMetrics.assetTypeAttribution).map(([assetType, attribution]) => (
                    <div key={assetType} className="flex justify-between items-center">
                      <span className="text-sm font-medium capitalize">{assetType.replace('_', ' ')}</span>
                      <span className={`text-sm font-bold ${attribution.total >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {attribution.total >= 0 ? '+' : ''}{formatPercentage(attribution.total)}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Interactive Attribution Visualization */}
          <AttributionChart />
        </TabsContent>

        {/* Correlation Matrix Tab */}
        <TabsContent value="correlation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Asset Correlation Matrix</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr>
                      <th className="text-left p-2 border-b">Asset</th>
                      {state.currentPortfolio.assets.slice(0, 5).map(asset => (
                        <th key={asset.id} className="text-center p-2 border-b min-w-20">
                          {asset.name.substring(0, 8)}...
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {state.currentPortfolio.assets.slice(0, 5).map(asset1 => (
                      <tr key={asset1.id}>
                        <td className="p-2 font-medium border-b">
                          {asset1.name.substring(0, 15)}...
                        </td>
                        {state.currentPortfolio.assets.slice(0, 5).map(asset2 => {
                          const correlation = professionalMetrics.correlationMatrix[asset1.id]?.[asset2.id] || 0;
                          return (
                            <td
                              key={asset2.id}
                              className={`text-center p-2 border-b font-medium ${
                                correlation > 0.7 ? 'bg-red-100 text-red-800' :
                                correlation > 0.3 ? 'bg-yellow-100 text-yellow-800' :
                                'bg-green-100 text-green-800'
                              }`}
                            >
                              {correlation.toFixed(2)}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 flex items-center space-x-4 text-xs">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-100 border border-green-300"></div>
                  <span>Low Correlation (&lt;0.3)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-yellow-100 border border-yellow-300"></div>
                  <span>Medium Correlation (0.3-0.7)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-100 border border-red-300"></div>
                  <span>High Correlation (&gt;0.7)</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Interactive Correlation Visualization */}
          <CorrelationHeatmap />
        </TabsContent>

        {/* Advanced Analytics Tab */}
        <TabsContent value="advanced" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Scenario Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <span className="font-medium text-green-800">Bull Market (+20%)</span>
                    <span className="font-bold text-green-600">
                      {formatCurrency(analytics.totalPortfolioValue * 1.2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                    <span className="font-medium text-blue-800">Base Case</span>
                    <span className="font-bold text-blue-600">
                      {formatCurrency(analytics.totalPortfolioValue)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                    <span className="font-medium text-red-800">Bear Market (-25%)</span>
                    <span className="font-bold text-red-600">
                      {formatCurrency(analytics.totalPortfolioValue * 0.75)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Risk Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Portfolio Beta</span>
                    <Badge className={
                      professionalMetrics.beta > 1.2 ? 'bg-red-100 text-red-800' :
                      professionalMetrics.beta > 0.8 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }>
                      {formatDecimal(professionalMetrics.beta)}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Concentration Risk</span>
                    <Badge className={
                      professionalMetrics.concentrationRisk > 0.25 ? 'bg-red-100 text-red-800' :
                      professionalMetrics.concentrationRisk > 0.1 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }>
                      {professionalMetrics.concentrationRisk < 0.1 ? 'Low' :
                       professionalMetrics.concentrationRisk < 0.25 ? 'Medium' : 'High'}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Liquidity Risk</span>
                    <Badge className={
                      professionalMetrics.liquidityScore > 0.7 ? 'bg-green-100 text-green-800' :
                      professionalMetrics.liquidityScore > 0.4 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }>
                      {professionalMetrics.liquidityScore > 0.7 ? 'Low' :
                       professionalMetrics.liquidityScore > 0.4 ? 'Medium' : 'High'}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Portfolio Optimization Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {professionalMetrics.concentrationRisk > 0.25 && (
                  <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <span className="font-medium text-orange-800">High Concentration Risk</span>
                    </div>
                    <p className="text-sm text-orange-700 mt-1">
                      Consider diversifying holdings to reduce concentration risk.
                    </p>
                  </div>
                )}
                {professionalMetrics.sharpeRatio < 1.0 && (
                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <span className="font-medium text-yellow-800">Low Risk-Adjusted Returns</span>
                    </div>
                    <p className="text-sm text-yellow-700 mt-1">
                      Sharpe ratio below 1.0 suggests suboptimal risk-adjusted performance.
                    </p>
                  </div>
                )}
                {professionalMetrics.liquidityScore < 0.4 && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <span className="font-medium text-red-800">Low Liquidity</span>
                    </div>
                    <p className="text-sm text-red-700 mt-1">
                      Portfolio has limited liquidity. Consider maintaining higher cash reserves.
                    </p>
                  </div>
                )}
                {(professionalMetrics.concentrationRisk <= 0.25 && 
                  professionalMetrics.sharpeRatio >= 1.0 && 
                  professionalMetrics.liquidityScore >= 0.4) && (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="font-medium text-green-800">Well-Optimized Portfolio</span>
                    </div>
                    <p className="text-sm text-green-700 mt-1">
                      Portfolio shows good diversification, risk-adjusted returns, and liquidity balance.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}