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
      // Mock API call
      const response = await fetch('/api/portfolio-management?type=overview');
      const result = await response.json();
      if (result.success && result.data) {
        setPortfolioData(result.data.companies);
        setAnalytics(result.data.analytics);
      }
    } catch (error) {
      console.error('Failed to load portfolio data:', error);
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
  const recommendations: PortfolioRecommendation[] = [
    {
      type: 'RISK_MITIGATION',
      priority: 'HIGH',
      title: 'Address High-Risk Concentration',
      description: '3 companies showing elevated risk scores require immediate attention',
      rationale: 'Risk concentration in healthcare sector exceeds portfolio guidelines',
      expectedImpact: 'Reduce portfolio risk by 15-20%',
      confidence: 0.85,
      actions: ['Review TechCorp quarterly update', 'Schedule management call', 'Consider hedging strategies'],
      timeline: '2 weeks'
    }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Activity className="h-5 w-5 mr-2" />
            AI Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recommendations.map((rec, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold flex items-center">
                      <AlertTriangle className="h-4 w-4 mr-2 text-orange-500" />
                      {rec.title}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">{rec.description}</p>
                  </div>
                  <Badge variant={rec.priority === 'HIGH' ? 'destructive' : 'default'}>
                    {rec.priority}
                  </Badge>
                </div>
                <div className="text-sm text-gray-700">
                  <p><strong>Impact:</strong> {rec.expectedImpact}</p>
                  <p><strong>Timeline:</strong> {rec.timeline}</p>
                  <p><strong>Confidence:</strong> {Math.round(rec.confidence * 100)}%</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <TraditionalPortfolioContent analytics={analytics} companies={companies} />
    </div>
  );
}

// Autonomous Portfolio Content Component
function AutonomousPortfolioContent({ analytics, companies }: { analytics: PortfolioAnalytics | null, companies: PortfolioCompany[] }) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Target className="h-5 w-5 mr-2" />
            Priority Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 border rounded-lg border-red-200 bg-red-50">
              <h3 className="font-semibold text-red-800 flex items-center">
                <AlertTriangle className="h-4 w-4 mr-2" />
                Critical Decision Required
              </h3>
              <p className="text-sm text-red-700 mt-1">
                TechCorp showing 15% revenue decline - Board meeting required to discuss strategic options
              </p>
              <div className="flex gap-2 mt-3">
                <Button size="sm" className="bg-red-600 hover:bg-red-700">Schedule Meeting</Button>
                <Button size="sm" variant="outline">Review Details</Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

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