'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Brain, 
  TrendingUp, 
  AlertCircle, 
  Target,
  BarChart3,
  Lightbulb,
  Zap
} from 'lucide-react';
import { AIInsight } from '@/types/navigation';

interface AIInsightsPanelProps {
  insights: AIInsight[];
  onExecuteAction?: (actionId: string, params?: any) => void;
  moduleContext?: string;
  className?: string;
  title?: string;
  maxInsights?: number;
}

const getTypeIcon = (type: AIInsight['type']) => {
  switch (type) {
    case 'pattern': return <BarChart3 className="h-4 w-4" />;
    case 'prediction': return <TrendingUp className="h-4 w-4" />;
    case 'recommendation': return <Lightbulb className="h-4 w-4" />;
    case 'alert': return <AlertCircle className="h-4 w-4" />;
    default: return <Brain className="h-4 w-4" />;
  }
};

const getImpactColor = (impact: AIInsight['impact']): string => {
  switch (impact) {
    case 'high': return 'bg-red-100 text-red-800 border-red-200';
    case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'low': return 'bg-green-100 text-green-800 border-green-200';
    default: return 'bg-blue-100 text-blue-800 border-blue-200';
  }
};

const getTypeColor = (type: AIInsight['type']): string => {
  switch (type) {
    case 'alert': return 'text-red-600 bg-red-50 border-red-200';
    case 'prediction': return 'text-blue-600 bg-blue-50 border-blue-200';
    case 'pattern': return 'text-purple-600 bg-purple-50 border-purple-200';
    case 'recommendation': return 'text-green-600 bg-green-50 border-green-200';
    default: return 'text-gray-600 bg-gray-50 border-gray-200';
  }
};

export function AIInsightsPanel({
  insights,
  onExecuteAction,
  moduleContext,
  className = '',
  title = 'AI Insights',
  maxInsights = 10
}: AIInsightsPanelProps) {
  // Filter insights by module if specified
  const filteredInsights = moduleContext
    ? insights.filter(insight => insight.module === moduleContext)
    : insights;

  // Sort by confidence and impact
  const sortedInsights = [...filteredInsights]
    .sort((a, b) => {
      const impactOrder = { high: 3, medium: 2, low: 1 };
      const impactDiff = impactOrder[b.impact] - impactOrder[a.impact];
      if (impactDiff !== 0) return impactDiff;
      return b.confidence - a.confidence;
    })
    .slice(0, maxInsights);

  if (sortedInsights.length === 0) {
    return (
      <Card className={`border-dashed border-gray-200 ${className}`}>
        <CardContent className="p-6 text-center">
          <Brain className="h-8 w-8 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-500">No insights available</p>
          <p className="text-sm text-gray-400 mt-1">AI is analyzing your data</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`${className}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Brain className="h-5 w-5 text-purple-600" />
            <CardTitle className="text-purple-900">{title}</CardTitle>
            <Badge variant="outline" className="text-xs">
              {sortedInsights.length}
            </Badge>
          </div>
          {moduleContext && (
            <Badge variant="secondary" className="text-xs">
              {moduleContext}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {sortedInsights.map((insight) => (
          <div
            key={insight.id}
            className={`p-3 rounded-lg border ${getTypeColor(insight.type)}`}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center space-x-2">
                {getTypeIcon(insight.type)}
                <h4 className="font-medium text-sm">{insight.title}</h4>
                <Badge 
                  variant="outline" 
                  className={`text-xs ${getImpactColor(insight.impact)}`}
                >
                  {insight.impact} impact
                </Badge>
              </div>
              <Badge variant="outline" className="text-xs">
                {insight.type}
              </Badge>
            </div>
            
            <p className="text-sm text-gray-700 mb-2">{insight.description}</p>
            
            {insight.actionable && insight.actions && insight.actions.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2">
                {insight.actions.map((action, index) => (
                  <Button
                    key={index}
                    size="sm"
                    variant="outline"
                    onClick={() => onExecuteAction?.(action.action, action.params)}
                    className="text-xs h-6"
                  >
                    <Zap className="h-3 w-3 mr-1" />
                    {action.label}
                  </Button>
                ))}
              </div>
            )}
            
            <div className="flex justify-between items-center text-xs text-gray-500">
              <div className="flex items-center space-x-2">
                <Target className="h-3 w-3" />
                <span>Confidence: {Math.round(insight.confidence * 100)}%</span>
              </div>
              {insight.actionable && (
                <Badge variant="secondary" className="text-xs">
                  Actionable
                </Badge>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}