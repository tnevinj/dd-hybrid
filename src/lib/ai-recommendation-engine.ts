/**
 * Centralized AI Recommendation Engine
 * Provides consistent, high-quality AI recommendations across all modules
 */

import { AIRecommendation } from '@/types/navigation'

export interface ModuleContext {
  moduleId: string
  currentData?: any
  historicalData?: any
  userBehavior?: {
    frequency: number
    successRate: number
    preferredActions: string[]
  }
}

export interface RecommendationTemplate {
  id: string
  type: 'suggestion' | 'automation' | 'warning' | 'insight'
  title: string
  descriptionTemplate: string
  conditions: Array<{
    field: string
    operator: 'gt' | 'lt' | 'eq' | 'contains' | 'exists'
    value: any
    weight: number
  }>
  actions: Array<{
    id: string
    label: string
    action: string
    primary?: boolean
    estimatedTimeSaving?: number
    riskLevel: 'low' | 'medium' | 'high'
    requiresApproval?: boolean
  }>
  confidenceCalculation: {
    baseConfidence: number
    dataQualityFactor: number
    historicalAccuracyFactor: number
  }
  priority: 'low' | 'medium' | 'high' | 'critical'
  moduleSpecific: boolean
}

/**
 * Module-specific recommendation templates
 */
const RECOMMENDATION_TEMPLATES: Record<string, RecommendationTemplate[]> = {
  'advanced-analytics': [
    {
      id: 'aa-portfolio-correlation',
      type: 'warning',
      title: 'Portfolio Correlation Risk Detected',
      descriptionTemplate: 'Advanced correlation analysis shows {correlationPercentage}% correlation between {assetClass} holdings during market stress. Monte Carlo simulation suggests {rebalancePercentage}% portfolio rebalancing.',
      conditions: [
        { field: 'correlationLevel', operator: 'gt', value: 0.75, weight: 0.8 },
        { field: 'assetConcentration', operator: 'gt', value: 0.15, weight: 0.6 }
      ],
      actions: [
        {
          id: 'run-portfolio-optimization',
          label: 'Run Portfolio Optimization',
          action: 'RUN_PORTFOLIO_OPTIMIZATION',
          primary: true,
          estimatedTimeSaving: 120,
          riskLevel: 'medium',
          requiresApproval: true
        },
        {
          id: 'generate-stress-test',
          label: 'Generate Stress Test Report',
          action: 'GENERATE_STRESS_TEST_REPORT',
          estimatedTimeSaving: 45,
          riskLevel: 'low'
        }
      ],
      confidenceCalculation: {
        baseConfidence: 0.85,
        dataQualityFactor: 0.1,
        historicalAccuracyFactor: 0.05
      },
      priority: 'high',
      moduleSpecific: true
    },
    {
      id: 'aa-model-deployment',
      type: 'automation',
      title: 'Predictive Model Ready for Deployment',
      descriptionTemplate: '{sectorName} prediction model achieved {accuracyPercentage}% accuracy on validation set. Ready for automated deal scoring and market timing predictions.',
      conditions: [
        { field: 'modelAccuracy', operator: 'gt', value: 0.92, weight: 0.9 },
        { field: 'validationPeriods', operator: 'gt', value: 3, weight: 0.5 }
      ],
      actions: [
        {
          id: 'deploy-model',
          label: 'Deploy Prediction Model',
          action: 'DEPLOY_PREDICTIVE_MODEL',
          primary: true,
          estimatedTimeSaving: 60,
          riskLevel: 'medium',
          requiresApproval: true
        }
      ],
      confidenceCalculation: {
        baseConfidence: 0.92,
        dataQualityFactor: 0.05,
        historicalAccuracyFactor: 0.03
      },
      priority: 'medium',
      moduleSpecific: true
    }
  ],
  'deal-screening': [
    {
      id: 'ds-pattern-recognition',
      type: 'insight',
      title: 'Deal Pattern Recognition Alert',
      descriptionTemplate: '{sectorName} deals in your pipeline are showing {performancePercentage}% higher returns than sector average. Consider adjusting screening criteria.',
      conditions: [
        { field: 'sectorPerformance', operator: 'gt', value: 1.15, weight: 0.7 },
        { field: 'dealCount', operator: 'gt', value: 3, weight: 0.5 }
      ],
      actions: [
        {
          id: 'adjust-screening-criteria',
          label: 'Adjust Screening Criteria',
          action: 'ADJUST_DEAL_SCREENING_CRITERIA',
          primary: true,
          estimatedTimeSaving: 30,
          riskLevel: 'low'
        },
        {
          id: 'view-analysis',
          label: 'View Detailed Analysis',
          action: 'VIEW_DEAL_SCREENING_ANALYSIS',
          riskLevel: 'low'
        }
      ],
      confidenceCalculation: {
        baseConfidence: 0.80,
        dataQualityFactor: 0.15,
        historicalAccuracyFactor: 0.05
      },
      priority: 'high',
      moduleSpecific: true
    },
    {
      id: 'ds-bulk-processing',
      type: 'automation',
      title: 'Bulk Processing Available',
      descriptionTemplate: '{opportunityCount} new opportunities can be processed automatically using existing templates with {confidenceLevel}% confidence.',
      conditions: [
        { field: 'pendingOpportunities', operator: 'gt', value: 3, weight: 0.6 },
        { field: 'templateMatchConfidence', operator: 'gt', value: 0.85, weight: 0.8 }
      ],
      actions: [
        {
          id: 'process-bulk',
          label: 'Process All Opportunities',
          action: 'PROCESS_DEAL_SCREENING_BULK',
          primary: true,
          estimatedTimeSaving: 180,
          riskLevel: 'medium',
          requiresApproval: true
        }
      ],
      confidenceCalculation: {
        baseConfidence: 0.85,
        dataQualityFactor: 0.1,
        historicalAccuracyFactor: 0.05
      },
      priority: 'medium',
      moduleSpecific: true
    }
  ],
  'portfolio': [
    {
      id: 'p-rebalancing-opportunity',
      type: 'optimization',
      title: 'Portfolio Rebalancing Opportunity',
      descriptionTemplate: 'Your {assetClass} allocation is {deviationPercentage}% overweight. Reducing by {reductionPercentage}% could improve risk-adjusted returns by {improvementPercentage}%.',
      conditions: [
        { field: 'allocationDeviation', operator: 'gt', value: 0.05, weight: 0.8 },
        { field: 'expectedImprovement', operator: 'gt', value: 0.08, weight: 0.7 }
      ],
      actions: [
        {
          id: 'execute-rebalancing',
          label: 'Execute Rebalancing',
          action: 'EXECUTE_REBALANCING',
          primary: true,
          estimatedTimeSaving: 90,
          riskLevel: 'medium',
          requiresApproval: true
        }
      ],
      confidenceCalculation: {
        baseConfidence: 0.88,
        dataQualityFactor: 0.1,
        historicalAccuracyFactor: 0.02
      },
      priority: 'high',
      moduleSpecific: true
    }
  ],
  'due-diligence': [
    {
      id: 'dd-overdue-projects',
      type: 'warning',
      title: 'Projects Behind Schedule',
      descriptionTemplate: '{projectCount} projects are past target dates. Risk of missing investment committee deadlines. Average delay: {averageDelay} days.',
      conditions: [
        { field: 'overdueProjects', operator: 'gt', value: 1, weight: 0.9 },
        { field: 'averageDelay', operator: 'gt', value: 3, weight: 0.6 }
      ],
      actions: [
        {
          id: 'reallocate-resources',
          label: 'Reallocate Resources',
          action: 'REALLOCATE_RESOURCES',
          primary: true,
          estimatedTimeSaving: 60,
          riskLevel: 'medium',
          requiresApproval: true
        }
      ],
      confidenceCalculation: {
        baseConfidence: 0.95,
        dataQualityFactor: 0.03,
        historicalAccuracyFactor: 0.02
      },
      priority: 'critical',
      moduleSpecific: true
    }
  ]
}

/**
 * Cross-module recommendations that apply to multiple modules
 */
const CROSS_MODULE_TEMPLATES: RecommendationTemplate[] = [
  {
    id: 'cm-workflow-efficiency',
    type: 'suggestion',
    title: 'Workflow Optimization Opportunity',
    descriptionTemplate: 'Similar tasks across {moduleCount} modules can be automated. Estimated time savings: {timeSavings} hours per month.',
    conditions: [
      { field: 'repetitiveTaskCount', operator: 'gt', value: 5, weight: 0.7 },
      { field: 'crossModulePatterns', operator: 'exists', value: true, weight: 0.8 }
    ],
    actions: [
      {
        id: 'optimize-workflow',
        label: 'Optimize Cross-Module Workflow',
        action: 'OPTIMIZE_CROSS_MODULE_WORKFLOW',
        primary: true,
        estimatedTimeSaving: 240,
        riskLevel: 'low'
      }
    ],
    confidenceCalculation: {
      baseConfidence: 0.75,
      dataQualityFactor: 0.2,
      historicalAccuracyFactor: 0.05
    },
    priority: 'medium',
    moduleSpecific: false
  }
]

/**
 * Calculate recommendation confidence score
 */
function calculateConfidence(
  template: RecommendationTemplate,
  context: ModuleContext,
  conditionMatches: number[]
): number {
  const { baseConfidence, dataQualityFactor, historicalAccuracyFactor } = template.confidenceCalculation
  
  // Calculate condition match strength
  const avgConditionMatch = conditionMatches.reduce((sum, match) => sum + match, 0) / conditionMatches.length
  
  // Data quality assessment (0-1 scale)
  const dataQuality = context.currentData ? 0.8 : 0.5 // Simplified assessment
  
  // Historical accuracy (based on user behavior)
  const historicalAccuracy = context.userBehavior?.successRate || 0.7
  
  const finalConfidence = Math.min(1.0, Math.max(0.0,
    baseConfidence +
    (dataQuality - 0.5) * dataQualityFactor +
    (historicalAccuracy - 0.5) * historicalAccuracyFactor
  )) * avgConditionMatch
  
  return Math.round(finalConfidence * 100) / 100
}

/**
 * Evaluate conditions against context data
 */
function evaluateConditions(
  conditions: RecommendationTemplate['conditions'],
  data: any
): number[] {
  return conditions.map(condition => {
    const fieldValue = data[condition.field]
    let match = 0
    
    switch (condition.operator) {
      case 'gt':
        match = fieldValue > condition.value ? 1 : 0
        break
      case 'lt':
        match = fieldValue < condition.value ? 1 : 0
        break
      case 'eq':
        match = fieldValue === condition.value ? 1 : 0
        break
      case 'contains':
        match = fieldValue && fieldValue.toString().includes(condition.value) ? 1 : 0
        break
      case 'exists':
        match = fieldValue !== undefined && fieldValue !== null ? 1 : 0
        break
    }
    
    return match * condition.weight
  })
}

/**
 * Generate AI recommendations for a module
 */
export function generateAIRecommendations(
  context: ModuleContext,
  mode: 'assisted' | 'autonomous'
): AIRecommendation[] {
  const moduleTemplates = RECOMMENDATION_TEMPLATES[context.moduleId] || []
  const applicableTemplates = [...moduleTemplates]
  
  // Add cross-module recommendations for autonomous mode
  if (mode === 'autonomous') {
    applicableTemplates.push(...CROSS_MODULE_TEMPLATES)
  }
  
  const recommendations: AIRecommendation[] = []
  
  for (const template of applicableTemplates) {
    const conditionMatches = evaluateConditions(template.conditions, context.currentData || {})
    const hasMinimumMatch = conditionMatches.some(match => match > 0.5)
    
    if (hasMinimumMatch) {
      const confidence = calculateConfidence(template, context, conditionMatches)
      
      // Only include recommendations with reasonable confidence
      if (confidence >= 0.6) {
        const recommendation: AIRecommendation = {
          id: `${template.id}-${Date.now()}`,
          type: template.type,
          priority: template.priority,
          title: template.title,
          description: interpolateTemplate(template.descriptionTemplate, context.currentData || {}),
          actions: template.actions.map(action => ({
            id: action.id,
            label: action.label,
            action: action.action,
            primary: action.primary,
            estimatedTimeSaving: action.estimatedTimeSaving
          })),
          confidence,
          moduleContext: context.moduleId,
          timestamp: new Date(),
          category: template.moduleSpecific ? 'domain-specific' : 'cross-module'
        }
        
        recommendations.push(recommendation)
      }
    }
  }
  
  // Sort by priority and confidence
  return recommendations.sort((a, b) => {
    const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 }
    const priorityDiff = priorityOrder[a.priority as keyof typeof priorityOrder] - 
                        priorityOrder[b.priority as keyof typeof priorityOrder]
    
    if (priorityDiff !== 0) return priorityDiff
    return b.confidence - a.confidence
  }).slice(0, 5) // Limit to top 5 recommendations
}

/**
 * Interpolate template strings with data
 */
function interpolateTemplate(template: string, data: any): string {
  return template.replace(/\{(\w+)\}/g, (match, key) => {
    const value = data[key]
    if (value === undefined || value === null) {
      return match // Keep placeholder if no data
    }
    
    // Format numbers appropriately
    if (typeof value === 'number') {
      if (key.includes('Percentage')) {
        return `${Math.round(value * 100)}`
      }
      if (key.includes('Count')) {
        return value.toString()
      }
      return value.toFixed(1)
    }
    
    return value.toString()
  })
}

/**
 * Get recommendation quality metrics
 */
export function getRecommendationQualityMetrics(
  recommendations: AIRecommendation[]
): {
  averageConfidence: number
  highConfidenceCount: number
  domainSpecificCount: number
  actionableCount: number
  qualityScore: number
} {
  if (recommendations.length === 0) {
    return {
      averageConfidence: 0,
      highConfidenceCount: 0,
      domainSpecificCount: 0,
      actionableCount: 0,
      qualityScore: 0
    }
  }
  
  const averageConfidence = recommendations.reduce((sum, rec) => sum + rec.confidence, 0) / recommendations.length
  const highConfidenceCount = recommendations.filter(rec => rec.confidence >= 0.85).length
  const domainSpecificCount = recommendations.filter(rec => rec.category === 'domain-specific').length
  const actionableCount = recommendations.filter(rec => rec.actions && rec.actions.length > 0).length
  
  // Quality score calculation (0-100)
  const confidenceScore = averageConfidence * 30
  const specificityScore = (domainSpecificCount / recommendations.length) * 25
  const actionabilityScore = (actionableCount / recommendations.length) * 25
  const diversityScore = Math.min(1, recommendations.length / 3) * 20
  
  const qualityScore = Math.round(confidenceScore + specificityScore + actionabilityScore + diversityScore)
  
  return {
    averageConfidence: Math.round(averageConfidence * 100) / 100,
    highConfidenceCount,
    domainSpecificCount,
    actionableCount,
    qualityScore
  }
}

/**
 * Mock data generators for testing recommendations
 */
export const mockContextData = {
  'advanced-analytics': {
    correlationLevel: 0.78,
    assetConcentration: 0.18,
    correlationPercentage: 78,
    assetClass: 'tech holdings',
    rebalancePercentage: 15,
    modelAccuracy: 0.94,
    validationPeriods: 4,
    accuracyPercentage: 94,
    sectorName: 'Healthcare'
  },
  'deal-screening': {
    sectorPerformance: 1.23,
    dealCount: 5,
    sectorName: 'Healthcare',
    performancePercentage: 23,
    pendingOpportunities: 4,
    templateMatchConfidence: 0.87,
    opportunityCount: 4,
    confidenceLevel: 87
  },
  'portfolio': {
    allocationDeviation: 0.08,
    expectedImprovement: 0.12,
    assetClass: 'tech',
    deviationPercentage: 8,
    reductionPercentage: 5,
    improvementPercentage: 12
  },
  'due-diligence': {
    overdueProjects: 2,
    averageDelay: 5,
    projectCount: 2
  }
}