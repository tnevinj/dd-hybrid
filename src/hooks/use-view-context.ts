import { usePathname, useSearchParams } from 'next/navigation'
import { useMemo, useState, useCallback } from 'react'

export interface ViewContext {
  type: 'workspace_list' | 'workspace_detail' | 'work_product_editor' | 'dashboard' | 'settings' | 'deal_screening' | 'portfolio'
  navigationMode: 'traditional' | 'assisted' | 'autonomous'
  data?: {
    workspaceId?: string
    workspaceName?: string
    workProductId?: string
    workProductTitle?: string
    activeTab?: string
    opportunityId?: string
    [key: string]: any
  }
}

export function useViewContext(
  overrideData?: Partial<ViewContext['data']>
): ViewContext & {
  switchNavigationMode: (mode: 'traditional' | 'assisted' | 'autonomous') => void;
  setCurrentView?: (view: ViewContext) => void;
  currentView?: ViewContext;
} {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [navigationMode, setNavigationMode] = useState<'traditional' | 'assisted' | 'autonomous'>('traditional')

  const switchNavigationMode = useCallback((mode: 'traditional' | 'assisted' | 'autonomous') => {
    setNavigationMode(mode)
  }, [])
  
  const viewContext = useMemo((): ViewContext => {
    // Extract navigation mode from URL or use state
    const urlMode = searchParams.get('mode') as 'traditional' | 'assisted' | 'autonomous'
    const currentMode = urlMode || navigationMode

    // Extract context from URL
    if (pathname === '/dashboard') {
      return { 
        type: 'dashboard',
        navigationMode: currentMode,
        data: overrideData
      }
    }

    if (pathname.startsWith('/deal-screening')) {
      const opportunityMatch = pathname.match(/\/deal-screening\/opportunity\/([^/]+)/)
      return {
        type: 'deal_screening',
        navigationMode: currentMode,
        data: {
          opportunityId: opportunityMatch?.[1],
          ...overrideData
        }
      }
    }
    
    if (pathname === '/workspaces') {
      return { 
        type: 'workspace_list',
        navigationMode: currentMode,
        data: overrideData
      }
    }
    
    if (pathname.match(/\/workspaces\/[^/]+\/work-products\/[^/]+/)) {
      const matches = pathname.match(/\/workspaces\/([^/]+)\/work-products\/([^/]+)/)
      return {
        type: 'work_product_editor',
        navigationMode: currentMode,
        data: {
          workspaceId: matches?.[1],
          workProductId: matches?.[2],
          ...overrideData
        }
      }
    }
    
    if (pathname.match(/\/workspaces\/[^/]+/)) {
      const matches = pathname.match(/\/workspaces\/([^/]+)/)
      const activeTab = searchParams.get('tab') || 'overview'
      return {
        type: 'workspace_detail',
        navigationMode: currentMode,
        data: {
          workspaceId: matches?.[1],
          activeTab,
          ...overrideData
        }
      }
    }
    
    if (pathname === '/settings') {
      return { 
        type: 'settings',
        navigationMode: currentMode,
        data: overrideData
      }
    }

    if (pathname === '/portfolio' || pathname.startsWith('/portfolio/')) {
      return { 
        type: 'portfolio',
        navigationMode: currentMode,
        data: overrideData
      }
    }
    
    // Fallback
    return { 
      type: 'dashboard',
      navigationMode: currentMode,
      data: overrideData
    }
  }, [pathname, searchParams, overrideData, navigationMode])

  return {
    ...viewContext,
    switchNavigationMode,
    currentView: viewContext,
    setCurrentView: (view: ViewContext) => {
      // Could be extended to handle view switching if needed
    }
  }
}