'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  Leaf, 
  DollarSign,
  BarChart3,
  PieChart,
  Activity,
  Target,
  Shield,
  Users,
  Globe,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  Search,
  Download,
  RefreshCw
} from 'lucide-react';
import type { 
  PortfolioCompany, 
  PortfolioAnalytics, 
  PerformanceReport, 
  ESGReport,
  TraditionalPortfolioView,
  AssistedPortfolioView,
  AutonomousPortfolioView,
  PortfolioRecommendation,
  RiskLevel,
  InvestmentStage 
} from '@/types/portfolio-management';
import { formatCurrency, formatPercentage, formatDate } from '@/lib/utils';

interface EnhancedPortfolioDashboardProps {
  navigationMode?: 'traditional' | 'assisted' | 'autonomous';
  onModeChange?: (mode: 'traditional' | 'assisted' | 'autonomous') => void;
}

export function EnhancedPortfolioDashboard({ 
  navigationMode = 'traditional', 
  onModeChange 
}: EnhancedPortfolioDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilters, setSelectedFilters] = useState({
    sectors: [] as string[],
    stages: [] as InvestmentStage[],
    riskLevels: [] as RiskLevel[]
  });
  const [portfolioData, setPortfolioData] = useState<PortfolioCompany[]>([]);
  const [analytics, setAnalytics] = useState<PortfolioAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPortfolioData();
  }, []);

  const loadPortfolioData = async () => {
    try {
      setLoading(true);
      console.log('Fetching portfolio data from:', '/api/portfolio-management?type=overview');
      const response = await fetch('/api/portfolio-management?type=overview');
      
      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('Expected JSON but received:', contentType);
        console.error('Response body:', text);
        throw new Error('Response is not JSON');
      }
      
      const result = await response.json();
      console.log('API response:', result);
      
      if (result.success && result.data) {
        setPortfolioData(result.data.companies || []);
        setAnalytics(result.data.analytics || null);
      } else {
        console.error('API returned error:', result);
      }
    } catch (error) {
      console.error('Failed to load portfolio data:', error);
      // Keep data empty to show the actual issue
      setPortfolioData([]);
      setAnalytics(null);
    } finally {
      setLoading(false);
    }
  };

  const renderModeSpecificContent = () => {
    switch (navigationMode) {
      case 'assisted':
        return <AssistedPortfolioContent analytics={analytics} companies={portfolioData} />;
      case 'autonomous':
        return <AutonomousPortfolioContent analytics={analytics} companies={portfolioData} />;
      default:
        return <TraditionalPortfolioContent analytics={analytics} companies={portfolioData} />;
    }
  };

  const renderKPICards = () => {
    if (!analytics) return null;

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Portfolio Value</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(analytics.totalCurrentValue || 0)}
                </p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              {(analytics.portfolioIRR || 0) > 0 ? (
                <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
              ) : (
                <ArrowDownRight className="h-4 w-4 text-red-500 mr-1" />
              )}
              <span className={`text-sm ${(analytics.portfolioIRR || 0) > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatPercentage(analytics.portfolioIRR || 0)} IRR
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Portfolio MOIC</p>
                <p className="text-2xl font-bold text-gray-900">
                  {(analytics.portfolioMOIC || 0).toFixed(2)}x
                </p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <span className="text-sm text-gray-600">
                DPI: {(analytics.portfolioDPI || 0).toFixed(2)}x
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Investments</p>
                <p className="text-2xl font-bold text-gray-900">
                  {analytics.totalInvestments || 0}
                </p>
              </div>
              <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <span className="text-sm text-gray-600">
                Deployed: {formatCurrency(analytics.totalInvestedCapital || 0)}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">ESG Score</p>
                <p className="text-2xl font-bold text-gray-900">B+</p>
              </div>
              <div className="h-12 w-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                <Leaf className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600">Improving trend</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Enhanced Portfolio Management</h1>
          <p className="text-gray-600">
            Comprehensive analytics, ESG metrics, and advanced reporting
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Navigation Mode Switcher */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            {(['traditional', 'assisted', 'autonomous'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => onModeChange?.(mode)}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  navigationMode === mode
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {mode.charAt(0).toUpperCase() + mode.slice(1)}
              </button>
            ))}
          </div>
          
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          
          <Button onClick={loadPortfolioData} size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      {renderKPICards()}

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search portfolio companies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" size="sm">
          <Filter className="h-4 w-4 mr-2" />
          Filters
        </Button>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="esg">ESG</TabsTrigger>
          <TabsTrigger value="risk">Risk</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {renderModeSpecificContent()}
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <PerformanceAnalysisView companies={portfolioData} />
        </TabsContent>

        <TabsContent value="esg" className="space-y-6">
          <ESGAnalysisView companies={portfolioData} />
        </TabsContent>

        <TabsContent value="risk" className="space-y-6">
          <RiskAnalysisView companies={portfolioData} />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <AdvancedAnalyticsView analytics={analytics} />
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <ReportingView companies={portfolioData} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Traditional Portfolio Content Component
function TraditionalPortfolioContent({ analytics, companies }: { analytics: PortfolioAnalytics | null, companies: PortfolioCompany[] }) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="h-5 w-5 mr-2" />
            Portfolio Companies
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {companies.slice(0, 10).map((company) => (
              <div key={company.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex items-center space-x-4">
                  <div>
                    <h3 className="font-semibold">{company.name}</h3>
                    <p className="text-sm text-gray-600">{company.sector} • {company.geography}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-sm font-medium">{formatCurrency(company.currentValuation || 0)}</p>
                    <p className="text-sm text-gray-600">
                      {company.irr ? `${formatPercentage(company.irr)} IRR` : 'N/A'}
                    </p>
                  </div>
                  <Badge variant={company.status === 'ACTIVE' ? 'default' : 'secondary'}>
                    {company.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Assisted Portfolio Content Component
function AssistedPortfolioContent({ analytics, companies }: { analytics: PortfolioAnalytics | null, companies: PortfolioCompany[] }) {
  // Enhanced AI-powered recommendations
  const recommendations = React.useMemo(() => {
    const recs: PortfolioRecommendation[] = [];
    
    // Sector concentration analysis
    const sectorConcentration = companies.reduce((acc, company) => {
      acc[company.sector] = (acc[company.sector] || 0) + (company.currentValuation || 0);
      return acc;
    }, {} as Record<string, number>);
    
    const totalValue = Object.values(sectorConcentration).reduce((sum, val) => sum + val, 0);
    const maxSectorPercentage = Math.max(...Object.values(sectorConcentration)) / totalValue;
    
    if (maxSectorPercentage > 0.4) {
      recs.push({
        type: 'RISK_MITIGATION',
        priority: 'HIGH',
        title: 'Sector Concentration Risk Detected',
        description: `Portfolio has ${Math.round(maxSectorPercentage * 100)}% concentration in single sector. Consider diversification.`,
        rationale: 'Concentration exceeds 40% threshold, increasing portfolio risk',
        expectedImpact: `Reduce concentration risk by 15-25%`,
        confidence: 0.89,
        actions: ['Review sector allocation', 'Identify diversification targets', 'Consider partial exits'],
        timeline: '4-6 weeks'
      });
    }

    // Performance outlier analysis
    const performingCompanies = companies.filter(c => (c.irr || 0) > 0.25);
    const underperformingCompanies = companies.filter(c => (c.irr || 0) < 0.05);
    
    if (underperformingCompanies.length > 0) {
      recs.push({
        type: 'PERFORMANCE_OPTIMIZATION',
        priority: 'MEDIUM',
        title: 'Underperforming Assets Identified',
        description: `${underperformingCompanies.length} companies showing sub-5% IRR. AI recommends intervention strategies.`,
        rationale: 'Early intervention can improve performance by average 8-12%',
        expectedImpact: `Potential portfolio IRR improvement of 2-4%`,
        confidence: 0.76,
        actions: ['Schedule management reviews', 'Develop improvement plans', 'Consider value-add initiatives'],
        timeline: '8-12 weeks'
      });
    }

    // ESG compliance opportunities
    if (Math.random() > 0.3) { // Simulate ESG analysis
      recs.push({
        type: 'ESG_ENHANCEMENT',
        priority: 'MEDIUM',
        title: 'ESG Score Improvement Opportunity',
        description: 'AI identified 6 companies that can improve ESG scores by 20+ points through targeted initiatives.',
        rationale: 'ESG improvements correlate with 5-15% valuation premium in current market',
        expectedImpact: 'Potential portfolio value increase of $12-18M',
        confidence: 0.82,
        actions: ['ESG audit', 'Sustainability roadmap', 'Board diversity initiatives'],
        timeline: '3-6 months'
      });
    }

    return recs;
  }, [companies]);

  // Predictive analytics insights
  const predictiveInsights = React.useMemo(() => {
    return {
      portfolioTrend: Math.random() > 0.5 ? 'POSITIVE' : 'NEUTRAL',
      expectedReturns: {
        q1: Math.round((Math.random() * 0.1 + 0.15) * 100) / 100,
        q2: Math.round((Math.random() * 0.1 + 0.18) * 100) / 100,
        yearEnd: Math.round((Math.random() * 0.1 + 0.22) * 100) / 100
      },
      riskFactors: [
        { factor: 'Market Volatility', impact: 'Medium', probability: 0.65 },
        { factor: 'Sector Rotation', impact: 'Low', probability: 0.34 },
        { factor: 'Interest Rate Changes', impact: 'High', probability: 0.28 }
      ],
      opportunities: [
        { opportunity: 'Strategic Acquisitions', potential: '$25-40M', timeframe: '6-9 months' },
        { opportunity: 'Operational Improvements', potential: '15-25% IRR boost', timeframe: '3-6 months' }
      ]
    };
  }, []);

  // Company-specific alerts
  const companyAlerts = React.useMemo(() => {
    return companies.slice(0, 3).map(company => ({
      companyId: company.id,
      companyName: company.name,
      alertType: Math.random() > 0.6 ? 'OPPORTUNITY' : 'WARNING',
      message: Math.random() > 0.6 
        ? `Strong Q3 performance - consider follow-on investment` 
        : `Market headwinds affecting ${company.sector} sector`,
      confidence: Math.round((0.7 + Math.random() * 0.25) * 100),
      actionRequired: Math.random() > 0.5
    }));
  }, [companies]);

  return (
    <div className="space-y-6">
      {/* AI Recommendations Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Activity className="h-5 w-5 mr-2 text-blue-600" />
              AI-Powered Recommendations
            </div>
            <Badge variant="secondary" className="bg-blue-100 text-blue-700">
              {recommendations.length} Active
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recommendations.map((rec, index) => (
              <div key={index} className={`p-4 border rounded-lg ${
                rec.priority === 'HIGH' ? 'border-red-200 bg-red-50' :
                rec.priority === 'MEDIUM' ? 'border-yellow-200 bg-yellow-50' :
                'border-blue-200 bg-blue-50'
              }`}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className={`font-semibold flex items-center ${
                      rec.priority === 'HIGH' ? 'text-red-800' :
                      rec.priority === 'MEDIUM' ? 'text-yellow-800' :
                      'text-blue-800'
                    }`}>
                      {rec.priority === 'HIGH' && <AlertTriangle className="h-4 w-4 mr-2" />}
                      {rec.priority === 'MEDIUM' && <Target className="h-4 w-4 mr-2" />}
                      {rec.priority === 'LOW' && <CheckCircle className="h-4 w-4 mr-2" />}
                      {rec.title}
                    </h3>
                    <p className={`text-sm mt-1 ${
                      rec.priority === 'HIGH' ? 'text-red-700' :
                      rec.priority === 'MEDIUM' ? 'text-yellow-700' :
                      'text-blue-700'
                    }`}>{rec.description}</p>
                  </div>
                  <Badge variant={rec.priority === 'HIGH' ? 'destructive' : rec.priority === 'MEDIUM' ? 'default' : 'secondary'}>
                    {rec.priority}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm mb-3">
                  <div>
                    <span className="font-medium">Impact:</span>
                    <p className="text-gray-600">{rec.expectedImpact}</p>
                  </div>
                  <div>
                    <span className="font-medium">Timeline:</span>
                    <p className="text-gray-600">{rec.timeline}</p>
                  </div>
                  <div>
                    <span className="font-medium">Confidence:</span>
                    <p className="text-gray-600">{Math.round(rec.confidence * 100)}%</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {rec.actions.slice(0, 3).map((action, idx) => (
                    <Button key={idx} size="sm" variant="outline" className="text-xs">
                      {action}
                    </Button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Predictive Analytics Dashboard */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="h-5 w-5 mr-2 text-indigo-600" />
            Predictive Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3">Expected Returns Forecast</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span className="text-sm">Q1 2024</span>
                  <span className="font-medium">{(predictiveInsights.expectedReturns.q1 * 100).toFixed(1)}%</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span className="text-sm">Q2 2024</span>
                  <span className="font-medium">{(predictiveInsights.expectedReturns.q2 * 100).toFixed(1)}%</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-green-50 rounded border border-green-200">
                  <span className="text-sm font-medium">Year-End Target</span>
                  <span className="font-bold text-green-700">{(predictiveInsights.expectedReturns.yearEnd * 100).toFixed(1)}%</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-3">Risk Assessment</h4>
              <div className="space-y-2">
                {predictiveInsights.riskFactors.map((risk, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 border rounded">
                    <div className="flex-1">
                      <span className="text-sm font-medium">{risk.factor}</span>
                      <p className="text-xs text-gray-500">Probability: {Math.round(risk.probability * 100)}%</p>
                    </div>
                    <Badge variant={risk.impact === 'High' ? 'destructive' : risk.impact === 'Medium' ? 'default' : 'secondary'}>
                      {risk.impact}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Company-Specific Alerts */}
      {companyAlerts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="h-5 w-5 mr-2 text-purple-600" />
              Company-Specific Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {companyAlerts.map((alert, idx) => (
                <div key={idx} className={`p-3 border rounded-lg ${
                  alert.alertType === 'OPPORTUNITY' ? 'border-green-200 bg-green-50' : 'border-orange-200 bg-orange-50'
                }`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h5 className={`font-medium ${
                        alert.alertType === 'OPPORTUNITY' ? 'text-green-800' : 'text-orange-800'
                      }`}>
                        {alert.companyName}
                      </h5>
                      <p className={`text-sm ${
                        alert.alertType === 'OPPORTUNITY' ? 'text-green-700' : 'text-orange-700'
                      }`}>
                        {alert.message}
                      </p>
                      <div className="flex items-center mt-1 text-xs text-gray-500">
                        <span>AI Confidence: {alert.confidence}%</span>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-3">
                      <Button size="sm" variant="outline">View Details</Button>
                      {alert.actionRequired && (
                        <Button size="sm" variant="default">Take Action</Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Traditional Content Enhanced with AI Context */}
      <TraditionalPortfolioContent analytics={analytics} companies={companies} />
    </div>
  );
}

// Autonomous Portfolio Content Component
function AutonomousPortfolioContent({ analytics, companies }: { analytics: PortfolioAnalytics | null, companies: PortfolioCompany[] }) {
  // Autonomous actions already executed
  const [autonomousActions, setAutonomousActions] = React.useState([
    {
      id: 'auto-rebalance-1',
      type: 'rebalancing' as const,
      title: 'Portfolio Auto-Rebalanced',
      description: 'Automatically reduced healthcare sector exposure from 45% to 35% to comply with concentration limits.',
      status: 'completed' as const,
      timestamp: new Date(Date.now() - 7200000), // 2 hours ago
      impact: '$2.8M repositioned, risk reduced by 18%',
      confidence: 0.94,
      rollbackable: true
    },
    {
      id: 'auto-alert-1',
      type: 'monitoring' as const,
      title: 'Early Warning System Activated',
      description: 'Detected performance anomaly in 3 companies. Automated deep-dive analysis initiated and stakeholders notified.',
      status: 'in_progress' as const,
      timestamp: new Date(Date.now() - 3600000), // 1 hour ago
      impact: 'Potential issues identified 2-3 weeks early',
      confidence: 0.87,
      rollbackable: false
    },
    {
      id: 'auto-optimize-1',
      type: 'optimization' as const,
      title: 'Tax Optimization Executed',
      description: 'Implemented tax-loss harvesting strategy across 8 positions, optimizing for current year tax efficiency.',
      status: 'completed' as const,
      timestamp: new Date(Date.now() - 1800000), // 30 min ago
      impact: 'Estimated $1.2M tax savings',
      confidence: 0.96,
      rollbackable: true
    }
  ]);

  // Pending autonomous actions requiring approval
  const [pendingActions, setPendingActions] = React.useState([
    {
      id: 'pending-exit-1',
      type: 'divestment' as const,
      title: 'Strategic Exit Recommendation',
      description: 'AI recommends full exit from RetailCorp based on sector decline prediction (78% confidence). Optimal timing: next 30 days.',
      estimatedValue: '$18.5M',
      predictedImpact: 'Avoid projected 25-35% value decline',
      riskLevel: 'Medium' as const,
      timeframe: '30 days',
      confidence: 0.78
    },
    {
      id: 'pending-follow-1',
      type: 'investment' as const,
      title: 'Follow-On Investment Opportunity',
      description: 'HealthTech showing exceptional metrics. AI recommends $5M follow-on to maintain ownership percentage.',
      estimatedValue: '$5.0M',
      predictedImpact: 'Maintain 15% ownership, projected 3.2x return',
      riskLevel: 'Low' as const,
      timeframe: '14 days',
      confidence: 0.91
    }
  ]);

  // Real-time autonomous monitoring
  const [realTimeAlerts] = React.useState([
    {
      id: 'rt-1',
      severity: 'HIGH' as const,
      message: 'TechCorp revenue miss detected in real-time data (-12% vs forecast)',
      action: 'Board meeting auto-scheduled for tomorrow',
      timestamp: new Date(Date.now() - 300000) // 5 min ago
    },
    {
      id: 'rt-2',
      severity: 'MEDIUM' as const,
      message: 'Sector rotation detected: AI adjusting portfolio allocation weights',
      action: 'Rebalancing in progress (15% complete)',
      timestamp: new Date(Date.now() - 600000) // 10 min ago
    }
  ]);

  // Autonomous portfolio optimization insights
  const optimizationMetrics = React.useMemo(() => {
    return {
      currentEfficiency: 87,
      targetEfficiency: 94,
      automaticAdjustments: 12,
      riskReduction: 23,
      projectedAlpha: 2.8,
      monitoringAccuracy: 91,
      interventionSuccess: 89
    };
  }, []);

  const executeAutonomousAction = (actionId: string) => {
    setPendingActions(prev => prev.filter(a => a.id !== actionId));
    console.log('Executing autonomous action:', actionId);
  };

  const rollbackAction = (actionId: string) => {
    setAutonomousActions(prev => 
      prev.map(action => 
        action.id === actionId 
          ? { ...action, status: 'rolled_back' as const }
          : action
      )
    );
  };

  return (
    <div className="space-y-6">
      {/* Autonomous Operations Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Zap className="h-5 w-5 mr-2 text-purple-600" />
              Autonomous Portfolio Management
            </div>
            <Badge variant="outline" className="border-purple-200 text-purple-700 bg-purple-50">
              {autonomousActions.filter(a => a.status === 'in_progress').length} Active Operations
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="text-2xl font-bold text-green-600">{optimizationMetrics.currentEfficiency}%</div>
              <div className="text-sm text-green-700">Portfolio Efficiency</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="text-2xl font-bold text-blue-600">{optimizationMetrics.automaticAdjustments}</div>
              <div className="text-sm text-blue-700">Auto Adjustments (24h)</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
              <div className="text-2xl font-bold text-purple-600">{optimizationMetrics.projectedAlpha}%</div>
              <div className="text-sm text-purple-700">Projected Alpha</div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium">Recent Autonomous Actions</h4>
            {autonomousActions.map(action => (
              <div 
                key={action.id}
                className={`p-4 border rounded-lg ${
                  action.status === 'completed' ? 'border-green-200 bg-green-50' :
                  action.status === 'in_progress' ? 'border-blue-200 bg-blue-50' :
                  'border-gray-200 bg-gray-50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      {action.status === 'completed' && <CheckCircle className="h-4 w-4 text-green-600 mr-2" />}
                      {action.status === 'in_progress' && <Clock className="h-4 w-4 text-blue-600 mr-2" />}
                      <h5 className="font-semibold">{action.title}</h5>
                      <Badge 
                        size="sm" 
                        className={`ml-2 ${
                          action.status === 'completed' ? 'bg-green-100 text-green-800' :
                          action.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {action.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-700 mb-2">{action.description}</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-gray-600">
                      <span><strong>Impact:</strong> {action.impact}</span>
                      <span><strong>Confidence:</strong> {Math.round(action.confidence * 100)}%</span>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button size="sm" variant="ghost">
                      <Eye className="h-4 w-4" />
                    </Button>
                    {action.rollbackable && action.status === 'completed' && (
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="text-red-600 border-red-200"
                        onClick={() => rollbackAction(action.id)}
                      >
                        Rollback
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Real-Time Monitoring Alerts */}
      {realTimeAlerts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="h-5 w-5 mr-2 text-orange-600" />
              Real-Time Monitoring
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {realTimeAlerts.map(alert => (
                <div key={alert.id} className={`p-3 border rounded-lg ${
                  alert.severity === 'HIGH' ? 'border-red-200 bg-red-50' :
                  alert.severity === 'MEDIUM' ? 'border-orange-200 bg-orange-50' :
                  'border-yellow-200 bg-yellow-50'
                }`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-1">
                        <Badge className={`${
                          alert.severity === 'HIGH' ? 'bg-red-100 text-red-800' :
                          alert.severity === 'MEDIUM' ? 'bg-orange-100 text-orange-800' :
                          'bg-yellow-100 text-yellow-800'
                        } mr-2`}>
                          {alert.severity}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          {formatDate(alert.timestamp)}
                        </span>
                      </div>
                      <p className="text-sm font-medium mb-1">{alert.message}</p>
                      <p className="text-xs text-gray-600">
                        <strong>Autonomous Action:</strong> {alert.action}
                      </p>
                    </div>
                    <Button size="sm" variant="outline">
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Pending Strategic Decisions */}
      {pendingActions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="h-5 w-5 mr-2 text-amber-600" />
              Strategic Decisions Pending Approval
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingActions.map(action => (
                <div key={action.id} className="p-4 border border-amber-200 bg-amber-50 rounded-lg">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="font-semibold text-amber-800 flex items-center">
                        {action.type === 'divestment' && <TrendingDown className="h-4 w-4 mr-2" />}
                        {action.type === 'investment' && <TrendingUp className="h-4 w-4 mr-2" />}
                        {action.title}
                      </h4>
                      <p className="text-sm text-amber-700 mt-1">{action.description}</p>
                    </div>
                    <Badge className={`${
                      action.riskLevel === 'Low' ? 'bg-green-100 text-green-800' :
                      action.riskLevel === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {action.riskLevel} Risk
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm mb-4">
                    <div>
                      <span className="font-medium">Value:</span>
                      <p className="text-amber-600">{action.estimatedValue}</p>
                    </div>
                    <div>
                      <span className="font-medium">Timeframe:</span>
                      <p className="text-amber-600">{action.timeframe}</p>
                    </div>
                    <div>
                      <span className="font-medium">Confidence:</span>
                      <p className="text-amber-600">{Math.round(action.confidence * 100)}%</p>
                    </div>
                  </div>

                  <div className="text-sm text-amber-600 mb-4">
                    <strong>Predicted Impact:</strong> {action.predictedImpact}
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      className="bg-amber-600 hover:bg-amber-700"
                      onClick={() => executeAutonomousAction(action.id)}
                    >
                      Approve & Execute
                    </Button>
                    <Button size="sm" variant="outline">
                      Review Analysis
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="text-red-600"
                      onClick={() => setPendingActions(prev => prev.filter(a => a.id !== action.id))}
                    >
                      Reject
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Enhanced Assisted Content */}
      <AssistedPortfolioContent analytics={analytics} companies={companies} />
    </div>
  );
}

// Performance Analysis View
function PerformanceAnalysisView({ companies }: { companies: PortfolioCompany[] }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Performance Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center text-gray-500">
            [Performance Chart Placeholder]
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Top Performers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {companies.slice(0, 5).map((company) => (
              <div key={company.id} className="flex items-center justify-between">
                <span className="font-medium">{company.name}</span>
                <span className="text-green-600 font-medium">
                  {company.irr ? formatPercentage(company.irr) : 'N/A'}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ESG Analysis View
function ESGAnalysisView({ companies }: { companies: PortfolioCompany[] }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Leaf className="h-5 w-5 mr-2" />
            ESG Score Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {['A+', 'A', 'B+', 'B', 'C+', 'C', 'D'].map((rating) => (
              <div key={rating} className="flex items-center justify-between">
                <span className="font-medium">{rating}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-32 h-2 bg-gray-200 rounded-full">
                    <div 
                      className="h-2 bg-green-500 rounded-full" 
                      style={{ width: `${Math.random() * 100}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-600">
                    {Math.floor(Math.random() * 20)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>ESG Improvement Opportunities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-3 border rounded-lg">
              <h4 className="font-medium">Environmental Impact</h4>
              <p className="text-sm text-gray-600">5 companies can reduce carbon emissions by 20%</p>
            </div>
            <div className="p-3 border rounded-lg">
              <h4 className="font-medium">Board Diversity</h4>
              <p className="text-sm text-gray-600">3 companies need more diverse board representation</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Risk Analysis View
function RiskAnalysisView({ companies }: { companies: PortfolioCompany[] }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="h-5 w-5 mr-2" />
            Risk Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {['Low', 'Medium', 'High', 'Critical'].map((level) => (
              <div key={level} className="flex items-center justify-between">
                <span className="font-medium">{level} Risk</span>
                <Badge variant={level === 'Critical' ? 'destructive' : 'default'}>
                  {Math.floor(Math.random() * 15)} companies
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Risk Alerts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-3 border rounded-lg border-orange-200 bg-orange-50">
              <h4 className="font-medium text-orange-800">Market Risk</h4>
              <p className="text-sm text-orange-700">Sector downturn affecting 3 companies</p>
            </div>
            <div className="p-3 border rounded-lg border-red-200 bg-red-50">
              <h4 className="font-medium text-red-800">Operational Risk</h4>
              <p className="text-sm text-red-700">Key person risk identified at TechCorp</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Advanced Analytics View
function AdvancedAnalyticsView({ analytics }: { analytics: PortfolioAnalytics | null }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Predictive Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium">Performance Forecast</h4>
              <p className="text-sm text-gray-600 mt-1">
                Portfolio expected to generate 18.5% IRR over next 12 months
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium">Risk Modeling</h4>
              <p className="text-sm text-gray-600 mt-1">
                Monte Carlo simulation shows 85% probability of meeting target returns
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Correlation Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center text-gray-500">
            [Correlation Matrix Placeholder]
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Reporting View
function ReportingView({ companies }: { companies: PortfolioCompany[] }) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="h-5 w-5 mr-2" />
            Report Generation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              'Quarterly Portfolio Report',
              'ESG Impact Report',
              'Risk Assessment Report',
              'LP Performance Summary',
              'Board Presentation',
              'Custom Analytics Report'
            ].map((reportType) => (
              <div key={reportType} className="p-4 border rounded-lg">
                <h4 className="font-medium">{reportType}</h4>
                <p className="text-sm text-gray-600 mt-1">
                  Generate comprehensive {reportType.toLowerCase()}
                </p>
                <Button size="sm" className="mt-3">
                  Generate Report
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}