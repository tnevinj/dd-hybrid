'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  DollarSign,
  TrendingUp,
  TrendingDown,
  Users,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3,
  PieChart,
  FileText,
  CreditCard,
  Banknote,
  Calculator,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  Search,
  Download,
  RefreshCw,
  Plus,
  Edit,
  Eye,
  Send
} from 'lucide-react';
import type { 
  Fund,
  FundCommitment,
  FundCapitalCall,
  FundDistribution,
  FundExpense,
  NAVReport,
  FundStatus,
  TraditionalFundView,
  AssistedFundView,
  AutonomousFundView 
} from '@/types/fund-operations';
import { formatCurrency, formatPercentage, formatDate } from '@/lib/utils';

interface FundOperationsDashboardProps {
  navigationMode?: 'traditional' | 'assisted' | 'autonomous';
  onModeChange?: (mode: 'traditional' | 'assisted' | 'autonomous') => void;
}

export function FundOperationsDashboard({ 
  navigationMode = 'traditional', 
  onModeChange 
}: FundOperationsDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedFund, setSelectedFund] = useState<string>('');
  const [funds, setFunds] = useState<Fund[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadFundOperationsData();
  }, []);

  const loadFundOperationsData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/fund-operations?type=overview');
      const result = await response.json();
      if (result.success && result.data) {
        setFunds(result.data.funds);
        if (result.data.funds.length > 0 && !selectedFund) {
          setSelectedFund(result.data.funds[0].id);
        }
      }
    } catch (error) {
      console.error('Failed to load fund operations data:', error);
    } finally {
      setLoading(false);
    }
  };

  const currentFund = funds.find(f => f.id === selectedFund);

  const calculateAggregateMetrics = () => {
    if (funds.length === 0) return null;

    const totalCommitments = funds.reduce((sum, fund) => sum + fund.totalCommitments, 0);
    const totalCalled = funds.reduce((sum, fund) => sum + fund.totalCalled, 0);
    const totalInvested = funds.reduce((sum, fund) => sum + fund.totalInvested, 0);
    const totalNAV = funds.reduce((sum, fund) => sum + fund.currentNAV, 0);
    const totalDistributed = funds.reduce((sum, fund) => sum + fund.totalDistributed, 0);
    
    const avgNetIRR = funds.reduce((sum, fund) => sum + (fund.netIRR || 0), 0) / funds.length;
    const avgNetMOIC = funds.reduce((sum, fund) => sum + (fund.netMOIC || 0), 0) / funds.length;
    const avgDPI = funds.reduce((sum, fund) => sum + (fund.dpi || 0), 0) / funds.length;

    return {
      totalCommitments,
      totalCalled,
      totalInvested,
      totalNAV,
      totalDistributed,
      avgNetIRR,
      avgNetMOIC,
      avgDPI,
      activeFunds: funds.filter(f => f.status === FundStatus.INVESTING || f.status === FundStatus.HARVESTING).length,
      totalFunds: funds.length
    };
  };

  const aggregateMetrics = calculateAggregateMetrics();

  const renderModeSpecificContent = () => {
    switch (navigationMode) {
      case 'assisted':
        return <AssistedFundOperationsContent funds={funds} currentFund={currentFund} />;
      case 'autonomous':
        return <AutonomousFundOperationsContent funds={funds} currentFund={currentFund} />;
      default:
        return <TraditionalFundOperationsContent funds={funds} currentFund={currentFund} />;
    }
  };

  const renderAggregateKPIs = () => {
    if (!aggregateMetrics) return null;

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Commitments</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(aggregateMetrics.totalCommitments)}
                </p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <span className="text-sm text-gray-600">
                Across {aggregateMetrics.totalFunds} funds
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Capital Called</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(aggregateMetrics.totalCalled)}
                </p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CreditCard className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <span className="text-sm text-gray-600">
                {formatPercentage(aggregateMetrics.totalCalled / aggregateMetrics.totalCommitments * 100)} called
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Current NAV</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(aggregateMetrics.totalNAV)}
                </p>
              </div>
              <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Calculator className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              {aggregateMetrics.avgNetIRR > 0 ? (
                <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
              ) : (
                <ArrowDownRight className="h-4 w-4 text-red-500 mr-1" />
              )}
              <span className={`text-sm ${aggregateMetrics.avgNetIRR > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatPercentage(aggregateMetrics.avgNetIRR)} Avg Net IRR
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Distributed</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(aggregateMetrics.totalDistributed)}
                </p>
              </div>
              <div className="h-12 w-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                <Banknote className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <span className="text-sm text-gray-600">
                {aggregateMetrics.avgDPI.toFixed(2)}x Avg DPI
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Funds</p>
                <p className="text-2xl font-bold text-gray-900">
                  {aggregateMetrics.activeFunds}
                </p>
              </div>
              <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-orange-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <span className="text-sm text-gray-600">
                {aggregateMetrics.avgNetMOIC.toFixed(2)}x Avg MOIC
              </span>
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
          <h1 className="text-3xl font-bold text-gray-900">Fund Operations</h1>
          <p className="text-gray-600">
            Capital calls, distributions, NAV reporting, and expense management
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
            <Plus className="h-4 w-4 mr-2" />
            New Capital Call
          </Button>
          
          <Button onClick={loadFundOperationsData} size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Aggregate KPI Cards */}
      {renderAggregateKPIs()}

      {/* Fund Selector */}
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <div className="flex items-center space-x-3">
          <label className="text-sm font-medium text-gray-700">Selected Fund:</label>
          <select
            value={selectedFund}
            onChange={(e) => setSelectedFund(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {funds.map(fund => (
              <option key={fund.id} value={fund.id}>
                {fund.name} ({fund.fundNumber})
              </option>
            ))}
          </select>
        </div>

        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search operations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <Button variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Export Fund Report
        </Button>
      </div>

      {/* Fund Overview Cards */}
      {currentFund && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Fund Status</p>
                  <Badge variant={currentFund.status === FundStatus.INVESTING ? 'default' : 'secondary'}>
                    {currentFund.status}
                  </Badge>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Vintage {currentFund.vintage}</p>
                  <p className="text-sm text-gray-600">{currentFund.fundType}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Target Size</p>
                  <p className="text-xl font-bold text-gray-900">
                    {formatCurrency(currentFund.targetSize)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Committed</p>
                  <p className="text-sm font-medium">
                    {formatPercentage(currentFund.totalCommitments / currentFund.targetSize * 100)}
                  </p>
                </div>
              </div>
              <Progress 
                value={currentFund.totalCommitments / currentFund.targetSize * 100} 
                className="mt-3 h-2" 
              />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Net IRR</p>
                  <p className="text-xl font-bold text-gray-900">
                    {formatPercentage(currentFund.netIRR || 0)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Net MOIC</p>
                  <p className="text-sm font-medium">
                    {(currentFund.netMOIC || 0).toFixed(2)}x
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">DPI</p>
                  <p className="text-xl font-bold text-gray-900">
                    {(currentFund.dpi || 0).toFixed(2)}x
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">TVPI</p>
                  <p className="text-sm font-medium">
                    {(currentFund.tvpi || 0).toFixed(2)}x
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="capital-calls">Capital Calls</TabsTrigger>
          <TabsTrigger value="distributions">Distributions</TabsTrigger>
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
          <TabsTrigger value="nav">NAV Reports</TabsTrigger>
          <TabsTrigger value="commitments">Commitments</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {renderModeSpecificContent()}
        </TabsContent>

        <TabsContent value="capital-calls" className="space-y-6">
          <CapitalCallsView fundId={selectedFund} />
        </TabsContent>

        <TabsContent value="distributions" className="space-y-6">
          <DistributionsView fundId={selectedFund} />
        </TabsContent>

        <TabsContent value="expenses" className="space-y-6">
          <ExpensesView fundId={selectedFund} />
        </TabsContent>

        <TabsContent value="nav" className="space-y-6">
          <NAVReportsView fundId={selectedFund} />
        </TabsContent>

        <TabsContent value="commitments" className="space-y-6">
          <CommitmentsView fundId={selectedFund} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Traditional Fund Operations Content
function TraditionalFundOperationsContent({ funds, currentFund }: { funds: Fund[], currentFund?: Fund }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Recent Activities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { type: 'Capital Call', description: 'Fund IV - Call #8 issued', amount: '$25M', date: '2024-03-20', status: 'Issued' },
                { type: 'Distribution', description: 'Fund III - Exit proceeds distributed', amount: '$45M', date: '2024-03-18', status: 'Paid' },
                { type: 'NAV Report', description: 'Fund IV Q1 2024 NAV finalized', amount: '$275M', date: '2024-03-15', status: 'Published' },
                { type: 'Expense', description: 'Legal fees - Deal closing', amount: '$125K', date: '2024-03-12', status: 'Approved' }
              ].map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium">{activity.type}</h4>
                    <p className="text-sm text-gray-600">{activity.description}</p>
                    <p className="text-sm text-gray-500">{formatDate(activity.date)}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{activity.amount}</p>
                    <Badge variant={activity.status === 'Paid' ? 'default' : 'secondary'}>
                      {activity.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="h-5 w-5 mr-2" />
              Fund Performance Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Capital Deployment</span>
                  <span className="text-sm text-gray-600">
                    {currentFund ? formatPercentage(currentFund.totalInvested / currentFund.totalCalled * 100) : '0%'}
                  </span>
                </div>
                <Progress value={currentFund ? (currentFund.totalInvested / currentFund.totalCalled * 100) : 0} className="h-2" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Called Capital</p>
                  <p className="text-lg font-semibold">{formatCurrency(currentFund?.totalCalled || 0)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Remaining Commitment</p>
                  <p className="text-lg font-semibold">
                    {formatCurrency((currentFund?.totalCommitments || 0) - (currentFund?.totalCalled || 0))}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Assisted Fund Operations Content
function AssistedFundOperationsContent({ funds, currentFund }: { funds: Fund[], currentFund?: Fund }) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2" />
            AI Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 border rounded-lg border-amber-200 bg-amber-50">
              <h3 className="font-semibold text-amber-800 flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                Capital Call Timing Optimization
              </h3>
              <p className="text-sm text-amber-700 mt-1">
                Based on cash flow analysis, optimal time for next capital call is in 2-3 weeks to maximize deployment efficiency.
              </p>
              <div className="flex gap-2 mt-3">
                <Button size="sm" className="bg-amber-600 hover:bg-amber-700">Schedule Call</Button>
                <Button size="sm" variant="outline">View Analysis</Button>
              </div>
            </div>
            
            <div className="p-4 border rounded-lg border-blue-200 bg-blue-50">
              <h3 className="font-semibold text-blue-800">Expense Optimization</h3>
              <p className="text-sm text-blue-700 mt-1">
                AI identified $150K potential savings through vendor consolidation and process automation.
              </p>
              <Button size="sm" className="mt-3 bg-blue-600 hover:bg-blue-700">View Recommendations</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <TraditionalFundOperationsContent funds={funds} currentFund={currentFund} />
    </div>
  );
}

// Autonomous Fund Operations Content
function AutonomousFundOperationsContent({ funds, currentFund }: { funds: Fund[], currentFund?: Fund }) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CheckCircle className="h-5 w-5 mr-2" />
            Priority Decision Queue
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 border rounded-lg border-red-200 bg-red-50">
              <h3 className="font-semibold text-red-800 flex items-center">
                <AlertTriangle className="h-4 w-4 mr-2" />
                Urgent: Commitment Default Risk
              </h3>
              <p className="text-sm text-red-700 mt-1">
                Strategic Capital Partners ($15M commitment) shows 85% default probability. Immediate action required.
              </p>
              <div className="flex gap-2 mt-3">
                <Button size="sm" className="bg-red-600 hover:bg-red-700">Contact LP</Button>
                <Button size="sm" variant="outline">Review Options</Button>
              </div>
            </div>
            
            <div className="p-4 border rounded-lg border-green-200 bg-green-50">
              <h3 className="font-semibold text-green-800">Ready: Automated Distribution</h3>
              <p className="text-sm text-green-700 mt-1">
                TechCorp exit proceeds ($45M) processed and ready for automated distribution to LPs.
              </p>
              <Button size="sm" className="mt-3 bg-green-600 hover:bg-green-700">Approve & Send</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <AssistedFundOperationsContent funds={funds} currentFund={currentFund} />
    </div>
  );
}

// Capital Calls View
function CapitalCallsView({ fundId }: { fundId: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <CreditCard className="h-5 w-5 mr-2" />
            Capital Calls
          </div>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            New Capital Call
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {[
            { callNumber: 8, amount: 25000000, dueDate: '2024-04-15', status: 'Issued', purpose: 'Investment', funded: 22000000 },
            { callNumber: 7, amount: 30000000, dueDate: '2024-01-15', status: 'Funded', purpose: 'Investment', funded: 30000000 },
            { callNumber: 6, amount: 20000000, dueDate: '2023-10-15', status: 'Funded', purpose: 'Management Fee', funded: 20000000 }
          ].map((call, index) => (
            <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
              <div className="flex-1">
                <div className="flex items-center space-x-4">
                  <h4 className="font-semibold">Call #{call.callNumber}</h4>
                  <Badge variant={call.status === 'Funded' ? 'default' : 'secondary'}>
                    {call.status}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600">{call.purpose} • Due: {formatDate(call.dueDate)}</p>
              </div>
              <div className="text-right space-y-1">
                <p className="font-semibold">{formatCurrency(call.amount)}</p>
                <p className="text-sm text-gray-600">
                  Funded: {formatCurrency(call.funded)} ({formatPercentage(call.funded / call.amount * 100)})
                </p>
              </div>
              <div className="flex items-center space-x-2 ml-4">
                <Button size="sm" variant="outline">
                  <Eye className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="outline">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Distributions View
function DistributionsView({ fundId }: { fundId: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <Banknote className="h-5 w-5 mr-2" />
            Distributions
          </div>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            New Distribution
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {[
            { distNumber: 15, amount: 45000000, date: '2024-03-18', source: 'TechCorp Exit', type: 'Capital Gains', status: 'Paid' },
            { distNumber: 14, amount: 12000000, date: '2024-01-20', source: 'Dividend Distribution', type: 'Income', status: 'Paid' },
            { distNumber: 13, amount: 35000000, date: '2023-11-15', source: 'HealthTech Sale', type: 'Capital Gains', status: 'Paid' }
          ].map((dist, index) => (
            <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
              <div className="flex-1">
                <div className="flex items-center space-x-4">
                  <h4 className="font-semibold">Distribution #{dist.distNumber}</h4>
                  <Badge variant="default">{dist.status}</Badge>
                </div>
                <p className="text-sm text-gray-600">{dist.source} • {dist.type}</p>
              </div>
              <div className="text-right space-y-1">
                <p className="font-semibold">{formatCurrency(dist.amount)}</p>
                <p className="text-sm text-gray-600">{formatDate(dist.date)}</p>
              </div>
              <div className="flex items-center space-x-2 ml-4">
                <Button size="sm" variant="outline">
                  <Eye className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="outline">
                  <FileText className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Expenses View
function ExpensesView({ fundId }: { fundId: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <DollarSign className="h-5 w-5 mr-2" />
            Fund Expenses
          </div>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Record Expense
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {[
            { description: 'Legal fees - TechCorp acquisition', category: 'Legal', amount: 125000, date: '2024-03-15', status: 'Approved', vendor: 'BigLaw LLP' },
            { description: 'Audit fees - Q4 2023', category: 'Audit', amount: 85000, date: '2024-02-28', status: 'Paid', vendor: 'Major Audit Firm' },
            { description: 'Due diligence - GreenTech', category: 'Consultant', amount: 75000, date: '2024-02-15', status: 'Pending', vendor: 'Strategy Consulting' }
          ].map((expense, index) => (
            <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
              <div className="flex-1">
                <h4 className="font-semibold">{expense.description}</h4>
                <p className="text-sm text-gray-600">{expense.vendor} • {expense.category}</p>
              </div>
              <div className="text-right space-y-1">
                <p className="font-semibold">{formatCurrency(expense.amount)}</p>
                <div className="flex items-center space-x-2">
                  <Badge variant={expense.status === 'Paid' ? 'default' : expense.status === 'Approved' ? 'secondary' : 'outline'}>
                    {expense.status}
                  </Badge>
                </div>
              </div>
              <div className="flex items-center space-x-2 ml-4">
                <Button size="sm" variant="outline">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="outline">
                  <Eye className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// NAV Reports View
function NAVReportsView({ fundId }: { fundId: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <Calculator className="h-5 w-5 mr-2" />
            NAV Reports
          </div>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Generate NAV
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {[
            { period: 'Q1 2024', nav: 275000000, reportDate: '2024-03-31', status: 'Published', returns: 8.5 },
            { period: 'Q4 2023', nav: 253000000, reportDate: '2023-12-31', status: 'Published', returns: 12.3 },
            { period: 'Q3 2023', nav: 225000000, reportDate: '2023-09-30', status: 'Published', returns: 5.2 }
          ].map((report, index) => (
            <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
              <div className="flex-1">
                <h4 className="font-semibold">{report.period} NAV Report</h4>
                <p className="text-sm text-gray-600">Report Date: {formatDate(report.reportDate)}</p>
              </div>
              <div className="text-right space-y-1">
                <p className="font-semibold">{formatCurrency(report.nav)}</p>
                <p className="text-sm text-green-600">+{formatPercentage(report.returns)} QTD</p>
              </div>
              <div className="flex items-center space-x-2 ml-4">
                <Badge variant="default">{report.status}</Badge>
                <Button size="sm" variant="outline">
                  <Eye className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Commitments View
function CommitmentsView({ fundId }: { fundId: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <Users className="h-5 w-5 mr-2" />
            LP Commitments
          </div>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Commitment
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {[
            { investor: 'Strategic Capital Partners', commitment: 50000000, called: 32500000, remaining: 17500000, status: 'Active' },
            { investor: 'Global Endowment Foundation', commitment: 40000000, called: 26000000, remaining: 14000000, status: 'Active' },
            { investor: 'Pension Fund Alliance', commitment: 75000000, called: 48750000, remaining: 26250000, status: 'Active' }
          ].map((commitment, index) => (
            <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
              <div className="flex-1">
                <h4 className="font-semibold">{commitment.investor}</h4>
                <div className="flex items-center space-x-4 mt-1">
                  <Badge variant="default">{commitment.status}</Badge>
                  <span className="text-sm text-gray-600">
                    Called: {formatPercentage(commitment.called / commitment.commitment * 100)}
                  </span>
                </div>
              </div>
              <div className="text-right space-y-1">
                <p className="font-semibold">{formatCurrency(commitment.commitment)}</p>
                <p className="text-sm text-gray-600">Remaining: {formatCurrency(commitment.remaining)}</p>
              </div>
              <div className="flex items-center space-x-2 ml-4">
                <Button size="sm" variant="outline">
                  <Eye className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="outline">
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}