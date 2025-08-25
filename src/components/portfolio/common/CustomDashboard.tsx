'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUnifiedPortfolio } from '../contexts/UnifiedPortfolioContext';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  ComposedChart
} from 'recharts';

interface DashboardWidget {
  id: string;
  type: 'metric' | 'chart' | 'table' | 'news' | 'activity' | 'alert';
  title: string;
  size: 'small' | 'medium' | 'large' | 'extra-large';
  position: { x: number; y: number; w: number; h: number };
  config: any;
  isVisible: boolean;
  refreshInterval?: number; // minutes
  lastUpdated: string;
}

interface DashboardLayout {
  id: string;
  name: string;
  description: string;
  isDefault: boolean;
  widgets: DashboardWidget[];
  createdAt: string;
  updatedAt: string;
}

interface UserPreference {
  id: string;
  category: 'display' | 'notifications' | 'data' | 'analysis';
  name: string;
  value: any;
  description: string;
}

interface WatchlistItem {
  id: string;
  assetId: string;
  assetName: string;
  alerts: Array<{
    type: 'price_change' | 'valuation_update' | 'news' | 'performance';
    threshold: number;
    isActive: boolean;
  }>;
  addedAt: string;
}

export function CustomDashboard() {
  const { state, analytics, professionalMetrics } = useUnifiedPortfolio();
  const [selectedTab, setSelectedTab] = useState('dashboard');
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedLayout, setSelectedLayout] = useState('default');

  // Mock dashboard layouts
  const dashboardLayouts: DashboardLayout[] = useMemo(() => [
    {
      id: 'default',
      name: 'Executive Summary',
      description: 'High-level portfolio overview for partners',
      isDefault: true,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-15T10:30:00Z',
      widgets: [
        {
          id: 'widget-1',
          type: 'metric',
          title: 'Total Portfolio Value',
          size: 'medium',
          position: { x: 0, y: 0, w: 6, h: 4 },
          config: { metric: 'totalValue', format: 'currency' },
          isVisible: true,
          lastUpdated: '2024-01-15T10:30:00Z'
        },
        {
          id: 'widget-2',
          type: 'metric',
          title: 'Net IRR',
          size: 'medium',
          position: { x: 6, y: 0, w: 6, h: 4 },
          config: { metric: 'netIRR', format: 'percentage' },
          isVisible: true,
          lastUpdated: '2024-01-15T10:30:00Z'
        },
        {
          id: 'widget-3',
          type: 'chart',
          title: 'Performance Trend',
          size: 'large',
          position: { x: 0, y: 4, w: 12, h: 6 },
          config: { chartType: 'line', dataSource: 'performance' },
          isVisible: true,
          lastUpdated: '2024-01-15T10:30:00Z'
        },
        {
          id: 'widget-4',
          type: 'table',
          title: 'Top Performers',
          size: 'large',
          position: { x: 0, y: 10, w: 12, h: 6 },
          config: { tableType: 'topPerformers', limit: 10 },
          isVisible: true,
          lastUpdated: '2024-01-15T10:30:00Z'
        }
      ]
    },
    {
      id: 'analytics',
      name: 'Analytics Deep Dive',
      description: 'Detailed analytical view for principals and VPs',
      isDefault: false,
      createdAt: '2024-01-10T00:00:00Z',
      updatedAt: '2024-01-14T15:45:00Z',
      widgets: [
        {
          id: 'widget-5',
          type: 'chart',
          title: 'Risk-Return Analysis',
          size: 'large',
          position: { x: 0, y: 0, w: 8, h: 8 },
          config: { chartType: 'scatter', dataSource: 'riskReturn' },
          isVisible: true,
          lastUpdated: '2024-01-14T15:45:00Z'
        },
        {
          id: 'widget-6',
          type: 'metric',
          title: 'Sharpe Ratio',
          size: 'medium',
          position: { x: 8, y: 0, w: 4, h: 4 },
          config: { metric: 'sharpeRatio', format: 'decimal' },
          isVisible: true,
          lastUpdated: '2024-01-14T15:45:00Z'
        },
        {
          id: 'widget-7',
          type: 'chart',
          title: 'Sector Attribution',
          size: 'large',
          position: { x: 0, y: 8, w: 12, h: 6 },
          config: { chartType: 'bar', dataSource: 'sectorAttribution' },
          isVisible: true,
          lastUpdated: '2024-01-14T15:45:00Z'
        }
      ]
    },
    {
      id: 'operational',
      name: 'Operations Dashboard',
      description: 'Workflow and operational metrics for operations team',
      isDefault: false,
      createdAt: '2024-01-12T00:00:00Z',
      updatedAt: '2024-01-13T11:20:00Z',
      widgets: [
        {
          id: 'widget-8',
          type: 'activity',
          title: 'Recent Activity',
          size: 'large',
          position: { x: 0, y: 0, w: 8, h: 8 },
          config: { activityType: 'all', limit: 20 },
          isVisible: true,
          lastUpdated: '2024-01-13T11:20:00Z'
        },
        {
          id: 'widget-9',
          type: 'alert',
          title: 'Active Alerts',
          size: 'medium',
          position: { x: 8, y: 0, w: 4, h: 4 },
          config: { alertTypes: ['risk', 'compliance', 'deadline'] },
          isVisible: true,
          lastUpdated: '2024-01-13T11:20:00Z'
        },
        {
          id: 'widget-10',
          type: 'metric',
          title: 'Task Completion Rate',
          size: 'medium',
          position: { x: 8, y: 4, w: 4, h: 4 },
          config: { metric: 'taskCompletion', format: 'percentage' },
          isVisible: true,
          lastUpdated: '2024-01-13T11:20:00Z'
        }
      ]
    }
  ], []);

  // Mock user preferences
  const userPreferences: UserPreference[] = useMemo(() => [
    {
      id: 'pref-1',
      category: 'display',
      name: 'Default Currency',
      value: 'USD',
      description: 'Primary currency for displaying financial data'
    },
    {
      id: 'pref-2',
      category: 'display',
      name: 'Date Format',
      value: 'MM/DD/YYYY',
      description: 'Preferred date format for all displays'
    },
    {
      id: 'pref-3',
      category: 'display',
      name: 'Number Format',
      value: 'US',
      description: 'Number formatting style (US: 1,000.00 vs EU: 1.000,00)'
    },
    {
      id: 'pref-4',
      category: 'notifications',
      name: 'Email Alerts',
      value: true,
      description: 'Receive email notifications for important alerts'
    },
    {
      id: 'pref-5',
      category: 'notifications',
      name: 'Push Notifications',
      value: false,
      description: 'Receive browser push notifications'
    },
    {
      id: 'pref-6',
      category: 'data',
      name: 'Auto Refresh Interval',
      value: 15,
      description: 'How often to refresh dashboard data (minutes)'
    },
    {
      id: 'pref-7',
      category: 'analysis',
      name: 'Default Benchmark',
      value: 'S&P 500',
      description: 'Default benchmark for performance comparisons'
    },
    {
      id: 'pref-8',
      category: 'analysis',
      name: 'Risk Tolerance',
      value: 'moderate',
      description: 'Risk tolerance level for recommendations'
    }
  ], []);

  // Mock watchlist
  const watchlist: WatchlistItem[] = useMemo(() => [
    {
      id: 'watch-1',
      assetId: 'asset-1',
      assetName: 'TechCorp Inc',
      alerts: [
        { type: 'valuation_update', threshold: 5, isActive: true },
        { type: 'performance', threshold: -10, isActive: true }
      ],
      addedAt: '2024-01-10T09:00:00Z'
    },
    {
      id: 'watch-2',
      assetId: 'asset-3',
      assetName: 'Solar Energy Facility',
      alerts: [
        { type: 'news', threshold: 1, isActive: true },
        { type: 'valuation_update', threshold: 3, isActive: true }
      ],
      addedAt: '2024-01-12T14:30:00Z'
    }
  ], []);

  const currentLayout = dashboardLayouts.find(l => l.id === selectedLayout) || dashboardLayouts[0];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${(value * 100).toFixed(1)}%`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'display': return 'bg-blue-100 text-blue-800';
      case 'notifications': return 'bg-green-100 text-green-800';
      case 'data': return 'bg-blue-100 text-blue-800';
      case 'analysis': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderWidget = (widget: DashboardWidget) => {
    const baseClasses = "h-full";
    
    switch (widget.type) {
      case 'metric':
        if (!analytics && !professionalMetrics) return null;
        
        let value = 0;
        let label = widget.title;
        
        if (widget.config.metric === 'totalValue' && analytics) {
          value = analytics.totalPortfolioValue;
        } else if (widget.config.metric === 'netIRR' && analytics) {
          value = analytics.weightedIRR;
        } else if (widget.config.metric === 'sharpeRatio' && professionalMetrics) {
          value = professionalMetrics.sharpeRatio;
        }
        
        return (
          <Card className={baseClasses}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">{label}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {widget.config.format === 'currency' ? formatCurrency(value) :
                 widget.config.format === 'percentage' ? formatPercentage(value) :
                 value.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Updated {new Date(widget.lastUpdated).toLocaleTimeString()}
              </p>
            </CardContent>
          </Card>
        );
        
      case 'chart':
        const chartData = analytics ? [
          { month: 'Jan', value: analytics.totalPortfolioValue * 0.85 },
          { month: 'Feb', value: analytics.totalPortfolioValue * 0.88 },
          { month: 'Mar', value: analytics.totalPortfolioValue * 0.92 },
          { month: 'Apr', value: analytics.totalPortfolioValue * 0.95 },
          { month: 'May', value: analytics.totalPortfolioValue }
        ] : [];
        
        return (
          <Card className={baseClasses}>
            <CardHeader>
              <CardTitle>{widget.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                  <Line type="monotone" dataKey="value" stroke="#0088FE" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        );
        
      case 'table':
        const tableData = state.currentPortfolio?.assets.slice(0, 5).map(asset => ({
          name: asset.name,
          value: asset.currentValue,
          return: ((asset.currentValue - asset.acquisitionValue) / asset.acquisitionValue) * 100
        })) || [];
        
        return (
          <Card className={baseClasses}>
            <CardHeader>
              <CardTitle>{widget.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b">
                    <tr>
                      <th className="text-left p-2">Asset</th>
                      <th className="text-right p-2">Value</th>
                      <th className="text-right p-2">Return</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tableData.map((row, index) => (
                      <tr key={index} className="border-b">
                        <td className="p-2 font-medium">{row.name}</td>
                        <td className="p-2 text-right">{formatCurrency(row.value)}</td>
                        <td className={`p-2 text-right font-medium ${
                          row.return >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {row.return >= 0 ? '+' : ''}{row.return.toFixed(1)}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        );
        
      case 'activity':
        return (
          <Card className={baseClasses}>
            <CardHeader>
              <CardTitle>{widget.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { time: '2 hours ago', action: 'Valuation updated for TechCorp Inc', type: 'update' },
                  { time: '4 hours ago', action: 'New task assigned: Q4 Portfolio Review', type: 'task' },
                  { time: '1 day ago', action: 'Risk alert: High concentration in Technology', type: 'alert' },
                  { time: '2 days ago', action: 'Capital call completed: $5M collected', type: 'capital' }
                ].map((activity, index) => (
                  <div key={index} className="flex items-center space-x-3 p-2 bg-gray-50 rounded-lg">
                    <div className={`w-2 h-2 rounded-full ${
                      activity.type === 'alert' ? 'bg-red-400' :
                      activity.type === 'update' ? 'bg-blue-400' :
                      activity.type === 'task' ? 'bg-green-400' : 'bg-blue-400'
                    }`}></div>
                    <div className="flex-1">
                      <p className="text-sm">{activity.action}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        );
        
      case 'alert':
        return (
          <Card className={baseClasses}>
            <CardHeader>
              <CardTitle>{widget.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {[
                  { message: 'High sector concentration', severity: 'high' },
                  { message: 'Task deadline approaching', severity: 'medium' },
                  { message: 'Liquidity below threshold', severity: 'medium' }
                ].map((alert, index) => (
                  <div key={index} className={`p-2 rounded-lg text-sm ${
                    alert.severity === 'high' ? 'bg-red-50 text-red-800' :
                    alert.severity === 'medium' ? 'bg-yellow-50 text-yellow-800' :
                    'bg-blue-50 text-blue-800'
                  }`}>
                    {alert.message}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        );
        
      default:
        return (
          <Card className={baseClasses}>
            <CardContent className="flex items-center justify-center h-full">
              <p className="text-gray-500">Unknown widget type: {widget.type}</p>
            </CardContent>
          </Card>
        );
    }
  };

  if (!state.currentPortfolio) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">No portfolio data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="layouts">Layouts</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
          <TabsTrigger value="watchlist">Watchlist</TabsTrigger>
        </TabsList>

        {/* Dashboard Tab */}
        <TabsContent value="dashboard" className="space-y-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <h3 className="text-lg font-semibold">Custom Dashboard</h3>
              <select
                value={selectedLayout}
                onChange={(e) => setSelectedLayout(e.target.value)}
                className="px-3 py-1 text-sm border border-gray-300 rounded-md"
              >
                {dashboardLayouts.map(layout => (
                  <option key={layout.id} value={layout.id}>{layout.name}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                size="sm"
                variant={isEditMode ? "default" : "outline"}
                onClick={() => setIsEditMode(!isEditMode)}
              >
                {isEditMode ? 'Save Layout' : 'Edit Layout'}
              </Button>
              <Button size="sm" variant="outline">Add Widget</Button>
              <Button size="sm" variant="outline">Reset</Button>
            </div>
          </div>

          {/* Dashboard Grid */}
          <div className="grid grid-cols-12 gap-4 min-h-screen">
            {currentLayout.widgets.filter(w => w.isVisible).map((widget) => (
              <div
                key={widget.id}
                className={`${
                  widget.position.w === 3 ? 'col-span-3' :
                  widget.position.w === 4 ? 'col-span-4' :
                  widget.position.w === 6 ? 'col-span-6' :
                  widget.position.w === 8 ? 'col-span-8' :
                  widget.position.w === 12 ? 'col-span-12' :
                  'col-span-4'
                } ${
                  widget.position.h === 4 ? 'row-span-1' :
                  widget.position.h === 6 ? 'row-span-2' :
                  widget.position.h === 8 ? 'row-span-3' :
                  'row-span-1'
                } ${isEditMode ? 'ring-2 ring-blue-300 ring-dashed' : ''}`}
                style={{ minHeight: `${widget.position.h * 60}px` }}
              >
                {isEditMode && (
                  <div className="flex justify-end space-x-1 mb-2">
                    <Button size="sm" variant="outline" className="h-6 w-6 p-0">×</Button>
                    <Button size="sm" variant="outline" className="h-6 w-6 p-0">⚙</Button>
                  </div>
                )}
                {renderWidget(widget)}
              </div>
            ))}
          </div>
        </TabsContent>

        {/* Layouts Tab */}
        <TabsContent value="layouts" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Dashboard Layouts</h3>
            <Button size="sm">Create New Layout</Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dashboardLayouts.map((layout) => (
              <Card key={layout.id} className={`cursor-pointer transition-colors ${
                selectedLayout === layout.id ? 'ring-2 ring-blue-500' : ''
              }`} onClick={() => setSelectedLayout(layout.id)}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{layout.name}</CardTitle>
                      <p className="text-sm text-gray-600 mt-1">{layout.description}</p>
                    </div>
                    {layout.isDefault && (
                      <Badge className="bg-blue-100 text-blue-800">Default</Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="grid grid-cols-4 gap-1 h-12">
                      {layout.widgets.map((widget, index) => (
                        <div
                          key={widget.id}
                          className={`bg-gray-200 rounded ${
                            widget.position.w === 6 ? 'col-span-2' :
                            widget.position.w === 12 ? 'col-span-4' :
                            'col-span-1'
                          }`}
                          title={widget.title}
                        ></div>
                      ))}
                    </div>
                    
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>{layout.widgets.length} widgets</span>
                      <span>Updated {formatDate(layout.updatedAt)}</span>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        {selectedLayout === layout.id ? 'Current' : 'Select'}
                      </Button>
                      <Button size="sm" variant="outline">Edit</Button>
                      <Button size="sm" variant="outline">Copy</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Preferences Tab */}
        <TabsContent value="preferences" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">User Preferences</h3>
            <Button size="sm">Reset to Defaults</Button>
          </div>

          <div className="space-y-6">
            {Object.entries(
              userPreferences.reduce((acc, pref) => {
                if (!acc[pref.category]) acc[pref.category] = [];
                acc[pref.category].push(pref);
                return acc;
              }, {} as { [key: string]: UserPreference[] })
            ).map(([category, prefs]) => (
              <Card key={category}>
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <Badge className={getCategoryColor(category)}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {prefs.map((pref) => (
                      <div key={pref.id} className="flex justify-between items-center">
                        <div className="flex-1">
                          <h4 className="font-medium">{pref.name}</h4>
                          <p className="text-sm text-gray-600">{pref.description}</p>
                        </div>
                        <div className="ml-4">
                          {typeof pref.value === 'boolean' ? (
                            <Button
                              size="sm"
                              variant={pref.value ? "default" : "outline"}
                              onClick={() => {}}
                            >
                              {pref.value ? 'Enabled' : 'Disabled'}
                            </Button>
                          ) : typeof pref.value === 'number' ? (
                            <input
                              type="number"
                              value={pref.value}
                              onChange={() => {}}
                              className="w-20 px-2 py-1 text-sm border border-gray-300 rounded"
                            />
                          ) : (
                            <select
                              value={pref.value}
                              onChange={() => {}}
                              className="px-3 py-1 text-sm border border-gray-300 rounded"
                            >
                              <option value={pref.value}>{pref.value}</option>
                            </select>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Watchlist Tab */}
        <TabsContent value="watchlist" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Portfolio Watchlist</h3>
            <Button size="sm">Add to Watchlist</Button>
          </div>

          <div className="space-y-4">
            {watchlist.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-semibold text-lg">{item.assetName}</h4>
                      <p className="text-sm text-gray-600">
                        Added {formatDate(item.addedAt)}
                      </p>
                    </div>
                    <Button size="sm" variant="outline">Remove</Button>
                  </div>

                  <div className="space-y-3">
                    <h5 className="font-medium">Active Alerts</h5>
                    {item.alerts.map((alert, index) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className={`w-2 h-2 rounded-full ${
                            alert.isActive ? 'bg-green-400' : 'bg-gray-400'
                          }`}></div>
                          <div>
                            <span className="text-sm font-medium capitalize">
                              {alert.type.replace('_', ' ')}
                            </span>
                            <p className="text-xs text-gray-600">
                              Threshold: {alert.threshold}
                              {alert.type.includes('change') || alert.type === 'performance' ? '%' : ''}
                            </p>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant={alert.isActive ? "default" : "outline"}
                          onClick={() => {}}
                        >
                          {alert.isActive ? 'Active' : 'Inactive'}
                        </Button>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 pt-4 border-t">
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">Configure Alerts</Button>
                      <Button size="sm" variant="outline">View Details</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {watchlist.length === 0 && (
            <Card>
              <CardContent className="flex items-center justify-center h-32">
                <div className="text-center">
                  <p className="text-gray-500 mb-2">No items in your watchlist</p>
                  <Button size="sm">Add Your First Item</Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}