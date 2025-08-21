/**
 * Refactored Due Diligence Module - Reference Implementation
 * Demonstrates the new standardized module pattern with DD-specific functionality
 */

'use client'

import React from 'react'
import { createModuleComponent } from '@/components/shared'
import { DueDiligenceTraditionalRefactored } from './DueDiligenceTraditionalRefactored'
import { DueDiligenceAssistedRefactored } from './DueDiligenceAssistedRefactored'
import { DueDiligenceAutonomousRefactored } from './DueDiligenceAutonomousRefactored'

// Create the standardized module component
const DueDiligenceModule = createModuleComponent<'due-diligence'>({
  Traditional: DueDiligenceTraditionalRefactored,
  Assisted: DueDiligenceAssistedRefactored,
  Autonomous: DueDiligenceAutonomousRefactored
})

// Main hybrid component with Due Diligence-specific configuration
export const HybridDueDiligenceRefactored: React.FC = () => {
  // Due Diligence-specific demo metrics
  const customMetrics = {
    // Core DD metrics
    totalProjects: 8,
    activeProjects: 5,
    completedProjects: 3,
    overdueProjects: 2,
    totalTasks: 124,
    completedTasks: 89,
    pendingTasks: 35,
    averageCompletion: 73,
    averageRiskScore: 2.3,
    
    // Document processing metrics  
    totalDocuments: 1847,
    documentsAnalyzed: 247,
    documentsReviewed: 156,
    pendingDocuments: 89,
    
    // Team and workflow metrics
    activeTeamMembers: 12,
    totalFindings: 67,
    criticalFindings: 8,
    resolvedFindings: 45,
    
    // Timeline metrics
    averageProjectDuration: 45, // days
    onTimeCompletionRate: 82,
    overdueTasks: 12,
    
    // Risk assessment metrics
    highRiskProjects: 2,
    mediumRiskProjects: 4,
    lowRiskProjects: 2,
    riskMitigationActions: 23,
    
    // AI-specific metrics (enhanced by useModuleAI)
    automatedTasks: 45,
    aiDocumentAnalysis: 89,
    predictiveRiskAlerts: 12,
    automatedReports: 34,
    
    // Quality metrics
    dataAccuracyScore: 94,
    processComplianceScore: 97,
    teamSatisfactionScore: 8.2,
    
    // Performance benchmarks
    industryBenchmarkComparison: 15, // % above industry average
    yearOverYearImprovement: 23,
    
    // Integration metrics
    dataSourcesIntegrated: 8,
    workflowAutomationLevel: 67,
    
    // Financial metrics
    costSavingsFromAI: 125000, // USD
    timeToCompletion: 32, // days (improved)
    budgetUtilization: 87
  }

  return (
    <DueDiligenceModule
      moduleId="due-diligence"
      title="Due Diligence Management Platform"
      subtitle="Comprehensive due diligence workflows with risk assessment, document management, and team collaboration • Choose your experience mode"
      customMetrics={customMetrics}
      generateAIRecommendations={true}
      showModeExplanation={true}
    />
  )
}

export default HybridDueDiligenceRefactored