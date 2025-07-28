/**
 * Anti-Dilution Calculator Component
 * 
 * Specialized calculator for anti-dilution protection analysis in preferred equity.
 * Provides detailed modeling of full ratchet and weighted average protection
 * mechanisms with scenario analysis and impact assessment.
 * 
 * Features:
 * - Full ratchet vs weighted average comparison
 * - Down-round scenario modeling
 * - Conversion price adjustment calculations
 * - Dilution impact analysis
 * - Interactive scenario builder
 * - Real-time protection calculations
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
  Shield, 
  Calculator, 
  TrendingDown, 
  AlertTriangle, 
  Info, 
  BarChart3,
  Percent,
  DollarSign
} from 'lucide-react';

enum AntiDilutionProtection {
  NONE = 'none',
  FULL_RATCHET = 'full_ratchet',
  WEIGHTED_AVERAGE_NARROW = 'weighted_average_narrow',
  WEIGHTED_AVERAGE_BROAD = 'weighted_average_broad'
}

interface AntiDilutionScenario {
  id: string;
  name: string;
  originalInvestment: number;
  originalPrice: number;
  newFinancingAmount: number;
  newFinancingPrice: number;
  existingSharesOutstanding: number;
  optionPool?: number;
  convertibleSecurities?: number;
}

interface AntiDilutionResults {
  originalConversionShares: number;
  adjustedConversionPrice: {
    fullRatchet: number;
    weightedAverageNarrow: number;
    weightedAverageBroad: number;
  };
  adjustedConversionShares: {
    fullRatchet: number;
    weightedAverageNarrow: number;
    weightedAverageBroad: number;
  };
  dilutionImpact: {
    withoutProtection: number;
    fullRatchet: number;
    weightedAverageNarrow: number;
    weightedAverageBroad: number;
  };
  economicImpact: {
    fullRatchet: number;
    weightedAverageNarrow: number;
    weightedAverageBroad: number;
  };
}

interface AntiDilutionCalculatorProps {
  dealId: string;
  mode?: 'traditional' | 'assisted' | 'autonomous';
  initialScenario?: Partial<AntiDilutionScenario>;
  protection?: AntiDilutionProtection;
  onCalculationChange?: (results: AntiDilutionResults) => void;
  className?: string;
}

const AntiDilutionCalculator: React.FC<AntiDilutionCalculatorProps> = ({
  dealId,
  mode = 'traditional',
  initialScenario,
  protection,
  onCalculationChange,
  className
}) => {
  // State management
  const [scenario, setScenario] = useState<AntiDilutionScenario>({
    id: '1',
    name: 'Down Round Scenario',
    originalInvestment: 10000000,
    originalPrice: 2.00,
    newFinancingAmount: 5000000,
    newFinancingPrice: 1.00,
    existingSharesOutstanding: 10000000,
    optionPool: 2000000,
    convertibleSecurities: 1000000,
    ...initialScenario
  });

  const [activeTab, setActiveTab] = useState('scenario');
  const [comparisonMode, setComparisonMode] = useState<'table' | 'chart'>('table');

  // Calculate anti-dilution results
  const results = useMemo((): AntiDilutionResults => {
    const {
      originalInvestment,
      originalPrice,
      newFinancingAmount,
      newFinancingPrice,
      existingSharesOutstanding,
      optionPool = 0,
      convertibleSecurities = 0
    } = scenario;

    // Original conversion shares
    const originalConversionShares = originalInvestment / originalPrice;
    
    // New shares issued in down round
    const newSharesIssued = newFinancingAmount / newFinancingPrice;
    
    // Total shares for weighted average calculation
    const totalSharesNarrow = existingSharesOutstanding + newSharesIssued;
    const totalSharesBroad = existingSharesOutstanding + optionPool + convertibleSecurities + newSharesIssued;
    
    // Calculate adjusted conversion prices
    const adjustedConversionPrice = {
      // Full Ratchet: Conversion price adjusts to new financing price
      fullRatchet: newFinancingPrice,
      
      // Weighted Average (Narrow Basis)
      weightedAverageNarrow: (originalPrice * existingSharesOutstanding + newFinancingAmount) / totalSharesNarrow,
      
      // Weighted Average (Broad Basis)
      weightedAverageBroad: (originalPrice * (existingSharesOutstanding + optionPool + convertibleSecurities) + newFinancingAmount) / totalSharesBroad
    };

    // Calculate adjusted conversion shares
    const adjustedConversionShares = {
      fullRatchet: originalInvestment / adjustedConversionPrice.fullRatchet,
      weightedAverageNarrow: originalInvestment / adjustedConversionPrice.weightedAverageNarrow,
      weightedAverageBroad: originalInvestment / adjustedConversionPrice.weightedAverageBroad
    };

    // Calculate dilution impact (percentage ownership)
    const totalSharesAfterFinancing = existingSharesOutstanding + newSharesIssued;
    
    const dilutionImpact = {
      withoutProtection: originalConversionShares / (totalSharesAfterFinancing + originalConversionShares),
      fullRatchet: adjustedConversionShares.fullRatchet / (totalSharesAfterFinancing + adjustedConversionShares.fullRatchet),
      weightedAverageNarrow: adjustedConversionShares.weightedAverageNarrow / (totalSharesAfterFinancing + adjustedConversionShares.weightedAverageNarrow),
      weightedAverageBroad: adjustedConversionShares.weightedAverageBroad / (totalSharesAfterFinancing + adjustedConversionShares.weightedAverageBroad)
    };

    // Calculate economic impact (additional shares received)
    const economicImpact = {
      fullRatchet: (adjustedConversionShares.fullRatchet - originalConversionShares) * newFinancingPrice,
      weightedAverageNarrow: (adjustedConversionShares.weightedAverageNarrow - originalConversionShares) * newFinancingPrice,
      weightedAverageBroad: (adjustedConversionShares.weightedAverageBroad - originalConversionShares) * newFinancingPrice
    };

    return {
      originalConversionShares,
      adjustedConversionPrice,
      adjustedConversionShares,
      dilutionImpact,
      economicImpact
    };
  }, [scenario]);

  // Update parent component when results change
  React.useEffect(() => {
    if (onCalculationChange) {
      onCalculationChange(results);
    }
  }, [results, onCalculationChange]);

  // Update scenario
  const updateScenario = (updates: Partial<AntiDilutionScenario>) => {
    setScenario(prev => ({ ...prev, ...updates }));
  };

  // Protection type recommendations
  const getProtectionRecommendation = (dilutionWithout: number, dilutionWith: number) => {
    const improvement = dilutionWith - dilutionWithout;
    if (improvement > 0.05) return { type: 'high', label: 'High Protection' };
    if (improvement > 0.02) return { type: 'medium', label: 'Medium Protection' };
    return { type: 'low', label: 'Low Protection' };
  };

  const formatCurrency = (amount: number, decimals: number = 2) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(amount);
  };

  const formatPercentage = (value: number, decimals: number = 1) => {
    return new Intl.NumberFormat('en-US', {
      style: 'percent',
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(value);
  };

  return (
    <Card className={`w-full ${className}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-600" />
            <CardTitle>Anti-Dilution Protection Calculator</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">
              Down Round: {formatPercentage((scenario.originalPrice - scenario.newFinancingPrice) / scenario.originalPrice)}
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
            <TabsTrigger value="scenario">Scenario</TabsTrigger>
            <TabsTrigger value="calculations">Calculations</TabsTrigger>
            <TabsTrigger value="comparison">Comparison</TabsTrigger>
            <TabsTrigger value="analysis">Analysis</TabsTrigger>
          </TabsList>

          <TabsContent value="scenario" className="space-y-6">
            <div className="space-y-4">
              <h3 className="font-semibold">Down Round Scenario Configuration</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Original Investment Terms */}
                <div className="space-y-4">
                  <h4 className="font-medium text-blue-900">Original Investment</h4>
                  
                  <div>
                    <Label htmlFor="originalInvestment">Investment Amount</Label>
                    <Input
                      id="originalInvestment"
                      type="number"
                      value={scenario.originalInvestment}
                      onChange={(e) => updateScenario({ originalInvestment: Number(e.target.value) })}
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="originalPrice">Original Price per Share</Label>
                    <Input
                      id="originalPrice"
                      type="number"
                      step="0.01"
                      value={scenario.originalPrice}
                      onChange={(e) => updateScenario({ originalPrice: Number(e.target.value) })}
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="existingShares">Existing Shares Outstanding</Label>
                    <Input
                      id="existingShares"
                      type="number"
                      value={scenario.existingSharesOutstanding}
                      onChange={(e) => updateScenario({ existingSharesOutstanding: Number(e.target.value) })}
                      className="mt-1"
                    />
                  </div>
                </div>

                {/* New Financing Terms */}
                <div className="space-y-4">
                  <h4 className="font-medium text-red-900">New Financing (Down Round)</h4>
                  
                  <div>
                    <Label htmlFor="newFinancingAmount">New Financing Amount</Label>
                    <Input
                      id="newFinancingAmount"
                      type="number"
                      value={scenario.newFinancingAmount}
                      onChange={(e) => updateScenario({ newFinancingAmount: Number(e.target.value) })}
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="newFinancingPrice">New Price per Share</Label>
                    <Input
                      id="newFinancingPrice"
                      type="number"
                      step="0.01"
                      value={scenario.newFinancingPrice}
                      onChange={(e) => updateScenario({ newFinancingPrice: Number(e.target.value) })}
                      className="mt-1"
                    />
                  </div>
                  
                  <div className="bg-red-50 p-3 rounded-lg">
                    <div className="flex items-center gap-2 text-red-800">
                      <TrendingDown className="h-4 w-4" />
                      <span className="font-medium">Down Round Impact</span>
                    </div>
                    <div className="text-sm text-red-700 mt-1">
                      Price decreased by {formatPercentage((scenario.originalPrice - scenario.newFinancingPrice) / scenario.originalPrice)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Parameters */}
              <div className="space-y-4">
                <h4 className="font-medium">Additional Parameters (for Weighted Average Broad Basis)</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="optionPool">Option Pool Shares</Label>
                    <Input
                      id="optionPool"
                      type="number"
                      value={scenario.optionPool || 0}
                      onChange={(e) => updateScenario({ optionPool: Number(e.target.value) })}
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="convertibleSecurities">Convertible Securities</Label>
                    <Input
                      id="convertibleSecurities"
                      type="number"
                      value={scenario.convertibleSecurities || 0}
                      onChange={(e) => updateScenario({ convertibleSecurities: Number(e.target.value) })}
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="calculations" className="space-y-6">
            <div className="space-y-4">
              <h3 className="font-semibold">Anti-Dilution Calculations</h3>
              
              {/* Original Terms */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium mb-3">Original Investment Terms</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Investment:</span>
                    <div className="font-medium">{formatCurrency(scenario.originalInvestment)}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Price per Share:</span>
                    <div className="font-medium">{formatCurrency(scenario.originalPrice)}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Conversion Shares:</span>
                    <div className="font-medium">{results.originalConversionShares.toLocaleString()}</div>
                  </div>
                </div>
              </div>

              {/* Adjusted Conversion Prices */}
              <div className="space-y-3">
                <h4 className="font-medium">Adjusted Conversion Prices</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="h-4 w-4 text-orange-600" />
                      <span className="font-medium">Full Ratchet</span>
                    </div>
                    <div className="text-2xl font-bold text-orange-600">
                      {formatCurrency(results.adjustedConversionPrice.fullRatchet)}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      {results.adjustedConversionShares.fullRatchet.toLocaleString()} shares
                    </div>
                    <div className="text-xs text-gray-500 mt-2">
                      Price adjusts to new financing price
                    </div>
                  </Card>

                  <Card className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <BarChart3 className="h-4 w-4 text-blue-600" />
                      <span className="font-medium">Weighted Avg (Narrow)</span>
                    </div>
                    <div className="text-2xl font-bold text-blue-600">
                      {formatCurrency(results.adjustedConversionPrice.weightedAverageNarrow)}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      {results.adjustedConversionShares.weightedAverageNarrow.toLocaleString()} shares
                    </div>
                    <div className="text-xs text-gray-500 mt-2">
                      Includes only common + new shares
                    </div>
                  </Card>

                  <Card className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <BarChart3 className="h-4 w-4 text-green-600" />
                      <span className="font-medium">Weighted Avg (Broad)</span>
                    </div>
                    <div className="text-2xl font-bold text-green-600">
                      {formatCurrency(results.adjustedConversionPrice.weightedAverageBroad)}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      {results.adjustedConversionShares.weightedAverageBroad.toLocaleString()} shares
                    </div>
                    <div className="text-xs text-gray-500 mt-2">
                      Includes options + convertibles
                    </div>
                  </Card>
                </div>
              </div>

              {/* Calculation Formulas */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium mb-3">Calculation Formulas</h4>
                <div className="space-y-2 text-sm">
                  <div>
                    <strong>Full Ratchet:</strong> New Conversion Price = New Financing Price
                  </div>
                  <div>
                    <strong>Weighted Average (Narrow):</strong> 
                    <div className="ml-4 font-mono text-xs bg-white p-2 rounded mt-1">
                      (Original Price × Existing Shares + New Investment) ÷ (Existing Shares + New Shares)
                    </div>
                  </div>
                  <div>
                    <strong>Weighted Average (Broad):</strong>
                    <div className="ml-4 font-mono text-xs bg-white p-2 rounded mt-1">
                      (Original Price × (Existing + Options + Convertibles) + New Investment) ÷ (All Shares + New Shares)
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="comparison" className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Protection Method Comparison</h3>
                <Select value={comparisonMode} onValueChange={(value) => setComparisonMode(value as any)}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="View mode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="table">Table View</SelectItem>
                    <SelectItem value="chart">Chart View</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Ownership Percentage Comparison */}
              <div className="space-y-3">
                <h4 className="font-medium">Ownership Percentage After Financing</h4>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Card className="p-4">
                    <div className="text-center">
                      <div className="text-sm text-gray-600 mb-1">No Protection</div>
                      <div className="text-2xl font-bold text-red-600">
                        {formatPercentage(results.dilutionImpact.withoutProtection)}
                      </div>
                    </div>
                  </Card>

                  <Card className="p-4">
                    <div className="text-center">
                      <div className="text-sm text-gray-600 mb-1">Full Ratchet</div>
                      <div className="text-2xl font-bold text-orange-600">
                        {formatPercentage(results.dilutionImpact.fullRatchet)}
                      </div>
                      <Badge 
                        variant={getProtectionRecommendation(results.dilutionImpact.withoutProtection, results.dilutionImpact.fullRatchet).type === 'high' ? 'default' : 'secondary'}
                        className="text-xs mt-2"
                      >
                        {getProtectionRecommendation(results.dilutionImpact.withoutProtection, results.dilutionImpact.fullRatchet).label}
                      </Badge>
                    </div>
                  </Card>

                  <Card className="p-4">
                    <div className="text-center">
                      <div className="text-sm text-gray-600 mb-1">WA Narrow</div>
                      <div className="text-2xl font-bold text-blue-600">
                        {formatPercentage(results.dilutionImpact.weightedAverageNarrow)}
                      </div>
                      <Badge 
                        variant={getProtectionRecommendation(results.dilutionImpact.withoutProtection, results.dilutionImpact.weightedAverageNarrow).type === 'high' ? 'default' : 'secondary'}
                        className="text-xs mt-2"
                      >
                        {getProtectionRecommendation(results.dilutionImpact.withoutProtection, results.dilutionImpact.weightedAverageNarrow).label}
                      </Badge>
                    </div>
                  </Card>

                  <Card className="p-4">
                    <div className="text-center">
                      <div className="text-sm text-gray-600 mb-1">WA Broad</div>
                      <div className="text-2xl font-bold text-green-600">
                        {formatPercentage(results.dilutionImpact.weightedAverageBroad)}
                      </div>
                      <Badge 
                        variant={getProtectionRecommendation(results.dilutionImpact.withoutProtection, results.dilutionImpact.weightedAverageBroad).type === 'high' ? 'default' : 'secondary'}
                        className="text-xs mt-2"
                      >
                        {getProtectionRecommendation(results.dilutionImpact.withoutProtection, results.dilutionImpact.weightedAverageBroad).label}
                      </Badge>
                    </div>
                  </Card>
                </div>
              </div>

              {/* Economic Impact */}
              <div className="space-y-3">
                <h4 className="font-medium">Economic Impact (Additional Value from Protection)</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-orange-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign className="h-4 w-4 text-orange-600" />
                      <span className="font-medium">Full Ratchet</span>
                    </div>
                    <div className="text-xl font-bold text-orange-600">
                      {formatCurrency(results.economicImpact.fullRatchet)}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      Additional {(results.adjustedConversionShares.fullRatchet - results.originalConversionShares).toLocaleString()} shares
                    </div>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign className="h-4 w-4 text-blue-600" />
                      <span className="font-medium">WA Narrow</span>
                    </div>
                    <div className="text-xl font-bold text-blue-600">
                      {formatCurrency(results.economicImpact.weightedAverageNarrow)}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      Additional {(results.adjustedConversionShares.weightedAverageNarrow - results.originalConversionShares).toLocaleString()} shares
                    </div>
                  </div>

                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign className="h-4 w-4 text-green-600" />
                      <span className="font-medium">WA Broad</span>
                    </div>
                    <div className="text-xl font-bold text-green-600">
                      {formatCurrency(results.economicImpact.weightedAverageBroad)}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      Additional {(results.adjustedConversionShares.weightedAverageBroad - results.originalConversionShares).toLocaleString()} shares
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="analysis" className="space-y-6">
            <div className="space-y-4">
              <h3 className="font-semibold">Protection Analysis & Recommendations</h3>
              
              {/* Key Insights */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Dilution Protection Impact:</strong><br/>
                    Without protection, ownership would drop to {formatPercentage(results.dilutionImpact.withoutProtection)}. 
                    Full ratchet provides maximum protection at {formatPercentage(results.dilutionImpact.fullRatchet)} ownership.
                  </AlertDescription>
                </Alert>

                <Alert>
                  <Calculator className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Economic Value:</strong><br/>
                    Full ratchet protection adds {formatCurrency(results.economicImpact.fullRatchet)} in value, 
                    representing a {formatPercentage(results.economicImpact.fullRatchet / scenario.originalInvestment)} 
                    return on original investment.
                  </AlertDescription>
                </Alert>
              </div>

              {/* Protection Comparison Table */}
              <div>
                <h4 className="font-medium mb-3">Detailed Comparison Table</h4>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="border border-gray-300 p-2 text-left">Protection Type</th>
                        <th className="border border-gray-300 p-2 text-right">Conversion Price</th>
                        <th className="border border-gray-300 p-2 text-right">Conversion Shares</th>
                        <th className="border border-gray-300 p-2 text-right">Ownership %</th>
                        <th className="border border-gray-300 p-2 text-right">Economic Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-gray-300 p-2 font-medium text-red-600">No Protection</td>
                        <td className="border border-gray-300 p-2 text-right">{formatCurrency(scenario.originalPrice)}</td>
                        <td className="border border-gray-300 p-2 text-right">{results.originalConversionShares.toLocaleString()}</td>
                        <td className="border border-gray-300 p-2 text-right">{formatPercentage(results.dilutionImpact.withoutProtection)}</td>
                        <td className="border border-gray-300 p-2 text-right">-</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 p-2 font-medium text-orange-600">Full Ratchet</td>
                        <td className="border border-gray-300 p-2 text-right">{formatCurrency(results.adjustedConversionPrice.fullRatchet)}</td>
                        <td className="border border-gray-300 p-2 text-right">{results.adjustedConversionShares.fullRatchet.toLocaleString()}</td>
                        <td className="border border-gray-300 p-2 text-right">{formatPercentage(results.dilutionImpact.fullRatchet)}</td>
                        <td className="border border-gray-300 p-2 text-right">{formatCurrency(results.economicImpact.fullRatchet)}</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 p-2 font-medium text-blue-600">Weighted Avg (Narrow)</td>
                        <td className="border border-gray-300 p-2 text-right">{formatCurrency(results.adjustedConversionPrice.weightedAverageNarrow)}</td>
                        <td className="border border-gray-300 p-2 text-right">{results.adjustedConversionShares.weightedAverageNarrow.toLocaleString()}</td>
                        <td className="border border-gray-300 p-2 text-right">{formatPercentage(results.dilutionImpact.weightedAverageNarrow)}</td>
                        <td className="border border-gray-300 p-2 text-right">{formatCurrency(results.economicImpact.weightedAverageNarrow)}</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 p-2 font-medium text-green-600">Weighted Avg (Broad)</td>
                        <td className="border border-gray-300 p-2 text-right">{formatCurrency(results.adjustedConversionPrice.weightedAverageBroad)}</td>
                        <td className="border border-gray-300 p-2 text-right">{results.adjustedConversionShares.weightedAverageBroad.toLocaleString()}</td>
                        <td className="border border-gray-300 p-2 text-right">{formatPercentage(results.dilutionImpact.weightedAverageBroad)}</td>
                        <td className="border border-gray-300 p-2 text-right">{formatCurrency(results.economicImpact.weightedAverageBroad)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Recommendations */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium mb-3">Recommendations</h4>
                <div className="space-y-2 text-sm">
                  <div>
                    <strong>For Investors:</strong> Full ratchet provides maximum protection but may be difficult to negotiate. 
                    Weighted average broad basis offers reasonable protection while being more company-friendly.
                  </div>
                  <div>
                    <strong>For Companies:</strong> Weighted average broad basis is most common and balanced. 
                    Consider carve-outs for employee option pools and strategic investors.
                  </div>
                  <div>
                    <strong>Down Round Impact:</strong> In this {formatPercentage((scenario.originalPrice - scenario.newFinancingPrice) / scenario.originalPrice)} 
                    down round, protection mechanisms provide significant value to preferred shareholders.
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

export default AntiDilutionCalculator;