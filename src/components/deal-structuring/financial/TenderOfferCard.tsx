import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Gavel, 
  TrendingUp, 
  Calculator, 
  DollarSign, 
  Trash2, 
  Plus, 
  AlertCircle, 
  BarChart3,
  Users,
  Building2,
  Target,
  Clock,
  CheckCircle2,
  XCircle
} from 'lucide-react';

interface TenderOfferStructure {
  offerId: string;
  offerName: string;
  description: string;
  offerTerms: {
    offerType: 'fixed_price' | 'auction' | 'formula_based' | 'dutch_auction' | 'modified_dutch';
    pricingMechanism: 'nav_discount' | 'nav_premium' | 'market_multiple' | 'irr_target' | 'distribution_yield';
    offerPrice: number;
    formulaParameters: {
      navDiscount: number;
      targetIrr: number;
    };
    minimumTenderAmount: number;
    maximumTenderAmount: number;
    minimumTenderPercentage: number;
    maximumTenderPercentage: number;
    proRationMechanism: string;
    offerPeriod: number;
    settlementPeriod: number;
    withdrawalRights: boolean;
  };
  financing: {
    financingSource: string;
    financingAmount: number;
    financingCommitted: boolean;
    financingGuarantees: {
      bankGuarantee?: {
        bankName: string;
        guaranteeAmount: number;
        rating: string;
      };
    };
    regulatoryApprovals: {
      antitrustRequired: boolean;
      foreignInvestmentRequired: boolean;
    };
  };
}

interface ParticipantProfile {
  participantId: string;
  participantName: string;
  participantType: 'institutional' | 'endowment' | 'pension' | 'sovereign_wealth' | 'family_office' | 'individual';
  investmentProfile: {
    commitmentAmount: number;
    currentInterestValue: number;
    percentageOfFund: number;
    vintageYear: number;
    averageHoldingPeriod: number;
    historicalReturns: {
      irr: number;
      multiple: number;
      dpi: number;
      rvpi: number;
    };
    currentPosition: {
      unrealizedValue: number;
      distributionsReceived: number;
      remainingCommitment: number;
      percentageFunded: number;
    };
  };
  liquidityProfile: {
    liquidityNeed: 'immediate' | 'short_term' | 'medium_term' | 'long_term' | 'permanent';
    cashFlow: {
      expectedInflows: number;
      expectedOutflows: number;
      netCashFlow: number;
      liquidityBuffer: number;
    };
    secondaryActivity: {
      historicalSales: number;
      averageDiscount: number;
      preferredMinimumSize: number;
      maximumConcentration: number;
    };
    liquidityConstraints: {
      boardRestrictions?: boolean;
      investmentCommitteeApproval: boolean;
      minimumHoldingPeriod?: number;
    };
  };
  economicIncentives: {
    costBasis: number;
    unrealizedGainLoss: number;
    taxJurisdiction: 'us_taxable' | 'us_exempt' | 'non_us' | 'offshore';
    taxImplications: {
      ordinaryIncomeRate: number;
      capitalGainsRate: number;
      carriedInterestTreatment: boolean;
      ubtiConcerns?: boolean;
    };
    alternativeOpportunities: {
      reinvestmentRate: number;
      opportunityCost: number;
      liquidityValue: number;
      portfolioRebalancingNeeds: number;
    };
    strategicFactors: {
      managerRelationshipValue: number;
      futureAccessValue: number;
      portfolioConcentrationConcerns: boolean;
      benchmarkTrackingConsiderations: boolean;
    };
  };
  decisionMaking: {
    decisionTimeframe: number;
    internalApprovalRequired: boolean;
    externalAdvisorInvolved: boolean;
    boardApprovalRequired: boolean;
    decisionCriteria: {
      minimumDiscountRequired: number;
      maximumPremiumAcceptable: number;
      irrHurdle: number;
      liquidityPremiumRequired: number;
      qualitativeFactors: {
        managerQuality: number;
        portfolioFit: number;
        timingConsiderations: number;
        marketConditions: number;
      };
    };
    historicalBehavior: {
      participationRateInTenders: number;
      averageParticipationAmount: number;
      priceElasticity: number;
      speedOfDecision: number;
      behavioralPatterns: {
        earlyParticipator: boolean;
        priceNegotiator: boolean;
        fullSalePreference: boolean;
        partialSaleWillingness: number;
      };
    };
  };
}

interface TenderOfferInputs {
  fundInfo: {
    fundId: string;
    fundName: string;
    fundSize: number;
    vintage: number;
    currentNav: number;
    navDate: Date;
    fundCharacteristics: {
      strategy: string;
      geography: string[];
      industry: string[];
      stage: string[];
      numberOfAssets: number;
      portfolioCompany: string[];
    };
    performanceMetrics: {
      grossIrr: number;
      netIrr: number;
      grossMultiple: number;
      netMultiple: number;
      dpi: number;
      rvpi: number;
      tvpi: number;
    };
    distributionHistory: {
      totalDistributions: number;
      distributionYield: number;
      lastDistributionDate: Date;
      distributionFrequency: string;
    };
  };
  tenderOfferStructure: TenderOfferStructure;
  participantUniverse: ParticipantProfile[];
  marketConditions: {
    secondaryMarketEnvironment: 'favorable' | 'neutral' | 'challenging';
    liquidityEnvironment: 'abundant' | 'adequate' | 'constrained';
    pricingEnvironment: 'premium' | 'market' | 'discount';
    marketData: {
      averageSecondaryDiscount: number;
      transactionVolume: number;
      averageExecutionTime: number;
      successRate: number;
    };
    competitiveLandscape: {
      activeBuyers: number;
      availableCapital: number;
      competingProcesses: number;
      averagePricing: number;
    };
    economicEnvironment: {
      interestRates: {
        riskFreeRate: number;
        creditSpreads: number;
        privateEquityHurdle: number;
      };
      marketVolatility: {
        publicMarketVolatility: number;
        privateMarketVolatility: number;
        correlationPublicPrivate: number;
      };
      liquidityConditions: {
        bankLending: string;
        capitalMarkets: string;
        exitMarkets: string;
      };
    };
  };
  pricingParameters: {
    minPrice: number;
    maxPrice: number;
    targetPrice: number;
    priceSteps: number;
    pricingConstraints: {
      regulatoryConstraints: boolean;
      fairnessOpinionRequired: boolean;
      independentValuationRequired: boolean;
      boardApprovalRequired: boolean;
    };
    optimizationObjectives: {
      maximizeProceeds: boolean;
      maximizeParticipation: boolean;
      minimizeExecution: boolean;
      balanceObjectives: {
        proceedsWeight: number;
        participationWeight: number;
        executionWeight: number;
      };
    };
  };
  executionConsiderations: {
    timeline: {
      preparationTime: number;
      marketingPeriod: number;
      dueDiligenceTime: number;
      documentationTime: number;
    };
    resourceRequirements: {
      internalResources: number;
      externalAdvisors: {
        investmentBank: boolean;
        legalCounsel: boolean;
        accountants: boolean;
        valuationExperts: boolean;
      };
      costs: {
        bankingFees: number;
        legalFees: number;
        accountingFees: number;
        otherCosts: number;
      };
    };
    riskFactors: {
      executionRisk: string;
      marketRisk: string;
      regulatoryRisk: string;
      reputationalRisk: string;
      specificRisks: Array<{
        risk: string;
        probability: number;
        impact: string;
        mitigation: string;
      }>;
    };
  };
}

interface TenderOfferResults {
  executiveSummary: {
    recommendedStrategy: {
      optimalPricing: number;
      expectedParticipation: number;
      confidenceLevel: string;
      pricingRationale: string[];
    };
    keyMetrics: {
      estimatedProceeds: number;
      executionProbability: number;
      timeToCompletion: number;
      returnMetrics: {
        impliedIrr: number;
        impliedMultiple: number;
        yieldToMaturity: number;
      };
    };
  };
  pricingAnalysis: {
    pricingRecommendations: {
      methodologyResults: Array<{
        methodologyName: string;
        impliedPrice: number;
        weight: number;
        rationale: string;
      }>;
      sensitivityAnalysis: Array<{
        pricePoint: number;
        expectedDemand: number;
        participationRate: number;
        executionProbability: number;
        netProceeds: number;
      }>;
    };
  };
  participationAnalysis: {
    overallParticipation: {
      expectedParticipationRate: number;
      expectedParticipationAmount: number;
      participantCount: number;
      participationByType: Array<{
        participantType: string;
        participationRate: number;
        participationAmount: number;
      }>;
      participationDrivers: Array<{
        driver: string;
        netImpact: number;
      }>;
    };
  };
  proRationScenarios: Array<{
    scenarioName: string;
    scenarioParameters: {
      totalDemand: number;
      availableSupply: number;
      oversubscriptionRatio: number;
    };
    proRationMechanics: {
      allocationStatistics: {
        totalRequested: number;
        totalAllocated: number;
        averageAllocation: number;
      };
    };
    fairnessAnalysis: {
      allocationFairness: string;
      fairnessMetrics: {
        giniCoefficient: number;
        proportionalityScore: number;
      };
    };
  }>;
  executionAnalysis: {
    executionProbability: {
      overallProbability: number;
      successFactors: Array<{
        factor: string;
        currentScore: number;
        importance: number;
        contribution: number;
      }>;
      riskFactors: Array<{
        risk: string;
        probability: number;
        impact: string;
        mitigation: string;
        residualRisk: number;
      }>;
    };
    timelineAnalysis: {
      criticalPath: Array<{
        phase: string;
        duration: number;
        dependencies: string[];
        risks: string[];
      }>;
      totalTimeEstimate: {
        best: number;
        likely: number;
        worst: number;
      };
    };
    resourceRequirements: {
      totalCost: {
        internalCost: number;
        externalCost: number;
        totalCost: number;
        costAsPercentageOfProceeds: number;
      };
    };
  };
  recommendations: {
    strategicRecommendations: Array<{
      recommendation: string;
      priority: string;
      timeline: string;
      expectedOutcome: string;
    }>;
    tacticalRecommendations: Array<{
      recommendation: string;
      owner: string;
      timeline: number;
      dependencies: string[];
    }>;
    decisionFramework: {
      goNoGoAnalysis: {
        recommendation: string;
        confidenceLevel: string;
        goFactors: string[];
        noGoFactors: string[];
      };
    };
  };
}

interface TenderOfferCardProps {
  dealId: string;
  mode?: 'traditional' | 'assisted' | 'autonomous';
  onResultsChange?: (results: TenderOfferResults) => void;
}

const TenderOfferCard: React.FC<TenderOfferCardProps> = ({ 
  dealId, 
  mode = 'traditional',
  onResultsChange 
}) => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<TenderOfferResults | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('structure');
  const [participantDialogOpen, setParticipantDialogOpen] = useState(false);
  const [newParticipant, setNewParticipant] = useState<Partial<ParticipantProfile>>({});

  const [inputs, setInputs] = useState<TenderOfferInputs>({
    fundInfo: {
      fundId: `fund_${dealId}`,
      fundName: 'Alpha Growth Fund II',
      fundSize: 500000000,
      vintage: 2019,
      currentNav: 480000000,
      navDate: new Date(),
      fundCharacteristics: {
        strategy: 'Growth Equity',
        geography: ['North America', 'Europe'],
        industry: ['Technology', 'Healthcare'],
        stage: ['Growth', 'Late Stage'],
        numberOfAssets: 25,
        portfolioCompany: ['TechCorp', 'HealthInnovate', 'FinanceAI']
      },
      performanceMetrics: {
        grossIrr: 0.18,
        netIrr: 0.14,
        grossMultiple: 1.8,
        netMultiple: 1.5,
        dpi: 0.6,
        rvpi: 0.9,
        tvpi: 1.5
      },
      distributionHistory: {
        totalDistributions: 150000000,
        distributionYield: 0.08,
        lastDistributionDate: new Date('2023-12-01'),
        distributionFrequency: 'quarterly'
      }
    },
    tenderOfferStructure: {
      offerId: `tender_${dealId}`,
      offerName: 'Alpha Growth Fund II - Liquidity Offer',
      description: 'Secondary market tender offer providing liquidity to limited partners',
      offerTerms: {
        offerType: 'fixed_price',
        pricingMechanism: 'nav_discount',
        offerPrice: 400000000,
        formulaParameters: {
          navDiscount: 0.15,
          targetIrr: 0.16
        },
        minimumTenderAmount: 10000000,
        maximumTenderAmount: 200000000,
        minimumTenderPercentage: 0.20,
        maximumTenderPercentage: 0.50,
        proRationMechanism: 'pro_rata',
        offerPeriod: 30,
        settlementPeriod: 10,
        withdrawalRights: true
      },
      financing: {
        financingSource: 'sponsor_equity',
        financingAmount: 250000000,
        financingCommitted: true,
        financingGuarantees: {
          bankGuarantee: {
            bankName: 'JPMorgan Chase',
            guaranteeAmount: 250000000,
            rating: 'AA-'
          }
        },
        regulatoryApprovals: {
          antitrustRequired: false,
          foreignInvestmentRequired: false
        }
      }
    },
    participantUniverse: [
      {
        participantId: 'lp_001',
        participantName: 'State Pension Fund',
        participantType: 'pension',
        investmentProfile: {
          commitmentAmount: 50000000,
          currentInterestValue: 48000000,
          percentageOfFund: 0.10,
          vintageYear: 2019,
          averageHoldingPeriod: 8,
          historicalReturns: {
            irr: 0.12,
            multiple: 1.4,
            dpi: 0.5,
            rvpi: 0.9
          },
          currentPosition: {
            unrealizedValue: 30000000,
            distributionsReceived: 18000000,
            remainingCommitment: 5000000,
            percentageFunded: 0.90
          }
        },
        liquidityProfile: {
          liquidityNeed: 'medium_term',
          cashFlow: {
            expectedInflows: 20000000,
            expectedOutflows: 25000000,
            netCashFlow: -5000000,
            liquidityBuffer: 15000000
          },
          secondaryActivity: {
            historicalSales: 100000000,
            averageDiscount: 0.12,
            preferredMinimumSize: 10000000,
            maximumConcentration: 0.05
          },
          liquidityConstraints: {
            boardRestrictions: true,
            investmentCommitteeApproval: true,
            minimumHoldingPeriod: 3
          }
        },
        economicIncentives: {
          costBasis: 45000000,
          unrealizedGainLoss: 3000000,
          taxJurisdiction: 'us_exempt',
          taxImplications: {
            ordinaryIncomeRate: 0,
            capitalGainsRate: 0,
            carriedInterestTreatment: false,
            ubtiConcerns: true
          },
          alternativeOpportunities: {
            reinvestmentRate: 0.08,
            opportunityCost: 0.05,
            liquidityValue: 0.03,
            portfolioRebalancingNeeds: 0.02
          },
          strategicFactors: {
            managerRelationshipValue: 0.02,
            futureAccessValue: 0.03,
            portfolioConcentrationConcerns: false,
            benchmarkTrackingConsiderations: true
          }
        },
        decisionMaking: {
          decisionTimeframe: 21,
          internalApprovalRequired: true,
          externalAdvisorInvolved: true,
          boardApprovalRequired: true,
          decisionCriteria: {
            minimumDiscountRequired: 0.10,
            maximumPremiumAcceptable: 0.05,
            irrHurdle: 0.12,
            liquidityPremiumRequired: 0.02,
            qualitativeFactors: {
              managerQuality: 8,
              portfolioFit: 7,
              timingConsiderations: 6,
              marketConditions: 7
            }
          },
          historicalBehavior: {
            participationRateInTenders: 0.75,
            averageParticipationAmount: 30000000,
            priceElasticity: -1.2,
            speedOfDecision: 18,
            behavioralPatterns: {
              earlyParticipator: true,
              priceNegotiator: false,
              fullSalePreference: false,
              partialSaleWillingness: 0.60
            }
          }
        }
      }
    ],
    marketConditions: {
      secondaryMarketEnvironment: 'neutral',
      liquidityEnvironment: 'adequate',
      pricingEnvironment: 'market',
      marketData: {
        averageSecondaryDiscount: 0.15,
        transactionVolume: 5000000000,
        averageExecutionTime: 45,
        successRate: 0.85
      },
      competitiveLandscape: {
        activeBuyers: 15,
        availableCapital: 10000000000,
        competingProcesses: 3,
        averagePricing: 0.12
      },
      economicEnvironment: {
        interestRates: {
          riskFreeRate: 0.045,
          creditSpreads: 0.02,
          privateEquityHurdle: 0.15
        },
        marketVolatility: {
          publicMarketVolatility: 0.18,
          privateMarketVolatility: 0.12,
          correlationPublicPrivate: 0.65
        },
        liquidityConditions: {
          bankLending: 'moderate',
          capitalMarkets: 'selective',
          exitMarkets: 'moderate'
        }
      }
    },
    pricingParameters: {
      minPrice: 350000000,
      maxPrice: 450000000,
      targetPrice: 400000000,
      priceSteps: 20,
      pricingConstraints: {
        regulatoryConstraints: false,
        fairnessOpinionRequired: true,
        independentValuationRequired: true,
        boardApprovalRequired: true
      },
      optimizationObjectives: {
        maximizeProceeds: false,
        maximizeParticipation: true,
        minimizeExecution: false,
        balanceObjectives: {
          proceedsWeight: 0.3,
          participationWeight: 0.5,
          executionWeight: 0.2
        }
      }
    },
    executionConsiderations: {
      timeline: {
        preparationTime: 20,
        marketingPeriod: 30,
        dueDiligenceTime: 15,
        documentationTime: 10
      },
      resourceRequirements: {
        internalResources: 150,
        externalAdvisors: {
          investmentBank: true,
          legalCounsel: true,
          accountants: true,
          valuationExperts: true
        },
        costs: {
          bankingFees: 2000000,
          legalFees: 500000,
          accountingFees: 200000,
          otherCosts: 300000
        }
      },
      riskFactors: {
        executionRisk: 'medium',
        marketRisk: 'medium',
        regulatoryRisk: 'low',
        reputationalRisk: 'low',
        specificRisks: [
          { risk: 'Market volatility', probability: 0.3, impact: 'medium', mitigation: 'Flexible pricing structure' },
          { risk: 'Participant uncertainty', probability: 0.2, impact: 'medium', mitigation: 'Comprehensive education process' }
        ]
      }
    }
  });

  const addParticipant = () => {
    if (newParticipant.participantName && newParticipant.participantType) {
      const participant: ParticipantProfile = {
        participantId: `lp_${Date.now()}`,
        participantName: newParticipant.participantName,
        participantType: newParticipant.participantType,
        investmentProfile: {
          commitmentAmount: newParticipant.investmentProfile?.commitmentAmount || 10000000,
          currentInterestValue: newParticipant.investmentProfile?.currentInterestValue || 9500000,
          percentageOfFund: 0.02,
          vintageYear: 2019,
          averageHoldingPeriod: 8,
          historicalReturns: {
            irr: 0.12,
            multiple: 1.4,
            dpi: 0.5,
            rvpi: 0.9
          },
          currentPosition: {
            unrealizedValue: 6000000,
            distributionsReceived: 3500000,
            remainingCommitment: 500000,
            percentageFunded: 0.95
          }
        },
        liquidityProfile: {
          liquidityNeed: newParticipant.liquidityProfile?.liquidityNeed || 'medium_term',
          cashFlow: {
            expectedInflows: 5000000,
            expectedOutflows: 6000000,
            netCashFlow: -1000000,
            liquidityBuffer: 3000000
          },
          secondaryActivity: {
            historicalSales: 20000000,
            averageDiscount: 0.12,
            preferredMinimumSize: 5000000,
            maximumConcentration: 0.05
          },
          liquidityConstraints: {
            boardRestrictions: false,
            investmentCommitteeApproval: true
          }
        },
        economicIncentives: {
          costBasis: 9000000,
          unrealizedGainLoss: 500000,
          taxJurisdiction: 'us_taxable',
          taxImplications: {
            ordinaryIncomeRate: 0.37,
            capitalGainsRate: 0.20,
            carriedInterestTreatment: false
          },
          alternativeOpportunities: {
            reinvestmentRate: 0.08,
            opportunityCost: 0.05,
            liquidityValue: 0.03,
            portfolioRebalancingNeeds: 0.02
          },
          strategicFactors: {
            managerRelationshipValue: 0.02,
            futureAccessValue: 0.03,
            portfolioConcentrationConcerns: false,
            benchmarkTrackingConsiderations: true
          }
        },
        decisionMaking: {
          decisionTimeframe: 14,
          internalApprovalRequired: true,
          externalAdvisorInvolved: false,
          boardApprovalRequired: false,
          decisionCriteria: {
            minimumDiscountRequired: 0.08,
            maximumPremiumAcceptable: 0.05,
            irrHurdle: 0.10,
            liquidityPremiumRequired: 0.02,
            qualitativeFactors: {
              managerQuality: 7,
              portfolioFit: 8,
              timingConsiderations: 6,
              marketConditions: 7
            }
          },
          historicalBehavior: {
            participationRateInTenders: 0.60,
            averageParticipationAmount: 8000000,
            priceElasticity: -1.0,
            speedOfDecision: 12,
            behavioralPatterns: {
              earlyParticipator: false,
              priceNegotiator: true,
              fullSalePreference: true,
              partialSaleWillingness: 0.80
            }
          }
        }
      };

      setInputs(prev => ({
        ...prev,
        participantUniverse: [...prev.participantUniverse, participant]
      }));

      setNewParticipant({});
      setParticipantDialogOpen(false);
    }
  };

  const removeParticipant = (participantId: string) => {
    setInputs(prev => ({
      ...prev,
      participantUniverse: prev.participantUniverse.filter(p => p.participantId !== participantId)
    }));
  };

  const runAnalysis = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/deal-structuring/models/tender-offer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          dealId,
          inputs,
          mode
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to run tender offer analysis');
      }

      const data = await response.json();
      setResults(data.results);
      
      if (onResultsChange) {
        onResultsChange(data.results);
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  const getLiquidityColor = (need: string) => {
    const colors = {
      immediate: 'bg-red-100 text-red-800',
      short_term: 'bg-orange-100 text-orange-800',
      medium_term: 'bg-blue-100 text-blue-800',
      long_term: 'bg-green-100 text-green-800',
      permanent: 'bg-gray-100 text-gray-800'
    };
    return colors[need as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'high': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Gavel className="h-5 w-5 text-blue-600" />
            <div>
              <CardTitle>Tender Offer Valuation</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Comprehensive analysis for secondary market tender offer transactions
              </p>
            </div>
          </div>
          {mode !== 'traditional' && (
            <Badge variant="outline" className="ml-2">
              {mode === 'assisted' ? 'AI-Assisted' : 'Autonomous'}
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="structure">Offer Structure</TabsTrigger>
            <TabsTrigger value="participants">Participants</TabsTrigger>
            <TabsTrigger value="pricing">Pricing Strategy</TabsTrigger>
            <TabsTrigger value="results">Results</TabsTrigger>
          </TabsList>

          <TabsContent value="structure" className="space-y-4">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Fund Information</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="fund-name">Fund Name</Label>
                    <Input
                      id="fund-name"
                      value={inputs.fundInfo.fundName}
                      onChange={(e) => setInputs(prev => ({
                        ...prev,
                        fundInfo: { ...prev.fundInfo, fundName: e.target.value }
                      }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="fund-size">Fund Size ($M)</Label>
                    <Input
                      id="fund-size"
                      type="number"
                      value={inputs.fundInfo.fundSize / 1000000}
                      onChange={(e) => setInputs(prev => ({
                        ...prev,
                        fundInfo: { ...prev.fundInfo, fundSize: Number(e.target.value) * 1000000 }
                      }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="current-nav">Current NAV ($M)</Label>
                    <Input
                      id="current-nav"
                      type="number"
                      value={inputs.fundInfo.currentNav / 1000000}
                      onChange={(e) => setInputs(prev => ({
                        ...prev,
                        fundInfo: { ...prev.fundInfo, currentNav: Number(e.target.value) * 1000000 }
                      }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="vintage">Vintage Year</Label>
                    <Input
                      id="vintage"
                      type="number"
                      value={inputs.fundInfo.vintage}
                      onChange={(e) => setInputs(prev => ({
                        ...prev,
                        fundInfo: { ...prev.fundInfo, vintage: Number(e.target.value) }
                      }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="net-irr">Net IRR (%)</Label>
                    <Input
                      id="net-irr"
                      type="number"
                      step="0.1"
                      value={inputs.fundInfo.performanceMetrics.netIrr * 100}
                      onChange={(e) => setInputs(prev => ({
                        ...prev,
                        fundInfo: {
                          ...prev.fundInfo,
                          performanceMetrics: {
                            ...prev.fundInfo.performanceMetrics,
                            netIrr: Number(e.target.value) / 100
                          }
                        }
                      }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="net-multiple">Net Multiple</Label>
                    <Input
                      id="net-multiple"
                      type="number"
                      step="0.1"
                      value={inputs.fundInfo.performanceMetrics.netMultiple}
                      onChange={(e) => setInputs(prev => ({
                        ...prev,
                        fundInfo: {
                          ...prev.fundInfo,
                          performanceMetrics: {
                            ...prev.fundInfo.performanceMetrics,
                            netMultiple: Number(e.target.value)
                          }
                        }
                      }))}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-semibold mb-4">Tender Offer Terms</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="offer-name">Offer Name</Label>
                    <Input
                      id="offer-name"
                      value={inputs.tenderOfferStructure.offerName}
                      onChange={(e) => setInputs(prev => ({
                        ...prev,
                        tenderOfferStructure: {
                          ...prev.tenderOfferStructure,
                          offerName: e.target.value
                        }
                      }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="offer-type">Offer Type</Label>
                    <Select
                      value={inputs.tenderOfferStructure.offerTerms.offerType}
                      onValueChange={(value) => setInputs(prev => ({
                        ...prev,
                        tenderOfferStructure: {
                          ...prev.tenderOfferStructure,
                          offerTerms: {
                            ...prev.tenderOfferStructure.offerTerms,
                            offerType: value as any
                          }
                        }
                      }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fixed_price">Fixed Price</SelectItem>
                        <SelectItem value="auction">Auction</SelectItem>
                        <SelectItem value="formula_based">Formula Based</SelectItem>
                        <SelectItem value="dutch_auction">Dutch Auction</SelectItem>
                        <SelectItem value="modified_dutch">Modified Dutch</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="pricing-mechanism">Pricing Mechanism</Label>
                    <Select
                      value={inputs.tenderOfferStructure.offerTerms.pricingMechanism}
                      onValueChange={(value) => setInputs(prev => ({
                        ...prev,
                        tenderOfferStructure: {
                          ...prev.tenderOfferStructure,
                          offerTerms: {
                            ...prev.tenderOfferStructure.offerTerms,
                            pricingMechanism: value as any
                          }
                        }
                      }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="nav_discount">NAV Discount</SelectItem>
                        <SelectItem value="nav_premium">NAV Premium</SelectItem>
                        <SelectItem value="market_multiple">Market Multiple</SelectItem>
                        <SelectItem value="irr_target">IRR Target</SelectItem>
                        <SelectItem value="distribution_yield">Distribution Yield</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="offer-price">Offer Price ($M)</Label>
                    <Input
                      id="offer-price"
                      type="number"
                      value={inputs.tenderOfferStructure.offerTerms.offerPrice / 1000000}
                      onChange={(e) => setInputs(prev => ({
                        ...prev,
                        tenderOfferStructure: {
                          ...prev.tenderOfferStructure,
                          offerTerms: {
                            ...prev.tenderOfferStructure.offerTerms,
                            offerPrice: Number(e.target.value) * 1000000
                          }
                        }
                      }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="nav-discount">NAV Discount (%)</Label>
                    <Input
                      id="nav-discount"
                      type="number"
                      step="0.1"
                      value={inputs.tenderOfferStructure.offerTerms.formulaParameters.navDiscount * 100}
                      onChange={(e) => setInputs(prev => ({
                        ...prev,
                        tenderOfferStructure: {
                          ...prev.tenderOfferStructure,
                          offerTerms: {
                            ...prev.tenderOfferStructure.offerTerms,
                            formulaParameters: {
                              ...prev.tenderOfferStructure.offerTerms.formulaParameters,
                              navDiscount: Number(e.target.value) / 100
                            }
                          }
                        }
                      }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="target-irr">Target IRR (%)</Label>
                    <Input
                      id="target-irr"
                      type="number"
                      step="0.1"
                      value={inputs.tenderOfferStructure.offerTerms.formulaParameters.targetIrr * 100}
                      onChange={(e) => setInputs(prev => ({
                        ...prev,
                        tenderOfferStructure: {
                          ...prev.tenderOfferStructure,
                          offerTerms: {
                            ...prev.tenderOfferStructure.offerTerms,
                            formulaParameters: {
                              ...prev.tenderOfferStructure.offerTerms.formulaParameters,
                              targetIrr: Number(e.target.value) / 100
                            }
                          }
                        }
                      }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="min-tender">Min Tender Amount ($M)</Label>
                    <Input
                      id="min-tender"
                      type="number"
                      value={inputs.tenderOfferStructure.offerTerms.minimumTenderAmount / 1000000}
                      onChange={(e) => setInputs(prev => ({
                        ...prev,
                        tenderOfferStructure: {
                          ...prev.tenderOfferStructure,
                          offerTerms: {
                            ...prev.tenderOfferStructure.offerTerms,
                            minimumTenderAmount: Number(e.target.value) * 1000000
                          }
                        }
                      }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="max-tender">Max Tender Amount ($M)</Label>
                    <Input
                      id="max-tender"
                      type="number"
                      value={inputs.tenderOfferStructure.offerTerms.maximumTenderAmount / 1000000}
                      onChange={(e) => setInputs(prev => ({
                        ...prev,
                        tenderOfferStructure: {
                          ...prev.tenderOfferStructure,
                          offerTerms: {
                            ...prev.tenderOfferStructure.offerTerms,
                            maximumTenderAmount: Number(e.target.value) * 1000000
                          }
                        }
                      }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="offer-period">Offer Period (days)</Label>
                    <Input
                      id="offer-period"
                      type="number"
                      value={inputs.tenderOfferStructure.offerTerms.offerPeriod}
                      onChange={(e) => setInputs(prev => ({
                        ...prev,
                        tenderOfferStructure: {
                          ...prev.tenderOfferStructure,
                          offerTerms: {
                            ...prev.tenderOfferStructure.offerTerms,
                            offerPeriod: Number(e.target.value)
                          }
                        }
                      }))}
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="withdrawal-rights"
                      checked={inputs.tenderOfferStructure.offerTerms.withdrawalRights}
                      onCheckedChange={(checked) => setInputs(prev => ({
                        ...prev,
                        tenderOfferStructure: {
                          ...prev.tenderOfferStructure,
                          offerTerms: {
                            ...prev.tenderOfferStructure.offerTerms,
                            withdrawalRights: checked
                          }
                        }
                      }))}
                    />
                    <Label htmlFor="withdrawal-rights">Allow Withdrawal Rights</Label>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-semibold mb-4">Financing & Guarantees</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="financing-source">Financing Source</Label>
                    <Select
                      value={inputs.tenderOfferStructure.financing.financingSource}
                      onValueChange={(value) => setInputs(prev => ({
                        ...prev,
                        tenderOfferStructure: {
                          ...prev.tenderOfferStructure,
                          financing: {
                            ...prev.tenderOfferStructure.financing,
                            financingSource: value
                          }
                        }
                      }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sponsor_equity">Sponsor Equity</SelectItem>
                        <SelectItem value="debt_financing">Debt Financing</SelectItem>
                        <SelectItem value="hybrid">Hybrid</SelectItem>
                        <SelectItem value="continuation_fund">Continuation Fund</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="financing-amount">Financing Amount ($M)</Label>
                    <Input
                      id="financing-amount"
                      type="number"
                      value={inputs.tenderOfferStructure.financing.financingAmount / 1000000}
                      onChange={(e) => setInputs(prev => ({
                        ...prev,
                        tenderOfferStructure: {
                          ...prev.tenderOfferStructure,
                          financing: {
                            ...prev.tenderOfferStructure.financing,
                            financingAmount: Number(e.target.value) * 1000000
                          }
                        }
                      }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="bank-name">Guarantee Bank</Label>
                    <Input
                      id="bank-name"
                      value={inputs.tenderOfferStructure.financing.financingGuarantees.bankGuarantee?.bankName || ''}
                      onChange={(e) => setInputs(prev => ({
                        ...prev,
                        tenderOfferStructure: {
                          ...prev.tenderOfferStructure,
                          financing: {
                            ...prev.tenderOfferStructure.financing,
                            financingGuarantees: {
                              ...prev.tenderOfferStructure.financing.financingGuarantees,
                              bankGuarantee: {
                                ...prev.tenderOfferStructure.financing.financingGuarantees.bankGuarantee!,
                                bankName: e.target.value
                              }
                            }
                          }
                        }
                      }))}
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="financing-committed"
                      checked={inputs.tenderOfferStructure.financing.financingCommitted}
                      onCheckedChange={(checked) => setInputs(prev => ({
                        ...prev,
                        tenderOfferStructure: {
                          ...prev.tenderOfferStructure,
                          financing: {
                            ...prev.tenderOfferStructure.financing,
                            financingCommitted: checked
                          }
                        }
                      }))}
                    />
                    <Label htmlFor="financing-committed">Financing Committed</Label>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="participants" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Participant Universe</h3>
              <Dialog open={participantDialogOpen} onOpenChange={setParticipantDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Participant
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Add New Participant</DialogTitle>
                  </DialogHeader>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="participant-name">Participant Name</Label>
                      <Input
                        id="participant-name"
                        value={newParticipant.participantName || ''}
                        onChange={(e) => setNewParticipant(prev => ({ ...prev, participantName: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="participant-type">Participant Type</Label>
                      <Select
                        value={newParticipant.participantType || ''}
                        onValueChange={(value) => setNewParticipant(prev => ({ ...prev, participantType: value as any }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="institutional">Institutional</SelectItem>
                          <SelectItem value="endowment">Endowment</SelectItem>
                          <SelectItem value="pension">Pension</SelectItem>
                          <SelectItem value="sovereign_wealth">Sovereign Wealth</SelectItem>
                          <SelectItem value="family_office">Family Office</SelectItem>
                          <SelectItem value="individual">Individual</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="commitment-amount">Commitment Amount ($M)</Label>
                      <Input
                        id="commitment-amount"
                        type="number"
                        value={(newParticipant.investmentProfile?.commitmentAmount || 0) / 1000000}
                        onChange={(e) => setNewParticipant(prev => ({
                          ...prev,
                          investmentProfile: {
                            ...prev.investmentProfile,
                            commitmentAmount: Number(e.target.value) * 1000000
                          }
                        }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="liquidity-need">Liquidity Need</Label>
                      <Select
                        value={newParticipant.liquidityProfile?.liquidityNeed || ''}
                        onValueChange={(value) => setNewParticipant(prev => ({
                          ...prev,
                          liquidityProfile: {
                            ...prev.liquidityProfile,
                            liquidityNeed: value as any
                          }
                        }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="immediate">Immediate</SelectItem>
                          <SelectItem value="short_term">Short Term</SelectItem>
                          <SelectItem value="medium_term">Medium Term</SelectItem>
                          <SelectItem value="long_term">Long Term</SelectItem>
                          <SelectItem value="permanent">Permanent</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2 mt-4">
                    <Button variant="outline" onClick={() => setParticipantDialogOpen(false)}>Cancel</Button>
                    <Button onClick={addParticipant}>Add Participant</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="space-y-4">
              {inputs.participantUniverse.map((participant) => (
                <Card key={participant.participantId} className="border-l-4 border-l-green-500">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{participant.participantName}</h4>
                        <Badge variant="outline">{participant.participantType.replace('_', ' ')}</Badge>
                        <Badge className={getLiquidityColor(participant.liquidityProfile.liquidityNeed)}>
                          {participant.liquidityProfile.liquidityNeed.replace('_', ' ')}
                        </Badge>
                      </div>
                      <Button
                        onClick={() => removeParticipant(participant.participantId)}
                        size="sm"
                        variant="ghost"
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <Label className="text-xs text-muted-foreground">Commitment</Label>
                        <div className="font-medium">${(participant.investmentProfile.commitmentAmount / 1000000).toFixed(1)}M</div>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Current Value</Label>
                        <div className="font-medium">${(participant.investmentProfile.currentInterestValue / 1000000).toFixed(1)}M</div>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Historical IRR</Label>
                        <div className="font-medium">{(participant.investmentProfile.historicalReturns.irr * 100).toFixed(1)}%</div>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Tax Jurisdiction</Label>
                        <div className="font-medium">{participant.economicIncentives.taxJurisdiction.replace('_', ' ')}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Separator />

            <div>
              <h3 className="text-lg font-semibold mb-4">Market Conditions</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="secondary-environment">Secondary Market Environment</Label>
                  <Select
                    value={inputs.marketConditions.secondaryMarketEnvironment}
                    onValueChange={(value) => setInputs(prev => ({
                      ...prev,
                      marketConditions: {
                        ...prev.marketConditions,
                        secondaryMarketEnvironment: value as any
                      }
                    }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="favorable">Favorable</SelectItem>
                      <SelectItem value="neutral">Neutral</SelectItem>
                      <SelectItem value="challenging">Challenging</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="liquidity-environment">Liquidity Environment</Label>
                  <Select
                    value={inputs.marketConditions.liquidityEnvironment}
                    onValueChange={(value) => setInputs(prev => ({
                      ...prev,
                      marketConditions: {
                        ...prev.marketConditions,
                        liquidityEnvironment: value as any
                      }
                    }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="abundant">Abundant</SelectItem>
                      <SelectItem value="adequate">Adequate</SelectItem>
                      <SelectItem value="constrained">Constrained</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="avg-discount">Avg Secondary Discount (%)</Label>
                  <Input
                    id="avg-discount"
                    type="number"
                    step="0.1"
                    value={inputs.marketConditions.marketData.averageSecondaryDiscount * 100}
                    onChange={(e) => setInputs(prev => ({
                      ...prev,
                      marketConditions: {
                        ...prev.marketConditions,
                        marketData: {
                          ...prev.marketConditions.marketData,
                          averageSecondaryDiscount: Number(e.target.value) / 100
                        }
                      }
                    }))}
                  />
                </div>
                <div>
                  <Label htmlFor="success-rate">Success Rate (%)</Label>
                  <Input
                    id="success-rate"
                    type="number"
                    step="0.1"
                    value={inputs.marketConditions.marketData.successRate * 100}
                    onChange={(e) => setInputs(prev => ({
                      ...prev,
                      marketConditions: {
                        ...prev.marketConditions,
                        marketData: {
                          ...prev.marketConditions.marketData,
                          successRate: Number(e.target.value) / 100
                        }
                      }
                    }))}
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="pricing" className="space-y-4">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Pricing Parameters</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="target-price">Target Price ($M)</Label>
                    <Input
                      id="target-price"
                      type="number"
                      value={inputs.pricingParameters.targetPrice / 1000000}
                      onChange={(e) => setInputs(prev => ({
                        ...prev,
                        pricingParameters: {
                          ...prev.pricingParameters,
                          targetPrice: Number(e.target.value) * 1000000
                        }
                      }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="min-price">Min Price ($M)</Label>
                    <Input
                      id="min-price"
                      type="number"
                      value={inputs.pricingParameters.minPrice / 1000000}
                      onChange={(e) => setInputs(prev => ({
                        ...prev,
                        pricingParameters: {
                          ...prev.pricingParameters,
                          minPrice: Number(e.target.value) * 1000000
                        }
                      }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="max-price">Max Price ($M)</Label>
                    <Input
                      id="max-price"
                      type="number"
                      value={inputs.pricingParameters.maxPrice / 1000000}
                      onChange={(e) => setInputs(prev => ({
                        ...prev,
                        pricingParameters: {
                          ...prev.pricingParameters,
                          maxPrice: Number(e.target.value) * 1000000
                        }
                      }))}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-semibold mb-4">Optimization Objectives</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="maximize-proceeds"
                      checked={inputs.pricingParameters.optimizationObjectives.maximizeProceeds}
                      onCheckedChange={(checked) => setInputs(prev => ({
                        ...prev,
                        pricingParameters: {
                          ...prev.pricingParameters,
                          optimizationObjectives: {
                            ...prev.pricingParameters.optimizationObjectives,
                            maximizeProceeds: checked
                          }
                        }
                      }))}
                    />
                    <Label htmlFor="maximize-proceeds">Maximize Proceeds</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="maximize-participation"
                      checked={inputs.pricingParameters.optimizationObjectives.maximizeParticipation}
                      onCheckedChange={(checked) => setInputs(prev => ({
                        ...prev,
                        pricingParameters: {
                          ...prev.pricingParameters,
                          optimizationObjectives: {
                            ...prev.pricingParameters.optimizationObjectives,
                            maximizeParticipation: checked
                          }
                        }
                      }))}
                    />
                    <Label htmlFor="maximize-participation">Maximize Participation</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="minimize-execution"
                      checked={inputs.pricingParameters.optimizationObjectives.minimizeExecution}
                      onCheckedChange={(checked) => setInputs(prev => ({
                        ...prev,
                        pricingParameters: {
                          ...prev.pricingParameters,
                          optimizationObjectives: {
                            ...prev.pricingParameters.optimizationObjectives,
                            minimizeExecution: checked
                          }
                        }
                      }))}
                    />
                    <Label htmlFor="minimize-execution">Minimize Execution Risk</Label>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-semibold mb-4">Execution Considerations</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <Label htmlFor="preparation-time">Preparation Time (days)</Label>
                    <Input
                      id="preparation-time"
                      type="number"
                      value={inputs.executionConsiderations.timeline.preparationTime}
                      onChange={(e) => setInputs(prev => ({
                        ...prev,
                        executionConsiderations: {
                          ...prev.executionConsiderations,
                          timeline: {
                            ...prev.executionConsiderations.timeline,
                            preparationTime: Number(e.target.value)
                          }
                        }
                      }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="marketing-period">Marketing Period (days)</Label>
                    <Input
                      id="marketing-period"
                      type="number"
                      value={inputs.executionConsiderations.timeline.marketingPeriod}
                      onChange={(e) => setInputs(prev => ({
                        ...prev,
                        executionConsiderations: {
                          ...prev.executionConsiderations,
                          timeline: {
                            ...prev.executionConsiderations.timeline,
                            marketingPeriod: Number(e.target.value)
                          }
                        }
                      }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="banking-fees">Banking Fees ($M)</Label>
                    <Input
                      id="banking-fees"
                      type="number"
                      step="0.1"
                      value={inputs.executionConsiderations.resourceRequirements.costs.bankingFees / 1000000}
                      onChange={(e) => setInputs(prev => ({
                        ...prev,
                        executionConsiderations: {
                          ...prev.executionConsiderations,
                          resourceRequirements: {
                            ...prev.executionConsiderations.resourceRequirements,
                            costs: {
                              ...prev.executionConsiderations.resourceRequirements.costs,
                              bankingFees: Number(e.target.value) * 1000000
                            }
                          }
                        }
                      }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="legal-fees">Legal Fees ($M)</Label>
                    <Input
                      id="legal-fees"
                      type="number"
                      step="0.1"
                      value={inputs.executionConsiderations.resourceRequirements.costs.legalFees / 1000000}
                      onChange={(e) => setInputs(prev => ({
                        ...prev,
                        executionConsiderations: {
                          ...prev.executionConsiderations,
                          resourceRequirements: {
                            ...prev.executionConsiderations.resourceRequirements,
                            costs: {
                              ...prev.executionConsiderations.resourceRequirements.costs,
                              legalFees: Number(e.target.value) * 1000000
                            }
                          }
                        }
                      }))}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button 
                onClick={runAnalysis} 
                disabled={loading}
                className="min-w-[150px]"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Calculator className="h-4 w-4 mr-2" />
                    Run Analysis
                  </>
                )}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="results" className="space-y-4">
            {error && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {results ? (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5" />
                      Executive Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">
                          ${(results.executiveSummary.recommendedStrategy.optimalPricing / 1000000).toFixed(0)}M
                        </div>
                        <div className="text-sm text-muted-foreground">Recommended Price</div>
                        <div className="text-xs text-muted-foreground">
                          {((1 - results.executiveSummary.recommendedStrategy.optimalPricing / inputs.fundInfo.currentNav) * 100).toFixed(1)}% discount to NAV
                        </div>
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">
                          {(results.executiveSummary.recommendedStrategy.expectedParticipation * 100).toFixed(1)}%
                        </div>
                        <div className="text-sm text-muted-foreground">Expected Participation</div>
                        <Badge variant="outline" className="mt-1">
                          {results.executiveSummary.recommendedStrategy.confidenceLevel}
                        </Badge>
                      </div>
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">
                          ${(results.executiveSummary.keyMetrics.estimatedProceeds / 1000000).toFixed(0)}M
                        </div>
                        <div className="text-sm text-muted-foreground">Estimated Proceeds</div>
                      </div>
                      <div className="text-center p-4 bg-orange-50 rounded-lg">
                        <div className="text-2xl font-bold text-orange-600">
                          {(results.executiveSummary.keyMetrics.executionProbability * 100).toFixed(0)}%
                        </div>
                        <div className="text-sm text-muted-foreground">Execution Probability</div>
                        <Progress 
                          value={results.executiveSummary.keyMetrics.executionProbability * 100} 
                          className="mt-2"
                        />
                      </div>
                    </div>

                    <div className="mt-6">
                      <h4 className="font-medium text-sm mb-2">Pricing Rationale</h4>
                      <ul className="space-y-1">
                        {results.executiveSummary.recommendedStrategy.pricingRationale.map((rationale, index) => (
                          <li key={index} className="flex items-center gap-2 text-sm">
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                            {rationale}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5" />
                      Pricing Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-sm mb-3">Methodology Results</h4>
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="border-b">
                                <th className="text-left py-2">Methodology</th>
                                <th className="text-right py-2">Implied Price ($M)</th>
                                <th className="text-right py-2">Weight</th>
                                <th className="text-left py-2">Rationale</th>
                              </tr>
                            </thead>
                            <tbody>
                              {results.pricingAnalysis.pricingRecommendations.methodologyResults.map((method, index) => (
                                <tr key={index} className="border-b">
                                  <td className="py-2 font-medium">{method.methodologyName}</td>
                                  <td className="text-right py-2">${(method.impliedPrice / 1000000).toFixed(0)}M</td>
                                  <td className="text-right py-2">{(method.weight * 100).toFixed(0)}%</td>
                                  <td className="py-2">{method.rationale}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium text-sm mb-3">Price Sensitivity Analysis</h4>
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="border-b">
                                <th className="text-right py-2">Price ($M)</th>
                                <th className="text-right py-2">Expected Demand ($M)</th>
                                <th className="text-right py-2">Participation Rate</th>
                                <th className="text-right py-2">Execution Probability</th>
                                <th className="text-right py-2">Net Proceeds ($M)</th>
                              </tr>
                            </thead>
                            <tbody>
                              {results.pricingAnalysis.pricingRecommendations.sensitivityAnalysis.slice(0, 5).map((analysis, index) => (
                                <tr key={index} className="border-b">
                                  <td className="text-right py-2">${(analysis.pricePoint / 1000000).toFixed(0)}M</td>
                                  <td className="text-right py-2">${(analysis.expectedDemand / 1000000).toFixed(0)}M</td>
                                  <td className="text-right py-2">{(analysis.participationRate * 100).toFixed(1)}%</td>
                                  <td className="text-right py-2">{(analysis.executionProbability * 100).toFixed(0)}%</td>
                                  <td className="text-right py-2">${(analysis.netProceeds / 1000000).toFixed(0)}M</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Participation Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium text-sm mb-3">Overall Participation</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Expected Rate:</span>
                            <span className="font-medium">{(results.participationAnalysis.overallParticipation.expectedParticipationRate * 100).toFixed(1)}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Expected Amount:</span>
                            <span className="font-medium">${(results.participationAnalysis.overallParticipation.expectedParticipationAmount / 1000000).toFixed(0)}M</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Participant Count:</span>
                            <span className="font-medium">{results.participationAnalysis.overallParticipation.participantCount}</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium text-sm mb-3">Participation by Type</h4>
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="border-b">
                                <th className="text-left py-1">Type</th>
                                <th className="text-right py-1">Rate</th>
                                <th className="text-right py-1">Amount ($M)</th>
                              </tr>
                            </thead>
                            <tbody>
                              {results.participationAnalysis.overallParticipation.participationByType.map((type, index) => (
                                <tr key={index} className="border-b">
                                  <td className="py-1">{type.participantType.replace('_', ' ')}</td>
                                  <td className="text-right py-1">{(type.participationRate * 100).toFixed(1)}%</td>
                                  <td className="text-right py-1">${(type.participationAmount / 1000000).toFixed(0)}M</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6">
                      <h4 className="font-medium text-sm mb-3">Key Participation Drivers</h4>
                      <div className="grid grid-cols-2 gap-4">
                        {results.participationAnalysis.overallParticipation.participationDrivers.map((driver, index) => (
                          <div key={index} className="space-y-1">
                            <div className="flex justify-between text-sm">
                              <span>{driver.driver}</span>
                              <span className={`font-medium ${driver.netImpact > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {driver.netImpact > 0 ? '+' : ''}{(driver.netImpact * 100).toFixed(1)}%
                              </span>
                            </div>
                            <Progress
                              value={Math.abs(driver.netImpact) * 100}
                              className="h-2"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="h-5 w-5" />
                      Execution Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium text-sm mb-3">Success Factors</h4>
                        <div className="space-y-3">
                          {results.executionAnalysis.executionProbability.successFactors.map((factor, index) => (
                            <div key={index} className="space-y-1">
                              <div className="flex justify-between text-sm">
                                <span>{factor.factor}</span>
                                <span className="font-medium">{(factor.currentScore * 100).toFixed(0)}%</span>
                              </div>
                              <Progress value={factor.currentScore * 100} className="h-2" />
                              <div className="text-xs text-muted-foreground">
                                Weight: {(factor.importance * 100).toFixed(0)}% | Contribution: {(factor.contribution * 100).toFixed(1)}%
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium text-sm mb-3">Risk Factors</h4>
                        <div className="space-y-3">
                          {results.executionAnalysis.executionProbability.riskFactors.map((risk, index) => (
                            <div key={index} className="space-y-1">
                              <div className="flex items-center gap-2">
                                <AlertCircle className={`h-4 w-4 ${getRiskColor(risk.impact)}`} />
                                <span className="text-sm font-medium">{risk.risk}</span>
                              </div>
                              <div className="text-xs text-muted-foreground">
                                Probability: {(risk.probability * 100).toFixed(0)}% | Impact: {risk.impact} | Residual: {(risk.residualRisk * 100).toFixed(0)}%
                              </div>
                              <div className="text-xs text-muted-foreground">Mitigation: {risk.mitigation}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="mt-6">
                      <h4 className="font-medium text-sm mb-3">Timeline Analysis</h4>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b">
                              <th className="text-left py-2">Phase</th>
                              <th className="text-right py-2">Duration (days)</th>
                              <th className="text-left py-2">Dependencies</th>
                              <th className="text-left py-2">Key Risks</th>
                            </tr>
                          </thead>
                          <tbody>
                            {results.executionAnalysis.timelineAnalysis.criticalPath.map((phase, index) => (
                              <tr key={index} className="border-b">
                                <td className="py-2 font-medium">{phase.phase}</td>
                                <td className="text-right py-2">{phase.duration}</td>
                                <td className="py-2">{phase.dependencies.join(', ')}</td>
                                <td className="py-2">{phase.risks.join(', ')}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <div className="mt-3 text-sm text-muted-foreground">
                        Total Time Estimate: {results.executionAnalysis.timelineAnalysis.totalTimeEstimate.best}-{results.executionAnalysis.timelineAnalysis.totalTimeEstimate.worst} days 
                        (likely: {results.executionAnalysis.timelineAnalysis.totalTimeEstimate.likely} days)
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5" />
                      Recommendations & Next Steps
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium text-sm mb-3">Strategic Recommendations</h4>
                        <div className="space-y-3">
                          {results.recommendations.strategicRecommendations.map((rec, index) => (
                            <div key={index} className="space-y-1">
                              <div className="text-sm font-medium">{rec.recommendation}</div>
                              <div className="text-xs text-muted-foreground">
                                Priority: {rec.priority} | Timeline: {rec.timeline}
                              </div>
                              <div className="text-xs text-muted-foreground">Expected: {rec.expectedOutcome}</div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium text-sm mb-3">Tactical Actions</h4>
                        <div className="space-y-3">
                          {results.recommendations.tacticalRecommendations.map((rec, index) => (
                            <div key={index} className="space-y-1">
                              <div className="text-sm font-medium">{rec.recommendation}</div>
                              <div className="text-xs text-muted-foreground">
                                Owner: {rec.owner} | Timeline: {rec.timeline} days
                              </div>
                              <div className="text-xs text-muted-foreground">Dependencies: {rec.dependencies.join(', ')}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 p-4 border rounded-lg">
                      <h4 className="font-medium text-sm mb-3">Go/No-Go Analysis</h4>
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <h5 className="text-sm font-medium text-green-600 mb-2">Go Factors</h5>
                          <ul className="space-y-1">
                            {results.recommendations.decisionFramework.goNoGoAnalysis.goFactors.map((factor, index) => (
                              <li key={index} className="flex items-center gap-2 text-sm">
                                <CheckCircle2 className="h-4 w-4 text-green-600" />
                                {factor}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h5 className="text-sm font-medium text-red-600 mb-2">No-Go Factors</h5>
                          <ul className="space-y-1">
                            {results.recommendations.decisionFramework.goNoGoAnalysis.noGoFactors.map((factor, index) => (
                              <li key={index} className="flex items-center gap-2 text-sm">
                                <XCircle className="h-4 w-4 text-red-600" />
                                {factor}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      <div className="text-center">
                        <Badge 
                          variant={results.recommendations.decisionFramework.goNoGoAnalysis.recommendation === 'proceed' ? 'default' : 'secondary'}
                          className="text-base px-4 py-2"
                        >
                          Recommendation: {results.recommendations.decisionFramework.goNoGoAnalysis.recommendation.toUpperCase()}
                        </Badge>
                        <div className="text-sm text-muted-foreground mt-2">
                          Confidence: {results.recommendations.decisionFramework.goNoGoAnalysis.confidenceLevel}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Configure the tender offer structure, participant universe, and pricing strategy, then run the analysis to see comprehensive results</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default TenderOfferCard;