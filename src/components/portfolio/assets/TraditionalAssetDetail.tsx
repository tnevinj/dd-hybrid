'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { TraditionalAsset } from '@/types/portfolio'
import {
  Building,
  Users,
  TrendingUp,
  DollarSign,
  PieChart,
  Lightbulb,
  Target,
  Calendar,
  Briefcase,
  Award,
  BarChart3
} from 'lucide-react'

interface TraditionalAssetDetailProps {
  asset: TraditionalAsset
}

export function TraditionalAssetDetail({ asset }: TraditionalAssetDetailProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const formatPercentage = (value: number) => {
    return `${(value * 100).toFixed(1)}%`
  }

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat().format(value)
  }

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'seed':
        return 'bg-red-100 text-red-800'
      case 'series_a':
        return 'bg-orange-100 text-orange-800'
      case 'series_b':
        return 'bg-yellow-100 text-yellow-800'
      case 'series_c':
        return 'bg-blue-100 text-blue-800'
      case 'growth':
        return 'bg-green-100 text-green-800'
      case 'mature':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStageLabel = (stage: string) => {
    switch (stage) {
      case 'series_a':
        return 'Series A'
      case 'series_b':
        return 'Series B'
      case 'series_c':
        return 'Series C'
      default:
        return stage.charAt(0).toUpperCase() + stage.slice(1)
    }
  }

  return (
    <div className="space-y-6">
      {/* Company Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Building className="h-5 w-5" />
              <span>Company Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Company Stage</span>
              <Badge className={getStageColor(asset.specificMetrics.companyStage)}>
                {getStageLabel(asset.specificMetrics.companyStage)}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Founded</span>
              <span className="text-sm font-semibold">{asset.companyInfo.foundedYear}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600 flex items-center space-x-1">
                <Users className="h-4 w-4" />
                <span>Employees</span>
              </span>
              <span className="text-sm font-semibold">{formatNumber(asset.specificMetrics.employeeCount)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Funding Rounds</span>
              <span className="text-sm font-semibold">{asset.specificMetrics.fundingRounds}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Board Seats</span>
              <span className="text-sm font-semibold">{asset.specificMetrics.boardSeats}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Ownership</span>
              <span className="text-sm font-semibold text-blue-600">
                {formatPercentage(asset.specificMetrics.ownershipPercentage)}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5" />
              <span>Financial Metrics</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Revenue</span>
              <span className="text-sm font-semibold text-green-600">
                {formatCurrency(asset.specificMetrics.revenue)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">EBITDA</span>
              <span className="text-sm font-semibold text-blue-600">
                {formatCurrency(asset.specificMetrics.ebitda)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Debt-to-Equity</span>
              <span className="text-sm font-semibold">
                {asset.specificMetrics.debtToEquity.toFixed(2)}
              </span>
            </div>
            {asset.specificMetrics.marketCap && (
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">Market Cap</span>
                <span className="text-sm font-semibold">
                  {formatCurrency(asset.specificMetrics.marketCap)}
                </span>
              </div>
            )}
            {asset.specificMetrics.enterprise_value && (
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">Enterprise Value</span>
                <span className="text-sm font-semibold">
                  {formatCurrency(asset.specificMetrics.enterprise_value)}
                </span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Business Model & Strategy */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Briefcase className="h-5 w-5" />
            <span>Business Model & Strategy</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="text-sm font-medium text-gray-600 mb-2">Business Model</div>
            <div className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg">
              {asset.companyInfo.businessModel}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Products */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Lightbulb className="h-5 w-5" />
            <span>Key Products & Services</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {asset.companyInfo.keyProducts.map((product, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                <span className="text-sm text-gray-900">{product}</span>
              </div>
            ))}
            {asset.companyInfo.keyProducts.length === 0 && (
              <span className="text-sm text-gray-500 col-span-2">No products listed</span>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Competitive Advantages */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Award className="h-5 w-5" />
            <span>Competitive Advantages</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {asset.companyInfo.competitiveAdvantages.map((advantage, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Target className="h-3 w-3 text-green-600" />
                </div>
                <span className="text-sm text-gray-900">{advantage}</span>
              </div>
            ))}
            {asset.companyInfo.competitiveAdvantages.length === 0 && (
              <div className="text-center py-8">
                <Award className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No competitive advantages listed</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Financial Ratios & Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <PieChart className="h-5 w-5" />
              <span>Key Financial Ratios</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">EBITDA Margin</span>
                <span className="text-sm font-semibold">
                  {asset.specificMetrics.revenue > 0 
                    ? formatPercentage(asset.specificMetrics.ebitda / asset.specificMetrics.revenue)
                    : 'N/A'
                  }
                </span>
              </div>
              {asset.specificMetrics.revenue > 0 && (
                <Progress 
                  value={(asset.specificMetrics.ebitda / asset.specificMetrics.revenue) * 100} 
                  className="h-2" 
                />
              )}
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">Revenue per Employee</span>
                <span className="text-sm font-semibold">
                  {formatCurrency(asset.specificMetrics.revenue / asset.specificMetrics.employeeCount)}
                </span>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">Ownership Stake</span>
                <span className="text-sm font-semibold text-blue-600">
                  {formatPercentage(asset.specificMetrics.ownershipPercentage)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <span>Investment Metrics</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Investment Value</span>
              <span className="text-sm font-semibold">
                {formatCurrency(asset.currentValue * asset.specificMetrics.ownershipPercentage)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Valuation Multiple</span>
              <span className="text-sm font-semibold">
                {(asset.currentValue / asset.acquisitionValue).toFixed(1)}x
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Total Return</span>
              <span className={`text-sm font-semibold ${
                asset.performance.totalReturn >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {formatPercentage(asset.performance.totalReturn)}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sector Information */}
      {asset.sector && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="h-5 w-5" />
              <span>Sector & Industry</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="text-sm">
                {asset.sector}
              </Badge>
              {asset.tags.map((tag, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}