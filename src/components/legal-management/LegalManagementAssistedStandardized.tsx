'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Brain,
  Plus,
  FileText,
  Scale,
  Shield,
  Zap,
  Sparkles,
  AlertTriangle,
  CheckCircle,
  Clock,
  Target,
  TrendingUp,
  Eye,
  Edit,
  MoreVertical,
  Lightbulb,
  ArrowRight,
  BookOpen,
  Users,
  Calendar,
  XCircle
} from 'lucide-react'
import { StandardizedKPICard } from '@/components/shared/StandardizedKPICard'
import { StandardizedAIPanel } from '@/components/shared/StandardizedAIPanel'
import { StandardizedSearchFilter } from '@/components/shared/StandardizedSearchFilter'
import { StandardizedLoading } from '@/components/shared/StandardizedStates'
import { generateModuleData } from '@/lib/mock-data-generator'
import { DESIGN_SYSTEM, getStatusColor } from '@/lib/design-system'

interface LegalManagementAssistedStandardizedProps {
  isLoading?: boolean
  onCreateDocument?: () => void
  onViewDocument?: (id: string) => void
  onManageCompliance?: () => void
  onExecuteAIAction?: (actionId: string) => void
}

export function LegalManagementAssistedStandardized({
  isLoading = false,
  onCreateDocument,
  onViewDocument,
  onManageCompliance,
  onExecuteAIAction
}: LegalManagementAssistedStandardizedProps) {
  const [activeView, setActiveView] = useState('overview')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFilters, setSelectedFilters] = useState<string[]>([])
  
  const moduleData = generateModuleData('legal')
  
  if (isLoading) {
    return <StandardizedLoading mode="assisted" message="AI is analyzing legal documents and compliance..." />
  }

  const enhancedMetrics = [
    {
      title: 'Active Matters',
      value: '34',
      change: '+2',
      trend: 'up' as const,
      aiInsight: 'Workload optimization reducing avg resolution time',
      confidence: 89
    },
    {
      title: 'AI Compliance Score',
      value: '98%',
      change: '+3%',
      trend: 'up' as const,
      aiInsight: 'Automated monitoring preventing 12 potential issues',
      confidence: 94
    },
    {
      title: 'Risk Prediction',
      value: '2.1/10',
      change: 'Low risk',
      trend: 'stable' as const,
      aiInsight: 'ML models predict low compliance risk',
      confidence: 91
    },
    {
      title: 'Time Saved',
      value: '47 hrs',
      change: '+12 hrs',
      trend: 'up' as const,
      aiInsight: 'Document automation and AI review',
      confidence: 87
    }
  ]

  const aiRecommendations = [
    {
      id: '1',
      type: 'automation' as const,
      title: 'Auto-Generate Investment Agreement Drafts',
      description: 'AI can create initial drafts for 4 pending Series B agreements based on approved templates',
      confidence: 93,
      impact: 'high' as const,
      timeToImplement: '2 hours',
      actions: [
        { label: 'Generate Drafts', action: 'AUTO_GENERATE_DRAFTS', estimatedSaving: '16 hours' },
        { label: 'Review Templates', action: 'REVIEW_TEMPLATES' }
      ]
    },
    {
      id: '2',
      type: 'risk' as const,
      title: 'Compliance Gap Detected',
      description: 'Investment Adviser Act requirements need updating by Feb 15. AI suggests priority actions',
      confidence: 96,
      impact: 'high' as const,
      timeToImplement: '1 week',
      actions: [
        { label: 'View Gap Analysis', action: 'VIEW_COMPLIANCE_GAP' },
        { label: 'Schedule Review', action: 'SCHEDULE_COMPLIANCE_REVIEW' }
      ]
    },
    {
      id: '3',
      type: 'optimization' as const,
      title: 'Contract Review Workflow Enhancement',
      description: 'AI analysis suggests 3 workflow improvements to reduce review time by 35%',
      confidence: 88,
      impact: 'medium' as const,
      timeToImplement: '3-5 days',
      actions: [
        { label: 'View Suggestions', action: 'VIEW_WORKFLOW_IMPROVEMENTS' },
        { label: 'Implement Changes', action: 'IMPLEMENT_WORKFLOW' }
      ]
    }
  ]

  const smartInsights = [
    {
      id: '1',
      category: 'Document Analysis',
      insight: 'Template inconsistency detected across 6 agreements',
      reasoning: 'AI pattern recognition found deviations from standard terms',
      impact: 'Risk of negotiation delays and compliance issues',
      confidence: 92
    },
    {
      id: '2',
      category: 'Compliance Trends',
      insight: 'Regulatory changes in Q1 will affect 23 active matters',
      reasoning: 'Cross-referencing regulatory updates with portfolio data',
      impact: 'Proactive compliance updates needed',
      confidence: 89
    },
    {
      id: '3',
      category: 'Efficiency Gains',
      insight: 'Due diligence reviews 40% faster with AI assistance',
      reasoning: 'Comparing pre/post AI implementation metrics',
      impact: 'Significant cost savings and faster deal closure',
      confidence: 94
    }
  ]

  const aiEnhancedDocuments = [
    {
      id: '1',
      title: 'Series B Investment Agreement - TechFlow',
      category: 'Investment Docs',
      status: 'ai-review',
      priority: 'high',
      assignedTo: 'Sarah Chen',
      deadline: '2024-02-15',
      aiScore: 8.7,
      aiFlags: ['term-inconsistency', 'regulatory-update-needed'],
      aiInsights: {
        riskLevel: 'Low',
        completionPrediction: '92% likely by deadline',
        suggestedActions: ['Review clause 4.2', 'Update regulatory references']
      }
    },
    {
      id: '2',
      title: 'Employment Agreement Template Update',
      category: 'HR Legal',
      status: 'ai-optimized',
      priority: 'medium',
      assignedTo: 'Michael Torres',
      deadline: '2024-02-20',
      aiScore: 9.2,
      aiFlags: ['optimization-complete'],
      aiInsights: {
        riskLevel: 'Very Low',
        completionPrediction: '98% likely by deadline',
        suggestedActions: ['Final review recommended']
      }
    },
    {
      id: '3',
      title: 'Data Processing Agreement - EU Clients',
      category: 'Compliance',
      status: 'ai-approved',
      priority: 'high',
      assignedTo: 'Jennifer Liu',
      deadline: '2024-01-31',
      aiScore: 9.5,
      aiFlags: ['compliance-verified'],
      aiInsights: {
        riskLevel: 'Very Low',
        completionPrediction: 'Completed early',
        suggestedActions: ['Template approved for reuse']
      }
    }
  ]

  const getAIStatusBadge = (status: string) => {
    switch (status) {
      case 'ai-review':
        return (
          <Badge style={{ backgroundColor: DESIGN_SYSTEM.colors.ai.warning, color: DESIGN_SYSTEM.colors.ai.warningText }}>
            <Brain className="w-3 h-3 mr-1" />
            AI Review
          </Badge>
        )
      case 'ai-optimized':
        return (
          <Badge style={{ backgroundColor: DESIGN_SYSTEM.colors.ai.info, color: DESIGN_SYSTEM.colors.ai.infoText }}>
            <Zap className="w-3 h-3 mr-1" />
            AI Optimized
          </Badge>
        )
      case 'ai-approved':
        return (
          <Badge style={{ backgroundColor: DESIGN_SYSTEM.colors.ai.success, color: DESIGN_SYSTEM.colors.ai.successText }}>
            <CheckCircle className="w-3 h-3 mr-1" />
            AI Approved
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getAIFlagBadge = (flag: string) => {
    const flagConfigs = {
      'term-inconsistency': { icon: AlertTriangle, color: DESIGN_SYSTEM.colors.ai.error, text: 'Term Issue' },
      'regulatory-update-needed': { icon: Clock, color: DESIGN_SYSTEM.colors.ai.warning, text: 'Reg Update' },
      'optimization-complete': { icon: CheckCircle, color: DESIGN_SYSTEM.colors.ai.success, text: 'Optimized' },
      'compliance-verified': { icon: Shield, color: DESIGN_SYSTEM.colors.ai.success, text: 'Verified' }
    }
    
    const config = flagConfigs[flag as keyof typeof flagConfigs]
    if (!config) return null
    
    const Icon = config.icon
    return (
      <Badge variant="outline" className="text-xs">
        <Icon className="w-3 h-3 mr-1" style={{ color: config.color }} />
        {config.text}
      </Badge>
    )
  }

  const renderAIOverview = () => (
    <div className="space-y-6">
      {/* AI Enhancement Banner */}
      <Card style={{ 
        borderColor: DESIGN_SYSTEM.colors.ai.border,
        backgroundColor: 'linear-gradient(135deg, rgb(239, 246, 255), rgb(245, 243, 255))'
      }}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-3 rounded-lg" style={{ backgroundColor: DESIGN_SYSTEM.colors.ai.accent }}>
                <Brain className="w-6 h-6" style={{ color: DESIGN_SYSTEM.colors.ai.primary }} />
              </div>
              <div>
                <h3 className="font-semibold" style={{ color: DESIGN_SYSTEM.colors.ai.primary }}>
                  AI Legal Intelligence
                </h3>
                <p className="text-sm" style={{ color: DESIGN_SYSTEM.colors.ai.muted }}>
                  Automated document analysis, compliance monitoring, and risk assessment
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="ai" className="flex items-center space-x-1">
                <Sparkles className="w-3 h-3" />
                <span>8 Insights</span>
              </Badge>
              <Badge variant="outline">3 Recommendations</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {enhancedMetrics.map((metric, index) => (
          <StandardizedKPICard
            key={index}
            {...metric}
            mode="assisted"
            type="ai"
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* AI Recommendations */}
        <StandardizedAIPanel
          title="AI Legal Recommendations"
          recommendations={aiRecommendations}
          mode="assisted"
        />

        {/* Smart Insights */}
        <Card style={{ borderColor: DESIGN_SYSTEM.colors.ai.border }}>
          <CardHeader>
            <CardTitle className="flex items-center" style={{ color: DESIGN_SYSTEM.colors.ai.primary }}>
              <Lightbulb className="w-5 h-5 mr-2" />
              Legal Intelligence
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {smartInsights.map((insight) => (
                <div key={insight.id} className="p-3 rounded-lg" style={{ backgroundColor: DESIGN_SYSTEM.colors.ai.accent }}>
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <Badge variant="outline" className="text-xs">{insight.category}</Badge>
                        <Badge variant="outline" className="text-xs">{insight.confidence}% confident</Badge>
                      </div>
                      <h4 className="text-sm font-medium">{insight.insight}</h4>
                      <p className="text-xs text-gray-600 mt-1">{insight.reasoning}</p>
                    </div>
                  </div>
                  <div className="text-xs font-medium" style={{ color: DESIGN_SYSTEM.colors.ai.primary }}>
                    🎯 {insight.impact}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Analytics Summary */}
      <Card style={{ borderColor: DESIGN_SYSTEM.colors.ai.border }}>
        <CardHeader>
          <CardTitle className="flex items-center" style={{ color: DESIGN_SYSTEM.colors.ai.primary }}>
            <Zap className="w-5 h-5 mr-2" />
            AI Legal Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 rounded-lg" style={{ backgroundColor: DESIGN_SYSTEM.colors.ai.success + '20' }}>
              <div className="text-2xl font-bold" style={{ color: DESIGN_SYSTEM.colors.ai.success }}>96%</div>
              <div className="text-sm font-medium">Document Accuracy</div>
              <div className="text-xs text-gray-600 mt-1">AI review precision</div>
            </div>
            <div className="text-center p-4 rounded-lg" style={{ backgroundColor: DESIGN_SYSTEM.colors.ai.primary + '20' }}>
              <div className="text-2xl font-bold" style={{ color: DESIGN_SYSTEM.colors.ai.primary }}>47hrs</div>
              <div className="text-sm font-medium">Time Saved</div>
              <div className="text-xs text-gray-600 mt-1">Through automation</div>
            </div>
            <div className="text-center p-4 rounded-lg" style={{ backgroundColor: DESIGN_SYSTEM.colors.ai.info + '20' }}>
              <div className="text-2xl font-bold" style={{ color: DESIGN_SYSTEM.colors.ai.info }}>0</div>
              <div className="text-sm font-medium">Compliance Issues</div>
              <div className="text-xs text-gray-600 mt-1">Prevented by AI</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderAIDocuments = () => (
    <div className="space-y-4">
      {/* AI-Enhanced Search */}
      <StandardizedSearchFilter
        mode="assisted"
        onSearch={setSearchQuery}
        onFilterChange={setSelectedFilters}
        searchPlaceholder="AI-powered legal document search..."
        availableFilters={[
          { id: 'ai-status-review', label: 'AI Review', category: 'AI Status' },
          { id: 'ai-status-optimized', label: 'AI Optimized', category: 'AI Status' },
          { id: 'ai-status-approved', label: 'AI Approved', category: 'AI Status' },
          { id: 'ai-score-high', label: 'High AI Score (9+)', category: 'AI Score' },
          { id: 'category-investment', label: 'Investment Docs', category: 'Category' },
          { id: 'category-compliance', label: 'Compliance', category: 'Category' },
          { id: 'priority-high', label: 'High Priority', category: 'Priority' }
        ]}
        aiSuggestions={[
          'Documents with compliance risks',
          'Ready for AI optimization',
          'Template inconsistencies detected'
        ]}
      />

      {/* AI-Enhanced Documents */}
      <Card style={{ borderColor: DESIGN_SYSTEM.colors.ai.border }}>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center" style={{ color: DESIGN_SYSTEM.colors.ai.primary }}>
            <FileText className="w-5 h-5 mr-2" />
            AI-Enhanced Documents ({aiEnhancedDocuments.length})
          </CardTitle>
          <Button onClick={onCreateDocument} style={{ backgroundColor: DESIGN_SYSTEM.colors.ai.primary }}>
            <Plus className="w-4 h-4 mr-2" />
            Create Document
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {aiEnhancedDocuments.map((doc) => (
              <div
                key={doc.id}
                className="border rounded-lg p-4 transition-all duration-200 cursor-pointer"
                style={{ 
                  borderColor: DESIGN_SYSTEM.colors.ai.border,
                  backgroundColor: 'transparent'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = DESIGN_SYSTEM.colors.ai.accent
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent'
                }}
                onClick={() => onViewDocument?.(doc.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-semibold">{doc.title}</h3>
                      {getAIStatusBadge(doc.status)}
                      <div className="flex items-center space-x-1">
                        <Brain className="w-3 h-3" style={{ color: DESIGN_SYSTEM.colors.ai.primary }} />
                        <span className="text-sm font-medium">{doc.aiScore}/10</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                      <div>
                        <span className="text-gray-500">Category:</span>
                        <div className="font-medium">{doc.category}</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Assigned:</span>
                        <div className="font-medium">{doc.assignedTo}</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Deadline:</span>
                        <div className="font-medium">{doc.deadline}</div>
                      </div>
                      <div>
                        <span className="text-gray-500">AI Score:</span>
                        <div className="font-medium" style={{ color: DESIGN_SYSTEM.colors.ai.primary }}>{doc.aiScore}/10</div>
                      </div>
                    </div>

                    {doc.aiFlags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {doc.aiFlags.map((flag) => getAIFlagBadge(flag))}
                      </div>
                    )}

                    <div className="p-3 rounded-lg" style={{ backgroundColor: DESIGN_SYSTEM.colors.ai.accent }}>
                      <h4 className="text-sm font-medium mb-2 flex items-center">
                        <Sparkles className="w-3 h-3 mr-1" style={{ color: DESIGN_SYSTEM.colors.ai.primary }} />
                        AI Analysis
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
                        <div>
                          <span className="text-gray-600">Risk Level:</span>
                          <div className="font-medium">{doc.aiInsights.riskLevel}</div>
                        </div>
                        <div>
                          <span className="text-gray-600">Completion:</span>
                          <div className="font-medium">{doc.aiInsights.completionPrediction}</div>
                        </div>
                        <div>
                          <span className="text-gray-600">Next Actions:</span>
                          <div className="font-medium text-blue-600">{doc.aiInsights.suggestedActions.length} suggestions</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )

  return (
    <div className="p-6" style={{ backgroundColor: DESIGN_SYSTEM.colors.ai.background }}>
      {/* Mode Indicator */}
      <div className="mb-6">
        <Badge style={{ 
          backgroundColor: DESIGN_SYSTEM.colors.ai.accent, 
          color: DESIGN_SYSTEM.colors.ai.primary,
          border: `1px solid ${DESIGN_SYSTEM.colors.ai.border}`
        }} className="flex items-center space-x-1 w-fit">
          <Brain className="h-3 w-3" />
          <span>Assisted Mode</span>
        </Badge>
      </div>

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">AI-Enhanced Legal Management</h1>
        <p className="text-gray-600">
          Intelligent document analysis, automated compliance monitoring, and predictive legal insights
        </p>
      </div>

      {/* Navigation */}
      <div className="mb-6">
        <div className="flex space-x-1 bg-white rounded-lg p-1" style={{ border: `1px solid ${DESIGN_SYSTEM.colors.ai.border}` }}>
          <Button
            variant={activeView === 'overview' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveView('overview')}
            className="flex items-center space-x-2"
          >
            <Brain className="w-4 h-4" />
            <span>AI Overview</span>
          </Button>
          <Button
            variant={activeView === 'documents' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveView('documents')}
            className="flex items-center space-x-2"
          >
            <FileText className="w-4 h-4" />
            <span>Smart Docs</span>
          </Button>
          <Button
            variant={activeView === 'compliance' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveView('compliance')}
            className="flex items-center space-x-2"
          >
            <Shield className="w-4 h-4" />
            <span>AI Compliance</span>
          </Button>
          <Button
            variant={activeView === 'automation' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveView('automation')}
            className="flex items-center space-x-2"
          >
            <Zap className="w-4 h-4" />
            <span>Automation</span>
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-6">
        {activeView === 'overview' && renderAIOverview()}
        {activeView === 'documents' && renderAIDocuments()}
        {activeView === 'compliance' && (
          <div className="text-center py-12">
            <div className="flex items-center justify-center mb-4">
              <Shield className="w-12 h-12 text-blue-400 mr-2" />
              <Brain className="w-8 h-8 text-blue-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-600">AI Compliance Monitoring</h3>
            <p className="text-gray-500">Automated compliance tracking and risk assessment</p>
            <Badge variant="ai" className="mt-2">Coming Soon</Badge>
          </div>
        )}
        {activeView === 'automation' && (
          <div className="text-center py-12">
            <div className="flex items-center justify-center mb-4">
              <Zap className="w-12 h-12 text-yellow-400 mr-2" />
              <Brain className="w-8 h-8 text-blue-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-600">Legal Process Automation</h3>
            <p className="text-gray-500">AI-powered workflow automation and document generation</p>
            <Badge variant="ai" className="mt-2">Coming Soon</Badge>
          </div>
        )}
      </div>
    </div>
  )
}