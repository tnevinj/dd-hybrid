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
import { Settings, Menu, X } from 'lucide-react';
import { useDealStructuring } from '@/hooks/use-deal-structuring';

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
    dealValue?: number;
    sector?: string;
    geography?: string;
    stage?: string;
    riskRating?: 'low' | 'medium' | 'high';
    confidenceScore?: number;
    workProductId?: string;
    workProductTitle?: string;
  };
}

interface DealStructuringAutonomousProps {
  onSwitchMode?: (mode: 'traditional' | 'assisted' | 'autonomous') => void;
}

export function DealStructuringAutonomous({ onSwitchMode }: DealStructuringAutonomousProps) {
  const {
    selectedProject,
    projects,
    selectProject,
    setActiveProjectType,
    setDealStructuringProjects,
    sidebarCollapsed,
    contextPanelCollapsed,
    toggleSidebar,
    toggleContextPanel
  } = useAutonomousStore();

  const { deals, isLoading } = useDealStructuring();
  const [showSettings, setShowSettings] = useState(false);
  const { exitAutonomous, navigateToModule } = useAutonomousMode();

  // Initialize project type for deal structuring and load data
  React.useEffect(() => {
    setActiveProjectType('deal-structuring');
    
    // Convert deal structuring deals to autonomous projects format
    if (deals && deals.length > 0) {
      const projects: Project[] = deals.map((deal) => ({
        id: deal.id,
        name: deal.name,
        type: 'analysis' as const,
        status: deal.stage === 'STRUCTURING' ? 'active' : 
               deal.stage === 'INVESTMENT_COMMITTEE' ? 'review' : 
               deal.stage === 'DUE_DILIGENCE' ? 'draft' : 'active',
        lastActivity: deal.lastUpdated,
        priority: (deal.keyMetrics?.irr || 0) > 22 ? 'high' : 
                 (deal.keyMetrics?.irr || 0) > 18 ? 'medium' : 'low',
        unreadMessages: deal.aiRecommendations?.length || 0,
        metadata: {
          progress: deal.progress,
          team: deal.team.map(t => t.name),
          dealValue: deal.targetValue,
          sector: deal.type.replace(/_/g, ' '),
          geography: 'North America', // Default
          stage: deal.stage.replace(/_/g, ' '),
          riskRating: deal.riskLevel as 'low' | 'medium' | 'high',
          confidenceScore: 0.85, // Default confidence
          workProductId: `deal-structure-${deal.id}`,
          workProductTitle: `${deal.name} Structure Analysis`
        }
      }));
      
      setDealStructuringProjects(projects);
    }
  }, [setActiveProjectType, setDealStructuringProjects, deals]);

  const handleProjectSelect = (project: Project) => {
    selectProject(project);
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
              currentModule="deal-structuring"
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
                Deal Structuring
              </h1>
            </div>
            
            {/* Breadcrumb - Hidden on mobile to save space */}
            <div className="hidden sm:block flex-1 min-w-0">
              <AutonomousBreadcrumb 
                currentModule="deal-structuring"
                projectName={selectedProject ? selectedProject.name : 'Select deal'}
              />
            </div>
          </div>

          <div className="flex items-center space-x-1 sm:space-x-3 flex-shrink-0">
            <Badge 
              variant="outline" 
              className="bg-blue-50 text-blue-700 border-blue-200 hidden sm:inline-flex"
            >
              AI Structuring
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

      {/* Main content with 3-panel layout */}
      <div className="autonomous-content">
          {/* Project Selector - Left Panel */}
          <div className={`${sidebarCollapsed ? 'w-0' : 'w-80'} transition-all duration-300 overflow-hidden border-r border-gray-200 bg-white`}>
            <ProjectSelector
              projects={projects['deal-structuring'] || []}
              selectedProject={selectedProject}
              onProjectSelect={handleProjectSelect}
              projectType="deal-structuring"
              isLoading={isLoading}
              showCreateButton={false}
              customMetadata={(project) => ({
                dealValue: project.metadata?.dealValue,
                stage: project.metadata?.stage,
                riskRating: project.metadata?.riskRating,
                progress: project.metadata?.progress
              })}
            />
          </div>

          {/* Chat Interface - Center Panel */}
          <div className="flex-1 flex flex-col">
            {selectedProject ? (
              <ChatInterface
                projectId={selectedProject.id}
                projectName={selectedProject.name}
                projectType="deal-structuring"
                contextData={{
                  dealValue: selectedProject.metadata?.dealValue,
                  stage: selectedProject.metadata?.stage,
                  riskRating: selectedProject.metadata?.riskRating,
                  progress: selectedProject.metadata?.progress,
                  sector: selectedProject.metadata?.sector,
                  team: selectedProject.metadata?.team
                }}
                systemPrompt={`You are an AI assistant specializing in deal structuring. You're working on ${selectedProject.name}, a ${selectedProject.metadata?.sector} deal worth ${selectedProject.metadata?.dealValue ? `$${(selectedProject.metadata.dealValue / 1000000).toFixed(1)}M` : 'TBD'} currently in ${selectedProject.metadata?.stage} stage.

Your capabilities include:
- Financial modeling and structure optimization
- Risk analysis and mitigation strategies  
- Template and pattern matching from similar deals
- Automated workflow management
- Real-time market data integration

You can execute tasks autonomously when confidence is high, but always ask for approval on high-impact decisions like:
- Major structural changes (>$10M impact)
- High-risk recommendations
- Timeline modifications
- Team assignments

Focus on being proactive and providing actionable insights while maintaining transparency about your reasoning and confidence levels.`}
                availableActions={[
                  {
                    id: 'generate-financial-model',
                    label: 'Generate Financial Model',
                    description: 'Create detailed DCF/LBO analysis',
                    category: 'modeling'
                  },
                  {
                    id: 'analyze-risk-factors',
                    label: 'Analyze Risk Factors',
                    description: 'Comprehensive risk assessment',
                    category: 'analysis'
                  },
                  {
                    id: 'find-similar-deals',
                    label: 'Find Similar Deals',
                    description: 'Pattern matching and benchmarking',
                    category: 'research'
                  },
                  {
                    id: 'optimize-structure',
                    label: 'Optimize Structure',
                    description: 'Recommend structural improvements',
                    category: 'optimization'
                  },
                  {
                    id: 'schedule-meetings',
                    label: 'Schedule Meetings',
                    description: 'Coordinate team and stakeholder meetings',
                    category: 'workflow'
                  },
                  {
                    id: 'prepare-ic-materials',
                    label: 'Prepare IC Materials',
                    description: 'Generate investment committee presentation',
                    category: 'reporting'
                  }
                ]}
              />
            ) : (
              <div className="flex-1 flex items-center justify-center bg-gray-50">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Settings className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Select a Deal Structure
                  </h3>
                  <p className="text-gray-500 max-w-sm">
                    Choose a deal from the sidebar to start the AI-assisted structuring conversation
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Context Panel - Right Panel */}
          <div className={`${contextPanelCollapsed ? 'w-0' : 'w-80'} transition-all duration-300 overflow-hidden border-l border-gray-200 bg-white`}>
            <ContextPanel
              project={selectedProject}
              projectType="deal-structuring"
              onToggle={toggleContextPanel}
              customSections={selectedProject ? [
                {
                  id: 'deal-metrics',
                  title: 'Deal Metrics',
                  content: (
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Deal Value</span>
                        <span className="text-sm font-medium">
                          {selectedProject.metadata?.dealValue ? 
                            `$${(selectedProject.metadata.dealValue / 1000000).toFixed(1)}M` : 'TBD'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Stage</span>
                        <span className="text-sm font-medium">{selectedProject.metadata?.stage || 'TBD'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Risk Rating</span>
                        <Badge 
                          variant={selectedProject.metadata?.riskRating === 'high' ? 'destructive' : 
                                  selectedProject.metadata?.riskRating === 'medium' ? 'secondary' : 'default'}
                          className="text-xs"
                        >
                          {selectedProject.metadata?.riskRating || 'TBD'}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Progress</span>
                        <span className="text-sm font-medium">{selectedProject.metadata?.progress || 0}%</span>
                      </div>
                    </div>
                  )
                },
                {
                  id: 'team-info',
                  title: 'Team Members',
                  content: (
                    <div className="space-y-2">
                      {selectedProject.metadata?.team?.map((member, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
                            <span className="text-xs text-gray-600">
                              {member.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <span className="text-sm text-gray-900">{member}</span>
                        </div>
                      )) || (
                        <p className="text-sm text-gray-500">No team members assigned</p>
                      )}
                    </div>
                  )
                }
              ] : []}
            />
          </div>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-lg font-medium mb-4">Autonomous Settings</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Auto-execute low-risk actions</span>
                <Button variant="outline" size="sm">Toggle</Button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Enable notifications</span>
                <Button variant="outline" size="sm">Toggle</Button>
              </div>
            </div>
            <div className="flex justify-end mt-6">
              <Button onClick={() => setShowSettings(false)}>Close</Button>
            </div>
          </div>
        </div>
      )}
    </AutonomousLayout>
  );
}

export default DealStructuringAutonomous;