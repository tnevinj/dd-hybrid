'use client'

import * as React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useAIStore } from '@/stores/ai-store'
import { 
  RotateCcw, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  X, 
  Eye,
  Shield,
  Zap,
  FileText,
  BarChart,
  Database,
  Settings,
  History,
  Trash2,
  Download
} from 'lucide-react'

interface AIAction {
  id: string
  title: string
  description: string
  type: 'document_processing' | 'data_analysis' | 'workflow_automation' | 'content_generation' | 'system_update'
  timestamp: Date
  status: 'completed' | 'in_progress' | 'failed' | 'rolled_back'
  impact: 'low' | 'medium' | 'high'
  reversible: boolean
  rollbackable: boolean
  estimatedRollbackTime: number // minutes
  affectedItems: string[]
  backupExists: boolean
  dependencies: string[]
  rollbackRisk: 'low' | 'medium' | 'high'
  rollbackSteps?: string[]
}

interface ActionRollbackProps {
  actions: AIAction[]
  onRollback: (actionId: string) => Promise<void>
  onViewDetails: (actionId: string) => void
  onDownloadBackup: (actionId: string) => void
  className?: string
}

export function ActionRollback({ 
  actions, 
  onRollback, 
  onViewDetails, 
  onDownloadBackup, 
  className 
}: ActionRollbackProps) {
  const { trackInteraction } = useAIStore()
  const [expandedAction, setExpandedAction] = React.useState<string | null>(null)
  const [rollbackInProgress, setRollbackInProgress] = React.useState<Set<string>>(new Set())
  const [showRollbackConfirm, setShowRollbackConfirm] = React.useState<string | null>(null)

  const getTypeIcon = (type: AIAction['type']) => {
    switch (type) {
      case 'document_processing':
        return <FileText className="w-4 h-4" />
      case 'data_analysis':
        return <BarChart className="w-4 h-4" />
      case 'workflow_automation':
        return <Settings className="w-4 h-4" />
      case 'content_generation':
        return <Zap className="w-4 h-4" />
      case 'system_update':
        return <Database className="w-4 h-4" />
      default:
        return <Settings className="w-4 h-4" />
    }
  }

  const getStatusColor = (status: AIAction['status']) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-50 border-green-200'
      case 'in_progress':
        return 'text-blue-600 bg-blue-50 border-blue-200'
      case 'failed':
        return 'text-red-600 bg-red-50 border-red-200'
      case 'rolled_back':
        return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getImpactColor = (impact: AIAction['impact']) => {
    switch (impact) {
      case 'low':
        return 'text-green-600'
      case 'medium':
        return 'text-yellow-600'
      case 'high':
        return 'text-red-600'
    }
  }

  const getRollbackRiskColor = (risk: AIAction['rollbackRisk']) => {
    switch (risk) {
      case 'low':
        return 'text-green-600 bg-green-50'
      case 'medium':
        return 'text-yellow-600 bg-yellow-50'
      case 'high':
        return 'text-red-600 bg-red-50'
    }
  }

  const handleRollback = async (actionId: string) => {
    const action = actions.find(a => a.id === actionId)
    if (!action || !action.rollbackable) return

    setRollbackInProgress(prev => new Set([...prev, actionId]))
    setShowRollbackConfirm(null)

    try {
      await onRollback(actionId)
      trackInteraction?.({
        type: 'action_rolled_back',
        actionId,
        context: { impact: action.impact, type: action.type }
      })
    } catch (error) {
      console.error('Rollback failed:', error)
    } finally {
      setRollbackInProgress(prev => {
        const newSet = new Set(prev)
        newSet.delete(actionId)
        return newSet
      })
    }
  }

  const rollbackableActions = actions.filter(action => 
    action.rollbackable && action.status === 'completed'
  )
  const rolledBackActions = actions.filter(action => action.status === 'rolled_back')
  const recentActions = actions.filter(action => 
    action.status === 'completed' && 
    Date.now() - action.timestamp.getTime() < 24 * 60 * 60 * 1000 // Last 24 hours
  )

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <Card className="bg-gradient-to-r from-orange-50 to-red-50 border-orange-200">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <RotateCcw className="w-5 h-5 text-orange-600" />
              <span>Action Rollback Control</span>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="warning" className="text-xs">
                {rollbackableActions.length} rollbackable
              </Badge>
              {rolledBackActions.length > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {rolledBackActions.length} rolled back
                </Badge>
              )}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <p className="text-gray-600 text-sm">
              Review and rollback AI actions if needed. All reversible actions can be safely undone.
            </p>
            <div className="flex items-center space-x-2 text-xs text-orange-600">
              <Shield className="w-3 h-3" />
              <span>Safety: All critical data is backed up</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Rollback Confirmation Modal */}
      {showRollbackConfirm && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription>
            <div className="space-y-3">
              <p className="font-medium text-red-800">
                Confirm Rollback
              </p>
              {(() => {
                const action = actions.find(a => a.id === showRollbackConfirm)
                return action ? (
                  <div className="text-sm text-red-700">
                    <p>You're about to rollback: <strong>{action.title}</strong></p>
                    <p className="mt-1">
                      This will affect {action.affectedItems.length} items and take approximately {action.estimatedRollbackTime} minutes.
                    </p>
                    {action.rollbackRisk === 'high' && (
                      <p className="mt-2 font-medium">⚠️ High risk rollback - please ensure you have recent backups.</p>
                    )}
                  </div>
                ) : null
              })()}
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleRollback(showRollbackConfirm)}
                >
                  Confirm Rollback
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowRollbackConfirm(null)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Rollbackable Actions */}
      {rollbackableActions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <RotateCcw className="w-5 h-5 text-orange-600" />
              <span>Rollbackable Actions ({rollbackableActions.length})</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {rollbackableActions.map((action) => (
              <div key={action.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      {getTypeIcon(action.type)}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{action.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">{action.description}</p>
                      
                      <div className="flex items-center space-x-4 mt-2">
                        <Badge className={`text-xs ${getStatusColor(action.status)}`}>
                          {action.status}
                        </Badge>
                        <div className="flex items-center text-xs text-gray-500">
                          <Clock className="w-3 h-3 mr-1" />
                          {new Intl.RelativeTimeFormat('en', { numeric: 'auto' }).format(
                            Math.floor((action.timestamp.getTime() - Date.now()) / (1000 * 60 * 60)), 
                            'hour'
                          )}
                        </div>
                        <div className={`text-xs ${getImpactColor(action.impact)}`}>
                          {action.impact} impact
                        </div>
                        <div className={`text-xs px-2 py-1 rounded ${getRollbackRiskColor(action.rollbackRisk)}`}>
                          {action.rollbackRisk} rollback risk
                        </div>
                      </div>

                      {action.affectedItems.length > 0 && (
                        <div className="mt-2">
                          <span className="text-xs text-gray-500">
                            Affected: {action.affectedItems.slice(0, 3).join(', ')}
                            {action.affectedItems.length > 3 && ` +${action.affectedItems.length - 3} more`}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setExpandedAction(
                        expandedAction === action.id ? null : action.id
                      )}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    
                    {action.backupExists && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDownloadBackup(action.id)}
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                    )}
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowRollbackConfirm(action.id)}
                      disabled={rollbackInProgress.has(action.id)}
                    >
                      {rollbackInProgress.has(action.id) ? (
                        <>
                          <Clock className="w-4 h-4 mr-1 animate-spin" />
                          Rolling back...
                        </>
                      ) : (
                        <>
                          <RotateCcw className="w-4 h-4 mr-1" />
                          Rollback
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                {/* Expanded Details */}
                {expandedAction === action.id && (
                  <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h5 className="font-medium text-sm text-gray-800 mb-2">Affected Items</h5>
                        <ul className="space-y-1 text-sm text-gray-600">
                          {action.affectedItems.map((item, index) => (
                            <li key={index} className="flex items-center">
                              <div className="w-1 h-1 bg-gray-400 rounded-full mr-2" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h5 className="font-medium text-sm text-gray-800 mb-2">Dependencies</h5>
                        <ul className="space-y-1 text-sm text-gray-600">
                          {action.dependencies.map((dep, index) => (
                            <li key={index} className="flex items-center">
                              <CheckCircle className="w-3 h-3 text-green-500 mr-2" />
                              {dep}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {action.rollbackSteps && (
                      <div>
                        <h5 className="font-medium text-sm text-gray-800 mb-2">Rollback Process</h5>
                        <ol className="space-y-1 text-sm text-gray-600">
                          {action.rollbackSteps.map((step, index) => (
                            <li key={index} className="flex items-start">
                              <span className="text-xs bg-gray-200 rounded-full w-4 h-4 flex items-center justify-center mr-2 mt-0.5">
                                {index + 1}
                              </span>
                              {step}
                            </li>
                          ))}
                        </ol>
                        <div className="flex items-center text-xs text-gray-500 mt-2">
                          <Clock className="w-3 h-3 mr-1" />
                          Estimated time: {action.estimatedRollbackTime} minutes
                        </div>
                      </div>
                    )}

                    {action.rollbackRisk === 'high' && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                        <div className="flex items-start space-x-2">
                          <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5" />
                          <div>
                            <h6 className="font-medium text-red-800 text-sm">High Risk Rollback</h6>
                            <p className="text-xs text-red-700 mt-1">
                              This rollback may affect multiple systems or have cascade effects. 
                              Ensure all stakeholders are notified.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Recent Actions (Non-rollbackable) */}
      {recentActions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <History className="w-5 h-5 text-gray-600" />
              <span>Recent Actions</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActions.filter(action => !action.rollbackable).slice(0, 5).map((action) => (
                <div key={action.id} className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="p-1.5 bg-gray-200 rounded">
                      {getTypeIcon(action.type)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">{action.title}</p>
                      <p className="text-xs text-gray-600">
                        {new Intl.RelativeTimeFormat('en', { numeric: 'auto' }).format(
                          Math.floor((action.timestamp.getTime() - Date.now()) / (1000 * 60 * 60)), 
                          'hour'
                        )}
                      </p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {action.reversible ? 'Not rollbackable' : 'Permanent'}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Rolled Back Actions */}
      {rolledBackActions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Trash2 className="w-5 h-5 text-gray-600" />
              <span>Rolled Back Actions ({rolledBackActions.length})</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {rolledBackActions.map((action) => (
                <div key={action.id} className="flex items-center justify-between p-3 bg-gray-50 border border-gray-300 rounded-lg opacity-75">
                  <div className="flex items-center space-x-3">
                    <div className="p-1.5 bg-gray-300 rounded">
                      {getTypeIcon(action.type)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700 line-through">{action.title}</p>
                      <p className="text-xs text-gray-500">Rolled back</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="text-xs">
                    View Details
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {actions.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <RotateCcw className="w-6 h-6 text-gray-400" />
            </div>
            <p className="text-sm text-gray-500 mb-2">
              No AI actions to rollback
            </p>
            <p className="text-xs text-gray-400">
              Completed actions will appear here when rollback is available
            </p>
          </CardContent>
        </Card>
      )}

      {/* Safety Information */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-blue-800 mb-1">
                Rollback Safety
              </h4>
              <p className="text-xs text-blue-700">
                All rollbackable actions maintain data integrity. High-risk rollbacks require additional confirmation. 
                Backups are automatically created before significant actions.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Example actions for demonstration
export const mockAIActions: AIAction[] = [
  {
    id: '1',
    title: 'Financial Analysis Automation',
    description: 'Automatically analyzed Q3 financials and generated risk assessment',
    type: 'data_analysis',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    status: 'completed',
    impact: 'medium',
    reversible: true,
    rollbackable: true,
    estimatedRollbackTime: 10,
    affectedItems: ['Financial Dashboard', 'Risk Scores', 'Executive Summary'],
    backupExists: true,
    dependencies: ['Data validation complete', 'Template applied'],
    rollbackRisk: 'low',
    rollbackSteps: [
      'Restore previous financial data state',
      'Revert risk score calculations',
      'Remove generated summaries'
    ]
  },
  {
    id: '2',
    title: 'Document Classification',
    description: 'Classified 47 documents by type and extracted key information',
    type: 'document_processing',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
    status: 'completed',
    impact: 'low',
    reversible: true,
    rollbackable: true,
    estimatedRollbackTime: 5,
    affectedItems: ['Document Tags', 'Metadata', 'Search Index'],
    backupExists: true,
    dependencies: ['Original documents preserved'],
    rollbackRisk: 'low'
  },
  {
    id: '3',
    title: 'Investment Recommendation Update',
    description: 'Updated investment recommendations based on new market data',
    type: 'workflow_automation',
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
    status: 'completed',
    impact: 'high',
    reversible: true,
    rollbackable: true,
    estimatedRollbackTime: 20,
    affectedItems: ['Investment Scores', 'Portfolio Allocations', 'Client Recommendations'],
    backupExists: true,
    dependencies: ['Market data validated', 'Model recalibrated'],
    rollbackRisk: 'medium',
    rollbackSteps: [
      'Restore previous recommendation scores',
      'Revert portfolio allocation changes',
      'Notify affected stakeholders'
    ]
  }
]