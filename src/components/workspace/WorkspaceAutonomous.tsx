'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  MessageSquare,
  Sparkles,
  Zap,
  TrendingUp,
  CheckCircle,
  Clock,
  FolderOpen,
  Users,
  Lightbulb,
  Target,
  ArrowRight,
  Send,
  Bot,
  Play,
  Pause,
  RefreshCw,
  AlertTriangle,
  ThumbsUp,
  ThumbsDown,
  Settings
} from 'lucide-react'

// Conversational Chat Interface Component
const WorkspaceAIChat: React.FC<{
  messages: any[]
  onSendMessage: (message: string) => void
  isProcessing?: boolean
}> = ({ messages, onSendMessage, isProcessing = false }) => {
  const [inputMessage, setInputMessage] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (inputMessage.trim() && !isProcessing) {
      onSendMessage(inputMessage.trim())
      setInputMessage('')
    }
  }

  return (
    <Card className="mb-6 border-2 border-green-200">
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Bot className="h-5 w-5 text-green-600" />
          <CardTitle className="text-green-900">AI Workspace Manager</CardTitle>
          <Badge variant="ai" className="text-xs bg-green-100 text-green-800">
            Autonomous Mode
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {/* Chat Messages */}
        <div className="h-64 overflow-y-auto mb-4 space-y-3 p-3 bg-gray-50 rounded-lg">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                  msg.type === 'user'
                    ? 'bg-green-600 text-white'
                    : 'bg-white border border-gray-200 text-gray-900'
                }`}
              >
                {msg.type === 'ai' && (
                  <div className="flex items-center space-x-1 mb-1">
                    <Bot className="h-3 w-3 text-green-600" />
                    <span className="text-xs font-medium text-green-600">AI Manager</span>
                  </div>
                )}
                <p>{msg.content}</p>
                {msg.actions && (
                  <div className="flex space-x-1 mt-2">
                    {msg.actions.map((action: any, i: number) => (
                      <Button
                        key={i}
                        size="sm"
                        variant="outline"
                        className="text-xs h-6"
                        onClick={() => action.onClick()}
                      >
                        {action.label}
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          {isProcessing && (
            <div className="flex justify-start">
              <div className="bg-white border border-gray-200 text-gray-900 max-w-xs px-3 py-2 rounded-lg text-sm">
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-green-600"></div>
                  <span>AI is thinking...</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Message Input */}
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Tell the AI what you want to do with workspaces..."
            className="flex-1 border-green-300 focus:border-green-500"
            disabled={isProcessing}
          />
          <Button 
            type="submit" 
            disabled={!inputMessage.trim() || isProcessing}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

// Autonomous Action Panel Component
const AutonomousActionPanel: React.FC<{
  automatedActions: any[]
  onApproveAction: (actionId: string) => void
  onRejectAction: (actionId: string) => void
  onPauseAutomation: () => void
  onResumeAutomation: () => void
  automationPaused: boolean
}> = ({ 
  automatedActions, 
  onApproveAction, 
  onRejectAction, 
  onPauseAutomation, 
  onResumeAutomation,
  automationPaused 
}) => (
  <Card className="mb-6 border-2 border-green-200">
    <CardHeader>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Zap className="h-5 w-5 text-green-600" />
          <CardTitle className="text-green-900">Autonomous Actions</CardTitle>
          <Badge variant="ai" className="text-xs">
            {automatedActions.length} pending approvals
          </Badge>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            size="sm"
            variant="outline"
            onClick={automationPaused ? onResumeAutomation : onPauseAutomation}
            className={automationPaused ? 'text-green-600' : 'text-yellow-600'}
          >
            {automationPaused ? (
              <>
                <Play className="h-4 w-4 mr-1" />
                Resume
              </>
            ) : (
              <>
                <Pause className="h-4 w-4 mr-1" />
                Pause
              </>
            )}
          </Button>
          <Button size="sm" variant="outline">
            <Settings className="h-4 w-4 mr-1" />
            Configure
          </Button>
        </div>
      </div>
    </CardHeader>
    <CardContent className="space-y-4">
      {automatedActions.map((action) => (
        <div
          key={action.id}
          className={`p-4 rounded-lg border ${
            action.priority === 'high' 
              ? 'bg-yellow-50 border-yellow-200' 
              : action.priority === 'critical' 
              ? 'bg-red-50 border-red-200' 
              : 'bg-green-50 border-green-200'
          }`}
        >
          <div className="flex justify-between items-start mb-2">
            <h4 className="font-semibold text-gray-900 flex items-center">
              {action.type === 'optimization' && <Target className="w-4 h-4 mr-2 text-green-600" />}
              {action.type === 'automation' && <Zap className="w-4 h-4 mr-2 text-blue-600" />}
              {action.type === 'creation' && <FolderOpen className="w-4 h-4 mr-2 text-purple-600" />}
              {action.type === 'analysis' && <TrendingUp className="w-4 h-4 mr-2 text-orange-600" />}
              {action.title}
            </h4>
            <div className="flex items-center space-x-2">
              <Button
                size="sm"
                onClick={() => onApproveAction(action.id)}
                className="bg-green-600 hover:bg-green-700 text-white text-xs"
              >
                <ThumbsUp className="h-3 w-3 mr-1" />
                Approve
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onRejectAction(action.id)}
                className="text-xs"
              >
                <ThumbsDown className="h-3 w-3 mr-1" />
                Reject
              </Button>
            </div>
          </div>
          <p className="text-sm text-gray-700 mb-2">{action.description}</p>
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Confidence: {Math.round(action.confidence * 100)}%</span>
            {action.estimatedTime && (
              <span className="flex items-center">
                <Clock className="w-3 h-3 mr-1" />
                Est. completion: {action.estimatedTime}
              </span>
            )}
          </div>
        </div>
      ))}
    </CardContent>
  </Card>
)

// AI-Managed Workspace Card Component
const AIWorkspaceCard: React.FC<{
  workspace: any
  aiStatus: any
}> = ({ workspace, aiStatus }) => {
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
    <Card className="group transition-all duration-200 border-l-4 border-l-green-300">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="font-semibold text-gray-900 group-hover:text-green-700">
              {workspace.name}
            </h3>
            <p className="text-sm text-gray-600">{workspace.lastActivity}</p>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="ai" className="text-xs flex items-center bg-green-100 text-green-800">
              <Bot className="w-3 h-3 mr-1" />
              AI Managed
            </Badge>
            <Badge className={`text-xs ${getStatusColor(workspace.status)}`}>
              {workspace.status}
            </Badge>
          </div>
        </div>

        <div className="flex items-center space-x-2 mb-3">
          <Badge className={`text-xs ${getTypeColor(workspace.type)}`}>
            {workspace.type}
          </Badge>
          <Badge variant="ai" className="text-xs bg-green-100 text-green-800">
            Automation: {aiStatus.automationLevel}%
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-3">
          <div>
            <p className="text-xs text-gray-500">AI Progress</p>
            <div className="flex items-center space-x-2">
              <p className="font-semibold text-gray-900">{workspace.progress}%</p>
              <span className="text-xs text-green-600">
                (Auto-updating)
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
              <div 
                className="bg-green-600 h-2 rounded-full transition-all duration-500" 
                style={{ width: `${workspace.progress}%` }}
              />
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-500">AI Actions Today</p>
            <p className="font-semibold text-gray-900">{aiStatus.actionsToday}</p>
            <p className="text-xs text-green-600">+{aiStatus.efficiencyGain}% efficiency</p>
          </div>
        </div>

        {/* AI Status Indicators */}
        <div className="mb-3 p-2 bg-green-50 rounded-md border border-green-100">
          <div className="flex items-center justify-between mb-1">
            <p className="text-xs font-medium text-green-800">AI Status</p>
            <Badge variant="ai" className="text-xs bg-green-200 text-green-800">
              {aiStatus.status}
            </Badge>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-green-700">• {aiStatus.currentActivity}</p>
            <p className="text-xs text-green-700">• Next: {aiStatus.nextAction}</p>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-xs text-gray-500">
            Last AI action: {aiStatus.lastActionTime}
          </div>
          <div className="flex items-center space-x-1">
            <Button
              size="sm"
              variant="ghost"
              className="text-xs h-6 text-green-600 hover:text-green-800"
            >
              <RefreshCw className="w-3 h-3 mr-1" />
              Refresh
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

interface WorkspaceAutonomousProps {
  workspaces?: any[]
  chatMessages?: any[]
  automatedActions?: any[]
  metrics?: any
  isLoading?: boolean
  onSendMessage?: (message: string) => void
  onApproveAction?: (actionId: string) => void
  onRejectAction?: (actionId: string) => void
  onPauseAutomation?: () => void
  onResumeAutomation?: () => void
}

export function WorkspaceAutonomous({
  workspaces = [],
  chatMessages = [],
  automatedActions = [],
  metrics = {
    totalWorkspaces: 8,
    activeWorkspaces: 5,
    aiManagedWorkspaces: 6,
    automationRate: 85,
    efficiencyGain: 45,
    actionsToday: 23
  },
  isLoading = false,
  onSendMessage,
  onApproveAction,
  onRejectAction,
  onPauseAutomation,
  onResumeAutomation
}: WorkspaceAutonomousProps) {
  const [automationPaused, setAutomationPaused] = useState(false)

  // Enhanced workspaces with AI management status
  const aiManagedWorkspaces = [
    {
      id: '1',
      name: 'TechCorp Due Diligence',
      type: 'Due Diligence',
      status: 'Active',
      workProducts: 8,
      teamMembers: 4,
      lastActivity: '15 minutes ago (AI updated)',
      progress: 82,
      aiStatus: {
        status: 'Optimizing',
        automationLevel: 90,
        actionsToday: 8,
        efficiencyGain: 35,
        currentActivity: 'Auto-generating risk assessment report',
        nextAction: 'Schedule team review meeting',
        lastActionTime: '5 min ago'
      }
    },
    {
      id: '2',
      name: 'HealthCo Investment Committee',
      type: 'IC Preparation',
      status: 'Review',
      workProducts: 12,
      teamMembers: 6,
      lastActivity: '1 hour ago (AI completed)',
      progress: 95,
      aiStatus: {
        status: 'Monitoring',
        automationLevel: 75,
        actionsToday: 5,
        efficiencyGain: 50,
        currentActivity: 'Finalizing presentation deck',
        nextAction: 'Send approval notifications',
        lastActionTime: '1 hr ago'
      }
    },
    {
      id: '3',
      name: 'RetailCo Deal Screening',
      type: 'Screening',
      status: 'Active',
      workProducts: 5,
      teamMembers: 3,
      lastActivity: '30 minutes ago (AI analyzed)',
      progress: 68,
      aiStatus: {
        status: 'Analyzing',
        automationLevel: 95,
        actionsToday: 12,
        efficiencyGain: 60,
        currentActivity: 'Processing market comparables',
        nextAction: 'Generate valuation summary',
        lastActionTime: '30 min ago'
      }
    }
  ]

  // Mock chat messages
  const mockChatMessages = [
    {
      type: 'ai',
      content: 'Hello! I\'m managing 6 workspaces autonomously. TechCorp DD is 82% complete, and I\'ve automated the risk assessment. Would you like me to schedule the team review?',
      actions: [
        { label: 'Schedule Review', onClick: () => {} },
        { label: 'View Details', onClick: () => {} }
      ]
    },
    {
      type: 'user',
      content: 'Yes, schedule the review for tomorrow morning'
    },
    {
      type: 'ai',
      content: 'Perfect! I\'ve scheduled the TechCorp review for tomorrow at 9 AM and sent calendar invites to all 4 team members. I\'ll prepare the agenda and supporting materials automatically.',
      actions: [
        { label: 'View Calendar', onClick: () => {} }
      ]
    }
  ]

  // Mock automated actions
  const mockAutomatedActions = [
    {
      id: '1',
      type: 'optimization',
      title: 'Optimize HealthCo Workspace Flow',
      description: 'AI suggests reorganizing work products based on IC timeline and streamlining approval workflow to reduce review time by 2 days.',
      priority: 'high',
      confidence: 0.92,
      estimatedTime: '2 hours'
    },
    {
      id: '2',
      type: 'automation',
      title: 'Auto-Generate RetailCo Comps Analysis',
      description: 'AI can automatically pull and analyze 15 comparable companies from market database and generate valuation benchmarks.',
      priority: 'medium',
      confidence: 0.88,
      estimatedTime: '45 minutes'
    },
    {
      id: '3',
      type: 'creation',
      title: 'Create New Manufacturing Deal Workspace',
      description: 'Based on email thread analysis, AI suggests creating a new workspace for Manufacturing Co deal with pre-populated templates.',
      priority: 'medium',
      confidence: 0.85,
      estimatedTime: '30 minutes'
    }
  ]

  const handlePauseAutomation = () => {
    setAutomationPaused(true)
    onPauseAutomation?.()
  }

  const handleResumeAutomation = () => {
    setAutomationPaused(false)
    onResumeAutomation?.()
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mb-4"></div>
        <h3 className="text-xl font-semibold text-gray-700">AI is initializing autonomous workspace management...</h3>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-50 p-4 md:p-6">
      {/* Header - Autonomous Theme */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <div className="flex items-center space-x-3">
            <h1 className="text-3xl font-bold text-gray-900">Autonomous Workspace Management</h1>
            <Badge className="bg-green-100 text-green-800 border border-green-300 flex items-center space-x-1">
              <Bot className="h-3 w-3" />
              <span>You Drive Mode</span>
            </Badge>
          </div>
          <p className="text-gray-600 mt-1">AI completely manages workspace operations with your approval for key decisions</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            className="flex items-center space-x-2 border-green-300 text-green-700 hover:bg-green-50"
          >
            <Lightbulb className="h-4 w-4" />
            <span>AI Insights</span>
          </Button>
          <Button className="bg-green-600 hover:bg-green-700 text-white">
            <Sparkles className="h-4 w-4 mr-2" />
            Configure AI
          </Button>
        </div>
      </div>

      {/* AI Chat Interface */}
      <WorkspaceAIChat
        messages={chatMessages.length > 0 ? chatMessages : mockChatMessages}
        onSendMessage={onSendMessage || (() => {})}
        isProcessing={false}
      />

      {/* Autonomous Actions Panel */}
      <AutonomousActionPanel
        automatedActions={automatedActions.length > 0 ? automatedActions : mockAutomatedActions}
        onApproveAction={onApproveAction || (() => {})}
        onRejectAction={onRejectAction || (() => {})}
        onPauseAutomation={handlePauseAutomation}
        onResumeAutomation={handleResumeAutomation}
        automationPaused={automationPaused}
      />

      {/* AI Metrics Dashboard */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
        <Card className="border-green-200 bg-white">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2 mb-2">
              <Bot className="h-5 w-5 text-green-600" />
              <p className="text-sm text-gray-600 font-medium">AI Managed</p>
            </div>
            <p className="text-3xl font-bold text-gray-900">{metrics.aiManagedWorkspaces}</p>
            <div className="flex items-center text-green-600 text-sm mt-1">
              <CheckCircle className="h-4 w-4 mr-1" />
              Autonomous
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-green-200 bg-white">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2 mb-2">
              <Zap className="h-5 w-5 text-green-600" />
              <p className="text-sm text-gray-600 font-medium">Automation Rate</p>
            </div>
            <p className="text-3xl font-bold text-gray-900">{metrics.automationRate}%</p>
            <div className="flex items-center text-green-600 text-sm mt-1">
              <TrendingUp className="h-4 w-4 mr-1" />
              High efficiency
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-green-200 bg-white">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2 mb-2">
              <Target className="h-5 w-5 text-green-600" />
              <p className="text-sm text-gray-600 font-medium">Efficiency Gain</p>
            </div>
            <p className="text-3xl font-bold text-gray-900">+{metrics.efficiencyGain}%</p>
            <div className="flex items-center text-green-600 text-sm mt-1">
              <Sparkles className="h-4 w-4 mr-1" />
              AI-powered
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-green-200 bg-white">
          <CardContent className="p-6">
            <p className="text-sm text-gray-600 font-medium mb-2">Actions Today</p>
            <p className="text-3xl font-bold text-gray-900">{metrics.actionsToday}</p>
            <div className="flex items-center text-green-600 text-sm mt-1">
              <Clock className="h-4 w-4 mr-1" />
              Automated
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-green-200 bg-white">
          <CardContent className="p-6">
            <p className="text-sm text-gray-600 font-medium mb-2">Active Projects</p>
            <p className="text-3xl font-bold text-gray-900">{metrics.activeWorkspaces}</p>
            <div className="flex items-center text-green-600 text-sm mt-1">
              <FolderOpen className="h-4 w-4 mr-1" />
              AI-tracked
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-green-200 bg-white">
          <CardContent className="p-6">
            <p className="text-sm text-gray-600 font-medium mb-2">Total Workspaces</p>
            <p className="text-3xl font-bold text-gray-900">{metrics.totalWorkspaces}</p>
            <div className="flex items-center text-green-600 text-sm mt-1">
              <Users className="h-4 w-4 mr-1" />
              Managed
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI-Managed Workspace Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {aiManagedWorkspaces.map((workspace) => (
          <AIWorkspaceCard
            key={workspace.id}
            workspace={workspace}
            aiStatus={workspace.aiStatus}
          />
        ))}
      </div>

      {/* Autonomous Management Status */}
      <div className="mt-6 p-4 bg-gradient-to-r from-green-100 to-teal-100 border border-green-200 rounded-lg">
        <div className="flex items-start space-x-3">
          <Bot className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-green-900 mb-1">Autonomous Workspace Management Active</h4>
            <p className="text-sm text-green-700">
              AI is fully managing workspace operations, automating routine tasks, optimizing workflows, and making 
              data-driven decisions. You'll be notified for approval on major actions. Current automation confidence: 89%
            </p>
            <div className="flex items-center space-x-4 mt-2 text-xs text-green-600">
              <span>• 6 workspaces under AI management</span>
              <span>• 23 automated actions completed today</span>
              <span>• 45% average efficiency improvement</span>
              <span>• 3 pending approvals</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WorkspaceAutonomous