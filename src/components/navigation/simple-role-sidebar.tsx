'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { useNavigationStoreRefactored } from '@/stores/navigation-store-refactored'
import { useAIStore } from '@/stores/ai-store'
import { useNavigation } from '@/stores/role-store'
import type { RoleBasedNavigationItem } from '@/types/roles'
import {
  Home,
  Search,
  FileText,
  PieChart,
  BarChart,
  Settings,
  Brain,
  FolderOpen,
  Building,
  Users,
  Shield,
  TrendingUp,
  Zap,
  Layout
} from 'lucide-react'

interface SimpleRoleSidebarProps {
  enhanced?: boolean
  collapsed?: boolean
  className?: string
}

const iconMap = {
  Home,
  Search,
  FileText,
  PieChart,
  BarChart,
  Settings,
  Brain,
  FolderOpen,
  Building,
  Users,
  Shield,
  TrendingUp,
  Zap,
  Layout
}

export function SimpleRoleSidebar({ enhanced = false, collapsed = false, className }: SimpleRoleSidebarProps) {
  const { navigationItems } = useNavigation()
  const { currentMode } = useNavigationStoreRefactored()
  const {
    recommendations,
    toggleAIPanel,
    isAIPanelOpen,
    getRecommendationsByModule 
  } = useAIStore()
  
  const pathname = usePathname()

  // Group navigation items by category
  const groupedItems = React.useMemo(() => {
    const groups = {
      primary: navigationItems.filter(item => item.category === 'primary'),
      secondary: navigationItems.filter(item => item.category === 'secondary'),
      admin: navigationItems.filter(item => item.category === 'admin')
    }
    return groups
  }, [navigationItems])

  const getIcon = (iconName: string) => {
    const IconComponent = iconMap[iconName as keyof typeof iconMap]
    return IconComponent ? <IconComponent className="w-4 h-4" /> : <Home className="w-4 h-4" />
  }

  const getItemBadge = (item: RoleBasedNavigationItem) => {
    if (!enhanced) return null
    
    // Get recommendations count for this module
    const moduleRecommendations = getRecommendationsByModule(item.id)
    const count = moduleRecommendations.length
    
    if (count > 0) {
      return (
        <Badge variant="ai" className="text-xs">
          {count}
        </Badge>
      )
    }
    
    return null
  }

  const renderNavigationGroup = (items: RoleBasedNavigationItem[], title?: string) => {
    if (items.length === 0) return null

    return (
      <div className="space-y-1">
        {title && !collapsed && (
          <div className="px-3 py-2">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              {title}
            </h3>
          </div>
        )}
        {items.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          const badge = getItemBadge(item)
          
          return (
            <Link key={item.id} href={item.href}>
              <div
                className={`
                  flex items-center ${collapsed ? 'justify-center' : 'justify-between'} p-3 mx-2 rounded-lg transition-colors
                  ${isActive 
                    ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                    : 'hover:bg-gray-50 text-gray-700'
                  }
                `}
                title={collapsed ? item.label : item.description}
              >
                <div className={`flex items-center ${collapsed ? 'justify-center' : 'space-x-3'}`}>
                  <div className={`${isActive ? 'text-blue-600' : 'text-gray-500'}`}>
                    {getIcon(item.icon || 'Home')}
                  </div>
                  {!collapsed && (
                    <div className="flex-1">
                      <span className="font-medium text-sm">{item.label}</span>
                      {item.description && (
                        <p className="text-xs text-gray-500 mt-0.5">{item.description}</p>
                      )}
                    </div>
                  )}
                </div>
                
                {!collapsed && badge && (
                  <div className="flex items-center space-x-1">
                    {badge}
                  </div>
                )}
                
                {collapsed && badge && (
                  <div className="absolute right-1 top-1">
                    {badge}
                  </div>
                )}
              </div>
            </Link>
          )
        })}
      </div>
    )
  }

  return (
    <div className={`${collapsed ? 'w-16' : 'w-64'} border-r bg-background transition-all duration-300 ${className} flex flex-col overflow-visible`}>
      {/* Header */}
      <div className={`${collapsed ? 'p-4' : 'p-6'} border-b`}>
        <div className={`flex items-center ${collapsed ? 'justify-center' : 'space-x-2'}`}>
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">EP</span>
          </div>
          {!collapsed && (
            <div className="flex-1">
              <h1 className="font-semibold">Edge Platform</h1>
              <p className="text-xs text-gray-500">Investment Management</p>
            </div>
          )}
        </div>
        
        {/* AI Panel Toggle */}
        {!collapsed && enhanced && currentMode.mode !== 'traditional' && (
          <Button
            variant={isAIPanelOpen ? "default" : "outline"}
            size="sm"
            className="w-full mt-3"
            onClick={toggleAIPanel}
          >
            <Brain className="w-4 h-4 mr-2" />
            Thando
            {recommendations.length > 0 && (
              <Badge variant="ai" className="ml-2 text-xs">
                {recommendations.length}
              </Badge>
            )}
          </Button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-6 overflow-y-auto overflow-x-visible">
        {/* Primary Navigation */}
        {renderNavigationGroup(groupedItems.primary)}
        
        {/* Secondary Navigation */}
        {groupedItems.secondary.length > 0 && (
          <>
            {!collapsed && <Separator />}
            {renderNavigationGroup(groupedItems.secondary, collapsed ? undefined : "Tools")}
          </>
        )}
        
        {/* Admin Navigation */}
        {groupedItems.admin.length > 0 && (
          <>
            {!collapsed && <Separator />}
            {renderNavigationGroup(groupedItems.admin, collapsed ? undefined : "Administration")}
          </>
        )}
      </nav>

      {/* Footer */}
      {!collapsed && (
        <div className="p-4 border-t">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500">Navigation Mode</span>
            <Badge 
              variant={currentMode.mode === 'traditional' ? 'outline' : 'ai'}
              className="text-xs"
            >
              {currentMode.mode}
            </Badge>
          </div>
          
          {enhanced && currentMode.mode !== 'traditional' && (
            <div className="mt-2 text-xs text-gray-500">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span>AI assistance active</span>
              </div>
            </div>
          )}
          
          {/* Unified platform info */}
          <div className="mt-2 text-xs text-gray-500">
            <div className="flex items-center justify-between">
              <span>Access Level</span>
              <span className="font-medium">Full Access</span>
            </div>
            <div className="flex items-center justify-between mt-1">
              <span>Modules</span>
              <span className="font-medium">{navigationItems.length}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
