'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Brain,
  TrendingUp,
  TrendingDown,
  Target,
  AlertTriangle,
  CheckCircle,
  Zap,
  BarChart3,
  Clock,
  Users,
  DollarSign,
  Shield,
  Lightbulb,
  ArrowUp,
  ArrowDown,
  Minus,
  Eye,
  BookOpen
} from 'lucide-react';
import { formatCurrency, formatPercentage } from '@/lib/utils';

interface PredictiveInsight {
  id: string;
  type: 'SUCCESS_PROBABILITY' | 'RISK_PATTERN' | 'TIMELINE_PREDICTION' | 'RESOURCE_OPTIMIZATION' | 'BENCHMARK_COMPARISON';
  title: string;
  description: string;
  confidence: number; // 0-100
  impact: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  timeframe: 'IMMEDIATE' | 'SHORT_TERM' | 'MEDIUM_TERM' | 'LONG_TERM';
  recommendation: string;
  data: any;
}

interface MLModel {
  id: string;
  name: string;
  type: string;
  accuracy: number;
  lastTrained: Date;
  predictions: number;
  status: 'ACTIVE' | 'TRAINING' | 'DEPRECATED';
}

interface PredictiveAnalyticsProps {
  projectId: string;
  projectData?: any;
  navigationMode?: 'traditional' | 'assisted' | 'autonomous';
}

export function PredictiveAnalytics({ 
  projectId, 
  projectData, 
  navigationMode = 'traditional' 
}: PredictiveAnalyticsProps) {
  const [insights, setInsights] = useState<PredictiveInsight[]>([]);
  const [models, setModels] = useState<MLModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('success-prediction');

  useEffect(() => {
    loadPredictiveAnalytics();
  }, [projectId]);

  const loadPredictiveAnalytics = async () => {
    try {
      setLoading(true);
      
      // Mock ML-powered insights - in production this would call your ML service
      const mockInsights: PredictiveInsight[] = [
        {
          id: 'success-1',
          type: 'SUCCESS_PROBABILITY',
          title: 'Investment Success Probability: 78%',
          description: 'Based on analysis of 450+ similar deals, this investment has a 78% probability of achieving target returns.',
          confidence: 87,
          impact: 'HIGH',
          timeframe: 'LONG_TERM',
          recommendation: 'Proceed with investment. Consider increasing allocation by 15% based on strong fundamentals.',
          data: {
            probability: 78,
            targetIRR: 25.5,
            predictedIRR: 27.2,
            confidenceInterval: [22.1, 32.3],
            keyDrivers: [
              'Strong management team (95% confidence)',
              'Market timing optimal (89% confidence)', 
              'Financial metrics above peer median (92% confidence)',
              'ESG score in top quartile (85% confidence)'
            ]
          }
        },
        {
          id: 'risk-1',
          type: 'RISK_PATTERN',
          title: 'Customer Concentration Risk Pattern Detected',
          description: 'ML model identifies similar customer concentration patterns in 23 historical deals - 87% experienced revenue volatility.',
          confidence: 91,
          impact: 'HIGH',
          timeframe: 'SHORT_TERM',
          recommendation: 'Implement customer diversification requirements as investment condition.',
          data: {
            riskScore: 73,
            similarDeals: 23,
            negativeOutcomes: 20,
            riskFactors: [
              'Top 3 customers represent 67% of revenue',
              'Limited customer acquisition pipeline',
              'High switching costs favor incumbents',
              'Seasonal revenue concentration Q4'
            ],
            mitigationStrategies: [
              'Mandate customer diversification plan within 12 months',
              'Establish monthly customer metrics reporting',
              'Implement customer retention programs',
              'Diversify product offering to reduce concentration'
            ]
          }
        },
        {
          id: 'timeline-1',
          type: 'TIMELINE_PREDICTION',
          title: 'DD Completion Prediction: 23 days',
          description: 'Based on current progress and historical patterns, DD process will complete in 23 days with 85% confidence.',
          confidence: 85,
          impact: 'MEDIUM',
          timeframe: 'SHORT_TERM',
          recommendation: 'Accelerate legal review to maintain timeline. Consider parallel workstreams.',
          data: {
            predictedDays: 23,
            currentProgress: 45,
            bottlenecks: [
              { task: 'Legal contract review', delay: 5, probability: 0.7 },
              { task: 'Management interviews', delay: 2, probability: 0.4 },
              { task: 'Financial audit completion', delay: 7, probability: 0.6 }
            ],
            resourceOptimization: [
              'Add senior legal counsel to contract review (saves 3 days)',
              'Parallelize management interviews (saves 4 days)',
              'External audit firm for financial review (saves 5 days)'
            ]
          }
        },
        {
          id: 'benchmark-1',
          type: 'BENCHMARK_COMPARISON',
          title: 'Above Peer Median Performance Predicted',
          description: 'Company metrics rank in 73rd percentile vs. sector peers. Predicted to outperform median by 15%.',
          confidence: 82,
          impact: 'HIGH',
          timeframe: 'MEDIUM_TERM',
          recommendation: 'Position as core portfolio holding. Increase board representation.',
          data: {
            percentile: 73,
            outperformancePrediction: 15,
            peerComparison: {
              revenue_growth: { company: 34, median: 18, percentile: 78 },
              profit_margin: { company: 23, median: 15, percentile: 71 },
              customer_retention: { company: 94, median: 87, percentile: 68 },
              market_share: { company: 12, median: 8, percentile: 75 }
            },
            strengthAreas: [
              'Revenue growth 89% above sector median',
              'Customer retention in top quartile',
              'Market share gaining vs. competitors',
              'Strong recurring revenue base (78%)'
            ]
          }
        }
      ];

      const mockModels: MLModel[] = [
        {
          id: 'model-1',
          name: 'Investment Success Predictor',
          type: 'Classification',
          accuracy: 87,
          lastTrained: new Date('2024-07-15'),
          predictions: 450,
          status: 'ACTIVE'
        },
        {
          id: 'model-2', 
          name: 'Risk Pattern Detector',
          type: 'Anomaly Detection',
          accuracy: 91,
          lastTrained: new Date('2024-07-10'),
          predictions: 320,
          status: 'ACTIVE'
        },
        {
          id: 'model-3',
          name: 'Timeline Estimator',
          type: 'Regression',
          accuracy: 85,
          lastTrained: new Date('2024-07-12'),
          predictions: 180,
          status: 'ACTIVE'
        }
      ];

      setInsights(mockInsights);
      setModels(mockModels);
    } catch (error) {
      console.error('Error loading predictive analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'CRITICAL': return 'destructive';
      case 'HIGH': return 'destructive';
      case 'MEDIUM': return 'default';
      case 'LOW': return 'secondary';
      default: return 'outline';
    }
  };

  const renderSuccessPrediction = () => {
    const successInsight = insights.find(i => i.type === 'SUCCESS_PROBABILITY');
    if (!successInsight) return null;

    return (
      <div className="space-y-6">
        <Card className="border-2 border-green-200 bg-gradient-to-r from-green-50 to-emerald-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-xl text-green-800">
              <Target className="h-6 w-6" />
              Investment Success Prediction
            </CardTitle>
            <CardDescription className="text-green-700">
              ML-powered analysis based on 450+ similar investment patterns
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="text-4xl font-bold text-green-600 mb-2">
                  {successInsight.data.probability}%
                </div>
                <p className="text-sm text-green-700 mb-4">Success Probability</p>
                <Progress value={successInsight.data.probability} className="h-3 mb-4" />
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Predicted IRR:</span>
                    <span className="font-semibold">{formatPercentage(successInsight.data.predictedIRR / 100)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Target IRR:</span>
                    <span>{formatPercentage(successInsight.data.targetIRR / 100)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Confidence:</span>
                    <Badge variant="outline">{successInsight.confidence}%</Badge>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-3">Key Success Drivers</h4>
                <div className="space-y-2">
                  {successInsight.data.keyDrivers.map((driver: string, index: number) => (
                    <div key={index} className="flex items-start gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>{driver}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5" />
              AI Recommendation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertTitle>Investment Recommendation: PROCEED</AlertTitle>
              <AlertDescription className="mt-2">
                {successInsight.recommendation}
                <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm font-medium text-blue-800">
                    Confidence Range: {successInsight.data.confidenceInterval[0]}% - {successInsight.data.confidenceInterval[1]}% IRR
                  </p>
                </div>
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderRiskAnalysis = () => {
    const riskInsight = insights.find(i => i.type === 'RISK_PATTERN');
    if (!riskInsight) return null;

    return (
      <div className="space-y-6">
        <Card className="border-2 border-orange-200 bg-gradient-to-r from-orange-50 to-red-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-xl text-orange-800">
              <Shield className="h-6 w-6" />
              Risk Pattern Analysis
            </CardTitle>
            <CardDescription className="text-orange-700">
              AI-detected risk patterns from historical deal database
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="text-4xl font-bold text-orange-600 mb-2">
                  {riskInsight.data.riskScore}
                </div>
                <p className="text-sm text-orange-700 mb-4">Risk Score (0-100)</p>
                <Progress value={riskInsight.data.riskScore} className="h-3 mb-4" />
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Similar Deals:</span>
                    <span className="font-semibold">{riskInsight.data.similarDeals}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Negative Outcomes:</span>
                    <span className="font-semibold text-red-600">{riskInsight.data.negativeOutcomes}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Pattern Confidence:</span>
                    <Badge variant="outline">{riskInsight.confidence}%</Badge>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-3">Identified Risk Factors</h4>
                <div className="space-y-2">
                  {riskInsight.data.riskFactors.map((factor: string, index: number) => (
                    <div key={index} className="flex items-start gap-2 text-sm">
                      <AlertTriangle className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                      <span>{factor}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Risk Mitigation Strategies
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {riskInsight.data.mitigationStrategies.map((strategy: string, index: number) => (
                <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                  <div className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-xs font-semibold">
                    {index + 1}
                  </div>
                  <span className="text-sm">{strategy}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderTimelinePrediction = () => {
    const timelineInsight = insights.find(i => i.type === 'TIMELINE_PREDICTION');
    if (!timelineInsight) return null;

    return (
      <div className="space-y-6">
        <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-cyan-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-xl text-blue-800">
              <Clock className="h-6 w-6" />
              Timeline Prediction
            </CardTitle>
            <CardDescription className="text-blue-700">
              ML-based completion timeline with bottleneck analysis
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="text-4xl font-bold text-blue-600 mb-2">
                  {timelineInsight.data.predictedDays} days
                </div>
                <p className="text-sm text-blue-700 mb-4">Predicted Completion</p>
                <Progress value={timelineInsight.data.currentProgress} className="h-3 mb-4" />
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Current Progress:</span>
                    <span className="font-semibold">{timelineInsight.data.currentProgress}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Confidence:</span>
                    <Badge variant="outline">{timelineInsight.confidence}%</Badge>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-3">Potential Bottlenecks</h4>
                <div className="space-y-2">
                  {timelineInsight.data.bottlenecks.map((bottleneck: any, index: number) => (
                    <div key={index} className="text-sm">
                      <div className="flex justify-between items-center">
                        <span>{bottleneck.task}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-orange-600">+{bottleneck.delay}d</span>
                          <Badge variant="outline" className="text-xs">
                            {Math.round(bottleneck.probability * 100)}%
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Resource Optimization Suggestions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {timelineInsight.data.resourceOptimization.map((suggestion: string, index: number) => (
                <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                  <Lightbulb className="h-4 w-4 text-blue-600 mt-0.5" />
                  <span className="text-sm">{suggestion}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderBenchmarkAnalysis = () => {
    const benchmarkInsight = insights.find(i => i.type === 'BENCHMARK_COMPARISON');
    if (!benchmarkInsight) return null;

    return (
      <div className="space-y-6">
        <Card className="border-2 border-purple-200 bg-gradient-to-r from-purple-50 to-indigo-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-xl text-purple-800">
              <BarChart3 className="h-6 w-6" />
              Peer Benchmark Analysis
            </CardTitle>
            <CardDescription className="text-purple-700">
              Performance comparison against sector peer group
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-purple-600 mb-2">
                  {benchmarkInsight.data.percentile}th
                </div>
                <p className="text-sm text-purple-700 mb-4">Percentile Ranking</p>
                
                <div className="text-2xl font-semibold text-green-600 mb-2">
                  +{benchmarkInsight.data.outperformancePrediction}%
                </div>
                <p className="text-sm text-gray-600">Predicted Outperformance</p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-3">Key Strength Areas</h4>
                <div className="space-y-2">
                  {benchmarkInsight.data.strengthAreas.map((strength: string, index: number) => (
                    <div key={index} className="flex items-start gap-2 text-sm">
                      <TrendingUp className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>{strength}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Detailed Peer Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(benchmarkInsight.data.peerComparison).map(([metric, data]: [string, any]) => (
                <div key={metric} className="border rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h5 className="font-medium capitalize">{metric.replace('_', ' ')}</h5>
                    <Badge variant="outline">{data.percentile}th percentile</Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Company:</span>
                      <span className="font-semibold ml-2">{data.company}%</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Median:</span>
                      <span className="ml-2">{data.median}%</span>
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
          <Brain className="h-8 w-8 animate-pulse text-blue-600" />
          <span className="text-lg">Loading AI analytics...</span>
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
            <Brain className="h-7 w-7 text-blue-600" />
            AI Predictive Analytics
          </h2>
          <p className="text-gray-600 mt-1">
            ML-powered insights for intelligent investment decisions
          </p>
        </div>
        
        {navigationMode === 'autonomous' && (
          <Badge variant="outline" className="flex items-center gap-1">
            <Zap className="h-3 w-3" />
            Auto-Learning Enabled
          </Badge>
        )}
      </div>

      {/* ML Models Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Eye className="h-4 w-4" />
            Active ML Models
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {models.map((model) => (
              <div key={model.id} className="border rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-sm">{model.name}</h4>
                  <Badge variant={model.status === 'ACTIVE' ? 'default' : 'secondary'}>
                    {model.status}
                  </Badge>
                </div>
                <div className="text-xs text-gray-600 space-y-1">
                  <div>Accuracy: {model.accuracy}%</div>
                  <div>Predictions: {model.predictions}</div>
                  <div>Type: {model.type}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Analytics Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="success-prediction">Success Prediction</TabsTrigger>
          <TabsTrigger value="risk-analysis">Risk Analysis</TabsTrigger>
          <TabsTrigger value="timeline-prediction">Timeline</TabsTrigger>
          <TabsTrigger value="benchmarks">Benchmarks</TabsTrigger>
        </TabsList>

        <TabsContent value="success-prediction" className="mt-6">
          {renderSuccessPrediction()}
        </TabsContent>

        <TabsContent value="risk-analysis" className="mt-6">
          {renderRiskAnalysis()}
        </TabsContent>

        <TabsContent value="timeline-prediction" className="mt-6">
          {renderTimelinePrediction()}
        </TabsContent>

        <TabsContent value="benchmarks" className="mt-6">
          {renderBenchmarkAnalysis()}
        </TabsContent>
      </Tabs>
    </div>
  );
}