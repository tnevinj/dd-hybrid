'use client'

import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { 
  Building2,
  User,
  TrendingUp,
  TrendingDown,
  Calendar,
  Phone,
  Mail,
  MessageSquare,
  DollarSign,
  BarChart3,
  Target,
  AlertTriangle,
  CheckCircle,
  Star,
  Award,
  Clock,
  Globe,
  Users,
  Handshake,
  ArrowRight,
  Plus,
  Download,
  RefreshCw,
  Search,
  Filter,
  Eye,
  Brain,
  LineChart,
  PieChart
} from 'lucide-react'
import { 
  GPRelationship,
  GPDealHistory,
  GPPerformanceTrack,
  GPRiskAssessment,
  GPOpportunity 
} from '@/types/due-diligence'

interface ManagementTrackingProps {
  projectId: string
  mode?: 'traditional' | 'assisted' | 'autonomous'
}

export function ManagementTracking({ projectId, mode = 'assisted' }: ManagementTrackingProps) {
  const [selectedGP, setSelectedGP] = React.useState<string | null>(null)
  const [activeTab, setActiveTab] = React.useState<'overview' | 'relationships' | 'performance' | 'opportunities'>('overview')
  const [filterStatus, setFilterStatus] = React.useState<'all' | 'active' | 'high-value' | 'at-risk'>('all')

  // Mock GP relationship data
  const gpRelationships: GPRelationship[] = [
    {
      id: 'gp-001',
      gpId: 'partner-001',
      gpName: 'David Park',
      firmName: 'Apex Capital Partners',
      relationshipStart: new Date('2019-03-15'),
      relationshipManager: 'Sarah Johnson',
      relationshipQuality: 92,
      communicationFrequency: 'monthly',
      lastInteraction: new Date('2024-01-10'),
      dealHistory: [
        {
          dealId: 'deal-001',
          dealName: 'TechFlow Acquisition',
          dealDate: new Date('2023-06-15'),
          dealSize: 45000000,
          sector: 'SaaS',
          outcome: 'successful',
          irr: 28.5,
          multiple: 2.8,
          holdingPeriod: 18,
          lessonsLearned: ['Strong management retention critical', 'Market timing was excellent', 'Integration challenges in first 6 months']
        },
        {
          dealId: 'deal-002',
          dealName: 'DataCore Systems',
          dealDate: new Date('2022-03-20'),
          dealSize: 32000000,
          sector: 'Data Analytics',
          outcome: 'successful',
          irr: 22.1,
          multiple: 2.2,
          holdingPeriod: 24,
          lessonsLearned: ['Customer concentration risk materialized', 'Technology differentiation key', 'Strong team execution']
        }
      ],
      performanceTrack: [
        {
          fundName: 'Apex Growth Fund III',
          vintage: 2020,
          fundSize: 500000000,
          currentIRR: 24.8,
          currentMultiple: 2.1,
          dpi: 0.8,
          rvpi: 1.3,
          topQuartile: true,
          benchmarkPerformance: 15.2,
          consistencyScore: 88
        },
        {
          fundName: 'Apex Growth Fund II',
          vintage: 2017,
          fundSize: 300000000,
          currentIRR: 19.6,
          currentMultiple: 2.5,
          dpi: 1.8,
          rvpi: 0.7,
          topQuartile: true,
          benchmarkPerformance: 12.8,
          consistencyScore: 85
        }
      ],
      riskAssessment: {
        keyPersonRisk: 'low',
        teamStability: 92,
        fundRaisingRisk: 'low',
        strategyDrift: 15,
        operationalCapability: 89,
        complianceRecord: 96,
        overallRiskScore: 18
      },
      strategicValue: 94,
      futureOpportunities: [
        {
          type: 'co-investment',
          description: 'Healthcare IT platform expansion',
          estimatedValue: 25000000,
          probability: 0.75,
          timeframe: 6,
          strategicAlignment: 88
        },
        {
          type: 'fund_investment',
          description: 'Apex Growth Fund IV commitment',
          estimatedValue: 50000000,
          probability: 0.90,
          timeframe: 12,
          strategicAlignment: 95
        }
      ]
    },
    {
      id: 'gp-002',
      gpId: 'partner-002',
      gpName: 'Maria Rodriguez',
      firmName: 'Emerging Markets Ventures',
      relationshipStart: new Date('2020-08-22'),
      relationshipManager: 'Michael Chen',
      relationshipQuality: 78,
      communicationFrequency: 'quarterly',
      lastInteraction: new Date('2023-12-05'),
      dealHistory: [
        {
          dealId: 'deal-003',
          dealName: 'LatAm FinTech',
          dealDate: new Date('2023-01-10'),
          dealSize: 18000000,
          sector: 'FinTech',
          outcome: 'neutral',
          irr: 12.3,
          multiple: 1.4,
          holdingPeriod: 12,
          lessonsLearned: ['Regulatory challenges underestimated', 'Local market expertise crucial', 'Currency hedging important']
        }
      ],
      performanceTrack: [
        {
          fundName: 'EMV Fund II',
          vintage: 2019,
          fundSize: 150000000,
          currentIRR: 15.2,
          currentMultiple: 1.6,
          dpi: 0.3,
          rvpi: 1.3,
          topQuartile: false,
          benchmarkPerformance: 3.8,
          consistencyScore: 72
        }
      ],
      riskAssessment: {
        keyPersonRisk: 'medium',
        teamStability: 74,
        fundRaisingRisk: 'medium',
        strategyDrift: 28,
        operationalCapability: 71,
        complianceRecord: 89,
        overallRiskScore: 42
      },
      strategicValue: 65,
      futureOpportunities: [
        {
          type: 'strategic_partnership',
          description: 'Latin America market expansion',
          estimatedValue: 15000000,
          probability: 0.6,
          timeframe: 9,
          strategicAlignment: 78
        }
      ]
    },
    {
      id: 'gp-003',
      gpId: 'partner-003',
      gpName: 'James Wilson',
      firmName: 'Innovation Capital',
      relationshipStart: new Date('2021-11-08'),
      relationshipManager: 'Jennifer Kim',
      relationshipQuality: 85,
      communicationFrequency: 'monthly',
      lastInteraction: new Date('2024-01-08'),
      dealHistory: [],
      performanceTrack: [
        {
          fundName: 'Innovation Fund I',
          vintage: 2021,
          fundSize: 200000000,
          currentIRR: 18.7,
          currentMultiple: 1.3,
          dpi: 0.1,
          rvpi: 1.2,
          topQuartile: true,
          benchmarkPerformance: 6.2,
          consistencyScore: 79
        }
      ],
      riskAssessment: {
        keyPersonRisk: 'low',
        teamStability: 86,
        fundRaisingRisk: 'low',
        strategyDrift: 12,
        operationalCapability: 83,
        complianceRecord: 94,
        overallRiskScore: 22
      },
      strategicValue: 82,
      futureOpportunities: [
        {
          type: 'co-investment',
          description: 'B2B SaaS platform deal',
          estimatedValue: 30000000,
          probability: 0.8,
          timeframe: 4,
          strategicAlignment: 92
        }
      ]
    }
  ]

  const filteredGPs = gpRelationships.filter(gp => {
    switch (filterStatus) {
      case 'active':
        return gp.lastInteraction > new Date(Date.now() - 90 * 24 * 60 * 60 * 1000) // Last 90 days
      case 'high-value':
        return gp.strategicValue > 80
      case 'at-risk':
        return gp.riskAssessment.overallRiskScore > 40
      default:
        return true
    }
  })

  const overallMetrics = {
    totalRelationships: gpRelationships.length,
    averageQuality: gpRelationships.reduce((sum, gp) => sum + gp.relationshipQuality, 0) / gpRelationships.length,
    highValueRelationships: gpRelationships.filter(gp => gp.strategicValue > 80).length,
    atRiskRelationships: gpRelationships.filter(gp => gp.riskAssessment.overallRiskScore > 40).length,
    totalDeals: gpRelationships.reduce((sum, gp) => sum + gp.dealHistory.length, 0),
    averageIRR: gpRelationships.flatMap(gp => gp.dealHistory).reduce((sum, deal) => sum + deal.irr, 0) / 
                 gpRelationships.flatMap(gp => gp.dealHistory).length,
    futureOpportunityValue: gpRelationships.flatMap(gp => gp.futureOpportunities)
                                         .reduce((sum, opp) => sum + opp.estimatedValue, 0)
  }

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Summary Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold">{overallMetrics.totalRelationships}</div>
              <div className="text-sm text-gray-600">Total GPs</div>
            </div>
            <Users className="w-8 h-8 text-blue-600" />
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold">{Math.round(overallMetrics.averageQuality)}</div>
              <div className="text-sm text-gray-600">Avg Quality Score</div>
            </div>
            <Star className="w-8 h-8 text-yellow-600" />
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold">{overallMetrics.highValueRelationships}</div>
              <div className="text-sm text-gray-600">High Value GPs</div>
            </div>
            <Award className="w-8 h-8 text-green-600" />
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold">${(overallMetrics.futureOpportunityValue / 1000000).toFixed(0)}M</div>
              <div className="text-sm text-gray-600">Pipeline Value</div>
            </div>
            <Target className="w-8 h-8 text-purple-600" />
          </div>
        </Card>
      </div>

      {/* Performance Summary */}
      <Card className="p-4">
        <h4 className="font-medium mb-4">GP Performance Summary</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-3xl font-bold text-green-600">{Math.round(overallMetrics.averageIRR)}%</div>
            <div className="text-sm text-green-700">Average IRR</div>
            <div className="text-xs text-green-600 mt-1">From {overallMetrics.totalDeals} completed deals</div>
          </div>
          
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-3xl font-bold text-blue-600">
              {gpRelationships.filter(gp => gp.performanceTrack.some(fund => fund.topQuartile)).length}
            </div>
            <div className="text-sm text-blue-700">Top Quartile GPs</div>
            <div className="text-xs text-blue-600 mt-1">
              {Math.round((gpRelationships.filter(gp => gp.performanceTrack.some(fund => fund.topQuartile)).length / 
                          gpRelationships.length) * 100)}% of total relationships
            </div>
          </div>
          
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <div className="text-3xl font-bold text-orange-600">{overallMetrics.atRiskRelationships}</div>
            <div className="text-sm text-orange-700">At-Risk Relationships</div>
            <div className="text-xs text-orange-600 mt-1">Require attention</div>
          </div>
        </div>
      </Card>

      {/* Recent Activities */}
      <Card className="p-4">
        <h4 className="font-medium mb-4">Recent GP Interactions</h4>
        <div className="space-y-3">
          {gpRelationships
            .sort((a, b) => b.lastInteraction.getTime() - a.lastInteraction.getTime())
            .slice(0, 5)
            .map((gp) => (
              <div key={gp.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <User className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-medium">{gp.gpName}</div>
                    <div className="text-sm text-gray-600">{gp.firmName}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">
                    {gp.lastInteraction.toLocaleDateString()}
                  </div>
                  <div className="text-xs text-gray-600">
                    {Math.floor((Date.now() - gp.lastInteraction.getTime()) / (1000 * 60 * 60 * 24))} days ago
                  </div>
                </div>
              </div>
            ))}
        </div>
      </Card>
    </div>
  )

  const renderGPCard = (gp: GPRelationship) => (
    <Card 
      key={gp.id} 
      className={`cursor-pointer transition-all ${
        selectedGP === gp.id ? 'ring-2 ring-blue-500' : ''
      }`}
      onClick={() => setSelectedGP(selectedGP === gp.id ? null : gp.id)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Building2 className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <CardTitle className="text-lg">{gp.gpName}</CardTitle>
              <p className="text-gray-600">{gp.firmName}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant={gp.relationshipQuality > 80 ? 'default' : 'secondary'}>
              Quality: {gp.relationshipQuality}%
            </Badge>
            <Badge variant={gp.strategicValue > 80 ? 'default' : 'outline'}>
              Value: {gp.strategicValue}%
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {/* Key Metrics */}
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-green-50 rounded">
              <div className="text-lg font-bold text-green-600">{gp.dealHistory.length}</div>
              <div className="text-xs text-green-700">Deals Completed</div>
            </div>
            <div className="text-center p-3 bg-blue-50 rounded">
              <div className="text-lg font-bold text-blue-600">
                {gp.dealHistory.length > 0 
                  ? Math.round(gp.dealHistory.reduce((sum, deal) => sum + deal.irr, 0) / gp.dealHistory.length)
                  : 'N/A'}%
              </div>
              <div className="text-xs text-blue-700">Avg IRR</div>
            </div>
          </div>

          {/* Communication */}
          <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
            <span className="text-sm text-gray-600">Last Contact</span>
            <span className="text-sm font-medium">
              {Math.floor((Date.now() - gp.lastInteraction.getTime()) / (1000 * 60 * 60 * 24))} days ago
            </span>
          </div>

          {/* Risk Assessment */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Risk Level</span>
              <Badge variant={gp.riskAssessment.overallRiskScore > 40 ? 'destructive' : 'default'}>
                {gp.riskAssessment.overallRiskScore > 40 ? 'High' : 'Low'} Risk
              </Badge>
            </div>
            <Progress value={100 - gp.riskAssessment.overallRiskScore} className="h-2" />
          </div>

          {/* Expanded Details */}
          {selectedGP === gp.id && (
            <div className="pt-4 border-t space-y-4">
              {/* Fund Performance */}
              <div>
                <h5 className="font-medium mb-2 flex items-center">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Fund Performance Track Record
                </h5>
                <div className="space-y-2">
                  {gp.performanceTrack.map((fund, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{fund.fundName}</span>
                        <div className="flex items-center space-x-2">
                          <Badge variant={fund.topQuartile ? 'default' : 'secondary'}>
                            {fund.topQuartile ? 'Top Quartile' : 'Below Top Quartile'}
                          </Badge>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <span>IRR: {fund.currentIRR}%</span>
                        <span>Multiple: {fund.currentMultiple}x</span>
                        <span>DPI: {fund.dpi}x</span>
                        <span>RVPI: {fund.rvpi}x</span>
                      </div>
                      <div className="text-xs text-gray-600 mt-1">
                        Fund Size: ${(fund.fundSize / 1000000).toFixed(0)}M • Vintage: {fund.vintage}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Deal History */}
              {gp.dealHistory.length > 0 && (
                <div>
                  <h5 className="font-medium mb-2 flex items-center">
                    <Handshake className="w-4 h-4 mr-2" />
                    Deal History
                  </h5>
                  <div className="space-y-2">
                    {gp.dealHistory.map((deal, index) => (
                      <div key={index} className="p-3 border rounded">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">{deal.dealName}</span>
                          <Badge variant={
                            deal.outcome === 'successful' ? 'default' : 
                            deal.outcome === 'neutral' ? 'secondary' : 'destructive'
                          }>
                            {deal.outcome}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm mb-2">
                          <span>IRR: {deal.irr}%</span>
                          <span>Multiple: {deal.multiple}x</span>
                          <span>Size: ${(deal.dealSize / 1000000).toFixed(0)}M</span>
                          <span>Hold: {deal.holdingPeriod}mo</span>
                        </div>
                        <div className="text-xs text-gray-700">
                          <strong>Lessons:</strong> {deal.lessonsLearned.slice(0, 2).join(', ')}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Future Opportunities */}
              {gp.futureOpportunities.length > 0 && (
                <div>
                  <h5 className="font-medium mb-2 flex items-center">
                    <Target className="w-4 h-4 mr-2" />
                    Future Opportunities
                  </h5>
                  <div className="space-y-2">
                    {gp.futureOpportunities.map((opp, index) => (
                      <div key={index} className="p-3 border border-green-200 rounded bg-green-50">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">{opp.description}</span>
                          <Badge variant="outline">
                            {Math.round(opp.probability * 100)}% probability
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <span>Value: ${(opp.estimatedValue / 1000000).toFixed(0)}M</span>
                          <span>Timeline: {opp.timeframe}mo</span>
                          <span>Type: {opp.type.replace('_', ' ')}</span>
                          <span>Alignment: {opp.strategicAlignment}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Risk Details */}
              <div>
                <h5 className="font-medium mb-2 flex items-center">
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Risk Assessment Details
                </h5>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex justify-between">
                    <span>Key Person Risk:</span>
                    <Badge variant={gp.riskAssessment.keyPersonRisk === 'low' ? 'default' : 'destructive'}>
                      {gp.riskAssessment.keyPersonRisk}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Team Stability:</span>
                    <span className="font-medium">{gp.riskAssessment.teamStability}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Fund Raising Risk:</span>
                    <Badge variant={gp.riskAssessment.fundRaisingRisk === 'low' ? 'default' : 'destructive'}>
                      {gp.riskAssessment.fundRaisingRisk}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Compliance Record:</span>
                    <span className="font-medium">{gp.riskAssessment.complianceRecord}%</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )

  const renderPerformanceAnalysis = () => (
    <div className="space-y-6">
      <Card className="p-4">
        <h4 className="font-medium mb-4">GP Performance Comparison</h4>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">GP / Firm</th>
                <th className="text-center py-2">Relationship Quality</th>
                <th className="text-center py-2">Strategic Value</th>
                <th className="text-center py-2">Avg IRR</th>
                <th className="text-center py-2">Top Quartile</th>
                <th className="text-center py-2">Risk Score</th>
              </tr>
            </thead>
            <tbody>
              {gpRelationships.map((gp) => {
                const avgIRR = gp.dealHistory.length > 0 
                  ? gp.dealHistory.reduce((sum, deal) => sum + deal.irr, 0) / gp.dealHistory.length
                  : null
                const hasTopQuartile = gp.performanceTrack.some(fund => fund.topQuartile)
                
                return (
                  <tr key={gp.id} className="border-b">
                    <td className="py-2">
                      <div>
                        <div className="font-medium">{gp.gpName}</div>
                        <div className="text-xs text-gray-600">{gp.firmName}</div>
                      </div>
                    </td>
                    <td className="text-center py-2">
                      <div className="flex flex-col items-center">
                        <span className="font-medium">{gp.relationshipQuality}%</span>
                        <Progress value={gp.relationshipQuality} className="w-16 h-1 mt-1" />
                      </div>
                    </td>
                    <td className="text-center py-2">
                      <div className="flex flex-col items-center">
                        <span className="font-medium">{gp.strategicValue}%</span>
                        <Progress value={gp.strategicValue} className="w-16 h-1 mt-1" />
                      </div>
                    </td>
                    <td className="text-center py-2">
                      <span className="font-medium">
                        {avgIRR ? `${Math.round(avgIRR)}%` : 'N/A'}
                      </span>
                    </td>
                    <td className="text-center py-2">
                      {hasTopQuartile ? (
                        <CheckCircle className="w-4 h-4 text-green-500 mx-auto" />
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="text-center py-2">
                      <Badge variant={gp.riskAssessment.overallRiskScore > 40 ? 'destructive' : 'default'}>
                        {gp.riskAssessment.overallRiskScore}
                      </Badge>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="p-4">
          <h4 className="font-medium mb-4">Top Performers</h4>
          <div className="space-y-3">
            {gpRelationships
              .sort((a, b) => {
                const aAvgIRR = a.dealHistory.length > 0 
                  ? a.dealHistory.reduce((sum, deal) => sum + deal.irr, 0) / a.dealHistory.length
                  : 0
                const bAvgIRR = b.dealHistory.length > 0 
                  ? b.dealHistory.reduce((sum, deal) => sum + deal.irr, 0) / b.dealHistory.length
                  : 0
                return bAvgIRR - aAvgIRR
              })
              .slice(0, 3)
              .map((gp, index) => {
                const avgIRR = gp.dealHistory.length > 0 
                  ? gp.dealHistory.reduce((sum, deal) => sum + deal.irr, 0) / gp.dealHistory.length
                  : 0
                
                return (
                  <div key={gp.id} className="flex items-center justify-between p-3 bg-green-50 rounded">
                    <div className="flex items-center space-x-3">
                      <div className="p-1 bg-green-200 rounded-full">
                        <Award className="w-4 h-4 text-green-600" />
                      </div>
                      <div>
                        <div className="font-medium">{gp.gpName}</div>
                        <div className="text-sm text-gray-600">{gp.firmName}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-green-600">{Math.round(avgIRR)}%</div>
                      <div className="text-xs text-green-700">Avg IRR</div>
                    </div>
                  </div>
                )
              })}
          </div>
        </Card>

        <Card className="p-4">
          <h4 className="font-medium mb-4">Relationship Health</h4>
          <div className="space-y-3">
            {gpRelationships
              .sort((a, b) => b.relationshipQuality - a.relationshipQuality)
              .slice(0, 3)
              .map((gp) => (
                <div key={gp.id} className="flex items-center justify-between p-3 bg-blue-50 rounded">
                  <div className="flex items-center space-x-3">
                    <div className="p-1 bg-blue-200 rounded-full">
                      <Star className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-medium">{gp.gpName}</div>
                      <div className="text-sm text-gray-600">{gp.firmName}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-blue-600">{gp.relationshipQuality}%</div>
                    <div className="text-xs text-blue-700">Quality Score</div>
                  </div>
                </div>
              ))}
          </div>
        </Card>
      </div>
    </div>
  )

  const renderOpportunities = () => (
    <div className="space-y-6">
      <Card className="p-4">
        <h4 className="font-medium mb-4">Pipeline Overview</h4>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {gpRelationships.flatMap(gp => gp.futureOpportunities).length}
            </div>
            <div className="text-sm text-green-700">Total Opportunities</div>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              ${(overallMetrics.futureOpportunityValue / 1000000).toFixed(0)}M
            </div>
            <div className="text-sm text-blue-700">Pipeline Value</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">
              {gpRelationships.flatMap(gp => gp.futureOpportunities)
                            .filter(opp => opp.probability > 0.7).length}
            </div>
            <div className="text-sm text-purple-700">High Probability</div>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">
              {gpRelationships.flatMap(gp => gp.futureOpportunities)
                            .filter(opp => opp.timeframe <= 6).length}
            </div>
            <div className="text-sm text-orange-700">Near Term (6mo)</div>
          </div>
        </div>
      </Card>

      <div className="space-y-4">
        {gpRelationships.map((gp) => (
          gp.futureOpportunities.length > 0 && (
            <Card key={gp.id} className="p-4">
              <h5 className="font-medium mb-3">{gp.gpName} - {gp.firmName}</h5>
              <div className="space-y-3">
                {gp.futureOpportunities.map((opp, index) => (
                  <div key={index} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h6 className="font-medium">{opp.description}</h6>
                        <p className="text-sm text-gray-600 capitalize">
                          {opp.type.replace('_', ' ')} • {opp.timeframe} months
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-green-600">
                          ${(opp.estimatedValue / 1000000).toFixed(0)}M
                        </div>
                        <div className="text-sm text-gray-600">
                          {Math.round(opp.probability * 100)}% probability
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Strategic Alignment</span>
                      <div className="flex items-center space-x-2">
                        <Progress value={opp.strategicAlignment} className="w-20 h-2" />
                        <span className="text-sm font-medium">{opp.strategicAlignment}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )
        ))}
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-indigo-100 rounded-lg">
            <Handshake className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">GP Relationship Management</h2>
            <p className="text-gray-600">Systematic tracking and performance analysis</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <select 
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="border rounded px-3 py-1 text-sm"
          >
            <option value="all">All GPs</option>
            <option value="active">Recently Active</option>
            <option value="high-value">High Value</option>
            <option value="at-risk">At Risk</option>
          </select>
          {mode === 'assisted' && (
            <Badge variant="ai" className="text-sm">
              <Brain className="w-3 h-3 mr-1" />
              AI Enhanced
            </Badge>
          )}
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add GP
          </Button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b">
        <nav className="flex space-x-8">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'relationships', label: 'GP Relationships', icon: Users },
            { id: 'performance', label: 'Performance Analysis', icon: LineChart },
            { id: 'opportunities', label: 'Pipeline', icon: Target }
          ].map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
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
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'relationships' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">GP Relationship Details</h3>
              <div className="text-sm text-gray-600">
                Showing {filteredGPs.length} of {gpRelationships.length} relationships
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filteredGPs.map(renderGPCard)}
            </div>
          </div>
        )}
        {activeTab === 'performance' && renderPerformanceAnalysis()}
        {activeTab === 'opportunities' && renderOpportunities()}
      </div>
    </div>
  )
}