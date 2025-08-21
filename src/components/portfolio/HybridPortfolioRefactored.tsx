/**
 * Refactored Portfolio Module - Reference Implementation
 * Demonstrates the new standardized module pattern with Portfolio-specific functionality
 */

'use client'

import React from 'react'
import { createModuleComponent } from '@/components/shared'
import { PortfolioTraditionalRefactored } from './PortfolioTraditionalRefactored'
import { PortfolioAssistedRefactored } from './PortfolioAssistedRefactored'
import { PortfolioAutonomousRefactored } from './PortfolioAutonomousRefactored'

// Create the standardized module component
const PortfolioModule = createModuleComponent<'portfolio'>({
  Traditional: PortfolioTraditionalRefactored,
  Assisted: PortfolioAssistedRefactored,
  Autonomous: PortfolioAutonomousRefactored
})

// Main hybrid component with Portfolio-specific configuration
export const HybridPortfolioRefactored: React.FC = () => {
  // Portfolio-specific demo metrics (matching original data structure)
  const portfolioData = {
    totalValue: 3880000000, // $3.88B to match detailed analytics
    totalAssets: 47,
    performanceYTD: 12.5,
    topPerformer: 'TechCorp Growth Fund',
    riskScore: 2.1,
    aiOptimizationScore: 8.7,
    predictedGrowth: 15.2
  }

  const mockAssets = [
    {
      id: '1',
      name: 'TechCorp Growth Fund',
      type: 'Private Equity',
      sector: 'Technology',
      currentValue: 180000000,
      performance: 28.5,
      riskLevel: 'medium'
    },
    {
      id: '2', 
      name: 'Healthcare REIT Portfolio',
      type: 'Real Estate',
      sector: 'Healthcare',
      currentValue: 150000000,
      performance: 19.2,
      riskLevel: 'low'
    },
    {
      id: '3',
      name: 'Infrastructure Debt Fund',
      type: 'Debt',
      sector: 'Infrastructure', 
      currentValue: 220000000,
      performance: 8.7,
      riskLevel: 'low'
    }
  ]

  const customMetrics = {
    // Core portfolio metrics
    totalValue: portfolioData.totalValue,
    totalAssets: portfolioData.totalAssets,
    performanceYTD: portfolioData.performanceYTD,
    topPerformer: portfolioData.topPerformer,
    riskScore: portfolioData.riskScore,
    aiOptimizationScore: portfolioData.aiOptimizationScore,
    predictedGrowth: portfolioData.predictedGrowth,
    
    // Asset breakdown
    totalPEAssets: mockAssets.filter(a => a.type === 'Private Equity').length,
    totalREAssets: mockAssets.filter(a => a.type === 'Real Estate').length,
    totalDebtAssets: mockAssets.filter(a => a.type === 'Debt').length,
    
    // Performance metrics
    avgPerformance: mockAssets.reduce((sum, a) => sum + a.performance, 0) / mockAssets.length,
    highPerformingAssets: mockAssets.filter(a => a.performance > 15).length,
    lowRiskAssets: mockAssets.filter(a => a.riskLevel === 'low').length,
    
    // AI-specific metrics (will be enhanced by useModuleAI hook)
    automatedRebalancing: 12,
    aiInsightsGenerated: 34,
    optimizationOpportunities: 8
  }

  return (
    <PortfolioModule
      moduleId="portfolio"
      title="Portfolio Management Hub"
      subtitle="Comprehensive asset management with analytics, optimization, and risk management • Choose your experience mode"
      customMetrics={customMetrics}
      generateAIRecommendations={true}
      showModeExplanation={true}
    />
  )
}

export default HybridPortfolioRefactored