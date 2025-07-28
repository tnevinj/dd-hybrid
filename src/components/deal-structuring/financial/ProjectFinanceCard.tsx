'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { 
  Settings,
  Calculator,
  Download,
  AlertCircle,
  CheckCircle,
  Zap,
  Plus,
  Trash2,
  BarChart3,
  DollarSign,
  Target,
  Activity,
  TrendingUp,
  Building,
  Gauge,
  AlertTriangle,
  Info
} from 'lucide-react';

interface ProjectFinanceCardProps {
  dealId: string;
  mode?: string;
  onResultsChange?: (results: any) => void;
}

interface RevenueStream {
  id: string;
  name: string;
  type: 'Toll' | 'Availability' | 'Shadow Toll' | 'Concession';
  baseAmount: number;
  escalationRate: number;
  contractType: string;
}

interface DebtTranche {
  name: string;
  amount: number;
  interestRate: number;
  tenor: number;
  repaymentProfile: 'Amortizing' | 'Bullet' | 'Sculpted';
}

interface OperatingExpense {
  name: string;
  annualAmount: number;
  timing: 'Monthly' | 'Quarterly' | 'Annually';
  variability: 'Fixed' | 'Variable';
}

interface CashFlowProjection {
  year: number;
  revenues: number;
  ebitda: number;
  capitalExpenditure: number;
  debtService: number;
  cashAvailable: number;
  dscr: number;
}

interface SensitivityAnalysis {
  parameter: string;
  baseCase: number;
  scenarios: Array<{
    name: string;
    impact: number;
  }>;
}

interface StressTestResult {
  scenario: string;
  projectIRR: number;
  minimumDSCR: number;
  probabilityOfDefault: number;
}

interface CovenantCompliance {
  year: number;
  dscr: number;
  llcr: number;
  minimumCashReserves: number;
  complianceStatus: 'Compliant' | 'Warning' | 'Breach';
  covenantBreaches: string[];
}

interface ProjectFinanceResults {
  projectIRR: number;
  equityIRR: number;
  dscr: {
    minimumDSCR: number;
    averageDSCR: number;
    tailDSCR: number;
    sculptingRequired: boolean;
    breachPeriods: string[];
  };
  llcr: number;
  plcr: number;
  paybackPeriod: number;
  breakEvenAnalysis: {
    operationalBreakEven: number;
    financialBreakEven: number;
  };
  performanceMetrics: {
    totalReturnMultiple: number;
    cashOnCashReturn: number;
    averageLifeOfDebt: number;
  };
  cashFlowProjections: CashFlowProjection[];
  sensitivityAnalysis: SensitivityAnalysis[];
  stressTestResults: StressTestResult[];
  covenantCompliance: CovenantCompliance[];
}

const ProjectFinanceCard: React.FC<ProjectFinanceCardProps> = ({ 
  dealId, 
  mode = 'traditional',
  onResultsChange 
}) => {
  const [inputs, setInputs] = useState({
    projectName: 'Infrastructure Project',
    sector: 'Transportation',
    projectValue: 500,
    discountRate: 8.0,
    inflationRate: 2.5,
    taxRate: 25.0,
    constructionPeriod: 24,
    operationPeriod: 25,
    targetDSCR: 1.35,
    targetLLCR: 1.40
  });

  const [revenueStreams, setRevenueStreams] = useState<RevenueStream[]>([
    {
      id: 'revenue-1',
      name: 'Availability Payment',
      type: 'Availability',
      baseAmount: 25000000,
      escalationRate: 2.5,
      contractType: 'Availability'
    },
    {
      id: 'revenue-2',
      name: 'Performance Payment',
      type: 'Concession',
      baseAmount: 8000000,
      escalationRate: 3.0,
      contractType: 'Performance'
    }
  ]);

  const [debtTranches, setDebtTranches] = useState<DebtTranche[]>([
    {
      name: 'Senior Bank Debt',
      amount: 300000000,
      interestRate: 6.5,
      tenor: 18,
      repaymentProfile: 'Amortizing'
    },
    {
      name: 'Subordinated Debt',
      amount: 50000000,
      interestRate: 8.5,
      tenor: 20,
      repaymentProfile: 'Bullet'
    }
  ]);

  const [operatingExpenses, setOperatingExpenses] = useState<OperatingExpense[]>([
    {
      name: 'Operations & Maintenance',
      annualAmount: 8000000,
      timing: 'Monthly',
      variability: 'Fixed'
    },
    {
      name: 'Insurance',
      annualAmount: 2000000,
      timing: 'Annually',
      variability: 'Fixed'
    }
  ]);

  const [results, setResults] = useState<ProjectFinanceResults | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [activeTab, setActiveTab] = useState('configuration');

  const runAnalysis = () => {
    setIsCalculating(true);
    
    setTimeout(() => {
      // Mock project finance analysis results
      const analysisResults: ProjectFinanceResults = {
        projectIRR: 0.127,
        equityIRR: 0.165,
        dscr: {
          minimumDSCR: 1.42,
          averageDSCR: 1.68,
          tailDSCR: 1.85,
          sculptingRequired: false,
          breachPeriods: []
        },
        llcr: 1.52,
        plcr: 1.78,
        paybackPeriod: 8.5,
        breakEvenAnalysis: {
          operationalBreakEven: 3,
          financialBreakEven: 5
        },
        performanceMetrics: {
          totalReturnMultiple: 2.8,
          cashOnCashReturn: 0.145,
          averageLifeOfDebt: 12.5
        },
        cashFlowProjections: [
          {
            year: 1,
            revenues: 33000000,
            ebitda: 23100000,
            capitalExpenditure: 5000000,
            debtService: 28500000,
            cashAvailable: 20100000,
            dscr: 1.42
          },
          {
            year: 2,
            revenues: 33825000,
            ebitda: 23677500,
            capitalExpenditure: 5125000,
            debtService: 28500000,
            cashAvailable: 20602500,
            dscr: 1.45
          },
          {
            year: 3,
            revenues: 34670625,
            ebitda: 24269438,
            capitalExpenditure: 5253125,
            debtService: 28500000,
            cashAvailable: 21116313,
            dscr: 1.48
          }
        ],
        sensitivityAnalysis: [
          {
            parameter: 'Revenue Growth',
            baseCase: 12.7,
            scenarios: [
              { name: 'Downside', impact: 8.5 },
              { name: 'Upside', impact: 17.2 }
            ]
          },
          {
            parameter: 'Construction Cost',
            baseCase: 12.7,
            scenarios: [
              { name: 'Downside', impact: 9.8 },
              { name: 'Upside', impact: 15.1 }
            ]
          },
          {
            parameter: 'Operating Costs',
            baseCase: 12.7,
            scenarios: [
              { name: 'Downside', impact: 10.5 },
              { name: 'Upside', impact: 14.8 }
            ]
          }
        ],
        stressTestResults: [
          {
            scenario: 'Base Case',
            projectIRR: 0.127,
            minimumDSCR: 1.42,
            probabilityOfDefault: 0.08
          },
          {
            scenario: 'Revenue Stress',
            projectIRR: 0.085,
            minimumDSCR: 1.18,
            probabilityOfDefault: 0.22
          },
          {
            scenario: 'Cost Inflation',
            projectIRR: 0.105,
            minimumDSCR: 1.28,
            probabilityOfDefault: 0.15
          }
        ],
        covenantCompliance: [
          {
            year: 1,
            dscr: 1.42,
            llcr: 1.52,
            minimumCashReserves: 25000000,
            complianceStatus: 'Compliant',
            covenantBreaches: []
          },
          {
            year: 2,
            dscr: 1.45,
            llcr: 1.55,
            minimumCashReserves: 25000000,
            complianceStatus: 'Compliant',
            covenantBreaches: []
          }
        ]
      };
      
      setResults(analysisResults);
      setIsCalculating(false);
      
      if (onResultsChange) {
        onResultsChange(analysisResults);
      }
    }, 3500);
  };

  const addRevenueStream = () => {
    const newStream: RevenueStream = {
      id: `revenue-${revenueStreams.length + 1}`,
      name: `Revenue Stream ${revenueStreams.length + 1}`,
      type: 'Availability',
      baseAmount: 10000000,
      escalationRate: 2.5,
      contractType: 'Availability'
    };
    setRevenueStreams([...revenueStreams, newStream]);
  };

  const removeRevenueStream = (id: string) => {
    setRevenueStreams(revenueStreams.filter(stream => stream.id !== id));
  };

  const addDebtTranche = () => {
    const newTranche: DebtTranche = {
      name: `Debt Tranche ${debtTranches.length + 1}`,
      amount: 50000000,
      interestRate: 6.5,
      tenor: 15,
      repaymentProfile: 'Amortizing'
    };
    setDebtTranches([...debtTranches, newTranche]);
  };

  const removeDebtTranche = (index: number) => {
    setDebtTranches(debtTranches.filter((_, i) => i !== index));
  };

  const formatCurrency = (amount: number) => {
    return `$${(amount / 1000000).toFixed(0)}M`;
  };

  const formatPercentage = (value: number) => {
    return `${(value * 100).toFixed(1)}%`;
  };

  const formatRatio = (value: number) => {
    return `${value.toFixed(2)}x`;
  };

  const getCovenantStatus = (value: number, threshold: number) => {
    if (value >= threshold) return 'success';
    if (value >= threshold * 0.9) return 'warning';
    return 'error';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'error': return <AlertCircle className="h-4 w-4 text-red-500" />;
      default: return <Info className="h-4 w-4 text-gray-400" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Building className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Project Finance Modeling</h3>
              <p className="text-sm text-gray-600">Infrastructure project finance with debt structuring and covenant analysis</p>
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
                AI Optimization
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Tab Navigation */}
        <div className="flex space-x-4 border-b">
          <button
            onClick={() => setActiveTab('configuration')}
            className={`pb-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'configuration'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Configuration
          </button>
          <button
            onClick={() => setActiveTab('results')}
            className={`pb-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'results'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Results
          </button>
          <button
            onClick={() => setActiveTab('covenants')}
            className={`pb-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'covenants'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Covenant Analysis
          </button>
          <button
            onClick={() => setActiveTab('sensitivity')}
            className={`pb-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'sensitivity'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Sensitivity & Stress
          </button>
        </div>

        {/* Configuration Tab */}
        {activeTab === 'configuration' && (
          <div className="space-y-6">
            {/* Project Information */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Project Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Project Name</label>
                  <Input
                    value={inputs.projectName}
                    onChange={(e) => setInputs(prev => ({ ...prev, projectName: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sector</label>
                  <select 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    value={inputs.sector}
                    onChange={(e) => setInputs(prev => ({ ...prev, sector: e.target.value }))}
                  >
                    <option value="Transportation">Transportation</option>
                    <option value="Energy">Energy</option>
                    <option value="Water">Water</option>
                    <option value="Social">Social Infrastructure</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Project Value ($M)</label>
                  <Input
                    type="number"
                    value={inputs.projectValue}
                    onChange={(e) => setInputs(prev => ({ ...prev, projectValue: Number(e.target.value) }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Discount Rate (%)</label>
                  <Input
                    type="number"
                    step="0.1"
                    value={inputs.discountRate}
                    onChange={(e) => setInputs(prev => ({ ...prev, discountRate: Number(e.target.value) }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Construction Period (months)</label>
                  <Input
                    type="number"
                    value={inputs.constructionPeriod}
                    onChange={(e) => setInputs(prev => ({ ...prev, constructionPeriod: Number(e.target.value) }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Operation Period (years)</label>
                  <Input
                    type="number"
                    value={inputs.operationPeriod}
                    onChange={(e) => setInputs(prev => ({ ...prev, operationPeriod: Number(e.target.value) }))}
                  />
                </div>
              </div>
            </div>

            {/* Revenue Streams */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium text-gray-900">Revenue Streams</h4>
                <Button onClick={addRevenueStream} size="sm" variant="outline">
                  <Plus className="h-4 w-4 mr-1" />
                  Add Stream
                </Button>
              </div>

              <div className="space-y-4">
                {revenueStreams.map((stream) => (
                  <Card key={stream.id} className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <DollarSign className="h-4 w-4 text-green-500" />
                        <div>
                          <h5 className="font-medium">{stream.name}</h5>
                          <p className="text-sm text-gray-600">{stream.type} revenue</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">
                          {formatCurrency(stream.baseAmount)}
                        </Badge>
                        {revenueStreams.length > 1 && (
                          <Button 
                            onClick={() => removeRevenueStream(stream.id)}
                            size="sm"
                            variant="ghost"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                        <Input
                          value={stream.name}
                          onChange={(e) => {
                            const updated = revenueStreams.map(s => 
                              s.id === stream.id ? { ...s, name: e.target.value } : s
                            );
                            setRevenueStreams(updated);
                          }}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                        <select 
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                          value={stream.type}
                          onChange={(e) => {
                            const updated = revenueStreams.map(s => 
                              s.id === stream.id ? { ...s, type: e.target.value as any } : s
                            );
                            setRevenueStreams(updated);
                          }}
                        >
                          <option value="Toll">Toll</option>
                          <option value="Availability">Availability</option>
                          <option value="Shadow Toll">Shadow Toll</option>
                          <option value="Concession">Concession</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Base Amount ($)</label>
                        <Input
                          type="number"
                          value={stream.baseAmount}
                          onChange={(e) => {
                            const updated = revenueStreams.map(s => 
                              s.id === stream.id ? { ...s, baseAmount: Number(e.target.value) } : s
                            );
                            setRevenueStreams(updated);
                          }}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Escalation (%)</label>
                        <Input
                          type="number"
                          step="0.1"
                          value={stream.escalationRate}
                          onChange={(e) => {
                            const updated = revenueStreams.map(s => 
                              s.id === stream.id ? { ...s, escalationRate: Number(e.target.value) } : s
                            );
                            setRevenueStreams(updated);
                          }}
                        />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Debt Structure */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium text-gray-900">Debt Structure</h4>
                <Button onClick={addDebtTranche} size="sm" variant="outline">
                  <Plus className="h-4 w-4 mr-1" />
                  Add Tranche
                </Button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Name</th>
                      <th className="text-right py-2">Amount</th>
                      <th className="text-right py-2">Rate</th>
                      <th className="text-right py-2">Tenor</th>
                      <th className="text-right py-2">Profile</th>
                      <th className="text-right py-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {debtTranches.map((debt, index) => (
                      <tr key={index} className="border-b">
                        <td className="py-2">{debt.name}</td>
                        <td className="text-right py-2">{formatCurrency(debt.amount)}</td>
                        <td className="text-right py-2">{formatPercentage(debt.interestRate / 100)}</td>
                        <td className="text-right py-2">{debt.tenor}y</td>
                        <td className="text-right py-2">
                          <Badge variant="outline" className="text-xs">
                            {debt.repaymentProfile}
                          </Badge>
                        </td>
                        <td className="text-right py-2">
                          {debtTranches.length > 1 && (
                            <Button 
                              onClick={() => removeDebtTranche(index)}
                              size="sm"
                              variant="ghost"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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
            {isCalculating ? 'Calculating Project...' : 'Calculate Project Finance'}
          </Button>
        </div>

        {/* Results Tab */}
        {activeTab === 'results' && results && (
          <div className="space-y-6">
            {/* Key Metrics */}
            <Card>
              <CardHeader>
                <h5 className="font-medium text-gray-900">Key Financial Metrics</h5>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-2">
                      <Target className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="text-2xl font-bold text-blue-600">
                      {formatPercentage(results.projectIRR)}
                    </div>
                    <div className="text-sm text-gray-600">Project IRR</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-2">
                      <TrendingUp className="h-5 w-5 text-green-600" />
                    </div>
                    <div className="text-2xl font-bold text-green-600">
                      {formatPercentage(results.equityIRR)}
                    </div>
                    <div className="text-sm text-gray-600">Equity IRR</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-2">
                      <Gauge className="h-5 w-5 text-purple-600" />
                    </div>
                    <div className="text-2xl font-bold text-purple-600">
                      {formatRatio(results.dscr.minimumDSCR)}
                    </div>
                    <div className="text-sm text-gray-600">Minimum DSCR</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-2">
                      <Activity className="h-5 w-5 text-orange-600" />
                    </div>
                    <div className="text-2xl font-bold text-orange-600">
                      {formatRatio(results.llcr)}
                    </div>
                    <div className="text-sm text-gray-600">LLCR</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Cash Flow Projections */}
            <Card>
              <CardHeader>
                <h5 className="font-medium text-gray-900">Cash Flow Projections (First 3 Years)</h5>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">Year</th>
                        <th className="text-right py-2">Revenue</th>
                        <th className="text-right py-2">EBITDA</th>
                        <th className="text-right py-2">CapEx</th>
                        <th className="text-right py-2">Debt Service</th>
                        <th className="text-right py-2">DSCR</th>
                      </tr>
                    </thead>
                    <tbody>
                      {results.cashFlowProjections.map((cf) => (
                        <tr key={cf.year} className="border-b">
                          <td className="py-2">Year {cf.year}</td>
                          <td className="text-right py-2">{formatCurrency(cf.revenues)}</td>
                          <td className="text-right py-2">{formatCurrency(cf.ebitda)}</td>
                          <td className="text-right py-2">{formatCurrency(cf.capitalExpenditure)}</td>
                          <td className="text-right py-2">{formatCurrency(cf.debtService)}</td>
                          <td className="text-right py-2">
                            <div className="flex items-center gap-1">
                              {getStatusIcon(getCovenantStatus(cf.dscr, 1.2))}
                              {formatRatio(cf.dscr)}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Performance Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <h6 className="font-medium text-gray-900">Break-even Analysis</h6>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Operational Break-even</span>
                      <span className="font-medium">Year {results.breakEvenAnalysis.operationalBreakEven}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Financial Break-even</span>
                      <span className="font-medium">Year {results.breakEvenAnalysis.financialBreakEven}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Payback Period</span>
                      <span className="font-medium">{results.paybackPeriod} years</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <h6 className="font-medium text-gray-900">Performance Metrics</h6>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Total Return Multiple</span>
                      <span className="font-medium">{formatRatio(results.performanceMetrics.totalReturnMultiple)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Cash-on-Cash Return</span>
                      <span className="font-medium">{formatPercentage(results.performanceMetrics.cashOnCashReturn)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Average Life of Debt</span>
                      <span className="font-medium">{results.performanceMetrics.averageLifeOfDebt.toFixed(1)} years</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Covenant Analysis Tab */}
        {activeTab === 'covenants' && results && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <h5 className="font-medium text-gray-900">DSCR Analysis</h5>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {formatRatio(results.dscr.minimumDSCR)}
                    </div>
                    <div className="text-sm text-gray-600">Minimum DSCR</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {formatRatio(results.dscr.averageDSCR)}
                    </div>
                    <div className="text-sm text-gray-600">Average DSCR</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {formatRatio(results.dscr.tailDSCR)}
                    </div>
                    <div className="text-sm text-gray-600">Tail DSCR</div>
                  </div>
                </div>
                
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Sculpting Required</span>
                    <Badge variant={results.dscr.sculptingRequired ? "secondary" : "default"}>
                      {results.dscr.sculptingRequired ? 'Yes' : 'No'}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Covenant Compliance Table */}
            <Card>
              <CardHeader>
                <h5 className="font-medium text-gray-900">Covenant Compliance</h5>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">Year</th>
                        <th className="text-right py-2">DSCR</th>
                        <th className="text-right py-2">LLCR</th>
                        <th className="text-right py-2">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {results.covenantCompliance.map((covenant) => (
                        <tr key={covenant.year} className="border-b">
                          <td className="py-2">Year {covenant.year}</td>
                          <td className="text-right py-2">
                            <div className="flex items-center gap-1 justify-end">
                              {getStatusIcon(getCovenantStatus(covenant.dscr, 1.2))}
                              {formatRatio(covenant.dscr)}
                            </div>
                          </td>
                          <td className="text-right py-2">
                            <div className="flex items-center gap-1 justify-end">
                              {getStatusIcon(getCovenantStatus(covenant.llcr, 1.4))}
                              {formatRatio(covenant.llcr)}
                            </div>
                          </td>
                          <td className="text-right py-2">
                            <Badge 
                              variant={
                                covenant.complianceStatus === 'Compliant' ? 'default' :
                                covenant.complianceStatus === 'Warning' ? 'secondary' : 'destructive'
                              }
                              className="text-xs"
                            >
                              {covenant.complianceStatus}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Sensitivity & Stress Tab */}
        {activeTab === 'sensitivity' && results && (
          <div className="space-y-6">
            {/* Sensitivity Analysis */}
            <Card>
              <CardHeader>
                <h5 className="font-medium text-gray-900">Sensitivity Analysis</h5>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">Parameter</th>
                        <th className="text-right py-2">Downside</th>
                        <th className="text-right py-2">Base Case</th>
                        <th className="text-right py-2">Upside</th>
                      </tr>
                    </thead>
                    <tbody>
                      {results.sensitivityAnalysis.map((analysis) => (
                        <tr key={analysis.parameter} className="border-b">
                          <td className="py-2">{analysis.parameter}</td>
                          <td className="text-right py-2 text-red-600">
                            {analysis.scenarios.find(s => s.name === 'Downside')?.impact.toFixed(1)}%
                          </td>
                          <td className="text-right py-2 font-medium">
                            {analysis.baseCase.toFixed(1)}%
                          </td>
                          <td className="text-right py-2 text-green-600">
                            {analysis.scenarios.find(s => s.name === 'Upside')?.impact.toFixed(1)}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Stress Test Results */}
            <Card>
              <CardHeader>
                <h5 className="font-medium text-gray-900">Stress Test Results</h5>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">Scenario</th>
                        <th className="text-right py-2">Project IRR</th>
                        <th className="text-right py-2">Min DSCR</th>
                        <th className="text-right py-2">Default Risk</th>
                      </tr>
                    </thead>
                    <tbody>
                      {results.stressTestResults.map((stress) => (
                        <tr key={stress.scenario} className="border-b">
                          <td className="py-2">{stress.scenario}</td>
                          <td className="text-right py-2">{formatPercentage(stress.projectIRR)}</td>
                          <td className="text-right py-2">
                            <div className="flex items-center gap-1 justify-end">
                              {getStatusIcon(getCovenantStatus(stress.minimumDSCR, 1.2))}
                              {formatRatio(stress.minimumDSCR)}
                            </div>
                          </td>
                          <td className="text-right py-2">
                            <div className="flex items-center gap-2">
                              <Progress 
                                value={stress.probabilityOfDefault * 100} 
                                className="w-20 h-2"
                              />
                              <span className="text-xs">
                                {formatPercentage(stress.probabilityOfDefault)}
                              </span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* AI Insights for non-traditional modes */}
        {mode !== 'traditional' && results && (
          <div className="p-4 bg-orange-50 rounded-lg border-l-4 border-l-orange-500">
            <div className="flex items-start gap-3">
              <Zap className="h-5 w-5 text-orange-600 mt-0.5" />
              <div>
                <h5 className="font-medium text-orange-900 mb-2">AI Project Finance Analysis</h5>
                <ul className="text-sm text-orange-800 space-y-1">
                  <li>• Strong covenant compliance with minimum DSCR above 1.4x provides debt cushion</li>
                  <li>• Revenue stream diversification reduces single-source dependency risk</li>
                  <li>• Consider extending debt tenor to improve cash flow profile</li>
                  <li>• Construction risk mitigation through fixed-price contracts recommended</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Warning */}
        <div className="flex items-start gap-3 p-3 bg-amber-50 rounded-lg border border-amber-200">
          <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5" />
          <div className="text-sm text-amber-800">
            <strong>Note:</strong> Project finance modeling involves complex assumptions and market conditions. 
            Results should be validated with detailed feasibility studies and legal documentation.
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectFinanceCard;