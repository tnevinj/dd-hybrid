'use client';

import React, { useState, useEffect } from 'react';
import { ChatInterface, ProjectSelector, ContextPanel } from '@/components/autonomous';
import { AutonomousLayout } from '@/components/autonomous/AutonomousLayout';
import { AutonomousNavMenu } from '@/components/autonomous/AutonomousNavMenu';
import { AutonomousBreadcrumb } from '@/components/autonomous/AutonomousBreadcrumb';
import { useAutonomousStore } from '@/lib/stores/autonomousStore';
import { useAutonomousMode } from '@/hooks/useAutonomousMode';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Settings, Menu, X, Wand2 } from 'lucide-react';
import { WorkProductCreator } from '@/components/work-product';
import { ContentAssembler } from '@/components/content-transformation/ContentAssembler';
import { WorkProduct, WorkProductCreateRequest, ProjectContext } from '@/types/work-product';
import { ZIndex, getZIndexStyle } from '@/styles/z-index';

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
    loadWorkspaceProjects
  } = useAutonomousStore();
  
  const { exitAutonomous, navigateToModule } = useAutonomousMode();

  const [showSettings, setShowSettings] = useState(false);
  const [showWorkProductCreator, setShowWorkProductCreator] = useState(false);
  const [showContentAssembler, setShowContentAssembler] = useState(false);
  const [showWorkProductViewer, setShowWorkProductViewer] = useState(false);
  const [currentWorkProduct, setCurrentWorkProduct] = useState<WorkProduct | null>(null);
  const [creationMode, setCreationMode] = useState<'traditional' | 'assembler'>('assembler');
  const [headerHeight, setHeaderHeight] = useState(64); // Default header height in px
  // Real workspace data is now loaded via the autonomous store

  // Initialize project type for workspace and load real data
  React.useEffect(() => {
    setActiveProjectType('workspace');
    loadWorkspaceProjects(); // Load real workspace data from SQLite backend
  }, [setActiveProjectType, loadWorkspaceProjects]);

  // Update header height dynamically
  useEffect(() => {
    const updateHeaderHeight = () => {
      const headerElement = document.getElementById('autonomous-workspace-header');
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
    const headerElement = document.getElementById('autonomous-workspace-header');
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
    if (creationMode === 'assembler') {
      setShowContentAssembler(true);
    } else {
      setShowWorkProductCreator(true);
    }
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

  const handleWorkProductSaved = (workProduct: WorkProduct) => {
    setCurrentWorkProduct(workProduct);
    setShowContentAssembler(false);
    setShowWorkProductViewer(true);
  };

  const convertProjectToContext = (project: Project): ProjectContext => {
    return {
      projectId: project.id,
      projectName: project.name,
      projectType: project.type === 'deal' ? 'due-diligence' : 'analysis',
      sector: project.metadata?.sector || 'Technology', // Use real sector from database
      dealValue: project.metadata?.dealValueCents || undefined, // Use raw cents value from database
      stage: project.metadata?.stage || (project.status === 'active' ? 'due-diligence' : 'analysis'), // Use real stage
      geography: project.metadata?.geography || 'North America', // Use real geography
      riskRating: project.metadata?.riskRating || (project.priority === 'high' ? 'high' : project.priority === 'low' ? 'low' : 'medium'), // Use real risk rating
      progress: project.metadata?.progress || 0,
      metadata: {
        ...(project.metadata || {}),
        ...(project.metadata?.dbMetadata || {}) // Include database metadata
      }
    };
  };

  return (
    <AutonomousLayout>
      {/* Header */}
      <div 
        id="autonomous-workspace-header"
        className="autonomous-header px-4 py-3 sm:px-6"
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
              currentModule="workspaces"
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
                Workspaces
              </h1>
            </div>
            
            {/* Breadcrumb - Hidden on mobile to save space */}
            <div className="hidden sm:block flex-1 min-w-0">
              <AutonomousBreadcrumb 
                currentModule="workspaces"
                projectName={selectedProject?.name}
              />
            </div>
          </div>

          <div className="flex items-center space-x-1 sm:space-x-3 flex-shrink-0">
            <Badge 
              variant="outline" 
              className="bg-purple-50 text-purple-700 border-purple-200 hidden sm:inline-flex"
            >
              AI Managing
            </Badge>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCreationMode(creationMode === 'assembler' ? 'traditional' : 'assembler')}
              className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm"
              title={`Switch to ${creationMode === 'assembler' ? 'Traditional' : 'AI'} Creator`}
            >
              <Wand2 className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">
                {creationMode === 'assembler' ? 'AI Creator' : 'Traditional'}
              </span>
              <span className="sm:hidden">
                {creationMode === 'assembler' ? 'AI' : 'Trad'}
              </span>
            </Button>
            
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
        <ProjectSelector
          projectType="workspace"
          selectedProjectId={selectedProject?.id}
          onProjectSelect={handleProjectSelect}
          collapsed={sidebarCollapsed}
          onToggle={toggleSidebar}
        />

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
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
          style={getZIndexStyle(ZIndex.OVERLAY)}
        >
          <div 
            className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
            style={getZIndexStyle(ZIndex.MODAL_CONTENT)}
          >
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

      {/* Content Assembler Modal */}
      {showContentAssembler && selectedProject && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
          style={getZIndexStyle(ZIndex.OVERLAY)}
        >
          <div 
            className="bg-white rounded-lg max-w-7xl w-full max-h-[95vh] overflow-hidden shadow-2xl"
            style={getZIndexStyle(ZIndex.MODAL_CONTENT)}
          >
            <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-violet-50 to-purple-50">
              <div className="flex items-center gap-3">
                <Wand2 className="w-5 h-5 text-violet-600" />
                <h2 className="text-lg font-semibold text-gray-900">AI Content Assembler - {selectedProject.name}</h2>
                <Badge variant="outline" className="bg-purple-100 text-purple-700">Smart Creation</Badge>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setShowContentAssembler(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="h-[calc(95vh-80px)]">
              <ContentAssembler
                projectContext={convertProjectToContext(selectedProject)}
                onSave={handleWorkProductSaved}
                onCancel={() => setShowContentAssembler(false)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Work Product Viewer Modal */}
      {showWorkProductViewer && currentWorkProduct && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
          style={getZIndexStyle(ZIndex.OVERLAY)}
        >
          <div 
            className="bg-white rounded-lg max-w-6xl w-full max-h-[95vh] overflow-hidden shadow-2xl"
            style={getZIndexStyle(ZIndex.MODAL_CONTENT)}
          >
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

export default WorkspaceAutonomous;