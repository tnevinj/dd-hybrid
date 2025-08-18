import db from '@/lib/database';
import { ProjectContext } from '@/types/work-product';

export interface Workspace {
  id: string;
  name: string;
  type: 'portfolio' | 'deal' | 'company' | 'report' | 'analysis';
  status: 'active' | 'completed' | 'draft' | 'review';
  sector?: string;
  deal_value?: number; // In cents for precision
  stage?: string;
  geography?: string;
  risk_rating?: 'low' | 'medium' | 'high';
  priority?: 'low' | 'medium' | 'high';
  progress?: number; // 0-100
  team_members?: string[];
  metadata?: any;
  created_at: string;
  updated_at: string;
}

export interface CreateWorkspaceData {
  name: string;
  type: Workspace['type'];
  status?: Workspace['status'];
  sector?: string;
  deal_value?: number;
  stage?: string;
  geography?: string;
  risk_rating?: Workspace['risk_rating'];
  priority?: Workspace['priority'];
  progress?: number;
  team_members?: string[];
  metadata?: any;
}

export class WorkspaceService {
  // Get all workspaces
  static getAll(): Workspace[] {
    const stmt = db.prepare(`
      SELECT * FROM workspaces 
      ORDER BY updated_at DESC
    `);
    const workspaces = stmt.all() as Workspace[];
    
    // Parse JSON fields
    return workspaces.map(workspace => ({
      ...workspace,
      team_members: workspace.team_members ? JSON.parse(workspace.team_members as string) : [],
      metadata: workspace.metadata ? JSON.parse(workspace.metadata as string) : {}
    }));
  }

  // Get workspace by ID
  static getById(id: string): Workspace | null {
    const stmt = db.prepare(`
      SELECT * FROM workspaces 
      WHERE id = ?
    `);
    const workspace = stmt.get(id) as Workspace | undefined;
    
    if (!workspace) return null;
    
    // Parse JSON fields
    return {
      ...workspace,
      team_members: workspace.team_members ? JSON.parse(workspace.team_members as string) : [],
      metadata: workspace.metadata ? JSON.parse(workspace.metadata as string) : {}
    };
  }

  // Get workspaces by type
  static getByType(type: Workspace['type']): Workspace[] {
    const stmt = db.prepare(`
      SELECT * FROM workspaces 
      WHERE type = ?
      ORDER BY updated_at DESC
    `);
    const workspaces = stmt.all(type) as Workspace[];
    
    // Parse JSON fields
    return workspaces.map(workspace => ({
      ...workspace,
      team_members: workspace.team_members ? JSON.parse(workspace.team_members as string) : [],
      metadata: workspace.metadata ? JSON.parse(workspace.metadata as string) : {}
    }));
  }

  // Get workspaces by status
  static getByStatus(status: Workspace['status']): Workspace[] {
    const stmt = db.prepare(`
      SELECT * FROM workspaces 
      WHERE status = ?
      ORDER BY updated_at DESC
    `);
    const workspaces = stmt.all(status) as Workspace[];
    
    // Parse JSON fields
    return workspaces.map(workspace => ({
      ...workspace,
      team_members: workspace.team_members ? JSON.parse(workspace.team_members as string) : [],
      metadata: workspace.metadata ? JSON.parse(workspace.metadata as string) : {}
    }));
  }

  // Create new workspace
  static create(data: CreateWorkspaceData): Workspace {
    const id = `ws-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date().toISOString();
    
    const stmt = db.prepare(`
      INSERT INTO workspaces (
        id, name, type, status, sector, deal_value, stage, geography, 
        risk_rating, priority, progress, team_members, metadata, 
        created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    stmt.run(
      id,
      data.name,
      data.type,
      data.status || 'draft',
      data.sector || null,
      data.deal_value || null,
      data.stage || null,
      data.geography || null,
      data.risk_rating || null,
      data.priority || 'medium',
      data.progress || 0,
      JSON.stringify(data.team_members || []),
      JSON.stringify(data.metadata || {}),
      now,
      now
    );
    
    return this.getById(id)!;
  }

  // Update workspace
  static update(id: string, data: Partial<CreateWorkspaceData>): Workspace | null {
    const existing = this.getById(id);
    if (!existing) return null;
    
    const now = new Date().toISOString();
    
    // Build dynamic update query
    const updates: string[] = [];
    const values: any[] = [];
    
    if (data.name !== undefined) {
      updates.push('name = ?');
      values.push(data.name);
    }
    if (data.type !== undefined) {
      updates.push('type = ?');
      values.push(data.type);
    }
    if (data.status !== undefined) {
      updates.push('status = ?');
      values.push(data.status);
    }
    if (data.sector !== undefined) {
      updates.push('sector = ?');
      values.push(data.sector);
    }
    if (data.deal_value !== undefined) {
      updates.push('deal_value = ?');
      values.push(data.deal_value);
    }
    if (data.stage !== undefined) {
      updates.push('stage = ?');
      values.push(data.stage);
    }
    if (data.geography !== undefined) {
      updates.push('geography = ?');
      values.push(data.geography);
    }
    if (data.risk_rating !== undefined) {
      updates.push('risk_rating = ?');
      values.push(data.risk_rating);
    }
    if (data.priority !== undefined) {
      updates.push('priority = ?');
      values.push(data.priority);
    }
    if (data.progress !== undefined) {
      updates.push('progress = ?');
      values.push(data.progress);
    }
    if (data.team_members !== undefined) {
      updates.push('team_members = ?');
      values.push(JSON.stringify(data.team_members));
    }
    if (data.metadata !== undefined) {
      updates.push('metadata = ?');
      values.push(JSON.stringify(data.metadata));
    }
    
    updates.push('updated_at = ?');
    values.push(now);
    values.push(id);
    
    const stmt = db.prepare(`
      UPDATE workspaces 
      SET ${updates.join(', ')}
      WHERE id = ?
    `);
    
    stmt.run(...values);
    
    return this.getById(id);
  }

  // Delete workspace
  static delete(id: string): boolean {
    const stmt = db.prepare('DELETE FROM workspaces WHERE id = ?');
    const result = stmt.run(id);
    return result.changes > 0;
  }

  // Convert workspace to ProjectContext for content generation
  static toProjectContext(workspace: Workspace): ProjectContext {
    return {
      projectId: workspace.id,
      projectName: workspace.name,
      projectType: workspace.type === 'deal' ? 'due-diligence' : 'analysis',
      sector: workspace.sector || 'Technology',
      dealValue: workspace.deal_value || undefined,
      stage: workspace.stage || 'analysis',
      geography: workspace.geography || 'North America',
      riskRating: workspace.risk_rating || 'medium',
      progress: workspace.progress || 0,
      metadata: {
        ...workspace.metadata,
        teamMembers: workspace.team_members,
        status: workspace.status,
        priority: workspace.priority
      }
    };
  }

  // Get workspace stats
  static getStats() {
    const totalStmt = db.prepare('SELECT COUNT(*) as count FROM workspaces');
    const activeStmt = db.prepare('SELECT COUNT(*) as count FROM workspaces WHERE status = ?');
    const completedStmt = db.prepare('SELECT COUNT(*) as count FROM workspaces WHERE status = ?');
    const byTypeStmt = db.prepare('SELECT type, COUNT(*) as count FROM workspaces GROUP BY type');
    
    const total = (totalStmt.get() as { count: number }).count;
    const active = (activeStmt.get('active') as { count: number }).count;
    const completed = (completedStmt.get('completed') as { count: number }).count;
    const byType = byTypeStmt.all() as { type: string; count: number }[];
    
    return {
      total,
      active,
      completed,
      draft: total - active - completed,
      byType: byType.reduce((acc, item) => {
        acc[item.type] = item.count;
        return acc;
      }, {} as Record<string, number>)
    };
  }

  // Search workspaces
  static search(query: string): Workspace[] {
    const stmt = db.prepare(`
      SELECT * FROM workspaces 
      WHERE name LIKE ? OR sector LIKE ? OR stage LIKE ?
      ORDER BY updated_at DESC
    `);
    const searchTerm = `%${query}%`;
    const workspaces = stmt.all(searchTerm, searchTerm, searchTerm) as Workspace[];
    
    // Parse JSON fields
    return workspaces.map(workspace => ({
      ...workspace,
      team_members: workspace.team_members ? JSON.parse(workspace.team_members as string) : [],
      metadata: workspace.metadata ? JSON.parse(workspace.metadata as string) : {}
    }));
  }
}