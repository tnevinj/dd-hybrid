'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useNavigationStore } from '@/stores/navigation-store'
import { UserNavigationMode } from '@/types/navigation'
import {
  PieChart,
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
  BarChart3
} from 'lucide-react'

import { PortfolioTraditional } from './PortfolioTraditional'
import { PortfolioAssisted } from './PortfolioAssisted'
import { PortfolioAutonomous } from './PortfolioAutonomous'
import { UnifiedPortfolioProvider } from './contexts/UnifiedPortfolioContext'
import { ModeNotification } from '@/components/ui/mode-notification'
import { 
  ErrorBoundary, 
  HybridModeHeader, 
  HybridModeExplanation,
  type HybridMode 
} from '@/components/shared'


// Portfolio AI State Interface
interface PortfolioAIState {
  recommendations: Array<{
    id: string
    type: 'optimization' | 'risk' | 'opportunity' | 'rebalancing'
    priority: 'low' | 'medium' | 'high' | 'critical'
    title: string
    description: string
    actions: Array<{
      id: string
      label: string
      action: string
      primary?: boolean
      estimatedImpact?: string
    }>
    confidence: number
    estimatedImpact?: string
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

export const HybridPortfolio: React.FC = () => {
  const router = useRouter()
  const { currentMode, setMode, setCurrentModule, addRecommendation } = useNavigationStore()
  
  // Set current module for navigation store
  React.useEffect(() => {
    setCurrentModule('portfolio')
  }, [setCurrentModule])

  // AI state management
  const [aiState, setAIState] = React.useState<PortfolioAIState>({
    recommendations: [],
    processingTasks: [],
    automatedActions: [],
    pendingApprovals: []
  })

  const [isLoading, setIsLoading] = React.useState(false)

  // Mock portfolio data
  const portfolioData = {
    totalValue: 3880000000, // $3.88B to match detailed analytics
    totalAssets: 47,
    performanceYTD: 12.5,
    topPerformer: 'TechCorp Growth Fund',
    riskScore: 2.1,
    aiOptimizationScore: 8.7,
    predictedGrowth: 15.2
  }

  const mockAssets = [
    {
      id: '1',
      name: 'TechCorp Growth Fund',
      type: 'Private Equity',
      sector: 'Technology',
      currentValue: 180000000,
      performance: 28.5,
      riskLevel: 'medium'
    },
    {
      id: '2',
      name: 'Healthcare REIT Portfolio',
      type: 'Real Estate',
      sector: 'Healthcare',
      currentValue: 150000000,
      performance: 19.2,
      riskLevel: 'low'
    },
    {
      id: '3',
      name: 'Infrastructure Debt Fund',
      type: 'Debt',
      sector: 'Infrastructure',
      currentValue: 220000000,
      performance: 8.7,
      riskLevel: 'low'
    }
  ]

  const metrics = {
    totalValue: portfolioData.totalValue,
    totalAssets: portfolioData.totalAssets,
    performanceYTD: portfolioData.performanceYTD,
    topPerformer: portfolioData.topPerformer,
    riskScore: portfolioData.riskScore,
    aiOptimizationScore: portfolioData.aiOptimizationScore,
    predictedGrowth: portfolioData.predictedGrowth,
    aiEfficiencyGains: currentMode.mode === 'traditional' ? 0 : 
                      currentMode.mode === 'assisted' ? 35 : 65
  }

  // Generate mode-specific AI recommendations
  React.useEffect(() => {
    if (currentMode.mode !== 'traditional') {
      const recommendations = [
        {
          id: 'portfolio-rec-1',
          type: 'optimization' as const,
          priority: 'high' as const,
          title: 'Rebalancing Opportunity Detected',
          description: 'Your tech allocation is 8% overweight. Reducing by 5% and increasing infrastructure could improve risk-adjusted returns by 12%.',
          actions: [
            {
              id: 'action-1',
              label: 'Execute Rebalancing',
              action: 'EXECUTE_REBALANCING',
              primary: true,
              estimatedImpact: '+1.2% annual return'
            },
            {
              id: 'action-2',
              label: 'View Analysis',
              action: 'VIEW_REBALANCING_ANALYSIS'
            }
          ],
          confidence: 0.94,
          estimatedImpact: '+$28M potential value',
          moduleContext: 'portfolio',
          timestamp: new Date()
        },
        {
          id: 'portfolio-rec-2',
          type: 'risk' as const,
          priority: 'medium' as const,
          title: 'Correlation Risk Alert',
          description: 'Healthcare positions showing increased correlation (0.72). Consider diversifying with international healthcare or reducing exposure.',
          actions: [
            {
              id: 'action-3',
              label: 'Add International Exposure',
              action: 'ADD_INTERNATIONAL_HEALTHCARE',
              primary: true,
              estimatedImpact: '-15% portfolio correlation'
            },
            {
              id: 'action-4',
              label: 'Reduce Healthcare Weight',
              action: 'REDUCE_HEALTHCARE_WEIGHT'
            }
          ],
          confidence: 0.87,
          estimatedImpact: 'Risk reduction',
          moduleContext: 'portfolio',
          timestamp: new Date()
        }
      ]

      if (currentMode.mode === 'autonomous') {
        recommendations.push({
          id: 'portfolio-rec-3',
          type: 'opportunity' as const,
          priority: 'medium' as const,
          title: 'Market Timing Signal',
          description: 'AI detected 78% probability of emerging markets outperformance in next 6 months. Recommend 3% allocation increase.',
          actions: [
            {
              id: 'action-5',
              label: 'Auto-Allocate',
              action: 'AUTO_ALLOCATE_EMERGING_MARKETS',
              primary: true,
              estimatedImpact: '+2.1% expected return'
            }
          ],
          confidence: 0.91,
          estimatedImpact: '+$50M potential upside',
          moduleContext: 'portfolio',
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

  // Handle portfolio actions
  const handleCreateAsset = () => {
    console.log('Creating new asset')
  }

  const handleViewAsset = (id: string) => {
    // Navigate to asset detail page using the current portfolio ID
    const portfolioId = 'default' // This would come from context in a real implementation
    router.push(`/portfolio/${portfolioId}/assets/${id}`)
  }

  const handleEditAsset = (id: string) => {
    console.log(`Editing asset: ${id}`)
  }

  const handleExecuteAIAction = (actionId: string) => {
    console.log(`Executing Portfolio AI action: ${actionId}`)
    
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
    console.log(`Approving Portfolio action: ${approvalId}`)
    setAIState(prev => ({
      ...prev,
      pendingApprovals: prev.pendingApprovals.filter(p => p.id !== approvalId)
    }))
  }

  const handleRejectAction = (approvalId: string) => {
    console.log(`Rejecting Portfolio action: ${approvalId}`)
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
    <UnifiedPortfolioProvider>
      <div className={currentMode.mode === 'autonomous' ? 'w-full h-screen' : 'w-full min-h-screen bg-gray-50'}>
        {/* Header with Mode Switcher - Hidden for autonomous mode */}
        {currentMode.mode !== 'autonomous' && (
          <HybridModeHeader
            currentMode={currentMode.mode as HybridMode}
            onModeChange={handleModeSwitch}
            moduleContext="portfolio"
            title="Portfolio Platform"
            subtitle="Choose your experience mode"
            disabled={isLoading}
            context={portfolioData}
            className="sticky top-0 z-50"
          />
        )}
        
        {/* Mode Explanation Banner - Hidden for autonomous mode */}
        {currentMode.mode !== 'autonomous' && (
          <div className="p-4">
            <HybridModeExplanation
              currentMode={currentMode.mode as HybridMode}
              moduleContext="portfolio"
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
            onError={(error, errorInfo) => console.error('Portfolio Traditional View Error:', error, errorInfo)}
          >
            <PortfolioTraditional
              portfolioData={portfolioData}
              assets={mockAssets}
              metrics={metrics}
              isLoading={isLoading}
              onCreateAsset={handleCreateAsset}
              onViewAsset={handleViewAsset}
              onEditAsset={handleEditAsset}
            />
          </ErrorBoundary>
        )}

        {currentMode.mode === 'assisted' && (
          <ErrorBoundary
            onError={(error, errorInfo) => console.error('Portfolio Assisted View Error:', error, errorInfo)}
          >
            <PortfolioAssisted
              portfolioData={portfolioData}
              assets={mockAssets}
              aiRecommendations={aiState.recommendations}
              metrics={metrics}
              isLoading={isLoading}
              onCreateAsset={handleCreateAsset}
              onViewAsset={handleViewAsset}
              onEditAsset={handleEditAsset}
              onExecuteAIAction={handleExecuteAIAction}
              onDismissRecommendation={handleDismissRecommendation}
            />
          </ErrorBoundary>
        )}

        {currentMode.mode === 'autonomous' && (
          <ErrorBoundary
            onError={(error, errorInfo) => console.error('Portfolio Autonomous View Error:', error, errorInfo)}
          >
            <PortfolioAutonomous
              onSwitchMode={handleModeSwitch}
            />
          </ErrorBoundary>
        )}

        {/* Mode Transition Notification */}
        {currentMode.mode !== 'traditional' && (
          <ModeNotification
            mode={currentMode.mode as 'assisted' | 'autonomous'}
            title={`Portfolio ${currentMode.mode.charAt(0).toUpperCase() + currentMode.mode.slice(1)} Mode`}
            description={
              currentMode.mode === 'assisted'
                ? `AI is providing optimization insights. ${metrics.aiEfficiencyGains}% efficiency improvement this month.`
                : `AI is actively managing your portfolio. ${metrics.aiEfficiencyGains}% efficiency improvement this month.`
            }
          />
        )}
      </div>
    </UnifiedPortfolioProvider>
  )
}

export default HybridPortfolio