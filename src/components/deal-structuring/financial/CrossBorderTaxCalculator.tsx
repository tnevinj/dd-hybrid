/**
 * Cross-Border Tax Calculator Component
 * 
 * Specialized calculator for cross-border transaction tax analysis and optimization.
 * Provides comprehensive calculation of withholding taxes, treaty benefits,
 * transfer pricing implications, and total tax costs across jurisdictions.
 * 
 * Features:
 * - Multi-transaction tax calculation
 * - Withholding tax optimization
 * - Treaty benefit analysis
 * - Transfer pricing calculations
 * - Currency conversion handling
 * - Tax cost optimization scenarios
 * - Real-time treaty lookup
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
  Calculator, 
  Plus, 
  Minus, 
  ArrowRight, 
  Globe, 
  DollarSign,
  TrendingDown,
  TrendingUp,
  Shield,
  FileText,
  AlertCircle,
  CheckCircle,
  Percent,
  BarChart3
} from 'lucide-react';

type IncomeType = 'dividends' | 'interest' | 'royalties' | 'management_fees' | 'capital_gains';
type Currency = 'USD' | 'EUR' | 'GBP' | 'SGD';

interface TaxJurisdiction {
  code: string;
  name: string;
  corporateTaxRate: number;
  dividendTaxRate: number;
  interestTaxRate: number;
  royaltyTaxRate: number;
  capitalGainsTaxRate: number;
  withholdingTaxRates: Array<{
    incomeType: IncomeType;
    rate: number;
    conditions: string[];
    treatyReduction: number;
  }>;
  regulatoryRequirements: string[];
  treatyNetwork: string[];
  taxIncentives: string[];
}

interface TransactionInput {
  id: string;
  description: string;
  type: IncomeType;
  amount: number;
  currency: Currency;
  sourceJurisdiction: string;
  destinationJurisdiction: string;
  frequency: 'one_time' | 'monthly' | 'quarterly' | 'annually';
  treatyEligible: boolean;
  transferPricingMethod?: 'arm_length' | 'cost_plus' | 'profit_split' | 'comparable_uncontrolled';
}

interface TaxCalculationResult {
  transaction: TransactionInput;
  grossAmount: number;
  standardWithholdingRate: number;
  treatyWithholdingRate: number;
  applicableRate: number;
  withholdingTax: number;
  treatySavings: number;
  transferPricingAdjustment: number;
  netAmount: number;
  effectiveTaxRate: number;
}

interface OptimizationScenario {
  id: string;
  name: string;
  description: string;
  structureChanges: string[];
  totalTaxSavings: number;
  implementationCost: number;
  netBenefit: number;
  feasibility: 'high' | 'medium' | 'low';
}

interface CrossBorderTaxCalculatorProps {
  dealId: string;
  mode?: 'traditional' | 'assisted' | 'autonomous';
  availableJurisdictions?: TaxJurisdiction[];
  exchangeRates?: { [currency: string]: number };
  onResultsChange?: (results: TaxCalculationResult[]) => void;
  className?: string;
}

const CrossBorderTaxCalculator: React.FC<CrossBorderTaxCalculatorProps> = ({
  dealId,
  mode = 'traditional',
  availableJurisdictions = [],
  exchangeRates = { USD: 1, EUR: 0.85, GBP: 0.73, SGD: 1.35 },
  onResultsChange,
  className
}) => {
  // Sample jurisdictions for demonstration
  const defaultJurisdictions: TaxJurisdiction[] = [
    {
      code: 'US',
      name: 'United States',
      corporateTaxRate: 0.21,
      dividendTaxRate: 0.30,
      interestTaxRate: 0.30,
      royaltyTaxRate: 0.30,
      capitalGainsTaxRate: 0.21,
      withholdingTaxRates: [
        { incomeType: 'dividends', rate: 0.30, conditions: ['Standard rate'], treatyReduction: 0.15 },
        { incomeType: 'interest', rate: 0.30, conditions: ['Standard rate'], treatyReduction: 0.10 },
        { incomeType: 'royalties', rate: 0.30, conditions: ['Standard rate'], treatyReduction: 0.10 }
      ],
      regulatoryRequirements: ['Form 1042-S filing', 'FATCA compliance'],
      treatyNetwork: ['IE', 'NL', 'UK', 'SG', 'LU'],
      taxIncentives: ['Foreign tax credit', 'R&D credit']
    },
    {
      code: 'IE',
      name: 'Ireland',
      corporateTaxRate: 0.125,
      dividendTaxRate: 0.25,
      interestTaxRate: 0.20,
      royaltyTaxRate: 0.20,
      capitalGainsTaxRate: 0.33,
      withholdingTaxRates: [
        { incomeType: 'dividends', rate: 0.20, conditions: ['Standard rate'], treatyReduction: 0.05 },
        { incomeType: 'interest', rate: 0.20, conditions: ['Standard rate'], treatyReduction: 0.00 },
        { incomeType: 'royalties', rate: 0.20, conditions: ['Standard rate'], treatyReduction: 0.00 }
      ],
      regulatoryRequirements: ['Form 46G filing', 'Economic substance'],
      treatyNetwork: ['US', 'NL', 'UK', 'SG', 'LU'],
      taxIncentives: ['IP Box regime', 'R&D credit']
    },
    {
      code: 'SG',
      name: 'Singapore',
      corporateTaxRate: 0.17,
      dividendTaxRate: 0.00,
      interestTaxRate: 0.15,
      royaltyTaxRate: 0.10,
      capitalGainsTaxRate: 0.00,
      withholdingTaxRates: [
        { incomeType: 'dividends', rate: 0.00, conditions: ['No withholding'], treatyReduction: 0.00 },
        { incomeType: 'interest', rate: 0.15, conditions: ['Standard rate'], treatyReduction: 0.05 },
        { incomeType: 'royalties', rate: 0.10, conditions: ['Standard rate'], treatyReduction: 0.05 }
      ],
      regulatoryRequirements: ['Form C-S filing', 'Substance requirements'],
      treatyNetwork: ['US', 'IE', 'NL', 'UK', 'LU'],
      taxIncentives: ['Global trader program', 'IP development incentive']
    }
  ];

  const jurisdictions = availableJurisdictions.length > 0 ? availableJurisdictions : defaultJurisdictions;

  // State management
  const [transactions, setTransactions] = useState<TransactionInput[]>([
    {
      id: '1',
      description: 'Dividend Distribution',
      type: 'dividends',
      amount: 1000000,
      currency: 'USD',
      sourceJurisdiction: 'IE',
      destinationJurisdiction: 'US',
      frequency: 'quarterly',
      treatyEligible: true
    }
  ]);

  const [activeTab, setActiveTab] = useState('calculator');
  const [baseCurrency, setBaseCurrency] = useState<Currency>('USD');
  const [optimizationTarget, setOptimizationTarget] = useState<'minimize_tax' | 'maximize_efficiency' | 'reduce_complexity'>('minimize_tax');

  // Calculate tax results for all transactions
  const calculationResults = useMemo((): TaxCalculationResult[] => {
    return transactions.map(transaction => {
      const sourceJurisdiction = jurisdictions.find(j => j.code === transaction.sourceJurisdiction);
      const destinationJurisdiction = jurisdictions.find(j => j.code === transaction.destinationJurisdiction);

      if (!sourceJurisdiction || !destinationJurisdiction) {
        throw new Error(`Jurisdiction not found for transaction ${transaction.id}`);
      }

      // Convert amount to base currency
      const exchangeRate = exchangeRates[transaction.currency] || 1;
      const grossAmount = transaction.amount / exchangeRate;

      // Find applicable withholding tax rate
      const withholdingRate = sourceJurisdiction.withholdingTaxRates.find(
        rate => rate.incomeType === transaction.type
      );

      const standardWithholdingRate = withholdingRate?.rate || 0;
      const treatyWithholdingRate = transaction.treatyEligible ? 
        (withholdingRate?.treatyReduction || standardWithholdingRate) : 
        standardWithholdingRate;

      const applicableRate = treatyWithholdingRate;
      const withholdingTax = grossAmount * applicableRate;
      const treatySavings = grossAmount * (standardWithholdingRate - treatyWithholdingRate);

      // Transfer pricing adjustment (simplified)
      const transferPricingAdjustment = transaction.transferPricingMethod === 'cost_plus' ? 
        grossAmount * 0.02 : 0; // 2% cost-plus adjustment

      const netAmount = grossAmount - withholdingTax - transferPricingAdjustment;
      const effectiveTaxRate = (withholdingTax + transferPricingAdjustment) / grossAmount;

      return {
        transaction,
        grossAmount,
        standardWithholdingRate,
        treatyWithholdingRate,
        applicableRate,
        withholdingTax,
        treatySavings,
        transferPricingAdjustment,
        netAmount,
        effectiveTaxRate
      };
    });
  }, [transactions, jurisdictions, exchangeRates]);

  // Calculate optimization scenarios
  const optimizationScenarios = useMemo((): OptimizationScenario[] => {
    const totalCurrentTax = calculationResults.reduce((sum, result) => sum + result.withholdingTax, 0);

    return [
      {
        id: 'treaty_optimization',
        name: 'Treaty Network Optimization',
        description: 'Route transactions through optimal treaty jurisdictions',
        structureChanges: ['Add Irish holding company', 'Route dividends through Ireland'],
        totalTaxSavings: totalCurrentTax * 0.25,
        implementationCost: 50000,
        netBenefit: totalCurrentTax * 0.25 - 50000,
        feasibility: 'high'
      },
      {
        id: 'ip_holding',
        name: 'IP Holding Structure',
        description: 'Separate IP holding for royalty optimization',
        structureChanges: ['Create IP holding company', 'Transfer IP assets', 'Implement transfer pricing'],
        totalTaxSavings: totalCurrentTax * 0.40,
        implementationCost: 150000,
        netBenefit: totalCurrentTax * 0.40 - 150000,
        feasibility: 'medium'
      },
      {
        id: 'debt_financing',
        name: 'Debt vs Equity Optimization',
        description: 'Optimize debt-to-equity ratios for interest deductions',
        structureChanges: ['Introduce intercompany loans', 'Optimize capital structure'],
        totalTaxSavings: totalCurrentTax * 0.15,
        implementationCost: 25000,
        netBenefit: totalCurrentTax * 0.15 - 25000,
        feasibility: 'high'
      }
    ].sort((a, b) => b.netBenefit - a.netBenefit);
  }, [calculationResults]);

  // Update parent component when calculations change
  React.useEffect(() => {
    if (onResultsChange) {
      onResultsChange(calculationResults);
    }
  }, [calculationResults, onResultsChange]);

  // Helper functions
  const addTransaction = () => {
    const newTransaction: TransactionInput = {
      id: Date.now().toString(),
      description: `Transaction ${transactions.length + 1}`,
      type: 'interest',
      amount: 500000,
      currency: 'USD',
      sourceJurisdiction: 'US',
      destinationJurisdiction: 'IE',
      frequency: 'annually',
      treatyEligible: true
    };
    setTransactions([...transactions, newTransaction]);
  };

  const updateTransaction = (id: string, updates: Partial<TransactionInput>) => {
    setTransactions(transactions.map(t => 
      t.id === id ? { ...t, ...updates } : t
    ));
  };

  const removeTransaction = (id: string) => {
    if (transactions.length > 1) {
      setTransactions(transactions.filter(t => t.id !== id));
    }
  };

  const getTotalTaxCost = () => {
    return calculationResults.reduce((sum, result) => sum + result.withholdingTax + result.transferPricingAdjustment, 0);
  };

  const getTotalTreatySavings = () => {
    return calculationResults.reduce((sum, result) => sum + result.treatySavings, 0);
  };

  const getAverageEffectiveRate = () => {
    const totalGross = calculationResults.reduce((sum, result) => sum + result.grossAmount, 0);
    const totalTax = getTotalTaxCost();
    return totalGross > 0 ? totalTax / totalGross : 0;
  };

  const formatCurrency = (amount: number, currency: Currency) => {
    return new Intl.NumberFormatter('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'percent',
      minimumFractionDigits: 1,
      maximumFractionDigits: 2,
    }).format(value);
  };

  return (
    <Card className={`w-full ${className}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calculator className="h-5 w-5 text-blue-600" />
            <CardTitle>Cross-Border Tax Calculator</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">
              {transactions.length} Transaction{transactions.length > 1 ? 's' : ''}
            </Badge>
            <Badge variant="outline">
              Base: {baseCurrency}
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
            <TabsTrigger value="calculator">Calculator</TabsTrigger>
            <TabsTrigger value="results">Results</TabsTrigger>
            <TabsTrigger value="optimization">Optimization</TabsTrigger>
            <TabsTrigger value="summary">Summary</TabsTrigger>
          </TabsList>

          <TabsContent value="calculator" className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Transaction Setup</h3>
                <div className="flex gap-2">
                  <Select value={baseCurrency} onValueChange={(value) => setBaseCurrency(value as Currency)}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="EUR">EUR</SelectItem>
                      <SelectItem value="GBP">GBP</SelectItem>
                      <SelectItem value="SGD">SGD</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button onClick={addTransaction} variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-1" />
                    Add Transaction
                  </Button>
                </div>
              </div>

              {/* Transaction List */}
              <div className="space-y-4">
                {transactions.map((transaction, index) => (
                  <Card key={transaction.id} className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium">Transaction {index + 1}</h4>
                      <Button 
                        onClick={() => removeTransaction(transaction.id)}
                        variant="ghost" 
                        size="sm"
                        disabled={transactions.length <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor={`description-${transaction.id}`}>Description</Label>
                        <Input
                          id={`description-${transaction.id}`}
                          value={transaction.description}
                          onChange={(e) => updateTransaction(transaction.id, { description: e.target.value })}
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label htmlFor={`type-${transaction.id}`}>Income Type</Label>
                        <Select 
                          value={transaction.type} 
                          onValueChange={(value) => updateTransaction(transaction.id, { type: value as IncomeType })}
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="dividends">Dividends</SelectItem>
                            <SelectItem value="interest">Interest</SelectItem>
                            <SelectItem value="royalties">Royalties</SelectItem>
                            <SelectItem value="management_fees">Management Fees</SelectItem>
                            <SelectItem value="capital_gains">Capital Gains</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor={`amount-${transaction.id}`}>Amount</Label>
                        <Input
                          id={`amount-${transaction.id}`}
                          type="number"
                          value={transaction.amount}
                          onChange={(e) => updateTransaction(transaction.id, { amount: Number(e.target.value) })}
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label htmlFor={`currency-${transaction.id}`}>Currency</Label>
                        <Select 
                          value={transaction.currency} 
                          onValueChange={(value) => updateTransaction(transaction.id, { currency: value as Currency })}
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Currency" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="USD">USD</SelectItem>
                            <SelectItem value="EUR">EUR</SelectItem>
                            <SelectItem value="GBP">GBP</SelectItem>
                            <SelectItem value="SGD">SGD</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor={`source-${transaction.id}`}>Source Jurisdiction</Label>
                        <Select 
                          value={transaction.sourceJurisdiction} 
                          onValueChange={(value) => updateTransaction(transaction.id, { sourceJurisdiction: value })}
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Source" />
                          </SelectTrigger>
                          <SelectContent>
                            {jurisdictions.map(jurisdiction => (
                              <SelectItem key={jurisdiction.code} value={jurisdiction.code}>
                                {jurisdiction.name} ({jurisdiction.code})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor={`destination-${transaction.id}`}>Destination Jurisdiction</Label>
                        <Select 
                          value={transaction.destinationJurisdiction} 
                          onValueChange={(value) => updateTransaction(transaction.id, { destinationJurisdiction: value })}
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Destination" />
                          </SelectTrigger>
                          <SelectContent>
                            {jurisdictions.map(jurisdiction => (
                              <SelectItem key={jurisdiction.code} value={jurisdiction.code}>
                                {jurisdiction.name} ({jurisdiction.code})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor={`frequency-${transaction.id}`}>Frequency</Label>
                        <Select 
                          value={transaction.frequency} 
                          onValueChange={(value) => updateTransaction(transaction.id, { frequency: value as any })}
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Frequency" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="one_time">One Time</SelectItem>
                            <SelectItem value="monthly">Monthly</SelectItem>
                            <SelectItem value="quarterly">Quarterly</SelectItem>
                            <SelectItem value="annually">Annually</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor={`treaty-${transaction.id}`}>Treaty Eligible</Label>
                        <Select 
                          value={transaction.treatyEligible ? 'yes' : 'no'} 
                          onValueChange={(value) => updateTransaction(transaction.id, { treatyEligible: value === 'yes' })}
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Treaty eligibility" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="yes">Yes</SelectItem>
                            <SelectItem value="no">No</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Transaction Flow Visualization */}
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-center gap-4 text-sm">
                        <div className="text-center">
                          <div className="font-medium">{transaction.sourceJurisdiction}</div>
                          <div className="text-gray-600">Source</div>
                        </div>
                        <ArrowRight className="h-4 w-4 text-gray-400" />
                        <div className="text-center">
                          <div className="font-medium">{formatCurrency(transaction.amount, transaction.currency)}</div>
                          <div className="text-gray-600">{transaction.type}</div>
                        </div>
                        <ArrowRight className="h-4 w-4 text-gray-400" />
                        <div className="text-center">
                          <div className="font-medium">{transaction.destinationJurisdiction}</div>
                          <div className="text-gray-600">Destination</div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="results" className="space-y-6">
            <div className="space-y-4">
              <h3 className="font-semibold">Tax Calculation Results</h3>

              {/* Summary Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-gray-600">Total Tax Cost</span>
                  </div>
                  <div className="text-2xl font-bold text-red-600">
                    {formatCurrency(getTotalTaxCost(), baseCurrency)}
                  </div>
                </Card>

                <Card className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingDown className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-gray-600">Treaty Savings</span>
                  </div>
                  <div className="text-2xl font-bold text-green-600">
                    {formatCurrency(getTotalTreatySavings(), baseCurrency)}
                  </div>
                </Card>

                <Card className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Percent className="h-4 w-4 text-blue-600" />
                    <span className="text-sm text-gray-600">Avg Effective Rate</span>
                  </div>
                  <div className="text-2xl font-bold text-blue-600">
                    {formatPercentage(getAverageEffectiveRate())}
                  </div>
                </Card>

                <Card className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <BarChart3 className="h-4 w-4 text-blue-600" />
                    <span className="text-sm text-gray-600">Transactions</span>
                  </div>
                  <div className="text-2xl font-bold text-blue-600">
                    {transactions.length}
                  </div>
                </Card>
              </div>

              {/* Detailed Results Table */}
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300 text-sm">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-300 p-2 text-left">Transaction</th>
                      <th className="border border-gray-300 p-2 text-right">Gross Amount</th>
                      <th className="border border-gray-300 p-2 text-right">Standard Rate</th>
                      <th className="border border-gray-300 p-2 text-right">Treaty Rate</th>
                      <th className="border border-gray-300 p-2 text-right">Withholding Tax</th>
                      <th className="border border-gray-300 p-2 text-right">Treaty Savings</th>
                      <th className="border border-gray-300 p-2 text-right">Net Amount</th>
                      <th className="border border-gray-300 p-2 text-right">Effective Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {calculationResults.map(result => (
                      <tr key={result.transaction.id}>
                        <td className="border border-gray-300 p-2">
                          <div className="font-medium">{result.transaction.description}</div>
                          <div className="text-xs text-gray-600">
                            {result.transaction.sourceJurisdiction} → {result.transaction.destinationJurisdiction}
                          </div>
                        </td>
                        <td className="border border-gray-300 p-2 text-right">
                          {formatCurrency(result.grossAmount, baseCurrency)}
                        </td>
                        <td className="border border-gray-300 p-2 text-right">
                          {formatPercentage(result.standardWithholdingRate)}
                        </td>
                        <td className="border border-gray-300 p-2 text-right">
                          <span className={result.treatyWithholdingRate < result.standardWithholdingRate ? 'text-green-600' : ''}>
                            {formatPercentage(result.treatyWithholdingRate)}
                          </span>
                        </td>
                        <td className="border border-gray-300 p-2 text-right text-red-600">
                          {formatCurrency(result.withholdingTax, baseCurrency)}
                        </td>
                        <td className="border border-gray-300 p-2 text-right text-green-600">
                          {formatCurrency(result.treatySavings, baseCurrency)}
                        </td>
                        <td className="border border-gray-300 p-2 text-right font-medium">
                          {formatCurrency(result.netAmount, baseCurrency)}
                        </td>
                        <td className="border border-gray-300 p-2 text-right">
                          {formatPercentage(result.effectiveTaxRate)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="optimization" className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Tax Optimization Scenarios</h3>
                <Select value={optimizationTarget} onValueChange={(value) => setOptimizationTarget(value as any)}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Optimization target" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="minimize_tax">Minimize Tax</SelectItem>
                    <SelectItem value="maximize_efficiency">Maximize Efficiency</SelectItem>
                    <SelectItem value="reduce_complexity">Reduce Complexity</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                {optimizationScenarios.map((scenario, index) => (
                  <Card key={scenario.id} className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline">#{index + 1}</Badge>
                        <div>
                          <h4 className="font-medium">{scenario.name}</h4>
                          <div className="text-sm text-gray-600">{scenario.description}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={scenario.feasibility === 'high' ? 'default' : 
                                      scenario.feasibility === 'medium' ? 'secondary' : 'outline'}>
                          {scenario.feasibility} feasibility
                        </Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <div className="text-sm text-green-700 mb-1">Tax Savings</div>
                        <div className="text-lg font-bold text-green-600">
                          {formatCurrency(scenario.totalTaxSavings, baseCurrency)}
                        </div>
                      </div>
                      <div className="text-center p-3 bg-red-50 rounded-lg">
                        <div className="text-sm text-red-700 mb-1">Implementation Cost</div>
                        <div className="text-lg font-bold text-red-600">
                          {formatCurrency(scenario.implementationCost, baseCurrency)}
                        </div>
                      </div>
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <div className="text-sm text-blue-700 mb-1">Net Benefit</div>
                        <div className={`text-lg font-bold ${scenario.netBenefit > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {formatCurrency(scenario.netBenefit, baseCurrency)}
                        </div>
                      </div>
                    </div>

                    <div>
                      <h5 className="font-medium mb-2">Structure Changes Required:</h5>
                      <div className="space-y-1">
                        {scenario.structureChanges.map((change, changeIndex) => (
                          <div key={changeIndex} className="flex items-center gap-2 text-sm">
                            <CheckCircle className="h-3 w-3 text-green-600" />
                            {change}
                          </div>
                        ))}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="summary" className="space-y-6">
            <div className="space-y-4">
              <h3 className="font-semibold">Executive Summary</h3>

              {/* Key Metrics */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium mb-3">Current Tax Position</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-blue-700">Total Gross Amount:</span>
                    <div className="font-medium">
                      {formatCurrency(
                        calculationResults.reduce((sum, result) => sum + result.grossAmount, 0),
                        baseCurrency
                      )}
                    </div>
                  </div>
                  <div>
                    <span className="text-blue-700">Total Tax Cost:</span>
                    <div className="font-medium">{formatCurrency(getTotalTaxCost(), baseCurrency)}</div>
                  </div>
                  <div>
                    <span className="text-blue-700">Treaty Savings:</span>
                    <div className="font-medium text-green-600">{formatCurrency(getTotalTreatySavings(), baseCurrency)}</div>
                  </div>
                  <div>
                    <span className="text-blue-700">Effective Rate:</span>
                    <div className="font-medium">{formatPercentage(getAverageEffectiveRate())}</div>
                  </div>
                </div>
              </div>

              {/* Recommendations */}
              <div className="space-y-3">
                <h4 className="font-medium">Key Recommendations</h4>
                
                <Alert>
                  <TrendingUp className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Primary Optimization:</strong> {optimizationScenarios[0]?.name} could save{' '}
                    {formatCurrency(optimizationScenarios[0]?.totalTaxSavings || 0, baseCurrency)} annually
                    with net benefit of {formatCurrency(optimizationScenarios[0]?.netBenefit || 0, baseCurrency)}.
                  </AlertDescription>
                </Alert>

                <Alert>
                  <Shield className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Treaty Utilization:</strong> Current treaties are saving{' '}
                    {formatCurrency(getTotalTreatySavings(), baseCurrency)} compared to standard rates.
                    Consider additional treaty planning for further optimization.
                  </AlertDescription>
                </Alert>

                <Alert>
                  <FileText className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Compliance Considerations:</strong> Ensure economic substance requirements
                    are met in all jurisdictions and transfer pricing documentation is current.
                  </AlertDescription>
                </Alert>
              </div>

              {/* Action Items */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium mb-3">Next Steps</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3 text-green-600" />
                    Review and validate all treaty eligibility requirements
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3 text-green-600" />
                    Assess economic substance for proposed holding companies
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3 text-green-600" />
                    Prepare transfer pricing documentation for intercompany transactions
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3 text-green-600" />
                    Engage local tax advisors in target jurisdictions
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

export default CrossBorderTaxCalculator;