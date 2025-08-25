'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ScatterChart,
  Scatter
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  Target,
  DollarSign,
  Calendar,
  Brain,
  AlertCircle,
  CheckCircle,
  Clock,
  Zap,
  BarChart3,
  PieChart as PieChartIcon,
  Activity,
  Lightbulb,
  RefreshCw,
  Download,
  Share,
  Filter
} from 'lucide-react';
import type { ExitMetricsResponse } from '@/types/exits';

interface ExitAnalyticsDashboardProps {
  mode?: 'traditional' | 'assisted' | 'autonomous';
}

export function ExitAnalyticsDashboard({ mode = 'traditional' }: ExitAnalyticsDashboardProps) {
  const [metrics, setMetrics] = useState<ExitMetricsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTimeframe, setSelectedTimeframe] = useState('12m');
  const [selectedAnalysis, setSelectedAnalysis] = useState('overview');

  useEffect(() => {
    loadAnalytics();
  }, [selectedTimeframe]);

  const loadAnalytics = async () => {
    try {
      // Mock comprehensive analytics data
      const mockMetrics: ExitMetricsResponse = {
        pipeline_metrics: {
          total_opportunities: 15,
          total_pipeline_value: 450000000, // $450M in cents
          average_ai_score: 7.8,
          active_insights: 42,
          optimal_timing_count: 6,
          by_stage: {
            'not-started': 2,
            'planning': 4,
            'preparation': 6,
            'execution': 2,
            'completed': 1
          },
          by_strategy: {
            'ipo': 3,
            'strategic-sale': 7,
            'secondary-sale': 2,
            'management-buyout': 2,
            'other': 1
          },
          by_market_conditions: {
            'excellent': 6,
            'good': 5,
            'fair': 3,
            'poor': 1
          }
        },
        process_metrics: {
          total_processes: 45,
          completed_processes: 28,
          overdue_processes: 3,
          average_completion_time: 12.5,
          automation_rate: 0.68,
          quality_score: 8.7
        },
        task_metrics: {
          total_tasks: 234,
          completed_tasks: 156,
          overdue_tasks: 12,
          by_priority: {
            'low': 89,
            'medium': 98,
            'high': 47
          },
          by_status: {
            'pending': 45,
            'in-progress': 33,
            'completed': 156
          },
          by_category: {
            'financial': 67,
            'legal': 45,
            'operational': 56,
            'marketing': 34,
            'strategic': 32
          },
          automation_eligible: 89
        },
        market_metrics: {
          favorable_conditions: 11,
          average_timing_score: 7.2,
          total_market_intelligence: 15
        }
      };

      setMetrics(mockMetrics);
      setLoading(false);
    } catch (error) {
      console.error('Failed to load exit analytics:', error);
      setLoading(false);
    }
  };

  // Chart data preparation
  const pipelineStageData = metrics ? Object.entries(metrics.pipeline_metrics.by_stage).map(([stage, count]) => ({
    stage: stage.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()),
    count,
    percentage: (count / metrics.pipeline_metrics.total_opportunities) * 100
  })) : [];

  const strategyDistributionData = metrics ? Object.entries(metrics.pipeline_metrics.by_strategy).map(([strategy, count]) => ({
    name: strategy.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()),
    value: count,
    percentage: (count / metrics.pipeline_metrics.total_opportunities) * 100
  })) : [];

  const performanceTrendData = [
    { month: 'Jan', pipeline_value: 380, completed_exits: 2, ai_score: 7.2 },
    { month: 'Feb', pipeline_value: 420, completed_exits: 1, ai_score: 7.5 },
    { month: 'Mar', pipeline_value: 450, completed_exits: 3, ai_score: 7.8 },
    { month: 'Apr', pipeline_value: 480, completed_exits: 2, ai_score: 8.1 },
    { month: 'May', pipeline_value: 510, completed_exits: 4, ai_score: 8.3 },
    { month: 'Jun', pipeline_value: 450, completed_exits: 1, ai_score: 7.8 }
  ];

  const marketTimingAnalysis = [
    { sector: 'Technology', score: 8.5, opportunities: 7 },
    { sector: 'Healthcare', score: 7.8, opportunities: 4 },
    { sector: 'Energy', score: 6.2, opportunities: 2 },
    { sector: 'Financial Services', score: 7.1, opportunities: 2 }
  ];

  const processEfficiencyData = [
    { category: 'Financial', completed: 85, quality: 9.1 },
    { category: 'Legal', completed: 72, quality: 8.3 },
    { category: 'Operational', completed: 68, quality: 7.9 },
    { category: 'Marketing', completed: 91, quality: 8.7 },
    { category: 'Strategic', completed: 76, quality: 8.5 }
  ];

  const readinessScoreData = [
    { subject: 'Financial', score: 85, fullMark: 100 },
    { subject: 'Legal', score: 72, fullMark: 100 },
    { subject: 'Operational', score: 68, fullMark: 100 },
    { subject: 'Strategic', score: 81, fullMark: 100 },
    { subject: 'Market Timing', score: 78, fullMark: 100 },
    { subject: 'Valuation', score: 88, fullMark: 100 }
  ];

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value / 100); // Convert from cents
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading exit analytics...</p>
        </div>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="text-center py-12">
        <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">No analytics data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* AI Enhancement Alert */}
      {mode !== 'traditional' && (
        <Alert className="bg-purple-50 border-purple-200">
          <Brain className="h-4 w-4 text-purple-600" />
          <AlertDescription className="text-purple-800">
            <strong>{mode === 'autonomous' ? 'Autonomous Analytics' : 'AI-Enhanced Analytics'} Active:</strong> {
              mode === 'autonomous' 
                ? 'Real-time autonomous analysis with predictive insights and automated recommendations.'
                : 'Advanced analytics with AI-powered insights, predictive modeling, and smart recommendations.'
            }
          </AlertDescription>
        </Alert>
      )}

      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4" />
            <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="6m">6 Months</SelectItem>
                <SelectItem value="12m">12 Months</SelectItem>
                <SelectItem value="24m">24 Months</SelectItem>
                <SelectItem value="all">All Time</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4" />
            <Select value={selectedAnalysis} onValueChange={setSelectedAnalysis}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="overview">Overview</SelectItem>
                <SelectItem value="performance">Performance</SelectItem>
                <SelectItem value="market">Market Analysis</SelectItem>
                <SelectItem value="predictive">Predictive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <Share className="h-4 w-4 mr-2" />
            Share
          </Button>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pipeline Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(metrics.pipeline_metrics.total_pipeline_value)}
            </div>
            <p className="text-xs text-muted-foreground flex items-center">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              +12.5% vs last quarter
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average AI Score</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.pipeline_metrics.average_ai_score.toFixed(1)}/10</div>
            <Progress value={metrics.pipeline_metrics.average_ai_score * 10} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Process Automation</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(metrics.process_metrics.automation_rate * 100)}%
            </div>
            <p className="text-xs text-muted-foreground">
              {metrics.task_metrics.automation_eligible} tasks eligible
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Optimal Timing</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.pipeline_metrics.optimal_timing_count}</div>
            <p className="text-xs text-muted-foreground">
              opportunities with excellent timing
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Analytics Tabs */}
      <Tabs defaultValue="pipeline" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="pipeline">Pipeline Analysis</TabsTrigger>
          <TabsTrigger value="performance">Performance Trends</TabsTrigger>
          <TabsTrigger value="market">Market Intelligence</TabsTrigger>
          <TabsTrigger value="efficiency">Process Efficiency</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="pipeline" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Exit Pipeline by Stage</CardTitle>
                <CardDescription>Distribution of opportunities across exit stages</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={pipelineStageData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="stage" />
                    <YAxis />
                    <Tooltip formatter={(value: any) => [value, 'Count']} />
                    <Bar dataKey="count" fill="#3B82F6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Exit Strategy Distribution</CardTitle>
                <CardDescription>Breakdown of exit strategies being pursued</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={strategyDistributionData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percentage }) => `${name} (${percentage.toFixed(0)}%)`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {strategyDistributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Market Conditions Assessment</CardTitle>
              <CardDescription>Current market timing conditions across the portfolio</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(metrics.pipeline_metrics.by_market_conditions).map(([condition, count]) => (
                  <div key={condition} className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold mb-1">{count}</div>
                    <div className="text-sm text-gray-600 capitalize">
                      {condition.replace('-', ' ')}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {Math.round((count / metrics.pipeline_metrics.total_opportunities) * 100)}%
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Performance Trends</CardTitle>
              <CardDescription>Pipeline value and AI score trends over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={performanceTrendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Area 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="pipeline_value" 
                    stroke="#3B82F6" 
                    fill="#3B82F680" 
                    name="Pipeline Value ($M)"
                  />
                  <Line 
                    yAxisId="right"
                    type="monotone" 
                    dataKey="ai_score" 
                    stroke="#10B981" 
                    strokeWidth={3}
                    name="AI Score"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Task Completion Metrics</CardTitle>
                <CardDescription>Progress across different task categories</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(metrics.task_metrics.by_category).map(([category, count]) => {
                    const completionRate = Math.random() * 30 + 60; // Mock completion rate
                    return (
                      <div key={category}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="capitalize">{category}</span>
                          <span>{Math.round(completionRate)}% ({count} tasks)</span>
                        </div>
                        <Progress value={completionRate} className="h-2" />
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Exit Readiness Score</CardTitle>
                <CardDescription>Multi-dimensional readiness assessment</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <RadarChart data={readinessScoreData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} />
                    <Radar
                      name="Readiness Score"
                      dataKey="score"
                      stroke="#3B82F6"
                      fill="#3B82F6"
                      fillOpacity={0.3}
                    />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="market" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Market Timing Analysis by Sector</CardTitle>
              <CardDescription>AI-driven market timing scores across different sectors</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <ScatterChart data={marketTimingAnalysis}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="opportunities" name="Opportunities" />
                  <YAxis dataKey="score" name="Timing Score" domain={[0, 10]} />
                  <Tooltip 
                    cursor={{ strokeDasharray: '3 3' }}
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-white p-3 border rounded shadow">
                            <p className="font-medium">{data.sector}</p>
                            <p className="text-sm">Timing Score: {data.score}/10</p>
                            <p className="text-sm">Opportunities: {data.opportunities}</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Scatter dataKey="score" fill="#3B82F6" />
                </ScatterChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Market Conditions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Favorable Conditions</span>
                    <Badge className="bg-green-100 text-green-800">
                      {metrics.market_metrics.favorable_conditions} / {metrics.pipeline_metrics.total_opportunities}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Avg Timing Score</span>
                    <span className="font-medium">{metrics.market_metrics.average_timing_score}/10</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Market Intel Reports</span>
                    <span className="font-medium">{metrics.market_metrics.total_market_intelligence}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Sector Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {marketTimingAnalysis.map((sector) => (
                    <div key={sector.sector} className="flex items-center justify-between">
                      <span className="text-sm">{sector.sector}</span>
                      <div className="flex items-center space-x-2">
                        <Progress value={sector.score * 10} className="w-16 h-2" />
                        <span className="text-xs font-medium w-8">{sector.score}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Market Outlook</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Strong buyer appetite</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Favorable valuations</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="h-4 w-4 text-yellow-600" />
                    <span className="text-sm">Interest rate volatility</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-blue-600" />
                    <span className="text-sm">6-month optimal window</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="efficiency" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Process Efficiency Analysis</CardTitle>
              <CardDescription>Completion rates and quality scores by process category</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={processEfficiencyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Bar yAxisId="left" dataKey="completed" fill="#3B82F6" name="Completion %" />
                  <Bar yAxisId="right" dataKey="quality" fill="#10B981" name="Quality Score" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Process Metrics Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-blue-50 rounded">
                    <div className="text-2xl font-bold text-blue-600">
                      {metrics.process_metrics.total_processes}
                    </div>
                    <div className="text-sm text-blue-700">Total Processes</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded">
                    <div className="text-2xl font-bold text-green-600">
                      {metrics.process_metrics.completed_processes}
                    </div>
                    <div className="text-sm text-green-700">Completed</div>
                  </div>
                  <div className="text-center p-3 bg-red-50 rounded">
                    <div className="text-2xl font-bold text-red-600">
                      {metrics.process_metrics.overdue_processes}
                    </div>
                    <div className="text-sm text-red-700">Overdue</div>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded">
                    <div className="text-2xl font-bold text-purple-600">
                      {metrics.process_metrics.quality_score.toFixed(1)}
                    </div>
                    <div className="text-sm text-purple-700">Avg Quality</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Automation Impact</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Automation Rate</span>
                      <span>{Math.round(metrics.process_metrics.automation_rate * 100)}%</span>
                    </div>
                    <Progress value={metrics.process_metrics.automation_rate * 100} />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Time Savings</span>
                      <span>~{Math.round(metrics.process_metrics.average_completion_time * 0.3)} days</span>
                    </div>
                    <Progress value={30} />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Quality Improvement</span>
                      <span>+15%</span>
                    </div>
                    <Progress value={15} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Lightbulb className="h-5 w-5 mr-2" />
                  Key AI Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-green-800">Optimal Exit Window</p>
                        <p className="text-sm text-green-700">
                          TechCorp Solutions has a 6-month optimal exit window starting Q2 2024 based on market conditions and company performance.
                        </p>
                        <p className="text-xs text-green-600 mt-1">Confidence: 92%</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                    <div className="flex items-start space-x-3">
                      <Brain className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-blue-800">Strategic Buyer Match</p>
                        <p className="text-sm text-blue-700">
                          AI analysis identifies MegaCorp Inc. as the optimal strategic acquirer for GreenEnergy Dynamics with 85% synergy match.
                        </p>
                        <p className="text-xs text-blue-600 mt-1">Confidence: 87%</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-500">
                    <div className="flex items-start space-x-3">
                      <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-yellow-800">Process Optimization</p>
                        <p className="text-sm text-yellow-700">
                          Legal documentation processes can be accelerated by 3 weeks through automation and parallel workflows.
                        </p>
                        <p className="text-xs text-yellow-600 mt-1">Confidence: 78%</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Predictive Analytics</CardTitle>
                <CardDescription>AI-generated forecasts and predictions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                    <div className="text-3xl font-bold text-blue-600 mb-2">$580M</div>
                    <p className="text-sm text-gray-700">Predicted pipeline value by Q4 2024</p>
                    <p className="text-xs text-gray-500">+29% growth projection</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-green-50 rounded">
                      <div className="text-xl font-bold text-green-600">4-6</div>
                      <p className="text-xs text-green-700">Exits expected Q3-Q4</p>
                    </div>
                    <div className="text-center p-3 bg-blue-50 rounded">
                      <div className="text-xl font-bold text-blue-600">8.5</div>
                      <p className="text-xs text-blue-700">Predicted avg AI score</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Market Favorability</span>
                      <span className="font-medium">Rising</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Valuation Multiples</span>
                      <span className="font-medium">Stable</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Exit Success Rate</span>
                      <span className="font-medium">85%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {mode === 'autonomous' && (
            <Card>
              <CardHeader>
                <CardTitle>Autonomous Recommendations</CardTitle>
                <CardDescription>System-generated action items and optimizations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3 p-3 bg-purple-50 rounded">
                    <Zap className="h-5 w-5 text-purple-600 mt-0.5" />
                    <div className="flex-1">
                      <p className="font-medium text-purple-800">Automated Process Optimization</p>
                      <p className="text-sm text-purple-700">System will automatically optimize legal documentation workflows for HealthTech Innovations exit.</p>
                      <div className="flex items-center space-x-2 mt-2">
                        <Button size="sm" variant="outline">Approve</Button>
                        <Button size="sm" variant="ghost">Review</Button>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded">
                    <Activity className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div className="flex-1">
                      <p className="font-medium text-blue-800">Market Timing Alert</p>
                      <p className="text-sm text-blue-700">Autonomous system suggests accelerating TechFlow Solutions exit timeline by 2 weeks due to favorable market conditions.</p>
                      <div className="flex items-center space-x-2 mt-2">
                        <Button size="sm" variant="outline">Execute</Button>
                        <Button size="sm" variant="ghost">Defer</Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}