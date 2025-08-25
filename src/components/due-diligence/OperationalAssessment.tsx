'use client'

import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { 
  Settings,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Zap,
  Target,
  CheckCircle,
  AlertTriangle,
  Brain,
  RefreshCw,
  Eye,
  Download,
  Plus,
  ChevronRight,
  Activity,
  Gauge,
  Cog,
  Network,
  Cpu,
  Layers,
  Workflow,
  Loader2
} from 'lucide-react'

interface OperationalAssessmentData {
  id: string;
  project_id: string;
  workspace_id?: string;
  assessment_date: string;
  overall_score: number;
  process_efficiency_score: number;
  digital_maturity_score: number;
  quality_management_score: number;
  supply_chain_score: number;
  automation_readiness_score: number;
  cost_efficiency_score: number;
  scalability_score: number;
  status: 'draft' | 'in_progress' | 'completed' | 'approved';
  assessor_name?: string;
  notes?: string;
  recommendations: any[];
  metrics: any[];
  processes: any[];
  benchmarks: any[];
  created_at: string;
  updated_at: string;
}

interface OperationalAssessmentProps {
  projectId: string
  mode?: 'traditional' | 'assisted' | 'autonomous'
}

export function OperationalAssessment({ projectId, mode = 'assisted' }: OperationalAssessmentProps) {
  const [activeTab, setActiveTab] = React.useState<'overview' | 'processes' | 'opportunities' | 'benchmarks'>('overview')
  const [showDetails, setShowDetails] = React.useState(false)
  const [operationalData, setOperationalData] = React.useState<OperationalAssessmentData | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  // Fetch operational assessment data
  React.useEffect(() => {
    const fetchOperationalData = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const response = await fetch(`/api/due-diligence/${projectId}/operational-assessment`)
        
        if (response.status === 404) {
          // No assessment exists yet, create a default one
          const createResponse = await fetch(`/api/due-diligence/${projectId}/operational-assessment`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              workspace_id: null,
              assessor_name: 'System',
              notes: 'Initial operational assessment',
              recommendations: []
            })
          })
          
          if (createResponse.ok) {
            const newData = await createResponse.json()
            setOperationalData(newData)
          } else {
            setError('Failed to create operational assessment')
          }
        } else if (response.ok) {
          const data = await response.json()
          setOperationalData(data)
        } else {
          setError('Failed to fetch operational assessment')
        }
      } catch (err) {
        console.error('Error fetching operational data:', err)
        setError('Failed to load operational assessment')
      } finally {
        setLoading(false)
      }
    }

    fetchOperationalData()
  }, [projectId])

  // Update assessment scores
  const updateAssessment = async (updates: Partial<OperationalAssessmentData>) => {
    if (!operationalData) return

    try {
      const response = await fetch(`/api/due-diligence/${projectId}/operational-assessment`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates)
      })

      if (response.ok) {
        const updatedData = await response.json()
        setOperationalData(updatedData)
      } else {
        setError('Failed to update assessment')
      }
    } catch (err) {
      console.error('Error updating assessment:', err)
      setError('Failed to update assessment')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-8 h-8 animate-spin" />
        <span className="ml-2">Loading operational assessment...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <p className="text-red-800">{error}</p>
            </div>
            <Button 
              onClick={() => window.location.reload()} 
              className="mt-4"
              variant="outline"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!operationalData) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-gray-600">No operational assessment data available</p>
            <Button 
              onClick={() => window.location.reload()} 
              className="mt-4"
              variant="outline"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Transform database data for display compatibility
  const displayData = {
    operationalMetrics: {
      processEfficiency: operationalData.process_efficiency_score || 0,
      costOptimization: operationalData.cost_efficiency_score || 0,
      qualityScore: operationalData.quality_management_score || 0,
      technologyScore: operationalData.digital_maturity_score || 0,
      supplyChainResilience: operationalData.supply_chain_score || 0,
      operationalScalability: operationalData.scalability_score || 0,
      automationLevel: operationalData.automation_readiness_score || 0,
      digitalMaturity: operationalData.digital_maturity_score || 0
    },
    keyProcesses: operationalData.processes?.map(process => ({
      id: process.id,
      name: process.process_name,
      description: process.description || 'No description available',
      category: process.category,
      maturityLevel: process.maturity_level,
      efficiencyScore: process.efficiency_score || 0,
      automationPotential: process.automation_potential || 0,
      criticalityLevel: process.criticality_level,
      currentState: process.current_state || 'No current state defined',
      targetState: process.target_state || 'No target state defined',
      keyMetrics: [] // TODO: Connect to metrics table
    })) || [],
    inefficiencies: [],
    improvementOpportunities: operationalData.recommendations?.map((rec: any, index: number) => ({
      id: `rec-${index}`,
      title: rec.title || rec.description || 'Improvement Opportunity',
      description: rec.description || rec.title || 'No description available',
      category: rec.category || 'general',
      priority: rec.priority || 'medium',
      estimatedImpact: rec.estimated_impact || 50,
      estimatedCost: rec.estimated_cost || 0,
      estimatedTimeframe: rec.estimated_timeframe || 6,
      expectedROI: rec.expected_roi || 1.0,
      implementationComplexity: rec.implementation_complexity || 'medium',
      relatedProcesses: rec.related_processes || [],
      aiRecommended: rec.ai_generated || false,
      confidenceLevel: rec.confidence_level || 0.5
    })) || [],
    benchmarkComparison: {
      industry: operationalData.benchmarks?.[0]?.industry_sector || 'Not specified',
      companySize: operationalData.benchmarks?.[0]?.company_size_category || 'Not specified',
      geography: operationalData.benchmarks?.[0]?.geographic_region || 'Not specified',
      peers: operationalData.benchmarks?.reduce((acc: any, benchmark: any) => {
        const metricKey = benchmark.metric_name?.toLowerCase().replace(/\s+/g, '') || 'general';
        acc[metricKey] = {
          value: benchmark.benchmark_value || 0,
          percentile: benchmark.percentile_ranking || 50,
          source: benchmark.benchmark_source || 'Unknown source'
        };
        return acc;
      }, {}) || {},
      lastUpdated: operationalData.benchmarks?.[0]?.created_at ? new Date(operationalData.benchmarks[0].created_at) : new Date()
    },
    overallScore: operationalData.overall_score || 0,
    status: operationalData.status,
    assessmentDate: new Date(operationalData.assessment_date),
    assessorName: operationalData.assessor_name
  }

  const renderMetricsOverview = () => (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {Object.entries(displayData.operationalMetrics).map(([key, value]) => {
        const metricNames: Record<string, string> = {
          processEfficiency: 'Process Efficiency',
          costOptimization: 'Cost Optimization',
          qualityScore: 'Quality Score',
          technologyScore: 'Technology Score',
          supplyChainResilience: 'Supply Chain',
          operationalScalability: 'Scalability',
          automationLevel: 'Automation',
          digitalMaturity: 'Digital Maturity'
        }

        // Find benchmark for this metric
        const benchmarkKey = metricNames[key]?.toLowerCase().replace(/\s+/g, '') || key;
        const benchmark = displayData.benchmarkComparison.peers[benchmarkKey];
        const benchmarkValue = benchmark?.value || 0;
        const isAboveBenchmark = value > benchmarkValue;
        const isAtBenchmark = Math.abs(value - benchmarkValue) <= 2;
        
        const getScoreColor = (score: number, benchmark?: number) => {
          if (!benchmark) {
            if (score >= 80) return 'text-green-600 bg-green-50'
            if (score >= 60) return 'text-yellow-600 bg-yellow-50'
            return 'text-red-600 bg-red-50'
          }
          // Color based on benchmark comparison
          if (score > benchmark + 5) return 'text-green-600 bg-green-50'
          if (score > benchmark - 5) return 'text-blue-600 bg-blue-50'
          return 'text-orange-600 bg-orange-50'
        }

        const getBenchmarkIcon = () => {
          if (!benchmark) return null;
          if (isAboveBenchmark) return <TrendingUp className="w-3 h-3 text-green-500" />;
          if (isAtBenchmark) return <Activity className="w-3 h-3 text-blue-500" />;
          return <TrendingDown className="w-3 h-3 text-orange-500" />;
        }

        return (
          <Card key={key} className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">{metricNames[key]}</span>
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${getScoreColor(value, benchmarkValue)}`}>
                {value}%
              </div>
            </div>
            <div className="mb-2">
              <Progress value={value} className="h-2" />
              {benchmark && (
                <div className="mt-1 flex items-center justify-between text-xs text-gray-500">
                  <span>Benchmark: {benchmarkValue}%</span>
                  <div className="flex items-center space-x-1">
                    {getBenchmarkIcon()}
                    <span className={
                      isAboveBenchmark ? 'text-green-600' : 
                      isAtBenchmark ? 'text-blue-600' : 'text-orange-600'
                    }>
                      {isAboveBenchmark ? `+${(value - benchmarkValue).toFixed(0)}` :
                       isAtBenchmark ? 'At benchmark' :
                       `${(value - benchmarkValue).toFixed(0)}`}
                    </span>
                  </div>
                </div>
              )}
            </div>
            {benchmark && (
              <div className="text-xs text-gray-400">
                {benchmark.source} • {benchmark.percentile}th percentile
              </div>
            )}
          </Card>
        )
      })}
    </div>
  )

  const renderProcessList = () => (
    <div className="space-y-4">
      {displayData.keyProcesses.length === 0 ? (
        <Card className="p-6 text-center">
          <div className="flex flex-col items-center space-y-4">
            <div className="p-3 bg-gray-100 rounded-full">
              <Workflow className="w-8 h-8 text-gray-400" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">No Processes Defined</h3>
              <p className="text-sm text-gray-600 mt-1">Add operational processes to begin assessment</p>
            </div>
            <Button size="sm" className="mt-2">
              <Plus className="w-4 h-4 mr-2" />
              Add Process
            </Button>
          </div>
        </Card>
      ) : (
        displayData.keyProcesses.map((process) => (
        <Card key={process.id} className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Workflow className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <h4 className="font-medium">{process.name}</h4>
                <p className="text-sm text-gray-600">{process.description}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant={process.criticalityLevel === 'critical' ? 'destructive' : 'secondary'}>
                {process.criticalityLevel}
              </Badge>
              <Badge variant="outline">{process.maturityLevel}</Badge>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Efficiency Score</span>
              <div className="flex items-center space-x-2">
                <Progress value={process.efficiencyScore} className="w-16 h-2" />
                <span className="text-sm font-medium">{process.efficiencyScore}%</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Automation Potential</span>
              <div className="flex items-center space-x-2">
                <Progress value={process.automationPotential} className="w-16 h-2" />
                <span className="text-sm font-medium">{process.automationPotential}%</span>
              </div>
            </div>
          </div>

          {process.keyMetrics && process.keyMetrics.length > 0 && (
            <div className="border-t pt-3">
              <h5 className="text-sm font-medium mb-2">Key Metrics</h5>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {process.keyMetrics.map((metric, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div>
                      <div className="text-sm font-medium">{metric.name}</div>
                      <div className="text-xs text-gray-600">Benchmark: {metric.benchmark} {metric.unit}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">{metric.value} {metric.unit}</div>
                      <div className="flex items-center text-xs">
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
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>
      ))
      )}
    </div>
  )

  const renderImprovementOpportunities = () => (
    <div className="space-y-4">
      {displayData.improvementOpportunities.length === 0 ? (
        <Card className="p-6 text-center">
          <div className="flex flex-col items-center space-y-4">
            <div className="p-3 bg-gray-100 rounded-full">
              <Target className="w-8 h-8 text-gray-400" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">No Improvement Opportunities</h3>
              <p className="text-sm text-gray-600 mt-1">Complete process assessment to identify opportunities</p>
            </div>
            <Button size="sm" className="mt-2">
              <Plus className="w-4 h-4 mr-2" />
              Add Opportunity
            </Button>
          </div>
        </Card>
      ) : (
        displayData.improvementOpportunities.map((opportunity) => (
        <Card key={opportunity.id} className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Target className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <h4 className="font-medium">{opportunity.title}</h4>
                <p className="text-sm text-gray-600">{opportunity.description}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant={opportunity.priority === 'high' ? 'destructive' : 'secondary'}>
                {opportunity.priority}
              </Badge>
              {opportunity.aiRecommended && (
                <Badge variant="ai" className="text-xs">
                  <Brain className="w-3 h-3 mr-1" />
                  AI
                </Badge>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-3">
            <div className="text-center p-2 bg-blue-50 rounded">
              <div className="text-lg font-bold text-blue-600">{opportunity.estimatedImpact}%</div>
              <div className="text-xs text-blue-700">Expected Impact</div>
            </div>
            <div className="text-center p-2 bg-green-50 rounded">
              <div className="text-lg font-bold text-green-600">{opportunity.expectedROI.toFixed(1)}x</div>
              <div className="text-xs text-green-700">Expected ROI</div>
            </div>
            <div className="text-center p-2 bg-blue-50 rounded">
              <div className="text-lg font-bold text-blue-600">${(opportunity.estimatedCost / 1000).toFixed(0)}K</div>
              <div className="text-xs text-blue-700">Investment</div>
            </div>
            <div className="text-center p-2 bg-orange-50 rounded">
              <div className="text-lg font-bold text-orange-600">{opportunity.estimatedTimeframe}mo</div>
              <div className="text-xs text-orange-700">Timeline</div>
            </div>
          </div>

          {opportunity.aiRecommended && opportunity.confidenceLevel && (
            <div className="flex items-center justify-between text-sm text-gray-600 pt-2 border-t">
              <span>AI Confidence Level</span>
              <div className="flex items-center space-x-2">
                <Progress value={opportunity.confidenceLevel * 100} className="w-16 h-2" />
                <span className="font-medium">{Math.round(opportunity.confidenceLevel * 100)}%</span>
              </div>
            </div>
          )}
        </Card>
      ))
      )}
    </div>
  )

  const renderBenchmarkComparison = () => (
    <Card className="p-4">
      <h4 className="font-medium mb-4">Industry Benchmark Comparison</h4>
      <div className="space-y-4">
        {Object.entries(displayData.benchmarkComparison.peers).map(([key, benchmark]) => {
          const currentValue = displayData.operationalMetrics[key as keyof typeof displayData.operationalMetrics]
          const performance = currentValue > benchmark.value ? 'above' : currentValue < benchmark.value ? 'below' : 'at'
          
          return (
            <div key={key} className="flex items-center justify-between p-3 border rounded">
              <div>
                <div className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</div>
                <div className="text-sm text-gray-600">Industry Average: {benchmark.value}% ({benchmark.percentile}th percentile)</div>
              </div>
              <div className="text-right">
                <div className="font-medium">{currentValue}%</div>
                <div className={`text-sm flex items-center ${
                  performance === 'above' ? 'text-green-600' : 
                  performance === 'below' ? 'text-red-600' : 'text-gray-600'
                }`}>
                  {performance === 'above' ? (
                    <TrendingUp className="w-3 h-3 mr-1" />
                  ) : performance === 'below' ? (
                    <TrendingDown className="w-3 h-3 mr-1" />
                  ) : (
                    <Activity className="w-3 h-3 mr-1" />
                  )}
                  {Math.abs(currentValue - benchmark.value)}% {performance} benchmark
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </Card>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Settings className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">Operational Assessment</h2>
            <p className="text-gray-600">Comprehensive operational excellence evaluation</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="text-sm">
            Overall Score: {displayData.overallScore}%
          </Badge>
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
            Update Assessment
          </Button>
        </div>
      </div>

      {/* Metrics Overview */}
      <div>
        <h3 className="text-lg font-medium mb-4">Operational Metrics Overview</h3>
        {renderMetricsOverview()}
      </div>

      {/* Navigation Tabs */}
      <div className="border-b">
        <nav className="flex space-x-8">
          {[
            { id: 'overview', label: 'Overview', icon: Gauge },
            { id: 'processes', label: 'Key Processes', icon: Workflow },
            { id: 'opportunities', label: 'Improvement Opportunities', icon: Target },
            { id: 'benchmarks', label: 'Benchmarks', icon: BarChart3 }
          ].map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`
                  flex items-center space-x-2 py-3 border-b-2 text-sm font-medium transition-colors
                  ${isActive 
                    ? 'border-blue-500 text-blue-600' 
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

      {/* Tab Content */}
      <div>
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <Card className="p-4">
              <h4 className="font-medium mb-4">Assessment Summary</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{displayData.overallScore}%</div>
                  <div className="text-sm text-blue-700">Overall Operational Score</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{displayData.improvementOpportunities.length}</div>
                  <div className="text-sm text-green-700">Improvement Opportunities</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{operationalData.status?.toUpperCase() || 'DRAFT'}</div>
                  <div className="text-sm text-blue-700">Assessment Confidence</div>
                </div>
              </div>
            </Card>
            {renderBenchmarkComparison()}
          </div>
        )}

        {activeTab === 'processes' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Key Operational Processes</h3>
              <Button size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Process
              </Button>
            </div>
            {renderProcessList()}
          </div>
        )}

        {activeTab === 'opportunities' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Improvement Opportunities</h3>
              <Button size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Opportunity
              </Button>
            </div>
            {renderImprovementOpportunities()}
          </div>
        )}

        {activeTab === 'benchmarks' && (
          <div>
            <h3 className="text-lg font-medium mb-4">Industry Benchmarks</h3>
            {renderBenchmarkComparison()}
          </div>
        )}
      </div>
    </div>
  )
}