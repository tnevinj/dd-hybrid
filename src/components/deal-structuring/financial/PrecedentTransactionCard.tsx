'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { 
  Plus, 
  X, 
  Calculator, 
  TrendingUp, 
  Activity, 
  Building2, 
  Target, 
  AlertCircle,
  CheckCircle,
  DollarSign,
  Calendar,
  Users,
  BarChart3
} from 'lucide-react';

interface PrecedentTransactionCardProps {
  dealId: string;
  mode?: 'traditional' | 'assisted' | 'autonomous';
  onResultsChange?: (results: any) => void;
}

interface TransactionFinancials {
  transactionValue: number;
  enterpriseValue: number;
  equityValue: number;
  revenue: number;
  ebitda: number;
  ebit: number;
  netIncome: number;
  bookValue: number;
  ev_revenue: number;
  ev_ebitda: number;
  ev_ebit: number;
  pe_ratio: number;
  pb_ratio: number;
  premiumToLastClose: number;
  premiumTo20DayAvg: number;
  premiumTo52WeekHigh: number;
}

interface PrecedentTransaction {
  id: string;
  announcementDate: Date;
  closingDate?: Date;
  status: 'completed' | 'pending' | 'withdrawn';
  targetCompany: {
    id: string;
    name: string;
    ticker?: string;
    sector: string;
    industry: string;
    geography: string;
    size: 'small-cap' | 'mid-cap' | 'large-cap';
  };
  acquirer: {
    id: string;
    name: string;
    ticker?: string;
    type: 'strategic' | 'financial' | 'hybrid';
    geography: string;
  };
  structure: {
    dealType: 'acquisition' | 'merger' | 'leveraged_buyout';
    consideration: 'cash' | 'stock' | 'mixed';
    cashPercentage?: number;
    stockPercentage?: number;
  };
  financials: TransactionFinancials;
  marketConditions: {
    stockMarketIndex: number;
    creditSpreads: number;
    riskFreeRate: number;
    vixLevel: number;
    industryMultipleMedian: number;
    mnaActivityLevel: 'low' | 'medium' | 'high';
  };
  characteristics: {
    hostileTransaction: boolean;
    competitiveProcess: boolean;
    managementParticipation: 'supportive' | 'neutral' | 'opposed';
    strategicRationale: string[];
    expectedSynergies?: number;
    integrationRisk: 'low' | 'medium' | 'high';
  };
}

interface PrecedentAnalysisInputs {
  targetCompany: {
    id: string;
    name: string;
    sector: string;
    industry: string;
    geography: string;
    size: 'small-cap' | 'mid-cap' | 'large-cap';
    financials: {
      revenue: number;
      ebitda: number;
      ebit: number;
      netIncome: number;
      bookValue: number;
      marketCap: number;
      enterpriseValue: number;
    };
  };
  precedentTransactions: PrecedentTransaction[];
  analysisSettings: {
    includeMultiples: string[];
    statisticalMethod: 'median' | 'mean' | 'weighted_mean';
    timeWeighting: boolean;
    timeDecayFactor: number;
    marketConditionAdjustment: boolean;
    controlPremiumAdjustment: number;
    outlierRemoval: boolean;
    outlierThreshold: number;
  };
  filters: {
    maxTransactionAge: number;
    minTransactionValue: number;
    requiredStatus: string[];
    excludeHostileDeals: boolean;
    acquirerTypes: string[];
    industryMatch: 'exact' | 'sector' | 'broad';
  };
}

const PrecedentTransactionCard: React.FC<PrecedentTransactionCardProps> = ({ 
  dealId, 
  mode = 'traditional',
  onResultsChange 
}) => {
  const [activeTab, setActiveTab] = useState<'setup' | 'transactions' | 'results' | 'insights'>('setup');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const [inputs, setInputs] = useState<PrecedentAnalysisInputs>({
    targetCompany: {
      id: 'target-1',
      name: 'Target Company',
      sector: 'Technology',
      industry: 'Software',
      geography: 'North America',
      size: 'mid-cap',
      financials: {
        revenue: 100000000,
        ebitda: 25000000,
        ebit: 20000000,
        netIncome: 15000000,
        bookValue: 75000000,
        marketCap: 300000000,
        enterpriseValue: 325000000
      }
    },
    precedentTransactions: [
      {
        id: 'txn-1',
        announcementDate: new Date('2023-06-15'),
        closingDate: new Date('2023-09-15'),
        status: 'completed',
        targetCompany: {
          id: 'comp-1',
          name: 'SaaS Company Alpha',
          ticker: 'SAAS',
          sector: 'Technology',
          industry: 'Software',
          geography: 'North America',
          size: 'mid-cap'
        },
        acquirer: {
          id: 'acq-1',
          name: 'Tech Giant Corp',
          ticker: 'TECH',
          type: 'strategic',
          geography: 'North America'
        },
        structure: {
          dealType: 'acquisition',
          consideration: 'cash'
        },
        financials: {
          transactionValue: 450000000,
          enterpriseValue: 450000000,
          equityValue: 450000000,
          revenue: 120000000,
          ebitda: 30000000,
          ebit: 25000000,
          netIncome: 18000000,
          bookValue: 90000000,
          ev_revenue: 3.75,
          ev_ebitda: 15.0,
          ev_ebit: 18.0,
          pe_ratio: 25.0,
          pb_ratio: 5.0,
          premiumToLastClose: 35.0,
          premiumTo20DayAvg: 32.0,
          premiumTo52WeekHigh: -5.0
        },
        marketConditions: {
          stockMarketIndex: 4200,
          creditSpreads: 250,
          riskFreeRate: 0.045,
          vixLevel: 18,
          industryMultipleMedian: 12.5,
          mnaActivityLevel: 'high'
        },
        characteristics: {
          hostileTransaction: false,
          competitiveProcess: true,
          managementParticipation: 'supportive',
          strategicRationale: ['Market expansion', 'Technology acquisition'],
          expectedSynergies: 50000000,
          integrationRisk: 'medium'
        }
      },
      {
        id: 'txn-2',
        announcementDate: new Date('2023-03-20'),
        closingDate: new Date('2023-07-20'),
        status: 'completed',
        targetCompany: {
          id: 'comp-2',
          name: 'Enterprise Software Beta',
          ticker: 'ENTB',
          sector: 'Technology',
          industry: 'Software',
          geography: 'North America',
          size: 'mid-cap'
        },
        acquirer: {
          id: 'acq-2',
          name: 'PE Fund Alpha',
          type: 'financial',
          geography: 'North America'
        },
        structure: {
          dealType: 'acquisition',
          consideration: 'mixed',
          cashPercentage: 80,
          stockPercentage: 20
        },
        financials: {
          transactionValue: 380000000,
          enterpriseValue: 400000000,
          equityValue: 380000000,
          revenue: 95000000,
          ebitda: 22000000,
          ebit: 18000000,
          netIncome: 13000000,
          bookValue: 70000000,
          ev_revenue: 4.21,
          ev_ebitda: 18.2,
          ev_ebit: 22.2,
          pe_ratio: 29.2,
          pb_ratio: 5.4,
          premiumToLastClose: 28.0,
          premiumTo20DayAvg: 25.0,
          premiumTo52WeekHigh: 10.0
        },
        marketConditions: {
          stockMarketIndex: 4100,
          creditSpreads: 275,
          riskFreeRate: 0.042,
          vixLevel: 22,
          industryMultipleMedian: 13.8,
          mnaActivityLevel: 'medium'
        },
        characteristics: {
          hostileTransaction: false,
          competitiveProcess: true,
          managementParticipation: 'supportive',
          strategicRationale: ['Portfolio expansion', 'Operational improvement'],
          integrationRisk: 'low'
        }
      }
    ],
    analysisSettings: {
      includeMultiples: ['ev_revenue', 'ev_ebitda', 'ev_ebit', 'pe_ratio'],
      statisticalMethod: 'median',
      timeWeighting: true,
      timeDecayFactor: 0.1,
      marketConditionAdjustment: true,
      controlPremiumAdjustment: 0.3,
      outlierRemoval: true,
      outlierThreshold: 2.0
    },
    filters: {
      maxTransactionAge: 3,
      minTransactionValue: 100000000,
      requiredStatus: ['completed', 'pending'],
      excludeHostileDeals: true,
      acquirerTypes: ['strategic', 'financial'],
      industryMatch: 'sector'
    }
  });

  const addTransaction = () => {
    const newTransaction: PrecedentTransaction = {
      id: `txn-${inputs.precedentTransactions.length + 1}`,
      announcementDate: new Date(),
      status: 'completed',
      targetCompany: {
        id: `comp-${inputs.precedentTransactions.length + 1}`,
        name: `Transaction ${inputs.precedentTransactions.length + 1}`,
        sector: 'Technology',
        industry: 'Software',
        geography: 'North America',
        size: 'mid-cap'
      },
      acquirer: {
        id: `acq-${inputs.precedentTransactions.length + 1}`,
        name: `Acquirer ${inputs.precedentTransactions.length + 1}`,
        type: 'strategic',
        geography: 'North America'
      },
      structure: {
        dealType: 'acquisition',
        consideration: 'cash'
      },
      financials: {
        transactionValue: 300000000,
        enterpriseValue: 300000000,
        equityValue: 300000000,
        revenue: 80000000,
        ebitda: 20000000,
        ebit: 16000000,
        netIncome: 12000000,
        bookValue: 60000000,
        ev_revenue: 3.75,
        ev_ebitda: 15.0,
        ev_ebit: 18.75,
        pe_ratio: 25.0,
        pb_ratio: 5.0,
        premiumToLastClose: 30.0,
        premiumTo20DayAvg: 28.0,
        premiumTo52WeekHigh: 5.0
      },
      marketConditions: {
        stockMarketIndex: 4200,
        creditSpreads: 250,
        riskFreeRate: 0.045,
        vixLevel: 18,
        industryMultipleMedian: 12.5,
        mnaActivityLevel: 'medium'
      },
      characteristics: {
        hostileTransaction: false,
        competitiveProcess: true,
        managementParticipation: 'supportive',
        strategicRationale: ['Market expansion'],
        integrationRisk: 'medium'
      }
    };

    setInputs(prev => ({
      ...prev,
      precedentTransactions: [...prev.precedentTransactions, newTransaction]
    }));
  };

  const removeTransaction = (index: number) => {
    setInputs(prev => ({
      ...prev,
      precedentTransactions: prev.precedentTransactions.filter((_, i) => i !== index)
    }));
  };

  const runAnalysis = async () => {
    setLoading(true);
    setError(null);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      const mockResults = {
        valuation: {
          enterpriseValue: {
            weightedAverage: inputs.targetCompany.financials.ebitda * 16.8,
            range: {
              low: inputs.targetCompany.financials.ebitda * 14.2,
              high: inputs.targetCompany.financials.ebitda * 19.5
            }
          },
          equityValue: {
            weightedAverage: inputs.targetCompany.financials.ebitda * 16.8 - (inputs.targetCompany.financials.enterpriseValue - inputs.targetCompany.financials.marketCap),
            range: {
              low: inputs.targetCompany.financials.ebitda * 14.2 - (inputs.targetCompany.financials.enterpriseValue - inputs.targetCompany.financials.marketCap),
              high: inputs.targetCompany.financials.ebitda * 19.5 - (inputs.targetCompany.financials.enterpriseValue - inputs.targetCompany.financials.marketCap)
            }
          },
          impliedPremium: 0.315,
          impliedOfferPrice: inputs.targetCompany.financials.marketCap * 1.315
        },
        multiples: {
          ev_revenue: {
            count: inputs.precedentTransactions.length,
            min: 3.2,
            max: 4.8,
            median: 3.98,
            mean: 3.98,
            selectedValue: 3.98
          },
          ev_ebitda: {
            count: inputs.precedentTransactions.length,
            min: 13.8,
            max: 19.2,
            median: 16.6,
            mean: 16.6,
            selectedValue: 16.8
          }
        },
        premiumAnalysis: {
          averageControlPremium: 31.5,
          medianControlPremium: 30.0,
          premiumRange: {
            min: 25.0,
            max: 35.0
          },
          premiumByAcquirerType: {
            strategic: 33.5,
            financial: 29.0
          }
        },
        selectedTransactions: inputs.precedentTransactions.map((txn, index) => ({
          ...txn,
          relevanceScore: 85 + Math.random() * 10,
          weight: 0.5
        })),
        qualityMetrics: {
          dataCompleteness: 0.92,
          industryRelevance: 0.88,
          sizeComparability: 0.85,
          averageTransactionAge: 1.2,
          totalTransactions: inputs.precedentTransactions.length,
          usedTransactions: inputs.precedentTransactions.length
        },
        insights: [
          'Strategic acquirers typically pay 15% higher premiums than financial buyers in this sector',
          'Transaction premiums correlate positively with competitive auction processes',
          'Market conditions remain favorable for M&A activity with moderate volatility',
          'Target company size aligns well with typical acquisition profiles in recent transactions'
        ]
      };

      setResults(mockResults);
      setActiveTab('results');
      onResultsChange?.(mockResults);

    } catch (error) {
      setError(error instanceof Error ? error.message : 'Analysis failed');
    } finally {
      setLoading(false);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'setup':
        return (
          <div className="space-y-6">
            <div>
              <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Target className="h-5 w-5" />
                Target Company Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Company Name</label>
                  <Input
                    value={inputs.targetCompany.name}
                    onChange={(e) => setInputs(prev => ({
                      ...prev,
                      targetCompany: { ...prev.targetCompany, name: e.target.value }
                    }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Industry</label>
                  <Input
                    value={inputs.targetCompany.industry}
                    onChange={(e) => setInputs(prev => ({
                      ...prev,
                      targetCompany: { ...prev.targetCompany, industry: e.target.value }
                    }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Revenue ($M)</label>
                  <Input
                    type="number"
                    value={inputs.targetCompany.financials.revenue / 1000000}
                    onChange={(e) => setInputs(prev => ({
                      ...prev,
                      targetCompany: {
                        ...prev.targetCompany,
                        financials: {
                          ...prev.targetCompany.financials,
                          revenue: parseFloat(e.target.value) * 1000000
                        }
                      }
                    }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">EBITDA ($M)</label>
                  <Input
                    type="number"
                    value={inputs.targetCompany.financials.ebitda / 1000000}
                    onChange={(e) => setInputs(prev => ({
                      ...prev,
                      targetCompany: {
                        ...prev.targetCompany,
                        financials: {
                          ...prev.targetCompany.financials,
                          ebitda: parseFloat(e.target.value) * 1000000
                        }
                      }
                    }))}
                  />
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Analysis Configuration
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Statistical Method</label>
                  <select
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={inputs.analysisSettings.statisticalMethod}
                    onChange={(e) => setInputs(prev => ({
                      ...prev,
                      analysisSettings: {
                        ...prev.analysisSettings,
                        statisticalMethod: e.target.value as any
                      }
                    }))}
                  >
                    <option value="median">Median</option>
                    <option value="mean">Mean</option>
                    <option value="weighted_mean">Weighted Mean</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Control Premium Adjustment (%)</label>
                  <Input
                    type="number"
                    value={inputs.analysisSettings.controlPremiumAdjustment * 100}
                    onChange={(e) => setInputs(prev => ({
                      ...prev,
                      analysisSettings: {
                        ...prev.analysisSettings,
                        controlPremiumAdjustment: parseFloat(e.target.value) / 100
                      }
                    }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Max Transaction Age (years)</label>
                  <Input
                    type="number"
                    value={inputs.filters.maxTransactionAge}
                    onChange={(e) => setInputs(prev => ({
                      ...prev,
                      filters: {
                        ...prev.filters,
                        maxTransactionAge: parseInt(e.target.value)
                      }
                    }))}
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 'transactions':
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="text-lg font-semibold flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Precedent Transactions ({inputs.precedentTransactions.length})
              </h4>
              <Button onClick={addTransaction} variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Transaction
              </Button>
            </div>

            {inputs.precedentTransactions.map((txn, index) => (
              <Card key={index} className="border">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h5 className="font-semibold">Transaction {index + 1}</h5>
                      <p className="text-sm text-gray-600">{txn.targetCompany.name} ← {txn.acquirer.name}</p>
                    </div>
                    <Button
                      onClick={() => removeTransaction(index)}
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-800"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-sm font-medium mb-1">Target Company</label>
                      <Input
                        value={txn.targetCompany.name}
                        onChange={(e) => {
                          const newTxns = [...inputs.precedentTransactions];
                          newTxns[index] = {
                            ...txn,
                            targetCompany: { ...txn.targetCompany, name: e.target.value }
                          };
                          setInputs(prev => ({ ...prev, precedentTransactions: newTxns }));
                        }}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Acquirer</label>
                      <Input
                        value={txn.acquirer.name}
                        onChange={(e) => {
                          const newTxns = [...inputs.precedentTransactions];
                          newTxns[index] = {
                            ...txn,
                            acquirer: { ...txn.acquirer, name: e.target.value }
                          };
                          setInputs(prev => ({ ...prev, precedentTransactions: newTxns }));
                        }}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Transaction Value ($M)</label>
                      <Input
                        type="number"
                        value={txn.financials.transactionValue / 1000000}
                        onChange={(e) => {
                          const newTxns = [...inputs.precedentTransactions];
                          newTxns[index] = {
                            ...txn,
                            financials: { ...txn.financials, transactionValue: parseFloat(e.target.value) * 1000000 }
                          };
                          setInputs(prev => ({ ...prev, precedentTransactions: newTxns }));
                        }}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Control Premium (%)</label>
                      <Input
                        type="number"
                        value={txn.financials.premiumToLastClose}
                        onChange={(e) => {
                          const newTxns = [...inputs.precedentTransactions];
                          newTxns[index] = {
                            ...txn,
                            financials: { ...txn.financials, premiumToLastClose: parseFloat(e.target.value) }
                          };
                          setInputs(prev => ({ ...prev, precedentTransactions: newTxns }));
                        }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mt-3">
                    <div>
                      <label className="block text-sm font-medium mb-1">EV/Revenue</label>
                      <Input
                        type="number"
                        step="0.1"
                        value={txn.financials.ev_revenue}
                        onChange={(e) => {
                          const newTxns = [...inputs.precedentTransactions];
                          newTxns[index] = {
                            ...txn,
                            financials: { ...txn.financials, ev_revenue: parseFloat(e.target.value) }
                          };
                          setInputs(prev => ({ ...prev, precedentTransactions: newTxns }));
                        }}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">EV/EBITDA</label>
                      <Input
                        type="number"
                        step="0.1"
                        value={txn.financials.ev_ebitda}
                        onChange={(e) => {
                          const newTxns = [...inputs.precedentTransactions];
                          newTxns[index] = {
                            ...txn,
                            financials: { ...txn.financials, ev_ebitda: parseFloat(e.target.value) }
                          };
                          setInputs(prev => ({ ...prev, precedentTransactions: newTxns }));
                        }}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Acquirer Type</label>
                      <select
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={txn.acquirer.type}
                        onChange={(e) => {
                          const newTxns = [...inputs.precedentTransactions];
                          newTxns[index] = {
                            ...txn,
                            acquirer: { ...txn.acquirer, type: e.target.value as any }
                          };
                          setInputs(prev => ({ ...prev, precedentTransactions: newTxns }));
                        }}
                      >
                        <option value="strategic">Strategic</option>
                        <option value="financial">Financial</option>
                        <option value="hybrid">Hybrid</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Announcement Date</label>
                      <Input
                        type="date"
                        value={txn.announcementDate.toISOString().split('T')[0]}
                        onChange={(e) => {
                          const newTxns = [...inputs.precedentTransactions];
                          newTxns[index] = {
                            ...txn,
                            announcementDate: new Date(e.target.value)
                          };
                          setInputs(prev => ({ ...prev, precedentTransactions: newTxns }));
                        }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        );

      case 'results':
        if (!results) {
          return (
            <div className="text-center py-8 text-gray-500">
              <Activity className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p>Run analysis to see precedent transaction results</p>
            </div>
          );
        }

        return (
          <div className="space-y-6">
            <div>
              <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Implied Valuation Summary
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-sm text-gray-600 mb-1">Enterprise Value</div>
                    <div className="text-2xl font-bold text-blue-600">
                      ${(results.valuation.enterpriseValue.weightedAverage / 1000000).toFixed(1)}M
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Range: ${(results.valuation.enterpriseValue.range.low / 1000000).toFixed(1)}M - ${(results.valuation.enterpriseValue.range.high / 1000000).toFixed(1)}M
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-sm text-gray-600 mb-1">Equity Value</div>
                    <div className="text-2xl font-bold text-green-600">
                      ${(results.valuation.equityValue.weightedAverage / 1000000).toFixed(1)}M
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Range: ${(results.valuation.equityValue.range.low / 1000000).toFixed(1)}M - ${(results.valuation.equityValue.range.high / 1000000).toFixed(1)}M
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-sm text-gray-600 mb-1">Implied Premium</div>
                    <div className="text-2xl font-bold text-purple-600">
                      {(results.valuation.impliedPremium * 100).toFixed(1)}%
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-sm text-gray-600 mb-1">Offer Price</div>
                    <div className="text-2xl font-bold text-orange-600">
                      ${(results.valuation.impliedOfferPrice / 1000000).toFixed(1)}M
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Transaction Multiple Statistics
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-300 px-4 py-2 text-left">Multiple</th>
                      <th className="border border-gray-300 px-4 py-2 text-right">Count</th>
                      <th className="border border-gray-300 px-4 py-2 text-right">Min</th>
                      <th className="border border-gray-300 px-4 py-2 text-right">Median</th>
                      <th className="border border-gray-300 px-4 py-2 text-right">Max</th>
                      <th className="border border-gray-300 px-4 py-2 text-right">Selected</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2 font-medium">EV/Revenue</td>
                      <td className="border border-gray-300 px-4 py-2 text-right">{results.multiples.ev_revenue.count}</td>
                      <td className="border border-gray-300 px-4 py-2 text-right">{results.multiples.ev_revenue.min.toFixed(2)}</td>
                      <td className="border border-gray-300 px-4 py-2 text-right font-semibold">{results.multiples.ev_revenue.median.toFixed(2)}</td>
                      <td className="border border-gray-300 px-4 py-2 text-right">{results.multiples.ev_revenue.max.toFixed(2)}</td>
                      <td className="border border-gray-300 px-4 py-2 text-right text-blue-600 font-semibold">{results.multiples.ev_revenue.selectedValue.toFixed(2)}</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2 font-medium">EV/EBITDA</td>
                      <td className="border border-gray-300 px-4 py-2 text-right">{results.multiples.ev_ebitda.count}</td>
                      <td className="border border-gray-300 px-4 py-2 text-right">{results.multiples.ev_ebitda.min.toFixed(2)}</td>
                      <td className="border border-gray-300 px-4 py-2 text-right font-semibold">{results.multiples.ev_ebitda.median.toFixed(2)}</td>
                      <td className="border border-gray-300 px-4 py-2 text-right">{results.multiples.ev_ebitda.max.toFixed(2)}</td>
                      <td className="border border-gray-300 px-4 py-2 text-right text-blue-600 font-semibold">{results.multiples.ev_ebitda.selectedValue.toFixed(2)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Control Premium Analysis</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-sm text-gray-600 mb-1">Average Premium</div>
                    <div className="text-xl font-bold">{results.premiumAnalysis.averageControlPremium.toFixed(1)}%</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-sm text-gray-600 mb-1">Median Premium</div>
                    <div className="text-xl font-bold">{results.premiumAnalysis.medianControlPremium.toFixed(1)}%</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-sm text-gray-600 mb-1">Premium Range</div>
                    <div className="text-xl font-bold">
                      {results.premiumAnalysis.premiumRange.min.toFixed(1)}% - {results.premiumAnalysis.premiumRange.max.toFixed(1)}%
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Selected Transactions ({results.selectedTransactions.length})</h4>
              <div className="flex flex-wrap gap-2">
                {results.selectedTransactions.slice(0, 10).map((txn: any, index: number) => (
                  <Badge key={index} variant="outline" className="px-3 py-1">
                    {txn.targetCompany.name} ({txn.acquirer.type})
                  </Badge>
                ))}
                {results.selectedTransactions.length > 10 && (
                  <Badge variant="outline" className="px-3 py-1">
                    +{results.selectedTransactions.length - 10} more
                  </Badge>
                )}
              </div>
            </div>
          </div>
        );

      case 'insights':
        if (!results) {
          return (
            <div className="text-center py-8 text-gray-500">
              <Users className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p>Run analysis to see insights and recommendations</p>
            </div>
          );
        }

        return (
          <div className="space-y-6">
            <div>
              <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Analysis Quality Metrics
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-sm text-gray-600 mb-1">Data Completeness</div>
                    <div className="text-2xl font-bold">{(results.qualityMetrics.dataCompleteness * 100).toFixed(0)}%</div>
                    <Progress value={results.qualityMetrics.dataCompleteness * 100} className="mt-2" />
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-sm text-gray-600 mb-1">Industry Relevance</div>
                    <div className="text-2xl font-bold">{(results.qualityMetrics.industryRelevance * 100).toFixed(0)}%</div>
                    <Progress value={results.qualityMetrics.industryRelevance * 100} className="mt-2" />
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-sm text-gray-600 mb-1">Size Comparability</div>
                    <div className="text-2xl font-bold">{(results.qualityMetrics.sizeComparability * 100).toFixed(0)}%</div>
                    <Progress value={results.qualityMetrics.sizeComparability * 100} className="mt-2" />
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-sm text-gray-600 mb-1">Avg. Transaction Age</div>
                    <div className="text-2xl font-bold">{results.qualityMetrics.averageTransactionAge.toFixed(1)}</div>
                    <div className="text-xs text-gray-500">years</div>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Key Insights & Market Intelligence
              </h4>
              <div className="space-y-3">
                {results.insights.map((insight: string, index: number) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <p className="text-blue-900">{insight}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Users className="h-5 w-5" />
                Premium Analysis by Acquirer Type
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-sm text-gray-600 mb-1">Strategic Buyers</div>
                    <div className="text-2xl font-bold text-green-600">{results.premiumAnalysis.premiumByAcquirerType.strategic.toFixed(1)}%</div>
                    <div className="text-xs text-gray-500">Average premium</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-sm text-gray-600 mb-1">Financial Buyers</div>
                    <div className="text-2xl font-bold text-blue-600">{results.premiumAnalysis.premiumByAcquirerType.financial.toFixed(1)}%</div>
                    <div className="text-xs text-gray-500">Average premium</div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {mode !== 'traditional' && (
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <h5 className="font-semibold text-purple-900 mb-2 flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  AI-Enhanced Transaction Analysis
                </h5>
                <p className="text-purple-800 text-sm">
                  Advanced algorithms have analyzed transaction patterns, market timing, and buyer behavior to optimize premium 
                  estimates. Consider macro-economic indicators and sector-specific M&A trends for enhanced accuracy.
                </p>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="h-6 w-6" />
            <div>
              <h3 className="text-xl font-semibold">Precedent Transaction Analysis</h3>
              <p className="text-sm text-gray-600">M&A transaction-based valuation with control premiums and market adjustments</p>
            </div>
          </div>
          <Badge variant="outline">v1.2.0</Badge>
        </div>
      </CardHeader>

      <CardContent>
        <div className="flex border-b mb-6">
          {[
            { id: 'setup', label: 'Setup', icon: Calculator },
            { id: 'transactions', label: 'Transactions', icon: Activity },
            { id: 'results', label: 'Results', icon: TrendingUp },
            { id: 'insights', label: 'Insights', icon: Users }
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as any)}
              className={`flex items-center gap-2 px-4 py-2 border-b-2 font-medium transition-colors ${
                activeTab === id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </div>

        {renderTabContent()}

        {(activeTab === 'setup' || activeTab === 'transactions') && (
          <div className="flex justify-end mt-6 pt-6 border-t">
            <Button onClick={runAnalysis} disabled={loading} className="min-w-[200px]">
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Running Analysis...
                </>
              ) : (
                <>
                  <Calculator className="h-4 w-4 mr-2" />
                  Run Transaction Analysis
                </>
              )}
            </Button>
          </div>
        )}

        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <span className="text-red-800">{error}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PrecedentTransactionCard;