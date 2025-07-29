'use client'

import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Brain,
  CheckCircle,
  AlertTriangle,
  Clock,
  Users,
  ArrowRight,
  Settings,
  Eye,
  MessageSquare
} from 'lucide-react'

interface DDAutonomousViewProps {
  project: any
  projects?: any[]
  automatedActions?: any[]
  pendingApprovals?: any[]
  aiRecommendations?: any[]
  isProcessing?: boolean
  onApproveAction?: (approvalId: string) => void
  onRejectAction?: (approvalId: string) => void
  onSwitchMode?: (mode: 'traditional' | 'assisted' | 'autonomous') => void
  isPaused?: boolean
}

export function DDAutonomousView({ 
  project,
  projects = [],
  automatedActions = [],
  pendingApprovals = [],
  aiRecommendations = [],
  isProcessing = false,
  onApproveAction,
  onRejectAction,
  onSwitchMode,
  isPaused = false
}: DDAutonomousViewProps) {
  const [showTraditionalView, setShowTraditionalView] = React.useState(false)

  // AI conversation data
  const mockAutomatedActions = [
    'Analyzed 47 documents and extracted key metrics',
    'Identified 6 potential risk areas with confidence scores',
    'Compared deal structure to 8 similar transactions',
    'Generated preliminary financial analysis',
    'Updated 12 task statuses based on document reviews',
    'Scheduled 3 follow-up interviews with management',
    'Created draft findings report with recommendations'
  ]

  const pendingDecisions = [
    {
      id: '1',
      question: 'Customer concentration is 67% (top 3 customers). This exceeds your typical 50% threshold. How should we proceed?',
      context: 'Industry benchmark is 35%. Similar deals flagged this at 60%+.',
      options: [
        { id: 'flag_high', label: 'Flag as high risk', action: 'FLAG_HIGH_RISK', recommended: true },
        { id: 'flag_medium', label: 'Flag as medium risk', action: 'FLAG_MEDIUM_RISK' },
        { id: 'deep_dive', label: 'Deep dive analysis first', action: 'ANALYZE_CUSTOMERS' },
        { id: 'no_flag', label: 'Acceptable for this sector', action: 'NO_FLAG' }
      ],
      urgency: 'high' as const,
      aiRecommendation: 'Based on sector analysis and risk patterns, recommend flagging as high risk with customer diversification plan requirement.'
    },
    {
      id: '2', 
      question: 'EBITDA margins declining (23% → 18% → 15% over 3 years). Should we prioritize operational due diligence?',
      context: 'Sector average is 22%. Competitors maintain 20%+ margins.',
      options: [
        { id: 'ops_priority', label: 'Yes, deep dive on operations', action: 'PRIORITIZE_OPS', recommended: true },
        { id: 'continue', label: 'Continue standard process', action: 'STANDARD_PROCESS' },
        { id: 'focus_costs', label: 'Focus on cost structure only', action: 'FOCUS_COSTS' },
        { id: 'management_plan', label: 'Request management improvement plan', action: 'REQUEST_PLAN' }
      ],
      urgency: 'medium' as const,
      aiRecommendation: 'Margin decline pattern suggests operational inefficiencies. Recommend operational DD with cost structure focus.'
    }
  ]

  const upcomingActions = [
    {
      id: '1',
      action: 'Complete IT infrastructure assessment',
      timing: 'Next 2 days',
      confidence: 0.95,
      automate: false,
      reason: 'Requires technical expertise and site access'
    },
    {
      id: '2',
      action: 'Generate management presentation summary',
      timing: 'This afternoon',
      confidence: 0.88,
      automate: true,
      reason: 'Similar presentations analyzed previously'
    },
    {
      id: '3',
      action: 'Validate customer retention metrics',
      timing: 'After customer concentration decision',
      confidence: 0.92,
      automate: true,
      reason: 'Data extraction and benchmarking process'
    }
  ]

  const renderConversationalInterface = () => (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* AI Status */}
      <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-blue-50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Brain className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-purple-800">AI Project Manager</h2>
                <p className="text-sm text-purple-600">Managing {project?.name || 'No Project Selected'} due diligence</p>
              </div>
            </div>
            <Badge variant="ai" className="text-sm">
              92% Automated
            </Badge>
          </div>
          
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-green-600">{mockAutomatedActions.length}</div>
              <div className="text-sm text-green-700">Actions Completed</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-600">{pendingDecisions.length}</div>
              <div className="text-sm text-orange-700">Decisions Needed</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">12.5h</div>
              <div className="text-sm text-blue-700">Time Saved</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Conversation Flow */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-6">
            {/* AI Message */}
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Brain className="w-4 h-4 text-purple-600" />
              </div>
              <div className="flex-1">
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <p className="text-sm mb-3">
                    I've completed the initial analysis of {project?.name || 'the selected project'}. Here's what I've accomplished and what needs your attention:
                  </p>
                </div>

                {/* Completed Actions */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                  <h4 className="font-medium text-green-800 mb-3 flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    ✅ Completed Automatically
                  </h4>
                  <div className="space-y-2">
                    {mockAutomatedActions.map((action, index) => (
                      <div key={index} className="text-sm text-green-700 flex items-center">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-3 flex-shrink-0" />
                        {action}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pending Decisions */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h4 className="font-medium text-yellow-800 mb-4 flex items-center">
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    🤔 Decisions Needed
                  </h4>
                  
                  <div className="space-y-6">
                    {pendingDecisions.map((decision) => (
                      <DecisionRequest key={decision.id} decision={decision} />
                    ))}
                  </div>
                </div>

                {/* Next Actions Preview */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                  <h4 className="font-medium text-blue-800 mb-3 flex items-center">
                    <Clock className="w-4 h-4 mr-2" />
                    📋 Coming Up Next
                  </h4>
                  <div className="space-y-2">
                    {upcomingActions.map((action) => (
                      <div key={action.id} className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-2">
                          <div className={`w-2 h-2 rounded-full ${action.automate ? 'bg-green-500' : 'bg-blue-500'}`} />
                          <span className="text-blue-700">{action.action}</span>
                          {action.automate && <Badge variant="ai" className="text-xs">Auto</Badge>}
                        </div>
                        <span className="text-blue-600 text-xs">{action.timing}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">89%</div>
            <div className="text-sm text-gray-600">Progress Complete</div>
            <div className="text-xs text-purple-600 mt-1">3 days ahead of schedule</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">94%</div>
            <div className="text-sm text-gray-600">AI Confidence</div>
            <div className="text-xs text-green-600 mt-1">High accuracy predictions</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">6.8/10</div>
            <div className="text-sm text-gray-600">Risk Score</div>
            <div className="text-xs text-orange-600 mt-1">2 high-priority items</div>
          </CardContent>
        </Card>
      </div>

      {/* Escape Hatch */}
      <Card className="border-gray-300 border-dashed">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-700">Want more control?</h3>
              <p className="text-sm text-gray-500">Switch to traditional view for detailed navigation</p>
            </div>
            <Button 
              variant="outline" 
              onClick={() => setShowTraditionalView(!showTraditionalView)}
            >
              <Eye className="w-4 h-4 mr-2" />
              {showTraditionalView ? 'Hide' : 'Show'} Details
            </Button>
          </div>
          
          {showTraditionalView && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center text-sm">
                <div>
                  <div className="font-semibold">{project?.tasksCompleted || 0}/{project?.tasksTotal || 0}</div>
                  <div className="text-gray-500">Tasks</div>
                </div>
                <div>
                  <div className="font-semibold">{project?.findingsCount || 0}</div>
                  <div className="text-gray-500">Findings</div>
                </div>
                <div>
                  <div className="font-semibold">{project?.risksCount || 0}</div>
                  <div className="text-gray-500">Risks</div>
                </div>
                <div>
                  <div className="font-semibold">{project.documentsCount}</div>
                  <div className="text-gray-500">Documents</div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )

  return (
    <div className="p-6 bg-gradient-to-br from-purple-50 to-blue-50 min-h-screen">
      {/* Autonomous Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-100 to-blue-100 rounded-full mb-4">
          <Brain className="w-5 h-5 text-purple-600" />
          <span className="font-medium text-purple-800">Autonomous Mode Active</span>
        </div>
        <h1 className="text-2xl font-bold mb-2">AI Project Command Center</h1>
        <p className="text-gray-600">AI handling routine tasks - focusing on decisions that need you</p>
      </div>

      {renderConversationalInterface()}
    </div>
  )
}

// Decision Request Component
interface DecisionRequestProps {
  decision: any
}

function DecisionRequest({ decision }: DecisionRequestProps) {
  return (
    <div className="border border-yellow-300 rounded-lg p-4 bg-white">
      <div className="mb-3">
        <div className="flex items-center justify-between mb-2">
          <Badge variant={decision.urgency === 'high' ? 'destructive' : 'warning'} className="text-xs">
            {decision.urgency} priority
          </Badge>
        </div>
        <p className="text-sm text-gray-800 mb-2">{decision.question}</p>
        <p className="text-xs text-gray-600 mb-3">{decision.context}</p>
      </div>
      
      <div className="space-y-2 mb-3">
        {decision.options.map((option: any) => (
          <Button
            key={option.id}
            variant={option.recommended ? "default" : "outline"}
            size="sm"
            className="w-full justify-start text-xs"
          >
            {option.label}
            {option.recommended && <Badge variant="ai" className="ml-2 text-xs">Recommended</Badge>}
          </Button>
        ))}
      </div>
      
      <div className="bg-purple-50 p-3 rounded text-xs">
        <div className="flex items-start space-x-2">
          <Brain className="w-3 h-3 text-purple-600 mt-0.5 flex-shrink-0" />
          <div>
            <span className="font-medium text-purple-700">AI Recommendation: </span>
            <span className="text-purple-600">{decision.aiRecommendation}</span>
          </div>
        </div>
      </div>
    </div>
  )
}