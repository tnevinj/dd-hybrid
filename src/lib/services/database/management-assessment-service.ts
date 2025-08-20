import db from '@/lib/database';
import { v4 as uuidv4 } from 'uuid';

export interface ManagementAssessment {
  id: string;
  project_id: string;
  workspace_id?: string;
  assessment_date: string;
  overall_team_score: number;
  leadership_score: number;
  strategic_thinking_score: number;
  execution_capability_score: number;
  financial_acumen_score: number;
  industry_expertise_score: number;
  team_dynamics_score: number;
  succession_readiness_score: number;
  retention_risk_score: number;
  status: 'draft' | 'in_progress' | 'completed' | 'approved';
  assessor_name?: string;
  key_strengths: any[];
  key_concerns: any[];
  succession_gaps: any[];
  retention_strategies: any[];
  created_at: string;
  updated_at: string;
}

export interface ManagementTeamMember {
  id: string;
  assessment_id: string;
  name: string;
  position: string;
  department?: string;
  tenure_years: number;
  age?: number;
  education_background?: string;
  previous_experience: any[];
  leadership_score: number;
  strategic_thinking_score: number;
  execution_score: number;
  financial_acumen_score: number;
  industry_expertise_score: number;
  team_collaboration_score: number;
  retention_risk: 'low' | 'medium' | 'high';
  succession_readiness: number;
  development_areas: any[];
  key_achievements: any[];
  compensation_satisfaction: 'low' | 'medium' | 'high' | 'unknown';
  career_aspirations?: string;
  flight_risk_factors: any[];
  created_at: string;
  updated_at: string;
}

export interface GPRelationship {
  id: string;
  assessment_id: string;
  gp_name: string;
  relationship_type: 'primary' | 'secondary' | 'advisor';
  relationship_duration_years: number;
  relationship_quality_score: number;
  communication_frequency: 'weekly' | 'monthly' | 'quarterly' | 'as_needed';
  previous_deal_count: number;
  previous_deal_performance: any[];
  value_add_areas: any[];
  areas_for_improvement: any[];
  future_opportunity_pipeline: any[];
  reference_check_score: number;
  overall_satisfaction: 'low' | 'medium' | 'high' | 'unknown';
  notes?: string;
  last_interaction_date?: string;
  next_review_date?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateManagementAssessmentData {
  project_id: string;
  workspace_id?: string;
  assessor_name?: string;
  key_strengths?: any[];
  key_concerns?: any[];
  succession_gaps?: any[];
  retention_strategies?: any[];
}

export interface UpdateManagementAssessmentData {
  overall_team_score?: number;
  leadership_score?: number;
  strategic_thinking_score?: number;
  execution_capability_score?: number;
  financial_acumen_score?: number;
  industry_expertise_score?: number;
  team_dynamics_score?: number;
  succession_readiness_score?: number;
  retention_risk_score?: number;
  status?: 'draft' | 'in_progress' | 'completed' | 'approved';
  assessor_name?: string;
  key_strengths?: any[];
  key_concerns?: any[];
  succession_gaps?: any[];
  retention_strategies?: any[];
}

export class ManagementAssessmentService {
  // Create new management assessment
  static create(data: CreateManagementAssessmentData): ManagementAssessment {
    const id = uuidv4();
    const now = new Date().toISOString();
    
    const stmt = db.prepare(`
      INSERT INTO management_assessments (
        id, project_id, workspace_id, assessor_name, key_strengths, key_concerns,
        succession_gaps, retention_strategies, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    stmt.run(
      id,
      data.project_id,
      data.workspace_id || null,
      data.assessor_name || null,
      JSON.stringify(data.key_strengths || []),
      JSON.stringify(data.key_concerns || []),
      JSON.stringify(data.succession_gaps || []),
      JSON.stringify(data.retention_strategies || []),
      now,
      now
    );
    
    return this.getById(id)!;
  }

  // Get assessment by ID
  static getById(id: string): ManagementAssessment | null {
    const stmt = db.prepare(`
      SELECT * FROM management_assessments WHERE id = ?
    `);
    const result = stmt.get(id) as any;
    
    if (!result) return null;
    
    return {
      ...result,
      key_strengths: JSON.parse(result.key_strengths || '[]'),
      key_concerns: JSON.parse(result.key_concerns || '[]'),
      succession_gaps: JSON.parse(result.succession_gaps || '[]'),
      retention_strategies: JSON.parse(result.retention_strategies || '[]')
    };
  }

  // Get assessment by project ID
  static getByProjectId(projectId: string): ManagementAssessment | null {
    const stmt = db.prepare(`
      SELECT * FROM management_assessments 
      WHERE project_id = ? 
      ORDER BY created_at DESC 
      LIMIT 1
    `);
    const result = stmt.get(projectId) as any;
    
    if (!result) return null;
    
    return {
      ...result,
      key_strengths: JSON.parse(result.key_strengths || '[]'),
      key_concerns: JSON.parse(result.key_concerns || '[]'),
      succession_gaps: JSON.parse(result.succession_gaps || '[]'),
      retention_strategies: JSON.parse(result.retention_strategies || '[]')
    };
  }

  // Update assessment
  static update(id: string, data: UpdateManagementAssessmentData): ManagementAssessment | null {
    const updates: string[] = [];
    const values: any[] = [];
    
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) {
        updates.push(`${key} = ?`);
        if (['key_strengths', 'key_concerns', 'succession_gaps', 'retention_strategies'].includes(key)) {
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
      UPDATE management_assessments 
      SET ${updates.join(', ')} 
      WHERE id = ?
    `);
    
    stmt.run(...values);
    return this.getById(id);
  }

  // Delete assessment
  static delete(id: string): boolean {
    const stmt = db.prepare('DELETE FROM management_assessments WHERE id = ?');
    const result = stmt.run(id);
    return result.changes > 0;
  }

  // Get all assessments
  static getAll(): ManagementAssessment[] {
    const stmt = db.prepare(`
      SELECT * FROM management_assessments 
      ORDER BY updated_at DESC
    `);
    const results = stmt.all() as any[];
    
    return results.map(result => ({
      ...result,
      key_strengths: JSON.parse(result.key_strengths || '[]'),
      key_concerns: JSON.parse(result.key_concerns || '[]'),
      succession_gaps: JSON.parse(result.succession_gaps || '[]'),
      retention_strategies: JSON.parse(result.retention_strategies || '[]')
    }));
  }

  // Get assessments by workspace
  static getByWorkspaceId(workspaceId: string): ManagementAssessment[] {
    const stmt = db.prepare(`
      SELECT * FROM management_assessments 
      WHERE workspace_id = ? 
      ORDER BY updated_at DESC
    `);
    const results = stmt.all(workspaceId) as any[];
    
    return results.map(result => ({
      ...result,
      key_strengths: JSON.parse(result.key_strengths || '[]'),
      key_concerns: JSON.parse(result.key_concerns || '[]'),
      succession_gaps: JSON.parse(result.succession_gaps || '[]'),
      retention_strategies: JSON.parse(result.retention_strategies || '[]')
    }));
  }
}

export class ManagementTeamMemberService {
  // Create new team member
  static create(assessmentId: string, member: Omit<ManagementTeamMember, 'id' | 'assessment_id' | 'created_at' | 'updated_at'>): ManagementTeamMember {
    const id = uuidv4();
    const now = new Date().toISOString();
    
    const stmt = db.prepare(`
      INSERT INTO management_team_members (
        id, assessment_id, name, position, department, tenure_years, age, education_background,
        previous_experience, leadership_score, strategic_thinking_score, execution_score,
        financial_acumen_score, industry_expertise_score, team_collaboration_score,
        retention_risk, succession_readiness, development_areas, key_achievements,
        compensation_satisfaction, career_aspirations, flight_risk_factors, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    stmt.run(
      id,
      assessmentId,
      member.name,
      member.position,
      member.department || null,
      member.tenure_years,
      member.age || null,
      member.education_background || null,
      JSON.stringify(member.previous_experience),
      member.leadership_score,
      member.strategic_thinking_score,
      member.execution_score,
      member.financial_acumen_score,
      member.industry_expertise_score,
      member.team_collaboration_score,
      member.retention_risk,
      member.succession_readiness,
      JSON.stringify(member.development_areas),
      JSON.stringify(member.key_achievements),
      member.compensation_satisfaction,
      member.career_aspirations || null,
      JSON.stringify(member.flight_risk_factors),
      now,
      now
    );
    
    return this.getById(id)!;
  }

  // Get team member by ID
  static getById(id: string): ManagementTeamMember | null {
    const stmt = db.prepare('SELECT * FROM management_team_members WHERE id = ?');
    const result = stmt.get(id) as any;
    
    if (!result) return null;
    
    return {
      ...result,
      previous_experience: JSON.parse(result.previous_experience || '[]'),
      development_areas: JSON.parse(result.development_areas || '[]'),
      key_achievements: JSON.parse(result.key_achievements || '[]'),
      flight_risk_factors: JSON.parse(result.flight_risk_factors || '[]')
    };
  }

  // Get team members by assessment ID
  static getByAssessmentId(assessmentId: string): ManagementTeamMember[] {
    const stmt = db.prepare(`
      SELECT * FROM management_team_members 
      WHERE assessment_id = ? 
      ORDER BY position, name
    `);
    const results = stmt.all(assessmentId) as any[];
    
    return results.map(result => ({
      ...result,
      previous_experience: JSON.parse(result.previous_experience || '[]'),
      development_areas: JSON.parse(result.development_areas || '[]'),
      key_achievements: JSON.parse(result.key_achievements || '[]'),
      flight_risk_factors: JSON.parse(result.flight_risk_factors || '[]')
    }));
  }

  // Update team member
  static update(id: string, data: Partial<Omit<ManagementTeamMember, 'id' | 'assessment_id' | 'created_at'>>): ManagementTeamMember | null {
    const updates: string[] = [];
    const values: any[] = [];
    
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) {
        updates.push(`${key} = ?`);
        if (['previous_experience', 'development_areas', 'key_achievements', 'flight_risk_factors'].includes(key)) {
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
      UPDATE management_team_members 
      SET ${updates.join(', ')} 
      WHERE id = ?
    `);
    
    stmt.run(...values);
    return this.getById(id);
  }

  // Delete team member
  static delete(id: string): boolean {
    const stmt = db.prepare('DELETE FROM management_team_members WHERE id = ?');
    const result = stmt.run(id);
    return result.changes > 0;
  }
}

export class GPRelationshipService {
  // Create new GP relationship
  static create(assessmentId: string, relationship: Omit<GPRelationship, 'id' | 'assessment_id' | 'created_at' | 'updated_at'>): GPRelationship {
    const id = uuidv4();
    const now = new Date().toISOString();
    
    const stmt = db.prepare(`
      INSERT INTO gp_relationships (
        id, assessment_id, gp_name, relationship_type, relationship_duration_years,
        relationship_quality_score, communication_frequency, previous_deal_count,
        previous_deal_performance, value_add_areas, areas_for_improvement,
        future_opportunity_pipeline, reference_check_score, overall_satisfaction,
        notes, last_interaction_date, next_review_date, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    stmt.run(
      id,
      assessmentId,
      relationship.gp_name,
      relationship.relationship_type,
      relationship.relationship_duration_years,
      relationship.relationship_quality_score,
      relationship.communication_frequency,
      relationship.previous_deal_count,
      JSON.stringify(relationship.previous_deal_performance),
      JSON.stringify(relationship.value_add_areas),
      JSON.stringify(relationship.areas_for_improvement),
      JSON.stringify(relationship.future_opportunity_pipeline),
      relationship.reference_check_score,
      relationship.overall_satisfaction,
      relationship.notes || null,
      relationship.last_interaction_date || null,
      relationship.next_review_date || null,
      now,
      now
    );
    
    return this.getById(id)!;
  }

  // Get GP relationship by ID
  static getById(id: string): GPRelationship | null {
    const stmt = db.prepare('SELECT * FROM gp_relationships WHERE id = ?');
    const result = stmt.get(id) as any;
    
    if (!result) return null;
    
    return {
      ...result,
      previous_deal_performance: JSON.parse(result.previous_deal_performance || '[]'),
      value_add_areas: JSON.parse(result.value_add_areas || '[]'),
      areas_for_improvement: JSON.parse(result.areas_for_improvement || '[]'),
      future_opportunity_pipeline: JSON.parse(result.future_opportunity_pipeline || '[]')
    };
  }

  // Get GP relationships by assessment ID
  static getByAssessmentId(assessmentId: string): GPRelationship[] {
    const stmt = db.prepare(`
      SELECT * FROM gp_relationships 
      WHERE assessment_id = ? 
      ORDER BY relationship_type, gp_name
    `);
    const results = stmt.all(assessmentId) as any[];
    
    return results.map(result => ({
      ...result,
      previous_deal_performance: JSON.parse(result.previous_deal_performance || '[]'),
      value_add_areas: JSON.parse(result.value_add_areas || '[]'),
      areas_for_improvement: JSON.parse(result.areas_for_improvement || '[]'),
      future_opportunity_pipeline: JSON.parse(result.future_opportunity_pipeline || '[]')
    }));
  }

  // Update GP relationship
  static update(id: string, data: Partial<Omit<GPRelationship, 'id' | 'assessment_id' | 'created_at'>>): GPRelationship | null {
    const updates: string[] = [];
    const values: any[] = [];
    
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) {
        updates.push(`${key} = ?`);
        if (['previous_deal_performance', 'value_add_areas', 'areas_for_improvement', 'future_opportunity_pipeline'].includes(key)) {
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
      UPDATE gp_relationships 
      SET ${updates.join(', ')} 
      WHERE id = ?
    `);
    
    stmt.run(...values);
    return this.getById(id);
  }

  // Delete GP relationship
  static delete(id: string): boolean {
    const stmt = db.prepare('DELETE FROM gp_relationships WHERE id = ?');
    const result = stmt.run(id);
    return result.changes > 0;
  }
}