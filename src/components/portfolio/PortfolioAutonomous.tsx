'use client';

import React, { useState } from 'react';
import { ChatInterface, ProjectSelector, ContextPanel } from '@/components/autonomous';
import { AutonomousLayout } from '@/components/autonomous/AutonomousLayout';
import { AutonomousNavMenu } from '@/components/autonomous/AutonomousNavMenu';
import { AutonomousBreadcrumb } from '@/components/autonomous/AutonomousBreadcrumb';
import { useNavigationStoreRefactored } from '@/stores/navigation-store-refactored';
import { useAutonomousMode } from '@/hooks/useAutonomousMode';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Settings, Menu, X } from 'lucide-react';
import { PortfolioAutonomousContainer } from './containers/PortfolioAutonomousContainer';
import { getAutonomousConfig, generateMockProjects, getAvailableActions, generateContextData } from '@/lib/autonomous-mode-config';
import type { HybridMode } from '@/components/shared';

interface PortfolioAutonomousProps {
  onSwitchMode?: (mode: HybridMode) => void;
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
  } = useNavigationStoreRefactored();

  const [showSettings, setShowSettings] = useState(false);
  const { exitAutonomous, navigateToModule } = useAutonomousMode();

  // Initialize project type for portfolio using standardized config
  React.useEffect(() => {
    setActiveProjectType('portfolio');
    
    // Generate mock projects using standardized configuration
    const mockProjects = generateMockProjects('portfolio', 5);
    setPortfolioProjects(mockProjects);
  }, [setActiveProjectType, setPortfolioProjects]);

  const handleProjectSelect = (project: Project) => {
    selectProject(project);
  };

  // If no project selected, show project-based autonomous interface
  if (!selectedProject) {
    return (
      <AutonomousLayout>
        {/* Header */}
        <div className="autonomous-header px-4 py-3">
          <div className="flex items-center justify-between min-h-[56px]">
            <div className="flex items-center space-x-2 sm:space-x-4 flex-1 min-w-0">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleSidebar}
                className="lg:hidden flex-shrink-0"
                aria-label="Toggle sidebar"
              >
                {sidebarCollapsed ? <Menu className="w-4 h-4" /> : <X className="w-4 h-4" />}
              </Button>
              
              {/* Navigation Menu */}
              <AutonomousNavMenu 
                currentModule="portfolio"
                onNavigate={(moduleId) => {
                  const moduleRoutes: Record<string, string> = {
                    dashboard: '/dashboard',
                    workspaces: '/workspaces',
                    'due-diligence': '/due-diligence',
                    portfolio: '/portfolio',
                    'deal-screening': '/deal-screening',
                    'deal-structuring': '/deal-structuring'
                  };
                  const route = moduleRoutes[moduleId];
                  if (route) {
                    navigateToModule(route, true);
                  }
                }}
                className="hidden sm:block"
              />
              
              <div className="min-w-0 flex-1 sm:hidden">
                <h1 className="text-lg font-semibold text-gray-900 truncate">
                  Portfolio
                </h1>
              </div>
              
              {/* Breadcrumb - Hidden on mobile to save space */}
              <div className="hidden sm:block flex-1 min-w-0">
                <AutonomousBreadcrumb 
                  currentModule="portfolio"
                  projectName="Select portfolio"
                />
              </div>
            </div>

            <div className="flex items-center space-x-1 sm:space-x-3 flex-shrink-0">
              <Badge 
                variant="outline" 
                className="bg-green-50 text-green-700 border-green-200 hidden sm:inline-flex"
              >
                AI Ready
              </Badge>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (onSwitchMode) {
                    onSwitchMode('assisted');
                  } else {
                    exitAutonomous('assisted');
                  }
                }}
                className="text-xs sm:text-sm"
                title="Exit Autonomous Mode"
              >
                <span className="hidden sm:inline">Exit Autonomous</span>
                <span className="sm:hidden">Exit</span>
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSettings(!showSettings)}
                aria-label="Settings"
              >
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Main Layout */}
        <div className="autonomous-content">
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
      </AutonomousLayout>
    );
  }

  // Project selected - show full autonomous interface with hierarchical layout
  return (
    <AutonomousLayout>
      {/* Header */}
      <div className="autonomous-header px-4 py-3">
        <div className="flex items-center justify-between min-h-[56px]">
          <div className="flex items-center space-x-2 sm:space-x-4 flex-1 min-w-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleSidebar}
              className="lg:hidden flex-shrink-0"
              aria-label="Toggle sidebar"
            >
              {sidebarCollapsed ? <Menu className="w-4 h-4" /> : <X className="w-4 h-4" />}
            </Button>
            
            {/* Navigation Menu */}
            <AutonomousNavMenu 
              currentModule="portfolio"
              onNavigate={(moduleId) => {
                const moduleRoutes: Record<string, string> = {
                  dashboard: '/dashboard',
                  workspaces: '/workspaces',
                  'due-diligence': '/due-diligence',
                  portfolio: '/portfolio',
                  'deal-screening': '/deal-screening',
                  'deal-structuring': '/deal-structuring'
                };
                const route = moduleRoutes[moduleId];
                if (route) {
                  navigateToModule(route, true);
                }
              }}
              className="hidden sm:block"
            />
            
            <div className="min-w-0 flex-1 sm:hidden">
              <h1 className="text-lg font-semibold text-gray-900 truncate">
                Portfolio
              </h1>
            </div>
            
            {/* Breadcrumb - Hidden on mobile to save space */}
            <div className="hidden sm:block flex-1 min-w-0">
              <AutonomousBreadcrumb 
                currentModule="portfolio"
                projectName={selectedProject.name}
              />
            </div>
          </div>

          <div className="flex items-center space-x-1 sm:space-x-3 flex-shrink-0">
            <Badge 
              variant="outline" 
              className="bg-green-50 text-green-700 border-green-200 hidden sm:inline-flex"
            >
              AI Optimizing
            </Badge>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (onSwitchMode) {
                  onSwitchMode('assisted');
                } else {
                  exitAutonomous('assisted');
                }
              }}
              className="text-xs sm:text-sm"
              title="Exit Autonomous Mode"
            >
              <span className="hidden sm:inline">Exit Autonomous</span>
              <span className="sm:hidden">Exit</span>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSettings(!showSettings)}
              aria-label="Settings"
            >
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Layout */}
      <div className="autonomous-content">
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
            project={selectedProject ? {
              ...selectedProject,
              metadata: generateContextData(selectedProject)
            } : undefined}
            projectType="portfolio"
          />
        )}
      </div>
    </AutonomousLayout>
  );
}

export default PortfolioAutonomous;