import { NextRequest, NextResponse } from 'next/server';
import type { 
  PortfolioCompany,
  PortfolioAnalytics,
  PerformanceReport,
  ESGReport,
  RiskAssessment,
  QuarterlyUpdate,
  InvestmentThesis,
  InvestmentStage,
  InvestmentType,
  CompanyStatus,
  RiskLevel,
  ESGRating 
} from '@/types/portfolio-management';

// Mock Portfolio Companies Data
const mockPortfolioCompanies: PortfolioCompany[] = [
  {
    id: 'pc-1',
    name: 'TechCorp Solutions',
    description: 'AI-powered enterprise software platform',
    sector: 'Technology',
    subsector: 'Software',
    geography: 'North America',
    website: 'https://techcorp.com',
    investmentDate: new Date('2022-03-15'),
    initialInvestment: 25000000,
    totalInvestment: 25000000,
    currentValuation: 35000000,
    investmentStage: InvestmentStage.SERIES_B,
    investmentType: InvestmentType.PRIMARY,
    ownershipPercentage: 15.5,
    boardSeats: 1,
    irr: 22.4,
    moic: 1.4,
    unrealizedGain: 10000000,
    status: CompanyStatus.ACTIVE,
    riskRating: RiskLevel.MEDIUM,
    esgScore: 82.5,
    environmentalScore: 78.0,
    socialScore: 85.0,
    governanceScore: 84.5,
    esgRating: ESGRating.B_PLUS,
    lastRevenue: 45000000,
    lastEbitda: 12000000,
    employeeCount: 250,
    customerCount: 1200,
    createdAt: new Date('2022-03-15'),
    updatedAt: new Date('2024-03-20')
  },
  {
    id: 'pc-2',
    name: 'HealthTech Innovations',
    description: 'Digital health platform for chronic disease management',
    sector: 'Healthcare',
    subsector: 'Digital Health',
    geography: 'Europe',
    website: 'https://healthtech-innov.com',
    investmentDate: new Date('2021-09-20'),
    initialInvestment: 40000000,
    totalInvestment: 55000000,
    currentValuation: 85000000,
    exitValuation: 85000000,
    exitDate: new Date('2024-02-15'),
    investmentStage: InvestmentStage.GROWTH,
    investmentType: InvestmentType.PRIMARY,
    ownershipPercentage: 22.0,
    boardSeats: 2,
    irr: 28.7,
    moic: 1.55,
    realizedGain: 30000000,
    status: CompanyStatus.EXITED,
    riskRating: RiskLevel.LOW,
    esgScore: 89.2,
    environmentalScore: 85.5,
    socialScore: 92.0,
    governanceScore: 90.0,
    esgRating: ESGRating.A,
    lastRevenue: 78000000,
    lastEbitda: 18500000,
    employeeCount: 420,
    customerCount: 35000,
    createdAt: new Date('2021-09-20'),
    updatedAt: new Date('2024-02-15')
  },
  {
    id: 'pc-3',
    name: 'GreenEnergy Solutions',
    description: 'Renewable energy infrastructure and storage',
    sector: 'Energy',
    subsector: 'Renewable Energy',
    geography: 'North America',
    website: 'https://greenenergy-sol.com',
    investmentDate: new Date('2023-01-10'),
    initialInvestment: 75000000,
    totalInvestment: 75000000,
    currentValuation: 72000000,
    investmentStage: InvestmentStage.GROWTH,
    investmentType: InvestmentType.PRIMARY,
    ownershipPercentage: 18.0,
    boardSeats: 1,
    irr: -2.1,
    moic: 0.96,
    unrealizedGain: -3000000,
    status: CompanyStatus.UNDER_REVIEW,
    riskRating: RiskLevel.HIGH,
    esgScore: 95.0,
    environmentalScore: 98.0,
    socialScore: 90.0,
    governanceScore: 92.5,
    esgRating: ESGRating.A_PLUS,
    lastRevenue: 125000000,
    lastEbitda: 25000000,
    employeeCount: 680,
    customerCount: 850,
    createdAt: new Date('2023-01-10'),
    updatedAt: new Date('2024-03-18')
  },
  {
    id: 'pc-4',
    name: 'FinServ Disruptor',
    description: 'Blockchain-based financial services platform',
    sector: 'Financial Services',
    subsector: 'Fintech',
    geography: 'Asia Pacific',
    website: 'https://finserv-disruptor.com',
    investmentDate: new Date('2022-11-05'),
    initialInvestment: 30000000,
    totalInvestment: 45000000,
    currentValuation: 65000000,
    investmentStage: InvestmentStage.SERIES_C,
    investmentType: InvestmentType.PRIMARY,
    ownershipPercentage: 12.5,
    boardSeats: 1,
    irr: 31.2,
    moic: 1.44,
    unrealizedGain: 20000000,
    status: CompanyStatus.ACTIVE,
    riskRating: RiskLevel.MEDIUM,
    esgScore: 76.8,
    environmentalScore: 72.0,
    socialScore: 80.0,
    governanceScore: 78.5,
    esgRating: ESGRating.B,
    lastRevenue: 32000000,
    lastEbitda: 8500000,
    employeeCount: 180,
    customerCount: 125000,
    createdAt: new Date('2022-11-05'),
    updatedAt: new Date('2024-03-12')
  },
  {
    id: 'pc-5',
    name: 'EduTech Platform',
    description: 'Online learning platform for professional development',
    sector: 'Education',
    subsector: 'EdTech',
    geography: 'North America',
    website: 'https://edutech-platform.com',
    investmentDate: new Date('2023-06-12'),
    initialInvestment: 15000000,
    totalInvestment: 15000000,
    currentValuation: 18000000,
    investmentStage: InvestmentStage.SERIES_A,
    investmentType: InvestmentType.PRIMARY,
    ownershipPercentage: 20.0,
    boardSeats: 1,
    irr: 15.3,
    moic: 1.2,
    unrealizedGain: 3000000,
    status: CompanyStatus.ACTIVE,
    riskRating: RiskLevel.MEDIUM,
    esgScore: 85.5,
    environmentalScore: 88.0,
    socialScore: 87.5,
    governanceScore: 81.0,
    esgRating: ESGRating.B_PLUS,
    lastRevenue: 12500000,
    lastEbitda: 2800000,
    employeeCount: 95,
    customerCount: 45000,
    createdAt: new Date('2023-06-12'),
    updatedAt: new Date('2024-03-25')
  }
];

// Mock Portfolio Analytics Data
const mockPortfolioAnalytics: PortfolioAnalytics = {
  id: 'pa-1',
  analysisDate: new Date('2024-03-31'),
  analysisType: 'PORTFOLIO_OVERVIEW',
  totalInvestments: 5,
  totalCommittedCapital: 190000000,
  totalInvestedCapital: 215000000,
  totalCurrentValue: 275000000,
  portfolioIRR: 19.8,
  portfolioMOIC: 1.28,
  portfolioDPI: 0.14,
  portfolioRVPI: 1.14,
  portfolioTVPI: 1.28,
  sectorAllocation: [
    { sector: 'Technology', percentage: 35, value: 96250000 },
    { sector: 'Healthcare', percentage: 31, value: 85250000 },
    { sector: 'Energy', percentage: 26, value: 71500000 },
    { sector: 'Financial Services', percentage: 24, value: 65000000 },
    { sector: 'Education', percentage: 7, value: 18000000 }
  ],
  sectorPerformance: [
    { sector: 'Healthcare', irr: 28.7, moic: 1.55 },
    { sector: 'Technology', irr: 22.4, moic: 1.4 },
    { sector: 'Education', irr: 15.3, moic: 1.2 },
    { sector: 'Energy', irr: -2.1, moic: 0.96 }
  ],
  geographicAllocation: [
    { region: 'North America', percentage: 55, companies: 3 },
    { region: 'Europe', percentage: 31, companies: 1 },
    { region: 'Asia Pacific', percentage: 24, companies: 1 }
  ],
  riskDistribution: [
    { level: 'Low', count: 1, percentage: 20 },
    { level: 'Medium', count: 3, percentage: 60 },
    { level: 'High', count: 1, percentage: 20 },
    { level: 'Critical', count: 0, percentage: 0 }
  ],
  esgScoreDistribution: [
    { rating: 'A+', count: 1, percentage: 20 },
    { rating: 'A', count: 1, percentage: 20 },
    { rating: 'B+', count: 2, percentage: 40 },
    { rating: 'B', count: 1, percentage: 20 }
  ],
  recommendations: [
    {
      type: 'risk_mitigation',
      priority: 'high',
      title: 'Diversify Sector Concentration',
      description: 'Technology and Healthcare represent 66% of portfolio',
      actions: ['Consider investments in other sectors', 'Review sector allocation limits']
    },
    {
      type: 'performance_optimization',
      priority: 'medium',
      title: 'Monitor GreenEnergy Solutions',
      description: 'Underperforming investment requires attention',
      actions: ['Schedule management review', 'Assess turnaround plan', 'Consider strategic options']
    }
  ],
  createdAt: new Date('2024-03-31'),
  updatedAt: new Date('2024-03-31')
};

// Mock Performance Reports
const mockPerformanceReports: PerformanceReport[] = [
  {
    id: 'pr-1',
    portfolioCompanyId: 'pc-1',
    reportType: 'QUARTERLY',
    reportPeriod: 'Q1_2024',
    revenue: 12500000,
    revenueGrowth: 18.5,
    grossProfit: 9375000,
    grossMargin: 75.0,
    ebitda: 3125000,
    ebitdaMargin: 25.0,
    netIncome: 1875000,
    customerGrowth: 22.0,
    customerRetention: 94.5,
    customerAcquisitionCost: 1250,
    lifetimeValue: 15000,
    achievements: [
      'Launched new AI module',
      'Signed 3 enterprise clients',
      'Achieved SOC 2 compliance'
    ],
    challenges: [
      'Increased customer acquisition costs',
      'Competitive pricing pressure'
    ],
    status: 'APPROVED',
    reviewedBy: 'analyst-1',
    reviewedAt: new Date('2024-04-15'),
    createdAt: new Date('2024-04-10'),
    updatedAt: new Date('2024-04-15')
  }
];

// Mock ESG Reports
const mockESGReports: ESGReport[] = [
  {
    id: 'esg-1',
    portfolioCompanyId: 'pc-1',
    reportPeriod: 'Q1_2024',
    carbonEmissions: 125.5,
    energyConsumption: 850.0,
    renewableEnergyPct: 65.0,
    wasteReduction: 15.5,
    employeeSatisfaction: 4.2,
    diversityMetrics: {
      genderDiversity: { male: 60, female: 38, nonBinary: 2, preferNotToSay: 0 },
      ethnicDiversity: { 'White': 45, 'Asian': 30, 'Hispanic': 15, 'Black': 8, 'Other': 2 },
      ageDistribution: { '20-30': 35, '31-40': 45, '41-50': 15, '51+': 5 }
    },
    trainingHours: 2400,
    safetyIncidents: 0,
    communityInvestment: 50000,
    boardIndependence: 66.7,
    complianceScore: 95.0,
    auditFindings: 2,
    overallScore: 82.5,
    improvementAreas: ['Increase renewable energy usage', 'Enhance board diversity'],
    strengths: ['Strong employee satisfaction', 'Zero safety incidents'],
    createdAt: new Date('2024-04-05'),
    updatedAt: new Date('2024-04-10')
  }
];

// Mock Risk Assessments
const mockRiskAssessments: RiskAssessment[] = [
  {
    id: 'ra-1',
    portfolioCompanyId: 'pc-1',
    assessmentDate: new Date('2024-03-31'),
    assessmentType: 'QUARTERLY',
    financialRisks: [
      {
        id: 'fr-1',
        category: 'Financial',
        title: 'Cash Flow Risk',
        description: 'Potential cash flow constraints due to rapid growth',
        likelihood: 'MEDIUM',
        impact: 'MEDIUM',
        riskScore: 6,
        status: 'MITIGATING',
        owner: 'CFO'
      }
    ],
    operationalRisks: [
      {
        id: 'or-1',
        category: 'Operational',
        title: 'Key Person Risk',
        description: 'Heavy dependence on founder CEO',
        likelihood: 'MEDIUM',
        impact: 'HIGH',
        riskScore: 8,
        status: 'IDENTIFIED',
        owner: 'Board'
      }
    ],
    overallRiskScore: 65,
    riskLevel: 'MEDIUM',
    riskTrend: 'STABLE',
    highPriorityRisks: [
      {
        id: 'or-1',
        category: 'Operational',
        title: 'Key Person Risk',
        description: 'Heavy dependence on founder CEO',
        likelihood: 'MEDIUM',
        impact: 'HIGH',
        riskScore: 8,
        status: 'IDENTIFIED'
      }
    ],
    createdAt: new Date('2024-03-31'),
    updatedAt: new Date('2024-03-31')
  }
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');
  const companyId = searchParams.get('companyId');

  try {
    switch (type) {
      case 'overview':
        return NextResponse.json({
          success: true,
          data: {
            companies: mockPortfolioCompanies,
            analytics: mockPortfolioAnalytics
          }
        });

      case 'companies':
        const filteredCompanies = companyId
          ? mockPortfolioCompanies.filter(c => c.id === companyId)
          : mockPortfolioCompanies;
        return NextResponse.json({ success: true, data: filteredCompanies });

      case 'analytics':
        return NextResponse.json({ success: true, data: mockPortfolioAnalytics });

      case 'performance-reports':
        const performanceReports = companyId
          ? mockPerformanceReports.filter(r => r.portfolioCompanyId === companyId)
          : mockPerformanceReports;
        return NextResponse.json({ success: true, data: performanceReports });

      case 'esg-reports':
        const esgReports = companyId
          ? mockESGReports.filter(r => r.portfolioCompanyId === companyId)
          : mockESGReports;
        return NextResponse.json({ success: true, data: esgReports });

      case 'risk-assessments':
        const riskAssessments = companyId
          ? mockRiskAssessments.filter(r => r.portfolioCompanyId === companyId)
          : mockRiskAssessments;
        return NextResponse.json({ success: true, data: riskAssessments });

      case 'sector-analysis':
        return NextResponse.json({
          success: true,
          data: {
            allocation: mockPortfolioAnalytics.sectorAllocation,
            performance: mockPortfolioAnalytics.sectorPerformance,
            trends: [
              { sector: 'Technology', trend: 'positive', outlook: 'Strong growth expected' },
              { sector: 'Healthcare', trend: 'positive', outlook: 'Regulatory tailwinds' },
              { sector: 'Energy', trend: 'neutral', outlook: 'Market stabilization' }
            ]
          }
        });

      case 'esg-analysis':
        return NextResponse.json({
          success: true,
          data: {
            scoreDistribution: mockPortfolioAnalytics.esgScoreDistribution,
            trends: [
              { category: 'Environmental', trend: 'improving', score: 84.2 },
              { category: 'Social', trend: 'stable', score: 87.1 },
              { category: 'Governance', trend: 'improving', score: 83.5 }
            ],
            opportunities: [
              'Carbon footprint reduction across 3 companies',
              'Board diversity enhancement needed',
              'Supply chain sustainability improvements'
            ]
          }
        });

      case 'risk-analysis':
        return NextResponse.json({
          success: true,
          data: {
            distribution: mockPortfolioAnalytics.riskDistribution,
            alerts: [
              { type: 'concentration', message: '65% allocation in Tech/Healthcare' },
              { type: 'market', message: 'Energy sector showing volatility' },
              { type: 'operational', message: 'Key person risks identified' }
            ],
            mitigation: [
              'Diversification strategy implementation',
              'Enhanced due diligence processes',
              'Risk monitoring system upgrades'
            ]
          }
        });

      default:
        return NextResponse.json({
          success: true,
          data: {
            companies: mockPortfolioCompanies,
            analytics: mockPortfolioAnalytics,
            performanceReports: mockPerformanceReports,
            esgReports: mockESGReports,
            riskAssessments: mockRiskAssessments
          }
        });
    }
  } catch (error) {
    console.error('Portfolio Management API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, type, data } = body;

    switch (action) {
      case 'generate_report':
        return NextResponse.json({
          success: true,
          message: 'Report generation initiated',
          data: {
            reportId: `report-${Date.now()}`,
            reportType: data.reportType,
            status: 'generating',
            estimatedCompletion: new Date(Date.now() + 5 * 60 * 1000) // 5 minutes
          }
        });

      case 'update_company':
        return NextResponse.json({
          success: true,
          message: 'Portfolio company updated',
          data: {
            companyId: data.companyId,
            updatedFields: data.fields,
            updatedAt: new Date()
          }
        });

      case 'create_assessment':
        return NextResponse.json({
          success: true,
          message: 'Risk assessment created',
          data: {
            assessmentId: `assessment-${Date.now()}`,
            companyId: data.companyId,
            type: data.assessmentType,
            createdAt: new Date()
          }
        });

      case 'submit_quarterly_update':
        return NextResponse.json({
          success: true,
          message: 'Quarterly update submitted',
          data: {
            updateId: `update-${Date.now()}`,
            companyId: data.companyId,
            quarter: data.quarter,
            status: 'submitted',
            submittedAt: new Date()
          }
        });

      case 'approve_report':
        return NextResponse.json({
          success: true,
          message: 'Report approved',
          data: {
            reportId: data.reportId,
            approvedBy: data.approvedBy,
            approvedAt: new Date(),
            status: 'approved'
          }
        });

      default:
        return NextResponse.json(
          { success: false, error: 'Unknown action' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Portfolio Management POST Error:', error);
    return NextResponse.json(
      { success: false, error: 'Invalid request body' },
      { status: 400 }
    );
  }
}