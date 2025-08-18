import db from '@/lib/database';
import { WorkProduct, DocumentSection, WorkProductStatus, WorkProductType } from '@/types/work-product';

export interface DatabaseWorkProduct {
  id: string;
  workspace_id: string;
  title: string;
  type: WorkProductType;
  status: WorkProductStatus;
  template_id?: string;
  sections: string; // JSON string
  metadata: string; // JSON string
  word_count: number;
  reading_time: number;
  version: string;
  version_history: string; // JSON string
  collaborator_count: number;
  comment_count: number;
  edit_count: number;
  quality_score: number;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateWorkProductData {
  workspace_id: string;
  title: string;
  type: WorkProductType;
  status?: WorkProductStatus;
  template_id?: string;
  sections: DocumentSection[];
  metadata?: any;
  created_by?: string;
}

export class WorkProductService {
  // Get all work products
  static getAll(): WorkProduct[] {
    const stmt = db.prepare(`
      SELECT * FROM work_products 
      ORDER BY updated_at DESC
    `);
    const workProducts = stmt.all() as DatabaseWorkProduct[];
    return workProducts.map(this.dbToWorkProduct);
  }

  // Get work product by ID
  static getById(id: string): WorkProduct | null {
    const stmt = db.prepare(`
      SELECT * FROM work_products 
      WHERE id = ?
    `);
    const workProduct = stmt.get(id) as DatabaseWorkProduct | undefined;
    
    if (!workProduct) return null;
    return this.dbToWorkProduct(workProduct);
  }

  // Get work products by workspace ID
  static getByWorkspaceId(workspaceId: string): WorkProduct[] {
    const stmt = db.prepare(`
      SELECT * FROM work_products 
      WHERE workspace_id = ?
      ORDER BY updated_at DESC
    `);
    const workProducts = stmt.all(workspaceId) as DatabaseWorkProduct[];
    return workProducts.map(this.dbToWorkProduct);
  }

  // Get work products by type
  static getByType(type: WorkProductType): WorkProduct[] {
    const stmt = db.prepare(`
      SELECT * FROM work_products 
      WHERE type = ?
      ORDER BY updated_at DESC
    `);
    const workProducts = stmt.all(type) as DatabaseWorkProduct[];
    return workProducts.map(this.dbToWorkProduct);
  }

  // Get work products by status
  static getByStatus(status: WorkProductStatus): WorkProduct[] {
    const stmt = db.prepare(`
      SELECT * FROM work_products 
      WHERE status = ?
      ORDER BY updated_at DESC
    `);
    const workProducts = stmt.all(status) as DatabaseWorkProduct[];
    return workProducts.map(this.dbToWorkProduct);
  }

  // Create new work product
  static create(data: CreateWorkProductData): WorkProduct {
    const id = `wp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date().toISOString();
    
    // Calculate word count and reading time
    const wordCount = this.calculateWordCount(data.sections);
    const readingTime = Math.ceil(wordCount / 200); // ~200 words per minute
    
    const stmt = db.prepare(`
      INSERT INTO work_products (
        id, workspace_id, title, type, status, template_id, sections, metadata,
        word_count, reading_time, version, version_history, collaborator_count,
        comment_count, edit_count, quality_score, created_by, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    stmt.run(
      id,
      data.workspace_id,
      data.title,
      data.type,
      data.status || 'DRAFT',
      data.template_id || null,
      JSON.stringify(data.sections),
      JSON.stringify(data.metadata || {}),
      wordCount,
      readingTime,
      '1.0',
      JSON.stringify([]),
      1,
      0,
      0,
      0,
      data.created_by || 'system',
      now,
      now
    );
    
    return this.getById(id)!;
  }

  // Update work product
  static update(id: string, data: Partial<CreateWorkProductData>): WorkProduct | null {
    const existing = this.getById(id);
    if (!existing) return null;
    
    const now = new Date().toISOString();
    
    // Build dynamic update query
    const updates: string[] = [];
    const values: any[] = [];
    
    if (data.title !== undefined) {
      updates.push('title = ?');
      values.push(data.title);
    }
    if (data.type !== undefined) {
      updates.push('type = ?');
      values.push(data.type);
    }
    if (data.status !== undefined) {
      updates.push('status = ?');
      values.push(data.status);
    }
    if (data.template_id !== undefined) {
      updates.push('template_id = ?');
      values.push(data.template_id);
    }
    if (data.sections !== undefined) {
      const wordCount = this.calculateWordCount(data.sections);
      const readingTime = Math.ceil(wordCount / 200);
      
      updates.push('sections = ?', 'word_count = ?', 'reading_time = ?');
      values.push(JSON.stringify(data.sections), wordCount, readingTime);
    }
    if (data.metadata !== undefined) {
      updates.push('metadata = ?');
      values.push(JSON.stringify(data.metadata));
    }
    
    // Increment edit count
    updates.push('edit_count = edit_count + 1');
    
    updates.push('updated_at = ?');
    values.push(now);
    values.push(id);
    
    const stmt = db.prepare(`
      UPDATE work_products 
      SET ${updates.join(', ')}
      WHERE id = ?
    `);
    
    stmt.run(...values);
    
    return this.getById(id);
  }

  // Delete work product
  static delete(id: string): boolean {
    const stmt = db.prepare('DELETE FROM work_products WHERE id = ?');
    const result = stmt.run(id);
    return result.changes > 0;
  }

  // Update work product status
  static updateStatus(id: string, status: WorkProductStatus): WorkProduct | null {
    return this.update(id, { status });
  }

  // Add comment count
  static incrementCommentCount(id: string): WorkProduct | null {
    const stmt = db.prepare(`
      UPDATE work_products 
      SET comment_count = comment_count + 1, updated_at = ?
      WHERE id = ?
    `);
    
    stmt.run(new Date().toISOString(), id);
    return this.getById(id);
  }

  // Update quality score
  static updateQualityScore(id: string, score: number): WorkProduct | null {
    const stmt = db.prepare(`
      UPDATE work_products 
      SET quality_score = ?, updated_at = ?
      WHERE id = ?
    `);
    
    stmt.run(score, new Date().toISOString(), id);
    return this.getById(id);
  }

  // Get work product stats
  static getStats() {
    const totalStmt = db.prepare('SELECT COUNT(*) as count FROM work_products');
    const draftStmt = db.prepare('SELECT COUNT(*) as count FROM work_products WHERE status = ?');
    const reviewStmt = db.prepare('SELECT COUNT(*) as count FROM work_products WHERE status = ?');
    const approvedStmt = db.prepare('SELECT COUNT(*) as count FROM work_products WHERE status = ?');
    const byTypeStmt = db.prepare('SELECT type, COUNT(*) as count FROM work_products GROUP BY type');
    const avgWordCountStmt = db.prepare('SELECT AVG(word_count) as avg FROM work_products');
    const avgQualityStmt = db.prepare('SELECT AVG(quality_score) as avg FROM work_products WHERE quality_score > 0');
    
    const total = (totalStmt.get() as { count: number }).count;
    const draft = (draftStmt.get('DRAFT') as { count: number }).count;
    const review = (reviewStmt.get('IN_REVIEW') as { count: number }).count;
    const approved = (approvedStmt.get('APPROVED') as { count: number }).count;
    const byType = byTypeStmt.all() as { type: string; count: number }[];
    const avgWordCount = (avgWordCountStmt.get() as { avg: number }).avg;
    const avgQuality = (avgQualityStmt.get() as { avg: number }).avg;
    
    return {
      total,
      draft,
      review,
      approved,
      archived: total - draft - review - approved,
      byType: byType.reduce((acc, item) => {
        acc[item.type] = item.count;
        return acc;
      }, {} as Record<string, number>),
      avgWordCount: Math.round(avgWordCount || 0),
      avgQuality: Math.round((avgQuality || 0) * 100) / 100
    };
  }

  // Search work products
  static search(query: string): WorkProduct[] {
    const stmt = db.prepare(`
      SELECT * FROM work_products 
      WHERE title LIKE ? OR type LIKE ?
      ORDER BY updated_at DESC
    `);
    const searchTerm = `%${query}%`;
    const workProducts = stmt.all(searchTerm, searchTerm) as DatabaseWorkProduct[];
    return workProducts.map(this.dbToWorkProduct);
  }

  // Get recent work products
  static getRecent(limit: number = 10): WorkProduct[] {
    const stmt = db.prepare(`
      SELECT * FROM work_products 
      ORDER BY updated_at DESC 
      LIMIT ?
    `);
    const workProducts = stmt.all(limit) as DatabaseWorkProduct[];
    return workProducts.map(this.dbToWorkProduct);
  }

  // Helper: Convert database record to WorkProduct
  private static dbToWorkProduct(dbProduct: DatabaseWorkProduct): WorkProduct {
    return {
      id: dbProduct.id,
      workspaceId: dbProduct.workspace_id,
      title: dbProduct.title,
      type: dbProduct.type,
      status: dbProduct.status,
      templateId: dbProduct.template_id,
      sections: JSON.parse(dbProduct.sections),
      metadata: JSON.parse(dbProduct.metadata),
      createdBy: dbProduct.created_by || 'system',
      createdAt: new Date(dbProduct.created_at),
      updatedAt: new Date(dbProduct.updated_at),
      version: dbProduct.version,
      versionHistory: JSON.parse(dbProduct.version_history),
      wordCount: dbProduct.word_count,
      readingTime: dbProduct.reading_time,
      collaboratorCount: dbProduct.collaborator_count,
      commentCount: dbProduct.comment_count,
      editCount: dbProduct.edit_count
    };
  }

  // Helper: Calculate word count from sections
  private static calculateWordCount(sections: DocumentSection[]): number {
    return sections.reduce((total, section) => {
      const words = section.content.split(/\s+/).filter(word => word.length > 0);
      return total + words.length;
    }, 0);
  }
}