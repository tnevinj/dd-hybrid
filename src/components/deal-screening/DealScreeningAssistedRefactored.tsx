/**
 * Refactored Deal Screening Assisted Component  
 * Uses new standardized AssistedModeProps interface with AI-enhanced deal screening
 */

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Search,
  Filter,
  Plus,
  Lightbulb,
  Zap,
  BarChart3,
  TrendingUp,
  GitCompare,
  Sparkles,
  CheckCircle,
  Clock,
  AlertTriangle,
  X,
  Brain,
  Target,
  DollarSign,
  MapPin,
  Star,
  Shield
} from 'lucide-react'
import type { AssistedModeProps } from '@/types/shared'

// Mock deal opportunities with AI enhancements
const mockOpportunities = [
  {
    id: '1',
    name: 'TechVenture Fund III',
    seller: 'Institutional LP',
    assetType: 'fund' as const,
    vintage: '2020',
    sector: 'Technology',
    geography: 'North America',
    askPrice: 45000000,
    navPercentage: 85,
    expectedIRR: 18.5,
    expectedMultiple: 2.3,
    status: 'active' as const,
    screeningStage: 'initial' as const,
    riskLevel: 'medium' as const,
    aiScore: 87,
    valuationMatch: 94,
    priorityScore: 'high' as const
  },
  {
    id: '2',
    name: 'Healthcare Direct Investment',
    seller: 'Strategic Partner',
    assetType: 'direct' as const,
    vintage: '2021',
    sector: 'Healthcare',
    geography: 'Europe',
    askPrice: 28000000,
    navPercentage: 92,
    expectedIRR: 22.1,
    expectedMultiple: 2.8,
    status: 'under_review' as const,
    screeningStage: 'detailed' as const,
    riskLevel: 'low' as const,
    aiScore: 93,
    valuationMatch: 89,
    priorityScore: 'high' as const
  },
  {
    id: '3',
    name: 'Infrastructure Co-Investment',
    seller: 'Fund Manager',
    assetType: 'co-investment' as const,
    vintage: '2022',
    sector: 'Infrastructure',
    geography: 'Asia',
    askPrice: 67000000,
    navPercentage: 78,
    expectedIRR: 15.8,
    expectedMultiple: 2.1,
    status: 'active' as const,
    screeningStage: 'initial' as const,
    riskLevel: 'high' as const,
    aiScore: 76,
    valuationMatch: 82,
    priorityScore: 'medium' as const
  }
]

export function DealScreeningAssistedRefactored({ 
  metrics, 
  isLoading = false,
  aiRecommendations,
  onExecuteAIAction,
  onDismissRecommendation,
  onSwitchMode
}: AssistedModeProps) {
  
  const router = useRouter()
  
  // Local state for assisted mode
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredOpportunities, setFilteredOpportunities] = useState(mockOpportunities)
  const [sortBy, setSortBy] = useState<'aiScore' | 'valuationMatch' | 'expectedIRR' | 'name'>('aiScore')
  const [sortOrder, setSortOrder] = useState<'desc'>('desc')

  // AI-Enhanced Event handlers
  const handleCreateOpportunity = () => {
    alert('AI-Powered Deal Creation Wizard would launch:\n\n• Intelligent opportunity classification with sector analysis\n• Automated market research and competitive landscape mapping\n• ML-powered valuation suggestions based on comparable transactions\n• Risk assessment framework with predictive scoring\n• Integration with Market Intelligence for sector insights\n• Smart document template selection and population\n• Automated stakeholder notification and assignment')
  }

  const handleViewOpportunity = (id: string) => {
    const opportunity = mockOpportunities.find(o => o.id === id);
    if (opportunity) {
      // Navigate to the opportunity details page  
      router.push(`/deal-screening/opportunity/${id}`)
    }
  }

  const handleScreenOpportunity = (id: string) => {
    const opportunity = mockOpportunities.find(o => o.id === id);
    if (opportunity) {
      // Navigate to the screening workflow page
      router.push(`/deal-screening/opportunity/${id}/screen`)
    }
  }

  // Apply AI-enhanced filtering and sorting
  useEffect(() => {
    let filtered = mockOpportunities.filter(opp =>
      opp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      opp.sector.toLowerCase().includes(searchTerm.toLowerCase()) ||
      opp.seller.toLowerCase().includes(searchTerm.toLowerCase())
    )

    // AI-enhanced sorting
    filtered.sort((a, b) => {
      const aValue = a[sortBy]
      const bValue = b[sortBy]
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return bValue - aValue // Always desc for AI scores
      }
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return aValue.localeCompare(bValue)
      }
      
      return 0
    })

    setFilteredOpportunities(filtered)
  }, [searchTerm, sortBy, sortOrder])

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mb-4"></div>
        <h3 className="text-xl font-semibold text-gray-700">AI is analyzing deal opportunities...</h3>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* AI-Enhanced Mode Indicator */}
      <div className="bg-white border-b border-purple-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Badge className="bg-purple-100 text-purple-800 border border-purple-300 flex items-center space-x-1">
              <Brain className="h-3 w-3" />
              <span>AI-Assisted Mode</span>
            </Badge>
            <span className="text-gray-600 text-sm">Enhanced with artificial intelligence</span>
          </div>
          
          {/* AI-Enhanced Deal Screening Metrics */}
          <div className="flex items-center space-x-6 text-sm">
            <div className="text-gray-600">
              <span className="font-medium">AI Efficiency:</span> 
              <span className="text-purple-600 ml-1">{metrics.aiEfficiencyGains}%</span>
            </div>
            <div className="text-gray-600">
              <span className="font-medium">AI Analyzed:</span> 
              <span className="text-blue-600 ml-1">{metrics.aiAnalyzedDeals || 28}</span>
            </div>
            <div className="text-gray-600">
              <span className="font-medium">High Probability:</span> 
              <span className="text-green-600 ml-1">{metrics.highProbabilityDeals || 7}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* AI Recommendations Panel */}
        {aiRecommendations && aiRecommendations.length > 0 && (
          <div className="mb-6">
            <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Brain className="h-5 w-5 mr-2 text-purple-600" />
                  Deal Screening AI Recommendations ({aiRecommendations.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {aiRecommendations.slice(0, 4).map((rec) => (
                    <div key={rec.id} className="p-4 bg-white border rounded-lg shadow-sm">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h4 className="font-medium text-gray-900">{rec.title}</h4>
                            <Badge variant={rec.priority === 'high' ? 'destructive' : 'secondary'}>
                              {rec.priority}
                            </Badge>
                          </div>
                          
                          <p className="text-sm text-gray-600 mb-2">{rec.description}</p>
                          
                          {/* Deal Screening-specific recommendation metadata */}
                          <div className="flex items-center space-x-2 mb-3">
                            {rec.assetType && (
                              <>
                                <Target className="h-4 w-4 text-blue-500" />
                                <span className="text-xs text-gray-500 capitalize">{rec.assetType.replace('-', ' ')}</span>
                              </>
                            )}
                            {rec.sector && (
                              <>
                                <BarChart3 className="h-4 w-4 text-green-500" />
                                <span className="text-xs text-gray-500">{rec.sector}</span>
                              </>
                            )}
                            <span className="text-xs text-gray-500">
                              • {Math.round(rec.confidence * 100)}% confidence
                            </span>
                            {rec.expectedIRR && (
                              <span className="text-xs text-gray-500">
                                • {rec.expectedIRR}% IRR
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          {rec.actions?.map((action) => (
                            <Button
                              key={action.id}
                              size="sm"
                              variant={action.primary ? 'default' : 'outline'}
                              onClick={() => onExecuteAIAction(action.action)}
                              disabled={isLoading}
                            >
                              {action.label}
                            </Button>
                          ))}
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => onDismissRecommendation(rec.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* AI Performance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Brain className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="text-sm font-medium text-purple-800">AI Score Avg</p>
                  <p className="text-lg font-bold text-purple-900">{metrics.avgAIConfidence || 84}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Target className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm font-medium text-green-800">Valuation Accuracy</p>
                  <p className="text-lg font-bold text-green-900">{metrics.valuationAccuracy || 91}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-blue-800">Time Reduction</p>
                  <p className="text-lg font-bold text-blue-900">{metrics.timeReduction || 35}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
                <div>
                  <p className="text-sm font-medium text-orange-800">Outliers Detected</p>
                  <p className="text-lg font-bold text-orange-900">{metrics.valuationOutliers || 5}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Header with AI-Enhanced Search */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search opportunities (AI-powered)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            <Button variant="outline">
              <Brain className="h-4 w-4 mr-2" />
              AI Filters
            </Button>
            <Button variant="outline">
              <Sparkles className="h-4 w-4 mr-2" />
              Sort by AI Score
            </Button>
          </div>
          
          <Button onClick={handleCreateOpportunity}>
            <Plus className="h-4 w-4 mr-2" />
            New Opportunity
          </Button>
        </div>

        {/* AI-Enhanced Deal Opportunities List */}
        <div className="grid grid-cols-1 gap-4 mb-8">
          {filteredOpportunities.map((opportunity) => (
            <Card key={opportunity.id} className="hover:shadow-lg transition-shadow border-l-4 border-l-purple-500">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{opportunity.name}</h3>
                      {opportunity.priorityScore === 'high' && (
                        <Badge className="bg-purple-100 text-purple-800">
                          <Star className="h-3 w-3 mr-1" />
                          AI Priority
                        </Badge>
                      )}
                      <Badge variant={opportunity.status === 'active' ? 'default' : 'secondary'}>
                        {opportunity.status.replace('_', ' ')}
                      </Badge>
                    </div>
                    
                    {/* AI Scores Row */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3 p-3 bg-purple-50 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Brain className="h-4 w-4 text-purple-600" />
                        <div>
                          <p className="text-xs text-gray-600">AI Score</p>
                          <p className="font-semibold text-purple-900">{opportunity.aiScore}%</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Target className="h-4 w-4 text-blue-600" />
                        <div>
                          <p className="text-xs text-gray-600">Valuation Match</p>
                          <p className="font-semibold text-blue-900">{opportunity.valuationMatch}%</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <TrendingUp className="h-4 w-4 text-green-600" />
                        <div>
                          <p className="text-xs text-gray-600">Expected IRR</p>
                          <p className="font-semibold text-green-900">{opportunity.expectedIRR}%</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Shield className="h-4 w-4 text-orange-600" />
                        <div>
                          <p className="text-xs text-gray-600">Risk Level</p>
                          <p className={`font-semibold capitalize ${
                            opportunity.riskLevel === 'low' ? 'text-green-900' : 
                            opportunity.riskLevel === 'medium' ? 'text-yellow-900' : 'text-red-900'
                          }`}>{opportunity.riskLevel}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <DollarSign className="h-4 w-4" />
                        <span>${(opportunity.askPrice / 1000000).toFixed(1)}M</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Target className="h-4 w-4" />
                        <span>{opportunity.expectedMultiple}x Multiple</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <MapPin className="h-4 w-4" />
                        <span>{opportunity.geography}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <BarChart3 className="h-4 w-4" />
                        <span>{opportunity.sector}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col space-y-2">
                    <Button size="sm" onClick={() => handleViewOpportunity(opportunity.id)}>
                      <Brain className="h-4 w-4 mr-2" />
                      AI Analysis
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleScreenOpportunity(opportunity.id)}>
                      <Sparkles className="h-4 w-4 mr-2" />
                      AI Screening
                    </Button>
                    <Button size="sm" variant="outline">
                      <GitCompare className="h-4 w-4 mr-2" />
                      Compare
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* AI Enhancement Summary */}
        <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-purple-900 mb-1">AI Deal Screening Performance</h3>
                <p className="text-purple-700">Advanced machine learning for opportunity analysis</p>
              </div>
              <div className="grid grid-cols-3 gap-6 text-center">
                <div>
                  <p className="text-3xl font-bold text-green-600">{metrics.timeReduction || 35}%</p>
                  <p className="text-sm text-gray-600">Time Saved</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-purple-600">{metrics.valuationAccuracy || 91}%</p>
                  <p className="text-sm text-gray-600">Accuracy</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-blue-600">{metrics.highProbabilityDeals || 7}</p>
                  <p className="text-sm text-gray-600">High Probability</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default DealScreeningAssistedRefactored