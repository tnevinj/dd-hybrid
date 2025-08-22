'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChatInterface, ProjectSelector, ContextPanel } from '@/components/autonomous';
import { useNavigationStoreRefactored } from '@/stores/navigation-store-refactored';
import { useAutonomousStore } from '@/stores/autonomous-store';
import { ContentTransformationWorkflow } from '@/components/content-transformation/ContentTransformationWorkflow';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Settings, Menu, X } from 'lucide-react';
import type { ProjectContext, WorkProduct } from '@/types/work-product';

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

interface DueDiligenceAutonomousProps {
  onSwitchMode?: (mode: 'traditional' | 'assisted' | 'autonomous') => void;
}

export function DueDiligenceAutonomous({ onSwitchMode }: DueDiligenceAutonomousProps) {
  const {
    selectedProject,
    projects,
    selectProject,
    setActiveProjectType,
    sidebarCollapsed,
    contextPanelCollapsed,
    toggleSidebar,
    toggleContextPanel,
    initializeProjects
  } = useAutonomousStore();

  const [showSettings, setShowSettings] = useState(false);
  const [showContentWorkflow, setShowContentWorkflow] = useState(false);
  const router = useRouter();

  // Initialize project type for due diligence
  React.useEffect(() => {
    setActiveProjectType('due-diligence');
    // If no due diligence projects exist, initialize with mock data
    const dueDiligenceProjects = projects['due-diligence'] || [];
    if (dueDiligenceProjects.length === 0) {
      initializeProjects();
    }
  }, [setActiveProjectType, initializeProjects, projects]);

  const handleProjectSelect = (project: Project) => {
    selectProject(project);
  };

  const handleCreateWorkProduct = (project: Project) => {
    selectProject(project);
    setShowContentWorkflow(true);
  };

  const handleWorkProductSave = (workProduct: WorkProduct) => {
    // Handle saving the work product
    console.log('Work product saved:', workProduct);
    setShowContentWorkflow(false);
    // You might want to refresh the project data or show a success message here
  };

  const handleWorkflowCancel = () => {
    setShowContentWorkflow(false);
  };

  // Create project context for content transformation
  const createProjectContext = (project: Project): ProjectContext => {
    return {
      projectId: project.id,
      projectName: project.name,
      projectType: 'due-diligence',
      dealValue: project.metadata?.dealValue || 0,
      sector: project.metadata?.sector || 'Technology',
      stage: project.metadata?.stage || 'Growth',
      geography: project.metadata?.geography || 'North America',
      riskRating: project.metadata?.riskRating || 'Medium',
      teamMembers: project.metadata?.team || [],
      timeline: {
        startDate: new Date(project.metadata?.createdAt || Date.now()),
        targetClose: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days from now
        currentPhase: 'Due Diligence'
      },
      stakeholders: project.metadata?.team || [],
      confidenceScore: project.metadata?.confidenceScore || 0.8
    };
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
                Autonomous Due Diligence
              </h1>
              <p className="text-sm text-gray-500">
                {selectedProject ? selectedProject.name : 'Select a company to analyze'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
              AI Analyzing
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
            projectType="due-diligence"
            selectedProjectId={selectedProject?.id}
            onProjectSelect={handleProjectSelect}
          />
        )}

        {/* Chat Interface */}
        <div className="flex-1">
          <ChatInterface
            projectId={selectedProject?.id}
            projectType="due-diligence"
          />
        </div>

        {/* Context Panel */}
        {!contextPanelCollapsed && (
          <ContextPanel
            project={selectedProject || undefined}
            projectType="due-diligence"
            onCreateWorkProduct={handleCreateWorkProduct}
          />
        )}
      </div>

      {/* Content Transformation Workflow Modal */}
      {showContentWorkflow && selectedProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-lg max-w-7xl w-full min-h-[95vh] my-4">
            <div className="max-h-[calc(100vh-2rem)] overflow-y-auto">
              <ContentTransformationWorkflow
                projectContext={createProjectContext(selectedProject)}
                onSave={handleWorkProductSave}
                onCancel={handleWorkflowCancel}
                navigationMode="autonomous"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DueDiligenceAutonomous;
