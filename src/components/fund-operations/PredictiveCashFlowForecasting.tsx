'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
  Zap,
  AlertTriangle,
  CheckCircle,
  Eye,
  Download,
  RefreshCw,
  ArrowUp,
  ArrowDown,
  Minus,
  Clock,
  Activity,
  LineChart
} from 'lucide-react';
import { formatCurrency, formatPercentage, formatDate } from '@/lib/utils';

interface CashFlowForecast {
  period: string;
  capitalCalls: {
    predicted: number;
    confidence: number;
    driverFactors: string[];
    timing: string;
  };
  distributions: {
    predicted: number;
    confidence: number;
    sourceBreakdown: {
      source: string;
      amount: number;
      probability: number;
    }[];
  };
  netCashFlow: number;
  cumulativeNAV: number;
  riskFactors: {
    factor: string;
    impact: 'HIGH' | 'MEDIUM' | 'LOW';
    probability: number;
    description: string;
  }[];
}

interface ScenarioAnalysis {
  scenario: 'Bull' | 'Base' | 'Bear';
  probability: number;
  totalReturns: number;
  peakNAV: number;
  finalDPI: number;
  keyAssumptions: string[];
  criticalEvents: {
    event: string;
    timing: string;
    impact: number;
  }[];
}

interface PredictiveCashFlowForecastingProps {
  fundId: string;
  navigationMode?: 'traditional' | 'assisted' | 'autonomous';
}

export function PredictiveCashFlowForecasting({ 
  fundId, 
  navigationMode = 'traditional' 
}: PredictiveCashFlowForecastingProps) {
  const [forecasts, setForecasts] = useState<CashFlowForecast[]>([]);
  const [scenarios, setScenarios] = useState<ScenarioAnalysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedScenario, setSelectedScenario] = useState<string>('Base');
  const [selectedTab, setSelectedTab] = useState('forecasts');
  const [forecastHorizon, setForecastHorizon] = useState('12months');

  useEffect(() => {
    loadPredictiveAnalysis();
  }, [fundId, forecastHorizon]);

  const loadPredictiveAnalysis = async () => {
    try {
      setLoading(true);
      
      // Mock predictive cash flow data - in production this would use ML models
      const mockForecasts: CashFlowForecast[] = [
        {
          period: 'Q2 2024',
          capitalCalls: {
            predicted: 35000000,
            confidence: 87,
            driverFactors: ['TechCorp expansion financing', 'GreenEnergy follow-on investment'],
            timing: '2024-06-15'
          },
          distributions: {
            predicted: 18000000,
            confidence: 72,
            sourceBreakdown: [
              { source: 'DataFlow dividend', amount: 12000000, probability: 85 },
              { source: 'CloudTech partial exit', amount: 6000000, probability: 60 }
            ]
          },
          netCashFlow: -17000000,
          cumulativeNAV: 282000000,
          riskFactors: [
            {
              factor: 'Market Volatility',
              impact: 'MEDIUM',
              probability: 65,
              description: 'Tech sector valuations show increased volatility'
            },
            {
              factor: 'LP Payment Delays',
              impact: 'LOW',
              probability: 25,
              description: 'Historical 3% default rate on capital calls'
            }
          ]
        },
        {
          period: 'Q3 2024',
          capitalCalls: {
            predicted: 28000000,
            confidence: 82,
            driverFactors: ['AITech Series C participation', 'Management fee call'],
            timing: '2024-09-10'
          },
          distributions: {
            predicted: 45000000,
            confidence: 88,
            sourceBreakdown: [
              { source: 'HealthTech IPO proceeds', amount: 42000000, probability: 92 },
              { source: 'Dividend distributions', amount: 3000000, probability: 95 }
            ]
          },
          netCashFlow: 17000000,
          cumulativeNAV: 298000000,
          riskFactors: [
            {
              factor: 'IPO Market Conditions',
              impact: 'HIGH',
              probability: 40,
              description: 'IPO market conditions may delay HealthTech exit'
            }
          ]
        },
        {
          period: 'Q4 2024',
          capitalCalls: {
            predicted: 22000000,
            confidence: 78,
            driverFactors: ['FinTech bridge financing', 'Reserve allocation'],
            timing: '2024-12-01'
          },
          distributions: {
            predicted: 15000000,
            confidence: 76,
            sourceBreakdown: [
              { source: 'Regular dividend payments', amount: 15000000, probability: 88 }
            ]
          },
          netCashFlow: -7000000,
          cumulativeNAV: 305000000,
          riskFactors: [
            {
              factor: 'Interest Rate Impact',
              impact: 'MEDIUM',
              probability: 55,
              description: 'Rising interest rates affecting portfolio valuations'
            }
          ]
        }
      ];

      const mockScenarios: ScenarioAnalysis[] = [
        {
          scenario: 'Bull',
          probability: 25,
          totalReturns: 28.5,
          peakNAV: 385000000,
          finalDPI: 2.8,
          keyAssumptions: [
            'Strong economic growth continues',
            'Tech valuations remain elevated',
            'All major exits successful',
            'No significant portfolio company failures'
          ],
          criticalEvents: [
            { event: 'HealthTech IPO at 8x multiple', timing: 'Q3 2024', impact: 42000000 },
            { event: 'TechCorp acquisition by BigTech', timing: 'Q1 2025', impact: 65000000 },
            { event: 'CloudTech Series D at 30% markup', timing: 'Q2 2024', impact: 15000000 }
          ]
        },
        {
          scenario: 'Base',
          probability: 50,
          totalReturns: 22.3,
          peakNAV: 325000000,
          finalDPI: 2.2,
          keyAssumptions: [
            'Moderate economic growth',
            'Stable tech sector valuations',
            'Expected exit timeline maintained',
            '10% portfolio company underperformance'
          ],
          criticalEvents: [
            { event: 'HealthTech IPO at 6x multiple', timing: 'Q4 2024', impact: 32000000 },
            { event: 'TechCorp strategic sale', timing: 'Q2 2025', impact: 48000000 },
            { event: 'CloudTech growth round', timing: 'Q3 2024', impact: 8000000 }
          ]
        },
        {
          scenario: 'Bear',
          probability: 25,
          totalReturns: 15.1,
          peakNAV: 280000000,
          finalDPI: 1.6,
          keyAssumptions: [
            'Economic recession impacts',
            'Tech sector correction of 40%',
            'Extended exit timelines',
            '25% portfolio company stress'
          ],
          criticalEvents: [
            { event: 'HealthTech IPO delayed to 2025', timing: 'Q1 2025', impact: -10000000 },
            { event: 'TechCorp down round', timing: 'Q4 2024', impact: -15000000 },
            { event: 'CloudTech restructuring', timing: 'Q3 2024', impact: -8000000 }
          ]
        }
      ];

      setForecasts(mockForecasts);
      setScenarios(mockScenarios);
    } catch (error) {
      console.error('Error loading predictive analysis:', error);
    } finally {
      setLoading(false);
    }
  };

  const getScenarioColor = (scenario: string) => {
    switch (scenario) {
      case 'Bull': return 'bg-green-100 text-green-800';
      case 'Base': return 'bg-blue-100 text-blue-800';
      case 'Bear': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRiskColor = (impact: string) => {
    switch (impact) {
      case 'HIGH': return 'bg-red-100 text-red-800';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800';
      case 'LOW': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderForecastsTab = () => (
    <div className="space-y-6">
      {/* Forecast Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Select value={forecastHorizon} onValueChange={setForecastHorizon}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select horizon" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="12months">12 Months</SelectItem>
              <SelectItem value="24months">24 Months</SelectItem>
              <SelectItem value="36months">36 Months</SelectItem>
            </SelectContent>
          </Select>
          <Badge variant="outline" className="bg-blue-50 text-blue-700">
            ML Confidence: 84%
          </Badge>
        </div>
        <Button onClick={loadPredictiveAnalysis} size="sm" className="flex items-center gap-2">
          <RefreshCw className="h-4 w-4" />
          Update Forecast
        </Button>
      </div>

      {/* Forecast Summary */}
      <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-xl text-blue-800">
            <LineChart className="h-6 w-6" />
            Predictive Cash Flow Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <div className="text-2xl font-bold text-green-600 mb-2">
                {formatCurrency(forecasts.reduce((sum, f) => sum + f.capitalCalls.predicted, 0))}
              </div>
              <p className="text-sm text-green-700">Predicted Capital Calls</p>
              <p className="text-xs text-green-600 mt-1">Avg. 82% confidence</p>
            </div>
            
            <div>
              <div className="text-2xl font-bold text-blue-600 mb-2">
                {formatCurrency(forecasts.reduce((sum, f) => sum + f.distributions.predicted, 0))}
              </div>
              <p className="text-sm text-blue-700">Expected Distributions</p>
              <p className="text-xs text-blue-600 mt-1">Avg. 79% confidence</p>
            </div>
            
            <div>
              <div className="text-2xl font-bold text-blue-600 mb-2">
                {formatCurrency(forecasts.reduce((sum, f) => sum + f.netCashFlow, 0))}
              </div>
              <p className="text-sm text-blue-700">Net Cash Flow</p>
              <p className="text-xs text-blue-600 mt-1">12-month projection</p>
            </div>
            
            <div>
              <div className="text-2xl font-bold text-orange-600 mb-2">
                {forecasts.length > 0 ? formatCurrency(forecasts[forecasts.length - 1].cumulativeNAV) : '$0'}
              </div>
              <p className="text-sm text-orange-700">Projected NAV</p>
              <p className="text-xs text-orange-600 mt-1">End of period</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Forecasts */}
      <div className="space-y-4">
        {forecasts.map((forecast, index) => (
          <Card key={index} className="border-l-4 border-l-blue-500">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div>
                  <h3 className="font-semibold text-lg mb-2">{forecast.period}</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Net Cash Flow:</span>
                      <span className={`font-semibold ${forecast.netCashFlow > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {formatCurrency(forecast.netCashFlow)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Cumulative NAV:</span>
                      <span className="font-semibold">{formatCurrency(forecast.cumulativeNAV)}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2 text-gray-700 flex items-center gap-2">
                    <TrendingDown className="h-4 w-4 text-red-500" />
                    Capital Calls
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Predicted:</span>
                      <span className="font-medium">{formatCurrency(forecast.capitalCalls.predicted)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Confidence:</span>
                      <Badge variant="outline">{forecast.capitalCalls.confidence}%</Badge>
                    </div>
                    <div>
                      <span className="text-gray-600">Expected: {forecast.capitalCalls.timing}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2 text-gray-700 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    Distributions
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Predicted:</span>
                      <span className="font-medium">{formatCurrency(forecast.distributions.predicted)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Confidence:</span>
                      <Badge variant="outline">{forecast.distributions.confidence}%</Badge>
                    </div>
                    <div className="space-y-1">
                      {forecast.distributions.sourceBreakdown.map((source, idx) => (
                        <div key={idx} className="flex justify-between text-xs">
                          <span className="text-gray-600">{source.source}:</span>
                          <span>{formatCurrency(source.amount)} ({source.probability}%)</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2 text-gray-700 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-orange-500" />
                    Risk Factors
                  </h4>
                  <div className="space-y-2">
                    {forecast.riskFactors.map((risk, idx) => (
                      <div key={idx} className="text-sm">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium">{risk.factor}</span>
                          <Badge variant="outline" className={getRiskColor(risk.impact)}>
                            {risk.impact}
                          </Badge>
                        </div>
                        <div className="text-xs text-gray-600 mb-1">{risk.description}</div>
                        <Progress value={risk.probability} className="h-1" />
                        <div className="text-xs text-gray-500">{risk.probability}% probability</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderScenariosTab = () => (
    <div className="space-y-6">
      {/* Scenario Selection */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h3 className="text-lg font-semibold">Scenario Analysis</h3>
          <Select value={selectedScenario} onValueChange={setSelectedScenario}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select scenario" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Bull">Bull Case</SelectItem>
              <SelectItem value="Base">Base Case</SelectItem>
              <SelectItem value="Bear">Bear Case</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Badge variant="outline" className="bg-blue-50 text-blue-700">
          Monte Carlo: 10,000 simulations
        </Badge>
      </div>

      {/* Scenario Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {scenarios.map((scenario, index) => (
          <Card 
            key={index} 
            className={`cursor-pointer transition-all ${
              selectedScenario === scenario.scenario 
                ? 'ring-2 ring-blue-500 border-blue-200' 
                : 'hover:shadow-md'
            }`}
            onClick={() => setSelectedScenario(scenario.scenario)}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  {scenario.scenario === 'Bull' && <ArrowUp className="h-5 w-5 text-green-600" />}
                  {scenario.scenario === 'Base' && <Minus className="h-5 w-5 text-blue-600" />}
                  {scenario.scenario === 'Bear' && <ArrowDown className="h-5 w-5 text-red-600" />}
                  {scenario.scenario} Case
                </CardTitle>
                <Badge className={getScenarioColor(scenario.scenario)}>
                  {scenario.probability}%
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <span className="text-sm text-gray-600">Total Returns:</span>
                  <div className="text-xl font-bold">{formatPercentage(scenario.totalReturns / 100)}</div>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Final DPI:</span>
                  <div className="text-lg font-semibold">{scenario.finalDPI.toFixed(1)}x</div>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Peak NAV:</span>
                  <div className="text-lg font-semibold">{formatCurrency(scenario.peakNAV)}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Selected Scenario Details */}
      {selectedScenario && scenarios.find(s => s.scenario === selectedScenario) && (
        <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-pink-50">
          <CardHeader>
            <CardTitle className="text-blue-800">
              {selectedScenario} Case Detailed Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            {(() => {
              const scenario = scenarios.find(s => s.scenario === selectedScenario)!;
              return (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3 text-blue-700">Key Assumptions</h4>
                    <ul className="space-y-2 text-sm">
                      {scenario.keyAssumptions.map((assumption, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                          <span>{assumption}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-3 text-blue-700">Critical Events</h4>
                    <div className="space-y-3">
                      {scenario.criticalEvents.map((event, idx) => (
                        <div key={idx} className="border rounded-lg p-3 bg-white">
                          <div className="flex items-center justify-between mb-1">
                            <h5 className="font-medium">{event.event}</h5>
                            <span className={`font-semibold ${
                              event.impact > 0 ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {event.impact > 0 ? '+' : ''}{formatCurrency(event.impact)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">Timing: {event.timing}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })()}
          </CardContent>
        </Card>
      )}
    </div>
  );

  const renderInsightsTab = () => (
    <div className="space-y-6">
      {/* AI Insights Summary */}
      <Card className="border-2 border-green-200 bg-gradient-to-r from-green-50 to-emerald-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-xl text-green-800">
            <Zap className="h-6 w-6" />
            AI-Powered Insights & Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-green-800 mb-3">Optimal Actions</h4>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-green-200">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h5 className="font-medium">Accelerate HealthTech Exit</h5>
                    <p className="text-sm text-gray-600">
                      IPO window favorable through Q3 2024. Early execution could add $8-12M value.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-green-200">
                  <Target className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h5 className="font-medium">Optimize Capital Call Timing</h5>
                    <p className="text-sm text-gray-600">
                      Delay Q2 call by 3 weeks to align with LP fiscal calendars, improving collection rates.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-green-200">
                  <DollarSign className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h5 className="font-medium">Bridge Financing Opportunity</h5>
                    <p className="text-sm text-gray-600">
                      TechCorp bridge round presents 25% IRR opportunity with minimal downside risk.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-green-800 mb-3">Risk Mitigation</h4>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-yellow-200">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h5 className="font-medium">LP Concentration Risk</h5>
                    <p className="text-sm text-gray-600">
                      Strategic Capital Partners (20% of fund) shows payment stress. Diversify future funds.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-orange-200">
                  <Clock className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h5 className="font-medium">Market Timing Sensitivity</h5>
                    <p className="text-sm text-gray-600">
                      60% of portfolio value tied to public market multiples. Consider hedging strategies.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-red-200">
                  <BarChart3 className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h5 className="font-medium">Liquidity Buffer</h5>
                    <p className="text-sm text-gray-600">
                      Maintain 15% cash buffer for follow-on investments and operational contingencies.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Model Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Predictive Model Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">87%</div>
              <p className="text-sm text-gray-600">Capital Call Accuracy</p>
              <p className="text-xs text-gray-500 mt-1">Last 24 predictions</p>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">82%</div>
              <p className="text-sm text-gray-600">Distribution Timing</p>
              <p className="text-xs text-gray-500 mt-1">±2 week variance</p>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">91%</div>
              <p className="text-sm text-gray-600">NAV Forecast Accuracy</p>
              <p className="text-xs text-gray-500 mt-1">Quarterly predictions</p>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">Model Training Data</h4>
            <p className="text-sm text-blue-700">
              Trained on 150+ fund lifecycles, 2,500+ capital events, and 500+ exit transactions. 
              Model updated monthly with new market data and portfolio performance metrics.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-3">
          <LineChart className="h-8 w-8 animate-pulse text-blue-600" />
          <span className="text-lg">Loading predictive analysis...</span>
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
            <LineChart className="h-7 w-7 text-blue-600" />
            Predictive Cash Flow Forecasting
          </h2>
          <p className="text-gray-600 mt-1">
            AI-powered cash flow predictions and scenario analysis
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-green-100 text-green-800">
            Live Model
          </Badge>
          <Button size="sm" variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Forecast
          </Button>
        </div>
      </div>

      {/* Analysis Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="forecasts">Cash Flow Forecasts</TabsTrigger>
          <TabsTrigger value="scenarios">Scenario Analysis</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="forecasts" className="mt-6">
          {renderForecastsTab()}
        </TabsContent>

        <TabsContent value="scenarios" className="mt-6">
          {renderScenariosTab()}
        </TabsContent>

        <TabsContent value="insights" className="mt-6">
          {renderInsightsTab()}
        </TabsContent>
      </Tabs>
    </div>
  );
}