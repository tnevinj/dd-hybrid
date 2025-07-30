'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { UnifiedAsset } from '@/types/portfolio'
import {
  AlertTriangle,
  Shield,
  TrendingDown,
  Activity,
  Eye,
  FileText,
  Clock,
  Target
} from 'lucide-react'

interface AssetRiskAssessmentProps {
  asset: UnifiedAsset
}

export function AssetRiskAssessment({ asset }: AssetRiskAssessmentProps) {
  const getRiskColor = (rating: string) => {
    switch (rating.toLowerCase()) {
      case 'low':
        return 'text-green-600 bg-green-100'
      case 'medium':
        return 'text-yellow-600 bg-yellow-100'
      case 'high':
        return 'text-orange-600 bg-orange-100'
      case 'critical':
        return 'text-red-600 bg-red-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const getRiskScore = (rating: string) => {
    switch (rating.toLowerCase()) {
      case 'low':
        return 25
      case 'medium':
        return 50
      case 'high':
        return 75
      case 'critical':
        return 100
      default:
        return 50
    }
  }

  const generateRiskFactors = () => {
    const baseRisks = [
      {
        category: 'Market Risk',
        level: asset.riskRating === 'low' ? 'Low' : asset.riskRating === 'high' ? 'High' : 'Medium',
        description: 'Risk from market volatility and economic conditions',
        mitigation: 'Diversified portfolio exposure and regular market monitoring'
      },
      {
        category: 'Operational Risk',
        level: asset.riskRating === 'critical' ? 'High' : 'Medium',
        description: 'Risk from day-to-day operational challenges',
        mitigation: 'Strong management team and operational oversight'
      },
      {
        category: 'Financial Risk',
        level: asset.riskRating === 'low' ? 'Low' : 'Medium',
        description: 'Risk from financial leverage and cash flow variability',
        mitigation: 'Conservative debt structure and cash flow monitoring'
      },
      {
        category: 'Regulatory Risk',
        level: asset.assetType === 'infrastructure' ? 'Medium' : 'Low',
        description: 'Risk from regulatory changes and compliance requirements',
        mitigation: 'Active regulatory monitoring and compliance programs'
      }
    ]

    // Add asset-specific risks
    if (asset.assetType === 'real_estate') {
      baseRisks.push({
        category: 'Property Risk',
        level: 'Medium',
        description: 'Risk from property-specific factors and local market conditions',
        mitigation: 'Regular property inspections and market analysis'
      })
    } else if (asset.assetType === 'traditional') {
      baseRisks.push({
        category: 'Technology Risk',
        level: asset.sector === 'Technology' ? 'High' : 'Low',
        description: 'Risk from technological disruption and innovation',
        mitigation: 'Continuous technology assessment and adaptation'
      })
    } else if (asset.assetType === 'infrastructure') {
      baseRisks.push({
        category: 'Environmental Risk',
        level: 'Medium',
        description: 'Risk from environmental factors and climate change',
        mitigation: 'Environmental monitoring and climate adaptation measures'
      })
    }

    return baseRisks
  }

  const riskFactors = generateRiskFactors()

  const generateStressTests = () => {
    return [
      {
        scenario: 'Economic Recession',
        impact: asset.assetType === 'traditional' ? -35 : -20,
        probability: 20,
        description: 'Severe economic downturn lasting 18 months'
      },
      {
        scenario: 'Interest Rate Spike',
        impact: asset.assetType === 'real_estate' ? -25 : -15,
        probability: 25,
        description: 'Interest rates increase by 300+ basis points'
      },
      {
        scenario: 'Sector Disruption',
        impact: asset.sector === 'Technology' ? -40 : -10,
        probability: 15,
        description: 'Major technological disruption in sector'
      },
      {
        scenario: 'Regulatory Change',
        impact: asset.assetType === 'infrastructure' ? -30 : -10,
        probability: 30,
        description: 'Adverse regulatory changes affecting operations'
      }
    ]
  }

  const stressTests = generateStressTests()

  const calculateVaR = () => {
    // Simplified VaR calculation based on asset volatility
    const baseVolatility = asset.riskRating === 'low' ? 0.15 : 
                          asset.riskRating === 'medium' ? 0.25 : 
                          asset.riskRating === 'high' ? 0.35 : 0.50
    return asset.currentValue * baseVolatility * 1.65 // 95% confidence interval
  }

  return (
    <div className="space-y-6">
      {/* Risk Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5" />
              <span>Overall Risk</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">
                <Badge className={`${getRiskColor(asset.riskRating)} text-2xl px-4 py-2`}>
                  {asset.riskRating.toUpperCase()}
                </Badge>
              </div>
              <Progress value={getRiskScore(asset.riskRating)} className="h-3 mt-4" />
              <div className="text-sm text-gray-600 mt-2">
                Risk Score: {getRiskScore(asset.riskRating)}/100
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingDown className="h-5 w-5" />
              <span>Value at Risk (95%)</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-3xl font-bold text-red-600 mb-2">
                ${(calculateVaR() / 1000000).toFixed(1)}M
              </div>
              <div className="text-sm text-gray-600">
                Potential loss in worst-case scenario
              </div>
              <div className="text-xs text-gray-500 mt-2">
                {((calculateVaR() / asset.currentValue) * 100).toFixed(1)}% of current value
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5" />
              <span>Risk Mitigation</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {asset.riskRating === 'low' ? '85%' : 
                 asset.riskRating === 'medium' ? '70%' : 
                 asset.riskRating === 'high' ? '55%' : '40%'}
              </div>
              <div className="text-sm text-gray-600">
                Risk factors mitigated
              </div>
              <Progress 
                value={asset.riskRating === 'low' ? 85 : 
                       asset.riskRating === 'medium' ? 70 : 
                       asset.riskRating === 'high' ? 55 : 40} 
                className="h-2 mt-2" 
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Risk Factors Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="h-5 w-5" />
            <span>Risk Factors Analysis</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {riskFactors.map((risk, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <h4 className="font-semibold text-gray-900">{risk.category}</h4>
                    <Badge className={getRiskColor(risk.level)}>
                      {risk.level}
                    </Badge>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-3">{risk.description}</p>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-xs font-medium text-gray-700 mb-1">Mitigation Strategy:</div>
                  <div className="text-xs text-gray-600">{risk.mitigation}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Stress Testing */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="h-5 w-5" />
            <span>Stress Test Scenarios</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stressTests.map((test, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-900">{test.scenario}</h4>
                  <div className="flex items-center space-x-3">
                    <Badge variant="outline" className="text-xs">
                      {test.probability}% probability
                    </Badge>
                    <Badge className={test.impact < -30 ? 'bg-red-100 text-red-800' : 
                                    test.impact < -20 ? 'bg-orange-100 text-orange-800' : 
                                    'bg-yellow-100 text-yellow-800'}>
                      {test.impact}% impact
                    </Badge>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-3">{test.description}</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <div className="text-gray-600">Potential Loss</div>
                    <div className="font-semibold text-red-600">
                      ${((asset.currentValue * Math.abs(test.impact)) / 100 / 1000000).toFixed(1)}M
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-600">Recovery Time</div>
                    <div className="font-semibold">
                      {test.impact < -30 ? '2-3 years' : 
                       test.impact < -20 ? '1-2 years' : '6-12 months'}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-600">Preparedness</div>
                    <div className="font-semibold text-green-600">
                      {asset.riskRating === 'low' ? 'High' : 
                       asset.riskRating === 'medium' ? 'Medium' : 'Low'}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Risk Monitoring */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Eye className="h-5 w-5" />
              <span>Risk Monitoring</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Last Risk Review</span>
              <span className="text-sm font-semibold">
                {asset.lastUpdated ? new Date(asset.lastUpdated).toLocaleDateString() : 'N/A'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Next Review Due</span>
              <span className="text-sm font-semibold">
                {asset.nextReviewDate ? new Date(asset.nextReviewDate).toLocaleDateString() : 'N/A'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Monitoring Frequency</span>
              <Badge variant="outline">
                {asset.riskRating === 'critical' ? 'Weekly' : 
                 asset.riskRating === 'high' ? 'Monthly' : 'Quarterly'}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Risk Alerts</span>
              <Badge variant="outline" className="bg-green-50 text-green-700">
                Active
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>Risk Documentation</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
              <div className="flex items-center space-x-2">
                <FileText className="h-4 w-4 text-gray-500" />
                <span className="text-sm">Risk Assessment Report</span>
              </div>
              <Badge variant="outline" className="text-xs">
                Current
              </Badge>
            </div>
            <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
              <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4 text-gray-500" />
                <span className="text-sm">Mitigation Plan</span>
              </div>
              <Badge variant="outline" className="text-xs">
                Updated
              </Badge>
            </div>
            <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-gray-500" />
                <span className="text-sm">Monitoring Dashboard</span>
              </div>
              <Badge variant="outline" className="text-xs">
                Live
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Risk Trend Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="h-5 w-5" />
            <span>Risk Trend Analysis</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="text-sm text-gray-600 mb-4">
              Risk level has remained stable over the past 12 months
            </div>
            <div className="flex items-center justify-center space-x-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-600">12m ago</div>
                <Badge className={getRiskColor(asset.riskRating)}>
                  {asset.riskRating.toUpperCase()}
                </Badge>
              </div>
              <div className="flex-1 h-px bg-gray-300 mx-4"></div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-600">Today</div>
                <Badge className={getRiskColor(asset.riskRating)}>
                  {asset.riskRating.toUpperCase()}
                </Badge>
              </div>
            </div>
            <div className="mt-4 text-xs text-gray-500">
              Next review: {asset.nextReviewDate ? new Date(asset.nextReviewDate).toLocaleDateString() : 'TBD'}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}