/**
 * Refactored Deal Screening Module - Reference Implementation
 * Demonstrates the new standardized module pattern with Deal Screening-specific functionality
 */

'use client'

import React from 'react'
import { createModuleComponent } from '@/components/shared'
import { DealScreeningTraditionalRefactored } from './DealScreeningTraditionalRefactored'
import { DealScreeningAssistedRefactored } from './DealScreeningAssistedRefactored'
import { DealScreeningAutonomousRefactored } from './DealScreeningAutonomousRefactored'

// Create the standardized module component
const DealScreeningModule = createModuleComponent<'deal-screening'>({
  Traditional: DealScreeningTraditionalRefactored,
  Assisted: DealScreeningAssistedRefactored,
  Autonomous: DealScreeningAutonomousRefactored
})

// Main hybrid component with Deal Screening-specific configuration
export const HybridDealScreeningRefactored: React.FC = () => {
  // Deal Screening-specific demo metrics
  const customMetrics = {
    // Core deal screening metrics
    totalOpportunities: 32,
    activeScreenings: 18,
    completedScreenings: 14,
    overdueScreenings: 3,
    averageScreeningTime: '12 days',
    conversionRate: '42%',
    
    // Opportunity breakdown
    fundOpportunities: 12,
    directOpportunities: 8,
    coInvestmentOpportunities: 7,
    gpLedOpportunities: 5,
    
    // Sector analysis
    technologyDeals: 9,
    healthcareDeals: 6,
    infrastructureDeals: 5,
    energyDeals: 4,
    finServicesDeals: 8,
    
    // Geographic distribution
    northAmericaDeals: 14,
    europeDeals: 10,
    asiaDeals: 6,
    otherRegions: 2,
    
    // Financial metrics
    totalDealValue: 1240000000, // $1.24B
    averageDealSize: 38750000,  // $38.75M
    medianDealSize: 28000000,   // $28M
    largestDeal: 67000000,      // $67M
    
    // Performance metrics
    averageExpectedIRR: 18.7,
    averageExpectedMultiple: 2.4,
    highPerformingDeals: 7, // >20% IRR
    
    // Risk assessment
    lowRiskDeals: 12,
    mediumRiskDeals: 15,
    highRiskDeals: 5,
    averageRiskScore: 2.1,
    
    // Screening process metrics
    criteriaSetCount: 8,
    averageCriteriaScore: 76,
    passingThreshold: 70,
    dealsAboveThreshold: 19,
    
    // AI-enhanced metrics (enhanced by useModuleAI)
    aiAnalyzedDeals: 28,
    valuationOutliers: 5,
    highProbabilityDeals: 7,
    avgAIConfidence: 84,
    valuationAccuracy: 91,
    timeReduction: 35,
    
    // Team and workflow metrics
    activeScreeningTeams: 4,
    averageTeamSize: 3,
    totalScreeningHours: 892,
    efficiencyImprovement: 23,
    
    // Comparative analysis
    industryBenchmarkComparison: 12, // % above benchmark
    competitiveDeals: 6,
    exclusiveOpportunities: 4,
    
    // Success tracking
    successfulScreenings: 14,
    dealsClosed: 6,
    dealsInDueDiligence: 8,
    dealsDeclined: 8,
    
    // Quality metrics
    screeningAccuracy: 89,
    falsePositiveRate: 8,
    falseNegativeRate: 12,
    
    // Market intelligence
    marketTrendAlerts: 15,
    sectorOutlookUpdates: 8,
    pricingBenchmarks: 24,
    
    // Automation metrics
    automatedInitialScreenings: 16,
    manualReviewRequired: 12,
    straightThroughProcessing: 4,
    
    // Resource utilization
    screeningCapacityUtilization: 78,
    averageTimeToDecision: 8.5, // days
    resourceEfficiency: 82
  }

  return (
    <DealScreeningModule
      moduleId="deal-screening"
      title="Deal Screening Platform"
      subtitle="AI-powered opportunity screening with comparative analysis and automated workflows • Choose your experience mode"
      customMetrics={customMetrics}
      generateAIRecommendations={true}
      showModeExplanation={true}
    />
  )
}

export default HybridDealScreeningRefactored