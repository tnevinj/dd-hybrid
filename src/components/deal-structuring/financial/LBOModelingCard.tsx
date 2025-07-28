'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Download,
  Zap,
  Calculator,
  DollarSign
} from 'lucide-react';
import { LBOInputs, LBOResults } from '@/types/deal-structuring';

interface LBOModelingCardProps {
  dealId: string;
  mode?: 'traditional' | 'assisted' | 'autonomous';
  onResultsChange?: (results: LBOResults) => void;
}

const LBOModelingCard: React.FC<LBOModelingCardProps> = ({ 
  dealId, 
  mode = 'traditional',
  onResultsChange 
}) => {
  const [inputs, setInputs] = useState<LBOInputs>({
    purchasePrice: 150000000,
    debtFunding: [
      {
        id: 'senior',
        type: 'senior_debt',
        amount: 90000000,
        interestRate: 0.055,
        term: 7,
        amortizationSchedule: 'cash_sweep'
      },
      {
        id: 'mezzanine',
        type: 'mezzanine',
        amount: 30000000,
        interestRate: 0.12,
        term: 8,
        amortizationSchedule: 'none'
      }
    ],
    equityFunding: 30000000,
    managementRollover: 5000000,
    transactionFees: 3000000,
    projectionYears: 5,
    exitMultiple: 12,
    exitYear: 5,
    taxRate: 0.25
  });

  const [results, setResults] = useState<LBOResults | null>(null);
  const [loading, setLoading] = useState(false);
  const [covenantWarnings, setCovenantWarnings] = useState<string[]>([]);

  const calculateLBO = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      // Mock LBO calculation (simplified)
      const totalDebt = inputs.debtFunding.reduce((sum, debt) => sum + debt.amount, 0);
      const totalEquity = inputs.equityFunding + (inputs.managementRollover || 0);
      const totalSources = totalDebt + totalEquity;
      
      // Assume 5-year projection with debt paydown
      const year5EBITDA = 40000000; // Mock EBITDA growth
      const exitValue = year5EBITDA * inputs.exitMultiple;
      const year5Debt = totalDebt * 0.4; // Assume 60% debt paydown
      const exitEquityValue = exitValue - year5Debt;
      
      const equityMultiple = exitEquityValue / totalEquity;
      const equityIRR = Math.pow(equityMultiple, 1/inputs.exitYear) - 1;
      
      // Calculate peak leverage (simplified)
      const initialEBITDA = 25000000;
      const peakLeverage = totalDebt / initialEBITDA;
      
      const calculatedResults: LBOResults = {
        equityIRR,
        equityMultiple,
        cashOnCashReturn: equityMultiple,
        totalReturn: exitEquityValue - totalEquity,
        peakLeverage,
        avgLeverage: peakLeverage * 0.7,
        exitEquityValue,
        totalEquityInvested: totalEquity,
        projections: [], // Would contain year-by-year projections
        covenantBreaches: [],
        debtPaydownSchedule: []
      };

      setResults(calculatedResults);
      
      // Check covenant warnings
      const warnings = [];
      if (peakLeverage > 5.5) {
        warnings.push('Peak leverage exceeds 5.5x - covenant risk');
      }
      if (equityIRR < 0.15) {
        warnings.push('IRR below 15% target threshold');
      }
      if (equityMultiple < 2.0) {
        warnings.push('Equity multiple below 2.0x - consider structure optimization');
      }
      
      setCovenantWarnings(warnings);
      onResultsChange?.(calculatedResults);
      
    } catch (error) {
      console.error('LBO calculation failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return `$${(amount / 1000000).toFixed(1)}M`;
  };

  const formatPercentage = (value: number) => {
    return `${(value * 100).toFixed(1)}%`;
  };

  const totalDebt = inputs.debtFunding.reduce((sum, debt) => sum + debt.amount, 0);
  const totalEquity = inputs.equityFunding + (inputs.managementRollover || 0);
  const debtToEquity = totalDebt / totalEquity;

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-600" />
            <h3 className="text-lg font-semibold">LBO Returns Model</h3>
            <Badge variant="outline">Live Model</Badge>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-1" />
              Export
            </Button>
            {mode !== 'traditional' && (
              <Button variant="outline" size="sm">
                <Zap className="h-4 w-4 mr-1" />
                Optimize
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Covenant Warnings */}
        {mode !== 'traditional' && covenantWarnings.length > 0 && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <span className="font-medium text-red-900">Leverage & Covenant Alerts</span>
            </div>
            <ul className="space-y-1 text-red-800 text-sm">
              {covenantWarnings.map((warning, idx) => (
                <li key={idx}>• {warning}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Sources and Uses */}
        <div>
          <h4 className="font-medium text-gray-900 mb-3">Sources & Uses of Funds</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Sources */}
            <div>
              <div className="text-sm font-medium text-gray-700 mb-2">Sources</div>
              <div className="space-y-2 text-sm">
                {inputs.debtFunding.map((debt) => (
                  <div key={debt.id} className="flex justify-between">
                    <span className="text-gray-600">
                      {debt.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())} 
                      ({formatPercentage(debt.interestRate)})
                    </span>
                    <span className="font-medium">{formatCurrency(debt.amount)}</span>
                  </div>
                ))}
                <div className="flex justify-between">
                  <span className="text-gray-600">Sponsor Equity</span>
                  <span className="font-medium">{formatCurrency(inputs.equityFunding)}</span>
                </div>
                {inputs.managementRollover && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Management Rollover</span>
                    <span className="font-medium">{formatCurrency(inputs.managementRollover)}</span>
                  </div>
                )}
                <div className="flex justify-between border-t pt-2 font-semibold">
                  <span>Total Sources</span>
                  <span>{formatCurrency(totalDebt + totalEquity)}</span>
                </div>
              </div>
            </div>

            {/* Uses */}
            <div>
              <div className="text-sm font-medium text-gray-700 mb-2">Uses</div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Purchase Price</span>
                  <span className="font-medium">{formatCurrency(inputs.purchasePrice)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Transaction Fees</span>
                  <span className="font-medium">{formatCurrency(inputs.transactionFees)}</span>
                </div>
                <div className="flex justify-between border-t pt-2 font-semibold">
                  <span>Total Uses</span>
                  <span>{formatCurrency(inputs.purchasePrice + inputs.transactionFees)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Capital Structure Metrics */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="text-center">
              <div className="text-gray-600">Total Debt</div>
              <div className="text-lg font-bold text-gray-900">{formatCurrency(totalDebt)}</div>
            </div>
            <div className="text-center">
              <div className="text-gray-600">Total Equity</div>
              <div className="text-lg font-bold text-gray-900">{formatCurrency(totalEquity)}</div>
            </div>
            <div className="text-center">
              <div className="text-gray-600">D/E Ratio</div>
              <div className="text-lg font-bold text-gray-900">{debtToEquity.toFixed(1)}x</div>
            </div>
          </div>
        </div>

        {/* Key Assumptions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Exit Multiple
            </label>
            <Input
              type="number"
              step="0.1"
              value={inputs.exitMultiple}
              onChange={(e) => setInputs(prev => ({ 
                ...prev, 
                exitMultiple: parseFloat(e.target.value) 
              }))}
              className="text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Exit Year
            </label>
            <Input
              type="number"
              value={inputs.exitYear}
              onChange={(e) => setInputs(prev => ({ 
                ...prev, 
                exitYear: parseInt(e.target.value) 
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
              step="0.01"
              value={inputs.taxRate}
              onChange={(e) => setInputs(prev => ({ 
                ...prev, 
                taxRate: parseFloat(e.target.value) 
              }))}
              className="text-sm"
            />
          </div>
        </div>

        {/* Calculate Button */}
        <div className="flex justify-center">
          <Button 
            onClick={calculateLBO} 
            disabled={loading}
            className="px-8"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
            ) : (
              <Calculator className="h-4 w-4 mr-2" />
            )}
            {loading ? 'Calculating Returns...' : 'Calculate LBO Returns'}
          </Button>
        </div>

        {/* Results */}
        {results && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="font-medium text-green-900">LBO Returns Analysis</span>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="text-center">
                <div className="text-gray-600 text-sm">Equity IRR</div>
                <div className="text-2xl font-bold text-green-800">
                  {formatPercentage(results.equityIRR)}
                </div>
              </div>
              <div className="text-center">
                <div className="text-gray-600 text-sm">Equity Multiple</div>
                <div className="text-2xl font-bold text-green-800">
                  {results.equityMultiple.toFixed(1)}x
                </div>
              </div>
              <div className="text-center">
                <div className="text-gray-600 text-sm">Peak Leverage</div>
                <div className="text-2xl font-bold text-green-800">
                  {results.peakLeverage.toFixed(1)}x
                </div>
              </div>
              <div className="text-center">
                <div className="text-gray-600 text-sm">Cash Return</div>
                <div className="text-2xl font-bold text-green-800">
                  {formatCurrency(results.totalReturn)}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-green-200">
              <div className="grid grid-cols-2 gap-4 text-sm text-green-700">
                <div>
                  <span className="text-gray-600">Total Equity Investment:</span> {formatCurrency(results.totalEquityInvested)}
                </div>
                <div>
                  <span className="text-gray-600">Exit Equity Value:</span> {formatCurrency(results.exitEquityValue)}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Return Scenarios */}
        {results && mode !== 'traditional' && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-blue-600" />
                <span className="font-medium text-blue-900">Return Scenarios</span>
              </div>
              <Button size="sm" variant="outline">
                Full Sensitivity
              </Button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr>
                    <th className="text-left py-1">Exit Multiple</th>
                    <th className="text-center py-1">10x</th>
                    <th className="text-center py-1">12x</th>
                    <th className="text-center py-1">14x</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="py-1 font-medium">Equity IRR</td>
                    <td className="text-center py-1">12.5%</td>
                    <td className="text-center py-1 font-bold bg-blue-100">{formatPercentage(results.equityIRR)}</td>
                    <td className="text-center py-1">28.2%</td>
                  </tr>
                  <tr>
                    <td className="py-1 font-medium">Equity Multiple</td>
                    <td className="text-center py-1">1.8x</td>
                    <td className="text-center py-1 font-bold bg-blue-100">{results.equityMultiple.toFixed(1)}x</td>
                    <td className="text-center py-1">3.2x</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LBOModelingCard;