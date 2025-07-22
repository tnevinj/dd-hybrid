'use client'

import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useNavigationStore } from '@/stores/navigation-store'
import { 
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  LineChart,
  Activity,
  Target,
  Award,
  Calendar,
  DollarSign,
  Percent,
  Users,
  Building,
  Globe,
  Clock,
  Brain,
  Zap,
  Star,
  Eye,
  Download,
  RefreshCw,
  Filter,
  Search,
  Lightbulb,
  Sparkles,
  AlertTriangle,
  CheckCircle,
  ArrowUp,
  ArrowDown,
  Minus,
  Plus,
  FileText,
  Mail,
  Send,
  Share,
  Settings,
  Calendar as CalendarIcon,
  ChevronRight,
  ChevronDown,
  MoreHorizontal,
  Database,
  Layers,
  Briefcase
} from 'lucide-react'

interface PerformanceMetrics {
  fundId: string
  fundName: string
  vintage: number
  
  // Core performance metrics
  performance: {
    irr: {
      gross: number
      net: number
      benchmark: number
      percentile: number
    }
    multiple: {
      tvpi: number
      dpi: number
      rvpi: number
      benchmark: number
    }
    cashFlows: {
      totalCommitted: number
      totalCalled: number
      totalDistributed: number
      currentValue: number
      remainingValue: number
    }
  }
  
  // Portfolio analytics
  portfolio: {
    companiesCount: number
    activesCount: number
    realizedCount: number
    avgHoldPeriod: number
    sectorDistribution: { sector: string; percentage: number; value: number }[]
    stageDistribution: { stage: string; percentage: number; value: number }[]
    geographyDistribution: { geography: string; percentage: number; value: number }[]
  }
  
  // Comparative analysis
  benchmarking: {
    peerFunds: string[]
    industryRanking: number
    totalFundsInBenchmark: number
    outperformanceMetrics: {
      irrOutperformance: number
      multipleOutperformance: number
      topQuartile: boolean
      topDecile: boolean
    }
  }
  
  // Predictive analytics (AI)
  predictions?: {
    projectedIRR: number
    projectedMultiple: number
    exitTimeline: { companyName: string; expectedExit: Date; probability: number }[]
    riskFactors: string[]
    opportunities: string[]
    confidenceLevel: number
  }
  
  // Reporting periods
  asOfDate: Date
  reportingPeriod: 'monthly' | 'quarterly' | 'annual'
}

interface LPReport {
  id: string
  fundId: string
  fundName: string
  reportPeriod: string
  reportType: 'quarterly' | 'annual' | 'capital_call' | 'distribution' | 'special'
  status: 'draft' | 'review' | 'finalized' | 'distributed' | 'acknowledged'
  
  // Content structure
  sections: {
    executiveSummary: string
    performanceHighlights: string
    portfolioUpdates: string
    marketCommentary: string
    investmentActivity: string
    realizationActivity: string
    outlook: string
  }
  
  // Key metrics for report
  metrics: {
    netIRR: number
    tvpi: number
    dpi: number
    totalValue: number
    newInvestments: number
    realizationsValue: number
    portfolioCompaniesCount: number
  }
  
  // Distribution
  recipients: {
    lpName: string
    contactName: string
    email: string
    type: 'institutional' | 'family_office' | 'fund_of_funds' | 'sovereign'
    deliveryMethod: 'email' | 'portal' | 'physical'
  }[]
  
  // AI assistance
  aiGenerated?: {
    sections: string[]
    confidence: number
    generationTime: Date
    reviewRequired: boolean
    insights: string[]
  }
  
  // Timeline
  timeline: {
    created: Date
    dueDate: Date
    distributed?: Date
    acknowledged?: Date
  }
  
  attachments: {
    name: string
    type: string
    size: string
    category: 'financial_statements' | 'portfolio_details' | 'market_analysis' | 'legal_updates'
  }[]
}

interface MarketBenchmark {
  metric: string
  fundValue: number
  benchmarkValue: number
  percentile: number
  trend: 'outperforming' | 'in_line' | 'underperforming'
  category: 'returns' | 'risk' | 'liquidity' | 'operational'
}

interface PerformanceAlert {
  id: string
  type: 'performance' | 'compliance' | 'reporting' | 'market'
  severity: 'low' | 'medium' | 'high' | 'critical'
  title: string
  description: string
  fundId?: string
  companyId?: string
  dueDate?: Date
  actionRequired: boolean
  assignee?: string
  createdAt: Date
}

interface PerformanceAnalyticsProps {
  fundId?: string
}

export function PerformanceAnalytics({ fundId }: PerformanceAnalyticsProps) {
  const { currentMode, trackInteraction, addRecommendation } = useNavigationStore()
  const [selectedView, setSelectedView] = React.useState<'dashboard' | 'performance' | 'reports' | 'benchmarks' | 'predictive'>('dashboard')
  const [selectedTimeframe, setSelectedTimeframe] = React.useState<'ytd' | '1y' | '3y' | '5y' | 'inception'>('ytd')
  const [expandedReports, setExpandedReports] = React.useState<Set<string>>(new Set())
  const [generatingReport, setGeneratingReport] = React.useState(false)

  // Sample performance data
  const [performanceData] = React.useState<PerformanceMetrics>({
    fundId: 'fund-001',
    fundName: 'Growth Equity Fund III',
    vintage: 2021,
    performance: {
      irr: {
        gross: 28.4,
        net: 22.1,
        benchmark: 15.8,
        percentile: 85
      },
      multiple: {
        tvpi: 1.68,
        dpi: 0.42,
        rvpi: 1.26,
        benchmark: 1.45
      },
      cashFlows: {
        totalCommitted: 500000000,
        totalCalled: 285000000,
        totalDistributed: 120000000,
        currentValue: 358000000,
        remainingValue: 238000000
      }
    },
    portfolio: {
      companiesCount: 18,
      activesCount: 15,
      realizedCount: 3,
      avgHoldPeriod: 3.2,
      sectorDistribution: [
        { sector: 'Software', percentage: 45, value: 161100000 },
        { sector: 'Healthcare', percentage: 25, value: 89500000 },
        { sector: 'FinTech', percentage: 15, value: 53700000 },
        { sector: 'Consumer', percentage: 10, value: 35800000 },
        { sector: 'Industrial', percentage: 5, value: 17900000 }
      ],
      stageDistribution: [
        { stage: 'Growth', percentage: 60, value: 214800000 },
        { stage: 'Buyout', percentage: 25, value: 89500000 },
        { stage: 'Expansion', percentage: 15, value: 53700000 }
      ],
      geographyDistribution: [
        { geography: 'North America', percentage: 70, value: 250600000 },
        { geography: 'Europe', percentage: 25, value: 89500000 },
        { geography: 'Asia', percentage: 5, value: 17900000 }
      ]
    },
    benchmarking: {
      peerFunds: ['Peer Fund A', 'Peer Fund B', 'Peer Fund C'],
      industryRanking: 12,
      totalFundsInBenchmark: 45,
      outperformanceMetrics: {
        irrOutperformance: 6.3,
        multipleOutperformance: 0.23,
        topQuartile: true,
        topDecile: false
      }
    },
    predictions: {
      projectedIRR: 25.8,
      projectedMultiple: 2.8,
      exitTimeline: [
        { companyName: 'CloudTech Solutions', expectedExit: new Date('2026-03-15'), probability: 85 },
        { companyName: 'HealthTech Innovations', expectedExit: new Date('2026-09-30'), probability: 72 },
        { companyName: 'DataFlow Technologies', expectedExit: new Date('2027-06-15'), probability: 68 }
      ],
      riskFactors: ['Market volatility', 'Interest rate environment', 'Technology disruption'],
      opportunities: ['AI integration across portfolio', 'International expansion', 'Add-on acquisitions'],
      confidenceLevel: 0.82
    },
    asOfDate: new Date('2025-07-31'),
    reportingPeriod: 'quarterly'
  })

  // Sample LP reports
  const [lpReports] = React.useState<LPReport[]>([
    {
      id: 'report-001',
      fundId: 'fund-001',
      fundName: 'Growth Equity Fund III',
      reportPeriod: 'Q2 2025',
      reportType: 'quarterly',
      status: 'review',
      sections: {
        executiveSummary: 'Fund III continues to perform strongly with net IRR of 22.1% and TVPI of 1.68x, ranking in the top quartile...',
        performanceHighlights: 'Strong performance driven by technology portfolio companies with three successful exits in Q2',
        portfolioUpdates: 'Portfolio companies showing resilient growth with average revenue growth of 35% across active investments',
        marketCommentary: 'Market conditions remain favorable for growth equity with continued demand for technology solutions',
        investmentActivity: 'Completed two new investments totaling $85M in Q2: DataFlow Technologies and HealthCare Solutions',
        realizationActivity: 'Successfully exited RetailTech Platform for $165M, generating 2.1x multiple and 28% IRR',
        outlook: 'Positive outlook for remainder of 2025 with strong pipeline and favorable exit environment'
      },
      metrics: {
        netIRR: 22.1,
        tvpi: 1.68,
        dpi: 0.42,
        totalValue: 358000000,
        newInvestments: 85000000,
        realizationsValue: 165000000,
        portfolioCompaniesCount: 18
      },
      recipients: [
        {
          lpName: 'State Pension Fund',
          contactName: 'John Smith',
          email: 'j.smith@statepension.gov',
          type: 'institutional',
          deliveryMethod: 'portal'
        },
        {
          lpName: 'University Endowment',
          contactName: 'Sarah Davis',
          email: 's.davis@university.edu',
          type: 'institutional',
          deliveryMethod: 'email'
        }
      ],
      aiGenerated: {
        sections: ['marketCommentary', 'portfolioUpdates', 'outlook'],
        confidence: 0.91,
        generationTime: new Date('2025-07-25T14:30:00'),
        reviewRequired: true,
        insights: [
          'Technology sector outperformance highlighted',
          'ESG metrics integrated throughout report',
          'Competitive positioning strengthened'
        ]
      },
      timeline: {
        created: new Date('2025-07-20'),
        dueDate: new Date('2025-08-15')
      },
      attachments: [
        { name: 'Q2_2025_Financial_Statements.pdf', type: 'pdf', size: '2.1 MB', category: 'financial_statements' },
        { name: 'Portfolio_Company_Updates.xlsx', type: 'excel', size: '890 KB', category: 'portfolio_details' }
      ]
    },
    {
      id: 'report-002',
      fundId: 'fund-001',
      fundName: 'Growth Equity Fund III',
      reportPeriod: 'Annual 2024',
      reportType: 'annual',
      status: 'distributed',
      sections: {
        executiveSummary: 'Exceptional year for Fund III with strong performance across all key metrics and successful portfolio development...',
        performanceHighlights: '2024 marked a milestone year with net IRR reaching 24.3% and multiple successful exits',
        portfolioUpdates: 'Portfolio companies delivered strong operational performance with resilient growth despite market headwinds',
        marketCommentary: '2024 saw normalization of valuation multiples and increased focus on profitable growth',
        investmentActivity: 'Strategic investment approach resulted in four high-quality additions to the portfolio',
        realizationActivity: 'Record year for realizations with $280M distributed across five successful exits',
        outlook: '2025 positioned for continued success with strong portfolio foundation and favorable market dynamics'
      },
      metrics: {
        netIRR: 24.3,
        tvpi: 1.89,
        dpi: 0.65,
        totalValue: 425000000,
        newInvestments: 125000000,
        realizationsValue: 280000000,
        portfolioCompaniesCount: 16
      },
      recipients: [
        {
          lpName: 'State Pension Fund',
          contactName: 'John Smith',
          email: 'j.smith@statepension.gov',
          type: 'institutional',
          deliveryMethod: 'portal'
        }
      ],
      timeline: {
        created: new Date('2025-01-15'),
        dueDate: new Date('2025-03-31'),
        distributed: new Date('2025-03-28'),
        acknowledged: new Date('2025-04-05')
      },
      attachments: []
    }
  ])

  // Sample benchmarks
  const [benchmarks] = React.useState<MarketBenchmark[]>([
    {
      metric: 'Net IRR',
      fundValue: 22.1,
      benchmarkValue: 15.8,
      percentile: 85,
      trend: 'outperforming',
      category: 'returns'
    },
    {
      metric: 'TVPI Multiple',
      fundValue: 1.68,
      benchmarkValue: 1.45,
      percentile: 78,
      trend: 'outperforming',
      category: 'returns'
    },
    {
      metric: 'DPI Multiple',
      fundValue: 0.42,
      benchmarkValue: 0.38,
      percentile: 65,
      trend: 'outperforming',
      category: 'liquidity'
    },
    {
      metric: 'Loss Ratio',
      fundValue: 8.2,
      benchmarkValue: 12.5,
      percentile: 72,
      trend: 'outperforming',
      category: 'risk'
    },
    {
      metric: 'Time to Exit',
      fundValue: 3.2,
      benchmarkValue: 4.1,
      percentile: 68,
      trend: 'outperforming',
      category: 'operational'
    }
  ])

  // Sample alerts
  const [performanceAlerts] = React.useState<PerformanceAlert[]>([
    {
      id: 'alert-001',
      type: 'reporting',
      severity: 'high',
      title: 'Q2 LP Report Due Soon',
      description: 'Quarterly LP report for Fund III due in 5 days',
      fundId: 'fund-001',
      dueDate: new Date('2025-08-15'),
      actionRequired: true,
      assignee: 'Sarah Johnson',
      createdAt: new Date('2025-07-20')
    },
    {
      id: 'alert-002',
      type: 'performance',
      severity: 'medium',
      title: 'Portfolio Company Underperformance',
      description: 'RetailTech Platform showing declining metrics vs. plan',
      companyId: 'comp-003',
      actionRequired: true,
      createdAt: new Date('2025-07-18')
    },
    {
      id: 'alert-003',
      type: 'market',
      severity: 'low',
      title: 'Sector Valuation Update',
      description: 'SaaS valuation multiples increased 5% in Q2',
      actionRequired: false,
      createdAt: new Date('2025-07-15')
    }
  ])

  // AI recommendations
  React.useEffect(() => {
    if (currentMode.mode !== 'traditional') {
      const overdueReports = lpReports.filter(report => 
        report.status !== 'distributed' && 
        report.timeline.dueDate < new Date()
      )

      if (overdueReports.length > 0) {
        addRecommendation({
          id: `overdue-reports-${fundId}`,
          type: 'warning',
          priority: 'critical',
          title: `${overdueReports.length} Reports Overdue`,
          description: `LP reports are past due date. AI can help complete and distribute remaining reports quickly.`,
          actions: [{
            id: 'complete-reports',
            label: 'AI Complete Reports',
            action: 'AI_COMPLETE_LP_REPORTS',
            primary: true,
            estimatedTimeSaving: overdueReports.length * 300
          }],
          confidence: 0.93,
          moduleContext: 'performance',
          timestamp: new Date()
        })
      }

      // Performance insights recommendation
      if (performanceData.performance.irr.percentile > 75) {
        addRecommendation({
          id: `performance-highlight-${fundId}`,
          type: 'insight',
          priority: 'medium',
          title: 'Strong Performance to Highlight',
          description: `Fund is performing in top quartile (${performanceData.performance.irr.percentile}th percentile). Consider highlighting this in marketing materials.`,
          actions: [{
            id: 'create-performance-summary',
            label: 'Generate Performance Summary',
            action: 'GENERATE_PERFORMANCE_SUMMARY'
          }],
          confidence: 0.89,
          moduleContext: 'performance',
          timestamp: new Date()
        })
      }

      // AI reporting automation
      const draftReports = lpReports.filter(r => r.status === 'draft' || r.status === 'review')
      if (draftReports.length > 0) {
        addRecommendation({
          id: `ai-reporting-${fundId}`,
          type: 'automation',
          priority: 'high',
          title: 'AI Report Generation Available',
          description: `${draftReports.length} reports can be enhanced with AI-generated content and analysis.`,
          actions: [{
            id: 'ai-enhance-reports',
            label: 'AI Enhance Reports',
            action: 'AI_ENHANCE_REPORTS',
            estimatedTimeSaving: draftReports.length * 180
          }],
          confidence: 0.87,
          moduleContext: 'performance',
          timestamp: new Date()
        })
      }
    }
  }, [currentMode.mode, fundId, addRecommendation])

  const handleReportAction = (reportId: string, action: string) => {
    trackInteraction({
      interactionType: 'automation_approved',
      userAction: 'accepted',
      module: 'performance',
      context: {
        action,
        reportId,
        reportsCount: lpReports.length
      }
    })
  }

  const handleGenerateReport = async () => {
    setGeneratingReport(true)
    trackInteraction({
      interactionType: 'automation_approved',
      userAction: 'accepted',
      module: 'performance',
      context: {
        action: 'generate_ai_report',
        fundId: performanceData.fundId
      }
    })

    // Simulate AI processing
    setTimeout(() => {
      setGeneratingReport(false)
    }, 4000)
  }

  const toggleReportExpansion = (reportId: string) => {
    const newExpanded = new Set(expandedReports)
    if (newExpanded.has(reportId)) {
      newExpanded.delete(reportId)
    } else {
      newExpanded.add(reportId)
    }
    setExpandedReports(newExpanded)
  }

  const getStatusColor = (status: LPReport['status']) => {
    switch (status) {
      case 'draft': return 'text-gray-600 bg-gray-50'
      case 'review': return 'text-orange-600 bg-orange-50'
      case 'finalized': return 'text-blue-600 bg-blue-50'
      case 'distributed': return 'text-green-600 bg-green-50'
      case 'acknowledged': return 'text-purple-600 bg-purple-50'
    }
  }

  const getTrendColor = (trend: MarketBenchmark['trend']) => {
    switch (trend) {
      case 'outperforming': return 'text-green-600 bg-green-50'
      case 'in_line': return 'text-blue-600 bg-blue-50'
      case 'underperforming': return 'text-red-600 bg-red-50'
    }
  }

  const getTrendIcon = (trend: MarketBenchmark['trend']) => {
    switch (trend) {
      case 'outperforming': return <ArrowUp className="w-4 h-4 text-green-600" />
      case 'in_line': return <Minus className="w-4 h-4 text-blue-600" />
      case 'underperforming': return <ArrowDown className="w-4 h-4 text-red-600" />
    }
  }

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000000) {
      return `$${(amount / 1000000000).toFixed(1)}B`
    } else if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`
    } else if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(0)}K`
    }
    return `$${amount.toLocaleString()}`
  }

  const formatPercent = (value: number, decimals: number = 1) => {
    return `${value.toFixed(decimals)}%`
  }

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Performance Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-green-400">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Net IRR</span>
              <TrendingUp className="w-4 h-4 text-green-500" />
            </div>
            <div className="text-2xl font-bold text-green-600">{formatPercent(performanceData.performance.irr.net)}</div>
            <div className="text-xs text-green-600">
              +{formatPercent(performanceData.performance.irr.net - performanceData.performance.irr.benchmark, 1)} vs benchmark
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-400">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">TVPI Multiple</span>
              <BarChart3 className="w-4 h-4 text-blue-500" />
            </div>
            <div className="text-2xl font-bold text-blue-600">{performanceData.performance.multiple.tvpi.toFixed(2)}x</div>
            <div className="text-xs text-blue-600">
              {performanceData.benchmarking.outperformanceMetrics.topQuartile ? 'Top Quartile' : 'Above Median'}
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-400">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Current Value</span>
              <DollarSign className="w-4 h-4 text-purple-500" />
            </div>
            <div className="text-2xl font-bold text-purple-600">
              {formatCurrency(performanceData.performance.cashFlows.currentValue)}
            </div>
            <div className="text-xs text-purple-600">
              {performanceData.portfolio.activesCount} active companies
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-400">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Distributions</span>
              <Award className="w-4 h-4 text-orange-500" />
            </div>
            <div className="text-2xl font-bold text-orange-600">
              {formatCurrency(performanceData.performance.cashFlows.totalDistributed)}
            </div>
            <div className="text-xs text-orange-600">
              {performanceData.performance.multiple.dpi.toFixed(2)}x DPI
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Portfolio Allocation */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Sector Allocation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {performanceData.portfolio.sectorDistribution.map((sector, index) => (
                <div key={sector.sector} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ 
                        backgroundColor: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'][index % 5]
                      }}
                    />
                    <span className="text-sm">{sector.sector}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">{sector.percentage}%</div>
                    <div className="text-xs text-gray-500">{formatCurrency(sector.value)}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Stage Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {performanceData.portfolio.stageDistribution.map((stage, index) => (
                <div key={stage.stage} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ 
                        backgroundColor: ['#3B82F6', '#10B981', '#F59E0B'][index % 3]
                      }}
                    />
                    <span className="text-sm">{stage.stage}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">{stage.percentage}%</div>
                    <div className="text-xs text-gray-500">{formatCurrency(stage.value)}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Geography</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {performanceData.portfolio.geographyDistribution.map((geo, index) => (
                <div key={geo.geography} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ 
                        backgroundColor: ['#3B82F6', '#10B981', '#F59E0B'][index % 3]
                      }}
                    />
                    <span className="text-sm">{geo.geography}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">{geo.percentage}%</div>
                    <div className="text-xs text-gray-500">{formatCurrency(geo.value)}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Alerts */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Performance Alerts</CardTitle>
            <Badge variant="outline" className="text-xs">
              {performanceAlerts.filter(a => a.actionRequired).length} require action
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {performanceAlerts.slice(0, 3).map((alert) => (
              <div key={alert.id} className="flex items-center justify-between p-3 border rounded">
                <div className="flex items-center space-x-3">
                  {alert.severity === 'critical' || alert.severity === 'high' ? (
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                  ) : (
                    <Clock className="w-5 h-5 text-orange-600" />
                  )}
                  <div>
                    <h4 className="font-medium">{alert.title}</h4>
                    <p className="text-sm text-gray-600">{alert.description}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={
                    alert.severity === 'critical' ? 'bg-red-100 text-red-800' :
                    alert.severity === 'high' ? 'bg-orange-100 text-orange-800' :
                    alert.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }>
                    {alert.severity}
                  </Badge>
                  {alert.actionRequired && (
                    <Button size="sm">Action</Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderReportCard = (report: LPReport) => (
    <Card key={report.id} className={`
      transition-all duration-200 hover:shadow-md
      ${report.aiGenerated ? 'border-l-4 border-l-purple-400' : ''}
      ${report.status === 'review' ? 'border-l-4 border-l-orange-400' : ''}
    `}>
      <CardHeader 
        className="cursor-pointer"
        onClick={() => toggleReportExpansion(report.id)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <FileText className="w-5 h-5 text-blue-600" />
            <div>
              <CardTitle className="text-lg">{report.fundName}</CardTitle>
              <p className="text-sm text-gray-600">
                {report.reportType} • {report.reportPeriod} • Due: {report.timeline.dueDate.toISOString().split('T')[0]}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Badge className={`text-xs ${getStatusColor(report.status)}`}>
              {report.status.replace('_', ' ')}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {report.recipients.length} LPs
            </Badge>
            {report.aiGenerated && (
              <Badge variant="ai" className="text-xs">
                AI: {Math.round(report.aiGenerated.confidence * 100)}%
              </Badge>
            )}
            {expandedReports.has(report.id) ? 
              <ChevronDown className="w-4 h-4" /> : 
              <ChevronRight className="w-4 h-4" />
            }
          </div>
        </div>
      </CardHeader>

      {expandedReports.has(report.id) && (
        <CardContent>
          <div className="space-y-4">
            {/* Key Metrics */}
            <div>
              <h4 className="font-medium mb-3">Key Metrics</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-green-50 rounded">
                  <div className="font-bold text-green-700">{formatPercent(report.metrics.netIRR)}</div>
                  <div className="text-xs text-green-600">Net IRR</div>
                </div>
                <div className="text-center p-3 bg-blue-50 rounded">
                  <div className="font-bold text-blue-700">{report.metrics.tvpi.toFixed(2)}x</div>
                  <div className="text-xs text-blue-600">TVPI</div>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded">
                  <div className="font-bold text-purple-700">{formatCurrency(report.metrics.totalValue)}</div>
                  <div className="text-xs text-purple-600">Total Value</div>
                </div>
                <div className="text-center p-3 bg-orange-50 rounded">
                  <div className="font-bold text-orange-700">{report.metrics.portfolioCompaniesCount}</div>
                  <div className="text-xs text-orange-600">Companies</div>
                </div>
              </div>
            </div>

            {/* AI Generated Content */}
            {report.aiGenerated && currentMode.mode !== 'traditional' && (
              <div className="p-3 bg-purple-50 rounded">
                <h4 className="font-medium mb-3 text-purple-800 flex items-center">
                  <Brain className="w-4 h-4 mr-1" />
                  AI Generated Content
                  <Badge className="ml-2 text-xs bg-purple-100 text-purple-800">
                    {Math.round(report.aiGenerated.confidence * 100)}% confidence
                  </Badge>
                </h4>
                
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="font-medium text-purple-700">AI Sections:</span>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {report.aiGenerated.sections.map((section) => (
                        <Badge key={section} variant="secondary" className="text-xs">
                          {section.replace(/([A-Z])/g, ' $1').trim()}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <span className="font-medium text-purple-700">Key Insights:</span>
                    <ul className="mt-1 text-purple-600 space-y-1">
                      {report.aiGenerated.insights.map((insight, index) => (
                        <li key={index} className="text-xs">• {insight}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Report Sections */}
            <div>
              <h4 className="font-medium mb-2">Executive Summary</h4>
              <p className="text-sm text-gray-600">{report.sections.executiveSummary}</p>
            </div>

            {/* Recipients */}
            <div>
              <h4 className="font-medium mb-2">Distribution ({report.recipients.length} LPs)</h4>
              <div className="space-y-2">
                {report.recipients.slice(0, 3).map((recipient, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <div>
                      <span className="font-medium">{recipient.lpName}</span>
                      <span className="text-gray-500 ml-2">• {recipient.contactName}</span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {recipient.deliveryMethod}
                    </Badge>
                  </div>
                ))}
                {report.recipients.length > 3 && (
                  <p className="text-xs text-gray-500">+{report.recipients.length - 3} more recipients</p>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-2 pt-3 border-t">
              <Button 
                size="sm"
                onClick={() => handleReportAction(report.id, 'edit_report')}
              >
                <Edit className="w-4 h-4 mr-1" />
                Edit Report
              </Button>
              <Button variant="outline" size="sm">
                <Eye className="w-4 h-4 mr-1" />
                Preview
              </Button>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-1" />
                Export PDF
              </Button>
              <Button variant="outline" size="sm">
                <Send className="w-4 h-4 mr-1" />
                Distribute
              </Button>
              {currentMode.mode !== 'traditional' && report.status === 'draft' && (
                <Button 
                  variant="ai" 
                  size="sm"
                  onClick={() => handleReportAction(report.id, 'ai_enhance_report')}
                >
                  <Sparkles className="w-4 h-4 mr-1" />
                  AI Enhance
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  )

  const renderTraditionalView = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Performance Analytics</h2>
          <p className="text-gray-600">Monitor fund performance and generate LP reports</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Plus className="w-4 h-4 mr-2" />
            New Report
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </Button>
        </div>
      </div>

      {/* View Tabs */}
      <div className="flex space-x-4">
        {[
          { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
          { id: 'performance', label: 'Performance', icon: TrendingUp },
          { id: 'reports', label: 'LP Reports', icon: FileText },
          { id: 'benchmarks', label: 'Benchmarks', icon: Target },
          { id: 'predictive', label: 'Predictive', icon: Brain }
        ].map(({ id, label, icon: Icon }) => (
          <Button
            key={id}
            variant={selectedView === id ? 'default' : 'outline'}
            onClick={() => setSelectedView(id as any)}
            className="flex items-center"
          >
            <Icon className="w-4 h-4 mr-2" />
            {label}
          </Button>
        ))}
      </div>

      {/* View Content */}
      {selectedView === 'dashboard' && renderDashboard()}
      
      {selectedView === 'reports' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">LP Reports ({lpReports.length})</h3>
            <Button onClick={handleGenerateReport}>
              <Plus className="w-4 h-4 mr-2" />
              Generate Report
            </Button>
          </div>
          <div className="space-y-4">
            {lpReports.map(renderReportCard)}
          </div>
        </div>
      )}

      {selectedView === 'benchmarks' && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Market Benchmarks</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {benchmarks.map((benchmark) => (
              <Card key={benchmark.metric}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium">{benchmark.metric}</h4>
                    {getTrendIcon(benchmark.trend)}
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Fund Value:</span>
                      <span className="font-medium">
                        {benchmark.metric.includes('IRR') || benchmark.metric.includes('Ratio') ? 
                          formatPercent(benchmark.fundValue) : 
                          benchmark.fundValue.toFixed(2)
                        }
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Benchmark:</span>
                      <span>
                        {benchmark.metric.includes('IRR') || benchmark.metric.includes('Ratio') ? 
                          formatPercent(benchmark.benchmarkValue) : 
                          benchmark.benchmarkValue.toFixed(2)
                        }
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Percentile:</span>
                      <Badge className={getTrendColor(benchmark.trend)}>
                        {benchmark.percentile}th
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {selectedView === 'predictive' && performanceData.predictions && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Predictive Analytics</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Brain className="w-5 h-5 mr-2 text-purple-500" />
                  Performance Projections
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Projected IRR:</span>
                    <span className="font-medium">{formatPercent(performanceData.predictions.projectedIRR)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Projected Multiple:</span>
                    <span className="font-medium">{performanceData.predictions.projectedMultiple.toFixed(2)}x</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Confidence Level:</span>
                    <Badge variant="ai" className="text-xs">
                      {Math.round(performanceData.predictions.confidenceLevel * 100)}%
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Exit Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {performanceData.predictions.exitTimeline.map((exit) => (
                    <div key={exit.companyName} className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-sm">{exit.companyName}</div>
                        <div className="text-xs text-gray-500">{exit.expectedExit.toISOString().split('T')[0]}</div>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {exit.probability}% prob
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  )

  const renderAssistedView = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold flex items-center">
            <Brain className="w-5 h-5 mr-2 text-purple-500" />
            AI Performance Analytics
            <Badge variant="ai" className="ml-3">Smart Reporting</Badge>
          </h2>
          <p className="text-gray-600">AI-powered performance analysis and automated reporting</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button 
            onClick={handleGenerateReport}
            disabled={generatingReport}
            variant="ai"
          >
            {generatingReport ? (
              <Clock className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4 mr-2" />
            )}
            AI Generate Report
          </Button>
          <Button variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh Analytics
          </Button>
        </div>
      </div>

      {/* AI Analytics Summary */}
      <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-blue-50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Brain className="w-6 h-6 text-purple-600" />
              <div>
                <h3 className="font-semibold text-purple-800">AI Performance Intelligence</h3>
                <p className="text-sm text-purple-600">
                  Real-time analysis with {Math.round(performanceData.predictions?.confidenceLevel! * 100)}% confidence in projections
                </p>
              </div>
            </div>
            <Badge variant="ai">Live Analytics</Badge>
          </div>
          
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {formatPercent(performanceData.predictions?.projectedIRR || 0)}
              </div>
              <div className="text-sm text-gray-600">Projected IRR</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {lpReports.filter(r => r.aiGenerated).length}
              </div>
              <div className="text-sm text-gray-600">AI Generated Reports</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {performanceData.performance.irr.percentile}th
              </div>
              <div className="text-sm text-gray-600">Performance Percentile</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {performanceData.predictions?.exitTimeline.length || 0}
              </div>
              <div className="text-sm text-gray-600">Predicted Exits</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Report Generation Status */}
      {generatingReport && (
        <Card className="border-purple-200 bg-purple-50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Clock className="w-5 h-5 text-purple-600 animate-spin" />
              <div>
                <h3 className="font-semibold text-purple-800">AI Report Generation in Progress</h3>
                <p className="text-sm text-purple-600">
                  Analyzing performance data, generating insights, and creating comprehensive LP report...
                </p>
              </div>
            </div>
            <div className="mt-2 bg-purple-200 rounded-full h-2">
              <div className="bg-purple-600 h-2 rounded-full animate-pulse" style={{ width: '65%' }} />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Include traditional view with AI enhancements */}
      {renderTraditionalView()}
    </div>
  )

  const renderAutonomousView = () => (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start space-x-4">
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
              <BarChart3 className="w-4 h-4 text-purple-600" />
            </div>
            <div className="flex-1">
              <div className="bg-purple-50 rounded-lg p-4 mb-4">
                <p className="text-sm mb-2">
                  <strong>Performance Analysis Complete:</strong> Fund is performing in top quartile with {formatPercent(performanceData.performance.irr.net)} net IRR.
                </p>
                <p className="text-sm">
                  Generated {lpReports.filter(r => r.aiGenerated).length} AI-powered reports with {lpReports.filter(r => r.status === 'distributed').length} successfully distributed to LPs.
                </p>
              </div>

              {/* Key Performance Insights */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                <h4 className="font-medium text-green-800 mb-3 flex items-center">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Strong Performance Highlights
                </h4>
                <div className="space-y-2 text-sm text-green-700">
                  <div>• Outperforming benchmark by {formatPercent(performanceData.performance.irr.net - performanceData.performance.irr.benchmark)}</div>
                  <div>• Top quartile ranking across all key metrics</div>
                  <div>• {formatCurrency(performanceData.performance.cashFlows.totalDistributed)} distributed to date</div>
                  <div>• {performanceData.portfolio.activesCount} strong portfolio companies remaining</div>
                </div>
              </div>

              {/* Upcoming Actions */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-800 mb-3 flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  AI-Managed Reporting Schedule
                </h4>
                <div className="space-y-2 text-sm text-blue-700">
                  <div>• Q3 LP reports scheduled for auto-generation on Aug 1st</div>
                  <div>• Performance benchmarking updated monthly</div>
                  <div>• Predictive analytics refreshed weekly</div>
                  <div>• LP distribution notifications automated</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  return (
    <div className="p-6">
      {currentMode.mode === 'traditional' && renderTraditionalView()}
      {currentMode.mode === 'assisted' && renderAssistedView()}
      {currentMode.mode === 'autonomous' && renderAutonomousView()}
    </div>
  )
}