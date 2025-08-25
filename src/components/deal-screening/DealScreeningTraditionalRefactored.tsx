/**
 * Refactored Deal Screening Traditional Component
 * Uses new standardized TraditionalModeProps interface while maintaining deal screening functionality
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
  ArrowUpDown,
  Plus,
  MoreVertical,
  TrendingUp,
  BarChart3,
  Activity,
  User,
  Calendar,
  DollarSign,
  MapPin,
  FileText,
  Clock,
  Target,
  AlertCircle,
  CheckCircle,
} from 'lucide-react'
import type { TraditionalModeProps } from '@/types/shared'
import { ComparativeValuationAnalysis } from './ComparativeValuationAnalysis'

// Enhanced mock deal opportunities with comprehensive screening data
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
    screeningScore: 8.2,
    marketFit: 87,
    strategicAlignment: 9.1,
    liquidityScore: 85,
    timeToExit: '3-5 years'
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
    screeningScore: 9.4,
    marketFit: 94,
    strategicAlignment: 8.7,
    liquidityScore: 92,
    timeToExit: '2-4 years'
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
    screeningScore: 7.1,
    marketFit: 78,
    strategicAlignment: 6.8,
    liquidityScore: 78,
    timeToExit: '5-7 years'
  },
  {
    id: '4',
    name: 'European REIT Secondary',
    seller: 'Family Office',
    assetType: 'fund' as const,
    vintage: '2019',
    sector: 'Real Estate',
    geography: 'Europe',
    askPrice: 32000000,
    navPercentage: 89,
    expectedIRR: 12.4,
    expectedMultiple: 1.8,
    status: 'active' as const,
    screeningStage: 'initial' as const,
    riskLevel: 'low' as const,
    screeningScore: 7.8,
    marketFit: 82,
    strategicAlignment: 7.5,
    liquidityScore: 89,
    timeToExit: '2-3 years'
  },
  {
    id: '5',
    name: 'Clean Energy Growth Fund',
    seller: 'Pension Fund',
    assetType: 'direct' as const,
    vintage: '2022',
    sector: 'Energy',
    geography: 'North America',
    askPrice: 58000000,
    navPercentage: 76,
    expectedIRR: 19.7,
    expectedMultiple: 2.4,
    status: 'active' as const,
    screeningStage: 'detailed' as const,
    riskLevel: 'medium' as const,
    screeningScore: 8.9,
    marketFit: 91,
    strategicAlignment: 9.3,
    liquidityScore: 76,
    timeToExit: '4-6 years'
  }
]

export function DealScreeningTraditionalRefactored({ 
  metrics, 
  isLoading = false,
  onSwitchMode
}: TraditionalModeProps) {
  
  const router = useRouter()
  
  // Local state for traditional mode
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredOpportunities, setFilteredOpportunities] = useState(mockOpportunities)
  const [sortBy, setSortBy] = useState<'name' | 'status' | 'sector' | 'askPrice' | 'expectedIRR'>('name')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [showFilters, setShowFilters] = useState(false)
  const [selectedOpportunityForAnalysis, setSelectedOpportunityForAnalysis] = useState<string | null>(null)

  // Event handlers with actual functionality
  const handleCreateOpportunity = () => {
    alert('Deal Origination Wizard would open here. In a real implementation, this would launch:\n\n• Automated deal information collection\n• Market analysis integration\n• Competitive positioning assessment\n• Initial screening criteria evaluation')
  }

  const handleViewOpportunity = (id: string) => {
    const opportunity = mockOpportunities.find(o => o.id === id)
    if (opportunity) {
      // Navigate to the opportunity details page
      router.push(`/deal-screening/opportunity/${id}`)
    }
  }

  const handleScreenOpportunity = (id: string) => {
    const opportunity = mockOpportunities.find(o => o.id === id)
    if (opportunity) {
      // Navigate to the screening workflow page
      router.push(`/deal-screening/opportunity/${id}/screen`)
    }
  }

  const handleQuickAnalysis = (id: string) => {
    const opportunity = mockOpportunities.find(o => o.id === id)
    if (opportunity) {
      alert(`Quick Analysis Results for "${opportunity.name}":\n\n• Expected IRR: ${opportunity.expectedIRR}% (Target: 15%+)\n• Multiple: ${opportunity.expectedMultiple}x\n• Risk Level: ${opportunity.riskLevel}\n• Market Position: Strong\n• Liquidity: ${opportunity.navPercentage}% of NAV\n\n✅ Meets investment criteria`)
    }
  }

  // Apply filtering and sorting
  useEffect(() => {
    let filtered = mockOpportunities.filter(opp =>
      opp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      opp.sector.toLowerCase().includes(searchTerm.toLowerCase()) ||
      opp.seller.toLowerCase().includes(searchTerm.toLowerCase())
    )

    // Sort opportunities
    filtered.sort((a, b) => {
      let aValue = a[sortBy]
      let bValue = b[sortBy]
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortOrder === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue)
      }
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortOrder === 'asc' ? aValue - bValue : bValue - aValue
      }
      
      return 0
    })

    setFilteredOpportunities(filtered)
  }, [searchTerm, sortBy, sortOrder])

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-600 mb-4"></div>
        <h3 className="text-xl font-semibold text-gray-700">Loading Deal Opportunities...</h3>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mode Indicator */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Badge className="bg-gray-100 text-gray-800 border border-gray-300 flex items-center space-x-1">
              <User className="h-3 w-3" />
              <span>Traditional Mode</span>
            </Badge>
            <span className="text-gray-600 text-sm">Manual deal screening process</span>
          </div>
          
          {/* Deal Screening Metrics Display */}
          <div className="flex items-center space-x-6 text-sm text-gray-600">
            <div>
              <span className="font-medium">Active Opportunities:</span> {mockOpportunities.length}
            </div>
            <div>
              <span className="font-medium">Avg Screening Score:</span> {(mockOpportunities.reduce((sum, opp) => sum + opp.screeningScore, 0) / mockOpportunities.length).toFixed(1)}/10
            </div>
            <div>
              <span className="font-medium">High Priority:</span> {mockOpportunities.filter(opp => opp.screeningScore >= 8.5).length}
            </div>
            <div>
              <span className="font-medium">Total Deal Value:</span> ${(mockOpportunities.reduce((sum, opp) => sum + opp.askPrice, 0) / 1000000).toFixed(0)}M
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Traditional Mode Features Banner */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium text-gray-700">Manual Evaluation</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium text-gray-700">Custom Criteria</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium text-gray-700">Detailed Analysis</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium text-gray-700">Full Control</span>
            </div>
          </div>
        </div>

        {/* Header with Search and Actions */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search opportunities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
            <Button variant="outline">
              <ArrowUpDown className="h-4 w-4 mr-2" />
              Sort: {sortBy}
            </Button>
          </div>
          
          <Button onClick={handleCreateOpportunity}>
            <Plus className="h-4 w-4 mr-2" />
            New Opportunity
          </Button>
        </div>

        {/* Deal Opportunities List */}
        <div className="grid grid-cols-1 gap-4 mb-8">
          {filteredOpportunities.map((opportunity) => (
            <Card key={opportunity.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{opportunity.name}</h3>
                      <Badge variant={opportunity.status === 'active' ? 'default' : 'secondary'}>
                        {opportunity.status.replace('_', ' ')}
                      </Badge>
                      <Badge variant="outline" className="capitalize">
                        {opportunity.screeningStage}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <DollarSign className="h-4 w-4" />
                        <span>${(opportunity.askPrice / 1000000).toFixed(1)}M</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <TrendingUp className="h-4 w-4" />
                        <span>{opportunity.expectedIRR}% IRR</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Target className="h-4 w-4" />
                        <span>{opportunity.expectedMultiple}x Multiple</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <MapPin className="h-4 w-4" />
                        <span>{opportunity.geography}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4 mt-3 text-sm text-gray-600">
                      <span><span className="font-medium">Seller:</span> {opportunity.seller}</span>
                      <span><span className="font-medium">Sector:</span> {opportunity.sector}</span>
                      <span><span className="font-medium">Vintage:</span> {opportunity.vintage}</span>
                      <span><span className="font-medium">Type:</span> {opportunity.assetType.replace('-', ' ')}</span>
                    </div>
                    
                    {/* Enhanced Screening Metrics */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4 p-3 bg-gray-50 rounded-lg">
                      <div className="text-center">
                        <p className="text-xs text-gray-500 mb-1">Screening Score</p>
                        <p className={`text-lg font-bold ${
                          opportunity.screeningScore >= 8.5 ? 'text-green-600' :
                          opportunity.screeningScore >= 7 ? 'text-yellow-600' :
                          'text-red-600'
                        }`}>
                          {opportunity.screeningScore}/10
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-gray-500 mb-1">Market Fit</p>
                        <p className="text-lg font-bold text-blue-600">{opportunity.marketFit}%</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-gray-500 mb-1">Strategic Align</p>
                        <p className="text-lg font-bold text-blue-600">{opportunity.strategicAlignment}/10</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-gray-500 mb-1">Exit Timeline</p>
                        <p className="text-sm font-medium text-gray-700">{opportunity.timeToExit}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col space-y-2">
                    <Button size="sm" onClick={() => handleViewOpportunity(opportunity.id)}>
                      <FileText className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleScreenOpportunity(opportunity.id)}>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Full Screening
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleQuickAnalysis(opportunity.id)}>
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Quick Analysis
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      className={`${
                        opportunity.riskLevel === 'low' ? 'border-green-200 text-green-700 bg-green-50' :
                        opportunity.riskLevel === 'medium' ? 'border-yellow-200 text-yellow-700 bg-yellow-50' :
                        'border-red-200 text-red-700 bg-red-50'
                      }`}
                    >
                      {opportunity.riskLevel.toUpperCase()} RISK
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Traditional Screening Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Activity className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Opportunities</p>
                  <p className="text-2xl font-bold text-gray-900">{metrics.totalOpportunities || 32}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg Screening Time</p>
                  <p className="text-2xl font-bold text-gray-900">{metrics.averageScreeningTime || '12 days'}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
                  <p className="text-2xl font-bold text-gray-900">{metrics.conversionRate || '42%'}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-orange-600" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-gray-900">{metrics.completedScreenings || 14}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Comparative Valuation Analysis */}
        {selectedOpportunityForAnalysis && (
          <div className="mt-8">
            <ComparativeValuationAnalysis 
              opportunityId={selectedOpportunityForAnalysis}
              onClose={() => setSelectedOpportunityForAnalysis(null)}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default DealScreeningTraditionalRefactored