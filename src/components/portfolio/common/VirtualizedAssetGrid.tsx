'use client';

import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { useUnifiedPortfolio } from '../contexts/UnifiedPortfolioContext';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AssetType, UnifiedAsset } from '@/types/portfolio';
import { useDebounce } from '@/hooks/use-debounce';

interface VirtualizedAssetGridProps {
  assetType?: AssetType;
  pageSize?: number;
  itemHeight?: number;
}

interface AssetGridFilters {
  search: string;
  assetType: AssetType | 'all';
  status: string;
  riskRating: string;
  sector: string;
  minValue: number;
  maxValue: number;
  sortBy: 'name' | 'currentValue' | 'irr' | 'moic' | 'acquisitionDate';
  sortDirection: 'asc' | 'desc';
}

export function VirtualizedAssetGrid({ 
  assetType, 
  pageSize = 50,
  itemHeight = 200 
}: VirtualizedAssetGridProps) {
  const { state, getFilteredAssets, toggleAssetSelection, selectAssets } = useUnifiedPortfolio();
  
  // Filters state
  const [filters, setFilters] = useState<AssetGridFilters>({
    search: '',
    assetType: assetType || 'all',
    status: 'all',
    riskRating: 'all',
    sector: 'all',
    minValue: 0,
    maxValue: Infinity,
    sortBy: 'currentValue',
    sortDirection: 'desc'
  });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [viewportHeight, setViewportHeight] = useState(800);
  
  // Virtualization refs
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollElementRef = useRef<HTMLDivElement>(null);
  
  // Debounced search
  const debouncedSearch = useDebounce(filters.search, 300);
  
  // Calculate visible items for virtualization
  const visibleItemCount = Math.ceil(viewportHeight / itemHeight) + 2; // Buffer items
  const [scrollTop, setScrollTop] = useState(0);
  const startIndex = Math.floor(scrollTop / itemHeight);
  const endIndex = Math.min(startIndex + visibleItemCount, pageSize);

  // Memoized filtered and sorted assets
  const filteredAssets = useMemo(() => {
    if (!state.currentPortfolio) return [];
    
    let assets = [...state.currentPortfolio.assets];
    
    // Apply filters
    if (filters.assetType !== 'all') {
      assets = assets.filter(asset => asset.assetType === filters.assetType);
    }
    
    if (filters.status !== 'all') {
      assets = assets.filter(asset => asset.status === filters.status);
    }
    
    if (filters.riskRating !== 'all') {
      assets = assets.filter(asset => asset.riskRating === filters.riskRating);
    }
    
    if (filters.sector !== 'all') {
      assets = assets.filter(asset => asset.sector === filters.sector);
    }
    
    if (debouncedSearch) {
      const searchLower = debouncedSearch.toLowerCase();
      assets = assets.filter(asset => 
        asset.name.toLowerCase().includes(searchLower) ||
        asset.description?.toLowerCase().includes(searchLower) ||
        asset.tags.some(tag => tag.toLowerCase().includes(searchLower)) ||
        asset.sector?.toLowerCase().includes(searchLower)
      );
    }
    
    // Value range filter
    assets = assets.filter(asset => 
      asset.currentValue >= filters.minValue && 
      asset.currentValue <= filters.maxValue
    );
    
    // Apply sorting
    assets.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (filters.sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'currentValue':
          aValue = a.currentValue;
          bValue = b.currentValue;
          break;
        case 'irr':
          aValue = a.performance.irr;
          bValue = b.performance.irr;
          break;
        case 'moic':
          aValue = a.performance.moic;
          bValue = b.performance.moic;
          break;
        case 'acquisitionDate':
          aValue = new Date(a.acquisitionDate).getTime();
          bValue = new Date(b.acquisitionDate).getTime();
          break;
        default:
          return 0;
      }
      
      if (filters.sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
    
    return assets;
  }, [
    state.currentPortfolio?.assets, 
    filters.assetType, 
    filters.status, 
    filters.riskRating, 
    filters.sector,
    filters.minValue,
    filters.maxValue,
    filters.sortBy, 
    filters.sortDirection, 
    debouncedSearch
  ]);

  // Paginated assets
  const paginatedAssets = useMemo(() => {
    const startIdx = (currentPage - 1) * pageSize;
    const endIdx = startIdx + pageSize;
    return filteredAssets.slice(startIdx, endIdx);
  }, [filteredAssets, currentPage, pageSize]);

  // Virtualized visible assets
  const visibleAssets = useMemo(() => {
    return paginatedAssets.slice(startIndex, endIndex);
  }, [paginatedAssets, startIndex, endIndex]);

  // Calculate pagination info
  const totalPages = Math.ceil(filteredAssets.length / pageSize);
  const totalItems = filteredAssets.length;

  // Handle scroll for virtualization
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  // Update viewport height
  useEffect(() => {
    const updateViewportHeight = () => {
      if (containerRef.current) {
        setViewportHeight(containerRef.current.clientHeight);
      }
    };
    
    updateViewportHeight();
    window.addEventListener('resize', updateViewportHeight);
    return () => window.removeEventListener('resize', updateViewportHeight);
  }, []);

  // Helper functions
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

  const getAssetTypeColor = (assetType: AssetType) => {
    switch (assetType) {
      case 'traditional': return 'bg-blue-100 text-blue-800';
      case 'real_estate': return 'bg-green-100 text-green-800';
      case 'infrastructure': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRiskColor = (rating: string) => {
    switch (rating) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const updateFilter = (key: keyof AssetGridFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
    setCurrentPage(1); // Reset to first page when filtering
  };

  if (!state.currentPortfolio) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading assets...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Advanced Filters */}
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <Input
              placeholder="Search assets..."
              value={filters.search}
              onChange={(e) => updateFilter('search', e.target.value)}
            />
          </div>

          {/* Asset Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Asset Type</label>
            <select
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md"
              value={filters.assetType}
              onChange={(e) => updateFilter('assetType', e.target.value)}
            >
              <option value="all">All Types</option>
              <option value="traditional">Traditional</option>
              <option value="real_estate">Real Estate</option>
              <option value="infrastructure">Infrastructure</option>
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md"
              value={filters.status}
              onChange={(e) => updateFilter('status', e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="under_review">Under Review</option>
              <option value="exited">Exited</option>
              <option value="disposed">Disposed</option>
            </select>
          </div>

          {/* Risk Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Risk Level</label>
            <select
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md"
              value={filters.riskRating}
              onChange={(e) => updateFilter('riskRating', e.target.value)}
            >
              <option value="all">All Risk Levels</option>
              <option value="low">Low Risk</option>
              <option value="medium">Medium Risk</option>
              <option value="high">High Risk</option>
              <option value="critical">Critical Risk</option>
            </select>
          </div>

          {/* Sort By */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
            <select
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md"
              value={filters.sortBy}
              onChange={(e) => updateFilter('sortBy', e.target.value)}
            >
              <option value="currentValue">Current Value</option>
              <option value="name">Name</option>
              <option value="irr">IRR</option>
              <option value="moic">MOIC</option>
              <option value="acquisitionDate">Acquisition Date</option>
            </select>
          </div>

          {/* Sort Direction */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Direction</label>
            <select
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md"
              value={filters.sortDirection}
              onChange={(e) => updateFilter('sortDirection', e.target.value)}
            >
              <option value="desc">Descending</option>
              <option value="asc">Ascending</option>
            </select>
          </div>

          {/* Value Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Min Value ($M)</label>
            <Input
              type="number"
              placeholder="0"
              value={filters.minValue === 0 ? '' : filters.minValue / 1000000}
              onChange={(e) => updateFilter('minValue', (parseFloat(e.target.value) || 0) * 1000000)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Max Value ($M)</label>
            <Input
              type="number"
              placeholder="∞"
              value={filters.maxValue === Infinity ? '' : filters.maxValue / 1000000}
              onChange={(e) => updateFilter('maxValue', e.target.value ? parseFloat(e.target.value) * 1000000 : Infinity)}
            />
          </div>
        </div>
      </Card>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <p className="text-sm text-gray-600">
            Showing {((currentPage - 1) * pageSize) + 1}-{Math.min(currentPage * pageSize, totalItems)} of {totalItems} assets
          </p>
          <Badge variant="outline">{state.selectedAssets.length} selected</Badge>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => selectAssets(paginatedAssets.map(a => a.id))}
          >
            Select Page
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => selectAssets([])}
          >
            Clear All
          </Button>
        </div>
      </div>

      {/* Virtualized Asset Grid */}
      <div 
        ref={containerRef}
        className="h-[600px] overflow-auto border border-gray-200 rounded-lg"
        onScroll={handleScroll}
      >
        <div 
          style={{ 
            height: paginatedAssets.length * itemHeight,
            position: 'relative'
          }}
        >
          <div
            style={{
              transform: `translateY(${startIndex * itemHeight}px)`,
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
            }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
              {visibleAssets.map((asset, index) => (
                <Card
                  key={asset.id}
                  className={`p-4 cursor-pointer transition-all hover:shadow-md ${
                    state.selectedAssets.includes(asset.id)
                      ? 'ring-2 ring-blue-500 bg-blue-50'
                      : 'hover:bg-gray-50'
                  }`}
                  style={{ height: itemHeight - 16 }} // Account for gap
                  onClick={() => toggleAssetSelection(asset.id)}
                >
                  {/* Asset Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-gray-900 truncate">
                        {asset.name}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1">
                        {asset.location.city}, {asset.location.country}
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={state.selectedAssets.includes(asset.id)}
                      onChange={() => toggleAssetSelection(asset.id)}
                      className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    />
                  </div>

                  {/* Asset Badges */}
                  <div className="flex items-center space-x-2 mb-3">
                    <Badge className={getAssetTypeColor(asset.assetType)} size="sm">
                      {asset.assetType.replace('_', ' ')}
                    </Badge>
                    <Badge className={getRiskColor(asset.riskRating)} size="sm">
                      {asset.riskRating}
                    </Badge>
                  </div>

                  {/* Financial Metrics */}
                  <div className="space-y-2 mb-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-600">Value</span>
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

                  {/* ESG Score */}
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200">
                    <span className="text-xs text-gray-600">ESG Score</span>
                    <span className="text-xs font-medium text-gray-900">
                      {asset.esgMetrics.overallScore.toFixed(1)}/10
                    </span>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            >
              Previous
            </Button>
            
            <div className="flex items-center space-x-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const page = i + 1;
                return (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </Button>
                );
              })}
              
              {totalPages > 5 && (
                <>
                  <span className="text-gray-500">...</span>
                  <Button
                    variant={currentPage === totalPages ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(totalPages)}
                  >
                    {totalPages}
                  </Button>
                </>
              )}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            >
              Next
            </Button>
          </div>
          
          <div className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </div>
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