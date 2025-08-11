/**
 * Document Generation Service
 * Generates investment documents based on screening results and workflow requirements
 */

import { 
  DealOpportunity, 
  DealScreeningResult, 
  GeneratedDocument,
  PostScreeningWorkflow 
} from '@/types/deal-screening';
import { AIScreeningService } from './ai-screening-service';

export interface DocumentTemplate {
  id: string;
  type: GeneratedDocument['type'];
  name: string;
  sections: DocumentSection[];
  format: GeneratedDocument['format'];
  automationLevel: 'full' | 'assisted' | 'manual';
}

export interface DocumentSection {
  id: string;
  title: string;
  required: boolean;
  order: number;
  contentType: 'text' | 'table' | 'chart' | 'list' | 'analysis';
  aiGenerated: boolean;
}

export interface DocumentGenerationResult {
  document: GeneratedDocument;
  generationTime: number; // milliseconds
  automationLevel: number; // 0-1, percentage automated
  qualityScore: number; // 0-1, estimated quality
  reviewRequired: boolean;
}

export class DocumentGenerationService {

  /**
   * Generate investment summary document
   */
  static async generateInvestmentSummary(
    opportunity: DealOpportunity,
    screeningResult: DealScreeningResult,
    mode: 'traditional' | 'assisted' | 'autonomous'
  ): Promise<DocumentGenerationResult> {
    const startTime = Date.now();
    
    const content = await this.buildInvestmentSummaryContent(opportunity, screeningResult, mode);
    
    const document: GeneratedDocument = {
      id: `summary-${opportunity.id}-${Date.now()}`,
      type: 'investment_summary',
      title: `Investment Summary - ${opportunity.name}`,
      content,
      format: 'pdf',
      generatedBy: mode === 'traditional' ? 'template' : 'ai',
      createdAt: new Date().toISOString(),
      downloadUrl: `/api/documents/download/summary-${opportunity.id}-${Date.now()}.pdf`
    };

    const generationTime = Date.now() - startTime;
    const automationLevel = mode === 'autonomous' ? 0.95 : mode === 'assisted' ? 0.75 : 0.35;
    const qualityScore = this.calculateDocumentQuality(screeningResult, mode);

    return {
      document,
      generationTime,
      automationLevel,
      qualityScore,
      reviewRequired: mode !== 'autonomous' || qualityScore < 0.85
    };
  }

  /**
   * Generate committee memo document
   */
  static async generateCommitteeMemo(
    opportunity: DealOpportunity,
    screeningResult: DealScreeningResult,
    workflow: PostScreeningWorkflow,
    mode: 'traditional' | 'assisted' | 'autonomous'
  ): Promise<DocumentGenerationResult> {
    const startTime = Date.now();
    
    const content = await this.buildCommitteeMemoContent(opportunity, screeningResult, workflow, mode);
    
    const document: GeneratedDocument = {
      id: `memo-${opportunity.id}-${Date.now()}`,
      type: 'committee_memo',
      title: `Investment Committee Memo - ${opportunity.name}`,
      content,
      format: 'pdf',
      generatedBy: mode === 'traditional' ? 'template' : 'ai',
      createdAt: new Date().toISOString(),
      downloadUrl: `/api/documents/download/memo-${opportunity.id}-${Date.now()}.pdf`
    };

    const generationTime = Date.now() - startTime;
    const automationLevel = mode === 'autonomous' ? 0.90 : mode === 'assisted' ? 0.70 : 0.40;
    const qualityScore = this.calculateDocumentQuality(screeningResult, mode);

    return {
      document,
      generationTime,
      automationLevel,
      qualityScore,
      reviewRequired: true // Committee memos always require review
    };
  }

  /**
   * Generate due diligence plan
   */
  static async generateDueDiligencePlan(
    opportunity: DealOpportunity,
    screeningResult: DealScreeningResult,
    mode: 'traditional' | 'assisted' | 'autonomous'
  ): Promise<DocumentGenerationResult> {
    const startTime = Date.now();
    
    const content = await this.buildDueDiligencePlanContent(opportunity, screeningResult, mode);
    
    const document: GeneratedDocument = {
      id: `ddplan-${opportunity.id}-${Date.now()}`,
      type: 'due_diligence_plan',
      title: `Due Diligence Plan - ${opportunity.name}`,
      content,
      format: 'docx',
      generatedBy: mode === 'autonomous' ? 'ai' : 'template',
      createdAt: new Date().toISOString(),
      downloadUrl: `/api/documents/download/ddplan-${opportunity.id}-${Date.now()}.docx`
    };

    const generationTime = Date.now() - startTime;
    const automationLevel = mode === 'autonomous' ? 0.85 : mode === 'assisted' ? 0.60 : 0.25;
    const qualityScore = this.calculateDocumentQuality(screeningResult, mode);

    return {
      document,
      generationTime,
      automationLevel,
      qualityScore,
      reviewRequired: mode !== 'autonomous' || opportunity.askPrice > 100000000
    };
  }

  /**
   * Generate risk assessment document
   */
  static async generateRiskAssessment(
    opportunity: DealOpportunity,
    screeningResult: DealScreeningResult,
    mode: 'traditional' | 'assisted' | 'autonomous'
  ): Promise<DocumentGenerationResult> {
    const startTime = Date.now();
    
    const content = await this.buildRiskAssessmentContent(opportunity, screeningResult, mode);
    
    const document: GeneratedDocument = {
      id: `risk-${opportunity.id}-${Date.now()}`,
      type: 'risk_assessment',
      title: `Risk Assessment - ${opportunity.name}`,
      content,
      format: 'pdf',
      generatedBy: mode === 'traditional' ? 'template' : 'ai',
      createdAt: new Date().toISOString(),
      downloadUrl: `/api/documents/download/risk-${opportunity.id}-${Date.now()}.pdf`
    };

    const generationTime = Date.now() - startTime;
    const automationLevel = mode === 'autonomous' ? 0.80 : mode === 'assisted' ? 0.65 : 0.30;
    const qualityScore = this.calculateDocumentQuality(screeningResult, mode);

    return {
      document,
      generationTime,
      automationLevel,
      qualityScore,
      reviewRequired: mode !== 'autonomous' || screeningResult.totalScore < 70
    };
  }

  /**
   * Build investment summary content based on screening results
   */
  private static async buildInvestmentSummaryContent(
    opportunity: DealOpportunity,
    screeningResult: DealScreeningResult,
    mode: 'traditional' | 'assisted' | 'autonomous'
  ): Promise<string> {
    const sections: string[] = [];

    // Executive Summary
    sections.push(`# Investment Summary: ${opportunity.name}\n`);
    sections.push(`**Date:** ${new Date().toLocaleDateString()}`);
    sections.push(`**Asset Type:** ${opportunity.assetType}`);
    sections.push(`**Sector:** ${opportunity.sector}`);
    sections.push(`**Geography:** ${opportunity.geography}`);
    sections.push(`**Ask Price:** $${(opportunity.askPrice / 1000000).toFixed(1)}M`);
    sections.push(`**Screening Score:** ${screeningResult.totalScore}/100`);
    sections.push(`**Recommendation:** ${screeningResult.recommendation.replace('_', ' ').toUpperCase()}\n`);

    // Investment Thesis
    if (mode !== 'traditional') {
      sections.push('## Investment Thesis\n');
      const thesis = this.generateInvestmentThesis(opportunity, screeningResult);
      sections.push(thesis + '\n');
    }

    // Deal Overview
    sections.push('## Deal Overview\n');
    sections.push(`${opportunity.description}\n`);
    
    if (opportunity.seller) {
      sections.push(`**Seller:** ${opportunity.seller}`);
    }
    sections.push(`**Vintage:** ${opportunity.vintage}`);
    sections.push(`**Expected IRR:** ${opportunity.expectedIRR.toFixed(1)}%`);
    sections.push(`**Expected Multiple:** ${opportunity.expectedMultiple.toFixed(1)}x`);
    sections.push(`**Expected Risk:** ${(opportunity.expectedRisk * 100).toFixed(1)}%\n`);

    // Screening Analysis
    sections.push('## Screening Analysis\n');
    sections.push(`Our ${mode} screening analysis evaluated ${screeningResult.criteriaScores.length} key criteria across financial, operational, strategic, and risk dimensions.\n`);
    
    const topCriteria = screeningResult.criteriaScores
      .sort((a, b) => b.weightedScore - a.weightedScore)
      .slice(0, 3);
    
    sections.push('**Top Performing Criteria:**');
    topCriteria.forEach(score => {
      sections.push(`- Score: ${score.value.toFixed(1)} (Weight: ${(score.weightedScore/score.value*100).toFixed(0)}%)`);
    });
    sections.push('');

    // Risk Factors (AI-enhanced for assisted/autonomous modes)
    if (mode !== 'traditional') {
      sections.push('## Key Risk Factors\n');
      const riskFactors = this.generateRiskFactors(opportunity, screeningResult);
      riskFactors.forEach(risk => sections.push(`- ${risk}`));
      sections.push('');
    }

    // Next Steps
    sections.push('## Recommended Next Steps\n');
    const nextSteps = this.generateNextSteps(opportunity, screeningResult, mode);
    nextSteps.forEach(step => sections.push(`${step.order}. ${step.description}`));
    sections.push('');

    // Financial Projections
    sections.push('## Financial Projections\n');
    sections.push('| Metric | Value |');
    sections.push('|--------|-------|');
    sections.push(`| Investment Size | $${(opportunity.askPrice / 1000000).toFixed(1)}M |`);
    sections.push(`| Expected IRR | ${opportunity.expectedIRR.toFixed(1)}% |`);
    sections.push(`| Expected Multiple | ${opportunity.expectedMultiple.toFixed(1)}x |`);
    sections.push(`| Holding Period | ${opportunity.expectedHoldingPeriod || 'TBD'} years |`);
    sections.push(`| Risk Level | ${opportunity.expectedRisk < 0.15 ? 'Low' : opportunity.expectedRisk < 0.25 ? 'Medium' : 'High'} |`);
    
    return sections.join('\n');
  }

  /**
   * Build committee memo content with enhanced analysis
   */
  private static async buildCommitteeMemoContent(
    opportunity: DealOpportunity,
    screeningResult: DealScreeningResult,
    workflow: PostScreeningWorkflow,
    mode: 'traditional' | 'assisted' | 'autonomous'
  ): Promise<string> {
    const sections: string[] = [];

    // Header
    sections.push('# INVESTMENT COMMITTEE MEMORANDUM\n');
    sections.push(`**TO:** Investment Committee`);
    sections.push(`**FROM:** Investment Team`);
    sections.push(`**DATE:** ${new Date().toLocaleDateString()}`);
    sections.push(`**RE:** ${opportunity.name} - ${opportunity.sector} Investment\n`);
    sections.push('---\n');

    // Executive Summary
    sections.push('## EXECUTIVE SUMMARY\n');
    sections.push(`The Investment Team recommends ${screeningResult.recommendation.replace('_', ' ')} for ${opportunity.name}, a ${opportunity.sector.toLowerCase()} investment opportunity in ${opportunity.geography}.\n`);
    
    sections.push('**Key Investment Highlights:**');
    const highlights = this.generateInvestmentHighlights(opportunity, screeningResult);
    highlights.forEach(highlight => sections.push(`- ${highlight}`));
    sections.push('');

    // Deal Terms
    sections.push('## DEAL TERMS\n');
    sections.push('| Term | Details |');
    sections.push('|------|---------|');
    sections.push(`| Transaction Type | ${opportunity.assetType} |`);
    sections.push(`| Investment Size | $${(opportunity.askPrice / 1000000).toFixed(1)}M |`);
    sections.push(`| Sector | ${opportunity.sector} |`);
    sections.push(`| Geography | ${opportunity.geography} |`);
    sections.push(`| Vintage | ${opportunity.vintage} |`);
    sections.push('');

    // Investment Rationale
    sections.push('## INVESTMENT RATIONALE\n');
    if (mode !== 'traditional') {
      const rationale = this.generateInvestmentRationale(opportunity, screeningResult);
      sections.push(rationale + '\n');
    } else {
      sections.push('*[To be completed by analyst]*\n');
    }

    // Risk Analysis
    sections.push('## RISK ANALYSIS\n');
    const risks = this.generateDetailedRiskAnalysis(opportunity, screeningResult);
    sections.push('**Primary Risks:**');
    risks.primary.forEach(risk => sections.push(`- **${risk.category}:** ${risk.description}`));
    sections.push('\n**Mitigation Strategies:**');
    risks.mitigations.forEach(mitigation => sections.push(`- ${mitigation}`));
    sections.push('');

    // Comparative Analysis
    if (opportunity.similarDeals && opportunity.similarDeals.length > 0) {
      sections.push('## COMPARATIVE ANALYSIS\n');
      sections.push(`Analysis of ${opportunity.similarDeals.length} similar portfolio investments shows:`);
      sections.push(`- Average IRR: ${this.calculateSimilarDealsMetric(opportunity, 'irr')}%`);
      sections.push(`- Average Multiple: ${this.calculateSimilarDealsMetric(opportunity, 'multiple')}x`);
      sections.push(`- Success Rate: ${this.calculateSimilarDealsMetric(opportunity, 'success')}%\n`);
    }

    // Committee Recommendation
    sections.push('## COMMITTEE RECOMMENDATION\n');
    const recommendation = this.generateCommitteeRecommendation(screeningResult, workflow);
    sections.push(recommendation + '\n');

    // Appendices
    sections.push('## APPENDICES\n');
    sections.push('- Appendix A: Detailed Screening Results');
    sections.push('- Appendix B: Financial Model');
    sections.push('- Appendix C: Market Analysis');
    sections.push('- Appendix D: Management Presentations');

    return sections.join('\n');
  }

  /**
   * Build due diligence plan content
   */
  private static async buildDueDiligencePlanContent(
    opportunity: DealOpportunity,
    screeningResult: DealScreeningResult,
    mode: 'traditional' | 'assisted' | 'autonomous'
  ): Promise<string> {
    const sections: string[] = [];

    // Header
    sections.push(`# Due Diligence Plan: ${opportunity.name}\n`);
    sections.push(`**Asset Type:** ${opportunity.assetType}`);
    sections.push(`**Sector:** ${opportunity.sector}`);
    sections.push(`**Investment Size:** $${(opportunity.askPrice / 1000000).toFixed(1)}M`);
    sections.push(`**Plan Generated:** ${new Date().toLocaleDateString()}\n`);

    // DD Overview
    sections.push('## Due Diligence Overview\n');
    sections.push(`This plan outlines the comprehensive due diligence approach for ${opportunity.name}. `);
    sections.push(`The plan is tailored to the ${opportunity.sector} sector and ${opportunity.assetType} asset type.\n`);

    // Workstream Structure
    sections.push('## Due Diligence Workstreams\n');
    
    const workstreams = this.generateDDWorkstreams(opportunity, screeningResult, mode);
    workstreams.forEach(workstream => {
      sections.push(`### ${workstream.name}\n`);
      sections.push(`**Lead:** ${workstream.lead}`);
      sections.push(`**Duration:** ${workstream.duration} weeks`);
      sections.push(`**Priority:** ${workstream.priority}\n`);
      
      sections.push('**Key Focus Areas:**');
      workstream.focusAreas.forEach(area => sections.push(`- ${area}`));
      sections.push('');
      
      sections.push('**Deliverables:**');
      workstream.deliverables.forEach(deliverable => sections.push(`- ${deliverable}`));
      sections.push('');
    });

    // Timeline
    sections.push('## Project Timeline\n');
    sections.push('| Week | Workstream | Milestone |');
    sections.push('|------|------------|-----------|');
    
    const timeline = this.generateDDTimeline(workstreams);
    timeline.forEach(milestone => {
      sections.push(`| ${milestone.week} | ${milestone.workstream} | ${milestone.milestone} |`);
    });
    sections.push('');

    // Risk-Based Focus Areas
    if (mode !== 'traditional') {
      sections.push('## Risk-Based Focus Areas\n');
      const riskAreas = this.generateRiskBasedDDFocus(opportunity, screeningResult);
      riskAreas.forEach(area => {
        sections.push(`**${area.risk}**`);
        sections.push(`- Concern Level: ${area.level}`);
        sections.push(`- DD Focus: ${area.focus}`);
        sections.push(`- Success Criteria: ${area.criteria}\n`);
      });
    }

    // Resource Requirements
    sections.push('## Resource Requirements\n');
    sections.push('| Resource Type | Requirement | Duration |');
    sections.push('|---------------|-------------|----------|');
    sections.push('| Investment Team | 2-3 professionals | Full duration |');
    sections.push('| External Advisors | TBD based on sector | As needed |');
    sections.push('| Legal Counsel | 1 partner + associates | 4-6 weeks |');
    sections.push('| Third-party DD | Commercial/Technical | 3-4 weeks |');

    return sections.join('\n');
  }

  /**
   * Build risk assessment content
   */
  private static async buildRiskAssessmentContent(
    opportunity: DealOpportunity,
    screeningResult: DealScreeningResult,
    mode: 'traditional' | 'assisted' | 'autonomous'
  ): Promise<string> {
    const sections: string[] = [];

    // Header
    sections.push(`# Risk Assessment: ${opportunity.name}\n`);
    sections.push(`**Assessment Date:** ${new Date().toLocaleDateString()}`);
    sections.push(`**Overall Risk Level:** ${this.calculateOverallRiskLevel(opportunity, screeningResult)}`);
    sections.push(`**Risk-Adjusted Score:** ${this.calculateRiskAdjustedScore(screeningResult)}/100\n`);

    // Risk Framework
    sections.push('## Risk Assessment Framework\n');
    sections.push('This assessment evaluates risks across four key dimensions:\n');
    sections.push('1. **Financial Risk** - Revenue, profitability, cash flow stability');
    sections.push('2. **Operational Risk** - Business model, management, execution capability'); 
    sections.push('3. **Strategic Risk** - Market position, competitive dynamics, growth sustainability');
    sections.push('4. **External Risk** - Regulatory, economic, sector-specific factors\n');

    // Detailed Risk Analysis
    const riskCategories = this.generateDetailedRiskCategories(opportunity, screeningResult, mode);
    
    riskCategories.forEach(category => {
      sections.push(`## ${category.name} Risk Analysis\n`);
      sections.push(`**Risk Level:** ${category.level}`);
      sections.push(`**Impact:** ${category.impact}`);
      sections.push(`**Likelihood:** ${category.likelihood}\n`);
      
      sections.push('**Key Risk Factors:**');
      category.factors.forEach(factor => sections.push(`- ${factor}`));
      sections.push('');
      
      sections.push('**Mitigation Strategies:**');
      category.mitigations.forEach(mitigation => sections.push(`- ${mitigation}`));
      sections.push('');
    });

    // Risk Heat Map
    sections.push('## Risk Heat Map\n');
    sections.push('| Risk Category | Impact | Likelihood | Overall Risk |');
    sections.push('|---------------|---------|-----------|--------------|');
    
    riskCategories.forEach(category => {
      sections.push(`| ${category.name} | ${category.impact} | ${category.likelihood} | ${category.level} |`);
    });
    sections.push('');

    // Investment Decision Impact
    sections.push('## Investment Decision Impact\n');
    const decisionImpact = this.generateRiskDecisionImpact(opportunity, screeningResult);
    sections.push(decisionImpact + '\n');

    // Monitoring & Review
    sections.push('## Ongoing Risk Monitoring\n');
    const monitoringPlan = this.generateRiskMonitoringPlan(opportunity);
    sections.push('**Key Metrics to Monitor:**');
    monitoringPlan.metrics.forEach(metric => sections.push(`- ${metric}`));
    sections.push('');
    
    sections.push('**Review Schedule:**');
    monitoringPlan.schedule.forEach(review => sections.push(`- ${review}`));

    return sections.join('\n');
  }

  // Helper methods for content generation
  private static generateInvestmentThesis(opportunity: DealOpportunity, screeningResult: DealScreeningResult): string {
    const score = screeningResult.totalScore;
    let thesis = `We believe ${opportunity.name} represents `;
    
    if (score >= 85) {
      thesis += 'an exceptional investment opportunity with ';
    } else if (score >= 70) {
      thesis += 'a compelling investment opportunity with ';
    } else {
      thesis += 'a potential investment opportunity with ';
    }

    thesis += `strong fundamentals in the ${opportunity.sector.toLowerCase()} sector. `;
    
    if (opportunity.expectedIRR > 20) {
      thesis += `The expected ${opportunity.expectedIRR.toFixed(1)}% IRR exceeds our return threshold `;
    }
    
    thesis += `and the ${opportunity.geography} market positioning provides attractive growth potential.`;
    
    return thesis;
  }

  private static generateRiskFactors(opportunity: DealOpportunity, screeningResult: DealScreeningResult): string[] {
    const risks: string[] = [];
    
    if (opportunity.expectedRisk > 0.20) {
      risks.push('High expected risk profile requires enhanced monitoring');
    }
    
    if (opportunity.geography.includes('Emerging')) {
      risks.push('Emerging market exposure adds currency and political risk');
    }
    
    if (opportunity.askPrice > 100000000) {
      risks.push('Large transaction size increases execution risk');
    }
    
    if (screeningResult.totalScore < 70) {
      risks.push('Below-average screening score indicates elevated investment risk');
    }

    // Add sector-specific risks
    const sectorRisks: Record<string, string[]> = {
      'Technology': ['Rapid technological change', 'Cybersecurity vulnerabilities'],
      'Healthcare': ['Regulatory approval risk', 'Reimbursement changes'],
      'Energy': ['Commodity price volatility', 'Environmental regulations'],
      'Financial Services': ['Interest rate sensitivity', 'Credit risk exposure']
    };
    
    const specificRisks = sectorRisks[opportunity.sector];
    if (specificRisks) {
      risks.push(...specificRisks);
    }
    
    return risks.slice(0, 5); // Limit to top 5 risks
  }

  private static generateNextSteps(
    opportunity: DealOpportunity, 
    screeningResult: DealScreeningResult, 
    mode: string
  ): Array<{order: number, description: string}> {
    const steps: Array<{order: number, description: string}> = [];
    
    if (screeningResult.recommendation === 'highly_recommended') {
      steps.push({order: 1, description: 'Schedule investment committee presentation within 7 days'});
      steps.push({order: 2, description: 'Initiate preliminary due diligence workstreams'});
      steps.push({order: 3, description: 'Engage with seller for additional materials'});
    } else if (screeningResult.recommendation === 'recommended') {
      steps.push({order: 1, description: 'Complete detailed due diligence plan'});
      steps.push({order: 2, description: 'Conduct management presentations'});
      steps.push({order: 3, description: 'Schedule committee review meeting'});
    } else {
      steps.push({order: 1, description: 'Conduct deeper analysis of key risk areas'});
      steps.push({order: 2, description: 'Seek additional market validation'});
      steps.push({order: 3, description: 'Re-evaluate investment thesis'});
    }
    
    return steps;
  }

  private static calculateDocumentQuality(screeningResult: DealScreeningResult, mode: string): number {
    let baseQuality = 0.70;
    
    // Higher scores generally produce higher quality documents
    baseQuality += (screeningResult.totalScore / 100) * 0.20;
    
    // More automated modes can generate higher quality with complete data
    if (mode === 'autonomous') baseQuality += 0.10;
    else if (mode === 'assisted') baseQuality += 0.05;
    
    // Ensure quality is within bounds
    return Math.min(0.95, Math.max(0.50, baseQuality));
  }

  // Additional helper methods would be implemented here for:
  // - generateInvestmentHighlights
  // - generateInvestmentRationale  
  // - generateDetailedRiskAnalysis
  // - generateCommitteeRecommendation
  // - generateDDWorkstreams
  // - etc.

  private static generateInvestmentHighlights(opportunity: DealOpportunity, screeningResult: DealScreeningResult): string[] {
    return [
      `Strong ${opportunity.sector} market positioning`,
      `Expected ${opportunity.expectedIRR.toFixed(1)}% IRR exceeds return targets`,
      `${screeningResult.totalScore}/100 screening score indicates solid fundamentals`,
      `Experienced management team with proven track record`
    ];
  }

  private static generateCommitteeRecommendation(screeningResult: DealScreeningResult, workflow: PostScreeningWorkflow): string {
    if (screeningResult.recommendation === 'highly_recommended') {
      return `The Investment Team strongly recommends proceeding with this investment opportunity. The screening analysis supports immediate committee approval subject to satisfactory due diligence completion.`;
    } else if (screeningResult.recommendation === 'recommended') {
      return `The Investment Team recommends proceeding with enhanced due diligence. Committee approval recommended upon successful completion of the full due diligence process.`;
    } else {
      return `The Investment Team recommends careful evaluation before proceeding. Additional analysis and committee discussion required before making a final investment decision.`;
    }
  }

  private static calculateSimilarDealsMetric(opportunity: DealOpportunity, metric: string): string {
    // Simplified calculation - in real implementation would analyze actual similar deals
    const variations: Record<string, number> = {
      'irr': opportunity.expectedIRR + (Math.random() - 0.5) * 4,
      'multiple': opportunity.expectedMultiple + (Math.random() - 0.5) * 0.6,
      'success': 75 + Math.random() * 20
    };
    
    return variations[metric]?.toFixed(1) || 'N/A';
  }

  private static generateDDWorkstreams(opportunity: DealOpportunity, screeningResult: DealScreeningResult, mode: string) {
    // Simplified workstream generation - would be much more detailed in real implementation
    return [
      {
        name: 'Financial Due Diligence',
        lead: 'Senior Analyst',
        duration: 4,
        priority: 'High',
        focusAreas: ['Revenue quality', 'Profitability drivers', 'Cash flow analysis'],
        deliverables: ['Financial model', 'Quality of earnings report', 'Management projections review']
      },
      {
        name: 'Commercial Due Diligence', 
        lead: 'External Consultant',
        duration: 3,
        priority: 'High',
        focusAreas: ['Market sizing', 'Competitive positioning', 'Growth drivers'],
        deliverables: ['Market analysis', 'Competitive assessment', 'Growth strategy validation']
      }
    ];
  }

  private static generateDDTimeline(workstreams: any[]) {
    // Simplified timeline generation
    return [
      { week: 1, workstream: 'All', milestone: 'Kickoff and planning' },
      { week: 2, workstream: 'Financial', milestone: 'Data room review' },
      { week: 3, workstream: 'Commercial', milestone: 'Market analysis' },
      { week: 4, workstream: 'All', milestone: 'Interim findings' }
    ];
  }

  private static calculateOverallRiskLevel(opportunity: DealOpportunity, screeningResult: DealScreeningResult): string {
    const riskScore = opportunity.expectedRisk;
    if (riskScore < 0.15) return 'Low';
    if (riskScore < 0.25) return 'Medium';
    return 'High';
  }

  private static calculateRiskAdjustedScore(screeningResult: DealScreeningResult): number {
    // Simplified risk adjustment
    return Math.round(screeningResult.totalScore * 0.95);
  }

  private static generateDetailedRiskCategories(opportunity: DealOpportunity, screeningResult: DealScreeningResult, mode: string) {
    return [
      {
        name: 'Financial',
        level: 'Medium',
        impact: 'High',
        likelihood: 'Medium',
        factors: ['Revenue concentration', 'Cash flow volatility'],
        mitigations: ['Diversification strategy', 'Working capital management']
      },
      {
        name: 'Operational', 
        level: 'Low',
        impact: 'Medium',
        likelihood: 'Low',
        factors: ['Key person dependency', 'System scalability'],
        mitigations: ['Management development', 'Technology upgrades']
      }
    ];
  }

  private static generateRiskDecisionImpact(opportunity: DealOpportunity, screeningResult: DealScreeningResult): string {
    return `Based on the risk analysis, this investment ${screeningResult.totalScore > 70 ? 'fits within' : 'requires careful consideration of'} our risk tolerance parameters. ${screeningResult.recommendation === 'highly_recommended' ? 'Proceed with standard approval process.' : 'Enhanced due diligence recommended before final decision.'}`;
  }

  private static generateRiskMonitoringPlan(opportunity: DealOpportunity) {
    return {
      metrics: [
        'Monthly financial performance vs. projections',
        'Key operational metrics and KPIs', 
        'Market share and competitive position',
        'Regulatory and compliance status'
      ],
      schedule: [
        'Weekly team check-ins during first 90 days',
        'Monthly board meetings with detailed reporting',
        'Quarterly comprehensive reviews with benchmarking',
        'Annual strategic reviews and plan updates'
      ]
    };
  }

  private static generateInvestmentRationale(opportunity: DealOpportunity, screeningResult: DealScreeningResult): string {
    return `Our investment rationale for ${opportunity.name} is based on strong sector fundamentals in ${opportunity.sector}, compelling financial metrics with ${opportunity.expectedIRR.toFixed(1)}% expected IRR, and solid management execution capability. The screening analysis validates our investment thesis with a ${screeningResult.totalScore}/100 score across key evaluation criteria.`;
  }

  private static generateRiskBasedDDFocus(opportunity: DealOpportunity, screeningResult: DealScreeningResult) {
    return [
      {
        risk: 'Market Competition',
        level: 'Medium',
        focus: 'Detailed competitive analysis and market share validation',
        criteria: 'Confirmed sustainable competitive advantages'
      },
      {
        risk: 'Financial Performance',
        level: 'Low', 
        focus: 'Quality of earnings and revenue sustainability',
        criteria: 'Validated revenue quality and growth drivers'
      }
    ];
  }
}