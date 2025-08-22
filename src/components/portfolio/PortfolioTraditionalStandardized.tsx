'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  User,
  Plus,
  Search,
  Filter,
  MoreVertical,
  TrendingUp,
  TrendingDown,
  Building,
  PieChart,
  BarChart3,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  DollarSign,
  AlertCircle,
  CheckCircle,
  Clock,
  Target,
  Briefcase
} from 'lucide-react'
import { StandardizedKPICard } from '@/components/shared/StandardizedKPICard'
import { StandardizedSearchFilter } from '@/components/shared/StandardizedSearchFilter'
import { StandardizedLoading } from '@/components/shared/StandardizedStates'
import { generateModuleData } from '@/lib/mock-data-generator'
import { DESIGN_SYSTEM } from '@/lib/design-system'

interface PortfolioTraditionalStandardizedProps {
  isLoading?: boolean
  onCreateAsset?: () => void
  onViewAsset?: (id: string) => void
  onEditAsset?: (id: string) => void
}

export function PortfolioTraditionalStandardized({
  isLoading = false,
  onCreateAsset,
  onViewAsset,
  onEditAsset
}: PortfolioTraditionalStandardizedProps) {
  const [activeView, setActiveView] = useState('overview')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFilters, setSelectedFilters] = useState<string[]>([])
  
  const moduleData = generateModuleData('portfolio')
  
  if (isLoading) {
    return <StandardizedLoading mode="traditional" message="Loading portfolio data..." />
  }

  const portfolioMetrics = [
    {
      title: 'Total AUM',
      value: '$2.4B',
      change: '+12.3%',
      trend: 'up' as const,
      period: 'vs last quarter'
    },
    {
      title: 'Active Investments',
      value: '47',
      change: '+3',
      trend: 'up' as const,
      period: 'this month'
    },
    {
      title: 'Portfolio IRR',
      value: '18.6%',
      change: '+2.1%',
      trend: 'up' as const,
      period: 'vs last year'
    },
    {
      title: 'Realized Exits',
      value: '12',
      change: '+4',
      trend: 'up' as const,
      period: 'this year'
    }
  ]

  const portfolioCompanies = [
    {
      id: '1',
      name: 'TechFlow Solutions',
      sector: 'B2B SaaS',
      stage: 'Growth',
      investment: '$15M',
      ownership: '25%',
      valuation: '$60M',
      status: 'performing',
      lastUpdate: '2 days ago',
      metrics: {
        revenue: '$8.2M ARR',
        growth: '+45% YoY',
        multiple: '7.3x'
      }
    },
    {
      id: '2',
      name: 'MedDevice Innovations',
      sector: 'Healthcare',
      stage: 'Series B',
      investment: '$22M',
      ownership: '18%',
      valuation: '$122M',
      status: 'watch',
      lastUpdate: '1 week ago',
      metrics: {
        revenue: '$12.5M ARR',
        growth: '+28% YoY',
        multiple: '9.8x'
      }
    },
    {
      id: '3',
      name: 'GreenEnergy Co',
      sector: 'CleanTech',
      stage: 'Late Stage',
      investment: '$35M',
      ownership: '12%',
      valuation: '$290M',
      status: 'exit-ready',
      lastUpdate: '3 days ago',
      metrics: {
        revenue: '$45M ARR',
        growth: '+67% YoY',
        multiple: '6.4x'
      }
    }
  ]

  const getStatusBadge = (status: string) => {
    const colors = DESIGN_SYSTEM.colors.status
    switch (status) {
      case 'performing':
        return <Badge style={{ backgroundColor: colors.success.light, color: colors.success.dark }}>Performing</Badge>
      case 'watch':
        return <Badge style={{ backgroundColor: colors.warning.light, color: colors.warning.dark }}>Watch List</Badge>
      case 'exit-ready':
        return <Badge style={{ backgroundColor: colors.info.light, color: colors.info.dark }}>Exit Ready</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const renderOverview = () => (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {portfolioMetrics.map((metric, index) => (
          <StandardizedKPICard
            key={index}
            {...metric}
            mode="traditional"
          />
        ))}
      </div>

      {/* Portfolio Composition */}
      <Card style={{ borderColor: DESIGN_SYSTEM.colors.traditional.border }}>
        <CardHeader>
          <CardTitle className="flex items-center">
            <PieChart className="w-5 h-5 mr-2" style={{ color: DESIGN_SYSTEM.colors.traditional.icon }} />
            Portfolio Composition
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3">By Sector</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">B2B SaaS</span>
                  <span className="text-sm font-medium">42%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '42%' }}></div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Healthcare</span>
                  <span className="text-sm font-medium">28%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '28%' }}></div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">CleanTech</span>
                  <span className="text-sm font-medium">30%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-purple-500 h-2 rounded-full" style={{ width: '30%' }}></div>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-3">By Stage</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Growth</span>
                  <span className="text-sm font-medium">35%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-indigo-500 h-2 rounded-full" style={{ width: '35%' }}></div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Series B</span>
                  <span className="text-sm font-medium">40%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '40%' }}></div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Late Stage</span>
                  <span className="text-sm font-medium">25%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-red-500 h-2 rounded-full" style={{ width: '25%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderPortfolioList = () => (
    <div className="space-y-4">
      {/* Search and Filters */}
      <StandardizedSearchFilter
        mode="traditional"
        onSearch={setSearchQuery}
        onFilterChange={setSelectedFilters}
        searchPlaceholder="Search portfolio companies..."
        availableFilters={[
          { id: 'sector-saas', label: 'B2B SaaS', category: 'Sector' },
          { id: 'sector-healthcare', label: 'Healthcare', category: 'Sector' },
          { id: 'sector-cleantech', label: 'CleanTech', category: 'Sector' },
          { id: 'stage-growth', label: 'Growth', category: 'Stage' },
          { id: 'stage-series-b', label: 'Series B', category: 'Stage' },
          { id: 'stage-late', label: 'Late Stage', category: 'Stage' },
          { id: 'status-performing', label: 'Performing', category: 'Status' },
          { id: 'status-watch', label: 'Watch List', category: 'Status' },
          { id: 'status-exit', label: 'Exit Ready', category: 'Status' }
        ]}
      />

      {/* Portfolio Companies Table */}
      <Card style={{ borderColor: DESIGN_SYSTEM.colors.traditional.border }}>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center">
            <Building className="w-5 h-5 mr-2" style={{ color: DESIGN_SYSTEM.colors.traditional.icon }} />
            Portfolio Companies ({portfolioCompanies.length})
          </CardTitle>
          <Button onClick={onCreateAsset} style={{ backgroundColor: DESIGN_SYSTEM.colors.traditional.primary }}>
            <Plus className="w-4 h-4 mr-2" />
            Add Investment
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {portfolioCompanies.map((company) => (
              <div
                key={company.id}
                className="border rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                style={{ borderColor: DESIGN_SYSTEM.colors.traditional.border }}
                onClick={() => onViewAsset?.(company.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-semibold text-lg">{company.name}</h3>
                      {getStatusBadge(company.status)}
                      <Badge variant="outline">{company.sector}</Badge>
                      <Badge variant="outline">{company.stage}</Badge>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Investment:</span>
                        <div className="font-medium">{company.investment}</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Ownership:</span>
                        <div className="font-medium">{company.ownership}</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Valuation:</span>
                        <div className="font-medium">{company.valuation}</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Last Update:</span>
                        <div className="font-medium">{company.lastUpdate}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-6 mt-3 text-sm">
                      <div className="flex items-center space-x-1">
                        <DollarSign className="w-3 h-3 text-gray-400" />
                        <span>{company.metrics.revenue}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <TrendingUp className="w-3 h-3 text-green-500" />
                        <span className="text-green-600">{company.metrics.growth}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Target className="w-3 h-3 text-gray-400" />
                        <span>{company.metrics.multiple}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); onEditAsset?.(company.id); }}>
                      Edit
                    </Button>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )

  return (
    <div className="p-6" style={{ backgroundColor: DESIGN_SYSTEM.colors.traditional.background }}>
      {/* Mode Indicator */}
      <div className="mb-6">
        <Badge style={{ 
          backgroundColor: DESIGN_SYSTEM.colors.traditional.secondary, 
          color: DESIGN_SYSTEM.colors.traditional.text,
          border: `1px solid ${DESIGN_SYSTEM.colors.traditional.border}`
        }} className="flex items-center space-x-1 w-fit">
          <User className="h-3 w-3" />
          <span>Traditional Mode</span>
        </Badge>
      </div>

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Portfolio Management</h1>
        <p className="text-gray-600">
          Comprehensive portfolio oversight with manual control and detailed analytics
        </p>
      </div>

      {/* Navigation */}
      <div className="mb-6">
        <div className="flex space-x-1 bg-white rounded-lg p-1" style={{ border: `1px solid ${DESIGN_SYSTEM.colors.traditional.border}` }}>
          <Button
            variant={activeView === 'overview' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveView('overview')}
            className="flex items-center space-x-2"
          >
            <BarChart3 className="w-4 h-4" />
            <span>Overview</span>
          </Button>
          <Button
            variant={activeView === 'companies' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveView('companies')}
            className="flex items-center space-x-2"
          >
            <Building className="w-4 h-4" />
            <span>Companies</span>
          </Button>
          <Button
            variant={activeView === 'performance' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveView('performance')}
            className="flex items-center space-x-2"
          >
            <TrendingUp className="w-4 h-4" />
            <span>Performance</span>
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-6">
        {activeView === 'overview' && renderOverview()}
        {activeView === 'companies' && renderPortfolioList()}
        {activeView === 'performance' && (
          <div className="text-center py-12">
            <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600">Performance Analytics</h3>
            <p className="text-gray-500">Detailed performance metrics and reporting</p>
            <Badge variant="outline" className="mt-2">Coming Soon</Badge>
          </div>
        )}
      </div>
    </div>
  )
}