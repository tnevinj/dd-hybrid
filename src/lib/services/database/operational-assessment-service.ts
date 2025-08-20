import db from '@/lib/database';
import { v4 as uuidv4 } from 'uuid';

export interface OperationalAssessment {
  id: string;
  project_id: string;
  workspace_id?: string;
  assessment_date: string;
  overall_score: number;
  process_efficiency_score: number;
  digital_maturity_score: number;
  quality_management_score: number;
  supply_chain_score: number;
  automation_readiness_score: number;
  cost_efficiency_score: number;
  scalability_score: number;
  status: 'draft' | 'in_progress' | 'completed' | 'approved';
  assessor_name?: string;
  notes?: string;
  recommendations: any[];
  created_at: string;
  updated_at: string;
}

export interface OperationalMetric {
  id: string;
  assessment_id: string;
  metric_category: 'process' | 'quality' | 'efficiency' | 'automation' | 'cost';
  metric_name: string;
  current_value?: number;
  target_value?: number;
  benchmark_value?: number;
  unit: string;
  trend: 'improving' | 'declining' | 'stable';
  measurement_date: string;
  data_source?: string;
  reliability_score: number;
  created_at: string;
}

export interface OperationalProcess {
  id: string;
  assessment_id: string;
  process_name: string;
  process_category: 'core' | 'support' | 'management';
  efficiency_score: number;
  automation_level: number;
  bottlenecks: any[];
  improvement_opportunities: any[];
  cycle_time_current?: number;
  cycle_time_target?: number;
  cost_current?: number;
  cost_target?: number;
  quality_metrics: any[];
  status: 'active' | 'under_review' | 'deprecated';
  last_reviewed?: string;
  created_at: string;
  updated_at: string;
}

export interface OperationalBenchmark {
  id: string;
  assessment_id: string;
  benchmark_category: 'industry' | 'peer' | 'best_in_class';
  metric_name: string;
  company_value?: number;
  benchmark_value?: number;
  percentile_ranking?: number;
  benchmark_source?: string;
  industry_sector?: string;
  company_size_category?: string;
  geographic_region?: string;
  data_vintage?: string;
  created_at: string;
}

export interface CreateOperationalAssessmentData {
  project_id: string;
  workspace_id?: string;
  assessor_name?: string;
  notes?: string;
  recommendations?: any[];
}

export interface UpdateOperationalAssessmentData {
  overall_score?: number;
  process_efficiency_score?: number;
  digital_maturity_score?: number;
  quality_management_score?: number;
  supply_chain_score?: number;
  automation_readiness_score?: number;
  cost_efficiency_score?: number;
  scalability_score?: number;
  status?: 'draft' | 'in_progress' | 'completed' | 'approved';
  assessor_name?: string;
  notes?: string;
  recommendations?: any[];
}

export class OperationalAssessmentService {
  // Create new operational assessment
  static create(data: CreateOperationalAssessmentData): OperationalAssessment {
    const id = uuidv4();
    const now = new Date().toISOString();
    
    const stmt = db.prepare(`
      INSERT INTO operational_assessments (
        id, project_id, workspace_id, assessor_name, notes, recommendations, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    stmt.run(
      id,
      data.project_id,
      data.workspace_id || null,
      data.assessor_name || null,
      data.notes || null,
      JSON.stringify(data.recommendations || []),
      now,
      now
    );
    
    return this.getById(id)!;
  }

  // Get assessment by ID
  static getById(id: string): OperationalAssessment | null {
    const stmt = db.prepare(`
      SELECT * FROM operational_assessments WHERE id = ?
    `);
    const result = stmt.get(id) as any;
    
    if (!result) return null;
    
    return {
      ...result,
      recommendations: JSON.parse(result.recommendations || '[]')
    };
  }

  // Get assessment by project ID
  static getByProjectId(projectId: string): OperationalAssessment | null {
    const stmt = db.prepare(`
      SELECT * FROM operational_assessments 
      WHERE project_id = ? 
      ORDER BY created_at DESC 
      LIMIT 1
    `);
    const result = stmt.get(projectId) as any;
    
    if (!result) return null;
    
    return {
      ...result,
      recommendations: JSON.parse(result.recommendations || '[]')
    };
  }

  // Update assessment
  static update(id: string, data: UpdateOperationalAssessmentData): OperationalAssessment | null {
    const updates: string[] = [];
    const values: any[] = [];
    
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) {
        updates.push(`${key} = ?`);
        if (key === 'recommendations') {
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
      UPDATE operational_assessments 
      SET ${updates.join(', ')} 
      WHERE id = ?
    `);
    
    stmt.run(...values);
    return this.getById(id);
  }

  // Delete assessment
  static delete(id: string): boolean {
    const stmt = db.prepare('DELETE FROM operational_assessments WHERE id = ?');
    const result = stmt.run(id);
    return result.changes > 0;
  }

  // Get all assessments
  static getAll(): OperationalAssessment[] {
    const stmt = db.prepare(`
      SELECT * FROM operational_assessments 
      ORDER BY updated_at DESC
    `);
    const results = stmt.all() as any[];
    
    return results.map(result => ({
      ...result,
      recommendations: JSON.parse(result.recommendations || '[]')
    }));
  }

  // Get assessments by workspace
  static getByWorkspaceId(workspaceId: string): OperationalAssessment[] {
    const stmt = db.prepare(`
      SELECT * FROM operational_assessments 
      WHERE workspace_id = ? 
      ORDER BY updated_at DESC
    `);
    const results = stmt.all(workspaceId) as any[];
    
    return results.map(result => ({
      ...result,
      recommendations: JSON.parse(result.recommendations || '[]')
    }));
  }
}

export class OperationalMetricsService {
  // Add metric to assessment
  static create(assessmentId: string, metric: Omit<OperationalMetric, 'id' | 'assessment_id' | 'created_at'>): OperationalMetric {
    const id = uuidv4();
    const now = new Date().toISOString();
    
    const stmt = db.prepare(`
      INSERT INTO operational_metrics (
        id, assessment_id, metric_category, metric_name, current_value, target_value, 
        benchmark_value, unit, trend, measurement_date, data_source, reliability_score, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    stmt.run(
      id,
      assessmentId,
      metric.metric_category,
      metric.metric_name,
      metric.current_value || null,
      metric.target_value || null,
      metric.benchmark_value || null,
      metric.unit,
      metric.trend,
      metric.measurement_date,
      metric.data_source || null,
      metric.reliability_score,
      now
    );
    
    return this.getById(id)!;
  }

  // Get metric by ID
  static getById(id: string): OperationalMetric | null {
    const stmt = db.prepare('SELECT * FROM operational_metrics WHERE id = ?');
    return stmt.get(id) as OperationalMetric | null;
  }

  // Get metrics by assessment ID
  static getByAssessmentId(assessmentId: string): OperationalMetric[] {
    const stmt = db.prepare(`
      SELECT * FROM operational_metrics 
      WHERE assessment_id = ? 
      ORDER BY metric_category, metric_name
    `);
    return stmt.all(assessmentId) as OperationalMetric[];
  }

  // Update metric
  static update(id: string, data: Partial<Omit<OperationalMetric, 'id' | 'assessment_id' | 'created_at'>>): OperationalMetric | null {
    const updates: string[] = [];
    const values: any[] = [];
    
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) {
        updates.push(`${key} = ?`);
        values.push(value);
      }
    });
    
    if (updates.length === 0) return this.getById(id);
    
    values.push(id);
    
    const stmt = db.prepare(`
      UPDATE operational_metrics 
      SET ${updates.join(', ')} 
      WHERE id = ?
    `);
    
    stmt.run(...values);
    return this.getById(id);
  }

  // Delete metric
  static delete(id: string): boolean {
    const stmt = db.prepare('DELETE FROM operational_metrics WHERE id = ?');
    const result = stmt.run(id);
    return result.changes > 0;
  }
}

export class OperationalProcessService {
  // Create new process
  static create(assessmentId: string, process: Omit<OperationalProcess, 'id' | 'assessment_id' | 'created_at' | 'updated_at'>): OperationalProcess {
    const id = uuidv4();
    const now = new Date().toISOString();
    
    const stmt = db.prepare(`
      INSERT INTO operational_processes (
        id, assessment_id, process_name, process_category, efficiency_score, automation_level,
        bottlenecks, improvement_opportunities, cycle_time_current, cycle_time_target,
        cost_current, cost_target, quality_metrics, status, last_reviewed, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    stmt.run(
      id,
      assessmentId,
      process.process_name,
      process.process_category,
      process.efficiency_score,
      process.automation_level,
      JSON.stringify(process.bottlenecks),
      JSON.stringify(process.improvement_opportunities),
      process.cycle_time_current || null,
      process.cycle_time_target || null,
      process.cost_current || null,
      process.cost_target || null,
      JSON.stringify(process.quality_metrics),
      process.status,
      process.last_reviewed || null,
      now,
      now
    );
    
    return this.getById(id)!;
  }

  // Get process by ID
  static getById(id: string): OperationalProcess | null {
    const stmt = db.prepare('SELECT * FROM operational_processes WHERE id = ?');
    const result = stmt.get(id) as any;
    
    if (!result) return null;
    
    return {
      ...result,
      bottlenecks: JSON.parse(result.bottlenecks || '[]'),
      improvement_opportunities: JSON.parse(result.improvement_opportunities || '[]'),
      quality_metrics: JSON.parse(result.quality_metrics || '[]')
    };
  }

  // Get processes by assessment ID
  static getByAssessmentId(assessmentId: string): OperationalProcess[] {
    const stmt = db.prepare(`
      SELECT * FROM operational_processes 
      WHERE assessment_id = ? 
      ORDER BY process_category, process_name
    `);
    const results = stmt.all(assessmentId) as any[];
    
    return results.map(result => ({
      ...result,
      bottlenecks: JSON.parse(result.bottlenecks || '[]'),
      improvement_opportunities: JSON.parse(result.improvement_opportunities || '[]'),
      quality_metrics: JSON.parse(result.quality_metrics || '[]')
    }));
  }

  // Update process
  static update(id: string, data: Partial<Omit<OperationalProcess, 'id' | 'assessment_id' | 'created_at'>>): OperationalProcess | null {
    const updates: string[] = [];
    const values: any[] = [];
    
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) {
        updates.push(`${key} = ?`);
        if (['bottlenecks', 'improvement_opportunities', 'quality_metrics'].includes(key)) {
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
      UPDATE operational_processes 
      SET ${updates.join(', ')} 
      WHERE id = ?
    `);
    
    stmt.run(...values);
    return this.getById(id);
  }

  // Delete process
  static delete(id: string): boolean {
    const stmt = db.prepare('DELETE FROM operational_processes WHERE id = ?');
    const result = stmt.run(id);
    return result.changes > 0;
  }
}

export class OperationalBenchmarkService {
  // Create new benchmark
  static create(assessmentId: string, benchmark: Omit<OperationalBenchmark, 'id' | 'assessment_id' | 'created_at'>): OperationalBenchmark {
    const id = uuidv4();
    const now = new Date().toISOString();
    
    const stmt = db.prepare(`
      INSERT INTO operational_benchmarks (
        id, assessment_id, benchmark_category, metric_name, company_value, benchmark_value,
        percentile_ranking, benchmark_source, industry_sector, company_size_category,
        geographic_region, data_vintage, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    stmt.run(
      id,
      assessmentId,
      benchmark.benchmark_category,
      benchmark.metric_name,
      benchmark.company_value || null,
      benchmark.benchmark_value || null,
      benchmark.percentile_ranking || null,
      benchmark.benchmark_source || null,
      benchmark.industry_sector || null,
      benchmark.company_size_category || null,
      benchmark.geographic_region || null,
      benchmark.data_vintage || null,
      now
    );
    
    return this.getById(id)!;
  }

  // Get benchmark by ID
  static getById(id: string): OperationalBenchmark | null {
    const stmt = db.prepare('SELECT * FROM operational_benchmarks WHERE id = ?');
    return stmt.get(id) as OperationalBenchmark | null;
  }

  // Get benchmarks by assessment ID
  static getByAssessmentId(assessmentId: string): OperationalBenchmark[] {
    const stmt = db.prepare(`
      SELECT * FROM operational_benchmarks 
      WHERE assessment_id = ? 
      ORDER BY benchmark_category, metric_name
    `);
    return stmt.all(assessmentId) as OperationalBenchmark[];
  }

  // Delete benchmark
  static delete(id: string): boolean {
    const stmt = db.prepare('DELETE FROM operational_benchmarks WHERE id = ?');
    const result = stmt.run(id);
    return result.changes > 0;
  }
}