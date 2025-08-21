import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  TrendingDown,
  BarChart3, 
  Globe, 
  AlertTriangle, 
  User, 
  Search,
  LineChart,
  PieChart,
  Activity,
  Eye,
  Download,
  Filter,
  Calendar,
  Building,
  DollarSign,
  Target,
  Zap,
  Brain,
  Users,
  FileText,
  Bell,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
  Newspaper,
  Award
} from 'lucide-react';

export const MarketIntelligenceTraditional: React.FC<{ metrics?: any }> = ({ metrics = {} }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedSector, setSelectedSector] = useState('all');
  const [selectedRegion, setSelectedRegion] = useState('global');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Comprehensive market data for demonstration
  const marketData = useMemo(() => ({
    sectors: [
      {
        name: 'Technology',
        performance: 12.8,
        trend: 'up',
        marketCap: 2400000000000, // $2.4T
        dealVolume: 234,
        avgValuation: 45.2,
        keyMetrics: { peRatio: 28.5, growth: 15.2, volatility: 22.1 },
        topCompanies: ['TechCorp', 'InnovateAI', 'CloudSystems'],
        recentNews: 3,
        confidence: 87
      },
      {
        name: 'Healthcare',
        performance: 8.4,
        trend: 'up',
        marketCap: 1800000000000, // $1.8T
        dealVolume: 187,
        avgValuation: 38.7,
        keyMetrics: { peRatio: 24.1, growth: 11.8, volatility: 18.5 },
        topCompanies: ['MedTech Solutions', 'BioInnovate', 'HealthcarePlus'],
        recentNews: 5,
        confidence: 92
      },
      {
        name: 'Financial Services',
        performance: 6.2,
        trend: 'stable',
        marketCap: 3200000000000, // $3.2T
        dealVolume: 145,
        avgValuation: 52.1,
        keyMetrics: { peRatio: 15.8, growth: 8.5, volatility: 16.2 },
        topCompanies: ['FinanceGlobal', 'InvestPro', 'BankingTech'],
        recentNews: 2,
        confidence: 78
      },
      {
        name: 'Energy',
        performance: -2.1,
        trend: 'down',
        marketCap: 2800000000000, // $2.8T
        dealVolume: 98,
        avgValuation: 28.9,
        keyMetrics: { peRatio: 12.3, growth: 3.2, volatility: 28.7 },
        topCompanies: ['EnergyFuture', 'GreenPower', 'OilTech'],
        recentNews: 4,
        confidence: 65
      },
      {
        name: 'Real Estate',
        performance: 4.7,
        trend: 'up',
        marketCap: 1500000000000, // $1.5T
        dealVolume: 156,
        avgValuation: 34.6,
        keyMetrics: { peRatio: 18.9, growth: 6.8, volatility: 19.4 },
        topCompanies: ['PropertyTech', 'RealtyInvest', 'UrbanDev'],
        recentNews: 1,
        confidence: 81
      }
    ],
    economicIndicators: [
      { name: 'GDP Growth', value: 2.8, trend: 'up', impact: 'positive', change: 0.3 },
      { name: 'Interest Rates', value: 4.25, trend: 'stable', impact: 'neutral', change: 0 },
      { name: 'Inflation Rate', value: 3.2, trend: 'down', impact: 'positive', change: -0.4 },
      { name: 'Unemployment', value: 3.8, trend: 'stable', impact: 'positive', change: -0.1 },
      { name: 'Consumer Confidence', value: 72.4, trend: 'up', impact: 'positive', change: 2.1 }
    ],
    marketNews: [
      {
        id: '1',
        title: 'Technology Sector Sees Record Q4 Performance',
        source: 'Market Analytics Daily',
        time: '2 hours ago',
        impact: 'positive',
        sectors: ['Technology'],
        summary: 'Major tech companies report exceptional quarterly earnings driven by AI adoption.'
      },
      {
        id: '2',
        title: 'Healthcare Innovation Drives Investment Surge',
        source: 'Healthcare Finance Weekly',
        time: '4 hours ago',
        impact: 'positive',
        sectors: ['Healthcare'],
        summary: 'New breakthrough treatments attract significant venture capital funding.'
      },
      {
        id: '3',
        title: 'Energy Sector Faces Regulatory Headwinds',
        source: 'Energy Markets Today',
        time: '6 hours ago',
        impact: 'negative',
        sectors: ['Energy'],
        summary: 'New environmental regulations expected to impact traditional energy investments.'
      },
      {
        id: '4',
        title: 'Federal Reserve Signals Stable Interest Rates',
        source: 'Financial Times',
        time: '1 day ago',
        impact: 'neutral',
        sectors: ['Financial Services'],
        summary: 'Fed chair indicates rates likely to remain steady through Q2 2024.'
      }
    ],
    competitors: [
      {
        name: 'Apex Capital Partners',
        aum: 8500000000, // $8.5B
        focusAreas: ['Technology', 'Healthcare'],
        recentDeals: 12,
        performance: 14.2,
        strategy: 'Growth-focused with AI/ML emphasis'
      },
      {
        name: 'Summit Investment Group',
        aum: 12300000000, // $12.3B
        focusAreas: ['Financial Services', 'Real Estate'],
        recentDeals: 8,
        performance: 11.7,
        strategy: 'Value investing with ESG integration'
      },
      {
        name: 'Meridian Ventures',
        aum: 6200000000, // $6.2B
        focusAreas: ['Energy', 'Infrastructure'],
        recentDeals: 15,
        performance: 9.3,
        strategy: 'Infrastructure and energy transition focus'
      }
    ],
    forecasts: [
      {
        period: '2024 Q1',
        metric: 'Market Growth',
        prediction: 6.8,
        confidence: 82,
        factors: ['GDP stability', 'Corporate earnings', 'Interest rates']
      },
      {
        period: '2024 H1',
        metric: 'Deal Volume',
        prediction: 340,
        confidence: 75,
        factors: ['Liquidity conditions', 'Valuations', 'Regulatory environment']
      },
      {
        period: '2024',
        metric: 'Sector Rotation',
        prediction: 'Tech to Healthcare',
        confidence: 68,
        factors: ['Demographics', 'Innovation cycles', 'Policy changes']
      }
    ]
  }), []);
  
  const formatCurrency = (value: number) => {
    if (value >= 1e12) return `$${(value / 1e12).toFixed(1)}T`;
    if (value >= 1e9) return `$${(value / 1e9).toFixed(1)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(1)}M`;
    return `$${value.toLocaleString()}`;
  };
  
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'down': return <TrendingDown className="h-4 w-4 text-red-600" />;
      default: return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <div className="flex items-center space-x-3">
            <h1 className="text-3xl font-bold text-gray-900">Market Intelligence Platform</h1>
            <Badge className="bg-gray-100 text-gray-800 border border-gray-300 flex items-center space-x-1">
              <User className="h-3 w-3" />
              <span>Traditional Mode</span>
            </Badge>
          </div>
          <p className="text-gray-600 mt-1">Comprehensive market analysis, competitive intelligence, and economic forecasting</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
          <Button className="bg-gray-700 hover:bg-gray-800">
            <Search className="h-4 w-4 mr-2" />
            Market Research
          </Button>
        </div>
      </div>

      {/* Enhanced KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <Card className="border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2 mb-2">
              <BarChart3 className="h-5 w-5 text-blue-600" />
              <p className="text-sm text-gray-600 font-medium">Market Reports</p>
            </div>
            <p className="text-3xl font-bold text-gray-900">{metrics.totalReports || 127}</p>
            <div className="flex items-center text-sm text-gray-500 mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              <span>+8 this week</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2 mb-2">
              <Bell className="h-5 w-5 text-orange-600" />
              <p className="text-sm text-gray-600 font-medium">Active Alerts</p>
            </div>
            <p className="text-3xl font-bold text-gray-900">{metrics.activeAlerts || 12}</p>
            <div className="flex items-center text-sm text-gray-500 mt-1">
              <AlertTriangle className="h-3 w-3 mr-1" />
              <span>3 high priority</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2 mb-2">
              <Target className="h-5 w-5 text-green-600" />
              <p className="text-sm text-gray-600 font-medium">Sectors Tracked</p>
            </div>
            <p className="text-3xl font-bold text-gray-900">{marketData.sectors.length}</p>
            <div className="flex items-center text-sm text-gray-500 mt-1">
              <Activity className="h-3 w-3 mr-1" />
              <span>Real-time data</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2 mb-2">
              <Users className="h-5 w-5 text-purple-600" />
              <p className="text-sm text-gray-600 font-medium">Competitors</p>
            </div>
            <p className="text-3xl font-bold text-gray-900">{marketData.competitors.length}</p>
            <div className="flex items-center text-sm text-gray-500 mt-1">
              <Eye className="h-3 w-3 mr-1" />
              <span>Under analysis</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2 mb-2">
              <Brain className="h-5 w-5 text-indigo-600" />
              <p className="text-sm text-gray-600 font-medium">Forecast Accuracy</p>
            </div>
            <p className="text-3xl font-bold text-gray-900">84%</p>
            <div className="flex items-center text-sm text-gray-500 mt-1">
              <Award className="h-3 w-3 mr-1" />
              <span>Above industry avg</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Comprehensive Market Intelligence Interface */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="sectors">Sectors</TabsTrigger>
          <TabsTrigger value="economics">Economics</TabsTrigger>
          <TabsTrigger value="competitors">Competitors</TabsTrigger>
          <TabsTrigger value="news">News & Alerts</TabsTrigger>
          <TabsTrigger value="forecasts">Forecasts</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Market Performance Overview */}
            <div className="lg:col-span-2">
              <Card className="border-gray-200">
                <CardHeader>
                  <CardTitle>Market Performance Dashboard</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Performance Chart Placeholder */}
                    <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg mb-6">
                      <div className="text-center">
                        <LineChart className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">Market Performance Trends</p>
                        <p className="text-xs text-gray-500">Real-time sector performance tracking</p>
                      </div>
                    </div>
                    
                    {/* Top Performing Sectors */}
                    <div>
                      <h4 className="font-semibold mb-4">Top Performing Sectors</h4>
                      <div className="space-y-3">
                        {marketData.sectors
                          .sort((a, b) => b.performance - a.performance)
                          .slice(0, 3)
                          .map((sector, index) => (
                            <div key={sector.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <div className="flex items-center space-x-3">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                                  index === 0 ? 'bg-green-500' : index === 1 ? 'bg-blue-500' : 'bg-purple-500'
                                }`}>
                                  {index + 1}
                                </div>
                                <div>
                                  <h5 className="font-medium">{sector.name}</h5>
                                  <p className="text-sm text-gray-600">{formatCurrency(sector.marketCap)} market cap</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="flex items-center space-x-1">
                                  {getTrendIcon(sector.trend)}
                                  <span className={`font-semibold ${
                                    sector.performance > 0 ? 'text-green-600' : 'text-red-600'
                                  }`}>
                                    {sector.performance > 0 ? '+' : ''}{sector.performance.toFixed(1)}%
                                  </span>
                                </div>
                                <p className="text-xs text-gray-500">{sector.dealVolume} deals</p>
                              </div>
                            </div>
                          ))
                        }
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Quick Stats Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Market Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-center">
                      <p className="text-2xl font-bold text-green-900">+7.8%</p>
                      <p className="text-sm text-green-700">Overall Market Growth</p>
                      <p className="text-xs text-green-600">vs last quarter</p>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Total Deal Volume</span>
                        <span className="font-bold">820</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Avg Deal Size</span>
                        <span className="font-bold">$42.1M</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Market Volatility</span>
                        <span className="font-bold text-yellow-600">Medium</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Recent Alerts</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { type: 'opportunity', message: 'Healthcare sector showing strength', priority: 'high' },
                      { type: 'risk', message: 'Energy sector regulatory concerns', priority: 'medium' },
                      { type: 'trend', message: 'AI adoption accelerating', priority: 'high' }
                    ].map((alert, index) => (
                      <div key={index} className={`p-2 border rounded text-xs ${
                        alert.priority === 'high' ? 'border-red-200 bg-red-50' : 'border-yellow-200 bg-yellow-50'
                      }`}>
                        <div className="flex items-center justify-between mb-1">
                          <span className={`font-medium capitalize ${
                            alert.priority === 'high' ? 'text-red-800' : 'text-yellow-800'
                          }`}>
                            {alert.type}
                          </span>
                          <Badge className={alert.priority === 'high' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}>
                            {alert.priority}
                          </Badge>
                        </div>
                        <p className={alert.priority === 'high' ? 'text-red-700' : 'text-yellow-700'}>
                          {alert.message}
                        </p>
                      </div>
                    ))}
                  </div>
                  
                  <Button className="w-full mt-4" variant="outline" size="sm">
                    <Bell className="h-4 w-4 mr-2" />
                    View All Alerts
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="sectors" className="space-y-6">
          {/* Comprehensive Sector Analysis */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Sector Analysis Dashboard</CardTitle>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {marketData.sectors.map((sector, index) => (
                  <div key={sector.name} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${
                          index % 5 === 0 ? 'bg-blue-500' :
                          index % 5 === 1 ? 'bg-green-500' :
                          index % 5 === 2 ? 'bg-purple-500' :
                          index % 5 === 3 ? 'bg-red-500' : 'bg-orange-500'
                        }`}>
                          {sector.name.charAt(0)}
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold">{sector.name}</h3>
                          <p className="text-sm text-gray-600">Market Cap: {formatCurrency(sector.marketCap)}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center space-x-2 mb-1">
                          {getTrendIcon(sector.trend)}
                          <span className={`text-2xl font-bold ${
                            sector.performance > 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {sector.performance > 0 ? '+' : ''}{sector.performance.toFixed(1)}%
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">YTD Performance</p>
                      </div>
                    </div>
                    
                    {/* Key Metrics */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div className="text-center p-3 bg-gray-50 rounded">
                        <p className="text-lg font-semibold">{sector.dealVolume}</p>
                        <p className="text-xs text-gray-600">Deal Volume</p>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded">
                        <p className="text-lg font-semibold">{sector.avgValuation}x</p>
                        <p className="text-xs text-gray-600">Avg Valuation</p>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded">
                        <p className="text-lg font-semibold">{sector.keyMetrics.peRatio}</p>
                        <p className="text-xs text-gray-600">P/E Ratio</p>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded">
                        <p className="text-lg font-semibold">{sector.confidence}%</p>
                        <p className="text-xs text-gray-600">Confidence</p>
                      </div>
                    </div>
                    
                    {/* Top Companies and Recent News */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h5 className="font-medium mb-2">Top Companies</h5>
                        <div className="flex flex-wrap gap-2">
                          {sector.topCompanies.map((company, idx) => (
                            <Badge key={idx} variant="outline">{company}</Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h5 className="font-medium mb-2">Market Intelligence</h5>
                        <div className="flex items-center justify-between text-sm">
                          <span>Recent News Articles</span>
                          <span className="font-medium">{sector.recentNews}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm mt-1">
                          <span>Growth Rate</span>
                          <span className="font-medium text-green-600">+{sector.keyMetrics.growth}%</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-end space-x-2 mt-4">
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4 mr-1" />
                        Deep Analysis
                      </Button>
                      <Button size="sm" variant="outline">
                        <FileText className="h-4 w-4 mr-1" />
                        Report
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="economics" className="space-y-6">
          {/* Economic Indicators Dashboard */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Economic Indicators</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {marketData.economicIndicators.map((indicator, index) => (
                    <div key={indicator.name} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{indicator.name}</h4>
                        <div className="flex items-center space-x-2">
                          {getTrendIcon(indicator.trend)}
                          <Badge className={`${
                            indicator.impact === 'positive' ? 'bg-green-100 text-green-800' :
                            indicator.impact === 'negative' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {indicator.impact}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold">{indicator.value}%</span>
                        <span className={`text-sm font-medium ${
                          indicator.change > 0 ? 'text-green-600' : 
                          indicator.change < 0 ? 'text-red-600' : 'text-gray-600'
                        }`}>
                          {indicator.change > 0 ? '+' : ''}{indicator.change}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Economic Impact Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg mb-6">
                  <div className="text-center">
                    <PieChart className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Economic Impact Visualization</p>
                    <p className="text-xs text-gray-500">Indicator relationships and market impact</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <h5 className="font-medium text-green-800 mb-1">Positive Indicators</h5>
                    <p className="text-sm text-green-700">
                      GDP growth and consumer confidence support market expansion
                    </p>
                  </div>
                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <h5 className="font-medium text-yellow-800 mb-1">Watch List</h5>
                    <p className="text-sm text-yellow-700">
                      Interest rates stable but inflation still above target
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="competitors" className="space-y-6">
          {/* Competitive Intelligence */}
          <Card>
            <CardHeader>
              <CardTitle>Competitive Intelligence Dashboard</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {marketData.competitors.map((competitor, index) => (
                  <div key={competitor.name} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-semibold">{competitor.name}</h3>
                        <p className="text-gray-600">AUM: {formatCurrency(competitor.aum)}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-blue-600">
                          {competitor.performance.toFixed(1)}%
                        </div>
                        <p className="text-sm text-gray-600">Performance</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <h5 className="font-medium mb-2">Focus Areas</h5>
                        <div className="flex flex-wrap gap-1">
                          {competitor.focusAreas.map((area, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">{area}</Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h5 className="font-medium mb-2">Recent Activity</h5>
                        <p className="text-sm text-gray-600">{competitor.recentDeals} deals this quarter</p>
                      </div>
                      <div>
                        <h5 className="font-medium mb-2">Strategy</h5>
                        <p className="text-sm text-gray-600">{competitor.strategy}</p>
                      </div>
                    </div>
                    
                    <div className="flex justify-end space-x-2">
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4 mr-1" />
                        Detailed Analysis
                      </Button>
                      <Button size="sm" variant="outline">
                        <FileText className="h-4 w-4 mr-1" />
                        Comparison Report
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="news" className="space-y-6">
          {/* News and Alerts Feed */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Market News & Analysis</CardTitle>
                    <div className="flex space-x-2">
                      <Input placeholder="Search news..." className="w-48" />
                      <Button variant="outline" size="sm">
                        <Filter className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {marketData.marketNews.map((news) => (
                      <div key={news.id} className="border rounded-lg p-4 hover:bg-gray-50">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h4 className="font-semibold text-lg mb-1">{news.title}</h4>
                            <p className="text-sm text-gray-600 mb-2">{news.summary}</p>
                            <div className="flex items-center space-x-4 text-xs text-gray-500">
                              <span>{news.source}</span>
                              <span>{news.time}</span>
                              <div className="flex space-x-1">
                                {news.sectors.map((sector, idx) => (
                                  <Badge key={idx} variant="outline" className="text-xs">{sector}</Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                          <Badge className={`ml-4 ${
                            news.impact === 'positive' ? 'bg-green-100 text-green-800' :
                            news.impact === 'negative' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {news.impact}
                          </Badge>
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4 mr-1" />
                            Read More
                          </Button>
                          <Button size="sm" variant="outline">
                            <FileText className="h-4 w-4 mr-1" />
                            Analysis
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Alert Center</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-center space-x-2 mb-1">
                        <AlertTriangle className="h-4 w-4 text-red-600" />
                        <span className="font-medium text-red-800">Critical Alert</span>
                      </div>
                      <p className="text-sm text-red-700">
                        Energy sector regulatory announcement expected
                      </p>
                    </div>
                    
                    <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="flex items-center space-x-2 mb-1">
                        <Bell className="h-4 w-4 text-yellow-600" />
                        <span className="font-medium text-yellow-800">Market Alert</span>
                      </div>
                      <p className="text-sm text-yellow-700">
                        Technology valuations reaching historical highs
                      </p>
                    </div>
                    
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-center space-x-2 mb-1">
                        <Zap className="h-4 w-4 text-blue-600" />
                        <span className="font-medium text-blue-800">Opportunity Alert</span>
                      </div>
                      <p className="text-sm text-blue-700">
                        Healthcare sector showing strong fundamentals
                      </p>
                    </div>
                  </div>
                  
                  <Button className="w-full mt-4" variant="outline">
                    Configure Alerts
                  </Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>News Sources</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {[
                      { name: 'Financial Times', articles: 15, credibility: 95 },
                      { name: 'Wall Street Journal', articles: 23, credibility: 94 },
                      { name: 'Bloomberg', articles: 31, credibility: 92 },
                      { name: 'Reuters', articles: 18, credibility: 90 }
                    ].map((source, index) => (
                      <div key={index} className="flex items-center justify-between p-2 border rounded text-sm">
                        <span className="font-medium">{source.name}</span>
                        <div className="text-right">
                          <p className="text-xs text-gray-600">{source.articles} articles</p>
                          <p className="text-xs text-green-600">{source.credibility}% credible</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="forecasts" className="space-y-6">
          {/* Market Forecasts and Predictions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Market Forecasts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {marketData.forecasts.map((forecast, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-semibold">{forecast.period}</h4>
                          <p className="text-sm text-gray-600">{forecast.metric}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-blue-600">
                            {typeof forecast.prediction === 'number' 
                              ? `${forecast.prediction}${forecast.metric.includes('Growth') ? '%' : ''}` 
                              : forecast.prediction
                            }
                          </div>
                          <div className="text-sm text-gray-600">Confidence: {forecast.confidence}%</div>
                        </div>
                      </div>
                      
                      <div className="mb-3">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium">Confidence Level</span>
                          <span className="text-sm">{forecast.confidence}%</span>
                        </div>
                        <Progress value={forecast.confidence} className="h-2" />
                      </div>
                      
                      <div>
                        <h5 className="font-medium mb-2 text-sm">Key Factors</h5>
                        <div className="flex flex-wrap gap-1">
                          {forecast.factors.map((factor, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">{factor}</Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Predictive Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Forecast Visualization Placeholder */}
                  <div className="h-48 flex items-center justify-center bg-gray-50 rounded-lg">
                    <div className="text-center">
                      <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">Predictive Model Outputs</p>
                      <p className="text-xs text-gray-500">Machine learning forecasts and trend analysis</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                      <h5 className="font-medium text-green-800 mb-1">High Confidence Predictions</h5>
                      <p className="text-sm text-green-700">
                        Healthcare sector growth trajectory shows 85%+ confidence through 2024
                      </p>
                    </div>
                    
                    <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <h5 className="font-medium text-yellow-800 mb-1">Market Uncertainties</h5>
                      <p className="text-sm text-yellow-700">
                        Energy sector transitions create moderate prediction variance
                      </p>
                    </div>
                    
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <h5 className="font-medium text-blue-800 mb-1">Emerging Trends</h5>
                      <p className="text-sm text-blue-700">
                        AI adoption acceleration may outpace current forecasting models
                      </p>
                    </div>
                  </div>
                  
                  <Button className="w-full" variant="outline">
                    <Brain className="h-4 w-4 mr-2" />
                    Run Advanced Models
                  </Button>
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
            <h4 className="font-semibold text-gray-900 mb-1">Traditional Market Intelligence</h4>
            <p className="text-sm text-gray-600">
              Comprehensive manual market analysis with full control over research methodology. 
              Advanced sector analysis, competitive intelligence, economic forecasting, and news monitoring 
              performed through traditional research methods with expert oversight.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketIntelligenceTraditional;