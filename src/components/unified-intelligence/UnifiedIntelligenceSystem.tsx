'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Brain,
  Target,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  TrendingDown,
  BarChart3,
  LineChart,
  Activity,
  Zap,
  Eye,
  Download,
  RefreshCw,
  ArrowUp,
  ArrowDown,
  Calendar,
  DollarSign,
  Users,
  Building,
  Globe,
  Shield,
  Lightbulb,
  MessageSquare,
  Clock,
  FileText,
  PieChart,
  NetworkIcon
} from 'lucide-react';
import { formatCurrency, formatPercentage, formatDate } from '@/lib/utils';

interface UnifiedInsight {
  id: string;
  type: 'OPPORTUNITY' | 'RISK' | 'TREND' | 'ACTION';
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  title: string;
  description: string;
  sourceModules: string[];
  confidence: number;
  impact: number; // 0-100
  timeHorizon: '1W' | '1M' | '3M' | '6M' | '12M';
  relatedInsights: string[];
  actionItems: {
    action: string;
    owner: string;
    deadline: Date;
    status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  }[];
  metrics: {
    [key: string]: number;
  };
}

interface CrossModuleCorrelation {
  moduleA: string;
  moduleB: string;
  correlationType: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL';
  strength: number; // 0-100
  description: string;
  examples: string[];
  lastUpdated: Date;
}

interface IntelligenceOverview {
  totalInsights: number;
  criticalAlerts: number;
  opportunityScore: number;
  riskScore: number;
  confidenceLevel: number;
  moduleHealth: {
    module: string;
    status: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR';
    score: number;
    lastUpdate: Date;
  }[];
  trendingTopics: {
    topic: string;
    relevance: number;
    mentions: number;
    sentiment: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL';
  }[];
}

interface StrategicRecommendation {
  id: string;
  category: 'INVESTMENT' | 'RISK_MANAGEMENT' | 'OPERATIONAL' | 'STRATEGIC';
  title: string;
  description: string;
  rationale: string;
  supportingData: {
    module: string;
    insight: string;
    weight: number;
  }[];
  expectedImpact: {
    financial: number;
    strategic: number;
    risk: number;
  };
  implementation: {
    complexity: 'LOW' | 'MEDIUM' | 'HIGH';
    timeline: string;
    resources: string[];
    dependencies: string[];
  };
  approval: {
    requiredLevel: 'IC' | 'MANAGEMENT' | 'BOARD';
    status: 'DRAFT' | 'REVIEW' | 'APPROVED' | 'REJECTED';
    approver?: string;
    approvalDate?: Date;
  };
}

interface UnifiedIntelligenceSystemProps {
  navigationMode?: 'traditional' | 'assisted' | 'autonomous';
}

export function UnifiedIntelligenceSystem({ 
  navigationMode = 'autonomous' 
}: UnifiedIntelligenceSystemProps) {
  const [overview, setOverview] = useState<IntelligenceOverview | null>(null);
  const [insights, setInsights] = useState<UnifiedInsight[]>([]);
  const [correlations, setCorrelations] = useState<CrossModuleCorrelation[]>([]);
  const [recommendations, setRecommendations] = useState<StrategicRecommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('overview');
  const [selectedPriority, setSelectedPriority] = useState<string>('ALL');
  const [selectedTimeHorizon, setSelectedTimeHorizon] = useState<string>('ALL');

  useEffect(() => {
    loadUnifiedIntelligence();
  }, []);

  const loadUnifiedIntelligence = async () => {
    try {
      setLoading(true);
      
      // Mock unified intelligence data - in production this would aggregate from all modules
      const mockOverview: IntelligenceOverview = {
        totalInsights: 47,
        criticalAlerts: 3,
        opportunityScore: 78,
        riskScore: 34,
        confidenceLevel: 85,
        moduleHealth: [
          { module: 'Due Diligence', status: 'EXCELLENT', score: 92, lastUpdate: new Date('2024-03-20T10:30:00') },
          { module: 'Deal Screening', status: 'EXCELLENT', score: 89, lastUpdate: new Date('2024-03-20T10:25:00') },
          { module: 'Fund Operations', status: 'GOOD', score: 87, lastUpdate: new Date('2024-03-20T10:20:00') },
          { module: 'Investment Committee', status: 'EXCELLENT', score: 84, lastUpdate: new Date('2024-03-20T10:15:00') },
          { module: 'Market Intelligence', status: 'GOOD', score: 81, lastUpdate: new Date('2024-03-20T10:10:00') }
        ],
        trendingTopics: [
          { topic: 'AI Adoption', relevance: 95, mentions: 34, sentiment: 'POSITIVE' },
          { topic: 'Energy Transition', relevance: 87, mentions: 28, sentiment: 'NEUTRAL' },
          { topic: 'Regulatory Changes', relevance: 78, mentions: 19, sentiment: 'NEGATIVE' },
          { topic: 'Market Volatility', relevance: 72, mentions: 23, sentiment: 'NEGATIVE' }
        ]
      };

      const mockInsights: UnifiedInsight[] = [
        {
          id: 'insight-1',
          type: 'OPPORTUNITY',
          priority: 'CRITICAL',
          title: 'High-Confidence AI Investment Opportunity',
          description: 'Cross-module analysis indicates exceptional AI investment opportunity with 89% success probability',
          sourceModules: ['Due Diligence', 'Deal Screening', 'Market Intelligence'],
          confidence: 89,
          impact: 92,
          timeHorizon: '6M',
          relatedInsights: ['insight-3', 'insight-7'],
          actionItems: [
            { action: 'Accelerate due diligence process', owner: 'Due Diligence Team', deadline: new Date('2024-04-15'), status: 'IN_PROGRESS' },
            { action: 'Schedule IC presentation', owner: 'Deal Team', deadline: new Date('2024-04-10'), status: 'PENDING' }
          ],
          metrics: {
            expectedIRR: 27.5,
            riskScore: 28,
            marketFit: 88,
            teamQuality: 92
          }
        },
        {
          id: 'insight-2',
          type: 'RISK',
          priority: 'HIGH',
          title: 'LP Payment Risk Concentration',
          description: 'Multiple modules detect elevated default risk from strategic LP representing 20% of fund',
          sourceModules: ['Fund Operations', 'Investment Committee'],
          confidence: 87,
          impact: 78,
          timeHorizon: '3M',
          relatedInsights: ['insight-4'],
          actionItems: [
            { action: 'Contact LP for payment confirmation', owner: 'Fund Operations', deadline: new Date('2024-04-05'), status: 'PENDING' },
            { action: 'Prepare contingency funding plan', owner: 'Fund Management', deadline: new Date('2024-04-20'), status: 'PENDING' }
          ],
          metrics: {
            exposureAmount: 50000000,
            defaultProbability: 15,
            impactOnFund: 65
          }
        },
        {
          id: 'insight-3',
          type: 'TREND',
          priority: 'MEDIUM',
          title: 'Sector Rotation Pattern Detected',
          description: 'AI models predict 72% probability of capital rotation from Energy to Technology sector',
          sourceModules: ['Market Intelligence', 'Deal Screening'],
          confidence: 82,
          impact: 68,
          timeHorizon: '3M',
          relatedInsights: ['insight-1'],
          actionItems: [
            { action: 'Rebalance sector allocation', owner: 'Portfolio Management', deadline: new Date('2024-05-01'), status: 'PENDING' }
          ],
          metrics: {
            rotationProbability: 72,
            expectedAlpha: 8.3,
            volatilityImpact: 12
          }
        },
        {
          id: 'insight-4',
          type: 'ACTION',
          priority: 'HIGH',
          title: 'Optimize Capital Call Timing',
          description: 'Predictive models suggest 3-week delay in capital call improves collection rates by 12%',
          sourceModules: ['Fund Operations', 'Investment Committee'],
          confidence: 84,
          impact: 45,
          timeHorizon: '1M',
          relatedInsights: ['insight-2'],
          actionItems: [
            { action: 'Reschedule capital call', owner: 'Fund Operations', deadline: new Date('2024-04-25'), status: 'PENDING' },
            { action: 'Notify LPs of timing change', owner: 'Investor Relations', deadline: new Date('2024-04-08'), status: 'PENDING' }
          ],
          metrics: {
            collectionImprovement: 12,
            cashFlowImpact: 35000000,
            lpSatisfaction: 8.5
          }
        }
      ];

      const mockCorrelations: CrossModuleCorrelation[] = [
        {
          moduleA: 'Due Diligence',
          moduleB: 'Market Intelligence',
          correlationType: 'POSITIVE',
          strength: 78,
          description: 'Strong correlation between DD success predictions and sector performance forecasts',
          examples: ['AI companies showing both high DD scores and positive sector outlook', 'Energy investments with poor DD and negative sector predictions'],
          lastUpdated: new Date('2024-03-20')
        },
        {
          moduleA: 'Fund Operations',
          moduleB: 'Investment Committee',
          correlationType: 'POSITIVE',
          strength: 85,
          description: 'Capital call timing optimization aligns with IC decision patterns',
          examples: ['Optimized timing reduces decision delays', 'LP payment patterns predict IC attendance'],
          lastUpdated: new Date('2024-03-19')
        },
        {
          moduleA: 'Deal Screening',
          moduleB: 'Due Diligence',
          correlationType: 'POSITIVE',
          strength: 92,
          description: 'High correlation between AI screening scores and DD success rates',
          examples: ['Deals with >85% screening score show 91% DD success', 'Low screening scores correlate with DD red flags'],
          lastUpdated: new Date('2024-03-20')
        }
      ];

      const mockRecommendations: StrategicRecommendation[] = [
        {
          id: 'rec-1',
          category: 'INVESTMENT',
          title: 'Accelerate AI Portfolio Allocation',
          description: 'Increase AI sector allocation from 15% to 25% based on cross-module intelligence',
          rationale: 'All modules show strong positive signals for AI investments with high confidence levels',
          supportingData: [
            { module: 'Due Diligence', insight: '89% success probability for AI deals', weight: 30 },
            { module: 'Market Intelligence', insight: 'AI sector forecast: +15.3% returns', weight: 25 },
            { module: 'Deal Screening', insight: '7 high-probability AI opportunities identified', weight: 25 },
            { module: 'Investment Committee', insight: '78% approval probability for AI proposals', weight: 20 }
          ],
          expectedImpact: {
            financial: 85,
            strategic: 92,
            risk: 28
          },
          implementation: {
            complexity: 'MEDIUM',
            timeline: '3-6 months',
            resources: ['Investment Team', 'Risk Management', 'Portfolio Analytics'],
            dependencies: ['Board approval', 'Risk framework update']
          },
          approval: {
            requiredLevel: 'IC',
            status: 'REVIEW',
            approver: 'Investment Committee'
          }
        },
        {
          id: 'rec-2',
          category: 'RISK_MANAGEMENT',
          title: 'Implement LP Diversification Strategy',
          description: 'Reduce concentration risk by capping single LP commitment at 15%',
          rationale: 'Fund Operations and IC data show correlation between LP concentration and operational risk',
          supportingData: [
            { module: 'Fund Operations', insight: '15% default risk from concentrated LP', weight: 40 },
            { module: 'Investment Committee', insight: 'Decision delays when key LPs absent', weight: 30 },
            { module: 'Market Intelligence', insight: 'Economic uncertainty affecting institutional investors', weight: 30 }
          ],
          expectedImpact: {
            financial: 65,
            strategic: 78,
            risk: -45
          },
          implementation: {
            complexity: 'HIGH',
            timeline: '12-18 months',
            resources: ['Fund Management', 'Legal', 'Investor Relations'],
            dependencies: ['Legal documentation update', 'New LP sourcing']
          },
          approval: {
            requiredLevel: 'BOARD',
            status: 'DRAFT'
          }
        }
      ];

      setOverview(mockOverview);
      setInsights(mockInsights);
      setCorrelations(mockCorrelations);
      setRecommendations(mockRecommendations);
    } catch (error) {
      console.error('Error loading unified intelligence:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'CRITICAL': return 'bg-red-100 text-red-800';
      case 'HIGH': return 'bg-orange-100 text-orange-800';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800';
      case 'LOW': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'OPPORTUNITY': return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'RISK': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'TREND': return <BarChart3 className="h-4 w-4 text-blue-600" />;
      case 'ACTION': return <Target className="h-4 w-4 text-purple-600" />;
      default: return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  const getHealthColor = (status: string) => {
    switch (status) {
      case 'EXCELLENT': return 'text-green-600';
      case 'GOOD': return 'text-blue-600';
      case 'FAIR': return 'text-yellow-600';
      case 'POOR': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const renderOverviewTab = () => {
    if (!overview) return null;

    return (
      <div className="space-y-6">
        {/* Intelligence Summary */}
        <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-xl text-blue-800">
              <Brain className="h-6 w-6" />
              Unified Intelligence Overview
            </CardTitle>
            <p className="text-blue-700">Cross-module AI insights and strategic intelligence</p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              <div>
                <div className="text-2xl font-bold text-blue-600 mb-2">{overview.totalInsights}</div>
                <p className="text-sm text-blue-700">Total Insights</p>
                <p className="text-xs text-blue-600 mt-1">Active across all modules</p>
              </div>
              
              <div>
                <div className="text-2xl font-bold text-red-600 mb-2">{overview.criticalAlerts}</div>
                <p className="text-sm text-red-700">Critical Alerts</p>
                <p className="text-xs text-red-600 mt-1">Require immediate attention</p>
              </div>
              
              <div>
                <div className="text-2xl font-bold text-green-600 mb-2">{overview.opportunityScore}</div>
                <p className="text-sm text-green-700">Opportunity Score</p>
                <p className="text-xs text-green-600 mt-1">Market potential index</p>
              </div>
              
              <div>
                <div className="text-2xl font-bold text-orange-600 mb-2">{overview.riskScore}</div>
                <p className="text-sm text-orange-700">Risk Score</p>
                <p className="text-xs text-orange-600 mt-1">Portfolio risk level</p>
              </div>
              
              <div>
                <div className="text-2xl font-bold text-purple-600 mb-2">{overview.confidenceLevel}%</div>
                <p className="text-sm text-purple-700">AI Confidence</p>
                <p className="text-xs text-purple-600 mt-1">Prediction accuracy</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Module Health and Trending Topics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Module Health Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {overview.moduleHealth.map((module, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-semibold">{module.module}</div>
                      <div className="text-sm text-gray-600">
                        Last updated: {formatDate(module.lastUpdate)}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="font-semibold">{module.score}/100</div>
                        <Badge className={`${
                          module.status === 'EXCELLENT' ? 'bg-green-100 text-green-800' :
                          module.status === 'GOOD' ? 'bg-blue-100 text-blue-800' :
                          module.status === 'FAIR' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {module.status}
                        </Badge>
                      </div>
                      <Progress value={module.score} className="w-20 h-2" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Trending Topics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {overview.trendingTopics.map((topic, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-semibold">{topic.topic}</div>
                      <div className="text-sm text-gray-600">{topic.mentions} mentions across modules</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="font-semibold">{topic.relevance}/100</div>
                        <Badge className={`${
                          topic.sentiment === 'POSITIVE' ? 'bg-green-100 text-green-800' :
                          topic.sentiment === 'NEGATIVE' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {topic.sentiment}
                        </Badge>
                      </div>
                      <Progress value={topic.relevance} className="w-20 h-2" />
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

  const renderInsightsTab = () => {
    const filteredInsights = insights.filter(insight => {
      const priorityMatch = selectedPriority === 'ALL' || insight.priority === selectedPriority;
      const timeHorizonMatch = selectedTimeHorizon === 'ALL' || insight.timeHorizon === selectedTimeHorizon;
      return priorityMatch && timeHorizonMatch;
    });

    return (
      <div className="space-y-6">
        {/* Insights Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Select value={selectedPriority} onValueChange={setSelectedPriority}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Priorities</SelectItem>
                <SelectItem value="CRITICAL">Critical</SelectItem>
                <SelectItem value="HIGH">High</SelectItem>
                <SelectItem value="MEDIUM">Medium</SelectItem>
                <SelectItem value="LOW">Low</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={selectedTimeHorizon} onValueChange={setSelectedTimeHorizon}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Time Horizon" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Horizons</SelectItem>
                <SelectItem value="1W">1 Week</SelectItem>
                <SelectItem value="1M">1 Month</SelectItem>
                <SelectItem value="3M">3 Months</SelectItem>
                <SelectItem value="6M">6 Months</SelectItem>
                <SelectItem value="12M">12 Months</SelectItem>
              </SelectContent>
            </Select>
            
            <Badge variant="outline">{filteredInsights.length} insights</Badge>
          </div>
          
          <Button onClick={loadUnifiedIntelligence} size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>

        {/* Insights List */}
        <div className="space-y-4">
          {filteredInsights.map((insight, index) => (
            <Card key={index} className="border-l-4 border-l-blue-500">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                  <div className="lg:col-span-2">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        {getTypeIcon(insight.type)}
                        <h3 className="font-semibold text-lg">{insight.title}</h3>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getPriorityColor(insight.priority)}>
                          {insight.priority}
                        </Badge>
                        <Badge variant="outline">{insight.timeHorizon}</Badge>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 mb-4">{insight.description}</p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="text-sm font-medium text-gray-700">Sources:</span>
                      {insight.sourceModules.map((module, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {module}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-sm text-gray-600">Confidence:</span>
                        <div className="flex items-center gap-2">
                          <Progress value={insight.confidence} className="flex-1 h-2" />
                          <span className="font-semibold">{insight.confidence}%</span>
                        </div>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Impact:</span>
                        <div className="flex items-center gap-2">
                          <Progress value={insight.impact} className="flex-1 h-2" />
                          <span className="font-semibold">{insight.impact}/100</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-3 text-gray-700">Key Metrics</h4>
                    <div className="space-y-2">
                      {Object.entries(insight.metrics).map(([key, value]) => (
                        <div key={key} className="flex justify-between text-sm">
                          <span className="capitalize text-gray-600">
                            {key.replace(/([A-Z])/g, ' $1').trim()}:
                          </span>
                          <span className="font-medium">
                            {key.toLowerCase().includes('rate') || key.toLowerCase().includes('irr') || key.toLowerCase().includes('probability') 
                              ? `${value}%` 
                              : key.toLowerCase().includes('amount') || key.toLowerCase().includes('impact')
                              ? typeof value === 'number' && value > 1000 ? formatCurrency(value) : value
                              : value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-3 text-gray-700">Action Items</h4>
                    <div className="space-y-2">
                      {insight.actionItems.slice(0, 3).map((action, idx) => (
                        <div key={idx} className="p-2 bg-gray-50 rounded text-sm">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium">{action.action}</span>
                            <Badge variant="outline" className={`text-xs ${
                              action.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                              action.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {action.status}
                            </Badge>
                          </div>
                          <div className="flex justify-between text-xs text-gray-600">
                            <span>{action.owner}</span>
                            <span>{formatDate(action.deadline)}</span>
                          </div>
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
  };

  const renderCorrelationsTab = () => (
    <div className="space-y-6">
      <Card className="border-2 border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-xl text-purple-800">
            <NetworkIcon className="h-6 w-6" />
            Cross-Module Intelligence Network
          </CardTitle>
          <p className="text-purple-700">AI-detected correlations and interconnections</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600 mb-2">{correlations.length}</div>
              <p className="text-sm text-purple-700">Active Correlations</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 mb-2">
                {Math.round(correlations.reduce((sum, c) => sum + c.strength, 0) / correlations.length)}%
              </div>
              <p className="text-sm text-green-700">Avg. Correlation Strength</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 mb-2">5</div>
              <p className="text-sm text-blue-700">Connected Modules</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {correlations.map((correlation, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <h3 className="font-semibold text-lg">
                    {correlation.moduleA} ↔ {correlation.moduleB}
                  </h3>
                  <Badge className={
                    correlation.correlationType === 'POSITIVE' ? 'bg-green-100 text-green-800' :
                    correlation.correlationType === 'NEGATIVE' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }>
                    {correlation.correlationType}
                  </Badge>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-semibold">{correlation.strength}% strength</span>
                  <Progress value={correlation.strength} className="w-24 h-2" />
                </div>
              </div>
              
              <p className="text-gray-600 mb-4">{correlation.description}</p>
              
              <div>
                <h4 className="font-medium mb-2 text-gray-700">Examples:</h4>
                <div className="space-y-1">
                  {correlation.examples.map((example, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-600">{example}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t text-xs text-gray-500">
                Last updated: {formatDate(correlation.lastUpdated)}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderRecommendationsTab = () => (
    <div className="space-y-6">
      {recommendations.map((rec, index) => (
        <Card key={index} className="border-l-4 border-l-green-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Badge className={
                  rec.category === 'INVESTMENT' ? 'bg-green-100 text-green-800' :
                  rec.category === 'RISK_MANAGEMENT' ? 'bg-red-100 text-red-800' :
                  rec.category === 'OPERATIONAL' ? 'bg-blue-100 text-blue-800' :
                  'bg-purple-100 text-purple-800'
                }>
                  {rec.category}
                </Badge>
                <h3 className="font-semibold text-lg">{rec.title}</h3>
              </div>
              <Badge className={
                rec.approval.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                rec.approval.status === 'REVIEW' ? 'bg-blue-100 text-blue-800' :
                rec.approval.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                'bg-gray-100 text-gray-800'
              }>
                {rec.approval.status}
              </Badge>
            </div>
            
            <p className="text-gray-600 mb-4">{rec.description}</p>
            <p className="text-sm text-gray-700 mb-6 p-3 bg-gray-50 rounded">{rec.rationale}</p>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div>
                <h4 className="font-medium mb-3">Supporting Evidence</h4>
                <div className="space-y-2">
                  {rec.supportingData.map((data, idx) => (
                    <div key={idx} className="p-2 border rounded text-sm">
                      <div className="font-medium">{data.module}</div>
                      <div className="text-gray-600">{data.insight}</div>
                      <div className="text-xs text-gray-500">Weight: {data.weight}%</div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-3">Expected Impact</h4>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Financial Impact</span>
                      <span>{rec.expectedImpact.financial}/100</span>
                    </div>
                    <Progress value={rec.expectedImpact.financial} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Strategic Value</span>
                      <span>{rec.expectedImpact.strategic}/100</span>
                    </div>
                    <Progress value={rec.expectedImpact.strategic} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Risk Impact</span>
                      <span>{Math.abs(rec.expectedImpact.risk)}/100</span>
                    </div>
                    <Progress value={Math.abs(rec.expectedImpact.risk)} className="h-2" />
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-3">Implementation</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Complexity:</span>
                    <Badge variant="outline" className={
                      rec.implementation.complexity === 'LOW' ? 'bg-green-100 text-green-800' :
                      rec.implementation.complexity === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }>
                      {rec.implementation.complexity}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Timeline:</span>
                    <span className="font-medium">{rec.implementation.timeline}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Required Level:</span>
                    <Badge variant="outline">{rec.approval.requiredLevel}</Badge>
                  </div>
                  <div>
                    <span className="text-gray-600">Resources:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {rec.implementation.resources.map((resource, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {resource}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-3">
          <Brain className="h-8 w-8 animate-pulse text-blue-600" />
          <span className="text-lg">Loading unified intelligence system...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Brain className="h-8 w-8 text-blue-600" />
            Unified Intelligence System
          </h1>
          <p className="text-gray-600 mt-1">
            Cross-module AI insights, correlations, and strategic recommendations
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-blue-100 text-blue-800">
            {navigationMode.toUpperCase()} Mode
          </Badge>
          <Badge className="bg-green-100 text-green-800">
            All Systems Active
          </Badge>
          <Button size="sm" variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Intelligence Report
          </Button>
        </div>
      </div>

      {/* Main Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Intelligence Overview</TabsTrigger>
          <TabsTrigger value="insights">Cross-Module Insights</TabsTrigger>
          <TabsTrigger value="correlations">Module Correlations</TabsTrigger>
          <TabsTrigger value="recommendations">Strategic Recommendations</TabsTrigger>
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

        <TabsContent value="recommendations" className="mt-6">
          {renderRecommendationsTab()}
        </TabsContent>
      </Tabs>
    </div>
  );
}