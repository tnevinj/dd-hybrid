'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Target,
  Zap,
  Brain,
  Network,
  Activity,
  Shield,
  RefreshCw,
  Eye,
  ArrowUpRight,
  ArrowDownRight,
  Trophy,
  Search,
  Users
} from 'lucide-react';

import {
  CrossModuleIntelligenceEngine,
  CrossModuleAlertSystem,
  CrossModuleBenchmarking,
  type CrossModuleMetrics,
  type CrossModuleInsight,
  type ModuleCorrelation,
  type PredictiveModel
} from '@/lib/analytics/cross-module-intelligence';

import { DecisionSupportFramework } from '@/lib/analytics/decision-support-framework';
import { IndustryBenchmarkingEngine, IndustryBenchmarks } from '@/lib/analytics/industry-benchmarking';

interface CrossModuleDashboardProps {
  className?: string;
}

export function CrossModuleDashboard({ className }: CrossModuleDashboardProps) {
  const [metrics, setMetrics] = useState<CrossModuleMetrics | null>(null);
  const [insights, setInsights] = useState<CrossModuleInsight[]>([]);
  const [correlations, setCorrelations] = useState<ModuleCorrelation[]>([]);
  const [predictiveModels, setPredictiveModels] = useState<PredictiveModel[]>([]);
  const [industryBenchmarks, setIndustryBenchmarks] = useState<IndustryBenchmarks | null>(null);
  const [decisionSupport] = useState(new DecisionSupportFramework());
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('overview');

  useEffect(() => {
    loadCrossModuleData();
  }, []);

  const loadCrossModuleData = async () => {
    try {
      setLoading(true);
      
      // Fetch data from API instead of using hard-coded mock data
      const response = await fetch('/api/analytics/cross-module');
      if (!response.ok) {
        throw new Error('Failed to fetch cross-module data');
      }
      
      const crossModuleData = await response.json();

      // Calculate cross-module metrics
      const calculatedMetrics = CrossModuleIntelligenceEngine.calculateCrossModuleMetrics(crossModuleData);
      setMetrics(calculatedMetrics);

      // Generate insights
      const generatedInsights = CrossModuleIntelligenceEngine.generateCrossModuleInsights(calculatedMetrics);
      const alerts = CrossModuleAlertSystem.generateRealTimeAlerts(calculatedMetrics);
      setInsights([...generatedInsights, ...alerts]);

      // Generate correlations
      const moduleCorrelations = CrossModuleIntelligenceEngine.identifyModuleCorrelations([]);
      setCorrelations(moduleCorrelations);

      // Generate predictive models
      const models = CrossModuleIntelligenceEngine.generatePredictiveModels(crossModuleData);
      setPredictiveModels(models);

      // Generate industry benchmarks
      const benchmarks = IndustryBenchmarkingEngine.generateComprehensiveBenchmarks(crossModuleData);
      setIndustryBenchmarks(benchmarks);

    } catch (error) {
      console.error('Error loading cross-module data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getGradeColor = (grade: string): string => {
    switch (grade) {
      case 'A+':
      case 'A': return 'text-green-600';
      case 'B+':
      case 'B': return 'text-blue-600';
      case 'C+':
      case 'C': return 'text-orange-600';
      default: return 'text-red-600';
    }
  };

  const getSeverityColor = (severity: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (severity) {
      case 'CRITICAL': return 'destructive';
      case 'HIGH': return 'destructive';
      case 'MEDIUM': return 'default';
      case 'LOW': return 'secondary';
      default: return 'outline';
    }
  };

  const renderOverviewTab = () => {
    if (!metrics) return null;

    const benchmarks = CrossModuleBenchmarking.generateBenchmarkAnalysis(metrics);

    return (
      <div className="space-y-6">
        {/* Overall Fund Grade */}
        <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-3 text-2xl">
              <Target className="h-8 w-8 text-blue-600" />
              Overall Fund Performance Grade
            </CardTitle>
            <div className={`text-6xl font-bold ${getGradeColor(metrics.overallFundGrade)}`}>
              {metrics.overallFundGrade}
            </div>
            <CardDescription className="text-lg">
              Based on cross-module intelligence analysis
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">Portfolio Health</span>
                <BarChart3 className="h-5 w-5 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {metrics.portfolioHealthScore}%
              </div>
              <Progress value={metrics.portfolioHealthScore} className="h-2" />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">Operational Efficiency</span>
                <Zap className="h-5 w-5 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {metrics.operationalEfficiency}%
              </div>
              <Progress value={metrics.operationalEfficiency} className="h-2" />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">Legal Risk Score</span>
                <Shield className="h-5 w-5 text-orange-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {metrics.legalRiskScore}%
              </div>
              <Progress value={metrics.legalRiskScore} className="h-2" />
              <div className="text-xs text-gray-500 mt-1">Lower is better</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">Deal Pipeline Quality</span>
                <TrendingUp className="h-5 w-5 text-purple-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {metrics.dealPipelineQuality}%
              </div>
              <Progress value={metrics.dealPipelineQuality} className="h-2" />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">Market Intelligence</span>
                <Brain className="h-5 w-5 text-indigo-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {metrics.marketIntelligenceConfidence}%
              </div>
              <Progress value={metrics.marketIntelligenceConfidence} className="h-2" />
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-gray-50 to-gray-100">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">System Status</span>
                <Activity className="h-5 w-5 text-green-600" />
              </div>
              <div className="text-lg font-bold text-green-600 mb-1">
                All Systems Operational
              </div>
              <div className="text-xs text-gray-500">Last updated: {new Date().toLocaleTimeString()}</div>
            </CardContent>
          </Card>
        </div>

        {/* Benchmark Comparison */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Industry Benchmark Comparison
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {benchmarks.map((benchmark, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium">{benchmark.metric}</h4>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>Your Score: {benchmark.value}</span>
                      <span>Industry Avg: {benchmark.industryAverage}</span>
                      <span>Percentile: {benchmark.percentile}th</span>
                    </div>
                  </div>
                  <Badge variant={
                    benchmark.performance === 'EXCELLENT' ? 'default' :
                    benchmark.performance === 'ABOVE_AVERAGE' ? 'secondary' :
                    benchmark.performance === 'AVERAGE' ? 'outline' :
                    'destructive'
                  }>
                    {benchmark.performance.replace('_', ' ')}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderInsightsTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">AI-Powered Cross-Module Insights</h3>
        <Button onClick={loadCrossModuleData} size="sm" className="flex items-center gap-2">
          <RefreshCw className="h-4 w-4" />
          Refresh Analysis
        </Button>
      </div>

      <div className="grid gap-4">
        {insights.map((insight) => (
          <Card key={insight.id} className={
            insight.severity === 'CRITICAL' ? 'border-red-200 bg-red-50' :
            insight.severity === 'HIGH' ? 'border-orange-200 bg-orange-50' :
            insight.severity === 'MEDIUM' ? 'border-blue-200 bg-blue-50' :
            'border-gray-200 bg-gray-50'
          }>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-base">
                  {insight.type === 'RISK_ALERT' && <AlertTriangle className="h-5 w-5" />}
                  {insight.type === 'OPPORTUNITY' && <TrendingUp className="h-5 w-5" />}
                  {insight.type === 'EFFICIENCY_GAIN' && <Zap className="h-5 w-5" />}
                  {insight.type === 'PREDICTIVE_WARNING' && <Brain className="h-5 w-5" />}
                  {insight.type === 'CORRELATION' && <Network className="h-5 w-5" />}
                  {insight.title}
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Badge variant={getSeverityColor(insight.severity)}>
                    {insight.severity}
                  </Badge>
                  <Badge variant="outline">
                    {insight.confidence}% confidence
                  </Badge>
                </div>
              </div>
              <CardDescription>{insight.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <h5 className="font-medium text-sm mb-1">Affected Modules:</h5>
                  <div className="flex gap-1 flex-wrap">
                    {insight.affectedModules.map((module, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {module}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h5 className="font-medium text-sm mb-1">Recommended Actions:</h5>
                  <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                    {insight.actionItems.map((action, index) => (
                      <li key={index}>{action}</li>
                    ))}
                  </ul>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Impact: {insight.impact}</span>
                  <span>Timeframe: {insight.timeframe.replace('_', ' ')}</span>
                  <span>Category: {insight.category.replace('_', ' ')}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderCorrelationsTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Module Correlation Analysis</h3>
        <p className="text-gray-600 text-sm">
          Understanding how different fund management modules influence each other
        </p>
      </div>

      <div className="grid gap-4">
        {correlations.map((correlation, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Network className="h-5 w-5 text-blue-600" />
                  <span className="font-medium">{correlation.moduleA}</span>
                  {correlation.correlationType === 'POSITIVE' ? (
                    <ArrowUpRight className="h-4 w-4 text-green-600" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4 text-red-600" />
                  )}
                  <span className="font-medium">{correlation.moduleB}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={correlation.correlationType === 'POSITIVE' ? 'default' : 'destructive'}>
                    {correlation.correlationType}
                  </Badge>
                  <Badge variant="outline">
                    {Math.round(correlation.strength * 100)}% strength
                  </Badge>
                </div>
              </div>
              <p className="text-sm text-gray-700 mb-2">{correlation.description}</p>
              <p className="text-sm font-medium text-blue-700">{correlation.businessImplication}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderPredictionsTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Predictive Analytics</h3>
        <p className="text-gray-600 text-sm">
          AI-powered predictions based on cross-module data patterns
        </p>
      </div>

      <div className="grid gap-6">
        {predictiveModels.map((model, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Brain className="h-5 w-5 text-purple-600" />
                {model.modelName}
              </CardTitle>
              <div className="flex items-center gap-2">
                <Badge variant="outline">{model.confidence}% confidence</Badge>
                <Badge variant="secondary">{model.timeHorizon.replace('_', ' ')}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Prediction Display */}
                <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{model.prediction.metric}</span>
                    <div className="flex items-center gap-1">
                      {model.prediction.change > 0 ? (
                        <TrendingUp className="h-4 w-4 text-green-600" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-600" />
                      )}
                      <span className={`font-bold ${model.prediction.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {model.prediction.changePercentage > 0 ? '+' : ''}{model.prediction.changePercentage.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    {model.prediction.currentValue} → {model.prediction.predictedValue}
                  </div>
                </div>

                {/* Key Drivers */}
                <div>
                  <h5 className="font-medium text-sm mb-2">Key Drivers:</h5>
                  <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                    {model.keyDrivers.map((driver, driverIndex) => (
                      <li key={driverIndex}>{driver}</li>
                    ))}
                  </ul>
                </div>

                {/* Assumptions */}
                <div>
                  <h5 className="font-medium text-sm mb-2">Model Assumptions:</h5>
                  <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                    {model.assumptions.map((assumption, assumptionIndex) => (
                      <li key={assumptionIndex}>{assumption}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderBenchmarksTab = () => {
    if (!industryBenchmarks) {
      return (
        <div className="text-center py-8">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p>Loading industry benchmarks...</p>
        </div>
      );
    }

    const modules = [
      { data: industryBenchmarks.portfolioManagement, icon: BarChart3 },
      { data: industryBenchmarks.dueDiligence, icon: Search },
      { data: industryBenchmarks.legalManagement, icon: Shield },
      { data: industryBenchmarks.dealScreening, icon: Target },
      { data: industryBenchmarks.fundOperations, icon: Activity },
      { data: industryBenchmarks.investmentCommittee, icon: Users },
      { data: industryBenchmarks.marketIntelligence, icon: Brain }
    ];

    return (
      <div className="space-y-6">
        {/* Overall Ranking */}
        <Card className="border-2 border-yellow-200 bg-gradient-to-r from-yellow-50 to-orange-50">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-3 text-xl">
              <Trophy className="h-6 w-6 text-yellow-600" />
              Industry Ranking
            </CardTitle>
            <div className="text-3xl font-bold text-gray-900">
              #{industryBenchmarks.overallFundRanking.industryRank}
            </div>
            <p className="text-sm text-gray-600">
              out of {industryBenchmarks.overallFundRanking.totalFunds} funds • 
              <span className={`ml-2 px-2 py-1 rounded text-sm font-semibold ${getGradeColor(industryBenchmarks.overallFundRanking.grade)}`}>
                {industryBenchmarks.overallFundRanking.grade}
              </span>
            </p>
          </CardHeader>
        </Card>

        {/* Module Benchmarks */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {modules.map(({ data, icon: Icon }, index) => (
            <Card key={index}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <Icon className="h-5 w-5 text-blue-600" />
                  <Badge className={getGradeColor(data.grade)}>
                    {data.grade}
                  </Badge>
                </div>
                <CardTitle className="text-sm font-medium">{data.moduleName}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Performance</span>
                      <span className="font-semibold">{data.overallScore.toFixed(0)}%</span>
                    </div>
                    <Progress value={data.overallScore} className="h-2" />
                  </div>
                  <div className="text-xs text-gray-600">
                    <p>Better than {data.peerComparison.betterThan.toFixed(0)}% of peers</p>
                    {data.strengths.length > 0 && (
                      <p className="text-green-600 mt-1">• {data.strengths[0]}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className={`flex items-center justify-center h-96 ${className}`}>
        <div className="flex items-center gap-3">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
          <span className="text-lg font-medium">Loading cross-module intelligence...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Network className="h-8 w-8 text-blue-600" />
            Cross-Module Intelligence
          </h1>
          <p className="text-gray-600 mt-1">
            AI-powered insights across all fund management modules
          </p>
        </div>
        <Button onClick={loadCrossModuleData} className="flex items-center gap-2">
          <RefreshCw className="h-4 w-4" />
          Refresh Analysis
        </Button>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
          <TabsTrigger value="correlations">Correlations</TabsTrigger>
          <TabsTrigger value="predictions">Predictions</TabsTrigger>
          <TabsTrigger value="benchmarks">Industry Benchmarks</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          {renderOverviewTab()}
        </TabsContent>

        <TabsContent value="insights" className="mt-6">
          {renderInsightsTab()}
        </TabsContent>

        <TabsContent value="correlations" className="mt-6">
          {renderCorrelationsTab()}
        </TabsContent>

        <TabsContent value="predictions" className="mt-6">
          {renderPredictionsTab()}
        </TabsContent>

        <TabsContent value="benchmarks" className="mt-6">
          {renderBenchmarksTab()}
        </TabsContent>
      </Tabs>
    </div>
  );
}
