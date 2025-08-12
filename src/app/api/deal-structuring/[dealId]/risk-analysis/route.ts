import { NextRequest, NextResponse } from 'next/server';
import { AIDealStructuringService } from '@/lib/services/ai-deal-structuring-service';
import { DealStructuringProject } from '@/types/deal-structuring';

// Mock deal data for consistency
const mockDeals: Record<string, DealStructuringProject> = {
  '1': {
    id: '1',
    name: 'TechCorp Secondary',
    type: 'SINGLE_ASSET_CONTINUATION',
    stage: 'STRUCTURING',
    targetValue: 150000000,
    currentValuation: 145000000,
    progress: 75,
    team: [],
    lastUpdated: new Date(),
    keyMetrics: {
      irr: 18.5,
      multiple: 2.3,
      paybackPeriod: 4.2,
      leverage: 3.5,
      equityContribution: 45000000
    },
    riskLevel: 'medium',
    nextMilestone: 'Financial Model Review'
  },
  '2': {
    id: '2',
    name: 'GreenEnergy Fund II',
    type: 'MULTI_ASSET_CONTINUATION',
    stage: 'DUE_DILIGENCE',
    targetValue: 200000000,
    progress: 45,
    team: [],
    lastUpdated: new Date(),
    keyMetrics: {
      irr: 22.1,
      multiple: 2.8,
      paybackPeriod: 3.8,
      leverage: 2.9,
      equityContribution: 70000000
    },
    riskLevel: 'low',
    nextMilestone: 'Management Presentation'
  },
  '3': {
    id: '3',
    name: 'HealthTech Acquisition',
    type: 'LBO_STRUCTURE',
    stage: 'INVESTMENT_COMMITTEE',
    targetValue: 100000000,
    progress: 90,
    team: [],
    lastUpdated: new Date(),
    keyMetrics: {
      irr: 25.3,
      multiple: 3.1,
      paybackPeriod: 3.2,
      leverage: 4.2,
      equityContribution: 25000000
    },
    riskLevel: 'high',
    nextMilestone: 'IC Vote'
  }
};

interface RiskAnalysisRequest {
  analysisType: 'comprehensive' | 'financial' | 'operational' | 'market' | 'stress_test';
  mode: 'traditional' | 'assisted' | 'autonomous';
  parameters?: Record<string, any>;
  monitoringEnabled?: boolean;
}

interface RiskAlert {
  id: string;
  type: 'warning' | 'critical' | 'info';
  category: 'financial' | 'operational' | 'market' | 'regulatory' | 'execution';
  title: string;
  description: string;
  triggeredAt: string;
  threshold: number;
  currentValue: number;
  trend: 'improving' | 'stable' | 'deteriorating';
  recommendedActions: string[];
  severity: number; // 1-10 scale
}

interface StressTestScenario {
  name: string;
  parameters: Record<string, number>;
  results: {
    irr: number;
    multiple: number;
    lossScenario: boolean;
    breakEvenTime: number;
    maxDrawdown: number;
  };
  probability: number;
}

interface MonitoringDashboard {
  overallRiskScore: number;
  riskTrend: 'improving' | 'stable' | 'deteriorating';
  activeAlerts: RiskAlert[];
  keyMetrics: Array<{
    name: string;
    value: number;
    threshold: number;
    status: 'green' | 'yellow' | 'red';
    trend: 'up' | 'down' | 'stable';
  }>;
  predictiveInsights: Array<{
    insight: string;
    probability: number;
    timeframe: string;
    impact: 'low' | 'medium' | 'high';
  }>;
}

// GET /api/deal-structuring/[dealId]/risk-analysis
export async function GET(
  request: NextRequest,
  { params }: { params: { dealId: string } }
) {
  try {
    const { dealId } = params;
    const { searchParams } = new URL(request.url);
    const mode = searchParams.get('mode') as 'traditional' | 'assisted' | 'autonomous' || 'assisted';
    const analysisType = searchParams.get('type') as 'comprehensive' | 'financial' | 'operational' | 'market' | 'stress_test' || 'comprehensive';

    const deal = mockDeals[dealId];
    if (!deal) {
      return NextResponse.json(
        { error: 'Deal not found', success: false },
        { status: 404 }
      );
    }

    console.log(`Generating ${analysisType} risk analysis for ${deal.name} in ${mode} mode`);

    // Generate comprehensive risk assessment
    const riskAssessment = AIDealStructuringService.performRiskAssessment(deal);
    
    // Generate mode-specific monitoring and alerts
    const monitoringDashboard = await generateMonitoringDashboard(deal, mode);
    const stressTests = await runStressTestScenarios(deal, mode);
    const predictiveRisks = await generatePredictiveRiskAnalysis(deal, mode);

    // Mode-specific features
    const modeFeatures = {
      traditional: {
        alertThreshold: 'high', // Only show high/critical alerts
        automatedMonitoring: false,
        stressTestCount: 3,
        predictiveAnalysis: false
      },
      assisted: {
        alertThreshold: 'medium', // Show medium+ alerts
        automatedMonitoring: true,
        stressTestCount: 5,
        predictiveAnalysis: true,
        aiInsights: true
      },
      autonomous: {
        alertThreshold: 'low', // Show all alerts
        automatedMonitoring: true,
        stressTestCount: 8,
        predictiveAnalysis: true,
        aiInsights: true,
        autoRemediation: true,
        realTimeMonitoring: true
      }
    };

    const features = modeFeatures[mode];

    // Filter alerts based on mode
    const filteredAlerts = monitoringDashboard.activeAlerts.filter(alert => {
      if (features.alertThreshold === 'high') return alert.type === 'critical';
      if (features.alertThreshold === 'medium') return alert.type !== 'info';
      return true; // Show all for autonomous mode
    });

    return NextResponse.json({
      data: {
        dealId,
        mode,
        analysisType,
        riskAssessment,
        monitoring: {
          ...monitoringDashboard,
          activeAlerts: filteredAlerts,
          automatedMonitoring: features.automatedMonitoring,
          realTimeEnabled: features.realTimeMonitoring || false
        },
        stressTests: stressTests.slice(0, features.stressTestCount),
        predictiveRisks: features.predictiveAnalysis ? predictiveRisks : [],
        modeCapabilities: {
          traditional: ['Manual risk review', 'Standard stress tests', 'Quarterly assessments'],
          assisted: ['AI-powered alerts', 'Continuous monitoring', 'Predictive risk analysis', 'Smart recommendations'],
          autonomous: ['Real-time monitoring', 'Automated remediation', 'Advanced stress testing', 'ML-driven predictions', 'Auto-escalation']
        }[mode],
        recommendations: features.aiInsights ? generateRiskRecommendations(deal, riskAssessment, mode) : [],
        generatedAt: new Date().toISOString()
      },
      success: true,
    });

  } catch (error) {
    console.error('Error generating risk analysis:', error);
    return NextResponse.json(
      { error: 'Failed to generate risk analysis', success: false },
      { status: 500 }
    );
  }
}

// POST /api/deal-structuring/[dealId]/risk-analysis
export async function POST(
  request: NextRequest,
  { params }: { params: { dealId: string } }
) {
  try {
    const { dealId } = params;
    const body: RiskAnalysisRequest = await request.json();
    const { analysisType, mode, parameters, monitoringEnabled } = body;

    const deal = mockDeals[dealId];
    if (!deal) {
      return NextResponse.json(
        { error: 'Deal not found', success: false },
        { status: 404 }
      );
    }

    console.log(`Running custom ${analysisType} risk analysis for ${deal.name}`);

    let analysisResult;
    switch (analysisType) {
      case 'stress_test':
        analysisResult = await runCustomStressTest(deal, parameters || {}, mode);
        break;
      case 'financial':
        analysisResult = await runFinancialRiskAnalysis(deal, parameters || {}, mode);
        break;
      case 'operational':
        analysisResult = await runOperationalRiskAnalysis(deal, parameters || {}, mode);
        break;
      case 'market':
        analysisResult = await runMarketRiskAnalysis(deal, parameters || {}, mode);
        break;
      default:
        analysisResult = await runComprehensiveRiskAnalysis(deal, parameters || {}, mode);
    }

    // Set up monitoring if requested (autonomous mode feature)
    let monitoringSetup = null;
    if (monitoringEnabled && mode === 'autonomous') {
      monitoringSetup = await setupAutonomousMonitoring(deal, analysisResult);
    }

    return NextResponse.json({
      data: {
        dealId,
        analysisType,
        mode,
        result: analysisResult,
        monitoring: monitoringSetup,
        executedAt: new Date().toISOString()
      },
      success: true,
    });

  } catch (error) {
    console.error('Error running custom risk analysis:', error);
    return NextResponse.json(
      { error: 'Failed to run risk analysis', success: false },
      { status: 500 }
    );
  }
}

// Helper functions
async function generateMonitoringDashboard(
  deal: DealStructuringProject,
  mode: string
): Promise<MonitoringDashboard> {
  await new Promise(resolve => setTimeout(resolve, 800));

  const alerts: RiskAlert[] = [];
  
  // Generate alerts based on deal metrics
  if (deal.keyMetrics?.leverage && deal.keyMetrics.leverage > 4.0) {
    alerts.push({
      id: `leverage-alert-${deal.id}`,
      type: 'warning',
      category: 'financial',
      title: 'High Leverage Detected',
      description: `Current leverage of ${deal.keyMetrics.leverage.toFixed(1)}x exceeds recommended threshold of 4.0x`,
      triggeredAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      threshold: 4.0,
      currentValue: deal.keyMetrics.leverage,
      trend: 'stable',
      recommendedActions: [
        'Review capital structure optimization',
        'Consider debt refinancing options',
        'Evaluate equity injection scenarios'
      ],
      severity: 6
    });
  }

  if (deal.progress < 50 && deal.stage === 'DUE_DILIGENCE') {
    alerts.push({
      id: `progress-alert-${deal.id}`,
      type: 'info',
      category: 'operational',
      title: 'Due Diligence Progress Below Target',
      description: 'Deal progress is lagging behind typical timeline for this stage',
      triggeredAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      threshold: 50,
      currentValue: deal.progress,
      trend: 'improving',
      recommendedActions: [
        'Resource reallocation to critical path items',
        'Parallel workstream execution',
        'Vendor acceleration programs'
      ],
      severity: 3
    });
  }

  const keyMetrics = [
    {
      name: 'Leverage Ratio',
      value: deal.keyMetrics?.leverage || 0,
      threshold: 4.0,
      status: (deal.keyMetrics?.leverage || 0) > 4.0 ? 'red' as const : 
              (deal.keyMetrics?.leverage || 0) > 3.5 ? 'yellow' as const : 'green' as const,
      trend: 'stable' as const
    },
    {
      name: 'IRR Target',
      value: deal.keyMetrics?.irr || 0,
      threshold: 18.0,
      status: (deal.keyMetrics?.irr || 0) >= 18.0 ? 'green' as const :
              (deal.keyMetrics?.irr || 0) >= 15.0 ? 'yellow' as const : 'red' as const,
      trend: 'up' as const
    },
    {
      name: 'Progress %',
      value: deal.progress,
      threshold: 60,
      status: deal.progress >= 60 ? 'green' as const :
              deal.progress >= 40 ? 'yellow' as const : 'red' as const,
      trend: 'up' as const
    }
  ];

  const predictiveInsights = mode !== 'traditional' ? [
    {
      insight: 'Market volatility may impact exit timing by 6-12 months',
      probability: 0.68,
      timeframe: '6-12 months',
      impact: 'medium' as const
    },
    {
      insight: 'Interest rate increases could affect refinancing options',
      probability: 0.45,
      timeframe: '3-6 months', 
      impact: 'high' as const
    }
  ] : [];

  return {
    overallRiskScore: calculateOverallRiskScore(alerts, keyMetrics),
    riskTrend: 'stable',
    activeAlerts: alerts,
    keyMetrics,
    predictiveInsights
  };
}

async function runStressTestScenarios(
  deal: DealStructuringProject,
  mode: string
): Promise<StressTestScenario[]> {
  await new Promise(resolve => setTimeout(resolve, 1200));

  const baseIRR = deal.keyMetrics?.irr || 18.5;
  const baseMultiple = deal.keyMetrics?.multiple || 2.3;

  const scenarios: StressTestScenario[] = [
    {
      name: 'Base Case',
      parameters: { revenueGrowth: 8.5, marketMultiple: 1.0, leverageCost: 1.0 },
      results: {
        irr: baseIRR,
        multiple: baseMultiple,
        lossScenario: false,
        breakEvenTime: 3.2,
        maxDrawdown: 0
      },
      probability: 0.40
    },
    {
      name: 'Market Downturn',
      parameters: { revenueGrowth: 3.2, marketMultiple: 0.75, leverageCost: 1.25 },
      results: {
        irr: baseIRR - 5.2,
        multiple: baseMultiple - 0.8,
        lossScenario: baseIRR - 5.2 < 10,
        breakEvenTime: 4.8,
        maxDrawdown: 25
      },
      probability: 0.25
    },
    {
      name: 'Interest Rate Spike',
      parameters: { revenueGrowth: 6.0, marketMultiple: 0.9, leverageCost: 1.8 },
      results: {
        irr: baseIRR - 3.1,
        multiple: baseMultiple - 0.4,
        lossScenario: false,
        breakEvenTime: 4.1,
        maxDrawdown: 15
      },
      probability: 0.20
    },
    {
      name: 'Severe Recession',
      parameters: { revenueGrowth: -2.0, marketMultiple: 0.6, leverageCost: 2.0 },
      results: {
        irr: baseIRR - 8.5,
        multiple: baseMultiple - 1.2,
        lossScenario: true,
        breakEvenTime: 6.5,
        maxDrawdown: 45
      },
      probability: 0.10
    },
    {
      name: 'Bull Market',
      parameters: { revenueGrowth: 15.0, marketMultiple: 1.3, leverageCost: 0.8 },
      results: {
        irr: baseIRR + 6.2,
        multiple: baseMultiple + 1.1,
        lossScenario: false,
        breakEvenTime: 2.1,
        maxDrawdown: 0
      },
      probability: 0.15
    }
  ];

  // Add more sophisticated scenarios for autonomous mode
  if (mode === 'autonomous') {
    scenarios.push(
      {
        name: 'Regulatory Change',
        parameters: { revenueGrowth: 5.0, marketMultiple: 0.85, leverageCost: 1.15 },
        results: {
          irr: baseIRR - 2.8,
          multiple: baseMultiple - 0.3,
          lossScenario: false,
          breakEvenTime: 3.9,
          maxDrawdown: 12
        },
        probability: 0.08
      },
      {
        name: 'Competitive Disruption',
        parameters: { revenueGrowth: -1.0, marketMultiple: 0.7, leverageCost: 1.4 },
        results: {
          irr: baseIRR - 6.8,
          multiple: baseMultiple - 0.9,
          lossScenario: baseIRR - 6.8 < 12,
          breakEvenTime: 5.2,
          maxDrawdown: 35
        },
        probability: 0.12
      },
      {
        name: 'ESG Compliance Costs',
        parameters: { revenueGrowth: 7.0, marketMultiple: 0.95, leverageCost: 1.05 },
        results: {
          irr: baseIRR - 1.2,
          multiple: baseMultiple - 0.1,
          lossScenario: false,
          breakEvenTime: 3.5,
          maxDrawdown: 5
        },
        probability: 0.30
      }
    );
  }

  return scenarios;
}

async function generatePredictiveRiskAnalysis(
  deal: DealStructuringProject,
  mode: string
): Promise<Array<{ risk: string; probability: number; impact: string; mitigation: string }>> {
  if (mode === 'traditional') return [];
  
  await new Promise(resolve => setTimeout(resolve, 600));

  return [
    {
      risk: 'Covenant breach within 12 months',
      probability: deal.keyMetrics?.leverage && deal.keyMetrics.leverage > 4.0 ? 0.25 : 0.08,
      impact: 'high',
      mitigation: 'Implement monthly covenant monitoring and early warning system'
    },
    {
      risk: 'Exit timing delay due to market conditions',
      probability: 0.35,
      impact: 'medium',
      mitigation: 'Develop alternative exit strategies and maintain operational flexibility'
    },
    {
      risk: 'Management team departure',
      probability: 0.15,
      impact: 'high',
      mitigation: 'Strengthen retention programs and succession planning'
    }
  ];
}

function generateRiskRecommendations(
  deal: DealStructuringProject,
  riskAssessment: any,
  mode: string
): string[] {
  const recommendations = [];

  if (deal.keyMetrics?.leverage && deal.keyMetrics.leverage > 4.0) {
    recommendations.push('Consider capital structure optimization to reduce leverage below 4.0x');
  }

  if (deal.progress < 60) {
    recommendations.push('Accelerate critical path activities to meet timeline targets');
  }

  if (mode === 'autonomous') {
    recommendations.push('Enable real-time monitoring alerts for proactive risk management');
    recommendations.push('Implement automated stress testing on quarterly basis');
  }

  return recommendations;
}

function calculateOverallRiskScore(alerts: RiskAlert[], keyMetrics: any[]): number {
  const alertScore = alerts.reduce((sum, alert) => {
    const weights = { critical: 30, warning: 15, info: 5 };
    return sum + weights[alert.type];
  }, 0);

  const metricScore = keyMetrics.reduce((sum, metric) => {
    const weights = { red: 20, yellow: 10, green: 0 };
    return sum + weights[metric.status];
  }, 0);

  return Math.min(100, alertScore + metricScore);
}

// Additional analysis functions
async function runCustomStressTest(deal: DealStructuringProject, params: any, mode: string) {
  await new Promise(resolve => setTimeout(resolve, 2000));
  return { status: 'completed', scenarios: 5, worstCaseIRR: 8.2, lossRisk: 0.15 };
}

async function runFinancialRiskAnalysis(deal: DealStructuringProject, params: any, mode: string) {
  await new Promise(resolve => setTimeout(resolve, 1500));
  return { leverageRisk: 'moderate', liquidityRisk: 'low', covenantRisk: 'low' };
}

async function runOperationalRiskAnalysis(deal: DealStructuringProject, params: any, mode: string) {
  await new Promise(resolve => setTimeout(resolve, 1200));
  return { managementRisk: 'low', integrationRisk: 'medium', scalabilityRisk: 'low' };
}

async function runMarketRiskAnalysis(deal: DealStructuringProject, params: any, mode: string) {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return { sectorRisk: 'medium', competitiveRisk: 'low', regulatoryRisk: 'low' };
}

async function runComprehensiveRiskAnalysis(deal: DealStructuringProject, params: any, mode: string) {
  await new Promise(resolve => setTimeout(resolve, 2500));
  return { overallRisk: 'medium', keyRisks: ['leverage', 'market timing'], recommendations: 3 };
}

async function setupAutonomousMonitoring(deal: DealStructuringProject, analysis: any) {
  return {
    enabled: true,
    frequency: 'daily',
    alertThresholds: { leverage: 4.0, irr: 15.0 },
    autoActions: ['email_alerts', 'dashboard_updates', 'trend_analysis']
  };
}