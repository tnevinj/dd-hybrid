'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUnifiedPortfolio } from '../contexts/UnifiedPortfolioContext';

interface CapitalCall {
  id: string;
  callNumber: number;
  callDate: string;
  dueDate: string;
  percentage: number;
  amount: number;
  purpose: string;
  status: 'draft' | 'sent' | 'collected' | 'overdue';
  commitments: CapitalCommitment[];
}

interface CapitalCommitment {
  investorId: string;
  investorName: string;
  commitmentAmount: number;
  calledAmount: number;
  paidAmount: number;
  outstandingAmount: number;
  status: 'pending' | 'paid' | 'overdue';
}

interface Distribution {
  id: string;
  distributionDate: string;
  totalAmount: number;
  type: 'return_of_capital' | 'capital_gains' | 'income';
  source: string;
  status: 'pending' | 'processed' | 'completed';
  allocations: DistributionAllocation[];
}

interface DistributionAllocation {
  investorId: string;
  investorName: string;
  allocationPercentage: number;
  amount: number;
  status: 'pending' | 'processed';
}

export function CapitalManagement() {
  const { state, analytics } = useUnifiedPortfolio();
  const [selectedTab, setSelectedTab] = useState('capital-calls');

  // Mock capital calls data
  const capitalCalls: CapitalCall[] = useMemo(() => [
    {
      id: 'call-1',
      callNumber: 1,
      callDate: '2024-01-15',
      dueDate: '2024-02-15',
      percentage: 20,
      amount: 10000000,
      purpose: 'Initial portfolio construction',
      status: 'collected',
      commitments: [
        {
          investorId: 'inv-1',
          investorName: 'Pension Fund A',
          commitmentAmount: 5000000,
          calledAmount: 1000000,
          paidAmount: 1000000,
          outstandingAmount: 0,
          status: 'paid'
        },
        {
          investorId: 'inv-2',
          investorName: 'Endowment Fund B',
          commitmentAmount: 3000000,
          calledAmount: 600000,
          paidAmount: 600000,
          outstandingAmount: 0,
          status: 'paid'
        }
      ]
    },
    {
      id: 'call-2',
      callNumber: 2,
      callDate: '2024-03-15',
      dueDate: '2024-04-15',
      percentage: 15,
      amount: 7500000,
      purpose: 'Follow-on investments',
      status: 'sent',
      commitments: [
        {
          investorId: 'inv-1',
          investorName: 'Pension Fund A',
          commitmentAmount: 5000000,
          calledAmount: 750000,
          paidAmount: 750000,
          outstandingAmount: 0,
          status: 'paid'
        },
        {
          investorId: 'inv-2',
          investorName: 'Endowment Fund B',
          commitmentAmount: 3000000,
          calledAmount: 450000,
          paidAmount: 200000,
          outstandingAmount: 250000,
          status: 'overdue'
        }
      ]
    }
  ], []);

  // Mock distributions data
  const distributions: Distribution[] = useMemo(() => [
    {
      id: 'dist-1',
      distributionDate: '2024-06-30',
      totalAmount: 2500000,
      type: 'capital_gains',
      source: 'TechCorp Inc Exit',
      status: 'completed',
      allocations: [
        {
          investorId: 'inv-1',
          investorName: 'Pension Fund A',
          allocationPercentage: 62.5,
          amount: 1562500,
          status: 'processed'
        },
        {
          investorId: 'inv-2',
          investorName: 'Endowment Fund B',
          allocationPercentage: 37.5,
          amount: 937500,
          status: 'processed'
        }
      ]
    }
  ], []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'collected':
      case 'completed':
      case 'paid':
      case 'processed':
        return 'bg-green-100 text-green-800';
      case 'sent':
      case 'pending':
        return 'bg-blue-100 text-blue-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Calculate portfolio summary metrics
  const portfolioSummary = useMemo(() => {
    const totalCommitments = capitalCalls.reduce((sum, call) => 
      sum + call.commitments.reduce((cSum, commitment) => cSum + commitment.commitmentAmount, 0), 0);
    const totalCalled = capitalCalls.reduce((sum, call) => sum + call.amount, 0);
    const totalDistributed = distributions.reduce((sum, dist) => sum + dist.totalAmount, 0);
    const outstandingCommitments = capitalCalls.reduce((sum, call) => 
      sum + call.commitments.reduce((cSum, commitment) => cSum + commitment.outstandingAmount, 0), 0);

    return {
      totalCommitments,
      totalCalled,
      totalDistributed,
      outstandingCommitments,
      callPercentage: totalCommitments > 0 ? (totalCalled / totalCommitments) * 100 : 0
    };
  }, [capitalCalls, distributions]);

  if (!state.currentPortfolio) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">No portfolio data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Portfolio Capital Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Commitments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {formatCurrency(portfolioSummary.totalCommitments)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              LP commitment amount
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Called Capital</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {formatCurrency(portfolioSummary.totalCalled)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {formatPercentage(portfolioSummary.callPercentage)} of commitments
            </p>
            <Progress value={portfolioSummary.callPercentage} className="h-1 mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Distributions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(portfolioSummary.totalDistributed)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Total returned to LPs
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Outstanding</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${
              portfolioSummary.outstandingCommitments > 0 ? 'text-red-600' : 'text-gray-900'
            }`}>
              {formatCurrency(portfolioSummary.outstandingCommitments)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Unpaid commitments
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Capital Management Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="capital-calls">Capital Calls</TabsTrigger>
          <TabsTrigger value="distributions">Distributions</TabsTrigger>
          <TabsTrigger value="commitments">Commitments</TabsTrigger>
        </TabsList>

        {/* Capital Calls Tab */}
        <TabsContent value="capital-calls" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Capital Call Management</h3>
            <Button size="sm">Create New Call</Button>
          </div>

          <div className="space-y-4">
            {capitalCalls.map((call) => (
              <Card key={call.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">Capital Call #{call.callNumber}</CardTitle>
                      <p className="text-sm text-gray-600 mt-1">{call.purpose}</p>
                    </div>
                    <Badge className={getStatusColor(call.status)}>
                      {call.status.charAt(0).toUpperCase() + call.status.slice(1)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <span className="text-sm text-gray-600">Call Date:</span>
                      <div className="font-medium">{new Date(call.callDate).toLocaleDateString()}</div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Due Date:</span>
                      <div className="font-medium">{new Date(call.dueDate).toLocaleDateString()}</div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Call Amount:</span>
                      <div className="font-medium">{formatCurrency(call.amount)}</div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Percentage:</span>
                      <div className="font-medium">{call.percentage}%</div>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="font-medium mb-3">Investor Commitments</h4>
                    <div className="space-y-3">
                      {call.commitments.map((commitment) => (
                        <div key={commitment.investorId} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <div>
                            <div className="font-medium">{commitment.investorName}</div>
                            <div className="text-sm text-gray-600">
                              Called: {formatCurrency(commitment.calledAmount)} | 
                              Paid: {formatCurrency(commitment.paidAmount)}
                              {commitment.outstandingAmount > 0 && (
                                <span className="text-red-600 ml-1">
                                  | Outstanding: {formatCurrency(commitment.outstandingAmount)}
                                </span>
                              )}
                            </div>
                          </div>
                          <Badge className={getStatusColor(commitment.status)}>
                            {commitment.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Distributions Tab */}
        <TabsContent value="distributions" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Distribution Management</h3>
            <Button size="sm">Create Distribution</Button>
          </div>

          <div className="space-y-4">
            {distributions.map((distribution) => (
              <Card key={distribution.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">
                        Distribution - {new Date(distribution.distributionDate).toLocaleDateString()}
                      </CardTitle>
                      <p className="text-sm text-gray-600 mt-1">
                        {distribution.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())} from {distribution.source}
                      </p>
                    </div>
                    <Badge className={getStatusColor(distribution.status)}>
                      {distribution.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <span className="text-sm text-gray-600">Total Amount:</span>
                      <div className="font-medium text-lg">{formatCurrency(distribution.totalAmount)}</div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Distribution Date:</span>
                      <div className="font-medium">{new Date(distribution.distributionDate).toLocaleDateString()}</div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Source:</span>
                      <div className="font-medium">{distribution.source}</div>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="font-medium mb-3">LP Allocations</h4>
                    <div className="space-y-3">
                      {distribution.allocations.map((allocation) => (
                        <div key={allocation.investorId} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <div>
                            <div className="font-medium">{allocation.investorName}</div>
                            <div className="text-sm text-gray-600">
                              {formatPercentage(allocation.allocationPercentage)} allocation
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">{formatCurrency(allocation.amount)}</div>
                            <Badge className={getStatusColor(allocation.status)} size="sm">
                              {allocation.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Commitments Overview Tab */}
        <TabsContent value="commitments" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">LP Commitment Overview</h3>
            <Button size="sm">Add Investor</Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Commitment Summary by Investor</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b">
                    <tr>
                      <th className="text-left p-3">Investor</th>
                      <th className="text-right p-3">Commitment</th>
                      <th className="text-right p-3">Called</th>
                      <th className="text-right p-3">Paid</th>
                      <th className="text-right p-3">Outstanding</th>
                      <th className="text-right p-3">Call %</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Aggregate investor data from capital calls */}
                    {Array.from(new Set(capitalCalls.flatMap(call => call.commitments.map(c => c.investorId)))).map(investorId => {
                      const investorCommitments = capitalCalls.flatMap(call => 
                        call.commitments.filter(c => c.investorId === investorId)
                      );
                      
                      const totalCommitment = investorCommitments.reduce((sum, c) => sum + c.commitmentAmount, 0) / investorCommitments.length; // Avoid double counting
                      const totalCalled = investorCommitments.reduce((sum, c) => sum + c.calledAmount, 0);
                      const totalPaid = investorCommitments.reduce((sum, c) => sum + c.paidAmount, 0);
                      const totalOutstanding = investorCommitments.reduce((sum, c) => sum + c.outstandingAmount, 0);
                      const callPercentage = totalCommitment > 0 ? (totalCalled / totalCommitment) * 100 : 0;
                      
                      const investorName = investorCommitments[0]?.investorName || 'Unknown';
                      
                      return (
                        <tr key={investorId} className="border-b">
                          <td className="p-3 font-medium">{investorName}</td>
                          <td className="p-3 text-right">{formatCurrency(totalCommitment)}</td>
                          <td className="p-3 text-right">{formatCurrency(totalCalled)}</td>
                          <td className="p-3 text-right">{formatCurrency(totalPaid)}</td>
                          <td className={`p-3 text-right ${totalOutstanding > 0 ? 'text-red-600 font-medium' : ''}`}>
                            {formatCurrency(totalOutstanding)}
                          </td>
                          <td className="p-3 text-right">
                            <div className="flex items-center justify-end space-x-2">
                              <span>{formatPercentage(callPercentage)}</span>
                              <div className="w-16">
                                <Progress value={callPercentage} className="h-1" />
                              </div>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}