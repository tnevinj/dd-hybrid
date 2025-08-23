'use client';

import React from 'react';
import { HybridPortfolioRefactored } from '@/components/portfolio/HybridPortfolioRefactored';
import { ErrorBoundary } from '@/components/portfolio/ErrorBoundary';
import { UnifiedPortfolioProvider } from '@/components/portfolio/contexts/UnifiedPortfolioContext';
import { PortfolioConfig } from '@/types/portfolio';

// Default portfolio configuration
const portfolioConfig: PortfolioConfig = {
  dashboardTabs: [
    { id: 'overview', label: 'Overview', component: 'PortfolioOverview', order: 1 },
    { id: 'assets', label: 'Assets', component: 'AssetGrid', order: 2 },
    { id: 'performance', label: 'Performance', component: 'PortfolioPerformance', order: 3 },
    { id: 'analytics', label: 'Analytics', component: 'PortfolioAnalytics', order: 4 },
    { id: 'reports', label: 'Reports', component: 'ProfessionalReporting', order: 5 }
  ],
  metricsModules: [
    { id: 'value', name: 'Portfolio Value', component: 'ValueMetrics', assetTypes: ['traditional', 'real_estate', 'infrastructure'], order: 1 },
    { id: 'performance', name: 'Performance', component: 'PerformanceMetrics', assetTypes: ['traditional', 'real_estate', 'infrastructure'], order: 2 },
    { id: 'allocation', name: 'Allocation', component: 'AllocationMetrics', assetTypes: ['traditional', 'real_estate', 'infrastructure'], order: 3 },
    { id: 'risk', name: 'Risk', component: 'RiskMetrics', assetTypes: ['traditional', 'real_estate', 'infrastructure'], order: 4 }
  ],
  analyticsFeatures: [
    { id: 'performance', name: 'Performance Analytics', description: 'Comprehensive performance analysis', component: 'PerformanceAnalytics', requiredData: ['performance', 'valuation'], supportedAssetTypes: ['traditional', 'real_estate', 'infrastructure'] },
    { id: 'risk', name: 'Risk Analysis', description: 'Advanced risk assessment', component: 'RiskAnalysis', requiredData: ['risk', 'volatility'], supportedAssetTypes: ['traditional', 'real_estate', 'infrastructure'] },
    { id: 'esg', name: 'ESG Reporting', description: 'Environmental, Social, Governance metrics', component: 'ESGReporting', requiredData: ['esg', 'sustainability'], supportedAssetTypes: ['traditional', 'real_estate', 'infrastructure'] }
  ],
  defaultFilters: {
    assetType: ['traditional', 'real_estate', 'infrastructure'],
    status: ['active'],
    riskRating: ['low', 'medium', 'high']
  }
};

export default function PortfolioPage() {
  return (
    <ErrorBoundary>
      <UnifiedPortfolioProvider config={portfolioConfig}>
        <HybridPortfolioRefactored />
      </UnifiedPortfolioProvider>
    </ErrorBoundary>
  );
}
