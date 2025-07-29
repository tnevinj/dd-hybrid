'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  Search,
  Filter,
  ArrowUpDown,
  Plus,
  Download,
  Share,
  BarChart3,
  PieChart,
  TrendingUp,
  DollarSign,
  Target,
  Users,
  Calendar,
  AlertCircle,
  User
} from 'lucide-react'

// Import existing portfolio components
import { PortfolioOverview } from './common/PortfolioOverview'
import { PortfolioPerformance } from './common/PortfolioPerformance'
import { VirtualizedAssetGrid } from './common/VirtualizedAssetGrid'
import { ProfessionalAnalytics } from './common/ProfessionalAnalytics'
import { RiskManagement } from './common/RiskManagement'

interface PortfolioTraditionalProps {
  portfolioData?: any
  assets?: any[]
  metrics?: any
  isLoading?: boolean
  onCreateAsset?: () => void
  onViewAsset?: (id: string) => void
  onEditAsset?: (id: string) => void
}

export function PortfolioTraditional({
  portfolioData,
  assets = [],
  metrics = {
    totalValue: 2400000000, // $2.4B
    totalAssets: 47,
    performanceYTD: 12.5,
    topPerformer: 'TechCorp Growth Fund',
    riskScore: 3.2
  },
  isLoading = false,
  onCreateAsset,
  onViewAsset,
  onEditAsset
}: PortfolioTraditionalProps) {
  const [activeTab, setActiveTab] = useState('overview')
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredAssets, setFilteredAssets] = useState(assets)
  const [sortBy, setSortBy] = useState<'name' | 'value' | 'performance' | 'risk'>('name')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [selectedFilters, setSelectedFilters] = useState({
    assetType: '',
    sector: '',
    geography: '',
    riskLevel: ''
  })
  const [showFilters, setShowFilters] = useState(false)

  // Apply filtering and sorting
  useEffect(() => {
    let result = [...assets]
    
    // Apply search filter
    if (searchTerm) {
      result = result.filter(asset => 
        asset.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.sector?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.type?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    
    // Apply filters
    Object.entries(selectedFilters).forEach(([key, value]) => {
      if (value) {
        result = result.filter(asset => asset[key] === value)
      }
    })

    // Apply sorting
    result.sort((a, b) => {
      let aValue = a[sortBy]
      let bValue = b[sortBy]
      
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase()
        bValue = bValue?.toLowerCase()
      }
      
      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
      }
    })
    
    setFilteredAssets(result)
  }, [assets, searchTerm, selectedFilters, sortBy, sortOrder])

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

  const handleSort = (field: typeof sortBy) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortOrder('asc')
    }
  }

  const clearFilters = () => {
    setSelectedFilters({
      assetType: '',
      sector: '',
      geography: '',
      riskLevel: ''
    })
    setSearchTerm('')
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-600 mb-4"></div>
        <h3 className="text-xl font-semibold text-gray-700">Loading Portfolio Data...</h3>
      </div>
    )
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'assets', label: 'Assets', icon: PieChart },
    { id: 'performance', label: 'Performance', icon: TrendingUp },
    { id: 'analytics', label: 'Analytics', icon: Target },
    { id: 'risk', label: 'Risk', icon: AlertCircle }
  ]

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Header - Traditional Theme */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <div className="flex items-center space-x-3">
            <h1 className="text-3xl font-bold text-gray-900">Portfolio Management</h1>
            <Badge className="bg-gray-100 text-gray-800 border border-gray-300 flex items-center space-x-1">
              <User className="h-3 w-3" />
              <span>Traditional Mode</span>
            </Badge>
          </div>
          <p className="text-gray-600 mt-1">Complete manual control over portfolio operations and analysis</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={onCreateAsset} className="flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>Add Asset</span>
          </Button>
          <Button variant="outline" className="flex items-center space-x-2">
            <Download className="h-4 w-4" />
            <span>Export</span>
          </Button>
          <Button variant="outline" className="flex items-center space-x-2">
            <Share className="h-4 w-4" />
            <span>Share</span>
          </Button>
        </div>
      </div>
      
      {/* Key Metrics - Manual Focus */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <Card className="border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2 mb-2">
              <DollarSign className="h-5 w-5 text-gray-600" />
              <p className="text-sm text-gray-600 font-medium">Total Portfolio Value</p>
            </div>
            <p className="text-3xl font-bold text-gray-900">{formatCurrency(metrics.totalValue)}</p>
            <div className="flex items-center text-gray-500 text-sm mt-1">
              <Calendar className="h-4 w-4 mr-1" />
              Manually tracked
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2 mb-2">
              <BarChart3 className="h-5 w-5 text-gray-600" />
              <p className="text-sm text-gray-600 font-medium">Total Assets</p>
            </div>
            <p className="text-3xl font-bold text-gray-900">{metrics.totalAssets}</p>
            <div className="flex items-center text-gray-500 text-sm mt-1">
              <Users className="h-4 w-4 mr-1" />
              Manual review
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2 mb-2">
              <TrendingUp className="h-5 w-5 text-gray-600" />
              <p className="text-sm text-gray-600 font-medium">YTD Performance</p>
            </div>
            <p className="text-3xl font-bold text-gray-900">{metrics.performanceYTD}%</p>
            <div className="flex items-center text-gray-500 text-sm mt-1">
              <Target className="h-4 w-4 mr-1" />
              Expert analysis
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-gray-200">
          <CardContent className="p-6">
            <p className="text-sm text-gray-600 font-medium mb-2">Top Performer</p>
            <p className="text-lg font-bold text-gray-900 mb-1">{metrics.topPerformer}</p>
            <div className="flex items-center text-gray-500 text-sm">
              <User className="h-4 w-4 mr-1" />
              Human judgment
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-gray-200">
          <CardContent className="p-6">
            <p className="text-sm text-gray-600 font-medium mb-2">Risk Score</p>
            <p className="text-3xl font-bold text-gray-900">{metrics.riskScore}/5</p>
            <div className="flex items-center text-gray-500 text-sm mt-1">
              <AlertCircle className="h-4 w-4 mr-1" />
              Manual assessment
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Navigation Tabs */}
      <Card className="mb-6 border-gray-200">
        <CardContent className="p-0">
          <div className="flex border-b border-gray-200">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-6 py-4 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-b-2 border-gray-600 text-gray-900 bg-gray-50'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Manual Search & Filter Controls */}
      {activeTab === 'assets' && (
        <Card className="mb-6 border-gray-200">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-xl text-gray-900">Manual Search & Filter Controls</CardTitle>
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="text-gray-600">
                  {filteredAssets.length} of {assets.length} shown
                </Badge>
                {(searchTerm || Object.values(selectedFilters).some(v => v)) && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={clearFilters}
                    className="text-gray-600 border-gray-300"
                  >
                    Clear All
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 mb-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search assets, sectors, types..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-gray-300 focus:border-gray-500"
                />
              </div>
              
              <Button 
                variant="outline" 
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 border-gray-300 text-gray-700"
              >
                <Filter className="h-4 w-4" />
                <span>Advanced Filters</span>
              </Button>
            </div>

            {showFilters && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg border">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Asset Type</label>
                  <select
                    value={selectedFilters.assetType}
                    onChange={(e) => setSelectedFilters(prev => ({ ...prev, assetType: e.target.value }))}
                    className="w-full p-2 border border-gray-300 rounded-md text-sm"
                  >
                    <option value="">All Types</option>
                    <option value="equity">Private Equity</option>
                    <option value="debt">Debt</option>
                    <option value="real-estate">Real Estate</option>
                    <option value="infrastructure">Infrastructure</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sector</label>
                  <select
                    value={selectedFilters.sector}
                    onChange={(e) => setSelectedFilters(prev => ({ ...prev, sector: e.target.value }))}
                    className="w-full p-2 border border-gray-300 rounded-md text-sm"
                  >
                    <option value="">All Sectors</option>
                    <option value="technology">Technology</option>
                    <option value="healthcare">Healthcare</option>
                    <option value="financial">Financial Services</option>
                    <option value="industrial">Industrial</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Geography</label>
                  <select
                    value={selectedFilters.geography}
                    onChange={(e) => setSelectedFilters(prev => ({ ...prev, geography: e.target.value }))}
                    className="w-full p-2 border border-gray-300 rounded-md text-sm"
                  >
                    <option value="">All Regions</option>
                    <option value="north-america">North America</option>
                    <option value="europe">Europe</option>
                    <option value="asia">Asia</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Risk Level</label>
                  <select
                    value={selectedFilters.riskLevel}
                    onChange={(e) => setSelectedFilters(prev => ({ ...prev, riskLevel: e.target.value }))}
                    className="w-full p-2 border border-gray-300 rounded-md text-sm"
                  >
                    <option value="">All Risk Levels</option>
                    <option value="low">Low Risk</option>
                    <option value="medium">Medium Risk</option>
                    <option value="high">High Risk</option>
                  </select>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Tab Content */}
      <div className="space-y-6">
        {activeTab === 'overview' && (
          <PortfolioOverview />
        )}
        
        {activeTab === 'assets' && (
          <VirtualizedAssetGrid 
            assets={filteredAssets}
            onViewAsset={onViewAsset}
            onEditAsset={onEditAsset}
          />
        )}
        
        {activeTab === 'performance' && (
          <PortfolioPerformance />
        )}
        
        {activeTab === 'analytics' && (
          <ProfessionalAnalytics />
        )}
        
        {activeTab === 'risk' && (
          <RiskManagement />
        )}
      </div>

      {/* Manual Process Notice */}
      <div className="mt-6 p-4 bg-gray-100 border border-gray-200 rounded-lg">
        <div className="flex items-start space-x-3">
          <User className="h-5 w-5 text-gray-600 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-gray-900 mb-1">Traditional Manual Portfolio Management</h4>
            <p className="text-sm text-gray-600">
              You have complete control over portfolio analysis and decisions. All valuations, risk assessments, 
              and performance calculations are performed manually without AI assistance. Use the search, filter, 
              and sort tools above to organize your portfolio according to your preferences.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PortfolioTraditional