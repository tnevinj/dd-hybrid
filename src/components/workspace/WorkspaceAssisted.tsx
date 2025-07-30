'use client'

import React, { useState } from 'react'
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
  FolderOpen,
  Users,
  Clock,
  X,
  Search,
  Plus,
  ArrowRight,
  Wand2,
  RefreshCw
} from 'lucide-react'

// AI Insights Panel Component
const WorkspaceAIInsightsPanel: React.FC<{
  recommendations: any[]
  onExecuteAction: (actionId: string) => void
  onDismiss: (recommendationId: string) => void
}> = ({ recommendations, onExecuteAction, onDismiss }) => (
  <Card className="mb-6 border-2 border-purple-200">
    <CardHeader>
      <div className="flex items-center space-x-2">
        <Sparkles className="h-5 w-5 text-purple-600" />
        <CardTitle className="text-purple-900">AI Workspace Insights</CardTitle>
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

// Smart Workspace Card with AI Features
const SmartWorkspaceCard: React.FC<{
  workspace: any
  onView: () => void
  onEdit: () => void
  aiInsights?: any[]
}> = ({ workspace, onView, onEdit, aiInsights = [] }) => {
  const [showInsights, setShowInsights] = useState(false)
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800'
      case 'Review': return 'bg-yellow-100 text-yellow-800'
      case 'Draft': return 'bg-gray-100 text-gray-800'
      case 'Completed': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Due Diligence': return 'bg-purple-100 text-purple-800'
      case 'IC Preparation': return 'bg-red-100 text-red-800'
      case 'Screening': return 'bg-orange-100 text-orange-800'
      case 'Monitoring': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <Card className="group hover:shadow-lg transition-all duration-200 border-l-4 border-l-purple-300">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="font-semibold text-gray-900 group-hover:text-purple-700">
              {workspace.name}
            </h3>
            <p className="text-sm text-gray-600">{workspace.lastActivity}</p>
          </div>
          <div className="flex items-center space-x-2">
            {aiInsights.length > 0 && (
              <Badge variant="ai" className="text-xs flex items-center">
                <Brain className="w-3 h-3 mr-1" />
                {aiInsights.length} insights
              </Badge>
            )}
            <Badge className={`text-xs ${getStatusColor(workspace.status)}`}>
              {workspace.status}
            </Badge>
          </div>
        </div>

        <div className="flex items-center space-x-2 mb-3">
          <Badge className={`text-xs ${getTypeColor(workspace.type)}`}>
            {workspace.type}
          </Badge>
          {workspace.aiOptimizationScore && (
            <Badge variant="ai" className="text-xs">
              AI Score: {workspace.aiOptimizationScore}/10
            </Badge>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4 mb-3">
          <div>
            <p className="text-xs text-gray-500">Progress</p>
            <div className="flex items-center space-x-2">
              <p className="font-semibold text-gray-900">{workspace.progress}%</p>
              {workspace.aiPrediction && (
                <span className="text-xs text-purple-600">
                  (AI: {workspace.aiPrediction}% projected)
                </span>
              )}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
              <div 
                className="bg-purple-600 h-2 rounded-full" 
                style={{ width: `${workspace.progress}%` }}
              />
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-500">Team Efficiency</p>
            <p className="font-semibold text-gray-900">{workspace.teamMembers} members</p>
            {workspace.aiEfficiency && (
              <p className="text-xs text-purple-600">AI boost: +{workspace.aiEfficiency}%</p>
            )}
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
            {workspace.aiSuggestions?.map((suggestion: any, index: number) => (
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

interface WorkspaceAssistedProps {
  workspaces?: any[]
  aiRecommendations?: any[]
  metrics?: any
  isLoading?: boolean
  onCreateWorkspace?: () => void
  onViewWorkspace?: (id: string) => void
  onEditWorkspace?: (id: string) => void
  onExecuteAIAction?: (actionId: string) => void
  onDismissRecommendation?: (id: string) => void
}

export function WorkspaceAssisted({
  workspaces = [],
  aiRecommendations = [],
  metrics = {
    totalWorkspaces: 8,
    activeWorkspaces: 5,
    completedWorkspaces: 2,
    teamMembers: 12,
    aiOptimizationScore: 8.5,
    predictedEfficiency: 25
  },
  isLoading = false,
  onCreateWorkspace,
  onViewWorkspace,
  onEditWorkspace,
  onExecuteAIAction,
  onDismissRecommendation
}: WorkspaceAssistedProps) {
  const [searchTerm, setSearchTerm] = useState('')

  // Enhanced workspaces with AI insights
  const enhancedWorkspaces = [
    {
      id: '1',
      name: 'TechCorp Due Diligence',
      type: 'Due Diligence',
      status: 'Active',
      workProducts: 8,
      teamMembers: 4,
      lastActivity: '2 hours ago',
      progress: 75,
      aiOptimizationScore: 9.2,
      aiPrediction: 85,
      aiEfficiency: 30,
      aiInsights: [
        { summary: 'Team velocity increased 25% with AI document analysis' },
        { summary: 'Risk assessment automation saved 12 hours this week' }
      ],
      aiSuggestions: [
        { label: 'Optimize', action: 'OPTIMIZE_WORKFLOW', description: 'Thando suggests workflow optimization' },
        { label: 'Automate', action: 'AUTO_TASKS', description: 'Automate routine tasks' }
      ]
    },
    {
      id: '2',
      name: 'HealthCo Investment Committee',
      type: 'IC Preparation',
      status: 'Review',
      workProducts: 12,
      teamMembers: 6,
      lastActivity: '1 day ago',
      progress: 90,
      aiOptimizationScore: 8.8,
      aiPrediction: 95,
      aiEfficiency: 40,
      aiInsights: [
        { summary: 'IC deck auto-generated based on DD findings' },
        { summary: 'Financial model validation shows 98% accuracy' }
      ],
      aiSuggestions: [
        { label: 'Review', action: 'AI_REVIEW', description: 'AI final review recommendations' }
      ]
    },
    {
      id: '3',
      name: 'RetailCo Deal Screening',
      type: 'Screening',
      status: 'Active',
      workProducts: 5,
      teamMembers: 3,
      lastActivity: '3 hours ago',
      progress: 45,
      aiOptimizationScore: 7.5,
      aiPrediction: 60,
      aiEfficiency: 20,
      aiInsights: [
        { summary: 'Market analysis completed using AI data synthesis' },
        { summary: 'Comparable company matching confidence: 85%' }
      ],
      aiSuggestions: [
        { label: 'Accelerate', action: 'ACCELERATE_SCREENING', description: 'Speed up screening process' }
      ]
    }
  ]

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mb-4"></div>
        <h3 className="text-xl font-semibold text-gray-700">AI is analyzing workspace data...</h3>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4 md:p-6">
      {/* Header - AI-Assisted Theme */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <div className="flex items-center space-x-3">
            <h1 className="text-3xl font-bold text-gray-900">AI-Enhanced Workspaces</h1>
            <Badge className="bg-purple-100 text-purple-800 border border-purple-300 flex items-center space-x-1">
              <Brain className="h-3 w-3" />
              <span>Assisted Mode</span>
            </Badge>
          </div>
          <p className="text-gray-600 mt-1">Intelligent workspace optimization with AI-powered insights and automation</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            onClick={onCreateWorkspace} 
            className="flex items-center space-x-2 border-purple-300 text-purple-700 hover:bg-purple-50"
          >
            <Sparkles className="h-4 w-4" />
            <span>Smart Create Workspace</span>
          </Button>
          <Button className="bg-purple-600 hover:bg-purple-700 text-white">
            <Zap className="h-4 w-4 mr-2" />
            AI Actions
          </Button>
        </div>
      </div>
      
      {/* AI Insights Panel */}
      {aiRecommendations.length > 0 && (
        <WorkspaceAIInsightsPanel
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
              <FolderOpen className="h-5 w-5 text-purple-600" />
              <p className="text-sm text-gray-600 font-medium">Smart Workspaces</p>
            </div>
            <p className="text-3xl font-bold text-gray-900">{metrics.totalWorkspaces}</p>
            <div className="flex items-center text-purple-600 text-sm mt-1">
              <TrendingUp className="h-4 w-4 mr-1" />
              AI-optimized
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-purple-200 bg-white">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2 mb-2">
              <Clock className="h-5 w-5 text-purple-600" />
              <p className="text-sm text-gray-600 font-medium">Active Projects</p>
            </div>
            <p className="text-3xl font-bold text-gray-900">{metrics.activeWorkspaces}</p>
            <div className="flex items-center text-purple-600 text-sm mt-1">
              <Brain className="h-4 w-4 mr-1" />
              AI-tracked
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
            <p className="text-sm text-gray-600 font-medium mb-2">Team Members</p>
            <p className="text-3xl font-bold text-gray-900">{metrics.teamMembers}</p>
            <div className="flex items-center text-green-600 text-sm mt-1">
              <CheckCircle className="h-4 w-4 mr-1" />
              AI-enhanced
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-purple-200 bg-white">
          <CardContent className="p-6">
            <p className="text-sm text-gray-600 font-medium mb-2">Efficiency Gain</p>
            <p className="text-3xl font-bold text-gray-900">+{metrics.predictedEfficiency}%</p>
            <div className="flex items-center text-purple-600 text-sm mt-1">
              <Lightbulb className="h-4 w-4 mr-1" />
              AI-powered
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI-Enhanced Search */}
      <div className="flex justify-between items-center mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-purple-400" />
          <Input
            placeholder="AI-powered workspace search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-96 border-purple-300 focus:border-purple-500 bg-white"
          />
        </div>
        
        <Button 
          variant="outline" 
          className="flex items-center space-x-2 border-purple-300 text-purple-700 hover:bg-purple-50"
        >
          <Brain className="h-4 w-4" />
          <span>AI Insights</span>
        </Button>
      </div>

      {/* Smart Workspace Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {enhancedWorkspaces.map((workspace) => (
          <SmartWorkspaceCard
            key={workspace.id}
            workspace={workspace}
            onView={() => onViewWorkspace?.(workspace.id)}
            onEdit={() => onEditWorkspace?.(workspace.id)}
            aiInsights={workspace.aiInsights}
          />
        ))}
      </div>

      {/* AI Assistance Status */}
      <div className="mt-6 p-4 bg-gradient-to-r from-purple-100 to-blue-100 border border-purple-200 rounded-lg">
        <div className="flex items-start space-x-3">
          <Brain className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-purple-900 mb-1">AI-Assisted Workspace Management Active</h4>
            <p className="text-sm text-purple-700">
              AI is continuously optimizing your workspace workflows, predicting completion times, and suggesting 
              efficiency improvements. All automation requires your approval before implementation. Current AI confidence: 94%
            </p>
            <div className="flex items-center space-x-4 mt-2 text-xs text-purple-600">
              <span>• 5 workspaces optimized this week</span>
              <span>• 8 automation opportunities found</span>
              <span>• 25% average efficiency improvement</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WorkspaceAssisted