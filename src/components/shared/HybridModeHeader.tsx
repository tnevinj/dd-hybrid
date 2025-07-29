'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { HelpCircle, Settings } from 'lucide-react'
import { HybridMode, HybridModeSwitcher } from './HybridModeSwitcher'

export interface HybridModeHeaderProps {
  currentMode: HybridMode
  onModeChange: (mode: HybridMode) => void
  moduleContext: 'due-diligence' | 'portfolio' | 'dashboard' | 'workspace'
  title: string
  subtitle?: string
  disabled?: boolean
  context?: any
  showHelpButton?: boolean
  showSettingsButton?: boolean
  onHelpClick?: () => void
  onSettingsClick?: () => void
  className?: string
  actions?: React.ReactNode
}

const getGradientStyles = (mode: HybridMode, moduleContext: string) => {
  // Base gradients for each mode
  const modeGradients = {
    traditional: 'bg-gradient-to-r from-gray-600 to-slate-600',
    assisted: 'bg-gradient-to-r from-purple-600 to-blue-600',
    autonomous: 'bg-gradient-to-r from-green-600 to-teal-600'
  }
  
  // Module-specific gradient variations
  const moduleVariations = {
    'due-diligence': {
      traditional: 'bg-gradient-to-r from-gray-600 to-slate-600',
      assisted: 'bg-gradient-to-r from-blue-600 to-purple-600',
      autonomous: 'bg-gradient-to-r from-green-600 to-emerald-600'
    },
    portfolio: {
      traditional: 'bg-gradient-to-r from-gray-600 to-stone-600',
      assisted: 'bg-gradient-to-r from-purple-600 to-pink-600',
      autonomous: 'bg-gradient-to-r from-green-600 to-teal-600'
    },
    dashboard: {
      traditional: 'bg-gradient-to-r from-gray-600 to-slate-600',
      assisted: 'bg-gradient-to-r from-green-600 to-teal-600',
      autonomous: 'bg-gradient-to-r from-blue-600 to-indigo-600'
    },
    workspace: {
      traditional: 'bg-gradient-to-r from-gray-600 to-slate-600',
      assisted: 'bg-gradient-to-r from-purple-600 to-blue-600',
      autonomous: 'bg-gradient-to-r from-green-600 to-teal-600'
    }
  }
  
  return moduleVariations[moduleContext]?.[mode] || modeGradients[mode]
}

const getModuleTitles = (moduleContext: string) => {
  const titles = {
    'due-diligence': 'Due Diligence Hybrid Platform',
    'portfolio': 'Portfolio Management Hub',
    'dashboard': 'Investment Dashboard',
    'workspace': 'Hybrid Workspace Management'
  }
  
  return titles[moduleContext] || 'Hybrid Platform'
}

export function HybridModeHeader({
  currentMode,
  onModeChange,
  moduleContext,
  title,
  subtitle,
  disabled = false,
  context,
  showHelpButton = true,
  showSettingsButton = true,
  onHelpClick,
  onSettingsClick,
  className = '',
  actions
}: HybridModeHeaderProps) {
  const gradientClass = getGradientStyles(currentMode, moduleContext)
  const defaultTitle = getModuleTitles(moduleContext)
  
  return (
    <div className={`${gradientClass} text-white p-6 ${className}`}>
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center">
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2">
              {title || defaultTitle}
            </h1>
            {subtitle && (
              <p className="text-white/90 text-sm">
                {subtitle}
              </p>
            )}
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Custom Actions */}
            {actions}
            
            {/* Mode Switcher */}
            <HybridModeSwitcher
              currentMode={currentMode}
              onModeChange={onModeChange}
              disabled={disabled}
              context={context}
              moduleContext={moduleContext}
            />
            
            {/* Standard Action Buttons */}
            <div className="flex items-center space-x-2">
              {showHelpButton && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  title="Help" 
                  className="text-white hover:bg-white hover:bg-opacity-20"
                  onClick={onHelpClick}
                >
                  <HelpCircle className="h-4 w-4" />
                </Button>
              )}
              
              {showSettingsButton && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  title="Settings" 
                  className="text-white hover:bg-white hover:bg-opacity-20"
                  onClick={onSettingsClick}
                >
                  <Settings className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HybridModeHeader