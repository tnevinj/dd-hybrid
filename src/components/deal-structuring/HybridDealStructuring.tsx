'use client';

import React, { useState, useEffect } from 'react';
import { useNavigationStore } from '@/stores/navigation-store';
import { UserNavigationMode } from '@/types/navigation';
import { HybridModeHeader } from '@/components/shared/HybridModeHeader';
import { HybridMode } from '@/components/shared/HybridModeSwitcher';
import DealStructuringTraditional from './DealStructuringTraditional';
import DealStructuringAssisted from './DealStructuringAssisted';
import DealStructuringAutonomous from './DealStructuringAutonomous';

const HybridDealStructuring: React.FC = () => {
  const { currentMode, setMode, setCurrentModule, addRecommendation } = useNavigationStore();
  
  // Set current module for navigation store
  useEffect(() => {
    setCurrentModule('deal-structuring');
  }, [setCurrentModule]);

  // Handle mode switching
  const handleModeSwitch = (mode: 'traditional' | 'assisted' | 'autonomous') => {
    const newMode: UserNavigationMode = {
      mode: mode,
      aiPermissions: {
        suggestions: true,
        autoComplete: mode !== 'traditional',
        proactiveActions: mode === 'assisted' || mode === 'autonomous',
        autonomousExecution: mode === 'autonomous',
      },
      preferredDensity: currentMode.preferredDensity
    };
    
    setMode(newMode);
  };

  const renderContent = () => {
    switch (currentMode.mode) {
      case 'traditional':
        return <DealStructuringTraditional />;
      case 'assisted':
        return <DealStructuringAssisted />;
      case 'autonomous':
        return <DealStructuringAutonomous />;
      default:
        return <DealStructuringTraditional />; // Default to traditional mode
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <HybridModeHeader
        currentMode={currentMode.mode as HybridMode}
        onModeChange={handleModeSwitch}
        moduleContext="deal-structuring"
        title="Deal Structuring Hub"
        subtitle="Design, model, and optimize deal structures across all investment strategies"
      />
      {renderContent()}
    </div>
  );
};

export default HybridDealStructuring;