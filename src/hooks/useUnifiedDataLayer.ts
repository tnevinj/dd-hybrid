/**
 * React Hook for Unified Data Layer Integration
 * Provides components with access to cross-module data and real-time updates
 */

import { useState, useEffect, useCallback, useMemo } from 'react'
import { unifiedDataLayer, ModuleData } from '@/lib/cross-module-integration/UnifiedDataLayer'

export function useUnifiedDataLayer<K extends keyof ModuleData>(module: K) {
  const [data, setData] = useState<ModuleData[K]>(() => unifiedDataLayer.getModuleData(module))
  const [isLoading, setIsLoading] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())

  // Subscribe to module updates
  useEffect(() => {
    const unsubscribe = unifiedDataLayer.onModuleUpdate(module, (newData) => {
      setData(newData)
      setLastUpdated(new Date())
    })

    return unsubscribe
  }, [module])

  // Update module data
  const updateData = useCallback((
    newData: Partial<ModuleData[K]>,
    options?: { propagate?: boolean; aiAnalysis?: boolean }
  ) => {
    setIsLoading(true)
    try {
      unifiedDataLayer.updateModuleData(module, newData, options)
    } finally {
      setIsLoading(false)
    }
  }, [module])

  // Get cross-module analytics
  const analytics = useMemo(() => unifiedDataLayer.getCrossModuleAnalytics(), [lastUpdated])

  return {
    data,
    updateData,
    analytics,
    isLoading,
    lastUpdated,
    // Convenience methods for common operations
    refreshData: () => setData(unifiedDataLayer.getModuleData(module)),
    isDataFresh: (maxAgeMinutes: number = 5) => {
      const ageMinutes = (Date.now() - lastUpdated.getTime()) / (1000 * 60)
      return ageMinutes <= maxAgeMinutes
    }
  }
}

/**
 * Hook for accessing cross-module relationships and insights
 */
export function useCrossModuleInsights() {
  const [insights, setInsights] = useState<any[]>([])
  const [relationships, setRelationships] = useState<any[]>([])

  useEffect(() => {
    const analytics = unifiedDataLayer.getCrossModuleAnalytics()
    setInsights(analytics.aiRecommendations)
    
    // Mock relationship data - in real implementation, this would come from the data layer
    setRelationships([
      {
        source: 'Deal Screening',
        target: 'Due Diligence',
        strength: 0.9,
        type: 'data_flow',
        description: 'Approved opportunities automatically create DD projects'
      },
      {
        source: 'Due Diligence',
        target: 'Portfolio',
        strength: 0.95,
        type: 'data_flow',
        description: 'Completed DD projects become portfolio assets'
      },
      {
        source: 'Market Intelligence',
        target: 'Deal Screening',
        strength: 0.8,
        type: 'trigger',
        description: 'Market trends influence opportunity scoring'
      }
    ])
  }, [])

  return {
    insights,
    relationships,
    refreshInsights: () => {
      const analytics = unifiedDataLayer.getCrossModuleAnalytics()
      setInsights(analytics.aiRecommendations)
    }
  }
}

/**
 * Hook for real-time performance monitoring across modules
 */
export function useSystemPerformance() {
  const [performance, setPerformance] = useState({
    dataFlowLatency: 0,
    syncAccuracy: 0,
    aiEfficiency: 0,
    moduleHealth: {} as Record<keyof ModuleData, 'healthy' | 'warning' | 'error'>
  })

  useEffect(() => {
    const updatePerformance = () => {
      const analytics = unifiedDataLayer.getCrossModuleAnalytics()
      setPerformance({
        ...analytics.performanceMetrics,
        moduleHealth: {
          dealScreening: analytics.dataQuality.dealScreening > 0.9 ? 'healthy' : 
                        analytics.dataQuality.dealScreening > 0.7 ? 'warning' : 'error',
          dueDiligence: analytics.dataQuality.dueDiligence > 0.9 ? 'healthy' : 
                        analytics.dataQuality.dueDiligence > 0.7 ? 'warning' : 'error',
          portfolio: analytics.dataQuality.portfolio > 0.9 ? 'healthy' : 
                     analytics.dataQuality.portfolio > 0.7 ? 'warning' : 'error',
          workflowAutomation: analytics.dataQuality.workflowAutomation > 0.9 ? 'healthy' : 
                             analytics.dataQuality.workflowAutomation > 0.7 ? 'warning' : 'error',
          marketIntelligence: analytics.dataQuality.marketIntelligence > 0.9 ? 'healthy' : 
                             analytics.dataQuality.marketIntelligence > 0.7 ? 'warning' : 'error'
        }
      })
    }

    updatePerformance()
    const interval = setInterval(updatePerformance, 30000) // Update every 30 seconds

    return () => clearInterval(interval)
  }, [])

  return performance
}

/**
 * Hook for AI-powered recommendations across all modules
 */
export function useAIRecommendations() {
  const [recommendations, setRecommendations] = useState<any[]>([])
  const [isGenerating, setIsGenerating] = useState(false)

  const generateRecommendations = useCallback(async () => {
    setIsGenerating(true)
    try {
      // Simulate AI processing time
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      const analytics = unifiedDataLayer.getCrossModuleAnalytics()
      const crossModuleRecs = [
        {
          id: 'ai-rec-1',
          type: 'optimization',
          title: 'Accelerate Deal Flow Integration',
          description: 'Implement real-time sync between Deal Screening and Due Diligence modules',
          modules: ['dealScreening', 'dueDiligence'],
          impact: 'high',
          confidence: 0.92,
          estimatedROI: '35% time reduction',
          actions: [
            'Configure automated data transfer',
            'Implement validation rules',
            'Set up monitoring dashboard'
          ]
        },
        {
          id: 'ai-rec-2',
          type: 'intelligence',
          title: 'Enhanced Market Sentiment Integration',
          description: 'Leverage market intelligence for predictive portfolio optimization',
          modules: ['portfolio', 'marketIntelligence'],
          impact: 'medium',
          confidence: 0.85,
          estimatedROI: '18% performance improvement',
          actions: [
            'Integrate real-time market data feeds',
            'Implement predictive analytics',
            'Create automated alerts'
          ]
        },
        {
          id: 'ai-rec-3',
          type: 'automation',
          title: 'Workflow Automation Enhancement',
          description: 'Automate cross-module approval and notification workflows',
          modules: ['workflowAutomation', 'all'],
          impact: 'high',
          confidence: 0.88,
          estimatedROI: '45% efficiency gain',
          actions: [
            'Design intelligent routing rules',
            'Implement approval automation',
            'Create performance monitoring'
          ]
        }
      ]
      
      setRecommendations([...analytics.aiRecommendations, ...crossModuleRecs])
    } finally {
      setIsGenerating(false)
    }
  }, [])

  useEffect(() => {
    generateRecommendations()
  }, [generateRecommendations])

  const executeRecommendation = useCallback((recommendationId: string) => {
    const recommendation = recommendations.find(r => r.id === recommendationId)
    if (recommendation) {
      alert(`Executing AI Recommendation: "${recommendation.title}"\n\n${recommendation.description}\n\nConfidence: ${(recommendation.confidence * 100).toFixed(0)}%\nExpected Impact: ${recommendation.impact}\nEstimated ROI: ${recommendation.estimatedROI}\n\nActions:\n${recommendation.actions?.map((action: string) => `• ${action}`).join('\n')}`)
      
      // Remove executed recommendation
      setRecommendations(prev => prev.filter(r => r.id !== recommendationId))
    }
  }, [recommendations])

  return {
    recommendations,
    isGenerating,
    generateRecommendations,
    executeRecommendation
  }
}