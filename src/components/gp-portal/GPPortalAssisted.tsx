'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Building2,
  FileText,
  MessageSquare,
  Plus,
  Eye,
  Bot,
  Lightbulb,
  Zap,
  Target,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  ThumbsUp,
  ThumbsDown,
  Play
} from 'lucide-react';
import { GPPortalTraditional } from './GPPortalTraditional';
import { formatCurrency, formatDate } from '@/lib/utils';
import type { 
  GPCompany, 
  GPDealSubmission, 
  GPMetrics,
  GPOnboardingProgress,
  AISuggestion,
  AutomationOpportunity,
  InsightsSummary
} from '@/types/gp-portal';

interface GPPortalAssistedProps {
  data: {
    companies: GPCompany[];
    activeDeals: GPDealSubmission[];
    metrics: GPMetrics;
    onboardingProgress: GPOnboardingProgress[];
    recentActivity: any[];
  };
  onViewDetails: (type: string, id: string) => void;
  onAcceptSuggestion: (suggestion: AISuggestion) => void;
}

export function GPPortalAssisted({ data, onViewDetails, onAcceptSuggestion }: GPPortalAssistedProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [showAIPanel, setShowAIPanel] = useState(true);
  const [dismissedSuggestions, setDismissedSuggestions] = useState<Set<string>>(new Set());

  // Mock AI data - in real app this would come from AI service
  const aiInsights = useMemo<{
    suggestions: AISuggestion[];
    automationOpportunities: AutomationOpportunity[];
    insights: InsightsSummary;
  }>(() => ({
    suggestions: [
      {
        type: 'COMPLETION',
        title: 'Complete TechStartup Alpha Documentation',
        description: 'Upload missing financial statements to speed up review process. Based on similar deals, this could reduce processing time by 5-7 days.',
        priority: 'HIGH',
        confidence: 0.85,
        actionable: true
      },
      {
        type: 'IMPROVEMENT',
        title: 'Enhance Investment Thesis',
        description: 'Your investment thesis for Series B deals typically perform better with market size analysis. Would you like me to suggest improvements?',
        priority: 'MEDIUM',
        confidence: 0.72,
        actionable: true
      },
      {
        type: 'RISK_MITIGATION',
        title: 'Address Compliance Gap',
        description: 'HealthTech Innovators may need additional regulatory documentation for healthcare sector compliance.',
        priority: 'HIGH',
        confidence: 0.91,
        actionable: true
      },
      {
        type: 'OPTIMIZATION',
        title: 'Optimize Submission Timing',
        description: 'Based on historical data, submissions on Tuesday-Wednesday have 23% higher approval rates.',
        priority: 'LOW',
        confidence: 0.68,
        actionable: false
      }
    ],
    automationOpportunities: [
      {
        task: 'Auto-populate deal metrics from financial statements',
        timesSaved: 45,
        effort: 'LOW',
        impact: 'HIGH',
        canAutomate: true
      },
      {
        task: 'Generate compliance checklists automatically',
        timesSaved: 30,
        effort: 'MEDIUM',
        impact: 'MEDIUM',
        canAutomate: true
      },
      {
        task: 'Schedule follow-up communications',
        timesSaved: 15,
        effort: 'LOW',
        impact: 'MEDIUM',
        canAutomate: true
      }
    ],
    insights: {
      trendingDeals: ['Fintech Series B', 'Healthcare AI'],
      marketOpportunities: ['ESG compliance tools', 'Remote work solutions'],
      riskAlerts: ['Regulatory changes in healthcare sector'],
      performanceInsights: ['Your Q4 submissions have 34% higher approval rates']
    }
  }), []);

  const handleAcceptSuggestion = (suggestion: AISuggestion) => {
    onAcceptSuggestion(suggestion);
    setDismissedSuggestions(prev => new Set([...prev, suggestion.title]));
  };

  const handleDismissSuggestion = (suggestionTitle: string) => {
    setDismissedSuggestions(prev => new Set([...prev, suggestionTitle]));
  };

  const activeSuggestions = aiInsights.suggestions.filter(s => !dismissedSuggestions.has(s.title));

  return (
    <div className="space-y-6">
      {/* AI Assistance Panel */}
      {showAIPanel && (
        <Card className="border-blue-200 bg-blue-50/50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bot className="h-5 w-5 text-blue-600" />
                <CardTitle className="text-blue-900">AI Assistant Active</CardTitle>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowAIPanel(false)}
                className="text-blue-600 hover:text-blue-700"
              >
                Hide AI Panel
              </Button>
            </div>
            <CardDescription className="text-blue-700">
              Your AI assistant has identified {activeSuggestions.length} opportunities to improve your submissions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Active Suggestions */}
              <div>
                <h4 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                  <Lightbulb className="h-4 w-4" />
                  Smart Suggestions ({activeSuggestions.length})
                </h4>
                <div className="space-y-2">
                  {activeSuggestions.slice(0, 2).map((suggestion, index) => (
                    <div key={index} className="bg-white p-3 rounded-lg border">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <p className="font-medium text-sm">{suggestion.title}</p>
                          <p className="text-xs text-gray-600 mt-1">{suggestion.description}</p>
                        </div>
                        <div className="flex items-center gap-1 ml-2">
                          <Badge 
                            variant={suggestion.priority === 'HIGH' ? 'destructive' : suggestion.priority === 'MEDIUM' ? 'default' : 'secondary'}
                            className="text-xs"
                          >
                            {suggestion.priority}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">
                          {Math.round(suggestion.confidence * 100)}% confident
                        </span>
                        <div className="flex gap-1">
                          <Button 
                            size="sm" 
                            className="h-7 text-xs"
                            onClick={() => handleAcceptSuggestion(suggestion)}
                            disabled={!suggestion.actionable}
                          >
                            <Play className="h-3 w-3 mr-1" />
                            {suggestion.actionable ? 'Apply' : 'Learn More'}
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="h-7 text-xs"
                            onClick={() => handleDismissSuggestion(suggestion.title)}
                          >
                            <XCircle className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Automation Opportunities */}
              <div>
                <h4 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  Automation Available
                </h4>
                <div className="space-y-2">
                  {aiInsights.automationOpportunities.slice(0, 2).map((opportunity, index) => (
                    <div key={index} className="bg-white p-3 rounded-lg border">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <p className="font-medium text-sm">{opportunity.task}</p>
                          <div className="flex items-center gap-3 mt-1 text-xs text-gray-600">
                            <span>Saves: {opportunity.timesSaved} min</span>
                            <span>Effort: {opportunity.effort}</span>
                            <span>Impact: {opportunity.impact}</span>
                          </div>
                        </div>
                      </div>
                      <Button 
                        size="sm" 
                        className="h-7 text-xs w-full"
                        disabled={!opportunity.canAutomate}
                      >
                        <Sparkles className="h-3 w-3 mr-1" />
                        Enable Automation
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Insights */}
            <div className="mt-4 pt-4 border-t border-blue-200">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="bg-white p-3 rounded-lg border text-center">
                  <TrendingUp className="h-6 w-6 text-green-600 mx-auto mb-1" />
                  <p className="text-xs font-medium">Performance Trend</p>
                  <p className="text-xs text-gray-600">+12% this quarter</p>
                </div>
                <div className="bg-white p-3 rounded-lg border text-center">
                  <Clock className="h-6 w-6 text-orange-600 mx-auto mb-1" />
                  <p className="text-xs font-medium">Time Saved</p>
                  <p className="text-xs text-gray-600">2.5 hours/week</p>
                </div>
                <div className="bg-white p-3 rounded-lg border text-center">
                  <Target className="h-6 w-6 text-blue-600 mx-auto mb-1" />
                  <p className="text-xs font-medium">Success Rate</p>
                  <p className="text-xs text-gray-600">Above average</p>
                </div>
                <div className="bg-white p-3 rounded-lg border text-center">
                  <CheckCircle className="h-6 w-6 text-blue-600 mx-auto mb-1" />
                  <p className="text-xs font-medium">AI Accuracy</p>
                  <p className="text-xs text-gray-600">94% helpful</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Show AI Panel Button (when hidden) */}
      {!showAIPanel && (
        <Button 
          onClick={() => setShowAIPanel(true)}
          className="w-full bg-blue-600 hover:bg-blue-700"
        >
          <Bot className="h-4 w-4 mr-2" />
          Show AI Assistant ({activeSuggestions.length} suggestions available)
        </Button>
      )}

      {/* Enhanced Traditional Dashboard with AI Overlays */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="relative">
            Overview
            {activeSuggestions.some(s => s.type === 'OPTIMIZATION') && (
              <div className="absolute -top-1 -right-1 h-2 w-2 bg-blue-500 rounded-full" />
            )}
          </TabsTrigger>
          <TabsTrigger value="companies" className="relative">
            Companies
            {activeSuggestions.some(s => s.title.includes('Company')) && (
              <div className="absolute -top-1 -right-1 h-2 w-2 bg-blue-500 rounded-full" />
            )}
          </TabsTrigger>
          <TabsTrigger value="deals" className="relative">
            Deal Submissions
            {activeSuggestions.some(s => s.type === 'COMPLETION' || s.type === 'IMPROVEMENT') && (
              <div className="absolute -top-1 -right-1 h-2 w-2 bg-blue-500 rounded-full" />
            )}
          </TabsTrigger>
          <TabsTrigger value="insights">
            AI Insights
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="space-y-6">
            {/* Enhanced Performance Metrics with AI insights */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Performance Overview</CardTitle>
                    <CardDescription>Your metrics with AI-powered insights</CardDescription>
                  </div>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    <Bot className="h-3 w-3 mr-1" />
                    AI Enhanced
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-600">Success Rate</p>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="h-3 w-3 text-green-500" />
                        <span className="text-xs text-green-600">+5% vs avg</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Progress value={data.metrics.successRate * 100} className="flex-1" />
                      <span className="text-sm font-medium">{Math.round(data.metrics.successRate * 100)}%</span>
                    </div>
                    <p className="text-xs text-blue-600">💡 AI suggests optimizing submission timing</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">{data.metrics.approvedDeals}</p>
                    <p className="text-sm text-gray-600">Approved Deals</p>
                    <p className="text-xs text-blue-600">🎯 On track for quarterly goal</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">{data.metrics.averageProcessingTime}</p>
                    <p className="text-sm text-gray-600">Avg Days to Review</p>
                    <p className="text-xs text-orange-600">⚡ Could reduce by 5 days with complete docs</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Traditional dashboard with AI enhancements */}
            <GPPortalTraditional 
              data={data} 
              onViewDetails={onViewDetails}
            />
          </div>
        </TabsContent>

        <TabsContent value="companies">
          <GPPortalTraditional 
            data={data} 
            onViewDetails={onViewDetails}
          />
        </TabsContent>

        <TabsContent value="deals">
          <GPPortalTraditional 
            data={data} 
            onViewDetails={onViewDetails}
          />
        </TabsContent>

        <TabsContent value="insights">
          <div className="space-y-6">
            {/* AI Insights Dashboard */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-yellow-500" />
                    All AI Suggestions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {aiInsights.suggestions.map((suggestion, index) => (
                      <div key={index} className="border rounded-lg p-3">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-medium text-sm">{suggestion.title}</h4>
                              <Badge 
                                variant={
                                  suggestion.priority === 'HIGH' ? 'destructive' : 
                                  suggestion.priority === 'MEDIUM' ? 'default' : 'secondary'
                                }
                                className="text-xs"
                              >
                                {suggestion.priority}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600">{suggestion.description}</p>
                            <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                              <span>Type: {suggestion.type.replace('_', ' ')}</span>
                              <span>Confidence: {Math.round(suggestion.confidence * 100)}%</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" onClick={() => handleAcceptSuggestion(suggestion)}>
                            <ThumbsUp className="h-3 w-3 mr-1" />
                            Accept
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleDismissSuggestion(suggestion.title)}>
                            <ThumbsDown className="h-3 w-3 mr-1" />
                            Dismiss
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-500" />
                    Market Insights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Trending Deal Types</h4>
                      <div className="space-y-1">
                        {aiInsights.insights.trendingDeals.map((trend, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <span className="text-sm">{trend}</span>
                            <Badge variant="secondary">Hot</Badge>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Market Opportunities</h4>
                      <div className="space-y-1">
                        {aiInsights.insights.marketOpportunities.map((opportunity, index) => (
                          <div key={index} className="flex items-center gap-2 p-2 bg-green-50 rounded">
                            <Target className="h-4 w-4 text-green-600" />
                            <span className="text-sm">{opportunity}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Risk Alerts</h4>
                      <div className="space-y-1">
                        {aiInsights.insights.riskAlerts.map((alert, index) => (
                          <div key={index} className="flex items-center gap-2 p-2 bg-red-50 rounded">
                            <AlertTriangle className="h-4 w-4 text-red-600" />
                            <span className="text-sm">{alert}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Automation Center */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-blue-500" />
                  Automation Center
                </CardTitle>
                <CardDescription>
                  Save time with these automation opportunities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  {aiInsights.automationOpportunities.map((opportunity, index) => (
                    <Card key={index}>
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          <div>
                            <h4 className="font-medium text-sm mb-1">{opportunity.task}</h4>
                            <div className="flex items-center justify-between text-xs text-gray-600">
                              <span>Saves {opportunity.timesSaved} min</span>
                              <Badge variant="outline" className="text-xs">
                                {opportunity.effort} effort
                              </Badge>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-600">
                              {opportunity.impact} impact
                            </span>
                            <Button 
                              size="sm" 
                              disabled={!opportunity.canAutomate}
                              className="h-7 text-xs"
                            >
                              Enable
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default GPPortalAssisted;