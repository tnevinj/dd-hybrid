/**
 * Refactored Due Diligence Autonomous Component
 * Uses new standardized AutonomousModeProps interface while maintaining existing autonomous architecture
 */

'use client'

import React from 'react'
import { DueDiligenceAutonomous } from './DueDiligenceAutonomous'
import type { AutonomousModeProps } from '@/types/shared'

/**
 * Wrapper for the existing autonomous component to conform to new interface
 * The existing autonomous implementation is complex and working well,
 * so we wrap it rather than fully rewrite for this migration
 */
export function DueDiligenceAutonomousRefactored({ 
  onSwitchMode 
}: AutonomousModeProps) {
  return <DueDiligenceAutonomous onSwitchMode={onSwitchMode} />
}

export default DueDiligenceAutonomousRefactored