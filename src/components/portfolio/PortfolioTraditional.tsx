'use client'

import React from 'react'
import { ModuleHeader, ProcessNotice, MODE_DESCRIPTIONS } from '@/components/shared/ModeIndicators'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
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
    <div className="min-h-screen bg-gray-50">
      <div className="p-4 md:p-6">
        {/* Standardized Header */}
        <ModuleHeader
          title="Portfolio Management"
          description={MODE_DESCRIPTIONS.traditional.portfolio}
          mode="traditional"
          actions={
            <Button 
              onClick={onCreateAsset} 
              className="flex items-center space-x-2 bg-gray-700 hover:bg-gray-800"
            >
              <Plus className="h-4 w-4" />
              <span>New Asset</span>
            </Button>
          }
        />

        {/* Portfolio Container */}
        <PortfolioTraditionalContainer
          onViewAsset={onViewAsset || (() => {})}
          onEditAsset={onEditAsset || (() => {})}
          onCreateAsset={onCreateAsset || (() => {})}
        />

        {/* Standardized Process Notice */}
        <ProcessNotice
          mode="traditional"
          title="Traditional Manual Process"
          description="You have complete control over portfolio management. All investment decisions, asset analysis, and performance tracking are performed manually without AI assistance. Use the tools above to manage your portfolio according to your investment strategy."
        />
      </div>
    </div>
  )
}

export default PortfolioTraditional
