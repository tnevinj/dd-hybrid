/**
 * Refactored Legal Management Module - Complete Implementation
 * Demonstrates the new standardized module pattern with Legal Management-specific functionality
 */

'use client'

import React from 'react'
import { createModuleComponent } from '@/components/shared'
import { LegalManagementTraditional } from './LegalManagementTraditional'
import { LegalManagementAssisted } from './LegalManagementAssisted'
import { LegalManagementAutonomous } from './LegalManagementAutonomous'

// Create wrapper components for standardized interface
const LegalManagementTraditionalRefactored: React.FC<{ onSwitchMode: (mode: any) => void }> = ({ onSwitchMode }) => (
  <LegalManagementTraditional onSwitchMode={onSwitchMode} />
)

const LegalManagementAssistedRefactored: React.FC<{ aiState: any; metrics: any; actionHandlers: any; onSwitchMode: (mode: any) => void }> = ({ aiState, metrics, actionHandlers, onSwitchMode }) => (
  <LegalManagementAssisted aiState={aiState} aiMetrics={metrics} actionHandlers={actionHandlers} onSwitchMode={onSwitchMode} />
)

const LegalManagementAutonomousRefactored: React.FC<{ onSwitchMode: (mode: any) => void }> = ({ onSwitchMode }) => (
  <LegalManagementAutonomous onSwitchMode={onSwitchMode} />
)

// Create the standardized module component
const LegalManagementModule = createModuleComponent<'legal-management'>({
  Traditional: LegalManagementTraditionalRefactored,
  Assisted: LegalManagementAssistedRefactored,
  Autonomous: LegalManagementAutonomousRefactored
})

// Main hybrid component with Legal Management-specific configuration
export const HybridLegalManagementRefactored: React.FC = () => {
  const customMetrics = {
    totalDocuments: 847,
    activeContracts: 234,
    complianceScore: 96,
    reviewsPending: 23,
    automationLevel: 72,
    legalRiskScore: 8,
    contractExpirations: 12,
    complianceDeadlines: 6
  }

  return (
    <LegalManagementModule
      moduleId="legal-management"
      title="Legal Management Platform"
      subtitle="Comprehensive legal document and compliance management • Choose your experience mode"
      customMetrics={customMetrics}
      generateAIRecommendations={true}
      showModeExplanation={true}
    />
  )
}

export default HybridLegalManagementRefactored