'use client'

import * as React from 'react'
import { useState, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
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
import { useNavigationStoreRefactored } from '@/stores/navigation-store-refactored'
import { UserNavigationMode } from '@/types/navigation'
import { ModeNotification } from '@/components/ui/mode-notification'
import { WorkspaceTraditional } from './WorkspaceTraditional'
import { WorkspaceAssisted } from './WorkspaceAssisted'
import { WorkspaceAutonomous } from './WorkspaceAutonomous'
import { 
  ErrorBoundary, 
  HybridModeHeader, 
  HybridModeExplanation,
  type HybridMode 
} from '@/components/shared'
import { LoadingState } from '@/components/ui/loading-spinner'
import { ErrorDisplay } from '@/components/ui/error-display'
import { logger } from '@/lib/logger'

type WorkspaceMode = 'traditional' | 'assisted' | 'autonomous'

// Workspace AI State Interface
interface WorkspaceAIState {
  recommendations: Array<{
    id: string
    type: 'suggestion' | 'automation' | 'warning' | 'insight'
    priority: 'low' | 'medium' | 'high' | 'critical'
    title: string
    description: string
    actions: Array<{
      id: string
      label: string
      action: string
      primary?: boolean
      estimatedTimeSaving?: number
    }>
    confidence: number
    moduleContext: string
    timestamp: Date
    workspaceId?: string
  }>
  processingTasks: Array<{
    id: string
    type: string
    description: string
    progress: number
    estimatedCompletion: Date
  }>
  automatedActions: Array<{
    id: string
    action: string
    description: string
    timestamp: Date
    status: 'completed' | 'in_progress' | 'failed'
    rollbackable: boolean
  }>
  pendingApprovals: Array<{
    id: string
    action: string
    description: string
    risk: 'low' | 'medium' | 'high'
    impact: string[]
    requestedAt: Date
  }>
}

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
  workspaces: propWorkspaces,
  metrics: propMetrics,
  isLoading: propIsLoading = false,
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
  const { currentMode, setMode, setCurrentModule, addRecommendation } = useNavigationStoreRefactored()
  const router = useRouter()
  
  // Set current module for navigation store
  React.useEffect(() => {
    setCurrentModule('workspace')
  }, [setCurrentModule])

  // AI state management
  const [aiState, setAIState] = React.useState<WorkspaceAIState>({
    recommendations: [],
    processingTasks: [],
    automatedActions: [],
    pendingApprovals: []
  })
  
  // Local state for data fetching
  const [workspaces, setWorkspaces] = useState(propWorkspaces || [])
  const [metrics, setMetrics] = useState(propMetrics)
  const [isLoading, setIsLoading] = useState(propIsLoading)
  const [error, setError] = useState<string | null>(null)

  // Fetch workspace data if not provided as props
  useEffect(() => {
    if (!propWorkspaces) {
      fetchWorkspaces()
    }
  }, [propWorkspaces])

  const fetchWorkspaces = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const response = await fetch('/api/workspaces')
      if (!response.ok) {
        throw new Error(`Failed to fetch workspaces: ${response.statusText}`)
      }
      
      const data = await response.json()
      setWorkspaces(data.data || [])
      
      // Calculate metrics from the workspace data
      const totalWorkspaces = data.total || 0
      const activeWorkspaces = data.data?.filter((w: any) => w.status === 'active').length || 0
      const completedWorkspaces = data.data?.filter((w: any) => w.status === 'completed').length || 0
      const draftWorkspaces = data.data?.filter((w: any) => w.status === 'draft').length || 0
      
      setMetrics({
        total: totalWorkspaces,
        totalWorkspaces: totalWorkspaces,
        active: activeWorkspaces,
        activeWorkspaces: activeWorkspaces,
        completed: completedWorkspaces,
        completedWorkspaces: completedWorkspaces,
        draft: draftWorkspaces,
        inReview: data.data?.filter((w: any) => w.status === 'review').length || 0,
        teamMembers: data.data?.reduce((total: number, w: any) => total + (w.team?.length || 0), 0) || 0,
        avgProgress: totalWorkspaces > 0 ? Math.round(data.data?.reduce((sum: number, w: any) => sum + (w.progress || 0), 0) / totalWorkspaces) : 0
      })
      
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to load workspaces')
      logger.error('Error fetching workspaces', {
        module: 'workspace',
        action: 'fetch_workspaces',
        metadata: { endpoint: '/api/workspaces' }
      }, error)
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

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

  // Navigation handlers
  const handleViewWorkspace = useCallback((id: string) => {
    if (onViewWorkspace) {
      onViewWorkspace(id)
    } else {
      router.push(`/workspaces/${id}`)
    }
  }, [onViewWorkspace, router])

  const handleEditWorkspace = useCallback((id: string) => {
    if (onEditWorkspace) {
      onEditWorkspace(id)
    } else {
      router.push(`/workspaces/${id}?mode=edit`)
    }
  }, [onEditWorkspace, router])

  const handleCreateWorkspace = useCallback(() => {
    if (onCreateWorkspace) {
      onCreateWorkspace()
    } else {
      router.push('/workspaces/new')
    }
  }, [onCreateWorkspace, router])

  if (error) {
    return (
      <ErrorDisplay
        title="Error Loading Workspaces"
        error={error}
        onRetry={fetchWorkspaces}
      />
    )
  }

  if (isLoading) {
    return (
      <LoadingState
        isLoading={true}
        title="Loading Workspace Management..."
        description="Please wait while we load your workspaces and settings"
        size="lg"
      >
        <div></div>
      </LoadingState>
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
        <div className="p-4">
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
        {workspaceMode === 'traditional' && (
          <ErrorBoundary
            onError={(error, errorInfo) => console.error('Workspace Traditional View Error:', error, errorInfo)}
          >
            <WorkspaceTraditional
              workspaces={workspaces}
              metrics={metrics}
              isLoading={isLoading}
              onCreateWorkspace={handleCreateWorkspace}
              onViewWorkspace={handleViewWorkspace}
              onEditWorkspace={handleEditWorkspace}
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
              onCreateWorkspace={handleCreateWorkspace}
              onViewWorkspace={handleViewWorkspace}
              onEditWorkspace={handleEditWorkspace}
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
        
      {/* Mode Transition Notification */}
      {workspaceMode !== 'traditional' && (
        <ModeNotification
          mode={workspaceMode as 'assisted' | 'autonomous'}
          title={`Workspace ${workspaceMode.charAt(0).toUpperCase() + workspaceMode.slice(1)} Mode`}
          description={
            workspaceMode === 'assisted'
              ? `AI is optimizing workspace organization and team collaboration. ${metrics?.aiEfficiencyGains || 0}% efficiency improvement this month.`
              : `AI is autonomously managing workspaces and team workflows. ${metrics?.aiEfficiencyGains || 0}% efficiency improvement this month.`
          }
        />
      )}
    </div>
  )
}

export default HybridWorkspace