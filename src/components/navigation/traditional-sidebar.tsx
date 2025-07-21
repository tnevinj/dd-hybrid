'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useNavigationStore } from '@/stores/navigation-store'
import { NavigationItem } from '@/types/navigation'
import {
  Home,
  Search,
  FileText,
  PieChart,
  BarChart,
  Settings,
  Brain,
  ChevronRight,
  Sparkles
} from 'lucide-react'

interface TraditionalSidebarProps {
  enhanced?: boolean
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
}

export function TraditionalSidebar({ enhanced = false, className }: TraditionalSidebarProps) {
  const { 
    navigationItems, 
    currentMode, 
    recommendations,
    toggleAIPanel,
    isAIPanelOpen,
    getRecommendationsByModule 
  } = useNavigationStore()
  
  const pathname = usePathname()

  const getIcon = (iconName: string) => {
    const IconComponent = iconMap[iconName as keyof typeof iconMap]
    return IconComponent ? <IconComponent className="w-4 h-4" /> : <Home className="w-4 h-4" />
  }

  const getItemBadge = (item: NavigationItem) => {
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

  const getItemEnhancement = (item: NavigationItem) => {
    if (!enhanced || !item.aiEnhanced) return null
    
    return (
      <Sparkles className="w-3 h-3 text-purple-500" />
    )
  }

  return (
    <div className={`w-64 border-r bg-background ${className}`}>
      <div className="p-6 border-b">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">DD</span>
          </div>
          <div>
            <h1 className="font-semibold">DD Hybrid</h1>
            <p className="text-xs text-gray-500">Due Diligence Platform</p>
          </div>
        </div>
        
        {enhanced && currentMode.mode !== 'traditional' && (
          <Button
            variant={isAIPanelOpen ? "default" : "outline"}
            size="sm"
            className="w-full mt-3"
            onClick={toggleAIPanel}
          >
            <Brain className="w-4 h-4 mr-2" />
            AI Assistant
            {recommendations.length > 0 && (
              <Badge variant="ai" className="ml-2 text-xs">
                {recommendations.length}
              </Badge>
            )}
          </Button>
        )}
      </div>

      <nav className="p-4 space-y-2">
        {navigationItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          const badge = getItemBadge(item)
          const enhancement = getItemEnhancement(item)
          
          return (
            <Link key={item.id} href={item.href}>
              <div
                className={`
                  flex items-center justify-between p-3 rounded-lg transition-colors
                  ${isActive 
                    ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                    : 'hover:bg-gray-50 text-gray-700'
                  }
                `}
              >
                <div className="flex items-center space-x-3">
                  <div className={`${isActive ? 'text-blue-600' : 'text-gray-500'}`}>
                    {getIcon(item.icon || 'Home')}
                  </div>
                  <span className="font-medium text-sm">{item.label}</span>
                  {enhancement}
                </div>
                
                <div className="flex items-center space-x-1">
                  {badge}
                  {enhanced && item.aiEnhanced && (
                    <div className="text-xs text-purple-500">AI</div>
                  )}
                </div>
              </div>
            </Link>
          )
        })}
      </nav>

      {/* Mode indicator */}
      <div className="p-4 border-t mt-auto">
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
      </div>
    </div>
  )
}