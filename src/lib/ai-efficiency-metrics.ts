/**
 * Centralized AI Efficiency Metrics System
 * Provides consistent calculation methods for AI efficiency gains across all modules
 */

export interface ModuleMetrics {
  totalTasks: number
  automatedTasks: number
  timeSeriesData?: Array<{
    period: string
    efficiency: number
    automation: number
    accuracy: number
  }>
  complexityFactor: number // 1.0 = basic, 2.0 = complex, 3.0 = highly complex
  dataVolume: 'low' | 'medium' | 'high' | 'enterprise'
}

export interface EfficiencyResult {
  efficiency: number // Overall efficiency gain percentage
  automation: number // Automation level percentage  
  accuracy: number // Accuracy improvement percentage
  timeSaved: number // Hours saved per month
  costReduction: number // Cost reduction percentage
}

/**
 * Module complexity and baseline metrics
 */
const MODULE_BASELINES: Record<string, {
  complexityFactor: number
  baselineEfficiency: number
  automationPotential: { assisted: number; autonomous: number }
  accuracyImprovementCap: { assisted: number; autonomous: number }
}> = {
  'dashboard': {
    complexityFactor: 1.0,
    baselineEfficiency: 5,
    automationPotential: { assisted: 30, autonomous: 60 },
    accuracyImprovementCap: { assisted: 10, autonomous: 15 }
  },
  'deal-screening': {
    complexityFactor: 1.8,
    baselineEfficiency: 8,
    automationPotential: { assisted: 45, autonomous: 80 },
    accuracyImprovementCap: { assisted: 18, autonomous: 25 }
  },
  'deal-structuring': {
    complexityFactor: 2.5,
    baselineEfficiency: 12,
    automationPotential: { assisted: 35, autonomous: 70 },
    accuracyImprovementCap: { assisted: 15, autonomous: 20 }
  },
  'due-diligence': {
    complexityFactor: 2.2,
    baselineEfficiency: 10,
    automationPotential: { assisted: 40, autonomous: 85 },
    accuracyImprovementCap: { assisted: 15, autonomous: 20 }
  },
  'portfolio': {
    complexityFactor: 2.0,
    baselineEfficiency: 15,
    automationPotential: { assisted: 40, autonomous: 85 },
    accuracyImprovementCap: { assisted: 15, autonomous: 20 }
  },
  'portfolio-management': {
    complexityFactor: 2.3,
    baselineEfficiency: 18,
    automationPotential: { assisted: 45, autonomous: 80 },
    accuracyImprovementCap: { assisted: 20, autonomous: 25 }
  },
  'advanced-analytics': {
    complexityFactor: 3.0,
    baselineEfficiency: 25,
    automationPotential: { assisted: 70, autonomous: 90 },
    accuracyImprovementCap: { assisted: 40, autonomous: 60 }
  },
  'fund-operations': {
    complexityFactor: 1.6,
    baselineEfficiency: 8,
    automationPotential: { assisted: 25, autonomous: 55 },
    accuracyImprovementCap: { assisted: 12, autonomous: 18 }
  },
  'investment-committee': {
    complexityFactor: 1.4,
    baselineEfficiency: 6,
    automationPotential: { assisted: 35, autonomous: 65 },
    accuracyImprovementCap: { assisted: 12, autonomous: 16 }
  },
  'legal-management': {
    complexityFactor: 2.1,
    baselineEfficiency: 12,
    automationPotential: { assisted: 45, autonomous: 75 },
    accuracyImprovementCap: { assisted: 18, autonomous: 24 }
  },
  'market-intelligence': {
    complexityFactor: 2.8,
    baselineEfficiency: 22,
    automationPotential: { assisted: 55, autonomous: 80 },
    accuracyImprovementCap: { assisted: 35, autonomous: 45 }
  },
  'gp-portal': {
    complexityFactor: 1.5,
    baselineEfficiency: 7,
    automationPotential: { assisted: 35, autonomous: 65 },
    accuracyImprovementCap: { assisted: 12, autonomous: 16 }
  },
  'lp-portal': {
    complexityFactor: 1.3,
    baselineEfficiency: 6,
    automationPotential: { assisted: 30, autonomous: 60 },
    accuracyImprovementCap: { assisted: 10, autonomous: 15 }
  },
  'knowledge-management': {
    complexityFactor: 2.4,
    baselineEfficiency: 15,
    automationPotential: { assisted: 50, autonomous: 85 },
    accuracyImprovementCap: { assisted: 25, autonomous: 35 }
  },
  'lpgp-relationship': {
    complexityFactor: 1.2,
    baselineEfficiency: 5,
    automationPotential: { assisted: 25, autonomous: 50 },
    accuracyImprovementCap: { assisted: 8, autonomous: 12 }
  },
  'workflow-automation': {
    complexityFactor: 1.8,
    baselineEfficiency: 20,
    automationPotential: { assisted: 60, autonomous: 90 },
    accuracyImprovementCap: { assisted: 15, autonomous: 20 }
  },
  'admin-management': {
    complexityFactor: 1.1,
    baselineEfficiency: 3,
    automationPotential: { assisted: 20, autonomous: 40 },
    accuracyImprovementCap: { assisted: 5, autonomous: 10 }
  }
}

/**
 * Calculate standardized efficiency metrics for a module
 */
export function calculateEfficiencyMetrics(
  moduleId: string,
  mode: 'traditional' | 'assisted' | 'autonomous',
  customMetrics?: Partial<ModuleMetrics>
): EfficiencyResult {
  const baseline = MODULE_BASELINES[moduleId]
  
  if (!baseline) {
    console.warn(`No baseline metrics found for module: ${moduleId}`)
    return {
      efficiency: 0,
      automation: 0,
      accuracy: 100,
      timeSaved: 0,
      costReduction: 0
    }
  }

  if (mode === 'traditional') {
    return {
      efficiency: 0,
      automation: 0,
      accuracy: 100,
      timeSaved: 0,
      costReduction: 0
    }
  }

  // Base efficiency calculation
  const baseEfficiency = baseline.baselineEfficiency
  const automationLevel = baseline.automationPotential[mode]
  const accuracyImprovement = baseline.accuracyImprovementCap[mode]
  
  // Apply complexity factor
  const complexityMultiplier = Math.log10(baseline.complexityFactor + 1) + 1
  
  // Calculate final metrics
  const efficiency = Math.round(baseEfficiency * complexityMultiplier)
  const automation = automationLevel
  const accuracy = 100 + accuracyImprovement
  
  // Time saved calculation (hours per month)
  const timeSaved = Math.round((efficiency / 100) * 40 * baseline.complexityFactor)
  
  // Cost reduction (percentage)
  const costReduction = Math.round(efficiency * 0.6) // Approximate 60% correlation
  
  return {
    efficiency,
    automation,
    accuracy,
    timeSaved,
    costReduction
  }
}

/**
 * Get efficiency trends over time
 */
export function getEfficiencyTrends(
  moduleId: string,
  mode: 'traditional' | 'assisted' | 'autonomous',
  periods: number = 6
): Array<{ period: string; efficiency: number; automation: number; accuracy: number }> {
  const baseMetrics = calculateEfficiencyMetrics(moduleId, mode)
  const trends = []
  
  for (let i = periods - 1; i >= 0; i--) {
    const date = new Date()
    date.setMonth(date.getMonth() - i)
    const period = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    
    // Add some realistic variance
    const variance = (Math.random() - 0.5) * 0.1 // ±5% variance
    const growthFactor = mode === 'autonomous' ? (periods - i) * 0.02 : (periods - i) * 0.01
    
    trends.push({
      period,
      efficiency: Math.max(0, Math.round(baseMetrics.efficiency * (1 + variance + growthFactor))),
      automation: Math.max(0, Math.round(baseMetrics.automation * (1 + variance * 0.5 + growthFactor))),
      accuracy: Math.min(200, Math.round(baseMetrics.accuracy * (1 + variance * 0.2)))
    })
  }
  
  return trends
}

/**
 * Compare efficiency across modules
 */
export function compareModuleEfficiency(
  modules: string[],
  mode: 'traditional' | 'assisted' | 'autonomous'
): Array<{
  moduleId: string
  moduleName: string
  metrics: EfficiencyResult
}> {
  const MODULE_NAMES: Record<string, string> = {
    'dashboard': 'Dashboard',
    'deal-screening': 'Deal Screening',
    'deal-structuring': 'Deal Structuring',
    'due-diligence': 'Due Diligence',
    'portfolio': 'Portfolio',
    'portfolio-management': 'Portfolio Management',
    'advanced-analytics': 'Advanced Analytics',
    'fund-operations': 'Fund Operations',
    'investment-committee': 'Investment Committee',
    'legal-management': 'Legal Management',
    'market-intelligence': 'Market Intelligence',
    'gp-portal': 'GP Portal',
    'lp-portal': 'LP Portal',
    'knowledge-management': 'Knowledge Management',
    'lpgp-relationship': 'LP-GP Relationships',
    'workflow-automation': 'Workflow Automation',
    'admin-management': 'Administration'
  }
  
  return modules.map(moduleId => ({
    moduleId,
    moduleName: MODULE_NAMES[moduleId] || moduleId,
    metrics: calculateEfficiencyMetrics(moduleId, mode)
  })).sort((a, b) => b.metrics.efficiency - a.metrics.efficiency)
}

/**
 * Get ROI calculation for AI implementation
 */
export function calculateROI(
  moduleId: string,
  mode: 'assisted' | 'autonomous',
  implementationCost: number = 50000, // Default $50k implementation cost
  monthlyOperatingCost: number = 2000 // Default $2k monthly operating cost
): {
  monthlyBenefit: number
  breakEvenMonths: number
  yearOneROI: number
  threeYearROI: number
} {
  const metrics = calculateEfficiencyMetrics(moduleId, mode)
  
  // Estimate monthly benefit based on time saved and cost reduction
  // Assume $150/hour average labor cost
  const monthlyBenefit = (metrics.timeSaved * 150) + (implementationCost * (metrics.costReduction / 100) / 12)
  
  const netMonthlyCashFlow = monthlyBenefit - monthlyOperatingCost
  const breakEvenMonths = netMonthlyCashFlow > 0 ? Math.ceil(implementationCost / netMonthlyCashFlow) : Infinity
  
  const yearOneTotalBenefit = monthlyBenefit * 12
  const yearOneTotalCost = implementationCost + (monthlyOperatingCost * 12)
  const yearOneROI = ((yearOneTotalBenefit - yearOneTotalCost) / yearOneTotalCost) * 100
  
  const threeYearTotalBenefit = monthlyBenefit * 36
  const threeYearTotalCost = implementationCost + (monthlyOperatingCost * 36)
  const threeYearROI = ((threeYearTotalBenefit - threeYearTotalCost) / threeYearTotalCost) * 100
  
  return {
    monthlyBenefit: Math.round(monthlyBenefit),
    breakEvenMonths,
    yearOneROI: Math.round(yearOneROI),
    threeYearROI: Math.round(threeYearROI)
  }
}