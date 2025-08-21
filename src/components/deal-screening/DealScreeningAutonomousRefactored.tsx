/**
 * Refactored Deal Screening Autonomous Component
 * Uses new standardized AutonomousModeProps interface while maintaining existing autonomous architecture
 */

'use client'

import React from 'react'
import { DealScreeningAutonomous } from './DealScreeningAutonomous'
import type { AutonomousModeProps } from '@/types/shared'

/**
 * Wrapper for the existing autonomous component to conform to new interface
 * The existing autonomous implementation is complex and working well,
 * so we wrap it rather than fully rewrite for this migration
 */
export function DealScreeningAutonomousRefactored({ 
  onSwitchMode 
}: AutonomousModeProps) {
  return <DealScreeningAutonomous onSwitchMode={onSwitchMode} />
}

export default DealScreeningAutonomousRefactored