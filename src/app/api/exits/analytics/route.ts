import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/database';

// POST /api/exits/analytics - Generate analytics for exit opportunity
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { exit_opportunity_id, analysis_type } = body;

    if (!exit_opportunity_id || !analysis_type) {
      return NextResponse.json(
        { error: 'exit_opportunity_id and analysis_type are required' },
        { status: 400 }
      );
    }

    // Check if exit opportunity exists
    const opportunity = db.prepare(
      'SELECT * FROM exit_opportunities WHERE id = ?'
    ).get(exit_opportunity_id) as any;

    if (!opportunity) {
      return NextResponse.json(
        { error: 'Exit opportunity not found' },
        { status: 404 }
      );
    }

    // Generate analytics based on type
    let analytics: any = {
      id: `analytics-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      exit_opportunity_id,
      analysis_date: new Date().toISOString(),
      analysis_type,
      ai_generated: true,
      ai_model_version: 'v1.0',
      ai_confidence_score: 0.85,
      data_quality_score: 0.9,
      validation_status: 'pending',
      peer_review_completed: false,
      created_by: 'ai-system'
    };

    switch (analysis_type) {
      case 'market-timing':
        analytics = {
          ...analytics,
          overall_score: 7.5,
          detailed_scores: JSON.stringify({
            market_conditions: 8.0,
            sector_performance: 7.2,
            valuation_multiples: 7.8,
            liquidity_conditions: 6.9
          }),
          market_timing_score: 7.5,
          sector_conditions: JSON.stringify({
            growth_rate: 0.12,
            volatility: 0.18,
            sentiment: 'positive'
          }),
          competitive_position: JSON.stringify({
            market_share: 0.15,
            competitive_advantages: ['technology', 'brand', 'distribution'],
            threats: ['new entrants', 'substitutes']
          }),
          recommendations: JSON.stringify([
            'Market timing is favorable - consider accelerating exit timeline',
            'Strong sector performance supports premium valuations',
            'Monitor regulatory environment for potential impacts'
          ]),
          risks: JSON.stringify([
            'Market volatility could impact IPO timing',
            'Interest rate changes may affect buyer appetite'
          ]),
          opportunities: JSON.stringify([
            'Strategic buyer interest is high in this sector',
            'ESG focus creating premium valuations'
          ]),
          ai_insights: JSON.stringify([
            {
              type: 'opportunity',
              title: 'Market Window',
              description: 'Current market conditions present a favorable 6-month window for exit',
              confidence: 87
            }
          ])
        };
        break;

      case 'readiness':
        analytics = {
          ...analytics,
          overall_score: 6.8,
          detailed_scores: JSON.stringify({
            financial: 7.5,
            operational: 6.2,
            legal: 7.0,
            strategic: 6.5
          }),
          financial_readiness_score: 7.5,
          operational_readiness_score: 6.2,
          legal_readiness_score: 7.0,
          strategic_readiness_score: 6.5,
          recommendations: JSON.stringify([
            'Strengthen operational metrics and KPI reporting',
            'Complete outstanding legal and compliance items',
            'Develop clearer strategic positioning for exit'
          ]),
          risks: JSON.stringify([
            'Operational inefficiencies may impact valuation',
            'Management team depth concerns'
          ]),
          opportunities: JSON.stringify([
            'Strong financial performance supports premium exit',
            'Market-leading position in niche segment'
          ]),
          ai_insights: JSON.stringify([
            {
              type: 'warning',
              title: 'Operational Gaps',
              description: 'Several operational areas need improvement before exit readiness',
              confidence: 78
            }
          ])
        };
        break;

      case 'performance':
        analytics = {
          ...analytics,
          overall_score: 8.2,
          detailed_scores: JSON.stringify({
            financial_performance: 8.5,
            growth_metrics: 7.8,
            profitability: 8.0,
            market_position: 8.5
          }),
          recommendations: JSON.stringify([
            'Excellent performance supports premium exit valuation',
            'Consider strategic sale to maximize returns',
            'Highlight sustainable competitive advantages'
          ]),
          risks: JSON.stringify([
            'Customer concentration risk',
            'Key person dependency'
          ]),
          opportunities: JSON.stringify([
            'Multiple strategic buyers interested',
            'Strong growth trajectory attracts premium'
          ]),
          ai_insights: JSON.stringify([
            {
              type: 'opportunity',
              title: 'Premium Valuation',
              description: 'Performance metrics support 15-20% premium to market multiples',
              confidence: 92
            }
          ])
        };
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid analysis type' },
          { status: 400 }
        );
    }

    // Insert into database
    const stmt = db.prepare(`
      INSERT INTO exit_analytics (
        id, exit_opportunity_id, analysis_date, analysis_type, overall_score,
        detailed_scores, recommendations, risks, opportunities, market_timing_score,
        sector_conditions, competitive_position, financial_readiness_score,
        operational_readiness_score, legal_readiness_score, strategic_readiness_score,
        ai_generated, ai_model_version, ai_confidence_score, ai_insights,
        data_quality_score, validation_status, peer_review_completed, created_by
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      analytics.id,
      analytics.exit_opportunity_id,
      analytics.analysis_date,
      analytics.analysis_type,
      analytics.overall_score,
      analytics.detailed_scores,
      analytics.recommendations,
      analytics.risks,
      analytics.opportunities,
      analytics.market_timing_score || null,
      analytics.sector_conditions || null,
      analytics.competitive_position || null,
      analytics.financial_readiness_score || null,
      analytics.operational_readiness_score || null,
      analytics.legal_readiness_score || null,
      analytics.strategic_readiness_score || null,
      analytics.ai_generated,
      analytics.ai_model_version,
      analytics.ai_confidence_score,
      analytics.ai_insights,
      analytics.data_quality_score,
      analytics.validation_status,
      analytics.peer_review_completed,
      analytics.created_by
    );

    // Fetch the created analytics
    const created = db.prepare('SELECT * FROM exit_analytics WHERE id = ?').get(analytics.id) as any;
    
    // Process JSON fields for response
    const processedAnalytics = {
      ...created,
      detailed_scores: JSON.parse(created.detailed_scores || '{}'),
      recommendations: JSON.parse(created.recommendations || '[]'),
      risks: JSON.parse(created.risks || '[]'),
      opportunities: JSON.parse(created.opportunities || '[]'),
      sector_conditions: created.sector_conditions ? JSON.parse(created.sector_conditions) : null,
      competitive_position: created.competitive_position ? JSON.parse(created.competitive_position) : null,
      ai_insights: JSON.parse(created.ai_insights || '[]'),
      analysis_date: new Date(created.analysis_date),
      created_at: new Date(created.created_at),
      updated_at: new Date(created.updated_at)
    };

    return NextResponse.json({
      success: true,
      analytics: processedAnalytics
    }, { status: 201 });

  } catch (error) {
    console.error('Error generating exit analytics:', error);
    return NextResponse.json(
      { error: 'Failed to generate exit analytics' },
      { status: 500 }
    );
  }
}

// GET /api/exits/analytics - Get all analytics or filtered by opportunity
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const exitOpportunityId = searchParams.get('exit_opportunity_id');
    const analysisType = searchParams.get('analysis_type');

    let query = 'SELECT * FROM exit_analytics WHERE 1=1';
    const params: any[] = [];

    if (exitOpportunityId) {
      query += ' AND exit_opportunity_id = ?';
      params.push(exitOpportunityId);
    }

    if (analysisType) {
      query += ' AND analysis_type = ?';
      params.push(analysisType);
    }

    query += ' ORDER BY analysis_date DESC';

    const analytics = db.prepare(query).all(...params) as any[];

    // Process JSON fields
    const processedAnalytics = analytics.map(a => ({
      ...a,
      detailed_scores: JSON.parse(a.detailed_scores || '{}'),
      recommendations: JSON.parse(a.recommendations || '[]'),
      risks: JSON.parse(a.risks || '[]'),
      opportunities: JSON.parse(a.opportunities || '[]'),
      sector_conditions: a.sector_conditions ? JSON.parse(a.sector_conditions) : null,
      competitive_position: a.competitive_position ? JSON.parse(a.competitive_position) : null,
      ai_insights: JSON.parse(a.ai_insights || '[]'),
      analysis_date: new Date(a.analysis_date),
      created_at: new Date(a.created_at),
      updated_at: new Date(a.updated_at)
    }));

    return NextResponse.json({
      analytics: processedAnalytics
    });

  } catch (error) {
    console.error('Error fetching exit analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch exit analytics' },
      { status: 500 }
    );
  }
}