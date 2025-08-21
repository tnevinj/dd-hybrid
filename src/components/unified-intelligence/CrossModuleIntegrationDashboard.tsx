/**
 * Cross-Module Integration Dashboard
 * Comprehensive view of module relationships, data flows, and AI-powered insights
 */

'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  useCrossModuleInsights, 
  useSystemPerformance, 
  useAIRecommendations,
  useUnifiedDataLayer
} from '@/hooks/useUnifiedDataLayer'
import {
  ArrowRight,
  Brain,
  Zap,
  Activity,
  Shield,
  TrendingUp,
  Network,
  Database,
  Eye,
  Settings,
  AlertCircle,
  CheckCircle,
  Clock,
  BarChart3,
  Sparkles,
  GitBranch,
  Workflow,
  Target,
  Lightbulb,
  RefreshCw
} from 'lucide-react'

export function CrossModuleIntegrationDashboard() {
  const [activeTab, setActiveTab] = useState('overview')
  const { insights, relationships } = useCrossModuleInsights()
  const performance = useSystemPerformance()
  const { recommendations, isGenerating, generateRecommendations, executeRecommendation } = useAIRecommendations()

  const formatPercentage = (value: number) => `${(value * 100).toFixed(1)}%`

  const getHealthColor = (health: 'healthy' | 'warning' | 'error') => {
    switch (health) {
      case 'healthy': return 'text-green-600 bg-green-100'
      case 'warning': return 'text-yellow-600 bg-yellow-100'
      case 'error': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getHealthIcon = (health: 'healthy' | 'warning' | 'error') => {
    switch (health) {
      case 'healthy': return <CheckCircle className="h-4 w-4" />
      case 'warning': return <AlertCircle className="h-4 w-4" />
      case 'error': return <AlertCircle className="h-4 w-4" />
      default: return <Clock className="h-4 w-4" />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Badge className="bg-indigo-100 text-indigo-800 border border-indigo-300 flex items-center space-x-1">
              <Network className="h-3 w-3" />
              <span>Unified Intelligence</span>
            </Badge>
            <span className="text-gray-600 text-sm">Cross-module integration and AI-powered insights</span>
          </div>
          
          <div className="flex items-center space-x-6 text-sm text-gray-600">
            <div>
              <span className="font-medium">System Health:</span> 
              <span className="text-green-600 ml-1">Optimal</span>
            </div>
            <div>
              <span className="font-medium">Data Sync:</span> 
              <span className="text-blue-600 ml-1">{formatPercentage(performance.syncAccuracy)}</span>
            </div>
            <div>
              <span className="font-medium">AI Efficiency:</span> 
              <span className="text-purple-600 ml-1">{formatPercentage(performance.aiEfficiency)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">System Overview</TabsTrigger>
            <TabsTrigger value="relationships">Module Relationships</TabsTrigger>
            <TabsTrigger value="dataflow">Data Flow</TabsTrigger>
            <TabsTrigger value="ai-insights">AI Insights</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* System Health Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {Object.entries(performance.moduleHealth).map(([module, health]) => (
                <Card key={module} className={`border-l-4 ${
                  health === 'healthy' ? 'border-l-green-500' :
                  health === 'warning' ? 'border-l-yellow-500' : 'border-l-red-500'
                }`}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-medium capitalize">
                        {module.replace(/([A-Z])/g, ' $1').trim()}
                      </h4>
                      <div className={`p-1 rounded-full ${getHealthColor(health)}`}>
                        {getHealthIcon(health)}
                      </div>
                    </div>
                    <Badge className={getHealthColor(health)}>
                      {health.toUpperCase()}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Database className="h-8 w-8 text-blue-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-blue-800">Data Flow Latency</p>
                      <p className="text-2xl font-bold text-blue-900">{performance.dataFlowLatency.toFixed(2)}s</p>
                      <p className="text-xs text-blue-600">Real-time processing</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Activity className="h-8 w-8 text-green-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-green-800">Sync Accuracy</p>
                      <p className="text-2xl font-bold text-green-900">{formatPercentage(performance.syncAccuracy)}</p>
                      <p className="text-xs text-green-600">Cross-module consistency</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Brain className="h-8 w-8 text-purple-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-purple-800">AI Efficiency</p>
                      <p className="text-2xl font-bold text-purple-900">{formatPercentage(performance.aiEfficiency)}</p>
                      <p className="text-xs text-purple-600">Intelligent automation</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Active Integrations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <GitBranch className="h-5 w-5 mr-2 text-indigo-600" />
                  Active Module Integrations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {relationships.slice(0, 6).map((rel, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="text-sm font-medium text-gray-900">{rel.source}</div>
                        <ArrowRight className="h-4 w-4 text-gray-400" />
                        <div className="text-sm font-medium text-gray-900">{rel.target}</div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Progress value={rel.strength * 100} className="w-16 h-2" />
                        <span className="text-xs text-gray-500">{formatPercentage(rel.strength)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="relationships" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Network className="h-5 w-5 mr-2 text-blue-600" />
                  Module Relationship Map
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {relationships.map((rel, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium text-gray-900">{rel.source}</span>
                            <ArrowRight className="h-4 w-4 text-gray-400" />
                            <span className="font-medium text-gray-900">{rel.target}</span>
                          </div>
                          <Badge variant="outline" className="capitalize">
                            {rel.type.replace('_', ' ')}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-500">Strength:</span>
                          <Progress value={rel.strength * 100} className="w-20 h-2" />
                          <span className="text-sm font-medium">{formatPercentage(rel.strength)}</span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">{rel.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="dataflow" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Workflow className="h-5 w-5 mr-2 text-green-600" />
                    Real-time Data Flows
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-green-50 rounded-lg border-l-4 border-l-green-500">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-green-800">Deal Screening → Due Diligence</span>
                        <Badge className="bg-green-100 text-green-800">Active</Badge>
                      </div>
                      <p className="text-sm text-green-600">24 opportunities processed in last 24h</p>
                      <div className="mt-2">
                        <Progress value={92} className="h-2" />
                        <span className="text-xs text-green-600 mt-1">92% success rate</span>
                      </div>
                    </div>

                    <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-l-blue-500">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-blue-800">Due Diligence → Portfolio</span>
                        <Badge className="bg-blue-100 text-blue-800">Active</Badge>
                      </div>
                      <p className="text-sm text-blue-600">8 assets transferred in last 7 days</p>
                      <div className="mt-2">
                        <Progress value={89} className="h-2" />
                        <span className="text-xs text-blue-600 mt-1">89% data integrity</span>
                      </div>
                    </div>

                    <div className="p-4 bg-purple-50 rounded-lg border-l-4 border-l-purple-500">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-purple-800">Market Intel → All Modules</span>
                        <Badge className="bg-purple-100 text-purple-800">Active</Badge>
                      </div>
                      <p className="text-sm text-purple-600">Real-time data streaming to 5 modules</p>
                      <div className="mt-2">
                        <Progress value={95} className="h-2" />
                        <span className="text-xs text-purple-600 mt-1">95% uptime</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2 text-orange-600" />
                    Data Quality Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries({
                      'Deal Screening': 0.92,
                      'Due Diligence': 0.89,
                      'Portfolio': 0.95,
                      'Workflow Automation': 0.87,
                      'Market Intelligence': 0.91
                    }).map(([module, quality]) => (
                      <div key={module} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">{module}</span>
                          <span className="text-gray-600">{formatPercentage(quality)}</span>
                        </div>
                        <Progress value={quality * 100} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="ai-insights" className="space-y-6">
            {/* AI Recommendations */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center">
                  <Brain className="h-5 w-5 mr-2 text-purple-600" />
                  AI-Generated Integration Recommendations ({recommendations.length})
                </CardTitle>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={generateRecommendations}
                  disabled={isGenerating}
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${isGenerating ? 'animate-spin' : ''}`} />
                  {isGenerating ? 'Generating...' : 'Refresh'}
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recommendations.map((rec) => (
                    <div key={rec.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h4 className="font-medium text-gray-900">{rec.title}</h4>
                            <Badge variant={rec.impact === 'high' ? 'destructive' : 'secondary'}>
                              {rec.impact} impact
                            </Badge>
                            {rec.confidence && (
                              <Badge variant="outline">
                                {(rec.confidence * 100).toFixed(0)}% confidence
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{rec.description}</p>
                          {rec.modules && (
                            <div className="flex items-center space-x-2 mb-2">
                              <span className="text-xs text-gray-500">Modules:</span>
                              {rec.modules.map((module: string) => (
                                <Badge key={module} variant="outline" className="text-xs">
                                  {module}
                                </Badge>
                              ))}
                            </div>
                          )}
                          {rec.estimatedROI && (
                            <p className="text-sm text-green-600 font-medium">Expected: {rec.estimatedROI}</p>
                          )}
                        </div>
                        <Button 
                          size="sm"
                          onClick={() => executeRecommendation(rec.id)}
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

          <TabsContent value="performance" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2 text-blue-600" />
                    System Performance Trends
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-blue-800">Data Processing Speed</span>
                        <span className="text-blue-900 font-bold">+23% improvement</span>
                      </div>
                      <Progress value={85} className="h-2 mb-1" />
                      <span className="text-xs text-blue-600">Optimized in last 30 days</span>
                    </div>

                    <div className="p-4 bg-green-50 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-green-800">Cross-Module Sync</span>
                        <span className="text-green-900 font-bold">98.2% uptime</span>
                      </div>
                      <Progress value={98} className="h-2 mb-1" />
                      <span className="text-xs text-green-600">Stable connection health</span>
                    </div>

                    <div className="p-4 bg-purple-50 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-purple-800">AI Response Time</span>
                        <span className="text-purple-900 font-bold">1.2s average</span>
                      </div>
                      <Progress value={76} className="h-2 mb-1" />
                      <span className="text-xs text-purple-600">Within target SLA</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="h-5 w-5 mr-2 text-green-600" />
                    Integration Health Monitor
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { name: 'Deal Screening ↔ Due Diligence', status: 'healthy', uptime: 99.8 },
                      { name: 'Due Diligence ↔ Portfolio', status: 'healthy', uptime: 99.5 },
                      { name: 'Market Intel ↔ All Modules', status: 'warning', uptime: 97.2 },
                      { name: 'Workflow ↔ Cross-Module', status: 'healthy', uptime: 98.9 }
                    ].map((integration, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className={`p-1 rounded-full ${getHealthColor(integration.status as any)}`}>
                            {getHealthIcon(integration.status as any)}
                          </div>
                          <span className="text-sm font-medium">{integration.name}</span>
                        </div>
                        <span className="text-sm text-gray-600">{integration.uptime}% uptime</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}