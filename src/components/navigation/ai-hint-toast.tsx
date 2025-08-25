'use client'

import * as React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useNavigationStoreRefactored } from '@/stores/navigation-store-refactored'
import { X, Lightbulb, Sparkles, TrendingUp } from 'lucide-react'

interface AIHint {
  id: string
  message: string
  actionLabel?: string
  onAction?: () => void
  type: 'tip' | 'pattern' | 'efficiency'
  dismissible: boolean
  priority: 'low' | 'medium' | 'high'
}

interface AIHintToastProps {
  hint?: AIHint
  onDismiss?: (hintId: string) => void
  className?: string
}

export function AIHintToast({ hint, onDismiss, className }: AIHintToastProps) {
  const { currentMode, trackInteraction } = useNavigationStoreRefactored()
  const [isVisible, setIsVisible] = React.useState(true)

  // Don't show AI hints in traditional mode unless they're very subtle
  if (currentMode.mode !== 'traditional' || !hint || !isVisible) {
    return null
  }

  const handleDismiss = () => {
    setIsVisible(false)
    onDismiss?.(hint.id)
    trackInteraction?.({
      type: 'hint_dismissed',
      hintId: hint.id,
      context: { mode: currentMode.mode }
    })
  }

  const handleAction = () => {
    hint.onAction?.()
    trackInteraction?.({
      type: 'hint_accepted',
      hintId: hint.id,
      context: { mode: currentMode.mode }
    })
  }

  const getIcon = () => {
    switch (hint.type) {
      case 'tip': return <Lightbulb className="w-4 h-4" />
      case 'pattern': return <TrendingUp className="w-4 h-4" />
      case 'efficiency': return <Sparkles className="w-4 h-4" />
      default: return <Lightbulb className="w-4 h-4" />
    }
  }

  const getColors = () => {
    switch (hint.type) {
      case 'tip': return 'border-blue-200 bg-blue-50 text-blue-800'
      case 'pattern': return 'border-blue-200 bg-blue-50 text-blue-800'
      case 'efficiency': return 'border-green-200 bg-green-50 text-green-800'
      default: return 'border-gray-200 bg-gray-50 text-gray-800'
    }
  }

  return (
    <Card className={`fixed bottom-6 right-6 w-80 shadow-lg ${getColors()} ${className} animate-in slide-in-from-bottom-2 duration-300`}>
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0 mt-0.5">
            {getIcon()}
          </div>
          
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium mb-2">{hint.message}</p>
            
            <div className="flex items-center justify-between">
              {hint.actionLabel && hint.onAction && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAction}
                  className="text-xs h-7 px-2"
                >
                  {hint.actionLabel}
                </Button>
              )}
              
              <div className="flex items-center space-x-1 ml-auto">
                <span className="text-xs opacity-60">💡 AI Tip</span>
                {hint.dismissible && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleDismiss}
                    className="h-6 w-6 p-0 opacity-60 hover:opacity-100"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Hook for managing AI hints
export function useAIHints() {
  const [hints, setHints] = React.useState<AIHint[]>([])
  const [dismissedHints, setDismissedHints] = React.useState<string[]>([])

  const addHint = React.useCallback((hint: AIHint) => {
    if (!dismissedHints.includes(hint.id)) {
      setHints(prev => [...prev.filter(h => h.id !== hint.id), hint])
    }
  }, [dismissedHints])

  const dismissHint = React.useCallback((hintId: string) => {
    setHints(prev => prev.filter(h => h.id !== hintId))
    setDismissedHints(prev => [...prev, hintId])
  }, [])

  const clearAllHints = React.useCallback(() => {
    setHints([])
  }, [])

  // Get current hint (show only one at a time in traditional mode)
  const currentHint = hints.length > 0 ? hints[0] : undefined

  return {
    currentHint,
    addHint,
    dismissHint,
    clearAllHints
  }
}

// Predefined hints for common scenarios
export const COMMON_AI_HINTS = {
  SIMILAR_DEAL: (dealName: string, similarity: number): AIHint => ({
    id: `similar-deal-${Date.now()}`,
    type: 'pattern',
    message: `💡 This deal pattern is ${Math.round(similarity)}% similar to ${dealName} from last quarter`,
    actionLabel: 'View',
    priority: 'medium',
    dismissible: true
  }),
  
  AUTOMATION_AVAILABLE: (taskCount: number): AIHint => ({
    id: `automation-${Date.now()}`,
    type: 'efficiency',
    message: `⚡ ${taskCount} routine tasks on this page can be automated`,
    actionLabel: 'Learn More',
    priority: 'low',
    dismissible: true
  }),

  TIME_SAVING_TIP: (action: string, timeSaved: string): AIHint => ({
    id: `tip-${Date.now()}`,
    type: 'tip',
    message: `💡 Tip: ${action} typically saves ${timeSaved} based on your usage patterns`,
    priority: 'low',
    dismissible: true
  })
}