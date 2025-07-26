'use client';

import React, { useState, useEffect } from 'react';
import { WorkspaceList, WorkspaceQuickCreate } from '@/components/workspace';
import { InvestmentWorkspace, WorkspaceCreateRequest } from '@/types/workspace';

export default function WorkspacesPage() {
  const [workspaces, setWorkspaces] = useState<InvestmentWorkspace[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [error, setError] = useState<string | null>(null);
  

  useEffect(() => {
    fetchWorkspaces();
  }, []);

  const fetchWorkspaces = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/workspaces');
      
      if (!response.ok) {
        throw new Error('Failed to fetch workspaces');
      }
      
      const data = await response.json();
      setWorkspaces(data.workspaces || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching workspaces:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateWorkspace = async (request: WorkspaceCreateRequest) => {
    try {
      const response = await fetch('/api/workspaces', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create workspace');
      }
      
      const newWorkspace = await response.json();
      setWorkspaces(prev => [newWorkspace, ...prev]);
      setShowCreate(false);
      
      // Navigate to the new workspace
      window.location.href = `/workspaces/${newWorkspace.id}`;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create workspace');
      console.error('Error creating workspace:', err);
    }
  };

  const handleWorkspaceSelect = (workspace: InvestmentWorkspace) => {
    window.location.href = `/workspaces/${workspace.id}`;
  };

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <h3 className="text-red-800 font-medium">Error</h3>
          <p className="text-red-700 mt-1">{error}</p>
          <button
            onClick={() => {
              setError(null);
              fetchWorkspaces();
            }}
            className="mt-2 text-red-800 underline hover:text-red-900"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {showCreate ? (
        <WorkspaceQuickCreate
          onCreateWorkspace={handleCreateWorkspace}
          onCancel={() => setShowCreate(false)}
        />
      ) : (
        <WorkspaceList
          workspaces={workspaces}
          loading={loading}
          onCreateWorkspace={() => setShowCreate(true)}
          onWorkspaceSelect={handleWorkspaceSelect}
        />
      )}
    </div>
  );
}