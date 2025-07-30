'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { UnifiedAsset } from '@/types/portfolio'
import {
  MapPin,
  Calendar,
  Tag,
  TrendingUp,
  AlertTriangle,
  Leaf,
  DollarSign
} from 'lucide-react'

interface AssetOverviewProps {
  asset: UnifiedAsset
}

export function AssetOverview({ asset }: AssetOverviewProps) {
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

  const getAssetTypeDescription = () => {
    switch (asset.assetType) {
      case 'traditional':
        return 'Private equity investment in operating companies with focus on growth and value creation.'
      case 'real_estate':
        return 'Direct real estate investment focused on income generation and capital appreciation.'
      case 'infrastructure':
        return 'Long-term infrastructure asset providing essential services with stable cash flows.'
      default:
        return 'Investment asset in portfolio management.'
    }
  }

  const getRiskColor = (rating: string) => {
    switch (rating) {
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

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'exited':
        return 'bg-gray-100 text-gray-800'
      case 'under_review':
        return 'bg-yellow-100 text-yellow-800'
      case 'disposed':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      {/* Asset Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Asset Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 text-sm leading-relaxed">
            {asset.description || getAssetTypeDescription()}
          </p>
        </CardContent>
      </Card>

      {/* Key Information Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MapPin className="h-5 w-5" />
              <span>Location & Geography</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Country</span>
              <span className="text-sm font-semibold">{asset.location.country}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Region</span>
              <span className="text-sm font-semibold">{asset.location.region}</span>
            </div>
            {asset.location.city && (
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">City</span>
                <span className="text-sm font-semibold">{asset.location.city}</span>
              </div>
            )}
            {asset.location.coordinates && (
              <div className="pt-2 border-t">
                <div className="text-xs text-gray-500">
                  Coordinates: {asset.location.coordinates.lat.toFixed(4)}, {asset.location.coordinates.lng.toFixed(4)}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5" />
              <span>Timeline & Status</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Acquisition Date</span>
              <span className="text-sm font-semibold">
                {new Date(asset.acquisitionDate).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Status</span>
              <Badge className={getStatusColor(asset.status)}>
                {asset.status.replace('_', ' ').toUpperCase()}
              </Badge>
            </div>
            {asset.lastUpdated && (
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">Last Updated</span>
                <span className="text-sm font-semibold">
                  {new Date(asset.lastUpdated).toLocaleDateString()}
                </span>
              </div>
            )}
            {asset.nextReviewDate && (
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">Next Review</span>
                <span className="text-sm font-semibold">
                  {new Date(asset.nextReviewDate).toLocaleDateString()}
                </span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Financial Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5" />
              <span>Investment</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-sm text-gray-600">Acquisition Value</div>
              <div className="text-2xl font-bold">{formatCurrency(asset.acquisitionValue)}</div>
              <div className="text-sm text-gray-600">Current Value</div>
              <div className="text-xl font-semibold text-green-600">{formatCurrency(asset.currentValue)}</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <span>Performance</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-sm text-gray-600">IRR</div>
              <div className="text-2xl font-bold text-green-600">{formatPercentage(asset.performance.irr)}</div>
              <div className="text-sm text-gray-600">MOIC</div>
              <div className="text-xl font-semibold">{asset.performance.moic.toFixed(1)}x</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5" />
              <span>Risk & ESG</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <div className="text-sm text-gray-600 mb-1">Risk Rating</div>
                <Badge className={getRiskColor(asset.riskRating)}>
                  {asset.riskRating.toUpperCase()}
                </Badge>
              </div>
              <div>
                <div className="text-sm text-gray-600">ESG Score</div>
                <div className="text-xl font-semibold text-emerald-600">
                  {asset.esgMetrics.overallScore.toFixed(1)}/10
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tags and Categories */}
      {(asset.tags.length > 0 || asset.sector) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Tag className="h-5 w-5" />
              <span>Categories & Tags</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {asset.sector && (
                <div>
                  <div className="text-sm font-medium text-gray-600 mb-2">Sector</div>
                  <Badge variant="outline" className="text-sm">
                    {asset.sector}
                  </Badge>
                </div>
              )}
              {asset.tags.length > 0 && (
                <div>
                  <div className="text-sm font-medium text-gray-600 mb-2">Tags</div>
                  <div className="flex flex-wrap gap-2">
                    {asset.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* ESG Highlights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Leaf className="h-5 w-5" />
            <span>ESG Highlights</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {asset.esgMetrics.environmentalScore.toFixed(1)}
              </div>
              <div className="text-sm text-gray-600">Environmental</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {asset.esgMetrics.socialScore.toFixed(1)}
              </div>
              <div className="text-sm text-gray-600">Social</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {asset.esgMetrics.governanceScore.toFixed(1)}
              </div>
              <div className="text-sm text-gray-600">Governance</div>
            </div>
          </div>
          {asset.esgMetrics.sustainabilityCertifications.length > 0 && (
            <div className="mt-4 pt-4 border-t">
              <div className="text-sm font-medium text-gray-600 mb-2">Sustainability Certifications</div>
              <div className="flex flex-wrap gap-2">
                {asset.esgMetrics.sustainabilityCertifications.map((cert, index) => (
                  <Badge key={index} variant="outline" className="text-xs bg-green-50">
                    {cert}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}