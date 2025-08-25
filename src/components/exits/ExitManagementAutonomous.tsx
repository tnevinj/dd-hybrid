'use client';

import React, { useState, useEffect } from 'react';
import { AutonomousLayout } from '@/components/autonomous/AutonomousLayout';
import { AutonomousNavMenu } from '@/components/autonomous/AutonomousNavMenu';
import { AutonomousBreadcrumb } from '@/components/autonomous/AutonomousBreadcrumb';
import { ChatInterface, ProjectSelector, ContextPanel } from '@/components/autonomous';
import { useAutonomousStore } from '@/stores/autonomous-store';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Settings, Menu, X, Brain, Zap, Target, TrendingUp } from 'lucide-react';
import { getAutonomousConfig, generateMockProjects, getAvailableActions, generateContextData } from '@/lib/autonomous-mode-config';
import type { HybridMode } from '@/components/shared';
import type { Project } from '@/stores/autonomous-store';

interface ExitManagementAutonomousProps {
  onSwitchMode?: (mode: HybridMode) => void;
}

export function ExitManagementAutonomous({ onSwitchMode }: ExitManagementAutonomousProps) {
  const {
    selectedProject,
    selectProject,
    setActiveProjectType,
    sidebarCollapsed,
    contextPanelCollapsed,
    toggleSidebar,
    toggleContextPanel,
    setExitProjects
  } = useAutonomousStore();

  const [showSettings, setShowSettings] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(64);

  // Initialize autonomous exit management
  React.useEffect(() => {
    setActiveProjectType('exit');
    
    // Load autonomous exit projects
    const loadAutonomousExitData = async () => {
      try {
        // For now, generate mock autonomous exit projects
        const mockProjects = generateMockProjects('exit', 5);
        const exitProjects: Project[] = mockProjects.map(project => ({
          id: project.id,
          name: project.name,
          type: 'exit' as Project['type'],
          status: project.status === 'paused' ? 'draft' : project.status as Project['status'],
          lastActivity: project.lastActivity,
          priority: project.priority,
          unreadMessages: project.unreadMessages || 0,
          metadata: {
            ...project.metadata,
            aiScore: Math.floor(Math.random() * 30) + 70, // 70-100 AI score
            autonomousActions: Math.floor(Math.random() * 15) + 5, // 5-20 actions
            marketTiming: ['excellent', 'good', 'fair'][Math.floor(Math.random() * 3)],
            exitStrategy: ['Strategic Sale', 'IPO', 'Management Buyout', 'Secondary Sale'][Math.floor(Math.random() * 4)],
            targetValue: Math.floor(Math.random() * 200) + 50 // 50-250M
          }
        }));
        
        setExitProjects(exitProjects);
        
        // Auto-select first project if none selected
        if (!selectedProject && exitProjects.length > 0) {
          selectProject(exitProjects[0]);
        }
      } catch (error) {
        console.error('Failed to load autonomous exit data:', error);
      }
    };

    loadAutonomousExitData();
  }, [setActiveProjectType, setExitProjects, selectedProject, selectProject]);

  // Exit-specific autonomous configuration
  const exitConfig = {
    module: 'exit-management',
    capabilities: [
      'Autonomous exit opportunity identification',
      'Self-managing exit preparation workflows', 
      'Automated market timing optimization',
      'Real-time exit process orchestration',
      'Continuous exit strategy optimization'
    ],
    aiActions: [
      'Monitor market conditions for optimal exit timing',
      'Automatically prepare exit documentation',
      'Coordinate with investment committee workflows',
      'Generate predictive exit valuations',
      'Manage stakeholder communications'
    ]
  };

  const availableActions = getAvailableActions('exit');
  const contextData = selectedProject ? generateContextData('exit', selectedProject.id) : null;

  const handleExitAutonomous = () => {
    if (onSwitchMode) {
      onSwitchMode('traditional');
    }
  };

  const navigationItems = [
    { id: 'pipeline', label: 'Exit Pipeline', icon: Target },
    { id: 'analytics', label: 'Autonomous Analytics', icon: TrendingUp },
    { id: 'workflows', label: 'Self-Managing Workflows', icon: Zap },
    { id: 'intelligence', label: 'Market Intelligence', icon: Brain }
  ];

  return (
    <AutonomousLayout
      title="Autonomous Exit Management"
      subtitle="AI-driven exit strategy and process orchestration"
      headerHeight={headerHeight}
      onExitAutonomous={handleExitAutonomous}
    >
      <div className="flex h-full">
        {/* Left Sidebar - Collapsible Navigation */}
        <div className={`bg-white border-r transition-all duration-300 ${
          sidebarCollapsed ? 'w-16' : 'w-80'
        }`}>
          <div className="p-4">
            <div className="flex items-center justify-between mb-6">
              {!sidebarCollapsed && (
                <h2 className="text-lg font-semibold flex items-center">
                  <Target className="h-5 w-5 mr-2 text-blue-600" />
                  Exit Projects
                </h2>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleSidebar}
                className="h-8 w-8 p-0"
              >
                {sidebarCollapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
              </Button>
            </div>
            
            <ProjectSelector 
              collapsed={sidebarCollapsed}
              projectType="exit"
            />
            
            {!sidebarCollapsed && (
              <div className="mt-6">
                <AutonomousNavMenu items={navigationItems} />
              </div>
            )}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Breadcrumb */}
          <div className="bg-white border-b px-6 py-3">
            <AutonomousBreadcrumb 
              items={[
                { label: 'Exit Management', href: '/exits' },
                { label: selectedProject?.name || 'Select Project' }
              ]}
            />
          </div>

          {/* Chat Interface */}
          <div className="flex-1 flex">
            <div className="flex-1 min-w-0">
              <ChatInterface 
                projectType="exit"
                config={exitConfig}
                placeholder="Ask me about exit strategies, market timing, valuation analysis, or any exit management question..."
                welcomeMessage={`Welcome to Autonomous Exit Management! I'm here to help you optimize exit strategies and timing for ${selectedProject?.name || 'your portfolio companies'}. 

I can help you with:
🎯 Exit opportunity identification and scoring
📊 Market timing analysis and predictions  
💼 Autonomous exit preparation workflows
📈 Valuation modeling and optimization
🤝 Stakeholder coordination and communications

What would you like to focus on today?`}
              />
            </div>
          </div>
        </div>

        {/* Right Context Panel */}
        <div className={`bg-white border-l transition-all duration-300 ${
          contextPanelCollapsed ? 'w-16' : 'w-80'
        }`}>
          <div className="p-4">
            <div className="flex items-center justify-between mb-6">
              {!contextPanelCollapsed && (
                <h2 className="text-lg font-semibold flex items-center">
                  <Brain className="h-5 w-5 mr-2 text-purple-600" />
                  Context
                </h2>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleContextPanel}
                className="h-8 w-8 p-0"
              >
                {contextPanelCollapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
              </Button>
            </div>
            
            <ContextPanel 
              collapsed={contextPanelCollapsed}
              projectType="exit"
              data={contextData}
            />
          </div>
        </div>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Autonomous Settings</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSettings(false)}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Exit Management Capabilities</h4>
                <div className="space-y-2">
                  {exitConfig.capabilities.map((capability, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm">{capability}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Active AI Actions</h4>
                <div className="space-y-2">
                  {exitConfig.aiActions.map((action, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Zap className="w-3 h-3 text-blue-500" />
                      <span className="text-sm">{action}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <Button 
                  onClick={() => setShowSettings(false)}
                  className="w-full"
                >
                  Close Settings
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AutonomousLayout>
  );
}