'use client'

import React from 'react'
import { useParams, useRouter } from 'next/navigation'
import { AssetDetailView } from '@/components/portfolio/assets/AssetDetailView'
import { UnifiedPortfolioProvider } from '@/components/portfolio/contexts/UnifiedPortfolioContext'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

export default function AssetDetailPage() {
  const params = useParams()
  const router = useRouter()
  const portfolioId = params.id as string
  const assetId = params.assetId as string

  const handleBackToPortfolio = () => {
    router.push(`/portfolio/${portfolioId}`)
  }

  if (!portfolioId || !assetId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Invalid Parameters</h2>
              <p className="text-gray-600 mb-4">Portfolio ID or Asset ID is missing.</p>
              <Button onClick={() => router.push('/portfolio')} variant="outline">
                Return to Portfolios
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <UnifiedPortfolioProvider>
      <div className="min-h-screen bg-gray-50">
        {/* Header with Back Navigation */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBackToPortfolio}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Portfolio</span>
            </Button>
            <div className="h-4 w-px bg-gray-300" />
            <div className="text-sm text-gray-500">
              Portfolio: {portfolioId} • Asset: {assetId}
            </div>
          </div>
        </div>

        {/* Asset Detail Content */}
        <div className="px-6 py-6">
          <AssetDetailView portfolioId={portfolioId} assetId={assetId} />
        </div>
      </div>
    </UnifiedPortfolioProvider>
  )
}