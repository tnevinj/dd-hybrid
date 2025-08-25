'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { 
  TrendingUp,
  DollarSign,
  Users,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
  Search,
  Plus,
  Filter,
  Zap,
  Brain,
  BarChart3,
  Target,
  FileText,
  Lightbulb
} from 'lucide-react';
import { useDealStructuring } from '@/hooks/use-deal-structuring';
import { DealStructuringProject, AIRecommendation } from '@/types/deal-structuring';

const DealStructuringAssisted: React.FC = () => {
  const { metrics, deals, activities, deadlines, isLoading, error } = useDealStructuring();
  const [searchTerm, setSearchTerm] = useState('');

  const formatCurrency = (amount: number) => {
    return `$${(amount / 1000000).toFixed(1)}M`;
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const getRiskBadgeVariant = (risk: string) => {
    switch (risk) {
      case 'high': return 'destructive';
      case 'medium': return 'secondary'; 
      case 'low': return 'default';
      default: return 'outline';
    }
  };

  const getRecommendationIcon = (type: string) => {
    switch (type) {
      case 'suggestion': return <Lightbulb className="h-4 w-4 text-yellow-500" />;
      case 'automation': return <Zap className="h-4 w-4 text-blue-500" />;
      case 'insight': return <BarChart3 className="h-4 w-4 text-green-500" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default: return <Brain className="h-4 w-4 text-blue-500" />;
    }
  };

  const executeAIAction = (action: string, params?: Record<string, any>) => {
    console.log('Executing AI action:', action, params);
    // TODO: Implement AI action execution
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Action Bar */}
      <div className="flex justify-end items-center">
        <div className="flex gap-2">
          <Button variant="outline">
            <Brain className="h-4 w-4 mr-2" />
            AI Insights
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Deal Structure
          </Button>
        </div>
      </div>

      {/* AI Insights Panel */}
      <Card className="border-l-4 border-l-blue-500 bg-blue-50/50">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-blue-900">AI Assistant Insights</h2>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Pattern Recognition */}
            <Card className="border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="h-4 w-4 text-blue-600" />
                  <h3 className="font-semibold text-sm">Pattern Recognition</h3>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  TechCorp deal is 87% similar to CloudCo (successful exit).
                </p>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => executeAIAction('APPLY_TEMPLATE')}>
                    Use Template
                  </Button>
                  <Button size="sm" variant="ghost">
                    Compare
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Automation Opportunities */}
            <Card className="border-green-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="h-4 w-4 text-green-600" />
                  <h3 className="font-semibold text-sm">Automation Available</h3>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  I can automate 8 routine tasks across active deals.
                </p>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => executeAIAction('SHOW_AUTOMATION')}>
                    Review Tasks
                  </Button>
                  <Button size="sm" variant="ghost">
                    Auto-Execute
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Risk Analysis */}
            <Card className="border-amber-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-4 w-4 text-amber-600" />
                  <h3 className="font-semibold text-sm">Risk Alert</h3>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  HealthTech leverage ratio exceeds typical limits for sector.
                </p>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => executeAIAction('ANALYZE_RISK')}>
                    Deep Dive
                  </Button>
                  <Button size="sm" variant="ghost">
                    Scenarios
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Deals</p>
                <p className="text-2xl font-bold text-gray-900">{metrics?.activeDeals || 0}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {deals.filter(d => d.stage === 'STRUCTURING').length} in structuring
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">AI Time Saved</p>
                <p className="text-2xl font-bold text-gray-900">24h</p>
                <p className="text-xs text-gray-500 mt-1">This week</p>
              </div>
              <Zap className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Recommendations</p>
                <p className="text-2xl font-bold text-gray-900">12</p>
                <p className="text-xs text-gray-500 mt-1">5 high priority</p>
              </div>
              <Brain className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Automation Rate</p>
                <p className="text-2xl font-bold text-gray-900">67%</p>
                <p className="text-xs text-gray-500 mt-1">Of routine tasks</p>
              </div>
              <Target className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Deals Section */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Active Deals</h2>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <Input
                      placeholder="Search deals..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-64"
                    />
                  </div>
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {deals.map((deal) => (
                <Card key={deal.id} className="border-l-4 border-l-blue-500">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{deal.name}</h3>
                        <p className="text-sm text-gray-600">
                          {deal.type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} • {formatCurrency(deal.targetValue)}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Badge variant={getRiskBadgeVariant(deal.riskLevel)}>
                          {deal.riskLevel} risk
                        </Badge>
                        <Badge variant="outline">
                          {deal.stage.replace(/_/g, ' ')}
                        </Badge>
                      </div>
                    </div>

                    {/* AI Recommendations for this deal */}
                    {deal.aiRecommendations && deal.aiRecommendations.length > 0 && (
                      <div className="mb-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="flex items-center gap-2 mb-2">
                          <Brain className="h-4 w-4 text-blue-600" />
                          <span className="text-sm font-medium text-blue-900">AI Insights</span>
                        </div>
                        {deal.aiRecommendations.slice(0, 1).map((rec) => (
                          <div key={rec.id} className="flex items-start gap-2">
                            {getRecommendationIcon(rec.type)}
                            <div className="flex-1">
                              <p className="text-sm font-medium text-blue-900">{rec.title}</p>
                              <p className="text-xs text-blue-700">{rec.description}</p>
                              <div className="flex gap-2 mt-2">
                                {rec.actions.map((action, idx) => (
                                  <Button 
                                    key={idx}
                                    size="sm" 
                                    variant="outline"
                                    onClick={() => executeAIAction(action.action, action.params)}
                                    className="h-6 text-xs"
                                  >
                                    {action.label}
                                  </Button>
                                ))}
                              </div>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {Math.round(rec.confidence * 100)}% confident
                            </Badge>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="mb-3">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Progress</span>
                        <span>{deal.progress}%</span>
                      </div>
                      <Progress value={deal.progress} className="h-2" />
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3 text-sm">
                      <div>
                        <p className="font-medium text-gray-600">IRR</p>
                        <p className="text-gray-900">
                          {deal.keyMetrics.irr ? formatPercentage(deal.keyMetrics.irr) : 'N/A'}
                        </p>
                      </div>
                      <div>
                        <p className="font-medium text-gray-600">Multiple</p>
                        <p className="text-gray-900">
                          {deal.keyMetrics.multiple ? `${deal.keyMetrics.multiple.toFixed(1)}x` : 'N/A'}
                        </p>
                      </div>
                      <div>
                        <p className="font-medium text-gray-600">Team</p>
                        <p className="text-gray-900 flex items-center">
                          <Users className="h-3 w-3 mr-1" />
                          {deal.team.length}
                        </p>
                      </div>
                      <div>
                        <p className="font-medium text-gray-600">Next Milestone</p>
                        <p className="text-gray-900 truncate">{deal.nextMilestone || 'TBD'}</p>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <p className="text-xs text-gray-500">
                        Updated {deal.lastUpdated.toLocaleDateString()}
                      </p>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">
                          <Zap className="h-3 w-3 mr-1" />
                          Auto-Tasks
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => window.location.href = `/deal-structuring/${deal.id}`}
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* AI Suggested Actions */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Lightbulb className="h-4 w-4 text-yellow-500" />
                <h3 className="text-lg font-semibold">Suggested Actions</h3>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium">Generate DD Report</span>
                </div>
                <p className="text-xs text-gray-600 mb-2">
                  Auto-draft for TechCorp based on completed analysis
                </p>
                <Button size="sm" className="h-6 text-xs">
                  Generate Now
                </Button>
              </div>

              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center gap-2 mb-1">
                  <BarChart3 className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium">Update Models</span>
                </div>
                <p className="text-xs text-gray-600 mb-2">
                  Refresh DCF with latest market data
                </p>
                <Button size="sm" variant="outline" className="h-6 text-xs">
                  Review Changes
                </Button>
              </div>

              <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                <div className="flex items-center gap-2 mb-1">
                  <Calendar className="h-4 w-4 text-amber-600" />
                  <span className="text-sm font-medium">Schedule Meetings</span>
                </div>
                <p className="text-xs text-gray-600 mb-2">
                  IC prep meetings for 3 deals
                </p>
                <Button size="sm" variant="outline" className="h-6 text-xs">
                  Schedule All
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activities */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Recent Activities</h3>
            </CardHeader>
            <CardContent className="space-y-3">
              {activities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3">
                  <div className="flex gap-1">
                    {activity.status === 'completed' && <CheckCircle className="h-4 w-4 text-green-500" />}
                    {activity.status === 'in_progress' && <Clock className="h-4 w-4 text-yellow-500" />}
                    {activity.status === 'pending' && <AlertTriangle className="h-4 w-4 text-red-500" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {activity.title}
                    </p>
                    <p className="text-xs text-gray-500">
                      {activity.deal} • {activity.user}
                    </p>
                  </div>
                  <p className="text-xs text-gray-400">
                    {activity.date.toLocaleDateString()}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DealStructuringAssisted;