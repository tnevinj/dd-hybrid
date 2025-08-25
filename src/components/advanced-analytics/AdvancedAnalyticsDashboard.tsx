'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { 
  BarChart3, LineChart, PieChart, TrendingUp, TrendingDown, Activity,
  AlertTriangle, CheckCircle, Clock, Zap, Target, Brain, Settings,
  Play, Pause, RotateCcw, Download, Share2, Eye, Filter, Search,
  GitBranch, Layers, Cpu, Database, Calculator, Network, Plus
} from 'lucide-react';
import { ModuleHeader, ProcessNotice } from '@/components/shared/ModeIndicators';

import {
  NavigationMode,
  AdvancedAnalyticsResponse,
  AnalyticsModel,
  ModelSummary,
  RecentRun,
  CorrelationMatrix,
  CorrelationInsight,
  RiskModel,
  RiskAlert,
  ScenarioAnalysis,
  ScenarioInsight,
  StressTestScenario,
  ForecastModel,
  AdvancedAnalyticsStats,
  HybridModeContent,
  ModelType,
  AnalyticsCategory,
  RunStatus
} from '@/types/advanced-analytics';

interface AdvancedAnalyticsDashboardProps {
  navigationMode: NavigationMode;
  onModeChange: (mode: NavigationMode) => void;
}

export function AdvancedAnalyticsDashboard({ navigationMode, onModeChange }: AdvancedAnalyticsDashboardProps) {
  const [data, setData] = useState<AdvancedAnalyticsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [autoRefresh, setAutoRefresh] = useState(false);

  const hybridContent: HybridModeContent = {
    traditional: {
      showAllModels: true,
      enableManualCalibration: true,
      showDetailedResults: true,
      advancedConfiguration: true,
    },
    assisted: {
      showModelRecommendations: true,
      highlightAnomalies: true,
      smartParameterSuggestions: true,
      contextualInsights: true,
    },
    autonomous: {
      autoModelSelection: true,
      autoCalibration: true,
      predictiveAlerts: true,
      intelligentScenarios: true,
      adaptiveParameters: true,
    },
  };

  useEffect(() => {
    fetchAnalyticsData();
    
    if (autoRefresh) {
      const interval = setInterval(fetchAnalyticsData, 30000); // 30 seconds
      return () => clearInterval(interval);
    }
  }, [navigationMode, autoRefresh]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/advanced-analytics');
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error('Error fetching advanced analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string): string => {
    switch (status.toLowerCase()) {
      case 'completed':
      case 'active': return 'text-green-600';
      case 'running':
      case 'pending': return 'text-blue-600';
      case 'failed':
      case 'error': return 'text-red-600';
      case 'cancelled': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'critical': return 'destructive' as const;
      case 'high': return 'destructive' as const;
      case 'medium': return 'default' as const;
      case 'low': return 'secondary' as const;
      default: return 'outline' as const;
    }
  };

  const formatNumber = (num: number, decimals: number = 2): string => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(num);
  };

  const formatPercent = (num: number): string => {
    return `${formatNumber(num * 100, 1)}%`;
  };

  const formatDuration = (seconds: number): string => {
    if (seconds < 60) return `${seconds}s`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
    return `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}m`;
  };

  const formatDate = (date: Date | string): string => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading && !data) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-6">
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>Failed to load advanced analytics data.</AlertDescription>
        </Alert>
      </div>
    );
  }

  const renderModeSelector = () => (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium">Navigation Mode:</label>
        <Select value={navigationMode} onValueChange={onModeChange}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="traditional">Traditional</SelectItem>
            <SelectItem value="assisted">Assisted</SelectItem>
            <SelectItem value="autonomous">Autonomous</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setAutoRefresh(!autoRefresh)}
          className={autoRefresh ? 'bg-green-50 border-green-200' : ''}
        >
          <Activity className={`h-4 w-4 ${autoRefresh ? 'text-green-600' : ''}`} />
          {autoRefresh ? 'Auto' : 'Manual'}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={fetchAnalyticsData}
          disabled={loading}
        >
          <RotateCcw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
        </Button>
      </div>
    </div>
  );

  const renderStatsCards = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Analytics Models</p>
              <p className="text-2xl font-bold">{data.stats.activeModels}</p>
              <p className="text-xs text-muted-foreground">of {data.stats.totalModels} total</p>
            </div>
            <Brain className="h-8 w-8 text-blue-600" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Running Analyses</p>
              <p className="text-2xl font-bold">{data.stats.runningAnalyses}</p>
              <p className="text-xs text-muted-foreground">{data.stats.completedRuns} completed</p>
            </div>
            <Cpu className="h-8 w-8 text-blue-600" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Correlations</p>
              <p className="text-2xl font-bold">{data.stats.correlationMatrices}</p>
            </div>
            <Network className="h-8 w-8 text-green-600" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Stress Tests</p>
              <p className="text-2xl font-bold">{data.stats.stressTests}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-orange-600" />
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderModelLibrary = () => (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Model Library
          {navigationMode === 'assisted' && (
            <Badge variant="outline">Smart Recommendations</Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.modelSummaries.slice(0, 6).map((model) => (
            <div key={model.id} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-sm">{model.name}</h4>
                <Badge 
                  variant={
                    model.status === 'ACTIVE' ? 'default' :
                    model.status === 'ERROR' ? 'destructive' :
                    'secondary'
                  }
                  className="text-xs"
                >
                  {model.status}
                </Badge>
              </div>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center justify-between">
                  <span>Type:</span>
                  <span className="font-medium">{model.modelType.replace('_', ' ')}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Category:</span>
                  <span className="font-medium">{model.category.replace('_', ' ')}</span>
                </div>
                {model.accuracy && (
                  <div className="flex items-center justify-between">
                    <span>Accuracy:</span>
                    <span className="font-medium">{formatPercent(model.accuracy)}</span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span>Usage:</span>
                  <span className="font-medium">{model.usage} runs</span>
                </div>
                {model.lastRun && (
                  <div className="flex items-center justify-between">
                    <span>Last Run:</span>
                    <span className="font-medium">{formatDate(model.lastRun)}</span>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-1 mt-3">
                <Button variant="outline" size="sm" className="flex-1">
                  <Play className="h-3 w-3 mr-1" />
                  Run
                </Button>
                <Button variant="outline" size="sm">
                  <Settings className="h-3 w-3" />
                </Button>
                <Button variant="outline" size="sm">
                  <Eye className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  const renderRecentRuns = () => (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Recent Analysis Runs
          {navigationMode === 'autonomous' && (
            <Badge variant="outline">Auto-Scheduled</Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {data.recentRuns.slice(0, 8).map((run) => (
            <div key={run.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className={`h-2 w-2 rounded-full ${
                  run.status === 'COMPLETED' ? 'bg-green-500' :
                  run.status === 'RUNNING' ? 'bg-blue-500 animate-pulse' :
                  run.status === 'FAILED' ? 'bg-red-500' :
                  'bg-gray-400'
                }`}></div>
                <div>
                  <p className="font-medium text-sm">{run.modelName}</p>
                  <p className="text-xs text-muted-foreground">
                    by {run.triggeredBy} • {formatDate(run.startTime)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge 
                  variant="outline" 
                  className={`text-xs ${getStatusColor(run.status)}`}
                >
                  {run.status}
                </Badge>
                {run.duration && (
                  <span className="text-xs text-muted-foreground">
                    {formatDuration(run.duration)}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  const renderCorrelationInsights = () => (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Network className="h-5 w-5" />
          Portfolio Correlations
          {navigationMode === 'assisted' && (
            <Badge variant="outline">Pattern Detection</Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.correlationInsights.slice(0, 5).map((insight) => (
            <div key={insight.id} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-sm">
                  {insight.entityA} ↔ {insight.entityB}
                </h4>
                <div className="flex items-center gap-2">
                  <Badge 
                    variant={
                      Math.abs(insight.correlation) > 0.7 ? 'destructive' :
                      Math.abs(insight.correlation) > 0.4 ? 'default' :
                      'secondary'
                    }
                    className="text-xs"
                  >
                    {formatNumber(insight.correlation, 3)}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {insight.significance}
                  </Badge>
                </div>
              </div>
              {insight.businessImplication && (
                <p className="text-sm text-muted-foreground">
                  {insight.businessImplication}
                </p>
              )}
              <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                <span>Trend: {insight.trend}</span>
                <div className="flex items-center gap-1">
                  {insight.correlation > 0 ? (
                    <TrendingUp className="h-3 w-3 text-green-600" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-red-600" />
                  )}
                  <span>
                    {insight.correlation > 0 ? 'Positive' : 'Negative'} Correlation
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  const renderRiskAlerts = () => (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          Risk Alerts
          {navigationMode === 'autonomous' && (
            <Badge variant="outline">Predictive</Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {data.riskAlerts.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            <CheckCircle className="h-12 w-12 mx-auto mb-2 text-green-600" />
            <p>No active risk alerts</p>
            <p className="text-sm">All risk metrics within acceptable parameters</p>
          </div>
        ) : (
          <div className="space-y-3">
            {data.riskAlerts.slice(0, 5).map((alert) => (
              <Alert key={alert.id} className={
                alert.severity === 'CRITICAL' ? 'border-red-200 bg-red-50' :
                alert.severity === 'HIGH' ? 'border-orange-200 bg-orange-50' :
                'border-yellow-200 bg-yellow-50'
              }>
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle className="flex items-center justify-between">
                  {alert.title}
                  <Badge variant={getSeverityColor(alert.severity)}>
                    {alert.severity}
                  </Badge>
                </AlertTitle>
                <AlertDescription className="mt-2">
                  {alert.description}
                  {alert.recommendation && (
                    <div className="mt-2 p-2 bg-white rounded border-l-2 border-blue-500">
                      <span className="text-xs font-medium text-blue-600">Recommendation:</span>
                      <p className="text-xs mt-1">{alert.recommendation}</p>
                    </div>
                  )}
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs">
                      Triggered: {formatDate(alert.triggeredAt)}
                    </span>
                    <div className="flex gap-1">
                      <Button size="sm" variant="outline" className="h-6 text-xs">
                        Investigate
                      </Button>
                      <Button size="sm" variant="outline" className="h-6 text-xs">
                        Acknowledge
                      </Button>
                    </div>
                  </div>
                </AlertDescription>
              </Alert>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );

  const renderScenarioInsights = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GitBranch className="h-5 w-5" />
          Scenario Analysis
          {navigationMode === 'autonomous' && (
            <Badge variant="outline">Intelligent Scenarios</Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.scenarioInsights.slice(0, 4).map((insight) => (
            <div key={insight.id} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold">{insight.scenarioName}</h4>
                {insight.probability && (
                  <Badge variant="outline" className="text-xs">
                    {formatPercent(insight.probability)} probability
                  </Badge>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">Worst Case</p>
                  <p className={`text-lg font-bold ${
                    insight.worstCaseImpact < 0 ? 'text-red-600' : 'text-green-600'
                  }`}>
                    {formatPercent(insight.worstCaseImpact)}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">Best Case</p>
                  <p className={`text-lg font-bold ${
                    insight.bestCaseUpside > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {formatPercent(insight.bestCaseUpside)}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">Key Drivers</p>
                  <p className="text-sm font-medium">{insight.keyDrivers.length} factors</p>
                </div>
              </div>
              <div className="text-sm">
                <p className="font-medium mb-1">Key Risk Drivers:</p>
                <div className="flex flex-wrap gap-1">
                  {insight.keyDrivers.slice(0, 3).map((driver, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {driver}
                    </Badge>
                  ))}
                </div>
              </div>
              {insight.recommendation && (
                <div className="mt-3 p-2 bg-blue-50 rounded border-l-2 border-blue-500">
                  <p className="text-xs font-medium text-blue-600">Recommendation:</p>
                  <p className="text-xs mt-1">{insight.recommendation}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  const renderModelsList = () => (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Analytics Models
            {navigationMode === 'assisted' && (
              <Badge variant="outline">AI-Optimized</Badge>
            )}
          </CardTitle>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search models..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4" />
            </Button>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              New Model
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.models.slice(0, 10).map((model) => (
            <div key={model.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-semibold">{model.name}</h4>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{model.modelType.replace('_', ' ')}</Badge>
                  <Badge variant="secondary">{model.category.replace('_', ' ')}</Badge>
                  <Badge variant={model.isActive ? 'default' : 'secondary'}>
                    {model.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </div>
              {model.description && (
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                  {model.description}
                </p>
              )}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-muted-foreground mb-3">
                <div>
                  <span className="font-medium">Algorithm:</span> {model.algorithm}
                </div>
                <div>
                  <span className="font-medium">Version:</span> {model.version}
                </div>
                {model.accuracy && (
                  <div>
                    <span className="font-medium">Accuracy:</span> {formatPercent(model.accuracy)}
                  </div>
                )}
                <div>
                  <span className="font-medium">Usage:</span> {model.usage} runs
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>Created: {formatDate(model.createdAt)}</span>
                  {model.lastCalibrated && (
                    <span>Last Calibrated: {formatDate(model.lastCalibrated)}</span>
                  )}
                  <span>Confidence: {formatPercent(model.confidence)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="sm">
                    <Play className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Settings className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className={`min-h-screen p-4 md:p-6 ${navigationMode === 'traditional' ? 'bg-gray-50' : ''}`}>
      <div className="container mx-auto max-w-7xl">
        <ModuleHeader
          title="Advanced Analytics"
          description="Portfolio correlation, predictive risk modeling, and scenario planning"
          mode={navigationMode}
          actions={
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setAutoRefresh(!autoRefresh)}
                className={autoRefresh ? 'bg-green-50 border-green-200' : ''}
              >
                <Activity className={`h-4 w-4 ${autoRefresh ? 'text-green-600' : ''}`} />
                {autoRefresh ? 'Auto' : 'Manual'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={fetchAnalyticsData}
                disabled={loading}
              >
                <RotateCcw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              </Button>
              <Select value={navigationMode} onValueChange={onModeChange}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="traditional">Traditional</SelectItem>
                  <SelectItem value="assisted">Assisted</SelectItem>
                  <SelectItem value="autonomous">Autonomous</SelectItem>
                </SelectContent>
              </Select>
            </div>
          }
        />

        {renderStatsCards()}

        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="models">Models</TabsTrigger>
            <TabsTrigger value="correlations">Correlations</TabsTrigger>
            <TabsTrigger value="risk">Risk Analysis</TabsTrigger>
            <TabsTrigger value="scenarios">Scenarios</TabsTrigger>
            <TabsTrigger value="forecasting">Forecasting</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-6">
                {renderModelLibrary()}
                {renderRecentRuns()}
              </div>
              <div className="space-y-6">
                {renderCorrelationInsights()}
                {renderRiskAlerts()}
                {renderScenarioInsights()}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="models">
            {renderModelsList()}
          </TabsContent>

          <TabsContent value="correlations">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Network className="h-5 w-5" />
                  Correlation Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <PieChart className="h-12 w-12 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Advanced Correlation Analytics</h3>
                  <p>Interactive correlation matrices, time-series analysis, and regime detection would be implemented here</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="risk">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Risk Modeling
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <AlertTriangle className="h-12 w-12 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Advanced Risk Analysis</h3>
                  <p>VaR modeling, stress testing frameworks, and risk factor attribution would be implemented here</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="scenarios">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GitBranch className="h-5 w-5" />
                  Scenario Planning
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <Layers className="h-12 w-12 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Scenario Analysis Engine</h3>
                  <p>Monte Carlo simulations, stress testing, and what-if analysis tools would be implemented here</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="forecasting">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LineChart className="h-5 w-5" />
                  Predictive Forecasting
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <TrendingUp className="h-12 w-12 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Predictive Analytics</h3>
                  <p>Time series forecasting, machine learning models, and predictive risk analytics would be implemented here</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <ProcessNotice 
          mode={navigationMode}
          title="Advanced Analytics"
          description="Portfolio correlation analysis, predictive risk modeling, and scenario planning operations"
        />
      </div>
    </div>
  );
}
