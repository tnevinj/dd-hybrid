'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Bot,
  Lightbulb,
  Zap,
  TrendingUp,
  Target,
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
  BarChart3,
  Play,
  ThumbsUp,
  ThumbsDown,
  Sparkles,
  ArrowRight,
  MessageSquare,
  FileText,
  Calendar
} from 'lucide-react';
import { LPPortalTraditional } from './LPPortalTraditional';
import { formatCurrency, formatPercentage, formatDate } from '@/lib/utils';
import type { 
  LPDashboardData,
  AIRecommendation,
  AutomationSuggestion,
  PerformanceInsight
} from '@/types/lp-portal';

interface LPPortalAssistedProps {
  data: LPDashboardData;
  onRespond: (type: string, id: string) => void;
  onViewDetails: (type: string, id: string) => void;
  onAcceptRecommendation: (recommendation: AIRecommendation) => void;
}

export function LPPortalAssisted({ 
  data, 
  onRespond, 
  onViewDetails, 
  onAcceptRecommendation 
}: LPPortalAssistedProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [showAIPanel, setShowAIPanel] = useState(true);
  const [dismissedRecommendations, setDismissedRecommendations] = useState<Set<string>>(new Set());

  // Mock AI data - in real app this would come from AI service
  const aiEnhancements = useMemo(() => ({
    recommendations: [
      {
        id: 'rec_1',
        type: 'RESPONSE' as const,
        title: 'Respond to Growth Equity Fund III Capital Call',
        description: 'AI analyzed this call and found it aligns with typical deployment patterns. The fund has strong performance (18.5% IRR) and this appears to be a follow-on investment in existing portfolio companies.',
        priority: 'HIGH' as const,
        confidence: 0.87,
        actionable: true,
        estimatedImpact: 'Maintains fund position, avoid potential penalties'
      },
      {
        id: 'rec_2',
        type: 'INVESTMENT' as const,
        title: 'Consider Healthcare AI Co-Investment',
        description: 'Based on your portfolio allocation and past investment preferences, this co-investment opportunity aligns well with your healthcare exposure strategy. AI analysis shows strong market positioning.',
        priority: 'MEDIUM' as const,
        confidence: 0.74,
        actionable: true,
        estimatedImpact: 'Potential 12-18% IRR based on similar deals'
      },
      {
        id: 'rec_3',
        type: 'OPTIMIZATION' as const,
        title: 'Optimize Tax Planning for Q1 Distributions',
        description: 'AI detected upcoming distributions that may benefit from tax loss harvesting strategies. Consider discussing with your tax advisor before year-end.',
        priority: 'MEDIUM' as const,
        confidence: 0.68,
        actionable: false,
        estimatedImpact: 'Potential 5-8% tax savings on distributions'
      },
      {
        id: 'rec_4',
        type: 'RISK' as const,
        title: 'Monitor Technology Fund IV Performance',
        description: 'AI analysis indicates underperformance vs. benchmarks and peer funds. Consider requesting additional reporting or fund manager call.',
        priority: 'LOW' as const,
        confidence: 0.61,
        actionable: true,
        estimatedImpact: 'Early intervention may improve outcomes'
      }
    ],
    
    automationSuggestions: [
      {
        id: 'auto_1',
        task: 'Auto-acknowledge standard capital calls',
        frequency: 'As needed',
        timeSaving: 15,
        effort: 'LOW' as const,
        enabled: false
      },
      {
        id: 'auto_2',
        task: 'Generate quarterly performance summaries',
        frequency: 'Quarterly',
        timeSaving: 45,
        effort: 'MEDIUM' as const,
        enabled: false
      },
      {
        id: 'auto_3',
        task: 'Track document reading status',
        frequency: 'Ongoing',
        timeSaving: 10,
        effort: 'LOW' as const,
        enabled: true
      },
      {
        id: 'auto_4',
        task: 'Reminder notifications for deadlines',
        frequency: 'As needed',
        timeSaving: 5,
        effort: 'LOW' as const,
        enabled: true
      }
    ],
    
    performanceInsights: [
      {
        type: 'POSITIVE' as const,
        metric: 'Portfolio IRR',
        value: 15.8,
        comparison: '3.2% above industry average',
        trend: 'UP' as const,
        explanation: 'Your portfolio is outperforming due to strong growth equity positions and early-stage tech investments'
      },
      {
        type: 'NEUTRAL' as const,
        metric: 'Capital Deployment Rate',
        value: 48,
        comparison: 'In line with typical fund lifecycle',
        trend: 'STABLE' as const,
        explanation: 'Your funds are calling capital at expected rates for their vintage years'
      },
      {
        type: 'NEGATIVE' as const,
        metric: 'Technology Fund IV Performance',
        value: 12.3,
        comparison: '4.7% below peer median',
        trend: 'DOWN' as const,
        explanation: 'Recent market corrections have impacted tech valuations, but fundamentals remain strong'
      }
    ],
    
    trendingTopics: [
      'ESG Impact Measurement',
      'Secondary Market Opportunities',
      'Healthcare Technology Investments',
      'Interest Rate Impact Analysis',
      'Co-Investment Due Diligence Best Practices'
    ]
  }), []);

  const handleAcceptRecommendation = (recommendation: AIRecommendation) => {
    onAcceptRecommendation(recommendation);
    setDismissedRecommendations(prev => new Set([...prev, recommendation.id]));
  };

  const handleDismissRecommendation = (recommendationId: string) => {
    setDismissedRecommendations(prev => new Set([...prev, recommendationId]));
  };

  const activeRecommendations = aiEnhancements.recommendations.filter(r => !dismissedRecommendations.has(r.id));

  const getInsightColor = (type: string) => {
    const colors = {
      'POSITIVE': 'text-green-600 bg-green-50 border-green-200',
      'NEGATIVE': 'text-red-600 bg-red-50 border-red-200',
      'NEUTRAL': 'text-blue-600 bg-blue-50 border-blue-200'
    };
    return colors[type as keyof typeof colors] || colors.NEUTRAL;
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'UP':
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'DOWN':
        return <TrendingUp className="h-4 w-4 text-red-600 rotate-180" />;
      default:
        return <div className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* AI Assistance Panel */}
      {showAIPanel && (
        <Card className="border-purple-200 bg-purple-50/50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bot className="h-5 w-5 text-purple-600" />
                <CardTitle className="text-purple-900">AI Portfolio Assistant</CardTitle>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowAIPanel(false)}
                className="text-purple-600 hover:text-purple-700"
              >
                Hide AI Panel
              </Button>
            </div>
            <CardDescription className="text-purple-700">
              {activeRecommendations.length} recommendations • {aiEnhancements.automationSuggestions.filter(s => s.enabled).length} automations active • Portfolio analysis complete
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* AI Recommendations */}
              <div>
                <h4 className="font-semibold text-purple-900 mb-3 flex items-center gap-2">
                  <Lightbulb className="h-4 w-4" />
                  Smart Recommendations ({activeRecommendations.length})
                </h4>
                <div className="space-y-2">
                  {activeRecommendations.slice(0, 2).map((rec) => (
                    <div key={rec.id} className="bg-white p-3 rounded-lg border">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <p className="font-medium text-sm">{rec.title}</p>
                          <p className="text-xs text-gray-600 mt-1">{rec.description}</p>
                          {rec.estimatedImpact && (
                            <p className="text-xs text-blue-600 mt-1">💡 {rec.estimatedImpact}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-1 ml-2">
                          <Badge 
                            variant={rec.priority === 'HIGH' ? 'destructive' : rec.priority === 'MEDIUM' ? 'default' : 'secondary'}
                            className="text-xs"
                          >
                            {rec.priority}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">
                          {Math.round(rec.confidence * 100)}% confidence
                        </span>
                        <div className="flex gap-1">
                          <Button 
                            size="sm" 
                            className="h-7 text-xs"
                            onClick={() => handleAcceptRecommendation(rec)}
                            disabled={!rec.actionable}
                          >
                            <Play className="h-3 w-3 mr-1" />
                            {rec.actionable ? 'Accept' : 'Learn More'}
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="h-7 text-xs"
                            onClick={() => handleDismissRecommendation(rec.id)}
                          >
                            <ThumbsDown className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Performance Insights */}
              <div>
                <h4 className="font-semibold text-purple-900 mb-3 flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Performance Insights
                </h4>
                <div className="space-y-2">
                  {aiEnhancements.performanceInsights.slice(0, 2).map((insight, index) => (
                    <div key={index} className={`p-3 rounded-lg border ${getInsightColor(insight.type)}`}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-sm">{insight.metric}</span>
                        <div className="flex items-center gap-1">
                          {getTrendIcon(insight.trend)}
                          <span className="text-sm font-medium">{insight.value}%</span>
                        </div>
                      </div>
                      <p className="text-xs mb-2">{insight.comparison}</p>
                      <p className="text-xs opacity-90">{insight.explanation}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-4 pt-4 border-t border-purple-200">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <Button size="sm" variant="outline" className="h-8 text-xs">
                  <MessageSquare className="h-3 w-3 mr-1" />
                  Ask AI Question
                </Button>
                <Button size="sm" variant="outline" className="h-8 text-xs">
                  <FileText className="h-3 w-3 mr-1" />
                  Generate Report
                </Button>
                <Button size="sm" variant="outline" className="h-8 text-xs">
                  <Target className="h-3 w-3 mr-1" />
                  Optimize Allocation
                </Button>
                <Button size="sm" variant="outline" className="h-8 text-xs">
                  <Calendar className="h-3 w-3 mr-1" />
                  Schedule Review
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Show AI Panel Button (when hidden) */}
      {!showAIPanel && (
        <Button 
          onClick={() => setShowAIPanel(true)}
          className="w-full bg-purple-600 hover:bg-purple-700"
        >
          <Bot className="h-4 w-4 mr-2" />
          Show AI Assistant ({activeRecommendations.length} recommendations available)
        </Button>
      )}

      {/* Enhanced Traditional Dashboard with AI Overlays */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="overview" className="relative">
            Overview
            {aiEnhancements.performanceInsights.some(i => i.type === 'NEGATIVE') && (
              <div className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full" />
            )}
          </TabsTrigger>
          <TabsTrigger value="commitments">Commitments</TabsTrigger>
          <TabsTrigger value="capital-calls" className="relative">
            Capital Calls
            {activeRecommendations.some(r => r.type === 'RESPONSE') && (
              <div className="absolute -top-1 -right-1 h-2 w-2 bg-purple-500 rounded-full" />
            )}
          </TabsTrigger>
          <TabsTrigger value="distributions">Distributions</TabsTrigger>
          <TabsTrigger value="co-investments" className="relative">
            Co-Investments
            {activeRecommendations.some(r => r.type === 'INVESTMENT') && (
              <div className="absolute -top-1 -right-1 h-2 w-2 bg-purple-500 rounded-full" />
            )}
          </TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="ai-insights">
            AI Insights
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          {/* Enhanced Overview with AI insights */}
          <div className="space-y-6">
            {/* AI-Enhanced Performance Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {aiEnhancements.performanceInsights.map((insight, index) => (
                <Card key={index} className={`border-l-4 ${getInsightColor(insight.type)}`}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-sm">{insight.metric}</h3>
                      {getTrendIcon(insight.trend)}
                    </div>
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="text-2xl font-bold">{insight.value}%</span>
                      <Badge variant="outline" className="text-xs">
                        {insight.type}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-600 mb-2">{insight.comparison}</p>
                    <p className="text-xs opacity-75">{insight.explanation}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {/* Traditional dashboard content with AI annotations */}
            <LPPortalTraditional 
              data={data} 
              onRespond={onRespond}
              onViewDetails={onViewDetails}
            />
          </div>
        </TabsContent>

        <TabsContent value="commitments">
          <LPPortalTraditional 
            data={data} 
            onRespond={onRespond}
            onViewDetails={onViewDetails}
          />
        </TabsContent>

        <TabsContent value="capital-calls">
          <LPPortalTraditional 
            data={data} 
            onRespond={onRespond}
            onViewDetails={onViewDetails}
          />
        </TabsContent>

        <TabsContent value="distributions">
          <LPPortalTraditional 
            data={data} 
            onRespond={onRespond}
            onViewDetails={onViewDetails}
          />
        </TabsContent>

        <TabsContent value="co-investments">
          <LPPortalTraditional 
            data={data} 
            onRespond={onRespond}
            onViewDetails={onViewDetails}
          />
        </TabsContent>

        <TabsContent value="documents">
          <LPPortalTraditional 
            data={data} 
            onRespond={onRespond}
            onViewDetails={onViewDetails}
          />
        </TabsContent>

        <TabsContent value="ai-insights" className="space-y-6">
          {/* All AI Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-yellow-500" />
                All AI Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {aiEnhancements.recommendations.map((rec) => (
                  <div key={rec.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium">{rec.title}</h4>
                          <Badge 
                            variant={rec.priority === 'HIGH' ? 'destructive' : rec.priority === 'MEDIUM' ? 'default' : 'secondary'}
                          >
                            {rec.priority}
                          </Badge>
                          <Badge variant="outline">
                            {rec.type.replace('_', ' ')}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{rec.description}</p>
                        {rec.estimatedImpact && (
                          <p className="text-sm text-blue-600 bg-blue-50 p-2 rounded">
                            <Target className="h-4 w-4 inline mr-1" />
                            Expected Impact: {rec.estimatedImpact}
                          </p>
                        )}
                        <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                          <span>Confidence: {Math.round(rec.confidence * 100)}%</span>
                          <span>Type: {rec.type.replace('_', ' ')}</span>
                          <span>{rec.actionable ? 'Actionable' : 'Informational'}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => handleAcceptRecommendation(rec)}>
                        <ThumbsUp className="h-3 w-3 mr-1" />
                        Accept
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleDismissRecommendation(rec.id)}>
                        <ThumbsDown className="h-3 w-3 mr-1" />
                        Dismiss
                      </Button>
                      <Button size="sm" variant="outline">
                        <MessageSquare className="h-3 w-3 mr-1" />
                        Ask Questions
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Automation Center */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-purple-500" />
                Automation Center
              </CardTitle>
              <CardDescription>
                Enable automation to save time on routine tasks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {aiEnhancements.automationSuggestions.map((suggestion) => (
                  <Card key={suggestion.id} className={suggestion.enabled ? 'border-green-200 bg-green-50' : ''}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h4 className="font-medium mb-1">{suggestion.task}</h4>
                          <div className="flex items-center gap-3 text-sm text-gray-600">
                            <span>Saves: {suggestion.timeSaving} min</span>
                            <span>Effort: {suggestion.effort}</span>
                            <span>Frequency: {suggestion.frequency}</span>
                          </div>
                        </div>
                        <Badge variant={suggestion.enabled ? 'default' : 'outline'}>
                          {suggestion.enabled ? 'Enabled' : 'Disabled'}
                        </Badge>
                      </div>
                      <Button 
                        size="sm" 
                        className="w-full"
                        variant={suggestion.enabled ? 'outline' : 'default'}
                      >
                        <Sparkles className="h-3 w-3 mr-1" />
                        {suggestion.enabled ? 'Disable' : 'Enable'} Automation
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Trending Topics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-500" />
                Trending in Private Equity
              </CardTitle>
              <CardDescription>
                Topics relevant to your portfolio and investment strategy
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {aiEnhancements.trendingTopics.map((topic, index) => (
                  <Button 
                    key={index} 
                    variant="outline" 
                    className="h-auto p-3 text-left justify-start"
                  >
                    <div>
                      <p className="font-medium text-sm">{topic}</p>
                      <p className="text-xs text-gray-600 mt-1">Explore insights</p>
                    </div>
                    <ArrowRight className="h-4 w-4 ml-auto" />
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default LPPortalAssisted;