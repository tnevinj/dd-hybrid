'use client'

import * as React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { useNavigationStoreRefactored } from '@/stores/navigation-store-refactored'
import { useAIStore } from '@/stores/ai-store'
import { useWorkspaceContextSafe } from '@/contexts/WorkspaceContext'
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

interface ViewContext {
  type: 'workspace_list' | 'workspace_detail' | 'work_product_editor' | 'dashboard' | 'settings'
  data?: {
    workspaceId?: string
    workspaceName?: string
    workProductId?: string
    workProductTitle?: string
    activeTab?: string
    [key: string]: any
  }
}

interface AIConversationPanelProps {
  className?: string
  context?: ViewContext
}

interface QuickAction {
  id: string
  label: string
  icon: React.ReactNode
  description: string
  onClick: () => void
}

type AIMode = 'listening' | 'working' | 'idle' | 'paused'

export function AIConversationPanel({ className, context }: AIConversationPanelProps) {
  const { currentMode } = useNavigationStoreRefactored()
  const { trackInteraction } = useAIStore()
  const workspaceContext = useWorkspaceContextSafe()
  const [messages, setMessages] = React.useState<AIMessage[]>([])
  const [isExpanded, setIsExpanded] = React.useState(true)
  const [userInput, setUserInput] = React.useState('')
  const [aiMode, setAiMode] = React.useState<AIMode>('idle')
  const [showQuickActions, setShowQuickActions] = React.useState(true)
  const messagesEndRef = React.useRef<HTMLDivElement>(null)
  
  // Enhanced context with actual data when available
  const enhancedContext = React.useMemo(() => {
    if (!context) return context
    
    const enhanced = { ...context }
    if (workspaceContext?.currentWorkspace && context.type === 'workspace_detail') {
      enhanced.data = {
        ...enhanced.data,
        workspaceName: workspaceContext.currentWorkspace.name,
        dealValue: workspaceContext.currentWorkspace.dealValue,
        status: workspaceContext.currentWorkspace.status,
        sector: workspaceContext.currentWorkspace.sector
      }
    }
    if (workspaceContext?.currentWorkProduct && context.type === 'work_product_editor') {
      enhanced.data = {
        ...enhanced.data,
        workProductTitle: workspaceContext.currentWorkProduct.title,
        workProductType: workspaceContext.currentWorkProduct.type,
        status: workspaceContext.currentWorkProduct.status,
        wordCount: workspaceContext.currentWorkProduct.wordCount
      }
    }
    return enhanced
  }, [context, workspaceContext])

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

  // Context-aware quick actions
  const getContextualActions = (): QuickAction[] => {
    if (!enhancedContext) {
      return [
        {
          id: 'general-help',
          label: 'General Help',
          icon: <CheckCircle className="w-4 h-4" />,
          description: 'Get general assistance',
          onClick: () => handleQuickAction('general-help')
        }
      ]
    }

    switch (enhancedContext.type) {
      case 'workspace_list':
        return [
          {
            id: 'create-workspace',
            label: 'Create Workspace',
            icon: <CheckCircle className="w-4 h-4" />,
            description: 'Help create a new due diligence workspace',
            onClick: () => handleQuickAction('create-workspace')
          },
          {
            id: 'prioritize-workspaces',
            label: 'Prioritize Tasks',
            icon: <AlertTriangle className="w-4 h-4" />,
            description: 'Identify which workspaces need attention',
            onClick: () => handleQuickAction('prioritize-workspaces')
          },
          {
            id: 'workspace-insights',
            label: 'Portfolio Insights',
            icon: <Clock className="w-4 h-4" />,
            description: 'Analyze patterns across your workspaces',
            onClick: () => handleQuickAction('workspace-insights')
          }
        ]

      case 'workspace_detail':
        return [
          {
            id: 'analyze-workspace',
            label: 'Analyze Progress',
            icon: <CheckCircle className="w-4 h-4" />,
            description: `Review progress on ${enhancedContext.data?.workspaceName || 'this workspace'}`,
            onClick: () => handleQuickAction('analyze-workspace')
          },
          {
            id: 'identify-risks',
            label: 'Risk Assessment',
            icon: <AlertTriangle className="w-4 h-4" />,
            description: 'Identify potential risks and blockers',
            onClick: () => handleQuickAction('identify-risks')
          },
          {
            id: 'suggest-next-steps',
            label: 'Next Steps',
            icon: <Clock className="w-4 h-4" />,
            description: 'Get recommendations for next actions',
            onClick: () => handleQuickAction('suggest-next-steps')
          }
        ]

      case 'work_product_editor':
        return [
          {
            id: 'improve-content',
            label: 'Improve Writing',
            icon: <CheckCircle className="w-4 h-4" />,
            description: 'Enhance clarity and structure of this document',
            onClick: () => handleQuickAction('improve-content')
          },
          {
            id: 'fact-check',
            label: 'Fact Check',
            icon: <AlertTriangle className="w-4 h-4" />,
            description: 'Verify data and claims in the document',
            onClick: () => handleQuickAction('fact-check')
          },
          {
            id: 'suggest-sections',
            label: 'Missing Sections',
            icon: <Clock className="w-4 h-4" />,
            description: 'Identify sections that might be missing',
            onClick: () => handleQuickAction('suggest-sections')
          }
        ]

      case 'dashboard':
        return [
          {
            id: 'daily-briefing',
            label: 'Daily Briefing',
            icon: <CheckCircle className="w-4 h-4" />,
            description: 'Get summary of today\'s priorities',
            onClick: () => handleQuickAction('daily-briefing')
          },
          {
            id: 'urgent-items',
            label: 'Urgent Items',
            icon: <AlertTriangle className="w-4 h-4" />,
            description: 'Show items that need immediate attention',
            onClick: () => handleQuickAction('urgent-items')
          },
          {
            id: 'performance-insights',
            label: 'Performance',
            icon: <Clock className="w-4 h-4" />,
            description: 'Analyze your productivity and patterns',
            onClick: () => handleQuickAction('performance-insights')
          }
        ]

      default:
        return [
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
    }
  }

  const quickActions = getContextualActions()

  // Context-aware welcome messages
  const getWelcomeMessage = (): string => {
    if (!enhancedContext) return 'Hi! I\'m ready to help with your due diligence work. What would you like me to focus on?'

    switch (enhancedContext.type) {
      case 'workspace_list':
        return 'I can see you\'re viewing your workspaces. I can help prioritize tasks, create new workspaces, or analyze patterns across your deals.'
      case 'workspace_detail':
        return `I'm analyzing ${enhancedContext.data?.workspaceName || 'this workspace'}. I can help review progress, identify risks, or suggest next steps.`
      case 'work_product_editor':
        return `I can help improve "${enhancedContext.data?.workProductTitle || 'this document'}". I can enhance writing, fact-check content, or suggest missing sections.`
      case 'dashboard':
        return 'Welcome to your dashboard! I can provide a daily briefing, highlight urgent items, or analyze your performance trends.'
      case 'settings':
        return 'I can help optimize your settings and preferences for better productivity.'
      default:
        return 'Hi! I\'m ready to help with your due diligence work. What would you like me to focus on?'
    }
  }

  // Initialize conversation with context-aware greeting
  React.useEffect(() => {
    if (currentMode.mode === 'autonomous' && messages.length === 0) {
      const welcomeMessage: AIMessage = {
        id: 'welcome',
        type: 'ai',
        content: getWelcomeMessage(),
        timestamp: new Date()
      }
      setMessages([welcomeMessage])
    }
  }, [currentMode.mode, messages.length, enhancedContext])

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
    // Context-aware responses
    switch (actionId) {
      // Workspace list actions
      case 'create-workspace':
        return 'I can help you create a new workspace. What type of deal are you working on? (Acquisition, Investment, Partnership, etc.)'
      case 'prioritize-workspaces':
        return 'Based on deadlines and progress: 1) TechCorp DD (IC meeting tomorrow), 2) HealthCo analysis (missing financials), 3) RetailCo research (early stage). Focus on TechCorp first.'
      case 'workspace-insights':
        return 'I noticed you have 3 tech deals and 2 healthcare deals. Tech deals average 45 days to complete, healthcare takes 60 days. Your team handles 2.3 deals simultaneously.'
      
      // Workspace detail actions
      case 'analyze-workspace':
        const workspaceName = enhancedContext?.data?.workspaceName || 'this workspace'
        return `${workspaceName} is 70% complete. Completed: Financial model, management interviews. In progress: Legal review, reference calls. Blocked: Waiting for audited financials.`
      case 'identify-risks':
        return 'I found 3 risks: 1) Customer concentration 45% (high), 2) Missing SOC2 compliance (medium), 3) Key person dependency on founder (medium). Should I create risk mitigation plans?'
      case 'suggest-next-steps':
        return 'Next steps: 1) Schedule call with auditor for financials, 2) Complete remaining reference calls, 3) Prepare IC presentation draft. Estimated 3-5 days to completion.'
      
      // Work product editor actions
      case 'improve-content':
        return 'I can enhance this document by: 1) Strengthening the executive summary, 2) Adding more specific financial metrics, 3) Improving flow between sections. Which area first?'
      case 'fact-check':
        return 'Checking facts... Found: Revenue growth 45% (✓ verified), Market size $2.8B (⚠ needs source), Customer count 150+ (✓ verified). Should I find sources for market size?'
      case 'suggest-sections':
        return 'This document could benefit from: 1) Competitive landscape analysis, 2) Management team backgrounds, 3) Technology architecture overview. Which section is most important?'
      
      // Dashboard actions
      case 'daily-briefing':
        return 'Today\'s priorities: 1) TechCorp IC prep (high urgency), 2) Review HealthCo financials (medium), 3) RetailCo kickoff call at 3pm. You have 2 overdue tasks.'
      case 'urgent-items':
        return 'Urgent: 1) TechCorp presentation due tomorrow, 2) HealthCo missing signed NDA, 3) Reference call scheduled in 30 minutes. Need help with any of these?'
      case 'performance-insights':
        return 'This month: 3 deals advanced to IC, avg 38 days deal cycle (↓12% vs last month), 85% on-time completion rate. Your strongest area: financial analysis.'
      
      // Default actions
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
    const lowerInput = input.toLowerCase()
    
    // Context-aware responses based on current view
    if (enhancedContext?.type === 'workspace_detail') {
      const workspaceName = enhancedContext.data?.workspaceName || 'this workspace'
      if (lowerInput.includes('help')) {
        return `I can help with ${workspaceName} by analyzing documents, assessing risks, tracking progress, or preparing reports. What aspect needs attention?`
      }
      if (lowerInput.includes('status') || lowerInput.includes('progress')) {
        return `${workspaceName} status: 70% complete. Financial analysis ✓, Legal review in progress, Reference calls pending. What specific update do you need?`
      }
      if (lowerInput.includes('risk')) {
        return `For ${workspaceName}, I've identified customer concentration and compliance gaps as key risks. Should I analyze these further?`
      }
    }
    
    if (enhancedContext?.type === 'work_product_editor') {
      const docTitle = enhancedContext.data?.workProductTitle || 'this document'
      if (lowerInput.includes('help')) {
        return `I can improve "${docTitle}" by enhancing writing quality, fact-checking content, or suggesting missing sections. What would be most helpful?`
      }
      if (lowerInput.includes('review') || lowerInput.includes('improve')) {
        return `I'll review "${docTitle}" for clarity, accuracy, and completeness. Should I start with a specific section?`
      }
    }
    
    if (enhancedContext?.type === 'workspace_list') {
      if (lowerInput.includes('help')) {
        return 'I can help prioritize your workspaces, create new ones, or provide insights across your deal portfolio. What would be most useful?'
      }
      if (lowerInput.includes('priority') || lowerInput.includes('urgent')) {
        return 'Based on deadlines: TechCorp needs attention (IC tomorrow), then HealthCo (missing docs). Should I help with TechCorp first?'
      }
    }
    
    if (enhancedContext?.type === 'dashboard') {
      if (lowerInput.includes('help')) {
        return 'I can provide your daily briefing, highlight urgent items, or analyze performance trends. What interests you most?'
      }
      if (lowerInput.includes('today') || lowerInput.includes('priority')) {
        return 'Today\'s top priorities: TechCorp IC prep, HealthCo doc review, RetailCo kickoff call. Need help with any of these?'
      }
    }
    
    // Fallback responses
    const responses: Record<string, string> = {
      'help': 'I can help with document analysis, risk assessment, financial modeling, and creating reports. What specific area needs attention?',
      'status': 'Current progress: 65% complete. Active tasks: legal review, reference calls. Ready for next steps when you are.',
      'risks': 'I\'ve identified customer concentration and regulatory gaps as top risks. Should I prepare detailed risk analysis?',
      'default': `I understand you want me to focus on "${input}". I\'ll start working on this right away. Should I proceed with my standard approach?`
    }

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
        message.type === 'ai' ? 'bg-blue-100' :
        message.type === 'user' ? 'bg-blue-100' : 'bg-gray-100'
      }`}>
        {message.type === 'ai' ? <Bot className="w-4 h-4 text-blue-600" /> :
         message.type === 'user' ? <User className="w-4 h-4 text-blue-600" /> :
         <AlertTriangle className="w-4 h-4 text-gray-600" />}
      </div>
      
      <div className={`flex-1 ${message.type === 'user' ? 'text-right' : ''}`}>
        <div className={`inline-block p-3 rounded-lg max-w-[80%] ${
          message.type === 'ai' ? 'bg-blue-50 text-blue-900' :
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
            <Bot className="w-5 h-5 text-blue-600" />
            <h2 className="font-semibold text-blue-900">AI Assistant</h2>
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