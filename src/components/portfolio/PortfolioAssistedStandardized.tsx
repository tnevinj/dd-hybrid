'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Brain,
  Plus,
  TrendingUp,
  TrendingDown,
  Building,
  PieChart,
  BarChart3,
  Zap,
  Target,
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Star,
  Lightbulb,
  ArrowRight,
  MoreVertical,
  Sparkles
} from 'lucide-react'
import { StandardizedKPICard } from '@/components/shared/StandardizedKPICard'
import { StandardizedAIPanel } from '@/components/shared/StandardizedAIPanel'
import { StandardizedSearchFilter } from '@/components/shared/StandardizedSearchFilter'
import { StandardizedLoading } from '@/components/shared/StandardizedStates'
import { generateModuleData } from '@/lib/mock-data-generator'
import { DESIGN_SYSTEM, getStatusColor } from '@/lib/design-system'

interface PortfolioAssistedStandardizedProps {
  isLoading?: boolean
  onCreateAsset?: () => void
  onViewAsset?: (id: string) => void
  onEditAsset?: (id: string) => void
}

export function PortfolioAssistedStandardized({
  isLoading = false,
  onCreateAsset,
  onViewAsset,
  onEditAsset
}: PortfolioAssistedStandardizedProps) {
  const [activeView, setActiveView] = useState('overview')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFilters, setSelectedFilters] = useState<string[]>([])
  
  const moduleData = generateModuleData('portfolio')
  
  if (isLoading) {
    return <StandardizedLoading mode="assisted" message="AI is analyzing portfolio data..." />
  }

  const enhancedMetrics = [
    {
      title: 'Total AUM',
      value: '$2.4B',
      change: '+12.3%',
      trend: 'up' as const,
      aiInsight: 'Portfolio growing 2.3x faster than industry avg',
      confidence: 94
    },
    {
      title: 'AI Risk Score',
      value: '7.2/10',
      change: 'Low risk',
      trend: 'stable' as const,
      aiInsight: 'Diversification reducing concentration risk',
      confidence: 91
    },
    {
      title: 'Predicted IRR',
      value: '22.4%',
      change: '+3.8%',
      trend: 'up' as const,
      aiInsight: 'ML models predict strong performance',
      confidence: 87
    },
    {
      title: 'Exit Timing',
      value: '8 months',
      change: 'Optimal',
      trend: 'up' as const,
      aiInsight: '3 companies ready for strategic exit',
      confidence: 89
    }
  ]

  const aiRecommendations = [
    {
      id: '1',
      type: 'optimization' as const,
      title: 'Portfolio Rebalancing Opportunity',
      description: 'AI analysis suggests reducing SaaS exposure by 8% and increasing healthcare allocation',
      confidence: 92,
      impact: 'high' as const,
      timeToImplement: '2-3 weeks',
      actions: [
        { label: 'View Analysis', action: 'VIEW_REBALANCING' },
        { label: 'Generate Report', action: 'GENERATE_REPORT' }
      ]
    },
    {
      id: '2',
      type: 'opportunity' as const,
      title: 'Exit Timing Optimization',
      description: 'Market conditions optimal for TechFlow exit. Predicted 2.3x additional return',
      confidence: 88,
      impact: 'high' as const,
      timeToImplement: '1 month',
      actions: [
        { label: 'Schedule Review', action: 'SCHEDULE_EXIT' },
        { label: 'Market Analysis', action: 'MARKET_ANALYSIS' }
      ]
    },
    {
      id: '3',
      type: 'risk' as const,
      title: 'Customer Concentration Alert',
      description: 'MedDevice showing 71% revenue from top 3 customers. Recommend diversification review',
      confidence: 94,
      impact: 'medium' as const,
      timeToImplement: 'Ongoing',
      actions: [
        { label: 'Deep Dive', action: 'ANALYZE_CUSTOMERS' },
        { label: 'Schedule Call', action: 'SCHEDULE_CALL' }
      ]
    }
  ]

  const smartInsights = [
    {
      id: '1',
      category: 'Market Trends',
      insight: 'CleanTech valuations up 34% in Q3',
      reasoning: 'Based on comparable transactions analysis',
      impact: 'GreenEnergy Co valuation could increase by $45M',
      confidence: 89
    },
    {
      id: '2',
      category: 'Performance',
      insight: 'Portfolio outperforming benchmark by 8.2%',
      reasoning: 'Sector allocation and timing optimization',
      impact: 'On track for top quartile returns',
      confidence: 92
    },
    {
      id: '3',
      category: 'Risk Management',
      insight: 'ESG scores improving across portfolio',
      reasoning: 'Automated ESG monitoring and recommendations',
      impact: 'Reduced regulatory risk, increased LP appeal',
      confidence: 87
    }
  ]

  const aiEnhancedCompanies = [
    {
      id: '1',
      name: 'TechFlow Solutions',
      sector: 'B2B SaaS',
      stage: 'Growth',
      investment: '$15M',
      ownership: '25%',
      valuation: '$60M',
      aiScore: 8.7,
      status: 'outperforming',
      lastUpdate: '2 days ago',
      metrics: {
        revenue: '$8.2M ARR',
        growth: '+45% YoY',
        multiple: '7.3x'
      },
      aiInsights: {
        exitTiming: 'Optimal in 6-8 months',
        riskLevel: 'Low',
        growthPrediction: '+52% next quarter'
      }
    },
    {
      id: '2',
      name: 'MedDevice Innovations',
      sector: 'Healthcare',
      stage: 'Series B',
      investment: '$22M',
      ownership: '18%',
      valuation: '$122M',
      aiScore: 6.4,
      status: 'attention-needed',
      lastUpdate: '1 week ago',
      metrics: {
        revenue: '$12.5M ARR',
        growth: '+28% YoY',
        multiple: '9.8x'
      },
      aiInsights: {
        exitTiming: 'Monitor 12+ months',
        riskLevel: 'Medium - Customer concentration',
        growthPrediction: '+31% next quarter'
      }
    },
    {
      id: '3',
      name: 'GreenEnergy Co',
      sector: 'CleanTech',
      stage: 'Late Stage',
      investment: '$35M',
      ownership: '12%',
      valuation: '$290M',
      aiScore: 9.1,
      status: 'exit-ready',
      lastUpdate: '3 days ago',
      metrics: {
        revenue: '$45M ARR',
        growth: '+67% YoY',
        multiple: '6.4x'
      },
      aiInsights: {
        exitTiming: 'Ready now - Market conditions optimal',
        riskLevel: 'Very Low',
        growthPrediction: '+71% next quarter'
      }
    }
  ]

  const getAIStatusBadge = (status: string) => {
    switch (status) {
      case 'outperforming':
        return (
          <Badge style={{ backgroundColor: DESIGN_SYSTEM.colors.ai.success, color: DESIGN_SYSTEM.colors.ai.successText }}>
            <Star className="w-3 h-3 mr-1" />
            Outperforming
          </Badge>
        )
      case 'attention-needed':
        return (
          <Badge style={{ backgroundColor: DESIGN_SYSTEM.colors.ai.warning, color: DESIGN_SYSTEM.colors.ai.warningText }}>
            <AlertTriangle className="w-3 h-3 mr-1" />
            Attention Needed
          </Badge>
        )
      case 'exit-ready':
        return (
          <Badge style={{ backgroundColor: DESIGN_SYSTEM.colors.ai.info, color: DESIGN_SYSTEM.colors.ai.infoText }}>
            <Target className="w-3 h-3 mr-1" />
            Exit Ready
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

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
                  AI Portfolio Intelligence
                </h3>
                <p className="text-sm" style={{ color: DESIGN_SYSTEM.colors.ai.muted }}>
                  Real-time analysis, predictive modeling, and automated insights
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="ai" className="flex items-center space-x-1">
                <Sparkles className="w-3 h-3" />
                <span>12 Insights</span>
              </Badge>
              <Badge variant="outline">4 Recommendations</Badge>
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* AI Recommendations */}
        <StandardizedAIPanel
          title="AI Recommendations"
          recommendations={aiRecommendations}
          mode="assisted"
        />

        {/* Smart Insights */}
        <Card style={{ borderColor: DESIGN_SYSTEM.colors.ai.border }}>
          <CardHeader>
            <CardTitle className="flex items-center" style={{ color: DESIGN_SYSTEM.colors.ai.primary }}>
              <Lightbulb className="w-5 h-5 mr-2" />
              Smart Insights
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
                    💡 {insight.impact}
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
            AI Analytics Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 rounded-lg" style={{ backgroundColor: DESIGN_SYSTEM.colors.ai.success + '20' }}>
              <div className="text-2xl font-bold" style={{ color: DESIGN_SYSTEM.colors.ai.success }}>94%</div>
              <div className="text-sm font-medium">Prediction Accuracy</div>
              <div className="text-xs text-gray-600 mt-1">Based on 247 data points</div>
            </div>
            <div className="text-center p-4 rounded-lg" style={{ backgroundColor: DESIGN_SYSTEM.colors.ai.primary + '20' }}>
              <div className="text-2xl font-bold" style={{ color: DESIGN_SYSTEM.colors.ai.primary }}>18hrs</div>
              <div className="text-sm font-medium">Time Saved</div>
              <div className="text-xs text-gray-600 mt-1">This month via automation</div>
            </div>
            <div className="text-center p-4 rounded-lg" style={{ backgroundColor: DESIGN_SYSTEM.colors.ai.info + '20' }}>
              <div className="text-2xl font-bold" style={{ color: DESIGN_SYSTEM.colors.ai.info }}>$2.3M</div>
              <div className="text-sm font-medium">Value Added</div>
              <div className="text-xs text-gray-600 mt-1">Through optimization</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderAICompaniesView = () => (
    <div className="space-y-4">
      {/* AI-Enhanced Search */}
      <StandardizedSearchFilter
        mode="assisted"
        onSearch={setSearchQuery}
        onFilterChange={setSelectedFilters}
        searchPlaceholder="AI-powered company search..."
        availableFilters={[
          { id: 'ai-score-high', label: 'High AI Score (8+)', category: 'AI Score' },
          { id: 'ai-score-medium', label: 'Medium AI Score (6-8)', category: 'AI Score' },
          { id: 'exit-ready', label: 'Exit Ready', category: 'AI Status' },
          { id: 'outperforming', label: 'Outperforming', category: 'AI Status' },
          { id: 'attention-needed', label: 'Attention Needed', category: 'AI Status' },
          { id: 'sector-saas', label: 'B2B SaaS', category: 'Sector' },
          { id: 'sector-healthcare', label: 'Healthcare', category: 'Sector' },
          { id: 'sector-cleantech', label: 'CleanTech', category: 'Sector' }
        ]}
        aiSuggestions={[
          'Companies with customer concentration risk',
          'Exit-ready investments by market timing',
          'Underperforming vs AI predictions'
        ]}
      />

      {/* AI-Enhanced Portfolio Companies */}
      <Card style={{ borderColor: DESIGN_SYSTEM.colors.ai.border }}>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center" style={{ color: DESIGN_SYSTEM.colors.ai.primary }}>
            <Building className="w-5 h-5 mr-2" />
            AI-Enhanced Portfolio ({aiEnhancedCompanies.length})
          </CardTitle>
          <Button onClick={onCreateAsset} style={{ backgroundColor: DESIGN_SYSTEM.colors.ai.primary }}>
            <Plus className="w-4 h-4 mr-2" />
            Add Investment
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {aiEnhancedCompanies.map((company) => (
              <div
                key={company.id}
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
                onClick={() => onViewAsset?.(company.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-semibold text-lg">{company.name}</h3>
                      {getAIStatusBadge(company.status)}
                      <Badge variant="outline">{company.sector}</Badge>
                      <div className="flex items-center space-x-1">
                        <Brain className="w-3 h-3" style={{ color: DESIGN_SYSTEM.colors.ai.primary }} />
                        <span className="text-sm font-medium">{company.aiScore}/10</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                      <div>
                        <span className="text-gray-500">Investment:</span>
                        <div className="font-medium">{company.investment}</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Valuation:</span>
                        <div className="font-medium">{company.valuation}</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Growth:</span>
                        <div className="font-medium text-green-600">{company.metrics.growth}</div>
                      </div>
                      <div>
                        <span className="text-gray-500">AI Score:</span>
                        <div className="font-medium" style={{ color: DESIGN_SYSTEM.colors.ai.primary }}>{company.aiScore}/10</div>
                      </div>
                    </div>

                    <div className="p-3 rounded-lg" style={{ backgroundColor: DESIGN_SYSTEM.colors.ai.accent }}>
                      <h4 className="text-sm font-medium mb-2 flex items-center">
                        <Sparkles className="w-3 h-3 mr-1" style={{ color: DESIGN_SYSTEM.colors.ai.primary }} />
                        AI Insights
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
                        <div>
                          <span className="text-gray-600">Exit Timing:</span>
                          <div className="font-medium">{company.aiInsights.exitTiming}</div>
                        </div>
                        <div>
                          <span className="text-gray-600">Risk Level:</span>
                          <div className="font-medium">{company.aiInsights.riskLevel}</div>
                        </div>
                        <div>
                          <span className="text-gray-600">Growth Prediction:</span>
                          <div className="font-medium text-green-600">{company.aiInsights.growthPrediction}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); onEditAsset?.(company.id); }}>
                      Edit
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">AI-Enhanced Portfolio Management</h1>
        <p className="text-gray-600">
          Intelligent recommendations with predictive analytics and automated insights
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
            variant={activeView === 'companies' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveView('companies')}
            className="flex items-center space-x-2"
          >
            <Building className="w-4 h-4" />
            <span>Smart Portfolio</span>
          </Button>
          <Button
            variant={activeView === 'predictions' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveView('predictions')}
            className="flex items-center space-x-2"
          >
            <TrendingUp className="w-4 h-4" />
            <span>Predictions</span>
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-6">
        {activeView === 'overview' && renderAIOverview()}
        {activeView === 'companies' && renderAICompaniesView()}
        {activeView === 'predictions' && (
          <div className="text-center py-12">
            <div className="flex items-center justify-center mb-4">
              <TrendingUp className="w-12 h-12 text-blue-400 mr-2" />
              <Brain className="w-8 h-8 text-blue-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-600">AI Predictive Analytics</h3>
            <p className="text-gray-500">Advanced modeling and scenario analysis</p>
            <Badge variant="ai" className="mt-2">Coming Soon</Badge>
          </div>
        )}
      </div>
    </div>
  )
}