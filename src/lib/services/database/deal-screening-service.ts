import Database from 'better-sqlite3';
import path from 'path';

// Create database connection - same as in database.ts
const dbPath = path.join(process.cwd(), 'dd-hybrid.db');
const db = new Database(dbPath);

export interface DealOpportunity {
  id: string;
  name: string;
  description?: string;
  seller?: string;
  asset_type: 'fund' | 'direct' | 'co-investment' | 'gp-led' | 'other';
  vintage?: string;
  sector?: string;
  geography?: string;
  ask_price?: number; // in cents
  nav_percentage?: number;
  expected_return?: number;
  expected_risk?: number;
  expected_multiple?: number;
  expected_irr?: number;
  expected_holding_period?: number; // in months
  due_diligence_project_id?: string;
  submission_id?: string;
  workspace_id?: string;
  status: 'new' | 'screening' | 'analyzed' | 'pending_committee_review' | 'in_due_diligence' | 'awaiting_approval' | 'conditional_approval' | 'investment_approved' | 'documentation_pending' | 'approved' | 'rejected' | 'closed';
  ai_confidence?: number;
  similar_deals?: string[];
  ai_recommendations?: any[];
  created_at: string;
  updated_at: string;
}

export interface DealScreeningTemplate {
  id: string;
  name: string;
  description?: string;
  criteria: any[];
  created_by?: string;
  is_default: boolean;
  ai_enhanced: boolean;
  automation_level: 'none' | 'assisted' | 'autonomous';
  analytics?: any;
  mode_specific_config?: any;
  asset_type_specific?: any;
  created_at: string;
  updated_at: string;
}

export interface DealScore {
  id: string;
  opportunity_id: string;
  template_id?: string;
  criterion_id: string;
  criterion_name: string;
  score: number;
  weight: number;
  comments?: string;
  scored_by?: string;
  scored_at: string;
}

export interface CreateOpportunityData {
  name: string;
  description?: string;
  seller?: string;
  asset_type: 'fund' | 'direct' | 'co-investment' | 'gp-led' | 'other';
  vintage?: string;
  sector?: string;
  geography?: string;
  ask_price?: number;
  nav_percentage?: number;
  expected_return?: number;
  expected_risk?: number;
  expected_multiple?: number;
  expected_irr?: number;
  expected_holding_period?: number;
  workspace_id?: string;
}

export interface CreateTemplateData {
  name: string;
  description?: string;
  criteria: any[];
  created_by?: string;
  is_default?: boolean;
  ai_enhanced?: boolean;
  automation_level?: 'none' | 'assisted' | 'autonomous';
  analytics?: any;
  mode_specific_config?: any;
  asset_type_specific?: any;
}

export class DealOpportunityService {
  static getAll(): DealOpportunity[] {
    const stmt = db.prepare('SELECT * FROM deal_opportunities ORDER BY created_at DESC');
    const opportunities = stmt.all() as DealOpportunity[];
    
    return opportunities.map(opp => ({
      ...opp,
      similar_deals: opp.similar_deals ? JSON.parse(opp.similar_deals as any) : [],
      ai_recommendations: opp.ai_recommendations ? JSON.parse(opp.ai_recommendations as any) : []
    }));
  }

  static getById(id: string): DealOpportunity | null {
    const stmt = db.prepare('SELECT * FROM deal_opportunities WHERE id = ?');
    const opportunity = stmt.get(id) as DealOpportunity | undefined;
    
    if (!opportunity) return null;
    
    return {
      ...opportunity,
      similar_deals: opportunity.similar_deals ? JSON.parse(opportunity.similar_deals as any) : [],
      ai_recommendations: opportunity.ai_recommendations ? JSON.parse(opportunity.ai_recommendations as any) : []
    };
  }

  static getByStatus(status: string): DealOpportunity[] {
    const stmt = db.prepare('SELECT * FROM deal_opportunities WHERE status = ? ORDER BY created_at DESC');
    const opportunities = stmt.all(status) as DealOpportunity[];
    
    return opportunities.map(opp => ({
      ...opp,
      similar_deals: opp.similar_deals ? JSON.parse(opp.similar_deals as any) : [],
      ai_recommendations: opp.ai_recommendations ? JSON.parse(opp.ai_recommendations as any) : []
    }));
  }

  static create(data: CreateOpportunityData): DealOpportunity {
    const id = `deal-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date().toISOString();
    
    const stmt = db.prepare(`
      INSERT INTO deal_opportunities (
        id, name, description, seller, asset_type, vintage, sector, geography,
        ask_price, nav_percentage, expected_return, expected_risk, expected_multiple,
        expected_irr, expected_holding_period, workspace_id, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    stmt.run(
      id,
      data.name,
      data.description || null,
      data.seller || null,
      data.asset_type,
      data.vintage || null,
      data.sector || null,
      data.geography || null,
      data.ask_price || null,
      data.nav_percentage || null,
      data.expected_return || null,
      data.expected_risk || null,
      data.expected_multiple || null,
      data.expected_irr || null,
      data.expected_holding_period || null,
      data.workspace_id || null,
      now,
      now
    );
    
    return this.getById(id)!;
  }

  static update(id: string, updates: Partial<DealOpportunity>): DealOpportunity | null {
    const existing = this.getById(id);
    if (!existing) return null;
    
    const now = new Date().toISOString();
    const fields = [];
    const values = [];
    
    Object.entries(updates).forEach(([key, value]) => {
      if (key !== 'id' && key !== 'created_at' && value !== undefined) {
        fields.push(`${key} = ?`);
        if (key === 'similar_deals' || key === 'ai_recommendations') {
          values.push(JSON.stringify(value));
        } else {
          values.push(value);
        }
      }
    });
    
    if (fields.length === 0) return existing;
    
    fields.push('updated_at = ?');
    values.push(now, id);
    
    const stmt = db.prepare(`UPDATE deal_opportunities SET ${fields.join(', ')} WHERE id = ?`);
    stmt.run(...values);
    
    return this.getById(id);
  }

  static delete(id: string): boolean {
    const stmt = db.prepare('DELETE FROM deal_opportunities WHERE id = ?');
    const result = stmt.run(id);
    return result.changes > 0;
  }
}

export class DealScreeningTemplateService {
  static getAll(): DealScreeningTemplate[] {
    const stmt = db.prepare('SELECT * FROM deal_screening_templates ORDER BY created_at DESC');
    const templates = stmt.all() as DealScreeningTemplate[];
    
    return templates.map(template => ({
      ...template,
      is_default: Boolean(template.is_default),
      ai_enhanced: Boolean(template.ai_enhanced),
      criteria: JSON.parse(template.criteria as any),
      analytics: template.analytics ? JSON.parse(template.analytics as any) : null,
      mode_specific_config: template.mode_specific_config ? JSON.parse(template.mode_specific_config as any) : null,
      asset_type_specific: template.asset_type_specific ? JSON.parse(template.asset_type_specific as any) : null
    }));
  }

  static getById(id: string): DealScreeningTemplate | null {
    const stmt = db.prepare('SELECT * FROM deal_screening_templates WHERE id = ?');
    const template = stmt.get(id) as DealScreeningTemplate | undefined;
    
    if (!template) return null;
    
    return {
      ...template,
      is_default: Boolean(template.is_default),
      ai_enhanced: Boolean(template.ai_enhanced),
      criteria: JSON.parse(template.criteria as any),
      analytics: template.analytics ? JSON.parse(template.analytics as any) : null,
      mode_specific_config: template.mode_specific_config ? JSON.parse(template.mode_specific_config as any) : null,
      asset_type_specific: template.asset_type_specific ? JSON.parse(template.asset_type_specific as any) : null
    };
  }

  static getDefaults(): DealScreeningTemplate[] {
    const stmt = db.prepare('SELECT * FROM deal_screening_templates WHERE is_default = 1 ORDER BY created_at DESC');
    const templates = stmt.all() as DealScreeningTemplate[];
    
    return templates.map(template => ({
      ...template,
      is_default: Boolean(template.is_default),
      ai_enhanced: Boolean(template.ai_enhanced),
      criteria: JSON.parse(template.criteria as any),
      analytics: template.analytics ? JSON.parse(template.analytics as any) : null,
      mode_specific_config: template.mode_specific_config ? JSON.parse(template.mode_specific_config as any) : null,
      asset_type_specific: template.asset_type_specific ? JSON.parse(template.asset_type_specific as any) : null
    }));
  }

  static create(data: CreateTemplateData): DealScreeningTemplate {
    const id = `template-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date().toISOString();
    
    const stmt = db.prepare(`
      INSERT INTO deal_screening_templates (
        id, name, description, criteria, created_by, is_default, ai_enhanced,
        automation_level, analytics, mode_specific_config, asset_type_specific,
        created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    stmt.run(
      id,
      data.name,
      data.description || null,
      JSON.stringify(data.criteria),
      data.created_by || null,
      data.is_default ? 1 : 0,
      data.ai_enhanced ? 1 : 0,
      data.automation_level || 'none',
      data.analytics ? JSON.stringify(data.analytics) : null,
      data.mode_specific_config ? JSON.stringify(data.mode_specific_config) : null,
      data.asset_type_specific ? JSON.stringify(data.asset_type_specific) : null,
      now,
      now
    );
    
    return this.getById(id)!;
  }

  static update(id: string, updates: Partial<DealScreeningTemplate>): DealScreeningTemplate | null {
    const existing = this.getById(id);
    if (!existing) return null;
    
    const now = new Date().toISOString();
    const fields = [];
    const values = [];
    
    Object.entries(updates).forEach(([key, value]) => {
      if (key !== 'id' && key !== 'created_at' && value !== undefined) {
        fields.push(`${key} = ?`);
        if (key === 'criteria' || key === 'analytics' || key === 'mode_specific_config' || key === 'asset_type_specific') {
          values.push(JSON.stringify(value));
        } else {
          values.push(value);
        }
      }
    });
    
    if (fields.length === 0) return existing;
    
    fields.push('updated_at = ?');
    values.push(now, id);
    
    const stmt = db.prepare(`UPDATE deal_screening_templates SET ${fields.join(', ')} WHERE id = ?`);
    stmt.run(...values);
    
    return this.getById(id);
  }

  static delete(id: string): boolean {
    const stmt = db.prepare('DELETE FROM deal_screening_templates WHERE id = ?');
    const result = stmt.run(id);
    return result.changes > 0;
  }
}

export class DealScoreService {
  static getByOpportunityId(opportunityId: string): DealScore[] {
    const stmt = db.prepare('SELECT * FROM deal_scores WHERE opportunity_id = ? ORDER BY scored_at DESC');
    return stmt.all(opportunityId) as DealScore[];
  }

  static create(opportunityId: string, templateId: string | null, criterionId: string, criterionName: string, score: number, weight: number, comments?: string, scoredBy?: string): DealScore {
    const id = `score-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date().toISOString();
    
    const stmt = db.prepare(`
      INSERT INTO deal_scores (
        id, opportunity_id, template_id, criterion_id, criterion_name,
        score, weight, comments, scored_by, scored_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    stmt.run(
      id,
      opportunityId,
      templateId,
      criterionId,
      criterionName,
      score,
      weight,
      comments || null,
      scoredBy || null,
      now
    );
    
    const getStmt = db.prepare('SELECT * FROM deal_scores WHERE id = ?');
    return getStmt.get(id) as DealScore;
  }

  static updateScore(id: string, score: number, comments?: string): DealScore | null {
    const stmt = db.prepare('UPDATE deal_scores SET score = ?, comments = ? WHERE id = ?');
    const result = stmt.run(score, comments || null, id);
    
    if (result.changes === 0) return null;
    
    const getStmt = db.prepare('SELECT * FROM deal_scores WHERE id = ?');
    return getStmt.get(id) as DealScore;
  }

  static delete(id: string): boolean {
    const stmt = db.prepare('DELETE FROM deal_scores WHERE id = ?');
    const result = stmt.run(id);
    return result.changes > 0;
  }
}