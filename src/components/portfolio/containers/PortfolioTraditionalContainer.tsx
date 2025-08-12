'use client';

import React from 'react';
import { HierarchicalLayout } from '../layouts/HierarchicalLayout';
import { getModuleGroups } from '@/lib/portfolio-modules';

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

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Traditional Mode Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Portfolio Management - Traditional Mode
          </h1>
          <p className="text-gray-600">
            Manual control over all portfolio operations with comprehensive asset management tools.
          </p>
        </div>

        {/* Mode Features */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium text-gray-700">Full Manual Control</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium text-gray-700">All Asset Types</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium text-gray-700">Standard Analytics</span>
            </div>
          </div>
        </div>

        {/* Hierarchical Module Layout */}
        <HierarchicalLayout
          groups={moduleGroups}
          onViewAsset={onViewAsset}
          onEditAsset={onEditAsset}
          onCreateAsset={onCreateAsset}
        />

        {/* Help Text */}
        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-medium text-blue-900 mb-2">Traditional Mode Features</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Complete manual control over all portfolio decisions</li>
            <li>• Access to all asset types: Traditional, Real Estate, and Infrastructure</li>
            <li>• Standard analytics and reporting capabilities</li>
            <li>• No AI assistance - all insights are user-generated</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default PortfolioTraditionalContainer;