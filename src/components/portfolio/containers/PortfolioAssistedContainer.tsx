'use client';

import React from 'react';
import { HierarchicalLayout } from '../layouts/HierarchicalLayout';
import { getModuleGroups } from '@/lib/portfolio-modules';
import { Badge } from '@/components/ui/badge';
import { Brain, TrendingUp, Shield, Target } from 'lucide-react';
import { UnifiedPortfolioProvider } from '../contexts/UnifiedPortfolioContext';
import { PortfolioConfig } from '@/types/portfolio';

interface PortfolioAssistedContainerProps {
  onViewAsset?: (assetId: string) => void;
  onEditAsset?: (assetId: string) => void;
  onCreateAsset?: () => void;
}

export function PortfolioAssistedContainer({
  onViewAsset,
  onEditAsset,
  onCreateAsset
}: PortfolioAssistedContainerProps) {
  const moduleGroups = getModuleGroups('assisted');

  // Default configuration for assisted portfolio management
  const defaultConfig: PortfolioConfig = {
    dashboardTabs: [],
    metricsModules: [],
    analyticsFeatures: []
  };

  return (
    <UnifiedPortfolioProvider config={defaultConfig}>
      <div className="p-6 bg-gradient-to-br from-purple-50 to-blue-50 min-h-screen">
        <div className="max-w-7xl mx-auto">
        {/* Assisted Mode Header */}
        <div className="mb-6">
          <div className="flex items-center space-x-3 mb-3">
            <Brain className="w-8 h-8 text-purple-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                AI-Assisted Portfolio Management
              </h1>
              <p className="text-gray-600">
                Intelligent recommendations with human oversight and approval.
              </p>
            </div>
            <Badge className="bg-purple-100 text-purple-800 border border-purple-300">
              AI-Enhanced
            </Badge>
          </div>
        </div>

        {/* AI Features Overview */}
        <div className="bg-white rounded-lg border border-purple-200 p-6 mb-6">
          <h3 className="font-semibold text-gray-900 mb-4">AI-Powered Capabilities</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
              <TrendingUp className="w-5 h-5 text-purple-600" />
              <div>
                <div className="font-medium text-sm text-gray-900">Performance Analysis</div>
                <div className="text-xs text-gray-600">AI-driven insights</div>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
              <Shield className="w-5 h-5 text-blue-600" />
              <div>
                <div className="font-medium text-sm text-gray-900">Risk Management</div>
                <div className="text-xs text-gray-600">Automated assessment</div>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
              <Target className="w-5 h-5 text-green-600" />
              <div>
                <div className="font-medium text-sm text-gray-900">Optimization</div>
                <div className="text-xs text-gray-600">Smart rebalancing</div>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-orange-50 rounded-lg">
              <Brain className="w-5 h-5 text-orange-600" />
              <div>
                <div className="font-medium text-sm text-gray-900">Market Intelligence</div>
                <div className="text-xs text-gray-600">Real-time analysis</div>
              </div>
            </div>
          </div>
        </div>

        {/* AI Status */}
        <div className="bg-white rounded-lg border border-green-200 p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="font-medium text-gray-900">AI Assistant Active</span>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                Analyzing Portfolio
              </Badge>
            </div>
            <div className="text-sm text-gray-500">
              Last analysis: 2 minutes ago
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            AI is continuously monitoring your portfolio and generating insights. All recommendations require your approval.
          </p>
        </div>

        {/* Hierarchical Module Layout */}
        <HierarchicalLayout
          groups={moduleGroups}
          onViewAsset={onViewAsset}
          onEditAsset={onEditAsset}
          onCreateAsset={onCreateAsset}
        />

        {/* Help Text */}
        <div className="mt-8 p-4 bg-purple-50 border border-purple-200 rounded-lg">
          <h3 className="font-medium text-purple-900 mb-2">Assisted Mode Features</h3>
          <ul className="text-sm text-purple-700 space-y-1">
            <li>• AI-powered insights and recommendations with human approval</li>
            <li>• Advanced risk assessment and portfolio optimization</li>
            <li>• Real-time market intelligence and trend analysis</li>
            <li>• Intelligent asset allocation suggestions</li>
            <li>• Enhanced analytics with predictive modeling</li>
            <li>• All AI recommendations require your explicit approval</li>
          </ul>
        </div>
      </div>
    </div>
    </UnifiedPortfolioProvider>
  );
}

export default PortfolioAssistedContainer;