'use client';

import React, { useState } from 'react';
import { useUnifiedPortfolio } from '../contexts/UnifiedPortfolioContext';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { InfrastructureAsset } from '@/types/portfolio';

export function InfrastructureAssetsView() {
  const { state, getAssetsByType } = useUnifiedPortfolio();
  const [sortBy, setSortBy] = useState<'value' | 'utilization' | 'efficiency' | 'age'>('value');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const infrastructureAssets = getAssetsByType('infrastructure') as InfrastructureAsset[];

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

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'energy':
        return 'bg-yellow-100 text-yellow-800';
      case 'transport':
        return 'bg-blue-100 text-blue-800';
      case 'water':
        return 'bg-cyan-100 text-cyan-800';
      case 'telecom':
        return 'bg-blue-100 text-blue-800';
      case 'social':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryLabel = (category: string) => {
    return category.charAt(0).toUpperCase() + category.slice(1);
  };

  const getContractTypeColor = (contractType: string) => {
    switch (contractType) {
      case 'availability':
        return 'bg-green-100 text-green-800';
      case 'usage':
        return 'bg-blue-100 text-blue-800';
      case 'hybrid':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getUtilizationStatus = (utilization: number) => {
    if (utilization >= 90) return { color: 'text-green-600', label: 'Excellent', bgColor: 'bg-green-100' };
    if (utilization >= 75) return { color: 'text-blue-600', label: 'Good', bgColor: 'bg-blue-100' };
    if (utilization >= 60) return { color: 'text-yellow-600', label: 'Fair', bgColor: 'bg-yellow-100' };
    return { color: 'text-red-600', label: 'Poor', bgColor: 'bg-red-100' };
  };

  const getAssetAge = (asset: InfrastructureAsset) => {
    const commissionDate = new Date(asset.operationalData.commissionDate);
    const today = new Date();
    const ageInYears = Math.floor((today.getTime() - commissionDate.getTime()) / (1000 * 60 * 60 * 24 * 365));
    return ageInYears;
  };

  const getRemainingLife = (asset: InfrastructureAsset) => {
    const age = getAssetAge(asset);
    return Math.max(0, asset.operationalData.designLife - age);
  };

  const filteredAssets = infrastructureAssets.filter(asset => {
    if (filterCategory !== 'all' && asset.specificMetrics.assetCategory !== filterCategory) {
      return false;
    }
    return true;
  });

  const sortedAssets = [...filteredAssets].sort((a, b) => {
    switch (sortBy) {
      case 'value':
        return b.currentValue - a.currentValue;
      case 'utilization':
        return b.specificMetrics.capacityUtilization - a.specificMetrics.capacityUtilization;
      case 'efficiency':
        return b.specificMetrics.operationalEfficiency - a.specificMetrics.operationalEfficiency;
      case 'age':
        return getAssetAge(a) - getAssetAge(b);
      default:
        return 0;
    }
  });

  const calculateCategoryMetrics = () => {
    const categoryMetrics = infrastructureAssets.reduce((acc, asset) => {
      const category = asset.specificMetrics.assetCategory;
      if (!acc[category]) {
        acc[category] = {
          count: 0,
          totalValue: 0,
          avgUtilization: 0,
          avgEfficiency: 0,
          avgAvailability: 0,
          totalContractedRevenue: 0,
        };
      }
      acc[category].count++;
      acc[category].totalValue += asset.currentValue;
      acc[category].avgUtilization += asset.specificMetrics.capacityUtilization;
      acc[category].avgEfficiency += asset.specificMetrics.operationalEfficiency;
      acc[category].avgAvailability += asset.specificMetrics.availabilityRate;
      acc[category].totalContractedRevenue += asset.specificMetrics.contractedRevenue;
      return acc;
    }, {} as Record<string, any>);

    // Calculate averages
    Object.keys(categoryMetrics).forEach(category => {
      categoryMetrics[category].avgUtilization /= categoryMetrics[category].count;
      categoryMetrics[category].avgEfficiency /= categoryMetrics[category].count;
      categoryMetrics[category].avgAvailability /= categoryMetrics[category].count;
    });

    return categoryMetrics;
  };

  const categoryMetrics = calculateCategoryMetrics();

  const portfolioMetrics = {
    avgUtilization: infrastructureAssets.reduce((sum, asset) => sum + asset.specificMetrics.capacityUtilization, 0) / infrastructureAssets.length,
    avgEfficiency: infrastructureAssets.reduce((sum, asset) => sum + asset.specificMetrics.operationalEfficiency, 0) / infrastructureAssets.length,
    avgAvailability: infrastructureAssets.reduce((sum, asset) => sum + asset.specificMetrics.availabilityRate, 0) / infrastructureAssets.length,
    totalContractedRevenue: infrastructureAssets.reduce((sum, asset) => sum + asset.specificMetrics.contractedRevenue, 0),
    avgAge: infrastructureAssets.reduce((sum, asset) => sum + getAssetAge(asset), 0) / infrastructureAssets.length,
    assetsNeedingMaintenance: infrastructureAssets.filter(asset => asset.specificMetrics.maintenanceScore < 70).length,
  };

  if (infrastructureAssets.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-xl mb-2">🏗️</div>
        <p className="text-gray-600">No infrastructure investments found</p>
        <Button className="mt-4" size="sm">
          Add Infrastructure Investment
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Infrastructure Portfolio</h2>
          <p className="text-gray-600">
            {infrastructureAssets.length} assets • Avg {portfolioMetrics.avgAge.toFixed(1)} years old
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">Category:</span>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-1 text-sm border border-gray-300 rounded-md"
            >
              <option value="all">All Categories</option>
              <option value="energy">Energy</option>
              <option value="transport">Transport</option>
              <option value="water">Water</option>
              <option value="telecom">Telecom</option>
              <option value="social">Social</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-1 text-sm border border-gray-300 rounded-md"
            >
              <option value="value">Asset Value</option>
              <option value="utilization">Capacity Utilization</option>
              <option value="efficiency">Operational Efficiency</option>
              <option value="age">Asset Age</option>
            </select>
          </div>

          <Button size="sm">
            Add Asset
          </Button>
        </div>
      </div>

      {/* Portfolio Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="p-3 bg-blue-100 rounded-full">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Avg Capacity Utilization
                </dt>
                <dd className="text-lg font-medium text-gray-900">
                  {formatPercentage(portfolioMetrics.avgUtilization)}
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Avg Operational Efficiency
                </dt>
                <dd className="text-lg font-medium text-gray-900">
                  {formatPercentage(portfolioMetrics.avgEfficiency)}
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Contracted Revenue
                </dt>
                <dd className="text-lg font-medium text-gray-900">
                  {formatCurrency(portfolioMetrics.totalContractedRevenue)}
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.232 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Maintenance Required
                </dt>
                <dd className="text-lg font-medium text-gray-900">
                  {portfolioMetrics.assetsNeedingMaintenance}
                </dd>
              </dl>
            </div>
          </div>
        </Card>
      </div>

      {/* Category Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(categoryMetrics).map(([category, metrics]) => (
          <Card key={category} className="p-4">
            <div className="flex items-center justify-between mb-3">
              <Badge className={getCategoryColor(category)}>
                {getCategoryLabel(category)}
              </Badge>
              <span className="text-sm text-gray-600">{metrics.count} assets</span>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-600">Total Value</span>
                <span className="text-sm font-semibold text-gray-900">
                  {formatCurrency(metrics.totalValue)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-600">Avg Utilization</span>
                <span className="text-sm font-semibold text-gray-900">
                  {formatPercentage(metrics.avgUtilization)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-600">Avg Efficiency</span>
                <span className="text-sm font-semibold text-gray-900">
                  {formatPercentage(metrics.avgEfficiency)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-600">Contracted Revenue</span>
                <span className="text-sm font-semibold text-gray-900">
                  {formatCurrency(metrics.totalContractedRevenue)}
                </span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Detailed Asset List */}
      <Card className="overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Asset Details</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Asset
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Current Value
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Utilization
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Efficiency
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Availability
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Age / Life
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contract Type
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedAssets.map((asset) => {
                const utilizationStatus = getUtilizationStatus(asset.specificMetrics.capacityUtilization);
                const assetAge = getAssetAge(asset);
                const remainingLife = getRemainingLife(asset);
                
                return (
                  <tr key={asset.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {asset.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {asset.location.city}, {asset.location.country}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge className={getCategoryColor(asset.specificMetrics.assetCategory)}>
                        {getCategoryLabel(asset.specificMetrics.assetCategory)}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {formatCurrency(asset.currentValue)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-1">
                          <div className={`text-sm font-medium ${utilizationStatus.color}`}>
                            {formatPercentage(asset.specificMetrics.capacityUtilization)}
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                            <div
                              className="bg-blue-600 h-1.5 rounded-full"
                              style={{ width: `${asset.specificMetrics.capacityUtilization}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className={
                        asset.specificMetrics.operationalEfficiency >= 90 ? 'text-green-600' :
                        asset.specificMetrics.operationalEfficiency >= 75 ? 'text-yellow-600' :
                        'text-red-600'
                      }>
                        {formatPercentage(asset.specificMetrics.operationalEfficiency)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className={
                        asset.specificMetrics.availabilityRate >= 95 ? 'text-green-600' :
                        asset.specificMetrics.availabilityRate >= 90 ? 'text-yellow-600' :
                        'text-red-600'
                      }>
                        {formatPercentage(asset.specificMetrics.availabilityRate)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div>
                        <div className="font-medium">{assetAge} years</div>
                        <div className="text-xs text-gray-500">
                          {remainingLife} years left
                        </div>
                        <Progress value={(assetAge / asset.operationalData.designLife) * 100} className="h-1 mt-1" />
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge className={getContractTypeColor(asset.contractualInfo.contractType)}>
                        {asset.contractualInfo.contractType.charAt(0).toUpperCase() + asset.contractualInfo.contractType.slice(1)}
                      </Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Maintenance Schedule */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Maintenance & Asset Health</h3>
        <div className="space-y-4">
          {sortedAssets
            .filter(asset => asset.specificMetrics.maintenanceScore < 80 || asset.operationalData.nextMajorMaintenance)
            .slice(0, 5)
            .map((asset) => {
              const maintenanceScore = asset.specificMetrics.maintenanceScore;
              const nextMaintenance = asset.operationalData.nextMajorMaintenance 
                ? new Date(asset.operationalData.nextMajorMaintenance) 
                : null;
              const isMaintenanceDue = nextMaintenance && nextMaintenance < new Date(Date.now() + 90 * 24 * 60 * 60 * 1000); // Within 90 days
              
              return (
                <div key={asset.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-medium text-gray-900">{asset.name}</h4>
                      <p className="text-sm text-gray-500">
                        {getCategoryLabel(asset.specificMetrics.assetCategory)} • {getAssetAge(asset)} years old
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">
                        Maintenance Score: {maintenanceScore}/100
                      </div>
                      <Progress value={maintenanceScore} className="h-2 w-24 mt-1" />
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                      <div className="text-sm">
                        <span className="text-gray-600">Efficiency: </span>
                        <span className={
                          asset.specificMetrics.operationalEfficiency >= 90 ? 'text-green-600' :
                          asset.specificMetrics.operationalEfficiency >= 75 ? 'text-yellow-600' :
                          'text-red-600'
                        }>
                          {formatPercentage(asset.specificMetrics.operationalEfficiency)}
                        </span>
                      </div>
                      <div className="text-sm">
                        <span className="text-gray-600">Compliance: </span>
                        <span className={
                          asset.specificMetrics.regulatoryCompliance >= 95 ? 'text-green-600' :
                          asset.specificMetrics.regulatoryCompliance >= 85 ? 'text-yellow-600' :
                          'text-red-600'
                        }>
                          {formatPercentage(asset.specificMetrics.regulatoryCompliance)}
                        </span>
                      </div>
                    </div>
                    
                    {nextMaintenance && (
                      <div className="text-right">
                        <div className={`text-sm font-medium ${isMaintenanceDue ? 'text-red-600' : 'text-gray-700'}`}>
                          Next Maintenance: 
                        </div>
                        <div className={`text-sm ${isMaintenanceDue ? 'text-red-600' : 'text-gray-600'}`}>
                          {nextMaintenance.toLocaleDateString()}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
        </div>
      </Card>
    </div>
  );
}