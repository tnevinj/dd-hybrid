'use client'

import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { 
  BarChart3,
  TrendingUp,
  TrendingDown,
  Target,
  Globe,
  Building,
  Users,
  Calendar,
  Award,
  RefreshCw,
  Download,
  Filter,
  Search,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Brain,
  Database,
  LineChart
} from 'lucide-react'
import { OperationalBenchmark } from '@/types/due-diligence'

interface OperationalBenchmarkingProps {
  projectId: string
  sector: string
  region: string
  companySize: 'small' | 'medium' | 'large'
  mode?: 'traditional' | 'assisted' | 'autonomous'
}

export function OperationalBenchmarking({ 
  projectId, 
  sector, 
  region, 
  companySize,
  mode = 'assisted' 
}: OperationalBenchmarkingProps) {
  const [selectedBenchmark, setSelectedBenchmark] = React.useState<string>('industry')
  const [viewMode, setViewMode] = React.useState<'comparison' | 'trends' | 'peers'>('comparison')

  // Mock benchmarking data
  const industryBenchmarks: OperationalBenchmark = {
    industry: sector,
    region,
    companySize,
    benchmarkMetrics: {
      processEfficiency: { value: 82, percentile: 75, source: 'McKinsey Global Operations Study 2024' },
      costOptimization: { value: 76, percentile: 60, source: 'Deloitte Operational Excellence Report' },
      automationLevel: { value: 68, percentile: 70, source: 'BCG Automation Index' },
      digitalMaturity: { value: 71, percentile: 65, source: 'MIT Digital Maturity Survey' },
      qualityScore: { value: 88, percentile: 80, source: 'ISO Quality Standards Database' },
      customerSatisfaction: { value: 4.2, percentile: 70, source: 'Industry Customer Survey' },
      employeeProductivity: { value: 85, percentile: 75, source: 'HR Productivity Benchmarks' },
      timeToMarket: { value: 12, percentile: 65, source: 'Product Development Study' }
    },
    lastUpdated: new Date('2024-01-15')
  }

  const regionalBenchmarks = {
    'North America': {
      processEfficiency: 85,
      costOptimization: 79,
      automationLevel: 72,
      digitalMaturity: 76
    },
    'Europe': {
      processEfficiency: 83,
      costOptimization: 77,
      automationLevel: 69,
      digitalMaturity: 74
    },
    'Asia Pacific': {
      processEfficiency: 81,
      costOptimization: 75,
      automationLevel: 74,
      digitalMaturity: 78
    }
  }

  const sizeBenchmarks = {
    small: {
      processEfficiency: 78,
      costOptimization: 72,
      automationLevel: 62,
      digitalMaturity: 65
    },
    medium: {
      processEfficiency: 82,
      costOptimization: 76,
      automationLevel: 68,
      digitalMaturity: 71
    },
    large: {
      processEfficiency: 87,
      costOptimization: 81,
      automationLevel: 75,
      digitalMaturity: 79
    }
  }

  const topPerformers = [
    {
      name: 'TechCorp Solutions',
      sector: 'SaaS',
      size: 'large',
      processEfficiency: 94,
      costOptimization: 89,
      automationLevel: 85,
      digitalMaturity: 92,
      keyPractices: [
        'AI-powered process automation',
        'Real-time performance monitoring',
        'Continuous improvement culture',
        'Cross-functional teams'
      ]
    },
    {
      name: 'InnovateTech',
      sector: 'SaaS',
      size: 'medium',
      processEfficiency: 91,
      costOptimization: 86,
      automationLevel: 82,
      digitalMaturity: 88,
      keyPractices: [
        'Lean methodology implementation',
        'Automated testing pipelines',
        'Customer-centric design',
        'Data-driven decision making'
      ]
    },
    {
      name: 'CloudScale Inc',
      sector: 'SaaS',
      size: 'medium',
      processEfficiency: 89,
      costOptimization: 84,
      automationLevel: 79,
      digitalMaturity: 86,
      keyPractices: [
        'DevOps culture',
        'Microservices architecture',
        'Predictive analytics',
        'Agile development'
      ]
    }
  ]

  const currentMetrics = {
    processEfficiency: 78,
    costOptimization: 65,
    automationLevel: 58,
    digitalMaturity: 63,
    qualityScore: 82,
    customerSatisfaction: 4.1,
    employeeProductivity: 76,
    timeToMarket: 18
  }

  const trendData = [
    { period: 'Q1 2023', processEfficiency: 72, costOptimization: 60, automationLevel: 52 },
    { period: 'Q2 2023', processEfficiency: 74, costOptimization: 62, automationLevel: 54 },
    { period: 'Q3 2023', processEfficiency: 76, costOptimization: 63, automationLevel: 56 },
    { period: 'Q4 2023', processEfficiency: 78, costOptimization: 65, automationLevel: 58 }
  ]

  const getPerformanceIndicator = (current: number, benchmark: number) => {
    const diff = current - benchmark
    if (Math.abs(diff) < 2) return { icon: Minus, color: 'text-gray-500', label: 'at benchmark' }
    if (diff > 0) return { icon: ArrowUpRight, color: 'text-green-500', label: `+${diff.toFixed(1)}% above` }
    return { icon: ArrowDownRight, color: 'text-red-500', label: `${diff.toFixed(1)}% below` }
  }

  const renderBenchmarkComparison = () => (
    <div className="space-y-6">
      {/* Overall Performance */}
      <Card className="p-4">
        <h4 className="font-medium mb-4">Performance vs Industry Benchmarks</h4>
        <div className="space-y-4">
          {Object.entries(industryBenchmarks.benchmarkMetrics).map(([key, benchmark]) => {
            const current = currentMetrics[key as keyof typeof currentMetrics]
            if (current === undefined) return null
            
            const indicator = getPerformanceIndicator(current, benchmark.value)
            const Icon = indicator.icon
            
            return (
              <div key={key} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                    <div className="flex items-center space-x-2">
                      <Icon className={`w-4 h-4 ${indicator.color}`} />
                      <span className={`text-sm ${indicator.color}`}>
                        {indicator.label}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="flex-1">
                      <div className="flex justify-between text-xs text-gray-600 mb-1">
                        <span>Your Score: {current}%</span>
                        <span>Industry Avg: {benchmark.value}%</span>
                      </div>
                      <Progress value={(current / Math.max(current, benchmark.value)) * 100} className="h-2" />
                    </div>
                    <div className="text-right min-w-[80px]">
                      <div className="text-sm font-medium">{benchmark.percentile}th</div>
                      <div className="text-xs text-gray-600">percentile</div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </Card>

      {/* Regional Comparison */}
      <Card className="p-4">
        <h4 className="font-medium mb-4">Regional Performance Comparison</h4>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Metric</th>
                <th className="text-center py-2">Your Score</th>
                <th className="text-center py-2">North America</th>
                <th className="text-center py-2">Europe</th>
                <th className="text-center py-2">Asia Pacific</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(regionalBenchmarks['North America']).map(([metric, _]) => (
                <tr key={metric} className="border-b">
                  <td className="py-2 font-medium capitalize">
                    {metric.replace(/([A-Z])/g, ' $1').trim()}
                  </td>
                  <td className="text-center py-2">
                    <Badge variant="outline">{currentMetrics[metric as keyof typeof currentMetrics]}%</Badge>
                  </td>
                  {Object.entries(regionalBenchmarks).map(([region, data]) => (
                    <td key={region} className="text-center py-2">
                      {data[metric as keyof typeof data]}%
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Company Size Comparison */}
      <Card className="p-4">
        <h4 className="font-medium mb-4">Performance by Company Size</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(sizeBenchmarks).map(([size, metrics]) => (
            <div key={size} className={`p-4 rounded-lg border-2 ${
              size === companySize ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
            }`}>
              <div className="flex items-center justify-between mb-3">
                <h5 className="font-medium capitalize">{size} Companies</h5>
                {size === companySize && (
                  <Badge variant="default">Your Category</Badge>
                )}
              </div>
              <div className="space-y-2">
                {Object.entries(metrics).map(([metric, value]) => (
                  <div key={metric} className="flex justify-between text-sm">
                    <span className="text-gray-600 capitalize">
                      {metric.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                    <span className="font-medium">{value}%</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )

  const renderTrendAnalysis = () => (
    <div className="space-y-6">
      <Card className="p-4">
        <h4 className="font-medium mb-4">Performance Trends</h4>
        <div className="space-y-4">
          {['processEfficiency', 'costOptimization', 'automationLevel'].map((metric) => (
            <div key={metric} className="border rounded-lg p-4">
              <h5 className="font-medium mb-3 capitalize">
                {metric.replace(/([A-Z])/g, ' $1').trim()}
              </h5>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Quarterly Progress</span>
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-green-600">+6% improvement</span>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {trendData.map((data, index) => (
                  <div key={index} className="text-center p-2 bg-gray-50 rounded">
                    <div className="text-xs text-gray-600">{data.period}</div>
                    <div className="font-medium">{data[metric as keyof typeof data]}%</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-4">
        <h4 className="font-medium mb-4">Improvement Trajectory</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-green-50 rounded-lg">
            <h5 className="font-medium text-green-800 mb-2">Strongest Improvements</h5>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Process Efficiency</span>
                <span className="font-medium text-green-600">+6%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Cost Optimization</span>
                <span className="font-medium text-green-600">+5%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Automation Level</span>
                <span className="font-medium text-green-600">+6%</span>
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-red-50 rounded-lg">
            <h5 className="font-medium text-red-800 mb-2">Areas Needing Focus</h5>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Digital Maturity</span>
                <span className="font-medium text-red-600">-2%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Time to Market</span>
                <span className="font-medium text-red-600">+3 weeks</span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )

  const renderPeerAnalysis = () => (
    <div className="space-y-6">
      <Card className="p-4">
        <h4 className="font-medium mb-4">Top Performing Peers</h4>
        <div className="space-y-4">
          {topPerformers.map((peer, index) => (
            <div key={index} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h5 className="font-medium">{peer.name}</h5>
                  <p className="text-sm text-gray-600">
                    {peer.sector} • {peer.size} company
                  </p>
                </div>
                <Badge variant={index === 0 ? 'default' : 'secondary'}>
                  {index === 0 ? 'Top Performer' : `#${index + 1} Performer`}
                </Badge>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                {Object.entries(peer).filter(([key]) => 
                  ['processEfficiency', 'costOptimization', 'automationLevel', 'digitalMaturity'].includes(key)
                ).map(([key, value]) => (
                  <div key={key} className="text-center p-2 bg-gray-50 rounded">
                    <div className="text-xs text-gray-600 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </div>
                    <div className="font-medium">{value}%</div>
                  </div>
                ))}
              </div>

              <div>
                <h6 className="text-sm font-medium mb-2">Key Practices</h6>
                <div className="flex flex-wrap gap-2">
                  {peer.keyPractices.map((practice, i) => (
                    <Badge key={i} variant="outline" className="text-xs">
                      {practice}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-4">
        <h4 className="font-medium mb-4">Best Practice Analysis</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <h5 className="font-medium">Most Common Success Factors</h5>
            <div className="space-y-2">
              {[
                { practice: 'Process Automation', adoption: 89 },
                { practice: 'Data-Driven Decisions', adoption: 84 },
                { practice: 'Continuous Improvement', adoption: 78 },
                { practice: 'Cross-Functional Teams', adoption: 73 }
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm">{item.practice}</span>
                  <div className="flex items-center space-x-2">
                    <Progress value={item.adoption} className="w-16 h-2" />
                    <span className="text-xs text-gray-600">{item.adoption}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="space-y-3">
            <h5 className="font-medium">Implementation Priorities</h5>
            <div className="space-y-2">
              {[
                { priority: 'Automation Implementation', urgency: 'high' },
                { priority: 'Digital Platform Integration', urgency: 'high' },
                { priority: 'Performance Analytics', urgency: 'medium' },
                { priority: 'Team Structure Optimization', urgency: 'medium' }
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between p-2 border rounded">
                  <span className="text-sm">{item.priority}</span>
                  <Badge variant={item.urgency === 'high' ? 'destructive' : 'secondary'}>
                    {item.urgency}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-green-100 rounded-lg">
            <BarChart3 className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">Operational Benchmarking</h2>
            <p className="text-gray-600">Industry and peer performance comparison</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="text-sm">
            <Globe className="w-3 h-3 mr-1" />
            {region}
          </Badge>
          <Badge variant="outline" className="text-sm">
            <Building className="w-3 h-3 mr-1" />
            {companySize}
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
            Update Data
          </Button>
        </div>
      </div>

      {/* Data Sources */}
      <Card className="p-4 bg-blue-50 border-blue-200">
        <div className="flex items-center space-x-2 mb-2">
          <Database className="w-4 h-4 text-blue-600" />
          <h4 className="font-medium text-blue-800">Benchmark Data Sources</h4>
        </div>
        <div className="text-sm text-blue-700">
          Data aggregated from McKinsey Global Operations Study, Deloitte Excellence Reports, 
          BCG Automation Index, and MIT Digital Maturity Survey. Last updated: {industryBenchmarks.lastUpdated.toLocaleDateString()}
        </div>
      </Card>

      {/* View Mode Tabs */}
      <div className="border-b">
        <nav className="flex space-x-8">
          {[
            { id: 'comparison', label: 'Benchmark Comparison', icon: BarChart3 },
            { id: 'trends', label: 'Trend Analysis', icon: LineChart },
            { id: 'peers', label: 'Peer Analysis', icon: Users }
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
                    ? 'border-green-500 text-green-600' 
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
        {viewMode === 'comparison' && renderBenchmarkComparison()}
        {viewMode === 'trends' && renderTrendAnalysis()}
        {viewMode === 'peers' && renderPeerAnalysis()}
      </div>
    </div>
  )
}