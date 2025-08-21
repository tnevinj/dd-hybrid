'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  BarChart3,
  TrendingUp,
  TrendingDown,
  Target,
  Award,
  Users,
  Activity,
  Shield,
  Briefcase,
  FileText,
  Brain,
  Search,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
  ChevronRight,
  Trophy,
  AlertTriangle,
  CheckCircle,
  Zap
} from 'lucide-react'

import { 
  IndustryBenchmarkingEngine, 
  IndustryBenchmarks, 
  ModuleBenchmark, 
  BenchmarkData 
} from '@/lib/analytics/industry-benchmarking'

interface IndustryBenchmarkingDashboardProps {
  mode?: 'traditional' | 'assisted' | 'autonomous'
}

export function IndustryBenchmarkingDashboard({ mode = 'traditional' }: IndustryBenchmarkingDashboardProps) {
  const [benchmarks, setBenchmarks] = useState<IndustryBenchmarks | null>(null)
  const [insights, setInsights] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedModule, setSelectedModule] = useState<string>('overview')

  useEffect(() => {
    loadBenchmarkData()
  }, [])

  const loadBenchmarkData = async () => {
    setLoading(true)
    
    // Mock fund data - in real implementation, this would come from actual fund metrics
    const mockFundData = {
      portfolio: {
        irr: 19.2,
        moic: 2.6,
        dpi: 0.72,
        tvpi: 2.8
      },
      dueDiligence: {
        ddDuration: 68,
        ddAccuracy: 0.91,
        riskIdentification: 0.88,
        postDealPerformance: 0.84
      },
      legal: {
        complianceScore: 97,
        legalCosts: 0.023,
        documentTurnaround: 6,
        regulatoryIssues: 0.5
      },
      operations: {
        operationalEfficiency: 0.92,
        costRatio: 0.014,
        dataAccuracy: 0.97,
        reportingSpeed: 8
      }
    }

    try {
      const benchmarkData = IndustryBenchmarkingEngine.generateComprehensiveBenchmarks(mockFundData)
      setBenchmarks(benchmarkData)

      const benchmarkInsights = IndustryBenchmarkingEngine.getBenchmarkInsights(benchmarkData)
      setInsights(benchmarkInsights)
    } catch (error) {
      console.error('Error loading benchmark data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getGradeColor = (grade: string): string => {
    switch (grade) {
      case 'A+':
      case 'A': return 'text-green-600 bg-green-100'
      case 'B+':
      case 'B': return 'text-blue-600 bg-blue-100'
      case 'C+':
      case 'C': return 'text-orange-600 bg-orange-100'
      default: return 'text-red-600 bg-red-100'
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving': return <TrendingUp className="h-4 w-4 text-green-600" />
      case 'declining': return <TrendingDown className="h-4 w-4 text-red-600" />
      default: return <Activity className="h-4 w-4 text-gray-600" />
    }
  }

  const formatMetricValue = (metric: BenchmarkData): string => {
    if (metric.metric.includes('%') || metric.metric.includes('Rate') || metric.metric.includes('Score')) {
      return `${(typeof metric.fundValue === 'number' && metric.fundValue < 1) ? 
        (metric.fundValue * 100).toFixed(1) + '%' : 
        metric.fundValue.toString()}`
    }
    if (metric.metric.includes('Days')) {
      return `${metric.fundValue} days`
    }
    if (metric.metric.includes('IRR')) {
      return `${metric.fundValue}%`
    }
    return metric.fundValue.toString()
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <RefreshCw className="h-8 w-8 animate-spin text-blue-600 mb-4" />
        <h3 className="text-xl font-semibold text-gray-700">Loading Industry Benchmarks...</h3>
      </div>
    )
  }

  if (!benchmarks) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <AlertTriangle className="h-8 w-8 text-red-600 mb-4" />
        <h3 className="text-xl font-semibold text-gray-700">Unable to load benchmark data</h3>
      </div>
    )
  }

  const modules = [
    { key: 'portfolioManagement', data: benchmarks.portfolioManagement, icon: BarChart3 },
    { key: 'dueDiligence', data: benchmarks.dueDiligence, icon: Search },
    { key: 'legalManagement', data: benchmarks.legalManagement, icon: Shield },
    { key: 'dealScreening', data: benchmarks.dealScreening, icon: Target },
    { key: 'fundOperations', data: benchmarks.fundOperations, icon: Activity },
    { key: 'investmentCommittee', data: benchmarks.investmentCommittee, icon: Users },
    { key: 'marketIntelligence', data: benchmarks.marketIntelligence, icon: Brain }
  ]

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Trophy className="h-8 w-8 mr-3 text-yellow-600" />
            Industry Benchmarking
          </h1>
          <p className="text-gray-600 mt-1">Comprehensive performance analysis across all fund management modules</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button onClick={loadBenchmarkData} variant="outline" className="flex items-center space-x-2">
            <RefreshCw className="h-4 w-4" />
            <span>Refresh Data</span>
          </Button>
        </div>
      </div>

      <Tabs value={selectedModule} onValueChange={setSelectedModule} className="w-full">
        <TabsList className="grid w-fit grid-cols-2">
          <TabsTrigger value="overview">Industry Overview</TabsTrigger>
          <TabsTrigger value="detailed">Detailed Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          {/* Overall Fund Ranking */}
          <Card className="mb-6 border-2 border-yellow-200 bg-gradient-to-r from-yellow-50 to-orange-50">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-3 text-2xl">
                <Award className="h-8 w-8 text-yellow-600" />
                Industry Ranking
              </CardTitle>
              <div className="text-4xl font-bold text-gray-900">
                #{benchmarks.overallFundRanking.industryRank}
              </div>
              <p className="text-lg text-gray-600">
                out of {benchmarks.overallFundRanking.totalFunds} funds • 
                <span className={`ml-2 px-2 py-1 rounded-full text-sm font-semibold ${getGradeColor(benchmarks.overallFundRanking.grade)}`}>
                  {benchmarks.overallFundRanking.grade} Grade
                </span>
              </p>
              <p className="text-sm text-gray-500">
                {benchmarks.overallFundRanking.percentile.toFixed(0)}th percentile performance
              </p>
            </CardHeader>
          </Card>

          {/* Module Performance Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
            {modules.map(({ key, data, icon: Icon }) => (
              <Card key={key} className="hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => setSelectedModule('detailed')}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <Icon className="h-5 w-5 text-blue-600" />
                    <Badge className={getGradeColor(data.grade)}>
                      {data.grade}
                    </Badge>
                  </div>
                  <CardTitle className="text-sm font-medium">{data.moduleName}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Performance</span>
                        <span className="font-semibold">{data.overallScore.toFixed(0)}%</span>
                      </div>
                      <Progress value={data.overallScore} className="h-2" />
                    </div>
                    <div className="text-xs text-gray-600">
                      <p>Better than {data.peerComparison.betterThan.toFixed(0)}% of peers</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex -space-x-1">
                        {data.peerComparison.similarTo.slice(0, 3).map((peer, idx) => (
                          <div key={idx} className="w-6 h-6 bg-gray-300 rounded-full border-2 border-white flex items-center justify-center">
                            <span className="text-xs font-medium">{peer.charAt(0)}</span>
                          </div>
                        ))}
                      </div>
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Key Insights */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
                  Key Strengths
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {insights.filter(i => i.type === 'strength').map((insight, idx) => (
                    <div key={idx} className="p-3 bg-green-50 rounded-lg">
                      <h4 className="font-semibold text-green-900">{insight.title}</h4>
                      <p className="text-sm text-green-700 mt-1">{insight.description}</p>
                      <div className="flex justify-between items-center mt-2">
                        <Badge variant="outline" className="text-green-600 border-green-300">
                          {insight.module}
                        </Badge>
                        <span className="text-xs text-green-600 font-medium">
                          {insight.impact.toUpperCase()} IMPACT
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Zap className="h-5 w-5 mr-2 text-orange-600" />
                  Improvement Opportunities
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {insights.filter(i => i.type === 'opportunity').map((insight, idx) => (
                    <div key={idx} className="p-3 bg-orange-50 rounded-lg">
                      <h4 className="font-semibold text-orange-900">{insight.title}</h4>
                      <p className="text-sm text-orange-700 mt-1">{insight.description}</p>
                      <div className="flex justify-between items-center mt-2">
                        <Badge variant="outline" className="text-orange-600 border-orange-300">
                          {insight.module}
                        </Badge>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-orange-600 font-medium">
                            {insight.impact.toUpperCase()} IMPACT
                          </span>
                          {insight.actionable && (
                            <Button size="sm" variant="outline" className="text-xs">
                              Action Plan
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="detailed" className="mt-6">
          <div className="space-y-6">
            {modules.map(({ key, data, icon: Icon }) => (
              <Card key={key}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-3">
                      <Icon className="h-6 w-6 text-blue-600" />
                      <div>
                        <CardTitle>{data.moduleName}</CardTitle>
                        <p className="text-sm text-gray-600 mt-1">
                          {data.overallScore.toFixed(0)}th percentile • Better than {data.peerComparison.betterThan.toFixed(0)}% of peers
                        </p>
                      </div>
                    </div>
                    <Badge className={`${getGradeColor(data.grade)} text-lg px-3 py-1`}>
                      {data.grade}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  {data.metrics.length > 0 ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {data.metrics.map((metric, idx) => (
                          <div key={idx} className="p-4 border rounded-lg">
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="font-medium text-gray-900 text-sm">{metric.metric}</h4>
                              {getTrendIcon(metric.trend)}
                            </div>
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span>Your Fund:</span>
                                <span className="font-semibold">{formatMetricValue(metric)}</span>
                              </div>
                              <div className="flex justify-between text-sm text-gray-600">
                                <span>Industry Median:</span>
                                <span>{formatMetricValue({...metric, fundValue: metric.industryMedian})}</span>
                              </div>
                              <div className="flex justify-between text-sm text-gray-600">
                                <span>Top Quartile:</span>
                                <span>{formatMetricValue({...metric, fundValue: metric.industryTopQuartile})}</span>
                              </div>
                              <div className="mt-2">
                                <div className="flex justify-between text-xs mb-1">
                                  <span>Percentile</span>
                                  <span className="font-medium">{metric.percentile}%</span>
                                </div>
                                <Progress value={metric.percentile} className="h-1.5" />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div>
                          <h4 className="font-semibold text-green-900 mb-2">Strengths</h4>
                          <ul className="space-y-1">
                            {data.strengths.map((strength, idx) => (
                              <li key={idx} className="text-sm text-green-700 flex items-center">
                                <CheckCircle className="h-3 w-3 mr-2" />
                                {strength}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {data.improvementAreas.length > 0 && (
                          <div>
                            <h4 className="font-semibold text-orange-900 mb-2">Improvement Areas</h4>
                            <ul className="space-y-1">
                              {data.improvementAreas.map((area, idx) => (
                                <li key={idx} className="text-sm text-orange-700 flex items-center">
                                  <ArrowUpRight className="h-3 w-3 mr-2" />
                                  {area}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>

                      <div className="border-t pt-4">
                        <h4 className="font-semibold text-gray-900 mb-2">Peer Comparison</h4>
                        <div className="flex flex-wrap gap-2">
                          {data.peerComparison.similarTo.map((peer, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {peer}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <FileText className="h-8 w-8 mx-auto mb-2" />
                      <p>Detailed metrics coming soon for {data.moduleName}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default IndustryBenchmarkingDashboard