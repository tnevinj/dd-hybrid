'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { 
  Calculator, 
  TrendingUp, 
  Activity, 
  DollarSign, 
  Target, 
  AlertCircle,
  CheckCircle,
  BarChart3,
  PieChart,
  Zap,
  Shield,
  Clock
} from 'lucide-react';

interface RevenueParticipationCardProps {
  dealId: string;
  mode?: 'traditional' | 'assisted' | 'autonomous';
  onResultsChange?: (results: any) => void;
}

interface RPRStructure {
  id: string;
  name: string;
  description: string;
  participationRate: number;
  revenueBase: 'gross' | 'net' | 'recurring' | 'product_specific';
  returnCap: {
    enabled: boolean;
    capMultiple: number;
    capAmount: number;
  };
  returnFloor: {
    enabled: boolean;
    floorRate: number;
    guaranteedAmount: number;
  };
  revenueHurdle: {
    enabled: boolean;
    hurdleAmount: number;
    catchUpRate: number;
  };
  termStructure: {
    initialTerm: number;
    extensionOptions: {
      numberOfExtensions: number;
      extensionPeriod: number;
      extensionConditions: string[];
    };
    earlyTermination: {
      enabled: boolean;
      buyoutMultiple: number;
      noticePeriod: number;
    };
  };
  adjustments: {
    stepDownSchedule: {
      enabled: boolean;
      stepDowns: Array<{
        year: number;
        newParticipationRate: number;
      }>;
    };
    performanceAdjustments: {
      enabled: boolean;
      triggers: Array<{
        revenueGrowthThreshold: number;
        adjustmentFactor: number;
      }>;
    };
  };
  riskProtections: {
    diligenceRights: boolean;
    informationRights: boolean;
    concentrationLimits: {
      enabled: boolean;
      maxCustomerConcentration: number;
      maxProductConcentration: number;
    };
    keyMetricCovenants: {
      enabled: boolean;
      covenants: Array<{
        metric: string;
        threshold: number;
        consequence: string;
      }>;
    };
  };
}

interface RPRAnalysisInputs {
  rprStructure: RPRStructure;
  companyProjections: {
    id: string;
    name: string;
    projectionYears: number;
    baseCase: {
      revenueProjections: number[];
      revenueGrowthRates: number[];
      revenueBreakdown: {
        recurring: number[];
        transactional: number[];
        product: number[];
        services: number[];
      };
      keyMetrics: {
        customerAcquisitionCost: number[];
        customerLifetimeValue: number[];
        churnRate: number[];
        grossMargin: number[];
      };
    };
    scenarios: {
      upside: {
        revenueProjections: number[];
        probability: number;
      };
      downside: {
        revenueProjections: number[];
        probability: number;
      };
      stress: {
        revenueProjections: number[];
        probability: number;
      };
    };
    riskFactors: {
      revenueVolatility: number;
      customerConcentration: number;
      industryRisk: 'low' | 'medium' | 'high';
      competitivePosition: 'weak' | 'moderate' | 'strong';
    };
  };
  investmentTerms: {
    initialInvestment: number;
    closingDate: Date;
    baseCurrency: string;
  };
  discountRate: number;
  analysisSettings: {
    includeScenarios: boolean;
    simulationRuns: number;
    riskAdjustment: boolean;
    sensitivityAnalysis: boolean;
  };
}

const RevenueParticipationCard: React.FC<RevenueParticipationCardProps> = ({ 
  dealId, 
  mode = 'traditional',
  onResultsChange 
}) => {
  const [activeTab, setActiveTab] = useState<'structure' | 'projections' | 'results' | 'insights'>('structure');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const [inputs, setInputs] = useState<RPRAnalysisInputs>({
    rprStructure: {
      id: 'rpr-1',
      name: 'SaaS Revenue Participation Rights',
      description: 'Revenue-based investment in high-growth SaaS company',
      participationRate: 0.02, // 2% of revenue
      revenueBase: 'recurring',
      returnCap: {
        enabled: true,
        capMultiple: 3.0,
        capAmount: 30000000
      },
      returnFloor: {
        enabled: true,
        floorRate: 0.08,
        guaranteedAmount: 800000
      },
      revenueHurdle: {
        enabled: true,
        hurdleAmount: 10000000,
        catchUpRate: 0.04
      },
      termStructure: {
        initialTerm: 7,
        extensionOptions: {
          numberOfExtensions: 1,
          extensionPeriod: 2,
          extensionConditions: ['Revenue growth > 20%', 'Company remains private']
        },
        earlyTermination: {
          enabled: true,
          buyoutMultiple: 2.5,
          noticePeriod: 6
        }
      },
      adjustments: {
        stepDownSchedule: {
          enabled: true,
          stepDowns: [
            { year: 3, newParticipationRate: 0.018 },
            { year: 5, newParticipationRate: 0.015 }
          ]
        },
        performanceAdjustments: {
          enabled: true,
          triggers: [
            { revenueGrowthThreshold: 0.30, adjustmentFactor: 1.2 },
            { revenueGrowthThreshold: 0.50, adjustmentFactor: 1.5 }
          ]
        }
      },
      riskProtections: {
        diligenceRights: true,
        informationRights: true,
        concentrationLimits: {
          enabled: true,
          maxCustomerConcentration: 0.25,
          maxProductConcentration: 0.40
        },
        keyMetricCovenants: {
          enabled: true,
          covenants: [
            { metric: 'Gross Revenue Retention', threshold: 0.95, consequence: 'increased_rate' },
            { metric: 'Net Revenue Retention', threshold: 1.10, consequence: 'increased_rate' }
          ]
        }
      }
    },
    companyProjections: {
      id: 'company-1',
      name: 'High-Growth SaaS Company',
      projectionYears: 7,
      baseCase: {
        revenueProjections: [50000000, 70000000, 98000000, 127000000, 152000000, 182000000, 218000000],
        revenueGrowthRates: [0.40, 0.40, 0.30, 0.20, 0.20, 0.20, 0.20],
        revenueBreakdown: {
          recurring: [45000000, 63000000, 88200000, 114300000, 136800000, 163800000, 196200000],
          transactional: [5000000, 7000000, 9800000, 12700000, 15200000, 18200000, 21800000],
          product: [40000000, 56000000, 78400000, 101600000, 121600000, 145600000, 174400000],
          services: [10000000, 14000000, 19600000, 25400000, 30400000, 36400000, 43600000]
        },
        keyMetrics: {
          customerAcquisitionCost: [5000, 4800, 4500, 4200, 4000, 3800, 3600],
          customerLifetimeValue: [50000, 55000, 60000, 65000, 70000, 75000, 80000],
          churnRate: [0.05, 0.04, 0.035, 0.03, 0.025, 0.02, 0.02],
          grossMargin: [0.80, 0.82, 0.84, 0.85, 0.86, 0.87, 0.88]
        }
      },
      scenarios: {
        upside: {
          revenueProjections: [55000000, 82500000, 123750000, 173250000, 224250000, 291250000, 378625000],
          probability: 0.25
        },
        downside: {
          revenueProjections: [45000000, 58500000, 73125000, 87750000, 96525000, 106175000, 116790000],
          probability: 0.25
        },
        stress: {
          revenueProjections: [40000000, 48000000, 52800000, 55440000, 55440000, 52668000, 47401200],
          probability: 0.10
        }
      },
      riskFactors: {
        revenueVolatility: 0.25,
        customerConcentration: 0.15,
        industryRisk: 'medium',
        competitivePosition: 'strong'
      }
    },
    investmentTerms: {
      initialInvestment: 10000000,
      closingDate: new Date(),
      baseCurrency: 'USD'
    },
    discountRate: 0.12,
    analysisSettings: {
      includeScenarios: true,
      simulationRuns: 1000,
      riskAdjustment: true,
      sensitivityAnalysis: true
    }
  });

  const runAnalysis = async () => {
    setLoading(true);
    setError(null);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const mockResults = {
        investmentSummary: {
          totalCashReturns: inputs.investmentTerms.initialInvestment * 2.8,
          returnMultiple: 2.8,
          irr: 0.235,
          npv: inputs.investmentTerms.initialInvestment * 1.45
        },
        annualAnalysis: inputs.companyProjections.baseCase.revenueProjections.map((revenue, index) => {
          const effectiveRate = inputs.rprStructure.participationRate * 
            (inputs.rprStructure.adjustments.stepDownSchedule.enabled && index >= 3 ? 0.9 : 1);
          const cashFlow = revenue * effectiveRate;
          const cumulativeCashFlow = inputs.companyProjections.baseCase.revenueProjections
            .slice(0, index + 1)
            .reduce((sum, rev, i) => sum + (rev * (i >= 3 ? effectiveRate : inputs.rprStructure.participationRate)), 0);
          
          return {
            year: index + 1,
            companyRevenue: revenue,
            effectiveParticipationRate: effectiveRate,
            cashFlow,
            cumulativeCashFlow
          };
        }),
        scenarioAnalysis: {
          baseCase: {
            irr: 0.235,
            returnMultiple: 2.8,
            totalReturns: inputs.investmentTerms.initialInvestment * 2.8
          },
          upside: {
            irr: 0.385,
            returnMultiple: 4.2,
            totalReturns: inputs.investmentTerms.initialInvestment * 4.2
          },
          downside: {
            irr: 0.145,
            returnMultiple: 1.8,
            totalReturns: inputs.investmentTerms.initialInvestment * 1.8
          }
        },
        constraintAnalysis: {
          returnCapTriggered: true,
          capTriggerYear: 6,
          floorProtectionUsed: false,
          hurdleImpact: {
            years: 2,
            totalImpact: 500000
          }
        },
        riskAnalysis: {
          revenueVolatility: inputs.companyProjections.riskFactors.revenueVolatility,
          downsideRisk: 0.18,
          stressTestResults: {
            worstCase10Percentile: 1.2,
            averageDownside: 1.6
          }
        },
        performanceDrivers: [
          { driver: 'Revenue Growth Rate', impactOnIRR: 0.085, sensitivity: 'high' },
          { driver: 'Revenue Retention', impactOnIRR: 0.065, sensitivity: 'high' },
          { driver: 'Customer Concentration', impactOnIRR: -0.025, sensitivity: 'medium' },
          { driver: 'Market Expansion', impactOnIRR: 0.045, sensitivity: 'medium' }
        ],
        insights: [
          'Revenue participation rate provides balanced upside exposure with downside protection',
          'Step-down schedule optimizes investor returns while maintaining company cash flow in later years',
          'Return cap triggered in base case, suggesting strong revenue growth potential',
          'Floor protection provides meaningful downside protection in stress scenarios'
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
      case 'structure':
        return (
          <div className="space-y-6">
            <div>
              <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Target className="h-5 w-5" />
                RPR Structure Terms
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Investment Name</label>
                  <Input
                    value={inputs.rprStructure.name}
                    onChange={(e) => setInputs(prev => ({
                      ...prev,
                      rprStructure: { ...prev.rprStructure, name: e.target.value }
                    }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Revenue Base</label>
                  <select
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={inputs.rprStructure.revenueBase}
                    onChange={(e) => setInputs(prev => ({
                      ...prev,
                      rprStructure: { ...prev.rprStructure, revenueBase: e.target.value as any }
                    }))}
                  >
                    <option value="gross">Gross Revenue</option>
                    <option value="net">Net Revenue</option>
                    <option value="recurring">Recurring Revenue</option>
                    <option value="product_specific">Product-Specific</option>
                  </select>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Core Participation Terms
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Participation Rate (%)</label>
                  <Input
                    type="number"
                    step="0.1"
                    value={inputs.rprStructure.participationRate * 100}
                    onChange={(e) => setInputs(prev => ({
                      ...prev,
                      rprStructure: { ...prev.rprStructure, participationRate: parseFloat(e.target.value) / 100 }
                    }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Initial Investment ($M)</label>
                  <Input
                    type="number"
                    value={inputs.investmentTerms.initialInvestment / 1000000}
                    onChange={(e) => setInputs(prev => ({
                      ...prev,
                      investmentTerms: { ...prev.investmentTerms, initialInvestment: parseFloat(e.target.value) * 1000000 }
                    }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Term (Years)</label>
                  <Input
                    type="number"
                    min="1"
                    max="15"
                    value={inputs.rprStructure.termStructure.initialTerm}
                    onChange={(e) => setInputs(prev => ({
                      ...prev,
                      rprStructure: {
                        ...prev.rprStructure,
                        termStructure: { ...prev.rprStructure.termStructure, initialTerm: parseInt(e.target.value) }
                      }
                    }))}
                  />
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Return Constraints
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <input
                      type="checkbox"
                      checked={inputs.rprStructure.returnCap?.enabled || false}
                      onChange={(e) => setInputs(prev => ({
                        ...prev,
                        rprStructure: {
                          ...prev.rprStructure,
                          returnCap: { ...prev.rprStructure.returnCap, enabled: e.target.checked }
                        }
                      }))}
                    />
                    <label className="text-sm font-medium">Return Cap</label>
                  </div>
                  {inputs.rprStructure.returnCap?.enabled && (
                    <div>
                      <label className="block text-sm font-medium mb-1">Cap Multiple (x)</label>
                      <Input
                        type="number"
                        step="0.5"
                        value={inputs.rprStructure.returnCap?.capMultiple || 3}
                        onChange={(e) => setInputs(prev => ({
                          ...prev,
                          rprStructure: {
                            ...prev.rprStructure,
                            returnCap: { ...prev.rprStructure.returnCap, capMultiple: parseFloat(e.target.value) }
                          }
                        }))}
                      />
                    </div>
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <input
                      type="checkbox"
                      checked={inputs.rprStructure.returnFloor?.enabled || false}
                      onChange={(e) => setInputs(prev => ({
                        ...prev,
                        rprStructure: {
                          ...prev.rprStructure,
                          returnFloor: { ...prev.rprStructure.returnFloor, enabled: e.target.checked }
                        }
                      }))}
                    />
                    <label className="text-sm font-medium">Return Floor</label>
                  </div>
                  {inputs.rprStructure.returnFloor?.enabled && (
                    <div>
                      <label className="block text-sm font-medium mb-1">Floor Rate (%)</label>
                      <Input
                        type="number"
                        step="0.5"
                        value={(inputs.rprStructure.returnFloor?.floorRate || 0) * 100}
                        onChange={(e) => setInputs(prev => ({
                          ...prev,
                          rprStructure: {
                            ...prev.rprStructure,
                            returnFloor: { ...prev.rprStructure.returnFloor, floorRate: parseFloat(e.target.value) / 100 }
                          }
                        }))}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Revenue Hurdle
              </h4>
              <div className="flex items-center gap-2 mb-3">
                <input
                  type="checkbox"
                  checked={inputs.rprStructure.revenueHurdle?.enabled || false}
                  onChange={(e) => setInputs(prev => ({
                    ...prev,
                    rprStructure: {
                      ...prev.rprStructure,
                      revenueHurdle: { ...prev.rprStructure.revenueHurdle, enabled: e.target.checked }
                    }
                  }))}
                />
                <label className="text-sm font-medium">Enable Revenue Hurdle</label>
              </div>
              {inputs.rprStructure.revenueHurdle?.enabled && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Hurdle Amount ($M)</label>
                    <Input
                      type="number"
                      value={(inputs.rprStructure.revenueHurdle?.hurdleAmount || 0) / 1000000}
                      onChange={(e) => setInputs(prev => ({
                        ...prev,
                        rprStructure: {
                          ...prev.rprStructure,
                          revenueHurdle: { 
                            ...prev.rprStructure.revenueHurdle, 
                            hurdleAmount: parseFloat(e.target.value) * 1000000 
                          }
                        }
                      }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Catch-Up Rate (%)</label>
                    <Input
                      type="number"
                      step="0.1"
                      value={(inputs.rprStructure.revenueHurdle?.catchUpRate || 0) * 100}
                      onChange={(e) => setInputs(prev => ({
                        ...prev,
                        rprStructure: {
                          ...prev.rprStructure,
                          revenueHurdle: { 
                            ...prev.rprStructure.revenueHurdle, 
                            catchUpRate: parseFloat(e.target.value) / 100 
                          }
                        }
                      }))}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      case 'projections':
        return (
          <div className="space-y-6">
            <div>
              <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Company Revenue Projections
              </h4>
              <div className="mb-4">
                <p className="text-sm text-gray-600">Base Case Revenue Projections ($M)</p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
                {inputs.companyProjections.baseCase.revenueProjections.map((revenue, index) => (
                  <div key={index}>
                    <label className="block text-xs font-medium mb-1">Year {index + 1}</label>
                    <Input
                      type="number"
                      value={revenue / 1000000}
                      onChange={(e) => {
                        const newProjections = [...inputs.companyProjections.baseCase.revenueProjections];
                        newProjections[index] = parseFloat(e.target.value) * 1000000;
                        setInputs(prev => ({
                          ...prev,
                          companyProjections: {
                            ...prev.companyProjections,
                            baseCase: {
                              ...prev.companyProjections.baseCase,
                              revenueProjections: newProjections
                            }
                          }
                        }));
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Revenue Growth Rates (%)</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
                {inputs.companyProjections.baseCase.revenueGrowthRates.map((growth, index) => (
                  <div key={index}>
                    <label className="block text-xs font-medium mb-1">Year {index + 1}</label>
                    <Input
                      type="number"
                      value={growth * 100}
                      onChange={(e) => {
                        const newGrowthRates = [...inputs.companyProjections.baseCase.revenueGrowthRates];
                        newGrowthRates[index] = parseFloat(e.target.value) / 100;
                        setInputs(prev => ({
                          ...prev,
                          companyProjections: {
                            ...prev.companyProjections,
                            baseCase: {
                              ...prev.companyProjections.baseCase,
                              revenueGrowthRates: newGrowthRates
                            }
                          }
                        }));
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <PieChart className="h-5 w-5" />
                Scenario Analysis
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Upside Case Year 5 Revenue ($M)</label>
                  <Input
                    type="number"
                    value={inputs.companyProjections.scenarios.upside.revenueProjections[4] / 1000000}
                    onChange={(e) => {
                      const newProjections = [...inputs.companyProjections.scenarios.upside.revenueProjections];
                      newProjections[4] = parseFloat(e.target.value) * 1000000;
                      setInputs(prev => ({
                        ...prev,
                        companyProjections: {
                          ...prev.companyProjections,
                          scenarios: {
                            ...prev.companyProjections.scenarios,
                            upside: {
                              ...prev.companyProjections.scenarios.upside,
                              revenueProjections: newProjections
                            }
                          }
                        }
                      }));
                    }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Downside Case Year 5 Revenue ($M)</label>
                  <Input
                    type="number"
                    value={inputs.companyProjections.scenarios.downside.revenueProjections[4] / 1000000}
                    onChange={(e) => {
                      const newProjections = [...inputs.companyProjections.scenarios.downside.revenueProjections];
                      newProjections[4] = parseFloat(e.target.value) * 1000000;
                      setInputs(prev => ({
                        ...prev,
                        companyProjections: {
                          ...prev.companyProjections,
                          scenarios: {
                            ...prev.companyProjections.scenarios,
                            downside: {
                              ...prev.companyProjections.scenarios.downside,
                              revenueProjections: newProjections
                            }
                          }
                        }
                      }));
                    }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Discount Rate (%)</label>
                  <Input
                    type="number"
                    step="0.5"
                    value={inputs.discountRate * 100}
                    onChange={(e) => setInputs(prev => ({
                      ...prev,
                      discountRate: parseFloat(e.target.value) / 100
                    }))}
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 'results':
        if (!results) {
          return (
            <div className="text-center py-8 text-gray-500">
              <Activity className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p>Run analysis to see revenue participation results</p>
            </div>
          );
        }

        return (
          <div className="space-y-6">
            <div>
              <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Investment Returns Summary
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-sm text-gray-600 mb-1">Total Cash Returns</div>
                    <div className="text-2xl font-bold text-blue-600">
                      ${(results.investmentSummary.totalCashReturns / 1000000).toFixed(1)}M
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-sm text-gray-600 mb-1">Return Multiple</div>
                    <div className="text-2xl font-bold text-green-600">
                      {results.investmentSummary.returnMultiple.toFixed(2)}x
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-sm text-gray-600 mb-1">IRR</div>
                    <div className="text-2xl font-bold text-blue-600">
                      {(results.investmentSummary.irr * 100).toFixed(1)}%
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-sm text-gray-600 mb-1">NPV</div>
                    <div className="text-2xl font-bold text-orange-600">
                      ${(results.investmentSummary.npv / 1000000).toFixed(1)}M
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Projected Annual Cash Flows
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-300 px-4 py-2 text-left">Year</th>
                      <th className="border border-gray-300 px-4 py-2 text-right">Company Revenue ($M)</th>
                      <th className="border border-gray-300 px-4 py-2 text-right">RPR Rate (%)</th>
                      <th className="border border-gray-300 px-4 py-2 text-right">Cash Flow ($M)</th>
                      <th className="border border-gray-300 px-4 py-2 text-right">Cumulative ($M)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.annualAnalysis.map((year: any, index: number) => (
                      <tr key={index}>
                        <td className="border border-gray-300 px-4 py-2">{year.year}</td>
                        <td className="border border-gray-300 px-4 py-2 text-right">${(year.companyRevenue / 1000000).toFixed(1)}</td>
                        <td className="border border-gray-300 px-4 py-2 text-right">{(year.effectiveParticipationRate * 100).toFixed(2)}%</td>
                        <td className="border border-gray-300 px-4 py-2 text-right">${(year.cashFlow / 1000000).toFixed(2)}</td>
                        <td className="border border-gray-300 px-4 py-2 text-right">${(year.cumulativeCashFlow / 1000000).toFixed(1)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Scenario Analysis</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-sm text-gray-600 mb-1">Base Case</div>
                    <div className="text-xl font-bold">{(results.scenarioAnalysis.baseCase.irr * 100).toFixed(1)}% IRR</div>
                    <Badge variant="outline" className="mt-2">
                      {results.scenarioAnalysis.baseCase.returnMultiple.toFixed(2)}x Multiple
                    </Badge>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-sm text-gray-600 mb-1">Upside Case</div>
                    <div className="text-xl font-bold text-green-600">{(results.scenarioAnalysis.upside.irr * 100).toFixed(1)}% IRR</div>
                    <Badge variant="outline" className="mt-2 border-green-500 text-green-700">
                      {results.scenarioAnalysis.upside.returnMultiple.toFixed(2)}x Multiple
                    </Badge>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-sm text-gray-600 mb-1">Downside Case</div>
                    <div className="text-xl font-bold text-orange-600">{(results.scenarioAnalysis.downside.irr * 100).toFixed(1)}% IRR</div>
                    <Badge variant="outline" className="mt-2 border-orange-500 text-orange-700">
                      {results.scenarioAnalysis.downside.returnMultiple.toFixed(2)}x Multiple
                    </Badge>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        );

      case 'insights':
        if (!results) {
          return (
            <div className="text-center py-8 text-gray-500">
              <Zap className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p>Run analysis to see insights and recommendations</p>
            </div>
          );
        }

        return (
          <div className="space-y-6">
            <div>
              <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Risk & Constraint Analysis
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-sm text-gray-600 mb-1">Return Cap Impact</div>
                    <div className="text-xl font-bold">
                      {results.constraintAnalysis.returnCapTriggered ? 'Triggered' : 'Not Triggered'}
                    </div>
                    {results.constraintAnalysis.returnCapTriggered && (
                      <div className="text-xs text-orange-600 mt-1">
                        Cap hit in Year {results.constraintAnalysis.capTriggerYear}
                      </div>
                    )}
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-sm text-gray-600 mb-1">Floor Protection</div>
                    <div className="text-xl font-bold">
                      {results.constraintAnalysis.floorProtectionUsed ? 'Activated' : 'Not Needed'}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-sm text-gray-600 mb-1">Revenue Volatility</div>
                    <div className="text-xl font-bold">
                      {(results.riskAnalysis.revenueVolatility * 100).toFixed(1)}%
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-sm text-gray-600 mb-1">Downside Risk</div>
                    <div className="text-xl font-bold">
                      {(results.riskAnalysis.downsideRisk * 100).toFixed(1)}%
                    </div>
                    <Progress value={results.riskAnalysis.downsideRisk * 100} className="mt-2" />
                  </CardContent>
                </Card>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Key Performance Drivers
              </h4>
              <div className="flex flex-wrap gap-2">
                {results.performanceDrivers.map((driver: any, index: number) => (
                  <Badge key={index} variant="outline" className="px-3 py-2">
                    {driver.driver}: {(driver.impactOnIRR * 100).toFixed(1)}% IRR impact
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Key Insights & Recommendations
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

            {mode !== 'traditional' && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h5 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  AI-Enhanced RPR Analysis
                </h5>
                <p className="text-blue-800 text-sm">
                  Advanced revenue modeling algorithms have analyzed cash flow patterns, growth trajectories, and risk factors 
                  to optimize participation rates and structure terms. Consider dynamic adjustment mechanisms for enhanced performance.
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
              <h3 className="text-xl font-semibold">Revenue Participation Rights (RPR)</h3>
              <p className="text-sm text-gray-600">Revenue-based investment with caps, floors, hurdles, and performance adjustments</p>
            </div>
          </div>
          <Badge variant="outline">v0.5.0</Badge>
        </div>
      </CardHeader>

      <CardContent>
        <div className="flex border-b mb-6">
          {[
            { id: 'structure', label: 'Structure', icon: Target },
            { id: 'projections', label: 'Projections', icon: TrendingUp },
            { id: 'results', label: 'Results', icon: BarChart3 },
            { id: 'insights', label: 'Insights', icon: Zap }
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

        {(activeTab === 'structure' || activeTab === 'projections') && (
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
                  Run RPR Analysis
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

export default RevenueParticipationCard;