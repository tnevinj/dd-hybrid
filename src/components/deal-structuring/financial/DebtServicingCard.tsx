'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Calculator,
  TrendingUp,
  Schedule,
  CreditCard,
  AlertTriangle,
  CheckCircle,
  Download,
  Zap,
  BarChart3,
  Plus,
  Trash2
} from 'lucide-react';
import { DebtServicingInputs, DebtServicingResults } from '@/types/deal-structuring';

interface DebtServicingCardProps {
  dealId: string;
  mode?: 'traditional' | 'assisted' | 'autonomous';
  onResultsChange?: (results: DebtServicingResults) => void;
}

interface DebtInstrument {
  id: string;
  name: string;
  principalAmount: number;
  interestRate: number;
  term: number;
  type: 'term_loan' | 'revolving_credit' | 'bond' | 'mezzanine';
  paymentFrequency: 'monthly' | 'quarterly' | 'semi_annual' | 'annual';
  amortizationType: 'bullet' | 'straight_line' | 'cash_sweep';
}

const DebtServicingCard: React.FC<DebtServicingCardProps> = ({ 
  dealId, 
  mode = 'traditional',
  onResultsChange 
}) => {
  const [inputs, setInputs] = useState<DebtServicingInputs>({
    companyInfo: {
      name: 'Target Company',
      industry: 'Manufacturing',
      creditRating: 'BB+',
      ebitda: 50000000,
      revenue: 200000000
    },
    debtInstruments: [
      {
        id: '1',
        name: 'Term Loan A',
        principalAmount: 100000000,
        interestRate: 0.065,
        term: 7,
        type: 'term_loan',
        paymentFrequency: 'quarterly',
        amortizationType: 'straight_line'
      }
    ],
    analysisSettings: {
      projectionYears: 10,
      stressTestScenarios: true,
      covenantAnalysis: true,
      refinancingAnalysis: true
    },
    covenants: {
      maxLeverageRatio: 4.5,
      minInterestCoverageRatio: 3.0,
      minFixedChargeRatio: 1.25,
      maxCapexPercent: 0.05
    },
    cashFlowProjections: [
      { year: 1, ebitda: 52000000, capex: 8000000, workingCapital: 2000000 },
      { year: 2, ebitda: 55000000, capex: 9000000, workingCapital: 2200000 },
      { year: 3, ebitda: 58000000, capex: 10000000, workingCapital: 2400000 },
      { year: 4, ebitda: 61000000, capex: 11000000, workingCapital: 2600000 },
      { year: 5, ebitda: 64000000, capex: 12000000, workingCapital: 2800000 }
    ]
  });

  const [results, setResults] = useState<DebtServicingResults | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [activeTab, setActiveTab] = useState<'inputs' | 'schedule' | 'covenants' | 'stress'>('inputs');

  const calculateDebtServicing = async () => {
    setIsCalculating(true);
    
    // Mock calculation - replace with actual debt servicing logic
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const mockResults: DebtServicingResults = {
      totalDebtAmount: inputs.debtInstruments.reduce((sum, debt) => sum + debt.principalAmount, 0),
      weightedAverageRate: 0.065,
      totalInterestExpense: 45000000,
      debtServiceCoverageRatio: 2.8,
      leverageRatio: 3.2,
      interestCoverageRatio: 3.5,
      covenantCompliance: {
        leverageCompliant: true,
        interestCoverageCompliant: true,
        fixedChargeCompliant: true,
        capexCompliant: true
      },
      paymentSchedule: inputs.debtInstruments.map(debt => ({
        instrumentId: debt.id,
        instrumentName: debt.name,
        payments: Array.from({ length: debt.term * 4 }, (_, i) => ({
          period: i + 1,
          principalPayment: debt.principalAmount / (debt.term * 4),
          interestPayment: (debt.principalAmount - (debt.principalAmount / (debt.term * 4) * i)) * debt.interestRate / 4,
          totalPayment: debt.principalAmount / (debt.term * 4) + (debt.principalAmount - (debt.principalAmount / (debt.term * 4) * i)) * debt.interestRate / 4,
          remainingBalance: debt.principalAmount - (debt.principalAmount / (debt.term * 4) * (i + 1))
        }))
      })),
      refinancingAnalysis: {
        optimalRefinancingDate: new Date(Date.now() + 3 * 365 * 24 * 60 * 60 * 1000),
        potentialSavings: 5000000,
        newRateEstimate: 0.055
      },
      stressTestResults: {
        downside: { dscr: 2.1, leverageRatio: 4.1 },
        base: { dscr: 2.8, leverageRatio: 3.2 },
        upside: { dscr: 3.4, leverageRatio: 2.6 }
      }
    };

    setResults(mockResults);
    setIsCalculating(false);
    onResultsChange?.(mockResults);
  };

  const addDebtInstrument = () => {
    const newId = (inputs.debtInstruments.length + 1).toString();
    setInputs(prev => ({
      ...prev,
      debtInstruments: [
        ...prev.debtInstruments,
        {
          id: newId,
          name: `New Debt ${newId}`,
          principalAmount: 50000000,
          interestRate: 0.07,
          term: 5,
          type: 'term_loan',
          paymentFrequency: 'quarterly',
          amortizationType: 'straight_line'
        }
      ]
    }));
  };

  const removeDebtInstrument = (id: string) => {
    setInputs(prev => ({
      ...prev,
      debtInstruments: prev.debtInstruments.filter(debt => debt.id !== id)
    }));
  };

  const formatCurrency = (amount: number) => {
    return `$${(amount / 1000000).toFixed(1)}M`;
  };

  const formatPercentage = (value: number) => {
    return `${(value * 100).toFixed(1)}%`;
  };

  const getCovenantStatus = (actual: number, covenant: number, isMax: boolean = true) => {
    const compliant = isMax ? actual <= covenant : actual >= covenant;
    return compliant ? 'compliant' : 'breach';
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <CreditCard className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Debt Servicing Analysis</h3>
              <p className="text-sm text-gray-500">Analyze debt capacity, payment schedules & covenant compliance</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={mode === 'autonomous' ? 'default' : 'secondary'}>
              {mode === 'autonomous' && <Zap className="h-3 w-3 mr-1" />}
              {mode.charAt(0).toUpperCase() + mode.slice(1)} Mode
            </Badge>
            <Button onClick={calculateDebtServicing} disabled={isCalculating} size="sm">
              {isCalculating ? 'Calculating...' : 'Calculate'}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          {[
            { key: 'inputs', label: 'Debt Structure', icon: Calculator },
            { key: 'schedule', label: 'Payment Schedule', icon: Schedule },
            { key: 'covenants', label: 'Covenant Analysis', icon: AlertTriangle },
            { key: 'stress', label: 'Stress Testing', icon: TrendingUp }
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key as any)}
              className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === key
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </div>

        {/* Debt Structure Tab */}
        {activeTab === 'inputs' && (
          <div className="space-y-6">
            {/* Company Information */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                <Input 
                  value={inputs.companyInfo.name}
                  onChange={(e) => setInputs(prev => ({
                    ...prev,
                    companyInfo: { ...prev.companyInfo, name: e.target.value }
                  }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">EBITDA ($M)</label>
                <Input 
                  type="number"
                  value={inputs.companyInfo.ebitda / 1000000}
                  onChange={(e) => setInputs(prev => ({
                    ...prev,
                    companyInfo: { ...prev.companyInfo, ebitda: parseFloat(e.target.value) * 1000000 }
                  }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Credit Rating</label>
                <Input 
                  value={inputs.companyInfo.creditRating}
                  onChange={(e) => setInputs(prev => ({
                    ...prev,
                    companyInfo: { ...prev.companyInfo, creditRating: e.target.value }
                  }))}
                />
              </div>
            </div>

            {/* Debt Instruments */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-medium text-gray-900">Debt Instruments</h4>
                <Button onClick={addDebtInstrument} size="sm" variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Debt
                </Button>
              </div>
              
              <div className="space-y-4">
                {inputs.debtInstruments.map((debt, index) => (
                  <div key={debt.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h5 className="font-medium text-gray-900">{debt.name}</h5>
                      {inputs.debtInstruments.length > 1 && (
                        <Button 
                          onClick={() => removeDebtInstrument(debt.id)}
                          size="sm"
                          variant="ghost"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Principal ($M)</label>
                        <Input 
                          type="number"
                          value={debt.principalAmount / 1000000}
                          onChange={(e) => {
                            const newDebt = [...inputs.debtInstruments];
                            newDebt[index].principalAmount = parseFloat(e.target.value) * 1000000;
                            setInputs(prev => ({ ...prev, debtInstruments: newDebt }));
                          }}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Interest Rate (%)</label>
                        <Input 
                          type="number"
                          step="0.1"
                          value={debt.interestRate * 100}
                          onChange={(e) => {
                            const newDebt = [...inputs.debtInstruments];
                            newDebt[index].interestRate = parseFloat(e.target.value) / 100;
                            setInputs(prev => ({ ...prev, debtInstruments: newDebt }));
                          }}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Term (Years)</label>
                        <Input 
                          type="number"
                          value={debt.term}
                          onChange={(e) => {
                            const newDebt = [...inputs.debtInstruments];
                            newDebt[index].term = parseInt(e.target.value);
                            setInputs(prev => ({ ...prev, debtInstruments: newDebt }));
                          }}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                        <select 
                          value={debt.type}
                          onChange={(e) => {
                            const newDebt = [...inputs.debtInstruments];
                            newDebt[index].type = e.target.value as any;
                            setInputs(prev => ({ ...prev, debtInstruments: newDebt }));
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                        >
                          <option value="term_loan">Term Loan</option>
                          <option value="revolving_credit">Revolving Credit</option>
                          <option value="bond">Bond</option>
                          <option value="mezzanine">Mezzanine</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Payment Schedule Tab */}
        {activeTab === 'schedule' && results && (
          <div className="space-y-4">
            {results.paymentSchedule.map((schedule) => (
              <div key={schedule.instrumentId} className="border rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-4">{schedule.instrumentName}</h4>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">Period</th>
                        <th className="text-right py-2">Principal</th>
                        <th className="text-right py-2">Interest</th>
                        <th className="text-right py-2">Total Payment</th>
                        <th className="text-right py-2">Balance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {schedule.payments.slice(0, 12).map((payment, index) => (
                        <tr key={index} className="border-b">
                          <td className="py-2">{payment.period}</td>
                          <td className="text-right py-2">{formatCurrency(payment.principalPayment)}</td>
                          <td className="text-right py-2">{formatCurrency(payment.interestPayment)}</td>
                          <td className="text-right py-2 font-medium">{formatCurrency(payment.totalPayment)}</td>
                          <td className="text-right py-2">{formatCurrency(payment.remainingBalance)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {schedule.payments.length > 12 && (
                  <p className="text-sm text-gray-500 mt-2">
                    Showing first 12 payments of {schedule.payments.length} total
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Covenant Analysis Tab */}
        {activeTab === 'covenants' && results && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="text-lg font-medium text-gray-900">Current Covenant Status</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <span className="text-sm text-gray-600">Leverage Ratio</span>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{results.leverageRatio.toFixed(2)}x</span>
                      <Badge variant={results.covenantCompliance.leverageCompliant ? 'default' : 'destructive'}>
                        {results.covenantCompliance.leverageCompliant ? (
                          <CheckCircle className="h-3 w-3 mr-1" />
                        ) : (
                          <AlertTriangle className="h-3 w-3 mr-1" />
                        )}
                        {results.covenantCompliance.leverageCompliant ? 'Compliant' : 'Breach'}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <span className="text-sm text-gray-600">Interest Coverage</span>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{results.interestCoverageRatio.toFixed(2)}x</span>
                      <Badge variant={results.covenantCompliance.interestCoverageCompliant ? 'default' : 'destructive'}>
                        {results.covenantCompliance.interestCoverageCompliant ? (
                          <CheckCircle className="h-3 w-3 mr-1" />
                        ) : (
                          <AlertTriangle className="h-3 w-3 mr-1" />
                        )}
                        {results.covenantCompliance.interestCoverageCompliant ? 'Compliant' : 'Breach'}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <span className="text-sm text-gray-600">Debt Service Coverage</span>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{results.debtServiceCoverageRatio.toFixed(2)}x</span>
                      <Badge variant="default">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Healthy
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="text-lg font-medium text-gray-900">Covenant Limits</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">Max Leverage Ratio</span>
                    <span className="font-medium">{inputs.covenants.maxLeverageRatio.toFixed(2)}x</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">Min Interest Coverage</span>
                    <span className="font-medium">{inputs.covenants.minInterestCoverageRatio.toFixed(2)}x</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">Min Fixed Charge Ratio</span>
                    <span className="font-medium">{inputs.covenants.minFixedChargeRatio.toFixed(2)}x</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Stress Testing Tab */}
        {activeTab === 'stress' && results && (
          <div className="space-y-6">
            <h4 className="text-lg font-medium text-gray-900">Stress Test Results</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { label: 'Downside', scenario: results.stressTestResults.downside, color: 'red' },
                { label: 'Base Case', scenario: results.stressTestResults.base, color: 'blue' },
                { label: 'Upside', scenario: results.stressTestResults.upside, color: 'green' }
              ].map(({ label, scenario, color }) => (
                <div key={label} className="border rounded-lg p-4">
                  <h5 className={`font-medium text-${color}-600 mb-3`}>{label}</h5>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">DSCR</span>
                      <span className="font-medium">{scenario.dscr.toFixed(2)}x</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Leverage</span>
                      <span className="font-medium">{scenario.leverageRatio.toFixed(2)}x</span>
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
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{formatCurrency(results.totalDebtAmount)}</div>
                <div className="text-sm text-gray-600">Total Debt</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{formatPercentage(results.weightedAverageRate)}</div>
                <div className="text-sm text-gray-600">Weighted Avg Rate</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{results.debtServiceCoverageRatio.toFixed(2)}x</div>
                <div className="text-sm text-gray-600">DSCR</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">{results.leverageRatio.toFixed(2)}x</div>
                <div className="text-sm text-gray-600">Leverage Ratio</div>
              </div>
            </div>
          </div>
        )}

        {/* AI Assistance (for assisted/autonomous modes) */}
        {mode !== 'traditional' && (
          <div className="border rounded-lg p-4 bg-blue-50">
            <div className="flex items-start gap-3">
              <Zap className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-900">AI Insights</h4>
                <ul className="text-sm text-blue-800 mt-2 space-y-1">
                  <li>• Consider refinancing Term Loan A in 18 months to capture lower rates</li>
                  <li>• Current leverage headroom of 1.3x provides acquisition capacity</li>
                  <li>• Debt service coverage is healthy across all stress scenarios</li>
                  {mode === 'autonomous' && (
                    <li>• <strong>Auto-action:</strong> Schedule covenant testing alerts for quarter-end</li>
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

export default DebtServicingCard;