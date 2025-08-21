/**
 * Refactored Market Intelligence Module - Complete Implementation
 * Demonstrates the new standardized module pattern with Market Intelligence-specific functionality
 */

'use client'

import React from 'react'
import { createModuleComponent } from '@/components/shared'
import { MarketIntelligenceTraditional } from './MarketIntelligenceTraditional'
import { MarketIntelligenceAssisted } from './MarketIntelligenceAssisted'
import { MarketIntelligenceAutonomous } from './MarketIntelligenceAutonomous'

// Create wrapper components for standardized interface
const MarketIntelligenceTraditionalRefactored: React.FC<{ onSwitchMode: (mode: any) => void }> = ({ onSwitchMode }) => (
  <MarketIntelligenceTraditional onSwitchMode={onSwitchMode} />
)

const MarketIntelligenceAssistedRefactored: React.FC<{ aiState: any; metrics: any; actionHandlers: any; onSwitchMode: (mode: any) => void }> = ({ aiState, metrics, actionHandlers, onSwitchMode }) => (
  <MarketIntelligenceAssisted aiState={aiState} aiMetrics={metrics} actionHandlers={actionHandlers} onSwitchMode={onSwitchMode} />
)

const MarketIntelligenceAutonomousRefactored: React.FC<{ onSwitchMode: (mode: any) => void }> = ({ onSwitchMode }) => (
  <MarketIntelligenceAutonomous onSwitchMode={onSwitchMode} />
)

// Create the standardized module component
const MarketIntelligenceModule = createModuleComponent<'market-intelligence'>({
  Traditional: MarketIntelligenceTraditionalRefactored,
  Assisted: MarketIntelligenceAssistedRefactored,
  Autonomous: MarketIntelligenceAutonomousRefactored
})

// Main hybrid component with Market Intelligence-specific configuration
export const HybridMarketIntelligenceRefactored: React.FC = () => {
  const customMetrics = {
    dataSources: 127,
    marketReports: 45,
    trendAnalyses: 34,
    dataQuality: 94,
    insightGeneration: 78,
    predictiveAccuracy: 87,
    marketCoverage: 89,
    updateFrequency: 97
  }

  return (
    <MarketIntelligenceModule
      moduleId="market-intelligence"
      title="Market Intelligence Platform"
      subtitle="Advanced market analysis and competitive intelligence • Choose your experience mode"
      customMetrics={customMetrics}
      generateAIRecommendations={true}
      showModeExplanation={true}
    />
  )
}

export default HybridMarketIntelligenceRefactored