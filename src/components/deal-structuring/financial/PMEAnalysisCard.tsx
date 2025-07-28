'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp,
  Calculator,
  Download,
  AlertCircle,
  CheckCircle,
  Zap,
  DollarSign,
  Target,
  Activity,
  BarChart3,
  Settings,
  Shield,
  Percent,
  Plus,
  Trash2,
  Edit2,
  Info,
  GitCompare as Compare,
  FolderOpen as Portfolio,
  LineChart,
  PieChart,
  Star
} from 'lucide-react';

interface PMEAnalysisCardProps {
  dealId: string;
  mode?: string;
  onResultsChange?: (results: any) => void;
}

interface PMEInvestment {
  investmentId: string;
  investmentName: string;
  fundName: string;
  strategy: 'buyout' | 'growth' | 'venture' | 'credit' | 'real_estate' | 'infrastructure';
  geography: 'north_america' | 'europe' | 'asia' | 'global' | 'emerging_markets';
  sector: string;
  vintageYear: number;
  totalContributions: number;
  totalDistributions: number;
  currentNAV: number;
  irr: number;
  multiple: number;
  dpi: number;
  rvpi: number;
  tvpi: number;
}

interface PMEBenchmark {
  benchmarkId: string;
  benchmarkName: string;
  description: string;
  benchmarkType: 'broad_market' | 'sector_specific' | 'size_specific' | 'style_specific' | 'custom';
  ticker?: string;
  annualizedReturn: number;
  volatility: number;
  sharpeRatio: number;
}

interface PMEResults {
  executiveSummary: {
    portfolioIRR: number;
    portfolioMultiple: number;
    benchmarkIRR: number;
    benchmarkMultiple: number;
    primaryPMERatio: number;
    conclusion: 'outperformed' | 'matched' | 'underperformed';
    outperformance: number;
    numberOfInvestments: number;
    totalCommitted: number;
    totalDistributed: number;
    currentNAV: number;
  };
  pmeCalculations: Array<{
    methodology: string;
    investmentValue: number;
    benchmarkValue: number;
    pmeRatio: number;
    pmeExcess: number;
    pmeExcessPercentage: number;
  }>;
  investmentAnalysis: Array<{
    investmentId: string;
    investmentName: string;
    investmentIRR: number;
    benchmarkIRR: number;
    excessIRR: number;
    investmentMultiple: number;
    benchmarkMultiple: number;
    excessMultiple: number;
  }>;
  sectorAnalysis: {
    sectorBreakdown: Array<{
      sector: string;
      numberOfInvestments: number;
      totalValue: number;
      percentageOfPortfolio: number;
      sectorPME: number;
      pmeExcess: number;
    }>;
    attribution: Array<{
      sector: string;
      contributionToPME: number;
      allocationEffect: number;
      selectionEffect: number;
    }>;
  };
  vintageAnalysis: {
    vintageBreakdown: Array<{
      vintageYear: number;
      numberOfInvestments: number;
      percentageOfPortfolio: number;
      vintageIRR: number;
      benchmarkIRR: number;
      excessIRR: number;
      pmeRatio: number;
    }>;
  };
  keyInsights: {
    performanceInsights: string[];
    riskInsights: string[];
    attributionInsights: string[];
    sectorInsights: string[];
    vintageInsights: string[];
    overallConclusion: string;
    methodology: string;
    limitations: string[];
  };
  analysisQuality: {
    dataQuality: number;
    benchmarkRelevance: number;
    timeSeriesCompleteness: number;
    statisticalSignificance: number;
    overallConfidence: 'high' | 'medium' | 'low';
  };
}

const PMEAnalysisCard: React.FC<PMEAnalysisCardProps> = ({ 
  dealId, 
  mode = 'traditional',
  onResultsChange 
}) => {
  const [inputs, setInputs] = useState({
    analysisName: 'PME Analysis - Private Equity Portfolio',
    baseCurrency: 'USD',
    primaryBenchmarkId: 'sp500'
  });

  const [investments, setInvestments] = useState<PMEInvestment[]>([
    {
      investmentId: 'inv_001',
      investmentName: 'TechCorp Solutions',
      fundName: 'Growth Equity Fund III',
      strategy: 'growth',
      geography: 'north_america',
      sector: 'Technology',
      vintageYear: 2019,
      totalContributions: 18000000,
      totalDistributions: 20000000,
      currentNAV: 28000000,
      irr: 0.185,
      multiple: 2.67,
      dpi: 1.11,
      rvpi: 1.56,
      tvpi: 2.67
    },
    {
      investmentId: 'inv_002',
      investmentName: 'MedDevice Innovations',
      fundName: 'Healthcare Buyout Fund II',
      strategy: 'buyout',
      geography: 'europe',
      sector: 'Healthcare',
      vintageYear: 2020,
      totalContributions: 27000000,
      totalDistributions: 8000000,
      currentNAV: 32000000,
      irr: 0.145,
      multiple: 1.48,
      dpi: 0.30,
      rvpi: 1.19,
      tvpi: 1.48
    }
  ]);

  const [benchmarks, setBenchmarks] = useState<PMEBenchmark[]>([
    {
      benchmarkId: 'sp500',
      benchmarkName: 'S&P 500 Total Return',
      description: 'S&P 500 index with dividends reinvested',
      benchmarkType: 'broad_market',
      ticker: 'SPY',
      annualizedReturn: 0.125,
      volatility: 0.18,
      sharpeRatio: 0.67
    },
    {
      benchmarkId: 'russell2000',
      benchmarkName: 'Russell 2000',
      description: 'Small-cap equity benchmark',
      benchmarkType: 'size_specific',
      ticker: 'IWM',
      annualizedReturn: 0.089,
      volatility: 0.22,
      sharpeRatio: 0.35
    }
  ]);

  const [analysisSettings, setAnalysisSettings] = useState({
    pmeMethodologies: ['ks_pme', 'direct_alpha', 'ln_pme'],
    includeRiskAdjustment: true,
    includeAttributionAnalysis: true,
    includeSectorAnalysis: true,
    includeVintageAnalysis: true,
    riskFreeRate: 0.025
  });

  const [results, setResults] = useState<PMEResults | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [activeTab, setActiveTab] = useState('portfolio');

  const runAnalysis = () => {
    setIsCalculating(true);
    
    setTimeout(() => {
      // Mock PME analysis results
      const analysisResults: PMEResults = {
        executiveSummary: {
          portfolioIRR: 0.165,
          portfolioMultiple: 2.08,
          benchmarkIRR: 0.125,
          benchmarkMultiple: 1.68,
          primaryPMERatio: 1.24,
          conclusion: 'outperformed',
          outperformance: 400,
          numberOfInvestments: investments.length,
          totalCommitted: investments.reduce((sum, inv) => sum + inv.totalContributions, 0),
          totalDistributed: investments.reduce((sum, inv) => sum + inv.totalDistributions, 0),
          currentNAV: investments.reduce((sum, inv) => sum + inv.currentNAV, 0)
        },
        pmeCalculations: [
          {
            methodology: 'Kaplan-Schoar PME',
            investmentValue: 88000000,
            benchmarkValue: 71000000,
            pmeRatio: 1.24,
            pmeExcess: 17000000,
            pmeExcessPercentage: 23.9
          },
          {
            methodology: 'Direct Alpha',
            investmentValue: 88000000,
            benchmarkValue: 73500000,
            pmeRatio: 1.20,
            pmeExcess: 14500000,
            pmeExcessPercentage: 19.7
          },
          {
            methodology: 'Long-Nickels PME',
            investmentValue: 88000000,
            benchmarkValue: 69500000,
            pmeRatio: 1.27,
            pmeExcess: 18500000,
            pmeExcessPercentage: 26.6
          }
        ],
        investmentAnalysis: investments.map(inv => ({
          investmentId: inv.investmentId,
          investmentName: inv.investmentName,
          investmentIRR: inv.irr,
          benchmarkIRR: inv.sector === 'Technology' ? 0.142 : 0.108,
          excessIRR: inv.irr - (inv.sector === 'Technology' ? 0.142 : 0.108),
          investmentMultiple: inv.multiple,
          benchmarkMultiple: inv.sector === 'Technology' ? 1.85 : 1.52,
          excessMultiple: inv.multiple - (inv.sector === 'Technology' ? 1.85 : 1.52)
        })),
        sectorAnalysis: {
          sectorBreakdown: [
            {
              sector: 'Technology',
              numberOfInvestments: 1,
              totalValue: 48000000,
              percentageOfPortfolio: 54.5,
              sectorPME: 1.44,
              pmeExcess: 15200000
            },
            {
              sector: 'Healthcare',
              numberOfInvestments: 1,
              totalValue: 40000000,
              percentageOfPortfolio: 45.5,
              sectorPME: 0.97,
              pmeExcess: -1200000
            }
          ],
          attribution: [
            {
              sector: 'Technology',
              contributionToPME: 0.783,
              allocationEffect: 0.125,
              selectionEffect: 0.658
            },
            {
              sector: 'Healthcare',
              contributionToPME: -0.441,
              allocationEffect: -0.086,
              selectionEffect: -0.355
            }
          ]
        },
        vintageAnalysis: {
          vintageBreakdown: [
            {
              vintageYear: 2019,
              numberOfInvestments: 1,
              percentageOfPortfolio: 54.5,
              vintageIRR: 0.185,
              benchmarkIRR: 0.142,
              excessIRR: 0.043,
              pmeRatio: 1.44
            },
            {
              vintageYear: 2020,
              numberOfInvestments: 1,
              percentageOfPortfolio: 45.5,
              vintageIRR: 0.145,
              benchmarkIRR: 0.108,
              excessIRR: 0.037,
              pmeRatio: 0.97
            }
          ]
        },
        keyInsights: {
          performanceInsights: [
            'Portfolio outperformed public markets with PME ratio of 1.24x',
            'Technology investments drove outperformance with 44% PME excess',
            'Portfolio generated 400bps of annual alpha over benchmark',
            'Strong performance despite challenging 2020-2022 market conditions'
          ],
          riskInsights: [
            'Portfolio concentration in growth sectors increased volatility',
            'Vintage diversification helped mitigate timing risk',
            'Healthcare exposure provided defensive characteristics',
            'High correlation with public growth equity markets (0.75)'
          ],
          attributionInsights: [
            'Technology allocation contributed 78% of outperformance',
            'Security selection drove 89% of excess returns',
            'Timing effects were minimal across vintage years',
            'Healthcare sector allocation detracted from performance'
          ],
          sectorInsights: [
            'Technology sector PME of 1.44x significantly outperformed',
            'Healthcare underperformed with PME of 0.97x',
            'Sector allocation favored higher-growth opportunities',
            'Consider increasing healthcare quality exposure'
          ],
          vintageInsights: [
            '2019 vintage benefited from pre-COVID valuations',
            '2020 vintage faced challenging deployment environment',
            'Vintage diversification reduced timing risk by 23%',
            'Consider accelerated deployment in current environment'
          ],
          overallConclusion: 'The portfolio demonstrated strong performance with a PME ratio of 1.24x, generating 400bps of annual outperformance. Technology investments were the primary driver of excess returns, while sector allocation and security selection both contributed positively. The analysis suggests maintaining growth sector exposure while considering defensive additions.',
          methodology: 'Analysis based on Kaplan-Schoar PME methodology with multi-factor risk adjustments',
          limitations: [
            'Analysis limited to 2 investments - larger sample would improve statistical significance',
            'Benchmark selection may not fully capture private market risk characteristics',
            'Cash flow timing assumptions may affect PME calculations',
            'Valuation marks subject to quarterly reporting lags'
          ]
        },
        analysisQuality: {
          dataQuality: 0.85,
          benchmarkRelevance: 0.78,
          timeSeriesCompleteness: 0.92,
          statisticalSignificance: 0.71,
          overallConfidence: 'medium'
        }
      };
      
      setResults(analysisResults);
      setIsCalculating(false);
      
      if (onResultsChange) {
        onResultsChange(analysisResults);
      }
    }, 3500);
  };

  const formatCurrency = (amount: number) => {
    return `$${(amount / 1000000).toFixed(1)}M`;
  };

  const formatPercentage = (value: number) => {
    return `${(value * 100).toFixed(1)}%`;
  };

  const addInvestment = () => {
    const newInvestment: PMEInvestment = {
      investmentId: `inv_${investments.length + 1}`,
      investmentName: `New Investment ${investments.length + 1}`,
      fundName: 'New Fund',
      strategy: 'growth',
      geography: 'north_america',
      sector: 'Technology',
      vintageYear: 2022,
      totalContributions: 10000000,
      totalDistributions: 0,
      currentNAV: 12000000,
      irr: 0.12,
      multiple: 1.2,
      dpi: 0.0,
      rvpi: 1.2,
      tvpi: 1.2
    };
    setInvestments([...investments, newInvestment]);
  };

  const removeInvestment = (investmentId: string) => {
    setInvestments(investments.filter(inv => inv.investmentId !== investmentId));
  };

  const addBenchmark = () => {
    const newBenchmark: PMEBenchmark = {
      benchmarkId: `bench_${benchmarks.length + 1}`,
      benchmarkName: 'New Benchmark',
      description: 'Custom benchmark',
      benchmarkType: 'custom',
      annualizedReturn: 0.10,
      volatility: 0.16,
      sharpeRatio: 0.50
    };
    setBenchmarks([...benchmarks, newBenchmark]);
  };

  const removeBenchmark = (benchmarkId: string) => {
    if (benchmarks.length > 1) {
      setBenchmarks(benchmarks.filter(bench => bench.benchmarkId !== benchmarkId));
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Compare className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">PME Analysis</h3>
              <p className="text-sm text-gray-600">Public Market Equivalent performance comparison and analysis</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {results && (
              <Badge variant="outline" className="bg-green-50 text-green-700">
                <CheckCircle className="h-3 w-3 mr-1" />
                Analyzed
              </Badge>
            )}
            {mode !== 'traditional' && (
              <Button variant="outline" size="sm">
                <Zap className="h-4 w-4 mr-1" />
                AI Insights
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Tab Navigation */}
        <div className="flex space-x-4 border-b">
          <button
            onClick={() => setActiveTab('portfolio')}
            className={`pb-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'portfolio'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Portfolio className="h-4 w-4 inline mr-1" />
            Portfolio
          </button>
          <button
            onClick={() => setActiveTab('benchmarks')}
            className={`pb-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'benchmarks'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <TrendingUp className="h-4 w-4 inline mr-1" />
            Benchmarks
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`pb-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'settings'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Settings className="h-4 w-4 inline mr-1" />
            Settings
          </button>
          <button
            onClick={() => setActiveTab('results')}
            className={`pb-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'results'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <BarChart3 className="h-4 w-4 inline mr-1" />
            Results
          </button>
        </div>

        {/* Portfolio Tab */}
        {activeTab === 'portfolio' && (
          <div className="space-y-6">
            {/* Analysis Info */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Analysis Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Analysis Name</label>
                  <Input
                    value={inputs.analysisName}
                    onChange={(e) => setInputs(prev => ({ ...prev, analysisName: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Base Currency</label>
                  <select 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    value={inputs.baseCurrency}
                    onChange={(e) => setInputs(prev => ({ ...prev, baseCurrency: e.target.value }))}
                  >
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Analysis Date</label>
                  <Input type="date" />
                </div>
              </div>
            </div>

            {/* Investment Portfolio */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-medium text-gray-900">Investment Portfolio</h4>
                <Button variant="outline" size="sm" onClick={addInvestment}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add Investment
                </Button>
              </div>

              <div className="space-y-4">
                {investments.map((investment) => (
                  <Card key={investment.investmentId}>
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        <div>
                          <h5 className="font-medium">{investment.investmentName}</h5>
                          <p className="text-sm text-gray-600">
                            {investment.fundName} | {investment.sector} | 
                            IRR: {formatPercentage(investment.irr)} | 
                            Multiple: {investment.multiple.toFixed(1)}x
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{investment.strategy}</Badge>
                          {investments.length > 1 && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => removeInvestment(investment.investmentId)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Total Contributions:</span>
                          <div className="font-medium">{formatCurrency(investment.totalContributions)}</div>
                        </div>
                        <div>
                          <span className="text-gray-600">Total Distributions:</span>
                          <div className="font-medium">{formatCurrency(investment.totalDistributions)}</div>
                        </div>
                        <div>
                          <span className="text-gray-600">Current NAV:</span>
                          <div className="font-medium">{formatCurrency(investment.currentNAV)}</div>
                        </div>
                        <div>
                          <span className="text-gray-600">Vintage Year:</span>
                          <div className="font-medium">{investment.vintageYear}</div>
                        </div>
                        <div>
                          <span className="text-gray-600">DPI:</span>
                          <div className="font-medium">{investment.dpi.toFixed(2)}x</div>
                        </div>
                        <div>
                          <span className="text-gray-600">RVPI:</span>
                          <div className="font-medium">{investment.rvpi.toFixed(2)}x</div>
                        </div>
                        <div>
                          <span className="text-gray-600">TVPI:</span>
                          <div className="font-medium">{investment.tvpi.toFixed(2)}x</div>
                        </div>
                        <div>
                          <span className="text-gray-600">Geography:</span>
                          <div className="font-medium capitalize">{investment.geography.replace('_', ' ')}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Benchmarks Tab */}
        {activeTab === 'benchmarks' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h4 className="font-medium text-gray-900">Benchmark Configuration</h4>
              <Button variant="outline" size="sm" onClick={addBenchmark}>
                <Plus className="h-4 w-4 mr-1" />
                Add Benchmark
              </Button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Primary Benchmark</label>
              <select 
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                value={inputs.primaryBenchmarkId}
                onChange={(e) => setInputs(prev => ({ ...prev, primaryBenchmarkId: e.target.value }))}
              >
                {benchmarks.map((benchmark) => (
                  <option key={benchmark.benchmarkId} value={benchmark.benchmarkId}>
                    {benchmark.benchmarkName}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-4">
              {benchmarks.map((benchmark) => (
                <Card key={benchmark.benchmarkId}>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <div>
                        <h5 className="font-medium">
                          {benchmark.benchmarkName}
                          {benchmark.benchmarkId === inputs.primaryBenchmarkId && (
                            <Badge variant="default" className="ml-2">Primary</Badge>
                          )}
                        </h5>
                        <p className="text-sm text-gray-600">
                          {benchmark.description} | Return: {formatPercentage(benchmark.annualizedReturn)} | 
                          Volatility: {formatPercentage(benchmark.volatility)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{benchmark.benchmarkType.replace('_', ' ')}</Badge>
                        {benchmarks.length > 1 && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => removeBenchmark(benchmark.benchmarkId)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Ticker:</span>
                        <div className="font-medium">{benchmark.ticker || 'N/A'}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Annualized Return:</span>
                        <div className="font-medium">{formatPercentage(benchmark.annualizedReturn)}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Volatility:</span>
                        <div className="font-medium">{formatPercentage(benchmark.volatility)}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Sharpe Ratio:</span>
                        <div className="font-medium">{benchmark.sharpeRatio.toFixed(2)}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-3">PME Methodologies</h4>
              <div className="space-y-2">
                {[
                  { value: 'ks_pme', label: 'Kaplan-Schoar PME', description: 'Original PME methodology' },
                  { value: 'direct_alpha', label: 'Direct Alpha', description: 'Timing-adjusted PME' },
                  { value: 'ln_pme', label: 'Long-Nickels PME', description: 'Alternative discount approach' }
                ].map((method) => (
                  <label key={method.value} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={analysisSettings.pmeMethodologies.includes(method.value as any)}
                      onChange={(e) => {
                        const methodologies = e.target.checked
                          ? [...analysisSettings.pmeMethodologies, method.value as any]
                          : analysisSettings.pmeMethodologies.filter(m => m !== method.value);
                        setAnalysisSettings(prev => ({ ...prev, pmeMethodologies: methodologies }));
                      }}
                      className="mr-2"
                    />
                    <div>
                      <span className="font-medium">{method.label}</span>
                      <p className="text-sm text-gray-600">{method.description}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-3">Analysis Options</h4>
              <div className="space-y-2">
                {[
                  { key: 'includeRiskAdjustment', label: 'Include Risk Adjustment' },
                  { key: 'includeAttributionAnalysis', label: 'Include Attribution Analysis' },
                  { key: 'includeSectorAnalysis', label: 'Include Sector Analysis' },
                  { key: 'includeVintageAnalysis', label: 'Include Vintage Analysis' }
                ].map((option) => (
                  <label key={option.key} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={analysisSettings[option.key as keyof typeof analysisSettings] as boolean}
                      onChange={(e) => setAnalysisSettings(prev => ({ 
                        ...prev, 
                        [option.key]: e.target.checked 
                      }))}
                      className="mr-2"
                    />
                    <span>{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Risk-Free Rate (%)</label>
              <Input
                type="number"
                step="0.1"
                value={analysisSettings.riskFreeRate * 100}
                onChange={(e) => setAnalysisSettings(prev => ({ 
                  ...prev, 
                  riskFreeRate: Number(e.target.value) / 100 
                }))}
              />
            </div>
          </div>
        )}

        {/* Results Tab */}
        {activeTab === 'results' && (
          <div className="space-y-6">
            {!results ? (
              <div className="text-center py-8">
                <p className="text-gray-600 mb-4">Configure your portfolio and run the analysis to see results</p>
                <Button onClick={runAnalysis} disabled={isCalculating}>
                  <Calculator className="h-4 w-4 mr-2" />
                  {isCalculating ? 'Analyzing...' : 'Run PME Analysis'}
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Executive Summary */}
                <Card>
                  <CardHeader>
                    <h5 className="font-medium text-gray-900">Executive Summary</h5>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div className="text-center">
                        <div className="flex items-center justify-center mb-2">
                          <TrendingUp className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="text-2xl font-bold text-blue-600">
                          {formatPercentage(results.executiveSummary.portfolioIRR)}
                        </div>
                        <div className="text-sm text-gray-600">Portfolio IRR</div>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center mb-2">
                          <BarChart3 className="h-5 w-5 text-green-600" />
                        </div>
                        <div className="text-2xl font-bold text-green-600">
                          {results.executiveSummary.portfolioMultiple.toFixed(2)}x
                        </div>
                        <div className="text-sm text-gray-600">Portfolio Multiple</div>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center mb-2">
                          <Compare className="h-5 w-5 text-purple-600" />
                        </div>
                        <div className="text-2xl font-bold text-purple-600">
                          {results.executiveSummary.primaryPMERatio.toFixed(2)}x
                        </div>
                        <div className="text-sm text-gray-600">PME Ratio</div>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center mb-2">
                          <Target className="h-5 w-5 text-orange-600" />
                        </div>
                        <div className="text-2xl font-bold text-orange-600">
                          +{results.executiveSummary.outperformance}
                        </div>
                        <div className="text-sm text-gray-600">Outperformance (bps)</div>
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Investments:</span>
                        <div className="font-medium">{results.executiveSummary.numberOfInvestments}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Total Committed:</span>
                        <div className="font-medium">{formatCurrency(results.executiveSummary.totalCommitted)}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Total Distributed:</span>
                        <div className="font-medium">{formatCurrency(results.executiveSummary.totalDistributed)}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Current NAV:</span>
                        <div className="font-medium">{formatCurrency(results.executiveSummary.currentNAV)}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* PME Calculations */}
                <Card>
                  <CardHeader>
                    <h5 className="font-medium text-gray-900">PME Methodology Comparison</h5>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {results.pmeCalculations.map((calc, index) => (
                        <div key={index} className="p-3 border rounded-lg">
                          <div className="flex justify-between items-center mb-2">
                            <h6 className="font-medium">{calc.methodology}</h6>
                            <Badge variant={calc.pmeRatio > 1.1 ? "default" : calc.pmeRatio > 0.9 ? "outline" : "destructive"}>
                              {calc.pmeRatio.toFixed(2)}x
                            </Badge>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                            <div>
                              <span className="text-gray-600">Investment Value:</span>
                              <div className="font-medium">{formatCurrency(calc.investmentValue)}</div>
                            </div>
                            <div>
                              <span className="text-gray-600">Benchmark Value:</span>
                              <div className="font-medium">{formatCurrency(calc.benchmarkValue)}</div>
                            </div>
                            <div>
                              <span className="text-gray-600">PME Excess:</span>
                              <div className="font-medium">{formatCurrency(calc.pmeExcess)}</div>
                            </div>
                            <div>
                              <span className="text-gray-600">Excess %:</span>
                              <div className={`font-medium ${calc.pmeExcessPercentage > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {calc.pmeExcessPercentage > 0 ? '+' : ''}{calc.pmeExcessPercentage.toFixed(1)}%
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Sector Analysis */}
                {results.sectorAnalysis && (
                  <Card>
                    <CardHeader>
                      <h5 className="font-medium text-gray-900">Sector Analysis</h5>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {results.sectorAnalysis.sectorBreakdown.map((sector, index) => (
                          <div key={index} className="p-3 border rounded-lg">
                            <div className="flex justify-between items-center mb-2">
                              <h6 className="font-medium">{sector.sector}</h6>
                              <Badge variant={sector.sectorPME > 1.1 ? "default" : sector.sectorPME > 0.9 ? "outline" : "destructive"}>
                                PME: {sector.sectorPME.toFixed(2)}x
                              </Badge>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                              <div>
                                <span className="text-gray-600">Investments:</span>
                                <div className="font-medium">{sector.numberOfInvestments}</div>
                              </div>
                              <div>
                                <span className="text-gray-600">Total Value:</span>
                                <div className="font-medium">{formatCurrency(sector.totalValue)}</div>
                              </div>
                              <div>
                                <span className="text-gray-600">Portfolio %:</span>
                                <div className="font-medium">{sector.percentageOfPortfolio.toFixed(1)}%</div>
                              </div>
                              <div>
                                <span className="text-gray-600">PME Excess:</span>
                                <div className={`font-medium ${sector.pmeExcess > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                  {formatCurrency(sector.pmeExcess)}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Key Insights */}
                <Card>
                  <CardHeader>
                    <h5 className="font-medium text-gray-900">Key Insights</h5>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h6 className="font-medium text-gray-800 mb-2">Performance Insights</h6>
                        <ul className="space-y-1 text-sm">
                          {results.keyInsights.performanceInsights.map((insight, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <TrendingUp className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                              <span>{insight}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h6 className="font-medium text-gray-800 mb-2">Risk Insights</h6>
                        <ul className="space-y-1 text-sm">
                          {results.keyInsights.riskInsights.map((insight, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <Shield className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                              <span>{insight}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h6 className="font-medium text-gray-800 mb-2">Overall Conclusion</h6>
                        <p className="text-sm text-gray-700">{results.keyInsights.overallConclusion}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Analysis Quality */}
                <Card>
                  <CardHeader>
                    <h5 className="font-medium text-gray-900">Analysis Quality</h5>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <span className="text-sm text-gray-600">Data Quality</span>
                        <Progress value={results.analysisQuality.dataQuality * 100} className="mt-1" />
                        <span className="text-xs text-gray-500">{(results.analysisQuality.dataQuality * 100).toFixed(0)}%</span>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Benchmark Relevance</span>
                        <Progress value={results.analysisQuality.benchmarkRelevance * 100} className="mt-1" />
                        <span className="text-xs text-gray-500">{(results.analysisQuality.benchmarkRelevance * 100).toFixed(0)}%</span>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Completeness</span>
                        <Progress value={results.analysisQuality.timeSeriesCompleteness * 100} className="mt-1" />
                        <span className="text-xs text-gray-500">{(results.analysisQuality.timeSeriesCompleteness * 100).toFixed(0)}%</span>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Statistical Significance</span>
                        <Progress value={results.analysisQuality.statisticalSignificance * 100} className="mt-1" />
                        <span className="text-xs text-gray-500">{(results.analysisQuality.statisticalSignificance * 100).toFixed(0)}%</span>
                      </div>
                    </div>

                    <div className="mt-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">Overall Confidence:</span>
                        <Badge variant={
                          results.analysisQuality.overallConfidence === 'high' ? 'default' :
                          results.analysisQuality.overallConfidence === 'medium' ? 'outline' : 'destructive'
                        }>
                          {results.analysisQuality.overallConfidence.toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        )}

        {/* Calculate Button */}
        {activeTab !== 'results' && (
          <div className="flex justify-center">
            <Button 
              onClick={runAnalysis} 
              disabled={isCalculating}
              className="px-8"
            >
              <Calculator className="h-4 w-4 mr-2" />
              {isCalculating ? 'Running Analysis...' : 'Run PME Analysis'}
            </Button>
          </div>
        )}

        {/* AI Insights for non-traditional modes */}
        {mode !== 'traditional' && results && (
          <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-l-blue-500">
            <div className="flex items-start gap-3">
              <Zap className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h5 className="font-medium text-blue-900 mb-2">AI PME Analysis Insights</h5>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Portfolio outperformed with PME ratio of 1.24x, driven by strong technology exposure</li>
                  <li>• Consider diversifying into defensive sectors to reduce volatility</li>
                  <li>• Vintage year analysis suggests accelerated deployment opportunities</li>
                  <li>• Risk-adjusted returns exceed benchmark by 400 basis points annually</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Warning */}
        <div className="flex items-start gap-3 p-3 bg-amber-50 rounded-lg border border-amber-200">
          <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5" />
          <div className="text-sm text-amber-800">
            <strong>Note:</strong> PME analysis requires accurate cash flow timing and appropriate benchmark selection. 
            Results should be interpreted within the context of private market investment characteristics and reporting lags.
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PMEAnalysisCard;