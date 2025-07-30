'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { UnifiedAsset } from '@/types/portfolio'
import {
  DollarSign,
  TrendingUp,
  PieChart,
  BarChart3,
  Calculator,
  CreditCard
} from 'lucide-react'

interface AssetFinancialsProps {
  asset: UnifiedAsset
}

export function AssetFinancials({ asset }: AssetFinancialsProps) {
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

  const calculateCashOnCashReturn = () => {
    // Simplified calculation - in reality would need cash flow data
    return asset.performance.currentYield || asset.performance.irr * 0.8
  }

  const calculateEquityMultiple = () => {
    return asset.currentValue / asset.acquisitionValue
  }

  const getAssetSpecificFinancials = () => {
    switch (asset.assetType) {
      case 'traditional':
        return {
          revenue: (asset as any).specificMetrics?.revenue || 0,
          ebitda: (asset as any).specificMetrics?.ebitda || 0,
          debtToEquity: (asset as any).specificMetrics?.debtToEquity || 0,
          marketCap: (asset as any).specificMetrics?.marketCap,
          enterpriseValue: (asset as any).specificMetrics?.enterprise_value,
        }
      case 'real_estate':
        return {
          capRate: (asset as any).specificMetrics?.capRate || 0,
          noiYield: (asset as any).specificMetrics?.noiYield || 0,
          occupancyRate: (asset as any).specificMetrics?.occupancyRate || 0,
          avgRentPsf: (asset as any).specificMetrics?.avgRentPsf || 0,
          loanToValue: (asset as any).specificMetrics?.loanToValue,
          dscr: (asset as any).specificMetrics?.debtServiceCoverageRatio,
        }
      case 'infrastructure':
        return {
          contractedRevenue: (asset as any).specificMetrics?.contractedRevenue || 0,
          availabilityRate: (asset as any).specificMetrics?.availabilityRate || 0,
          capacityUtilization: (asset as any).specificMetrics?.capacityUtilization || 0,
          operationalEfficiency: (asset as any).specificMetrics?.operationalEfficiency || 0,
        }
      default:
        return {}
    }
  }

  const specificFinancials = getAssetSpecificFinancials()

  const generateCashFlowData = () => {
    // Mock cash flow data - in a real app this would come from the API
    const years = 5
    const data = []
    const baseValue = asset.acquisitionValue * 0.1 // Assume 10% annual cash flow
    
    for (let i = 1; i <= years; i++) {
      const year = new Date().getFullYear() - years + i
      const cashFlow = baseValue * (1 + Math.random() * 0.2 - 0.1) // ±10% variation
      data.push({
        year: year,
        cashFlow: cashFlow,
        cumulative: data.reduce((sum, item) => sum + item.cashFlow, 0) + cashFlow
      })
    }
    return data
  }

  const cashFlowData = generateCashFlowData()

  return (
    <div className="space-y-6">
      {/* Core Financial Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Acquisition Value</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(asset.acquisitionValue)}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-gray-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Current Value</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(asset.currentValue)}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Equity Multiple</p>
                <p className="text-2xl font-bold text-blue-600">
                  {calculateEquityMultiple().toFixed(2)}x
                </p>
              </div>
              <Calculator className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Cash-on-Cash</p>
                <p className="text-2xl font-bold text-purple-600">
                  {formatPercentage(calculateCashOnCashReturn())}
                </p>
              </div>
              <PieChart className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Asset-Type Specific Financials */}
      {asset.assetType === 'traditional' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5" />
                <span>Operating Metrics</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">Revenue</span>
                <span className="text-sm font-semibold text-green-600">
                  {formatCurrency(specificFinancials.revenue)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">EBITDA</span>
                <span className="text-sm font-semibold text-blue-600">
                  {formatCurrency(specificFinancials.ebitda)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">EBITDA Margin</span>
                <span className="text-sm font-semibold">
                  {specificFinancials.revenue > 0 
                    ? formatPercentage(specificFinancials.ebitda / specificFinancials.revenue)
                    : 'N/A'
                  }
                </span>
              </div>
              {specificFinancials.marketCap && (
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">Market Cap</span>
                  <span className="text-sm font-semibold">
                    {formatCurrency(specificFinancials.marketCap)}
                  </span>
                </div>
              )}
              {specificFinancials.enterpriseValue && (
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">Enterprise Value</span>
                  <span className="text-sm font-semibold">
                    {formatCurrency(specificFinancials.enterpriseValue)}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CreditCard className="h-5 w-5" />
                <span>Capital Structure</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">Debt-to-Equity</span>
                <span className="text-sm font-semibold">
                  {specificFinancials.debtToEquity.toFixed(2)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">Investment Multiple</span>
                <span className="text-sm font-semibold text-blue-600">
                  {asset.performance.moic.toFixed(2)}x
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {asset.assetType === 'real_estate' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5" />
                <span>Property Financials</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">Cap Rate</span>
                <span className="text-sm font-semibold text-green-600">
                  {formatPercentage(specificFinancials.capRate)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">NOI Yield</span>
                <span className="text-sm font-semibold text-blue-600">
                  {formatPercentage(specificFinancials.noiYield)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">Occupancy Rate</span>
                <span className="text-sm font-semibold">
                  {formatPercentage(specificFinancials.occupancyRate)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">Avg Rent PSF</span>
                <span className="text-sm font-semibold">
                  {formatCurrency(specificFinancials.avgRentPsf)} /sq ft
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CreditCard className="h-5 w-5" />
                <span>Debt & Leverage</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {specificFinancials.loanToValue && (
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">Loan-to-Value</span>
                  <span className="text-sm font-semibold">
                    {formatPercentage(specificFinancials.loanToValue)}
                  </span>
                </div>
              )}
              {specificFinancials.dscr && (
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">DSCR</span>
                  <span className="text-sm font-semibold">
                    {specificFinancials.dscr.toFixed(2)}x
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {asset.assetType === 'infrastructure' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5" />
                <span>Operational Financials</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">Contracted Revenue</span>
                <span className="text-sm font-semibold text-green-600">
                  {formatCurrency(specificFinancials.contractedRevenue)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">Availability Rate</span>
                <span className="text-sm font-semibold">
                  {formatPercentage(specificFinancials.availabilityRate)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">Capacity Utilization</span>
                <span className="text-sm font-semibold">
                  {formatPercentage(specificFinancials.capacityUtilization)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">Operational Efficiency</span>
                <span className="text-sm font-semibold">
                  {formatPercentage(specificFinancials.operationalEfficiency)}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5" />
                <span>Revenue Quality</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">Revenue Predictability</span>
                <Badge variant="outline" className="bg-green-50 text-green-700">
                  High
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">Contract Duration</span>
                <span className="text-sm font-semibold">
                  Long-term
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Cash Flow Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5" />
            <span>Cash Flow Analysis</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-5 gap-4 text-center text-sm font-medium text-gray-600 border-b pb-2">
              <div>Year</div>
              <div>Annual Cash Flow</div>
              <div>Cumulative Cash Flow</div>
              <div>Cash Yield</div>
              <div>Status</div>
            </div>
            {cashFlowData.map((data, index) => (
              <div key={index} className="grid grid-cols-5 gap-4 text-center text-sm">
                <div className="font-semibold">{data.year}</div>
                <div className="text-green-600 font-semibold">
                  {formatCurrency(data.cashFlow)}
                </div>
                <div className="font-semibold">
                  {formatCurrency(data.cumulative)}
                </div>
                <div>
                  {formatPercentage(data.cashFlow / asset.acquisitionValue)}
                </div>
                <div>
                  <Badge variant={index < cashFlowData.length - 1 ? "secondary" : "default"}>
                    {index < cashFlowData.length - 1 ? "Realized" : "Projected"}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {formatCurrency(cashFlowData.reduce((sum, item) => sum + item.cashFlow, 0))}
                </div>
                <div className="text-sm text-gray-600">Total Cash Generated</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {formatPercentage(cashFlowData.reduce((sum, item) => sum + item.cashFlow, 0) / asset.acquisitionValue)}
                </div>
                <div className="text-sm text-gray-600">Cash-on-Cost Return</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">
                  {formatPercentage(calculateCashOnCashReturn())}
                </div>
                <div className="text-sm text-gray-600">Current Cash Yield</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Return Decomposition */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <PieChart className="h-5 w-5" />
            <span>Return Decomposition</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="text-sm font-medium text-gray-600 mb-3">Total Return Sources</div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Capital Appreciation</span>
                  <span className="text-sm font-semibold text-green-600">
                    {formatCurrency(asset.currentValue - asset.acquisitionValue)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Cash Distributions</span>
                  <span className="text-sm font-semibold text-blue-600">
                    {formatCurrency(cashFlowData.reduce((sum, item) => sum + item.cashFlow, 0))}
                  </span>
                </div>
                <div className="flex items-center justify-between border-t pt-2">
                  <span className="text-sm font-medium text-gray-900">Total Return</span>
                  <span className="text-sm font-bold text-purple-600">
                    {formatCurrency((asset.currentValue - asset.acquisitionValue) + cashFlowData.reduce((sum, item) => sum + item.cashFlow, 0))}
                  </span>
                </div>
              </div>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-600 mb-3">Performance Ratios</div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">IRR</span>
                  <span className="text-sm font-semibold text-green-600">
                    {formatPercentage(asset.performance.irr)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">MOIC</span>
                  <span className="text-sm font-semibold text-blue-600">
                    {asset.performance.moic.toFixed(2)}x
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Total Return %</span>
                  <span className="text-sm font-semibold text-purple-600">
                    {formatPercentage(asset.performance.totalReturn)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}