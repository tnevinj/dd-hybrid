'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  TrendingUp, 
  Calendar, 
  DollarSign, 
  Users, 
  FileText, 
  BarChart3, 
  Target,
  AlertCircle,
  CheckCircle,
  Clock,
  Plus,
  ArrowRight,
  Brain,
  Lightbulb,
  Star,
  Zap
} from 'lucide-react';
import type { HybridMode } from '@/components/shared';
import { ExitAnalyticsDashboard } from './ExitAnalyticsDashboard';

interface ExitManagementAssistedProps {
  onSwitchMode?: (mode: HybridMode) => void;
}

interface AIInsight {
  type: 'opportunity' | 'warning' | 'recommendation';
  title: string;
  description: string;
  confidence: number;
  actionable: boolean;
}

interface EnhancedExitOpportunity {
  id: string;
  companyName: string;
  sector: string;
  currentValuation: number;
  targetExitValue: number;
  aiPredictedValue: number;
  exitStrategy: string;
  targetDate: string;
  aiOptimalDate: string;
  preparationStage: 'planning' | 'preparation' | 'execution';
  progress: number;
  aiScore: number;
  marketTiming: 'excellent' | 'good' | 'fair' | 'poor';
  lastUpdate: string;
  keyMetrics: {
    irr: number;
    moic: number;
    holdingPeriod: number;
  };
  aiInsights: AIInsight[];
  status: 'active' | 'on-hold' | 'completed';
}

export function ExitManagementAssisted({ onSwitchMode }: ExitManagementAssistedProps) {
  const [exitOpportunities, setExitOpportunities] = useState<EnhancedExitOpportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('pipeline');

  useEffect(() => {
    // Load AI-enhanced exit opportunities data
    const loadExitData = async () => {
      try {
        // Mock AI-enhanced data
        const mockData: EnhancedExitOpportunity[] = [
          {
            id: '1',
            companyName: 'TechCorp Solutions',
            sector: 'Technology',
            currentValuation: 85000000,
            targetExitValue: 120000000,
            aiPredictedValue: 135000000,
            exitStrategy: 'Strategic Sale',
            targetDate: '2024-Q3',
            aiOptimalDate: '2024-Q4',
            preparationStage: 'preparation',
            progress: 65,
            aiScore: 8.7,
            marketTiming: 'excellent',
            lastUpdate: '2024-01-15',
            keyMetrics: {
              irr: 22.5,
              moic: 2.8,
              holdingPeriod: 4.2
            },
            aiInsights: [
              {
                type: 'opportunity',
                title: 'Market Conditions Favorable',
                description: 'Tech sector valuations are 15% above historical averages. Consider accelerating exit timeline.',
                confidence: 87,
                actionable: true
              },
              {
                type: 'recommendation',
                title: 'Strategic Buyer Identified',
                description: 'AI analysis suggests MegaCorp Inc. as optimal strategic acquirer based on synergies.',
                confidence: 92,
                actionable: true
              }
            ],
            status: 'active'
          },
          {
            id: '2',
            companyName: 'GreenEnergy Dynamics',
            sector: 'Energy',
            currentValuation: 150000000,
            targetExitValue: 200000000,
            aiPredictedValue: 185000000,
            exitStrategy: 'IPO',
            targetDate: '2025-Q1',
            aiOptimalDate: '2024-Q4',
            preparationStage: 'planning',
            progress: 35,
            aiScore: 7.3,
            marketTiming: 'good',
            lastUpdate: '2024-01-12',
            keyMetrics: {
              irr: 18.7,
              moic: 3.2,
              holdingPeriod: 5.1
            },
            aiInsights: [
              {
                type: 'warning',
                title: 'IPO Market Volatility',
                description: 'Current market conditions show increased volatility. Monitor closely for optimal timing.',
                confidence: 78,
                actionable: true
              },
              {
                type: 'recommendation',
                title: 'Accelerate ESG Initiatives',
                description: 'ESG metrics significantly impact clean energy IPO valuations. Strengthen reporting.',
                confidence: 85,
                actionable: true
              }
            ],
            status: 'active'
          },
          {
            id: '3',
            companyName: 'HealthTech Innovations',
            sector: 'Healthcare',
            currentValuation: 45000000,
            targetExitValue: 75000000,
            aiPredictedValue: 82000000,
            exitStrategy: 'Management Buyout',
            targetDate: '2024-Q4',
            aiOptimalDate: '2024-Q3',
            preparationStage: 'execution',
            progress: 85,
            aiScore: 9.1,
            marketTiming: 'excellent',
            lastUpdate: '2024-01-18',
            keyMetrics: {
              irr: 25.3,
              moic: 2.1,
              holdingPeriod: 3.8
            },
            aiInsights: [
              {
                type: 'opportunity',
                title: 'Management Team Ready',
                description: 'Management team has secured financing and regulatory approvals are in place.',
                confidence: 94,
                actionable: true
              }
            ],
            status: 'active'
          }
        ];
        
        setExitOpportunities(mockData);
        setLoading(false);
      } catch (error) {
        console.error('Failed to load exit data:', error);
        setLoading(false);
      }
    };

    loadExitData();
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'planning': return 'bg-blue-100 text-blue-800';
      case 'preparation': return 'bg-yellow-100 text-yellow-800';
      case 'execution': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getMarketTimingColor = (timing: string) => {
    switch (timing) {
      case 'excellent': return 'bg-green-100 text-green-800';
      case 'good': return 'bg-blue-100 text-blue-800';
      case 'fair': return 'bg-yellow-100 text-yellow-800';
      case 'poor': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'opportunity': return <Lightbulb className="h-4 w-4 text-green-600" />;
      case 'warning': return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      case 'recommendation': return <Star className="h-4 w-4 text-blue-600" />;
      default: return <Brain className="h-4 w-4" />;
    }
  };

  // Calculate enhanced metrics
  const totalPipelineValue = exitOpportunities.reduce((sum, opp) => sum + opp.aiPredictedValue, 0);
  const avgAIScore = exitOpportunities.reduce((sum, opp) => sum + opp.aiScore, 0) / exitOpportunities.length || 0;
  const totalInsights = exitOpportunities.reduce((sum, opp) => sum + opp.aiInsights.length, 0);
  const activeOpportunities = exitOpportunities.filter(opp => opp.status === 'active').length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading AI-enhanced exit data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* AI Enhancement Alert */}
      <Alert className="bg-blue-50 border-blue-200">
        <Brain className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800">
          <strong>AI-Assisted Mode Active:</strong> Enhanced with predictive analytics, market intelligence, and automated insights to optimize exit strategies and timing.
        </AlertDescription>
      </Alert>

      {/* Enhanced Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI-Predicted Pipeline Value</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalPipelineValue)}</div>
            <p className="text-xs text-muted-foreground">
              AI-enhanced valuations (+{Math.round(((totalPipelineValue / exitOpportunities.reduce((sum, opp) => sum + opp.targetExitValue, 0)) - 1) * 100)}% vs. targets)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average AI Score</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgAIScore.toFixed(1)}/10</div>
            <p className="text-xs text-muted-foreground">
              AI-driven exit readiness assessment
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Insights</CardTitle>
            <Lightbulb className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalInsights}</div>
            <p className="text-xs text-muted-foreground">
              AI-generated recommendations
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Optimal Timing</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {exitOpportunities.filter(opp => opp.marketTiming === 'excellent').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Opportunities with excellent timing
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="pipeline">AI-Enhanced Pipeline</TabsTrigger>
          <TabsTrigger value="analytics">Predictive Analytics</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
          <TabsTrigger value="automation">Smart Automation</TabsTrigger>
        </TabsList>

        <TabsContent value="pipeline" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">AI-Enhanced Exit Pipeline</h3>
              <p className="text-sm text-gray-600">Smart exit management with AI-powered insights and predictions</p>
            </div>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Exit Opportunity
            </Button>
          </div>

          <div className="space-y-4">
            {exitOpportunities.map((opportunity) => (
              <Card key={opportunity.id} className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-blue-500">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div>
                        <CardTitle className="text-lg flex items-center">
                          {opportunity.companyName}
                          <Badge className="ml-2 bg-blue-100 text-blue-800">
                            AI Score: {opportunity.aiScore.toFixed(1)}
                          </Badge>
                        </CardTitle>
                        <CardDescription className="flex items-center space-x-2">
                          <span>{opportunity.sector}</span>
                          <span>•</span>
                          <span>{opportunity.exitStrategy}</span>
                          <span>•</span>
                          <Badge className={getMarketTimingColor(opportunity.marketTiming)}>
                            {opportunity.marketTiming} timing
                          </Badge>
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getStageColor(opportunity.preparationStage)}>
                        <span className="capitalize">{opportunity.preparationStage}</span>
                      </Badge>
                      <Button variant="outline" size="sm">
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <div className="space-y-1">
                      <p className="text-sm text-gray-600">Current Valuation</p>
                      <p className="text-lg font-semibold">{formatCurrency(opportunity.currentValuation)}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-600">Target Exit Value</p>
                      <p className="text-lg font-semibold">{formatCurrency(opportunity.targetExitValue)}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-600">AI Predicted Value</p>
                      <p className="text-lg font-semibold text-blue-600">{formatCurrency(opportunity.aiPredictedValue)}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-600">Optimal Timeline</p>
                      <div className="flex flex-col">
                        <span className="text-sm text-gray-500">Target: {opportunity.targetDate}</span>
                        <span className="text-sm font-medium text-blue-600">AI Optimal: {opportunity.aiOptimalDate}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Exit Preparation Progress</span>
                      <span>{opportunity.progress}%</span>
                    </div>
                    <Progress value={opportunity.progress} className="h-2" />
                  </div>

                  {/* AI Insights Preview */}
                  {opportunity.aiInsights.length > 0 && (
                    <div className="mt-4 pt-4 border-t">
                      <h4 className="text-sm font-medium mb-2 flex items-center">
                        <Brain className="h-4 w-4 mr-1" />
                        Key AI Insights
                      </h4>
                      <div className="space-y-2">
                        {opportunity.aiInsights.slice(0, 2).map((insight, index) => (
                          <div key={index} className="flex items-start space-x-2 p-2 bg-gray-50 rounded">
                            {getInsightIcon(insight.type)}
                            <div className="flex-1">
                              <p className="text-sm font-medium">{insight.title}</p>
                              <p className="text-xs text-gray-600">{insight.description}</p>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {insight.confidence}% confidence
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <ExitAnalyticsDashboard />
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Lightbulb className="h-5 w-5 mr-2" />
                AI-Generated Insights
              </CardTitle>
              <CardDescription>
                Smart recommendations and actionable insights for exit management
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Lightbulb className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">Comprehensive AI insights dashboard</p>
                <p className="text-sm text-gray-500">
                  Intelligent recommendations for exit timing, strategy optimization, and market opportunities
                </p>
                <Button className="mt-4" variant="outline">
                  View All Insights
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="automation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Zap className="h-5 w-5 mr-2" />
                Smart Exit Automation
              </CardTitle>
              <CardDescription>
                Automated workflows and intelligent process management
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Zap className="h-12 w-12 text-purple-500 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">Intelligent automation workflows</p>
                <p className="text-sm text-gray-500">
                  Automated exit preparation, document generation, stakeholder notifications, and progress tracking
                </p>
                <Button className="mt-4" variant="outline">
                  Configure Automation
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}