'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { DocumentEditor } from '@/components/work-product';
import { WorkProduct, DocumentSection, WorkProductStatus } from '@/types/work-product';

export default function WorkProductEditorPage() {
  const params = useParams();
  const router = useRouter();
  const workspaceId = params.id as string;
  const workProductId = params.workProductId as string;
  
  const [workProduct, setWorkProduct] = useState<WorkProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  

  useEffect(() => {
    if (workspaceId && workProductId) {
      fetchWorkProduct();
    }
  }, [workspaceId, workProductId]);

  const fetchWorkProduct = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/workspaces/${workspaceId}/work-products/${workProductId}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Work product not found');
        }
        throw new Error('Failed to fetch work product');
      }
      
      const data = await response.json();
      setWorkProduct(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching work product:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (sections: DocumentSection[]) => {
    if (!workProduct) return;
    
    try {
      const response = await fetch(`/api/workspaces/${workspaceId}/work-products/${workProductId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sections,
          lastEditedAt: new Date(),
          wordCount: sections.reduce((count, section) => count + section.content.length, 0)
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to save work product');
      }
      
      const updatedWorkProduct = await response.json();
      setWorkProduct(updatedWorkProduct);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save work product');
      console.error('Error saving work product:', err);
    }
  };

  const handleStatusChange = async (status: WorkProductStatus) => {
    if (!workProduct) return;
    
    try {
      const response = await fetch(`/api/workspaces/${workspaceId}/work-products/${workProductId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update status');
      }
      
      const updatedWorkProduct = await response.json();
      setWorkProduct(updatedWorkProduct);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update status');
      console.error('Error updating status:', err);
    }
  };

  const handleBack = () => {
    router.push(`/workspaces/${workspaceId}?tab=work-products`);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-8 bg-gray-200 rounded"></div>
              <div>
                <div className="w-64 h-8 bg-gray-200 rounded mb-2"></div>
                <div className="w-48 h-4 bg-gray-200 rounded"></div>
              </div>
            </div>
            <div className="flex gap-2">
              <div className="w-20 h-8 bg-gray-200 rounded"></div>
              <div className="w-20 h-8 bg-gray-200 rounded"></div>
              <div className="w-16 h-8 bg-gray-200 rounded"></div>
            </div>
          </div>
          
          <div className="w-full h-32 bg-gray-200 rounded"></div>
          
          <div className="flex gap-6">
            <div className="w-80 h-96 bg-gray-200 rounded"></div>
            <div className="flex-1 h-96 bg-gray-200 rounded"></div>
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
                fetchWorkProduct();
              }}
              className="text-red-800 underline hover:text-red-900"
            >
              Try again
            </button>
            <button
              onClick={handleBack}
              className="text-red-800 underline hover:text-red-900"
            >
              Back to workspace
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!workProduct) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900">Work product not found</h3>
          <p className="text-gray-600 mt-1">The document you're looking for doesn't exist.</p>
          <button
            onClick={handleBack}
            className="mt-4 text-blue-600 underline hover:text-blue-700"
          >
            Back to workspace
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <DocumentEditor
        workProduct={workProduct}
        onSave={handleSave}
        onStatusChange={handleStatusChange}
        onBack={handleBack}
      />
    </div>
  );
}