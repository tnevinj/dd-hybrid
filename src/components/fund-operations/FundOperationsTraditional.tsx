'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ModuleHeader, ProcessNotice, MODE_DESCRIPTIONS } from '@/components/shared/ModeIndicators';
import {
  DollarSign,
  TrendingUp,
  Users,
  Calendar,
  BarChart3,
  CreditCard,
  Banknote,
  Calculator,
  FileText,
  Eye,
  Edit,
  Send,
  Plus,
  Download
} from 'lucide-react';
import { formatCurrency, formatPercentage, formatDate } from '@/lib/utils';

interface FundOperationsTraditionalProps {
  fundOperationsData: any;
  funds: any[];
  metrics: any;
  isLoading: boolean;
  onCreateCapitalCall: () => void;
  onViewFund: (id: string) => void;
  onProcessDistribution: () => void;
}

export function FundOperationsTraditional({
  fundOperationsData,
  funds,
  metrics,
  isLoading,
  onCreateCapitalCall,
  onViewFund,
  onProcessDistribution
}: FundOperationsTraditionalProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedFund, setSelectedFund] = useState(funds[0]?.id || '');

  const currentFund = funds.find(f => f.id === selectedFund);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mb-4"></div>
          <p className="text-gray-600">Loading fund operations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Standardized Header */}
      <ModuleHeader
        title="Fund Operations"
        description="Complete manual control over fund operations and capital management"
        mode="traditional"
        actions={
          <div className="flex space-x-2">
            <Button onClick={onCreateCapitalCall} className="flex items-center space-x-2 bg-gray-700 hover:bg-gray-800">
              <Plus className="h-4 w-4" />
              <span>New Capital Call</span>
            </Button>
            <Button onClick={onProcessDistribution} variant="outline" className="flex items-center space-x-2 border-gray-300 text-gray-700">
              <Send className="h-4 w-4" />
              <span>Process Distribution</span>
            </Button>
          </div>
        }
      />

      {/* Overview KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Commitments</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(metrics.totalCommitments)}
                </p>
              </div>
              <div className="h-12 w-12 bg-gray-100 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-gray-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <span className="text-sm text-gray-500">
                Across {metrics.totalFunds} funds
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Capital Called</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(metrics.totalCalled)}
                </p>
              </div>
              <div className="h-12 w-12 bg-gray-100 rounded-lg flex items-center justify-center">
                <CreditCard className="h-6 w-6 text-gray-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <span className="text-sm text-gray-500">
                {formatPercentage(metrics.totalCalled && metrics.totalCommitments ? (metrics.totalCalled / metrics.totalCommitments) * 100 : 0)} called
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Current NAV</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(metrics.currentNAV)}
                </p>
              </div>
              <div className="h-12 w-12 bg-gray-100 rounded-lg flex items-center justify-center">
                <Calculator className="h-6 w-6 text-gray-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <TrendingUp className="h-4 w-4 text-gray-500 mr-1" />
              <span className="text-sm text-gray-500">
                {formatPercentage(metrics.avgNetIRR)} Avg Net IRR
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Distributed</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(metrics.totalDistributed)}
                </p>
              </div>
              <div className="h-12 w-12 bg-gray-100 rounded-lg flex items-center justify-center">
                <Banknote className="h-6 w-6 text-gray-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <span className="text-sm text-gray-500">
                Active funds: {metrics.activeFunds}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Fund Selector */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium text-gray-700">Selected Fund:</label>
          <select
            value={selectedFund}
            onChange={(e) => setSelectedFund(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {funds.map(fund => (
              <option key={fund.id} value={fund.id}>
                {fund.name} (Vintage {fund.vintage})
              </option>
            ))}
          </select>
        </div>
        
      </div>

      {/* Fund Details */}
      {currentFund && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Fund Overview</h3>
                <Badge variant="default">{currentFund.status}</Badge>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Target Size</span>
                  <span className="text-sm font-medium">{formatCurrency(currentFund.targetSize)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Commitments</span>
                  <span className="text-sm font-medium">{formatCurrency(currentFund.commitments)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Called</span>
                  <span className="text-sm font-medium">{formatCurrency(currentFund.called)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Deployed</span>
                  <span className="text-sm font-medium">{formatCurrency(currentFund.deployed)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Performance</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Current NAV</span>
                  <span className="text-sm font-medium">{formatCurrency(currentFund.nav)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Net IRR</span>
                  <span className="text-sm font-medium text-green-600">15.8%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Net MOIC</span>
                  <span className="text-sm font-medium">1.42x</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">DPI</span>
                  <span className="text-sm font-medium">0.28x</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Capital Deployment</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Deployment Rate</span>
                    <span className="text-sm text-gray-600">
                      {formatPercentage(currentFund?.deployed && currentFund?.called ? (currentFund.deployed / currentFund.called) * 100 : 0)}
                    </span>
                  </div>
                  <Progress value={currentFund?.deployed && currentFund?.called ? (currentFund.deployed / currentFund.called) * 100 : 0} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Call Rate</span>
                    <span className="text-sm text-gray-600">
                      {formatPercentage(currentFund?.called && currentFund?.commitments ? (currentFund.called / currentFund.commitments) * 100 : 0)}
                    </span>
                  </div>
                  <Progress value={currentFund?.called && currentFund?.commitments ? (currentFund.called / currentFund.commitments) * 100 : 0} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Detailed Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="capital-calls">Capital Calls</TabsTrigger>
          <TabsTrigger value="distributions">Distributions</TabsTrigger>
          <TabsTrigger value="nav-reports">NAV Reports</TabsTrigger>
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
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
                    { type: 'Capital Call', description: 'Growth Fund IV - Call #5 issued', amount: '$35M', date: '2024-03-20', status: 'Issued' },
                    { type: 'Distribution', description: 'Tech Fund III - Exit proceeds', amount: '$52M', date: '2024-03-18', status: 'Paid' },
                    { type: 'NAV Report', description: 'Q1 2024 NAV finalized', amount: '$415M', date: '2024-03-15', status: 'Published' },
                    { type: 'Expense', description: 'Legal fees - Portfolio support', amount: '$85K', date: '2024-03-12', status: 'Approved' }
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{activity.type}</h4>
                        <p className="text-sm text-gray-600">{activity.description}</p>
                        <p className="text-xs text-gray-500">{activity.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-sm">{activity.amount}</p>
                        <Badge variant={activity.status === 'Paid' ? 'default' : 'secondary'} className="text-xs">
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
                  Fund Performance Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {funds.map((fund, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                      <div>
                        <h4 className="font-medium text-sm">{fund.name}</h4>
                        <p className="text-xs text-gray-600">Vintage {fund.vintage} • {fund.status}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{formatCurrency(fund.nav)}</p>
                        <p className="text-xs text-gray-600">NAV</p>
                      </div>
                      <Button size="sm" variant="outline" onClick={() => onViewFund(fund.id)}>
                        <Eye className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="capital-calls" className="space-y-6">
          <CapitalCallsTable fundId={selectedFund} />
        </TabsContent>

        <TabsContent value="distributions" className="space-y-6">
          <DistributionsTable fundId={selectedFund} />
        </TabsContent>

        <TabsContent value="nav-reports" className="space-y-6">
          <NAVReportsTable fundId={selectedFund} />
        </TabsContent>

        <TabsContent value="expenses" className="space-y-6">
          <ExpensesTable fundId={selectedFund} />
        </TabsContent>
      </Tabs>

      {/* Standardized Process Notice */}
      <ProcessNotice
        mode="traditional"
        title="Traditional Fund Operations"
        description="You have complete manual control over fund operations. All capital calls, distributions, NAV reporting, and expense management are performed manually without AI assistance. Use the tools above to manage your fund operations according to your investment strategy."
      />
    </div>
  );
}

// Sub-components for each tab
function CapitalCallsTable({ fundId }: { fundId: string }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <CreditCard className="h-5 w-5 mr-2" />
            Capital Calls
          </CardTitle>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Capital Call
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {[
            { callNumber: 5, amount: 35000000, dueDate: '2024-04-15', status: 'Issued', purpose: 'New Investments', funded: 30000000 },
            { callNumber: 4, amount: 40000000, dueDate: '2024-01-15', status: 'Funded', purpose: 'Follow-on Investments', funded: 40000000 },
            { callNumber: 3, amount: 25000000, dueDate: '2023-10-15', status: 'Funded', purpose: 'Management Fee', funded: 25000000 }
          ].map((call, index) => (
            <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
              <div className="flex-1">
                <div className="flex items-center space-x-4">
                  <h4 className="font-semibold">Call #{call.callNumber}</h4>
                  <Badge variant={call.status === 'Funded' ? 'default' : 'secondary'}>
                    {call.status}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 mt-1">{call.purpose} • Due: {call.dueDate}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold">{formatCurrency(call.amount)}</p>
                <p className="text-sm text-gray-600">
                  Funded: {formatCurrency(call.funded)} ({formatPercentage(call.funded && call.amount ? (call.funded / call.amount) * 100 : 0)})
                </p>
              </div>
              <div className="flex space-x-2 ml-4">
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

function DistributionsTable({ fundId }: { fundId: string }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <Banknote className="h-5 w-5 mr-2" />
            Distributions
          </CardTitle>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Process Distribution
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {[
            { distNumber: 12, amount: 52000000, date: '2024-03-18', source: 'TechCorp Exit', type: 'Capital Gains', status: 'Paid' },
            { distNumber: 11, amount: 18000000, date: '2024-01-20', source: 'Dividend Income', type: 'Income', status: 'Paid' },
            { distNumber: 10, amount: 38000000, date: '2023-11-15', source: 'HealthTech Sale', type: 'Capital Gains', status: 'Paid' }
          ].map((dist, index) => (
            <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
              <div className="flex-1">
                <div className="flex items-center space-x-4">
                  <h4 className="font-semibold">Distribution #{dist.distNumber}</h4>
                  <Badge variant="default">{dist.status}</Badge>
                </div>
                <p className="text-sm text-gray-600 mt-1">{dist.source} • {dist.type}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold">{formatCurrency(dist.amount)}</p>
                <p className="text-sm text-gray-600">{dist.date}</p>
              </div>
              <div className="flex space-x-2 ml-4">
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

function NAVReportsTable({ fundId }: { fundId: string }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <Calculator className="h-5 w-5 mr-2" />
            NAV Reports
          </CardTitle>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Generate NAV Report
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {[
            { period: 'Q1 2024', nav: 315000000, reportDate: '2024-03-31', status: 'Published', returns: 8.2 },
            { period: 'Q4 2023', nav: 291000000, reportDate: '2023-12-31', status: 'Published', returns: 11.8 },
            { period: 'Q3 2023', nav: 260000000, reportDate: '2023-09-30', status: 'Published', returns: 4.5 }
          ].map((report, index) => (
            <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
              <div className="flex-1">
                <h4 className="font-semibold">{report.period} NAV Report</h4>
                <p className="text-sm text-gray-600 mt-1">Report Date: {report.reportDate}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold">{formatCurrency(report.nav)}</p>
                <p className="text-sm text-green-600">+{formatPercentage(report.returns)} QTD</p>
              </div>
              <div className="flex items-center space-x-2 ml-4">
                <Badge variant="default">{report.status}</Badge>
                <Button size="sm" variant="outline">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function ExpensesTable({ fundId }: { fundId: string }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <DollarSign className="h-5 w-5 mr-2" />
            Fund Expenses
          </CardTitle>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Record Expense
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {[
            { description: 'Legal fees - TechCorp acquisition', category: 'Legal', amount: 185000, date: '2024-03-15', status: 'Approved', vendor: 'Corporate Law Partners' },
            { description: 'Audit fees - Q4 2023', category: 'Audit', amount: 125000, date: '2024-02-28', status: 'Paid', vendor: 'Big Four Auditors' },
            { description: 'Due diligence - GreenTech', category: 'Consulting', amount: 95000, date: '2024-02-15', status: 'Pending', vendor: 'Strategy Associates' }
          ].map((expense, index) => (
            <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
              <div className="flex-1">
                <h4 className="font-semibold text-sm">{expense.description}</h4>
                <p className="text-sm text-gray-600 mt-1">{expense.vendor} • {expense.category}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold">{formatCurrency(expense.amount)}</p>
                <Badge variant={expense.status === 'Paid' ? 'default' : expense.status === 'Approved' ? 'secondary' : 'outline'} className="text-xs mt-1">
                  {expense.status}
                </Badge>
              </div>
              <div className="flex space-x-2 ml-4">
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

export default FundOperationsTraditional;
