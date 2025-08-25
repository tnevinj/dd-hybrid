'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  Target,
  DollarSign,
  Calendar,
  Users,
  Building,
  Zap,
  AlertTriangle,
  CheckCircle,
  Eye,
  Download,
  RefreshCw,
  ArrowUp,
  ArrowDown,
  Minus
} from 'lucide-react';
import { formatCurrency, formatPercentage } from '@/lib/utils';

interface ComparableCompany {
  id: string;
  name: string;
  sector: string;
  revenue: number;
  ebitda: number;
  employees: number;
  founded: number;
  geography: string;
  stage: string;
  lastFunding: {
    amount: number;
    date: Date;
    round: string;
    valuation: number;
  };
  metrics: {
    revenueMultiple: number;
    ebitdaMultiple: number;
    revenueGrowth: number;
    ebitdaMargin: number;
    employeeProductivity: number;
  };
  similarity: number; // 0-100
}

interface ValuationAnalysis {
  targetCompany: string;
  proposedValuation: number;
  comparableValuations: {
    method: string;
    valuation: number;
    confidence: number;
    rationale: string;
  }[];
  marketTiming: {
    sector: string;
    momentum: 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE';
    timing: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR';
    reasoning: string;
  };
  riskAdjustment: {
    factor: string;
    adjustment: number;
    reasoning: string;
  }[];
  recommendation: {
    action: 'BUY' | 'HOLD' | 'PASS';
    confidence: number;
    targetPrice: number;
    upside: number;
    reasoning: string;
  };
}

interface ComparativeValuationAnalysisProps {
  opportunityId: string;
  opportunityData?: any;
  navigationMode?: 'traditional' | 'assisted' | 'autonomous';
}

export function ComparativeValuationAnalysis({ 
  opportunityId, 
  opportunityData, 
  navigationMode = 'traditional' 
}: ComparativeValuationAnalysisProps) {
  const [comparables, setComparables] = useState<ComparableCompany[]>([]);
  const [analysis, setAnalysis] = useState<ValuationAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSector, setSelectedSector] = useState<string>('all');
  const [selectedTab, setSelectedTab] = useState('comparables');

  useEffect(() => {
    loadComparativeAnalysis();
  }, [opportunityId, selectedSector]);

  const loadComparativeAnalysis = async () => {
    try {
      setLoading(true);
      
      // Mock comparative analysis data - in production this would use market data APIs
      const mockComparables: ComparableCompany[] = [
        {
          id: 'comp-1',
          name: 'TechCorp Alpha',
          sector: 'Software',
          revenue: 45000000,
          ebitda: 12000000,
          employees: 280,
          founded: 2018,
          geography: 'North America',
          stage: 'Series B',
          lastFunding: {
            amount: 35000000,
            date: new Date('2024-02-15'),
            round: 'Series B',
            valuation: 180000000
          },
          metrics: {
            revenueMultiple: 4.0,
            ebitdaMultiple: 15.0,
            revenueGrowth: 45,
            ebitdaMargin: 26.7,
            employeeProductivity: 160714
          },
          similarity: 92
        },
        {
          id: 'comp-2',
          name: 'DataFlow Inc',
          sector: 'Software',
          revenue: 38000000,
          ebitda: 9500000,
          employees: 220,
          founded: 2019,
          geography: 'North America',
          stage: 'Series B',
          lastFunding: {
            amount: 28000000,
            date: new Date('2024-01-20'),
            round: 'Series B',
            valuation: 150000000
          },
          metrics: {
            revenueMultiple: 3.95,
            ebitdaMultiple: 15.8,
            revenueGrowth: 38,
            ebitdaMargin: 25.0,
            employeeProductivity: 172727
          },
          similarity: 89
        },
        {
          id: 'comp-3',
          name: 'CloudTech Solutions',
          sector: 'Software',
          revenue: 52000000,
          ebitda: 15600000,
          employees: 340,
          founded: 2017,
          geography: 'Europe',
          stage: 'Series C',
          lastFunding: {
            amount: 55000000,
            date: new Date('2023-11-10'),
            round: 'Series C',
            valuation: 220000000
          },
          metrics: {
            revenueMultiple: 4.23,
            ebitdaMultiple: 14.1,
            revenueGrowth: 28,
            ebitdaMargin: 30.0,
            employeeProductivity: 152941
          },
          similarity: 85
        },
        {
          id: 'comp-4',
          name: 'AI Dynamics',
          sector: 'Software',
          revenue: 41000000,
          ebitda: 10250000,
          employees: 195,
          founded: 2018,
          geography: 'North America',
          stage: 'Series B',
          lastFunding: {
            amount: 32000000,
            date: new Date('2024-03-05'),
            round: 'Series B',
            valuation: 165000000
          },
          metrics: {
            revenueMultiple: 4.02,
            ebitdaMultiple: 16.1,
            revenueGrowth: 52,
            ebitdaMargin: 25.0,
            employeeProductivity: 210256
          },
          similarity: 87
        }
      ];

      const mockAnalysis: ValuationAnalysis = {
        targetCompany: 'TechStartup Beta',
        proposedValuation: 200000000,
        comparableValuations: [
          {
            method: 'Revenue Multiple',
            valuation: 185000000,
            confidence: 85,
            rationale: 'Based on median 4.1x revenue multiple of comparable companies'
          },
          {
            method: 'EBITDA Multiple',
            valuation: 195000000,
            confidence: 88,
            rationale: 'Using 15.2x EBITDA multiple adjusted for growth premium'
          },
          {
            method: 'DCF Model',
            valuation: 210000000,
            confidence: 75,
            rationale: 'NPV of projected cash flows with 12% discount rate'
          },
          {
            method: 'Precedent Transactions',
            valuation: 178000000,
            confidence: 80,
            rationale: 'Average of 8 similar deals in past 18 months'
          }
        ],
        marketTiming: {
          sector: 'Software',
          momentum: 'POSITIVE',
          timing: 'GOOD',
          reasoning: 'Software sector showing strong fundamentals with 25% average growth. Recent funding rounds at premium valuations.'
        },
        riskAdjustment: [
          {
            factor: 'Customer Concentration',
            adjustment: -8,
            reasoning: 'Top 3 customers represent 65% of revenue vs. 45% peer average'
          },
          {
            factor: 'Management Team',
            adjustment: +12,
            reasoning: 'Experienced team with 2 previous successful exits'
          },
          {
            factor: 'Market Position',
            adjustment: +5,
            reasoning: 'Strong competitive moat with proprietary technology'
          }
        ],
        recommendation: {
          action: 'BUY',
          confidence: 78,
          targetPrice: 190000000,
          upside: 23,
          reasoning: 'Strong fundamentals, experienced team, and favorable market conditions support investment thesis despite customer concentration risk.'
        }
      };

      setComparables(mockComparables);
      setAnalysis(mockAnalysis);
    } catch (error) {
      console.error('Error loading comparative analysis:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRecommendationColor = (action: string) => {
    switch (action) {
      case 'BUY': return 'bg-green-100 text-green-800';
      case 'HOLD': return 'bg-yellow-100 text-yellow-800';
      case 'PASS': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderComparablesTab = () => (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Select value={selectedSector} onValueChange={setSelectedSector}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select sector" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sectors</SelectItem>
              <SelectItem value="software">Software</SelectItem>
              <SelectItem value="hardware">Hardware</SelectItem>
              <SelectItem value="fintech">Fintech</SelectItem>
              <SelectItem value="healthcare">Healthcare</SelectItem>
            </SelectContent>
          </Select>
          <Badge variant="outline">{comparables.length} companies found</Badge>
        </div>
        <Button onClick={loadComparativeAnalysis} size="sm" className="flex items-center gap-2">
          <RefreshCw className="h-4 w-4" />
          Refresh Data
        </Button>
      </div>

      {/* Comparables Table */}
      <div className="grid gap-4">
        {comparables.map((company) => (
          <Card key={company.id} className="border-l-4 border-l-blue-500">
            <CardContent className="p-4">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-lg">{company.name}</h3>
                    <Badge variant="outline">{company.similarity}% match</Badge>
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div>Sector: {company.sector}</div>
                    <div>Stage: {company.stage}</div>
                    <div>Founded: {company.founded}</div>
                    <div>Geography: {company.geography}</div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2 text-gray-700">Financial Metrics</h4>
                  <div className="text-sm space-y-1">
                    <div className="flex justify-between">
                      <span>Revenue:</span>
                      <span className="font-medium">{formatCurrency(company.revenue)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>EBITDA:</span>
                      <span className="font-medium">{formatCurrency(company.ebitda)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Employees:</span>
                      <span className="font-medium">{company.employees.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2 text-gray-700">Valuation Metrics</h4>
                  <div className="text-sm space-y-1">
                    <div className="flex justify-between">
                      <span>Revenue Multiple:</span>
                      <span className="font-medium">{company.metrics.revenueMultiple.toFixed(1)}x</span>
                    </div>
                    <div className="flex justify-between">
                      <span>EBITDA Multiple:</span>
                      <span className="font-medium">{company.metrics.ebitdaMultiple.toFixed(1)}x</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Last Valuation:</span>
                      <span className="font-medium">{formatCurrency(company.lastFunding.valuation)}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2 text-gray-700">Growth Metrics</h4>
                  <div className="text-sm space-y-1">
                    <div className="flex justify-between">
                      <span>Revenue Growth:</span>
                      <span className="font-medium text-green-600">
                        {formatPercentage(company.metrics.revenueGrowth / 100)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>EBITDA Margin:</span>
                      <span className="font-medium">
                        {formatPercentage(company.metrics.ebitdaMargin / 100)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Productivity:</span>
                      <span className="font-medium">{formatCurrency(company.metrics.employeeProductivity)}/emp</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderValuationTab = () => {
    if (!analysis) return null;

    return (
      <div className="space-y-6">
        {/* Valuation Summary */}
        <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-xl text-blue-800">
              <Target className="h-6 w-6" />
              Valuation Analysis Summary
            </CardTitle>
            <CardDescription className="text-blue-700">
              Multi-method valuation analysis for {analysis.targetCompany}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {formatCurrency(analysis.proposedValuation)}
                </div>
                <p className="text-sm text-blue-700">Proposed Valuation</p>
              </div>
              
              <div>
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {formatCurrency(analysis.recommendation.targetPrice)}
                </div>
                <p className="text-sm text-green-700">Recommended Target Price</p>
              </div>
              
              <div>
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {formatPercentage(analysis.recommendation.upside / 100)}
                </div>
                <p className="text-sm text-blue-700">Potential Upside</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Valuation Methods */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Valuation Methodologies
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analysis.comparableValuations.map((method, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">{method.method}</h4>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{method.confidence}% confidence</Badge>
                      <span className="font-bold text-lg">{formatCurrency(method.valuation)}</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">{method.rationale}</p>
                  <Progress value={method.confidence} className="mt-2 h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Risk Adjustments */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Risk Adjustments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analysis.riskAdjustment.map((risk, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <h5 className="font-medium">{risk.factor}</h5>
                    <p className="text-sm text-gray-600">{risk.reasoning}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {risk.adjustment > 0 ? (
                      <ArrowUp className="h-4 w-4 text-green-600" />
                    ) : risk.adjustment < 0 ? (
                      <ArrowDown className="h-4 w-4 text-red-600" />
                    ) : (
                      <Minus className="h-4 w-4 text-gray-600" />
                    )}
                    <span className={`font-semibold ${
                      risk.adjustment > 0 ? 'text-green-600' : 
                      risk.adjustment < 0 ? 'text-red-600' : 
                      'text-gray-600'
                    }`}>
                      {risk.adjustment > 0 ? '+' : ''}{risk.adjustment}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderRecommendationTab = () => {
    if (!analysis) return null;

    return (
      <div className="space-y-6">
        {/* Investment Recommendation */}
        <Card className={`border-2 ${
          analysis.recommendation.action === 'BUY' ? 'border-green-200 bg-gradient-to-r from-green-50 to-emerald-50' :
          analysis.recommendation.action === 'HOLD' ? 'border-yellow-200 bg-gradient-to-r from-yellow-50 to-orange-50' :
          'border-red-200 bg-gradient-to-r from-red-50 to-pink-50'
        }`}>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Target className="h-6 w-6" />
                Investment Recommendation
              </div>
              <Badge className={getRecommendationColor(analysis.recommendation.action)}>
                {analysis.recommendation.action}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="space-y-4">
                  <div>
                    <span className="text-sm text-gray-600">Confidence Level</span>
                    <div className="flex items-center gap-2 mt-1">
                      <Progress value={analysis.recommendation.confidence} className="flex-1 h-3" />
                      <span className="font-semibold">{analysis.recommendation.confidence}%</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Target Price:</span>
                      <div className="font-semibold text-lg">{formatCurrency(analysis.recommendation.targetPrice)}</div>
                    </div>
                    <div>
                      <span className="text-gray-600">Upside Potential:</span>
                      <div className="font-semibold text-lg text-green-600">
                        {formatPercentage(analysis.recommendation.upside / 100)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-3">Reasoning</h4>
                <p className="text-sm text-gray-700">{analysis.recommendation.reasoning}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Market Timing */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Market Timing Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold mb-2">{analysis.marketTiming.sector}</div>
                <p className="text-sm text-gray-600">Target Sector</p>
              </div>
              
              <div className="text-center">
                <Badge variant={
                  analysis.marketTiming.momentum === 'POSITIVE' ? 'default' :
                  analysis.marketTiming.momentum === 'NEUTRAL' ? 'secondary' :
                  'destructive'
                } className="text-base px-4 py-2">
                  {analysis.marketTiming.momentum}
                </Badge>
                <p className="text-sm text-gray-600 mt-2">Market Momentum</p>
              </div>
              
              <div className="text-center">
                <Badge variant={
                  analysis.marketTiming.timing === 'EXCELLENT' ? 'default' :
                  analysis.marketTiming.timing === 'GOOD' ? 'secondary' :
                  analysis.marketTiming.timing === 'FAIR' ? 'outline' :
                  'destructive'
                } className="text-base px-4 py-2">
                  {analysis.marketTiming.timing}
                </Badge>
                <p className="text-sm text-gray-600 mt-2">Investment Timing</p>
              </div>
            </div>
            
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">{analysis.marketTiming.reasoning}</p>
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Recommended Next Steps
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                'Schedule management presentation and Q&A session',
                'Conduct detailed financial due diligence',
                'Review customer concentration risk mitigation plan',
                'Negotiate terms based on recommended target price',
                'Prepare IC presentation with comparative analysis'
              ].map((step, index) => (
                <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                  <div className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-xs font-semibold">
                    {index + 1}
                  </div>
                  <span className="text-sm">{step}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-3">
          <BarChart3 className="h-8 w-8 animate-pulse text-blue-600" />
          <span className="text-lg">Loading comparative analysis...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <BarChart3 className="h-7 w-7 text-blue-600" />
            Comparative Valuation Analysis
          </h2>
          <p className="text-gray-600 mt-1">
            Market-driven valuation with peer benchmarking
          </p>
        </div>
      </div>

      {/* Analysis Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="comparables">Comparable Companies</TabsTrigger>
          <TabsTrigger value="valuation">Valuation Methods</TabsTrigger>
          <TabsTrigger value="recommendation">Recommendation</TabsTrigger>
        </TabsList>

        <TabsContent value="comparables" className="mt-6">
          {renderComparablesTab()}
        </TabsContent>

        <TabsContent value="valuation" className="mt-6">
          {renderValuationTab()}
        </TabsContent>

        <TabsContent value="recommendation" className="mt-6">
          {renderRecommendationTab()}
        </TabsContent>
      </Tabs>
    </div>
  );
}