/**
 * Refactored Investment Committee Autonomous Component
 * Uses new standardized AutonomousModeProps interface
 */

'use client'

import React from 'react'
import { InvestmentCommitteeAutonomous } from './InvestmentCommitteeAutonomous'
import type { AutonomousModeProps } from '@/types/shared'

/**
 * Wrapper for existing autonomous component
 */
export function InvestmentCommitteeAutonomousRefactored({ 
  onSwitchMode 
}: AutonomousModeProps) {
  return <InvestmentCommitteeAutonomous onSwitchMode={onSwitchMode} />
}

export default InvestmentCommitteeAutonomousRefactored