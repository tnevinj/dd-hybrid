'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Bot,
  Lightbulb,
  Zap,
  CheckCircle,
  AlertTriangle,
  Clock,
  Target,
  Sparkles,
  Play,
  XCircle,
  ThumbsUp,
  ThumbsDown,
  TrendingUp,
  Info,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { AIRecommendation } from '@/lib/ai-state-manager';

interface AIRecommendationPanelProps {
  recommendations: AIRecommendation[];
  moduleContext: string;
  onAcceptRecommendation: (recommendation: AIRecommendation) => void;
  onDismissRecommendation: (recommendationId: string) => void;
  onFeedback?: (recommendationId: string, feedback: 'helpful' | 'not_helpful' | 'harmful') => void;
  isVisible?: boolean;
  onToggleVisibility?: () => void;
  className?: string;
  title?: string;
  subtitle?: string;
  maxRecommendations?: number;
  showAutomationSection?: boolean;
  showInsights?: boolean;
  compactMode?: boolean;
}

const AIRecommendationPanel: React.FC<AIRecommendationPanelProps> = ({
  recommendations,
  moduleContext,
  onAcceptRecommendation,
  onDismissRecommendation,
  onFeedback,
  isVisible = true,
  onToggleVisibility,
  className = '',
  title = 'AI Assistant Active',
  subtitle,
  maxRecommendations = 2,
  showAutomationSection = true,
  showInsights = true,
  compactMode = false
}) => {
  const [expandedRecommendations, setExpandedRecommendations] = React.useState<Set<string>>(new Set());

  // Filter and sort recommendations
  const activeRecommendations = recommendations
    .filter(rec => rec.moduleContext === moduleContext)
    .sort((a, b) => {
      // Sort by priority first
      const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
      const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
      if (priorityDiff !== 0) return priorityDiff;
      
      // Then by confidence
      return b.confidence - a.confidence;
    });

  const automationRecommendations = activeRecommendations.filter(rec => rec.type === 'automation');
  const otherRecommendations = activeRecommendations.filter(rec => rec.type !== 'automation');

  const toggleExpanded = (recommendationId: string) => {
    setExpandedRecommendations(prev => {
      const newSet = new Set(prev);
      if (newSet.has(recommendationId)) {
        newSet.delete(recommendationId);
      } else {
        newSet.add(recommendationId);
      }
      return newSet;
    });
  };

  const handleAcceptRecommendation = (recommendation: AIRecommendation) => {
    onAcceptRecommendation(recommendation);
    if (onFeedback) {
      onFeedback(recommendation.id, 'helpful');
    }
  };

  const getTypeIcon = (type: AIRecommendation['type']) => {
    switch (type) {
      case 'automation': return Zap;
      case 'optimization': return Target;
      case 'risk': return AlertTriangle;
      case 'compliance': return CheckCircle;
      case 'insight': return Lightbulb;
      case 'workflow': return Clock;
      default: return Info;
    }
  };

  const getTypeColor = (type: AIRecommendation['type']) => {
    switch (type) {
      case 'automation': return 'text-purple-600';
      case 'optimization': return 'text-green-600';
      case 'risk': return 'text-red-600';
      case 'compliance': return 'text-blue-600';
      case 'insight': return 'text-amber-600';
      case 'workflow': return 'text-indigo-600';
      default: return 'text-gray-600';
    }
  };

  const getPriorityVariant = (priority: AIRecommendation['priority']) => {
    switch (priority) {
      case 'critical': return 'destructive' as const;
      case 'high': return 'destructive' as const;
      case 'medium': return 'default' as const;
      case 'low': return 'secondary' as const;
    }
  };

  if (!isVisible) {
    return (
      <Button 
        onClick={onToggleVisibility}
        className="w-full bg-purple-600 hover:bg-purple-700"
      >
        <Bot className="h-4 w-4 mr-2" />
        Show AI Assistant ({activeRecommendations.length} recommendations available)
      </Button>
    );
  }

  return (
    <Card className={`border-purple-200 bg-purple-50/50 ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-purple-600" />
            <CardTitle className="text-purple-900">{title}</CardTitle>
          </div>
          {onToggleVisibility && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onToggleVisibility}
              className="text-purple-600 hover:text-purple-700"
            >
              Hide AI Panel
            </Button>
          )}
        </div>
        {subtitle && (
          <p className="text-purple-700 text-sm">{subtitle}</p>
        )}
        {!subtitle && (
          <p className="text-purple-700 text-sm">
            Your AI assistant has identified {activeRecommendations.length} opportunities to improve operations
          </p>
        )}
      </CardHeader>
      <CardContent>
        <div className={compactMode ? 'space-y-4' : 'grid grid-cols-1 lg:grid-cols-2 gap-4'}>
          {/* Main Recommendations */}
          <div className={compactMode ? '' : 'space-y-2'}>
            <h4 className="font-semibold text-purple-900 mb-3 flex items-center gap-2">
              <Lightbulb className="h-4 w-4" />
              Smart Recommendations ({otherRecommendations.length})
            </h4>
            <div className="space-y-2">
              {otherRecommendations.slice(0, maxRecommendations).map((recommendation) => {
                const TypeIcon = getTypeIcon(recommendation.type);
                const isExpanded = expandedRecommendations.has(recommendation.id);
                
                return (
                  <div key={recommendation.id} className="bg-white p-3 rounded-lg border">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <TypeIcon className={`h-4 w-4 ${getTypeColor(recommendation.type)}`} />
                          <p className="font-medium text-sm">{recommendation.title}</p>
                          <Badge 
                            variant={getPriorityVariant(recommendation.priority)}
                            className="text-xs"
                          >
                            {recommendation.priority.toUpperCase()}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-600">
                          {isExpanded ? recommendation.description : 
                           recommendation.description.length > 100 
                             ? `${recommendation.description.substring(0, 100)}...`
                             : recommendation.description
                          }
                        </p>
                        {recommendation.description.length > 100 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleExpanded(recommendation.id)}
                            className="h-6 p-1 text-xs text-purple-600 hover:text-purple-700"
                          >
                            {isExpanded ? (
                              <>
                                <ChevronUp className="h-3 w-3 mr-1" />
                                Show less
                              </>
                            ) : (
                              <>
                                <ChevronDown className="h-3 w-3 mr-1" />
                                Show more
                              </>
                            )}
                          </Button>
                        )}
                        {isExpanded && (
                          <div className="mt-2 space-y-1">
                            {recommendation.estimatedImpact && (
                              <p className="text-xs text-blue-600">
                                <Target className="h-3 w-3 inline mr-1" />
                                Impact: {recommendation.estimatedImpact}
                              </p>
                            )}
                            {recommendation.estimatedTimeSaving && (
                              <p className="text-xs text-green-600">
                                <Clock className="h-3 w-3 inline mr-1" />
                                Saves: {recommendation.estimatedTimeSaving} hours
                              </p>
                            )}
                            {recommendation.riskLevel && (
                              <p className="text-xs text-amber-600">
                                <AlertTriangle className="h-3 w-3 inline mr-1" />
                                Risk: {recommendation.riskLevel}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        {Math.round(recommendation.confidence * 100)}% confident
                      </span>
                      <div className="flex gap-1">
                        <Button 
                          size="sm" 
                          className="h-7 text-xs"
                          onClick={() => handleAcceptRecommendation(recommendation)}
                        >
                          <Play className="h-3 w-3 mr-1" />
                          Apply
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="h-7 text-xs"
                          onClick={() => onDismissRecommendation(recommendation.id)}
                        >
                          <XCircle className="h-3 w-3" />
                        </Button>
                        {onFeedback && !compactMode && (
                          <>
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="h-7 text-xs"
                              onClick={() => onFeedback(recommendation.id, 'helpful')}
                            >
                              <ThumbsUp className="h-3 w-3" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="h-7 text-xs"
                              onClick={() => onFeedback(recommendation.id, 'not_helpful')}
                            >
                              <ThumbsDown className="h-3 w-3" />
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
              
              {otherRecommendations.length > maxRecommendations && (
                <div className="text-center">
                  <Button variant="ghost" size="sm" className="text-purple-600">
                    Show {otherRecommendations.length - maxRecommendations} more recommendations
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Automation Opportunities */}
          {showAutomationSection && automationRecommendations.length > 0 && (
            <div className={compactMode ? 'mt-4' : ''}>
              <h4 className="font-semibold text-purple-900 mb-3 flex items-center gap-2">
                <Zap className="h-4 w-4" />
                Automation Available ({automationRecommendations.length})
              </h4>
              <div className="space-y-2">
                {automationRecommendations.slice(0, 2).map((automation) => (
                  <div key={automation.id} className="bg-white p-3 rounded-lg border">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <p className="font-medium text-sm">{automation.title}</p>
                        <div className="flex items-center gap-3 mt-1 text-xs text-gray-600">
                          {automation.estimatedTimeSaving && (
                            <span>Saves: {automation.estimatedTimeSaving} hours</span>
                          )}
                          {automation.estimatedImpact && (
                            <span>Impact: {automation.estimatedImpact}</span>
                          )}
                          <span>Risk: {automation.riskLevel || 'low'}</span>
                        </div>
                      </div>
                    </div>
                    <Button 
                      size="sm" 
                      className="h-7 text-xs w-full"
                      onClick={() => handleAcceptRecommendation(automation)}
                    >
                      <Sparkles className="h-3 w-3 mr-1" />
                      Enable Automation
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Quick AI Insights */}
        {showInsights && !compactMode && (
          <div className="mt-4 pt-4 border-t border-purple-200">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="bg-white p-3 rounded-lg border text-center">
                <TrendingUp className="h-6 w-6 text-green-600 mx-auto mb-1" />
                <p className="text-xs font-medium">Performance Trend</p>
                <p className="text-xs text-gray-600">+12% this month</p>
              </div>
              <div className="bg-white p-3 rounded-lg border text-center">
                <Clock className="h-6 w-6 text-blue-600 mx-auto mb-1" />
                <p className="text-xs font-medium">Time Saved</p>
                <p className="text-xs text-gray-600">
                  {recommendations.reduce((sum, r) => sum + (r.estimatedTimeSaving || 0), 0)} hours
                </p>
              </div>
              <div className="bg-white p-3 rounded-lg border text-center">
                <Target className="h-6 w-6 text-purple-600 mx-auto mb-1" />
                <p className="text-xs font-medium">Accuracy Rate</p>
                <p className="text-xs text-gray-600">
                  {Math.round(recommendations.reduce((sum, r) => sum + r.confidence, 0) / recommendations.length * 100) || 0}%
                </p>
              </div>
              <div className="bg-white p-3 rounded-lg border text-center">
                <CheckCircle className="h-6 w-6 text-emerald-600 mx-auto mb-1" />
                <p className="text-xs font-medium">Auto Actions</p>
                <p className="text-xs text-gray-600">
                  {automationRecommendations.length} available
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AIRecommendationPanel;