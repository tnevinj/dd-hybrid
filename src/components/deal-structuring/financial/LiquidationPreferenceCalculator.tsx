/**
 * Liquidation Preference Calculator Component
 * 
 * Specialized calculator for liquidation preference analysis and waterfall modeling.
 * Provides comprehensive analysis of liquidation scenarios, preference stacking,
 * and optimal return strategies across different exit valuations.
 * 
 * Features:
 * - Multi-tier liquidation preference modeling
 * - Participating vs non-participating analysis
 * - Preference stacking and seniority modeling
 * - Waterfall distribution calculations
 * - Interactive exit scenario builder
 * - Cap analysis for participating preferred
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
import { Separator } from '@/components/ui/separator';
import { 
  Layers, 
  TrendingDown, 
  Calculator, 
  BarChart3, 
  PieChart,
  ArrowDown,
  DollarSign,
  AlertTriangle,
  Info,
  Crown
} from 'lucide-react';

type Currency = 'USD' | 'EUR' | 'GBP' | 'CAD';

interface LiquidationTier {
  id: string;
  name: string;
  investment: number;
  preferenceMultiple: number;
  preferenceType: 'non_participating' | 'participating' | 'capped_participating';
  participationCap?: number;
  seniorityRank: number;
  ownershipPercentage: number;
}

interface LiquidationScenario {
  id: string;
  name: string;
  exitValuation: number;
  exitType: 'ipo' | 'acquisition' | 'liquidation' | 'merger';
  managementParticipation: number;
  transactionCosts: number;
}

interface LiquidationResults {
  tier: LiquidationTier;
  liquidationAmount: number;
  participationAmount: number;
  totalReturn: number;
  returnMultiple: number;
  optimalChoice: 'liquidation' | 'conversion' | 'participation';
  asIfConvertedValue: number;
}

interface WaterfallDistribution {
  scenario: LiquidationScenario;
  netProceeds: number;
  distributions: LiquidationResults[];
  remainingProceeds: number;
  commonShareProceeds: number;
}

interface LiquidationPreferenceCalculatorProps {
  dealId: string;
  mode?: 'traditional' | 'assisted' | 'autonomous';
  initialTiers?: LiquidationTier[];
  initialScenarios?: LiquidationScenario[];
  currency?: Currency;
  onCalculationChange?: (results: WaterfallDistribution[]) => void;
  className?: string;
}

const LiquidationPreferenceCalculator: React.FC<LiquidationPreferenceCalculatorProps> = ({
  dealId,
  mode = 'traditional',
  initialTiers,
  initialScenarios,
  currency = 'USD',
  onCalculationChange,
  className
}) => {
  // State management
  const [tiers, setTiers] = useState<LiquidationTier[]>(initialTiers || [
    {
      id: '1',
      name: 'Series A Preferred',
      investment: 5000000,
      preferenceMultiple: 1.0,
      preferenceType: 'non_participating',
      seniorityRank: 1,
      ownershipPercentage: 25
    },
    {
      id: '2',
      name: 'Series B Preferred',
      investment: 10000000,
      preferenceMultiple: 1.0,
      preferenceType: 'participating',
      participationCap: 3.0,
      seniorityRank: 2,
      ownershipPercentage: 30
    }
  ]);

  const [scenarios, setScenarios] = useState<LiquidationScenario[]>(initialScenarios || [
    {
      id: '1',
      name: 'Conservative Exit',
      exitValuation: 25000000,
      exitType: 'acquisition',
      managementParticipation: 0.15,
      transactionCosts: 0.02
    },
    {
      id: '2',
      name: 'Base Case Exit',
      exitValuation: 50000000,
      exitType: 'acquisition',
      managementParticipation: 0.15,
      transactionCosts: 0.02
    },
    {
      id: '3',
      name: 'Upside Exit',
      exitValuation: 100000000,
      exitType: 'ipo',
      managementParticipation: 0.15,
      transactionCosts: 0.05
    }
  ]);

  const [activeTab, setActiveTab] = useState('waterfall');
  const [selectedScenario, setSelectedScenario] = useState('1');

  // Calculate waterfall distributions for all scenarios
  const waterfallResults = useMemo((): WaterfallDistribution[] => {
    return scenarios.map(scenario => {
      // Calculate net proceeds after costs and management participation
      const transactionCosts = scenario.exitValuation * scenario.transactionCosts;
      const managementProceeds = scenario.exitValuation * scenario.managementParticipation;
      const netProceeds = scenario.exitValuation - transactionCosts - managementProceeds;

      // Sort tiers by seniority (lower rank = higher seniority)
      const sortedTiers = [...tiers].sort((a, b) => a.seniorityRank - b.seniorityRank);
      
      let remainingProceeds = netProceeds;
      const distributions: LiquidationResults[] = [];

      // Calculate distributions for each tier
      for (const tier of sortedTiers) {
        const preferenceAmount = tier.investment * tier.preferenceMultiple;
        
        // Calculate as-if-converted value (simplified)
        const totalOwnership = tiers.reduce((sum, t) => sum + t.ownershipPercentage, 0) + 45; // Assume 45% common
        const asIfConvertedValue = (netProceeds * tier.ownershipPercentage) / 100;
        
        let liquidationAmount = 0;
        let participationAmount = 0;
        let totalReturn = 0;
        let optimalChoice: 'liquidation' | 'conversion' | 'participation' = 'liquidation';

        if (tier.preferenceType === 'non_participating') {
          // Non-participating: gets greater of preference or as-if-converted
          liquidationAmount = Math.min(preferenceAmount, remainingProceeds);
          totalReturn = Math.max(liquidationAmount, asIfConvertedValue);
          optimalChoice = liquidationAmount > asIfConvertedValue ? 'liquidation' : 'conversion';
          
          if (optimalChoice === 'liquidation') {
            remainingProceeds -= liquidationAmount;
          }
        } else {
          // Participating: gets preference plus participation
          liquidationAmount = Math.min(preferenceAmount, remainingProceeds);
          remainingProceeds -= liquidationAmount;
          
          // Calculate participation amount
          const participationPercentage = tier.ownershipPercentage / 100;
          participationAmount = remainingProceeds * participationPercentage;
          
          // Apply participation cap if applicable
          if (tier.preferenceType === 'capped_participating' && tier.participationCap) {
            const maxTotal = tier.investment * tier.participationCap;
            const currentTotal = liquidationAmount + participationAmount;
            if (currentTotal > maxTotal) {
              participationAmount = maxTotal - liquidationAmount;
            }
          }
          
          remainingProceeds -= participationAmount;
          totalReturn = liquidationAmount + participationAmount;
          
          // Check if conversion would be better
          if (asIfConvertedValue > totalReturn) {
            optimalChoice = 'conversion';
            totalReturn = asIfConvertedValue;
            // Restore proceeds for other tiers
            remainingProceeds += liquidationAmount + participationAmount;
          } else {
            optimalChoice = 'participation';
          }
        }

        const returnMultiple = totalReturn / tier.investment;

        distributions.push({
          tier,
          liquidationAmount,
          participationAmount,
          totalReturn,
          returnMultiple,
          optimalChoice,
          asIfConvertedValue
        });
      }

      // Remaining proceeds go to common shareholders
      const commonShareProceeds = Math.max(0, remainingProceeds);

      return {
        scenario,
        netProceeds,
        distributions,
        remainingProceeds,
        commonShareProceeds
      };
    });
  }, [tiers, scenarios]);

  // Update parent component when results change
  React.useEffect(() => {
    if (onCalculationChange) {
      onCalculationChange(waterfallResults);
    }
  }, [waterfallResults, onCalculationChange]);

  // Helper functions
  const addTier = () => {
    const newTier: LiquidationTier = {
      id: Date.now().toString(),
      name: `Series ${String.fromCharCode(65 + tiers.length)} Preferred`,
      investment: 5000000,
      preferenceMultiple: 1.0,
      preferenceType: 'non_participating',
      seniorityRank: tiers.length + 1,
      ownershipPercentage: 20
    };
    setTiers([...tiers, newTier]);
  };

  const updateTier = (index: number, updates: Partial<LiquidationTier>) => {
    const newTiers = [...tiers];
    newTiers[index] = { ...newTiers[index], ...updates };
    setTiers(newTiers);
  };

  const removeTier = (index: number) => {
    if (tiers.length > 1) {
      setTiers(tiers.filter((_, i) => i !== index));
    }
  };

  const addScenario = () => {
    const newScenario: LiquidationScenario = {
      id: Date.now().toString(),
      name: `Scenario ${scenarios.length + 1}`,
      exitValuation: 50000000,
      exitType: 'acquisition',
      managementParticipation: 0.15,
      transactionCosts: 0.02
    };
    setScenarios([...scenarios, newScenario]);
  };

  const updateScenario = (index: number, updates: Partial<LiquidationScenario>) => {
    const newScenarios = [...scenarios];
    newScenarios[index] = { ...newScenarios[index], ...updates };
    setScenarios(newScenarios);
  };

  const formatCurrency = (amount: number, curr: Currency = currency) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: curr,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Get current scenario results
  const currentResults = waterfallResults.find(r => r.scenario.id === selectedScenario) || waterfallResults[0];

  return (
    <Card className={`w-full ${className}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="h-5 w-5 text-blue-600" />
            <CardTitle>Liquidation Preference Calculator</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">
              {tiers.length} Tier{tiers.length > 1 ? 's' : ''}
            </Badge>
            <Badge variant="outline">
              {scenarios.length} Scenario{scenarios.length > 1 ? 's' : ''}
            </Badge>
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
            <TabsTrigger value="waterfall">Waterfall</TabsTrigger>
            <TabsTrigger value="tiers">Tiers</TabsTrigger>
            <TabsTrigger value="scenarios">Scenarios</TabsTrigger>
            <TabsTrigger value="analysis">Analysis</TabsTrigger>
          </TabsList>

          <TabsContent value="waterfall" className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Liquidation Waterfall Distribution</h3>
                <Select value={selectedScenario} onValueChange={setSelectedScenario}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Select scenario" />
                  </SelectTrigger>
                  <SelectContent>
                    {scenarios.map((scenario) => (
                      <SelectItem key={scenario.id} value={scenario.id}>
                        {scenario.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {currentResults && (
                <div className="space-y-4">
                  {/* Scenario Summary */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-3">{currentResults.scenario.name} - Summary</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Exit Valuation:</span>
                        <div className="font-medium">{formatCurrency(currentResults.scenario.exitValuation)}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Net Proceeds:</span>
                        <div className="font-medium">{formatCurrency(currentResults.netProceeds)}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Preferred Total:</span>
                        <div className="font-medium">
                          {formatCurrency(
                            currentResults.distributions.reduce((sum, d) => sum + d.totalReturn, 0)
                          )}
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-600">Common Proceeds:</span>
                        <div className="font-medium">{formatCurrency(currentResults.commonShareProceeds)}</div>
                      </div>
                    </div>
                  </div>

                  {/* Waterfall Visualization */}
                  <div className="space-y-3">
                    <h4 className="font-medium flex items-center gap-2">
                      <ArrowDown className="h-4 w-4" />
                      Distribution Waterfall
                    </h4>
                    
                    {currentResults.distributions.map((result, index) => (
                      <Card key={result.tier.id} className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <Crown className="h-4 w-4 text-yellow-600" />
                            <span className="font-medium">{result.tier.name}</span>
                            <Badge variant="outline" className="text-xs">
                              Rank {result.tier.seniorityRank}
                            </Badge>
                          </div>
                          <Badge variant={result.optimalChoice === 'participation' ? 'default' : 
                                        result.optimalChoice === 'conversion' ? 'secondary' : 'outline'}>
                            {result.optimalChoice.toUpperCase()}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">Investment:</span>
                            <div className="font-medium">{formatCurrency(result.tier.investment)}</div>
                          </div>
                          <div>
                            <span className="text-gray-600">Liquidation Pref:</span>
                            <div className="font-medium">{formatCurrency(result.liquidationAmount)}</div>
                          </div>
                          <div>
                            <span className="text-gray-600">Participation:</span>
                            <div className="font-medium">{formatCurrency(result.participationAmount)}</div>
                          </div>
                          <div>
                            <span className="text-gray-600">Total Return:</span>
                            <div className="font-medium text-green-600">{formatCurrency(result.totalReturn)}</div>
                          </div>
                          <div>
                            <span className="text-gray-600">Multiple:</span>
                            <div className={`font-medium ${result.returnMultiple > 1 ? 'text-green-600' : 'text-red-600'}`}>
                              {result.returnMultiple.toFixed(2)}x
                            </div>
                          </div>
                        </div>

                        {/* Preference Type Details */}
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <div className="flex items-center justify-between text-xs text-gray-600">
                            <span>
                              {result.tier.preferenceMultiple}x {result.tier.preferenceType.replace('_', ' ')} preference
                              {result.tier.participationCap && ` (${result.tier.participationCap}x cap)`}
                            </span>
                            <span>
                              As-if-converted: {formatCurrency(result.asIfConvertedValue)}
                            </span>
                          </div>
                        </div>
                      </Card>
                    ))}

                    {/* Common Share Distribution */}
                    <Card className="p-4 bg-blue-50">
                      <div className="flex items-center gap-2 mb-2">
                        <PieChart className="h-4 w-4 text-blue-600" />
                        <span className="font-medium">Common Shareholders</span>
                      </div>
                      <div className="text-lg font-bold text-blue-600">
                        {formatCurrency(currentResults.commonShareProceeds)}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        Remaining proceeds after preferred distributions
                      </div>
                    </Card>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="tiers" className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Liquidation Preference Tiers</h3>
                <Button onClick={addTier} variant="outline" size="sm">
                  Add Tier
                </Button>
              </div>

              <div className="space-y-4">
                {tiers.map((tier, index) => (
                  <Card key={tier.id} className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium">{tier.name}</h4>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">Rank {tier.seniorityRank}</Badge>
                        <Button 
                          onClick={() => removeTier(index)}
                          variant="ghost" 
                          size="sm"
                          disabled={tiers.length <= 1}
                        >
                          Remove
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor={`tier-name-${index}`}>Tier Name</Label>
                        <Input
                          id={`tier-name-${index}`}
                          value={tier.name}
                          onChange={(e) => updateTier(index, { name: e.target.value })}
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label htmlFor={`tier-investment-${index}`}>Investment Amount</Label>
                        <Input
                          id={`tier-investment-${index}`}
                          type="number"
                          value={tier.investment}
                          onChange={(e) => updateTier(index, { investment: Number(e.target.value) })}
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label htmlFor={`tier-multiple-${index}`}>Preference Multiple</Label>
                        <Input
                          id={`tier-multiple-${index}`}
                          type="number"
                          step="0.1"
                          min="0.1"
                          max="10"
                          value={tier.preferenceMultiple}
                          onChange={(e) => updateTier(index, { preferenceMultiple: Number(e.target.value) })}
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label htmlFor={`tier-type-${index}`}>Preference Type</Label>
                        <Select 
                          value={tier.preferenceType} 
                          onValueChange={(value) => updateTier(index, { preferenceType: value as any })}
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="non_participating">Non-Participating</SelectItem>
                            <SelectItem value="participating">Participating</SelectItem>
                            <SelectItem value="capped_participating">Capped Participating</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {tier.preferenceType === 'capped_participating' && (
                        <div>
                          <Label htmlFor={`tier-cap-${index}`}>Participation Cap</Label>
                          <Input
                            id={`tier-cap-${index}`}
                            type="number"
                            step="0.1"
                            value={tier.participationCap || 3.0}
                            onChange={(e) => updateTier(index, { participationCap: Number(e.target.value) })}
                            className="mt-1"
                          />
                        </div>
                      )}

                      <div>
                        <Label htmlFor={`tier-seniority-${index}`}>Seniority Rank</Label>
                        <Input
                          id={`tier-seniority-${index}`}
                          type="number"
                          min="1"
                          value={tier.seniorityRank}
                          onChange={(e) => updateTier(index, { seniorityRank: Number(e.target.value) })}
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label htmlFor={`tier-ownership-${index}`}>Ownership %</Label>
                        <Input
                          id={`tier-ownership-${index}`}
                          type="number"
                          min="0"
                          max="100"
                          value={tier.ownershipPercentage}
                          onChange={(e) => updateTier(index, { ownershipPercentage: Number(e.target.value) })}
                          className="mt-1"
                        />
                      </div>
                    </div>

                    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                      <div className="text-sm text-gray-600">
                        <strong>Liquidation Preference:</strong> {formatCurrency(tier.investment * tier.preferenceMultiple)}
                        {tier.preferenceType !== 'non_participating' && (
                          <span> + {tier.ownershipPercentage}% participation</span>
                        )}
                        {tier.participationCap && (
                          <span> (capped at {tier.participationCap}x)</span>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="scenarios" className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Exit Scenarios</h3>
                <Button onClick={addScenario} variant="outline" size="sm">
                  Add Scenario
                </Button>
              </div>

              <div className="space-y-4">
                {scenarios.map((scenario, index) => (
                  <Card key={scenario.id} className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                        <Label htmlFor={`scenario-valuation-${index}`}>Exit Valuation</Label>
                        <Input
                          id={`scenario-valuation-${index}`}
                          type="number"
                          value={scenario.exitValuation}
                          onChange={(e) => updateScenario(index, { exitValuation: Number(e.target.value) })}
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label htmlFor={`scenario-type-${index}`}>Exit Type</Label>
                        <Select 
                          value={scenario.exitType} 
                          onValueChange={(value) => updateScenario(index, { exitType: value as any })}
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ipo">IPO</SelectItem>
                            <SelectItem value="acquisition">Acquisition</SelectItem>
                            <SelectItem value="merger">Merger</SelectItem>
                            <SelectItem value="liquidation">Liquidation</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor={`scenario-mgmt-${index}`}>Management Participation (%)</Label>
                        <Input
                          id={`scenario-mgmt-${index}`}
                          type="number"
                          min="0"
                          max="50"
                          step="1"
                          value={scenario.managementParticipation * 100}
                          onChange={(e) => updateScenario(index, { managementParticipation: Number(e.target.value) / 100 })}
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label htmlFor={`scenario-costs-${index}`}>Transaction Costs (%)</Label>
                        <Input
                          id={`scenario-costs-${index}`}
                          type="number"
                          min="0"
                          max="10"
                          step="0.1"
                          value={scenario.transactionCosts * 100}
                          onChange={(e) => updateScenario(index, { transactionCosts: Number(e.target.value) / 100 })}
                          className="mt-1"
                        />
                      </div>
                    </div>

                    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                      <div className="text-sm text-gray-600">
                        <strong>Net Proceeds:</strong> {formatCurrency(
                          scenario.exitValuation * (1 - scenario.transactionCosts - scenario.managementParticipation)
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="analysis" className="space-y-6">
            <div className="space-y-4">
              <h3 className="font-semibold">Comparative Analysis</h3>

              {/* Scenario Comparison Table */}
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300 text-sm">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-300 p-2 text-left">Scenario</th>
                      <th className="border border-gray-300 p-2 text-right">Exit Value</th>
                      <th className="border border-gray-300 p-2 text-right">Net Proceeds</th>
                      {tiers.map(tier => (
                        <th key={tier.id} className="border border-gray-300 p-2 text-right">{tier.name}</th>
                      ))}
                      <th className="border border-gray-300 p-2 text-right">Common</th>
                    </tr>
                  </thead>
                  <tbody>
                    {waterfallResults.map(result => (
                      <tr key={result.scenario.id}>
                        <td className="border border-gray-300 p-2 font-medium">{result.scenario.name}</td>
                        <td className="border border-gray-300 p-2 text-right">
                          {formatCurrency(result.scenario.exitValuation)}
                        </td>
                        <td className="border border-gray-300 p-2 text-right">
                          {formatCurrency(result.netProceeds)}
                        </td>
                        {result.distributions.map(dist => (
                          <td key={dist.tier.id} className="border border-gray-300 p-2 text-right">
                            <div>{formatCurrency(dist.totalReturn)}</div>
                            <div className="text-xs text-gray-500">{dist.returnMultiple.toFixed(2)}x</div>
                          </td>
                        ))}
                        <td className="border border-gray-300 p-2 text-right">
                          {formatCurrency(result.commonShareProceeds)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Key Insights */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Alert>
                  <BarChart3 className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Total Invested Capital:</strong><br/>
                    {formatCurrency(tiers.reduce((sum, tier) => sum + tier.investment, 0))} across {tiers.length} tier{tiers.length > 1 ? 's' : ''}
                  </AlertDescription>
                </Alert>

                <Alert>
                  <TrendingDown className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Liquidation Preference Coverage:</strong><br/>
                    Total preference amount: {formatCurrency(
                      tiers.reduce((sum, tier) => sum + tier.investment * tier.preferenceMultiple, 0)
                    )}
                  </AlertDescription>
                </Alert>
              </div>

              {/* Participating vs Non-Participating Analysis */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium mb-3">Preference Type Impact</h4>
                <div className="space-y-2 text-sm">
                  <div>
                    <strong>Non-Participating Preferred:</strong> Gets the greater of liquidation preference or as-if-converted value.
                    Provides downside protection but limited upside participation.
                  </div>
                  <div>
                    <strong>Participating Preferred:</strong> Gets liquidation preference plus pro-rata participation.
                    Provides both downside protection and upside participation.
                  </div>
                  <div>
                    <strong>Capped Participating:</strong> Participating up to a cap (typically 2-3x).
                    Balances investor protection with founder/common shareholder interests.
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

export default LiquidationPreferenceCalculator;