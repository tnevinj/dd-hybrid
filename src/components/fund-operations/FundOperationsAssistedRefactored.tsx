/**
 * Refactored Fund Operations Assisted Component
 * Uses new standardized AssistedModeProps interface with AI recommendations
 */

'use client'

import React from 'react'
import { FundOperationsAssisted } from './FundOperationsAssisted'
import type { AssistedModeProps } from '@/types/shared'

// Enhanced mock data with AI recommendations
const mockAssistedData = {
  totalFunds: 12,
  totalAUM: 2400000000,
  navCalculationsToday: 8,
  distributionsProcessed: 45,
  capitalCallsIssued: 3,
  complianceReports: 24,
  aiRecommendations: [
    {
      id: 'fo-001',
      type: 'optimization',
      priority: 'high' as const,
      title: 'Optimize NAV Calculation Process',
      description: 'AI suggests automating monthly NAV calculations for Growth Fund III to reduce processing time by 65%',
      confidence: 0.92,
      operationType: 'nav' as const,
      calculationType: 'automatic' as const,
      navAccuracy: 99.8,
      processingTime: 0.8
    },
    {
      id: 'fo-002', 
      type: 'automation',
      priority: 'medium' as const,
      title: 'Automate Distribution Notices',
      description: 'Set up automated investor notifications for upcoming distributions in Real Estate Fund II',
      confidence: 0.87,
      operationType: 'distributions' as const,
      distributionAmount: 15000000,
      complianceStatus: 'compliant' as const
    },
    {
      id: 'fo-003',
      type: 'compliance', 
      priority: 'critical' as const,
      title: 'Regulatory Filing Alert',
      description: 'Form PF filing due in 7 days for Infrastructure Fund I - AI can pre-populate 89% of required fields',
      confidence: 0.95,
      operationType: 'compliance' as const,
      auditReadiness: 94,
      regulatoryRisk: 'low' as const
    }
  ]
}

const mockAssistedMetrics = {
  navAccuracy: 99.7,
  processingTime: 1.8, // Improved with AI
  complianceScore: 96, // Higher with AI monitoring
  automationLevel: 78, // Increased automation
  distributionEfficiency: 92, // AI-optimized
  reportingScore: 94, // Enhanced with AI insights
  aiConfidence: 91,
  timeReduction: 35,
  errorReduction: 67,
  complianceImprovement: 23
}

/**
 * Wrapper component providing AI-enhanced fund operations data
 */
export function FundOperationsAssistedRefactored({ 
  aiState,
  metrics,
  actionHandlers,
  onSwitchMode 
}: AssistedModeProps) {
  return (
    <FundOperationsAssisted 
      fundOperationsData={mockAssistedData}
      metrics={mockAssistedMetrics}
      aiState={aiState}
      aiMetrics={metrics}
      actionHandlers={actionHandlers}
      onSwitchMode={onSwitchMode}
    />
  )
}

export default FundOperationsAssistedRefactored