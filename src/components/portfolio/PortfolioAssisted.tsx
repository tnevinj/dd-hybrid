'use client'

import React from 'react'
import { Badge } from '@/components/ui/badge'
import { Brain } from 'lucide-react'
import { UnifiedPortfolioManager } from './UnifiedPortfolioManager'

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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Mode Indicator */}
      <div className="bg-white border-b border-purple-200 px-6 py-4">
        <Badge className="bg-purple-100 text-purple-800 border border-purple-300 flex items-center space-x-1">
          <Brain className="h-3 w-3" />
          <span>Assisted Mode</span>
        </Badge>
      </div>

      {/* Unified Portfolio Manager */}
      <UnifiedPortfolioManager 
        onViewAsset={onViewAsset}
        onEditAsset={onEditAsset}
        onCreateAsset={onCreateAsset}
      />

      {/* Assisted Mode Notice */}
      <div className="mx-6 mb-6 p-4 bg-gradient-to-r from-purple-100 to-blue-100 border border-purple-200 rounded-lg">
        <div className="flex items-start space-x-3">
          <Brain className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-purple-900 mb-1">AI-Assisted Portfolio Management Active</h4>
            <p className="text-sm text-purple-700">
              AI continuously analyzes your portfolio across all asset types (Traditional, Real Estate, Infrastructure) 
              and provides intelligent recommendations. All AI suggestions require your approval before implementation. 
              You maintain full control while benefiting from advanced analytics, market intelligence, and optimization insights.
            </p>
            <div className="flex items-center space-x-4 mt-2 text-xs text-purple-600">
              <span>• Real-time market analysis</span>
              <span>• Automated risk assessment</span>
              <span>• Optimization recommendations</span>
              <span>• Performance predictions</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PortfolioAssisted