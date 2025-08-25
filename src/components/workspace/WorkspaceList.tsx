'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { InvestmentWorkspace, WorkspaceFilters, WorkspaceType, WorkspaceStatus } from '@/types/workspace';
import { Plus, Filter, Search, Users, Calendar, TrendingUp } from 'lucide-react';

interface WorkspaceListProps {
  workspaces: InvestmentWorkspace[];
  loading?: boolean;
  onCreateWorkspace?: () => void;
  onWorkspaceSelect?: (workspace: InvestmentWorkspace) => void;
}

const getStatusColor = (status: WorkspaceStatus): string => {
  switch (status) {
    case 'DRAFT': return 'bg-gray-100 text-gray-700';
    case 'ACTIVE': return 'bg-blue-100 text-blue-700';
    case 'REVIEW': return 'bg-yellow-100 text-yellow-700';
    case 'COMPLETED': return 'bg-green-100 text-green-700';
    case 'ARCHIVED': return 'bg-gray-100 text-gray-500';
    default: return 'bg-gray-100 text-gray-700';
  }
};

const getTypeColor = (type: WorkspaceType): string => {
  switch (type) {
    case 'SCREENING': return 'bg-blue-100 text-blue-700';
    case 'DUE_DILIGENCE': return 'bg-orange-100 text-orange-700';
    case 'IC_PREPARATION': return 'bg-red-100 text-red-700';
    case 'MONITORING': return 'bg-green-100 text-green-700';
    case 'UNIFIED': return 'bg-blue-100 text-blue-700';
    default: return 'bg-gray-100 text-gray-700';
  }
};

export function WorkspaceList({ 
  workspaces, 
  loading = false, 
  onCreateWorkspace,
  onWorkspaceSelect 
}: WorkspaceListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<WorkspaceFilters>({});

  const filteredWorkspaces = workspaces.filter(workspace => {
    const matchesSearch = !searchTerm || 
      workspace.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      workspace.dealName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      workspace.description?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = !filters.status?.length || 
      filters.status.includes(workspace.status);

    const matchesType = !filters.type?.length || 
      filters.type.includes(workspace.type);

    return matchesSearch && matchesStatus && matchesType;
  });

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <Card key={i} className="p-6 animate-pulse">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <div className="h-5 bg-gray-200 rounded w-48"></div>
                <div className="h-4 bg-gray-200 rounded w-32"></div>
              </div>
              <div className="flex space-x-2">
                <div className="h-6 bg-gray-200 rounded w-16"></div>
                <div className="h-6 bg-gray-200 rounded w-20"></div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Workspaces</h1>
          <p className="text-gray-600 mt-1">Collaborative spaces for investment analysis</p>
        </div>
        
        <Button onClick={onCreateWorkspace} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          New Workspace
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search workspaces..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2"
        >
          <Filter className="w-4 h-4" />
          Filters
        </Button>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <Card className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <div className="space-y-2">
                {(['DRAFT', 'ACTIVE', 'REVIEW', 'COMPLETED'] as WorkspaceStatus[]).map(status => (
                  <label key={status} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.status?.includes(status) || false}
                      onChange={(e) => {
                        const currentStatus = filters.status || [];
                        if (e.target.checked) {
                          setFilters({ ...filters, status: [...currentStatus, status] });
                        } else {
                          setFilters({ ...filters, status: currentStatus.filter(s => s !== status) });
                        }
                      }}
                      className="mr-2"
                    />
                    <span className="text-sm capitalize">{status.toLowerCase()}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
              <div className="space-y-2">
                {(['SCREENING', 'DUE_DILIGENCE', 'IC_PREPARATION', 'MONITORING'] as WorkspaceType[]).map(type => (
                  <label key={type} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.type?.includes(type) || false}
                      onChange={(e) => {
                        const currentTypes = filters.type || [];
                        if (e.target.checked) {
                          setFilters({ ...filters, type: [...currentTypes, type] });
                        } else {
                          setFilters({ ...filters, type: currentTypes.filter(t => t !== type) });
                        }
                      }}
                      className="mr-2"
                    />
                    <span className="text-sm">{type.replace('_', ' ')}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={() => setFilters({})}
                className="w-full"
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredWorkspaces.map((workspace) => (
          <Card 
            key={workspace.id} 
            className="p-6 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => onWorkspaceSelect?.(workspace)}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {workspace.title}
                </h3>
                {workspace.dealName && (
                  <p className="text-sm text-gray-600 mb-2">
                    Deal: {workspace.dealName}
                  </p>
                )}
                {workspace.description && (
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {workspace.description}
                  </p>
                )}
              </div>
              
              <div className="flex flex-col gap-2">
                <Badge className={getStatusColor(workspace.status)}>
                  {workspace.status}
                </Badge>
                <Badge className={getTypeColor(workspace.type)}>
                  {workspace.type.replace('_', ' ')}
                </Badge>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-500">Progress</span>
                <span className="text-xs text-gray-500">{workspace.overallProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${workspace.overallProgress}%` }}
                ></div>
              </div>
            </div>
            
            {/* Metadata */}
            <div className="flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  <span>{workspace.participants.length} members</span>
                </div>
                
                <div className="flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  <span>{workspace.completedComponents}/{workspace.totalComponents} tasks</span>
                </div>
                
                {workspace.targetCompletionDate && (
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>Due {new Date(workspace.targetCompletionDate).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
              
              <div>
                Updated {new Date(workspace.updatedAt).toLocaleDateString()}
              </div>
            </div>
            
            {/* Tags */}
            {workspace.tags && workspace.tags.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1">
                {(workspace.tags as string[]).slice(0, 3).map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {(workspace.tags as string[]).length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{(workspace.tags as string[]).length - 3} more
                  </Badge>
                )}
              </div>
            )}
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredWorkspaces.length === 0 && !loading && (
        <Card className="p-12 text-center">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {searchTerm || Object.keys(filters).length > 0 ? 'No workspaces found' : 'No workspaces yet'}
          </h3>
          <p className="text-gray-600 mb-4">
            {searchTerm || Object.keys(filters).length > 0 
              ? 'Try adjusting your search or filters' 
              : 'Create your first workspace to get started with collaborative investment analysis'
            }
          </p>
          {(!searchTerm && Object.keys(filters).length === 0) && (
            <Button onClick={onCreateWorkspace} className="flex items-center gap-2 mx-auto">
              <Plus className="w-4 h-4" />
              Create Workspace
            </Button>
          )}
        </Card>
      )}
    </div>
  );
}