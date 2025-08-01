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

interface DashboardAutonomousProps {
  dashboardData?: any;
  activeDeals?: any[];
  recentActivity?: any[];
  automatedActions?: any[];
  pendingApprovals?: any[];
  aiRecommendations?: any[];
  isProcessing?: boolean;
  onApproveAction?: (actionId: string) => void;
  onRejectAction?: (actionId: string) => void;
  onSwitchMode?: (mode: 'traditional' | 'assisted' | 'autonomous') => void;
  isPaused?: boolean;
}

export function DashboardAutonomous({ 
  dashboardData,
  activeDeals,
  recentActivity,
  automatedActions,
  pendingApprovals,
  aiRecommendations,
  isProcessing,
  onApproveAction,
  onRejectAction,
  onSwitchMode,
  isPaused
}: DashboardAutonomousProps) {
  const {
    selectedProject,
    projects,
    selectProject,
    setActiveProjectType,
    sidebarCollapsed,
    contextPanelCollapsed,
    toggleSidebar,
    toggleContextPanel
  } = useAutonomousStore();

  const [showSettings, setShowSettings] = useState(false);

  // Initialize project type for dashboard
  React.useEffect(() => {
    setActiveProjectType('dashboard');
  }, [setActiveProjectType]);

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
                Autonomous Dashboard
              </h1>
              <p className="text-sm text-gray-500">
                {selectedProject ? selectedProject.name : 'Select a project to get started'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              AI Active
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
            projectType="dashboard"
            selectedProjectId={selectedProject?.id}
            onProjectSelect={handleProjectSelect}
          />
        )}

        {/* Chat Interface */}
        <div className="flex-1">
          <ChatInterface
            projectId={selectedProject?.id}
            projectType="dashboard"
          />
        </div>

        {/* Context Panel */}
        {!contextPanelCollapsed && (
          <ContextPanel
            project={selectedProject || undefined}
            projectType="dashboard"
          />
        )}
      </div>
    </div>
  );
}

export default DashboardAutonomous