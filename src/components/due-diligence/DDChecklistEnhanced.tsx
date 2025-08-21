'use client'

import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useNavigationStoreRefactored } from '@/stores/navigation-store-refactored'
import { 
  CheckCircle,
  Circle,
  Clock,
  AlertTriangle,
  Brain,
  Zap,
  FileText,
  Users,
  TrendingUp,
  Target,
  Play,
  Pause,
  RotateCcw,
  Eye,
  MessageSquare,
  Calendar,
  ChevronRight,
  ChevronDown,
  Lightbulb,
  Sparkles,
  Shield
} from 'lucide-react'

interface ChecklistItem {
  id: string
  title: string
  description: string
  category: 'financial' | 'commercial' | 'legal' | 'technical' | 'operational'
  priority: 'low' | 'medium' | 'high' | 'critical'
  status: 'pending' | 'in_progress' | 'review' | 'completed' | 'blocked'
  assignee: string
  dueDate: Date
  estimatedHours: number
  actualHours?: number
  dependencies: string[]
  aiAutomatable: boolean
  aiConfidence?: number
  aiSuggestion?: string
  linkedDocuments: string[]
  findings: string[]
  template?: 'standard' | 'saas' | 'healthcare' | 'fintech'
}

interface DDChecklistEnhancedProps {
  projectId: string
  dealType?: 'saas' | 'healthcare' | 'fintech' | 'manufacturing'
}

export function DDChecklistEnhanced({ projectId, dealType = 'saas' }: DDChecklistEnhancedProps) {
  const { currentMode, trackInteraction, addRecommendation } = useNavigationStoreRefactored()
  const [expandedCategories, setExpandedCategories] = React.useState<Set<string>>(new Set(['financial']))
  const [automationRunning, setAutomationRunning] = React.useState(false)
  const [selectedItems, setSelectedItems] = React.useState<Set<string>>(new Set())

  // Sample DD checklist data with AI enhancements
  const [checklistItems] = React.useState<ChecklistItem[]>([
    {
      id: 'fin-001',
      title: 'Review Financial Statements (Last 3 Years)',
      description: 'Analyze P&L, Balance Sheet, and Cash Flow statements for accuracy and trends',
      category: 'financial',
      priority: 'critical',
      status: 'completed',
      assignee: 'Sarah Johnson',
      dueDate: new Date('2025-07-24'),
      estimatedHours: 8,
      actualHours: 6,
      dependencies: [],
      aiAutomatable: true,
      aiConfidence: 0.95,
      aiSuggestion: 'AI can extract key metrics, calculate ratios, and identify trends automatically',
      linkedDocuments: ['financials-2022-2024.pdf', 'audit-report-2024.pdf'],
      findings: ['Strong revenue growth (45% CAGR)', 'Improving margins (18% → 23%)'],
      template: 'saas'
    },
    {
      id: 'fin-002',
      title: 'Customer Concentration Analysis',
      description: 'Analyze top customer dependencies and revenue concentration risks',
      category: 'financial',
      priority: 'high',
      status: 'in_progress',
      assignee: 'Mike Chen',
      dueDate: new Date('2025-07-25'),
      estimatedHours: 4,
      dependencies: ['fin-001'],
      aiAutomatable: true,
      aiConfidence: 0.89,
      aiSuggestion: 'Found in customer list - top 3 customers = 67% of revenue (high risk)',
      linkedDocuments: ['customer-contracts.xlsx', 'revenue-breakdown.pdf'],
      findings: ['High concentration risk identified'],
      template: 'saas'
    },
    {
      id: 'com-001',
      title: 'Market Size & Competitive Analysis',
      description: 'Assess total addressable market and competitive positioning',
      category: 'commercial',
      priority: 'high',
      status: 'pending',
      assignee: 'Alex Thompson',
      dueDate: new Date('2025-07-26'),
      estimatedHours: 6,
      dependencies: [],
      aiAutomatable: true,
      aiConfidence: 0.82,
      aiSuggestion: 'AI can research market data and competitor analysis from public sources',
      linkedDocuments: ['market-research.pdf'],
      findings: [],
      template: 'saas'
    },
    {
      id: 'leg-001',
      title: 'IP Portfolio Review',
      description: 'Review patents, trademarks, and IP protection strategy',
      category: 'legal',
      priority: 'medium',
      status: 'blocked',
      assignee: 'Legal Team',
      dueDate: new Date('2025-07-27'),
      estimatedHours: 5,
      dependencies: [],
      aiAutomatable: false,
      linkedDocuments: ['ip-portfolio.pdf'],
      findings: ['Missing patent protection in EU market'],
      template: 'saas'
    },
    {
      id: 'tech-001',
      title: 'Technology Architecture Review',
      description: 'Assess scalability, security, and technical debt',
      category: 'technical',
      priority: 'high',
      status: 'pending',
      assignee: 'CTO Review',
      dueDate: new Date('2025-07-28'),
      estimatedHours: 8,
      dependencies: [],
      aiAutomatable: true,
      aiConfidence: 0.78,
      aiSuggestion: 'Can analyze tech stack documentation and identify common risk patterns',
      linkedDocuments: ['tech-architecture.pdf', 'security-audit.pdf'],
      findings: [],
      template: 'saas'
    },
    // Enhanced Operational Excellence Assessment Items
    {
      id: 'ops-001',
      title: 'Comprehensive Management Team Assessment',
      description: 'Systematic evaluation of leadership competencies, team dynamics, and succession planning',
      category: 'operational',
      priority: 'critical',
      status: 'pending',
      assignee: 'Sarah Johnson',
      dueDate: new Date('2025-07-25'),
      estimatedHours: 12,
      dependencies: [],
      aiAutomatable: true,
      aiConfidence: 0.91,
      aiSuggestion: 'AI can analyze management competencies, track record, and succession readiness',
      linkedDocuments: ['management-bios.pdf', 'org-chart.pdf', 'performance-reviews.pdf'],
      findings: [],
      template: 'saas'
    },
    {
      id: 'ops-002',
      title: 'Operational Process Efficiency Analysis',
      description: 'Comprehensive assessment of key operational processes and efficiency metrics',
      category: 'operational',
      priority: 'high',
      status: 'pending',
      assignee: 'Michael Chen',
      dueDate: new Date('2025-07-26'),
      estimatedHours: 10,
      dependencies: [],
      aiAutomatable: true,
      aiConfidence: 0.88,
      aiSuggestion: 'AI can map processes, identify bottlenecks, and benchmark against industry standards',
      linkedDocuments: ['process-maps.pdf', 'operational-metrics.xlsx'],
      findings: [],
      template: 'saas'
    },
    {
      id: 'ops-003',
      title: 'Digital Maturity and Automation Assessment',
      description: 'Evaluate current automation levels and digital transformation opportunities',
      category: 'operational',
      priority: 'high',
      status: 'pending',
      assignee: 'Alex Thompson',
      dueDate: new Date('2025-07-27'),
      estimatedHours: 8,
      dependencies: ['tech-001'],
      aiAutomatable: true,
      aiConfidence: 0.85,
      aiSuggestion: 'AI can assess automation potential and identify quick wins for process improvement',
      linkedDocuments: ['tech-stack.pdf', 'automation-tools.xlsx'],
      findings: [],
      template: 'saas'
    },
    {
      id: 'ops-004',
      title: 'Quality Management System Review',
      description: 'Assessment of quality control processes, metrics, and continuous improvement',
      category: 'operational',
      priority: 'medium',
      status: 'pending',
      assignee: 'Jennifer Kim',
      dueDate: new Date('2025-07-28'),
      estimatedHours: 6,
      dependencies: ['ops-002'],
      aiAutomatable: true,
      aiConfidence: 0.82,
      aiSuggestion: 'AI can analyze quality metrics and identify improvement opportunities',
      linkedDocuments: ['quality-reports.pdf', 'customer-feedback.xlsx'],
      findings: [],
      template: 'saas'
    },
    {
      id: 'ops-005',
      title: 'Supply Chain and Vendor Assessment',
      description: 'Evaluate supply chain resilience, vendor relationships, and risk mitigation',
      category: 'operational',
      priority: 'medium',
      status: 'pending',
      assignee: 'Operations Team',
      dueDate: new Date('2025-07-29'),
      estimatedHours: 7,
      dependencies: [],
      aiAutomatable: true,
      aiConfidence: 0.79,
      aiSuggestion: 'AI can assess vendor concentration risk and supply chain vulnerabilities',
      linkedDocuments: ['vendor-contracts.pdf', 'supply-chain-map.pdf'],
      findings: [],
      template: 'saas'
    },
    {
      id: 'mgmt-001',
      title: 'Leadership Competency Deep Dive',
      description: 'Detailed assessment of individual leadership competencies and development needs',
      category: 'operational',
      priority: 'high',
      status: 'pending',
      assignee: 'HR Assessment Team',
      dueDate: new Date('2025-07-26'),
      estimatedHours: 15,
      dependencies: ['ops-001'],
      aiAutomatable: true,
      aiConfidence: 0.89,
      aiSuggestion: 'AI can evaluate competency scores against industry benchmarks and identify gaps',
      linkedDocuments: ['competency-assessments.pdf', 'leadership-360-reviews.pdf'],
      findings: [],
      template: 'saas'
    },
    {
      id: 'mgmt-002',
      title: 'Succession Planning and Retention Analysis',
      description: 'Evaluate succession readiness and retention strategies for key roles',
      category: 'operational',
      priority: 'critical',
      status: 'pending',
      assignee: 'Sarah Johnson',
      dueDate: new Date('2025-07-27'),
      estimatedHours: 10,
      dependencies: ['mgmt-001'],
      aiAutomatable: true,
      aiConfidence: 0.86,
      aiSuggestion: 'AI can assess succession gaps and recommend retention strategies',
      linkedDocuments: ['succession-plan.pdf', 'retention-strategy.pdf'],
      findings: [],
      template: 'saas'
    },
    {
      id: 'mgmt-003',
      title: 'GP Relationship Quality Assessment',
      description: 'Comprehensive evaluation of GP relationships, performance track record, and future opportunities',
      category: 'operational',
      priority: 'high',
      status: 'pending',
      assignee: 'Jennifer Kim',
      dueDate: new Date('2025-07-28'),
      estimatedHours: 8,
      dependencies: [],
      aiAutomatable: true,
      aiConfidence: 0.92,
      aiSuggestion: 'AI can analyze GP performance data and relationship quality metrics',
      linkedDocuments: ['gp-performance.xlsx', 'relationship-history.pdf'],
      findings: [],
      template: 'saas'
    },
    {
      id: 'bench-001',
      title: 'Operational Benchmarking Analysis',
      description: 'Compare operational metrics against industry benchmarks and peer performance',
      category: 'operational',
      priority: 'medium',
      status: 'pending',
      assignee: 'Analytics Team',
      dueDate: new Date('2025-07-29'),
      estimatedHours: 6,
      dependencies: ['ops-002', 'ops-004'],
      aiAutomatable: true,
      aiConfidence: 0.94,
      aiSuggestion: 'AI can automatically compare metrics against industry databases and generate benchmark reports',
      linkedDocuments: ['industry-benchmarks.pdf', 'peer-analysis.xlsx'],
      findings: [],
      template: 'saas'
    }
  ])

  // AI workflow recommendations
  React.useEffect(() => {
    if (currentMode.mode !== 'traditional') {
      const automatableItems = checklistItems.filter(item => 
        item.aiAutomatable && item.status === 'pending'
      )

      if (automatableItems.length > 0) {
        addRecommendation({
          id: `checklist-auto-${projectId}`,
          type: 'automation',
          priority: 'high',
          title: `Automate ${automatableItems.length} DD Tasks`,
          description: `AI can automatically complete ${automatableItems.length} routine checklist items, saving an estimated ${automatableItems.reduce((acc, item) => acc + item.estimatedHours, 0)} hours.`,
          actions: [{
            id: 'auto-checklist',
            label: 'Start Automation',
            action: 'AUTOMATE_CHECKLIST',
            primary: true,
            estimatedTimeSaving: automatableItems.reduce((acc, item) => acc + item.estimatedHours * 60, 0)
          }, {
            id: 'review-items',
            label: 'Review Items',
            action: 'REVIEW_AUTOMATABLE'
          }],
          confidence: 0.91,
          moduleContext: 'due-diligence',
          timestamp: new Date()
        })
      }

      // Deal template recommendation
      if (dealType === 'saas') {
        addRecommendation({
          id: `template-match-${projectId}`,
          type: 'suggestion',
          priority: 'medium',
          title: 'SaaS Deal Template Detected',
          description: 'This deal matches our SaaS template. Apply proven checklist items from 12 similar successful deals?',
          actions: [{
            id: 'apply-template',
            label: 'Apply SaaS Template',
            action: 'APPLY_DEAL_TEMPLATE',
            primary: true
          }],
          confidence: 0.87,
          moduleContext: 'due-diligence',
          timestamp: new Date()
        })
      }
    }
  }, [currentMode.mode, projectId, dealType, addRecommendation])

  const toggleCategory = (category: string) => {
    const newExpanded = new Set(expandedCategories)
    if (newExpanded.has(category)) {
      newExpanded.delete(category)
    } else {
      newExpanded.add(category)
    }
    setExpandedCategories(newExpanded)
  }

  const toggleItemSelection = (itemId: string) => {
    const newSelected = new Set(selectedItems)
    if (newSelected.has(itemId)) {
      newSelected.delete(itemId)
    } else {
      newSelected.add(itemId)
    }
    setSelectedItems(newSelected)
  }

  const handleAutomateSelected = async () => {
    if (selectedItems.size === 0) return

    setAutomationRunning(true)
    trackInteraction({
      interactionType: 'automation_approved',
      userAction: 'accepted',
      module: 'due-diligence',
      context: {
        automatedItems: Array.from(selectedItems),
        itemCount: selectedItems.size
      }
    })

    // Simulate automation process
    setTimeout(() => {
      setAutomationRunning(false)
      setSelectedItems(new Set())
    }, 3000)
  }

  const getStatusColor = (status: ChecklistItem['status']) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-50 border-green-200'
      case 'in_progress': return 'text-blue-600 bg-blue-50 border-blue-200'
      case 'review': return 'text-purple-600 bg-purple-50 border-purple-200'
      case 'blocked': return 'text-red-600 bg-red-50 border-red-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getStatusIcon = (status: ChecklistItem['status']) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'in_progress': return <Clock className="w-4 h-4 text-blue-600" />
      case 'review': return <Eye className="w-4 h-4 text-purple-600" />
      case 'blocked': return <AlertTriangle className="w-4 h-4 text-red-600" />
      default: return <Circle className="w-4 h-4 text-gray-400" />
    }
  }

  const getPriorityColor = (priority: ChecklistItem['priority']) => {
    switch (priority) {
      case 'critical': return 'text-red-600 bg-red-50'
      case 'high': return 'text-orange-600 bg-orange-50'
      case 'medium': return 'text-yellow-600 bg-yellow-50'
      case 'low': return 'text-green-600 bg-green-50'
    }
  }

  const getCategoryIcon = (category: ChecklistItem['category']) => {
    switch (category) {
      case 'financial': return <TrendingUp className="w-4 h-4" />
      case 'commercial': return <Target className="w-4 h-4" />
      case 'legal': return <Shield className="w-4 h-4" />
      case 'technical': return <Brain className="w-4 h-4" />
      case 'operational': return <Users className="w-4 h-4" />
    }
  }

  const groupedItems = checklistItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = []
    }
    acc[item.category].push(item)
    return acc
  }, {} as Record<string, ChecklistItem[]>)

  const categories = [
    { id: 'financial', label: 'Financial Analysis', count: groupedItems.financial?.length || 0 },
    { id: 'commercial', label: 'Commercial Review', count: groupedItems.commercial?.length || 0 },
    { id: 'legal', label: 'Legal & Compliance', count: groupedItems.legal?.length || 0 },
    { id: 'technical', label: 'Technical Assessment', count: groupedItems.technical?.length || 0 },
    { id: 'operational', label: 'Operational Review', count: groupedItems.operational?.length || 0 }
  ]

  const renderTraditionalView = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Due Diligence Checklist</h2>
          <p className="text-gray-600">Track progress across all DD workstreams</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <FileText className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <Users className="w-4 h-4 mr-2" />
            Assign
          </Button>
        </div>
      </div>

      {categories.map((category) => (
        <Card key={category.id}>
          <CardHeader
            className="cursor-pointer"
            onClick={() => toggleCategory(category.id)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {getCategoryIcon(category.id as ChecklistItem['category'])}
                <CardTitle className="text-lg">{category.label}</CardTitle>
                <Badge variant="outline">{category.count} items</Badge>
              </div>
              {expandedCategories.has(category.id) ? 
                <ChevronDown className="w-4 h-4" /> : 
                <ChevronRight className="w-4 h-4" />
              }
            </div>
          </CardHeader>
          
          {expandedCategories.has(category.id) && (
            <CardContent>
              <div className="space-y-3">
                {(groupedItems[category.id] || []).map((item) => (
                  <div key={item.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start space-x-3 flex-1">
                        {getStatusIcon(item.status)}
                        <div className="flex-1">
                          <h4 className="font-medium">{item.title}</h4>
                          <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 ml-4">
                        <Badge className={`text-xs ${getPriorityColor(item.priority)}`}>
                          {item.priority}
                        </Badge>
                        <Badge className={`text-xs ${getStatusColor(item.status)}`}>
                          {item.status.replace('_', ' ')}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center space-x-4">
                        <span>Assignee: {item.assignee}</span>
                        <span>Due: {item.dueDate.toISOString().split('T')[0]}</span>
                        <span>Est: {item.estimatedHours}h</span>
                      </div>
                      
                      {item.linkedDocuments.length > 0 && (
                        <div className="flex items-center space-x-1">
                          <FileText className="w-4 h-4" />
                          <span>{item.linkedDocuments.length} docs</span>
                        </div>
                      )}
                    </div>

                    {item.findings.length > 0 && (
                      <div className="mt-3 p-2 bg-yellow-50 rounded text-sm">
                        <strong>Findings:</strong>
                        <ul className="mt-1">
                          {item.findings.map((finding, index) => (
                            <li key={index} className="text-yellow-800">• {finding}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          )}
        </Card>
      ))}
    </div>
  )

  const renderAssistedView = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold flex items-center">
            <Brain className="w-5 h-5 mr-2 text-purple-500" />
            AI-Enhanced DD Checklist
            <Badge variant="ai" className="ml-3">Smart Automation</Badge>
          </h2>
          <p className="text-gray-600">Intelligent checklist with automated task completion</p>
        </div>
        <div className="flex items-center space-x-2">
          {selectedItems.size > 0 && (
            <Button 
              onClick={handleAutomateSelected}
              disabled={automationRunning}
              variant="ai"
            >
              {automationRunning ? (
                <Clock className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Zap className="w-4 h-4 mr-2" />
              )}
              Automate Selected ({selectedItems.size})
            </Button>
          )}
          <Button variant="outline" size="sm">
            <Sparkles className="w-4 h-4 mr-2" />
            AI Suggestions
          </Button>
        </div>
      </div>

      {/* AI Automation Status */}
      {automationRunning && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Clock className="w-5 h-5 text-blue-600 animate-spin" />
              <div>
                <h3 className="font-semibold text-blue-800">Automation in Progress</h3>
                <p className="text-sm text-blue-600">
                  Processing {selectedItems.size} checklist items automatically...
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {categories.map((category) => (
        <Card key={category.id}>
          <CardHeader
            className="cursor-pointer"
            onClick={() => toggleCategory(category.id)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {getCategoryIcon(category.id as ChecklistItem['category'])}
                <CardTitle className="text-lg">{category.label}</CardTitle>
                <Badge variant="outline">{category.count} items</Badge>
                
                {/* AI Enhancement Indicators */}
                {(groupedItems[category.id] || []).some(item => item.aiAutomatable) && (
                  <Badge variant="ai" className="text-xs">
                    <Zap className="w-3 h-3 mr-1" />
                    AI Ready
                  </Badge>
                )}
              </div>
              {expandedCategories.has(category.id) ? 
                <ChevronDown className="w-4 h-4" /> : 
                <ChevronRight className="w-4 h-4" />
              }
            </div>
          </CardHeader>
          
          {expandedCategories.has(category.id) && (
            <CardContent>
              <div className="space-y-3">
                {(groupedItems[category.id] || []).map((item) => (
                  <div key={item.id} className={`
                    border rounded-lg p-4 transition-all
                    ${item.aiAutomatable ? 'border-l-4 border-l-purple-400' : ''}
                    ${selectedItems.has(item.id) ? 'bg-purple-50 border-purple-200' : ''}
                  `}>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start space-x-3 flex-1">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(item.status)}
                          {item.aiAutomatable && item.status === 'pending' && (
                            <input
                              type="checkbox"
                              checked={selectedItems.has(item.id)}
                              onChange={() => toggleItemSelection(item.id)}
                              className="rounded text-purple-600"
                            />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="font-medium">{item.title}</h4>
                            {item.aiAutomatable && (
                              <Badge variant="ai" className="text-xs">
                                <Brain className="w-3 h-3 mr-1" />
                                AI: {Math.round((item.aiConfidence || 0) * 100)}%
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                          
                          {item.aiSuggestion && currentMode.mode === 'assisted' && (
                            <div className="mt-2 p-2 bg-purple-50 rounded text-sm">
                              <div className="flex items-start space-x-2">
                                <Lightbulb className="w-4 h-4 text-purple-600 mt-0.5" />
                                <div>
                                  <span className="font-medium text-purple-800">AI Insight:</span>
                                  <p className="text-purple-700">{item.aiSuggestion}</p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 ml-4">
                        <Badge className={`text-xs ${getPriorityColor(item.priority)}`}>
                          {item.priority}
                        </Badge>
                        <Badge className={`text-xs ${getStatusColor(item.status)}`}>
                          {item.status.replace('_', ' ')}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center space-x-4">
                        <span>Assignee: {item.assignee}</span>
                        <span>Due: {item.dueDate.toISOString().split('T')[0]}</span>
                        <span>Est: {item.estimatedHours}h</span>
                        {item.actualHours && (
                          <span className="text-green-600">Actual: {item.actualHours}h</span>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        {item.linkedDocuments.length > 0 && (
                          <div className="flex items-center space-x-1">
                            <FileText className="w-4 h-4" />
                            <span>{item.linkedDocuments.length} docs</span>
                          </div>
                        )}
                        
                        {item.aiAutomatable && item.status === 'pending' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => toggleItemSelection(item.id)}
                            className="text-xs"
                          >
                            <Zap className="w-3 h-3 mr-1" />
                            Automate
                          </Button>
                        )}
                      </div>
                    </div>

                    {item.findings.length > 0 && (
                      <div className="mt-3 p-2 bg-yellow-50 rounded text-sm">
                        <strong>Findings:</strong>
                        <ul className="mt-1">
                          {item.findings.map((finding, index) => (
                            <li key={index} className="text-yellow-800">• {finding}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          )}
        </Card>
      ))}
    </div>
  )

  const renderAutonomousView = () => (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start space-x-4">
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
              <Brain className="w-4 h-4 text-purple-600" />
            </div>
            <div className="flex-1">
              <div className="bg-purple-50 rounded-lg p-4 mb-4">
                <p className="text-sm mb-2">
                  <strong>DD Checklist Analysis:</strong> I&apos;ve identified {checklistItems.filter(i => i.aiAutomatable).length} items that can be automated immediately.
                </p>
                <p className="text-sm">
                  Based on similar {dealType.toUpperCase()} deals, I recommend prioritizing financial and commercial analysis first.
                </p>
              </div>

              {/* Automated Completion Status */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                <h4 className="font-medium text-green-800 mb-3 flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Completed Automatically
                </h4>
                <div className="space-y-2 text-sm text-green-700">
                  {checklistItems.filter(i => i.status === 'completed').map((item) => (
                    <div key={item.id} className="flex justify-between">
                      <span>• {item.title}</span>
                      <span>{item.actualHours}h saved</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Items Requiring Attention */}
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <h4 className="font-medium text-orange-800 mb-3 flex items-center">
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Requires Your Attention
                </h4>
                <div className="space-y-3">
                  {checklistItems.filter(i => i.status === 'blocked' || i.priority === 'critical').map((item) => (
                    <div key={item.id} className="bg-white rounded p-3">
                      <h5 className="font-medium">{item.title}</h5>
                      <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                      {item.aiSuggestion && (
                        <p className="text-sm text-orange-600 mb-2">
                          <Lightbulb className="w-3 h-3 inline mr-1" />
                          {item.aiSuggestion}
                        </p>
                      )}
                      <div className="flex space-x-2">
                        <Button size="sm">Proceed</Button>
                        <Button size="sm" variant="outline">Delegate</Button>
                        {item.status === 'blocked' && (
                          <Button size="sm" variant="outline">Unblock</Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  return (
    <div className="p-6">
      {currentMode.mode === 'traditional' && renderTraditionalView()}
      {currentMode.mode === 'assisted' && renderAssistedView()}
      {currentMode.mode === 'autonomous' && renderAutonomousView()}
    </div>
  )
}