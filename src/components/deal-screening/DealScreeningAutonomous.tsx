'use client';

import React, { useState } from 'react';
import { ChatInterface, ProjectSelector, ContextPanel } from '@/components/autonomous';
import { AutonomousLayout } from '@/components/autonomous/AutonomousLayout';
import { AutonomousNavMenu } from '@/components/autonomous/AutonomousNavMenu';
import { AutonomousBreadcrumb } from '@/components/autonomous/AutonomousBreadcrumb';
import { useNavigationStoreRefactored } from '@/stores/navigation-store-refactored';
import { useAutonomousStore, type Project } from '@/stores/autonomous-store';
import { useAutonomousMode } from '@/hooks/useAutonomousMode';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Settings, Menu, X } from 'lucide-react';
import { DealOpportunity, AIRecommendation, AutomatedAction, PendingApproval } from '@/types/deal-screening';
import { WorkProductCreator } from '@/components/work-product';
import { WorkProduct, WorkProductCreateRequest } from '@/types/work-product';
import { getAutonomousConfig, generateMockProjects, getAvailableActions, generateContextData, type AutonomousProject } from '@/lib/autonomous-mode-config';
import type { HybridMode } from '@/components/shared';

interface DealScreeningAutonomousProps {
  onSwitchMode?: (mode: HybridMode) => void;
}

export function DealScreeningAutonomous({ onSwitchMode }: DealScreeningAutonomousProps) {
  // Navigation store for mode and module management
  const { currentMode, setCurrentModule } = useNavigationStoreRefactored();
  
  // Autonomous store for project management and UI state
  const {
    selectedProject,
    selectProject,
    setActiveProjectType,
    setProjectsForType,
    sidebarCollapsed,
    contextPanelCollapsed,
    toggleSidebar,
    toggleContextPanel
  } = useAutonomousStore();

  const [showSettings, setShowSettings] = useState(false);
  const [showWorkProductCreator, setShowWorkProductCreator] = useState(false);
  const [showWorkProductViewer, setShowWorkProductViewer] = useState(false);
  const [currentWorkProduct, setCurrentWorkProduct] = useState<WorkProduct | null>(null);
  const { exitAutonomous, navigateToModule } = useAutonomousMode();

  // Initialize project type for deal screening using standardized config
  React.useEffect(() => {
    setActiveProjectType('deal-screening');
    setCurrentModule('deal-screening');
    
    // Generate mock projects using standardized configuration and convert to Project type
    const autonomousProjects = generateMockProjects('deal-screening', 4);
    const mockProjects: Project[] = autonomousProjects.map(ap => ({
      id: ap.id,
      name: ap.name,
      type: ap.type as Project['type'], // Convert string to the specific type
      status: ap.status === 'paused' ? 'draft' : ap.status, // Map 'paused' to 'draft'
      lastActivity: ap.lastActivity,
      priority: ap.priority,
      ...(ap.unreadMessages !== undefined && { unreadMessages: ap.unreadMessages }),
      ...(ap.metadata !== undefined && { metadata: ap.metadata })
    }));
    setProjectsForType('deal-screening', mockProjects);
  }, [setActiveProjectType, setProjectsForType, setCurrentModule]);

  const handleProjectSelect = (project: Project) => {
    selectProject(project);
  };

  const handleViewWorkProduct = async (workProductId: string) => {
    if (!selectedProject) return;
    
    try {
      const response = await fetch(`/api/workspaces/${selectedProject.id}/work-products/${workProductId}`);
      if (response.ok) {
        const workProduct = await response.json();
        setCurrentWorkProduct(workProduct);
        setShowWorkProductViewer(true);
      }
    } catch (error) {
      console.error('Error fetching work product:', error);
    }
  };

  const handleCreateWorkProduct = (project: Project) => {
    selectProject(project); // Ensure project is selected
    setShowWorkProductCreator(true);
  };

  const handleGenerateReport = (project: Project) => {
    // This could trigger AI assistant action or open work product creator
    selectProject(project);
    setShowWorkProductCreator(true);
  };

  const handleWorkProductCreated = async (request: WorkProductCreateRequest) => {
    if (!selectedProject) return;
    
    try {
      const response = await fetch(`/api/workspaces/${selectedProject.id}/work-products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
      });
      
      if (response.ok) {
        const newWorkProduct = await response.json();
        setCurrentWorkProduct(newWorkProduct);
        setShowWorkProductCreator(false);
        setShowWorkProductViewer(true);
      }
    } catch (error) {
      console.error('Error creating work product:', error);
    }
  };

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
              currentModule="deal-screening"
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
                Deal Screening
              </h1>
            </div>
            
            {/* Breadcrumb - Hidden on mobile to save space */}
            <div className="hidden sm:block flex-1 min-w-0">
              <AutonomousBreadcrumb 
                currentModule="deal-screening"
                projectName={selectedProject ? selectedProject.name : 'Select deal'}
              />
            </div>
          </div>

          <div className="flex items-center space-x-1 sm:space-x-3 flex-shrink-0">
            <Badge 
              variant="outline" 
              className="bg-blue-50 text-blue-700 border-blue-200 hidden sm:inline-flex"
            >
              AI Screening
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
            projectType="deal-screening"
            selectedProjectId={selectedProject?.id}
            onProjectSelect={handleProjectSelect}
          />
        )}

        {/* Chat Interface */}
        <div className="flex-1">
          <ChatInterface
            projectId={selectedProject?.id}
            projectName={selectedProject?.name}
            projectType="deal-screening"
            contextData={selectedProject ? generateContextData(selectedProject) : undefined}
            systemPrompt={getAutonomousConfig('deal-screening')?.systemPrompt}
            availableActions={getAvailableActions('deal-screening', selectedProject?.type)}
          />
        </div>

        {/* Context Panel */}
        {!contextPanelCollapsed && (
          <ContextPanel
            project={selectedProject || undefined}
            projectType="deal-screening"
            onViewWorkProduct={handleViewWorkProduct}
            onCreateWorkProduct={handleCreateWorkProduct}
            onGenerateReport={handleGenerateReport}
          />
        )}
      </div>

      {/* Work Product Creator Modal */}
      {showWorkProductCreator && selectedProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">Create Work Product - {selectedProject.name}</h2>
              <Button variant="ghost" size="sm" onClick={() => setShowWorkProductCreator(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
              <WorkProductCreator
                workspaceId={selectedProject.id}
                onCreateWorkProduct={handleWorkProductCreated}
                onCancel={() => setShowWorkProductCreator(false)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Work Product Viewer Modal */}
      {showWorkProductViewer && currentWorkProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-6xl w-full max-h-[95vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">{currentWorkProduct.title}</h2>
              <div className="flex items-center gap-2">
                <Badge variant="outline">{currentWorkProduct.type}</Badge>
                <Badge className={
                  currentWorkProduct.status === 'DRAFT' ? 'bg-yellow-100 text-yellow-700' :
                  currentWorkProduct.status === 'IN_REVIEW' ? 'bg-orange-100 text-orange-700' :
                  currentWorkProduct.status === 'APPROVED' ? 'bg-green-100 text-green-700' :
                  'bg-gray-100 text-gray-700'
                }>
                  {currentWorkProduct.status}
                </Badge>
                <Button variant="ghost" size="sm" onClick={() => setShowWorkProductViewer(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="overflow-y-auto max-h-[calc(95vh-80px)] p-4">
              <div className="prose prose-sm max-w-none">
                {currentWorkProduct.sections.map((section, index) => (
                  <div key={section.id} className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">{section.title}</h3>
                    <div className="whitespace-pre-wrap text-gray-700">
                      {section.content}
                    </div>
                    {index < currentWorkProduct.sections.length - 1 && <hr className="my-6" />}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </AutonomousLayout>
  );
}

export default DealScreeningAutonomous;
