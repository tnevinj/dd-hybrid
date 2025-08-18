/**
 * Smart Templates with Real Data Integration
 * Templates that bind to actual project/portfolio/deal data to minimize hallucinations
 */

import { SmartTemplate, TemplateSection, DataBinding, SectionValidationRule } from '@/types/work-product';

// Due Diligence Report Template
export const DUE_DILIGENCE_TEMPLATE: SmartTemplate = {
  id: 'dd-comprehensive-v1',
  name: 'Comprehensive Due Diligence Report',
  description: 'Complete due diligence report with automated data integration from deal database',
  category: 'due-diligence',
  industryFocus: ['Technology', 'Healthcare', 'Manufacturing', 'Financial Services'],
  dealStages: ['due-diligence', 'investment-committee', 'negotiation'],
  workProductType: 'DD_REPORT',
  
  sections: [
    {
      id: 'exec-summary',
      title: 'Executive Summary',
      description: 'High-level overview of the investment opportunity',
      order: 1,
      required: true,
      type: 'text',
      generationStrategy: 'data-driven',
      aiPrompt: `Generate an executive summary for the {PROJECT_NAME} investment opportunity based on the following real data:
      
      Deal Information:
      - Company: {PROJECT_NAME}
      - Sector: {SECTOR}
      - Deal Value: {DEAL_VALUE}
      - Stage: {DEAL_STAGE}
      - Geography: {GEOGRAPHY}
      - Risk Rating: {RISK_RATING}
      
      Financial Metrics:
      - Current Value: {CURRENT_VALUE}
      - IRR: {IRR}
      - MOIC: {MOIC}
      - Revenue: {REVENUE}
      
      Focus on factual analysis based on the provided data. Include key investment highlights, financial performance summary, and strategic rationale. Do not include speculative statements.`,
      dataBindings: [
        {
          id: 'deal-basic-info',
          sourceType: 'deal-metrics',
          sourceId: 'primary',
          fieldMapping: {
            'name': 'PROJECT_NAME',
            'sector': 'SECTOR',
            'dealValue': 'DEAL_VALUE',
            'stage': 'DEAL_STAGE',
            'geography': 'GEOGRAPHY',
            'riskRating': 'RISK_RATING'
          },
          transformationRules: [
            {
              id: 'format-deal-value',
              type: 'format',
              sourceField: 'dealValue',
              targetField: 'DEAL_VALUE',
              operation: 'currency_millions',
              parameters: { currency: 'USD', precision: 1 }
            }
          ],
          refreshPolicy: 'on-demand'
        },
        {
          id: 'financial-metrics',
          sourceType: 'financial-model',
          sourceId: 'primary',
          fieldMapping: {
            'currentValue': 'CURRENT_VALUE',
            'irr': 'IRR',
            'moic': 'MOIC',
            'revenue': 'REVENUE'
          },
          transformationRules: [
            {
              id: 'format-irr',
              type: 'format',
              sourceField: 'irr',
              targetField: 'IRR',
              operation: 'percentage',
              parameters: { precision: 1 }
            }
          ],
          refreshPolicy: 'on-demand'
        }
      ],
      validationRules: [
        {
          id: 'completeness-check',
          type: 'completeness',
          description: 'Ensure all key deal metrics are included',
          severity: 'error',
          validationFunction: 'validateKeyMetricsPresent',
          parameters: { requiredFields: ['PROJECT_NAME', 'DEAL_VALUE', 'SECTOR', 'IRR'] }
        }
      ],
      estimatedLength: 300,
      dependencies: []
    },
    
    {
      id: 'investment-thesis',
      title: 'Investment Thesis',
      description: 'Strategic rationale for the investment',
      order: 2,
      required: true,
      type: 'text',
      generationStrategy: 'data-driven',
      aiPrompt: `Develop an investment thesis for {PROJECT_NAME} based on real market and company data:
      
      Company Profile:
      - Name: {PROJECT_NAME}
      - Sector: {SECTOR}
      - Geography: {GEOGRAPHY}
      - Business Stage: {DEAL_STAGE}
      
      Market Position:
      - Market Share: {MARKET_SHARE}
      - Competitive Position: {COMPETITIVE_POSITION}
      - Growth Rate: {GROWTH_RATE}
      
      Team & Operations:
      - Team Size: {TEAM_SIZE}
      - Key Team Members: {TEAM_MEMBERS}
      - Operational Excellence Score: {OPERATIONAL_SCORE}
      
      Generate a data-driven investment thesis focusing on: market opportunity, competitive advantages, value creation potential, and alignment with our investment criteria. Base recommendations on actual metrics provided.`,
      dataBindings: [
        {
          id: 'company-profile',
          sourceType: 'deal-metrics',
          sourceId: 'primary',
          fieldMapping: {
            'name': 'PROJECT_NAME',
            'sector': 'SECTOR',
            'geography': 'GEOGRAPHY',
            'stage': 'DEAL_STAGE',
            'marketShare': 'MARKET_SHARE',
            'competitivePosition': 'COMPETITIVE_POSITION',
            'growthRate': 'GROWTH_RATE'
          },
          transformationRules: [],
          refreshPolicy: 'on-demand'
        },
        {
          id: 'team-data',
          sourceType: 'team-data',
          sourceId: 'primary',
          fieldMapping: {
            'teamSize': 'TEAM_SIZE',
            'teamMembers': 'TEAM_MEMBERS',
            'operationalScore': 'OPERATIONAL_SCORE'
          },
          transformationRules: [],
          refreshPolicy: 'on-demand'
        }
      ],
      validationRules: [],
      estimatedLength: 500,
      dependencies: ['exec-summary']
    },

    {
      id: 'financial-analysis',
      title: 'Financial Analysis & Projections',
      description: 'Detailed financial assessment based on actual data',
      order: 3,
      required: true,
      type: 'financial_block',
      generationStrategy: 'data-driven',
      aiPrompt: `Create a comprehensive financial analysis for {PROJECT_NAME} using the following actual financial data:
      
      Historical Performance:
      - Revenue (Last 3 Years): {HISTORICAL_REVENUE}
      - EBITDA: {EBITDA}
      - EBITDA Margin: {EBITDA_MARGIN}
      - Growth Rate: {REVENUE_GROWTH}
      
      Current Metrics:
      - Current Valuation: {CURRENT_VALUE}
      - Revenue Multiple: {REVENUE_MULTIPLE}
      - EBITDA Multiple: {EBITDA_MULTIPLE}
      
      Projections:
      - Projected IRR: {PROJECTED_IRR}
      - Target Multiple: {TARGET_MULTIPLE}
      - Hold Period: {HOLD_PERIOD}
      
      Analyze trends, benchmark against industry standards, and provide evidence-based projections. Include sensitivity analysis based on the actual data ranges.`,
      dataBindings: [
        {
          id: 'financial-historical',
          sourceType: 'financial-model',
          sourceId: 'historical',
          fieldMapping: {
            'revenue': 'HISTORICAL_REVENUE',
            'ebitda': 'EBITDA',
            'ebitdaMargin': 'EBITDA_MARGIN',
            'revenueGrowth': 'REVENUE_GROWTH'
          },
          transformationRules: [
            {
              id: 'format-revenue-array',
              type: 'format',
              sourceField: 'revenue',
              targetField: 'HISTORICAL_REVENUE',
              operation: 'currency_array',
              parameters: { currency: 'USD', years: 3 }
            }
          ],
          refreshPolicy: 'on-demand'
        },
        {
          id: 'financial-projections',
          sourceType: 'financial-model',
          sourceId: 'projections',
          fieldMapping: {
            'currentValue': 'CURRENT_VALUE',
            'revenueMultiple': 'REVENUE_MULTIPLE',
            'ebitdaMultiple': 'EBITDA_MULTIPLE',
            'projectedIRR': 'PROJECTED_IRR',
            'targetMultiple': 'TARGET_MULTIPLE',
            'holdPeriod': 'HOLD_PERIOD'
          },
          transformationRules: [],
          refreshPolicy: 'on-demand'
        }
      ],
      validationRules: [
        {
          id: 'financial-consistency',
          type: 'consistency',
          description: 'Verify financial metrics are internally consistent',
          severity: 'error',
          validationFunction: 'validateFinancialConsistency',
          parameters: { tolerance: 0.05 }
        }
      ],
      estimatedLength: 600,
      dependencies: ['investment-thesis']
    },

    {
      id: 'risk-assessment',
      title: 'Risk Assessment & Mitigation',
      description: 'Data-driven risk analysis',
      order: 4,
      required: true,
      type: 'text',
      generationStrategy: 'data-driven',
      aiPrompt: `Conduct a comprehensive risk assessment for {PROJECT_NAME} based on actual risk data:
      
      Risk Profile:
      - Overall Risk Rating: {RISK_RATING}
      - Market Risk Score: {MARKET_RISK}
      - Operational Risk Score: {OPERATIONAL_RISK}
      - Financial Risk Score: {FINANCIAL_RISK}
      
      Sector-Specific Risks ({SECTOR}):
      - Regulatory Risk: {REGULATORY_RISK}
      - Technology Risk: {TECHNOLOGY_RISK}
      - Competitive Risk: {COMPETITIVE_RISK}
      
      Historical Risk Events: {RISK_EVENTS}
      
      Risk Mitigation Measures in Place: {MITIGATION_MEASURES}
      
      Provide evidence-based risk assessment with specific mitigation strategies. Reference actual risk events and current mitigation measures.`,
      dataBindings: [
        {
          id: 'risk-scores',
          sourceType: 'risk-assessment',
          sourceId: 'primary',
          fieldMapping: {
            'overallRisk': 'RISK_RATING',
            'marketRisk': 'MARKET_RISK',
            'operationalRisk': 'OPERATIONAL_RISK',
            'financialRisk': 'FINANCIAL_RISK',
            'regulatoryRisk': 'REGULATORY_RISK',
            'technologyRisk': 'TECHNOLOGY_RISK',
            'competitiveRisk': 'COMPETITIVE_RISK'
          },
          transformationRules: [],
          refreshPolicy: 'on-demand'
        },
        {
          id: 'risk-events',
          sourceType: 'risk-assessment',
          sourceId: 'historical',
          fieldMapping: {
            'riskEvents': 'RISK_EVENTS',
            'mitigationMeasures': 'MITIGATION_MEASURES'
          },
          transformationRules: [],
          refreshPolicy: 'on-demand'
        }
      ],
      validationRules: [],
      estimatedLength: 400,
      dependencies: ['financial-analysis']
    },

    {
      id: 'recommendations',
      title: 'Investment Recommendation',
      description: 'Data-driven investment decision',
      order: 5,
      required: true,
      type: 'text',
      generationStrategy: 'data-driven',
      aiPrompt: `Provide investment recommendation for {PROJECT_NAME} based on comprehensive data analysis:
      
      Investment Summary:
      - Deal Value: {DEAL_VALUE}
      - Projected IRR: {PROJECTED_IRR}
      - Risk-Adjusted Return: {RISK_ADJUSTED_RETURN}
      - Confidence Score: {CONFIDENCE_SCORE}
      
      Key Metrics Performance:
      - Above/Below Hurdle Rate: {HURDLE_COMPARISON}
      - Industry Benchmark Performance: {BENCHMARK_PERFORMANCE}
      - Portfolio Fit Score: {PORTFOLIO_FIT}
      
      Decision Factors:
      - Investment Committee Score: {IC_SCORE}
      - Due Diligence Findings: {DD_FINDINGS}
      
      Provide clear PROCEED/DECLINE recommendation with specific data-backed reasoning. Include implementation timeline and key milestones.`,
      dataBindings: [
        {
          id: 'investment-metrics',
          sourceType: 'deal-metrics',
          sourceId: 'final',
          fieldMapping: {
            'dealValue': 'DEAL_VALUE',
            'projectedIRR': 'PROJECTED_IRR',
            'riskAdjustedReturn': 'RISK_ADJUSTED_RETURN',
            'confidenceScore': 'CONFIDENCE_SCORE',
            'hurdleComparison': 'HURDLE_COMPARISON',
            'benchmarkPerformance': 'BENCHMARK_PERFORMANCE',
            'portfolioFit': 'PORTFOLIO_FIT'
          },
          transformationRules: [],
          refreshPolicy: 'on-demand'
        }
      ],
      validationRules: [
        {
          id: 'recommendation-completeness',
          type: 'completeness',
          description: 'Ensure recommendation includes all required decision factors',
          severity: 'error',
          validationFunction: 'validateRecommendationCompleteness',
          parameters: { requiredElements: ['decision', 'rationale', 'timeline', 'risks'] }
        }
      ],
      estimatedLength: 300,
      dependencies: ['risk-assessment']
    }
  ],

  dynamicFields: [
    {
      id: 'focus-areas',
      name: 'Focus Areas',
      type: 'multiselect',
      required: false,
      options: ['Financial Performance', 'Market Position', 'Technology Assessment', 'Management Team', 'Regulatory Compliance'],
      description: 'Select specific areas to emphasize in the report'
    },
    {
      id: 'confidentiality-level',
      name: 'Confidentiality Level',
      type: 'select',
      required: true,
      defaultValue: 'Confidential',
      options: ['Public', 'Internal', 'Confidential', 'Highly Confidential'],
      description: 'Set the appropriate confidentiality classification'
    }
  ],

  conditionalLogic: [
    {
      id: 'tech-section-conditional',
      condition: 'SECTOR === "Technology"',
      action: 'add-section',
      parameters: { sectionId: 'technology-assessment' }
    }
  ],

  aiGenerationPrompts: {
    'executive-summary': 'Generate a concise executive summary based on real deal data',
    'financial-analysis': 'Create detailed financial analysis using actual performance metrics',
    'risk-assessment': 'Develop comprehensive risk assessment based on quantified risk scores'
  },

  dataIntegrationPoints: [
    {
      id: 'deal-database',
      type: 'database',
      source: 'deal_opportunities',
      refreshRate: 'on-demand',
      fields: ['name', 'sector', 'dealValue', 'stage', 'riskRating']
    },
    {
      id: 'financial-model',
      type: 'spreadsheet',
      source: 'financial_projections',
      refreshRate: 'real-time',
      fields: ['irr', 'moic', 'revenue', 'ebitda']
    }
  ],

  contentValidationRules: [
    {
      id: 'data-accuracy',
      type: 'accuracy',
      description: 'Verify all financial figures match source data',
      severity: 'error',
      validationFunction: 'validateDataAccuracy',
      parameters: { tolerance: 0.01 }
    }
  ],

  version: '1.0',
  createdBy: 'system',
  createdAt: new Date(),
  updatedAt: new Date(),
  usageCount: 0,
  successRate: 0.95,
  averageQualityScore: 0.87,
  tags: ['due-diligence', 'comprehensive', 'data-driven', 'investment-committee']
};

// Investment Committee Memo Template
export const IC_MEMO_TEMPLATE: SmartTemplate = {
  id: 'ic-memo-v1',
  name: 'Investment Committee Memo',
  description: 'Concise IC memo with key metrics and recommendation',
  category: 'investment-memo',
  industryFocus: ['All'],
  dealStages: ['investment-committee', 'final-approval'],
  workProductType: 'IC_MEMO',
  
  sections: [
    {
      id: 'deal-summary',
      title: 'Deal Summary',
      order: 1,
      required: true,
      type: 'text',
      generationStrategy: 'data-driven',
      aiPrompt: `Create a concise deal summary for Investment Committee review:
      
      Deal Overview:
      - Company: {PROJECT_NAME}
      - Sector: {SECTOR}
      - Investment Amount: {DEAL_VALUE}
      - Ownership %: {OWNERSHIP_PERCENTAGE}
      
      Key Metrics:
      - Projected IRR: {PROJECTED_IRR}
      - Target Multiple: {TARGET_MULTIPLE}
      - Payback Period: {PAYBACK_PERIOD}
      
      Transaction Structure: {TRANSACTION_STRUCTURE}
      
      Keep summary to 150 words maximum. Focus on decision-critical information.`,
      dataBindings: [
        {
          id: 'ic-deal-data',
          sourceType: 'deal-metrics',
          sourceId: 'ic-ready',
          fieldMapping: {
            'name': 'PROJECT_NAME',
            'sector': 'SECTOR',
            'dealValue': 'DEAL_VALUE',
            'ownershipPercentage': 'OWNERSHIP_PERCENTAGE',
            'projectedIRR': 'PROJECTED_IRR',
            'targetMultiple': 'TARGET_MULTIPLE',
            'paybackPeriod': 'PAYBACK_PERIOD',
            'transactionStructure': 'TRANSACTION_STRUCTURE'
          },
          transformationRules: [],
          refreshPolicy: 'on-demand'
        }
      ],
      validationRules: [],
      estimatedLength: 150
    }
  ],

  dynamicFields: [],
  conditionalLogic: [],
  aiGenerationPrompts: {},
  dataIntegrationPoints: [],
  contentValidationRules: [],

  version: '1.0',
  createdBy: 'system',
  createdAt: new Date(),
  updatedAt: new Date(),
  usageCount: 0,
  successRate: 0.92,
  averageQualityScore: 0.89,
  tags: ['investment-committee', 'memo', 'concise', 'decision-support']
};

// Portfolio Assessment Template
export const PORTFOLIO_ANALYSIS_TEMPLATE: SmartTemplate = {
  id: 'portfolio-analysis-v1',
  name: 'Portfolio Performance Analysis',
  description: 'Comprehensive portfolio analysis with real performance data',
  category: 'financial-analysis',
  industryFocus: ['All'],
  dealStages: ['monitoring', 'review', 'exit-planning'],
  workProductType: 'MARKET_ANALYSIS',
  
  sections: [
    {
      id: 'portfolio-overview',
      title: 'Portfolio Overview',
      order: 1,
      required: true,
      type: 'financial_block',
      generationStrategy: 'data-driven',
      aiPrompt: `Generate portfolio overview using actual performance data:
      
      Portfolio Composition:
      - Total Assets: {TOTAL_ASSETS}
      - Asset Classes: {ASSET_CLASSES}
      - Geographic Distribution: {GEOGRAPHIC_DISTRIBUTION}
      - Sector Allocation: {SECTOR_ALLOCATION}
      
      Performance Metrics:
      - Portfolio IRR: {PORTFOLIO_IRR}
      - Total Return: {TOTAL_RETURN}
      - Unrealized Gains: {UNREALIZED_GAINS}
      - Realized Gains: {REALIZED_GAINS}
      
      Risk Metrics:
      - Portfolio Risk Score: {PORTFOLIO_RISK}
      - Volatility: {VOLATILITY}
      - ESG Score: {ESG_SCORE}
      
      Provide data-driven analysis of portfolio performance and composition.`,
      dataBindings: [
        {
          id: 'portfolio-composition',
          sourceType: 'deal-metrics',
          sourceId: 'portfolio',
          fieldMapping: {
            'totalAssets': 'TOTAL_ASSETS',
            'assetClasses': 'ASSET_CLASSES',
            'geographicDistribution': 'GEOGRAPHIC_DISTRIBUTION',
            'sectorAllocation': 'SECTOR_ALLOCATION'
          },
          transformationRules: [],
          refreshPolicy: 'real-time'
        },
        {
          id: 'portfolio-performance',
          sourceType: 'financial-model',
          sourceId: 'portfolio',
          fieldMapping: {
            'portfolioIRR': 'PORTFOLIO_IRR',
            'totalReturn': 'TOTAL_RETURN',
            'unrealizedGains': 'UNREALIZED_GAINS',
            'realizedGains': 'REALIZED_GAINS',
            'portfolioRisk': 'PORTFOLIO_RISK',
            'volatility': 'VOLATILITY',
            'esgScore': 'ESG_SCORE'
          },
          transformationRules: [],
          refreshPolicy: 'real-time'
        }
      ],
      validationRules: [],
      estimatedLength: 400
    }
  ],

  dynamicFields: [],
  conditionalLogic: [],
  aiGenerationPrompts: {},
  dataIntegrationPoints: [],
  contentValidationRules: [],

  version: '1.0',
  createdBy: 'system',
  createdAt: new Date(),
  updatedAt: new Date(),
  usageCount: 0,
  successRate: 0.90,
  averageQualityScore: 0.85,
  tags: ['portfolio', 'performance', 'real-time-data', 'analytics']
};

// Export all templates
export const SMART_TEMPLATES = [
  DUE_DILIGENCE_TEMPLATE,
  IC_MEMO_TEMPLATE,
  PORTFOLIO_ANALYSIS_TEMPLATE
];

// Template selection helper
export function getTemplatesByCategory(category: string) {
  return SMART_TEMPLATES.filter(template => template.category === category);
}

export function getTemplatesByIndustry(industry: string) {
  return SMART_TEMPLATES.filter(template => 
    template.industryFocus.includes(industry) || template.industryFocus.includes('All')
  );
}

export function getTemplatesByStage(stage: string) {
  return SMART_TEMPLATES.filter(template => template.dealStages.includes(stage));
}