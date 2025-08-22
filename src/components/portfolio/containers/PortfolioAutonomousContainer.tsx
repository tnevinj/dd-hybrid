'use client';

import React from 'react';
import { HierarchicalLayout } from '../layouts/HierarchicalLayout';
import { getModuleGroups } from '@/lib/portfolio-modules';
import { Badge } from '@/components/ui/badge';
import { Bot, Zap, Globe, Users, Settings, Activity } from 'lucide-react';
import { UnifiedPortfolioProvider } from '../contexts/UnifiedPortfolioContext';
import { PortfolioConfig } from '@/types/portfolio';

interface PortfolioAutonomousContainerProps {
  onViewAsset?: (assetId: string) => void;
  onEditAsset?: (assetId: string) => void;
  onCreateAsset?: () => void;
}

export function PortfolioAutonomousContainer({
  onViewAsset,
  onEditAsset,
  onCreateAsset
}: PortfolioAutonomousContainerProps) {
  const moduleGroups = getModuleGroups('autonomous');

  // Default configuration for autonomous portfolio management
  const defaultConfig: PortfolioConfig = {
    dashboardTabs: [],
    metricsModules: [],
    analyticsFeatures: []
  };

  return (
    <UnifiedPortfolioProvider config={defaultConfig}>
      <div className="p-6 bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 min-h-screen">
        <div className="max-w-7xl mx-auto">
        {/* Autonomous Mode Header */}
        <div className="mb-6">
          <div className="flex items-center space-x-3 mb-3">
            <Bot className="w-8 h-8 text-green-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Autonomous Portfolio Command Center
              </h1>
              <p className="text-gray-600">
                Full AI automation with comprehensive enterprise features and intelligent decision-making.
              </p>
            </div>
            <Badge className="bg-green-100 text-green-800 border border-green-300 animate-pulse">
              AI Autonomous
            </Badge>
          </div>
        </div>

        {/* Autonomous AI Status Dashboard */}
        <div className="bg-white rounded-lg border border-green-200 p-6 mb-6 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-4">Autonomous AI Operations</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg border border-green-200">
              <Activity className="w-5 h-5 text-green-600" />
              <div>
                <div className="font-medium text-sm text-gray-900">Real-time Monitoring</div>
                <div className="text-xs text-green-600">Active • 24/7</div>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <Zap className="w-5 h-5 text-blue-600" />
              <div>
                <div className="font-medium text-sm text-gray-900">Auto-Optimization</div>
                <div className="text-xs text-blue-600">Last run: 1m ago</div>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
              <Globe className="w-5 h-5 text-purple-600" />
              <div>
                <div className="font-medium text-sm text-gray-900">Market Intelligence</div>
                <div className="text-xs text-purple-600">Analyzing trends</div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-gray-900">AI Operating at Full Capacity</span>
            </div>
            <div className="flex space-x-2">
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300 text-xs">
                98% Efficiency
              </Badge>
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300 text-xs">
                Real-time
              </Badge>
            </div>
          </div>
        </div>

        {/* Enterprise Features Overview */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <h3 className="font-semibold text-gray-900 mb-4">Enterprise Capabilities</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-3">
              <Bot className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <div className="font-medium text-sm text-gray-900">Autonomous Operations</div>
              <div className="text-xs text-gray-600 mt-1">Self-managing portfolio</div>
            </div>
            <div className="text-center p-3">
              <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <div className="font-medium text-sm text-gray-900">Team Collaboration</div>
              <div className="text-xs text-gray-600 mt-1">Multi-user workflows</div>
            </div>
            <div className="text-center p-3">
              <Settings className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <div className="font-medium text-sm text-gray-900">Custom Dashboards</div>
              <div className="text-xs text-gray-600 mt-1">Personalized views</div>
            </div>
            <div className="text-center p-3">
              <Zap className="w-8 h-8 text-orange-600 mx-auto mb-2" />
              <div className="font-medium text-sm text-gray-900">Advanced Analytics</div>
              <div className="text-xs text-gray-600 mt-1">Predictive modeling</div>
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
        <div className="mt-8 p-4 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg">
          <h3 className="font-medium text-green-900 mb-2">Autonomous Mode Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ul className="text-sm text-green-700 space-y-1">
              <li>• Full AI automation with intelligent decision-making</li>
              <li>• Continuous portfolio monitoring and optimization</li>
              <li>• Advanced predictive analytics and modeling</li>
              <li>• Real-time market intelligence and trend analysis</li>
            </ul>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Enterprise team collaboration tools</li>
              <li>• Custom dashboard and reporting capabilities</li>
              <li>• Advanced capital management features</li>
              <li>• Comprehensive risk management suite</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    </UnifiedPortfolioProvider>
  );
}

export default PortfolioAutonomousContainer;