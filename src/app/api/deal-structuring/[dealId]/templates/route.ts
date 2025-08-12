import { NextRequest, NextResponse } from 'next/server';
import { AIDealStructuringService } from '@/lib/services/ai-deal-structuring-service';
import { DealStructuringProject } from '@/types/deal-structuring';

// Mock deal data for consistency
const mockDeals: Record<string, DealStructuringProject> = {
  '1': {
    id: '1',
    name: 'TechCorp Secondary',
    type: 'SINGLE_ASSET_CONTINUATION',
    stage: 'STRUCTURING',
    targetValue: 150000000,
    currentValuation: 145000000,
    progress: 75,
    team: [],
    lastUpdated: new Date(),
    keyMetrics: {
      irr: 18.5,
      multiple: 2.3,
      paybackPeriod: 4.2,
      leverage: 3.5,
      equityContribution: 45000000
    },
    riskLevel: 'medium',
    nextMilestone: 'Financial Model Review'
  },
  '2': {
    id: '2',
    name: 'GreenEnergy Fund II',
    type: 'MULTI_ASSET_CONTINUATION',
    stage: 'DUE_DILIGENCE',
    targetValue: 200000000,
    progress: 45,
    team: [],
    lastUpdated: new Date(),
    keyMetrics: {
      irr: 22.1,
      multiple: 2.8,
      paybackPeriod: 3.8,
      leverage: 2.9,
      equityContribution: 70000000
    },
    riskLevel: 'low',
    nextMilestone: 'Management Presentation'
  },
  '3': {
    id: '3',
    name: 'HealthTech Acquisition',
    type: 'LBO_STRUCTURE',
    stage: 'INVESTMENT_COMMITTEE',
    targetValue: 100000000,
    progress: 90,
    team: [],
    lastUpdated: new Date(),
    keyMetrics: {
      irr: 25.3,
      multiple: 3.1,
      paybackPeriod: 3.2,
      leverage: 4.2,
      equityContribution: 25000000
    },
    riskLevel: 'high',
    nextMilestone: 'IC Vote'
  }
};

interface DealTemplate {
  id: string;
  name: string;
  type: 'STRUCTURE' | 'WORKFLOW' | 'FINANCIAL_MODEL' | 'DD_CHECKLIST' | 'LEGAL_DOCS';
  category: string;
  description: string;
  applicableDeals: string[];
  successRate: number;
  avgIRR: number;
  avgTimeToClose: number; // days
  keyComponents: string[];
  riskMitigation: string[];
  prerequisites: string[];
  customizationOptions: Array<{
    parameter: string;
    type: 'number' | 'select' | 'boolean' | 'text';
    defaultValue: any;
    options?: string[];
    description: string;
  }>;
  createdBy: string;
  lastUpdated: string;
  usageCount: number;
}

interface PatternAnalysis {
  matchType: 'exact' | 'similar' | 'partial';
  confidence: number;
  dealId: string;
  dealName: string;
  matchedAttributes: Array<{
    attribute: string;
    similarity: number;
    weight: number;
  }>;
  outcomes: {
    irr: number;
    multiple: number;
    timeToClose: number;
    success: boolean;
    lessonsLearned: string[];
  };
  applicableTemplates: string[];
  riskFactors: string[];
  successFactors: string[];
}

interface TemplateRecommendation {
  templateId: string;
  templateName: string;
  relevanceScore: number;
  reasoning: string;
  expectedBenefit: {
    timeReduction: number; // percentage
    riskReduction: number; // percentage
    irrImprovement: number; // percentage points
  };
  customizationNeeded: boolean;
  implementationComplexity: 'low' | 'medium' | 'high';
  estimatedSetupTime: number; // hours
}

// Mock template database
const mockTemplates: Record<string, DealTemplate> = {
  'tech-secondary-2023': {
    id: 'tech-secondary-2023',
    name: 'Technology Secondary Buyout',
    type: 'STRUCTURE',
    category: 'Technology',
    description: 'Proven structure for technology secondary transactions with management rollover',
    applicableDeals: ['SINGLE_ASSET_CONTINUATION', 'MULTI_ASSET_CONTINUATION'],
    successRate: 0.87,
    avgIRR: 21.3,
    avgTimeToClose: 145,
    keyComponents: [
      'Management equity rollover (15-25%)',
      'Preferred equity structure',
      'Performance-based earnouts',
      'Technology IP protection clauses'
    ],
    riskMitigation: [
      'Key person insurance for technical leadership',
      'Technology obsolescence protection',
      'Customer concentration limits',
      'IP infringement coverage'
    ],
    prerequisites: [
      'Strong recurring revenue base (>60%)',
      'Diversified customer portfolio',
      'Proven management team',
      'Scalable technology platform'
    ],
    customizationOptions: [
      {
        parameter: 'managementRollover',
        type: 'number',
        defaultValue: 20,
        description: 'Management equity rollover percentage'
      },
      {
        parameter: 'leverageTarget',
        type: 'number',
        defaultValue: 3.5,
        description: 'Target debt-to-EBITDA ratio'
      },
      {
        parameter: 'earnoutStructure',
        type: 'select',
        defaultValue: 'revenue-based',
        options: ['revenue-based', 'ebitda-based', 'milestone-based'],
        description: 'Earnout mechanism type'
      }
    ],
    createdBy: 'AI Pattern Recognition',
    lastUpdated: new Date().toISOString(),
    usageCount: 24
  },
  'lbo-healthcare-2024': {
    id: 'lbo-healthcare-2024',
    name: 'Healthcare LBO Structure',
    type: 'STRUCTURE',
    category: 'Healthcare',
    description: 'Specialized LBO structure for healthcare acquisitions with regulatory considerations',
    applicableDeals: ['LBO_STRUCTURE'],
    successRate: 0.79,
    avgIRR: 19.8,
    avgTimeToClose: 178,
    keyComponents: [
      'Regulatory compliance framework',
      'Quality metrics tracking',
      'Reimbursement rate optimization',
      'Physician partnership structures'
    ],
    riskMitigation: [
      'Regulatory change protection',
      'Reimbursement rate hedging',
      'Quality score maintenance',
      'Clinical outcome tracking'
    ],
    prerequisites: [
      'Strong quality metrics history',
      'Diversified payor mix',
      'Regulatory compliance track record',
      'Experienced healthcare management'
    ],
    customizationOptions: [
      {
        parameter: 'regulatoryBuffer',
        type: 'number',
        defaultValue: 15,
        description: 'Regulatory compliance buffer percentage'
      },
      {
        parameter: 'payorDiversification',
        type: 'boolean',
        defaultValue: true,
        description: 'Require payor diversification'
      }
    ],
    createdBy: 'Healthcare Team',
    lastUpdated: new Date().toISOString(),
    usageCount: 18
  },
  'green-energy-continuation': {
    id: 'green-energy-continuation',
    name: 'Green Energy Fund Continuation',
    type: 'STRUCTURE',
    category: 'Energy',
    description: 'Multi-asset continuation vehicle for renewable energy portfolios',
    applicableDeals: ['MULTI_ASSET_CONTINUATION'],
    successRate: 0.83,
    avgIRR: 23.1,
    avgTimeToClose: 156,
    keyComponents: [
      'ESG compliance framework',
      'Carbon credit optimization',
      'Regulatory incentive capture',
      'Portfolio diversification strategy'
    ],
    riskMitigation: [
      'Policy change protection',
      'Weather/production risk hedging',
      'Technology obsolescence coverage',
      'Grid interconnection security'
    ],
    prerequisites: [
      'Strong ESG credentials',
      'Diversified technology mix',
      'Long-term offtake agreements',
      'Grid interconnection rights'
    ],
    customizationOptions: [
      {
        parameter: 'esgScore',
        type: 'number',
        defaultValue: 85,
        description: 'Target ESG score threshold'
      },
      {
        parameter: 'technologyMix',
        type: 'select',
        defaultValue: 'diversified',
        options: ['solar-focused', 'wind-focused', 'diversified'],
        description: 'Portfolio technology focus'
      }
    ],
    createdBy: 'Energy Team',
    lastUpdated: new Date().toISOString(),
    usageCount: 12
  }
};

// GET /api/deal-structuring/[dealId]/templates
export async function GET(
  request: NextRequest,
  { params }: { params: { dealId: string } }
) {
  try {
    const { dealId } = params;
    const { searchParams } = new URL(request.url);
    const mode = searchParams.get('mode') as 'traditional' | 'assisted' | 'autonomous' || 'assisted';
    const analysisType = searchParams.get('type') as 'patterns' | 'templates' | 'recommendations' || 'recommendations';

    const deal = mockDeals[dealId];
    if (!deal) {
      return NextResponse.json(
        { error: 'Deal not found', success: false },
        { status: 404 }
      );
    }

    console.log(`Generating ${analysisType} analysis for ${deal.name} in ${mode} mode`);

    // Find similar deal patterns
    const patternMatches = await findSimilarPatterns(deal, mode);
    
    // Generate template recommendations
    const templateRecommendations = await generateTemplateRecommendations(deal, mode);
    
    // Get available templates
    const availableTemplates = await getAvailableTemplates(deal.type, mode);
    
    // Mode-specific capabilities
    const modeCapabilities = {
      traditional: {
        patternAnalysis: 'basic',
        templateLibrary: 'standard',
        customization: false,
        autoApplication: false,
        maxRecommendations: 3
      },
      assisted: {
        patternAnalysis: 'advanced',
        templateLibrary: 'full',
        customization: true,
        autoApplication: false,
        aiOptimization: true,
        maxRecommendations: 6
      },
      autonomous: {
        patternAnalysis: 'ml-powered',
        templateLibrary: 'full',
        customization: true,
        autoApplication: true,
        aiOptimization: true,
        dynamicCreation: true,
        maxRecommendations: 10
      }
    };

    const capabilities = modeCapabilities[mode];

    // Filter results based on mode capabilities
    const filteredPatterns = patternMatches.slice(0, capabilities.maxRecommendations);
    const filteredRecommendations = templateRecommendations.slice(0, capabilities.maxRecommendations);

    return NextResponse.json({
      data: {
        dealId,
        mode,
        analysisType,
        patternAnalysis: {
          matches: filteredPatterns,
          analysisType: capabilities.patternAnalysis,
          confidence: calculatePatternConfidence(filteredPatterns)
        },
        templateRecommendations: filteredRecommendations,
        availableTemplates: availableTemplates.filter(t => 
          capabilities.templateLibrary === 'full' || t.usageCount > 15
        ),
        capabilities: {
          traditional: ['Standard template library', 'Basic pattern matching', 'Manual application'],
          assisted: ['Advanced pattern recognition', 'AI-optimized templates', 'Smart customization'],
          autonomous: ['ML-powered pattern analysis', 'Dynamic template creation', 'Auto-application', 'Continuous optimization']
        }[mode],
        features: {
          customizationAvailable: capabilities.customization,
          autoApplicationEnabled: capabilities.autoApplication,
          aiOptimizationEnabled: capabilities.aiOptimization || false,
          dynamicCreationEnabled: capabilities.dynamicCreation || false
        },
        generatedAt: new Date().toISOString()
      },
      success: true,
    });

  } catch (error) {
    console.error('Error generating template analysis:', error);
    return NextResponse.json(
      { error: 'Failed to generate template analysis', success: false },
      { status: 500 }
    );
  }
}

// POST /api/deal-structuring/[dealId]/templates
export async function POST(
  request: NextRequest,
  { params }: { params: { dealId: string } }
) {
  try {
    const { dealId } = params;
    const body = await request.json();
    const { action, templateId, customizations, mode } = body;

    const deal = mockDeals[dealId];
    if (!deal) {
      return NextResponse.json(
        { error: 'Deal not found', success: false },
        { status: 404 }
      );
    }

    console.log(`Executing template action: ${action} for ${deal.name}`);

    let result;
    switch (action) {
      case 'APPLY_TEMPLATE':
        result = await applyTemplate(deal, templateId, customizations || {}, mode);
        break;
      case 'CUSTOMIZE_TEMPLATE':
        result = await customizeTemplate(deal, templateId, customizations, mode);
        break;
      case 'CREATE_TEMPLATE':
        result = await createCustomTemplate(deal, body.templateData, mode);
        break;
      case 'ANALYZE_FIT':
        result = await analyzeTemplateFit(deal, templateId, mode);
        break;
      case 'AUTO_OPTIMIZE':
        result = await autoOptimizeStructure(deal, mode);
        break;
      default:
        return NextResponse.json(
          { error: 'Invalid action', success: false },
          { status: 400 }
        );
    }

    return NextResponse.json({
      data: {
        dealId,
        action,
        templateId,
        result,
        executedAt: new Date().toISOString()
      },
      success: true,
    });

  } catch (error) {
    console.error('Error executing template action:', error);
    return NextResponse.json(
      { error: 'Failed to execute template action', success: false },
      { status: 500 }
    );
  }
}

// Helper functions
async function findSimilarPatterns(
  deal: DealStructuringProject,
  mode: string
): Promise<PatternAnalysis[]> {
  await new Promise(resolve => setTimeout(resolve, 1200));

  // Use the existing pattern matching from AI service
  const similarDeals = AIDealStructuringService.findSimilarDeals(deal);
  
  return similarDeals.map(similarDeal => ({
    matchType: similarDeal.similarity > 0.85 ? 'exact' as const :
               similarDeal.similarity > 0.70 ? 'similar' as const : 'partial' as const,
    confidence: similarDeal.similarity,
    dealId: similarDeal.dealId,
    dealName: similarDeal.dealName,
    matchedAttributes: similarDeal.matchedAttributes.map(attr => ({
      attribute: attr,
      similarity: 0.80 + Math.random() * 0.15, // Mock similarity scores
      weight: getAttributeWeight(attr)
    })),
    outcomes: similarDeal.outcomes,
    applicableTemplates: getApplicableTemplates(deal.type, similarDeal.applicableStrategies),
    riskFactors: generateRiskFactors(deal.type),
    successFactors: similarDeal.applicableStrategies
  }));
}

async function generateTemplateRecommendations(
  deal: DealStructuringProject,
  mode: string
): Promise<TemplateRecommendation[]> {
  await new Promise(resolve => setTimeout(resolve, 800));

  const recommendations: TemplateRecommendation[] = [];

  // Analyze each template for relevance
  for (const template of Object.values(mockTemplates)) {
    if (!template.applicableDeals.includes(deal.type)) continue;

    const relevanceScore = calculateTemplateRelevance(deal, template);
    if (relevanceScore < 0.5) continue;

    recommendations.push({
      templateId: template.id,
      templateName: template.name,
      relevanceScore,
      reasoning: generateRecommendationReasoning(deal, template),
      expectedBenefit: {
        timeReduction: Math.round(20 + Math.random() * 30), // 20-50%
        riskReduction: Math.round(10 + Math.random() * 20), // 10-30%
        irrImprovement: Math.round((Math.random() * 3) * 10) / 10 // 0-3 percentage points
      },
      customizationNeeded: template.customizationOptions.length > 0,
      implementationComplexity: getImplementationComplexity(template),
      estimatedSetupTime: Math.round(2 + Math.random() * 8) // 2-10 hours
    });
  }

  return recommendations.sort((a, b) => b.relevanceScore - a.relevanceScore);
}

async function getAvailableTemplates(dealType: string, mode: string): Promise<DealTemplate[]> {
  const allTemplates = Object.values(mockTemplates);
  return allTemplates.filter(template => 
    template.applicableDeals.includes(dealType) ||
    (mode === 'autonomous' && template.type === 'WORKFLOW') // Autonomous gets access to all workflow templates
  );
}

function calculatePatternConfidence(patterns: PatternAnalysis[]): number {
  if (patterns.length === 0) return 0;
  const avgConfidence = patterns.reduce((sum, p) => sum + p.confidence, 0) / patterns.length;
  return Math.round(avgConfidence * 100) / 100;
}

function getAttributeWeight(attribute: string): number {
  const weights = {
    'Sector': 0.25,
    'Deal Size': 0.20,
    'Structure Type': 0.30,
    'Geography': 0.10,
    'Risk Profile': 0.15
  };
  return weights[attribute] || 0.10;
}

function getApplicableTemplates(dealType: string, strategies: string[]): string[] {
  const templateMap = {
    'SINGLE_ASSET_CONTINUATION': ['tech-secondary-2023'],
    'LBO_STRUCTURE': ['lbo-healthcare-2024'],
    'MULTI_ASSET_CONTINUATION': ['green-energy-continuation']
  };
  return templateMap[dealType] || [];
}

function generateRiskFactors(dealType: string): string[] {
  const riskMap = {
    'SINGLE_ASSET_CONTINUATION': ['Management retention', 'Market timing', 'Technology obsolescence'],
    'LBO_STRUCTURE': ['Leverage risk', 'Covenant compliance', 'Cash flow volatility'],
    'MULTI_ASSET_CONTINUATION': ['Asset correlation', 'Market concentration', 'Regulatory changes']
  };
  return riskMap[dealType] || [];
}

function calculateTemplateRelevance(deal: DealStructuringProject, template: DealTemplate): number {
  let score = 0.0;

  // Deal type match
  if (template.applicableDeals.includes(deal.type)) score += 0.3;

  // Size compatibility (assume templates work best in certain size ranges)
  const targetSize = deal.targetValue / 1000000; // Convert to millions
  if (targetSize >= 100 && targetSize <= 300) score += 0.2;

  // Success rate bonus
  score += template.successRate * 0.2;

  // Usage popularity bonus
  if (template.usageCount > 15) score += 0.1;

  // Risk level compatibility
  if ((deal.riskLevel === 'low' && template.successRate > 0.8) ||
      (deal.riskLevel === 'medium' && template.successRate > 0.7) ||
      (deal.riskLevel === 'high' && template.riskMitigation.length > 3)) {
    score += 0.2;
  }

  return Math.min(1.0, score);
}

function generateRecommendationReasoning(deal: DealStructuringProject, template: DealTemplate): string {
  const reasons = [];

  if (template.applicableDeals.includes(deal.type)) {
    reasons.push(`Perfect match for ${deal.type.replace(/_/g, ' ').toLowerCase()} deals`);
  }

  if (template.successRate > 0.8) {
    reasons.push(`High success rate (${Math.round(template.successRate * 100)}%)`);
  }

  if (template.avgIRR > (deal.keyMetrics?.irr || 18)) {
    reasons.push(`Historically achieves higher IRR (${template.avgIRR.toFixed(1)}%)`);
  }

  if (template.usageCount > 15) {
    reasons.push('Well-tested and proven approach');
  }

  return reasons.join('; ');
}

function getImplementationComplexity(template: DealTemplate): 'low' | 'medium' | 'high' {
  const componentCount = template.keyComponents.length;
  const customizationCount = template.customizationOptions.length;

  if (componentCount <= 3 && customizationCount <= 2) return 'low';
  if (componentCount <= 5 && customizationCount <= 4) return 'medium';
  return 'high';
}

// Action implementation functions
async function applyTemplate(
  deal: DealStructuringProject,
  templateId: string,
  customizations: any,
  mode: string
) {
  await new Promise(resolve => setTimeout(resolve, 3000));

  const template = mockTemplates[templateId];
  if (!template) throw new Error('Template not found');

  return {
    success: true,
    appliedComponents: template.keyComponents,
    customizationsApplied: Object.keys(customizations).length,
    estimatedImpact: {
      irrIncrease: 1.2,
      timeReduction: 25,
      riskReduction: 15
    },
    nextSteps: [
      'Review applied structure with legal team',
      'Update financial model with new assumptions',
      'Schedule stakeholder alignment meeting'
    ]
  };
}

async function customizeTemplate(deal: DealStructuringProject, templateId: string, customizations: any, mode: string) {
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  return {
    success: true,
    customizedTemplate: {
      id: `${templateId}-custom-${Date.now()}`,
      baseTemplate: templateId,
      customizations: customizations
    },
    validationResults: {
      feasible: true,
      warnings: [],
      recommendations: ['Consider stress testing new parameters']
    }
  };
}

async function createCustomTemplate(deal: DealStructuringProject, templateData: any, mode: string) {
  if (mode !== 'autonomous') {
    throw new Error('Custom template creation only available in autonomous mode');
  }

  await new Promise(resolve => setTimeout(resolve, 4000));
  
  return {
    success: true,
    newTemplate: {
      id: `custom-${deal.type.toLowerCase()}-${Date.now()}`,
      name: templateData.name || `Custom ${deal.name} Template`,
      createdFrom: deal.id,
      estimatedEffectiveness: 0.78
    }
  };
}

async function analyzeTemplateFit(deal: DealStructuringProject, templateId: string, mode: string) {
  await new Promise(resolve => setTimeout(resolve, 1000));

  const template = mockTemplates[templateId];
  const compatibility = calculateTemplateRelevance(deal, template);
  
  return {
    compatibilityScore: compatibility,
    fitAnalysis: {
      strengths: ['Deal type alignment', 'Size compatibility'],
      concerns: compatibility < 0.7 ? ['Limited historical precedent'] : [],
      recommendations: ['Proceed with standard customization']
    }
  };
}

async function autoOptimizeStructure(deal: DealStructuringProject, mode: string) {
  if (mode !== 'autonomous') {
    throw new Error('Auto-optimization only available in autonomous mode');
  }

  await new Promise(resolve => setTimeout(resolve, 5000));
  
  return {
    success: true,
    optimizedStructure: {
      leverageOptimization: 'Reduced to 3.2x for better risk profile',
      equityStructure: 'Added preferred component for enhanced returns',
      riskMitigation: 'Implemented comprehensive covenant package'
    },
    expectedImprovement: {
      irr: 2.1,
      riskScore: -18,
      timeToClose: -12
    }
  };
}