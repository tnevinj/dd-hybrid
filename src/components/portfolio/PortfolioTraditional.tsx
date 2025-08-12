'use client'

import React from 'react'
import { Badge } from '@/components/ui/badge'
import { User } from 'lucide-react'
import { PortfolioTraditionalContainer } from './containers/PortfolioTraditionalContainer'

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
    <div className="min-h-screen">
      {/* Mode Indicator */}
      <div className="bg-white border-b border-gray-200 px-6 py-3">
        <Badge className="bg-gray-100 text-gray-800 border border-gray-300 flex items-center space-x-1">
          <User className="h-3 w-3" />
          <span>Traditional Mode</span>
        </Badge>
      </div>

      {/* Hierarchical Portfolio Container */}
      <PortfolioTraditionalContainer
        onViewAsset={onViewAsset}
        onEditAsset={onEditAsset}
        onCreateAsset={onCreateAsset}
      />
    </div>
  )
}

export default PortfolioTraditional