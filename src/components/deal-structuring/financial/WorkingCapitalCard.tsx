'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { 
  Calculator,
  TrendingUp,
  Clock,
  DollarSign,
  ArrowUp,
  ArrowDown,
  BarChart3,
  Target,
  AlertCircle,
  CheckCircle,
  RefreshCw,
  Zap
} from 'lucide-react';

interface WorkingCapitalCardProps {
  dealId: string;
  mode?: 'traditional' | 'assisted' | 'autonomous';
  onResultsChange?: (results: any) => void;
}

interface WorkingCapitalInputs {
  companyInfo: {
    name: string;
    industry: string;
    businessModel: string;
    operationalCycle: string;
    seasonality: string;
  };
  currentPosition: {
    accountsReceivable: {
      currentBalance: number;
      daysOutstanding: number;
      badDebtRate: number;
      collectionEfficiency: number;
    };
    inventory: {
      currentBalance: number;
      daysOnHand: number;
      turnoverRate: number;
      obsolescenceRate: number;
    };
    accountsPayable: {
      currentBalance: number;
      daysOutstanding: number;
      supplierRelationships: string;
      paymentTiming: string;
    };
  };
  optimizationTargets: {
    cashConversionCycle: {
      targetDays: number;
      improvementTimeline: number;
    };
    receivablesManagement: {
      targetDSO: number;
    };
    inventoryManagement: {
      targetDIO: number;
    };
    payablesManagement: {
      targetDPO: number;
    };
  };
  marketAssumptions: {
    interestRates: {
      shortTermRates: number[];
      creditLineRates: number[];
      opportunityCost: number;
    };
    industryBenchmarks: {
      medianDSO: number;
      medianDIO: number;
      medianDPO: number;
      medianCCC: number;
      topQuartileCCC: number;
    };
  };
}

interface WorkingCapitalResults {
  summary: {
    currentCashConversionCycle: number;
    targetCashConversionCycle: number;
    potentialCCCImprovement: number;
    totalCashImpact: number;
  };
  projectedPeriods: Array<{
    period: string;
    revenue: number;
    workingCapitalComponents: {
      accountsReceivable: { endingBalance: number };
      inventory: { endingBalance: number };
      accountsPayable: { endingBalance: number };
    };
    workingCapitalMetrics: {
      cashConversionCycle: number;
    };
    cashFlowImpact: {
      operatingCashFlowImpact: number;
    };
  }>;
  optimizationAnalysis: {
    receivablesOptimization: {
      currentDSO: number;
      targetDSO: number;
      improvementPotential: number;
      cashImpact: number;
    };
    inventoryOptimization: {
      currentDIO: number;
      targetDIO: number;
      improvementPotential: number;
      cashImpact: number;
    };
    payablesOptimization: {
      currentDPO: number;
      targetDPO: number;
      improvementPotential: number;
      cashImpact: number;
    };
  };
  keyInsights: {
    workingCapitalInsights: string[];
    quickWins: string[];
  };
}

const WorkingCapitalCard: React.FC<WorkingCapitalCardProps> = ({
  dealId,
  mode = 'traditional',
  onResultsChange
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<WorkingCapitalResults | null>(null);

  // Working Capital Input State
  const [inputs, setInputs] = useState<WorkingCapitalInputs>({
    companyInfo: {
      name: 'Target Company',
      industry: 'Manufacturing',
      businessModel: 'B2B',
      operationalCycle: 'manufacturing',
      seasonality: 'moderate'
    },
    currentPosition: {
      accountsReceivable: {
        currentBalance: 150000000,
        daysOutstanding: 55,
        badDebtRate: 0.005,
        collectionEfficiency: 0.95
      },
      inventory: {
        currentBalance: 200000000,
        daysOnHand: 75,
        turnoverRate: 4.8,
        obsolescenceRate: 0.02
      },
      accountsPayable: {
        currentBalance: 100000000,
        daysOutstanding: 45,
        supplierRelationships: 'good',
        paymentTiming: 'on_time'
      }
    },
    optimizationTargets: {
      cashConversionCycle: {
        targetDays: 65,
        improvementTimeline: 6
      },
      receivablesManagement: {
        targetDSO: 42
      },
      inventoryManagement: {
        targetDIO: 60
      },
      payablesManagement: {
        targetDPO: 55
      }
    },
    marketAssumptions: {
      interestRates: {
        shortTermRates: [0.045, 0.045, 0.04, 0.035, 0.03, 0.03, 0.035, 0.04],
        creditLineRates: [0.065, 0.065, 0.06, 0.055, 0.05, 0.05, 0.055, 0.06],
        opportunityCost: 0.08
      },
      industryBenchmarks: {
        medianDSO: 48,
        medianDIO: 65,
        medianDPO: 52,
        medianCCC: 61,
        topQuartileCCC: 45
      }
    }
  });

  const runAnalysis = async () => {
    setLoading(true);
    
    // Mock results for demonstration
    setTimeout(() => {
      const mockResults: WorkingCapitalResults = {
        summary: {
          currentCashConversionCycle: 85,
          targetCashConversionCycle: 65,
          potentialCCCImprovement: 20,
          totalCashImpact: 45000000
        },
        projectedPeriods: [
          {
            period: 'Q1 2024',
            revenue: 250000000,
            workingCapitalComponents: {
              accountsReceivable: { endingBalance: 145000000 },
              inventory: { endingBalance: 185000000 },
              accountsPayable: { endingBalance: 105000000 }
            },
            workingCapitalMetrics: {
              cashConversionCycle: 82
            },
            cashFlowImpact: {
              operatingCashFlowImpact: 12000000
            }
          },
          {
            period: 'Q2 2024',
            revenue: 260000000,
            workingCapitalComponents: {
              accountsReceivable: { endingBalance: 140000000 },
              inventory: { endingBalance: 175000000 },
              accountsPayable: { endingBalance: 110000000 }
            },
            workingCapitalMetrics: {
              cashConversionCycle: 78
            },
            cashFlowImpact: {
              operatingCashFlowImpact: 15000000
            }
          },
          {
            period: 'Q3 2024',
            revenue: 270000000,
            workingCapitalComponents: {
              accountsReceivable: { endingBalance: 135000000 },
              inventory: { endingBalance: 165000000 },
              accountsPayable: { endingBalance: 115000000 }
            },
            workingCapitalMetrics: {
              cashConversionCycle: 74
            },
            cashFlowImpact: {
              operatingCashFlowImpact: 18000000
            }
          },
          {
            period: 'Q4 2024',
            revenue: 280000000,
            workingCapitalComponents: {
              accountsReceivable: { endingBalance: 130000000 },
              inventory: { endingBalance: 160000000 },
              accountsPayable: { endingBalance: 120000000 }
            },
            workingCapitalMetrics: {
              cashConversionCycle: 68
            },
            cashFlowImpact: {
              operatingCashFlowImpact: 22000000
            }
          }
        ],
        optimizationAnalysis: {
          receivablesOptimization: {
            currentDSO: 55,
            targetDSO: 42,
            improvementPotential: 13,
            cashImpact: 18000000
          },
          inventoryOptimization: {
            currentDIO: 75,
            targetDIO: 60,
            improvementPotential: 15,
            cashImpact: 22000000
          },
          payablesOptimization: {
            currentDPO: 45,
            targetDPO: 55,
            improvementPotential: 10,
            cashImpact: 8000000
          }
        },
        keyInsights: {
          workingCapitalInsights: [
            'Inventory levels 15% above industry median',
            'DSO improvement potential of 24%',
            'Strong supplier relationships enable DPO extension',
            'Seasonal patterns indicate Q4 optimization opportunity'
          ],
          quickWins: [
            'Implement automated billing system',
            'Negotiate extended payment terms',
            'Optimize inventory reorder points',
            'Introduce early payment discounts'
          ]
        }
      };

      setResults(mockResults);
      onResultsChange?.(mockResults);
      setLoading(false);
    }, 2000);
  };

  const currentCCC = inputs.currentPosition.accountsReceivable.daysOutstanding + 
                   inputs.currentPosition.inventory.daysOnHand - 
                   inputs.currentPosition.accountsPayable.daysOutstanding;

  const targetCCC = inputs.optimizationTargets.cashConversionCycle.targetDays;
  const improvement = currentCCC - targetCCC;

  const tabs = [
    { id: 'overview', name: 'Overview', icon: BarChart3 },
    { id: 'position', name: 'Current Position', icon: Target },
    { id: 'optimization', name: 'Optimization', icon: TrendingUp },
    { id: 'results', name: 'Results', icon: CheckCircle }
  ];

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5 text-blue-600" />
            <div>
              <h3 className="text-lg font-semibold">Working Capital Analysis</h3>
              <p className="text-sm text-gray-600">Cash conversion cycle optimization with liquidity management</p>
            </div>
          </div>
          <Badge variant="outline" className="text-xs">
            v1.4.0
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Tab Navigation */}
        <div className="flex gap-1 p-1 bg-gray-100 rounded-lg">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.name}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Current Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium">Current CCC</span>
                </div>
                <div className="text-2xl font-bold text-blue-600">{currentCCC} days</div>
                <p className="text-xs text-gray-500">DSO + DIO - DPO</p>
              </Card>

              <Card className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium">Target CCC</span>
                </div>
                <div className="text-2xl font-bold text-green-600">{targetCCC} days</div>
                <p className="text-xs text-gray-500">Optimization target</p>
              </Card>

              <Card className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <ArrowDown className="h-4 w-4 text-orange-600" />
                  <span className="text-sm font-medium">Improvement</span>
                </div>
                <div className="text-2xl font-bold text-orange-600">{improvement} days</div>
                <p className="text-xs text-gray-500">Potential reduction</p>
              </Card>

              <Card className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium">Cash Impact</span>
                </div>
                <div className="text-2xl font-bold text-blue-600">$48M</div>
                <p className="text-xs text-gray-500">Estimated benefit</p>
              </Card>
            </div>

            {/* Company Information */}
            <Card className="p-4">
              <h4 className="font-medium mb-4">Company & Settings</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Company Name</label>
                  <Input
                    value={inputs.companyInfo.name}
                    onChange={(e) => setInputs(prev => ({
                      ...prev,
                      companyInfo: { ...prev.companyInfo, name: e.target.value }
                    }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Industry</label>
                  <Input
                    value={inputs.companyInfo.industry}
                    onChange={(e) => setInputs(prev => ({
                      ...prev,
                      companyInfo: { ...prev.companyInfo, industry: e.target.value }
                    }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Operational Cycle</label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    value={inputs.companyInfo.operationalCycle}
                    onChange={(e) => setInputs(prev => ({
                      ...prev,
                      companyInfo: { ...prev.companyInfo, operationalCycle: e.target.value }
                    }))}
                  >
                    <option value="manufacturing">Manufacturing</option>
                    <option value="retail">Retail</option>
                    <option value="services">Services</option>
                    <option value="distribution">Distribution</option>
                    <option value="technology">Technology</option>
                  </select>
                </div>
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'position' && (
          <div className="space-y-6">
            {/* Accounts Receivable */}
            <Card className="p-4">
              <h4 className="font-medium mb-4">Accounts Receivable</h4>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Current Balance ($M)</label>
                  <Input
                    type="number"
                    value={inputs.currentPosition.accountsReceivable.currentBalance / 1000000}
                    onChange={(e) => setInputs(prev => ({
                      ...prev,
                      currentPosition: {
                        ...prev.currentPosition,
                        accountsReceivable: {
                          ...prev.currentPosition.accountsReceivable,
                          currentBalance: parseFloat(e.target.value) * 1000000
                        }
                      }
                    }))}
                    step="5"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Days Sales Outstanding</label>
                  <Input
                    type="number"
                    value={inputs.currentPosition.accountsReceivable.daysOutstanding}
                    onChange={(e) => setInputs(prev => ({
                      ...prev,
                      currentPosition: {
                        ...prev.currentPosition,
                        accountsReceivable: {
                          ...prev.currentPosition.accountsReceivable,
                          daysOutstanding: parseInt(e.target.value)
                        }
                      }
                    }))}
                    min="15"
                    max="120"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Bad Debt Rate (%)</label>
                  <Input
                    type="number"
                    value={inputs.currentPosition.accountsReceivable.badDebtRate * 100}
                    onChange={(e) => setInputs(prev => ({
                      ...prev,
                      currentPosition: {
                        ...prev.currentPosition,
                        accountsReceivable: {
                          ...prev.currentPosition.accountsReceivable,
                          badDebtRate: parseFloat(e.target.value) / 100
                        }
                      }
                    }))}
                    step="0.1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Collection Efficiency (%)</label>
                  <Input
                    type="number"
                    value={inputs.currentPosition.accountsReceivable.collectionEfficiency * 100}
                    onChange={(e) => setInputs(prev => ({
                      ...prev,
                      currentPosition: {
                        ...prev.currentPosition,
                        accountsReceivable: {
                          ...prev.currentPosition.accountsReceivable,
                          collectionEfficiency: parseFloat(e.target.value) / 100
                        }
                      }
                    }))}
                    step="1"
                    min="80"
                    max="100"
                  />
                </div>
              </div>
            </Card>

            {/* Inventory */}
            <Card className="p-4">
              <h4 className="font-medium mb-4">Inventory</h4>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Current Balance ($M)</label>
                  <Input
                    type="number"
                    value={inputs.currentPosition.inventory.currentBalance / 1000000}
                    onChange={(e) => setInputs(prev => ({
                      ...prev,
                      currentPosition: {
                        ...prev.currentPosition,
                        inventory: {
                          ...prev.currentPosition.inventory,
                          currentBalance: parseFloat(e.target.value) * 1000000
                        }
                      }
                    }))}
                    step="5"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Days Inventory Outstanding</label>
                  <Input
                    type="number"
                    value={inputs.currentPosition.inventory.daysOnHand}
                    onChange={(e) => setInputs(prev => ({
                      ...prev,
                      currentPosition: {
                        ...prev.currentPosition,
                        inventory: {
                          ...prev.currentPosition.inventory,
                          daysOnHand: parseInt(e.target.value)
                        }
                      }
                    }))}
                    min="15"
                    max="180"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Turnover Rate (x)</label>
                  <Input
                    type="number"
                    value={inputs.currentPosition.inventory.turnoverRate}
                    onChange={(e) => setInputs(prev => ({
                      ...prev,
                      currentPosition: {
                        ...prev.currentPosition,
                        inventory: {
                          ...prev.currentPosition.inventory,
                          turnoverRate: parseFloat(e.target.value)
                        }
                      }
                    }))}
                    step="0.1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Obsolescence Rate (%)</label>
                  <Input
                    type="number"
                    value={inputs.currentPosition.inventory.obsolescenceRate * 100}
                    onChange={(e) => setInputs(prev => ({
                      ...prev,
                      currentPosition: {
                        ...prev.currentPosition,
                        inventory: {
                          ...prev.currentPosition.inventory,
                          obsolescenceRate: parseFloat(e.target.value) / 100
                        }
                      }
                    }))}
                    step="0.1"
                  />
                </div>
              </div>
            </Card>

            {/* Accounts Payable */}
            <Card className="p-4">
              <h4 className="font-medium mb-4">Accounts Payable</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Current Balance ($M)</label>
                  <Input
                    type="number"
                    value={inputs.currentPosition.accountsPayable.currentBalance / 1000000}
                    onChange={(e) => setInputs(prev => ({
                      ...prev,
                      currentPosition: {
                        ...prev.currentPosition,
                        accountsPayable: {
                          ...prev.currentPosition.accountsPayable,
                          currentBalance: parseFloat(e.target.value) * 1000000
                        }
                      }
                    }))}
                    step="5"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Days Payable Outstanding</label>
                  <Input
                    type="number"
                    value={inputs.currentPosition.accountsPayable.daysOutstanding}
                    onChange={(e) => setInputs(prev => ({
                      ...prev,
                      currentPosition: {
                        ...prev.currentPosition,
                        accountsPayable: {
                          ...prev.currentPosition.accountsPayable,
                          daysOutstanding: parseInt(e.target.value)
                        }
                      }
                    }))}
                    min="15"
                    max="120"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Supplier Relationships</label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    value={inputs.currentPosition.accountsPayable.supplierRelationships}
                    onChange={(e) => setInputs(prev => ({
                      ...prev,
                      currentPosition: {
                        ...prev.currentPosition,
                        accountsPayable: {
                          ...prev.currentPosition.accountsPayable,
                          supplierRelationships: e.target.value
                        }
                      }
                    }))}
                  >
                    <option value="poor">Poor</option>
                    <option value="fair">Fair</option>
                    <option value="good">Good</option>
                    <option value="excellent">Excellent</option>
                  </select>
                </div>
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'optimization' && (
          <div className="space-y-6">
            {/* Optimization Targets */}
            <Card className="p-4">
              <h4 className="font-medium mb-4">Cash Conversion Cycle Optimization</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Target CCC (days)</label>
                  <Input
                    type="number"
                    value={inputs.optimizationTargets.cashConversionCycle.targetDays}
                    onChange={(e) => setInputs(prev => ({
                      ...prev,
                      optimizationTargets: {
                        ...prev.optimizationTargets,
                        cashConversionCycle: {
                          ...prev.optimizationTargets.cashConversionCycle,
                          targetDays: parseInt(e.target.value)
                        }
                      }
                    }))}
                    min="20"
                    max="120"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Improvement Timeline (quarters)</label>
                  <Input
                    type="number"
                    value={inputs.optimizationTargets.cashConversionCycle.improvementTimeline}
                    onChange={(e) => setInputs(prev => ({
                      ...prev,
                      optimizationTargets: {
                        ...prev.optimizationTargets,
                        cashConversionCycle: {
                          ...prev.optimizationTargets.cashConversionCycle,
                          improvementTimeline: parseInt(e.target.value)
                        }
                      }
                    }))}
                    min="2"
                    max="12"
                  />
                </div>
              </div>
            </Card>

            {/* Component Targets */}
            <Card className="p-4">
              <h4 className="font-medium mb-4">Component Optimization Targets</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Target DSO (days)</label>
                  <Input
                    type="number"
                    value={inputs.optimizationTargets.receivablesManagement.targetDSO}
                    onChange={(e) => setInputs(prev => ({
                      ...prev,
                      optimizationTargets: {
                        ...prev.optimizationTargets,
                        receivablesManagement: {
                          ...prev.optimizationTargets.receivablesManagement,
                          targetDSO: parseInt(e.target.value)
                        }
                      }
                    }))}
                    min="15"
                    max="90"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Target DIO (days)</label>
                  <Input
                    type="number"
                    value={inputs.optimizationTargets.inventoryManagement.targetDIO}
                    onChange={(e) => setInputs(prev => ({
                      ...prev,
                      optimizationTargets: {
                        ...prev.optimizationTargets,
                        inventoryManagement: {
                          ...prev.optimizationTargets.inventoryManagement,
                          targetDIO: parseInt(e.target.value)
                        }
                      }
                    }))}
                    min="15"
                    max="150"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Target DPO (days)</label>
                  <Input
                    type="number"
                    value={inputs.optimizationTargets.payablesManagement.targetDPO}
                    onChange={(e) => setInputs(prev => ({
                      ...prev,
                      optimizationTargets: {
                        ...prev.optimizationTargets,
                        payablesManagement: {
                          ...prev.optimizationTargets.payablesManagement,
                          targetDPO: parseInt(e.target.value)
                        }
                      }
                    }))}
                    min="15"
                    max="90"
                  />
                </div>
              </div>
            </Card>

            {/* Industry Benchmarks */}
            <Card className="p-4">
              <h4 className="font-medium mb-4">Industry Benchmarks</h4>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Median DSO</label>
                  <Input
                    type="number"
                    value={inputs.marketAssumptions.industryBenchmarks.medianDSO}
                    onChange={(e) => setInputs(prev => ({
                      ...prev,
                      marketAssumptions: {
                        ...prev.marketAssumptions,
                        industryBenchmarks: {
                          ...prev.marketAssumptions.industryBenchmarks,
                          medianDSO: parseInt(e.target.value)
                        }
                      }
                    }))}
                    min="20"
                    max="90"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Median DIO</label>
                  <Input
                    type="number"
                    value={inputs.marketAssumptions.industryBenchmarks.medianDIO}
                    onChange={(e) => setInputs(prev => ({
                      ...prev,
                      marketAssumptions: {
                        ...prev.marketAssumptions,
                        industryBenchmarks: {
                          ...prev.marketAssumptions.industryBenchmarks,
                          medianDIO: parseInt(e.target.value)
                        }
                      }
                    }))}
                    min="20"
                    max="120"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Median DPO</label>
                  <Input
                    type="number"
                    value={inputs.marketAssumptions.industryBenchmarks.medianDPO}
                    onChange={(e) => setInputs(prev => ({
                      ...prev,
                      marketAssumptions: {
                        ...prev.marketAssumptions,
                        industryBenchmarks: {
                          ...prev.marketAssumptions.industryBenchmarks,
                          medianDPO: parseInt(e.target.value)
                        }
                      }
                    }))}
                    min="20"
                    max="90"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Top Quartile CCC</label>
                  <Input
                    type="number"
                    value={inputs.marketAssumptions.industryBenchmarks.topQuartileCCC}
                    onChange={(e) => setInputs(prev => ({
                      ...prev,
                      marketAssumptions: {
                        ...prev.marketAssumptions,
                        industryBenchmarks: {
                          ...prev.marketAssumptions.industryBenchmarks,
                          topQuartileCCC: parseInt(e.target.value)
                        }
                      }
                    }))}
                    min="20"
                    max="80"
                  />
                </div>
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'results' && (
          <div className="space-y-6">
            {results ? (
              <>
                {/* Summary Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Card className="p-4">
                    <div className="text-center">
                      <div className="text-sm text-gray-600 mb-1">Current CCC</div>
                      <div className="text-2xl font-bold text-blue-600">{results.summary.currentCashConversionCycle} days</div>
                    </div>
                  </Card>
                  <Card className="p-4">
                    <div className="text-center">
                      <div className="text-sm text-gray-600 mb-1">Target CCC</div>
                      <div className="text-2xl font-bold text-green-600">{results.summary.targetCashConversionCycle} days</div>
                    </div>
                  </Card>
                  <Card className="p-4">
                    <div className="text-center">
                      <div className="text-sm text-gray-600 mb-1">Improvement</div>
                      <div className="text-2xl font-bold text-orange-600">{results.summary.potentialCCCImprovement} days</div>
                    </div>
                  </Card>
                  <Card className="p-4">
                    <div className="text-center">
                      <div className="text-sm text-gray-600 mb-1">Cash Impact</div>
                      <div className="text-2xl font-bold text-blue-600">${(results.summary.totalCashImpact / 1000000).toFixed(0)}M</div>
                    </div>
                  </Card>
                </div>

                {/* Optimization Analysis */}
                <Card className="p-4">
                  <h4 className="font-medium mb-4">Optimization Opportunities</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 border rounded-lg">
                      <h5 className="font-medium mb-2">Receivables Optimization</h5>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Current DSO:</span>
                          <span className="font-medium">{results.optimizationAnalysis.receivablesOptimization.currentDSO} days</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Target DSO:</span>
                          <span className="font-medium text-green-600">{results.optimizationAnalysis.receivablesOptimization.targetDSO} days</span>
                        </div>
                        <div className="text-sm text-blue-600">
                          Cash Impact: ${(results.optimizationAnalysis.receivablesOptimization.cashImpact / 1000000).toFixed(1)}M
                        </div>
                        <Progress value={75} className="h-2" />
                      </div>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <h5 className="font-medium mb-2">Inventory Optimization</h5>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Current DIO:</span>
                          <span className="font-medium">{results.optimizationAnalysis.inventoryOptimization.currentDIO} days</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Target DIO:</span>
                          <span className="font-medium text-green-600">{results.optimizationAnalysis.inventoryOptimization.targetDIO} days</span>
                        </div>
                        <div className="text-sm text-blue-600">
                          Cash Impact: ${(results.optimizationAnalysis.inventoryOptimization.cashImpact / 1000000).toFixed(1)}M
                        </div>
                        <Progress value={80} className="h-2" />
                      </div>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <h5 className="font-medium mb-2">Payables Optimization</h5>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Current DPO:</span>
                          <span className="font-medium">{results.optimizationAnalysis.payablesOptimization.currentDPO} days</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Target DPO:</span>
                          <span className="font-medium text-green-600">{results.optimizationAnalysis.payablesOptimization.targetDPO} days</span>
                        </div>
                        <div className="text-sm text-blue-600">
                          Cash Impact: ${(results.optimizationAnalysis.payablesOptimization.cashImpact / 1000000).toFixed(1)}M
                        </div>
                        <Progress value={65} className="h-2" />
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Key Insights */}
                <Card className="p-4">
                  <h4 className="font-medium mb-4">Key Insights & Recommendations</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h5 className="font-medium mb-2">Working Capital Insights:</h5>
                      <div className="flex flex-wrap gap-2">
                        {results.keyInsights.workingCapitalInsights.map((insight, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {insight}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h5 className="font-medium mb-2">Quick Wins:</h5>
                      <div className="flex flex-wrap gap-2">
                        {results.keyInsights.quickWins.map((win, index) => (
                          <Badge key={index} variant="outline" className="text-xs bg-green-50 text-green-700">
                            {win}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              </>
            ) : (
              <div className="text-center py-12">
                <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Analysis Results</h3>
                <p className="text-gray-500 mb-6">Run the working capital analysis to see optimization opportunities</p>
              </div>
            )}
          </div>
        )}

        {/* Analysis Button */}
        <div className="flex justify-end pt-4 border-t">
          <Button 
            onClick={runAnalysis} 
            disabled={loading}
            className="px-6"
          >
            {loading ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Running Analysis...
              </>
            ) : (
              <>
                <Calculator className="h-4 w-4 mr-2" />
                Run Working Capital Analysis
              </>
            )}
          </Button>
        </div>

        {mode !== 'traditional' && (
          <Card className="p-4 bg-blue-50 border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-900">AI Assistant</span>
            </div>
            <p className="text-sm text-blue-800">
              AI can analyze your working capital position and suggest optimization strategies based on industry benchmarks and cash flow patterns.
            </p>
          </Card>
        )}
      </CardContent>
    </Card>
  );
};

export default WorkingCapitalCard;