import db from '../../database';
import { v4 as uuidv4 } from 'uuid';

// Types for qualification assessment system
export interface QualificationAssessment {
  id: string;
  team_member_id: string;
  assessment_type: 'skills' | 'references' | 'performance' | 'competency' | 'cultural_fit';
  assessment_date: string;
  overall_qualification_score: number;
  verification_status: 'pending' | 'in_progress' | 'completed' | 'failed';
  assessed_by?: string;
  methodology?: string;
  confidence_level: number;
  findings: any[];
  recommendations: any[];
  red_flags: any[];
  validation_evidence: any[];
  external_validation_required: boolean;
  created_at: string;
  updated_at: string;
}

export interface SkillValidation {
  id: string;
  qualification_assessment_id: string;
  skill_category: 'technical' | 'leadership' | 'strategic' | 'financial' | 'operational';
  skill_name: string;
  claimed_proficiency: number;
  validated_proficiency: number;
  validation_method: 'interview' | 'test' | 'portfolio' | 'reference' | 'observation';
  evidence_type: 'certification' | 'project' | 'testimonial' | 'demonstration';
  evidence_quality: number;
  assessor_notes?: string;
  validation_date: string;
  expiry_date?: string;
  industry_relevance: number;
  created_at: string;
}

export interface ReferenceCheck {
  id: string;
  qualification_assessment_id: string;
  reference_name: string;
  reference_position?: string;
  reference_company?: string;
  relationship_to_candidate: 'direct_manager' | 'peer' | 'subordinate' | 'client' | 'board_member';
  reference_type: 'professional' | 'personal' | 'academic';
  contact_method: 'phone' | 'email' | 'video' | 'in_person';
  response_status: 'pending' | 'completed' | 'declined' | 'unreachable';
  overall_rating: number;
  would_rehire?: boolean;
  leadership_rating: number;
  performance_rating: number;
  integrity_rating: number;
  collaboration_rating: number;
  specific_feedback?: string;
  strengths_mentioned: any[];
  concerns_mentioned: any[];
  verification_items: any[];
  red_flags: any[];
  reference_date: string;
  follow_up_required: boolean;
  follow_up_notes?: string;
  created_at: string;
}

export interface PerformanceValidation {
  id: string;
  qualification_assessment_id: string;
  performance_period_start: string;
  performance_period_end: string;
  company_name?: string;
  role_title?: string;
  claimed_achievements: any[];
  validated_achievements: any[];
  quantitative_metrics: any[];
  revenue_impact: number;
  cost_savings: number;
  team_size_managed: number;
  budget_responsibility: number;
  stakeholder_feedback_score: number;
  peer_review_score: number;
  subordinate_feedback_score: number;
  client_satisfaction_score: number;
  awards_recognition: any[];
  performance_improvement_areas: any[];
  validation_sources: any[];
  validation_confidence: number;
  discrepancies_found: any[];
  created_at: string;
}

export interface CompetencyValidation {
  id: string;
  qualification_assessment_id: string;
  competency_framework?: string;
  competency_category: string;
  competency_name: string;
  required_level: number;
  demonstrated_level: number;
  assessment_method: 'behavioral_interview' | 'simulation' | 'assessment_center' | '360_feedback';
  behavioral_indicators: any[];
  situational_examples: any[];
  assessment_scenarios: any[];
  competency_gaps: any[];
  development_recommendations: any[];
  assessor_confidence: number;
  external_validation: any[];
  industry_benchmarks: any[];
  future_potential_score: number;
  created_at: string;
}

export interface CulturalFitAssessment {
  id: string;
  qualification_assessment_id: string;
  company_culture_profile: any[];
  individual_profile: any[];
  values_alignment_score: number;
  work_style_compatibility: number;
  communication_style_fit: number;
  leadership_style_fit: number;
  decision_making_style_fit: number;
  change_adaptability_score: number;
  team_integration_potential: number;
  cultural_red_flags: any[];
  integration_strategies: any[];
  cultural_development_plan: any[];
  assessment_methodology?: string;
  external_consultant_used: boolean;
  assessment_tools_used: any[];
  created_at: string;
}

export interface QualificationDocument {
  id: string;
  qualification_assessment_id: string;
  document_type: 'resume' | 'transcript' | 'certification' | 'portfolio' | 'reference_letter';
  document_name: string;
  document_path?: string;
  verification_status: 'pending' | 'verified' | 'discrepancy' | 'fake';
  verification_method?: string;
  verification_date?: string;
  verified_by?: string;
  authenticity_score: number;
  relevance_score: number;
  quality_score: number;
  key_findings: any[];
  discrepancies: any[];
  verification_notes?: string;
  expiry_date?: string;
  issuing_authority?: string;
  created_at: string;
}

// Qualification Assessment Service
export class QualificationAssessmentService {
  static create(teamMemberId: string, data: Partial<QualificationAssessment>): QualificationAssessment {
    const id = uuidv4();
    const now = new Date().toISOString();
    
    console.log('Creating qualification assessment with data:', {
      teamMemberId,
      assessmentType: data.assessment_type,
      findings: typeof data.findings,
      recommendations: typeof data.recommendations
    });
    
    const stmt = db.prepare(`
      INSERT INTO qualification_assessments (
        id, team_member_id, assessment_type, overall_qualification_score,
        verification_status, assessed_by, methodology, confidence_level,
        findings, recommendations, red_flags, validation_evidence,
        external_validation_required, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    // Ensure all parameters are properly typed for SQLite
    const params = [
      id,
      teamMemberId,
      data.assessment_type || 'skills',
      Number(data.overall_qualification_score || 0),
      data.verification_status || 'pending',
      data.assessed_by || null,
      data.methodology || null,
      Number(data.confidence_level || 0),
      JSON.stringify(data.findings || []),
      JSON.stringify(data.recommendations || []),
      JSON.stringify(data.red_flags || []),
      JSON.stringify(data.validation_evidence || []),
      data.external_validation_required ? 1 : 0, // Convert boolean to integer
      now,
      now
    ];
    
    console.log('SQLite parameters:', params.map((p, i) => `${i}: ${typeof p} = ${p}`));
    
    stmt.run(...params);
    
    return this.getById(id)!;
  }

  static getById(id: string): QualificationAssessment | null {
    const stmt = db.prepare('SELECT * FROM qualification_assessments WHERE id = ?');
    const row = stmt.get(id) as any;
    
    if (!row) return null;
    
    return {
      ...row,
      findings: JSON.parse(row.findings || '[]'),
      recommendations: JSON.parse(row.recommendations || '[]'),
      red_flags: JSON.parse(row.red_flags || '[]'),
      validation_evidence: JSON.parse(row.validation_evidence || '[]')
    };
  }

  static getByTeamMemberId(teamMemberId: string): QualificationAssessment[] {
    const stmt = db.prepare('SELECT * FROM qualification_assessments WHERE team_member_id = ? ORDER BY created_at DESC');
    const rows = stmt.all(teamMemberId) as any[];
    
    return rows.map(row => ({
      ...row,
      findings: JSON.parse(row.findings || '[]'),
      recommendations: JSON.parse(row.recommendations || '[]'),
      red_flags: JSON.parse(row.red_flags || '[]'),
      validation_evidence: JSON.parse(row.validation_evidence || '[]')
    }));
  }

  static update(id: string, data: Partial<QualificationAssessment>): QualificationAssessment | null {
    const updates: string[] = [];
    const values: any[] = [];
    
    Object.entries(data).forEach(([key, value]) => {
      if (key !== 'id' && key !== 'created_at' && value !== undefined) {
        updates.push(`${key} = ?`);
        if (typeof value === 'object' && value !== null) {
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
    
    const stmt = db.prepare(`UPDATE qualification_assessments SET ${updates.join(', ')} WHERE id = ?`);
    stmt.run(...values);
    
    return this.getById(id);
  }

  static delete(id: string): boolean {
    const stmt = db.prepare('DELETE FROM qualification_assessments WHERE id = ?');
    const result = stmt.run(id);
    return result.changes > 0;
  }
}

// Skills Validation Service
export class SkillValidationService {
  static create(qualificationAssessmentId: string, data: Partial<SkillValidation>): SkillValidation {
    const id = uuidv4();
    const now = new Date().toISOString();
    
    const stmt = db.prepare(`
      INSERT INTO skills_validations (
        id, qualification_assessment_id, skill_category, skill_name,
        claimed_proficiency, validated_proficiency, validation_method,
        evidence_type, evidence_quality, assessor_notes, validation_date,
        expiry_date, industry_relevance, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    stmt.run(
      id,
      qualificationAssessmentId,
      data.skill_category || 'technical',
      data.skill_name || '',
      data.claimed_proficiency || 0,
      data.validated_proficiency || 0,
      data.validation_method || 'interview',
      data.evidence_type || 'testimonial',
      data.evidence_quality || 0,
      data.assessor_notes || null,
      data.validation_date || now,
      data.expiry_date || null,
      data.industry_relevance || 0,
      now
    );
    
    return this.getById(id)!;
  }

  static getById(id: string): SkillValidation | null {
    const stmt = db.prepare('SELECT * FROM skills_validations WHERE id = ?');
    return stmt.get(id) as SkillValidation | null;
  }

  static getByAssessmentId(assessmentId: string): SkillValidation[] {
    const stmt = db.prepare('SELECT * FROM skills_validations WHERE qualification_assessment_id = ? ORDER BY skill_category, skill_name');
    return stmt.all(assessmentId) as SkillValidation[];
  }

  static update(id: string, data: Partial<SkillValidation>): SkillValidation | null {
    const updates: string[] = [];
    const values: any[] = [];
    
    Object.entries(data).forEach(([key, value]) => {
      if (key !== 'id' && key !== 'created_at' && value !== undefined) {
        updates.push(`${key} = ?`);
        values.push(value);
      }
    });
    
    if (updates.length === 0) return this.getById(id);
    
    values.push(id);
    
    const stmt = db.prepare(`UPDATE skills_validations SET ${updates.join(', ')} WHERE id = ?`);
    stmt.run(...values);
    
    return this.getById(id);
  }

  static delete(id: string): boolean {
    const stmt = db.prepare('DELETE FROM skills_validations WHERE id = ?');
    const result = stmt.run(id);
    return result.changes > 0;
  }
}

// Reference Check Service
export class ReferenceCheckService {
  static create(qualificationAssessmentId: string, data: Partial<ReferenceCheck>): ReferenceCheck {
    const id = uuidv4();
    const now = new Date().toISOString();
    
    const stmt = db.prepare(`
      INSERT INTO reference_checks (
        id, qualification_assessment_id, reference_name, reference_position,
        reference_company, relationship_to_candidate, reference_type,
        contact_method, response_status, overall_rating, would_rehire,
        leadership_rating, performance_rating, integrity_rating,
        collaboration_rating, specific_feedback, strengths_mentioned,
        concerns_mentioned, verification_items, red_flags, reference_date,
        follow_up_required, follow_up_notes, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    stmt.run(
      id,
      qualificationAssessmentId,
      data.reference_name || '',
      data.reference_position || null,
      data.reference_company || null,
      data.relationship_to_candidate || 'peer',
      data.reference_type || 'professional',
      data.contact_method || 'phone',
      data.response_status || 'pending',
      data.overall_rating || 0,
      data.would_rehire !== undefined ? (data.would_rehire ? 1 : 0) : null,
      data.leadership_rating || 0,
      data.performance_rating || 0,
      data.integrity_rating || 0,
      data.collaboration_rating || 0,
      data.specific_feedback || null,
      JSON.stringify(data.strengths_mentioned || []),
      JSON.stringify(data.concerns_mentioned || []),
      JSON.stringify(data.verification_items || []),
      JSON.stringify(data.red_flags || []),
      data.reference_date || now,
      data.follow_up_required ? 1 : 0,
      data.follow_up_notes || null,
      now
    );
    
    return this.getById(id)!;
  }

  static getById(id: string): ReferenceCheck | null {
    const stmt = db.prepare('SELECT * FROM reference_checks WHERE id = ?');
    const row = stmt.get(id) as any;
    
    if (!row) return null;
    
    return {
      ...row,
      strengths_mentioned: JSON.parse(row.strengths_mentioned || '[]'),
      concerns_mentioned: JSON.parse(row.concerns_mentioned || '[]'),
      verification_items: JSON.parse(row.verification_items || '[]'),
      red_flags: JSON.parse(row.red_flags || '[]')
    };
  }

  static getByAssessmentId(assessmentId: string): ReferenceCheck[] {
    const stmt = db.prepare('SELECT * FROM reference_checks WHERE qualification_assessment_id = ? ORDER BY reference_date DESC');
    const rows = stmt.all(assessmentId) as any[];
    
    return rows.map(row => ({
      ...row,
      strengths_mentioned: JSON.parse(row.strengths_mentioned || '[]'),
      concerns_mentioned: JSON.parse(row.concerns_mentioned || '[]'),
      verification_items: JSON.parse(row.verification_items || '[]'),
      red_flags: JSON.parse(row.red_flags || '[]')
    }));
  }

  static update(id: string, data: Partial<ReferenceCheck>): ReferenceCheck | null {
    const updates: string[] = [];
    const values: any[] = [];
    
    Object.entries(data).forEach(([key, value]) => {
      if (key !== 'id' && key !== 'created_at' && value !== undefined) {
        updates.push(`${key} = ?`);
        if (typeof value === 'object' && value !== null) {
          values.push(JSON.stringify(value));
        } else {
          values.push(value);
        }
      }
    });
    
    if (updates.length === 0) return this.getById(id);
    
    values.push(id);
    
    const stmt = db.prepare(`UPDATE reference_checks SET ${updates.join(', ')} WHERE id = ?`);
    stmt.run(...values);
    
    return this.getById(id);
  }

  static delete(id: string): boolean {
    const stmt = db.prepare('DELETE FROM reference_checks WHERE id = ?');
    const result = stmt.run(id);
    return result.changes > 0;
  }
}

// Performance Validation Service
export class PerformanceValidationService {
  static create(qualificationAssessmentId: string, data: Partial<PerformanceValidation>): PerformanceValidation {
    const id = uuidv4();
    const now = new Date().toISOString();
    
    const stmt = db.prepare(`
      INSERT INTO performance_validations (
        id, qualification_assessment_id, performance_period_start,
        performance_period_end, company_name, role_title, claimed_achievements,
        validated_achievements, quantitative_metrics, revenue_impact,
        cost_savings, team_size_managed, budget_responsibility,
        stakeholder_feedback_score, peer_review_score, subordinate_feedback_score,
        client_satisfaction_score, awards_recognition, performance_improvement_areas,
        validation_sources, validation_confidence, discrepancies_found, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    stmt.run(
      id,
      qualificationAssessmentId,
      data.performance_period_start || now.split('T')[0],
      data.performance_period_end || now.split('T')[0],
      data.company_name || null,
      data.role_title || null,
      JSON.stringify(data.claimed_achievements || []),
      JSON.stringify(data.validated_achievements || []),
      JSON.stringify(data.quantitative_metrics || []),
      data.revenue_impact || 0,
      data.cost_savings || 0,
      data.team_size_managed || 0,
      data.budget_responsibility || 0,
      data.stakeholder_feedback_score || 0,
      data.peer_review_score || 0,
      data.subordinate_feedback_score || 0,
      data.client_satisfaction_score || 0,
      JSON.stringify(data.awards_recognition || []),
      JSON.stringify(data.performance_improvement_areas || []),
      JSON.stringify(data.validation_sources || []),
      data.validation_confidence || 0,
      JSON.stringify(data.discrepancies_found || []),
      now
    );
    
    return this.getById(id)!;
  }

  static getById(id: string): PerformanceValidation | null {
    const stmt = db.prepare('SELECT * FROM performance_validations WHERE id = ?');
    const row = stmt.get(id) as any;
    
    if (!row) return null;
    
    return {
      ...row,
      claimed_achievements: JSON.parse(row.claimed_achievements || '[]'),
      validated_achievements: JSON.parse(row.validated_achievements || '[]'),
      quantitative_metrics: JSON.parse(row.quantitative_metrics || '[]'),
      awards_recognition: JSON.parse(row.awards_recognition || '[]'),
      performance_improvement_areas: JSON.parse(row.performance_improvement_areas || '[]'),
      validation_sources: JSON.parse(row.validation_sources || '[]'),
      discrepancies_found: JSON.parse(row.discrepancies_found || '[]')
    };
  }

  static getByAssessmentId(assessmentId: string): PerformanceValidation[] {
    const stmt = db.prepare('SELECT * FROM performance_validations WHERE qualification_assessment_id = ? ORDER BY performance_period_end DESC');
    const rows = stmt.all(assessmentId) as any[];
    
    return rows.map(row => ({
      ...row,
      claimed_achievements: JSON.parse(row.claimed_achievements || '[]'),
      validated_achievements: JSON.parse(row.validated_achievements || '[]'),
      quantitative_metrics: JSON.parse(row.quantitative_metrics || '[]'),
      awards_recognition: JSON.parse(row.awards_recognition || '[]'),
      performance_improvement_areas: JSON.parse(row.performance_improvement_areas || '[]'),
      validation_sources: JSON.parse(row.validation_sources || '[]'),
      discrepancies_found: JSON.parse(row.discrepancies_found || '[]')
    }));
  }

  static update(id: string, data: Partial<PerformanceValidation>): PerformanceValidation | null {
    const updates: string[] = [];
    const values: any[] = [];
    
    Object.entries(data).forEach(([key, value]) => {
      if (key !== 'id' && key !== 'created_at' && value !== undefined) {
        updates.push(`${key} = ?`);
        if (typeof value === 'object' && value !== null) {
          values.push(JSON.stringify(value));
        } else {
          values.push(value);
        }
      }
    });
    
    if (updates.length === 0) return this.getById(id);
    
    values.push(id);
    
    const stmt = db.prepare(`UPDATE performance_validations SET ${updates.join(', ')} WHERE id = ?`);
    stmt.run(...values);
    
    return this.getById(id);
  }

  static delete(id: string): boolean {
    const stmt = db.prepare('DELETE FROM performance_validations WHERE id = ?');
    const result = stmt.run(id);
    return result.changes > 0;
  }
}

// Competency Validation Service
export class CompetencyValidationService {
  static create(qualificationAssessmentId: string, data: Partial<CompetencyValidation>): CompetencyValidation {
    const id = uuidv4();
    const now = new Date().toISOString();
    
    const stmt = db.prepare(`
      INSERT INTO competency_validations (
        id, qualification_assessment_id, competency_framework, competency_category,
        competency_name, required_level, demonstrated_level, assessment_method,
        behavioral_indicators, situational_examples, assessment_scenarios,
        competency_gaps, development_recommendations, assessor_confidence,
        external_validation, industry_benchmarks, future_potential_score, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    stmt.run(
      id,
      qualificationAssessmentId,
      data.competency_framework || null,
      data.competency_category || '',
      data.competency_name || '',
      data.required_level || 0,
      data.demonstrated_level || 0,
      data.assessment_method || 'behavioral_interview',
      JSON.stringify(data.behavioral_indicators || []),
      JSON.stringify(data.situational_examples || []),
      JSON.stringify(data.assessment_scenarios || []),
      JSON.stringify(data.competency_gaps || []),
      JSON.stringify(data.development_recommendations || []),
      data.assessor_confidence || 0,
      JSON.stringify(data.external_validation || []),
      JSON.stringify(data.industry_benchmarks || []),
      data.future_potential_score || 0,
      now
    );
    
    return this.getById(id)!;
  }

  static getById(id: string): CompetencyValidation | null {
    const stmt = db.prepare('SELECT * FROM competency_validations WHERE id = ?');
    const row = stmt.get(id) as any;
    
    if (!row) return null;
    
    return {
      ...row,
      behavioral_indicators: JSON.parse(row.behavioral_indicators || '[]'),
      situational_examples: JSON.parse(row.situational_examples || '[]'),
      assessment_scenarios: JSON.parse(row.assessment_scenarios || '[]'),
      competency_gaps: JSON.parse(row.competency_gaps || '[]'),
      development_recommendations: JSON.parse(row.development_recommendations || '[]'),
      external_validation: JSON.parse(row.external_validation || '[]'),
      industry_benchmarks: JSON.parse(row.industry_benchmarks || '[]')
    };
  }

  static getByAssessmentId(assessmentId: string): CompetencyValidation[] {
    const stmt = db.prepare('SELECT * FROM competency_validations WHERE qualification_assessment_id = ? ORDER BY competency_category, competency_name');
    const rows = stmt.all(assessmentId) as any[];
    
    return rows.map(row => ({
      ...row,
      behavioral_indicators: JSON.parse(row.behavioral_indicators || '[]'),
      situational_examples: JSON.parse(row.situational_examples || '[]'),
      assessment_scenarios: JSON.parse(row.assessment_scenarios || '[]'),
      competency_gaps: JSON.parse(row.competency_gaps || '[]'),
      development_recommendations: JSON.parse(row.development_recommendations || '[]'),
      external_validation: JSON.parse(row.external_validation || '[]'),
      industry_benchmarks: JSON.parse(row.industry_benchmarks || '[]')
    }));
  }

  static update(id: string, data: Partial<CompetencyValidation>): CompetencyValidation | null {
    const updates: string[] = [];
    const values: any[] = [];
    
    Object.entries(data).forEach(([key, value]) => {
      if (key !== 'id' && key !== 'created_at' && value !== undefined) {
        updates.push(`${key} = ?`);
        if (typeof value === 'object' && value !== null) {
          values.push(JSON.stringify(value));
        } else {
          values.push(value);
        }
      }
    });
    
    if (updates.length === 0) return this.getById(id);
    
    values.push(id);
    
    const stmt = db.prepare(`UPDATE competency_validations SET ${updates.join(', ')} WHERE id = ?`);
    stmt.run(...values);
    
    return this.getById(id);
  }

  static delete(id: string): boolean {
    const stmt = db.prepare('DELETE FROM competency_validations WHERE id = ?');
    const result = stmt.run(id);
    return result.changes > 0;
  }
}

// Cultural Fit Assessment Service
export class CulturalFitAssessmentService {
  static create(qualificationAssessmentId: string, data: Partial<CulturalFitAssessment>): CulturalFitAssessment {
    const id = uuidv4();
    const now = new Date().toISOString();
    
    const stmt = db.prepare(`
      INSERT INTO cultural_fit_assessments (
        id, qualification_assessment_id, company_culture_profile, individual_profile,
        values_alignment_score, work_style_compatibility, communication_style_fit,
        leadership_style_fit, decision_making_style_fit, change_adaptability_score,
        team_integration_potential, cultural_red_flags, integration_strategies,
        cultural_development_plan, assessment_methodology, external_consultant_used,
        assessment_tools_used, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    stmt.run(
      id,
      qualificationAssessmentId,
      JSON.stringify(data.company_culture_profile || []),
      JSON.stringify(data.individual_profile || []),
      data.values_alignment_score || 0,
      data.work_style_compatibility || 0,
      data.communication_style_fit || 0,
      data.leadership_style_fit || 0,
      data.decision_making_style_fit || 0,
      data.change_adaptability_score || 0,
      data.team_integration_potential || 0,
      JSON.stringify(data.cultural_red_flags || []),
      JSON.stringify(data.integration_strategies || []),
      JSON.stringify(data.cultural_development_plan || []),
      data.assessment_methodology || null,
      data.external_consultant_used ? 1 : 0,
      JSON.stringify(data.assessment_tools_used || []),
      now
    );
    
    return this.getById(id)!;
  }

  static getById(id: string): CulturalFitAssessment | null {
    const stmt = db.prepare('SELECT * FROM cultural_fit_assessments WHERE id = ?');
    const row = stmt.get(id) as any;
    
    if (!row) return null;
    
    return {
      ...row,
      company_culture_profile: JSON.parse(row.company_culture_profile || '[]'),
      individual_profile: JSON.parse(row.individual_profile || '[]'),
      cultural_red_flags: JSON.parse(row.cultural_red_flags || '[]'),
      integration_strategies: JSON.parse(row.integration_strategies || '[]'),
      cultural_development_plan: JSON.parse(row.cultural_development_plan || '[]'),
      assessment_tools_used: JSON.parse(row.assessment_tools_used || '[]')
    };
  }

  static getByAssessmentId(assessmentId: string): CulturalFitAssessment[] {
    const stmt = db.prepare('SELECT * FROM cultural_fit_assessments WHERE qualification_assessment_id = ? ORDER BY created_at DESC');
    const rows = stmt.all(assessmentId) as any[];
    
    return rows.map(row => ({
      ...row,
      company_culture_profile: JSON.parse(row.company_culture_profile || '[]'),
      individual_profile: JSON.parse(row.individual_profile || '[]'),
      cultural_red_flags: JSON.parse(row.cultural_red_flags || '[]'),
      integration_strategies: JSON.parse(row.integration_strategies || '[]'),
      cultural_development_plan: JSON.parse(row.cultural_development_plan || '[]'),
      assessment_tools_used: JSON.parse(row.assessment_tools_used || '[]')
    }));
  }

  static update(id: string, data: Partial<CulturalFitAssessment>): CulturalFitAssessment | null {
    const updates: string[] = [];
    const values: any[] = [];
    
    Object.entries(data).forEach(([key, value]) => {
      if (key !== 'id' && key !== 'created_at' && value !== undefined) {
        updates.push(`${key} = ?`);
        if (typeof value === 'object' && value !== null) {
          values.push(JSON.stringify(value));
        } else {
          values.push(value);
        }
      }
    });
    
    if (updates.length === 0) return this.getById(id);
    
    values.push(id);
    
    const stmt = db.prepare(`UPDATE cultural_fit_assessments SET ${updates.join(', ')} WHERE id = ?`);
    stmt.run(...values);
    
    return this.getById(id);
  }

  static delete(id: string): boolean {
    const stmt = db.prepare('DELETE FROM cultural_fit_assessments WHERE id = ?');
    const result = stmt.run(id);
    return result.changes > 0;
  }
}

// Qualification Document Service
export class QualificationDocumentService {
  static create(qualificationAssessmentId: string, data: Partial<QualificationDocument>): QualificationDocument {
    const id = uuidv4();
    const now = new Date().toISOString();
    
    const stmt = db.prepare(`
      INSERT INTO qualification_documents (
        id, qualification_assessment_id, document_type, document_name,
        document_path, verification_status, verification_method,
        verification_date, verified_by, authenticity_score, relevance_score,
        quality_score, key_findings, discrepancies, verification_notes,
        expiry_date, issuing_authority, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    stmt.run(
      id,
      qualificationAssessmentId,
      data.document_type || 'resume',
      data.document_name || '',
      data.document_path || null,
      data.verification_status || 'pending',
      data.verification_method || null,
      data.verification_date || null,
      data.verified_by || null,
      data.authenticity_score || 0,
      data.relevance_score || 0,
      data.quality_score || 0,
      JSON.stringify(data.key_findings || []),
      JSON.stringify(data.discrepancies || []),
      data.verification_notes || null,
      data.expiry_date || null,
      data.issuing_authority || null,
      now
    );
    
    return this.getById(id)!;
  }

  static getById(id: string): QualificationDocument | null {
    const stmt = db.prepare('SELECT * FROM qualification_documents WHERE id = ?');
    const row = stmt.get(id) as any;
    
    if (!row) return null;
    
    return {
      ...row,
      key_findings: JSON.parse(row.key_findings || '[]'),
      discrepancies: JSON.parse(row.discrepancies || '[]')
    };
  }

  static getByAssessmentId(assessmentId: string): QualificationDocument[] {
    const stmt = db.prepare('SELECT * FROM qualification_documents WHERE qualification_assessment_id = ? ORDER BY document_type, document_name');
    const rows = stmt.all(assessmentId) as any[];
    
    return rows.map(row => ({
      ...row,
      key_findings: JSON.parse(row.key_findings || '[]'),
      discrepancies: JSON.parse(row.discrepancies || '[]')
    }));
  }

  static update(id: string, data: Partial<QualificationDocument>): QualificationDocument | null {
    const updates: string[] = [];
    const values: any[] = [];
    
    Object.entries(data).forEach(([key, value]) => {
      if (key !== 'id' && key !== 'created_at' && value !== undefined) {
        updates.push(`${key} = ?`);
        if (typeof value === 'object' && value !== null) {
          values.push(JSON.stringify(value));
        } else {
          values.push(value);
        }
      }
    });
    
    if (updates.length === 0) return this.getById(id);
    
    values.push(id);
    
    const stmt = db.prepare(`UPDATE qualification_documents SET ${updates.join(', ')} WHERE id = ?`);
    stmt.run(...values);
    
    return this.getById(id);
  }

  static delete(id: string): boolean {
    const stmt = db.prepare('DELETE FROM qualification_documents WHERE id = ?');
    const result = stmt.run(id);
    return result.changes > 0;
  }
}