/**
 * Data Seeding Service for Unified Data Layer
 * Creates consistent, correlated data across all modules
 * Replaces fragmented mock data with unified entities
 */

import { 
  unifiedDataStore, 
  Company, 
  Deal, 
  DueDiligenceProject, 
  InvestmentCommitteeProposal, 
  PortfolioInvestment,
  generateConsistentId 
} from './unified-data-layer';
import { generateAIScore, formatCurrency } from '../design-system';

// =============================================================================
// SEED DATA TEMPLATES
// =============================================================================

const COMPANY_TEMPLATES = [
  {
    name: 'TechCorp Alpha',
    sector: 'Technology',
    description: 'AI-powered enterprise software platform for supply chain optimization',
    website: 'https://techcorp-alpha.com',
    headquarters: 'San Francisco, CA',
    foundedYear: 2018,
    employeeCount: 125,
    ceo: 'Sarah Chen',
    cfo: 'Michael Rodriguez',
    cto: 'Lisa Wong',
    founders: ['Sarah Chen', 'David Kim']
  },
  {
    name: 'HealthTech Solutions',
    sector: 'Healthcare',
    description: 'Digital health platform for remote patient monitoring and telemedicine',
    website: 'https://healthtech-solutions.com',
    headquarters: 'Boston, MA',
    foundedYear: 2019,
    employeeCount: 89,
    ceo: 'Dr. Jennifer Martinez',
    cfo: 'Robert Taylor',
    cto: 'Emily Rodriguez',
    founders: ['Dr. Jennifer Martinez', 'James Wilson']
  },
  {
    name: 'FinServ Innovations',
    sector: 'Financial Services',
    description: 'Next-generation digital banking platform with AI-powered risk assessment',
    website: 'https://finserv-innovations.com',
    headquarters: 'New York, NY',
    foundedYear: 2017,
    employeeCount: 156,
    ceo: 'Alex Thompson',
    cfo: 'Lisa Park',
    cto: 'Mark Anderson',
    founders: ['Alex Thompson', 'Ashley Brown']
  },
  {
    name: 'GreenTech Manufacturing',
    sector: 'Industrial',
    description: 'Sustainable manufacturing solutions with IoT-enabled production optimization',
    website: 'https://greentech-manufacturing.com',
    headquarters: 'Austin, TX',
    foundedYear: 2016,
    employeeCount: 234,
    ceo: 'Robert Steel',
    cfo: 'Maria Gonzalez',
    cto: 'David Kim',
    founders: ['Robert Steel', 'Maria Gonzalez']
  },
  {
    name: 'DataFlow Systems',
    sector: 'Technology',
    description: 'Real-time data analytics and business intelligence platform',
    website: 'https://dataflow-systems.com',
    headquarters: 'Seattle, WA',
    foundedYear: 2020,
    employeeCount: 67,
    ceo: 'Jennifer Liu',
    cfo: 'Michael Chen',
    cto: 'Rachel Martinez',
    founders: ['Jennifer Liu', 'Michael Chen']
  },
  {
    name: 'CloudCorp Enterprise',
    sector: 'Technology',
    description: 'Multi-cloud infrastructure management and security platform',
    website: 'https://cloudcorp-enterprise.com',
    headquarters: 'Palo Alto, CA',
    foundedYear: 2019,
    employeeCount: 98,
    ceo: 'David Kim',
    cfo: 'Emily Rodriguez',
    cto: 'James Wilson',
    founders: ['David Kim', 'Emily Rodriguez']
  }
];

const TEAM_MEMBERS = [
  'Sarah Johnson', 'Michael Chen', 'Rachel Martinez', 'David Kim',
  'Alex Thompson', 'Emily Rodriguez', 'James Wilson', 'Lisa Park',
  'Robert Taylor', 'Jennifer Liu', 'Mark Anderson', 'Ashley Brown'
];

// =============================================================================
// SEEDING FUNCTIONS
// =============================================================================

/**
 * Generate consistent financial data based on company stage and sector
 */
function generateFinancialData(companyTemplate: typeof COMPANY_TEMPLATES[0], stage: string) {
  const baseRevenue = {
    'seed': 50000000, // $500K
    'series_a': 200000000, // $2M
    'series_b': 800000000, // $8M
    'growth': 2500000000, // $25M
    'mature': 10000000000 // $100M
  }[stage] || 500000000;

  const sectorMultipliers = {
    'Technology': 1.2,
    'Healthcare': 1.0,
    'Financial Services': 1.5,
    'Industrial': 0.8,
    'Energy': 1.1
  };

  const multiplier = sectorMultipliers[companyTemplate.sector as keyof typeof sectorMultipliers] || 1.0;
  const revenue = Math.floor(baseRevenue * multiplier * (0.8 + Math.random() * 0.4));
  
  const ebitdaMargin = 10 + Math.random() * 25; // 10-35%
  const ebitda = Math.floor(revenue * (ebitdaMargin / 100));
  const revenueGrowthRate = 15 + Math.random() * 85; // 15-100% growth

  return {
    revenue,
    revenueGrowthRate,
    ebitda,
    ebitdaMargin,
    grossMargin: 60 + Math.random() * 30, // 60-90%
    netIncome: Math.floor(ebitda * (0.6 + Math.random() * 0.3)), // 60-90% of EBITDA
    lastUpdated: new Date()
  };
}

/**
 * Generate valuation data based on financial metrics
 */
function generateValuationData(financials: ReturnType<typeof generateFinancialData>, stage: string) {
  const revenueMultiples = {
    'seed': 8,
    'series_a': 12,
    'series_b': 15,
    'growth': 8,
    'mature': 5
  };

  const multiple = revenueMultiples[stage as keyof typeof revenueMultiples] || 8;
  const currentValuation = Math.floor(financials.revenue * multiple * (0.8 + Math.random() * 0.4));
  
  return {
    currentValuation,
    lastRoundValuation: currentValuation,
    pricePerShare: Math.floor(currentValuation / (1000000 + Math.random() * 9000000)), // 1-10M shares
    sharesOutstanding: 1000000 + Math.floor(Math.random() * 9000000),
    lastUpdated: new Date()
  };
}

/**
 * Seed companies with consistent data
 */
export function seedCompanies(): Company[] {
  const companies: Company[] = [];
  
  for (const template of COMPANY_TEMPLATES) {
    const stage = ['series_a', 'series_b', 'growth'][Math.floor(Math.random() * 3)];
    const financials = generateFinancialData(template, stage);
    const valuation = generateValuationData(financials, stage);
    
    const company: Company = {
      id: generateConsistentId('company', template.name),
      name: template.name,
      sector: template.sector,
      description: template.description,
      website: template.website,
      headquarters: template.headquarters,
      foundedYear: template.foundedYear,
      employeeCount: template.employeeCount,
      financials,
      valuation,
      team: {
        ceo: template.ceo,
        cfo: template.cfo,
        cto: template.cto,
        founders: template.founders,
        keyPersonnel: [
          { name: template.ceo, title: 'CEO', tenure: 3 + Math.random() * 5 },
          { name: template.cfo || 'CFO Name', title: 'CFO', tenure: 2 + Math.random() * 4 },
          { name: template.cto || 'CTO Name', title: 'CTO', tenure: 2 + Math.random() * 4 }
        ]
      },
      createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000), // Random date within last year
      updatedAt: new Date(),
      tags: [template.sector.toLowerCase(), stage],
      notes: `Seeded company data for ${template.name}`
    };
    
    companies.push(company);
    unifiedDataStore.addCompany(company);
  }
  
  return companies;
}

/**
 * Seed deals based on companies with proper workflow stages
 */
export function seedDeals(companies: Company[]): Deal[] {
  const deals: Deal[] = [];
  const dealStages: Deal['stage'][] = ['screening', 'due_diligence', 'investment_committee', 'negotiation', 'completed'];
  const dealTypes: Deal['type'][] = ['growth', 'series_b', 'series_c', 'buyout'];
  
  // Create 1-2 deals per company at different stages
  for (const company of companies) {
    const numDeals = 1 + Math.floor(Math.random() * 2); // 1-2 deals per company
    
    for (let i = 0; i < numDeals; i++) {
      const stage = dealStages[Math.floor(Math.random() * dealStages.length)]!;
      const dealType = dealTypes[Math.floor(Math.random() * dealTypes.length)]!;
      
      // Deal size should correlate with company valuation
      const dealSizeRatio = 0.1 + Math.random() * 0.3; // 10-40% of valuation
      const dealSize = Math.floor((company.valuation.currentValuation || company.financials.revenue * 8) * dealSizeRatio);
      const investmentAmount = Math.floor(dealSize * (0.3 + Math.random() * 0.4)); // 30-70% of deal size
      const ownershipPercentage = (investmentAmount / (company.valuation.currentValuation || dealSize * 3)) * 100;
      
      const projectedIRR = 15 + Math.random() * 25; // 15-40% IRR
      const projectedMultiple = 2 + Math.random() * 3; // 2-5x multiple
      
      const deal: Deal = {
        id: generateConsistentId('deal', `${company.name}_${dealType}_${i}`),
        companyId: company.id,
        name: `${company.name} ${dealType.charAt(0).toUpperCase() + dealType.slice(1)} Investment`,
        type: dealType,
        dealSize,
        investmentAmount,
        ownershipPercentage: Math.min(ownershipPercentage, 45), // Cap at 45%
        pricePerShare: company.valuation.pricePerShare || Math.floor(dealSize / 1000000),
        stage,
        status: stage === 'completed' ? 'completed' : 'active',
        sourceDate: new Date(Date.now() - Math.random() * 180 * 24 * 60 * 60 * 1000), // Last 6 months
        screeningStartDate: stage !== 'sourcing' ? new Date(Date.now() - Math.random() * 150 * 24 * 60 * 60 * 1000) : undefined,
        dueDiligenceStartDate: ['due_diligence', 'investment_committee', 'negotiation', 'completed'].includes(stage) ? 
          new Date(Date.now() - Math.random() * 120 * 24 * 60 * 60 * 1000) : undefined,
        investmentCommitteeDate: ['investment_committee', 'negotiation', 'completed'].includes(stage) ?
          new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000) : undefined,
        expectedCloseDate: new Date(Date.now() + Math.random() * 90 * 24 * 60 * 60 * 1000), // Next 3 months
        actualCloseDate: stage === 'completed' ? new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000) : undefined,
        leadPartner: TEAM_MEMBERS[Math.floor(Math.random() * TEAM_MEMBERS.length)],
        dealTeam: TEAM_MEMBERS.slice(0, 2 + Math.floor(Math.random() * 3)), // 2-4 team members
        projections: {
          projectedIRR,
          projectedMultiple,
          paybackPeriod: 3 + Math.random() * 4, // 3-7 years
          riskRating: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as 'low' | 'medium' | 'high'
        },
        aiAnalysis: {
          overallScore: 65 + Math.random() * 30, // 65-95 score
          marketFitScore: 70 + Math.random() * 25,
          teamScore: 75 + Math.random() * 20,
          financialScore: 60 + Math.random() * 35,
          riskScore: 20 + Math.random() * 60,
          lastAnalyzed: new Date(),
          keyInsights: [
            `Strong revenue growth of ${company.financials.revenueGrowthRate.toFixed(1)}% YoY`,
            `Market-leading position in ${company.sector.toLowerCase()}`,
            `Experienced management team with proven track record`
          ],
          riskFactors: [
            'Market competition intensifying',
            'Regulatory changes in sector',
            'Key person dependency risk'
          ]
        },
        source: ['investment_bank', 'direct_outreach', 'network', 'referral'][Math.floor(Math.random() * 4)] as Deal['source'],
        sourceDetails: 'Sourced through professional network',
        createdAt: new Date(Date.now() - Math.random() * 180 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(),
        tags: [company.sector.toLowerCase(), dealType, stage],
        notes: `${dealType} investment opportunity in ${company.name}`
      };
      
      deals.push(deal);
      unifiedDataStore.addDeal(deal);
    }
  }
  
  return deals;
}

/**
 * Seed due diligence projects for deals in appropriate stages
 */
export function seedDueDiligenceProjects(deals: Deal[]): DueDiligenceProject[] {
  const projects: DueDiligenceProject[] = [];
  
  // Create DD projects for deals in due_diligence, investment_committee, or completed stages
  const eligibleDeals = deals.filter(deal => 
    ['due_diligence', 'investment_committee', 'negotiation', 'completed'].includes(deal.stage)
  );
  
  for (const deal of eligibleDeals) {
    const company = unifiedDataStore.getCompany(deal.companyId);
    if (!company) continue;
    
    const progress = deal.stage === 'completed' ? 100 : 
                    deal.stage === 'investment_committee' ? 85 + Math.random() * 15 :
                    deal.stage === 'negotiation' ? 95 + Math.random() * 5 :
                    30 + Math.random() * 50; // due_diligence stage
    
    const status: DueDiligenceProject['status'] = 
      deal.stage === 'completed' ? 'completed' :
      deal.stage === 'investment_committee' || deal.stage === 'negotiation' ? 'pending_review' :
      'in_progress';
    
    const project: DueDiligenceProject = {
      id: generateConsistentId('dd_project', `${deal.name}_dd`),
      dealId: deal.id,
      companyId: deal.companyId,
      name: `${company.name} Due Diligence`,
      status,
      progress: Math.floor(progress),
      startDate: deal.dueDiligenceStartDate || new Date(),
      targetCompletionDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days from now
      actualCompletionDate: status === 'completed' ? new Date() : undefined,
      projectLead: deal.leadPartner,
      teamMembers: deal.dealTeam,
      workstreams: [
        {
          id: 'financial',
          name: 'Financial Analysis',
          category: 'financial',
          status: progress > 80 ? 'completed' : progress > 40 ? 'in_progress' : 'not_started',
          progress: Math.min(progress + 10, 100),
          assignee: deal.dealTeam[0] || deal.leadPartner,
          dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          findings: [
            `Revenue: ${formatCurrency(company.financials.revenue)} with ${company.financials.revenueGrowthRate.toFixed(1)}% growth`,
            `EBITDA margin: ${company.financials.ebitdaMargin.toFixed(1)}%`,
            'Strong unit economics and scalable business model'
          ],
          riskFlags: []
        },
        {
          id: 'commercial',
          name: 'Commercial Review',
          category: 'commercial',
          status: progress > 70 ? 'completed' : progress > 30 ? 'in_progress' : 'not_started',
          progress: Math.min(progress, 100),
          assignee: deal.dealTeam[1] || deal.leadPartner,
          dueDate: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000),
          findings: [
            `Market size: $${(Math.random() * 50 + 10).toFixed(1)}B TAM`,
            'Strong competitive positioning',
            'Diversified customer base with low concentration risk'
          ],
          riskFlags: []
        },
        {
          id: 'management',
          name: 'Management Assessment',
          category: 'management',
          status: progress > 60 ? 'completed' : progress > 20 ? 'in_progress' : 'not_started',
          progress: Math.min(progress - 10, 100),
          assignee: deal.dealTeam[2] || deal.leadPartner,
          dueDate: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000),
          findings: [
            'Experienced leadership team with relevant industry background',
            'Strong track record of execution and value creation',
            'Clear succession planning and talent development'
          ],
          riskFlags: progress < 70 ? [{
            severity: 'medium' as const,
            description: 'Key person dependency on CEO',
            impact: 'Operational risk if CEO departs',
            mitigation: 'Implement retention package and succession planning'
          }] : []
        },
        {
          id: 'legal',
          name: 'Legal & Regulatory',
          category: 'legal',
          status: progress > 50 ? 'completed' : progress > 10 ? 'in_progress' : 'not_started',
          progress: Math.min(progress - 20, 100),
          assignee: deal.dealTeam[3] || deal.leadPartner,
          dueDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
          findings: [
            'Clean legal structure with no material issues',
            'Compliance with all relevant regulations',
            'Strong IP portfolio and protection'
          ],
          riskFlags: []
        }
      ],
      keyFindings: [
        `Strong financial performance with ${company.financials.revenueGrowthRate.toFixed(1)}% revenue growth`,
        `Market-leading position in ${company.sector.toLowerCase()} sector`,
        'Experienced management team with proven execution capability',
        'Scalable business model with strong unit economics'
      ],
      riskFlags: [
        {
          id: 'market_risk',
          severity: 'medium',
          category: 'Market',
          description: 'Increasing competition in core market',
          impact: 'Potential margin pressure and market share loss',
          mitigation: 'Accelerate product development and market expansion',
          status: 'open'
        }
      ],
      recommendation: progress > 85 ? 'proceed' : progress > 70 ? 'proceed_with_conditions' : 'more_analysis_needed',
      recommendationRationale: progress > 85 ? 
        'Strong investment opportunity with attractive risk-adjusted returns' :
        progress > 70 ?
        'Good investment opportunity with some conditions to address' :
        'Requires additional analysis in key areas',
      aiInsights: {
        riskScore: 20 + Math.random() * 40, // 20-60 risk score
        completionScore: progress,
        qualityScore: 80 + Math.random() * 15, // 80-95 quality score
        lastAnalyzed: new Date(),
        automatedFindings: [
          'Financial metrics exceed industry benchmarks',
          'Management team scores highly on leadership assessment',
          'Market opportunity validated through third-party research'
        ],
        suggestedActions: [
          'Complete reference checks for key management',
          'Finalize commercial due diligence interviews',
          'Review final legal documentation'
        ]
      },
      createdAt: deal.dueDiligenceStartDate || new Date(),
      updatedAt: new Date(),
      tags: [company.sector.toLowerCase(), 'due_diligence', status],
      notes: `Due diligence project for ${company.name} investment`
    };
    
    projects.push(project);
    unifiedDataStore.addDueDiligenceProject(project);
  }
  
  return projects;
}

/**
 * Seed investment committee proposals for deals in appropriate stages
 */
export function seedInvestmentCommitteeProposals(deals: Deal[], ddProjects: DueDiligenceProject[]): InvestmentCommitteeProposal[] {
  const proposals: InvestmentCommitteeProposal[] = [];
  
  // Create IC proposals for deals in investment_committee, negotiation, or completed stages
  const eligibleDeals = deals.filter(deal => 
    ['investment_committee', 'negotiation', 'completed'].includes(deal.stage)
  );
  
  for (const deal of eligibleDeals) {
    const company = unifiedDataStore.getCompany(deal.companyId);
    const ddProject = ddProjects.find(p => p.dealId === deal.id);
    if (!company) continue;
    
    const status: InvestmentCommitteeProposal['status'] = 
      deal.stage === 'completed' ? 'approved' :
      deal.stage === 'negotiation' ? 'approved' :
      ['submitted', 'under_review', 'scheduled'][Math.floor(Math.random() * 3)] as InvestmentCommitteeProposal['status'];
    
    const votesFor = status === 'approved' ? 5 + Math.floor(Math.random() * 2) : Math.floor(Math.random() * 7);
    const votesAgainst = status === 'approved' ? Math.floor(Math.random() * 2) : 1 + Math.floor(Math.random() * 3);
    const abstentions = Math.floor(Math.random() * 2);
    
    const proposal: InvestmentCommitteeProposal = {
      id: generateConsistentId('ic_proposal', `${deal.name}_ic`),
      dealId: deal.id,
      dueDiligenceProjectId: ddProject?.id,
      companyId: deal.companyId,
      title: `${company.name} Growth Investment Proposal`,
      proposalType: 'new_investment',
      requestedAmount: deal.investmentAmount,
      status,
      priority: deal.projections.riskRating === 'high' ? 'high' : 
               deal.projections.riskRating === 'low' ? 'medium' : 'medium',
      submittedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
      meetingDate: status !== 'submitted' ? new Date(Date.now() + Math.random() * 14 * 24 * 60 * 60 * 1000) : undefined,
      decisionDate: status === 'approved' ? new Date() : undefined,
      presentingPartner: deal.leadPartner,
      supportingTeam: deal.dealTeam,
      investmentThesis: `${company.name} is a market-leading ${company.sector.toLowerCase()} company with strong growth prospects and experienced management team. The investment offers attractive risk-adjusted returns with significant upside potential.`,
      keyInvestmentHighlights: [
        `Strong revenue growth of ${company.financials.revenueGrowthRate.toFixed(1)}% YoY`,
        `Market-leading position with ${company.employeeCount}+ employees`,
        `Experienced management team led by ${company.team.ceo}`,
        `Projected ${deal.projections.projectedIRR.toFixed(1)}% IRR and ${deal.projections.projectedMultiple.toFixed(1)}x multiple`
      ],
      keyRisks: [
        'Market competition and potential margin pressure',
        'Key person dependency risks',
        'Regulatory changes in the sector',
        'Economic downturn impact on customer demand'
      ],
      financialSummary: {
        currentRevenue: company.financials.revenue,
        revenueGrowth: company.financials.revenueGrowthRate,
        ebitdaMargin: company.financials.ebitdaMargin,
        projectedIRR: deal.projections.projectedIRR,
        projectedMultiple: deal.projections.projectedMultiple,
        paybackPeriod: deal.projections.paybackPeriod
      },
      voting: {
        totalMembers: 7,
        votesFor,
        votesAgainst,
        abstentions,
        requiredMajority: 4,
        votingComplete: status === 'approved' || status === 'rejected',
        individualVotes: status === 'approved' || status === 'rejected' ? [
          { member: 'John Smith', vote: 'for', comments: 'Strong investment opportunity' },
          { member: 'Jane Doe', vote: 'for', comments: 'Excellent management team' },
          { member: 'Bob Johnson', vote: votesAgainst > 0 ? 'against' : 'for', comments: votesAgainst > 0 ? 'Concerns about market timing' : 'Good strategic fit' }
        ] : undefined
      },
      decision: status === 'approved' ? {
        outcome: 'approved',
        conditions: [
          'Complete final legal documentation review',
          'Finalize management retention packages',
          'Establish board observer rights'
        ],
        rationale: 'Strong investment opportunity with attractive returns and experienced management team',
        nextSteps: [
          'Proceed to final negotiations',
          'Complete legal documentation',
          'Schedule closing within 30 days'
        ]
      } : undefined,
      aiAnalysis: {
        recommendationScore: 75 + Math.random() * 20, // 75-95 score
        riskAssessment: 25 + Math.random() * 30, // 25-55 risk score
        marketTimingScore: 70 + Math.random() * 25, // 70-95 timing score
        portfolioFitScore: 80 + Math.random() * 15, // 80-95 fit score
        lastAnalyzed: new Date(),
        keyInsights: [
          'Financial metrics significantly exceed industry benchmarks',
          'Management team has strong track record of value creation',
          'Market timing is favorable for this sector',
          'Investment aligns well with portfolio strategy'
        ]
      },
      createdAt: new Date(Date.now() - Math.random() * 45 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(),
      tags: [company.sector.toLowerCase(), 'investment_committee', status],
      notes: `Investment committee proposal for ${company.name}`
    };
    
    proposals.push(proposal);
    unifiedDataStore.addInvestmentCommitteeProposal(proposal);
  }
  
  return proposals;
}

/**
 * Seed portfolio investments for completed deals
 */
export function seedPortfolioInvestments(deals: Deal[]): PortfolioInvestment[] {
  const investments: PortfolioInvestment[] = [];
  
  // Create portfolio investments for completed deals
  const completedDeals = deals.filter(deal => deal.stage === 'completed');
  
  for (const deal of completedDeals) {
    const company = unifiedDataStore.getCompany(deal.companyId);
    if (!company || !deal.actualCloseDate) continue;
    
    const holdingPeriod = (Date.now() - deal.actualCloseDate.getTime()) / (365 * 24 * 60 * 60 * 1000);
    const currentMultiple = 1 + (holdingPeriod * (deal.projections.projectedIRR / 100));
    const currentValuation = Math.floor(deal.investmentAmount * currentMultiple);
    const unrealizedGain = currentValuation - deal.investmentAmount;
    const currentIRR = holdingPeriod > 0 ? Math.pow(currentMultiple, 1/holdingPeriod) * 100 - 100 : 0;
    
    const investment: PortfolioInvestment = {
      id: generateConsistentId('portfolio', `${company.name}_investment`),
      companyId: deal.companyId,
      dealId: deal.id,
      investmentDate: deal.actualCloseDate,
      originalInvestment: deal.investmentAmount,
      currentValuation,
      ownershipPercentage: deal.ownershipPercentage,
      securityType: 'preferred',
      sharesOwned: Math.floor(deal.investmentAmount / deal.pricePerShare),
      liquidationPreference: 1.0,
      performance: {
        currentMultiple,
        unrealizedGain,
        irr: currentIRR,
        holdingPeriod,
        lastValuationDate: new Date()
      },
      companyMetrics: {
        revenue: company.financials.revenue,
        revenueGrowth: company.financials.revenueGrowthRate,
        ebitda: company.financials.ebitda,
        ebitdaMargin: company.financials.ebitdaMargin,
        employeeCount: company.employeeCount || 100,
        customerCount: Math.floor(50 + Math.random() * 500),
        nps: Math.floor(40 + Math.random() * 50), // 40-90 NPS
        lastUpdated: new Date()
      },
      status: 'active' as const,
      stage: 'growth' as const,
      boardRepresentative: deal.leadPartner,
      boardObserver: deal.dealTeam[0] || deal.leadPartner,
      nextBoardMeeting: new Date(Date.now() + Math.random() * 90 * 24 * 60 * 60 * 1000),
      exitStrategy: {
        preferredExitType: ['ipo', 'strategic_sale', 'financial_sale'][Math.floor(Math.random() * 3)] as 'ipo' | 'strategic_sale' | 'financial_sale',
        targetExitDate: new Date(Date.now() + (3 + Math.random() * 4) * 365 * 24 * 60 * 60 * 1000), // 3-7 years
        targetMultiple: 3 + Math.random() * 4, // 3-7x target
        targetIRR: 20 + Math.random() * 20, // 20-40% target IRR
        exitPreparationStatus: 'not_started' as const
      },
      aiMonitoring: {
        performanceScore: 70 + Math.random() * 25, // 70-95 performance score
        riskScore: 15 + Math.random() * 35, // 15-50 risk score
        exitReadinessScore: 30 + Math.random() * 40, // 30-70 exit readiness
        lastAnalyzed: new Date(),
        alerts: [
          {
            type: 'performance' as const,
            severity: 'medium' as const,
            message: `Revenue growth of ${company.financials.revenueGrowthRate.toFixed(1)}% exceeds projections`,
            createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
          }
        ],
        recommendations: [
          'Consider accelerating growth initiatives',
          'Evaluate additional market expansion opportunities',
          'Strengthen management team for scale'
        ]
      },
      recentActivities: [
        {
          date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
          type: 'board_meeting' as const,
          description: 'Quarterly board meeting - reviewed financial performance and strategic initiatives',
          impact: 'positive' as const
        },
        {
          date: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000),
          type: 'financial_update' as const,
          description: `Q4 revenue of ${formatCurrency(company.financials.revenue / 4)} exceeded projections`,
          impact: 'positive' as const
        },
        {
          date: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000),
          type: 'milestone' as const,
          description: 'Achieved key product milestone and customer acquisition target',
          impact: 'positive' as const
        }
      ],
      createdAt: deal.actualCloseDate,
      updatedAt: new Date(),
      tags: [company.sector.toLowerCase(), 'portfolio', 'active'],
      notes: `Portfolio investment in ${company.name} - tracking performance and exit opportunities`
    };
    
    investments.push(investment);
    unifiedDataStore.addPortfolioInvestment(investment);
  }
  
  return investments;
}

/**
 * Master seeding function - creates all correlated data
 */
export function seedAllData(): {
  companies: Company[];
  deals: Deal[];
  dueDiligenceProjects: DueDiligenceProject[];
  investmentCommitteeProposals: InvestmentCommitteeProposal[];
  portfolioInvestments: PortfolioInvestment[];
} {
  // Clear existing data
  unifiedDataStore.clearAll();
  
  console.log('🌱 Seeding unified data layer...');
  
  // Seed in proper order to maintain relationships
  const companies = seedCompanies();
  console.log(`✅ Seeded ${companies.length} companies`);
  
  const deals = seedDeals(companies);
  console.log(`✅ Seeded ${deals.length} deals`);
  
  const dueDiligenceProjects = seedDueDiligenceProjects(deals);
  console.log(`✅ Seeded ${dueDiligenceProjects.length} due diligence projects`);
  
  const investmentCommitteeProposals = seedInvestmentCommitteeProposals(deals, dueDiligenceProjects);
  console.log(`✅ Seeded ${investmentCommitteeProposals.length} investment committee proposals`);
  
  const portfolioInvestments = seedPortfolioInvestments(deals);
  console.log(`✅ Seeded ${portfolioInvestments.length} portfolio investments`);
  
  // Validate data consistency
  const issues = unifiedDataStore.validateDataConsistency();
  if (issues.length > 0) {
    console.warn('⚠️ Data consistency issues found:', issues);
  } else {
    console.log('✅ Data consistency validation passed');
  }
  
  // Log metrics
  const metrics = unifiedDataStore.getMetrics();
  console.log('📊 Seeded data metrics:', {
    companies: companies.length,
    deals: metrics.deals.total,
    dueDiligence: metrics.dueDiligence.total,
    investmentCommittee: metrics.investmentCommittee.total,
    portfolio: metrics.portfolio.total,
    totalValue: formatCurrency(metrics.portfolio.totalValue),
    averageIRR: `${metrics.portfolio.averageIRR.toFixed(1)}%`
  });
  
  return {
    companies,
    deals,
    dueDiligenceProjects,
    investmentCommitteeProposals,
    portfolioInvestments
  };
}

/**
 * Get seeded data for specific module
 */
export function getModuleData(moduleName: string) {
  const metrics = unifiedDataStore.getMetrics();
  
  switch (moduleName.toLowerCase()) {
    case 'deal_screening':
    case 'deal-screening':
      return {
        opportunities: unifiedDataStore.getDealsByStage('screening'),
        allDeals: unifiedDataStore.getAllDeals(),
        metrics: {
          totalOpportunities: metrics.deals.total,
          activeScreenings: metrics.deals.byStage.screening,
          completedScreenings: metrics.deals.byStage.completed,
          averageScreeningTime: '8 days',
          conversionRate: `${Math.round((metrics.deals.byStage.completed / Math.max(metrics.deals.total, 1)) * 100)}%`,
          teamMembers: TEAM_MEMBERS.length,
          documentsReviewed: metrics.deals.total * 12
        }
      };
      
    case 'due_diligence':
    case 'due-diligence':
      return {
        projects: unifiedDataStore.getAllDueDiligenceProjects(),
        metrics: {
          totalProjects: metrics.dueDiligence.total,
          activeProjects: metrics.dueDiligence.active,
          completedProjects: metrics.dueDiligence.completed,
          averageProgress: Math.round(metrics.dueDiligence.averageProgress),
          averageProjectTime: '45 days',
          riskFlagsIdentified: metrics.dueDiligence.total * 3
        }
      };
      
    case 'investment_committee':
    case 'investment-committee':
      return {
        proposals: unifiedDataStore.getAllInvestmentCommitteeProposals(),
        metrics: {
          totalProposals: metrics.investmentCommittee.total,
          approvedProposals: metrics.investmentCommittee.approved,
          rejectedProposals: metrics.investmentCommittee.rejected,
          pendingProposals: metrics.investmentCommittee.pending,
          averageDecisionTime: '12 days',
          approvalRate: `${Math.round((metrics.investmentCommittee.approved / Math.max(metrics.investmentCommittee.total, 1)) * 100)}%`
        }
      };
      
    case 'portfolio':
      return {
        companies: unifiedDataStore.getAllPortfolioInvestments(),
        metrics: {
          totalCompanies: metrics.portfolio.total,
          totalValue: metrics.portfolio.totalValue,
          totalInvested: metrics.portfolio.totalInvested,
          averageMultiple: metrics.portfolio.averageMultiple,
          averageIRR: metrics.portfolio.averageIRR,
          unrealizedGain: metrics.portfolio.totalValue - metrics.portfolio.totalInvested
        }
      };
      
    default:
      return {
        items: [],
        metrics: {
          total: 0,
          active: 0,
          completed: 0
        }
      };
  }
}

/**
 * Initialize unified data layer with seeded data
 */
export function initializeUnifiedDataLayer(): void {
  if (unifiedDataStore.getAllCompanies().length === 0) {
    seedAllData();
  }
}
