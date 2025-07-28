'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { 
  FileSpreadsheet,
  TrendingUp,
  Calculator,
  Download,
  AlertCircle,
  CheckCircle,
  Zap,
  BarChart3,
  DollarSign,
  Target,
  Activity,
  PieChart,
  Briefcase,
  TrendingDown
} from 'lucide-react';

interface FinancialStatementsCardProps {
  dealId: string;
  mode?: string;
  onResultsChange?: (results: any) => void;
}

interface ProjectionSummary {
  revenueCAGR: number;
  ebitdaCAGR: number;
  averageROE: number;
  peakNetDebtToEbitda: number;
  minimumLiquidity: number;
}

interface IncomeStatement {
  revenue: number;
  revenueGrowth: number;
  ebitda: number;
  ebitdaMargin: number;
  netIncome: number;
  netMargin: number;
}

interface KeyRatios {
  profitability: {
    returnOnEquity: number;
    returnOnInvestedCapital: number;
  };
  liquidity: {
    currentRatio: number;
  };
  leverage: {
    netDebtToEbitda: number;
    interestCoverageRatio: number;
  };
}

interface ProjectedPeriod {
  period: string;
  incomeStatement: IncomeStatement;
  keyRatios: KeyRatios;
}

interface ScenarioResult {
  finalPeriodRevenue: number;
  finalPeriodEbitda: number;
}

interface ScenarioAnalysis {
  baseCase: ScenarioResult;
  upside: ScenarioResult;
  downside: ScenarioResult;
  stress: ScenarioResult;
}

interface FinancialStatementResults {
  projectionSummary: ProjectionSummary;
  projectedPeriods: ProjectedPeriod[];
  scenarioAnalysis?: ScenarioAnalysis;
  keyInsights: {
    operationalInsights: string[];
    financialPerformanceInsights: string[];
    recommendations: {
      immediate: string[];
      strategic: string[];
    };
  };
}

const FinancialStatementsCard: React.FC<FinancialStatementsCardProps> = ({ 
  dealId, 
  mode = 'traditional',
  onResultsChange 
}) => {
  const [inputs, setInputs] = useState({
    companyName: 'Target Company',
    industry: 'Technology',
    projectionYears: 5,
    baseRevenue: 1000,
    revenueGrowthRates: [15, 12, 10, 8, 6],
    ebitdaMargins: [25, 26, 27, 28, 29],
    capexPercentages: [5.0, 4.5, 4.0, 3.5, 3.0],
    taxRate: 25,
    debtAmount: 500,
    interestRate: 6.5,
    workingCapitalDays: {
      receivables: 45,
      inventory: 50,
      payables: 55
    }
  });

  const [results, setResults] = useState<FinancialStatementResults | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [activeTab, setActiveTab] = useState('inputs');

  const runAnalysis = () => {
    setIsCalculating(true);
    
    setTimeout(() => {
      // Mock financial statement analysis results
      const analysisResults: FinancialStatementResults = {
        projectionSummary: {
          revenueCAGR: 0.102,
          ebitdaCAGR: 0.125,
          averageROE: 0.18,
          peakNetDebtToEbitda: 3.2,
          minimumLiquidity: 75000000
        },
        projectedPeriods: [
          {
            period: 'Year 1',
            incomeStatement: {
              revenue: inputs.baseRevenue * 1000000 * (1 + inputs.revenueGrowthRates[0]/100),
              revenueGrowth: inputs.revenueGrowthRates[0]/100,
              ebitda: inputs.baseRevenue * 1000000 * (1 + inputs.revenueGrowthRates[0]/100) * (inputs.ebitdaMargins[0]/100),
              ebitdaMargin: inputs.ebitdaMargins[0]/100,
              netIncome: inputs.baseRevenue * 1000000 * (1 + inputs.revenueGrowthRates[0]/100) * (inputs.ebitdaMargins[0]/100) * 0.65,
              netMargin: (inputs.ebitdaMargins[0]/100) * 0.65
            },
            keyRatios: {
              profitability: {
                returnOnEquity: 0.185,
                returnOnInvestedCapital: 0.142
              },
              liquidity: {
                currentRatio: 1.8
              },
              leverage: {
                netDebtToEbitda: 3.1,
                interestCoverageRatio: 4.2
              }
            }
          },
          {
            period: 'Year 2',
            incomeStatement: {
              revenue: inputs.baseRevenue * 1000000 * (1 + inputs.revenueGrowthRates[0]/100) * (1 + inputs.revenueGrowthRates[1]/100),
              revenueGrowth: inputs.revenueGrowthRates[1]/100,
              ebitda: inputs.baseRevenue * 1000000 * (1 + inputs.revenueGrowthRates[0]/100) * (1 + inputs.revenueGrowthRates[1]/100) * (inputs.ebitdaMargins[1]/100),
              ebitdaMargin: inputs.ebitdaMargins[1]/100,
              netIncome: inputs.baseRevenue * 1000000 * (1 + inputs.revenueGrowthRates[0]/100) * (1 + inputs.revenueGrowthRates[1]/100) * (inputs.ebitdaMargins[1]/100) * 0.67,
              netMargin: (inputs.ebitdaMargins[1]/100) * 0.67
            },
            keyRatios: {
              profitability: {
                returnOnEquity: 0.195,
                returnOnInvestedCapital: 0.155
              },
              liquidity: {
                currentRatio: 1.9
              },
              leverage: {
                netDebtToEbitda: 2.8,
                interestCoverageRatio: 4.6
              }
            }
          },
          {
            period: 'Year 3',
            incomeStatement: {
              revenue: inputs.baseRevenue * 1000000 * Math.pow(1.115, 3),
              revenueGrowth: inputs.revenueGrowthRates[2]/100,
              ebitda: inputs.baseRevenue * 1000000 * Math.pow(1.115, 3) * (inputs.ebitdaMargins[2]/100),
              ebitdaMargin: inputs.ebitdaMargins[2]/100,
              netIncome: inputs.baseRevenue * 1000000 * Math.pow(1.115, 3) * (inputs.ebitdaMargins[2]/100) * 0.68,
              netMargin: (inputs.ebitdaMargins[2]/100) * 0.68
            },
            keyRatios: {
              profitability: {
                returnOnEquity: 0.18,
                returnOnInvestedCapital: 0.165
              },
              liquidity: {
                currentRatio: 2.1
              },
              leverage: {
                netDebtToEbitda: 2.5,
                interestCoverageRatio: 5.1
              }
            }
          },
          {
            period: 'Year 4',
            incomeStatement: {
              revenue: inputs.baseRevenue * 1000000 * Math.pow(1.1, 4),
              revenueGrowth: inputs.revenueGrowthRates[3]/100,
              ebitda: inputs.baseRevenue * 1000000 * Math.pow(1.1, 4) * (inputs.ebitdaMargins[3]/100),
              ebitdaMargin: inputs.ebitdaMargins[3]/100,
              netIncome: inputs.baseRevenue * 1000000 * Math.pow(1.1, 4) * (inputs.ebitdaMargins[3]/100) * 0.70,
              netMargin: (inputs.ebitdaMargins[3]/100) * 0.70
            },
            keyRatios: {
              profitability: {
                returnOnEquity: 0.175,
                returnOnInvestedCapital: 0.172
              },
              liquidity: {
                currentRatio: 2.2
              },
              leverage: {
                netDebtToEbitda: 2.3,
                interestCoverageRatio: 5.5
              }
            }
          },
          {
            period: 'Year 5',
            incomeStatement: {
              revenue: inputs.baseRevenue * 1000000 * Math.pow(1.08, 5),
              revenueGrowth: inputs.revenueGrowthRates[4]/100,
              ebitda: inputs.baseRevenue * 1000000 * Math.pow(1.08, 5) * (inputs.ebitdaMargins[4]/100),
              ebitdaMargin: inputs.ebitdaMargins[4]/100,
              netIncome: inputs.baseRevenue * 1000000 * Math.pow(1.08, 5) * (inputs.ebitdaMargins[4]/100) * 0.72,
              netMargin: (inputs.ebitdaMargins[4]/100) * 0.72
            },
            keyRatios: {
              profitability: {
                returnOnEquity: 0.17,
                returnOnInvestedCapital: 0.178
              },
              liquidity: {
                currentRatio: 2.4
              },
              leverage: {
                netDebtToEbitda: 2.1,
                interestCoverageRatio: 6.0
              }
            }
          }
        ],
        scenarioAnalysis: {
          baseCase: {
            finalPeriodRevenue: inputs.baseRevenue * 1000000 * Math.pow(1.08, 5),
            finalPeriodEbitda: inputs.baseRevenue * 1000000 * Math.pow(1.08, 5) * 0.29
          },
          upside: {
            finalPeriodRevenue: inputs.baseRevenue * 1000000 * Math.pow(1.08, 5) * 1.2,
            finalPeriodEbitda: inputs.baseRevenue * 1000000 * Math.pow(1.08, 5) * 1.2 * 0.31
          },
          downside: {
            finalPeriodRevenue: inputs.baseRevenue * 1000000 * Math.pow(1.08, 5) * 0.85,
            finalPeriodEbitda: inputs.baseRevenue * 1000000 * Math.pow(1.08, 5) * 0.85 * 0.275
          },
          stress: {
            finalPeriodRevenue: inputs.baseRevenue * 1000000 * Math.pow(1.08, 5) * 0.7,
            finalPeriodEbitda: inputs.baseRevenue * 1000000 * Math.pow(1.08, 5) * 0.7 * 0.24
          }
        },
        keyInsights: {
          operationalInsights: [
            'Consistent revenue growth with improving margins',
            'Strong working capital management',
            'Efficient capital allocation strategy'
          ],
          financialPerformanceInsights: [
            'Robust cash flow generation',
            'Declining leverage profile',
            'Strong return metrics'
          ],
          recommendations: {
            immediate: [
              'Optimize working capital cycles',
              'Review capital expenditure timing',
              'Enhance cash flow forecasting'
            ],
            strategic: [
              'Consider dividend policy framework',
              'Evaluate refinancing opportunities',
              'Assess growth investment priorities'
            ]
          }
        }
      };
      
      setResults(analysisResults);
      setIsCalculating(false);
      
      if (onResultsChange) {
        onResultsChange(analysisResults);
      }
    }, 3000);
  };

  const formatCurrency = (amount: number) => {
    return `$${(amount / 1000000).toFixed(0)}M`;
  };

  const formatPercentage = (value: number) => {
    return `${(value * 100).toFixed(1)}%`;
  };

  const updateRevenueGrowthRate = (index: number, value: number) => {
    setInputs(prev => ({
      ...prev,
      revenueGrowthRates: prev.revenueGrowthRates.map((rate, i) => 
        i === index ? value : rate
      )
    }));
  };

  const updateEbitdaMargin = (index: number, value: number) => {
    setInputs(prev => ({
      ...prev,
      ebitdaMargins: prev.ebitdaMargins.map((margin, i) => 
        i === index ? value : margin
      )
    }));
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <FileSpreadsheet className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Financial Statement Projections</h3>
              <p className="text-sm text-gray-600">Comprehensive three-statement financial modeling and analysis</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {results && (
              <Badge variant="outline" className="bg-green-50 text-green-700">
                <CheckCircle className="h-3 w-3 mr-1" />
                Analyzed
              </Badge>
            )}
            {mode !== 'traditional' && (
              <Button variant="outline" size="sm">
                <Zap className="h-4 w-4 mr-1" />
                AI Insights
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Tab Navigation */}
        <div className="flex space-x-4 border-b">
          <button
            onClick={() => setActiveTab('inputs')}
            className={`pb-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'inputs'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Model Inputs
          </button>
          <button
            onClick={() => setActiveTab('assumptions')}
            className={`pb-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'assumptions'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Key Assumptions
          </button>
        </div>

        {/* Model Inputs Tab */}
        {activeTab === 'inputs' && (
          <div className="space-y-6">
            {/* Company Information */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Company Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                  <Input
                    value={inputs.companyName}
                    onChange={(e) => setInputs(prev => ({ ...prev, companyName: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
                  <Input
                    value={inputs.industry}
                    onChange={(e) => setInputs(prev => ({ ...prev, industry: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Base Revenue ($M)</label>
                  <Input
                    type="number"
                    value={inputs.baseRevenue}
                    onChange={(e) => setInputs(prev => ({ ...prev, baseRevenue: Number(e.target.value) }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Projection Years</label>
                  <Input
                    type="number"
                    min="3"
                    max="10"
                    value={inputs.projectionYears}
                    onChange={(e) => setInputs(prev => ({ ...prev, projectionYears: Number(e.target.value) }))}
                  />
                </div>
              </div>
            </div>

            {/* Revenue Growth Projections */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Revenue Growth Rates (%)</h4>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {inputs.revenueGrowthRates.map((rate, index) => (
                  <div key={index}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Year {index + 1}</label>
                    <Input
                      type="number"
                      step="0.1"
                      value={rate}
                      onChange={(e) => updateRevenueGrowthRate(index, Number(e.target.value))}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* EBITDA Margin Projections */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">EBITDA Margins (%)</h4>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {inputs.ebitdaMargins.map((margin, index) => (
                  <div key={index}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Year {index + 1}</label>
                    <Input
                      type="number"
                      step="0.1"
                      value={margin}
                      onChange={(e) => updateEbitdaMargin(index, Number(e.target.value))}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Capital Structure */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Capital Structure</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Debt Amount ($M)</label>
                  <Input
                    type="number"
                    value={inputs.debtAmount}
                    onChange={(e) => setInputs(prev => ({ ...prev, debtAmount: Number(e.target.value) }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Interest Rate (%)</label>
                  <Input
                    type="number"
                    step="0.1"
                    value={inputs.interestRate}
                    onChange={(e) => setInputs(prev => ({ ...prev, interestRate: Number(e.target.value) }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tax Rate (%)</label>
                  <Input
                    type="number"
                    step="1"
                    value={inputs.taxRate}
                    onChange={(e) => setInputs(prev => ({ ...prev, taxRate: Number(e.target.value) }))}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Key Assumptions Tab */}
        {activeTab === 'assumptions' && (
          <div className="space-y-6">
            {/* Working Capital Assumptions */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Working Capital Assumptions (Days)</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Accounts Receivable</label>
                  <Input
                    type="number"
                    value={inputs.workingCapitalDays.receivables}
                    onChange={(e) => setInputs(prev => ({
                      ...prev,
                      workingCapitalDays: {
                        ...prev.workingCapitalDays,
                        receivables: Number(e.target.value)
                      }
                    }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Inventory</label>
                  <Input
                    type="number"
                    value={inputs.workingCapitalDays.inventory}
                    onChange={(e) => setInputs(prev => ({
                      ...prev,
                      workingCapitalDays: {
                        ...prev.workingCapitalDays,
                        inventory: Number(e.target.value)
                      }
                    }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Accounts Payable</label>
                  <Input
                    type="number"
                    value={inputs.workingCapitalDays.payables}
                    onChange={(e) => setInputs(prev => ({
                      ...prev,
                      workingCapitalDays: {
                        ...prev.workingCapitalDays,
                        payables: Number(e.target.value)
                      }
                    }))}
                  />
                </div>
              </div>
            </div>

            {/* Capital Expenditures */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Capital Expenditures (% of Revenue)</h4>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {inputs.capexPercentages.map((capex, index) => (
                  <div key={index}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Year {index + 1}</label>
                    <Input
                      type="number"
                      step="0.1"
                      value={capex}
                      onChange={(e) => setInputs(prev => ({
                        ...prev,
                        capexPercentages: prev.capexPercentages.map((c, i) => 
                          i === index ? Number(e.target.value) : c
                        )
                      }))}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Analysis Settings */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Analysis Settings</h4>
              <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Include Ratio Analysis</span>
                  <Badge variant="outline">Enabled</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Include Scenario Analysis</span>
                  <Badge variant="outline">Enabled</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Include Credit Analysis</span>
                  <Badge variant="outline">Enabled</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Include Sensitivity Analysis</span>
                  <Badge variant="outline">Enabled</Badge>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Calculate Button */}
        <div className="flex justify-center">
          <Button 
            onClick={runAnalysis} 
            disabled={isCalculating}
            className="px-8"
          >
            <Calculator className="h-4 w-4 mr-2" />
            {isCalculating ? 'Running Analysis...' : 'Run Financial Statement Projections'}
          </Button>
        </div>

        {/* Results */}
        {results && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-gray-900">Analysis Results</h4>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-1" />
                Export
              </Button>
            </div>

            {/* Projection Summary */}
            <Card>
              <CardHeader>
                <h5 className="font-medium text-gray-900">Projection Summary</h5>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-2">
                      <TrendingUp className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="text-2xl font-bold text-blue-600">
                      {formatPercentage(results.projectionSummary.revenueCAGR)}
                    </div>
                    <div className="text-sm text-gray-600">Revenue CAGR</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-2">
                      <BarChart3 className="h-5 w-5 text-green-600" />
                    </div>
                    <div className="text-2xl font-bold text-green-600">
                      {formatPercentage(results.projectionSummary.ebitdaCAGR)}
                    </div>
                    <div className="text-sm text-gray-600">EBITDA CAGR</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-2">
                      <Target className="h-5 w-5 text-purple-600" />
                    </div>
                    <div className="text-2xl font-bold text-purple-600">
                      {formatPercentage(results.projectionSummary.averageROE)}
                    </div>
                    <div className="text-sm text-gray-600">Average ROE</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-2">
                      <Activity className="h-5 w-5 text-orange-600" />
                    </div>
                    <div className="text-2xl font-bold text-orange-600">
                      {results.projectionSummary.peakNetDebtToEbitda.toFixed(1)}x
                    </div>
                    <div className="text-sm text-gray-600">Peak Net Debt/EBITDA</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Income Statement Projections Table */}
            <Card>
              <CardHeader>
                <h5 className="font-medium text-gray-900">Income Statement Projections</h5>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">Period</th>
                        <th className="text-right py-2">Revenue ($M)</th>
                        <th className="text-right py-2">Growth</th>
                        <th className="text-right py-2">EBITDA ($M)</th>
                        <th className="text-right py-2">EBITDA Margin</th>
                        <th className="text-right py-2">Net Income ($M)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {results.projectedPeriods.map((period, index) => (
                        <tr key={index} className="border-b">
                          <td className="py-2">{period.period}</td>
                          <td className="text-right py-2">{formatCurrency(period.incomeStatement.revenue)}</td>
                          <td className="text-right py-2">
                            <Badge 
                              variant={period.incomeStatement.revenueGrowth > 0 ? "default" : "secondary"}
                              className="text-xs"
                            >
                              {formatPercentage(period.incomeStatement.revenueGrowth)}
                            </Badge>
                          </td>
                          <td className="text-right py-2">{formatCurrency(period.incomeStatement.ebitda)}</td>
                          <td className="text-right py-2">{formatPercentage(period.incomeStatement.ebitdaMargin)}</td>
                          <td className="text-right py-2">{formatCurrency(period.incomeStatement.netIncome)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Scenario Analysis */}
            {results.scenarioAnalysis && (
              <Card>
                <CardHeader>
                  <h5 className="font-medium text-gray-900">Scenario Analysis</h5>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <div className="text-sm text-gray-600 mb-1">Base Case</div>
                      <div className="text-lg font-semibold text-blue-600">
                        {formatCurrency(results.scenarioAnalysis.baseCase.finalPeriodRevenue)}
                      </div>
                      <div className="text-xs text-gray-500">
                        EBITDA: {formatCurrency(results.scenarioAnalysis.baseCase.finalPeriodEbitda)}
                      </div>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg">
                      <div className="text-sm text-gray-600 mb-1">Upside Case</div>
                      <div className="text-lg font-semibold text-green-600">
                        {formatCurrency(results.scenarioAnalysis.upside.finalPeriodRevenue)}
                      </div>
                      <div className="text-xs text-gray-500">
                        EBITDA: {formatCurrency(results.scenarioAnalysis.upside.finalPeriodEbitda)}
                      </div>
                    </div>
                    <div className="p-3 bg-yellow-50 rounded-lg">
                      <div className="text-sm text-gray-600 mb-1">Downside Case</div>
                      <div className="text-lg font-semibold text-yellow-600">
                        {formatCurrency(results.scenarioAnalysis.downside.finalPeriodRevenue)}
                      </div>
                      <div className="text-xs text-gray-500">
                        EBITDA: {formatCurrency(results.scenarioAnalysis.downside.finalPeriodEbitda)}
                      </div>
                    </div>
                    <div className="p-3 bg-red-50 rounded-lg">
                      <div className="text-sm text-gray-600 mb-1">Stress Case</div>
                      <div className="text-lg font-semibold text-red-600">
                        {formatCurrency(results.scenarioAnalysis.stress.finalPeriodRevenue)}
                      </div>
                      <div className="text-xs text-gray-500">
                        EBITDA: {formatCurrency(results.scenarioAnalysis.stress.finalPeriodEbitda)}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Key Insights */}
            <Card>
              <CardHeader>
                <h5 className="font-medium text-gray-900">Key Insights & Recommendations</h5>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h6 className="text-sm font-medium text-gray-700 mb-2">Operational Insights:</h6>
                    <ul className="space-y-1 text-sm text-gray-600">
                      {results.keyInsights.operationalInsights.map((insight, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-blue-500 mt-1">•</span>
                          {insight}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h6 className="text-sm font-medium text-gray-700 mb-2">Financial Performance:</h6>
                    <ul className="space-y-1 text-sm text-gray-600">
                      {results.keyInsights.financialPerformanceInsights.map((insight, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-green-500 mt-1">•</span>
                          {insight}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h6 className="text-sm font-medium text-gray-700 mb-2">Immediate Actions:</h6>
                    <ul className="space-y-1 text-sm text-gray-600">
                      {results.keyInsights.recommendations.immediate.map((rec, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-red-500 mt-1">•</span>
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h6 className="text-sm font-medium text-gray-700 mb-2">Strategic Recommendations:</h6>
                    <ul className="space-y-1 text-sm text-gray-600">
                      {results.keyInsights.recommendations.strategic.map((rec, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-purple-500 mt-1">•</span>
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* AI Insights for non-traditional modes */}
            {mode !== 'traditional' && (
              <div className="p-4 bg-green-50 rounded-lg border-l-4 border-l-green-500">
                <div className="flex items-start gap-3">
                  <Zap className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <h5 className="font-medium text-green-900 mb-2">AI Financial Analysis</h5>
                    <ul className="text-sm text-green-800 space-y-1">
                      <li>• Strong revenue growth trajectory with expanding margins indicates operational excellence</li>
                      <li>• Declining leverage profile provides financial flexibility for growth investments</li>
                      <li>• Working capital optimization opportunity could free up $15-20M in cash</li>
                      <li>• Consider accelerating growth investments given strong cash generation profile</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Warning */}
        <div className="flex items-start gap-3 p-3 bg-amber-50 rounded-lg border border-amber-200">
          <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5" />
          <div className="text-sm text-amber-800">
            <strong>Note:</strong> Financial projections are based on assumptions and modeling inputs. 
            Actual results may vary due to market conditions, operational performance, and other factors.
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FinancialStatementsCard;