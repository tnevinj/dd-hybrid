/**
 * Scoring Service
 * Handles score calculation, normalization, and weighting for deal screening
 */

import { DealScore, DealScreeningCriterion, DealScreeningTemplate } from '@/types/deal-screening';

export interface CriterionScore {
  criterionId: string;
  value: number;
  notes?: string;
  aiGenerated?: boolean;
  confidence?: number;
}

export interface ScoringResult {
  totalScore: number; // 0-100 scale
  criteriaScores: DealScore[];
  completionRate: number; // 0-1, percentage of criteria scored
  averageScore: number; // 0-100 scale
  weightedAverage: number; // 0-100 scale, weighted by criterion importance
  scoredCriteria: number; // Count of scored criteria
  totalCriteria: number; // Total criteria in template
  scoreBreakdown: Record<string, number>; // Dynamic category scores
}

export class ScoringService {
  
  /**
   * Calculate final scores from individual criterion scores
   */
  static calculateFinalScores(
    scores: Record<string, CriterionScore>,
    template: DealScreeningTemplate
  ): ScoringResult {
    const criteriaScores: DealScore[] = [];
    let totalWeightedScore = 0;
    let totalWeight = 0;
    let totalRawScore = 0;
    let scoredCriteria = 0;
    
    const categoryScores = {
      financial: { score: 0, weight: 0, count: 0 },
      operational: { score: 0, weight: 0, count: 0 },
      strategic: { score: 0, weight: 0, count: 0 },
      risk: { score: 0, weight: 0, count: 0 },
      other: { score: 0, weight: 0, count: 0 }
    };

    // Process each criterion in the template
    template.criteria.forEach(criterion => {
      const score = scores[criterion.id];
      
      if (score && score.value !== undefined && score.value !== null) {
        // Normalize score to 0-1 scale
        const normalizedScore = this.normalizeScore(score.value, criterion.minValue, criterion.maxValue);
        
        // Calculate weighted score
        const weightedScore = normalizedScore * criterion.weight;
        
        // Create DealScore object
        const dealScore: DealScore = {
          criterionId: criterion.id,
          value: score.value,
          normalizedScore,
          weightedScore,
          notes: score.notes,
          aiGenerated: score.aiGenerated || false,
          confidence: score.confidence
        };
        
        criteriaScores.push(dealScore);
        
        // Accumulate totals
        totalWeightedScore += weightedScore;
        totalWeight += criterion.weight;
        totalRawScore += score.value;
        scoredCriteria++;
        
        // Track category scores - map category to known categories or use 'other'
        let category = criterion.category.toLowerCase() as keyof typeof categoryScores;
        if (!categoryScores[category]) {
          category = 'other';
        }
        
        categoryScores[category].score += weightedScore;
        categoryScores[category].weight += criterion.weight;
        categoryScores[category].count++;
      }
    });

    // Calculate final metrics
    const completionRate = template.criteria.length > 0 ? scoredCriteria / template.criteria.length : 0;
    const averageScore = scoredCriteria > 0 ? (totalRawScore / scoredCriteria) : 0;
    const weightedAverage = totalWeight > 0 ? (totalWeightedScore / totalWeight) : 0;
    
    // Convert to 0-100 scale for totalScore - weightedAverage is already 0-1, so multiply by 100
    const totalScore = Math.round(weightedAverage * 100);
    
    // Calculate category breakdowns (already normalized, just convert to 0-100 scale)
    const scoreBreakdown: Record<string, number> = {};
    
    Object.entries(categoryScores).forEach(([categoryKey, data]) => {
      scoreBreakdown[categoryKey] = data.weight > 0 ? 
        Math.round((data.score / data.weight) * 100) : 0;
    });

    return {
      totalScore,
      criteriaScores,
      completionRate,
      averageScore: Math.round(averageScore * 10) / 10, // Round to 1 decimal
      weightedAverage: Math.round(weightedAverage * 100),
      scoredCriteria,
      totalCriteria: template.criteria.length,
      scoreBreakdown
    };
  }

  /**
   * Normalize a raw score to 0-1 scale based on min/max values
   */
  private static normalizeScore(value: number, minValue: number, maxValue: number): number {
    if (maxValue === minValue) return 1; // Avoid division by zero
    
    const normalized = (value - minValue) / (maxValue - minValue);
    return Math.max(0, Math.min(1, normalized)); // Clamp to 0-1 range
  }

  /**
   * Calculate recommendation based on total score
   * NOTE: Mode parameter kept for backward compatibility but doesn't affect thresholds
   * All modes use identical decision criteria to ensure consistent results
   */
  static calculateRecommendation(
    totalScore: number, 
    mode: 'traditional' | 'assisted' | 'autonomous'
  ): 'highly_recommended' | 'recommended' | 'neutral' | 'not_recommended' | 'rejected' {
    
    // Use consistent thresholds across all modes to ensure identical results for same scores
    // Mode affects interaction/process, not investment decision criteria
    if (totalScore >= 80) return 'highly_recommended';
    else if (totalScore >= 65) return 'recommended';  
    else if (totalScore >= 45) return 'neutral';
    else if (totalScore >= 25) return 'not_recommended';
    else return 'rejected';
  }

  /**
   * Validate scoring completeness
   */
  static validateScoring(
    scores: Record<string, CriterionScore>,
    template: DealScreeningTemplate,
    requireComplete: boolean = false
  ): { valid: boolean; errors: string[]; warnings: string[] } {
    const errors: string[] = [];
    const warnings: string[] = [];
    
    const scoredCriteria = Object.keys(scores).filter(id => 
      scores[id] && scores[id].value !== undefined && scores[id].value !== null
    );
    
    const totalCriteria = template.criteria.length;
    const completionRate = totalCriteria > 0 ? scoredCriteria.length / totalCriteria : 0;
    
    // Check for required completion
    if (requireComplete && completionRate < 1.0) {
      errors.push(`All ${totalCriteria} criteria must be scored before completing screening`);
    }
    
    // Check for minimum completion rate
    if (completionRate < 0.5) {
      warnings.push(`Only ${Math.round(completionRate * 100)}% of criteria have been scored`);
    }
    
    // Validate individual scores
    template.criteria.forEach(criterion => {
      const score = scores[criterion.id];
      
      if (score && score.value !== undefined && score.value !== null) {
        // Check score bounds
        if (score.value < criterion.minValue || score.value > criterion.maxValue) {
          errors.push(`Score for "${criterion.name}" must be between ${criterion.minValue} and ${criterion.maxValue}`);
        }
        
        // Check for AI confidence warnings
        if (score.aiGenerated && score.confidence && score.confidence < 0.70) {
          warnings.push(`AI confidence for "${criterion.name}" is low (${Math.round(score.confidence * 100)}%)`);
        }
      }
    });
    
    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Get scoring progress and statistics
   */
  static getScoringProgress(
    scores: Record<string, CriterionScore>,
    template: DealScreeningTemplate
  ): {
    completedCount: number;
    totalCount: number;
    completionRate: number;
    categoryProgress: Record<string, { completed: number; total: number; rate: number }>;
    nextCriterion?: DealScreeningCriterion;
  } {
    const completedCriteria = new Set(
      Object.keys(scores).filter(id => 
        scores[id] && scores[id].value !== undefined && scores[id].value !== null
      )
    );
    
    const totalCount = template.criteria.length;
    const completedCount = completedCriteria.size;
    const completionRate = totalCount > 0 ? completedCount / totalCount : 0;
    
    // Calculate category progress
    const categoryProgress: Record<string, { completed: number; total: number; rate: number }> = {};
    const categoryTotals: Record<string, number> = {};
    
    template.criteria.forEach(criterion => {
      const category = criterion.category;
      
      if (!categoryTotals[category]) {
        categoryTotals[category] = 0;
        categoryProgress[category] = { completed: 0, total: 0, rate: 0 };
      }
      
      categoryTotals[category]++;
      categoryProgress[category].total++;
      
      if (completedCriteria.has(criterion.id)) {
        categoryProgress[category].completed++;
      }
    });
    
    // Calculate completion rates for categories
    Object.keys(categoryProgress).forEach(category => {
      const progress = categoryProgress[category];
      progress.rate = progress.total > 0 ? progress.completed / progress.total : 0;
    });
    
    // Find next criterion to score
    const nextCriterion = template.criteria.find(criterion => 
      !completedCriteria.has(criterion.id)
    );
    
    return {
      completedCount,
      totalCount,
      completionRate,
      categoryProgress,
      nextCriterion
    };
  }

  /**
   * Convert scores from UI format to API format
   */
  static convertScoresForAPI(
    scores: Record<string, CriterionScore>,
    template: DealScreeningTemplate
  ): DealScore[] {
    const scoringResult = this.calculateFinalScores(scores, template);
    return scoringResult.criteriaScores;
  }

  /**
   * Create empty score record for template
   */
  static createEmptyScoreRecord(template: DealScreeningTemplate): Record<string, CriterionScore> {
    const scores: Record<string, CriterionScore> = {};
    
    template.criteria.forEach(criterion => {
      scores[criterion.id] = {
        criterionId: criterion.id,
        value: 0, // Default to minimum or neutral value
        notes: '',
        aiGenerated: false
      };
    });
    
    return scores;
  }

  /**
   * Merge AI suggestions into existing scores
   */
  static mergeAISuggestions(
    existingScores: Record<string, CriterionScore>,
    aiSuggestions: Record<string, any>, // AISuggestion type
    overrideExisting: boolean = false
  ): Record<string, CriterionScore> {
    const mergedScores = { ...existingScores };
    
    Object.keys(aiSuggestions).forEach(criterionId => {
      const suggestion = aiSuggestions[criterionId];
      const existingScore = mergedScores[criterionId];
      
      // Only update if no existing score or override is requested
      if (!existingScore || !existingScore.value || overrideExisting) {
        mergedScores[criterionId] = {
          criterionId,
          value: suggestion.score,
          notes: suggestion.reasoning,
          aiGenerated: true,
          confidence: suggestion.confidence
        };
      }
    });
    
    return mergedScores;
  }

  /**
   * Format score for display
   */
  static formatScore(score: number, precision: number = 1): string {
    return score.toFixed(precision);
  }

  /**
   * Get score color class for UI display
   */
  static getScoreColorClass(score: number, scale: 'percentage' | 'ten_point' = 'percentage'): string {
    let normalizedScore = score;
    
    if (scale === 'ten_point') {
      normalizedScore = (score / 10) * 100; // Convert 0-10 to 0-100
    }
    
    if (normalizedScore >= 80) return 'text-green-600 bg-green-50';
    else if (normalizedScore >= 65) return 'text-blue-600 bg-blue-50';
    else if (normalizedScore >= 45) return 'text-yellow-600 bg-yellow-50';
    else if (normalizedScore >= 25) return 'text-orange-600 bg-orange-50';
    else return 'text-red-600 bg-red-50';
  }

  /**
   * Get recommendation color class for UI display
   */
  static getRecommendationColorClass(recommendation: string): string {
    switch (recommendation) {
      case 'highly_recommended': return 'bg-green-100 text-green-800 border-green-200';
      case 'recommended': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'neutral': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'not_recommended': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  }
}