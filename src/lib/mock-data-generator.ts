/**
 * Consistent Mock Data Generator
 * Generates realistic, consistent mock data across all DD-Hybrid modules
 */

import { MOCK_DATA, generateAIScore, formatCurrency } from './design-system';

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Generate consistent random number based on seed
 */
const seededRandom = (seed: string, min: number = 0, max: number = 100): number => {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  // Convert to normalized value between 0 and 1
  const normalized = Math.abs(hash) / 2147483648; // 2^31
  
  return min + (normalized * (max - min));
};

/**
 * Pick random item from array with seed for consistency
 */
const pickRandom = <T>(array: T[], seed: string): T => {
  const index = Math.floor(seededRandom(seed, 0, array.length));
  return array[index % array.length];
};

/**
 * Generate random date within range
 */
const randomDate = (seed: string, daysAgo: number = 30, daysForward: number = 30): Date => {
  const range = daysAgo + daysForward;
  const dayOffset = seededRandom(seed, -daysAgo, daysForward);
  const date = new Date();
  date.setDate(date.getDate() + dayOffset);
  return date;
};

/**
 * Generate realistic company name variations
 */
const generateCompanyVariation = (baseName: string, seed: string): string => {
  const suffixes = ['Corp', 'Inc', 'LLC', 'Ltd', 'Group', 'Holdings', 'Partners', 'Capital'];
  const prefixes = ['Global', 'Next', 'Future', 'Smart', 'Digital', 'Advanced', 'Premier'];
  
  const variation = Math.floor(seededRandom(seed, 0, 4));
  
  switch (variation) {
    case 0:
      return `${baseName} ${pickRandom(suffixes, seed)}`;
    case 1:
      return `${pickRandom(prefixes, seed)} ${baseName}`;
    case 2:
      return `${baseName} ${pickRandom(suffixes, seed)}`;
    default:
      return baseName;
  }
};

// =============================================================================
// BUSINESS DATA GENERATORS
// =============================================================================

/**
 * Generate financial metrics with realistic relationships
 */
export const generateFinancialMetrics = (seed: string) => {
  const revenue = seededRandom(`${seed}_revenue`, 10, 500) * 1000000; // $10M-500M
  const ebitdaMargin = seededRandom(`${seed}_ebitda`, 5, 35); // 5-35%
  const ebitda = revenue * (ebitdaMargin / 100);
  const growthRate = seededRandom(`${seed}_growth`, -10, 50); // -10% to 50%
  const irr = seededRandom(`${seed}_irr`, MOCK_DATA.ranges.irr.min, MOCK_DATA.ranges.irr.max);
  const multiple = seededRandom(`${seed}_multiple`, MOCK_DATA.ranges.multiple.min, MOCK_DATA.ranges.multiple.max);
  
  return {
    revenue,
    ebitda,
    ebitdaMargin,
    growthRate,
    irr,
    multiple,
    paybackPeriod: seededRandom(`${seed}_payback`, 3, 8),
    debtToEquity: seededRandom(`${seed}_debt`, 0.2, 2.5),
  };
};

/**
 * Generate AI-specific metrics
 */
export const generateAIMetrics = (seed: string) => {
  const confidence = seededRandom(`${seed}_confidence`, 65, 98);
  const accuracy = seededRandom(`${seed}_accuracy`, 75, 99);
  const timeSaved = seededRandom(`${seed}_time`, 1, 12);
  const efficiency = seededRandom(`${seed}_efficiency`, 15, 65);
  
  return {
    confidence: Math.round(confidence),
    accuracy: Math.round(accuracy * 10) / 10,
    timeSaved: Math.round(timeSaved * 10) / 10,
    efficiency: Math.round(efficiency),
    automationScore: generateAIScore(seed),
  };
};

// =============================================================================
// MODULE-SPECIFIC DATA GENERATORS
// =============================================================================

/**
 * Generate Investment Committee Proposals
 */
export const generateICProposals = (count: number = 5) => {
  return Array.from({ length: count }, (_, index) => {
    const id = `ic-proposal-${index + 1}`;
    const companyBase = pickRandom(MOCK_DATA.companies, `${id}_company`);
    const company = generateCompanyVariation(companyBase, id);
    const sector = pickRandom(MOCK_DATA.sectors, `${id}_sector`);
    const presenter = pickRandom(MOCK_DATA.teamMembers, `${id}_presenter`);
    const financials = generateFinancialMetrics(id);
    const aiMetrics = generateAIMetrics(id);
    
    const statuses = ['SUBMITTED', 'UNDER_REVIEW', 'APPROVED', 'REJECTED'] as const;
    const priorities = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] as const;
    
    return {
      id,
      proposalTitle: `${company} Growth Investment`,
      targetCompany: company,
      sector,
      requestedAmount: Math.round(seededRandom(`${id}_amount`, 5, 100) * 1000000),
      status: pickRandom(statuses, `${id}_status`),
      priority: pickRandom(priorities, `${id}_priority`),
      submittedAt: randomDate(`${id}_submitted`, 30, 0),
      meetingDate: randomDate(`${id}_meeting`, 0, 30),
      presentingPartner: presenter,
      projectedIRR: Math.round(financials.irr * 10) / 10,
      proposalType: 'GROWTH_EQUITY' as const,
      meetingId: `meeting-${Math.ceil(index / 2)}`,
      
      // AI Enhancement Data
      aiScore: aiMetrics.automationScore,
      aiConfidence: aiMetrics.confidence,
      aiInsights: [
        `Strong financial metrics with ${financials.growthRate.toFixed(1)}% YoY growth`,
        `Strategic fit score: ${aiMetrics.confidence}% alignment with portfolio`,
        `Risk assessment: ${seededRandom(`${id}_risk`, 1, 5) > 3 ? 'Medium' : 'Low'} based on market analysis`
      ],
      
      // Voting data
      committeeVotes: {
        for: Math.floor(seededRandom(`${id}_votes_for`, 0, 6)),
        against: Math.floor(seededRandom(`${id}_votes_against`, 0, 3)),
        abstain: Math.floor(seededRandom(`${id}_votes_abstain`, 0, 2)),
        total: 7
      },
      
      // Financial details
      keyMetrics: {
        irr: financials.irr,
        multiple: financials.multiple,
        paybackPeriod: financials.paybackPeriod
      },
      
      // Risk factors
      riskFactors: [
        'Market competition',
        'Regulatory changes', 
        seededRandom(`${id}_risk_factor`, 0, 1) > 0.5 ? 'Technology obsolescence' : 'Economic downturn'
      ]
    };
  });
};

/**
 * Generate Due Diligence Projects
 */
export const generateDDProjects = (count: number = 8) => {
  return Array.from({ length: count }, (_, index) => {
    const id = `dd-project-${index + 1}`;
    const companyBase = pickRandom(MOCK_DATA.companies, `${id}_company`);
    const company = generateCompanyVariation(companyBase, id);
    const sector = pickRandom(MOCK_DATA.sectors, `${id}_sector`);
    const leadPartner = pickRandom(MOCK_DATA.teamMembers, `${id}_lead`);
    const financials = generateFinancialMetrics(id);
    const aiMetrics = generateAIMetrics(id);
    
    const statuses = ['NOT_STARTED', 'IN_PROGRESS', 'PENDING_REVIEW', 'COMPLETED', 'FLAGGED'] as const;
    const types = ['GROWTH', 'BUYOUT', 'DISTRESSED', 'EXPANSION'] as const;
    
    const progress = seededRandom(`${id}_progress`, 10, 100);
    
    return {
      id,
      name: `${company} Due Diligence`,
      targetCompany: company,
      sector,
      dealSize: Math.round(seededRandom(`${id}_size`, 10, 200) * 1000000),
      status: pickRandom(statuses, `${id}_status`),
      type: pickRandom(types, `${id}_type`),
      leadPartner,
      progress: Math.round(progress),
      startDate: randomDate(`${id}_start`, 60, 0),
      targetCloseDate: randomDate(`${id}_close`, 0, 90),
      
      // AI Enhancement
      aiRiskScore: Math.round(seededRandom(`${id}_ai_risk`, 15, 85)),
      aiCompletionScore: aiMetrics.automationScore,
      
      // Team assignment
      teamMembers: MOCK_DATA.teamMembers.slice(0, Math.floor(seededRandom(`${id}_team`, 3, 6))),
      
      // Workstreams
      workstreams: [
        {
          name: 'Financial Analysis',
          progress: Math.round(seededRandom(`${id}_fin`, 20, 100)),
          status: progress > 80 ? 'COMPLETED' : 'IN_PROGRESS',
          assignee: pickRandom(MOCK_DATA.teamMembers, `${id}_fin_assignee`)
        },
        {
          name: 'Commercial Review',
          progress: Math.round(seededRandom(`${id}_comm`, 10, 90)),
          status: 'IN_PROGRESS',
          assignee: pickRandom(MOCK_DATA.teamMembers, `${id}_comm_assignee`)
        },
        {
          name: 'Management Assessment', 
          progress: Math.round(seededRandom(`${id}_mgmt`, 0, 80)),
          status: 'IN_PROGRESS',
          assignee: pickRandom(MOCK_DATA.teamMembers, `${id}_mgmt_assignee`)
        },
        {
          name: 'Legal & Regulatory',
          progress: Math.round(seededRandom(`${id}_legal`, 5, 75)),
          status: 'IN_PROGRESS',
          assignee: pickRandom(MOCK_DATA.teamMembers, `${id}_legal_assignee`)
        }
      ],
      
      // Key findings
      keyFindings: [
        `Revenue growth: ${financials.growthRate.toFixed(1)}% CAGR`,
        `EBITDA margin: ${financials.ebitdaMargin.toFixed(1)}%`,
        `Market position: ${seededRandom(`${id}_market`, 0, 1) > 0.6 ? 'Leading' : 'Strong competitor'}`
      ],
      
      // Risk flags
      riskFlags: Math.floor(seededRandom(`${id}_flags`, 0, 4)),
      highPriorityItems: Math.floor(seededRandom(`${id}_priority`, 1, 8))
    };
  });
};

/**
 * Generate Portfolio Companies
 */
export const generatePortfolioCompanies = (count: number = 12) => {
  return Array.from({ length: count }, (_, index) => {
    const id = `portfolio-${index + 1}`;
    const companyBase = pickRandom(MOCK_DATA.companies, `${id}_company`);
    const company = generateCompanyVariation(companyBase, id);
    const sector = pickRandom(MOCK_DATA.sectors, `${id}_sector`);
    const boardRep = pickRandom(MOCK_DATA.teamMembers, `${id}_board`);
    const financials = generateFinancialMetrics(id);
    const aiMetrics = generateAIMetrics(id);
    
    const statuses = ['PERFORMING', 'OUTPERFORMING', 'UNDERPERFORMING', 'DISTRESSED'] as const;
    const stages = ['SEED', 'SERIES_A', 'SERIES_B', 'GROWTH', 'MATURE'] as const;
    
    const investmentDate = randomDate(`${id}_invested`, 1800, 0); // Up to 5 years ago
    const holdingPeriod = Math.floor((new Date().getTime() - investmentDate.getTime()) / (1000 * 60 * 60 * 24 * 365));
    
    return {
      id,
      name: company,
      sector,
      status: pickRandom(statuses, `${id}_status`),
      stage: pickRandom(stages, `${id}_stage`),
      investmentDate,
      holdingPeriod,
      
      // Investment details
      originalInvestment: Math.round(seededRandom(`${id}_investment`, 5, 150) * 1000000),
      currentValuation: Math.round(seededRandom(`${id}_valuation`, 8, 300) * 1000000),
      ownershipPercentage: Math.round(seededRandom(`${id}_ownership`, 5, 45) * 10) / 10,
      
      // Board and team
      boardRepresentative: boardRep,
      ceo: generateCompanyVariation(pickRandom(MOCK_DATA.teamMembers, `${id}_ceo`), `${id}_ceo_name`),
      
      // Performance metrics
      revenueGrowth: Math.round(financials.growthRate * 10) / 10,
      ebitdaMargin: Math.round(financials.ebitdaMargin * 10) / 10,
      currentMultiple: Math.round(financials.multiple * 10) / 10,
      
      // AI Performance Analysis
      aiPerformanceScore: aiMetrics.automationScore,
      aiRiskAssessment: seededRandom(`${id}_ai_risk`, 1, 10) > 7 ? 'High' : seededRandom(`${id}_ai_risk`, 1, 10) > 4 ? 'Medium' : 'Low',
      
      // Key metrics
      keyMetrics: {
        revenue: Math.round(seededRandom(`${id}_revenue`, 5, 200) * 1000000),
        employees: Math.round(seededRandom(`${id}_employees`, 25, 1500)),
        customers: Math.round(seededRandom(`${id}_customers`, 50, 10000)),
        nps: Math.round(seededRandom(`${id}_nps`, 30, 80))
      },
      
      // Recent activities
      recentActivities: [
        `Q4 revenue: ${formatCurrency(financials.revenue / 4)}`,
        `New product launch scheduled for ${randomDate(`${id}_launch`, 0, 120).toLocaleDateString()}`,
        `Board meeting: ${randomDate(`${id}_board_meeting`, 0, 30).toLocaleDateString()}`
      ]
    };
  });
};

/**
 * Generate Deal Screening Opportunities
 */
export const generateDealOpportunities = (count: number = 15) => {
  return Array.from({ length: count }, (_, index) => {
    const id = `deal-${index + 1}`;
    const companyBase = pickRandom(MOCK_DATA.companies, `${id}_company`);
    const company = generateCompanyVariation(companyBase, id);
    const sector = pickRandom(MOCK_DATA.sectors, `${id}_sector`);
    const source = pickRandom(['Investment Bank', 'Direct Outreach', 'Network', 'Referral'], `${id}_source`);
    const financials = generateFinancialMetrics(id);
    const aiMetrics = generateAIMetrics(id);
    
    const statuses = ['NEW', 'SCREENING', 'ANALYZED', 'APPROVED', 'REJECTED', 'ON_HOLD'] as const;
    const stages = ['SEED', 'SERIES_A', 'GROWTH', 'BUYOUT'] as const;
    
    return {
      id,
      companyName: company,
      sector,
      dealSize: Math.round(seededRandom(`${id}_size`, 5, 300) * 1000000),
      status: pickRandom(statuses, `${id}_status`),
      stage: pickRandom(stages, `${id}_stage`),
      source,
      submittedDate: randomDate(`${id}_submitted`, 45, 0),
      
      // AI Scoring
      aiScore: aiMetrics.automationScore,
      aiConfidence: aiMetrics.confidence,
      marketFitScore: Math.round(seededRandom(`${id}_market_fit`, 40, 95)),
      teamScore: Math.round(seededRandom(`${id}_team`, 50, 90)),
      financialScore: Math.round(seededRandom(`${id}_financial`, 35, 95)),
      
      // Basic financials
      revenue: Math.round(financials.revenue / 1000000),
      growthRate: Math.round(financials.growthRate * 10) / 10,
      ebitdaMargin: Math.round(financials.ebitdaMargin * 10) / 10,
      
      // Contact information
      contactPerson: pickRandom(MOCK_DATA.teamMembers, `${id}_contact`),
      ownerAnalyst: pickRandom(MOCK_DATA.teamMembers, `${id}_analyst`),
      
      // Geography
      region: pickRandom(MOCK_DATA.regions, `${id}_region`),
      
      // Key highlights
      keyHighlights: [
        `${financials.growthRate.toFixed(0)}% revenue CAGR`,
        `${financials.ebitdaMargin.toFixed(0)}% EBITDA margin`,
        `Market leader in ${sector.toLowerCase()}`
      ]
    };
  });
};

/**
 * Generate Legal Documents
 */
export const generateLegalDocuments = (count: number = 20) => {
  const categories = ['Contracts', 'Fund Documents', 'Compliance', 'Legal Opinions', 'Due Diligence', 'Investment Documents'];
  const statuses = ['DRAFT', 'UNDER_REVIEW', 'APPROVED', 'EXECUTED', 'EXPIRED'] as const;
  const priorities = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] as const;
  const riskLevels = ['LOW', 'MEDIUM', 'HIGH'] as const;
  
  return Array.from({ length: count }, (_, index) => {
    const id = `legal-doc-${index + 1}`;
    const category = pickRandom(categories, `${id}_category`);
    const companyBase = pickRandom(MOCK_DATA.companies, `${id}_company`);
    const company = generateCompanyVariation(companyBase, id);
    const assignee = pickRandom(MOCK_DATA.teamMembers, `${id}_assignee`);
    const aiMetrics = generateAIMetrics(id);
    
    const docTypes = {
      'Contracts': ['Service Agreement', 'Master Agreement', 'NDA', 'Employment Agreement'],
      'Fund Documents': ['Limited Partnership Agreement', 'Operating Agreement', 'Subscription Agreement'],
      'Compliance': ['Regulatory Filing', 'Compliance Report', 'ESG Assessment'],
      'Legal Opinions': ['Tax Opinion', 'Regulatory Opinion', 'Structure Memo'],
      'Due Diligence': ['DD Report', 'Legal DD Summary', 'Risk Assessment'],
      'Investment Documents': ['Term Sheet', 'Investment Agreement', 'Shareholders Agreement']
    };
    
    const docType = pickRandom(docTypes[category as keyof typeof docTypes] || ['Document'], `${id}_type`);
    
    return {
      id,
      title: `${docType} - ${company}`,
      category,
      status: pickRandom(statuses, `${id}_status`),
      priority: pickRandom(priorities, `${id}_priority`),
      riskLevel: pickRandom(riskLevels, `${id}_risk`),
      assignedTo: assignee,
      lastModified: randomDate(`${id}_modified`, 30, 0),
      deadline: Math.random() > 0.3 ? randomDate(`${id}_deadline`, 0, 60) : undefined,
      confidentiality: pickRandom(['Internal', 'Confidential', 'Highly Confidential'], `${id}_confidential`),
      complianceStatus: pickRandom(['Compliant', 'Under Review', 'Non-Compliant'], `${id}_compliance`),
      
      // AI Enhancement
      aiRiskScore: Math.round(seededRandom(`${id}_ai_risk`, 10, 90)),
      aiComplianceScore: aiMetrics.automationScore,
      
      // Contract details (for contracts)
      contractValue: category === 'Contracts' ? formatCurrency(seededRandom(`${id}_value`, 100000, 50000000)) : undefined,
      
      // Key terms and risk factors
      keyTerms: [
        'Termination clause',
        'IP ownership',
        seededRandom(`${id}_term`, 0, 1) > 0.5 ? 'Liability cap' : 'Indemnification'
      ],
      riskFactors: [
        category === 'Contracts' ? 'Unlimited liability exposure' : 'Regulatory compliance',
        seededRandom(`${id}_risk_factor`, 0, 1) > 0.5 ? 'Broad indemnification' : 'Jurisdiction issues'
      ]
    };
  });
};

/**
 * Generate Fund Operations Data
 */
export const generateFundOperations = (count: number = 10) => {
  const operationTypes = ['Capital Call', 'Distribution', 'Management Fee', 'Expense Reimbursement', 'Valuation Update'];
  const statuses = ['PENDING', 'PROCESSING', 'COMPLETED', 'FAILED'] as const;
  const priorities = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] as const;
  
  return Array.from({ length: count }, (_, index) => {
    const id = `fund-op-${index + 1}`;
    const operationType = pickRandom(operationTypes, `${id}_type`);
    const assignee = pickRandom(MOCK_DATA.teamMembers, `${id}_assignee`);
    const aiMetrics = generateAIMetrics(id);
    
    const amount = seededRandom(`${id}_amount`, 100000, 50000000);
    const progress = seededRandom(`${id}_progress`, 0, 100);
    
    return {
      id,
      type: operationType,
      description: `${operationType} - Q${Math.ceil(Math.random() * 4)} 2024`,
      amount: Math.round(amount),
      status: pickRandom(statuses, `${id}_status`),
      priority: pickRandom(priorities, `${id}_priority`),
      assignedTo: assignee,
      dueDate: randomDate(`${id}_due`, 0, 60),
      createdDate: randomDate(`${id}_created`, 30, 0),
      progress: Math.round(progress),
      
      // AI Enhancement
      aiEfficiencyScore: aiMetrics.automationScore,
      estimatedCompletion: randomDate(`${id}_completion`, 0, 30),
      
      // Related entities
      affectedInvestors: Math.floor(seededRandom(`${id}_investors`, 5, 150)),
      relatedFund: `Growth Fund ${pickRandom(['III', 'IV', 'V'], `${id}_fund`)}`,
      
      // Processing details
      approvalRequired: seededRandom(`${id}_approval`, 0, 1) > 0.7,
      documentsRequired: Math.floor(seededRandom(`${id}_docs`, 2, 8)),
      
      // Financial details
      netAmount: Math.round(amount * (1 - seededRandom(`${id}_fees`, 0.01, 0.05))),
      processingFee: Math.round(amount * seededRandom(`${id}_processing_fee`, 0.001, 0.01))
    };
  });
};

// =============================================================================
// AI RECOMMENDATIONS GENERATOR
// =============================================================================

/**
 * Generate AI Recommendations for any module
 */
export const generateAIRecommendations = (
  moduleContext: string, 
  count: number = 5
) => {
  const types = ['suggestion', 'automation', 'warning', 'insight', 'optimization'] as const;
  const priorities = ['low', 'medium', 'high', 'critical'] as const;
  
  const recommendationTemplates = {
    'Investment Committee': [
      {
        title: 'Optimize Committee Scheduling',
        description: 'AI suggests scheduling the next committee meeting on Tuesday to maximize attendance based on historical patterns.',
        type: 'suggestion' as const,
        actions: [{ id: 'schedule-meeting', label: 'Schedule Now', action: 'schedule_optimal_meeting' }]
      },
      {
        title: 'Pre-screening Automation',
        description: 'Enable AI pre-screening for new proposals to reduce committee workload by 40%.',
        type: 'automation' as const,
        actions: [{ id: 'enable-screening', label: 'Enable AI Screening', action: 'enable_ai_prescreening', primary: true }]
      },
      {
        title: 'Risk Pattern Detected',
        description: 'AI identified similar risk patterns in 3 current proposals that may require additional review.',
        type: 'warning' as const,
        actions: [{ id: 'review-risks', label: 'Review Patterns', action: 'analyze_risk_patterns' }]
      }
    ],
    'Deal Screening': [
      {
        title: 'Market Timing Opportunity',
        description: 'AI analysis suggests this is an optimal time to increase deal flow in the Technology sector.',
        type: 'insight' as const,
        actions: [{ id: 'increase-sourcing', label: 'Adjust Sourcing', action: 'optimize_deal_sourcing' }]
      },
      {
        title: 'Scoring Model Enhancement',
        description: 'Retrain the AI scoring model with recent deal outcomes to improve accuracy by ~15%.',
        type: 'optimization' as const,
        actions: [{ id: 'retrain-model', label: 'Retrain Model', action: 'retrain_scoring_model', primary: true }]
      }
    ],
    'Due Diligence': [
      {
        title: 'Document Analysis Complete',
        description: 'AI has processed all uploaded documents and identified 3 potential red flags requiring attention.',
        type: 'insight' as const,
        actions: [{ id: 'review-flags', label: 'Review Flags', action: 'review_dd_flags', primary: true }]
      },
      {
        title: 'Workflow Optimization',
        description: 'Automate document categorization and initial review to save ~6 hours per project.',
        type: 'automation' as const,
        actions: [{ id: 'enable-automation', label: 'Enable Automation', action: 'enable_dd_automation' }]
      }
    ],
    'Portfolio': [
      {
        title: 'Performance Alert',
        description: 'AI detected performance decline in 2 portfolio companies based on latest financial updates.',
        type: 'warning' as const,
        actions: [{ id: 'investigate', label: 'Investigate', action: 'investigate_performance_decline' }]
      },
      {
        title: 'Exit Opportunity',
        description: 'Market conditions suggest optimal exit timing for 3 mature portfolio investments.',
        type: 'insight' as const,
        actions: [{ id: 'evaluate-exits', label: 'Evaluate Exits', action: 'evaluate_exit_opportunities', primary: true }]
      }
    ],
    'Legal Management': [
      {
        title: 'Contract Review Automation',
        description: 'AI can now auto-review standard NDAs and service agreements, reducing review time by 70%.',
        type: 'automation' as const,
        actions: [{ id: 'enable-review', label: 'Enable Auto-Review', action: 'enable_contract_automation' }]
      },
      {
        title: 'Compliance Deadline Warning',
        description: 'Upcoming regulatory filing deadline in 15 days requires immediate attention.',
        type: 'warning' as const,
        actions: [{ id: 'prepare-filing', label: 'Prepare Filing', action: 'prepare_regulatory_filing', primary: true }]
      }
    ],
    'Fund Operations': [
      {
        title: 'Cash Flow Optimization',
        description: 'AI suggests optimizing capital call timing to improve fund cash flow efficiency.',
        type: 'optimization' as const,
        actions: [{ id: 'optimize-timing', label: 'Optimize Timing', action: 'optimize_capital_calls' }]
      },
      {
        title: 'Process Automation',
        description: 'Automate distribution calculations and investor reporting to save 8 hours monthly.',
        type: 'automation' as const,
        actions: [{ id: 'automate-distributions', label: 'Enable Automation', action: 'automate_distributions', primary: true }]
      }
    ]
  };
  
  const templates = recommendationTemplates[moduleContext as keyof typeof recommendationTemplates] || [];
  
  return Array.from({ length: Math.min(count, templates.length) }, (_, index) => {
    const template = templates[index % templates.length];
    const id = `${moduleContext.toLowerCase().replace(/\s/g, '_')}_rec_${index + 1}`;
    const confidence = seededRandom(`${id}_confidence`, 0.7, 0.98);
    
    return {
      id,
      type: template.type,
      priority: pickRandom(priorities, `${id}_priority`),
      title: template.title,
      description: template.description,
      confidence,
      moduleContext,
      timestamp: randomDate(`${id}_timestamp`, 7, 0),
      estimatedTimeSaving: Math.floor(seededRandom(`${id}_time_saving`, 1, 12)),
      estimatedImpact: `${Math.floor(seededRandom(`${id}_impact`, 10, 50))}% efficiency improvement`,
      actions: template.actions || [],
      reasoning: `Based on analysis of ${Math.floor(seededRandom(`${id}_data_points`, 100, 1000))} data points and historical patterns, AI recommends this action with ${Math.round(confidence * 100)}% confidence.`
    };
  });
};

// =============================================================================
// COMPREHENSIVE MODULE DATA GENERATOR
// =============================================================================

/**
 * Generate complete dataset for any module
 */
export const generateModuleData = (moduleName: string) => {
  const baseMetrics = {
    totalItems: 0,
    activeItems: 0,
    completedItems: 0,
    efficiency: Math.floor(seededRandom(`${moduleName}_efficiency`, 65, 95)),
    aiAccuracy: Math.floor(seededRandom(`${moduleName}_ai_accuracy`, 85, 98)),
    timeSaved: Math.floor(seededRandom(`${moduleName}_time_saved`, 2, 15)),
  };

  switch (moduleName.toLowerCase()) {
    case 'investment_committee':
    case 'investment-committee':
      const proposals = generateICProposals(8);
      return {
        proposals,
        recommendations: generateAIRecommendations('Investment Committee', 3),
        metrics: {
          ...baseMetrics,
          totalProposals: proposals.length,
          activeProposals: proposals.filter(p => p.status === 'UNDER_REVIEW').length,
          approvedProposals: proposals.filter(p => p.status === 'APPROVED').length,
          rejectedProposals: proposals.filter(p => p.status === 'REJECTED').length,
          averageDecisionTime: Math.floor(seededRandom('ic_decision_time', 8, 18)),
          approvalRate: Math.floor(seededRandom('ic_approval_rate', 65, 85)),
        }
      };

    case 'deal_screening':
    case 'deal-screening':
      const opportunities = generateDealOpportunities(12);
      return {
        opportunities,
        recommendations: generateAIRecommendations('Deal Screening', 4),
        metrics: {
          ...baseMetrics,
          totalDeals: opportunities.length,
          activeDeals: opportunities.filter(o => ['SCREENING', 'ANALYZED'].includes(o.status)).length,
          approvedDeals: opportunities.filter(o => o.status === 'APPROVED').length,
          averageScreeningTime: Math.floor(seededRandom('ds_screening_time', 3, 10)),
          conversionRate: Math.floor(seededRandom('ds_conversion', 8, 25)),
        }
      };

    case 'due_diligence':
    case 'due-diligence':
      const projects = generateDDProjects(6);
      return {
        projects,
        recommendations: generateAIRecommendations('Due Diligence', 3),
        metrics: {
          ...baseMetrics,
          totalProjects: projects.length,
          activeProjects: projects.filter(p => p.status === 'IN_PROGRESS').length,
          completedProjects: projects.filter(p => p.status === 'COMPLETED').length,
          averageProjectTime: Math.floor(seededRandom('dd_project_time', 45, 90)),
          riskFlagsIdentified: Math.floor(seededRandom('dd_risk_flags', 15, 45)),
        }
      };

    case 'portfolio':
      const companies = generatePortfolioCompanies(10);
      return {
        companies,
        recommendations: generateAIRecommendations('Portfolio', 3),
        metrics: {
          ...baseMetrics,
          totalCompanies: companies.length,
          performingCompanies: companies.filter(c => ['PERFORMING', 'OUTPERFORMING'].includes(c.status)).length,
          totalValue: companies.reduce((sum, c) => sum + c.currentValuation, 0),
          averageHoldingPeriod: Math.floor(seededRandom('portfolio_holding', 2, 6)),
          averageMultiple: Math.round(seededRandom('portfolio_multiple', 1.8, 4.2) * 10) / 10,
        }
      };

    case 'legal_management':
    case 'legal-management':
      const documents = generateLegalDocuments(15);
      return {
        documents,
        recommendations: generateAIRecommendations('Legal Management', 3),
        metrics: {
          ...baseMetrics,
          totalDocuments: documents.length,
          activeDocuments: documents.filter(d => ['DRAFT', 'UNDER_REVIEW'].includes(d.status)).length,
          pendingReview: documents.filter(d => d.status === 'UNDER_REVIEW').length,
          overdueDocuments: documents.filter(d => d.deadline && d.deadline < new Date()).length,
          complianceScore: Math.floor(seededRandom('legal_compliance', 88, 98)),
        }
      };

    case 'fund_operations':
    case 'fund-operations':
      const operations = generateFundOperations(8);
      return {
        operations,
        recommendations: generateAIRecommendations('Fund Operations', 2),
        metrics: {
          ...baseMetrics,
          totalOperations: operations.length,
          pendingOperations: operations.filter(o => o.status === 'PENDING').length,
          completedOperations: operations.filter(o => o.status === 'COMPLETED').length,
          totalValue: operations.reduce((sum, o) => sum + o.amount, 0),
          automationRate: Math.floor(seededRandom('fund_ops_automation', 45, 85)),
        }
      };

    default:
      return {
        items: [],
        recommendations: [],
        metrics: baseMetrics
      };
  }
};

export default {
  generateICProposals,
  generateDDProjects,
  generatePortfolioCompanies,
  generateDealOpportunities,
  generateLegalDocuments,
  generateFundOperations,
  generateAIRecommendations,
  generateModuleData,
  generateFinancialMetrics,
  generateAIMetrics,
  seededRandom,
  pickRandom
};