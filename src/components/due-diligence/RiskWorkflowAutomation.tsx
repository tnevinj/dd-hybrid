'use client'

import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useNavigationStoreRefactored } from '@/stores/navigation-store-refactored'
import { 
  Workflow,
  Play,
  Pause,
  CheckCircle,
  Clock,
  AlertTriangle,
  ArrowRight,
  Brain,
  Zap,
  Settings,
  Plus,
  Eye,
  Edit,
  MoreHorizontal
} from 'lucide-react'

interface RiskWorkflowAutomationProps {
  projectId: string
}

interface WorkflowStep {
  id: string
  name: string
  description: string
  status: 'pending' | 'in_progress' | 'completed' | 'failed'
  estimatedTime: number
  actualTime?: number
  assignee?: string
  automatable: boolean
  prerequisites: string[]
}

interface RiskWorkflow {
  id: string
  name: string
  description: string
  riskId: string
  riskTitle: string
  priority: 'low' | 'medium' | 'high' | 'critical'
  status: 'draft' | 'active' | 'paused' | 'completed'
  progress: number
  steps: WorkflowStep[]
  estimatedDuration: number
  actualDuration?: number
  createdAt: Date
  aiOptimized: boolean
}

export function RiskWorkflowAutomation({ projectId }: RiskWorkflowAutomationProps) {
  const { currentMode, addRecommendation, addInsight } = useNavigationStoreRefactored()
  const [selectedWorkflow, setSelectedWorkflow] = React.useState<string | null>(null)

  // Sample workflow data
  const [workflows] = React.useState<RiskWorkflow[]>([
    {
      id: '1',
      name: 'Customer Concentration Mitigation',
      description: 'Systematic approach to reduce customer dependency risk',
      riskId: 'risk-1',
      riskTitle: 'Customer Concentration Risk',
      priority: 'high',
      status: 'active',
      progress: 65,
      estimatedDuration: 90,
      actualDuration: 42,
      createdAt: new Date('2025-07-20'),
      aiOptimized: true,
      steps: [
        {
          id: 'step-1',
          name: 'Analyze Customer Data',
          description: 'Deep dive analysis of customer concentration metrics',
          status: 'completed',
          estimatedTime: 8,
          actualTime: 6,
          assignee: 'Data Team',
          automatable: true,
          prerequisites: []
        },
        {
          id: 'step-2',
          name: 'Identify Diversification Opportunities',
          description: 'Research new market segments and customer acquisition channels',
          status: 'completed',
          estimatedTime: 16,
          actualTime: 18,
          assignee: 'Commercial Team',
          automatable: false,
          prerequisites: ['step-1']
        },
        {
          id: 'step-3',
          name: 'Create Customer Acquisition Plan',
          description: 'Develop systematic plan for customer base expansion',
          status: 'in_progress',
          estimatedTime: 24,
          assignee: 'Marketing Team',
          automatable: true,
          prerequisites: ['step-2']
        },
        {
          id: 'step-4',
          name: 'Implement Retention Strategy',
          description: 'Deploy customer retention initiatives for existing clients',
          status: 'pending',
          estimatedTime: 32,
          assignee: 'Customer Success',
          automatable: false,
          prerequisites: ['step-2']
        },
        {
          id: 'step-5',
          name: 'Monitor Progress',
          description: 'Track concentration metrics and adjust strategy',
          status: 'pending',
          estimatedTime: 10,
          automatable: true,
          prerequisites: ['step-3', 'step-4']
        }
      ]
    },
    {
      id: '2',
      name: 'EBITDA Margin Recovery',
      description: 'Operational efficiency improvements to restore margins',
      riskId: 'risk-2',
      riskTitle: 'Declining EBITDA Margins',
      priority: 'high',
      status: 'active',
      progress: 30,
      estimatedDuration: 120,
      actualDuration: 15,
      createdAt: new Date('2025-07-19'),
      aiOptimized: true,
      steps: [
        {
          id: 'step-1',
          name: 'Cost Structure Analysis',
          description: 'Detailed analysis of cost drivers and margin compression',
          status: 'completed',
          estimatedTime: 12,
          actualTime: 10,
          assignee: 'Financial Team',
          automatable: true,
          prerequisites: []
        },
        {
          id: 'step-2',
          name: 'Operational Efficiency Review',
          description: 'Assess operational processes and identify improvements',
          status: 'in_progress',
          estimatedTime: 20,
          assignee: 'Operations Team',
          automatable: false,
          prerequisites: ['step-1']
        },
        {
          id: 'step-3',
          name: 'Implement Cost Optimization',
          description: 'Deploy cost reduction initiatives and process improvements',
          status: 'pending',
          estimatedTime: 45,
          assignee: 'Operations Team',
          automatable: true,
          prerequisites: ['step-2']
        },
        {
          id: 'step-4',
          name: 'Revenue Enhancement',
          description: 'Pricing strategy and revenue optimization initiatives',
          status: 'pending',
          estimatedTime: 30,
          assignee: 'Commercial Team',
          automatable: false,
          prerequisites: ['step-1']
        },
        {
          id: 'step-5',
          name: 'Monitor and Adjust',
          description: 'Track margin improvements and adjust strategy',
          status: 'pending',
          estimatedTime: 13,
          automatable: true,
          prerequisites: ['step-3', 'step-4']
        }
      ]
    },
    {
      id: '3',
      name: 'IT Security Remediation',
      description: 'Address critical security vulnerabilities',
      riskId: 'risk-3',
      riskTitle: 'IT Security Vulnerabilities',
      priority: 'critical',
      status: 'draft',
      progress: 0,
      estimatedDuration: 45,
      createdAt: new Date('2025-07-21'),
      aiOptimized: false,
      steps: [
        {
          id: 'step-1',
          name: 'Security Assessment',
          description: 'Comprehensive security audit and gap analysis',
          status: 'pending',
          estimatedTime: 8,
          assignee: 'Security Team',
          automatable: true,
          prerequisites: []
        },
        {
          id: 'step-2',
          name: 'Patch Critical Vulnerabilities',
          description: 'Deploy security patches for high-priority vulnerabilities',
          status: 'pending',
          estimatedTime: 16,
          assignee: 'IT Team',
          automatable: true,
          prerequisites: ['step-1']
        },
        {
          id: 'step-3',
          name: 'Implement Security Controls',
          description: 'Deploy additional security controls and monitoring',
          status: 'pending',
          estimatedTime: 20,
          assignee: 'Security Team',
          automatable: false,
          prerequisites: ['step-2']
        },
        {
          id: 'step-4',
          name: 'Validate Remediation',
          description: 'Test and validate security improvements',
          status: 'pending',
          estimatedTime: 1,
          assignee: 'Security Team',
          automatable: true,
          prerequisites: ['step-3']
        }
      ]
    }
  ])

  // AI workflow insights
  React.useEffect(() => {
    if (currentMode.mode !== 'traditional') {
      const workflowInsights = [
        {
          id: `workflow-insight-${projectId}-1`,
          type: 'pattern' as const,
          title: 'Workflow Optimization Opportunity',
          description: '4 workflow steps can be automated, reducing total completion time by 40%.',
          confidence: 0.88,
          impact: 'high' as const,
          category: 'workflow-optimization',
          module: 'due-diligence',
          actionable: true,
          actions: [
            {
              id: 'automate-steps',
              label: 'Automate Workflow Steps',
              description: 'Enable AI automation for eligible workflow steps',
              action: 'AUTOMATE_WORKFLOW_STEPS',
              estimatedTimeSaving: 180
            }
          ]
        }
      ]

      workflowInsights.forEach(insight => addInsight(insight))
    }
  }, [currentMode.mode, projectId, addInsight, addRecommendation])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-50 border-green-200'
      case 'in_progress': return 'text-blue-600 bg-blue-50 border-blue-200'
      case 'pending': return 'text-gray-600 bg-gray-50 border-gray-200'
      case 'failed': return 'text-red-600 bg-red-50 border-red-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4" />
      case 'in_progress': return <Clock className="w-4 h-4" />
      case 'pending': return <Clock className="w-4 h-4" />
      case 'failed': return <AlertTriangle className="w-4 h-4" />
      default: return <Clock className="w-4 h-4" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'text-red-600 bg-red-50 border-red-200'
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200'
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'low': return 'text-green-600 bg-green-50 border-green-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const selectedWorkflowData = workflows.find(w => w.id === selectedWorkflow)

  const renderTraditionalView = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold flex items-center">
            <Workflow className="w-5 h-5 mr-2 text-blue-500" />
            Risk Workflow Management
          </h2>
          <p className="text-gray-600">Manage risk mitigation workflows and track progress</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4 mr-2" />
            Configure
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Workflow
          </Button>
        </div>
      </div>

      {/* Workflow List */}
      <div className="space-y-4">
        {workflows.map((workflow) => (
          <Card key={workflow.id} className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="font-semibold">{workflow.name}</h3>
                    <Badge className={`text-xs ${getPriorityColor(workflow.priority)}`}>
                      {workflow.priority}
                    </Badge>
                    <Badge className={`text-xs ${getStatusColor(workflow.status)}`}>
                      {workflow.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{workflow.description}</p>
                  <div className="text-xs text-gray-500">
                    Risk: {workflow.riskTitle} | Duration: {workflow.estimatedDuration} days
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-600">{workflow.progress}%</div>
                  <div className="text-xs text-gray-500">Progress</div>
                </div>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all" 
                  style={{ width: `${workflow.progress}%` }}
                />
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <div>
                  Steps: {workflow.steps.filter(s => s.status === 'completed').length}/{workflow.steps.length}
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setSelectedWorkflow(workflow.id)}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )

  const renderAssistedView = () => (
    <div className="space-y-6">
      {/* AI-Enhanced Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold flex items-center">
            <Workflow className="w-5 h-5 mr-2 text-blue-500" />
            AI-Enhanced Risk Workflows
            <Badge variant="ai" className="ml-3">Smart Automation</Badge>
          </h2>
          <p className="text-gray-600">Intelligent workflow automation with AI optimization</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="ai" size="sm">
            <Brain className="w-4 h-4 mr-2" />
            Optimize All
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Smart Workflow
          </Button>
        </div>
      </div>

      {/* AI Workflow Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-blue-400">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Zap className="w-4 h-4 text-blue-500 mr-1" />
              <span className="text-sm font-medium text-gray-600">Automation</span>
            </div>
            <div className="text-2xl font-bold text-blue-600">60%</div>
            <div className="text-xs text-blue-600">Steps Automated</div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-400">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Clock className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-sm font-medium text-gray-600">Time Saved</span>
            </div>
            <div className="text-2xl font-bold text-green-600">18h</div>
            <div className="text-xs text-green-600">This Month</div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-400">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Brain className="w-4 h-4 text-purple-500 mr-1" />
              <span className="text-sm font-medium text-gray-600">AI Confidence</span>
            </div>
            <div className="text-2xl font-bold text-purple-600">88%</div>
            <div className="text-xs text-purple-600">Optimization</div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-400">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <CheckCircle className="w-4 h-4 text-orange-500 mr-1" />
              <span className="text-sm font-medium text-gray-600">Success Rate</span>
            </div>
            <div className="text-2xl font-bold text-orange-600">92%</div>
            <div className="text-xs text-orange-600">Completion</div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Workflow List */}
      <div className="space-y-4">
        {workflows.map((workflow) => (
          <Card key={workflow.id} className={`hover:shadow-md transition-shadow ${
            workflow.aiOptimized ? 'border-l-4 border-l-purple-400' : ''
          }`}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="font-semibold">{workflow.name}</h3>
                    {workflow.aiOptimized && (
                      <Badge variant="ai" className="text-xs">
                        <Brain className="w-3 h-3 mr-1" />
                        AI Optimized
                      </Badge>
                    )}
                    <Badge className={`text-xs ${getPriorityColor(workflow.priority)}`}>
                      {workflow.priority}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{workflow.description}</p>
                  
                  {/* AI Insights */}
                  {workflow.aiOptimized && (
                    <div className="bg-purple-50 p-2 rounded text-xs mb-2">
                      <div className="grid grid-cols-2 gap-2">
                        <div>🎯 {workflow.steps.filter(s => s.automatable).length} steps automatable</div>
                        <div>⚡ 40% time reduction possible</div>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-600">{workflow.progress}%</div>
                  <div className="text-xs text-gray-500">Progress</div>
                </div>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all" 
                  style={{ width: `${workflow.progress}%` }}
                />
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-4">
                  <span>Steps: {workflow.steps.filter(s => s.status === 'completed').length}/{workflow.steps.length}</span>
                  <span>Duration: {workflow.actualDuration || 0}/{workflow.estimatedDuration} days</span>
                </div>
                <div className="flex space-x-2">
                  {workflow.aiOptimized && (
                    <Button variant="ai" size="sm">
                      <Zap className="w-3 h-3 mr-1" />
                      Auto-Run
                    </Button>
                  )}
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setSelectedWorkflow(workflow.id)}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Details
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )

  const renderAutonomousView = () => (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* AI Workflow Manager */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start space-x-4">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <Workflow className="w-4 h-4 text-blue-600" />
            </div>
            <div className="flex-1">
              <div className="bg-blue-50 rounded-lg p-4 mb-4">
                <p className="text-sm mb-2">
                  <strong>Workflow Automation Update:</strong> Managing {workflows.length} risk mitigation workflows with intelligent automation.
                </p>
                <p className="text-sm">
                  Currently {workflows.filter(w => w.status === 'active').length} workflows are active, with 60% of steps automated for maximum efficiency.
                </p>
              </div>

              {/* Active Workflows */}
              <div className="space-y-3">
                {workflows.filter(w => w.status === 'active').map(workflow => (
                  <div key={workflow.id} className="bg-white border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{workflow.name}</h4>
                      <div className="flex items-center space-x-2">
                        <Badge className={getPriorityColor(workflow.priority)}>{workflow.priority}</Badge>
                        <span className="text-sm font-bold text-blue-600">{workflow.progress}%</span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5 mb-2">
                      <div 
                        className="bg-blue-500 h-1.5 rounded-full" 
                        style={{ width: `${workflow.progress}%` }}
                      />
                    </div>
                    <div className="text-sm text-gray-600">
                      {workflow.steps.filter(s => s.status === 'in_progress').length > 0 && (
                        <span>Current: {workflow.steps.find(s => s.status === 'in_progress')?.name}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* AI Actions */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
                <h4 className="font-medium text-green-800 mb-3">🤖 AI Workflow Actions</h4>
                <div className="space-y-2 text-sm text-green-700">
                  <div>• Automated 60% of workflow steps across all active workflows</div>
                  <div>• Optimized task sequencing to reduce total completion time by 40%</div>
                  <div>• Generated progress reports and stakeholder notifications</div>
                  <div>• Identified bottlenecks and suggested resource reallocation</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderWorkflowDetails = () => {
    if (!selectedWorkflowData) return null

    return (
      <Card className="mt-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{selectedWorkflowData.name} - Workflow Details</CardTitle>
            <Button variant="outline" size="sm" onClick={() => setSelectedWorkflow(null)}>
              Close
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {selectedWorkflowData.steps.map((step, index) => (
              <div key={step.id} className="flex items-start space-x-4 p-4 border rounded-lg">
                <div className="flex-shrink-0">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getStatusColor(step.status)}`}>
                    {getStatusIcon(step.status)}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="font-medium">{step.name}</h4>
                    {step.automatable && (
                      <Badge variant="ai" className="text-xs">Automatable</Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{step.description}</p>
                  <div className="text-xs text-gray-500 grid grid-cols-2 gap-4">
                    <div>Estimated: {step.estimatedTime}h</div>
                    <div>Assignee: {step.assignee || 'Unassigned'}</div>
                    {step.actualTime && <div>Actual: {step.actualTime}h</div>}
                    {step.prerequisites.length > 0 && (
                      <div>Prerequisites: {step.prerequisites.length}</div>
                    )}
                  </div>
                </div>
                <div className="flex-shrink-0">
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="p-6">
      {currentMode.mode === 'traditional' && renderTraditionalView()}
      {currentMode.mode === 'assisted' && renderAssistedView()}
      {currentMode.mode === 'autonomous' && renderAutonomousView()}
      {selectedWorkflow && renderWorkflowDetails()}
    </div>
  )
}