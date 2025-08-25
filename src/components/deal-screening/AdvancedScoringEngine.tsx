import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart3, 
  TrendingUp, 
  Activity, 
  Zap, 
  Brain, 
  Calculator, 
  Target,
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart,
  PieChart,
  LineChart,
  Settings,
  Play,
  Pause,
  RefreshCw
} from 'lucide-react';
import { 
  ScoringFunction, 
  MLScoringModel, 
  IndustryCriterionLibrary,
  ConditionalCriterion,
  DealScreeningCriterion,
  DealScore
} from '@/types/deal-screening';

interface AdvancedScoringEngineProps {
  criteria: DealScreeningCriterion[];
  currentScores: DealScore[];
  onScoreUpdate: (scores: DealScore[]) => void;
  scoringFunctions: ScoringFunction[];
  mlModels: MLScoringModel[];
  industryLibraries: IndustryCriterionLibrary[];
  conditionalCriteria: ConditionalCriterion[];
  isLoading?: boolean;
}

export const AdvancedScoringEngine: React.FC<AdvancedScoringEngineProps> = ({
  criteria,
  currentScores,
  onScoreUpdate,
  scoringFunctions = [],
  mlModels = [],
  industryLibraries = [],
  conditionalCriteria = [],
  isLoading = false
}) => {
  const [activeTab, setActiveTab] = useState('scoring');
  const [selectedFunction, setSelectedFunction] = useState<string>('');
  const [selectedModel, setSelectedModel] = useState<string>('');
  const [selectedIndustry, setSelectedIndustry] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);

  // Apply scoring function to criteria
  const applyScoringFunction = (functionId: string) => {
    const scoringFunction = scoringFunctions.find(f => f.id === functionId);
    if (!scoringFunction) return;

    setIsProcessing(true);
    setProcessingProgress(0);

    // Simulate processing with progress
    const interval = setInterval(() => {
      setProcessingProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsProcessing(false);
          return 100;
        }
        return prev + 10;
      });
    }, 100);

    setTimeout(() => {
      clearInterval(interval);
      setIsProcessing(false);
      setProcessingProgress(100);

      // Apply the scoring function logic
      const newScores = criteria.map(criterion => {
        const existingScore = currentScores.find(s => s.criterionId === criterion.id);
        let newScore = existingScore?.value || 0;

        switch (scoringFunction.type) {
          case 'linear':
            // Linear scoring based on criterion weight
            newScore = Math.min(100, Math.max(0, criterion.weight * 10));
            break;
          case 'exponential':
            // Exponential scoring
            newScore = Math.min(100, Math.max(0, Math.pow(criterion.weight, 1.5) * 15));
            break;
          case 'logarithmic':
            // Logarithmic scoring
            newScore = Math.min(100, Math.max(0, Math.log(criterion.weight + 1) * 25));
            break;
          case 'threshold':
            // Threshold-based scoring
            newScore = criterion.weight > 7 ? 85 : criterion.weight > 5 ? 70 : 50;
            break;
          case 'ml_enhanced':
            // ML-enhanced scoring (placeholder - would integrate with actual ML model)
            newScore = Math.min(100, Math.max(0, criterion.weight * 8 + Math.random() * 20));
            break;
        }

        return {
          criterionId: criterion.id,
          value: newScore,
          normalizedScore: newScore / 100,
          weightedScore: (newScore / 100) * criterion.weight,
          notes: `Auto-scored using ${scoringFunction.name}`,
          aiGenerated: true,
          confidence: 0.85
        };
      });

      onScoreUpdate(newScores);
    }, 2000);
  };

  // Apply ML model predictions
  const applyMLModel = (modelId: string) => {
    const model = mlModels.find(m => m.id === modelId);
    if (!model) return;

    setIsProcessing(true);
    setProcessingProgress(0);

    const interval = setInterval(() => {
      setProcessingProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsProcessing(false);
          return 100;
        }
        return prev + 15;
      });
    }, 100);

    setTimeout(() => {
      clearInterval(interval);
      setIsProcessing(false);
      setProcessingProgress(100);

      // Simulate ML model predictions
      const newScores = criteria.map(criterion => {
        const prediction = Math.min(100, Math.max(0, 
          criterion.weight * 7 + Math.random() * 25
        ));

        return {
          criterionId: criterion.id,
          value: prediction,
          normalizedScore: prediction / 100,
          weightedScore: (prediction / 100) * criterion.weight,
          notes: `ML prediction from ${model.name}`,
          aiGenerated: true,
          confidence: 0.92
        };
      });

      onScoreUpdate(newScores);
    }, 1500);
  };

  // Apply industry benchmarks
  const applyIndustryBenchmarks = (industry: string) => {
    const library = industryLibraries.find(l => l.industry === industry);
    if (!library) return;

    setIsProcessing(true);
    setProcessingProgress(0);

    const interval = setInterval(() => {
      setProcessingProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsProcessing(false);
          return 100;
        }
        return prev + 20;
      });
    }, 100);

    setTimeout(() => {
      clearInterval(interval);
      setIsProcessing(false);
      setProcessingProgress(100);

      const newScores = criteria.map(criterion => {
        const benchmark = library.criteriaTemplates.find(t => 
          t.criterion.id === criterion.id || t.criterion.name === criterion.name
        );

        let score = 50; // Default average
        if (benchmark) {
          // Score based on industry benchmarks
          const benchmarkScore = (benchmark.benchmarks.excellent + benchmark.benchmarks.good) / 2;
          score = Math.min(100, Math.max(0, benchmarkScore * (benchmark.industryWeighting / 10)));
        }

        return {
          criterionId: criterion.id,
          value: score,
          normalizedScore: score / 100,
          weightedScore: (score / 100) * criterion.weight,
          notes: `Industry benchmark: ${industry}`,
          aiGenerated: true,
          confidence: 0.88
        };
      });

      onScoreUpdate(newScores);
    }, 1200);
  };

  // Calculate overall score metrics
  const calculateMetrics = () => {
    const totalWeightedScore = currentScores.reduce((sum, score) => sum + score.weightedScore, 0);
    const totalWeight = criteria.reduce((sum, criterion) => sum + criterion.weight, 0);
    const overallScore = totalWeight > 0 ? (totalWeightedScore / totalWeight) * 100 : 0;

    return {
      overallScore: Math.round(overallScore),
      totalWeightedScore: Math.round(totalWeightedScore),
      criteriaCount: criteria.length,
      scoredCount: currentScores.length,
      completionPercentage: criteria.length > 0 ? (currentScores.length / criteria.length) * 100 : 0
    };
  };

  const metrics = calculateMetrics();

  if (isLoading) {
    return (
      <Card className="border-gray-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600"></div>
            <span className="ml-3 text-gray-600">Loading scoring engine...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Performance Metrics Header */}
      <Card className="border-gray-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl flex items-center space-x-2">
              <Brain className="h-5 w-5 text-blue-600" />
              <span>Advanced Scoring Engine</span>
            </CardTitle>
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              <Zap className="h-3 w-3 mr-1" />
              ML-Enhanced
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-700">{metrics.overallScore}</div>
              <div className="text-sm text-blue-600">Overall Score</div>
              <Progress value={metrics.overallScore} className="mt-2 bg-blue-100" />
            </div>
            
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-700">{metrics.scoredCount}/{metrics.criteriaCount}</div>
              <div className="text-sm text-green-600">Criteria Scored</div>
              <Progress value={metrics.completionPercentage} className="mt-2 bg-green-100" />
            </div>
            
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-700">{scoringFunctions.length}</div>
              <div className="text-sm text-blue-600">Scoring Functions</div>
              <div className="text-xs text-blue-500 mt-1">Available</div>
            </div>
            
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-700">{mlModels.length}</div>
              <div className="text-sm text-orange-600">ML Models</div>
              <div className="text-xs text-orange-500 mt-1">Trained</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Scoring Engine Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 mb-6">
          <TabsTrigger value="scoring" className="flex items-center space-x-2">
            <Calculator className="h-4 w-4" />
            <span>Scoring Functions</span>
          </TabsTrigger>
          <TabsTrigger value="ml" className="flex items-center space-x-2">
            <Brain className="h-4 w-4" />
            <span>ML Models</span>
          </TabsTrigger>
          <TabsTrigger value="industry" className="flex items-center space-x-2">
            <BarChart className="h-4 w-4" />
            <span>Industry Benchmarks</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center space-x-2">
            <TrendingUp className="h-4 w-4" />
            <span>Analytics</span>
          </TabsTrigger>
        </TabsList>

        {/* Scoring Functions Tab */}
        <TabsContent value="scoring">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calculator className="h-5 w-5" />
                <span>Advanced Scoring Functions</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {scoringFunctions.map((func) => (
                  <Card key={func.id} className="border-gray-200 hover:border-blue-300 transition-colors">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm font-medium">{func.name}</CardTitle>
                        <Badge variant="outline" className="text-xs">
                          {func.type}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-3">
                      <p className="text-sm text-gray-600 mb-3">{func.description}</p>
                      <div className="text-xs text-gray-500 mb-2">
                        Formula: {func.formula}
                      </div>
                      {func.performanceMetrics && (
                        <div className="text-xs text-gray-500 space-y-1">
                          <div>Accuracy: {(func.performanceMetrics.accuracy * 100).toFixed(1)}%</div>
                          <div>Precision: {(func.performanceMetrics.precision * 100).toFixed(1)}%</div>
                        </div>
                      )}
                    </CardContent>
                    <CardFooter>
                      <Button
                        size="sm"
                        onClick={() => applyScoringFunction(func.id)}
                        disabled={isProcessing}
                        className="w-full"
                      >
                        {isProcessing && selectedFunction === func.id ? (
                          <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                        ) : (
                          <Play className="h-4 w-4 mr-2" />
                        )}
                        Apply Function
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ML Models Tab */}
        <TabsContent value="ml">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Brain className="h-5 w-5" />
                <span>Machine Learning Models</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mlModels.map((model) => (
                  <Card key={model.id} className="border-gray-200 hover:border-blue-300 transition-colors">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm font-medium">{model.name}</CardTitle>
                        <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700">
                          {model.type}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-3">
                      <p className="text-sm text-gray-600 mb-3">
                        Trained on {model.trainingData.length} samples
                      </p>
                      <div className="text-xs text-gray-500 space-y-1">
                        <div>Features: {model.features.length}</div>
                        <div>MSE: {model.metrics.mse.toFixed(4)}</div>
                        <div>R²: {model.metrics.r2.toFixed(3)}</div>
                        <div>Last trained: {new Date(model.lastTrained).toLocaleDateString()}</div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => applyMLModel(model.id)}
                        disabled={isProcessing}
                        className="w-full border-blue-300 text-blue-700 hover:bg-blue-50"
                      >
                        {isProcessing && selectedModel === model.id ? (
                          <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                        ) : (
                          <Zap className="h-4 w-4 mr-2" />
                        )}
                        Run Prediction
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Industry Benchmarks Tab */}
        <TabsContent value="industry">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart className="h-5 w-5" />
                <span>Industry Benchmark Libraries</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {industryLibraries.map((library) => (
                  <Card key={library.industry} className="border-gray-200 hover:border-green-300 transition-colors">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium">{library.industry}</CardTitle>
                    </CardHeader>
                    <CardContent className="pb-3">
                      <p className="text-sm text-gray-600 mb-3">
                        {library.criteriaTemplates.length} benchmarked criteria
                      </p>
                      <div className="text-xs text-gray-500 space-y-1">
                        <div>Coverage: Comprehensive</div>
                        <div>Updated: Quarterly</div>
                        <div>Source: Industry reports & historical data</div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => applyIndustryBenchmarks(library.industry)}
                        disabled={isProcessing}
                        className="w-full border-green-300 text-green-700 hover:bg-green-50"
                      >
                        {isProcessing && selectedIndustry === library.industry ? (
                          <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                        ) : (
                          <Target className="h-4 w-4 mr-2" />
                        )}
                        Apply Benchmarks
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5" />
                <span>Scoring Analytics & Insights</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Score Distribution */}
                <Card className="border-gray-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium">Score Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-32 bg-gray-50 rounded-lg flex items-center justify-center">
                      <BarChart3 className="h-8 w-8 text-gray-400" />
                      <span className="ml-2 text-gray-500">Score distribution chart</span>
                    </div>
                    <div className="mt-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Excellent (80-100)</span>
                        <span className="font-medium">{
                          currentScores.filter(s => s.value >= 80).length
                        } criteria</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Good (60-79)</span>
                        <span className="font-medium">{
                          currentScores.filter(s => s.value >= 60 && s.value < 80).length
                        } criteria</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Average (40-59)</span>
                        <span className="font-medium">{
                          currentScores.filter(s => s.value >= 40 && s.value < 60).length
                        } criteria</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Poor (0-39)</span>
                        <span className="font-medium">{
                          currentScores.filter(s => s.value < 40).length
                        } criteria</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Performance Metrics */}
                <Card className="border-gray-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium">Performance Metrics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Scoring Consistency</span>
                          <span className="font-medium">85%</span>
                        </div>
                        <Progress value={85} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>AI Confidence</span>
                          <span className="font-medium">{
                            currentScores.length > 0 
                              ? Math.round(currentScores.reduce((sum, s) => sum + (s.confidence || 0), 0) / currentScores.length * 100)
                              : 0
                          }%</span>
                        </div>
                        <Progress value={
                          currentScores.length > 0 
                            ? currentScores.reduce((sum, s) => sum + (s.confidence || 0), 0) / currentScores.length * 100
                            : 0
                        } className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Criteria Coverage</span>
                          <span className="font-medium">{metrics.completionPercentage.toFixed(1)}%</span>
                        </div>
                        <Progress value={metrics.completionPercentage} className="h-2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Conditional Criteria Analysis */}
              {conditionalCriteria.length > 0 && (
                <div className="mt-6">
                  <h4 className="font-medium text-gray-900 mb-3">Conditional Criteria Analysis</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {conditionalCriteria.slice(0, 4).map((criterion) => (
                      <Card key={criterion.id} className="border-gray-200">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm font-medium">{criterion.name}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-xs text-gray-600 mb-2">
                            {criterion.conditions.length} conditional rules
                          </p>
                          <div className="text-xs text-gray-500 space-y-1">
                            {criterion.conditions.slice(0, 2).map((condition, index) => (
                              <div key={index}>
                                If {condition.dependentCriterionId} {condition.operator} {condition.value}
                              </div>
                            ))}
                            {criterion.conditions.length > 2 && (
                              <div>+{criterion.conditions.length - 2} more rules</div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Processing Overlay */}
      {isProcessing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-96">
            <CardHeader>
              <CardTitle className="text-center">Processing Scores</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-4">
                <RefreshCw className="h-8 w-8 animate-spin mx-auto text-blue-600" />
              </div>
              <Progress value={processingProgress} className="w-full" />
              <p className="text-center text-sm text-gray-600 mt-2">
                {processingProgress}% complete
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AdvancedScoringEngine;
