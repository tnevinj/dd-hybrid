'use client';

import React, { useState, useEffect } from 'react';
import { ChatInterface, ProjectSelector, ContextPanel } from '@/components/autonomous';
import { AutonomousLayout } from '@/components/autonomous/AutonomousLayout';
import { AutonomousNavMenu } from '@/components/autonomous/AutonomousNavMenu';
import { AutonomousBreadcrumb } from '@/components/autonomous/AutonomousBreadcrumb';
import { useAutonomousStore } from '@/stores/autonomous-store';
import { useAutonomousMode } from '@/hooks/useAutonomousMode';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Settings, Menu, X } from 'lucide-react';
import { getAutonomousConfig, generateMockProjects, getAvailableActions, generateContextData } from '@/lib/autonomous-mode-config';
import type { HybridMode } from '@/components/shared';
import type { Project } from '@/stores/autonomous-store';

interface PortfolioAutonomousProps {
  onSwitchMode?: (mode: HybridMode) => void;
}

export function PortfolioAutonomous({ onSwitchMode }: PortfolioAutonomousProps) {
  const {
    selectedProject,
    selectProject,
    setActiveProjectType,
    sidebarCollapsed,
    contextPanelCollapsed,
    toggleSidebar,
    toggleContextPanel,
    setPortfolioProjects,
    loadPortfolioProjects
  } = useAutonomousStore();

  const [showSettings, setShowSettings] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(64); // Default header height in px
  const { exitAutonomous, navigateToModule } = useAutonomousMode();

  // Initialize project type for portfolio using real data from SQLite
  React.useEffect(() => {
    setActiveProjectType('portfolio');
    
    // Load real portfolio projects from SQLite backend
    const loadRealPortfolioData = async () => {
      try {
        await loadPortfolioProjects();
      } catch (error) {
        console.error('Failed to load portfolio projects:', error);
        // Fallback to mock data if real data loading fails
        const mockProjects = generateMockProjects('portfolio', 5);
        const convertedProjects: Project[] = mockProjects.map(project => {
          // Convert the project type to match ContextPanel's expected types
          let convertedType: Project['type'];
          if (project.type === 'dashboard' || project.type === 'workspace') {
            convertedType = 'portfolio'; // Map dashboard/workspace to portfolio for ContextPanel
          } else {
            convertedType = project.type as Project['type'];
          }
          
          return {
            id: project.id,
            name: project.name,
            type: convertedType,
            status: project.status === 'paused' ? 'draft' : project.status as Project['status'], // Convert paused to draft
            lastActivity: project.lastActivity,
            priority: project.priority,
            unreadMessages: project.unreadMessages || 0, // Ensure number, not undefined
            metadata: project.metadata || {}
          };
        });
        setPortfolioProjects(convertedProjects);
      }
    };
    
    loadRealPortfolioData();
  }, [setActiveProjectType, setPortfolioProjects, loadPortfolioProjects]);

  const handleProjectSelect = (project: Project) => {
    selectProject(project);
  };

  // Update header height dynamically
  useEffect(() => {
    const updateHeaderHeight = () => {
      const headerElement = document.getElementById('autonomous-portfolio-header');
      if (headerElement) {
        const height = headerElement.offsetHeight;
        setHeaderHeight(height);
        // Set CSS custom property for consistent spacing
        document.documentElement.style.setProperty('--autonomous-header-height', `${height}px`);
      }
    };

    updateHeaderHeight();
    
    // Update on window resize
    window.addEventListener('resize', updateHeaderHeight);
    
    // Update when content changes (use MutationObserver for header content changes)
    const headerElement = document.getElementById('autonomous-portfolio-header');
    if (headerElement) {
      const observer = new MutationObserver(updateHeaderHeight);
      observer.observe(headerElement, { childList: true, subtree: true });
      return () => {
        observer.disconnect();
        window.removeEventListener('resize', updateHeaderHeight);
      };
    }
    
    return () => {
      window.removeEventListener('resize', updateHeaderHeight);
    };
  }, [selectedProject]);

  // If no project selected, show project-based autonomous interface
  if (!selectedProject) {
    return (
      <AutonomousLayout>
        {/* Header */}
        <div 
          id="autonomous-portfolio-header"
          className="autonomous-header px-4 py-3"
        >
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
      <div 
        id="autonomous-portfolio-header"
        className="autonomous-header px-4 py-3"
      >
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

        {/* Chat Interface */}
        <div className="flex-1">
          <ChatInterface
            projectId={selectedProject?.id}
            projectType="portfolio"
          />
        </div>

        {/* Context Panel */}
        {!contextPanelCollapsed && selectedProject && (
          <ContextPanel
            project={{
              ...selectedProject,
              type: selectedProject.type === 'dashboard' || selectedProject.type === 'workspace' 
                ? 'portfolio' 
                : selectedProject.type as 'portfolio' | 'deal' | 'company' | 'report' | 'analysis'
            }}
            projectType="portfolio"
          />
        )}
      </div>
    </AutonomousLayout>
  );
}

export default PortfolioAutonomous;
