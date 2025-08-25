'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { 
  Layers,
  Calculator,
  Download,
  AlertCircle,
  CheckCircle,
  Zap,
  DollarSign,
  Target,
  Activity,
  TrendingUp,
  BarChart3,
  Settings,
  Shield,
  Percent
} from 'lucide-react';

interface EnhancedPreferredEquityCardProps {
  dealId: string;
  mode?: string;
  onResultsChange?: (results: any) => void;
}

interface PreferredDividendTerms {
  dividendRate: number;
  dividendType: 'cumulative' | 'non_cumulative';
  paymentInKind: boolean;
  compoundingFrequency: 'annual' | 'quarterly' | 'monthly';
}

interface LiquidationPreference {
  preferenceMultiple: number;
  preferenceType: 'non_participating' | 'participating' | 'capped_participating';
  participationCap?: number;
  seniorityRank: number;
}

interface ConversionRights {
  conversionPrice: number;
  conversionRatio: number;
  conversionType: 'optional' | 'mandatory';
  automaticConversionTriggers: {
    ipoTrigger: { valuation: number; pricePerShare: number };
    qualifiedFinancingTrigger: { minimumRaise: number; pricePerShare: number };
  };
}

interface AntiDilutionProtection {
  protectionType: 'full_ratchet' | 'weighted_average_broad' | 'weighted_average_narrow' | 'none';
  carveOuts: string[];
  payToPlayProvision: boolean;
}

interface ValuationScenario {
  scenarioName: string;
  probability: number;
  exitValuation: number;
  exitYear: number;
  type: 'acquisition' | 'ipo' | 'liquidation';
}

interface ScenarioAnalysis {
  scenario: string;
  totalReturn: number;
  irr: number;
  multiple: number;
  conversionValue: number;
  optimalStrategy: 'liquidation' | 'conversion';
}

interface RiskMetrics {
  downside: number;
  upside: number;
  volatility: number;
  probabilityOfLoss: number;
  valueAtRisk: number;
  expectedShortfall: number;
}

interface PreferredEquityResults {
  fairValue: number;
  irr: number;
  multiple: number;
  dividendYield: number;
  expectedReturn: number;
  liquidationValue: {
    liquidationValue: number;
    liquidationMultiple: number;
    optimalChoice: 'liquidation' | 'conversion';
  };
  conversionAnalysis: {
    conversionValue: number;
    conversionProbability: number;
    conversionThreshold: number;
  };
  scenarioAnalysis: ScenarioAnalysis[];
  riskMetrics: RiskMetrics;
  sensitivity: {
    dividendRateSensitivity: Array<{
      input: number;
      fairValue: number;
      irr: number;
    }>;
  };
}

const EnhancedPreferredEquityCard: React.FC<EnhancedPreferredEquityCardProps> = ({ 
  dealId, 
  mode = 'traditional',
  onResultsChange 
}) => {
  const [inputs, setInputs] = useState({
    investmentAmount: 10000000,
    currency: 'USD',
    sharePrice: 10.00,
    sharesIssued: 1000000,
    timeHorizon: 5
  });

  const [preferredDividend, setPreferredDividend] = useState<PreferredDividendTerms>({
    dividendRate: 0.08,
    dividendType: 'cumulative',
    paymentInKind: false,
    compoundingFrequency: 'annual'
  });

  const [liquidationPreference, setLiquidationPreference] = useState<LiquidationPreference>({
    preferenceMultiple: 1.0,
    preferenceType: 'non_participating',
    participationCap: undefined,
    seniorityRank: 1
  });

  const [conversionRights, setConversionRights] = useState<ConversionRights>({
    conversionPrice: 10.00,
    conversionRatio: 1.0,
    conversionType: 'optional',
    automaticConversionTriggers: {
      ipoTrigger: { valuation: 100000000, pricePerShare: 15.00 },
      qualifiedFinancingTrigger: { minimumRaise: 25000000, pricePerShare: 12.00 }
    }
  });

  const [antiDilutionProtection, setAntiDilutionProtection] = useState<AntiDilutionProtection>({
    protectionType: 'weighted_average_broad',
    carveOuts: ['employee_pool', 'convertible_securities'],
    payToPlayProvision: false
  });

  const [valuationScenarios, setValuationScenarios] = useState<ValuationScenario[]>([
    { scenarioName: 'Base Case', probability: 0.4, exitValuation: 50000000, exitYear: 5, type: 'acquisition' },
    { scenarioName: 'Upside', probability: 0.3, exitValuation: 100000000, exitYear: 4, type: 'ipo' },
    { scenarioName: 'Downside', probability: 0.3, exitValuation: 20000000, exitYear: 6, type: 'liquidation' }
  ]);

  const [results, setResults] = useState<PreferredEquityResults | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const runAnalysis = () => {
    setIsCalculating(true);
    
    setTimeout(() => {
      // Mock preferred equity analysis results
      const analysisResults: PreferredEquityResults = {
        fairValue: 12500000,
        irr: 0.162,
        multiple: 1.25,
        dividendYield: 0.08,
        expectedReturn: 0.162,
        liquidationValue: {
          liquidationValue: 10000000,
          liquidationMultiple: 1.0,
          optimalChoice: 'conversion'
        },
        conversionAnalysis: {
          conversionValue: 12500000,
          conversionProbability: 0.67,
          conversionThreshold: 15000000
        },
        scenarioAnalysis: [
          {
            scenario: 'Base Case',
            totalReturn: 11200000,
            irr: 0.145,
            multiple: 1.12,
            conversionValue: 10800000,
            optimalStrategy: 'conversion'
          },
          {
            scenario: 'Upside',
            totalReturn: 18500000,
            irr: 0.228,
            multiple: 1.85,
            conversionValue: 18500000,
            optimalStrategy: 'conversion'
          },
          {
            scenario: 'Downside',
            totalReturn: 8400000,
            irr: 0.065,
            multiple: 0.84,
            conversionValue: 8400000,
            optimalStrategy: 'liquidation'
          }
        ],
        riskMetrics: {
          downside: 0.84,
          upside: 1.85,
          volatility: 0.285,
          probabilityOfLoss: 0.15,
          valueAtRisk: 0.92,
          expectedShortfall: 0.78
        },
        sensitivity: {
          dividendRateSensitivity: [
            { input: 0.06, fairValue: 11800000, irr: 0.142 },
            { input: 0.08, fairValue: 12500000, irr: 0.162 },
            { input: 0.10, fairValue: 13200000, irr: 0.182 },
            { input: 0.12, fairValue: 13900000, irr: 0.202 }
          ]
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
    return `$${(amount / 1000000).toFixed(1)}M`;
  };

  const formatPercentage = (value: number) => {
    return `${(value * 100).toFixed(1)}%`;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Layers className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Enhanced Preferred Equity</h3>
              <p className="text-sm text-gray-600">Complex preferred equity structuring with conversion and liquidation analysis</p>
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
            onClick={() => setActiveTab('overview')}
            className={`pb-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'overview'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('structure')}
            className={`pb-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'structure'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Structure
          </button>
          <button
            onClick={() => setActiveTab('scenarios')}
            className={`pb-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'scenarios'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Scenarios
          </button>
          <button
            onClick={() => setActiveTab('analysis')}
            className={`pb-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'analysis'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Risk Analysis
          </button>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Investment Parameters */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Investment Parameters</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Investment Amount ($)</label>
                  <Input
                    type="number"
                    value={inputs.investmentAmount}
                    onChange={(e) => setInputs(prev => ({ ...prev, investmentAmount: Number(e.target.value) }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Share Price ($)</label>
                  <Input
                    type="number"
                    step="0.01"
                    value={inputs.sharePrice}
                    onChange={(e) => setInputs(prev => ({ ...prev, sharePrice: Number(e.target.value) }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Shares Issued</label>
                  <Input
                    type="number"
                    value={inputs.sharesIssued}
                    onChange={(e) => setInputs(prev => ({ ...prev, sharesIssued: Number(e.target.value) }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Time Horizon (years)</label>
                  <Input
                    type="number"
                    min="1"
                    max="10"
                    value={inputs.timeHorizon}
                    onChange={(e) => setInputs(prev => ({ ...prev, timeHorizon: Number(e.target.value) }))}
                  />
                </div>
              </div>
            </div>

            {/* Key Metrics Display */}
            {results && (
              <Card>
                <CardHeader>
                  <h5 className="font-medium text-gray-900">Key Valuation Metrics</h5>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-2">
                        <DollarSign className="h-5 w-5 text-green-600" />
                      </div>
                      <div className="text-2xl font-bold text-green-600">
                        {formatCurrency(results.fairValue)}
                      </div>
                      <div className="text-sm text-gray-600">Fair Value</div>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-2">
                        <TrendingUp className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="text-2xl font-bold text-blue-600">
                        {formatPercentage(results.irr)}
                      </div>
                      <div className="text-sm text-gray-600">Expected IRR</div>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-2">
                        <BarChart3 className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="text-2xl font-bold text-blue-600">
                        {results.multiple.toFixed(2)}x
                      </div>
                      <div className="text-sm text-gray-600">Multiple</div>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-2">
                        <Percent className="h-5 w-5 text-orange-600" />
                      </div>
                      <div className="text-2xl font-bold text-orange-600">
                        {formatPercentage(results.dividendYield)}
                      </div>
                      <div className="text-sm text-gray-600">Dividend Yield</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Liquidation vs Conversion Analysis */}
            {results && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <h6 className="font-medium text-gray-900">Liquidation Analysis</h6>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Liquidation Value:</span>
                        <span className="font-medium">{formatCurrency(results.liquidationValue.liquidationValue)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Multiple:</span>
                        <span className="font-medium">{results.liquidationValue.liquidationMultiple.toFixed(2)}x</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Optimal Choice:</span>
                        <Badge variant={results.liquidationValue.optimalChoice === 'liquidation' ? "default" : "secondary"}>
                          {results.liquidationValue.optimalChoice}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <h6 className="font-medium text-gray-900">Conversion Analysis</h6>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Conversion Value:</span>
                        <span className="font-medium">{formatCurrency(results.conversionAnalysis.conversionValue)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Probability:</span>
                        <span className="font-medium">{formatPercentage(results.conversionAnalysis.conversionProbability)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Threshold:</span>
                        <span className="font-medium">{formatCurrency(results.conversionAnalysis.conversionThreshold)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        )}

        {/* Structure Tab */}
        {activeTab === 'structure' && (
          <div className="space-y-6">
            {/* Preferred Dividend Terms */}
            <Card>
              <CardHeader>
                <h5 className="font-medium text-gray-900">Preferred Dividend Terms</h5>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Dividend Rate (%)</label>
                    <Input
                      type="number"
                      step="0.1"
                      value={preferredDividend.dividendRate * 100}
                      onChange={(e) => setPreferredDividend(prev => ({ 
                        ...prev, 
                        dividendRate: Number(e.target.value) / 100 
                      }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Dividend Type</label>
                    <select 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                      value={preferredDividend.dividendType}
                      onChange={(e) => setPreferredDividend(prev => ({ 
                        ...prev, 
                        dividendType: e.target.value as any 
                      }))}
                    >
                      <option value="cumulative">Cumulative</option>
                      <option value="non_cumulative">Non-Cumulative</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                    <select 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                      value={preferredDividend.paymentInKind ? 'pik' : 'cash'}
                      onChange={(e) => setPreferredDividend(prev => ({ 
                        ...prev, 
                        paymentInKind: e.target.value === 'pik' 
                      }))}
                    >
                      <option value="cash">Cash</option>
                      <option value="pik">PIK (Payment in Kind)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Compounding</label>
                    <select 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                      value={preferredDividend.compoundingFrequency}
                      onChange={(e) => setPreferredDividend(prev => ({ 
                        ...prev, 
                        compoundingFrequency: e.target.value as any 
                      }))}
                    >
                      <option value="annual">Annual</option>
                      <option value="quarterly">Quarterly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Liquidation Preference */}
            <Card>
              <CardHeader>
                <h5 className="font-medium text-gray-900">Liquidation Preference</h5>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Preference Multiple</label>
                    <Input
                      type="number"
                      step="0.1"
                      min="1.0"
                      value={liquidationPreference.preferenceMultiple}
                      onChange={(e) => setLiquidationPreference(prev => ({ 
                        ...prev, 
                        preferenceMultiple: Number(e.target.value) 
                      }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Preference Type</label>
                    <select 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                      value={liquidationPreference.preferenceType}
                      onChange={(e) => setLiquidationPreference(prev => ({ 
                        ...prev, 
                        preferenceType: e.target.value as any 
                      }))}
                    >
                      <option value="non_participating">Non-Participating</option>
                      <option value="participating">Participating</option>
                      <option value="capped_participating">Capped Participating</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Seniority Rank</label>
                    <Input
                      type="number"
                      min="1"
                      value={liquidationPreference.seniorityRank}
                      onChange={(e) => setLiquidationPreference(prev => ({ 
                        ...prev, 
                        seniorityRank: Number(e.target.value) 
                      }))}
                    />
                  </div>
                  {liquidationPreference.preferenceType === 'capped_participating' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Participation Cap</label>
                      <Input
                        type="number"
                        step="0.1"
                        value={liquidationPreference.participationCap || ''}
                        onChange={(e) => setLiquidationPreference(prev => ({ 
                          ...prev, 
                          participationCap: Number(e.target.value) 
                        }))}
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Anti-Dilution Protection */}
            <Card>
              <CardHeader>
                <h5 className="font-medium text-gray-900">Anti-Dilution Protection</h5>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Protection Type</label>
                    <select 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                      value={antiDilutionProtection.protectionType}
                      onChange={(e) => setAntiDilutionProtection(prev => ({ 
                        ...prev, 
                        protectionType: e.target.value as any 
                      }))}
                    >
                      <option value="none">None</option>
                      <option value="full_ratchet">Full Ratchet</option>
                      <option value="weighted_average_broad">Weighted Average (Broad)</option>
                      <option value="weighted_average_narrow">Weighted Average (Narrow)</option>
                    </select>
                  </div>
                  <div className="flex items-center">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={antiDilutionProtection.payToPlayProvision}
                        onChange={(e) => setAntiDilutionProtection(prev => ({ 
                          ...prev, 
                          payToPlayProvision: e.target.checked 
                        }))}
                        className="mr-2"
                      />
                      <span className="text-sm">Pay-to-Play Provision</span>
                    </label>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Scenarios Tab */}
        {activeTab === 'scenarios' && results && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <h5 className="font-medium text-gray-900">Scenario Analysis</h5>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {results.scenarioAnalysis.map((scenario, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-center mb-3">
                        <h6 className="font-medium">{scenario.scenario}</h6>
                        <Badge variant="outline">
                          {scenario.optimalStrategy}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                        <div>
                          <span className="text-gray-600">Total Return:</span>
                          <div className="font-medium">{formatCurrency(scenario.totalReturn)}</div>
                        </div>
                        <div>
                          <span className="text-gray-600">IRR:</span>
                          <div className="font-medium">{formatPercentage(scenario.irr)}</div>
                        </div>
                        <div>
                          <span className="text-gray-600">Multiple:</span>
                          <div className="font-medium">{scenario.multiple.toFixed(2)}x</div>
                        </div>
                        <div>
                          <span className="text-gray-600">Conversion Value:</span>
                          <div className="font-medium">{formatCurrency(scenario.conversionValue)}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Risk Analysis Tab */}
        {activeTab === 'analysis' && results && (
          <div className="space-y-6">
            {/* Risk Metrics */}
            <Card>
              <CardHeader>
                <h5 className="font-medium text-gray-900">Risk Metrics</h5>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Downside:</span>
                    <div className="font-medium text-red-600">{results.riskMetrics.downside.toFixed(2)}x</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Upside:</span>
                    <div className="font-medium text-green-600">{results.riskMetrics.upside.toFixed(2)}x</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Volatility:</span>
                    <div className="font-medium">{formatPercentage(results.riskMetrics.volatility)}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Probability of Loss:</span>
                    <div className="font-medium">{formatPercentage(results.riskMetrics.probabilityOfLoss)}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Value at Risk:</span>
                    <div className="font-medium">{results.riskMetrics.valueAtRisk.toFixed(2)}x</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Expected Shortfall:</span>
                    <div className="font-medium">{results.riskMetrics.expectedShortfall.toFixed(2)}x</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Sensitivity Analysis */}
            <Card>
              <CardHeader>
                <h5 className="font-medium text-gray-900">Dividend Rate Sensitivity</h5>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">Dividend Rate</th>
                        <th className="text-right py-2">Fair Value</th>
                        <th className="text-right py-2">IRR</th>
                      </tr>
                    </thead>
                    <tbody>
                      {results.sensitivity.dividendRateSensitivity.map((point, index) => (
                        <tr key={index} className="border-b">
                          <td className="py-2">{formatPercentage(point.input)}</td>
                          <td className="text-right py-2 font-medium">{formatCurrency(point.fairValue)}</td>
                          <td className="text-right py-2">{formatPercentage(point.irr)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
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
            {isCalculating ? 'Calculating Valuation...' : 'Calculate Preferred Equity'}
          </Button>
        </div>

        {/* AI Insights for non-traditional modes */}
        {mode !== 'traditional' && results && (
          <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-l-blue-500">
            <div className="flex items-start gap-3">
              <Zap className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h5 className="font-medium text-blue-900 mb-2">AI Preferred Equity Analysis</h5>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Conversion rights provide significant upside capture with 67% probability</li>
                  <li>• Liquidation preference offers downside protection at 1.0x multiple</li>
                  <li>• Consider weighted average anti-dilution for balanced investor protection</li>
                  <li>• Cumulative dividend structure enhances total return profile</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Warning */}
        <div className="flex items-start gap-3 p-3 bg-amber-50 rounded-lg border border-amber-200">
          <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5" />
          <div className="text-sm text-amber-800">
            <strong>Note:</strong> Preferred equity valuation involves complex option-like features and scenario assumptions. 
            Results should be validated with detailed term sheet analysis and legal documentation.
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedPreferredEquityCard;