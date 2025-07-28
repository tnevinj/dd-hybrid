'use client';

import React, { useState } from 'react';
import { useUnifiedPortfolio } from '../contexts/UnifiedPortfolioContext';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AssetType, UnifiedAsset } from '@/types/portfolio';

interface AssetGridProps {
  assetType?: AssetType;
}

export function AssetGrid({ assetType }: AssetGridProps) {
  const { state, getFilteredAssets, setFilters, toggleAssetSelection } = useUnifiedPortfolio();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [riskFilter, setRiskFilter] = useState<string>('all');

  const filteredAssets = getFilteredAssets().filter(asset => {
    if (assetType && asset.assetType !== assetType) return false;
    if (statusFilter !== 'all' && asset.status !== statusFilter) return false;
    if (riskFilter !== 'all' && asset.riskRating !== riskFilter) return false;
    if (searchTerm && !asset.name.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

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
        return 'bg-blue-100 text-blue-800';
      case 'real_estate':
        return 'bg-green-100 text-green-800';
      case 'infrastructure':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'exited':
        return 'bg-gray-100 text-gray-800';
      case 'under_review':
        return 'bg-yellow-100 text-yellow-800';
      case 'disposed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRiskColor = (rating: string) => {
    switch (rating) {
      case 'low':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'critical':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getAssetSpecificMetrics = (asset: UnifiedAsset) => {
    switch (asset.assetType) {
      case 'traditional':
        return (
          <div className="text-xs text-gray-600 space-y-1">
            <div>Stage: {asset.specificMetrics.companyStage}</div>
            <div>Ownership: {asset.specificMetrics.ownershipPercentage.toFixed(1)}%</div>
            <div>Employees: {asset.specificMetrics.employeeCount.toLocaleString()}</div>
          </div>
        );
      case 'real_estate':
        return (
          <div className="text-xs text-gray-600 space-y-1">
            <div>Type: {asset.specificMetrics.propertyType}</div>
            <div>Occupancy: {asset.specificMetrics.occupancyRate.toFixed(1)}%</div>
            <div>Size: {asset.specificMetrics.totalSqFt.toLocaleString()} sq ft</div>
          </div>
        );
      case 'infrastructure':
        return (
          <div className="text-xs text-gray-600 space-y-1">
            <div>Category: {asset.specificMetrics.assetCategory}</div>
            <div>Utilization: {asset.specificMetrics.capacityUtilization.toFixed(1)}%</div>
            <div>Availability: {asset.specificMetrics.availabilityRate.toFixed(1)}%</div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex-1 min-w-0">
          <Input
            placeholder="Search assets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
        </div>

        <div className="flex items-center space-x-4">
          <select
            className="px-3 py-2 text-sm border border-gray-300 rounded-md"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="under_review">Under Review</option>
            <option value="exited">Exited</option>
            <option value="disposed">Disposed</option>
          </select>

          <select
            className="px-3 py-2 text-sm border border-gray-300 rounded-md"
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value)}
          >
            <option value="all">All Risk Levels</option>
            <option value="low">Low Risk</option>
            <option value="medium">Medium Risk</option>
            <option value="high">High Risk</option>
            <option value="critical">Critical Risk</option>
          </select>

          <Button size="sm" variant="outline">
            Export
          </Button>
        </div>
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Showing {filteredAssets.length} of {state.currentPortfolio?.assets.length || 0} assets
        </p>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">Selected:</span>
          <Badge variant="outline">{state.selectedAssets.length}</Badge>
        </div>
      </div>

      {/* Asset Grid */}
      {filteredAssets.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-xl mb-2">📊</div>
          <p className="text-gray-600">No assets found matching your criteria</p>
          <Button className="mt-4" size="sm">
            Add New Asset
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAssets.map((asset) => (
            <Card
              key={asset.id}
              className={`p-4 cursor-pointer transition-all hover:shadow-md ${
                state.selectedAssets.includes(asset.id)
                  ? 'ring-2 ring-blue-500 bg-blue-50'
                  : 'hover:bg-gray-50'
              }`}
              onClick={() => toggleAssetSelection(asset.id)}
            >
              {/* Asset Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-gray-900 truncate">
                    {asset.name}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    {asset.location.city ? `${asset.location.city}, ` : ''}{asset.location.country}
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={state.selectedAssets.includes(asset.id)}
                  onChange={() => toggleAssetSelection(asset.id)}
                  className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
              </div>

              {/* Asset Type and Status Badges */}
              <div className="flex items-center space-x-2 mb-3">
                <Badge className={getAssetTypeColor(asset.assetType)}>
                  {getAssetTypeLabel(asset.assetType)}
                </Badge>
                <Badge className={getStatusColor(asset.status)}>
                  {asset.status}
                </Badge>
              </div>

              {/* Financial Metrics */}
              <div className="space-y-2 mb-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-600">Current Value</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {formatCurrency(asset.currentValue)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-600">IRR</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {formatPercentage(asset.performance.irr)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-600">MOIC</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {asset.performance.moic.toFixed(1)}x
                  </span>
                </div>
              </div>

              {/* Asset-Specific Metrics */}
              {getAssetSpecificMetrics(asset)}

              {/* Risk and ESG */}
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200">
                <div className="flex items-center space-x-2">
                  <Badge className={getRiskColor(asset.riskRating)} size="sm">
                    {asset.riskRating}
                  </Badge>
                  <span className="text-xs text-gray-600">Risk</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span className="text-xs text-gray-600">ESG:</span>
                  <span className="text-xs font-medium text-gray-900">
                    {asset.esgMetrics.overallScore.toFixed(1)}
                  </span>
                </div>
              </div>

              {/* Tags */}
              {asset.tags.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1">
                  {asset.tags.slice(0, 3).map((tag, index) => (
                    <Badge key={index} variant="outline" size="sm" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {asset.tags.length > 3 && (
                    <Badge variant="outline" size="sm" className="text-xs">
                      +{asset.tags.length - 3}
                    </Badge>
                  )}
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Bulk Actions */}
      {state.selectedAssets.length > 0 && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
          <Card className="p-4 shadow-lg">
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-gray-900">
                {state.selectedAssets.length} assets selected
              </span>
              <Button size="sm" variant="outline">
                Update Status
              </Button>
              <Button size="sm" variant="outline">
                Export Selected
              </Button>
              <Button size="sm" variant="outline">
                Bulk Edit
              </Button>
              <Button
                size="sm" 
                variant="ghost"
                onClick={() => selectAssets([])}
              >
                Clear Selection
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}