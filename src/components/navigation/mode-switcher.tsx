'use client'

import * as React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useNavigationStoreRefactored } from '@/stores/navigation-store-refactored'
import { UserNavigationMode } from '@/types/navigation'
import { 
  Zap, 
  Shield, 
  Clock, 
  TrendingUp, 
  ChevronRight, 
  Check,
  ArrowRight,
  Brain,
  User,
  Bot,
  Sparkles,
  Hand
} from 'lucide-react'

interface ModeSwitcherProps {
  className?: string
  showOnboarding?: boolean
  onModeSelect?: (mode: UserNavigationMode['mode']) => void
}

export function ModeSwitcher({ className, showOnboarding = false, onModeSelect }: ModeSwitcherProps) {
  const { currentMode, setMode } = useNavigationStoreRefactored()
  const [selectedMode, setSelectedMode] = React.useState<UserNavigationMode['mode']>(currentMode.mode)

  const modeConfig = {
    traditional: {
      title: "I'll Drive",
      subtitle: 'Traditional Navigation',
      description: 'Full control with familiar interface patterns',
      icon: <User className="w-5 h-5" />,
      color: 'bg-blue-50 border-blue-200 text-blue-800',
      benefits: [
        'Complete user control',
        'No AI interference',
        'Familiar workflows',
        'Maximum privacy'
      ],
      timeSaved: 0,
      adoptionRate: 95,
      permissions: {
        suggestions: false,
        autoComplete: false,
        proactiveActions: false,
        autonomousExecution: false,
      }
    },
    assisted: {
      title: "Help Me Drive",
      subtitle: 'AI-Assisted Navigation',
      description: 'Smart suggestions and contextual assistance',
      icon: <Sparkles className="w-5 h-5" />,
      color: 'bg-purple-50 border-purple-200 text-purple-800',
      benefits: [
        'Smart recommendations',
        'Contextual insights',
        'User maintains control',
        'Time-saving automations'
      ],
      timeSaved: 30,
      adoptionRate: 65,
      permissions: {
        suggestions: true,
        autoComplete: true,
        proactiveActions: false,
        autonomousExecution: false,
      }
    },
    autonomous: {
      title: "You Drive",
      subtitle: 'AI-Autonomous Mode',
      description: 'Conversational interface with AI taking initiative',
      icon: <Bot className="w-5 h-5" />,
      color: 'bg-green-50 border-green-200 text-green-800',
      benefits: [
        'Natural conversation',
        'Proactive assistance',
        'Complex task automation',
        'Maximum efficiency'
      ],
      timeSaved: 60,
      adoptionRate: 25,
      permissions: {
        suggestions: true,
        autoComplete: true,
        proactiveActions: true,
        autonomousExecution: true,
      }
    }
  }

  const handleModeSelect = (mode: UserNavigationMode['mode']) => {
    setSelectedMode(mode)
    if (onModeSelect) {
      onModeSelect(mode)
    }
  }

  const handleApplyMode = () => {
    const config = modeConfig[selectedMode]
    setMode({
      mode: selectedMode,
      aiPermissions: config.permissions,
      preferredDensity: 'comfortable'
    })
  }

  // Simple mode switcher for compact view
  if (!showOnboarding) {
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
      const config = modeConfig[modeId as UserNavigationMode['mode']]
      const newMode: UserNavigationMode = {
        mode: modeId as UserNavigationMode['mode'],
        aiPermissions: config.permissions,
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

  // Full onboarding view
  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="w-5 h-5 text-blue-600" />
            <span>Choose Your Navigation Style</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            Our hybrid navigation adapts to your comfort level with AI assistance. 
            Start with what feels natural and progress at your own pace.
          </p>
          <div className="flex items-center space-x-2 text-sm text-blue-600">
            <Clock className="w-4 h-4" />
            <span>Users typically save 2-4 hours per week after transitioning to assisted mode</span>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {Object.entries(modeConfig).map(([mode, config]) => (
          <Card 
            key={mode}
            className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
              selectedMode === mode 
                ? 'ring-2 ring-blue-500 shadow-lg' 
                : 'hover:shadow-md'
            }`}
            onClick={() => handleModeSelect(mode as UserNavigationMode['mode'])}
          >
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <div className={`p-3 rounded-lg ${config.color}`}>
                  {config.icon}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {config.title}
                      </h3>
                      <p className="text-sm text-gray-500">{config.subtitle}</p>
                    </div>
                    
                    <div className="text-right">
                      {currentMode.mode === mode && (
                        <Badge variant="success" className="mb-1">
                          <Check className="w-3 h-3 mr-1" />
                          Current
                        </Badge>
                      )}
                      {config.timeSaved > 0 && (
                        <div className="text-xs text-gray-500">
                          ~{config.timeSaved}% time saved
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mb-3">
                    {config.description}
                  </p>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Benefits</h4>
                      <ul className="space-y-1">
                        {config.benefits.map((benefit, index) => (
                          <li key={index} className="text-xs text-gray-600 flex items-center">
                            <div className="w-1 h-1 bg-gray-400 rounded-full mr-2" />
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">AI Permissions</h4>
                      <div className="space-y-1 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Suggestions</span>
                          {config.permissions.suggestions ? (
                            <Check className="w-3 h-3 text-green-500" />
                          ) : (
                            <div className="w-3 h-3 border border-gray-300 rounded" />
                          )}
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Auto-complete</span>
                          {config.permissions.autoComplete ? (
                            <Check className="w-3 h-3 text-green-500" />
                          ) : (
                            <div className="w-3 h-3 border border-gray-300 rounded" />
                          )}
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Proactive Actions</span>
                          {config.permissions.proactiveActions ? (
                            <Check className="w-3 h-3 text-green-500" />
                          ) : (
                            <div className="w-3 h-3 border border-gray-300 rounded" />
                          )}
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Autonomous Execution</span>
                          {config.permissions.autonomousExecution ? (
                            <Check className="w-3 h-3 text-green-500" />
                          ) : (
                            <div className="w-3 h-3 border border-gray-300 rounded" />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {config.adoptionRate > 0 && (
                    <div className="flex items-center text-xs text-gray-500 mb-2">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      <span>{config.adoptionRate}% of users use this mode regularly</span>
                    </div>
                  )}
                </div>
                
                {selectedMode === mode && (
                  <div className="ml-auto">
                    <ChevronRight className="w-5 h-5 text-blue-500" />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedMode !== currentMode.mode && (
        <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <div className={`p-1 rounded ${modeConfig[currentMode.mode].color}`}>
                {modeConfig[currentMode.mode].icon}
              </div>
              <span className="text-sm text-gray-600">
                {modeConfig[currentMode.mode].title}
              </span>
            </div>
            
            <ArrowRight className="w-4 h-4 text-gray-400" />
            
            <div className="flex items-center space-x-2">
              <div className={`p-1 rounded ${modeConfig[selectedMode].color}`}>
                {modeConfig[selectedMode].icon}
              </div>
              <span className="text-sm font-medium text-gray-900">
                {modeConfig[selectedMode].title}
              </span>
            </div>
          </div>
          
          <Button onClick={handleApplyMode} className="flex items-center space-x-2">
            <Zap className="w-4 h-4" />
            <span>Switch Mode</span>
          </Button>
        </div>
      )}

      <Card className="bg-yellow-50 border-yellow-200">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <Shield className="w-5 h-5 text-yellow-600 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-yellow-800 mb-1">
                Safety & Control
              </h4>
              <p className="text-xs text-yellow-700">
                You can change modes anytime. All AI actions require your approval, 
                and you can always rollback or override any automated actions.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}