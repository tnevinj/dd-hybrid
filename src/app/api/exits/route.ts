import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/database';
import { ExitOpportunity, ExitFilters, ExitSearchParams } from '@/types/exits';

// GET /api/exits - Retrieve exit opportunities with filtering and search
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Parse query parameters
    const page = parseInt(searchParams.get('page') || '1');
    const perPage = Math.min(parseInt(searchParams.get('per_page') || '10'), 100);
    const offset = (page - 1) * perPage;
    
    // Parse filters
    const filters: ExitFilters = {};
    if (searchParams.get('status')) {
      filters.status = searchParams.get('status')!.split(',') as any[];
    }
    if (searchParams.get('exit_strategy')) {
      filters.exit_strategy = searchParams.get('exit_strategy')!.split(',') as any[];
    }
    if (searchParams.get('sector')) {
      filters.sector = searchParams.get('sector')!.split(',');
    }
    if (searchParams.get('search')) {
      filters.search = searchParams.get('search')!;
    }

    // Build WHERE clause
    let whereConditions: string[] = ['1=1'];
    const params: any[] = [];
    
    if (filters.status && filters.status.length > 0) {
      whereConditions.push(`status IN (${filters.status.map(() => '?').join(',')})`);
      params.push(...filters.status);
    }
    
    if (filters.exit_strategy && filters.exit_strategy.length > 0) {
      whereConditions.push(`exit_strategy IN (${filters.exit_strategy.map(() => '?').join(',')})`);
      params.push(...filters.exit_strategy);
    }
    
    if (filters.sector && filters.sector.length > 0) {
      whereConditions.push(`sector IN (${filters.sector.map(() => '?').join(',')})`);
      params.push(...filters.sector);
    }
    
    if (filters.search) {
      whereConditions.push(`(company_name LIKE ? OR sector LIKE ?)`);
      params.push(`%${filters.search}%`, `%${filters.search}%`);
    }

    const whereClause = whereConditions.join(' AND ');

    // Get total count
    const countQuery = `SELECT COUNT(*) as total FROM exit_opportunities WHERE ${whereClause}`;
    const countResult = db.prepare(countQuery).get(...params) as { total: number };
    const total = countResult.total;

    // Get paginated results
    const sortBy = searchParams.get('sort_by') || 'updated_at';
    const sortDirection = searchParams.get('sort_direction') === 'asc' ? 'ASC' : 'DESC';
    
    const dataQuery = `
      SELECT 
        id,
        portfolio_asset_id,
        investment_id,
        workspace_id,
        company_name,
        sector,
        exit_strategy,
        status,
        preparation_stage,
        progress,
        current_valuation,
        target_exit_value,
        ai_predicted_value,
        original_investment,
        expected_irr,
        expected_moic,
        target_exit_date,
        ai_optimal_exit_date,
        actual_exit_date,
        holding_period_months,
        market_timing_score,
        ai_exit_score,
        market_conditions,
        exit_team_lead,
        exit_advisors,
        potential_buyers,
        key_selling_points,
        areas_for_improvement,
        exit_memo_id,
        valuation_report_id,
        legal_documents,
        compliance_status,
        ai_insights,
        automation_level,
        priority,
        risk_factors,
        mitigation_strategies,
        created_at,
        updated_at
      FROM exit_opportunities 
      WHERE ${whereClause}
      ORDER BY ${sortBy} ${sortDirection}
      LIMIT ? OFFSET ?
    `;
    
    params.push(perPage, offset);
    const opportunities = db.prepare(dataQuery).all(...params) as any[];

    // Parse JSON fields
    const processedOpportunities = opportunities.map(opp => ({
      ...opp,
      exit_advisors: JSON.parse(opp.exit_advisors || '[]'),
      potential_buyers: JSON.parse(opp.potential_buyers || '[]'),
      key_selling_points: JSON.parse(opp.key_selling_points || '[]'),
      areas_for_improvement: JSON.parse(opp.areas_for_improvement || '[]'),
      legal_documents: JSON.parse(opp.legal_documents || '[]'),
      ai_insights: JSON.parse(opp.ai_insights || '[]'),
      risk_factors: JSON.parse(opp.risk_factors || '[]'),
      mitigation_strategies: JSON.parse(opp.mitigation_strategies || '[]'),
      target_exit_date: opp.target_exit_date ? new Date(opp.target_exit_date) : null,
      ai_optimal_exit_date: opp.ai_optimal_exit_date ? new Date(opp.ai_optimal_exit_date) : null,
      actual_exit_date: opp.actual_exit_date ? new Date(opp.actual_exit_date) : null,
      created_at: new Date(opp.created_at),
      updated_at: new Date(opp.updated_at)
    }));

    const hasMore = total > page * perPage;

    return NextResponse.json({
      opportunities: processedOpportunities,
      total,
      page,
      per_page: perPage,
      has_more: hasMore
    });

  } catch (error) {
    console.error('Error fetching exit opportunities:', error);
    return NextResponse.json(
      { error: 'Failed to fetch exit opportunities' },
      { status: 500 }
    );
  }
}

// POST /api/exits - Create new exit opportunity
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Generate ID
    const id = `exit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // Prepare data with defaults
    const exitData = {
      id,
      portfolio_asset_id: body.portfolio_asset_id || null,
      investment_id: body.investment_id || null,
      workspace_id: body.workspace_id || null,
      company_name: body.company_name,
      sector: body.sector || null,
      exit_strategy: body.exit_strategy,
      status: body.status || 'planning',
      preparation_stage: body.preparation_stage || 'not-started',
      progress: body.progress || 0,
      current_valuation: body.current_valuation || null,
      target_exit_value: body.target_exit_value || null,
      ai_predicted_value: body.ai_predicted_value || null,
      original_investment: body.original_investment || null,
      expected_irr: body.expected_irr || null,
      expected_moic: body.expected_moic || null,
      target_exit_date: body.target_exit_date || null,
      ai_optimal_exit_date: body.ai_optimal_exit_date || null,
      actual_exit_date: body.actual_exit_date || null,
      holding_period_months: body.holding_period_months || null,
      market_timing_score: body.market_timing_score || 0,
      ai_exit_score: body.ai_exit_score || 0,
      market_conditions: body.market_conditions || 'fair',
      exit_team_lead: body.exit_team_lead || null,
      exit_advisors: JSON.stringify(body.exit_advisors || []),
      potential_buyers: JSON.stringify(body.potential_buyers || []),
      key_selling_points: JSON.stringify(body.key_selling_points || []),
      areas_for_improvement: JSON.stringify(body.areas_for_improvement || []),
      exit_memo_id: body.exit_memo_id || null,
      valuation_report_id: body.valuation_report_id || null,
      legal_documents: JSON.stringify(body.legal_documents || []),
      compliance_status: body.compliance_status || 'pending',
      ai_insights: JSON.stringify(body.ai_insights || []),
      automation_level: body.automation_level || 'manual',
      priority: body.priority || 'medium',
      risk_factors: JSON.stringify(body.risk_factors || []),
      mitigation_strategies: JSON.stringify(body.mitigation_strategies || [])
    };

    // Insert into database
    const stmt = db.prepare(`
      INSERT INTO exit_opportunities (
        id, portfolio_asset_id, investment_id, workspace_id, company_name, sector,
        exit_strategy, status, preparation_stage, progress, current_valuation,
        target_exit_value, ai_predicted_value, original_investment, expected_irr,
        expected_moic, target_exit_date, ai_optimal_exit_date, actual_exit_date,
        holding_period_months, market_timing_score, ai_exit_score, market_conditions,
        exit_team_lead, exit_advisors, potential_buyers, key_selling_points,
        areas_for_improvement, exit_memo_id, valuation_report_id, legal_documents,
        compliance_status, ai_insights, automation_level, priority, risk_factors,
        mitigation_strategies
      ) VALUES (
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
      )
    `);

    stmt.run(...Object.values(exitData));

    // Fetch the created opportunity
    const created = db.prepare('SELECT * FROM exit_opportunities WHERE id = ?').get(id) as any;
    
    // Process JSON fields for response
    const processedOpportunity = {
      ...created,
      exit_advisors: JSON.parse(created.exit_advisors || '[]'),
      potential_buyers: JSON.parse(created.potential_buyers || '[]'),
      key_selling_points: JSON.parse(created.key_selling_points || '[]'),
      areas_for_improvement: JSON.parse(created.areas_for_improvement || '[]'),
      legal_documents: JSON.parse(created.legal_documents || '[]'),
      ai_insights: JSON.parse(created.ai_insights || '[]'),
      risk_factors: JSON.parse(created.risk_factors || '[]'),
      mitigation_strategies: JSON.parse(created.mitigation_strategies || '[]'),
      target_exit_date: created.target_exit_date ? new Date(created.target_exit_date) : null,
      ai_optimal_exit_date: created.ai_optimal_exit_date ? new Date(created.ai_optimal_exit_date) : null,
      actual_exit_date: created.actual_exit_date ? new Date(created.actual_exit_date) : null,
      created_at: new Date(created.created_at),
      updated_at: new Date(created.updated_at)
    };

    return NextResponse.json({
      success: true,
      opportunity: processedOpportunity
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating exit opportunity:', error);
    return NextResponse.json(
      { error: 'Failed to create exit opportunity' },
      { status: 500 }
    );
  }
}