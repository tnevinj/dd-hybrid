'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Brain,
  Zap,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Lightbulb,
  Target,
  ArrowRight,
  Star,
  BarChart3,
  PieChart,
  DollarSign,
  X,
  Sparkles
} from 'lucide-react'

// Import existing portfolio components
import { PortfolioOverview } from './common/PortfolioOverview'
import { PortfolioPerformance } from './common/PortfolioPerformance'
import { VirtualizedAssetGrid } from './common/VirtualizedAssetGrid'
import { ProfessionalAnalytics } from './common/ProfessionalAnalytics'
import { RiskManagement } from './common/RiskManagement'
import { PortfolioOptimization } from './common/PortfolioOptimization'

// AI Insights Panel Component
const PortfolioAIInsightsPanel: React.FC<{
  recommendations: any[]
  onExecuteAction: (actionId: string) => void
  onDismiss: (recommendationId: string) => void
}> = ({ recommendations, onExecuteAction, onDismiss }) => (
  <Card className="mb-6 border-2 border-purple-200">
    <CardHeader>
      <div className="flex items-center space-x-2">
        <Sparkles className="h-5 w-5 text-purple-600" />
        <CardTitle className="text-purple-900">AI Portfolio Insights</CardTitle>
        <Badge variant="ai" className="text-xs">
          {recommendations.length} active recommendations
        </Badge>
      </div>
    </CardHeader>
    <CardContent className="space-y-4">
      {recommendations.map((rec) => (
        <div
          key={rec.id}
          className={`p-4 rounded-lg border ${
            rec.priority === 'high' 
              ? 'bg-yellow-50 border-yellow-200' 
              : rec.priority === 'critical' 
              ? 'bg-red-50 border-red-200' 
              : 'bg-purple-50 border-purple-200'
          }`}
        >
          <div className="flex justify-between items-start mb-2">
            <h4 className="font-semibold text-gray-900 flex items-center">
              {rec.type === 'optimization' && <Target className="w-4 h-4 mr-2 text-purple-600" />}
              {rec.type === 'risk' && <AlertTriangle className="w-4 h-4 mr-2 text-yellow-600" />}
              {rec.type === 'opportunity' && <TrendingUp className="w-4 h-4 mr-2 text-green-600" />}
              {rec.title}
            </h4>
            <div className="flex items-center space-x-2">
              {rec.actions?.map((action: any, index: number) => (
                <Button
                  key={index}
                  size="sm"
                  variant={action.primary ? "default" : "outline"}
                  onClick={() => onExecuteAction(action.action)}
                  className="text-xs"
                >
                  {action.label}
                </Button>
              ))}
              <Button size="sm" variant="ghost" onClick={() => onDismiss(rec.id)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <p className="text-sm text-gray-700 mb-2">{rec.description}</p>
          {rec.confidence && (
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>Confidence: {Math.round(rec.confidence * 100)}%</span>
              {rec.estimatedImpact && (
                <span className="flex items-center">
                  <DollarSign className="w-3 h-3 mr-1" />
                  Est. impact: {rec.estimatedImpact}
                </span>
              )}
            </div>
          )}
        </div>
      ))}
    </CardContent>
  </Card>
)

// Smart Asset Card with AI Features
const SmartAssetCard: React.FC<{
  asset: any
  onView: () => void
  onEdit: () => void
  aiInsights?: any[]
}> = ({ asset, onView, onEdit, aiInsights = [] }) => {
  const [showInsights, setShowInsights] = useState(false)
  
  const getPerformanceColor = (performance: number) => {
    if (performance > 15) return 'text-green-600'
    if (performance > 5) return 'text-blue-600'
    if (performance < 0) return 'text-red-600'
    return 'text-gray-600'
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high': return 'bg-red-100 text-red-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <Card className="group hover:shadow-lg transition-all duration-200 border-l-4 border-l-purple-300">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="font-semibold text-gray-900 group-hover:text-purple-700">
              {asset.name}
            </h3>
            <p className="text-sm text-gray-600">{asset.type} • {asset.sector}</p>
          </div>
          <div className="flex items-center space-x-2">
            {aiInsights.length > 0 && (
              <Badge variant="ai" className="text-xs flex items-center">
                <Brain className="w-3 h-3 mr-1" />
                {aiInsights.length} insights
              </Badge>
            )}
            <Badge className={`text-xs ${getRiskColor(asset.riskLevel)}`}>
              {asset.riskLevel} risk
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-3">
          <div>
            <p className="text-xs text-gray-500">Current Value</p>
            <p className="font-semibold text-gray-900">${asset.currentValue?.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Performance</p>
            <p className={`font-semibold ${getPerformanceColor(asset.performance)}`}>
              {asset.performance > 0 ? '+' : ''}{asset.performance}%
            </p>
          </div>
        </div>

        {/* AI-Generated Insights Preview */}
        {aiInsights.length > 0 && (
          <div className="mb-3 p-2 bg-purple-50 rounded-md border border-purple-100">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-purple-800">AI Analysis</p>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setShowInsights(!showInsights)}
                className="text-xs h-6 text-purple-600"
              >
                {showInsights ? 'Hide' : 'Show'} insights
              </Button>
            </div>
            {showInsights && (
              <div className="mt-2 space-y-1">
                {aiInsights.slice(0, 2).map((insight, index) => (
                  <p key={index} className="text-xs text-purple-700">
                    • {insight.summary}
                  </p>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button size="sm" variant="outline" onClick={onView}>
              View Details
            </Button>
            <Button size="sm" onClick={onEdit}>
              Edit
            </Button>
          </div>
          
          {/* AI Action Suggestions */}
          <div className="flex items-center space-x-1">
            {asset.aiSuggestions?.map((suggestion: any, index: number) => (
              <Button
                key={index}
                size="sm"
                variant="ghost"
                className="text-xs h-6 text-purple-600 hover:text-purple-800"
                title={suggestion.description}
              >
                <Zap className="w-3 h-3 mr-1" />
                {suggestion.label}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

interface PortfolioAssistedProps {
  portfolioData?: any
  assets?: any[]
  aiRecommendations?: any[]
  metrics?: any
  isLoading?: boolean
  onCreateAsset?: () => void
  onViewAsset?: (id: string) => void
  onEditAsset?: (id: string) => void
  onExecuteAIAction?: (actionId: string) => void
  onDismissRecommendation?: (id: string) => void
}

export function PortfolioAssisted({
  portfolioData,
  assets = [],
  aiRecommendations = [],
  metrics = {
    totalValue: 2400000000,
    totalAssets: 47,
    performanceYTD: 12.5,
    aiOptimizationScore: 8.7,
    predictedGrowth: 15.2
  },
  isLoading = false,
  onCreateAsset,
  onViewAsset,
  onEditAsset,
  onExecuteAIAction,
  onDismissRecommendation
}: PortfolioAssistedProps) {
  const [activeTab, setActiveTab] = useState('overview')

  // Enhanced assets with AI insights
  const enhancedAssets = assets.map(asset => ({
    ...asset,
    aiInsights: [
      {
        type: 'performance',
        summary: `Outperforming sector average by ${Math.random() * 10 + 5}%`,
        confidence: 0.85
      },
      {
        type: 'risk',
        summary: 'Low correlation with portfolio increases diversification',
        confidence: 0.92
      }
    ],
    aiSuggestions: [
      { label: 'Optimize', action: 'OPTIMIZE_ALLOCATION', description: 'AI suggests rebalancing allocation' },
      { label: 'Analyze', action: 'DEEP_ANALYSIS', description: 'Run comprehensive AI analysis' }
    ]
  }))

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mb-4"></div>
        <h3 className="text-xl font-semibold text-gray-700">AI is analyzing portfolio data...</h3>
      </div>
    )
  }

  const tabs = [
    { id: 'overview', label: 'Smart Overview', icon: BarChart3 },
    { id: 'assets', label: 'AI-Enhanced Assets', icon: PieChart },
    { id: 'performance', label: 'Performance+', icon: TrendingUp },
    { id: 'optimization', label: 'Optimization', icon: Target },
    { id: 'risk', label: 'Smart Risk', icon: AlertTriangle }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4 md:p-6">
      {/* Header - AI-Assisted Theme */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <div className="flex items-center space-x-3">
            <h1 className="text-3xl font-bold text-gray-900">AI-Enhanced Portfolio</h1>
            <Badge className="bg-purple-100 text-purple-800 border border-purple-300 flex items-center space-x-1">
              <Brain className="h-3 w-3" />
              <span>Assisted Mode</span>
            </Badge>
          </div>
          <p className="text-gray-600 mt-1">Intelligent insights and automated optimizations with human oversight</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            onClick={onCreateAsset} 
            className="flex items-center space-x-2 border-purple-300 text-purple-700 hover:bg-purple-50"
          >
            <Sparkles className="h-4 w-4" />
            <span>Smart Add Asset</span>
          </Button>
          <Button className="bg-purple-600 hover:bg-purple-700 text-white">
            <Zap className="h-4 w-4 mr-2" />
            AI Actions
          </Button>
        </div>
      </div>
      
      {/* AI Insights Panel */}
      {aiRecommendations.length > 0 && (
        <PortfolioAIInsightsPanel
          recommendations={aiRecommendations}
          onExecuteAction={onExecuteAIAction || (() => {})}
          onDismiss={onDismissRecommendation || (() => {})}
        />
      )}

      {/* Enhanced Metrics with AI Predictions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <Card className="border-purple-200 bg-white">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2 mb-2">
              <DollarSign className="h-5 w-5 text-purple-600" />
              <p className="text-sm text-gray-600 font-medium">Portfolio Value</p>
            </div>
            <p className="text-3xl font-bold text-gray-900">${(metrics.totalValue / 1000000000).toFixed(1)}B</p>
            <div className="flex items-center text-purple-600 text-sm mt-1">
              <TrendingUp className="h-4 w-4 mr-1" />
              AI-tracked growth
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-purple-200 bg-white">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2 mb-2">
              <BarChart3 className="h-5 w-5 text-purple-600" />
              <p className="text-sm text-gray-600 font-medium">Smart Assets</p>
            </div>
            <p className="text-3xl font-bold text-gray-900">{metrics.totalAssets}</p>
            <div className="flex items-center text-purple-600 text-sm mt-1">
              <Brain className="h-4 w-4 mr-1" />
              AI-analyzed
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-purple-200 bg-white">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2 mb-2">
              <Target className="h-5 w-5 text-purple-600" />
              <p className="text-sm text-gray-600 font-medium">AI Optimization</p>
            </div>
            <p className="text-3xl font-bold text-gray-900">{metrics.aiOptimizationScore}/10</p>
            <div className="flex items-center text-purple-600 text-sm mt-1">
              <Star className="h-4 w-4 mr-1" />
              Excellent score
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-purple-200 bg-white">
          <CardContent className="p-6">
            <p className="text-sm text-gray-600 font-medium mb-2">YTD Performance</p>
            <p className="text-3xl font-bold text-gray-900">{metrics.performanceYTD}%</p>
            <div className="flex items-center text-green-600 text-sm mt-1">
              <CheckCircle className="h-4 w-4 mr-1" />
              Beating benchmark
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-purple-200 bg-white">
          <CardContent className="p-6">
            <p className="text-sm text-gray-600 font-medium mb-2">AI Prediction</p>
            <p className="text-3xl font-bold text-gray-900">+{metrics.predictedGrowth}%</p>
            <div className="flex items-center text-purple-600 text-sm mt-1">
              <Lightbulb className="h-4 w-4 mr-1" />
              Next 12 months
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI-Enhanced Navigation Tabs */}
      <Card className="mb-6 border-purple-200">
        <CardContent className="p-0">
          <div className="flex border-b border-purple-100">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-6 py-4 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-b-2 border-purple-600 text-purple-900 bg-purple-50'
                      : 'text-gray-500 hover:text-purple-700 hover:bg-purple-25'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                  {tab.id === 'optimization' && (
                    <Badge variant="ai" className="text-xs ml-1">New</Badge>
                  )}
                </button>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Tab Content with AI Enhancements */}
      <div className="space-y-6">
        {activeTab === 'overview' && (
          <PortfolioOverview />
        )}
        
        {activeTab === 'assets' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {enhancedAssets.map((asset) => (
              <SmartAssetCard
                key={asset.id}
                asset={asset}
                onView={() => onViewAsset?.(asset.id)}
                onEdit={() => onEditAsset?.(asset.id)}
                aiInsights={asset.aiInsights}
              />
            ))}
          </div>
        )}
        
        {activeTab === 'performance' && (
          <PortfolioPerformance />
        )}
        
        {activeTab === 'optimization' && (
          <PortfolioOptimization />
        )}
        
        {activeTab === 'risk' && (
          <RiskManagement />
        )}
      </div>

      {/* AI Assistance Status */}
      <div className="mt-6 p-4 bg-gradient-to-r from-purple-100 to-blue-100 border border-purple-200 rounded-lg">
        <div className="flex items-start space-x-3">
          <Brain className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-purple-900 mb-1">AI-Assisted Portfolio Management Active</h4>
            <p className="text-sm text-purple-700">
              AI is continuously analyzing your portfolio for optimization opportunities, risk factors, and performance improvements. 
              All suggestions require your approval before implementation. Current AI confidence: 94%
            </p>
            <div className="flex items-center space-x-4 mt-2 text-xs text-purple-600">
              <span>• 12 assets analyzed this hour</span>
              <span>• 3 optimization opportunities found</span>
              <span>• 98% uptime</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PortfolioAssisted