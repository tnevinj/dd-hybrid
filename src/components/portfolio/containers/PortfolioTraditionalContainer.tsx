'use client';

import React from 'react';
import { HierarchicalLayout } from '../layouts/HierarchicalLayout';
import { getModuleGroups } from '@/lib/portfolio-modules';
import { UnifiedPortfolioProvider } from '../contexts/UnifiedPortfolioContext';
import { PortfolioConfig } from '@/types/portfolio';

interface PortfolioTraditionalContainerProps {
  onViewAsset?: (assetId: string) => void;
  onEditAsset?: (assetId: string) => void;
  onCreateAsset?: () => void;
}

export function PortfolioTraditionalContainer({
  onViewAsset,
  onEditAsset,
  onCreateAsset
}: PortfolioTraditionalContainerProps) {
  const moduleGroups = getModuleGroups('traditional');

  // Default configuration for traditional portfolio management
  const defaultConfig: PortfolioConfig = {
    dashboardTabs: [],
    metricsModules: [],
    analyticsFeatures: []
  };

  return (
    <UnifiedPortfolioProvider config={defaultConfig}>
      <div className="max-w-7xl mx-auto">
        {/* Mode Features */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
              <span className="text-sm font-medium text-gray-700">Full Manual Control</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
              <span className="text-sm font-medium text-gray-700">All Asset Types</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
              <span className="text-sm font-medium text-gray-700">Standard Analytics</span>
            </div>
          </div>
        </div>

        {/* Hierarchical Module Layout */}
        <HierarchicalLayout
          groups={moduleGroups}
          onViewAsset={onViewAsset || (() => {})}
          onEditAsset={onEditAsset || (() => {})}
          onCreateAsset={onCreateAsset || (() => {})}
        />

        {/* Traditional Mode Features Info */}
        <div className="mt-8 p-4 bg-gray-100 border border-gray-200 rounded-lg">
          <h3 className="font-medium text-gray-900 mb-2">Traditional Mode Capabilities</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Complete manual control over all portfolio decisions</li>
            <li>• Access to all asset types: Traditional, Real Estate, and Infrastructure</li>
            <li>• Standard analytics and reporting capabilities</li>
            <li>• Expert-driven insights and analysis</li>
          </ul>
        </div>
      </div>
    </UnifiedPortfolioProvider>
  );
}

export default PortfolioTraditionalContainer;
