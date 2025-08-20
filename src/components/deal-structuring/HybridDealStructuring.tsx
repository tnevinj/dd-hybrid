'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigationStore } from '@/stores/navigation-store';
import { UserNavigationMode } from '@/types/navigation';
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
  Calculator,
  TrendingUp
} from 'lucide-react';

import DealStructuringTraditional from './DealStructuringTraditional';
import DealStructuringAssisted from './DealStructuringAssisted';
import DealStructuringAutonomous from './DealStructuringAutonomous';
import { ModeNotification } from '@/components/ui/mode-notification';
import {
  ErrorBoundary,
  HybridModeHeader,
  HybridModeExplanation,
  type HybridMode
} from '@/components/shared';
import { logger } from '@/lib/logger';

// AI State Interface for Deal Structuring
interface DealStructuringAIState {
  recommendations: Array<{
    id: string
    type: 'modeling' | 'structure' | 'optimization' | 'risk'
    title: string
    description: string
    impact: 'high' | 'medium' | 'low'
    confidence: number
    automatedAction?: boolean
    status: 'pending' | 'applied' | 'dismissed'
  }>
  processingTasks: Array<{
    id: string
    type: 'model_building' | 'scenario_analysis' | 'optimization' | 'validation'
    description: string
    progress: number
    estimatedCompletion: string
  }>
  automatedActions: Array<{
    id: string
    action: string
    type: 'model_update' | 'parameter_adjustment' | 'scenario_creation'
    status: 'pending' | 'executed' | 'failed'
    timestamp: Date
    impact: string
  }>
  pendingApprovals: Array<{
    id: string
    action: string
    rationale: string
    riskLevel: 'high' | 'medium' | 'low'
    estimatedImpact: string
  }>
}

// Mock metrics data
const mockMetrics = {
  aiEfficiencyGains: 23,
  activeModels: 8,
  scenariosGenerated: 156,
  optimizationsSuggested: 45
}

const HybridDealStructuring: React.FC = () => {
  const router = useRouter()
  const { currentMode, setMode, setCurrentModule, addRecommendation } = useNavigationStore();
  
  // AI State Management
  const [aiState, setAiState] = useState<DealStructuringAIState>({
    recommendations: [
      {
        id: 'ds-rec-1',
        type: 'optimization',
        title: 'Optimize Capital Structure',
        description: 'Current debt-to-equity ratio can be improved for better returns',
        impact: 'high',
        confidence: 0.85,
        status: 'pending'
      },
      {
        id: 'ds-rec-2', 
        type: 'modeling',
        title: 'Add Sensitivity Analysis',
        description: 'Monte Carlo simulation would improve risk assessment',
        impact: 'medium',
        confidence: 0.78,
        status: 'pending'
      }
    ],
    processingTasks: [
      {
        id: 'ds-task-1',
        type: 'scenario_analysis',
        description: 'Running stress test scenarios',
        progress: 67,
        estimatedCompletion: '3 minutes'
      }
    ],
    automatedActions: [],
    pendingApprovals: [
      {
        id: 'ds-approval-1',
        action: 'Update discount rate to 12.5%',
        rationale: 'Market conditions suggest higher risk premium',
        riskLevel: 'medium',
        estimatedImpact: '+2.3% IRR improvement'
      }
    ]
  })
  
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Set current module for navigation store
  useEffect(() => {
    setCurrentModule('deal-structuring');
  }, [setCurrentModule]);

  // Add AI recommendations to navigation store
  useEffect(() => {
    aiState.recommendations.forEach(rec => {
      if (rec.status === 'pending') {
        addRecommendation({
          id: rec.id,
          type: 'efficiency',
          title: rec.title,
          description: rec.description,
          module: 'deal-structuring',
          priority: rec.impact as 'high' | 'medium' | 'low',
          confidence: rec.confidence
        })
      }
    })
  }, [aiState.recommendations, addRecommendation])

  // Handle mode switching
  const handleModeSwitch = (mode: 'traditional' | 'assisted' | 'autonomous') => {
    const newMode: UserNavigationMode = {
      mode: mode,
      aiPermissions: {
        suggestions: true,
        autoComplete: mode !== 'traditional',
        proactiveActions: mode === 'assisted' || mode === 'autonomous',
        autonomousExecution: mode === 'autonomous',
      },
      preferredDensity: currentMode.preferredDensity
    };
    
    setMode(newMode);
  };

  const renderContent = () => {
    switch (currentMode.mode) {
      case 'traditional':
        return <DealStructuringTraditional />;
      case 'assisted':
        return <DealStructuringAssisted />;
      case 'autonomous':
        return <DealStructuringAutonomous />;
      default:
        return <DealStructuringTraditional />; // Default to traditional mode
    }
  };

  // Handle AI recommendation actions
  const handleExecuteAIAction = (actionId: string) => {
    logger.userAction('execute_ai_action', { actionId }, 'current-user')
    logger.info('AI action execution requested', {
      module: 'deal-structuring',
      action: 'execute_ai_action',
      metadata: { actionId }
    })
    // Implementation would integrate with actual AI services
  }

  const handleDismissRecommendation = (id: string) => {
    logger.userAction('dismiss_recommendation', { recommendationId: id })
    setAiState(prev => ({
      ...prev,
      recommendations: prev.recommendations.map(rec => 
        rec.id === id ? { ...rec, status: 'dismissed' } : rec
      )
    }))
  }

  const handleApproveAction = (actionId: string) => {
    logger.userAction('approve_action', { actionId }, 'current-user')
    logger.info('Action approved by user', {
      module: 'deal-structuring',
      action: 'approve_pending_action',
      metadata: { actionId }
    })
    setAiState(prev => ({
      ...prev,
      pendingApprovals: prev.pendingApprovals.filter(approval => approval.id !== actionId)
    }))
  }

  const handleRejectAction = (actionId: string) => {
    logger.userAction('reject_action', { actionId }, 'current-user')
    logger.info('Action rejected by user', {
      module: 'deal-structuring',
      action: 'reject_pending_action',
      metadata: { actionId }
    })
    setAiState(prev => ({
      ...prev,
      pendingApprovals: prev.pendingApprovals.filter(approval => approval.id !== actionId)
    }))
  }

  return (
    <div className={currentMode.mode === 'autonomous' ? 'w-full h-screen' : 'w-full min-h-screen bg-gray-50'}>
      {/* Header with Mode Switcher - Hidden for autonomous mode */}
      {currentMode.mode !== 'autonomous' && (
        <HybridModeHeader
          currentMode={currentMode.mode as HybridMode}
          onModeChange={handleModeSwitch}
          moduleContext="deal-structuring"
          title="Deal Structuring Hub"
          subtitle="Design, model, and optimize deal structures across all investment strategies"
        />
      )}
      
      {/* Mode Explanation Banner - Hidden for autonomous mode */}
      {currentMode.mode !== 'autonomous' && (
        <HybridModeExplanation
          mode={currentMode.mode as HybridMode}
          module="deal-structuring"
        />
      )}

      {/* Traditional Mode */}
      {currentMode.mode === 'traditional' && (
        <ErrorBoundary
          onError={(error, errorInfo) => logger.error('Deal Structuring Traditional View Error', {
            module: 'deal-structuring',
            component: 'DealStructuringTraditional',
            action: 'render_error'
          }, error)}
        >
          <DealStructuringTraditional />
        </ErrorBoundary>
      )}

      {/* Assisted Mode */}
      {currentMode.mode === 'assisted' && (
        <ErrorBoundary
          onError={(error, errorInfo) => logger.error('Deal Structuring Assisted View Error', {
            module: 'deal-structuring',
            component: 'DealStructuringAssisted',
            action: 'render_error'
          }, error)}
        >
          <DealStructuringAssisted
            aiRecommendations={aiState.recommendations}
            processingTasks={aiState.processingTasks}
            onExecuteAIAction={handleExecuteAIAction}
            onDismissRecommendation={handleDismissRecommendation}
          />
        </ErrorBoundary>
      )}

      {/* Autonomous Mode */}
      {currentMode.mode === 'autonomous' && (
        <ErrorBoundary
          onError={(error, errorInfo) => logger.error('Deal Structuring Autonomous View Error', {
            module: 'deal-structuring',
            component: 'DealStructuringAutonomous',
            action: 'render_error'
          }, error)}
        >
          <DealStructuringAutonomous
            automatedActions={aiState.automatedActions}
            pendingApprovals={aiState.pendingApprovals}
            onApproveAction={handleApproveAction}
            onRejectAction={handleRejectAction}
          />
        </ErrorBoundary>
      )}

      {/* Mode Transition Notification */}
      {currentMode.mode !== 'traditional' && (
        <ModeNotification
          mode={currentMode.mode as 'assisted' | 'autonomous'}
          title={`Deal Structuring ${currentMode.mode.charAt(0).toUpperCase() + currentMode.mode.slice(1)} Mode`}
          description={
            currentMode.mode === 'assisted'
              ? `AI is optimizing deal structures and providing modeling insights. ${mockMetrics.aiEfficiencyGains}% efficiency improvement this month.`
              : `AI is autonomously managing deal structuring workflows. ${mockMetrics.aiEfficiencyGains}% efficiency improvement this month.`
          }
        />
      )}
    </div>
  );
};

export default HybridDealStructuring;