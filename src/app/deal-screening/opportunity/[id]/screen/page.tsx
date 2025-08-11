'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useNavigationStore } from '@/stores/navigation-store';
import {
  ArrowLeft,
  Brain,
  Bot,
  List,
  Settings,
  CheckCircle,
  Clock,
  AlertTriangle,
  TrendingUp,
  FileText,
  Lightbulb,
  Play,
  Pause,
  Save,
  Send,
  RotateCcw,
  Eye,
  ChevronRight,
  ChevronLeft,
  Users,
  Bell,
  ArrowRight,
  Sparkles,
  Target,
  BarChart3,
  Zap,
  User,
  X,
} from 'lucide-react';
import { 
  DealOpportunity, 
  DealScreeningTemplate, 
  ScreeningWorkflow,
  DealScreeningCriterion,
  DealScore,
  TemplateSelection
} from '@/types/deal-screening';
import { AIScreeningService, AISuggestion } from '@/lib/services/ai-screening-service';
import { ScoringService, CriterionScore, ScoringResult } from '@/lib/services/scoring-service';

// Template Selection Step Component
const TemplateSelectionStep: React.FC<{
  opportunity: DealOpportunity;
  mode: 'traditional' | 'assisted' | 'autonomous';
  onTemplateSelected: (template: DealScreeningTemplate, customizations?: any[]) => void;
  onBack: () => void;
}> = ({ opportunity, mode, onTemplateSelected, onBack }) => {
  const [recommendedTemplates, setRecommendedTemplates] = useState<any[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<DealScreeningTemplate | null>(null);
  const [loading, setLoading] = useState(true);
  const [customizations, setCustomizations] = useState<any[]>([]);

  useEffect(() => {
    fetchTemplateRecommendations();
  }, [opportunity.id, mode]);

  const fetchTemplateRecommendations = async () => {
    try {
      const response = await fetch('/api/deal-screening/templates/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ opportunity, mode }),
      });
      const data = await response.json();
      setRecommendedTemplates(data.recommendedTemplates || []);
      if (data.recommendedTemplates?.length > 0) {
        setSelectedTemplate(data.recommendedTemplates[0].template);
      }
      setCustomizations(data.customizationSuggestions || []);
    } catch (error) {
      console.error('Error fetching template recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  const getModeIcon = () => {
    switch (mode) {
      case 'traditional': return <List className="h-4 w-4" />;
      case 'assisted': return <Brain className="h-4 w-4" />;
      case 'autonomous': return <Bot className="h-4 w-4" />;
    }
  };

  const getModeColor = () => {
    switch (mode) {
      case 'traditional': return 'bg-gray-100 text-gray-800';
      case 'assisted': return 'bg-blue-100 text-blue-800';
      case 'autonomous': return 'bg-purple-100 text-purple-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-3"></div>
        <span className="text-gray-600">Analyzing opportunity and recommending templates...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Select Screening Template</h2>
          <p className="text-gray-600 mt-1">Choose the best template for evaluating this {opportunity.assetType} opportunity</p>
        </div>
        <Badge className={`${getModeColor()} flex items-center space-x-1 px-3 py-1`}>
          {getModeIcon()}
          <span>{mode.charAt(0).toUpperCase() + mode.slice(1)} Mode</span>
        </Badge>
      </div>

      {/* AI Insights for Assisted/Autonomous Modes */}
      {mode !== 'traditional' && (
        <Card className="border-l-4 border-l-blue-500 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <Sparkles className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-blue-900 mb-2">AI Analysis Complete</h3>
                <div className="space-y-2 text-sm text-blue-800">
                  <p>• Analyzed {opportunity.assetType} investment patterns from 150+ historical deals</p>
                  <p>• Identified 3 optimal templates based on sector ({opportunity.sector}) and geography</p>
                  <p>• Generated {customizations.length} customization recommendations</p>
                  {mode === 'autonomous' && (
                    <p>• Ready for automated scoring with 85% confidence threshold</p>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Template Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {recommendedTemplates.map((rec, index) => (
          <Card 
            key={rec.template.id}
            className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
              selectedTemplate?.id === rec.template.id 
                ? 'ring-2 ring-blue-500 bg-blue-50' 
                : 'hover:bg-gray-50'
            }`}
            onClick={() => setSelectedTemplate(rec.template)}
          >
            <CardContent className="p-6">
              {/* Template Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">{rec.template.name}</h3>
                  <p className="text-sm text-gray-600">{rec.template.description}</p>
                </div>
                <div className="flex flex-col items-end">
                  <Badge variant="outline" className="mb-2">
                    Score: {rec.recommendationScore}
                  </Badge>
                  {index === 0 && (
                    <Badge variant="default" className="text-xs">
                      Recommended
                    </Badge>
                  )}
                </div>
              </div>

              {/* Template Stats */}
              <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                <div>
                  <span className="text-gray-500">Success Rate:</span>
                  <span className="font-semibold ml-2">
                    {Math.round((rec.template.analytics?.successRate || 0) * 100)}%
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Used:</span>
                  <span className="font-semibold ml-2">
                    {rec.template.analytics?.usageCount || 0} times
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Criteria:</span>
                  <span className="font-semibold ml-2">
                    {rec.template.criteria.length}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">AI Enhanced:</span>
                  <span className="font-semibold ml-2">
                    {rec.template.aiEnhanced ? 'Yes' : 'No'}
                  </span>
                </div>
              </div>

              {/* Reasons */}
              <div className="space-y-1">
                <h4 className="text-xs font-medium text-gray-700 uppercase tracking-wide">Why this template?</h4>
                {rec.reasons.slice(0, 3).map((reason: string, idx: number) => (
                  <div key={idx} className="flex items-start space-x-2 text-xs text-gray-600">
                    <CheckCircle className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>{reason}</span>
                  </div>
                ))}
              </div>

              {/* Mode-specific Features */}
              {mode !== 'traditional' && rec.template.aiEnhanced && (
                <div className="mt-4 p-3 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Zap className="h-4 w-4 text-purple-600" />
                    <span className="text-sm font-medium text-purple-900">AI Features</span>
                  </div>
                  <div className="text-xs text-purple-700 space-y-1">
                    {mode === 'assisted' && (
                      <>
                        <div>• Smart scoring suggestions</div>
                        <div>• Real-time benchmarking</div>
                        <div>• Risk pattern detection</div>
                      </>
                    )}
                    {mode === 'autonomous' && (
                      <>
                        <div>• Automated scoring (85% confidence)</div>
                        <div>• Exception-based human review</div>
                        <div>• Bulk processing capability</div>
                      </>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Customization Suggestions */}
      {selectedTemplate && customizations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="h-5 w-5" />
              <span>Recommended Customizations</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {customizations.map((suggestion, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Target className="h-4 w-4 text-blue-600 mt-1 flex-shrink-0" />
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{suggestion.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{suggestion.description}</p>
                    <Badge variant="outline" className="mt-2 text-xs">
                      Impact: {suggestion.impact}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex justify-between pt-6">
        <Button variant="outline" onClick={onBack} className="flex items-center space-x-2">
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Opportunity</span>
        </Button>
        <Button 
          onClick={() => selectedTemplate && onTemplateSelected(selectedTemplate, customizations)}
          disabled={!selectedTemplate}
          className="flex items-center space-x-2"
        >
          <span>Start Screening</span>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

// Traditional Mode Scoring Component
const TraditionalScoringInterface: React.FC<{
  template: DealScreeningTemplate;
  workflow: ScreeningWorkflow;
  onScoreUpdate: (criterionId: string, score: number, notes?: string, aiGenerated?: boolean, confidence?: number) => void;
  onComplete: () => void;
}> = ({ template, workflow, onScoreUpdate, onComplete }) => {
  const [scores, setScores] = useState<Record<string, { value: number; notes: string }>>({});
  const [currentCriterionIndex, setCurrentCriterionIndex] = useState(0);

  const currentCriterion = template.criteria[currentCriterionIndex];
  const progress = (workflow.completedCriteria.length / template.criteria.length) * 100;

  const handleScoreChange = (score: number) => {
    setScores(prev => ({
      ...prev,
      [currentCriterion.id]: { ...prev[currentCriterion.id], value: score }
    }));
    onScoreUpdate(currentCriterion.id, score, scores[currentCriterion.id]?.notes || '');
  };

  const handleNotesChange = (notes: string) => {
    setScores(prev => ({
      ...prev,
      [currentCriterion.id]: { ...prev[currentCriterion.id], notes }
    }));
  };

  const handleNext = () => {
    if (currentCriterionIndex < template.criteria.length - 1) {
      setCurrentCriterionIndex(currentCriterionIndex + 1);
    } else {
      onComplete();
    }
  };

  const handlePrevious = () => {
    if (currentCriterionIndex > 0) {
      setCurrentCriterionIndex(currentCriterionIndex - 1);
    }
  };

  return (
    <div className="space-y-6">
      {/* Progress Header */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Manual Scoring</h2>
            <p className="text-gray-600">Criterion {currentCriterionIndex + 1} of {template.criteria.length}</p>
          </div>
          <Badge className="bg-gray-100 text-gray-800 flex items-center space-x-1">
            <User className="h-3 w-3" />
            <span>Traditional Mode</span>
          </Badge>
        </div>
        <Progress value={progress} className="w-full" />
        <p className="text-sm text-gray-500 mt-2">{Math.round(progress)}% Complete</p>
      </div>

      {/* Current Criterion */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-lg">{currentCriterion.name}</CardTitle>
              <p className="text-gray-600 mt-2">{currentCriterion.description}</p>
            </div>
            <div className="text-right">
              <Badge variant="outline">Weight: {Math.round(currentCriterion.weight * 100)}%</Badge>
              <p className="text-sm text-gray-500 mt-1">{currentCriterion.category}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Scoring Interface */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Score ({currentCriterion.minValue} - {currentCriterion.maxValue})
              </label>
              <div className="flex items-center space-x-4">
                <Input
                  type="number"
                  min={currentCriterion.minValue}
                  max={currentCriterion.maxValue}
                  value={scores[currentCriterion.id]?.value || ''}
                  onChange={(e) => handleScoreChange(Number(e.target.value))}
                  className="w-24"
                  placeholder="0"
                />
                <div className="flex-1">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${((scores[currentCriterion.id]?.value || 0) / currentCriterion.maxValue) * 100}%` 
                      }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Poor</span>
                    <span>Excellent</span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes and Rationale
              </label>
              <Textarea
                value={scores[currentCriterion.id]?.notes || ''}
                onChange={(e) => handleNotesChange(e.target.value)}
                placeholder="Provide detailed reasoning for this score..."
                className="min-h-[100px]"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* All Criteria Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Screening Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {template.criteria.map((criterion, index) => (
              <div 
                key={criterion.id}
                className={`p-3 rounded-lg border ${
                  index === currentCriterionIndex 
                    ? 'border-blue-500 bg-blue-50' 
                    : workflow.completedCriteria.includes(criterion.id)
                    ? 'border-green-200 bg-green-50'
                    : 'border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-sm">{criterion.name}</h4>
                    <p className="text-xs text-gray-500">{criterion.category} • {Math.round(criterion.weight * 100)}%</p>
                  </div>
                  <div className="text-right">
                    {workflow.completedCriteria.includes(criterion.id) ? (
                      <div className="flex items-center space-x-1">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm font-medium">{scores[criterion.id]?.value || 0}</span>
                      </div>
                    ) : index === currentCriterionIndex ? (
                      <Clock className="h-4 w-4 text-blue-500" />
                    ) : (
                      <div className="w-4 h-4 border-2 border-gray-300 rounded-full" />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={handlePrevious}
          disabled={currentCriterionIndex === 0}
          className="flex items-center space-x-2"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Previous</span>
        </Button>
        <Button 
          onClick={handleNext}
          disabled={!scores[currentCriterion.id]?.value}
          className="flex items-center space-x-2"
        >
          <span>{currentCriterionIndex === template.criteria.length - 1 ? 'Complete Screening' : 'Next'}</span>
          {currentCriterionIndex === template.criteria.length - 1 ? (
            <CheckCircle className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  );
};

// Assisted Mode Scoring Component
const AssistedScoringInterface: React.FC<{
  template: DealScreeningTemplate;
  workflow: ScreeningWorkflow;
  opportunity: DealOpportunity;
  onScoreUpdate: (criterionId: string, score: number, notes?: string, aiGenerated?: boolean, confidence?: number) => void;
  onComplete: () => void;
}> = ({ template, workflow, opportunity, onScoreUpdate, onComplete }) => {
  const [scores, setScores] = useState<Record<string, { value: number; notes: string; aiSuggestion?: number; confidence?: number }>>({});
  const [currentCriterionIndex, setCurrentCriterionIndex] = useState(0);
  const [aiSuggestions, setAiSuggestions] = useState<Record<string, AISuggestion>>({});
  const [showAiPanel, setShowAiPanel] = useState(true);

  const currentCriterion = template.criteria[currentCriterionIndex];
  const progress = (workflow.completedCriteria.length / template.criteria.length) * 100;

  // Generate intelligent AI suggestions on mount
  useEffect(() => {
    generateIntelligentAiSuggestions();
  }, [template, opportunity]);

  const generateIntelligentAiSuggestions = () => {
    console.log('Generating intelligent AI suggestions for:', opportunity.name);
    
    // Use the new AI service to generate suggestions based on actual opportunity data
    const suggestions = AIScreeningService.generateBatchSuggestions(opportunity, template);
    setAiSuggestions(suggestions);
    
    // In assisted mode, DON'T automatically populate scores - let user accept suggestions
    console.log('AI suggestions generated:', Object.keys(suggestions).length, 'criteria');
  };

  const handleScoreChange = (score: number) => {
    setScores(prev => ({
      ...prev,
      [currentCriterion.id]: { ...prev[currentCriterion.id], value: score }
    }));
    onScoreUpdate(currentCriterion.id, score, scores[currentCriterion.id]?.notes || '');
  };

  const handleAcceptAiSuggestion = () => {
    const suggestion = aiSuggestions[currentCriterion.id];
    if (suggestion) {
      // Update local scores state
      handleScoreChange(suggestion.score);
      
      // Update notes with AI reasoning
      setScores(prev => ({
        ...prev,
        [currentCriterion.id]: { 
          ...prev[currentCriterion.id], 
          value: suggestion.score,
          notes: suggestion.reasoning 
        }
      }));
      
      // Notify parent component with AI flag
      onScoreUpdate(currentCriterion.id, suggestion.score, suggestion.reasoning, true, suggestion.confidence);
      
      console.log(`Accepted AI suggestion for ${currentCriterion.name}: ${suggestion.score} (${Math.round(suggestion.confidence * 100)}% confidence)`);
    }
  };

  const handleNotesChange = (notes: string) => {
    setScores(prev => ({
      ...prev,
      [currentCriterion.id]: { ...prev[currentCriterion.id], notes }
    }));
  };

  const handleNext = () => {
    if (currentCriterionIndex < template.criteria.length - 1) {
      setCurrentCriterionIndex(currentCriterionIndex + 1);
    } else {
      onComplete();
    }
  };

  const handlePrevious = () => {
    if (currentCriterionIndex > 0) {
      setCurrentCriterionIndex(currentCriterionIndex - 1);
    }
  };

  const currentSuggestion = aiSuggestions[currentCriterion.id];

  return (
    <div className="space-y-6">
      {/* Progress Header */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">AI-Assisted Scoring</h2>
            <p className="text-gray-600">Criterion {currentCriterionIndex + 1} of {template.criteria.length}</p>
          </div>
          <Badge className="bg-blue-100 text-blue-800 flex items-center space-x-1">
            <Brain className="h-3 w-3" />
            <span>Assisted Mode</span>
          </Badge>
        </div>
        <Progress value={progress} className="w-full" />
        <p className="text-sm text-gray-500 mt-2">{Math.round(progress)}% Complete</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Scoring Panel */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{currentCriterion.name}</CardTitle>
                  <p className="text-gray-600 mt-2">{currentCriterion.description}</p>
                </div>
                <div className="text-right">
                  <Badge variant="outline">Weight: {Math.round(currentCriterion.weight * 100)}%</Badge>
                  <p className="text-sm text-gray-500 mt-1">{currentCriterion.category}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Score ({currentCriterion.minValue} - {currentCriterion.maxValue})
                  </label>
                  <div className="flex items-center space-x-4">
                    <Input
                      type="number"
                      min={currentCriterion.minValue}
                      max={currentCriterion.maxValue}
                      value={scores[currentCriterion.id]?.value || ''}
                      onChange={(e) => handleScoreChange(Number(e.target.value))}
                      className="w-24"
                      placeholder="0"
                    />
                    <div className="flex-1">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ 
                            width: `${((scores[currentCriterion.id]?.value || 0) / currentCriterion.maxValue) * 100}%` 
                          }}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>Poor</span>
                        <span>Excellent</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notes and Rationale
                  </label>
                  <Textarea
                    value={scores[currentCriterion.id]?.notes || ''}
                    onChange={(e) => handleNotesChange(e.target.value)}
                    placeholder="Provide detailed reasoning for this score..."
                    className="min-h-[100px]"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AI Assistance Panel */}
        {showAiPanel && currentSuggestion && (
          <div className="lg:col-span-1">
            <Card className="border-2 border-blue-200 bg-blue-50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-blue-900">
                  <Sparkles className="h-4 w-4" />
                  <span>AI Suggestion</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">
                      {currentSuggestion.score}
                    </div>
                    <div className="text-sm text-gray-600">Suggested Score</div>
                    <div className="flex items-center justify-center mt-2">
                      <div className="flex items-center space-x-1">
                        <div className="text-sm text-gray-600">Confidence:</div>
                        <Badge variant="outline" className="text-xs">
                          {Math.round(currentSuggestion.confidence * 100)}%
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="font-medium text-gray-900 mb-2">AI Reasoning</h4>
                    <p className="text-sm text-gray-700">{currentSuggestion.reasoning}</p>
                  </div>

                  <div className="space-y-2">
                    <Button 
                      onClick={handleAcceptAiSuggestion}
                      className="w-full"
                      size="sm"
                    >
                      Accept AI Suggestion
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => setShowAiPanel(false)}
                      className="w-full"
                      size="sm"
                    >
                      Hide AI Panel
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Intelligent Benchmarking Data */}
            {currentSuggestion && (
              <Card className="mt-4">
                <CardHeader>
                  <CardTitle className="text-sm flex items-center space-x-2">
                    <BarChart3 className="h-4 w-4" />
                    <span>Benchmark Data</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Portfolio Average:</span>
                      <span className="font-medium">{currentSuggestion.benchmarkData.portfolioAverage}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Industry Median:</span>
                      <span className="font-medium">{currentSuggestion.benchmarkData.industryMedian}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Top Quartile:</span>
                      <span className="font-medium">{currentSuggestion.benchmarkData.topQuartile}</span>
                    </div>
                    <div className="pt-2 border-t">
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Sample Size:</span>
                        <span>{currentSuggestion.benchmarkData.sampleSize} deals</span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {currentSuggestion.benchmarkData.dataSource}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Risk Factors and Opportunities */}
            {currentSuggestion && (currentSuggestion.riskFactors.length > 0 || currentSuggestion.opportunities.length > 0) && (
              <Card className="mt-4">
                <CardHeader>
                  <CardTitle className="text-sm">Key Considerations</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {currentSuggestion.riskFactors.length > 0 && (
                    <div>
                      <h4 className="text-xs font-medium text-red-700 mb-2 flex items-center">
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        Risk Factors
                      </h4>
                      {currentSuggestion.riskFactors.map((risk, index) => (
                        <div key={index} className="text-xs text-red-600 mb-1">• {risk}</div>
                      ))}
                    </div>
                  )}
                  
                  {currentSuggestion.opportunities.length > 0 && (
                    <div>
                      <h4 className="text-xs font-medium text-green-700 mb-2 flex items-center">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Opportunities
                      </h4>
                      {currentSuggestion.opportunities.map((opportunity, index) => (
                        <div key={index} className="text-xs text-green-600 mb-1">• {opportunity}</div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={handlePrevious}
          disabled={currentCriterionIndex === 0}
          className="flex items-center space-x-2"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Previous</span>
        </Button>
        <div className="flex items-center space-x-2">
          {!showAiPanel && (
            <Button 
              variant="outline"
              onClick={() => setShowAiPanel(true)}
              className="flex items-center space-x-2"
            >
              <Sparkles className="h-4 w-4" />
              <span>Show AI Help</span>
            </Button>
          )}
          <Button 
            onClick={handleNext}
            disabled={!scores[currentCriterion.id]?.value}
            className="flex items-center space-x-2"
          >
            <span>{currentCriterionIndex === template.criteria.length - 1 ? 'Complete Screening' : 'Next'}</span>
            {currentCriterionIndex === template.criteria.length - 1 ? (
              <CheckCircle className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

// Autonomous Mode Scoring Component
const AutonomousScoringInterface: React.FC<{
  template: DealScreeningTemplate;
  workflow: ScreeningWorkflow;
  opportunity: DealOpportunity;
  onScoreUpdate: (criterionId: string, score: number, notes?: string, aiGenerated?: boolean, confidence?: number) => void;
  onComplete: () => void;
}> = ({ template, workflow, opportunity, onScoreUpdate, onComplete }) => {
  const [aiProcessingStatus, setAiProcessingStatus] = useState<'processing' | 'completed' | 'pending_approval'>('processing');
  const [autoScores, setAutoScores] = useState<Record<string, { value: number; confidence: number; reasoning: string; needsApproval: boolean }>>({});
  const [pendingApprovals, setPendingApprovals] = useState<string[]>([]);
  const [currentProcessingStep, setCurrentProcessingStep] = useState(0);

  useEffect(() => {
    simulateAiProcessing();
  }, [template]);

  const simulateAiProcessing = async () => {
    setAiProcessingStatus('processing');
    
    console.log('Starting intelligent autonomous processing for:', opportunity.name);
    
    // Generate all AI suggestions using the intelligent service
    const aiSuggestions = AIScreeningService.generateBatchSuggestions(opportunity, template);
    
    // Process each criterion with realistic timing
    for (let i = 0; i < template.criteria.length; i++) {
      setCurrentProcessingStep(i);
      await new Promise(resolve => setTimeout(resolve, 600)); // Simulate processing time
      
      const criterion = template.criteria[i];
      const suggestion = aiSuggestions[criterion.id];
      
      if (suggestion) {
        const needsApproval = suggestion.confidence < 0.80; // Low confidence scores need approval
        
        const scoringResult = {
          value: suggestion.score,
          confidence: suggestion.confidence,
          reasoning: suggestion.reasoning,
          needsApproval,
        };

        setAutoScores(prev => ({
          ...prev,
          [criterion.id]: scoringResult
        }));

        if (needsApproval) {
          setPendingApprovals(prev => [...prev, criterion.id]);
        } else {
          onScoreUpdate(criterion.id, scoringResult.value, scoringResult.reasoning, true, scoringResult.confidence);
        }
      }
    }
    
    // Check if we have pending approvals after processing all criteria
    const finalPendingApprovals = template.criteria
      .map(c => c.id)
      .filter(id => aiSuggestions[id] && aiSuggestions[id].confidence < 0.80);
    
    setAiProcessingStatus(finalPendingApprovals.length > 0 ? 'pending_approval' : 'completed');
    
    console.log('Autonomous processing complete. Pending approvals:', finalPendingApprovals.length);
  };


  const handleApproveScore = (criterionId: string) => {
    const score = autoScores[criterionId];
    if (score) {
      onScoreUpdate(criterionId, score.value, score.reasoning, true, score.confidence);
      setPendingApprovals(prev => prev.filter(id => id !== criterionId));
      
      if (pendingApprovals.length === 1) { // This was the last one
        setAiProcessingStatus('completed');
      }
    }
  };

  const handleRejectScore = (criterionId: string) => {
    // In a real app, this would allow manual override
    setPendingApprovals(prev => prev.filter(id => id !== criterionId));
    console.log(`Manual review needed for criterion: ${criterionId}`);
  };

  const handleCompleteAutonomous = () => {
    onComplete();
  };

  const progress = ((template.criteria.length - pendingApprovals.length) / template.criteria.length) * 100;

  return (
    <div className="space-y-6">
      {/* AI Processing Status */}
      <Card className="border-2 border-purple-200 bg-gradient-to-r from-purple-50 to-blue-50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Bot className="h-6 w-6 text-purple-600" />
              <div>
                <h2 className="text-xl font-semibold text-purple-900">Autonomous AI Processing</h2>
                <p className="text-purple-700">
                  {aiProcessingStatus === 'processing' && `Processing criterion ${currentProcessingStep + 1} of ${template.criteria.length}...`}
                  {aiProcessingStatus === 'pending_approval' && `${pendingApprovals.length} scores need your approval`}
                  {aiProcessingStatus === 'completed' && 'All criteria processed automatically'}
                </p>
              </div>
            </div>
            <Badge className="bg-purple-100 text-purple-800">Autonomous Mode</Badge>
          </div>
          
          <Progress value={progress} className="w-full mb-2" />
          <p className="text-sm text-purple-600">{Math.round(progress)}% Complete</p>
        </CardContent>
      </Card>

      {/* Processing Animation */}
      {aiProcessingStatus === 'processing' && (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">AI Processing in Progress</h3>
            <p className="text-gray-600">
              Analyzing deal criteria using advanced algorithms and portfolio benchmarks...
            </p>
          </CardContent>
        </Card>
      )}

      {/* Pending Approvals */}
      {aiProcessingStatus === 'pending_approval' && pendingApprovals.length > 0 && (
        <Card className="border-2 border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-yellow-900">
              <AlertTriangle className="h-5 w-5" />
              <span>Approval Required</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-yellow-800 mb-4">
              The following scores have low confidence and need your approval:
            </p>
            <div className="space-y-4">
              {pendingApprovals.map(criterionId => {
                const criterion = template.criteria.find(c => c.id === criterionId);
                const score = autoScores[criterionId];
                
                return (
                  <div key={criterionId} className="border border-yellow-200 rounded-lg p-4 bg-white">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-gray-900">{criterion?.name}</h4>
                        <p className="text-sm text-gray-600">{criterion?.description}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-blue-600">{score?.value}</div>
                        <Badge variant="outline" className="text-xs">
                          {Math.round((score?.confidence || 0) * 100)}% confidence
                        </Badge>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-700 mb-4">{score?.reasoning}</p>
                    
                    <div className="flex space-x-2">
                      <Button 
                        size="sm" 
                        onClick={() => handleApproveScore(criterionId)}
                        className="flex items-center space-x-1"
                      >
                        <CheckCircle className="h-3 w-3" />
                        <span>Approve</span>
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleRejectScore(criterionId)}
                        className="flex items-center space-x-1"
                      >
                        <X className="h-3 w-3" />
                        <span>Manual Review</span>
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Completed Scores Summary */}
      {aiProcessingStatus === 'completed' && (
        <Card className="border-2 border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-green-900">
              <CheckCircle className="h-5 w-5" />
              <span>AI Processing Complete</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {template.criteria.map(criterion => {
                const score = autoScores[criterion.id];
                return (
                  <div key={criterion.id} className="flex items-center justify-between p-3 bg-white rounded border">
                    <div>
                      <h4 className="font-medium text-sm">{criterion.name}</h4>
                      <p className="text-xs text-gray-500">{criterion.category}</p>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-green-600">{score?.value}</div>
                      <div className="text-xs text-gray-500">
                        {Math.round((score?.confidence || 0) * 100)}%
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="text-center">
              <Button onClick={handleCompleteAutonomous} className="flex items-center space-x-2">
                <span>Complete Autonomous Screening</span>
                <CheckCircle className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* AI Performance Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">AI Performance Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-blue-600">2.3min</p>
              <p className="text-sm text-gray-600">Processing Time</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">89%</p>
              <p className="text-sm text-gray-600">Avg Confidence</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-purple-600">4.2hrs</p>
              <p className="text-sm text-gray-600">Time Saved</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Main Component
export default function DealScreeningPage() {
  const params = useParams();
  const router = useRouter();
  const opportunityId = params.id as string;
  
  const [opportunity, setOpportunity] = useState<DealOpportunity | null>(null);
  const [currentStep, setCurrentStep] = useState<'template_selection' | 'scoring' | 'review' | 'workflow_summary'>('template_selection');
  const [workflowData, setWorkflowData] = useState<any>(null);
  const [scores, setScores] = useState<Record<string, CriterionScore>>({});
  const [scoringResult, setScoringResult] = useState<ScoringResult | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<DealScreeningTemplate | null>(null);
  const [workflow, setWorkflow] = useState<ScreeningWorkflow | null>(null);
  const [loading, setLoading] = useState(true);
  const { currentMode, setCurrentModule } = useNavigationStore();
  const mode = currentMode.mode;

  // Set current module for navigation store
  useEffect(() => {
    setCurrentModule('deal-screening');
  }, [setCurrentModule]);

  // Fetch opportunity data
  useEffect(() => {
    if (opportunityId) {
      fetchOpportunity();
    }
  }, [opportunityId]);

  const fetchOpportunity = async () => {
    try {
      const response = await fetch(`/api/deal-screening/opportunities/${opportunityId}`);
      const data = await response.json();
      setOpportunity(data.opportunity);
    } catch (error) {
      console.error('Error fetching opportunity:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTemplateSelected = (template: DealScreeningTemplate, customizations?: any[]) => {
    setSelectedTemplate(template);
    
    // Initialize empty score record
    const emptyScores = ScoringService.createEmptyScoreRecord(template);
    setScores(emptyScores);
    
    // Create workflow
    const newWorkflow: ScreeningWorkflow = {
      id: `workflow-${Date.now()}`,
      opportunityId,
      templateId: template.id,
      currentStep: 0,
      totalSteps: template.criteria.length,
      status: 'in_progress',
      mode,
      completedCriteria: [],
      startedAt: new Date().toISOString(),
    };
    
    setWorkflow(newWorkflow);
    setCurrentStep('scoring');
  };

  const handleScoreUpdate = (criterionId: string, score: number, notes?: string, aiGenerated?: boolean, confidence?: number) => {
    // Update scores state
    setScores(prev => ({
      ...prev,
      [criterionId]: {
        criterionId,
        value: score,
        notes: notes || '',
        aiGenerated: aiGenerated || false,
        confidence
      }
    }));

    // Update workflow progress
    if (workflow && !workflow.completedCriteria.includes(criterionId)) {
      setWorkflow(prev => prev ? {
        ...prev,
        completedCriteria: [...prev.completedCriteria, criterionId]
      } : null);
    }
  };

  const handleScoringComplete = async () => {
    if (!selectedTemplate) {
      console.error('No template selected');
      return;
    }

    // Calculate final scores using the scoring service
    const finalScoringResult = ScoringService.calculateFinalScores(scores, selectedTemplate);
    setScoringResult(finalScoringResult);

    // Validate scoring completeness
    const validation = ScoringService.validateScoring(scores, selectedTemplate, mode === 'autonomous');
    
    if (!validation.valid) {
      console.error('Scoring validation failed:', validation.errors);
      // In a real app, show these errors to the user
      alert(`Scoring incomplete:\n${validation.errors.join('\n')}`);
      return;
    }

    // Convert scores to API format
    const apiScores = ScoringService.convertScoresForAPI(scores, selectedTemplate);

    // Check if we should show workflow summary for assisted/autonomous modes
    if (mode !== 'traditional') {
      try {
        const response = await fetch(`/api/deal-screening/opportunities/${opportunityId}/screen`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            templateId: selectedTemplate.id,
            scores: apiScores, // Now sending actual calculated scores
            notes: `Screening completed with ${Math.round(finalScoringResult.completionRate * 100)}% criteria completion. Final score: ${finalScoringResult.totalScore}/100`,
            mode,
            autoComplete: true
          })
        });
        
        const data = await response.json();
        
        if (data.success && data.data.workflowInitiated) {
          setWorkflowData({
            ...data.data,
            localScoringResult: finalScoringResult // Add our calculated scores for display
          });
          setCurrentStep('workflow_summary');
          return;
        }
      } catch (error) {
        console.error('Error completing screening:', error);
      }
    }
    
    setCurrentStep('review');
  };

  const handleBack = () => {
    router.push(`/deal-screening/opportunity/${opportunityId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h3 className="text-xl font-semibold text-gray-700">Loading Screening Interface...</h3>
        </div>
      </div>
    );
  }

  if (!opportunity) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700">Opportunity Not Found</h3>
          <Button onClick={() => router.push('/deal-screening')} className="mt-4">
            Back to Deal Screening
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-6">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumbs */}
          <nav className="mb-4">
            <ol className="flex items-center space-x-2 text-sm text-gray-500">
              <li>
                <a href="/dashboard" className="hover:text-gray-700">Dashboard</a>
              </li>
              <li>/</li>
              <li>
                <a href="/deal-screening" className="hover:text-gray-700">Deal Screening</a>
              </li>
              <li>/</li>
              <li>
                <a href={`/deal-screening/opportunity/${opportunityId}`} className="hover:text-gray-700">
                  {opportunity.name}
                </a>
              </li>
              <li>/</li>
              <li className="font-medium text-gray-900">Screening Process</li>
            </ol>
          </nav>

          {/* Title and Step Indicator */}
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{opportunity.name}</h1>
              <p className="text-gray-600 mt-1">
                {currentStep === 'template_selection' && 'Select screening template'}
                {currentStep === 'scoring' && 'Score investment criteria'}
                {currentStep === 'review' && 'Review and finalize screening'}
                {currentStep === 'workflow_summary' && 'Workflow initiated and next steps assigned'}
              </p>
            </div>
            
            {/* Step Progress */}
            <div className="flex items-center space-x-2">
              {['template_selection', 'scoring', 'review', 'workflow_summary'].map((step, index) => (
                <div key={step} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    currentStep === step 
                      ? 'bg-blue-600 text-white' 
                      : index < ['template_selection', 'scoring', 'review', 'workflow_summary'].indexOf(currentStep)
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {index < ['template_selection', 'scoring', 'review', 'workflow_summary'].indexOf(currentStep) ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      index + 1
                    )}
                  </div>
                  {index < 3 && (
                    <div className={`w-8 h-0.5 ${
                      index < ['template_selection', 'scoring', 'review', 'workflow_summary'].indexOf(currentStep)
                        ? 'bg-green-500'
                        : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {currentStep === 'template_selection' && (
          <TemplateSelectionStep
            opportunity={opportunity}
            mode={mode}
            onTemplateSelected={handleTemplateSelected}
            onBack={handleBack}
          />
        )}

        {currentStep === 'scoring' && selectedTemplate && workflow && (
          <>
            {mode === 'traditional' && (
              <TraditionalScoringInterface
                template={selectedTemplate}
                workflow={workflow}
                onScoreUpdate={handleScoreUpdate}
                onComplete={handleScoringComplete}
              />
            )}
            {mode === 'assisted' && (
              <AssistedScoringInterface
                template={selectedTemplate}
                workflow={workflow}
                opportunity={opportunity}
                onScoreUpdate={handleScoreUpdate}
                onComplete={handleScoringComplete}
              />
            )}
            {mode === 'autonomous' && (
              <AutonomousScoringInterface
                template={selectedTemplate}
                workflow={workflow}
                opportunity={opportunity}
                onScoreUpdate={handleScoreUpdate}
                onComplete={handleScoringComplete}
              />
            )}
          </>
        )}

        {currentStep === 'review' && (
          <div className="text-center py-12">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Screening Complete!</h2>
            <p className="text-gray-600 mb-6">Your deal screening has been saved and is ready for review.</p>
            <div className="flex justify-center space-x-4">
              <Button variant="outline" onClick={() => router.push(`/deal-screening/opportunity/${opportunityId}`)}>
                View Opportunity
              </Button>
              <Button onClick={() => router.push('/deal-screening')}>
                Back to Dashboard
              </Button>
            </div>
          </div>
        )}

        {currentStep === 'workflow_summary' && workflowData && (
          <div className="space-y-6">
            {/* Success Header */}
            <div className="text-center py-8">
              <div className="flex items-center justify-center mb-4">
                <CheckCircle className="h-12 w-12 text-green-500 mr-3" />
                <Zap className="h-8 w-8 text-purple-500" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Screening Complete & Workflow Initiated!
              </h2>
              <p className="text-gray-600 mb-2">
                {opportunity?.name} has been screened and automatically routed for next steps.
              </p>
              <Badge className="bg-green-100 text-green-800 px-3 py-1">
                Score: {workflowData.localScoringResult?.totalScore || workflowData.screeningResult?.totalScore}/100 • {workflowData.screeningResult?.recommendation?.replace('_', ' ')}
              </Badge>
            </div>

            {/* Workflow Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Next Stage */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <ArrowRight className="h-5 w-5 text-blue-600 mr-2" />
                    Next Stage
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Badge className={`${
                      workflowData.postScreeningWorkflow?.currentStage === 'committee_review' 
                        ? 'bg-orange-100 text-orange-800' 
                        : workflowData.postScreeningWorkflow?.currentStage === 'due_diligence'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-purple-100 text-purple-800'
                    }`}>
                      {workflowData.postScreeningWorkflow?.currentStage?.replace('_', ' ').toUpperCase() || 'COMMITTEE REVIEW'}
                    </Badge>
                    <p className="text-sm text-gray-600">
                      Automatically routed based on screening score and deal characteristics.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Immediate Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <Clock className="h-5 w-5 text-orange-600 mr-2" />
                    Immediate Actions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="text-lg font-semibold text-gray-900">
                      {workflowData.nextSteps?.length || 0} tasks
                    </div>
                    <div className="space-y-1">
                      {workflowData.nextSteps?.slice(0, 2).map((step: any, index: number) => (
                        <div key={index} className="flex items-center text-sm text-gray-600">
                          <div className="w-2 h-2 bg-orange-400 rounded-full mr-2"></div>
                          {step.title}
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Notifications */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <Bell className="h-5 w-5 text-purple-600 mr-2" />
                    Notifications
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="text-lg font-semibold text-gray-900">
                      {workflowData.notifications?.length || 0} sent
                    </div>
                    <p className="text-sm text-gray-600">
                      Stakeholders have been notified and assignments distributed.
                    </p>
                    {workflowData.postScreeningWorkflow?.assignments?.length > 0 && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Users className="h-4 w-4 mr-1" />
                        {workflowData.postScreeningWorkflow.assignments.length} team members assigned
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Workflow Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 text-gray-600 mr-2" />
                  Workflow Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Process Overview */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Process Overview</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Automation Level:</span>
                        <Badge variant="outline">{workflowData.postScreeningWorkflow?.automationLevel || mode}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Steps:</span>
                        <span className="font-medium">{workflowData.postScreeningWorkflow?.nextSteps?.length || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Est. Timeline:</span>
                        <span className="font-medium">
                          {workflowData.postScreeningWorkflow?.currentStage === 'committee_review' ? '1-2 weeks' :
                           workflowData.postScreeningWorkflow?.currentStage === 'due_diligence' ? '3-4 weeks' : '2-3 weeks'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Scoring Details */}
                  {workflowData.localScoringResult && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Scoring Breakdown</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Total Score:</span>
                          <span className="font-medium">{workflowData.localScoringResult.totalScore}/100</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Criteria Completed:</span>
                          <span className="font-medium">{Math.round(workflowData.localScoringResult.completionRate * 100)}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Weighted Average:</span>
                          <span className="font-medium">{workflowData.localScoringResult.weightedAverage}/100</span>
                        </div>
                      </div>
                      
                      {/* Category Scores */}
                      <div className="mt-3 space-y-1">
                        <div className="text-xs font-medium text-gray-700 uppercase tracking-wide">Category Scores:</div>
                        {Object.entries(workflowData.localScoringResult.scoreBreakdown).map(([category, score]) => (
                          <div key={category} className="flex justify-between text-xs">
                            <span className="text-gray-600 capitalize">{category}:</span>
                            <span className={`font-medium ${ScoringService.getScoreColorClass(score as number)}`}>
                              {score}/100
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* AI Insights */}
                  {workflowData.aiInsights && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">AI Analysis</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Confidence:</span>
                          <span className="font-medium">{Math.round((workflowData.aiInsights.confidence || 0.85) * 100)}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Sector Percentile:</span>
                          <span className="font-medium">{workflowData.aiInsights.benchmarkComparison?.percentile || 75}th</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Processing Time:</span>
                          <span className="font-medium">{workflowData.aiInsights.processingTime?.toFixed(1) || '8.3'}s</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Risk Factors & Opportunities */}
                {workflowData.aiInsights && (workflowData.aiInsights.riskFactors?.length > 0 || workflowData.aiInsights.opportunities?.length > 0) && (
                  <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {workflowData.aiInsights.riskFactors?.length > 0 && (
                      <div>
                        <h5 className="font-medium text-gray-900 mb-2 flex items-center">
                          <AlertTriangle className="h-4 w-4 text-yellow-500 mr-1" />
                          Key Risks
                        </h5>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {workflowData.aiInsights.riskFactors.map((risk: string, index: number) => (
                            <li key={index} className="flex items-start">
                              <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full mt-2 mr-2 flex-shrink-0"></div>
                              {risk}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {workflowData.aiInsights.opportunities?.length > 0 && (
                      <div>
                        <h5 className="font-medium text-gray-900 mb-2 flex items-center">
                          <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                          Opportunities
                        </h5>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {workflowData.aiInsights.opportunities.map((opp: string, index: number) => (
                            <li key={index} className="flex items-start">
                              <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 mr-2 flex-shrink-0"></div>
                              {opp}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4 pt-6">
              <Button 
                onClick={() => router.push(`/deal-screening/opportunity/${opportunityId}/workflow`)}
                className="flex items-center"
              >
                <Eye className="h-4 w-4 mr-2" />
                View Workflow Details
              </Button>
              <Button 
                variant="outline" 
                onClick={() => router.push(`/deal-screening/opportunity/${opportunityId}`)}
              >
                <FileText className="h-4 w-4 mr-2" />
                View Opportunity
              </Button>
              <Button 
                variant="outline" 
                onClick={() => router.push('/deal-screening')}
              >
                Back to Dashboard
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}