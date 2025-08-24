/**
 * Unified Portfolio Traditional Component
 * Uses hierarchical layout system with traditional mode configuration
 */

'use client'

import React from 'react'
import { Badge } from '@/components/ui/badge'
import { User } from 'lucide-react'
import type { TraditionalModeProps } from '@/types/shared'
import { PortfolioBaseContainer } from './PortfolioBaseContainer'

export function PortfolioTraditionalRefactored({
  metrics,
  isLoading = false,
  onSwitchMode
}: TraditionalModeProps) {

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-600 mb-4"></div>
        <h3 className="text-xl font-semibold text-gray-700">Loading Portfolio Data...</h3>
      </div>
    )
  }

  return (
    <PortfolioBaseContainer mode="traditional" metrics={metrics}>
      {/* Mode Indicator Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-3 mb-6 rounded-lg">
        <div className="flex items-center justify-between">
          <Badge className="bg-gray-100 text-gray-800 border border-gray-300 flex items-center space-x-1">
            <User className="h-3 w-3" />
            <span>Traditional Mode</span>
          </Badge>
          
          {/* Key Metrics Display */}
          <div className="flex items-center space-x-6 text-sm text-gray-600">
            <div>
              <span className="font-medium">Total Value:</span> {formatCurrency(Number(metrics?.totalValue) || 0)}
            </div>
            <div>
              <span className="font-medium">Assets:</span> {metrics?.totalAssets || 0}
            </div>
            <div>
              <span className="font-medium">YTD Performance:</span> {metrics?.performanceYTD || 0}%
            </div>
          </div>
        </div>
      </div>

      {/* Traditional Mode Help Text */}
      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="font-medium text-blue-900 mb-2">Traditional Mode Features</h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Manual portfolio management with full control</li>
          <li>• Comprehensive asset tracking and reporting</li>
          <li>• Professional analytics and performance metrics</li>
          <li>• Customizable dashboard views</li>
          <li>• Export capabilities for all reports</li>
          <li>• Direct asset management without AI intervention</li>
        </ul>
      </div>
    </PortfolioBaseContainer>
  )
}

export default PortfolioTraditionalRefactored
