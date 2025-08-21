'use client'

import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useNavigationStoreRefactored } from '@/stores/navigation-store-refactored'
import { 
  FileText,
  Upload,
  Search,
  Filter,
  Download,
  Eye,
  Brain,
  CheckCircle,
  AlertTriangle,
  Clock,
  Folder,
  Grid,
  List,
  Star,
  MoreHorizontal,
  Zap,
  Target
} from 'lucide-react'

interface DocumentManagementProps {
  projectId: string
}

export function DocumentManagement({ projectId }: DocumentManagementProps) {
  const { currentMode, addRecommendation, addInsight } = useNavigationStoreRefactored()
  const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('list')
  const [filterCategory, setFilterCategory] = React.useState<string>('all')
  const [sortBy, setSortBy] = React.useState<string>('recent')

  // Sample document data
  const [documents] = React.useState([
    {
      id: '1',
      name: 'Financial Statements Q1-Q3 2024.pdf',
      category: 'financial',
      size: '2.4 MB',
      uploadedBy: 'Sarah Johnson',
      uploadedAt: new Date('2025-07-21T10:30:00'),
      status: 'processed',
      aiExtracted: true,
      extractedData: {
        revenue: '$12.4M',
        ebitda: '$2.8M',
        keyMetrics: 15,
        redFlags: 2
      },
      tags: ['quarterly', 'audited', 'core'],
      confidence: 0.94
    },
    {
      id: '2', 
      name: 'Customer List & Contracts.xlsx',
      category: 'commercial',
      size: '890 KB',
      uploadedBy: 'Mike Chen',
      uploadedAt: new Date('2025-07-21T09:15:00'),
      status: 'processing',
      aiExtracted: true,
      extractedData: {
        customers: 156,
        avgContractValue: '$87K',
        retention: '94%',
        concentration: '67%'
      },
      tags: ['contracts', 'revenue', 'critical'],
      confidence: 0.87
    },
    {
      id: '3',
      name: 'Management Presentation Dec 2024.pptx',
      category: 'strategic',
      size: '5.1 MB', 
      uploadedBy: 'Alex Thompson',
      uploadedAt: new Date('2025-07-20T16:45:00'),
      status: 'processed',
      aiExtracted: true,
      extractedData: {
        slides: 47,
        futureProjections: 'Y2025-2027',
        marketSize: '$2.1B',
        competitors: 8
      },
      tags: ['strategy', 'projections', 'recent'],
      confidence: 0.91
    },
    {
      id: '4',
      name: 'Employee Handbook 2024.pdf',
      category: 'hr',
      size: '1.8 MB',
      uploadedBy: 'Legal Team',
      uploadedAt: new Date('2025-07-20T14:20:00'),
      status: 'processed',
      aiExtracted: false,
      extractedData: null,
      tags: ['policies', 'hr', 'standard'],
      confidence: 0
    },
    {
      id: '5',
      name: 'IT Infrastructure Assessment.docx',
      category: 'technical', 
      size: '756 KB',
      uploadedBy: 'Tech Team',
      uploadedAt: new Date('2025-07-19T11:30:00'),
      status: 'review_needed',
      aiExtracted: true,
      extractedData: {
        systems: 12,
        uptime: '99.7%',
        securityScore: 8.2,
        risks: 3
      },
      tags: ['infrastructure', 'security', 'technical'],
      confidence: 0.89
    }
  ])

  // AI insights for document management
  React.useEffect(() => {
    if (currentMode.mode !== 'traditional') {
      const docInsights = [
        {
          id: `doc-insight-${projectId}-1`,
          type: 'pattern' as const,
          title: 'Document Coverage Analysis',
          description: 'Missing key legal documents: IP agreements, employment contracts. 73% coverage vs 85% target.',
          confidence: 0.92,
          impact: 'high' as const,
          category: 'document-analysis',
          module: 'due-diligence',
          actionable: true,
          actions: [
            {
              id: 'request-missing',
              label: 'Request Missing Documents',
              description: 'Generate document request list for management',
              action: 'REQUEST_DOCUMENTS',
              estimatedTimeSaving: 45
            }
          ]
        }
      ]

      docInsights.forEach(insight => addInsight(insight))

      const docRecommendations = [
        {
          id: `doc-rec-${projectId}-1`,
          type: 'automation' as const,
          priority: 'high' as const,
          title: 'Automate Document Extraction',
          description: 'AI can extract key data points from uploaded documents automatically.',
          actions: [
            {
              id: 'auto-extract',
              label: 'Enable Auto-Extraction',
              action: 'ENABLE_AUTO_EXTRACT',
              primary: true,
              estimatedTimeSaving: 180
            }
          ],
          confidence: 0.96,
          moduleContext: 'due-diligence',
          timestamp: new Date('2025-07-21T12:30:00')
        }
      ]

      docRecommendations.forEach(rec => addRecommendation(rec))
    }
  }, [currentMode.mode, projectId, addInsight, addRecommendation])

  const categories = [
    { id: 'all', label: 'All Documents', count: documents.length },
    { id: 'financial', label: 'Financial', count: documents.filter(d => d.category === 'financial').length },
    { id: 'commercial', label: 'Commercial', count: documents.filter(d => d.category === 'commercial').length },
    { id: 'strategic', label: 'Strategic', count: documents.filter(d => d.category === 'strategic').length },
    { id: 'technical', label: 'Technical', count: documents.filter(d => d.category === 'technical').length },
    { id: 'hr', label: 'HR & Legal', count: documents.filter(d => d.category === 'hr').length }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'processed': return 'text-green-600 bg-green-50 border-green-200'
      case 'processing': return 'text-blue-600 bg-blue-50 border-blue-200'
      case 'review_needed': return 'text-orange-600 bg-orange-50 border-orange-200'
      case 'error': return 'text-red-600 bg-red-50 border-red-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'processed': return <CheckCircle className="w-3 h-3" />
      case 'processing': return <Clock className="w-3 h-3" />
      case 'review_needed': return <AlertTriangle className="w-3 h-3" />
      default: return <FileText className="w-3 h-3" />
    }
  }

  const filteredDocs = filterCategory === 'all' 
    ? documents 
    : documents.filter(d => d.category === filterCategory)

  const sortedDocs = [...filteredDocs].sort((a, b) => {
    switch (sortBy) {
      case 'recent': return b.uploadedAt.getTime() - a.uploadedAt.getTime()
      case 'name': return a.name.localeCompare(b.name)
      case 'size': return parseFloat(b.size) - parseFloat(a.size)
      case 'category': return a.category.localeCompare(b.category)
      default: return 0
    }
  })

  const renderTraditionalView = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold flex items-center">
            <FileText className="w-5 h-5 mr-2 text-blue-500" />
            Document Management
          </h2>
          <p className="text-gray-600">Organize and manage project documents</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">
            <Search className="w-4 h-4 mr-2" />
            Search
          </Button>
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button>
            <Upload className="w-4 h-4 mr-2" />
            Upload
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{documents.length}</div>
            <div className="text-sm text-gray-600">Total Documents</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {documents.filter(d => d.status === 'processed').length}
            </div>
            <div className="text-sm text-gray-600">Processed</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">
              {documents.filter(d => d.status === 'review_needed').length}
            </div>
            <div className="text-sm text-gray-600">Needs Review</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">
              {documents.filter(d => d.aiExtracted).length}
            </div>
            <div className="text-sm text-gray-600">AI Extracted</div>
          </CardContent>
        </Card>
      </div>

      {renderDocumentList()}
    </div>
  )

  const renderAssistedView = () => (
    <div className="space-y-6">
      {/* AI-Enhanced Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold flex items-center">
            <FileText className="w-5 h-5 mr-2 text-blue-500" />
            AI-Enhanced Document Management
            <Badge variant="ai" className="ml-3">Smart Extraction</Badge>
          </h2>
          <p className="text-gray-600">Intelligent document processing with automated insights</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="ai" size="sm">
            <Brain className="w-4 h-4 mr-2" />
            Auto-Extract All
          </Button>
          <Button>
            <Upload className="w-4 h-4 mr-2" />
            Smart Upload
          </Button>
        </div>
      </div>

      {/* AI Processing Status */}
      <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-blue-50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Brain className="w-5 h-5 text-purple-600" />
              <div>
                <h3 className="font-semibold text-purple-800">AI Document Analysis</h3>
                <p className="text-sm text-purple-600">
                  Extracted data from {documents.filter(d => d.aiExtracted).length} documents with 92% average confidence
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="ai">92% Accuracy</Badge>
              <Badge variant="outline">{documents.filter(d => d.aiExtracted).length}/5 Processed</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-blue-400">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Coverage Score</span>
              <Target className="w-4 h-4 text-blue-500" />
            </div>
            <div className="text-2xl font-bold text-blue-600">73%</div>
            <div className="text-xs text-orange-600 mb-2">Below 85% target</div>
            <div className="text-xs text-blue-600 bg-blue-50 p-2 rounded">
              💡 Missing legal documents
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-green-400">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">AI Efficiency</span>
              <Zap className="w-4 h-4 text-green-500" />
            </div>
            <div className="text-2xl font-bold text-green-600">3.2h</div>
            <div className="text-xs text-green-600 mb-2">Time saved</div>
            <div className="text-xs text-green-600 bg-green-50 p-2 rounded">
              ⚡ Auto-extraction active
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-400">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Data Quality</span>
              <Star className="w-4 h-4 text-purple-500" />
            </div>
            <div className="text-2xl font-bold text-purple-600">92%</div>
            <div className="text-xs text-purple-600 mb-2">Confidence avg</div>
            <div className="text-xs text-purple-600 bg-purple-50 p-2 rounded">
              🎯 High accuracy rate
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-400">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Review Queue</span>
              <AlertTriangle className="w-4 h-4 text-orange-500" />
            </div>
            <div className="text-2xl font-bold text-orange-600">1</div>
            <div className="text-xs text-orange-600 mb-2">Needs attention</div>
            <div className="text-xs text-orange-600 bg-orange-50 p-2 rounded">
              ⚠️ IT assessment flagged
            </div>
          </CardContent>
        </Card>
      </div>

      {renderDocumentList()}
    </div>
  )

  const renderAutonomousView = () => (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* AI Document Manager */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start space-x-4">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <FileText className="w-4 h-4 text-blue-600" />
            </div>
            <div className="flex-1">
              <div className="bg-blue-50 rounded-lg p-4 mb-4">
                <p className="text-sm mb-2">
                  <strong>Document Analysis Complete:</strong> Processed 5 documents and extracted 47 data points.
                </p>
                <p className="text-sm">
                  Found 1 document requiring review and identified 2 missing document categories.
                </p>
              </div>

              {/* Document Status */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                <h4 className="font-medium text-green-800 mb-3">✅ Processing Complete</h4>
                <div className="space-y-2 text-sm text-green-700">
                  <div>• Financial statements: Revenue $12.4M, EBITDA $2.8M extracted</div>
                  <div>• Customer data: 156 customers, 67% concentration risk identified</div>
                  <div>• Management deck: 47 slides, future projections captured</div>
                  <div>• IT assessment: Security score 8.2/10, 3 risks flagged</div>
                </div>
              </div>

              {/* Action Required */}
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <h4 className="font-medium text-orange-800 mb-3">⚠️ Action Required</h4>
                <div className="space-y-3">
                  <div className="bg-white rounded p-3">
                    <h5 className="font-medium">Missing Legal Documents</h5>
                    <p className="text-sm text-gray-600 mb-2">IP agreements and employment contracts not provided</p>
                    <div className="flex space-x-2">
                      <Button size="sm">Request from Management</Button>
                      <Button size="sm" variant="outline">Mark as Not Available</Button>
                    </div>
                  </div>
                  <div className="bg-white rounded p-3">
                    <h5 className="font-medium">IT Assessment Review</h5>
                    <p className="text-sm text-gray-600 mb-2">Technical document flagged for expert review</p>
                    <div className="flex space-x-2">
                      <Button size="sm">Assign to Tech Team</Button>
                      <Button size="sm" variant="outline">Schedule Review</Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderDocumentList = () => (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Documents ({sortedDocs.length})</CardTitle>
          <div className="flex items-center space-x-3">
            {/* Category Filter */}
            <select 
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="text-sm border rounded px-3 py-1"
            >
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.label} ({cat.count})
                </option>
              ))}
            </select>

            {/* Sort */}
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-sm border rounded px-3 py-1"
            >
              <option value="recent">Recent First</option>
              <option value="name">Name A-Z</option>
              <option value="category">Category</option>
              <option value="size">Size</option>
            </select>

            {/* View Toggle */}
            <div className="flex border rounded">
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="rounded-r-none"
              >
                <List className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="rounded-l-none"
              >
                <Grid className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {viewMode === 'list' ? renderListView() : renderGridView()}
      </CardContent>
    </Card>
  )

  const renderListView = () => (
    <div className="space-y-3">
      {sortedDocs.map((doc) => (
        <div key={doc.id} className={`
          border rounded-lg p-4 hover:shadow-md transition-shadow
          ${currentMode.mode === 'assisted' && doc.aiExtracted ? 'border-l-4 border-l-purple-400' : ''}
        `}>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <FileText className="w-5 h-5 text-blue-500" />
                <h3 className="font-medium">{doc.name}</h3>
                {currentMode.mode === 'assisted' && doc.aiExtracted && (
                  <Badge variant="ai" className="text-xs">
                    <Brain className="w-3 h-3 mr-1" />
                    AI Extracted
                  </Badge>
                )}
                <Badge className={`text-xs ${getStatusColor(doc.status)}`}>
                  {getStatusIcon(doc.status)}
                  <span className="ml-1">{doc.status.replace('_', ' ')}</span>
                </Badge>
              </div>
              
              <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                <span>Size: {doc.size}</span>
                <span>Category: {doc.category}</span>
                <span>by {doc.uploadedBy}</span>
                <span>{doc.uploadedAt.toISOString().split('T')[0]}</span>
              </div>

              {/* AI Extracted Data */}
              {currentMode.mode === 'assisted' && doc.extractedData && (
                <div className="bg-purple-50 p-3 rounded text-xs mt-2">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {Object.entries(doc.extractedData).map(([key, value]) => (
                      <div key={key}>
                        <span className="font-medium">{key}:</span> {value}
                      </div>
                    ))}
                  </div>
                  {doc.confidence > 0 && (
                    <div className="mt-2 text-purple-600">
                      Confidence: {Math.round(doc.confidence * 100)}%
                    </div>
                  )}
                </div>
              )}

              {/* Tags */}
              <div className="flex items-center space-x-2 mt-2">
                {doc.tags.map(tag => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div className="flex items-center space-x-2 ml-4">
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
        </div>
      ))}
    </div>
  )

  const renderGridView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {sortedDocs.map((doc) => (
        <Card key={doc.id} className={`hover:shadow-md transition-shadow cursor-pointer ${
          currentMode.mode === 'assisted' && doc.aiExtracted ? 'border-l-4 border-l-purple-400' : ''
        }`}>
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-3">
              <FileText className="w-8 h-8 text-blue-500" />
              <Badge className={`text-xs ${getStatusColor(doc.status)}`}>
                {getStatusIcon(doc.status)}
              </Badge>
            </div>
            
            <h4 className="font-medium text-sm mb-2 line-clamp-2">{doc.name}</h4>
            
            <div className="text-xs text-gray-600 space-y-1 mb-3">
              <div>Size: {doc.size}</div>
              <div>Category: {doc.category}</div>
              <div>by {doc.uploadedBy}</div>
            </div>

            {currentMode.mode === 'assisted' && doc.aiExtracted && (
              <Badge variant="ai" className="text-xs mb-2">
                <Brain className="w-3 h-3 mr-1" />
                AI: {Math.round(doc.confidence * 100)}%
              </Badge>
            )}
            
            <div className="flex items-center justify-between">
              <div className="flex space-x-1">
                <Button variant="ghost" size="sm">
                  <Eye className="w-3 h-3" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Download className="w-3 h-3" />
                </Button>
              </div>
              <span className="text-xs text-gray-500">
                {doc.uploadedAt.toISOString().split('T')[0]}
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
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