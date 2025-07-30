'use client'

import React from 'react'
import { useParams } from 'next/navigation'
import { HybridPortfolio } from '@/components/portfolio/HybridPortfolio'

export default function PortfolioPage() {
  const params = useParams()
  const portfolioId = params.id as string

  return <HybridPortfolio portfolioId={portfolioId} />
}