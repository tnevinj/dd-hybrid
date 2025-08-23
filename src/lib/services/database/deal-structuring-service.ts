import Database from 'better-sqlite3';
import path from 'path';

// Create database connection - same as in database.ts
const dbPath = path.join(process.cwd(), 'dd-hybrid.db');
const db = new Database(dbPath);

export interface DealStructuringProject {
  id: string;
  name: string;
  type: 'single_asset_continuation' | 'multi_asset_continuation' | 'tender_offer' | 'feeder_fund' | 'preferred_equity' | 'revenue_participation' | 'lbo_structure' | 'synthetic_secondary';
  stage: 'screening' | 'structuring' | 'due_diligence' | 'investment_committee' | 'execution' | 'completed';
  target_value: number;
  current_valuation?: number;
  progress: number;
  team: string; // JSON string of TeamMember[]
  last_updated: string;
  key_metrics: string; // JSON string of DealKeyMetrics
  risk_level: 'low' | 'medium' | 'high';
  next_milestone?: string;
  ai_recommendations?: string; // JSON string of AIRecommendation[]
  workspace_id?: string;
  created_at: string;
  updated_at: string;
}

export interface DealKeyMetrics {
  irr?: number;
  multiple?: number;
  paybackPeriod?: number;
  npv?: number;
  leverage?: number;
  equityContribution?: number;
  debtAmount?: number;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  email?: string;
}

export interface AIRecommendation {
  id: string;
  type: 'suggestion' | 'automation' | 'insight' | 'warning';
  priority: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  actions: RecommendedAction[];
  confidence: number;
  reasoning?: string;
}

export interface RecommendedAction {
  label: string;
  action: string;
  params?: Record<string, any>;
}

export interface CreateDealProjectData {
  name: string;
  type: string;
  stage?: string;
  target_value: number;
  current_valuation?: number;
  progress?: number;
  team?: TeamMember[];
  key_metrics?: DealKeyMetrics;
  risk_level?: 'low' | 'medium' | 'high';
  next_milestone?: string;
  ai_recommendations?: AIRecommendation[];
  workspace_id?: string;
}

export interface DealStructuringActivity {
  id: string;
  title: string;
  deal_id: string;
  type: 'financial' | 'legal' | 'strategic' | 'operational';
  status: 'completed' | 'in_progress' | 'pending';
  date: string;
  user: string;
  created_at: string;
}

export interface DealStructuringDeadline {
  id: string;
  title: string;
  due_date: string;
  deal_id: string;
  priority: 'high' | 'medium' | 'low';
  created_at: string;
}

export interface CreateActivityData {
  title: string;
  deal_id: string;
  type: string;
  status: string;
  user: string;
}

export interface CreateDeadlineData {
  title: string;
  due_date: string;
  deal_id: string;
  priority: string;
}

export class DealStructuringService {
  static getAll(): DealStructuringProject[] {
    const stmt = db.prepare('SELECT * FROM deal_structuring_projects ORDER BY created_at DESC');
    const projects = stmt.all() as DealStructuringProject[];
    
    return projects.map(project => ({
      ...project,
      team: project.team ? JSON.parse(project.team as any) : [],
      key_metrics: project.key_metrics ? JSON.parse(project.key_metrics as any) : {},
      ai_recommendations: project.ai_recommendations ? JSON.parse(project.ai_recommendations as any) : []
    }));
  }

  static getById(id: string): DealStructuringProject | null {
    const stmt = db.prepare('SELECT * FROM deal_structuring_projects WHERE id = ?');
    const project = stmt.get(id) as DealStructuringProject | undefined;
    
    if (!project) return null;
    
    return {
      ...project,
      team: project.team ? JSON.parse(project.team as any) : [],
      key_metrics: project.key_metrics ? JSON.parse(project.key_metrics as any) : {},
      ai_recommendations: project.ai_recommendations ? JSON.parse(project.ai_recommendations as any) : []
    };
  }

  static getByStage(stage: string): DealStructuringProject[] {
    const stmt = db.prepare('SELECT * FROM deal_structuring_projects WHERE stage = ? ORDER BY created_at DESC');
    const projects = stmt.all(stage) as DealStructuringProject[];
    
    return projects.map(project => ({
      ...project,
      team: project.team ? JSON.parse(project.team as any) : [],
      key_metrics: project.key_metrics ? JSON.parse(project.key_metrics as any) : {},
      ai_recommendations: project.ai_recommendations ? JSON.parse(project.ai_recommendations as any) : []
    }));
  }

  static create(data: CreateDealProjectData): DealStructuringProject {
    const id = `deal-struct-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date().toISOString();
    
    const stmt = db.prepare(`
      INSERT INTO deal_structuring_projects (
        id, name, type, stage, target_value, current_valuation, progress,
        team, key_metrics, risk_level, next_milestone, ai_recommendations,
        workspace_id, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    stmt.run(
      id,
      data.name,
      data.type,
      data.stage || 'structuring',
      data.target_value,
      data.current_valuation || null,
      data.progress || 0,
      data.team ? JSON.stringify(data.team) : '[]',
      data.key_metrics ? JSON.stringify(data.key_metrics) : '{}',
      data.risk_level || 'medium',
      data.next_milestone || null,
      data.ai_recommendations ? JSON.stringify(data.ai_recommendations) : '[]',
      data.workspace_id || null,
      now,
      now
    );
    
    return this.getById(id)!;
  }

  static update(id: string, updates: Partial<DealStructuringProject>): DealStructuringProject | null {
    const existing = this.getById(id);
    if (!existing) return null;
    
    const now = new Date().toISOString();
    const fields = [];
    const values = [];
    
    Object.entries(updates).forEach(([key, value]) => {
      if (key !== 'id' && key !== 'created_at' && value !== undefined) {
        fields.push(`${key} = ?`);
        if (key === 'team' || key === 'key_metrics' || key === 'ai_recommendations') {
          values.push(JSON.stringify(value));
        } else {
          values.push(value);
        }
      }
    });
    
    if (fields.length === 0) return existing;
    
    fields.push('updated_at = ?');
    values.push(now, id);
    
    const stmt = db.prepare(`UPDATE deal_structuring_projects SET ${fields.join(', ')} WHERE id = ?`);
    stmt.run(...values);
    
    return this.getById(id);
  }

  static delete(id: string): boolean {
    const stmt = db.prepare('DELETE FROM deal_structuring_projects WHERE id = ?');
    const result = stmt.run(id);
    return result.changes > 0;
  }

  static getMetrics(): {
    activeDeals: number;
    totalValue: number;
    averageProgress: number;
    upcomingDeadlines: number;
    completedThisMonth: number;
    pendingApprovals: number;
  } {
    const projects = this.getAll();
    
    const activeDeals = projects.filter(p => p.stage !== 'completed').length;
    const totalValue = projects.reduce((sum, p) => sum + (p.target_value || 0), 0);
    const averageProgress = projects.length > 0 
      ? Math.round(projects.reduce((sum, p) => sum + p.progress, 0) / projects.length)
      : 0;
    
    // Get deadlines from activities
    const activities = DealStructuringActivityService.getAll();
    const upcomingDeadlines = activities.filter(a => 
      a.status === 'pending' && new Date(a.date) > new Date()
    ).length;
    
    const completedThisMonth = projects.filter(p => 
      p.stage === 'completed' && 
      new Date(p.updated_at).getMonth() === new Date().getMonth() &&
      new Date(p.updated_at).getFullYear() === new Date().getFullYear()
    ).length;
    
    const pendingApprovals = projects.filter(p => 
      p.stage === 'investment_committee'
    ).length;
    
    return {
      activeDeals,
      totalValue,
      averageProgress,
      upcomingDeadlines,
      completedThisMonth,
      pendingApprovals
    };
  }
}

export class DealStructuringActivityService {
  static getAll(): DealStructuringActivity[] {
    const stmt = db.prepare('SELECT * FROM deal_structuring_activities ORDER BY date DESC');
    return stmt.all() as DealStructuringActivity[];
  }

  static getByDealId(dealId: string): DealStructuringActivity[] {
    const stmt = db.prepare('SELECT * FROM deal_structuring_activities WHERE deal_id = ? ORDER BY date DESC');
    return stmt.all(dealId) as DealStructuringActivity[];
  }

  static create(data: CreateActivityData): DealStructuringActivity {
    const id = `activity-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date().toISOString();
    
    const stmt = db.prepare(`
      INSERT INTO deal_structuring_activities (
        id, title, deal_id, type, status, date, user, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    stmt.run(
      id,
      data.title,
      data.deal_id,
      data.type,
      data.status,
      now,
      data.user,
      now
    );
    
    const getStmt = db.prepare('SELECT * FROM deal_structuring_activities WHERE id = ?');
    return getStmt.get(id) as DealStructuringActivity;
  }

  static updateStatus(id: string, status: string): DealStructuringActivity | null {
    const stmt = db.prepare('UPDATE deal_structuring_activities SET status = ? WHERE id = ?');
    const result = stmt.run(status, id);
    
    if (result.changes === 0) return null;
    
    const getStmt = db.prepare('SELECT * FROM deal_structuring_activities WHERE id = ?');
    return getStmt.get(id) as DealStructuringActivity;
  }

  static delete(id: string): boolean {
    const stmt = db.prepare('DELETE FROM deal_structuring_activities WHERE id = ?');
    const result = stmt.run(id);
    return result.changes > 0;
  }
}

export class DealStructuringDeadlineService {
  static getAll(): DealStructuringDeadline[] {
    const stmt = db.prepare('SELECT * FROM deal_structuring_deadlines ORDER BY due_date ASC');
    return stmt.all() as DealStructuringDeadline[];
  }

  static getByDealId(dealId: string): DealStructuringDeadline[] {
    const stmt = db.prepare('SELECT * FROM deal_structuring_deadlines WHERE deal_id = ? ORDER BY due_date ASC');
    return stmt.all(dealId) as DealStructuringDeadline[];
  }

  static getUpcoming(): DealStructuringDeadline[] {
    const stmt = db.prepare('SELECT * FROM deal_structuring_deadlines WHERE due_date >= ? ORDER BY due_date ASC');
    return stmt.all(new Date().toISOString()) as DealStructuringDeadline[];
  }

  static create(data: CreateDeadlineData): DealStructuringDeadline {
    const id = `deadline-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date().toISOString();
    
    const stmt = db.prepare(`
      INSERT INTO deal_structuring_deadlines (
        id, title, due_date, deal_id, priority, created_at
      ) VALUES (?, ?, ?, ?, ?, ?)
    `);
    
    stmt.run(
      id,
      data.title,
      data.due_date,
      data.deal_id,
      data.priority,
      now
    );
    
    const getStmt = db.prepare('SELECT * FROM deal_structuring_deadlines WHERE id = ?');
    return getStmt.get(id) as DealStructuringDeadline;
  }

  static update(id: string, updates: Partial<DealStructuringDeadline>): DealStructuringDeadline | null {
    const existingStmt = db.prepare('SELECT * FROM deal_structuring_deadlines WHERE id = ?');
    const existing = existingStmt.get(id) as DealStructuringDeadline | undefined;
    
    if (!existing) return null;
    
    const fields = [];
    const values = [];
    
    Object.entries(updates).forEach(([key, value]) => {
      if (key !== 'id' && key !== 'created_at' && value !== undefined) {
        fields.push(`${key} = ?`);
        values.push(value);
      }
    });
    
    if (fields.length === 0) return existing;
    
    const stmt = db.prepare(`UPDATE deal_structuring_deadlines SET ${fields.join(', ')} WHERE id = ?`);
    stmt.run(...values, id);
    
    const getStmt = db.prepare('SELECT * FROM deal_structuring_deadlines WHERE id = ?');
    return getStmt.get(id) as DealStructuringDeadline;
  }

  static delete(id: string): boolean {
    const stmt = db.prepare('DELETE FROM deal_structuring_deadlines WHERE id = ?');
    const result = stmt.run(id);
    return result.changes > 0;
  }
}
