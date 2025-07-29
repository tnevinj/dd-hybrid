'use client';

import React, { useState, useEffect } from 'react';
import { UnifiedPortfolioProvider, useUnifiedPortfolio } from './contexts/UnifiedPortfolioContext';
import { PortfolioConfig, AssetType, DashboardTab, MetricsModule } from '@/types/portfolio';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

// Portfolio-specific components
import { PortfolioOverview } from './common/PortfolioOverview';
import { PortfolioPerformance } from './common/PortfolioPerformance';
import { VirtualizedAssetGrid } from './common/VirtualizedAssetGrid';
import { ProfessionalAnalytics } from './common/ProfessionalAnalytics';
import { ProfessionalReporting } from './common/ProfessionalReporting';
import { CapitalManagement } from './common/CapitalManagement';
import { MarketIntelligence } from './common/MarketIntelligence';
import { PortfolioOptimization } from './common/PortfolioOptimization';
import { RiskManagement } from './common/RiskManagement';
import { TeamCollaboration } from './common/TeamCollaboration';
import { CustomDashboard } from './common/CustomDashboard';

// Asset-type specific components
import { TraditionalAssetsView } from './asset-types/TraditionalAssetsView';
import { RealEstateAssetsView } from './asset-types/RealEstateAssetsView';
import { InfrastructureAssetsView } from './asset-types/InfrastructureAssetsView';

interface UnifiedPortfolioManagerProps {
  assetType?: AssetType;
  portfolioId?: string;
  config?: Partial<PortfolioConfig>;
}

// Default configuration for unified portfolio management
const defaultConfig: PortfolioConfig = {
  dashboardTabs: [
    {
      id: 'overview',
      label: 'Overview',
      component: 'PortfolioOverview',
      icon: '📊',
      order: 1,
    },
    {
      id: 'performance',
      label: 'Performance',
      component: 'PortfolioPerformance',
      icon: '📈',
      order: 2,
    },
    {
      id: 'assets',
      label: 'Assets',
      component: 'VirtualizedAssetGrid',
      icon: '🏢',
      order: 3,
    },
    {
      id: 'traditional',
      label: 'Traditional',
      component: 'TraditionalAssetsView',
      icon: '💼',
      order: 4,
      requiredAssetTypes: ['traditional'],
    },
    {
      id: 'real-estate',
      label: 'Real Estate',
      component: 'RealEstateAssetsView',
      icon: '🏠',
      order: 5,
      requiredAssetTypes: ['real_estate'],
    },
    {
      id: 'infrastructure',
      label: 'Infrastructure',
      component: 'InfrastructureAssetsView',
      icon: '🏗️',
      order: 6,
      requiredAssetTypes: ['infrastructure'],
    },
    {
      id: 'analytics',
      label: 'Analytics',
      component: 'ProfessionalAnalytics',
      icon: '📊',
      order: 7,
    },
    {
      id: 'reporting',
      label: 'Reports',
      component: 'ProfessionalReporting',
      icon: '📄',
      order: 8,
    },
    {
      id: 'capital',
      label: 'Capital Management',
      component: 'CapitalManagement',
      icon: '💰',
      order: 9,
    },
    {
      id: 'market',
      label: 'Market Intelligence',
      component: 'MarketIntelligence',
      icon: '📰',
      order: 10,
    },
    {
      id: 'optimization',
      label: 'Optimization',
      component: 'PortfolioOptimization',
      icon: '⚡',
      order: 11,
    },
    {
      id: 'risk',
      label: 'Risk Management',
      component: 'RiskManagement',
      icon: '⚠️',
      order: 12,
    },
    {
      id: 'collaboration',
      label: 'Team',
      component: 'TeamCollaboration',
      icon: '👥',
      order: 13,
    },
    {
      id: 'dashboard',
      label: 'Custom Dashboard',
      component: 'CustomDashboard',
      icon: '🎛️',
      order: 14,
    },
  ],
  metricsModules: [
    {
      id: 'total-value',
      name: 'Total Portfolio Value',
      component: 'TotalValueCard',
      assetTypes: ['traditional', 'real_estate', 'infrastructure'],
      order: 1,
      size: 'medium',
    },
    {
      id: 'performance-metrics',
      name: 'Performance Metrics',
      component: 'PerformanceMetricsCard',
      assetTypes: ['traditional', 'real_estate', 'infrastructure'],
      order: 2,
      size: 'large',
    },
    {
      id: 'allocation',
      name: 'Asset Allocation',
      component: 'AllocationCard',
      assetTypes: ['traditional', 'real_estate', 'infrastructure'],
      order: 3,
      size: 'medium',
    },
  ],
  analyticsFeatures: [
    {
      id: 'cross-asset-analysis',
      name: 'Cross-Asset Analysis',
      description: 'Compare performance across different asset types',
      component: 'CrossAssetAnalysis',
      requiredData: ['performance', 'allocation'],
      supportedAssetTypes: ['traditional', 'real_estate', 'infrastructure'],
    },
    {
      id: 'esg-scoring',
      name: 'ESG Scoring',
      description: 'Environmental, Social, and Governance metrics',
      component: 'ESGScoring',
      requiredData: ['esgMetrics'],
      supportedAssetTypes: ['traditional', 'real_estate', 'infrastructure'],
    },
  ],
};

function PortfolioManagerContent() {
  const { state, config, analytics, loadPortfolios, selectPortfolio } = useUnifiedPortfolio();
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedAssetType, setSelectedAssetType] = useState<AssetType | 'all'>('all');

  console.log('PortfolioManagerContent render - state:', {
    loading: state.loading,
    error: state.error,
    portfoliosCount: state.portfolios.length,
    currentPortfolio: state.currentPortfolio?.name,
    analytics: !!analytics
  });

  // Portfolio loading and selection is handled by the context provider

  // Filter dashboard tabs based on available asset types in current portfolio
  const getAvailableTabs = (): DashboardTab[] => {
    if (!state.currentPortfolio) return config.dashboardTabs;

    const portfolioAssetTypes = [...new Set(state.currentPortfolio.assets.map(asset => asset.assetType))];
    
    return config.dashboardTabs.filter(tab => {
      if (!tab.requiredAssetTypes) return true;
      return tab.requiredAssetTypes.some(type => portfolioAssetTypes.includes(type));
    });
  };

  // Render tab content based on active tab
  const renderTabContent = () => {
    const activeTabConfig = config.dashboardTabs.find(tab => tab.id === activeTab);
    if (!activeTabConfig) return null;

    switch (activeTabConfig.component) {
      case 'PortfolioOverview':
        return <PortfolioOverview />;
      case 'PortfolioPerformance':
        return <PortfolioPerformance />;
      case 'VirtualizedAssetGrid':
        return <VirtualizedAssetGrid assetType={selectedAssetType === 'all' ? undefined : selectedAssetType} />;
      case 'TraditionalAssetsView':
        return <TraditionalAssetsView />;
      case 'RealEstateAssetsView':
        return <RealEstateAssetsView />;
      case 'InfrastructureAssetsView':
        return <InfrastructureAssetsView />;
      case 'ProfessionalAnalytics':
        return <ProfessionalAnalytics />;
      case 'ProfessionalReporting':
        return <ProfessionalReporting />;
      case 'CapitalManagement':
        return <CapitalManagement />;
      case 'MarketIntelligence':
        return <MarketIntelligence />;
      case 'PortfolioOptimization':
        return <PortfolioOptimization />;
      case 'RiskManagement':
        return <RiskManagement />;
      case 'TeamCollaboration':
        return <TeamCollaboration />;
      case 'CustomDashboard':
        return <CustomDashboard />;
      default:
        return <div>Component not found: {activeTabConfig.component}</div>;
    }
  };

  const availableTabs = getAvailableTabs();

  return (
    <div className="p-6 space-y-6">
      {/* Header - Following dd-hybrid pattern */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Portfolio Management</h1>
          <p className="text-gray-600">
            {state.currentPortfolio ? 
              `${state.currentPortfolio.name} • ${state.currentPortfolio.assets.length} assets` :
              'Manage your investment portfolio across asset classes'
            }
          </p>
        </div>
        <div className="flex items-center space-x-4">
          {/* Portfolio Selector */}
          {state.portfolios.length > 0 && (
            <select
              className="px-3 py-2 text-sm border border-gray-300 rounded-md"
              value={state.currentPortfolio?.id || ''}
              onChange={(e) => e.target.value && selectPortfolio(e.target.value)}
            >
              <option value="">Select Portfolio</option>
              {state.portfolios.map(portfolio => (
                <option key={portfolio.id} value={portfolio.id}>
                  {portfolio.name}
                </option>
              ))}
            </select>
          )}
          <Button size="sm">Add Asset</Button>
        </div>
      </div>

      {/* Portfolio Summary Cards - If portfolio is selected */}
      {state.currentPortfolio && analytics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${analytics.totalPortfolioValue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                +{((analytics.unrealizedGains / analytics.totalInvested) * 100).toFixed(1)}% unrealized
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">IRR</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{(analytics.weightedIRR * 100).toFixed(1)}%</div>
              <p className="text-xs text-muted-foreground">
                {analytics.benchmarkComparison.outperformance >= 0 ? '+' : ''}
                {(analytics.benchmarkComparison.outperformance * 100).toFixed(1)}% vs benchmark
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">MOIC</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.weightedMOIC.toFixed(1)}x</div>
              <p className="text-xs text-muted-foreground">
                Money-on-money multiple
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">ESG Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.esgScore.toFixed(1)}/10</div>
              <p className="text-xs text-muted-foreground">
                Environmental, Social, Governance
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Navigation Tabs */}
      {state.currentPortfolio && (
        <Card>
          <CardContent className="p-0">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6">
                {availableTabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <span className="mr-2">{tab.icon}</span>
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Content */}
      {state.loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading portfolio data...</p>
          </div>
        </div>
      ) : state.error ? (
        <Card>
          <CardContent className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="text-red-500 text-xl mb-2">⚠️</div>
              <p className="text-red-600 mb-4">{state.error}</p>
              <Button onClick={() => loadPortfolios()}>
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : !state.currentPortfolio ? (
        <Card>
          <CardContent className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="text-gray-400 text-xl mb-2">📊</div>
              <p className="text-gray-600 mb-4">No portfolio data available</p>
              <Button>Create Portfolio</Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        renderTabContent()
      )}
    </div>
  );
}

export function UnifiedPortfolioManager({ 
  assetType, 
  portfolioId, 
  config = {} 
}: UnifiedPortfolioManagerProps) {
  const mergedConfig: PortfolioConfig = {
    ...defaultConfig,
    ...config,
    assetType,
  };

  return (
    <UnifiedPortfolioProvider config={mergedConfig} initialPortfolioId={portfolioId}>
      <PortfolioManagerContent />
    </UnifiedPortfolioProvider>
  );
}