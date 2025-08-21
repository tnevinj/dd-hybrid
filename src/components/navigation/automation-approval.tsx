'use client'

import * as React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { useNavigationStoreRefactored } from '@/stores/navigation-store-refactored'
import { 
  Bot, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  X, 
  Play, 
  Pause,
  Eye,
  Shield,
  Zap,
  FileText,
  Users,
  BarChart,
  Settings
} from 'lucide-react'

interface AutomationRequest {
  id: string
  title: string
  description: string
  type: 'analysis' | 'document_processing' | 'data_extraction' | 'workflow' | 'reporting'
  risk: 'low' | 'medium' | 'high'
  estimatedTime: number // in minutes
  impact: string[]
  requiredApprovals: string[]
  confidence: number
  prerequisites?: string[]
  reversible: boolean
  autoApprovalEligible: boolean
}

interface ApprovalWorkflowProps {
  requests: AutomationRequest[]
  onApprove: (requestId: string) => void
  onDeny: (requestId: string, reason?: string) => void
  onViewDetails: (requestId: string) => void
  className?: string
}

export function AutomationApproval({ 
  requests, 
  onApprove, 
  onDeny, 
  onViewDetails, 
  className 
}: ApprovalWorkflowProps) {
  const { currentMode } = useNavigationStoreRefactored()
  const [expandedRequest, setExpandedRequest] = React.useState<string | null>(null)
  const [autoApprovalEnabled, setAutoApprovalEnabled] = React.useState(false)
  const [approvalHistory, setApprovalHistory] = React.useState<Record<string, 'approved' | 'denied' | 'pending'>>({})

  // Initialize approval status
  React.useEffect(() => {
    const initialStatus: Record<string, 'pending'> = {}
    requests.forEach(req => {
      if (!approvalHistory[req.id]) {
        initialStatus[req.id] = 'pending'
      }
    })
    if (Object.keys(initialStatus).length > 0) {
      setApprovalHistory(prev => ({ ...prev, ...initialStatus }))
    }
  }, [requests, approvalHistory])

  const getTypeIcon = (type: AutomationRequest['type']) => {
    switch (type) {
      case 'analysis':
        return <BarChart className="w-4 h-4" />
      case 'document_processing':
        return <FileText className="w-4 h-4" />
      case 'data_extraction':
        return <Zap className="w-4 h-4" />
      case 'workflow':
        return <Settings className="w-4 h-4" />
      case 'reporting':
        return <BarChart className="w-4 h-4" />
      default:
        return <Bot className="w-4 h-4" />
    }
  }

  const getRiskColor = (risk: AutomationRequest['risk']) => {
    switch (risk) {
      case 'low':
        return 'text-green-600 bg-green-50 border-green-200'
      case 'medium':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'high':
        return 'text-red-600 bg-red-50 border-red-200'
    }
  }

  const handleApprove = (requestId: string) => {
    setApprovalHistory(prev => ({ ...prev, [requestId]: 'approved' }))
    onApprove(requestId)
  }

  const handleDeny = (requestId: string) => {
    setApprovalHistory(prev => ({ ...prev, [requestId]: 'denied' }))
    onDeny(requestId)
  }

  const handleAutoApproval = (enabled: boolean) => {
    setAutoApprovalEnabled(enabled)
    
    if (enabled) {
      // Auto-approve low-risk, eligible requests
      const eligibleRequests = requests.filter(req => 
        req.risk === 'low' && 
        req.autoApprovalEligible && 
        approvalHistory[req.id] === 'pending'
      )
      
      eligibleRequests.forEach(req => {
        setTimeout(() => handleApprove(req.id), 1000)
      })
    }
  }

  const pendingRequests = requests.filter(req => approvalHistory[req.id] === 'pending')
  const approvedRequests = requests.filter(req => approvalHistory[req.id] === 'approved')
  const deniedRequests = requests.filter(req => approvalHistory[req.id] === 'denied')

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-blue-600" />
              <span>Automation Approvals</span>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="info" className="text-xs">
                {pendingRequests.length} pending
              </Badge>
              {autoApprovalEnabled && (
                <Badge variant="success" className="text-xs">
                  Auto-approval ON
                </Badge>
              )}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <p className="text-gray-600 text-sm">
              Review and approve AI automation requests. You maintain full control over what the AI can do.
            </p>
            <div className="flex items-center space-x-2">
              <Button
                variant={autoApprovalEnabled ? "default" : "outline"}
                size="sm"
                onClick={() => handleAutoApproval(!autoApprovalEnabled)}
                className="text-xs"
              >
                {autoApprovalEnabled ? <Pause className="w-3 h-3 mr-1" /> : <Play className="w-3 h-3 mr-1" />}
                Auto-approve Low Risk
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pending Requests */}
      {pendingRequests.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-orange-600" />
              <span>Pending Approvals ({pendingRequests.length})</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {pendingRequests.map((request) => (
              <div key={request.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      {getTypeIcon(request.type)}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{request.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">{request.description}</p>
                      
                      <div className="flex items-center space-x-4 mt-2">
                        <Badge className={`text-xs ${getRiskColor(request.risk)}`}>
                          {request.risk} risk
                        </Badge>
                        <div className="flex items-center text-xs text-gray-500">
                          <Clock className="w-3 h-3 mr-1" />
                          {request.estimatedTime}min
                        </div>
                        <div className="flex items-center text-xs text-gray-500">
                          <BarChart className="w-3 h-3 mr-1" />
                          {Math.round(request.confidence * 100)}% confidence
                        </div>
                        {request.reversible && (
                          <Badge variant="outline" className="text-xs">
                            Reversible
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setExpandedRequest(
                        expandedRequest === request.id ? null : request.id
                      )}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeny(request.id)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleApprove(request.id)}
                    >
                      <CheckCircle className="w-4 h-4" />
                      Approve
                    </Button>
                  </div>
                </div>

                {/* Expanded Details */}
                {expandedRequest === request.id && (
                  <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <div>
                      <h5 className="font-medium text-sm text-gray-800 mb-2">Impact</h5>
                      <ul className="space-y-1">
                        {request.impact.map((impact, index) => (
                          <li key={index} className="text-sm text-gray-600 flex items-center">
                            <div className="w-1 h-1 bg-gray-400 rounded-full mr-2" />
                            {impact}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {request.prerequisites && request.prerequisites.length > 0 && (
                      <div>
                        <h5 className="font-medium text-sm text-gray-800 mb-2">Prerequisites</h5>
                        <ul className="space-y-1">
                          {request.prerequisites.map((prereq, index) => (
                            <li key={index} className="text-sm text-gray-600 flex items-center">
                              <CheckCircle className="w-3 h-3 text-green-500 mr-2" />
                              {prereq}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div>
                      <h5 className="font-medium text-sm text-gray-800 mb-2">Required Approvals</h5>
                      <div className="flex flex-wrap gap-2">
                        {request.requiredApprovals.map((approval, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {approval}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {request.risk === 'high' && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                        <div className="flex items-start space-x-2">
                          <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5" />
                          <div>
                            <h6 className="font-medium text-red-800 text-sm">High Risk Action</h6>
                            <p className="text-xs text-red-700 mt-1">
                              This action may have significant impact. Please review carefully before approval.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Recent Activity */}
      {(approvedRequests.length > 0 || deniedRequests.length > 0) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart className="w-5 h-5 text-gray-600" />
              <span>Recent Activity</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {/* Approved */}
              {approvedRequests.slice(0, 3).map((request) => (
                <div key={request.id} className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <div>
                      <p className="text-sm font-medium text-green-800">{request.title}</p>
                      <p className="text-xs text-green-600">Approved</p>
                    </div>
                  </div>
                  <Badge variant="success" className="text-xs">
                    In Progress
                  </Badge>
                </div>
              ))}

              {/* Denied */}
              {deniedRequests.slice(0, 2).map((request) => (
                <div key={request.id} className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <X className="w-4 h-4 text-red-600" />
                    <div>
                      <p className="text-sm font-medium text-red-800">{request.title}</p>
                      <p className="text-xs text-red-600">Denied</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="text-xs">
                    Review
                  </Button>
                </div>
              ))}
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t">
              <div className="text-center">
                <div className="text-lg font-semibold text-green-600">{approvedRequests.length}</div>
                <div className="text-xs text-gray-500">Approved</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-red-600">{deniedRequests.length}</div>
                <div className="text-xs text-gray-500">Denied</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-yellow-600">{pendingRequests.length}</div>
                <div className="text-xs text-gray-500">Pending</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {requests.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Shield className="w-6 h-6 text-gray-400" />
            </div>
            <p className="text-sm text-gray-500 mb-2">
              No automation requests pending
            </p>
            <p className="text-xs text-gray-400">
              AI will request approval before taking any significant actions
            </p>
          </CardContent>
        </Card>
      )}

      {/* Settings */}
      <Card className="bg-gray-50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-800">Approval Settings</h4>
              <p className="text-xs text-gray-600">
                Configure how automation requests are handled
              </p>
            </div>
            <Button variant="ghost" size="sm">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Default props for demonstration
export const mockAutomationRequests: AutomationRequest[] = [
  {
    id: '1',
    title: 'Analyze Financial Documents',
    description: 'Extract key metrics from uploaded financial statements and create summary report',
    type: 'document_processing',
    risk: 'low',
    estimatedTime: 15,
    impact: [
      'Extract revenue, profit, and growth metrics',
      'Generate executive summary',
      'Flag potential concerns for review'
    ],
    requiredApprovals: ['Document Access'],
    confidence: 0.92,
    prerequisites: ['Financial documents uploaded', 'Template configured'],
    reversible: true,
    autoApprovalEligible: true
  },
  {
    id: '2',
    title: 'Update Risk Assessment',
    description: 'Automatically update risk scores based on new information and industry benchmarks',
    type: 'analysis',
    risk: 'medium',
    estimatedTime: 25,
    impact: [
      'Recalculate risk scores for all categories',
      'Update risk dashboard',
      'Generate risk alerts if thresholds exceeded'
    ],
    requiredApprovals: ['Risk Model Access'],
    confidence: 0.85,
    reversible: true,
    autoApprovalEligible: false
  },
  {
    id: '3',
    title: 'Generate IC Presentation',
    description: 'Create investment committee presentation using analyzed data and templates',
    type: 'reporting',
    risk: 'high',
    estimatedTime: 45,
    impact: [
      'Compile all analysis into presentation format',
      'Generate executive summary and recommendations',
      'Include risk assessment and financial projections'
    ],
    requiredApprovals: ['Presentation Template', 'Data Access', 'Review Required'],
    confidence: 0.78,
    reversible: false,
    autoApprovalEligible: false
  }
]