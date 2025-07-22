'use client'

import * as React from 'react'
import { useNavigationStore } from '@/stores/navigation-store'
import { TraditionalSidebar } from './traditional-sidebar'
import { AIPanel } from './ai-panel'
import { AIInsightsBanner } from './ai-insights-banner'
import { AIHintToast, useAIHints } from './ai-hint-toast'
import { AIConversationPanel } from './ai-conversation-panel'
import { aiTrackingService } from '@/services/ai-tracking-service'

interface HybridNavigationProps {
  children: React.ReactNode
  className?: string
}

export function HybridNavigation({ children, className }: HybridNavigationProps) {
  const { currentMode, isAIPanelOpen, trackInteraction } = useNavigationStore()
  const { currentHint, addHint, dismissHint } = useAIHints()

  // Generate contextual hints for Traditional mode
  React.useEffect(() => {
    if (currentMode.mode === 'traditional') {
      const generateTraditionalHints = async () => {
        // Example: After user spends time on a page, suggest AI assistance
        const timeThreshold = 30000 // 30 seconds
        
        const timer = setTimeout(() => {
          // Get AI adoption metrics
          aiTrackingService.getAdoptionMetrics('current-user').then(metrics => {
            if (metrics && metrics.aiAdoptionLevel < 20) {
              addHint({
                id: 'try-assisted-mode',
                type: 'efficiency',
                message: '💡 Tip: AI assistance can automate 3 routine tasks on this page',
                actionLabel: 'Learn More',
                onAction: () => {
                  trackInteraction({
                    interactionType: 'hint_accepted',
                    userAction: 'accepted',
                    module: 'navigation',
                    context: { hintType: 'mode_upgrade', currentMode: 'traditional' }
                  })
                },
                priority: 'low',
                dismissible: true
              })
            }
          })
        }, timeThreshold)

        return () => clearTimeout(timer)
      }

      generateTraditionalHints()
    }
  }, [currentMode.mode, addHint, trackInteraction])

  const renderModeSpecificUI = () => {
    switch (currentMode.mode) {
      case 'traditional':
        return (
          <>
            {/* Traditional Navigation - Full Featured */}
            <TraditionalSidebar enhanced={false} />
            
            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
              <main className="flex-1 overflow-auto">
                {children}
              </main>
            </div>
            
            {/* Subtle AI Hints - Dismissible */}
            <AIHintToast 
              hint={currentHint} 
              onDismiss={dismissHint}
            />
          </>
        )

      case 'assisted':
        return (
          <>
            {/* Enhanced Navigation */}
            <TraditionalSidebar enhanced={true} />
            
            {/* Main Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* AI Insights Banner - Prominent */}
              <AIInsightsBanner />
              
              {/* Main Content */}
              <main className="flex-1 overflow-auto">
                {children}
              </main>
            </div>
            
            {/* AI Panel - Available but not intrusive */}
            {isAIPanelOpen && (
              <AIPanel />
            )}
          </>
        )

      case 'autonomous':
        return (
          <>
            {/* Minimal Navigation - Hidden by default */}
            <div className="hidden lg:block">
              <TraditionalSidebar enhanced={true} collapsed={true} />
            </div>
            
            {/* AI-First Interface */}
            <div className="flex-1 flex">
              {/* Conversational AI Panel - Primary Interface */}
              <div className="w-1/3 border-r">
                <AIConversationPanel />
              </div>
              
              {/* Content Area - Secondary */}
              <div className="flex-1 flex flex-col overflow-hidden">
                <main className="flex-1 overflow-auto bg-gray-50">
                  {children}
                </main>
              </div>
            </div>
          </>
        )

      default:
        return null
    }
  }

  return (
    <div className={`flex h-screen bg-background ${className}`}>
      {renderModeSpecificUI()}
    </div>
  )
}