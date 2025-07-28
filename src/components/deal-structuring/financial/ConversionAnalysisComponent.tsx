/**
 * Conversion Analysis Component
 * 
 * Advanced conversion analysis interface for preferred equity investments.
 * Provides comprehensive modeling of conversion scenarios, timing optimization,
 * and strategic conversion decision support.
 * 
 * Features:
 * - Conversion value modeling across scenarios
 * - Optimal conversion timing analysis
 * - Automatic conversion trigger evaluation
 * - Dilution impact assessment
 * - Interactive scenario comparison
 * - Real-time conversion recommendations
 */

'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { 
  RefreshCw, 
  TrendingUp, 
  Target, 
  Clock, 
  Calculator, 
  BarChart3,
  AlertCircle,
  CheckCircle,
  ArrowRight,
  DollarSign
} from 'lucide-react';

type Currency = 'USD' | 'EUR' | 'GBP' | 'CAD';

interface ConversionRights {
  conversionPrice: number;
  conversionRatio: number;
  conversionType: 'optional' | 'mandatory';
  automaticConversionTriggers?: {
    ipoTrigger?: { valuation: number; pricePerShare: number };
    qualifiedFinancingTrigger?: { minimumRaise: number; pricePerShare: number };
  };
}

interface ConversionScenario {
  id: string;
  name: string;
  companyValuation: number;
  timeToConversion: number; // years
  triggerType: 'manual' | 'automatic' | 'ipo' | 'qualified_financing';
  expectedReturnMultiple: number;
}

interface ConversionAnalysisInputs {
  originalInvestment: number;
  currency: Currency;
  conversionRights: ConversionRights;
  liquidationPreferenceAmount: number;
  currentCompanyValuation: number;
  totalSharesOutstanding: number;
  projectedGrowthRate: number;
  timeHorizon: number;
  scenarios: ConversionScenario[];
}

interface ConversionResults {
  conversionValue: number;
  liquidationValue: number;
  optimalStrategy: 'convert' | 'hold' | 'liquidate';
  conversionRatio: number;
  dilutionImpact: number;
  breakEvenValuation: number;
  timeValueOfMoney: number;
  optimalTiming: number;
}

interface ConversionAnalysisComponentProps {
  dealId: string;
  mode?: 'traditional' | 'assisted' | 'autonomous';
  initialInputs?: Partial<ConversionAnalysisInputs>;
  onAnalysisChange?: (results: ConversionResults[]) => void;
  className?: string;
}

const ConversionAnalysisComponent: React.FC<ConversionAnalysisComponentProps> = ({
  dealId,
  mode = 'traditional',
  initialInputs,
  onAnalysisChange,
  className
}) => {
  // State management
  const [inputs, setInputs] = useState<ConversionAnalysisInputs>({
    originalInvestment: 10000000,
    currency: 'USD',
    conversionRights: {
      conversionPrice: 2.00,
      conversionRatio: 1.0,
      conversionType: 'optional',
      automaticConversionTriggers: {
        ipoTrigger: { valuation: 100000000, pricePerShare: 5.00 },
        qualifiedFinancingTrigger: { minimumRaise: 25000000, pricePerShare: 4.00 }
      }
    },
    liquidationPreferenceAmount: 10000000,
    currentCompanyValuation: 50000000,
    totalSharesOutstanding: 25000000,
    projectedGrowthRate: 0.25,
    timeHorizon: 5,
    scenarios: [
      {
        id: '1',
        name: 'Conservative Growth',
        companyValuation: 75000000,
        timeToConversion: 3,
        triggerType: 'manual',
        expectedReturnMultiple: 2.0
      },
      {
        id: '2',
        name: 'Base Case',
        companyValuation: 125000000,
        timeToConversion: 4,
        triggerType: 'ipo',
        expectedReturnMultiple: 3.0
      },
      {
        id: '3',
        name: 'High Growth',
        companyValuation: 200000000,
        timeToConversion: 5,
        triggerType: 'ipo',
        expectedReturnMultiple: 5.0
      }
    ],
    ...initialInputs
  });

  const [activeTab, setActiveTab] = useState('scenarios');
  const [selectedScenario, setSelectedScenario] = useState<string>('1');

  // Calculate conversion analysis for each scenario
  const analysisResults = useMemo((): ConversionResults[] => {
    return inputs.scenarios.map(scenario => {
      const conversionShares = inputs.originalInvestment / inputs.conversionRights.conversionPrice;
      const totalSharesAfterConversion = inputs.totalSharesOutstanding + conversionShares;
      const conversionValue = (scenario.companyValuation * conversionShares) / totalSharesAfterConversion;
      
      // Account for time value of money
      const discountRate = 0.12; // Assuming 12% discount rate
      const timeValueOfMoney = conversionValue / Math.pow(1 + discountRate, scenario.timeToConversion);
      
      // Determine optimal strategy
      let optimalStrategy: 'convert' | 'hold' | 'liquidate';
      if (conversionValue > inputs.liquidationPreferenceAmount) {
        optimalStrategy = 'convert';
      } else if (scenario.companyValuation < inputs.currentCompanyValuation * 0.5) {
        optimalStrategy = 'liquidate';
      } else {
        optimalStrategy = 'hold';
      }

      // Calculate break-even valuation
      const breakEvenValuation = (inputs.liquidationPreferenceAmount * totalSharesAfterConversion) / conversionShares;
      
      // Calculate dilution impact
      const dilutionImpact = conversionShares / totalSharesAfterConversion;

      return {
        conversionValue,
        liquidationValue: inputs.liquidationPreferenceAmount,
        optimalStrategy,
        conversionRatio: inputs.conversionRights.conversionRatio,
        dilutionImpact,
        breakEvenValuation,
        timeValueOfMoney,
        optimalTiming: scenario.timeToConversion
      };
    });
  }, [inputs]);

  // Update parent component when results change
  React.useEffect(() => {
    if (onAnalysisChange) {
      onAnalysisChange(analysisResults);
    }
  }, [analysisResults, onAnalysisChange]);

  // Helper functions
  const updateInputs = (updates: Partial<ConversionAnalysisInputs>) => {
    setInputs(prev => ({ ...prev, ...updates }));
  };

  const updateConversionRights = (updates: Partial<ConversionRights>) => {
    setInputs(prev => ({
      ...prev,
      conversionRights: { ...prev.conversionRights, ...updates }
    }));
  };

  const updateScenario = (index: number, updates: Partial<ConversionScenario>) => {
    const newScenarios = [...inputs.scenarios];
    newScenarios[index] = { ...newScenarios[index], ...updates };
    updateInputs({ scenarios: newScenarios });
  };

  const addScenario = () => {
    const newScenario: ConversionScenario = {
      id: Date.now().toString(),
      name: `Scenario ${inputs.scenarios.length + 1}`,
      companyValuation: inputs.currentCompanyValuation * 1.5,
      timeToConversion: 3,
      triggerType: 'manual',
      expectedReturnMultiple: 2.0
    };
    updateInputs({ scenarios: [...inputs.scenarios, newScenario] });
  };

  const formatCurrency = (amount: number, curr: Currency = inputs.currency) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: curr,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'percent',
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    }).format(value);
  };

  // Get current scenario results
  const currentResults = analysisResults[inputs.scenarios.findIndex(s => s.id === selectedScenario)] || analysisResults[0];

  return (
    <Card className={`w-full ${className}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5 text-blue-600" />
            <CardTitle>Conversion Analysis</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">
              {inputs.scenarios.length} Scenario{inputs.scenarios.length > 1 ? 's' : ''}
            </Badge>
            {currentResults && (
              <Badge variant={currentResults.optimalStrategy === 'convert' ? 'default' : 'outline'}>
                {currentResults.optimalStrategy.toUpperCase()}
              </Badge>
            )}
            {mode !== 'traditional' && (
              <Badge variant="outline">
                {mode}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="scenarios">Scenarios</TabsTrigger>
            <TabsTrigger value="analysis">Analysis</TabsTrigger>
            <TabsTrigger value="timing">Timing</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="scenarios" className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Conversion Scenarios</h3>
                <Button onClick={addScenario} variant="outline" size="sm">
                  Add Scenario
                </Button>
              </div>

              {/* Scenario Selection */}
              <div>
                <Label htmlFor="scenarioSelect">Active Scenario</Label>
                <Select value={selectedScenario} onValueChange={setSelectedScenario}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select scenario" />
                  </SelectTrigger>
                  <SelectContent>
                    {inputs.scenarios.map((scenario) => (
                      <SelectItem key={scenario.id} value={scenario.id}>
                        {scenario.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Current Scenario Results */}
              {currentResults && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-3">Current Scenario Results</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-sm text-gray-600">Conversion Value</div>
                      <div className="text-lg font-bold text-blue-600">
                        {formatCurrency(currentResults.conversionValue)}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-600">Multiple</div>
                      <div className="text-lg font-bold text-green-600">
                        {(currentResults.conversionValue / inputs.originalInvestment).toFixed(2)}x
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-600">Strategy</div>
                      <div className="text-lg font-bold">
                        <Badge variant={currentResults.optimalStrategy === 'convert' ? 'default' : 'secondary'}>
                          {currentResults.optimalStrategy.toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-600">Dilution</div>
                      <div className="text-lg font-bold text-orange-600">
                        {formatPercentage(currentResults.dilutionImpact)}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Scenario Configuration */}
              <div className="space-y-4">
                {inputs.scenarios.map((scenario, index) => (
                  <Card key={scenario.id} className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium">{scenario.name}</h4>
                      <Badge variant={scenario.id === selectedScenario ? 'default' : 'outline'}>
                        {analysisResults[index]?.optimalStrategy.toUpperCase()}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div>
                        <Label htmlFor={`scenario-name-${index}`}>Scenario Name</Label>
                        <Input
                          id={`scenario-name-${index}`}
                          value={scenario.name}
                          onChange={(e) => updateScenario(index, { name: e.target.value })}
                          className="mt-1"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor={`scenario-valuation-${index}`}>Company Valuation</Label>
                        <Input
                          id={`scenario-valuation-${index}`}
                          type="number"
                          value={scenario.companyValuation}
                          onChange={(e) => updateScenario(index, { companyValuation: Number(e.target.value) })}
                          className="mt-1"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor={`scenario-timing-${index}`}>Time to Conversion (Years)</Label>
                        <Input
                          id={`scenario-timing-${index}`}
                          type="number"
                          min="0.5"
                          max="10"
                          step="0.5"
                          value={scenario.timeToConversion}
                          onChange={(e) => updateScenario(index, { timeToConversion: Number(e.target.value) })}
                          className="mt-1"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor={`scenario-trigger-${index}`}>Trigger Type</Label>
                        <Select 
                          value={scenario.triggerType} 
                          onValueChange={(value) => updateScenario(index, { triggerType: value as any })}
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Select trigger" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="manual">Manual</SelectItem>
                            <SelectItem value="automatic">Automatic</SelectItem>
                            <SelectItem value="ipo">IPO</SelectItem>
                            <SelectItem value="qualified_financing">Qualified Financing</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Results for this scenario */}
                    {analysisResults[index] && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="grid grid-cols-3 md:grid-cols-6 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">Conversion Value:</span>
                            <div className="font-medium">
                              {formatCurrency(analysisResults[index].conversionValue)}
                            </div>
                          </div>
                          <div>
                            <span className="text-gray-600">Multiple:</span>
                            <div className="font-medium">
                              {(analysisResults[index].conversionValue / inputs.originalInvestment).toFixed(2)}x
                            </div>
                          </div>
                          <div>
                            <span className="text-gray-600">Break-even:</span>
                            <div className="font-medium">
                              {formatCurrency(analysisResults[index].breakEvenValuation)}
                            </div>
                          </div>
                          <div>
                            <span className="text-gray-600">PV (12% discount):</span>
                            <div className="font-medium">
                              {formatCurrency(analysisResults[index].timeValueOfMoney)}
                            </div>
                          </div>
                          <div>
                            <span className="text-gray-600">Dilution:</span>
                            <div className="font-medium">
                              {formatPercentage(analysisResults[index].dilutionImpact)}
                            </div>
                          </div>
                          <div>
                            <span className="text-gray-600">Recommendation:</span>
                            <div className="font-medium">
                              <Badge variant={analysisResults[index].optimalStrategy === 'convert' ? 'default' : 'secondary'} className="text-xs">
                                {analysisResults[index].optimalStrategy}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="analysis" className="space-y-6">
            <div className="space-y-4">
              <h3 className="font-semibold">Conversion Decision Analysis</h3>

              {/* Decision Matrix */}
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-300 p-2 text-left">Scenario</th>
                      <th className="border border-gray-300 p-2 text-right">Company Valuation</th>
                      <th className="border border-gray-300 p-2 text-right">Conversion Value</th>
                      <th className="border border-gray-300 p-2 text-right">Liquidation Value</th>
                      <th className="border border-gray-300 p-2 text-right">Multiple</th>
                      <th className="border border-gray-300 p-2 text-right">Recommendation</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inputs.scenarios.map((scenario, index) => {
                      const result = analysisResults[index];
                      if (!result) return null;
                      
                      return (
                        <tr key={scenario.id} className={scenario.id === selectedScenario ? 'bg-blue-50' : ''}>
                          <td className="border border-gray-300 p-2 font-medium">{scenario.name}</td>
                          <td className="border border-gray-300 p-2 text-right">
                            {formatCurrency(scenario.companyValuation)}
                          </td>
                          <td className="border border-gray-300 p-2 text-right">
                            {formatCurrency(result.conversionValue)}
                          </td>
                          <td className="border border-gray-300 p-2 text-right">
                            {formatCurrency(result.liquidationValue)}
                          </td>
                          <td className="border border-gray-300 p-2 text-right">
                            <span className={result.conversionValue > result.liquidationValue ? 'text-green-600' : 'text-red-600'}>
                              {(result.conversionValue / inputs.originalInvestment).toFixed(2)}x
                            </span>
                          </td>
                          <td className="border border-gray-300 p-2 text-center">
                            <Badge 
                              variant={result.optimalStrategy === 'convert' ? 'default' : 
                                     result.optimalStrategy === 'hold' ? 'secondary' : 'outline'}
                            >
                              {result.optimalStrategy}
                            </Badge>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Key Insights */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Alert>
                  <Target className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Break-even Analysis:</strong><br/>
                    Conversion becomes optimal at company valuations above{' '}
                    {formatCurrency(currentResults?.breakEvenValuation || 0)}.
                    Current valuation: {formatCurrency(inputs.currentCompanyValuation)}.
                  </AlertDescription>
                </Alert>

                <Alert>
                  <TrendingUp className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Growth Sensitivity:</strong><br/>
                    At {formatPercentage(inputs.projectedGrowthRate)} annual growth, 
                    company valuation could reach {formatCurrency(
                      inputs.currentCompanyValuation * Math.pow(1 + inputs.projectedGrowthRate, inputs.timeHorizon)
                    )} in {inputs.timeHorizon} years.
                  </AlertDescription>
                </Alert>
              </div>

              {/* Automatic Conversion Triggers */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium mb-3">Automatic Conversion Triggers</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-blue-700 font-medium">IPO Trigger:</span>
                    <div>Valuation: {formatCurrency(inputs.conversionRights.automaticConversionTriggers?.ipoTrigger?.valuation || 0)}</div>
                    <div>Price per Share: {formatCurrency(inputs.conversionRights.automaticConversionTriggers?.ipoTrigger?.pricePerShare || 0)}</div>
                  </div>
                  <div>
                    <span className="text-blue-700 font-medium">Qualified Financing:</span>
                    <div>Minimum Raise: {formatCurrency(inputs.conversionRights.automaticConversionTriggers?.qualifiedFinancingTrigger?.minimumRaise || 0)}</div>
                    <div>Price per Share: {formatCurrency(inputs.conversionRights.automaticConversionTriggers?.qualifiedFinancingTrigger?.pricePerShare || 0)}</div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="timing" className="space-y-6">
            <div className="space-y-4">
              <h3 className="font-semibold">Optimal Conversion Timing</h3>

              {/* Time Value Analysis */}
              <div className="space-y-4">
                <h4 className="font-medium">Time Value of Money Impact</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {inputs.scenarios.map((scenario, index) => {
                    const result = analysisResults[index];
                    if (!result) return null;

                    const presentValue = result.timeValueOfMoney;
                    const futureValue = result.conversionValue;
                    const timeValue = futureValue - presentValue;

                    return (
                      <Card key={scenario.id} className="p-4">
                        <h5 className="font-medium mb-2">{scenario.name}</h5>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Future Value:</span>
                            <span className="font-medium">{formatCurrency(futureValue)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Present Value:</span>
                            <span className="font-medium">{formatCurrency(presentValue)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Time Cost:</span>
                            <span className="font-medium text-red-600">{formatCurrency(timeValue)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Years to Convert:</span>
                            <span className="font-medium">{scenario.timeToConversion}</span>
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </div>

              {/* Timing Recommendations */}
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Timing Recommendations
                </h4>
                <div className="space-y-2 text-sm">
                  <div>
                    <strong>Immediate Conversion:</strong> Consider if current company valuation exceeds{' '}
                    {formatCurrency(currentResults?.breakEvenValuation || 0)} and you need liquidity.
                  </div>
                  <div>
                    <strong>Wait for Trigger Events:</strong> IPO or qualified financing events typically provide optimal conversion timing 
                    with maximum valuation and liquidity.
                  </div>
                  <div>
                    <strong>Time Decay:</strong> Each year of delay reduces present value by approximately{' '}
                    {formatPercentage(0.12)} (assuming 12% discount rate).
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <div className="space-y-4">
              <h3 className="font-semibold">Configuration Settings</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Settings */}
                <div className="space-y-4">
                  <h4 className="font-medium">Investment Parameters</h4>
                  
                  <div>
                    <Label htmlFor="originalInvestment">Original Investment</Label>
                    <Input
                      id="originalInvestment"
                      type="number"
                      value={inputs.originalInvestment}
                      onChange={(e) => updateInputs({ originalInvestment: Number(e.target.value) })}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="liquidationPreference">Liquidation Preference</Label>
                    <Input
                      id="liquidationPreference"
                      type="number"
                      value={inputs.liquidationPreferenceAmount}
                      onChange={(e) => updateInputs({ liquidationPreferenceAmount: Number(e.target.value) })}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="currentValuation">Current Company Valuation</Label>
                    <Input
                      id="currentValuation"
                      type="number"
                      value={inputs.currentCompanyValuation}
                      onChange={(e) => updateInputs({ currentCompanyValuation: Number(e.target.value) })}
                      className="mt-1"
                    />
                  </div>
                </div>

                {/* Conversion Settings */}
                <div className="space-y-4">
                  <h4 className="font-medium">Conversion Rights</h4>

                  <div>
                    <Label htmlFor="conversionPrice">Conversion Price</Label>
                    <Input
                      id="conversionPrice"
                      type="number"
                      step="0.01"
                      value={inputs.conversionRights.conversionPrice}
                      onChange={(e) => updateConversionRights({ conversionPrice: Number(e.target.value) })}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="conversionRatio">Conversion Ratio</Label>
                    <Input
                      id="conversionRatio"
                      type="number"
                      step="0.01"
                      value={inputs.conversionRights.conversionRatio}
                      onChange={(e) => updateConversionRights({ conversionRatio: Number(e.target.value) })}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="totalShares">Total Shares Outstanding</Label>
                    <Input
                      id="totalShares"
                      type="number"
                      value={inputs.totalSharesOutstanding}
                      onChange={(e) => updateInputs({ totalSharesOutstanding: Number(e.target.value) })}
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>

              {/* Growth Projections */}
              <div className="space-y-4">
                <h4 className="font-medium">Growth Projections</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="growthRate">Projected Annual Growth Rate</Label>
                    <div className="mt-2">
                      <Slider
                        value={[inputs.projectedGrowthRate * 100]}
                        onValueChange={(value) => updateInputs({ projectedGrowthRate: value[0] / 100 })}
                        max={100}
                        min={-20}
                        step={1}
                        className="w-full"
                      />
                      <div className="flex justify-between text-sm text-gray-500 mt-1">
                        <span>-20%</span>
                        <span className="font-medium">{formatPercentage(inputs.projectedGrowthRate)}</span>
                        <span>100%</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="timeHorizon">Analysis Time Horizon (Years)</Label>
                    <div className="mt-2">
                      <Slider
                        value={[inputs.timeHorizon]}
                        onValueChange={(value) => updateInputs({ timeHorizon: value[0] })}
                        max={10}
                        min={1}
                        step={1}
                        className="w-full"
                      />
                      <div className="flex justify-between text-sm text-gray-500 mt-1">
                        <span>1 year</span>
                        <span className="font-medium">{inputs.timeHorizon} years</span>
                        <span>10 years</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ConversionAnalysisComponent;