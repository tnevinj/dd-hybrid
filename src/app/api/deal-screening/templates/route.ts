import { NextRequest, NextResponse } from 'next/server';
import { DealScreeningTemplate, DealScreeningCriterion } from '@/types/deal-screening';

// Mock templates data - in real app this would come from database
export const mockTemplates: DealScreeningTemplate[] = [
  {
    id: 'template-fund-default',
    name: 'Fund Investment (Default)',
    description: 'Standard template for evaluating fund investment opportunities',
    criteria: [
      {
        id: 'criterion-fund-track-record',
        name: 'Fund Manager Track Record',
        category: 'operational',
        description: 'Evaluate the fund manager\'s historical performance and experience',
        weight: 0.25,
        scoreFunction: 'linear',
        minValue: 1,
        maxValue: 10,
        isRequired: true,
        isActive: true,
      },
      {
        id: 'criterion-fund-strategy',
        name: 'Investment Strategy Alignment',
        category: 'strategic',
        description: 'How well does the fund strategy align with portfolio objectives',
        weight: 0.20,
        scoreFunction: 'linear',
        minValue: 1,
        maxValue: 10,
        isRequired: true,
        isActive: true,
      },
      {
        id: 'criterion-fund-financial',
        name: 'Financial Metrics',
        category: 'financial',
        description: 'Expected IRR, multiple, and other financial returns',
        weight: 0.30,
        scoreFunction: 'exponential',
        minValue: 0,
        maxValue: 100,
        thresholdValue: 15, // 15% IRR threshold
        isRequired: true,
        isActive: true,
      },
      {
        id: 'criterion-fund-risk',
        name: 'Risk Assessment',
        category: 'risk',
        description: 'Market risk, concentration risk, and operational risk factors',
        weight: 0.15,
        scoreFunction: 'threshold',
        minValue: 1,
        maxValue: 10,
        thresholdValue: 7,
        isRequired: true,
        isActive: true,
      },
      {
        id: 'criterion-fund-esg',
        name: 'ESG Considerations',
        category: 'impact',
        description: 'Environmental, Social, and Governance factors',
        weight: 0.10,
        scoreFunction: 'linear',
        minValue: 1,
        maxValue: 10,
        isRequired: false,
        isActive: true,
      },
    ],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z',
    createdBy: 'system',
    isDefault: true,
    aiEnhanced: true,
    automationLevel: 'assisted',
    modeSpecificConfig: {
      traditional: { showAllCriteria: true, enableShortcuts: true },
      assisted: { aiSuggestions: true, autoScoring: false, showConfidence: true },
      autonomous: { aiSuggestions: true, autoScoring: true, requireApproval: true },
    },
    assetTypeSpecific: {
      assetType: 'fund',
      specificCriteria: ['criterion-fund-track-record', 'criterion-fund-strategy'],
    },
    analytics: {
      usageCount: 45,
      successRate: 0.78,
      averageScore: 72.5,
      lastUsed: '2024-01-20T14:30:00Z',
      dealsClosed: 35,
      totalDealsEvaluated: 45,
      timesSaved: 120, // minutes
      automationRate: 0.65,
    },
  },
  {
    id: 'template-direct-default',
    name: 'Direct Investment (Default)',
    description: 'Standard template for evaluating direct investment opportunities',
    criteria: [
      {
        id: 'criterion-direct-management',
        name: 'Management Team Quality',
        category: 'operational',
        description: 'Assess the quality and experience of the management team',
        weight: 0.20,
        scoreFunction: 'linear',
        minValue: 1,
        maxValue: 10,
        isRequired: true,
        isActive: true,
      },
      {
        id: 'criterion-direct-market',
        name: 'Market Position & Competition',
        category: 'strategic',
        description: 'Company\'s competitive position and market dynamics',
        weight: 0.25,
        scoreFunction: 'linear',
        minValue: 1,
        maxValue: 10,
        isRequired: true,
        isActive: true,
      },
      {
        id: 'criterion-direct-financial',
        name: 'Financial Performance',
        category: 'financial',
        description: 'Revenue growth, profitability, and financial health',
        weight: 0.30,
        scoreFunction: 'exponential',
        minValue: 0,
        maxValue: 100,
        isRequired: true,
        isActive: true,
      },
      {
        id: 'criterion-direct-scalability',
        name: 'Business Model Scalability',
        category: 'strategic',
        description: 'Potential for scaling the business model',
        weight: 0.15,
        scoreFunction: 'linear',
        minValue: 1,
        maxValue: 10,
        isRequired: true,
        isActive: true,
      },
      {
        id: 'criterion-direct-risk',
        name: 'Operational & Market Risks',
        category: 'risk',
        description: 'Key risks that could impact investment returns',
        weight: 0.10,
        scoreFunction: 'threshold',
        minValue: 1,
        maxValue: 10,
        thresholdValue: 6,
        isRequired: true,
        isActive: true,
      },
    ],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z',
    createdBy: 'system',
    isDefault: true,
    aiEnhanced: true,
    automationLevel: 'assisted',
    modeSpecificConfig: {
      traditional: { showAllCriteria: true, enableShortcuts: true },
      assisted: { aiSuggestions: true, autoScoring: false, showConfidence: true },
      autonomous: { aiSuggestions: true, autoScoring: true, requireApproval: true },
    },
    assetTypeSpecific: {
      assetType: 'direct',
      specificCriteria: ['criterion-direct-management', 'criterion-direct-market', 'criterion-direct-scalability'],
    },
    analytics: {
      usageCount: 28,
      successRate: 0.71,
      averageScore: 69.2,
      lastUsed: '2024-01-22T16:45:00Z',
      dealsClosed: 20,
      totalDealsEvaluated: 28,
      timesSaved: 85,
      automationRate: 0.58,
    },
  },
  {
    id: 'template-gp-led-default',
    name: 'GP-Led Transaction (Default)',
    description: 'Template for evaluating GP-led secondary transactions',
    criteria: [
      {
        id: 'criterion-gp-track-record',
        name: 'GP Historical Performance',
        category: 'operational',
        description: 'GP\'s track record with similar transactions',
        weight: 0.25,
        scoreFunction: 'linear',
        minValue: 1,
        maxValue: 10,
        isRequired: true,
        isActive: true,
      },
      {
        id: 'criterion-gp-assets',
        name: 'Underlying Asset Quality',
        category: 'strategic',
        description: 'Quality and performance of underlying portfolio assets',
        weight: 0.30,
        scoreFunction: 'exponential',
        minValue: 1,
        maxValue: 10,
        isRequired: true,
        isActive: true,
      },
      {
        id: 'criterion-gp-valuation',
        name: 'Valuation & Pricing',
        category: 'financial',
        description: 'Attractiveness of transaction pricing relative to NAV',
        weight: 0.25,
        scoreFunction: 'threshold',
        minValue: 0.5,
        maxValue: 1.2,
        thresholdValue: 0.85, // 85% of NAV threshold
        isRequired: true,
        isActive: true,
      },
      {
        id: 'criterion-gp-liquidity',
        name: 'Liquidity Terms',
        category: 'risk',
        description: 'Expected holding period and exit opportunities',
        weight: 0.20,
        scoreFunction: 'linear',
        minValue: 1,
        maxValue: 10,
        isRequired: true,
        isActive: true,
      },
    ],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z',
    createdBy: 'system',
    isDefault: true,
    aiEnhanced: true,
    automationLevel: 'autonomous',
    modeSpecificConfig: {
      traditional: { showAllCriteria: true, enableShortcuts: true },
      assisted: { aiSuggestions: true, autoScoring: true, showConfidence: true },
      autonomous: { aiSuggestions: true, autoScoring: true, requireApproval: false },
    },
    assetTypeSpecific: {
      assetType: 'gp-led',
      specificCriteria: ['criterion-gp-track-record', 'criterion-gp-assets', 'criterion-gp-liquidity'],
    },
    analytics: {
      usageCount: 12,
      successRate: 0.83,
      averageScore: 76.8,
      lastUsed: '2024-01-19T11:20:00Z',
      dealsClosed: 10,
      totalDealsEvaluated: 12,
      timesSaved: 95,
      automationRate: 0.75,
    },
  },
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const assetType = searchParams.get('assetType');
    const mode = searchParams.get('mode');
    const aiEnhanced = searchParams.get('aiEnhanced');

    let filteredTemplates = [...mockTemplates];

    // Filter by asset type
    if (assetType) {
      filteredTemplates = filteredTemplates.filter(template => 
        template.assetTypeSpecific?.assetType === assetType
      );
    }

    // Filter by AI enhancement
    if (aiEnhanced === 'true') {
      filteredTemplates = filteredTemplates.filter(template => template.aiEnhanced);
    }

    // Apply mode-specific sorting
    if (mode) {
      filteredTemplates = filteredTemplates.sort((a, b) => {
        if (mode === 'autonomous') {
          // Prioritize templates with higher automation levels
          const aAutomation = a.automationLevel === 'autonomous' ? 3 : 
                             a.automationLevel === 'assisted' ? 2 : 1;
          const bAutomation = b.automationLevel === 'autonomous' ? 3 : 
                             b.automationLevel === 'assisted' ? 2 : 1;
          return bAutomation - aAutomation;
        }
        // Default sorting by usage and success rate
        return (b.analytics?.usageCount || 0) * (b.analytics?.successRate || 0) - 
               (a.analytics?.usageCount || 0) * (a.analytics?.successRate || 0);
      });
    }

    return NextResponse.json({
      templates: filteredTemplates,
      metadata: {
        total: filteredTemplates.length,
        assetTypeFilter: assetType,
        modeFilter: mode,
        aiEnhancedFilter: aiEnhanced,
      },
    });
  } catch (error) {
    console.error('Error fetching templates:', error);
    return NextResponse.json(
      { error: 'Failed to fetch templates' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const templateData = await request.json();
    
    // Validate required fields
    if (!templateData.name || !templateData.criteria || !Array.isArray(templateData.criteria)) {
      return NextResponse.json(
        { error: 'Missing required fields: name, criteria' },
        { status: 400 }
      );
    }

    // Validate criteria weights sum to approximately 1
    const totalWeight = templateData.criteria.reduce((sum: number, criterion: any) => sum + criterion.weight, 0);
    if (Math.abs(totalWeight - 1) > 0.01) {
      return NextResponse.json(
        { error: 'Criteria weights must sum to 1.0' },
        { status: 400 }
      );
    }

    const newTemplate: DealScreeningTemplate = {
      id: `template-${Date.now()}`,
      name: templateData.name,
      description: templateData.description || '',
      criteria: templateData.criteria,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: templateData.createdBy || 'user',
      isDefault: false,
      aiEnhanced: templateData.aiEnhanced || false,
      automationLevel: templateData.automationLevel || 'none',
      modeSpecificConfig: templateData.modeSpecificConfig || {
        traditional: { showAllCriteria: true, enableShortcuts: true },
        assisted: { aiSuggestions: true, autoScoring: false, showConfidence: true },
        autonomous: { aiSuggestions: true, autoScoring: true, requireApproval: true },
      },
      assetTypeSpecific: templateData.assetTypeSpecific,
      analytics: {
        usageCount: 0,
        successRate: 0,
        averageScore: 0,
        lastUsed: new Date().toISOString(),
        dealsClosed: 0,
        totalDealsEvaluated: 0,
        timesSaved: 0,
        automationRate: 0,
      },
    };

    // In real app, save to database
    mockTemplates.push(newTemplate);

    return NextResponse.json({
      template: newTemplate,
      message: 'Template created successfully',
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating template:', error);
    return NextResponse.json(
      { error: 'Failed to create template' },
      { status: 500 }
    );
  }
}