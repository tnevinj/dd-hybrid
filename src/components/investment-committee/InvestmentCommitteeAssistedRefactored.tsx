/**
 * Refactored Investment Committee Assisted Component
 * Uses new standardized AssistedModeProps interface with AI recommendations
 */

'use client'

import React from 'react'
import { InvestmentCommitteeAssisted } from './InvestmentCommitteeAssisted'
import type { AssistedModeProps } from '@/types/shared'

/**
 * Wrapper component providing AI-enhanced committee functionality
 */
export function InvestmentCommitteeAssistedRefactored({ 
  aiState,
  metrics,
  actionHandlers,
  onSwitchMode 
}: AssistedModeProps) {
  return (
    <InvestmentCommitteeAssisted 
      aiState={aiState}
      aiMetrics={metrics}
      actionHandlers={actionHandlers}
      onSwitchMode={onSwitchMode}
    />
  )
}

export default InvestmentCommitteeAssistedRefactored