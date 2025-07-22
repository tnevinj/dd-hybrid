'use client'

import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useNavigationStore } from '@/stores/navigation-store'
import { 
  TrendingUp,
  BarChart3,
  PieChart,
  Target,
  Brain,
  Zap,
  Star,
  TrendingDown,
  Building,
  MapPin,
  Calendar,
  DollarSign,
  Users,
  Percent,
  ArrowUp,
  ArrowDown,
  Minus,
  ChevronRight,
  ChevronDown,
  Eye,
  Download,
  RefreshCw,
  Filter,
  Search,
  Lightbulb,
  Sparkles,
  AlertTriangle,
  CheckCircle,
  Activity,
  Layers,
  Globe,
  Clock,
  Award,
  LineChart,
  MoreHorizontal
} from 'lucide-react'

interface BenchmarkData {
  metric: string
  currentValue: number | string
  industryMedian: number | string
  industryTop25: number | string
  industryTop10: number | string
  unit: string
  category: 'financial' | 'operational' | 'growth' | 'efficiency' | 'risk'
  trend: 'up' | 'down' | 'stable'
  percentile: number
  interpretation: 'excellent' | 'good' | 'average' | 'below_average' | 'poor'
  significance: 'high' | 'medium' | 'low'
}

interface ComparableDeal {
  id: string
  name: string
  targetCompany: string
  acquirer: string
  sector: string
  subsector?: string
  dealType: 'acquisition' | 'growth' | 'buyout' | 'recapitalization'
  dealSize: number
  dealDate: Date
  geography: string
  
  // Financial metrics
  metrics: {
    revenue: number
    revenueGrowth: number
    ebitda: number
    ebitdaMargin: number
    netIncome?: number
    employees: number
    customers?: number
    
    // SaaS specific
    arr?: number
    nrr?: number
    cac?: number
    ltv?: number
    churn?: number
    
    // Valuation metrics
    evRevenue: number
    evEbitda: number
    priceToBook?: number
  }
  
  // Deal characteristics
  dealStructure: {
    cashPercentage: number
    stockPercentage: number
    earnoutPercentage?: number
    premium: number
  }
  
  // Performance post-deal
  performance?: {
    revenueGrowth3yr?: number
    ebitdaImprovement?: number
    marketShareGain?: number
    synergiesRealized?: number
    exitMultiple?: number
  }
  
  // Matching score
  matchScore: number
  matchingFactors: string[]
}

interface MarketIntelligence {
  sector: string
  totalMarketSize: number
  marketGrowthRate: number
  competitiveIntensity: 'low' | 'medium' | 'high'
  consolidationTrend: 'increasing' | 'stable' | 'decreasing'
  
  // Recent activity
  recentDeals: number
  avgValuationMultiple: number
  valuationTrend: 'up' | 'down' | 'stable'
  
  // Key insights
  insights: {
    topAcquirers: string[]
    hotSubsectors: string[]
    emergingThemes: string[]
    riskFactors: string[]
  }
}

interface DealComparisonBenchmarkingProps {
  projectId: string
  currentDeal?: {
    name: string
    sector: string
    revenue: number
    ebitda: number
    dealSize: number
    geography: string
  }
}

export function DealComparisonBenchmarking({ projectId, currentDeal }: DealComparisonBenchmarkingProps) {
  const { currentMode, trackInteraction, addRecommendation } = useNavigationStore()
  const [selectedTab, setSelectedTab] = React.useState<'benchmarks' | 'comparables' | 'market'>('benchmarks')
  const [expandedDeals, setExpandedDeals] = React.useState<Set<string>>(new Set())
  const [selectedMetrics, setSelectedMetrics] = React.useState<Set<string>>(new Set(['revenue', 'ebitda', 'growth']))

  // Sample benchmark data
  const [benchmarks] = React.useState<BenchmarkData[]>([
    {
      metric: 'Revenue Growth',
      currentValue: 45,
      industryMedian: 28,
      industryTop25: 42,
      industryTop10: 58,
      unit: '%',
      category: 'growth',
      trend: 'up',
      percentile: 72,
      interpretation: 'good',
      significance: 'high'
    },
    {
      metric: 'EBITDA Margin',
      currentValue: 23,
      industryMedian: 18,
      industryTop25: 25,
      industryTop10: 32,
      unit: '%',
      category: 'financial',
      trend: 'up',
      percentile: 68,
      interpretation: 'good',
      significance: 'high'
    },
    {
      metric: 'Customer Retention',
      currentValue: 96,
      industryMedian: 91,
      industryTop25: 94,
      industryTop10: 97,
      unit: '%',
      category: 'operational',
      trend: 'stable',
      percentile: 78,
      interpretation: 'good',
      significance: 'medium'
    },
    {
      metric: 'Sales Efficiency',
      currentValue: 1.4,
      industryMedian: 1.8,
      industryTop25: 2.2,
      industryTop10: 2.8,
      unit: 'x',
      category: 'efficiency',
      trend: 'down',
      percentile: 35,
      interpretation: 'below_average',
      significance: 'medium'
    },
    {
      metric: 'Employee Productivity',
      currentValue: 185000,
      industryMedian: 165000,
      industryTop25: 195000,
      industryTop10: 235000,
      unit: '$',
      category: 'operational',
      trend: 'up',
      percentile: 61,
      interpretation: 'average',
      significance: 'low'
    },
    {
      metric: 'Customer Acquisition Cost',
      currentValue: 2450,
      industryMedian: 2100,
      industryTop25: 1800,
      industryTop10: 1400,
      unit: '$',
      category: 'efficiency',
      trend: 'down',
      percentile: 28,
      interpretation: 'below_average',
      significance: 'high'
    },
    {
      metric: 'Debt to EBITDA',
      currentValue: 2.1,
      industryMedian: 2.8,
      industryTop25: 2.2,
      industryTop10: 1.8,
      unit: 'x',
      category: 'risk',
      trend: 'stable',
      percentile: 75,
      interpretation: 'good',
      significance: 'medium'
    },
    {
      metric: 'Working Capital Days',
      currentValue: 18,
      industryMedian: 25,
      industryTop25: 20,
      industryTop10: 15,
      unit: 'days',
      category: 'efficiency',
      trend: 'up',
      percentile: 72,
      interpretation: 'good',
      significance: 'low'
    }
  ])

  // Sample comparable deals
  const [comparableDeals] = React.useState<ComparableDeal[]>([
    {
      id: 'deal-001',
      name: 'CloudTech Acquisition',
      targetCompany: 'CloudTech Solutions',
      acquirer: 'Enterprise Corp',
      sector: 'Software',
      subsector: 'SaaS - Enterprise',
      dealType: 'acquisition',
      dealSize: 85000000,
      dealDate: new Date('2024-03-15'),
      geography: 'North America',
      metrics: {
        revenue: 12400000,
        revenueGrowth: 42,
        ebitda: 2850000,
        ebitdaMargin: 23,
        netIncome: 1200000,
        employees: 89,
        customers: 147,
        arr: 11800000,
        nrr: 115,
        cac: 2200,
        ltv: 24500,
        churn: 3.2,
        evRevenue: 6.9,
        evEbitda: 29.8
      },
      dealStructure: {
        cashPercentage: 75,
        stockPercentage: 20,
        earnoutPercentage: 5,
        premium: 28
      },
      performance: {
        revenueGrowth3yr: 38,
        ebitdaImprovement: 180,
        marketShareGain: 12,
        synergiesRealized: 4500000
      },
      matchScore: 0.94,
      matchingFactors: [
        'Similar revenue size (~$12M vs $14M)',
        'Comparable growth rates (42% vs 45%)',
        'Same geographic market',
        'Similar business model and metrics'
      ]
    },
    {
      id: 'deal-002',
      name: 'DataFlow Systems Buyout',
      targetCompany: 'DataFlow Systems',
      acquirer: 'Growth Capital Partners',
      sector: 'Software',
      subsector: 'SaaS - Mid-market',
      dealType: 'buyout',
      dealSize: 120000000,
      dealDate: new Date('2024-01-22'),
      geography: 'North America',
      metrics: {
        revenue: 18500000,
        revenueGrowth: 35,
        ebitda: 4200000,
        ebitdaMargin: 23,
        employees: 142,
        customers: 234,
        arr: 17200000,
        nrr: 108,
        cac: 2800,
        ltv: 28900,
        churn: 4.1,
        evRevenue: 6.5,
        evEbitda: 28.6
      },
      dealStructure: {
        cashPercentage: 85,
        stockPercentage: 15,
        premium: 24
      },
      performance: {
        revenueGrowth3yr: 31,
        ebitdaImprovement: 145,
        synergiesRealized: 2800000
      },
      matchScore: 0.87,
      matchingFactors: [
        'Similar EBITDA margins (23%)',
        'Comparable deal structure',
        'Same acquirer type (financial)'
      ]
    },
    {
      id: 'deal-003',
      name: 'InnovateSoft Growth Investment',
      targetCompany: 'InnovateSoft Inc',
      acquirer: 'TechGrowth Ventures',
      sector: 'Software',
      subsector: 'SaaS - SMB',
      dealType: 'growth',
      dealSize: 45000000,
      dealDate: new Date('2023-11-08'),
      geography: 'North America',
      metrics: {
        revenue: 8500000,
        revenueGrowth: 58,
        ebitda: 1700000,
        ebitdaMargin: 20,
        employees: 67,
        customers: 312,
        arr: 8100000,
        nrr: 118,
        cac: 1800,
        ltv: 21200,
        churn: 2.8,
        evRevenue: 5.3,
        evEbitda: 26.5
      },
      dealStructure: {
        cashPercentage: 60,
        stockPercentage: 40,
        premium: 35
      },
      matchScore: 0.79,
      matchingFactors: [
        'High growth profile (58% vs 45%)',
        'Similar customer profile (SMB focus)',
        'Growth stage investment'
      ]
    },
    {
      id: 'deal-004',
      name: 'TechScale Acquisition',
      targetCompany: 'TechScale Solutions',
      acquirer: 'MegaCorp Industries',
      sector: 'Software',
      subsector: 'SaaS - Enterprise',
      dealType: 'acquisition',
      dealSize: 195000000,
      dealDate: new Date('2024-05-12'),
      geography: 'North America',
      metrics: {
        revenue: 28500000,
        revenueGrowth: 29,
        ebitda: 6800000,
        ebitdaMargin: 24,
        employees: 201,
        customers: 89,
        arr: 26800000,
        nrr: 112,
        cac: 3200,
        ltv: 48500,
        churn: 2.1,
        evRevenue: 6.8,
        evEbitda: 28.7
      },
      dealStructure: {
        cashPercentage: 90,
        stockPercentage: 10,
        premium: 31
      },
      matchScore: 0.71,
      matchingFactors: [
        'Similar sector and business model',
        'Comparable EBITDA margins',
        'Strategic acquisition by large corp'
      ]
    }
  ])

  // Market intelligence data
  const [marketIntel] = React.useState<MarketIntelligence>({
    sector: 'SaaS Software',
    totalMarketSize: 145000000000,
    marketGrowthRate: 18.2,
    competitiveIntensity: 'high',
    consolidationTrend: 'increasing',
    recentDeals: 47,
    avgValuationMultiple: 7.2,
    valuationTrend: 'up',
    insights: {
      topAcquirers: ['Microsoft', 'Salesforce', 'ServiceNow', 'Adobe', 'Oracle'],
      hotSubsectors: ['AI/ML Tools', 'Cybersecurity', 'DevOps', 'Customer Experience'],
      emergingThemes: ['AI Integration', 'Vertical SaaS', 'API-first Architecture'],
      riskFactors: ['Interest Rate Sensitivity', 'Increased Competition', 'Customer Churn']
    }
  })

  // AI recommendations
  React.useEffect(() => {
    if (currentMode.mode !== 'traditional') {
      // Benchmark performance recommendations
      const underperformingMetrics = benchmarks.filter(b => 
        b.interpretation === 'below_average' || b.interpretation === 'poor'
      )

      if (underperformingMetrics.length > 0) {
        addRecommendation({
          id: `benchmark-improve-${projectId}`,
          type: 'insight',
          priority: 'high',
          title: `${underperformingMetrics.length} Metrics Below Industry Average`,
          description: `Key performance areas need attention: ${underperformingMetrics.map(m => m.metric).join(', ')}. Comparables show potential improvement opportunities.`,
          actions: [{
            id: 'improve-metrics',
            label: 'Create Improvement Plan',
            action: 'CREATE_IMPROVEMENT_PLAN',
            primary: true
          }, {
            id: 'benchmark-deep-dive',
            label: 'Analyze Best Practices',
            action: 'ANALYZE_BEST_PRACTICES'
          }],
          confidence: 0.89,
          moduleContext: 'due-diligence',
          timestamp: new Date()
        })
      }

      // Deal comparables insight
      const topComparables = comparableDeals.filter(deal => deal.matchScore > 0.85)
      if (topComparables.length > 0) {
        addRecommendation({
          id: `comparables-insight-${projectId}`,
          type: 'suggestion',
          priority: 'medium',
          title: `${topComparables.length} High-Match Comparable Deals`,
          description: `Found ${topComparables.length} highly similar deals with average valuation of ${topComparables.reduce((acc, deal) => acc + deal.metrics.evRevenue, 0) / topComparables.length}x revenue.`,
          actions: [{
            id: 'analyze-comparables',
            label: 'Analyze Deal Structure',
            action: 'ANALYZE_COMPARABLE_STRUCTURES'
          }],
          confidence: 0.91,
          moduleContext: 'due-diligence',
          timestamp: new Date()
        })
      }

      // Market timing recommendation
      if (marketIntel.valuationTrend === 'up') {
        addRecommendation({
          id: `market-timing-${projectId}`,
          type: 'insight',
          priority: 'medium',
          title: 'Favorable Market Conditions',
          description: `${marketIntel.sector} valuations trending up with avg multiple of ${marketIntel.avgValuationMultiple}x. Recent market activity supports timing.`,
          actions: [{
            id: 'market-analysis',
            label: 'Full Market Analysis',
            action: 'GENERATE_MARKET_ANALYSIS'
          }],
          confidence: 0.84,
          moduleContext: 'due-diligence',
          timestamp: new Date()
        })
      }
    }
  }, [currentMode.mode, projectId, addRecommendation])

  const handleAnalyzeComparables = () => {
    trackInteraction({
      interactionType: 'automation_approved',
      userAction: 'accepted',
      module: 'due-diligence',
      context: {
        action: 'analyze_comparable_deals',
        comparableCount: comparableDeals.length,
        avgMatchScore: comparableDeals.reduce((acc, deal) => acc + deal.matchScore, 0) / comparableDeals.length
      }
    })
  }

  const toggleDealExpansion = (dealId: string) => {
    const newExpanded = new Set(expandedDeals)
    if (newExpanded.has(dealId)) {
      newExpanded.delete(dealId)
    } else {
      newExpanded.add(dealId)
    }
    setExpandedDeals(newExpanded)
  }

  const getInterpretationColor = (interpretation: BenchmarkData['interpretation']) => {
    switch (interpretation) {
      case 'excellent': return 'text-green-600 bg-green-50'
      case 'good': return 'text-blue-600 bg-blue-50'
      case 'average': return 'text-yellow-600 bg-yellow-50'
      case 'below_average': return 'text-orange-600 bg-orange-50'
      case 'poor': return 'text-red-600 bg-red-50'
    }
  }

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up': return <ArrowUp className="w-4 h-4 text-green-600" />
      case 'down': return <ArrowDown className="w-4 h-4 text-red-600" />
      case 'stable': return <Minus className="w-4 h-4 text-gray-600" />
    }
  }

  const formatValue = (value: number | string, unit: string) => {
    if (typeof value === 'string') return value
    
    switch (unit) {
      case '$':
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0
        }).format(value)
      case '%':
        return `${value}%`
      case 'x':
        return `${value}x`
      case 'days':
        return `${value} days`
      default:
        return value.toString()
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

  const renderBenchmarkCard = (benchmark: BenchmarkData) => (
    <Card key={benchmark.metric} className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-medium">{benchmark.metric}</h4>
          <div className="flex items-center space-x-2">
            {getTrendIcon(benchmark.trend)}
            <Badge className={`text-xs ${getInterpretationColor(benchmark.interpretation)}`}>
              {benchmark.interpretation.replace('_', ' ')}
            </Badge>
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Current Value:</span>
            <span className="font-bold text-lg">{formatValue(benchmark.currentValue, benchmark.unit)}</span>
          </div>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Industry Median:</span>
              <span>{formatValue(benchmark.industryMedian, benchmark.unit)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Top 25%:</span>
              <span>{formatValue(benchmark.industryTop25, benchmark.unit)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Top 10%:</span>
              <span>{formatValue(benchmark.industryTop10, benchmark.unit)}</span>
            </div>
          </div>
          
          <div className="pt-2 border-t">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Percentile Rank:</span>
              <Badge variant="outline" className="text-xs">
                {benchmark.percentile}th percentile
              </Badge>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div 
                className={`h-2 rounded-full ${
                  benchmark.percentile >= 75 ? 'bg-green-500' :
                  benchmark.percentile >= 50 ? 'bg-blue-500' :
                  benchmark.percentile >= 25 ? 'bg-yellow-500' :
                  'bg-red-500'
                }`}
                style={{ width: `${benchmark.percentile}%` }}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  const renderComparableDeal = (deal: ComparableDeal) => (
    <Card key={deal.id} className={`
      transition-all duration-200 hover:shadow-md
      ${deal.matchScore > 0.9 ? 'border-l-4 border-l-green-400' : ''}
    `}>
      <CardHeader 
        className="cursor-pointer"
        onClick={() => toggleDealExpansion(deal.id)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Building className="w-5 h-5 text-blue-600" />
            <div>
              <CardTitle className="text-lg">{deal.name}</CardTitle>
              <p className="text-sm text-gray-600">
                {deal.targetCompany} • {formatCurrency(deal.dealSize)} • {deal.dealDate.getFullYear()}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Badge className={`text-sm ${
              deal.matchScore > 0.9 ? 'bg-green-100 text-green-800' :
              deal.matchScore > 0.8 ? 'bg-blue-100 text-blue-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {Math.round(deal.matchScore * 100)}% Match
            </Badge>
            <Badge variant="outline" className="text-xs">
              {deal.dealType}
            </Badge>
            {expandedDeals.has(deal.id) ? 
              <ChevronDown className="w-4 h-4" /> : 
              <ChevronRight className="w-4 h-4" />
            }
          </div>
        </div>
      </CardHeader>

      {expandedDeals.has(deal.id) && (
        <CardContent>
          <div className="space-y-4">
            {/* Key Metrics Comparison */}
            <div>
              <h4 className="font-medium mb-3">Financial Metrics</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="p-2 bg-blue-50 rounded">
                  <div className="font-bold text-blue-700">{formatCurrency(deal.metrics.revenue)}</div>
                  <div className="text-xs text-blue-600">Revenue</div>
                </div>
                <div className="p-2 bg-green-50 rounded">
                  <div className="font-bold text-green-700">{deal.metrics.revenueGrowth}%</div>
                  <div className="text-xs text-green-600">Growth</div>
                </div>
                <div className="p-2 bg-purple-50 rounded">
                  <div className="font-bold text-purple-700">{deal.metrics.ebitdaMargin}%</div>
                  <div className="text-xs text-purple-600">EBITDA Margin</div>
                </div>
                <div className="p-2 bg-orange-50 rounded">
                  <div className="font-bold text-orange-700">{deal.metrics.evRevenue}x</div>
                  <div className="text-xs text-orange-600">EV/Revenue</div>
                </div>
              </div>
            </div>

            {/* SaaS Metrics */}
            {deal.metrics.arr && (
              <div>
                <h4 className="font-medium mb-3">SaaS Metrics</h4>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-sm">
                  <div>
                    <span className="text-gray-600">ARR:</span>
                    <div className="font-medium">{formatCurrency(deal.metrics.arr)}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">NRR:</span>
                    <div className="font-medium">{deal.metrics.nrr}%</div>
                  </div>
                  <div>
                    <span className="text-gray-600">CAC:</span>
                    <div className="font-medium">{formatCurrency(deal.metrics.cac || 0)}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">LTV:</span>
                    <div className="font-medium">{formatCurrency(deal.metrics.ltv || 0)}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Churn:</span>
                    <div className="font-medium">{deal.metrics.churn}%</div>
                  </div>
                </div>
              </div>
            )}

            {/* Deal Structure */}
            <div>
              <h4 className="font-medium mb-3">Deal Structure</h4>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Cash:</span>
                  <div className="font-medium">{deal.dealStructure.cashPercentage}%</div>
                </div>
                <div>
                  <span className="text-gray-600">Stock:</span>
                  <div className="font-medium">{deal.dealStructure.stockPercentage}%</div>
                </div>
                <div>
                  <span className="text-gray-600">Premium:</span>
                  <div className="font-medium">{deal.dealStructure.premium}%</div>
                </div>
              </div>
            </div>

            {/* Matching Factors */}
            <div>
              <h4 className="font-medium mb-3">Why This Deal Matches</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                {deal.matchingFactors.map((factor, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    {factor}
                  </li>
                ))}
              </ul>
            </div>

            {/* Performance (if available) */}
            {deal.performance && (
              <div className="p-3 bg-green-50 rounded">
                <h4 className="font-medium mb-2 text-green-800">Post-Deal Performance</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm text-green-700">
                  {deal.performance.revenueGrowth3yr && (
                    <div>
                      <span className="font-medium">3yr Growth:</span> {deal.performance.revenueGrowth3yr}%
                    </div>
                  )}
                  {deal.performance.synergiesRealized && (
                    <div>
                      <span className="font-medium">Synergies:</span> {formatCurrency(deal.performance.synergiesRealized)}
                    </div>
                  )}
                  {deal.performance.marketShareGain && (
                    <div>
                      <span className="font-medium">Market Share:</span> +{deal.performance.marketShareGain}%
                    </div>
                  )}
                  {deal.performance.ebitdaImprovement && (
                    <div>
                      <span className="font-medium">EBITDA +:</span> {deal.performance.ebitdaImprovement}bps
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex space-x-2 pt-3 border-t">
              <Button variant="outline" size="sm">
                <Eye className="w-4 h-4 mr-1" />
                Full Analysis
              </Button>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-1" />
                Export Data
              </Button>
              <Button variant="outline" size="sm">
                <BarChart3 className="w-4 h-4 mr-1" />
                Side-by-Side
              </Button>
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
          <h2 className="text-xl font-bold">Deal Comparison & Benchmarking</h2>
          <p className="text-gray-600">Compare performance against industry benchmarks and similar deals</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Search className="w-4 h-4 mr-2" />
            Find More
          </Button>
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-4">
        {[
          { id: 'benchmarks', label: 'Industry Benchmarks', icon: BarChart3 },
          { id: 'comparables', label: 'Comparable Deals', icon: Building },
          { id: 'market', label: 'Market Intelligence', icon: Globe }
        ].map(({ id, label, icon: Icon }) => (
          <Button
            key={id}
            variant={selectedTab === id ? 'default' : 'outline'}
            onClick={() => setSelectedTab(id as any)}
            className="flex items-center"
          >
            <Icon className="w-4 h-4 mr-2" />
            {label}
          </Button>
        ))}
      </div>

      {/* Tab Content */}
      {selectedTab === 'benchmarks' && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Industry Benchmarks</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {benchmarks.map(renderBenchmarkCard)}
          </div>
        </div>
      )}

      {selectedTab === 'comparables' && (
        <div>
          <h3 className="text-lg font-semibold mb-4">
            Comparable Deals ({comparableDeals.length} found)
          </h3>
          <div className="space-y-4">
            {comparableDeals.map(renderComparableDeal)}
          </div>
        </div>
      )}

      {selectedTab === 'market' && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Market Intelligence</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Market Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Market Size:</span>
                    <span className="font-medium">{formatCurrency(marketIntel.totalMarketSize)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Growth Rate:</span>
                    <span className="font-medium">{marketIntel.marketGrowthRate}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Recent Deals:</span>
                    <span className="font-medium">{marketIntel.recentDeals}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Avg Multiple:</span>
                    <span className="font-medium">{marketIntel.avgValuationMultiple}x</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Key Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Top Acquirers</h4>
                    <div className="flex flex-wrap gap-1">
                      {marketIntel.insights.topAcquirers.map(acquirer => (
                        <Badge key={acquirer} variant="secondary" className="text-xs">
                          {acquirer}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Hot Subsectors</h4>
                    <div className="flex flex-wrap gap-1">
                      {marketIntel.insights.hotSubsectors.map(subsector => (
                        <Badge key={subsector} variant="outline" className="text-xs">
                          {subsector}
                        </Badge>
                      ))}
                    </div>
                  </div>
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
            AI Deal Benchmarking
            <Badge variant="ai" className="ml-3">Smart Analysis</Badge>
          </h2>
          <p className="text-gray-600">AI-powered deal comparison and market positioning analysis</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button 
            onClick={handleAnalyzeComparables}
            variant="ai"
          >
            <Zap className="w-4 h-4 mr-2" />
            Deep Analysis
          </Button>
          <Button variant="outline" size="sm">
            <Sparkles className="w-4 h-4 mr-2" />
            AI Insights
          </Button>
        </div>
      </div>

      {/* AI Analysis Summary */}
      <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-blue-50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Brain className="w-6 h-6 text-purple-600" />
              <div>
                <h3 className="font-semibold text-purple-800">AI Benchmarking Complete</h3>
                <p className="text-sm text-purple-600">
                  Analyzed {benchmarks.length} key metrics against industry data and {comparableDeals.length} comparable deals
                </p>
              </div>
            </div>
            <Badge variant="ai">93% Confidence</Badge>
          </div>
          
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {benchmarks.filter(b => b.interpretation === 'good' || b.interpretation === 'excellent').length}
              </div>
              <div className="text-sm text-gray-600">Above Average</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {Math.round(comparableDeals.reduce((acc, deal) => acc + deal.matchScore, 0) / comparableDeals.length * 100)}%
              </div>
              <div className="text-sm text-gray-600">Avg Match Score</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {marketIntel.avgValuationMultiple}x
              </div>
              <div className="text-sm text-gray-600">Market Multiple</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {Math.round(benchmarks.reduce((acc, b) => acc + b.percentile, 0) / benchmarks.length)}
              </div>
              <div className="text-sm text-gray-600">Avg Percentile</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-l-4 border-l-green-400">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Top Performers</span>
              <TrendingUp className="w-4 h-4 text-green-500" />
            </div>
            <div className="space-y-2">
              {benchmarks
                .filter(b => b.interpretation === 'excellent' || b.interpretation === 'good')
                .slice(0, 3)
                .map(benchmark => (
                <div key={benchmark.metric} className="flex justify-between text-sm">
                  <span>{benchmark.metric}</span>
                  <Badge className="bg-green-100 text-green-800 text-xs">
                    {benchmark.percentile}th
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-400">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Improvement Areas</span>
              <Target className="w-4 h-4 text-orange-500" />
            </div>
            <div className="space-y-2">
              {benchmarks
                .filter(b => b.interpretation === 'below_average' || b.interpretation === 'poor')
                .slice(0, 3)
                .map(benchmark => (
                <div key={benchmark.metric} className="flex justify-between text-sm">
                  <span>{benchmark.metric}</span>
                  <Badge className="bg-orange-100 text-orange-800 text-xs">
                    {benchmark.percentile}th
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-400">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Best Comparables</span>
              <Star className="w-4 h-4 text-blue-500" />
            </div>
            <div className="space-y-2">
              {comparableDeals
                .sort((a, b) => b.matchScore - a.matchScore)
                .slice(0, 3)
                .map(deal => (
                <div key={deal.id} className="flex justify-between text-sm">
                  <span className="truncate">{deal.targetCompany}</span>
                  <Badge className="bg-blue-100 text-blue-800 text-xs">
                    {Math.round(deal.matchScore * 100)}%
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Tab Navigation */}
      <div className="flex space-x-4">
        {[
          { id: 'benchmarks', label: 'AI Benchmarks', icon: BarChart3 },
          { id: 'comparables', label: 'Smart Comparables', icon: Building },
          { id: 'market', label: 'Market Intel', icon: Globe }
        ].map(({ id, label, icon: Icon }) => (
          <Button
            key={id}
            variant={selectedTab === id ? 'default' : 'outline'}
            onClick={() => setSelectedTab(id as any)}
            className="flex items-center"
          >
            <Icon className="w-4 h-4 mr-2" />
            {label}
            {id !== 'market' && (
              <Badge variant="ai" className="ml-2 text-xs">AI</Badge>
            )}
          </Button>
        ))}
      </div>

      {/* Enhanced Tab Content */}
      {selectedTab === 'benchmarks' && (
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <BarChart3 className="w-5 h-5 mr-2" />
            AI-Enhanced Industry Benchmarks
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {benchmarks.map(renderBenchmarkCard)}
          </div>
        </div>
      )}

      {selectedTab === 'comparables' && (
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Building className="w-5 h-5 mr-2" />
            AI-Matched Comparable Deals
          </h3>
          <div className="space-y-4">
            {comparableDeals
              .sort((a, b) => b.matchScore - a.matchScore)
              .map(renderComparableDeal)}
          </div>
        </div>
      )}

      {selectedTab === 'market' && renderTraditionalView().props.children[3].props.children[2]}
    </div>
  )

  const renderAutonomousView = () => (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start space-x-4">
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-purple-600" />
            </div>
            <div className="flex-1">
              <div className="bg-purple-50 rounded-lg p-4 mb-4">
                <p className="text-sm mb-2">
                  <strong>Benchmarking Analysis Complete:</strong> Compared {benchmarks.length} key metrics against {comparableDeals.length} similar deals.
                </p>
                <p className="text-sm">
                  Your company outperforms industry median in {benchmarks.filter(b => b.percentile > 50).length} out of {benchmarks.length} metrics.
                </p>
              </div>

              {/* Key Insights */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <h4 className="font-medium text-blue-800 mb-3 flex items-center">
                  <Lightbulb className="w-4 h-4 mr-2" />
                  Key Benchmarking Insights
                </h4>
                <div className="space-y-3">
                  <div className="bg-white rounded p-3">
                    <p className="text-sm"><strong>Valuation Position:</strong> Current metrics suggest {marketIntel.avgValuationMultiple}x revenue multiple range, aligned with recent comparables.</p>
                    <Button size="sm" className="mt-2">Apply to Model</Button>
                  </div>
                  <div className="bg-white rounded p-3">
                    <p className="text-sm"><strong>Performance Gaps:</strong> Sales efficiency and CAC metrics below industry average - prioritize go-to-market optimization.</p>
                    <Button size="sm" className="mt-2">Create Action Plan</Button>
                  </div>
                  <div className="bg-white rounded p-3">
                    <p className="text-sm"><strong>Market Timing:</strong> {marketIntel.valuationTrend === 'up' ? 'Favorable' : 'Challenging'} market conditions with {marketIntel.recentDeals} recent deals.</p>
                    <Button size="sm" className="mt-2">Market Analysis</Button>
                  </div>
                </div>
              </div>

              {/* Performance Summary */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-medium text-green-800 mb-3 flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Performance Summary
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm text-green-700">
                  <div>• Above median in {benchmarks.filter(b => b.percentile > 50).length}/{benchmarks.length} metrics</div>
                  <div>• Top quartile in {benchmarks.filter(b => b.percentile > 75).length} key areas</div>
                  <div>• {Math.round(comparableDeals.reduce((acc, deal) => acc + deal.matchScore, 0) / comparableDeals.length * 100)}% average deal similarity</div>
                  <div>• {marketIntel.avgValuationMultiple}x estimated revenue multiple</div>
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