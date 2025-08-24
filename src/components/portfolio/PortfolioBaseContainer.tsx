'use client';

import React from 'react';
import { HierarchicalLayout } from './layouts/HierarchicalLayout';
import { getModuleGroups } from '@/lib/portfolio-modules';
import { UnifiedPortfolioProvider } from './contexts/UnifiedPortfolioContext';
import { PortfolioConfig } from '@/types/portfolio';

interface PortfolioBaseContainerProps {
  mode: 'traditional' | 'assisted' | 'autonomous';
  onViewAsset?: (assetId: string) => void;
  onEditAsset?: (assetId: string) => void;
  onCreateAsset?: () => void;
  className?: string;
  children?: React.ReactNode;
  metrics?: any;
}

export function PortfolioBaseContainer({
  mode,
  onViewAsset,
  onEditAsset,
  onCreateAsset,
  className = "",
  children,
  metrics = null
}: PortfolioBaseContainerProps) {
  const moduleGroups = getModuleGroups(mode);

  // Default configuration for portfolio management
  const defaultConfig: PortfolioConfig = {
    dashboardTabs: [],
    metricsModules: [],
    analyticsFeatures: []
  };

  return (
    <UnifiedPortfolioProvider config={defaultConfig} externalMetrics={metrics}>
      <div className={`min-h-screen bg-gray-50 ${className}`}>
        <div className="p-6">
          {/* Render any custom header/content */}
          {children}
          
          {/* Hierarchical Module Layout */}
          <HierarchicalLayout
            groups={moduleGroups}
            onViewAsset={onViewAsset || (() => {})}
            onEditAsset={onEditAsset || (() => {})}
            onCreateAsset={onCreateAsset || (() => {})}
          />
        </div>
      </div>
    </UnifiedPortfolioProvider>
  );
}

export default PortfolioBaseContainer;
