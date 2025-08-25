'use client'

import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useNavigationStoreRefactored } from '@/stores/navigation-store-refactored'
import { aiRiskEngine } from '@/lib/ai-risk-engine'
import { 
  AlertTriangle,
  Shield,
  Brain,
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  Target,
  Zap,
  CheckCircle,
  Clock,
  Eye,
  AlertCircle,
  Lightbulb,
  Sparkles,
  RefreshCw,
  Download,
  FileText,
  Users,
  DollarSign,
  Building,
  Globe,
  Calculator,
  Play,
  Pause,
  Settings,
  ChevronRight,
  ChevronDown,
  ArrowUp,
  ArrowDown,
  Minus,
  Filter
} from 'lucide-react'

interface RiskCategory {
  id: string
  name: string
  description: string
  weight: number
  risks: Risk[]
  overallScore: number
  trend: 'improving' | 'stable' | 'deteriorating'
}

interface Risk {
  id: string
  name: string
  description: string
  category: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  probability: number // 0-1
  impact: number // 0-1
  riskScore: number // calculated
  status: 'identified' | 'analyzing' | 'mitigated' | 'accepted' | 'monitoring'
  
  // AI analysis
  aiGenerated: boolean
  confidence: number
  detectionDate: Date
  lastUpdated: Date
  
  // Risk details
  triggers: string[]
  indicators: string[]
  mitigation: {
    strategy: string
    actions: string[]
    timeframe: string
    cost: number
    effectiveness: number
  }
  
  // Historical context
  industryBenchmark?: number
  similarDeals: string[]
  precedents: string[]
  
  // Quantitative impact
  financialImpact: {
    bestCase: number
    worstCase: number
    expectedCase: number
    probability: number
  }
}

interface AutomatedRiskAssessmentProps {
  projectId: string
  dealData: {
    sector: string
    revenue: number
    growth: number
    ebitda: number
    employees: number
    geography: string
  }
}

export function AutomatedRiskAssessment({ projectId, dealData }: AutomatedRiskAssessmentProps) {
  const { currentMode, trackInteraction, addRecommendation } = useNavigationStoreRefactored()
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>('financial')
  const [expandedRisks, setExpandedRisks] = React.useState<Set<string>>(new Set())
  const [analysisRunning, setAnalysisRunning] = React.useState(false)
  const [refreshing, setRefreshing] = React.useState(false)

  // Sample risk assessment data with AI-generated risks
  const [riskCategories] = React.useState<RiskCategory[]>([
    {
      id: 'financial',
      name: 'Financial Risks',
      description: 'Revenue, profitability, and financial stability risks',
      weight: 0.3,
      overallScore: 6.8,
      trend: 'stable',
      risks: [
        {
          id: 'fin-001',
          name: 'Customer Concentration Risk',
          description: 'High dependency on top customers creating revenue volatility',
          category: 'financial',
          severity: 'high',
          probability: 0.75,
          impact: 0.85,
          riskScore: 7.8,
          status: 'identified',
          aiGenerated: true,
          confidence: 0.94,
          detectionDate: new Date('2025-07-21T10:30:00'),
          lastUpdated: new Date('2025-07-21T10:30:00'),
          triggers: ['Top 3 customers = 67% revenue', 'Limited diversification efforts'],
          indicators: ['Customer concentration ratio', 'Revenue volatility', 'Customer churn patterns'],
          mitigation: {
            strategy: 'Customer diversification and retention program',
            actions: [
              'Implement enterprise sales program',
              'Develop mid-market customer acquisition',
              'Create customer success initiatives',
              'Negotiate longer-term contracts'
            ],
            timeframe: '12-18 months',
            cost: 450000,
            effectiveness: 0.75
          },
          industryBenchmark: 0.35,
          similarDeals: ['CloudCo-2024', 'SaasTech-2023'],
          precedents: ['Similar concentration led to 15% valuation discount'],
          financialImpact: {
            bestCase: -500000,
            worstCase: -3200000,
            expectedCase: -1400000,
            probability: 0.65
          }
        },
        {
          id: 'fin-002',
          name: 'Margin Compression Risk',
          description: 'Declining EBITDA margins due to competitive pressure',
          category: 'financial',
          severity: 'medium',
          probability: 0.55,
          impact: 0.65,
          riskScore: 5.9,
          status: 'analyzing',
          aiGenerated: true,
          confidence: 0.87,
          detectionDate: new Date('2025-07-21T09:45:00'),
          lastUpdated: new Date('2025-07-21T11:15:00'),
          triggers: ['Increasing competition', 'Pricing pressure', 'Rising operational costs'],
          indicators: ['Gross margin trends', 'Competitive pricing', 'Cost per acquisition'],
          mitigation: {
            strategy: 'Operational efficiency and value proposition enhancement',
            actions: [
              'Implement cost optimization program',
              'Enhance product differentiation',
              'Automate routine processes',
              'Negotiate better vendor terms'
            ],
            timeframe: '6-12 months',
            cost: 280000,
            effectiveness: 0.68
          },
          industryBenchmark: 0.23,
          similarDeals: ['Enterprise-Sol-2024'],
          precedents: [],
          financialImpact: {
            bestCase: -200000,
            worstCase: -1800000,
            expectedCase: -800000,
            probability: 0.45
          }
        }
      ]
    },
    {
      id: 'commercial',
      name: 'Commercial Risks',
      description: 'Market competition, customer, and product risks',
      weight: 0.25,
      overallScore: 5.4,
      trend: 'improving',
      risks: [
        {
          id: 'com-001',
          name: 'Market Saturation Risk',
          description: 'Slowing growth in core market segments',
          category: 'commercial',
          severity: 'medium',
          probability: 0.60,
          impact: 0.70,
          riskScore: 6.2,
          status: 'monitoring',
          aiGenerated: true,
          confidence: 0.82,
          detectionDate: new Date('2025-07-21T08:20:00'),
          lastUpdated: new Date('2025-07-21T10:45:00'),
          triggers: ['Market growth slowing', 'Increased competition', 'Customer acquisition costs rising'],
          indicators: ['Market growth rates', 'CAC trends', 'Win rates'],
          mitigation: {
            strategy: 'Market expansion and product innovation',
            actions: [
              'Expand to adjacent markets',
              'Develop new product features',
              'International expansion',
              'Partnership development'
            ],
            timeframe: '18-24 months',
            cost: 750000,
            effectiveness: 0.72
          },
          industryBenchmark: 0.15,
          similarDeals: [],
          precedents: [],
          financialImpact: {
            bestCase: -300000,
            worstCase: -2100000,
            expectedCase: -950000,
            probability: 0.50
          }
        }
      ]
    },
    {
      id: 'operational',
      name: 'Operational Risks',
      description: 'People, process, and operational execution risks',
      weight: 0.20,
      overallScore: 4.8,
      trend: 'stable',
      risks: [
        {
          id: 'ops-001',
          name: 'Key Person Dependency',
          description: 'High reliance on founder and key executives',
          category: 'operational',
          severity: 'medium',
          probability: 0.40,
          impact: 0.75,
          riskScore: 5.2,
          status: 'mitigated',
          aiGenerated: true,
          confidence: 0.90,
          detectionDate: new Date('2025-07-20T16:30:00'),
          lastUpdated: new Date('2025-07-21T09:00:00'),
          triggers: ['Limited management depth', 'Founder involvement in day-to-day', 'No succession planning'],
          indicators: ['Management team depth', 'Knowledge documentation', 'Decision-making centralization'],
          mitigation: {
            strategy: 'Management team strengthening and knowledge transfer',
            actions: [
              'Hire senior management',
              'Implement retention programs',
              'Document key processes',
              'Develop succession plans'
            ],
            timeframe: '6-12 months',
            cost: 320000,
            effectiveness: 0.85
          },
          industryBenchmark: 0.25,
          similarDeals: ['Enterprise-Sol-2024'],
          precedents: ['Management departure led to 6-month operational disruption'],
          financialImpact: {
            bestCase: -150000,
            worstCase: -1200000,
            expectedCase: -420000,
            probability: 0.35
          }
        }
      ]
    },
    {
      id: 'technical',
      name: 'Technology Risks',
      description: 'IT infrastructure, security, and technology risks',
      weight: 0.15,
      overallScore: 7.2,
      trend: 'deteriorating',
      risks: [
        {
          id: 'tech-001',
          name: 'Cybersecurity Vulnerabilities',
          description: 'Critical security gaps in IT infrastructure',
          category: 'technical',
          severity: 'high',
          probability: 0.70,
          impact: 0.90,
          riskScore: 8.1,
          status: 'identified',
          aiGenerated: true,
          confidence: 0.96,
          detectionDate: new Date('2025-07-21T07:15:00'),
          lastUpdated: new Date('2025-07-21T11:30:00'),
          triggers: ['Outdated security systems', 'Limited security monitoring', 'Compliance gaps'],
          indicators: ['Security audit findings', 'Incident frequency', 'Compliance status'],
          mitigation: {
            strategy: 'Comprehensive security upgrade program',
            actions: [
              'Implement advanced threat detection',
              'Upgrade legacy systems',
              'Enhanced staff training',
              'Third-party security assessment'
            ],
            timeframe: '3-6 months',
            cost: 180000,
            effectiveness: 0.92
          },
          industryBenchmark: 0.15,
          similarDeals: [],
          precedents: ['Data breach cost average $4.8M in similar companies'],
          financialImpact: {
            bestCase: -100000,
            worstCase: -4800000,
            expectedCase: -850000,
            probability: 0.25
          }
        }
      ]
    },
    {
      id: 'regulatory',
      name: 'Regulatory & Legal',
      description: 'Compliance, legal, and regulatory risks',
      weight: 0.10,
      overallScore: 3.9,
      trend: 'improving',
      risks: [
        {
          id: 'reg-001',
          name: 'Data Privacy Compliance',
          description: 'GDPR and data privacy regulation compliance gaps',
          category: 'regulatory',
          severity: 'medium',
          probability: 0.45,
          impact: 0.55,
          riskScore: 4.1,
          status: 'monitoring',
          aiGenerated: true,
          confidence: 0.85,
          detectionDate: new Date('2025-07-20T14:45:00'),
          lastUpdated: new Date('2025-07-21T08:30:00'),
          triggers: ['EU operations expansion', 'Customer data handling', 'Limited privacy controls'],
          indicators: ['Compliance audits', 'Data handling processes', 'Privacy policy updates'],
          mitigation: {
            strategy: 'Privacy compliance enhancement program',
            actions: [
              'GDPR compliance audit',
              'Privacy policy updates',
              'Staff training programs',
              'Data handling improvements'
            ],
            timeframe: '4-8 months',
            cost: 95000,
            effectiveness: 0.88
          },
          industryBenchmark: 0.10,
          similarDeals: [],
          precedents: [],
          financialImpact: {
            bestCase: -25000,
            worstCase: -500000,
            expectedCase: -120000,
            probability: 0.20
          }
        }
      ]
    }
  ])

  // AI workflow recommendations
  React.useEffect(() => {
    if (currentMode.mode !== 'traditional') {
      const criticalRisks = riskCategories.flatMap(cat => 
        cat.risks.filter(risk => risk.severity === 'critical' || risk.riskScore >= 7.5)
      )
      
      const highImpactRisks = riskCategories.flatMap(cat =>
        cat.risks.filter(risk => risk.financialImpact.worstCase <= -1000000)
      )

      if (criticalRisks.length > 0) {
        addRecommendation({
          id: `critical-risks-${projectId}`,
          type: 'warning',
          priority: 'critical',
          title: `${criticalRisks.length} Critical Risks Detected`,
          description: `AI has identified ${criticalRisks.length} high-severity risks requiring immediate attention. Combined potential impact: ${new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD', minimumFractionDigits: 0}).format(criticalRisks.reduce((sum, risk) => sum + risk.financialImpact.expectedCase, 0))}`,
          actions: [{
            id: 'address-critical',
            label: 'Address Critical Risks',
            action: 'ADDRESS_CRITICAL_RISKS',
            primary: true
          }, {
            id: 'generate-mitigation',
            label: 'Generate Mitigation Plan',
            action: 'GENERATE_MITIGATION_PLAN'
          }],
          confidence: 0.92,
          moduleContext: 'due-diligence',
          timestamp: new Date()
        })
      }

      if (highImpactRisks.length > 0) {
        addRecommendation({
          id: `financial-impact-${projectId}`,
          type: 'insight',
          priority: 'high',
          title: 'High Financial Impact Risks',
          description: `${highImpactRisks.length} risks have potential financial impact exceeding $1M each. Consider deal structure adjustments.`,
          actions: [{
            id: 'review-structure',
            label: 'Review Deal Structure',
            action: 'REVIEW_DEAL_STRUCTURE'
          }],
          confidence: 0.88,
          moduleContext: 'due-diligence',
          timestamp: new Date()
        })
      }

      // Automated mitigation recommendation
      const unmitigatedRisks = riskCategories.flatMap(cat =>
        cat.risks.filter(risk => risk.status === 'identified')
      )

      if (unmitigatedRisks.length > 0) {
        addRecommendation({
          id: `auto-mitigation-${projectId}`,
          type: 'automation',
          priority: 'medium',
          title: 'Automate Risk Mitigation Planning',
          description: `AI can generate detailed mitigation plans for ${unmitigatedRisks.length} identified risks based on industry best practices.`,
          actions: [{
            id: 'auto-mitigation',
            label: 'Generate Plans',
            action: 'AUTO_GENERATE_MITIGATION',
            estimatedTimeSaving: unmitigatedRisks.length * 30
          }],
          confidence: 0.86,
          moduleContext: 'due-diligence',
          timestamp: new Date()
        })
      }
    }
  }, [currentMode.mode, projectId, addRecommendation])

  const handleRunAnalysis = async () => {
    setAnalysisRunning(true)
    
    trackInteraction({
      interactionType: 'automation_approved',
      userAction: 'accepted',
      module: 'due-diligence',
      context: {
        action: 'run_risk_analysis',
        dealData,
        riskCategories: riskCategories.length
      }
    })

    // Simulate AI analysis
    setTimeout(() => {
      setAnalysisRunning(false)
    }, 3000)
  }

  const handleRefreshAnalysis = async () => {
    setRefreshing(true)
    setTimeout(() => setRefreshing(false), 2000)
  }

  const toggleRiskExpansion = (riskId: string) => {
    const newExpanded = new Set(expandedRisks)
    if (newExpanded.has(riskId)) {
      newExpanded.delete(riskId)
    } else {
      newExpanded.add(riskId)
    }
    setExpandedRisks(newExpanded)
  }

  const getSeverityColor = (severity: Risk['severity']) => {
    switch (severity) {
      case 'critical': return 'text-red-800 bg-red-100 border-red-300'
      case 'high': return 'text-red-700 bg-red-50 border-red-200'
      case 'medium': return 'text-orange-700 bg-orange-50 border-orange-200'
      case 'low': return 'text-green-700 bg-green-50 border-green-200'
    }
  }

  const getStatusColor = (status: Risk['status']) => {
    switch (status) {
      case 'identified': return 'text-red-600 bg-red-50 border-red-200'
      case 'analyzing': return 'text-blue-600 bg-blue-50 border-blue-200'
      case 'mitigated': return 'text-green-600 bg-green-50 border-green-200'
      case 'accepted': return 'text-gray-600 bg-gray-50 border-gray-200'
      case 'monitoring': return 'text-orange-600 bg-orange-50 border-orange-200'
    }
  }

  const getTrendIcon = (trend: RiskCategory['trend']) => {
    switch (trend) {
      case 'improving': return <ArrowDown className="w-4 h-4 text-green-500" />
      case 'deteriorating': return <ArrowUp className="w-4 h-4 text-red-500" />
      case 'stable': return <Minus className="w-4 h-4 text-gray-500" />
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const calculateOverallRisk = () => {
    return riskCategories.reduce((total, cat) => total + (cat.overallScore * cat.weight), 0)
  }

  const renderRiskCard = (risk: Risk) => (
    <Card key={risk.id} className={`
      transition-all duration-200 hover:shadow-md
      ${risk.aiGenerated ? 'border-l-4 border-l-blue-400' : ''}
      ${risk.severity === 'critical' ? 'border-red-200 bg-red-50' : ''}
    `}>
      <CardHeader 
        className="cursor-pointer"
        onClick={() => toggleRiskExpansion(risk.id)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <AlertTriangle className={`w-5 h-5 ${
              risk.severity === 'critical' ? 'text-red-600' :
              risk.severity === 'high' ? 'text-orange-600' :
              risk.severity === 'medium' ? 'text-yellow-600' : 'text-green-600'
            }`} />
            <div>
              <CardTitle className="text-lg">{risk.name}</CardTitle>
              <p className="text-sm text-gray-600">{risk.description}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Badge className={`text-xs ${getSeverityColor(risk.severity)}`}>
              {risk.severity}
            </Badge>
            <Badge className={`text-xs ${getStatusColor(risk.status)}`}>
              {risk.status.replace('_', ' ')}
            </Badge>
            <div className="text-right">
              <div className="text-lg font-bold">{risk.riskScore.toFixed(1)}</div>
              <div className="text-xs text-gray-500">Risk Score</div>
            </div>
            {risk.aiGenerated && (
              <Badge variant="ai" className="text-xs">
                AI: {Math.round(risk.confidence * 100)}%
              </Badge>
            )}
            {expandedRisks.has(risk.id) ? 
              <ChevronDown className="w-4 h-4" /> : 
              <ChevronRight className="w-4 h-4" />
            }
          </div>
        </div>
      </CardHeader>

      {expandedRisks.has(risk.id) && (
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Risk Analysis */}
            <div>
              <h4 className="font-medium mb-3 flex items-center">
                <BarChart3 className="w-4 h-4 mr-2 text-blue-600" />
                Risk Analysis
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Probability:</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${risk.probability * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium">{Math.round(risk.probability * 100)}%</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm">Impact:</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-red-600 h-2 rounded-full" 
                        style={{ width: `${risk.impact * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium">{Math.round(risk.impact * 100)}%</span>
                  </div>
                </div>
              </div>

              {/* Financial Impact */}
              <div className="mt-4">
                <h5 className="font-medium text-sm mb-2">Financial Impact Range:</h5>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span>Best Case:</span>
                    <span className="font-medium">{formatCurrency(risk.financialImpact.bestCase)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Expected:</span>
                    <span className="font-medium">{formatCurrency(risk.financialImpact.expectedCase)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Worst Case:</span>
                    <span className="font-medium text-red-600">{formatCurrency(risk.financialImpact.worstCase)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Mitigation Plan */}
            <div>
              <h4 className="font-medium mb-3 flex items-center">
                <Shield className="w-4 h-4 mr-2 text-green-600" />
                Mitigation Strategy
              </h4>
              <div className="space-y-3">
                <div>
                  <span className="text-sm font-medium">Strategy:</span>
                  <p className="text-sm text-gray-700 mt-1">{risk.mitigation.strategy}</p>
                </div>
                
                <div>
                  <span className="text-sm font-medium">Actions:</span>
                  <ul className="text-sm text-gray-700 mt-1 space-y-1">
                    {risk.mitigation.actions.map((action, index) => (
                      <li key={index}>• {action}</li>
                    ))}
                  </ul>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Timeframe:</span>
                    <div>{risk.mitigation.timeframe}</div>
                  </div>
                  <div>
                    <span className="font-medium">Cost:</span>
                    <div>{formatCurrency(risk.mitigation.cost)}</div>
                  </div>
                  <div>
                    <span className="font-medium">Effectiveness:</span>
                    <div>{Math.round(risk.mitigation.effectiveness * 100)}%</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* AI Insights */}
          {risk.aiGenerated && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium mb-2 flex items-center text-blue-800">
                <Brain className="w-4 h-4 mr-2" />
                AI Analysis Insights
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="font-medium text-blue-700">Triggers:</span>
                  <ul className="text-blue-600 mt-1">
                    {risk.triggers.map((trigger, index) => (
                      <li key={index}>• {trigger}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <span className="font-medium text-blue-700">Indicators:</span>
                  <ul className="text-blue-600 mt-1">
                    {risk.indicators.map((indicator, index) => (
                      <li key={index}>• {indicator}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <span className="font-medium text-blue-700">Similar Deals:</span>
                  <div className="text-blue-600 mt-1">
                    {risk.similarDeals.length > 0 ? 
                      risk.similarDeals.join(', ') : 
                      'No similar patterns found'
                    }
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-6 flex space-x-3">
            <Button size="sm">
              <Shield className="w-4 h-4 mr-2" />
              Start Mitigation
            </Button>
            <Button variant="outline" size="sm">
              <Eye className="w-4 h-4 mr-2" />
              Monitor
            </Button>
            <Button variant="outline" size="sm">
              <Calculator className="w-4 h-4 mr-2" />
              Recalculate
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
          <h2 className="text-xl font-bold">Risk Assessment</h2>
          <p className="text-gray-600">Comprehensive risk analysis and mitigation planning</p>
        </div>
        <div className="flex items-center space-x-2">
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

      {/* Overall Risk Score */}
      <Card>
        <CardHeader>
          <CardTitle>Overall Risk Score</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <div className="text-4xl font-bold text-orange-600 mb-2">
              {calculateOverallRisk().toFixed(1)}
            </div>
            <div className="text-gray-600">Medium Risk Level</div>
          </div>
        </CardContent>
      </Card>

      {/* Risk Categories */}
      <div className="grid gap-4">
        {riskCategories.map((category) => (
          <Card 
            key={category.id}
            className={`cursor-pointer transition-colors ${
              selectedCategory === category.id ? 'border-blue-500 bg-blue-50' : ''
            }`}
            onClick={() => setSelectedCategory(selectedCategory === category.id ? null : category.id)}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <CardTitle>{category.name}</CardTitle>
                  <Badge variant="outline">{category.risks.length} risks</Badge>
                </div>
                <div className="flex items-center space-x-3">
                  {getTrendIcon(category.trend)}
                  <div className="text-right">
                    <div className="font-bold text-lg">{category.overallScore.toFixed(1)}</div>
                    <div className="text-sm text-gray-500">Score</div>
                  </div>
                </div>
              </div>
            </CardHeader>
            
            {selectedCategory === category.id && (
              <CardContent>
                <div className="space-y-4">
                  {category.risks.map(renderRiskCard)}
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>
    </div>
  )

  const renderAssistedView = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold flex items-center">
            <Brain className="w-5 h-5 mr-2 text-blue-500" />
            AI-Powered Risk Assessment
            <Badge variant="ai" className="ml-3">Smart Analysis</Badge>
          </h2>
          <p className="text-gray-600">Automated risk detection with intelligent mitigation strategies</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button 
            onClick={handleRunAnalysis}
            disabled={analysisRunning}
            variant="ai"
            size="sm"
          >
            {analysisRunning ? (
              <Clock className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Zap className="w-4 h-4 mr-2" />
            )}
            {analysisRunning ? 'Analyzing...' : 'Run AI Analysis'}
          </Button>
          <Button 
            onClick={handleRefreshAnalysis}
            disabled={refreshing}
            variant="outline" 
            size="sm"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* AI Analysis Status */}
      {analysisRunning && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Brain className="w-5 h-5 text-blue-600" />
              <div>
                <h3 className="font-semibold text-blue-800">AI Risk Analysis in Progress</h3>
                <p className="text-sm text-blue-600">
                  Analyzing deal data, market patterns, and industry benchmarks...
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Enhanced Risk Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-red-400">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Critical Risks</span>
              <AlertTriangle className="w-4 h-4 text-red-500" />
            </div>
            <div className="text-2xl font-bold text-red-600">
              {riskCategories.flatMap(cat => cat.risks).filter(r => r.severity === 'critical').length}
            </div>
            <div className="text-xs text-red-600 mb-2">Immediate attention</div>
            <div className="text-xs text-red-600 bg-red-50 p-2 rounded">
              🚨 Action required
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-orange-400">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Total Exposure</span>
              <DollarSign className="w-4 h-4 text-orange-500" />
            </div>
            <div className="text-2xl font-bold text-orange-600">
              {formatCurrency(
                riskCategories.flatMap(cat => cat.risks)
                  .reduce((sum, risk) => sum + risk.financialImpact.expectedCase, 0)
              ).replace('$-', '-$')}
            </div>
            <div className="text-xs text-orange-600 mb-2">Expected impact</div>
            <div className="text-xs text-orange-600 bg-orange-50 p-2 rounded">
              💰 Financial exposure
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-400">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">AI Generated</span>
              <Brain className="w-4 h-4 text-green-500" />
            </div>
            <div className="text-2xl font-bold text-green-600">
              {riskCategories.flatMap(cat => cat.risks).filter(r => r.aiGenerated).length}
            </div>
            <div className="text-xs text-green-600 mb-2">of {riskCategories.flatMap(cat => cat.risks).length} total risks</div>
            <div className="text-xs text-green-600 bg-green-50 p-2 rounded">
              🤖 AI detected
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-400">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Avg Confidence</span>
              <Target className="w-4 h-4 text-blue-500" />
            </div>
            <div className="text-2xl font-bold text-blue-600">
              {Math.round(
                riskCategories.flatMap(cat => cat.risks)
                  .filter(r => r.aiGenerated)
                  .reduce((sum, risk) => sum + risk.confidence, 0) /
                Math.max(1, riskCategories.flatMap(cat => cat.risks).filter(r => r.aiGenerated).length) * 100
              )}%
            </div>
            <div className="text-xs text-blue-600 mb-2">AI accuracy</div>
            <div className="text-xs text-blue-600 bg-blue-50 p-2 rounded">
              🎯 High confidence
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Risk Categories with Enhanced Display */}
      <div className="grid gap-4">
        {riskCategories.map((category) => (
          <Card 
            key={category.id}
            className={`cursor-pointer transition-all ${
              selectedCategory === category.id ? 'border-blue-500 shadow-lg' : ''
            }`}
            onClick={() => setSelectedCategory(selectedCategory === category.id ? null : category.id)}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <CardTitle>{category.name}</CardTitle>
                  <Badge variant="outline">{category.risks.length} risks</Badge>
                  {category.risks.some(r => r.aiGenerated) && (
                    <Badge variant="ai" className="text-xs">
                      {category.risks.filter(r => r.aiGenerated).length} AI
                    </Badge>
                  )}
                </div>
                <div className="flex items-center space-x-3">
                  {getTrendIcon(category.trend)}
                  <div className="text-right">
                    <div className="font-bold text-lg">{category.overallScore.toFixed(1)}</div>
                    <div className="text-sm text-gray-500">Risk Score</div>
                  </div>
                </div>
              </div>
            </CardHeader>
            
            {selectedCategory === category.id && (
              <CardContent>
                <div className="space-y-4">
                  {category.risks.map(renderRiskCard)}
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>
    </div>
  )

  const renderAutonomousView = () => {
    const criticalRisks = riskCategories.flatMap(cat => cat.risks).filter(r => r.severity === 'critical' || r.riskScore >= 7.5)
    
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-4 h-4 text-red-600" />
              </div>
              <div className="flex-1">
                <div className="bg-red-50 rounded-lg p-4 mb-4">
                  <p className="text-sm mb-2">
                    <strong>Risk Assessment Complete:</strong> Identified {riskCategories.flatMap(cat => cat.risks).length} risks across {riskCategories.length} categories.
                  </p>
                  <p className="text-sm">
                    {criticalRisks.length} critical risks require immediate attention with combined expected impact of {formatCurrency(criticalRisks.reduce((sum, risk) => sum + risk.financialImpact.expectedCase, 0))}.
                  </p>
                </div>

                {/* Critical Risks */}
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                  <h4 className="font-medium text-red-800 mb-3 flex items-center">
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    Critical Risks Requiring Action
                  </h4>
                  <div className="space-y-3">
                    {criticalRisks.slice(0, 3).map((risk) => (
                      <div key={risk.id} className="bg-white rounded p-3">
                        <div className="flex justify-between items-start mb-2">
                          <h5 className="font-medium">{risk.name}</h5>
                          <span className="text-sm font-bold text-red-600">
                            {risk.riskScore.toFixed(1)}/10
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{risk.description}</p>
                        <div className="text-sm mb-2">
                          <span className="font-medium">Expected Impact:</span> 
                          <span className="text-red-600 ml-1">{formatCurrency(risk.financialImpact.expectedCase)}</span>
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="destructive">Immediate Action</Button>
                          <Button size="sm" variant="outline">Generate Plan</Button>
                          <Button size="sm" variant="outline">Flag for Review</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Automated Actions */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-medium text-green-800 mb-3 flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Automated Risk Analysis Results
                  </h4>
                  <div className="grid grid-cols-2 gap-4 text-sm text-green-700">
                    <div>• Generated {riskCategories.flatMap(cat => cat.risks).filter(r => r.aiGenerated).length} AI-powered risk assessments</div>
                    <div>• Calculated financial impact scenarios</div>
                    <div>• Identified {riskCategories.flatMap(cat => cat.risks).flatMap(r => r.similarDeals).length} similar deal patterns</div>
                    <div>• Created mitigation strategies for all risks</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-6">
      {currentMode.mode === 'traditional' && renderTraditionalView()}
      {currentMode.mode === 'assisted' && renderAssistedView()}
      {currentMode.mode === 'autonomous' && renderAutonomousView()}
    </div>
  )
}