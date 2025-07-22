/**
 * AI Tracking Service
 * Implements user pattern learning and interaction tracking as specified in hybrid-developer-guide
 */

export interface AIInteraction {
  id: string
  userId: string
  timestamp: Date
  interactionType: 'hint_dismissed' | 'hint_accepted' | 'recommendation_accepted' | 'recommendation_rejected' | 
                  'automation_approved' | 'automation_declined' | 'decision_made' | 'action_reversed' | 'switch_to_traditional' |
                  'switch_to_assisted' | 'switch_to_autonomous' | 'feature_discovered' | 'workflow_completed'
  recommendationId?: string
  userAction: 'accepted' | 'rejected' | 'modified' | 'ignored'
  timeSavedSeconds?: number
  module: string
  context: Record<string, any>
  metadata?: {
    confidence?: number
    reasoning?: string
    originalAction?: string
    modifiedAction?: string
  }
}

export interface UserPattern {
  id: string
  userId: string
  patternType: 'workflow_preference' | 'automation_comfort' | 'decision_style' | 'time_usage' | 
              'feature_adoption' | 'risk_tolerance' | 'collaboration_style'
  patternData: Record<string, any>
  frequency: number
  lastObserved: Date
  confidenceScore: number // 0-1
  module?: string
  tags: string[]
}

export interface AIAdoptionMetrics {
  userId: string
  currentMode: 'traditional' | 'assisted' | 'autonomous'
  aiAdoptionLevel: number // 0-100
  timeInMode: {
    traditional: number // seconds
    assisted: number
    autonomous: number
  }
  featuresUsed: string[]
  timeSavedThisWeek: number // seconds
  accuracyRate: number // 0-1
  satisfactionScore: number // 1-10
  lastModeSwitch: Date
}

export class AITrackingService {
  private interactions: AIInteraction[] = []
  private patterns: UserPattern[] = []
  private adoptionMetrics: Map<string, AIAdoptionMetrics> = new Map()

  // Track AI interactions
  async trackInteraction(interaction: Omit<AIInteraction, 'id' | 'timestamp'>): Promise<void> {
    const fullInteraction: AIInteraction = {
      id: this.generateId(),
      timestamp: new Date(),
      ...interaction
    }

    this.interactions.push(fullInteraction)
    
    // Learn patterns from this interaction
    await this.updateUserPatterns(fullInteraction)
    
    // Update adoption metrics
    await this.updateAdoptionMetrics(fullInteraction)
    
    // In production, save to database
    await this.saveInteractionToDB(fullInteraction)
  }

  // Learn patterns from user behavior
  private async updateUserPatterns(interaction: AIInteraction): Promise<void> {
    // Pattern: Automation Comfort Level
    if (['automation_approved', 'automation_declined'].includes(interaction.interactionType)) {
      await this.updatePattern(interaction.userId, {
        patternType: 'automation_comfort',
        patternData: {
          action: interaction.userAction,
          module: interaction.module,
          context: interaction.context
        },
        tags: ['automation', interaction.module]
      })
    }

    // Pattern: Decision Speed
    if (interaction.interactionType === 'decision_made') {
      const decisionTime = interaction.context.decisionTimeMs || 0
      await this.updatePattern(interaction.userId, {
        patternType: 'decision_style',
        patternData: {
          speed: decisionTime < 5000 ? 'fast' : decisionTime < 15000 ? 'medium' : 'slow',
          confidence: interaction.metadata?.confidence,
          module: interaction.module
        },
        tags: ['decision', 'speed']
      })
    }

    // Pattern: Feature Discovery
    if (interaction.interactionType === 'feature_discovered') {
      await this.updatePattern(interaction.userId, {
        patternType: 'feature_adoption',
        patternData: {
          feature: interaction.context.feature,
          discoveryMethod: interaction.context.method,
          timeToAdopt: interaction.context.timeToAdopt
        },
        tags: ['adoption', 'discovery']
      })
    }

    // Pattern: Time Usage
    if (interaction.timeSavedSeconds) {
      await this.updatePattern(interaction.userId, {
        patternType: 'time_usage',
        patternData: {
          taskType: interaction.context.taskType,
          timeSaved: interaction.timeSavedSeconds,
          efficiencyGain: interaction.context.efficiencyGain
        },
        tags: ['efficiency', 'time']
      })
    }
  }

  private async updatePattern(userId: string, patternData: Partial<UserPattern>): Promise<void> {
    const existingPattern = this.patterns.find(p => 
      p.userId === userId && 
      p.patternType === patternData.patternType &&
      JSON.stringify(p.patternData) === JSON.stringify(patternData.patternData)
    )

    if (existingPattern) {
      // Update existing pattern
      existingPattern.frequency += 1
      existingPattern.lastObserved = new Date()
      existingPattern.confidenceScore = Math.min(1, existingPattern.confidenceScore + 0.1)
    } else {
      // Create new pattern
      const newPattern: UserPattern = {
        id: this.generateId(),
        userId,
        patternType: patternData.patternType!,
        patternData: patternData.patternData || {},
        frequency: 1,
        lastObserved: new Date(),
        confidenceScore: 0.1,
        module: patternData.module,
        tags: patternData.tags || []
      }
      this.patterns.push(newPattern)
    }
  }

  // Update adoption metrics
  private async updateAdoptionMetrics(interaction: AIInteraction): Promise<void> {
    let metrics = this.adoptionMetrics.get(interaction.userId)
    
    if (!metrics) {
      metrics = {
        userId: interaction.userId,
        currentMode: 'traditional',
        aiAdoptionLevel: 0,
        timeInMode: { traditional: 0, assisted: 0, autonomous: 0 },
        featuresUsed: [],
        timeSavedThisWeek: 0,
        accuracyRate: 0.5,
        satisfactionScore: 5,
        lastModeSwitch: new Date()
      }
    }

    // Track mode switches
    if (interaction.interactionType.startsWith('switch_to_')) {
      const newMode = interaction.interactionType.replace('switch_to_', '') as any
      metrics.currentMode = newMode
      metrics.lastModeSwitch = new Date()
      
      // Increase adoption level based on progression
      if (newMode === 'assisted' && metrics.aiAdoptionLevel < 50) {
        metrics.aiAdoptionLevel = Math.max(50, metrics.aiAdoptionLevel + 20)
      } else if (newMode === 'autonomous') {
        metrics.aiAdoptionLevel = Math.max(80, metrics.aiAdoptionLevel + 30)
      }
    }

    // Track time saved
    if (interaction.timeSavedSeconds) {
      metrics.timeSavedThisWeek += interaction.timeSavedSeconds
    }

    // Track feature usage
    const feature = interaction.context.feature || interaction.interactionType
    if (!metrics.featuresUsed.includes(feature)) {
      metrics.featuresUsed.push(feature)
      metrics.aiAdoptionLevel += 2 // Small boost for trying new features
    }

    // Update accuracy based on successful actions
    if (interaction.userAction === 'accepted') {
      metrics.accuracyRate = (metrics.accuracyRate * 0.9) + (0.1 * 1) // Weighted average
    } else if (interaction.userAction === 'rejected') {
      metrics.accuracyRate = (metrics.accuracyRate * 0.9) + (0.1 * 0)
    }

    this.adoptionMetrics.set(interaction.userId, metrics)
  }

  // Get user patterns for recommendation generation
  async getUserPatterns(userId: string, patternType?: UserPattern['patternType']): Promise<UserPattern[]> {
    let userPatterns = this.patterns.filter(p => p.userId === userId)
    
    if (patternType) {
      userPatterns = userPatterns.filter(p => p.patternType === patternType)
    }
    
    // Sort by confidence and recency
    return userPatterns.sort((a, b) => {
      const scoreA = a.confidenceScore * 0.7 + (Date.now() - a.lastObserved.getTime()) / (1000 * 60 * 60 * 24) * 0.3
      const scoreB = b.confidenceScore * 0.7 + (Date.now() - b.lastObserved.getTime()) / (1000 * 60 * 60 * 24) * 0.3
      return scoreB - scoreA
    })
  }

  // Get adoption metrics for user
  async getAdoptionMetrics(userId: string): Promise<AIAdoptionMetrics | null> {
    return this.adoptionMetrics.get(userId) || null
  }

  // Generate recommendations based on patterns
  async generateContextualRecommendations(userId: string, currentContext: {
    module: string
    currentTask?: string
    timeSpent?: number
    similarUsers?: string[]
  }): Promise<any[]> {
    const patterns = await this.getUserPatterns(userId)
    const metrics = await this.getAdoptionMetrics(userId)
    const recommendations = []

    // Recommendation: Suggest mode upgrade
    if (metrics && metrics.currentMode === 'traditional' && metrics.aiAdoptionLevel > 30) {
      const automationPatterns = patterns.filter(p => p.patternType === 'automation_comfort')
      const positiveAutomation = automationPatterns.filter(p => p.patternData.action === 'accepted')
      
      if (positiveAutomation.length >= 2) {
        recommendations.push({
          id: 'upgrade-to-assisted',
          type: 'suggestion',
          priority: 'medium',
          title: 'Ready for AI Assistance?',
          description: `You've successfully used ${positiveAutomation.length} automated features. Assisted mode could save you ${Math.round(metrics.timeSavedThisWeek / 3600)} more hours per week.`,
          actions: [{
            label: 'Try Assisted Mode',
            action: 'SWITCH_TO_ASSISTED',
            estimatedTimeSaving: 120
          }],
          confidence: 0.85
        })
      }
    }

    // Recommendation: Suggest automation based on repetitive patterns
    const workflowPatterns = patterns.filter(p => p.patternType === 'workflow_preference')
    const repetitiveWorkflows = workflowPatterns.filter(p => p.frequency >= 3)
    
    repetitiveWorkflows.forEach(pattern => {
      if (pattern.patternData.module === currentContext.module) {
        recommendations.push({
          id: `automate-${pattern.id}`,
          type: 'automation',
          priority: 'high',
          title: `Automate ${pattern.patternData.taskName || 'This Workflow'}`,
          description: `You've done this ${pattern.frequency} times. I can automate it with ${Math.round(pattern.confidenceScore * 100)}% confidence.`,
          actions: [{
            label: 'Automate Now',
            action: 'AUTOMATE_WORKFLOW',
            params: { patternId: pattern.id }
          }],
          confidence: pattern.confidenceScore
        })
      }
    })

    // Recommendation: Feature discovery
    const allFeatures = ['document-analysis', 'risk-scoring', 'pattern-matching', 'auto-categorization']
    const unusedFeatures = allFeatures.filter(f => !metrics?.featuresUsed.includes(f))
    
    if (unusedFeatures.length > 0 && metrics && metrics.aiAdoptionLevel > 40) {
      recommendations.push({
        id: 'discover-features',
        type: 'insight',
        priority: 'low',
        title: 'Discover More Features',
        description: `${unusedFeatures.length} powerful features are available that could further streamline your workflow.`,
        actions: [{
          label: 'Show Me',
          action: 'SHOW_FEATURES',
          params: { features: unusedFeatures }
        }],
        confidence: 0.7
      })
    }

    return recommendations
  }

  // Measure ROI and efficiency gains
  async calculateROI(userId: string, timeframe: 'week' | 'month' | 'quarter' = 'week'): Promise<{
    timeSaved: number
    costSaved: number
    accuracyImprovement: number
    satisfactionScore: number
    adoptionProgress: number
  }> {
    const metrics = await this.getAdoptionMetrics(userId)
    if (!metrics) {
      return {
        timeSaved: 0,
        costSaved: 0,
        accuracyImprovement: 0,
        satisfactionScore: 5,
        adoptionProgress: 0
      }
    }

    const multiplier = timeframe === 'week' ? 1 : timeframe === 'month' ? 4 : 12
    const hourlyRate = 150 // Average knowledge worker rate

    return {
      timeSaved: metrics.timeSavedThisWeek * multiplier,
      costSaved: (metrics.timeSavedThisWeek / 3600) * hourlyRate * multiplier,
      accuracyImprovement: Math.max(0, (metrics.accuracyRate - 0.85) * 100),
      satisfactionScore: metrics.satisfactionScore,
      adoptionProgress: metrics.aiAdoptionLevel
    }
  }

  private generateId(): string {
    return `ai-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  private async saveInteractionToDB(interaction: AIInteraction): Promise<void> {
    // In production, save to database
    // await db.aiInteractions.create(interaction)
    console.log('Saving interaction:', interaction.interactionType, interaction.context)
  }
}

// Global instance
export const aiTrackingService = new AITrackingService()