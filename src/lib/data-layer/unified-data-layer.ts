/**
 * Unified Data Layer for DD-Hybrid
 * Single source of truth for all entities across modules
 * Ensures data consistency and proper workflow progression
 */

import { generateAIScore, formatCurrency } from '../design-system';

// =============================================================================
// CORE ENTITY TYPES
// =============================================================================

export interface Company {
  id: string;
  name: string;
  sector: string;
  description?: string;
  website?: string;
  headquarters: string;
  foundedYear?: number;
  employeeCount?: number;
  
  // Financial data (consistent across all modules)
  financials: {
    revenue: number;           // Annual revenue in cents
    revenueGrowthRate: number; // YoY growth percentage
    ebitda: number;           // EBITDA in cents
    ebitdaMargin: number;     // EBITDA margin percentage
    grossMargin?: number;     // Gross margin percentage
    netIncome?: number;       // Net income in cents
    lastUpdated: Date;
  };
  
  // Valuation data
  valuation: {
    currentValuation?: number;  // Current valuation in cents
    lastRoundValuation?: number; // Last funding round valuation
    pricePerShare?: number;     // Current price per share in cents
    sharesOutstanding?: number; // Total shares outstanding
    lastUpdated: Date;
  };
  
  // Team information
  team: {
    ceo: string;
    cfo?: string;
    cto?: string;
    founders: string[];
    keyPersonnel: Array<{
      name: string;
      title: string;
      tenure: number; // Years
    }>;
  };
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
  notes?: string;
}

export interface Deal {
  id: string;
  companyId: string;
  name: string;
  type: 'growth' | 'buyout' | 'seed' | 'series_a' | 'series_b' | 'series_c' | 'bridge' | 'mezzanine';
  
  // Deal structure
  dealSize: number;          // Total deal size in cents
  investmentAmount: number;  // Our investment amount in cents
  ownershipPercentage: number; // Ownership percentage we'll receive
  pricePerShare: number;     // Price per share in cents
  
  // Deal progression
  stage: 'sourcing' | 'screening' | 'due_diligence' | 'investment_committee' | 'negotiation' | 'closing' | 'completed' | 'rejected';
  status: 'active' | 'on_hold' | 'completed' | 'cancelled';
  
  // Key dates
  sourceDate: Date;
  screeningStartDate?: Date;
  dueDiligenceStartDate?: Date;
  investmentCommitteeDate?: Date;
  expectedCloseDate?: Date;
  actualCloseDate?: Date;
  
  // Team assignments
  leadPartner: string;
  dealTeam: string[];
  
  // Financial projections
  projections: {
    projectedIRR: number;      // Projected IRR percentage
    projectedMultiple: number; // Projected multiple (e.g., 2.5x)
    paybackPeriod: number;     // Expected payback in years
    riskRating: 'low' | 'medium' | 'high' | 'critical';
  };
  
  // AI analysis
  aiAnalysis: {
    overallScore: number;      // 0-100 AI confidence score
    marketFitScore: number;    // Market fit assessment
    teamScore: number;         // Management team assessment
    financialScore: number;    // Financial health score
    riskScore: number;         // Risk assessment score
    lastAnalyzed: Date;
    keyInsights: string[];
    riskFactors: string[];
  };
  
  // Source information
  source: 'investment_bank' | 'direct_outreach' | 'network' | 'referral' | 'conference' | 'other';
  sourceDetails?: string;
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
  notes?: string;
}

export interface DueDiligenceProject {
  id: string;
  dealId: string;
  companyId: string;
  name: string;
  
  // Project details
  status: 'not_started' | 'in_progress' | 'pending_review' | 'completed' | 'flagged';
  progress: number; // 0-100 percentage
  
  // Timeline
  startDate: Date;
  targetCompletionDate: Date;
  actualCompletionDate?: Date;
  
  // Team
  projectLead: string;
  teamMembers: string[];
  
  // Workstreams
  workstreams: Array<{
    id: string;
    name: string;
    category: 'financial' | 'commercial' | 'legal' | 'operational' | 'management' | 'technical';
    status: 'not_started' | 'in_progress' | 'completed' | 'blocked';
    progress: number;
    assignee: string;
    dueDate: Date;
    findings: string[];
    riskFlags: Array<{
      severity: 'low' | 'medium' | 'high' | 'critical';
      description: string;
      impact: string;
      mitigation?: string;
    }>;
  }>;
  
  // Overall findings
  keyFindings: string[];
  riskFlags: Array<{
    id: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    category: string;
    description: string;
    impact: string;
    mitigation?: string;
    status: 'open' | 'mitigated' | 'accepted';
  }>;
  
  // Recommendations
  recommendation: 'proceed' | 'proceed_with_conditions' | 'reject' | 'more_analysis_needed';
  recommendationRationale: string;
  
  // AI enhancement
  aiInsights: {
    riskScore: number;
    completionScore: number;
    qualityScore: number;
    lastAnalyzed: Date;
    automatedFindings: string[];
    suggestedActions: string[];
  };
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
  notes?: string;
}

export interface InvestmentCommitteeProposal {
  id: string;
  dealId: string;
  dueDiligenceProjectId?: string;
  companyId: string;
  
  // Proposal details
  title: string;
  proposalType: 'new_investment' | 'follow_on' | 'exit' | 'restructuring';
  requestedAmount: number; // Amount requested in cents
  
  // Status and timeline
  status: 'draft' | 'submitted' | 'under_review' | 'scheduled' | 'presented' | 'approved' | 'rejected' | 'deferred';
  priority: 'low' | 'medium' | 'high' | 'critical';
  
  submittedAt: Date;
  meetingDate?: Date;
  decisionDate?: Date;
  
  // Presenter and team
  presentingPartner: string;
  supportingTeam: string[];
  
  // Investment thesis
  investmentThesis: string;
  keyInvestmentHighlights: string[];
  keyRisks: string[];
  
  // Financial summary (from due diligence)
  financialSummary: {
    currentRevenue: number;
    revenueGrowth: number;
    ebitdaMargin: number;
    projectedIRR: number;
    projectedMultiple: number;
    paybackPeriod: number;
  };
  
  // Committee voting
  voting: {
    totalMembers: number;
    votesFor: number;
    votesAgainst: number;
    abstentions: number;
    requiredMajority: number;
    votingComplete: boolean;
    individualVotes?: Array<{
      member: string;
      vote: 'for' | 'against' | 'abstain';
      comments?: string;
    }>;
  };
  
  // Decision details
  decision?: {
    outcome: 'approved' | 'rejected' | 'deferred';
    conditions?: string[];
    rationale: string;
    nextSteps?: string[];
  };
  
  // AI analysis
  aiAnalysis: {
    recommendationScore: number;
    riskAssessment: number;
    marketTimingScore: number;
    portfolioFitScore: number;
    lastAnalyzed: Date;
    keyInsights: string[];
  };
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
  notes?: string;
}

export interface PortfolioInvestment {
  id: string;
  companyId: string;
  dealId: string; // Original deal that created this investment
  
  // Investment details
  investmentDate: Date;
  originalInvestment: number; // Original investment amount in cents
  currentValuation: number;   // Current valuation in cents
  ownershipPercentage: number;
  
  // Investment structure
  securityType: 'common' | 'preferred' | 'convertible' | 'warrant' | 'debt';
  sharesOwned: number;
  liquidationPreference?: number;
  
  // Performance tracking
  performance: {
    currentMultiple: number;    // Current multiple (e.g., 2.3x)
    unrealizedGain: number;     // Unrealized gain/loss in cents
    realizedGain?: number;      // Realized gain/loss if exited
    irr: number;               // Current IRR
    holdingPeriod: number;     // Holding period in years
    lastValuationDate: Date;
  };
  
  // Company performance
  companyMetrics: {
    revenue: number;
    revenueGrowth: number;
    ebitda: number;
    ebitdaMargin: number;
    employeeCount: number;
    customerCount?: number;
    nps?: number; // Net Promoter Score
    lastUpdated: Date;
  };
  
  // Status and stage
  status: 'active' | 'exited' | 'written_off' | 'under_review';
  stage: 'seed' | 'early' | 'growth' | 'mature' | 'exit_prep';
  
  // Board and governance
  boardRepresentative?: string;
  boardObserver?: string;
  nextBoardMeeting?: Date;
  
  // Exit planning
  exitStrategy?: {
    preferredExitType: 'ipo' | 'strategic_sale' | 'financial_sale' | 'management_buyout';
    targetExitDate?: Date;
    targetMultiple?: number;
    targetIRR?: number;
    exitPreparationStatus: 'not_started' | 'in_progress' | 'ready' | 'marketing';
  };
  
  // AI monitoring
  aiMonitoring: {
    performanceScore: number;
    riskScore: number;
    exitReadinessScore: number;
    lastAnalyzed: Date;
    alerts: Array<{
      type: 'performance' | 'risk' | 'opportunity' | 'governance';
      severity: 'low' | 'medium' | 'high' | 'critical';
      message: string;
      createdAt: Date;
    }>;
    recommendations: string[];
  };
  
  // Recent activities
  recentActivities: Array<{
    date: Date;
    type: 'board_meeting' | 'financial_update' | 'milestone' | 'funding_round' | 'team_change' | 'other';
    description: string;
    impact?: 'positive' | 'negative' | 'neutral';
  }>;
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
  notes?: string;
}

// =============================================================================
// UNIFIED DATA STORE
// =============================================================================

class UnifiedDataStore {
  private companies: Map<string, Company> = new Map();
  private deals: Map<string, Deal> = new Map();
  private dueDiligenceProjects: Map<string, DueDiligenceProject> = new Map();
  private investmentCommitteeProposals: Map<string, InvestmentCommitteeProposal> = new Map();
  private portfolioInvestments: Map<string, PortfolioInvestment> = new Map();
  
  // Company management
  addCompany(company: Company): void {
    this.companies.set(company.id, company);
  }
  
  getCompany(id: string): Company | undefined {
    return this.companies.get(id);
  }
  
  getAllCompanies(): Company[] {
    return Array.from(this.companies.values());
  }
  
  updateCompany(id: string, updates: Partial<Company>): void {
    const company = this.companies.get(id);
    if (company) {
      this.companies.set(id, { ...company, ...updates, updatedAt: new Date() });
    }
  }
  
  // Deal management
  addDeal(deal: Deal): void {
    this.deals.set(deal.id, deal);
  }
  
  getDeal(id: string): Deal | undefined {
    return this.deals.get(id);
  }
  
  getAllDeals(): Deal[] {
    return Array.from(this.deals.values());
  }
  
  getDealsByCompany(companyId: string): Deal[] {
    return Array.from(this.deals.values()).filter(deal => deal.companyId === companyId);
  }
  
  getDealsByStage(stage: Deal['stage']): Deal[] {
    return Array.from(this.deals.values()).filter(deal => deal.stage === stage);
  }
  
  updateDeal(id: string, updates: Partial<Deal>): void {
    const deal = this.deals.get(id);
    if (deal) {
      this.deals.set(id, { ...deal, ...updates, updatedAt: new Date() });
    }
  }
  
  // Deal progression workflow
  progressDealToNextStage(dealId: string): boolean {
    const deal = this.deals.get(dealId);
    if (!deal) return false;
    
    const stageProgression: Record<Deal['stage'], Deal['stage'] | null> = {
      'sourcing': 'screening',
      'screening': 'due_diligence',
      'due_diligence': 'investment_committee',
      'investment_committee': 'negotiation',
      'negotiation': 'closing',
      'closing': 'completed',
      'completed': null,
      'rejected': null
    };
    
    const nextStage = stageProgression[deal.stage];
    if (nextStage) {
      this.updateDeal(dealId, { 
        stage: nextStage,
        [`${nextStage.replace('_', '')}StartDate`]: new Date()
      });
      return true;
    }
    return false;
  }
  
  // Due Diligence management
  addDueDiligenceProject(project: DueDiligenceProject): void {
    this.dueDiligenceProjects.set(project.id, project);
  }
  
  getDueDiligenceProject(id: string): DueDiligenceProject | undefined {
    return this.dueDiligenceProjects.get(id);
  }
  
  getDueDiligenceProjectsByDeal(dealId: string): DueDiligenceProject[] {
    return Array.from(this.dueDiligenceProjects.values()).filter(project => project.dealId === dealId);
  }
  
  getAllDueDiligenceProjects(): DueDiligenceProject[] {
    return Array.from(this.dueDiligenceProjects.values());
  }
  
  updateDueDiligenceProject(id: string, updates: Partial<DueDiligenceProject>): void {
    const project = this.dueDiligenceProjects.get(id);
    if (project) {
      this.dueDiligenceProjects.set(id, { ...project, ...updates, updatedAt: new Date() });
    }
  }
  
  // Investment Committee management
  addInvestmentCommitteeProposal(proposal: InvestmentCommitteeProposal): void {
    this.investmentCommitteeProposals.set(proposal.id, proposal);
  }
  
  getInvestmentCommitteeProposal(id: string): InvestmentCommitteeProposal | undefined {
    return this.investmentCommitteeProposals.get(id);
  }
  
  getAllInvestmentCommitteeProposals(): InvestmentCommitteeProposal[] {
    return Array.from(this.investmentCommitteeProposals.values());
  }
  
  getInvestmentCommitteeProposalsByDeal(dealId: string): InvestmentCommitteeProposal[] {
    return Array.from(this.investmentCommitteeProposals.values()).filter(proposal => proposal.dealId === dealId);
  }
  
  updateInvestmentCommitteeProposal(id: string, updates: Partial<InvestmentCommitteeProposal>): void {
    const proposal = this.investmentCommitteeProposals.get(id);
    if (proposal) {
      this.investmentCommitteeProposals.set(id, { ...proposal, ...updates, updatedAt: new Date() });
    }
  }
  
  // Portfolio management
  addPortfolioInvestment(investment: PortfolioInvestment): void {
    this.portfolioInvestments.set(investment.id, investment);
  }
  
  getPortfolioInvestment(id: string): PortfolioInvestment | undefined {
    return this.portfolioInvestments.get(id);
  }
  
  getAllPortfolioInvestments(): PortfolioInvestment[] {
    return Array.from(this.portfolioInvestments.values());
  }
  
  getPortfolioInvestmentsByCompany(companyId: string): PortfolioInvestment[] {
    return Array.from(this.portfolioInvestments.values()).filter(investment => investment.companyId === companyId);
  }
  
  updatePortfolioInvestment(id: string, updates: Partial<PortfolioInvestment>): void {
    const investment = this.portfolioInvestments.get(id);
    if (investment) {
      this.portfolioInvestments.set(id, { ...investment, ...updates, updatedAt: new Date() });
    }
  }
  
  // Cross-module queries
  getCompanyWithAllData(companyId: string) {
    const company = this.getCompany(companyId);
    if (!company) return null;
    
    return {
      company,
      deals: this.getDealsByCompany(companyId),
      dueDiligenceProjects: Array.from(this.dueDiligenceProjects.values()).filter(p => p.companyId === companyId),
      investmentCommitteeProposals: Array.from(this.investmentCommitteeProposals.values()).filter(p => p.companyId === companyId),
      portfolioInvestments: this.getPortfolioInvestmentsByCompany(companyId)
    };
  }
  
  getDealWithAllData(dealId: string) {
    const deal = this.getDeal(dealId);
    if (!deal) return null;
    
    return {
      deal,
      company: this.getCompany(deal.companyId),
      dueDiligenceProjects: this.getDueDiligenceProjectsByDeal(dealId),
      investmentCommitteeProposals: this.getInvestmentCommitteeProposalsByDeal(dealId),
      portfolioInvestment: Array.from(this.portfolioInvestments.values()).find(i => i.dealId === dealId)
    };
  }
  
  // Analytics and reporting
  getMetrics() {
    const deals = this.getAllDeals();
    const ddProjects = this.getAllDueDiligenceProjects();
    const icProposals = this.getAllInvestmentCommitteeProposals();
    const portfolioInvestments = this.getAllPortfolioInvestments();
    
    return {
      deals: {
        total: deals.length,
        byStage: {
          sourcing: deals.filter(d => d.stage === 'sourcing').length,
          screening: deals.filter(d => d.stage === 'screening').length,
          due_diligence: deals.filter(d => d.stage === 'due_diligence').length,
          investment_committee: deals.filter(d => d.stage === 'investment_committee').length,
          negotiation: deals.filter(d => d.stage === 'negotiation').length,
          closing: deals.filter(d => d.stage === 'closing').length,
          completed: deals.filter(d => d.stage === 'completed').length,
          rejected: deals.filter(d => d.stage === 'rejected').length,
        },
        totalValue: deals.reduce((sum, d) => sum + d.dealSize, 0),
        averageSize: deals.length > 0 ? deals.reduce((sum, d) => sum + d.dealSize, 0) / deals.length : 0
      },
      dueDiligence: {
        total: ddProjects.length,
        active: ddProjects.filter(p => p.status === 'in_progress').length,
        completed: ddProjects.filter(p => p.status === 'completed').length,
        averageProgress: ddProjects.length > 0 ? ddProjects.reduce((sum, p) => sum + p.progress, 0) / ddProjects.length : 0
      },
      investmentCommittee: {
        total: icProposals.length,
        approved: icProposals.filter(p => p.status === 'approved').length,
        rejected: icProposals.filter(p => p.status === 'rejected').length,
        pending: icProposals.filter(p => ['submitted', 'under_review', 'scheduled'].includes(p.status)).length
      },
      portfolio: {
        total: portfolioInvestments.length,
        totalValue: portfolioInvestments.reduce((sum, i) => sum + i.currentValuation, 0),
        totalInvested: portfolioInvestments.reduce((sum, i) => sum + i.originalInvestment, 0),
        averageMultiple: portfolioInvestments.length > 0 ? 
          portfolioInvestments.reduce((sum, i) => sum + i.performance.currentMultiple, 0) / portfolioInvestments.length : 0,
        averageIRR: portfolioInvestments.length > 0 ?
          portfolioInvestments.reduce((sum, i) => sum + i.performance.irr, 0) / portfolioInvestments.length : 0
      }
    };
  }
  
  // Data validation and consistency checks
  validateDataConsistency(): Array<{ type: string; message: string; severity: 'warning' | 'error' }> {
    const issues: Array<{ type: string; message: string; severity: 'warning' | 'error' }> = [];
    
    // Check for orphaned records
    for (const deal of this.deals.values()) {
      if (!this.companies.has(deal.companyId)) {
        issues.push({
          type: 'orphaned_deal',
          message: `Deal ${deal.id} references non-existent company ${deal.companyId}`,
          severity: 'error'
        });
      }
    }
    
    // Check for financial data consistency
    for (const company of this.companies.values()) {
      const deals = this.getDealsByCompany(company.id);
      const portfolioInvestments = this.getPortfolioInvestmentsByCompany(company.id);
      
      // Check if financial data is consistent across deals and portfolio
      for (const investment of portfolioInvestments) {
        if (Math.abs(investment.companyMetrics.revenue - company.financials.revenue) > company.financials.revenue * 0.1) {
          issues.push({
            type: 'financial_inconsistency',
            message: `Revenue mismatch for ${company.name}: Company record shows ${formatCurrency(company.financials.revenue)}, Portfolio shows ${formatCurrency(investment.companyMetrics.revenue)}`,
            severity: 'warning'
          });
        }
      }
    }
    
    return issues;
  }
  
  // Clear all data (for testing)
  clearAll(): void {
    this.companies.clear();
    this.deals.clear();
    this.dueDiligenceProjects.clear();
    this.investmentCommitteeProposals.clear();
    this.portfolioInvestments.clear();
  }
}

// =============================================================================
// SINGLETON INSTANCE
// =============================================================================

export const unifiedDataStore = new UnifiedDataStore();

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

export function generateConsistentId(prefix: string, name: string): string {
  // Generate consistent IDs based on name to ensure same entities get same IDs
  const hash = name.toLowerCase().replace(/[^a-z0-9]/g, '');
  return `${prefix}_${hash}_${Date.now().toString(36)}`;
}

export function createCompanyFromDeal(deal: Deal): Company {
  // Create a company record from deal information
  const company = unifiedDataStore.getCompany(deal.companyId);
  if (company) return company;
  
  // Generate realistic financial data based on deal size
  const revenue = deal.dealSize * (2 + Math.random() * 3); // 2-5x deal size as revenue
  const ebitdaMargin = 10 + Math.random() * 25; // 10-35% EBITDA margin
  const ebitda = revenue * (ebitdaMargin / 100);
  
  return {
    id: deal.companyId,
    name: deal.name.replace(' Investment', '').replace(' Deal', ''),
    sector: 'Technology', // Default, should be updated
    headquarters: 'San Francisco, CA',
    employeeCount: Math.floor(50 + Math.random() * 500),
    financials: {
      revenue,
      revenueGrowthRate: deal.projections.projectedIRR * 0.6, // Rough correlation
      ebitda,
      ebitdaMargin,
      lastUpdated: new Date()
    },
    valuation: {
      currentValuation: deal.dealSize / (deal.ownershipPercentage / 100),
      lastRoundValuation: deal.dealSize / (deal.ownershipPercentage / 100),
      pricePerShare: deal.pricePerShare,
      lastUpdated: new Date()
    },
    team: {
      ceo: 'John Smith', // Default, should be updated
      founders: ['John Smith'],
      keyPersonnel: []
    },
    createdAt: new Date(),
    updatedAt: new Date(),
    tags: [],
  };
}

export default unifiedDataStore;
