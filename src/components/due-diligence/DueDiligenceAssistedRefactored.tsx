/**
 * Enhanced Due Diligence Assisted Component
 * AI-powered due diligence with predictive analytics and automation
 */

'use client'

import * as React from 'react'
import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import type { AssistedModeProps } from '@/types/shared'
import { 
  Brain,
  Zap,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Users,
  FileText,
  Lightbulb,
  Target,
  ArrowRight,
  Star,
  X,
  Shield,
  Search,
  Plus,
  Eye,
  BarChart3,
  Activity,
  Sparkles,
  Building,
  DollarSign,
  MapPin
} from 'lucide-react'

// Comprehensive mock data with AI enhancements
const mockAIEnhancedDDProjects = [
  {
    id: '1',
    name: 'TechCorp Acquisition',
    targetCompany: 'TechCorp Solutions',
    dealValue: 125000000,
    sector: 'Technology',
    stage: 'Series B',
    location: 'San Francisco, CA',
    status: 'In Progress',
    priority: 'High',
    progress: 78,
    riskLevel: 'Medium',
    aiRiskScore: 6.8,
    aiConfidence: 92,
    startDate: '2024-10-15',
    targetClose: '2025-01-15',
    leadAnalyst: 'Sarah Johnson',
    teamSize: 8,
    totalTasks: 87,
    completedTasks: 68,
    aiRecommendations: [
      {
        id: 'rec-1',
        type: 'risk',
        title: 'Revenue Concentration Risk Detected',
        description: 'AI analysis shows 65% revenue from top 3 customers - higher than industry average',
        priority: 'high',
        confidence: 0.89,
        action: 'Investigate customer diversification strategy'
      },
      {
        id: 'rec-2',
        type: 'opportunity',
        title: 'Market Expansion Potential',
        description: 'ML models predict 40% market growth in adjacent sectors',
        priority: 'medium',
        confidence: 0.76,
        action: 'Assess expansion capabilities and timeline'
      }
    ],
    findings: [
      { type: 'Critical', count: 2, description: 'Revenue concentration risk, regulatory compliance gaps' },
      { type: 'High', count: 5, description: 'Management team turnover, customer dependencies' },
      { type: 'Medium', count: 12, description: 'Technology debt, market competition' },
      { type: 'Low', count: 8, description: 'Documentation gaps, process improvements' }
    ],
    riskAssessment: {
      overall: 7.2,
      financial: 8.1,
      operational: 6.8,
      strategic: 7.5,
      legal: 7.0,
      market: 6.9
    },
    aiInsights: {
      predictedOutcome: 'Proceed with mitigation',
      timeToComplete: 28,
      successProbability: 0.84,
      valueAtRisk: 15000000
    }
  },
  {
    id: '2',
    name: 'HealthTech Direct Investment',
    targetCompany: 'MedDevice Inc',
    dealValue: 85000000,
    sector: 'Healthcare',
    stage: 'Growth',
    location: 'Boston, MA',
    status: 'In Progress',
    priority: 'High',
    progress: 45,
    riskLevel: 'Low',
    aiRiskScore: 8.4,
    aiConfidence: 87,
    startDate: '2024-11-01',
    targetClose: '2025-02-28',
    leadAnalyst: 'Michael Chen',
    teamSize: 6,
    totalTasks: 65,
    completedTasks: 29,
    aiRecommendations: [
      {
        id: 'rec-3',
        type: 'optimization',
        title: 'Accelerate FDA Approval Timeline',
        description: 'AI analysis suggests expedited pathway possible based on similar devices',
        priority: 'medium',
        confidence: 0.72,
        action: 'Engage regulatory consultant for expedited filing'
      }
    ],
    findings: [
      { type: 'Critical', count: 0, description: 'None identified' },
      { type: 'High', count: 2, description: 'Regulatory approval timeline, IP protection' },
      { type: 'Medium', count: 8, description: 'Market competition, scaling challenges' },
      { type: 'Low', count: 5, description: 'Team structure, operational processes' }
    ],
    riskAssessment: {
      overall: 8.4,
      financial: 8.7,
      operational: 8.2,
      strategic: 8.6,
      legal: 8.1,
      market: 8.0
    },
    aiInsights: {
      predictedOutcome: 'Strong Proceed',
      timeToComplete: 22,
      successProbability: 0.91,
      valueAtRisk: 8500000
    }
  }
]

export function DueDiligenceAssistedRefactored({ 
  metrics, 
  isLoading = false,
  aiRecommendations,
  onExecuteAIAction,
  onDismissRecommendation,
  onSwitchMode
}: AssistedModeProps) {
  const [activeTab, setActiveTab] = useState('overview')
  const [selectedProject, setSelectedProject] = useState<string>(mockAIEnhancedDDProjects[0].id)
  const [searchTerm, setSearchTerm] = useState('')

  const currentProject = mockAIEnhancedDDProjects.find(p => p.id === selectedProject) || mockAIEnhancedDDProjects[0]

  // AI-Enhanced event handlers
  const handleCreateProject = () => {
    alert('AI-Powered DD Project Creation would launch:\n\n• Intelligent project setup with ML-powered risk framework\n• Automated team assignment based on expertise matching\n• Smart checklist generation tailored to sector and deal type\n• Predictive timeline modeling with milestone optimization\n• Integration with Deal Screening data for context\n• AI-powered document template selection\n• Cross-module data synchronization setup')
  }

  const handleViewProject = (id: string) => {
    const project = mockAIEnhancedDDProjects.find(p => p.id === id)
    if (project) {
      alert(`AI-Enhanced DD Workspace for "${project.name}":\n\n• Predictive risk analysis with ML-powered scoring\n• Automated document analysis and red flag detection\n• Real-time benchmark comparisons with similar deals\n• AI-powered stakeholder sentiment analysis\n• Intelligent task prioritization and resource allocation\n• Cross-team collaboration with smart notifications\n• Predictive completion timeline with risk adjustments`)
    }
  }

  const handleAIRiskAnalysis = (id: string) => {
    const project = mockAIEnhancedDDProjects.find(p => p.id === id)
    if (project) {
      alert(`AI-Powered Risk Analysis for "${project.name}":\n\n• ML Risk Score: ${project.aiRiskScore}/10 (${project.aiConfidence}% confidence)\n• Predicted Outcome: ${project.aiInsights.predictedOutcome}\n• Success Probability: ${(project.aiInsights.successProbability * 100).toFixed(0)}%\n• Value at Risk: $${(project.aiInsights.valueAtRisk / 1000000).toFixed(1)}M\n• Time to Complete: ${project.aiInsights.timeToComplete} days\n\n• Real-time market sentiment monitoring\n• Competitive risk assessment with pattern recognition\n• Regulatory change impact analysis`)
    }
  }

  const handleExecuteAIRecommendation = (recommendationId: string) => {
    const allRecommendations = mockAIEnhancedDDProjects.flatMap(p => p.aiRecommendations)
    const recommendation = allRecommendations.find(r => r.id === recommendationId)
    if (recommendation) {
      alert(`Executing AI Recommendation: "${recommendation.title}"\n\n${recommendation.description}\n\nConfidence Level: ${(recommendation.confidence * 100).toFixed(0)}%\nPriority: ${recommendation.priority}\nAction: ${recommendation.action}\n\n• Implementation wizard would guide next steps\n• Automated workflow creation and team notification\n• Progress tracking with ML-powered monitoring\n• Integration with project management systems`)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const getRiskColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'low': return 'bg-green-100 text-green-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'high': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'in progress': return 'bg-blue-100 text-blue-800'
      case 'final review': return 'bg-purple-100 text-purple-800'
      case 'completed': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mb-4"></div>
        <h3 className="text-xl font-semibold text-gray-700">AI is analyzing due diligence data...</h3>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* AI-Enhanced Mode Indicator */}
      <div className="bg-white border-b border-purple-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Badge className="bg-purple-100 text-purple-800 border border-purple-300 flex items-center space-x-1">
              <Brain className="h-3 w-3" />
              <span>AI-Assisted Mode</span>
            </Badge>
            <span className="text-gray-600 text-sm">Intelligent due diligence with predictive analytics</span>
          </div>
          
          {/* AI-Enhanced DD Metrics */}
          <div className="flex items-center space-x-6 text-sm text-gray-600">
            <div>
              <span className="font-medium">AI Efficiency:</span> 
              <span className="text-purple-600 ml-1">{metrics.aiEfficiencyGains || 87}%</span>
            </div>
            <div>
              <span className="font-medium">Risk Accuracy:</span> 
              <span className="text-blue-600 ml-1">{metrics.riskAccuracy || 94}%</span>
            </div>
            <div>
              <span className="font-medium">Time Saved:</span> 
              <span className="text-green-600 ml-1">{metrics.timeSavedHours || 156}h</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* AI Recommendations Panel */}
        {aiRecommendations && aiRecommendations.length > 0 && (
          <div className="mb-6">
            <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Brain className="h-5 w-5 mr-2 text-purple-600" />
                  Due Diligence AI Recommendations ({aiRecommendations.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {aiRecommendations.slice(0, 3).map((rec) => (
                    <div key={rec.id} className="p-4 bg-white border rounded-lg shadow-sm">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h4 className="font-medium text-gray-900">{rec.title}</h4>
                            <Badge variant={rec.priority === 'high' ? 'destructive' : 'secondary'}>
                              {rec.priority}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{rec.description}</p>
                          <div className="flex items-center space-x-2 text-xs text-gray-500">
                            <span>• {Math.round(rec.confidence * 100)}% confidence</span>
                            {rec.estimatedImpact && <span>• {rec.estimatedImpact} impact</span>}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            onClick={() => onExecuteAIAction(rec.action)}
                            disabled={isLoading}
                          >
                            Execute
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => onDismissRecommendation(rec.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">AI Overview</TabsTrigger>
            <TabsTrigger value="projects">Smart Projects</TabsTrigger>
            <TabsTrigger value="analytics">Predictive Analytics</TabsTrigger>
            <TabsTrigger value="recommendations">AI Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* AI-Enhanced KPI Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Brain className="h-8 w-8 text-purple-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-purple-800">AI-Enhanced Projects</p>
                      <p className="text-2xl font-bold text-purple-900">{mockAIEnhancedDDProjects.length}</p>
                      <p className="text-xs text-purple-600">87% efficiency gain</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <BarChart3 className="h-8 w-8 text-blue-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-blue-800">Risk Prediction</p>
                      <p className="text-2xl font-bold text-blue-900">94%</p>
                      <p className="text-xs text-blue-600">accuracy rate</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <TrendingUp className="h-8 w-8 text-green-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-green-800">Time Savings</p>
                      <p className="text-2xl font-bold text-green-900">156h</p>
                      <p className="text-xs text-green-600">this month</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Sparkles className="h-8 w-8 text-orange-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-orange-800">Success Rate</p>
                      <p className="text-2xl font-bold text-orange-900">
                        {Math.round(mockAIEnhancedDDProjects.reduce((sum, p) => sum + p.aiInsights.successProbability, 0) / mockAIEnhancedDDProjects.length * 100)}%
                      </p>
                      <p className="text-xs text-orange-600">predicted</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Current Project Spotlight with AI Insights */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Eye className="h-5 w-5 mr-2 text-blue-600" />
                  AI Project Spotlight: {currentProject.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{currentProject.targetCompany}</h3>
                        <p className="text-gray-600">{currentProject.sector} • {currentProject.stage} • {currentProject.location}</p>
                        <p className="text-sm text-gray-500 mt-1">Lead: {currentProject.leadAnalyst} • Team: {currentProject.teamSize} members</p>
                      </div>
                      <div className="flex space-x-2">
                        <Badge className={getRiskColor(currentProject.riskLevel)}>
                          {currentProject.riskLevel.toUpperCase()} RISK
                        </Badge>
                        <Badge className={getStatusColor(currentProject.status)}>
                          {currentProject.status.toUpperCase()}
                        </Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Deal Value</p>
                        <p className="text-lg font-semibold">{formatCurrency(currentProject.dealValue)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">AI Risk Score</p>
                        <p className="text-lg font-semibold text-purple-600">{currentProject.aiRiskScore}/10</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress (AI-optimized)</span>
                        <span>{currentProject.progress}% ({currentProject.completedTasks}/{currentProject.totalTasks} tasks)</span>
                      </div>
                      <Progress value={currentProject.progress} className="h-2" />
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">AI Insights & Predictions</h4>
                    <div className="space-y-3">
                      <div className="p-3 bg-purple-50 rounded-lg">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-purple-800">Predicted Outcome</span>
                          <span className="text-sm font-bold text-purple-900">{currentProject.aiInsights.predictedOutcome}</span>
                        </div>
                        <div className="text-xs text-purple-600">
                          {(currentProject.aiInsights.successProbability * 100).toFixed(0)}% success probability
                        </div>
                      </div>
                      
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-blue-800">Completion Timeline</span>
                          <span className="text-sm font-bold text-blue-900">{currentProject.aiInsights.timeToComplete} days</span>
                        </div>
                        <div className="text-xs text-blue-600">
                          AI-optimized scheduling
                        </div>
                      </div>
                      
                      <div className="p-3 bg-orange-50 rounded-lg">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-orange-800">Value at Risk</span>
                          <span className="text-sm font-bold text-orange-900">
                            ${(currentProject.aiInsights.valueAtRisk / 1000000).toFixed(1)}M
                          </span>
                        </div>
                        <div className="text-xs text-orange-600">
                          ML risk assessment
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="projects" className="space-y-6">
            {/* AI-Enhanced Project Management */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                  <Input
                    placeholder="AI-powered project search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
              </div>
              <Button onClick={handleCreateProject}>
                <Plus className="h-4 w-4 mr-2" />
                AI-Assisted DD Project
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {mockAIEnhancedDDProjects.map((project) => (
                <Card key={project.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-lg">{project.name}</h3>
                        <p className="text-gray-600">{project.targetCompany}</p>
                        <p className="text-sm text-gray-500">{project.sector} • {project.stage} • {project.location}</p>
                      </div>
                      <div className="flex flex-col space-y-1">
                        <Badge className={getRiskColor(project.riskLevel)}>
                          AI Risk: {project.aiRiskScore}/10
                        </Badge>
                        <Badge className={getStatusColor(project.status)}>
                          {project.status}
                        </Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-600">Deal Value</p>
                        <p className="font-semibold">{formatCurrency(project.dealValue)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Success Probability</p>
                        <p className="font-semibold text-purple-600">
                          {(project.aiInsights.successProbability * 100).toFixed(0)}%
                        </p>
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-sm text-gray-600">AI-Optimized Progress</p>
                      <div className="flex items-center space-x-2">
                        <Progress value={project.progress} className="flex-1 h-2" />
                        <span className="text-sm font-medium">{project.progress}%</span>
                      </div>
                    </div>

                    {/* AI Recommendations for this project */}
                    {project.aiRecommendations.length > 0 && (
                      <div className="mb-4 p-3 bg-purple-50 rounded-lg">
                        <h5 className="text-sm font-medium text-purple-800 mb-2">
                          AI Recommendations ({project.aiRecommendations.length})
                        </h5>
                        {project.aiRecommendations.slice(0, 1).map((rec) => (
                          <div key={rec.id} className="text-xs text-purple-700">
                            <span className="font-medium">{rec.title}</span>
                            <div className="mt-1">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleExecuteAIRecommendation(rec.id)}
                                className="text-xs h-6 px-2"
                              >
                                <Sparkles className="h-3 w-3 mr-1" />
                                Execute
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex space-x-2">
                      <Button 
                        size="sm" 
                        onClick={() => handleViewProject(project.id)}
                        className="flex-1"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        AI Workspace
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleAIRiskAnalysis(project.id)}
                        className="flex-1"
                      >
                        <Brain className="h-4 w-4 mr-1" />
                        AI Analysis
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2 text-blue-600" />
                  Predictive Analytics Dashboard
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold">AI Performance Metrics</h4>
                    <div className="space-y-3">
                      <div className="p-4 bg-purple-50 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium">Risk Prediction Accuracy</span>
                          <span className="text-lg font-bold text-purple-900">94.2%</span>
                        </div>
                        <Progress value={94} className="h-2" />
                      </div>
                      
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium">Timeline Accuracy</span>
                          <span className="text-lg font-bold text-blue-900">87.8%</span>
                        </div>
                        <Progress value={88} className="h-2" />
                      </div>
                      
                      <div className="p-4 bg-green-50 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium">Process Efficiency</span>
                          <span className="text-lg font-bold text-green-900">+156%</span>
                        </div>
                        <Progress value={100} className="h-2" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="font-semibold">Cross-Module Intelligence</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm">Deal Screening → DD</span>
                        <span className="text-sm font-medium text-green-600">98% data sync</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm">Portfolio → Risk Analysis</span>
                        <span className="text-sm font-medium text-blue-600">91% correlation</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm">Market Intel → Predictions</span>
                        <span className="text-sm font-medium text-purple-600">85% accuracy</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="recommendations" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Lightbulb className="h-5 w-5 mr-2 text-yellow-600" />
                  AI-Generated Insights & Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockAIEnhancedDDProjects.flatMap(p => p.aiRecommendations).map((rec) => (
                    <div key={rec.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h4 className="font-medium text-gray-900">{rec.title}</h4>
                            <Badge variant={rec.priority === 'high' ? 'destructive' : 'secondary'}>
                              {rec.priority}
                            </Badge>
                          </div>
                          
                          <p className="text-sm text-gray-600 mb-2">{rec.description}</p>
                          
                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            <span>Confidence: {(rec.confidence * 100).toFixed(0)}%</span>
                            <span>Type: {rec.type}</span>
                            <span>Action: {rec.action}</span>
                          </div>
                        </div>
                        
                        <Button 
                          size="sm"
                          onClick={() => handleExecuteAIRecommendation(rec.id)}
                        >
                          <Zap className="h-4 w-4 mr-1" />
                          Execute
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}