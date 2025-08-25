/**
 * Autonomous Mode Configuration System
 * Provides standardized autonomous interface configurations for all modules
 */

export interface AutonomousAction {
  id: string
  label: string
  description: string
  category: 'analysis' | 'modeling' | 'optimization' | 'automation' | 'insights' | 'forecasting' | 'reporting'
  estimatedTime?: number // minutes
  complexity: 'low' | 'medium' | 'high'
  requiresApproval?: boolean
}

export interface AutonomousProject {
  id: string
  name: string
  type: string
  status: 'active' | 'completed' | 'draft' | 'review' | 'paused'
  lastActivity: Date
  priority: 'high' | 'medium' | 'low'
  unreadMessages?: number
  metadata?: Record<string, any>
  progress?: number
}

export interface ModuleAutonomousConfig {
  moduleId: string
  systemPrompt: string
  availableActions: AutonomousAction[]
  projectTypes: Array<{
    id: string
    label: string
    description: string
    defaultActions: string[]
  }>
  contextPanelSections: Array<{
    id: string
    title: string
    component?: string
    data?: any
  }>
}

/**
 * Autonomous mode configurations for all modules
 */
export const AUTONOMOUS_CONFIGS: Record<string, ModuleAutonomousConfig> = {
  'advanced-analytics': {
    moduleId: 'advanced-analytics',
    systemPrompt: 'You are an AI advanced analytics specialist with expertise in machine learning, statistical modeling, and data science. Your capabilities include: advanced statistical modeling and machine learning, predictive analytics and forecasting, data mining and pattern recognition, model optimization and performance tuning, and multi-dimensional data analysis. Provide sophisticated analytical insights with statistical rigor and clear methodology explanations.',
    availableActions: [
      {
        id: 'build-ml-model',
        label: 'Build ML Model',
        description: 'Create advanced machine learning model with automated feature selection',
        category: 'modeling',
        estimatedTime: 45,
        complexity: 'high',
        requiresApproval: true
      },
      {
        id: 'optimize-performance',
        label: 'Optimize Model',
        description: 'Enhance model performance and accuracy using automated tuning',
        category: 'optimization',
        estimatedTime: 30,
        complexity: 'medium'
      },
      {
        id: 'predictive-analysis',
        label: 'Predictive Analysis',
        description: 'Generate forecasts and predictions with confidence intervals',
        category: 'forecasting',
        estimatedTime: 25,
        complexity: 'medium'
      },
      {
        id: 'data-insights',
        label: 'Extract Insights',
        description: 'Deep data analysis and pattern recognition with visualizations',
        category: 'insights',
        estimatedTime: 20,
        complexity: 'medium'
      },
      {
        id: 'correlation-analysis',
        label: 'Correlation Analysis',
        description: 'Advanced correlation and causation analysis across datasets',
        category: 'analysis',
        estimatedTime: 35,
        complexity: 'high'
      }
    ],
    projectTypes: [
      {
        id: 'model',
        label: 'ML Model',
        description: 'Machine learning model development and deployment',
        defaultActions: ['build-ml-model', 'optimize-performance']
      },
      {
        id: 'analysis',
        label: 'Data Analysis',
        description: 'Comprehensive data analysis and visualization',
        defaultActions: ['data-insights', 'correlation-analysis']
      },
      {
        id: 'forecast',
        label: 'Forecasting',
        description: 'Predictive modeling and forecasting projects',
        defaultActions: ['predictive-analysis', 'optimize-performance']
      },
      {
        id: 'research',
        label: 'Research',
        description: 'Exploratory data analysis and research projects',
        defaultActions: ['data-insights', 'correlation-analysis']
      }
    ],
    contextPanelSections: [
      {
        id: 'model-metrics',
        title: 'Model Performance',
        data: { accuracy: 94, confidence: 91, dataPoints: '2.4M' }
      },
      {
        id: 'data-quality',
        title: 'Data Quality',
        data: { completeness: 98, consistency: 95, freshness: 'Real-time' }
      }
    ]
  },
  
  'deal-screening': {
    moduleId: 'deal-screening',
    systemPrompt: 'You are an AI deal screening specialist with expertise in investment analysis, market research, and financial due diligence. Your capabilities include: automated deal sourcing and screening, financial modeling and valuation, market and competitive analysis, risk assessment and scoring, and investment thesis development. Provide comprehensive deal analysis with clear recommendations.',
    availableActions: [
      {
        id: 'screen-opportunity',
        label: 'Screen Opportunity',
        description: 'Comprehensive screening analysis with scoring',
        category: 'analysis',
        estimatedTime: 30,
        complexity: 'medium'
      },
      {
        id: 'financial-modeling',
        label: 'Financial Model',
        description: 'Build detailed financial model with projections',
        category: 'modeling',
        estimatedTime: 60,
        complexity: 'high',
        requiresApproval: true
      },
      {
        id: 'market-analysis',
        label: 'Market Analysis',
        description: 'Comprehensive market and competitive analysis',
        category: 'analysis',
        estimatedTime: 45,
        complexity: 'medium'
      },
      {
        id: 'risk-assessment',
        label: 'Risk Assessment',
        description: 'Detailed risk analysis and mitigation strategies',
        category: 'analysis',
        estimatedTime: 40,
        complexity: 'medium'
      },
      {
        id: 'investment-thesis',
        label: 'Investment Thesis',
        description: 'Develop comprehensive investment thesis and recommendation',
        category: 'reporting',
        estimatedTime: 50,
        complexity: 'high'
      }
    ],
    projectTypes: [
      {
        id: 'opportunity',
        label: 'Deal Opportunity',
        description: 'New deal opportunity for screening and analysis',
        defaultActions: ['screen-opportunity', 'market-analysis']
      },
      {
        id: 'deep-dive',
        label: 'Deep Dive',
        description: 'Comprehensive analysis of promising opportunities',
        defaultActions: ['financial-modeling', 'risk-assessment', 'investment-thesis']
      }
    ],
    contextPanelSections: [
      {
        id: 'screening-metrics',
        title: 'Screening Progress',
        data: { total: 24, screened: 18, passed: 8, pending: 6 }
      },
      {
        id: 'market-trends',
        title: 'Market Trends',
        data: { hotSectors: ['FinTech', 'HealthTech'], dealFlow: '+23%' }
      }
    ]
  },

  'portfolio': {
    moduleId: 'portfolio',
    systemPrompt: 'You are an AI portfolio management specialist with expertise in asset allocation, risk management, and performance optimization. Your capabilities include: portfolio optimization and rebalancing, risk analysis and management, performance attribution and reporting, ESG integration and impact measurement, and strategic asset allocation. Provide data-driven portfolio insights with clear actionable recommendations.',
    availableActions: [
      {
        id: 'portfolio-optimization',
        label: 'Optimize Portfolio',
        description: 'AI-driven portfolio optimization with risk constraints',
        category: 'optimization',
        estimatedTime: 35,
        complexity: 'high',
        requiresApproval: true
      },
      {
        id: 'risk-analysis',
        label: 'Risk Analysis',
        description: 'Comprehensive risk assessment and stress testing',
        category: 'analysis',
        estimatedTime: 30,
        complexity: 'medium'
      },
      {
        id: 'performance-attribution',
        label: 'Performance Attribution',
        description: 'Detailed performance analysis and factor attribution',
        category: 'analysis',
        estimatedTime: 25,
        complexity: 'medium'
      },
      {
        id: 'rebalancing',
        label: 'Portfolio Rebalancing',
        description: 'Automated rebalancing with optimal execution',
        category: 'automation',
        estimatedTime: 20,
        complexity: 'medium',
        requiresApproval: true
      },
      {
        id: 'esg-analysis',
        label: 'ESG Analysis',
        description: 'ESG scoring and impact measurement',
        category: 'analysis',
        estimatedTime: 40,
        complexity: 'medium'
      }
    ],
    projectTypes: [
      {
        id: 'optimization',
        label: 'Portfolio Optimization',
        description: 'Strategic portfolio optimization and rebalancing',
        defaultActions: ['portfolio-optimization', 'risk-analysis']
      },
      {
        id: 'monitoring',
        label: 'Portfolio Monitoring',
        description: 'Ongoing portfolio monitoring and reporting',
        defaultActions: ['performance-attribution', 'risk-analysis']
      },
      {
        id: 'esg-project',
        label: 'ESG Integration',
        description: 'ESG-focused portfolio analysis and optimization',
        defaultActions: ['esg-analysis', 'portfolio-optimization']
      }
    ],
    contextPanelSections: [
      {
        id: 'portfolio-overview',
        title: 'Portfolio Overview',
        data: { aum: '$3.88B', assets: 47, ytdReturn: '12.5%' }
      },
      {
        id: 'risk-metrics',
        title: 'Risk Metrics',
        data: { var: '2.1%', sharpe: '1.85', maxDrawdown: '8.2%' }
      }
    ]
  },

  'exit': {
    moduleId: 'exit',
    systemPrompt: 'You are an AI exit management specialist with expertise in exit strategy optimization, market timing, and exit process orchestration. Your capabilities include: exit opportunity identification and scoring, market timing analysis and predictions, autonomous exit preparation workflows, valuation modeling and optimization, and stakeholder coordination and communications. Provide strategic exit insights with clear timing recommendations and actionable next steps.',
    availableActions: [
      {
        id: 'exit-opportunity-analysis',
        label: 'Exit Opportunity Analysis',
        description: 'Comprehensive analysis of exit readiness and market opportunities',
        category: 'analysis',
        estimatedTime: 45,
        complexity: 'high'
      },
      {
        id: 'market-timing-analysis',
        label: 'Market Timing Analysis',
        description: 'AI-driven market timing assessment and optimal window identification',
        category: 'analysis',
        estimatedTime: 30,
        complexity: 'medium'
      },
      {
        id: 'valuation-modeling',
        label: 'Exit Valuation Modeling',
        description: 'Advanced valuation modeling with multiple methodologies',
        category: 'modeling',
        estimatedTime: 60,
        complexity: 'high',
        requiresApproval: true
      },
      {
        id: 'process-automation',
        label: 'Exit Process Automation',
        description: 'Automated exit preparation workflow and task management',
        category: 'automation',
        estimatedTime: 35,
        complexity: 'medium'
      },
      {
        id: 'buyer-identification',
        label: 'Strategic Buyer Analysis',
        description: 'Identify and analyze potential strategic and financial buyers',
        category: 'insights',
        estimatedTime: 40,
        complexity: 'medium'
      },
      {
        id: 'exit-forecasting',
        label: 'Exit Performance Forecasting',
        description: 'Predictive modeling of exit outcomes and returns',
        category: 'forecasting',
        estimatedTime: 50,
        complexity: 'high'
      }
    ],
    projectTypes: [
      {
        id: 'exit-opportunity',
        label: 'Exit Opportunity',
        description: 'Individual company exit preparation and management',
        defaultActions: ['exit-opportunity-analysis', 'market-timing-analysis']
      },
      {
        id: 'portfolio-exit',
        label: 'Portfolio Exit Strategy',
        description: 'Multi-company exit portfolio optimization',
        defaultActions: ['exit-forecasting', 'market-timing-analysis']
      },
      {
        id: 'market-analysis',
        label: 'Exit Market Analysis',
        description: 'Sector-wide exit market intelligence and timing',
        defaultActions: ['market-timing-analysis', 'buyer-identification']
      }
    ],
    contextPanelSections: [
      {
        id: 'exit-pipeline',
        title: 'Exit Pipeline',
        data: { active: 5, pipeline_value: '$450M', avg_score: 8.2 }
      },
      {
        id: 'market-conditions',
        title: 'Market Conditions',
        data: { timing: 'excellent', sector_performance: '+15%', volatility: 'low' }
      }
    ]
  },

  'due-diligence': {
    moduleId: 'due-diligence',
    systemPrompt: 'You are an AI due diligence specialist with expertise in comprehensive investment analysis, document review, and risk assessment. Your capabilities include: automated document analysis and extraction, financial and operational due diligence, regulatory and compliance review, management team assessment, and risk identification and mitigation. Provide thorough due diligence insights with clear risk ratings.',
    availableActions: [
      {
        id: 'document-analysis',
        label: 'Document Analysis',
        description: 'AI-powered document review and key information extraction',
        category: 'analysis',
        estimatedTime: 60,
        complexity: 'medium'
      },
      {
        id: 'financial-dd',
        label: 'Financial DD',
        description: 'Comprehensive financial due diligence and analysis',
        category: 'analysis',
        estimatedTime: 90,
        complexity: 'high'
      },
      {
        id: 'operational-dd',
        label: 'Operational DD',
        description: 'Operational due diligence and efficiency analysis',
        category: 'analysis',
        estimatedTime: 75,
        complexity: 'high'
      },
      {
        id: 'management-assessment',
        label: 'Management Assessment',
        description: 'Leadership team evaluation and reference checks',
        category: 'analysis',
        estimatedTime: 45,
        complexity: 'medium'
      },
      {
        id: 'risk-mapping',
        label: 'Risk Mapping',
        description: 'Comprehensive risk identification and mapping',
        category: 'analysis',
        estimatedTime: 50,
        complexity: 'medium'
      },
      {
        id: 'dd-report',
        label: 'DD Report Generation',
        description: 'Generate comprehensive due diligence report',
        category: 'reporting',
        estimatedTime: 40,
        complexity: 'medium'
      }
    ],
    projectTypes: [
      {
        id: 'full-dd',
        label: 'Full Due Diligence',
        description: 'Comprehensive due diligence project',
        defaultActions: ['document-analysis', 'financial-dd', 'operational-dd']
      },
      {
        id: 'focused-dd',
        label: 'Focused DD',
        description: 'Targeted due diligence on specific areas',
        defaultActions: ['document-analysis', 'risk-mapping']
      },
      {
        id: 'management-dd',
        label: 'Management DD',
        description: 'Management team focused due diligence',
        defaultActions: ['management-assessment', 'document-analysis']
      }
    ],
    contextPanelSections: [
      {
        id: 'dd-progress',
        title: 'DD Progress',
        data: { totalTasks: 124, completed: 89, critical: 3 }
      },
      {
        id: 'findings-summary',
        title: 'Key Findings',
        data: { total: 23, high: 5, medium: 12, low: 6 }
      }
    ]
  }
}

/**
 * Generate mock projects for a module
 */
export function generateMockProjects(moduleId: string, count: number = 3): AutonomousProject[] {
  const config = AUTONOMOUS_CONFIGS[moduleId]
  if (!config) return []

  const projects: AutonomousProject[] = []
  const now = new Date()

  for (let i = 0; i < count; i++) {
    const projectType = config.projectTypes[i % config.projectTypes.length]
    const priority = ['high', 'medium', 'low'][i % 3] as 'high' | 'medium' | 'low'
    const status = ['active', 'draft', 'review'][i % 3] as 'active' | 'draft' | 'review'
    
    const project: AutonomousProject = {
      id: `${moduleId}-project-${i + 1}`,
      name: `${projectType.label} ${i + 1}`,
      type: projectType.id,
      status,
      lastActivity: new Date(now.getTime() - (i + 1) * 1800000), // 30 min intervals
      priority,
      unreadMessages: status === 'active' ? Math.floor(Math.random() * 8) + 1 : 0,
      metadata: generateProjectMetadata(moduleId, projectType.id),
      progress: status === 'active' ? Math.floor(Math.random() * 70) + 15 : 
                status === 'review' ? Math.floor(Math.random() * 20) + 80 : 
                Math.floor(Math.random() * 30) + 5
    }
    
    projects.push(project)
  }

  return projects
}

/**
 * Generate project metadata based on module and project type
 */
function generateProjectMetadata(moduleId: string, projectType: string): Record<string, any> {
  const baseMetadata = {
    createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
    lastUpdated: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000),
    collaborators: Math.floor(Math.random() * 5) + 1
  }

  switch (moduleId) {
    case 'advanced-analytics':
      return {
        ...baseMetadata,
        modelType: ['Neural Network', 'Random Forest', 'Ensemble', 'Deep Learning'][Math.floor(Math.random() * 4)],
        dataSize: ['1.2M', '2.4M', '850K', '3.1M'][Math.floor(Math.random() * 4)] + ' data points',
        accuracy: Math.floor(Math.random() * 20) + 80,
        confidence: Math.floor(Math.random() * 25) + 75,
        aiScore: Math.floor(Math.random() * 30) + 70
      }

    case 'deal-screening':
      return {
        ...baseMetadata,
        sector: ['FinTech', 'HealthTech', 'CleanTech', 'EdTech', 'Logistics'][Math.floor(Math.random() * 5)],
        stage: ['Series A', 'Series B', 'Growth', 'Late Stage'][Math.floor(Math.random() * 4)],
        dealSize: ['$5M', '$12M', '$25M', '$50M', '$100M'][Math.floor(Math.random() * 5)],
        screeningScore: Math.floor(Math.random() * 40) + 60,
        riskLevel: ['Low', 'Medium', 'High'][Math.floor(Math.random() * 3)]
      }

    case 'portfolio':
      return {
        ...baseMetadata,
        assetClass: ['Private Equity', 'Real Estate', 'Infrastructure', 'Credit', 'Venture'][Math.floor(Math.random() * 5)],
        aum: ['$150M', '$280M', '$420M', '$680M'][Math.floor(Math.random() * 4)],
        return_ytd: (Math.random() * 30 - 5).toFixed(1) + '%',
        riskScore: (Math.random() * 5 + 1).toFixed(1),
        esgScore: Math.floor(Math.random() * 40) + 60
      }

    case 'due-diligence':
      return {
        ...baseMetadata,
        companyName: ['TechCorp', 'HealthCo', 'GreenEnergy Inc.', 'DataSoft', 'BioMed Solutions'][Math.floor(Math.random() * 5)],
        ddType: ['Full DD', 'Focused DD', 'Management DD'][Math.floor(Math.random() * 3)],
        documentsReviewed: Math.floor(Math.random() * 150) + 50,
        findings: Math.floor(Math.random() * 20) + 5,
        riskRating: ['Low', 'Medium', 'High', 'Critical'][Math.floor(Math.random() * 4)]
      }

    case 'exit':
      return {
        ...baseMetadata,
        companyName: ['TechFlow Solutions', 'HealthTech Innovations', 'GreenEnergy Dynamics', 'DataCorp Analytics', 'BioVentures Inc.'][Math.floor(Math.random() * 5)],
        exitStrategy: ['Strategic Sale', 'IPO', 'Management Buyout', 'Secondary Sale'][Math.floor(Math.random() * 4)],
        currentValuation: ['$85M', '$150M', '$220M', '$340M'][Math.floor(Math.random() * 4)],
        targetValue: ['$120M', '$200M', '$280M', '$450M'][Math.floor(Math.random() * 4)],
        aiExitScore: Math.floor(Math.random() * 30) + 70,
        marketTiming: ['excellent', 'good', 'fair'][Math.floor(Math.random() * 3)],
        holdingPeriod: Math.floor(Math.random() * 4) + 2 + ' years',
        expectedIRR: (Math.random() * 15 + 15).toFixed(1) + '%',
        sector: ['Technology', 'Healthcare', 'Energy', 'Financial Services'][Math.floor(Math.random() * 4)]
      }

    default:
      return baseMetadata
  }
}

/**
 * Get autonomous configuration for a module
 */
export function getAutonomousConfig(moduleId: string): ModuleAutonomousConfig | null {
  return AUTONOMOUS_CONFIGS[moduleId] || null
}

/**
 * Get available actions for a module and project type
 */
export function getAvailableActions(moduleId: string, projectType?: string): AutonomousAction[] {
  const config = AUTONOMOUS_CONFIGS[moduleId]
  if (!config) return []

  if (!projectType) return config.availableActions

  const typeConfig = config.projectTypes.find(t => t.id === projectType)
  if (!typeConfig) return config.availableActions

  // Return actions relevant to the project type, with defaults first
  const defaultActions = config.availableActions.filter(action => 
    typeConfig.defaultActions.includes(action.id)
  )
  const otherActions = config.availableActions.filter(action => 
    !typeConfig.defaultActions.includes(action.id)
  )

  return [...defaultActions, ...otherActions]
}

/**
 * Generate context data for autonomous chat interface
 */
export function generateContextData(project: AutonomousProject): Record<string, any> {
  return {
    projectId: project.id,
    projectName: project.name,
    projectType: project.type,
    status: project.status,
    priority: project.priority,
    progress: project.progress,
    lastActivity: project.lastActivity,
    metadata: project.metadata,
    unreadMessages: project.unreadMessages
  }
}