'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useAutonomousStore } from '@/stores/autonomous-store';
import { ZIndex, getZIndexStyle } from '@/styles/z-index';
import { cn } from '@/lib/utils';
import { 
  Search, 
  Plus, 
  Filter,
  Folder,
  FileText,
  PieChart,
  BarChart3,
  TrendingUp,
  Users,
  Calendar,
  Star,
  MoreVertical
} from 'lucide-react';

interface Project {
  id: string;
  name: string;
  type: 'portfolio' | 'deal' | 'company' | 'report' | 'analysis';
  status: 'active' | 'completed' | 'draft' | 'review';
  lastActivity: Date;
  priority: 'high' | 'medium' | 'low';
  unreadMessages?: number;
  metadata?: {
    value?: string;
    progress?: number;
    team?: string[];
  };
}

interface ProjectSelectorProps {
  projectType: 'dashboard' | 'portfolio' | 'due-diligence' | 'workspace' | 'deal-screening';
  selectedProjectId?: string;
  onProjectSelect: (project: Project) => void;
  className?: string;
  collapsed?: boolean;
  onToggle?: () => void;
}

// Mock projects removed - now using unified data from store

export function ProjectSelector({ 
  projectType, 
  selectedProjectId, 
  onProjectSelect, 
  className = '',
  collapsed = false,
  onToggle
}: ProjectSelectorProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const { projects } = useAutonomousStore();

  const projectsForType = projects[projectType] || [];

  const filteredProjects = projectsForType.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || project.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getProjectIcon = (type: Project['type']) => {
    switch (type) {
      case 'portfolio': return PieChart;
      case 'deal': return TrendingUp;
      case 'company': return FileText;
      case 'report': return BarChart3;
      case 'analysis': return FileText;
      default: return Folder;
    }
  };

  const getStatusColor = (status: Project['status']) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'review': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: Project['priority']) => {
    switch (priority) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const formatLastActivity = (date: Date | string) => {
    const now = new Date();
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    // Validate date
    if (!dateObj || isNaN(dateObj.getTime())) {
      return 'Unknown';
    }
    
    const diff = now.getTime() - dateObj.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    return 'Just now';
  };

  // Mobile overlay for when sidebar is open
  const MobileSidebarOverlay = () => (
    <div 
      className="lg:hidden fixed inset-0 bg-black bg-opacity-50" 
      style={getZIndexStyle(ZIndex.OVERLAY)}
      onClick={onToggle}
    />
  );

  return (
    <>
      {/* Mobile overlay */}
      {!collapsed && <MobileSidebarOverlay />}
      
      {/* Sidebar */}
      <div className={cn(
        "w-80 bg-gray-50 border-r border-gray-200 flex flex-col h-full transition-transform duration-300 ease-in-out lg:translate-x-0",
        "lg:static lg:w-80", // Always visible on desktop
        "fixed inset-y-0 left-0 lg:relative", // Fixed position on mobile, relative on desktop
        collapsed ? "-translate-x-full lg:translate-x-0" : "translate-x-0", // Hide on mobile when collapsed
        className
      )} 
      style={{
        ...getZIndexStyle(ZIndex.STICKY),
        paddingTop: 'var(--autonomous-header-height, 64px)' // Account for fixed header
      }}
      >
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-gray-900">Projects</h2>
          <Button variant="ghost" size="sm">
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        
        {/* Search */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects..."
            className="pl-10"
          />
        </div>

        {/* Filters */}
        <div className="flex space-x-2">
          <Button
            variant={filterStatus === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterStatus('all')}
            className="text-xs"
          >
            All
          </Button>
          <Button
            variant={filterStatus === 'active' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterStatus('active')}
            className="text-xs"
          >
            Active
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-xs"
          >
            <Filter className="w-3 h-3" />
          </Button>
        </div>
      </div>

      {/* Project List */}
      <div className="flex-1 overflow-y-auto">
        {filteredProjects.length === 0 ? (
          <div className="p-6 text-center">
            <Folder className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">No projects found</p>
          </div>
        ) : (
          <div className="p-2 space-y-2">
            {filteredProjects.map((project) => {
              const Icon = getProjectIcon(project.type);
              const isSelected = project.id === selectedProjectId;
              
              return (
                <Card
                  key={project.id}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    isSelected ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:bg-white'
                  }`}
                  onClick={() => onProjectSelect(project)}
                >
                  <CardContent className="p-3">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2 flex-1">
                        <Icon className="w-4 h-4 text-gray-600 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-sm text-gray-900 truncate">
                            {project.name}
                          </h3>
                        </div>
                        {project.unreadMessages && (
                          <Badge variant="destructive" className="text-xs px-1.5 py-0.5">
                            {project.unreadMessages}
                          </Badge>
                        )}
                      </div>
                      <Button variant="ghost" size="sm" className="p-1 h-auto">
                        <MoreVertical className="w-3 h-3" />
                      </Button>
                    </div>

                    <div className="flex items-center justify-between mb-2">
                      <Badge className={`text-xs ${getStatusColor(project.status)}`}>
                        {project.status}
                      </Badge>
                      <span className={`text-xs font-medium ${getPriorityColor(project.priority)}`}>
                        {project.priority}
                      </span>
                    </div>

                    {project.metadata?.value && (
                      <div className="text-xs text-gray-600 mb-1">
                        Value: {project.metadata.value}
                      </div>
                    )}

                    {project.metadata?.progress !== undefined && (
                      <div className="mb-2">
                        <div className="flex justify-between text-xs text-gray-600 mb-1">
                          <span>Progress</span>
                          <span>{project.metadata.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div
                            className="bg-blue-600 h-1.5 rounded-full transition-all"
                            style={{ width: `${project.metadata.progress}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {project.metadata?.team && (
                      <div className="mb-2">
                        <div className="flex flex-wrap gap-1">
                          {project.metadata.team.slice(0, 2).map((member, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs px-1.5 py-0.5">
                              {member}
                            </Badge>
                          ))}
                          {project.metadata.team.length > 2 && (
                            <Badge variant="outline" className="text-xs px-1.5 py-0.5">
                              +{project.metadata.team.length - 2}
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{formatLastActivity(project.lastActivity)}</span>
                      <Calendar className="w-3 h-3" />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
      </div>
    </>
  );
}