'use client'

import * as React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useNavigationStore } from '@/stores/navigation-store'
import { AIRecommendation, AIInsight } from '@/types/navigation'
import { 
  X, 
  Lightbulb, 
  Zap, 
  AlertTriangle, 
  Info, 
  ChevronRight,
  Brain,
  Clock,
  TrendingUp
} from 'lucide-react'
import { getPriorityColor } from '@/lib/utils'
import { formatTimeAgoSafe } from '@/hooks/use-client-date'

interface AIPanelProps {
  className?: string
}

export function AIPanel({ className }: AIPanelProps) {
  const { 
    isAIPanelOpen, 
    toggleAIPanel, 
    recommendations, 
    insights,
    currentModule,
    executeRecommendation,
    dismissRecommendation,
    getRecommendationsByModule,
    getHighPriorityRecommendations
  } = useNavigationStore()

  const moduleRecommendations = getRecommendationsByModule(currentModule)
  const highPriorityRecommendations = getHighPriorityRecommendations()

  if (!isAIPanelOpen) return null

  return (
    <div className={`w-80 border-l bg-background ${className}`}>
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-lg font-semibold">AI Assistant</h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleAIPanel}
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      <div className="p-4 space-y-6">
        {/* High Priority Recommendations */}
        {highPriorityRecommendations.length > 0 && (
          <div>
            <h3 className="text-sm font-medium mb-3 text-red-600">
              Urgent Recommendations
            </h3>
            <div className="space-y-3">
              {highPriorityRecommendations.slice(0, 3).map((recommendation) => (
                <RecommendationCard
                  key={recommendation.id}
                  recommendation={recommendation}
                  onExecute={() => executeRecommendation(recommendation.id)}
                  onDismiss={() => dismissRecommendation(recommendation.id)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Module-Specific Recommendations */}
        {moduleRecommendations.length > 0 && (
          <div>
            <h3 className="text-sm font-medium mb-3">
              For {currentModule.charAt(0).toUpperCase() + currentModule.slice(1)}
            </h3>
            <div className="space-y-3">
              {moduleRecommendations.slice(0, 4).map((recommendation) => (
                <RecommendationCard
                  key={recommendation.id}
                  recommendation={recommendation}
                  onExecute={() => executeRecommendation(recommendation.id)}
                  onDismiss={() => dismissRecommendation(recommendation.id)}
                />
              ))}
            </div>
          </div>
        )}

        {/* General Recommendations */}
        {recommendations.length > 0 && moduleRecommendations.length === 0 && (
          <div>
            <h3 className="text-sm font-medium mb-3">Recommendations</h3>
            <div className="space-y-3">
              {recommendations.slice(0, 5).map((recommendation) => (
                <RecommendationCard
                  key={recommendation.id}
                  recommendation={recommendation}
                  onExecute={() => executeRecommendation(recommendation.id)}
                  onDismiss={() => dismissRecommendation(recommendation.id)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Recent Insights */}
        {insights.length > 0 && (
          <div>
            <h3 className="text-sm font-medium mb-3">Recent Insights</h3>
            <div className="space-y-3">
              {insights.slice(0, 3).map((insight) => (
                <InsightCard key={insight.id} insight={insight} />
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {recommendations.length === 0 && insights.length === 0 && (
          <div className="text-center py-8">
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Brain className="w-6 h-6 text-gray-400" />
            </div>
            <p className="text-sm text-gray-500 mb-2">
              AI is learning your patterns
            </p>
            <p className="text-xs text-gray-400">
              Recommendations will appear as you work
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

interface RecommendationCardProps {
  recommendation: AIRecommendation
  onExecute: () => void
  onDismiss: () => void
}

function RecommendationCard({ recommendation, onExecute, onDismiss }: RecommendationCardProps) {
  const getRecommendationIcon = (type: AIRecommendation['type']) => {
    switch (type) {
      case 'suggestion':
        return <Lightbulb className="w-4 h-4" />
      case 'automation':
        return <Zap className="w-4 h-4" />
      case 'warning':
        return <AlertTriangle className="w-4 h-4" />
      case 'insight':
        return <Info className="w-4 h-4" />
      default:
        return <Info className="w-4 h-4" />
    }
  }

  return (
    <Card className="p-3">
      <div className="flex items-start space-x-3">
        <div className={`p-1.5 rounded-lg ${getPriorityColor(recommendation.priority)} text-xs`}>
          {getRecommendationIcon(recommendation.type)}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h4 className="text-sm font-medium truncate">
              {recommendation.title}
            </h4>
            <Badge variant="outline" className="text-xs">
              {Math.round(recommendation.confidence * 100)}%
            </Badge>
          </div>
          
          <p className="text-xs text-gray-600 mb-2 line-clamp-2">
            {recommendation.description}
          </p>
          
          {recommendation.actions.length > 0 && (
            <div className="flex items-center space-x-2">
              <Button
                size="sm"
                variant={recommendation.actions[0].primary ? "default" : "outline"}
                onClick={onExecute}
                className="text-xs h-6"
              >
                {recommendation.actions[0].label}
              </Button>
              
              <Button
                size="sm"
                variant="ghost"
                onClick={onDismiss}
                className="text-xs h-6 text-gray-500"
              >
                Dismiss
              </Button>
            </div>
          )}
          
          <div className="flex items-center justify-between mt-2 text-xs text-gray-400">
            <span>
              {formatTimeAgoSafe(recommendation.timestamp)}
            </span>
            {recommendation.actions[0]?.estimatedTimeSaving && (
              <span className="flex items-center">
                <Clock className="w-3 h-3 mr-1" />
                Saves {recommendation.actions[0].estimatedTimeSaving}m
              </span>
            )}
          </div>
        </div>
      </div>
    </Card>
  )
}

interface InsightCardProps {
  insight: AIInsight
}

function InsightCard({ insight }: InsightCardProps) {
  const getInsightIcon = (type: AIInsight['type']) => {
    switch (type) {
      case 'pattern':
        return <TrendingUp className="w-4 h-4" />
      case 'prediction':
        return <Zap className="w-4 h-4" />
      case 'alert':
        return <AlertTriangle className="w-4 h-4" />
      default:
        return <Info className="w-4 h-4" />
    }
  }

  return (
    <Card className="p-3">
      <div className="flex items-start space-x-3">
        <div className={`p-1.5 rounded-lg bg-blue-50 text-blue-600 text-xs`}>
          {getInsightIcon(insight.type)}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h4 className="text-sm font-medium truncate">
              {insight.title}
            </h4>
            <Badge variant="info" className="text-xs">
              {insight.confidence > 0.8 ? 'High' : insight.confidence > 0.6 ? 'Medium' : 'Low'}
            </Badge>
          </div>
          
          <p className="text-xs text-gray-600 line-clamp-2">
            {insight.description}
          </p>
          
          {insight.actionable && insight.actions && insight.actions.length > 0 && (
            <Button
              size="sm"
              variant="outline"
              className="text-xs h-6 mt-2"
            >
              {insight.actions[0].label}
              <ChevronRight className="w-3 h-3 ml-1" />
            </Button>
          )}
        </div>
      </div>
    </Card>
  )
}