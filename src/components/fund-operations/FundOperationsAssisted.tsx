'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  DollarSign,
  TrendingUp,
  Users,
  Calendar,
  BarChart3,
  CreditCard,
  Banknote,
  Calculator,
  FileText,
  Eye,
  Edit,
  Send,
  Plus,
  Download,
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
  ThumbsDown
} from 'lucide-react';
import { formatCurrency, formatPercentage, formatDate } from '@/lib/utils';

interface FundOperationsAssistedProps {
  fundOperationsData: any;
  funds: any[];
  aiRecommendations: any[];
  metrics: any;
  isLoading: boolean;
  onCreateCapitalCall: () => void;
  onViewFund: (id: string) => void;
  onProcessDistribution: () => void;
  onExecuteAIAction: (actionId: string) => void;
  onDismissRecommendation: (id: string) => void;
}

export function FundOperationsAssisted({
  fundOperationsData,
  funds,
  aiRecommendations,
  metrics,
  isLoading,
  onCreateCapitalCall,
  onViewFund,
  onProcessDistribution,
  onExecuteAIAction,
  onDismissRecommendation
}: FundOperationsAssistedProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedFund, setSelectedFund] = useState((funds && funds[0]?.id) || '');
  const [showAIPanel, setShowAIPanel] = useState(true);
  const [dismissedSuggestions, setDismissedSuggestions] = useState<Set<string>>(new Set());

  const currentFund = funds?.find(f => f.id === selectedFund);
  const activeSuggestions = (aiRecommendations || []).filter(r => !dismissedSuggestions.has(r.id));

  const handleAcceptRecommendation = (recommendation: any) => {
    onExecuteAIAction(recommendation.actions[0]?.action || recommendation.id);
    setDismissedSuggestions(prev => new Set([...prev, recommendation.id]));
  };

  const handleDismissRecommendation = (recommendationId: string) => {
    setDismissedSuggestions(prev => new Set([...prev, recommendationId]));
    onDismissRecommendation(recommendationId);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mb-4"></div>
          <p className="text-gray-600">Loading fund operations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
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
            <p className="text-blue-700 text-sm">
              Your AI assistant has identified {activeSuggestions.length} opportunities to optimize fund operations
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Active Recommendations */}
              <div>
                <h4 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                  <Lightbulb className="h-4 w-4" />
                  Smart Recommendations ({activeSuggestions.length})
                </h4>
                <div className="space-y-2">
                  {activeSuggestions.slice(0, 2).map((recommendation, index) => (
                    <div key={index} className="bg-white p-3 rounded-lg border">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <p className="font-medium text-sm">{recommendation.title}</p>
                          <p className="text-xs text-gray-600 mt-1">{recommendation.description}</p>
                        </div>
                        <Badge 
                          variant={recommendation.priority === 'high' ? 'destructive' : recommendation.priority === 'medium' ? 'default' : 'secondary'}
                          className="text-xs ml-2"
                        >
                          {recommendation.priority.toUpperCase()}
                        </Badge>
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
                            onClick={() => handleDismissRecommendation(recommendation.id)}
                          >
                            <XCircle className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Automation Opportunities */}
              <div>
                <h4 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  Automation Available
                </h4>
                <div className="space-y-2">
                  <div className="bg-white p-3 rounded-lg border">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <p className="font-medium text-sm">Auto-generate LP reports</p>
                        <div className="flex items-center gap-3 mt-1 text-xs text-gray-600">
                          <span>Saves: 4 hours</span>
                          <span>Accuracy: +15%</span>
                        </div>
                      </div>
                    </div>
                    <Button 
                      size="sm" 
                      className="h-7 text-xs w-full"
                      onClick={() => onExecuteAIAction('AUTO_GENERATE_LP_REPORTS')}
                    >
                      <Sparkles className="h-3 w-3 mr-1" />
                      Enable Automation
                    </Button>
                  </div>
                  
                  <div className="bg-white p-3 rounded-lg border">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <p className="font-medium text-sm">Smart distribution timing</p>
                        <div className="flex items-center gap-3 mt-1 text-xs text-gray-600">
                          <span>Optimizes: Tax efficiency</span>
                          <span>Impact: +3% returns</span>
                        </div>
                      </div>
                    </div>
                    <Button 
                      size="sm" 
                      className="h-7 text-xs w-full"
                      onClick={() => onExecuteAIAction('OPTIMIZE_DISTRIBUTION_TIMING')}
                    >
                      <Target className="h-3 w-3 mr-1" />
                      Enable Smart Timing
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick AI Insights */}
            <div className="mt-4 pt-4 border-t border-blue-200">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="bg-white p-3 rounded-lg border text-center">
                  <TrendingUp className="h-6 w-6 text-green-600 mx-auto mb-1" />
                  <p className="text-xs font-medium">Efficiency Gains</p>
                  <p className="text-xs text-gray-600">+{metrics.aiEfficiencyGains}% this month</p>
                </div>
                <div className="bg-white p-3 rounded-lg border text-center">
                  <Clock className="h-6 w-6 text-blue-600 mx-auto mb-1" />
                  <p className="text-xs font-medium">Time Saved</p>
                  <p className="text-xs text-gray-600">8.5 hours/week</p>
                </div>
                <div className="bg-white p-3 rounded-lg border text-center">
                  <Target className="h-6 w-6 text-blue-600 mx-auto mb-1" />
                  <p className="text-xs font-medium">Accuracy Rate</p>
                  <p className="text-xs text-gray-600">98.2%</p>
                </div>
                <div className="bg-white p-3 rounded-lg border text-center">
                  <CheckCircle className="h-6 w-6 text-emerald-600 mx-auto mb-1" />
                  <p className="text-xs font-medium">Auto Actions</p>
                  <p className="text-xs text-gray-600">12 completed</p>
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
          Show AI Assistant ({activeSuggestions.length} recommendations available)
        </Button>
      )}

      {/* Overview KPI Cards with AI Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="relative">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Commitments</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(metrics.totalCommitments)}
                </p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-sm text-gray-600">
                Across {metrics.totalFunds} funds
              </span>
              <Badge variant="outline" className="bg-blue-50 text-blue-700 text-xs">
                <Bot className="h-3 w-3 mr-1" />
                AI Enhanced
              </Badge>
            </div>
          </CardContent>
          <div className="absolute top-2 right-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
          </div>
        </Card>

        <Card className="relative">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Capital Called</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(metrics.totalCalled)}
                </p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CreditCard className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-sm text-gray-600">
                {formatPercentage((metrics.totalCalled / metrics.totalCommitments) * 100)} called
              </span>
              <span className="text-xs text-green-600">💡 Optimized timing</span>
            </div>
          </CardContent>
        </Card>

        <Card className="relative">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Current NAV</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(metrics.currentNAV)}
                </p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Calculator className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center">
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600">
                  {formatPercentage(metrics.avgNetIRR)} Avg Net IRR
                </span>
              </div>
              <span className="text-xs text-blue-600">🎯 AI Optimized</span>
            </div>
          </CardContent>
        </Card>

        <Card className="relative">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Distributed</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(metrics.totalDistributed)}
                </p>
              </div>
              <div className="h-12 w-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                <Banknote className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-sm text-gray-600">
                Active funds: {metrics.activeFunds}
              </span>
              <span className="text-xs text-emerald-600">⚡ Auto-processed</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Fund Selector with AI Recommendations */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium text-gray-700">Selected Fund:</label>
          <select
            value={selectedFund}
            onChange={(e) => setSelectedFund(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {(funds || []).map(fund => (
              <option key={fund.id} value={fund.id}>
                {fund.name} (Vintage {fund.vintage})
              </option>
            ))}
          </select>
          {activeSuggestions.some(rec => rec.title.toLowerCase().includes('capital call')) && (
            <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
              <Lightbulb className="h-3 w-3 mr-1" />
              AI Suggests Timing Optimization
            </Badge>
          )}
        </div>
        
        <div className="flex space-x-3">
          <Button onClick={onCreateCapitalCall}>
            <Plus className="h-4 w-4 mr-2" />
            New Capital Call
          </Button>
          <Button variant="outline" onClick={onProcessDistribution}>
            <Send className="h-4 w-4 mr-2" />
            Process Distribution
          </Button>
        </div>
      </div>

      {/* AI-Enhanced Fund Details */}
      {currentFund && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">Fund Overview</h3>
                <div className="flex items-center gap-2">
                  <Badge variant="default">{currentFund.status}</Badge>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 text-xs">
                    <Bot className="h-3 w-3 mr-1" />
                    AI Monitored
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Target Size</span>
                  <span className="text-sm font-medium">{formatCurrency(currentFund.targetSize)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Commitments</span>
                  <div className="text-right">
                    <span className="text-sm font-medium">{formatCurrency(currentFund.commitments)}</span>
                    {activeSuggestions.some(rec => rec.type === 'optimization') && (
                      <p className="text-xs text-blue-600">💡 Optimization available</p>
                    )}
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Called</span>
                  <span className="text-sm font-medium">{formatCurrency(currentFund.called)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Deployed</span>
                  <span className="text-sm font-medium">{formatCurrency(currentFund.deployed)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">Performance</h3>
                <Badge variant="outline" className="bg-green-50 text-green-700 text-xs">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Above Benchmark
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Current NAV</span>
                  <span className="text-sm font-medium">{formatCurrency(currentFund.nav)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Net IRR</span>
                  <div className="text-right">
                    <span className="text-sm font-medium text-green-600">15.8%</span>
                    <p className="text-xs text-blue-600">🎯 AI predicted: 16.2%</p>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Net MOIC</span>
                  <span className="text-sm font-medium">1.42x</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">DPI</span>
                  <span className="text-sm font-medium">0.28x</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">AI Insights</h3>
                <Badge variant="outline" className="bg-blue-50 text-blue-700 text-xs">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Smart Analysis
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2 mb-1">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium text-green-800">Optimal Performance</span>
                  </div>
                  <p className="text-xs text-green-700">
                    Fund is tracking 12% above sector benchmark. AI suggests maintaining current allocation strategy.
                  </p>
                </div>
                
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-2 mb-1">
                    <Lightbulb className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-800">Next Action</span>
                  </div>
                  <p className="text-xs text-blue-700">
                    Consider capital call in 2-3 weeks based on deployment schedule analysis.
                  </p>
                  <Button size="sm" className="mt-2 h-6 text-xs">
                    Schedule
                  </Button>
                </div>
                
                <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                  <div className="flex items-center gap-2 mb-1">
                    <AlertTriangle className="h-4 w-4 text-amber-600" />
                    <span className="text-sm font-medium text-amber-800">Attention Needed</span>
                  </div>
                  <p className="text-xs text-amber-700">
                    2 LP commitments require attention for upcoming capital call.
                  </p>
                  <Button size="sm" variant="outline" className="mt-2 h-6 text-xs">
                    Review
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Enhanced Tabs with AI Indicators */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview" className="relative">
            Overview
            {activeSuggestions.some(s => s.type === 'optimization') && (
              <div className="absolute -top-1 -right-1 h-2 w-2 bg-blue-500 rounded-full" />
            )}
          </TabsTrigger>
          <TabsTrigger value="capital-calls" className="relative">
            Capital Calls
            {activeSuggestions.some(s => s.title.toLowerCase().includes('capital call')) && (
              <div className="absolute -top-1 -right-1 h-2 w-2 bg-blue-500 rounded-full" />
            )}
          </TabsTrigger>
          <TabsTrigger value="distributions" className="relative">
            Distributions
            {activeSuggestions.some(s => s.type === 'automation') && (
              <div className="absolute -top-1 -right-1 h-2 w-2 bg-blue-500 rounded-full" />
            )}
          </TabsTrigger>
          <TabsTrigger value="nav-reports">NAV Reports</TabsTrigger>
          <TabsTrigger value="ai-insights">
            <Sparkles className="h-4 w-4 mr-1" />
            AI Insights
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* AI-Enhanced Overview Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 mr-2" />
                    Recent Activities
                  </div>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700">
                    <Bot className="h-3 w-3 mr-1" />
                    AI Enhanced
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { type: 'Capital Call', description: 'Growth Fund IV - Call #5 issued', amount: '$35M', date: '2024-03-20', status: 'Issued', aiNote: 'Optimal timing detected' },
                    { type: 'Distribution', description: 'Tech Fund III - Exit proceeds', amount: '$52M', date: '2024-03-18', status: 'Paid', aiNote: 'Tax-optimized' },
                    { type: 'NAV Report', description: 'Q1 2024 NAV finalized', amount: '$415M', date: '2024-03-15', status: 'Published', aiNote: 'Auto-validated' },
                    { type: 'Expense', description: 'Legal fees - Portfolio support', amount: '$85K', date: '2024-03-12', status: 'Approved', aiNote: 'Within budget' }
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{activity.type}</h4>
                        <p className="text-sm text-gray-600">{activity.description}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <p className="text-xs text-gray-500">{activity.date}</p>
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 text-xs">
                            <Bot className="h-3 w-3 mr-1" />
                            {activity.aiNote}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-sm">{activity.amount}</p>
                        <Badge variant={activity.status === 'Paid' ? 'default' : 'secondary'} className="text-xs">
                          {activity.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  AI Fund Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {(funds || []).map((fund, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{fund.name}</h4>
                        <p className="text-xs text-gray-600">Vintage {fund.vintage} • {fund.status}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="bg-green-50 text-green-700 text-xs">
                            <TrendingUp className="h-3 w-3 mr-1" />
                            Above benchmark
                          </Badge>
                          <span className="text-xs text-blue-600">AI Score: 8.{index + 2}/10</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{formatCurrency(fund.nav)}</p>
                        <p className="text-xs text-gray-600">NAV</p>
                      </div>
                      <Button size="sm" variant="outline" onClick={() => onViewFund(fund.id)} className="ml-2">
                        <Eye className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="capital-calls" className="space-y-6">
          <EnhancedCapitalCallsTable fundId={selectedFund} />
        </TabsContent>

        <TabsContent value="distributions" className="space-y-6">
          <EnhancedDistributionsTable fundId={selectedFund} />
        </TabsContent>

        <TabsContent value="nav-reports" className="space-y-6">
          <EnhancedNAVReportsTable fundId={selectedFund} />
        </TabsContent>

        <TabsContent value="ai-insights" className="space-y-6">
          <AIInsightsDashboard recommendations={activeSuggestions} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Enhanced sub-components with AI features
function EnhancedCapitalCallsTable({ fundId }: { fundId: string }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <CreditCard className="h-5 w-5 mr-2" />
            Capital Calls
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-blue-50 text-blue-700">
              <Bot className="h-3 w-3 mr-1" />
              AI Optimized Timing
            </Badge>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Capital Call
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {[
            { callNumber: 5, amount: 35000000, dueDate: '2024-04-15', status: 'Issued', purpose: 'New Investments', funded: 30000000, aiInsight: 'Optimal timing for LP liquidity' },
            { callNumber: 4, amount: 40000000, dueDate: '2024-01-15', status: 'Funded', purpose: 'Follow-on Investments', funded: 40000000, aiInsight: 'Fully subscribed as predicted' },
            { callNumber: 3, amount: 25000000, dueDate: '2023-10-15', status: 'Funded', purpose: 'Management Fee', funded: 25000000, aiInsight: 'Standard processing' }
          ].map((call, index) => (
            <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
              <div className="flex-1">
                <div className="flex items-center space-x-4">
                  <h4 className="font-semibold">Call #{call.callNumber}</h4>
                  <Badge variant={call.status === 'Funded' ? 'default' : 'secondary'}>
                    {call.status}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 mt-1">{call.purpose} • Due: {call.dueDate}</p>
                <Badge variant="outline" className="bg-blue-50 text-blue-700 text-xs mt-1">
                  <Lightbulb className="h-3 w-3 mr-1" />
                  {call.aiInsight}
                </Badge>
              </div>
              <div className="text-right">
                <p className="font-semibold">{formatCurrency(call.amount)}</p>
                <p className="text-sm text-gray-600">
                  Funded: {formatCurrency(call.funded)} ({formatPercentage((call.funded / call.amount) * 100)})
                </p>
              </div>
              <div className="flex space-x-2 ml-4">
                <Button size="sm" variant="outline">
                  <Eye className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="outline">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function EnhancedDistributionsTable({ fundId }: { fundId: string }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <Banknote className="h-5 w-5 mr-2" />
            Distributions
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-green-50 text-green-700">
              <Target className="h-3 w-3 mr-1" />
              Tax Optimized
            </Badge>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Process Distribution
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {[
            { distNumber: 12, amount: 52000000, date: '2024-03-18', source: 'TechCorp Exit', type: 'Capital Gains', status: 'Paid', aiInsight: 'Tax-optimized timing saved $2.1M' },
            { distNumber: 11, amount: 18000000, date: '2024-01-20', source: 'Dividend Income', type: 'Income', status: 'Paid', aiInsight: 'Automated processing completed' },
            { distNumber: 10, amount: 38000000, date: '2023-11-15', source: 'HealthTech Sale', type: 'Capital Gains', status: 'Paid', aiInsight: 'Optimal market timing' }
          ].map((dist, index) => (
            <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
              <div className="flex-1">
                <div className="flex items-center space-x-4">
                  <h4 className="font-semibold">Distribution #{dist.distNumber}</h4>
                  <Badge variant="default">{dist.status}</Badge>
                </div>
                <p className="text-sm text-gray-600 mt-1">{dist.source} • {dist.type}</p>
                <Badge variant="outline" className="bg-green-50 text-green-700 text-xs mt-1">
                  <Sparkles className="h-3 w-3 mr-1" />
                  {dist.aiInsight}
                </Badge>
              </div>
              <div className="text-right">
                <p className="font-semibold">{formatCurrency(dist.amount)}</p>
                <p className="text-sm text-gray-600">{dist.date}</p>
              </div>
              <div className="flex space-x-2 ml-4">
                <Button size="sm" variant="outline">
                  <Eye className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="outline">
                  <FileText className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function EnhancedNAVReportsTable({ fundId }: { fundId: string }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <Calculator className="h-5 w-5 mr-2" />
            NAV Reports
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-blue-50 text-blue-700">
              <CheckCircle className="h-3 w-3 mr-1" />
              AI Validated
            </Badge>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Generate NAV Report
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {[
            { period: 'Q1 2024', nav: 315000000, reportDate: '2024-03-31', status: 'Published', returns: 8.2, aiInsight: 'Valuations validated, no adjustments needed' },
            { period: 'Q4 2023', nav: 291000000, reportDate: '2023-12-31', status: 'Published', returns: 11.8, aiInsight: 'Strong performance confirmed' },
            { period: 'Q3 2023', nav: 260000000, reportDate: '2023-09-30', status: 'Published', returns: 4.5, aiInsight: 'Market corrections applied' }
          ].map((report, index) => (
            <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
              <div className="flex-1">
                <h4 className="font-semibold">{report.period} NAV Report</h4>
                <p className="text-sm text-gray-600 mt-1">Report Date: {report.reportDate}</p>
                <Badge variant="outline" className="bg-blue-50 text-blue-700 text-xs mt-1">
                  <Bot className="h-3 w-3 mr-1" />
                  {report.aiInsight}
                </Badge>
              </div>
              <div className="text-right">
                <p className="font-semibold">{formatCurrency(report.nav)}</p>
                <p className="text-sm text-green-600">+{formatPercentage(report.returns)} QTD</p>
              </div>
              <div className="flex items-center space-x-2 ml-4">
                <Badge variant="default">{report.status}</Badge>
                <Button size="sm" variant="outline">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function AIInsightsDashboard({ recommendations }: { recommendations: any[] }) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-blue-500" />
            All AI Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recommendations.map((recommendation, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium">{recommendation.title}</h4>
                      <Badge 
                        variant={
                          recommendation.priority === 'high' ? 'destructive' : 
                          recommendation.priority === 'medium' ? 'default' : 'secondary'
                        }
                      >
                        {recommendation.priority.toUpperCase()}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{recommendation.description}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>Type: {recommendation.type}</span>
                      <span>Confidence: {Math.round(recommendation.confidence * 100)}%</span>
                      {recommendation.estimatedImpact && (
                        <span>Impact: {recommendation.estimatedImpact}</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm">
                    <ThumbsUp className="h-3 w-3 mr-1" />
                    Accept
                  </Button>
                  <Button size="sm" variant="outline">
                    <ThumbsDown className="h-3 w-3 mr-1" />
                    Dismiss
                  </Button>
                  <Button size="sm" variant="ghost">
                    Learn More
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default FundOperationsAssisted;