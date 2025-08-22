'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  User,
  Plus,
  DollarSign,
  TrendingUp,
  Users,
  Calendar,
  BarChart3,
  CreditCard,
  Banknote,
  Calculator,
  FileText,
  Eye,
  Edit,
  Send,
  Download,
  Building,
  Target,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  MoreVertical,
  Briefcase
} from 'lucide-react'
import { StandardizedKPICard } from '@/components/shared/StandardizedKPICard'
import { StandardizedSearchFilter } from '@/components/shared/StandardizedSearchFilter'
import { StandardizedLoading } from '@/components/shared/StandardizedStates'
import { generateModuleData } from '@/lib/mock-data-generator'
import { DESIGN_SYSTEM, getStatusColor } from '@/lib/design-system'

interface FundOperationsTraditionalStandardizedProps {
  isLoading?: boolean
  onCreateCapitalCall?: () => void
  onViewFund?: (id: string) => void
  onProcessDistribution?: () => void
}

export function FundOperationsTraditionalStandardized({
  isLoading = false,
  onCreateCapitalCall,
  onViewFund,
  onProcessDistribution
}: FundOperationsTraditionalStandardizedProps) {
  const [activeView, setActiveView] = useState('overview')
  const [selectedFund, setSelectedFund] = useState('fund-1')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFilters, setSelectedFilters] = useState<string[]>([])
  
  const moduleData = generateModuleData('fund-operations')
  
  if (isLoading) {
    return <StandardizedLoading mode="traditional" message="Loading fund operations data..." />
  }

  const fundMetrics = [
    {
      title: 'Total AUM',
      value: '$1.2B',
      change: '+8.5%',
      trend: 'up' as const,
      period: 'vs last quarter'
    },
    {
      title: 'Active Funds',
      value: '7',
      change: '+1',
      trend: 'up' as const,
      period: 'this year'
    },
    {
      title: 'Capital Called',
      value: '68%',
      change: '+12%',
      trend: 'up' as const,
      period: 'YTD'
    },
    {
      title: 'Distributions',
      value: '$89M',
      change: '+24%',
      trend: 'up' as const,
      period: 'this year'
    }
  ]

  const funds = [
    {
      id: 'fund-1',
      name: 'Growth Fund III',
      vintage: '2022',
      status: 'investing',
      targetSize: '$500M',
      committed: '$475M',
      called: '$285M',
      distributed: '$52M',
      netIRR: '18.3%',
      dpi: '0.18',
      tvpi: '1.24',
      lpCount: 42
    },
    {
      id: 'fund-2',
      name: 'Venture Fund II',
      vintage: '2021',
      status: 'investing',
      targetSize: '$300M',
      committed: '$300M',
      called: '$220M',
      distributed: '$95M',
      netIRR: '22.1%',
      dpi: '0.43',
      tvpi: '1.67',
      lpCount: 28
    },
    {
      id: 'fund-3',
      name: 'Opportunity Fund I',
      vintage: '2020',
      status: 'harvesting',
      targetSize: '$200M',
      committed: '$185M',
      called: '$160M',
      distributed: '$145M',
      netIRR: '28.5%',
      dpi: '0.91',
      tvpi: '1.85',
      lpCount: 18
    }
  ]

  const capitalCalls = [
    {
      id: '1',
      fundName: 'Growth Fund III',
      amount: '$25M',
      callDate: '2024-02-20',
      dueDate: '2024-03-05',
      status: 'pending',
      respondedLPs: 38,
      totalLPs: 42,
      purpose: 'TechFlow Series B Follow-on'
    },
    {
      id: '2',
      fundName: 'Venture Fund II',
      amount: '$18M',
      callDate: '2024-02-15',
      dueDate: '2024-03-01',
      status: 'collecting',
      respondedLPs: 28,
      totalLPs: 28,
      purpose: 'MedDevice Initial Investment'
    }
  ]

  const distributions = [
    {
      id: '1',
      fundName: 'Opportunity Fund I',
      amount: '$42M',
      date: '2024-01-30',
      type: 'Realized Gains',
      source: 'CloudCo Exit',
      status: 'completed',
      lpPayments: 18
    },
    {
      id: '2',
      fundName: 'Venture Fund II',
      amount: '$12M',
      date: '2024-01-15',
      type: 'Dividend',
      source: 'Portfolio Dividends Q4',
      status: 'completed',
      lpPayments: 28
    }
  ]

  const getStatusBadge = (status: string) => {
    const statusColors = {
      'investing': { bg: DESIGN_SYSTEM.colors.status.info.light, text: DESIGN_SYSTEM.colors.status.info.dark },
      'harvesting': { bg: DESIGN_SYSTEM.colors.status.success.light, text: DESIGN_SYSTEM.colors.status.success.dark },
      'pending': { bg: DESIGN_SYSTEM.colors.status.warning.light, text: DESIGN_SYSTEM.colors.status.warning.dark },
      'collecting': { bg: DESIGN_SYSTEM.colors.status.info.light, text: DESIGN_SYSTEM.colors.status.info.dark },
      'completed': { bg: DESIGN_SYSTEM.colors.status.success.light, text: DESIGN_SYSTEM.colors.status.success.dark }
    }
    
    const colors = statusColors[status as keyof typeof statusColors] || { bg: '#f3f4f6', text: '#374151' }
    return (
      <Badge style={{ backgroundColor: colors.bg, color: colors.text }}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  const currentFund = funds.find(f => f.id === selectedFund) || funds[0]

  const renderOverview = () => (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {fundMetrics.map((metric, index) => (
          <StandardizedKPICard
            key={index}
            {...metric}
            mode="traditional"
          />
        ))}
      </div>

      {/* Fund Selection */}
      <Card style={{ borderColor: DESIGN_SYSTEM.colors.traditional.border }}>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Building className="w-5 h-5 mr-2" style={{ color: DESIGN_SYSTEM.colors.traditional.icon }} />
            Fund Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 mb-4">
            <select 
              value={selectedFund} 
              onChange={(e) => setSelectedFund(e.target.value)}
              className="border rounded-lg px-3 py-2"
              style={{ borderColor: DESIGN_SYSTEM.colors.traditional.border }}
            >
              {funds.map((fund) => (
                <option key={fund.id} value={fund.id}>{fund.name}</option>
              ))}
            </select>
            {getStatusBadge(currentFund.status)}
            <Badge variant="outline">Vintage {currentFund.vintage}</Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-gray-900">{currentFund.committed}</div>
              <div className="text-sm text-gray-600">Committed</div>
              <div className="text-xs text-gray-500 mt-1">of {currentFund.targetSize} target</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{currentFund.called}</div>
              <div className="text-sm text-gray-600">Capital Called</div>
              <div className="text-xs text-gray-500 mt-1">{Math.round((parseFloat(currentFund.called.replace('$', '').replace('M', '')) / parseFloat(currentFund.committed.replace('$', '').replace('M', ''))) * 100)}% of committed</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-green-600">{currentFund.distributed}</div>
              <div className="text-sm text-gray-600">Distributed</div>
              <div className="text-xs text-gray-500 mt-1">DPI: {currentFund.dpi}</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{currentFund.netIRR}</div>
              <div className="text-sm text-gray-600">Net IRR</div>
              <div className="text-xs text-gray-500 mt-1">TVPI: {currentFund.tvpi}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card style={{ borderColor: DESIGN_SYSTEM.colors.traditional.border }}>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CreditCard className="w-5 h-5 mr-2" style={{ color: DESIGN_SYSTEM.colors.traditional.icon }} />
              Recent Capital Calls
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {capitalCalls.slice(0, 3).map((call) => (
                <div key={call.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium text-sm">{call.fundName}</div>
                    <div className="text-xs text-gray-500">{call.purpose}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      Due: {call.dueDate} • {call.respondedLPs}/{call.totalLPs} responded
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">{call.amount}</div>
                    {getStatusBadge(call.status)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card style={{ borderColor: DESIGN_SYSTEM.colors.traditional.border }}>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Banknote className="w-5 h-5 mr-2" style={{ color: DESIGN_SYSTEM.colors.traditional.icon }} />
              Recent Distributions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {distributions.slice(0, 3).map((dist) => (
                <div key={dist.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium text-sm">{dist.fundName}</div>
                    <div className="text-xs text-gray-500">{dist.source}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {dist.date} • {dist.lpPayments} LP payments
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-green-600">{dist.amount}</div>
                    {getStatusBadge(dist.status)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  const renderFunds = () => (
    <div className="space-y-4">
      {/* Search and Filters */}
      <StandardizedSearchFilter
        mode="traditional"
        onSearch={setSearchQuery}
        onFilterChange={setSelectedFilters}
        searchPlaceholder="Search funds..."
        availableFilters={[
          { id: 'status-investing', label: 'Investing', category: 'Status' },
          { id: 'status-harvesting', label: 'Harvesting', category: 'Status' },
          { id: 'vintage-2022', label: '2022 Vintage', category: 'Vintage' },
          { id: 'vintage-2021', label: '2021 Vintage', category: 'Vintage' },
          { id: 'vintage-2020', label: '2020 Vintage', category: 'Vintage' }
        ]}
      />

      {/* Funds List */}
      <Card style={{ borderColor: DESIGN_SYSTEM.colors.traditional.border }}>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center">
            <Briefcase className="w-5 h-5 mr-2" style={{ color: DESIGN_SYSTEM.colors.traditional.icon }} />
            Funds ({funds.length})
          </CardTitle>
          <Button style={{ backgroundColor: DESIGN_SYSTEM.colors.traditional.primary }}>
            <Plus className="w-4 h-4 mr-2" />
            New Fund
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {funds.map((fund) => (
              <div
                key={fund.id}
                className="border rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                style={{ borderColor: DESIGN_SYSTEM.colors.traditional.border }}
                onClick={() => onViewFund?.(fund.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-semibold text-lg">{fund.name}</h3>
                      {getStatusBadge(fund.status)}
                      <Badge variant="outline">Vintage {fund.vintage}</Badge>
                      <Badge variant="outline">{fund.lpCount} LPs</Badge>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Target Size:</span>
                        <div className="font-medium">{fund.targetSize}</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Committed:</span>
                        <div className="font-medium">{fund.committed}</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Called:</span>
                        <div className="font-medium">{fund.called}</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Distributed:</span>
                        <div className="font-medium text-green-600">{fund.distributed}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-6 mt-3 text-sm">
                      <div className="flex items-center space-x-1">
                        <TrendingUp className="w-3 h-3 text-gray-400" />
                        <span>IRR: {fund.netIRR}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Target className="w-3 h-3 text-gray-400" />
                        <span>DPI: {fund.dpi}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <BarChart3 className="w-3 h-3 text-gray-400" />
                        <span>TVPI: {fund.tvpi}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <FileText className="w-4 h-4" />
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

  const renderCapitalCalls = () => (
    <div className="space-y-4">
      <Card style={{ borderColor: DESIGN_SYSTEM.colors.traditional.border }}>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center">
            <CreditCard className="w-5 h-5 mr-2" style={{ color: DESIGN_SYSTEM.colors.traditional.icon }} />
            Capital Calls Management
          </CardTitle>
          <Button onClick={onCreateCapitalCall} style={{ backgroundColor: DESIGN_SYSTEM.colors.traditional.primary }}>
            <Plus className="w-4 h-4 mr-2" />
            Create Capital Call
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {capitalCalls.map((call) => (
              <div
                key={call.id}
                className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                style={{ borderColor: DESIGN_SYSTEM.colors.traditional.border }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-semibold">{call.fundName}</h3>
                      {getStatusBadge(call.status)}
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Amount:</span>
                        <div className="font-medium text-lg">{call.amount}</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Call Date:</span>
                        <div className="font-medium">{call.callDate}</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Due Date:</span>
                        <div className="font-medium">{call.dueDate}</div>
                      </div>
                      <div>
                        <span className="text-gray-500">LP Response:</span>
                        <div className="font-medium">{call.respondedLPs}/{call.totalLPs}</div>
                        <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
                          <div className="bg-blue-500 h-1 rounded-full" style={{ width: `${(call.respondedLPs / call.totalLPs) * 100}%` }}></div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-3">
                      <span className="text-gray-500 text-sm">Purpose: </span>
                      <span className="text-sm font-medium">{call.purpose}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Send className="w-4 h-4" />
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Fund Operations</h1>
        <p className="text-gray-600">
          Complete fund management including capital calls, distributions, and LP relations
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
            variant={activeView === 'funds' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveView('funds')}
            className="flex items-center space-x-2"
          >
            <Briefcase className="w-4 h-4" />
            <span>Funds</span>
          </Button>
          <Button
            variant={activeView === 'capital-calls' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveView('capital-calls')}
            className="flex items-center space-x-2"
          >
            <CreditCard className="w-4 h-4" />
            <span>Capital Calls</span>
          </Button>
          <Button
            variant={activeView === 'distributions' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setActiveView('distributions')}
            className="flex items-center space-x-2"
          >
            <Banknote className="w-4 h-4" />
            <span>Distributions</span>
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-6">
        {activeView === 'overview' && renderOverview()}
        {activeView === 'funds' && renderFunds()}
        {activeView === 'capital-calls' && renderCapitalCalls()}
        {activeView === 'distributions' && (
          <div className="text-center py-12">
            <Banknote className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600">Distribution Management</h3>
            <p className="text-gray-500">Process and track fund distributions to LPs</p>
            <Badge variant="outline" className="mt-2">Coming Soon</Badge>
          </div>
        )}
      </div>
    </div>
  )
}