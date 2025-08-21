'use client'

import React from 'react'
import { useParams } from 'next/navigation'
import { HybridPortfolioRefactored } from '@/components/portfolio/HybridPortfolioRefactored'

export default function PortfolioPage() {
  const params = useParams()
  const portfolioId = params.id as string

  return <HybridPortfolioRefactored />
}