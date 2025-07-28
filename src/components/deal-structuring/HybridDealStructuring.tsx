'use client';

import React from 'react';
import { useViewContext } from '@/hooks/use-view-context';
import DealStructuringTraditional from './DealStructuringTraditional';
import DealStructuringAssisted from './DealStructuringAssisted';
import DealStructuringAutonomous from './DealStructuringAutonomous';

const HybridDealStructuring: React.FC = () => {
  const { viewMode } = useViewContext();

  switch (viewMode) {
    case 'traditional':
      return <DealStructuringTraditional />;
    case 'assisted':
      return <DealStructuringAssisted />;
    case 'autonomous':
      return <DealStructuringAutonomous />;
    default:
      return <DealStructuringAssisted />; // Default to assisted mode
  }
};

export default HybridDealStructuring;