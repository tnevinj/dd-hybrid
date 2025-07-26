import { NextRequest, NextResponse } from 'next/server';
import { AIRecommendation } from '@/types/deal-screening';

// GET /api/deal-screening/ai/recommendations
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const opportunityId = searchParams.get('opportunityId');
    const category = searchParams.get('category');
    const priority = searchParams.get('priority');
    const limit = searchParams.get('limit');

    // Mock AI recommendations generation
    const recommendations: AIRecommendation[] = [
      {
        id: 'rec-global-1',
        type: 'insight',
        priority: 'high',
        title: 'Market Trend Analysis',
        description: 'Healthcare sector showing 23% outperformance vs. benchmark. Consider increasing allocation.',
        confidence: 0.91,
        category: 'analysis',
        actions: [
          { 
            label: 'View Detailed Analysis', 
            action: 'VIEW_MARKET_ANALYSIS',
            timeEstimate: 5
          },
          { 
            label: 'Adjust Portfolio Allocation', 
            action: 'ADJUST_ALLOCATION',
            timeEstimate: 15
          }
        ],
        reasoning: 'Based on analysis of 127 healthcare deals over the past 18 months'
      },
      {
        id: 'rec-global-2',
        type: 'automation',
        priority: 'medium',
        title: 'Bulk Screening Available',
        description: '8 new opportunities can be automatically screened using existing templates.',
        confidence: 0.87,
        category: 'workflow',
        actions: [
          { 
            label: 'Screen All Automatically', 
            action: 'BULK_SCREEN',
            timeEstimate: 45
          },
          { 
            label: 'Review Individual Deals', 
            action: 'REVIEW_INDIVIDUAL',
            timeEstimate: 180
          }
        ],
        reasoning: 'Machine learning model trained on 2,340 historical screenings'
      },
      {
        id: 'rec-global-3',
        type: 'warning',
        priority: 'critical',
        title: 'Risk Concentration Alert',
        description: 'Technology sector now represents 67% of active pipeline. Consider diversification.',
        confidence: 0.95,
        category: 'analysis',
        actions: [
          { 
            label: 'View Risk Analysis', 
            action: 'VIEW_RISK_ANALYSIS',
            timeEstimate: 10
          },
          { 
            label: 'Find Non-Tech Opportunities', 
            action: 'FIND_DIVERSIFICATION',
            timeEstimate: 30
          }
        ],
        reasoning: 'Portfolio risk model indicates concentration above optimal threshold'
      },
      {
        id: 'rec-global-4',
        type: 'opportunity',
        priority: 'medium',
        title: 'ESG Integration Opportunity',
        description: 'Current pipeline shows 3 ESG-focused deals with superior risk-adjusted returns.',
        confidence: 0.82,
        category: 'scoring',
        actions: [
          { 
            label: 'Prioritize ESG Deals', 
            action: 'PRIORITIZE_ESG',
            timeEstimate: 10
          },
          { 
            label: 'ESG Impact Analysis', 
            action: 'ESG_ANALYSIS',
            timeEstimate: 25
          }
        ],
        reasoning: 'ESG deals showing 15% higher IRR in current market conditions'
      },
      {
        id: 'rec-global-5',
        type: 'suggestion',
        priority: 'low',
        title: 'Template Optimization',
        description: 'Screening template for infrastructure deals can be enhanced based on recent closings.',
        confidence: 0.78,
        category: 'workflow',
        actions: [
          { 
            label: 'Update Template', 
            action: 'UPDATE_TEMPLATE',
            timeEstimate: 20
          },
          { 
            label: 'Review Template Performance', 
            action: 'REVIEW_TEMPLATE',
            timeEstimate: 15
          }
        ],
        reasoning: 'Analysis of 34 infrastructure deals closed in last 12 months'
      }
    ];

    // Apply filters
    let filteredRecommendations = recommendations;

    if (opportunityId) {
      // Generate opportunity-specific recommendations
      filteredRecommendations = [
        {
          id: `rec-opp-${opportunityId}-1`,
          type: 'suggestion',
          priority: 'high',
          title: 'Similar Deal Pattern Detected',
          description: 'This opportunity matches patterns from 3 successful investments in your portfolio.',
          confidence: 0.89,
          category: 'comparison',
          actions: [
            { 
              label: 'Apply Similar Deal Template', 
              action: 'APPLY_SIMILAR_TEMPLATE',
              params: { opportunityId }
            },
            { 
              label: 'View Comparison Analysis', 
              action: 'VIEW_COMPARISON',
              params: { opportunityId }
            }
          ],
          reasoning: `Based on sector, size, and metrics comparison with portfolio deals`
        },
        {
          id: `rec-opp-${opportunityId}-2`,
          type: 'automation',
          priority: 'medium',
          title: 'Automated Due Diligence Available',
          description: 'I can generate initial DD checklist and populate known data points.',
          confidence: 0.85,
          category: 'workflow',
          actions: [
            { 
              label: 'Generate DD Package', 
              action: 'GENERATE_DD_PACKAGE',
              params: { opportunityId },
              timeEstimate: 30
            }
          ],
          reasoning: 'Standard DD templates available for this asset type and sector'
        }
      ];
    }

    if (category) {
      filteredRecommendations = filteredRecommendations.filter(rec => rec.category === category);
    }

    if (priority) {
      filteredRecommendations = filteredRecommendations.filter(rec => rec.priority === priority);
    }

    // Apply limit
    const limitNum = limit ? parseInt(limit) : undefined;
    if (limitNum) {
      filteredRecommendations = filteredRecommendations.slice(0, limitNum);
    }

    // Sort by priority and confidence
    const priorityOrder = { 'critical': 4, 'high': 3, 'medium': 2, 'low': 1 };
    filteredRecommendations.sort((a, b) => {
      const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
      if (priorityDiff !== 0) return priorityDiff;
      return b.confidence - a.confidence;
    });

    return NextResponse.json({
      data: filteredRecommendations,
      metadata: {
        total: recommendations.length,
        filtered: filteredRecommendations.length,
        filters: { opportunityId, category, priority, limit }
      },
      success: true,
    });

  } catch (error) {
    console.error('Error generating AI recommendations:', error);
    return NextResponse.json(
      { error: 'Failed to generate recommendations', success: false },
      { status: 500 }
    );
  }
}

// POST /api/deal-screening/ai/recommendations
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, params } = body;

    // Simulate AI action execution
    let result: any = {};
    let processingTime = 0;

    switch (action) {
      case 'VIEW_MARKET_ANALYSIS':
        result = {
          analysis: {
            sector: 'Healthcare',
            outperformance: '23%',
            confidence: 0.91,
            keyFactors: [
              'Aging population driving demand',
              'Digital health adoption accelerating',
              'Regulatory environment stabilizing'
            ],
            recommendedActions: [
              'Increase healthcare allocation to 35%',
              'Focus on digital therapeutics',
              'Consider healthcare infrastructure plays'
            ]
          }
        };
        processingTime = 2.3;
        break;

      case 'BULK_SCREEN':
        result = {
          screened: 8,
          passed: 5,
          flagged: 2,
          rejected: 1,
          estimatedTimeSaved: '3.2 hours',
          nextSteps: [
            'Review flagged opportunities',
            'Schedule deep dives for passed deals',
            'Update screening criteria based on results'
          ]
        };
        processingTime = 45.7;
        break;

      case 'APPLY_SIMILAR_TEMPLATE':
        const opportunityId = params?.opportunityId;
        result = {
          templateApplied: 'TechGrowth_Template_v2.1',
          matchedDeals: ['CloudCo_2022', 'DataFlow_2023', 'AICore_2023'],
          similarities: [
            'B2B SaaS model',
            'Enterprise customer base',
            'High gross margins (>80%)',
            'Proven management team'
          ],
          adjustedCriteria: [
            'Customer concentration analysis',
            'Technology moat assessment',
            'Competitive positioning review'
          ]
        };
        processingTime = 5.1;
        break;

      case 'GENERATE_DD_PACKAGE':
        result = {
          checklistItems: 47,
          documentsRequired: 23,
          expertCallsScheduled: 4,
          estimatedDDTime: '2-3 weeks',
          keyFocusAreas: [
            'Technology and IP assessment',
            'Customer diversification analysis',
            'Management team evaluation',
            'Financial model validation'
          ]
        };
        processingTime = 12.8;
        break;

      default:
        result = {
          message: `Action ${action} executed successfully`,
          timestamp: new Date().toISOString()
        };
        processingTime = 1.0;
    }

    // Log the action execution (in production, this would go to proper logging)
    console.log(`AI Action executed: ${action}`, { params, result, processingTime });

    return NextResponse.json({
      data: {
        action,
        result,
        processingTime,
        status: 'completed',
        executedAt: new Date().toISOString()
      },
      success: true,
    });

  } catch (error) {
    console.error('Error executing AI action:', error);
    return NextResponse.json(
      { error: 'Failed to execute AI action', success: false },
      { status: 500 }
    );
  }
}

// PUT /api/deal-screening/ai/recommendations (dismiss/update)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { recommendationId, action } = body;

    if (!recommendationId || !action) {
      return NextResponse.json(
        { error: 'Missing recommendationId or action', success: false },
        { status: 400 }
      );
    }

    let result: any = {};

    switch (action) {
      case 'dismiss':
        result = {
          recommendationId,
          dismissed: true,
          dismissedAt: new Date().toISOString(),
          reason: body.reason || 'User dismissed'
        };
        break;

      case 'accept':
        result = {
          recommendationId,
          accepted: true,
          acceptedAt: new Date().toISOString(),
          scheduledFor: body.scheduledFor || 'immediate'
        };
        break;

      case 'modify':
        result = {
          recommendationId,
          modified: true,
          modifiedAt: new Date().toISOString(),
          changes: body.changes || {}
        };
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid action', success: false },
          { status: 400 }
        );
    }

    return NextResponse.json({
      data: result,
      success: true,
    });

  } catch (error) {
    console.error('Error updating recommendation:', error);
    return NextResponse.json(
      { error: 'Failed to update recommendation', success: false },
      { status: 500 }
    );
  }
}