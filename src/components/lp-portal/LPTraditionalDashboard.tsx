'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  Handshake
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

interface LPTraditionalDashboardProps {
  data: LPDashboardData;
  onRespond: (type: string, id: string) => void;
  onViewDetails: (type: string, id: string) => void;
}

export function LPTraditionalDashboard({ 
  data, 
  onRespond, 
  onViewDetails 
}: LPTraditionalDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview');

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
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="commitments">Commitments</TabsTrigger>
          <TabsTrigger value="capital-calls">Capital Calls</TabsTrigger>
          <TabsTrigger value="distributions">Distributions</TabsTrigger>
          <TabsTrigger value="co-investments">Co-Investments</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
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
                    
                    {document.aiSummary && (
                      <div className="bg-blue-50 p-3 rounded mb-4">
                        <p className="text-sm font-medium text-blue-900 mb-1">AI Summary:</p>
                        <p className="text-sm text-blue-800">{document.aiSummary}</p>
                      </div>
                    )}
                    
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
    </div>
  );
}

export default LPTraditionalDashboard;