'use client';

import React, { useState } from 'react';
import { ChatInterface, ProjectSelector, ContextPanel } from '@/components/autonomous';
import { useAutonomousStore } from '@/lib/stores/autonomousStore';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Settings, Menu, X } from 'lucide-react';
import { DealOpportunity, AIRecommendation, AutomatedAction, PendingApproval } from '@/types/deal-screening';

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

interface DealScreeningAutonomousProps {
  opportunities?: DealOpportunity[];
  automatedActions?: AutomatedAction[];
  pendingApprovals?: PendingApproval[];
  aiRecommendations?: AIRecommendation[];
  isProcessing?: boolean;
  onApproveAction?: (approvalId: string) => void;
  onRejectAction?: (approvalId: string) => void;
  onSwitchMode?: (mode: 'traditional' | 'assisted' | 'autonomous') => void;
  onPauseAI?: () => void;
  onResumeAI?: () => void;
  isPaused?: boolean;
  onCreateOpportunity?: () => void;
  onViewOpportunity?: (id: string) => void;
  onScreenOpportunity?: (id: string) => void;
}

export function DealScreeningAutonomous({ onSwitchMode }: DealScreeningAutonomousProps) {
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

  // Initialize project type for deal screening
  React.useEffect(() => {
    setActiveProjectType('deal-screening');
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
                Autonomous Deal Screening
              </h1>
              <p className="text-sm text-gray-500">
                {selectedProject ? selectedProject.name : 'Select a deal to analyze'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
              AI Screening
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
            projectType="deal-screening"
            selectedProjectId={selectedProject?.id}
            onProjectSelect={handleProjectSelect}
          />
        )}

        {/* Chat Interface */}
        <div className="flex-1">
          <ChatInterface
            projectId={selectedProject?.id}
            projectType="deal-screening"
          />
        </div>

        {/* Context Panel */}
        {!contextPanelCollapsed && (
          <ContextPanel
            project={selectedProject || undefined}
            projectType="deal-screening"
          />
        )}
      </div>
    </div>
  );
}

export default DealScreeningAutonomous;