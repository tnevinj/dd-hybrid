import { 
  QualificationAssessmentService,
  SkillValidationService,
  ReferenceCheckService,
  PerformanceValidationService,
  CompetencyValidationService,
  CulturalFitAssessmentService
} from './database';

export interface QualificationScores {
  overall_qualification_score: number;
  skills_score: number;
  references_score: number;
  performance_score: number;
  competency_score: number;
  cultural_fit_score: number;
  confidence_level: number;
  red_flags_count: number;
  verification_completeness: number;
}

export interface ValidationResult {
  isValid: boolean;
  score: number;
  confidence: number;
  discrepancies: string[];
  red_flags: string[];
  recommendations: string[];
}

export class QualificationScoringService {
  /**
   * Calculate overall qualification score for a team member
   */
  static calculateOverallScore(teamMemberId: string): QualificationScores {
    const assessments = QualificationAssessmentService.getByTeamMemberId(teamMemberId);
    
    if (assessments.length === 0) {
      return {
        overall_qualification_score: 0,
        skills_score: 0,
        references_score: 0,
        performance_score: 0,
        competency_score: 0,
        cultural_fit_score: 0,
        confidence_level: 0,
        red_flags_count: 0,
        verification_completeness: 0
      };
    }

    // Calculate individual assessment scores
    const skillsScore = this.calculateSkillsScore(assessments);
    const referencesScore = this.calculateReferencesScore(assessments);
    const performanceScore = this.calculatePerformanceScore(assessments);
    const competencyScore = this.calculateCompetencyScore(assessments);
    const culturalFitScore = this.calculateCulturalFitScore(assessments);

    // Calculate weighted overall score
    const weights = {
      skills: 0.25,
      references: 0.20,
      performance: 0.25,
      competency: 0.20,
      cultural_fit: 0.10
    };

    const overallScore = Math.round(
      skillsScore * weights.skills +
      referencesScore * weights.references +
      performanceScore * weights.performance +
      competencyScore * weights.competency +
      culturalFitScore * weights.cultural_fit
    );

    // Calculate confidence level
    const confidenceLevel = this.calculateConfidenceLevel(assessments);
    
    // Count red flags
    const redFlagsCount = assessments.reduce((count, assessment) => 
      count + assessment.red_flags.length, 0
    );

    // Calculate verification completeness
    const verificationCompleteness = this.calculateVerificationCompleteness(assessments);

    return {
      overall_qualification_score: overallScore,
      skills_score: skillsScore,
      references_score: referencesScore,
      performance_score: performanceScore,
      competency_score: competencyScore,
      cultural_fit_score: culturalFitScore,
      confidence_level: confidenceLevel,
      red_flags_count: redFlagsCount,
      verification_completeness: verificationCompleteness
    };
  }

  /**
   * Calculate skills validation score
   */
  private static calculateSkillsScore(assessments: any[]): number {
    const skillsAssessments = assessments.filter(a => a.assessment_type === 'skills');
    if (skillsAssessments.length === 0) return 0;

    let totalScore = 0;
    let totalWeight = 0;

    skillsAssessments.forEach(assessment => {
      const skillValidations = SkillValidationService.getByAssessmentId(assessment.id);
      
      skillValidations.forEach(skill => {
        const skillScore = this.calculateIndividualSkillScore(skill);
        const weight = this.getSkillWeight(skill.skill_category);
        
        totalScore += skillScore * weight;
        totalWeight += weight;
      });
    });

    return totalWeight > 0 ? Math.round(totalScore / totalWeight) : 0;
  }

  /**
   * Calculate individual skill score based on validation
   */
  private static calculateIndividualSkillScore(skill: any): number {
    const validatedProficiency = skill.validated_proficiency || 0;
    const evidenceQuality = skill.evidence_quality || 0;
    const industryRelevance = skill.industry_relevance || 0;
    
    // Weight the components
    const score = (
      validatedProficiency * 0.6 +
      evidenceQuality * 0.25 +
      industryRelevance * 0.15
    );

    // Apply variance penalty if claimed vs validated differs significantly
    const variance = Math.abs(skill.claimed_proficiency - validatedProficiency);
    const variancePenalty = Math.min(variance * 0.5, 20); // Max 20 point penalty
    
    return Math.max(0, Math.round(score - variancePenalty));
  }

  /**
   * Get skill category weight
   */
  private static getSkillWeight(category: string): number {
    const weights: Record<string, number> = {
      'leadership': 1.3,
      'strategic': 1.2,
      'financial': 1.1,
      'operational': 1.0,
      'technical': 0.9
    };
    
    return weights[category] || 1.0;
  }

  /**
   * Calculate references score
   */
  private static calculateReferencesScore(assessments: any[]): number {
    const referenceAssessments = assessments.filter(a => a.assessment_type === 'references');
    if (referenceAssessments.length === 0) return 0;

    let totalScore = 0;
    let totalReferences = 0;

    referenceAssessments.forEach(assessment => {
      const referenceChecks = ReferenceCheckService.getByAssessmentId(assessment.id);
      
      referenceChecks.forEach(reference => {
        if (reference.response_status === 'completed') {
          const referenceScore = this.calculateIndividualReferenceScore(reference);
          totalScore += referenceScore;
          totalReferences++;
        }
      });
    });

    return totalReferences > 0 ? Math.round(totalScore / totalReferences) : 0;
  }

  /**
   * Calculate individual reference score
   */
  private static calculateIndividualReferenceScore(reference: any): number {
    const overallRating = reference.overall_rating || 0;
    const integrityRating = reference.integrity_rating || 0;
    const performanceRating = reference.performance_rating || 0;
    
    // Base score from ratings
    let score = (overallRating * 0.4 + integrityRating * 0.3 + performanceRating * 0.3);
    
    // Bonus for would rehire
    if (reference.would_rehire === true) {
      score += 5;
    } else if (reference.would_rehire === false) {
      score -= 10;
    }
    
    // Penalty for red flags
    const redFlagsPenalty = reference.red_flags.length * 5;
    score -= redFlagsPenalty;
    
    // Relationship weight
    const relationshipWeight = this.getReferenceRelationshipWeight(reference.relationship_to_candidate);
    score *= relationshipWeight;
    
    return Math.max(0, Math.min(100, Math.round(score)));
  }

  /**
   * Get reference relationship weight
   */
  private static getReferenceRelationshipWeight(relationship: string): number {
    const weights: Record<string, number> = {
      'direct_manager': 1.2,
      'board_member': 1.1,
      'client': 1.0,
      'peer': 0.9,
      'subordinate': 0.8
    };
    
    return weights[relationship] || 1.0;
  }

  /**
   * Calculate performance validation score
   */
  private static calculatePerformanceScore(assessments: any[]): number {
    const performanceAssessments = assessments.filter(a => a.assessment_type === 'performance');
    if (performanceAssessments.length === 0) return 0;

    let totalScore = 0;
    let count = 0;

    performanceAssessments.forEach(assessment => {
      const performanceValidations = PerformanceValidationService.getByAssessmentId(assessment.id);
      
      performanceValidations.forEach(performance => {
        const performanceScore = this.calculateIndividualPerformanceScore(performance);
        totalScore += performanceScore;
        count++;
      });
    });

    return count > 0 ? Math.round(totalScore / count) : 0;
  }

  /**
   * Calculate individual performance score
   */
  private static calculateIndividualPerformanceScore(performance: any): number {
    // Base score from validation confidence
    let score = (performance.validation_confidence || 0) * 100;
    
    // Stakeholder feedback component
    const stakeholderScore = (
      (performance.stakeholder_feedback_score || 0) * 0.3 +
      (performance.peer_review_score || 0) * 0.25 +
      (performance.subordinate_feedback_score || 0) * 0.25 +
      (performance.client_satisfaction_score || 0) * 0.2
    );
    
    // Weighted combination
    score = score * 0.6 + stakeholderScore * 0.4;
    
    // Penalty for discrepancies
    const discrepanciesPenalty = performance.discrepancies_found.length * 3;
    score -= discrepanciesPenalty;
    
    // Bonus for quantifiable achievements
    const achievementsVerified = performance.validated_achievements.length;
    const achievementsClaimed = performance.claimed_achievements.length;
    const verificationRate = achievementsClaimed > 0 ? achievementsVerified / achievementsClaimed : 0;
    const verificationBonus = verificationRate * 10; // Up to 10 point bonus
    
    score += verificationBonus;
    
    return Math.max(0, Math.min(100, Math.round(score)));
  }

  /**
   * Calculate competency validation score
   */
  private static calculateCompetencyScore(assessments: any[]): number {
    const competencyAssessments = assessments.filter(a => a.assessment_type === 'competency');
    if (competencyAssessments.length === 0) return 0;

    let totalScore = 0;
    let totalWeight = 0;

    competencyAssessments.forEach(assessment => {
      const competencyValidations = CompetencyValidationService.getByAssessmentId(assessment.id);
      
      competencyValidations.forEach(competency => {
        const competencyScore = this.calculateIndividualCompetencyScore(competency);
        const weight = this.getCompetencyWeight(competency.competency_category);
        
        totalScore += competencyScore * weight;
        totalWeight += weight;
      });
    });

    return totalWeight > 0 ? Math.round(totalScore / totalWeight) : 0;
  }

  /**
   * Calculate individual competency score
   */
  private static calculateIndividualCompetencyScore(competency: any): number {
    const demonstratedLevel = competency.demonstrated_level || 0;
    const requiredLevel = competency.required_level || 0;
    const assessorConfidence = (competency.assessor_confidence || 0) * 100;
    const futurePotential = competency.future_potential_score || 0;
    
    // Base score from demonstrated vs required level
    const levelScore = Math.min(100, (demonstratedLevel / Math.max(requiredLevel, 1)) * 100);
    
    // Weighted combination
    const score = (
      levelScore * 0.5 +
      assessorConfidence * 0.3 +
      futurePotential * 0.2
    );
    
    // Penalty for significant competency gaps
    const gapsPenalty = competency.competency_gaps.length * 2;
    
    return Math.max(0, Math.round(score - gapsPenalty));
  }

  /**
   * Get competency category weight
   */
  private static getCompetencyWeight(category: string): number {
    const weights: Record<string, number> = {
      'Leadership': 1.3,
      'Strategic': 1.2,
      'Execution': 1.1,
      'Financial': 1.0,
      'Technical': 0.9
    };
    
    return weights[category] || 1.0;
  }

  /**
   * Calculate cultural fit score
   */
  private static calculateCulturalFitScore(assessments: any[]): number {
    const culturalAssessments = assessments.filter(a => a.assessment_type === 'cultural_fit');
    if (culturalAssessments.length === 0) return 75; // Default neutral score

    let totalScore = 0;
    let count = 0;

    culturalAssessments.forEach(assessment => {
      const culturalFitAssessments = CulturalFitAssessmentService.getByAssessmentId(assessment.id);
      
      culturalFitAssessments.forEach(cultural => {
        const culturalScore = this.calculateIndividualCulturalFitScore(cultural);
        totalScore += culturalScore;
        count++;
      });
    });

    return count > 0 ? Math.round(totalScore / count) : 75;
  }

  /**
   * Calculate individual cultural fit score
   */
  private static calculateIndividualCulturalFitScore(cultural: any): number {
    const valuesAlignment = cultural.values_alignment_score || 0;
    const workStyleCompatibility = cultural.work_style_compatibility || 0;
    const communicationFit = cultural.communication_style_fit || 0;
    const leadershipFit = cultural.leadership_style_fit || 0;
    const teamIntegration = cultural.team_integration_potential || 0;
    
    // Weighted average of cultural fit dimensions
    const score = (
      valuesAlignment * 0.25 +
      workStyleCompatibility * 0.20 +
      communicationFit * 0.20 +
      leadershipFit * 0.20 +
      teamIntegration * 0.15
    );
    
    // Penalty for cultural red flags
    const redFlagsPenalty = cultural.cultural_red_flags.length * 5;
    
    return Math.max(0, Math.round(score - redFlagsPenalty));
  }

  /**
   * Calculate overall confidence level
   */
  private static calculateConfidenceLevel(assessments: any[]): number {
    if (assessments.length === 0) return 0;

    const totalConfidence = assessments.reduce((sum, assessment) => 
      sum + (assessment.confidence_level || 0), 0
    );
    
    const avgConfidence = totalConfidence / assessments.length;
    
    // Adjust confidence based on completeness
    const completedAssessments = assessments.filter(a => a.verification_status === 'completed').length;
    const completenessMultiplier = completedAssessments / assessments.length;
    
    return Math.round(avgConfidence * completenessMultiplier * 100) / 100;
  }

  /**
   * Calculate verification completeness percentage
   */
  private static calculateVerificationCompleteness(assessments: any[]): number {
    if (assessments.length === 0) return 0;

    const requiredAssessmentTypes = ['skills', 'references', 'performance', 'competency'];
    const completedTypes = new Set(
      assessments
        .filter(a => a.verification_status === 'completed')
        .map(a => a.assessment_type)
    );

    const completenessScore = (completedTypes.size / requiredAssessmentTypes.length) * 100;
    
    return Math.round(completenessScore);
  }

  /**
   * Validate qualification assessment data
   */
  static validateQualificationData(teamMemberId: string): ValidationResult {
    const assessments = QualificationAssessmentService.getByTeamMemberId(teamMemberId);
    
    const discrepancies: string[] = [];
    const redFlags: string[] = [];
    const recommendations: string[] = [];
    
    let validationScore = 100;
    let confidence = 1.0;

    // Check for missing critical assessments
    const assessmentTypes = new Set(assessments.map(a => a.assessment_type));
    const requiredTypes = ['skills', 'references', 'performance'];
    
    requiredTypes.forEach(type => {
      if (!assessmentTypes.has(type)) {
        discrepancies.push(`Missing ${type} assessment`);
        validationScore -= 15;
        confidence -= 0.1;
      }
    });

    // Validate skills assessments
    assessments.filter(a => a.assessment_type === 'skills').forEach(assessment => {
      const skillValidations = SkillValidationService.getByAssessmentId(assessment.id);
      
      skillValidations.forEach(skill => {
        const variance = Math.abs(skill.claimed_proficiency - skill.validated_proficiency);
        
        if (variance > 20) {
          discrepancies.push(`Large variance in ${skill.skill_name}: claimed ${skill.claimed_proficiency}%, validated ${skill.validated_proficiency}%`);
          validationScore -= 5;
        }
        
        if (skill.evidence_quality < 60) {
          redFlags.push(`Low evidence quality for ${skill.skill_name}: ${skill.evidence_quality}%`);
          validationScore -= 3;
        }
      });
    });

    // Validate reference checks
    assessments.filter(a => a.assessment_type === 'references').forEach(assessment => {
      const referenceChecks = ReferenceCheckService.getByAssessmentId(assessment.id);
      const completedReferences = referenceChecks.filter(r => r.response_status === 'completed');
      
      if (completedReferences.length < 2) {
        discrepancies.push('Insufficient reference checks completed');
        validationScore -= 10;
        confidence -= 0.15;
      }
      
      completedReferences.forEach(reference => {
        if (reference.red_flags.length > 0) {
          redFlags.push(`Reference red flags from ${reference.reference_name}: ${reference.red_flags.join(', ')}`);
          validationScore -= reference.red_flags.length * 5;
        }
        
        if (reference.would_rehire === false) {
          redFlags.push(`${reference.reference_name} would not rehire candidate`);
          validationScore -= 15;
        }
      });
    });

    // Validate performance data
    assessments.filter(a => a.assessment_type === 'performance').forEach(assessment => {
      const performanceValidations = PerformanceValidationService.getByAssessmentId(assessment.id);
      
      performanceValidations.forEach(performance => {
        if (performance.validation_confidence < 0.7) {
          discrepancies.push(`Low performance validation confidence: ${Math.round(performance.validation_confidence * 100)}%`);
          validationScore -= 8;
          confidence -= 0.1;
        }
        
        if (performance.discrepancies_found.length > 3) {
          redFlags.push(`Multiple performance discrepancies found: ${performance.discrepancies_found.length} issues`);
          validationScore -= performance.discrepancies_found.length * 2;
        }
      });
    });

    // Generate recommendations
    if (validationScore < 70) {
      recommendations.push('Conduct additional reference checks to improve validation confidence');
      recommendations.push('Request additional documentation for performance claims');
    }
    
    if (redFlags.length > 2) {
      recommendations.push('Investigate red flags thoroughly before proceeding');
      recommendations.push('Consider additional due diligence measures');
    }
    
    if (confidence < 0.7) {
      recommendations.push('Improve assessment completeness and evidence quality');
      recommendations.push('Consider third-party validation services');
    }

    return {
      isValid: validationScore >= 60 && redFlags.length <= 3,
      score: Math.max(0, validationScore),
      confidence: Math.max(0, Math.min(1, confidence)),
      discrepancies,
      red_flags: redFlags,
      recommendations
    };
  }

  /**
   * Update qualification assessment scores
   */
  static updateAssessmentScores(teamMemberId: string): void {
    const scores = this.calculateOverallScore(teamMemberId);
    const validation = this.validateQualificationData(teamMemberId);
    
    // Update each assessment with calculated scores
    const assessments = QualificationAssessmentService.getByTeamMemberId(teamMemberId);
    
    assessments.forEach(assessment => {
      QualificationAssessmentService.update(assessment.id, {
        overall_qualification_score: scores.overall_qualification_score,
        confidence_level: scores.confidence_level,
        red_flags: validation.red_flags.map(flag => ({ description: flag, severity: 'medium' })),
        recommendations: validation.recommendations.map(rec => ({ description: rec, priority: 'medium' }))
      });
    });
  }
}