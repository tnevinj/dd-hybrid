/**
 * Refactored Investment Committee Traditional Component
 * Uses new standardized TraditionalModeProps interface
 */

'use client'

import React from 'react'
import { InvestmentCommitteeTraditional } from './InvestmentCommitteeTraditional'
import type { TraditionalModeProps } from '@/types/shared'

/**
 * Wrapper component that conforms to new standardized interface
 */
export function InvestmentCommitteeTraditionalRefactored({ 
  onSwitchMode 
}: TraditionalModeProps) {
  return <InvestmentCommitteeTraditional onSwitchMode={onSwitchMode} />
}

export default InvestmentCommitteeTraditionalRefactored