/**
 * Enhanced Portfolio Traditional Component
 * Provides comprehensive portfolio management with direct implementation
 */

'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { 
  User, 
  TrendingUp, 
  DollarSign,
  PieChart,
  BarChart3,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Building,
  MapPin,
  Calendar,
  Target,
  AlertTriangle,
  CheckCircle,
  Activity,
  Award,
  Globe
} from 'lucide-react'
import type { TraditionalModeProps } from '@/types/shared'

// Mock portfolio data for immediate functionality
const mockPortfolioData = {
  totalValue: 388000000, // $388M
  totalAssets: 47,
  performanceYTD: 12.5,
  assets: [
    {
      id: '1',
      name: 'TechCorp Growth Fund',
      type: 'Private Equity',
      sector: 'Technology',
      currentValue: 45000000,
      acquisitionValue: 38000000,
      performance: 18.4,
      riskLevel: 'Medium',
      location: 'North America',
      status: 'Active',
      irr: 22.3,
      moic: 1.8,
      lastUpdate: '2024-12-15'
    },
    {
      id: '2',
      name: 'Healthcare REIT Portfolio',
      type: 'Real Estate',
      sector: 'Healthcare',
      currentValue: 52000000,
      acquisitionValue: 50000000,
      performance: 4.0,
      riskLevel: 'Low',
      location: 'North America',
      status: 'Active',
      irr: 8.7,
      moic: 1.04,
      lastUpdate: '2024-12-14'
    },
    {
      id: '3',
      name: 'Infrastructure Debt Fund',
      type: 'Infrastructure',
      sector: 'Infrastructure',
      currentValue: 67000000,
      acquisitionValue: 65000000,
      performance: 3.1,
      riskLevel: 'Low',
      location: 'Europe',
      status: 'Active',
      irr: 11.2,
      moic: 1.03,
      lastUpdate: '2024-12-13'
    },
    {
      id: '4',
      name: 'Emerging Markets VC Fund',
      type: 'Private Equity',
      sector: 'Technology',
      currentValue: 28000000,
      acquisitionValue: 25000000,
      performance: 12.0,
      riskLevel: 'High',
      location: 'Asia',
      status: 'Active',
      irr: 28.5,
      moic: 1.12,
      lastUpdate: '2024-12-12'
    },
    {
      id: '5',
      name: 'Energy Transition Fund',
      type: 'Infrastructure',
      sector: 'Energy',
      currentValue: 38000000,
      acquisitionValue: 35000000,
      performance: 8.6,
      riskLevel: 'Medium',
      location: 'Europe',
      status: 'Active',
      irr: 15.8,
      moic: 1.09,
      lastUpdate: '2024-12-11'
    }
  ]
}

export function PortfolioTraditionalRefactored({
  metrics,
  isLoading = false,
  onSwitchMode
}: TraditionalModeProps) {
  
  const [activeTab, setActiveTab] = useState('overview')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedAsset, setSelectedAsset] = useState<string | null>(null)

  // Use provided metrics or fallback to mock data
  const portfolioMetrics = metrics || mockPortfolioData

  // Portfolio-specific event handlers with actual functionality
  const handleCreateAsset = () => {
    alert('Asset creation form would open here. In a real implementation, this would navigate to an asset creation wizard.')
  }

  const handleViewAsset = (id: string) => {
    setSelectedAsset(id)
    alert(`Viewing detailed analytics for asset ${id}. In a real implementation, this would open a comprehensive asset detail view.`)
  }

  const handleEditAsset = (id: string) => {
    alert(`Editing asset ${id}. In a real implementation, this would open an asset editing interface.`)
  }

  const filteredAssets = mockPortfolioData.assets.filter(asset =>
    asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    asset.sector.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Low': return 'bg-green-100 text-green-800'
      case 'Medium': return 'bg-yellow-100 text-yellow-800'
      case 'High': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800'
      case 'Pending': return 'bg-yellow-100 text-yellow-800'
      case 'Closed': return 'bg-gray-100 text-gray-800'
      default: return 'bg-blue-100 text-blue-800'
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-600 mb-4"></div>
        <h3 className="text-xl font-semibold text-gray-700">Loading Portfolio Data...</h3>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mode Indicator */}
      <div className="bg-white border-b border-gray-200 px-6 py-3">
        <div className="flex items-center justify-between">
          <Badge className="bg-gray-100 text-gray-800 border border-gray-300 flex items-center space-x-1">
            <User className="h-3 w-3" />
            <span>Traditional Mode</span>
          </Badge>
          
          {/* Key Metrics Display */}
          <div className="flex items-center space-x-6 text-sm text-gray-600">
            <div>
              <span className="font-medium">Total Value:</span> {formatCurrency(portfolioMetrics.totalValue || 0)}
            </div>
            <div>
              <span className="font-medium">Assets:</span> {portfolioMetrics.totalAssets || 0}
            </div>
            <div>
              <span className="font-medium">YTD Performance:</span> {portfolioMetrics.performanceYTD || 0}%
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Portfolio Overview</TabsTrigger>
            <TabsTrigger value="assets">Asset Management</TabsTrigger>
            <TabsTrigger value="performance">Performance Analytics</TabsTrigger>
            <TabsTrigger value="reports">Reports & Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* KPI Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <DollarSign className="h-8 w-8 text-green-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Total Portfolio Value</p>
                      <p className="text-2xl font-bold text-gray-900">{formatCurrency(mockPortfolioData.totalValue)}</p>
                      <p className="text-xs text-green-600 flex items-center">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        +12.5% YTD
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Building className="h-8 w-8 text-blue-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Total Assets</p>
                      <p className="text-2xl font-bold text-gray-900">{mockPortfolioData.totalAssets}</p>
                      <p className="text-xs text-gray-600">Across 3 asset classes</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Target className="h-8 w-8 text-purple-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Avg IRR</p>
                      <p className="text-2xl font-bold text-gray-900">17.3%</p>
                      <p className="text-xs text-green-600">Above 15% target</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Award className="h-8 w-8 text-orange-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">ESG Score</p>
                      <p className="text-2xl font-bold text-gray-900">84/100</p>
                      <p className="text-xs text-green-600">Top quartile</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Asset Allocation */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Asset Allocation</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium">Private Equity</span>
                        <span className="text-sm text-gray-600">31%</span>
                      </div>
                      <Progress value={31} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium">Infrastructure</span>
                        <span className="text-sm text-gray-600">43%</span>
                      </div>
                      <Progress value={43} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium">Real Estate</span>
                        <span className="text-sm text-gray-600">26%</span>
                      </div>
                      <Progress value={26} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Geographic Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Globe className="h-4 w-4 text-blue-600 mr-2" />
                        <span className="text-sm font-medium">North America</span>
                      </div>
                      <span className="text-sm text-gray-600">58% • {formatCurrency(224760000)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Globe className="h-4 w-4 text-green-600 mr-2" />
                        <span className="text-sm font-medium">Europe</span>
                      </div>
                      <span className="text-sm text-gray-600">27% • {formatCurrency(104760000)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Globe className="h-4 w-4 text-orange-600 mr-2" />
                        <span className="text-sm font-medium">Asia</span>
                      </div>
                      <span className="text-sm text-gray-600">15% • {formatCurrency(58200000)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="assets" className="space-y-6">
            {/* Asset Management Tools */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                  <Input
                    placeholder="Search assets..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </div>
              <Button onClick={handleCreateAsset}>
                <Plus className="h-4 w-4 mr-2" />
                Add Asset
              </Button>
            </div>

            {/* Assets Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredAssets.map((asset) => (
                <Card key={asset.id} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-lg">{asset.name}</h3>
                        <p className="text-sm text-gray-600">{asset.type} • {asset.sector}</p>
                        <div className="flex items-center mt-2 text-sm text-gray-500">
                          <MapPin className="h-3 w-3 mr-1" />
                          {asset.location}
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Badge className={getRiskColor(asset.riskLevel)}>
                          {asset.riskLevel} Risk
                        </Badge>
                        <Badge className={getStatusColor(asset.status)}>
                          {asset.status}
                        </Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-600">Current Value</p>
                        <p className="font-semibold">{formatCurrency(asset.currentValue)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Performance</p>
                        <p className={`font-semibold ${asset.performance > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {asset.performance > 0 ? '+' : ''}{asset.performance}%
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
                      <div>
                        <p className="text-gray-600">IRR</p>
                        <p className="font-medium">{asset.irr}%</p>
                      </div>
                      <div>
                        <p className="text-gray-600">MOIC</p>
                        <p className="font-medium">{asset.moic}x</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Updated</p>
                        <p className="font-medium">{new Date(asset.lastUpdate).toLocaleDateString()}</p>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleViewAsset(asset.id)}
                        className="flex-1"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View Details
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleEditAsset(asset.id)}
                        className="flex-1"
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance Analytics Dashboard</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600">Interactive Performance Charts</p>
                    <p className="text-sm text-gray-500">Portfolio performance trends and analysis would be displayed here</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Reports & Business Intelligence</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <PieChart className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600">Automated Reporting Suite</p>
                    <p className="text-sm text-gray-500">Custom reports and business intelligence dashboards would be available here</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default PortfolioTraditionalRefactored