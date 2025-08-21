'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Sparkles, 
  X, 
  Clock, 
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Lightbulb,
  Zap 
} from 'lucide-react';
import { AIRecommendation } from '@/types/navigation';

interface AIRecommendationPanelProps {
  recommendations: AIRecommendation[];
  onExecuteAction: (actionId: string, params?: any) => void;
  onDismissRecommendation: (recommendationId: string) => void;
  moduleContext?: string;
  className?: string;
  title?: string;
  showModuleFilter?: boolean;
}

const getPriorityColor = (priority: AIRecommendation['priority']): string => {
  switch (priority) {
    case 'critical': return 'bg-red-50 border-red-200 text-red-900';
    case 'high': return 'bg-yellow-50 border-yellow-200 text-yellow-900';
    case 'medium': return 'bg-blue-50 border-blue-200 text-blue-900';
    case 'low': return 'bg-gray-50 border-gray-200 text-gray-900';
    default: return 'bg-blue-50 border-blue-200 text-blue-900';
  }
};

const getTypeIcon = (type: AIRecommendation['type']) => {
  switch (type) {
    case 'suggestion': return <Lightbulb className="h-4 w-4" />;
    case 'automation': return <Zap className="h-4 w-4" />;
    case 'insight': return <TrendingUp className="h-4 w-4" />;
    case 'warning': return <AlertTriangle className="h-4 w-4" />;
    default: return <Sparkles className="h-4 w-4" />;
  }
};

const formatTimeSaving = (minutes?: number): string => {
  if (!minutes) return '';
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
};

export function AIRecommendationPanel({
  recommendations,
  onExecuteAction,
  onDismissRecommendation,
  moduleContext,
  className = '',
  title = 'AI Assistant Recommendations',
  showModuleFilter = false
}: AIRecommendationPanelProps) {
  // Filter recommendations by module if specified
  const filteredRecommendations = moduleContext
    ? recommendations.filter(rec => 
        rec.moduleContext === moduleContext || !rec.moduleContext
      )
    : recommendations;

  // Sort by priority and confidence
  const sortedRecommendations = [...filteredRecommendations].sort((a, b) => {
    const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
    const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
    if (priorityDiff !== 0) return priorityDiff;
    return b.confidence - a.confidence;
  });

  if (sortedRecommendations.length === 0) {
    return (
      <Card className={`border-2 border-dashed border-gray-200 ${className}`}>
        <CardContent className="p-6 text-center">
          <Sparkles className="h-8 w-8 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-500">No AI recommendations at this time</p>
          <p className="text-sm text-gray-400 mt-1">Check back soon for intelligent suggestions</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`border-2 border-blue-200 ${className}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles className="h-5 w-5 text-blue-600" />
            <CardTitle className="text-blue-900">{title}</CardTitle>
            <Badge variant="outline" className="text-xs">
              {sortedRecommendations.length}
            </Badge>
          </div>
          {showModuleFilter && moduleContext && (
            <Badge variant="secondary" className="text-xs">
              {moduleContext}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {sortedRecommendations.map((recommendation) => (
          <div
            key={recommendation.id}
            className={`p-4 rounded-lg border ${getPriorityColor(recommendation.priority)}`}
          >
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center space-x-2">
                {getTypeIcon(recommendation.type)}
                <h4 className="font-semibold">{recommendation.title}</h4>
                <Badge 
                  variant="outline" 
                  className={`text-xs ${
                    recommendation.priority === 'critical' ? 'border-red-300 text-red-700' :
                    recommendation.priority === 'high' ? 'border-yellow-300 text-yellow-700' :
                    'border-blue-300 text-blue-700'
                  }`}
                >
                  {recommendation.priority}
                </Badge>
              </div>
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={() => onDismissRecommendation(recommendation.id)}
                className="h-6 w-6 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <p className="text-sm mb-3">{recommendation.description}</p>
            
            {recommendation.actions && recommendation.actions.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2">
                {recommendation.actions.map((action, index) => (
                  <Button
                    key={index}
                    size="sm"
                    variant={action.primary ? "default" : "outline"}
                    onClick={() => onExecuteAction(action.action, action.params)}
                    className="text-xs"
                  >
                    {action.label}
                    {action.estimatedTimeSaving && (
                      <span className="ml-1 text-xs opacity-75">
                        ({formatTimeSaving(action.estimatedTimeSaving)})
                      </span>
                    )}
                  </Button>
                ))}
              </div>
            )}
            
            <div className="flex justify-between items-center text-xs opacity-75">
              <div className="flex items-center space-x-3">
                <span>Confidence: {Math.round(recommendation.confidence * 100)}%</span>
                {recommendation.moduleContext && (
                  <span>Module: {recommendation.moduleContext}</span>
                )}
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="h-3 w-3" />
                <span>{new Date(recommendation.timestamp).toLocaleTimeString()}</span>
              </div>
            </div>
            
            {recommendation.reasoning && (
              <details className="mt-2">
                <summary className="text-xs text-gray-600 cursor-pointer hover:text-gray-800">
                  View reasoning
                </summary>
                <p className="text-xs text-gray-600 mt-1 pl-2 border-l-2 border-gray-200">
                  {recommendation.reasoning}
                </p>
              </details>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}