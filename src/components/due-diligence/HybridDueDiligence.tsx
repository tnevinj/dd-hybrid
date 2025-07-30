'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useNavigationStore } from '@/stores/navigation-store'
import { UserNavigationMode } from '@/types/navigation'
import { useDueDiligence } from '@/contexts/DueDiligenceContext'
import {
  Shield,
  Brain,
  Bot,
  Settings,
  HelpCircle,
  Plus,
  X,
  ChevronDown,
  ChevronUp,
  Info,
  User,
  List
} from 'lucide-react'

import { DDTraditionalView } from './DDTraditionalView'
import { DDAssistedView } from './DDAssistedView'
import { DDAutonomousView } from './DDAutonomousView'
import { 
  ErrorBoundary, 
  HybridModeHeader, 
  HybridModeExplanation,
  type HybridMode 
} from '@/components/shared'


// Due Diligence AI State Interface
interface DueDiligenceAIState {
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
    projectId?: string
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

export const HybridDueDiligence: React.FC = () => {
  const router = useRouter()
  const { currentMode, setMode, setCurrentModule, addRecommendation } = useNavigationStore()
  const { 
    state, 
    getFilteredProjects, 
    selectProject,
    currentProject 
  } = useDueDiligence()
  
  // Set current module for navigation store
  React.useEffect(() => {
    setCurrentModule('due-diligence')
  }, [setCurrentModule])

  // AI state management
  const [aiState, setAIState] = React.useState<DueDiligenceAIState>({
    recommendations: [],
    processingTasks: [],
    automatedActions: [],
    pendingApprovals: []
  })

  const [isLoading, setIsLoading] = React.useState(false)
  const projects = getFilteredProjects()

  // Demo metrics
  const metrics = {
    totalProjects: projects.length || 8,
    activeProjects: 5,
    completedProjects: 3,
    overdueProjects: 2,
    totalTasks: 124,
    completedTasks: 89,
    overdueTasks: 8,
    totalFindings: 23,
    openFindings: 15,
    criticalFindings: 3,
    aiEfficiencyGains: currentMode.mode === 'traditional' ? 0 : 
                      currentMode.mode === 'assisted' ? 25 : 45
  }

  // Generate mode-specific AI recommendations
  React.useEffect(() => {
    if (currentMode.mode !== 'traditional') {
      const recommendations = [
        {
          id: 'dd-rec-1',
          type: 'warning' as const,
          priority: 'high' as const,
          title: `${metrics.overdueProjects} Projects Behind Schedule`,
          description: 'TechCorp and HealthCo DD projects are past target dates. Risk of missing IC deadlines.',
          actions: [
            {
              id: 'action-1',
              label: 'Reallocate Resources',
              action: 'REALLOCATE_RESOURCES',
              primary: true,
              estimatedTimeSaving: 30
            },
            {
              id: 'action-2',
              label: 'Extend Timeline',
              action: 'EXTEND_TIMELINE'
            }
          ],
          confidence: 0.95,
          moduleContext: 'due-diligence',
          timestamp: new Date(),
          projectId: currentProject?.id
        },
        {
          id: 'dd-rec-2',
          type: 'automation' as const,
          priority: 'medium' as const,
          title: 'Bulk Document Analysis Available',
          description: '47 documents across 3 projects can be processed automatically for risk extraction.',
          actions: [
            {
              id: 'action-3',
              label: 'Process All Documents',
              action: 'BULK_DOCUMENT_ANALYSIS',
              primary: true,
              estimatedTimeSaving: 180
            },
            {
              id: 'action-4',
              label: 'Review Selection',
              action: 'REVIEW_DOCUMENT_SELECTION'
            }
          ],
          confidence: 0.88,
          moduleContext: 'due-diligence',
          timestamp: new Date()
        }
      ]

      if (currentMode.mode === 'autonomous') {
        recommendations.push({
          id: 'dd-rec-3',
          type: 'insight' as const,
          priority: 'medium' as const,
          title: 'Pattern Detected: Customer Concentration',
          description: 'AI found similar customer concentration risks across 4 deals. Auto-generated template available.',
          actions: [
            {
              id: 'action-5',
              label: 'Apply Template',
              action: 'APPLY_RISK_TEMPLATE',
              primary: true,
              estimatedTimeSaving: 90
            }
          ],
          confidence: 0.92,
          moduleContext: 'due-diligence',
          timestamp: new Date()
        })
      }

      // Add to global store
      recommendations.forEach(rec => addRecommendation(rec))
      
      // Update local AI state
      setAIState(prev => ({
        ...prev,
        recommendations
      }))
    }
  }, [currentMode.mode, addRecommendation, currentProject?.id, metrics.overdueProjects])

  // Handle mode switching with context awareness
  const handleModeSwitch = (mode: HybridMode) => {
    const newMode: UserNavigationMode = {
      mode: mode,
      aiPermissions: {
        suggestions: true,
        autoComplete: mode !== 'traditional',
        proactiveActions: mode === 'assisted' || mode === 'autonomous',
        autonomousExecution: mode === 'autonomous',
      },
      preferredDensity: currentMode.preferredDensity
    }
    
    setMode(newMode)
  }

  // Handle AI actions
  const handleExecuteAIAction = (actionId: string) => {
    console.log(`Executing DD AI action: ${actionId}`)
    // Add to automated actions
    setAIState(prev => ({
      ...prev,
      automatedActions: [...prev.automatedActions, {
        id: `auto-${Date.now()}`,
        action: actionId,
        description: `Executed ${actionId}`,
        timestamp: new Date(),
        status: 'completed' as const,
        rollbackable: true
      }]
    }))
  }

  const handleApproveAction = (approvalId: string) => {
    console.log(`Approving DD action: ${approvalId}`)
    setAIState(prev => ({
      ...prev,
      pendingApprovals: prev.pendingApprovals.filter(p => p.id !== approvalId)
    }))
  }

  const handleRejectAction = (approvalId: string) => {
    console.log(`Rejecting DD action: ${approvalId}`)
    setAIState(prev => ({
      ...prev,
      pendingApprovals: prev.pendingApprovals.filter(p => p.id !== approvalId)
    }))
  }

  const handleDismissRecommendation = (id: string) => {
    setAIState(prev => ({
      ...prev,
      recommendations: prev.recommendations.filter(rec => rec.id !== id)
    }))
  }

  return (
    <div className={currentMode.mode === 'autonomous' ? 'w-full h-screen' : 'w-full min-h-screen'}>
      {/* Header with Mode Switcher - Hidden for autonomous mode */}
      {currentMode.mode !== 'autonomous' && (
        <HybridModeHeader
          currentMode={currentMode.mode as HybridMode}
          onModeChange={handleModeSwitch}
          moduleContext="due-diligence"
          title="Due Diligence Platform"
          subtitle={currentProject ? 'Choose your experience mode' : 'Select a project to begin • Choose your experience mode'}
          disabled={isLoading}
          context={currentProject}
          className="sticky top-0 z-50"
        />
      )}
      
      {/* Mode Explanation Banner - Hidden for autonomous mode */}
      {currentMode.mode !== 'autonomous' && (
        <div className="p-4">
          <HybridModeExplanation
            currentMode={currentMode.mode as HybridMode}
            moduleContext="due-diligence"
            statistics={{
              efficiency: metrics.aiEfficiencyGains,
              automation: currentMode.mode === 'traditional' ? 0 : currentMode.mode === 'assisted' ? 40 : 85,
              accuracy: currentMode.mode === 'traditional' ? 100 : currentMode.mode === 'assisted' ? 115 : 120
            }}
          />
        </div>
      )}

      {/* Mode-specific Content */}
      {currentMode.mode === 'traditional' && (
        <ErrorBoundary
          onError={(error, errorInfo) => console.error('DD Traditional View Error:', error, errorInfo)}
        >
          <DDTraditionalView
            project={currentProject}
            projects={projects}
            metrics={metrics}
            isLoading={isLoading}
            onSelectProject={selectProject}
          />
        </ErrorBoundary>
      )}

      {currentMode.mode === 'assisted' && (
        <ErrorBoundary
          onError={(error, errorInfo) => console.error('DD Assisted View Error:', error, errorInfo)}
        >
          <DDAssistedView
            project={currentProject}
            projects={projects}
            aiRecommendations={aiState.recommendations}
            metrics={metrics}
            isLoading={isLoading}
            onSelectProject={selectProject}
            onExecuteAIAction={handleExecuteAIAction}
            onDismissRecommendation={handleDismissRecommendation}
          />
        </ErrorBoundary>
      )}

      {currentMode.mode === 'autonomous' && (
        <ErrorBoundary
          onError={(error, errorInfo) => console.error('DD Autonomous View Error:', error, errorInfo)}
        >
          <DDAutonomousView
            onSwitchMode={handleModeSwitch}
          />
        </ErrorBoundary>
      )}

      {/* Mode Transition Notification */}
      {currentMode.mode !== 'traditional' && (
        <div className="fixed bottom-5 right-5 max-w-sm z-50 bg-purple-50 border border-purple-200 rounded-lg p-4 shadow-lg">
          <div className="flex items-start space-x-2">
            <Info className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-purple-800">
              DD <strong>{currentMode.mode}</strong> mode active.
              {currentMode.mode === 'assisted' && (
                <span> AI is analyzing documents and suggesting optimizations.</span>
              )}
              {currentMode.mode === 'autonomous' && (
                <span> AI is handling routine DD tasks automatically.</span>
              )}
              <div className="mt-1 text-xs text-purple-600">
                {metrics.aiEfficiencyGains}% efficiency gain this month
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default HybridDueDiligence