'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Calculator,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Download,
  Zap,
  BarChart3
} from 'lucide-react';
import { DCFInputs, DCFResults } from '@/types/deal-structuring';

interface DCFModelingCardProps {
  dealId: string;
  mode?: 'traditional' | 'assisted' | 'autonomous';
  onResultsChange?: (results: DCFResults) => void;
}

const DCFModelingCard: React.FC<DCFModelingCardProps> = ({ 
  dealId, 
  mode = 'traditional',
  onResultsChange 
}) => {
  const [inputs, setInputs] = useState<DCFInputs>({
    projectionYears: 5,
    terminalGrowthRate: 0.025,
    discountRate: 0.12,
    terminalValueMethod: 'perpetuity',
    exitMultiple: 15,
    taxRate: 0.25,
    cashFlows: [
      { year: 1, revenue: 100000000, ebitda: 25000000, capex: 8000000, workingCapital: 2000000 },
      { year: 2, revenue: 110000000, ebitda: 28000000, capex: 9000000, workingCapital: 2200000 },
      { year: 3, revenue: 121000000, ebitda: 31000000, capex: 10000000, workingCapital: 2400000 },
      { year: 4, revenue: 133000000, ebitda: 34000000, capex: 11000000, workingCapital: 2600000 },
      { year: 5, revenue: 146000000, ebitda: 37000000, capex: 12000000, workingCapital: 2800000 },
    ],
    costOfEquity: 0.14,
    costOfDebt: 0.06,
    marketValueEquity: 200000000,
    marketValueDebt: 100000000
  });

  const [results, setResults] = useState<DCFResults | null>(null);
  const [loading, setLoading] = useState(false);
  const [aiRecommendations, setAiRecommendations] = useState<string[]>([]);

  const calculateDCF = async () => {
    setLoading(true);
    try {
      // Simulate API call for DCF calculation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock DCF calculation (in reality, this would be a complex financial engine)
      const wacc = (inputs.costOfEquity * inputs.marketValueEquity + 
                   inputs.costOfDebt * (1 - inputs.taxRate) * inputs.marketValueDebt) /
                   (inputs.marketValueEquity + inputs.marketValueDebt);
      
      let npv = 0;
      const freeCashFlows = inputs.cashFlows.map(cf => {
        const fcf = cf.ebitda * (1 - inputs.taxRate) - cf.capex - cf.workingCapital;
        npv += fcf / Math.pow(1 + inputs.discountRate, cf.year);
        return fcf;
      });

      const terminalValue = inputs.terminalValueMethod === 'perpetuity' 
        ? (freeCashFlows[freeCashFlows.length - 1] * (1 + inputs.terminalGrowthRate)) / (inputs.discountRate - inputs.terminalGrowthRate)
        : inputs.exitMultiple * inputs.cashFlows[inputs.cashFlows.length - 1].ebitda;

      const pvOfTerminalValue = terminalValue / Math.pow(1 + inputs.discountRate, inputs.projectionYears);
      const enterpriseValue = npv + pvOfTerminalValue;
      const equityValue = enterpriseValue - inputs.marketValueDebt;

      const calculatedResults: DCFResults = {
        enterpriseValue,
        equityValue,
        npv,
        irr: 0.185, // Simplified - would need iterative calculation
        pvOfProjections: npv,
        pvOfTerminalValue,
        terminalValue,
        wacc
      };

      setResults(calculatedResults);
      
      // Generate AI recommendations based on mode
      if (mode !== 'traditional') {
        generateAIRecommendations(calculatedResults);
      }
      
      onResultsChange?.(calculatedResults);
    } catch (error) {
      console.error('DCF calculation failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateAIRecommendations = (results: DCFResults) => {
    const recommendations = [];
    
    if (results.wacc > 0.15) {
      recommendations.push('WACC appears high - consider optimizing capital structure');
    }
    
    if (results.pvOfTerminalValue / results.enterpriseValue > 0.75) {
      recommendations.push('Terminal value represents >75% of total value - validate growth assumptions');
    }
    
    if (inputs.discountRate < 0.10) {
      recommendations.push('Discount rate may be optimistic for current market conditions');
    }
    
    setAiRecommendations(recommendations);
  };

  const formatCurrency = (amount: number) => {
    return `$${(amount / 1000000).toFixed(1)}M`;
  };

  const formatPercentage = (value: number) => {
    return `${(value * 100).toFixed(1)}%`;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calculator className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-semibold">DCF Valuation Model</h3>
            <Badge variant="outline">Version 2.1</Badge>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-1" />
              Export
            </Button>
            {mode !== 'traditional' && (
              <Button variant="outline" size="sm">
                <Zap className="h-4 w-4 mr-1" />
                AI Assist
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* AI Recommendations */}
        {mode !== 'traditional' && aiRecommendations.length > 0 && (
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <span className="font-medium text-amber-900">AI Model Insights</span>
            </div>
            <ul className="space-y-1 text-amber-800 text-sm">
              {aiRecommendations.map((rec, idx) => (
                <li key={idx}>• {rec}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Key Assumptions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Discount Rate
            </label>
            <Input
              type="number"
              step="0.001"
              value={inputs.discountRate}
              onChange={(e) => setInputs(prev => ({ 
                ...prev, 
                discountRate: parseFloat(e.target.value) 
              }))}
              className="text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Terminal Growth Rate
            </label>
            <Input
              type="number"
              step="0.001"
              value={inputs.terminalGrowthRate}
              onChange={(e) => setInputs(prev => ({ 
                ...prev, 
                terminalGrowthRate: parseFloat(e.target.value) 
              }))}
              className="text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tax Rate
            </label>
            <Input
              type="number"
              step="0.001"
              value={inputs.taxRate}
              onChange={(e) => setInputs(prev => ({ 
                ...prev, 
                taxRate: parseFloat(e.target.value) 
              }))}
              className="text-sm"
            />
          </div>
        </div>

        {/* Cash Flow Projections */}
        <div>
          <h4 className="font-medium text-gray-900 mb-3">5-Year Cash Flow Projections</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Year</th>
                  <th className="text-right py-2">Revenue</th>
                  <th className="text-right py-2">EBITDA</th>
                  <th className="text-right py-2">CapEx</th>
                  <th className="text-right py-2">FCF</th>
                </tr>
              </thead>
              <tbody>
                {inputs.cashFlows.map((cf, idx) => {
                  const fcf = cf.ebitda * (1 - inputs.taxRate) - cf.capex - cf.workingCapital;
                  return (
                    <tr key={cf.year} className="border-b">
                      <td className="py-2 font-medium">{cf.year}</td>
                      <td className="text-right py-2">{formatCurrency(cf.revenue)}</td>
                      <td className="text-right py-2">{formatCurrency(cf.ebitda)}</td>
                      <td className="text-right py-2">{formatCurrency(cf.capex)}</td>
                      <td className="text-right py-2 font-medium">{formatCurrency(fcf)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Calculate Button */}
        <div className="flex justify-center">
          <Button 
            onClick={calculateDCF} 
            disabled={loading}
            className="px-8"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
            ) : (
              <Calculator className="h-4 w-4 mr-2" />
            )}
            {loading ? 'Calculating...' : 'Calculate DCF'}
          </Button>
        </div>

        {/* Results */}
        {results && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="font-medium text-green-900">Valuation Results</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <div className="text-gray-600">Enterprise Value</div>
                <div className="text-lg font-bold text-green-800">
                  {formatCurrency(results.enterpriseValue)}
                </div>
              </div>
              <div>
                <div className="text-gray-600">Equity Value</div>
                <div className="text-lg font-bold text-green-800">
                  {formatCurrency(results.equityValue)}
                </div>
              </div>
              <div>
                <div className="text-gray-600">IRR</div>
                <div className="text-lg font-bold text-green-800">
                  {formatPercentage(results.irr)}
                </div>
              </div>
              <div>
                <div className="text-gray-600">WACC</div>
                <div className="text-lg font-bold text-green-800">
                  {formatPercentage(results.wacc)}
                </div>
              </div>
            </div>
            
            <div className="mt-4 pt-3 border-t border-green-200">
              <div className="grid grid-cols-2 gap-4 text-xs text-green-700">
                <div>
                  <span className="text-gray-600">PV of Projections:</span> {formatCurrency(results.pvOfProjections)}
                </div>
                <div>
                  <span className="text-gray-600">PV of Terminal Value:</span> {formatCurrency(results.pvOfTerminalValue)}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Sensitivity Analysis */}
        {results && mode !== 'traditional' && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-blue-600" />
                <span className="font-medium text-blue-900">Quick Sensitivity</span>
              </div>
              <Button size="sm" variant="outline">
                Full Analysis
              </Button>
            </div>
            <div className="grid grid-cols-3 gap-3 text-xs">
              <div className="text-center">
                <div className="text-gray-600">Discount Rate ±1%</div>
                <div className="font-medium">
                  {formatCurrency(results.equityValue * 0.85)} - {formatCurrency(results.equityValue * 1.18)}
                </div>
              </div>
              <div className="text-center">
                <div className="text-gray-600">Terminal Growth ±0.5%</div>
                <div className="font-medium">
                  {formatCurrency(results.equityValue * 0.92)} - {formatCurrency(results.equityValue * 1.12)}
                </div>
              </div>
              <div className="text-center">
                <div className="text-gray-600">EBITDA ±10%</div>
                <div className="font-medium">
                  {formatCurrency(results.equityValue * 0.88)} - {formatCurrency(results.equityValue * 1.15)}
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DCFModelingCard;