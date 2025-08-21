'use client'

import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useNavigationStoreRefactored } from '@/stores/navigation-store-refactored'
import { aiRiskEngine, RiskAnalysisUtils } from '@/lib/ai-risk-engine'
import { 
  Brain,
  Zap,
  Target,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertTriangle,
  Play,
  Pause,
  Settings,
  Download,
  RefreshCw,
  BarChart3,
  FileText,
  Users,
  Shield,
  Lightbulb
} from 'lucide-react'

interface AIAutomationHubProps {
  projectId: string
}

export function AIAutomationHub({ projectId }: AIAutomationHubProps) {
  const { currentMode, addRecommendation, addInsight } = useNavigationStoreRefactored()
  const [automationStatus, setAutomationStatus] = React.useState<'running' | 'paused' | 'stopped'>('running')
  const [analysisProgress, setAnalysisProgress] = React.useState(0)

  // AI Automation Workflows
  const [workflows] = React.useState([
    {
      id: 'risk-analysis',
      name: 'Risk Analysis Automation',
      description: 'Continuously analyze documents and identify potential risk factors',
      status: 'active' as const,
      confidence: 0.92,
      itemsProcessed: 47,
      itemsTotal: 52,
      timeSaved: 4.5,
      lastRun: new Date('2025-07-21T11:30:00'),
      findings: [
        'Customer concentration risk detected in sales data',
        'EBITDA margin decline pattern identified',
        '3 regulatory compliance gaps found'
      ]
    },
    {
      id: 'document-extraction',
      name: 'Document Data Extraction',
      description: 'Extract key metrics and data points from uploaded documents',
      status: 'active' as const,
      confidence: 0.89,
      itemsProcessed: 15,
      itemsTotal: 18,
      timeSaved: 6.2,
      lastRun: new Date('2025-07-21T10:15:00'),
      findings: [
        'Financial ratios extracted from 8 documents',
        'Customer data consolidated from 3 sources',
        'Management projections captured and structured'
      ]
    },
    {
      id: 'pattern-matching',
      name: 'Deal Pattern Matching',
      description: 'Compare current deal with historical patterns for insights',
      status: 'active' as const,
      confidence: 0.87,
      itemsProcessed: 1,
      itemsTotal: 1,
      timeSaved: 2.1,
      lastRun: new Date('2025-07-21T09:45:00'),
      findings: [
        'Deal structure 87% similar to CloudCo acquisition',
        'Risk profile matches SaaS benchmark patterns',
        'Exit strategy precedents identified'
      ]
    },
    {
      id: 'compliance-check',
      name: 'Compliance Monitoring',
      description: 'Monitor regulatory compliance across all jurisdictions',
      status: 'pending' as const,
      confidence: 0.0,
      itemsProcessed: 0,
      itemsTotal: 12,
      timeSaved: 0,
      lastRun: null,
      findings: []
    }
  ])

  // AI Insights Dashboard Data
  const [aiMetrics] = React.useState({
    totalTimeSaved: 12.8,
    accuracyRate: 0.91,
    documentsProcessed: 47,
    risksIdentified: 6,
    patternsMatched: 3,
    automationLevel: 0.68,
    confidenceScore: 0.89
  })

  // Real-time AI recommendations
  React.useEffect(() => {
    if (currentMode.mode !== 'traditional') {
      const automationInsights = [
        {
          id: `automation-insight-${projectId}-1`,
          type: 'pattern' as const,
          title: 'Automation Opportunity Identified',
          description: '8 routine tasks can be fully automated, saving an estimated 6.5 hours per week.',
          confidence: 0.94,
          impact: 'high' as const,
          category: 'automation',
          module: 'due-diligence',
          actionable: true,
          actions: [
            {
              id: 'enable-automation',
              label: 'Enable Full Automation',
              description: 'Activate AI workflows for routine DD tasks',
              action: 'ENABLE_AUTOMATION',
              estimatedTimeSaving: 390
            }
          ]
        }
      ]

      automationInsights.forEach(insight => addInsight(insight))

      const automationRecommendations = [
        {
          id: `automation-rec-${projectId}-1`,
          type: 'automation' as const,
          priority: 'high' as const,
          title: 'Upgrade to Advanced AI Analysis',
          description: 'Advanced pattern matching could identify 2-3 additional risk factors with 95% confidence.',
          actions: [
            {
              id: 'upgrade-ai',
              label: 'Upgrade AI Engine',
              action: 'UPGRADE_AI_ENGINE',
              primary: true,
              estimatedTimeSaving: 240
            }
          ],
          confidence: 0.95,
          moduleContext: 'due-diligence',
          timestamp: new Date('2025-07-21T12:45:00')
        }
      ]

      automationRecommendations.forEach(rec => addRecommendation(rec))
    }
  }, [currentMode.mode, projectId, addInsight, addRecommendation])

  // Simulate analysis progress
  React.useEffect(() => {
    if (automationStatus === 'running') {
      const interval = setInterval(() => {
        setAnalysisProgress(prev => {
          const next = prev + 1.5
          return next > 100 ? 0 : next
        })
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [automationStatus])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-50 border-green-200'
      case 'pending': return 'text-orange-600 bg-orange-50 border-orange-200'
      case 'error': return 'text-red-600 bg-red-50 border-red-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const renderTraditionalView = () => (
    <div className="space-y-6">
      <div className="text-center py-12">
        <Brain className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-600 mb-2">AI Automation Available</h3>
        <p className="text-gray-500 mb-4">Enable AI-powered automation to streamline your due diligence process</p>
        <Button className="mr-3">
          <Zap className="w-4 h-4 mr-2" />
          Enable AI Automation
        </Button>
        <Button variant="outline">Learn More</Button>
      </div>
    </div>
  )

  const renderAssistedView = () => (
    <div className="space-y-6">
      {/* AI Control Center */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold flex items-center">
            <Brain className="w-5 h-5 mr-2 text-purple-500" />
            AI Automation Hub
            <Badge variant="ai" className="ml-3">Enhanced</Badge>
          </h2>
          <p className="text-gray-600">Intelligent automation managing your due diligence workflows</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button 
            variant={automationStatus === 'running' ? 'outline' : 'default'}
            size="sm"
            onClick={() => setAutomationStatus(automationStatus === 'running' ? 'paused' : 'running')}
          >
            {automationStatus === 'running' ? (
              <>
                <Pause className="w-4 h-4 mr-2" />
                Pause
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Resume
              </>
            )}
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4 mr-2" />
            Configure
          </Button>
        </div>
      </div>

      {/* AI Performance Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-green-400">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Clock className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-sm font-medium text-gray-600">Time Saved</span>
            </div>
            <div className="text-2xl font-bold text-green-600">{aiMetrics.totalTimeSaved}h</div>
            <div className="text-xs text-green-600">This week</div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-400">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Target className="w-4 h-4 text-blue-500 mr-1" />
              <span className="text-sm font-medium text-gray-600">Accuracy</span>
            </div>
            <div className="text-2xl font-bold text-blue-600">{Math.round(aiMetrics.accuracyRate * 100)}%</div>
            <div className="text-xs text-blue-600">AI Precision</div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-400">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Zap className="w-4 h-4 text-purple-500 mr-1" />
              <span className="text-sm font-medium text-gray-600">Automation</span>
            </div>
            <div className="text-2xl font-bold text-purple-600">{Math.round(aiMetrics.automationLevel * 100)}%</div>
            <div className="text-xs text-purple-600">Tasks Automated</div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-400">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <BarChart3 className="w-4 h-4 text-orange-500 mr-1" />
              <span className="text-sm font-medium text-gray-600">Analysis</span>
            </div>
            <div className="text-2xl font-bold text-orange-600">{Math.round(analysisProgress)}%</div>
            <div className="text-xs text-orange-600">Current Progress</div>
          </CardContent>
        </Card>
      </div>

      {/* Real-time Status */}
      <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-blue-50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`w-3 h-3 rounded-full ${automationStatus === 'running' ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
              <div>
                <h3 className="font-semibold text-purple-800">
                  AI Engine Status: {automationStatus === 'running' ? 'Active' : 'Paused'}
                </h3>
                <p className="text-sm text-purple-600">
                  {automationStatus === 'running' 
                    ? `Processing documents and analyzing patterns - ${Math.round(analysisProgress)}% complete`
                    : 'AI automation paused - click resume to continue processing'
                  }
                </p>
              </div>
            </div>
            <Badge variant="ai">
              <Brain className="w-3 h-3 mr-1" />
              {Math.round(aiMetrics.confidenceScore * 100)}% Confident
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Workflow Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Lightbulb className="w-5 h-5 mr-2 text-yellow-500" />
              Active Workflows
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {workflows.map((workflow) => (
                <div key={workflow.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-medium">{workflow.name}</h4>
                        <Badge className={`text-xs ${getStatusColor(workflow.status)}`}>
                          {workflow.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{workflow.description}</p>
                      
                      {workflow.status === 'active' && (
                        <div className="text-xs text-gray-500 mb-2">
                          Progress: {workflow.itemsProcessed}/{workflow.itemsTotal} items
                          {workflow.timeSaved > 0 && (
                            <span className="text-green-600 ml-2">⏱ Saved {workflow.timeSaved}h</span>
                          )}
                        </div>
                      )}
                    </div>
                    
                    <div className="text-right">
                      {workflow.confidence > 0 && (
                        <div className="text-sm font-medium">{Math.round(workflow.confidence * 100)}%</div>
                      )}
                      <div className="text-xs text-gray-500">confidence</div>
                    </div>
                  </div>
                  
                  {workflow.findings.length > 0 && (
                    <div className="bg-gray-50 p-3 rounded text-sm">
                      <div className="font-medium text-gray-700 mb-1">Recent Findings:</div>
                      <ul className="space-y-1">
                        {workflow.findings.slice(0, 2).map((finding, index) => (
                          <li key={index} className="text-gray-600 flex items-start">
                            <span className="text-blue-500 mr-2">•</span>
                            {finding}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-green-500" />
              Automation Impact
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Time Savings */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Weekly Time Savings</span>
                  <span className="text-sm font-bold text-green-600">{aiMetrics.totalTimeSaved} hours</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full" 
                    style={{ width: `${Math.min(100, (aiMetrics.totalTimeSaved / 20) * 100)}%` }}
                  />
                </div>
                <div className="text-xs text-gray-500 mt-1">Target: 20 hours/week</div>
              </div>

              {/* Accuracy Trends */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">AI Accuracy Rate</span>
                  <span className="text-sm font-bold text-blue-600">{Math.round(aiMetrics.accuracyRate * 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full" 
                    style={{ width: `${aiMetrics.accuracyRate * 100}%` }}
                  />
                </div>
                <div className="text-xs text-gray-500 mt-1">Industry benchmark: 85%</div>
              </div>

              {/* Cost Savings */}
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-medium text-green-800 mb-2">Estimated Monthly Savings</h4>
                <div className="text-2xl font-bold text-green-700">$18,400</div>
                <div className="text-sm text-green-600">
                  Based on {aiMetrics.totalTimeSaved * 4} hours/month at $115/hour
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  const renderAutonomousView = () => (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* AI Automation Command Center */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start space-x-4">
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
              <Brain className="w-4 h-4 text-purple-600" />
            </div>
            <div className="flex-1">
              <div className="bg-purple-50 rounded-lg p-4 mb-4">
                <p className="text-sm mb-2">
                  <strong>AI Automation Update:</strong> Running {workflows.filter(w => w.status === 'active').length} automated workflows with 91% accuracy.
                </p>
                <p className="text-sm">
                  Saved {aiMetrics.totalTimeSaved} hours this week through intelligent automation. All critical risks have been identified and prioritized.
                </p>
              </div>

              {/* Automated Achievements */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                <h4 className="font-medium text-green-800 mb-3">✅ Automated Achievements</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-green-700">
                  <div>• Analyzed {aiMetrics.documentsProcessed} documents</div>
                  <div>• Identified {aiMetrics.risksIdentified} potential risks</div>
                  <div>• Matched {aiMetrics.patternsMatched} deal patterns</div>
                  <div>• Automated {Math.round(aiMetrics.automationLevel * 100)}% of routine tasks</div>
                </div>
              </div>

              {/* AI Insights */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-800 mb-3">🤖 AI Insights & Actions</h4>
                <div className="space-y-3">
                  <div className="bg-white rounded p-3">
                    <h5 className="font-medium">Pattern Match: SaaS Acquisition</h5>
                    <p className="text-sm text-gray-600 mb-2">87% similarity to CloudCo deal (successful exit)</p>
                    <div className="flex space-x-2">
                      <Button size="sm">Apply CloudCo Template</Button>
                      <Button size="sm" variant="outline">View Comparison</Button>
                    </div>
                  </div>
                  <div className="bg-white rounded p-3">
                    <h5 className="font-medium">Risk Analysis Complete</h5>
                    <p className="text-sm text-gray-600 mb-2">Customer concentration requires attention - above threshold</p>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="destructive">Flag as Critical</Button>
                      <Button size="sm" variant="outline">Generate Mitigation Plan</Button>
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

  return (
    <div className="p-6">
      {currentMode.mode === 'traditional' && renderTraditionalView()}
      {currentMode.mode === 'assisted' && renderAssistedView()}
      {currentMode.mode === 'autonomous' && renderAutonomousView()}
    </div>
  )
}