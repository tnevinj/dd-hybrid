'use client'

import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useNavigationStore } from '@/stores/navigation-store'
import { 
  Target,
  Search,
  Building,
  TrendingUp,
  DollarSign,
  Calendar,
  Users,
  MapPin,
  Brain,
  Zap,
  Star,
  Eye,
  Edit,
  Plus,
  Filter,
  Download,
  RefreshCw,
  Lightbulb,
  Sparkles,
  AlertTriangle,
  CheckCircle,
  Clock,
  Award,
  Activity,
  BarChart3,
  PieChart,
  Globe,
  Mail,
  Phone,
  MessageSquare,
  Send,
  ChevronRight,
  ChevronDown,
  ArrowRight,
  MoreHorizontal,
  Briefcase,
  Network,
  FileText,
  Database
} from 'lucide-react'

interface DealOpportunity {
  id: string
  companyName: string
  sector: string
  subsector?: string
  geography: string
  dealType: 'acquisition' | 'growth' | 'buyout' | 'recapitalization' | 'minority'
  
  // Deal details
  dealSize: number
  estimatedValuation: number
  ownership: number
  stage: 'sourced' | 'initial_review' | 'management_meeting' | 'due_diligence' | 'negotiation' | 'closing' | 'passed'
  
  // Company financials
  financials: {
    revenue: number
    revenueGrowth: number
    ebitda: number
    ebitdaMargin: number
    employees: number
    foundedYear: number
  }
  
  // Source and contact
  source: {
    type: 'intermediary' | 'direct' | 'referral' | 'database' | 'ai_sourced'
    name: string
    relationship: string
    quality: 'high' | 'medium' | 'low'
  }
  
  contact: {
    name: string
    title: string
    email: string
    phone?: string
    lastContact?: Date
    responsiveness: 'high' | 'medium' | 'low'
  }
  
  // Deal specifics
  timeline: {
    processStart: Date
    expectedClose?: Date
    keyMilestones: { date: Date; description: string }[]
  }
  
  // Analysis
  investment: {
    targetIRR: number
    targetMultiple: number
    holdPeriod: number
    investmentThesis: string
    keyRisks: string[]
    valueCreationPlan: string[]
  }
  
  // Competitive situation
  competition: {
    processType: 'auction' | 'bilateral' | 'club_deal' | 'proprietary'
    participantCount?: number
    knownCompetitors: string[]
    competitiveAdvantage?: string[]
  }
  
  // AI insights
  aiInsights?: {
    fit: number // 0-100
    attractiveness: number // 0-100
    urgency: 'low' | 'medium' | 'high'
    marketTrends: string[]
    similarDeals: string[]
    recommendations: string[]
    riskFactors: string[]
    nextBestActions: string[]
  }
  
  // Status
  priority: 'low' | 'medium' | 'high' | 'critical'
  probability: number // 0-100
  lastUpdated: Date
  assignedTo: string
  tags: string[]
}

interface DealSource {
  id: string
  name: string
  type: 'investment_bank' | 'broker' | 'direct' | 'referral_network' | 'database' | 'ai_platform'
  quality: 'tier_1' | 'tier_2' | 'tier_3'
  relationship: 'strong' | 'developing' | 'new' | 'dormant'
  
  performance: {
    dealsIntroduced: number
    dealsCompleted: number
    avgDealSize: number
    successRate: number
    avgTimeToClose: number
  }
  
  contact: {
    primaryContact: string
    email: string
    phone?: string
    lastContact: Date
    nextFollowUp?: Date
  }
  
  focus: {
    sectors: string[]
    geographies: string[]
    dealSizes: { min: number; max: number }
    dealTypes: string[]
  }
  
  aiInsights?: {
    dealFlow: 'increasing' | 'stable' | 'decreasing'
    qualityTrend: 'improving' | 'stable' | 'declining'
    responseRate: number
    priorityLevel: 'high' | 'medium' | 'low'
    recommendations: string[]
  }
}

interface MarketIntelligence {
  sector: string
  insights: {
    dealActivity: number
    valuationTrend: 'up' | 'stable' | 'down'
    avgMultiple: number
    competitionLevel: 'low' | 'medium' | 'high'
    emerging_themes: string[]
    risk_factors: string[]
  }
}

interface DealSourcingPipelineProps {
  fundId?: string
}

export function DealSourcingPipeline({ fundId }: DealSourcingPipelineProps) {
  const { currentMode, trackInteraction, addRecommendation } = useNavigationStore()
  const [selectedView, setSelectedView] = React.useState<'pipeline' | 'sources' | 'market' | 'analytics'>('pipeline')
  const [selectedStage, setSelectedStage] = React.useState<string>('all')
  const [expandedDeals, setExpandedDeals] = React.useState<Set<string>>(new Set())
  const [filterSector, setFilterSector] = React.useState<string>('all')

  // Sample deal pipeline data
  const [dealPipeline] = React.useState<DealOpportunity[]>([
    {
      id: 'deal-001',
      companyName: 'DataFlow Technologies',
      sector: 'Software',
      subsector: 'Data Analytics',
      geography: 'North America',
      dealType: 'growth',
      dealSize: 45000000,
      estimatedValuation: 150000000,
      ownership: 30,
      stage: 'management_meeting',
      financials: {
        revenue: 18500000,
        revenueGrowth: 67,
        ebitda: 4200000,
        ebitdaMargin: 23,
        employees: 142,
        foundedYear: 2019
      },
      source: {
        type: 'intermediary',
        name: 'Goldman Sachs',
        relationship: 'Strong relationship, 8 deals completed',
        quality: 'high'
      },
      contact: {
        name: 'Jennifer Martinez',
        title: 'CEO & Founder',
        email: 'jennifer.martinez@dataflow.com',
        phone: '+1-555-0123',
        lastContact: new Date('2025-07-18'),
        responsiveness: 'high'
      },
      timeline: {
        processStart: new Date('2025-06-15'),
        expectedClose: new Date('2025-09-30'),
        keyMilestones: [
          { date: new Date('2025-07-25'), description: 'Management presentation' },
          { date: new Date('2025-08-01'), description: 'Initial offer deadline' },
          { date: new Date('2025-08-15'), description: 'Due diligence start' }
        ]
      },
      investment: {
        targetIRR: 25,
        targetMultiple: 3.2,
        holdPeriod: 5,
        investmentThesis: 'Leading data analytics platform with strong growth trajectory and expansion opportunities',
        keyRisks: ['Customer concentration', 'Competition from big tech', 'Talent retention'],
        valueCreationPlan: ['International expansion', 'Product enhancement', 'Strategic acquisitions']
      },
      competition: {
        processType: 'auction',
        participantCount: 6,
        knownCompetitors: ['KKR', 'Vista Equity', 'Thoma Bravo'],
        competitiveAdvantage: ['Industry expertise', 'Portfolio company synergies', 'Speed of execution']
      },
      aiInsights: {
        fit: 92,
        attractiveness: 88,
        urgency: 'high',
        marketTrends: ['Increasing data regulation driving demand', 'AI/ML integration accelerating', 'Cloud migration continuing'],
        similarDeals: ['Snowflake growth round 2019', 'Databricks Series G 2021'],
        recommendations: [
          'Schedule technical deep-dive with CTO',
          'Prepare comprehensive market analysis',
          'Identify portfolio company synergies'
        ],
        riskFactors: ['High valuation expectations', 'Competitive auction process', 'Key person dependency'],
        nextBestActions: [
          'Complete management meeting preparation',
          'Finalize investment committee memo',
          'Schedule customer reference calls'
        ]
      },
      priority: 'critical',
      probability: 75,
      lastUpdated: new Date('2025-07-20'),
      assignedTo: 'Sarah Johnson',
      tags: ['high-growth', 'saas', 'data-analytics', 'venture-growth']
    },
    {
      id: 'deal-002',
      companyName: 'HealthCare Solutions Inc',
      sector: 'Healthcare',
      subsector: 'Healthcare IT',
      geography: 'North America',
      dealType: 'buyout',
      dealSize: 125000000,
      estimatedValuation: 180000000,
      ownership: 70,
      stage: 'due_diligence',
      financials: {
        revenue: 28500000,
        revenueGrowth: 23,
        ebitda: 8200000,
        ebitdaMargin: 29,
        employees: 245,
        foundedYear: 2015
      },
      source: {
        type: 'direct',
        name: 'CEO Direct Outreach',
        relationship: 'New relationship through industry conference',
        quality: 'medium'
      },
      contact: {
        name: 'Dr. Michael Chen',
        title: 'CEO',
        email: 'm.chen@healthcaresolutions.com',
        lastContact: new Date('2025-07-19'),
        responsiveness: 'medium'
      },
      timeline: {
        processStart: new Date('2025-05-20'),
        expectedClose: new Date('2025-10-15'),
        keyMilestones: [
          { date: new Date('2025-08-01'), description: 'Due diligence completion' },
          { date: new Date('2025-08-15'), description: 'Final valuation' },
          { date: new Date('2025-09-01'), description: 'LOI execution' }
        ]
      },
      investment: {
        targetIRR: 22,
        targetMultiple: 2.8,
        holdPeriod: 4,
        investmentThesis: 'Market-leading healthcare IT solution with defensive characteristics and growth potential',
        keyRisks: ['Regulatory changes', 'Technology disruption', 'Customer concentration'],
        valueCreationPlan: ['Organic growth acceleration', 'Add-on acquisitions', 'Operational improvements']
      },
      competition: {
        processType: 'bilateral',
        knownCompetitors: [],
        competitiveAdvantage: ['Healthcare expertise', 'Operational support', 'Industry connections']
      },
      aiInsights: {
        fit: 85,
        attractiveness: 81,
        urgency: 'medium',
        marketTrends: ['Digital health adoption accelerating', 'Value-based care models growing', 'Telehealth integration expanding'],
        similarDeals: ['Athenahealth acquisition 2019', 'Veracyte buyout 2021'],
        recommendations: [
          'Deep dive on customer satisfaction scores',
          'Assess competitive positioning vs. Epic',
          'Evaluate technology modernization needs'
        ],
        riskFactors: ['Legacy system dependencies', 'Customer implementation complexity', 'Regulatory compliance burden'],
        nextBestActions: [
          'Complete technical due diligence',
          'Validate customer retention metrics',
          'Finalize management retention packages'
        ]
      },
      priority: 'high',
      probability: 85,
      lastUpdated: new Date('2025-07-19'),
      assignedTo: 'Mike Chen',
      tags: ['healthcare-it', 'buyout', 'defensive', 'recurring-revenue']
    },
    {
      id: 'deal-003',
      companyName: 'GreenTech Manufacturing',
      sector: 'Industrial',
      subsector: 'Clean Technology',
      geography: 'Europe',
      dealType: 'growth',
      dealSize: 35000000,
      estimatedValuation: 120000000,
      ownership: 28,
      stage: 'initial_review',
      financials: {
        revenue: 15200000,
        revenueGrowth: 89,
        ebitda: 2800000,
        ebitdaMargin: 18,
        employees: 89,
        foundedYear: 2020
      },
      source: {
        type: 'ai_sourced',
        name: 'AI Deal Discovery Platform',
        relationship: 'Algorithmic matching based on investment criteria',
        quality: 'medium'
      },
      contact: {
        name: 'Lars Andersson',
        title: 'Founder & CEO',
        email: 'lars@greentechman.com',
        responsiveness: 'high'
      },
      timeline: {
        processStart: new Date('2025-07-10'),
        keyMilestones: [
          { date: new Date('2025-07-30'), description: 'Initial screening call' },
          { date: new Date('2025-08-10'), description: 'Site visit' }
        ]
      },
      investment: {
        targetIRR: 28,
        targetMultiple: 3.5,
        holdPeriod: 5,
        investmentThesis: 'Leading clean technology solution addressing ESG mandates with strong growth potential',
        keyRisks: ['Regulatory dependency', 'Technology risk', 'Market timing'],
        valueCreationPlan: ['International expansion', 'Technology advancement', 'Strategic partnerships']
      },
      competition: {
        processType: 'proprietary',
        knownCompetitors: [],
        competitiveAdvantage: ['ESG focus alignment', 'European network', 'Technology expertise']
      },
      aiInsights: {
        fit: 78,
        attractiveness: 85,
        urgency: 'low',
        marketTrends: ['ESG investing momentum', 'EU Green Deal funding', 'Corporate sustainability mandates'],
        similarDeals: ['Beyond Meat Series C', 'Tesla growth investments'],
        recommendations: [
          'Schedule technology assessment',
          'Evaluate ESG impact metrics',
          'Assess European expansion potential'
        ],
        riskFactors: ['Early stage technology', 'Unproven scalability', 'Competitive threats from incumbents'],
        nextBestActions: [
          'Conduct initial screening call',
          'Review technical documentation',
          'Assess management team background'
        ]
      },
      priority: 'medium',
      probability: 45,
      lastUpdated: new Date('2025-07-20'),
      assignedTo: 'Alex Thompson',
      tags: ['cleantech', 'esg', 'growth', 'europe']
    }
  ])

  // Sample deal sources
  const [dealSources] = React.useState<DealSource[]>([
    {
      id: 'source-001',
      name: 'Goldman Sachs',
      type: 'investment_bank',
      quality: 'tier_1',
      relationship: 'strong',
      performance: {
        dealsIntroduced: 47,
        dealsCompleted: 8,
        avgDealSize: 125000000,
        successRate: 0.17,
        avgTimeToClose: 8.5
      },
      contact: {
        primaryContact: 'David Miller',
        email: 'david.miller@gs.com',
        phone: '+1-212-555-0001',
        lastContact: new Date('2025-07-15'),
        nextFollowUp: new Date('2025-08-01')
      },
      focus: {
        sectors: ['Technology', 'Healthcare', 'Financial Services'],
        geographies: ['North America', 'Europe'],
        dealSizes: { min: 50000000, max: 500000000 },
        dealTypes: ['buyout', 'growth', 'recapitalization']
      },
      aiInsights: {
        dealFlow: 'increasing',
        qualityTrend: 'improving',
        responseRate: 0.85,
        priorityLevel: 'high',
        recommendations: [
          'Increase frequency of updates on investment criteria',
          'Share recent success stories',
          'Schedule quarterly relationship review'
        ]
      }
    },
    {
      id: 'source-002',
      name: 'Industry Referral Network',
      type: 'referral_network',
      quality: 'tier_2',
      relationship: 'developing',
      performance: {
        dealsIntroduced: 23,
        dealsCompleted: 5,
        avgDealSize: 65000000,
        successRate: 0.22,
        avgTimeToClose: 6.2
      },
      contact: {
        primaryContact: 'Various Industry Contacts',
        email: 'referrals@network.com',
        lastContact: new Date('2025-07-10'),
        nextFollowUp: new Date('2025-07-25')
      },
      focus: {
        sectors: ['Software', 'Industrial', 'Consumer'],
        geographies: ['North America'],
        dealSizes: { min: 20000000, max: 200000000 },
        dealTypes: ['growth', 'buyout']
      },
      aiInsights: {
        dealFlow: 'stable',
        qualityTrend: 'stable',
        responseRate: 0.68,
        priorityLevel: 'medium',
        recommendations: [
          'Strengthen key industry relationships',
          'Expand referral network geographically',
          'Improve deal quality screening'
        ]
      }
    },
    {
      id: 'source-003',
      name: 'AI Deal Discovery Platform',
      type: 'ai_platform',
      quality: 'tier_2',
      relationship: 'new',
      performance: {
        dealsIntroduced: 156,
        dealsCompleted: 2,
        avgDealSize: 45000000,
        successRate: 0.01,
        avgTimeToClose: 12.3
      },
      contact: {
        primaryContact: 'Platform Support',
        email: 'support@aidiscovery.com',
        lastContact: new Date('2025-07-18')
      },
      focus: {
        sectors: ['Technology', 'Healthcare', 'FinTech'],
        geographies: ['Global'],
        dealSizes: { min: 10000000, max: 100000000 },
        dealTypes: ['growth', 'minority']
      },
      aiInsights: {
        dealFlow: 'increasing',
        qualityTrend: 'improving',
        responseRate: 0.95,
        priorityLevel: 'medium',
        recommendations: [
          'Refine AI matching criteria',
          'Improve deal quality filters',
          'Integrate with CRM for better tracking'
        ]
      }
    }
  ])

  // AI recommendations
  React.useEffect(() => {
    if (currentMode.mode !== 'traditional') {
      const highPriorityDeals = dealPipeline.filter(deal => 
        deal.priority === 'critical' || (deal.aiInsights?.urgency === 'high' && deal.probability > 70)
      )

      if (highPriorityDeals.length > 0) {
        addRecommendation({
          id: `deal-urgency-${fundId}`,
          type: 'warning',
          priority: 'critical',
          title: `${highPriorityDeals.length} High-Priority Deals Need Attention`,
          description: `Critical deals in pipeline require immediate action to maintain competitive position and meet deadlines.`,
          actions: [{
            id: 'prioritize-deals',
            label: 'Review Priority Deals',
            action: 'REVIEW_PRIORITY_DEALS',
            primary: true
          }, {
            id: 'update-pipeline',
            label: 'Update Pipeline Status',
            action: 'UPDATE_PIPELINE_STATUS'
          }],
          confidence: 0.94,
          moduleContext: 'deal-sourcing',
          timestamp: new Date()
        })
      }

      // AI sourcing opportunities
      const aiOpportunities = dealPipeline.filter(d => d.aiInsights?.fit && d.aiInsights.fit > 85).length
      if (aiOpportunities > 0) {
        addRecommendation({
          id: `ai-sourcing-${fundId}`,
          type: 'suggestion',
          priority: 'medium',
          title: 'AI Sourcing Delivering High-Quality Deals',
          description: `AI platforms have identified ${aiOpportunities} deals with >85% investment criteria fit. Consider expanding AI sourcing strategy.`,
          actions: [{
            id: 'expand-ai-sourcing',
            label: 'Expand AI Sourcing',
            action: 'EXPAND_AI_SOURCING_STRATEGY'
          }],
          confidence: 0.82,
          moduleContext: 'deal-sourcing',
          timestamp: new Date()
        })
      }

      // Pipeline optimization
      const staleDeals = dealPipeline.filter(d => {
        const daysSinceUpdate = (new Date().getTime() - d.lastUpdated.getTime()) / (1000 * 60 * 60 * 24)
        return daysSinceUpdate > 14 && d.stage !== 'passed'
      }).length

      if (staleDeals > 0) {
        addRecommendation({
          id: `pipeline-optimization-${fundId}`,
          type: 'automation',
          priority: 'medium',
          title: 'Pipeline Optimization Needed',
          description: `${staleDeals} deals haven't been updated recently. AI can help prioritize follow-ups and identify next actions.`,
          actions: [{
            id: 'optimize-pipeline',
            label: 'Optimize Pipeline',
            action: 'OPTIMIZE_DEAL_PIPELINE',
            estimatedTimeSaving: 120
          }],
          confidence: 0.78,
          moduleContext: 'deal-sourcing',
          timestamp: new Date()
        })
      }
    }
  }, [currentMode.mode, fundId, addRecommendation])

  const handleDealAction = (dealId: string, action: string) => {
    trackInteraction({
      interactionType: 'automation_approved',
      userAction: 'accepted',
      module: 'deal-sourcing',
      context: {
        action,
        dealId,
        pipelineCount: dealPipeline.length
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

  const getStageColor = (stage: DealOpportunity['stage']) => {
    switch (stage) {
      case 'sourced': return 'text-gray-600 bg-gray-50'
      case 'initial_review': return 'text-blue-600 bg-blue-50'
      case 'management_meeting': return 'text-yellow-600 bg-yellow-50'
      case 'due_diligence': return 'text-purple-600 bg-purple-50'
      case 'negotiation': return 'text-orange-600 bg-orange-50'
      case 'closing': return 'text-green-600 bg-green-50'
      case 'passed': return 'text-red-600 bg-red-50'
    }
  }

  const getPriorityColor = (priority: DealOpportunity['priority']) => {
    switch (priority) {
      case 'low': return 'text-gray-600 bg-gray-100'
      case 'medium': return 'text-blue-600 bg-blue-100'
      case 'high': return 'text-orange-600 bg-orange-100'
      case 'critical': return 'text-red-600 bg-red-100'
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

  const stages = ['all', 'sourced', 'initial_review', 'management_meeting', 'due_diligence', 'negotiation', 'closing', 'passed']
  const sectors = ['all', ...new Set(dealPipeline.map(d => d.sector))]
  
  const filteredDeals = dealPipeline.filter(deal => {
    const matchesStage = selectedStage === 'all' || deal.stage === selectedStage
    const matchesSector = filterSector === 'all' || deal.sector === filterSector
    return matchesStage && matchesSector
  })

  const pipelineStats = {
    totalValue: dealPipeline.reduce((sum, deal) => sum + deal.dealSize, 0),
    avgDealSize: dealPipeline.reduce((sum, deal) => sum + deal.dealSize, 0) / dealPipeline.length,
    activeDeals: dealPipeline.filter(d => !['passed', 'closing'].includes(d.stage)).length,
    probabilityWeightedValue: dealPipeline.reduce((sum, deal) => sum + (deal.dealSize * deal.probability / 100), 0),
    highPriorityDeals: dealPipeline.filter(d => d.priority === 'critical' || d.priority === 'high').length
  }

  const renderDealCard = (deal: DealOpportunity) => (
    <Card key={deal.id} className={`
      transition-all duration-200 hover:shadow-md
      ${deal.aiInsights ? 'border-l-4 border-l-purple-400' : ''}
      ${deal.priority === 'critical' ? 'border-l-4 border-l-red-400' : ''}
    `}>
      <CardHeader 
        className="cursor-pointer"
        onClick={() => toggleDealExpansion(deal.id)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Building className="w-5 h-5 text-blue-600" />
            <div>
              <CardTitle className="text-lg">{deal.companyName}</CardTitle>
              <p className="text-sm text-gray-600">
                {deal.sector} • {deal.geography} • {formatCurrency(deal.dealSize)}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Badge className={`text-sm ${getPriorityColor(deal.priority)}`}>
              {deal.priority}
            </Badge>
            <Badge className={`text-xs ${getStageColor(deal.stage)}`}>
              {deal.stage.replace('_', ' ')}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {deal.probability}% prob
            </Badge>
            {deal.aiInsights && (
              <Badge variant="ai" className="text-xs">
                AI: {deal.aiInsights.fit}%
              </Badge>
            )}
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
            {/* Deal Overview */}
            <div>
              <h4 className="font-medium mb-3">Deal Overview</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Revenue:</span>
                  <div className="font-medium">{formatCurrency(deal.financials.revenue)}</div>
                </div>
                <div>
                  <span className="text-gray-600">Growth:</span>
                  <div className="font-medium text-green-600">+{deal.financials.revenueGrowth}%</div>
                </div>
                <div>
                  <span className="text-gray-600">EBITDA:</span>
                  <div className="font-medium">{formatCurrency(deal.financials.ebitda)}</div>
                </div>
                <div>
                  <span className="text-gray-600">Margin:</span>
                  <div className="font-medium">{deal.financials.ebitdaMargin}%</div>
                </div>
              </div>
            </div>

            {/* Investment Thesis */}
            <div>
              <h4 className="font-medium mb-2">Investment Thesis</h4>
              <p className="text-sm text-gray-600">{deal.investment.investmentThesis}</p>
              <div className="grid grid-cols-3 gap-4 mt-3 text-sm">
                <div>
                  <span className="text-gray-600">Target IRR:</span>
                  <div className="font-medium">{deal.investment.targetIRR}%</div>
                </div>
                <div>
                  <span className="text-gray-600">Target Multiple:</span>
                  <div className="font-medium">{deal.investment.targetMultiple}x</div>
                </div>
                <div>
                  <span className="text-gray-600">Hold Period:</span>
                  <div className="font-medium">{deal.investment.holdPeriod} years</div>
                </div>
              </div>
            </div>

            {/* AI Insights */}
            {deal.aiInsights && currentMode.mode !== 'traditional' && (
              <div className="p-3 bg-purple-50 rounded">
                <h4 className="font-medium mb-3 text-purple-800 flex items-center">
                  <Brain className="w-4 h-4 mr-1" />
                  AI Analysis
                  <Badge className="ml-2 text-xs bg-purple-100 text-purple-800">
                    {deal.aiInsights.urgency} urgency
                  </Badge>
                </h4>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-purple-700">Fit Score:</span>
                    <div className="flex items-center mt-1">
                      <div className="w-full bg-purple-200 rounded-full h-2 mr-2">
                        <div 
                          className="bg-purple-600 h-2 rounded-full" 
                          style={{ width: `${deal.aiInsights.fit}%` }}
                        />
                      </div>
                      <span className="text-purple-600 text-xs">{deal.aiInsights.fit}%</span>
                    </div>
                  </div>
                  <div>
                    <span className="font-medium text-purple-700">Attractiveness:</span>
                    <div className="flex items-center mt-1">
                      <div className="w-full bg-purple-200 rounded-full h-2 mr-2">
                        <div 
                          className="bg-purple-600 h-2 rounded-full" 
                          style={{ width: `${deal.aiInsights.attractiveness}%` }}
                        />
                      </div>
                      <span className="text-purple-600 text-xs">{deal.aiInsights.attractiveness}%</span>
                    </div>
                  </div>
                </div>

                <div className="mt-3">
                  <span className="font-medium text-purple-700">Next Best Actions:</span>
                  <ul className="mt-1 text-purple-600 space-y-1">
                    {deal.aiInsights.nextBestActions.slice(0, 3).map((action, index) => (
                      <li key={index} className="text-xs">• {action}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Competition & Timeline */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-2">Competition</h4>
                <div className="text-sm space-y-1">
                  <div>
                    <span className="text-gray-600">Process:</span>
                    <span className="ml-1 font-medium">{deal.competition.processType.replace('_', ' ')}</span>
                  </div>
                  {deal.competition.participantCount && (
                    <div>
                      <span className="text-gray-600">Participants:</span>
                      <span className="ml-1 font-medium">{deal.competition.participantCount}</span>
                    </div>
                  )}
                  {deal.competition.knownCompetitors.length > 0 && (
                    <div>
                      <span className="text-gray-600">Known:</span>
                      <span className="ml-1 text-xs">{deal.competition.knownCompetitors.join(', ')}</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Timeline</h4>
                <div className="text-sm space-y-1">
                  <div>
                    <span className="text-gray-600">Started:</span>
                    <span className="ml-1 font-medium">{deal.timeline.processStart.toISOString().split('T')[0]}</span>
                  </div>
                  {deal.timeline.expectedClose && (
                    <div>
                      <span className="text-gray-600">Expected Close:</span>
                      <span className="ml-1 font-medium">{deal.timeline.expectedClose.toISOString().split('T')[0]}</span>
                    </div>
                  )}
                  <div>
                    <span className="text-gray-600">Next Milestone:</span>
                    <span className="ml-1 text-xs">{deal.timeline.keyMilestones[0]?.description}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div>
              <h4 className="font-medium mb-2">Key Contact</h4>
              <div className="flex items-center justify-between text-sm">
                <div>
                  <span className="font-medium">{deal.contact.name}</span>
                  <span className="text-gray-600 ml-1">• {deal.contact.title}</span>
                  <div className="text-xs text-gray-500 mt-1">
                    Last contact: {deal.contact.lastContact?.toISOString().split('T')[0]}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button variant="ghost" size="sm">
                    <Mail className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Phone className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <MessageSquare className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-2 pt-3 border-t">
              <Button 
                size="sm"
                onClick={() => handleDealAction(deal.id, 'view_details')}
              >
                <Eye className="w-4 h-4 mr-1" />
                View Details
              </Button>
              <Button variant="outline" size="sm">
                <Edit className="w-4 h-4 mr-1" />
                Update Status
              </Button>
              <Button variant="outline" size="sm">
                <Calendar className="w-4 h-4 mr-1" />
                Schedule Meeting
              </Button>
              {currentMode.mode !== 'traditional' && deal.aiInsights && (
                <Button 
                  variant="ai" 
                  size="sm"
                  onClick={() => handleDealAction(deal.id, 'apply_ai_recommendations')}
                >
                  <Sparkles className="w-4 h-4 mr-1" />
                  AI Actions
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
          <h2 className="text-xl font-bold">Deal Sourcing & Pipeline</h2>
          <p className="text-gray-600">Manage deal flow and investment opportunities</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Deal
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export Pipeline
          </Button>
        </div>
      </div>

      {/* Pipeline Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{pipelineStats.activeDeals}</div>
            <div className="text-sm text-gray-600">Active Deals</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{formatCurrency(pipelineStats.totalValue)}</div>
            <div className="text-sm text-gray-600">Total Value</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">{formatCurrency(pipelineStats.avgDealSize)}</div>
            <div className="text-sm text-gray-600">Avg Deal Size</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">{pipelineStats.highPriorityDeals}</div>
            <div className="text-sm text-gray-600">High Priority</div>
          </CardContent>
        </Card>
      </div>

      {/* View Tabs */}
      <div className="flex space-x-4">
        {[
          { id: 'pipeline', label: 'Pipeline', icon: Target },
          { id: 'sources', label: 'Sources', icon: Network },
          { id: 'market', label: 'Market Intel', icon: BarChart3 },
          { id: 'analytics', label: 'Analytics', icon: PieChart }
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

      {/* Pipeline View */}
      {selectedView === 'pipeline' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Deal Pipeline ({filteredDeals.length})</h3>
            <div className="flex items-center space-x-2">
              <select 
                value={selectedStage} 
                onChange={(e) => setSelectedStage(e.target.value)}
                className="px-3 py-1 border rounded text-sm"
              >
                {stages.map(stage => (
                  <option key={stage} value={stage}>
                    {stage === 'all' ? 'All Stages' : stage.replace('_', ' ')}
                  </option>
                ))}
              </select>
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
            {filteredDeals.map(renderDealCard)}
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
            AI Deal Sourcing & Pipeline
            <Badge variant="ai" className="ml-3">Smart Discovery</Badge>
          </h2>
          <p className="text-gray-600">AI-powered deal discovery and pipeline optimization</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="ai">
            <Sparkles className="w-4 h-4 mr-2" />
            AI Deal Discovery
          </Button>
          <Button variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh Insights
          </Button>
        </div>
      </div>

      {/* AI Pipeline Analysis */}
      <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-blue-50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Brain className="w-6 h-6 text-purple-600" />
              <div>
                <h3 className="font-semibold text-purple-800">AI Pipeline Intelligence</h3>
                <p className="text-sm text-purple-600">
                  Tracking {dealPipeline.length} opportunities with {pipelineStats.highPriorityDeals} requiring immediate attention
                </p>
              </div>
            </div>
            <Badge variant="ai">87% Accuracy</Badge>
          </div>
          
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {dealPipeline.filter(d => d.aiInsights && d.aiInsights.fit > 80).length}
              </div>
              <div className="text-sm text-gray-600">High-Fit Deals</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {dealPipeline.filter(d => d.source.type === 'ai_sourced').length}
              </div>
              <div className="text-sm text-gray-600">AI Sourced</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {formatCurrency(pipelineStats.probabilityWeightedValue)}
              </div>
              <div className="text-sm text-gray-600">Weighted Value</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {dealPipeline.filter(d => d.aiInsights?.urgency === 'high').length}
              </div>
              <div className="text-sm text-gray-600">Urgent Actions</div>
            </div>
          </div>
        </CardContent>
      </Card>

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
              <Target className="w-4 h-4 text-purple-600" />
            </div>
            <div className="flex-1">
              <div className="bg-purple-50 rounded-lg p-4 mb-4">
                <p className="text-sm mb-2">
                  <strong>Deal Pipeline Analysis:</strong> I'm tracking {dealPipeline.length} opportunities with {formatCurrency(pipelineStats.probabilityWeightedValue)} probability-weighted value.
                </p>
                <p className="text-sm">
                  {pipelineStats.highPriorityDeals} deals need your immediate attention to maintain competitive position.
                </p>
              </div>

              {/* Priority Actions */}
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <h4 className="font-medium text-red-800 mb-3 flex items-center">
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Immediate Actions Required
                </h4>
                <div className="space-y-3">
                  {dealPipeline
                    .filter(d => d.priority === 'critical' || (d.aiInsights?.urgency === 'high' && d.probability > 70))
                    .map((deal) => (
                    <div key={deal.id} className="bg-white rounded p-3">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-medium">{deal.companyName}</h5>
                        <Badge className="bg-red-100 text-red-800 text-xs">{deal.stage.replace('_', ' ')}</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{deal.aiInsights?.nextBestActions[0]}</p>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="destructive">Take Action</Button>
                        <Button size="sm" variant="outline">Schedule Follow-up</Button>
                        <Button size="sm" variant="outline">Update Status</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Sourced Opportunities */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-800 mb-3 flex items-center">
                  <Sparkles className="w-4 h-4 mr-2" />
                  New AI-Sourced Opportunities
                </h4>
                <div className="space-y-2 text-sm text-blue-700">
                  {dealPipeline
                    .filter(d => d.source.type === 'ai_sourced')
                    .map((deal) => (
                    <div key={deal.id} className="bg-white rounded p-2">
                      <div className="flex justify-between items-center">
                        <span>• {deal.companyName} - {deal.aiInsights?.fit}% fit score</span>
                        <Button size="sm" variant="outline">Review</Button>
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