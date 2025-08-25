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
  // Base gradients for each mode - Investment Banking Professional Colors
  const modeGradients = {
    traditional: 'bg-gradient-to-r from-gray-600 to-slate-600',
    assisted: 'bg-gradient-to-r from-blue-600 to-gray-600',
    autonomous: 'bg-gradient-to-r from-blue-800 to-gray-700'
  }
  
  // Module-specific gradient variations - Investment Banking Professional Colors
  const moduleVariations: Record<string, Record<HybridMode, string>> = {
    'due-diligence': {
      traditional: 'bg-gradient-to-r from-gray-600 to-slate-600',
      assisted: 'bg-gradient-to-r from-blue-600 to-gray-600',
      autonomous: 'bg-gradient-to-r from-blue-800 to-gray-700'
    },
    portfolio: {
      traditional: 'bg-gradient-to-r from-gray-600 to-stone-600',
      assisted: 'bg-gradient-to-r from-blue-600 to-gray-600',
      autonomous: 'bg-gradient-to-r from-blue-800 to-gray-700'
    },
    dashboard: {
      traditional: 'bg-gradient-to-r from-gray-600 to-slate-600',
      assisted: 'bg-gradient-to-r from-blue-600 to-gray-600',
      autonomous: 'bg-gradient-to-r from-blue-800 to-gray-700'
    },
    workspace: {
      traditional: 'bg-gradient-to-r from-gray-600 to-slate-600',
      assisted: 'bg-gradient-to-r from-blue-600 to-gray-600',
      autonomous: 'bg-gradient-to-r from-blue-800 to-gray-700'
    },
    'deal-screening': {
      traditional: 'bg-gradient-to-r from-gray-600 to-slate-600',
      assisted: 'bg-gradient-to-r from-blue-600 to-gray-600',
      autonomous: 'bg-gradient-to-r from-blue-800 to-gray-700'
    },
    'deal-structuring': {
      traditional: 'bg-gradient-to-r from-gray-600 to-slate-600',
      assisted: 'bg-gradient-to-r from-blue-600 to-gray-600',
      autonomous: 'bg-gradient-to-r from-blue-800 to-gray-700'
    },
    'fund-operations': {
      traditional: 'bg-gradient-to-r from-gray-600 to-slate-600',
      assisted: 'bg-gradient-to-r from-blue-600 to-gray-600',
      autonomous: 'bg-gradient-to-r from-blue-800 to-gray-700'
    },
    'investment-committee': {
      traditional: 'bg-gradient-to-r from-gray-600 to-slate-600',
      assisted: 'bg-gradient-to-r from-blue-600 to-gray-600',
      autonomous: 'bg-gradient-to-r from-blue-800 to-gray-700'
    },
    'legal-management': {
      traditional: 'bg-gradient-to-r from-gray-600 to-slate-600',
      assisted: 'bg-gradient-to-r from-blue-600 to-gray-600',
      autonomous: 'bg-gradient-to-r from-blue-800 to-gray-700'
    },
    'market-intelligence': {
      traditional: 'bg-gradient-to-r from-gray-600 to-slate-600',
      assisted: 'bg-gradient-to-r from-blue-600 to-gray-600',
      autonomous: 'bg-gradient-to-r from-blue-800 to-gray-700'
    },
    'advanced-analytics': {
      traditional: 'bg-gradient-to-r from-gray-600 to-slate-600',
      assisted: 'bg-gradient-to-r from-blue-600 to-gray-600',
      autonomous: 'bg-gradient-to-r from-blue-800 to-gray-700'
    },
    'lp-portal': {
      traditional: 'bg-gradient-to-r from-gray-600 to-slate-600',
      assisted: 'bg-gradient-to-r from-blue-600 to-gray-600',
      autonomous: 'bg-gradient-to-r from-blue-800 to-gray-700'
    },
    'gp-portal': {
      traditional: 'bg-gradient-to-r from-gray-600 to-slate-600',
      assisted: 'bg-gradient-to-r from-blue-600 to-gray-600',
      autonomous: 'bg-gradient-to-r from-blue-800 to-gray-700'
    }
  }
  
  return moduleVariations[moduleContext]?.[mode] || modeGradients[mode]
}

const getModuleTitles = (moduleContext: string) => {
  const titles: Record<string, string> = {
    'due-diligence': 'Due Diligence Hybrid Platform',
    'portfolio': 'Portfolio Management Hub',
    'dashboard': 'Investment Dashboard',
    'workspace': 'Hybrid Workspace Management',
    'deal-screening': 'Deal Screening Platform',
    'deal-structuring': 'Deal Structuring Platform',
    'fund-operations': 'Fund Operations Hub',
    'investment-committee': 'Investment Committee Portal',
    'legal-management': 'Legal Management Platform',
    'market-intelligence': 'Market Intelligence Hub',
    'advanced-analytics': 'Advanced Analytics Platform',
    'lp-portal': 'Limited Partner Portal',
    'gp-portal': 'General Partner Portal'
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
