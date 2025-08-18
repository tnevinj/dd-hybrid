'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  Search,
  Filter,
  Plus,
  Download,
  Share,
  FolderOpen,
  Users,
  Calendar,
  Clock,
  FileText,
  User,
  Settings,
  ArrowRight
} from 'lucide-react'

interface WorkspaceTraditionalProps {
  workspaces?: any[]
  metrics?: any
  isLoading?: boolean
  onCreateWorkspace?: () => void
  onViewWorkspace?: (id: string) => void
  onEditWorkspace?: (id: string) => void
}

export function WorkspaceTraditional({
  workspaces = [],
  metrics,
  isLoading = false,
  onCreateWorkspace,
  onViewWorkspace,
  onEditWorkspace
}: WorkspaceTraditionalProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [selectedType, setSelectedType] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('')

  // Use provided data or show empty state
  const unifiedMetrics = metrics || {
    total: 0,
    active: 0,
    completed: 0,
    inReview: 0,
    teamMembers: 0,
    avgProgress: 0
  }
  const displayWorkspaces = workspaces || []

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800'
      case 'Review': return 'bg-yellow-100 text-yellow-800'
      case 'Draft': return 'bg-gray-100 text-gray-800'
      case 'Completed': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Due Diligence': return 'bg-purple-100 text-purple-800'
      case 'IC Preparation': return 'bg-red-100 text-red-800'
      case 'Screening': return 'bg-orange-100 text-orange-800'
      case 'Monitoring': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-600 mb-4"></div>
        <h3 className="text-xl font-semibold text-gray-700">Loading Workspaces...</h3>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Header - Traditional Theme */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <div className="flex items-center space-x-3">
            <h1 className="text-3xl font-bold text-gray-900">Workspace Management</h1>
            <Badge className="bg-gray-100 text-gray-800 border border-gray-300 flex items-center space-x-1">
              <User className="h-3 w-3" />
              <span>Traditional Mode</span>
            </Badge>
          </div>
          <p className="text-gray-600 mt-1">Complete manual control over workspace creation and management</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={onCreateWorkspace} className="flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>New Workspace</span>
          </Button>
          <Button variant="outline" className="flex items-center space-x-2">
            <Download className="h-4 w-4" />
            <span>Export</span>
          </Button>
          <Button variant="outline" className="flex items-center space-x-2">
            <Share className="h-4 w-4" />
            <span>Share</span>
          </Button>
          <Button variant="outline" className="flex items-center space-x-2">
            <Settings className="h-4 w-4" />
            <span>Settings</span>
          </Button>
        </div>
      </div>

      {/* Key Metrics - Manual Focus */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2 mb-2">
              <FolderOpen className="h-5 w-5 text-gray-600" />
              <p className="text-sm text-gray-600 font-medium">Total Workspaces</p>
            </div>
            <p className="text-3xl font-bold text-gray-900">{unifiedMetrics.totalWorkspaces}</p>
            <div className="flex items-center text-gray-500 text-sm mt-1">
              <Calendar className="h-4 w-4 mr-1" />
              <span>Manually tracked</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2 mb-2">
              <Clock className="h-5 w-5 text-gray-600" />
              <p className="text-sm text-gray-600 font-medium">Active Workspaces</p>
            </div>
            <p className="text-3xl font-bold text-gray-900">{unifiedMetrics.activeWorkspaces}</p>
            <div className="flex items-center text-gray-500 text-sm mt-1">
              <User className="h-4 w-4 mr-1" />
              <span>Manual review</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2 mb-2">
              <FileText className="h-5 w-5 text-gray-600" />
              <p className="text-sm text-gray-600 font-medium">Completed</p>
            </div>
            <p className="text-3xl font-bold text-gray-900">{unifiedMetrics.completedWorkspaces}</p>
            <div className="flex items-center text-gray-500 text-sm mt-1">
              <Users className="h-4 w-4 mr-1" />
              <span>Expert analysis</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2 mb-2">
              <Users className="h-5 w-5 text-gray-600" />
              <p className="text-sm text-gray-600 font-medium">Team Members</p>
            </div>
            <p className="text-3xl font-bold text-gray-900">{unifiedMetrics.teamMembers}</p>
            <div className="flex items-center text-gray-500 text-sm mt-1">
              <User className="h-4 w-4 mr-1" />
              <span>Direct management</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Manual Search & Filter Controls */}
      <Card className="mb-6 border-gray-200">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl text-gray-900">Manual Search & Filter Controls</CardTitle>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="text-gray-600">
                {displayWorkspaces.length} workspaces
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search workspaces, types, teams..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-gray-300 focus:border-gray-500"
              />
            </div>
            
            <Button 
              variant="outline" 
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 border-gray-300 text-gray-700"
            >
              <Filter className="h-4 w-4" />
              <span>Advanced Filters</span>
            </Button>
          </div>

          {showFilters && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg border">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Workspace Type</label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value="">All Types</option>
                  <option value="due-diligence">Due Diligence</option>
                  <option value="screening">Deal Screening</option>
                  <option value="ic-prep">IC Preparation</option>
                  <option value="monitoring">Portfolio Monitoring</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value="">All Statuses</option>
                  <option value="draft">Draft</option>
                  <option value="active">Active</option>
                  <option value="review">In Review</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Team Size</label>
                <select
                  className="w-full p-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value="">Any Size</option>
                  <option value="small">Small (1-3 members)</option>
                  <option value="medium">Medium (4-6 members)</option>
                  <option value="large">Large (7+ members)</option>
                </select>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Workspace Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {displayWorkspaces.map((workspace) => (
          <Card key={workspace.id} className="border-gray-200 hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{workspace.name}</h3>
                  <p className="text-sm text-gray-600">{workspace.lastActivity}</p>
                </div>
                <div className="flex flex-col space-y-2">
                  <Badge className={`text-xs ${getStatusColor(workspace.status)}`}>
                    {workspace.status}
                  </Badge>
                  <Badge className={`text-xs ${getTypeColor(workspace.type)}`}>
                    {workspace.type}
                  </Badge>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Progress</span>
                  <span className="font-medium">{workspace.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gray-600 h-2 rounded-full" 
                    style={{ width: `${workspace.progress}%` }}
                  />
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Work Products</span>
                  <span className="font-medium">{workspace.workProducts}</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Team Members</span>
                  <span className="font-medium">{workspace.teamMembers}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="flex items-center space-x-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => onViewWorkspace?.(workspace.id)}
                  >
                    View Details
                  </Button>
                  <Button 
                    size="sm" 
                    onClick={() => onEditWorkspace?.(workspace.id)}
                  >
                    Edit
                  </Button>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => onViewWorkspace?.(workspace.id)}
                >
                  <ArrowRight className="w-4 h-4 text-gray-400" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Manual Process Notice */}
      <div className="mt-6 p-4 bg-gray-100 border border-gray-200 rounded-lg">
        <div className="flex items-start space-x-3">
          <User className="h-5 w-5 text-gray-600 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-gray-900 mb-1">Traditional Workspace Management</h4>
            <p className="text-sm text-gray-600">
              You have complete control over workspace creation, organization, and team management. All workspace 
              operations are performed manually without AI assistance. Use the search, filter, and organization 
              tools above to manage your workspaces according to your preferences.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WorkspaceTraditional