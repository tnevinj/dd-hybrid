/**
 * Centralized AI state management hook for all modules
 * Eliminates code duplication and provides consistent AI integration
 */

import { useState, useEffect, useCallback } from 'react'
import { useAIStore } from '@/stores/ai-store'
import { calculateEfficiencyMetrics } from '@/lib/ai-efficiency-metrics'
import { generateAIRecommendations, mockContextData } from '@/lib/ai-recommendation-engine'
import type { HybridMode } from '@/components/shared'
import type { 
  BaseModuleAIState, 
  BaseAIActionHandlers, 
  BaseModuleMetrics,
  ModuleContext,
  ModuleAIState,
  ModuleAIStateExtensions
} from '@/types/shared'

export interface UseModuleAIOptions<T extends keyof ModuleAIStateExtensions> {
  moduleId: ModuleContext
  currentMode: HybridMode
  customMetrics?: Partial<BaseModuleMetrics>
  generateRecommendations?: boolean
}

export interface UseModuleAIReturn<T extends keyof ModuleAIStateExtensions> {
  aiState: ModuleAIState<T>
  metrics: BaseModuleMetrics
  actionHandlers: BaseAIActionHandlers
  isLoading: boolean
  setLoading: (loading: boolean) => void
}

/**
 * Hook for managing module AI state and interactions
 */
export function useModuleAI<T extends keyof ModuleAIStateExtensions>({
  moduleId,
  currentMode,
  customMetrics,
  generateRecommendations = true
}: UseModuleAIOptions<T>): UseModuleAIReturn<T> {
  
  const { addRecommendation } = useAIStore()
  
  // AI State Management
  const [aiState, setAIState] = useState<ModuleAIState<T>>({
    recommendations: [],
    processingTasks: [],
    automatedActions: [],
    pendingApprovals: []
  } as ModuleAIState<T>)
  
  const [isLoading, setIsLoading] = useState(false)
  
  // Calculate standardized efficiency metrics
  const efficiencyMetrics = calculateEfficiencyMetrics(moduleId, currentMode)
  
  // Merge with custom metrics
  const metrics: BaseModuleMetrics = {
    ...customMetrics,
    aiEfficiencyGains: efficiencyMetrics.efficiency,
    automationLevel: efficiencyMetrics.automation,
    accuracyImprovement: efficiencyMetrics.accuracy,
    timeSavedHours: efficiencyMetrics.timeSaved,
    costReduction: efficiencyMetrics.costReduction
  }
  
  // Generate AI recommendations when mode changes
  useEffect(() => {
    if (currentMode !== 'traditional' && generateRecommendations) {
      const context = {
        moduleId,
        currentData: mockContextData[moduleId as keyof typeof mockContextData] || {},
        userBehavior: {
          frequency: 0.8,
          successRate: 0.92,
          preferredActions: getModulePreferredActions(moduleId)
        }
      }
      
      const recommendations = generateAIRecommendations(context, currentMode as 'assisted' | 'autonomous')
      
      // Add to global store
      recommendations.forEach(rec => addRecommendation(rec))
      
      // Update local AI state
      setAIState(prev => ({
        ...prev,
        recommendations
      }))
    }
  }, [currentMode, moduleId, generateRecommendations, addRecommendation])
  
  // AI Action Handlers
  const actionHandlers: BaseAIActionHandlers = {
    onExecuteAIAction: useCallback((actionId: string) => {
      console.log(`Executing ${moduleId} AI action: ${actionId}`)
      
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
    }, [moduleId]),
    
    onApproveAction: useCallback((approvalId: string) => {
      console.log(`Approving ${moduleId} action: ${approvalId}`)
      setAIState(prev => ({
        ...prev,
        pendingApprovals: prev.pendingApprovals.filter(p => p.id !== approvalId)
      }))
    }, [moduleId]),
    
    onRejectAction: useCallback((approvalId: string) => {
      console.log(`Rejecting ${moduleId} action: ${approvalId}`)
      setAIState(prev => ({
        ...prev,
        pendingApprovals: prev.pendingApprovals.filter(p => p.id !== approvalId)
      }))
    }, [moduleId]),
    
    onDismissRecommendation: useCallback((id: string) => {
      setAIState(prev => ({
        ...prev,
        recommendations: prev.recommendations.filter(rec => rec.id !== id)
      }))
    }, [])
  }
  
  return {
    aiState,
    metrics,
    actionHandlers,
    isLoading,
    setLoading: setIsLoading
  }
}

/**
 * Get module-specific preferred actions for AI recommendations
 */
function getModulePreferredActions(moduleId: ModuleContext): string[] {
  const actionMap: Record<ModuleContext, string[]> = {
    'advanced-analytics': ['RUN_PORTFOLIO_OPTIMIZATION', 'DEPLOY_PREDICTIVE_MODEL'],
    'portfolio': ['OPTIMIZE_ALLOCATION', 'REBALANCE_PORTFOLIO', 'ANALYZE_RISK', 'GENERATE_ESG_REPORT', 'IDENTIFY_OPPORTUNITIES'],
    'due-diligence': ['ANALYZE_DOCUMENTS', 'ASSESS_RISK', 'AUTOMATE_CHECKLIST', 'GENERATE_FINDINGS_REPORT', 'PREDICT_TIMELINE', 'COMPARE_BENCHMARKS'],
    'deal-screening': ['EVALUATE_OPPORTUNITY', 'COMPARE_VALUATIONS', 'ANALYZE_MARKET_TRENDS', 'SCREEN_CRITERIA', 'PREDICT_SUCCESS_PROBABILITY', 'BENCHMARK_PRICING'],
    'deal-structuring': ['MODEL_SCENARIOS', 'OPTIMIZE_STRUCTURE'],
    'fund-operations': ['CALCULATE_NAV', 'PROCESS_DISTRIBUTIONS'],
    'investment-committee': ['PREPARE_MATERIALS', 'SCHEDULE_MEETING'],
    'legal-management': ['REVIEW_CONTRACTS', 'CHECK_COMPLIANCE'],
    'market-intelligence': ['ANALYZE_TRENDS', 'UPDATE_FORECASTS'],
    'dashboard': ['GENERATE_INSIGHTS', 'UPDATE_METRICS'],
    'portfolio-management': ['REBALANCE_PORTFOLIO', 'ESG_ANALYSIS'],
    'gp-portal': ['UPDATE_REPORTS', 'MANAGE_COMMUNICATIONS'],
    'lp-portal': ['GENERATE_STATEMENTS', 'UPDATE_PERFORMANCE'],
    'knowledge-management': ['INDEX_DOCUMENTS', 'EXTRACT_INSIGHTS'],
    'lpgp-relationship': ['TRACK_INTERACTIONS', 'PLAN_OUTREACH'],
    'workflow-automation': ['OPTIMIZE_WORKFLOWS', 'AUTOMATE_APPROVALS'],
    'admin-management': ['USER_MANAGEMENT', 'AUDIT_ACTIVITIES']
  }
  
  return actionMap[moduleId] || ['GENERIC_ACTION']
}