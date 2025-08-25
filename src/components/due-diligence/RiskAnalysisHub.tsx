'use client'

import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useNavigationStoreRefactored } from '@/stores/navigation-store-refactored'
import { useDueDiligence } from '@/contexts/DueDiligenceContext'
import { RiskHeatMap } from './RiskHeatMap'
import { RiskScoring } from './RiskScoring'
import { 
  AlertTriangle,
  Shield,
  Brain,
  TrendingUp,
  TrendingDown,
  Activity,
  Target,
  Zap,
  Eye,
  Plus,
  Filter,
  Download,
  MoreHorizontal
} from 'lucide-react'

interface RiskAnalysisHubProps {
  projectId: string
}

export function RiskAnalysisHub({ projectId }: RiskAnalysisHubProps) {
  const { currentMode, addRecommendation, addInsight } = useNavigationStoreRefactored()
  const { addRisk, updateRisk } = useDueDiligence()

  // Sample risk data - replace with real API calls
  const [risks] = React.useState([
    {
      id: '1',
      title: 'Customer Concentration Risk',
      category: 'commercial' as const,
      level: 'high' as const,
      probability: 'high' as const,
      impact: 'high' as const,
      riskScore: 8.5,
      status: 'identified' as const,
      description: 'Top 3 customers represent 67% of total revenue, significantly above industry average of 35%',
      mitigation: 'Develop customer diversification plan, identify new market segments',
      identifiedDate: new Date('2025-07-20'),
      aiGenerated: true,
      confidenceLevel: 0.94,
      similarRisks: ['retail-co-concentration', 'saas-co-dependency']
    },
    {
      id: '2',
      title: 'EBITDA Margin Decline',
      category: 'financial' as const,
      level: 'medium' as const,
      probability: 'medium' as const,
      impact: 'high' as const,
      riskScore: 6.8,
      status: 'assessing' as const,
      description: 'EBITDA margins declining from 23% to 15% over 3 years, below industry average of 22%',
      mitigation: 'Operational efficiency review, cost structure optimization',
      identifiedDate: new Date('2025-07-19'),
      aiGenerated: true,
      confidenceLevel: 0.87,
      similarRisks: ['tech-corp-margins', 'growth-co-efficiency']
    },
    {
      id: '3',
      title: 'Key Personnel Dependency',
      category: 'operational' as const,
      level: 'medium' as const,
      probability: 'medium' as const,
      impact: 'medium' as const,
      riskScore: 5.2,
      status: 'mitigating' as const,
      description: 'Heavy reliance on CTO and VP Sales, limited succession planning',
      mitigation: 'Retention packages, knowledge transfer plans, backup hiring',
      identifiedDate: new Date('2025-07-18'),
      aiGenerated: false,
      confidenceLevel: 0.0,
      similarRisks: []
    },
    {
      id: '4',
      title: 'Regulatory Compliance Gap',
      category: 'regulatory' as const,
      level: 'high' as const,
      probability: 'medium' as const,
      impact: 'high' as const,
      riskScore: 7.2,
      status: 'identified' as const,
      description: 'GDPR compliance framework incomplete, potential for significant penalties',
      mitigation: 'Engage compliance consultants, implement privacy framework',
      identifiedDate: new Date('2025-07-21'),
      aiGenerated: true,
      confidenceLevel: 0.91,
      similarRisks: ['data-co-gdpr', 'eu-expansion-compliance']
    },
    {
      id: '5',
      title: 'Minor Office Lease Issue',
      category: 'operational' as const,
      level: 'low' as const,
      probability: 'low' as const,
      impact: 'low' as const,
      riskScore: 2.1,
      status: 'mitigating' as const,
      description: 'Office lease expires 6 months post-closing, standard renewal expected',
      mitigation: 'Negotiate lease renewal with landlord during transaction',
      identifiedDate: new Date('2025-07-20'),
      aiGenerated: false,
      confidenceLevel: 0.0,
      similarRisks: []
    }
  ])

  // AI-generated insights
  React.useEffect(() => {
    if (currentMode.mode !== 'traditional') {
      const riskInsights = [
        {
          id: `risk-insight-${projectId}-1`,
          type: 'pattern' as const,
          title: 'Risk Pattern Analysis',
          description: 'Detected concentration risk pattern similar to 3 previous deals. Historical mitigation success rate: 78%',
          confidence: 0.89,
          impact: 'high' as const,
          category: 'risk-analysis',
          module: 'due-diligence',
          actionable: true,
          actions: [
            {
              id: 'apply-mitigation',
              label: 'Apply Standard Mitigation',
              description: 'Use proven mitigation strategies from similar deals',
              action: 'APPLY_RISK_MITIGATION',
              estimatedTimeSaving: 120
            }
          ]
        }
      ]

      riskInsights.forEach(insight => addInsight(insight))

      const riskRecommendations = [
        {
          id: `risk-rec-${projectId}-1`,
          type: 'automation' as const,
          priority: 'medium' as const,
          title: 'Automate Risk Scoring',
          description: 'AI can calculate risk scores for new findings based on historical data and industry benchmarks.',
          actions: [
            {
              id: 'auto-scoring',
              label: 'Enable Auto-Scoring',
              action: 'ENABLE_RISK_SCORING',
              primary: true,
              estimatedTimeSaving: 60
            }
          ],
          confidence: 0.92,
          moduleContext: 'due-diligence',
          timestamp: new Date('2025-07-21T12:00:00')
        }
      ]

      riskRecommendations.forEach(rec => addRecommendation(rec))
    }
  }, [currentMode.mode, projectId, addInsight, addRecommendation])

  const riskDistribution = {
    high: risks.filter(r => r.level === 'high').length,
    medium: risks.filter(r => r.level === 'medium').length,
    low: risks.filter(r => r.level === 'low').length
  }

  const categoryDistribution = risks.reduce((acc, risk) => {
    acc[risk.category] = (acc[risk.category] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const renderTraditionalView = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold flex items-center">
            <Shield className="w-5 h-5 mr-2 text-red-500" />
            Risk Analysis
          </h2>
          <p className="text-gray-600">Comprehensive risk assessment and mitigation planning</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Risk
          </Button>
        </div>
      </div>

      {/* Risk Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-red-600">{riskDistribution.high}</div>
                <div className="text-sm text-gray-600">High Risk</div>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-orange-600">{riskDistribution.medium}</div>
                <div className="text-sm text-gray-600">Medium Risk</div>
              </div>
              <AlertTriangle className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-green-600">{riskDistribution.low}</div>
                <div className="text-sm text-gray-600">Low Risk</div>
              </div>
              <Shield className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-blue-600">{risks.length}</div>
                <div className="text-sm text-gray-600">Total Risks</div>
              </div>
              <Activity className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Risk List */}
      <Card>
        <CardHeader>
          <CardTitle>Risk Register</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {risks.map((risk) => (
              <RiskCard key={risk.id} risk={risk} mode="traditional" />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderAssistedView = () => (
    <div className="space-y-6">
      {/* AI-Enhanced Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold flex items-center">
            <Shield className="w-5 h-5 mr-2 text-red-500" />
            AI-Enhanced Risk Analysis
            <Badge variant="ai" className="ml-3">Smart Scoring</Badge>
          </h2>
          <p className="text-gray-600">Intelligent risk assessment with pattern recognition and mitigation suggestions</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="ai" size="sm">
            <Brain className="w-4 h-4 mr-2" />
            Generate Insights
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Risk
          </Button>
        </div>
      </div>

      {/* AI Insights Banner */}
      <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-blue-50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Brain className="w-5 h-5 text-blue-600" />
              <div>
                <h3 className="font-semibold text-blue-800">Risk Pattern Analysis Complete</h3>
                <p className="text-sm text-blue-600">
                  Found 2 high-confidence risk patterns with proven mitigation strategies
                </p>
              </div>
            </div>
            <Badge variant="ai">94% Confidence</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Risk Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-red-400">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Risk Score</span>
              <Brain className="w-4 h-4 text-blue-500" />
            </div>
            <div className="text-2xl font-bold text-red-600">7.2/10</div>
            <div className="text-xs text-red-600 mb-2">Above average</div>
            <div className="text-xs text-blue-600 bg-blue-50 p-2 rounded">
              💡 Customer concentration main driver
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-400">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Mitigation Rate</span>
              <TrendingUp className="w-4 h-4 text-green-500" />
            </div>
            <div className="text-2xl font-bold text-green-600">78%</div>
            <div className="text-xs text-green-600 mb-2">Historical success</div>
            <div className="text-xs text-blue-600 bg-blue-50 p-2 rounded">
              💡 Similar deals show good outcomes
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-400">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">AI Automation</span>
              <Zap className="w-4 h-4 text-yellow-500" />
            </div>
            <div className="text-2xl font-bold text-blue-600">60%</div>
            <div className="text-xs text-blue-600 mb-2">Tasks automated</div>
            <div className="text-xs text-green-600 bg-green-50 p-2 rounded">
              ⏱ Saved 3.2 hours this week
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-400">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Confidence</span>
              <Target className="w-4 h-4 text-blue-500" />
            </div>
            <div className="text-2xl font-bold text-blue-600">91%</div>
            <div className="text-xs text-blue-600 mb-2">AI accuracy</div>
            <div className="text-xs text-blue-600 bg-blue-50 p-2 rounded">
              🎯 High prediction reliability
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Risk Heat Map */}
        <div className="lg:col-span-2">
          <RiskHeatMap risks={risks} />
        </div>

        {/* AI Risk Scoring */}
        <RiskScoring risks={risks} />
      </div>

      {/* Enhanced Risk List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>AI-Enhanced Risk Register</span>
            <Badge variant="ai" className="text-xs">Auto-scored</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {risks.map((risk) => (
              <RiskCard key={risk.id} risk={risk} mode="assisted" />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderAutonomousView = () => (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* AI Conversation Interface */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start space-x-4">
            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
              <Shield className="w-4 h-4 text-red-600" />
            </div>
            <div className="flex-1">
              <div className="bg-red-50 rounded-lg p-4 mb-4">
                <p className="text-sm mb-2">
                  <strong>Risk Analysis Update:</strong> I've identified 4 significant risks requiring attention.
                </p>
                <p className="text-sm">
                  2 risks are high priority and need immediate mitigation planning. I can automate the standard responses.
                </p>
              </div>

              {/* High Priority Risks */}
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <h4 className="font-medium text-red-800 mb-3">🚨 High Priority Risks</h4>
                <div className="space-y-3">
                  <div className="bg-white rounded p-3">
                    <h5 className="font-medium">Customer Concentration (Score: 8.5/10)</h5>
                    <p className="text-sm text-gray-600 mb-2">Top 3 customers = 67% revenue vs 35% industry average</p>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="destructive">Flag as Deal Breaker</Button>
                      <Button size="sm" variant="outline">Apply Standard Mitigation</Button>
                    </div>
                  </div>
                  <div className="bg-white rounded p-3">
                    <h5 className="font-medium">Regulatory Compliance Gap (Score: 7.2/10)</h5>
                    <p className="text-sm text-gray-600 mb-2">GDPR framework incomplete - potential penalties</p>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="destructive">Require Pre-Close Fix</Button>
                      <Button size="sm" variant="outline">Price Adjustment</Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Automated Actions */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-medium text-green-800 mb-3">✅ Automated Risk Actions</h4>
                <div className="space-y-2 text-sm text-green-700">
                  <div>• Calculated risk scores using industry benchmarks</div>
                  <div>• Applied mitigation templates from similar deals</div>
                  <div>• Scheduled follow-up assessments</div>
                  <div>• Generated risk committee presentation</div>
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

// Risk Card Component
interface RiskCardProps {
  risk: any
  mode: 'traditional' | 'assisted' | 'autonomous'
}

function RiskCard({ risk, mode }: RiskCardProps) {
  const getRiskColor = (level: string) => {
    switch (level) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200'
      case 'medium': return 'text-orange-600 bg-orange-50 border-orange-200'
      case 'low': return 'text-green-600 bg-green-50 border-green-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  return (
    <div className={`border rounded-lg p-4 ${mode === 'assisted' && risk.aiGenerated ? 'border-l-4 border-l-blue-400' : ''}`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <h3 className="font-semibold">{risk.title}</h3>
            {mode === 'assisted' && risk.aiGenerated && (
              <Badge variant="ai" className="text-xs">
                <Brain className="w-3 h-3 mr-1" />
                AI Generated
              </Badge>
            )}
          </div>
          <p className="text-sm text-gray-600 mb-2">{risk.description}</p>
          {risk.mitigation && (
            <p className="text-sm text-blue-600">
              <strong>Mitigation:</strong> {risk.mitigation}
            </p>
          )}
        </div>
        
        <div className="ml-4 space-y-2">
          <Badge className={getRiskColor(risk.level)}>
            {risk.level} risk
          </Badge>
          <div className="text-sm text-gray-500">
            Score: {risk.riskScore}/10
          </div>
          {mode === 'assisted' && risk.confidenceLevel > 0 && (
            <div className="text-xs text-blue-600">
              {Math.round(risk.confidenceLevel * 100)}% confident
            </div>
          )}
        </div>
      </div>
      
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center space-x-4">
          <span className="text-gray-500">Category: {risk.category}</span>
          <span className="text-gray-500">Status: {risk.status}</span>
        </div>
        
        <div className="flex items-center space-x-2">
          {mode === 'assisted' && risk.similarRisks.length > 0 && (
            <Button variant="outline" size="sm" className="text-xs">
              <TrendingUp className="w-3 h-3 mr-1" />
              View Similar ({risk.similarRisks.length})
            </Button>
          )}
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}