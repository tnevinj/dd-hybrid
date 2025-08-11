'use client';

import React, { useState } from 'react';
import { ChatInterface, ProjectSelector, ContextPanel } from '@/components/autonomous';
import { useAutonomousStore } from '@/lib/stores/autonomousStore';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Settings, Menu, X } from 'lucide-react';
import { WorkProductCreator } from '@/components/work-product';
import { WorkProduct, WorkProductCreateRequest } from '@/types/work-product';

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

interface WorkspaceAutonomousProps {
  onSwitchMode?: (mode: 'traditional' | 'assisted' | 'autonomous') => void;
}

export function WorkspaceAutonomous({ onSwitchMode }: WorkspaceAutonomousProps) {
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
  const [showWorkProductCreator, setShowWorkProductCreator] = useState(false);
  const [showWorkProductViewer, setShowWorkProductViewer] = useState(false);
  const [currentWorkProduct, setCurrentWorkProduct] = useState<WorkProduct | null>(null);

  // Initialize project type for workspace and refresh data
  React.useEffect(() => {
    setActiveProjectType('workspace');
    refreshProjectsFromUnifiedData(); // Ensure we have latest unified data
  }, [setActiveProjectType, refreshProjectsFromUnifiedData]);

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
                Autonomous Workspace
              </h1>
              <p className="text-sm text-gray-500">
                {selectedProject ? selectedProject.name : 'Select a workspace project'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
              AI Managing
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
            projectType="workspace"
            selectedProjectId={selectedProject?.id}
            onProjectSelect={handleProjectSelect}
          />
        )}

        {/* Chat Interface */}
        <div className="flex-1">
          <ChatInterface
            projectId={selectedProject?.id}
            projectType="workspace"
          />
        </div>

        {/* Context Panel */}
        {!contextPanelCollapsed && (
          <ContextPanel
            project={selectedProject || undefined}
            projectType="workspace"
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
    </div>
  );
}

export default WorkspaceAutonomous;