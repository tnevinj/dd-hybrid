'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Sparkles,
  CheckCircle,
  Clock,
  AlertTriangle,
  ArrowRight,
  Play,
  Pause,
  Eye,
  ThumbsUp,
  ThumbsDown,
  Settings,
  TrendingUp,
  Zap,
  Bot,
  Target,
  Calendar,
  FileText,
  MessageSquare,
  MoreHorizontal
} from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';
import type { 
  GPCompany, 
  GPDealSubmission, 
  GPMetrics,
  GPOnboardingProgress,
  PriorityAction,
  AutomatedTask,
  DecisionRequired,
  PerformanceSummary
} from '@/types/gp-portal';

interface GPAutonomousDashboardProps {
  data: {
    companies: GPCompany[];
    activeDeals: GPDealSubmission[];
    metrics: GPMetrics;
    onboardingProgress: GPOnboardingProgress[];
    recentActivity: any[];
  };
  onExecuteAction: (action: PriorityAction) => void;
  onRequireDecision: (decision: DecisionRequired) => void;
}

export function GPAutonomousDashboard({ data, onExecuteAction, onRequireDecision }: GPAutonomousDashboardProps) {
  const [expandedActions, setExpandedActions] = useState<Set<string>>(new Set());

  // Mock autonomous data - in real app this would come from AI service
  const autonomousData = useMemo(() => ({
    priorityActions: [
      {
        id: 'action_1',
        type: 'REVIEW_REQUIRED' as const,
        title: 'Review TechStartup Alpha Financial Model',
        description: 'AI has pre-analyzed the financial model and identified 2 potential issues that need your review before approval.',
        urgency: 'HIGH' as const,
        estimatedTime: 15,
        autoExecutable: false
      },
      {
        id: 'action_2',
        type: 'APPROVAL_NEEDED' as const,
        title: 'Approve Auto-Generated Compliance Checklist',
        description: 'AI has created a compliance checklist for HealthTech Innovators based on healthcare regulations. Ready for your approval.',
        urgency: 'MEDIUM' as const,
        estimatedTime: 5,
        autoExecutable: false
      },
      {
        id: 'action_3',
        type: 'FOLLOW_UP' as const,
        title: 'Follow-up Communication Drafted',
        description: 'AI has drafted follow-up messages for 3 pending deals. Review and approve sending.',
        urgency: 'LOW' as const,
        estimatedTime: 10,
        autoExecutable: true
      }
    ],
    automatedTasks: [
      {
        id: 'auto_1',
        task: 'Updated deal metrics for TechStartup Alpha',
        status: 'COMPLETED' as const,
        completedAt: new Date(),
        result: 'Successfully extracted and updated 15 financial metrics from latest documents'
      },
      {
        id: 'auto_2',
        task: 'Generated compliance report for HealthTech',
        status: 'IN_PROGRESS' as const,
        nextExecution: new Date(Date.now() + 1000 * 60 * 30) // 30 min from now
      },
      {
        id: 'auto_3',
        task: 'Scheduled quarterly review meetings',
        status: 'SCHEDULED' as const,
        nextExecution: new Date(Date.now() + 1000 * 60 * 60 * 2) // 2 hours from now
      }
    ],
    decisionsRequired: [
      {
        id: 'decision_1',
        decision: 'Accept Modified Terms for Series B Deal',
        context: 'TechStartup Alpha has proposed modified liquidation preference terms. AI analysis suggests this reduces your IRR by 0.8% but improves exit probability by 15%.',
        options: [
          {
            option: 'Accept modified terms',
            pros: ['Higher exit probability', 'Maintains good relationship', 'Still above target returns'],
            cons: ['Slightly lower IRR', 'Sets precedent for future negotiations'],
            recommendation: true,
            confidence: 0.78
          },
          {
            option: 'Counter with alternative terms',
            pros: ['Potentially better terms', 'Shows negotiation strength'],
            cons: ['Risk of deal breakdown', 'May damage relationship', 'Delays closing'],
            recommendation: false,
            confidence: 0.22
          }
        ],
        deadline: new Date(Date.now() + 1000 * 60 * 60 * 48), // 48 hours from now
        impact: 'HIGH' as const
      }
    ],
    performanceSummary: {
      efficiency: 87,
      accuracy: 94,
      timesSaved: 12.5, // hours per week
      automationRate: 73, // percentage of tasks automated
      userSatisfaction: 91
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
      'LOW': 'bg-green-100 text-green-800',
      'MEDIUM': 'bg-yellow-100 text-yellow-800',
      'HIGH': 'bg-orange-100 text-orange-800',
      'CRITICAL': 'bg-red-100 text-red-800'
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
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Header with AI Status */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Good morning! Your AI assistant is managing {autonomousData.automatedTasks.length} tasks.
              </h1>
              <p className="text-gray-600">
                {autonomousData.priorityActions.length} priority actions need your attention. 
                Everything else is handled automatically.
              </p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-5 w-5 text-purple-600" />
                <span className="font-semibold text-purple-700">AI Active</span>
              </div>
              <Badge className="bg-green-100 text-green-800">
                {autonomousData.performanceSummary.efficiency}% efficiency
              </Badge>
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
                Priority Actions ({autonomousData.priorityActions.length})
              </CardTitle>
              <CardDescription>
                These require your decision or review
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
              <Card key={action.id} className="border-l-4 border-l-orange-500">
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
                      
                      {expandedActions.has(action.id) && (
                        <div className="bg-gray-50 p-3 rounded-lg mb-3">
                          <h4 className="font-medium mb-2">Additional Context:</h4>
                          <ul className="text-sm text-gray-600 space-y-1">
                            <li>• Based on analysis of similar deals in your portfolio</li>
                            <li>• Automated pre-screening completed with 94% confidence</li>
                            <li>• Timeline optimized to meet your quarterly goals</li>
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
                          Take Action
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
                            <Zap className="h-4 w-4 mr-1" />
                            Auto-Execute
                          </Button>
                        )}
                      </div>
                    </div>
                    <div className="ml-4">
                      {action.type === 'REVIEW_REQUIRED' && <FileText className="h-6 w-6 text-orange-600" />}
                      {action.type === 'APPROVAL_NEEDED' && <CheckCircle className="h-6 w-6 text-blue-600" />}
                      {action.type === 'FOLLOW_UP' && <MessageSquare className="h-6 w-6 text-purple-600" />}
                      {action.type === 'DEADLINE_APPROACHING' && <AlertTriangle className="h-6 w-6 text-red-600" />}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Decisions Required */}
      {autonomousData.decisionsRequired.length > 0 && (
        <Card className="border-yellow-200 bg-yellow-50/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-800">
              <AlertTriangle className="h-5 w-5" />
              Strategic Decision Required
            </CardTitle>
            <CardDescription className="text-yellow-700">
              AI analysis complete - your decision needed for deal progression
            </CardDescription>
          </CardHeader>
          <CardContent>
            {autonomousData.decisionsRequired.map((decision) => (
              <div key={decision.id} className="bg-white p-4 rounded-lg">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold mb-2">{decision.decision}</h3>
                    <p className="text-sm text-gray-600 mb-3">{decision.context}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>Impact: {decision.impact}</span>
                      <span>Deadline: {formatDate(decision.deadline)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                  {decision.options.map((option, index) => (
                    <Card key={index} className={option.recommendation ? 'border-green-200 bg-green-50' : ''}>
                      <CardContent className="p-3">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-sm">{option.option}</h4>
                          {option.recommendation && (
                            <Badge className="bg-green-100 text-green-800">Recommended</Badge>
                          )}
                        </div>
                        <div className="space-y-2 text-xs">
                          <div>
                            <span className="font-medium text-green-700">Pros:</span>
                            <ul className="list-disc list-inside text-gray-600 mt-1">
                              {option.pros.map((pro, i) => <li key={i}>{pro}</li>)}
                            </ul>
                          </div>
                          <div>
                            <span className="font-medium text-red-700">Cons:</span>
                            <ul className="list-disc list-inside text-gray-600 mt-1">
                              {option.cons.map((con, i) => <li key={i}>{con}</li>)}
                            </ul>
                          </div>
                          <div className="pt-2 border-t">
                            <span className="text-gray-500">
                              AI Confidence: {Math.round(option.confidence * 100)}%
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                
                <div className="flex items-center gap-2">
                  <Button onClick={() => onRequireDecision(decision)}>
                    <ThumbsUp className="h-4 w-4 mr-1" />
                    Accept Recommendation
                  </Button>
                  <Button variant="outline">
                    <Eye className="h-4 w-4 mr-1" />
                    Review Details
                  </Button>
                  <Button variant="outline">
                    <MessageSquare className="h-4 w-4 mr-1" />
                    Request Analysis
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Automated Tasks Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-blue-600" />
              Automated Tasks
            </CardTitle>
            <CardDescription>What your AI assistant has been working on</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {autonomousData.automatedTasks.map((task) => (
                <div key={task.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="mt-0.5">
                    {getStatusIcon(task.status)}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{task.task}</p>
                    <div className="flex items-center gap-3 mt-1 text-xs text-gray-600">
                      <span className="capitalize">{task.status.replace('_', ' ')}</span>
                      {task.completedAt && (
                        <span>Completed: {formatDate(task.completedAt)}</span>
                      )}
                      {task.nextExecution && (
                        <span>Next: {formatDate(task.nextExecution)}</span>
                      )}
                    </div>
                    {task.result && (
                      <p className="text-xs text-green-600 mt-1">{task.result}</p>
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
              <TrendingUp className="h-5 w-5 text-green-600" />
              Performance Summary
            </CardTitle>
            <CardDescription>How AI is improving your workflow</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Efficiency Score</span>
                  <span className="text-sm text-gray-600">{autonomousData.performanceSummary.efficiency}%</span>
                </div>
                <Progress value={autonomousData.performanceSummary.efficiency} className="h-2" />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">AI Accuracy</span>
                  <span className="text-sm text-gray-600">{autonomousData.performanceSummary.accuracy}%</span>
                </div>
                <Progress value={autonomousData.performanceSummary.accuracy} className="h-2" />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Tasks Automated</span>
                  <span className="text-sm text-gray-600">{autonomousData.performanceSummary.automationRate}%</span>
                </div>
                <Progress value={autonomousData.performanceSummary.automationRate} className="h-2" />
              </div>
              
              <div className="pt-3 border-t space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Time Saved</span>
                  <span className="text-sm font-medium text-green-600">
                    {autonomousData.performanceSummary.timesSaved}h/week
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Satisfaction</span>
                  <span className="text-sm font-medium text-blue-600">
                    {autonomousData.performanceSummary.userSatisfaction}%
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">{data.companies.length}</div>
            <div className="text-sm text-gray-600">Companies</div>
            <div className="text-xs text-green-600 mt-1">All verified ✓</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{data.metrics.activeSubmissions}</div>
            <div className="text-sm text-gray-600">Active Deals</div>
            <div className="text-xs text-orange-600 mt-1">3 need attention</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{Math.round(data.metrics.successRate * 100)}%</div>
            <div className="text-sm text-gray-600">Success Rate</div>
            <div className="text-xs text-green-600 mt-1">Above target</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">{autonomousData.performanceSummary.timesSaved}</div>
            <div className="text-sm text-gray-600">Hours Saved</div>
            <div className="text-xs text-blue-600 mt-1">This week</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default GPAutonomousDashboard;