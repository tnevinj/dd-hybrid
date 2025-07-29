'use client';

import React from 'react';
import { HybridPortfolio } from '@/components/portfolio/HybridPortfolio';
import { ErrorBoundary } from '@/components/portfolio/ErrorBoundary';

export default function PortfolioPage() {
  return (
    <ErrorBoundary>
      <HybridPortfolio />
    </ErrorBoundary>
  );
}