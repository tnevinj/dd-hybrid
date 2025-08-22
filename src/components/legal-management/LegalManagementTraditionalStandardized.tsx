'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  User,
  Plus,
  FileText,
  Scale,
  Gavel,
  Shield,
  BookOpen,
  Calendar,
  Clock,
  CheckCircle,
  AlertTriangle,
  XCircle,
  MoreVertical,
  Eye,
  Edit,
  Download,
  Users,
  Target,
  TrendingUp,
  Search,
  Filter,
  ArrowUpDown
} from 'lucide-react'
import { StandardizedKPICard } from '@/components/shared/StandardizedKPICard'
import { StandardizedSearchFilter } from '@/components/shared/StandardizedSearchFilter'
import { StandardizedLoading } from '@/components/shared/StandardizedStates'
import { generateModuleData } from '@/lib/mock-data-generator'
import { DESIGN_SYSTEM, getStatusColor, getPriorityColor } from '@/lib/design-system'

interface LegalManagementTraditionalStandardizedProps {
  isLoading?: boolean
  onCreateDocument?: () => void
  onViewDocument?: (id: string) => void
  onManageCompliance?: () => void
}

export function LegalManagementTraditionalStandardized({
  isLoading = false,
  onCreateDocument,
  onViewDocument,
  onManageCompliance
}: LegalManagementTraditionalStandardizedProps) {
  const [activeView, setActiveView] = useState('overview')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFilters, setSelectedFilters] = useState<string[]>([])
  
  const moduleData = generateModuleData('legal')
  
  if (isLoading) {
    return <StandardizedLoading mode="traditional" message="Loading legal management data..." />
  }

  const legalMetrics = [
    {
      title: 'Active Matters',
      value: '34',
      change: '+2',
      trend: 'up' as const,
      period: 'this month'
    },
    {
      title: 'Compliance Score',
      value: '96%',
      change: '+1%',
      trend: 'up' as const,
      period: 'vs last quarter'
    },
    {
      title: 'Pending Reviews',
      value: '8',
      change: '-3',
      trend: 'down' as const,
      period: 'this week'
    },
    {
      title: 'Cost Savings',
      value: '$2.1M',
      change: '+15%',
      trend: 'up' as const,
      period: 'YTD'
    }
  ]

  const legalDocuments = [
    {
      id: '1',
      title: 'Series B Investment Agreement - TechFlow',
      category: 'Investment Docs',
      status: 'review',
      priority: 'high',
      assignedTo: 'Sarah Chen',
      deadline: '2024-02-15',
      lastModified: '2024-02-10',
      confidentiality: 'Confidential',
      complianceStatus: 'compliant'
    },
    {
      id: '2',
      title: 'Employment Agreement Template Update',
      category: 'HR Legal',
      status: 'draft',
      priority: 'medium',
      assignedTo: 'Michael Torres',
      deadline: '2024-02-20',
      lastModified: '2024-02-08',
      confidentiality: 'Internal',
      complianceStatus: 'pending'
    },
    {
      id: '3',
      title: 'Data Processing Agreement - EU Clients',
      category: 'Compliance',
      status: 'approved',
      priority: 'high',
      assignedTo: 'Jennifer Liu',
      deadline: '2024-01-31',
      lastModified: '2024-02-05',
      confidentiality: 'Restricted',
      complianceStatus: 'compliant'
    },
    {
      id: '4',
      title: 'Joint Venture Agreement - CleanTech Partner',
      category: 'Corporate',
      status: 'negotiation',
      priority: 'high',
      assignedTo: 'David Kim',
      deadline: '2024-02-25',
      lastModified: '2024-02-11',
      confidentiality: 'Confidential',
      complianceStatus: 'review-needed'
    }
  ]

  const complianceTracking = [
    {
      id: '1',
      regulation: 'GDPR Compliance',
      status: 'compliant',
      lastReview: '2024-01-15',
      nextReview: '2024-04-15',
      coverage: '98%',
      riskLevel: 'low'
    },
    {
      id: '2',
      regulation: 'SOX Compliance',
      status: 'compliant',
      lastReview: '2024-01-30',
      nextReview: '2024-04-30',
      coverage: '100%',
      riskLevel: 'low'
    },
    {
      id: '3',
      regulation: 'Investment Adviser Act',
      status: 'review-needed',
      lastReview: '2023-11-15',
      nextReview: '2024-02-15',
      coverage: '92%',
      riskLevel: 'medium'
    }
  ]

  const getStatusBadge = (status: string) => {
    const statusColors = {
      'draft': { bg: DESIGN_SYSTEM.colors.status.info.light, text: DESIGN_SYSTEM.colors.status.info.dark },
      'review': { bg: DESIGN_SYSTEM.colors.status.warning.light, text: DESIGN_SYSTEM.colors.status.warning.dark },
      'approved': { bg: DESIGN_SYSTEM.colors.status.success.light, text: DESIGN_SYSTEM.colors.status.success.dark },
      'negotiation': { bg: DESIGN_SYSTEM.colors.status.warning.light, text: DESIGN_SYSTEM.colors.status.warning.dark },
      'compliant': { bg: DESIGN_SYSTEM.colors.status.success.light, text: DESIGN_SYSTEM.colors.status.success.dark },
      'pending': { bg: DESIGN_SYSTEM.colors.status.warning.light, text: DESIGN_SYSTEM.colors.status.warning.dark },
      'review-needed': { bg: DESIGN_SYSTEM.colors.status.error.light, text: DESIGN_SYSTEM.colors.status.error.dark }
    }
    
    const colors = statusColors[status as keyof typeof statusColors] || { bg: '#f3f4f6', text: '#374151' }
    return (
      <Badge style={{ backgroundColor: colors.bg, color: colors.text }}>
        {status.replace('-', ' ').split(' ').map(word => 
          word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ')}
      </Badge>
    )
  }

  const getPriorityBadge = (priority: string) => {
    const priorityColors = {
      'high': { bg: DESIGN_SYSTEM.colors.priority.high.light, text: DESIGN_SYSTEM.colors.priority.high.dark },
      'medium': { bg: DESIGN_SYSTEM.colors.priority.medium.light, text: DESIGN_SYSTEM.colors.priority.medium.dark },
      'low': { bg: DESIGN_SYSTEM.colors.priority.low.light, text: DESIGN_SYSTEM.colors.priority.low.dark }
    }
    
    const colors = priorityColors[priority as keyof typeof priorityColors] || { bg: '#f3f4f6', text: '#374151' }
    return (
      <Badge style={{ backgroundColor: colors.bg, color: colors.text }}>
        {priority.charAt(0).toUpperCase() + priority.slice(1)}
      </Badge>
    )
  }

  const renderOverview = () => (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {legalMetrics.map((metric, index) => (
          <StandardizedKPICard
            key={index}
            {...metric}
            mode="traditional"
          />
        ))}
      </div>

      {/* Recent Activity & Compliance Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card style={{ borderColor: DESIGN_SYSTEM.colors.traditional.border }}>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="w-5 h-5 mr-2" style={{ color: DESIGN_SYSTEM.colors.traditional.icon }} />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {legalDocuments.slice(0, 4).map((doc) => (
                <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <FileText className="w-4 h-4 text-gray-400" />
                    <div>
                      <div className="font-medium text-sm">{doc.title}</div>
                      <div className="text-xs text-gray-500">{doc.category} • {doc.assignedTo}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusBadge(doc.status)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card style={{ borderColor: DESIGN_SYSTEM.colors.traditional.border }}>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="w-5 h-5 mr-2" style={{ color: DESIGN_SYSTEM.colors.traditional.icon }} />
              Compliance Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {complianceTracking.map((compliance) => (
                <div key={compliance.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm">{compliance.regulation}</span>
                    {getStatusBadge(compliance.status)}
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Coverage: {compliance.coverage}</span>
                    <span>Risk: {compliance.riskLevel}</span>
                  </div>
                  <div className="text-xs text-gray-500">
                    Next Review: {compliance.nextReview}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  const renderDocuments = () => (
    <div className="space-y-4">
      {/* Search and Filters */}
      <StandardizedSearchFilter
        mode="traditional"
        onSearch={setSearchQuery}
        onFilterChange={setSelectedFilters}
        searchPlaceholder="Search legal documents..."
        availableFilters={[
          { id: 'category-investment', label: 'Investment Docs', category: 'Category' },
          { id: 'category-hr', label: 'HR Legal', category: 'Category' },
          { id: 'category-compliance', label: 'Compliance', category: 'Category' },
          { id: 'category-corporate', label: 'Corporate', category: 'Category' },
          { id: 'status-draft', label: 'Draft', category: 'Status' },
          { id: 'status-review', label: 'Review', category: 'Status' },
          { id: 'status-approved', label: 'Approved', category: 'Status' },
          { id: 'priority-high', label: 'High Priority', category: 'Priority' },
          { id: 'priority-medium', label: 'Medium Priority', category: 'Priority' }
        ]}
      />

      {/* Documents Table */}
      <Card style={{ borderColor: DESIGN_SYSTEM.colors.traditional.border }}>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center">
            <FileText className="w-5 h-5 mr-2" style={{ color: DESIGN_SYSTEM.colors.traditional.icon }} />
            Legal Documents ({legalDocuments.length})
          </CardTitle>
          <Button onClick={onCreateDocument} style={{ backgroundColor: DESIGN_SYSTEM.colors.traditional.primary }}>
            <Plus className="w-4 h-4 mr-2" />
            New Document
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {legalDocuments.map((doc) => (
              <div
                key={doc.id}
                className="border rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                style={{ borderColor: DESIGN_SYSTEM.colors.traditional.border }}
                onClick={() => onViewDocument?.(doc.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-semibold">{doc.title}</h3>
                      {getStatusBadge(doc.status)}
                      {getPriorityBadge(doc.priority)}
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Category:</span>
                        <div className="font-medium">{doc.category}</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Assigned To:</span>
                        <div className="font-medium">{doc.assignedTo}</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Deadline:</span>
                        <div className="font-medium">{doc.deadline}</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Confidentiality:</span>
                        <div className="font-medium">{doc.confidentiality}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 mt-3 text-xs text-gray-500">
                      <span>Last modified: {doc.lastModified}</span>
                      <span>Compliance: {getStatusBadge(doc.complianceStatus)}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4" />
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

  const renderCompliance = () => (
    <div className="space-y-4">
      <Card style={{ borderColor: DESIGN_SYSTEM.colors.traditional.border }}>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center">
            <Shield className="w-5 h-5 mr-2" style={{ color: DESIGN_SYSTEM.colors.traditional.icon }} />
            Compliance Management
          </CardTitle>
          <Button onClick={onManageCompliance} style={{ backgroundColor: DESIGN_SYSTEM.colors.traditional.primary }}>
            <Plus className="w-4 h-4 mr-2" />
            Add Compliance Item
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {complianceTracking.map((compliance) => (
              <div
                key={compliance.id}
                className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                style={{ borderColor: DESIGN_SYSTEM.colors.traditional.border }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-semibold">{compliance.regulation}</h3>
                      {getStatusBadge(compliance.status)}
                      <Badge style={{ 
                        backgroundColor: compliance.riskLevel === 'low' ? DESIGN_SYSTEM.colors.status.success.light : DESIGN_SYSTEM.colors.status.warning.light,
                        color: compliance.riskLevel === 'low' ? DESIGN_SYSTEM.colors.status.success.dark : DESIGN_SYSTEM.colors.status.warning.dark
                      }}>
                        {compliance.riskLevel} risk
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Coverage:</span>
                        <div className="font-medium">{compliance.coverage}</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Last Review:</span>
                        <div className="font-medium">{compliance.lastReview}</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Next Review:</span>
                        <div className="font-medium">{compliance.nextReview}</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Risk Level:</span>
                        <div className="font-medium capitalize">{compliance.riskLevel}</div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      Review
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
    <div className="p-6" style={{ backgroundColor: DESIGN_SYSTEM.colors.traditional.background }}>
      {/* Mode Indicator */}
      <div className="mb-6">
        <Badge style={{ 
          backgroundColor: DESIGN_SYSTEM.colors.traditional.secondary, 
          color: DESIGN_SYSTEM.colors.traditional.text,
          border: `1px solid ${DESIGN_SYSTEM.colors.traditional.border}`
        }} className="flex items-center space-x-1 w-fit">
          <User className="h-3 w-3" />
          <span>Traditional Mode</span>
        </Badge>
      </div>

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Legal Management</h1>
        <p className="text-gray-600">
          Comprehensive legal document management and compliance tracking
        </p>
      </div>

      {/* Navigation */}
      <div className="mb-6">
        <div className="flex space-x-1 bg-white rounded-lg p-1" style={{ border: `1px solid ${DESIGN_SYSTEM.colors.traditional.border}` }}>
          <Button
            variant={activeView === 'overview' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveView('overview')}
            className="flex items-center space-x-2"
          >
            <Scale className="w-4 h-4" />
            <span>Overview</span>
          </Button>
          <Button
            variant={activeView === 'documents' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveView('documents')}
            className="flex items-center space-x-2"
          >
            <FileText className="w-4 h-4" />
            <span>Documents</span>
          </Button>
          <Button
            variant={activeView === 'compliance' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveView('compliance')}
            className="flex items-center space-x-2"
          >
            <Shield className="w-4 h-4" />
            <span>Compliance</span>
          </Button>
          <Button
            variant={activeView === 'workflows' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveView('workflows')}
            className="flex items-center space-x-2"
          >
            <Gavel className="w-4 h-4" />
            <span>Workflows</span>
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-6">
        {activeView === 'overview' && renderOverview()}
        {activeView === 'documents' && renderDocuments()}
        {activeView === 'compliance' && renderCompliance()}
        {activeView === 'workflows' && (
          <div className="text-center py-12">
            <Gavel className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600">Legal Workflows</h3>
            <p className="text-gray-500">Process management and workflow automation</p>
            <Badge variant="outline" className="mt-2">Coming Soon</Badge>
          </div>
        )}
      </div>
    </div>
  )
}