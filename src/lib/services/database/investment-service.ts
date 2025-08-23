import db from '@/lib/database';
import { v4 as uuidv4 } from 'uuid';

export interface Investment {
  id: string;
  name: string;
  investment_type: 'internal' | 'external' | 'co_investment' | 'fund';
  asset_type: string;
  description?: string;
  status: 'screening' | 'due_diligence' | 'structuring' | 'active' | 'divested' | 'rejected';
  current_value?: number;
  target_value?: number;
  acquisition_value?: number;
  expected_return?: number;
  expected_risk?: number;
  expected_multiple?: number;
  expected_irr?: number;
  expected_holding_period?: number;
  geography?: string;
  sector?: string;
  risk_rating?: string;
  esg_scores?: any;
  specific_metrics?: any;
  portfolio_id?: string;
  deal_id?: string;
  workspace_id?: string;
  seller?: string;
  vintage?: string;
  nav_percentage?: number;
  due_diligence_project_id?: string;
  submission_id?: string;
  ai_confidence?: number;
  similar_investments?: any[];
  ai_recommendations?: any[];
  acquisition_date?: string;
  location_country?: string;
  location_region?: string;
  location_city?: string;
  jobs_created?: number;
  carbon_footprint?: number;
  sustainability_certifications?: any[];
  tags?: any[];
  created_at: string;
  updated_at: string;
}

export interface CreateInvestmentData {
  name: string;
  investment_type: 'internal' | 'external' | 'co_investment' | 'fund';
  asset_type: string;
  description?: string;
  status: 'screening' | 'due_diligence' | 'structuring' | 'active' | 'divested' | 'rejected';
  current_value?: number;
  target_value?: number;
  acquisition_value?: number;
  expected_return?: number;
  expected_risk?: number;
  expected_multiple?: number;
  expected_irr?: number;
  expected_holding_period?: number;
  geography?: string;
  sector?: string;
  risk_rating?: string;
  esg_scores?: any;
  specific_metrics?: any;
  portfolio_id?: string;
  deal_id?: string;
  workspace_id?: string;
  seller?: string;
  vintage?: string;
  nav_percentage?: number;
  due_diligence_project_id?: string;
  submission_id?: string;
  ai_confidence?: number;
  similar_investments?: any[];
  ai_recommendations?: any[];
  acquisition_date?: string;
  location_country?: string;
  location_region?: string;
  location_city?: string;
  jobs_created?: number;
  carbon_footprint?: number;
  sustainability_certifications?: any[];
  tags?: any[];
}

export interface UpdateInvestmentData {
  name?: string;
  investment_type?: 'internal' | 'external' | 'co_investment' | 'fund';
  asset_type?: string;
  description?: string;
  status?: 'screening' | 'due_diligence' | 'structuring' | 'active' | 'divested' | 'rejected';
  current_value?: number;
  target_value?: number;
  acquisition_value?: number;
  expected_return?: number;
  expected_risk?: number;
  expected_multiple?: number;
  expected_irr?: number;
  expected_holding_period?: number;
  geography?: string;
  sector?: string;
  risk_rating?: string;
  esg_scores?: any;
  specific_metrics?: any;
  portfolio_id?: string;
  deal_id?: string;
  workspace_id?: string;
  seller?: string;
  vintage?: string;
  nav_percentage?: number;
  due_diligence_project_id?: string;
  submission_id?: string;
  ai_confidence?: number;
  similar_investments?: any[];
  ai_recommendations?: any[];
  acquisition_date?: string;
  location_country?: string;
  location_region?: string;
  location_city?: string;
  jobs_created?: number;
  carbon_footprint?: number;
  sustainability_certifications?: any[];
  tags?: any[];
}

export class InvestmentService {
  // Create new investment
  static create(data: CreateInvestmentData): Investment {
    const id = uuidv4();
    const now = new Date().toISOString();
    
    const stmt = db.prepare(`
      INSERT INTO investments (
        id, name, investment_type, asset_type, description, status,
        current_value, target_value, acquisition_value, expected_return,
        expected_risk, expected_multiple, expected_irr, expected_holding_period,
        geography, sector, risk_rating, esg_scores, specific_metrics,
        portfolio_id, deal_id, workspace_id, seller, vintage, nav_percentage,
        due_diligence_project_id, submission_id, ai_confidence, similar_investments,
        ai_recommendations, acquisition_date, location_country, location_region,
        location_city, jobs_created, carbon_footprint, sustainability_certifications,
        tags, created_at, updated_at
      ) VALUES (
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
      )
    `);
    
    stmt.run(
      id,
      data.name,
      data.investment_type,
      data.asset_type,
      data.description || null,
      data.status,
      data.current_value || null,
      data.target_value || null,
      data.acquisition_value || null,
      data.expected_return || null,
      data.expected_risk || null,
      data.expected_multiple || null,
      data.expected_irr || null,
      data.expected_holding_period || null,
      data.geography || null,
      data.sector || null,
      data.risk_rating || null,
      JSON.stringify(data.esg_scores || {}),
      JSON.stringify(data.specific_metrics || {}),
      data.portfolio_id || null,
      data.deal_id || null,
      data.workspace_id || null,
      data.seller || null,
      data.vintage || null,
      data.nav_percentage || null,
      data.due_diligence_project_id || null,
      data.submission_id || null,
      data.ai_confidence || null,
      JSON.stringify(data.similar_investments || []),
      JSON.stringify(data.ai_recommendations || []),
      data.acquisition_date || null,
      data.location_country || null,
      data.location_region || null,
      data.location_city || null,
      data.jobs_created || null,
      data.carbon_footprint || null,
      JSON.stringify(data.sustainability_certifications || []),
      JSON.stringify(data.tags || []),
      now,
      now
    );
    
    return this.getById(id)!;
  }

  // Get investment by ID
  static getById(id: string): Investment | null {
    const stmt = db.prepare('SELECT * FROM investments WHERE id = ?');
    const result = stmt.get(id) as any;
    
    if (!result) return null;
    
    return {
      ...result,
      esg_scores: JSON.parse(result.esg_scores || '{}'),
      specific_metrics: JSON.parse(result.specific_metrics || '{}'),
      similar_investments: JSON.parse(result.similar_investments || '[]'),
      ai_recommendations: JSON.parse(result.ai_recommendations || '[]'),
      sustainability_certifications: JSON.parse(result.sustainability_certifications || '[]'),
      tags: JSON.parse(result.tags || '[]')
    };
  }

  // Get all investments
  static getAll(): Investment[] {
    const stmt = db.prepare('SELECT * FROM investments ORDER BY updated_at DESC');
    const results = stmt.all() as any[];
    
    return results.map(result => ({
      ...result,
      esg_scores: JSON.parse(result.esg_scores || '{}'),
      specific_metrics: JSON.parse(result.specific_metrics || '{}'),
      similar_investments: JSON.parse(result.similar_investments || '[]'),
      ai_recommendations: JSON.parse(result.ai_recommendations || '[]'),
      sustainability_certifications: JSON.parse(result.sustainability_certifications || '[]'),
      tags: JSON.parse(result.tags || '[]')
    }));
  }

  // Get investments by type
  static getByType(investmentType: string): Investment[] {
    const stmt = db.prepare('SELECT * FROM investments WHERE investment_type = ? ORDER BY updated_at DESC');
    const results = stmt.all(investmentType) as any[];
    
    return results.map(result => ({
      ...result,
      esg_scores: JSON.parse(result.esg_scores || '{}'),
      specific_metrics: JSON.parse(result.specific_metrics || '{}'),
      similar_investments: JSON.parse(result.similar_investments || '[]'),
      ai_recommendations: JSON.parse(result.ai_recommendations || '[]'),
      sustainability_certifications: JSON.parse(result.sustainability_certifications || '[]'),
      tags: JSON.parse(result.tags || '[]')
    }));
  }

  // Get investments by status
  static getByStatus(status: string): Investment[] {
    const stmt = db.prepare('SELECT * FROM investments WHERE status = ? ORDER BY updated_at DESC');
    const results = stmt.all(status) as any[];
    
    return results.map(result => ({
      ...result,
      esg_scores: JSON.parse(result.esg_scores || '{}'),
      specific_metrics: JSON.parse(result.specific_metrics || '{}'),
      similar_investments: JSON.parse(result.similar_investments || '[]'),
      ai_recommendations: JSON.parse(result.ai_recommendations || '[]'),
      sustainability_certifications: JSON.parse(result.sustainability_certifications || '[]'),
      tags: JSON.parse(result.tags || '[]')
    }));
  }

  // Get investments by portfolio
  static getByPortfolioId(portfolioId: string): Investment[] {
    const stmt = db.prepare('SELECT * FROM investments WHERE portfolio_id = ? ORDER BY updated_at DESC');
    const results = stmt.all(portfolioId) as any[];
    
    return results.map(result => ({
      ...result,
      esg_scores: JSON.parse(result.esg_scores || '{}'),
      specific_metrics: JSON.parse(result.specific_metrics || '{}'),
      similar_investments: JSON.parse(result.similar_investments || '[]'),
      ai_recommendations: JSON.parse(result.ai_recommendations || '[]'),
      sustainability_certifications: JSON.parse(result.sustainability_certifications || '[]'),
      tags: JSON.parse(result.tags || '[]')
    }));
  }

  // Get investments by deal
  static getByDealId(dealId: string): Investment[] {
    const stmt = db.prepare('SELECT * FROM investments WHERE deal_id = ? ORDER BY updated_at DESC');
    const results = stmt.all(dealId) as any[];
    
    return results.map(result => ({
      ...result,
      esg_scores: JSON.parse(result.esg_scores || '{}'),
      specific_metrics: JSON.parse(result.specific_metrics || '{}'),
      similar_investments: JSON.parse(result.similar_investments || '[]'),
      ai_recommendations: JSON.parse(result.ai_recommendations || '[]'),
      sustainability_certifications: JSON.parse(result.sustainability_certifications || '[]'),
      tags: JSON.parse(result.tags || '[]')
    }));
  }

  // Get investments by workspace
  static getByWorkspaceId(workspaceId: string): Investment[] {
    const stmt = db.prepare('SELECT * FROM investments WHERE workspace_id = ? ORDER BY updated_at DESC');
    const results = stmt.all(workspaceId) as any[];
    
    return results.map(result => ({
      ...result,
      esg_scores: JSON.parse(result.esg_scores || '{}'),
      specific_metrics: JSON.parse(result.specific_metrics || '{}'),
      similar_investments: JSON.parse(result.similar_investments || '[]'),
      ai_recommendations: JSON.parse(result.ai_recommendations || '[]'),
      sustainability_certifications: JSON.parse(result.sustainability_certifications || '[]'),
      tags: JSON.parse(result.tags || '[]')
    }));
  }

  // Update investment
  static update(id: string, data: UpdateInvestmentData): Investment | null {
    const updates: string[] = [];
    const values: any[] = [];
    
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) {
        updates.push(`${key} = ?`);
        if (['esg_scores', 'specific_metrics', 'similar_investments', 'ai_recommendations', 'sustainability_certifications', 'tags'].includes(key)) {
          values.push(JSON.stringify(value));
        } else {
          values.push(value);
        }
      }
    });
    
    if (updates.length === 0) return this.getById(id);
    
    updates.push('updated_at = ?');
    values.push(new Date().toISOString());
    values.push(id);
    
    const stmt = db.prepare(`
      UPDATE investments 
      SET ${updates.join(', ')} 
      WHERE id = ?
    `);
    
    stmt.run(...values);
    return this.getById(id);
  }

  // Delete investment
  static delete(id: string): boolean {
    const stmt = db.prepare('DELETE FROM investments WHERE id = ?');
    const result = stmt.run(id);
    return result.changes > 0;
  }

  // Get investment statistics
  static getStatistics() {
    const totalStmt = db.prepare('SELECT COUNT(*) as total FROM investments');
    const byTypeStmt = db.prepare('SELECT investment_type, COUNT(*) as count FROM investments GROUP BY investment_type');
    const byStatusStmt = db.prepare('SELECT status, COUNT(*) as count FROM investments GROUP BY status');
    const valueStmt = db.prepare('SELECT SUM(current_value) as total_value FROM investments WHERE current_value IS NOT NULL');
    
    return {
      total: (totalStmt.get() as any).total,
      byType: byTypeStmt.all(),
      byStatus: byStatusStmt.all(),
      totalValue: (valueStmt.get() as any).total_value || 0
    };
  }
}
