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
import { Settings, Menu, X, Calculator } from 'lucide-react';
import type { HybridMode } from '@/components/shared';

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
    fundType?: string;
    vintage?: number;
    targetSize?: number;
    commitments?: number;
    called?: number;
    nav?: number;
    irr?: number;
    dpi?: number;
    workProductId?: string;
    workProductTitle?: string;
  };
}

interface FundOperationsAutonomousProps {
  onSwitchMode?: (mode: HybridMode) => void;
}

export function FundOperationsAutonomous({ onSwitchMode }: FundOperationsAutonomousProps) {
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
  const { exitAutonomous, navigateToModule } = useAutonomousMode();

  // Initialize project type for fund operations and load mock data
  React.useEffect(() => {
    setActiveProjectType('fund-operations' as any);
    
    // Mock fund operations projects
    const fundProjects: Project[] = [
      {
        id: 'fund-growth-iv',
        name: 'Growth Fund IV',
        type: 'analysis',
        status: 'active',
        lastActivity: new Date(),
        priority: 'high',
        unreadMessages: 3,
        metadata: {
          value: '$450M',
          progress: 65,
          team: ['Sarah Chen', 'Michael Rodriguez', 'Lisa Wang'],
          fundType: 'Growth Equity',
          vintage: 2023,
          targetSize: 500000000,
          commitments: 450000000,
          called: 280000000,
          nav: 315000000,
          irr: 15.8,
          dpi: 0.28,
          workProductId: 'fund-ops-growth-iv',
          workProductTitle: 'Growth Fund IV Operations Management'
        }
      },
      {
        id: 'fund-tech-iii',
        name: 'Tech Fund III',
        type: 'analysis',
        status: 'review',
        lastActivity: new Date(Date.now() - 86400000), // 1 day ago
        priority: 'medium',
        unreadMessages: 1,
        metadata: {
          value: '$350M',
          progress: 85,
          team: ['David Kim', 'Jennifer Park', 'Alex Thompson'],
          fundType: 'Technology',
          vintage: 2022,
          targetSize: 350000000,
          commitments: 350000000,
          called: 250000000,
          nav: 285000000,
          irr: 22.1,
          dpi: 0.45,
          workProductId: 'fund-ops-tech-iii',
          workProductTitle: 'Tech Fund III Operations Management'
        }
      },
      {
        id: 'fund-healthcare-ii',
        name: 'Healthcare Fund II',
        type: 'analysis',
        status: 'completed',
        lastActivity: new Date(Date.now() - 172800000), // 2 days ago
        priority: 'low',
        unreadMessages: 0,
        metadata: {
          value: '$200M',
          progress: 95,
          team: ['Dr. Maria Garcia', 'Robert Chen'],
          fundType: 'Healthcare',
          vintage: 2021,
          targetSize: 200000000,
          commitments: 200000000,
          called: 185000000,
          nav: 195000000,
          irr: 18.3,
          dpi: 0.67,
          workProductId: 'fund-ops-healthcare-ii',
          workProductTitle: 'Healthcare Fund II Operations Management'
        }
      }
    ];
      
    setProjectsForType('fund-operations', fundProjects);
  }, [setActiveProjectType, setProjectsForType]);

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
              currentModule="fund-operations"
              onNavigate={(moduleId) => {
                const moduleRoutes: Record<string, string> = {
                  dashboard: '/dashboard',
                  workspaces: '/workspaces',
                  'due-diligence': '/due-diligence',
                  portfolio: '/portfolio',
                  'deal-screening': '/deal-screening',
                  'deal-structuring': '/deal-structuring',
                  'fund-operations': '/fund-operations'
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
                Fund Operations
              </h1>
            </div>
            
            {/* Breadcrumb - Hidden on mobile to save space */}
            <div className="hidden sm:block flex-1 min-w-0">
              <AutonomousBreadcrumb 
                currentModule="fund-operations"
                projectName={selectedProject ? selectedProject.name : 'Select fund'}
              />
            </div>
          </div>

          <div className="flex items-center space-x-1 sm:space-x-3 flex-shrink-0">
            <Badge 
              variant="outline" 
              className="bg-emerald-50 text-emerald-700 border-emerald-200 hidden sm:inline-flex"
            >
              AI Managing
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
              projects={projects['fund-operations'] || []}
              selectedProject={selectedProject}
              onProjectSelect={handleProjectSelect}
              projectType="fund-operations"
              isLoading={false}
              showCreateButton={false}
              customMetadata={(project) => ({
                fundType: project.metadata?.fundType,
                vintage: project.metadata?.vintage,
                targetSize: project.metadata?.targetSize,
                nav: project.metadata?.nav,
                irr: project.metadata?.irr,
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
                projectType={'fund-operations' as any}
                contextData={{
                  fundType: selectedProject.metadata?.fundType,
                  vintage: selectedProject.metadata?.vintage,
                  targetSize: selectedProject.metadata?.targetSize,
                  commitments: selectedProject.metadata?.commitments,
                  called: selectedProject.metadata?.called,
                  nav: selectedProject.metadata?.nav,
                  irr: selectedProject.metadata?.irr,
                  dpi: selectedProject.metadata?.dpi,
                  progress: selectedProject.metadata?.progress,
                  team: selectedProject.metadata?.team
                }}
                systemPrompt={`You are an AI assistant specializing in fund operations management. You're working on ${selectedProject.name}, a ${selectedProject.metadata?.fundType} fund (Vintage ${selectedProject.metadata?.vintage}) with $${((selectedProject.metadata?.targetSize || 0) / 1000000).toFixed(0)}M target size and ${selectedProject.metadata?.progress || 0}% operational completion.

Your capabilities include:
- Capital call automation and optimization
- Distribution processing and tax optimization  
- NAV calculation and validation
- LP reporting and communication automation
- Expense management and budget monitoring
- Regulatory compliance automation
- Performance analytics and benchmarking
- Cash flow forecasting and management

You can execute tasks autonomously when confidence is high, but always ask for approval on high-impact decisions like:
- Capital calls over $10M
- Distribution timing changes
- NAV adjustments over 2%
- New LP agreements
- Significant expense approvals (>$100K)
- Regulatory filing modifications

Current fund status:
- Target Size: $${((selectedProject.metadata?.targetSize || 0) / 1000000).toFixed(0)}M
- Commitments: $${((selectedProject.metadata?.commitments || 0) / 1000000).toFixed(0)}M
- Called Capital: $${((selectedProject.metadata?.called || 0) / 1000000).toFixed(0)}M
- Current NAV: $${((selectedProject.metadata?.nav || 0) / 1000000).toFixed(0)}M
- Net IRR: ${selectedProject.metadata?.irr || 0}%
- DPI: ${selectedProject.metadata?.dpi || 0}x

Focus on being proactive about upcoming capital calls, distribution opportunities, and operational efficiencies while maintaining regulatory compliance and LP satisfaction.`}
                availableActions={[
                  {
                    id: 'process-capital-call',
                    label: 'Process Capital Call',
                    description: 'Initiate and manage LP capital call',
                    category: 'workflow'
                  },
                  {
                    id: 'calculate-nav',
                    label: 'Calculate NAV',
                    description: 'Update and validate net asset value',
                    category: 'modeling'
                  },
                  {
                    id: 'process-distribution',
                    label: 'Process Distribution',
                    description: 'Execute LP distribution payments',
                    category: 'workflow'
                  },
                  {
                    id: 'generate-lp-report',
                    label: 'Generate LP Report',
                    description: 'Create quarterly investor report',
                    category: 'reporting'
                  },
                  {
                    id: 'optimize-cash-flow',
                    label: 'Optimize Cash Flow',
                    description: 'Analyze and improve capital deployment',
                    category: 'optimization'
                  },
                  {
                    id: 'monitor-compliance',
                    label: 'Monitor Compliance',
                    description: 'Check regulatory requirements',
                    category: 'analysis'
                  },
                  {
                    id: 'forecast-performance',
                    label: 'Forecast Performance',
                    description: 'Project fund returns and timeline',
                    category: 'modeling'
                  },
                  {
                    id: 'schedule-committee',
                    label: 'Schedule Committee',
                    description: 'Coordinate investment committee meeting',
                    category: 'workflow'
                  }
                ]}
              />
            ) : (
              <div className="flex-1 flex items-center justify-center bg-gray-50">
                <div className="text-center">
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Calculator className="w-8 h-8 text-emerald-600" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Select a Fund
                  </h3>
                  <p className="text-gray-500 max-w-sm">
                    Choose a fund from the sidebar to start AI-powered fund operations management
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Context Panel - Right Panel */}
          <div className={`${contextPanelCollapsed ? 'w-0' : 'w-80'} transition-all duration-300 overflow-hidden border-l border-gray-200 bg-white`}>
            <ContextPanel
              project={selectedProject}
              projectType={'fund-operations' as any}
              onToggle={toggleContextPanel}
              customSections={selectedProject ? [
                {
                  id: 'fund-metrics',
                  title: 'Fund Metrics',
                  content: (
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Fund Type</span>
                        <span className="text-sm font-medium">{selectedProject.metadata?.fundType || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Vintage</span>
                        <span className="text-sm font-medium">{selectedProject.metadata?.vintage || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Target Size</span>
                        <span className="text-sm font-medium">
                          {selectedProject.metadata?.targetSize ? 
                            `$${(selectedProject.metadata.targetSize / 1000000).toFixed(0)}M` : 'N/A'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Commitments</span>
                        <span className="text-sm font-medium">
                          {selectedProject.metadata?.commitments ? 
                            `$${(selectedProject.metadata.commitments / 1000000).toFixed(0)}M` : 'N/A'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Called Capital</span>
                        <span className="text-sm font-medium">
                          {selectedProject.metadata?.called ? 
                            `$${(selectedProject.metadata.called / 1000000).toFixed(0)}M` : 'N/A'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Current NAV</span>
                        <span className="text-sm font-medium">
                          {selectedProject.metadata?.nav ? 
                            `$${(selectedProject.metadata.nav / 1000000).toFixed(0)}M` : 'N/A'}
                        </span>
                      </div>
                    </div>
                  )
                },
                {
                  id: 'performance-metrics',
                  title: 'Performance',
                  content: (
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Net IRR</span>
                        <span className="text-sm font-medium text-green-600">
                          {selectedProject.metadata?.irr ? `${selectedProject.metadata.irr}%` : 'N/A'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">DPI</span>
                        <span className="text-sm font-medium">
                          {selectedProject.metadata?.dpi ? `${selectedProject.metadata.dpi}x` : 'N/A'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Operations Progress</span>
                        <span className="text-sm font-medium">{selectedProject.metadata?.progress || 0}%</span>
                      </div>
                      <div className="mt-4 p-3 bg-emerald-50 rounded-lg">
                        <p className="text-xs text-emerald-800 font-medium">AI Status</p>
                        <p className="text-xs text-emerald-700 mt-1">
                          Actively monitoring fund operations, 3 automation rules enabled
                        </p>
                      </div>
                    </div>
                  )
                },
                {
                  id: 'team-info',
                  title: 'Operations Team',
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
            <h3 className="text-lg font-medium mb-4">Fund Operations Autonomous Settings</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Auto-process capital calls under $5M</span>
                <Button variant="outline" size="sm">Toggle</Button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Auto-validate NAV calculations</span>
                <Button variant="outline" size="sm">Toggle</Button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Auto-generate LP reports</span>
                <Button variant="outline" size="sm">Toggle</Button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Enable compliance monitoring</span>
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

export default FundOperationsAutonomous;