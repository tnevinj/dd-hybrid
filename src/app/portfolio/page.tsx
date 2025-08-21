'use client';

import React from 'react';
import { HybridPortfolioRefactored } from '@/components/portfolio/HybridPortfolioRefactored';
import { ErrorBoundary } from '@/components/portfolio/ErrorBoundary';

export default function PortfolioPage() {
  return (
    <ErrorBoundary>
      <HybridPortfolioRefactored />
    </ErrorBoundary>
  );
}