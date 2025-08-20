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
  
  // Core Operations
  {
    id: 'deal-screening',
    label: 'Deal Screening',
    icon: 'Search',
    href: '/deal-screening',
    aiEnhanced: true,
    description: 'AI-powered deal opportunity screening and analysis'
  },
  {
    id: 'deal-structuring',
    label: 'Deal Structuring',
    icon: 'PieChart',
    href: '/deal-structuring',
    aiEnhanced: true,
    description: 'Financial modeling and deal structuring workflows'
  },
  {
    id: 'due-diligence',
    label: 'Due Diligence',
    icon: 'FileText',
    href: '/due-diligence',
    aiEnhanced: true,
    description: 'Comprehensive due diligence workflows'
  },
  {
    id: 'portfolio',
    label: 'Portfolio',
    icon: 'PieChart',
    href: '/portfolio',
    aiEnhanced: true,
    description: 'Comprehensive portfolio management with analytics, optimization, risk management, and team collaboration'
  },
  
  // Enhanced Features
  {
    id: 'portfolio-management',
    label: 'Portfolio Management',
    icon: 'BarChart',
    href: '/portfolio-management',
    aiEnhanced: true,
    description: 'Enhanced portfolio analytics, ESG reporting, and performance tracking'
  },
  {
    id: 'fund-operations',
    label: 'Fund Operations',
    icon: 'Building',
    href: '/fund-operations',
    aiEnhanced: true,
    description: 'NAV tracking, expense management, and operational workflows'
  },
  {
    id: 'investment-committee',
    label: 'Investment Committee',
    icon: 'Users',
    href: '/investment-committee',
    aiEnhanced: true,
    description: 'Meeting management, voting systems, and decision tracking'
  },
  {
    id: 'legal-management',
    label: 'Legal Management',
    icon: 'Shield',
    href: '/legal-management',
    aiEnhanced: true,
    description: 'Document center, compliance monitoring, and risk assessment'
  },
  
  // Intelligence & Analytics
  {
    id: 'market-intelligence',
    label: 'Market Intelligence',
    icon: 'TrendingUp',
    href: '/market-intelligence',
    aiEnhanced: true,
    description: 'AFME dashboard, currency monitoring, and geopolitical analysis'
  },
  {
    id: 'knowledge-management',
    label: 'Knowledge Center',
    icon: 'Brain',
    href: '/knowledge-management',
    aiEnhanced: true,
    description: 'Institutional memory, expert networks, and pattern recognition'
  },
  {
    id: 'advanced-analytics',
    label: 'Advanced Analytics',
    icon: 'BarChart',
    href: '/advanced-analytics',
    aiEnhanced: true,
    description: 'Predictive modeling, risk correlation, and scenario planning'
  },
  
  // Relationship & Operations
  {
    id: 'lpgp-relationship',
    label: 'LP Relationships',
    icon: 'Users',
    href: '/lpgp-relationship',
    aiEnhanced: true,
    description: 'CRM, communication center, and strategic relationship planning'
  },
  {
    id: 'workflow-automation',
    label: 'Workflow Automation',
    icon: 'Zap',
    href: '/workflow-automation',
    aiEnhanced: true,
    description: 'Document workflows, approval processes, and automation'
  },
  
  // Administration
  {
    id: 'admin-management',
    label: 'Administration',
    icon: 'Shield',
    href: '/admin-management',
    aiEnhanced: true,
    description: 'Multi-org support, RBAC, audit logging, and system administration'
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

          // Filter out conflicting recommendations from different modules

          // Filter out conflicting recommendations
          const filteredRecommendations = state.recommendations.filter(r => {
            const similarTitle = r.title.toLowerCase().includes('workflow') && 
                                 recommendation.title.toLowerCase().includes('workflow')
            const similarAction = r.actions && recommendation.actions &&
                                 r.actions.some(a1 => recommendation.actions!.some(a2 => 
                                   a1.action.includes('WORKFLOW') && a2.action.includes('WORKFLOW')
                                 ))
            
            if ((similarTitle || similarAction) && r.moduleContext !== recommendation.moduleContext) {
              return r.moduleContext === state.currentModule
            }
            return true
          })

          return {
            recommendations: [...filteredRecommendations, recommendation]
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