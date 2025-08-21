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
import { Settings, Menu, X, TrendingUp } from 'lucide-react';
import type { HybridMode } from '@/components/shared';

interface Project {
  id: string;
  name: string;
  type: 'market' | 'sector' | 'trend' | 'research' | 'forecast';
  status: 'active' | 'completed' | 'draft' | 'review';
  lastActivity: Date;
  priority: 'high' | 'medium' | 'low';
  unreadMessages?: number;
  metadata?: {
    sector?: string;
    geography?: string;
    timeframe?: string;
    confidence?: number;
    impact?: string;
    aiScore?: number;
  };
}

interface MarketIntelligenceAutonomousProps {
  onSwitchMode?: (mode: HybridMode) => void;
}

export function MarketIntelligenceAutonomous({ onSwitchMode }: MarketIntelligenceAutonomousProps) {
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
    setActiveProjectType('market-intelligence');
    
    const mockProjects: Project[] = [
      {
        id: 'tech-sector-analysis',
        name: 'Global Technology Sector Analysis Q1 2024',
        type: 'sector',
        status: 'active',
        lastActivity: new Date(Date.now() - 1800000),
        priority: 'high',
        unreadMessages: 6,
        metadata: {
          sector: 'Technology',
          geography: 'Global',
          timeframe: 'Q1 2024',
          confidence: 94,
          impact: 'High',
          aiScore: 92
        }
      },
      {
        id: 'esg-trend-forecast',
        name: 'ESG Investment Trend Forecasting',
        type: 'forecast',
        status: 'review',
        lastActivity: new Date(Date.now() - 3600000),
        priority: 'high',
        unreadMessages: 3,
        metadata: {
          sector: 'ESG/Sustainable',
          geography: 'North America',
          timeframe: '2024-2025',
          confidence: 89,
          impact: 'Very High',
          aiScore: 96
        }
      }
    ];
    
    setProjectsForType('market-intelligence', mockProjects);
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
              currentModule="market-intelligence"
              onNavigate={(moduleId) => {
                const routes: Record<string, string> = {
                  'market-intelligence': '/market-intelligence',
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
                currentModule="market-intelligence"
                projectName={selectedProject?.name || 'Select market analysis'}
              />
            </div>
          </div>

          <div className="flex items-center space-x-1 sm:space-x-3 flex-shrink-0">
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 hidden sm:inline-flex">
              AI Market Analyst
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
            projectType="market-intelligence"
            selectedProjectId={selectedProject?.id}
            onProjectSelect={selectProject}
          />
        )}

        <div className="flex-1">
          <ChatInterface
            projectId={selectedProject?.id}
            projectName={selectedProject?.name}
            projectType="market-intelligence"
            contextData={selectedProject?.metadata}
            systemPrompt={selectedProject ? `You are an AI market intelligence analyst specializing in investment market analysis and forecasting. You're working on ${selectedProject.name}, ${selectedProject.type === 'sector' ? `a sector analysis for ${selectedProject.metadata?.sector}` : selectedProject.type === 'forecast' ? 'a market forecasting project' : 'a market research initiative'}.

Your capabilities include:
- Market trend analysis and prediction
- Sector-specific intelligence gathering
- Economic indicator monitoring
- Competitive landscape analysis
- Investment opportunity identification

${selectedProject.metadata?.confidence ? `Current analysis confidence: ${selectedProject.metadata.confidence}%. ` : ''}${selectedProject.metadata?.impact ? `Expected market impact: ${selectedProject.metadata.impact}. ` : ''}${selectedProject.metadata?.timeframe ? `Analysis timeframe: ${selectedProject.metadata.timeframe}. ` : ''}

Provide data-driven insights with clear confidence levels and actionable investment intelligence.` : undefined}
            availableActions={[
              {
                id: 'sector-analysis',
                label: 'Sector Analysis',
                description: 'Deep dive sector performance analysis',
                category: 'analysis'
              },
              {
                id: 'trend-forecast',
                label: 'Trend Forecasting',
                description: 'Predictive market trend analysis',
                category: 'forecasting'
              },
              {
                id: 'competitive-intel',
                label: 'Competitive Intelligence',
                description: 'Market competitive landscape analysis',
                category: 'intelligence'
              },
              {
                id: 'opportunity-scan',
                label: 'Opportunity Scanning',
                description: 'Investment opportunity identification',
                category: 'opportunities'
              }
            ]}
          />
        </div>

        {!contextPanelCollapsed && (
          <ContextPanel
            project={selectedProject || undefined}
            projectType="market-intelligence"
          />
        )}
      </div>
    </AutonomousLayout>
  );
}

export default MarketIntelligenceAutonomous;