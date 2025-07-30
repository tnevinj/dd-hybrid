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
  FileText,
  Activity,
  Users,
  DollarSign,
  FolderOpen,
  ArrowRight,
  Clock,
  Calendar,
  BarChart3,
  PieChart,
  TrendingUp,
  User,
  Settings
} from 'lucide-react'

import { SecondaryEdgeDashboard } from './SecondaryEdgeDashboard'

interface DashboardTraditionalProps {
  dashboardData?: any
  activeDeals?: any[]
  recentActivity?: any[]
  upcomingDeadlines?: any[]
  workspaces?: any[]
  metrics?: any
  isLoading?: boolean
  onCreateWorkspace?: () => void
  onViewWorkspace?: (id: string) => void
  onCreateDeal?: () => void
  onViewDeal?: (id: string) => void
}

export function DashboardTraditional({
  dashboardData,
  activeDeals = [],
  recentActivity = [],
  upcomingDeadlines = [],
  workspaces = [],
  metrics = {
    activeDeals: 12,
    ddProjects: 8,
    teamMembers: 24,
    totalAUM: 3880000000, // $3.88B to match detailed analytics
    irr: 17.4,
    moic: 1.38
  },
  isLoading = false,
  onCreateWorkspace,
  onViewWorkspace,
  onCreateDeal,
  onViewDeal
}: DashboardTraditionalProps) {
  const [activeView, setActiveView] = useState<'overview' | 'detailed'>('overview')
  const [searchTerm, setSearchTerm] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  const formatCurrency = (value: number) => {
    if (value >= 1000000000) {
      return `$${(value / 1000000000).toFixed(1)}B`
    } else if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(1)}K`
    } else {
      return `$${value.toFixed(0)}`
    }
  }

  const mockActiveDeals = [
    {
      id: '1',
      name: 'TechCorp Acquisition',
      status: 'Due Diligence',
      dealValue: 250000000,
      stage: 'Advanced',
      lastUpdated: '2 hours ago'
    },
    {
      id: '2', 
      name: 'HealthCo Investment',
      status: 'Initial Review',
      dealValue: 180000000,
      stage: 'Early',
      lastUpdated: '1 day ago'
    },
    {
      id: '3',
      name: 'RetailCo Partnership',
      status: 'Documentation',
      dealValue: 320000000,
      stage: 'Final',
      lastUpdated: '3 hours ago'
    }
  ]

  const mockRecentActivity = [
    {
      id: '1',
      type: 'completion',
      title: 'TechCorp DD completed',
      description: 'Financial model analysis finalized',
      timestamp: '2 hours ago',
      status: 'completed'
    },
    {
      id: '2',
      type: 'update',
      title: 'HealthCo financial model updated',
      description: 'Revenue projections revised',
      timestamp: '4 hours ago',
      status: 'updated'
    },
    {
      id: '3',
      type: 'start',
      title: 'RetailCo DD started',
      description: 'Initial documentation review begun',
      timestamp: '1 day ago',
      status: 'in_progress'
    }
  ]

  const mockUpcomingDeadlines = [
    {
      id: '1',
      title: 'TechCorp IC Meeting',
      description: 'Investment Committee presentation',
      dueDate: 'Tomorrow, 2:00 PM',
      priority: 'urgent'
    },
    {
      id: '2',
      title: 'Q3 LP Report',
      description: 'Quarterly limited partner report',
      dueDate: 'In 3 days',
      priority: 'high'
    },
    {
      id: '3',
      title: 'HealthCo Site Visit',
      description: 'Management presentation',
      dueDate: 'Next week',
      priority: 'medium'
    }
  ]

  const mockWorkspaces = [
    {
      id: '1',
      name: 'TechCorp DD',
      type: 'Due diligence',
      workProducts: 3,
      status: 'active',
      lastActivity: '2 hours ago'
    },
    {
      id: '2',
      name: 'HealthCo Analysis',
      type: 'Financial modeling',
      workProducts: 2,
      status: 'active',
      lastActivity: '1 day ago'
    },
    {
      id: '3',
      name: 'RetailCo Research',
      type: 'Market research',
      workProducts: 1,
      status: 'active',
      lastActivity: '3 days ago'
    }
  ]

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-600 mb-4"></div>
        <h3 className="text-xl font-semibold text-gray-700">Loading Dashboard...</h3>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Header - Traditional Theme */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <div className="flex items-center space-x-3">
            <h1 className="text-3xl font-bold text-gray-900">Executive Dashboard</h1>
            <Badge className="bg-gray-100 text-gray-800 border border-gray-300 flex items-center space-x-1">
              <User className="h-3 w-3" />
              <span>Traditional Mode</span>
            </Badge>
          </div>
          <p className="text-gray-600 mt-1">Complete manual control over platform operations and data analysis</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={onCreateDeal} className="flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>New Deal</span>
          </Button>
          <Button variant="outline" onClick={onCreateWorkspace} className="flex items-center space-x-2">
            <FolderOpen className="h-4 w-4" />
            <span>New Workspace</span>
          </Button>
          <Button variant="outline" className="flex items-center space-x-2">
            <Download className="h-4 w-4" />
            <span>Export</span>
          </Button>
          <Button variant="outline" className="flex items-center space-x-2">
            <Settings className="h-4 w-4" />
            <span>Settings</span>
          </Button>
        </div>
      </div>

      {/* View Toggle */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-2">
          <Button 
            variant={activeView === 'overview' ? 'default' : 'outline'}
            onClick={() => setActiveView('overview')}
            className="flex items-center space-x-2"
          >
            <BarChart3 className="h-4 w-4" />
            <span>Executive Overview</span>
          </Button>
          <Button 
            variant={activeView === 'detailed' ? 'default' : 'outline'}
            onClick={() => setActiveView('detailed')}
            className="flex items-center space-x-2"
          >
            <PieChart className="h-4 w-4" />
            <span>Detailed Analytics</span>
          </Button>
        </div>
        
        {/* Manual Search & Filter */}
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search deals, workspaces..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64 border-gray-300 focus:border-gray-500"
            />
          </div>
          <Button 
            variant="outline" 
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 border-gray-300 text-gray-700"
          >
            <Filter className="h-4 w-4" />
            <span>Filters</span>
          </Button>
        </div>
      </div>

      {activeView === 'overview' && (
        <>
          {/* Key Metrics - Manual Focus */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card className="border-gray-200">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Active Deals</CardTitle>
                <FileText className="h-4 w-4 text-gray-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{metrics.activeDeals}</div>
                <div className="flex items-center text-gray-500 text-sm mt-1">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>Manually tracked</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-gray-200">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">DD Projects</CardTitle>
                <Activity className="h-4 w-4 text-gray-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{metrics.ddProjects}</div>
                <div className="flex items-center text-gray-500 text-sm mt-1">
                  <User className="h-4 w-4 mr-1" />
                  <span>Manual review</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-gray-200">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Team Members</CardTitle>
                <Users className="h-4 w-4 text-gray-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{metrics.teamMembers}</div>
                <div className="flex items-center text-gray-500 text-sm mt-1">
                  <Users className="h-4 w-4 mr-1" />
                  <span>Direct management</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-gray-200">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total AUM</CardTitle>
                <DollarSign className="h-4 w-4 text-gray-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{formatCurrency(metrics.totalAUM)}</div>
                <div className="flex items-center text-gray-500 text-sm mt-1">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  <span>Expert analysis</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Active Deals & Workspaces */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Active Deals */}
            <Card className="border-gray-200">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-gray-600" />
                  Active Deals
                </CardTitle>
                <Button variant="outline" size="sm" onClick={onCreateDeal}>
                  <Plus className="w-4 h-4 mr-2" />
                  New Deal
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockActiveDeals.map((deal) => (
                  <div key={deal.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{deal.name}</p>
                      <p className="text-xs text-gray-500">{deal.status} • {formatCurrency(deal.dealValue)}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="text-xs">
                        {deal.stage}
                      </Badge>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => onViewDeal?.(deal.id)}
                      >
                        <ArrowRight className="w-4 h-4 text-gray-400" />
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Active Workspaces */}
            <Card className="border-gray-200">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center">
                  <FolderOpen className="w-5 h-5 mr-2 text-gray-600" />
                  Active Workspaces
                </CardTitle>
                <Button variant="outline" size="sm" onClick={onCreateWorkspace}>
                  <Plus className="w-4 h-4 mr-2" />
                  New Workspace
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockWorkspaces.map((workspace) => (
                  <div key={workspace.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-2 h-2 rounded-full ${
                        workspace.status === 'active' ? 'bg-green-500' : 'bg-gray-400'
                      }`} />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{workspace.name}</p>
                        <p className="text-xs text-gray-500">{workspace.type} • {workspace.workProducts} work products</p>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => onViewWorkspace?.(workspace.id)}
                    >
                      <ArrowRight className="w-4 h-4 text-gray-400" />
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity & Upcoming Deadlines */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="text-gray-900">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockRecentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center space-x-3">
                    <div className={`w-2 h-2 rounded-full ${
                      activity.status === 'completed' ? 'bg-green-500' :
                      activity.status === 'updated' ? 'bg-blue-500' :
                      'bg-orange-500'
                    }`} />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                      <p className="text-xs text-gray-500">{activity.timestamp}</p>
                    </div>
                    <Badge variant={activity.status === 'completed' ? 'default' : 'outline'} className="text-xs">
                      {activity.status === 'completed' ? 'Completed' :
                       activity.status === 'updated' ? 'Updated' : 'In Progress'}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="text-gray-900">Upcoming Deadlines</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockUpcomingDeadlines.map((deadline) => (
                  <div key={deadline.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Clock className={`h-4 w-4 ${
                        deadline.priority === 'urgent' ? 'text-red-500' :
                        deadline.priority === 'high' ? 'text-orange-500' :
                        'text-blue-500'
                      }`} />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{deadline.title}</p>
                        <p className="text-xs text-gray-500">{deadline.dueDate}</p>
                      </div>
                    </div>
                    <Badge variant={deadline.priority === 'urgent' ? 'destructive' : 
                                  deadline.priority === 'high' ? 'default' : 'outline'} 
                           className="text-xs">
                      {deadline.priority === 'urgent' ? 'Urgent' :
                       deadline.priority === 'high' ? 'High' : 'Medium'}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </>
      )}

      {activeView === 'detailed' && (
        <div className="mb-6">
          <SecondaryEdgeDashboard mode="traditional" data={dashboardData} />
        </div>
      )}

      {/* Manual Process Notice */}
      <div className="mt-6 p-4 bg-gray-100 border border-gray-200 rounded-lg">
        <div className="flex items-start space-x-3">
          <User className="h-5 w-5 text-gray-600 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-gray-900 mb-1">Traditional Dashboard Management</h4>
            <p className="text-sm text-gray-600">
              You have complete control over dashboard operations and data analysis. All metrics, deal tracking, 
              and workspace management are performed manually without AI assistance. Use the search and filter 
              tools to organize your data according to your preferences.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardTraditional