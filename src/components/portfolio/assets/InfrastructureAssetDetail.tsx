'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { InfrastructureAsset } from '@/types/portfolio'
import {
  Zap,
  Truck,
  Droplets,
  Radio,
  Building,
  Activity,
  Settings,
  Shield,
  Clock,
  FileText,
  Calendar,
  TrendingUp,
  BarChart3,
  AlertCircle
} from 'lucide-react'

interface InfrastructureAssetDetailProps {
  asset: InfrastructureAsset
}

export function InfrastructureAssetDetail({ asset }: InfrastructureAssetDetailProps) {
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

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'energy':
        return <Zap className="h-5 w-5" />
      case 'transport':
        return <Truck className="h-5 w-5" />
      case 'water':
        return <Droplets className="h-5 w-5" />
      case 'telecom':
        return <Radio className="h-5 w-5" />
      case 'social':
        return <Building className="h-5 w-5" />
      default:
        return <Settings className="h-5 w-5" />
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'energy':
        return 'bg-yellow-100 text-yellow-800'
      case 'transport':
        return 'bg-blue-100 text-blue-800'
      case 'water':
        return 'bg-cyan-100 text-cyan-800'
      case 'telecom':
        return 'bg-blue-100 text-blue-800'
      case 'social':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getContractTypeColor = (type: string) => {
    switch (type) {
      case 'availability':
        return 'bg-green-100 text-green-800'
      case 'usage':
        return 'bg-blue-100 text-blue-800'
      case 'hybrid':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getYearsRemaining = (dateString: string) => {
    const targetDate = new Date(dateString)
    const now = new Date()
    const yearsDiff = (targetDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24 * 365.25)
    return Math.max(0, yearsDiff)
  }

  return (
    <div className="space-y-6">
      {/* Asset Category & Operational Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              {getCategoryIcon(asset.specificMetrics.assetCategory)}
              <span>Asset Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Asset Category</span>
              <Badge className={getCategoryColor(asset.specificMetrics.assetCategory)}>
                {asset.specificMetrics.assetCategory.toUpperCase()}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Commission Date</span>
              <span className="text-sm font-semibold">
                {new Date(asset.operationalData.commissionDate).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Design Life</span>
              <span className="text-sm font-semibold">{asset.operationalData.designLife} years</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Current Age</span>
              <span className="text-sm font-semibold">{asset.operationalData.currentAge} years</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Average Lifespan</span>
              <span className="text-sm font-semibold">{asset.specificMetrics.averageLifespan} years</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5" />
              <span>Performance Metrics</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">Capacity Utilization</span>
                <span className="text-sm font-semibold text-blue-600">
                  {formatPercentage(asset.specificMetrics.capacityUtilization)}
                </span>
              </div>
              <Progress value={asset.specificMetrics.capacityUtilization * 100} className="h-2" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">Operational Efficiency</span>
                <span className="text-sm font-semibold text-green-600">
                  {formatPercentage(asset.specificMetrics.operationalEfficiency)}
                </span>
              </div>
              <Progress value={asset.specificMetrics.operationalEfficiency * 100} className="h-2" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">Availability Rate</span>
                <span className="text-sm font-semibold text-blue-600">
                  {formatPercentage(asset.specificMetrics.availabilityRate)}
                </span>
              </div>
              <Progress value={asset.specificMetrics.availabilityRate * 100} className="h-2" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Maintenance Score</span>
              <span className="text-sm font-semibold">
                {asset.specificMetrics.maintenanceScore}/100
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Financial & Revenue Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <span>Financial Performance</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Contracted Revenue</span>
              <span className="text-sm font-semibold text-green-600">
                {formatCurrency(asset.specificMetrics.contractedRevenue)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Regulatory Compliance</span>
              <span className="text-sm font-semibold">
                {formatPercentage(asset.specificMetrics.regulatoryCompliance)}
              </span>
            </div>
            {asset.specificMetrics.throughputCapacity && (
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">Throughput Capacity</span>
                <span className="text-sm font-semibold">
                  {formatNumber(asset.specificMetrics.throughputCapacity)} units/day
                </span>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>Contract Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Contract Type</span>
              <Badge className={getContractTypeColor(asset.contractualInfo.contractType)}>
                {asset.contractualInfo.contractType.toUpperCase()}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Contractor</span>
              <span className="text-sm font-semibold">{asset.contractualInfo.contractorName}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Contract Expiry</span>
              <span className="text-sm font-semibold">
                {new Date(asset.contractualInfo.contractExpiry).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Renewal Options</span>
              <span className="text-sm font-semibold">{asset.contractualInfo.renewalOptions}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Years Remaining</span>
              <span className="text-sm font-semibold text-blue-600">
                {getYearsRemaining(asset.contractualInfo.contractExpiry).toFixed(1)} years
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Operating License Information */}
      {asset.operationalData.operatingLicense && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5" />
              <span>Operating License</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <div className="text-sm font-medium text-gray-600 mb-1">License Number</div>
                <div className="text-sm font-semibold">
                  {asset.operationalData.operatingLicense.licenseNumber}
                </div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-600 mb-1">Expiry Date</div>
                <div className="text-sm font-semibold">
                  {new Date(asset.operationalData.operatingLicense.expiryDate).toLocaleDateString()}
                </div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-600 mb-1">Renewal Required</div>
                <Badge variant={asset.operationalData.operatingLicense.renewalRequired ? "destructive" : "default"}>
                  {asset.operationalData.operatingLicense.renewalRequired ? "Yes" : "No"}
                </Badge>
              </div>
            </div>
            {asset.operationalData.operatingLicense.renewalRequired && (
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="h-4 w-4 text-yellow-600" />
                  <span className="text-sm font-medium text-yellow-800">
                    License renewal required - 
                    {getYearsRemaining(asset.operationalData.operatingLicense.expiryDate) < 1 
                      ? " Expires soon!" 
                      : ` ${getYearsRemaining(asset.operationalData.operatingLicense.expiryDate).toFixed(1)} years remaining`
                    }
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Maintenance Schedule */}
      {asset.operationalData.nextMajorMaintenance && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="h-5 w-5" />
              <span>Maintenance Schedule</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="text-sm font-medium text-gray-600 mb-2">Next Major Maintenance</div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-semibold">
                    {new Date(asset.operationalData.nextMajorMaintenance).toLocaleDateString()}
                  </span>
                </div>
                <div className="mt-2 text-xs text-gray-500">
                  {Math.ceil((new Date(asset.operationalData.nextMajorMaintenance).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days remaining
                </div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-600 mb-2">Asset Age Progress</div>
                <Progress 
                  value={(asset.operationalData.currentAge / asset.operationalData.designLife) * 100} 
                  className="h-3" 
                />
                <div className="mt-2 text-xs text-gray-500">
                  {asset.operationalData.currentAge} of {asset.operationalData.designLife} years 
                  ({((asset.operationalData.currentAge / asset.operationalData.designLife) * 100).toFixed(1)}% of design life)
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Asset Lifecycle Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="h-5 w-5" />
            <span>Asset Lifecycle Status</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {asset.operationalData.currentAge}
                </div>
                <div className="text-sm text-gray-600">Years Operating</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {asset.operationalData.designLife - asset.operationalData.currentAge}
                </div>
                <div className="text-sm text-gray-600">Years Remaining</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {formatPercentage(asset.specificMetrics.availabilityRate)}
                </div>
                <div className="text-sm text-gray-600">Availability</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">
                  {asset.specificMetrics.maintenanceScore}
                </div>
                <div className="text-sm text-gray-600">Maintenance Score</div>
              </div>
            </div>
            
            <div className="mt-6">
              <div className="text-sm font-medium text-gray-600 mb-3">Operational Timeline</div>
              <div className="relative">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gray-200 rounded-full"></div>
                <div 
                  className="absolute left-0 top-0 w-1 bg-blue-500 rounded-full transition-all duration-500"
                  style={{ height: `${(asset.operationalData.currentAge / asset.operationalData.designLife) * 100}%` }}
                ></div>
                <div className="pl-6">
                  <div className="text-xs text-gray-500 mb-1">Commission Date</div>
                  <div className="text-sm font-medium mb-4">
                    {new Date(asset.operationalData.commissionDate).toLocaleDateString()}
                  </div>
                  <div className="text-xs text-gray-500 mb-1">Current Status</div>
                  <div className="text-sm font-medium mb-4">
                    Operating ({((asset.operationalData.currentAge / asset.operationalData.designLife) * 100).toFixed(1)}% through design life)
                  </div>
                  <div className="text-xs text-gray-500 mb-1">End of Design Life</div>
                  <div className="text-sm font-medium">
                    {new Date(new Date(asset.operationalData.commissionDate).getFullYear() + asset.operationalData.designLife, 
                              new Date(asset.operationalData.commissionDate).getMonth(), 
                              new Date(asset.operationalData.commissionDate).getDate()).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}