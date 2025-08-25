'use client'

import * as React from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  LayoutDashboard,
  CheckSquare,
  AlertTriangle,
  FileText,
  Users,
  BarChart3,
  MessageSquare,
  Brain,
  Zap,
  Lightbulb
} from 'lucide-react'

interface DDTabsProps {
  activeTab: string
  onTabChange: (tab: string) => void
  mode: 'traditional' | 'assisted' | 'autonomous'
  aiEnhancements?: boolean
}

export function DDTabs({ activeTab, onTabChange, mode, aiEnhancements = false }: DDTabsProps) {
  const tabsConfig = [
    {
      id: 'overview',
      label: 'Overview',
      icon: LayoutDashboard,
      aiFeatures: ['Smart insights', 'Progress prediction'],
      badge: aiEnhancements ? '3' : undefined
    },
    {
      id: 'tasks',
      label: 'Tasks',
      icon: CheckSquare,
      aiFeatures: ['Auto-prioritization', 'Smart assignment'],
      badge: mode === 'assisted' ? 'AI' : undefined
    },
    {
      id: 'operational',
      label: 'Operational',
      icon: Lightbulb,
      aiFeatures: ['Process optimization', 'Efficiency scoring', 'Benchmarking'],
      badge: mode === 'assisted' ? 'Enhanced' : undefined
    },
    {
      id: 'management',
      label: 'Management',
      icon: Users,
      aiFeatures: ['Team assessment', 'Competency analysis', 'Succession planning'],
      badge: mode === 'assisted' ? 'Enhanced' : undefined
    },
    {
      id: 'findings',
      label: 'Findings',
      icon: AlertTriangle,
      aiFeatures: ['Auto-categorization', 'Risk scoring'],
      badge: '3'
    },
    {
      id: 'risks',
      label: 'Risks',
      icon: AlertTriangle,
      aiFeatures: ['Pattern detection', 'Mitigation suggestions'],
      badge: '6'
    },
    {
      id: 'documents',
      label: 'Documents',
      icon: FileText,
      aiFeatures: ['Auto-extraction', 'Content analysis'],
      badge: '47'
    },
    {
      id: 'interviews',
      label: 'Interviews',
      icon: Users,
      aiFeatures: ['Question generation', 'Summary creation'],
      badge: undefined
    },
    {
      id: 'workflows',
      label: 'Workflows',
      icon: MessageSquare,
      aiFeatures: ['Automated workflows', 'Smart optimization'],
      badge: mode === 'assisted' ? 'AI' : undefined
    },
    {
      id: 'automation',
      label: 'AI Hub',
      icon: Zap,
      aiFeatures: ['Full automation', 'Intelligent insights'],
      badge: mode === 'assisted' ? 'New' : undefined
    },
    {
      id: 'predictive',
      label: 'Predictive AI',
      icon: Brain,
      aiFeatures: ['ML predictions', 'Success probability', 'Risk patterns', 'Timeline forecasting'],
      badge: 'ML'
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: BarChart3,
      aiFeatures: ['Predictive insights', 'Benchmarking'],
      badge: mode === 'assisted' ? 'New' : undefined
    }
  ]

  // Traditional mode shows all tabs clearly
  const renderTraditionalTabs = () => (
    <div className="border-b">
      <nav className="flex space-x-8 px-6">
        {tabsConfig.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`
                flex items-center space-x-2 py-4 border-b-2 text-sm font-medium transition-colors
                ${isActive 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.badge && (
                <Badge variant="outline" className="text-xs">
                  {tab.badge}
                </Badge>
              )}
            </button>
          )
        })}
      </nav>
    </div>
  )

  // Assisted mode shows AI enhancements
  const renderAssistedTabs = () => (
    <div className="border-b">
      <nav className="flex space-x-6 px-6">
        {tabsConfig.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          const hasAI = tab.aiFeatures.length > 0
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`
                relative flex items-center space-x-2 py-4 border-b-2 text-sm font-medium transition-colors group
                ${isActive 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              
              {hasAI && (
                <div className="flex items-center space-x-1">
                  <Brain className="w-3 h-3 text-blue-500" />
                  {tab.badge && (
                    <Badge variant={tab.badge === 'AI' || tab.badge === 'New' ? 'ai' : 'outline'} className="text-xs">
                      {tab.badge}
                    </Badge>
                  )}
                </div>
              )}
              
              {!hasAI && tab.badge && (
                <Badge variant="outline" className="text-xs">
                  {tab.badge}
                </Badge>
              )}

              {/* AI Features Tooltip */}
              {hasAI && (
                <div className="absolute top-full left-0 mt-2 px-3 py-2 bg-blue-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 whitespace-nowrap">
                  <div className="flex items-center space-x-1 mb-1">
                    <Lightbulb className="w-3 h-3" />
                    <span className="font-medium">AI Features:</span>
                  </div>
                  {tab.aiFeatures.map((feature, index) => (
                    <div key={index} className="text-blue-200">• {feature}</div>
                  ))}
                </div>
              )}
            </button>
          )
        })}
      </nav>
    </div>
  )

  // Autonomous mode uses minimal tab interface (not shown in autonomous view)
  const renderAutonomousTabs = () => null

  return (
    <>
      {mode === 'traditional' && renderTraditionalTabs()}
      {mode === 'assisted' && renderAssistedTabs()}
      {mode === 'autonomous' && renderAutonomousTabs()}
    </>
  )
}