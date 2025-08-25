'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3,
  TrendingUp,
  Calculator,
  Settings,
  Download,
  AlertCircle,
  CheckCircle,
  Zap,
  Users,
  DollarSign
} from 'lucide-react';

interface WaterfallModelingCardProps {
  dealId: string;
  mode?: string;
  onResultsChange?: (results: any) => void;
}

interface WaterfallResults {
  totalDistribution: number;
  lpDistribution: number;
  gpDistribution: number;
  carryRate: number;
  catchupThreshold: number;
  hurdleRate: number;
  calculations: {
    netProceeds: number;
    lpReturn: number;
    gpCatchup: number;
    carryDistribution: number;
  };
}

const WaterfallModelingCard: React.FC<WaterfallModelingCardProps> = ({ 
  dealId, 
  mode = 'traditional',
  onResultsChange 
}) => {
  const [inputs, setInputs] = useState({
    totalProceeds: 50000000,
    lpContribution: 40000000,
    hurdleRate: 8,
    carryRate: 20,
    catchupRate: 100,
    managementFees: 2000000
  });

  const [results, setResults] = useState<WaterfallResults | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const calculateWaterfall = () => {
    setIsCalculating(true);
    
    setTimeout(() => {
      const { totalProceeds, lpContribution, hurdleRate, carryRate, catchupRate, managementFees } = inputs;
      
      // Calculate net proceeds after fees
      const netProceeds = totalProceeds - managementFees;
      
      // Calculate hurdle return
      const hurdleAmount = lpContribution * (1 + hurdleRate / 100);
      
      // Step 1: Return of capital to LP
      const returnOfCapital = Math.min(netProceeds, lpContribution);
      let remainingProceeds = netProceeds - returnOfCapital;
      
      // Step 2: Preferred return to LP (hurdle)
      const preferredReturn = Math.max(0, Math.min(remainingProceeds, hurdleAmount - lpContribution));
      remainingProceeds -= preferredReturn;
      
      // Step 3: GP catch-up
      const gpCatchup = Math.min(remainingProceeds, (preferredReturn * carryRate) / (100 - carryRate));
      remainingProceeds -= gpCatchup;
      
      // Step 4: Remaining proceeds split based on carry
      const lpCarryShare = remainingProceeds * (100 - carryRate) / 100;
      const gpCarryShare = remainingProceeds * carryRate / 100;
      
      // Total distributions
      const lpDistribution = returnOfCapital + preferredReturn + lpCarryShare;
      const gpDistribution = gpCatchup + gpCarryShare;
      
      const waterfallResults: WaterfallResults = {
        totalDistribution: netProceeds,
        lpDistribution,
        gpDistribution,
        carryRate,
        catchupThreshold: hurdleAmount,
        hurdleRate,
        calculations: {
          netProceeds,
          lpReturn: (lpDistribution / lpContribution - 1) * 100,
          gpCatchup,
          carryDistribution: gpCarryShare
        }
      };
      
      setResults(waterfallResults);
      setIsCalculating(false);
      
      if (onResultsChange) {
        onResultsChange(waterfallResults);
      }
    }, 1500);
  };

  const handleInputChange = (field: string, value: number) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const formatCurrency = (amount: number) => {
    return `$${(amount / 1000000).toFixed(1)}M`;
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <BarChart3 className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Waterfall Distribution Model</h3>
              <p className="text-sm text-gray-600">LP/GP waterfall with carried interest calculations</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {results && (
              <Badge variant="outline" className="bg-green-50 text-green-700">
                <CheckCircle className="h-3 w-3 mr-1" />
                Calculated
              </Badge>
            )}
            {mode !== 'traditional' && (
              <Button variant="outline" size="sm">
                <Zap className="h-4 w-4 mr-1" />
                AI Optimize
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Input Parameters */}
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Waterfall Parameters</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Total Proceeds ($M)
              </label>
              <Input
                type="number"
                value={inputs.totalProceeds / 1000000}
                onChange={(e) => handleInputChange('totalProceeds', Number(e.target.value) * 1000000)}
                step="0.1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                LP Contribution ($M)
              </label>
              <Input
                type="number"
                value={inputs.lpContribution / 1000000}
                onChange={(e) => handleInputChange('lpContribution', Number(e.target.value) * 1000000)}
                step="0.1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hurdle Rate (%)
              </label>
              <Input
                type="number"
                value={inputs.hurdleRate}
                onChange={(e) => handleInputChange('hurdleRate', Number(e.target.value))}
                step="0.1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Carry Rate (%)
              </label>
              <Input
                type="number"
                value={inputs.carryRate}
                onChange={(e) => handleInputChange('carryRate', Number(e.target.value))}
                step="1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Management Fees ($M)
              </label>
              <Input
                type="number"
                value={inputs.managementFees / 1000000}
                onChange={(e) => handleInputChange('managementFees', Number(e.target.value) * 1000000)}
                step="0.1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                GP Catch-up (%)
              </label>
              <Input
                type="number"
                value={inputs.catchupRate}
                onChange={(e) => handleInputChange('catchupRate', Number(e.target.value))}
                step="1"
              />
            </div>
          </div>
        </div>

        {/* Calculate Button */}
        <div className="flex justify-center">
          <Button 
            onClick={calculateWaterfall} 
            disabled={isCalculating}
            className="px-8"
          >
            <Calculator className="h-4 w-4 mr-2" />
            {isCalculating ? 'Calculating...' : 'Calculate Waterfall'}
          </Button>
        </div>

        {/* Results */}
        {results && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-gray-900">Distribution Results</h4>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-1" />
                Export
              </Button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Users className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="text-2xl font-bold text-blue-600">
                    {formatCurrency(results.lpDistribution)}
                  </div>
                  <div className="text-sm text-gray-600">LP Distribution</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {formatPercentage(results.calculations.lpReturn)} return
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 text-center">
                  <div className="flex items-center justify-center mb-2">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="text-2xl font-bold text-green-600">
                    {formatCurrency(results.gpDistribution)}
                  </div>
                  <div className="text-sm text-gray-600">GP Distribution</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {formatPercentage(results.carryRate)} carry
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 text-center">
                  <div className="flex items-center justify-center mb-2">
                    <DollarSign className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="text-2xl font-bold text-blue-600">
                    {formatCurrency(results.totalDistribution)}
                  </div>
                  <div className="text-sm text-gray-600">Total Distribution</div>
                  <div className="text-xs text-gray-500 mt-1">
                    Net of fees
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Detailed Breakdown */}
            <div className="space-y-3">
              <h5 className="font-medium text-gray-900">Waterfall Breakdown</h5>
              <div className="space-y-2">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">1. Return of Capital (LP)</span>
                  <span className="font-medium">{formatCurrency(Math.min(results.calculations.netProceeds, inputs.lpContribution))}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">2. Preferred Return (LP @ {formatPercentage(results.hurdleRate)})</span>
                  <span className="font-medium">{formatCurrency(Math.max(0, results.catchupThreshold - inputs.lpContribution))}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">3. GP Catch-up</span>
                  <span className="font-medium">{formatCurrency(results.calculations.gpCatchup)}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-600">4. Carry Distribution (GP @ {formatPercentage(results.carryRate)})</span>
                  <span className="font-medium">{formatCurrency(results.calculations.carryDistribution)}</span>
                </div>
              </div>
            </div>

            {/* AI Insights for non-traditional modes */}
            {mode !== 'traditional' && (
              <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-l-blue-500">
                <div className="flex items-start gap-3">
                  <Zap className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <h5 className="font-medium text-blue-900 mb-2">AI Analysis</h5>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• LP return of {formatPercentage(results.calculations.lpReturn)} exceeds hurdle rate</li>
                      <li>• GP carry of {formatCurrency(results.gpDistribution)} represents {formatPercentage((results.gpDistribution / results.totalDistribution) * 100)} of total distribution</li>
                      <li>• Waterfall structure is balanced and competitive</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Warning for complex structures */}
        <div className="flex items-start gap-3 p-3 bg-amber-50 rounded-lg border border-amber-200">
          <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5" />
          <div className="text-sm text-amber-800">
            <strong>Note:</strong> This model assumes a standard American waterfall structure. 
            Complex structures with multiple tiers or European waterfalls may require additional modeling.
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WaterfallModelingCard;