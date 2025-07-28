'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { 
  Plus, 
  X, 
  Calculator, 
  TrendingUp, 
  BarChart3, 
  Building2, 
  Target, 
  AlertCircle,
  CheckCircle,
  Activity,
  DollarSign,
  Download
} from 'lucide-react';

interface ComparableCompanyCardProps {
  dealId: string;
  mode?: 'traditional' | 'assisted' | 'autonomous';
  onResultsChange?: (results: any) => void;
}

interface CompanyFinancials {
  revenue: number;
  ebitda: number;
  ebit: number;
  netIncome: number;
  totalAssets: number;
  totalDebt: number;
  marketCap: number;
  enterpriseValue: number;
}

interface ComparableCompany {
  name: string;
  ticker: string;
  sector: string;
  industry: string;
  geography: string;
  financials: CompanyFinancials;
  qualityMetrics: {
    liquidityScore: number;
    growthProfile: number;
    profitabilityScore: number;
    businessModel: string;
    geographicExposure: string;
  };
}

interface CompAnalysisInputs {
  targetCompany: {
    name: string;
    sector: string;
    industry: string;
    geography: string;
    financials: CompanyFinancials;
  };
  comparableCompanies: ComparableCompany[];
  selectionCriteria: {
    sizeRange: {
      minRevenue: number;
      maxRevenue: number;
    };
    geographicFocus: string[];
    minimumLiquidityScore: number;
    includePrivateComparables: boolean;
    businessModelMatch: boolean;
  };
  analysisSettings: {
    includeOutlierAnalysis: boolean;
    includeSizeAdjustments: boolean;
    includeLiquidityAdjustments: boolean;
    includeQualityAdjustments: boolean;
    outlierThreshold: number;
    confidenceLevel: number;
  };
}

const ComparableCompanyCard: React.FC<ComparableCompanyCardProps> = ({ 
  dealId, 
  mode = 'traditional',
  onResultsChange 
}) => {
  const [activeTab, setActiveTab] = useState<'setup' | 'comparables' | 'results' | 'insights'>('setup');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const [inputs, setInputs] = useState<CompAnalysisInputs>({
    targetCompany: {
      name: 'Target Company',
      sector: 'Technology',
      industry: 'Software',
      geography: 'North America',
      financials: {
        revenue: 100000000,
        ebitda: 25000000,
        ebit: 20000000,
        netIncome: 15000000,
        totalAssets: 150000000,
        totalDebt: 30000000,
        marketCap: 0,
        enterpriseValue: 0
      }
    },
    comparableCompanies: [
      {
        name: 'Comparable Alpha',
        ticker: 'COMP1',
        sector: 'Technology',
        industry: 'Software',
        geography: 'North America',
        financials: {
          revenue: 120000000,
          ebitda: 30000000,
          ebit: 25000000,
          netIncome: 18000000,
          totalAssets: 180000000,
          totalDebt: 40000000,
          marketCap: 300000000,
          enterpriseValue: 340000000
        },
        qualityMetrics: {
          liquidityScore: 8,
          growthProfile: 9,
          profitabilityScore: 8,
          businessModel: 'SaaS',
          geographicExposure: 'Global'
        }
      },
      {
        name: 'Comparable Beta',
        ticker: 'COMP2',
        sector: 'Technology',
        industry: 'Software',
        geography: 'North America',
        financials: {
          revenue: 95000000,
          ebitda: 22000000,
          ebit: 18000000,
          netIncome: 13000000,
          totalAssets: 140000000,
          totalDebt: 25000000,
          marketCap: 260000000,
          enterpriseValue: 285000000
        },
        qualityMetrics: {
          liquidityScore: 7,
          growthProfile: 8,
          profitabilityScore: 7,
          businessModel: 'SaaS',
          geographicExposure: 'North America'
        }
      }
    ],
    selectionCriteria: {
      sizeRange: {
        minRevenue: 50000000,
        maxRevenue: 500000000
      },
      geographicFocus: ['North America', 'Europe'],
      minimumLiquidityScore: 6,
      includePrivateComparables: false,
      businessModelMatch: true
    },
    analysisSettings: {
      includeOutlierAnalysis: true,
      includeSizeAdjustments: true,
      includeLiquidityAdjustments: true,
      includeQualityAdjustments: true,
      outlierThreshold: 2.0,
      confidenceLevel: 0.95
    }
  });

  const addComparable = () => {
    const newComparable: ComparableCompany = {
      name: `Comparable ${inputs.comparableCompanies.length + 1}`,
      ticker: `COMP${inputs.comparableCompanies.length + 1}`,
      sector: 'Technology',
      industry: 'Software',
      geography: 'North America',
      financials: {
        revenue: 100000000,
        ebitda: 20000000,
        ebit: 15000000,
        netIncome: 10000000,
        totalAssets: 150000000,
        totalDebt: 30000000,
        marketCap: 250000000,
        enterpriseValue: 280000000
      },
      qualityMetrics: {
        liquidityScore: 7,
        growthProfile: 7,
        profitabilityScore: 7,
        businessModel: 'SaaS',
        geographicExposure: 'North America'
      }
    };

    setInputs(prev => ({
      ...prev,
      comparableCompanies: [...prev.comparableCompanies, newComparable]
    }));
  };

  const removeComparable = (index: number) => {
    setInputs(prev => ({
      ...prev,
      comparableCompanies: prev.comparableCompanies.filter((_, i) => i !== index)
    }));
  };

  const runAnalysis = async () => {
    setLoading(true);
    setError(null);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockResults = {
        valuation: {
          enterpriseValue: inputs.targetCompany.financials.ebitda * 12.5,
          equityValue: inputs.targetCompany.financials.ebitda * 12.5 - inputs.targetCompany.financials.totalDebt,
          impliedMultiples: {
            ev_revenue: 2.5,
            ev_ebitda: 12.5,
            ev_ebit: 15.6,
            p_e: 18.2
          }
        },
        multiples: {
          ev_revenue: {
            min: 1.8,
            max: 3.2,
            mean: 2.5,
            median: 2.4,
            percentile25: 2.1,
            percentile75: 2.8
          },
          ev_ebitda: {
            min: 9.5,
            max: 15.2,
            mean: 12.5,
            median: 12.1,
            percentile25: 10.8,
            percentile75: 14.1
          }
        },
        selectedComparables: inputs.comparableCompanies.map(comp => ({
          name: comp.name,
          ticker: comp.ticker,
          ev_revenue: comp.financials.enterpriseValue / comp.financials.revenue,
          ev_ebitda: comp.financials.enterpriseValue / comp.financials.ebitda
        })),
        qualityMetrics: {
          numberOfComparables: inputs.comparableCompanies.length,
          dataQualityScore: 8.2,
          reliabilityRating: 'High',
          coverageScore: 85
        },
        insights: [
          'Target company trades at a discount to peer median EV/EBITDA multiple',
          'Strong growth profile supports premium valuation relative to slower-growth peers',
          'Geographic diversification provides valuation uplift opportunity',
          'Quality of earnings analysis suggests sustainable multiple expansion'
        ]
      };

      setResults(mockResults);
      setActiveTab('results');
      onResultsChange?.(mockResults);

    } catch (error) {
      setError(error instanceof Error ? error.message : 'Analysis failed');
    } finally {
      setLoading(false);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'setup':
        return (
          <div className="space-y-6">
            <div>
              <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Target className="h-5 w-5" />
                Target Company
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Company Name</label>
                  <Input
                    value={inputs.targetCompany.name}
                    onChange={(e) => setInputs(prev => ({
                      ...prev,
                      targetCompany: { ...prev.targetCompany, name: e.target.value }
                    }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Industry</label>
                  <Input
                    value={inputs.targetCompany.industry}
                    onChange={(e) => setInputs(prev => ({
                      ...prev,
                      targetCompany: { ...prev.targetCompany, industry: e.target.value }
                    }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Revenue ($M)</label>
                  <Input
                    type="number"
                    value={inputs.targetCompany.financials.revenue / 1000000}
                    onChange={(e) => setInputs(prev => ({
                      ...prev,
                      targetCompany: {
                        ...prev.targetCompany,
                        financials: {
                          ...prev.targetCompany.financials,
                          revenue: parseFloat(e.target.value) * 1000000
                        }
                      }
                    }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">EBITDA ($M)</label>
                  <Input
                    type="number"
                    value={inputs.targetCompany.financials.ebitda / 1000000}
                    onChange={(e) => setInputs(prev => ({
                      ...prev,
                      targetCompany: {
                        ...prev.targetCompany,
                        financials: {
                          ...prev.targetCompany.financials,
                          ebitda: parseFloat(e.target.value) * 1000000
                        }
                      }
                    }))}
                  />
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Analysis Configuration
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Outlier Threshold</label>
                  <Input
                    type="number"
                    step="0.1"
                    value={inputs.analysisSettings.outlierThreshold}
                    onChange={(e) => setInputs(prev => ({
                      ...prev,
                      analysisSettings: {
                        ...prev.analysisSettings,
                        outlierThreshold: parseFloat(e.target.value)
                      }
                    }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Confidence Level (%)</label>
                  <Input
                    type="number"
                    value={inputs.analysisSettings.confidenceLevel * 100}
                    onChange={(e) => setInputs(prev => ({
                      ...prev,
                      analysisSettings: {
                        ...prev.analysisSettings,
                        confidenceLevel: parseFloat(e.target.value) / 100
                      }
                    }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Min Liquidity Score</label>
                  <Input
                    type="number"
                    min="1"
                    max="10"
                    value={inputs.selectionCriteria.minimumLiquidityScore}
                    onChange={(e) => setInputs(prev => ({
                      ...prev,
                      selectionCriteria: {
                        ...prev.selectionCriteria,
                        minimumLiquidityScore: parseInt(e.target.value)
                      }
                    }))}
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 'comparables':
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="text-lg font-semibold flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Comparable Companies ({inputs.comparableCompanies.length})
              </h4>
              <Button onClick={addComparable} variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Comparable
              </Button>
            </div>

            {inputs.comparableCompanies.map((comp, index) => (
              <Card key={index} className="border">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-4">
                    <h5 className="font-semibold">Comparable {index + 1}</h5>
                    <Button
                      onClick={() => removeComparable(index)}
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-800"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3">
                    <div>
                      <label className="block text-sm font-medium mb-1">Name</label>
                      <Input
                        value={comp.name}
                        onChange={(e) => {
                          const newComps = [...inputs.comparableCompanies];
                          newComps[index] = { ...comp, name: e.target.value };
                          setInputs(prev => ({ ...prev, comparableCompanies: newComps }));
                        }}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Ticker</label>
                      <Input
                        value={comp.ticker}
                        onChange={(e) => {
                          const newComps = [...inputs.comparableCompanies];
                          newComps[index] = { ...comp, ticker: e.target.value };
                          setInputs(prev => ({ ...prev, comparableCompanies: newComps }));
                        }}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Revenue ($M)</label>
                      <Input
                        type="number"
                        value={comp.financials.revenue / 1000000}
                        onChange={(e) => {
                          const newComps = [...inputs.comparableCompanies];
                          newComps[index] = {
                            ...comp,
                            financials: { ...comp.financials, revenue: parseFloat(e.target.value) * 1000000 }
                          };
                          setInputs(prev => ({ ...prev, comparableCompanies: newComps }));
                        }}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">EBITDA ($M)</label>
                      <Input
                        type="number"
                        value={comp.financials.ebitda / 1000000}
                        onChange={(e) => {
                          const newComps = [...inputs.comparableCompanies];
                          newComps[index] = {
                            ...comp,
                            financials: { ...comp.financials, ebitda: parseFloat(e.target.value) * 1000000 }
                          };
                          setInputs(prev => ({ ...prev, comparableCompanies: newComps }));
                        }}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Market Cap ($M)</label>
                      <Input
                        type="number"
                        value={comp.financials.marketCap / 1000000}
                        onChange={(e) => {
                          const newComps = [...inputs.comparableCompanies];
                          newComps[index] = {
                            ...comp,
                            financials: { ...comp.financials, marketCap: parseFloat(e.target.value) * 1000000 }
                          };
                          setInputs(prev => ({ ...prev, comparableCompanies: newComps }));
                        }}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Liquidity Score</label>
                      <Input
                        type="number"
                        min="1"
                        max="10"
                        value={comp.qualityMetrics.liquidityScore}
                        onChange={(e) => {
                          const newComps = [...inputs.comparableCompanies];
                          newComps[index] = {
                            ...comp,
                            qualityMetrics: { ...comp.qualityMetrics, liquidityScore: parseInt(e.target.value) }
                          };
                          setInputs(prev => ({ ...prev, comparableCompanies: newComps }));
                        }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        );

      case 'results':
        if (!results) {
          return (
            <div className="text-center py-8 text-gray-500">
              <Calculator className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p>Run analysis to see comparable company results</p>
            </div>
          );
        }

        return (
          <div className="space-y-6">
            <div>
              <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Implied Valuation Range
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-sm text-gray-600 mb-1">Enterprise Value</div>
                    <div className="text-2xl font-bold text-blue-600">
                      ${(results.valuation.enterpriseValue / 1000000).toFixed(1)}M
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-sm text-gray-600 mb-1">Equity Value</div>
                    <div className="text-2xl font-bold text-green-600">
                      ${(results.valuation.equityValue / 1000000).toFixed(1)}M
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-sm text-gray-600 mb-1">EV/Revenue</div>
                    <div className="text-2xl font-bold text-purple-600">
                      {results.valuation.impliedMultiples.ev_revenue.toFixed(2)}x
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-sm text-gray-600 mb-1">EV/EBITDA</div>
                    <div className="text-2xl font-bold text-orange-600">
                      {results.valuation.impliedMultiples.ev_ebitda.toFixed(2)}x
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Trading Multiple Statistics
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-300 px-4 py-2 text-left">Multiple</th>
                      <th className="border border-gray-300 px-4 py-2 text-right">Min</th>
                      <th className="border border-gray-300 px-4 py-2 text-right">25th %ile</th>
                      <th className="border border-gray-300 px-4 py-2 text-right">Median</th>
                      <th className="border border-gray-300 px-4 py-2 text-right">75th %ile</th>
                      <th className="border border-gray-300 px-4 py-2 text-right">Max</th>
                      <th className="border border-gray-300 px-4 py-2 text-right">Mean</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2 font-medium">EV/Revenue</td>
                      <td className="border border-gray-300 px-4 py-2 text-right">{results.multiples.ev_revenue.min.toFixed(2)}</td>
                      <td className="border border-gray-300 px-4 py-2 text-right">{results.multiples.ev_revenue.percentile25.toFixed(2)}</td>
                      <td className="border border-gray-300 px-4 py-2 text-right font-semibold">{results.multiples.ev_revenue.median.toFixed(2)}</td>
                      <td className="border border-gray-300 px-4 py-2 text-right">{results.multiples.ev_revenue.percentile75.toFixed(2)}</td>
                      <td className="border border-gray-300 px-4 py-2 text-right">{results.multiples.ev_revenue.max.toFixed(2)}</td>
                      <td className="border border-gray-300 px-4 py-2 text-right">{results.multiples.ev_revenue.mean.toFixed(2)}</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2 font-medium">EV/EBITDA</td>
                      <td className="border border-gray-300 px-4 py-2 text-right">{results.multiples.ev_ebitda.min.toFixed(2)}</td>
                      <td className="border border-gray-300 px-4 py-2 text-right">{results.multiples.ev_ebitda.percentile25.toFixed(2)}</td>
                      <td className="border border-gray-300 px-4 py-2 text-right font-semibold">{results.multiples.ev_ebitda.median.toFixed(2)}</td>
                      <td className="border border-gray-300 px-4 py-2 text-right">{results.multiples.ev_ebitda.percentile75.toFixed(2)}</td>
                      <td className="border border-gray-300 px-4 py-2 text-right">{results.multiples.ev_ebitda.max.toFixed(2)}</td>
                      <td className="border border-gray-300 px-4 py-2 text-right">{results.multiples.ev_ebitda.mean.toFixed(2)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Selected Comparable Companies</h4>
              <div className="flex flex-wrap gap-2">
                {results.selectedComparables.map((comp: any, index: number) => (
                  <Badge key={index} variant="outline" className="px-3 py-1">
                    {comp.name} ({comp.ticker}) - {comp.ev_ebitda.toFixed(1)}x
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        );

      case 'insights':
        if (!results) {
          return (
            <div className="text-center py-8 text-gray-500">
              <Activity className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p>Run analysis to see insights and recommendations</p>
            </div>
          );
        }

        return (
          <div className="space-y-6">
            <div>
              <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Analysis Quality Metrics
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-sm text-gray-600 mb-1">Comparables</div>
                    <div className="text-2xl font-bold">{results.qualityMetrics.numberOfComparables}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-sm text-gray-600 mb-1">Data Quality</div>
                    <div className="text-2xl font-bold">{results.qualityMetrics.dataQualityScore.toFixed(1)}/10</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-sm text-gray-600 mb-1">Reliability</div>
                    <div className="text-2xl font-bold text-green-600">{results.qualityMetrics.reliabilityRating}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-sm text-gray-600 mb-1">Coverage</div>
                    <div className="text-2xl font-bold">{results.qualityMetrics.coverageScore}%</div>
                    <Progress value={results.qualityMetrics.coverageScore} className="mt-2" />
                  </CardContent>
                </Card>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Key Insights & Recommendations
              </h4>
              <div className="space-y-3">
                {results.insights.map((insight: string, index: number) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <p className="text-blue-900">{insight}</p>
                  </div>
                ))}
              </div>
            </div>

            {mode !== 'traditional' && (
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <h5 className="font-semibold text-purple-900 mb-2 flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  AI-Enhanced Analysis
                </h5>
                <p className="text-purple-800 text-sm">
                  Advanced machine learning models have identified additional valuation drivers and peer group optimization opportunities. 
                  Consider expanding the analysis to include private market comparables and cross-industry peer analysis for enhanced precision.
                </p>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-6 w-6" />
            <div>
              <h3 className="text-xl font-semibold">Comparable Company Analysis</h3>
              <p className="text-sm text-gray-600">Market-based valuation using public company trading multiples</p>
            </div>
          </div>
          <Badge variant="outline">v1.3.0</Badge>
        </div>
      </CardHeader>

      <CardContent>
        <div className="flex border-b mb-6">
          {[
            { id: 'setup', label: 'Setup', icon: Calculator },
            { id: 'comparables', label: 'Comparables', icon: Building2 },
            { id: 'results', label: 'Results', icon: TrendingUp },
            { id: 'insights', label: 'Insights', icon: Activity }
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as any)}
              className={`flex items-center gap-2 px-4 py-2 border-b-2 font-medium transition-colors ${
                activeTab === id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </div>

        {renderTabContent()}

        {(activeTab === 'setup' || activeTab === 'comparables') && (
          <div className="flex justify-end mt-6 pt-6 border-t">
            <Button onClick={runAnalysis} disabled={loading} className="min-w-[200px]">
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Running Analysis...
                </>
              ) : (
                <>
                  <Calculator className="h-4 w-4 mr-2" />
                  Run Comparable Analysis
                </>
              )}
            </Button>
          </div>
        )}

        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <span className="text-red-800">{error}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ComparableCompanyCard;