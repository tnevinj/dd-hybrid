'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { 
  AlertTriangle,
  Shield,
  TrendingUp,
  TrendingDown,
  Activity,
  Target,
  Brain,
  Zap,
  CheckCircle,
  Clock,
  Users,
  BarChart3,
  PieChart,
  RefreshCw,
  Eye,
  Bell,
  ArrowUpRight,
  ArrowDownRight,
  ChevronRight,
  Building,
  DollarSign,
  Briefcase,
  Scale,
  Globe,
  Cpu,
  Leaf,
  Droplets
} from 'lucide-react'

import { 
  RiskAssessmentEngine, 
  RiskAssessment, 
  RiskFactor, 
  RiskMetrics 
} from '@/lib/analytics/risk-assessment-automation'

interface RiskAssessmentDashboardProps {
  mode?: 'traditional' | 'assisted' | 'autonomous'
}

export function RiskAssessmentDashboard({ mode = 'traditional' }: RiskAssessmentDashboardProps) {
  const [engine] = useState(new RiskAssessmentEngine())
  const [overallAssessment, setOverallAssessment] = useState<RiskAssessment | null>(null)
  const [moduleAssessments, setModuleAssessments] = useState<Record<string, RiskAssessment>>({})
  const [crossModuleRisks, setCrossModuleRisks] = useState<RiskFactor[]>([])
  const [riskMetrics, setRiskMetrics] = useState<RiskMetrics | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedModule, setSelectedModule] = useState<string>('all')
  const [alertFilter, setAlertFilter] = useState<string>('all')

  useEffect(() => {
    loadRiskAssessments()
  }, [])

  const loadRiskAssessments = async () => {
    setLoading(true)
    
    // Mock data for comprehensive risk assessment
    const mockModuleData = {
      portfolio: {
        largestPosition: 0.18, // 18% concentration
        liquidityRatio: 0.04, // 4% liquidity
        recentPerformance: 0.11 // 11% IRR
      },
      dueDiligence: {
        dataCompleteness: 0.82,
        daysRemaining: 8,
        completeness: 0.75,
        redFlags: ['Management turnover', 'Declining margins'],
        dealId: 'DEAL-001'
      },
      legal: {
        complianceScore: 87,
        pendingRegulations: ['ESG Disclosure', 'Data Privacy', 'Financial Reporting'],
        legalCostRatio: 0.038
      },
      market: {
        vix: 28.5,
        rateChangeVelocity: 0.7,
        sectorConcentration: 0.45
      },
      operations: {
        processingEfficiency: 0.74,
        systemUptime: 0.987,
        staffTurnover: 0.18
      }
    }

    try {
      const assessment = engine.generateComprehensiveRiskAssessment(mockModuleData)
      
      setOverallAssessment(assessment.overallAssessment)
      setModuleAssessments(assessment.moduleAssessments)
      setCrossModuleRisks(assessment.crossModuleRisks)
      setRiskMetrics(assessment.riskMetrics)
    } catch (error) {
      console.error('Error loading risk assessments:', error)
    } finally {
      setLoading(false)
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'CRITICAL': return 'bg-red-100 text-red-800 border-red-300'
      case 'HIGH': return 'bg-orange-100 text-orange-800 border-orange-300'
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      case 'LOW': return 'bg-green-100 text-green-800 border-green-300'
      default: return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A': return 'text-green-600 bg-green-100'
      case 'B': return 'text-blue-600 bg-blue-100'
      case 'C': return 'text-yellow-600 bg-yellow-100'
      case 'D': return 'text-orange-600 bg-orange-100'
      case 'F': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getAlertIcon = (level: string) => {
    switch (level) {
      case 'CRITICAL': return <AlertTriangle className="h-5 w-5 text-red-600" />
      case 'HIGH': return <AlertTriangle className="h-5 w-5 text-orange-600" />
      case 'MEDIUM': return <Bell className="h-5 w-5 text-yellow-600" />
      case 'LOW': return <Eye className="h-5 w-5 text-blue-600" />
      default: return <CheckCircle className="h-5 w-5 text-green-600" />
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'MARKET': return <Globe className="h-4 w-4" />
      case 'OPERATIONAL': return <Activity className="h-4 w-4" />
      case 'FINANCIAL': return <DollarSign className="h-4 w-4" />
      case 'REGULATORY': return <Scale className="h-4 w-4" />
      case 'STRATEGIC': return <Target className="h-4 w-4" />
      case 'TECHNOLOGY': return <Cpu className="h-4 w-4" />
      case 'ESG': return <Leaf className="h-4 w-4" />
      case 'LIQUIDITY': return <Droplets className="h-4 w-4" />
      default: return <Briefcase className="h-4 w-4" />
    }
  }

  const getTrendIcon = (direction: string) => {
    switch (direction) {
      case 'INCREASING': return <TrendingUp className="h-4 w-4 text-red-600" />
      case 'DECREASING': return <TrendingDown className="h-4 w-4 text-green-600" />
      default: return <Activity className="h-4 w-4 text-blue-600" />
    }
  }

  const getModuleIcon = (module: string) => {
    switch (module) {
      case 'portfolio': return <BarChart3 className="h-5 w-5" />
      case 'dueDiligence': return <Target className="h-5 w-5" />
      case 'legal': return <Scale className="h-5 w-5" />
      case 'market': return <Globe className="h-5 w-5" />
      case 'operations': return <Activity className="h-5 w-5" />
      default: return <Building className="h-5 w-5" />
    }
  }

  const filteredRisks = overallAssessment?.risks.filter(risk => {
    const moduleMatch = selectedModule === 'all' || risk.source.toLowerCase().includes(selectedModule.toLowerCase())
    const severityMatch = alertFilter === 'all' || risk.severity === alertFilter
    return moduleMatch && severityMatch
  }) || []

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <RefreshCw className="h-8 w-8 animate-spin text-blue-600 mb-4" />
        <h3 className="text-xl font-semibold text-gray-700">Analyzing Risk Factors...</h3>
      </div>
    )
  }

  if (!overallAssessment || !riskMetrics) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <AlertTriangle className="h-8 w-8 text-red-600 mb-4" />
        <h3 className="text-xl font-semibold text-gray-700">Unable to load risk assessment data</h3>
      </div>
    )
  }

  const moduleList = [
    { key: 'portfolio', name: 'Portfolio Management', assessment: moduleAssessments.portfolio },
    { key: 'dueDiligence', name: 'Due Diligence', assessment: moduleAssessments.dueDiligence },
    { key: 'legal', name: 'Legal & Compliance', assessment: moduleAssessments.legal },
    { key: 'market', name: 'Market Intelligence', assessment: moduleAssessments.market },
    { key: 'operations', name: 'Fund Operations', assessment: moduleAssessments.operations }
  ].filter(m => m.assessment)

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Shield className="h-8 w-8 mr-3 text-red-600" />
            Risk Assessment Automation
          </h1>
          <p className="text-gray-600 mt-1">AI-powered comprehensive risk monitoring and analysis across all modules</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button onClick={loadRiskAssessments} variant="outline" className="flex items-center space-x-2">
            <RefreshCw className="h-4 w-4" />
            <span>Refresh Assessment</span>
          </Button>
          <Button className="flex items-center space-x-2">
            <Bell className="h-4 w-4" />
            <span>Alert Settings</span>
          </Button>
        </div>
      </div>

      {/* Overall Risk Status */}
      <div className="mb-6">
        <Alert className={`border-2 ${
          overallAssessment.alertLevel === 'CRITICAL' ? 'border-red-500 bg-red-50' :
          overallAssessment.alertLevel === 'HIGH' ? 'border-orange-500 bg-orange-50' :
          overallAssessment.alertLevel === 'MEDIUM' ? 'border-yellow-500 bg-yellow-50' :
          'border-green-500 bg-green-50'
        }`}>
          <div className="flex items-center space-x-3">
            {getAlertIcon(overallAssessment.alertLevel)}
            <div>
              <AlertTitle className="text-lg">
                Overall Risk Status: {overallAssessment.alertLevel}
              </AlertTitle>
              <AlertDescription className="text-sm">
                Risk Score: {overallAssessment.overallRiskScore.toFixed(1)}/10 • 
                Grade: {overallAssessment.riskGrade} • 
                {overallAssessment.risks.length} active risk factors identified
              </AlertDescription>
            </div>
          </div>
        </Alert>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Overall Risk</CardTitle>
            <Shield className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallAssessment.overallRiskScore.toFixed(1)}</div>
            <p className="text-xs text-gray-600">Out of 10.0</p>
            <Badge className={`mt-1 ${getGradeColor(overallAssessment.riskGrade)}`}>
              Grade {overallAssessment.riskGrade}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Critical Risks</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{riskMetrics.alertSummary.critical}</div>
            <p className="text-xs text-gray-600">Require immediate action</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">High Risks</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{riskMetrics.alertSummary.high}</div>
            <p className="text-xs text-gray-600">Weekly monitoring</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Risk Trend</CardTitle>
            {getTrendIcon(overallAssessment.riskTrends.direction)}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallAssessment.riskTrends.direction}</div>
            <p className="text-xs text-gray-600">
              Velocity: {(overallAssessment.riskTrends.velocity * 100).toFixed(1)}%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Cross-Module</CardTitle>
            <Brain className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{crossModuleRisks.length}</div>
            <p className="text-xs text-gray-600">Systemic risks</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-fit grid-cols-4">
          <TabsTrigger value="overview">Risk Overview</TabsTrigger>
          <TabsTrigger value="modules">Module Analysis</TabsTrigger>
          <TabsTrigger value="risks">Risk Register</TabsTrigger>
          <TabsTrigger value="analytics">Risk Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Module Risk Scores */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2 text-blue-600" />
                  Module Risk Scores
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {moduleList.map(({ key, name, assessment }) => (
                    <div key={key} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                          {getModuleIcon(key)}
                          <span className="text-sm font-medium">{name}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm">{assessment.overallRiskScore.toFixed(1)}/10</span>
                          <Badge className={getGradeColor(assessment.riskGrade)}>
                            {assessment.riskGrade}
                          </Badge>
                        </div>
                      </div>
                      <Progress value={assessment.overallRiskScore * 10} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Risk Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <PieChart className="h-5 w-5 mr-2 text-green-600" />
                  Risk Category Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(riskMetrics.portfolioRiskDistribution).map(([category, count]) => {
                    const percentage = (count / overallAssessment.risks.length) * 100
                    return (
                      <div key={category} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center space-x-2">
                            {getCategoryIcon(category)}
                            <span className="text-sm font-medium">{category}</span>
                          </div>
                          <span className="text-sm text-gray-600">{count} risks ({percentage.toFixed(0)}%)</span>
                        </div>
                        <Progress value={percentage} className="h-2" />
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Cross-Module Risks */}
          {crossModuleRisks.length > 0 && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Zap className="h-5 w-5 mr-2 text-blue-600" />
                  Cross-Module Risks
                </CardTitle>
                <p className="text-sm text-gray-600">Systemic risks affecting multiple areas</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {crossModuleRisks.map((risk, idx) => (
                    <div key={idx} className="p-4 border rounded-lg bg-blue-50">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-blue-900">{risk.description}</h4>
                        <Badge className={getSeverityColor(risk.severity)}>
                          {risk.severity}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-blue-700 font-medium">Impact:</span> {risk.impact}/10
                        </div>
                        <div>
                          <span className="text-blue-700 font-medium">Probability:</span> {(risk.probability * 100).toFixed(0)}%
                        </div>
                      </div>
                      <div className="mt-3">
                        <h5 className="text-sm font-medium text-blue-800 mb-1">Mitigation:</h5>
                        <ul className="text-xs text-blue-700 space-y-1">
                          {risk.mitigation.map((action, actionIdx) => (
                            <li key={actionIdx} className="flex items-center">
                              <ChevronRight className="h-3 w-3 mr-1" />
                              {action}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Recommendations */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-red-700">
                  <Clock className="h-5 w-5 mr-2" />
                  Immediate Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {overallAssessment.recommendations.immediate.map((action, idx) => (
                    <li key={idx} className="text-sm flex items-center">
                      <AlertTriangle className="h-3 w-3 mr-2 text-red-600" />
                      {action}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-orange-700">
                  <Target className="h-5 w-5 mr-2" />
                  Short-term Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {overallAssessment.recommendations.shortTerm.map((action, idx) => (
                    <li key={idx} className="text-sm flex items-center">
                      <ArrowUpRight className="h-3 w-3 mr-2 text-orange-600" />
                      {action}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-blue-700">
                  <Users className="h-5 w-5 mr-2" />
                  Long-term Strategy
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {overallAssessment.recommendations.longTerm.map((action, idx) => (
                    <li key={idx} className="text-sm flex items-center">
                      <CheckCircle className="h-3 w-3 mr-2 text-blue-600" />
                      {action}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="modules" className="mt-6">
          <div className="space-y-6">
            {moduleList.map(({ key, name, assessment }) => (
              <Card key={key}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-3">
                      {getModuleIcon(key)}
                      <div>
                        <CardTitle>{name}</CardTitle>
                        <p className="text-sm text-gray-600">
                          Risk Score: {assessment.overallRiskScore.toFixed(1)}/10 • 
                          {assessment.risks.length} active risks
                        </p>
                      </div>
                    </div>
                    <Badge className={`${getGradeColor(assessment.riskGrade)} text-lg px-3 py-1`}>
                      {assessment.riskGrade}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  {assessment.risks.length > 0 ? (
                    <div className="space-y-3">
                      {assessment.risks.map((risk, riskIdx) => (
                        <div key={riskIdx} className="p-3 border rounded-lg">
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center space-x-2">
                              {getCategoryIcon(risk.category)}
                              <span className="font-medium text-sm">{risk.description}</span>
                            </div>
                            <Badge className={getSeverityColor(risk.severity)}>
                              {risk.severity}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-gray-600">
                            <div>Impact: {risk.impact}/10</div>
                            <div>Probability: {(risk.probability * 100).toFixed(0)}%</div>
                            <div>Status: {risk.status}</div>
                          </div>
                          {risk.indicators.length > 0 && (
                            <div className="mt-2">
                              <span className="text-xs font-medium text-gray-700">Indicators: </span>
                              <span className="text-xs text-gray-600">{risk.indicators.join(', ')}</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4 text-gray-500">
                      <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-600" />
                      <p>No significant risks detected in this module</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="risks" className="mt-6">
          {/* Filters */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-4">
              <select 
                value={selectedModule}
                onChange={(e) => setSelectedModule(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Modules</option>
                <option value="portfolio">Portfolio</option>
                <option value="due">Due Diligence</option>
                <option value="legal">Legal</option>
                <option value="market">Market</option>
                <option value="operations">Operations</option>
              </select>
              <select 
                value={alertFilter}
                onChange={(e) => setAlertFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Severities</option>
                <option value="CRITICAL">Critical</option>
                <option value="HIGH">High</option>
                <option value="MEDIUM">Medium</option>
                <option value="LOW">Low</option>
              </select>
            </div>
            <div className="text-sm text-gray-600">
              Showing {filteredRisks.length} of {overallAssessment.risks.length} risks
            </div>
          </div>

          {/* Risk Register */}
          <div className="space-y-4">
            {filteredRisks.map((risk, idx) => (
              <Card key={idx} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center space-x-3">
                      {getCategoryIcon(risk.category)}
                      <div>
                        <h4 className="font-semibold text-gray-900">{risk.description}</h4>
                        <p className="text-sm text-gray-600">{risk.category} • {risk.source}</p>
                      </div>
                    </div>
                    <Badge className={getSeverityColor(risk.severity)}>
                      {risk.severity}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div>
                      <h5 className="font-medium text-gray-700 mb-2">Risk Assessment</h5>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Impact:</span>
                          <span className="text-sm font-medium">{risk.impact}/10</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Probability:</span>
                          <span className="text-sm font-medium">{(risk.probability * 100).toFixed(0)}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Status:</span>
                          <Badge variant="outline" className="text-xs">
                            {risk.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h5 className="font-medium text-gray-700 mb-2">Indicators</h5>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {risk.indicators.map((indicator, indicatorIdx) => (
                          <li key={indicatorIdx} className="flex items-center">
                            <ArrowUpRight className="h-3 w-3 mr-1" />
                            {indicator}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h5 className="font-medium text-gray-700 mb-2">Mitigation Actions</h5>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {risk.mitigation.map((action, actionIdx) => (
                          <li key={actionIdx} className="flex items-center">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            {action}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2 text-blue-600" />
                  Risk Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {riskMetrics.riskTrends.slice(-3).map((trend, idx) => (
                    <div key={idx} className="flex justify-between items-center">
                      <span className="text-sm">{trend.date.toLocaleDateString()}</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium">{trend.overallRisk.toFixed(1)}</span>
                        {getTrendIcon(idx === riskMetrics.riskTrends.length - 1 ? 'INCREASING' : 'STABLE')}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="h-5 w-5 mr-2 text-green-600" />
                  Mitigation Effectiveness
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(riskMetrics.mitigationEffectiveness).map(([strategy, effectiveness]) => (
                    <div key={strategy} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">{strategy}</span>
                        <span className="text-sm text-gray-600">{(effectiveness * 100).toFixed(0)}%</span>
                      </div>
                      <Progress value={effectiveness * 100} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default RiskAssessmentDashboard