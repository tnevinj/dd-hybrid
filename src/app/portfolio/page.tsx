'use client';

import React from 'react';
import { UnifiedPortfolioManager } from '@/components/portfolio/UnifiedPortfolioManager';
import { ErrorBoundary } from '@/components/portfolio/ErrorBoundary';

export default function PortfolioPage() {
  return (
    <ErrorBoundary>
      <UnifiedPortfolioManager />
    </ErrorBoundary>
  );
}