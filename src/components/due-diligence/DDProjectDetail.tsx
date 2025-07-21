'use client'

import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useNavigationStore } from '@/stores/navigation-store'
import { useDueDiligence } from '@/contexts/DueDiligenceContext'
import { DDTabs } from './DDTabs'
import { DDTraditionalView } from './DDTraditionalView'
import { DDAssistedView } from './DDAssistedView'
import { DDAutonomousView } from './DDAutonomousView'
import { 
  ArrowLeft,
  Brain,
  Zap,
  AlertTriangle,
  CheckCircle,
  Clock,
  Users,
  FileText,
  Settings,
  MoreHorizontal
} from 'lucide-react'
import { useRouter } from 'next/navigation'

interface DDProjectDetailProps {
  projectId: string
}

export function DDProjectDetail({ projectId }: DDProjectDetailProps) {
  const router = useRouter()
  const { currentMode, addRecommendation } = useNavigationStore()
  const { state, setCurrentProject } = useDueDiligence()

  // Mock project data - replace with real API call
  const [project, setProject] = React.useState({
    id: projectId,
    name: 'TechCorp Acquisition',
    dealName: 'TechCorp',
    status: 'in-progress' as const,
    stage: 'detailed' as const,
    priority: 'high' as const,
    progress: 75,
    riskLevel: 'medium' as const,
    assignedTo: 'Sarah Johnson',
    startDate: new Date('2025-06-01'),
    targetDate: new Date('2025-07-26'),
    description: 'Due diligence for TechCorp acquisition - B2B SaaS company with $50M ARR',
    
    // Metrics
    tasksTotal: 24,
    tasksCompleted: 18,
    findingsCount: 3,
    risksCount: 6,
    documentsCount: 47,
    teamSize: 5,
    
    // AI insights
    aiInsights: [
      'Similar to CloudCo deal pattern (87% match)',
      'Customer concentration risk detected',
      '3 routine tasks can be automated'
    ]
  })

  // Add project-specific AI recommendations
  React.useEffect(() => {
    if (currentMode.mode !== 'traditional') {
      const projectRecommendations = [
        {
          id: `project-${projectId}-rec-1`,
          type: 'automation' as const,
          priority: 'medium' as const,
          title: 'Automate Financial Analysis',
          description: 'AI can extract key metrics from the uploaded financial statements and populate the analysis template.',
          actions: [
            {
              id: 'auto-financial',
              label: 'Start Analysis',
              action: 'AUTOMATE_FINANCIAL_ANALYSIS',
              primary: true,
              estimatedTimeSaving: 180
            }
          ],
          confidence: 0.91,
          moduleContext: 'due-diligence',
          timestamp: new Date('2025-07-21T11:00:00')
        },
        {
          id: `project-${projectId}-rec-2`,
          type: 'suggestion' as const,
          priority: 'high' as const,
          title: 'Review Customer Concentration',
          description: 'Top 3 customers represent 67% of revenue. This exceeds typical risk threshold and needs investigation.',
          actions: [
            {
              id: 'review-customers',
              label: 'Deep Dive Analysis',
              action: 'ANALYZE_CUSTOMER_CONCENTRATION',
              primary: true
            }
          ],
          confidence: 0.94,
          moduleContext: 'due-diligence',
          timestamp: new Date('2025-07-21T10:30:00')
        }
      ]

      projectRecommendations.forEach(rec => addRecommendation(rec))
    }
  }, [currentMode.mode, projectId, addRecommendation])

  const renderProjectHeader = () => (
    <div className="border-b bg-white">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push('/due-diligence')}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to DD Dashboard
            </Button>
            
            {currentMode.mode !== 'traditional' && (
              <Badge variant="ai" className="flex items-center">
                <Brain className="w-3 h-3 mr-1" />
                AI Enhanced
              </Badge>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
            <Button variant="outline" size="sm">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h1 className="text-2xl font-bold">{project.name}</h1>
              <Badge variant="outline">
                {project.status}
              </Badge>
              <Badge variant="warning">
                {project.riskLevel} risk
              </Badge>
            </div>
            
            <p className="text-gray-600 mb-3">{project.description}</p>
            
            <div className="flex items-center space-x-6 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <Users className="w-4 h-4" />
                <span>Assigned to {project.assignedTo}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>Due {project.targetDate.toISOString().split('T')[0]}</span>
              </div>
              <div className="flex items-center space-x-1">
                <FileText className="w-4 h-4" />
                <span>{project.documentsCount} documents</span>
              </div>
            </div>
          </div>

          {/* Progress Overview */}
          <div className="ml-8">
            <div className="bg-gray-50 rounded-lg p-4 min-w-[200px]">
              <div className="text-center mb-3">
                <div className="text-2xl font-bold">{project.progress}%</div>
                <div className="text-sm text-gray-600">Overall Progress</div>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all"
                  style={{ width: `${project.progress}%` }}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="text-center">
                  <div className="font-semibold">{project.tasksCompleted}/{project.tasksTotal}</div>
                  <div className="text-gray-500">Tasks</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold">{project.findingsCount}</div>
                  <div className="text-gray-500">Findings</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {renderProjectHeader()}
      
      {/* Mode-specific Content */}
      {currentMode.mode === 'traditional' && (
        <DDTraditionalView project={project} />
      )}
      
      {currentMode.mode === 'assisted' && (
        <DDAssistedView project={project} />
      )}
      
      {currentMode.mode === 'autonomous' && (
        <DDAutonomousView project={project} />
      )}
    </div>
  )
}