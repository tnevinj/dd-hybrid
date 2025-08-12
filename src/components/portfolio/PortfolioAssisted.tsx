'use client'

import React from 'react'
import { Badge } from '@/components/ui/badge'
import { Brain } from 'lucide-react'
import { PortfolioAssistedContainer } from './containers/PortfolioAssistedContainer'

interface PortfolioAssistedProps {
  portfolioData?: any
  assets?: any[]
  metrics?: any
  isLoading?: boolean
  onCreateAsset?: () => void
  onViewAsset?: (id: string) => void
  onEditAsset?: (id: string) => void
}

export function PortfolioAssisted({
  portfolioData,
  assets = [],
  metrics,
  isLoading = false,
  onCreateAsset,
  onViewAsset,
  onEditAsset
}: PortfolioAssistedProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mb-4"></div>
        <h3 className="text-xl font-semibold text-gray-700">AI is analyzing portfolio data...</h3>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Mode Indicator */}
      <div className="bg-white border-b border-purple-200 px-6 py-3">
        <Badge className="bg-purple-100 text-purple-800 border border-purple-300 flex items-center space-x-1">
          <Brain className="h-3 w-3" />
          <span>Assisted Mode</span>
        </Badge>
      </div>

      {/* Hierarchical Portfolio Container */}
      <PortfolioAssistedContainer
        onViewAsset={onViewAsset}
        onEditAsset={onEditAsset}
        onCreateAsset={onCreateAsset}
      />
    </div>
  )
}

export default PortfolioAssisted