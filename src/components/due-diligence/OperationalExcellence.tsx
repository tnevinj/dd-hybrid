'use client'

import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { 
  TrendingUp,
  TrendingDown,
  BarChart3,
  Target,
  CheckCircle,
  AlertTriangle,
  Brain,
  Zap,
  Clock,
  DollarSign,
  Users,
  Cog,
  Workflow,
  LineChart,
  PieChart,
  Activity,
  ArrowRight,
  Plus,
  Filter,
  Download,
  RefreshCw
} from 'lucide-react'
import { 
  OperationalProcess,
  OperationalInefficiency,
  ImprovementOpportunity,
  ProcessMetric 
} from '@/types/due-diligence'

interface OperationalExcellenceProps {
  projectId: string
  mode?: 'traditional' | 'assisted' | 'autonomous'
}

export function OperationalExcellence({ projectId, mode = 'assisted' }: OperationalExcellenceProps) {
  const [selectedProcess, setSelectedProcess] = React.useState<string | null>(null)
  const [viewMode, setViewMode] = React.useState<'processes' | 'inefficiencies' | 'value-streams'>('processes')
  const [filterCategory, setFilterCategory] = React.useState<'all' | 'core' | 'support' | 'strategic'>('all')

  // Mock operational excellence data
  const processes: OperationalProcess[] = [
    {
      id: 'proc-001',
      name: 'Customer Onboarding',
      description: 'End-to-end customer acquisition and setup process',
      category: 'core',
      maturityLevel: 'managed',
      efficiencyScore: 82,
      automationPotential: 95,
      criticalityLevel: 'critical',
      currentState: 'Semi-automated with manual verification steps',
      targetState: 'Fully automated with AI-powered verification',
      keyMetrics: [
        { name: 'Onboarding Time', value: 3.5, unit: 'days', benchmark: 2.0, trend: 'improving' },
        { name: 'Drop-off Rate', value: 8.2, unit: '%', benchmark: 5.0, trend: 'stable' },
        { name: 'First Value Time', value: 7, unit: 'days', benchmark: 5, trend: 'improving' },
        { name: 'Support Tickets', value: 0.8, unit: 'per customer', benchmark: 0.5, trend: 'declining' }
      ]
    },
    {
      id: 'proc-002',
      name: 'Revenue Recognition',
      description: 'Financial revenue processing and recognition workflows',
      category: 'support',
      maturityLevel: 'optimized',
      efficiencyScore: 94,
      automationPotential: 85,
      criticalityLevel: 'critical',
      currentState: 'Fully automated with monthly reconciliation',
      keyMetrics: [
        { name: 'Processing Time', value: 2, unit: 'hours', benchmark: 4, trend: 'stable' },
        { name: 'Accuracy Rate', value: 99.8, unit: '%', benchmark: 99.5, trend: 'improving' },
        { name: 'Month-end Close', value: 2, unit: 'days', benchmark: 3, trend: 'stable' }
      ]
    },
    {
      id: 'proc-003',
      name: 'Product Development Lifecycle',
      description: 'Feature development from concept to deployment',
      category: 'strategic',
      maturityLevel: 'defined',
      efficiencyScore: 71,
      automationPotential: 78,
      criticalityLevel: 'high',
      currentState: 'Agile methodology with manual testing phases',
      targetState: 'DevOps with automated testing and deployment',
      keyMetrics: [
        { name: 'Development Velocity', value: 42, unit: 'story points/sprint', benchmark: 55, trend: 'improving' },
        { name: 'Bug Rate', value: 3.2, unit: 'bugs/feature', benchmark: 2.0, trend: 'stable' },
        { name: 'Time to Market', value: 6, unit: 'weeks', benchmark: 4, trend: 'declining' },
        { name: 'Feature Adoption', value: 67, unit: '%', benchmark: 80, trend: 'improving' }
      ]
    },
    {
      id: 'proc-004',
      name: 'Customer Support',
      description: 'Customer issue resolution and support management',
      category: 'core',
      maturityLevel: 'developing',
      efficiencyScore: 65,
      automationPotential: 88,
      criticalityLevel: 'high',
      currentState: 'Ticket-based system with manual routing',
      targetState: 'AI-powered triage and automated resolution',
      keyMetrics: [
        { name: 'First Response Time', value: 4.2, unit: 'hours', benchmark: 2.0, trend: 'stable' },
        { name: 'Resolution Time', value: 18, unit: 'hours', benchmark: 12, trend: 'improving' },
        { name: 'Customer Satisfaction', value: 4.1, unit: '/5', benchmark: 4.5, trend: 'improving' },
        { name: 'Self-Service Rate', value: 32, unit: '%', benchmark: 60, trend: 'improving' }
      ]
    }
  ]

  const inefficiencies: OperationalInefficiency[] = [
    {
      id: 'ineff-001',
      processId: 'proc-001',
      type: 'manual_process',
      description: 'Manual document verification during customer onboarding',
      impact: 'high',
      estimatedCost: 45000,
      frequency: 'frequent',
      rootCause: 'Legacy compliance requirements',
      identifiedBy: 'Process Analysis',
      identifiedDate: new Date('2024-01-15')
    },
    {
      id: 'ineff-002',
      processId: 'proc-003',
      type: 'bottleneck',
      description: 'Manual code review process causing deployment delays',
      impact: 'medium',
      estimatedCost: 32000,
      frequency: 'frequent',
      rootCause: 'Limited automation in CI/CD pipeline',
      identifiedBy: 'Development Team',
      identifiedDate: new Date('2024-01-20')
    },
    {
      id: 'ineff-003',
      processId: 'proc-004',
      type: 'redundancy',
      description: 'Duplicate data entry across support and CRM systems',
      impact: 'medium',
      estimatedCost: 28000,
      frequency: 'constant',
      rootCause: 'System integration gaps',
      identifiedBy: 'Support Team',
      identifiedDate: new Date('2024-01-10')
    }
  ]

  const valueStreams = [
    {
      id: 'vs-001',
      name: 'Customer Acquisition to Revenue',
      processes: ['proc-001', 'proc-002'],
      totalLeadTime: 10.5,
      valueAddTime: 4.2,
      efficiency: 40,
      bottlenecks: ['Manual verification', 'Credit checks']
    },
    {
      id: 'vs-002',
      name: 'Idea to Market',
      processes: ['proc-003'],
      totalLeadTime: 42,
      valueAddTime: 28,
      efficiency: 67,
      bottlenecks: ['Manual testing', 'Approval workflows']
    },
    {
      id: 'vs-003',
      name: 'Issue to Resolution',
      processes: ['proc-004'],
      totalLeadTime: 18,
      valueAddTime: 8,
      efficiency: 44,
      bottlenecks: ['Manual routing', 'Escalation delays']
    }
  ]

  const filteredProcesses = processes.filter(p => 
    filterCategory === 'all' || p.category === filterCategory
  )

  const renderProcessCard = (process: OperationalProcess) => (
    <Card 
      key={process.id} 
      className={`cursor-pointer transition-all ${
        selectedProcess === process.id ? 'ring-2 ring-blue-500' : ''
      }`}
      onClick={() => setSelectedProcess(selectedProcess === process.id ? null : process.id)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Workflow className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-base">{process.name}</CardTitle>
              <p className="text-sm text-gray-600">{process.description}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant={process.category === 'core' ? 'default' : 'secondary'}>
              {process.category}
            </Badge>
            <Badge variant={process.criticalityLevel === 'critical' ? 'destructive' : 'outline'}>
              {process.criticalityLevel}
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {/* Efficiency Metrics */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-gray-600">Efficiency Score</span>
                <span className="text-sm font-medium">{process.efficiencyScore}%</span>
              </div>
              <Progress value={process.efficiencyScore} className="h-2" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-gray-600">Automation Potential</span>
                <span className="text-sm font-medium">{process.automationPotential}%</span>
              </div>
              <Progress value={process.automationPotential} className="h-2" />
            </div>
          </div>

          {/* Maturity Level */}
          <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
            <span className="text-sm text-gray-600">Maturity Level</span>
            <Badge variant="outline">{process.maturityLevel}</Badge>
          </div>

          {/* Key Metrics Preview */}
          <div className="grid grid-cols-2 gap-2">
            {process.keyMetrics.slice(0, 4).map((metric, index) => (
              <div key={index} className="text-center p-2 border rounded">
                <div className="text-xs text-gray-600">{metric.name}</div>
                <div className="font-medium">{metric.value} {metric.unit}</div>
                <div className="flex items-center justify-center text-xs mt-1">
                  {metric.trend === 'improving' ? (
                    <TrendingUp className="w-3 h-3 text-green-500 mr-1" />
                  ) : metric.trend === 'declining' ? (
                    <TrendingDown className="w-3 h-3 text-red-500 mr-1" />
                  ) : (
                    <Activity className="w-3 h-3 text-gray-500 mr-1" />
                  )}
                  <span className={`${
                    metric.trend === 'improving' ? 'text-green-600' : 
                    metric.trend === 'declining' ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    {metric.trend}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Expanded Details */}
          {selectedProcess === process.id && (
            <div className="pt-4 border-t space-y-4">
              <div>
                <h5 className="text-sm font-medium mb-2">Current vs Target State</h5>
                <div className="space-y-2">
                  <div className="p-2 bg-yellow-50 rounded border-l-4 border-yellow-400">
                    <div className="text-xs text-yellow-700 font-medium">Current State</div>
                    <div className="text-sm">{process.currentState}</div>
                  </div>
                  {process.targetState && (
                    <div className="p-2 bg-green-50 rounded border-l-4 border-green-400">
                      <div className="text-xs text-green-700 font-medium">Target State</div>
                      <div className="text-sm">{process.targetState}</div>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h5 className="text-sm font-medium mb-2">Detailed Metrics</h5>
                <div className="space-y-2">
                  {process.keyMetrics.map((metric, index) => (
                    <div key={index} className="flex items-center justify-between p-2 border rounded">
                      <div>
                        <div className="font-medium">{metric.name}</div>
                        <div className="text-sm text-gray-600">Benchmark: {metric.benchmark} {metric.unit}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{metric.value} {metric.unit}</div>
                        <div className="flex items-center text-sm">
                          {metric.trend === 'improving' ? (
                            <TrendingUp className="w-3 h-3 text-green-500 mr-1" />
                          ) : metric.trend === 'declining' ? (
                            <TrendingDown className="w-3 h-3 text-red-500 mr-1" />
                          ) : (
                            <Activity className="w-3 h-3 text-gray-500 mr-1" />
                          )}
                          <span className={`${
                            metric.trend === 'improving' ? 'text-green-600' : 
                            metric.trend === 'declining' ? 'text-red-600' : 'text-gray-600'
                          }`}>
                            vs benchmark: {metric.value > metric.benchmark ? '+' : ''}{(metric.value - metric.benchmark).toFixed(1)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )

  const renderInefficiencies = () => (
    <div className="space-y-4">
      {inefficiencies.map((inefficiency) => {
        const relatedProcess = processes.find(p => p.id === inefficiency.processId)
        
        return (
          <Card key={inefficiency.id} className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                </div>
                <div>
                  <h4 className="font-medium">{inefficiency.description}</h4>
                  <p className="text-sm text-gray-600">
                    Process: {relatedProcess?.name} • Type: {inefficiency.type.replace('_', ' ')}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant={inefficiency.impact === 'high' ? 'destructive' : 'secondary'}>
                  {inefficiency.impact} impact
                </Badge>
                <Badge variant="outline">{inefficiency.frequency}</Badge>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-3 bg-red-50 rounded">
                <div className="text-lg font-bold text-red-600">${(inefficiency.estimatedCost / 1000).toFixed(0)}K</div>
                <div className="text-xs text-red-700">Annual Cost</div>
              </div>
              <div className="text-center p-3 bg-orange-50 rounded">
                <div className="text-lg font-bold text-orange-600">{inefficiency.frequency}</div>
                <div className="text-xs text-orange-700">Frequency</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded">
                <div className="text-lg font-bold text-gray-600">{inefficiency.identifiedBy}</div>
                <div className="text-xs text-gray-700">Identified By</div>
              </div>
            </div>

            {inefficiency.rootCause && (
              <div className="mt-3 p-2 bg-blue-50 rounded border-l-4 border-blue-400">
                <div className="text-xs text-blue-700 font-medium">Root Cause</div>
                <div className="text-sm">{inefficiency.rootCause}</div>
              </div>
            )}
          </Card>
        )
      })}
    </div>
  )

  const renderValueStreams = () => (
    <div className="space-y-4">
      {valueStreams.map((stream) => (
        <Card key={stream.id} className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <LineChart className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <h4 className="font-medium">{stream.name}</h4>
                <p className="text-sm text-gray-600">
                  {stream.processes.length} processes • {stream.efficiency}% efficiency
                </p>
              </div>
            </div>
            <Badge variant={stream.efficiency > 60 ? 'default' : 'secondary'}>
              {stream.efficiency}% efficient
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="text-center p-3 bg-blue-50 rounded">
              <div className="text-lg font-bold text-blue-600">{stream.totalLeadTime}d</div>
              <div className="text-xs text-blue-700">Total Lead Time</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded">
              <div className="text-lg font-bold text-green-600">{stream.valueAddTime}d</div>
              <div className="text-xs text-green-700">Value-Add Time</div>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded">
              <div className="text-lg font-bold text-purple-600">{stream.efficiency}%</div>
              <div className="text-xs text-purple-700">Efficiency</div>
            </div>
          </div>

          {stream.bottlenecks.length > 0 && (
            <div>
              <h5 className="text-sm font-medium mb-2">Key Bottlenecks</h5>
              <div className="flex flex-wrap gap-2">
                {stream.bottlenecks.map((bottleneck, index) => (
                  <Badge key={index} variant="destructive" className="text-xs">
                    <Clock className="w-3 h-3 mr-1" />
                    {bottleneck}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </Card>
      ))}
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Target className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">Operational Excellence</h2>
            <p className="text-gray-600">Detailed process efficiency and optimization analysis</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {mode === 'assisted' && (
            <Badge variant="ai" className="text-sm">
              <Brain className="w-3 h-3 mr-1" />
              AI Enhanced
            </Badge>
          )}
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Analyze
          </Button>
        </div>
      </div>

      {/* View Mode Tabs */}
      <div className="border-b">
        <nav className="flex space-x-8">
          {[
            { id: 'processes', label: 'Process Analysis', icon: Workflow },
            { id: 'inefficiencies', label: 'Inefficiencies', icon: AlertTriangle },
            { id: 'value-streams', label: 'Value Streams', icon: LineChart }
          ].map((tab) => {
            const Icon = tab.icon
            const isActive = viewMode === tab.id
            
            return (
              <button
                key={tab.id}
                onClick={() => setViewMode(tab.id as any)}
                className={`
                  flex items-center space-x-2 py-3 border-b-2 text-sm font-medium transition-colors
                  ${isActive 
                    ? 'border-purple-500 text-purple-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </nav>
      </div>

      {/* Content */}
      <div>
        {viewMode === 'processes' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Process Analysis</h3>
              <div className="flex items-center space-x-2">
                <select 
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value as any)}
                  className="border rounded px-3 py-1 text-sm"
                >
                  <option value="all">All Categories</option>
                  <option value="core">Core Processes</option>
                  <option value="support">Support Processes</option>
                  <option value="strategic">Strategic Processes</option>
                </select>
                <Button size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Process
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filteredProcesses.map(renderProcessCard)}
            </div>
          </div>
        )}

        {viewMode === 'inefficiencies' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Operational Inefficiencies</h3>
              <Button size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Report Inefficiency
              </Button>
            </div>
            {renderInefficiencies()}
          </div>
        )}

        {viewMode === 'value-streams' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Value Stream Analysis</h3>
              <Button size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Map Value Stream
              </Button>
            </div>
            {renderValueStreams()}
          </div>
        )}
      </div>
    </div>
  )
}