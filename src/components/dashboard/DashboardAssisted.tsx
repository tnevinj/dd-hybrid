'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  Brain,
  Sparkles,
  Zap,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Lightbulb,
  Target,
  Star,
  BarChart3,
  PieChart,
  DollarSign,
  X,
  Search,
  Plus,
  FileText,
  Activity,
  Users,
  FolderOpen,
  ArrowRight,
  Clock,
  Wand2,
  RefreshCw
} from 'lucide-react'

import { SecondaryEdgeDashboard } from './SecondaryEdgeDashboard'

// AI Insights Panel Component
const DashboardAIInsightsPanel: React.FC<{
  recommendations: any[]
  onExecuteAction: (actionId: string) => void
  onDismiss: (recommendationId: string) => void
}> = ({ recommendations, onExecuteAction, onDismiss }) => (
  <Card className="mb-6 border-2 border-purple-200">
    <CardHeader>
      <div className="flex items-center space-x-2">
        <Sparkles className="h-5 w-5 text-purple-600" />
        <CardTitle className="text-purple-900">AI Dashboard Insights</CardTitle>
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
              {rec.type === 'automation' && <Zap className="w-4 h-4 mr-2 text-blue-600" />}
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
              {rec.estimatedTimeSaving && (
                <span className="flex items-center">
                  <Clock className="w-3 h-3 mr-1" />
                  Est. time saved: {rec.estimatedTimeSaving} min
                </span>
              )}
            </div>
          )}
        </div>
      ))}
    </CardContent>
  </Card>
)

// Smart Activity Card with AI Features
const SmartActivityCard: React.FC<{
  activity: any
  onView: () => void
  aiInsights?: any[]
}> = ({ activity, onView, aiInsights = [] }) => {
  const [showInsights, setShowInsights] = useState(false)
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500'
      case 'updated': return 'bg-blue-500'
      case 'in_progress': return 'bg-orange-500'
      default: return 'bg-gray-500'
    }
  }

  return (
    <div className="group p-3 bg-purple-50 rounded-lg border border-purple-100 hover:shadow-md transition-all duration-200">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-3">
          <div className={`w-2 h-2 rounded-full ${getStatusColor(activity.status)}`} />
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900 group-hover:text-purple-700">
              {activity.title}
            </p>
            <p className="text-xs text-gray-500">{activity.timestamp}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {aiInsights.length > 0 && (
            <Badge variant="ai" className="text-xs flex items-center">
              <Brain className="w-3 h-3 mr-1" />
              {aiInsights.length} insights
            </Badge>
          )}
          <Button variant="ghost" size="sm" onClick={onView}>
            <ArrowRight className="w-4 h-4 text-gray-400" />
          </Button>
        </div>
      </div>

      {/* AI-Generated Insights Preview */}
      {aiInsights.length > 0 && (
        <div className="mt-2 p-2 bg-white rounded border border-purple-100">
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
    </div>
  )
}

interface DashboardAssistedProps {
  dashboardData?: any
  activeDeals?: any[]
  recentActivity?: any[]
  upcomingDeadlines?: any[]
  workspaces?: any[]
  aiRecommendations?: any[]
  metrics?: any
  isLoading?: boolean
  onCreateWorkspace?: () => void
  onViewWorkspace?: (id: string) => void
  onCreateDeal?: () => void
  onViewDeal?: (id: string) => void
  onExecuteAIAction?: (actionId: string) => void
  onDismissRecommendation?: (id: string) => void
}

export function DashboardAssisted({
  dashboardData,
  activeDeals = [],
  recentActivity = [],
  upcomingDeadlines = [],
  workspaces = [],
  aiRecommendations = [],
  metrics = {
    activeDeals: 12,
    ddProjects: 8,
    teamMembers: 24,
    totalAUM: 2400000000,
    aiOptimizationScore: 8.7,
    predictedGrowth: 15.2
  },
  isLoading = false,
  onCreateWorkspace,
  onViewWorkspace,
  onCreateDeal,
  onViewDeal,
  onExecuteAIAction,
  onDismissRecommendation
}: DashboardAssistedProps) {
  const [activeView, setActiveView] = useState<'overview' | 'detailed'>('overview')
  const [searchTerm, setSearchTerm] = useState('')

  const formatCurrency = (value: number) => {
    if (value >= 1000000000) {
      return `$${(value / 1000000000).toFixed(1)}B`
    } else if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(1)}K`
    } else {
      return `$${value.toFixed(0)}`
    }
  }

  // Enhanced data with AI insights
  const enhancedActiveDeals = [
    {
      id: '1',
      name: 'TechCorp Acquisition', 
      status: 'Due Diligence',
      dealValue: 250000000,
      stage: 'Advanced',
      lastUpdated: '2 hours ago',
      aiScore: 9.2,
      aiInsights: ['High probability of success', 'Synergies identified'],
      riskLevel: 'low'
    },
    {
      id: '2',
      name: 'HealthCo Investment',
      status: 'Initial Review', 
      dealValue: 180000000,
      stage: 'Early',
      lastUpdated: '1 day ago',
      aiScore: 7.8,
      aiInsights: ['Regulatory risk flagged', 'Market timing optimal'],
      riskLevel: 'medium'
    },
    {
      id: '3',
      name: 'RetailCo Partnership',
      status: 'Documentation',
      dealValue: 320000000,
      stage: 'Final',
      lastUpdated: '3 hours ago',
      aiScore: 8.9,
      aiInsights: ['Strong market position', 'Execution risk manageable'],
      riskLevel: 'low'
    }
  ]

  const enhancedRecentActivity = [
    {
      id: '1',
      type: 'completion',
      title: 'TechCorp DD completed',
      description: 'Financial model analysis finalized',
      timestamp: '2 hours ago',
      status: 'completed',
      aiInsights: [
        { summary: 'Model accuracy 95% based on historical comparisons' },
        { summary: 'Key assumptions validated against market data' }
      ]
    },
    {
      id: '2',
      type: 'update',
      title: 'HealthCo financial model updated',
      description: 'Revenue projections revised',
      timestamp: '4 hours ago',
      status: 'updated',
      aiInsights: [
        { summary: 'Projection variance within expected range' },
        { summary: 'Sensitivity analysis shows robust base case' }
      ]
    },
    {
      id: '3',
      type: 'start',
      title: 'RetailCo DD started',
      description: 'Initial documentation review begun',
      timestamp: '1 day ago',
      status: 'in_progress',
      aiInsights: [
        { summary: 'Document completeness score: 78%' },
        { summary: 'Similar deal patterns suggest 6-week timeline' }
      ]
    }
  ]

  const enhancedWorkspaces = [
    {
      id: '1',
      name: 'TechCorp DD',
      type: 'Due diligence',
      workProducts: 3,
      status: 'active',
      lastActivity: '2 hours ago',
      aiOptimizations: 2,
      completionPrediction: '85%'
    },
    {
      id: '2',
      name: 'HealthCo Analysis',
      type: 'Financial modeling',
      workProducts: 2,
      status: 'active',
      lastActivity: '1 day ago',
      aiOptimizations: 1,
      completionPrediction: '65%'
    },
    {
      id: '3',
      name: 'RetailCo Research',
      type: 'Market research',
      workProducts: 1,
      status: 'active',
      lastActivity: '3 days ago',
      aiOptimizations: 3,
      completionPrediction: '40%'
    }
  ]

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mb-4"></div>
        <h3 className="text-xl font-semibold text-gray-700">AI is analyzing dashboard data...</h3>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4 md:p-6">
      {/* Header - AI-Assisted Theme */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <div className="flex items-center space-x-3">
            <h1 className="text-3xl font-bold text-gray-900">AI-Enhanced Dashboard</h1>
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
            onClick={onCreateDeal} 
            className="flex items-center space-x-2 border-purple-300 text-purple-700 hover:bg-purple-50"
          >
            <Sparkles className="h-4 w-4" />
            <span>Smart New Deal</span>
          </Button>
          <Button 
            variant="outline" 
            onClick={onCreateWorkspace} 
            className="flex items-center space-x-2 border-purple-300 text-purple-700 hover:bg-purple-50"
          >
            <Wand2 className="h-4 w-4" />
            <span>AI Workspace</span>
          </Button>
          <Button className="bg-purple-600 hover:bg-purple-700 text-white">
            <Zap className="h-4 w-4 mr-2" />
            AI Actions
          </Button>
        </div>
      </div>
      
      {/* AI Insights Panel */}
      {aiRecommendations.length > 0 && (
        <DashboardAIInsightsPanel
          recommendations={aiRecommendations}
          onExecuteAction={onExecuteAIAction || (() => {})}
          onDismiss={onDismissRecommendation || (() => {})}
        />
      )}

      {/* View Toggle with AI Enhancement */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-2">
          <Button 
            variant={activeView === 'overview' ? 'default' : 'outline'}
            onClick={() => setActiveView('overview')}
            className="flex items-center space-x-2"
          >
            <BarChart3 className="h-4 w-4" />
            <span>Smart Overview</span>
          </Button>
          <Button 
            variant={activeView === 'detailed' ? 'default' : 'outline'}
            onClick={() => setActiveView('detailed')}
            className="flex items-center space-x-2"
          >
            <PieChart className="h-4 w-4" />
            <span>AI Analytics</span>
          </Button>
        </div>
        
        {/* AI-Enhanced Search */}
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-purple-400" />
            <Input
              placeholder="AI-powered search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64 border-purple-300 focus:border-purple-500 bg-white"
            />
          </div>
          <Button 
            variant="outline" 
            className="flex items-center space-x-2 border-purple-300 text-purple-700 hover:bg-purple-50"
          >
            <Brain className="h-4 w-4" />
            <span>AI Filters</span>
          </Button>
        </div>
      </div>

      {activeView === 'overview' && (
        <>
          {/* Enhanced Metrics with AI Predictions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            <Card className="border-purple-200 bg-white">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Active Deals</CardTitle>
                <FileText className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{metrics.activeDeals}</div>
                <div className="flex items-center text-purple-600 text-sm mt-1">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  AI-tracked growth
                </div>
              </CardContent>
            </Card>

            <Card className="border-purple-200 bg-white">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Smart DD Projects</CardTitle>
                <Activity className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{metrics.ddProjects}</div>
                <div className="flex items-center text-purple-600 text-sm mt-1">
                  <Brain className="h-4 w-4 mr-1" />
                  AI-analyzed
                </div>
              </CardContent>
            </Card>

            <Card className="border-purple-200 bg-white">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Team Members</CardTitle>
                <Users className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{metrics.teamMembers}</div>
                <div className="flex items-center text-purple-600 text-sm mt-1">
                  <Target className="h-4 w-4 mr-1" />
                  AI-optimized
                </div>
              </CardContent>
            </Card>

            <Card className="border-purple-200 bg-white">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total AUM</CardTitle>
                <DollarSign className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{formatCurrency(metrics.totalAUM)}</div>
                <div className="flex items-center text-green-600 text-sm mt-1">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Above projections
                </div>
              </CardContent>
            </Card>

            <Card className="border-purple-200 bg-white">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">AI Optimization</CardTitle>
                <Star className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{metrics.aiOptimizationScore}/10</div>
                <div className="flex items-center text-purple-600 text-sm mt-1">
                  <Lightbulb className="h-4 w-4 mr-1" />
                  Excellent score
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Enhanced Active Deals & Workspaces */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* AI-Enhanced Active Deals */}
            <Card className="border-purple-200 bg-white">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-purple-600" />
                  Smart Deal Pipeline
                </CardTitle>
                <Button variant="outline" size="sm" onClick={onCreateDeal} className="border-purple-300 text-purple-700">
                  <Sparkles className="w-4 h-4 mr-2" />
                  AI New Deal
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {enhancedActiveDeals.map((deal) => (
                  <div key={deal.id} className="p-3 bg-purple-50 rounded-lg border border-purple-100">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{deal.name}</p>
                        <p className="text-xs text-gray-500">{deal.status} • {formatCurrency(deal.dealValue)}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="ai" className="text-xs">
                          AI: {deal.aiScore}/10
                        </Badge>
                        <Badge variant={deal.riskLevel === 'low' ? 'default' : 'outline'} className="text-xs">
                          {deal.stage}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-xs text-purple-700 space-y-1">
                      {deal.aiInsights.map((insight, index) => (
                        <p key={index}>• {insight}</p>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* AI-Enhanced Active Workspaces */}
            <Card className="border-purple-200 bg-white">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center">
                  <FolderOpen className="w-5 h-5 mr-2 text-purple-600" />
                  Smart Workspaces
                </CardTitle>
                <Button variant="outline" size="sm" onClick={onCreateWorkspace} className="border-purple-300 text-purple-700">
                  <Wand2 className="w-4 h-4 mr-2" />
                  AI Workspace
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {enhancedWorkspaces.map((workspace) => (
                  <div key={workspace.id} className="p-3 bg-purple-50 rounded-lg border border-purple-100">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <div className={`w-2 h-2 rounded-full ${
                          workspace.status === 'active' ? 'bg-green-500' : 'bg-gray-400'
                        }`} />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{workspace.name}</p>
                          <p className="text-xs text-gray-500">{workspace.type} • {workspace.workProducts} work products</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="ai" className="text-xs">
                          {workspace.completionPrediction} complete
                        </Badge>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => onViewWorkspace?.(workspace.id)}
                        >
                          <ArrowRight className="w-4 h-4 text-gray-400" />
                        </Button>
                      </div>
                    </div>
                    {workspace.aiOptimizations > 0 && (
                      <div className="text-xs text-purple-700">
                        • {workspace.aiOptimizations} AI optimizations available
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Enhanced Recent Activity & Smart Deadlines */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-purple-200 bg-white">
              <CardHeader>
                <CardTitle className="text-gray-900 flex items-center">
                  <RefreshCw className="w-5 h-5 mr-2 text-purple-600" />
                  Smart Activity Feed
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {enhancedRecentActivity.map((activity) => (
                  <SmartActivityCard
                    key={activity.id}
                    activity={activity}
                    onView={() => console.log(`View activity: ${activity.id}`)}
                    aiInsights={activity.aiInsights}
                  />
                ))}
              </CardContent>
            </Card>

            <Card className="border-purple-200 bg-white">
              <CardHeader>
                <CardTitle className="text-gray-900 flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-purple-600" />
                  AI-Prioritized Deadlines
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 bg-purple-50 rounded-lg border border-purple-100">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <Clock className="h-4 w-4 text-red-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">TechCorp IC Meeting</p>
                        <p className="text-xs text-gray-500">Tomorrow, 2:00 PM</p>
                      </div>
                    </div>
                    <Badge variant="destructive" className="text-xs">AI: Urgent</Badge>
                  </div>
                  <p className="text-xs text-purple-700">• AI suggests reviewing financial model 2h before meeting</p>
                </div>
                
                <div className="p-3 bg-purple-50 rounded-lg border border-purple-100">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <Clock className="h-4 w-4 text-orange-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Q3 LP Report</p>
                        <p className="text-xs text-gray-500">In 3 days</p>
                      </div>
                    </div>
                    <Badge variant="default" className="text-xs">AI: High</Badge>
                  </div>
                  <p className="text-xs text-purple-700">• Draft available for review, 85% complete</p>
                </div>
                
                <div className="p-3 bg-purple-50 rounded-lg border border-purple-100">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <Clock className="h-4 w-4 text-blue-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">HealthCo Site Visit</p>
                        <p className="text-xs text-gray-500">Next week</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">AI: Medium</Badge>
                  </div>
                  <p className="text-xs text-purple-700">• Optimal timing based on management availability</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}

      {activeView === 'detailed' && (
        <div className="mb-6">
          <SecondaryEdgeDashboard mode="assisted" data={dashboardData} />
        </div>
      )}

      {/* AI Assistance Status */}
      <div className="mt-6 p-4 bg-gradient-to-r from-purple-100 to-blue-100 border border-purple-200 rounded-lg">
        <div className="flex items-start space-x-3">
          <Brain className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-purple-900 mb-1">AI-Assisted Dashboard Management Active</h4>
            <p className="text-sm text-purple-700">
              AI is continuously analyzing your dashboard data for optimization opportunities, risk factors, and performance improvements. 
              All suggestions require your approval before implementation. Current AI confidence: 94%
            </p>
            <div className="flex items-center space-x-4 mt-2 text-xs text-purple-600">
              <span>• 8 deals analyzed this hour</span>
              <span>• 12 optimization opportunities found</span>
              <span>• 98% uptime</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardAssisted