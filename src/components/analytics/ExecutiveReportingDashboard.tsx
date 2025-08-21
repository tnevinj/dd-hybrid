'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { 
  FileText,
  TrendingUp,
  Calendar,
  Users,
  Send,
  Download,
  Eye,
  Clock,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Brain,
  BarChart3,
  PieChart,
  LineChart,
  Settings,
  Bell,
  Filter,
  Search,
  ChevronRight,
  Target,
  Zap,
  Award,
  Building,
  Globe,
  Star,
  ArrowUpRight,
  Lightbulb,
  Share
} from 'lucide-react'

import { 
  ExecutiveReportingEngine, 
  ExecutiveReport, 
  ReportTemplate, 
  PredictiveInsight 
} from '@/lib/analytics/executive-reporting-automation'

interface ExecutiveReportingDashboardProps {
  mode?: 'traditional' | 'assisted' | 'autonomous'
}

export function ExecutiveReportingDashboard({ mode = 'traditional' }: ExecutiveReportingDashboardProps) {
  const [engine] = useState(new ExecutiveReportingEngine())
  const [reports, setReports] = useState<ExecutiveReport[]>([])
  const [selectedReport, setSelectedReport] = useState<ExecutiveReport | null>(null)
  const [loading, setLoading] = useState(true)
  const [generatingReport, setGeneratingReport] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [reportFilter, setReportFilter] = useState<string>('all')
  const [selectedTemplate, setSelectedTemplate] = useState<string>('monthly_lp')

  useEffect(() => {
    loadReports()
  }, [])

  const loadReports = async () => {
    setLoading(true)
    
    try {
      // Generate sample reports for demonstration
      const periodEnd = new Date()
      const periodStart = new Date(periodEnd.getTime() - 30 * 24 * 60 * 60 * 1000) // 30 days ago
      
      const lpReport = await engine.generateReport('monthly_lp', periodStart, periodEnd)
      const boardReport = await engine.generateReport('quarterly_board', 
        new Date(periodEnd.getTime() - 90 * 24 * 60 * 60 * 1000), periodEnd)
      const icReport = await engine.generateReport('ic_weekly', 
        new Date(periodEnd.getTime() - 7 * 24 * 60 * 60 * 1000), periodEnd)
      
      const mockReports = [lpReport, boardReport, icReport]
      setReports(mockReports)
      setSelectedReport(mockReports[0])
    } catch (error) {
      console.error('Error loading reports:', error)
    } finally {
      setLoading(false)
    }
  }

  const generateNewReport = async () => {
    setGeneratingReport(true)
    
    try {
      const periodEnd = new Date()
      const periodStart = new Date(periodEnd.getTime() - 30 * 24 * 60 * 60 * 1000)
      
      const newReport = await engine.generateReport(selectedTemplate, periodStart, periodEnd)
      setReports(prev => [newReport, ...prev])
      setSelectedReport(newReport)
    } catch (error) {
      console.error('Error generating report:', error)
    } finally {
      setGeneratingReport(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED': return 'bg-green-100 text-green-800 border-green-300'
      case 'REVIEW': return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      case 'DISTRIBUTED': return 'bg-blue-100 text-blue-800 border-blue-300'
      case 'DRAFT': return 'bg-gray-100 text-gray-800 border-gray-300'
      default: return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  const getReportTypeIcon = (type: string) => {
    switch (type) {
      case 'MONTHLY': return <Calendar className="h-4 w-4" />
      case 'QUARTERLY': return <BarChart3 className="h-4 w-4" />
      case 'ANNUAL': return <Award className="h-4 w-4" />
      case 'BOARD_PACK': return <Users className="h-4 w-4" />
      case 'LP_REPORT': return <Building className="h-4 w-4" />
      case 'IC_SUMMARY': return <Target className="h-4 w-4" />
      default: return <FileText className="h-4 w-4" />
    }
  }

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'PERFORMANCE_FORECAST': return <TrendingUp className="h-4 w-4" />
      case 'RISK_PROJECTION': return <AlertCircle className="h-4 w-4" />
      case 'MARKET_OUTLOOK': return <Globe className="h-4 w-4" />
      case 'LIQUIDITY_FORECAST': return <Target className="h-4 w-4" />
      default: return <Lightbulb className="h-4 w-4" />
    }
  }

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = reportFilter === 'all' || report.reportType === reportFilter
    return matchesSearch && matchesFilter
  })

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <RefreshCw className="h-8 w-8 animate-spin text-blue-600 mb-4" />
        <h3 className="text-xl font-semibold text-gray-700">Loading Executive Reports...</h3>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <FileText className="h-8 w-8 mr-3 text-blue-600" />
            Executive Reporting Automation
          </h1>
          <p className="text-gray-600 mt-1">AI-powered automated report generation with predictive insights</p>
        </div>
        <div className="flex items-center space-x-2">
          <select 
            value={selectedTemplate}
            onChange={(e) => setSelectedTemplate(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="monthly_lp">Monthly LP Report</option>
            <option value="quarterly_board">Quarterly Board Pack</option>
            <option value="ic_weekly">IC Weekly Summary</option>
          </select>
          <Button onClick={generateNewReport} disabled={generatingReport} className="flex items-center space-x-2">
            <Brain className="h-4 w-4" />
            <span>{generatingReport ? 'Generating...' : 'Generate Report'}</span>
          </Button>
          <Button variant="outline" className="flex items-center space-x-2">
            <Settings className="h-4 w-4" />
            <span>Templates</span>
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
            <FileText className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reports.length}</div>
            <p className="text-xs text-gray-600">Generated this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Auto-Generated</CardTitle>
            <Brain className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{Math.floor(reports.length * 0.8)}</div>
            <p className="text-xs text-gray-600">AI automation rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Distributed</CardTitle>
            <Send className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{reports.filter(r => r.status === 'DISTRIBUTED').length}</div>
            <p className="text-xs text-gray-600">Active reports</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Time Saved</CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">156</div>
            <p className="text-xs text-gray-600">Hours this quarter</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Accuracy</CardTitle>
            <CheckCircle className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94%</div>
            <p className="text-xs text-gray-600">Data accuracy rate</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Reports List */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Report Library</CardTitle>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search reports..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <select 
                  value={reportFilter}
                  onChange={(e) => setReportFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Types</option>
                  <option value="MONTHLY">Monthly</option>
                  <option value="QUARTERLY">Quarterly</option>
                  <option value="BOARD_PACK">Board Pack</option>
                  <option value="LP_REPORT">LP Report</option>
                </select>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 max-h-96 overflow-y-auto">
              {filteredReports.map((report) => (
                <div 
                  key={report.id}
                  className={`p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${
                    selectedReport?.id === report.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                  }`}
                  onClick={() => setSelectedReport(report)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      {getReportTypeIcon(report.reportType)}
                      <span className="font-medium text-sm">{report.title.split(' - ')[0]}</span>
                    </div>
                    <Badge className={getStatusColor(report.status)}>
                      {report.status}
                    </Badge>
                  </div>
                  <div className="text-xs text-gray-600">
                    <p>{report.generatedAt.toLocaleDateString()}</p>
                    <p>{report.sections.length} sections • {report.recipients.length} recipients</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Report Details */}
        <div className="lg:col-span-2">
          {selectedReport ? (
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-fit grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="content">Content</TabsTrigger>
                <TabsTrigger value="insights">AI Insights</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-6">
                <div className="space-y-6">
                  {/* Report Header */}
                  <Card>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-xl">{selectedReport.title}</CardTitle>
                          <div className="flex items-center space-x-4 text-sm text-gray-600 mt-2">
                            <span className="flex items-center space-x-1">
                              <Calendar className="h-4 w-4" />
                              <span>{selectedReport.period.startDate.toLocaleDateString()} - {selectedReport.period.endDate.toLocaleDateString()}</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <Users className="h-4 w-4" />
                              <span>{selectedReport.recipients.length} recipients</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <Clock className="h-4 w-4" />
                              <span>Generated {selectedReport.generatedAt.toLocaleDateString()}</span>
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={getStatusColor(selectedReport.status)}>
                            {selectedReport.status}
                          </Badge>
                          <Button variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                          <Button variant="outline" size="sm">
                            <Share className="h-4 w-4 mr-2" />
                            Share
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>

                  {/* Executive Summary */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Star className="h-5 w-5 mr-2 text-yellow-600" />
                        Executive Summary
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">Fund Performance</h4>
                          <p className="text-sm text-gray-700">{selectedReport.executiveSummary.fundPerformance}</p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-semibold text-green-800 mb-2">Key Achievements</h4>
                            <ul className="space-y-1">
                              {selectedReport.executiveSummary.keyAchievements.slice(0, 3).map((achievement, idx) => (
                                <li key={idx} className="text-sm text-green-700 flex items-center">
                                  <CheckCircle className="h-3 w-3 mr-2" />
                                  {achievement}
                                </li>
                              ))}
                            </ul>
                          </div>
                          
                          <div>
                            <h4 className="font-semibold text-orange-800 mb-2">Strategic Initiatives</h4>
                            <ul className="space-y-1">
                              {selectedReport.executiveSummary.strategicInitiatives.slice(0, 3).map((initiative, idx) => (
                                <li key={idx} className="text-sm text-orange-700 flex items-center">
                                  <Target className="h-3 w-3 mr-2" />
                                  {initiative}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Key Insights */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Lightbulb className="h-5 w-5 mr-2 text-blue-600" />
                        Key Insights
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 gap-3">
                        {selectedReport.keyInsights.map((insight, idx) => (
                          <div key={idx} className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                            <p className="text-sm text-blue-800">{insight}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="content" className="mt-6">
                <div className="space-y-4">
                  {selectedReport.sections.map((section, idx) => (
                    <Card key={idx}>
                      <CardHeader>
                        <CardTitle className="text-lg">{section.title}</CardTitle>
                        <p className="text-sm text-gray-600">
                          Last updated: {section.dataLastUpdated.toLocaleDateString()}
                        </p>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <p className="text-sm text-gray-700">{section.content.summary}</p>
                          
                          {/* Key Metrics */}
                          {section.content.keyMetrics.length > 0 && (
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-3">Key Metrics</h4>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {section.content.keyMetrics.map((metric, metricIdx) => (
                                  <div key={metricIdx} className="p-3 border rounded-lg">
                                    <div className="flex justify-between items-center mb-1">
                                      <span className="text-sm font-medium">{metric.name}</span>
                                      {metric.changeDirection === 'UP' ? 
                                        <ArrowUpRight className="h-4 w-4 text-green-600" /> :
                                        <ArrowUpRight className="h-4 w-4 text-red-600 rotate-90" />
                                      }
                                    </div>
                                    <div className="text-lg font-bold">{metric.value}</div>
                                    <div className="text-xs text-gray-600">
                                      Change: {typeof metric.change === 'number' ? (metric.change * 100).toFixed(1) : metric.change}%
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Charts */}
                          {section.charts.length > 0 && (
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-3">Charts & Visualizations</h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {section.charts.map((chart, chartIdx) => (
                                  <div key={chartIdx} className="p-4 border rounded-lg bg-gray-50">
                                    <div className="flex items-center justify-center h-32">
                                      {chart.type === 'LINE' && <LineChart className="h-16 w-16 text-blue-500" />}
                                      {chart.type === 'BAR' && <BarChart3 className="h-16 w-16 text-green-500" />}
                                      {chart.type === 'PIE' && <PieChart className="h-16 w-16 text-purple-500" />}
                                      {!['LINE', 'BAR', 'PIE'].includes(chart.type) && <BarChart3 className="h-16 w-16 text-gray-500" />}
                                    </div>
                                    <h5 className="font-medium text-center mt-2">{chart.title}</h5>
                                    <div className="text-xs text-gray-600 text-center mt-1">
                                      {chart.insights[0]}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="insights" className="mt-6">
                <div className="space-y-4">
                  {selectedReport.predictiveAnalysis.map((insight, idx) => (
                    <Card key={idx}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            {getInsightIcon(insight.type)}
                            <CardTitle className="text-lg">{insight.title}</CardTitle>
                          </div>
                          <Badge variant="outline" className="text-sm">
                            {(insight.confidence * 100).toFixed(0)}% Confidence
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">{insight.timeHorizon.replace('_', ' ')}</p>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <p className="text-sm text-gray-700">{insight.description}</p>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-2">Key Drivers</h4>
                              <ul className="space-y-1">
                                {insight.keyDrivers.map((driver, driverIdx) => (
                                  <li key={driverIdx} className="text-sm text-gray-600 flex items-center">
                                    <ChevronRight className="h-3 w-3 mr-1" />
                                    {driver}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-2">Impact Assessment</h4>
                              <div className="space-y-2">
                                <div className="flex justify-between">
                                  <span className="text-sm text-gray-600">Financial:</span>
                                  <span className="text-sm font-medium">{insight.potentialImpact.financial}/10</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-sm text-gray-600">Strategic:</span>
                                  <span className="text-sm font-medium">{insight.potentialImpact.strategic}/10</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-sm text-gray-600">Operational:</span>
                                  <span className="text-sm font-medium">{insight.potentialImpact.operational}/10</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div>
                            <h4 className="font-semibold text-gray-900 mb-2">Recommendations</h4>
                            <ul className="space-y-1">
                              {insight.recommendations.map((rec, recIdx) => (
                                <li key={recIdx} className="text-sm text-gray-700 flex items-center">
                                  <Zap className="h-3 w-3 mr-2 text-yellow-500" />
                                  {rec}
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Eye className="h-5 w-5 mr-2 text-blue-600" />
                        Report Engagement
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span>Total Views</span>
                          <span className="font-semibold">24</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Downloads</span>
                          <span className="font-semibold">8</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Avg. Time Spent</span>
                          <span className="font-semibold">7m 12s</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Sharing Rate</span>
                          <span className="font-semibold">33%</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Star className="h-5 w-5 mr-2 text-yellow-600" />
                        Section Engagement
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm">Executive Summary</span>
                            <span className="text-sm">92%</span>
                          </div>
                          <Progress value={92} className="h-2" />
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm">Performance Analysis</span>
                            <span className="text-sm">87%</span>
                          </div>
                          <Progress value={87} className="h-2" />
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm">Portfolio Activity</span>
                            <span className="text-sm">71%</span>
                          </div>
                          <Progress value={71} className="h-2" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
                        Report Quality
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span>Clarity Rating</span>
                          <span className="font-semibold">4.3/5</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Usefulness</span>
                          <span className="font-semibold">4.6/5</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Timeliness</span>
                          <span className="font-semibold">4.1/5</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Overall Rating</span>
                          <span className="font-semibold">4.3/5</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Clock className="h-5 w-5 mr-2 text-orange-600" />
                        Automation Metrics
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span>Generation Time</span>
                          <span className="font-semibold">4.2 min</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Manual Review Time</span>
                          <span className="font-semibold">12 min</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Total Time Saved</span>
                          <span className="font-semibold">3.8 hours</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Automation Rate</span>
                          <span className="font-semibold">85%</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <FileText className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Select a Report</h3>
                <p className="text-gray-600 text-center">Choose a report from the library to view details and insights</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

export default ExecutiveReportingDashboard