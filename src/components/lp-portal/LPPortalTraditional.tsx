'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ModuleHeader, ProcessNotice, MODE_DESCRIPTIONS } from '@/components/shared/ModeIndicators';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Calendar,
  FileText,
  Download,
  Eye,
  BarChart3,
  PieChart,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Target,
  Banknote,
  Vote,
  Handshake,
  MessageSquare,
  Video,
  Phone,
  Mail,
  Send,
  Star,
  Filter,
  Search,
  Bell,
  Shield,
  Globe,
  MapPin,
  Activity,
  Settings,
  BookOpen,
  Award,
  Briefcase,
  Building,
  ArrowUpRight,
  ArrowDownRight,
  Info,
  Calculator
} from 'lucide-react';
import { formatCurrency, formatPercentage, formatDate } from '@/lib/utils';
import type { 
  LPDashboardData,
  LPCommitment,
  LPCapitalCall,
  LPDistribution,
  LPCoInvestment,
  LPElection,
  LPDocument
} from '@/types/lp-portal';

interface LPPortalTraditionalProps {
  data: LPDashboardData;
  onRespond: (type: string, id: string) => void;
  onViewDetails: (type: string, id: string) => void;
}

export function LPPortalTraditional({ 
  data, 
  onRespond, 
  onViewDetails 
}: LPPortalTraditionalProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedFund, setSelectedFund] = useState<string | null>(null);
  const [communicationFilter, setCommunicationFilter] = useState('all');
  const [reportPeriod, setReportPeriod] = useState('q4-2024');

  // Enhanced mock data for demonstration
  const mockPerformanceBenchmarks = {
    'Cambridge Associates': 15.2,
    'Thomson Reuters': 14.8,
    'Preqin': 16.1
  };

  const mockESGMetrics = {
    score: 87,
    initiatives: 23,
    carbonReduction: 34,
    diversityScore: 78
  };

  const mockCommunications = [
    {
      id: '1',
      type: 'meeting',
      title: 'Quarterly LP Meeting - Q4 2024 Performance Review',
      sender: 'Portfolio Management Team',
      date: new Date('2024-12-15'),
      status: 'scheduled',
      priority: 'high',
      responseRequired: true,
      description: 'Review Q4 performance, discuss 2025 strategy and upcoming opportunities'
    },
    {
      id: '2', 
      type: 'announcement',
      title: 'New Portfolio Company Addition - TechCorp Acquisition',
      sender: 'Investment Team',
      date: new Date('2024-12-10'),
      status: 'unread',
      priority: 'medium',
      responseRequired: false,
      description: 'Exciting addition to our enterprise software portfolio'
    },
    {
      id: '3',
      type: 'request',
      title: 'Annual Investor Survey - Strategic Feedback',
      sender: 'LP Relations',
      date: new Date('2024-12-08'),
      status: 'pending',
      priority: 'medium',
      responseRequired: true,
      description: 'Share your insights on fund strategy and market outlook'
    }
  ];

  const mockCustomReports = [
    {
      id: '1',
      name: 'ESG Impact Assessment',
      type: 'sustainability',
      frequency: 'quarterly',
      lastGenerated: new Date('2024-12-01'),
      status: 'available',
      metrics: ['Carbon footprint', 'Diversity metrics', 'Governance scores']
    },
    {
      id: '2',
      name: 'Risk-Adjusted Performance Analysis',
      type: 'performance',
      frequency: 'monthly',
      lastGenerated: new Date('2024-12-15'),
      status: 'available',
      metrics: ['Sharpe ratio', 'Max drawdown', 'Beta analysis']
    },
    {
      id: '3',
      name: 'Sector Allocation Deep Dive',
      type: 'allocation',
      frequency: 'annual',
      lastGenerated: new Date('2024-11-30'),
      status: 'generating',
      metrics: ['Sector weights', 'Geographic distribution', 'Stage analysis']
    }
  ];

  const mockAlerts = [
    {
      id: '1',
      type: 'performance',
      severity: 'info',
      title: 'Fund III outperforming benchmark by 2.3%',
      description: 'Strong Q4 performance driven by three successful exits',
      timestamp: new Date('2024-12-16')
    },
    {
      id: '2',
      type: 'capital',
      severity: 'warning',
      title: 'Capital call upcoming for Fund IV',
      description: 'Expected capital call of $2.5M due January 15th',
      timestamp: new Date('2024-12-14')
    },
    {
      id: '3',
      type: 'market',
      severity: 'info',
      title: 'Market opportunity in AI sector',
      description: 'GP identifying new investment opportunities in enterprise AI',
      timestamp: new Date('2024-12-12')
    }
  ];

  const getPerformanceColor = (value: number, benchmark: number): string => {
    if (value >= benchmark * 1.1) return 'text-green-600';
    if (value >= benchmark * 0.9) return 'text-blue-600';
    return 'text-red-600';
  };

  const getStatusColor = (status: string): string => {
    const colors: Record<string, string> = {
      'ACTIVE': 'bg-green-100 text-green-800',
      'PENDING': 'bg-yellow-100 text-yellow-800',
      'FUNDED': 'bg-green-100 text-green-800',
      'OVERDUE': 'bg-red-100 text-red-800',
      'RECEIVED': 'bg-green-100 text-green-800',
      'OFFERED': 'bg-blue-100 text-blue-800',
      'ACCEPTED': 'bg-green-100 text-green-800',
      'DECLINED': 'bg-gray-100 text-gray-800',
      'AVAILABLE': 'bg-blue-100 text-blue-800',
      'UNREAD': 'bg-orange-100 text-orange-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const calculateCommitmentProgress = (commitment: LPCommitment) => {
    return (commitment.calledAmount / commitment.commitmentAmount) * 100;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Standardized Header */}
      <ModuleHeader
        title="LP Portal"
        description="Complete manual control over limited partner operations and fund communications"
        mode="traditional"
        actions={
          <div className="flex space-x-2">
            <Button variant="outline" className="flex items-center space-x-2 border-gray-300 text-gray-700">
              <MessageSquare className="h-4 w-4" />
              <span>New Message</span>
            </Button>
            <Button className="flex items-center space-x-2 bg-gray-700 hover:bg-gray-800">
              <FileText className="h-4 w-4" />
              <span>Generate Report</span>
            </Button>
          </div>
        }
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-8">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="communications">Communications</TabsTrigger>
          <TabsTrigger value="reports">Custom Reports</TabsTrigger>
          <TabsTrigger value="commitments">Commitments</TabsTrigger>
          <TabsTrigger value="capital-calls">Capital Calls</TabsTrigger>
          <TabsTrigger value="co-investments">Co-Investments</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Enhanced Dashboard Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-bold mb-2">Welcome to Your LP Portal</h1>
                <p className="text-blue-100 mb-4">Comprehensive view of your private equity investments</p>
                <div className="flex items-center space-x-6 text-sm">
                  <div className="flex items-center">
                    <Building className="h-4 w-4 mr-1" />
                    <span>{data.commitments.length} Active Funds</span>
                  </div>
                  <div className="flex items-center">
                    <DollarSign className="h-4 w-4 mr-1" />
                    <span>{formatCurrency(data.summary.totalCommitments)} Total Committed</span>
                  </div>
                  <div className="flex items-center">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    <span>{formatPercentage(data.summary.weightedAverageIRR)} Portfolio IRR</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="bg-white/20 rounded-lg p-3">
                  <Bell className="h-6 w-6 mb-1 mx-auto" />
                  <p className="text-xs">3 New Alerts</p>
                </div>
              </div>
            </div>
          </div>

          {/* Key Metrics Dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Target className="h-8 w-8 text-blue-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Portfolio MOIC</p>
                    <p className="text-2xl font-bold text-gray-900">{data.summary.averageMOIC.toFixed(2)}x</p>
                    <p className="text-xs text-green-600 flex items-center">
                      <ArrowUpRight className="h-3 w-3 mr-1" />
                      +12% vs benchmark
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Activity className="h-8 w-8 text-green-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Net IRR</p>
                    <p className="text-2xl font-bold text-gray-900">{formatPercentage(data.summary.weightedAverageIRR)}</p>
                    <p className="text-xs text-green-600 flex items-center">
                      <ArrowUpRight className="h-3 w-3 mr-1" />
                      Above target
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Award className="h-8 w-8 text-purple-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">ESG Score</p>
                    <p className="text-2xl font-bold text-gray-900">{mockESGMetrics.score}/100</p>
                    <p className="text-xs text-green-600 flex items-center">
                      <ArrowUpRight className="h-3 w-3 mr-1" />
                      Top quartile
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Globe className="h-8 w-8 text-orange-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Geographic Exposure</p>
                    <p className="text-2xl font-bold text-gray-900">12</p>
                    <p className="text-xs text-gray-600">Countries</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Portfolio Alerts & Updates */}
          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="h-5 w-5 mr-2 text-gray-600" />
                Portfolio Alerts & Updates
              </CardTitle>
              <CardDescription>Important notifications and fund updates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockAlerts.map((alert) => (
                  <div key={alert.id} className={`p-4 rounded-lg border-l-4 ${
                    alert.severity === 'warning' ? 'bg-yellow-50 border-yellow-400' :
                    alert.severity === 'info' ? 'bg-blue-50 border-blue-400' :
                    'bg-green-50 border-green-400'
                  }`}>
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{alert.title}</p>
                        <p className="text-sm text-gray-600 mt-1">{alert.description}</p>
                      </div>
                      <div className="flex items-center text-xs text-gray-500">
                        <Clock className="h-4 w-4 mr-1" />
                        {formatDate(alert.timestamp)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Portfolio Performance Summary */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Portfolio Performance</CardTitle>
                <CardDescription>Aggregated performance across all fund commitments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <BarChart3 className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-green-600">
                      {formatPercentage(data.summary.weightedAverageIRR)}
                    </p>
                    <p className="text-sm text-gray-600">Weighted Avg IRR</p>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <Target className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-blue-600">
                      {data.summary.averageMOIC.toFixed(2)}x
                    </p>
                    <p className="text-sm text-gray-600">Average MOIC</p>
                  </div>
                </div>
                
                <div className="mt-6 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">Capital Efficiency</span>
                    <span className="text-sm text-gray-900">
                      {formatPercentage((data.summary.totalCalled / data.summary.totalCommitments) * 100)}
                    </span>
                  </div>
                  <Progress value={(data.summary.totalCalled / data.summary.totalCommitments) * 100} />
                  
                  <div className="grid grid-cols-3 gap-4 pt-3 text-center text-sm">
                    <div>
                      <p className="font-semibold text-gray-900">{formatCurrency(data.summary.totalCommitments)}</p>
                      <p className="text-gray-600">Committed</p>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{formatCurrency(data.summary.totalCalled)}</p>
                      <p className="text-gray-600">Called</p>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{formatCurrency(data.summary.currentNAV)}</p>
                      <p className="text-gray-600">Current NAV</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest transactions and updates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.recentDistributions.slice(0, 3).map((distribution) => (
                    <div key={distribution.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center">
                        <TrendingUp className="h-5 w-5 text-green-600 mr-3" />
                        <div>
                          <p className="font-medium">Distribution Received</p>
                          <p className="text-sm text-gray-600">
                            {data.commitments.find(c => c.id === distribution.commitmentId)?.fundName}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-green-600">
                          +{formatCurrency(distribution.distributionAmount)}
                        </p>
                        <p className="text-xs text-gray-600">
                          {formatDate(distribution.distributionDate)}
                        </p>
                      </div>
                    </div>
                  ))}
                  
                  {data.activeCapitalCalls.slice(0, 2).map((call) => (
                    <div key={call.id} className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                      <div className="flex items-center">
                        <Clock className="h-5 w-5 text-yellow-600 mr-3" />
                        <div>
                          <p className="font-medium">Capital Call Due</p>
                          <p className="text-sm text-gray-600">
                            {data.commitments.find(c => c.id === call.commitmentId)?.fundName}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-yellow-600">
                          {formatCurrency(call.callAmount)}
                        </p>
                        <p className="text-xs text-gray-600">
                          Due: {formatDate(call.dueDate)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Fund Commitments Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Fund Commitments Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  {data.commitments.map((commitment) => (
                    <div key={commitment.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h3 className="font-semibold">{commitment.fundName}</h3>
                          <p className="text-sm text-gray-600">Vintage {commitment.vintage}</p>
                        </div>
                        <Badge className={getStatusColor(commitment.status)}>
                          {commitment.status}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">IRR</p>
                          <p className={`font-semibold ${getPerformanceColor(commitment.irr || 0, 15)}`}>
                            {formatPercentage(commitment.irr || 0)}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600">MOIC</p>
                          <p className={`font-semibold ${getPerformanceColor(commitment.moic || 0, 1.5)}`}>
                            {(commitment.moic || 0).toFixed(2)}x
                          </p>
                        </div>
                      </div>
                      
                      <div className="mt-3">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Capital Called</span>
                          <span>{formatPercentage(calculateCommitmentProgress(commitment))}</span>
                        </div>
                        <Progress value={calculateCommitmentProgress(commitment)} />
                        <div className="flex justify-between text-xs text-gray-600 mt-1">
                          <span>{formatCurrency(commitment.calledAmount)} called</span>
                          <span>{formatCurrency(commitment.commitmentAmount)} committed</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="space-y-4">
                  {/* Performance Chart Placeholder */}
                  <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <PieChart className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-600">Portfolio Allocation Chart</p>
                      <p className="text-sm text-gray-500">Interactive chart would be here</p>
                    </div>
                  </div>
                  
                  {/* Key Metrics */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gray-50 p-3 rounded-lg text-center">
                      <p className="text-lg font-bold text-gray-900">
                        {formatCurrency(data.summary.totalDistributed)}
                      </p>
                      <p className="text-xs text-gray-600">Total Distributions</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg text-center">
                      <p className="text-lg font-bold text-gray-900">
                        {data.commitments.length}
                      </p>
                      <p className="text-xs text-gray-600">Active Funds</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          {/* Enhanced Performance Analytics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance vs Benchmarks</CardTitle>
                <CardDescription>Comparison against industry benchmarks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(mockPerformanceBenchmarks).map(([benchmark, value]) => (
                    <div key={benchmark} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{benchmark}</p>
                        <p className="text-sm text-gray-600">Industry Benchmark</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-blue-600">{formatPercentage(value)}</p>
                        <p className={`text-sm flex items-center ${
                          data.summary.weightedAverageIRR > value ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {data.summary.weightedAverageIRR > value ? 
                            <ArrowUpRight className="h-3 w-3 mr-1" /> : 
                            <ArrowDownRight className="h-3 w-3 mr-1" />
                          }
                          {(((data.summary.weightedAverageIRR - value) / value) * 100).toFixed(1)}%
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Risk Analytics</CardTitle>
                <CardDescription>Portfolio risk assessment and metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <Shield className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-blue-600">0.73</p>
                      <p className="text-sm text-gray-600">Sharpe Ratio</p>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <BarChart3 className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-purple-600">-8.4%</p>
                      <p className="text-sm text-gray-600">Max Drawdown</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Concentration Risk</span>
                        <span>Low</span>
                      </div>
                      <Progress value={25} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Liquidity Risk</span>
                        <span>Moderate</span>
                      </div>
                      <Progress value={60} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Market Risk</span>
                        <span>Low-Medium</span>
                      </div>
                      <Progress value={40} className="h-2" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* ESG & Sustainability Metrics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Award className="h-5 w-5 mr-2 text-green-600" />
                ESG & Sustainability Performance
              </CardTitle>
              <CardDescription>Environmental, Social, and Governance impact metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="text-center p-6 bg-green-50 rounded-lg">
                  <Globe className="h-10 w-10 text-green-600 mx-auto mb-3" />
                  <p className="text-3xl font-bold text-green-600">{mockESGMetrics.score}</p>
                  <p className="text-sm text-gray-600 mb-2">Overall ESG Score</p>
                  <Badge className="bg-green-100 text-green-800">Top Quartile</Badge>
                </div>
                <div className="text-center p-6 bg-blue-50 rounded-lg">
                  <Activity className="h-10 w-10 text-blue-600 mx-auto mb-3" />
                  <p className="text-3xl font-bold text-blue-600">{mockESGMetrics.initiatives}</p>
                  <p className="text-sm text-gray-600 mb-2">Active Initiatives</p>
                  <Badge className="bg-blue-100 text-blue-800">+5 This Year</Badge>
                </div>
                <div className="text-center p-6 bg-purple-50 rounded-lg">
                  <Shield className="h-10 w-10 text-purple-600 mx-auto mb-3" />
                  <p className="text-3xl font-bold text-purple-600">{mockESGMetrics.carbonReduction}%</p>
                  <p className="text-sm text-gray-600 mb-2">Carbon Reduction</p>
                  <Badge className="bg-purple-100 text-purple-800">2024 Target: 30%</Badge>
                </div>
                <div className="text-center p-6 bg-orange-50 rounded-lg">
                  <Users className="h-10 w-10 text-orange-600 mx-auto mb-3" />
                  <p className="text-3xl font-bold text-orange-600">{mockESGMetrics.diversityScore}%</p>
                  <p className="text-sm text-gray-600 mb-2">Diversity Score</p>
                  <Badge className="bg-orange-100 text-orange-800">Above Average</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sector & Geographic Analysis */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Sector Allocation</CardTitle>
                <CardDescription>Portfolio allocation by industry sector</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { sector: 'Technology', percentage: 35, amount: 87.5 },
                    { sector: 'Healthcare', percentage: 25, amount: 62.5 },
                    { sector: 'Financial Services', percentage: 20, amount: 50.0 },
                    { sector: 'Consumer', percentage: 15, amount: 37.5 },
                    { sector: 'Industrial', percentage: 5, amount: 12.5 }
                  ].map((sector) => (
                    <div key={sector.sector} className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium text-gray-900">{sector.sector}</span>
                          <span className="text-sm text-gray-600">
                            {sector.percentage}% • ${sector.amount}M
                          </span>
                        </div>
                        <Progress value={sector.percentage} className="h-2" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Geographic Distribution</CardTitle>
                <CardDescription>Portfolio exposure by region</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { region: 'North America', percentage: 60, amount: 150.0 },
                    { region: 'Europe', percentage: 25, amount: 62.5 },
                    { region: 'Asia Pacific', percentage: 12, amount: 30.0 },
                    { region: 'Other', percentage: 3, amount: 7.5 }
                  ].map((region) => (
                    <div key={region.region} className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex justify-between mb-1">
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                            <span className="text-sm font-medium text-gray-900">{region.region}</span>
                          </div>
                          <span className="text-sm text-gray-600">
                            {region.percentage}% • ${region.amount}M
                          </span>
                        </div>
                        <Progress value={region.percentage} className="h-2" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="communications" className="space-y-6">
          {/* Communications Hub */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Communications Center</h2>
              <p className="text-gray-600">Stay connected with your fund managers and investment teams</p>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button size="sm">
                <MessageSquare className="h-4 w-4 mr-2" />
                New Message
              </Button>
            </div>
          </div>

          {/* Communication Types */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-4 text-center">
                <MessageSquare className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <p className="font-medium text-gray-900">Messages</p>
                <p className="text-sm text-gray-600">2 unread</p>
              </CardContent>
            </Card>
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-4 text-center">
                <Video className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <p className="font-medium text-gray-900">Meetings</p>
                <p className="text-sm text-gray-600">1 upcoming</p>
              </CardContent>
            </Card>
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-4 text-center">
                <Mail className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <p className="font-medium text-gray-900">Announcements</p>
                <p className="text-sm text-gray-600">3 recent</p>
              </CardContent>
            </Card>
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-4 text-center">
                <Bell className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                <p className="font-medium text-gray-900">Alerts</p>
                <p className="text-sm text-gray-600">5 active</p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Communications */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Communications</CardTitle>
              <CardDescription>Latest messages and updates from your fund managers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockCommunications.map((comm) => (
                  <div key={comm.id} className={`p-4 border rounded-lg ${
                    comm.status === 'unread' ? 'bg-blue-50 border-blue-200' : 'bg-white'
                  }`}>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start space-x-3">
                        <div className={`p-2 rounded-lg ${
                          comm.type === 'meeting' ? 'bg-green-100' :
                          comm.type === 'announcement' ? 'bg-blue-100' :
                          'bg-orange-100'
                        }`}>
                          {comm.type === 'meeting' ? <Video className="h-5 w-5 text-green-600" /> :
                           comm.type === 'announcement' ? <Mail className="h-5 w-5 text-blue-600" /> :
                           <MessageSquare className="h-5 w-5 text-orange-600" />
                          }
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{comm.title}</h3>
                          <p className="text-sm text-gray-600 mb-1">{comm.sender}</p>
                          <p className="text-sm text-gray-600">{comm.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={`${getStatusColor(comm.status.toUpperCase())}`}>
                          {comm.status}
                        </Badge>
                        <Badge variant="outline" className={comm.priority === 'high' ? 'border-red-200 text-red-700' : ''}>
                          {comm.priority}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="h-4 w-4 mr-1" />
                        {formatDate(comm.date)}
                      </div>
                      <div className="space-x-2">
                        {comm.responseRequired && (
                          <Button size="sm" variant="outline">
                            <Send className="h-4 w-4 mr-1" />
                            Respond
                          </Button>
                        )}
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common communication tasks</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start" variant="outline">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Send Message to GP
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Meeting
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Phone className="h-4 w-4 mr-2" />
                  Request Call
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <FileText className="h-4 w-4 mr-2" />
                  Request Information
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Communication Preferences</CardTitle>
                <CardDescription>Manage how you receive updates</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Email Notifications</span>
                  <Badge className="bg-green-100 text-green-800">Enabled</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">SMS Alerts</span>
                  <Badge className="bg-green-100 text-green-800">Enabled</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Meeting Reminders</span>
                  <Badge className="bg-green-100 text-green-800">Enabled</Badge>
                </div>
                <Button size="sm" variant="outline" className="w-full mt-4">
                  <Settings className="h-4 w-4 mr-2" />
                  Manage Preferences
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          {/* Custom Reporting Dashboard */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Custom Reports & Analytics</h2>
              <p className="text-gray-600">Generate tailored reports and insights for your portfolio</p>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm">
                <Search className="h-4 w-4 mr-2" />
                Search Reports
              </Button>
              <Button size="sm">
                <FileText className="h-4 w-4 mr-2" />
                New Report
              </Button>
            </div>
          </div>

          {/* Report Templates */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card className="cursor-pointer hover:shadow-md transition-shadow border-2 border-dashed border-gray-200">
              <CardContent className="p-6 text-center">
                <Calculator className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">Performance Analysis</h3>
                <p className="text-sm text-gray-600 mb-4">IRR, MOIC, DPI analysis with benchmarking</p>
                <Button size="sm" variant="outline">
                  Create Report
                </Button>
              </CardContent>
            </Card>
            <Card className="cursor-pointer hover:shadow-md transition-shadow border-2 border-dashed border-gray-200">
              <CardContent className="p-6 text-center">
                <PieChart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">Portfolio Allocation</h3>
                <p className="text-sm text-gray-600 mb-4">Sector, geography, and vintage analysis</p>
                <Button size="sm" variant="outline">
                  Create Report
                </Button>
              </CardContent>
            </Card>
            <Card className="cursor-pointer hover:shadow-md transition-shadow border-2 border-dashed border-gray-200">
              <CardContent className="p-6 text-center">
                <Award className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">ESG Impact</h3>
                <p className="text-sm text-gray-600 mb-4">Sustainability metrics and impact assessment</p>
                <Button size="sm" variant="outline">
                  Create Report
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Active Custom Reports */}
          <Card>
            <CardHeader>
              <CardTitle>Your Custom Reports</CardTitle>
              <CardDescription>Recently generated and scheduled reports</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockCustomReports.map((report) => (
                  <div key={report.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900">{report.name}</h3>
                        <p className="text-sm text-gray-600 mb-2">Generated {report.frequency}</p>
                        <div className="flex flex-wrap gap-2">
                          {report.metrics.map((metric, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {metric}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getStatusColor(report.status.toUpperCase())}>
                          {report.status}
                        </Badge>
                        <div className="text-right">
                          <p className="text-sm text-gray-600">
                            Last: {formatDate(report.lastGenerated)}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t">
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <FileText className="h-4 w-4 mr-1" />
                          <span>{report.type}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>{report.frequency}</span>
                        </div>
                      </div>
                      <div className="space-x-2">
                        {report.status === 'available' && (
                          <Button size="sm" variant="outline">
                            <Download className="h-4 w-4 mr-1" />
                            Download
                          </Button>
                        )}
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        <Button size="sm" variant="outline">
                          <Settings className="h-4 w-4 mr-1" />
                          Configure
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Report Analytics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Report Usage Analytics</CardTitle>
                <CardDescription>Track your reporting activity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Reports Generated This Month</span>
                    <span className="text-2xl font-bold text-blue-600">12</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Most Requested</span>
                    <span className="text-sm text-gray-600">Performance Analysis</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Average Generation Time</span>
                    <span className="text-sm text-gray-600">2.3 minutes</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Data Freshness</span>
                    <Badge className="bg-green-100 text-green-800">Real-time</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Scheduled Reports</CardTitle>
                <CardDescription>Automated report delivery</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">Monthly Performance Summary</p>
                      <p className="text-sm text-gray-600">Next: January 1, 2025</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">Quarterly ESG Report</p>
                      <p className="text-sm text-gray-600">Next: April 1, 2025</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">Annual Tax Summary</p>
                      <p className="text-sm text-gray-600">Next: December 31, 2024</p>
                    </div>
                    <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="commitments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Fund Commitments</CardTitle>
              <CardDescription>Detailed view of all fund commitments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.commitments.map((commitment) => (
                  <div key={commitment.id} className="border rounded-lg p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold mb-1">{commitment.fundName}</h3>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span>Vintage: {commitment.vintage}</span>
                          <span>Commitment: {formatCurrency(commitment.commitmentAmount)}</span>
                          <Badge className={getStatusColor(commitment.status)}>
                            {commitment.status}
                          </Badge>
                        </div>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => onViewDetails('commitment', commitment.id)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Details
                      </Button>
                    </div>
                    
                    {/* Performance Metrics */}
                    <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
                      <div className="text-center">
                        <p className="text-sm text-gray-600">IRR</p>
                        <p className={`text-lg font-bold ${getPerformanceColor(commitment.irr || 0, 15)}`}>
                          {formatPercentage(commitment.irr || 0)}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-gray-600">MOIC</p>
                        <p className={`text-lg font-bold ${getPerformanceColor(commitment.moic || 0, 1.5)}`}>
                          {(commitment.moic || 0).toFixed(2)}x
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-gray-600">DPI</p>
                        <p className="text-lg font-bold text-gray-900">
                          {(commitment.dpi || 0).toFixed(2)}x
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-gray-600">RVPI</p>
                        <p className="text-lg font-bold text-gray-900">
                          {(commitment.rvpi || 0).toFixed(2)}x
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-gray-600">TVPI</p>
                        <p className="text-lg font-bold text-gray-900">
                          {(commitment.tvpi || 0).toFixed(2)}x
                        </p>
                      </div>
                    </div>
                    
                    {/* Capital Summary */}
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div className="bg-blue-50 p-3 rounded text-center">
                        <p className="text-sm text-gray-600">Called Amount</p>
                        <p className="font-semibold text-blue-600">
                          {formatCurrency(commitment.calledAmount)}
                        </p>
                      </div>
                      <div className="bg-green-50 p-3 rounded text-center">
                        <p className="text-sm text-gray-600">Distributed</p>
                        <p className="font-semibold text-green-600">
                          {formatCurrency(commitment.distributedAmount)}
                        </p>
                      </div>
                      <div className="bg-purple-50 p-3 rounded text-center">
                        <p className="text-sm text-gray-600">Current NAV</p>
                        <p className="font-semibold text-purple-600">
                          {formatCurrency(commitment.currentNAV)}
                        </p>
                      </div>
                    </div>
                    
                    {/* Investment Terms */}
                    <div className="grid grid-cols-4 gap-4 text-sm border-t pt-4">
                      <div>
                        <p className="text-gray-600">Management Fee</p>
                        <p className="font-medium">{formatPercentage(commitment.managementFee || 0)}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Carried Interest</p>
                        <p className="font-medium">{formatPercentage(commitment.carriedInterest || 0)}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Hurdle Rate</p>
                        <p className="font-medium">{formatPercentage(commitment.hurdle || 0)}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Expected Final</p>
                        <p className="font-medium">
                          {commitment.expectedFinalDate ? formatDate(commitment.expectedFinalDate) : 'TBD'}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="capital-calls" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Capital Calls</span>
                <Badge variant="outline">
                  {data.activeCapitalCalls.length} Active
                </Badge>
              </CardTitle>
              <CardDescription>Manage your capital call responses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.activeCapitalCalls.map((call) => {
                  const commitment = data.commitments.find(c => c.id === call.commitmentId);
                  const daysUntilDue = Math.ceil((call.dueDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                  
                  return (
                    <div key={call.id} className="border rounded-lg p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold mb-1">
                            {commitment?.fundName} - Call #{call.callNumber}
                          </h3>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span>Amount: {formatCurrency(call.callAmount)}</span>
                            <span>Due: {formatDate(call.dueDate)}</span>
                            <Badge className={getStatusColor(call.status)}>
                              {call.status}
                            </Badge>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`text-sm font-medium mb-1 ${
                            daysUntilDue <= 7 ? 'text-red-600' : daysUntilDue <= 14 ? 'text-yellow-600' : 'text-green-600'
                          }`}>
                            {daysUntilDue > 0 ? `${daysUntilDue} days remaining` : `${Math.abs(daysUntilDue)} days overdue`}
                          </div>
                          <div className="space-x-2">
                            <Button 
                              size="sm"
                              onClick={() => onRespond('capital-call', call.id)}
                            >
                              Respond
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => onViewDetails('capital-call', call.id)}
                            >
                              Details
                            </Button>
                          </div>
                        </div>
                      </div>
                      
                      {call.purpose && (
                        <div className="mb-4">
                          <p className="text-sm font-medium text-gray-700 mb-1">Purpose:</p>
                          <p className="text-sm text-gray-600">{call.purpose}</p>
                        </div>
                      )}
                      
                      <div className="grid grid-cols-3 gap-4 text-sm bg-gray-50 p-3 rounded">
                        <div>
                          <p className="text-gray-600">Call Amount</p>
                          <p className="font-medium">{formatCurrency(call.callAmount)}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">% of Commitment</p>
                          <p className="font-medium">
                            {formatPercentage((call.callAmount / (commitment?.commitmentAmount || 1)) * 100)}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600">Total Called to Date</p>
                          <p className="font-medium">
                            {formatCurrency((commitment?.calledAmount || 0) + call.callAmount)}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
                
                {data.activeCapitalCalls.length === 0 && (
                  <div className="text-center py-12">
                    <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                    <p className="text-gray-600 mb-2">No active capital calls</p>
                    <p className="text-sm text-gray-500">You're all caught up!</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="distributions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Distribution History</CardTitle>
              <CardDescription>Record of all distributions received</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.recentDistributions.map((distribution) => {
                  const commitment = data.commitments.find(c => c.id === distribution.commitmentId);
                  
                  return (
                    <div key={distribution.id} className="border rounded-lg p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold mb-1">
                            {commitment?.fundName} - Distribution #{distribution.distributionNumber}
                          </h3>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span>Type: {distribution.distributionType.replace('_', ' ')}</span>
                            <span>Date: {formatDate(distribution.distributionDate)}</span>
                            <Badge className={getStatusColor(distribution.status)}>
                              {distribution.status}
                            </Badge>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-green-600">
                            +{formatCurrency(distribution.distributionAmount)}
                          </p>
                          {distribution.paymentDate && (
                            <p className="text-sm text-gray-600">
                              Received: {formatDate(distribution.paymentDate)}
                            </p>
                          )}
                        </div>
                      </div>
                      
                      {distribution.sourceDescription && (
                        <div className="mb-4">
                          <p className="text-sm font-medium text-gray-700 mb-1">Source:</p>
                          <p className="text-sm text-gray-600">{distribution.sourceDescription}</p>
                        </div>
                      )}
                      
                      <div className="grid grid-cols-4 gap-4 text-sm bg-gray-50 p-3 rounded">
                        <div>
                          <p className="text-gray-600">Gross Amount</p>
                          <p className="font-medium">{formatCurrency(distribution.distributionAmount)}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Tax Withheld</p>
                          <p className="font-medium">
                            {distribution.taxWithheld ? formatCurrency(distribution.taxWithheld) : 'N/A'}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600">Net Amount</p>
                          <p className="font-medium">
                            {formatCurrency(distribution.distributionAmount - (distribution.taxWithheld || 0))}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600">Type</p>
                          <p className="font-medium">{distribution.distributionType.replace('_', ' ')}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
                
                {data.recentDistributions.length === 0 && (
                  <div className="text-center py-12">
                    <Banknote className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-2">No distributions yet</p>
                    <p className="text-sm text-gray-500">Distributions will appear here when available</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="co-investments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Co-Investment Opportunities</CardTitle>
              <CardDescription>Available co-investment opportunities from fund managers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.coInvestmentOpportunities.map((opportunity) => {
                  const daysUntilDeadline = Math.ceil((opportunity.responseDeadline.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                  
                  return (
                    <div key={opportunity.id} className="border rounded-lg p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold mb-1">{opportunity.opportunityName}</h3>
                          <p className="text-gray-600 mb-2">{opportunity.targetCompany}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span>Sector: {opportunity.sector}</span>
                            <span>Geography: {opportunity.geography}</span>
                            <Badge className={getStatusColor(opportunity.status)}>
                              {opportunity.status}
                            </Badge>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`text-sm font-medium mb-2 ${
                            daysUntilDeadline <= 3 ? 'text-red-600' : daysUntilDeadline <= 7 ? 'text-yellow-600' : 'text-green-600'
                          }`}>
                            {daysUntilDeadline > 0 ? `${daysUntilDeadline} days to respond` : `${Math.abs(daysUntilDeadline)} days overdue`}
                          </div>
                          <div className="space-x-2">
                            <Button 
                              size="sm"
                              onClick={() => onRespond('co-investment', opportunity.id)}
                            >
                              <Handshake className="h-4 w-4 mr-1" />
                              Respond
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => onViewDetails('co-investment', opportunity.id)}
                            >
                              Details
                            </Button>
                          </div>
                        </div>
                      </div>
                      
                      {opportunity.description && (
                        <div className="mb-4">
                          <p className="text-sm text-gray-600">{opportunity.description}</p>
                        </div>
                      )}
                      
                      <div className="grid grid-cols-4 gap-4 text-sm bg-gray-50 p-3 rounded">
                        <div>
                          <p className="text-gray-600">Min Investment</p>
                          <p className="font-medium">{formatCurrency(opportunity.minimumInvestment)}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Max Investment</p>
                          <p className="font-medium">{formatCurrency(opportunity.maximumInvestment)}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Response Deadline</p>
                          <p className="font-medium">{formatDate(opportunity.responseDeadline)}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Expected Closing</p>
                          <p className="font-medium">
                            {opportunity.expectedClosingDate ? formatDate(opportunity.expectedClosingDate) : 'TBD'}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
                
                {data.coInvestmentOpportunities.length === 0 && (
                  <div className="text-center py-12">
                    <Handshake className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-2">No co-investment opportunities</p>
                    <p className="text-sm text-gray-500">New opportunities will appear here when available</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          {/* Active Elections */}
          {data.activeElections.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Active Elections & Voting</CardTitle>
                <CardDescription>Participate in fund governance decisions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.activeElections.map((election) => {
                    const daysUntilEnd = Math.ceil((election.endDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                    
                    return (
                      <div key={election.id} className="border rounded-lg p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-lg font-semibold mb-1">{election.title}</h3>
                            <p className="text-gray-600 mb-2">{election.description}</p>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <span>Type: {election.electionType.replace('_', ' ')}</span>
                              <Badge className={getStatusColor(election.status)}>
                                {election.status}
                              </Badge>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className={`text-sm font-medium mb-2 ${
                              daysUntilEnd <= 3 ? 'text-red-600' : daysUntilEnd <= 7 ? 'text-yellow-600' : 'text-green-600'
                            }`}>
                              {daysUntilEnd > 0 ? `${daysUntilEnd} days remaining` : 'Voting closed'}
                            </div>
                            {election.status === 'ACTIVE' && (
                              <Button 
                                size="sm"
                                onClick={() => onRespond('election', election.id)}
                              >
                                <Vote className="h-4 w-4 mr-1" />
                                Vote
                              </Button>
                            )}
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm bg-gray-50 p-3 rounded">
                          <div>
                            <p className="text-gray-600">Voting Period</p>
                            <p className="font-medium">
                              {formatDate(election.startDate)} - {formatDate(election.endDate)}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-600">Options</p>
                            <p className="font-medium">{election.options.length} candidates/options</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="documents" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Document Center</CardTitle>
              <CardDescription>Access reports, statements, and fund documents</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.unreadDocuments.map((document) => (
                  <div key={document.id} className="border rounded-lg p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold mb-1">{document.name}</h3>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span>Category: {document.category.replace('_', ' ')}</span>
                          <span>Published: {formatDate(document.publishedAt)}</span>
                          <Badge className={getStatusColor(document.readStatus)}>
                            {document.readStatus}
                          </Badge>
                        </div>
                      </div>
                      <div className="space-x-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => onViewDetails('document', document.id)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        {document.downloadAllowed && (
                          <Button 
                            size="sm"
                            onClick={() => onViewDetails('document-download', document.id)}
                          >
                            <Download className="h-4 w-4 mr-1" />
                            Download
                          </Button>
                        )}
                      </div>
                    </div>
                    
                    
                    <div className="grid grid-cols-3 gap-4 text-sm bg-gray-50 p-3 rounded">
                      <div>
                        <p className="text-gray-600">Document Type</p>
                        <p className="font-medium">{document.category.replace('_', ' ')}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Access Level</p>
                        <p className="font-medium">{document.accessLevel}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Status</p>
                        <p className="font-medium">{document.status}</p>
                      </div>
                    </div>
                  </div>
                ))}
                
                {data.unreadDocuments.length === 0 && (
                  <div className="text-center py-12">
                    <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-2">No new documents</p>
                    <p className="text-sm text-gray-500">New documents will appear here when published</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Standardized Process Notice */}
      <ProcessNotice
        mode="traditional"
        title="Traditional LP Portal"
        description="You have complete manual control over limited partner operations. All fund communications, document management, capital call responses, and reporting are performed manually without AI assistance. Use the tools above to manage your LP operations according to your investment preferences."
      />
    </div>
  );
}

export default LPPortalTraditional;
