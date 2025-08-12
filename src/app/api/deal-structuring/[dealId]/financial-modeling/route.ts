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

interface ModelingRequest {
  modelType: 'DCF' | 'LBO' | 'SOP' | 'NAV' | 'Comparable';
  parameters?: Record<string, any>;
  mode: 'traditional' | 'assisted' | 'autonomous';
  updateExisting?: boolean;
}

interface ModelingResult {
  modelId: string;
  modelType: string;
  generatedAt: string;
  inputs: Record<string, number>;
  outputs: {
    irr: number;
    multiple: number;
    npv: number;
    paybackPeriod: number;
    leverage: number;
  };
  sensitivity: Array<{
    parameter: string;
    low: number;
    base: number;
    high: number;
    impact: number;
  }>;
  scenarios: {
    bear: Record<string, number>;
    base: Record<string, number>;
    bull: Record<string, number>;
  };
  aiInsights?: {
    recommendations: string[];
    riskFactors: string[];
    confidence: number;
  };
}

// GET /api/deal-structuring/[dealId]/financial-modeling
export async function GET(
  request: NextRequest,
  { params }: { params: { dealId: string } }
) {
  try {
    const { dealId } = params;
    const { searchParams } = new URL(request.url);
    const mode = searchParams.get('mode') as 'traditional' | 'assisted' | 'autonomous' || 'assisted';

    const deal = mockDeals[dealId];
    if (!deal) {
      return NextResponse.json(
        { error: 'Deal not found', success: false },
        { status: 404 }
      );
    }

    console.log(`Generating financial modeling suggestions for ${deal.name} in ${mode} mode`);

    // Generate model suggestions based on deal type and mode
    const modelSuggestions = AIDealStructuringService.generateFinancialModelSuggestions(deal);
    
    // Get existing models (mock data)
    const existingModels = getExistingModels(dealId);
    
    // Generate mode-specific recommendations
    const recommendations = [];
    
    if (mode === 'assisted' || mode === 'autonomous') {
      recommendations.push(
        {
          type: 'model_update',
          priority: 'high',
          title: 'Update DCF with Latest Actuals',
          description: 'Q3 actuals are available and should be incorporated',
          estimatedTime: 30,
          confidence: 0.92
        },
        {
          type: 'sensitivity',
          priority: 'medium', 
          title: 'Run Exit Multiple Sensitivity',
          description: 'Recent market volatility suggests updated exit analysis',
          estimatedTime: 20,
          confidence: 0.85
        }
      );
    }

    if (mode === 'autonomous') {
      recommendations.push({
        type: 'automation',
        priority: 'low',
        title: 'Automate Monthly Model Updates',
        description: 'Set up automated data feeds for ongoing maintenance',
        estimatedTime: 45,
        confidence: 0.78
      });
    }

    return NextResponse.json({
      data: {
        dealId,
        mode,
        suggestedModels: [modelSuggestions],
        existingModels,
        recommendations: mode === 'traditional' ? [] : recommendations,
        capabilities: {
          traditional: ['Manual model building', 'Standard templates', 'Basic analysis'],
          assisted: ['AI parameter suggestions', 'Intelligent sensitivity analysis', 'Risk-adjusted assumptions'],
          autonomous: ['Auto-generated models', 'Real-time updates', 'Continuous optimization']
        }[mode]
      },
      success: true,
    });

  } catch (error) {
    console.error('Error fetching financial modeling data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch modeling data', success: false },
      { status: 500 }
    );
  }
}

// POST /api/deal-structuring/[dealId]/financial-modeling
export async function POST(
  request: NextRequest,
  { params }: { params: { dealId: string } }
) {
  try {
    const { dealId } = params;
    const body: ModelingRequest = await request.json();
    const { modelType, parameters, mode, updateExisting } = body;

    const deal = mockDeals[dealId];
    if (!deal) {
      return NextResponse.json(
        { error: 'Deal not found', success: false },
        { status: 404 }
      );
    }

    console.log(`${updateExisting ? 'Updating' : 'Creating'} ${modelType} model for ${deal.name} in ${mode} mode`);

    // Generate the financial model
    const modelResult = await generateFinancialModel(deal, modelType, parameters || {}, mode);

    // Save model (in production, save to database)
    const modelId = `${dealId}-${modelType}-${Date.now()}`;
    
    // Log the model creation
    console.log(`${modelType} model ${updateExisting ? 'updated' : 'created'} for deal ${dealId}:`, {
      modelId,
      outputs: modelResult.outputs,
      confidence: modelResult.aiInsights?.confidence
    });

    return NextResponse.json({
      data: {
        ...modelResult,
        modelId,
        dealId,
        action: updateExisting ? 'updated' : 'created'
      },
      success: true,
    });

  } catch (error) {
    console.error('Error creating/updating financial model:', error);
    return NextResponse.json(
      { error: 'Failed to process financial model', success: false },
      { status: 500 }
    );
  }
}

// Helper functions
function getExistingModels(dealId: string) {
  // Mock existing models
  return [
    {
      id: `${dealId}-DCF-base`,
      type: 'DCF',
      name: 'Base Case DCF',
      lastUpdated: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'active',
      keyOutputs: { irr: 18.5, multiple: 2.3, npv: 25000000 }
    },
    {
      id: `${dealId}-LBO-scenario`,
      type: 'LBO',
      name: 'LBO Analysis',
      lastUpdated: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'draft',
      keyOutputs: { irr: 22.1, multiple: 2.8, leverage: 3.5 }
    }
  ];
}

async function generateFinancialModel(
  deal: DealStructuringProject,
  modelType: string,
  parameters: Record<string, any>,
  mode: string
): Promise<ModelingResult> {
  // Simulate model generation time
  const processingTime = mode === 'autonomous' ? 2000 : mode === 'assisted' ? 5000 : 8000;
  await new Promise(resolve => setTimeout(resolve, processingTime));

  // Generate model based on deal characteristics
  const baseIRR = deal.keyMetrics?.irr || 18.5;
  const baseMultiple = deal.keyMetrics?.multiple || 2.3;
  
  // Apply model-specific adjustments
  const modelAdjustments = {
    'DCF': { irrAdj: 0, multipleAdj: 0 },
    'LBO': { irrAdj: 3.5, multipleAdj: 0.4 },
    'SOP': { irrAdj: -1.2, multipleAdj: -0.1 },
    'NAV': { irrAdj: -0.8, multipleAdj: -0.2 },
    'Comparable': { irrAdj: 1.1, multipleAdj: 0.2 }
  };

  const adj = modelAdjustments[modelType] || { irrAdj: 0, multipleAdj: 0 };
  
  const outputs = {
    irr: baseIRR + adj.irrAdj,
    multiple: baseMultiple + adj.multipleAdj,
    npv: Math.round((deal.targetValue * 0.15) + (Math.random() - 0.5) * 10000000),
    paybackPeriod: deal.keyMetrics?.paybackPeriod || 4.2,
    leverage: deal.keyMetrics?.leverage || 3.5
  };

  // Generate sensitivity analysis
  const sensitivity = [
    {
      parameter: 'Revenue Growth',
      low: outputs.irr - 3.2,
      base: outputs.irr,
      high: outputs.irr + 2.8,
      impact: 18.5
    },
    {
      parameter: 'Exit Multiple',
      low: outputs.irr - 5.1,
      base: outputs.irr,
      high: outputs.irr + 4.3,
      impact: 25.2
    },
    {
      parameter: 'Leverage',
      low: outputs.irr + 1.8,
      base: outputs.irr,
      high: outputs.irr - 2.1,
      impact: 12.7
    }
  ];

  // Generate scenarios
  const scenarios = {
    bear: {
      irr: outputs.irr - 4.2,
      multiple: outputs.multiple - 0.6,
      npv: outputs.npv - 15000000
    },
    base: {
      irr: outputs.irr,
      multiple: outputs.multiple,
      npv: outputs.npv
    },
    bull: {
      irr: outputs.irr + 3.8,
      multiple: outputs.multiple + 0.5,
      npv: outputs.npv + 12000000
    }
  };

  // Generate AI insights for assisted/autonomous modes
  let aiInsights;
  if (mode === 'assisted' || mode === 'autonomous') {
    aiInsights = {
      recommendations: [
        'Consider increasing revenue growth assumptions by 1-2% based on sector trends',
        'Exit multiple appears conservative relative to recent transactions',
        'Leverage optimization could improve IRR by 150-200bps'
      ],
      riskFactors: [
        'Revenue concentration in top 3 customers',
        'Market multiple compression risk',
        'Interest rate sensitivity on variable debt'
      ],
      confidence: 0.87
    };
  }

  return {
    modelId: '', // Will be set by caller
    modelType,
    generatedAt: new Date().toISOString(),
    inputs: {
      revenueGrowth: parameters.revenueGrowth || 8.5,
      ebitdaMargin: parameters.ebitdaMargin || 35.2,
      discountRate: parameters.discountRate || 12.5,
      terminalGrowth: parameters.terminalGrowth || 3.0,
      leverage: deal.keyMetrics?.leverage || 3.5
    },
    outputs,
    sensitivity,
    scenarios,
    aiInsights
  };
}