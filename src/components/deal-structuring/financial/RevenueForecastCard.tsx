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
  Plus,
  Trash2,
  BarChart3,
  DollarSign,
  Target,
  Activity,
  Users,
  Percent,
  Globe,
  LineChart
} from 'lucide-react';

interface RevenueForecastCardProps {
  dealId: string;
  mode?: string;
  onResultsChange?: (results: any) => void;
}

interface RevenueStream {
  id: string;
  name: string;
  type: 'subscription' | 'one_time' | 'usage_based' | 'services';
  existingCustomers: number;
  customerGrowthRates: number[];
  arpcValues: number[];
  churnRates: number[];
}

interface ForecastSummary {
  totalRevenueCAGR: number;
  averageGrossMargin: number;
  averageOperatingMargin: number;
  peakRevenue: number;
}

interface PeriodForecast {
  period: string;
  totalRevenue: number;
  revenueGrowth: number;
  totalCosts: number;
  grossMargin: number;
  operatingMargin: number;
}

interface RevenueStreamAnalysis {
  streamId: string;
  streamName: string;
  totalRevenue: number;
  percentOfTotal: number;
  cagr: number;
}

interface ScenarioResult {
  totalRevenue: number;
  operatingMargin: number;
}

interface ScenarioAnalysis {
  baseCase: ScenarioResult;
  upside: ScenarioResult;
  downside: ScenarioResult;
  stress: ScenarioResult;
}

interface RevenueForecastResults {
  forecastSummary: ForecastSummary;
  periodForecasts: PeriodForecast[];
  revenueStreamAnalysis: RevenueStreamAnalysis[];
  scenarioAnalysis: ScenarioAnalysis;
  keyInsights: {
    revenueInsights: string[];
    costInsights: string[];
    recommendations: string[];
  };
}

const RevenueForecastCard: React.FC<RevenueForecastCardProps> = ({ 
  dealId, 
  mode = 'traditional',
  onResultsChange 
}) => {
  const [inputs, setInputs] = useState({
    companyName: 'Growth Company',
    industry: 'Technology',
    businessModel: 'SaaS',
    forecastPeriods: 5,
    gdpGrowth: 2.5,
    inflationRate: 3.0,
    industryGrowth: 15.0,
    competitiveIntensity: 'medium'
  });

  const [revenueStreams, setRevenueStreams] = useState<RevenueStream[]>([
    {
      id: 'stream-1',
      name: 'Subscription Revenue',
      type: 'subscription',
      existingCustomers: 1500,
      customerGrowthRates: [30, 25, 20, 15, 10],
      arpcValues: [12000, 13200, 14520, 15972, 17569],
      churnRates: [5, 4, 3.5, 3, 2.5]
    },
    {
      id: 'stream-2',
      name: 'Professional Services',
      type: 'services',
      existingCustomers: 150,
      customerGrowthRates: [20, 22, 14, 12, 12],
      arpcValues: [20000, 21000, 22050, 23153, 24310],
      churnRates: [10, 8, 7, 6, 5]
    }
  ]);

  const [results, setResults] = useState<RevenueForecastResults | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [activeTab, setActiveTab] = useState('company');

  const addRevenueStream = () => {
    const newStream: RevenueStream = {
      id: `stream-${revenueStreams.length + 1}`,
      name: `Revenue Stream ${revenueStreams.length + 1}`,
      type: 'subscription',
      existingCustomers: 100,
      customerGrowthRates: [20, 15, 10, 8, 5],
      arpcValues: [10000, 10500, 11025, 11576, 12155],
      churnRates: [5, 4, 3, 3, 3]
    };
    setRevenueStreams(prev => [...prev, newStream]);
  };

  const removeRevenueStream = (index: number) => {
    setRevenueStreams(prev => prev.filter((_, i) => i !== index));
  };

  const updateRevenueStream = (index: number, field: keyof RevenueStream, value: any) => {
    setRevenueStreams(prev => 
      prev.map((stream, i) => 
        i === index ? { ...stream, [field]: value } : stream
      )
    );
  };

  const updateGrowthRate = (streamIndex: number, yearIndex: number, value: number) => {
    setRevenueStreams(prev => 
      prev.map((stream, i) => 
        i === streamIndex 
          ? { 
              ...stream, 
              customerGrowthRates: stream.customerGrowthRates.map((rate, j) => 
                j === yearIndex ? value : rate
              )
            }
          : stream
      )
    );
  };

  const updateArpc = (streamIndex: number, yearIndex: number, value: number) => {
    setRevenueStreams(prev => 
      prev.map((stream, i) => 
        i === streamIndex 
          ? { 
              ...stream, 
              arpcValues: stream.arpcValues.map((arpc, j) => 
                j === yearIndex ? value : arpc
              )
            }
          : stream
      )
    );
  };

  const updateChurnRate = (streamIndex: number, yearIndex: number, value: number) => {
    setRevenueStreams(prev => 
      prev.map((stream, i) => 
        i === streamIndex 
          ? { 
              ...stream, 
              churnRates: stream.churnRates.map((rate, j) => 
                j === yearIndex ? value : rate
              )
            }
          : stream
      )
    );
  };

  const runAnalysis = () => {
    setIsCalculating(true);
    
    setTimeout(() => {
      // Mock revenue forecast analysis results
      const analysisResults: RevenueForecastResults = {
        forecastSummary: {
          totalRevenueCAGR: 0.245,
          averageGrossMargin: 0.78,
          averageOperatingMargin: 0.32,
          peakRevenue: 85000000
        },
        periodForecasts: [
          {
            period: 'Year 1',
            totalRevenue: 22500000,
            revenueGrowth: 0.28,
            totalCosts: 16200000,
            grossMargin: 0.72,
            operatingMargin: 0.28
          },
          {
            period: 'Year 2',
            totalRevenue: 28800000,
            revenueGrowth: 0.28,
            totalCosts: 19200000,
            grossMargin: 0.75,
            operatingMargin: 0.33
          },
          {
            period: 'Year 3',
            totalRevenue: 36500000,
            revenueGrowth: 0.27,
            totalCosts: 22600000,
            grossMargin: 0.78,
            operatingMargin: 0.38
          },
          {
            period: 'Year 4',
            totalRevenue: 45800000,
            revenueGrowth: 0.25,
            totalCosts: 26700000,
            grossMargin: 0.80,
            operatingMargin: 0.42
          },
          {
            period: 'Year 5',
            totalRevenue: 58200000,
            revenueGrowth: 0.27,
            totalCosts: 31500000,
            grossMargin: 0.82,
            operatingMargin: 0.46
          }
        ],
        revenueStreamAnalysis: [
          {
            streamId: 'stream-1',
            streamName: 'Subscription Revenue',
            totalRevenue: 45600000,
            percentOfTotal: 78.3,
            cagr: 0.265
          },
          {
            streamId: 'stream-2',
            streamName: 'Professional Services',
            totalRevenue: 12600000,
            percentOfTotal: 21.7,
            cagr: 0.185
          }
        ],
        scenarioAnalysis: {
          baseCase: {
            totalRevenue: 58200000,
            operatingMargin: 0.46
          },
          upside: {
            totalRevenue: 75660000,
            operatingMargin: 0.52
          },
          downside: {
            totalRevenue: 46560000,
            operatingMargin: 0.38
          },
          stress: {
            totalRevenue: 34920000,
            operatingMargin: 0.28
          }
        },
        keyInsights: {
          revenueInsights: [
            'Strong subscription growth trajectory',
            'Improving ARPC across all segments',
            'Declining churn rates indicate product-market fit'
          ],
          costInsights: [
            'Improving gross margins from scale',
            'Fixed cost leverage driving profitability',
            'Variable cost optimization opportunities'
          ],
          recommendations: [
            'Accelerate customer acquisition in Year 2-3',
            'Invest in upselling capabilities',
            'Optimize cost structure for scalability'
          ]
        }
      };
      
      setResults(analysisResults);
      setIsCalculating(false);
      
      if (onResultsChange) {
        onResultsChange(analysisResults);
      }
    }, 2500);
  };

  const formatCurrency = (amount: number) => {
    return `$${(amount / 1000000).toFixed(1)}M`;
  };

  const formatPercentage = (value: number) => {
    return `${(value * 100).toFixed(1)}%`;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <TrendingUp className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Revenue & Cost Forecasting</h3>
              <p className="text-sm text-gray-600">Comprehensive revenue modeling with multiple streams and drivers</p>
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
                AI Forecast
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Tab Navigation */}
        <div className="flex space-x-4 border-b">
          <button
            onClick={() => setActiveTab('company')}
            className={`pb-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'company'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Company & Settings
          </button>
          <button
            onClick={() => setActiveTab('streams')}
            className={`pb-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'streams'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Revenue Streams
          </button>
          <button
            onClick={() => setActiveTab('market')}
            className={`pb-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'market'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Market Assumptions
          </button>
        </div>

        {/* Company & Settings Tab */}
        {activeTab === 'company' && (
          <div className="space-y-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Company Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                  <Input
                    value={inputs.companyName}
                    onChange={(e) => setInputs(prev => ({ ...prev, companyName: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
                  <Input
                    value={inputs.industry}
                    onChange={(e) => setInputs(prev => ({ ...prev, industry: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Business Model</label>
                  <Input
                    value={inputs.businessModel}
                    onChange={(e) => setInputs(prev => ({ ...prev, businessModel: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Forecast Periods</label>
                  <Input
                    type="number"
                    min="3"
                    max="10"
                    value={inputs.forecastPeriods}
                    onChange={(e) => setInputs(prev => ({ ...prev, forecastPeriods: Number(e.target.value) }))}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Revenue Streams Tab */}
        {activeTab === 'streams' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-gray-900">Revenue Streams</h4>
              <Button onClick={addRevenueStream} size="sm" variant="outline">
                <Plus className="h-4 w-4 mr-1" />
                Add Stream
              </Button>
            </div>

            {revenueStreams.map((stream, streamIndex) => (
              <Card key={stream.id} className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-green-500" />
                    </div>
                    <div>
                      <h5 className="font-medium">{stream.name}</h5>
                      <p className="text-sm text-gray-600">{stream.type} revenue model</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">
                      {stream.existingCustomers} customers
                    </Badge>
                    {revenueStreams.length > 1 && (
                      <Button 
                        onClick={() => removeRevenueStream(streamIndex)}
                        size="sm"
                        variant="ghost"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Stream Name</label>
                    <Input
                      value={stream.name}
                      onChange={(e) => updateRevenueStream(streamIndex, 'name', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Revenue Type</label>
                    <select 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                      value={stream.type}
                      onChange={(e) => updateRevenueStream(streamIndex, 'type', e.target.value)}
                    >
                      <option value="subscription">Subscription</option>
                      <option value="one_time">One-time</option>
                      <option value="usage_based">Usage-based</option>
                      <option value="services">Services</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Existing Customers</label>
                    <Input
                      type="number"
                      value={stream.existingCustomers}
                      onChange={(e) => updateRevenueStream(streamIndex, 'existingCustomers', Number(e.target.value))}
                    />
                  </div>
                </div>

                {/* Customer Growth Rates */}
                <div className="mb-4">
                  <h6 className="text-sm font-medium text-gray-700 mb-2">Annual Customer Growth Rates (%)</h6>
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    {stream.customerGrowthRates.map((rate, yearIndex) => (
                      <div key={yearIndex}>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Year {yearIndex + 1}</label>
                        <Input
                          type="number"
                          step="1"
                          value={rate}
                          onChange={(e) => updateGrowthRate(streamIndex, yearIndex, Number(e.target.value))}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* ARPC Values */}
                <div className="mb-4">
                  <h6 className="text-sm font-medium text-gray-700 mb-2">Average Revenue Per Customer ($)</h6>
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    {stream.arpcValues.map((arpc, yearIndex) => (
                      <div key={yearIndex}>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Year {yearIndex + 1}</label>
                        <Input
                          type="number"
                          step="100"
                          value={arpc}
                          onChange={(e) => updateArpc(streamIndex, yearIndex, Number(e.target.value))}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Churn Rates */}
                <div>
                  <h6 className="text-sm font-medium text-gray-700 mb-2">Annual Churn Rates (%)</h6>
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    {stream.churnRates.map((churn, yearIndex) => (
                      <div key={yearIndex}>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Year {yearIndex + 1}</label>
                        <Input
                          type="number"
                          step="0.1"
                          value={churn}
                          onChange={(e) => updateChurnRate(streamIndex, yearIndex, Number(e.target.value))}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Market Assumptions Tab */}
        {activeTab === 'market' && (
          <div className="space-y-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Market & Economic Assumptions</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">GDP Growth Y1 (%)</label>
                  <Input
                    type="number"
                    step="0.1"
                    value={inputs.gdpGrowth}
                    onChange={(e) => setInputs(prev => ({ ...prev, gdpGrowth: Number(e.target.value) }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Inflation Rate Y1 (%)</label>
                  <Input
                    type="number"
                    step="0.1"
                    value={inputs.inflationRate}
                    onChange={(e) => setInputs(prev => ({ ...prev, inflationRate: Number(e.target.value) }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Industry Growth Y1 (%)</label>
                  <Input
                    type="number"
                    step="1"
                    value={inputs.industryGrowth}
                    onChange={(e) => setInputs(prev => ({ ...prev, industryGrowth: Number(e.target.value) }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Competitive Intensity</label>
                  <select 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    value={inputs.competitiveIntensity}
                    onChange={(e) => setInputs(prev => ({ ...prev, competitiveIntensity: e.target.value }))}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Calculate Button */}
        <div className="flex justify-center">
          <Button 
            onClick={runAnalysis} 
            disabled={isCalculating}
            className="px-8"
          >
            <Calculator className="h-4 w-4 mr-2" />
            {isCalculating ? 'Running Analysis...' : 'Run Revenue & Cost Forecast'}
          </Button>
        </div>

        {/* Results */}
        {results && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-gray-900">Forecast Results</h4>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-1" />
                Export
              </Button>
            </div>

            {/* Forecast Summary */}
            <Card>
              <CardHeader>
                <h5 className="font-medium text-gray-900">Forecast Summary</h5>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-2">
                      <LineChart className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="text-2xl font-bold text-blue-600">
                      {formatPercentage(results.forecastSummary.totalRevenueCAGR)}
                    </div>
                    <div className="text-sm text-gray-600">Revenue CAGR</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-2">
                      <BarChart3 className="h-5 w-5 text-green-600" />
                    </div>
                    <div className="text-2xl font-bold text-green-600">
                      {formatPercentage(results.forecastSummary.averageGrossMargin)}
                    </div>
                    <div className="text-sm text-gray-600">Avg Gross Margin</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-2">
                      <Target className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="text-2xl font-bold text-blue-600">
                      {formatPercentage(results.forecastSummary.averageOperatingMargin)}
                    </div>
                    <div className="text-sm text-gray-600">Avg Operating Margin</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-2">
                      <Activity className="h-5 w-5 text-orange-600" />
                    </div>
                    <div className="text-2xl font-bold text-orange-600">
                      {formatCurrency(results.forecastSummary.peakRevenue)}
                    </div>
                    <div className="text-sm text-gray-600">Peak Revenue</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Period Forecasts Table */}
            <Card>
              <CardHeader>
                <h5 className="font-medium text-gray-900">Period-by-Period Forecast</h5>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">Period</th>
                        <th className="text-right py-2">Revenue ($M)</th>
                        <th className="text-right py-2">Growth</th>
                        <th className="text-right py-2">Total Costs ($M)</th>
                        <th className="text-right py-2">Gross Margin</th>
                        <th className="text-right py-2">Operating Margin</th>
                      </tr>
                    </thead>
                    <tbody>
                      {results.periodForecasts.map((forecast, index) => (
                        <tr key={index} className="border-b">
                          <td className="py-2">{forecast.period}</td>
                          <td className="text-right py-2">{formatCurrency(forecast.totalRevenue)}</td>
                          <td className="text-right py-2">
                            <Badge 
                              variant={forecast.revenueGrowth > 0 ? "default" : "secondary"}
                              className="text-xs"
                            >
                              {formatPercentage(forecast.revenueGrowth)}
                            </Badge>
                          </td>
                          <td className="text-right py-2">{formatCurrency(forecast.totalCosts)}</td>
                          <td className="text-right py-2">{formatPercentage(forecast.grossMargin)}</td>
                          <td className="text-right py-2">{formatPercentage(forecast.operatingMargin)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Revenue Stream Analysis */}
            <Card>
              <CardHeader>
                <h5 className="font-medium text-gray-900">Revenue Stream Analysis</h5>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {results.revenueStreamAnalysis.map((analysis) => (
                    <div key={analysis.streamId} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <DollarSign className="h-4 w-4 text-green-500" />
                        <span className="font-medium">{analysis.streamName}</span>
                      </div>
                      <div className="text-sm text-gray-600 space-y-1">
                        <div>Total Revenue: {formatCurrency(analysis.totalRevenue)}</div>
                        <div>Share: {analysis.percentOfTotal.toFixed(1)}%</div>
                        <div>CAGR: {formatPercentage(analysis.cagr)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Scenario Analysis */}
            <Card>
              <CardHeader>
                <h5 className="font-medium text-gray-900">Scenario Analysis</h5>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">Base Case</div>
                    <div className="text-lg font-semibold text-blue-600">
                      {formatCurrency(results.scenarioAnalysis.baseCase.totalRevenue)}
                    </div>
                    <div className="text-xs text-gray-500">
                      Margin: {formatPercentage(results.scenarioAnalysis.baseCase.operatingMargin)}
                    </div>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">Upside Case</div>
                    <div className="text-lg font-semibold text-green-600">
                      {formatCurrency(results.scenarioAnalysis.upside.totalRevenue)}
                    </div>
                    <div className="text-xs text-gray-500">
                      Margin: {formatPercentage(results.scenarioAnalysis.upside.operatingMargin)}
                    </div>
                  </div>
                  <div className="p-3 bg-yellow-50 rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">Downside Case</div>
                    <div className="text-lg font-semibold text-yellow-600">
                      {formatCurrency(results.scenarioAnalysis.downside.totalRevenue)}
                    </div>
                    <div className="text-xs text-gray-500">
                      Margin: {formatPercentage(results.scenarioAnalysis.downside.operatingMargin)}
                    </div>
                  </div>
                  <div className="p-3 bg-red-50 rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">Stress Case</div>
                    <div className="text-lg font-semibold text-red-600">
                      {formatCurrency(results.scenarioAnalysis.stress.totalRevenue)}
                    </div>
                    <div className="text-xs text-gray-500">
                      Margin: {formatPercentage(results.scenarioAnalysis.stress.operatingMargin)}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Key Insights */}
            <Card>
              <CardHeader>
                <h5 className="font-medium text-gray-900">Key Insights & Recommendations</h5>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h6 className="text-sm font-medium text-gray-700 mb-2">Revenue Insights:</h6>
                    <ul className="space-y-1 text-sm text-gray-600">
                      {results.keyInsights.revenueInsights.map((insight, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-blue-500 mt-1">•</span>
                          {insight}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h6 className="text-sm font-medium text-gray-700 mb-2">Cost Insights:</h6>
                    <ul className="space-y-1 text-sm text-gray-600">
                      {results.keyInsights.costInsights.map((insight, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-green-500 mt-1">•</span>
                          {insight}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h6 className="text-sm font-medium text-gray-700 mb-2">Recommendations:</h6>
                    <ul className="space-y-1 text-sm text-gray-600">
                      {results.keyInsights.recommendations.map((rec, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-blue-500 mt-1">•</span>
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* AI Insights for non-traditional modes */}
            {mode !== 'traditional' && (
              <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-l-blue-500">
                <div className="flex items-start gap-3">
                  <Zap className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <h5 className="font-medium text-blue-900 mb-2">AI Revenue Analysis</h5>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• Subscription model shows strong unit economics with improving ARPC trajectory</li>
                      <li>• Customer acquisition cost optimization could improve ROI by 25-30%</li>
                      <li>• Consider launching premium tier to capture additional value from high-usage customers</li>
                      <li>• Professional services can be scaled more efficiently with automation tools</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Warning */}
        <div className="flex items-start gap-3 p-3 bg-amber-50 rounded-lg border border-amber-200">
          <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5" />
          <div className="text-sm text-amber-800">
            <strong>Note:</strong> Revenue forecasts are based on assumptions and market conditions. 
            Actual results may vary due to competitive dynamics, economic factors, and execution risks.
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RevenueForecastCard;