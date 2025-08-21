/**
 * Refactored Investment Committee Module - Complete Implementation
 * Demonstrates the new standardized module pattern with Investment Committee-specific functionality
 */

'use client'

import React from 'react'
import { createModuleComponent } from '@/components/shared'
import { InvestmentCommitteeTraditionalRefactored } from './InvestmentCommitteeTraditionalRefactored'
import { InvestmentCommitteeAssistedRefactored } from './InvestmentCommitteeAssistedRefactored'
import { InvestmentCommitteeAutonomousRefactored } from './InvestmentCommitteeAutonomousRefactored'

// Create the standardized module component
const InvestmentCommitteeModule = createModuleComponent<'investment-committee'>({
  Traditional: InvestmentCommitteeTraditionalRefactored,
  Assisted: InvestmentCommitteeAssistedRefactored,
  Autonomous: InvestmentCommitteeAutonomousRefactored
})

// Main hybrid component with Investment Committee-specific configuration
export const HybridInvestmentCommitteeRefactored: React.FC = () => {
  // Investment Committee-specific demo metrics
  const customMetrics = {
    // Committee composition and activity
    totalMembers: 7,
    activeMembers: 6,
    meetingsThisQuarter: 12,
    proposalsReviewed: 34,
    decisionsThisMonth: 8,
    averageAttendance: 94,
    
    // Decision metrics
    approvedInvestments: 18,
    rejectedProposals: 8,
    deferredDecisions: 4,
    conditionalApprovals: 4,
    averageDecisionTime: 14, // days
    consensusRate: 89,
    
    // Investment pipeline
    pipelineProposals: 23,
    dueProposals: 6,
    scheduledPresentations: 4,
    followUpRequired: 7,
    materialsPending: 3,
    
    // Financial metrics
    totalCommittedCapital: 450000000, // $450M
    averageInvestmentSize: 25000000, // $25M
    largestApproval: 75000000, // $75M
    deploymentRate: 67, // %
    portfolioCompanies: 42,
    
    // Process efficiency
    materialPreparedness: 91,
    meetingEfficiency: 87,
    processCompliance: 96,
    documentationScore: 94,
    timeToDecision: 11.5, // days
    
    // Risk management
    riskAssessmentScore: 88,
    dueProcessCompliance: 97,
    conflictOfInterest: 2,
    riskMitigationActions: 15,
    complianceIssues: 1,
    
    // Member engagement
    memberSatisfaction: 92,
    preparationTime: 4.2, // hours per meeting
    discussionQuality: 89,
    expertiseUtilization: 85,
    
    // AI-enhanced metrics
    aiRecommendationAccuracy: 87,
    automatedScreening: 78,
    insightGeneration: 24,
    predictiveAccuracy: 83,
    timeReductionAI: 28,
    
    // Performance tracking
    successfulInvestments: 31,
    portfolioGrowth: 18.4, // %
    exitSuccessRate: 76,
    benchmarkOutperformance: 12,
    
    // Operational metrics
    meetingDuration: 2.8, // hours
    actionItemCompletion: 91,
    followUpRate: 89,
    reportingAccuracy: 96,
    stakeholderSatisfaction: 88,
    
    // Quality assurance
    processAuditScore: 93,
    governanceCompliance: 98,
    bestPracticeAdherence: 87,
    continuousImprovement: 19 // initiatives
  }

  return (
    <InvestmentCommitteeModule
      moduleId="investment-committee"
      title="Investment Committee Platform"
      subtitle="Comprehensive committee management with decision tracking and governance • Choose your experience mode"
      customMetrics={customMetrics}
      generateAIRecommendations={true}
      showModeExplanation={true}
    />
  )
}

export default HybridInvestmentCommitteeRefactored