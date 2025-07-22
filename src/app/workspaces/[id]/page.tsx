'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { WorkspaceDetail } from '@/components/workspace';
import { InvestmentWorkspace } from '@/types/workspace';

export default function WorkspaceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const workspaceId = params.id as string;
  
  const [workspace, setWorkspace] = useState<InvestmentWorkspace | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (workspaceId) {
      fetchWorkspace();
    }
  }, [workspaceId]);

  const fetchWorkspace = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/workspaces/${workspaceId}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Workspace not found');
        }
        throw new Error('Failed to fetch workspace');
      }
      
      const data = await response.json();
      setWorkspace(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching workspace:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.push('/workspaces');
  };

  const handleUpdateWorkspace = async (updates: Partial<InvestmentWorkspace>) => {
    if (!workspace) return;
    
    try {
      const response = await fetch(`/api/workspaces/${workspaceId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update workspace');
      }
      
      const updatedWorkspace = await response.json();
      setWorkspace(updatedWorkspace);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update workspace');
      console.error('Error updating workspace:', err);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-20 h-8 bg-gray-200 rounded"></div>
            <div>
              <div className="w-64 h-8 bg-gray-200 rounded mb-2"></div>
              <div className="w-48 h-4 bg-gray-200 rounded"></div>
            </div>
          </div>
          
          <div className="w-full h-32 bg-gray-200 rounded"></div>
          
          <div className="border-b border-gray-200">
            <div className="flex space-x-8">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="w-24 h-8 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
          
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="w-full h-48 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <h3 className="text-red-800 font-medium">Error</h3>
          <p className="text-red-700 mt-1">{error}</p>
          <div className="mt-4 space-x-2">
            <button
              onClick={() => {
                setError(null);
                fetchWorkspace();
              }}
              className="text-red-800 underline hover:text-red-900"
            >
              Try again
            </button>
            <button
              onClick={handleBack}
              className="text-red-800 underline hover:text-red-900"
            >
              Back to workspaces
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!workspace) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900">Workspace not found</h3>
          <p className="text-gray-600 mt-1">The workspace you're looking for doesn't exist.</p>
          <button
            onClick={handleBack}
            className="mt-4 text-blue-600 underline hover:text-blue-700"
          >
            Back to workspaces
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <WorkspaceDetail
        workspace={workspace}
        onBack={handleBack}
        onUpdateWorkspace={handleUpdateWorkspace}
      />
    </div>
  );
}