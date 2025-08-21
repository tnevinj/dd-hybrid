/**
 * Refactored Deal Structuring Module - Complete Implementation
 * Uses existing deal-structuring AI extension already defined
 */

'use client'

import React from 'react'
import { createModuleComponent } from '@/components/shared'
import DealStructuringTraditional from './DealStructuringTraditional'
import DealStructuringAssisted from './DealStructuringAssisted'
import { DealStructuringAutonomous } from './DealStructuringAutonomous'

// Create wrapper components for standardized interface
const DealStructuringTraditionalRefactored: React.FC<{ onSwitchMode: (mode: any) => void }> = ({ onSwitchMode }) => (
  <DealStructuringTraditional onSwitchMode={onSwitchMode} />
)

const DealStructuringAssistedRefactored: React.FC<{ aiState: any; metrics: any; actionHandlers: any; onSwitchMode: (mode: any) => void }> = ({ aiState, metrics, actionHandlers, onSwitchMode }) => (
  <DealStructuringAssisted aiState={aiState} aiMetrics={metrics} actionHandlers={actionHandlers} onSwitchMode={onSwitchMode} />
)

const DealStructuringAutonomousRefactored: React.FC<{ onSwitchMode: (mode: any) => void }> = ({ onSwitchMode }) => (
  <DealStructuringAutonomous onSwitchMode={onSwitchMode} />
)

// Create the standardized module component
const DealStructuringModule = createModuleComponent<'deal-structuring'>({
  Traditional: DealStructuringTraditionalRefactored,
  Assisted: DealStructuringAssistedRefactored,
  Autonomous: DealStructuringAutonomousRefactored
})

// Main hybrid component with Deal Structuring-specific configuration
export const HybridDealStructuringRefactored: React.FC = () => {
  const customMetrics = {
    activeDeals: 15,
    structuresAnalyzed: 89,
    optimizationSuggestions: 34,
    taxEfficiency: 92,
    structuringTime: 4.2,
    complianceScore: 97,
    riskMitigation: 88,
    financialModeling: 91
  }

  return (
    <DealStructuringModule
      moduleId="deal-structuring"
      title="Deal Structuring Platform"
      subtitle="Advanced deal structuring and optimization • Choose your experience mode"
      customMetrics={customMetrics}
      generateAIRecommendations={true}
      showModeExplanation={true}
    />
  )
}

export default HybridDealStructuringRefactored