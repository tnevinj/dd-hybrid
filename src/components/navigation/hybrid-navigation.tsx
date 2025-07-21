'use client'

import * as React from 'react'
import { useNavigationStore } from '@/stores/navigation-store'
import { TraditionalSidebar } from './traditional-sidebar'
import { AIPanel } from './ai-panel'
import { AIInsightsBanner } from './ai-insights-banner'

interface HybridNavigationProps {
  children: React.ReactNode
  className?: string
}

export function HybridNavigation({ children, className }: HybridNavigationProps) {
  const { currentMode, isAIPanelOpen } = useNavigationStore()

  return (
    <div className={`flex h-screen bg-background ${className}`}>
      {/* Traditional Navigation - Always Present */}
      <TraditionalSidebar 
        enhanced={currentMode.mode === 'assisted' || currentMode.mode === 'autonomous'}
      />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* AI Insights Banner - Conditional */}
        {currentMode.mode !== 'traditional' && (
          <AIInsightsBanner />
        )}
        
        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
      
      {/* AI Panel - Conditional */}
      {isAIPanelOpen && currentMode.mode !== 'traditional' && (
        <AIPanel />
      )}
    </div>
  )
}