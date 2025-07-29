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
  Target
} from 'lucide-react'

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

interface PortfolioAutonomousProps {
  portfolioData?: any
  assets?: any[]
  automatedActions?: any[]
  pendingApprovals?: any[]
  aiRecommendations?: any[]
  isProcessing?: boolean
  onApproveAction?: (approvalId: string) => void
  onRejectAction?: (approvalId: string) => void
  onSwitchMode?: (mode: 'traditional' | 'assisted' | 'autonomous') => void
  isPaused?: boolean
}

export function PortfolioAutonomous({
  portfolioData,
  assets = [],
  automatedActions = [],
  pendingApprovals = [],
  aiRecommendations = [],
  isProcessing = false,
  onApproveAction,
  onRejectAction,
  onSwitchMode,
  isPaused = false
}: PortfolioAutonomousProps) {
  const [messages, setMessages] = useState<ConversationMessage[]>([])
  const [userInput, setUserInput] = useState('')
  const [isExpanded, setIsExpanded] = useState(true)
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
        content: "Hello! I'm managing your portfolio autonomously. I've already analyzed your assets and identified several optimization opportunities. How can I help you today?",
        timestamp: new Date(),
        data: {
          type: 'metrics',
          metrics: [
            { label: 'Assets Analyzed', value: '47' },
            { label: 'Optimizations', value: '3' },
            { label: 'Risk Score', value: '2.1/5' },
            { label: 'Efficiency', value: '94%' }
          ]
        },
        actions: [
          {
            label: 'Show Portfolio Status',
            primary: true,
            onClick: () => handleQuickAction('portfolio-status')
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
      label: 'Portfolio Summary',
      icon: <BarChart3 className="w-4 h-4" />,
      onClick: () => handleQuickAction('portfolio-summary')
    },
    {
      label: 'Optimize Allocation',
      icon: <Target className="w-4 h-4" />,
      onClick: () => handleQuickAction('optimize-allocation')
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
      'portfolio-status': 'Show me my portfolio status',
      'review-optimizations': 'Review optimization recommendations',
      'portfolio-summary': 'Give me a portfolio summary',
      'optimize-allocation': 'Optimize my asset allocation',
      'risk-assessment': 'Perform risk assessment',
      'performance-analysis': 'Analyze portfolio performance'
    }
    return labels[actionType] || actionType
  }

  const getAIResponse = (actionType: string): string => {
    const responses: Record<string, string> = {
      'portfolio-status': 'Your portfolio is performing well with $2.4B total value across 47 assets. YTD performance is +12.5%, beating the benchmark by 3.2%. I\'ve identified 3 optimization opportunities that could improve returns.',
      'review-optimizations': 'I found these optimization opportunities: 1) Rebalance tech allocation (potential +2.1% return), 2) Reduce correlation in healthcare holdings (-15% risk), 3) Increase emerging markets exposure (+1.8% diversification benefit).',
      'portfolio-summary': 'Portfolio Overview: $2.4B AUM, 47 assets, 12.5% YTD return. Top performers: TechCorp Growth (+28%), HealthCare REIT (+19%). Underperformers: Energy Fund (-3%). Risk score: 2.1/5 (Conservative).',
      'optimize-allocation': 'I recommend: Reduce overweight tech position by 5%, increase infrastructure allocation by 3%, add 2% to international bonds. This should improve Sharpe ratio from 1.23 to 1.31. Shall I execute?',
      'risk-assessment': 'Current risk analysis: Portfolio concentration risk is low (max position 8%), correlation risk moderate (healthcare cluster at 0.67), liquidity risk low (85% daily liquid). Overall risk score: 2.1/5.',
      'performance-analysis': 'Performance deep dive: 12.5% YTD vs 9.3% benchmark. Alpha generation: +3.2%. Best contributors: Technology sector (+40bps), Asset selection (+28bps). Detractors: Sector allocation (-8bps).'
    }
    return responses[actionType] || 'I\'m analyzing that for you. Please give me a moment.'
  }

  const getFollowUpActions = (actionType: string) => {
    const actions: Record<string, any[]> = {
      'optimize-allocation': [
        { label: 'Execute Optimization', primary: true, onClick: () => handleExecuteOptimization() },
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
      content: 'Optimization executed successfully! I\'ve rebalanced your portfolio according to the recommendations. Expected impact: +1.2% annual return improvement, -8% portfolio volatility. All trades will settle T+2.',
      timestamp: new Date()
    }
    setMessages(prev => [...prev, confirmMessage])
  }

  const handleShowDetails = () => {
    const detailMessage: ConversationMessage = {
      id: `ai-${Date.now()}`,
      type: 'ai',
      content: 'Here are the detailed calculations behind my recommendations. The optimization uses modern portfolio theory with Black-Litterman adjustments for your risk preferences.',
      timestamp: new Date()
    }
    setMessages(prev => [...prev, detailMessage])
  }

  const handleMitigateRisks = () => {
    const riskMessage: ConversationMessage = {
      id: `ai-${Date.now()}`,
      type: 'ai',
      content: 'I\'ve implemented risk mitigation strategies: Added hedging positions for market volatility, reduced sector concentration, and improved geographic diversification.',
      timestamp: new Date()
    }
    setMessages(prev => [...prev, riskMessage])
  }

  const handleMonitorAlerts = () => {
    const alertMessage: ConversationMessage = {
      id: `ai-${Date.now()}`,
      type: 'ai',
      content: 'Risk monitoring is now active. I\'ll alert you if portfolio risk exceeds your 2.5/5 threshold or if correlation spikes above 0.7 in any sector cluster.',
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
    
    if (lowerInput.includes('performance') || lowerInput.includes('return')) {
      return 'Your portfolio is delivering strong performance with 12.5% YTD returns. The technology sector is your top contributor at +28%. Would you like me to analyze specific holdings or sectors?'
    }
    if (lowerInput.includes('risk')) {
      return 'Current portfolio risk is well-managed at 2.1/5. I\'m monitoring volatility and correlation metrics. The highest risk position is Energy Fund at 3.2/5 risk level.'
    }
    if (lowerInput.includes('rebalance') || lowerInput.includes('optimize')) {
      return 'I can optimize your allocation right now. Based on current market conditions, I recommend reducing tech by 5% and increasing infrastructure. This should improve your risk-adjusted returns.'
    }
    
    return `I understand you're asking about "${input}". Let me analyze this in the context of your portfolio and provide recommendations.`
  }

  const handleRollback = (actionId: string) => {
    console.log(`Rolling back action: ${actionId}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 text-white">
      {/* Header */}
      <div className="flex justify-between items-center p-4 bg-black bg-opacity-20 backdrop-blur-sm border-b border-white border-opacity-20">
        <div>
          <h1 className="text-2xl font-semibold flex items-center">
            <Bot className="h-6 w-6 mr-2" />
            Autonomous Portfolio AI
          </h1>
          <p className="text-blue-100 text-sm">AI is actively managing your $2.4B portfolio</p>
        </div>
        
        <div className="flex items-center space-x-2">
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

      <div className="flex h-screen">
        {/* Conversation Panel */}
        <div className="w-1/2 flex flex-col bg-white bg-opacity-10 backdrop-blur-sm">
          {/* Automated Actions Summary */}
          <div className="p-4 border-b border-white border-opacity-20">
            <AutomatedActionsPanel
              actions={[
                { id: '1', description: 'Rebalanced tech allocation (+2.1% expected return)', rollbackable: true },
                { id: '2', description: 'Added hedge positions for market volatility', rollbackable: true },
                { id: '3', description: 'Optimized emerging markets exposure', rollbackable: false },
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
                  <span className="text-sm ml-2">AI is analyzing markets...</span>
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
                placeholder="Ask me about your portfolio..."
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
                <span>AI Portfolio Manager Active</span>
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

        {/* Portfolio Dashboard */}
        <div className="w-1/2 p-6 overflow-auto">
          {/* Real-time Metrics */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <Card className="bg-white bg-opacity-10 border-white border-opacity-20">
              <CardContent className="p-4 text-center">
                <DollarSign className="h-6 w-6 mx-auto mb-2 text-green-400" />
                <div className="text-2xl font-bold">$2.4B</div>
                <div className="text-sm text-blue-200">Portfolio Value</div>
                <div className="text-xs text-green-400 mt-1">+2.3% today</div>
              </CardContent>
            </Card>
            
            <Card className="bg-white bg-opacity-10 border-white border-opacity-20">
              <CardContent className="p-4 text-center">
                <TrendingUp className="h-6 w-6 mx-auto mb-2 text-blue-400" />
                <div className="text-2xl font-bold">12.5%</div>
                <div className="text-sm text-blue-200">YTD Return</div>
                <div className="text-xs text-green-400 mt-1">+3.2% vs benchmark</div>
              </CardContent>
            </Card>
            
            <Card className="bg-white bg-opacity-10 border-white border-opacity-20">
              <CardContent className="p-4 text-center">
                <Target className="h-6 w-6 mx-auto mb-2 text-purple-400" />
                <div className="text-2xl font-bold">2.1/5</div>
                <div className="text-sm text-blue-200">Risk Score</div>
                <div className="text-xs text-blue-300 mt-1">Conservative</div>
              </CardContent>
            </Card>
            
            <Card className="bg-white bg-opacity-10 border-white border-opacity-20">
              <CardContent className="p-4 text-center">
                <Zap className="h-6 w-6 mx-auto mb-2 text-yellow-400" />
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
                  <span className="text-blue-200">Portfolio rebalancing</span>
                  <Badge variant="success" className="text-xs">Completed</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-blue-200">Risk hedge positions</span>
                  <Badge variant="success" className="text-xs">Active</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-blue-200">Performance optimization</span>
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
                AI Market Intelligence
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm text-blue-200">
                <div>• Market volatility expected to decrease 12% next week</div>
                <div>• Technology sector showing strong momentum (+15% confidence)</div>
                <div>• Recommend increasing infrastructure allocation by 3%</div>
                <div>• Currency hedging opportunity detected in EUR positions</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default PortfolioAutonomous