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
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Building2, TrendingUp, Calculator, DollarSign, Trash2, Plus, AlertCircle, BarChart3 } from 'lucide-react';

interface BusinessSegment {
  id: string;
  name: string;
  description: string;
  segmentType: 'operating_business' | 'investment' | 'real_estate' | 'intangible' | 'cash_equivalent';
  classification: {
    industry: string;
    sector: string;
    geography: string[];
    operatingStatus: 'active' | 'discontinued' | 'held_for_sale';
  };
  financials: {
    revenue: number;
    ebitda: number;
    ebit: number;
    netIncome: number;
    assets: number;
    liabilities: number;
    capex: number;
    freeCashFlow: number;
    revenueGrowth: number;
    ebitdaGrowth: number;
    ebitdaMargin: number;
    netMargin: number;
    assetTurnover: number;
    returnOnAssets: number;
  };
  valuationMethods: {
    primary: 'multiples' | 'dcf' | 'market_value' | 'book_value';
    multiples?: {
      industryMultiples: {
        evRevenue: { min: number; median: number; max: number; };
        evEbitda: { min: number; median: number; max: number; };
        evEbit: { min: number; median: number; max: number; };
        peRatio: { min: number; median: number; max: number; };
      };
      selectedMultiples: {
        evRevenue?: number;
        evEbitda?: number;
        evEbit?: number;
        peRatio?: number;
      };
    };
    marketValue?: {
      sharePrice: number;
      sharesOwned: number;
      ownershipPercentage: number;
      marketCapitalization: number;
      marketValueOfPosition: number;
      marketPremiumDiscount: number;
    };
  };
  adjustments: {
    operationalAdjustments: any[];
    marketAdjustments: {
      sizeAdjustment: number;
      liquidityAdjustment: number;
      controlAdjustment: number;
      keyPersonAdjustment: number;
    };
    riskAdjustments: {
      businessRiskPremium: number;
      operationalRiskDiscount: number;
      regulatoryRiskDiscount: number;
      concentrationRiskDiscount: number;
    };
  };
  ownership: {
    parentOwnershipPercentage: number;
    minorityInterests: number;
    consolidationMethod: 'full' | 'equity_method' | 'cost_method';
  };
}

interface SumOfPartsInputs {
  companyName: string;
  analysisDate: Date;
  currency: string;
  segments: BusinessSegment[];
  corporateAdjustments: {
    holdingCompanyDiscount: {
      enabled: boolean;
      discountRate: number;
      rationale: string;
    };
    conglomerateAdjustment: {
      enabled: boolean;
      adjustmentRate: number;
      rationale: string;
      diversificationBenefit: number;
      synergyCost: number;
      managementComplexity: number;
    };
    corporateCosts: {
      annualCorporateOverhead: number;
      presentValueOfOverheads: number;
      discountRate: number;
      perpetualCostAssumption: boolean;
    };
    taxAdjustments: {
      taxBenefitsFromStructure: number;
      taxCostsFromReorganization: number;
      netTaxImpact: number;
    };
    financialItems: {
      excess_cash: number;
      marketable_securities: number;
      pension_obligations: number;
      debt: number;
      other_liabilities: number;
      contingent_liabilities: number;
    };
  };
  marketAssumptions: {
    riskFreeRate: number;
    marketRiskPremium: number;
    countryRiskPremium: number;
    illiquidityDiscount: number;
  };
  analysisSettings: {
    includeScenarioAnalysis: boolean;
    includeSensitivityAnalysis: boolean;
    includeMonteCarloAnalysis: boolean;
    confidenceLevels: number[];
  };
}

interface SumOfPartsResults {
  valuationSummary: {
    sumOfParts: number;
    netAssetValue: number;
    valuePerShare: number;
    corporateAdjustments: number;
    sharesOutstanding: number;
  };
  segmentAnalysis: {
    contributionAnalysis: Array<{
      segmentId: string;
      segmentName: string;
      value: number;
      percentageOfTotal: number;
      valuePerShare: number;
      valuationMethod: string;
      keyMetrics: {
        revenue: number;
        ebitda: number;
        multiple: number;
      };
    }>;
    aggregateMetrics: {
      totalRevenue: number;
      totalEbitda: number;
      totalAssets: number;
      weightedAverageMargins: {
        ebitdaMargin: number;
        netMargin: number;
      };
      weightedAverageGrowth: {
        revenueGrowth: number;
        ebitdaGrowth: number;
      };
    };
  };
  corporateAnalysis: {
    holdingCompanyDiscountImpact: number;
    conglomerateAdjustmentImpact: number;
    corporateCostsImpact: number;
    netCorporateImpact: number;
    financialItemsBreakdown: {
      netFinancialItems: number;
      breakdown: {
        [key: string]: number;
      };
    };
  };
  scenarioAnalysis?: {
    baseCase: number;
    bearCase: number;
    bullCase: number;
  };
  keyInsights: {
    primaryValueDrivers: string[];
    riskFactors: string[];
    strategicRecommendations: string[];
  };
}

interface SumOfPartsCardProps {
  dealId: string;
  mode?: 'traditional' | 'assisted' | 'autonomous';
  onResultsChange?: (results: SumOfPartsResults) => void;
}

const SumOfPartsCard: React.FC<SumOfPartsCardProps> = ({ 
  dealId, 
  mode = 'traditional',
  onResultsChange 
}) => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SumOfPartsResults | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('segments');

  const [inputs, setInputs] = useState<SumOfPartsInputs>({
    companyName: 'Multi-Business Company',
    analysisDate: new Date(),
    currency: 'USD',
    segments: [
      {
        id: 'segment-1',
        name: 'Core Business',
        description: 'Primary operating business segment',
        segmentType: 'operating_business',
        classification: {
          industry: 'Technology',
          sector: 'Software',
          geography: ['North America'],
          operatingStatus: 'active'
        },
        financials: {
          revenue: 200000000,
          ebitda: 50000000,
          ebit: 40000000,
          netIncome: 30000000,
          assets: 300000000,
          liabilities: 100000000,
          capex: 15000000,
          freeCashFlow: 35000000,
          revenueGrowth: 0.15,
          ebitdaGrowth: 0.18,
          ebitdaMargin: 0.25,
          netMargin: 0.15,
          assetTurnover: 0.67,
          returnOnAssets: 0.10
        },
        valuationMethods: {
          primary: 'multiples',
          multiples: {
            industryMultiples: {
              evRevenue: { min: 3.0, median: 5.0, max: 8.0 },
              evEbitda: { min: 10.0, median: 15.0, max: 20.0 },
              evEbit: { min: 12.0, median: 18.0, max: 25.0 },
              peRatio: { min: 15.0, median: 25.0, max: 35.0 }
            },
            selectedMultiples: {
              evRevenue: 5.0,
              evEbitda: 15.0
            }
          }
        },
        adjustments: {
          operationalAdjustments: [],
          marketAdjustments: {
            sizeAdjustment: 0,
            liquidityAdjustment: -0.05,
            controlAdjustment: 0,
            keyPersonAdjustment: -0.02
          },
          riskAdjustments: {
            businessRiskPremium: 0.01,
            operationalRiskDiscount: 0.02,
            regulatoryRiskDiscount: 0,
            concentrationRiskDiscount: 0.03
          }
        },
        ownership: {
          parentOwnershipPercentage: 1.0,
          minorityInterests: 0,
          consolidationMethod: 'full'
        }
      },
      {
        id: 'segment-2',
        name: 'Investment Portfolio',
        description: 'Strategic investments and minority stakes',
        segmentType: 'investment',
        classification: {
          industry: 'Diversified',
          sector: 'Financial',
          geography: ['North America', 'Europe'],
          operatingStatus: 'active'
        },
        financials: {
          revenue: 0,
          ebitda: 0,
          ebit: 0,
          netIncome: 25000000,
          assets: 150000000,
          liabilities: 0,
          capex: 0,
          freeCashFlow: 25000000,
          revenueGrowth: 0,
          ebitdaGrowth: 0,
          ebitdaMargin: 0,
          netMargin: 0,
          assetTurnover: 0,
          returnOnAssets: 0.17
        },
        valuationMethods: {
          primary: 'market_value',
          marketValue: {
            sharePrice: 50.0,
            sharesOwned: 2000000,
            ownershipPercentage: 0.15,
            marketCapitalization: 667000000,
            marketValueOfPosition: 100000000,
            marketPremiumDiscount: -0.15
          }
        },
        adjustments: {
          operationalAdjustments: [],
          marketAdjustments: {
            sizeAdjustment: 0,
            liquidityAdjustment: -0.20,
            controlAdjustment: -0.15,
            keyPersonAdjustment: 0
          },
          riskAdjustments: {
            businessRiskPremium: 0.02,
            operationalRiskDiscount: 0,
            regulatoryRiskDiscount: 0.01,
            concentrationRiskDiscount: 0.05
          }
        },
        ownership: {
          parentOwnershipPercentage: 1.0,
          minorityInterests: 0,
          consolidationMethod: 'equity_method'
        }
      }
    ],
    corporateAdjustments: {
      holdingCompanyDiscount: {
        enabled: true,
        discountRate: 0.15,
        rationale: 'Diversified holding company discount due to complexity and limited operational synergies'
      },
      conglomerateAdjustment: {
        enabled: true,
        adjustmentRate: -0.05,
        rationale: 'Conglomerate discount for unrelated business segments',
        diversificationBenefit: 0.02,
        synergyCost: -0.03,
        managementComplexity: -0.04
      },
      corporateCosts: {
        annualCorporateOverhead: 10000000,
        presentValueOfOverheads: 100000000,
        discountRate: 0.10,
        perpetualCostAssumption: true
      },
      taxAdjustments: {
        taxBenefitsFromStructure: 5000000,
        taxCostsFromReorganization: 0,
        netTaxImpact: 5000000
      },
      financialItems: {
        excess_cash: 50000000,
        marketable_securities: 25000000,
        pension_obligations: -30000000,
        debt: -100000000,
        other_liabilities: -15000000,
        contingent_liabilities: -10000000
      }
    },
    marketAssumptions: {
      riskFreeRate: 0.04,
      marketRiskPremium: 0.06,
      countryRiskPremium: 0.01,
      illiquidityDiscount: 0.15
    },
    analysisSettings: {
      includeScenarioAnalysis: true,
      includeSensitivityAnalysis: true,
      includeMonteCarloAnalysis: false,
      confidenceLevels: [0.1, 0.25, 0.5, 0.75, 0.9]
    }
  });

  const addSegment = () => {
    const newSegment: BusinessSegment = {
      id: `segment-${inputs.segments.length + 1}`,
      name: `Segment ${inputs.segments.length + 1}`,
      description: 'New business segment',
      segmentType: 'operating_business',
      classification: {
        industry: 'Technology',
        sector: 'Software',
        geography: ['North America'],
        operatingStatus: 'active'
      },
      financials: {
        revenue: 50000000,
        ebitda: 12500000,
        ebit: 10000000,
        netIncome: 7500000,
        assets: 75000000,
        liabilities: 25000000,
        capex: 5000000,
        freeCashFlow: 7500000,
        revenueGrowth: 0.10,
        ebitdaGrowth: 0.12,
        ebitdaMargin: 0.25,
        netMargin: 0.15,
        assetTurnover: 0.67,
        returnOnAssets: 0.10
      },
      valuationMethods: {
        primary: 'multiples',
        multiples: {
          industryMultiples: {
            evRevenue: { min: 3.0, median: 5.0, max: 8.0 },
            evEbitda: { min: 10.0, median: 15.0, max: 20.0 },
            evEbit: { min: 12.0, median: 18.0, max: 25.0 },
            peRatio: { min: 15.0, median: 25.0, max: 35.0 }
          },
          selectedMultiples: {
            evRevenue: 5.0,
            evEbitda: 15.0
          }
        }
      },
      adjustments: {
        operationalAdjustments: [],
        marketAdjustments: {
          sizeAdjustment: 0,
          liquidityAdjustment: -0.05,
          controlAdjustment: 0,
          keyPersonAdjustment: 0
        },
        riskAdjustments: {
          businessRiskPremium: 0.01,
          operationalRiskDiscount: 0.02,
          regulatoryRiskDiscount: 0,
          concentrationRiskDiscount: 0.03
        }
      },
      ownership: {
        parentOwnershipPercentage: 1.0,
        minorityInterests: 0,
        consolidationMethod: 'full'
      }
    };

    setInputs(prev => ({
      ...prev,
      segments: [...prev.segments, newSegment]
    }));
  };

  const removeSegment = (index: number) => {
    setInputs(prev => ({
      ...prev,
      segments: prev.segments.filter((_, i) => i !== index)
    }));
  };

  const updateSegment = (index: number, field: string, value: any) => {
    setInputs(prev => ({
      ...prev,
      segments: prev.segments.map((segment, i) => 
        i === index 
          ? { ...segment, [field]: value }
          : segment
      )
    }));
  };

  const updateSegmentFinancials = (index: number, field: string, value: number) => {
    setInputs(prev => ({
      ...prev,
      segments: prev.segments.map((segment, i) => 
        i === index 
          ? { 
              ...segment, 
              financials: { ...segment.financials, [field]: value }
            }
          : segment
      )
    }));
  };

  const updateSegmentValuation = (index: number, multiple: string, value: number) => {
    setInputs(prev => ({
      ...prev,
      segments: prev.segments.map((segment, i) => 
        i === index 
          ? { 
              ...segment, 
              valuationMethods: {
                ...segment.valuationMethods,
                multiples: {
                  ...segment.valuationMethods.multiples!,
                  selectedMultiples: {
                    ...segment.valuationMethods.multiples!.selectedMultiples,
                    [multiple]: value
                  }
                }
              }
            }
          : segment
      )
    }));
  };

  const runAnalysis = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/deal-structuring/models/sum-of-parts', {
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
        throw new Error('Failed to run sum-of-parts analysis');
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

  const getSegmentTypeColor = (type: string) => {
    const colors = {
      operating_business: 'bg-blue-100 text-blue-800',
      investment: 'bg-green-100 text-green-800',
      real_estate: 'bg-blue-100 text-blue-800',
      intangible: 'bg-orange-100 text-orange-800',
      cash_equivalent: 'bg-gray-100 text-gray-800'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-blue-600" />
            <div>
              <CardTitle>Sum-of-Parts Valuation</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Multi-segment business valuation with holding company adjustments and conglomerate analysis
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
            <TabsTrigger value="segments">Segments</TabsTrigger>
            <TabsTrigger value="corporate">Corporate</TabsTrigger>
            <TabsTrigger value="assumptions">Assumptions</TabsTrigger>
            <TabsTrigger value="results">Results</TabsTrigger>
          </TabsList>

          <TabsContent value="segments" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Business Segments</h3>
              <Button onClick={addSegment} size="sm" variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Add Segment
              </Button>
            </div>

            <div className="space-y-4">
              {inputs.segments.map((segment, index) => (
                <Card key={segment.id} className="border-l-4 border-l-blue-500">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{segment.name}</h4>
                        <Badge className={getSegmentTypeColor(segment.segmentType)}>
                          {segment.segmentType.replace('_', ' ')}
                        </Badge>
                      </div>
                      <Button
                        onClick={() => removeSegment(index)}
                        size="sm"
                        variant="ghost"
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor={`segment-name-${index}`}>Segment Name</Label>
                        <Input
                          id={`segment-name-${index}`}
                          value={segment.name}
                          onChange={(e) => updateSegment(index, 'name', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor={`segment-type-${index}`}>Segment Type</Label>
                        <Select
                          value={segment.segmentType}
                          onValueChange={(value) => updateSegment(index, 'segmentType', value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="operating_business">Operating Business</SelectItem>
                            <SelectItem value="investment">Investment</SelectItem>
                            <SelectItem value="real_estate">Real Estate</SelectItem>
                            <SelectItem value="intangible">Intangible Assets</SelectItem>
                            <SelectItem value="cash_equivalent">Cash Equivalent</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label>Financial Metrics ($ Millions)</Label>
                      <div className="grid grid-cols-3 gap-4 mt-2">
                        <div>
                          <Label htmlFor={`revenue-${index}`} className="text-xs">Revenue</Label>
                          <Input
                            id={`revenue-${index}`}
                            type="number"
                            value={segment.financials.revenue / 1000000}
                            onChange={(e) => updateSegmentFinancials(index, 'revenue', parseFloat(e.target.value) * 1000000)}
                          />
                        </div>
                        <div>
                          <Label htmlFor={`ebitda-${index}`} className="text-xs">EBITDA</Label>
                          <Input
                            id={`ebitda-${index}`}
                            type="number"
                            value={segment.financials.ebitda / 1000000}
                            onChange={(e) => updateSegmentFinancials(index, 'ebitda', parseFloat(e.target.value) * 1000000)}
                          />
                        </div>
                        <div>
                          <Label htmlFor={`fcf-${index}`} className="text-xs">Free Cash Flow</Label>
                          <Input
                            id={`fcf-${index}`}
                            type="number"
                            value={segment.financials.freeCashFlow / 1000000}
                            onChange={(e) => updateSegmentFinancials(index, 'freeCashFlow', parseFloat(e.target.value) * 1000000)}
                          />
                        </div>
                      </div>
                    </div>

                    {segment.valuationMethods.primary === 'multiples' && (
                      <div>
                        <Label>Valuation Multiples</Label>
                        <div className="grid grid-cols-2 gap-4 mt-2">
                          <div>
                            <Label htmlFor={`ev-revenue-${index}`} className="text-xs">EV/Revenue</Label>
                            <Input
                              id={`ev-revenue-${index}`}
                              type="number"
                              step="0.1"
                              value={segment.valuationMethods.multiples?.selectedMultiples?.evRevenue || 0}
                              onChange={(e) => updateSegmentValuation(index, 'evRevenue', parseFloat(e.target.value))}
                            />
                          </div>
                          <div>
                            <Label htmlFor={`ev-ebitda-${index}`} className="text-xs">EV/EBITDA</Label>
                            <Input
                              id={`ev-ebitda-${index}`}
                              type="number"
                              step="0.5"
                              value={segment.valuationMethods.multiples?.selectedMultiples?.evEbitda || 0}
                              onChange={(e) => updateSegmentValuation(index, 'evEbitda', parseFloat(e.target.value))}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="corporate" className="space-y-4">
            <h3 className="text-lg font-semibold">Corporate-Level Adjustments</h3>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Holding Company & Conglomerate Adjustments</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="holding-discount">Apply Holding Company Discount</Label>
                  <Switch
                    id="holding-discount"
                    checked={inputs.corporateAdjustments.holdingCompanyDiscount.enabled}
                    onCheckedChange={(checked) => setInputs(prev => ({
                      ...prev,
                      corporateAdjustments: {
                        ...prev.corporateAdjustments,
                        holdingCompanyDiscount: {
                          ...prev.corporateAdjustments.holdingCompanyDiscount,
                          enabled: checked
                        }
                      }
                    }))}
                  />
                </div>
                
                {inputs.corporateAdjustments.holdingCompanyDiscount.enabled && (
                  <div>
                    <Label htmlFor="discount-rate">Holding Company Discount (%)</Label>
                    <Input
                      id="discount-rate"
                      type="number"
                      value={inputs.corporateAdjustments.holdingCompanyDiscount.discountRate * 100}
                      onChange={(e) => setInputs(prev => ({
                        ...prev,
                        corporateAdjustments: {
                          ...prev.corporateAdjustments,
                          holdingCompanyDiscount: {
                            ...prev.corporateAdjustments.holdingCompanyDiscount,
                            discountRate: parseFloat(e.target.value) / 100
                          }
                        }
                      }))}
                    />
                  </div>
                )}

                <div>
                  <Label htmlFor="corporate-overhead">Annual Corporate Overhead ($ Millions)</Label>
                  <Input
                    id="corporate-overhead"
                    type="number"
                    value={inputs.corporateAdjustments.corporateCosts.annualCorporateOverhead / 1000000}
                    onChange={(e) => setInputs(prev => ({
                      ...prev,
                      corporateAdjustments: {
                        ...prev.corporateAdjustments,
                        corporateCosts: {
                          ...prev.corporateAdjustments.corporateCosts,
                          annualCorporateOverhead: parseFloat(e.target.value) * 1000000
                        }
                      }
                    }))}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Financial Items ($ Millions)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="excess-cash">Excess Cash</Label>
                    <Input
                      id="excess-cash"
                      type="number"
                      value={inputs.corporateAdjustments.financialItems.excess_cash / 1000000}
                      onChange={(e) => setInputs(prev => ({
                        ...prev,
                        corporateAdjustments: {
                          ...prev.corporateAdjustments,
                          financialItems: {
                            ...prev.corporateAdjustments.financialItems,
                            excess_cash: parseFloat(e.target.value) * 1000000
                          }
                        }
                      }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="debt">Total Debt</Label>
                    <Input
                      id="debt"
                      type="number"
                      value={Math.abs(inputs.corporateAdjustments.financialItems.debt) / 1000000}
                      onChange={(e) => setInputs(prev => ({
                        ...prev,
                        corporateAdjustments: {
                          ...prev.corporateAdjustments,
                          financialItems: {
                            ...prev.corporateAdjustments.financialItems,
                            debt: -parseFloat(e.target.value) * 1000000
                          }
                        }
                      }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="marketable-securities">Marketable Securities</Label>
                    <Input
                      id="marketable-securities"
                      type="number"
                      value={inputs.corporateAdjustments.financialItems.marketable_securities / 1000000}
                      onChange={(e) => setInputs(prev => ({
                        ...prev,
                        corporateAdjustments: {
                          ...prev.corporateAdjustments,
                          financialItems: {
                            ...prev.corporateAdjustments.financialItems,
                            marketable_securities: parseFloat(e.target.value) * 1000000
                          }
                        }
                      }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="pension-obligations">Pension Obligations</Label>
                    <Input
                      id="pension-obligations"
                      type="number"
                      value={Math.abs(inputs.corporateAdjustments.financialItems.pension_obligations) / 1000000}
                      onChange={(e) => setInputs(prev => ({
                        ...prev,
                        corporateAdjustments: {
                          ...prev.corporateAdjustments,
                          financialItems: {
                            ...prev.corporateAdjustments.financialItems,
                            pension_obligations: -parseFloat(e.target.value) * 1000000
                          }
                        }
                      }))}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="assumptions" className="space-y-4">
            <h3 className="text-lg font-semibold">Market Assumptions</h3>
            
            <Card>
              <CardContent className="pt-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="risk-free-rate">Risk-Free Rate (%)</Label>
                    <Input
                      id="risk-free-rate"
                      type="number"
                      step="0.01"
                      value={inputs.marketAssumptions.riskFreeRate * 100}
                      onChange={(e) => setInputs(prev => ({
                        ...prev,
                        marketAssumptions: {
                          ...prev.marketAssumptions,
                          riskFreeRate: parseFloat(e.target.value) / 100
                        }
                      }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="market-risk-premium">Market Risk Premium (%)</Label>
                    <Input
                      id="market-risk-premium"
                      type="number"
                      step="0.01"
                      value={inputs.marketAssumptions.marketRiskPremium * 100}
                      onChange={(e) => setInputs(prev => ({
                        ...prev,
                        marketAssumptions: {
                          ...prev.marketAssumptions,
                          marketRiskPremium: parseFloat(e.target.value) / 100
                        }
                      }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="illiquidity-discount">Illiquidity Discount (%)</Label>
                    <Input
                      id="illiquidity-discount"
                      type="number"
                      step="0.01"
                      value={inputs.marketAssumptions.illiquidityDiscount * 100}
                      onChange={(e) => setInputs(prev => ({
                        ...prev,
                        marketAssumptions: {
                          ...prev.marketAssumptions,
                          illiquidityDiscount: parseFloat(e.target.value) / 100
                        }
                      }))}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

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
                      <DollarSign className="h-5 w-5" />
                      Valuation Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">
                          ${(results.valuationSummary.sumOfParts / 1000000).toFixed(1)}M
                        </div>
                        <div className="text-sm text-muted-foreground">Sum of Parts</div>
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">
                          ${(results.valuationSummary.netAssetValue / 1000000).toFixed(1)}M
                        </div>
                        <div className="text-sm text-muted-foreground">Net Asset Value</div>
                      </div>
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">
                          ${results.valuationSummary.valuePerShare.toFixed(2)}
                        </div>
                        <div className="text-sm text-muted-foreground">Value per Share</div>
                      </div>
                      <div className="text-center p-4 bg-orange-50 rounded-lg">
                        <div className="text-2xl font-bold text-orange-600">
                          ${(results.valuationSummary.corporateAdjustments / 1000000).toFixed(1)}M
                        </div>
                        <div className="text-sm text-muted-foreground">Corporate Adjustments</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      Segment Contribution Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {results.segmentAnalysis.contributionAnalysis.map((segment) => (
                        <div key={segment.segmentId} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <div className="font-medium">{segment.segmentName}</div>
                            <div className="text-sm text-muted-foreground">
                              {segment.valuationMethod} • ${(segment.value / 1000000).toFixed(1)}M
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">{(segment.percentageOfTotal * 100).toFixed(1)}%</div>
                            <div className="text-sm text-muted-foreground">${segment.valuePerShare.toFixed(2)}/share</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Corporate Analysis</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 border rounded-lg">
                        <div className="text-sm text-muted-foreground">Holding Company Impact</div>
                        <div className="text-lg font-semibold">
                          ${(results.corporateAnalysis.holdingCompanyDiscountImpact / 1000000).toFixed(1)}M
                        </div>
                      </div>
                      <div className="p-3 border rounded-lg">
                        <div className="text-sm text-muted-foreground">Corporate Costs Impact</div>
                        <div className="text-lg font-semibold">
                          ${(results.corporateAnalysis.corporateCostsImpact / 1000000).toFixed(1)}M
                        </div>
                      </div>
                      <div className="p-3 border rounded-lg">
                        <div className="text-sm text-muted-foreground">Net Financial Items</div>
                        <div className="text-lg font-semibold">
                          ${(results.corporateAnalysis.financialItemsBreakdown.netFinancialItems / 1000000).toFixed(1)}M
                        </div>
                      </div>
                      <div className="p-3 border rounded-lg">
                        <div className="text-sm text-muted-foreground">Net Corporate Impact</div>
                        <div className="text-lg font-semibold">
                          ${(results.corporateAnalysis.netCorporateImpact / 1000000).toFixed(1)}M
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {results.keyInsights && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Key Insights</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-medium text-green-600">Primary Value Drivers</h4>
                        <ul className="list-disc list-inside text-sm space-y-1 mt-2">
                          {results.keyInsights.primaryValueDrivers.map((driver, index) => (
                            <li key={index}>{driver}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium text-orange-600">Risk Factors</h4>
                        <ul className="list-disc list-inside text-sm space-y-1 mt-2">
                          {results.keyInsights.riskFactors.map((risk, index) => (
                            <li key={index}>{risk}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium text-blue-600">Strategic Recommendations</h4>
                        <ul className="list-disc list-inside text-sm space-y-1 mt-2">
                          {results.keyInsights.strategicRecommendations.map((rec, index) => (
                            <li key={index}>{rec}</li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Run the analysis to see detailed results</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default SumOfPartsCard;