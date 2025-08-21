'use client';

import { useState } from 'react';
import { UnifiedIntelligenceSystem } from '@/components/unified-intelligence/UnifiedIntelligenceSystem';
import { useNavigationStoreRefactored } from '@/stores/navigation-store-refactored';

export default function UnifiedIntelligencePage() {
  const { currentMode } = useNavigationStoreRefactored();
  const [navigationMode, setNavigationMode] = useState<'traditional' | 'assisted' | 'autonomous'>(
    currentMode?.mode || 'autonomous'
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <UnifiedIntelligenceSystem navigationMode={navigationMode} />
    </div>
  );
}