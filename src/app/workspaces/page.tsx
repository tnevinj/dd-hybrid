'use client';

import React from 'react';
import { HybridWorkspace } from '@/components/workspace/HybridWorkspace';
import { ErrorBoundary } from '@/components/ErrorBoundary';

export default function WorkspacesPage() {
  return (
    <ErrorBoundary>
      <HybridWorkspace />
    </ErrorBoundary>
  );
}