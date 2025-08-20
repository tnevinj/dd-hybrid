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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
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
    </div>
  );

  const renderTrendingIndicators = () => (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Trending Indicators
          {navigationMode === 'assisted' && (
            <Badge variant="outline">AI-Enhanced</Badge>
          )}
        </CardTitle>
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
            <Badge variant="outline">Auto-Tracking</Badge>
          )}
        </CardTitle>
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
            <Badge variant="outline">Smart Detection</Badge>
          )}
        </CardTitle>
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
            <Badge variant="outline">Smart Alerts</Badge>
          )}
        </CardTitle>
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
          <TabsTrigger value="indicators">Indicators</TabsTrigger>
          <TabsTrigger value="currencies">Currencies</TabsTrigger>
          <TabsTrigger value="geopolitical">Geopolitical</TabsTrigger>
          <TabsTrigger value="afme">AFME</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
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