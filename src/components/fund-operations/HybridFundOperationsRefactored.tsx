/**
 * Refactored Fund Operations Module - Complete Implementation
 * Demonstrates the new standardized module pattern with Fund Operations-specific functionality
 */

'use client'

import React from 'react'
import { createModuleComponent } from '@/components/shared'
import { FundOperationsTraditionalRefactored } from './FundOperationsTraditionalRefactored'
import { FundOperationsAssistedRefactored } from './FundOperationsAssistedRefactored'
import { FundOperationsAutonomousRefactored } from './FundOperationsAutonomousRefactored'

// Create the standardized module component
const FundOperationsModule = createModuleComponent<'fund-operations'>({
  Traditional: FundOperationsTraditionalRefactored,
  Assisted: FundOperationsAssistedRefactored,
  Autonomous: FundOperationsAutonomousRefactored
})

// Main hybrid component with Fund Operations-specific configuration
export const HybridFundOperationsRefactored: React.FC = () => {
  // Fund Operations-specific demo metrics
  const customMetrics = {
    // Core fund operations metrics
    totalFunds: 12,
    activeFunds: 10,
    totalAUM: 2400000000, // $2.4B
    averageFundSize: 200000000, // $200M
    navCalculationsToday: 8,
    distributionsProcessed: 45,
    capitalCallsIssued: 3,
    complianceReports: 24,
    
    // NAV calculation metrics
    navAccuracy: 99.7,
    navCalculationTime: 2.3, // hours
    manualAdjustments: 5,
    navVariance: 0.02, // 2% variance tolerance
    
    // Distribution metrics
    distributionAmount: 45000000, // $45M
    distributionInvestors: 234,
    distributionProcessingTime: 1.5, // days
    distributionAccuracy: 99.9,
    
    // Capital calls metrics
    capitalCallAmount: 85000000, // $85M
    capitalCallInvestors: 156,
    capitalCallResponseRate: 98.5,
    averageResponseTime: 3.2, // days
    
    // Compliance and reporting
    complianceScore: 94,
    auditReadiness: 89,
    regulatoryReports: 18,
    outstandingIssues: 2,
    complianceDeadlines: 6,
    
    // Operational efficiency
    automationLevel: 67,
    processingTime: 2.1, // hours per operation
    errorRate: 0.3, // 0.3%
    manualInterventions: 12,
    
    // Financial performance
    managementFees: 18000000, // $18M
    performanceFees: 22000000, // $22M
    expenseRatio: 1.75,
    operationalCosts: 3200000, // $3.2M
    
    // Investor relations
    investorReports: 48,
    investorInquiries: 23,
    averageResponseTime: 4.5, // hours
    investorSatisfaction: 92,
    
    // Fund lifecycle metrics
    fundraisingFunds: 2,
    fundsInInvestment: 6,
    fundsInHarvesting: 4,
    fundraisingProgress: 67, // %
    
    // Risk management
    riskScore: 15, // out of 100 (lower is better)
    valuationRisk: 8,
    concentrationRisk: 12,
    liquidityRisk: 6,
    
    // Technology and systems
    systemUptime: 99.8,
    dataQuality: 96,
    integrationHealth: 94,
    backupSuccessRate: 100,
    
    // Team productivity
    operationsTeamSize: 12,
    averageExperience: 7.5, // years
    trainingHoursPerMonth: 16,
    productivityScore: 88,
    
    // AI-enhanced metrics (enhanced by useModuleAI)
    aiAutomationLevel: 78,
    aiAccuracy: 94,
    timeReductionAI: 35, // % reduction
    errorReductionAI: 67, // % reduction
    
    // Benchmarking
    industryBenchmark: 85,
    performanceVsIndustry: 12, // % above
    bestInClassMetrics: 6,
    
    // Quality assurance
    qualityScore: 91,
    doubleCheckRate: 15, // % requiring double-check
    clientAuditResults: 97,
    internalAuditScore: 93
  }

  return (
    <FundOperationsModule
      moduleId="fund-operations"
      title="Fund Operations Platform"
      subtitle="Comprehensive fund management with NAV calculations, distributions, and compliance • Choose your experience mode"
      customMetrics={customMetrics}
      generateAIRecommendations={true}
      showModeExplanation={true}
    />
  )
}

export default HybridFundOperationsRefactored