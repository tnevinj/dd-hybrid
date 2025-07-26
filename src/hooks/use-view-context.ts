import { usePathname, useSearchParams } from 'next/navigation'
import { useMemo } from 'react'

export interface ViewContext {
  type: 'workspace_list' | 'workspace_detail' | 'work_product_editor' | 'dashboard' | 'settings'
  data?: {
    workspaceId?: string
    workspaceName?: string
    workProductId?: string
    workProductTitle?: string
    activeTab?: string
    [key: string]: any
  }
}

export function useViewContext(
  overrideData?: Partial<ViewContext['data']>
): ViewContext {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  
  return useMemo((): ViewContext => {
    // Extract context from URL
    if (pathname === '/dashboard') {
      return { 
        type: 'dashboard',
        data: overrideData
      }
    }
    
    if (pathname === '/workspaces') {
      return { 
        type: 'workspace_list',
        data: overrideData
      }
    }
    
    if (pathname.match(/\/workspaces\/[^/]+\/work-products\/[^/]+/)) {
      const matches = pathname.match(/\/workspaces\/([^/]+)\/work-products\/([^/]+)/)
      return {
        type: 'work_product_editor',
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
        data: overrideData
      }
    }
    
    // Fallback
    return { 
      type: 'dashboard',
      data: overrideData
    }
  }, [pathname, searchParams, overrideData])
}