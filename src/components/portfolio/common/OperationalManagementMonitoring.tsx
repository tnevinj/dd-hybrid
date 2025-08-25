'use client'

import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { 
  Settings,
  Users,
  TrendingUp,
  TrendingDown,
  Target,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  Award,
  Clock,
  Brain,
  Eye,
  RefreshCw,
  Download,
  Filter,
  ArrowRight,
  Workflow,
  Star,
  Shield,
  Building,
  Calendar,
  Activity
} from 'lucide-react'
import { UnifiedAsset } from '@/types/portfolio'

interface OperationalManagementMonitoringProps {
  assets: UnifiedAsset[]
  selectedAssetId?: string
  onAssetSelect?: (assetId: string) => void
}

export function OperationalManagementMonitoring({ 
  assets, 
  selectedAssetId, 
  onAssetSelect 
}: OperationalManagementMonitoringProps) {
  const [activeView, setActiveView] = React.useState<'overview' | 'operational' | 'management' | 'alerts'>('overview')
  const [selectedAsset, setSelectedAsset] = React.useState<string | null>(selectedAssetId || null)

  // Mock operational and management data for assets
  const assetOperationalData = {
    'asset-001': {
      operationalScore: 78,
      managementScore: 86,
      processEfficiency: 82,
      digitalMaturity: 71,
      managementStability: 92,
      successionReadiness: 65,
      recentAlerts: [
        { type: 'operational', severity: 'medium', message: 'Process automation opportunity identified' },
        { type: 'management', severity: 'low', message: 'Succession planning review due' }
      ],
      trends: {
        operational: 'improving',
        management: 'stable'
      },
      lastAssessment: '2024-01-15',
      nextReview: '2024-04-15'
    },
    'asset-002': {
      operationalScore: 85,
      managementScore: 79,
      processEfficiency: 89,
      digitalMaturity: 83,
      managementStability: 78,
      successionReadiness: 82,
      recentAlerts: [
        { type: 'management', severity: 'high', message: 'Key person retention risk identified' }
      ],
      trends: {
        operational: 'stable',
        management: 'declining'
      },
      lastAssessment: '2024-01-10',
      nextReview: '2024-04-10'
    },
    'asset-003': {
      operationalScore: 72,
      managementScore: 88,
      processEfficiency: 68,
      digitalMaturity: 75,
      managementStability: 91,
      successionReadiness: 85,
      recentAlerts: [
        { type: 'operational', severity: 'high', message: 'Quality metrics below industry benchmark' }
      ],
      trends: {
        operational: 'declining',
        management: 'improving'
      },
      lastAssessment: '2024-01-12',
      nextReview: '2024-04-12'
    }
  }

  const portfolioOverview = {
    totalAssets: assets.length,
    averageOperationalScore: Object.values(assetOperationalData).reduce((sum, asset) => sum + asset.operationalScore, 0) / Object.keys(assetOperationalData).length,
    averageManagementScore: Object.values(assetOperationalData).reduce((sum, asset) => sum + asset.managementScore, 0) / Object.keys(assetOperationalData).length,
    assetsAtRisk: Object.values(assetOperationalData).filter(asset => 
      asset.operationalScore < 70 || asset.managementScore < 70 || 
      asset.recentAlerts.some(alert => alert.severity === 'high')
    ).length,
    improvingAssets: Object.values(assetOperationalData).filter(asset => 
      asset.trends.operational === 'improving' || asset.trends.management === 'improving'
    ).length,
    totalAlerts: Object.values(assetOperationalData).reduce((sum, asset) => sum + asset.recentAlerts.length, 0)
  }

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Portfolio Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold">{portfolioOverview.totalAssets}</div>
              <div className="text-sm text-gray-600">Total Assets</div>
            </div>
            <Building className="w-8 h-8 text-blue-600" />
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold">{Math.round(portfolioOverview.averageOperationalScore)}</div>
              <div className="text-sm text-gray-600">Avg Operational</div>
            </div>
            <Settings className="w-8 h-8 text-green-600" />
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold">{Math.round(portfolioOverview.averageManagementScore)}</div>
              <div className="text-sm text-gray-600">Avg Management</div>
            </div>
            <Users className="w-8 h-8 text-blue-600" />
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold">{portfolioOverview.assetsAtRisk}</div>
              <div className="text-sm text-gray-600">At Risk</div>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold">{portfolioOverview.improvingAssets}</div>
              <div className="text-sm text-gray-600">Improving</div>
            </div>
            <TrendingUp className="w-8 h-8 text-green-600" />
          </div>
        </Card>
      </div>

      {/* Performance Distribution */}
      <Card className="p-4">
        <h4 className="font-medium mb-4">Portfolio Performance Distribution</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h5 className="text-sm font-medium mb-3">Operational Excellence Scores</h5>
            <div className="space-y-2">
              {['Excellent (80+)', 'Good (70-79)', 'Needs Improvement (<70)'].map((range, index) => {
                const scores = Object.values(assetOperationalData).map(asset => asset.operationalScore)
                const count = index === 0 ? scores.filter(s => s >= 80).length :
                             index === 1 ? scores.filter(s => s >= 70 && s < 80).length :
                             scores.filter(s => s < 70).length
                const percentage = (count / scores.length) * 100
                
                return (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm">{range}</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={percentage} className="w-20 h-2" />
                      <span className="text-sm font-medium">{count}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
          
          <div>
            <h5 className="text-sm font-medium mb-3">Management Quality Scores</h5>
            <div className="space-y-2">
              {['Excellent (80+)', 'Good (70-79)', 'Needs Improvement (<70)'].map((range, index) => {
                const scores = Object.values(assetOperationalData).map(asset => asset.managementScore)
                const count = index === 0 ? scores.filter(s => s >= 80).length :
                             index === 1 ? scores.filter(s => s >= 70 && s < 80).length :
                             scores.filter(s => s < 70).length
                const percentage = (count / scores.length) * 100
                
                return (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm">{range}</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={percentage} className="w-20 h-2" />
                      <span className="text-sm font-medium">{count}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </Card>

      {/* Recent Activity */}
      <Card className="p-4">
        <h4 className="font-medium mb-4">Recent Assessment Activity</h4>
        <div className="space-y-3">
          {assets.slice(0, 5).map((asset) => {
            const operationalData = assetOperationalData[asset.id as keyof typeof assetOperationalData]
            if (!operationalData) return null
            
            return (
              <div key={asset.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Building className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-medium">{asset.name}</div>
                    <div className="text-sm text-gray-600">
                      Last assessed: {operationalData.lastAssessment}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={operationalData.operationalScore > 80 ? 'default' : 'secondary'}>
                    Op: {operationalData.operationalScore}
                  </Badge>
                  <Badge variant={operationalData.managementScore > 80 ? 'default' : 'secondary'}>
                    Mgmt: {operationalData.managementScore}
                  </Badge>
                  <Button variant="ghost" size="sm" onClick={() => setSelectedAsset(asset.id)}>
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      </Card>
    </div>
  )

  const renderAssetCards = (category: 'operational' | 'management') => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {assets.map((asset) => {
        const operationalData = assetOperationalData[asset.id as keyof typeof assetOperationalData]
        if (!operationalData) return null
        
        const score = category === 'operational' ? operationalData.operationalScore : operationalData.managementScore
        const trend = operationalData.trends[category]
        
        return (
          <Card 
            key={asset.id} 
            className={`cursor-pointer transition-all ${
              selectedAsset === asset.id ? 'ring-2 ring-blue-500' : ''
            }`}
            onClick={() => setSelectedAsset(selectedAsset === asset.id ? null : asset.id)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">{asset.name}</CardTitle>
                  <p className="text-gray-600 capitalize">{asset.sector} • {asset.assetType}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={score > 80 ? 'default' : score > 70 ? 'secondary' : 'destructive'}>
                    {score}/100
                  </Badge>
                  {trend === 'improving' ? (
                    <TrendingUp className="w-4 h-4 text-green-500" />
                  ) : trend === 'declining' ? (
                    <TrendingDown className="w-4 h-4 text-red-500" />
                  ) : (
                    <Activity className="w-4 h-4 text-gray-500" />
                  )}
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-4">
                {category === 'operational' ? (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-gray-600">Process Efficiency</span>
                        <span className="text-sm font-medium">{operationalData.processEfficiency}%</span>
                      </div>
                      <Progress value={operationalData.processEfficiency} className="h-2" />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-gray-600">Digital Maturity</span>
                        <span className="text-sm font-medium">{operationalData.digitalMaturity}%</span>
                      </div>
                      <Progress value={operationalData.digitalMaturity} className="h-2" />
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-gray-600">Team Stability</span>
                        <span className="text-sm font-medium">{operationalData.managementStability}%</span>
                      </div>
                      <Progress value={operationalData.managementStability} className="h-2" />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-gray-600">Succession Ready</span>
                        <span className="text-sm font-medium">{operationalData.successionReadiness}%</span>
                      </div>
                      <Progress value={operationalData.successionReadiness} className="h-2" />
                    </div>
                  </div>
                )}

                {/* Alerts */}
                {operationalData.recentAlerts.length > 0 && (
                  <div className="pt-2 border-t">
                    <h5 className="text-sm font-medium mb-2">Recent Alerts</h5>
                    <div className="space-y-1">
                      {operationalData.recentAlerts.map((alert, index) => (
                        <div key={index} className={`p-2 rounded text-xs ${
                          alert.severity === 'high' ? 'bg-red-50 text-red-700' :
                          alert.severity === 'medium' ? 'bg-yellow-50 text-yellow-700' :
                          'bg-blue-50 text-blue-700'
                        }`}>
                          <span className="font-medium">{alert.type.toUpperCase()}:</span> {alert.message}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Expanded Details */}
                {selectedAsset === asset.id && (
                  <div className="pt-4 border-t space-y-3">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Last Assessment:</span>
                        <div className="font-medium">{operationalData.lastAssessment}</div>
                      </div>
                      <div>
                        <span className="text-gray-600">Next Review:</span>
                        <div className="font-medium">{operationalData.nextReview}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                      <Button size="sm">
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Update Assessment
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )

  const renderAlerts = () => (
    <div className="space-y-4">
      <Card className="p-4">
        <h4 className="font-medium mb-4">Alert Summary</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <div className="text-2xl font-bold text-red-600">
              {Object.values(assetOperationalData).reduce((sum, asset) => 
                sum + asset.recentAlerts.filter(alert => alert.severity === 'high').length, 0
              )}
            </div>
            <div className="text-sm text-red-700">High Priority</div>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">
              {Object.values(assetOperationalData).reduce((sum, asset) => 
                sum + asset.recentAlerts.filter(alert => alert.severity === 'medium').length, 0
              )}
            </div>
            <div className="text-sm text-yellow-700">Medium Priority</div>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {Object.values(assetOperationalData).reduce((sum, asset) => 
                sum + asset.recentAlerts.filter(alert => alert.severity === 'low').length, 0
              )}
            </div>
            <div className="text-sm text-blue-700">Low Priority</div>
          </div>
        </div>
      </Card>

      <div className="space-y-3">
        {assets.map((asset) => {
          const operationalData = assetOperationalData[asset.id as keyof typeof assetOperationalData]
          if (!operationalData || operationalData.recentAlerts.length === 0) return null
          
          return (
            <Card key={asset.id} className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h5 className="font-medium">{asset.name}</h5>
                <Badge variant="outline" className="text-xs">
                  {operationalData.recentAlerts.length} alert{operationalData.recentAlerts.length > 1 ? 's' : ''}
                </Badge>
              </div>
              <div className="space-y-2">
                {operationalData.recentAlerts.map((alert, index) => (
                  <div key={index} className={`p-3 rounded border-l-4 ${
                    alert.severity === 'high' ? 'border-red-500 bg-red-50' :
                    alert.severity === 'medium' ? 'border-yellow-500 bg-yellow-50' :
                    'border-blue-500 bg-blue-50'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-sm capitalize">{alert.type} Alert</div>
                        <div className="text-sm text-gray-700">{alert.message}</div>
                      </div>
                      <Badge variant={
                        alert.severity === 'high' ? 'destructive' :
                        alert.severity === 'medium' ? 'secondary' : 'default'
                      }>
                        {alert.severity}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-indigo-100 rounded-lg">
            <BarChart3 className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">Operational & Management Monitoring</h2>
            <p className="text-gray-600">Portfolio-wide operational excellence and management quality tracking</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="ai" className="text-sm">
            <Brain className="w-3 h-3 mr-1" />
            AI Enhanced
          </Badge>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
          <Button size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh Data
          </Button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b">
        <nav className="flex space-x-8">
          {[
            { id: 'overview', label: 'Portfolio Overview', icon: BarChart3 },
            { id: 'operational', label: 'Operational Excellence', icon: Settings },
            { id: 'management', label: 'Management Quality', icon: Users },
            { id: 'alerts', label: 'Alerts & Actions', icon: AlertTriangle }
          ].map((tab) => {
            const Icon = tab.icon
            const isActive = activeView === tab.id
            
            return (
              <button
                key={tab.id}
                onClick={() => setActiveView(tab.id as any)}
                className={`
                  flex items-center space-x-2 py-3 border-b-2 text-sm font-medium transition-colors
                  ${isActive 
                    ? 'border-indigo-500 text-indigo-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div>
        {activeView === 'overview' && renderOverview()}
        {activeView === 'operational' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Operational Excellence Assessment</h3>
              <div className="text-sm text-gray-600">
                Portfolio average: {Math.round(portfolioOverview.averageOperationalScore)}/100
              </div>
            </div>
            {renderAssetCards('operational')}
          </div>
        )}
        {activeView === 'management' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Management Quality Assessment</h3>
              <div className="text-sm text-gray-600">
                Portfolio average: {Math.round(portfolioOverview.averageManagementScore)}/100
              </div>
            </div>
            {renderAssetCards('management')}
          </div>
        )}
        {activeView === 'alerts' && renderAlerts()}
      </div>
    </div>
  )
}