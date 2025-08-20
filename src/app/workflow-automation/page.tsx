'use client';

import React, { useState } from 'react';
import { WorkflowAutomationDashboard } from '@/components/workflow-automation/WorkflowAutomationDashboard';

export default function WorkflowAutomationPage() {
  const [navigationMode, setNavigationMode] = useState<'traditional' | 'assisted' | 'autonomous'>('traditional');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <WorkflowAutomationDashboard 
          navigationMode={navigationMode}
          onModeChange={setNavigationMode}
        />
      </div>
    </div>
  );
}