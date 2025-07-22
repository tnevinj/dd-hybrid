'use client'

import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useNavigationStore } from '@/stores/navigation-store'
import { 
  TrendingUp,
  Brain,
  Target,
  BarChart3,
  PieChart,
  Users,
  DollarSign,
  Calendar,
  MapPin,
  Building,
  Zap,
  CheckCircle,
  AlertTriangle,
  Eye,
  Download,
  Copy,
  Star,
  Lightbulb,
  Sparkles,
  ArrowRight,
  RefreshCw,
  Filter,
  Search,
  ChevronRight,
  ChevronDown,
  Clock,
  Briefcase
} from 'lucide-react'

interface SimilarDeal {
  id: string
  name: string
  sector: string
  dealType: 'acquisition' | 'growth' | 'buyout' | 'recapitalization'
  dealSize: number
  dealDate: Date
  geography: string
  outcome: 'successful' | 'challenged' | 'failed' | 'ongoing'
  similarity: number
  
  // Key metrics
  metrics: {
    revenue: number
    growth: number
    ebitda: number
    margin: number
    employees: number
    customers?: number
    retention?: number
  }
  
  // Matching factors
  matchingFactors: {
    businessModel: number
    financialProfile: number
    riskProfile: number
    marketDynamics: number
    teamQuality: number
  }
  
  // Key learnings
  learnings: {
    successes: string[]
    challenges: string[]
    recommendations: string[]
  }
  
  // DD insights from this deal
  ddInsights: {
    timeToComplete: number // days
    criticalIssues: string[]
    valueDrivers: string[]
    riskMitigation: string[]
  }
}

interface DealPatternMatchingProps {
  projectId: string
  currentDeal: {
    name: string
    sector: string
    revenue: number
    growth: number
    ebitda: number
    geography: string
    dealType: string
  }
}

export function DealPatternMatching({ projectId, currentDeal }: DealPatternMatchingProps) {
  const { currentMode, trackInteraction, addRecommendation } = useNavigationStore()
  const [selectedMatch, setSelectedMatch] = React.useState<string | null>(null)
  const [expandedSections, setExpandedSections] = React.useState<Set<string>>(new Set(['top-matches']))
  const [showComparison, setShowComparison] = React.useState(false)

  // Sample similar deals data
  const [similarDeals] = React.useState<SimilarDeal[]>([
    {
      id: 'cloudco-2024',
      name: 'CloudCo Acquisition',
      sector: 'SaaS - Enterprise',
      dealType: 'acquisition',
      dealSize: 85000000,
      dealDate: new Date('2024-03-15'),
      geography: 'North America',
      outcome: 'successful',
      similarity: 0.94,
      metrics: {
        revenue: 12800000,
        growth: 0.42,
        ebitda: 3200000,
        margin: 0.25,
        employees: 89,
        customers: 147,
        retention: 0.96
      },
      matchingFactors: {
        businessModel: 0.96,
        financialProfile: 0.91,
        riskProfile: 0.89,
        marketDynamics: 0.94,
        teamQuality: 0.98
      },
      learnings: {
        successes: [
          'Strong product-market fit drove rapid expansion',
          'Excellent management team retention post-acquisition',
          'Successful cross-selling to existing portfolio companies'
        ],
        challenges: [
          'Customer concentration risk materialized in Month 6',
          'Integration took longer than expected (8 vs 6 months)',
          'Churn increased during transition period'
        ],
        recommendations: [
          'Prioritize customer diversification early',
          'Maintain founder involvement for 18+ months',
          'Implement gradual system integration approach'
        ]
      },
      ddInsights: {
        timeToComplete: 62,
        criticalIssues: [
          'Top 3 customers = 68% of revenue',
          'Key person dependency on CTO',
          'Limited IP protection in EU'
        ],
        valueDrivers: [
          'Market-leading NPS scores (87)',
          'Best-in-class unit economics',
          'Strong recurring revenue base (92%)'
        ],
        riskMitigation: [
          'Negotiated customer diversification milestones',
          'Implemented CTO retention bonus',
          'Filed patents in key EU markets'
        ]
      }
    },
    {
      id: 'saastech-2023',
      name: 'SaasTech Growth Investment',
      sector: 'SaaS - Mid-market',
      dealType: 'growth',
      dealSize: 45000000,
      dealDate: new Date('2023-11-08'),
      geography: 'North America',
      outcome: 'successful',
      similarity: 0.87,
      metrics: {
        revenue: 8500000,
        growth: 0.38,
        ebitda: 1700000,
        margin: 0.20,
        employees: 67,
        customers: 234,
        retention: 0.91
      },
      matchingFactors: {
        businessModel: 0.89,
        financialProfile: 0.84,
        riskProfile: 0.92,
        marketDynamics: 0.86,
        teamQuality: 0.83
      },
      learnings: {
        successes: [
          'Successful international expansion (3 new markets)',
          'Product innovation accelerated growth',
          'Strong organic customer acquisition'
        ],
        challenges: [
          'Pricing model needed significant revision',
          'Competition intensified faster than expected',
          'Talent acquisition in key markets'
        ],
        recommendations: [
          'Conduct pricing analysis early in DD',
          'Assess competitive moat sustainability',
          'Evaluate local talent markets for expansion'
        ]
      },
      ddInsights: {
        timeToComplete: 45,
        criticalIssues: [
          'Pricing pressure from new entrants',
          'Limited sales process documentation',
          'Compliance gaps in EU market'
        ],
        valueDrivers: [
          'Strong brand recognition',
          'Proven international scalability',
          'High customer lifetime value'
        ],
        riskMitigation: [
          'Implemented dynamic pricing strategy',
          'Standardized sales processes',
          'Hired compliance officer for EU'
        ]
      }
    },
    {
      id: 'enterprise-sol-2024',
      name: 'Enterprise Solutions Buyout',
      sector: 'SaaS - Enterprise',
      dealType: 'buyout',
      dealSize: 120000000,
      dealDate: new Date('2024-01-22'),
      geography: 'North America',
      outcome: 'challenged',
      similarity: 0.82,
      metrics: {
        revenue: 18500000,
        growth: 0.25,
        ebitda: 4200000,
        margin: 0.23,
        employees: 142,
        customers: 89,
        retention: 0.88
      },
      matchingFactors: {
        businessModel: 0.85,
        financialProfile: 0.78,
        riskProfile: 0.76,
        marketDynamics: 0.84,
        teamQuality: 0.71
      },
      learnings: {
        successes: [
          'Strong existing customer relationships',
          'Market-leading technology platform',
          'Successful cost optimization initiatives'
        ],
        challenges: [
          'Management team turnover post-close',
          'Customer churn higher than projected',
          'Integration complexity underestimated'
        ],
        recommendations: [
          'Deeper management team assessment',
          'More conservative churn assumptions',
          'Detailed integration planning pre-close'
        ]
      },
      ddInsights: {
        timeToComplete: 78,
        criticalIssues: [
          'Management team stability concerns',
          'Technology debt issues',
          'Customer satisfaction declining'
        ],
        valueDrivers: [
          'Market leadership position',
          'High switching costs',
          'Strong gross margins'
        ],
        riskMitigation: [
          'Implemented retention packages',
          'Planned technology modernization',
          'Enhanced customer success programs'
        ]
      }
    },
    {
      id: 'fintech-startup-2023',
      name: 'FinTech Growth Deal',
      sector: 'FinTech - B2B',
      dealType: 'growth',
      dealSize: 35000000,
      dealDate: new Date('2023-08-14'),
      geography: 'North America',
      outcome: 'successful',
      similarity: 0.71,
      metrics: {
        revenue: 6200000,
        growth: 0.89,
        ebitda: 980000,
        margin: 0.16,
        employees: 45,
        customers: 312
      },
      matchingFactors: {
        businessModel: 0.64,
        financialProfile: 0.69,
        riskProfile: 0.83,
        marketDynamics: 0.72,
        teamQuality: 0.85
      },
      learnings: {
        successes: [
          'Rapid customer acquisition',
          'Strong regulatory compliance',
          'Innovative product features'
        ],
        challenges: [
          'Unit economics took time to optimize',
          'Regulatory changes impacted growth',
          'High customer acquisition costs'
        ],
        recommendations: [
          'Focus on unit economics sustainability',
          'Monitor regulatory environment closely',
          'Diversify customer acquisition channels'
        ]
      },
      ddInsights: {
        timeToComplete: 52,
        criticalIssues: [
          'Regulatory compliance complexity',
          'Customer acquisition cost trends',
          'Competition from incumbents'
        ],
        valueDrivers: [
          'First-mover advantage',
          'Strong technology platform',
          'Experienced team'
        ],
        riskMitigation: [
          'Enhanced compliance monitoring',
          'Diversified marketing strategy',
          'Built competitive moats'
        ]
      }
    }
  ])

  // AI recommendations based on similar deals
  React.useEffect(() => {
    if (currentMode.mode !== 'traditional') {
      const topMatch = similarDeals[0] // CloudCo with 94% similarity

      addRecommendation({
        id: `pattern-match-${projectId}`,
        type: 'insight',
        priority: 'high',
        title: `94% Match Found: ${topMatch.name}`,
        description: `This deal closely matches ${topMatch.name} from ${topMatch.dealDate.getFullYear()}. Key learnings from that deal could save significant DD time and reduce risks.`,
        actions: [{
          id: 'apply-learnings',
          label: 'Apply Deal Learnings',
          action: 'APPLY_DEAL_TEMPLATE',
          primary: true,
          estimatedTimeSaving: topMatch.ddInsights.timeToComplete * 0.3 * 60 // 30% time savings in minutes
        }, {
          id: 'view-comparison',
          label: 'View Detailed Comparison',
          action: 'VIEW_DEAL_COMPARISON'
        }],
        confidence: topMatch.similarity,
        moduleContext: 'due-diligence',
        timestamp: new Date()
      })

      // Risk warning from challenged deals
      const challengedDeals = similarDeals.filter(deal => deal.outcome === 'challenged')
      if (challengedDeals.length > 0) {
        const challengedDeal = challengedDeals[0]
        addRecommendation({
          id: `risk-pattern-${projectId}`,
          type: 'warning',
          priority: 'medium',
          title: `Risk Pattern Detected`,
          description: `${challengedDeals.length} similar deal(s) faced challenges. Review ${challengedDeal.name}'s lessons learned to avoid similar pitfalls.`,
          actions: [{
            id: 'review-risks',
            label: 'Review Risk Factors',
            action: 'REVIEW_RISK_PATTERNS'
          }],
          confidence: 0.83,
          moduleContext: 'due-diligence',
          timestamp: new Date()
        })
      }

      // DD process optimization
      const avgDDTime = similarDeals.reduce((acc, deal) => acc + deal.ddInsights.timeToComplete, 0) / similarDeals.length
      addRecommendation({
        id: `dd-optimization-${projectId}`,
        type: 'suggestion',
        priority: 'medium',
        title: 'DD Process Optimization',
        description: `Based on similar deals, focus on ${topMatch.ddInsights.criticalIssues.length} key risk areas to complete DD ~${Math.round(avgDDTime * 0.2)} days faster.`,
        actions: [{
          id: 'optimize-dd',
          label: 'Apply DD Template',
          action: 'OPTIMIZE_DD_PROCESS'
        }],
        confidence: 0.88,
        moduleContext: 'due-diligence',
        timestamp: new Date()
      })
    }
  }, [currentMode.mode, projectId, addRecommendation])

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections)
    if (newExpanded.has(section)) {
      newExpanded.delete(section)
    } else {
      newExpanded.add(section)
    }
    setExpandedSections(newExpanded)
  }

  const handleApplyLearnings = (dealId: string) => {
    trackInteraction({
      interactionType: 'automation_approved',
      userAction: 'accepted',
      module: 'due-diligence',
      context: {
        action: 'apply_deal_template',
        similarDealId: dealId,
        similarity: similarDeals.find(d => d.id === dealId)?.similarity
      }
    })
  }

  const getOutcomeColor = (outcome: SimilarDeal['outcome']) => {
    switch (outcome) {
      case 'successful': return 'text-green-600 bg-green-50 border-green-200'
      case 'challenged': return 'text-orange-600 bg-orange-50 border-orange-200'
      case 'failed': return 'text-red-600 bg-red-50 border-red-200'
      case 'ongoing': return 'text-blue-600 bg-blue-50 border-blue-200'
    }
  }

  const getSimilarityColor = (similarity: number) => {
    if (similarity >= 0.9) return 'text-green-600 bg-green-50'
    if (similarity >= 0.8) return 'text-blue-600 bg-blue-50'
    if (similarity >= 0.7) return 'text-orange-600 bg-orange-50'
    return 'text-gray-600 bg-gray-50'
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const renderDealCard = (deal: SimilarDeal) => (
    <Card key={deal.id} className="hover:shadow-md transition-shadow">
      <CardHeader 
        className="cursor-pointer"
        onClick={() => setSelectedMatch(selectedMatch === deal.id ? null : deal.id)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div>
              <CardTitle className="text-lg">{deal.name}</CardTitle>
              <p className="text-sm text-gray-600">{deal.sector} • {deal.dealDate.getFullYear()} • {deal.geography}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Badge className={`text-sm font-medium ${getSimilarityColor(deal.similarity)}`}>
              {Math.round(deal.similarity * 100)}% Match
            </Badge>
            <Badge className={`text-xs ${getOutcomeColor(deal.outcome)}`}>
              {deal.outcome}
            </Badge>
            {selectedMatch === deal.id ? 
              <ChevronDown className="w-4 h-4" /> : 
              <ChevronRight className="w-4 h-4" />
            }
          </div>
        </div>
      </CardHeader>

      {selectedMatch === deal.id && (
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Deal Metrics */}
            <div>
              <h4 className="font-medium mb-3 flex items-center">
                <BarChart3 className="w-4 h-4 mr-2 text-blue-600" />
                Deal Metrics
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Deal Size:</span>
                  <span className="font-medium">{formatCurrency(deal.dealSize)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Revenue:</span>
                  <span className="font-medium">{formatCurrency(deal.metrics.revenue)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Growth:</span>
                  <span className="font-medium">{Math.round(deal.metrics.growth * 100)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">EBITDA:</span>
                  <span className="font-medium">{formatCurrency(deal.metrics.ebitda)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Margin:</span>
                  <span className="font-medium">{Math.round(deal.metrics.margin * 100)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Employees:</span>
                  <span className="font-medium">{deal.metrics.employees}</span>
                </div>
              </div>
            </div>

            {/* Matching Factors */}
            <div>
              <h4 className="font-medium mb-3 flex items-center">
                <Target className="w-4 h-4 mr-2 text-purple-600" />
                Matching Factors
              </h4>
              <div className="space-y-3">
                {Object.entries(deal.matchingFactors).map(([factor, score]) => (
                  <div key={factor}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="capitalize">{factor.replace(/([A-Z])/g, ' $1').trim()}</span>
                      <span className="font-medium">{Math.round(score * 100)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-purple-600 h-2 rounded-full" 
                        style={{ width: `${score * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Key Learnings */}
          <div className="mt-6">
            <h4 className="font-medium mb-3 flex items-center">
              <Lightbulb className="w-4 h-4 mr-2 text-yellow-600" />
              Key Learnings
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-3 bg-green-50 rounded">
                <h5 className="font-medium text-green-800 mb-2">Successes</h5>
                <ul className="text-sm text-green-700 space-y-1">
                  {deal.learnings.successes.map((success, index) => (
                    <li key={index}>• {success}</li>
                  ))}
                </ul>
              </div>
              
              <div className="p-3 bg-orange-50 rounded">
                <h5 className="font-medium text-orange-800 mb-2">Challenges</h5>
                <ul className="text-sm text-orange-700 space-y-1">
                  {deal.learnings.challenges.map((challenge, index) => (
                    <li key={index}>• {challenge}</li>
                  ))}
                </ul>
              </div>
              
              <div className="p-3 bg-blue-50 rounded">
                <h5 className="font-medium text-blue-800 mb-2">Recommendations</h5>
                <ul className="text-sm text-blue-700 space-y-1">
                  {deal.learnings.recommendations.map((rec, index) => (
                    <li key={index}>• {rec}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* DD Insights */}
          <div className="mt-6">
            <h4 className="font-medium mb-3 flex items-center">
              <Briefcase className="w-4 h-4 mr-2 text-gray-600" />
              DD Process Insights
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-sm mb-2">
                  <span className="font-medium">DD Timeline:</span> {deal.ddInsights.timeToComplete} days
                </div>
                <div className="text-sm mb-3">
                  <span className="font-medium">Critical Issues:</span>
                </div>
                <ul className="text-sm text-gray-600 space-y-1 mb-3">
                  {deal.ddInsights.criticalIssues.map((issue, index) => (
                    <li key={index}>• {issue}</li>
                  ))}
                </ul>
              </div>
              
              <div>
                <div className="text-sm mb-3">
                  <span className="font-medium">Value Drivers:</span>
                </div>
                <ul className="text-sm text-gray-600 space-y-1">
                  {deal.ddInsights.valueDrivers.map((driver, index) => (
                    <li key={index}>• {driver}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex space-x-3">
            <Button 
              onClick={() => handleApplyLearnings(deal.id)}
              className="flex items-center"
            >
              <Copy className="w-4 h-4 mr-2" />
              Apply Learnings
            </Button>
            <Button variant="outline">
              <Eye className="w-4 h-4 mr-2" />
              View Full Report
            </Button>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export Comparison
            </Button>
          </div>
        </CardContent>
      )}
    </Card>
  )

  const renderTraditionalView = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Similar Deals Analysis</h2>
          <p className="text-gray-600">Learn from comparable transactions and market patterns</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <Search className="w-4 h-4 mr-2" />
            Search
          </Button>
        </div>
      </div>

      {/* Current Deal Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Current Deal: {currentDeal.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Sector:</span>
              <div className="font-medium">{currentDeal.sector}</div>
            </div>
            <div>
              <span className="text-gray-600">Revenue:</span>
              <div className="font-medium">{formatCurrency(currentDeal.revenue)}</div>
            </div>
            <div>
              <span className="text-gray-600">Growth:</span>
              <div className="font-medium">{Math.round(currentDeal.growth * 100)}%</div>
            </div>
            <div>
              <span className="text-gray-600">Geography:</span>
              <div className="font-medium">{currentDeal.geography}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Similar Deals */}
      <div>
        <h3 className="text-lg font-semibold mb-4">
          Similar Deals ({similarDeals.length} found)
        </h3>
        <div className="space-y-4">
          {similarDeals.map(renderDealCard)}
        </div>
      </div>
    </div>
  )

  const renderAssistedView = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold flex items-center">
            <Brain className="w-5 h-5 mr-2 text-purple-500" />
            AI-Powered Deal Pattern Matching
            <Badge variant="ai" className="ml-3">Smart Analysis</Badge>
          </h2>
          <p className="text-gray-600">Intelligent deal comparison with automated insights and recommendations</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="ai" size="sm">
            <Sparkles className="w-4 h-4 mr-2" />
            Generate Insights
          </Button>
          <Button variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh Analysis
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
                <h3 className="font-semibold text-purple-800">Pattern Analysis Complete</h3>
                <p className="text-sm text-purple-600">
                  Found {similarDeals.length} similar deals with {Math.round(similarDeals[0].similarity * 100)}% best match
                </p>
              </div>
            </div>
            <Badge variant="ai">96% Accuracy</Badge>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{similarDeals.filter(d => d.outcome === 'successful').length}</div>
              <div className="text-sm text-gray-600">Successful Outcomes</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{Math.round(similarDeals.reduce((acc, deal) => acc + deal.ddInsights.timeToComplete, 0) / similarDeals.length)}</div>
              <div className="text-sm text-gray-600">Avg DD Days</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{similarDeals.flatMap(d => d.learnings.recommendations).length}</div>
              <div className="text-sm text-gray-600">Key Insights</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Top Match Highlight */}
      <Card className="border-l-4 border-l-green-400">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <Star className="w-5 h-5 mr-2 text-green-500" />
              Best Match: {similarDeals[0].name}
            </CardTitle>
            <Badge className="bg-green-100 text-green-800">
              {Math.round(similarDeals[0].similarity * 100)}% Similar
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="text-center p-3 bg-green-50 rounded">
              <div className="font-bold text-green-700">{formatCurrency(similarDeals[0].dealSize)}</div>
              <div className="text-xs text-green-600">Deal Size</div>
            </div>
            <div className="text-center p-3 bg-blue-50 rounded">
              <div className="font-bold text-blue-700">{similarDeals[0].ddInsights.timeToComplete} days</div>
              <div className="text-xs text-blue-600">DD Timeline</div>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded">
              <div className="font-bold text-purple-700">{similarDeals[0].outcome}</div>
              <div className="text-xs text-purple-600">Outcome</div>
            </div>
            <div className="text-center p-3 bg-orange-50 rounded">
              <div className="font-bold text-orange-700">{similarDeals[0].learnings.recommendations.length}</div>
              <div className="text-xs text-orange-600">Recommendations</div>
            </div>
          </div>
          
          <div className="flex space-x-3">
            <Button 
              onClick={() => handleApplyLearnings(similarDeals[0].id)}
              className="flex items-center"
            >
              <Zap className="w-4 h-4 mr-2" />
              Apply Template (Save ~{Math.round(similarDeals[0].ddInsights.timeToComplete * 0.3)} days)
            </Button>
            <Button variant="outline">
              <Eye className="w-4 h-4 mr-2" />
              Deep Dive Analysis
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* All Similar Deals */}
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <TrendingUp className="w-5 h-5 mr-2" />
          All Similar Deals
        </h3>
        <div className="space-y-4">
          {similarDeals.map(renderDealCard)}
        </div>
      </div>
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
                  <strong>Pattern Matching Complete:</strong> I&apos;ve identified {similarDeals.length} highly similar deals with {Math.round(similarDeals[0].similarity * 100)}% best match to {similarDeals[0].name}.
                </p>
                <p className="text-sm">
                  Based on this analysis, I recommend applying the proven DD template which could save ~{Math.round(similarDeals[0].ddInsights.timeToComplete * 0.3)} days.
                </p>
              </div>

              {/* Key Recommendations */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <h4 className="font-medium text-blue-800 mb-3 flex items-center">
                  <Lightbulb className="w-4 h-4 mr-2" />
                  Key Recommendations from Similar Deals
                </h4>
                <div className="space-y-3">
                  {similarDeals[0].learnings.recommendations.slice(0, 3).map((rec, index) => (
                    <div key={index} className="bg-white rounded p-3">
                      <p className="text-sm">{rec}</p>
                      <div className="mt-2 flex space-x-2">
                        <Button size="sm">Apply Now</Button>
                        <Button size="sm" variant="outline">Add to Checklist</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Risk Alerts */}
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <h4 className="font-medium text-orange-800 mb-3 flex items-center">
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Risk Patterns to Monitor
                </h4>
                <div className="space-y-2 text-sm text-orange-700">
                  {similarDeals.filter(d => d.outcome === 'challenged')[0]?.ddInsights.criticalIssues.map((issue, index) => (
                    <div key={index} className="bg-white rounded p-2">
                      <div className="flex justify-between items-center">
                        <span>• {issue}</span>
                        <Button size="sm" variant="outline">Monitor</Button>
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