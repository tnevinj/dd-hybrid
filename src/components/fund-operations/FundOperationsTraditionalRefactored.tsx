/**
 * Comprehensive Fund Operations Traditional Component
 * Matches portfolio/deal screening depth with sophisticated fund management capabilities
 */

'use client'

import React, { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { Input } from '@/components/ui/input'
import { 
  TrendingUp, 
  TrendingDown,
  DollarSign, 
  Calculator, 
  Users, 
  Calendar,
  BarChart3,
  CreditCard,
  Banknote,
  FileText,
  Eye,
  Edit,
  Send,
  Plus,
  Download,
  User,
  Building,
  Activity,
  Target,
  AlertTriangle,
  CheckCircle,
  Clock,
  Zap,
  PieChart,
  LineChart,
  Award,
  Settings,
  Search
} from 'lucide-react'
import type { TraditionalModeProps } from '@/types/shared'

export function FundOperationsTraditionalRefactored({ 
  onSwitchMode 
}: TraditionalModeProps) {
  const [activeTab, setActiveTab] = useState('overview')
  const [selectedFund, setSelectedFund] = useState('growth-fund-iii')
  const [selectedTimeframe, setSelectedTimeframe] = useState('12m')
  
  // Comprehensive mock data matching other modules' depth
  const fundOperationsData = useMemo(() => ({
    totalFunds: 8,
    totalAUM: 3200000000, // $3.2B
    totalCommitments: 3800000000, // $3.8B
    totalCalled: 2100000000, // $2.1B
    totalDeployed: 1950000000, // $1.95B
    totalDistributed: 890000000, // $890M
    currentNAV: 2450000000, // $2.45B
    activeFunds: 6,
    avgNetIRR: 18.4,
    avgGrossIRR: 22.1,
    avgMOIC: 2.1,
    navCalculationsToday: 8,
    distributionsProcessed: 23,
    capitalCallsIssued: 5,
    complianceReports: 47,
    processingEfficiency: 94.2,
    reportingAccuracy: 99.3
  }), [])

  const funds = useMemo(() => ([
    {
      id: 'growth-fund-iii',
      name: 'Growth Fund III',
      type: 'Growth Equity',
      vintage: 2021,
      targetSize: 800000000,
      commitments: 850000000,
      called: 510000000,
      deployed: 485000000,
      nav: 642000000,
      distributed: 180000000,
      investors: 45,
      investmentCount: 23,
      status: 'Active',
      netIRR: 24.7,
      grossIRR: 28.2,
      moic: 1.61,
      dpi: 0.35,
      tvpi: 1.96,
      lastNavDate: '2024-01-20',
      strategy: 'Technology growth investments',
      geography: 'North America',
      stage: 'Growth',
      managementFeeRate: 2.0,
      carriedInterestRate: 20.0
    },
    {
      id: 'infrastructure-fund-i',
      name: 'Infrastructure Fund I',
      type: 'Infrastructure',
      vintage: 2020,
      targetSize: 1200000000,
      commitments: 1250000000,
      called: 750000000,
      deployed: 720000000,
      nav: 845000000,
      distributed: 285000000,
      investors: 32,
      investmentCount: 18,
      status: 'Active',
      netIRR: 16.3,
      grossIRR: 19.8,
      moic: 1.51,
      dpi: 0.38,
      tvpi: 1.89,
      lastNavDate: '2024-01-20',
      strategy: 'Digital infrastructure and energy',
      geography: 'Global',
      stage: 'Core+',
      managementFeeRate: 1.75,
      carriedInterestRate: 20.0
    },
    {
      id: 'real-estate-fund-ii',
      name: 'Real Estate Fund II',
      type: 'Real Estate',
      vintage: 2019,
      targetSize: 600000000,
      commitments: 650000000,
      called: 520000000,
      deployed: 495000000,
      nav: 586000000,
      distributed: 195000000,
      investors: 28,
      investmentCount: 35,
      status: 'Active',
      netIRR: 14.2,
      grossIRR: 17.1,
      moic: 1.50,
      dpi: 0.38,
      tvpi: 1.88,
      lastNavDate: '2024-01-19',
      strategy: 'Commercial real estate',
      geography: 'US/Europe',
      stage: 'Value-add',
      managementFeeRate: 1.5,
      carriedInterestRate: 20.0
    },
    {
      id: 'venture-fund-iv',
      name: 'Venture Fund IV',
      type: 'Venture Capital',
      vintage: 2023,
      targetSize: 400000000,
      commitments: 420000000,
      called: 168000000,
      deployed: 142000000,
      nav: 155000000,
      distributed: 28000000,
      investors: 67,
      investmentCount: 42,
      status: 'Investing',
      netIRR: 8.9,
      grossIRR: 12.4,
      moic: 1.09,
      dpi: 0.17,
      tvpi: 1.26,
      lastNavDate: '2024-01-20',
      strategy: 'Early-stage technology',
      geography: 'Global',
      stage: 'Series A-B',
      managementFeeRate: 2.5,
      carriedInterestRate: 25.0
    },
    {
      id: 'buyout-fund-ii',
      name: 'Buyout Fund II',
      type: 'Buyout',
      vintage: 2018,
      targetSize: 2000000000,
      commitments: 2100000000,
      called: 1890000000,
      deployed: 1825000000,
      nav: 1850000000,
      distributed: 920000000,
      investors: 58,
      investmentCount: 16,
      status: 'Harvesting',
      netIRR: 19.8,
      grossIRR: 23.5,
      moic: 1.47,
      dpi: 0.49,
      tvpi: 1.96,
      lastNavDate: '2024-01-18',
      strategy: 'Mid-market buyouts',
      geography: 'North America',
      stage: 'Buyout',
      managementFeeRate: 1.75,
      carriedInterestRate: 20.0
    },
    {
      id: 'credit-fund-i',
      name: 'Credit Fund I',
      type: 'Credit',
      vintage: 2022,
      targetSize: 800000000,
      commitments: 850000000,
      called: 680000000,
      deployed: 665000000,
      nav: 695000000,
      distributed: 165000000,
      investors: 38,
      investmentCount: 78,
      status: 'Active',
      netIRR: 12.4,
      grossIRR: 15.1,
      moic: 1.26,
      dpi: 0.24,
      tvpi: 1.50,
      lastNavDate: '2024-01-20',
      strategy: 'Direct lending',
      geography: 'North America',
      stage: 'Senior debt',
      managementFeeRate: 1.25,
      carriedInterestRate: 15.0
    }
  ]), [])

  const capitalCalls = useMemo(() => ([
    {
      id: 'cc-001',
      fundId: 'growth-fund-iii',
      callNumber: 8,
      amount: 42000000,
      dueDate: '2024-04-15',
      issueDate: '2024-03-15',
      status: 'Issued',
      purpose: 'New investment - AI Platform Co',
      fundingRate: 0.85,
      fundedAmount: 35700000,
      investors: 45,
      noticesSent: 45,
      defaultRate: 0.02
    },
    {
      id: 'cc-002', 
      fundId: 'infrastructure-fund-i',
      callNumber: 12,
      amount: 58000000,
      dueDate: '2024-03-20',
      issueDate: '2024-02-18',
      status: 'Funded',
      purpose: 'Follow-on - Renewable Energy Assets',
      fundingRate: 0.98,
      fundedAmount: 56840000,
      investors: 32,
      noticesSent: 32,
      defaultRate: 0.01
    },
    {
      id: 'cc-003',
      fundId: 'real-estate-fund-ii',
      callNumber: 15,
      amount: 35000000,
      dueDate: '2024-02-28',
      issueDate: '2024-01-28',
      status: 'Funded',
      purpose: 'Acquisition - Urban Mixed-Use',
      fundingRate: 1.00,
      fundedAmount: 35000000,
      investors: 28,
      noticesSent: 28,
      defaultRate: 0.00
    }
  ]), [])

  const distributions = useMemo(() => ([
    {
      id: 'dist-001',
      fundId: 'buyout-fund-ii',
      distributionNumber: 18,
      amount: 125000000,
      date: '2024-03-20',
      type: 'Capital Gains',
      source: 'TechCorp Exit - IPO',
      status: 'Paid',
      taxWithheld: 8500000,
      netAmount: 116500000,
      moic: 3.2,
      irr: 28.4
    },
    {
      id: 'dist-002',
      fundId: 'infrastructure-fund-i', 
      distributionNumber: 8,
      amount: 45000000,
      date: '2024-03-15',
      type: 'Income',
      source: 'Portfolio dividend income',
      status: 'Paid',
      taxWithheld: 2700000,
      netAmount: 42300000,
      moic: 1.1,
      irr: 0.0
    },
    {
      id: 'dist-003',
      fundId: 'real-estate-fund-ii',
      distributionNumber: 12,
      amount: 32000000,
      date: '2024-02-28',
      type: 'Capital Gains',
      source: 'Commercial Property Sale',
      status: 'Paid',
      taxWithheld: 2240000,
      netAmount: 29760000,
      moic: 2.1,
      irr: 16.8
    }
  ]), [])

  const navReports = useMemo(() => ([
    {
      id: 'nav-q124',
      fundId: 'growth-fund-iii',
      period: 'Q1 2024',
      asOfDate: '2024-03-31',
      nav: 642000000,
      navPerShare: 755.29,
      returns: {
        qtd: 8.2,
        ytd: 8.2,
        sinceInception: 24.7
      },
      status: 'Published',
      publishDate: '2024-04-15',
      auditorReview: 'Complete',
      distributions: 0,
      capitalCalls: 42000000,
      valuationAdjustments: 18500000
    },
    {
      id: 'nav-q423',
      fundId: 'infrastructure-fund-i',
      period: 'Q4 2023', 
      asOfDate: '2023-12-31',
      nav: 845000000,
      navPerShare: 676.00,
      returns: {
        qtd: 6.8,
        ytd: 16.3,
        sinceInception: 16.3
      },
      status: 'Published',
      publishDate: '2024-01-31',
      auditorReview: 'Complete',
      distributions: 25000000,
      capitalCalls: 35000000,
      valuationAdjustments: 12800000
    }
  ]), [])

  const expenses = useMemo(() => ([
    {
      id: 'exp-001',
      fundId: 'growth-fund-iii',
      category: 'Legal',
      description: 'Legal fees - AI Platform Co acquisition',
      amount: 285000,
      date: '2024-03-15',
      vendor: 'Corporate Law Partners LLP',
      status: 'Approved',
      type: 'Investment-related',
      glAccount: '51100',
      approver: 'Investment Committee',
      expenseRatio: 0.035
    },
    {
      id: 'exp-002',
      fundId: 'infrastructure-fund-i',
      category: 'Audit',
      description: 'Annual audit fees - 2023',
      amount: 165000,
      date: '2024-02-28',
      vendor: 'Big Four Auditors',
      status: 'Paid',
      type: 'Fund-level',
      glAccount: '52200',
      approver: 'CFO',
      expenseRatio: 0.019
    },
    {
      id: 'exp-003', 
      fundId: 'real-estate-fund-ii',
      category: 'Consulting',
      description: 'Due diligence - Urban Mixed-Use',
      amount: 125000,
      date: '2024-01-28',
      vendor: 'Real Estate Advisory Group',
      status: 'Paid',
      type: 'Investment-related',
      glAccount: '51150',
      approver: 'Investment Committee',
      expenseRatio: 0.019
    }
  ]), [])

  const currentFund = funds.find(f => f.id === selectedFund)

  const formatCurrency = (value: number) => {
    if (value >= 1e9) return `$${(value / 1e9).toFixed(1)}B`
    if (value >= 1e6) return `$${(value / 1e6).toFixed(1)}M`
    if (value >= 1e3) return `$${(value / 1e3).toFixed(1)}K`
    return `$${value.toLocaleString()}`
  }

  const formatPercentage = (value: number) => `${value.toFixed(1)}%`

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <div className="flex items-center space-x-3">
            <h1 className="text-3xl font-bold text-gray-900">Fund Operations Platform</h1>
            <Badge className="bg-gray-100 text-gray-800 border border-gray-300 flex items-center space-x-1">
              <User className="h-3 w-3" />
              <span>Traditional Mode</span>
            </Badge>
          </div>
          <p className="text-gray-600 mt-1">Comprehensive fund administration, NAV calculations, and investor services</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Reports
          </Button>
          <Button className="bg-gray-700 hover:bg-gray-800">
            <Calculator className="h-4 w-4 mr-2" />
            Calculate NAV
          </Button>
        </div>
      </div>

      {/* Enhanced KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
        <Card className="border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2 mb-2">
              <DollarSign className="h-5 w-5 text-blue-600" />
              <p className="text-sm text-gray-600 font-medium">Total AUM</p>
            </div>
            <p className="text-3xl font-bold text-gray-900">{formatCurrency(fundOperationsData.totalAUM)}</p>
            <div className="flex items-center text-sm text-gray-500 mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              <span>+12.4% YTD</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2 mb-2">
              <Building className="h-5 w-5 text-green-600" />
              <p className="text-sm text-gray-600 font-medium">Active Funds</p>
            </div>
            <p className="text-3xl font-bold text-gray-900">{fundOperationsData.activeFunds}</p>
            <div className="flex items-center text-sm text-gray-500 mt-1">
              <Users className="h-3 w-3 mr-1" />
              <span>248 investors</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2 mb-2">
              <Calculator className="h-5 w-5 text-purple-600" />
              <p className="text-sm text-gray-600 font-medium">Avg Net IRR</p>
            </div>
            <p className="text-3xl font-bold text-gray-900">{formatPercentage(fundOperationsData.avgNetIRR)}</p>
            <div className="flex items-center text-sm text-gray-500 mt-1">
              <Award className="h-3 w-3 mr-1" />
              <span>Top quartile</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2 mb-2">
              <Banknote className="h-5 w-5 text-emerald-600" />
              <p className="text-sm text-gray-600 font-medium">Distributed</p>
            </div>
            <p className="text-3xl font-bold text-gray-900">{formatCurrency(fundOperationsData.totalDistributed)}</p>
            <div className="flex items-center text-sm text-gray-500 mt-1">
              <Activity className="h-3 w-3 mr-1" />
              <span>23 this quarter</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2 mb-2">
              <Target className="h-5 w-5 text-orange-600" />
              <p className="text-sm text-gray-600 font-medium">NAV Accuracy</p>
            </div>
            <p className="text-3xl font-bold text-gray-900">{formatPercentage(fundOperationsData.reportingAccuracy)}</p>
            <div className="flex items-center text-sm text-gray-500 mt-1">
              <CheckCircle className="h-3 w-3 mr-1" />
              <span>No errors</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2 mb-2">
              <Zap className="h-5 w-5 text-indigo-600" />
              <p className="text-sm text-gray-600 font-medium">Processing</p>
            </div>
            <p className="text-3xl font-bold text-gray-900">{formatPercentage(fundOperationsData.processingEfficiency)}</p>
            <div className="flex items-center text-sm text-gray-500 mt-1">
              <Clock className="h-3 w-3 mr-1" />
              <span>Efficiency</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Fund Selection and Quick Actions */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium text-gray-700">Selected Fund:</label>
          <select
            value={selectedFund}
            onChange={(e) => setSelectedFund(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {funds.map(fund => (
              <option key={fund.id} value={fund.id}>
                {fund.name} (Vintage {fund.vintage})
              </option>
            ))}
          </select>
        </div>
        
        <div className="flex space-x-3">
          <Button variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            New Capital Call
          </Button>
          <Button variant="outline">
            <Send className="h-4 w-4 mr-2" />
            Process Distribution
          </Button>
          <Button>
            <Calculator className="h-4 w-4 mr-2" />
            Generate NAV
          </Button>
        </div>
      </div>

      {/* Current Fund Overview */}
      {currentFund && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-blue-900">Fund Overview</h3>
                <Badge variant={currentFund.status === 'Active' ? 'default' : 'secondary'}>
                  {currentFund.status}
                </Badge>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-blue-700">Target Size</span>
                  <span className="text-sm font-medium text-blue-900">{formatCurrency(currentFund.targetSize)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-blue-700">Commitments</span>
                  <span className="text-sm font-medium text-blue-900">{formatCurrency(currentFund.commitments)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-blue-700">Called</span>
                  <span className="text-sm font-medium text-blue-900">{formatCurrency(currentFund.called)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-blue-700">Deployed</span>
                  <span className="text-sm font-medium text-blue-900">{formatCurrency(currentFund.deployed)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-green-200 bg-green-50">
            <CardContent className="p-6">
              <h3 className="font-semibold text-green-900 mb-4">Performance Metrics</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-green-700">Current NAV</span>
                  <span className="text-sm font-medium text-green-900">{formatCurrency(currentFund.nav)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-green-700">Net IRR</span>
                  <span className="text-sm font-medium text-green-900">{formatPercentage(currentFund.netIRR)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-green-700">MOIC</span>
                  <span className="text-sm font-medium text-green-900">{currentFund.moic.toFixed(2)}x</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-green-700">DPI</span>
                  <span className="text-sm font-medium text-green-900">{currentFund.dpi.toFixed(2)}x</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-purple-200 bg-purple-50">
            <CardContent className="p-6">
              <h3 className="font-semibold text-purple-900 mb-4">Fund Structure</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-purple-700">Strategy</span>
                  <span className="text-sm font-medium text-purple-900">{currentFund.strategy}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-purple-700">Geography</span>
                  <span className="text-sm font-medium text-purple-900">{currentFund.geography}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-purple-700">Mgmt Fee</span>
                  <span className="text-sm font-medium text-purple-900">{formatPercentage(currentFund.managementFeeRate)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-purple-700">Carry</span>
                  <span className="text-sm font-medium text-purple-900">{formatPercentage(currentFund.carriedInterestRate)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-orange-200 bg-orange-50">
            <CardContent className="p-6">
              <h3 className="font-semibold text-orange-900 mb-4">Capital Deployment</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-orange-700">Deployment Rate</span>
                    <span className="text-sm text-orange-900">
                      {formatPercentage((currentFund.deployed / currentFund.called) * 100)}
                    </span>
                  </div>
                  <Progress value={(currentFund.deployed / currentFund.called) * 100} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-orange-700">Call Rate</span>
                    <span className="text-sm text-orange-900">
                      {formatPercentage((currentFund.called / currentFund.commitments) * 100)}
                    </span>
                  </div>
                  <Progress value={(currentFund.called / currentFund.commitments) * 100} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Comprehensive Tabs Interface */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="capital-calls">Capital Calls</TabsTrigger>
          <TabsTrigger value="distributions">Distributions</TabsTrigger>
          <TabsTrigger value="nav-reports">NAV Reports</TabsTrigger>
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

export default FundOperationsTraditionalRefactored