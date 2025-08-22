import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Brain,
  Sparkles,
  Zap,
  Lightbulb,
  Target,
  CheckCircle,
  AlertTriangle,
  Clock,
  TrendingUp,
  X,
  ChevronDown,
  ChevronUp,
  Play,
  ThumbsUp,
  ThumbsDown,
} from 'lucide-react';
import { AI_ELEMENTS, getAIScoreColor } from '@/lib/design-system';

// =============================================================================
// TYPES
// =============================================================================

interface AIRecommendation {
  id: string;
  type: 'suggestion' | 'automation' | 'warning' | 'insight' | 'optimization';
  priority: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  confidence: number;
  moduleContext?: string;
  estimatedTimeSaving?: number;
  estimatedImpact?: string;
  actions?: Array<{
    id: string;
    label: string;
    action: string;
    primary?: boolean;
  }>;
  reasoning?: string;
  timestamp?: Date;
}

interface AIMetrics {
  totalRecommendations?: number;
  timeSaved?: number;
  accuracy?: number;
  tasksAutomated?: number;
  efficiency?: number;
}

interface StandardizedAIPanelProps {
  recommendations: AIRecommendation[];
  metrics?: AIMetrics;
  title?: string;
  moduleContext?: string;
  showMetrics?: boolean;
  collapsible?: boolean;
  defaultExpanded?: boolean;
  onExecuteAction?: (actionId: string) => void;
  onDismissRecommendation?: (recommendationId: string) => void;
  onFeedback?: (recommendationId: string, feedback: 'positive' | 'negative') => void;
  className?: string;
}

// =============================================================================
// SUB-COMPONENTS
// =============================================================================

const RecommendationTypeIcon: React.FC<{ type: string }> = ({ type }) => {
  switch (type) {
    case 'suggestion':
      return <Lightbulb className="h-4 w-4 text-blue-600" />;
    case 'automation':
      return <Zap className="h-4 w-4 text-green-600" />;
    case 'warning':
      return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
    case 'insight':
      return <Brain className="h-4 w-4 text-purple-600" />;
    case 'optimization':
      return <Target className="h-4 w-4 text-indigo-600" />;
    default:
      return <Sparkles className="h-4 w-4 text-purple-600" />;
  }
};

const RecommendationCard: React.FC<{
  recommendation: AIRecommendation;
  onExecuteAction?: (actionId: string) => void;
  onDismiss?: (id: string) => void;
  onFeedback?: (id: string, feedback: 'positive' | 'negative') => void;
}> = ({ recommendation, onExecuteAction, onDismiss, onFeedback }) => {
  const [showDetails, setShowDetails] = useState(false);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-50 border-red-200';
      case 'high':
        return 'bg-yellow-50 border-yellow-200';
      case 'medium':
        return 'bg-blue-50 border-blue-200';
      case 'low':
        return 'bg-gray-50 border-gray-200';
      default:
        return 'bg-purple-50 border-purple-200';
    }
  };

  const getPriorityBadge = (priority: string) => {
    const colors = {
      critical: 'bg-red-100 text-red-800 border-red-300',
      high: 'bg-orange-100 text-orange-800 border-orange-300',
      medium: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      low: 'bg-green-100 text-green-800 border-green-300',
    };
    return colors[priority as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-300';
  };

  return (
    <div className={`p-4 rounded-lg border ${getPriorityColor(recommendation.priority)}`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <RecommendationTypeIcon type={recommendation.type} />
            <h4 className="font-semibold text-gray-900">{recommendation.title}</h4>
            <Badge className={`text-xs border ${getPriorityBadge(recommendation.priority)}`}>
              {recommendation.priority.toUpperCase()}
            </Badge>
          </div>
          <p className="text-sm text-gray-700 mb-2">{recommendation.description}</p>
          
          {/* Metadata */}
          <div className="flex items-center space-x-4 text-xs text-gray-500">
            <div className="flex items-center space-x-1">
              <Target className="h-3 w-3" />
              <span>Confidence: {Math.round(recommendation.confidence * 100)}%</span>
            </div>
            {recommendation.estimatedTimeSaving && (
              <div className="flex items-center space-x-1">
                <Clock className="h-3 w-3" />
                <span>Saves ~{recommendation.estimatedTimeSaving}h</span>
              </div>
            )}
            {recommendation.estimatedImpact && (
              <div className="flex items-center space-x-1">
                <TrendingUp className="h-3 w-3" />
                <span>{recommendation.estimatedImpact}</span>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2 ml-4">
          {recommendation.actions && recommendation.actions.length > 0 && (
            <div className="flex space-x-1">
              {recommendation.actions.slice(0, 2).map((action, index) => (
                <Button
                  key={index}
                  size="sm"
                  variant={action.primary ? "default" : "outline"}
                  onClick={() => onExecuteAction?.(action.action)}
                  className="text-xs"
                >
                  <Play className="h-3 w-3 mr-1" />
                  {action.label}
                </Button>
              ))}
            </div>
          )}
          
          {onDismiss && (
            <Button 
              size="sm" 
              variant="ghost" 
              onClick={() => onDismiss(recommendation.id)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Expandable Details */}
      {recommendation.reasoning && (
        <div className="border-t border-gray-200 pt-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowDetails(!showDetails)}
            className="flex items-center space-x-1 text-xs text-gray-600 hover:text-gray-900 p-0"
          >
            <span>View reasoning</span>
            {showDetails ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
          </Button>
          
          {showDetails && (
            <div className="mt-2 p-3 bg-white/50 rounded border">
              <p className="text-xs text-gray-600 mb-3">{recommendation.reasoning}</p>
              
              {onFeedback && (
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-500">Was this helpful?</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onFeedback(recommendation.id, 'positive')}
                    className="text-green-600 hover:text-green-700 p-1"
                  >
                    <ThumbsUp className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onFeedback(recommendation.id, 'negative')}
                    className="text-red-600 hover:text-red-700 p-1"
                  >
                    <ThumbsDown className="h-3 w-3" />
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const AIMetricsSection: React.FC<{ metrics: AIMetrics }> = ({ metrics }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
    {metrics.timeSaved !== undefined && (
      <div className="bg-white/70 p-3 rounded border text-center">
        <Clock className="h-5 w-5 text-green-600 mx-auto mb-1" />
        <p className="text-xs font-medium text-gray-600">Time Saved</p>
        <p className="text-lg font-bold text-green-900">{metrics.timeSaved}h</p>
      </div>
    )}
    
    {metrics.accuracy !== undefined && (
      <div className="bg-white/70 p-3 rounded border text-center">
        <Target className="h-5 w-5 text-blue-600 mx-auto mb-1" />
        <p className="text-xs font-medium text-gray-600">Accuracy</p>
        <p className="text-lg font-bold text-blue-900">{metrics.accuracy}%</p>
      </div>
    )}
    
    {metrics.tasksAutomated !== undefined && (
      <div className="bg-white/70 p-3 rounded border text-center">
        <Zap className="h-5 w-5 text-purple-600 mx-auto mb-1" />
        <p className="text-xs font-medium text-gray-600">Automated</p>
        <p className="text-lg font-bold text-purple-900">{metrics.tasksAutomated}</p>
      </div>
    )}
    
    {metrics.efficiency !== undefined && (
      <div className="bg-white/70 p-3 rounded border text-center">
        <TrendingUp className="h-5 w-5 text-emerald-600 mx-auto mb-1" />
        <p className="text-xs font-medium text-gray-600">Efficiency</p>
        <p className="text-lg font-bold text-emerald-900">+{metrics.efficiency}%</p>
      </div>
    )}
  </div>
);

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export const StandardizedAIPanel: React.FC<StandardizedAIPanelProps> = ({
  recommendations,
  metrics,
  title = "AI Assistant Insights",
  moduleContext,
  showMetrics = true,
  collapsible = false,
  defaultExpanded = true,
  onExecuteAction,
  onDismissRecommendation,
  onFeedback,
  className = "",
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [dismissedRecommendations, setDismissedRecommendations] = useState<Set<string>>(new Set());

  const activeRecommendations = recommendations.filter(r => !dismissedRecommendations.has(r.id));

  const handleDismiss = (recommendationId: string) => {
    setDismissedRecommendations(prev => new Set([...prev, recommendationId]));
    onDismissRecommendation?.(recommendationId);
  };

  if (activeRecommendations.length === 0 && !metrics) {
    return null;
  }

  return (
    <Card className={`border-2 border-purple-200 bg-gradient-to-r from-purple-50 to-blue-50 ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Brain className="h-5 w-5 text-purple-600" />
            <CardTitle className="text-purple-900">{title}</CardTitle>
            {moduleContext && (
              <Badge variant="outline" className="text-xs text-purple-700 border-purple-300">
                {moduleContext}
              </Badge>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            {activeRecommendations.length > 0 && (
              <Badge className="bg-purple-100 text-purple-800 border-purple-300">
                {activeRecommendations.length} insight{activeRecommendations.length !== 1 ? 's' : ''}
              </Badge>
            )}
            
            {collapsible && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-purple-600 hover:text-purple-700"
              >
                {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
            )}
          </div>
        </div>
        
        {activeRecommendations.length > 0 && (
          <p className="text-purple-700 text-sm">
            Your AI assistant has identified {activeRecommendations.length} opportunity{activeRecommendations.length !== 1 ? 'ies' : 'y'} for optimization
            {moduleContext && ` in ${moduleContext.toLowerCase()}`}
          </p>
        )}
      </CardHeader>

      {(!collapsible || isExpanded) && (
        <CardContent>
          {/* AI Performance Metrics */}
          {showMetrics && metrics && <AIMetricsSection metrics={metrics} />}
          
          {/* Recommendations */}
          {activeRecommendations.length > 0 && (
            <div className="space-y-4">
              {activeRecommendations.map((recommendation) => (
                <RecommendationCard
                  key={recommendation.id}
                  recommendation={recommendation}
                  onExecuteAction={onExecuteAction}
                  onDismiss={handleDismiss}
                  onFeedback={onFeedback}
                />
              ))}
            </div>
          )}
          
          {/* Empty state */}
          {activeRecommendations.length === 0 && (
            <div className="text-center py-8">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-2" />
              <h3 className="text-lg font-semibold text-gray-900 mb-1">All caught up!</h3>
              <p className="text-gray-600">Your AI assistant has no new recommendations at this time.</p>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
};

// =============================================================================
// SPECIALIZED AI PANELS
// =============================================================================

export const QuickAIInsights: React.FC<{
  insights: string[];
  className?: string;
}> = ({ insights, className }) => (
  <div className={`bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4 ${className}`}>
    <div className="flex items-center space-x-2 mb-3">
      <Sparkles className="h-4 w-4 text-purple-600" />
      <h4 className="font-semibold text-purple-900">Quick AI Insights</h4>
    </div>
    <div className="space-y-2">
      {insights.map((insight, index) => (
        <div key={index} className="flex items-start space-x-2">
          <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0" />
          <p className="text-sm text-purple-800">{insight}</p>
        </div>
      ))}
    </div>
  </div>
);

export const AIProcessingStatus: React.FC<{
  status: 'processing' | 'complete' | 'error';
  progress?: number;
  itemsProcessed?: number;
  totalItems?: number;
  estimatedTimeRemaining?: string;
  className?: string;
}> = ({ status, progress, itemsProcessed, totalItems, estimatedTimeRemaining, className }) => (
  <div className={`bg-white border border-purple-200 rounded-lg p-4 ${className}`}>
    <div className="flex items-center space-x-2 mb-3">
      <Brain className="h-4 w-4 text-purple-600" />
      <h4 className="font-semibold text-gray-900">AI Processing Status</h4>
    </div>
    
    {status === 'processing' && (
      <div className="space-y-3">
        {progress !== undefined && (
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm text-gray-600">Analysis Progress</span>
              <span className="text-sm font-semibold">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}
        
        <div className="flex justify-between text-xs text-gray-500">
          {itemsProcessed !== undefined && totalItems !== undefined && (
            <span>{itemsProcessed} of {totalItems} items processed</span>
          )}
          {estimatedTimeRemaining && (
            <span>~{estimatedTimeRemaining} remaining</span>
          )}
        </div>
      </div>
    )}
    
    {status === 'complete' && (
      <div className="flex items-center space-x-2 text-green-700">
        <CheckCircle className="h-4 w-4" />
        <span className="text-sm font-medium">AI analysis complete</span>
      </div>
    )}
    
    {status === 'error' && (
      <div className="flex items-center space-x-2 text-red-700">
        <AlertTriangle className="h-4 w-4" />
        <span className="text-sm font-medium">AI analysis encountered an error</span>
      </div>
    )}
  </div>
);

export default StandardizedAIPanel;