/**
 * Refactored Navigation Store - Core navigation functionality only
 * Part of the store splitting effort to reduce complexity
 */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { UserNavigationMode, NavigationItem } from '@/types/navigation'
import type { ModuleContext } from '@/types/shared'

interface NavigationState {
  currentMode: UserNavigationMode
  currentModule: ModuleContext
  navigationItems: NavigationItem[]
}

interface NavigationActions {
  setMode: (mode: UserNavigationMode) => void
  setCurrentModule: (module: ModuleContext) => void
  setNavigationItems: (items: NavigationItem[]) => void
}

type NavigationStore = NavigationState & NavigationActions

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
    description: 'Manage and organize your work projects'
  },
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
    description: 'Portfolio management with analytics and optimization'
  },
  {
    id: 'investment-committee',
    label: 'Investment Committee',
    icon: 'Users',
    href: '/investment-committee',
    aiEnhanced: true,
    description: 'Investment committee workflows and decision support'
  },
  {
    id: 'fund-operations',
    label: 'Fund Operations',
    icon: 'Building',
    href: '/fund-operations',
    aiEnhanced: true,
    description: 'Fund operations and financial management'
  },
  {
    id: 'gp-portal',
    label: 'GP Portal',
    icon: 'Shield',
    href: '/gp-portal',
    aiEnhanced: true,
    description: 'General Partner portal and tools'
  },
  {
    id: 'lp-portal',
    label: 'LP Portal',
    icon: 'Users',
    href: '/lp-portal',
    aiEnhanced: true,
    description: 'Limited Partner portal and reporting'
  },
  {
    id: 'market-intelligence',
    label: 'Market Intelligence',
    icon: 'TrendingUp',
    href: '/market-intelligence',
    aiEnhanced: true,
    description: 'Market analysis and intelligence insights'
  },
  {
    id: 'legal-management',
    label: 'Legal Management',
    icon: 'FileText',
    href: '/legal-management',
    aiEnhanced: true,
    description: 'Legal document and compliance management'
  },
  {
    id: 'knowledge-management',
    label: 'Knowledge Management',
    icon: 'Brain',
    href: '/knowledge-management',
    aiEnhanced: true,
    description: 'Knowledge base and document management'
  },
  {
    id: 'workflow-automation',
    label: 'Workflow Automation',
    icon: 'Zap',
    href: '/workflow-automation',
    aiEnhanced: true,
    description: 'Automated workflows and process management'
  },
  {
    id: 'advanced-analytics',
    label: 'Advanced Analytics',
    icon: 'BarChart',
    href: '/advanced-analytics',
    aiEnhanced: true,
    description: 'Advanced analytics and predictive modeling'
  },
  {
    id: 'admin-management',
    label: 'Admin Management',
    icon: 'Settings',
    href: '/admin-management',
    aiEnhanced: false,
    description: 'System administration and user management'
  }
]

export const useNavigationStoreRefactored = create<NavigationStore>()(
  persist(
    (set, get) => ({
      // Initial state
      currentMode: defaultUserMode,
      currentModule: 'dashboard',
      navigationItems: defaultNavigationItems,

      // Actions
      setMode: (mode: UserNavigationMode) => {
        set({ currentMode: mode })
      },

      setCurrentModule: (module: ModuleContext) => {
        set({ currentModule: module })
      },

      setNavigationItems: (items: NavigationItem[]) => {
        set({ navigationItems: items })
      }
    }),
    {
      name: 'navigation-storage-refactored-v2',
      partialize: (state) => ({
        currentMode: state.currentMode
        // Remove navigationItems from persistence - use defaults
      })
    }
  )
)