'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  Brain,
  Plus,
  DollarSign,
  TrendingUp,
  Users,
  Calendar,
  BarChart3,
  CreditCard,
  Banknote,
  Calculator,
  FileText,
  Eye,
  Edit,
  Send,
  Download,
  Building,
  Target,
  Clock,
  Zap,
  Sparkles,
  AlertTriangle,
  CheckCircle,
  Lightbulb,
  ArrowRight,
  MoreVertical,
  Briefcase,
  Star
} from 'lucide-react'
import { StandardizedKPICard } from '@/components/shared/StandardizedKPICard'
import { StandardizedAIPanel } from '@/components/shared/StandardizedAIPanel'
import { StandardizedSearchFilter } from '@/components/shared/StandardizedSearchFilter'
import { StandardizedLoading } from '@/components/shared/StandardizedStates'
import { generateModuleData } from '@/lib/mock-data-generator'
import { DESIGN_SYSTEM, getStatusColor } from '@/lib/design-system'

interface FundOperationsAssistedStandardizedProps {
  isLoading?: boolean
  onCreateCapitalCall?: () => void
  onViewFund?: (id: string) => void
  onProcessDistribution?: () => void
  onExecuteAIAction?: (actionId: string) => void
}

export function FundOperationsAssistedStandardized({
  isLoading = false,
  onCreateCapitalCall,
  onViewFund,
  onProcessDistribution,
  onExecuteAIAction
}: FundOperationsAssistedStandardizedProps) {
  const [activeView, setActiveView] = useState('overview')
  const [selectedFund, setSelectedFund] = useState('fund-1')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFilters, setSelectedFilters] = useState<string[]>([])
  
  const moduleData = generateModuleData('fund-operations')
  
  if (isLoading) {
    return <StandardizedLoading mode="assisted" message="AI is analyzing fund operations and optimizing workflows..." />
  }

  const enhancedMetrics = [
    {
      title: 'Total AUM',
      value: '$1.2B',
      change: '+8.5%',
      trend: 'up' as const,
      aiInsight: 'Outperforming benchmark by 3.2%',
      confidence: 92
    },
    {
      title: 'AI Efficiency Score',
      value: '94%',
      change: '+12%',
      trend: 'up' as const,
      aiInsight: 'Process automation saving 28 hrs/week',
      confidence: 89
    },
    {
      title: 'Predicted IRR',
      value: '21.4%',
      change: '+2.1%',
      trend: 'up' as const,
      aiInsight: 'ML models predict strong performance',
      confidence: 87
    },
    {
      title: 'Optimization Savings',
      value: '$2.1M',
      change: '+45%',
      trend: 'up' as const,
      aiInsight: 'Cost reduction through AI automation',
      confidence: 94
    }
  ]

  const aiRecommendations = [
    {
      id: '1',
      type: 'automation' as const,
      title: 'Automate Capital Call Processing',
      description: 'AI can process and distribute capital calls 3x faster with 99.2% accuracy',
      confidence: 95,
      impact: 'high' as const,
      timeToImplement: '2-3 days',
      actions: [
        { label: 'Enable Automation', action: 'ENABLE_CAPITAL_AUTOMATION', estimatedSaving: '12 hours/week' },
        { label: 'Review Settings', action: 'REVIEW_AUTOMATION' }
      ]
    },
    {
      id: '2',
      type: 'optimization' as const,
      title: 'LP Communication Enhancement',
      description: 'AI suggests personalized LP updates based on portfolio performance and preferences',
      confidence: 88,
      impact: 'medium' as const,
      timeToImplement: '1 week',
      actions: [
        { label: 'Generate Reports', action: 'GENERATE_LP_REPORTS' },
        { label: 'Customize Templates', action: 'CUSTOMIZE_TEMPLATES' }
      ]
    },
    {
      id: '3',
      type: 'risk' as const,
      title: 'Cash Flow Optimization Alert',
      description: 'ML models predict potential cash flow constraints in Growth Fund III by Q3',
      confidence: 91,
      impact: 'high' as const,
      timeToImplement: '2 weeks',
      actions: [
        { label: 'View Analysis', action: 'VIEW_CASHFLOW_ANALYSIS' },
        { label: 'Plan Mitigation', action: 'PLAN_MITIGATION' }
      ]
    }
  ]

  const smartInsights = [
    {
      id: '1',
      category: 'Performance Analytics',
      insight: 'Vintage 2021 funds outperforming by 15% vs benchmark',
      reasoning: 'Market timing and sector allocation optimization',
      impact: 'Potential for similar strategy in new vintage',
      confidence: 93
    },
    {
      id: '2',
      category: 'LP Relations',
      insight: 'AI identifies 5 LPs likely to increase commitments',
      reasoning: 'Based on engagement patterns and portfolio fit',
      impact: 'Opportunity for $125M additional commitments',
      confidence: 86
    },
    {
      id: '3',
      category: 'Operational Efficiency',
      insight: 'Fund operations 40% more efficient with AI assistance',
      reasoning: 'Automated workflows and predictive analytics',
      impact: 'Cost savings and improved LP satisfaction',
      confidence: 94
    }
  ]

  const aiEnhancedFunds = [
    {
      id: 'fund-1',
      name: 'Growth Fund III',
      vintage: '2022',
      status: 'ai-optimized',
      targetSize: '$500M',
      committed: '$475M',
      called: '$285M',
      distributed: '$52M',
      aiScore: 9.2,
      aiInsights: {
        performancePrediction: '18.3% IRR (vs 15.1% benchmark)',
        riskLevel: 'Low',
        nextRecommendation: 'Capital call timing optimal in 3-4 weeks'
      },
      lpCount: 42
    },
    {
      id: 'fund-2',
      name: 'Venture Fund II',
      vintage: '2021',
      status: 'outperforming',
      targetSize: '$300M',
      committed: '$300M',
      called: '$220M',
      distributed: '$95M',
      aiScore: 8.7,
      aiInsights: {
        performancePrediction: '22.1% IRR (vs 18.5% benchmark)',
        riskLevel: 'Very Low',
        nextRecommendation: 'Consider larger follow-on investments'
      },
      lpCount: 28
    },
    {
      id: 'fund-3',
      name: 'Opportunity Fund I',
      vintage: '2020',
      status: 'harvesting',
      targetSize: '$200M',
      committed: '$185M',
      called: '$160M',
      distributed: '$145M',
      aiScore: 9.5,
      aiInsights: {
        performancePrediction: '28.5% IRR (exceptional performance)',
        riskLevel: 'Very Low',
        nextRecommendation: 'Accelerate remaining exits'
      },
      lpCount: 18
    }
  ]

  const getAIStatusBadge = (status: string) => {
    switch (status) {
      case 'ai-optimized':
        return (
          <Badge style={{ backgroundColor: DESIGN_SYSTEM.colors.ai.info, color: DESIGN_SYSTEM.colors.ai.infoText }}>
            <Zap className="w-3 h-3 mr-1" />
            AI Optimized
          </Badge>
        )
      case 'outperforming':
        return (
          <Badge style={{ backgroundColor: DESIGN_SYSTEM.colors.ai.success, color: DESIGN_SYSTEM.colors.ai.successText }}>
            <Star className="w-3 h-3 mr-1" />
            Outperforming
          </Badge>
        )
      case 'harvesting':
        return (
          <Badge style={{ backgroundColor: DESIGN_SYSTEM.colors.ai.primary + '20', color: DESIGN_SYSTEM.colors.ai.primary }}>
            <Target className="w-3 h-3 mr-1" />
            Harvesting
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const currentFund = aiEnhancedFunds.find(f => f.id === selectedFund) || aiEnhancedFunds[0]

  const renderAIOverview = () => (
    <div className="space-y-6">
      {/* AI Enhancement Banner */}
      <Card style={{ 
        borderColor: DESIGN_SYSTEM.colors.ai.border,
        backgroundColor: 'linear-gradient(135deg, rgb(239, 246, 255), rgb(245, 243, 255))'
      }}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-3 rounded-lg" style={{ backgroundColor: DESIGN_SYSTEM.colors.ai.accent }}>
                <Brain className="w-6 h-6" style={{ color: DESIGN_SYSTEM.colors.ai.primary }} />
              </div>
              <div>
                <h3 className="font-semibold" style={{ color: DESIGN_SYSTEM.colors.ai.primary }}>
                  AI Fund Operations
                </h3>
                <p className="text-sm" style={{ color: DESIGN_SYSTEM.colors.ai.muted }}>
                  Automated processes, predictive analytics, and intelligent LP management
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="ai" className="flex items-center space-x-1">
                <Sparkles className="w-3 h-3" />
                <span>9 Optimizations</span>
              </Badge>
              <Badge variant="outline">3 Recommendations</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {enhancedMetrics.map((metric, index) => (
          <StandardizedKPICard
            key={index}
            {...metric}
            mode="assisted"
            type="ai"
          />
        ))}
      </div>

      {/* Fund Performance with AI Insights */}
      <Card style={{ borderColor: DESIGN_SYSTEM.colors.ai.border }}>
        <CardHeader>
          <CardTitle className="flex items-center" style={{ color: DESIGN_SYSTEM.colors.ai.primary }}>
            <Building className="w-5 h-5 mr-2" />
            AI-Enhanced Fund Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 mb-4">
            <select 
              value={selectedFund} 
              onChange={(e) => setSelectedFund(e.target.value)}
              className="border rounded-lg px-3 py-2"
              style={{ borderColor: DESIGN_SYSTEM.colors.ai.border }}
            >
              {aiEnhancedFunds.map((fund) => (
                <option key={fund.id} value={fund.id}>{fund.name}</option>
              ))}
            </select>
            {getAIStatusBadge(currentFund.status)}
            <Badge variant="outline">Vintage {currentFund.vintage}</Badge>
            <div className="flex items-center space-x-1">
              <Brain className="w-3 h-3" style={{ color: DESIGN_SYSTEM.colors.ai.primary }} />
              <span className="text-sm font-medium">{currentFund.aiScore}/10</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-gray-900">{currentFund.committed}</div>
                <div className="text-sm text-gray-600">Committed</div>
                <div className="text-xs text-gray-500 mt-1">of {currentFund.targetSize} target</div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{currentFund.called}</div>
                <div className="text-sm text-gray-600">Capital Called</div>
                <div className="text-xs text-gray-500 mt-1">AI-optimized timing</div>
              </div>
            </div>

            <div className="p-4 rounded-lg" style={{ backgroundColor: DESIGN_SYSTEM.colors.ai.accent }}>
              <h4 className="text-sm font-medium mb-3 flex items-center">
                <Sparkles className="w-4 h-4 mr-1" style={{ color: DESIGN_SYSTEM.colors.ai.primary }} />
                AI Performance Insights
              </h4>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-gray-600">Performance:</span>
                  <div className="font-medium" style={{ color: DESIGN_SYSTEM.colors.ai.primary }}>
                    {currentFund.aiInsights.performancePrediction}
                  </div>
                </div>
                <div>
                  <span className="text-gray-600">Risk Level:</span>
                  <div className="font-medium text-green-600">{currentFund.aiInsights.riskLevel}</div>
                </div>
                <div>
                  <span className="text-gray-600">Next Action:</span>
                  <div className="font-medium text-blue-600">{currentFund.aiInsights.nextRecommendation}</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* AI Recommendations */}
        <StandardizedAIPanel
          title="AI Fund Recommendations"
          recommendations={aiRecommendations}
          mode="assisted"
        />

        {/* Smart Insights */}
        <Card style={{ borderColor: DESIGN_SYSTEM.colors.ai.border }}>
          <CardHeader>
            <CardTitle className="flex items-center" style={{ color: DESIGN_SYSTEM.colors.ai.primary }}>
              <Lightbulb className="w-5 h-5 mr-2" />
              Strategic Intelligence
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {smartInsights.map((insight) => (
                <div key={insight.id} className="p-3 rounded-lg" style={{ backgroundColor: DESIGN_SYSTEM.colors.ai.accent }}>
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <Badge variant="outline" className="text-xs">{insight.category}</Badge>
                        <Badge variant="outline" className="text-xs">{insight.confidence}% confident</Badge>
                      </div>
                      <h4 className="text-sm font-medium">{insight.insight}</h4>
                      <p className="text-xs text-gray-600 mt-1">{insight.reasoning}</p>
                    </div>
                  </div>
                  <div className="text-xs font-medium" style={{ color: DESIGN_SYSTEM.colors.ai.success }}>
                    💰 {insight.impact}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Analytics Summary */}
      <Card style={{ borderColor: DESIGN_SYSTEM.colors.ai.border }}>
        <CardHeader>
          <CardTitle className="flex items-center" style={{ color: DESIGN_SYSTEM.colors.ai.primary }}>
            <Zap className="w-5 h-5 mr-2" />
            AI Operations Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 rounded-lg" style={{ backgroundColor: DESIGN_SYSTEM.colors.ai.success + '20' }}>
              <div className="text-2xl font-bold" style={{ color: DESIGN_SYSTEM.colors.ai.success }}>99.2%</div>
              <div className="text-sm font-medium">Process Accuracy</div>
              <div className="text-xs text-gray-600 mt-1">AI automation precision</div>
            </div>
            <div className="text-center p-4 rounded-lg" style={{ backgroundColor: DESIGN_SYSTEM.colors.ai.primary + '20' }}>
              <div className="text-2xl font-bold" style={{ color: DESIGN_SYSTEM.colors.ai.primary }}>28hrs</div>
              <div className="text-sm font-medium">Weekly Time Saved</div>
              <div className="text-xs text-gray-600 mt-1">Through AI optimization</div>
            </div>
            <div className="text-center p-4 rounded-lg" style={{ backgroundColor: DESIGN_SYSTEM.colors.ai.info + '20' }}>
              <div className="text-2xl font-bold" style={{ color: DESIGN_SYSTEM.colors.ai.info }}>$2.1M</div>
              <div className="text-sm font-medium">Cost Savings</div>
              <div className="text-xs text-gray-600 mt-1">Operational optimization</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderAIFunds = () => (
    <div className="space-y-4">
      {/* AI-Enhanced Search */}
      <StandardizedSearchFilter
        mode="assisted"
        onSearch={setSearchQuery}
        onFilterChange={setSelectedFilters}
        searchPlaceholder="AI-powered fund search..."
        availableFilters={[
          { id: 'ai-score-high', label: 'High AI Score (9+)', category: 'AI Score' },
          { id: 'ai-score-medium', label: 'Medium AI Score (8-9)', category: 'AI Score' },
          { id: 'status-optimized', label: 'AI Optimized', category: 'AI Status' },
          { id: 'status-outperforming', label: 'Outperforming', category: 'AI Status' },
          { id: 'vintage-2022', label: '2022 Vintage', category: 'Vintage' },
          { id: 'vintage-2021', label: '2021 Vintage', category: 'Vintage' }
        ]}
        aiSuggestions={[
          'Funds exceeding benchmark performance',
          'AI optimization opportunities',
          'Ready for capital deployment'
        ]}
      />

      {/* AI-Enhanced Funds */}
      <Card style={{ borderColor: DESIGN_SYSTEM.colors.ai.border }}>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center" style={{ color: DESIGN_SYSTEM.colors.ai.primary }}>
            <Briefcase className="w-5 h-5 mr-2" />
            AI-Enhanced Funds ({aiEnhancedFunds.length})
          </CardTitle>
          <Button style={{ backgroundColor: DESIGN_SYSTEM.colors.ai.primary }}>
            <Plus className="w-4 h-4 mr-2" />
            Create Fund
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {aiEnhancedFunds.map((fund) => (
              <div
                key={fund.id}
                className="border rounded-lg p-4 transition-all duration-200 cursor-pointer"
                style={{ 
                  borderColor: DESIGN_SYSTEM.colors.ai.border,
                  backgroundColor: 'transparent'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = DESIGN_SYSTEM.colors.ai.accent
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent'
                }}
                onClick={() => onViewFund?.(fund.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-semibold text-lg">{fund.name}</h3>
                      {getAIStatusBadge(fund.status)}
                      <Badge variant="outline">Vintage {fund.vintage}</Badge>
                      <div className="flex items-center space-x-1">
                        <Brain className="w-3 h-3" style={{ color: DESIGN_SYSTEM.colors.ai.primary }} />
                        <span className="text-sm font-medium">{fund.aiScore}/10</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                      <div>
                        <span className="text-gray-500">Target:</span>
                        <div className="font-medium">{fund.targetSize}</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Committed:</span>
                        <div className="font-medium">{fund.committed}</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Called:</span>
                        <div className="font-medium">{fund.called}</div>
                      </div>
                      <div>
                        <span className="text-gray-500">LPs:</span>
                        <div className="font-medium">{fund.lpCount}</div>
                      </div>
                    </div>

                    <div className="p-3 rounded-lg" style={{ backgroundColor: DESIGN_SYSTEM.colors.ai.accent }}>
                      <h4 className="text-sm font-medium mb-2 flex items-center">
                        <Sparkles className="w-3 h-3 mr-1" style={{ color: DESIGN_SYSTEM.colors.ai.primary }} />
                        AI Performance Analysis
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
                        <div>
                          <span className="text-gray-600">Prediction:</span>
                          <div className="font-medium">{fund.aiInsights.performancePrediction}</div>
                        </div>
                        <div>
                          <span className="text-gray-600">Risk Level:</span>
                          <div className="font-medium">{fund.aiInsights.riskLevel}</div>
                        </div>
                        <div>
                          <span className="text-gray-600">Next Action:</span>
                          <div className="font-medium text-blue-600">{fund.aiInsights.nextRecommendation}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <FileText className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )

  return (
    <div className="p-6" style={{ backgroundColor: DESIGN_SYSTEM.colors.ai.background }}>
      {/* Mode Indicator */}
      <div className="mb-6">
        <Badge style={{ 
          backgroundColor: DESIGN_SYSTEM.colors.ai.accent, 
          color: DESIGN_SYSTEM.colors.ai.primary,
          border: `1px solid ${DESIGN_SYSTEM.colors.ai.border}`
        }} className="flex items-center space-x-1 w-fit">
          <Brain className="h-3 w-3" />
          <span>Assisted Mode</span>
        </Badge>
      </div>

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">AI-Enhanced Fund Operations</h1>
        <p className="text-gray-600">
          Intelligent automation, predictive analytics, and optimized LP management
        </p>
      </div>

      {/* Navigation */}
      <div className="mb-6">
        <div className="flex space-x-1 bg-white rounded-lg p-1" style={{ border: `1px solid ${DESIGN_SYSTEM.colors.ai.border}` }}>
          <Button
            variant={activeView === 'overview' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveView('overview')}
            className="flex items-center space-x-2"
          >
            <Brain className="w-4 h-4" />
            <span>AI Overview</span>
          </Button>
          <Button
            variant={activeView === 'funds' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveView('funds')}
            className="flex items-center space-x-2"
          >
            <Briefcase className="w-4 h-4" />
            <span>Smart Funds</span>
          </Button>
          <Button
            variant={activeView === 'automation' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveView('automation')}
            className="flex items-center space-x-2"
          >
            <Zap className="w-4 h-4" />
            <span>Automation</span>
          </Button>
          <Button
            variant={activeView === 'analytics' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveView('analytics')}
            className="flex items-center space-x-2"
          >
            <BarChart3 className="w-4 h-4" />
            <span>Predictive Analytics</span>
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-6">
        {activeView === 'overview' && renderAIOverview()}
        {activeView === 'funds' && renderAIFunds()}
        {activeView === 'automation' && (
          <div className="text-center py-12">
            <div className="flex items-center justify-center mb-4">
              <Zap className="w-12 h-12 text-yellow-400 mr-2" />
              <Brain className="w-8 h-8 text-purple-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-600">Fund Operations Automation</h3>
            <p className="text-gray-500">Automated capital calls, distributions, and LP communications</p>
            <Badge variant="ai" className="mt-2">Coming Soon</Badge>
          </div>
        )}
        {activeView === 'analytics' && (
          <div className="text-center py-12">
            <div className="flex items-center justify-center mb-4">
              <BarChart3 className="w-12 h-12 text-blue-400 mr-2" />
              <Brain className="w-8 h-8 text-purple-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-600">Predictive Fund Analytics</h3>
            <p className="text-gray-500">AI-powered performance forecasting and risk modeling</p>
            <Badge variant="ai" className="mt-2">Coming Soon</Badge>
          </div>
        )}
      </div>
    </div>
  )
}