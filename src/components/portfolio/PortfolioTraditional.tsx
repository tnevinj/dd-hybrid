'use client'

import React from 'react'
import { Badge } from '@/components/ui/badge'
import { User } from 'lucide-react'
import { UnifiedPortfolioManager } from './UnifiedPortfolioManager'

interface PortfolioTraditionalProps {
  portfolioData?: any
  assets?: any[]
  metrics?: any
  isLoading?: boolean
  onCreateAsset?: () => void
  onViewAsset?: (id: string) => void
  onEditAsset?: (id: string) => void
}

export function PortfolioTraditional({
  portfolioData,
  assets = [],
  metrics,
  isLoading = false,
  onCreateAsset,
  onViewAsset,
  onEditAsset
}: PortfolioTraditionalProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-600 mb-4"></div>
        <h3 className="text-xl font-semibold text-gray-700">Loading Portfolio Data...</h3>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Traditional Mode Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl font-bold text-gray-900">Portfolio Management</h1>
            <Badge className="bg-gray-100 text-gray-800 border border-gray-300 flex items-center space-x-1">
              <User className="h-3 w-3" />
              <span>Traditional Mode</span>
            </Badge>
          </div>
          <p className="text-gray-600">Complete manual control over all portfolio operations</p>
        </div>
      </div>

      {/* Unified Portfolio Manager */}
      <UnifiedPortfolioManager />

      {/* Traditional Mode Notice */}
      <div className="mx-6 mb-6 p-4 bg-gray-100 border border-gray-200 rounded-lg">
        <div className="flex items-start space-x-3">
          <User className="h-5 w-5 text-gray-600 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-gray-900 mb-1">Traditional Manual Portfolio Management</h4>
            <p className="text-sm text-gray-600">
              You have complete control over portfolio analysis and decisions. All asset types (Traditional, Real Estate, Infrastructure) 
              are available with full manual control. No AI assistance is provided - all calculations and insights are user-driven.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PortfolioTraditional