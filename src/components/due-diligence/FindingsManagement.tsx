'use client'

import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useNavigationStore } from '@/stores/navigation-store'
import { 
  AlertTriangle,
  CheckCircle,
  Clock,
  User,
  Filter,
  Plus,
  Search,
  Brain,
  Target,
  TrendingUp,
  FileText,
  MessageSquare,
  Calendar,
  Star,
  MoreHorizontal,
  Zap,
  Eye,
  Edit,
  Archive
} from 'lucide-react'

interface FindingsManagementProps {
  projectId: string
}

export function FindingsManagement({ projectId }: FindingsManagementProps) {
  const { currentMode, addRecommendation, addInsight } = useNavigationStore()
  const [statusFilter, setStatusFilter] = React.useState<string>('all')
  const [priorityFilter, setPriorityFilter] = React.useState<string>('all')
  const [categoryFilter, setCategoryFilter] = React.useState<string>('all')

  // Sample findings data
  const [findings] = React.useState([
    {
      id: '1',
      title: 'Customer Concentration Risk',
      description: 'Top 3 customers represent 67% of total revenue, significantly above industry benchmark of 35%.',
      category: 'commercial',
      severity: 'high' as const,
      priority: 'high' as const,
      status: 'open' as const,
      impact: 'Deal valuation may need 15-20% discount',
      recommendation: 'Require customer diversification plan as closing condition',
      identifiedBy: 'Sarah Johnson',
      identifiedDate: new Date('2025-07-20'),
      assignedTo: 'Commercial Team',
      dueDate: new Date('2025-07-24'),
      aiGenerated: true,
      confidence: 0.94,
      similarFindings: ['retail-co-2024', 'saas-deal-q2'],
      linkedDocuments: ['customer-list.xlsx', 'contracts-summary.pdf'],
      riskScore: 8.5,
      mitigationEffort: 'medium'
    },
    {
      id: '2',
      title: 'Declining EBITDA Margins',
      description: 'EBITDA margins have declined from 23% to 18% to 15% over the past 3 years.',
      category: 'financial',
      severity: 'medium' as const,
      priority: 'high' as const,
      status: 'in_review' as const,
      impact: 'Questions sustainability of profitability improvements',
      recommendation: 'Deep dive on cost structure and operational efficiency initiatives',
      identifiedBy: 'Financial Team',
      identifiedDate: new Date('2025-07-19'),
      assignedTo: 'Mike Chen',
      dueDate: new Date('2025-07-25'),
      aiGenerated: false,
      confidence: 0,
      similarFindings: [],
      linkedDocuments: ['financials-q1q3.pdf'],
      riskScore: 6.8,
      mitigationEffort: 'high'
    },
    {
      id: '3',
      title: 'Key Person Dependency',
      description: 'Heavy reliance on CTO and VP of Sales with limited succession planning in place.',
      category: 'operational',
      severity: 'medium' as const,
      priority: 'medium' as const,
      status: 'mitigating' as const,
      impact: 'Risk of operational disruption if key personnel leave',
      recommendation: 'Implement retention packages and knowledge transfer programs',
      identifiedBy: 'HR Assessment',
      identifiedDate: new Date('2025-07-18'),
      assignedTo: 'Legal Team',
      dueDate: new Date('2025-07-28'),
      aiGenerated: false,
      confidence: 0,
      similarFindings: [],
      linkedDocuments: ['org-chart.pdf', 'employee-handbook.pdf'],
      riskScore: 5.2,
      mitigationEffort: 'low'
    },
    {
      id: '4',
      title: 'IP Portfolio Gaps',
      description: 'Core technology lacks patent protection in key markets (EU, APAC).',
      category: 'legal',
      severity: 'medium' as const,
      priority: 'medium' as const,
      status: 'resolved' as const,
      impact: 'Competitive advantage may be limited in international expansion',
      recommendation: 'File patent applications in key markets or accept competitive risk',
      identifiedBy: 'Legal Team',
      identifiedDate: new Date('2025-07-17'),
      assignedTo: 'IP Counsel',
      dueDate: new Date('2025-07-22'),
      aiGenerated: true,
      confidence: 0.88,
      similarFindings: ['tech-co-ip-2024'],
      linkedDocuments: ['ip-assessment.pdf'],
      riskScore: 4.1,
      mitigationEffort: 'high',
      resolution: 'Management committed to filing patents in Q1 2025'
    },
    {
      id: '5',
      title: 'IT Security Vulnerabilities',
      description: 'Infrastructure assessment identified 3 high-priority security gaps requiring immediate attention.',
      category: 'technical',
      severity: 'high' as const,
      priority: 'high' as const,
      status: 'open' as const,
      impact: 'Potential data breach exposure and compliance violations',
      recommendation: 'Require security remediation as closing condition',
      identifiedBy: 'Tech Team',
      identifiedDate: new Date('2025-07-21'),
      assignedTo: 'Tech Team',
      dueDate: new Date('2025-07-23'),
      aiGenerated: true,
      confidence: 0.91,
      similarFindings: ['security-audit-2024'],
      linkedDocuments: ['it-assessment.docx'],
      riskScore: 7.8,
      mitigationEffort: 'medium'
    }
  ])

  // AI insights and recommendations
  React.useEffect(() => {
    if (currentMode.mode !== 'traditional') {
      const findingInsights = [
        {
          id: `finding-insight-${projectId}-1`,
          type: 'pattern' as const,
          title: 'Finding Priority Pattern',
          description: '3 high-priority findings identified. Similar deals with 2+ high findings required extended DD periods.',
          confidence: 0.89,
          impact: 'high' as const,
          category: 'findings-analysis',
          module: 'due-diligence',
          actionable: true,
          actions: [
            {
              id: 'extend-dd',
              label: 'Extend DD Timeline',
              description: 'Add 1 week buffer for high-priority findings resolution',
              action: 'EXTEND_TIMELINE',
              estimatedTimeSaving: 0
            }
          ]
        }
      ]

      findingInsights.forEach(insight => addInsight(insight))

      const findingRecommendations = [
        {
          id: `finding-rec-${projectId}-1`,
          type: 'automation' as const,
          priority: 'medium' as const,
          title: 'Automate Finding Categorization',
          description: 'AI can categorize new findings and suggest priority levels based on content analysis.',
          actions: [
            {
              id: 'auto-categorize',
              label: 'Enable Auto-Categorization',
              action: 'ENABLE_AUTO_CATEGORIZE',
              primary: true,
              estimatedTimeSaving: 30
            }
          ],
          confidence: 0.87,
          moduleContext: 'due-diligence',
          timestamp: new Date('2025-07-21T13:00:00')
        }
      ]

      findingRecommendations.forEach(rec => addRecommendation(rec))
    }
  }, [currentMode.mode, projectId, addInsight, addRecommendation])

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200'
      case 'medium': return 'text-orange-600 bg-orange-50 border-orange-200'
      case 'low': return 'text-green-600 bg-green-50 border-green-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'text-red-600 bg-red-50 border-red-200'
      case 'in_review': return 'text-blue-600 bg-blue-50 border-blue-200'
      case 'mitigating': return 'text-orange-600 bg-orange-50 border-orange-200'
      case 'resolved': return 'text-green-600 bg-green-50 border-green-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open': return <AlertTriangle className="w-3 h-3" />
      case 'in_review': return <Eye className="w-3 h-3" />
      case 'mitigating': return <Clock className="w-3 h-3" />
      case 'resolved': return <CheckCircle className="w-3 h-3" />
      default: return <AlertTriangle className="w-3 h-3" />
    }
  }

  const filteredFindings = findings.filter(finding => {
    if (statusFilter !== 'all' && finding.status !== statusFilter) return false
    if (priorityFilter !== 'all' && finding.priority !== priorityFilter) return false
    if (categoryFilter !== 'all' && finding.category !== categoryFilter) return false
    return true
  })

  const findingStats = {
    total: findings.length,
    open: findings.filter(f => f.status === 'open').length,
    highPriority: findings.filter(f => f.priority === 'high').length,
    overdue: findings.filter(f => f.dueDate < new Date() && f.status !== 'resolved').length,
    aiGenerated: findings.filter(f => f.aiGenerated).length
  }

  const categories = ['all', 'commercial', 'financial', 'operational', 'legal', 'technical']
  const priorities = ['all', 'high', 'medium', 'low']
  const statuses = ['all', 'open', 'in_review', 'mitigating', 'resolved']

  const renderTraditionalView = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2 text-orange-500" />
            Findings Management
          </h2>
          <p className="text-gray-600">Track and resolve due diligence findings</p>
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
            <Plus className="w-4 h-4 mr-2" />
            Add Finding
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{findingStats.total}</div>
            <div className="text-sm text-gray-600">Total Findings</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{findingStats.open}</div>
            <div className="text-sm text-gray-600">Open Items</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">{findingStats.highPriority}</div>
            <div className="text-sm text-gray-600">High Priority</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">{findingStats.overdue}</div>
            <div className="text-sm text-gray-600">Overdue</div>
          </CardContent>
        </Card>
      </div>

      {renderFindingsList()}
    </div>
  )

  const renderAssistedView = () => (
    <div className="space-y-6">
      {/* AI-Enhanced Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2 text-orange-500" />
            AI-Enhanced Findings Management
            <Badge variant="ai" className="ml-3">Smart Categorization</Badge>
          </h2>
          <p className="text-gray-600">Intelligent finding analysis with automated risk assessment</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="ai" size="sm">
            <Brain className="w-4 h-4 mr-2" />
            Auto-Categorize
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Smart Add
          </Button>
        </div>
      </div>

      {/* AI Analysis Banner */}
      <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-orange-50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Brain className="w-5 h-5 text-purple-600" />
              <div>
                <h3 className="font-semibold text-purple-800">Finding Analysis Complete</h3>
                <p className="text-sm text-purple-600">
                  Analyzed {findingStats.total} findings, identified {findingStats.highPriority} high-priority items with proven mitigation strategies
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="ai">91% Accuracy</Badge>
              <Badge variant="outline">{findingStats.aiGenerated}/{findingStats.total} AI-Generated</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-red-400">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Risk Impact</span>
              <Target className="w-4 h-4 text-red-500" />
            </div>
            <div className="text-2xl font-bold text-red-600">7.2/10</div>
            <div className="text-xs text-red-600 mb-2">Above average</div>
            <div className="text-xs text-red-600 bg-red-50 p-2 rounded">
              💡 Customer concentration driving score
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-orange-400">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Resolution Rate</span>
              <TrendingUp className="w-4 h-4 text-green-500" />
            </div>
            <div className="text-2xl font-bold text-green-600">78%</div>
            <div className="text-xs text-green-600 mb-2">On track</div>
            <div className="text-xs text-blue-600 bg-blue-50 p-2 rounded">
              📈 Similar to benchmark deals
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-400">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">AI Efficiency</span>
              <Zap className="w-4 h-4 text-blue-500" />
            </div>
            <div className="text-2xl font-bold text-blue-600">2.5h</div>
            <div className="text-xs text-blue-600 mb-2">Time saved</div>
            <div className="text-xs text-green-600 bg-green-50 p-2 rounded">
              ⚡ Auto-categorization active
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-400">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Pattern Match</span>
              <Star className="w-4 h-4 text-purple-500" />
            </div>
            <div className="text-2xl font-bold text-purple-600">87%</div>
            <div className="text-xs text-purple-600 mb-2">Similarity found</div>
            <div className="text-xs text-purple-600 bg-purple-50 p-2 rounded">
              🎯 3 similar deals matched
            </div>
          </CardContent>
        </Card>
      </div>

      {renderFindingsList()}
    </div>
  )

  const renderAutonomousView = () => (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* AI Finding Manager */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start space-x-4">
            <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-4 h-4 text-orange-600" />
            </div>
            <div className="flex-1">
              <div className="bg-orange-50 rounded-lg p-4 mb-4">
                <p className="text-sm mb-2">
                  <strong>Finding Analysis Update:</strong> Identified {findingStats.total} findings across {categories.length - 1} categories.
                </p>
                <p className="text-sm">
                  {findingStats.highPriority} high-priority items require immediate attention. I've matched {findingStats.aiGenerated} findings with similar deal patterns.
                </p>
              </div>

              {/* High Priority Findings */}
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <h4 className="font-medium text-red-800 mb-3">🚨 High Priority Findings</h4>
                <div className="space-y-3">
                  {findings.filter(f => f.priority === 'high').map(finding => (
                    <div key={finding.id} className="bg-white rounded p-3">
                      <h5 className="font-medium">{finding.title}</h5>
                      <p className="text-sm text-gray-600 mb-2">{finding.description}</p>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="destructive">Require Resolution</Button>
                        <Button size="sm" variant="outline">Apply Mitigation</Button>
                        {finding.similarFindings.length > 0 && (
                          <Button size="sm" variant="outline">View Similar ({finding.similarFindings.length})</Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Automated Actions */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-medium text-green-800 mb-3">✅ Automated Actions</h4>
                <div className="space-y-2 text-sm text-green-700">
                  <div>• Categorized {findingStats.aiGenerated} findings using industry patterns</div>
                  <div>• Calculated risk scores based on similar deals</div>
                  <div>• Assigned preliminary priorities and owners</div>
                  <div>• Identified {findings.filter(f => f.similarFindings.length > 0).length} findings with historical precedents</div>
                  <div>• Generated resolution timeline recommendations</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderFindingsList = () => (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Findings ({filteredFindings.length})</CardTitle>
          <div className="flex items-center space-x-3">
            {/* Filters */}
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-sm border rounded px-3 py-1"
            >
              {statuses.map(status => (
                <option key={status} value={status}>
                  {status === 'all' ? 'All Status' : status.replace('_', ' ')}
                </option>
              ))}
            </select>

            <select 
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="text-sm border rounded px-3 py-1"
            >
              {priorities.map(priority => (
                <option key={priority} value={priority}>
                  {priority === 'all' ? 'All Priority' : priority}
                </option>
              ))}
            </select>

            <select 
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="text-sm border rounded px-3 py-1"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {filteredFindings.map((finding) => (
            <div key={finding.id} className={`
              border rounded-lg p-4 hover:shadow-md transition-shadow
              ${currentMode.mode === 'assisted' && finding.aiGenerated ? 'border-l-4 border-l-purple-400' : ''}
            `}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="font-semibold">{finding.title}</h3>
                    {currentMode.mode === 'assisted' && finding.aiGenerated && (
                      <Badge variant="ai" className="text-xs">
                        <Brain className="w-3 h-3 mr-1" />
                        AI Generated
                      </Badge>
                    )}
                    <Badge className={`text-xs ${getSeverityColor(finding.severity)}`}>
                      {finding.severity}
                    </Badge>
                    <Badge className={`text-xs ${getStatusColor(finding.status)}`}>
                      {getStatusIcon(finding.status)}
                      <span className="ml-1">{finding.status.replace('_', ' ')}</span>
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-gray-700 mb-2">{finding.description}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3 text-sm">
                    <div>
                      <span className="font-medium text-gray-600">Impact:</span>
                      <p className="text-gray-700">{finding.impact}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Recommendation:</span>
                      <p className="text-gray-700">{finding.recommendation}</p>
                    </div>
                  </div>

                  {/* AI Enhanced Data */}
                  {currentMode.mode === 'assisted' && finding.aiGenerated && (
                    <div className="bg-purple-50 p-3 rounded text-sm mb-3">
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div>
                          <span className="font-medium">Risk Score:</span> {finding.riskScore}/10
                        </div>
                        <div>
                          <span className="font-medium">Confidence:</span> {Math.round(finding.confidence * 100)}%
                        </div>
                        <div>
                          <span className="font-medium">Effort:</span> {finding.mitigationEffort}
                        </div>
                      </div>
                      {finding.similarFindings.length > 0 && (
                        <div className="mt-2">
                          <span className="font-medium">Similar Findings:</span> {finding.similarFindings.length} matches
                        </div>
                      )}
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-4">
                      <span className="text-gray-500">Category: {finding.category}</span>
                      <span className="text-gray-500">Assigned: {finding.assignedTo}</span>
                      <span className="text-gray-500">Due: {finding.dueDate.toISOString().split('T')[0]}</span>
                    </div>
                    
                    {finding.linkedDocuments.length > 0 && (
                      <div className="flex items-center space-x-1">
                        <FileText className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-500">{finding.linkedDocuments.length} docs</span>
                      </div>
                    )}
                  </div>

                  {finding.status === 'resolved' && finding.resolution && (
                    <div className="mt-3 p-3 bg-green-50 rounded text-sm">
                      <span className="font-medium text-green-800">Resolution:</span>
                      <p className="text-green-700 mt-1">{finding.resolution}</p>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center space-x-2 ml-4">
                  <Button variant="ghost" size="sm">
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="p-6">
      {currentMode.mode === 'traditional' && renderTraditionalView()}
      {currentMode.mode === 'assisted' && renderAssistedView()}
      {currentMode.mode === 'autonomous' && renderAutonomousView()}
    </div>
  )
}