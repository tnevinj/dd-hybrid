import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/database';

// GET /api/exits/[id] - Get specific exit opportunity with related data
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Get the main exit opportunity
    const opportunity = db.prepare(`
      SELECT * FROM exit_opportunities WHERE id = ?
    `).get(id) as any;

    if (!opportunity) {
      return NextResponse.json(
        { error: 'Exit opportunity not found' },
        { status: 404 }
      );
    }

    // Get related processes
    const processes = db.prepare(`
      SELECT * FROM exit_processes WHERE exit_opportunity_id = ? ORDER BY created_at DESC
    `).all(id) as any[];

    // Get related tasks
    const tasks = db.prepare(`
      SELECT * FROM exit_tasks WHERE exit_opportunity_id = ? ORDER BY due_date ASC, priority DESC
    `).all(id) as any[];

    // Get market intelligence
    const marketIntelligence = db.prepare(`
      SELECT * FROM exit_market_intelligence WHERE exit_opportunity_id = ? ORDER BY created_at DESC LIMIT 1
    `).get(id) as any;

    // Get valuations
    const valuations = db.prepare(`
      SELECT * FROM exit_valuations WHERE exit_opportunity_id = ? ORDER BY valuation_date DESC
    `).all(id) as any[];

    // Get documents
    const documents = db.prepare(`
      SELECT * FROM exit_documents WHERE exit_opportunity_id = ? ORDER BY updated_at DESC
    `).all(id) as any[];

    // Get analytics
    const analytics = db.prepare(`
      SELECT * FROM exit_analytics WHERE exit_opportunity_id = ? ORDER BY analysis_date DESC
    `).all(id) as any[];

    // Process JSON fields
    const processedOpportunity = {
      ...opportunity,
      exit_advisors: JSON.parse(opportunity.exit_advisors || '[]'),
      potential_buyers: JSON.parse(opportunity.potential_buyers || '[]'),
      key_selling_points: JSON.parse(opportunity.key_selling_points || '[]'),
      areas_for_improvement: JSON.parse(opportunity.areas_for_improvement || '[]'),
      legal_documents: JSON.parse(opportunity.legal_documents || '[]'),
      ai_insights: JSON.parse(opportunity.ai_insights || '[]'),
      risk_factors: JSON.parse(opportunity.risk_factors || '[]'),
      mitigation_strategies: JSON.parse(opportunity.mitigation_strategies || '[]'),
      target_exit_date: opportunity.target_exit_date ? new Date(opportunity.target_exit_date) : null,
      ai_optimal_exit_date: opportunity.ai_optimal_exit_date ? new Date(opportunity.ai_optimal_exit_date) : null,
      actual_exit_date: opportunity.actual_exit_date ? new Date(opportunity.actual_exit_date) : null,
      created_at: new Date(opportunity.created_at),
      updated_at: new Date(opportunity.updated_at),

      // Related data
      processes: processes.map(p => ({
        ...p,
        team_members: JSON.parse(p.team_members || '[]'),
        dependencies: JSON.parse(p.dependencies || '[]'),
        tasks: JSON.parse(p.tasks || '[]'),
        deliverables: JSON.parse(p.deliverables || '[]'),
        documents: JSON.parse(p.documents || '[]'),
        ai_recommendations: JSON.parse(p.ai_recommendations || '[]'),
        ai_risk_assessment: JSON.parse(p.ai_risk_assessment || '{}'),
        start_date: p.start_date ? new Date(p.start_date) : null,
        target_completion_date: p.target_completion_date ? new Date(p.target_completion_date) : null,
        actual_completion_date: p.actual_completion_date ? new Date(p.actual_completion_date) : null,
        created_at: new Date(p.created_at),
        updated_at: new Date(p.updated_at)
      })),
      
      tasks: tasks.map(t => ({
        ...t,
        dependencies: JSON.parse(t.dependencies || '[]'),
        blocking_factors: JSON.parse(t.blocking_factors || '[]'),
        deliverables: JSON.parse(t.deliverables || '[]'),
        documents: JSON.parse(t.documents || '[]'),
        ai_suggestions: JSON.parse(t.ai_suggestions || '[]'),
        due_date: t.due_date ? new Date(t.due_date) : null,
        completion_date: t.completion_date ? new Date(t.completion_date) : null,
        created_at: new Date(t.created_at),
        updated_at: new Date(t.updated_at)
      })),

      market_intelligence: marketIntelligence ? {
        ...marketIntelligence,
        market_trends: JSON.parse(marketIntelligence.market_trends || '[]'),
        peer_multiples: JSON.parse(marketIntelligence.peer_multiples || '{}'),
        transaction_multiples: JSON.parse(marketIntelligence.transaction_multiples || '{}'),
        public_market_multiples: JSON.parse(marketIntelligence.public_market_multiples || '{}'),
        strategic_buyers: JSON.parse(marketIntelligence.strategic_buyers || '[]'),
        financial_buyers: JSON.parse(marketIntelligence.financial_buyers || '[]'),
        competitive_landscape: JSON.parse(marketIntelligence.competitive_landscape || '[]'),
        data_sources: JSON.parse(marketIntelligence.data_sources || '[]'),
        ai_market_insights: JSON.parse(marketIntelligence.ai_market_insights || '[]'),
        ai_strategy_recommendations: JSON.parse(marketIntelligence.ai_strategy_recommendations || '[]'),
        data_freshness_date: marketIntelligence.data_freshness_date ? new Date(marketIntelligence.data_freshness_date) : null,
        created_at: new Date(marketIntelligence.created_at),
        updated_at: new Date(marketIntelligence.updated_at)
      } : null,

      valuations: valuations.map(v => ({
        ...v,
        key_assumptions: JSON.parse(v.key_assumptions || '{}'),
        sensitivity_analysis: JSON.parse(v.sensitivity_analysis || '{}'),
        comparable_companies: JSON.parse(v.comparable_companies || '[]'),
        transaction_comparables: JSON.parse(v.transaction_comparables || '[]'),
        ai_adjustments: JSON.parse(v.ai_adjustments || '[]'),
        valuation_date: new Date(v.valuation_date),
        created_at: new Date(v.created_at),
        updated_at: new Date(v.updated_at)
      })),

      documents: documents.map(d => ({
        ...d,
        version_history: JSON.parse(d.version_history || '[]'),
        reviewers: JSON.parse(d.reviewers || '[]'),
        approvers: JSON.parse(d.approvers || '[]'),
        sharing_restrictions: JSON.parse(d.sharing_restrictions || '[]'),
        generation_metadata: JSON.parse(d.generation_metadata || '{}'),
        tags: JSON.parse(d.tags || '[]'),
        expiry_date: d.expiry_date ? new Date(d.expiry_date) : null,
        created_at: new Date(d.created_at),
        updated_at: new Date(d.updated_at)
      })),

      analytics: analytics.map(a => ({
        ...a,
        detailed_scores: JSON.parse(a.detailed_scores || '{}'),
        recommendations: JSON.parse(a.recommendations || '[]'),
        risks: JSON.parse(a.risks || '[]'),
        opportunities: JSON.parse(a.opportunities || '[]'),
        sector_conditions: JSON.parse(a.sector_conditions || '{}'),
        competitive_position: JSON.parse(a.competitive_position || '{}'),
        ai_insights: JSON.parse(a.ai_insights || '[]'),
        analysis_date: new Date(a.analysis_date),
        created_at: new Date(a.created_at),
        updated_at: new Date(a.updated_at)
      }))
    };

    return NextResponse.json({
      opportunity: processedOpportunity
    });

  } catch (error) {
    console.error('Error fetching exit opportunity:', error);
    return NextResponse.json(
      { error: 'Failed to fetch exit opportunity' },
      { status: 500 }
    );
  }
}

// PUT /api/exits/[id] - Update exit opportunity
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();

    // Check if opportunity exists
    const existing = db.prepare('SELECT id FROM exit_opportunities WHERE id = ?').get(id);
    if (!existing) {
      return NextResponse.json(
        { error: 'Exit opportunity not found' },
        { status: 404 }
      );
    }

    // Build update query dynamically
    const allowedFields = [
      'company_name', 'sector', 'exit_strategy', 'status', 'preparation_stage',
      'progress', 'current_valuation', 'target_exit_value', 'ai_predicted_value',
      'original_investment', 'expected_irr', 'expected_moic', 'target_exit_date',
      'ai_optimal_exit_date', 'holding_period_months', 'market_timing_score',
      'ai_exit_score', 'market_conditions', 'exit_team_lead', 'compliance_status',
      'automation_level', 'priority'
    ];

    const arrayFields = [
      'exit_advisors', 'potential_buyers', 'key_selling_points',
      'areas_for_improvement', 'legal_documents', 'ai_insights',
      'risk_factors', 'mitigation_strategies'
    ];

    const updates: string[] = [];
    const values: any[] = [];

    // Handle regular fields
    allowedFields.forEach(field => {
      if (body[field] !== undefined) {
        updates.push(`${field} = ?`);
        values.push(body[field]);
      }
    });

    // Handle array fields (need JSON stringification)
    arrayFields.forEach(field => {
      if (body[field] !== undefined) {
        updates.push(`${field} = ?`);
        values.push(JSON.stringify(body[field]));
      }
    });

    if (updates.length === 0) {
      return NextResponse.json(
        { error: 'No valid fields to update' },
        { status: 400 }
      );
    }

    // Add updated_at timestamp
    updates.push('updated_at = CURRENT_TIMESTAMP');
    values.push(id);

    const updateQuery = `
      UPDATE exit_opportunities 
      SET ${updates.join(', ')}
      WHERE id = ?
    `;

    db.prepare(updateQuery).run(...values);

    // Fetch the updated opportunity
    const updated = db.prepare('SELECT * FROM exit_opportunities WHERE id = ?').get(id) as any;

    // Process JSON fields
    const processedOpportunity = {
      ...updated,
      exit_advisors: JSON.parse(updated.exit_advisors || '[]'),
      potential_buyers: JSON.parse(updated.potential_buyers || '[]'),
      key_selling_points: JSON.parse(updated.key_selling_points || '[]'),
      areas_for_improvement: JSON.parse(updated.areas_for_improvement || '[]'),
      legal_documents: JSON.parse(updated.legal_documents || '[]'),
      ai_insights: JSON.parse(updated.ai_insights || '[]'),
      risk_factors: JSON.parse(updated.risk_factors || '[]'),
      mitigation_strategies: JSON.parse(updated.mitigation_strategies || '[]'),
      target_exit_date: updated.target_exit_date ? new Date(updated.target_exit_date) : null,
      ai_optimal_exit_date: updated.ai_optimal_exit_date ? new Date(updated.ai_optimal_exit_date) : null,
      actual_exit_date: updated.actual_exit_date ? new Date(updated.actual_exit_date) : null,
      created_at: new Date(updated.created_at),
      updated_at: new Date(updated.updated_at)
    };

    return NextResponse.json({
      success: true,
      opportunity: processedOpportunity
    });

  } catch (error) {
    console.error('Error updating exit opportunity:', error);
    return NextResponse.json(
      { error: 'Failed to update exit opportunity' },
      { status: 500 }
    );
  }
}

// DELETE /api/exits/[id] - Delete exit opportunity
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Check if opportunity exists
    const existing = db.prepare('SELECT id FROM exit_opportunities WHERE id = ?').get(id);
    if (!existing) {
      return NextResponse.json(
        { error: 'Exit opportunity not found' },
        { status: 404 }
      );
    }

    // Delete the opportunity (CASCADE will handle related records)
    db.prepare('DELETE FROM exit_opportunities WHERE id = ?').run(id);

    return NextResponse.json({
      success: true,
      message: 'Exit opportunity deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting exit opportunity:', error);
    return NextResponse.json(
      { error: 'Failed to delete exit opportunity' },
      { status: 500 }
    );
  }
}