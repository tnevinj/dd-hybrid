'use client';

import React, { useState } from 'react';
import { useUnifiedPortfolio } from '../contexts/UnifiedPortfolioContext';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AssetType } from '@/types/portfolio';

export function PortfolioPerformance() {
  const { state, analytics } = useUnifiedPortfolio();
  const [timeframe, setTimeframe] = useState<'1M' | '3M' | '6M' | '1Y' | '3Y' | 'ALL'>('1Y');
  const [viewType, setViewType] = useState<'overview' | 'detailed' | 'comparison'>('overview');

  if (!state.currentPortfolio || !analytics) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading performance data...</p>
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

  const getPerformanceByAssetType = () => {
    const assetTypes = Object.keys(analytics.assetAllocation) as AssetType[];
    return assetTypes.map(assetType => {
      const assets = state.currentPortfolio!.assets.filter(asset => asset.assetType === assetType);
      const totalValue = assets.reduce((sum, asset) => sum + asset.currentValue, 0);
      const totalInvested = assets.reduce((sum, asset) => sum + asset.acquisitionValue, 0);
      const weightedIRR = assets.reduce((sum, asset) => sum + (asset.performance.irr * asset.currentValue), 0) / totalValue;
      const weightedMOIC = assets.reduce((sum, asset) => sum + (asset.performance.moic * asset.currentValue), 0) / totalValue;
      
      return {
        assetType,
        label: getAssetTypeLabel(assetType),
        totalValue,
        totalInvested,
        unrealizedGains: totalValue - totalInvested,
        irr: weightedIRR,
        moic: weightedMOIC,
        assetCount: assets.length,
        allocation: (totalValue / analytics.totalPortfolioValue) * 100,
      };
    });
  };

  const performanceByAssetType = getPerformanceByAssetType();

  const topPerformers = state.currentPortfolio.assets
    .sort((a, b) => b.performance.irr - a.performance.irr)
    .slice(0, 10);

  const bottomPerformers = state.currentPortfolio.assets
    .sort((a, b) => a.performance.irr - b.performance.irr)
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Performance Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">Time Period:</span>
            <div className="flex rounded-md shadow-sm">
              {['1M', '3M', '6M', '1Y', '3Y', 'ALL'].map((period) => (
                <button
                  key={period}
                  onClick={() => setTimeframe(period as any)}
                  className={`px-3 py-1 text-xs font-medium border ${
                    timeframe === period
                      ? 'bg-blue-50 border-blue-200 text-blue-700'
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                  } ${
                    period === '1M' ? 'rounded-l-md' : 
                    period === 'ALL' ? 'rounded-r-md' : 
                    'border-l-0'
                  }`}
                >
                  {period}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">View:</span>
            <select
              value={viewType}
              onChange={(e) => setViewType(e.target.value as any)}
              className="px-3 py-1 text-sm border border-gray-300 rounded-md"
            >
              <option value="overview">Overview</option>
              <option value="detailed">Detailed</option>
              <option value="comparison">Comparison</option>
            </select>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            Export Report
          </Button>
          <Button size="sm">
            Generate Analysis
          </Button>
        </div>
      </div>

      {/* Key Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Return</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(analytics.unrealizedGains)}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-green-600">
              +{formatPercentage(analytics.unrealizedGains / analytics.totalInvested)}
            </span>
            <span className="text-gray-500 ml-1">vs invested capital</span>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Weighted IRR</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatPercentage(analytics.weightedIRR)}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
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
              <p className="text-sm font-medium text-gray-600">Multiple (MOIC)</p>
              <p className="text-2xl font-bold text-gray-900">
                {analytics.weightedMOIC.toFixed(1)}x
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
              </svg>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Asset Count</p>
              <p className="text-2xl font-bold text-gray-900">
                {state.currentPortfolio.assets.length}
              </p>
            </div>
            <div className="p-3 bg-gray-100 rounded-full">
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-6m-2-5h6m-6 0V9m0 7h-2a2 2 0 01-2-2V9a2 2 0 012-2h2m6-2V5a2 2 0 00-2-2h-2a2 2 0 00-2 2v2m4 10v4" />
              </svg>
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-blue-600">
              {Object.keys(analytics.assetAllocation).length}
            </span>
            <span className="text-gray-500 ml-1">asset types</span>
          </div>
        </Card>
      </div>

      {/* Performance by Asset Type */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Performance by Asset Type</h3>
          <Button variant="outline" size="sm">
            View Details
          </Button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Asset Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Count
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Allocation
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Current Value
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Unrealized Gains
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  IRR
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  MOIC
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {performanceByAssetType.map((item) => (
                <tr key={item.assetType} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Badge
                        className={
                          item.assetType === 'traditional' ? 'bg-blue-100 text-blue-800' :
                          item.assetType === 'real_estate' ? 'bg-green-100 text-green-800' :
                          'bg-blue-100 text-blue-800'
                        }
                      >
                        {item.label}
                      </Badge>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.assetCount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.allocation.toFixed(1)}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {formatCurrency(item.totalValue)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <span className={item.unrealizedGains >= 0 ? 'text-green-600' : 'text-red-600'}>
                      {formatCurrency(item.unrealizedGains)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <span className={item.irr >= 0.12 ? 'text-green-600' : item.irr >= 0.08 ? 'text-yellow-600' : 'text-red-600'}>
                      {formatPercentage(item.irr)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <span className={item.moic >= 2.0 ? 'text-green-600' : item.moic >= 1.5 ? 'text-yellow-600' : 'text-red-600'}>
                      {item.moic.toFixed(1)}x
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Top and Bottom Performers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performers */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performers</h3>
          <div className="space-y-3">
            {topPerformers.slice(0, 5).map((asset, index) => (
              <div key={asset.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-green-100 text-green-700 text-xs font-medium">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {asset.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {getAssetTypeLabel(asset.assetType)} • {asset.location.country}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-green-600">
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

        {/* Underperformers */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Attention Required</h3>
          <div className="space-y-3">
            {bottomPerformers.map((asset, index) => (
              <div key={asset.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-red-100 text-red-700 text-xs font-medium">
                    !
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {asset.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {getAssetTypeLabel(asset.assetType)} • {asset.location.country}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-red-600">
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

      {/* Benchmark Comparison */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Benchmark Comparison</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {formatPercentage(analytics.benchmarkComparison.portfolio)}
            </div>
            <div className="text-sm text-gray-600">Portfolio IRR</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-600">
              {formatPercentage(analytics.benchmarkComparison.benchmark)}
            </div>
            <div className="text-sm text-gray-600">Benchmark IRR</div>
          </div>
          <div className="text-center">
            <div className={`text-2xl font-bold ${
              analytics.benchmarkComparison.outperformance >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {analytics.benchmarkComparison.outperformance >= 0 ? '+' : ''}
              {formatPercentage(analytics.benchmarkComparison.outperformance)}
            </div>
            <div className="text-sm text-gray-600">Outperformance</div>
          </div>
        </div>
      </Card>
    </div>
  );
}