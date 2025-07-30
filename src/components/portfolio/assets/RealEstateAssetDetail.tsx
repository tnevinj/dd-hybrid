'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { RealEstateAsset } from '@/types/portfolio'
import {
  Building,
  MapPin,
  Users,
  Calendar,
  TrendingUp,
  PieChart,
  Home,
  DollarSign,
  Percent,
  Square,
  Car,
  Wrench,
  FileText,
  Clock
} from 'lucide-react'

interface RealEstateAssetDetailProps {
  asset: RealEstateAsset
}

export function RealEstateAssetDetail({ asset }: RealEstateAssetDetailProps) {
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

  const getPropertyTypeIcon = (type: string) => {
    switch (type) {
      case 'office':
        return <Building className="h-5 w-5" />
      case 'retail':
        return <Home className="h-5 w-5" />
      case 'industrial':
        return <Wrench className="h-5 w-5" />
      case 'residential':
        return <Home className="h-5 w-5" />
      case 'mixed_use':
        return <Building className="h-5 w-5" />
      default:
        return <Building className="h-5 w-5" />
    }
  }

  const getPropertyTypeColor = (type: string) => {
    switch (type) {
      case 'office':
        return 'bg-blue-100 text-blue-800'
      case 'retail':
        return 'bg-green-100 text-green-800'
      case 'industrial':
        return 'bg-orange-100 text-orange-800'
      case 'residential':
        return 'bg-purple-100 text-purple-800'
      case 'mixed_use':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      {/* Property Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              {getPropertyTypeIcon(asset.specificMetrics.propertyType)}
              <span>Property Details</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Property Type</span>
              <Badge className={getPropertyTypeColor(asset.specificMetrics.propertyType)}>
                {asset.specificMetrics.propertyType.replace('_', ' ').toUpperCase()}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Total Square Feet</span>
              <span className="text-sm font-semibold">{formatNumber(asset.specificMetrics.totalSqFt)} sq ft</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Year Built</span>
              <span className="text-sm font-semibold">{asset.propertyDetails.yearBuilt}</span>
            </div>
            {asset.propertyDetails.lastRenovation && (
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">Last Renovation</span>
                <span className="text-sm font-semibold">{asset.propertyDetails.lastRenovation}</span>
              </div>
            )}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Zoning</span>
              <span className="text-sm font-semibold">{asset.propertyDetails.zoning}</span>
            </div>
            {asset.propertyDetails.parkingSpaces && (
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600 flex items-center space-x-1">
                  <Car className="h-4 w-4" />
                  <span>Parking Spaces</span>
                </span>
                <span className="text-sm font-semibold">{asset.propertyDetails.parkingSpaces}</span>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <PieChart className="h-5 w-5" />
              <span>Financial Metrics</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Cap Rate</span>
              <span className="text-sm font-semibold text-green-600">
                {formatPercentage(asset.specificMetrics.capRate)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">NOI Yield</span>
              <span className="text-sm font-semibold text-blue-600">
                {formatPercentage(asset.specificMetrics.noiYield)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Average Rent PSF</span>
              <span className="text-sm font-semibold">
                {formatCurrency(asset.specificMetrics.avgRentPsf)} /sq ft
              </span>
            </div>
            {asset.specificMetrics.loanToValue && (
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">Loan-to-Value</span>
                <span className="text-sm font-semibold">
                  {formatPercentage(asset.specificMetrics.loanToValue)}
                </span>
              </div>
            )}
            {asset.specificMetrics.debtServiceCoverageRatio && (
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">DSCR</span>
                <span className="text-sm font-semibold">
                  {asset.specificMetrics.debtServiceCoverageRatio.toFixed(2)}x
                </span>
              </div>
            )}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Property Taxes</span>
              <span className="text-sm font-semibold">
                {formatCurrency(asset.propertyDetails.propertyTaxes)} /year
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Occupancy and Leasing */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span>Occupancy & Leasing</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">Occupancy Rate</span>
                <span className="text-sm font-semibold text-green-600">
                  {formatPercentage(asset.specificMetrics.occupancyRate)}
                </span>
              </div>
              <Progress value={asset.specificMetrics.occupancyRate * 100} className="h-2" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">Vacancy Rate</span>
                <span className="text-sm font-semibold text-red-600">
                  {formatPercentage(asset.specificMetrics.vacancyRate)}
                </span>
              </div>
              <Progress value={asset.specificMetrics.vacancyRate * 100} className="h-2" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Average Lease Length</span>
              <span className="text-sm font-semibold">
                {asset.specificMetrics.avgLeaseLength} years
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Building className="h-5 w-5" />
              <span>Property Amenities</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2">
              {asset.propertyDetails.amenities.map((amenity, index) => (
                <Badge key={index} variant="outline" className="justify-center">
                  {amenity}
                </Badge>
              ))}
              {asset.propertyDetails.amenities.length === 0 && (
                <span className="text-sm text-gray-500 col-span-2">No amenities listed</span>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Major Tenants */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5" />
            <span>Major Tenants</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {asset.leaseInfo.majorTenants.length > 0 ? (
            <div className="space-y-4">
              {asset.leaseInfo.majorTenants.map((tenant, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <div className="text-sm font-medium text-gray-600">Tenant</div>
                      <div className="text-sm font-semibold">{tenant.name}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-600 flex items-center space-x-1">
                        <Square className="h-3 w-3" />
                        <span>Square Feet</span>
                      </div>
                      <div className="text-sm font-semibold">{formatNumber(tenant.sqFt)} sq ft</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-600 flex items-center space-x-1">
                        <DollarSign className="h-3 w-3" />
                        <span>Rent PSF</span>
                      </div>
                      <div className="text-sm font-semibold">{formatCurrency(tenant.rentPsf)}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-600 flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span>Lease Expiry</span>
                      </div>
                      <div className="text-sm font-semibold">
                        {new Date(tenant.leaseExpiry).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t">
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>
                        {((tenant.sqFt / asset.specificMetrics.totalSqFt) * 100).toFixed(1)}% of total space
                      </span>
                      <span className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>
                          {Math.ceil((new Date(tenant.leaseExpiry).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24 * 30))} months remaining
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No major tenants information available</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Location Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MapPin className="h-5 w-5" />
            <span>Location & Geographic Details</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
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
            </div>
            {asset.location.coordinates && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">Latitude</span>
                  <span className="text-sm font-semibold">{asset.location.coordinates.lat.toFixed(6)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">Longitude</span>
                  <span className="text-sm font-semibold">{asset.location.coordinates.lng.toFixed(6)}</span>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}