'use client'

import * as React from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useNavigationStore } from '@/stores/navigation-store'
import { UserNavigationMode } from '@/types/navigation'
import { Brain, Hand, Zap } from 'lucide-react'

interface ModeSwitcherProps {
  className?: string
}

export function ModeSwitcher({ className }: ModeSwitcherProps) {
  const { currentMode, setMode } = useNavigationStore()

  const modes = [
    {
      id: 'traditional',
      label: 'Traditional',
      description: 'Full navigation control',
      icon: <Hand className="w-4 h-4" />,
      color: 'text-gray-600',
      features: ['Manual navigation', 'All features visible', 'Optional AI hints']
    },
    {
      id: 'assisted',
      label: 'AI Assisted',
      description: 'Smart suggestions & automation',
      icon: <Brain className="w-4 h-4" />,
      color: 'text-blue-600',
      features: ['Proactive suggestions', 'Automation options', 'Pattern recognition']
    },
    {
      id: 'autonomous',
      label: 'AI Autonomous',
      description: 'Let AI handle routine tasks',
      icon: <Zap className="w-4 h-4" />,
      color: 'text-purple-600',
      features: ['Minimal interface', 'AI-first workflows', 'Natural language']
    }
  ]

  const handleModeChange = (modeId: string) => {
    const newMode: UserNavigationMode = {
      mode: modeId as UserNavigationMode['mode'],
      aiPermissions: {
        suggestions: true,
        autoComplete: modeId !== 'traditional',
        proactiveActions: modeId === 'assisted' || modeId === 'autonomous',
        autonomousExecution: modeId === 'autonomous',
      },
      preferredDensity: currentMode.preferredDensity
    }
    
    setMode(newMode)
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Navigation Mode</h3>
        <Badge variant="ai" className="capitalize">
          {currentMode.mode}
        </Badge>
      </div>
      
      <div className="grid gap-3">
        {modes.map((mode) => {
          const isActive = currentMode.mode === mode.id
          
          return (
            <div
              key={mode.id}
              className={`
                relative p-4 rounded-lg border cursor-pointer transition-all
                ${isActive 
                  ? 'border-blue-200 bg-blue-50 shadow-sm' 
                  : 'border-gray-200 hover:border-gray-300'
                }
              `}
              onClick={() => handleModeChange(mode.id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${isActive ? 'bg-blue-100' : 'bg-gray-100'}`}>
                    <div className={isActive ? 'text-blue-600' : 'text-gray-600'}>
                      {mode.icon}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-sm">{mode.label}</h4>
                    <p className="text-xs text-gray-500">{mode.description}</p>
                  </div>
                </div>
                
                {isActive && (
                  <div className="w-2 h-2 bg-blue-600 rounded-full" />
                )}
              </div>
              
              <div className="mt-3 space-y-1">
                {mode.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className={`w-1 h-1 rounded-full ${isActive ? 'bg-blue-400' : 'bg-gray-300'}`} />
                    <span className="text-xs text-gray-600">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
      
      <div className="text-xs text-gray-500">
        You can change modes anytime. Your work is never lost.
      </div>
    </div>
  )
}