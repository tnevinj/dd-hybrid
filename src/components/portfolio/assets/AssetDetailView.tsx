'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { UnifiedAsset, AssetType } from '@/types/portfolio'
import { useUnifiedPortfolio } from '../contexts/UnifiedPortfolioContext'
import { TraditionalAssetDetail } from './TraditionalAssetDetail'
import { RealEstateAssetDetail } from './RealEstateAssetDetail'
import { InfrastructureAssetDetail } from './InfrastructureAssetDetail'
import { AssetOverview } from './AssetOverview'
import { AssetPerformance } from './AssetPerformance'
import { AssetFinancials } from './AssetFinancials'
import { AssetRiskAssessment } from './AssetRiskAssessment'
import { AssetESGMetrics } from './AssetESGMetrics'
import {
  Building2,
  TrendingUp,
  DollarSign,
  AlertTriangle,
  Leaf,
  BarChart3,
  MapPin,
  Calendar,
  User,
  Settings
} from 'lucide-react'

interface AssetDetailViewProps {
  portfolioId: string
  assetId: string
}

export function AssetDetailView({ portfolioId, assetId }: AssetDetailViewProps) {
  const { state } = useUnifiedPortfolio()
  const [asset, setAsset] = useState<UnifiedAsset | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    // Find the asset in the current portfolio
    if (state.currentPortfolio) {
      const foundAsset = state.currentPortfolio.assets.find(a => a.id === assetId)
      setAsset(foundAsset || null)
    }
    setIsLoading(false)
  }, [assetId, state.currentPortfolio])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading asset details...</p>
        </div>
      </div>
    )
  }

  if (!asset) {
    return (
      <Card className="max-w-md mx-auto">
        <CardContent className="pt-6">
          <div className="text-center">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Asset Not Found</h2>
            <p className="text-gray-600 mb-4">
              The asset with ID "{assetId}" could not be found in this portfolio.
            </p>
            <Button onClick={() => window.history.back()} variant="outline">
              Go Back
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  const getAssetTypeIcon = (assetType: AssetType) => {
    switch (assetType) {
      case 'traditional':
        return <Building2 className="h-5 w-5" />
      case 'real_estate':
        return <Building2 className="h-5 w-5" />
      case 'infrastructure':
        return <BarChart3 className="h-5 w-5" />
      default:
        return <Building2 className="h-5 w-5" />
    }
  }

  const getAssetTypeLabel = (assetType: AssetType) => {
    switch (assetType) {
      case 'traditional':
        return 'Traditional Investment'
      case 'real_estate':
        return 'Real Estate'
      case 'infrastructure':
        return 'Infrastructure'
      default:
        return assetType
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

  return (
    <div className="space-y-6">
      {/* Asset Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                {getAssetTypeIcon(asset.assetType)}
                <CardTitle className="text-2xl font-bold">{asset.name}</CardTitle>
              </div>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <MapPin className="h-4 w-4" />
                  <span>{asset.location.city}, {asset.location.country}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>Acquired: {new Date(asset.acquisitionDate).toLocaleDateString()}</span>
                </div>
              </div>
              {asset.description && (
                <p className="text-gray-600 max-w-2xl">{asset.description}</p>
              )}
            </div>
            <div className="text-right space-y-2">
              <div className="flex items-center space-x-2">
                <Badge className={getStatusColor(asset.status)}>
                  {asset.status.replace('_', ' ').toUpperCase()}
                </Badge>
                <Badge variant="outline">
                  {getAssetTypeLabel(asset.assetType)}
                </Badge>
              </div>
              <div className="text-sm text-gray-600">
                Current Value: <span className="font-semibold text-gray-900">{formatCurrency(asset.currentValue)}</span>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Current Value</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(asset.currentValue)}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-blue-600" />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Acquired: {formatCurrency(asset.acquisitionValue)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">IRR</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatPercentage(asset.performance.irr)}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              MOIC: {asset.performance.moic.toFixed(1)}x
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Risk Rating</p>
                <p className="text-2xl font-bold text-gray-900 capitalize">
                  {asset.riskRating}
                </p>
              </div>
              <AlertTriangle className={`h-8 w-8 ${
                asset.riskRating === 'low' ? 'text-green-600' :
                asset.riskRating === 'medium' ? 'text-yellow-600' :
                asset.riskRating === 'high' ? 'text-orange-600' : 'text-red-600'
              }`} />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Last review: {asset.lastUpdated ? new Date(asset.lastUpdated).toLocaleDateString() : 'N/A'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">ESG Score</p>
                <p className="text-2xl font-bold text-gray-900">
                  {asset.esgMetrics.overallScore.toFixed(1)}/10
                </p>
              </div>
              <Leaf className="h-8 w-8 text-emerald-600" />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {asset.esgMetrics.sustainabilityCertifications.length} certifications
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Tabs */}
      <Card>
        <CardContent className="p-0">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-6 rounded-none border-b">
              <TabsTrigger value="overview" className="flex items-center space-x-2">
                <BarChart3 className="h-4 w-4" />
                <span>Overview</span>
              </TabsTrigger>
              <TabsTrigger value="performance" className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4" />
                <span>Performance</span>
              </TabsTrigger>
              <TabsTrigger value="financials" className="flex items-center space-x-2">
                <DollarSign className="h-4 w-4" />
                <span>Financials</span>
              </TabsTrigger>
              <TabsTrigger value="risk" className="flex items-center space-x-2">
                <AlertTriangle className="h-4 w-4" />
                <span>Risk</span>
              </TabsTrigger>
              <TabsTrigger value="esg" className="flex items-center space-x-2">
                <Leaf className="h-4 w-4" />
                <span>ESG</span>
              </TabsTrigger>
              <TabsTrigger value="details" className="flex items-center space-x-2">
                <Settings className="h-4 w-4" />
                <span>Details</span>
              </TabsTrigger>
            </TabsList>

            <div className="p-6">
              <TabsContent value="overview" className="mt-0">
                <AssetOverview asset={asset} />
              </TabsContent>

              <TabsContent value="performance" className="mt-0">
                <AssetPerformance asset={asset} />
              </TabsContent>

              <TabsContent value="financials" className="mt-0">
                <AssetFinancials asset={asset} />
              </TabsContent>

              <TabsContent value="risk" className="mt-0">
                <AssetRiskAssessment asset={asset} />
              </TabsContent>

              <TabsContent value="esg" className="mt-0">
                <AssetESGMetrics asset={asset} />
              </TabsContent>

              <TabsContent value="details" className="mt-0">
                {asset.assetType === 'traditional' && (
                  <TraditionalAssetDetail asset={asset} />
                )}
                {asset.assetType === 'real_estate' && (
                  <RealEstateAssetDetail asset={asset} />
                )}
                {asset.assetType === 'infrastructure' && (
                  <InfrastructureAssetDetail asset={asset} />
                )}
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}