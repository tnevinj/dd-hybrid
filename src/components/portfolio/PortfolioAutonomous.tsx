'use client';

import React, { useState } from 'react';
import { ChatInterface, ProjectSelector, ContextPanel } from '@/components/autonomous';
import { useAutonomousStore } from '@/lib/stores/autonomousStore';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Settings, Menu, X } from 'lucide-react';
import { PortfolioAutonomousContainer } from './containers/PortfolioAutonomousContainer';

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
    loadPortfolioProjects
  } = useAutonomousStore();

  const [showSettings, setShowSettings] = useState(false);

  // Initialize project type for portfolio and load real data
  React.useEffect(() => {
    setActiveProjectType('portfolio');
    loadPortfolioProjects(); // Load real portfolio data from SQLite backend
  }, [setActiveProjectType, loadPortfolioProjects]);

  const handleProjectSelect = (project: Project) => {
    selectProject(project);
  };

  // If no project selected, show project-based autonomous interface
  if (!selectedProject) {
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
                  Select a portfolio to get started
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                AI Ready
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

          {/* Empty State */}
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Portfolio</h3>
              <p className="text-gray-500">Choose a portfolio from the sidebar to begin autonomous management.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Project selected - show full autonomous interface with hierarchical layout
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
                Autonomous Portfolio: {selectedProject.name}
              </h1>
              <p className="text-sm text-gray-500">
                AI-powered comprehensive portfolio management
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
          <div className="w-80 border-r border-gray-200">
            <ProjectSelector
              projectType="portfolio"
              selectedProjectId={selectedProject?.id}
              onProjectSelect={handleProjectSelect}
            />
          </div>
        )}

        {/* Autonomous Portfolio Container */}
        <div className="flex-1 overflow-auto">
          <PortfolioAutonomousContainer />
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