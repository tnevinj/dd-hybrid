/**
 * AI-specific Store - Recommendations, insights, and AI interactions
 * Extracted from the massive navigation store for better separation of concerns
 */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AIRecommendation, AIInsight } from '@/types/navigation'
import { aiTrackingService, AIInteraction } from '@/services/ai-tracking-service'

interface AIState {
  recommendations: AIRecommendation[]
  insights: AIInsight[]
  isAIPanelOpen: boolean
}

interface AIActions {
  // Recommendation management
  addRecommendation: (recommendation: AIRecommendation) => void
  removeRecommendation: (id: string) => void
  clearRecommendations: () => void
  executeRecommendation: (recommendationId: string) => void
  dismissRecommendation: (recommendationId: string) => void
  
  // Insight management
  addInsight: (insight: AIInsight) => void
  clearInsights: () => void
  
  // UI state
  toggleAIPanel: () => void
  
  // Tracking
  trackInteraction: (interaction: Omit<AIInteraction, 'id' | 'timestamp' | 'userId'>) => void
  
  // Computed values
  getRecommendationsByModule: (module: string) => AIRecommendation[]
  getHighPriorityRecommendations: () => AIRecommendation[]
  getInsightsByModule: (module: string) => AIInsight[]
}

type AIStore = AIState & AIActions

export const useAIStore = create<AIStore>()(
  persist(
    (set, get) => ({
      // Initial state
      recommendations: [],
      insights: [],
      isAIPanelOpen: false,

      // Recommendation management
      addRecommendation: (recommendation: AIRecommendation) => {
        set((state) => {
          // Prevent duplicates by checking if recommendation with same ID already exists
          const exists = state.recommendations.some(r => r.id === recommendation.id)
          if (exists) {
            return state
          }

          return {
            recommendations: [...state.recommendations, recommendation]
          }
        })
      },

      removeRecommendation: (id: string) => {
        set((state) => ({
          recommendations: state.recommendations.filter(r => r.id !== id)
        }))
      },

      clearRecommendations: () => {
        set({ recommendations: [] })
      },

      executeRecommendation: (recommendationId: string) => {
        const recommendation = get().recommendations.find(r => r.id === recommendationId)
        if (recommendation) {
          // Track the execution
          aiTrackingService.trackInteraction({
            userId: 'current-user',
            interactionType: 'recommendation_accepted',
            recommendationId,
            userAction: 'accepted',
            module: recommendation.moduleContext || 'unknown',
            context: {
              recommendationType: recommendation.type,
              priority: recommendation.priority,
              confidence: recommendation.confidence
            },
            timeSavedSeconds: recommendation.actions[0]?.estimatedTimeSaving ? recommendation.actions[0].estimatedTimeSaving * 60 : undefined
          })
          
          // Remove from recommendations after execution
          get().removeRecommendation(recommendationId)
          
          // Add to insights as completed action
          get().addInsight({
            id: `executed-${recommendationId}`,
            type: 'recommendation',
            title: 'Action Completed',
            description: `${recommendation.title} has been executed`,
            confidence: recommendation.confidence,
            impact: recommendation.priority === 'high' || recommendation.priority === 'critical' ? 'high' : 'medium',
            module: recommendation.moduleContext || 'unknown',
            actionable: false
          })
        }
      },

      dismissRecommendation: (recommendationId: string) => {
        const recommendation = get().recommendations.find(r => r.id === recommendationId)
        if (recommendation) {
          aiTrackingService.trackInteraction({
            userId: 'current-user',
            interactionType: 'recommendation_rejected',
            recommendationId,
            userAction: 'rejected',
            module: recommendation.moduleContext || 'unknown',
            context: {
              recommendationType: recommendation.type,
              priority: recommendation.priority
            }
          })
        }
        get().removeRecommendation(recommendationId)
      },

      // Insight management
      addInsight: (insight: AIInsight) => {
        set((state) => ({
          insights: [...state.insights, insight]
        }))
      },

      clearInsights: () => {
        set({ insights: [] })
      },

      // UI state
      toggleAIPanel: () => {
        set((state) => ({ isAIPanelOpen: !state.isAIPanelOpen }))
      },

      // Tracking
      trackInteraction: (interaction: Omit<AIInteraction, 'id' | 'timestamp' | 'userId'>) => {
        aiTrackingService.trackInteraction({
          userId: 'current-user',
          ...interaction
        })
      },

      // Computed values
      getRecommendationsByModule: (module: string) => {
        return get().recommendations.filter(r => 
          r.moduleContext === module || (!r.moduleContext && module === 'unknown')
        )
      },

      getHighPriorityRecommendations: () => {
        return get().recommendations.filter(r => 
          r.priority === 'high' || r.priority === 'critical'
        ).sort((a, b) => {
          const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 }
          return priorityOrder[a.priority as keyof typeof priorityOrder] - priorityOrder[b.priority as keyof typeof priorityOrder]
        })
      },

      getInsightsByModule: (module: string) => {
        return get().insights.filter(i => i.module === module)
      }
    }),
    {
      name: 'ai-storage',
      partialize: (state) => ({
        // Don't persist UI state like isAIPanelOpen
        recommendations: state.recommendations,
        insights: state.insights
      })
    }
  )
)