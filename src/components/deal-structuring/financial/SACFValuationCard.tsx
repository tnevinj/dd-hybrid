'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Calculator,
  TrendingUp,
  Building,
  Target,
  AlertTriangle,
  CheckCircle,
  Download,
  Zap,
  BarChart3,
  Star,
  DollarSign,
  Calendar,
  Users
} from 'lucide-react';
import { SACFValuationInputs, SACFValuationResults } from '@/types/deal-structuring';

interface SACFValuationCardProps {
  dealId: string;
  mode?: 'traditional' | 'assisted' | 'autonomous';
  onResultsChange?: (results: SACFValuationResults) => void;
}

interface AssetDetails {
  assetId: string;
  assetName: string;
  description: string;
  industry: string;
  geography: string;
  businessModel: string;
  maturityStage: 'early' | 'growth' | 'mature';
  originalInvestmentDate: Date;
  currentBookValue: number;
  currentFairValue: number;
  sharesOwned: number;
  ownershipPercentage: number;
}

interface SACFStructure {
  newFundSize: number;
  rolloverAmount: number;
  newCapitalAmount: number;
  managementFeeRate: number;
  carriedInterestRate: number;
  hurdleRate: number;
  gpCommitment: number;
  liquidityDiscount: number;
}

const SACFValuationCard: React.FC<SACFValuationCardProps> = ({ 
  dealId, 
  mode = 'traditional',
  onResultsChange 
}) => {
  const [inputs, setInputs] = useState<SACFValuationInputs>({
    dealInfo: {
      dealId,
      dealName: 'Single-Asset Continuation Fund - Alpha Portfolio',
      valuationDate: new Date(),
      targetAsset: {
        assetId: 'asset_001',
        assetName: 'TechCorp Solutions',
        description: 'Leading enterprise software company',
        industry: 'Technology',
        geography: 'North America',
        businessModel: 'SaaS',
        maturityStage: 'growth',
        originalInvestmentDate: new Date('2020-01-01'),
        currentBookValue: 80000000,
        currentFairValue: 150000000,
        sharesOwned: 2500000,
        ownershipPercentage: 0.35
      }
    },
    sacfStructure: {
      newFundSize: 200000000, // $200M new fund
      rolloverAmount: 120000000, // $120M rolled over
      newCapitalAmount: 80000000, // $80M new capital
      managementFeeRate: 0.02, // 2%
      carriedInterestRate: 0.20, // 20%
      hurdleRate: 0.08, // 8%
      gpCommitment: 4000000, // $4M GP commitment
      liquidityDiscount: 0.10 // 10% discount for liquidity
    },
    financialProjections: {
      projectionYears: 5,
      exitMultiple: 3.5,
      revenueGrowthRate: 0.25,
      ebitdaMargin: 0.35,
      currentRevenue: 50000000,
      currentEbitda: 17500000,
      terminalGrowthRate: 0.03,
      discountRate: 0.12
    },
    valuationMethodologies: {
      useDiscountedCashFlow: true,
      useComparableCompanies: true,
      usePrecedentTransactions: true,
      useAssetBasedApproach: false
    },
    marketConditions: {
      marketSentiment: 'positive',
      sectorMultiples: {
        evRevenue: 6.5,
        evEbitda: 18.5,
        peRatio: 25.0
      },
      liquidityPremium: 0.15,
      controlPremium: 0.25
    },
    lpConsiderations: {
      rolloverPercentage: 0.60, // 60% of LPs rolling over
      liquidityPreference: 'high',
      extensionTolerance: 'medium',
      newInvestorDemand: 'strong'
    }
  });

  const [results, setResults] = useState<SACFValuationResults | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [activeTab, setActiveTab] = useState<'asset' | 'structure' | 'valuation' | 'economics'>('asset');

  const calculateSACFValuation = async () => {
    setIsCalculating(true);
    
    // Mock calculation - replace with actual SACF valuation logic
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const asset = inputs.dealInfo.targetAsset;
    const structure = inputs.sacfStructure;
    const projections = inputs.financialProjections;
    
    // DCF Calculation
    const futureEbitda = inputs.financialProjections.currentEbitda * 
      Math.pow(1 + inputs.financialProjections.revenueGrowthRate, projections.projectionYears);
    const exitValue = futureEbitda * inputs.marketConditions.sectorMultiples.evEbitda;
    const presentValue = exitValue / Math.pow(1 + projections.discountRate, projections.projectionYears);
    
    // Comparable Companies Valuation
    const comparableValuation = inputs.financialProjections.currentRevenue * 
      inputs.marketConditions.sectorMultiples.evRevenue;
    
    // Blended Valuation
    const blendedValuation = (presentValue * 0.4) + (comparableValuation * 0.6);
    
    // SACF Pricing
    const sacfPrice = blendedValuation * (1 - structure.liquidityDiscount);
    const pricePerShare = sacfPrice / asset.sharesOwned;
    
    // LP Economics
    const rolloverValue = structure.rolloverAmount;
    const liquidityValue = (asset.currentFairValue * asset.ownershipPercentage) - rolloverValue;
    
    const mockResults: SACFValuationResults = {
      assetValuation: {
        dcfValuation: presentValue,
        comparableCompaniesValuation: comparableValuation,
        precedentTransactionsValuation: comparableValuation * 1.1,
        blendedValuation,
        valuationRange: {
          low: blendedValuation * 0.85,
          mid: blendedValuation,
          high: blendedValuation * 1.15
        }
      },
      sacfPricing: {
        sacfPrice,
        pricePerShare,
        discountToFairValue: ((asset.currentFairValue - sacfPrice) / asset.currentFairValue) * 100,
        premiumToBookValue: ((sacfPrice - asset.currentBookValue) / asset.currentBookValue) * 100,
        impliedMultiple: sacfPrice / inputs.financialProjections.currentEbitda
      },
      lpEconomics: {
        rolloverValue,
        liquidityValue,
        liquidityPercentage: liquidityValue / (rolloverValue + liquidityValue),
        projectedReturns: {
          baseCase: { irr: 0.18, multiple: 2.8 },
          upside: { irr: 0.25, multiple: 3.5 },
          downside: { irr: 0.12, multiple: 2.1 }
        }
      },
      fundEconomics: {
        newFundSize: structure.newFundSize,
        gpCommitment: structure.gpCommitment,
        managementFees: structure.newFundSize * structure.managementFeeRate * 5, // 5 year estimate
        projectedCarriedInterest: (blendedValuation * structure.carriedInterestRate) * 0.6, // Estimate
        totalGpRevenue: (structure.newFundSize * structure.managementFeeRate * 5) + 
                       ((blendedValuation * structure.carriedInterestRate) * 0.6)
      },
      marketComparison: {
        recentSACFDeals: [
          { dealName: 'TechGrowth SACF', assetValue: 180000000, discount: 0.12, sector: 'Technology' },
          { dealName: 'HealthCare Continuation', assetValue: 220000000, discount: 0.08, sector: 'Healthcare' },
          { dealName: 'Services SACF II', assetValue: 160000000, discount: 0.15, sector: 'Services' }
        ],
        averageDiscount: 0.117,
        sectorAverageDiscount: 0.10
      },
      riskAnalysis: {
        keyRisks: [
          'Market volatility affecting exit timing',
          'Competition from new market entrants',
          'Regulatory changes in target sector'
        ],
        riskRating: 'Medium',
        mitigatingFactors: [
          'Strong management team retention',
          'Diversified revenue streams',
          'Market leading position'
        ]
      },
      implementation: {
        expectedTimeline: 6, // months
        regulatoryApprovals: ['SEC registration', 'State notifications'],
        recommendedActions: [
          'Engage third-party valuation firm',
          'Conduct LP preference survey',
          'Prepare detailed asset CIM'
        ]
      }
    };

    setResults(mockResults);
    setIsCalculating(false);
    onResultsChange?.(mockResults);
  };

  const formatCurrency = (amount: number) => {
    return `$${(amount / 1000000).toFixed(1)}M`;
  };

  const formatPercentage = (value: number) => {
    return `${(value * 100).toFixed(1)}%`;
  };

  const getRiskColor = (rating: string) => {
    switch (rating.toLowerCase()) {
      case 'low': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'high': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const updateAssetDetails = (field: string, value: any) => {
    setInputs(prev => ({
      ...prev,
      dealInfo: {
        ...prev.dealInfo,
        targetAsset: {
          ...prev.dealInfo.targetAsset,
          [field]: value
        }
      }
    }));
  };

  const updateSACFStructure = (field: string, value: any) => {
    setInputs(prev => ({
      ...prev,
      sacfStructure: {
        ...prev.sacfStructure,
        [field]: value
      }
    }));
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Building className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">SACF Valuation Analysis</h3>
              <p className="text-sm text-gray-500">Single-Asset Continuation Fund structuring & pricing</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={mode === 'autonomous' ? 'default' : 'secondary'}>
              {mode === 'autonomous' && <Zap className="h-3 w-3 mr-1" />}
              {mode.charAt(0).toUpperCase() + mode.slice(1)} Mode
            </Badge>
            <Button onClick={calculateSACFValuation} disabled={isCalculating} size="sm">
              {isCalculating ? 'Valuing...' : 'Calculate'}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          {[
            { key: 'asset', label: 'Asset Details', icon: Building },
            { key: 'structure', label: 'SACF Structure', icon: Target },
            { key: 'valuation', label: 'Valuation Methods', icon: Calculator },
            { key: 'economics', label: 'Economics', icon: DollarSign }
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

        {/* Asset Details Tab */}
        {activeTab === 'asset' && (
          <div className="space-y-6">
            {/* Basic Asset Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Asset Name</label>
                <Input 
                  value={inputs.dealInfo.targetAsset.assetName}
                  onChange={(e) => updateAssetDetails('assetName', e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
                <select 
                  value={inputs.dealInfo.targetAsset.industry}
                  onChange={(e) => updateAssetDetails('industry', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value="Technology">Technology</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Financial Services">Financial Services</option>
                  <option value="Consumer">Consumer</option>
                  <option value="Industrial">Industrial</option>
                  <option value="Energy">Energy</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Business Model</label>
                <select 
                  value={inputs.dealInfo.targetAsset.businessModel}
                  onChange={(e) => updateAssetDetails('businessModel', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value="SaaS">SaaS</option>
                  <option value="Marketplace">Marketplace</option>
                  <option value="E-commerce">E-commerce</option>
                  <option value="Manufacturing">Manufacturing</option>
                  <option value="Services">Services</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Maturity Stage</label>
                <select 
                  value={inputs.dealInfo.targetAsset.maturityStage}
                  onChange={(e) => updateAssetDetails('maturityStage', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value="early">Early Stage</option>
                  <option value="growth">Growth Stage</option>
                  <option value="mature">Mature</option>
                </select>
              </div>
            </div>

            {/* Financial Metrics */}
            <div className="border rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-4">Current Asset Metrics</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Book Value ($M)</label>
                  <Input 
                    type="number"
                    value={inputs.dealInfo.targetAsset.currentBookValue / 1000000}
                    onChange={(e) => updateAssetDetails('currentBookValue', parseFloat(e.target.value) * 1000000)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fair Value ($M)</label>
                  <Input 
                    type="number"
                    value={inputs.dealInfo.targetAsset.currentFairValue / 1000000}
                    onChange={(e) => updateAssetDetails('currentFairValue', parseFloat(e.target.value) * 1000000)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ownership %</label>
                  <Input 
                    type="number"
                    step="0.1"
                    value={inputs.dealInfo.targetAsset.ownershipPercentage * 100}
                    onChange={(e) => updateAssetDetails('ownershipPercentage', parseFloat(e.target.value) / 100)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Current Revenue ($M)</label>
                  <Input 
                    type="number"
                    value={inputs.financialProjections.currentRevenue / 1000000}
                    onChange={(e) => setInputs(prev => ({
                      ...prev,
                      financialProjections: {
                        ...prev.financialProjections,
                        currentRevenue: parseFloat(e.target.value) * 1000000
                      }
                    }))}
                  />
                </div>
              </div>
            </div>

            {/* Market Context */}
            <div className="border rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-4">Market Conditions</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">EV/Revenue Multiple</label>
                  <Input 
                    type="number"
                    step="0.1"
                    value={inputs.marketConditions.sectorMultiples.evRevenue}
                    onChange={(e) => setInputs(prev => ({
                      ...prev,
                      marketConditions: {
                        ...prev.marketConditions,
                        sectorMultiples: {
                          ...prev.marketConditions.sectorMultiples,
                          evRevenue: parseFloat(e.target.value)
                        }
                      }
                    }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">EV/EBITDA Multiple</label>
                  <Input 
                    type="number"
                    step="0.1"
                    value={inputs.marketConditions.sectorMultiples.evEbitda}
                    onChange={(e) => setInputs(prev => ({
                      ...prev,
                      marketConditions: {
                        ...prev.marketConditions,
                        sectorMultiples: {
                          ...prev.marketConditions.sectorMultiples,
                          evEbitda: parseFloat(e.target.value)
                        }
                      }
                    }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Control Premium (%)</label>
                  <Input 
                    type="number"
                    step="1"
                    value={inputs.marketConditions.controlPremium * 100}
                    onChange={(e) => setInputs(prev => ({
                      ...prev,
                      marketConditions: {
                        ...prev.marketConditions,
                        controlPremium: parseFloat(e.target.value) / 100
                      }
                    }))}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SACF Structure Tab */}
        {activeTab === 'structure' && (
          <div className="space-y-6">
            {/* Fund Structure */}
            <div className="border rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-4">Fund Structure</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">New Fund Size ($M)</label>
                  <Input 
                    type="number"
                    value={inputs.sacfStructure.newFundSize / 1000000}
                    onChange={(e) => updateSACFStructure('newFundSize', parseFloat(e.target.value) * 1000000)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rollover Amount ($M)</label>
                  <Input 
                    type="number"
                    value={inputs.sacfStructure.rolloverAmount / 1000000}
                    onChange={(e) => updateSACFStructure('rolloverAmount', parseFloat(e.target.value) * 1000000)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">New Capital ($M)</label>
                  <Input 
                    type="number"
                    value={inputs.sacfStructure.newCapitalAmount / 1000000}
                    onChange={(e) => updateSACFStructure('newCapitalAmount', parseFloat(e.target.value) * 1000000)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">GP Commitment ($M)</label>
                  <Input 
                    type="number"
                    value={inputs.sacfStructure.gpCommitment / 1000000}
                    onChange={(e) => updateSACFStructure('gpCommitment', parseFloat(e.target.value) * 1000000)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Liquidity Discount (%)</label>
                  <Input 
                    type="number"
                    step="0.1"
                    value={inputs.sacfStructure.liquidityDiscount * 100}
                    onChange={(e) => updateSACFStructure('liquidityDiscount', parseFloat(e.target.value) / 100)}
                  />
                </div>
              </div>
            </div>

            {/* Fee Structure */}
            <div className="border rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-4">Fee Structure</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Management Fee (%)</label>
                  <Input 
                    type="number"
                    step="0.1"
                    value={inputs.sacfStructure.managementFeeRate * 100}
                    onChange={(e) => updateSACFStructure('managementFeeRate', parseFloat(e.target.value) / 100)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Carried Interest (%)</label>
                  <Input 
                    type="number"
                    step="0.1"
                    value={inputs.sacfStructure.carriedInterestRate * 100}
                    onChange={(e) => updateSACFStructure('carriedInterestRate', parseFloat(e.target.value) / 100)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hurdle Rate (%)</label>
                  <Input 
                    type="number"
                    step="0.1"
                    value={inputs.sacfStructure.hurdleRate * 100}
                    onChange={(e) => updateSACFStructure('hurdleRate', parseFloat(e.target.value) / 100)}
                  />
                </div>
              </div>
            </div>

            {/* LP Considerations */}
            <div className="border rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-4">LP Considerations</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Expected Rollover %</label>
                  <Input 
                    type="number"
                    step="1"
                    value={inputs.lpConsiderations.rolloverPercentage * 100}
                    onChange={(e) => setInputs(prev => ({
                      ...prev,
                      lpConsiderations: {
                        ...prev.lpConsiderations,
                        rolloverPercentage: parseFloat(e.target.value) / 100
                      }
                    }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Liquidity Preference</label>
                  <select 
                    value={inputs.lpConsiderations.liquidityPreference}
                    onChange={(e) => setInputs(prev => ({
                      ...prev,
                      lpConsiderations: {
                        ...prev.lpConsiderations,
                        liquidityPreference: e.target.value as any
                      }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">New Investor Demand</label>
                  <select 
                    value={inputs.lpConsiderations.newInvestorDemand}
                    onChange={(e) => setInputs(prev => ({
                      ...prev,
                      lpConsiderations: {
                        ...prev.lpConsiderations,
                        newInvestorDemand: e.target.value as any
                      }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  >
                    <option value="weak">Weak</option>
                    <option value="moderate">Moderate</option>
                    <option value="strong">Strong</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Valuation Methods Tab */}
        {activeTab === 'valuation' && results && (
          <div className="space-y-6">
            {/* Valuation Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border rounded-lg p-4 text-center">
                <h5 className="font-medium text-gray-900 mb-2">DCF Valuation</h5>
                <div className="text-2xl font-bold text-blue-600">{formatCurrency(results.assetValuation.dcfValuation)}</div>
                <div className="text-sm text-gray-500">Present Value</div>
              </div>
              <div className="border rounded-lg p-4 text-center">
                <h5 className="font-medium text-gray-900 mb-2">Comparable Companies</h5>
                <div className="text-2xl font-bold text-green-600">{formatCurrency(results.assetValuation.comparableCompaniesValuation)}</div>
                <div className="text-sm text-gray-500">Market Multiple</div>
              </div>
              <div className="border rounded-lg p-4 text-center">
                <h5 className="font-medium text-gray-900 mb-2">Blended Valuation</h5>
                <div className="text-2xl font-bold text-blue-600">{formatCurrency(results.assetValuation.blendedValuation)}</div>
                <div className="text-sm text-gray-500">Weighted Average</div>
              </div>
            </div>

            {/* Valuation Range */}
            <div className="border rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-4">Valuation Range Analysis</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-3 bg-red-50 rounded-lg">
                  <div className="text-lg font-bold text-red-600">{formatCurrency(results.assetValuation.valuationRange.low)}</div>
                  <div className="text-sm text-gray-600">Low Case</div>
                </div>
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-lg font-bold text-blue-600">{formatCurrency(results.assetValuation.valuationRange.mid)}</div>
                  <div className="text-sm text-gray-600">Base Case</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-lg font-bold text-green-600">{formatCurrency(results.assetValuation.valuationRange.high)}</div>
                  <div className="text-sm text-gray-600">High Case</div>
                </div>
              </div>
            </div>

            {/* SACF Pricing */}
            <div className="border rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-4">SACF Pricing Analysis</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-lg font-bold text-blue-600">{formatCurrency(results.sacfPricing.sacfPrice)}</div>
                  <div className="text-sm text-gray-600">SACF Price</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-orange-600">{results.sacfPricing.discountToFairValue.toFixed(1)}%</div>
                  <div className="text-sm text-gray-600">Discount to Fair Value</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-green-600">{results.sacfPricing.premiumToBookValue.toFixed(1)}%</div>
                  <div className="text-sm text-gray-600">Premium to Book</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-blue-600">{results.sacfPricing.impliedMultiple.toFixed(1)}x</div>
                  <div className="text-sm text-gray-600">EV/EBITDA</div>
                </div>
              </div>
            </div>

            {/* Market Comparison */}
            <div className="border rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-4">Recent SACF Comparisons</h4>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Deal Name</th>
                      <th className="text-right py-2">Asset Value</th>
                      <th className="text-right py-2">Discount</th>
                      <th className="text-right py-2">Sector</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.marketComparison.recentSACFDeals.map((deal, index) => (
                      <tr key={index} className="border-b">
                        <td className="py-2">{deal.dealName}</td>
                        <td className="text-right py-2">{formatCurrency(deal.assetValue)}</td>
                        <td className="text-right py-2">{formatPercentage(deal.discount)}</td>
                        <td className="text-right py-2">{deal.sector}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-3 text-sm text-gray-600">
                Average discount: {formatPercentage(results.marketComparison.averageDiscount)} | 
                Sector average: {formatPercentage(results.marketComparison.sectorAverageDiscount)}
              </div>
            </div>
          </div>
        )}

        {/* Economics Tab */}
        {activeTab === 'economics' && results && (
          <div className="space-y-6">
            {/* LP Economics */}
            <div className="border rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-4">LP Economics</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-medium text-gray-700 mb-3">Liquidity Options</h5>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Rollover Value</span>
                      <span className="font-medium">{formatCurrency(results.lpEconomics.rolloverValue)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Liquidity Value</span>
                      <span className="font-medium">{formatCurrency(results.lpEconomics.liquidityValue)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Liquidity Percentage</span>
                      <span className="font-medium">{formatPercentage(results.lpEconomics.liquidityPercentage)}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h5 className="font-medium text-gray-700 mb-3">Projected Returns</h5>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Base Case IRR</span>
                      <span className="font-medium">{formatPercentage(results.lpEconomics.projectedReturns.baseCase.irr)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Base Case Multiple</span>
                      <span className="font-medium">{results.lpEconomics.projectedReturns.baseCase.multiple.toFixed(1)}x</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Upside IRR</span>
                      <span className="font-medium text-green-600">{formatPercentage(results.lpEconomics.projectedReturns.upside.irr)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Fund Economics */}
            <div className="border rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-4">Fund Economics</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-lg font-bold text-blue-600">{formatCurrency(results.fundEconomics.newFundSize)}</div>
                  <div className="text-sm text-gray-600">Fund Size</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-green-600">{formatCurrency(results.fundEconomics.managementFees)}</div>
                  <div className="text-sm text-gray-600">Management Fees</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-blue-600">{formatCurrency(results.fundEconomics.projectedCarriedInterest)}</div>
                  <div className="text-sm text-gray-600">Carried Interest</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-orange-600">{formatCurrency(results.fundEconomics.totalGpRevenue)}</div>
                  <div className="text-sm text-gray-600">Total GP Revenue</div>
                </div>
              </div>
            </div>

            {/* Risk Analysis */}
            <div className="border rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-4">Risk Analysis</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <h5 className="font-medium text-gray-700">Risk Rating</h5>
                    <Badge variant={results.riskAnalysis.riskRating === 'Low' ? 'default' : 'secondary'}>
                      {results.riskAnalysis.riskRating}
                    </Badge>
                  </div>
                  <div>
                    <h6 className="text-sm font-medium text-gray-700 mb-2">Key Risks</h6>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {results.riskAnalysis.keyRisks.map((risk, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <AlertTriangle className="h-3 w-3 text-orange-500 mt-0.5 flex-shrink-0" />
                          {risk}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                <div>
                  <h6 className="text-sm font-medium text-gray-700 mb-2">Mitigating Factors</h6>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {results.riskAnalysis.mitigatingFactors.map((factor, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                        {factor}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Implementation Timeline */}
            <div className="border rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-4">Implementation Plan</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Calendar className="h-4 w-4 text-blue-600" />
                    <h5 className="font-medium text-gray-700">Expected Timeline</h5>
                    <Badge variant="outline">{results.implementation.expectedTimeline} months</Badge>
                  </div>
                  <div>
                    <h6 className="text-sm font-medium text-gray-700 mb-2">Required Approvals</h6>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {results.implementation.regulatoryApprovals.map((approval, index) => (
                        <li key={index}>• {approval}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                <div>
                  <h6 className="text-sm font-medium text-gray-700 mb-2">Recommended Actions</h6>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {results.implementation.recommendedActions.map((action, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Target className="h-3 w-3 text-blue-500 mt-0.5 flex-shrink-0" />
                        {action}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Results Summary */}
        {results && (
          <div className="border-t pt-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{formatCurrency(results.sacfPricing.sacfPrice)}</div>
                <div className="text-sm text-gray-600">SACF Valuation</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">{results.sacfPricing.discountToFairValue.toFixed(1)}%</div>
                <div className="text-sm text-gray-600">Liquidity Discount</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{formatPercentage(results.lpEconomics.projectedReturns.baseCase.irr)}</div>
                <div className="text-sm text-gray-600">Projected IRR</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{formatCurrency(results.fundEconomics.totalGpRevenue)}</div>
                <div className="text-sm text-gray-600">GP Revenue</div>
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
                <h4 className="font-medium text-blue-900">AI SACF Insights</h4>
                <ul className="text-sm text-blue-800 mt-2 space-y-1">
                  <li>• Asset valuation shows strong fundamentals with 15-20% upside potential</li>
                  <li>• Liquidity discount of 10% is within market range for growth-stage assets</li>
                  <li>• 60% LP rollover rate indicates strong confidence in continued value creation</li>
                  <li>• Consider extending investment period to capture full growth cycle</li>
                  {mode === 'autonomous' && (
                    <li>• <strong>Auto-recommendation:</strong> Structure as 5-year fund with 2-year extension option</li>
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

export default SACFValuationCard;