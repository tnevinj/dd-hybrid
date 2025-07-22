'use client'

import * as React from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useNavigationStore } from '@/stores/navigation-store'
import { ModeSwitcher } from '@/components/navigation/mode-switcher'
import { 
  TrendingUp, 
  AlertCircle, 
  CheckCircle, 
  Clock,
  FileText,
  Users,
  DollarSign,
  Activity,
  FolderOpen,
  Plus,
  ArrowRight,
  Wand2
} from 'lucide-react'

export default function DashboardPage() {
  const { 
    currentMode, 
    addRecommendation,
    addInsight,
    recommendations 
  } = useNavigationStore()

  // Demo function to add sample recommendations
  const addSampleRecommendations = React.useCallback(() => {
    const sampleRecs = [
      {
        id: 'rec-1',
        type: 'suggestion' as const,
        priority: 'high' as const,
        title: 'TechCorp DD Review Ready',
        description: 'Financial model analysis is complete. 3 risk areas identified that need attention.',
        actions: [
          {
            id: 'action-1',
            label: 'Review Findings',
            action: 'REVIEW_FINDINGS',
            primary: true,
            estimatedTimeSaving: 15
          }
        ],
        confidence: 0.92,
        moduleContext: 'due-diligence',
        timestamp: new Date('2025-07-21T10:00:00')
      },
      {
        id: 'rec-2',
        type: 'automation' as const,
        priority: 'medium' as const,
        title: 'Automate Report Generation',
        description: 'I can generate the quarterly investor report based on your existing templates.',
        actions: [
          {
            id: 'action-2',
            label: 'Generate Report',
            action: 'GENERATE_REPORT',
            primary: true,
            estimatedTimeSaving: 45
          }
        ],
        confidence: 0.87,
        moduleContext: 'reports',
        timestamp: new Date('2025-07-21T10:00:00')
      }
    ]

    sampleRecs.forEach(rec => addRecommendation(rec))
  }, [addRecommendation])

  const [hasAddedSamples, setHasAddedSamples] = React.useState(false)

  React.useEffect(() => {
    // Add sample data only once on first mount if no recommendations exist
    if (!hasAddedSamples && recommendations.length === 0) {
      const timeout = setTimeout(() => {
        addSampleRecommendations()
        setHasAddedSamples(true)
      }, 1000)
      return () => clearTimeout(timeout)
    }
  }, [hasAddedSamples, recommendations.length, addSampleRecommendations])

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">
            Welcome to DD Hybrid - Your intelligent due diligence platform
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="ai" className="capitalize">
            {currentMode.mode} Mode
          </Badge>
        </div>
      </div>

      {/* Mode demonstration */}
      {currentMode.mode === 'traditional' && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-lg text-blue-800">
              Traditional Navigation Mode
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-blue-700 mb-4">
              You&apos;re using traditional navigation. All features are accessible through the sidebar menu.
              AI suggestions are minimal and non-intrusive.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ModeSwitcher />
              <div className="space-y-2">
                <h4 className="font-medium">Available Features:</h4>
                <ul className="text-sm space-y-1">
                  <li>• Full sidebar navigation</li>
                  <li>• Complete feature access</li>
                  <li>• Optional AI hints</li>
                  <li>• Manual workflow control</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Deals</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              +2 from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">DD Projects</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">
              3 in final review
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Team Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">
              +3 new this quarter
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total AUM</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$2.4B</div>
            <p className="text-xs text-muted-foreground">
              +12% this year
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Workspaces Quick Access */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center">
            <FolderOpen className="w-5 h-5 mr-2" />
            Active Workspaces
          </CardTitle>
          <Link href="/workspaces">
            <Button variant="outline" size="sm">
              <Plus className="w-4 h-4 mr-2" />
              New Workspace
            </Button>
          </Link>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-green-500 rounded-full" />
            <div className="flex-1">
              <p className="text-sm font-medium">TechCorp DD</p>
              <p className="text-xs text-gray-500">Due diligence • 3 work products</p>
            </div>
            <Link href="/workspaces/1">
              <ArrowRight className="w-4 h-4 text-gray-400" />
            </Link>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full" />
            <div className="flex-1">
              <p className="text-sm font-medium">HealthCo Analysis</p>
              <p className="text-xs text-gray-500">Financial modeling • 2 work products</p>
            </div>
            <Link href="/workspaces/2">
              <ArrowRight className="w-4 h-4 text-gray-400" />
            </Link>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-orange-500 rounded-full" />
            <div className="flex-1">
              <p className="text-sm font-medium">RetailCo Research</p>
              <p className="text-xs text-gray-500">Market research • 1 work product</p>
            </div>
            <Link href="/workspaces/3">
              <ArrowRight className="w-4 h-4 text-gray-400" />
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              <div className="flex-1">
                <p className="text-sm font-medium">TechCorp DD completed</p>
                <p className="text-xs text-gray-500">2 hours ago</p>
              </div>
              <Badge variant="success">Completed</Badge>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full" />
              <div className="flex-1">
                <p className="text-sm font-medium">HealthCo financial model updated</p>
                <p className="text-xs text-gray-500">4 hours ago</p>
              </div>
              <Badge variant="info">Updated</Badge>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-orange-500 rounded-full" />
              <div className="flex-1">
                <p className="text-sm font-medium">RetailCo DD started</p>
                <p className="text-xs text-gray-500">1 day ago</p>
              </div>
              <Badge variant="warning">In Progress</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Deadlines</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Clock className="h-4 w-4 text-red-500" />
                <div>
                  <p className="text-sm font-medium">TechCorp IC Meeting</p>
                  <p className="text-xs text-gray-500">Tomorrow, 2:00 PM</p>
                </div>
              </div>
              <Badge variant="destructive">Urgent</Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Clock className="h-4 w-4 text-orange-500" />
                <div>
                  <p className="text-sm font-medium">Q3 LP Report</p>
                  <p className="text-xs text-gray-500">In 3 days</p>
                </div>
              </div>
              <Badge variant="warning">High</Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Clock className="h-4 w-4 text-blue-500" />
                <div>
                  <p className="text-sm font-medium">HealthCo Site Visit</p>
                  <p className="text-xs text-gray-500">Next week</p>
                </div>
              </div>
              <Badge variant="info">Medium</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Features Demo */}
      {currentMode.mode !== 'traditional' && (
        <Card className="border-purple-200 bg-purple-50">
          <CardHeader>
            <CardTitle className="text-lg text-purple-800 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2" />
              AI Intelligence Active
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-purple-700 mb-4">
              AI assistance is enabled. The system is learning your patterns and will provide 
              proactive recommendations.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <CheckCircle className="w-6 h-6 text-purple-600" />
                </div>
                <p className="text-sm font-medium">Pattern Recognition</p>
                <p className="text-xs text-purple-600">Active</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <AlertCircle className="w-6 h-6 text-purple-600" />
                </div>
                <p className="text-sm font-medium">Risk Detection</p>
                <p className="text-xs text-purple-600">Monitoring</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
                <p className="text-sm font-medium">Automation</p>
                <p className="text-xs text-purple-600">Available</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}