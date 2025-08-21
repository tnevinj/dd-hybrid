'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { 
  TrendingUp,
  TrendingDown,
  Target,
  Brain,
  DollarSign,
  Activity,
  Shield,
  AlertTriangle,
  CheckCircle,
  Clock,
  Users,
  BarChart3,
  PieChart,
  Star,
  Lightbulb,
  Search,
  Filter,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
  ChevronRight,
  Zap,
  Award,
  Building
} from 'lucide-react'

import { 
  InvestmentRecommendationEngine, 
  InvestmentOpportunity, 
  InvestmentRecommendation 
} from '@/lib/analytics/investment-recommendation-engine'

interface InvestmentRecommendationDashboardProps {
  mode?: 'traditional' | 'assisted' | 'autonomous'
}

export function InvestmentRecommendationDashboard({ mode = 'traditional' }: InvestmentRecommendationDashboardProps) {
  const [engine] = useState(new InvestmentRecommendationEngine())
  const [opportunities, setOpportunities] = useState<InvestmentOpportunity[]>([])
  const [recommendations, setRecommendations] = useState<InvestmentRecommendation[]>([])
  const [analytics, setAnalytics] = useState<any>({})
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSector, setSelectedSector] = useState<string>('all')
  const [selectedRecommendation, setSelectedRecommendation] = useState<string>('all')

  useEffect(() => {
    loadInvestmentData()
  }, [])

  const loadInvestmentData = async () => {
    setLoading(true)
    
    // Mock investment opportunities
    const mockOpportunities: InvestmentOpportunity[] = [
      {
        dealId: 'DEAL-001',
        companyName: 'TechFlow AI',
        sector: 'Technology',
        dealSize: 125000000,
        requestedValuation: 500000000,
        revenueGrowth: 0.45,
        profitability: 0.18,
        marketPosition: 'Leader',
        managementQuality: 9,
        competitiveAdvantages: ['Proprietary AI algorithms', 'Strong customer moats', 'Network effects', 'Patent portfolio'],
        riskFactors: ['Technology disruption risk', 'Key person dependency'],
        dealSource: 'Investment Bank',
        timeline: '45 days'
      },
      {
        dealId: 'DEAL-002',
        companyName: 'HealthTech Solutions',
        sector: 'Healthcare',
        dealSize: 85000000,
        requestedValuation: 340000000,
        revenueGrowth: 0.28,
        profitability: 0.22,
        marketPosition: 'Strong',
        managementQuality: 8,
        competitiveAdvantages: ['FDA approvals', 'Hospital partnerships', 'Clinical data'],
        riskFactors: ['Regulatory changes', 'Reimbursement risk'],
        dealSource: 'Direct Approach',
        timeline: '60 days'
      },
      {
        dealId: 'DEAL-003',
        companyName: 'FinServ Innovations',
        sector: 'Financial Services',
        dealSize: 200000000,
        requestedValuation: 800000000,
        revenueGrowth: 0.15,
        profitability: 0.25,
        marketPosition: 'Growing',
        managementQuality: 7,
        competitiveAdvantages: ['Regulatory licenses', 'Customer data', 'Technology platform'],
        riskFactors: ['Regulatory risk', 'Competition from incumbents', 'Technology obsolescence'],
        dealSource: 'Investment Bank',
        timeline: '90 days'
      },
      {
        dealId: 'DEAL-004',
        companyName: 'EcoManufacturing Corp',
        sector: 'Industrial',
        dealSize: 150000000,
        requestedValuation: 450000000,
        revenueGrowth: 0.12,
        profitability: 0.14,
        marketPosition: 'Emerging',
        managementQuality: 6,
        competitiveAdvantages: ['Sustainable processes', 'Cost efficiency'],
        riskFactors: ['Commodity price volatility', 'Environmental regulations', 'Market cyclicality'],
        dealSource: 'Proprietary',
        timeline: '75 days'
      },
      {
        dealId: 'DEAL-005',
        companyName: 'Consumer Direct Co',
        sector: 'Consumer',
        dealSize: 75000000,
        requestedValuation: 300000000,
        revenueGrowth: 0.35,
        profitability: 0.08,
        marketPosition: 'Growing',
        managementQuality: 8,
        competitiveAdvantages: ['Brand loyalty', 'Direct-to-consumer model'],
        riskFactors: ['Supply chain disruption', 'Consumer spending volatility'],
        dealSource: 'Direct Approach',
        timeline: '50 days'
      }
    ]

    try {
      setOpportunities(mockOpportunities)
      const recs = engine.generatePortfolioRecommendations(mockOpportunities)
      setRecommendations(recs)
      
      const analyticsData = engine.getRecommendationAnalytics(recs)
      setAnalytics(analyticsData)
    } catch (error) {
      console.error('Error loading investment data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getRecommendationColor = (rec: string) => {
    switch (rec) {
      case 'STRONG_BUY': return 'bg-green-100 text-green-800 border-green-300'
      case 'BUY': return 'bg-blue-100 text-blue-800 border-blue-300'
      case 'CONDITIONAL_BUY': return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      case 'HOLD': return 'bg-gray-100 text-gray-800 border-gray-300'
      case 'PASS': return 'bg-red-100 text-red-800 border-red-300'
      default: return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  const getRecommendationIcon = (rec: string) => {
    switch (rec) {
      case 'STRONG_BUY': return <TrendingUp className="h-4 w-4" />
      case 'BUY': return <ArrowUpRight className="h-4 w-4" />
      case 'CONDITIONAL_BUY': return <Clock className="h-4 w-4" />
      case 'HOLD': return <Activity className="h-4 w-4" />
      case 'PASS': return <ArrowDownRight className="h-4 w-4" />
      default: return <Activity className="h-4 w-4" />
    }
  }

  const formatCurrency = (value: number) => {
    if (value >= 1000000000) return `$${(value / 1000000000).toFixed(1)}B`
    if (value >= 1000000) return `$${(value / 1000000).toFixed(0)}M`
    return `$${(value / 1000).toFixed(0)}K`
  }

  const formatPercentage = (value: number) => `${(value * 100).toFixed(1)}%`

  const filteredRecommendations = recommendations.filter(rec => {
    const opportunity = opportunities.find(opp => opp.dealId === rec.dealId)
    if (!opportunity) return false
    
    const matchesSearch = opportunity.companyName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSector = selectedSector === 'all' || opportunity.sector === selectedSector
    const matchesRecommendation = selectedRecommendation === 'all' || rec.recommendation === selectedRecommendation
    
    return matchesSearch && matchesSector && matchesRecommendation
  })

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <RefreshCw className="h-8 w-8 animate-spin text-blue-600 mb-4" />
        <h3 className="text-xl font-semibold text-gray-700">Analyzing Investment Opportunities...</h3>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Brain className="h-8 w-8 mr-3 text-purple-600" />
            AI Investment Recommendations
          </h1>
          <p className="text-gray-600 mt-1">ML-powered investment decision support and portfolio optimization</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button onClick={loadInvestmentData} variant="outline" className="flex items-center space-x-2">
            <RefreshCw className="h-4 w-4" />
            <span>Refresh Analysis</span>
          </Button>
          <Button className="flex items-center space-x-2">
            <Lightbulb className="h-4 w-4" />
            <span>Generate New Recs</span>
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Opportunities</CardTitle>
            <Building className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalOpportunities || 0}</div>
            <p className="text-xs text-gray-600">Active pipeline</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Strong Buy</CardTitle>
            <Star className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{analytics.strongBuyCount || 0}</div>
            <p className="text-xs text-gray-600">Top recommendations</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Avg Score</CardTitle>
            <Target className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.averageScore?.toFixed(0) || 0}</div>
            <p className="text-xs text-gray-600">Out of 100</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Avg Confidence</CardTitle>
            <Shield className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{((analytics.averageConfidence || 0) * 100).toFixed(0)}%</div>
            <p className="text-xs text-gray-600">Model confidence</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Target IRR</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatPercentage(analytics.avgTargetIRR || 0.22)}</div>
            <p className="text-xs text-gray-600">Portfolio average</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="recommendations" className="w-full">
        <TabsList className="grid w-fit grid-cols-3">
          <TabsTrigger value="recommendations">Investment Recommendations</TabsTrigger>
          <TabsTrigger value="pipeline">Deal Pipeline</TabsTrigger>
          <TabsTrigger value="analytics">Performance Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="recommendations" className="mt-6">
          {/* Filters */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search companies..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <select 
                value={selectedSector}
                onChange={(e) => setSelectedSector(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Sectors</option>
                <option value="Technology">Technology</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Financial Services">Financial Services</option>
                <option value="Consumer">Consumer</option>
                <option value="Industrial">Industrial</option>
              </select>
              <select 
                value={selectedRecommendation}
                onChange={(e) => setSelectedRecommendation(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Recommendations</option>
                <option value="STRONG_BUY">Strong Buy</option>
                <option value="BUY">Buy</option>
                <option value="CONDITIONAL_BUY">Conditional Buy</option>
                <option value="HOLD">Hold</option>
                <option value="PASS">Pass</option>
              </select>
            </div>
          </div>

          {/* Recommendations List */}
          <div className="space-y-4">
            {filteredRecommendations.map((rec) => {
              const opportunity = opportunities.find(opp => opp.dealId === rec.dealId)
              if (!opportunity) return null

              return (
                <Card key={rec.dealId} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                          <Building className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-xl">{opportunity.companyName}</CardTitle>
                          <p className="text-gray-600">{opportunity.sector} • {formatCurrency(opportunity.dealSize)}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Badge className={`${getRecommendationColor(rec.recommendation)} flex items-center space-x-1`}>
                          {getRecommendationIcon(rec.recommendation)}
                          <span>{rec.recommendation.replace('_', ' ')}</span>
                        </Badge>
                        <Badge variant="outline" className="text-sm">
                          Score: {rec.score}/100
                        </Badge>
                        <Badge variant="outline" className="text-sm">
                          {(rec.confidence * 100).toFixed(0)}% Confidence
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      {/* Key Metrics */}
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Key Metrics</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Revenue Growth:</span>
                            <span className="text-sm font-medium">{formatPercentage(opportunity.revenueGrowth)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Profitability:</span>
                            <span className="text-sm font-medium">{formatPercentage(opportunity.profitability)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Target IRR:</span>
                            <span className="text-sm font-medium text-green-600">{formatPercentage(rec.targetIRR)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Target MOIC:</span>
                            <span className="text-sm font-medium text-blue-600">{rec.targetMOIC.toFixed(1)}x</span>
                          </div>
                        </div>
                      </div>

                      {/* Strengths & Risks */}
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Analysis Summary</h4>
                        <div className="space-y-3">
                          <div>
                            <h5 className="text-sm font-medium text-green-700 mb-1">Key Strengths:</h5>
                            <ul className="text-xs text-green-600 space-y-1">
                              {rec.keyStrengths.slice(0, 2).map((strength, idx) => (
                                <li key={idx} className="flex items-center">
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  {strength}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h5 className="text-sm font-medium text-red-700 mb-1">Key Risks:</h5>
                            <ul className="text-xs text-red-600 space-y-1">
                              {rec.keyRisks.slice(0, 2).map((risk, idx) => (
                                <li key={idx} className="flex items-center">
                                  <AlertTriangle className="h-3 w-3 mr-1" />
                                  {risk}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>

                      {/* Implementation */}
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Implementation</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">DD Priority:</span>
                            <Badge variant="outline" className={
                              rec.implementation.dueDiglencePriority === 'HIGH' ? 'text-red-600' :
                              rec.implementation.dueDiglencePriority === 'MEDIUM' ? 'text-yellow-600' : 'text-green-600'
                            }>
                              {rec.implementation.dueDiglencePriority}
                            </Badge>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Timeline:</span>
                            <span className="text-sm font-medium">{rec.implementation.timeToDecision} days</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Market Timing:</span>
                            <Badge variant="outline" className={
                              rec.marketAnalysis.marketTiming === 'EXCELLENT' ? 'text-green-600' :
                              rec.marketAnalysis.marketTiming === 'GOOD' ? 'text-blue-600' : 'text-yellow-600'
                            }>
                              {rec.marketAnalysis.marketTiming}
                            </Badge>
                          </div>
                        </div>
                        <div className="mt-3">
                          <Button size="sm" className="w-full">
                            <ChevronRight className="h-4 w-4 mr-1" />
                            View Full Analysis
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="pipeline" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <PieChart className="h-5 w-5 mr-2 text-blue-600" />
                  Deal Pipeline by Sector
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {['Technology', 'Healthcare', 'Financial Services', 'Consumer', 'Industrial'].map((sector) => {
                    const sectorCount = opportunities.filter(o => o.sector === sector).length
                    const percentage = (sectorCount / opportunities.length) * 100
                    return (
                      <div key={sector} className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">{sector}</span>
                          <span className="text-sm text-gray-600">{sectorCount} deals ({percentage.toFixed(0)}%)</span>
                        </div>
                        <Progress value={percentage} className="h-2" />
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2 text-green-600" />
                  Recommendation Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {['STRONG_BUY', 'BUY', 'CONDITIONAL_BUY', 'HOLD', 'PASS'].map((rec) => {
                    const recCount = recommendations.filter(r => r.recommendation === rec).length
                    const percentage = (recCount / recommendations.length) * 100
                    return (
                      <div key={rec} className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">{rec.replace('_', ' ')}</span>
                          <span className="text-sm text-gray-600">{recCount} deals ({percentage.toFixed(0)}%)</span>
                        </div>
                        <Progress value={percentage} className="h-2" />
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Award className="h-5 w-5 mr-2 text-yellow-600" />
                  Model Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Average Score</span>
                    <span className="font-semibold">{analytics.averageScore?.toFixed(0) || 0}/100</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Average Confidence</span>
                    <span className="font-semibold">{((analytics.averageConfidence || 0) * 100).toFixed(0)}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Strong Buy Rate</span>
                    <span className="font-semibold">{((analytics.strongBuyCount || 0) / (analytics.totalOpportunities || 1) * 100).toFixed(0)}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Processing Speed</span>
                    <span className="font-semibold">2.3 sec/deal</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
                  Portfolio Projections
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Target Portfolio IRR</span>
                    <span className="font-semibold text-green-600">{formatPercentage(analytics.avgTargetIRR || 0.22)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Risk-Adjusted Return</span>
                    <span className="font-semibold">{formatPercentage((analytics.avgTargetIRR || 0.22) * 0.85)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Expected MOIC</span>
                    <span className="font-semibold text-blue-600">2.7x</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Capital Deployment</span>
                    <span className="font-semibold">{formatCurrency(635000000)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Zap className="h-5 w-5 mr-2 text-purple-600" />
                  AI Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-blue-900 text-sm">Market Opportunity</h4>
                    <p className="text-blue-700 text-xs mt-1">Technology sector showing strong growth signals with 3 high-scoring opportunities</p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <h4 className="font-semibold text-green-900 text-sm">Portfolio Balance</h4>
                    <p className="text-green-700 text-xs mt-1">Current pipeline provides good sector diversification</p>
                  </div>
                  <div className="p-3 bg-yellow-50 rounded-lg">
                    <h4 className="font-semibold text-yellow-900 text-sm">Risk Alert</h4>
                    <p className="text-yellow-700 text-xs mt-1">Monitor regulatory risks in FinServ deals</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default InvestmentRecommendationDashboard