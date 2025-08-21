import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  BarChart3, 
  Calculator, 
  Database, 
  TrendingUp, 
  User, 
  PieChart,
  LineChart,
  Activity,
  Target,
  Brain,
  AlertTriangle,
  CheckCircle,
  Clock,
  Zap,
  Eye,
  Download,
  Settings
} from 'lucide-react';
import type { TraditionalModeProps } from '@/types/shared';

export const AdvancedAnalyticsTraditionalRefactored: React.FC<TraditionalModeProps> = ({ 
  metrics, 
  isLoading,
  onSwitchMode
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedTimeframe, setSelectedTimeframe] = useState('12m');
  const [selectedModel, setSelectedModel] = useState('portfolio-performance');
  
  // Mock data for demonstrations
  const portfolioPerformanceData = useMemo(() => ([
    { month: 'Jan', returns: 2.1, benchmark: 1.8, volatility: 12.5 },
    { month: 'Feb', returns: -0.8, benchmark: 0.2, volatility: 14.2 },
    { month: 'Mar', returns: 3.2, benchmark: 2.9, volatility: 11.8 },
    { month: 'Apr', returns: 1.7, benchmark: 1.4, volatility: 13.1 },
    { month: 'May', returns: 2.9, benchmark: 2.1, volatility: 12.9 },
    { month: 'Jun', returns: -1.2, benchmark: -0.9, volatility: 15.3 },
    { month: 'Jul', returns: 4.1, benchmark: 3.2, volatility: 10.7 },
    { month: 'Aug', returns: 0.9, benchmark: 1.1, volatility: 13.8 },
    { month: 'Sep', returns: 2.3, benchmark: 1.9, volatility: 12.4 },
    { month: 'Oct', returns: 3.8, benchmark: 2.7, volatility: 11.2 },
    { month: 'Nov', returns: 1.4, benchmark: 1.6, volatility: 14.0 },
    { month: 'Dec', returns: 2.7, benchmark: 2.3, volatility: 12.1 }
  ]), []);
  
  const correlationMatrix = useMemo(() => ([
    { asset: 'US Equity', usEquity: 1.00, intlEquity: 0.72, bonds: -0.15, reits: 0.68, commodities: 0.31 },
    { asset: 'Intl Equity', usEquity: 0.72, intlEquity: 1.00, bonds: -0.08, reits: 0.54, commodities: 0.28 },
    { asset: 'Bonds', usEquity: -0.15, intlEquity: -0.08, bonds: 1.00, reits: 0.12, commodities: -0.22 },
    { asset: 'REITs', usEquity: 0.68, intlEquity: 0.54, bonds: 0.12, reits: 1.00, commodities: 0.41 },
    { asset: 'Commodities', usEquity: 0.31, intlEquity: 0.28, bonds: -0.22, reits: 0.41, commodities: 1.00 }
  ]), []);
  
  const scenarioAnalysis = useMemo(() => ([
    { scenario: 'Base Case', probability: 0.5, return: 12.4, volatility: 14.2, sharpeRatio: 0.71 },
    { scenario: 'Bull Market', probability: 0.25, return: 18.7, volatility: 16.8, sharpeRatio: 0.89 },
    { scenario: 'Bear Market', probability: 0.15, return: -8.2, volatility: 22.1, sharpeRatio: -0.52 },
    { scenario: 'Recession', probability: 0.1, return: -15.4, volatility: 28.7, sharpeRatio: -0.68 }
  ]), []);
  
  const statisticalModels = useMemo(() => ([
    {
      id: 'portfolio-performance',
      name: 'Portfolio Performance Model',
      type: 'Regression',
      status: 'Active',
      accuracy: 87.3,
      lastUpdated: '2024-01-15',
      description: 'Multi-factor model predicting portfolio returns',
      metrics: { rSquared: 0.82, adjRSquared: 0.79, fStat: 45.2, pValue: 0.001 }
    },
    {
      id: 'risk-assessment',
      name: 'Risk Assessment Framework',
      type: 'Monte Carlo',
      status: 'Active',
      accuracy: 91.7,
      lastUpdated: '2024-01-12',
      description: 'VaR and CVaR calculations with stress testing',
      metrics: { var95: -4.2, cvar95: -6.8, maxDrawdown: -12.4, volatility: 15.3 }
    },
    {
      id: 'correlation-model',
      name: 'Asset Correlation Model',
      type: 'Time Series',
      status: 'In Development',
      accuracy: 78.9,
      lastUpdated: '2024-01-10',
      description: 'Dynamic correlation analysis across asset classes',
      metrics: { correlation: 0.73, stability: 0.65, persistence: 0.82, halfLife: 45 }
    },
    {
      id: 'factor-model',
      name: 'Factor Attribution Model',
      type: 'Multi-Factor',
      status: 'Testing',
      accuracy: 84.1,
      lastUpdated: '2024-01-08',
      description: 'Performance attribution across risk factors',
      metrics: { factorR2: 0.76, activeReturn: 2.3, trackingError: 4.1, infoRatio: 0.56 }
    }
  ]), []);
  
  const getCorrelationColor = (value: number) => {
    const absValue = Math.abs(value);
    if (absValue > 0.7) return 'bg-red-100 text-red-800';
    if (absValue > 0.4) return 'bg-yellow-100 text-yellow-800';
    if (absValue > 0.2) return 'bg-blue-100 text-blue-800';
    return 'bg-gray-100 text-gray-800';
  };
  
  const formatNumber = (num: number, decimals = 2) => {
    return num.toFixed(decimals);
  };
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <div className="flex items-center space-x-3">
            <h1 className="text-3xl font-bold text-gray-900">Advanced Analytics Platform</h1>
            <Badge className="bg-gray-100 text-gray-800 border border-gray-300 flex items-center space-x-1">
              <User className="h-3 w-3" />
              <span>Traditional Mode</span>
            </Badge>
          </div>
          <p className="text-gray-600 mt-1">Comprehensive statistical modeling and predictive analytics</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" disabled={isLoading}>
            <Download className="h-4 w-4 mr-2" />
            Export Analysis
          </Button>
          <Button className="bg-gray-700 hover:bg-gray-800" disabled={isLoading}>
            <Calculator className="h-4 w-4 mr-2" />
            New Analysis
          </Button>
        </div>
      </div>

      {/* Enhanced KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <Card className="border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2 mb-2">
              <BarChart3 className="h-5 w-5 text-blue-600" />
              <p className="text-sm text-gray-600 font-medium">Total Analyses</p>
            </div>
            <p className="text-3xl font-bold text-gray-900">{metrics.totalAnalyses || 1247}</p>
            <div className="flex items-center text-sm text-gray-500 mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              <span>+12% this month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2 mb-2">
              <Brain className="h-5 w-5 text-purple-600" />
              <p className="text-sm text-gray-600 font-medium">Active Models</p>
            </div>
            <p className="text-3xl font-bold text-gray-900">{metrics.activeModels || 23}</p>
            <div className="flex items-center text-sm text-gray-500 mt-1">
              <CheckCircle className="h-3 w-3 mr-1" />
              <span>18 validated</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2 mb-2">
              <Database className="h-5 w-5 text-green-600" />
              <p className="text-sm text-gray-600 font-medium">Data Points</p>
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {metrics.dataPoints ? (metrics.dataPoints / 1e6).toFixed(1) + 'M' : '2.4M'}
            </p>
            <div className="flex items-center text-sm text-gray-500 mt-1">
              <Activity className="h-3 w-3 mr-1" />
              <span>Real-time processing</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2 mb-2">
              <Target className="h-5 w-5 text-orange-600" />
              <p className="text-sm text-gray-600 font-medium">Accuracy Rate</p>
            </div>
            <p className="text-3xl font-bold text-gray-900">87.3%</p>
            <div className="flex items-center text-sm text-gray-500 mt-1">
              <Zap className="h-3 w-3 mr-1" />
              <span>Model average</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2 mb-2">
              <Clock className="h-5 w-5 text-red-600" />
              <p className="text-sm text-gray-600 font-medium">Processing</p>
            </div>
            <p className="text-3xl font-bold text-gray-900">{metrics.runningSimulations || 8}</p>
            <div className="flex items-center text-sm text-gray-500 mt-1">
              <Activity className="h-3 w-3 mr-1" />
              <span>Active simulations</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Analytics Interface */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="models">Models</TabsTrigger>
          <TabsTrigger value="correlations">Correlations</TabsTrigger>
          <TabsTrigger value="scenarios">Scenarios</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Portfolio Performance Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-gray-200">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Portfolio Performance Trend</CardTitle>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" 
                            className={selectedTimeframe === '6m' ? 'bg-gray-100' : ''}
                            onClick={() => setSelectedTimeframe('6m')}>6M</Button>
                    <Button variant="outline" size="sm"
                            className={selectedTimeframe === '12m' ? 'bg-gray-100' : ''}
                            onClick={() => setSelectedTimeframe('12m')}>12M</Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg mb-4">
                  <div className="text-center">
                    <LineChart className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Interactive Performance Chart</p>
                    <p className="text-xs text-gray-500">Returns vs Benchmark Over Time</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="text-center">
                    <p className="font-semibold text-green-600">+14.7%</p>
                    <p className="text-gray-600">YTD Return</p>
                  </div>
                  <div className="text-center">
                    <p className="font-semibold text-blue-600">+12.4%</p>
                    <p className="text-gray-600">Benchmark</p>
                  </div>
                  <div className="text-center">
                    <p className="font-semibold text-purple-600">+2.3%</p>
                    <p className="text-gray-600">Alpha</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle>Risk Metrics Dashboard</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Portfolio Volatility</span>
                    <span className="text-sm">14.2%</span>
                  </div>
                  <Progress value={71} className="h-2" />
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Sharpe Ratio</span>
                    <span className="text-sm">0.87</span>
                  </div>
                  <Progress value={87} className="h-2" />
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Max Drawdown</span>
                    <span className="text-sm">-8.4%</span>
                  </div>
                  <Progress value={16} className="h-2" />
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Value at Risk (95%)</span>
                    <span className="text-sm">-4.2%</span>
                  </div>
                  <Progress value={42} className="h-2" />
                </div>
                
                <div className="mt-6 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-yellow-800">Risk Alert</p>
                      <p className="text-xs text-yellow-700">Portfolio correlation increased to 0.78 - diversification may be compromised</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Recent Analysis Results</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span>Factor Attribution</span>
                    <Badge className="bg-green-100 text-green-800">Completed</Badge>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span>Stress Testing</span>
                    <Badge className="bg-blue-100 text-blue-800">Running</Badge>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span>Monte Carlo</span>
                    <Badge className="bg-yellow-100 text-yellow-800">Queued</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Model Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span>Prediction Accuracy</span>
                    <span className="font-semibold">87.3%</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span>R-Squared</span>
                    <span className="font-semibold">0.82</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span>Information Ratio</span>
                    <span className="font-semibold">0.56</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">System Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2 text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Data Pipeline: Active</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Models: 18/23 Running</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span>Queue: 8 pending</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="models" className="space-y-6">
          {/* Statistical Models Interface */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Model List */}
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Statistical Models</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {statisticalModels.map((model) => (
                      <div key={model.id} 
                           className={`p-3 border rounded-lg cursor-pointer hover:shadow-md transition-shadow ${
                             selectedModel === model.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                           }`}
                           onClick={() => setSelectedModel(model.id)}>
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium text-sm">{model.name}</h4>
                          <Badge className={`text-xs ${
                            model.status === 'Active' ? 'bg-green-100 text-green-800' :
                            model.status === 'Testing' ? 'bg-blue-100 text-blue-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {model.status}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-600 mb-2">{model.description}</p>
                        <div className="flex justify-between items-center text-xs text-gray-500">
                          <span>{model.type}</span>
                          <span>Acc: {model.accuracy}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Model Details */}
            <div className="lg:col-span-2">
              {(() => {
                const model = statisticalModels.find(m => m.id === selectedModel);
                return model ? (
                  <Card>
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        <CardTitle>{model.name}</CardTitle>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-1" />
                            View Details
                          </Button>
                          <Button variant="outline" size="sm">
                            <Settings className="h-4 w-4 mr-1" />
                            Configure
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        {/* Model Metrics */}
                        <div>
                          <h4 className="font-semibold mb-4">Performance Metrics</h4>
                          <div className="grid grid-cols-2 gap-4">
                            {Object.entries(model.metrics).map(([key, value]) => (
                              <div key={key} className="p-3 bg-gray-50 rounded-lg">
                                <p className="text-sm text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1')}</p>
                                <p className="text-lg font-semibold">{typeof value === 'number' ? formatNumber(value) : value}</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Model Visualization */}
                        <div>
                          <h4 className="font-semibold mb-4">Model Output Visualization</h4>
                          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                            <div className="text-center">
                              <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                              <p className="text-sm text-gray-600">{model.type} Model Results</p>
                              <p className="text-xs text-gray-500">Interactive visualization of {model.name.toLowerCase()}</p>
                            </div>
                          </div>
                        </div>

                        {/* Model Status */}
                        <div>
                          <h4 className="font-semibold mb-4">Model Information</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Status:</span>
                              <Badge className={`${
                                model.status === 'Active' ? 'bg-green-100 text-green-800' :
                                model.status === 'Testing' ? 'bg-blue-100 text-blue-800' :
                                'bg-yellow-100 text-yellow-800'
                              }`}>
                                {model.status}
                              </Badge>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Accuracy:</span>
                              <span className="font-medium">{model.accuracy}%</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Last Updated:</span>
                              <span>{model.lastUpdated}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Model Type:</span>
                              <span>{model.type}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ) : null;
              })()
              }
            </div>
          </div>
        </TabsContent>

        <TabsContent value="correlations" className="space-y-6">
          {/* Correlation Analysis */}
          <Card>
            <CardHeader>
              <CardTitle>Asset Correlation Matrix</CardTitle>
              <p className="text-sm text-gray-600">Pearson correlation coefficients between asset classes</p>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr>
                      <th className="text-left p-2 font-medium">Asset Class</th>
                      <th className="text-center p-2 font-medium">US Equity</th>
                      <th className="text-center p-2 font-medium">Intl Equity</th>
                      <th className="text-center p-2 font-medium">Bonds</th>
                      <th className="text-center p-2 font-medium">REITs</th>
                      <th className="text-center p-2 font-medium">Commodities</th>
                    </tr>
                  </thead>
                  <tbody>
                    {correlationMatrix.map((row, index) => (
                      <tr key={index} className="border-t">
                        <td className="p-2 font-medium">{row.asset}</td>
                        <td className="text-center p-2">
                          <span className={`px-2 py-1 rounded text-xs ${getCorrelationColor(row.usEquity)}`}>
                            {formatNumber(row.usEquity)}
                          </span>
                        </td>
                        <td className="text-center p-2">
                          <span className={`px-2 py-1 rounded text-xs ${getCorrelationColor(row.intlEquity)}`}>
                            {formatNumber(row.intlEquity)}
                          </span>
                        </td>
                        <td className="text-center p-2">
                          <span className={`px-2 py-1 rounded text-xs ${getCorrelationColor(row.bonds)}`}>
                            {formatNumber(row.bonds)}
                          </span>
                        </td>
                        <td className="text-center p-2">
                          <span className={`px-2 py-1 rounded text-xs ${getCorrelationColor(row.reits)}`}>
                            {formatNumber(row.reits)}
                          </span>
                        </td>
                        <td className="text-center p-2">
                          <span className={`px-2 py-1 rounded text-xs ${getCorrelationColor(row.commodities)}`}>
                            {formatNumber(row.commodities)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="mt-6">
                <h4 className="font-semibold mb-3">Correlation Insights</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <h5 className="font-medium text-red-800 mb-1">High Correlation Alert</h5>
                    <p className="text-sm text-red-700">US & International Equity: 0.72</p>
                    <p className="text-xs text-red-600">May indicate reduced diversification</p>
                  </div>
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <h5 className="font-medium text-green-800 mb-1">Good Diversification</h5>
                    <p className="text-sm text-green-700">Bonds & Equity: -0.15</p>
                    <p className="text-xs text-green-600">Negative correlation provides hedging</p>
                  </div>
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <h5 className="font-medium text-blue-800 mb-1">Moderate Risk</h5>
                    <p className="text-sm text-blue-700">REITs & US Equity: 0.68</p>
                    <p className="text-xs text-blue-600">Monitor for concentration risk</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scenarios" className="space-y-6">
          {/* Scenario Analysis */}
          <Card>
            <CardHeader>
              <CardTitle>Scenario Analysis & Stress Testing</CardTitle>
              <p className="text-sm text-gray-600">Portfolio performance under different market conditions</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3 font-medium">Scenario</th>
                        <th className="text-center p-3 font-medium">Probability</th>
                        <th className="text-center p-3 font-medium">Expected Return</th>
                        <th className="text-center p-3 font-medium">Volatility</th>
                        <th className="text-center p-3 font-medium">Sharpe Ratio</th>
                      </tr>
                    </thead>
                    <tbody>
                      {scenarioAnalysis.map((scenario, index) => (
                        <tr key={index} className="border-b hover:bg-gray-50">
                          <td className="p-3 font-medium">{scenario.scenario}</td>
                          <td className="text-center p-3">
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                              {(scenario.probability * 100).toFixed(0)}%
                            </span>
                          </td>
                          <td className="text-center p-3">
                            <span className={`font-medium ${
                              scenario.return >= 0 ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {scenario.return >= 0 ? '+' : ''}{formatNumber(scenario.return, 1)}%
                            </span>
                          </td>
                          <td className="text-center p-3">{formatNumber(scenario.volatility, 1)}%</td>
                          <td className="text-center p-3">
                            <span className={`font-medium ${
                              scenario.sharpeRatio >= 0 ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {formatNumber(scenario.sharpeRatio)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {/* Monte Carlo Simulation */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-4">Monte Carlo Simulation</h4>
                    <div className="h-48 flex items-center justify-center bg-gray-50 rounded-lg">
                      <div className="text-center">
                        <Activity className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">10,000 Simulation Results</p>
                        <p className="text-xs text-gray-500">Portfolio value distribution</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-4">Risk Summary</h4>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                        <span className="text-sm font-medium">95% Confidence Interval</span>
                        <span className="text-sm font-semibold text-green-700">$2.1M - $4.8M</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                        <span className="text-sm font-medium">Value at Risk (5%)</span>
                        <span className="text-sm font-semibold text-yellow-700">-$420K</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                        <span className="text-sm font-medium">Expected Shortfall</span>
                        <span className="text-sm font-semibold text-red-700">-$680K</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                        <span className="text-sm font-medium">Probability of Loss</span>
                        <span className="text-sm font-semibold text-blue-700">23.4%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          {/* Analysis Reports */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Analysis Queue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium">Q1 Performance Analysis</h4>
                      <Badge className="bg-yellow-100 text-yellow-800">In Progress</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">Comprehensive performance attribution and factor analysis</p>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Data Collection</span>
                        <span className="text-green-600">✓ Complete</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Statistical Analysis</span>
                        <span className="text-blue-600">◐ 70%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Report Generation</span>
                        <span className="text-gray-400">◯ Pending</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium">ESG Impact Assessment</h4>
                      <Badge className="bg-blue-100 text-blue-800">Queued</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">Environmental, Social, and Governance factor analysis</p>
                    <div className="text-sm text-gray-500">
                      <p>Estimated completion: 3-5 days</p>
                      <p>Assigned to: Analytics Team</p>
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium">Sector Rotation Analysis</h4>
                      <Badge className="bg-green-100 text-green-800">Completed</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">Analysis of sector performance and rotation patterns</p>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4 mr-1" />
                        View Report
                      </Button>
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Generated Reports</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      title: 'Monthly Performance Report',
                      date: '2024-01-15',
                      type: 'Performance',
                      pages: 24,
                      status: 'Final'
                    },
                    {
                      title: 'Risk Assessment Summary',
                      date: '2024-01-12',
                      type: 'Risk',
                      pages: 18,
                      status: 'Final'
                    },
                    {
                      title: 'Factor Attribution Analysis',
                      date: '2024-01-08',
                      type: 'Attribution',
                      pages: 31,
                      status: 'Draft'
                    },
                    {
                      title: 'Correlation Study Q4',
                      date: '2024-01-05',
                      type: 'Statistical',
                      pages: 15,
                      status: 'Final'
                    }
                  ].map((report, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium">{report.title}</h4>
                        <Badge className={report.status === 'Final' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                          {report.status}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center text-sm text-gray-600 mb-3">
                        <span>{report.type} • {report.pages} pages</span>
                        <span>{report.date}</span>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        <Button size="sm" variant="outline">
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <div className="mt-6 p-4 bg-gray-100 border border-gray-200 rounded-lg">
        <div className="flex items-start space-x-3">
          <User className="h-5 w-5 text-gray-600 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-gray-900 mb-1">Traditional Analytics</h4>
            <p className="text-sm text-gray-600">
              Complete manual control over data analysis and statistical modeling. All calculations, 
              model development, and insights generation are performed using traditional analytical methods 
              without AI assistance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedAnalyticsTraditionalRefactored;