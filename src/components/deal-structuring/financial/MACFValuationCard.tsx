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
  Users,
  FolderOpen,
  PieChart,
  Plus,
  Trash2
} from 'lucide-react';
import { MACFValuationInputs, MACFValuationResults } from '@/types/deal-structuring';

interface MACFValuationCardProps {
  dealId: string;
  mode?: 'traditional' | 'assisted' | 'autonomous';
  onResultsChange?: (results: MACFValuationResults) => void;
}

interface PortfolioAsset {
  assetId: string;
  assetName: string;
  description: string;
  industry: string;
  geography: string;
  investmentDate: Date;
  currentBookValue: number;
  currentFairValue: number;
  ownershipPercentage: number;
  maturityStage: 'early' | 'growth' | 'mature';
  performanceRating: 1 | 2 | 3 | 4 | 5;
  exitTimeline: 'near_term' | 'medium_term' | 'long_term';
  strategicRationale: string;
}

interface MACFStructure {
  totalFundSize: number;
  newCapitalAmount: number;
  rolloverAmount: number;
  managementFeeRate: number;
  carriedInterestRate: number;
  hurdleRate: number;
  fundTerm: number;
  gpCommitment: number;
  portfolioDiscount: number;
}

const MACFValuationCard: React.FC<MACFValuationCardProps> = ({ 
  dealId, 
  mode = 'traditional',
  onResultsChange 
}) => {
  const [inputs, setInputs] = useState<MACFValuationInputs>({
    dealInfo: {
      dealId,
      dealName: 'Multi-Asset Continuation Fund - Growth Portfolio',
      valuationDate: new Date(),
      portfolioAssets: [
        {
          assetId: 'asset_001',
          assetName: 'TechFlow SaaS',
          description: 'Enterprise workflow automation platform',
          industry: 'Technology',
          geography: 'North America',
          investmentDate: new Date('2020-03-01'),
          currentBookValue: 45000000,
          currentFairValue: 85000000,
          ownershipPercentage: 0.40,
          maturityStage: 'growth',
          performanceRating: 4,
          exitTimeline: 'medium_term',
          strategicRationale: 'Market leader with strong growth trajectory'
        },
        {
          assetId: 'asset_002',
          assetName: 'MedDevice Innovations',
          description: 'Surgical robotics and AI diagnostics',
          industry: 'Healthcare',
          geography: 'Europe',
          investmentDate: new Date('2019-08-01'),
          currentBookValue: 30000000,
          currentFairValue: 60000000,
          ownershipPercentage: 0.25,
          maturityStage: 'mature',
          performanceRating: 5,
          exitTimeline: 'near_term',
          strategicRationale: 'Ready for strategic exit to large medtech'
        },
        {
          assetId: 'asset_003',
          assetName: 'GreenEnergy Solutions',
          description: 'Renewable energy storage systems',
          industry: 'Energy',
          geography: 'Asia Pacific',
          investmentDate: new Date('2021-01-01'),
          currentBookValue: 25000000,
          currentFairValue: 40000000,
          ownershipPercentage: 0.30,
          maturityStage: 'growth',
          performanceRating: 3,
          exitTimeline: 'long_term',
          strategicRationale: 'Benefiting from energy transition trends'
        }
      ]
    },
    macfStructure: {
      totalFundSize: 300000000, // $300M total fund
      newCapitalAmount: 120000000, // $120M new capital
      rolloverAmount: 180000000, // $180M rolled over
      managementFeeRate: 0.02, // 2%
      carriedInterestRate: 0.20, // 20%
      hurdleRate: 0.08, // 8%
      fundTerm: 7, // 7 years
      gpCommitment: 6000000, // $6M GP commitment
      portfolioDiscount: 0.12 // 12% portfolio discount
    },
    aggregateFinancials: {
      totalPortfolioValue: 185000000,
      totalBookValue: 100000000,
      weightedAverageMultiple: 1.85,
      totalRevenue: 150000000,
      totalEbitda: 45000000,
      diversificationScore: 0.75
    },
    marketConditions: {
      marketSentiment: 'positive',
      sectorTrends: {
        technology: 'strong',
        healthcare: 'stable',
        energy: 'emerging'
      },
      liquidityEnvironment: 'favorable',
      multipleExpansion: 0.10
    },
    lpConsiderations: {
      rolloverPercentage: 0.65, // 65% rollover rate
      liquidityPreference: 'medium',
      diversificationBenefit: 'high',
      feeToleranceLevel: 'standard'
    }
  });

  const [results, setResults] = useState<MACFValuationResults | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [activeTab, setActiveTab] = useState<'portfolio' | 'structure' | 'valuation' | 'economics'>('portfolio');

  const calculateMACFValuation = async () => {
    setIsCalculating(true);
    
    // Mock calculation - replace with actual MACF valuation logic
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const portfolio = inputs.dealInfo.portfolioAssets;
    const structure = inputs.macfStructure;
    const aggregates = inputs.aggregateFinancials;
    
    // Portfolio Valuation
    const sumOfPartsValuation = portfolio.reduce((sum, asset) => sum + asset.currentFairValue, 0);
    const portfolioDiscount = sumOfPartsValuation * structure.portfolioDiscount;
    const adjustedPortfolioValue = sumOfPartsValuation - portfolioDiscount;
    
    // Asset-level analysis
    const assetAnalysis = portfolio.map(asset => {
      const impliedMultiple = asset.currentFairValue / asset.currentBookValue;
      const performanceWeight = asset.performanceRating / 5;
      const riskAdjustment = asset.maturityStage === 'early' ? 0.15 : 
                           asset.maturityStage === 'growth' ? 0.10 : 0.05;
      
      return {
        assetId: asset.assetId,
        assetName: asset.assetName,
        currentValue: asset.currentFairValue,
        adjustedValue: asset.currentFairValue * (1 - riskAdjustment),
        impliedMultiple,
        contributionToPortfolio: asset.currentFairValue / sumOfPartsValuation,
        riskRating: asset.performanceRating >= 4 ? 'Low' : 
                   asset.performanceRating >= 3 ? 'Medium' : 'High',
        projectedExit: asset.exitTimeline
      };
    });

    // LP Economics
    const totalLPValue = adjustedPortfolioValue;
    const liquidityAmount = totalLPValue * (1 - inputs.lpConsiderations.rolloverPercentage);
    const continuationAmount = totalLPValue * inputs.lpConsiderations.rolloverPercentage;
    
    // Fund Economics
    const managementFeesTotal = structure.totalFundSize * structure.managementFeeRate * structure.fundTerm;
    const projectedGains = adjustedPortfolioValue * 1.8 - aggregates.totalBookValue; // Mock 80% gain
    const carriedInterest = Math.max(0, projectedGains * structure.carriedInterestRate);
    
    const mockResults: MACFValuationResults = {
      portfolioValuation: {
        sumOfPartsValuation,
        portfolioDiscount,
        adjustedPortfolioValue,
        weightedAverageMultiple: aggregates.weightedAverageMultiple,
        diversificationBenefit: 0.08, // 8% diversification benefit
        assetAnalysis
      },
      macfPricing: {
        totalFundValue: adjustedPortfolioValue,
        pricePerUnit: adjustedPortfolioValue / 1000, // Assuming 1000 units
        discountToNAV: (sumOfPartsValuation - adjustedPortfolioValue) / sumOfPartsValuation,
        premiumToBook: (adjustedPortfolioValue - aggregates.totalBookValue) / aggregates.totalBookValue,
        impliedPortfolioMultiple: adjustedPortfolioValue / aggregates.totalEbitda
      },
      lpEconomics: {
        totalLPValue,
        liquidityAmount,
        continuationAmount,
        liquidityPercentage: liquidityAmount / totalLPValue,
        projectedReturns: {
          baseCase: { irr: 0.16, multiple: 2.4 },
          upside: { irr: 0.22, multiple: 3.1 },
          downside: { irr: 0.11, multiple: 1.8 }
        },
        diversificationImpact: {
          riskReduction: 0.25,
          returnStability: 0.30,
          sectorExposure: {
            technology: 0.45,
            healthcare: 0.35,
            energy: 0.20
          }
        }
      },
      fundEconomics: {
        totalFundSize: structure.totalFundSize,
        gpCommitment: structure.gpCommitment,
        managementFees: managementFeesTotal,
        projectedCarriedInterest: carriedInterest,
        totalGpRevenue: managementFeesTotal + carriedInterest,
        feeLoadToLPs: (managementFeesTotal + carriedInterest) / adjustedPortfolioValue
      },
      riskAnalysis: {
        concentrationRisk: 'Medium', // Based on diversification
        sectorRisk: 'Low', // Diversified across sectors
        timingRisk: 'Medium', // Mixed exit timelines
        marketRisk: 'Low', // Current favorable conditions
        operationalRisk: 'Medium', // Varied performance ratings
        keyRisks: [
          'Market downturn affecting exit valuations',
          'Concentration in growth-stage assets',
          'Execution risk on underperforming assets'
        ],
        mitigationStrategies: [
          'Diversified sector allocation reduces concentration',
          'Strong management teams across portfolio',
          'Flexible exit timeline allows market timing'
        ]
      },
      marketComparison: {
        recentMACFDeals: [
          { dealName: 'Diversified Growth MACF', portfolioValue: 250000000, discount: 0.10, assetCount: 4 },
          { dealName: 'Tech Multi-Asset Fund', portfolioValue: 400000000, discount: 0.08, assetCount: 6 },
          { dealName: 'Healthcare Continuation', portfolioValue: 180000000, discount: 0.15, assetCount: 3 }
        ],
        averageDiscount: 0.11,
        benchmarkMultiples: {
          technology: 18.5,
          healthcare: 22.0,
          energy: 12.0
        }
      },
      implementation: {
        complexityRating: 'High', // Multiple assets
        expectedTimeline: 9, // months
        regulatoryRequirements: [
          'SEC registration statement',
          'Individual asset appraisals',
          'LP voting processes',
          'Cross-border regulatory approvals'
        ],
        criticalSuccessFactors: [
          'LP support across all assets',
          'Management team retention',
          'Market timing for exits',
          'Regulatory approval coordination'
        ],
        recommendedActions: [
          'Conduct comprehensive portfolio review',
          'Engage independent valuation firms',
          'Survey LP preferences by asset',
          'Develop phased rollout strategy'
        ]
      }
    };

    setResults(mockResults);
    setIsCalculating(false);
    onResultsChange?.(mockResults);
  };

  const addAsset = () => {
    const newAsset: PortfolioAsset = {
      assetId: `asset_${Date.now()}`,
      assetName: 'New Portfolio Asset',
      description: 'Asset description',
      industry: 'Technology',
      geography: 'North America',
      investmentDate: new Date(),
      currentBookValue: 10000000,
      currentFairValue: 20000000,
      ownershipPercentage: 0.30,
      maturityStage: 'growth',
      performanceRating: 3,
      exitTimeline: 'medium_term',
      strategicRationale: 'Strategic rationale'
    };

    setInputs(prev => ({
      ...prev,
      dealInfo: {
        ...prev.dealInfo,
        portfolioAssets: [...prev.dealInfo.portfolioAssets, newAsset]
      }
    }));
  };

  const removeAsset = (assetId: string) => {
    setInputs(prev => ({
      ...prev,
      dealInfo: {
        ...prev.dealInfo,
        portfolioAssets: prev.dealInfo.portfolioAssets.filter(asset => asset.assetId !== assetId)
      }
    }));
  };

  const updateAsset = (assetId: string, field: string, value: any) => {
    setInputs(prev => ({
      ...prev,
      dealInfo: {
        ...prev.dealInfo,
        portfolioAssets: prev.dealInfo.portfolioAssets.map(asset =>
          asset.assetId === assetId ? { ...asset, [field]: value } : asset
        )
      }
    }));
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

  const getPerformanceStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-3 w-3 ${i < rating ? 'text-yellow-500 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-50 rounded-lg">
              <FolderOpen className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">MACF Valuation Analysis</h3>
              <p className="text-sm text-gray-500">Multi-Asset Continuation Fund structuring & optimization</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={mode === 'autonomous' ? 'default' : 'secondary'}>
              {mode === 'autonomous' && <Zap className="h-3 w-3 mr-1" />}
              {mode.charAt(0).toUpperCase() + mode.slice(1)} Mode
            </Badge>
            <Button onClick={calculateMACFValuation} disabled={isCalculating} size="sm">
              {isCalculating ? 'Analyzing...' : 'Calculate'}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          {[
            { key: 'portfolio', label: 'Portfolio Assets', icon: FolderOpen },
            { key: 'structure', label: 'MACF Structure', icon: Target },
            { key: 'valuation', label: 'Valuation Analysis', icon: Calculator },
            { key: 'economics', label: 'Economics', icon: DollarSign }
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key as any)}
              className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === key
                  ? 'bg-white text-orange-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </div>

        {/* Portfolio Assets Tab */}
        {activeTab === 'portfolio' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-medium text-gray-900">Portfolio Assets</h4>
              <Button onClick={addAsset} size="sm" variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Add Asset
              </Button>
            </div>

            <div className="space-y-4">
              {inputs.dealInfo.portfolioAssets.map((asset, index) => (
                <div key={asset.assetId} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <h5 className="font-medium text-gray-900">{asset.assetName}</h5>
                      <div className="flex">{getPerformanceStars(asset.performanceRating)}</div>
                      <Badge variant="outline">{asset.industry}</Badge>
                    </div>
                    {inputs.dealInfo.portfolioAssets.length > 1 && (
                      <Button 
                        onClick={() => removeAsset(asset.assetId)}
                        size="sm"
                        variant="ghost"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Asset Name</label>
                      <Input 
                        value={asset.assetName}
                        onChange={(e) => updateAsset(asset.assetId, 'assetName', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
                      <select 
                        value={asset.industry}
                        onChange={(e) => updateAsset(asset.assetId, 'industry', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                      >
                        <option value="Technology">Technology</option>
                        <option value="Healthcare">Healthcare</option>
                        <option value="Energy">Energy</option>
                        <option value="Financial Services">Financial Services</option>
                        <option value="Consumer">Consumer</option>
                        <option value="Industrial">Industrial</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Maturity Stage</label>
                      <select 
                        value={asset.maturityStage}
                        onChange={(e) => updateAsset(asset.assetId, 'maturityStage', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                      >
                        <option value="early">Early Stage</option>
                        <option value="growth">Growth Stage</option>
                        <option value="mature">Mature</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Exit Timeline</label>
                      <select 
                        value={asset.exitTimeline}
                        onChange={(e) => updateAsset(asset.assetId, 'exitTimeline', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                      >
                        <option value="near_term">Near Term (0-2 years)</option>
                        <option value="medium_term">Medium Term (2-4 years)</option>
                        <option value="long_term">Long Term (4+ years)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Book Value ($M)</label>
                      <Input 
                        type="number"
                        value={asset.currentBookValue / 1000000}
                        onChange={(e) => updateAsset(asset.assetId, 'currentBookValue', parseFloat(e.target.value) * 1000000)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Fair Value ($M)</label>
                      <Input 
                        type="number"
                        value={asset.currentFairValue / 1000000}
                        onChange={(e) => updateAsset(asset.assetId, 'currentFairValue', parseFloat(e.target.value) * 1000000)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Ownership %</label>
                      <Input 
                        type="number"
                        step="0.1"
                        value={asset.ownershipPercentage * 100}
                        onChange={(e) => updateAsset(asset.assetId, 'ownershipPercentage', parseFloat(e.target.value) / 100)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Performance (1-5)</label>
                      <Input 
                        type="number"
                        min="1"
                        max="5"
                        value={asset.performanceRating}
                        onChange={(e) => updateAsset(asset.assetId, 'performanceRating', parseInt(e.target.value))}
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Strategic Rationale</label>
                    <Input
                      value={asset.strategicRationale}
                      onChange={(e) => updateAsset(asset.assetId, 'strategicRationale', e.target.value)}
                      placeholder="Strategic rationale for inclusion"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Portfolio Summary */}
            <div className="border rounded-lg p-4 bg-gray-50">
              <h4 className="font-medium text-gray-900 mb-4">Portfolio Summary</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-lg font-bold text-gray-900">
                    {inputs.dealInfo.portfolioAssets.length}
                  </div>
                  <div className="text-sm text-gray-600">Total Assets</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-blue-600">
                    {formatCurrency(inputs.dealInfo.portfolioAssets.reduce((sum, asset) => sum + asset.currentBookValue, 0))}
                  </div>
                  <div className="text-sm text-gray-600">Total Book Value</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-green-600">
                    {formatCurrency(inputs.dealInfo.portfolioAssets.reduce((sum, asset) => sum + asset.currentFairValue, 0))}
                  </div>
                  <div className="text-sm text-gray-600">Total Fair Value</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-blue-600">
                    {(inputs.dealInfo.portfolioAssets.reduce((sum, asset) => sum + asset.currentFairValue, 0) / 
                     inputs.dealInfo.portfolioAssets.reduce((sum, asset) => sum + asset.currentBookValue, 0)).toFixed(1)}x
                  </div>
                  <div className="text-sm text-gray-600">Portfolio Multiple</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MACF Structure Tab */}
        {activeTab === 'structure' && (
          <div className="space-y-6">
            {/* Fund Structure */}
            <div className="border rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-4">Fund Structure</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Total Fund Size ($M)</label>
                  <Input 
                    type="number"
                    value={inputs.macfStructure.totalFundSize / 1000000}
                    onChange={(e) => setInputs(prev => ({
                      ...prev,
                      macfStructure: {
                        ...prev.macfStructure,
                        totalFundSize: parseFloat(e.target.value) * 1000000
                      }
                    }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rollover Amount ($M)</label>
                  <Input 
                    type="number"
                    value={inputs.macfStructure.rolloverAmount / 1000000}
                    onChange={(e) => setInputs(prev => ({
                      ...prev,
                      macfStructure: {
                        ...prev.macfStructure,
                        rolloverAmount: parseFloat(e.target.value) * 1000000
                      }
                    }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">New Capital ($M)</label>
                  <Input 
                    type="number"
                    value={inputs.macfStructure.newCapitalAmount / 1000000}
                    onChange={(e) => setInputs(prev => ({
                      ...prev,
                      macfStructure: {
                        ...prev.macfStructure,
                        newCapitalAmount: parseFloat(e.target.value) * 1000000
                      }
                    }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fund Term (Years)</label>
                  <Input 
                    type="number"
                    value={inputs.macfStructure.fundTerm}
                    onChange={(e) => setInputs(prev => ({
                      ...prev,
                      macfStructure: {
                        ...prev.macfStructure,
                        fundTerm: parseInt(e.target.value)
                      }
                    }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">GP Commitment ($M)</label>
                  <Input 
                    type="number"
                    value={inputs.macfStructure.gpCommitment / 1000000}
                    onChange={(e) => setInputs(prev => ({
                      ...prev,
                      macfStructure: {
                        ...prev.macfStructure,
                        gpCommitment: parseFloat(e.target.value) * 1000000
                      }
                    }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Portfolio Discount (%)</label>
                  <Input 
                    type="number"
                    step="0.1"
                    value={inputs.macfStructure.portfolioDiscount * 100}
                    onChange={(e) => setInputs(prev => ({
                      ...prev,
                      macfStructure: {
                        ...prev.macfStructure,
                        portfolioDiscount: parseFloat(e.target.value) / 100
                      }
                    }))}
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
                    value={inputs.macfStructure.managementFeeRate * 100}
                    onChange={(e) => setInputs(prev => ({
                      ...prev,
                      macfStructure: {
                        ...prev.macfStructure,
                        managementFeeRate: parseFloat(e.target.value) / 100
                      }
                    }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Carried Interest (%)</label>
                  <Input 
                    type="number"
                    step="0.1"
                    value={inputs.macfStructure.carriedInterestRate * 100}
                    onChange={(e) => setInputs(prev => ({
                      ...prev,
                      macfStructure: {
                        ...prev.macfStructure,
                        carriedInterestRate: parseFloat(e.target.value) / 100
                      }
                    }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hurdle Rate (%)</label>
                  <Input 
                    type="number"
                    step="0.1"
                    value={inputs.macfStructure.hurdleRate * 100}
                    onChange={(e) => setInputs(prev => ({
                      ...prev,
                      macfStructure: {
                        ...prev.macfStructure,
                        hurdleRate: parseFloat(e.target.value) / 100
                      }
                    }))}
                  />
                </div>
              </div>
            </div>

            {/* LP Considerations */}
            <div className="border rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-4">LP Considerations</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Diversification Benefit</label>
                  <select 
                    value={inputs.lpConsiderations.diversificationBenefit}
                    onChange={(e) => setInputs(prev => ({
                      ...prev,
                      lpConsiderations: {
                        ...prev.lpConsiderations,
                        diversificationBenefit: e.target.value as any
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fee Tolerance</label>
                  <select 
                    value={inputs.lpConsiderations.feeToleranceLevel}
                    onChange={(e) => setInputs(prev => ({
                      ...prev,
                      lpConsiderations: {
                        ...prev.lpConsiderations,
                        feeToleranceLevel: e.target.value as any
                      }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  >
                    <option value="low">Low</option>
                    <option value="standard">Standard</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Valuation Analysis Tab */}
        {activeTab === 'valuation' && results && (
          <div className="space-y-6">
            {/* Portfolio Valuation Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="border rounded-lg p-4 text-center">
                <h5 className="font-medium text-gray-900 mb-2">Sum of Parts</h5>
                <div className="text-2xl font-bold text-blue-600">{formatCurrency(results.portfolioValuation.sumOfPartsValuation)}</div>
                <div className="text-sm text-gray-500">Individual Valuations</div>
              </div>
              <div className="border rounded-lg p-4 text-center">
                <h5 className="font-medium text-gray-900 mb-2">Portfolio Discount</h5>
                <div className="text-2xl font-bold text-red-600">-{formatCurrency(results.portfolioValuation.portfolioDiscount)}</div>
                <div className="text-sm text-gray-500">Liquidity Adjustment</div>
              </div>
              <div className="border rounded-lg p-4 text-center">
                <h5 className="font-medium text-gray-900 mb-2">Adjusted Value</h5>
                <div className="text-2xl font-bold text-green-600">{formatCurrency(results.portfolioValuation.adjustedPortfolioValue)}</div>
                <div className="text-sm text-gray-500">MACF Valuation</div>
              </div>
              <div className="border rounded-lg p-4 text-center">
                <h5 className="font-medium text-gray-900 mb-2">Portfolio Multiple</h5>
                <div className="text-2xl font-bold text-blue-600">{results.portfolioValuation.weightedAverageMultiple.toFixed(1)}x</div>
                <div className="text-sm text-gray-500">Weighted Average</div>
              </div>
            </div>

            {/* Asset-Level Analysis */}
            <div className="border rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-4">Asset-Level Analysis</h4>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Asset Name</th>
                      <th className="text-right py-2">Current Value</th>
                      <th className="text-right py-2">Adjusted Value</th>
                      <th className="text-right py-2">Multiple</th>
                      <th className="text-right py-2">Portfolio %</th>
                      <th className="text-right py-2">Risk Rating</th>
                      <th className="text-right py-2">Exit Timeline</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.portfolioValuation.assetAnalysis.map((analysis, index) => (
                      <tr key={index} className="border-b">
                        <td className="py-2 font-medium">{analysis.assetName}</td>
                        <td className="text-right py-2">{formatCurrency(analysis.currentValue)}</td>
                        <td className="text-right py-2">{formatCurrency(analysis.adjustedValue)}</td>
                        <td className="text-right py-2">{analysis.impliedMultiple.toFixed(1)}x</td>
                        <td className="text-right py-2">{formatPercentage(analysis.contributionToPortfolio)}</td>
                        <td className="text-right py-2">
                          <Badge variant={analysis.riskRating === 'Low' ? 'default' : 'secondary'}>
                            {analysis.riskRating}
                          </Badge>
                        </td>
                        <td className="text-right py-2 capitalize">
                          {analysis.projectedExit.replace('_', ' ')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* MACF Pricing */}
            <div className="border rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-4">MACF Pricing Analysis</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-lg font-bold text-blue-600">{formatCurrency(results.macfPricing.totalFundValue)}</div>
                  <div className="text-sm text-gray-600">Total Fund Value</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-orange-600">{formatPercentage(results.macfPricing.discountToNAV)}</div>
                  <div className="text-sm text-gray-600">Discount to NAV</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-green-600">{formatPercentage(results.macfPricing.premiumToBook)}</div>
                  <div className="text-sm text-gray-600">Premium to Book</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-blue-600">{results.macfPricing.impliedPortfolioMultiple.toFixed(1)}x</div>
                  <div className="text-sm text-gray-600">Portfolio EV/EBITDA</div>
                </div>
              </div>
            </div>

            {/* Market Comparison */}
            <div className="border rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-4">Recent MACF Comparisons</h4>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Deal Name</th>
                      <th className="text-right py-2">Portfolio Value</th>
                      <th className="text-right py-2">Discount</th>
                      <th className="text-right py-2">Asset Count</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.marketComparison.recentMACFDeals.map((deal, index) => (
                      <tr key={index} className="border-b">
                        <td className="py-2">{deal.dealName}</td>
                        <td className="text-right py-2">{formatCurrency(deal.portfolioValue)}</td>
                        <td className="text-right py-2">{formatPercentage(deal.discount)}</td>
                        <td className="text-right py-2">{deal.assetCount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-3 text-sm text-gray-600">
                Market average discount: {formatPercentage(results.marketComparison.averageDiscount)}
              </div>
            </div>
          </div>
        )}

        {/* Economics Tab */}
        {activeTab === 'economics' && results && (
          <div className="space-y-6">
            {/* LP Economics */}
            <div className="border rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-4">LP Economics & Diversification</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-medium text-gray-700 mb-3">Liquidity Options</h5>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Total LP Value</span>
                      <span className="font-medium">{formatCurrency(results.lpEconomics.totalLPValue)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Liquidity Amount</span>
                      <span className="font-medium">{formatCurrency(results.lpEconomics.liquidityAmount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Continuation Amount</span>
                      <span className="font-medium">{formatCurrency(results.lpEconomics.continuationAmount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Liquidity Percentage</span>
                      <span className="font-medium">{formatPercentage(results.lpEconomics.liquidityPercentage)}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h5 className="font-medium text-gray-700 mb-3">Diversification Impact</h5>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Risk Reduction</span>
                      <span className="font-medium">{formatPercentage(results.lpEconomics.diversificationImpact.riskReduction)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Return Stability</span>
                      <span className="font-medium">{formatPercentage(results.lpEconomics.diversificationImpact.returnStability)}</span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600 mb-2 block">Sector Exposure</span>
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span>Technology</span>
                          <span>{formatPercentage(results.lpEconomics.diversificationImpact.sectorExposure.technology)}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span>Healthcare</span>
                          <span>{formatPercentage(results.lpEconomics.diversificationImpact.sectorExposure.healthcare)}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span>Energy</span>
                          <span>{formatPercentage(results.lpEconomics.diversificationImpact.sectorExposure.energy)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Projected Returns */}
              <div className="mt-6">
                <h5 className="font-medium text-gray-700 mb-3">Projected Returns</h5>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { label: 'Downside', scenario: results.lpEconomics.projectedReturns.downside, color: 'red' },
                    { label: 'Base Case', scenario: results.lpEconomics.projectedReturns.baseCase, color: 'blue' },
                    { label: 'Upside', scenario: results.lpEconomics.projectedReturns.upside, color: 'green' }
                  ].map(({ label, scenario, color }) => (
                    <div key={label} className="border rounded-lg p-4 text-center">
                      <h6 className={`font-medium text-${color}-600 mb-2`}>{label}</h6>
                      <div className="space-y-1">
                        <div className={`text-lg font-bold text-${color}-600`}>{formatPercentage(scenario.irr)}</div>
                        <div className="text-sm text-gray-600">IRR</div>
                        <div className={`text-lg font-bold text-${color}-600`}>{scenario.multiple.toFixed(1)}x</div>
                        <div className="text-sm text-gray-600">Multiple</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Fund Economics */}
            <div className="border rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-4">Fund Economics</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-lg font-bold text-blue-600">{formatCurrency(results.fundEconomics.totalFundSize)}</div>
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
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Fee Load to LPs</span>
                  <span className="font-medium">{formatPercentage(results.fundEconomics.feeLoadToLPs)}</span>
                </div>
              </div>
            </div>

            {/* Risk Analysis */}
            <div className="border rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-4">Comprehensive Risk Analysis</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-medium text-gray-700 mb-3">Risk Categories</h5>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Concentration Risk</span>
                      <Badge variant={results.riskAnalysis.concentrationRisk === 'Low' ? 'default' : 'secondary'}>
                        {results.riskAnalysis.concentrationRisk}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Sector Risk</span>
                      <Badge variant={results.riskAnalysis.sectorRisk === 'Low' ? 'default' : 'secondary'}>
                        {results.riskAnalysis.sectorRisk}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Timing Risk</span>
                      <Badge variant={results.riskAnalysis.timingRisk === 'Low' ? 'default' : 'secondary'}>
                        {results.riskAnalysis.timingRisk}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Market Risk</span>
                      <Badge variant={results.riskAnalysis.marketRisk === 'Low' ? 'default' : 'secondary'}>
                        {results.riskAnalysis.marketRisk}
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h5 className="font-medium text-gray-700 mb-3">Key Considerations</h5>
                  <div>
                    <h6 className="text-sm font-medium text-gray-700 mb-2">Primary Risks</h6>
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
              </div>
            </div>

            {/* Implementation Plan */}
            <div className="border rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-4">Implementation Roadmap</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Calendar className="h-4 w-4 text-blue-600" />
                    <h5 className="font-medium text-gray-700">Timeline & Complexity</h5>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Expected Timeline</span>
                      <Badge variant="outline">{results.implementation.expectedTimeline} months</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Complexity Rating</span>
                      <Badge variant={results.implementation.complexityRating === 'High' ? 'secondary' : 'default'}>
                        {results.implementation.complexityRating}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <h6 className="text-sm font-medium text-gray-700 mb-2">Required Approvals</h6>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {results.implementation.regulatoryRequirements.map((req, index) => (
                        <li key={index}>• {req}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                <div>
                  <h6 className="text-sm font-medium text-gray-700 mb-2">Success Factors</h6>
                  <ul className="text-sm text-gray-600 space-y-1 mb-4">
                    {results.implementation.criticalSuccessFactors.map((factor, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                        {factor}
                      </li>
                    ))}
                  </ul>
                  
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
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">{formatCurrency(results.portfolioValuation.adjustedPortfolioValue)}</div>
                <div className="text-sm text-gray-600">MACF Valuation</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{inputs.dealInfo.portfolioAssets.length}</div>
                <div className="text-sm text-gray-600">Portfolio Assets</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{formatPercentage(results.lpEconomics.projectedReturns.baseCase.irr)}</div>
                <div className="text-sm text-gray-600">Projected IRR</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{formatPercentage(results.macfPricing.discountToNAV)}</div>
                <div className="text-sm text-gray-600">Liquidity Discount</div>
              </div>
            </div>
          </div>
        )}

        {/* AI Assistance (for assisted/autonomous modes) */}
        {mode !== 'traditional' && (
          <div className="border rounded-lg p-4 bg-orange-50">
            <div className="flex items-start gap-3">
              <Zap className="h-5 w-5 text-orange-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-orange-900">AI MACF Optimization</h4>
                <ul className="text-sm text-orange-800 mt-2 space-y-1">
                  <li>• Portfolio shows good diversification across 3 sectors reducing concentration risk</li>
                  <li>• 12% portfolio discount is reasonable given mixed maturity stages</li>
                  <li>• Consider staging exits based on asset readiness for maximum value capture</li>
                  <li>• High-performing healthcare asset ready for near-term strategic exit</li>
                  {mode === 'autonomous' && (
                    <li>• <strong>Auto-recommendation:</strong> Structure as 7-year fund with asset-specific exit flexibility</li>
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

export default MACFValuationCard;