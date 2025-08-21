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
import { Settings, Menu, X, BarChart3 } from 'lucide-react';
import type { HybridMode } from '@/components/shared';

interface Project {
  id: string;
  name: string;
  type: 'model' | 'analysis' | 'forecast' | 'research';
  status: 'active' | 'completed' | 'draft' | 'review';
  lastActivity: Date;
  priority: 'high' | 'medium' | 'low';
  unreadMessages?: number;
  metadata?: {
    modelType?: string;
    dataSize?: string;
    accuracy?: number;
    confidence?: number;
    aiScore?: number;
  };
}

interface AdvancedAnalyticsAutonomousProps {
  onSwitchMode?: (mode: HybridMode) => void;
}

export function AdvancedAnalyticsAutonomous({ onSwitchMode }: AdvancedAnalyticsAutonomousProps) {
  const {
    selectedProject,
    setActiveProjectType,
    setProjectsForType,
    sidebarCollapsed,
    contextPanelCollapsed,
    toggleSidebar,
    selectProject
  } = useAutonomousStore();

  const [showSettings, setShowSettings] = useState(false);
  const { exitAutonomous, navigateToModule } = useAutonomousMode();

  React.useEffect(() => {
    setActiveProjectType('advanced-analytics');
    
    const mockProjects: Project[] = [
      {
        id: 'portfolio-optimization',
        name: 'Deep Learning Portfolio Optimization Model',
        type: 'model',
        status: 'active',
        lastActivity: new Date(Date.now() - 1200000),
        priority: 'high',
        unreadMessages: 5,
        metadata: {
          modelType: 'Neural Network',
          dataSize: '2.4M data points',
          accuracy: 97,
          confidence: 94,
          aiScore: 96
        }
      },
      {
        id: 'risk-prediction',
        name: 'Predictive Risk Assessment Framework',
        type: 'forecast',
        status: 'active',
        lastActivity: new Date(Date.now() - 2400000),
        priority: 'high',
        unreadMessages: 3,
        metadata: {
          modelType: 'Ensemble',
          dataSize: '1.8M records',
          accuracy: 89,
          confidence: 91,
          aiScore: 92
        }
      }
    ];
    
    setProjectsForType('advanced-analytics', mockProjects);
  }, [setActiveProjectType, setProjectsForType]);

  return (
    <AutonomousLayout>
      <div className="autonomous-header px-4 py-3">
        <div className="flex items-center justify-between min-h-[56px]">
          <div className="flex items-center space-x-2 sm:space-x-4 flex-1 min-w-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleSidebar}
              className="lg:hidden flex-shrink-0"
            >
              {sidebarCollapsed ? <Menu className="w-4 h-4" /> : <X className="w-4 h-4" />}
            </Button>
            
            <AutonomousNavMenu 
              currentModule="advanced-analytics"
              onNavigate={(moduleId) => {
                const routes: Record<string, string> = {
                  'advanced-analytics': '/advanced-analytics',
                  dashboard: '/dashboard'
                };
                if (routes[moduleId]) {
                  navigateToModule(routes[moduleId], true);
                }
              }}
              className="hidden sm:block"
            />
            
            <div className="hidden sm:block flex-1 min-w-0">
              <AutonomousBreadcrumb 
                currentModule="advanced-analytics"
                projectName={selectedProject?.name || 'Select analytics model'}
              />
            </div>
          </div>

          <div className="flex items-center space-x-1 sm:space-x-3 flex-shrink-0">
            <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200 hidden sm:inline-flex">
              AI Analytics Engine
            </Badge>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => onSwitchMode?.('assisted') || exitAutonomous('assisted')}
            >
              Exit Autonomous
            </Button>
            
            <Button variant="ghost" size="sm" onClick={() => setShowSettings(!showSettings)}>
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="autonomous-content">
        {!sidebarCollapsed && (
          <ProjectSelector
            projectType="advanced-analytics"
            selectedProjectId={selectedProject?.id}
            onProjectSelect={selectProject}
          />
        )}

        <div className="flex-1">
          <ChatInterface
            projectId={selectedProject?.id}
            projectName={selectedProject?.name}
            projectType="advanced-analytics"
            contextData={selectedProject?.metadata}
            systemPrompt={selectedProject ? `You are an AI advanced analytics specialist with expertise in machine learning, statistical modeling, and data science. You're working on ${selectedProject.name}, ${selectedProject.type === 'model' ? `a ${selectedProject.metadata?.modelType || 'machine learning'} model` : selectedProject.type === 'forecast' ? 'a predictive forecasting system' : 'an analytics project'}.

Your capabilities include:
- Advanced statistical modeling and machine learning
- Predictive analytics and forecasting
- Data mining and pattern recognition  
- Model optimization and performance tuning
- Multi-dimensional data analysis

${selectedProject.metadata?.accuracy ? `Current model accuracy: ${selectedProject.metadata.accuracy}%. ` : ''}${selectedProject.metadata?.dataSize ? `Processing: ${selectedProject.metadata.dataSize}. ` : ''}${selectedProject.metadata?.confidence ? `Confidence level: ${selectedProject.metadata.confidence}%. ` : ''}

Provide sophisticated analytical insights with statistical rigor and clear methodology explanations.` : undefined}
            availableActions={[
              {
                id: 'build-model',
                label: 'Build ML Model',
                description: 'Create advanced machine learning model',
                category: 'modeling'
              },
              {
                id: 'optimize-performance',
                label: 'Optimize Model',
                description: 'Enhance model performance and accuracy',
                category: 'optimization'
              },
              {
                id: 'predictive-analysis',
                label: 'Predictive Analysis',
                description: 'Generate forecasts and predictions',
                category: 'forecasting'
              },
              {
                id: 'data-insights',
                label: 'Extract Insights',
                description: 'Deep data analysis and pattern recognition',
                category: 'insights'
              }
            ]}
          />
        </div>

        {!contextPanelCollapsed && (
          <ContextPanel
            project={selectedProject || undefined}
            projectType="advanced-analytics"
          />
        )}
      </div>
    </AutonomousLayout>
  );
}

export default AdvancedAnalyticsAutonomous;