'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Calculator,
  TrendingUp,
  DollarSign,
  Timeline,
  AlertTriangle,
  CheckCircle,
  Download,
  Zap,
  BarChart3,
  PieChart,
  Plus,
  Trash2,
  Target,
  TrendingDown,
  Edit
} from 'lucide-react';
import { MultiRoundPricingInputs, MultiRoundPricingResults } from '@/types/deal-structuring';

interface MultiRoundPricingCardProps {
  dealId: string;
  mode?: 'traditional' | 'assisted' | 'autonomous';
  onResultsChange?: (results: MultiRoundPricingResults) => void;
}

interface FinancingRound {
  roundId: string;
  roundName: string;
  roundType: 'seed' | 'series_a' | 'series_b' | 'series_c' | 'series_d' | 'bridge' | 'growth';
  roundDate: Date;
  preMoneyValuation: number;
  investmentAmount: number;
  postMoneyValuation: number;
  securityType: 'preferred' | 'common' | 'convertible_note' | 'safe';
  liquidationPreference: number;
  participationRights: 'non_participating' | 'participating' | 'capped_participating';
  dividendRate: number;
  antidilutionProtection: 'none' | 'weighted_average_narrow' | 'weighted_average_broad' | 'full_ratchet';
  proRataRights: boolean;
  boardSeats: number;
  leadInvestor: string;
  keyInvestors: string[];
}

interface CompanyFinancials {
  revenue: number;
  revenueGrowthRate: number;
  grossMargin: number;
  ebitdaMargin: number;
  burnRate: number;
  cashBalance: number;
  employeeCount: number;
  customersCount: number;
  arrrr: number; // Annual Recurring Revenue
}

const MultiRoundPricingCard: React.FC<MultiRoundPricingCardProps> = ({ 
  dealId, 
  mode = 'traditional',
  onResultsChange 
}) => {
  const [inputs, setInputs] = useState<MultiRoundPricingInputs>({
    dealInfo: {
      dealId,
      companyName: 'TechInnovate Inc.',
      sector: 'Enterprise Software',
      stage: 'growth',
      foundedDate: new Date('2019-01-01'),
      currentValuationDate: new Date()
    },
    financingRounds: [
      {
        roundId: 'seed',
        roundName: 'Seed Round',
        roundType: 'seed',
        roundDate: new Date('2019-06-01'),
        preMoneyValuation: 8000000,
        investmentAmount: 2000000,
        postMoneyValuation: 10000000,
        securityType: 'preferred',
        liquidationPreference: 1.0,
        participationRights: 'non_participating',
        dividendRate: 0.08,
        antidilutionProtection: 'weighted_average_broad',
        proRataRights: true,
        boardSeats: 1,
        leadInvestor: 'Early Stage Ventures',
        keyInvestors: ['Early Stage Ventures', 'Angel Group']
      },
      {
        roundId: 'series_a',
        roundName: 'Series A',
        roundType: 'series_a',
        roundDate: new Date('2020-09-01'),
        preMoneyValuation: 18000000,
        investmentAmount: 7000000,
        postMoneyValuation: 25000000,
        securityType: 'preferred',
        liquidationPreference: 1.0,
        participationRights: 'non_participating',
        dividendRate: 0.08,
        antidilutionProtection: 'weighted_average_narrow',
        proRataRights: true,
        boardSeats: 2,
        leadInvestor: 'Growth Capital Partners',
        keyInvestors: ['Growth Capital Partners', 'Strategic Investor A']
      },
      {
        roundId: 'series_b',
        roundName: 'Series B',
        roundType: 'series_b',
        roundDate: new Date('2022-03-01'),
        preMoneyValuation: 73000000,
        investmentAmount: 15000000,
        postMoneyValuation: 88000000,
        securityType: 'preferred',
        liquidationPreference: 1.0,
        participationRights: 'participating',
        dividendRate: 0.08,
        antidilutionProtection: 'weighted_average_narrow',
        proRataRights: true,
        boardSeats: 2,
        leadInvestor: 'Scale Ventures',
        keyInvestors: ['Scale Ventures', 'Corporate VC Fund', 'Strategic Investor B']
      }
    ],
    currentFinancials: {
      revenue: 25000000,
      revenueGrowthRate: 1.20,
      grossMargin: 0.85,
      ebitdaMargin: 0.15,
      burnRate: 1200000,
      cashBalance: 18000000,
      employeeCount: 180,
      customersCount: 1200,
      arrrr: 30000000
    },
    marketComparables: {
      sectorMedianMultiple: 12.0,
      sectorMedianGrowthRate: 0.50,
      recentTransactionMultiples: [8.5, 15.2, 11.8, 9.3, 13.7],
      publicComparableMultiples: [14.2, 10.8, 16.5, 12.1, 11.9],
      marketSentiment: 'positive'
    },
    exitAssumptions: {
      exitTimeframe: 3,
      exitValuationMultiple: 15.0,
      exitType: 'strategic_sale',
      expectedExitRevenue: 75000000,
      marketConditionsAtExit: 'favorable'
    },
    analysisSettings: {
      includeScenarioAnalysis: true,
      includeDilutionAnalysis: true,
      includeWaterfallAnalysis: true,
      includeSensitivityAnalysis: true,
      discountRate: 0.15
    }
  });

  const [results, setResults] = useState<MultiRoundPricingResults | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [activeTab, setActiveTab] = useState<'rounds' | 'financials' | 'analysis' | 'scenarios'>('rounds');

  const calculateMultiRoundPricing = async () => {
    setIsCalculating(true);
    
    // Mock calculation - replace with actual multi-round pricing logic
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const rounds = inputs.financingRounds;
    const financials = inputs.currentFinancials;
    const comparables = inputs.marketComparables;
    const exit = inputs.exitAssumptions;
    
    // Calculate ownership percentages and dilution
    let totalShares = 1000000; // Base common shares
    const ownershipByRound = rounds.map((round, index) => {
      const newShares = (round.investmentAmount / round.postMoneyValuation) * totalShares;
      const ownershipPercentage = newShares / (totalShares + newShares);
      totalShares += newShares;
      
      return {
        roundId: round.roundId,
        roundName: round.roundName,
        investorShares: newShares,
        ownershipPercentage,
        fullyDilutedOwnership: newShares / totalShares,
        pricePerShare: round.investmentAmount / newShares,
        cumulativeInvestment: rounds.slice(0, index + 1).reduce((sum, r) => sum + r.investmentAmount, 0)
      };
    });

    // Calculate current valuation
    const currentValuation = financials.arrrr * comparables.sectorMedianMultiple;
    const latestRoundValuation = rounds[rounds.length - 1]?.postMoneyValuation || 0;
    const valuationUplift = (currentValuation - latestRoundValuation) / latestRoundValuation;
    
    // Exit waterfall analysis
    const exitProceeds = exit.expectedExitRevenue * exit.exitValuationMultiple;
    const waterfall = calculateWaterfall(rounds, exitProceeds, totalShares);
    
    // Return scenarios
    const scenarios = [
      {
        scenario: 'Conservative',
        exitMultiple: exit.exitValuationMultiple * 0.7,
        exitValue: exitProceeds * 0.7,
        irr: 0.18,
        multiple: 2.1
      },
      {
        scenario: 'Base Case',
        exitMultiple: exit.exitValuationMultiple,
        exitValue: exitProceeds,
        irr: 0.28,
        multiple: 3.2
      },
      {
        scenario: 'Optimistic',
        exitMultiple: exit.exitValuationMultiple * 1.4,
        exitValue: exitProceeds * 1.4,
        irr: 0.42,
        multiple: 4.8
      }
    ];

    const mockResults: MultiRoundPricingResults = {
      valuationEvolution: {
        currentValuation,
        latestRoundValuation,
        valuationUplift,
        valuationHistory: rounds.map(round => ({
          date: round.roundDate,
          preMoneyValuation: round.preMoneyValuation,
          postMoneyValuation: round.postMoneyValuation,
          investmentAmount: round.investmentAmount
        })),
        nextRoundProjection: {
          projectedPreMoney: currentValuation,
          suggestedRoundSize: 25000000,
          projectedPostMoney: currentValuation + 25000000,
          recommendedSecurityType: 'preferred'
        }
      },
      ownershipAnalysis: {
        ownershipByRound,
        foundersOwnership: {
          currentOwnership: 0.65,
          fullyDilutedOwnership: 0.58,
          dilutionFromRounds: 0.42
        },
        investorOwnership: {
          totalInvestorOwnership: 0.35,
          ownershipByInvestor: [
            { investor: 'Early Stage Ventures', ownership: 0.08, rounds: ['seed'] },
            { investor: 'Growth Capital Partners', ownership: 0.12, rounds: ['series_a'] },
            { investor: 'Scale Ventures', ownership: 0.15, rounds: ['series_b'] }
          ]
        },
        employeeOptionPool: {
          currentPool: 0.12,
          availableOptions: 0.05,
          nextRefresh: 0.08
        }
      },
      liquidationAnalysis: {
        waterfall,
        scenarioReturns: scenarios.map(scenario => ({
          scenario: scenario.scenario,
          exitValue: scenario.exitValue,
          investorReturns: waterfall.investorPayouts.map(payout => ({
            investor: payout.investor,
            totalReturn: payout.totalPayout * (scenario.exitValue / exitProceeds),
            multiple: (payout.totalPayout * (scenario.exitValue / exitProceeds)) / payout.totalInvested,
            irr: scenario.irr
          })),
          founderReturns: waterfall.founderPayout * (scenario.exitValue / exitProceeds)
        }))
      },
      marketAnalysis: {
        comparableValuation: {
          revenueMultiple: currentValuation / financials.revenue,
          arrMultiple: currentValuation / financials.arrrr,
          sectorComparison: currentValuation / (financials.arrrr * comparables.sectorMedianMultiple),
          marketPosition: currentValuation > financials.arrrr * comparables.sectorMedianMultiple ? 'premium' : 'discount'
        },
        growthMetrics: {
          revenueGrowthVsSector: financials.revenueGrowthRate - comparables.sectorMedianGrowthRate,
          efficiencyScore: financials.arrrr / (financials.employeeCount * 150000), // $150K per employee benchmark
          burnMultiple: financials.burnRate / (financials.revenue / 12),
          cashRunway: financials.cashBalance / financials.burnRate
        }
      },
      riskAssessment: {
        dilutionRisk: {
          historicalDilution: 0.42,
          projectedFutureDilution: 0.15,
          riskLevel: 'medium'
        },
        liquidityRisk: {
          liquidationPreferenceMultiple: rounds.reduce((sum, r) => sum + r.liquidationPreference * r.investmentAmount, 0) / exitProceeds,
          participationOverhang: rounds.filter(r => r.participationRights !== 'non_participating').length / rounds.length,
          riskLevel: 'low'
        },
        marketRisk: {
          sectorVolatility: 'medium',
          competitivePosition: 'strong',
          technicalRisk: 'low',
          regulatoryRisk: 'low'
        },
        recommendations: [
          'Consider anti-dilution protection for next round',
          'Negotiate pro-rata rights maintenance',
          'Plan for employee option pool refresh',
          'Evaluate strategic vs financial exit options'
        ]
      },
      sensitivities: {
        exitMultipleSensitivity: [
          { exitMultiple: 8, investorReturns: 2.1, founderValue: 45000000 },
          { exitMultiple: 12, investorReturns: 3.2, founderValue: 68000000 },
          { exitMultiple: 15, investorReturns: 4.0, founderValue: 85000000 },
          { exitMultiple: 20, investorReturns: 5.3, founderValue: 115000000 }
        ],
        growthRateSensitivity: [
          { growthRate: 0.8, valuation: currentValuation * 0.7 },
          { growthRate: 1.0, valuation: currentValuation * 0.85 },
          { growthRate: 1.2, valuation: currentValuation },
          { growthRate: 1.5, valuation: currentValuation * 1.25 }
        ]
      }
    };

    setResults(mockResults);
    setIsCalculating(false);
    onResultsChange?.(mockResults);
  };

  const calculateWaterfall = (rounds: FinancingRound[], exitValue: number, totalShares: number) => {
    // Simplified waterfall calculation
    const totalInvested = rounds.reduce((sum, round) => sum + round.investmentAmount, 0);
    const liquidationPreferences = rounds.reduce((sum, round) => sum + round.liquidationPreference * round.investmentAmount, 0);
    
    const remainingValue = Math.max(0, exitValue - liquidationPreferences);
    const investorPayout = liquidationPreferences + (remainingValue * 0.35); // Assuming 35% total investor ownership
    const founderPayout = remainingValue * 0.65; // Assuming 65% founder ownership
    
    return {
      totalExitValue: exitValue,
      liquidationPreferences,
      remainingAfterPreferences: remainingValue,
      investorPayouts: rounds.map(round => ({
        investor: round.leadInvestor,
        totalInvested: round.investmentAmount,
        totalPayout: (round.investmentAmount / totalInvested) * investorPayout,
        multiple: ((round.investmentAmount / totalInvested) * investorPayout) / round.investmentAmount
      })),
      founderPayout,
      employeePayout: remainingValue * 0.12 // Assuming 12% employee ownership
    };
  };

  const addRound = () => {
    const newRound: FinancingRound = {
      roundId: `round_${Date.now()}`,
      roundName: 'New Round',
      roundType: 'series_a',
      roundDate: new Date(),
      preMoneyValuation: 50000000,
      investmentAmount: 10000000,
      postMoneyValuation: 60000000,
      securityType: 'preferred',
      liquidationPreference: 1.0,
      participationRights: 'non_participating',
      dividendRate: 0.08,
      antidilutionProtection: 'weighted_average_narrow',
      proRataRights: true,
      boardSeats: 1,
      leadInvestor: 'New Investor',
      keyInvestors: ['New Investor']
    };

    setInputs(prev => ({
      ...prev,
      financingRounds: [...prev.financingRounds, newRound]
    }));
  };

  const removeRound = (roundId: string) => {
    setInputs(prev => ({
      ...prev,
      financingRounds: prev.financingRounds.filter(round => round.roundId !== roundId)
    }));
  };

  const updateRound = (roundId: string, field: string, value: any) => {
    setInputs(prev => ({
      ...prev,
      financingRounds: prev.financingRounds.map(round =>
        round.roundId === roundId ? { ...round, [field]: value } : round
      )
    }));
  };

  const formatCurrency = (amount: number) => {
    return `$${(amount / 1000000).toFixed(1)}M`;
  };

  const formatPercentage = (value: number) => {
    return `${(value * 100).toFixed(1)}%`;
  };

  const getRoundTypeColor = (type: string) => {
    const colors = {
      seed: 'bg-green-100 text-green-800',
      series_a: 'bg-blue-100 text-blue-800',
      series_b: 'bg-purple-100 text-purple-800',
      series_c: 'bg-orange-100 text-orange-800',
      series_d: 'bg-red-100 text-red-800',
      bridge: 'bg-yellow-100 text-yellow-800',
      growth: 'bg-gray-100 text-gray-800'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-50 rounded-lg">
              <Timeline className="h-5 w-5 text-indigo-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Multi-Round Pricing Analysis</h3>
              <p className="text-sm text-gray-500">Complex equity structures & dilution modeling</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={mode === 'autonomous' ? 'default' : 'secondary'}>
              {mode === 'autonomous' && <Zap className="h-3 w-3 mr-1" />}
              {mode.charAt(0).toUpperCase() + mode.slice(1)} Mode
            </Badge>
            <Button onClick={calculateMultiRoundPricing} disabled={isCalculating} size="sm">
              {isCalculating ? 'Analyzing...' : 'Calculate'}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          {[
            { key: 'rounds', label: 'Financing Rounds', icon: Timeline },
            { key: 'financials', label: 'Company Metrics', icon: BarChart3 },
            { key: 'analysis', label: 'Valuation Analysis', icon: Calculator },
            { key: 'scenarios', label: 'Scenarios & Returns', icon: TrendingUp }
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key as any)}
              className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === key
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </div>

        {/* Financing Rounds Tab */}
        {activeTab === 'rounds' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-medium text-gray-900">Financing History</h4>
              <Button onClick={addRound} size="sm" variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Add Round
              </Button>
            </div>

            <div className="space-y-4">
              {inputs.financingRounds.map((round, index) => (
                <div key={round.roundId} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <h5 className="font-medium text-gray-900">{round.roundName}</h5>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getRoundTypeColor(round.roundType)}`}>
                        {round.roundType.replace('_', ' ').toUpperCase()}
                      </span>
                      <Badge variant="outline">{round.leadInvestor}</Badge>
                    </div>
                    {inputs.financingRounds.length > 1 && (
                      <Button 
                        onClick={() => removeRound(round.roundId)}
                        size="sm"
                        variant="ghost"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Round Name</label>
                      <Input 
                        value={round.roundName}
                        onChange={(e) => updateRound(round.roundId, 'roundName', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Round Type</label>
                      <select 
                        value={round.roundType}
                        onChange={(e) => updateRound(round.roundId, 'roundType', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                      >
                        <option value="seed">Seed</option>
                        <option value="series_a">Series A</option>
                        <option value="series_b">Series B</option>
                        <option value="series_c">Series C</option>
                        <option value="series_d">Series D</option>
                        <option value="bridge">Bridge</option>
                        <option value="growth">Growth</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Round Date</label>
                      <Input 
                        type="date"
                        value={round.roundDate.toISOString().split('T')[0]}
                        onChange={(e) => updateRound(round.roundId, 'roundDate', new Date(e.target.value))}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Lead Investor</label>
                      <Input 
                        value={round.leadInvestor}
                        onChange={(e) => updateRound(round.roundId, 'leadInvestor', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Pre-Money ($M)</label>
                      <Input 
                        type="number"
                        value={round.preMoneyValuation / 1000000}
                        onChange={(e) => {
                          const preMoneyValuation = parseFloat(e.target.value) * 1000000;
                          updateRound(round.roundId, 'preMoneyValuation', preMoneyValuation);
                          updateRound(round.roundId, 'postMoneyValuation', preMoneyValuation + round.investmentAmount);
                        }}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Investment ($M)</label>
                      <Input 
                        type="number"
                        value={round.investmentAmount / 1000000}
                        onChange={(e) => {
                          const investmentAmount = parseFloat(e.target.value) * 1000000;
                          updateRound(round.roundId, 'investmentAmount', investmentAmount);
                          updateRound(round.roundId, 'postMoneyValuation', round.preMoneyValuation + investmentAmount);
                        }}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Post-Money ($M)</label>
                      <Input 
                        type="number"
                        value={round.postMoneyValuation / 1000000}
                        disabled
                        className="bg-gray-50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Board Seats</label>
                      <Input 
                        type="number"
                        value={round.boardSeats}
                        onChange={(e) => updateRound(round.roundId, 'boardSeats', parseInt(e.target.value))}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Security Type</label>
                      <select 
                        value={round.securityType}
                        onChange={(e) => updateRound(round.roundId, 'securityType', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                      >
                        <option value="preferred">Preferred Stock</option>
                        <option value="common">Common Stock</option>
                        <option value="convertible_note">Convertible Note</option>
                        <option value="safe">SAFE</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Liquidation Pref</label>
                      <Input 
                        type="number"
                        step="0.1"
                        value={round.liquidationPreference}
                        onChange={(e) => updateRound(round.roundId, 'liquidationPreference', parseFloat(e.target.value))}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Participation</label>
                      <select 
                        value={round.participationRights}
                        onChange={(e) => updateRound(round.roundId, 'participationRights', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                      >
                        <option value="non_participating">Non-Participating</option>
                        <option value="participating">Participating</option>
                        <option value="capped_participating">Capped Participating</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Anti-Dilution</label>
                      <select 
                        value={round.antidilutionProtection}
                        onChange={(e) => updateRound(round.roundId, 'antidilutionProtection', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                      >
                        <option value="none">None</option>
                        <option value="weighted_average_broad">Weighted Average (Broad)</option>
                        <option value="weighted_average_narrow">Weighted Average (Narrow)</option>
                        <option value="full_ratchet">Full Ratchet</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Company Financials Tab */}
        {activeTab === 'financials' && (
          <div className="space-y-6">
            {/* Company Information */}
            <div className="border rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-4">Company Information</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                  <Input 
                    value={inputs.dealInfo.companyName}
                    onChange={(e) => setInputs(prev => ({
                      ...prev,
                      dealInfo: { ...prev.dealInfo, companyName: e.target.value }
                    }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sector</label>
                  <select 
                    value={inputs.dealInfo.sector}
                    onChange={(e) => setInputs(prev => ({
                      ...prev,
                      dealInfo: { ...prev.dealInfo, sector: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  >
                    <option value="Enterprise Software">Enterprise Software</option>
                    <option value="Consumer Tech">Consumer Tech</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Fintech">Fintech</option>
                    <option value="E-commerce">E-commerce</option>
                    <option value="Biotech">Biotech</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stage</label>
                  <select 
                    value={inputs.dealInfo.stage}
                    onChange={(e) => setInputs(prev => ({
                      ...prev,
                      dealInfo: { ...prev.dealInfo, stage: e.target.value as any }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  >
                    <option value="seed">Seed</option>
                    <option value="early">Early Stage</option>
                    <option value="growth">Growth Stage</option>
                    <option value="late">Late Stage</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Financial Metrics */}
            <div className="border rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-4">Current Financial Metrics</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Revenue ($M)</label>
                  <Input 
                    type="number"
                    value={inputs.currentFinancials.revenue / 1000000}
                    onChange={(e) => setInputs(prev => ({
                      ...prev,
                      currentFinancials: {
                        ...prev.currentFinancials,
                        revenue: parseFloat(e.target.value) * 1000000
                      }
                    }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ARR ($M)</label>
                  <Input 
                    type="number"
                    value={inputs.currentFinancials.arrrr / 1000000}
                    onChange={(e) => setInputs(prev => ({
                      ...prev,
                      currentFinancials: {
                        ...prev.currentFinancials,
                        arrrr: parseFloat(e.target.value) * 1000000
                      }
                    }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Growth Rate</label>
                  <Input 
                    type="number"
                    step="0.1"
                    value={inputs.currentFinancials.revenueGrowthRate}
                    onChange={(e) => setInputs(prev => ({
                      ...prev,
                      currentFinancials: {
                        ...prev.currentFinancials,
                        revenueGrowthRate: parseFloat(e.target.value)
                      }
                    }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gross Margin (%)</label>
                  <Input 
                    type="number"
                    step="1"
                    value={inputs.currentFinancials.grossMargin * 100}
                    onChange={(e) => setInputs(prev => ({
                      ...prev,
                      currentFinancials: {
                        ...prev.currentFinancials,
                        grossMargin: parseFloat(e.target.value) / 100
                      }
                    }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">EBITDA Margin (%)</label>
                  <Input 
                    type="number"
                    step="1"
                    value={inputs.currentFinancials.ebitdaMargin * 100}
                    onChange={(e) => setInputs(prev => ({
                      ...prev,
                      currentFinancials: {
                        ...prev.currentFinancials,
                        ebitdaMargin: parseFloat(e.target.value) / 100
                      }
                    }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Burn ($K)</label>
                  <Input 
                    type="number"
                    value={inputs.currentFinancials.burnRate / 1000}
                    onChange={(e) => setInputs(prev => ({
                      ...prev,
                      currentFinancials: {
                        ...prev.currentFinancials,
                        burnRate: parseFloat(e.target.value) * 1000
                      }
                    }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cash Balance ($M)</label>
                  <Input 
                    type="number"
                    value={inputs.currentFinancials.cashBalance / 1000000}
                    onChange={(e) => setInputs(prev => ({
                      ...prev,
                      currentFinancials: {
                        ...prev.currentFinancials,
                        cashBalance: parseFloat(e.target.value) * 1000000
                      }
                    }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Employees</label>
                  <Input 
                    type="number"
                    value={inputs.currentFinancials.employeeCount}
                    onChange={(e) => setInputs(prev => ({
                      ...prev,
                      currentFinancials: {
                        ...prev.currentFinancials,
                        employeeCount: parseInt(e.target.value)
                      }
                    }))}
                  />
                </div>
              </div>
            </div>

            {/* Market Context */}
            <div className="border rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-4">Market Context</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sector Median Multiple</label>
                  <Input 
                    type="number"
                    step="0.1"
                    value={inputs.marketComparables.sectorMedianMultiple}
                    onChange={(e) => setInputs(prev => ({
                      ...prev,
                      marketComparables: {
                        ...prev.marketComparables,
                        sectorMedianMultiple: parseFloat(e.target.value)
                      }
                    }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sector Growth Rate</label>
                  <Input 
                    type="number"
                    step="0.1"
                    value={inputs.marketComparables.sectorMedianGrowthRate}
                    onChange={(e) => setInputs(prev => ({
                      ...prev,
                      marketComparables: {
                        ...prev.marketComparables,
                        sectorMedianGrowthRate: parseFloat(e.target.value)
                      }
                    }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Market Sentiment</label>
                  <select 
                    value={inputs.marketComparables.marketSentiment}
                    onChange={(e) => setInputs(prev => ({
                      ...prev,
                      marketComparables: {
                        ...prev.marketComparables,
                        marketSentiment: e.target.value as any
                      }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  >
                    <option value="negative">Negative</option>
                    <option value="neutral">Neutral</option>
                    <option value="positive">Positive</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Valuation Analysis Tab */}
        {activeTab === 'analysis' && results && (
          <div className="space-y-6">
            {/* Valuation Evolution */}
            <div className="border rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-4">Valuation Evolution</h4>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-lg font-bold text-blue-600">{formatCurrency(results.valuationEvolution.currentValuation)}</div>
                  <div className="text-sm text-gray-600">Current Valuation</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-lg font-bold text-green-600">{formatCurrency(results.valuationEvolution.latestRoundValuation)}</div>
                  <div className="text-sm text-gray-600">Latest Round</div>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <div className="text-lg font-bold text-purple-600">{formatPercentage(results.valuationEvolution.valuationUplift)}</div>
                  <div className="text-sm text-gray-600">Valuation Uplift</div>
                </div>
                <div className="text-center p-3 bg-orange-50 rounded-lg">
                  <div className="text-lg font-bold text-orange-600">{formatCurrency(results.valuationEvolution.nextRoundProjection.projectedPreMoney)}</div>
                  <div className="text-sm text-gray-600">Next Round Est.</div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Date</th>
                      <th className="text-right py-2">Pre-Money</th>
                      <th className="text-right py-2">Investment</th>
                      <th className="text-right py-2">Post-Money</th>
                      <th className="text-right py-2">Uplift</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.valuationEvolution.valuationHistory.map((history, index) => (
                      <tr key={index} className="border-b">
                        <td className="py-2">{history.date.toLocaleDateString()}</td>
                        <td className="text-right py-2">{formatCurrency(history.preMoneyValuation)}</td>
                        <td className="text-right py-2">{formatCurrency(history.investmentAmount)}</td>
                        <td className="text-right py-2 font-medium">{formatCurrency(history.postMoneyValuation)}</td>
                        <td className="text-right py-2">
                          {index > 0 && (
                            <span className="text-green-600">
                              {formatPercentage((history.preMoneyValuation - results.valuationEvolution.valuationHistory[index-1].postMoneyValuation) / results.valuationEvolution.valuationHistory[index-1].postMoneyValuation)}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Ownership Analysis */}
            <div className="border rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-4">Ownership & Dilution Analysis</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h5 className="font-medium text-gray-700 mb-3">Current Ownership</h5>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Founders</span>
                      <span className="font-medium">{formatPercentage(results.ownershipAnalysis.foundersOwnership.currentOwnership)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Investors</span>
                      <span className="font-medium">{formatPercentage(results.ownershipAnalysis.investorOwnership.totalInvestorOwnership)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Employee Pool</span>
                      <span className="font-medium">{formatPercentage(results.ownershipAnalysis.employeeOptionPool.currentPool)}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h5 className="font-medium text-gray-700 mb-3">Dilution Impact</h5>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Total Dilution</span>
                      <span className="font-medium text-red-600">{formatPercentage(results.ownershipAnalysis.foundersOwnership.dilutionFromRounds)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Fully Diluted</span>
                      <span className="font-medium">{formatPercentage(results.ownershipAnalysis.foundersOwnership.fullyDilutedOwnership)}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h5 className="font-medium text-gray-700 mb-3">Investor Breakdown</h5>
                  <div className="space-y-2">
                    {results.ownershipAnalysis.investorOwnership.ownershipByInvestor.map((investor, index) => (
                      <div key={index} className="flex justify-between">
                        <span className="text-sm text-gray-600">{investor.investor}</span>
                        <span className="font-medium">{formatPercentage(investor.ownership)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Market Analysis */}
            <div className="border rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-4">Market Analysis</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-lg font-bold text-gray-900">{results.marketAnalysis.comparableValuation.revenueMultiple.toFixed(1)}x</div>
                  <div className="text-sm text-gray-600">Revenue Multiple</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-gray-900">{results.marketAnalysis.comparableValuation.arrMultiple.toFixed(1)}x</div>
                  <div className="text-sm text-gray-600">ARR Multiple</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-gray-900">{results.marketAnalysis.growthMetrics.efficiencyScore.toFixed(1)}</div>
                  <div className="text-sm text-gray-600">Efficiency Score</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-gray-900">{results.marketAnalysis.growthMetrics.cashRunway.toFixed(1)}</div>
                  <div className="text-sm text-gray-600">Cash Runway (Mo)</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Scenarios & Returns Tab */}
        {activeTab === 'scenarios' && results && (
          <div className="space-y-6">
            {/* Exit Scenarios */}
            <div className="border rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-4">Exit Scenarios & Returns</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {results.liquidationAnalysis.scenarioReturns.map((scenario, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <h5 className={`font-medium mb-3 ${
                      scenario.scenario === 'Base Case' ? 'text-blue-600' :
                      scenario.scenario === 'Conservative' ? 'text-red-600' : 'text-green-600'
                    }`}>{scenario.scenario}</h5>
                    
                    <div className="space-y-3 mb-4">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Exit Value:</span>
                        <span className="font-medium">{formatCurrency(scenario.exitValue)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Founder Returns:</span>
                        <span className="font-medium">{formatCurrency(scenario.founderReturns)}</span>
                      </div>
                    </div>

                    <div>
                      <h6 className="text-sm font-medium text-gray-700 mb-2">Investor Returns</h6>
                      <div className="space-y-1">
                        {scenario.investorReturns.slice(0, 3).map((investor, idx) => (
                          <div key={idx} className="flex justify-between text-xs">
                            <span className="text-gray-600">{investor.investor}:</span>
                            <span className="font-medium">{investor.multiple.toFixed(1)}x</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sensitivity Analysis */}
            <div className="border rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-4">Sensitivity Analysis</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-medium text-gray-700 mb-3">Exit Multiple Sensitivity</h5>
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2">Exit Multiple</th>
                          <th className="text-right py-2">Investor Returns</th>
                          <th className="text-right py-2">Founder Value</th>
                        </tr>
                      </thead>
                      <tbody>
                        {results.sensitivities.exitMultipleSensitivity.map((sensitivity, index) => (
                          <tr key={index} className="border-b">
                            <td className="py-2">{sensitivity.exitMultiple}x</td>
                            <td className="text-right py-2">{sensitivity.investorReturns.toFixed(1)}x</td>
                            <td className="text-right py-2">{formatCurrency(sensitivity.founderValue)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div>
                  <h5 className="font-medium text-gray-700 mb-3">Growth Rate Sensitivity</h5>
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2">Growth Rate</th>
                          <th className="text-right py-2">Valuation Impact</th>
                        </tr>
                      </thead>
                      <tbody>
                        {results.sensitivities.growthRateSensitivity.map((sensitivity, index) => (
                          <tr key={index} className="border-b">
                            <td className="py-2">{formatPercentage(sensitivity.growthRate - 1)}</td>
                            <td className="text-right py-2">{formatCurrency(sensitivity.valuation)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            {/* Risk Assessment */}
            <div className="border rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-4">Risk Assessment & Recommendations</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-medium text-gray-700 mb-3">Key Risk Factors</h5>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Dilution Risk</span>
                      <Badge variant={results.riskAssessment.dilutionRisk.riskLevel === 'low' ? 'default' : 'secondary'}>
                        {results.riskAssessment.dilutionRisk.riskLevel}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Liquidity Risk</span>
                      <Badge variant={results.riskAssessment.liquidityRisk.riskLevel === 'low' ? 'default' : 'secondary'}>
                        {results.riskAssessment.liquidityRisk.riskLevel}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Market Risk</span>
                      <Badge variant="secondary">
                        {results.riskAssessment.marketRisk.sectorVolatility}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div>
                  <h5 className="font-medium text-gray-700 mb-3">Recommendations</h5>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {results.riskAssessment.recommendations.map((rec, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Target className="h-3 w-3 text-blue-500 mt-0.5 flex-shrink-0" />
                        {rec}
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
              <div className="text-center p-4 bg-indigo-50 rounded-lg">
                <div className="text-2xl font-bold text-indigo-600">{formatCurrency(results.valuationEvolution.currentValuation)}</div>
                <div className="text-sm text-gray-600">Current Valuation</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{inputs.financingRounds.length}</div>
                <div className="text-sm text-gray-600">Financing Rounds</div>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">{formatPercentage(results.ownershipAnalysis.foundersOwnership.dilutionFromRounds)}</div>
                <div className="text-sm text-gray-600">Total Dilution</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{results.marketAnalysis.comparableValuation.arrMultiple.toFixed(1)}x</div>
                <div className="text-sm text-gray-600">ARR Multiple</div>
              </div>
            </div>
          </div>
        )}

        {/* AI Assistance (for assisted/autonomous modes) */}
        {mode !== 'traditional' && (
          <div className="border rounded-lg p-4 bg-indigo-50">
            <div className="flex items-start gap-3">
              <Zap className="h-5 w-5 text-indigo-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-indigo-900">AI Multi-Round Insights</h4>
                <ul className="text-sm text-indigo-800 mt-2 space-y-1">
                  <li>• Strong valuation progression shows 880% growth from seed to Series B</li>
                  <li>• Founder dilution at 42% is within typical range for growth-stage companies</li>
                  <li>• Anti-dilution provisions well-structured across rounds</li>
                  <li>• Consider participation rights optimization in next round</li>
                  {mode === 'autonomous' && (
                    <li>• <strong>Auto-recommendation:</strong> Structure next round with 1.5x participating preferred at $125M pre-money</li>
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

export default MultiRoundPricingCard;