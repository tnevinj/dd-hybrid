'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Sparkles,
  Target,
  CheckCircle,
  Clock,
  AlertTriangle,
  TrendingUp,
  Bot,
  Zap,
  Eye,
  ThumbsUp,
  ThumbsDown,
  Play,
  Pause,
  Settings,
  DollarSign,
  BarChart3,
  Calendar,
  FileText,
  MessageSquare,
  ArrowRight
} from 'lucide-react';
import { formatCurrency, formatPercentage, formatDate } from '@/lib/utils';
import type { 
  LPDashboardData,
  PriorityAction,
  AutomatedActivity,
  DecisionPoint,
  IntelligentSummary,
  AutomationMetrics
} from '@/types/lp-portal';

interface LPAutonomousDashboardProps {
  data: LPDashboardData;
  onExecuteAction: (action: PriorityAction) => void;
  onMakeDecision: (decision: DecisionPoint) => void;
}

export function LPAutonomousDashboard({ 
  data, 
  onExecuteAction, 
  onMakeDecision 
}: LPAutonomousDashboardProps) {
  const [expandedActions, setExpandedActions] = useState<Set<string>>(new Set());

  // Mock autonomous data - in real app this would come from AI service
  const autonomousData = useMemo(() => ({
    priorityActions: [
      {
        id: 'action_1',
        type: 'RESPOND' as const,
        title: 'Respond to Growth Equity Fund III Capital Call',
        description: 'AI has pre-analyzed this capital call. It follows normal deployment patterns for a fund performing at 18.5% IRR. Recommend standard acknowledgment and funding.',
        urgency: 'HIGH' as const,
        deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 15), // 15 days
        estimatedTime: 10,
        autoExecutable: true
      },
      {
        id: 'action_2',
        type: 'REVIEW' as const,
        title: 'Review Co-Investment Opportunity Analysis',
        description: 'AI has completed due diligence analysis on MedAI Solutions. Market positioning is strong, but valuation appears 15% above comparables. Your decision needed.',
        urgency: 'MEDIUM' as const,
        deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 7 days
        estimatedTime: 25,
        autoExecutable: false
      },
      {
        id: 'action_3',
        type: 'APPROVE' as const,
        title: 'Approve Advisory Committee Vote',
        description: 'AI recommends Candidate A based on your historical voting patterns and expertise preferences. Candidate has 15+ years PE experience in your focus sectors.',
        urgency: 'LOW' as const,
        deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 10), // 10 days
        estimatedTime: 5,
        autoExecutable: true
      }
    ],
    
    automatedActivities: [
      {
        id: 'auto_1',
        activity: 'Generated Q4 2024 portfolio performance summary',
        status: 'COMPLETED' as const,
        completedAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        result: 'Portfolio IRR: 15.8%, outperforming benchmark by 3.2%. 3 key insights identified.'
      },
      {
        id: 'auto_2',
        activity: 'Analyzed Technology Fund IV underperformance',
        status: 'COMPLETED' as const,
        completedAt: new Date(Date.now() - 1000 * 60 * 60 * 6), // 6 hours ago
        result: 'Market correction primary factor. Fund fundamentals remain sound. No action required.'
      },
      {
        id: 'auto_3',
        activity: 'Processing MedAI co-investment due diligence',
        status: 'IN_PROGRESS' as const,
        scheduledFor: new Date(Date.now() + 1000 * 60 * 60 * 4) // 4 hours from now
      },
      {
        id: 'auto_4',
        activity: 'Monitoring capital call deadlines',
        status: 'SCHEDULED' as const,
        scheduledFor: new Date(Date.now() + 1000 * 60 * 60 * 24) // Tomorrow
      }
    ],
    
    decisionsRequired: [
      {
        id: 'decision_1',
        decision: 'Healthcare AI Co-Investment Decision',
        context: 'MedAI Solutions Series C presents strong fundamentals but premium valuation. AI analysis shows 65% probability of 15%+ IRR despite high entry multiple.',
        options: [
          {
            id: 'option_1',
            title: 'Invest $5M at proposed terms',
            description: 'Full participation at current valuation',
            pros: [
              'Strong market position in growing sector',
              'Experienced management team',
              'Clear path to profitability',
              'Aligns with portfolio strategy'
            ],
            cons: [
              '15% premium to comparables',
              'Market timing risk',
              'High concentration in healthcare'
            ],
            aiRecommendation: false,
            confidence: 0.35
          },
          {
            id: 'option_2',
            title: 'Invest $3M with negotiated terms',
            description: 'Reduced investment with better terms',
            pros: [
              'Lower risk exposure',
              'Better terms negotiation',
              'Maintains relationship',
              'Still meaningful allocation'
            ],
            cons: [
              'May not get preferred terms',
              'Smaller upside potential',
              'Complex negotiation'
            ],
            aiRecommendation: true,
            confidence: 0.72
          },
          {
            id: 'option_3',
            title: 'Pass on this opportunity',
            description: 'Decline participation',
            pros: [
              'Avoid overvaluation risk',
              'Preserve capital for better opportunities',
              'Maintain portfolio balance'
            ],
            cons: [
              'Miss potential high-growth opportunity',
              'Weaken GP relationship',
              'Limited healthcare exposure'
            ],
            aiRecommendation: false,
            confidence: 0.28
          }
        ],
        deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 7 days
        impact: 'HIGH' as const,
        recommendations: [
          'Consider negotiated terms to balance opportunity and risk',
          'Request additional management presentations',
          'Evaluate impact on overall portfolio allocation'
        ]
      }
    ],
    
    intelligentSummary: {
      todaysHighlights: [
        'Portfolio outperforming benchmarks by 3.2%',
        'Growth Equity Fund III capital call requires response',
        'Q4 performance report generated and ready for review'
      ],
      upcomingDeadlines: [
        {
          type: 'Capital Call',
          description: 'Growth Equity Fund III - $8.5M',
          deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 15),
          daysRemaining: 15,
          criticalPath: true
        },
        {
          type: 'Co-Investment',
          description: 'MedAI Solutions decision',
          deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
          daysRemaining: 7,
          criticalPath: true
        },
        {
          type: 'Election',
          description: 'Advisory Committee vote',
          deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 10),
          daysRemaining: 10,
          criticalPath: false
        }
      ],
      performanceSummary: 'Your portfolio continues to outperform with a 15.8% weighted average IRR, driven by strong growth equity positions. Technology Fund IV underperformance is attributed to market conditions rather than fund-specific issues.',
      riskAlerts: [
        'Healthcare allocation increasing to 35% with potential co-investment',
        'Technology sector exposure may face continued headwinds'
      ],
      opportunityHighlights: [
        'Secondary market opportunities emerging in growth equity',
        'ESG-focused funds showing premium performance',
        'Co-investment pipeline strengthening across portfolio'
      ]
    },
    
    automationMetrics: {
      tasksAutomated: 47,
      timeSavedHours: 18.5,
      accuracyRate: 94.2,
      userSatisfaction: 91,
      automationCoverage: 68
    }
  }), []);

  const toggleActionExpansion = (actionId: string) => {
    setExpandedActions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(actionId)) {
        newSet.delete(actionId);
      } else {
        newSet.add(actionId);
      }
      return newSet;
    });
  };

  const getUrgencyColor = (urgency: string) => {
    const colors = {
      'LOW': 'bg-green-100 text-green-800 border-green-200',
      'MEDIUM': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'HIGH': 'bg-orange-100 text-orange-800 border-orange-200',
      'CRITICAL': 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[urgency as keyof typeof colors] || colors.MEDIUM;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'IN_PROGRESS':
        return <Play className="h-4 w-4 text-blue-600" />;
      case 'SCHEDULED':
        return <Clock className="h-4 w-4 text-orange-600" />;
      case 'FAILED':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Intelligent Welcome */}
      <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Good morning! Your AI assistant has everything under control.
              </h1>
              <p className="text-gray-700 mb-4">
                {autonomousData.intelligentSummary.performanceSummary}
              </p>
              <div className="flex flex-wrap gap-2">
                {autonomousData.intelligentSummary.todaysHighlights.map((highlight, index) => (
                  <Badge key={index} variant="outline" className="bg-white">
                    ✓ {highlight}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-5 w-5 text-green-600" />
                <span className="font-semibold text-green-700">AI Managing</span>
              </div>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between gap-4">
                  <span>Time Saved:</span>
                  <span className="font-medium">{autonomousData.automationMetrics.timeSavedHours}h</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span>Accuracy:</span>
                  <span className="font-medium">{autonomousData.automationMetrics.accuracyRate}%</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Priority Actions - Main Focus */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-red-600" />
                Your Attention Needed ({autonomousData.priorityActions.length} items)
              </CardTitle>
              <CardDescription>
                Everything else is automated - these require your decision
              </CardDescription>
            </div>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-1" />
              Adjust Priorities
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {autonomousData.priorityActions.map((action) => (
              <Card key={action.id} className={`border-l-4 border-l-orange-500`}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold">{action.title}</h3>
                        <Badge className={getUrgencyColor(action.urgency)}>
                          {action.urgency}
                        </Badge>
                        <span className="text-sm text-gray-500">~{action.estimatedTime} min</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{action.description}</p>
                      
                      {action.deadline && (
                        <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>Due: {formatDate(action.deadline)}</span>
                          </div>
                          <span>
                            {Math.ceil((action.deadline.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days remaining
                          </span>
                        </div>
                      )}
                      
                      {expandedActions.has(action.id) && (
                        <div className="bg-blue-50 p-3 rounded-lg mb-3">
                          <h4 className="font-medium mb-2">AI Analysis:</h4>
                          <ul className="text-sm text-gray-700 space-y-1">
                            <li>• Historical pattern analysis completed</li>
                            <li>• Risk assessment: Low to moderate</li>
                            <li>• Aligns with your investment preferences</li>
                            <li>• No red flags detected in automated screening</li>
                          </ul>
                        </div>
                      )}
                      
                      <div className="flex items-center gap-2">
                        <Button 
                          size="sm" 
                          onClick={() => onExecuteAction(action)}
                          className="bg-purple-600 hover:bg-purple-700"
                        >
                          <Play className="h-4 w-4 mr-1" />
                          {action.autoExecutable ? 'Auto-Execute' : 'Review & Decide'}
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => toggleActionExpansion(action.id)}
                        >
                          {expandedActions.has(action.id) ? 'Less' : 'More'} Details
                        </Button>
                        {action.autoExecutable && (
                          <Button size="sm" variant="outline">
                            <Settings className="h-4 w-4 mr-1" />
                            Configure
                          </Button>
                        )}
                      </div>
                    </div>
                    <div className="ml-4">
                      {action.type === 'RESPOND' && <MessageSquare className="h-6 w-6 text-blue-600" />}
                      {action.type === 'REVIEW' && <Eye className="h-6 w-6 text-orange-600" />}
                      {action.type === 'APPROVE' && <CheckCircle className="h-6 w-6 text-green-600" />}
                      {action.type === 'DECIDE' && <Target className="h-6 w-6 text-purple-600" />}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Strategic Decisions */}
      {autonomousData.decisionsRequired.length > 0 && (
        <Card className="border-purple-200 bg-purple-50/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-purple-800">
              <Target className="h-5 w-5" />
              Strategic Decision Required
            </CardTitle>
            <CardDescription className="text-purple-700">
              AI has completed analysis - your strategic input needed
            </CardDescription>
          </CardHeader>
          <CardContent>
            {autonomousData.decisionsRequired.map((decision) => (
              <div key={decision.id} className="bg-white p-4 rounded-lg">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-lg mb-2">{decision.decision}</h3>
                    <p className="text-gray-600 mb-3">{decision.context}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>Impact: {decision.impact}</span>
                      <span>Deadline: {formatDate(decision.deadline)}</span>
                      <span>{Math.ceil((decision.deadline.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days remaining</span>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
                  {decision.options.map((option) => (
                    <Card key={option.id} className={`${option.aiRecommendation ? 'border-green-200 bg-green-50' : ''}`}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-sm">{option.title}</h4>
                          {option.aiRecommendation && (
                            <Badge className="bg-green-100 text-green-800 text-xs">
                              AI Recommended
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-gray-600 mb-3">{option.description}</p>
                        
                        <div className="space-y-2 text-xs">
                          <div>
                            <span className="font-medium text-green-700">Pros:</span>
                            <ul className="list-disc list-inside text-gray-600 mt-1 space-y-0.5">
                              {option.pros.slice(0, 2).map((pro, i) => <li key={i}>{pro}</li>)}
                            </ul>
                          </div>
                          <div>
                            <span className="font-medium text-red-700">Cons:</span>
                            <ul className="list-disc list-inside text-gray-600 mt-1 space-y-0.5">
                              {option.cons.slice(0, 2).map((con, i) => <li key={i}>{con}</li>)}
                            </ul>
                          </div>
                          <div className="pt-2 border-t">
                            <Progress value={option.confidence * 100} className="h-2 mb-1" />
                            <span className="text-gray-500">AI Confidence: {Math.round(option.confidence * 100)}%</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                
                <div className="bg-blue-50 p-3 rounded-lg mb-4">
                  <h4 className="font-medium text-blue-900 mb-2">AI Recommendations:</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    {decision.recommendations.map((rec, i) => (
                      <li key={i}>• {rec}</li>
                    ))}
                  </ul>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button onClick={() => onMakeDecision(decision)}>
                    <Target className="h-4 w-4 mr-1" />
                    Make Decision
                  </Button>
                  <Button variant="outline">
                    <MessageSquare className="h-4 w-4 mr-1" />
                    Request More Analysis
                  </Button>
                  <Button variant="outline">
                    <Calendar className="h-4 w-4 mr-1" />
                    Schedule Call with GP
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* AI Activity Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-blue-600" />
              Automated Activities
            </CardTitle>
            <CardDescription>What your AI assistant has been doing</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {autonomousData.automatedActivities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="mt-0.5">
                    {getStatusIcon(activity.status)}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{activity.activity}</p>
                    <div className="flex items-center gap-3 mt-1 text-xs text-gray-600">
                      <span className="capitalize">{activity.status.replace('_', ' ')}</span>
                      {activity.completedAt && (
                        <span>{formatDate(activity.completedAt)}</span>
                      )}
                      {activity.scheduledFor && (
                        <span>Scheduled: {formatDate(activity.scheduledFor)}</span>
                      )}
                    </div>
                    {activity.result && (
                      <p className="text-xs text-green-700 bg-green-100 p-2 rounded mt-2">{activity.result}</p>
                    )}
                    {activity.errorMessage && (
                      <p className="text-xs text-red-700 bg-red-100 p-2 rounded mt-2">{activity.errorMessage}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-green-600" />
              Automation Impact
            </CardTitle>
            <CardDescription>How AI is improving your portfolio management</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Time Saved This Week</span>
                  <span className="text-sm text-gray-600">{autonomousData.automationMetrics.timeSavedHours} hours</span>
                </div>
                <Progress value={(autonomousData.automationMetrics.timeSavedHours / 40) * 100} className="h-2" />
                <p className="text-xs text-gray-500 mt-1">Equivalent to 46% of a full work day</p>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">AI Accuracy Rate</span>
                  <span className="text-sm text-gray-600">{autonomousData.automationMetrics.accuracyRate}%</span>
                </div>
                <Progress value={autonomousData.automationMetrics.accuracyRate} className="h-2" />
                <p className="text-xs text-gray-500 mt-1">Based on {autonomousData.automationMetrics.tasksAutomated} completed tasks</p>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Automation Coverage</span>
                  <span className="text-sm text-gray-600">{autonomousData.automationMetrics.automationCoverage}%</span>
                </div>
                <Progress value={autonomousData.automationMetrics.automationCoverage} className="h-2" />
                <p className="text-xs text-gray-500 mt-1">Of routine tasks are automated</p>
              </div>
              
              <div className="pt-3 border-t space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Tasks Completed</span>
                  <span className="text-sm font-medium text-blue-600">
                    {autonomousData.automationMetrics.tasksAutomated}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">User Satisfaction</span>
                  <span className="text-sm font-medium text-green-600">
                    {autonomousData.automationMetrics.userSatisfaction}%
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Intelligent Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-600" />
            Portfolio Intelligence Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3">Upcoming Deadlines</h4>
              <div className="space-y-2">
                {autonomousData.intelligentSummary.upcomingDeadlines.map((deadline, index) => (
                  <div key={index} className={`p-3 rounded-lg border ${deadline.criticalPath ? 'border-red-200 bg-red-50' : 'border-gray-200'}`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm">{deadline.type}</p>
                        <p className="text-sm text-gray-600">{deadline.description}</p>
                      </div>
                      <div className="text-right">
                        <p className={`text-sm font-medium ${deadline.criticalPath ? 'text-red-600' : 'text-gray-600'}`}>
                          {deadline.daysRemaining} days
                        </p>
                        {deadline.criticalPath && (
                          <Badge variant="destructive" className="text-xs mt-1">Critical</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-3">Risk Alerts & Opportunities</h4>
              <div className="space-y-3">
                <div>
                  <h5 className="text-sm font-medium text-red-700 mb-2">Risk Alerts</h5>
                  {autonomousData.intelligentSummary.riskAlerts.map((alert, index) => (
                    <div key={index} className="flex items-start gap-2 p-2 bg-red-50 rounded text-sm">
                      <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                      <span>{alert}</span>
                    </div>
                  ))}
                </div>
                
                <div>
                  <h5 className="text-sm font-medium text-green-700 mb-2">Opportunities</h5>
                  {autonomousData.intelligentSummary.opportunityHighlights.map((opportunity, index) => (
                    <div key={index} className="flex items-start gap-2 p-2 bg-green-50 rounded text-sm">
                      <TrendingUp className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>{opportunity}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Portfolio Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{formatPercentage(data.summary.weightedAverageIRR)}</div>
            <div className="text-sm text-gray-600">Portfolio IRR</div>
            <div className="text-xs text-green-600 mt-1">+3.2% vs benchmark</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{formatCurrency(data.summary.currentNAV)}</div>
            <div className="text-sm text-gray-600">Current NAV</div>
            <div className="text-xs text-blue-600 mt-1">Updated automatically</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">{autonomousData.automationMetrics.tasksAutomated}</div>
            <div className="text-sm text-gray-600">Tasks Automated</div>
            <div className="text-xs text-purple-600 mt-1">This month</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">{autonomousData.priorityActions.length}</div>
            <div className="text-sm text-gray-600">Need Attention</div>
            <div className="text-xs text-orange-600 mt-1">Requires decision</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default LPAutonomousDashboard;