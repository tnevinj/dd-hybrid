'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { UnifiedAsset } from '@/types/portfolio'
import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  Target,
  Award,
  Activity
} from 'lucide-react'

interface AssetPerformanceProps {
  asset: UnifiedAsset
}

export function AssetPerformance({ asset }: AssetPerformanceProps) {
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

  const getPerformanceColor = (value: number) => {
    if (value > 0.15) return 'text-green-600'
    if (value > 0.08) return 'text-blue-600'
    if (value > 0) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getPerformanceIcon = (value: number) => {
    return value >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />
  }

  const calculateUnrealizedGain = () => {
    return asset.currentValue - asset.acquisitionValue
  }

  const calculateTotalReturn = () => {
    return (asset.currentValue - asset.acquisitionValue) / asset.acquisitionValue
  }

  const calculateAnnualizedReturn = () => {
    const years = (new Date().getTime() - new Date(asset.acquisitionDate).getTime()) / (1000 * 60 * 60 * 24 * 365.25)
    return Math.pow(asset.currentValue / asset.acquisitionValue, 1 / years) - 1
  }

  const generatePerformanceData = () => {
    // Mock historical performance data - in a real app this would come from the API
    const months = 12
    const data = []
    const startValue = asset.acquisitionValue
    const endValue = asset.currentValue
    
    for (let i = 0; i <= months; i++) {
      const progress = i / months
      const value = startValue + (endValue - startValue) * progress * (1 + Math.sin(progress * Math.PI) * 0.1)
      data.push({
        month: new Date(Date.now() - (months - i) * 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
        value: value,
        return: (value - startValue) / startValue
      })
    }
    return data
  }

  const performanceData = generatePerformanceData()

  return (
    <div className="space-y-6">
      {/* Key Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">IRR</p>
                <p className={`text-2xl font-bold ${getPerformanceColor(asset.performance.irr)}`}>
                  {formatPercentage(asset.performance.irr)}
                </p>
              </div>
              <div className={getPerformanceColor(asset.performance.irr)}>
                {getPerformanceIcon(asset.performance.irr)}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">MOIC</p>
                <p className="text-2xl font-bold text-blue-600">
                  {asset.performance.moic.toFixed(1)}x
                </p>
              </div>
              <BarChart3 className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Return</p>
                <p className={`text-2xl font-bold ${getPerformanceColor(calculateTotalReturn())}`}>
                  {formatPercentage(calculateTotalReturn())}
                </p>
              </div>
              <div className={getPerformanceColor(calculateTotalReturn())}>
                {getPerformanceIcon(calculateTotalReturn())}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Unrealized Gain</p>
                <p className={`text-2xl font-bold ${calculateUnrealizedGain() >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(calculateUnrealizedGain())}
                </p>
              </div>
              <Activity className="h-8 w-8 text-gray-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Award className="h-5 w-5" />
              <span>Performance Breakdown</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">IRR (Internal Rate of Return)</span>
              <span className={`text-sm font-semibold ${getPerformanceColor(asset.performance.irr)}`}>
                {formatPercentage(asset.performance.irr)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">MOIC (Multiple of Invested Capital)</span>
              <span className="text-sm font-semibold text-blue-600">
                {asset.performance.moic.toFixed(2)}x
              </span>
            </div>
            {asset.performance.tvpi && (
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">TVPI (Total Value to Paid In)</span>
                <span className="text-sm font-semibold">
                  {asset.performance.tvpi.toFixed(2)}x
                </span>
              </div>
            )}
            {asset.performance.dpi && (
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">DPI (Distributions to Paid In)</span>
                <span className="text-sm font-semibold">
                  {asset.performance.dpi.toFixed(2)}x
                </span>
              </div>
            )}
            {asset.performance.rvpi && (
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">RVPI (Residual Value to Paid In)</span>
                <span className="text-sm font-semibold">
                  {asset.performance.rvpi.toFixed(2)}x
                </span>
              </div>
            )}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Annualized Return</span>
              <span className={`text-sm font-semibold ${getPerformanceColor(calculateAnnualizedReturn())}`}>
                {formatPercentage(calculateAnnualizedReturn())}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="h-5 w-5" />
              <span>Benchmarking</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {asset.performance.benchmarkComparison && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600">vs. Benchmark</span>
                  <span className={`text-sm font-semibold ${
                    asset.performance.benchmarkComparison >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {asset.performance.benchmarkComparison >= 0 ? '+' : ''}
                    {formatPercentage(asset.performance.benchmarkComparison)}
                  </span>
                </div>
                <Progress 
                  value={Math.min(Math.max((asset.performance.benchmarkComparison + 0.1) * 500, 0), 100)} 
                  className="h-2" 
                />
              </div>
            )}
            {asset.performance.riskAdjustedReturn && (
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">Risk-Adjusted Return</span>
                <span className={`text-sm font-semibold ${getPerformanceColor(asset.performance.riskAdjustedReturn)}`}>
                  {formatPercentage(asset.performance.riskAdjustedReturn)}
                </span>
              </div>
            )}
            {asset.performance.currentYield && (
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">Current Yield</span>
                <span className="text-sm font-semibold">
                  {formatPercentage(asset.performance.currentYield)}
                </span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Value Creation Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="h-5 w-5" />
            <span>Value Creation Timeline</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-gray-900">{formatCurrency(asset.acquisitionValue)}</div>
                <div className="text-sm text-gray-600">Initial Investment</div>
                <div className="text-xs text-gray-500">{new Date(asset.acquisitionDate).toLocaleDateString()}</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">{formatCurrency(asset.currentValue)}</div>
                <div className="text-sm text-gray-600">Current Value</div>
                <div className="text-xs text-gray-500">As of today</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">{formatCurrency(calculateUnrealizedGain())}</div>
                <div className="text-sm text-gray-600">Unrealized Gain</div>
                <div className="text-xs text-gray-500">
                  {formatPercentage(calculateUnrealizedGain() / asset.acquisitionValue)}
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">
                  {((new Date().getTime() - new Date(asset.acquisitionDate).getTime()) / (1000 * 60 * 60 * 24 * 365.25)).toFixed(1)}
                </div>
                <div className="text-sm text-gray-600">Years Held</div>
                <div className="text-xs text-gray-500">Hold Period</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Trend Chart (Simplified) */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5" />
            <span>Performance Trend</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {performanceData.slice(-6).map((dataPoint, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600 w-20">{dataPoint.month}</span>
                <div className="flex-1 mx-4">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        dataPoint.return >= 0 ? 'bg-green-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${Math.min(Math.abs(dataPoint.return) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
                <span className={`text-sm font-semibold w-16 text-right ${
                  dataPoint.return >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {formatPercentage(dataPoint.return)}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t text-center">
            <div className="text-sm text-gray-600">
              Overall performance trend showing {formatPercentage(asset.performance.totalReturn)} total return
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}