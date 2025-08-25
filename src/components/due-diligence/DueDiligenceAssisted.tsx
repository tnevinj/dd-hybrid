'use client'

import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { DDTabs } from './DDTabs'
import { RiskAnalysisHub } from './RiskAnalysisHub'
import { DocumentManagement } from './DocumentManagement'
import { FindingsManagement } from './FindingsManagement'
import { RiskWorkflowAutomation } from './RiskWorkflowAutomation'
import { AIAutomationHub } from './AIAutomationHub'
import { DueDiligenceDashboard } from './DueDiligenceDashboard'
import { OperationalAssessment } from './OperationalAssessment'
import { ManagementTeamAssessment } from './ManagementTeamAssessment'
import { useNavigationStoreRefactored } from '@/stores/navigation-store-refactored'
import { 
  Brain,
  Zap,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Users,
  FileText,
  Lightbulb,
  Target,
  ArrowRight,
  Star,
  ArrowLeft
} from 'lucide-react'

interface DueDiligenceAssistedProps {
  project: any
  projects?: any[]
  aiRecommendations?: any[]
  metrics?: any
  isLoading?: boolean
  onSelectProject?: (project: any | undefined) => void
  onExecuteAIAction?: (actionId: string) => void
  onDismissRecommendation?: (id: string) => void
}

export function DueDiligenceAssisted({ 
  project, 
  projects = [],
  aiRecommendations = [],
  metrics,
  isLoading = false,
  onSelectProject,
  onExecuteAIAction,
  onDismissRecommendation
}: DueDiligenceAssistedProps) {
  const [activeTab, setActiveTab] = React.useState('overview')
  const { recommendations, executeRecommendation } = useNavigationStoreRefactored()

  // AI-enhanced data
  const aiInsights = [
    {
      id: '1',
      type: 'pattern' as const,
      title: 'Similar Deal Pattern Detected',
      description: 'This B2B SaaS acquisition shows 87% similarity to CloudCo deal (successful exit)',
      confidence: 87,
      impact: 'high' as const,
      actionable: true,
      actions: [
        { label: 'Apply CloudCo Template', action: 'APPLY_TEMPLATE' },
        { label: 'Compare Differences', action: 'COMPARE_DEALS' }
      ]
    },
    {
      id: '2',
      type: 'risk' as const,
      title: 'Customer Concentration Risk',
      description: 'Top 3 customers = 67% of revenue. Industry average is 35%.',
      confidence: 94,
      impact: 'high' as const,
      actionable: true,
      actions: [
        { label: 'Deep Dive Analysis', action: 'ANALYZE_CUSTOMERS' },
        { label: 'Schedule Customer Calls', action: 'SCHEDULE_CALLS' }
      ]
    },
    {
      id: '3',
      type: 'efficiency' as const,
      title: 'Automation Opportunity',
      description: '12 routine tasks can be automated based on uploaded documents',
      confidence: 91,
      impact: 'medium' as const,
      actionable: true,
      actions: [
        { label: 'Start Automation', action: 'AUTO_TASKS', estimatedSaving: '4.5 hours' }
      ]
    }
  ]

  const smartSuggestions = [
    {
      id: '1',
      category: 'Next Steps',
      suggestion: 'Schedule management presentation review',
      reasoning: 'Based on timeline and similar deals',
      priority: 'high' as const,
      estimatedTime: '30 min'
    },
    {
      id: '2',
      category: 'Risk Review',
      suggestion: 'Validate customer retention metrics',
      reasoning: 'High customer concentration detected',
      priority: 'high' as const,
      estimatedTime: '2 hours'
    },
    {
      id: '3',
      category: 'Efficiency',
      suggestion: 'Automate financial ratio calculations',
      reasoning: 'Similar data structure to previous deals',
      priority: 'medium' as const,
      estimatedTime: 'Save 1.5 hours'
    }
  ]

  const enhancedMetrics = [
    {
      title: 'Progress Score',
      value: `${project?.progress || 0}%`,
      change: '+8% vs typical',
      trend: 'up' as const,
      aiInsight: 'Ahead of schedule due to similar deal patterns'
    },
    {
      title: 'Risk Score',
      value: '6.8/10',
      change: 'Medium risk',
      trend: 'stable' as const,
      aiInsight: 'Customer concentration main concern'
    },
    {
      title: 'Completion ETA',
      value: '12 days',
      change: '3 days early',
      trend: 'up' as const,
      aiInsight: 'AI automation accelerating timeline'
    },
    {
      title: 'Quality Score',
      value: '92%',
      change: '+15% vs avg',
      trend: 'up' as const,
      aiInsight: 'Template matching improving thoroughness'
    }
  ]

  const renderAIInsightsPanel = () => (
    <Card className="border-l-4 border-l-blue-500">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-blue-700">
          <Brain className="w-5 h-5 mr-2" />
          AI Insights
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {aiInsights.map((insight) => (
            <div key={insight.id} className="border rounded-lg p-3 bg-blue-50">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <div className="p-1 bg-blue-100 rounded">
                    {insight.type === 'pattern' && <TrendingUp className="w-3 h-3 text-blue-600" />}
                    {insight.type === 'risk' && <AlertTriangle className="w-3 h-3 text-blue-600" />}
                    {insight.type === 'efficiency' && <Zap className="w-3 h-3 text-blue-600" />}
                  </div>
                  <h4 className="text-sm font-medium">{insight.title}</h4>
                </div>
                <Badge variant="outline" className="text-xs">
                  {insight.confidence}% confident
                </Badge>
              </div>
              
              <p className="text-sm text-gray-600 mb-3">{insight.description}</p>
              
              <div className="flex flex-wrap gap-2">
                {insight.actions.map((action, index) => (
                  <Button key={index} variant="outline" size="sm" className="text-xs h-6">
                    {action.label}
                    {'estimatedSaving' in action && action.estimatedSaving && (
                      <span className="ml-1 text-green-600">({action.estimatedSaving})</span>
                    )}
                  </Button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )

  const renderSmartSuggestions = () => (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-blue-700">
          <Lightbulb className="w-5 h-5 mr-2" />
          Smart Suggestions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {smartSuggestions.map((suggestion) => (
            <div key={suggestion.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-blue-50">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <Badge variant="outline" className="text-xs">
                    {suggestion.category}
                  </Badge>
                  <Badge variant={suggestion.priority === 'high' ? 'destructive' : 'secondary'} className="text-xs">
                    {suggestion.priority}
                  </Badge>
                </div>
                <h4 className="text-sm font-medium">{suggestion.suggestion}</h4>
                <p className="text-xs text-gray-500">{suggestion.reasoning}</p>
                <p className="text-xs text-blue-600 mt-1">⏱ {suggestion.estimatedTime}</p>
              </div>
              <Button variant="ghost" size="sm">
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )

  const renderEnhancedMetrics = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {enhancedMetrics.map((metric, index) => (
        <Card key={index} className="border-l-4 border-l-blue-400">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">{metric.title}</span>
              <div className="flex items-center space-x-1">
                {metric.trend === 'up' && <TrendingUp className="w-3 h-3 text-green-500" />}
                <Brain className="w-3 h-3 text-blue-500" />
              </div>
            </div>
            <div className="text-2xl font-bold mb-1">{metric.value}</div>
            <div className={`text-xs mb-2 ${metric.trend === 'up' ? 'text-green-600' : 'text-gray-600'}`}>
              {metric.change}
            </div>
            <div className="text-xs text-blue-600 bg-blue-50 p-2 rounded">
              💡 {metric.aiInsight}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )

  const renderOverviewTab = () => (
    <div className="space-y-6">
      {/* AI Enhancement Banner */}
      <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-blue-50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Brain className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-blue-800">AI Assistant Active</h3>
                <p className="text-sm text-blue-600">
                  Pattern matching, risk analysis, and workflow optimization enabled
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="ai">3 insights</Badge>
              <Badge variant="outline">5 suggestions</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Metrics */}
      {renderEnhancedMetrics()}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* AI Insights */}
        {renderAIInsightsPanel()}
        
        {/* Smart Suggestions */}
        {renderSmartSuggestions()}
      </div>

      {/* Automation Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Zap className="w-5 h-5 mr-2 text-yellow-500" />
            Automation Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">8</div>
              <div className="text-sm text-green-700">Tasks Automated</div>
              <div className="text-xs text-green-600 mt-1">Saved 12.5 hours</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">4</div>
              <div className="text-sm text-blue-700">Ready to Automate</div>
              <div className="text-xs text-blue-600 mt-1">Could save 6 hours</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">92%</div>
              <div className="text-sm text-blue-700">AI Confidence</div>
              <div className="text-xs text-blue-600 mt-1">High accuracy</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  // If no project is selected, show the dashboard
  if (!project) {
    return <DueDiligenceDashboard className="assisted-mode" mode="assisted" />
  }

  // If a project is selected, show project details with navigation
  return (
    <div className="p-6">
      {/* Mode Indicator */}
      <div className="mb-6">
        <Badge className="bg-blue-100 text-blue-800 border border-blue-300 flex items-center space-x-1">
          <Brain className="h-3 w-3" />
          <span>Assisted Mode</span>
        </Badge>
      </div>

      {/* AI-Enhanced Navigation Tabs */}
      <DDTabs 
        activeTab={activeTab}
        onTabChange={setActiveTab}
        mode="assisted"
        aiEnhancements={true}
      />
      
      <div className="mt-6">
        {activeTab === 'overview' && renderOverviewTab()}
        {activeTab === 'tasks' && (
          <div className="text-center py-12">
            <div className="flex items-center justify-center mb-4">
              <CheckCircle className="w-12 h-12 text-blue-400 mr-2" />
              <Brain className="w-8 h-8 text-blue-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-600">AI-Enhanced Task Management</h3>
            <p className="text-gray-500">Intelligent task prioritization and automation</p>
            <Badge variant="ai" className="mt-2">Coming Soon</Badge>
          </div>
        )}
        {activeTab === 'findings' && (
          <FindingsManagement projectId={project?.id} />
        )}
        {activeTab === 'risks' && (
          <RiskAnalysisHub projectId={project?.id} />
        )}
        {activeTab === 'documents' && (
          <DocumentManagement projectId={project?.id} />
        )}
        {activeTab === 'workflows' && (
          <RiskWorkflowAutomation projectId={project?.id} />
        )}
        {activeTab === 'operational' && (
          <OperationalAssessment projectId={project?.id} mode="assisted" />
        )}
        {activeTab === 'management' && (
          <ManagementTeamAssessment projectId={project?.id} mode="assisted" />
        )}
        {activeTab === 'automation' && (
          <AIAutomationHub projectId={project.id} />
        )}
        {/* Other tabs... */}
      </div>
    </div>
  )
}