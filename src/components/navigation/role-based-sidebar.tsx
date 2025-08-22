'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { useAuthStore, usePermissions } from '@/stores/auth-store'
import { useNavigationStoreRefactored } from '@/stores/navigation-store-refactored'
import { useAIStore } from '@/stores/ai-store'
import { getRoleBasedNavigation } from '@/types/roles'
import { ROLE_DEFINITIONS } from '@/types/roles'
import type { RoleBasedNavigationItem } from '@/types/roles'
import {
  Home,
  Search,
  FileText,
  PieChart,
  BarChart,
  Settings,
  Brain,
  ChevronRight,
  Sparkles,
  FolderOpen,
  Building,
  Users,
  Shield,
  TrendingUp,
  Zap,
  LogOut,
  User,
  ChevronDown,
  Crown,
  Briefcase,
  Scale
} from 'lucide-react'

interface RoleBasedSidebarProps {
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
  Crown,
  Briefcase,
  Scale
}

const roleIcons = {
  senior_partner: Crown,
  investment_director: Briefcase,
  principal: Briefcase,
  associate: Users,
  analyst: BarChart,
  fund_operations: Building,
  portfolio_operations: PieChart,
  legal_compliance: Scale,
  ir_lp_relations: Users,
  general_partner: Shield,
  limited_partner: Users,
  portfolio_company: Building,
  admin: Settings
}

const roleColors = {
  senior_partner: 'text-purple-600 bg-purple-50 border-purple-200',
  investment_director: 'text-blue-600 bg-blue-50 border-blue-200',
  principal: 'text-blue-600 bg-blue-50 border-blue-200',
  associate: 'text-green-600 bg-green-50 border-green-200',
  analyst: 'text-green-600 bg-green-50 border-green-200',
  fund_operations: 'text-orange-600 bg-orange-50 border-orange-200',
  portfolio_operations: 'text-orange-600 bg-orange-50 border-orange-200',
  legal_compliance: 'text-red-600 bg-red-50 border-red-200',
  ir_lp_relations: 'text-indigo-600 bg-indigo-50 border-indigo-200',
  general_partner: 'text-gray-600 bg-gray-50 border-gray-200',
  limited_partner: 'text-gray-600 bg-gray-50 border-gray-200',
  portfolio_company: 'text-gray-600 bg-gray-50 border-gray-200',
  admin: 'text-slate-600 bg-slate-50 border-slate-200'
}

export function RoleBasedSidebar({ enhanced = false, collapsed = false, className }: RoleBasedSidebarProps) {
  const { user, logout } = useAuthStore()
  const { hasPermission, canAccessModule } = usePermissions()
  const { currentMode } = useNavigationStoreRefactored()
  const {
    recommendations,
    toggleAIPanel,
    isAIPanelOpen,
    getRecommendationsByModule 
  } = useAIStore()
  
  const pathname = usePathname()
  const [showRoleMenu, setShowRoleMenu] = React.useState(false)

  // Get role-based navigation items
  const navigationItems = React.useMemo(() => {
    if (!user) return []
    return getRoleBasedNavigation(user)
  }, [user])

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

  if (!user) {
    return (
      <div className={`${collapsed ? 'w-16' : 'w-64'} border-r bg-background transition-all duration-300 ${className}`}>
        <div className="p-6 text-center">
          <p className="text-sm text-gray-500">Please log in</p>
        </div>
      </div>
    )
  }

  const roleDefinition = ROLE_DEFINITIONS[user.role]
  const RoleIcon = roleIcons[user.role]

  return (
    <div className={`${collapsed ? 'w-16' : 'w-64'} border-r bg-background transition-all duration-300 ${className} flex flex-col`}>
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
        
        {/* User Role Badge */}
        {!collapsed && (
          <div className="mt-4">
            <div 
              className={`flex items-center space-x-2 p-2 rounded-lg border cursor-pointer ${roleColors[user.role]}`}
              onClick={() => setShowRoleMenu(!showRoleMenu)}
            >
              <RoleIcon className="w-4 h-4" />
              <div className="flex-1">
                <p className="text-sm font-medium">{user.name}</p>
                <p className="text-xs opacity-75">{roleDefinition.name}</p>
              </div>
              <ChevronDown className={`w-4 h-4 transition-transform ${showRoleMenu ? 'rotate-180' : ''}`} />
            </div>
            
            {/* Role Menu */}
            {showRoleMenu && (
              <div className="mt-2 p-2 bg-white border rounded-lg shadow-lg">
                <div className="space-y-1">
                  <div className="px-2 py-1 text-xs text-gray-500">
                    {roleDefinition.description}
                  </div>
                  <Separator />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-xs"
                    onClick={() => {
                      setShowRoleMenu(false)
                      // Navigate to profile/settings
                    }}
                  >
                    <User className="w-3 h-3 mr-2" />
                    Profile Settings
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => {
                      setShowRoleMenu(false)
                      logout()
                    }}
                  >
                    <LogOut className="w-3 h-3 mr-2" />
                    Sign Out
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
        
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
      <nav className="flex-1 p-4 space-y-6 overflow-y-auto">
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
          
          {/* Role-specific info */}
          <div className="mt-2 text-xs text-gray-500">
            <div className="flex items-center justify-between">
              <span>Access Level</span>
              <span className="font-medium">{roleDefinition.category === 'internal' ? 'Internal' : 'External'}</span>
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
