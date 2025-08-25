'use client';

import React from 'react';
import { useUnifiedPortfolio } from '../contexts/UnifiedPortfolioContext';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { AssetType } from '@/types/portfolio';

export function PortfolioOverview() {
  let state, analytics, externalMetrics;
  
  try {
    const context = useUnifiedPortfolio();
    state = context.state;
    analytics = context.analytics;
    externalMetrics = context.externalMetrics;
  } catch (error) {
    // Context not available, show fallback UI
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="p-4 border rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Portfolio Overview</h3>
            <p className="text-gray-600">Portfolio data will be displayed here when available.</p>
          </div>
        </div>
      </div>
    );
  }

  if (!state.currentPortfolio || !analytics) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading overview...</p>
        </div>
      </div>
    );
  }

  const { currentPortfolio } = state;
  const assetTypeCounts = currentPortfolio.assets.reduce((acc, asset) => {
    acc[asset.assetType] = (acc[asset.assetType] || 0) + 1;
    return acc;
  }, {} as Record<AssetType, number>);

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

  const getAssetTypeLabel = (assetType: AssetType) => {
    switch (assetType) {
      case 'traditional':
        return 'Traditional';
      case 'real_estate':
        return 'Real Estate';
      case 'infrastructure':
        return 'Infrastructure';
      default:
        return assetType;
    }
  };

  const getAssetTypeColor = (assetType: AssetType) => {
    switch (assetType) {
      case 'traditional':
        return 'bg-blue-500';
      case 'real_estate':
        return 'bg-green-500';
      case 'infrastructure':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getRiskColor = (rating: string) => {
    switch (rating) {
      case 'low':
        return 'text-green-600 bg-green-100';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100';
      case 'high':
        return 'text-orange-600 bg-orange-100';
      case 'critical':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      {/* Portfolio Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Value</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(analytics.totalPortfolioValue)}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-green-600">
              +{analytics.totalInvested > 0 ? formatPercentage((analytics.totalPortfolioValue - analytics.totalInvested) / analytics.totalInvested) : '0%'}
            </span>
            <span className="text-gray-500 ml-1">vs invested</span>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">IRR</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatPercentage(analytics.weightedIRR)}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className={analytics.benchmarkComparison.outperformance >= 0 ? 'text-green-600' : 'text-red-600'}>
              {analytics.benchmarkComparison.outperformance >= 0 ? '+' : ''}
              {formatPercentage(analytics.benchmarkComparison.outperformance)}
            </span>
            <span className="text-gray-500 ml-1">vs benchmark</span>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">MOIC</p>
              <p className="text-2xl font-bold text-gray-900">
                {analytics.weightedMOIC.toFixed(1)}x
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">ESG Score</p>
              <p className="text-2xl font-bold text-gray-900">
                {analytics.esgScore.toFixed(1)}/10
              </p>
            </div>
            <div className="p-3 bg-emerald-100 rounded-full">
              <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.636 18.364a9 9 0 010-12.728m12.728 0a9 9 0 010 12.728m-9.9-2.829a5 5 0 010-7.07m7.072 0a5 5 0 010 7.07M13 12a1 1 0 11-2 0 1 1 0 012 0z" />
              </svg>
            </div>
          </div>
          <div className="mt-4">
            <Progress value={analytics.esgScore * 10} className="h-2" />
          </div>
        </Card>
      </div>

      {/* External Metrics Section (if available) */}
      {externalMetrics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {externalMetrics.totalAssets && (
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Assets</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {externalMetrics.totalAssets}
                  </p>
                </div>
                <div className="p-3 bg-indigo-100 rounded-full">
                  <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
              </div>
            </Card>
          )}

          {externalMetrics.performanceYTD && (
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">YTD Performance</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {externalMetrics.performanceYTD}%
                  </p>
                </div>
                <div className="p-3 bg-orange-100 rounded-full">
                  <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
              </div>
            </Card>
          )}

          {externalMetrics.aiEfficiencyGains && (
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">AI Efficiency</p>
                  <p className="text-2xl font-bold text-gray-900">
                    +{externalMetrics.aiEfficiencyGains}%
                  </p>
                </div>
                <div className="p-3 bg-teal-100 rounded-full">
                  <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
              </div>
            </Card>
          )}
        </div>
      )}

      {/* Asset Allocation and Composition */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Asset Type Allocation */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Asset Type Allocation</h3>
          <div className="space-y-4">
            {Object.entries(analytics.assetAllocation).map(([assetType, value]) => {
              const percentage = analytics.totalPortfolioValue > 0 ? (value / analytics.totalPortfolioValue) * 100 : 0;
              return (
                <div key={assetType} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${getAssetTypeColor(assetType as AssetType)}`}></div>
                    <span className="text-sm font-medium text-gray-700">
                      {getAssetTypeLabel(assetType as AssetType)}
                    </span>
                    <Badge variant="outline" className="ml-2">
                      {assetTypeCounts[assetType as AssetType] || 0}
                    </Badge>
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

        {/* Geographic Allocation */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Geographic Allocation</h3>
          <div className="space-y-4">
            {Object.entries(analytics.geographicAllocation)
              .sort(([, a], [, b]) => b - a)
              .slice(0, 5)
              .map(([country, value]) => {
                const percentage = analytics.totalPortfolioValue > 0 ? (value / analytics.totalPortfolioValue) * 100 : 0;
                return (
                  <div key={country} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                      <span className="text-sm font-medium text-gray-700">{country}</span>
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
      </div>

      {/* Risk Distribution and Top Assets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Risk Distribution */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk Distribution</h3>
          <div className="space-y-3">
            {Object.entries(analytics.riskDistribution).map(([risk, value]) => {
              const percentage = analytics.totalPortfolioValue > 0 ? (value / analytics.totalPortfolioValue) * 100 : 0;
              const count = currentPortfolio.assets.filter(asset => asset.riskRating === risk).length;
              return (
                <div key={risk} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Badge className={getRiskColor(risk)}>
                      {risk.charAt(0).toUpperCase() + risk.slice(1)}
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

        {/* Top Performing Assets */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Assets</h3>
          <div className="space-y-3">
            {currentPortfolio.assets
              .sort((a, b) => b.performance.irr - a.performance.irr)
              .slice(0, 5)
              .map((asset) => (
                <div key={asset.id} className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {asset.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {getAssetTypeLabel(asset.assetType)} • {asset.location.country}
                    </p>
                  </div>
                  <div className="text-right ml-4">
                    <div className="text-sm font-semibold text-gray-900">
                      {formatPercentage(asset.performance.irr)}
                    </div>
                    <div className="text-xs text-gray-500">
                      {asset.performance.moic.toFixed(1)}x
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
