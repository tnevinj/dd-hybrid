'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Crown, TrendingUp, TrendingDown, Users, Building2, DollarSign,
  Target, Shield, Activity, Brain, Zap, Globe, AlertTriangle,
  CheckCircle, Clock, BarChart3, PieChart, LineChart, Settings,
  ArrowUpRight, ArrowDownRight, Eye, Lightbulb, Award, Star,
  Gauge, ChevronRight, Info, Bell, Calendar, FileText
} from 'lucide-react';

import { 
  LineChart as RechartsLineChart, Line, AreaChart, Area, BarChart, Bar, 
  PieChart as RechartsPieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, ComposedChart
} from 'recharts';

import {
  IntelligentInsight, Priority, DataQualityIndicator, RiskLevel,
  UnifiedMetric, TrendDirection
} from '@/types/shared-intelligence';

import { dataSyncService } from '@/lib/data-sync-service';
import { formatCurrency, formatPercentage, formatDate } from '@/lib/utils';

// Executive Dashboard Interfaces
interface ExecutiveIntelligence {
  performanceOverview: PerformanceOverview;
  strategicKPIs: StrategicKPI[];
  riskDashboard: ExecutiveRiskDashboard;
  portfolioHealth: PortfolioHealthOverview;
  operationalEfficiency: OperationalEfficiencyOverview;
  marketPosition: MarketPositionAnalysis;
  growthMetrics: GrowthMetrics;
  predictiveInsights: PredictiveInsight[];
  competitiveIntelligence: CompetitiveIntelligence;
  stakeholderSentiment: StakeholderSentimentAnalysis;
}

interface PerformanceOverview {
  totalAUM: number;
  netIRR: number;
  totalMOIC: number;
  dpi: number;
  tvpi: number;
  portfolioCompanies: number;
  activeFunds: number;
  totalLPs: number;
  performanceTrend: TrendDirection;
  quarterlyGrowth: number;
  yearOverYearGrowth: number;
  benchmarkComparison: BenchmarkComparison;
}

interface StrategicKPI {
  id: string;
  name: string;
  category: 'FINANCIAL' | 'OPERATIONAL' | 'STRATEGIC' | 'ESG';
  currentValue: number;
  targetValue: number;
  previousValue: number;
  unit: string;
  trend: TrendDirection;
  performance: 'EXCEEDING' | 'ON_TRACK' | 'AT_RISK' | 'MISSING';
  importance: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  lastUpdated: Date;
  forecast: KPIForecast;
}

interface ExecutiveRiskDashboard {
  overallRiskScore: number; // 0-100
  riskTrend: TrendDirection;
  topRisks: TopRisk[];
  riskByCategory: RiskByCategory[];
  mitigation: RiskMitigationSummary[];
  earlyWarnings: EarlyWarning[];
  complianceStatus: ComplianceStatusSummary;
}

interface PortfolioHealthOverview {
  overallHealth: number; // 0-100
  healthTrend: TrendDirection;
  healthDistribution: HealthDistribution[];
  topPerformers: PortfolioCompanyPerformance[];
  underPerformers: PortfolioCompanyPerformance[];
  sectorHealth: SectorHealthMetrics[];
  esgScore: number;
  marketExposure: MarketExposureAnalysis;
}

interface OperationalEfficiencyOverview {
  overallEfficiency: number; // 0-100
  processMetrics: ProcessMetric[];
  resourceUtilization: ResourceUtilization[];
  costOptimization: CostOptimizationSummary;
  automationProgress: AutomationProgress;
  teamProductivity: TeamProductivityMetrics;
}

interface MarketPositionAnalysis {
  marketRank: number;
  marketShare: number;
  competitiveAdvantages: string[];
  marketOpportunities: MarketOpportunity[];
  industryTrends: IndustryTrend[];
  brandHealth: BrandHealthMetrics;
}

interface GrowthMetrics {
  revenueGrowth: GrowthTrendData;
  aumGrowth: GrowthTrendData;
  portfolioGrowth: GrowthTrendData;
  teamGrowth: GrowthTrendData;
  marketExpansion: MarketExpansionMetrics;
  growthOpportunities: GrowthOpportunity[];
}

interface PredictiveInsight {
  id: string;
  type: 'PERFORMANCE' | 'RISK' | 'OPPORTUNITY' | 'MARKET';
  title: string;
  description: string;
  prediction: string;
  confidence: number; // 0-1
  impact: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  timeHorizon: string;
  actionRecommended: boolean;
  relatedKPIs: string[];
}

interface CompetitiveIntelligence {
  competitorAnalysis: CompetitorProfile[];
  marketPosition: string;
  competitiveAdvantages: CompetitiveAdvantage[];
  threats: CompetitiveThreat[];
  opportunities: CompetitiveOpportunity[];
  benchmarkMetrics: CompetitiveBenchmark[];
}

interface StakeholderSentimentAnalysis {
  overall: 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE';
  lpSentiment: SentimentMetric;
  portfolioCompanySentiment: SentimentMetric;
  teamSentiment: SentimentMetric;
  marketSentiment: SentimentMetric;
  sentimentTrends: SentimentTrend[];
  keyFeedback: StakeholderFeedback[];
}

// Supporting interfaces
interface BenchmarkComparison {
  vsIndustry: number;
  vsVintage: number;
  vsPeers: number;
  industryPercentile: number;
}

interface KPIForecast {
  nextQuarter: number;
  nextYear: number;
  confidence: number;
  scenario: 'OPTIMISTIC' | 'BASE' | 'PESSIMISTIC';
}

interface TopRisk {
  risk: string;
  category: string;
  severity: RiskLevel;
  probability: number;
  impact: number;
  mitigationStatus: 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED';
  owner: string;
}

interface RiskByCategory {
  category: string;
  riskScore: number;
  count: number;
  trend: TrendDirection;
}

interface RiskMitigationSummary {
  category: string;
  activeInitiatives: number;
  effectiveness: number; // 0-1
  resourcesAllocated: number;
}

interface EarlyWarning {
  signal: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  detected: Date;
  category: string;
  actionRequired: string;
}

interface ComplianceStatusSummary {
  overallCompliance: number; // 0-1
  frameworks: ComplianceFrameworkStatus[];
  pendingItems: number;
  overdueItems: number;
  auditReadiness: number; // 0-1
}

interface ComplianceFrameworkStatus {
  framework: string;
  status: 'COMPLIANT' | 'NON_COMPLIANT' | 'PENDING';
  score: number; // 0-1
  lastAudit: Date;
}

interface HealthDistribution {
  range: string;
  count: number;
  value: number;
}

interface PortfolioCompanyPerformance {
  name: string;
  sector: string;
  healthScore: number;
  irr: number;
  moic: number;
  trend: TrendDirection;
}

interface SectorHealthMetrics {
  sector: string;
  averageHealth: number;
  companies: number;
  totalValue: number;
  trend: TrendDirection;
}

interface MarketExposureAnalysis {
  concentrationRisk: number;
  diversificationScore: number;
  geographicExposure: ExposureMetric[];
  sectorExposure: ExposureMetric[];
}

interface ExposureMetric {
  category: string;
  percentage: number;
  value: number;
  risk: RiskLevel;
}

interface ProcessMetric {
  process: string;
  efficiency: number; // 0-1
  duration: number;
  cost: number;
  trend: TrendDirection;
}

interface ResourceUtilization {
  resource: string;
  utilization: number; // 0-1
  capacity: number;
  optimization: number; // potential improvement
}

interface CostOptimizationSummary {
  totalPotentialSavings: number;
  identifiedOpportunities: number;
  implementedSavings: number;
  topOpportunities: CostOpportunity[];
}

interface CostOpportunity {
  area: string;
  potentialSaving: number;
  effort: 'LOW' | 'MEDIUM' | 'HIGH';
  timeframe: string;
}

interface AutomationProgress {
  processesAutomated: number;
  totalProcesses: number;
  timeSaved: number; // hours per month
  costSaved: number; // dollars per year
  nextAutomation: string[];
}

interface TeamProductivityMetrics {
  overallProductivity: number; // 0-1
  utilizationRate: number; // 0-1
  satisfactionScore: number; // 0-1
  turnoverRate: number; // 0-1
  skillGaps: string[];
}

interface MarketOpportunity {
  opportunity: string;
  size: number;
  timeframe: string;
  probability: number; // 0-1
  requirements: string[];
}

interface IndustryTrend {
  trend: string;
  direction: TrendDirection;
  impact: 'LOW' | 'MEDIUM' | 'HIGH';
  timeHorizon: string;
  relevance: number; // 0-1
}

interface BrandHealthMetrics {
  brandAwareness: number; // 0-1
  reputation: number; // 0-1
  marketPerception: string;
  digitalPresence: number; // 0-1
}

interface GrowthTrendData {
  current: number;
  target: number;
  growth: number; // percentage
  trend: TrendDirection;
  forecast: number[];
}

interface MarketExpansionMetrics {
  newMarkets: number;
  marketPenetration: number; // 0-1
  expansionROI: number;
  geographicReach: string[];
}

interface GrowthOpportunity {
  opportunity: string;
  category: 'MARKET' | 'PRODUCT' | 'GEOGRAPHIC' | 'STRATEGIC';
  potentialRevenue: number;
  investment: number;
  timeframe: string;
  probability: number; // 0-1
}

interface CompetitorProfile {
  name: string;
  marketShare: number;
  aum: number;
  strengths: string[];
  weaknesses: string[];
  recentActivity: string[];
}

interface CompetitiveAdvantage {
  advantage: string;
  strength: 'WEAK' | 'MODERATE' | 'STRONG' | 'DOMINANT';
  sustainability: 'LOW' | 'MEDIUM' | 'HIGH';
  impact: 'LOW' | 'MEDIUM' | 'HIGH';
}

interface CompetitiveThreat {
  threat: string;
  source: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  probability: number; // 0-1
  mitigation: string;
}

interface CompetitiveOpportunity {
  opportunity: string;
  competitor: string;
  potential: number;
  timeframe: string;
  requirements: string[];
}

interface CompetitiveBenchmark {
  metric: string;
  ourValue: number;
  industryAverage: number;
  bestInClass: number;
  percentile: number;
}

interface SentimentMetric {
  score: number; // -1 to 1
  trend: TrendDirection;
  keyFactors: string[];
  recentChange: number;
}

interface SentimentTrend {
  stakeholder: string;
  historicalData: SentimentDataPoint[];
  forecast: SentimentDataPoint[];
}

interface SentimentDataPoint {
  date: Date;
  score: number;
  events: string[];
}

interface StakeholderFeedback {
  stakeholder: string;
  feedback: string;
  sentiment: 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE';
  category: string;
  actionRequired: boolean;
}

interface ExecutiveDashboardProps {
  navigationMode?: 'traditional' | 'assisted' | 'autonomous';
  onModeChange?: (mode: 'traditional' | 'assisted' | 'autonomous') => void;
}

export function ExecutiveDashboard({ 
  navigationMode = 'traditional', 
  onModeChange 
}: ExecutiveDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [timeframe, setTimeframe] = useState<'1M' | '3M' | '6M' | '1Y' | 'YTD'>('YTD');
  const [loading, setLoading] = useState(true);
  const [executiveIntelligence, setExecutiveIntelligence] = useState<ExecutiveIntelligence | null>(null);
  const [insights, setInsights] = useState<IntelligentInsight[]>([]);
  const [dataQuality, setDataQuality] = useState<DataQualityIndicator | null>(null);

  useEffect(() => {
    loadExecutiveData();
    initializeDataSync();
  }, [timeframe]);

  const initializeDataSync = () => {
    dataSyncService.subscribe({
      id: 'executive-dashboard',
      subscriberModule: 'AdminManagement',
      entityTypes: ['FUND', 'PORTFOLIO_COMPANY', 'LP_ORGANIZATION'],
      eventTypes: ['UPDATE', 'CREATE'],
      callback: handleDataUpdate
    });
  };

  const handleDataUpdate = async (event: any) => {
    await loadExecutiveData();
  };

  const loadExecutiveData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin-management/executive?timeframe=${timeframe}&mode=${navigationMode}`);
      const result = await response.json();
      
      if (result.success && result.data) {
        setExecutiveIntelligence(result.data.intelligence);
        setInsights(result.data.insights || []);
        setDataQuality(result.data.dataQuality);
      }
    } catch (error) {
      console.error('Failed to load executive data:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderPerformanceOverview = () => {
    if (!executiveIntelligence) return null;

    const performance = executiveIntelligence.performanceOverview;
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total AUM</p>
                <p className="text-3xl font-bold text-gray-900">
                  {formatCurrency(performance.totalAUM)}
                </p>
                <div className="flex items-center mt-2">
                  {performance.performanceTrend === TrendDirection.STRONGLY_RISING ? (
                    <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4 text-red-500 mr-1" />
                  )}
                  <span className={`text-sm ${performance.performanceTrend === TrendDirection.STRONGLY_RISING ? 'text-green-600' : 'text-red-600'}`}>
                    {formatPercentage(performance.quarterlyGrowth)} QoQ
                  </span>
                </div>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Crown className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Net IRR</p>
                <p className="text-3xl font-bold text-gray-900">
                  {formatPercentage(performance.netIRR)}
                </p>
                <div className="flex items-center mt-2">
                  <Badge variant="outline" className="text-xs">
                    Top {performance.benchmarkComparison.industryPercentile}%
                  </Badge>
                </div>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Portfolio Companies</p>
                <p className="text-3xl font-bold text-gray-900">
                  {performance.portfolioCompanies}
                </p>
                <div className="flex items-center mt-2">
                  <span className="text-sm text-gray-600">
                    {performance.activeFunds} active funds
                  </span>
                </div>
              </div>
              <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Building2 className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total MOIC</p>
                <p className="text-3xl font-bold text-gray-900">
                  {performance.totalMOIC.toFixed(2)}x
                </p>
                <div className="flex items-center mt-2">
                  <span className="text-sm text-gray-600">
                    DPI: {performance.dpi.toFixed(2)}x
                  </span>
                </div>
              </div>
              <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Target className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderStrategicKPIs = () => {
    if (!executiveIntelligence) return null;

    const kpis = executiveIntelligence.strategicKPIs;
    
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gauge className="h-5 w-5" />
            Strategic KPIs
            <Badge variant="outline">{kpis.length} tracked</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {kpis.slice(0, 6).map((kpi) => (
              <div key={kpi.id} className="p-4 border rounded-lg">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-sm">{kpi.name}</h4>
                    <Badge variant="outline" className="text-xs mt-1">
                      {kpi.category}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={
                      kpi.performance === 'EXCEEDING' ? 'default' :
                      kpi.performance === 'ON_TRACK' ? 'secondary' :
                      'destructive'
                    } className="text-xs">
                      {kpi.performance}
                    </Badge>
                    <Badge variant={kpi.importance === 'CRITICAL' ? 'destructive' : 'outline'} className="text-xs">
                      {kpi.importance}
                    </Badge>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Current:</span>
                    <span className="font-semibold">{kpi.currentValue}{kpi.unit}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Target:</span>
                    <span className="font-semibold">{kpi.targetValue}{kpi.unit}</span>
                  </div>
                  <Progress 
                    value={(kpi.currentValue / kpi.targetValue) * 100} 
                    className="h-2"
                  />
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>Previous: {kpi.previousValue}{kpi.unit}</span>
                    <span className="flex items-center gap-1">
                      {kpi.trend === TrendDirection.STRONGLY_RISING && <TrendingUp className="h-3 w-3 text-green-500" />}
                      {kpi.trend === TrendDirection.STRONGLY_DECLINING && <TrendingDown className="h-3 w-3 text-red-500" />}
                      {kpi.trend}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderRiskDashboard = () => {
    if (!executiveIntelligence) return null;

    const risk = executiveIntelligence.riskDashboard;
    
    const riskCategoryData = risk.riskByCategory.map(cat => ({
      category: cat.category,
      score: cat.riskScore,
      count: cat.count
    }));

    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Executive Risk Dashboard
            <Badge variant={
              risk.overallRiskScore < 30 ? 'default' :
              risk.overallRiskScore < 60 ? 'secondary' :
              'destructive'
            }>
              {risk.overallRiskScore}/100
            </Badge>
            <Badge variant="outline" className="text-xs">
              {risk.riskTrend === TrendDirection.DECLINING && <TrendingDown className="h-3 w-3 mr-1 text-green-600" />}
              {risk.riskTrend === TrendDirection.RISING && <TrendingUp className="h-3 w-3 mr-1 text-red-600" />}
              {risk.riskTrend}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Risk by Category Chart */}
            <div>
              <h4 className="font-semibold mb-3">Risk by Category</h4>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={riskCategoryData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="score" fill="#ef4444" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Top Risks and Early Warnings */}
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold mb-3">Top Risks</h4>
                <div className="space-y-2">
                  {risk.topRisks.slice(0, 3).map((topRisk, index) => (
                    <div key={index} className="p-3 border rounded-lg bg-red-50 border-red-200">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-medium text-sm text-red-800">{topRisk.risk}</h5>
                        <Badge variant="destructive" className="text-xs">
                          {topRisk.severity}
                        </Badge>
                      </div>
                      <div className="text-xs text-red-700">
                        <p>Category: {topRisk.category}</p>
                        <p>Probability: {Math.round(topRisk.probability * 100)}%</p>
                        <p>Owner: {topRisk.owner}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Early Warnings</h4>
                <div className="space-y-2">
                  {risk.earlyWarnings.slice(0, 3).map((warning, index) => (
                    <Alert key={index} className={
                      warning.severity === 'CRITICAL' ? 'border-red-200 bg-red-50' :
                      warning.severity === 'HIGH' ? 'border-orange-200 bg-orange-50' :
                      'border-yellow-200 bg-yellow-50'
                    }>
                      <Bell className="h-4 w-4" />
                      <AlertTitle className="text-sm">{warning.signal}</AlertTitle>
                      <AlertDescription className="text-xs">
                        <p>{warning.category} • {formatDate(warning.detected.toString())}</p>
                        <p className="mt-1"><strong>Action:</strong> {warning.actionRequired}</p>
                      </AlertDescription>
                    </Alert>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderPredictiveInsights = () => {
    if (!executiveIntelligence || navigationMode === 'traditional') return null;

    const predictions = executiveIntelligence.predictiveInsights;
    
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Predictive Insights
            <Badge variant="outline" className="flex items-center gap-1">
              <Zap className="h-3 w-3" />
              AI-Powered
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {predictions.map((insight) => (
              <div key={insight.id} className="p-4 border rounded-lg">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-sm">{insight.title}</h4>
                    <Badge variant="outline" className="text-xs mt-1">
                      {insight.type}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={
                      insight.impact === 'CRITICAL' ? 'destructive' :
                      insight.impact === 'HIGH' ? 'secondary' :
                      'outline'
                    } className="text-xs">
                      {insight.impact}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {Math.round(insight.confidence * 100)}%
                    </Badge>
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 mb-2">{insight.description}</p>
                <div className="p-2 bg-blue-50 rounded text-xs text-blue-800 mb-3">
                  <strong>Prediction:</strong> {insight.prediction}
                </div>
                
                <div className="flex items-center justify-between text-xs text-gray-600">
                  <span>Horizon: {insight.timeHorizon}</span>
                  {insight.actionRecommended && (
                    <Badge variant="outline" className="text-xs">
                      <Lightbulb className="h-3 w-3 mr-1" />
                      Action Needed
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderPortfolioHealth = () => {
    if (!executiveIntelligence) return null;

    const health = executiveIntelligence.portfolioHealth;
    
    const healthData = health.healthDistribution.map(dist => ({
      range: dist.range,
      count: dist.count,
      value: dist.value
    }));

    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Portfolio Health Overview
            <Badge variant={
              health.overallHealth >= 80 ? 'default' :
              health.overallHealth >= 60 ? 'secondary' :
              'destructive'
            }>
              {health.overallHealth}/100
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Health Distribution */}
            <div>
              <h4 className="font-semibold mb-3">Health Distribution</h4>
              <ResponsiveContainer width="100%" height={200}>
                <RechartsPieChart>
                  <Pie
                    data={healthData}
                    dataKey="count"
                    nameKey="range"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                  >
                    {healthData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={`hsl(${120 - index * 30}, 70%, 50%)`} />
                    ))}
                  </Pie>
                  <Tooltip />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>

            {/* Top/Bottom Performers */}
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Star className="h-4 w-4 text-yellow-500" />
                  Top Performers
                </h4>
                <div className="space-y-2">
                  {health.topPerformers.slice(0, 3).map((company, index) => (
                    <div key={index} className="p-2 border rounded bg-green-50">
                      <div className="flex justify-between items-center">
                        <div>
                          <h5 className="font-medium text-sm text-green-800">{company.name}</h5>
                          <p className="text-xs text-green-600">{company.sector}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-green-800">
                            {formatPercentage(company.irr)} IRR
                          </p>
                          <p className="text-xs text-green-600">{company.moic.toFixed(2)}x MOIC</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                  Underperformers
                </h4>
                <div className="space-y-2">
                  {health.underPerformers.slice(0, 3).map((company, index) => (
                    <div key={index} className="p-2 border rounded bg-red-50">
                      <div className="flex justify-between items-center">
                        <div>
                          <h5 className="font-medium text-sm text-red-800">{company.name}</h5>
                          <p className="text-xs text-red-600">{company.sector}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-red-800">
                            {formatPercentage(company.irr)} IRR
                          </p>
                          <p className="text-xs text-red-600">{company.moic.toFixed(2)}x MOIC</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderMarketPosition = () => {
    if (!executiveIntelligence) return null;

    const market = executiveIntelligence.marketPosition;
    
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Market Position Analysis
            <Badge variant="outline">Rank #{market.marketRank}</Badge>
            <Badge variant="outline">{formatPercentage(market.marketShare)} Share</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Competitive Advantages */}
            <div>
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <Award className="h-4 w-4 text-blue-500" />
                Competitive Advantages
              </h4>
              <div className="space-y-2">
                {market.competitiveAdvantages.map((advantage, index) => (
                  <div key={index} className="p-2 border rounded bg-blue-50">
                    <p className="text-sm text-blue-800">{advantage}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Market Opportunities */}
            <div>
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <Target className="h-4 w-4 text-green-500" />
                Market Opportunities
              </h4>
              <div className="space-y-2">
                {market.marketOpportunities.slice(0, 4).map((opportunity, index) => (
                  <div key={index} className="p-2 border rounded">
                    <h5 className="font-medium text-sm">{opportunity.opportunity}</h5>
                    <div className="flex justify-between text-xs text-gray-600 mt-1">
                      <span>Size: {formatCurrency(opportunity.size)}</span>
                      <span>{Math.round(opportunity.probability * 100)}% prob</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Industry Trends */}
            <div>
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-purple-500" />
                Industry Trends
              </h4>
              <div className="space-y-2">
                {market.industryTrends.map((trend, index) => (
                  <div key={index} className="p-2 border rounded">
                    <div className="flex justify-between items-center mb-1">
                      <h5 className="font-medium text-sm">{trend.trend}</h5>
                      <Badge variant={
                        trend.direction === TrendDirection.STRONGLY_RISING ? 'default' :
                        trend.direction === TrendDirection.STRONGLY_DECLINING ? 'destructive' :
                        'secondary'
                      } className="text-xs">
                        {trend.impact}
                      </Badge>
                    </div>
                    <div className="flex justify-between text-xs text-gray-600">
                      <span>Relevance: {Math.round(trend.relevance * 100)}%</span>
                      <span>{trend.timeHorizon}</span>
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Executive Dashboard</h1>
          <p className="text-gray-600">
            Strategic insights and performance analytics for executive decision-making
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Timeframe Selector */}
          <Select value={timeframe} onValueChange={(value: any) => setTimeframe(value)}>
            <SelectTrigger className="w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1M">1M</SelectItem>
              <SelectItem value="3M">3M</SelectItem>
              <SelectItem value="6M">6M</SelectItem>
              <SelectItem value="1Y">1Y</SelectItem>
              <SelectItem value="YTD">YTD</SelectItem>
            </SelectContent>
          </Select>

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
        </div>
      </div>

      {/* Performance Overview */}
      {renderPerformanceOverview()}

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="kpis">Strategic KPIs</TabsTrigger>
          <TabsTrigger value="risk">Risk</TabsTrigger>
          <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
          <TabsTrigger value="market">Market</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {renderStrategicKPIs()}
          {renderRiskDashboard()}
          {renderPredictiveInsights()}
        </TabsContent>

        <TabsContent value="kpis" className="space-y-6">
          {renderStrategicKPIs()}
        </TabsContent>

        <TabsContent value="risk" className="space-y-6">
          {renderRiskDashboard()}
        </TabsContent>

        <TabsContent value="portfolio" className="space-y-6">
          {renderPortfolioHealth()}
        </TabsContent>

        <TabsContent value="market" className="space-y-6">
          {renderMarketPosition()}
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          {renderPredictiveInsights()}
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Mock data for development - would be replaced with real API data
const mockExecutiveIntelligence: ExecutiveIntelligence = {
  performanceOverview: {
    totalAUM: 2500000000,
    netIRR: 0.24,
    totalMOIC: 2.8,
    dpi: 1.4,
    tvpi: 2.8,
    portfolioCompanies: 45,
    activeFunds: 4,
    totalLPs: 125,
    performanceTrend: TrendDirection.STRONGLY_RISING,
    quarterlyGrowth: 0.08,
    yearOverYearGrowth: 0.15,
    benchmarkComparison: {
      vsIndustry: 1.12,
      vsVintage: 1.08,
      vsPeers: 1.15,
      industryPercentile: 85
    }
  },
  strategicKPIs: [],
  riskDashboard: {
    overallRiskScore: 35,
    riskTrend: TrendDirection.DECLINING,
    topRisks: [],
    riskByCategory: [],
    mitigation: [],
    earlyWarnings: [],
    complianceStatus: {
      overallCompliance: 0.95,
      frameworks: [],
      pendingItems: 3,
      overdueItems: 1,
      auditReadiness: 0.88
    }
  },
  portfolioHealth: {
    overallHealth: 82,
    healthTrend: TrendDirection.RISING,
    healthDistribution: [],
    topPerformers: [],
    underPerformers: [],
    sectorHealth: [],
    esgScore: 78,
    marketExposure: {
      concentrationRisk: 0.25,
      diversificationScore: 0.82,
      geographicExposure: [],
      sectorExposure: []
    }
  },
  operationalEfficiency: {
    overallEfficiency: 87,
    processMetrics: [],
    resourceUtilization: [],
    costOptimization: {
      totalPotentialSavings: 2500000,
      identifiedOpportunities: 12,
      implementedSavings: 850000,
      topOpportunities: []
    },
    automationProgress: {
      processesAutomated: 15,
      totalProcesses: 25,
      timeSaved: 240,
      costSaved: 1200000,
      nextAutomation: []
    },
    teamProductivity: {
      overallProductivity: 0.89,
      utilizationRate: 0.85,
      satisfactionScore: 0.78,
      turnoverRate: 0.12,
      skillGaps: []
    }
  },
  marketPosition: {
    marketRank: 8,
    marketShare: 0.045,
    competitiveAdvantages: [
      "Strong ESG integration",
      "Sector expertise in technology",
      "Established LP relationships",
      "Proven operational value creation"
    ],
    marketOpportunities: [],
    industryTrends: [],
    brandHealth: {
      brandAwareness: 0.72,
      reputation: 0.85,
      marketPerception: "Strong performer with growth potential",
      digitalPresence: 0.68
    }
  },
  growthMetrics: {
    revenueGrowth: {
      current: 125000000,
      target: 150000000,
      growth: 0.15,
      trend: TrendDirection.RISING,
      forecast: []
    },
    aumGrowth: {
      current: 2500000000,
      target: 3200000000,
      growth: 0.18,
      trend: TrendDirection.STRONGLY_RISING,
      forecast: []
    },
    portfolioGrowth: {
      current: 45,
      target: 55,
      growth: 0.12,
      trend: TrendDirection.RISING,
      forecast: []
    },
    teamGrowth: {
      current: 85,
      target: 105,
      growth: 0.08,
      trend: TrendDirection.STABLE,
      forecast: []
    },
    marketExpansion: {
      newMarkets: 2,
      marketPenetration: 0.68,
      expansionROI: 2.4,
      geographicReach: ["North America", "Europe", "Asia-Pacific"]
    },
    growthOpportunities: []
  },
  predictiveInsights: [],
  competitiveIntelligence: {
    competitorAnalysis: [],
    marketPosition: "Strong growth-stage player",
    competitiveAdvantages: [],
    threats: [],
    opportunities: [],
    benchmarkMetrics: []
  },
  stakeholderSentiment: {
    overall: 'POSITIVE',
    lpSentiment: {
      score: 0.8,
      trend: TrendDirection.RISING,
      keyFactors: ["Strong performance", "Good communication", "ESG leadership"],
      recentChange: 0.05
    },
    portfolioCompanySentiment: {
      score: 0.75,
      trend: TrendDirection.STABLE,
      keyFactors: ["Value creation support", "Strategic guidance", "Operational expertise"],
      recentChange: 0.02
    },
    teamSentiment: {
      score: 0.78,
      trend: TrendDirection.RISING,
      keyFactors: ["Career growth", "Work-life balance", "Compensation"],
      recentChange: 0.08
    },
    marketSentiment: {
      score: 0.72,
      trend: TrendDirection.STABLE,
      keyFactors: ["Industry reputation", "Deal flow", "Market presence"],
      recentChange: 0.01
    },
    sentimentTrends: [],
    keyFeedback: []
  }
};