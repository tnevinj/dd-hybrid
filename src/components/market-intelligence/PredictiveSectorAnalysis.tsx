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
  Brain,
  Target,
  AlertTriangle,
  CheckCircle,
  Activity,
  BarChart3,
  LineChart,
  Zap,
  Eye,
  Download,
  RefreshCw,
  ArrowUp,
  ArrowDown,
  Minus,
  Globe,
  DollarSign,
  Calendar,
  Users,
  Building,
  Lightbulb,
  Shield,
  TrendingUpIcon
} from 'lucide-react';
import { formatCurrency, formatPercentage, formatDate } from '@/lib/utils';

interface SectorForecast {
  sectorId: string;
  sectorName: string;
  currentScore: number;
  prediction: {
    performance: 'OUTPERFORM' | 'NEUTRAL' | 'UNDERPERFORM';
    confidence: number;
    timeHorizon: '3M' | '6M' | '12M';
    expectedReturn: number;
    volatilityForecast: number;
    riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  };
  drivingFactors: {
    factor: string;
    impact: number; // -100 to +100
    confidence: number;
    description: string;
    weight: number;
  }[];
  technicalIndicators: {
    momentum: number; // 0-100
    sentiment: number; // 0-100
    valuation: number; // 0-100 (higher = more expensive)
    liquidity: number; // 0-100
    correlationStrength: number; // 0-100
  };
  marketConditions: {
    macroEnvironment: 'FAVORABLE' | 'NEUTRAL' | 'CHALLENGING';
    regulatoryRisk: number; // 0-100
    geopoliticalImpact: number; // 0-100
    interestRateSensitivity: number; // 0-100
    inflationSensitivity: number; // 0-100
  };
  investmentOpportunities: {
    opportunityId: string;
    company: string;
    opportunityType: 'GROWTH' | 'VALUE' | 'TURNAROUND' | 'DEFENSIVE';
    score: number;
    estimatedReturn: number;
    riskFactor: number;
    catalysts: string[];
  }[];
  competitivePosition: {
    marketShare: number;
    growthRate: number;
    profitability: number;
    innovation: number;
    sustainability: number;
  };
}

interface CrossSectorAnalysis {
  correlationMatrix: {
    sector1: string;
    sector2: string;
    correlation: number;
    significance: number;
    trend: 'INCREASING' | 'STABLE' | 'DECREASING';
  }[];
  sectorsRotation: {
    fromSector: string;
    toSector: string;
    probability: number;
    catalysts: string[];
    timeframe: string;
  }[];
  macroThemes: {
    theme: string;
    impact: 'POSITIVE' | 'NEGATIVE' | 'MIXED';
    affectedSectors: {
      sector: string;
      impactScore: number;
      opportunities: number;
      risks: number;
    }[];
    timeline: string;
  }[];
}

interface MarketCyclePrediction {
  currentPhase: 'EARLY_CYCLE' | 'MID_CYCLE' | 'LATE_CYCLE' | 'RECESSION';
  phaseConfidence: number;
  nextPhaseTransition: {
    expectedPhase: 'EARLY_CYCLE' | 'MID_CYCLE' | 'LATE_CYCLE' | 'RECESSION';
    probability: number;
    timeframe: string;
    leadingIndicators: string[];
  };
  sectorPhaseAlignment: {
    sector: string;
    cyclicalAlignment: number; // How well sector performs in current phase
    defensiveness: number; // How defensive the sector is
    recommendation: 'OVERWEIGHT' | 'NEUTRAL' | 'UNDERWEIGHT';
  }[];
}

interface PredictiveSectorAnalysisProps {
  navigationMode?: 'traditional' | 'assisted' | 'autonomous';
}

export function PredictiveSectorAnalysis({ 
  navigationMode = 'traditional' 
}: PredictiveSectorAnalysisProps) {
  const [forecasts, setForecasts] = useState<SectorForecast[]>([]);
  const [crossSectorAnalysis, setCrossSectorAnalysis] = useState<CrossSectorAnalysis | null>(null);
  const [marketCycle, setMarketCycle] = useState<MarketCyclePrediction | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('forecasts');
  const [selectedSector, setSelectedSector] = useState<string>('');
  const [timeHorizon, setTimeHorizon] = useState<string>('6M');

  useEffect(() => {
    loadPredictiveAnalysis();
  }, [timeHorizon]);

  const loadPredictiveAnalysis = async () => {
    try {
      setLoading(true);
      
      // Mock predictive sector data - in production this would use ML models
      const mockForecasts: SectorForecast[] = [
        {
          sectorId: 'tech',
          sectorName: 'Technology',
          currentScore: 78,
          prediction: {
            performance: 'OUTPERFORM',
            confidence: 85,
            timeHorizon: timeHorizon as '3M' | '6M' | '12M',
            expectedReturn: 15.3,
            volatilityForecast: 22.1,
            riskLevel: 'MEDIUM'
          },
          drivingFactors: [
            { factor: 'AI Innovation Adoption', impact: 25, confidence: 92, description: 'Accelerating AI integration across enterprises', weight: 30 },
            { factor: 'Cloud Migration', impact: 18, confidence: 88, description: 'Continued enterprise cloud transformation', weight: 25 },
            { factor: 'Interest Rate Environment', impact: -12, confidence: 76, description: 'Higher rates impacting growth valuations', weight: 20 },
            { factor: 'Regulatory Uncertainty', impact: -8, confidence: 65, description: 'Potential antitrust actions', weight: 15 },
            { factor: 'Semiconductor Recovery', impact: 15, confidence: 81, description: 'Chip demand recovery supporting hardware', weight: 10 }
          ],
          technicalIndicators: {
            momentum: 72,
            sentiment: 68,
            valuation: 82, // Expensive
            liquidity: 95,
            correlationStrength: 73
          },
          marketConditions: {
            macroEnvironment: 'NEUTRAL',
            regulatoryRisk: 65,
            geopoliticalImpact: 45,
            interestRateSensitivity: 78,
            inflationSensitivity: 52
          },
          investmentOpportunities: [
            { opportunityId: 'ai-leader', company: 'AI Platform Leader', opportunityType: 'GROWTH', score: 88, estimatedReturn: 25.5, riskFactor: 35, catalysts: ['Enterprise AI adoption', 'New product launches'] },
            { opportunityId: 'cloud-infra', company: 'Cloud Infrastructure', opportunityType: 'GROWTH', score: 82, estimatedReturn: 18.2, riskFactor: 28, catalysts: ['Multi-cloud demand', 'Edge computing'] }
          ],
          competitivePosition: {
            marketShare: 23.5,
            growthRate: 12.8,
            profitability: 18.2,
            innovation: 91,
            sustainability: 67
          }
        },
        {
          sectorId: 'healthcare',
          sectorName: 'Healthcare',
          currentScore: 71,
          prediction: {
            performance: 'OUTPERFORM',
            confidence: 79,
            timeHorizon: timeHorizon as '3M' | '6M' | '12M',
            expectedReturn: 12.8,
            volatilityForecast: 16.5,
            riskLevel: 'LOW'
          },
          drivingFactors: [
            { factor: 'Aging Demographics', impact: 22, confidence: 95, description: 'Growing elderly population driving demand', weight: 35 },
            { factor: 'Biotech Innovation', impact: 18, confidence: 82, description: 'Breakthrough therapies entering market', weight: 25 },
            { factor: 'Healthcare Access Expansion', impact: 15, confidence: 78, description: 'Global healthcare infrastructure investment', weight: 20 },
            { factor: 'Regulatory Environment', impact: -5, confidence: 71, description: 'Drug pricing pressures', weight: 15 },
            { factor: 'Digital Health Adoption', impact: 12, confidence: 84, description: 'Telemedicine and digital therapeutics', weight: 5 }
          ],
          technicalIndicators: {
            momentum: 65,
            sentiment: 74,
            valuation: 68,
            liquidity: 82,
            correlationStrength: 58
          },
          marketConditions: {
            macroEnvironment: 'FAVORABLE',
            regulatoryRisk: 58,
            geopoliticalImpact: 25,
            interestRateSensitivity: 42,
            inflationSensitivity: 38
          },
          investmentOpportunities: [
            { opportunityId: 'biotech-innov', company: 'Biotech Innovator', opportunityType: 'GROWTH', score: 85, estimatedReturn: 22.1, riskFactor: 45, catalysts: ['FDA approvals', 'Partnership deals'] },
            { opportunityId: 'medical-devices', company: 'Medical Device Leader', opportunityType: 'DEFENSIVE', score: 78, estimatedReturn: 14.5, riskFactor: 25, catalysts: ['Aging population', 'Technology upgrades'] }
          ],
          competitivePosition: {
            marketShare: 18.3,
            growthRate: 8.5,
            profitability: 15.7,
            innovation: 82,
            sustainability: 78
          }
        },
        {
          sectorId: 'energy',
          sectorName: 'Energy',
          currentScore: 58,
          prediction: {
            performance: 'UNDERPERFORM',
            confidence: 73,
            timeHorizon: timeHorizon as '3M' | '6M' | '12M',
            expectedReturn: 3.2,
            volatilityForecast: 28.9,
            riskLevel: 'HIGH'
          },
          drivingFactors: [
            { factor: 'Energy Transition', impact: -18, confidence: 88, description: 'Shift to renewable energy sources', weight: 30 },
            { factor: 'Commodity Price Volatility', impact: -15, confidence: 82, description: 'Oil and gas price uncertainty', weight: 25 },
            { factor: 'Renewable Investment', impact: 12, confidence: 79, description: 'Growing clean energy opportunities', weight: 20 },
            { factor: 'Geopolitical Tensions', impact: 8, confidence: 76, description: 'Supply chain disruptions', weight: 15 },
            { factor: 'ESG Pressure', impact: -10, confidence: 84, description: 'Divestment and regulatory pressure', weight: 10 }
          ],
          technicalIndicators: {
            momentum: 42,
            sentiment: 38,
            valuation: 45, // Cheap
            liquidity: 76,
            correlationStrength: 69
          },
          marketConditions: {
            macroEnvironment: 'CHALLENGING',
            regulatoryRisk: 82,
            geopoliticalImpact: 78,
            interestRateSensitivity: 55,
            inflationSensitivity: 89
          },
          investmentOpportunities: [
            { opportunityId: 'renewable-leader', company: 'Renewable Energy Leader', opportunityType: 'TURNAROUND', score: 72, estimatedReturn: 18.8, riskFactor: 55, catalysts: ['Green transition', 'Government incentives'] },
            { opportunityId: 'oil-major', company: 'Integrated Oil Major', opportunityType: 'VALUE', score: 65, estimatedReturn: 8.5, riskFactor: 48, catalysts: ['Dividend yield', 'Share buybacks'] }
          ],
          competitivePosition: {
            marketShare: 15.7,
            growthRate: -2.3,
            profitability: 12.1,
            innovation: 45,
            sustainability: 32
          }
        }
      ];

      const mockCrossSectorAnalysis: CrossSectorAnalysis = {
        correlationMatrix: [
          { sector1: 'Technology', sector2: 'Healthcare', correlation: 0.45, significance: 0.82, trend: 'INCREASING' },
          { sector1: 'Technology', sector2: 'Energy', correlation: -0.23, significance: 0.67, trend: 'STABLE' },
          { sector1: 'Healthcare', sector2: 'Energy', correlation: -0.18, significance: 0.71, trend: 'DECREASING' }
        ],
        sectorsRotation: [
          { fromSector: 'Energy', toSector: 'Technology', probability: 72, catalysts: ['AI adoption', 'Energy transition'], timeframe: 'Q2 2024' },
          { fromSector: 'Financials', toSector: 'Healthcare', probability: 68, catalysts: ['Demographics', 'Innovation'], timeframe: 'H2 2024' }
        ],
        macroThemes: [
          {
            theme: 'AI Revolution',
            impact: 'POSITIVE',
            affectedSectors: [
              { sector: 'Technology', impactScore: 85, opportunities: 12, risks: 3 },
              { sector: 'Healthcare', impactScore: 72, opportunities: 8, risks: 2 },
              { sector: 'Energy', impactScore: 35, opportunities: 3, risks: 5 }
            ],
            timeline: '2024-2026'
          },
          {
            theme: 'Energy Transition',
            impact: 'MIXED',
            affectedSectors: [
              { sector: 'Energy', impactScore: -45, opportunities: 5, risks: 12 },
              { sector: 'Technology', impactScore: 28, opportunities: 6, risks: 2 },
              { sector: 'Healthcare', impactScore: 15, opportunities: 2, risks: 1 }
            ],
            timeline: '2024-2030'
          }
        ]
      };

      const mockMarketCycle: MarketCyclePrediction = {
        currentPhase: 'MID_CYCLE',
        phaseConfidence: 78,
        nextPhaseTransition: {
          expectedPhase: 'LATE_CYCLE',
          probability: 65,
          timeframe: 'Q4 2024 - Q1 2025',
          leadingIndicators: ['Yield curve flattening', 'Credit spread widening', 'Consumer confidence peaking']
        },
        sectorPhaseAlignment: [
          { sector: 'Technology', cyclicalAlignment: 72, defensiveness: 35, recommendation: 'NEUTRAL' },
          { sector: 'Healthcare', cyclicalAlignment: 85, defensiveness: 82, recommendation: 'OVERWEIGHT' },
          { sector: 'Energy', cyclicalAlignment: 45, defensiveness: 28, recommendation: 'UNDERWEIGHT' }
        ]
      };

      setForecasts(mockForecasts);
      setCrossSectorAnalysis(mockCrossSectorAnalysis);
      setMarketCycle(mockMarketCycle);
    } catch (error) {
      console.error('Error loading predictive analysis:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPerformanceColor = (performance: string) => {
    switch (performance) {
      case 'OUTPERFORM': return 'bg-green-100 text-green-800';
      case 'NEUTRAL': return 'bg-blue-100 text-blue-800';
      case 'UNDERPERFORM': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'LOW': return 'bg-green-100 text-green-800';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800';
      case 'HIGH': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderForecastsTab = () => (
    <div className="space-y-6">
      {/* Forecast Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Select value={timeHorizon} onValueChange={setTimeHorizon}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Time horizon" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3M">3 Months</SelectItem>
              <SelectItem value="6M">6 Months</SelectItem>
              <SelectItem value="12M">12 Months</SelectItem>
            </SelectContent>
          </Select>
          <Badge variant="outline" className="bg-green-50 text-green-700">
            ML Confidence: {Math.round(forecasts.reduce((sum, f) => sum + f.prediction.confidence, 0) / forecasts.length)}%
          </Badge>
        </div>
        <Button onClick={loadPredictiveAnalysis} size="sm" className="flex items-center gap-2">
          <RefreshCw className="h-4 w-4" />
          Update Forecasts
        </Button>
      </div>

      {/* Forecast Summary */}
      <Card className="border-2 border-green-200 bg-gradient-to-r from-green-50 to-emerald-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-xl text-green-800">
            <Brain className="h-6 w-6" />
            Sector Performance Predictions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <div className="text-2xl font-bold text-green-600 mb-2">
                {forecasts.filter(f => f.prediction.performance === 'OUTPERFORM').length}
              </div>
              <p className="text-sm text-green-700">Outperform Sectors</p>
              <p className="text-xs text-green-600 mt-1">Expected to beat market</p>
            </div>
            
            <div>
              <div className="text-2xl font-bold text-blue-600 mb-2">
                {forecasts.filter(f => f.prediction.performance === 'NEUTRAL').length}
              </div>
              <p className="text-sm text-blue-700">Neutral Sectors</p>
              <p className="text-xs text-blue-600 mt-1">In-line performance</p>
            </div>
            
            <div>
              <div className="text-2xl font-bold text-red-600 mb-2">
                {forecasts.filter(f => f.prediction.performance === 'UNDERPERFORM').length}
              </div>
              <p className="text-sm text-red-700">Underperform Sectors</p>
              <p className="text-xs text-red-600 mt-1">Below market returns</p>
            </div>
            
            <div>
              <div className="text-2xl font-bold text-blue-600 mb-2">
                {Math.round(forecasts.reduce((sum, f) => sum + f.prediction.expectedReturn, 0) / forecasts.length)}%
              </div>
              <p className="text-sm text-blue-700">Avg. Expected Return</p>
              <p className="text-xs text-blue-600 mt-1">{timeHorizon} horizon</p>
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
                  <h3 className="font-semibold text-lg mb-2">{forecast.sectorName}</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Prediction:</span>
                      <Badge className={getPerformanceColor(forecast.prediction.performance)}>
                        {forecast.prediction.performance}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Expected Return:</span>
                      <span className="font-semibold text-green-600">
                        {formatPercentage(forecast.prediction.expectedReturn / 100)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Risk Level:</span>
                      <Badge variant="outline" className={getRiskColor(forecast.prediction.riskLevel)}>
                        {forecast.prediction.riskLevel}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Confidence:</span>
                      <span className="font-medium">{forecast.prediction.confidence}%</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2 text-gray-700 flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-blue-500" />
                    Technical Indicators
                  </h4>
                  <div className="space-y-2">
                    {Object.entries(forecast.technicalIndicators).map(([key, value]) => (
                      <div key={key}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                          <span className="font-medium">{value}/100</span>
                        </div>
                        <Progress value={value} className="h-2" />
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2 text-gray-700 flex items-center gap-2">
                    <TrendingUpIcon className="h-4 w-4 text-green-500" />
                    Driving Factors
                  </h4>
                  <div className="space-y-2">
                    {forecast.drivingFactors.slice(0, 3).map((factor, idx) => (
                      <div key={idx} className="text-sm">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium">{factor.factor}</span>
                          <div className="flex items-center gap-1">
                            {factor.impact > 0 ? (
                              <ArrowUp className="h-3 w-3 text-green-600" />
                            ) : (
                              <ArrowDown className="h-3 w-3 text-red-600" />
                            )}
                            <span className={`text-xs ${factor.impact > 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {Math.abs(factor.impact)}
                            </span>
                          </div>
                        </div>
                        <p className="text-xs text-gray-600">{factor.description}</p>
                        <div className="flex justify-between text-xs mt-1">
                          <span className="text-gray-500">Weight: {factor.weight}%</span>
                          <span className="text-gray-500">Confidence: {factor.confidence}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2 text-gray-700 flex items-center gap-2">
                    <Target className="h-4 w-4 text-blue-500" />
                    Top Opportunities
                  </h4>
                  <div className="space-y-3">
                    {forecast.investmentOpportunities.slice(0, 2).map((opp, idx) => (
                      <div key={idx} className="p-2 bg-blue-50 rounded border">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-sm">{opp.company}</span>
                          <Badge variant="outline" className="text-xs">
                            {opp.opportunityType}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <span className="text-gray-600">Score:</span> {opp.score}/100
                          </div>
                          <div>
                            <span className="text-gray-600">Return:</span> {formatPercentage(opp.estimatedReturn / 100)}
                          </div>
                          <div>
                            <span className="text-gray-600">Risk:</span> {opp.riskFactor}/100
                          </div>
                          <div>
                            <span className="text-gray-600">Catalysts:</span> {opp.catalysts.length}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t">
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => setSelectedSector(selectedSector === forecast.sectorId ? '' : forecast.sectorId)}
                  className="text-blue-700 border-blue-300 hover:bg-blue-50"
                >
                  <Eye className="h-3 w-3 mr-1" />
                  {selectedSector === forecast.sectorId ? 'Hide' : 'Show'} Market Conditions
                </Button>
              </div>
              
              {selectedSector === forecast.sectorId && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h5 className="font-semibold mb-3">Market Environment Analysis</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h6 className="font-medium mb-2">Market Conditions</h6>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Macro Environment:</span>
                          <Badge variant="outline" className={
                            forecast.marketConditions.macroEnvironment === 'FAVORABLE' ? 'bg-green-100 text-green-800' :
                            forecast.marketConditions.macroEnvironment === 'CHALLENGING' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }>
                            {forecast.marketConditions.macroEnvironment}
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>Interest Rate Sensitivity:</span>
                          <span>{forecast.marketConditions.interestRateSensitivity}/100</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Regulatory Risk:</span>
                          <span>{forecast.marketConditions.regulatoryRisk}/100</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h6 className="font-medium mb-2">Competitive Position</h6>
                      <div className="space-y-1">
                        {Object.entries(forecast.competitivePosition).map(([key, value]) => (
                          <div key={key} className="flex justify-between text-sm">
                            <span className="capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                            <span className="font-medium">
                              {key === 'marketShare' || key === 'growthRate' || key === 'profitability' 
                                ? `${value}%` : `${value}/100`}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderCrossSectorTab = () => {
    if (!crossSectorAnalysis) return null;

    return (
      <div className="space-y-6">
        {/* Macro Themes */}
        <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-pink-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-xl text-blue-800">
              <Globe className="h-6 w-6" />
              Macro Investment Themes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {crossSectorAnalysis.macroThemes.map((theme, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-lg">{theme.theme}</h4>
                      <div className="flex items-center gap-2">
                        <Badge className={
                          theme.impact === 'POSITIVE' ? 'bg-green-100 text-green-800' :
                          theme.impact === 'NEGATIVE' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }>
                          {theme.impact}
                        </Badge>
                        <Badge variant="outline">{theme.timeline}</Badge>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {theme.affectedSectors.map((sector, idx) => (
                        <div key={idx} className="p-3 bg-white rounded border">
                          <h5 className="font-medium mb-2">{sector.sector}</h5>
                          <div className="space-y-1 text-sm">
                            <div className="flex justify-between">
                              <span>Impact Score:</span>
                              <span className={`font-semibold ${
                                sector.impactScore > 0 ? 'text-green-600' : 'text-red-600'
                              }`}>
                                {sector.impactScore > 0 ? '+' : ''}{sector.impactScore}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>Opportunities:</span>
                              <span className="font-semibold text-green-600">{sector.opportunities}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Risks:</span>
                              <span className="font-semibold text-red-600">{sector.risks}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Sector Rotation */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Predicted Sector Rotation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {crossSectorAnalysis.sectorsRotation.map((rotation, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{rotation.fromSector}</span>
                        <ArrowUp className="h-4 w-4 text-blue-600 transform rotate-90" />
                        <span className="font-medium text-green-600">{rotation.toSector}</span>
                      </div>
                      <Badge variant="outline">{rotation.probability}% probability</Badge>
                    </div>
                    <div className="text-sm text-gray-600">
                      <div className="mb-1"><strong>Timeframe:</strong> {rotation.timeframe}</div>
                      <div><strong>Catalysts:</strong> {rotation.catalysts.join(', ')}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LineChart className="h-5 w-5" />
                Sector Correlations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {crossSectorAnalysis.correlationMatrix.map((corr, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-sm font-medium">
                        {corr.sector1} ↔ {corr.sector2}
                      </div>
                      <Badge variant="outline">{(corr.correlation * 100).toFixed(0)}% corr</Badge>
                    </div>
                    <div className="space-y-2">
                      <Progress 
                        value={Math.abs(corr.correlation) * 100} 
                        className={`h-2 ${corr.correlation > 0 ? 'bg-green-200' : 'bg-red-200'}`} 
                      />
                      <div className="flex justify-between text-xs text-gray-600">
                        <span>Significance: {(corr.significance * 100).toFixed(0)}%</span>
                        <Badge variant="outline" className="text-xs">
                          {corr.trend}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  const renderMarketCycleTab = () => {
    if (!marketCycle) return null;

    return (
      <div className="space-y-6">
        {/* Current Cycle Phase */}
        <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-xl text-blue-800">
              <Activity className="h-6 w-6" />
              Market Cycle Analysis
            </CardTitle>
            <p className="text-blue-700">AI-powered cycle identification and sector alignment</p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <div className="text-2xl font-bold text-blue-600 mb-2">
                  {marketCycle.currentPhase.replace('_', ' ')}
                </div>
                <p className="text-sm text-blue-700">Current Market Phase</p>
                <p className="text-xs text-blue-600 mt-1">{marketCycle.phaseConfidence}% confidence</p>
              </div>
              
              <div>
                <div className="text-2xl font-bold text-green-600 mb-2">
                  {marketCycle.nextPhaseTransition.expectedPhase.replace('_', ' ')}
                </div>
                <p className="text-sm text-green-700">Next Expected Phase</p>
                <p className="text-xs text-green-600 mt-1">{marketCycle.nextPhaseTransition.probability}% probability</p>
              </div>
              
              <div>
                <div className="text-2xl font-bold text-orange-600 mb-2">
                  {marketCycle.nextPhaseTransition.timeframe}
                </div>
                <p className="text-sm text-orange-700">Transition Timeframe</p>
                <p className="text-xs text-orange-600 mt-1">Based on leading indicators</p>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-white rounded-lg border border-blue-200">
              <h4 className="font-semibold text-blue-800 mb-2">Leading Indicators</h4>
              <div className="flex flex-wrap gap-2">
                {marketCycle.nextPhaseTransition.leadingIndicators.map((indicator, idx) => (
                  <Badge key={idx} variant="outline" className="text-blue-700">
                    {indicator}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sector Alignment */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Sector Cycle Alignment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {marketCycle.sectorPhaseAlignment.map((alignment, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-lg">{alignment.sector}</h4>
                    <Badge className={
                      alignment.recommendation === 'OVERWEIGHT' ? 'bg-green-100 text-green-800' :
                      alignment.recommendation === 'UNDERWEIGHT' ? 'bg-red-100 text-red-800' :
                      'bg-blue-100 text-blue-800'
                    }>
                      {alignment.recommendation}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h5 className="font-medium mb-2">Cyclical Alignment</h5>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm">Current Phase Fit</span>
                        <span className="font-semibold">{alignment.cyclicalAlignment}/100</span>
                      </div>
                      <Progress value={alignment.cyclicalAlignment} className="h-3" />
                      <p className="text-xs text-gray-600 mt-2">
                        How well the sector performs in the current market cycle phase
                      </p>
                    </div>
                    
                    <div>
                      <h5 className="font-medium mb-2">Defensiveness Score</h5>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm">Defensive Characteristics</span>
                        <span className="font-semibold">{alignment.defensiveness}/100</span>
                      </div>
                      <Progress value={alignment.defensiveness} className="h-3" />
                      <p className="text-xs text-gray-600 mt-2">
                        Sector's resilience during market downturns and volatility
                      </p>
                    </div>
                  </div>
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
          <Brain className="h-8 w-8 animate-pulse text-green-600" />
          <span className="text-lg">Loading predictive sector analysis...</span>
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
            <Brain className="h-7 w-7 text-green-600" />
            Predictive Sector Analysis
          </h2>
          <p className="text-gray-600 mt-1">
            AI-powered sector forecasting and cross-sector intelligence
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-green-100 text-green-800">
            Live ML Models
          </Badge>
          <Button size="sm" variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Analysis
          </Button>
        </div>
      </div>

      {/* Analysis Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="forecasts">Sector Forecasts</TabsTrigger>
          <TabsTrigger value="cross-sector">Cross-Sector Analysis</TabsTrigger>
          <TabsTrigger value="market-cycle">Market Cycle</TabsTrigger>
        </TabsList>

        <TabsContent value="forecasts" className="mt-6">
          {renderForecastsTab()}
        </TabsContent>

        <TabsContent value="cross-sector" className="mt-6">
          {renderCrossSectorTab()}
        </TabsContent>

        <TabsContent value="market-cycle" className="mt-6">
          {renderMarketCycleTab()}
        </TabsContent>
      </Tabs>
    </div>
  );
}