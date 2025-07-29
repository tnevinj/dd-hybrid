'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  Bot,
  User,
  Send,
  MessageCircle,
  Zap,
  Brain,
  CheckCircle,
  Clock,
  AlertTriangle,
  TrendingUp,
  Play,
  Pause,
  Settings,
  Maximize2,
  RefreshCw,
  DollarSign,
  BarChart3,
  Target,
  Activity,
  FileText,
  Users,
  FolderOpen
} from 'lucide-react'

import { SecondaryEdgeDashboard } from './SecondaryEdgeDashboard'

// Conversation Message Interface
interface ConversationMessage {
  id: string
  type: 'ai' | 'user'
  content: string
  timestamp: Date
  actions?: Array<{ label: string; primary?: boolean; onClick: () => void }>
  status?: 'sending' | 'sent' | 'processing'
  data?: any // For displaying charts, tables, etc.
}

// Message Bubble Component
const MessageBubble: React.FC<{
  message: ConversationMessage
}> = ({ message }) => {
  const isAI = message.type === 'ai'
  
  return (
    <div className={`flex mb-4 ${isAI ? 'justify-start' : 'justify-end'}`}>
      {isAI && (
        <div className="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mr-3 mt-1">
          <Bot className="h-4 w-4 text-white" />
        </div>
      )}
      
      <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
        isAI 
          ? 'bg-blue-100 text-blue-900 border border-blue-200' 
          : 'bg-blue-600 text-white'
      }`}>
        <p className="text-sm">{message.content}</p>
        
        {/* Data visualization for AI responses */}
        {message.data && (
          <div className="mt-3 p-2 bg-white rounded border">
            {message.data.type === 'metrics' && (
              <div className="grid grid-cols-2 gap-2 text-xs">
                {message.data.metrics.map((metric: any, index: number) => (
                  <div key={index} className="text-center">
                    <div className="font-semibold text-blue-600">{metric.value}</div>
                    <div className="text-gray-600">{metric.label}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        
        {message.actions && (
          <div className="flex flex-wrap gap-2 mt-3">
            {message.actions.map((action, index) => (
              <Button
                key={index}
                size="sm"
                variant={action.primary ? 'default' : 'outline'}
                className={`text-xs ${
                  isAI 
                    ? 'bg-blue-600 hover:bg-blue-700 text-white border-blue-600' 
                    : 'bg-white text-blue-600 border-white hover:bg-blue-50'
                }`}
                onClick={action.onClick}
              >
                {action.label}
              </Button>
            ))}
          </div>
        )}
        
        {message.status === 'processing' && (
          <div className="flex items-center mt-2 text-xs text-blue-600">
            <div className="animate-spin rounded-full h-3 w-3 border-b border-blue-600 mr-2" />
            <span>AI is analyzing...</span>
          </div>
        )}
      </div>
      
      {!isAI && (
        <div className="flex-shrink-0 w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center ml-3 mt-1">
          <User className="h-4 w-4 text-white" />
        </div>
      )}
    </div>
  )
}

// Automated Actions Summary
const AutomatedActionsPanel: React.FC<{
  actions: any[]
  onRollback: (actionId: string) => void
}> = ({ actions, onRollback }) => (
  <Card className="mb-4 border-green-200">
    <CardHeader className="pb-3">
      <div className="flex items-center space-x-2">
        <CheckCircle className="h-4 w-4 text-green-600" />
        <CardTitle className="text-sm text-green-800">
          Completed Automatically ({actions.length})
        </CardTitle>
      </div>
    </CardHeader>
    <CardContent className="pt-0">
      <div className="space-y-2 max-h-32 overflow-y-auto">
        {actions.slice(0, 5).map((action) => (
          <div key={action.id} className="flex items-center justify-between text-xs text-green-700 bg-green-50 p-2 rounded">
            <span>• {action.description}</span>
            {action.rollbackable && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onRollback(action.id)}
                className="text-xs h-5 px-2 text-green-600 hover:text-green-800"
              >
                Undo
              </Button>
            )}
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
)

// Quick Action Suggestions
const QuickActionSuggestions: React.FC<{
  suggestions: Array<{ label: string; icon: React.ReactNode; onClick: () => void }>
}> = ({ suggestions }) => (
  <div className="grid grid-cols-2 gap-2 mb-4">
    {suggestions.map((suggestion, index) => (
      <Button
        key={index}
        variant="outline"
        size="sm"
        onClick={suggestion.onClick}
        className="text-left justify-start h-auto p-3 border-blue-200 hover:bg-blue-50"
      >
        <div className="flex items-center">
          {suggestion.icon}
          <span className="ml-2 text-xs">{suggestion.label}</span>
        </div>
      </Button>
    ))}
  </div>
)

interface DashboardAutonomousProps {
  dashboardData?: any
  activeDeals?: any[]
  recentActivity?: any[]
  upcomingDeadlines?: any[]
  workspaces?: any[]
  automatedActions?: any[]
  pendingApprovals?: any[]
  aiRecommendations?: any[]
  isProcessing?: boolean
  onApproveAction?: (approvalId: string) => void
  onRejectAction?: (approvalId: string) => void
  onSwitchMode?: (mode: 'traditional' | 'assisted' | 'autonomous') => void
  isPaused?: boolean
}

export function DashboardAutonomous({
  dashboardData,
  activeDeals = [],
  recentActivity = [],
  upcomingDeadlines = [],
  workspaces = [],
  automatedActions = [],
  pendingApprovals = [],
  aiRecommendations = [],
  isProcessing = false,
  onApproveAction,
  onRejectAction,
  onSwitchMode,
  isPaused = false
}: DashboardAutonomousProps) {
  const [messages, setMessages] = useState<ConversationMessage[]>([])
  const [userInput, setUserInput] = useState('')
  const [isExpanded, setIsExpanded] = useState(true)
  const [activeView, setActiveView] = useState<'conversation' | 'detailed'>('conversation')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Initialize with AI greeting
  useEffect(() => {
    if (messages.length === 0) {
      const welcomeMessage: ConversationMessage = {
        id: 'welcome',
        type: 'ai',
        content: "Hello! I'm autonomously managing your dashboard and operations. I've analyzed your current data and identified several optimization opportunities. How can I help you today?",
        timestamp: new Date(),
        data: {
          type: 'metrics',
          metrics: [
            { label: 'Active Deals', value: '12' },
            { label: 'Optimizations', value: '8' },
            { label: 'Risk Score', value: '2.1/5' },
            { label: 'Efficiency', value: '94%' }
          ]
        },
        actions: [
          {
            label: 'Show Dashboard Status',
            primary: true,
            onClick: () => handleQuickAction('dashboard-status')
          },
          {
            label: 'Review Optimizations',
            onClick: () => handleQuickAction('review-optimizations')
          }
        ]
      }
      setMessages([welcomeMessage])
    }
  }, [])

  const quickActions = [
    {
      label: 'Dashboard Summary',
      icon: <BarChart3 className="w-4 h-4" />,
      onClick: () => handleQuickAction('dashboard-summary')
    },
    {
      label: 'Optimize Operations',
      icon: <Target className="w-4 h-4" />,
      onClick: () => handleQuickAction('optimize-operations')
    },
    {
      label: 'Risk Assessment',
      icon: <AlertTriangle className="w-4 h-4" />,
      onClick: () => handleQuickAction('risk-assessment')
    },
    {
      label: 'Performance Analysis',
      icon: <TrendingUp className="w-4 h-4" />,
      onClick: () => handleQuickAction('performance-analysis')
    }
  ]

  const handleQuickAction = (actionType: string) => {
    // Add user message
    const userMessage: ConversationMessage = {
      id: `user-${Date.now()}`,
      type: 'user',
      content: getActionLabel(actionType),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: ConversationMessage = {
        id: `ai-${Date.now()}`,
        type: 'ai',
        content: getAIResponse(actionType),
        timestamp: new Date(),
        actions: getFollowUpActions(actionType)
      }

      setMessages(prev => [...prev, aiResponse])
    }, 1500)
  }

  const getActionLabel = (actionType: string): string => {
    const labels: Record<string, string> = {
      'dashboard-status': 'Show me my dashboard status',
      'review-optimizations': 'Review optimization recommendations',
      'dashboard-summary': 'Give me a dashboard summary',
      'optimize-operations': 'Optimize my operations',
      'risk-assessment': 'Perform risk assessment',
      'performance-analysis': 'Analyze performance'
    }
    return labels[actionType] || actionType
  }

  const getAIResponse = (actionType: string): string => {
    const responses: Record<string, string> = {
      'dashboard-status': 'Your dashboard shows strong performance: 12 active deals worth $750M total, 8 DD projects in progress, $2.4B AUM growing at 12% YTD. I\'ve identified 3 optimization opportunities.',
      'review-optimizations': 'I found these optimizations: 1) Automate DD workflows (saves 15h/week), 2) Streamline reporting (reduces turnaround by 40%), 3) Enhanced risk monitoring (improves accuracy 25%).',
      'dashboard-summary': 'Dashboard Overview: 12 active deals, 8 DD projects, 24 team members, $2.4B AUM. Performance: +12% YTD, beating targets. Risk: Low (2.1/5). AI efficiency: 94% with 8 active optimizations.',
      'optimize-operations': 'I recommend: Automate routine reporting (saves 20h/week), implement smart deal prioritization, enhance workspace collaboration tools. These changes could improve efficiency by 35%.',
      'risk-assessment': 'Current risk analysis: Deal concentration low (largest 8%), sector diversification good, liquidity strong. New risks detected: 2 regulatory changes affecting HealthCo deal. Overall: Low risk profile maintained.',
      'performance-analysis': 'Performance deep dive: 12% AUM growth vs 9% target. Deal success rate: 85% vs 75% industry avg. Team productivity up 25% with AI assistance. Pipeline strength: $1.2B qualified opportunities.'
    }
    return responses[actionType] || 'I\'m analyzing that for you. Please give me a moment.'
  }

  const getFollowUpActions = (actionType: string) => {
    const actions: Record<string, any[]> = {
      'optimize-operations': [
        { label: 'Execute Optimizations', primary: true, onClick: () => handleExecuteOptimization() },
        { label: 'See Details', onClick: () => handleShowDetails() }
      ],
      'risk-assessment': [
        { label: 'Mitigate Risks', primary: true, onClick: () => handleMitigateRisks() },
        { label: 'Monitor Alerts', onClick: () => handleMonitorAlerts() }
      ]
    }
    return actions[actionType] || []
  }

  const handleExecuteOptimization = () => {
    const confirmMessage: ConversationMessage = {
      id: `ai-${Date.now()}`,
      type: 'ai',
      content: 'Optimizations executed successfully! I\'ve automated routine reporting workflows, implemented smart deal prioritization, and enhanced collaboration tools. Expected efficiency gain: +35%. All changes are now active.',
      timestamp: new Date()
    }
    setMessages(prev => [...prev, confirmMessage])
  }

  const handleShowDetails = () => {
    const detailMessage: ConversationMessage = {
      id: `ai-${Date.now()}`,
      type: 'ai',
      content: 'Here are the detailed optimization plans: 1) Reporting automation reduces manual work from 20h to 5h/week, 2) Deal prioritization uses ML scoring on 15+ factors, 3) Workspace tools integrate with existing systems seamlessly.',
      timestamp: new Date()
    }
    setMessages(prev => [...prev, detailMessage])
  }

  const handleMitigateRisks = () => {
    const riskMessage: ConversationMessage = {
      id: `ai-${Date.now()}`,
      type: 'ai',
      content: 'I\'ve implemented risk mitigation strategies: Added regulatory monitoring alerts for HealthCo, diversified sector exposure, and implemented dynamic hedging for market volatility.',
      timestamp: new Date()
    }
    setMessages(prev => [...prev, riskMessage])
  }

  const handleMonitorAlerts = () => {
    const alertMessage: ConversationMessage = {
      id: `ai-${Date.now()}`,
      type: 'ai',
      content: 'Risk monitoring is now active with real-time alerts. I\'ll notify you if deal concentration exceeds 10%, sector allocation deviates >5% from targets, or regulatory changes affect active deals.',
      timestamp: new Date()
    }
    setMessages(prev => [...prev, alertMessage])
  }

  const handleSendMessage = () => {
    if (!userInput.trim()) return

    const userMessage: ConversationMessage = {
      id: `user-${Date.now()}`,
      type: 'user',
      content: userInput,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setUserInput('')

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: ConversationMessage = {
        id: `ai-${Date.now()}`,
        type: 'ai',
        content: generateContextualResponse(userInput),
        timestamp: new Date()
      }

      setMessages(prev => [...prev, aiResponse])
    }, 1500)
  }

  const generateContextualResponse = (input: string): string => {
    const lowerInput = input.toLowerCase()
    
    if (lowerInput.includes('deals') || lowerInput.includes('pipeline')) {
      return 'Your deal pipeline is strong with 12 active deals worth $750M. Top priorities: TechCorp (advanced DD), HealthCo (regulatory review), RetailCo (documentation). Would you like me to prioritize or accelerate any specific deals?'
    }
    if (lowerInput.includes('team') || lowerInput.includes('resources')) {
      return 'Your team of 24 members is operating at 94% efficiency with AI assistance. Current allocation: 8 on DD projects, 6 on deal sourcing, 10 on portfolio management. I can suggest optimal reallocation if needed.'
    }
    if (lowerInput.includes('performance') || lowerInput.includes('returns')) {
      return 'Performance is excellent: 12% AUM growth YTD, 85% deal success rate, $2.4B under management. AI optimizations have contributed 3.2% to returns through better timing and risk management.'
    }
    
    return `I understand you're asking about "${input}". Let me analyze this in the context of your dashboard and operations to provide recommendations.`
  }

  const handleRollback = (actionId: string) => {
    console.log(`Rolling back action: ${actionId}`)
  }

  const formatCurrency = (value: number) => {
    if (value >= 1000000000) {
      return `$${(value / 1000000000).toFixed(1)}B`
    } else if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`
    } else {
      return `$${value.toFixed(0)}`
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 text-white">
      {/* Header */}
      <div className="flex justify-between items-center p-4 bg-black bg-opacity-20 backdrop-blur-sm border-b border-white border-opacity-20">
        <div>
          <h1 className="text-2xl font-semibold flex items-center">
            <Bot className="h-6 w-6 mr-2" />
            Autonomous Dashboard AI
          </h1>
          <p className="text-blue-100 text-sm">AI is actively managing your $2.4B operations</p>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-2">
            <Button 
              variant={activeView === 'conversation' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveView('conversation')}
              className="text-white border-white border-opacity-30"
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Conversation
            </Button>
            <Button 
              variant={activeView === 'detailed' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveView('detailed')}
              className="text-white border-white border-opacity-30"
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Analytics
            </Button>
          </div>
          <Badge className="bg-green-500 text-white">
            <CheckCircle className="h-3 w-3 mr-1" />
            Active
          </Badge>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onSwitchMode?.('assisted')}
            className="text-white hover:bg-white hover:bg-opacity-20"
          >
            Switch Mode
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white hover:bg-opacity-20"
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {activeView === 'conversation' ? (
        <div className="flex h-screen">
          {/* Conversation Panel */}
          <div className="w-1/2 flex flex-col bg-white bg-opacity-10 backdrop-blur-sm">
            {/* Automated Actions Summary */}
            <div className="p-4 border-b border-white border-opacity-20">
              <AutomatedActionsPanel
                actions={[
                  { id: '1', description: 'Automated DD workflow for TechCorp (saved 15h)', rollbackable: true },
                  { id: '2', description: 'Generated Q3 LP report draft (saved 8h)', rollbackable: true },
                  { id: '3', description: 'Optimized team allocation for HealthCo DD', rollbackable: false },
                  { id: '4', description: 'Implemented smart deal prioritization scoring', rollbackable: true },
                ]}
                onRollback={handleRollback}
              />
            </div>

            {/* Conversation Area */}
            <div className="flex-1 overflow-auto p-4 space-y-4">
              {messages.map((message) => (
                <MessageBubble key={message.id} message={message} />
              ))}
              
              {/* AI Status Indicator */}
              {isProcessing && (
                <div className="flex items-center justify-center py-4">
                  <div className="flex items-center space-x-2 text-blue-200">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                    <span className="text-sm ml-2">AI is analyzing operations...</span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Actions */}
            {messages.length <= 3 && (
              <div className="p-4 border-t border-white border-opacity-20">
                <p className="text-sm text-blue-200 mb-3">Quick Actions:</p>
                <QuickActionSuggestions suggestions={quickActions} />
              </div>
            )}

            {/* Input Area */}
            <div className="p-4 border-t border-white border-opacity-20">
              <div className="flex items-center space-x-2">
                <Input
                  placeholder="Ask me about operations, deals, team..."
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1 bg-white bg-opacity-20 border-white border-opacity-30 text-white placeholder-blue-200"
                />
                <Button
                  size="sm"
                  onClick={handleSendMessage}
                  disabled={!userInput.trim()}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center space-x-2 text-xs text-blue-200">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span>AI Dashboard Manager Active</span>
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs text-blue-200 hover:text-white"
                >
                  {isPaused ? <Play className="w-3 h-3 mr-1" /> : <Pause className="w-3 h-3 mr-1" />}
                  {isPaused ? 'Resume' : 'Pause'} AI
                </Button>
              </div>
            </div>
          </div>

          {/* Dashboard Metrics */}
          <div className="w-1/2 p-6 overflow-auto">
            {/* Real-time Metrics */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <Card className="bg-white bg-opacity-10 border-white border-opacity-20">
                <CardContent className="p-4 text-center">
                  <FileText className="h-6 w-6 mx-auto mb-2 text-blue-400" />
                  <div className="text-2xl font-bold">12</div>
                  <div className="text-sm text-blue-200">Active Deals</div>
                  <div className="text-xs text-green-400 mt-1">$750M pipeline</div>
                </CardContent>
              </Card>
              
              <Card className="bg-white bg-opacity-10 border-white border-opacity-20">
                <CardContent className="p-4 text-center">
                  <Activity className="h-6 w-6 mx-auto mb-2 text-green-400" />
                  <div className="text-2xl font-bold">8</div>
                  <div className="text-sm text-blue-200">DD Projects</div>
                  <div className="text-xs text-green-400 mt-1">AI-accelerated</div>
                </CardContent>
              </Card>
              
              <Card className="bg-white bg-opacity-10 border-white border-opacity-20">
                <CardContent className="p-4 text-center">
                  <DollarSign className="h-6 w-6 mx-auto mb-2 text-yellow-400" />
                  <div className="text-2xl font-bold">$2.4B</div>
                  <div className="text-sm text-blue-200">AUM</div>
                  <div className="text-xs text-green-400 mt-1">+12% YTD</div>
                </CardContent>
              </Card>
              
              <Card className="bg-white bg-opacity-10 border-white border-opacity-20">
                <CardContent className="p-4 text-center">
                  <Target className="h-6 w-6 mx-auto mb-2 text-purple-400" />
                  <div className="text-2xl font-bold">94%</div>
                  <div className="text-sm text-blue-200">AI Efficiency</div>
                  <div className="text-xs text-green-400 mt-1">Excellent</div>
                </CardContent>
              </Card>
            </div>

            {/* Recent AI Actions */}
            <Card className="bg-white bg-opacity-10 border-white border-opacity-20 mb-6">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Recent AI Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-blue-200">DD workflow automation</span>
                    <Badge variant="success" className="text-xs">Completed</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-blue-200">Team optimization</span>
                    <Badge variant="success" className="text-xs">Active</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-blue-200">Risk monitoring enhancement</span>
                    <Badge className="text-xs bg-yellow-500">In Progress</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* AI Insights */}
            <Card className="bg-white bg-opacity-10 border-white border-opacity-20">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Brain className="h-4 w-4 mr-2" />
                  AI Intelligence
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm text-blue-200">
                  <div>• TechCorp deal probability increased to 92% based on recent developments</div>
                  <div>• HealthCo regulatory risk reduced following policy clarification</div>
                  <div>• Optimal timing for RetailCo site visit: next Tuesday 2-4 PM</div>
                  <div>• Q3 performance projections: 15% above target with current trajectory</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        <div className="p-6">
          <SecondaryEdgeDashboard mode="autonomous" data={dashboardData} />
        </div>
      )}
    </div>
  )
}

export default DashboardAutonomous