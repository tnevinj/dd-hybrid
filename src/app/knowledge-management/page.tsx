'use client';

import React, { useState } from 'react';
import { KnowledgeManagementDashboard } from '@/components/knowledge-management/KnowledgeManagementDashboard';

export default function KnowledgeManagementPage() {
  const [navigationMode, setNavigationMode] = useState<'traditional' | 'assisted' | 'autonomous'>('traditional');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <KnowledgeManagementDashboard 
          navigationMode={navigationMode}
          onModeChange={setNavigationMode}
        />
      </div>
    </div>
  );
}