'use client'

import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useNavigationStore } from '@/stores/navigation-store'
import { 
  FileText,
  Upload,
  Brain,
  Zap,
  CheckCircle,
  Clock,
  AlertTriangle,
  Eye,
  Download,
  Search,
  Filter,
  TrendingUp,
  Target,
  BarChart3,
  PieChart,
  FileX,
  FileCheck,
  Lightbulb,
  Sparkles,
  RefreshCw,
  MessageSquare,
  Star,
  Play,
  Pause,
  MoreHorizontal,
  ChevronRight,
  ChevronDown
} from 'lucide-react'

interface DocumentAnalysis {
  id: string
  fileName: string
  fileType: string
  size: string
  uploadedAt: Date
  category: 'financial' | 'legal' | 'commercial' | 'technical' | 'operational' | 'other'
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'manual_review'
  aiProcessed: boolean
  confidence: number
  processingTime?: number
  
  // Extracted data
  extractedData: {
    keyMetrics?: Record<string, any>
    entities?: string[]
    dates?: Date[]
    amounts?: number[]
    risks?: string[]
    redFlags?: string[]
    summary?: string
  }
  
  // AI insights
  insights: {
    type: 'financial' | 'risk' | 'compliance' | 'operational' | 'strategic'
    title: string
    description: string
    confidence: number
    severity: 'low' | 'medium' | 'high' | 'critical'
    actionRequired: boolean
  }[]
  
  // Linked findings
  linkedFindings: string[]
  tags: string[]
  reviewedBy?: string
  reviewedAt?: Date
}

interface DocumentAnalysisWorkflowProps {
  projectId: string
}

export function DocumentAnalysisWorkflow({ projectId }: DocumentAnalysisWorkflowProps) {
  const { currentMode, trackInteraction, addRecommendation } = useNavigationStore()
  const [selectedCategory, setSelectedCategory] = React.useState<string>('all')
  const [processingQueue, setProcessingQueue] = React.useState<string[]>([])
  const [expandedDocs, setExpandedDocs] = React.useState<Set<string>>(new Set())
  const [batchProcessing, setBatchProcessing] = React.useState(false)

  // Sample document analysis data
  const [documents] = React.useState<DocumentAnalysis[]>([
    {
      id: 'doc-001',
      fileName: 'Financial_Statements_2024.pdf',
      fileType: 'pdf',
      size: '2.4 MB',
      uploadedAt: new Date('2025-07-21T10:30:00'),
      category: 'financial',
      status: 'completed',
      aiProcessed: true,
      confidence: 0.96,
      processingTime: 45,
      extractedData: {
        keyMetrics: {
          revenue: '$12.4M',
          growth: '45%',
          ebitda: '$2.8M',
          margin: '23%',
          customers: 156,
          churn: '3.2%'
        },
        amounts: [12400000, 2800000, 5600000],
        dates: [new Date('2024-12-31'), new Date('2023-12-31')],
        summary: 'Strong financial performance with consistent growth and improving margins'
      },
      insights: [
        {
          type: 'financial',
          title: 'Strong Revenue Growth',
          description: '45% YoY growth with improving unit economics',
          confidence: 0.94,
          severity: 'low',
          actionRequired: false
        },
        {
          type: 'risk',
          title: 'Customer Concentration Risk',
          description: 'Top 3 customers represent 67% of total revenue',
          confidence: 0.91,
          severity: 'high',
          actionRequired: true
        }
      ],
      linkedFindings: ['finding-001'],
      tags: ['audited', 'quarterly', 'saas-metrics'],
      reviewedBy: 'Sarah Johnson',
      reviewedAt: new Date('2025-07-21T11:00:00')
    },
    {
      id: 'doc-002',
      fileName: 'Customer_Contracts_Analysis.xlsx',
      fileType: 'xlsx',
      size: '890 KB',
      uploadedAt: new Date('2025-07-21T09:15:00'),
      category: 'commercial',
      status: 'processing',
      aiProcessed: true,
      confidence: 0.89,
      extractedData: {
        keyMetrics: {
          totalContracts: 156,
          avgContractValue: '$87K',
          retention: '94%',
          expansion: '115%'
        },
        entities: ['Enterprise Corp', 'Global Solutions', 'Tech Innovations'],
        summary: 'Comprehensive customer contract analysis with key commercial terms'
      },
      insights: [
        {
          type: 'commercial',
          title: 'Strong Customer Retention',
          description: '94% retention rate above industry benchmark',
          confidence: 0.92,
          severity: 'low',
          actionRequired: false
        },
        {
          type: 'risk',
          title: 'Contract Concentration',
          description: 'Heavy reliance on a few large enterprise contracts',
          confidence: 0.87,
          severity: 'medium',
          actionRequired: true
        }
      ],
      linkedFindings: [],
      tags: ['contracts', 'revenue', 'retention']
    },
    {
      id: 'doc-003',
      fileName: 'IP_Portfolio_Assessment.pdf',
      fileType: 'pdf',
      size: '1.8 MB',
      uploadedAt: new Date('2025-07-20T16:45:00'),
      category: 'legal',
      status: 'manual_review',
      aiProcessed: true,
      confidence: 0.73,
      extractedData: {
        entities: ['Patent Application #12345', 'Trademark XYZ'],
        risks: ['Missing EU patent protection', 'Trademark disputes'],
        summary: 'IP portfolio review identifying protection gaps'
      },
      insights: [
        {
          type: 'risk',
          title: 'IP Protection Gaps',
          description: 'Missing patent protection in key international markets',
          confidence: 0.85,
          severity: 'medium',
          actionRequired: true
        },
        {
          type: 'compliance',
          title: 'Trademark Issues',
          description: 'Potential conflicts with existing trademarks',
          confidence: 0.68,
          severity: 'high',
          actionRequired: true
        }
      ],
      linkedFindings: ['finding-003'],
      tags: ['intellectual-property', 'patents', 'trademarks']
    },
    {
      id: 'doc-004',
      fileName: 'Tech_Architecture_Review.docx',
      fileType: 'docx',
      size: '756 KB',
      uploadedAt: new Date('2025-07-19T11:30:00'),
      category: 'technical',
      status: 'failed',
      aiProcessed: false,
      confidence: 0,
      extractedData: {},
      insights: [],
      linkedFindings: [],
      tags: ['infrastructure', 'security']
    },
    {
      id: 'doc-005',
      fileName: 'Management_Team_Bios.pdf',
      fileType: 'pdf',
      size: '445 KB',
      uploadedAt: new Date('2025-07-18T14:20:00'),
      category: 'operational',
      status: 'pending',
      aiProcessed: false,
      confidence: 0,
      extractedData: {},
      insights: [],
      linkedFindings: [],
      tags: ['management', 'leadership']
    }
  ])

  // AI workflow recommendations
  React.useEffect(() => {
    if (currentMode.mode !== 'traditional') {
      const unprocessedDocs = documents.filter(doc => doc.status === 'pending' || doc.status === 'failed')
      const needsReview = documents.filter(doc => doc.status === 'manual_review')

      if (unprocessedDocs.length > 0) {
        addRecommendation({
          id: `doc-processing-${projectId}`,
          type: 'automation',
          priority: 'high',
          title: `Process ${unprocessedDocs.length} Documents with AI`,
          description: `${unprocessedDocs.length} documents are ready for AI analysis. This will extract key data points, identify risks, and generate insights automatically.`,
          actions: [{
            id: 'process-docs',
            label: 'Start Batch Processing',
            action: 'BATCH_PROCESS_DOCUMENTS',
            primary: true,
            estimatedTimeSaving: unprocessedDocs.length * 15
          }],
          confidence: 0.93,
          moduleContext: 'due-diligence',
          timestamp: new Date()
        })
      }

      if (needsReview.length > 0) {
        addRecommendation({
          id: `doc-review-${projectId}`,
          type: 'suggestion',
          priority: 'medium',
          title: `${needsReview.length} Documents Need Expert Review`,
          description: 'AI has flagged documents with low confidence scores that require human review.',
          actions: [{
            id: 'schedule-review',
            label: 'Schedule Reviews',
            action: 'SCHEDULE_DOCUMENT_REVIEWS'
          }],
          confidence: 0.88,
          moduleContext: 'due-diligence',
          timestamp: new Date()
        })
      }

      // High-risk insights recommendation
      const criticalInsights = documents.flatMap(doc => 
        doc.insights.filter(insight => insight.severity === 'critical' || insight.severity === 'high')
      )

      if (criticalInsights.length > 0) {
        addRecommendation({
          id: `critical-insights-${projectId}`,
          type: 'insight',
          priority: 'critical',
          title: `${criticalInsights.length} High-Risk Items Detected`,
          description: 'AI analysis has identified critical risks that need immediate attention.',
          actions: [{
            id: 'review-risks',
            label: 'Review Critical Items',
            action: 'REVIEW_CRITICAL_INSIGHTS',
            primary: true
          }],
          confidence: 0.95,
          moduleContext: 'due-diligence',
          timestamp: new Date()
        })
      }
    }
  }, [currentMode.mode, projectId, addRecommendation])

  const handleBatchProcess = async () => {
    const pendingDocs = documents.filter(doc => doc.status === 'pending')
    if (pendingDocs.length === 0) return

    setBatchProcessing(true)
    setProcessingQueue(pendingDocs.map(doc => doc.id))

    trackInteraction({
      interactionType: 'automation_approved',
      userAction: 'accepted',
      module: 'due-diligence',
      context: {
        action: 'batch_process_documents',
        documentCount: pendingDocs.length,
        categories: [...new Set(pendingDocs.map(doc => doc.category))]
      }
    })

    // Simulate processing
    setTimeout(() => {
      setBatchProcessing(false)
      setProcessingQueue([])
    }, 5000)
  }

  const toggleDocumentExpansion = (docId: string) => {
    const newExpanded = new Set(expandedDocs)
    if (newExpanded.has(docId)) {
      newExpanded.delete(docId)
    } else {
      newExpanded.add(docId)
    }
    setExpandedDocs(newExpanded)
  }

  const getStatusColor = (status: DocumentAnalysis['status']) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-50 border-green-200'
      case 'processing': return 'text-blue-600 bg-blue-50 border-blue-200'
      case 'manual_review': return 'text-orange-600 bg-orange-50 border-orange-200'
      case 'failed': return 'text-red-600 bg-red-50 border-red-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getStatusIcon = (status: DocumentAnalysis['status']) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'processing': return <Clock className="w-4 h-4 text-blue-600 animate-spin" />
      case 'manual_review': return <Eye className="w-4 h-4 text-orange-600" />
      case 'failed': return <FileX className="w-4 h-4 text-red-600" />
      default: return <FileText className="w-4 h-4 text-gray-400" />
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-800 bg-red-100 border-red-300'
      case 'high': return 'text-red-700 bg-red-50 border-red-200'
      case 'medium': return 'text-orange-700 bg-orange-50 border-orange-200'
      case 'low': return 'text-green-700 bg-green-50 border-green-200'
      default: return 'text-gray-700 bg-gray-50 border-gray-200'
    }
  }

  const categories = [
    { id: 'all', label: 'All Documents', count: documents.length },
    { id: 'financial', label: 'Financial', count: documents.filter(d => d.category === 'financial').length },
    { id: 'commercial', label: 'Commercial', count: documents.filter(d => d.category === 'commercial').length },
    { id: 'legal', label: 'Legal', count: documents.filter(d => d.category === 'legal').length },
    { id: 'technical', label: 'Technical', count: documents.filter(d => d.category === 'technical').length },
    { id: 'operational', label: 'Operational', count: documents.filter(d => d.category === 'operational').length }
  ]

  const filteredDocs = selectedCategory === 'all' 
    ? documents 
    : documents.filter(d => d.category === selectedCategory)

  const stats = {
    total: documents.length,
    completed: documents.filter(d => d.status === 'completed').length,
    processing: documents.filter(d => d.status === 'processing').length,
    needsReview: documents.filter(d => d.status === 'manual_review').length,
    failed: documents.filter(d => d.status === 'failed').length,
    aiProcessed: documents.filter(d => d.aiProcessed).length,
    criticalInsights: documents.flatMap(d => d.insights).filter(i => i.severity === 'critical').length
  }

  const renderDocumentCard = (doc: DocumentAnalysis) => (
    <Card key={doc.id} className={`
      transition-all duration-200 hover:shadow-md
      ${doc.aiProcessed ? 'border-l-4 border-l-purple-400' : ''}
      ${processingQueue.includes(doc.id) ? 'bg-blue-50 border-blue-200' : ''}
    `}>
      <CardHeader 
        className="cursor-pointer"
        onClick={() => toggleDocumentExpansion(doc.id)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {getStatusIcon(doc.status)}
            <div>
              <CardTitle className="text-lg">{doc.fileName}</CardTitle>
              <p className="text-sm text-gray-600">{doc.fileType.toUpperCase()} • {doc.size} • {doc.uploadedAt.toISOString().split('T')[0]}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Badge className={`text-xs ${getStatusColor(doc.status)}`}>
              {doc.status.replace('_', ' ')}
            </Badge>
            {doc.aiProcessed && (
              <Badge variant="ai" className="text-xs">
                <Brain className="w-3 h-3 mr-1" />
                {Math.round(doc.confidence * 100)}%
              </Badge>
            )}
            {expandedDocs.has(doc.id) ? 
              <ChevronDown className="w-4 h-4" /> : 
              <ChevronRight className="w-4 h-4" />
            }
          </div>
        </div>
      </CardHeader>

      {expandedDocs.has(doc.id) && (
        <CardContent>
          {/* Processing Status */}
          {processingQueue.includes(doc.id) && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-blue-600 animate-spin" />
                <span className="text-sm font-medium text-blue-800">AI Processing in Progress...</span>
              </div>
              <div className="mt-2 bg-blue-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: '60%' }} />
              </div>
            </div>
          )}

          {/* Extracted Data */}
          {doc.extractedData.keyMetrics && (
            <div className="mb-4">
              <h4 className="font-medium mb-2 flex items-center">
                <BarChart3 className="w-4 h-4 mr-2 text-purple-600" />
                Key Metrics Extracted
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 p-3 bg-purple-50 rounded">
                {Object.entries(doc.extractedData.keyMetrics).map(([key, value]) => (
                  <div key={key} className="text-sm">
                    <span className="font-medium text-purple-800">{key}:</span>
                    <span className="text-purple-700 ml-1">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* AI Insights */}
          {doc.insights.length > 0 && (
            <div className="mb-4">
              <h4 className="font-medium mb-2 flex items-center">
                <Lightbulb className="w-4 h-4 mr-2 text-yellow-600" />
                AI Insights ({doc.insights.length})
              </h4>
              <div className="space-y-2">
                {doc.insights.map((insight, index) => (
                  <div key={index} className={`p-3 rounded border ${getSeverityColor(insight.severity)}`}>
                    <div className="flex items-start justify-between mb-1">
                      <h5 className="font-medium text-sm">{insight.title}</h5>
                      <div className="flex items-center space-x-2">
                        <Badge className={`text-xs ${getSeverityColor(insight.severity)}`}>
                          {insight.severity}
                        </Badge>
                        <span className="text-xs opacity-75">{Math.round(insight.confidence * 100)}%</span>
                      </div>
                    </div>
                    <p className="text-sm opacity-90">{insight.description}</p>
                    {insight.actionRequired && (
                      <div className="mt-2 flex items-center space-x-2">
                        <AlertTriangle className="w-3 h-3" />
                        <span className="text-xs font-medium">Action Required</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Summary */}
          {doc.extractedData.summary && (
            <div className="mb-4">
              <h4 className="font-medium mb-2 flex items-center">
                <MessageSquare className="w-4 h-4 mr-2 text-green-600" />
                AI Summary
              </h4>
              <p className="text-sm p-3 bg-green-50 rounded">{doc.extractedData.summary}</p>
            </div>
          )}

          {/* Tags and Metadata */}
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center space-x-4">
              {doc.tags.length > 0 && (
                <div className="flex items-center space-x-1">
                  <Star className="w-3 h-3" />
                  <span>{doc.tags.join(', ')}</span>
                </div>
              )}
              {doc.processingTime && (
                <span>Processed in {doc.processingTime}s</span>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm">
                <Eye className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Download className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  )

  const renderTraditionalView = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Document Analysis</h2>
          <p className="text-gray-600">Review and analyze project documents</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Upload className="w-4 h-4 mr-2" />
            Upload
          </Button>
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
            <div className="text-sm text-gray-600">Total Documents</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
            <div className="text-sm text-gray-600">Analyzed</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">{stats.needsReview}</div>
            <div className="text-sm text-gray-600">Needs Review</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{stats.failed}</div>
            <div className="text-sm text-gray-600">Failed</div>
          </CardContent>
        </Card>
      </div>

      {/* Category Filter */}
      <div className="flex space-x-2 overflow-x-auto">
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(category.id)}
          >
            {category.label} ({category.count})
          </Button>
        ))}
      </div>

      {/* Documents */}
      <div className="space-y-4">
        {filteredDocs.map(renderDocumentCard)}
      </div>
    </div>
  )

  const renderAssistedView = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold flex items-center">
            <Brain className="w-5 h-5 mr-2 text-purple-500" />
            AI Document Analysis
            <Badge variant="ai" className="ml-3">Smart Processing</Badge>
          </h2>
          <p className="text-gray-600">Automated document processing with intelligent insights</p>
        </div>
        <div className="flex items-center space-x-2">
          {stats.total - stats.completed - stats.processing > 0 && (
            <Button 
              onClick={handleBatchProcess}
              disabled={batchProcessing}
              variant="ai"
            >
              {batchProcessing ? (
                <Clock className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Zap className="w-4 h-4 mr-2" />
              )}
              Process All ({stats.total - stats.completed - stats.processing})
            </Button>
          )}
          <Button variant="outline" size="sm">
            <Sparkles className="w-4 h-4 mr-2" />
            AI Insights
          </Button>
        </div>
      </div>

      {/* Batch Processing Status */}
      {batchProcessing && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Brain className="w-5 h-5 text-blue-600" />
                <div>
                  <h3 className="font-semibold text-blue-800">AI Processing Active</h3>
                  <p className="text-sm text-blue-600">
                    Analyzing {processingQueue.length} documents using advanced NLP algorithms...
                  </p>
                </div>
              </div>
              <Badge variant="ai">94% Accuracy</Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Enhanced Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-green-400">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">AI Processed</span>
              <Brain className="w-4 h-4 text-green-500" />
            </div>
            <div className="text-2xl font-bold text-green-600">{stats.aiProcessed}</div>
            <div className="text-xs text-green-600 mb-2">{Math.round((stats.aiProcessed / stats.total) * 100)}% coverage</div>
            <div className="text-xs text-green-600 bg-green-50 p-2 rounded">
              ⚡ Saved ~{stats.aiProcessed * 15} minutes
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-orange-400">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Critical Insights</span>
              <AlertTriangle className="w-4 h-4 text-orange-500" />
            </div>
            <div className="text-2xl font-bold text-orange-600">{stats.criticalInsights}</div>
            <div className="text-xs text-orange-600 mb-2">High priority</div>
            <div className="text-xs text-orange-600 bg-orange-50 p-2 rounded">
              🚨 Requires attention
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-400">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Avg Confidence</span>
              <Star className="w-4 h-4 text-purple-500" />
            </div>
            <div className="text-2xl font-bold text-purple-600">
              {Math.round(documents.filter(d => d.aiProcessed).reduce((acc, d) => acc + d.confidence, 0) / Math.max(1, documents.filter(d => d.aiProcessed).length) * 100)}%
            </div>
            <div className="text-xs text-purple-600 mb-2">AI accuracy</div>
            <div className="text-xs text-purple-600 bg-purple-50 p-2 rounded">
              🎯 High reliability
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-400">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Processing Queue</span>
              <Clock className="w-4 h-4 text-blue-500" />
            </div>
            <div className="text-2xl font-bold text-blue-600">{stats.total - stats.completed}</div>
            <div className="text-xs text-blue-600 mb-2">Remaining</div>
            <div className="text-xs text-blue-600 bg-blue-50 p-2 rounded">
              ⏱ Est: {(stats.total - stats.completed) * 0.5}min
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category Filter */}
      <div className="flex space-x-2 overflow-x-auto">
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(category.id)}
          >
            {category.label} ({category.count})
            {category.id !== 'all' && documents.filter(d => d.category === category.id && d.aiProcessed).length > 0 && (
              <Badge variant="ai" className="ml-2 text-xs">AI</Badge>
            )}
          </Button>
        ))}
      </div>

      {/* Documents */}
      <div className="space-y-4">
        {filteredDocs.map(renderDocumentCard)}
      </div>
    </div>
  )

  const renderAutonomousView = () => (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start space-x-4">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <FileText className="w-4 h-4 text-blue-600" />
            </div>
            <div className="flex-1">
              <div className="bg-blue-50 rounded-lg p-4 mb-4">
                <p className="text-sm mb-2">
                  <strong>Document Analysis Complete:</strong> Processed {stats.aiProcessed} documents and extracted {documents.flatMap(d => Object.keys(d.extractedData.keyMetrics || {})).length} key data points.
                </p>
                <p className="text-sm">
                  Identified {stats.criticalInsights} critical insights requiring immediate attention.
                </p>
              </div>

              {/* Critical Insights */}
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <h4 className="font-medium text-red-800 mb-3 flex items-center">
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Critical Issues Found
                </h4>
                <div className="space-y-3">
                  {documents.flatMap(doc => 
                    doc.insights.filter(insight => insight.severity === 'critical' || insight.severity === 'high')
                  ).slice(0, 3).map((insight, index) => (
                    <div key={index} className="bg-white rounded p-3">
                      <h5 className="font-medium">{insight.title}</h5>
                      <p className="text-sm text-gray-600 mb-2">{insight.description}</p>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="destructive">Address Now</Button>
                        <Button size="sm" variant="outline">Flag for Review</Button>
                        <Button size="sm" variant="outline">Add to Findings</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Processing Results */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-medium text-green-800 mb-3 flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Analysis Results
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm text-green-700">
                  <div>• {stats.aiProcessed} documents processed successfully</div>
                  <div>• {documents.flatMap(d => d.insights).length} insights generated</div>
                  <div>• {documents.filter(d => d.extractedData.keyMetrics).length} financial models updated</div>
                  <div>• {documents.flatMap(d => d.linkedFindings).length} findings automatically linked</div>
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