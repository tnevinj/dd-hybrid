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
  Scale, FileText, AlertTriangle, CheckCircle, Clock, Users,
  Shield, Brain, Gavel, BookOpen, Search, Filter, Plus, Edit,
  Eye, Send, Bell, Settings, TrendingUp, TrendingDown, Target,
  Zap, Activity, Globe, DollarSign, Calendar, ArrowRight,
  AlertCircle, Lightbulb, ThumbsUp, XCircle, Info
} from 'lucide-react';

import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

import type { 
  LegalDocument, Contract, ComplianceItem, LegalMatter, 
  LegalStatus, ComplianceStatus, DocumentType
} from '@/types/legal-management';

import {
  IntelligentInsight, Priority, DataQualityIndicator, RiskLevel,
  DecisionWorkflow, DecisionContext
} from '@/types/shared-intelligence';

import { dataSyncService } from '@/lib/data-sync-service';
import { formatCurrency, formatDate } from '@/lib/utils';

// Enhanced interfaces for legal intelligence
interface LegalIntelligence {
  complianceRiskAssessment: ComplianceRiskAssessment;
  contractAnalytics: ContractAnalytics;
  legalWorkflowOptimization: LegalWorkflowOptimization;
  regulatoryMonitoring: RegulatoryMonitoring;
  decisionSupport: LegalDecisionSupport;
  documentIntelligence: DocumentIntelligence;
  costAnalytics: LegalCostAnalytics;
}

interface ComplianceRiskAssessment {
  overallRisk: RiskLevel;
  riskScore: number; // 0-100
  jurisdictionRisks: JurisdictionRisk[];
  regulatoryChanges: RegulatoryChange[];
  complianceGaps: ComplianceGap[];
  mitigation: ComplianceMitigation[];
  auditReadiness: AuditReadinessScore;
  trends: ComplianceTrend[];
}

interface ContractAnalytics {
  portfolioOverview: ContractPortfolio;
  keyTermAnalysis: KeyTermAnalysis;
  renewalPipeline: RenewalPipeline;
  negotiationInsights: NegotiationInsights;
  performanceMetrics: ContractPerformance;
  riskAnalysis: ContractRisk;
  benchmarking: ContractBenchmark;
}

interface LegalWorkflowOptimization {
  processEfficiency: ProcessEfficiency;
  bottleneckAnalysis: BottleneckAnalysis;
  automationOpportunities: LegalAutomationOpportunity[];
  resourceOptimization: ResourceOptimization;
  timelineAcceleration: TimelineAcceleration;
  qualityMetrics: LegalQualityMetrics;
}

interface RegulatoryMonitoring {
  activeRegulations: ActiveRegulation[];
  upcomingChanges: RegulatoryChange[];
  jurisdictionUpdates: JurisdictionUpdate[];
  impactAssessment: RegulatoruImpactAssessment;
  complianceCalendar: ComplianceCalendarItem[];
  alertSystem: RegulatoryAlert[];
}

interface LegalDecisionSupport {
  investmentDecisionSupport: InvestmentLegalSupport[];
  strategicRecommendations: StrategicLegalRecommendation[];
  riskMitigationOptions: RiskMitigationOption[];
  precedentAnalysis: PrecedentAnalysis;
  outcomePredictor: LegalOutcomePredictor;
  decisionTrees: LegalDecisionTree[];
}

interface DocumentIntelligence {
  documentClassification: DocumentClassification;
  keyClauseExtraction: KeyClauseExtraction;
  anomalyDetection: DocumentAnomaly[];
  versionControl: DocumentVersionControl;
  relationshipMapping: DocumentRelationship[];
  searchOptimization: SearchOptimization;
}

interface LegalCostAnalytics {
  costBreakdown: CostBreakdown;
  budgetAnalysis: BudgetAnalysis;
  vendorPerformance: VendorPerformance[];
  costOptimization: CostOptimizationOpportunity[];
  benchmarking: CostBenchmark;
  forecasting: CostForecast;
}

// Supporting interfaces
interface JurisdictionRisk {
  jurisdiction: string;
  riskLevel: RiskLevel;
  specificRisks: string[];
  mitigationActions: string[];
  lastAssessment: Date;
  trend: 'IMPROVING' | 'STABLE' | 'DETERIORATING';
}

interface RegulatoryChange {
  regulation: string;
  description: string;
  effectiveDate: Date;
  jurisdiction: string;
  impact: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  compliance_required: boolean;
  actionItems: RegulatoryActionItem[];
  cost_estimate: number;
}

interface ComplianceGap {
  area: string;
  description: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  deadline: Date;
  responsible: string;
  remediation: RemediationPlan;
  status: ComplianceStatus;
}

interface ComplianceMitigation {
  gap: string;
  strategy: string;
  effort: 'LOW' | 'MEDIUM' | 'HIGH';
  cost: number;
  timeline: string;
  effectiveness: number; // 0-1
  responsible: string;
}

interface AuditReadinessScore {
  overallScore: number; // 0-100
  categories: {
    documentation: number;
    processes: number;
    training: number;
    monitoring: number;
    reporting: number;
  };
  readyDate: Date;
  criticalItems: string[];
}

interface ComplianceTrend {
  area: string;
  trend: 'IMPROVING' | 'STABLE' | 'DETERIORATING';
  historicalData: TrendDataPoint[];
  projection: TrendProjection;
}

interface ContractPortfolio {
  totalContracts: number;
  totalValue: number;
  byType: ContractTypeStats[];
  byStatus: ContractStatusStats[];
  byCounterparty: CounterpartyStats[];
  expiringContracts: ExpiringContract[];
}

interface KeyTermAnalysis {
  commonTerms: CommonTerm[];
  negotiationPoints: NegotiationPoint[];
  termVariations: TermVariation[];
  riskTerms: RiskTerm[];
  opportunityTerms: OpportunityTerm[];
}

interface RenewalPipeline {
  upcomingRenewals: UpcomingRenewal[];
  renewalStrategy: RenewalStrategy;
  riskAssessment: RenewalRisk[];
  opportunityAssessment: RenewalOpportunity[];
  timeline: RenewalTimeline[];
}

interface NegotiationInsights {
  negotiationMetrics: NegotiationMetric[];
  successFactors: SuccessFactor[];
  counterpartyProfile: CounterpartyProfile[];
  tacticalRecommendations: TacticalRecommendation[];
  benchmarkData: NegotiationBenchmark;
}

interface ContractPerformance {
  performanceScores: PerformanceScore[];
  slaCompliance: SLACompliance[];
  deliverableTracking: DeliverableTracking[];
  issueResolution: IssueResolution[];
  valueRealization: ValueRealization;
}

interface ContractRisk {
  identifiedRisks: IdentifiedRisk[];
  riskMitigation: RiskMitigationMeasure[];
  earlyWarnings: ContractEarlyWarning[];
  contingencyPlans: ContingencyPlan[];
}

interface ContractBenchmark {
  termBenchmarks: TermBenchmark[];
  pricingBenchmarks: PricingBenchmark[];
  performanceBenchmarks: PerformanceBenchmark[];
  industryComparisons: IndustryComparison[];
}

interface ProcessEfficiency {
  averageProcessTime: ProcessTimeMetric[];
  efficiencyScore: number; // 0-100
  improvementAreas: ImprovementArea[];
  bestPractices: BestPractice[];
  processMaturity: ProcessMaturityScore;
}

interface BottleneckAnalysis {
  identifiedBottlenecks: Bottleneck[];
  impactAnalysis: BottleneckImpact[];
  solutions: BottleneckSolution[];
  prioritization: BottleneckPriority[];
}

interface LegalAutomationOpportunity {
  process: string;
  description: string;
  effort: 'LOW' | 'MEDIUM' | 'HIGH';
  benefit: 'LOW' | 'MEDIUM' | 'HIGH';
  timeSaving: number; // hours per month
  costSaving: number; // dollars per year
  implementation: AutomationImplementation;
  riskLevel: RiskLevel;
}

interface ResourceOptimization {
  currentAllocation: ResourceAllocation[];
  optimalAllocation: ResourceAllocation[];
  utilizationMetrics: UtilizationMetric[];
  capacityAnalysis: CapacityAnalysis;
  skillGapAnalysis: SkillGapAnalysis;
}

interface TimelineAcceleration {
  currentTimelines: ProcessTimeline[];
  acceleratedTimelines: ProcessTimeline[];
  accelerationMethods: AccelerationMethod[];
  dependencies: TimelineDependency[];
  riskFactors: TimelineRisk[];
}

interface LegalQualityMetrics {
  qualityScore: number; // 0-100
  errorRates: ErrorRate[];
  reworkRates: ReworkRate[];
  clientSatisfaction: ClientSatisfactionScore[];
  accuracyMetrics: AccuracyMetric[];
}

// Main component
interface EnhancedLegalDashboardProps {
  navigationMode?: 'traditional' | 'assisted' | 'autonomous';
  onModeChange?: (mode: 'traditional' | 'assisted' | 'autonomous') => void;
}

export function EnhancedLegalDashboard({ 
  navigationMode = 'traditional', 
  onModeChange 
}: EnhancedLegalDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedEntity, setSelectedEntity] = useState<string>('');
  const [documents, setDocuments] = useState<LegalDocument[]>([]);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [complianceItems, setComplianceItems] = useState<ComplianceItem[]>([]);
  const [legalMatters, setLegalMatters] = useState<LegalMatter[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [dataQuality, setDataQuality] = useState<DataQualityIndicator | null>(null);
  const [insights, setInsights] = useState<IntelligentInsight[]>([]);
  const [legalIntelligence, setLegalIntelligence] = useState<LegalIntelligence | null>(null);
  const [decisionWorkflows, setDecisionWorkflows] = useState<DecisionWorkflow[]>([]);

  useEffect(() => {
    loadLegalData();
    initializeDataSync();
  }, []);

  const initializeDataSync = () => {
    dataSyncService.subscribe({
      id: 'legal-dashboard',
      subscriberModule: 'LegalManagement',
      entityTypes: ['DOCUMENT', 'DEAL'],
      eventTypes: ['UPDATE', 'CREATE'],
      callback: handleDataUpdate
    });
  };

  const handleDataUpdate = async (event: any) => {
    if (event.entityType === 'DOCUMENT') {
      await loadLegalData();
      await loadLegalIntelligence();
    }
  };

  const loadLegalData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/legal-management?type=enhanced&mode=' + navigationMode);
      const result = await response.json();
      
      if (result.success && result.data) {
        setDocuments(result.data.documents || []);
        setContracts(result.data.contracts || []);
        setComplianceItems(result.data.complianceItems || []);
        setLegalMatters(result.data.legalMatters || []);
        setDataQuality(result.data.dataQuality);
        
        // Load AI insights for assisted and autonomous modes
        if (navigationMode !== 'traditional') {
          setInsights(result.data.insights || []);
          setDecisionWorkflows(result.data.decisionWorkflows || []);
        }
      }
    } catch (error) {
      console.error('Failed to load legal data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadLegalIntelligence = async () => {
    if (navigationMode === 'traditional') return;
    
    try {
      const response = await fetch('/api/legal-management/intelligence');
      const result = await response.json();
      
      if (result.success) {
        setLegalIntelligence(result.data);
      }
    } catch (error) {
      console.error('Failed to load legal intelligence:', error);
    }
  };

  useEffect(() => {
    loadLegalIntelligence();
  }, [navigationMode]);

  const renderComplianceRiskDashboard = () => {
    if (!legalIntelligence || navigationMode === 'traditional') return null;

    const risk = legalIntelligence.complianceRiskAssessment;
    
    // Sample risk data for visualization
    const riskData = [
      { jurisdiction: 'Delaware', riskScore: 25, trend: 'stable' },
      { jurisdiction: 'New York', riskScore: 45, trend: 'improving' },
      { jurisdiction: 'California', riskScore: 65, trend: 'deteriorating' },
      { jurisdiction: 'Texas', riskScore: 35, trend: 'improving' },
      { jurisdiction: 'EU', riskScore: 55, trend: 'stable' }
    ];

    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Compliance Risk Assessment
            <Badge variant={
              risk.overallRisk === RiskLevel.LOW || risk.overallRisk === RiskLevel.VERY_LOW ? 'default' :
              risk.overallRisk === RiskLevel.MEDIUM ? 'secondary' :
              'destructive'
            }>
              {risk.overallRisk}
            </Badge>
            <Badge variant="outline">Score: {risk.riskScore}/100</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Risk by Jurisdiction */}
            <div>
              <h4 className="font-semibold mb-3">Risk by Jurisdiction</h4>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={riskData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="jurisdiction" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="riskScore" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Key Risk Areas */}
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-3">Audit Readiness</h4>
                <div className="space-y-3">
                  {Object.entries(risk.auditReadiness.categories).map(([category, score]) => (
                    <div key={category} className="flex items-center justify-between">
                      <span className="text-sm capitalize">{category}:</span>
                      <div className="flex items-center gap-2">
                        <Progress value={score} className="w-20 h-2" />
                        <span className="text-sm font-medium w-8">{score}%</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-3 pt-3 border-t">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Overall Readiness:</span>
                    <Badge variant={risk.auditReadiness.overallScore >= 80 ? 'default' : 'secondary'}>
                      {risk.auditReadiness.overallScore}%
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">
                    Ready by: {formatDate(risk.auditReadiness.readyDate.toString())}
                  </p>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Critical Compliance Gaps</h4>
                <div className="space-y-2">
                  {risk.complianceGaps.slice(0, 3).map((gap, index) => (
                    <Alert key={index} className={
                      gap.severity === 'CRITICAL' ? 'border-red-200 bg-red-50' :
                      gap.severity === 'HIGH' ? 'border-orange-200 bg-orange-50' :
                      'border-yellow-200 bg-yellow-50'
                    }>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertTitle className="text-sm">{gap.area}</AlertTitle>
                      <AlertDescription className="text-xs">
                        <p>{gap.description}</p>
                        <p className="mt-1"><strong>Deadline:</strong> {formatDate(gap.deadline.toString())}</p>
                        <p><strong>Owner:</strong> {gap.responsible}</p>
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

  const renderDecisionSupportDashboard = () => {
    if (!legalIntelligence || navigationMode === 'traditional') return null;

    const decisionSupport = legalIntelligence.decisionSupport;
    
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gavel className="h-5 w-5" />
            Legal Decision Support
            <Badge variant="outline" className="flex items-center gap-1">
              <Brain className="h-3 w-3" />
              AI-Powered
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Investment Decision Support */}
            <div>
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <Target className="h-4 w-4" />
                Investment Support
              </h4>
              <div className="space-y-3">
                {decisionSupport.investmentDecisionSupport.slice(0, 3).map((support, index) => (
                  <div key={index} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-medium text-sm">{support.dealName}</h5>
                      <Badge variant={support.riskLevel === 'LOW' ? 'default' : 'secondary'}>
                        {support.riskLevel}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-600 mb-2">{support.legalIssues.slice(0, 2).join(', ')}</p>
                    <div className="flex items-center gap-2 text-xs">
                      <span>Timeline: {support.timeline}</span>
                      <span>•</span>
                      <span>Cost: {formatCurrency(support.estimatedCost)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Strategic Recommendations */}
            <div>
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <Lightbulb className="h-4 w-4" />
                Strategic Recommendations
              </h4>
              <div className="space-y-3">
                {decisionSupport.strategicRecommendations.slice(0, 3).map((rec, index) => (
                  <div key={index} className="p-3 border rounded-lg bg-blue-50">
                    <div className="flex items-start justify-between mb-2">
                      <h5 className="font-medium text-sm text-blue-800">{rec.area}</h5>
                      <Badge variant={rec.priority === 'HIGH' ? 'destructive' : 'outline'} className="text-xs">
                        {rec.priority}
                      </Badge>
                    </div>
                    <p className="text-xs text-blue-700 mb-2">{rec.recommendation}</p>
                    <div className="flex items-center gap-4 text-xs text-blue-600">
                      <span>Impact: {rec.impact}</span>
                      <span>Effort: {rec.effort}</span>
                      <span>Timeline: {rec.timeline}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Outcome Predictions */}
            <div>
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Outcome Predictions
              </h4>
              <div className="space-y-3">
                <div className="p-3 border rounded-lg">
                  <h5 className="font-medium text-sm mb-2">Contract Negotiation Success</h5>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Success Probability:</span>
                      <span className="font-medium">{Math.round(decisionSupport.outcomePredictor.successProbability * 100)}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Expected Timeline:</span>
                      <span className="font-medium">{decisionSupport.outcomePredictor.expectedTimeline}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Cost Range:</span>
                      <span className="font-medium">
                        {formatCurrency(decisionSupport.outcomePredictor.costRange.low)} - {formatCurrency(decisionSupport.outcomePredictor.costRange.high)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-3 border rounded-lg">
                  <h5 className="font-medium text-sm mb-2">Risk Factors</h5>
                  <div className="space-y-1">
                    {decisionSupport.outcomePredictor.riskFactors.slice(0, 3).map((risk, idx) => (
                      <div key={idx} className="text-xs text-gray-600 flex items-center gap-2">
                        <AlertCircle className="h-3 w-3 text-orange-500" />
                        <span>{risk}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderContractAnalytics = () => {
    if (!legalIntelligence || navigationMode === 'traditional') return null;

    const contracts = legalIntelligence.contractAnalytics;
    
    // Sample contract data
    const contractTypeData = [
      { type: 'Investment Agreements', count: 45, value: 250000000 },
      { type: 'Service Contracts', count: 23, value: 15000000 },
      { type: 'NDAs', count: 78, value: 0 },
      { type: 'Employment', count: 34, value: 8500000 },
      { type: 'Real Estate', count: 12, value: 35000000 }
    ];

    const renewalData = [
      { month: 'Jan', renewals: 8, value: 12000000 },
      { month: 'Feb', renewals: 12, value: 18000000 },
      { month: 'Mar', renewals: 15, value: 25000000 },
      { month: 'Apr', renewals: 10, value: 15000000 },
      { month: 'May', renewals: 20, value: 32000000 },
      { month: 'Jun', renewals: 18, value: 28000000 }
    ];

    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Contract Analytics
            <Badge variant="outline">{contracts.portfolioOverview.totalContracts} Active</Badge>
            <Badge variant="outline">{formatCurrency(contracts.portfolioOverview.totalValue)}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Contract Portfolio Distribution */}
            <div>
              <h4 className="font-semibold mb-3">Portfolio Distribution</h4>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={contractTypeData}
                    dataKey="value"
                    nameKey="type"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    label={(entry) => `${entry.type}: ${formatCurrency(entry.value)}`}
                  >
                    {contractTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={`hsl(${index * 45}, 70%, 50%)`} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Renewal Pipeline */}
            <div>
              <h4 className="font-semibold mb-3">Renewal Pipeline</h4>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={renewalData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="renewals" fill="#82ca9d" name="Count" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 border rounded-lg">
              <h5 className="font-medium text-sm text-gray-600">Expiring (30 days)</h5>
              <p className="text-2xl font-bold text-red-600">
                {contracts.renewalPipeline.upcomingRenewals.filter(r => 
                  new Date(r.expirationDate).getTime() - Date.now() < 30 * 24 * 60 * 60 * 1000
                ).length}
              </p>
            </div>
            
            <div className="p-4 border rounded-lg">
              <h5 className="font-medium text-sm text-gray-600">Performance Score</h5>
              <p className="text-2xl font-bold text-green-600">
                {Math.round(contracts.performanceMetrics.performanceScores.reduce((sum, score) => sum + score.score, 0) / contracts.performanceMetrics.performanceScores.length)}%
              </p>
            </div>
            
            <div className="p-4 border rounded-lg">
              <h5 className="font-medium text-sm text-gray-600">SLA Compliance</h5>
              <p className="text-2xl font-bold text-blue-600">
                {Math.round(contracts.performanceMetrics.slaCompliance.reduce((sum, sla) => sum + sla.complianceRate, 0) / contracts.performanceMetrics.slaCompliance.length * 100)}%
              </p>
            </div>
            
            <div className="p-4 border rounded-lg">
              <h5 className="font-medium text-sm text-gray-600">Risk Contracts</h5>
              <p className="text-2xl font-bold text-orange-600">
                {contracts.riskAnalysis.identifiedRisks.filter(risk => risk.severity === 'HIGH' || risk.severity === 'CRITICAL').length}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderWorkflowOptimization = () => {
    if (!legalIntelligence || navigationMode === 'traditional') return null;

    const workflow = legalIntelligence.legalWorkflowOptimization;
    
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Workflow Optimization
            <Badge variant="outline">Efficiency: {workflow.processEfficiency.efficiencyScore}%</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Process Efficiency */}
            <div>
              <h4 className="font-semibold mb-3">Process Performance</h4>
              <div className="space-y-3">
                {workflow.processEfficiency.averageProcessTime.map((process, index) => (
                  <div key={index} className="p-3 border rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <h5 className="font-medium text-sm">{process.processName}</h5>
                      <Badge variant={process.efficiency >= 80 ? 'default' : 'secondary'} className="text-xs">
                        {process.efficiency}%
                      </Badge>
                    </div>
                    <div className="text-xs text-gray-600">
                      <p>Avg Time: {process.averageTime} days</p>
                      <p>Target: {process.targetTime} days</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottleneck Analysis */}
            <div>
              <h4 className="font-semibold mb-3">Identified Bottlenecks</h4>
              <div className="space-y-3">
                {workflow.bottleneckAnalysis.identifiedBottlenecks.slice(0, 4).map((bottleneck, index) => (
                  <div key={index} className="p-3 border rounded-lg bg-red-50 border-red-200">
                    <div className="flex items-start justify-between mb-2">
                      <h5 className="font-medium text-sm text-red-800">{bottleneck.process}</h5>
                      <Badge variant="destructive" className="text-xs">
                        {bottleneck.severity}
                      </Badge>
                    </div>
                    <p className="text-xs text-red-700 mb-2">{bottleneck.description}</p>
                    <div className="text-xs text-red-600">
                      <p>Impact: {bottleneck.impact} days delay</p>
                      <p>Frequency: {bottleneck.frequency}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Automation Opportunities */}
            <div>
              <h4 className="font-semibold mb-3">Automation Opportunities</h4>
              <div className="space-y-3">
                {workflow.automationOpportunities.slice(0, 4).map((opportunity, index) => (
                  <div key={index} className="p-3 border rounded-lg bg-green-50">
                    <div className="flex items-start justify-between mb-2">
                      <h5 className="font-medium text-sm text-green-800">{opportunity.process}</h5>
                      <Badge variant={opportunity.benefit === 'HIGH' ? 'default' : 'outline'} className="text-xs">
                        {opportunity.benefit}
                      </Badge>
                    </div>
                    <p className="text-xs text-green-700 mb-2">{opportunity.description}</p>
                    <div className="text-xs text-green-600">
                      <p>Saving: {opportunity.timeSaving}h/month</p>
                      <p>Cost: {formatCurrency(opportunity.costSaving)}/year</p>
                      <p>Effort: {opportunity.effort}</p>
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

  const renderDocumentIntelligence = () => {
    if (!legalIntelligence || navigationMode === 'traditional') return null;

    const docIntel = legalIntelligence.documentIntelligence;
    
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Document Intelligence
            <Badge variant="outline" className="flex items-center gap-1">
              <Brain className="h-3 w-3" />
              AI-Powered
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Document Classification */}
            <div>
              <h4 className="font-semibold mb-3">Classification Overview</h4>
              <div className="space-y-3">
                {Object.entries(docIntel.documentClassification.categories).map(([category, count]) => (
                  <div key={category} className="flex justify-between items-center p-2 border rounded">
                    <span className="text-sm capitalize">{category.replace('_', ' ')}:</span>
                    <div className="flex items-center gap-2">
                      <Progress value={count as number / 100 * 100} className="w-20 h-2" />
                      <span className="text-sm font-medium w-8">{count}</span>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 p-3 border rounded-lg bg-blue-50">
                <h5 className="font-medium text-sm text-blue-800 mb-2">Classification Accuracy</h5>
                <div className="flex justify-between text-xs text-blue-700">
                  <span>Overall Accuracy:</span>
                  <span className="font-medium">{Math.round(docIntel.documentClassification.accuracy * 100)}%</span>
                </div>
                <div className="flex justify-between text-xs text-blue-700">
                  <span>Confidence Score:</span>
                  <span className="font-medium">{Math.round(docIntel.documentClassification.confidence * 100)}%</span>
                </div>
              </div>
            </div>

            {/* Key Clauses and Anomalies */}
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold mb-3">Key Clause Analysis</h4>
                <div className="space-y-2">
                  {docIntel.keyClauseExtraction.extractedClauses.slice(0, 4).map((clause, index) => (
                    <div key={index} className="p-2 border rounded text-sm">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-medium">{clause.clauseType}</span>
                        <Badge variant="outline" className="text-xs">
                          {Math.round(clause.confidence * 100)}%
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-600">{clause.summary}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Document Anomalies</h4>
                <div className="space-y-2">
                  {docIntel.anomalyDetection.slice(0, 3).map((anomaly, index) => (
                    <Alert key={index} className="border-orange-200 bg-orange-50">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertTitle className="text-sm">{anomaly.type}</AlertTitle>
                      <AlertDescription className="text-xs">
                        <p>{anomaly.description}</p>
                        <p className="mt-1"><strong>Risk Level:</strong> {anomaly.riskLevel}</p>
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

  const calculateAggregateMetrics = () => {
    const totalDocuments = documents.length;
    const totalContracts = contracts.length;
    const activeMatters = legalMatters.filter(matter => matter.status === 'ACTIVE').length;
    const pendingCompliance = complianceItems.filter(item => item.status === 'PENDING' || item.status === 'IN_PROGRESS').length;
    const overdueItems = complianceItems.filter(item => 
      item.dueDate && new Date(item.dueDate) < new Date()
    ).length;

    return {
      totalDocuments,
      totalContracts,
      activeMatters,
      pendingCompliance,
      overdueItems,
      complianceScore: Math.round((complianceItems.length - pendingCompliance) / complianceItems.length * 100) || 0
    };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  const aggregateMetrics = calculateAggregateMetrics();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Enhanced Legal Management</h1>
          <p className="text-gray-600">
            AI-powered legal operations with intelligent decision support and compliance monitoring
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
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Documents</p>
                <p className="text-2xl font-bold text-gray-900">{aggregateMetrics.totalDocuments}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Contracts</p>
                <p className="text-2xl font-bold text-gray-900">{aggregateMetrics.totalContracts}</p>
              </div>
              <Scale className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Legal Matters</p>
                <p className="text-2xl font-bold text-gray-900">{aggregateMetrics.activeMatters}</p>
              </div>
              <Gavel className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Compliance Score</p>
                <p className="text-2xl font-bold text-gray-900">{aggregateMetrics.complianceScore}%</p>
              </div>
              <Shield className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Overdue Items</p>
                <p className="text-2xl font-bold text-red-600">{aggregateMetrics.overdueItems}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Intelligence Dashboards */}
      {navigationMode !== 'traditional' && (
        <div className="space-y-6">
          {renderComplianceRiskDashboard()}
          {renderDecisionSupportDashboard()}
          {renderContractAnalytics()}
          {renderWorkflowOptimization()}
          {renderDocumentIntelligence()}
        </div>
      )}

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="contracts">Contracts</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="matters">Legal Matters</TabsTrigger>
          <TabsTrigger value="workflows">Workflows</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          {/* Overview content would go here */}
        </TabsContent>

        {/* Other tab contents would be enhanced versions of existing components */}
      </Tabs>
    </div>
  );
}

// Mock data interfaces for development
interface InvestmentLegalSupport {
  dealName: string;
  legalIssues: string[];
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  timeline: string;
  estimatedCost: number;
}

interface StrategicLegalRecommendation {
  area: string;
  recommendation: string;
  priority: Priority;
  impact: 'LOW' | 'MEDIUM' | 'HIGH';
  effort: 'LOW' | 'MEDIUM' | 'HIGH';
  timeline: string;
}

interface LegalOutcomePredictor {
  successProbability: number;
  expectedTimeline: string;
  costRange: { low: number; high: number };
  riskFactors: string[];
}

// Mock data for demonstration
const mockInvestmentSupport: InvestmentLegalSupport[] = [
  { dealName: "TechCorp Acquisition", legalIssues: ["IP Due Diligence", "Regulatory Approval"], riskLevel: "MEDIUM", timeline: "6-8 weeks", estimatedCost: 250000 },
  { dealName: "HealthTech Investment", legalIssues: ["FDA Compliance", "Data Privacy"], riskLevel: "HIGH", timeline: "8-12 weeks", estimatedCost: 350000 }
];

const mockStrategicRecommendations: StrategicLegalRecommendation[] = [
  { area: "Contract Automation", recommendation: "Implement AI contract review", priority: Priority.HIGH, impact: "HIGH", effort: "MEDIUM", timeline: "3 months" },
  { area: "Compliance Monitoring", recommendation: "Deploy automated compliance tracking", priority: Priority.MEDIUM, impact: "MEDIUM", effort: "LOW", timeline: "6 weeks" }
];

const mockOutcomePredictor: LegalOutcomePredictor = {
  successProbability: 0.85,
  expectedTimeline: "4-6 weeks",
  costRange: { low: 150000, high: 300000 },
  riskFactors: ["Regulatory changes", "Counterparty delays", "Complex IP issues"]
};