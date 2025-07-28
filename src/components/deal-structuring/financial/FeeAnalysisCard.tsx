'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Calculator,
  TrendingUp,
  DollarSign,
  Users,
  AlertTriangle,
  CheckCircle,
  Download,
  Zap,
  BarChart3,
  PieChart,
  Target
} from 'lucide-react';
import { FeeAnalysisInputs, FeeAnalysisResults } from '@/types/deal-structuring';

interface FeeAnalysisCardProps {
  dealId: string;
  mode?: 'traditional' | 'assisted' | 'autonomous';
  onResultsChange?: (results: FeeAnalysisResults) => void;
}

interface FeeStructure {
  managementFee: {
    rate: number;
    basis: 'committed_capital' | 'invested_capital' | 'nav';
    declineSchedule?: { year: number; rate: number }[];
  };
  carriedInterest: {
    rate: number;
    hurdleRate?: number;
    catchUpRate?: number;
    distributionWaterfall: 'american' | 'european' | 'deal_by_deal';
  };
  transactionFees: {
    rate: number;
    sharingRatio: number; // percentage shared with LPs
  };
  monitoringFees: {
    averageAnnualFee: number;
    sharingRatio: number;
  };
}

const FeeAnalysisCard: React.FC<FeeAnalysisCardProps> = ({ 
  dealId, 
  mode = 'traditional',
  onResultsChange 
}) => {
  const [inputs, setInputs] = useState<FeeAnalysisInputs>({
    fundInfo: {
      name: 'Secondary Fund IV',
      fundSize: 1000000000, // $1B
      targetReturn: 0.20, // 20%
      investmentPeriod: 5,
      fundTerm: 10,
      strategy: 'secondary',
      vintage: 2024
    },
    feeStructure: {
      managementFee: {
        rate: 0.02, // 2%
        basis: 'committed_capital',
        declineSchedule: [
          { year: 6, rate: 0.015 },
          { year: 8, rate: 0.01 }
        ]
      },
      carriedInterest: {
        rate: 0.20, // 20%
        hurdleRate: 0.08, // 8%
        catchUpRate: 1.0, // 100%
        distributionWaterfall: 'american'
      },
      transactionFees: {
        rate: 0.01, // 1%
        sharingRatio: 0.80 // 80% to LPs
      },
      monitoringFees: {
        averageAnnualFee: 200000, // $200K per portfolio company
        sharingRatio: 0.50 // 50% to LPs
      }
    },
    portfolioAssumptions: {
      averageDealSize: 50000000, // $50M
      numberOfDeals: 20,
      averageHoldingPeriod: 4,
      exitMultiple: 2.5,
      annualRealizationRate: 0.25
    },
    benchmarkData: {
      peerManagementFee: 0.02,
      peerCarriedInterest: 0.20,
      industryHurdleRate: 0.08
    }
  });

  const [results, setResults] = useState<FeeAnalysisResults | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [activeTab, setActiveTab] = useState<'structure' | 'projections' | 'benchmark' | 'optimization'>('structure');

  const calculateFeeAnalysis = async () => {
    setIsCalculating(true);
    
    // Mock calculation - replace with actual fee analysis logic
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const fundSize = inputs.fundInfo.fundSize;
    const managementFeeRate = inputs.feeStructure.managementFee.rate;
    const carriedInterestRate = inputs.feeStructure.carriedInterest.rate;
    
    // Calculate management fees over fund life
    const managementFeesPerYear = Array.from({ length: inputs.fundInfo.fundTerm }, (_, i) => {
      const year = i + 1;
      let rate = managementFeeRate;
      
      // Apply decline schedule
      if (inputs.feeStructure.managementFee.declineSchedule) {
        const applicableDecline = inputs.feeStructure.managementFee.declineSchedule
          .reverse()
          .find(decline => year >= decline.year);
        if (applicableDecline) rate = applicableDecline.rate;
      }
      
      return {
        year,
        rate,
        fee: fundSize * rate,
        basis: inputs.feeStructure.managementFee.basis
      };
    });

    // Calculate projected carried interest
    const totalReturns = fundSize * inputs.portfolioAssumptions.exitMultiple;
    const lpReturns = totalReturns - fundSize;
    const hurdleAmount = fundSize * (1 + inputs.feeStructure.carriedInterest.hurdleRate!) ** inputs.portfolioAssumptions.averageHoldingPeriod;
    const excessReturns = Math.max(0, totalReturns - hurdleAmount);
    const projectedCarriedInterest = excessReturns * carriedInterestRate;

    const mockResults: FeeAnalysisResults = {
      totalManagementFees: managementFeesPerYear.reduce((sum, year) => sum + year.fee, 0),
      projectedCarriedInterest,
      totalGpRevenue: managementFeesPerYear.reduce((sum, year) => sum + year.fee, 0) + projectedCarriedInterest,
      managementFeeProjections: managementFeesPerYear,
      carriedInterestAnalysis: {
        hurdleAmount,
        excessReturns,
        carriedInterest: projectedCarriedInterest,
        carriedInterestRate: carriedInterestRate,
        catchUpProvision: excessReturns * inputs.feeStructure.carriedInterest.catchUpRate! * 0.8 // Mock catch-up
      },
      transactionFeeProjections: {
        totalTransactionFees: inputs.portfolioAssumptions.numberOfDeals * inputs.portfolioAssumptions.averageDealSize * inputs.feeStructure.transactionFees.rate,
        lpShare: inputs.portfolioAssumptions.numberOfDeals * inputs.portfolioAssumptions.averageDealSize * inputs.feeStructure.transactionFees.rate * inputs.feeStructure.transactionFees.sharingRatio,
        gpShare: inputs.portfolioAssumptions.numberOfDeals * inputs.portfolioAssumptions.averageDealSize * inputs.feeStructure.transactionFees.rate * (1 - inputs.feeStructure.transactionFees.sharingRatio)
      },
      monitoringFeeProjections: {
        totalMonitoringFees: inputs.portfolioAssumptions.numberOfDeals * inputs.feeStructure.monitoringFees.averageAnnualFee * inputs.portfolioAssumptions.averageHoldingPeriod,
        lpShare: inputs.portfolioAssumptions.numberOfDeals * inputs.feeStructure.monitoringFees.averageAnnualFee * inputs.portfolioAssumptions.averageHoldingPeriod * inputs.feeStructure.monitoringFees.sharingRatio,
        gpShare: inputs.portfolioAssumptions.numberOfDeals * inputs.feeStructure.monitoringFees.averageAnnualFee * inputs.portfolioAssumptions.averageHoldingPeriod * (1 - inputs.feeStructure.monitoringFees.sharingRatio)
      },
      benchmarkComparison: {
        managementFeeVsPeer: ((managementFeeRate - inputs.benchmarkData.peerManagementFee) / inputs.benchmarkData.peerManagementFee) * 100,
        carriedInterestVsPeer: ((carriedInterestRate - inputs.benchmarkData.peerCarriedInterest) / inputs.benchmarkData.peerCarriedInterest) * 100,
        competitiveRanking: 'market' as 'aggressive' | 'market' | 'conservative'
      },
      lpEconomics: {
        totalLpReturns: lpReturns,
        netIrr: 0.18, // Mock 18% net IRR
        netMultiple: 2.1, // Mock 2.1x net multiple
        feeOffset: 0.15 // 15 bps fee offset from performance
      },
      sensitivityAnalysis: {
        scenarios: [
          { label: 'Base Case', netIrr: 0.18, carriedInterest: projectedCarriedInterest },
          { label: 'Upside (+25%)', netIrr: 0.225, carriedInterest: projectedCarriedInterest * 1.4 },
          { label: 'Downside (-25%)', netIrr: 0.135, carriedInterest: projectedCarriedInterest * 0.4 }
        ]
      }
    };

    setResults(mockResults);
    setIsCalculating(false);
    onResultsChange?.(mockResults);
  };

  const formatCurrency = (amount: number) => {
    return `$${(amount / 1000000).toFixed(1)}M`;
  };

  const formatPercentage = (value: number) => {
    return `${(value * 100).toFixed(1)}%`;
  };

  const getBenchmarkColor = (variance: number) => {
    if (variance > 10) return 'text-red-600';
    if (variance < -10) return 'text-green-600';
    return 'text-yellow-600';
  };

  const updateFeeStructure = (path: string[], value: any) => {
    setInputs(prev => {
      const newInputs = { ...prev };
      let current: any = newInputs.feeStructure;
      
      for (let i = 0; i < path.length - 1; i++) {
        current = current[path[i]];
      }
      current[path[path.length - 1]] = value;
      
      return newInputs;
    });
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-50 rounded-lg">
              <DollarSign className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Fee Analysis & Optimization</h3>
              <p className="text-sm text-gray-500">Analyze fund fee structures, economics & benchmarking</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={mode === 'autonomous' ? 'default' : 'secondary'}>
              {mode === 'autonomous' && <Zap className="h-3 w-3 mr-1" />}
              {mode.charAt(0).toUpperCase() + mode.slice(1)} Mode
            </Badge>
            <Button onClick={calculateFeeAnalysis} disabled={isCalculating} size="sm">
              {isCalculating ? 'Analyzing...' : 'Analyze'}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          {[
            { key: 'structure', label: 'Fee Structure', icon: Calculator },
            { key: 'projections', label: 'Projections', icon: TrendingUp },
            { key: 'benchmark', label: 'Benchmarking', icon: BarChart3 },
            { key: 'optimization', label: 'Optimization', icon: Target }
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key as any)}
              className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === key
                  ? 'bg-white text-green-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </div>

        {/* Fee Structure Tab */}
        {activeTab === 'structure' && (
          <div className="space-y-6">
            {/* Fund Information */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fund Size ($M)</label>
                <Input 
                  type="number"
                  value={inputs.fundInfo.fundSize / 1000000}
                  onChange={(e) => setInputs(prev => ({
                    ...prev,
                    fundInfo: { ...prev.fundInfo, fundSize: parseFloat(e.target.value) * 1000000 }
                  }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Target Return (%)</label>
                <Input 
                  type="number"
                  step="0.1"
                  value={inputs.fundInfo.targetReturn * 100}
                  onChange={(e) => setInputs(prev => ({
                    ...prev,
                    fundInfo: { ...prev.fundInfo, targetReturn: parseFloat(e.target.value) / 100 }
                  }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fund Term (Years)</label>
                <Input 
                  type="number"
                  value={inputs.fundInfo.fundTerm}
                  onChange={(e) => setInputs(prev => ({
                    ...prev,
                    fundInfo: { ...prev.fundInfo, fundTerm: parseInt(e.target.value) }
                  }))}
                />
              </div>
            </div>

            {/* Management Fee Structure */}
            <div className="border rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-4">Management Fee Structure</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Management Fee Rate (%)</label>
                  <Input 
                    type="number"
                    step="0.1"
                    value={inputs.feeStructure.managementFee.rate * 100}
                    onChange={(e) => updateFeeStructure(['managementFee', 'rate'], parseFloat(e.target.value) / 100)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fee Basis</label>
                  <select 
                    value={inputs.feeStructure.managementFee.basis}
                    onChange={(e) => updateFeeStructure(['managementFee', 'basis'], e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  >
                    <option value="committed_capital">Committed Capital</option>
                    <option value="invested_capital">Invested Capital</option>
                    <option value="nav">Net Asset Value</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Carried Interest Structure */}
            <div className="border rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-4">Carried Interest Structure</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Carried Interest (%)</label>
                  <Input 
                    type="number"
                    step="0.1"
                    value={inputs.feeStructure.carriedInterest.rate * 100}
                    onChange={(e) => updateFeeStructure(['carriedInterest', 'rate'], parseFloat(e.target.value) / 100)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hurdle Rate (%)</label>
                  <Input 
                    type="number"
                    step="0.1"
                    value={(inputs.feeStructure.carriedInterest.hurdleRate || 0) * 100}
                    onChange={(e) => updateFeeStructure(['carriedInterest', 'hurdleRate'], parseFloat(e.target.value) / 100)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Distribution Method</label>
                  <select 
                    value={inputs.feeStructure.carriedInterest.distributionWaterfall}
                    onChange={(e) => updateFeeStructure(['carriedInterest', 'distributionWaterfall'], e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  >
                    <option value="american">American Waterfall</option>
                    <option value="european">European Waterfall</option>
                    <option value="deal_by_deal">Deal-by-Deal</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Other Fees */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-4">Transaction Fees</h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Fee Rate (%)</label>
                    <Input 
                      type="number"
                      step="0.1"
                      value={inputs.feeStructure.transactionFees.rate * 100}
                      onChange={(e) => updateFeeStructure(['transactionFees', 'rate'], parseFloat(e.target.value) / 100)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">LP Sharing (%)</label>
                    <Input 
                      type="number"
                      step="1"
                      value={inputs.feeStructure.transactionFees.sharingRatio * 100}
                      onChange={(e) => updateFeeStructure(['transactionFees', 'sharingRatio'], parseFloat(e.target.value) / 100)}
                    />
                  </div>
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-4">Monitoring Fees</h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Annual Fee ($K)</label>
                    <Input 
                      type="number"
                      value={inputs.feeStructure.monitoringFees.averageAnnualFee / 1000}
                      onChange={(e) => updateFeeStructure(['monitoringFees', 'averageAnnualFee'], parseFloat(e.target.value) * 1000)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">LP Sharing (%)</label>
                    <Input 
                      type="number"
                      step="1"
                      value={inputs.feeStructure.monitoringFees.sharingRatio * 100}
                      onChange={(e) => updateFeeStructure(['monitoringFees', 'sharingRatio'], parseFloat(e.target.value) / 100)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Fee Projections Tab */}
        {activeTab === 'projections' && results && (
          <div className="space-y-6">
            {/* Management Fee Projections */}
            <div>
              <h4 className="text-lg font-medium text-gray-900 mb-4">Management Fee Projections</h4>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Year</th>
                      <th className="text-right py-2">Rate</th>
                      <th className="text-right py-2">Fee Amount</th>
                      <th className="text-right py-2">Basis</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.managementFeeProjections.map((projection, index) => (
                      <tr key={index} className="border-b">
                        <td className="py-2">{projection.year}</td>
                        <td className="text-right py-2">{formatPercentage(projection.rate)}</td>
                        <td className="text-right py-2 font-medium">{formatCurrency(projection.fee)}</td>
                        <td className="text-right py-2 text-gray-500 capitalize">
                          {projection.basis.replace('_', ' ')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Carried Interest Analysis */}
            <div className="border rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-4">Carried Interest Analysis</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-lg font-bold text-gray-900">
                    {formatCurrency(results.carriedInterestAnalysis.hurdleAmount)}
                  </div>
                  <div className="text-sm text-gray-600">Hurdle Amount</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-gray-900">
                    {formatCurrency(results.carriedInterestAnalysis.excessReturns)}
                  </div>
                  <div className="text-sm text-gray-600">Excess Returns</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-purple-600">
                    {formatCurrency(results.carriedInterestAnalysis.carriedInterest)}
                  </div>
                  <div className="text-sm text-gray-600">Carried Interest</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-gray-900">
                    {formatPercentage(results.carriedInterestAnalysis.carriedInterestRate)}
                  </div>
                  <div className="text-sm text-gray-600">Carry Rate</div>
                </div>
              </div>
            </div>

            {/* Other Fee Projections */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border rounded-lg p-4">
                <h5 className="font-medium text-gray-900 mb-3">Transaction Fees</h5>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Total Fees</span>
                    <span className="font-medium">{formatCurrency(results.transactionFeeProjections.totalTransactionFees)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">GP Share</span>
                    <span className="font-medium">{formatCurrency(results.transactionFeeProjections.gpShare)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">LP Share</span>
                    <span className="font-medium">{formatCurrency(results.transactionFeeProjections.lpShare)}</span>
                  </div>
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <h5 className="font-medium text-gray-900 mb-3">Monitoring Fees</h5>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Total Fees</span>
                    <span className="font-medium">{formatCurrency(results.monitoringFeeProjections.totalMonitoringFees)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">GP Share</span>
                    <span className="font-medium">{formatCurrency(results.monitoringFeeProjections.gpShare)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">LP Share</span>
                    <span className="font-medium">{formatCurrency(results.monitoringFeeProjections.lpShare)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Benchmarking Tab */}
        {activeTab === 'benchmark' && results && (
          <div className="space-y-6">
            <h4 className="text-lg font-medium text-gray-900">Market Benchmarking</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <h5 className="font-medium text-gray-900 mb-3">Management Fee Comparison</h5>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Your Fund</span>
                      <span className="font-medium">{formatPercentage(inputs.feeStructure.managementFee.rate)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Peer Average</span>
                      <span className="font-medium">{formatPercentage(inputs.benchmarkData.peerManagementFee)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Variance</span>
                      <span className={`font-medium ${getBenchmarkColor(results.benchmarkComparison.managementFeeVsPeer)}`}>
                        {results.benchmarkComparison.managementFeeVsPeer > 0 ? '+' : ''}{results.benchmarkComparison.managementFeeVsPeer.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <h5 className="font-medium text-gray-900 mb-3">Carried Interest Comparison</h5>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Your Fund</span>
                      <span className="font-medium">{formatPercentage(inputs.feeStructure.carriedInterest.rate)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Peer Average</span>
                      <span className="font-medium">{formatPercentage(inputs.benchmarkData.peerCarriedInterest)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Variance</span>
                      <span className={`font-medium ${getBenchmarkColor(results.benchmarkComparison.carriedInterestVsPeer)}`}>
                        {results.benchmarkComparison.carriedInterestVsPeer > 0 ? '+' : ''}{results.benchmarkComparison.carriedInterestVsPeer.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <h5 className="font-medium text-gray-900 mb-3">Competitive Positioning</h5>
                  <div className="text-center py-6">
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      results.benchmarkComparison.competitiveRanking === 'aggressive' ? 'bg-red-100 text-red-800' :
                      results.benchmarkComparison.competitiveRanking === 'market' ? 'bg-blue-100 text-blue-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {results.benchmarkComparison.competitiveRanking === 'aggressive' && <AlertTriangle className="h-4 w-4 mr-1" />}
                      {results.benchmarkComparison.competitiveRanking === 'market' && <CheckCircle className="h-4 w-4 mr-1" />}
                      {results.benchmarkComparison.competitiveRanking === 'conservative' && <CheckCircle className="h-4 w-4 mr-1" />}
                      {results.benchmarkComparison.competitiveRanking.charAt(0).toUpperCase() + results.benchmarkComparison.competitiveRanking.slice(1)}
                    </div>
                    <p className="text-sm text-gray-600 mt-2">
                      {results.benchmarkComparison.competitiveRanking === 'market' 
                        ? 'Your fee structure is in line with market standards'
                        : results.benchmarkComparison.competitiveRanking === 'aggressive'
                        ? 'Your fees are above market - consider justification'
                        : 'Your fees are below market - potential to optimize'
                      }
                    </p>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <h5 className="font-medium text-gray-900 mb-3">LP Economics Impact</h5>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Net IRR</span>
                      <span className="font-medium">{formatPercentage(results.lpEconomics.netIrr)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Net Multiple</span>
                      <span className="font-medium">{results.lpEconomics.netMultiple.toFixed(2)}x</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Fee Offset</span>
                      <span className="font-medium">{(results.lpEconomics.feeOffset * 100).toFixed(0)} bps</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Optimization Tab */}
        {activeTab === 'optimization' && results && (
          <div className="space-y-6">
            <h4 className="text-lg font-medium text-gray-900">Fee Optimization Scenarios</h4>
            
            <div className="space-y-4">
              {results.sensitivityAnalysis.scenarios.map((scenario, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h5 className="font-medium text-gray-900">{scenario.label}</h5>
                    <Badge variant={index === 0 ? 'default' : 'secondary'}>
                      {index === 0 ? 'Current' : 'Scenario'}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-lg font-bold text-gray-900">
                        {formatPercentage(scenario.netIrr)}
                      </div>
                      <div className="text-sm text-gray-600">Net IRR</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-purple-600">
                        {formatCurrency(scenario.carriedInterest)}
                      </div>
                      <div className="text-sm text-gray-600">Carried Interest</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-600">
                        {formatCurrency(results.totalManagementFees + scenario.carriedInterest)}
                      </div>
                      <div className="text-sm text-gray-600">Total GP Revenue</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Results Summary */}
        {results && (
          <div className="border-t pt-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{formatCurrency(results.totalManagementFees)}</div>
                <div className="text-sm text-gray-600">Management Fees</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{formatCurrency(results.projectedCarriedInterest)}</div>
                <div className="text-sm text-gray-600">Carried Interest</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{formatCurrency(results.totalGpRevenue)}</div>
                <div className="text-sm text-gray-600">Total GP Revenue</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">{formatPercentage(results.lpEconomics.netIrr)}</div>
                <div className="text-sm text-gray-600">LP Net IRR</div>
              </div>
            </div>
          </div>
        )}

        {/* AI Assistance (for assisted/autonomous modes) */}
        {mode !== 'traditional' && (
          <div className="border rounded-lg p-4 bg-green-50">
            <div className="flex items-start gap-3">
              <Zap className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-green-900">AI Fee Optimization</h4>
                <ul className="text-sm text-green-800 mt-2 space-y-1">
                  <li>• Consider declining management fee to 1.5% after year 5 to improve LP alignment</li>
                  <li>• Current 8% hurdle rate is competitive but could be optimized to 7% for upside scenarios</li>
                  <li>• Transaction fee sharing at 80% is LP-friendly and above market average</li>
                  {mode === 'autonomous' && (
                    <li>• <strong>Auto-optimization:</strong> Scenario modeling shows optimal 2%/20% with 7.5% hurdle</li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FeeAnalysisCard;