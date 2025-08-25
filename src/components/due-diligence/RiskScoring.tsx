'use client'

import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Target,
  Brain,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Settings,
  RefreshCw,
  Zap
} from 'lucide-react'

interface RiskScoringProps {
  risks: any[]
}

export function RiskScoring({ risks }: RiskScoringProps) {
  const [scoringMethod, setScoringMethod] = React.useState<'ai' | 'manual' | 'hybrid'>('ai')
  const [showDetails, setShowDetails] = React.useState(false)

  // Calculate scoring metrics
  const averageScore = risks.length > 0 
    ? risks.reduce((sum, risk) => sum + risk.riskScore, 0) / risks.length 
    : 0

  const scoreDistribution = {
    high: risks.filter(r => r.riskScore >= 7).length,
    medium: risks.filter(r => r.riskScore >= 4 && r.riskScore < 7).length,
    low: risks.filter(r => r.riskScore < 4).length
  }

  const aiGeneratedCount = risks.filter(r => r.aiGenerated).length
  const aiAccuracy = risks.length > 0 ? (aiGeneratedCount / risks.length) * 100 : 0

  // Sample industry benchmarks
  const benchmarks = [
    { industry: 'SaaS', avgScore: 5.8, range: '4.2 - 7.4' },
    { industry: 'E-commerce', avgScore: 6.2, range: '4.8 - 7.8' },
    { industry: 'Manufacturing', avgScore: 6.8, range: '5.1 - 8.2' },
    { industry: 'Healthcare', avgScore: 7.1, range: '5.6 - 8.6' }
  ]

  const scoringFactors = [
    {
      factor: 'Financial Impact',
      weight: 35,
      description: 'Potential revenue/cost impact',
      score: 7.2,
      confidence: 0.91
    },
    {
      factor: 'Probability',
      weight: 25,
      description: 'Likelihood of occurrence',
      score: 6.8,
      confidence: 0.87
    },
    {
      factor: 'Market Context',
      weight: 20,
      description: 'Industry and market factors',
      score: 5.9,
      confidence: 0.94
    },
    {
      factor: 'Historical Data',
      weight: 15,
      description: 'Similar deal patterns',
      score: 8.1,
      confidence: 0.89
    },
    {
      factor: 'Mitigation Ease',
      weight: 5,
      description: 'Difficulty to resolve',
      score: 4.3,
      confidence: 0.76
    }
  ]

  const renderScoringOverview = () => (
    <div className="space-y-4">
      {/* Current Score Metrics */}
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center p-4 bg-blue-50 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">{averageScore.toFixed(1)}/10</div>
          <div className="text-sm text-blue-700">Average Risk Score</div>
          <div className="text-xs text-blue-600 mt-1">
            {averageScore > 7 ? '⚠️ Above average' : 
             averageScore > 5 ? '📊 Moderate risk' : 
             '✅ Below average'}
          </div>
        </div>
        
        <div className="text-center p-4 bg-blue-50 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">{aiAccuracy.toFixed(0)}%</div>
          <div className="text-sm text-blue-700">AI Scored</div>
          <div className="text-xs text-blue-600 mt-1 flex items-center justify-center">
            <Brain className="w-3 h-3 mr-1" />
            {aiGeneratedCount}/{risks.length} risks
          </div>
        </div>
      </div>

      {/* Score Distribution */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium">Score Distribution</h4>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-red-600">High Risk (7-10)</span>
            <div className="flex items-center space-x-2">
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-red-500 h-2 rounded-full" 
                  style={{ width: `${(scoreDistribution.high / risks.length) * 100}%` }}
                />
              </div>
              <span className="text-sm font-medium">{scoreDistribution.high}</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-orange-600">Medium Risk (4-6.9)</span>
            <div className="flex items-center space-x-2">
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-orange-500 h-2 rounded-full" 
                  style={{ width: `${(scoreDistribution.medium / risks.length) * 100}%` }}
                />
              </div>
              <span className="text-sm font-medium">{scoreDistribution.medium}</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-green-600">Low Risk (0-3.9)</span>
            <div className="flex items-center space-x-2">
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full" 
                  style={{ width: `${(scoreDistribution.low / risks.length) * 100}%` }}
                />
              </div>
              <span className="text-sm font-medium">{scoreDistribution.low}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderScoringFactors = () => (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium">AI Scoring Factors</h4>
        <Badge variant="ai" className="text-xs">
          <Brain className="w-3 h-3 mr-1" />
          Auto-calibrated
        </Badge>
      </div>
      
      <div className="space-y-3">
        {scoringFactors.map((factor, index) => (
          <div key={index} className="border rounded-lg p-3 bg-gray-50">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <h5 className="text-sm font-medium">{factor.factor}</h5>
                <Badge variant="outline" className="text-xs">
                  {factor.weight}%
                </Badge>
              </div>
              <div className="text-sm font-medium text-right">
                <div>{factor.score}/10</div>
                <div className="text-xs text-gray-500">
                  {Math.round(factor.confidence * 100)}% conf
                </div>
              </div>
            </div>
            
            <p className="text-xs text-gray-600 mb-2">{factor.description}</p>
            
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div 
                className={`h-1.5 rounded-full ${
                  factor.score >= 7 ? 'bg-red-500' :
                  factor.score >= 5 ? 'bg-orange-500' :
                  'bg-green-500'
                }`}
                style={{ width: `${(factor.score / 10) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  const renderBenchmarks = () => (
    <div className="space-y-3">
      <h4 className="text-sm font-medium">Industry Benchmarks</h4>
      
      <div className="space-y-2">
        {benchmarks.map((benchmark, index) => (
          <div key={index} className="flex items-center justify-between p-2 border rounded">
            <div>
              <div className="text-sm font-medium">{benchmark.industry}</div>
              <div className="text-xs text-gray-500">Range: {benchmark.range}</div>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium">{benchmark.avgScore}</div>
              <div className="flex items-center text-xs">
                {averageScore > benchmark.avgScore ? (
                  <TrendingUp className="w-3 h-3 text-red-500 mr-1" />
                ) : (
                  <TrendingDown className="w-3 h-3 text-green-500 mr-1" />
                )}
                <span className={averageScore > benchmark.avgScore ? 'text-red-600' : 'text-green-600'}>
                  {Math.abs(averageScore - benchmark.avgScore).toFixed(1)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <Card className="border-l-4 border-l-blue-500">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center text-blue-700">
            <Target className="w-5 h-5 mr-2" />
            Risk Scoring
          </CardTitle>
          <div className="flex items-center space-x-2">
            <select 
              value={scoringMethod}
              onChange={(e) => setScoringMethod(e.target.value as any)}
              className="text-xs border rounded px-2 py-1"
            >
              <option value="ai">AI Scoring</option>
              <option value="manual">Manual Scoring</option>
              <option value="hybrid">Hybrid Approach</option>
            </select>
            <Button variant="outline" size="sm">
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Overview Metrics */}
          {renderScoringOverview()}
          
          {/* Toggle Details */}
          <div className="flex items-center justify-between pt-4 border-t">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setShowDetails(!showDetails)}
              className="flex items-center space-x-2"
            >
              <BarChart3 className="w-4 h-4" />
              <span>{showDetails ? 'Hide' : 'Show'} Scoring Details</span>
            </Button>
            
            {scoringMethod === 'ai' && (
              <Button variant="ai" size="sm">
                <Zap className="w-4 h-4 mr-2" />
                Recalibrate AI
              </Button>
            )}
          </div>
          
          {/* Detailed Views */}
          {showDetails && (
            <div className="grid grid-cols-1 gap-6 pt-4 border-t">
              {scoringMethod === 'ai' && renderScoringFactors()}
              {renderBenchmarks()}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}