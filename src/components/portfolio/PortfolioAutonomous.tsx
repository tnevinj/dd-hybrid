'use client';

import React, { useState } from 'react';
import { ChatInterface, ProjectSelector, ContextPanel } from '@/components/autonomous';
import { useAutonomousStore } from '@/lib/stores/autonomousStore';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Settings, Menu, X } from 'lucide-react';

interface Project {
  id: string;
  name: string;
  type: 'portfolio' | 'deal' | 'company' | 'report' | 'analysis';
  status: 'active' | 'completed' | 'draft' | 'review';
  lastActivity: Date;
  priority: 'high' | 'medium' | 'low';
  unreadMessages?: number;
  metadata?: {
    value?: string;
    progress?: number;
    team?: string[];
  };
}

interface PortfolioAutonomousProps {
  onSwitchMode?: (mode: 'traditional' | 'assisted' | 'autonomous') => void;
}

export function PortfolioAutonomous({ onSwitchMode }: PortfolioAutonomousProps) {
  const {
    selectedProject,
    projects,
    selectProject,
    setActiveProjectType,
    sidebarCollapsed,
    contextPanelCollapsed,
    toggleSidebar,
    toggleContextPanel,
    refreshProjectsFromUnifiedData
  } = useAutonomousStore();

  const [showSettings, setShowSettings] = useState(false);

  // Initialize project type for portfolio and refresh data
  React.useEffect(() => {
    setActiveProjectType('portfolio');
    refreshProjectsFromUnifiedData(); // Ensure we have latest unified data
  }, [setActiveProjectType, refreshProjectsFromUnifiedData]);

  const handleProjectSelect = (project: Project) => {
    selectProject(project);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleSidebar}
              className="lg:hidden"
            >
              {sidebarCollapsed ? <Menu className="w-4 h-4" /> : <X className="w-4 h-4" />}
            </Button>
            
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                Autonomous Portfolio
              </h1>
              <p className="text-sm text-gray-500">
                {selectedProject ? selectedProject.name : 'Select a portfolio to get started'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              AI Optimizing
            </Badge>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => onSwitchMode?.('assisted')}
            >
              Switch Mode
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSettings(!showSettings)}
            >
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Layout */}
      <div className="flex flex-1 pt-16">
        {/* Project Selector Sidebar */}
        {!sidebarCollapsed && (
          <ProjectSelector
            projectType="portfolio"
            selectedProjectId={selectedProject?.id}
            onProjectSelect={handleProjectSelect}
          />
        )}

        {/* Chat Interface */}
        <div className="flex-1">
          <ChatInterface
            projectId={selectedProject?.id}
            projectName={selectedProject?.name}
            projectType="portfolio"
            contextData={selectedProject?.metadata}
            systemPrompt={selectedProject ? `You are an AI assistant specializing in portfolio management. You're working on ${selectedProject.name}, focusing on performance optimization and strategic asset allocation.

Your capabilities include:
- Portfolio performance analysis and optimization
- Asset allocation recommendations
- Risk assessment and diversification strategies
- Market trend analysis and insights
- Performance benchmarking and reporting

Provide actionable insights while maintaining transparency about your reasoning and confidence levels.` : undefined}
            availableActions={[
              {
                id: 'portfolio-analysis',
                label: 'Portfolio Analysis',
                description: 'Comprehensive portfolio performance review',
                category: 'analysis'
              },
              {
                id: 'risk-assessment',
                label: 'Risk Assessment',
                description: 'Evaluate portfolio risk metrics',
                category: 'analysis'
              },
              {
                id: 'rebalancing',
                label: 'Rebalancing Recommendations',
                description: 'Optimize asset allocation',
                category: 'optimization'
              }
            ]}
          />
        </div>

        {/* Context Panel */}
        {!contextPanelCollapsed && (
          <ContextPanel
            project={selectedProject || undefined}
            projectType="portfolio"
          />
        )}
      </div>
    </div>
  );
}

export default PortfolioAutonomous;