'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  DollarSign, TrendingUp, TrendingDown, Users, Calendar, AlertTriangle, 
  CheckCircle, Clock, BarChart3, PieChart, FileText, CreditCard, 
  Banknote, Calculator, ArrowUpRight, ArrowDownRight, Filter, Search, 
  Download, RefreshCw, Plus, Edit, Eye, Send, Brain, Target, Activity,
  Zap, Shield, Lightbulb, Bell, Settings, LineChart, Gauge
} from 'lucide-react';

import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

import type { 
  Fund, FundCommitment, FundCapitalCall, FundDistribution, FundExpense, 
  NAVReport, FundStatus
} from '@/types/fund-operations';

import {
  DataQualityIndicator, DataFreshness, IntelligentInsight, 
  UnifiedMetric, RiskLevel, Priority, TrendDirection
} from '@/types/shared-intelligence';

import { dataSyncService } from '@/lib/data-sync-service';
import { formatCurrency, formatPercentage, formatDate } from '@/lib/utils';

// Enhanced interfaces for predictive analytics
interface FundPredictiveInsights {
  cashFlowForecast: CashFlowForecast;
  capitalCallOptimization: CapitalCallOptimization;
  riskAssessment: FundRiskAssessment;
  performancePrediction: PerformancePrediction;
  operationalEfficiency: OperationalEfficiency;
  complianceAlerts: ComplianceAlert[];
}

interface CashFlowForecast {
  nextCapitalCall: {
    recommendedAmount: number;
    optimalTiming: Date;
    confidenceLevel: number;
    rationale: string;
  };
  distributionPipeline: {
    expectedAmount: number;
    timeframe: string;
    sourceDeal: string;
    probability: number;
  }[];
  cashPosition: {
    current: number;
    projected30Days: number;
    projected90Days: number;
    projected180Days: number;
  };
}

interface CapitalCallOptimization {
  currentCallEfficiency: number;
  marketTimingScore: number;
  lpFatigueIndex: number;
  recommendedCallSize: number;
  optimalFrequency: string;
  seasonalFactors: string[];
}

interface FundRiskAssessment {
  overallRisk: RiskLevel;
  concentrationRisk: number;
  liquidityRisk: number;
  operationalRisk: number;
  marketRisk: number;
  keyRiskFactors: string[];
  mitigation: string[];
}

interface PerformancePrediction {
  projectedNetIRR: {
    pessimistic: number;
    expected: number;
    optimistic: number;
  };
  projectedMOIC: {
    pessimistic: number;
    expected: number;
    optimistic: number;
  };
  benchmarkComparison: {
    vsVintage: number;
    vsPeers: number;
    vsIndex: number;
  };
  confidenceInterval: number;
}

interface OperationalEfficiency {
  score: number;
  expenseRatio: number;
  processingTime: {
    capitalCalls: number;
    distributions: number;
    navReports: number;
  };
  automationOpportunities: AutomationOpportunity[];
  costOptimization: CostOptimization[];
}

interface AutomationOpportunity {
  process: string;
  timeSaving: number; // hours per month
  costSaving: number; // dollars per year
  effort: 'LOW' | 'MEDIUM' | 'HIGH';
  priority: Priority;
}

interface CostOptimization {
  category: string;
  currentCost: number;
  potentialSaving: number;
  recommendation: string;
  timeframe: string;
}

interface ComplianceAlert {
  id: string;
  type: 'REGULATORY' | 'CONTRACTUAL' | 'INTERNAL';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  message: string;
  deadline?: Date;
  actionRequired: string;
  relatedEntity: string;
}

interface EnhancedFundOperationsDashboardProps {
  navigationMode?: 'traditional' | 'assisted' | 'autonomous';
  onModeChange?: (mode: 'traditional' | 'assisted' | 'autonomous') => void;
}

export function EnhancedFundOperationsDashboard({ 
  navigationMode = 'traditional', 
  onModeChange 
}: EnhancedFundOperationsDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedFund, setSelectedFund] = useState<string>('');
  const [funds, setFunds] = useState<Fund[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [dataQuality, setDataQuality] = useState<DataQualityIndicator | null>(null);
  const [insights, setInsights] = useState<IntelligentInsight[]>([]);
  const [predictiveInsights, setPredictiveInsights] = useState<FundPredictiveInsights | null>(null);
  const [metrics, setMetrics] = useState<UnifiedMetric[]>([]);

  useEffect(() => {
    loadFundOperationsData();
    initializeDataSync();
  }, []);

  const initializeDataSync = () => {
    // Subscribe to real-time updates
    dataSyncService.subscribe({
      id: 'fund-operations-dashboard',
      subscriberModule: 'FundOperations',
      entityTypes: ['FUND', 'INVESTMENT'],
      eventTypes: ['UPDATE', 'CREATE'],
      callback: handleDataUpdate
    });
  };

  const handleDataUpdate = async (event: any) => {
    // Handle real-time data updates
    if (event.entityType === 'FUND' && event.entityId === selectedFund) {
      await loadFundOperationsData();
      await loadPredictiveInsights();
    }
  };

  const loadFundOperationsData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/fund-operations?type=enhanced&mode=' + navigationMode);
      const result = await response.json();
      
      if (result.success && result.data) {
        setFunds(result.data.funds);
        setDataQuality(result.data.dataQuality);
        setMetrics(result.data.metrics || []);
        
        if (result.data.funds.length > 0 && !selectedFund) {
          setSelectedFund(result.data.funds[0].id);
        }
        
        // Load AI insights for assisted and autonomous modes
        if (navigationMode !== 'traditional') {
          setInsights(result.data.insights || []);
        }
      }
    } catch (error) {
      console.error('Failed to load fund operations data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadPredictiveInsights = async () => {
    if (!selectedFund) return;
    
    try {
      const response = await fetch(`/api/fund-operations/${selectedFund}/predictive-insights`);
      const result = await response.json();
      
      if (result.success) {
        setPredictiveInsights(result.data);
      }
    } catch (error) {
      console.error('Failed to load predictive insights:', error);
    }
  };

  useEffect(() => {
    if (selectedFund) {
      loadPredictiveInsights();
    }
  }, [selectedFund]);

  const currentFund = funds.find(f => f.id === selectedFund);

  const renderDataQualityIndicator = () => {
    if (!dataQuality) return null;

    const getFreshnessColor = (freshness: DataFreshness) => {
      switch (freshness) {
        case DataFreshness.REAL_TIME: return 'text-green-600';
        case DataFreshness.MINUTES: return 'text-green-500';
        case DataFreshness.HOURS: return 'text-yellow-500';
        case DataFreshness.DAYS: return 'text-orange-500';
        case DataFreshness.STALE: return 'text-red-500';
        default: return 'text-gray-500';
      }
    };

    return (
      <div className="mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm font-medium">Data Quality</p>
                  <div className="flex items-center gap-4 text-sm">
                    <span className={getFreshnessColor(dataQuality.freshness)}>
                      {dataQuality.freshness.replace('_', ' ')}
                    </span>
                    <span>Accuracy: {(dataQuality.accuracy * 100).toFixed(1)}%</span>
                    <span>Completeness: {(dataQuality.completeness * 100).toFixed(1)}%</span>
                  </div>
                </div>
              </div>
              <Badge variant={dataQuality.validationStatus === 'VALIDATED' ? 'default' : 'destructive'}>
                {dataQuality.validationStatus}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderEnhancedKPIs = () => {
    const aggregateMetrics = calculateAggregateMetrics();
    if (!aggregateMetrics) return null;

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        {/* Total Commitments with Trend */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Commitments</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(aggregateMetrics.totalCommitments)}
                </p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              {navigationMode !== 'traditional' && (
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-green-600">+12% vs target</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Capital Called with Efficiency Score */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Capital Called</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(aggregateMetrics.totalCalled)}
                </p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CreditCard className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-sm text-gray-600">
                {formatPercentage(aggregateMetrics.totalCalled / aggregateMetrics.totalCommitments * 100)} called
              </span>
              {navigationMode !== 'traditional' && predictiveInsights && (
                <Badge variant="outline" className="text-xs">
                  Efficiency: {predictiveInsights.capitalCallOptimization.currentCallEfficiency}%
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Current NAV with Performance Prediction */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Current NAV</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(aggregateMetrics.totalNAV)}
                </p>
              </div>
              <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Calculator className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              {aggregateMetrics.avgNetIRR > 0 ? (
                <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
              ) : (
                <ArrowDownRight className="h-4 w-4 text-red-500 mr-1" />
              )}
              <span className={`text-sm ${aggregateMetrics.avgNetIRR > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatPercentage(aggregateMetrics.avgNetIRR)} Net IRR
              </span>
              {navigationMode !== 'traditional' && predictiveInsights && (
                <span className="ml-2 text-xs text-blue-600">
                  Proj: {formatPercentage(predictiveInsights.performancePrediction.projectedNetIRR.expected)}
                </span>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Distributed with Pipeline */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Distributed</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(aggregateMetrics.totalDistributed)}
                </p>
              </div>
              <div className="h-12 w-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                <Banknote className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-sm text-gray-600">
                {aggregateMetrics.avgDPI.toFixed(2)}x DPI
              </span>
              {navigationMode !== 'traditional' && predictiveInsights && (
                <span className="text-xs text-blue-600">
                  Pipeline: {formatCurrency(predictiveInsights.cashFlowForecast.distributionPipeline.reduce((sum, d) => sum + d.expectedAmount, 0))}
                </span>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Active Funds with Risk Score */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Funds</p>
                <p className="text-2xl font-bold text-gray-900">
                  {aggregateMetrics.activeFunds}
                </p>
              </div>
              <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-orange-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-sm text-gray-600">
                {aggregateMetrics.avgNetMOIC.toFixed(2)}x MOIC
              </span>
              {navigationMode !== 'traditional' && predictiveInsights && (
                <Badge variant={
                  predictiveInsights.riskAssessment.overallRisk === RiskLevel.LOW ? 'default' :
                  predictiveInsights.riskAssessment.overallRisk === RiskLevel.MEDIUM ? 'secondary' :
                  'destructive'
                }>
                  {predictiveInsights.riskAssessment.overallRisk}
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderCashFlowForecast = () => {
    if (!predictiveInsights || navigationMode === 'traditional') return null;

    const forecast = predictiveInsights.cashFlowForecast;
    
    // Generate sample forecast data
    const forecastData = [
      { month: 'Jan', called: 25, invested: 20, distributed: 15, cash: 35 },
      { month: 'Feb', called: 30, invested: 25, distributed: 12, cash: 38 },
      { month: 'Mar', called: 28, invested: 30, distributed: 8, cash: 28 },
      { month: 'Apr', called: 35, invested: 32, distributed: 25, cash: 36 },
      { month: 'May', called: 32, invested: 28, distributed: 18, cash: 42 },
      { month: 'Jun', called: 40, invested: 35, distributed: 30, cash: 47 }
    ];

    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LineChart className="h-5 w-5" />
            Cash Flow Forecast
            <Badge variant="outline">AI-Powered</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Forecast Chart */}
            <div className="lg:col-span-2">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={forecastData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="called" stroke="#8884d8" name="Capital Called" />
                  <Line type="monotone" dataKey="invested" stroke="#82ca9d" name="Invested" />
                  <Line type="monotone" dataKey="distributed" stroke="#ffc658" name="Distributed" />
                  <Line type="monotone" dataKey="cash" stroke="#ff7300" name="Cash Position" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Key Insights */}
            <div className="space-y-4">
              <div className="p-4 border rounded-lg bg-blue-50">
                <h4 className="font-semibold text-blue-800 flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Next Capital Call
                </h4>
                <p className="text-sm text-blue-700 mt-1">
                  {formatCurrency(forecast.nextCapitalCall.recommendedAmount)}
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  Optimal timing: {formatDate(forecast.nextCapitalCall.optimalTiming.toString())}
                </p>
                <p className="text-xs text-blue-600">
                  Confidence: {(forecast.nextCapitalCall.confidenceLevel * 100).toFixed(0)}%
                </p>
              </div>

              <div className="p-4 border rounded-lg bg-green-50">
                <h4 className="font-semibold text-green-800 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Distribution Pipeline
                </h4>
                {forecast.distributionPipeline.slice(0, 2).map((dist, index) => (
                  <div key={index} className="text-sm text-green-700 mt-1">
                    <div className="flex justify-between">
                      <span>{dist.sourceDeal}</span>
                      <span>{formatCurrency(dist.expectedAmount)}</span>
                    </div>
                    <p className="text-xs text-green-600">
                      {dist.timeframe} • {(dist.probability * 100).toFixed(0)}% probability
                    </p>
                  </div>
                ))}
              </div>

              <div className="p-4 border rounded-lg bg-gray-50">
                <h4 className="font-semibold text-gray-800">Cash Position</h4>
                <div className="space-y-2 mt-2 text-sm">
                  <div className="flex justify-between">
                    <span>Current:</span>
                    <span className="font-medium">{formatCurrency(forecast.cashPosition.current)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>30 Days:</span>
                    <span className="font-medium">{formatCurrency(forecast.cashPosition.projected30Days)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>90 Days:</span>
                    <span className="font-medium">{formatCurrency(forecast.cashPosition.projected90Days)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderRiskDashboard = () => {
    if (!predictiveInsights || navigationMode === 'traditional') return null;

    const risk = predictiveInsights.riskAssessment;

    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Risk Assessment
            <Badge variant={
              risk.overallRisk === RiskLevel.LOW ? 'default' :
              risk.overallRisk === RiskLevel.MEDIUM ? 'secondary' :
              'destructive'
            }>
              {risk.overallRisk}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-3">Risk Factors</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex justify-between">
                    <span className="text-sm">Concentration:</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{risk.concentrationRisk}/100</span>
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-red-600 h-2 rounded-full" 
                          style={{ width: `${risk.concentrationRisk}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-sm">Liquidity:</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{risk.liquidityRisk}/100</span>
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-yellow-600 h-2 rounded-full" 
                          style={{ width: `${risk.liquidityRisk}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-sm">Operational:</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{risk.operationalRisk}/100</span>
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-orange-600 h-2 rounded-full" 
                          style={{ width: `${risk.operationalRisk}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-sm">Market:</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{risk.marketRisk}/100</span>
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${risk.marketRisk}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Key Risk Factors</h4>
                <div className="space-y-2">
                  {risk.keyRiskFactors.map((factor, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <AlertTriangle className="h-4 w-4 text-orange-500 flex-shrink-0" />
                      <span>{factor}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Mitigation Strategies</h4>
              <div className="space-y-3">
                {risk.mitigation.map((strategy, index) => (
                  <div key={index} className="p-3 border rounded-lg bg-green-50">
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-green-800">{strategy}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderOperationalEfficiency = () => {
    if (!predictiveInsights || navigationMode === 'traditional') return null;

    const efficiency = predictiveInsights.operationalEfficiency;

    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gauge className="h-5 w-5" />
            Operational Efficiency
            <Badge variant="outline">{efficiency.score}/100</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3">Processing Times</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Capital Calls:</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{efficiency.processingTime.capitalCalls} days</span>
                    <Badge variant="outline" className="text-xs">-2 days vs avg</Badge>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Distributions:</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{efficiency.processingTime.distributions} days</span>
                    <Badge variant="outline" className="text-xs">-1 day vs avg</Badge>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">NAV Reports:</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{efficiency.processingTime.navReports} days</span>
                    <Badge variant="outline" className="text-xs">On target</Badge>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h4 className="font-semibold mb-3">Cost Analysis</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Expense Ratio:</span>
                    <span className="text-sm font-medium">{formatPercentage(efficiency.expenseRatio)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-3">Automation Opportunities</h4>
              <div className="space-y-3">
                {efficiency.automationOpportunities.slice(0, 3).map((opp, index) => (
                  <div key={index} className="p-3 border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h5 className="font-medium text-sm">{opp.process}</h5>
                      <Badge variant={opp.priority === Priority.HIGH ? 'destructive' : 'outline'}>
                        {opp.priority}
                      </Badge>
                    </div>
                    <div className="text-xs text-gray-600">
                      <p>Time saving: {opp.timeSaving} hrs/month</p>
                      <p>Cost saving: {formatCurrency(opp.costSaving)}/year</p>
                      <p>Effort: {opp.effort}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderComplianceAlerts = () => {
    if (!predictiveInsights || navigationMode === 'traditional') return null;

    const alerts = predictiveInsights.complianceAlerts;
    if (alerts.length === 0) return null;

    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Compliance Alerts
            <Badge variant="destructive">{alerts.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {alerts.map((alert) => (
              <Alert key={alert.id} className={
                alert.severity === 'CRITICAL' ? 'border-red-200 bg-red-50' :
                alert.severity === 'HIGH' ? 'border-orange-200 bg-orange-50' :
                'border-yellow-200 bg-yellow-50'
              }>
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle className="flex items-center justify-between">
                  {alert.type} Alert
                  <Badge variant={
                    alert.severity === 'CRITICAL' ? 'destructive' :
                    alert.severity === 'HIGH' ? 'destructive' :
                    'secondary'
                  }>
                    {alert.severity}
                  </Badge>
                </AlertTitle>
                <AlertDescription>
                  <p className="font-medium">{alert.message}</p>
                  <p className="text-sm mt-1">Related: {alert.relatedEntity}</p>
                  {alert.deadline && (
                    <p className="text-sm mt-1">Deadline: {formatDate(alert.deadline.toString())}</p>
                  )}
                  <p className="text-sm mt-2 font-medium">Action: {alert.actionRequired}</p>
                </AlertDescription>
              </Alert>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };

  const calculateAggregateMetrics = () => {
    if (funds.length === 0) return null;

    const totalCommitments = funds.reduce((sum, fund) => sum + fund.totalCommitments, 0);
    const totalCalled = funds.reduce((sum, fund) => sum + fund.totalCalled, 0);
    const totalInvested = funds.reduce((sum, fund) => sum + fund.totalInvested, 0);
    const totalNAV = funds.reduce((sum, fund) => sum + fund.currentNAV, 0);
    const totalDistributed = funds.reduce((sum, fund) => sum + fund.totalDistributed, 0);
    
    const avgNetIRR = funds.reduce((sum, fund) => sum + (fund.netIRR || 0), 0) / funds.length;
    const avgNetMOIC = funds.reduce((sum, fund) => sum + (fund.netMOIC || 0), 0) / funds.length;
    const avgDPI = funds.reduce((sum, fund) => sum + (fund.dpi || 0), 0) / funds.length;

    return {
      totalCommitments,
      totalCalled,
      totalInvested,
      totalNAV,
      totalDistributed,
      avgNetIRR,
      avgNetMOIC,
      avgDPI,
      activeFunds: funds.filter(f => f.status === FundStatus.INVESTING || f.status === FundStatus.HARVESTING).length,
      totalFunds: funds.length
    };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Enhanced Fund Operations</h1>
          <p className="text-gray-600">
            AI-powered capital management with predictive analytics and automated insights
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Navigation Mode Switcher */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            {(['traditional', 'assisted', 'autonomous'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => onModeChange?.(mode)}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  navigationMode === mode
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {mode.charAt(0).toUpperCase() + mode.slice(1)}
                {mode !== 'traditional' && <Brain className="ml-1 h-3 w-3 inline" />}
              </button>
            ))}
          </div>
          
          <Button onClick={loadFundOperationsData} size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Data Quality Indicator */}
      {renderDataQualityIndicator()}

      {/* Enhanced KPI Cards */}
      {renderEnhancedKPIs()}

      {/* Predictive Analytics Section */}
      {navigationMode !== 'traditional' && (
        <div className="space-y-6">
          {renderCashFlowForecast()}
          {renderRiskDashboard()}
          {renderOperationalEfficiency()}
          {renderComplianceAlerts()}
        </div>
      )}

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="capital-calls">Capital Calls</TabsTrigger>
          <TabsTrigger value="distributions">Distributions</TabsTrigger>
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
          <TabsTrigger value="nav">NAV Reports</TabsTrigger>
          <TabsTrigger value="commitments">Commitments</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Traditional overview content would go here */}
        </TabsContent>

        {/* Other tab contents would be enhanced versions of existing components */}
      </Tabs>
    </div>
  );
}