'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { UnifiedAsset } from '@/types/portfolio'
import {
  Leaf,
  Users,
  Building,
  Award,
  Target,
  TrendingUp,
  Globe,
  Heart,
  Shield
} from 'lucide-react'

interface AssetESGMetricsProps {
  asset: UnifiedAsset
}

export function AssetESGMetrics({ asset }: AssetESGMetricsProps) {
  const getESGScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-600'
    if (score >= 6) return 'text-blue-600'
    if (score >= 4) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getESGScoreLabel = (score: number) => {
    if (score >= 8) return 'Excellent'
    if (score >= 6) return 'Good'
    if (score >= 4) return 'Fair'
    return 'Needs Improvement'
  }

  const formatNumber = (value: number | undefined) => {
    if (!value) return 'N/A'
    return new Intl.NumberFormat().format(value)
  }

  const generateESGInitiatives = () => {
    const initiatives = []
    
    // Environmental initiatives
    if (asset.esgMetrics.carbonFootprint !== undefined) {
      initiatives.push({
        category: 'Environmental',
        title: 'Carbon Footprint Reduction',
        description: `Current footprint: ${formatNumber(asset.esgMetrics.carbonFootprint)} tons CO2e`,
        status: 'Active',
        impact: 'High',
        icon: <Leaf className="h-4 w-4" />
      })
    }
    
    // Social initiatives
    if (asset.esgMetrics.jobsCreated !== undefined) {
      initiatives.push({
        category: 'Social',
        title: 'Job Creation Program',
        description: `${formatNumber(asset.esgMetrics.jobsCreated)} jobs created`,
        status: 'Ongoing',
        impact: 'High',
        icon: <Users className="h-4 w-4" />
      })
    }
    
    // Governance initiatives
    initiatives.push({
      category: 'Governance',
      title: 'Board Diversity Initiative',
      description: 'Improving board composition and decision-making processes',
      status: 'In Progress',
      impact: 'Medium',
      icon: <Building className="h-4 w-4" />
    })

    // Asset-specific initiatives
    if (asset.assetType === 'real_estate') {
      initiatives.push({
        category: 'Environmental',
        title: 'Green Building Certification',
        description: 'Pursuing LEED/BREEAM certification for all properties',
        status: 'Planned',
        impact: 'Medium',
        icon: <Leaf className="h-4 w-4" />
      })
    } else if (asset.assetType === 'infrastructure') {
      initiatives.push({
        category: 'Environmental',
        title: 'Renewable Energy Integration',
        description: 'Increasing renewable energy usage in operations',
        status: 'Active',
        impact: 'High',
        icon: <Leaf className="h-4 w-4" />
      })
    }

    return initiatives
  }

  const esgInitiatives = generateESGInitiatives()

  const generateImpactMetrics = () => {
    return [
      {
        metric: 'Carbon Footprint',
        value: asset.esgMetrics.carbonFootprint,
        unit: 'tons CO2e',
        trend: 'decreasing',
        target: asset.esgMetrics.carbonFootprint ? asset.esgMetrics.carbonFootprint * 0.8 : undefined
      },
      {
        metric: 'Jobs Created',
        value: asset.esgMetrics.jobsCreated,
        unit: 'positions',
        trend: 'increasing',
        target: asset.esgMetrics.jobsCreated ? asset.esgMetrics.jobsCreated * 1.2 : undefined
      },
      {
        metric: 'Community Investment',
        value: asset.esgMetrics.communityImpact,
        unit: 'score',
        trend: 'stable',
        target: asset.esgMetrics.communityImpact ? asset.esgMetrics.communityImpact * 1.1 : undefined
      },
      {
        metric: 'Diversity Score',
        value: asset.esgMetrics.diversityScore,
        unit: 'score',
        trend: 'increasing',
        target: asset.esgMetrics.diversityScore ? Math.min(asset.esgMetrics.diversityScore * 1.15, 10) : undefined
      }
    ]
  }

  const impactMetrics = generateImpactMetrics()

  return (
    <div className="space-y-6">
      {/* ESG Score Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className={`text-4xl font-bold ${getESGScoreColor(asset.esgMetrics.overallScore)} mb-2`}>
                {asset.esgMetrics.overallScore.toFixed(1)}
              </div>
              <div className="text-sm text-gray-600 mb-2">Overall ESG Score</div>
              <Badge variant="outline" className={getESGScoreColor(asset.esgMetrics.overallScore)}>
                {getESGScoreLabel(asset.esgMetrics.overallScore)}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Environmental</p>
                <p className={`text-2xl font-bold ${getESGScoreColor(asset.esgMetrics.environmentalScore)}`}>
                  {asset.esgMetrics.environmentalScore.toFixed(1)}
                </p>
              </div>
              <Leaf className="h-8 w-8 text-green-600" />
            </div>
            <Progress value={asset.esgMetrics.environmentalScore * 10} className="h-2 mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Social</p>
                <p className={`text-2xl font-bold ${getESGScoreColor(asset.esgMetrics.socialScore)}`}>
                  {asset.esgMetrics.socialScore.toFixed(1)}
                </p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
            <Progress value={asset.esgMetrics.socialScore * 10} className="h-2 mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Governance</p>
                <p className={`text-2xl font-bold ${getESGScoreColor(asset.esgMetrics.governanceScore)}`}>
                  {asset.esgMetrics.governanceScore.toFixed(1)}
                </p>
              </div>
              <Building className="h-8 w-8 text-blue-600" />
            </div>
            <Progress value={asset.esgMetrics.governanceScore * 10} className="h-2 mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Impact Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="h-5 w-5" />
            <span>Impact Metrics</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {impactMetrics.map((metric, index) => (
              <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {metric.value !== undefined ? formatNumber(metric.value) : 'N/A'}
                </div>
                <div className="text-sm text-gray-600 mb-2">{metric.metric}</div>
                <div className="text-xs text-gray-500">{metric.unit}</div>
                {metric.trend && (
                  <div className="mt-2">
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${
                        metric.trend === 'increasing' ? 'text-green-600 bg-green-50' :
                        metric.trend === 'decreasing' ? 'text-red-600 bg-red-50' :
                        'text-gray-600 bg-gray-50'
                      }`}
                    >
                      {metric.trend}
                    </Badge>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* ESG Initiatives */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Award className="h-5 w-5" />
            <span>ESG Initiatives</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {esgInitiatives.map((initiative, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${
                      initiative.category === 'Environmental' ? 'bg-green-100' :
                      initiative.category === 'Social' ? 'bg-blue-100' : 'bg-blue-100'
                    }`}>
                      {initiative.icon}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{initiative.title}</h4>
                      <div className="text-xs text-gray-500">{initiative.category}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="text-xs">
                      {initiative.status}
                    </Badge>
                    <Badge className={`text-xs ${
                      initiative.impact === 'High' ? 'bg-green-100 text-green-800' :
                      initiative.impact === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {initiative.impact} Impact
                    </Badge>
                  </div>
                </div>
                <p className="text-sm text-gray-600">{initiative.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Sustainability Certifications */}
      {asset.esgMetrics.sustainabilityCertifications.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Award className="h-5 w-5" />
              <span>Sustainability Certifications</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {asset.esgMetrics.sustainabilityCertifications.map((cert, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                  <Award className="h-6 w-6 text-green-600" />
                  <div>
                    <div className="font-semibold text-green-800">{cert}</div>
                    <div className="text-xs text-green-600">Certified</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* ESG Performance Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <span>ESG Score Trends</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600">Environmental</span>
                  <span className="text-sm font-semibold text-green-600">
                    +0.3 vs last year
                  </span>
                </div>
                <Progress value={asset.esgMetrics.environmentalScore * 10} className="h-2" />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600">Social</span>
                  <span className="text-sm font-semibold text-blue-600">
                    +0.1 vs last year
                  </span>
                </div>
                <Progress value={asset.esgMetrics.socialScore * 10} className="h-2" />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600">Governance</span>
                  <span className="text-sm font-semibold text-blue-600">
                    +0.2 vs last year
                  </span>
                </div>
                <Progress value={asset.esgMetrics.governanceScore * 10} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Globe className="h-5 w-5" />
              <span>Sustainable Development Goals</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-2 bg-blue-50 rounded">
                <div className="flex items-center space-x-2">
                  <Heart className="h-4 w-4 text-blue-600" />
                  <span className="text-sm">Decent Work & Economic Growth</span>
                </div>
                <Badge variant="outline" className="text-xs text-blue-600">
                  SDG 8
                </Badge>
              </div>
              <div className="flex items-center justify-between p-2 bg-green-50 rounded">
                <div className="flex items-center space-x-2">
                  <Leaf className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Climate Action</span>
                </div>
                <Badge variant="outline" className="text-xs text-green-600">
                  SDG 13
                </Badge>
              </div>
              <div className="flex items-center justify-between p-2 bg-blue-50 rounded">
                <div className="flex items-center space-x-2">
                  <Shield className="h-4 w-4 text-blue-600" />
                  <span className="text-sm">Peace, Justice & Strong Institutions</span>
                </div>
                <Badge variant="outline" className="text-xs text-blue-600">
                  SDG 16
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ESG Targets & Goals */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="h-5 w-5" />
            <span>ESG Targets & Goals</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-3xl font-bold text-green-600 mb-2">2030</div>
              <div className="text-sm text-gray-600 mb-2">Net Zero Target</div>
              <Progress value={25} className="h-2" />
              <div className="text-xs text-gray-500 mt-1">25% progress</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-3xl font-bold text-blue-600 mb-2">50%</div>
              <div className="text-sm text-gray-600 mb-2">Board Diversity Goal</div>
              <Progress value={60} className="h-2" />
              <div className="text-xs text-gray-500 mt-1">60% achieved</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-3xl font-bold text-blue-600 mb-2">100%</div>
              <div className="text-sm text-gray-600 mb-2">ESG Integration</div>
              <Progress value={80} className="h-2" />
              <div className="text-xs text-gray-500 mt-1">80% complete</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}