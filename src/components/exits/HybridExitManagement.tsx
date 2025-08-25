'use client';

import React, { useState } from 'react';
import { ExitManagementTraditional } from './ExitManagementTraditional';
import { ExitManagementAssisted } from './ExitManagementAssisted';
import { ExitManagementAutonomous } from './ExitManagementAutonomous';
import { HybridModeSwitcher } from '@/components/shared/HybridModeSwitcher';
import { HybridModeHeader } from '@/components/shared/HybridModeHeader';
import { HybridModeExplanation } from '@/components/shared/HybridModeExplanation';
import type { HybridMode } from '@/components/shared';

export function HybridExitManagement() {
  const [mode, setMode] = useState<HybridMode>('traditional');

  const modeExplanations = {
    traditional: {
      title: "Traditional Exit Management",
      description: "Manual exit process management with comprehensive tracking and reporting tools.",
      features: [
        "Exit pipeline tracking and management",
        "Manual exit process workflows",
        "Exit preparation checklists and tasks",
        "Exit analytics and reporting dashboards",
        "Document management and templates"
      ]
    },
    assisted: {
      title: "AI-Assisted Exit Management", 
      description: "Enhanced exit management with AI-powered insights and recommendations.",
      features: [
        "AI-powered exit timing recommendations",
        "Market intelligence and opportunity scoring",
        "Automated exit preparation workflows",
        "Predictive exit analytics and valuations",
        "Smart document generation and compliance"
      ]
    },
    autonomous: {
      title: "Autonomous Exit Management",
      description: "Fully autonomous exit process management with minimal human intervention.",
      features: [
        "Autonomous exit opportunity identification",
        "Self-managing exit preparation workflows",
        "Automated market timing optimization",
        "Real-time exit process orchestration",
        "Continuous exit strategy optimization"
      ]
    }
  };

  const renderExitComponent = () => {
    switch (mode) {
      case 'traditional':
        return <ExitManagementTraditional onSwitchMode={setMode} />;
      case 'assisted':
        return <ExitManagementAssisted onSwitchMode={setMode} />;
      case 'autonomous':
        return <ExitManagementAutonomous onSwitchMode={setMode} />;
      default:
        return <ExitManagementTraditional onSwitchMode={setMode} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <HybridModeHeader 
        title="Exit Management"
        subtitle="Comprehensive exit strategy and process management"
        mode={mode}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <HybridModeSwitcher 
            currentMode={mode} 
            onModeChange={setMode}
            explanation={modeExplanations[mode]}
          />
        </div>
        
        <HybridModeExplanation 
          mode={mode}
          explanation={modeExplanations[mode]}
        />
        
        <div className="mt-8">
          {renderExitComponent()}
        </div>
      </div>
    </div>
  );
}