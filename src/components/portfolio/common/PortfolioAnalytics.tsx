'use client';

import React, { useState } from 'react';
import { useUnifiedPortfolio } from '../contexts/UnifiedPortfolioContext';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

export function PortfolioAnalytics() {
  const { state, analytics } = useUnifiedPortfolio();
  const [activeAnalysis, setActiveAnalysis] = useState<'risk' | 'esg' | 'correlation' | 'scenario'>('risk');

  if (!state.currentPortfolio || !analytics) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading analytics...</p>
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
    return `${(value * 100).toFixed(1)}%`;
  };

  const getRiskAnalysis = () => {
    const riskData = Object.entries(analytics.riskDistribution).map(([risk, value]) => ({
      risk,
      value,
      percentage: analytics.totalPortfolioValue > 0 ? (value / analytics.totalPortfolioValue) * 100 : 0,
      count: state.currentPortfolio!.assets.filter(asset => asset.riskRating === risk).length,
    }));

    return riskData.sort((a, b) => b.value - a.value);
  };

  const getESGAnalysis = () => {
    const assets = state.currentPortfolio!.assets;
    const esgScores = {
      environmental: assets.reduce((sum, asset) => sum + asset.esgMetrics.environmentalScore, 0) / assets.length,
      social: assets.reduce((sum, asset) => sum + asset.esgMetrics.socialScore, 0) / assets.length,
      governance: assets.reduce((sum, asset) => sum + asset.esgMetrics.governanceScore, 0) / assets.length,
    };

    const esgDistribution = assets.reduce((acc, asset) => {
      const score = asset.esgMetrics.overallScore;
      const category = score >= 8 ? 'Excellent' : score >= 6 ? 'Good' : score >= 4 ? 'Fair' : 'Poor';
      acc[category] = (acc[category] || 0) + asset.currentValue;
      return acc;
    }, {} as Record<string, number>);

    return { esgScores, esgDistribution };
  };

  const getSectorAnalysis = () => {
    return Object.entries(analytics.sectorAllocation)
      .map(([sector, value]) => ({
        sector,
        value,
        percentage: analytics.totalPortfolioValue > 0 ? (value / analytics.totalPortfolioValue) * 100 : 0,
        count: state.currentPortfolio!.assets.filter(asset => asset.sector === sector).length,
      }))
      .sort((a, b) => b.value - a.value);
  };

  const getGeographicAnalysis = () => {
    return Object.entries(analytics.geographicAllocation)
      .map(([country, value]) => ({
        country,
        value,
        percentage: analytics.totalPortfolioValue > 0 ? (value / analytics.totalPortfolioValue) * 100 : 0,
        count: state.currentPortfolio!.assets.filter(asset => asset.location.country === country).length,
      }))
      .sort((a, b) => b.value - a.value);
  };

  const riskAnalysis = getRiskAnalysis();
  const { esgScores, esgDistribution } = getESGAnalysis();
  const sectorAnalysis = getSectorAnalysis();
  const geographicAnalysis = getGeographicAnalysis();

  const renderRiskAnalysis = () => (
    <div className="space-y-6">
      {/* Risk Distribution */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk Distribution</h3>
        <div className="space-y-4">
          {riskAnalysis.map(({ risk, value, percentage, count }) => (
            <div key={risk} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Badge
                  className={
                    risk === 'low' ? 'bg-green-100 text-green-800' :
                    risk === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    risk === 'high' ? 'bg-orange-100 text-orange-800' :
                    'bg-red-100 text-red-800'
                  }
                >
                  {risk.charAt(0).toUpperCase() + risk.slice(1)} Risk
                </Badge>
                <span className="text-sm text-gray-600">({count} assets)</span>
              </div>
              <div className="text-right">
                <div className="text-sm font-semibold text-gray-900">
                  {formatCurrency(value)}
                </div>
                <div className="text-xs text-gray-500">
                  {percentage.toFixed(1)}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Risk Metrics */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk Metrics</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">
              {((riskAnalysis.find(r => r.risk === 'high')?.percentage || 0) + 
                (riskAnalysis.find(r => r.risk === 'critical')?.percentage || 0)).toFixed(1)}%
            </div>
            <div className="text-sm text-gray-600">High Risk Exposure</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">
              {state.currentPortfolio.assets.filter(a => a.riskRating === 'critical').length}
            </div>
            <div className="text-sm text-gray-600">Critical Assets</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">
              {analytics.totalInvested > 0 ? ((analytics.totalPortfolioValue - analytics.totalInvested) / analytics.totalInvested * 100).toFixed(1) : 0}%
            </div>
            <div className="text-sm text-gray-600">Risk-Adjusted Return</div>
          </div>
        </div>
      </Card>
    </div>
  );

  const renderESGAnalysis = () => (
    <div className="space-y-6">
      {/* ESG Scores */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">ESG Component Scores</h3>
        <div className="space-y-4">
          {Object.entries(esgScores).map(([component, score]) => (
            <div key={component} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700 capitalize">
                  {component}
                </span>
                <span className="text-sm font-semibold text-gray-900">
                  {score.toFixed(1)}/10
                </span>
              </div>
              <Progress value={score * 10} className="h-2" />
            </div>
          ))}
        </div>
      </Card>

      {/* ESG Distribution */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">ESG Performance Distribution</h3>
        <div className="space-y-4">
          {Object.entries(esgDistribution).map(([category, value]) => {
            const percentage = analytics.totalPortfolioValue > 0 ? (value / analytics.totalPortfolioValue) * 100 : 0;
            const count = state.currentPortfolio!.assets.filter(asset => {
              const score = asset.esgMetrics.overallScore;
              const assetCategory = score >= 8 ? 'Excellent' : score >= 6 ? 'Good' : score >= 4 ? 'Fair' : 'Poor';
              return assetCategory === category;
            }).length;

            return (
              <div key={category} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Badge
                    className={
                      category === 'Excellent' ? 'bg-green-100 text-green-800' :
                      category === 'Good' ? 'bg-blue-100 text-blue-800' :
                      category === 'Fair' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }
                  >
                    {category}
                  </Badge>
                  <span className="text-sm text-gray-600">({count} assets)</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-gray-900">
                    {formatCurrency(value)}
                  </div>
                  <div className="text-xs text-gray-500">
                    {percentage.toFixed(1)}%
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* ESG Impact Metrics */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Impact Metrics</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {state.currentPortfolio.assets.reduce((sum, asset) => 
                sum + (asset.esgMetrics.jobsCreated || 0), 0).toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Jobs Created</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {state.currentPortfolio.assets.reduce((sum, asset) => 
                sum + (asset.esgMetrics.carbonFootprint || 0), 0).toFixed(1)}t
            </div>
            <div className="text-sm text-gray-600">CO2 Avoided</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {esgScores.governance.toFixed(1)}/10
            </div>
            <div className="text-sm text-gray-600">Avg Governance</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-emerald-600">
              {state.currentPortfolio.assets.reduce((sum, asset) => 
                sum + asset.esgMetrics.sustainabilityCertifications.length, 0)}
            </div>
            <div className="text-sm text-gray-600">Certifications</div>
          </div>
        </div>
      </Card>
    </div>
  );

  const renderCorrelationAnalysis = () => (
    <div className="space-y-6">
      {/* Sector Correlation */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Sector Allocation</h3>
        <div className="space-y-4">
          {sectorAnalysis.slice(0, 8).map(({ sector, value, percentage, count }) => (
            <div key={sector} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span className="text-sm font-medium text-gray-700">{sector}</span>
                <span className="text-sm text-gray-500">({count} assets)</span>
              </div>
              <div className="text-right">
                <div className="text-sm font-semibold text-gray-900">
                  {formatCurrency(value)}
                </div>
                <div className="text-xs text-gray-500">
                  {percentage.toFixed(1)}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Geographic Correlation */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Geographic Diversification</h3>
        <div className="space-y-4">
          {geographicAnalysis.slice(0, 8).map(({ country, value, percentage, count }) => (
            <div key={country} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-sm font-medium text-gray-700">{country}</span>
                <span className="text-sm text-gray-500">({count} assets)</span>
              </div>
              <div className="text-right">
                <div className="text-sm font-semibold text-gray-900">
                  {formatCurrency(value)}
                </div>
                <div className="text-xs text-gray-500">
                  {percentage.toFixed(1)}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );

  const renderScenarioAnalysis = () => (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Scenario Analysis</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 border border-green-200 rounded-lg bg-green-50">
            <h4 className="font-medium text-green-800 mb-2">Bull Case (+20%)</h4>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(analytics.totalPortfolioValue * 1.2)}
            </div>
            <div className="text-sm text-green-700">
              IRR: {formatPercentage(analytics.weightedIRR * 1.15)}
            </div>
          </div>
          <div className="p-4 border border-blue-200 rounded-lg bg-blue-50">
            <h4 className="font-medium text-blue-800 mb-2">Base Case</h4>
            <div className="text-2xl font-bold text-blue-600">
              {formatCurrency(analytics.totalPortfolioValue)}
            </div>
            <div className="text-sm text-blue-700">
              IRR: {formatPercentage(analytics.weightedIRR)}
            </div>
          </div>
          <div className="p-4 border border-red-200 rounded-lg bg-red-50">
            <h4 className="font-medium text-red-800 mb-2">Bear Case (-15%)</h4>
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(analytics.totalPortfolioValue * 0.85)}
            </div>
            <div className="text-sm text-red-700">
              IRR: {formatPercentage(analytics.weightedIRR * 0.8)}
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Stress Testing</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <span className="text-sm font-medium text-gray-700">Market Crash (-30%)</span>
            <span className="text-sm font-semibold text-red-600">
              {formatCurrency(analytics.totalPortfolioValue * 0.7)}
            </span>
          </div>
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <span className="text-sm font-medium text-gray-700">Interest Rate Shock (+5%)</span>
            <span className="text-sm font-semibold text-orange-600">
              {formatCurrency(analytics.totalPortfolioValue * 0.85)}
            </span>
          </div>
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <span className="text-sm font-medium text-gray-700">Currency Devaluation (-10%)</span>
            <span className="text-sm font-semibold text-yellow-600">
              {formatCurrency(analytics.totalPortfolioValue * 0.9)}
            </span>
          </div>
        </div>
      </Card>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Analytics Navigation */}
      <div className="flex items-center justify-between">
        <div className="flex rounded-lg border border-gray-200 p-1">
          {[
            { id: 'risk', label: 'Risk Analysis', icon: '⚠️' },
            { id: 'esg', label: 'ESG Analysis', icon: '🌱' },
            { id: 'correlation', label: 'Diversification', icon: '📊' },
            { id: 'scenario', label: 'Scenarios', icon: '🎯' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveAnalysis(tab.id as any)}
              className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                activeAnalysis === tab.id
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            Export Analysis
          </Button>
          <Button size="sm">
            Schedule Report
          </Button>
        </div>
      </div>

      {/* Analytics Content */}
      {activeAnalysis === 'risk' && renderRiskAnalysis()}
      {activeAnalysis === 'esg' && renderESGAnalysis()}
      {activeAnalysis === 'correlation' && renderCorrelationAnalysis()}
      {activeAnalysis === 'scenario' && renderScenarioAnalysis()}
    </div>
  );
}
