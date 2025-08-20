'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useNavigationStore } from '@/stores/navigation-store'
import { UserNavigationMode } from '@/types/navigation'
import {
  BarChart3,
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
  TrendingUp,
  Activity
} from 'lucide-react'

import { DashboardTraditional } from './DashboardTraditional'
import { DashboardAssisted } from './DashboardAssisted'
import { DashboardAutonomous } from './DashboardAutonomous'
import { ModeNotification } from '@/components/ui/mode-notification'
import { 
  ErrorBoundary, 
  HybridModeHeader, 
  HybridModeExplanation,
  type HybridMode 
} from '@/components/shared'


// Dashboard AI State Interface
interface DashboardAIState {
  recommendations: Array<{
    id: string
    type: 'optimization' | 'risk' | 'opportunity' | 'automation'
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
    estimatedTimeSaving?: number
    moduleContext: string
    timestamp: Date
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

export const HybridDashboard: React.FC = () => {
  const router = useRouter()
  const { currentMode, setMode, setCurrentModule, addRecommendation } = useNavigationStore()
  
  // Set current module for navigation store
  React.useEffect(() => {
    setCurrentModule('dashboard')
  }, [setCurrentModule])

  // AI state management
  const [aiState, setAIState] = React.useState<DashboardAIState>({
    recommendations: [],
    processingTasks: [],
    automatedActions: [],
    pendingApprovals: []
  })

  const [isLoading, setIsLoading] = React.useState(false)

  // Mock dashboard data
  const dashboardData = {
    activeDeals: 12,
    ddProjects: 8,
    teamMembers: 24,
    totalAUM: 3880000000, // $3.88B to match detailed analytics
    performanceYTD: 12.5,
    aiOptimizationScore: 8.7,
    predictedGrowth: 15.2
  }

  const mockActiveDeals = [
    {
      id: '1',
      name: 'TechCorp Acquisition',
      status: 'Due Diligence',
      dealValue: 250000000,
      stage: 'Advanced'
    },
    {
      id: '2',
      name: 'HealthCo Investment', 
      status: 'Initial Review',
      dealValue: 180000000,
      stage: 'Early'
    }
  ]

  const mockRecentActivity = [
    {
      id: '1',
      type: 'completion',
      title: 'TechCorp DD completed',
      timestamp: '2 hours ago',
      status: 'completed'
    },
    {
      id: '2',
      type: 'update', 
      title: 'HealthCo financial model updated',
      timestamp: '4 hours ago',
      status: 'updated'
    }
  ]

  const metrics = {
    activeDeals: dashboardData.activeDeals,
    ddProjects: dashboardData.ddProjects,
    teamMembers: dashboardData.teamMembers,
    totalAUM: dashboardData.totalAUM,
    performanceYTD: dashboardData.performanceYTD,
    aiOptimizationScore: dashboardData.aiOptimizationScore,
    predictedGrowth: dashboardData.predictedGrowth,
    aiEfficiencyGains: currentMode.mode === 'traditional' ? 0 : 
                      currentMode.mode === 'assisted' ? 40 : 70
  }

  // Generate mode-specific AI recommendations
  React.useEffect(() => {
    if (currentMode.mode !== 'traditional') {
      const recommendations = [
        {
          id: 'dashboard-rec-1',
          type: 'optimization' as const,
          priority: 'high' as const,
          title: 'Dashboard DD Workflow Automation Available',
          description: 'I can automate your executive dashboard due diligence tracking for TechCorp, reducing manual reporting by 15 hours while maintaining accuracy.',
          actions: [
            {
              id: 'action-1',
              label: 'Automate Workflow',
              action: 'AUTOMATE_DASHBOARD_DD_WORKFLOW',
              primary: true,
              estimatedTimeSaving: 15
            },
            {
              id: 'action-2',
              label: 'View Process',
              action: 'VIEW_DD_PROCESS'
            }
          ],
          confidence: 0.94,
          estimatedTimeSaving: 15,
          moduleContext: 'dashboard',
          timestamp: new Date()
        },
        {
          id: 'dashboard-rec-2',
          type: 'risk' as const,
          priority: 'medium' as const,
          title: 'Team Capacity Alert',
          description: 'Your team utilization is at 94%. I recommend redistributing workload or consider expanding resources for upcoming Q4 deals.',
          actions: [
            {
              id: 'action-3',
              label: 'Optimize Allocation',
              action: 'OPTIMIZE_TEAM_ALLOCATION',
              primary: true,
              estimatedTimeSaving: 8
            },
            {
              id: 'action-4',
              label: 'View Capacity',
              action: 'VIEW_TEAM_CAPACITY'
            }
          ],
          confidence: 0.87,
          estimatedTimeSaving: 8,
          moduleContext: 'dashboard',
          timestamp: new Date()
        }
      ]

      if (currentMode.mode === 'autonomous') {
        recommendations.push({
          id: 'dashboard-rec-3',
          type: 'automation' as const,
          priority: 'medium' as const,
          title: 'Automated Reporting Ready',
          description: 'I can generate your Q3 LP report automatically based on current data and templates. Expected completion in 2 hours.',
          actions: [
            {
              id: 'action-5',
              label: 'Generate Report',
              action: 'AUTO_GENERATE_REPORT',
              primary: true,
              estimatedTimeSaving: 45
            }
          ],
          confidence: 0.91,
          estimatedTimeSaving: 45,
          moduleContext: 'dashboard',
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
  }, [currentMode.mode, addRecommendation])

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

  // Handle dashboard actions
  const handleCreateWorkspace = () => {
    console.log('Creating new workspace')
    router.push('/workspaces/new')
  }

  const handleViewWorkspace = (id: string) => {
    console.log(`Viewing workspace: ${id}`)
    router.push(`/workspaces/${id}`)
  }

  const handleCreateDeal = () => {
    console.log('Creating new deal')
  }

  const handleViewDeal = (id: string) => {
    console.log(`Viewing deal: ${id}`)
  }

  const handleExecuteAIAction = (actionId: string) => {
    console.log(`Executing Dashboard AI action: ${actionId}`)
    
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
    console.log(`Approving Dashboard action: ${approvalId}`)
    setAIState(prev => ({
      ...prev,
      pendingApprovals: prev.pendingApprovals.filter(p => p.id !== approvalId)
    }))
  }

  const handleRejectAction = (approvalId: string) => {
    console.log(`Rejecting Dashboard action: ${approvalId}`)
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
          moduleContext="dashboard"
          title="Executive Dashboard"
          subtitle="Comprehensive operations and performance management • Choose your experience mode"
          disabled={isLoading}
          className="sticky top-0 z-50"
        />
      )}
      
      {/* Mode Explanation Banner - Hidden for autonomous mode */}
      {currentMode.mode !== 'autonomous' && (
        <div className="p-4">
          <HybridModeExplanation
            currentMode={currentMode.mode as HybridMode}
            moduleContext="dashboard"
            statistics={{
              efficiency: metrics.aiEfficiencyGains,
              automation: currentMode.mode === 'traditional' ? 0 : currentMode.mode === 'assisted' ? 50 : 90,
              accuracy: currentMode.mode === 'traditional' ? 100 : currentMode.mode === 'assisted' ? 120 : 125
            }}
          />
        </div>
      )}

      {/* Mode-specific Content */}
      {currentMode.mode === 'traditional' && (
        <ErrorBoundary
          onError={(error, errorInfo) => console.error('Dashboard Traditional View Error:', error, errorInfo)}
        >
          <DashboardTraditional
            dashboardData={dashboardData}
            activeDeals={mockActiveDeals}
            recentActivity={mockRecentActivity}
            metrics={metrics}
            isLoading={isLoading}
            onCreateWorkspace={handleCreateWorkspace}
            onViewWorkspace={handleViewWorkspace}
            onCreateDeal={handleCreateDeal}
            onViewDeal={handleViewDeal}
          />
        </ErrorBoundary>
      )}

      {currentMode.mode === 'assisted' && (
        <ErrorBoundary
          onError={(error, errorInfo) => console.error('Dashboard Assisted View Error:', error, errorInfo)}
        >
          <DashboardAssisted
            dashboardData={dashboardData}
            activeDeals={mockActiveDeals}
            recentActivity={mockRecentActivity}
            aiRecommendations={aiState.recommendations}
            metrics={metrics}
            isLoading={isLoading}
            onCreateWorkspace={handleCreateWorkspace}
            onViewWorkspace={handleViewWorkspace}
            onCreateDeal={handleCreateDeal}
            onViewDeal={handleViewDeal}
            onExecuteAIAction={handleExecuteAIAction}
            onDismissRecommendation={handleDismissRecommendation}
          />
        </ErrorBoundary>
      )}

      {currentMode.mode === 'autonomous' && (
        <ErrorBoundary
          onError={(error, errorInfo) => console.error('Dashboard Autonomous View Error:', error, errorInfo)}
        >
          <DashboardAutonomous
            onSwitchMode={handleModeSwitch}
          />
        </ErrorBoundary>
      )}

      {/* Mode Transition Notification */}
      {currentMode.mode !== 'traditional' && (
        <ModeNotification
          mode={currentMode.mode as 'assisted' | 'autonomous'}
          title={`Dashboard ${currentMode.mode.charAt(0).toUpperCase() + currentMode.mode.slice(1)} Mode`}
          description={
            currentMode.mode === 'assisted'
              ? `AI is providing operational insights. ${metrics.aiEfficiencyGains}% efficiency improvement this month.`
              : `AI is actively managing operations. ${metrics.aiEfficiencyGains}% efficiency improvement this month.`
          }
        />
      )}
    </div>
  )
}

export default HybridDashboard