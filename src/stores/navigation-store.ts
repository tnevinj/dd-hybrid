import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { 
  NavigationState, 
  UserNavigationMode, 
  AIRecommendation, 
  AIInsight, 
  UserPreferences,
  NavigationItem 
} from '@/types/navigation'
import { aiTrackingService, AIInteraction } from '@/services/ai-tracking-service'

interface NavigationStore extends NavigationState {
  // Actions
  setMode: (mode: UserNavigationMode) => void
  setCurrentModule: (module: string) => void
  toggleAIPanel: () => void
  addRecommendation: (recommendation: AIRecommendation) => void
  removeRecommendation: (id: string) => void
  clearRecommendations: () => void
  addInsight: (insight: AIInsight) => void
  clearInsights: () => void
  updatePreferences: (preferences: Partial<UserPreferences>) => void
  setNavigationItems: (items: NavigationItem[]) => void
  executeRecommendation: (recommendationId: string) => void
  dismissRecommendation: (recommendationId: string) => void
  trackInteraction: (interaction: Omit<AIInteraction, 'id' | 'timestamp' | 'userId'>) => void
  // Computed values
  getRecommendationsByModule: (module: string) => AIRecommendation[]
  getHighPriorityRecommendations: () => AIRecommendation[]
  getInsightsByModule: (module: string) => AIInsight[]
}

const defaultUserMode: UserNavigationMode = {
  mode: 'traditional',
  aiPermissions: {
    suggestions: true,
    autoComplete: false,
    proactiveActions: false,
    autonomousExecution: false,
  },
  preferredDensity: 'comfortable'
}

const defaultPreferences: UserPreferences = {
  navigationMode: 'traditional',
  aiAdoptionLevel: 0,
  aiPermissions: {
    suggestions: true,
    autoComplete: false,
    proactiveActions: false,
    autonomousExecution: false,
    dataAnalysis: true,
    reportGeneration: false,
    meetingScheduling: false,
    documentProcessing: false,
  },
  uiDensity: 'comfortable',
  showAIHints: true,
  autoSaveEnabled: true,
  notificationSettings: {
    emailNotifications: true,
    pushNotifications: false,
    aiRecommendations: true,
    deadlineReminders: true,
    teamUpdates: true,
  }
}

const defaultNavigationItems: NavigationItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: 'Home',
    href: '/dashboard',
    aiEnhanced: true,
    description: 'Overview of all activities and insights'
  },
  {
    id: 'workspaces',
    label: 'Workspaces',
    icon: 'FolderOpen',
    href: '/workspaces',
    aiEnhanced: true,
    description: 'Collaborative investment analysis workspaces'
  },
  {
    id: 'due-diligence',
    label: 'Due Diligence',
    icon: 'Search',
    href: '/due-diligence',
    aiEnhanced: true,
    description: 'Comprehensive due diligence workflows'
  },
  {
    id: 'deals',
    label: 'Deals',
    icon: 'FileText',
    href: '/deals',
    aiEnhanced: true,
    description: 'Deal pipeline and management'
  },
  {
    id: 'portfolio',
    label: 'Portfolio',
    icon: 'PieChart',
    href: '/portfolio',
    aiEnhanced: false,
    description: 'Portfolio monitoring and analytics'
  },
  {
    id: 'reports',
    label: 'Reports',
    icon: 'BarChart',
    href: '/reports',
    aiEnhanced: true,
    description: 'Generated reports and analytics'
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: 'Settings',
    href: '/settings',
    aiEnhanced: false,
    description: 'System and user preferences'
  }
]

export const useNavigationStore = create<NavigationStore>()(
  persist(
    (set, get) => ({
      // Initial state
      currentMode: defaultUserMode,
      currentModule: 'dashboard',
      navigationItems: defaultNavigationItems,
      recommendations: [],
      insights: [],
      isAIPanelOpen: false,
      preferences: defaultPreferences,

      // Actions
      setMode: (mode: UserNavigationMode) => {
        const currentMode = get().currentMode
        
        // Track mode switch
        if (currentMode.mode !== mode.mode) {
          aiTrackingService.trackInteraction({
            userId: 'current-user', // In production, get from auth context
            interactionType: `switch_to_${mode.mode}` as any,
            userAction: 'accepted',
            module: get().currentModule,
            context: {
              previousMode: currentMode.mode,
              newMode: mode.mode,
              timestamp: new Date()
            }
          })
        }

        set((state) => ({
          currentMode: mode,
          preferences: {
            ...state.preferences,
            navigationMode: mode.mode,
            aiPermissions: {
              ...state.preferences.aiPermissions,
              ...mode.aiPermissions
            }
          }
        }))
      },

      setCurrentModule: (module: string) => {
        set({ currentModule: module })
      },

      toggleAIPanel: () => {
        set((state) => ({ isAIPanelOpen: !state.isAIPanelOpen }))
      },

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

      addInsight: (insight: AIInsight) => {
        set((state) => ({
          insights: [...state.insights, insight]
        }))
      },

      clearInsights: () => {
        set({ insights: [] })
      },

      updatePreferences: (preferences: Partial<UserPreferences>) => {
        set((state) => ({
          preferences: { ...state.preferences, ...preferences }
        }))
      },

      setNavigationItems: (items: NavigationItem[]) => {
        set({ navigationItems: items })
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
            module: recommendation.moduleContext || get().currentModule,
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
            module: recommendation.moduleContext || get().currentModule,
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
            module: recommendation.moduleContext || get().currentModule,
            context: {
              recommendationType: recommendation.type,
              priority: recommendation.priority
            }
          })
        }
        get().removeRecommendation(recommendationId)
      },

      trackInteraction: (interaction: Omit<AIInteraction, 'id' | 'timestamp' | 'userId'>) => {
        aiTrackingService.trackInteraction({
          userId: 'current-user',
          ...interaction
        })
      },

      // Computed values
      getRecommendationsByModule: (module: string) => {
        return get().recommendations.filter(r => 
          r.moduleContext === module || (!r.moduleContext && get().currentModule === module)
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
      name: 'navigation-storage',
      partialize: (state) => ({
        currentMode: state.currentMode,
        preferences: state.preferences,
        isAIPanelOpen: false, // Reset AI panel state on reload
      })
    }
  )
)