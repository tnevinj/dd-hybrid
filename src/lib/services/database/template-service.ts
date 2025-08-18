import db from '@/lib/database';
import { SmartTemplate, TemplateSection, TemplateField, WorkProductType, ProjectContext } from '@/types/work-product';

export interface DatabaseTemplate {
  id: string;
  name: string;
  description?: string;
  category: string;
  work_product_type: WorkProductType;
  industry_focus: string; // JSON string
  context_requirements: string; // JSON string
  sections: string; // JSON string
  dynamic_fields: string; // JSON string
  data_bindings: string; // JSON string
  validation_rules: string; // JSON string
  ai_prompts: string; // JSON string
  customization_options: string; // JSON string
  usage_count: number;
  rating: number;
  success_rate: number;
  avg_generation_time: number;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateTemplateData {
  name: string;
  description?: string;
  category: string;
  work_product_type: WorkProductType;
  industry_focus?: string[];
  context_requirements?: any;
  sections: TemplateSection[];
  dynamic_fields?: TemplateField[];
  data_bindings?: any[];
  validation_rules?: any[];
  ai_prompts?: Record<string, string>;
  customization_options?: any;
  created_by?: string;
}

export class TemplateService {
  // Get all templates
  static getAll(): SmartTemplate[] {
    const stmt = db.prepare(`
      SELECT * FROM templates 
      ORDER BY usage_count DESC, rating DESC
    `);
    const templates = stmt.all() as DatabaseTemplate[];
    return templates.map(this.dbToTemplate);
  }

  // Get template by ID
  static getById(id: string): SmartTemplate | null {
    const stmt = db.prepare(`
      SELECT * FROM templates 
      WHERE id = ?
    `);
    const template = stmt.get(id) as DatabaseTemplate | undefined;
    
    if (!template) return null;
    return this.dbToTemplate(template);
  }

  // Get templates by work product type
  static getByWorkProductType(type: WorkProductType): SmartTemplate[] {
    const stmt = db.prepare(`
      SELECT * FROM templates 
      WHERE work_product_type = ?
      ORDER BY usage_count DESC, rating DESC
    `);
    const templates = stmt.all(type) as DatabaseTemplate[];
    return templates.map(this.dbToTemplate);
  }

  // Get templates by category
  static getByCategory(category: string): SmartTemplate[] {
    const stmt = db.prepare(`
      SELECT * FROM templates 
      WHERE category = ?
      ORDER BY usage_count DESC, rating DESC
    `);
    const templates = stmt.all(category) as DatabaseTemplate[];
    return templates.map(this.dbToTemplate);
  }

  // Find optimal template for project context
  static findOptimalTemplate(
    projectContext: ProjectContext, 
    workProductType?: WorkProductType
  ): SmartTemplate[] {
    let query = `
      SELECT *, 
        CASE 
          WHEN industry_focus LIKE ? THEN 3
          WHEN industry_focus LIKE '%general%' THEN 1
          ELSE 0
        END as industry_score,
        CASE
          WHEN work_product_type = ? THEN 5
          ELSE 0
        END as type_score,
        (usage_count * 0.1 + rating * 2 + success_rate * 3) as popularity_score
      FROM templates
    `;
    
    const params: any[] = [
      `%${projectContext.sector?.toLowerCase() || 'technology'}%`,
      workProductType || 'INVESTMENT_SUMMARY'
    ];
    
    if (workProductType) {
      query += ` WHERE work_product_type = ?`;
      params.push(workProductType);
    }
    
    query += ` ORDER BY (industry_score + type_score + popularity_score) DESC, rating DESC`;
    
    const stmt = db.prepare(query);
    const templates = stmt.all(...params) as (DatabaseTemplate & { 
      industry_score: number; 
      type_score: number; 
      popularity_score: number; 
    })[];
    
    return templates.map(template => ({
      ...this.dbToTemplate(template),
      relevanceScore: (template.industry_score + template.type_score + template.popularity_score) / 10
    }));
  }

  // Create new template
  static create(data: CreateTemplateData): SmartTemplate {
    const id = `tpl-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date().toISOString();
    
    const stmt = db.prepare(`
      INSERT INTO templates (
        id, name, description, category, work_product_type, industry_focus,
        context_requirements, sections, dynamic_fields, data_bindings,
        validation_rules, ai_prompts, customization_options, usage_count,
        rating, success_rate, avg_generation_time, created_by, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    stmt.run(
      id,
      data.name,
      data.description || null,
      data.category,
      data.work_product_type,
      JSON.stringify(data.industry_focus || ['general']),
      JSON.stringify(data.context_requirements || {}),
      JSON.stringify(data.sections),
      JSON.stringify(data.dynamic_fields || []),
      JSON.stringify(data.data_bindings || []),
      JSON.stringify(data.validation_rules || []),
      JSON.stringify(data.ai_prompts || {}),
      JSON.stringify(data.customization_options || {}),
      0,
      0,
      0,
      0,
      data.created_by || 'system',
      now,
      now
    );
    
    return this.getById(id)!;
  }

  // Update template
  static update(id: string, data: Partial<CreateTemplateData>): SmartTemplate | null {
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
    if (data.description !== undefined) {
      updates.push('description = ?');
      values.push(data.description);
    }
    if (data.category !== undefined) {
      updates.push('category = ?');
      values.push(data.category);
    }
    if (data.work_product_type !== undefined) {
      updates.push('work_product_type = ?');
      values.push(data.work_product_type);
    }
    if (data.industry_focus !== undefined) {
      updates.push('industry_focus = ?');
      values.push(JSON.stringify(data.industry_focus));
    }
    if (data.sections !== undefined) {
      updates.push('sections = ?');
      values.push(JSON.stringify(data.sections));
    }
    if (data.dynamic_fields !== undefined) {
      updates.push('dynamic_fields = ?');
      values.push(JSON.stringify(data.dynamic_fields));
    }
    if (data.ai_prompts !== undefined) {
      updates.push('ai_prompts = ?');
      values.push(JSON.stringify(data.ai_prompts));
    }
    
    updates.push('updated_at = ?');
    values.push(now);
    values.push(id);
    
    const stmt = db.prepare(`
      UPDATE templates 
      SET ${updates.join(', ')}
      WHERE id = ?
    `);
    
    stmt.run(...values);
    
    return this.getById(id);
  }

  // Delete template
  static delete(id: string): boolean {
    const stmt = db.prepare('DELETE FROM templates WHERE id = ?');
    const result = stmt.run(id);
    return result.changes > 0;
  }

  // Increment usage count
  static incrementUsage(id: string): SmartTemplate | null {
    const stmt = db.prepare(`
      UPDATE templates 
      SET usage_count = usage_count + 1, updated_at = ?
      WHERE id = ?
    `);
    
    stmt.run(new Date().toISOString(), id);
    return this.getById(id);
  }

  // Update rating
  static updateRating(id: string, rating: number): SmartTemplate | null {
    const stmt = db.prepare(`
      UPDATE templates 
      SET rating = ?, updated_at = ?
      WHERE id = ?
    `);
    
    stmt.run(rating, new Date().toISOString(), id);
    return this.getById(id);
  }

  // Update success rate
  static updateSuccessRate(id: string, successRate: number): SmartTemplate | null {
    const stmt = db.prepare(`
      UPDATE templates 
      SET success_rate = ?, updated_at = ?
      WHERE id = ?
    `);
    
    stmt.run(successRate, new Date().toISOString(), id);
    return this.getById(id);
  }

  // Get template stats
  static getStats() {
    const totalStmt = db.prepare('SELECT COUNT(*) as count FROM templates');
    const byCategoryStmt = db.prepare('SELECT category, COUNT(*) as count FROM templates GROUP BY category');
    const byTypeStmt = db.prepare('SELECT work_product_type, COUNT(*) as count FROM templates GROUP BY work_product_type');
    const avgRatingStmt = db.prepare('SELECT AVG(rating) as avg FROM templates WHERE rating > 0');
    const avgUsageStmt = db.prepare('SELECT AVG(usage_count) as avg FROM templates');
    const mostUsedStmt = db.prepare('SELECT * FROM templates ORDER BY usage_count DESC LIMIT 5');
    
    const total = (totalStmt.get() as { count: number }).count;
    const byCategory = byCategoryStmt.all() as { category: string; count: number }[];
    const byType = byTypeStmt.all() as { work_product_type: string; count: number }[];
    const avgRating = (avgRatingStmt.get() as { avg: number }).avg;
    const avgUsage = (avgUsageStmt.get() as { avg: number }).avg;
    const mostUsed = mostUsedStmt.all() as DatabaseTemplate[];
    
    return {
      total,
      byCategory: byCategory.reduce((acc, item) => {
        acc[item.category] = item.count;
        return acc;
      }, {} as Record<string, number>),
      byType: byType.reduce((acc, item) => {
        acc[item.work_product_type] = item.count;
        return acc;
      }, {} as Record<string, number>),
      avgRating: Math.round((avgRating || 0) * 100) / 100,
      avgUsage: Math.round(avgUsage || 0),
      mostUsed: mostUsed.map(this.dbToTemplate)
    };
  }

  // Search templates
  static search(query: string): SmartTemplate[] {
    const stmt = db.prepare(`
      SELECT * FROM templates 
      WHERE name LIKE ? OR description LIKE ? OR category LIKE ?
      ORDER BY usage_count DESC, rating DESC
    `);
    const searchTerm = `%${query}%`;
    const templates = stmt.all(searchTerm, searchTerm, searchTerm) as DatabaseTemplate[];
    return templates.map(this.dbToTemplate);
  }

  // Get popular templates
  static getPopular(limit: number = 10): SmartTemplate[] {
    const stmt = db.prepare(`
      SELECT * FROM templates 
      ORDER BY usage_count DESC, rating DESC
      LIMIT ?
    `);
    const templates = stmt.all(limit) as DatabaseTemplate[];
    return templates.map(this.dbToTemplate);
  }

  // Helper: Convert database record to SmartTemplate
  private static dbToTemplate(dbTemplate: DatabaseTemplate): SmartTemplate {
    return {
      id: dbTemplate.id,
      name: dbTemplate.name,
      description: dbTemplate.description || '',
      category: dbTemplate.category,
      workProductType: dbTemplate.work_product_type,
      industryFocus: JSON.parse(dbTemplate.industry_focus),
      contextRequirements: JSON.parse(dbTemplate.context_requirements),
      sections: JSON.parse(dbTemplate.sections),
      dynamicFields: JSON.parse(dbTemplate.dynamic_fields),
      dataBindings: JSON.parse(dbTemplate.data_bindings),
      validationRules: JSON.parse(dbTemplate.validation_rules),
      aiPrompts: JSON.parse(dbTemplate.ai_prompts),
      customizationOptions: JSON.parse(dbTemplate.customization_options),
      usageCount: dbTemplate.usage_count,
      rating: dbTemplate.rating,
      successRate: dbTemplate.success_rate,
      avgGenerationTime: dbTemplate.avg_generation_time,
      createdBy: dbTemplate.created_by || 'system',
      createdAt: new Date(dbTemplate.created_at),
      updatedAt: new Date(dbTemplate.updated_at),
      version: '1.0' // Default version
    };
  }
}