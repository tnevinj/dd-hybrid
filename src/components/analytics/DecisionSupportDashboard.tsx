'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { 
  Brain,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Users,
  Target,
  BarChart3,
  PieChart,
  Activity,
  Lightbulb,
  FileText,
  ArrowRight,
  Calendar,
  DollarSign,
  Shield,
  Zap,
  Filter,
  Search
} from 'lucide-react'

import { 
  DecisionSupportFramework, 
  DecisionContext, 
  DecisionRecommendation, 
  DecisionWorkflow 
} from '@/lib/analytics/decision-support-framework'

interface DecisionSupportDashboardProps {
  mode?: 'traditional' | 'assisted' | 'autonomous'
}

export function DecisionSupportDashboard({ mode = 'traditional' }: DecisionSupportDashboardProps) {
  const [framework] = useState(new DecisionSupportFramework())
  const [activeDecisions, setActiveDecisions] = useState<DecisionRecommendation[]>([])
  const [workflowStatus, setWorkflowStatus] = useState<any[]>([])
  const [analytics, setAnalytics] = useState<any>({})
  const [selectedDecisionType, setSelectedDecisionType] = useState<string>('investment')
  const [isGeneratingRecommendation, setIsGeneratingRecommendation] = useState(false)

  useEffect(() => {
    loadDecisionAnalytics()
    loadActiveWorkflows()
  }, [])

  const loadDecisionAnalytics = async () => {
    const analyticsData = framework.getDecisionAnalytics()
    setAnalytics(analyticsData)
  }

  const loadActiveWorkflows = async () => {
    const workflows = [
      {
        id: 'wf-1',
        name: 'TechCorp Investment Decision',
        type: 'investment',
        currentStep: 'due-diligence',
        progress: 65,
        urgency: 'high',
        deadline: '2024-01-15',
        stakeholders: ['Deal Partner', 'IC Member', 'Legal Counsel']
      },
      {
        id: 'wf-2',
        name: 'RetailCo Exit Strategy',
        type: 'exit',
        currentStep: 'exit-readiness',
        progress: 30,
        urgency: 'medium',
        deadline: '2024-02-01',
        stakeholders: ['Portfolio Manager', 'Investment Director']
      },
      {
        id: 'wf-3',
        name: 'Fund Risk Assessment',
        type: 'risk-management',
        currentStep: 'risk-analysis',
        progress: 85,
        urgency: 'critical',
        deadline: '2024-01-10',
        stakeholders: ['Risk Committee', 'Managing Director']
      }
    ]
    setWorkflowStatus(workflows)
  }

  const generateRecommendation = async () => {
    setIsGeneratingRecommendation(true)
    
    const context: DecisionContext = {
      dealId: 'techcorp-acquisition',
      moduleContext: 'investment-committee',
      decisionType: selectedDecisionType as any,
      urgency: 'high',
      stakeholders: ['Deal Partner', 'IC Members', 'Managing Director'],
      dataInputs: {
        irr: 22.5,
        riskScore: 3.2,
        dealValue: 250000000,
        marketTiming: 'favorable',
        complianceScore: 'Green',
        efficiency: 0.87
      }
    }

    try {
      const recommendation = await framework.generateRecommendation(context)
      setActiveDecisions(prev => [recommendation, ...prev.slice(0, 4)]) // Keep last 5
    } catch (error) {
      console.error('Error generating recommendation:', error)
    } finally {
      setIsGeneratingRecommendation(false)
    }
  }

  const formatCurrency = (value: number) => {
    if (value >= 1000000000) return `$${(value / 1000000000).toFixed(1)}B`
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`
    return `$${(value / 1000).toFixed(0)}K`
  }

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'critical': return 'text-red-600 bg-red-100'
      case 'high': return 'text-orange-600 bg-orange-100'
      case 'medium': return 'text-yellow-600 bg-yellow-100'
      default: return 'text-green-600 bg-green-100'
    }
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600'
    if (confidence >= 0.6) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Brain className="h-8 w-8 mr-3 text-blue-600" />
            Decision Support Framework
          </h1>
          <p className="text-gray-600 mt-1">AI-powered investment decision intelligence and workflow automation</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button onClick={generateRecommendation} disabled={isGeneratingRecommendation} className="flex items-center space-x-2">
            <Lightbulb className="h-4 w-4" />
            <span>{isGeneratingRecommendation ? 'Generating...' : 'Generate Recommendation'}</span>
          </Button>
          <select 
            value={selectedDecisionType}
            onChange={(e) => setSelectedDecisionType(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="investment">Investment Decision</option>
            <option value="exit">Exit Strategy</option>
            <option value="risk-management">Risk Management</option>
            <option value="compliance">Compliance</option>
            <option value="operational">Operational</option>
            <option value="strategic">Strategic</option>
          </select>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-fit grid-cols-4">
          <TabsTrigger value="overview">Decision Overview</TabsTrigger>
          <TabsTrigger value="recommendations">Active Recommendations</TabsTrigger>
          <TabsTrigger value="workflows">Decision Workflows</TabsTrigger>
          <TabsTrigger value="analytics">Performance Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          {/* Key Decision Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Active Decisions</CardTitle>
                <Activity className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{workflowStatus.length}</div>
                <p className="text-xs text-gray-600">Across all modules</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Decision Accuracy</CardTitle>
                <Target className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.successRate ? (analytics.successRate * 100).toFixed(1) : '85.0'}%</div>
                <p className="text-xs text-gray-600">Historical success rate</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Avg. Confidence</CardTitle>
                <Shield className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.averageConfidence ? (analytics.averageConfidence * 100).toFixed(0) : '78'}%</div>
                <p className="text-xs text-gray-600">Recommendation confidence</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Critical Decisions</CardTitle>
                <AlertTriangle className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{workflowStatus.filter(w => w.urgency === 'critical').length}</div>
                <p className="text-xs text-gray-600">Requiring immediate action</p>
              </CardContent>
            </Card>
          </div>

          {/* Active Decision Workflows */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-blue-600" />
                  Active Decision Workflows
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {workflowStatus.map((workflow) => (
                  <div key={workflow.id} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-semibold text-gray-900">{workflow.name}</h4>
                        <p className="text-sm text-gray-600">{workflow.type} • {workflow.currentStep}</p>
                      </div>
                      <Badge className={getUrgencyColor(workflow.urgency)}>
                        {workflow.urgency}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{workflow.progress}%</span>
                      </div>
                      <Progress value={workflow.progress} className="h-2" />
                      <div className="flex justify-between text-xs text-gray-600">
                        <span>Deadline: {workflow.deadline}</span>
                        <span>{workflow.stakeholders.length} stakeholders</span>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
                  Decision Impact Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Financial Impact</span>
                      <span className="font-semibold">{analytics.averageImpact?.financial?.toFixed(1) || '8.2'}/10</span>
                    </div>
                    <Progress value={(analytics.averageImpact?.financial || 8.2) * 10} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Operational Impact</span>
                      <span className="font-semibold">{analytics.averageImpact?.operational?.toFixed(1) || '7.5'}/10</span>
                    </div>
                    <Progress value={(analytics.averageImpact?.operational || 7.5) * 10} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Strategic Impact</span>
                      <span className="font-semibold">{analytics.averageImpact?.strategic?.toFixed(1) || '8.8'}/10</span>
                    </div>
                    <Progress value={(analytics.averageImpact?.strategic || 8.8) * 10} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="recommendations" className="mt-6">
          <div className="space-y-6">
            {activeDecisions.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Brain className="h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">No Active Recommendations</h3>
                  <p className="text-gray-600 text-center mb-4">Generate a recommendation to see AI-powered decision analysis</p>
                  <Button onClick={generateRecommendation} disabled={isGeneratingRecommendation}>
                    <Lightbulb className="h-4 w-4 mr-2" />
                    Generate Recommendation
                  </Button>
                </CardContent>
              </Card>
            ) : (
              activeDecisions.map((decision) => (
                <Card key={decision.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="flex items-center">
                          <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
                          Decision Recommendation
                        </CardTitle>
                        <p className="text-sm text-gray-600 mt-1">Generated {new Date().toLocaleDateString()}</p>
                      </div>
                      <Badge className={`${getConfidenceColor(decision.confidence)} bg-opacity-10`}>
                        {(decision.confidence * 100).toFixed(0)}% Confidence
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {/* Main Recommendation */}
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <h4 className="font-semibold text-blue-900 mb-2">Recommendation</h4>
                        <p className="text-blue-800">{decision.recommendation}</p>
                      </div>

                      {/* Supporting Evidence */}
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Supporting Evidence</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {decision.supportingEvidence.map((evidence, idx) => (
                            <div key={idx} className="p-3 border rounded-lg">
                              <div className="flex justify-between items-center mb-1">
                                <span className="font-medium text-sm">{evidence.source}</span>
                                <Badge variant="outline" className="text-xs">
                                  {(evidence.weight * 100).toFixed(0)}% weight
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-600">{evidence.metric}: {evidence.value}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Key Risks */}
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Key Risks</h4>
                        <div className="space-y-2">
                          {decision.risks.map((risk, idx) => (
                            <div key={idx} className="p-3 bg-red-50 rounded-lg">
                              <div className="flex justify-between items-center mb-1">
                                <span className="font-medium text-red-900">{risk.type}</span>
                                <Badge variant="outline" className="text-red-600">
                                  {(risk.probability * 100).toFixed(0)}% probability
                                </Badge>
                              </div>
                              <p className="text-sm text-red-700 mb-2">{risk.impact}</p>
                              <p className="text-xs text-red-600">Mitigation: {risk.mitigation}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Action Timeline */}
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Action Timeline</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <h5 className="font-medium text-gray-700 mb-2">Immediate (0-7 days)</h5>
                            <ul className="text-sm text-gray-600 space-y-1">
                              {decision.timeline.immediate.map((item, idx) => (
                                <li key={idx} className="flex items-center">
                                  <ArrowRight className="h-3 w-3 mr-2" />
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h5 className="font-medium text-gray-700 mb-2">Short-term (1-4 weeks)</h5>
                            <ul className="text-sm text-gray-600 space-y-1">
                              {decision.timeline.shortTerm.map((item, idx) => (
                                <li key={idx} className="flex items-center">
                                  <ArrowRight className="h-3 w-3 mr-2" />
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h5 className="font-medium text-gray-700 mb-2">Long-term (1+ months)</h5>
                            <ul className="text-sm text-gray-600 space-y-1">
                              {decision.timeline.longTerm.map((item, idx) => (
                                <li key={idx} className="flex items-center">
                                  <ArrowRight className="h-3 w-3 mr-2" />
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="workflows" className="mt-6">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Decision Workflow Management</CardTitle>
                <p className="text-sm text-gray-600">Monitor and manage decision workflows across all modules</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {workflowStatus.map((workflow) => (
                    <div key={workflow.id} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="font-semibold text-gray-900">{workflow.name}</h4>
                          <p className="text-sm text-gray-600 capitalize">{workflow.type} decision workflow</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={getUrgencyColor(workflow.urgency)}>
                            {workflow.urgency}
                          </Badge>
                          <Button variant="outline" size="sm">
                            <FileText className="h-4 w-4 mr-2" />
                            View Details
                          </Button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <h5 className="font-medium text-gray-700 mb-2">Progress</h5>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Current Step: {workflow.currentStep}</span>
                              <span>{workflow.progress}%</span>
                            </div>
                            <Progress value={workflow.progress} className="h-2" />
                          </div>
                        </div>
                        
                        <div>
                          <h5 className="font-medium text-gray-700 mb-2">Timeline</h5>
                          <div className="flex items-center text-sm text-gray-600">
                            <Calendar className="h-4 w-4 mr-2" />
                            <span>Due: {workflow.deadline}</span>
                          </div>
                        </div>
                        
                        <div>
                          <h5 className="font-medium text-gray-700 mb-2">Stakeholders</h5>
                          <div className="flex items-center text-sm text-gray-600">
                            <Users className="h-4 w-4 mr-2" />
                            <span>{workflow.stakeholders.join(', ')}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2 text-blue-600" />
                  Decision Performance Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Total Decisions</span>
                    <span className="font-semibold">{analytics.totalDecisions || 24}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Success Rate</span>
                    <span className="font-semibold">{analytics.successRate ? (analytics.successRate * 100).toFixed(1) : '85.0'}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Average Confidence</span>
                    <span className="font-semibold">{analytics.averageConfidence ? (analytics.averageConfidence * 100).toFixed(0) : '78'}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Time Saved</span>
                    <span className="font-semibold">156 hours</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <PieChart className="h-5 w-5 mr-2 text-green-600" />
                  Decision Types Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>Investment Decisions</span>
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{width: '65%'}}></div>
                      </div>
                      <span className="text-sm">65%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Exit Decisions</span>
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                        <div className="bg-green-600 h-2 rounded-full" style={{width: '20%'}}></div>
                      </div>
                      <span className="text-sm">20%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Risk Management</span>
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                        <div className="bg-red-600 h-2 rounded-full" style={{width: '15%'}}></div>
                      </div>
                      <span className="text-sm">15%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default DecisionSupportDashboard