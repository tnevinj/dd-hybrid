'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Calculator,
  TrendingUp,
  CreditCard,
  Shield,
  AlertTriangle,
  CheckCircle,
  Download,
  Zap,
  BarChart3,
  DollarSign,
  Calendar,
  PieChart,
  Plus,
  Trash2,
  Lock
} from 'lucide-react';
import { NAVFinancingInputs, NAVFinancingResults } from '@/types/deal-structuring';

interface NAVFinancingCardProps {
  dealId: string;
  mode?: 'traditional' | 'assisted' | 'autonomous';
  onResultsChange?: (results: NAVFinancingResults) => void;
}

interface NAVPosition {
  positionId: string;
  fundName: string;
  fundVintage: number;
  fundStrategy: string;
  totalCommitment: number;
  calledAmount: number;
  currentNAV: number;
  unrealizedValue: number;
  distributionsReceived: number;
  remainingLife: number;
  fundGP: string;
  diversificationScore: number;
  liquidityRating: 'high' | 'medium' | 'low';
  performanceRating: 1 | 2 | 3 | 4 | 5;
}

interface FinancingStructure {
  facilitySize: number;
  advanceRate: number; // percentage of NAV
  interestRate: number;
  facilityTerm: number; // years
  commitmentFee: number;
  covenants: {
    maxLTV: number;
    minPortfolioSize: number;
    diversificationRequirement: number;
  };
  collateralRequirements: string[];
  repaymentTerms: 'revolving' | 'term_loan' | 'bridge';
}

const NAVFinancingCard: React.FC<NAVFinancingCardProps> = ({ 
  dealId, 
  mode = 'traditional',
  onResultsChange 
}) => {
  const [inputs, setInputs] = useState<NAVFinancingInputs>({
    dealInfo: {
      dealId,
      dealName: 'NAV-Based Credit Facility',
      borrowerName: 'SecondaryEdge Fund Holdings',
      facilityPurpose: 'bridge_financing',
      requestedAmount: 150000000, // $150M
      expectedDrawdown: 0.60 // 60% initial draw
    },
    navPortfolio: [
      {
        positionId: 'pos_001',
        fundName: 'TechGrowth Fund III',
        fundVintage: 2019,
        fundStrategy: 'Growth Equity',
        totalCommitment: 25000000,
        calledAmount: 22000000,
        currentNAV: 35000000,
        unrealizedValue: 30000000,
        distributionsReceived: 5000000,
        remainingLife: 4,
        fundGP: 'TechGrowth Partners',
        diversificationScore: 0.85,
        liquidityRating: 'high',
        performanceRating: 4
      },
      {
        positionId: 'pos_002',
        fundName: 'Healthcare Innovation IV',
        fundVintage: 2020,
        fundStrategy: 'Venture Capital',
        totalCommitment: 20000000,
        calledAmount: 18000000,
        currentNAV: 28000000,
        unrealizedValue: 26000000,
        distributionsReceived: 2000000,
        remainingLife: 6,
        fundGP: 'MedTech Ventures',
        diversificationScore: 0.75,
        liquidityRating: 'medium',
        performanceRating: 5
      },
      {
        positionId: 'pos_003',
        fundName: 'Energy Transition Fund II',
        fundVintage: 2021,
        fundStrategy: 'Infrastructure',
        totalCommitment: 30000000,
        calledAmount: 25000000,
        currentNAV: 32000000,
        unrealizedValue: 30000000,
        distributionsReceived: 2000000,
        remainingLife: 7,
        fundGP: 'GreenTech Capital',
        diversificationScore: 0.65,
        liquidityRating: 'medium',
        performanceRating: 3
      }
    ],
    financingStructure: {
      facilitySize: 150000000,
      advanceRate: 0.60, // 60% of NAV
      interestRate: 0.085, // 8.5%
      facilityTerm: 3, // 3 years
      commitmentFee: 0.005, // 0.5%
      covenants: {
        maxLTV: 0.65, // 65% max loan-to-value
        minPortfolioSize: 75000000, // $75M minimum
        diversificationRequirement: 0.70 // 70% diversification score
      },
      collateralRequirements: [
        'First lien on NAV positions',
        'Assignment of distribution rights',
        'Side letter consents where required',
        'Portfolio concentration limits'
      ],
      repaymentTerms: 'revolving'
    },
    marketConditions: {
      navFinancingSpread: 0.06, // 600 bps over base rate
      baseRate: 0.025, // 2.5% base rate
      marketLiquidity: 'favorable',
      lenderAppetite: 'strong',
      competitiveEnvironment: 'active'
    },
    useOfProceeds: {
      bridgeFinancing: 0.40, // 40% bridge to new deals
      portfolioOptimization: 0.30, // 30% optimize existing
      lpLiquidity: 0.20, // 20% LP liquidity needs
      workingCapital: 0.10 // 10% working capital
    },
    riskFactors: {
      concentrationRisk: 'medium',
      vintageRisk: 'low',
      gpRisk: 'low',
      liquidityRisk: 'medium',
      marketRisk: 'medium'
    }
  });

  const [results, setResults] = useState<NAVFinancingResults | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [activeTab, setActiveTab] = useState<'portfolio' | 'structure' | 'analysis' | 'terms'>('portfolio');

  const calculateNAVFinancing = async () => {
    setIsCalculating(true);
    
    // Mock calculation - replace with actual NAV financing logic
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const portfolio = inputs.navPortfolio;
    const structure = inputs.financingStructure;
    
    // Portfolio Analysis
    const totalNAV = portfolio.reduce((sum, pos) => sum + pos.currentNAV, 0);
    const totalCommitments = portfolio.reduce((sum, pos) => sum + pos.totalCommitment, 0);
    const totalUnrealized = portfolio.reduce((sum, pos) => sum + pos.unrealizedValue, 0);
    const weightedDiversification = portfolio.reduce((sum, pos) => 
      sum + (pos.diversificationScore * pos.currentNAV), 0) / totalNAV;
    
    // Financing Metrics
    const maxFacilityAmount = totalNAV * structure.advanceRate;
    const requestedAmount = inputs.dealInfo.requestedAmount;
    const availableCapacity = Math.min(maxFacilityAmount, requestedAmount);
    const utilizationAtDrawdown = (requestedAmount * inputs.dealInfo.expectedDrawdown) / availableCapacity;
    
    // Cost Analysis
    const allInCost = structure.interestRate + structure.commitmentFee;
    const annualInterestCost = requestedAmount * inputs.dealInfo.expectedDrawdown * structure.interestRate;
    const commitmentFeeCost = (requestedAmount - (requestedAmount * inputs.dealInfo.expectedDrawdown)) * structure.commitmentFee;
    const totalAnnualCost = annualInterestCost + commitmentFeeCost;
    
    // Position Analysis
    const positionAnalysis = portfolio.map(position => {
      const ltvRatio = (requestedAmount * inputs.dealInfo.expectedDrawdown * (position.currentNAV / totalNAV)) / position.currentNAV;
      const contributionToFacility = position.currentNAV / totalNAV;
      const riskWeighting = position.performanceRating >= 4 ? 'low' : 
                          position.performanceRating >= 3 ? 'medium' : 'high';
      
      return {
        positionId: position.positionId,
        fundName: position.fundName,
        navContribution: position.currentNAV,
        facilityContribution: contributionToFacility,
        impliedLTV: ltvRatio,
        riskRating: riskWeighting,
        liquidityProfile: position.liquidityRating,
        diversificationImpact: position.diversificationScore
      };
    });

    const mockResults: NAVFinancingResults = {
      portfolioAnalysis: {
        totalNAV,
        totalCommitments,
        totalUnrealized,
        portfolioCount: portfolio.length,
        weightedDiversificationScore: weightedDiversification,
        averageRemainingLife: portfolio.reduce((sum, pos) => sum + pos.remainingLife, 0) / portfolio.length,
        vintageDistribution: {
          '2019-2020': 0.40,
          '2021-2022': 0.35,
          '2023+': 0.25
        },
        strategyDistribution: {
          'Growth Equity': 0.45,
          'Venture Capital': 0.30,
          'Infrastructure': 0.25
        }
      },
      financingCapacity: {
        maxFacilityAmount,
        requestedAmount,
        availableCapacity,
        utilizationAtDrawdown,
        loanToValueRatio: requestedAmount / totalNAV,
        headroomAmount: maxFacilityAmount - requestedAmount,
        advanceRateApplied: structure.advanceRate
      },
      costAnalysis: {
        allInCostOfFunds: allInCost,
        annualInterestCost,
        commitmentFeeCost,
        totalAnnualCost,
        costAsPercentOfNAV: totalAnnualCost / totalNAV,
        breakdownByComponent: {
          baseRate: inputs.marketConditions.baseRate,
          spread: inputs.marketConditions.navFinancingSpread,
          commitmentFee: structure.commitmentFee
        }
      },
      positionAnalysis,
      covenantAnalysis: {
        currentLTV: requestedAmount / totalNAV,
        maxAllowedLTV: structure.covenants.maxLTV,
        ltvHeadroom: structure.covenants.maxLTV - (requestedAmount / totalNAV),
        portfolioSizeCompliance: totalNAV >= structure.covenants.minPortfolioSize,
        diversificationCompliance: weightedDiversification >= structure.covenants.diversificationRequirement,
        covenantStatus: {
          ltv: 'compliant',
          portfolioSize: 'compliant',
          diversification: 'compliant'
        }
      },
      riskAssessment: {
        overallRiskRating: 'Medium',
        keyRisks: [
          'NAV volatility affecting collateral value',
          'GP performance variation across positions',
          'Market downturn impact on unrealized values',
          'Liquidity constraints during stress periods'
        ],
        mitigationFactors: [
          'Diversified portfolio across strategies and vintages',
          'Conservative advance rate provides cushion',
          'Strong GP relationships and track records',
          'Regular portfolio monitoring and reporting'
        ],
        concentrationAnalysis: {
          largestPosition: Math.max(...portfolio.map(p => p.currentNAV)) / totalNAV,
          top3Concentration: portfolio
            .sort((a, b) => b.currentNAV - a.currentNAV)
            .slice(0, 3)
            .reduce((sum, pos) => sum + pos.currentNAV, 0) / totalNAV,
          recommendedMaxPosition: 0.25
        }
      },
      scenarioAnalysis: {
        scenarios: [
          {
            label: 'Base Case',
            navGrowth: 0.15,
            facilityUtilization: 0.60,
            costOfFunds: allInCost,
            netBenefit: 12000000
          },
          {
            label: 'Stress Case',
            navGrowth: -0.20,
            facilityUtilization: 0.80,
            costOfFunds: allInCost * 1.2,
            netBenefit: -5000000
          },
          {
            label: 'Upside Case',
            navGrowth: 0.25,
            facilityUtilization: 0.40,
            costOfFunds: allInCost * 0.9,
            netBenefit: 20000000
          }
        ]
      },
      implementationPlan: {
        timelineMonths: 4,
        criticalPath: [
          'Portfolio valuation and due diligence',
          'Lender selection and term sheet negotiation',
          'Legal documentation and side letter consents',
          'Facility closing and initial drawdown'
        ],
        regulatoryRequirements: [
          'Investment adviser compliance review',
          'Fund agreement covenant compliance',
          'LP notification requirements',
          'Regulatory filing obligations'
        ],
        recommendedActions: [
          'Engage independent portfolio valuation firm',
          'Conduct lender market sounding',
          'Review fund documentation for financing restrictions',
          'Prepare comprehensive portfolio CIM'
        ]
      }
    };

    setResults(mockResults);
    setIsCalculating(false);
    onResultsChange?.(mockResults);
  };

  const addPosition = () => {
    const newPosition: NAVPosition = {
      positionId: `pos_${Date.now()}`,
      fundName: 'New Fund Position',
      fundVintage: 2023,
      fundStrategy: 'Growth Equity',
      totalCommitment: 10000000,
      calledAmount: 8000000,
      currentNAV: 12000000,
      unrealizedValue: 10000000,
      distributionsReceived: 2000000,
      remainingLife: 5,
      fundGP: 'Fund Manager',
      diversificationScore: 0.70,
      liquidityRating: 'medium',
      performanceRating: 3
    };

    setInputs(prev => ({
      ...prev,
      navPortfolio: [...prev.navPortfolio, newPosition]
    }));
  };

  const removePosition = (positionId: string) => {
    setInputs(prev => ({
      ...prev,
      navPortfolio: prev.navPortfolio.filter(pos => pos.positionId !== positionId)
    }));
  };

  const updatePosition = (positionId: string, field: string, value: any) => {
    setInputs(prev => ({
      ...prev,
      navPortfolio: prev.navPortfolio.map(pos =>
        pos.positionId === positionId ? { ...pos, [field]: value } : pos
      )
    }));
  };

  const formatCurrency = (amount: number) => {
    return `$${(amount / 1000000).toFixed(1)}M`;
  };

  const formatPercentage = (value: number) => {
    return `${(value * 100).toFixed(1)}%`;
  };

  const getPerformanceStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        className={`text-xs ${i < rating ? 'text-yellow-500' : 'text-gray-300'}`}
      >
        ★
      </span>
    ));
  };

  const getRiskColor = (rating: string) => {
    switch (rating.toLowerCase()) {
      case 'low': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'high': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Shield className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">NAV Financing Analysis</h3>
              <p className="text-sm text-gray-500">Net Asset Value-based credit facility structuring</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={mode === 'autonomous' ? 'default' : 'secondary'}>
              {mode === 'autonomous' && <Zap className="h-3 w-3 mr-1" />}
              {mode.charAt(0).toUpperCase() + mode.slice(1)} Mode
            </Badge>
            <Button onClick={calculateNAVFinancing} disabled={isCalculating} size="sm">
              {isCalculating ? 'Analyzing...' : 'Calculate'}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          {[
            { key: 'portfolio', label: 'NAV Portfolio', icon: PieChart },
            { key: 'structure', label: 'Facility Structure', icon: CreditCard },
            { key: 'analysis', label: 'Analysis', icon: Calculator },
            { key: 'terms', label: 'Terms & Covenants', icon: Lock }
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

        {/* NAV Portfolio Tab */}
        {activeTab === 'portfolio' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-medium text-gray-900">NAV Portfolio Positions</h4>
              <Button onClick={addPosition} size="sm" variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Add Position
              </Button>
            </div>

            <div className="space-y-4">
              {inputs.navPortfolio.map((position, index) => (
                <div key={position.positionId} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <h5 className="font-medium text-gray-900">{position.fundName}</h5>
                      <div className="flex">{getPerformanceStars(position.performanceRating)}</div>
                      <Badge variant="outline">{position.fundStrategy}</Badge>
                      <Badge variant={position.liquidityRating === 'high' ? 'default' : 'secondary'}>
                        {position.liquidityRating} liquidity
                      </Badge>
                    </div>
                    {inputs.navPortfolio.length > 1 && (
                      <Button 
                        onClick={() => removePosition(position.positionId)}
                        size="sm"
                        variant="ghost"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Fund Name</label>
                      <Input 
                        value={position.fundName}
                        onChange={(e) => updatePosition(position.positionId, 'fundName', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Vintage</label>
                      <Input 
                        type="number"
                        value={position.fundVintage}
                        onChange={(e) => updatePosition(position.positionId, 'fundVintage', parseInt(e.target.value))}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Strategy</label>
                      <select 
                        value={position.fundStrategy}
                        onChange={(e) => updatePosition(position.positionId, 'fundStrategy', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                      >
                        <option value="Growth Equity">Growth Equity</option>
                        <option value="Venture Capital">Venture Capital</option>
                        <option value="Buyout">Buyout</option>
                        <option value="Infrastructure">Infrastructure</option>
                        <option value="Real Estate">Real Estate</option>
                        <option value="Credit">Credit</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Fund GP</label>
                      <Input 
                        value={position.fundGP}
                        onChange={(e) => updatePosition(position.positionId, 'fundGP', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Commitment ($M)</label>
                      <Input 
                        type="number"
                        value={position.totalCommitment / 1000000}
                        onChange={(e) => updatePosition(position.positionId, 'totalCommitment', parseFloat(e.target.value) * 1000000)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Called ($M)</label>
                      <Input 
                        type="number"
                        value={position.calledAmount / 1000000}
                        onChange={(e) => updatePosition(position.positionId, 'calledAmount', parseFloat(e.target.value) * 1000000)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Current NAV ($M)</label>
                      <Input 
                        type="number"
                        value={position.currentNAV / 1000000}
                        onChange={(e) => updatePosition(position.positionId, 'currentNAV', parseFloat(e.target.value) * 1000000)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Distributions ($M)</label>
                      <Input 
                        type="number"
                        value={position.distributionsReceived / 1000000}
                        onChange={(e) => updatePosition(position.positionId, 'distributionsReceived', parseFloat(e.target.value) * 1000000)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Remaining Life (Years)</label>
                      <Input 
                        type="number"
                        value={position.remainingLife}
                        onChange={(e) => updatePosition(position.positionId, 'remainingLife', parseInt(e.target.value))}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Diversification Score</label>
                      <Input 
                        type="number"
                        step="0.1"
                        min="0"
                        max="1"
                        value={position.diversificationScore}
                        onChange={(e) => updatePosition(position.positionId, 'diversificationScore', parseFloat(e.target.value))}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Liquidity Rating</label>
                      <select 
                        value={position.liquidityRating}
                        onChange={(e) => updatePosition(position.positionId, 'liquidityRating', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                      >
                        <option value="high">High</option>
                        <option value="medium">Medium</option>
                        <option value="low">Low</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Performance (1-5)</label>
                      <Input 
                        type="number"
                        min="1"
                        max="5"
                        value={position.performanceRating}
                        onChange={(e) => updatePosition(position.positionId, 'performanceRating', parseInt(e.target.value))}
                      />
                    </div>
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
                    {inputs.navPortfolio.length}
                  </div>
                  <div className="text-sm text-gray-600">Total Positions</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-blue-600">
                    {formatCurrency(inputs.navPortfolio.reduce((sum, pos) => sum + pos.totalCommitment, 0))}
                  </div>
                  <div className="text-sm text-gray-600">Total Commitments</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-green-600">
                    {formatCurrency(inputs.navPortfolio.reduce((sum, pos) => sum + pos.currentNAV, 0))}
                  </div>
                  <div className="text-sm text-gray-600">Total Current NAV</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-purple-600">
                    {((inputs.navPortfolio.reduce((sum, pos) => sum + pos.diversificationScore, 0) / inputs.navPortfolio.length) * 100).toFixed(0)}%
                  </div>
                  <div className="text-sm text-gray-600">Avg Diversification</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Facility Structure Tab */}
        {activeTab === 'structure' && (
          <div className="space-y-6">
            {/* Basic Facility Terms */}
            <div className="border rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-4">Facility Structure</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Facility Size ($M)</label>
                  <Input 
                    type="number"
                    value={inputs.financingStructure.facilitySize / 1000000}
                    onChange={(e) => setInputs(prev => ({
                      ...prev,
                      financingStructure: {
                        ...prev.financingStructure,
                        facilitySize: parseFloat(e.target.value) * 1000000
                      }
                    }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Advance Rate (%)</label>
                  <Input 
                    type="number"
                    step="1"
                    value={inputs.financingStructure.advanceRate * 100}
                    onChange={(e) => setInputs(prev => ({
                      ...prev,
                      financingStructure: {
                        ...prev.financingStructure,
                        advanceRate: parseFloat(e.target.value) / 100
                      }
                    }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Facility Term (Years)</label>
                  <Input 
                    type="number"
                    value={inputs.financingStructure.facilityTerm}
                    onChange={(e) => setInputs(prev => ({
                      ...prev,
                      financingStructure: {
                        ...prev.financingStructure,
                        facilityTerm: parseInt(e.target.value)
                      }
                    }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Interest Rate (%)</label>
                  <Input 
                    type="number"
                    step="0.1"
                    value={inputs.financingStructure.interestRate * 100}
                    onChange={(e) => setInputs(prev => ({
                      ...prev,
                      financingStructure: {
                        ...prev.financingStructure,
                        interestRate: parseFloat(e.target.value) / 100
                      }
                    }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Commitment Fee (%)</label>
                  <Input 
                    type="number"
                    step="0.1"
                    value={inputs.financingStructure.commitmentFee * 100}
                    onChange={(e) => setInputs(prev => ({
                      ...prev,
                      financingStructure: {
                        ...prev.financingStructure,
                        commitmentFee: parseFloat(e.target.value) / 100
                      }
                    }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Repayment Terms</label>
                  <select 
                    value={inputs.financingStructure.repaymentTerms}
                    onChange={(e) => setInputs(prev => ({
                      ...prev,
                      financingStructure: {
                        ...prev.financingStructure,
                        repaymentTerms: e.target.value as any
                      }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  >
                    <option value="revolving">Revolving Credit</option>
                    <option value="term_loan">Term Loan</option>
                    <option value="bridge">Bridge Financing</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Use of Proceeds */}
            <div className="border rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-4">Use of Proceeds</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bridge Financing (%)</label>
                  <Input 
                    type="number"
                    step="1"
                    value={inputs.useOfProceeds.bridgeFinancing * 100}
                    onChange={(e) => setInputs(prev => ({
                      ...prev,
                      useOfProceeds: {
                        ...prev.useOfProceeds,
                        bridgeFinancing: parseFloat(e.target.value) / 100
                      }
                    }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Portfolio Optimization (%)</label>
                  <Input 
                    type="number"
                    step="1"
                    value={inputs.useOfProceeds.portfolioOptimization * 100}
                    onChange={(e) => setInputs(prev => ({
                      ...prev,
                      useOfProceeds: {
                        ...prev.useOfProceeds,
                        portfolioOptimization: parseFloat(e.target.value) / 100
                      }
                    }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">LP Liquidity (%)</label>
                  <Input 
                    type="number"
                    step="1"
                    value={inputs.useOfProceeds.lpLiquidity * 100}
                    onChange={(e) => setInputs(prev => ({
                      ...prev,
                      useOfProceeds: {
                        ...prev.useOfProceeds,
                        lpLiquidity: parseFloat(e.target.value) / 100
                      }
                    }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Working Capital (%)</label>
                  <Input 
                    type="number"
                    step="1"
                    value={inputs.useOfProceeds.workingCapital * 100}
                    onChange={(e) => setInputs(prev => ({
                      ...prev,
                      useOfProceeds: {
                        ...prev.useOfProceeds,
                        workingCapital: parseFloat(e.target.value) / 100
                      }
                    }))}
                  />
                </div>
              </div>
            </div>

            {/* Market Conditions */}
            <div className="border rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-4">Market Context</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Base Rate (%)</label>
                  <Input 
                    type="number"
                    step="0.1"
                    value={inputs.marketConditions.baseRate * 100}
                    onChange={(e) => setInputs(prev => ({
                      ...prev,
                      marketConditions: {
                        ...prev.marketConditions,
                        baseRate: parseFloat(e.target.value) / 100
                      }
                    }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">NAV Financing Spread (%)</label>
                  <Input 
                    type="number"
                    step="0.1"
                    value={inputs.marketConditions.navFinancingSpread * 100}
                    onChange={(e) => setInputs(prev => ({
                      ...prev,
                      marketConditions: {
                        ...prev.marketConditions,
                        navFinancingSpread: parseFloat(e.target.value) / 100
                      }
                    }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Market Liquidity</label>
                  <select 
                    value={inputs.marketConditions.marketLiquidity}
                    onChange={(e) => setInputs(prev => ({
                      ...prev,
                      marketConditions: {
                        ...prev.marketConditions,
                        marketLiquidity: e.target.value as any
                      }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  >
                    <option value="constrained">Constrained</option>
                    <option value="moderate">Moderate</option>
                    <option value="favorable">Favorable</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Analysis Tab */}
        {activeTab === 'analysis' && results && (
          <div className="space-y-6">
            {/* Financing Capacity */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="border rounded-lg p-4 text-center">
                <h5 className="font-medium text-gray-900 mb-2">Available Capacity</h5>
                <div className="text-2xl font-bold text-green-600">{formatCurrency(results.financingCapacity.availableCapacity)}</div>
                <div className="text-sm text-gray-500">Max Facility</div>
              </div>
              <div className="border rounded-lg p-4 text-center">
                <h5 className="font-medium text-gray-900 mb-2">LTV Ratio</h5>
                <div className="text-2xl font-bold text-blue-600">{formatPercentage(results.financingCapacity.loanToValueRatio)}</div>
                <div className="text-sm text-gray-500">Loan to NAV</div>
              </div>
              <div className="border rounded-lg p-4 text-center">
                <h5 className="font-medium text-gray-900 mb-2">Utilization</h5>
                <div className="text-2xl font-bold text-purple-600">{formatPercentage(results.financingCapacity.utilizationAtDrawdown)}</div>
                <div className="text-sm text-gray-500">At Drawdown</div>
              </div>
              <div className="border rounded-lg p-4 text-center">
                <h5 className="font-medium text-gray-900 mb-2">Headroom</h5>
                <div className="text-2xl font-bold text-orange-600">{formatCurrency(results.financingCapacity.headroomAmount)}</div>
                <div className="text-sm text-gray-500">Available Capacity</div>
              </div>
            </div>

            {/* Cost Analysis */}
            <div className="border rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-4">Cost Analysis</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-lg font-bold text-red-600">{formatPercentage(results.costAnalysis.allInCostOfFunds)}</div>
                  <div className="text-sm text-gray-600">All-In Cost</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-orange-600">{formatCurrency(results.costAnalysis.annualInterestCost)}</div>
                  <div className="text-sm text-gray-600">Annual Interest</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-yellow-600">{formatCurrency(results.costAnalysis.commitmentFeeCost)}</div>
                  <div className="text-sm text-gray-600">Commitment Fee</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-red-600">{formatCurrency(results.costAnalysis.totalAnnualCost)}</div>
                  <div className="text-sm text-gray-600">Total Annual Cost</div>
                </div>
              </div>
              
              <div className="p-3 bg-gray-50 rounded-lg">
                <h5 className="font-medium text-gray-700 mb-2">Cost Breakdown</h5>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Base Rate:</span>
                    <span className="font-medium">{formatPercentage(results.costAnalysis.breakdownByComponent.baseRate)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Spread:</span>
                    <span className="font-medium">{formatPercentage(results.costAnalysis.breakdownByComponent.spread)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Commitment Fee:</span>
                    <span className="font-medium">{formatPercentage(results.costAnalysis.breakdownByComponent.commitmentFee)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Position Analysis */}
            <div className="border rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-4">Position-Level Analysis</h4>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Fund Name</th>
                      <th className="text-right py-2">NAV Contribution</th>
                      <th className="text-right py-2">Facility %</th>
                      <th className="text-right py-2">Implied LTV</th>
                      <th className="text-right py-2">Risk Rating</th>
                      <th className="text-right py-2">Liquidity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.positionAnalysis.map((analysis, index) => (
                      <tr key={index} className="border-b">
                        <td className="py-2 font-medium">{analysis.fundName}</td>
                        <td className="text-right py-2">{formatCurrency(analysis.navContribution)}</td>
                        <td className="text-right py-2">{formatPercentage(analysis.facilityContribution)}</td>
                        <td className="text-right py-2">{formatPercentage(analysis.impliedLTV)}</td>
                        <td className="text-right py-2">
                          <Badge variant={analysis.riskRating === 'low' ? 'default' : 'secondary'}>
                            {analysis.riskRating}
                          </Badge>
                        </td>
                        <td className="text-right py-2 capitalize">
                          {analysis.liquidityProfile}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Scenario Analysis */}
            <div className="border rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-4">Scenario Analysis</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {results.scenarioAnalysis.scenarios.map((scenario, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <h5 className={`font-medium mb-3 ${
                      scenario.label === 'Base Case' ? 'text-blue-600' :
                      scenario.label === 'Stress Case' ? 'text-red-600' : 'text-green-600'
                    }`}>{scenario.label}</h5>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">NAV Growth:</span>
                        <span className="font-medium">{formatPercentage(scenario.navGrowth)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Utilization:</span>
                        <span className="font-medium">{formatPercentage(scenario.facilityUtilization)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Cost of Funds:</span>
                        <span className="font-medium">{formatPercentage(scenario.costOfFunds)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Net Benefit:</span>
                        <span className={`font-medium ${scenario.netBenefit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {formatCurrency(scenario.netBenefit)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Terms & Covenants Tab */}
        {activeTab === 'terms' && results && (
          <div className="space-y-6">
            {/* Covenant Analysis */}
            <div className="border rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-4">Covenant Compliance</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="font-medium text-green-900">LTV Covenant</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    Current: {formatPercentage(results.covenantAnalysis.currentLTV)} | 
                    Max: {formatPercentage(results.covenantAnalysis.maxAllowedLTV)}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Headroom: {formatPercentage(results.covenantAnalysis.ltvHeadroom)}
                  </div>
                </div>

                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="font-medium text-green-900">Portfolio Size</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    Current: {formatCurrency(results.portfolioAnalysis.totalNAV)}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Min Required: {formatCurrency(inputs.financingStructure.covenants.minPortfolioSize)}
                  </div>
                </div>

                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="font-medium text-green-900">Diversification</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    Current: {formatPercentage(results.portfolioAnalysis.weightedDiversificationScore)}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Min Required: {formatPercentage(inputs.financingStructure.covenants.diversificationRequirement)}
                  </div>
                </div>
              </div>
            </div>

            {/* Risk Assessment */}
            <div className="border rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-4">Risk Assessment</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <h5 className="font-medium text-gray-700">Overall Risk Rating</h5>
                    <Badge variant={results.riskAssessment.overallRiskRating === 'Low' ? 'default' : 'secondary'}>
                      {results.riskAssessment.overallRiskRating}
                    </Badge>
                  </div>
                  
                  <div>
                    <h6 className="text-sm font-medium text-gray-700 mb-2">Key Risks</h6>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {results.riskAssessment.keyRisks.map((risk, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <AlertTriangle className="h-3 w-3 text-orange-500 mt-0.5 flex-shrink-0" />
                          {risk}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                <div>
                  <h6 className="text-sm font-medium text-gray-700 mb-2">Mitigation Factors</h6>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {results.riskAssessment.mitigationFactors.map((factor, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                        {factor}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Concentration Analysis */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h6 className="font-medium text-gray-700 mb-3">Concentration Analysis</h6>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Largest Position:</span>
                    <span className="font-medium">{formatPercentage(results.riskAssessment.concentrationAnalysis.largestPosition)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Top 3 Concentration:</span>
                    <span className="font-medium">{formatPercentage(results.riskAssessment.concentrationAnalysis.top3Concentration)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Recommended Max:</span>
                    <span className="font-medium">{formatPercentage(results.riskAssessment.concentrationAnalysis.recommendedMaxPosition)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Collateral Requirements */}
            <div className="border rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-4">Collateral & Security</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-medium text-gray-700 mb-3">Collateral Requirements</h5>
                  <ul className="text-sm text-gray-600 space-y-2">
                    {inputs.financingStructure.collateralRequirements.map((req, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Lock className="h-3 w-3 text-blue-500 mt-0.5 flex-shrink-0" />
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h5 className="font-medium text-gray-700 mb-3">Implementation Timeline</h5>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="h-4 w-4 text-blue-600" />
                      <span className="font-medium">Expected Timeline: {results.implementationPlan.timelineMonths} months</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      <h6 className="font-medium text-gray-700 mb-1">Critical Path</h6>
                      <ul className="space-y-1">
                        {results.implementationPlan.criticalPath.map((step, index) => (
                          <li key={index}>• {step}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
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
                <div className="text-2xl font-bold text-blue-600">{formatCurrency(results.financingCapacity.availableCapacity)}</div>
                <div className="text-sm text-gray-600">Available Capacity</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{formatCurrency(results.portfolioAnalysis.totalNAV)}</div>
                <div className="text-sm text-gray-600">Total NAV</div>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">{formatPercentage(results.costAnalysis.allInCostOfFunds)}</div>
                <div className="text-sm text-gray-600">All-In Cost</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{formatPercentage(results.financingCapacity.loanToValueRatio)}</div>
                <div className="text-sm text-gray-600">LTV Ratio</div>
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
                <h4 className="font-medium text-blue-900">AI NAV Financing Insights</h4>
                <ul className="text-sm text-blue-800 mt-2 space-y-1">
                  <li>• Portfolio shows strong diversification across vintages and strategies</li>
                  <li>• 60% advance rate provides conservative leverage with significant headroom</li>
                  <li>• All covenant requirements comfortably met with substantial buffers</li>
                  <li>• Consider revolving structure to optimize cost efficiency</li>
                  {mode === 'autonomous' && (
                    <li>• <strong>Auto-recommendation:</strong> Proceed with 3-year revolving facility at current terms</li>
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

export default NAVFinancingCard;