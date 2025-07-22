'use client'

import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useNavigationStore } from '@/stores/navigation-store'
import { 
  TrendingUp,
  TrendingDown,
  Minus,
  Building,
  DollarSign,
  Percent,
  Calendar,
  Users,
  Target,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  Brain,
  Zap,
  Eye,
  Edit,
  Download,
  Filter,
  Search,
  RefreshCw,
  Lightbulb,
  Sparkles,
  BarChart3,
  PieChart,
  LineChart,
  ArrowUp,
  ArrowDown,
  Plus,
  Star,
  Award,
  Globe,
  MapPin,
  Briefcase,
  ChevronRight,
  ChevronDown,
  MoreHorizontal
} from 'lucide-react'

interface PortfolioCompany {
  id: string
  name: string
  sector: string
  subsector?: string
  geography: string
  investmentDate: Date
  investmentStage: 'seed' | 'series_a' | 'series_b' | 'series_c' | 'growth' | 'buyout'
  
  // Investment details
  investment: {
    totalInvested: number
    ownershipPercent: number
    currentValuation: number
    lastRoundValuation?: number
    fundOwnership?: number
  }
  
  // Financial performance
  financials: {
    revenue: number
    revenueGrowth: number
    ebitda: number
    ebitdaMargin: number
    burnRate?: number
    runway?: number // months
    employees: number
    customers?: number
  }
  
  // Performance metrics
  performance: {
    irr: number
    multiple: number
    tvpi: number
    dpi: number
    performanceRank: 'outperforming' | 'meeting' | 'underperforming' | 'distressed'
    lastReportDate: Date
  }
  
  // Status and flags
  status: {
    healthScore: number // 0-100
    riskLevel: 'low' | 'medium' | 'high' | 'critical'
    nextMilestone?: string
    upcomingEvents: string[]
    boardMeetingDate?: Date
  }
  
  // AI insights
  aiInsights?: {
    outlook: 'positive' | 'neutral' | 'concerning' | 'critical'
    keyTrends: string[]
    recommendations: string[]
    riskFactors: string[]
    opportunities: string[]
  }
}

interface PortfolioAlert {
  id: string
  companyId: string
  companyName: string
  type: 'performance' | 'compliance' | 'market' | 'operational' | 'financial'
  severity: 'low' | 'medium' | 'high' | 'critical'
  title: string
  description: string
  actionRequired: boolean
  dueDate?: Date
  assignee?: string
  createdAt: Date
}

interface PortfolioManagementProps {
  fundId?: string
}

export function PortfolioManagement({ fundId }: PortfolioManagementProps) {
  const { currentMode, trackInteraction, addRecommendation } = useNavigationStore()
  const [selectedView, setSelectedView] = React.useState<'overview' | 'companies' | 'performance' | 'alerts'>('overview')
  const [selectedCompany, setSelectedCompany] = React.useState<string | null>(null)
  const [expandedCompanies, setExpandedCompanies] = React.useState<Set<string>>(new Set())
  const [filterSector, setFilterSector] = React.useState<string>('all')

  // Sample portfolio data
  const [portfolioCompanies] = React.useState<PortfolioCompany[]>([
    {
      id: 'comp-001',
      name: 'CloudTech Solutions',
      sector: 'Software',
      subsector: 'SaaS - Enterprise',
      geography: 'North America',
      investmentDate: new Date('2022-03-15'),
      investmentStage: 'series_b',
      investment: {
        totalInvested: 25000000,
        ownershipPercent: 18.5,
        currentValuation: 180000000,
        lastRoundValuation: 150000000,
        fundOwnership: 15.2
      },
      financials: {
        revenue: 14200000,
        revenueGrowth: 47,
        ebitda: 2840000,
        ebitdaMargin: 20,
        burnRate: 850000,
        runway: 18,
        employees: 89,
        customers: 156
      },
      performance: {
        irr: 42.3,
        multiple: 2.88,
        tvpi: 2.88,
        dpi: 0.0,
        performanceRank: 'outperforming',
        lastReportDate: new Date('2025-07-15')
      },
      status: {
        healthScore: 85,
        riskLevel: 'low',
        nextMilestone: 'Series C fundraising Q4 2025',
        upcomingEvents: ['Board meeting - Jul 30', 'Series C prep - Aug 15'],
        boardMeetingDate: new Date('2025-07-30')
      },
      aiInsights: {
        outlook: 'positive',
        keyTrends: ['Strong ARR growth', 'Expanding enterprise accounts', 'Improving unit economics'],
        recommendations: ['Support Series C preparation', 'Explore strategic partnerships', 'Focus on international expansion'],
        riskFactors: ['Increased competition in CRM space', 'Customer concentration in top 5 accounts'],
        opportunities: ['AI product integration', 'Vertical SaaS expansion', 'European market entry']
      }
    },
    {
      id: 'comp-002',
      name: 'HealthTech Innovations',
      sector: 'Healthcare',
      subsector: 'Digital Health',
      geography: 'North America',
      investmentDate: new Date('2023-01-22'),
      investmentStage: 'series_a',
      investment: {
        totalInvested: 12000000,
        ownershipPercent: 22.3,
        currentValuation: 75000000,
        lastRoundValuation: 55000000
      },
      financials: {
        revenue: 5800000,
        revenueGrowth: 89,
        ebitda: -1200000,
        ebitdaMargin: -21,
        burnRate: 650000,
        runway: 14,
        employees: 45,
        customers: 89
      },
      performance: {
        irr: 35.8,
        multiple: 1.38,
        tvpi: 1.38,
        dpi: 0.0,
        performanceRank: 'meeting',
        lastReportDate: new Date('2025-07-10')
      },
      status: {
        healthScore: 72,
        riskLevel: 'medium',
        nextMilestone: 'FDA approval Q2 2026',
        upcomingEvents: ['Clinical trial results - Aug 5', 'Regulatory review - Sep 1'],
        boardMeetingDate: new Date('2025-08-05')
      },
      aiInsights: {
        outlook: 'neutral',
        keyTrends: ['Strong user adoption', 'Regulatory progress on track', 'Increasing healthcare partnerships'],
        recommendations: ['Monitor burn rate closely', 'Prepare Series B runway', 'Accelerate regulatory approval'],
        riskFactors: ['Regulatory approval uncertainty', 'Competition from big tech', 'Talent retention in key roles'],
        opportunities: ['Medicare reimbursement pathway', 'Hospital system partnerships', 'International expansion post-approval']
      }
    },
    {
      id: 'comp-003',
      name: 'RetailTech Platform',
      sector: 'Retail',
      subsector: 'E-commerce Technology',
      geography: 'North America',
      investmentDate: new Date('2021-06-10'),
      investmentStage: 'growth',
      investment: {
        totalInvested: 35000000,
        ownershipPercent: 15.8,
        currentValuation: 165000000,
        lastRoundValuation: 220000000
      },
      financials: {
        revenue: 18500000,
        revenueGrowth: 12,
        ebitda: 2200000,
        ebitdaMargin: 12,
        employees: 167,
        customers: 245
      },
      performance: {
        irr: -8.2,
        multiple: 0.74,
        tvpi: 0.74,
        dpi: 0.0,
        performanceRank: 'underperforming',
        lastReportDate: new Date('2025-07-18')
      },
      status: {
        healthScore: 45,
        riskLevel: 'high',
        nextMilestone: 'Turnaround plan execution Q3 2025',
        upcomingEvents: ['Strategic review - Jul 25', 'Cost reduction plan - Aug 1'],
        boardMeetingDate: new Date('2025-07-25')
      },
      aiInsights: {
        outlook: 'concerning',
        keyTrends: ['Slowing growth trajectory', 'Margin compression', 'Competitive pressure from Amazon'],
        recommendations: ['Implement cost reduction plan', 'Consider strategic alternatives', 'Focus on core profitable segments'],
        riskFactors: ['Market share loss', 'Management team turnover', 'Funding gap potential'],
        opportunities: ['Niche market focus', 'Technology licensing', 'Acquisition by strategic buyer']
      }
    },
    {
      id: 'comp-004',
      name: 'FinTech Startup',
      sector: 'Financial Services',
      subsector: 'FinTech - Payments',
      geography: 'Europe',
      investmentDate: new Date('2023-08-14'),
      investmentStage: 'seed',
      investment: {
        totalInvested: 8000000,
        ownershipPercent: 25.0,
        currentValuation: 42000000,
        lastRoundValuation: 32000000
      },
      financials: {
        revenue: 2400000,
        revenueGrowth: 145,
        ebitda: -1800000,
        ebitdaMargin: -75,
        burnRate: 450000,
        runway: 16,
        employees: 28,
        customers: 1250
      },
      performance: {
        irr: 67.2,
        multiple: 1.31,
        tvpi: 1.31,
        dpi: 0.0,
        performanceRank: 'outperforming',
        lastReportDate: new Date('2025-07-12')
      },
      status: {
        healthScore: 78,
        riskLevel: 'medium',
        nextMilestone: 'Series A fundraising Q4 2025',
        upcomingEvents: ['Product launch EU - Aug 10', 'Series A prep - Sep 15'],
        boardMeetingDate: new Date('2025-08-10')
      },
      aiInsights: {
        outlook: 'positive',
        keyTrends: ['Rapid user growth', 'Strong product-market fit', 'Expanding European presence'],
        recommendations: ['Support Series A fundraising', 'Expand team in key markets', 'Accelerate product development'],
        riskFactors: ['Regulatory compliance across EU', 'Competition from neobanks', 'Talent acquisition costs'],
        opportunities: ['B2B product extension', 'Partnership with traditional banks', 'US market expansion']
      }
    }
  ])

  // Sample alerts
  const [portfolioAlerts] = React.useState<PortfolioAlert[]>([
    {
      id: 'alert-001',
      companyId: 'comp-003',
      companyName: 'RetailTech Platform',
      type: 'performance',
      severity: 'high',
      title: 'Revenue Growth Declining',
      description: 'Q2 growth dropped to 12%, significantly below 25% target',
      actionRequired: true,
      dueDate: new Date('2025-07-25'),
      assignee: 'Sarah Johnson',
      createdAt: new Date('2025-07-20')
    },
    {
      id: 'alert-002',
      companyId: 'comp-002',
      companyName: 'HealthTech Innovations',
      type: 'financial',
      severity: 'medium',
      title: 'Runway Below 18 Months',
      description: 'Current burn rate will deplete cash in 14 months',
      actionRequired: true,
      dueDate: new Date('2025-08-01'),
      assignee: 'Mike Chen',
      createdAt: new Date('2025-07-18')
    },
    {
      id: 'alert-003',
      companyId: 'comp-001',
      companyName: 'CloudTech Solutions',
      type: 'market',
      severity: 'low',
      title: 'New Competitor Announcement',
      description: 'Salesforce announced competing product at conference',
      actionRequired: false,
      createdAt: new Date('2025-07-19')
    }
  ])

  // AI recommendations
  React.useEffect(() => {
    if (currentMode.mode !== 'traditional') {
      const underperformingCompanies = portfolioCompanies.filter(c => 
        c.performance.performanceRank === 'underperforming' || c.status.riskLevel === 'high'
      )

      if (underperformingCompanies.length > 0) {
        addRecommendation({
          id: `portfolio-underperforming-${fundId}`,
          type: 'warning',
          priority: 'critical',
          title: `${underperformingCompanies.length} Companies Need Attention`,
          description: `Portfolio companies require immediate review and potential intervention. AI has identified specific action items for each.`,
          actions: [{
            id: 'review-underperforming',
            label: 'Review Action Plans',
            action: 'REVIEW_UNDERPERFORMING_COMPANIES',
            primary: true
          }, {
            id: 'generate-turnaround-plan',
            label: 'Generate Turnaround Plans',
            action: 'GENERATE_TURNAROUND_PLANS'
          }],
          confidence: 0.92,
          moduleContext: 'portfolio',
          timestamp: new Date()
        })
      }

      // Optimization opportunities
      const optimizationOps = portfolioCompanies.filter(c => c.aiInsights?.opportunities.length).length
      if (optimizationOps > 0) {
        addRecommendation({
          id: `portfolio-optimization-${fundId}`,
          type: 'suggestion',
          priority: 'medium',
          title: 'Portfolio Optimization Opportunities',
          description: `AI identified ${optimizationOps} companies with growth acceleration opportunities and value creation potential.`,
          actions: [{
            id: 'review-opportunities',
            label: 'Review Opportunities',
            action: 'REVIEW_PORTFOLIO_OPPORTUNITIES'
          }],
          confidence: 0.87,
          moduleContext: 'portfolio',
          timestamp: new Date()
        })
      }

      // Fundraising preparation
      const fundraisingCompanies = portfolioCompanies.filter(c => 
        c.status.nextMilestone?.includes('fundraising') || c.financials.runway! < 18
      )
      
      if (fundraisingCompanies.length > 0) {
        addRecommendation({
          id: `fundraising-prep-${fundId}`,
          type: 'automation',
          priority: 'high',
          title: `${fundraisingCompanies.length} Companies Need Fundraising Support`,
          description: 'AI can prepare investor materials, identify potential lead investors, and create fundraising timelines.',
          actions: [{
            id: 'prepare-fundraising',
            label: 'Prepare Materials',
            action: 'PREPARE_FUNDRAISING_MATERIALS',
            primary: true,
            estimatedTimeSaving: 160
          }],
          confidence: 0.89,
          moduleContext: 'portfolio',
          timestamp: new Date()
        })
      }
    }
  }, [currentMode.mode, fundId, addRecommendation])

  const handleCompanyAction = (companyId: string, action: string) => {
    trackInteraction({
      interactionType: 'automation_approved',
      userAction: 'accepted',
      module: 'portfolio',
      context: {
        action,
        companyId,
        companiesCount: portfolioCompanies.length
      }
    })
  }

  const toggleCompanyExpansion = (companyId: string) => {
    const newExpanded = new Set(expandedCompanies)
    if (newExpanded.has(companyId)) {
      newExpanded.delete(companyId)
    } else {
      newExpanded.add(companyId)
    }
    setExpandedCompanies(newExpanded)
  }

  const getPerformanceIcon = (rank: PortfolioCompany['performance']['performanceRank']) => {
    switch (rank) {
      case 'outperforming': return <TrendingUp className="w-4 h-4 text-green-600" />
      case 'meeting': return <Minus className="w-4 h-4 text-blue-600" />
      case 'underperforming': return <TrendingDown className="w-4 h-4 text-orange-600" />
      case 'distressed': return <AlertTriangle className="w-4 h-4 text-red-600" />
    }
  }

  const getPerformanceColor = (rank: PortfolioCompany['performance']['performanceRank']) => {
    switch (rank) {
      case 'outperforming': return 'text-green-600 bg-green-50 border-green-200'
      case 'meeting': return 'text-blue-600 bg-blue-50 border-blue-200'
      case 'underperforming': return 'text-orange-600 bg-orange-50 border-orange-200'
      case 'distressed': return 'text-red-600 bg-red-50 border-red-200'
    }
  }

  const getRiskLevelColor = (level: 'low' | 'medium' | 'high' | 'critical') => {
    switch (level) {
      case 'low': return 'text-green-700 bg-green-100'
      case 'medium': return 'text-yellow-700 bg-yellow-100'
      case 'high': return 'text-orange-700 bg-orange-100'
      case 'critical': return 'text-red-700 bg-red-100'
    }
  }

  const getOutlookColor = (outlook?: string) => {
    switch (outlook) {
      case 'positive': return 'text-green-700 bg-green-100'
      case 'neutral': return 'text-blue-700 bg-blue-100'
      case 'concerning': return 'text-orange-700 bg-orange-100'
      case 'critical': return 'text-red-700 bg-red-100'
      default: return 'text-gray-700 bg-gray-100'
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

  const formatPercent = (value: number) => {
    return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`
  }

  const portfolioStats = {
    totalInvested: portfolioCompanies.reduce((sum, company) => sum + company.investment.totalInvested, 0),
    currentValue: portfolioCompanies.reduce((sum, company) => sum + (company.investment.totalInvested * company.performance.multiple), 0),
    totalRevenue: portfolioCompanies.reduce((sum, company) => sum + company.financials.revenue, 0),
    avgIRR: portfolioCompanies.reduce((sum, company) => sum + company.performance.irr, 0) / portfolioCompanies.length,
    avgMultiple: portfolioCompanies.reduce((sum, company) => sum + company.performance.multiple, 0) / portfolioCompanies.length,
    companiesCount: portfolioCompanies.length,
    outperforming: portfolioCompanies.filter(c => c.performance.performanceRank === 'outperforming').length,
    underperforming: portfolioCompanies.filter(c => c.performance.performanceRank === 'underperforming').length
  }

  const sectors = ['all', ...new Set(portfolioCompanies.map(c => c.sector))]
  const filteredCompanies = filterSector === 'all' ? portfolioCompanies : portfolioCompanies.filter(c => c.sector === filterSector)

  const renderPortfolioOverview = () => (
    <div className="space-y-6">
      {/* Portfolio Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{formatCurrency(portfolioStats.totalInvested)}</div>
            <div className="text-sm text-gray-600">Total Invested</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{formatCurrency(portfolioStats.currentValue)}</div>
            <div className="text-sm text-gray-600">Current Value</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">{portfolioStats.avgIRR.toFixed(1)}%</div>
            <div className="text-sm text-gray-600">Avg IRR</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">{portfolioStats.avgMultiple.toFixed(2)}x</div>
            <div className="text-sm text-gray-600">Avg Multiple</div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4 text-center">
            <div className="p-4 bg-green-50 rounded">
              <div className="text-3xl font-bold text-green-600">{portfolioStats.outperforming}</div>
              <div className="text-sm text-green-700">Outperforming</div>
            </div>
            <div className="p-4 bg-blue-50 rounded">
              <div className="text-3xl font-bold text-blue-600">
                {portfolioCompanies.filter(c => c.performance.performanceRank === 'meeting').length}
              </div>
              <div className="text-sm text-blue-700">Meeting Targets</div>
            </div>
            <div className="p-4 bg-orange-50 rounded">
              <div className="text-3xl font-bold text-orange-600">{portfolioStats.underperforming}</div>
              <div className="text-sm text-orange-700">Underperforming</div>
            </div>
            <div className="p-4 bg-red-50 rounded">
              <div className="text-3xl font-bold text-red-600">
                {portfolioCompanies.filter(c => c.performance.performanceRank === 'distressed').length}
              </div>
              <div className="text-sm text-red-700">Distressed</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Alerts */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recent Alerts</CardTitle>
            <Button variant="outline" size="sm" onClick={() => setSelectedView('alerts')}>
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {portfolioAlerts.slice(0, 3).map((alert) => (
              <div key={alert.id} className="flex items-center justify-between p-3 border rounded">
                <div className="flex items-center space-x-3">
                  {alert.severity === 'critical' || alert.severity === 'high' ? (
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                  ) : (
                    <Clock className="w-5 h-5 text-orange-600" />
                  )}
                  <div>
                    <h4 className="font-medium">{alert.title}</h4>
                    <p className="text-sm text-gray-600">{alert.companyName} • {alert.createdAt.toISOString().split('T')[0]}</p>
                  </div>
                </div>
                <Badge className={getRiskLevelColor(alert.severity as any)}>
                  {alert.severity}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderCompanyCard = (company: PortfolioCompany) => (
    <Card key={company.id} className={`
      transition-all duration-200 hover:shadow-md
      ${company.aiInsights ? 'border-l-4 border-l-purple-400' : ''}
      ${company.status.riskLevel === 'high' ? 'border-l-4 border-l-red-400' : ''}
    `}>
      <CardHeader 
        className="cursor-pointer"
        onClick={() => toggleCompanyExpansion(company.id)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Building className="w-5 h-5 text-blue-600" />
            <div>
              <CardTitle className="text-lg">{company.name}</CardTitle>
              <p className="text-sm text-gray-600">
                {company.sector} • {company.geography} • {company.investmentStage.replace('_', ' ')}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Badge className={`text-sm ${getPerformanceColor(company.performance.performanceRank)}`}>
              {getPerformanceIcon(company.performance.performanceRank)}
              <span className="ml-1">{company.performance.performanceRank.replace('_', ' ')}</span>
            </Badge>
            <Badge className={`text-xs ${getRiskLevelColor(company.status.riskLevel)}`}>
              {company.status.riskLevel} risk
            </Badge>
            {company.aiInsights && (
              <Badge variant="ai" className="text-xs">
                AI
              </Badge>
            )}
            {expandedCompanies.has(company.id) ? 
              <ChevronDown className="w-4 h-4" /> : 
              <ChevronRight className="w-4 h-4" />
            }
          </div>
        </div>
      </CardHeader>

      {expandedCompanies.has(company.id) && (
        <CardContent>
          <div className="space-y-4">
            {/* Key Metrics */}
            <div>
              <h4 className="font-medium mb-3">Key Metrics</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-blue-50 rounded">
                  <div className="font-bold text-blue-700">{formatCurrency(company.investment.totalInvested)}</div>
                  <div className="text-xs text-blue-600">Invested</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded">
                  <div className="font-bold text-green-700">{company.performance.multiple.toFixed(2)}x</div>
                  <div className="text-xs text-green-600">Multiple</div>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded">
                  <div className="font-bold text-purple-700">{company.performance.irr.toFixed(1)}%</div>
                  <div className="text-xs text-purple-600">IRR</div>
                </div>
                <div className="text-center p-3 bg-orange-50 rounded">
                  <div className="font-bold text-orange-700">{company.investment.ownershipPercent.toFixed(1)}%</div>
                  <div className="text-xs text-orange-600">Ownership</div>
                </div>
              </div>
            </div>

            {/* Financial Performance */}
            <div>
              <h4 className="font-medium mb-3">Financial Performance</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                <div>
                  <span className="text-gray-600">Revenue:</span>
                  <div className="font-medium">{formatCurrency(company.financials.revenue)}</div>
                </div>
                <div>
                  <span className="text-gray-600">Growth:</span>
                  <div className={`font-medium ${company.financials.revenueGrowth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatPercent(company.financials.revenueGrowth)}
                  </div>
                </div>
                <div>
                  <span className="text-gray-600">EBITDA:</span>
                  <div className={`font-medium ${company.financials.ebitda > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(company.financials.ebitda)}
                  </div>
                </div>
                <div>
                  <span className="text-gray-600">Employees:</span>
                  <div className="font-medium">{company.financials.employees}</div>
                </div>
              </div>
            </div>

            {/* AI Insights */}
            {company.aiInsights && currentMode.mode !== 'traditional' && (
              <div className="p-3 bg-purple-50 rounded">
                <h4 className="font-medium mb-3 text-purple-800 flex items-center">
                  <Brain className="w-4 h-4 mr-1" />
                  AI Insights
                  <Badge className={`ml-2 text-xs ${getOutlookColor(company.aiInsights.outlook)}`}>
                    {company.aiInsights.outlook}
                  </Badge>
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-purple-700">Key Trends:</span>
                    <ul className="mt-1 text-purple-600 space-y-1">
                      {company.aiInsights.keyTrends.slice(0, 3).map((trend, index) => (
                        <li key={index}>• {trend}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <span className="font-medium text-purple-700">Recommendations:</span>
                    <ul className="mt-1 text-purple-600 space-y-1">
                      {company.aiInsights.recommendations.slice(0, 3).map((rec, index) => (
                        <li key={index}>• {rec}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Upcoming Events */}
            {company.status.upcomingEvents.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Upcoming Events</h4>
                <div className="space-y-1">
                  {company.status.upcomingEvents.map((event, index) => (
                    <div key={index} className="flex items-center text-sm text-gray-600">
                      <Calendar className="w-4 h-4 mr-2" />
                      {event}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex space-x-2 pt-3 border-t">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleCompanyAction(company.id, 'view_details')}
              >
                <Eye className="w-4 h-4 mr-1" />
                View Details
              </Button>
              <Button variant="outline" size="sm">
                <Edit className="w-4 h-4 mr-1" />
                Update
              </Button>
              <Button variant="outline" size="sm">
                <BarChart3 className="w-4 h-4 mr-1" />
                Analysis
              </Button>
              {currentMode.mode !== 'traditional' && company.aiInsights?.recommendations.length && (
                <Button 
                  variant="ai" 
                  size="sm"
                  onClick={() => handleCompanyAction(company.id, 'apply_ai_recommendations')}
                >
                  <Sparkles className="w-4 h-4 mr-1" />
                  Apply AI Recommendations
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
          <h2 className="text-xl font-bold">Portfolio Management</h2>
          <p className="text-gray-600">Monitor and manage portfolio company performance</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Company
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* View Tabs */}
      <div className="flex space-x-4">
        {[
          { id: 'overview', label: 'Overview', icon: BarChart3 },
          { id: 'companies', label: 'Companies', icon: Building },
          { id: 'performance', label: 'Performance', icon: TrendingUp },
          { id: 'alerts', label: 'Alerts', icon: AlertTriangle }
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
      {selectedView === 'overview' && renderPortfolioOverview()}
      
      {selectedView === 'companies' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Portfolio Companies ({filteredCompanies.length})</h3>
            <div className="flex items-center space-x-2">
              <select 
                value={filterSector} 
                onChange={(e) => setFilterSector(e.target.value)}
                className="px-3 py-1 border rounded text-sm"
              >
                {sectors.map(sector => (
                  <option key={sector} value={sector}>
                    {sector === 'all' ? 'All Sectors' : sector}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="space-y-4">
            {filteredCompanies.map(renderCompanyCard)}
          </div>
        </div>
      )}

      {selectedView === 'alerts' && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Portfolio Alerts</h3>
          <div className="space-y-4">
            {portfolioAlerts.map((alert) => (
              <Card key={alert.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {alert.severity === 'critical' || alert.severity === 'high' ? (
                        <AlertTriangle className="w-5 h-5 text-red-600" />
                      ) : (
                        <Clock className="w-5 h-5 text-orange-600" />
                      )}
                      <div>
                        <h4 className="font-medium">{alert.title}</h4>
                        <p className="text-sm text-gray-600">{alert.description}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {alert.companyName} • {alert.createdAt.toISOString().split('T')[0]}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getRiskLevelColor(alert.severity as any)}>
                        {alert.severity}
                      </Badge>
                      {alert.actionRequired && (
                        <Button size="sm">Take Action</Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
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
            AI Portfolio Management
            <Badge variant="ai" className="ml-3">Smart Insights</Badge>
          </h2>
          <p className="text-gray-600">AI-powered portfolio monitoring and optimization</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="ai">
            <Sparkles className="w-4 h-4 mr-2" />
            Generate Portfolio Report
          </Button>
          <Button variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh AI Insights
          </Button>
        </div>
      </div>

      {/* AI Portfolio Summary */}
      <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-blue-50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Brain className="w-6 h-6 text-purple-600" />
              <div>
                <h3 className="font-semibold text-purple-800">AI Portfolio Analysis</h3>
                <p className="text-sm text-purple-600">
                  Monitoring {portfolioCompanies.length} companies with real-time insights and recommendations
                </p>
              </div>
            </div>
            <Badge variant="ai">91% Confidence</Badge>
          </div>
          
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{portfolioStats.outperforming}</div>
              <div className="text-sm text-gray-600">Outperforming</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{portfolioStats.underperforming}</div>
              <div className="text-sm text-gray-600">Need Attention</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {portfolioCompanies.filter(c => c.status.nextMilestone?.includes('fundraising')).length}
              </div>
              <div className="text-sm text-gray-600">Fundraising Soon</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {portfolioCompanies.filter(c => c.aiInsights?.opportunities.length).length}
              </div>
              <div className="text-sm text-gray-600">Growth Opportunities</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Include traditional view content with AI enhancements */}
      {renderTraditionalView()}
    </div>
  )

  const renderAutonomousView = () => (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start space-x-4">
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
              <Building className="w-4 h-4 text-purple-600" />
            </div>
            <div className="flex-1">
              <div className="bg-purple-50 rounded-lg p-4 mb-4">
                <p className="text-sm mb-2">
                  <strong>Portfolio Health Check Complete:</strong> Analyzed {portfolioCompanies.length} companies and identified {portfolioStats.underperforming} requiring immediate attention.
                </p>
                <p className="text-sm">
                  Overall portfolio performing at {portfolioStats.avgIRR.toFixed(1)}% IRR with {portfolioStats.avgMultiple.toFixed(2)}x average multiple.
                </p>
              </div>

              {/* High Priority Actions */}
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <h4 className="font-medium text-red-800 mb-3 flex items-center">
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Urgent Actions Required
                </h4>
                <div className="space-y-3">
                  {portfolioCompanies
                    .filter(c => c.performance.performanceRank === 'underperforming' || c.status.riskLevel === 'high')
                    .map((company) => (
                    <div key={company.id} className="bg-white rounded p-3">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-medium">{company.name}</h5>
                        <Badge className="bg-red-100 text-red-800 text-xs">{company.status.riskLevel} risk</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{company.aiInsights?.keyTrends[0]}</p>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="destructive">Review Immediately</Button>
                        <Button size="sm" variant="outline">Schedule Board Call</Button>
                        <Button size="sm" variant="outline">Generate Turnaround Plan</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Growth Opportunities */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-medium text-green-800 mb-3 flex items-center">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Growth Acceleration Opportunities
                </h4>
                <div className="grid grid-cols-1 gap-3">
                  {portfolioCompanies
                    .filter(c => c.aiInsights?.opportunities.length)
                    .slice(0, 2)
                    .map((company) => (
                    <div key={company.id} className="bg-white rounded p-3">
                      <div className="flex justify-between items-center mb-2">
                        <h5 className="font-medium">{company.name}</h5>
                        <Badge className="bg-green-100 text-green-800 text-xs">
                          {company.performance.performanceRank}
                        </Badge>
                      </div>
                      <p className="text-sm text-green-600">{company.aiInsights?.opportunities[0]}</p>
                      <div className="flex space-x-2 mt-2">
                        <Button size="sm">Accelerate Growth</Button>
                        <Button size="sm" variant="outline">Strategic Planning</Button>
                      </div>
                    </div>
                  ))}
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