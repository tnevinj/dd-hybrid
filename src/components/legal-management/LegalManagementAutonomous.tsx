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
import { Settings, Menu, X, Scale } from 'lucide-react';
import type { HybridMode } from '@/components/shared';

interface Project {
  id: string;
  name: string;
  type: 'portfolio' | 'deal' | 'company' | 'report' | 'analysis' | 'legal' | 'contract' | 'compliance';
  status: 'active' | 'completed' | 'draft' | 'review';
  lastActivity: Date;
  priority: 'high' | 'medium' | 'low';
  unreadMessages?: number;
  metadata?: {
    value?: string;
    progress?: number;
    team?: string[];
    documentType?: string;
    contractValue?: number;
    deadlineDate?: string;
    complianceStatus?: string;
    riskLevel?: string;
    aiScore?: number;
    workProductId?: string;
    workProductTitle?: string;
  };
}

interface LegalManagementAutonomousProps {
  onSwitchMode?: (mode: HybridMode) => void;
}

export function LegalManagementAutonomous({ onSwitchMode }: LegalManagementAutonomousProps) {
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

  // Initialize project type for legal management and load data
  React.useEffect(() => {
    setActiveProjectType('legal-management');
    
    // Create mock legal management projects
    const mockProjects: Project[] = [
      {
        id: 'contract-techcorp',
        name: 'TechCorp Service Agreement Review',
        type: 'contract',
        status: 'active',
        lastActivity: new Date(Date.now() - 1800000), // 30 min ago
        priority: 'high',
        unreadMessages: 4,
        metadata: {
          progress: 78,
          team: ['Sarah Johnson', 'Legal AI', 'Michael Chen'],
          documentType: 'Service Agreement',
          contractValue: 2500000,
          deadlineDate: '2024-03-28',
          complianceStatus: 'Under Review',
          riskLevel: 'Medium',
          aiScore: 87,
          workProductId: 'wp-techcorp-contract',
          workProductTitle: 'TechCorp Contract Analysis Report'
        }
      },
      {
        id: 'compliance-esg',
        name: 'Q1 2024 ESG Compliance Assessment',
        type: 'compliance',
        status: 'review',
        lastActivity: new Date(Date.now() - 3600000), // 1 hour ago
        priority: 'high',
        unreadMessages: 2,
        metadata: {
          progress: 92,
          team: ['Rachel Martinez', 'Compliance AI', 'David Kim'],
          documentType: 'Compliance Report',
          deadlineDate: '2024-03-30',
          complianceStatus: 'Compliant',
          riskLevel: 'Low',
          aiScore: 95,
          workProductId: 'wp-esg-compliance',
          workProductTitle: 'ESG Compliance Analysis'
        }
      },
      {
        id: 'fund-docs-iv',
        name: 'Growth Fund IV Documentation Update',
        type: 'legal',
        status: 'active',
        lastActivity: new Date(Date.now() - 7200000), // 2 hours ago
        priority: 'medium',
        unreadMessages: 1,
        metadata: {
          progress: 65,
          team: ['Alex Thompson', 'Document AI', 'Lisa Wang'],
          documentType: 'Fund Documents',
          deadlineDate: '2024-04-05',
          complianceStatus: 'In Progress',
          riskLevel: 'Low',
          aiScore: 91,
          workProductId: 'wp-fund-docs',
          workProductTitle: 'Fund IV Legal Documentation'
        }
      },
      {
        id: 'regulatory-analysis',
        name: 'New Regulatory Framework Impact Analysis',
        type: 'analysis',
        status: 'draft',
        lastActivity: new Date(Date.now() - 10800000), // 3 hours ago
        priority: 'high',
        unreadMessages: 3,
        metadata: {
          progress: 45,
          team: ['Legal Research AI', 'Sarah Park', 'Kevin Liu'],
          documentType: 'Regulatory Analysis',
          deadlineDate: '2024-04-10',
          complianceStatus: 'Research Phase',
          riskLevel: 'High',
          aiScore: 82,
          workProductId: 'wp-regulatory-analysis',
          workProductTitle: 'Regulatory Impact Assessment'
        }
      }
    ];
    
    setProjectsForType('legal-management', mockProjects);
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
              currentModule="legal-management"
              onNavigate={(moduleId) => {
                const moduleRoutes: Record<string, string> = {
                  dashboard: '/dashboard',
                  workspaces: '/workspaces',
                  'due-diligence': '/due-diligence',
                  portfolio: '/portfolio',
                  'deal-screening': '/deal-screening',
                  'deal-structuring': '/deal-structuring',
                  'investment-committee': '/investment-committee',
                  'legal-management': '/legal-management'
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
                Legal Management
              </h1>
            </div>
            
            {/* Breadcrumb - Hidden on mobile to save space */}
            <div className="hidden sm:block flex-1 min-w-0">
              <AutonomousBreadcrumb 
                currentModule="legal-management"
                projectName={selectedProject ? selectedProject.name : 'Select legal matter'}
              />
            </div>
          </div>

          <div className="flex items-center space-x-1 sm:space-x-3 flex-shrink-0">
            <Badge 
              variant="outline" 
              className="bg-red-50 text-red-700 border-red-200 hidden sm:inline-flex"
            >
              AI Legal Counsel
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
            projectType="legal-management"
            selectedProjectId={selectedProject?.id}
            onProjectSelect={handleProjectSelect}
          />
        )}

        {/* Chat Interface */}
        <div className="flex-1">
          <ChatInterface
            projectId={selectedProject?.id}
            projectName={selectedProject?.name}
            projectType="legal-management"
            contextData={selectedProject?.metadata}
            systemPrompt={selectedProject ? `You are an AI legal counsel specializing in private equity and investment management legal matters. You're working on ${selectedProject.name}, ${selectedProject.type === 'contract' ? `a contract review with ${selectedProject.metadata?.contractValue ? `$${(selectedProject.metadata.contractValue / 1000000).toFixed(1)}M` : 'significant'} value` : selectedProject.type === 'compliance' ? 'a compliance assessment' : 'a legal analysis'}.

Your capabilities include:
- Contract analysis and risk assessment
- Regulatory compliance monitoring and reporting  
- Legal document drafting and review
- Due diligence legal support
- Regulatory change impact analysis

${selectedProject.metadata?.riskLevel ? `Current risk assessment: ${selectedProject.metadata.riskLevel}. ` : ''}${selectedProject.metadata?.complianceStatus ? `Compliance status: ${selectedProject.metadata.complianceStatus}. ` : ''}${selectedProject.metadata?.aiScore ? `AI legal score: ${selectedProject.metadata.aiScore}%. ` : ''}

Provide precise legal analysis while maintaining appropriate disclaimers about the need for human legal review for final decisions.` : undefined}
            availableActions={[
              {
                id: 'analyze-contract',
                label: 'Contract Analysis',
                description: 'Comprehensive contract risk and compliance review',
                category: 'analysis'
              },
              {
                id: 'compliance-check',
                label: 'Compliance Check',
                description: 'Regulatory compliance verification',
                category: 'compliance'
              },
              {
                id: 'risk-assessment',
                label: 'Risk Assessment',
                description: 'Legal risk analysis and mitigation',
                category: 'analysis'
              },
              {
                id: 'draft-document',
                label: 'Draft Document',
                description: 'Generate legal document draft',
                category: 'drafting'
              },
              {
                id: 'regulatory-update',
                label: 'Regulatory Update',
                description: 'Latest regulatory changes impact',
                category: 'research'
              }
            ]}
          />
        </div>

        {/* Context Panel */}
        {!contextPanelCollapsed && (
          <ContextPanel
            project={selectedProject || undefined}
            projectType="legal-management"
          />
        )}
      </div>
    </AutonomousLayout>
  );
}

export default LegalManagementAutonomous;