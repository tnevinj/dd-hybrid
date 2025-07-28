/**
 * Tax Jurisdiction Analyzer Component
 * 
 * Advanced jurisdiction analysis interface for multi-jurisdiction tax optimization.
 * Provides comprehensive comparison of tax regimes, treaty networks, and
 * regulatory requirements across multiple jurisdictions.
 * 
 * Features:
 * - Interactive jurisdiction comparison
 * - Tax rate analysis and benchmarking
 * - Treaty network visualization
 * - Regulatory complexity assessment
 * - Economic substance requirements
 * - Real-time scoring and ranking
 * - Detailed jurisdiction profiles
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
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Globe, 
  BarChart3, 
  Shield, 
  FileText, 
  TrendingUp,
  Scale,
  MapPin,
  Star,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Info,
  Filter
} from 'lucide-react';

type Currency = 'USD' | 'EUR' | 'GBP' | 'CAD';

enum IncomeType {
  DIVIDENDS = 'dividends',
  INTEREST = 'interest',
  ROYALTIES = 'royalties',
  CAPITAL_GAINS = 'capital_gains'
}

enum EntityType {
  INVESTMENT_COMPANY = 'investment_company',
  HOLDING_COMPANY = 'holding_company',
  TRADING_COMPANY = 'trading_company',
  IP_HOLDING = 'ip_holding'
}

interface WithholdingTaxRate {
  incomeType: IncomeType;
  rate: number;
  conditions: string[];
  treatyReduction?: number;
}

interface TaxJurisdiction {
  code: string;
  name: string;
  corporateTaxRate: number;
  dividendTaxRate: number;
  interestTaxRate: number;
  royaltyTaxRate: number;
  capitalGainsTaxRate: number;
  withholdingTaxRates: WithholdingTaxRate[];
  regulatoryRequirements: string[];
  treatyNetwork: string[];
  taxIncentives?: string[];
}

interface JurisdictionScore {
  jurisdiction: TaxJurisdiction;
  overallScore: number;
  taxEfficiencyScore: number;
  treatyNetworkScore: number;
  regulatoryScore: number;
  complianceScore: number;
  incentivesScore: number;
  ranking: number;
}

interface ComparisonCriteria {
  incomeTypes: IncomeType[];
  entityType: EntityType;
  annualIncome: number;
  prioritizeFactors: ('tax_efficiency' | 'treaty_network' | 'regulatory_ease' | 'compliance_cost' | 'incentives')[];
  requireSubstance: boolean;
  maxComplexity: 'low' | 'medium' | 'high';
}

interface TaxJurisdictionAnalyzerProps {
  dealId: string;
  mode?: 'traditional' | 'assisted' | 'autonomous';
  availableJurisdictions?: TaxJurisdiction[];
  onJurisdictionSelect?: (jurisdictions: TaxJurisdiction[]) => void;
  className?: string;
}

const TaxJurisdictionAnalyzer: React.FC<TaxJurisdictionAnalyzerProps> = ({
  dealId,
  mode = 'traditional',
  availableJurisdictions,
  onJurisdictionSelect,
  className
}) => {
  // Default jurisdictions data
  const defaultJurisdictions: TaxJurisdiction[] = [
    {
      code: 'IE',
      name: 'Ireland',
      corporateTaxRate: 0.125,
      dividendTaxRate: 0.25,
      interestTaxRate: 0.20,
      royaltyTaxRate: 0.20,
      capitalGainsTaxRate: 0.33,
      withholdingTaxRates: [
        { incomeType: IncomeType.DIVIDENDS, rate: 0.20, conditions: ['Standard rate'], treatyReduction: 0.05 },
        { incomeType: IncomeType.INTEREST, rate: 0.20, conditions: ['Standard rate'], treatyReduction: 0.00 },
        { incomeType: IncomeType.ROYALTIES, rate: 0.20, conditions: ['Standard rate'], treatyReduction: 0.00 }
      ],
      regulatoryRequirements: ['CRO filing', 'Annual returns', 'Economic substance'],
      treatyNetwork: ['US', 'UK', 'DE', 'NL', 'SG', 'CN'],
      taxIncentives: ['IP Box regime (6.25%)', 'R&D credit (25%)', 'Capital allowances']
    },
    {
      code: 'NL',
      name: 'Netherlands',
      corporateTaxRate: 0.25,
      dividendTaxRate: 0.15,
      interestTaxRate: 0.25,
      royaltyTaxRate: 0.25,
      capitalGainsTaxRate: 0.25,
      withholdingTaxRates: [
        { incomeType: IncomeType.DIVIDENDS, rate: 0.15, conditions: ['Standard rate'], treatyReduction: 0.05 },
        { incomeType: IncomeType.INTEREST, rate: 0.00, conditions: ['No withholding'], treatyReduction: 0.00 },
        { incomeType: IncomeType.ROYALTIES, rate: 0.00, conditions: ['No withholding'], treatyReduction: 0.00 }
      ],
      regulatoryRequirements: ['KvK registration', 'Annual filing', 'Substance requirements'],
      treatyNetwork: ['US', 'UK', 'DE', 'IE', 'SG', 'CN', 'IN'],
      taxIncentives: ['Innovation box (7%)', 'Participation exemption', 'Patent box']
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
        { incomeType: IncomeType.DIVIDENDS, rate: 0.00, conditions: ['No withholding'], treatyReduction: 0.00 },
        { incomeType: IncomeType.INTEREST, rate: 0.15, conditions: ['Standard rate'], treatyReduction: 0.05 },
        { incomeType: IncomeType.ROYALTIES, rate: 0.10, conditions: ['Standard rate'], treatyReduction: 0.05 }
      ],
      regulatoryRequirements: ['ACRA filing', 'Annual returns', 'Resident director'],
      treatyNetwork: ['US', 'UK', 'DE', 'NL', 'IE', 'CN', 'IN', 'MY'],
      taxIncentives: ['Global trader program', 'Financial sector incentive', 'IP development incentive']
    },
    {
      code: 'LU',
      name: 'Luxembourg',
      corporateTaxRate: 0.2417,
      dividendTaxRate: 0.15,
      interestTaxRate: 0.20,
      royaltyTaxRate: 0.20,
      capitalGainsTaxRate: 0.2417,
      withholdingTaxRates: [
        { incomeType: IncomeType.DIVIDENDS, rate: 0.15, conditions: ['Standard rate'], treatyReduction: 0.05 },
        { incomeType: IncomeType.INTEREST, rate: 0.20, conditions: ['Standard rate'], treatyReduction: 0.00 },
        { incomeType: IncomeType.ROYALTIES, rate: 0.20, conditions: ['Standard rate'], treatyReduction: 0.00 }
      ],
      regulatoryRequirements: ['RCS registration', 'Annual filing', 'Substance requirements'],
      treatyNetwork: ['US', 'UK', 'DE', 'NL', 'IE', 'CN', 'SG'],
      taxIncentives: ['IP regime (5.76%)', 'R&D deductions', 'Holding company regime']
    },
    {
      code: 'US',
      name: 'United States',
      corporateTaxRate: 0.21,
      dividendTaxRate: 0.30,
      interestTaxRate: 0.30,
      royaltyTaxRate: 0.30,
      capitalGainsTaxRate: 0.21,
      withholdingTaxRates: [
        { incomeType: IncomeType.DIVIDENDS, rate: 0.30, conditions: ['Standard rate'], treatyReduction: 0.15 },
        { incomeType: IncomeType.INTEREST, rate: 0.30, conditions: ['Standard rate'], treatyReduction: 0.10 },
        { incomeType: IncomeType.ROYALTIES, rate: 0.30, conditions: ['Standard rate'], treatyReduction: 0.10 }
      ],
      regulatoryRequirements: ['SEC registration', 'Federal tax filing', 'State compliance'],
      treatyNetwork: ['UK', 'DE', 'NL', 'IE', 'SG', 'CN', 'LU'],
      taxIncentives: ['R&D credit', 'Foreign tax credit', 'Opportunity zones']
    }
  ];

  // State management
  const [jurisdictions] = useState<TaxJurisdiction[]>(availableJurisdictions || defaultJurisdictions);
  const [selectedJurisdictions, setSelectedJurisdictions] = useState<string[]>(['IE', 'NL', 'SG']);
  const [comparisonCriteria, setComparisonCriteria] = useState<ComparisonCriteria>({
    incomeTypes: [IncomeType.DIVIDENDS, IncomeType.ROYALTIES],
    entityType: EntityType.INVESTMENT_COMPANY,
    annualIncome: 10000000,
    prioritizeFactors: ['tax_efficiency', 'treaty_network'],
    requireSubstance: true,
    maxComplexity: 'medium'
  });
  const [activeTab, setActiveTab] = useState('comparison');
  const [filterCriteria, setFilterCriteria] = useState({
    maxCorporateRate: 0.30,
    minTreatyCount: 5,
    hasIPIncentives: false,
    lowComplexity: false
  });

  // Calculate jurisdiction scores
  const jurisdictionScores = useMemo((): JurisdictionScore[] => {
    const scores = jurisdictions.map(jurisdiction => {
      // Tax efficiency score (40% weight)
      const avgTaxRate = (
        jurisdiction.corporateTaxRate +
        jurisdiction.dividendTaxRate +
        jurisdiction.interestTaxRate +
        jurisdiction.royaltyTaxRate
      ) / 4;
      const taxEfficiencyScore = (1 - avgTaxRate) * 100;

      // Treaty network score (25% weight)
      const treatyNetworkScore = Math.min(jurisdiction.treatyNetwork.length * 10, 100);

      // Regulatory score (15% weight) - based on requirements count (lower is better)
      const regulatoryScore = Math.max(100 - jurisdiction.regulatoryRequirements.length * 15, 0);

      // Compliance score (10% weight) - simplified calculation
      const complianceScore = 75; // Would be calculated based on actual compliance complexity

      // Incentives score (10% weight)
      const incentivesScore = Math.min((jurisdiction.taxIncentives?.length || 0) * 25, 100);

      // Calculate weighted overall score
      const overallScore = (
        taxEfficiencyScore * 0.40 +
        treatyNetworkScore * 0.25 +
        regulatoryScore * 0.15 +
        complianceScore * 0.10 +
        incentivesScore * 0.10
      );

      return {
        jurisdiction,
        overallScore,
        taxEfficiencyScore,
        treatyNetworkScore,
        regulatoryScore,
        complianceScore,
        incentivesScore,
        ranking: 0 // Will be set after sorting
      };
    });

    // Sort by overall score and assign rankings
    const sortedScores = scores.sort((a, b) => b.overallScore - a.overallScore);
    return sortedScores.map((score, index) => ({
      ...score,
      ranking: index + 1
    }));
  }, [jurisdictions]);

  // Filter jurisdictions based on criteria
  const filteredJurisdictions = useMemo(() => {
    return jurisdictionScores.filter(score => {
      const jurisdiction = score.jurisdiction;
      
      if (jurisdiction.corporateTaxRate > filterCriteria.maxCorporateRate) return false;
      if (jurisdiction.treatyNetwork.length < filterCriteria.minTreatyCount) return false;
      if (filterCriteria.hasIPIncentives && !jurisdiction.taxIncentives?.some(i => i.toLowerCase().includes('ip'))) return false;
      if (filterCriteria.lowComplexity && jurisdiction.regulatoryRequirements.length > 3) return false;
      
      return true;
    });
  }, [jurisdictionScores, filterCriteria]);

  // Get selected jurisdiction details
  const selectedJurisdictionDetails = useMemo(() => {
    return selectedJurisdictions.map(code => 
      jurisdictionScores.find(score => score.jurisdiction.code === code)
    ).filter(Boolean) as JurisdictionScore[];
  }, [selectedJurisdictions, jurisdictionScores]);

  // Helper functions
  const toggleJurisdictionSelection = (code: string) => {
    const newSelection = selectedJurisdictions.includes(code)
      ? selectedJurisdictions.filter(j => j !== code)
      : [...selectedJurisdictions, code];
    
    setSelectedJurisdictions(newSelection);
    
    if (onJurisdictionSelect) {
      const selectedJurisdictionObjects = newSelection.map(code => 
        jurisdictions.find(j => j.code === code)
      ).filter(Boolean) as TaxJurisdiction[];
      onJurisdictionSelect(selectedJurisdictionObjects);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadgeVariant = (score: number) => {
    if (score >= 80) return 'default';
    if (score >= 60) return 'secondary';
    return 'outline';
  };

  const formatPercentage = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'percent',
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    }).format(value);
  };

  const formatCurrency = (amount: number, curr: Currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: curr,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Card className={`w-full ${className}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-blue-600" />
            <CardTitle>Tax Jurisdiction Analyzer</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">
              {filteredJurisdictions.length} of {jurisdictions.length} Jurisdictions
            </Badge>
            <Badge variant="outline">
              {selectedJurisdictions.length} Selected
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
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="comparison">Comparison</TabsTrigger>
            <TabsTrigger value="rankings">Rankings</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="treaties">Treaties</TabsTrigger>
            <TabsTrigger value="filters">Filters</TabsTrigger>
          </TabsList>

          <TabsContent value="comparison" className="space-y-6">
            <div className="space-y-4">
              <h3 className="font-semibold">Jurisdiction Comparison</h3>
              
              {/* Selection Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
                {filteredJurisdictions.map(score => (
                  <div key={score.jurisdiction.code} className="relative">
                    <Button
                      variant={selectedJurisdictions.includes(score.jurisdiction.code) ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => toggleJurisdictionSelection(score.jurisdiction.code)}
                      className="w-full h-auto p-3 flex flex-col items-center"
                    >
                      <div className="flex items-center gap-1 mb-1">
                        <span className="font-medium">{score.jurisdiction.code}</span>
                        <Badge variant="outline" className="text-xs">
                          #{score.ranking}
                        </Badge>
                      </div>
                      <div className="text-xs text-gray-600">
                        {score.jurisdiction.name}
                      </div>
                      <div className={`text-xs font-medium ${getScoreColor(score.overallScore)}`}>
                        {score.overallScore.toFixed(0)}
                      </div>
                    </Button>
                  </div>
                ))}
              </div>

              {/* Comparison Table */}
              {selectedJurisdictionDetails.length > 0 && (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300 text-sm">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="border border-gray-300 p-2 text-left">Metric</th>
                        {selectedJurisdictionDetails.map(score => (
                          <th key={score.jurisdiction.code} className="border border-gray-300 p-2 text-center">
                            {score.jurisdiction.code}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-gray-300 p-2 font-medium">Overall Score</td>
                        {selectedJurisdictionDetails.map(score => (
                          <td key={score.jurisdiction.code} className="border border-gray-300 p-2 text-center">
                            <Badge variant={getScoreBadgeVariant(score.overallScore)}>
                              {score.overallScore.toFixed(0)}
                            </Badge>
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className="border border-gray-300 p-2 font-medium">Corporate Tax Rate</td>
                        {selectedJurisdictionDetails.map(score => (
                          <td key={score.jurisdiction.code} className="border border-gray-300 p-2 text-center">
                            {formatPercentage(score.jurisdiction.corporateTaxRate)}
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className="border border-gray-300 p-2 font-medium">Dividend Rate</td>
                        {selectedJurisdictionDetails.map(score => (
                          <td key={score.jurisdiction.code} className="border border-gray-300 p-2 text-center">
                            {formatPercentage(score.jurisdiction.dividendTaxRate)}
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className="border border-gray-300 p-2 font-medium">Treaty Network</td>
                        {selectedJurisdictionDetails.map(score => (
                          <td key={score.jurisdiction.code} className="border border-gray-300 p-2 text-center">
                            <Badge variant="outline">
                              {score.jurisdiction.treatyNetwork.length}
                            </Badge>
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className="border border-gray-300 p-2 font-medium">Tax Incentives</td>
                        {selectedJurisdictionDetails.map(score => (
                          <td key={score.jurisdiction.code} className="border border-gray-300 p-2 text-center">
                            <Badge variant="outline">
                              {score.jurisdiction.taxIncentives?.length || 0}
                            </Badge>
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className="border border-gray-300 p-2 font-medium">Regulatory Requirements</td>
                        {selectedJurisdictionDetails.map(score => (
                          <td key={score.jurisdiction.code} className="border border-gray-300 p-2 text-center">
                            <Badge variant="outline">
                              {score.jurisdiction.regulatoryRequirements.length}
                            </Badge>
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="rankings" className="space-y-6">
            <div className="space-y-4">
              <h3 className="font-semibold">Jurisdiction Rankings</h3>
              
              <div className="space-y-3">
                {filteredJurisdictions.map(score => (
                  <Card key={score.jurisdiction.code} className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="px-2 py-1">
                          #{score.ranking}
                        </Badge>
                        <div>
                          <h4 className="font-medium">{score.jurisdiction.name}</h4>
                          <div className="text-sm text-gray-600">{score.jurisdiction.code}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={getScoreBadgeVariant(score.overallScore)} className="px-3 py-1">
                          {score.overallScore.toFixed(0)} Score
                        </Badge>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleJurisdictionSelection(score.jurisdiction.code)}
                        >
                          {selectedJurisdictions.includes(score.jurisdiction.code) ? (
                            <CheckCircle className="h-4 w-4" />
                          ) : (
                            'Select'
                          )}
                        </Button>
                      </div>
                    </div>

                    {/* Score Breakdown */}
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                      <div>
                        <div className="text-gray-600 mb-1">Tax Efficiency</div>
                        <div className="flex items-center gap-2">
                          <Progress value={score.taxEfficiencyScore} className="h-2 flex-1" />
                          <span className="text-xs font-medium">{score.taxEfficiencyScore.toFixed(0)}</span>
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-600 mb-1">Treaty Network</div>
                        <div className="flex items-center gap-2">
                          <Progress value={score.treatyNetworkScore} className="h-2 flex-1" />
                          <span className="text-xs font-medium">{score.treatyNetworkScore.toFixed(0)}</span>
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-600 mb-1">Regulatory</div>
                        <div className="flex items-center gap-2">
                          <Progress value={score.regulatoryScore} className="h-2 flex-1" />
                          <span className="text-xs font-medium">{score.regulatoryScore.toFixed(0)}</span>
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-600 mb-1">Compliance</div>
                        <div className="flex items-center gap-2">
                          <Progress value={score.complianceScore} className="h-2 flex-1" />
                          <span className="text-xs font-medium">{score.complianceScore.toFixed(0)}</span>
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-600 mb-1">Incentives</div>
                        <div className="flex items-center gap-2">
                          <Progress value={score.incentivesScore} className="h-2 flex-1" />
                          <span className="text-xs font-medium">{score.incentivesScore.toFixed(0)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Key Highlights */}
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <div className="flex items-center gap-4 text-xs text-gray-600">
                        <span>Corp: {formatPercentage(score.jurisdiction.corporateTaxRate)}</span>
                        <span>Treaties: {score.jurisdiction.treatyNetwork.length}</span>
                        <span>Incentives: {score.jurisdiction.taxIncentives?.length || 0}</span>
                        <span>Requirements: {score.jurisdiction.regulatoryRequirements.length}</span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="details" className="space-y-6">
            <div className="space-y-4">
              <h3 className="font-semibold">Detailed Jurisdiction Profiles</h3>
              
              {selectedJurisdictionDetails.length === 0 ? (
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    Select jurisdictions from the Comparison tab to view detailed profiles.
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="space-y-6">
                  {selectedJurisdictionDetails.map(score => (
                    <Card key={score.jurisdiction.code} className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <MapPin className="h-5 w-5 text-blue-600" />
                          <div>
                            <h4 className="text-lg font-semibold">{score.jurisdiction.name}</h4>
                            <div className="text-sm text-gray-600">Jurisdiction Code: {score.jurisdiction.code}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">Rank #{score.ranking}</Badge>
                          <Badge variant={getScoreBadgeVariant(score.overallScore)}>
                            {score.overallScore.toFixed(0)} Score
                          </Badge>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Tax Rates */}
                        <div>
                          <h5 className="font-medium mb-3 flex items-center gap-2">
                            <BarChart3 className="h-4 w-4" />
                            Tax Rates
                          </h5>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span>Corporate Tax:</span>
                              <span className="font-medium">{formatPercentage(score.jurisdiction.corporateTaxRate)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Dividend Tax:</span>
                              <span className="font-medium">{formatPercentage(score.jurisdiction.dividendTaxRate)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Interest Tax:</span>
                              <span className="font-medium">{formatPercentage(score.jurisdiction.interestTaxRate)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Royalty Tax:</span>
                              <span className="font-medium">{formatPercentage(score.jurisdiction.royaltyTaxRate)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Capital Gains:</span>
                              <span className="font-medium">{formatPercentage(score.jurisdiction.capitalGainsTaxRate)}</span>
                            </div>
                          </div>
                        </div>

                        {/* Withholding Tax Rates */}
                        <div>
                          <h5 className="font-medium mb-3 flex items-center gap-2">
                            <TrendingUp className="h-4 w-4" />
                            Withholding Tax
                          </h5>
                          <div className="space-y-2 text-sm">
                            {score.jurisdiction.withholdingTaxRates.map((rate, index) => (
                              <div key={index} className="flex justify-between">
                                <span>{rate.incomeType}:</span>
                                <span className="font-medium">
                                  {formatPercentage(rate.rate)}
                                  {rate.treatyReduction !== undefined && rate.treatyReduction < rate.rate && (
                                    <span className="text-green-600 ml-1">
                                      (Treaty: {formatPercentage(rate.treatyReduction)})
                                    </span>
                                  )}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Tax Incentives */}
                        <div>
                          <h5 className="font-medium mb-3 flex items-center gap-2">
                            <Star className="h-4 w-4" />
                            Tax Incentives
                          </h5>
                          <div className="space-y-2">
                            {score.jurisdiction.taxIncentives?.map((incentive, index) => (
                              <Badge key={index} variant="outline" className="mr-2 mb-2">
                                {incentive}
                              </Badge>
                            )) || <span className="text-sm text-gray-500">No specific incentives listed</span>}
                          </div>
                        </div>

                        {/* Regulatory Requirements */}
                        <div>
                          <h5 className="font-medium mb-3 flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            Regulatory Requirements
                          </h5>
                          <div className="space-y-2">
                            {score.jurisdiction.regulatoryRequirements.map((requirement, index) => (
                              <div key={index} className="flex items-center gap-2 text-sm">
                                <CheckCircle className="h-3 w-3 text-green-600" />
                                {requirement}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Treaty Network */}
                      <div className="mt-6 pt-4 border-t border-gray-200">
                        <h5 className="font-medium mb-3 flex items-center gap-2">
                          <Shield className="h-4 w-4" />
                          Treaty Network ({score.jurisdiction.treatyNetwork.length} countries)
                        </h5>
                        <div className="flex flex-wrap gap-2">
                          {score.jurisdiction.treatyNetwork.map(country => (
                            <Badge key={country} variant="secondary">
                              {country}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="treaties" className="space-y-6">
            <div className="space-y-4">
              <h3 className="font-semibold">Tax Treaty Analysis</h3>
              
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Tax treaty data would be displayed here, showing specific bilateral agreements,
                  withholding tax reductions, and treaty shopping opportunities.
                </AlertDescription>
              </Alert>

              {/* Placeholder for treaty visualization */}
              <div className="bg-gray-50 p-8 rounded-lg text-center">
                <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Interactive treaty network visualization coming soon</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="filters" className="space-y-6">
            <div className="space-y-4">
              <h3 className="font-semibold">Filter Criteria</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="maxCorporateRate">Maximum Corporate Tax Rate (%)</Label>
                    <Input
                      id="maxCorporateRate"
                      type="number"
                      min="0"
                      max="50"
                      step="1"
                      value={filterCriteria.maxCorporateRate * 100}
                      onChange={(e) => setFilterCriteria(prev => ({
                        ...prev,
                        maxCorporateRate: Number(e.target.value) / 100
                      }))}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="minTreatyCount">Minimum Treaty Count</Label>
                    <Input
                      id="minTreatyCount"
                      type="number"
                      min="0"
                      max="50"
                      value={filterCriteria.minTreatyCount}
                      onChange={(e) => setFilterCriteria(prev => ({
                        ...prev,
                        minTreatyCount: Number(e.target.value)
                      }))}
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="hasIPIncentives"
                      checked={filterCriteria.hasIPIncentives}
                      onCheckedChange={(checked) => setFilterCriteria(prev => ({
                        ...prev,
                        hasIPIncentives: checked as boolean
                      }))}
                    />
                    <Label htmlFor="hasIPIncentives">Has IP Incentives</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="lowComplexity"
                      checked={filterCriteria.lowComplexity}
                      onCheckedChange={(checked) => setFilterCriteria(prev => ({
                        ...prev,
                        lowComplexity: checked as boolean
                      }))}
                    />
                    <Label htmlFor="lowComplexity">Low Regulatory Complexity</Label>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <div className="text-sm text-gray-600">
                  Showing {filteredJurisdictions.length} of {jurisdictions.length} jurisdictions based on current filters.
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default TaxJurisdictionAnalyzer;