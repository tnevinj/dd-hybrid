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
  TrendingUp, TrendingDown, Globe, DollarSign, AlertTriangle, Activity,
  BarChart3, LineChart, PieChart, Search, Filter, RefreshCw, Settings,
  Bell, CheckCircle, Clock, MapPin, Zap, Target, Brain, Eye,
  Calendar, FileText, Download, Share2, ArrowUp, ArrowDown, Minus
} from 'lucide-react';

import {
  NavigationMode,
  MarketIntelligenceResponse,
  MarketIndicator,
  CurrencySnapshot,
  GeopoliticalEvent,
  MarketAlert,
  EventSummary,
  TrendingIndicator,
  AFMESummary,
  MarketIntelligenceStats,
  HybridModeContent,
  Priority,
  EventSeverity,
  AlertStatus
} from '@/types/market-intelligence';
import { PredictiveSectorAnalysis } from './PredictiveSectorAnalysis';

interface MarketIntelligenceDashboardProps {
  navigationMode: NavigationMode;
  onModeChange: (mode: NavigationMode) => void;
}

export function MarketIntelligenceDashboard({ navigationMode, onModeChange }: MarketIntelligenceDashboardProps) {
  const [data, setData] = useState<MarketIntelligenceResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const hybridContent: HybridModeContent = {
    traditional: {
      showRawData: true,
      enableManualAnalysis: true,
      showAllIndicators: true,
      detailedCharts: true,
    },
    assisted: {
      showTrendAnalysis: true,
      highlightAnomalies: true,
      suggestCorrelations: true,
      smartAlerts: true,
      contextualInsights: true,
    },
    autonomous: {
      autoGenerateReports: true,
      predictiveAnalytics: true,
      smartEventDetection: true,
      autoCorrelationAnalysis: true,
      intelligentAlerting: true,
      dynamicThresholds: true,
    },
  };

  useEffect(() => {
    fetchMarketData();
    
    if (autoRefresh && navigationMode === 'autonomous') {
      const interval = setInterval(fetchMarketData, 60000); // 1 minute
      return () => clearInterval(interval);
    }
  }, [navigationMode, autoRefresh]);

  const fetchMarketData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/market-intelligence');
      const result = await response.json();
      setData(result);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Error fetching market intelligence data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity: EventSeverity): string => {
    switch (severity) {
      case 'CRITICAL': return 'destructive';
      case 'HIGH': return 'destructive';
      case 'MEDIUM': return 'default';
      case 'LOW': return 'secondary';
      default: return 'outline';
    }
  };

  const getChangeIcon = (change: number) => {
    if (change > 0) return <ArrowUp className="h-4 w-4 text-green-600" />;
    if (change < 0) return <ArrowDown className="h-4 w-4 text-red-600" />;
    return <Minus className="h-4 w-4 text-gray-400" />;
  };

  const formatNumber = (num: number, decimals: number = 2): string => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(num);
  };

  const formatPercent = (num: number): string => {
    return `${formatNumber(num, 2)}%`;
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
          <AlertDescription>Failed to load market intelligence data.</AlertDescription>
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
          onClick={fetchMarketData}
          disabled={loading}
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
        </Button>
        <div className="text-xs text-muted-foreground">
          Last updated: {formatDate(lastUpdate)}
        </div>
      </div>
    </div>
  );

  const renderStatsCards = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Market Indicators</p>
              <p className="text-2xl font-bold">{data.stats.totalIndicators}</p>
            </div>
            <BarChart3 className="h-8 w-8 text-blue-600" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Active Alerts</p>
              <p className="text-2xl font-bold">{data.stats.activeAlerts}</p>
            </div>
            <Bell className="h-8 w-8 text-red-600" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Currency Pairs</p>
              <p className="text-2xl font-bold">{data.stats.currencyPairs}</p>
            </div>
            <DollarSign className="h-8 w-8 text-green-600" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Geo Events</p>
              <p className="text-2xl font-bold">{data.stats.geopoliticalEvents}</p>
            </div>
            <Globe className="h-8 w-8 text-orange-600" />
          </div>
        </CardContent>
      </Card>
      
      {/* AI-Enhanced Metrics */}
      <Card className="border-green-200 bg-gradient-to-r from-green-50 to-emerald-50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-700 font-medium">AI Predictions</p>
              <p className="text-2xl font-bold text-green-900">3 Sectors</p>
            </div>
            <Brain className="h-8 w-8 text-green-600" />
          </div>
          <div className="mt-2 flex items-center">
            <Zap className="h-3 w-3 text-green-600 mr-1" />
            <span className="text-xs text-green-700">85% avg confidence</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderTrendingIndicators = () => (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Trending Indicators
          {(navigationMode === 'assisted' || navigationMode === 'autonomous') && (
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              AI-Enhanced
            </Badge>
          )}
        </CardTitle>
        {navigationMode === 'autonomous' && (
          <p className="text-sm text-gray-600">Smart anomaly detection and correlation analysis active</p>
        )}
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.trendingIndicators.slice(0, 6).map((indicator) => (
            <div key={indicator.id} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-sm">{indicator.name}</h4>
                <Badge variant="outline">{indicator.region}</Badge>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl font-bold">{formatNumber(indicator.currentValue)}</span>
                <div className="flex items-center gap-1">
                  {getChangeIcon(indicator.change.percent)}
                  <span className={`text-sm font-medium ${
                    indicator.change.percent > 0 ? 'text-green-600' :
                    indicator.change.percent < 0 ? 'text-red-600' :
                    'text-gray-600'
                  }`}>
                    {formatPercent(Math.abs(indicator.change.percent))}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{indicator.category}</span>
                <Badge 
                  variant={indicator.significance === 'HIGH' ? 'destructive' : 'secondary'}
                  className="text-xs"
                >
                  {indicator.significance}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  const renderCurrencySnapshots = () => (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          Currency Monitor
          {navigationMode === 'autonomous' && (
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              Auto-Tracking
            </Badge>
          )}
        </CardTitle>
        {navigationMode === 'assisted' && (
          <p className="text-sm text-gray-600">AI volatility alerts and correlation insights enabled</p>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {data.currencySnapshots.slice(0, 8).map((snapshot) => (
            <div key={snapshot.pair.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="font-medium">{snapshot.pair.symbol}</div>
                <div className="text-sm text-muted-foreground">{snapshot.pair.name}</div>
                {snapshot.pair.isMajorPair && (
                  <Badge variant="outline" className="text-xs">Major</Badge>
                )}
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="font-mono text-lg font-semibold">
                    {formatNumber(snapshot.rate, 4)}
                  </div>
                  <div className="flex items-center gap-1 text-sm">
                    {getChangeIcon(snapshot.changePercent24h)}
                    <span className={
                      snapshot.changePercent24h > 0 ? 'text-green-600' :
                      snapshot.changePercent24h < 0 ? 'text-red-600' :
                      'text-gray-600'
                    }>
                      {formatPercent(Math.abs(snapshot.changePercent24h))}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-muted-foreground">Vol: {formatPercent(snapshot.volatility)}</div>
                  <Badge 
                    variant={
                      snapshot.alertLevel === 'HIGH' ? 'destructive' :
                      snapshot.alertLevel === 'MEDIUM' ? 'default' :
                      'secondary'
                    }
                    className="text-xs"
                  >
                    {snapshot.trend}
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  const renderGeopoliticalEvents = () => (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5" />
          Geopolitical Events
          {navigationMode === 'autonomous' && (
            <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
              Smart Detection
            </Badge>
          )}
        </CardTitle>
        {(navigationMode === 'assisted' || navigationMode === 'autonomous') && (
          <p className="text-sm text-gray-600">AI-powered event severity scoring and market impact prediction</p>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.eventSummaries.slice(0, 5).map((event) => (
            <div key={event.id} className="border rounded-lg p-4">
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-semibold">{event.title}</h4>
                <div className="flex items-center gap-2">
                  <Badge variant={getSeverityColor(event.severity)}>
                    {event.severity}
                  </Badge>
                  <Badge variant="outline">{event.status}</Badge>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground mb-3">
                <div>
                  <span className="font-medium">Type:</span> {event.category.replace('_', ' ')}
                </div>
                <div>
                  <span className="font-medium">Regions:</span> {event.regions.join(', ')}
                </div>
                <div>
                  <span className="font-medium">Discovered:</span> {formatDate(event.timeline.discovered)}
                </div>
              </div>
              {(event.impact.economic || event.impact.market) && (
                <div className="flex items-center gap-4 text-xs">
                  {event.impact.economic && (
                    <div className="flex items-center gap-1">
                      <span>Economic:</span>
                      <Badge variant="outline" className="text-xs">
                        {event.impact.economic}
                      </Badge>
                    </div>
                  )}
                  {event.impact.market && (
                    <div className="flex items-center gap-1">
                      <span>Market:</span>
                      <Badge variant="outline" className="text-xs">
                        {event.impact.market}
                      </Badge>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  const renderActiveAlerts = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Active Alerts
          {navigationMode === 'assisted' && (
            <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
              Smart Alerts
            </Badge>
          )}
        </CardTitle>
        {navigationMode === 'autonomous' && (
          <p className="text-sm text-gray-600">Intelligent thresholding and predictive alerting enabled</p>
        )}
      </CardHeader>
      <CardContent>
        {data.alerts.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            <CheckCircle className="h-12 w-12 mx-auto mb-2 text-green-600" />
            <p>No active alerts</p>
            <p className="text-sm">All market conditions within normal parameters</p>
          </div>
        ) : (
          <div className="space-y-3">
            {data.alerts.slice(0, 6).map((alert) => (
              <Alert key={alert.id} className={
                alert.severity === 'CRITICAL' ? 'border-red-200 bg-red-50' :
                alert.severity === 'HIGH' ? 'border-orange-200 bg-orange-50' :
                'border-yellow-200 bg-yellow-50'
              }>
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle className="flex items-center justify-between">
                  {alert.title}
                  <div className="flex items-center gap-2">
                    <Badge variant={getSeverityColor(alert.severity)}>
                      {alert.severity}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {alert.alertType}
                    </Badge>
                  </div>
                </AlertTitle>
                <AlertDescription className="mt-2">
                  {alert.description}
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs">
                      Triggered: {formatDate(alert.triggeredAt)}
                    </span>
                    <div className="flex gap-1">
                      <Button size="sm" variant="outline" className="h-6 text-xs">
                        Acknowledge
                      </Button>
                      <Button size="sm" variant="outline" className="h-6 text-xs">
                        Resolve
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

  const renderAFMEDashboard = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PieChart className="h-5 w-5" />
          AFME Market Data
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.afmeSummaries.map((summary) => (
            <div key={summary.category} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold">{summary.category.replace('_', ' ')}</h4>
                <Badge variant="outline">{summary.metrics.total} metrics</Badge>
              </div>
              <div className="space-y-2 mb-3">
                {summary.keyMetrics.slice(0, 3).map((metric, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <span className="truncate">{metric.name}</span>
                    <div className="flex items-center gap-1">
                      <span className="font-mono">{formatNumber(metric.value)}</span>
                      {metric.unit && <span className="text-xs text-muted-foreground">{metric.unit}</span>}
                      {metric.change !== 0 && (
                        <span className={`text-xs ${metric.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          ({formatPercent(Math.abs(metric.change))})
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Last update: {formatDate(summary.lastUpdate)}</span>
                {summary.metrics.alerts > 0 && (
                  <Badge variant="destructive" className="text-xs">
                    {summary.metrics.alerts} alerts
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  const renderIndicatorsList = () => (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Market Indicators
            {navigationMode === 'autonomous' && (
              <Badge variant="outline">Auto-Updated</Badge>
            )}
          </CardTitle>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search indicators..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {data.indicators.slice(0, 12).map((indicator) => (
            <div key={indicator.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold">{indicator.name}</h4>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{indicator.category}</Badge>
                  <Badge variant={indicator.priority === 'HIGH' ? 'destructive' : 'secondary'}>
                    {indicator.priority}
                  </Badge>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-muted-foreground mb-2">
                <div>
                  <span className="font-medium">Region:</span> {indicator.region}
                </div>
                <div>
                  <span className="font-medium">Frequency:</span> {indicator.frequency}
                </div>
                <div>
                  <span className="font-medium">Source:</span> {indicator.source}
                </div>
                <div>
                  <span className="font-medium">Updated:</span> {indicator.lastUpdated ? formatDate(indicator.lastUpdated) : 'N/A'}
                </div>
              </div>
              {indicator.latestDataPoint && (
                <div className="flex items-center justify-between mt-2 p-2 bg-muted/50 rounded">
                  <span className="font-medium">Latest Value:</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-lg">{formatNumber(indicator.latestDataPoint.value)}</span>
                    {indicator.unit && <span className="text-sm text-muted-foreground">{indicator.unit}</span>}
                    {indicator.recentChange && (
                      <div className="flex items-center gap-1">
                        {getChangeIcon(indicator.recentChange.percent)}
                        <span className="text-sm">{formatPercent(Math.abs(indicator.recentChange.percent))}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Activity className="h-8 w-8 text-blue-600" />
            Market Intelligence
          </h1>
          <p className="text-muted-foreground">
            AFME dashboard, currency monitoring, and geopolitical analysis
          </p>
        </div>
        {renderModeSelector()}
      </div>

      {renderStatsCards()}

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="predictions" className="flex items-center gap-2">
            <Brain className="h-3 w-3" />
            AI Predictions
          </TabsTrigger>
          <TabsTrigger value="indicators">Indicators</TabsTrigger>
          <TabsTrigger value="currencies">Currencies</TabsTrigger>
          <TabsTrigger value="geopolitical">Geopolitical</TabsTrigger>
          <TabsTrigger value="afme">AFME</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* AI Insights Banner for Overview */}
          {navigationMode === 'assisted' || navigationMode === 'autonomous' ? (
            <Card className="border-green-200 bg-gradient-to-r from-green-50 to-emerald-50">
              <CardHeader>
                <CardTitle className="text-xl text-green-800 flex items-center space-x-2">
                  <Brain className="h-5 w-5" />
                  <span>AI Market Intelligence</span>
                </CardTitle>
                <p className="text-green-700">Predictive analytics and smart market detection active</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white rounded-lg p-4 border border-green-200">
                    <div className="flex items-center space-x-2 mb-2">
                      <TrendingUp className="h-5 w-5 text-green-600" />
                      <h4 className="font-semibold text-gray-900">Sector Outlook</h4>
                    </div>
                    <div className="text-2xl font-bold text-green-600 mb-1">2 Outperform</div>
                    <p className="text-sm text-gray-600">Tech & Healthcare leading</p>
                    <div className="mt-2 text-xs text-green-700">
                      85% ML confidence • 6M horizon
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 border border-green-200">
                    <div className="flex items-center space-x-2 mb-2">
                      <AlertTriangle className="h-5 w-5 text-orange-600" />
                      <h4 className="font-semibold text-gray-900">Risk Alert</h4>
                    </div>
                    <div className="text-lg font-bold text-orange-600 mb-1">Energy Transition</div>
                    <p className="text-sm text-gray-600">Regulatory pressure detected</p>
                    <div className="mt-2 text-xs text-orange-700">
                      Multi-sector impact predicted
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 border border-green-200">
                    <div className="flex items-center space-x-2 mb-2">
                      <Activity className="h-5 w-5 text-blue-600" />
                      <h4 className="font-semibold text-gray-900">Market Cycle</h4>
                    </div>
                    <div className="text-lg font-bold text-blue-600 mb-1">Mid-Cycle</div>
                    <p className="text-sm text-gray-600">78% confidence</p>
                    <div className="mt-2 text-xs text-blue-700">
                      Transition to late-cycle likely Q4
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : null}
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              {renderTrendingIndicators()}
              {renderCurrencySnapshots()}
            </div>
            <div className="space-y-6">
              {renderGeopoliticalEvents()}
              {renderActiveAlerts()}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="predictions" className="space-y-6">
          <PredictiveSectorAnalysis navigationMode={navigationMode} />
        </TabsContent>

        <TabsContent value="indicators">
          {renderIndicatorsList()}
        </TabsContent>

        <TabsContent value="currencies">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Currency Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <LineChart className="h-12 w-12 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Advanced Currency Analytics</h3>
                <p>Detailed currency pair analysis, correlation matrices, and volatility tracking would be implemented here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="geopolitical">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Geopolitical Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <MapPin className="h-12 w-12 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Geopolitical Intelligence</h3>
                <p>Comprehensive event tracking, impact analysis, and risk assessment dashboard would be implemented here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="afme">
          {renderAFMEDashboard()}
        </TabsContent>

        <TabsContent value="alerts">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Alert Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Target className="h-12 w-12 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Alert Configuration</h3>
                <p>Advanced alert management, threshold configuration, and notification settings would be implemented here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Traditional Market Intelligence Content Component
function TraditionalMarketContent({ data }: { data: MarketIntelligenceResponse }) {
  return (
    <div className="space-y-6">
      {/* Standard Market Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="h-5 w-5 mr-2" />
            Market Overview
          </CardTitle>
          <CardDescription>Real-time market data and key indicators</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {data.marketIndicators.slice(0, 8).map((indicator) => (
              <div key={indicator.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-sm">{indicator.name}</h4>
                  <Badge variant="outline">{indicator.region}</Badge>
                </div>
                <div className="text-2xl font-bold mb-1">{indicator.value}</div>
                <div className="flex items-center text-sm">
                  {indicator.change >= 0 ? (
                    <ArrowUp className="h-3 w-3 text-green-600 mr-1" />
                  ) : (
                    <ArrowDown className="h-3 w-3 text-red-600 mr-1" />
                  )}
                  <span className={indicator.change >= 0 ? 'text-green-600' : 'text-red-600'}>
                    {Math.abs(indicator.change)}%
                  </span>
                  <span className="text-gray-500 ml-2">{indicator.timeframe}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Currency Data */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <DollarSign className="h-5 w-5 mr-2" />
            Currency Monitor
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {data.currencySnapshots.slice(0, 6).map((snapshot) => (
              <div key={snapshot.pair.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="font-medium">{snapshot.pair.symbol}</div>
                  <div className="text-sm text-muted-foreground">{snapshot.pair.name}</div>
                </div>
                <div className="text-right">
                  <div className="font-medium">{snapshot.rate.toFixed(4)}</div>
                  <div className="flex items-center text-sm">
                    {snapshot.change24h >= 0 ? (
                      <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
                    ) : (
                      <TrendingDown className="h-3 w-3 text-red-600 mr-1" />
                    )}
                    <span className={snapshot.change24h >= 0 ? 'text-green-600' : 'text-red-600'}>
                      {Math.abs(snapshot.change24h)}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Geopolitical Events */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Globe className="h-5 w-5 mr-2" />
            Recent Events
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.eventSummaries.slice(0, 4).map((event) => (
              <div key={event.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold">{event.title}</h4>
                  <div className="flex items-center gap-2">
                    <Badge variant={event.severity === 'CRITICAL' ? 'destructive' : 'default'}>
                      {event.severity}
                    </Badge>
                    <Badge variant="outline">{event.region}</Badge>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-2">{event.description}</p>
                <div className="flex items-center text-xs text-gray-500">
                  <Clock className="h-3 w-3 mr-1" />
                  {new Date(event.timestamp).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Assisted Market Intelligence Content Component
function AssistedMarketContent({ data }: { data: MarketIntelligenceResponse }) {
  // AI-powered market insights
  const marketInsights = React.useMemo(() => {
    return {
      trendAnalysis: [
        {
          trend: 'USD Strengthening',
          confidence: 0.87,
          description: 'Fed rate expectations driving USD gains across major pairs',
          impact: 'HIGH',
          timeframe: '2-4 weeks',
          affectedPairs: ['EUR/USD', 'GBP/USD', 'AUD/USD']
        },
        {
          trend: 'EM Currency Pressure',
          confidence: 0.73,
          description: 'Rising geopolitical tensions affecting emerging market currencies',
          impact: 'MEDIUM',
          timeframe: '1-2 weeks',
          affectedPairs: ['USD/TRY', 'USD/ZAR', 'USD/BRL']
        }
      ],
      anomalies: [
        {
          indicator: 'VIX Index',
          normalRange: '15-25',
          currentValue: '32.4',
          deviation: '+28%',
          aiAssessment: 'Elevated volatility suggests market uncertainty'
        },
        {
          indicator: 'Gold/Silver Ratio',
          normalRange: '65-75',
          currentValue: '82.3',
          deviation: '+12%',
          aiAssessment: 'Silver underperforming indicates industrial demand weakness'
        }
      ],
      correlations: [
        {
          pair: 'Oil vs USD/CAD',
          correlation: -0.78,
          strength: 'Strong Negative',
          implication: 'Rising oil prices typically weaken USD/CAD'
        },
        {
          pair: 'Gold vs US 10Y',
          correlation: -0.65,
          strength: 'Moderate Negative',
          implication: 'Rising yields pressure gold prices'
        }
      ]
    };
  }, []);

  // Smart alerts with AI context
  const smartAlerts = data.alerts.map(alert => ({
    ...alert,
    aiContext: {
      significance: Math.random() > 0.5 ? 'HIGH' : 'MEDIUM',
      recommendation: Math.random() > 0.5 ? 'Monitor closely' : 'Consider hedging',
      historicalPattern: 'Similar patterns led to 15-25% moves in past 12 months'
    }
  }));

  return (
    <div className="space-y-6">
      {/* AI Market Insights */}
      <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Brain className="h-5 w-5 mr-2 text-blue-600" />
              AI Market Insights
            </div>
            <Badge variant="secondary" className="bg-blue-100 text-blue-700">
              {marketInsights.trendAnalysis.length} Active Trends
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3 text-blue-800">Trend Analysis</h4>
              <div className="space-y-3">
                {marketInsights.trendAnalysis.map((trend, idx) => (
                  <div key={idx} className="p-3 bg-white rounded-lg border border-blue-200">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-medium">{trend.trend}</h5>
                      <Badge className={`${
                        trend.impact === 'HIGH' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {trend.impact}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{trend.description}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Confidence: {Math.round(trend.confidence * 100)}%</span>
                      <span>Timeframe: {trend.timeframe}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-3 text-blue-800">Market Anomalies</h4>
              <div className="space-y-3">
                {marketInsights.anomalies.map((anomaly, idx) => (
                  <div key={idx} className="p-3 bg-white rounded-lg border border-orange-200">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-medium">{anomaly.indicator}</h5>
                      <Badge variant="outline" className="text-orange-700">
                        {anomaly.deviation}
                      </Badge>
                    </div>
                    <div className="text-sm space-y-1">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Normal:</span>
                        <span>{anomaly.normalRange}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Current:</span>
                        <span className="font-medium">{anomaly.currentValue}</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 mt-2">{anomaly.aiAssessment}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Smart Correlation Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Target className="h-5 w-5 mr-2 text-indigo-600" />
            AI Correlation Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {marketInsights.correlations.map((corr, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <h5 className="font-medium">{corr.pair}</h5>
                  <p className="text-sm text-gray-600">{corr.implication}</p>
                </div>
                <div className="text-right">
                  <div className="font-medium">{corr.correlation}</div>
                  <div className="text-xs text-gray-500">{corr.strength}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Alerts with AI Context */}
      {smartAlerts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="h-5 w-5 mr-2 text-red-600" />
              Smart Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {smartAlerts.map((alert) => (
                <div key={alert.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="font-semibold">{alert.title}</h4>
                      <p className="text-sm text-gray-600">{alert.description}</p>
                    </div>
                    <Badge variant={alert.priority === 'HIGH' ? 'destructive' : 'default'}>
                      {alert.priority}
                    </Badge>
                  </div>
                  <div className="bg-blue-50 p-3 rounded border border-blue-200">
                    <h5 className="font-medium text-blue-800 mb-1">AI Analysis</h5>
                    <div className="text-sm text-blue-700 space-y-1">
                      <div><strong>Significance:</strong> {alert.aiContext.significance}</div>
                      <div><strong>Recommendation:</strong> {alert.aiContext.recommendation}</div>
                      <div><strong>Historical Pattern:</strong> {alert.aiContext.historicalPattern}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Traditional Content Enhanced */}
      <TraditionalMarketContent data={data} />
    </div>
  );
}

// Autonomous Market Intelligence Content Component
function AutonomousMarketContent({ data }: { data: MarketIntelligenceResponse }) {
  // Autonomous monitoring state
  const [autonomousActions, setAutonomousActions] = React.useState([
    {
      id: 'auto-alert-1',
      type: 'monitoring' as const,
      title: 'Volatility Spike Auto-Detected',
      description: 'VIX surge above 30 triggered automated portfolio rebalancing alerts. Risk management teams notified.',
      status: 'completed' as const,
      timestamp: new Date(Date.now() - 1800000), // 30 min ago
      impact: 'Prevented potential 2-3% portfolio drawdown',
      confidence: 0.93
    },
    {
      id: 'auto-corr-1',
      type: 'analysis' as const,
      title: 'Cross-Asset Correlation Shift',
      description: 'AI detected breakdown in traditional stock-bond correlation. Automatically updated risk models.',
      status: 'in_progress' as const,
      timestamp: new Date(Date.now() - 900000), // 15 min ago
      impact: 'Enhanced risk assessment accuracy by 15%',
      confidence: 0.87
    }
  ]);

  // Autonomous predictions
  const [predictions] = React.useState([
    {
      id: 'pred-1',
      asset: 'EUR/USD',
      direction: 'DOWN' as const,
      targetRange: '1.0850 - 1.0920',
      timeframe: '5-7 days',
      confidence: 0.82,
      reasoning: 'ECB dovish signals + USD strength momentum',
      probability: 78
    },
    {
      id: 'pred-2',
      asset: 'Gold',
      direction: 'UP' as const,
      targetRange: '$2,120 - $2,180',
      timeframe: '2-3 weeks',
      confidence: 0.75,
      reasoning: 'Geopolitical tensions + inflation hedge demand',
      probability: 71
    }
  ]);

  // Real-time autonomous monitoring
  const [realTimeMonitoring] = React.useState({
    activeScans: 247,
    anomaliesDetected: 12,
    alertsSent: 8,
    correlationsTracked: 1834,
    predictionAccuracy: 84.2,
    lastScan: new Date(Date.now() - 30000) // 30 seconds ago
  });

  return (
    <div className="space-y-6">
      {/* Autonomous Operations Status */}
      <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-indigo-50">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Zap className="h-5 w-5 mr-2 text-purple-600" />
              Autonomous Market Intelligence
            </div>
            <Badge variant="outline" className="border-purple-200 text-purple-700 bg-purple-50">
              {autonomousActions.filter(a => a.status === 'in_progress').length} Active
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-3 bg-white rounded-lg border border-purple-200">
              <div className="text-xl font-bold text-purple-600">{realTimeMonitoring.activeScans}</div>
              <div className="text-xs text-purple-700">Active Scans</div>
            </div>
            <div className="text-center p-3 bg-white rounded-lg border border-orange-200">
              <div className="text-xl font-bold text-orange-600">{realTimeMonitoring.anomaliesDetected}</div>
              <div className="text-xs text-orange-700">Anomalies Found</div>
            </div>
            <div className="text-center p-3 bg-white rounded-lg border border-green-200">
              <div className="text-xl font-bold text-green-600">{realTimeMonitoring.predictionAccuracy}%</div>
              <div className="text-xs text-green-700">Accuracy Rate</div>
            </div>
            <div className="text-center p-3 bg-white rounded-lg border border-blue-200">
              <div className="text-xl font-bold text-blue-600">{realTimeMonitoring.correlationsTracked}</div>
              <div className="text-xs text-blue-700">Correlations</div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-medium">Recent Autonomous Actions</h4>
            {autonomousActions.map(action => (
              <div 
                key={action.id}
                className={`p-3 border rounded-lg ${
                  action.status === 'completed' ? 'border-green-200 bg-green-50' :
                  'border-blue-200 bg-blue-50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-1">
                      {action.status === 'completed' && <CheckCircle className="h-4 w-4 text-green-600 mr-2" />}
                      {action.status === 'in_progress' && <Clock className="h-4 w-4 text-blue-600 mr-2" />}
                      <h5 className="font-medium">{action.title}</h5>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{action.description}</p>
                    <div className="text-xs text-gray-500">
                      Impact: {action.impact} • Confidence: {Math.round(action.confidence * 100)}%
                    </div>
                  </div>
                  <Badge size="sm" className={
                    action.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                  }>
                    {action.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI Predictions Dashboard */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Brain className="h-5 w-5 mr-2 text-indigo-600" />
            Autonomous Predictions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {predictions.map(prediction => (
              <div key={prediction.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-lg">{prediction.asset}</h4>
                  <div className="flex items-center gap-2">
                    <Badge className={
                      prediction.direction === 'UP' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }>
                      {prediction.direction === 'UP' ? '↗ BULLISH' : '↘ BEARISH'}
                    </Badge>
                    <Badge variant="outline">{prediction.probability}% probability</Badge>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-600">Target:</span>
                    <p className="font-medium">{prediction.targetRange}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Timeframe:</span>
                    <p className="font-medium">{prediction.timeframe}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Confidence:</span>
                    <p className="font-medium">{Math.round(prediction.confidence * 100)}%</p>
                  </div>
                </div>
                
                <div className="mt-3 p-2 bg-gray-50 rounded text-sm">
                  <strong>AI Reasoning:</strong> {prediction.reasoning}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Real-time Monitoring Feed */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Activity className="h-5 w-5 mr-2 text-orange-600" />
              Live Market Feed
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
              Last update: {formatDate(realTimeMonitoring.lastScan)}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-2 bg-green-50 rounded text-sm">
              <span>✓ EUR/USD correlation analysis completed</span>
              <span className="text-gray-500">2m ago</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-orange-50 rounded text-sm">
              <span>⚠ VIX volatility spike detected (+8.2%)</span>
              <span className="text-gray-500">5m ago</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-blue-50 rounded text-sm">
              <span>ℹ Gold support level holding at $2,095</span>
              <span className="text-gray-500">12m ago</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Assisted Content */}
      <AssistedMarketContent data={data} />
    </div>
  );
}