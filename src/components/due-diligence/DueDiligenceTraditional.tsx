'use client'

import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { DDTabs } from './DDTabs'
import { RiskAnalysisHub } from './RiskAnalysisHub'
import { DocumentManagement } from './DocumentManagement'
import { FindingsManagement } from './FindingsManagement'
import { DueDiligenceDashboard } from './DueDiligenceDashboard'
import { OperationalAssessment } from './OperationalAssessment'
import { ManagementTeamAssessment } from './ManagementTeamAssessment'
import { 
  CheckSquare,
  AlertTriangle,
  FileText,
  Users,
  MessageCircle,
  Calendar,
  Settings,
  Download,
  Share,
  ArrowLeft,
  User
} from 'lucide-react'

interface DueDiligenceTraditionalProps {
  project: any // Using any for demo - replace with proper type
  projects?: any[]
  metrics?: any
  isLoading?: boolean
  onSelectProject?: (project: any | undefined) => void
}

export function DueDiligenceTraditional({ 
  project, 
  projects = [], 
  metrics, 
  isLoading = false,
  onSelectProject 
}: DueDiligenceTraditionalProps) {
  const [activeTab, setActiveTab] = React.useState('overview')

  // Sample data for traditional view
  const recentActivities = [
    {
      id: '1',
      action: 'Document uploaded',
      details: 'Financial statements Q1-Q3 2024.pdf',
      user: 'Sarah Johnson',
      timestamp: '2 hours ago'
    },
    {
      id: '2', 
      action: 'Task completed',
      details: 'Management interview - CEO completed',
      user: 'Mike Chen',
      timestamp: '4 hours ago'
    },
    {
      id: '3',
      action: 'Finding added',
      details: 'Customer concentration risk identified',
      user: 'Sarah Johnson', 
      timestamp: '6 hours ago'
    }
  ]

  const upcomingTasks = [
    {
      id: '1',
      title: 'Review legal contracts',
      assignee: 'Legal Team',
      dueDate: '2025-07-24',
      priority: 'high' as const,
      category: 'Legal Review'
    },
    {
      id: '2',
      title: 'Analyze customer data',
      assignee: 'Sarah Johnson',
      dueDate: '2025-07-25', 
      priority: 'medium' as const,
      category: 'Commercial DD'
    },
    {
      id: '3',
      title: 'IT infrastructure assessment',
      assignee: 'Tech Team',
      dueDate: '2025-07-26',
      priority: 'medium' as const,
      category: 'Technical DD'
    }
  ]

  const renderOverviewTab = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main metrics */}
      <div className="lg:col-span-2 space-y-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="border-gray-200">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-gray-900">{project?.tasksCompleted || 0}/{project?.tasksTotal || 0}</div>
              <div className="text-sm text-gray-600">Tasks Complete</div>
              <div className="text-xs text-gray-500 mt-1">Manual tracking</div>
            </CardContent>
          </Card>
          <Card className="border-gray-200">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-gray-900">{project?.findingsCount || 0}</div>
              <div className="text-sm text-gray-600">Active Findings</div>
              <div className="text-xs text-gray-500 mt-1">Expert review</div>
            </CardContent>
          </Card>
          <Card className="border-gray-200">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-gray-900">{project?.risksCount || 0}</div>
              <div className="text-sm text-gray-600">Risk Items</div>
              <div className="text-xs text-gray-500 mt-1">Manual assessment</div>
            </CardContent>
          </Card>
          <Card className="border-gray-200">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-gray-900">{project?.documentsCount || 0}</div>
              <div className="text-sm text-gray-600">Documents</div>
              <div className="text-xs text-gray-500 mt-1">Human reviewed</div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MessageCircle className="w-5 h-5 mr-2" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">{activity.action}</p>
                      <span className="text-xs text-gray-500">{activity.timestamp}</span>
                    </div>
                    <p className="text-sm text-gray-600">{activity.details}</p>
                    <p className="text-xs text-gray-500">by {activity.user}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        {/* Upcoming Tasks */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-sm">
              <CheckSquare className="w-4 h-4 mr-2" />
              Upcoming Tasks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingTasks.map((task) => (
                <div key={task.id} className="border rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant={task.priority === 'high' ? 'destructive' : 'outline'} className="text-xs">
                      {task.priority}
                    </Badge>
                    <span className="text-xs text-gray-500">{task.dueDate}</span>
                  </div>
                  <h4 className="text-sm font-medium mb-1">{task.title}</h4>
                  <p className="text-xs text-gray-600">{task.category}</p>
                  <p className="text-xs text-gray-500">Assigned: {task.assignee}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Team */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-sm">
              <Users className="w-4 h-4 mr-2" />
              Team Members
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {['Sarah Johnson (Lead)', 'Mike Chen', 'Alex Thompson', 'Legal Team', 'Tech Team'].map((member, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-xs text-white">
                    {member.charAt(0)}
                  </div>
                  <span className="text-sm">{member}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" size="sm" className="w-full justify-start">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start">
              <Share className="w-4 h-4 mr-2" />
              Share Project
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start">
              <Calendar className="w-4 h-4 mr-2" />
              Schedule Meeting
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  // If no project is selected, show the dashboard
  if (!project) {
    return <DueDiligenceDashboard className="traditional-mode" />
  }

  // If a project is selected, show project details with navigation
  return (
    <div className="p-6">
      {/* Header - Traditional Theme */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <div className="flex items-center space-x-3">
            <h1 className="text-3xl font-bold text-gray-900">Due Diligence Project</h1>
            <Badge className="bg-gray-100 text-gray-800 border border-gray-300 flex items-center space-x-1">
              <User className="h-3 w-3" />
              <span>Traditional Mode</span>
            </Badge>
          </div>
          <p className="text-gray-600 mt-1">Complete manual control over due diligence processes</p>
        </div>
      </div>

      {/* Traditional Navigation Tabs */}
      <DDTabs 
        activeTab={activeTab}
        onTabChange={setActiveTab}
        mode="traditional"
      />
      
      <div className="mt-6">
        {activeTab === 'overview' && renderOverviewTab()}
        {activeTab === 'tasks' && (
          <div className="text-center py-12">
            <CheckSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600">Task Management</h3>
            <p className="text-gray-500">Comprehensive task tracking and assignment</p>
          </div>
        )}
        {activeTab === 'risks' && (
          <RiskAnalysisHub projectId={project?.id} />
        )}
        {activeTab === 'documents' && (
          <DocumentManagement projectId={project?.id} />
        )}
        {activeTab === 'findings' && (
          <FindingsManagement projectId={project?.id} />
        )}
        {activeTab === 'operational' && (
          <OperationalAssessment projectId={project?.id} mode="traditional" />
        )}
        {activeTab === 'management' && (
          <ManagementTeamAssessment projectId={project?.id} mode="traditional" />
        )}
        {activeTab === 'analytics' && (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600">Manual Analytics & Reporting</h3>
            <p className="text-gray-500">Traditional project insights and performance metrics</p>
          </div>
        )}
      </div>

      {/* Manual Process Notice */}
      <div className="mt-6 p-4 bg-gray-100 border border-gray-200 rounded-lg">
        <div className="flex items-start space-x-3">
          <User className="h-5 w-5 text-gray-600 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-gray-900 mb-1">Traditional Manual Process</h4>
            <p className="text-sm text-gray-600">
              You have complete control over the due diligence process. All analysis, risk assessment, 
              and decision-making is performed manually without AI assistance. Use the tabs above to 
              navigate through different aspects of your due diligence workflow.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
