'use client';

import React, { useState } from 'react';
import { useUnifiedPortfolio } from '../contexts/UnifiedPortfolioContext';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { TraditionalAsset } from '@/types/portfolio';

export function TraditionalAssetsView() {
  const { state, getAssetsByType } = useUnifiedPortfolio();
  const [sortBy, setSortBy] = useState<'value' | 'irr' | 'ownership' | 'stage'>('value');
  const [filterStage, setFilterStage] = useState<string>('all');

  const traditionalAssets = getAssetsByType('traditional') as TraditionalAsset[];

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

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'seed':
        return 'bg-red-100 text-red-800';
      case 'series_a':
        return 'bg-orange-100 text-orange-800';
      case 'series_b':
        return 'bg-yellow-100 text-yellow-800';
      case 'series_c':
        return 'bg-blue-100 text-blue-800';
      case 'growth':
        return 'bg-green-100 text-green-800';
      case 'mature':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStageLabel = (stage: string) => {
    return stage.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const filteredAssets = traditionalAssets.filter(asset => {
    if (filterStage !== 'all' && asset.specificMetrics.companyStage !== filterStage) {
      return false;
    }
    return true;
  });

  const sortedAssets = [...filteredAssets].sort((a, b) => {
    switch (sortBy) {
      case 'value':
        return b.currentValue - a.currentValue;
      case 'irr':
        return b.performance.irr - a.performance.irr;
      case 'ownership':
        return b.specificMetrics.ownershipPercentage - a.specificMetrics.ownershipPercentage;
      case 'stage':
        const stageOrder = ['seed', 'series_a', 'series_b', 'series_c', 'growth', 'mature'];
        return stageOrder.indexOf(a.specificMetrics.companyStage) - stageOrder.indexOf(b.specificMetrics.companyStage);
      default:
        return 0;
    }
  });

  const calculateStageMetrics = () => {
    const stageMetrics = traditionalAssets.reduce((acc, asset) => {
      const stage = asset.specificMetrics.companyStage;
      if (!acc[stage]) {
        acc[stage] = {
          count: 0,
          totalValue: 0,
          totalInvested: 0,
          avgIRR: 0,
          avgOwnership: 0,
        };
      }
      acc[stage].count++;
      acc[stage].totalValue += asset.currentValue;
      acc[stage].totalInvested += asset.acquisitionValue;
      acc[stage].avgIRR += asset.performance.irr;
      acc[stage].avgOwnership += asset.specificMetrics.ownershipPercentage;
      return acc;
    }, {} as Record<string, any>);

    // Calculate averages
    Object.keys(stageMetrics).forEach(stage => {
      stageMetrics[stage].avgIRR /= stageMetrics[stage].count;
      stageMetrics[stage].avgOwnership /= stageMetrics[stage].count;
      stageMetrics[stage].unrealizedGains = stageMetrics[stage].totalValue - stageMetrics[stage].totalInvested;
    });

    return stageMetrics;
  };

  const stageMetrics = calculateStageMetrics();

  if (traditionalAssets.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-xl mb-2">💼</div>
        <p className="text-gray-600">No traditional investments found</p>
        <Button className="mt-4" size="sm">
          Add Traditional Investment
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Traditional Investments</h2>
          <p className="text-gray-600">{traditionalAssets.length} investments</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">Stage:</span>
            <select
              value={filterStage}
              onChange={(e) => setFilterStage(e.target.value)}
              className="px-3 py-1 text-sm border border-gray-300 rounded-md"
            >
              <option value="all">All Stages</option>
              <option value="seed">Seed</option>
              <option value="series_a">Series A</option>
              <option value="series_b">Series B</option>
              <option value="series_c">Series C</option>
              <option value="growth">Growth</option>
              <option value="mature">Mature</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-1 text-sm border border-gray-300 rounded-md"
            >
              <option value="value">Current Value</option>
              <option value="irr">IRR</option>
              <option value="ownership">Ownership %</option>
              <option value="stage">Stage</option>
            </select>
          </div>

          <Button size="sm">
            Add Investment
          </Button>
        </div>
      </div>

      {/* Stage Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(stageMetrics).map(([stage, metrics]) => (
          <Card key={stage} className="p-4">
            <div className="flex items-center justify-between mb-3">
              <Badge className={getStageColor(stage)}>
                {getStageLabel(stage)}
              </Badge>
              <span className="text-sm text-gray-600">{metrics.count} companies</span>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-600">Total Value</span>
                <span className="text-sm font-semibold text-gray-900">
                  {formatCurrency(metrics.totalValue)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-600">Avg IRR</span>
                <span className="text-sm font-semibold text-gray-900">
                  {formatPercentage(metrics.avgIRR)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-600">Avg Ownership</span>
                <span className="text-sm font-semibold text-gray-900">
                  {metrics.avgOwnership.toFixed(1)}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-600">Unrealized Gains</span>
                <span className={`text-sm font-semibold ${
                  metrics.unrealizedGains >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {formatCurrency(metrics.unrealizedGains)}
                </span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Detailed Asset List */}
      <Card className="overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Portfolio Companies</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Company
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stage
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Current Value
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ownership
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  IRR
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  MOIC
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Revenue
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Employees
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Board Seats
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedAssets.map((asset) => (
                <tr key={asset.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {asset.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {asset.sector} • {asset.location.country}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge className={getStageColor(asset.specificMetrics.companyStage)}>
                      {getStageLabel(asset.specificMetrics.companyStage)}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {formatCurrency(asset.currentValue)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {asset.specificMetrics.ownershipPercentage.toFixed(1)}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <span className={
                      asset.performance.irr >= 0.15 ? 'text-green-600' :
                      asset.performance.irr >= 0.08 ? 'text-yellow-600' :
                      'text-red-600'
                    }>
                      {formatPercentage(asset.performance.irr)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <span className={
                      asset.performance.moic >= 2.0 ? 'text-green-600' :
                      asset.performance.moic >= 1.5 ? 'text-yellow-600' :
                      'text-red-600'
                    }>
                      {asset.performance.moic.toFixed(1)}x
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(asset.specificMetrics.revenue)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {asset.specificMetrics.employeeCount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {asset.specificMetrics.boardSeats}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Key Metrics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="p-3 bg-blue-100 rounded-full">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-6m-2-5h6m-6 0V9m0 7h-2a2 2 0 01-2-2V9a2 2 0 012-2h2m6-2V5a2 2 0 00-2-2h-2a2 2 0 00-2 2v2m4 10v4" />
                </svg>
              </div>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Total Portfolio Companies
                </dt>
                <dd className="text-lg font-medium text-gray-900">
                  {traditionalAssets.length}
                </dd>
              </dl>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="p-3 bg-green-100 rounded-full">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Total Employees
                </dt>
                <dd className="text-lg font-medium text-gray-900">
                  {traditionalAssets.reduce((sum, asset) => sum + asset.specificMetrics.employeeCount, 0).toLocaleString()}
                </dd>
              </dl>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="p-3 bg-blue-100 rounded-full">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Total Board Seats
                </dt>
                <dd className="text-lg font-medium text-gray-900">
                  {traditionalAssets.reduce((sum, asset) => sum + asset.specificMetrics.boardSeats, 0)}
                </dd>
              </dl>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="p-3 bg-yellow-100 rounded-full">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Total Revenue
                </dt>
                <dd className="text-lg font-medium text-gray-900">
                  {formatCurrency(traditionalAssets.reduce((sum, asset) => sum + asset.specificMetrics.revenue, 0))}
                </dd>
              </dl>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}