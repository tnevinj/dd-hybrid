'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  User, 
  Brain, 
  Bot,
  ChevronDown,
  Info
} from 'lucide-react'

export type HybridMode = 'traditional' | 'assisted' | 'autonomous'

export interface ModeConfig {
  id: HybridMode
  label: string
  icon: React.ComponentType<{ className?: string }>
  description: string
  color: string
  features: string[]
}

export interface HybridModeSwitcherProps {
  currentMode: HybridMode
  onModeChange: (mode: HybridMode) => void
  disabled?: boolean
  context?: any
  moduleContext?: 'due-diligence' | 'portfolio' | 'dashboard' | 'workspace'
  className?: string
  showFeatures?: boolean
}

const DEFAULT_MODES: ModeConfig[] = [
  { 
    id: 'traditional', 
    label: 'I\'ll Drive', 
    icon: User, 
    description: 'Complete manual control with traditional workflows',
    color: 'gray',
    features: [
      'Manual task execution',
      'Traditional workflows',
      'Full user control',
      'Standard reporting'
    ]
  },
  { 
    id: 'assisted', 
    label: 'Help me Drive', 
    icon: Brain, 
    description: 'AI-enhanced workflows with intelligent recommendations',
    color: 'purple',
    features: [
      'AI recommendations',
      'Smart automation',
      'Enhanced insights',
      'Workflow optimization'
    ]
  },
  { 
    id: 'autonomous', 
    label: 'You Drive', 
    icon: Bot, 
    description: 'AI handles operations with approval for key decisions',
    color: 'green',
    features: [
      'Autonomous execution',
      'Intelligent workflow routing',
      'Conversational interface',
      'Proactive optimization'
    ]
  }
]

const getModuleSpecificModes = (moduleContext: string): ModeConfig[] => {
  const baseModes = [...DEFAULT_MODES]
  
  switch (moduleContext) {
    case 'due-diligence':
      baseModes[0].description = 'Manual due diligence with complete user control over all tasks and decisions'
      baseModes[0].features = [
        'Manual document review',
        'Checklist-driven workflow',
        'Full user control',
        'Traditional reporting'
      ]
      baseModes[1].description = 'AI-powered insights and suggestions while maintaining user oversight and approval'
      baseModes[1].features = [
        'AI document analysis',
        'Smart risk detection',
        'Automated findings generation',
        'Enhanced collaboration'
      ]
      baseModes[2].description = 'AI handles routine DD tasks automatically, surfaces critical decisions and findings'
      baseModes[2].features = [
        'Automatic document processing',
        'AI-driven risk assessment',
        'Intelligent workflow routing',
        'Conversational interface'
      ]
      break
      
    case 'portfolio':
      baseModes[0].description = 'Manual portfolio management with direct control over all investment decisions'
      baseModes[0].features = [
        'Manual asset allocation',
        'Traditional analysis tools',
        'Direct portfolio control',
        'Standard performance metrics'
      ]
      baseModes[1].description = 'AI-enhanced portfolio optimization with smart rebalancing suggestions'
      baseModes[1].features = [
        'AI portfolio analysis',
        'Smart rebalancing alerts',
        'Risk optimization insights',
        'Performance predictions'
      ]
      baseModes[2].description = 'AI autonomously manages portfolio with approval for major allocation changes'
      baseModes[2].features = [
        'Autonomous rebalancing',
        'AI-driven asset selection',
        'Automated risk management',
        'Predictive optimization'
      ]
      break
      
    case 'dashboard':
      baseModes[0].description = 'Traditional dashboard with manual data analysis and reporting'
      baseModes[0].features = [
        'Manual data review',
        'Static reporting',
        'Traditional metrics',
        'User-driven insights'
      ]
      baseModes[1].description = 'AI-enhanced dashboard with intelligent insights and recommendations'
      baseModes[1].features = [
        'AI-powered insights',
        'Smart alerts',
        'Predictive analytics',
        'Automated reporting'
      ]
      baseModes[2].description = 'AI continuously monitors and optimizes operations with minimal user intervention'
      baseModes[2].features = [
        'Autonomous monitoring',
        'Proactive optimization',
        'Intelligent automation',
        'Predictive maintenance'
      ]
      break
      
    case 'workspace':
      baseModes[0].description = 'Manual workspace management with direct control over all operations'
      baseModes[0].features = [
        'Manual workspace creation',
        'Traditional organization',
        'Direct team management',
        'Standard workflows'
      ]
      baseModes[1].description = 'AI-enhanced workspace optimization with intelligent recommendations'
      baseModes[1].features = [
        'AI workspace insights',
        'Smart team optimization',
        'Workflow automation',
        'Efficiency predictions'
      ]
      baseModes[2].description = 'AI autonomously manages workspace operations with approval for key decisions'
      baseModes[2].features = [
        'Autonomous workspace management',
        'Intelligent team coordination',
        'Predictive optimization',
        'Conversational interface'
      ]
      break
  }
  
  return baseModes
}

export function HybridModeSwitcher({
  currentMode,
  onModeChange,
  disabled = false,
  context,
  moduleContext = 'dashboard',
  className = '',
  showFeatures = true
}: HybridModeSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false)
  
  const modes = getModuleSpecificModes(moduleContext)
  const currentModeConfig = modes.find(mode => mode.id === currentMode) || modes[0]

  const handleModeSelect = (mode: HybridMode) => {
    onModeChange(mode)
    setIsOpen(false)
  }

  const getModeStyles = (mode: string) => {
    switch (mode) {
      case 'traditional':
        return 'border-gray-300 bg-gray-50 hover:bg-gray-100 text-gray-900'
      case 'assisted':
        return 'border-purple-300 bg-purple-50 hover:bg-purple-100 text-purple-900'
      case 'autonomous':
        return 'border-green-300 bg-green-50 hover:bg-green-100 text-green-900'
      default:
        return 'border-gray-300 bg-gray-50 hover:bg-gray-100 text-gray-900'
    }
  }

  const getIconColor = (color: string) => {
    switch (color) {
      case 'gray': return 'text-gray-600'
      case 'purple': return 'text-purple-600'
      case 'green': return 'text-green-600'
      default: return 'text-gray-600'
    }
  }

  return (
    <div className={`relative ${className}`}>
      <Button
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled}
        className={`border-2 font-semibold shadow-md min-w-48 justify-between ${getModeStyles(currentMode)}`}
        variant="outline"
      >
        <div className="flex items-center space-x-2">
          <currentModeConfig.icon className="h-4 w-4" />
          <span>{currentModeConfig.label}</span>
        </div>
        <ChevronDown className="h-4 w-4" />
      </Button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-[28rem] max-w-[90vw] bg-white rounded-lg shadow-xl border border-gray-200 z-50">
          <div className="p-2">
            {modes.map((mode) => (
              <button
                key={mode.id}
                onClick={() => handleModeSelect(mode.id)}
                disabled={disabled}
                className={`w-full text-left p-4 rounded-md hover:bg-gray-50 transition-colors ${
                  currentMode === mode.id ? 'bg-blue-50 border border-blue-200' : ''
                } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <div className="flex items-start space-x-3">
                  <mode.icon className={`h-5 w-5 mt-0.5 ${getIconColor(mode.color)}`} />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-medium text-gray-900">{mode.label}</span>
                      {currentMode === mode.id && (
                        <Badge variant="outline" className="text-xs">Current</Badge>
                      )}
                    </div>
                    <div className="text-sm text-gray-600 mb-2">{mode.description}</div>
                    
                    {showFeatures && (
                      <div className="space-y-1">
                        {mode.features.slice(0, 3).map((feature, index) => (
                          <div key={index} className="flex items-center text-xs text-gray-500 leading-relaxed">
                            <div className="w-1 h-1 bg-gray-400 rounded-full mr-2 flex-shrink-0" />
                            <span>{feature}</span>
                          </div>
                        ))}
                        {mode.features.length > 3 && (
                          <div className="text-xs text-gray-400 italic">
                            +{mode.features.length - 3} more features
                          </div>
                        )}
                      </div>
                    )}
                    
                    {context && (
                      <div className="mt-2 p-2 bg-gray-50 rounded text-xs">
                        <div className="font-medium text-gray-700 mb-1">Current Context</div>
                        {typeof context === 'string' ? (
                          <div className="text-gray-600">{context}</div>
                        ) : (
                          <div className="space-y-1">
                            {context.activeDeals && (
                              <div className="text-gray-600">• {context.activeDeals} active deals</div>
                            )}
                            {context.teamMembers && (
                              <div className="text-gray-600">• {context.teamMembers} team members</div>
                            )}
                            {context.totalAUM && (
                              <div className="text-gray-600">• ${(context.totalAUM / 1000000000).toFixed(1)}B AUM</div>
                            )}
                            {context.totalAssets && (
                              <div className="text-gray-600">• {context.totalAssets} portfolio assets</div>
                            )}
                            {context.totalWorkspaces && (
                              <div className="text-gray-600">• {context.totalWorkspaces} workspaces</div>
                            )}
                            {!context.activeDeals && !context.teamMembers && !context.totalAUM && !context.totalAssets && !context.totalWorkspaces && (
                              <div className="text-gray-500 italic">Additional context available</div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
          
          <div className="border-t border-gray-200 p-3 bg-gray-50 rounded-b-lg">
            <div className="flex items-start space-x-2 text-xs text-gray-600">
              <Info className="h-3 w-3 mt-0.5 flex-shrink-0" />
              <span>
                Switch modes anytime. Your data and preferences are preserved across all modes.
                Each mode provides different levels of AI assistance.
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default HybridModeSwitcher