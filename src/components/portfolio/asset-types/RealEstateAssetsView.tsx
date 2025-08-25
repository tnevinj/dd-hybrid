'use client';

import React, { useState } from 'react';
import { useUnifiedPortfolio } from '../contexts/UnifiedPortfolioContext';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { RealEstateAsset } from '@/types/portfolio';

export function RealEstateAssetsView() {
  const { state, getAssetsByType } = useUnifiedPortfolio();
  const [sortBy, setSortBy] = useState<'value' | 'occupancy' | 'yield' | 'sqft'>('value');
  const [filterType, setFilterType] = useState<string>('all');

  const realEstateAssets = getAssetsByType('real_estate') as RealEstateAsset[];

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

  const getPropertyTypeColor = (type: string) => {
    switch (type) {
      case 'office':
        return 'bg-blue-100 text-blue-800';
      case 'retail':
        return 'bg-green-100 text-green-800';
      case 'industrial':
        return 'bg-gray-100 text-gray-800';
      case 'residential':
        return 'bg-blue-100 text-blue-800';
      case 'mixed_use':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPropertyTypeLabel = (type: string) => {
    return type.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const getOccupancyStatus = (occupancy: number) => {
    if (occupancy >= 95) return { color: 'text-green-600', label: 'Excellent' };
    if (occupancy >= 85) return { color: 'text-blue-600', label: 'Good' };
    if (occupancy >= 70) return { color: 'text-yellow-600', label: 'Fair' };
    return { color: 'text-red-600', label: 'Poor' };
  };

  const filteredAssets = realEstateAssets.filter(asset => {
    if (filterType !== 'all' && asset.specificMetrics?.propertyType !== filterType) {
      return false;
    }
    return true;
  });

  const sortedAssets = [...filteredAssets].sort((a, b) => {
    switch (sortBy) {
      case 'value':
        return b.currentValue - a.currentValue;
      case 'occupancy':
        return b.specificMetrics.occupancyRate - a.specificMetrics.occupancyRate;
      case 'yield':
        return (b.specificMetrics?.noiYield || 0) - (a.specificMetrics?.noiYield || 0);
      case 'sqft':
        return (b.specificMetrics?.totalSqFt || 0) - (a.specificMetrics?.totalSqFt || 0);
      default:
        return 0;
    }
  });

  const calculatePropertyTypeMetrics = () => {
    const typeMetrics = realEstateAssets.reduce((acc, asset) => {
      const type = asset.specificMetrics?.propertyType || 'unknown';
      if (!acc[type]) {
        acc[type] = {
          count: 0,
          totalValue: 0,
          totalSqFt: 0,
          avgOccupancy: 0,
          avgYield: 0,
          avgCapRate: 0,
        };
      }
      acc[type].count++;
      acc[type].totalValue += asset.currentValue;
      acc[type].totalSqFt += asset.specificMetrics?.totalSqFt || 0;
      acc[type].avgOccupancy += asset.specificMetrics?.occupancyRate || 0;
      acc[type].avgYield += asset.specificMetrics?.noiYield || 0;
      acc[type].avgCapRate += asset.specificMetrics?.capRate || 0;
      return acc;
    }, {} as Record<string, any>);

    // Calculate averages
    Object.keys(typeMetrics).forEach(type => {
      typeMetrics[type].avgOccupancy /= typeMetrics[type].count;
      typeMetrics[type].avgYield /= typeMetrics[type].count;
      typeMetrics[type].avgCapRate /= typeMetrics[type].count;
    });

    return typeMetrics;
  };

  const typeMetrics = calculatePropertyTypeMetrics();

  const portfolioMetrics = {
    totalSqFt: realEstateAssets.reduce((sum, asset) => sum + (asset.specificMetrics?.totalSqFt || 0), 0),
    avgOccupancy: realEstateAssets.reduce((sum, asset) => sum + (asset.specificMetrics?.occupancyRate || 0), 0) / realEstateAssets.length,
    avgYield: realEstateAssets.reduce((sum, asset) => sum + (asset.specificMetrics?.noiYield || 0), 0) / realEstateAssets.length,
    avgCapRate: realEstateAssets.reduce((sum, asset) => sum + (asset.specificMetrics?.capRate || 0), 0) / realEstateAssets.length,
    totalTenants: realEstateAssets.reduce((sum, asset) => sum + (asset.leaseInfo?.majorTenants?.length || 0), 0),
  };

  if (realEstateAssets.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-xl mb-2">🏠</div>
        <p className="text-gray-600">No real estate investments found</p>
        <Button className="mt-4" size="sm">
          Add Real Estate Investment
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Real Estate Portfolio</h2>
          <p className="text-gray-600">
            {realEstateAssets.length} properties • {portfolioMetrics.totalSqFt.toLocaleString()} sq ft
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">Type:</span>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-1 text-sm border border-gray-300 rounded-md"
            >
              <option value="all">All Types</option>
              <option value="office">Office</option>
              <option value="retail">Retail</option>
              <option value="industrial">Industrial</option>
              <option value="residential">Residential</option>
              <option value="mixed_use">Mixed Use</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-1 text-sm border border-gray-300 rounded-md"
            >
              <option value="value">Property Value</option>
              <option value="occupancy">Occupancy Rate</option>
              <option value="yield">NOI Yield</option>
              <option value="sqft">Square Footage</option>
            </select>
          </div>

          <Button size="sm">
            Add Property
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-6m-2-5h6m-6 0V9m0 7h-2a2 2 0 01-2-2V9a2 2 0 012-2h2m6-2V5a2 2 0 00-2-2h-2a2 2 0 00-2 2v2m4 10v4" />
                </svg>
              </div>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Avg Occupancy Rate
                </dt>
                <dd className="text-lg font-medium text-gray-900">
                  {formatPercentage(portfolioMetrics.avgOccupancy)}
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Avg NOI Yield
                </dt>
                <dd className="text-lg font-medium text-gray-900">
                  {formatPercentage(portfolioMetrics.avgYield)}
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Avg Cap Rate
                </dt>
                <dd className="text-lg font-medium text-gray-900">
                  {formatPercentage(portfolioMetrics.avgCapRate)}
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Total Tenants
                </dt>
                <dd className="text-lg font-medium text-gray-900">
                  {portfolioMetrics.totalTenants}
                </dd>
              </dl>
            </div>
          </div>
        </Card>
      </div>

      {/* Property Type Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(typeMetrics).map(([type, metrics]) => (
          <Card key={type} className="p-4">
            <div className="flex items-center justify-between mb-3">
              <Badge className={getPropertyTypeColor(type)}>
                {getPropertyTypeLabel(type)}
              </Badge>
              <span className="text-sm text-gray-600">{metrics.count} properties</span>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-600">Total Value</span>
                <span className="text-sm font-semibold text-gray-900">
                  {formatCurrency(metrics.totalValue)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-600">Total Area</span>
                <span className="text-sm font-semibold text-gray-900">
                  {metrics.totalSqFt.toLocaleString()} sq ft
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-600">Avg Occupancy</span>
                <span className="text-sm font-semibold text-gray-900">
                  {formatPercentage(metrics.avgOccupancy)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-600">Avg NOI Yield</span>
                <span className="text-sm font-semibold text-gray-900">
                  {formatPercentage(metrics.avgYield)}
                </span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Detailed Property List */}
      <Card className="overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Property Details</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Property
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Current Value
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Size (sq ft)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Occupancy
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  NOI Yield
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cap Rate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Major Tenants
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedAssets.map((asset) => {
                const occupancyStatus = getOccupancyStatus(asset.specificMetrics?.occupancyRate || 0);
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
                      <Badge className={getPropertyTypeColor(asset.specificMetrics?.propertyType)}>
                        {getPropertyTypeLabel(asset.specificMetrics?.propertyType)}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {formatCurrency(asset.currentValue)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {asset.specificMetrics?.totalSqFt?.toLocaleString() || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-1">
                          <div className={`text-sm font-medium ${occupancyStatus.color}`}>
                            {formatPercentage(asset.specificMetrics?.occupancyRate || 0)}
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                            <div
                              className="bg-blue-600 h-1.5 rounded-full"
                              style={{ width: `${asset.specificMetrics?.occupancyRate || 0}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className={
                        (asset.specificMetrics?.noiYield || 0) >= 8 ? 'text-green-600' :
                        (asset.specificMetrics?.noiYield || 0) >= 6 ? 'text-yellow-600' :
                        'text-red-600'
                      }>
                        {formatPercentage(asset.specificMetrics?.noiYield || 0)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatPercentage(asset.specificMetrics?.capRate || 0)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="space-y-1">
                        {asset.leaseInfo?.majorTenants?.slice(0, 2).map((tenant, index) => (
                          <div key={index} className="text-xs">
                            <span className="font-medium">{tenant.name}</span>
                            <span className="text-gray-500 ml-1">
                              ({tenant.sqFt.toLocaleString()} sq ft)
                            </span>
                          </div>
                        ))}
                        {asset.leaseInfo?.majorTenants && asset.leaseInfo.majorTenants.length > 2 && (
                          <div className="text-xs text-gray-500">
                            +{asset.leaseInfo?.majorTenants?.length - 2} more
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Lease Expiration Analysis */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Lease Expiration Analysis</h3>
        <div className="space-y-4">
          {sortedAssets.slice(0, 5).map((asset) => (
            <div key={asset.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="font-medium text-gray-900">{asset.name}</h4>
                  <p className="text-sm text-gray-500">
                    {formatPercentage(asset.specificMetrics?.occupancyRate || 0)} occupied • {asset.leaseInfo?.majorTenants?.length || 0} tenants
                  </p>
                </div>
                <Badge className={getPropertyTypeColor(asset.specificMetrics?.propertyType)}>
                  {getPropertyTypeLabel(asset.specificMetrics?.propertyType)}
                </Badge>
              </div>
              
              <div className="space-y-2">
                {asset.leaseInfo?.majorTenants?.slice(0, 3).map((tenant, index) => {
                  const expiryDate = new Date(tenant.leaseExpiry);
                  const isExpiringSoon = expiryDate < new Date(Date.now() + 365 * 24 * 60 * 60 * 1000); // Within 1 year
                  
                  return (
                    <div key={index} className="flex justify-between items-center text-sm">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{tenant.name}</span>
                        <span className="text-gray-500">
                          ({formatPercentage((tenant.sqFt || 0) / (asset.specificMetrics?.totalSqFt || 1) * 100)} of space)
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-600">
                          {formatCurrency(tenant.rentPsf)}/sq ft
                        </span>
                        <span className={isExpiringSoon ? 'text-red-600 font-medium' : 'text-gray-600'}>
                          Expires {expiryDate.getFullYear()}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
