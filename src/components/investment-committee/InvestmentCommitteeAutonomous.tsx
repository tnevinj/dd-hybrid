'use client';

import React, { useState } from 'react';
import { ChatInterface, ProjectSelector, ContextPanel } from '@/components/autonomous';
import { AutonomousLayout } from '@/components/autonomous/AutonomousLayout';
import { AutonomousNavMenu } from '@/components/autonomous/AutonomousNavMenu';
import { AutonomousBreadcrumb } from '@/components/autonomous/AutonomousBreadcrumb';
import { useAutonomousStore } from '@/stores/autonomous-store';
import { useAutonomousMode } from '@/hooks/useAutonomousMode';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Settings, Menu, X, Gavel } from 'lucide-react';
import { WorkProductCreator } from '@/components/work-product';
import { WorkProduct, WorkProductCreateRequest } from '@/types/work-product';
import type { HybridMode } from '@/components/shared';

interface Project {
  id: string;
  name: string;
  type: 'portfolio' | 'deal' | 'company' | 'report' | 'analysis' | 'committee' | 'proposal';
  status: 'active' | 'completed' | 'draft' | 'review';
  lastActivity: Date;
  priority: 'high' | 'medium' | 'low';
  unreadMessages?: number;
  metadata?: {
    value?: string;
    progress?: number;
    team?: string[];
    proposalType?: string;
    requestedAmount?: number;
    meetingDate?: string;
    committeeName?: string;
    decisionStatus?: string;
    aiScore?: number;
    workProductId?: string;
    workProductTitle?: string;
  };
}

interface InvestmentCommitteeAutonomousProps {
  onSwitchMode?: (mode: HybridMode) => void;
}

export function InvestmentCommitteeAutonomous({ onSwitchMode }: InvestmentCommitteeAutonomousProps) {
  const {
    selectedProject,
    projects,
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

  // Initialize project type for investment committee and load data
  React.useEffect(() => {
    setActiveProjectType('investment-committee');
    
    // Create mock investment committee projects
    const mockProjects: Project[] = [
      {
        id: 'ic-meeting-1',
        name: 'Q1 2024 Investment Committee Meeting',
        type: 'committee',
        status: 'active',
        lastActivity: new Date(Date.now() - 3600000), // 1 hour ago
        priority: 'high',
        unreadMessages: 3,
        metadata: {
          progress: 85,
          team: ['Sarah Johnson', 'Michael Chen', 'Rachel Martinez', 'David Kim'],
          meetingDate: '2024-03-26',
          committeeName: 'Growth Investment Committee',
          workProductId: 'wp-ic-meeting-1',
          workProductTitle: 'Q1 2024 Investment Committee Report'
        }
      },
      {
        id: 'proposal-techcorp',
        name: 'TechCorp Alpha Growth Equity Proposal',
        type: 'proposal',
        status: 'review',
        lastActivity: new Date(Date.now() - 7200000), // 2 hours ago
        priority: 'high',
        unreadMessages: 5,
        metadata: {
          value: '$25M',
          progress: 92,
          team: ['Alex Thompson', 'Sarah Park', 'Kevin Liu'],
          proposalType: 'Growth Equity',
          requestedAmount: 25000000,
          decisionStatus: 'Under Review',
          aiScore: 87,
          workProductId: 'wp-techcorp-proposal',
          workProductTitle: 'TechCorp Alpha Investment Memo'
        }
      },
      {
        id: 'proposal-healthtech',
        name: 'HealthTech Beta Series B Investment',
        type: 'proposal',
        status: 'active',
        lastActivity: new Date(Date.now() - 10800000), // 3 hours ago
        priority: 'medium',
        unreadMessages: 2,
        metadata: {
          value: '$15M',
          progress: 74,
          team: ['Rachel Martinez', 'David Kim', 'Lisa Wang'],
          proposalType: 'Series B',
          requestedAmount: 15000000,
          decisionStatus: 'Due Diligence',
          aiScore: 72,
          workProductId: 'wp-healthtech-proposal',
          workProductTitle: 'HealthTech Beta Investment Analysis'
        }
      },
      {
        id: 'proposal-finserv',
        name: 'FinServ Gamma Platform Expansion',
        type: 'proposal',
        status: 'draft',
        lastActivity: new Date(Date.now() - 14400000), // 4 hours ago
        priority: 'high',
        unreadMessages: 1,
        metadata: {
          value: '$40M',
          progress: 58,
          team: ['Michael Chen', 'Alex Thompson', 'Sarah Johnson'],
          proposalType: 'Platform',
          requestedAmount: 40000000,
          decisionStatus: 'Initial Review',
          aiScore: 91,
          workProductId: 'wp-finserv-proposal',
          workProductTitle: 'FinServ Gamma Strategy Brief'
        }
      }
    ];
    
    setProjectsForType('investment-committee', mockProjects);
  }, [setActiveProjectType, setProjectsForType]);

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
    selectProject(project);
    setShowWorkProductCreator(true);
  };

  const handleGenerateReport = (project: Project) => {
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
              currentModule="investment-committee"
              onNavigate={(moduleId) => {
                const moduleRoutes: Record<string, string> = {
                  dashboard: '/dashboard',
                  workspaces: '/workspaces',
                  'due-diligence': '/due-diligence',
                  portfolio: '/portfolio',
                  'deal-screening': '/deal-screening',
                  'deal-structuring': '/deal-structuring',
                  'investment-committee': '/investment-committee'
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
                Investment Committee
              </h1>
            </div>
            
            {/* Breadcrumb - Hidden on mobile to save space */}
            <div className="hidden sm:block flex-1 min-w-0">
              <AutonomousBreadcrumb 
                currentModule="investment-committee"
                projectName={selectedProject ? selectedProject.name : 'Select committee item'}
              />
            </div>
          </div>

          <div className="flex items-center space-x-1 sm:space-x-3 flex-shrink-0">
            <Badge 
              variant="outline" 
              className="bg-purple-50 text-purple-700 border-purple-200 hidden sm:inline-flex"
            >
              AI Committee
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
            projectType="investment-committee"
            selectedProjectId={selectedProject?.id}
            onProjectSelect={handleProjectSelect}
          />
        )}

        {/* Chat Interface */}
        <div className="flex-1">
          <ChatInterface
            projectId={selectedProject?.id}
            projectName={selectedProject?.name}
            projectType="investment-committee"
            contextData={selectedProject?.metadata}
            systemPrompt={selectedProject ? `You are an AI assistant specializing in investment committee operations and decision-making. You're working on ${selectedProject.name}, ${selectedProject.type === 'proposal' ? `a ${selectedProject.metadata?.proposalType || 'investment'} proposal requesting ${selectedProject.metadata?.value || 'funding'}` : 'a committee meeting'}.

Your capabilities include:
- Investment proposal analysis and evaluation
- Committee meeting preparation and management
- Decision workflow optimization
- Risk assessment and due diligence support
- Member consensus building and voting analysis

${selectedProject.type === 'proposal' ? `This proposal has an AI score of ${selectedProject.metadata?.aiScore || 'pending'}% and is currently in ${selectedProject.metadata?.decisionStatus || 'review'} status.` : ''}

Provide actionable insights while maintaining fiduciary responsibility and transparency about your reasoning and confidence levels.` : undefined}
            availableActions={[
              {
                id: 'analyze-proposal',
                label: 'Analyze Proposal',
                description: 'Comprehensive investment proposal evaluation',
                category: 'analysis'
              },
              {
                id: 'prepare-meeting',
                label: 'Prepare Meeting',
                description: 'Generate meeting materials and agenda',
                category: 'preparation'
              },
              {
                id: 'assess-risk',
                label: 'Risk Assessment',
                description: 'Detailed risk analysis and mitigation',
                category: 'analysis'
              },
              {
                id: 'member-consensus',
                label: 'Consensus Analysis',
                description: 'Predict member voting patterns',
                category: 'analysis'
              },
              {
                id: 'generate-memo',
                label: 'Generate Investment Memo',
                description: 'Create investment committee memo',
                category: 'reporting'
              }
            ]}
          />
        </div>

        {/* Context Panel */}
        {!contextPanelCollapsed && (
          <ContextPanel
            project={selectedProject || undefined}
            projectType="investment-committee"
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

export default InvestmentCommitteeAutonomous;