'use client'

import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useNavigationStore } from '@/stores/navigation-store'
import { useDueDiligence } from '@/contexts/DueDiligenceContext'
import { useRouter } from 'next/navigation'
import { 
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  FileText,
  Users,
  Search,
  Filter,
  Plus,
  Brain,
  Zap,
  Eye,
  BarChart3,
  Target,
  Shield,
  ExternalLink,
  ArrowRight
} from 'lucide-react'

interface DueDiligenceDashboardProps {
  className?: string
}

export function DueDiligenceDashboard({ className }: DueDiligenceDashboardProps) {
  const { currentMode, addRecommendation, addInsight } = useNavigationStore()
  const { 
    state, 
    getFilteredProjects, 
    setActiveTab,
    selectProject 
  } = useDueDiligence()
  const router = useRouter()

  const projects = getFilteredProjects()
  
  // Demo data - replace with real API calls
  const dashboardMetrics = {
    totalProjects: projects.length || 8,
    activeProjects: 5,
    completedProjects: 3,
    overdueProjects: 2,
    totalTasks: 124,
    completedTasks: 89,
    overdueTasks: 8,
    totalFindings: 23,
    openFindings: 15,
    criticalFindings: 3,
    totalRisks: 18,
    highRisks: 6,
    unresolvedRisks: 12,
    averageProjectDuration: 45, // days
    aiAutomationSavings: 32 // hours saved this month
  }

  // Add AI recommendations based on the data
  React.useEffect(() => {
    if (currentMode.mode !== 'traditional') {
      const recommendations = [
        {
          id: 'dd-rec-1',
          type: 'warning' as const,
          priority: 'high' as const,
          title: '2 Projects Overdue',
          description: 'TechCorp and RetailCo projects are past their target completion dates. Consider resource reallocation.',
          actions: [
            {
              id: 'action-1',
              label: 'Review Projects',
              action: 'REVIEW_OVERDUE_PROJECTS',
              primary: true
            }
          ],
          confidence: 0.95,
          moduleContext: 'due-diligence',
          timestamp: new Date('2025-07-21T09:00:00')
        },
        {
          id: 'dd-rec-2',
          type: 'suggestion' as const,
          priority: 'medium' as const,
          title: 'Pattern Found: Customer Concentration Risk',
          description: 'AI detected similar customer concentration patterns across 3 active projects. Consider standardized analysis.',
          actions: [
            {
              id: 'action-2',
              label: 'Generate Template',
              action: 'CREATE_ANALYSIS_TEMPLATE',
              primary: true,
              estimatedTimeSaving: 120
            }
          ],
          confidence: 0.87,
          moduleContext: 'due-diligence',
          timestamp: new Date('2025-07-21T08:30:00')
        }
      ]

      recommendations.forEach(rec => {
        addRecommendation(rec)
      })
    }
  }, [currentMode.mode, addRecommendation])

  const renderTraditionalMode = () => (
    <div className="space-y-6">
      {/* Traditional Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Due Diligence Dashboard</h1>
          <p className="text-gray-600">Comprehensive project management and analysis</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Project
          </Button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Active Projects"
          value={dashboardMetrics.activeProjects}
          icon={<FileText className="w-4 h-4" />}
          trend="+2 this month"
          trendUp={true}
        />
        <MetricCard
          title="Open Tasks"
          value={dashboardMetrics.totalTasks - dashboardMetrics.completedTasks}
          icon={<Clock className="w-4 h-4" />}
          trend="8 overdue"
          trendUp={false}
        />
        <MetricCard
          title="Critical Findings"
          value={dashboardMetrics.criticalFindings}
          icon={<AlertTriangle className="w-4 h-4" />}
          trend="Needs attention"
          trendUp={false}
        />
        <MetricCard
          title="High Risks"
          value={dashboardMetrics.highRisks}
          icon={<Shield className="w-4 h-4" />}
          trend="12 unresolved"
          trendUp={false}
        />
      </div>
    </div>
  )

  const renderAssistedMode = () => (
    <div className="space-y-6">
      {/* AI-Enhanced Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center">
            Due Diligence Dashboard
            <Badge variant="ai" className="ml-3">AI Assisted</Badge>
          </h1>
          <p className="text-gray-600">AI-powered insights and automation available</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">
            <Brain className="w-4 h-4 mr-2" />
            AI Insights
          </Button>
          <Button variant="ai" size="sm">
            <Zap className="w-4 h-4 mr-2" />
            Auto-Generate Report
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Project
          </Button>
        </div>
      </div>

      {/* AI Insights Banner */}
      <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-blue-50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Brain className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-purple-800">AI Analysis Complete</h3>
                <p className="text-sm text-purple-600">
                  Found 3 efficiency opportunities and 2 risk patterns across projects
                </p>
              </div>
            </div>
            <Button variant="outline" size="sm" className="border-purple-200">
              View Details
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Metrics with AI Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <AIEnhancedMetricCard
          title="Active Projects"
          value={dashboardMetrics.activeProjects}
          icon={<FileText className="w-4 h-4" />}
          trend="+2 this month"
          trendUp={true}
          aiInsight="2 projects show similar risk patterns"
          aiAction="Compare & Standardize"
        />
        <AIEnhancedMetricCard
          title="Automation Savings"
          value={`${dashboardMetrics.aiAutomationSavings}h`}
          icon={<Zap className="w-4 h-4" />}
          trend="This month"
          trendUp={true}
          aiInsight="34% of routine tasks automated"
          aiAction="Increase Automation"
        />
        <AIEnhancedMetricCard
          title="Critical Findings"
          value={dashboardMetrics.criticalFindings}
          icon={<AlertTriangle className="w-4 h-4" />}
          trend="Needs attention"
          trendUp={false}
          aiInsight="2 findings likely related"
          aiAction="Group & Analyze"
        />
        <AIEnhancedMetricCard
          title="Risk Prediction"
          value="87%"
          icon={<Target className="w-4 h-4" />}
          trend="Accuracy"
          trendUp={true}
          aiInsight="Model confidence improving"
          aiAction="View Predictions"
        />
      </div>
    </div>
  )

  const renderAutonomousMode = () => (
    <div className="space-y-6">
      {/* Minimal AI-First Interface */}
      <div className="text-center">
        <div className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-100 to-blue-100 rounded-full mb-4">
          <Brain className="w-5 h-5 text-purple-600" />
          <span className="font-medium text-purple-800">Autonomous Mode Active</span>
        </div>
        <h1 className="text-2xl font-bold mb-2">Due Diligence Command Center</h1>
        <p className="text-gray-600">AI handling routine tasks - focusing on decisions that need you</p>
      </div>

      {/* Conversation-Style Interface */}
      <Card className="max-w-4xl mx-auto">
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <Brain className="w-4 h-4 text-purple-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 mb-1">AI Assistant</p>
                <div className="bg-gray-50 rounded-lg p-3 mb-3">
                  <p className="text-sm">
                    I've analyzed all active DD projects. Here's what needs your attention:
                  </p>
                </div>
                
                {/* Automated Tasks Summary */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-3">
                  <h4 className="font-medium text-green-800 mb-2">✅ Completed Automatically</h4>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>• Updated 47 task statuses based on document reviews</li>
                    <li>• Flagged 3 new risks in TechCorp financial model</li>
                    <li>• Generated preliminary findings summaries for 2 projects</li>
                    <li>• Scheduled 5 follow-up interviews with key personnel</li>
                  </ul>
                </div>

                {/* Decisions Needed */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <h4 className="font-medium text-yellow-800 mb-3">🤔 Decisions Needed</h4>
                  
                  <div className="space-y-3">
                    <DecisionRequest
                      question="RetailCo's customer concentration is 67% (top 3 customers). This exceeds your usual 50% threshold. Should I flag this as high risk?"
                      options={[
                        { label: "Yes, flag as high risk", action: "flag_high_risk", primary: true },
                        { label: "Flag as medium risk", action: "flag_medium_risk" },
                        { label: "No flag needed", action: "no_flag" }
                      ]}
                    />
                    
                    <DecisionRequest
                      question="TechCorp's EBITDA margins show declining trend (23% → 18% → 15%). Should I prioritize operational DD?"
                      options={[
                        { label: "Yes, deep dive on operations", action: "prioritize_ops", primary: true },
                        { label: "Continue standard process", action: "standard_process" },
                        { label: "Focus on cost structure", action: "focus_costs" }
                      ]}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">89%</div>
            <div className="text-sm text-gray-600">Tasks Automated</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">32h</div>
            <div className="text-sm text-gray-600">Time Saved</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">3</div>
            <div className="text-sm text-gray-600">Decisions Pending</div>
          </CardContent>
        </Card>
      </div>

      {/* Project Quick Access */}
      <Card className="mt-6 max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="w-5 h-5 mr-2" />
            Active Projects
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { id: '1', name: 'TechCorp Acquisition', progress: 75, status: 'in-progress' },
              { id: '2', name: 'RetailCo Due Diligence', progress: 25, status: 'active' },
              { id: '3', name: 'HealthCo Investment', progress: 100, status: 'completed' }
            ].map((project) => (
              <div 
                key={project.id} 
                className="border rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => router.push(`/due-diligence/${project.id}`)}
              >
                <h4 className="font-medium mb-2">{project.name}</h4>
                <div className="flex items-center justify-between text-sm">
                  <span>{project.progress}% complete</span>
                  <Badge variant="outline">{project.status}</Badge>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full" 
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )

  return (
    <div className={`p-6 ${className}`}>
      {currentMode.mode === 'traditional' && renderTraditionalMode()}
      {currentMode.mode === 'assisted' && renderAssistedMode()}
      {currentMode.mode === 'autonomous' && renderAutonomousMode()}
      
      {/* Project List - Shown in all modes but styled differently */}
      {currentMode.mode !== 'autonomous' && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Recent Projects</span>
              {currentMode.mode === 'assisted' && (
                <Badge variant="ai" className="text-xs">AI Sorted</Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ProjectsList 
              projects={projects.slice(0, 5)} 
              mode={currentMode.mode} 
              onProjectClick={(projectId) => router.push(`/due-diligence/${projectId}`)}
            />
          </CardContent>
        </Card>
      )}
    </div>
  )
}

// Supporting Components
interface MetricCardProps {
  title: string
  value: number | string
  icon: React.ReactNode
  trend: string
  trendUp: boolean
}

function MetricCard({ title, value, icon, trend, trendUp }: MetricCardProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-600">{title}</span>
          <div className="text-gray-400">{icon}</div>
        </div>
        <div className="text-2xl font-bold mb-1">{value}</div>
        <div className={`text-xs ${trendUp ? 'text-green-600' : 'text-red-600'}`}>
          {trend}
        </div>
      </CardContent>
    </Card>
  )
}

interface AIEnhancedMetricCardProps extends MetricCardProps {
  aiInsight: string
  aiAction: string
}

function AIEnhancedMetricCard({ title, value, icon, trend, trendUp, aiInsight, aiAction }: AIEnhancedMetricCardProps) {
  return (
    <Card className="border-l-4 border-l-purple-400">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-600">{title}</span>
          <div className="flex items-center space-x-1">
            <div className="text-gray-400">{icon}</div>
            <Brain className="w-3 h-3 text-purple-500" />
          </div>
        </div>
        <div className="text-2xl font-bold mb-1">{value}</div>
        <div className={`text-xs mb-2 ${trendUp ? 'text-green-600' : 'text-red-600'}`}>
          {trend}
        </div>
        <div className="text-xs text-purple-600 mb-1">{aiInsight}</div>
        <Button variant="ghost" size="sm" className="text-xs h-6 p-1 text-purple-600">
          {aiAction}
        </Button>
      </CardContent>
    </Card>
  )
}

interface DecisionRequestProps {
  question: string
  options: Array<{
    label: string
    action: string
    primary?: boolean
  }>
}

function DecisionRequest({ question, options }: DecisionRequestProps) {
  return (
    <div className="border border-yellow-300 rounded-lg p-3 bg-white">
      <p className="text-sm text-gray-800 mb-3">{question}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((option, index) => (
          <Button
            key={index}
            variant={option.primary ? "default" : "outline"}
            size="sm"
            className="text-xs"
          >
            {option.label}
          </Button>
        ))}
      </div>
    </div>
  )
}

interface ProjectsListProps {
  projects: any[] // Using any for demo data
  mode: string
  onProjectClick?: (projectId: string) => void
}

function ProjectsList({ projects, mode, onProjectClick }: ProjectsListProps) {
  const sampleProjects = [
    {
      id: '1',
      name: 'TechCorp Acquisition',
      status: 'in-progress',
      priority: 'high',
      progress: 75,
      riskLevel: 'medium',
      dueDate: '2025-07-26',
      aiInsight: mode === 'assisted' ? 'Similar to CloudCo pattern - 87% match' : null
    },
    {
      id: '2', 
      name: 'RetailCo Due Diligence',
      status: 'active',
      priority: 'critical',
      progress: 25,
      riskLevel: 'high',
      dueDate: '2025-07-23',
      aiInsight: mode === 'assisted' ? 'Customer concentration risk detected' : null
    },
    {
      id: '3',
      name: 'HealthCo Investment Review',
      status: 'completed',
      priority: 'medium',
      progress: 100,
      riskLevel: 'low',
      completedDate: '2025-07-18',
      aiInsight: mode === 'assisted' ? 'Completed 15% faster than average' : null
    }
  ]

  return (
    <div className="space-y-3">
      {sampleProjects.map((project) => (
        <div key={project.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => onProjectClick?.(project.id)}>
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="font-semibold">{project.name}</h3>
              {project.aiInsight && (
                <p className="text-xs text-purple-600 flex items-center mt-1">
                  <Brain className="w-3 h-3 mr-1" />
                  {project.aiInsight}
                </p>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant={project.status === 'completed' ? 'outline' : 'outline'}>
                {project.status}
              </Badge>
              <Badge variant={project.riskLevel === 'high' ? 'destructive' : 'outline'}>
                {project.riskLevel} risk
              </Badge>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  onProjectClick?.(project.id)
                }}
              >
                <ExternalLink className="w-4 h-4 mr-1" />
                View
              </Button>
            </div>
          </div>
          
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>Progress: {project.progress}%</span>
            <span>
              {project.status === 'completed' 
                ? `Completed ${project.completedDate}`
                : `Due ${project.dueDate}`
              }
            </span>
          </div>
          
          <div className="mt-2">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all"
                style={{ width: `${project.progress}%` }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}