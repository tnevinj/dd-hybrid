'use client'

import React, { useState, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  User, 
  Brain, 
  Bot,
  ChevronDown,
  Sparkles,
  Info
} from 'lucide-react'
import { useNavigationStore } from '@/stores/navigation-store'
import { UserNavigationMode } from '@/types/navigation'
import { WorkspaceTraditional } from './WorkspaceTraditional'
import { WorkspaceAssisted } from './WorkspaceAssisted'
import { WorkspaceAutonomous } from './WorkspaceAutonomous'
import { 
  ErrorBoundary, 
  HybridModeHeader, 
  HybridModeExplanation,
  type HybridMode 
} from '@/components/shared'

type WorkspaceMode = 'traditional' | 'assisted' | 'autonomous'

interface HybridWorkspaceProps {
  // Shared props that can be passed to all modes
  workspaces?: any[]
  metrics?: any
  isLoading?: boolean
  // Traditional mode specific props
  onCreateWorkspace?: () => void
  onViewWorkspace?: (id: string) => void
  onEditWorkspace?: (id: string) => void
  // Assisted mode specific props
  aiRecommendations?: any[]
  onExecuteAIAction?: (actionId: string) => void
  onDismissRecommendation?: (id: string) => void
  // Autonomous mode specific props
  chatMessages?: any[]
  automatedActions?: any[]
  onSendMessage?: (message: string) => void
  onApproveAction?: (actionId: string) => void
  onRejectAction?: (actionId: string) => void
  onPauseAutomation?: () => void
  onResumeAutomation?: () => void
}

export function HybridWorkspace({
  workspaces = [],
  metrics,
  isLoading = false,
  onCreateWorkspace,
  onViewWorkspace,
  onEditWorkspace,
  aiRecommendations = [],
  onExecuteAIAction,
  onDismissRecommendation,
  chatMessages = [],
  automatedActions = [],
  onSendMessage,
  onApproveAction,
  onRejectAction,
  onPauseAutomation,
  onResumeAutomation
}: HybridWorkspaceProps) {
  const { currentMode, setMode } = useNavigationStore()

  // Ensure currentMode is one of our valid workspace modes
  const workspaceMode: WorkspaceMode = ['traditional', 'assisted', 'autonomous'].includes(currentMode.mode as WorkspaceMode) 
    ? currentMode.mode as WorkspaceMode 
    : 'traditional'

  const currentModeConfig = {
    traditional: { label: 'I\'ll Drive', description: 'Complete manual control over workspace management' },
    assisted: { label: 'Help me Drive', description: 'AI-enhanced workspace management with intelligent recommendations' },
    autonomous: { label: 'You Drive', description: 'AI autonomously manages workspaces with your approval for key decisions' }
  }[workspaceMode]

  const handleModeChange = useCallback((newMode: WorkspaceMode) => {
    const newModeConfig: UserNavigationMode = {
      mode: newMode,
      aiPermissions: {
        suggestions: true,
        autoComplete: newMode !== 'traditional',
        proactiveActions: newMode === 'assisted' || newMode === 'autonomous',
        autonomousExecution: newMode === 'autonomous',
      },
      preferredDensity: currentMode.preferredDensity
    }
    setMode(newModeConfig)
  }, [setMode, currentMode.preferredDensity])


  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <h3 className="text-xl font-semibold text-gray-700">Loading Workspace Management...</h3>
      </div>
    )
  }

  return (
    <div className={workspaceMode === 'autonomous' ? 'h-screen' : 'min-h-screen bg-gray-50'}>
      {/* Header with Mode Switcher - Hidden for autonomous mode */}
      {workspaceMode !== 'autonomous' && (
        <HybridModeHeader
          currentMode={workspaceMode as HybridMode}
          onModeChange={handleModeChange}
          moduleContext="workspace"
          title="Hybrid Workspace Management"
          subtitle={currentModeConfig.description + " • Choose your experience mode"}
          disabled={isLoading}
          className="mb-6"
        />
      )}

      {/* Mode Explanation Banner - Hidden for autonomous mode */}
      {workspaceMode !== 'autonomous' && (
        <div className="max-w-7xl mx-auto px-6 mb-6">
          <HybridModeExplanation
            currentMode={workspaceMode as HybridMode}
            moduleContext="workspace"
            statistics={{
              efficiency: workspaceMode === 'traditional' ? 0 : workspaceMode === 'assisted' ? 30 : 60,
              automation: workspaceMode === 'traditional' ? 0 : workspaceMode === 'assisted' ? 45 : 85,
              accuracy: workspaceMode === 'traditional' ? 100 : workspaceMode === 'assisted' ? 115 : 125
            }}
          />
        </div>
      )}

      {/* Mode-Specific Content */}
      <div className={workspaceMode === 'autonomous' ? '' : 'max-w-7xl mx-auto px-6'}>
        {workspaceMode === 'traditional' && (
          <ErrorBoundary
            onError={(error, errorInfo) => console.error('Workspace Traditional View Error:', error, errorInfo)}
          >
            <WorkspaceTraditional
              workspaces={workspaces}
              metrics={metrics}
              isLoading={isLoading}
              onCreateWorkspace={onCreateWorkspace}
              onViewWorkspace={onViewWorkspace}
              onEditWorkspace={onEditWorkspace}
            />
          </ErrorBoundary>
        )}
        
        {workspaceMode === 'assisted' && (
          <ErrorBoundary
            onError={(error, errorInfo) => console.error('Workspace Assisted View Error:', error, errorInfo)}
          >
            <WorkspaceAssisted
              workspaces={workspaces}
              aiRecommendations={aiRecommendations}
              metrics={metrics}
              isLoading={isLoading}
              onCreateWorkspace={onCreateWorkspace}
              onViewWorkspace={onViewWorkspace}
              onEditWorkspace={onEditWorkspace}
              onExecuteAIAction={onExecuteAIAction}
              onDismissRecommendation={onDismissRecommendation}
            />
          </ErrorBoundary>
        )}
        
        {workspaceMode === 'autonomous' && (
          <ErrorBoundary
            onError={(error, errorInfo) => console.error('Workspace Autonomous View Error:', error, errorInfo)}
          >
            <WorkspaceAutonomous
              onSwitchMode={handleModeChange}
            />
          </ErrorBoundary>
        )}
      </div>
    </div>
  )
}

export default HybridWorkspace