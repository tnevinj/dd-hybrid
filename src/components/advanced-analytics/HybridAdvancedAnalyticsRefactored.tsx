/**
 * Refactored Advanced Analytics Module - Reference Implementation
 * Demonstrates the new standardized module pattern with shared components and hooks
 */

'use client'

import React from 'react'
import { createModuleComponent } from '@/components/shared'
import { AdvancedAnalyticsTraditionalRefactored } from './AdvancedAnalyticsTraditionalRefactored'
import { AdvancedAnalyticsAssistedRefactored } from './AdvancedAnalyticsAssistedRefactored'
import { AdvancedAnalyticsAutonomousRefactored } from './AdvancedAnalyticsAutonomousRefactored'

// Create the standardized module component
const AdvancedAnalyticsModule = createModuleComponent<'advanced-analytics'>({
  Traditional: AdvancedAnalyticsTraditionalRefactored,
  Assisted: AdvancedAnalyticsAssistedRefactored,
  Autonomous: AdvancedAnalyticsAutonomousRefactored
})

// Main hybrid component with module-specific configuration
export const HybridAdvancedAnalyticsRefactored: React.FC = () => {
  // Demo metrics specific to Advanced Analytics
  const customMetrics = {
    totalAnalyses: 1247,
    activeModels: 23,
    predictiveInsights: 156,
    dataPoints: 2.4e6,
    runningSimulations: 8,
    completedModels: 89,
    correlationAnalyses: 342,
    scenarioPlans: 67
  }

  return (
    <AdvancedAnalyticsModule
      moduleId="advanced-analytics"
      title="Advanced Analytics Platform"
      subtitle="Predictive modeling, data analysis, and AI-powered insights • Choose your experience mode"
      customMetrics={customMetrics}
      generateAIRecommendations={true}
      showModeExplanation={true}
    />
  )
}

export default HybridAdvancedAnalyticsRefactored