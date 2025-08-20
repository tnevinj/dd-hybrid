'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Leaf, 
  Users, 
  Shield, 
  TrendingUp, 
  TrendingDown, 
  Target,
  Award,
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3,
  PieChart,
  Download,
  RefreshCw
} from 'lucide-react';
import type { 
  ESGReport, 
  PortfolioCompany,
  ESGTarget,
  Initiative 
} from '@/types/portfolio-management';
import { formatPercentage, formatDate } from '@/lib/utils';

interface ESGReportingDashboardProps {
  navigationMode?: 'traditional' | 'assisted' | 'autonomous';
}

export function ESGReportingDashboard({ navigationMode = 'traditional' }: ESGReportingDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [esgReports, setESGReports] = useState<ESGReport[]>([]);
  const [portfolioCompanies, setPortfolioCompanies] = useState<PortfolioCompany[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadESGData();
  }, []);

  const loadESGData = async () => {
    try {
      setLoading(true);
      const [reportsResponse, companiesResponse] = await Promise.all([
        fetch('/api/portfolio-management?type=esg-reports'),
        fetch('/api/portfolio-management?type=companies')
      ]);
      
      const reportsData = await reportsResponse.json();
      const companiesData = await companiesResponse.json();
      
      if (reportsData.success && companiesData.success) {
        setESGReports(reportsData.data);
        setPortfolioCompanies(companiesData.data);
      }
    } catch (error) {
      console.error('Failed to load ESG data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculatePortfolioESGMetrics = () => {
    if (portfolioCompanies.length === 0) return null;

    const avgESGScore = portfolioCompanies.reduce((sum, company) => 
      sum + (company.esgScore || 0), 0) / portfolioCompanies.length;
    
    const avgEnvironmentalScore = portfolioCompanies.reduce((sum, company) => 
      sum + (company.environmentalScore || 0), 0) / portfolioCompanies.length;
    
    const avgSocialScore = portfolioCompanies.reduce((sum, company) => 
      sum + (company.socialScore || 0), 0) / portfolioCompanies.length;
    
    const avgGovernanceScore = portfolioCompanies.reduce((sum, company) => 
      sum + (company.governanceScore || 0), 0) / portfolioCompanies.length;

    const ratingDistribution = portfolioCompanies.reduce((acc, company) => {
      const rating = company.esgRating || 'Unrated';
      acc[rating] = (acc[rating] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      avgESGScore,
      avgEnvironmentalScore,
      avgSocialScore,
      avgGovernanceScore,
      ratingDistribution,
      totalCompanies: portfolioCompanies.length
    };
  };

  const portfolioMetrics = calculatePortfolioESGMetrics();

  const renderESGOverview = () => (
    <div className="space-y-6">
      {/* ESG Score Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Overall ESG Score</p>
                <p className="text-2xl font-bold text-gray-900">
                  {portfolioMetrics?.avgESGScore.toFixed(1) || 'N/A'}
                </p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Leaf className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4">
              <Progress value={portfolioMetrics?.avgESGScore || 0} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Environmental</p>
                <p className="text-2xl font-bold text-gray-900">
                  {portfolioMetrics?.avgEnvironmentalScore.toFixed(1) || 'N/A'}
                </p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Leaf className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4">
              <Progress value={portfolioMetrics?.avgEnvironmentalScore || 0} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Social</p>
                <p className="text-2xl font-bold text-gray-900">
                  {portfolioMetrics?.avgSocialScore.toFixed(1) || 'N/A'}
                </p>
              </div>
              <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-4">
              <Progress value={portfolioMetrics?.avgSocialScore || 0} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Governance</p>
                <p className="text-2xl font-bold text-gray-900">
                  {portfolioMetrics?.avgGovernanceScore.toFixed(1) || 'N/A'}
                </p>
              </div>
              <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Shield className="h-6 w-6 text-orange-600" />
              </div>
            </div>
            <div className="mt-4">
              <Progress value={portfolioMetrics?.avgGovernanceScore || 0} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ESG Rating Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <PieChart className="h-5 w-5 mr-2" />
              ESG Rating Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(portfolioMetrics?.ratingDistribution || {}).map(([rating, count]) => (
                <div key={rating} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Badge 
                      variant={rating.includes('A') ? 'default' : 'secondary'}
                      className={`${
                        rating === 'A+' ? 'bg-green-600' :
                        rating === 'A' ? 'bg-green-500' :
                        rating.includes('B') ? 'bg-blue-500' :
                        'bg-gray-500'
                      }`}
                    >
                      {rating}
                    </Badge>
                    <span className="text-sm font-medium">{count} companies</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 h-2 bg-gray-200 rounded-full">
                      <div 
                        className="h-2 bg-blue-500 rounded-full" 
                        style={{ width: `${(count / (portfolioMetrics?.totalCompanies || 1)) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-600">
                      {Math.round((count / (portfolioMetrics?.totalCompanies || 1)) * 100)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="h-5 w-5 mr-2" />
              ESG Improvement Opportunities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 border rounded-lg border-amber-200 bg-amber-50">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-amber-800">Carbon Footprint Reduction</h4>
                    <p className="text-sm text-amber-700">
                      3 companies can reduce emissions by implementing renewable energy
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="p-4 border rounded-lg border-blue-200 bg-blue-50">
                <div className="flex items-start space-x-3">
                  <Users className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-800">Board Diversity</h4>
                    <p className="text-sm text-blue-700">
                      2 companies need more diverse board representation
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="p-4 border rounded-lg border-green-200 bg-green-50">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-green-800">Strong Performers</h4>
                    <p className="text-sm text-green-700">
                      GreenEnergy Solutions achieved A+ rating with 95.0 score
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderEnvironmentalMetrics = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Carbon Emissions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Total CO2 (tons)</span>
                <span className="font-semibold">1,247</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Per employee</span>
                <span className="font-semibold">0.85</span>
              </div>
              <div className="flex items-center space-x-2">
                <TrendingDown className="h-4 w-4 text-green-500" />
                <span className="text-sm text-green-600">12% reduction YoY</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Renewable Energy</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Portfolio Average</span>
                <span className="font-semibold">58%</span>
              </div>
              <Progress value={58} className="h-2" />
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span className="text-sm text-green-600">+8% vs last quarter</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Waste Reduction</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Reduction Rate</span>
                <span className="font-semibold">23%</span>
              </div>
              <Progress value={23} className="h-2" />
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span className="text-sm text-green-600">Target: 30% by year-end</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Environmental Initiatives */}
      <Card>
        <CardHeader>
          <CardTitle>Environmental Initiatives</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { company: 'TechCorp Solutions', initiative: 'Solar Panel Installation', progress: 75, status: 'in_progress' },
                { company: 'GreenEnergy Solutions', initiative: 'Carbon Neutral Operations', progress: 95, status: 'completed' },
                { company: 'FinServ Disruptor', initiative: 'Paperless Office Initiative', progress: 40, status: 'in_progress' }
              ].map((item, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium">{item.initiative}</h4>
                    <Badge variant={item.status === 'completed' ? 'default' : 'secondary'}>
                      {item.status === 'completed' ? 'Completed' : 'In Progress'}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{item.company}</p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{item.progress}%</span>
                    </div>
                    <Progress value={item.progress} className="h-2" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderSocialMetrics = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Employee Satisfaction</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">4.2</div>
                <div className="text-sm text-gray-600">out of 5.0</div>
              </div>
              <Progress value={84} className="h-2" />
              <div className="text-sm text-gray-600">Based on 1,625 employee responses</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Diversity Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm">Gender Diversity</span>
                <span className="font-semibold">42% Female</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Leadership Diversity</span>
                <span className="font-semibold">35% Diverse</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Board Diversity</span>
                <span className="font-semibold">28% Diverse</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Safety Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">0</div>
                <div className="text-sm text-gray-600">Safety incidents this quarter</div>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm text-green-600">365 days incident-free</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderGovernanceMetrics = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Board Independence</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">67%</div>
                <div className="text-sm text-gray-600">Independent directors</div>
              </div>
              <Progress value={67} className="h-2" />
              <div className="text-sm text-gray-600">Above industry average of 55%</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Compliance Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">92</div>
                <div className="text-sm text-gray-600">Compliance rating</div>
              </div>
              <Progress value={92} className="h-2" />
              <div className="text-sm text-gray-600">8 audit findings resolved</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Ethics Training</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">98%</div>
                <div className="text-sm text-gray-600">Completion rate</div>
              </div>
              <Progress value={98} className="h-2" />
              <div className="text-sm text-gray-600">1,580 employees trained</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <RefreshCw className="h-8 w-8 animate-spin text-green-600" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">ESG Reporting Dashboard</h1>
          <p className="text-gray-600">
            Environmental, Social, and Governance metrics across portfolio
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export ESG Report
          </Button>
          
          <Button onClick={loadESGData} size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Data
          </Button>
        </div>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="environmental">Environmental</TabsTrigger>
          <TabsTrigger value="social">Social</TabsTrigger>
          <TabsTrigger value="governance">Governance</TabsTrigger>
          <TabsTrigger value="targets">Targets</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {renderESGOverview()}
        </TabsContent>

        <TabsContent value="environmental" className="space-y-6">
          {renderEnvironmentalMetrics()}
        </TabsContent>

        <TabsContent value="social" className="space-y-6">
          {renderSocialMetrics()}
        </TabsContent>

        <TabsContent value="governance" className="space-y-6">
          {renderGovernanceMetrics()}
        </TabsContent>

        <TabsContent value="targets" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>ESG Targets & Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {[
                  { category: 'Environmental', target: 'Reduce carbon emissions by 25%', progress: 68, deadline: '2024-12-31' },
                  { category: 'Social', target: 'Achieve 50% female leadership', progress: 42, deadline: '2025-06-30' },
                  { category: 'Governance', target: 'Implement board term limits', progress: 85, deadline: '2024-09-30' }
                ].map((target, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <Badge variant="outline">{target.category}</Badge>
                          <span className="text-sm text-gray-600">Due: {formatDate(target.deadline)}</span>
                        </div>
                        <h4 className="font-medium">{target.target}</h4>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold">{target.progress}%</div>
                        <div className="text-sm text-gray-600">Complete</div>
                      </div>
                    </div>
                    <Progress value={target.progress} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}