'use client'

import * as React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { useNavigationStore } from '@/stores/navigation-store'
import { 
  Bot, 
  User, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Settings,
  RotateCcw,
  Send,
  Mic,
  Pause,
  Play,
  Square,
  MessageCircle
} from 'lucide-react'

interface AIMessage {
  id: string
  type: 'ai' | 'user' | 'system'
  content: string
  timestamp: Date
  actions?: AIAction[]
  metadata?: {
    confidence?: number
    reasoning?: string
    sources?: string[]
  }
}

interface AIAction {
  id: string
  label: string
  type: 'primary' | 'secondary' | 'destructive'
  onClick: () => void
  loading?: boolean
  disabled?: boolean
}

interface CompletedAction {
  id: string
  description: string
  timestamp: Date
  reversible: boolean
  impact: 'low' | 'medium' | 'high'
}

interface DecisionRequest {
  id: string
  question: string
  context?: string
  options: {
    label: string
    value: string
    recommended?: boolean
    risk?: 'low' | 'medium' | 'high'
  }[]
}

interface AIConversationPanelProps {
  className?: string
}

interface QuickAction {
  id: string
  label: string
  icon: React.ReactNode
  description: string
  onClick: () => void
}

type AIMode = 'listening' | 'working' | 'idle' | 'paused'

export function AIConversationPanel({ className }: AIConversationPanelProps) {
  const { currentMode, trackInteraction } = useNavigationStore()
  const [messages, setMessages] = React.useState<AIMessage[]>([])
  const [isExpanded, setIsExpanded] = React.useState(true)
  const [userInput, setUserInput] = React.useState('')
  const [aiMode, setAiMode] = React.useState<AIMode>('idle')
  const [showQuickActions, setShowQuickActions] = React.useState(true)
  const messagesEndRef = React.useRef<HTMLDivElement>(null)

  // Sample data for demonstration
  const [completedActions] = React.useState<CompletedAction[]>([
    {
      id: '1',
      description: 'Categorized 47 documents by type and priority',
      timestamp: new Date('2025-07-21T10:30:00'),
      reversible: true,
      impact: 'low'
    },
    {
      id: '2',
      description: 'Extracted key financial metrics from 8 documents',
      timestamp: new Date('2025-07-21T10:35:00'),
      reversible: true,
      impact: 'medium'
    },
    {
      id: '3',
      description: 'Identified 12 potential risk factors',
      timestamp: new Date('2025-07-21T10:40:00'),
      reversible: false,
      impact: 'high'
    }
  ])

  const [pendingDecisions] = React.useState<DecisionRequest[]>([
    {
      id: '1',
      question: 'Customer concentration is 45% (top 3 customers). Should I flag this as a key risk?',
      context: 'Industry benchmark is typically 30-35% for similar companies.',
      options: [
        { label: 'Yes, flag as high risk', value: 'flag_high', recommended: true },
        { label: 'Flag as medium risk', value: 'flag_medium' },
        { label: 'Not a concern', value: 'dismiss' },
        { label: 'Need more analysis', value: 'analyze' }
      ]
    }
  ])

  // Quick actions for faster interaction
  const quickActions: QuickAction[] = [
    {
      id: 'analyze-docs',
      label: 'Analyze Documents',
      icon: <CheckCircle className="w-4 h-4" />,
      description: 'Review and categorize uploaded documents',
      onClick: () => handleQuickAction('analyze-docs')
    },
    {
      id: 'check-risks',
      label: 'Risk Review',
      icon: <AlertTriangle className="w-4 h-4" />,
      description: 'Identify potential risk factors',
      onClick: () => handleQuickAction('check-risks')
    },
    {
      id: 'update-status',
      label: 'Status Update',
      icon: <Clock className="w-4 h-4" />,
      description: 'Get current project status',
      onClick: () => handleQuickAction('update-status')
    }
  ]

  // Initialize conversation with simpler greeting
  React.useEffect(() => {
    if (currentMode.mode === 'autonomous' && messages.length === 0) {
      const welcomeMessage: AIMessage = {
        id: 'welcome',
        type: 'ai',
        content: 'Hi! I\'m ready to help with your due diligence work. What would you like me to focus on?',
        timestamp: new Date()
      }
      setMessages([welcomeMessage])
    }
  }, [currentMode.mode, messages.length])

  // Auto scroll to bottom
  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleQuickAction = (actionId: string) => {
    const action = quickActions.find(a => a.id === actionId)
    if (!action) return

    setAiMode('working')
    setShowQuickActions(false)

    // Add user message
    const userMessage: AIMessage = {
      id: `user-${Date.now()}`,
      type: 'user',
      content: action.label,
      timestamp: new Date()
    }

    // Add AI working message
    const workingMessage: AIMessage = {
      id: `working-${Date.now()}`,
      type: 'ai',
      content: `Working on ${action.description.toLowerCase()}...`,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage, workingMessage])

    // Simulate work completion after 2 seconds
    setTimeout(() => {
      const completionMessage: AIMessage = {
        id: `completion-${Date.now()}`,
        type: 'ai',
        content: getActionResult(actionId),
        timestamp: new Date(),
        actions: getFollowUpActions(actionId)
      }

      setMessages(prev => [...prev.slice(0, -1), completionMessage])
      setAiMode('idle')
      setShowQuickActions(true)
    }, 2000)

    trackInteraction?.({ type: 'quick_action', actionId })
  }

  const getActionResult = (actionId: string): string => {
    switch (actionId) {
      case 'analyze-docs':
        return 'I\'ve analyzed 15 documents. Found 3 priority items that need your review. Would you like me to summarize the findings?'
      case 'check-risks':
        return 'Identified 2 potential risks: Customer concentration (45%) and regulatory compliance gap. Should I create risk assessment reports?'
      case 'update-status':
        return 'Project is 65% complete. Financial analysis done, legal review in progress. Next: management presentations. Need any specific updates?'
      default:
        return 'Task completed. What would you like me to do next?'
    }
  }

  const getFollowUpActions = (actionId: string): AIAction[] => {
    const baseActions = [
      {
        id: 'more-details',
        label: 'More Details',
        type: 'primary' as const,
        onClick: () => handleFollowUp(actionId, 'details')
      },
      {
        id: 'next-step',
        label: 'What\'s Next?',
        type: 'secondary' as const,
        onClick: () => handleFollowUp(actionId, 'next')
      }
    ]
    return baseActions
  }

  const handleFollowUp = (originalAction: string, followUpType: string) => {
    const responseMap: Record<string, Record<string, string>> = {
      'analyze-docs': {
        'details': 'Here are the key findings: 1) Financial statements show 45% YoY growth, 2) Customer contracts have standard terms, 3) One legal doc needs clarification on IP ownership.',
        'next': 'I recommend scheduling a call with their legal team about the IP question and preparing the IC presentation with the financial highlights.'
      },
      'check-risks': {
        'details': 'Customer Risk: Top 3 customers = 45% revenue (benchmark: 30%). Regulatory: Missing SOC 2 certification for enterprise clients.',
        'next': 'Should I draft risk mitigation strategies and add these to the deal review checklist?'
      },
      'update-status': {
        'details': 'Completed: Financial model (95% confident), Market analysis, Team interviews. In Progress: Legal docs (60%), Reference calls (40%).',
        'next': 'Priority is completing legal review. I can schedule the remaining reference calls if you provide contact preferences.'
      }
    }

    const response = responseMap[originalAction]?.[followUpType] || 'Let me know what specific information you need.'
    
    const followUpMessage: AIMessage = {
      id: `followup-${Date.now()}`,
      type: 'ai',
      content: response,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, followUpMessage])
  }

  const handleSendMessage = () => {
    if (!userInput.trim()) return

    const userMessage: AIMessage = {
      id: `user-${Date.now()}`,
      type: 'user',
      content: userInput,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setUserInput('')
    setAiMode('working')

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: AIMessage = {
        id: `ai-${Date.now()}`,
        type: 'ai',
        content: generateAIResponse(userInput),
        timestamp: new Date(),
        actions: [
          {
            id: 'proceed',
            label: 'Proceed',
            type: 'primary',
            onClick: () => handleProceed()
          },
          {
            id: 'modify',
            label: 'Modify Approach',
            type: 'secondary',
            onClick: () => handleModify()
          }
        ]
      }

      setMessages(prev => [...prev, aiResponse])
      setAiMode('idle')
    }, 1500)

    trackInteraction?.({ type: 'user_message', content: userInput })
  }

  const generateAIResponse = (input: string): string => {
    const responses: Record<string, string> = {
      'help': 'I can help with document analysis, risk assessment, financial modeling, and creating reports. What specific area needs attention?',
      'status': 'Current progress: 65% complete. Active tasks: legal review, reference calls. Ready for next steps when you are.',
      'risks': 'I\'ve identified customer concentration and regulatory gaps as top risks. Should I prepare detailed risk analysis?',
      'default': `I understand you want me to focus on "${input}". I\'ll start working on this right away. Should I proceed with my standard approach?`
    }

    const lowerInput = input.toLowerCase()
    if (lowerInput.includes('help')) return responses.help
    if (lowerInput.includes('status') || lowerInput.includes('progress')) return responses.status
    if (lowerInput.includes('risk')) return responses.risks
    return responses.default
  }

  const handleProceed = () => {
    const proceedMessage: AIMessage = {
      id: `proceed-${Date.now()}`,
      type: 'ai',
      content: 'Perfect! I\'ll get started on that right away and update you as I make progress.',
      timestamp: new Date()
    }
    setMessages(prev => [...prev, proceedMessage])
  }

  const handleModify = () => {
    const modifyMessage: AIMessage = {
      id: `modify-${Date.now()}`,
      type: 'ai',
      content: 'Of course! What specific changes would you like me to make to my approach?',
      timestamp: new Date()
    }
    setMessages(prev => [...prev, modifyMessage])
  }

  const handleDecision = (decisionId: string, optionValue: string) => {
    const decision = pendingDecisions.find(d => d.id === decisionId)
    if (!decision) return

    const option = decision.options.find(o => o.value === optionValue)
    if (!option) return

    // Add user message
    const userMessage: AIMessage = {
      id: `user-${Date.now()}`,
      type: 'user',
      content: `Selected: ${option.label}`,
      timestamp: new Date()
    }

    // Add AI response
    const aiResponse: AIMessage = {
      id: `ai-${Date.now()}`,
      type: 'ai',
      content: `Perfect! I've ${optionValue === 'flag_high' ? 'flagged customer concentration as a high-priority risk and added it to the findings register' : 'processed your decision'}. Moving on to the next item...`,
      timestamp: new Date(),
      metadata: {
        confidence: 0.97
      }
    }

    setMessages(prev => [...prev, userMessage, aiResponse])
    
    trackInteraction?.({
      type: 'decision_made',
      decisionId,
      option: optionValue,
      context: { mode: currentMode.mode }
    })
  }

  const handleReverseAction = (actionId: string) => {
    trackInteraction?.({
      type: 'action_reversed',
      actionId,
      context: { mode: currentMode.mode }
    })
    
    // Add confirmation message
    const confirmMessage: AIMessage = {
      id: `reverse-${Date.now()}`,
      type: 'system',
      content: `Action reversed: Document categorization has been undone. All documents are back to their original state.`,
      timestamp: new Date()
    }
    
    setMessages(prev => [...prev, confirmMessage])
  }

  if (currentMode.mode !== 'autonomous') {
    return null
  }

  const renderMessage = (message: AIMessage) => (
    <div key={message.id} className={`flex items-start space-x-3 mb-4 ${
      message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
    }`}>
      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
        message.type === 'ai' ? 'bg-purple-100' :
        message.type === 'user' ? 'bg-blue-100' : 'bg-gray-100'
      }`}>
        {message.type === 'ai' ? <Bot className="w-4 h-4 text-purple-600" /> :
         message.type === 'user' ? <User className="w-4 h-4 text-blue-600" /> :
         <AlertTriangle className="w-4 h-4 text-gray-600" />}
      </div>
      
      <div className={`flex-1 ${message.type === 'user' ? 'text-right' : ''}`}>
        <div className={`inline-block p-3 rounded-lg max-w-[80%] ${
          message.type === 'ai' ? 'bg-purple-50 text-purple-900' :
          message.type === 'user' ? 'bg-blue-50 text-blue-900' : 'bg-gray-50 text-gray-900'
        }`}>
          <p className="text-sm">{message.content}</p>
          
          {message.metadata?.confidence && (
            <div className="mt-2 text-xs opacity-70">
              Confidence: {Math.round(message.metadata.confidence * 100)}%
            </div>
          )}
        </div>
        
        {message.actions && (
          <div className="mt-2 flex flex-wrap gap-2">
            {message.actions.map((action) => (
              <Button
                key={action.id}
                size="sm"
                variant={action.type === 'primary' ? 'default' : 'outline'}
                onClick={action.onClick}
                disabled={action.disabled}
                className="text-xs"
              >
                {action.loading && <Clock className="w-3 h-3 mr-1 animate-spin" />}
                {action.label}
              </Button>
            ))}
          </div>
        )}
        
        <div className="text-xs text-gray-500 mt-1">
          {message.timestamp.toLocaleTimeString()}
        </div>
      </div>
    </div>
  )

  return (
    <div className={`flex flex-col h-full bg-white ${className}`}>
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Bot className="w-5 h-5 text-purple-600" />
            <h2 className="font-semibold text-purple-900">AI Assistant</h2>
            <Badge variant="ai" className="text-xs">Autonomous</Badge>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm">
              <Settings className="w-4 h-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </div>

      {isExpanded && (
        <>
          {/* Completed Actions Summary */}
          <div className="p-4 bg-green-50 border-b">
            <h3 className="font-medium text-green-800 mb-2 flex items-center">
              <CheckCircle className="w-4 h-4 mr-2" />
              Completed Automatically ({completedActions.length})
            </h3>
            <div className="space-y-2">
              {completedActions.slice(0, 3).map((action) => (
                <div key={action.id} className="flex items-center justify-between text-sm text-green-700">
                  <span>• {action.description}</span>
                  {action.reversible && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleReverseAction(action.id)}
                      className="text-xs h-6 px-2 text-green-600 hover:text-green-800"
                    >
                      <RotateCcw className="w-3 h-3 mr-1" />
                      Undo
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          {showQuickActions && messages.length <= 1 && (
            <div className="p-4 bg-blue-50 border-b">
              <h3 className="font-medium text-blue-800 mb-3 flex items-center">
                <MessageCircle className="w-4 h-4 mr-2" />
                Quick Actions
              </h3>
              <div className="grid grid-cols-1 gap-2">
                {quickActions.map((action) => (
                  <Button
                    key={action.id}
                    variant="outline"
                    size="sm"
                    onClick={action.onClick}
                    disabled={aiMode === 'working'}
                    className="text-left justify-start h-auto p-3"
                  >
                    <div className="flex items-center">
                      {action.icon}
                      <div className="ml-3">
                        <div className="font-medium text-sm">{action.label}</div>
                        <div className="text-xs text-gray-500">{action.description}</div>
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Conversation Area */}
          <div className="flex-1 overflow-auto p-4 space-y-4">
            {messages.map(renderMessage)}

            {/* AI Status Indicator */}
            {aiMode === 'working' && (
              <div className="flex items-center justify-center py-4">
                <div className="flex items-center space-x-2 text-gray-500">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                  <span className="text-sm ml-2">AI is working...</span>
                </div>
              </div>
            )}

            {/* Pending Decisions (Simplified) */}
            {pendingDecisions.map((decision) => (
              <div key={decision.id} className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <h4 className="font-medium text-orange-800 mb-2 flex items-center">
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Quick Decision
                </h4>
                
                <p className="text-sm text-orange-700 mb-3">{decision.question}</p>
                
                <div className="flex flex-wrap gap-2">
                  {decision.options.slice(0, 2).map((option) => (
                    <Button
                      key={option.value}
                      variant={option.recommended ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleDecision(decision.id, option.value)}
                    >
                      {option.label}
                    </Button>
                  ))}
                </div>
              </div>
            ))}

            <div ref={messagesEndRef} />
          </div>

          {/* User Input */}
          <div className="p-4 border-t bg-white">
            <div className="flex items-center space-x-2">
              <Input
                placeholder="Tell me what you need help with..."
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                disabled={aiMode === 'working'}
                className="flex-1"
              />
              <Button
                size="sm"
                onClick={handleSendMessage}
                disabled={!userInput.trim() || aiMode === 'working'}
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            
            {/* AI Control Buttons */}
            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setAiMode(aiMode === 'paused' ? 'idle' : 'paused')}
                  className="text-xs"
                >
                  {aiMode === 'paused' ? <Play className="w-3 h-3 mr-1" /> : <Pause className="w-3 h-3 mr-1" />}
                  {aiMode === 'paused' ? 'Resume' : 'Pause'} AI
                </Button>
                
                <Badge variant={aiMode === 'working' ? 'default' : aiMode === 'paused' ? 'destructive' : 'secondary'} className="text-xs">
                  {aiMode === 'working' ? 'Working' : aiMode === 'paused' ? 'Paused' : 'Ready'}
                </Badge>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                className="text-xs"
                onClick={() => trackInteraction?.({ type: 'switch_to_traditional' })}
              >
                Exit Autonomous
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}