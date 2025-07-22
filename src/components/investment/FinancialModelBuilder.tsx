'use client'

import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useNavigationStore } from '@/stores/navigation-store'
import { useDueDiligenceContext } from '@/contexts/DueDiligenceContext'
import { DueDiligenceProject, DueDiligenceDocument, AIInsight } from '@/types/due-diligence'
import { 
  Calculator,
  Brain,
  Sparkles,
  Clock,
  CheckCircle,
  AlertTriangle,
  Users,
  Building,
  DollarSign,
  TrendingUp,
  Target,
  Calendar,
  Edit3,
  Download,
  Share,
  Eye,
  Plus,
  Minus,
  ChevronRight,
  ChevronDown,
  Settings,
  RefreshCw,
  Save,
  Upload,
  Database,
  BarChart3,
  PieChart,
  LineChart,
  Globe,
  Award,
  Briefcase,
  Lightbulb,
  Zap,
  Star,
  ArrowRight,
  Filter,
  Search,
  MoreHorizontal,
  Copy,
  Trash2,
  History,
  MessageSquare,
  Link,
  Table,
  Percent,
  FileSpreadsheet,
  Formula,
  Grid3x3,
  Layers,
  TrendingDown,
  RotateCcw,
  PlayCircle,
  PauseCircle,
  StopCircle
} from 'lucide-react'

// Financial Model Types - Ported from secondary-edge-nextjs
interface FinancialModel {
  id: string
  projectId?: string
  companyName: string
  modelType: 'dcf' | 'lbo' | 'trading_comps' | 'transaction_comps' | 'sum_of_parts' | 'monte_carlo'
  status: 'draft' | 'in_progress' | 'review' | 'approved' | 'archived'
  
  // Model structure
  structure: {
    timeHorizon: number // years
    projectionPeriod: number // explicit forecast years
    terminalGrowthRate: number
    discountRate: number
    currency: string
    fiscalYearEnd: string
  }
  
  // Core financial statements
  statements: {
    incomeStatement: IncomeStatementModel
    balanceSheet: BalanceSheetModel
    cashFlowStatement: CashFlowModel
  }
  
  // Valuation outputs
  valuation: {
    dcfValue: number
    terminalValue: number
    enterpriseValue: number
    equityValue: number
    sharePrice: number
    impliedMultiples: {
      evRevenue: number
      evEbitda: number
      peRatio: number
    }
  }
  
  // Scenario analysis
  scenarios: {
    base: ScenarioInputs
    upside: ScenarioInputs
    downside: ScenarioInputs
    stress: ScenarioInputs
  }
  
  // Sensitivity analysis
  sensitivity: {
    variables: SensitivityVariable[]
    outputs: SensitivityOutput[]
  }
  
  // AI assistance
  aiAssistance: {
    autoPopulated: string[] // which sections were AI-generated
    benchmarkData: BenchmarkData[]
    suggestions: ModelSuggestion[]
    confidenceLevel: number
    lastAiUpdate: Date
  }
  
  // Collaboration
  team: {
    author: string
    contributors: string[]
    reviewers: string[]
    approvers: string[]
  }
  
  // Version control
  version: string
  createdAt: Date
  lastModified: Date
  dueDate?: Date
  
  // Source data integration
  sourceDocuments: {
    name: string
    type: string
    dataPoints: ExtractedDataPoint[]
    confidence: number
  }[]
}

interface IncomeStatementModel {
  revenue: ModelLine
  cogs: ModelLine
  grossProfit: ModelLine
  opex: {
    salesMarketing: ModelLine
    researchDevelopment: ModelLine
    generalAdmin: ModelLine
    depreciation: ModelLine
    other: ModelLine
  }
  ebit: ModelLine
  interest: ModelLine
  ebt: ModelLine
  taxes: ModelLine
  netIncome: ModelLine
}

interface BalanceSheetModel {
  assets: {
    cash: ModelLine
    accountsReceivable: ModelLine
    inventory: ModelLine
    otherCurrentAssets: ModelLine
    totalCurrentAssets: ModelLine
    ppe: ModelLine
    goodwill: ModelLine
    intangibleAssets: ModelLine
    otherAssets: ModelLine
    totalAssets: ModelLine
  }
  liabilities: {
    accountsPayable: ModelLine
    accruedExpenses: ModelLine
    shortTermDebt: ModelLine
    otherCurrentLiabilities: ModelLine
    totalCurrentLiabilities: ModelLine
    longTermDebt: ModelLine
    otherLiabilities: ModelLine
    totalLiabilities: ModelLine
  }
  equity: {
    shareCapital: ModelLine
    retainedEarnings: ModelLine
    otherEquity: ModelLine
    totalEquity: ModelLine
  }
}

interface CashFlowModel {
  operatingCashFlow: {
    netIncome: ModelLine
    depreciation: ModelLine
    workingCapitalChange: ModelLine
    otherOperating: ModelLine
    totalOperatingCF: ModelLine
  }
  investingCashFlow: {
    capex: ModelLine
    acquisitions: ModelLine
    otherInvesting: ModelLine
    totalInvestingCF: ModelLine
  }
  financingCashFlow: {
    debtIssuance: ModelLine
    debtRepayment: ModelLine
    equityIssuance: ModelLine
    dividends: ModelLine
    otherFinancing: ModelLine
    totalFinancingCF: ModelLine
  }
  netCashFlow: ModelLine
  endingCash: ModelLine
}

interface ModelLine {
  label: string
  values: number[] // values for each year
  formula?: string
  isCalculated: boolean
  aiGenerated: boolean
  confidence?: number
  notes?: string
}

interface ScenarioInputs {
  revenueGrowth: number[]
  ebitdaMargin: number[]
  capexAsPercentRevenue: number
  terminalGrowthRate: number
  discountRate: number
  customInputs: { [key: string]: number[] }
}

interface SensitivityVariable {
  name: string
  baseCase: number
  range: { min: number; max: number; step: number }
}

interface SensitivityOutput {
  variable1: string
  variable2: string
  results: number[][] // 2D array of results
}

interface BenchmarkData {
  metric: string
  companyValue: number
  industryMedian: number
  industryRange: { min: number; max: number }
  source: string
}

interface ModelSuggestion {
  section: string
  suggestion: string
  rationale: string
  impact: 'low' | 'medium' | 'high'
  confidence: number
}

interface ExtractedDataPoint {
  label: string
  value: number
  year?: number
  source: string
  confidence: number
}

interface ModelTemplate {
  id: string
  name: string
  description: string
  modelType: FinancialModel['modelType']
  industry: string[]
  complexity: 'basic' | 'intermediate' | 'advanced'
  estimatedTime: number // hours
  sections: string[]
}

interface FinancialModelBuilderProps {
  projectId?: string
  dealId?: string
}

export function FinancialModelBuilder({ projectId, dealId }: FinancialModelBuilderProps) {
  const { currentMode, trackInteraction, addRecommendation } = useNavigationStore()
  const { projects, documents, findings } = useDueDiligenceContext()
  
  const [selectedModel, setSelectedModel] = React.useState<string | null>(null)
  const [selectedSection, setSelectedSection] = React.useState<string>('overview')
  const [viewMode, setViewMode] = React.useState<'builder' | 'spreadsheet' | 'charts' | 'scenarios'>('builder')
  const [runningScenario, setRunningScenario] = React.useState(false)
  const [selectedTemplate, setSelectedTemplate] = React.useState<string | null>(null)

  // Model templates from secondary-edge-nextjs
  const [modelTemplates] = React.useState<ModelTemplate[]>([
    {
      id: 'dcf-growth',
      name: 'DCF - Growth Equity',
      description: 'Comprehensive DCF model for growth equity investments',
      modelType: 'dcf',
      industry: ['software', 'technology', 'healthcare'],
      complexity: 'intermediate',
      estimatedTime: 8,
      sections: ['assumptions', 'income_statement', 'balance_sheet', 'cash_flow', 'dcf_valuation', 'sensitivity']
    },
    {
      id: 'lbo-buyout',
      name: 'LBO - Buyout Model',
      description: 'Leveraged buyout model with detailed debt structure',
      modelType: 'lbo',
      industry: ['industrials', 'consumer', 'business_services'],
      complexity: 'advanced',
      estimatedTime: 12,
      sections: ['assumptions', 'historical', 'projections', 'debt_schedule', 'returns_analysis', 'sensitivity']
    },
    {
      id: 'trading-comps',
      name: 'Trading Comparables',
      description: 'Market-based valuation using trading multiples',
      modelType: 'trading_comps',
      industry: ['all'],
      complexity: 'basic',
      estimatedTime: 4,
      sections: ['comp_selection', 'financial_data', 'multiples_analysis', 'valuation_range']
    },
    {
      id: 'transaction-comps',
      name: 'Transaction Comparables',
      description: 'Precedent transaction analysis for valuation',
      modelType: 'transaction_comps',
      industry: ['all'],
      complexity: 'intermediate',
      estimatedTime: 6,
      sections: ['transaction_selection', 'deal_metrics', 'multiples_analysis', 'valuation_range']
    }
  ])

  // Sample financial models
  const [financialModels] = React.useState<FinancialModel[]>([
    {
      id: 'model-001',
      projectId: 'proj-001',
      companyName: 'CloudTech Solutions',
      modelType: 'dcf',
      status: 'in_progress',
      structure: {
        timeHorizon: 10,
        projectionPeriod: 5,
        terminalGrowthRate: 2.5,
        discountRate: 12.0,
        currency: 'USD',
        fiscalYearEnd: 'December'
      },
      statements: {
        incomeStatement: {
          revenue: {
            label: 'Revenue',
            values: [8000000, 12000000, 18000000, 25000000, 34000000],
            formula: 'Prior Year * (1 + Growth Rate)',
            isCalculated: true,
            aiGenerated: true,
            confidence: 0.87,
            notes: 'Based on historical growth and management guidance'
          },
          cogs: {
            label: 'Cost of Goods Sold',
            values: [2400000, 3600000, 5400000, 7500000, 10200000],
            formula: 'Revenue * COGS %',
            isCalculated: true,
            aiGenerated: true,
            confidence: 0.82
          },
          grossProfit: {
            label: 'Gross Profit',
            values: [5600000, 8400000, 12600000, 17500000, 23800000],
            formula: 'Revenue - COGS',
            isCalculated: true,
            aiGenerated: false
          },
          opex: {
            salesMarketing: {
              label: 'Sales & Marketing',
              values: [2800000, 3600000, 4500000, 5500000, 6800000],
              isCalculated: true,
              aiGenerated: true,
              confidence: 0.75
            },
            researchDevelopment: {
              label: 'R&D',
              values: [1200000, 1800000, 2700000, 3750000, 5100000],
              isCalculated: true,
              aiGenerated: true,
              confidence: 0.79
            },
            generalAdmin: {
              label: 'G&A',
              values: [800000, 1200000, 1800000, 2500000, 3400000],
              isCalculated: true,
              aiGenerated: false
            },
            depreciation: {
              label: 'Depreciation',
              values: [200000, 300000, 450000, 625000, 850000],
              isCalculated: true,
              aiGenerated: false
            },
            other: {
              label: 'Other OpEx',
              values: [400000, 600000, 900000, 1250000, 1700000],
              isCalculated: false,
              aiGenerated: false
            }
          },
          ebit: {
            label: 'EBIT',
            values: [200000, 900000, 2250000, 4875000, 6950000],
            formula: 'Gross Profit - Total OpEx',
            isCalculated: true,
            aiGenerated: false
          },
          interest: {
            label: 'Interest Expense',
            values: [50000, 75000, 100000, 125000, 150000],
            isCalculated: false,
            aiGenerated: false
          },
          ebt: {
            label: 'EBT',
            values: [150000, 825000, 2150000, 4750000, 6800000],
            formula: 'EBIT - Interest',
            isCalculated: true,
            aiGenerated: false
          },
          taxes: {
            label: 'Taxes',
            values: [37500, 206250, 537500, 1187500, 1700000],
            formula: 'EBT * Tax Rate',
            isCalculated: true,
            aiGenerated: false
          },
          netIncome: {
            label: 'Net Income',
            values: [112500, 618750, 1612500, 3562500, 5100000],
            formula: 'EBT - Taxes',
            isCalculated: true,
            aiGenerated: false
          }
        },
        balanceSheet: {} as BalanceSheetModel, // Simplified for brevity
        cashFlowStatement: {} as CashFlowModel
      },
      valuation: {
        dcfValue: 85000000,
        terminalValue: 62000000,
        enterpriseValue: 98000000,
        equityValue: 93000000,
        sharePrice: 46.50,
        impliedMultiples: {
          evRevenue: 3.9,
          evEbitda: 14.1,
          peRatio: 18.2
        }
      },
      scenarios: {
        base: {
          revenueGrowth: [50, 50, 39, 36, 35],
          ebitdaMargin: [15, 20, 25, 28, 30],
          capexAsPercentRevenue: 5,
          terminalGrowthRate: 2.5,
          discountRate: 12.0,
          customInputs: {}
        },
        upside: {
          revenueGrowth: [60, 55, 45, 40, 38],
          ebitdaMargin: [18, 25, 30, 32, 35],
          capexAsPercentRevenue: 4,
          terminalGrowthRate: 3.0,
          discountRate: 11.0,
          customInputs: {}
        },
        downside: {
          revenueGrowth: [35, 40, 30, 25, 20],
          ebitdaMargin: [10, 15, 18, 22, 25],
          capexAsPercentRevenue: 7,
          terminalGrowthRate: 2.0,
          discountRate: 14.0,
          customInputs: {}
        },
        stress: {
          revenueGrowth: [20, 25, 15, 10, 5],
          ebitdaMargin: [5, 8, 12, 15, 18],
          capexAsPercentRevenue: 8,
          terminalGrowthRate: 1.5,
          discountRate: 16.0,
          customInputs: {}
        }
      },
      sensitivity: {
        variables: [
          { name: 'Discount Rate', baseCase: 12.0, range: { min: 8.0, max: 16.0, step: 0.5 } },
          { name: 'Terminal Growth Rate', baseCase: 2.5, range: { min: 1.0, max: 4.0, step: 0.25 } }
        ],
        outputs: []
      },
      aiAssistance: {
        autoPopulated: ['revenue', 'cogs', 'opex', 'market_data'],
        benchmarkData: [
          {
            metric: 'Revenue Growth Rate',
            companyValue: 42.5,
            industryMedian: 28.0,
            industryRange: { min: 15.0, max: 55.0 },
            source: 'PitchBook Data'
          },
          {
            metric: 'EBITDA Margin',
            companyValue: 22.0,
            industryMedian: 18.5,
            industryRange: { min: 8.0, max: 35.0 },
            source: 'Capital IQ'
          }
        ],
        suggestions: [
          {
            section: 'assumptions',
            suggestion: 'Consider more conservative revenue growth in years 4-5',
            rationale: 'Historical data shows growth typically moderates as companies scale',
            impact: 'medium',
            confidence: 0.84
          }
        ],
        confidenceLevel: 0.83,
        lastAiUpdate: new Date('2025-07-20T14:30:00')
      },
      team: {
        author: 'David Kim',
        contributors: ['Sarah Johnson', 'Michael Chen'],
        reviewers: ['Partner Jane Smith'],
        approvers: ['Investment Committee']
      },
      version: '2.3',
      createdAt: new Date('2025-07-15T09:00:00'),
      lastModified: new Date('2025-07-20T14:30:00'),
      dueDate: new Date('2025-07-25T17:00:00'),
      sourceDocuments: [
        {
          name: 'CloudTech_Financials_2022_2024.xlsx',
          type: 'Historical Financials',
          dataPoints: [
            { label: 'Revenue 2024', value: 8000000, source: 'Audited Statements', confidence: 0.95 },
            { label: 'EBITDA 2024', value: 1200000, source: 'Management Reports', confidence: 0.87 }
          ],
          confidence: 0.91
        }
      ]
    },
    {
      id: 'model-002',
      companyName: 'HealthTech Innovations',
      modelType: 'lbo',
      status: 'review',
      structure: {
        timeHorizon: 7,
        projectionPeriod: 5,
        terminalGrowthRate: 2.0,
        discountRate: 14.0,
        currency: 'USD',
        fiscalYearEnd: 'December'
      },
      statements: {} as any, // Simplified
      valuation: {
        dcfValue: 150000000,
        terminalValue: 95000000,
        enterpriseValue: 165000000,
        equityValue: 45000000,
        sharePrice: 22.50,
        impliedMultiples: {
          evRevenue: 2.8,
          evEbitda: 8.5,
          peRatio: 12.1
        }
      },
      scenarios: {} as any, // Simplified
      sensitivity: { variables: [], outputs: [] },
      aiAssistance: {
        autoPopulated: ['debt_structure', 'leverage_ratios', 'returns_analysis'],
        benchmarkData: [],
        suggestions: [],
        confidenceLevel: 0.76,
        lastAiUpdate: new Date('2025-07-19T11:00:00')
      },
      team: {
        author: 'Michael Chen',
        contributors: ['David Kim'],
        reviewers: ['Partner Jane Smith'],
        approvers: []
      },
      version: '1.8',
      createdAt: new Date('2025-07-10T10:00:00'),
      lastModified: new Date('2025-07-19T16:30:00'),
      sourceDocuments: []
    }
  ])

  // AI recommendations
  React.useEffect(() => {
    if (currentMode.mode !== 'traditional') {
      const incompleteModels = financialModels.filter(model => model.status !== 'approved')
      
      if (incompleteModels.length > 0) {
        addRecommendation({
          id: `incomplete-models-${dealId}`,
          type: 'automation',
          priority: 'high',
          title: `${incompleteModels.length} Models Need Completion`,
          description: 'AI can help complete financial models using historical data and industry benchmarks.',
          actions: [{
            id: 'complete-models',
            label: 'AI Complete Models',
            action: 'AI_COMPLETE_MODELS',
            primary: true,
            estimatedTimeSaving: incompleteModels.length * 240
          }],
          confidence: 0.89,
          moduleContext: 'financial_modeling',
          timestamp: new Date()
        })
      }

      // Template recommendation for new models
      if (financialModels.length === 0 || (dealId && !financialModels.find(m => m.projectId === dealId))) {
        addRecommendation({
          id: `new-model-template-${dealId}`,
          type: 'insight',
          priority: 'medium',
          title: 'Start with AI-Powered Model Template',
          description: 'AI can pre-populate financial models using available due diligence data and industry benchmarks.',
          actions: [{
            id: 'create-ai-model',
            label: 'Create AI Model',
            action: 'CREATE_AI_MODEL'
          }],
          confidence: 0.86,
          moduleContext: 'financial_modeling',
          timestamp: new Date()
        })
      }

      // Data integration opportunities
      if (documents && documents.length > 0) {
        const financialDocs = documents.filter(doc => 
          doc.category === 'financial' && doc.status === 'processed'
        )
        
        if (financialDocs.length > 0) {
          addRecommendation({
            id: `integrate-financial-data-${dealId}`,
            type: 'automation',
            priority: 'medium',
            title: 'Integrate Financial Data',
            description: `${financialDocs.length} processed financial documents can be automatically integrated into models.`,
            actions: [{
              id: 'integrate-data',
              label: 'AI Integrate Data',
              action: 'AI_INTEGRATE_FINANCIAL_DATA'
            }],
            confidence: 0.78,
            moduleContext: 'financial_modeling',
            timestamp: new Date()
          })
        }
      }
    }
  }, [currentMode.mode, dealId, addRecommendation, documents])

  const handleRunScenario = async (scenarioType: keyof FinancialModel['scenarios']) => {
    setRunningScenario(true)
    trackInteraction({
      interactionType: 'automation_approved',
      userAction: 'accepted',
      module: 'financial_modeling',
      context: {
        action: 'run_scenario',
        scenario: scenarioType,
        modelId: selectedModel
      }
    })

    // Simulate model calculation
    setTimeout(() => {
      setRunningScenario(false)
    }, 4000)
  }

  const handleCreateModel = () => {
    trackInteraction({
      interactionType: 'feature_used',
      userAction: 'clicked',
      module: 'financial_modeling',
      context: {
        action: 'create_model',
        template: selectedTemplate
      }
    })
  }

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000000) {
      return `$${(amount / 1000000000).toFixed(1)}B`
    } else if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`
    } else if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(0)}K`
    }
    return `$${amount.toLocaleString()}`
  }

  const getStatusColor = (status: FinancialModel['status']) => {
    switch (status) {
      case 'draft': return 'text-gray-600 bg-gray-50'
      case 'in_progress': return 'text-blue-600 bg-blue-50'
      case 'review': return 'text-orange-600 bg-orange-50'
      case 'approved': return 'text-green-600 bg-green-50'
      case 'archived': return 'text-purple-600 bg-purple-50'
    }
  }

  const renderModelCard = (model: FinancialModel) => (
    <Card 
      key={model.id}
      className={`cursor-pointer transition-all hover:shadow-md ${selectedModel === model.id ? 'ring-2 ring-blue-500' : ''} ${model.aiAssistance.autoPopulated.length > 0 ? 'border-l-4 border-l-purple-400' : ''}`}
      onClick={() => setSelectedModel(model.id)}
    >
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">{model.companyName}</CardTitle>
            <p className="text-sm text-gray-600">
              {model.modelType.toUpperCase()} Model • {model.structure.projectionPeriod}Y Projection • {formatCurrency(model.valuation.equityValue)} Equity Value
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Badge className={`text-xs ${getStatusColor(model.status)}`}>
              {model.status.replace('_', ' ')}
            </Badge>
            {model.aiAssistance.autoPopulated.length > 0 && (
              <Badge variant="ai" className="text-xs">
                AI: {Math.round(model.aiAssistance.confidenceLevel * 100)}%
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-3">
          {/* Key Valuation Metrics */}
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Enterprise Value</span>
              <div className="font-medium">{formatCurrency(model.valuation.enterpriseValue)}</div>
            </div>
            <div>
              <span className="text-gray-500">EV/EBITDA</span>
              <div className="font-medium">{model.valuation.impliedMultiples.evEbitda.toFixed(1)}x</div>
            </div>
            <div>
              <span className="text-gray-500">Due Date</span>
              <div className="font-medium">{model.dueDate?.toISOString().split('T')[0] || 'TBD'}</div>
            </div>
          </div>

          {/* AI Assistance Summary */}
          {model.aiAssistance.autoPopulated.length > 0 && currentMode.mode !== 'traditional' && (
            <div className="bg-purple-50 rounded p-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-purple-700">AI Populated: {model.aiAssistance.autoPopulated.length} sections</span>
                <Badge variant="ai" className="text-xs">
                  {Math.round(model.aiAssistance.confidenceLevel * 100)}% confidence
                </Badge>
              </div>
            </div>
          )}

          {/* Team and Version */}
          <div className="flex items-center justify-between text-xs">
            <div className="text-gray-500">
              Author: {model.team.author} • Contributors: {model.team.contributors.length}
            </div>
            <div className="text-gray-500">
              v{model.version} • {model.lastModified.toISOString().split('T')[0]}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  const renderModelBuilder = () => {
    const model = financialModels.find(m => m.id === selectedModel)
    if (!model) return null

    return (
      <div className="space-y-6">
        {/* Model Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">{model.companyName} Financial Model</h2>
            <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
              <span>{model.modelType.toUpperCase()} • {model.structure.projectionPeriod} Year Projection</span>
              <span>Version {model.version}</span>
              <span>Last updated: {model.lastModified.toISOString().split('T')[0]}</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <History className="w-4 h-4 mr-2" />
              Version History
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export Excel
            </Button>
            <Button size="sm">
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
          </div>
        </div>

        {/* View Mode Toggle */}
        <div className="flex space-x-2">
          {[
            { id: 'builder', label: 'Builder', icon: Calculator },
            { id: 'spreadsheet', label: 'Spreadsheet', icon: Table },
            { id: 'charts', label: 'Charts', icon: BarChart3 },
            { id: 'scenarios', label: 'Scenarios', icon: TrendingUp }
          ].map(({ id, label, icon: Icon }) => (
            <Button
              key={id}
              variant={viewMode === id ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode(id as any)}
            >
              <Icon className="w-4 h-4 mr-2" />
              {label}
            </Button>
          ))}
        </div>

        {/* Content based on view mode */}
        {viewMode === 'builder' && (
          <div className="grid grid-cols-4 gap-6">
            {/* Section Navigation */}
            <div className="col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Model Sections</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {['overview', 'assumptions', 'income_statement', 'balance_sheet', 'cash_flow', 'valuation', 'sensitivity'].map((section) => (
                      <button
                        key={section}
                        onClick={() => setSelectedSection(section)}
                        className={`w-full text-left p-2 rounded text-sm transition-colors ${
                          selectedSection === section 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'hover:bg-gray-100'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span>{section.replace('_', ' ').replace(/^./, str => str.toUpperCase())}</span>
                          {model.aiAssistance.autoPopulated.includes(section) && (
                            <Brain className="w-3 h-3 text-purple-500" />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* AI Assistant Panel */}
              {currentMode.mode !== 'traditional' && (
                <Card className="mt-4 border-purple-200">
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center">
                      <Brain className="w-4 h-4 mr-2 text-purple-500" />
                      AI Assistant
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 text-sm">
                      <div>
                        <span className="text-purple-700 font-medium">AI Populated: </span>
                        <span>{model.aiAssistance.autoPopulated.length} sections</span>
                      </div>
                      
                      <div>
                        <span className="text-purple-700 font-medium">Confidence: </span>
                        <Badge variant="ai" className="text-xs">
                          {Math.round(model.aiAssistance.confidenceLevel * 100)}%
                        </Badge>
                      </div>

                      {model.aiAssistance.suggestions.length > 0 && (
                        <div>
                          <span className="text-purple-700 font-medium">Suggestions:</span>
                          <ul className="mt-1 space-y-1 text-xs">
                            {model.aiAssistance.suggestions.slice(0, 2).map((suggestion, index) => (
                              <li key={index} className="text-purple-600">• {suggestion.suggestion}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <Button 
                        size="sm" 
                        variant="ai" 
                        className="w-full"
                        disabled={runningScenario}
                      >
                        {runningScenario ? (
                          <Clock className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <Sparkles className="w-4 h-4 mr-2" />
                        )}
                        Enhance Model
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Model Content */}
            <div className="col-span-3">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>
                      {selectedSection.replace('_', ' ').replace(/^./, str => str.toUpperCase())}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  {selectedSection === 'overview' && (
                    <div className="space-y-6">
                      {/* Valuation Summary */}
                      <div>
                        <h4 className="font-semibold mb-3">Valuation Summary</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="text-center p-4 bg-blue-50 rounded">
                            <div className="text-2xl font-bold text-blue-700">{formatCurrency(model.valuation.enterpriseValue)}</div>
                            <div className="text-sm text-blue-600">Enterprise Value</div>
                          </div>
                          <div className="text-center p-4 bg-green-50 rounded">
                            <div className="text-2xl font-bold text-green-700">{formatCurrency(model.valuation.equityValue)}</div>
                            <div className="text-sm text-green-600">Equity Value</div>
                          </div>
                          <div className="text-center p-4 bg-purple-50 rounded">
                            <div className="text-2xl font-bold text-purple-700">{model.valuation.impliedMultiples.evEbitda.toFixed(1)}x</div>
                            <div className="text-sm text-purple-600">EV/EBITDA</div>
                          </div>
                          <div className="text-center p-4 bg-orange-50 rounded">
                            <div className="text-2xl font-bold text-orange-700">{model.valuation.impliedMultiples.peRatio.toFixed(1)}x</div>
                            <div className="text-sm text-orange-600">P/E Ratio</div>
                          </div>
                        </div>
                      </div>

                      {/* Key Assumptions */}
                      <div>
                        <h4 className="font-semibold mb-3">Key Assumptions</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Discount Rate:</span>
                            <span className="font-medium">{model.structure.discountRate.toFixed(1)}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Terminal Growth Rate:</span>
                            <span className="font-medium">{model.structure.terminalGrowthRate.toFixed(1)}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Projection Period:</span>
                            <span className="font-medium">{model.structure.projectionPeriod} years</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedSection === 'income_statement' && (
                    <div className="space-y-4">
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse border border-gray-300 text-sm">
                          <thead>
                            <tr className="bg-gray-50">
                              <th className="border border-gray-300 p-2 text-left">Line Item</th>
                              <th className="border border-gray-300 p-2 text-center">2025E</th>
                              <th className="border border-gray-300 p-2 text-center">2026E</th>
                              <th className="border border-gray-300 p-2 text-center">2027E</th>
                              <th className="border border-gray-300 p-2 text-center">2028E</th>
                              <th className="border border-gray-300 p-2 text-center">2029E</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td className="border border-gray-300 p-2 font-medium">Revenue</td>
                              {model.statements.incomeStatement.revenue.values.map((value, index) => (
                                <td key={index} className="border border-gray-300 p-2 text-center">
                                  {formatCurrency(value)}
                                </td>
                              ))}
                            </tr>
                            <tr>
                              <td className="border border-gray-300 p-2">Cost of Goods Sold</td>
                              {model.statements.incomeStatement.cogs.values.map((value, index) => (
                                <td key={index} className="border border-gray-300 p-2 text-center">
                                  {formatCurrency(value)}
                                </td>
                              ))}
                            </tr>
                            <tr className="bg-gray-50">
                              <td className="border border-gray-300 p-2 font-medium">Gross Profit</td>
                              {model.statements.incomeStatement.grossProfit.values.map((value, index) => (
                                <td key={index} className="border border-gray-300 p-2 text-center font-medium">
                                  {formatCurrency(value)}
                                </td>
                              ))}
                            </tr>
                            <tr>
                              <td className="border border-gray-300 p-2">Sales & Marketing</td>
                              {model.statements.incomeStatement.opex.salesMarketing.values.map((value, index) => (
                                <td key={index} className="border border-gray-300 p-2 text-center">
                                  {formatCurrency(value)}
                                </td>
                              ))}
                            </tr>
                            <tr>
                              <td className="border border-gray-300 p-2">Research & Development</td>
                              {model.statements.incomeStatement.opex.researchDevelopment.values.map((value, index) => (
                                <td key={index} className="border border-gray-300 p-2 text-center">
                                  {formatCurrency(value)}
                                </td>
                              ))}
                            </tr>
                            <tr className="bg-blue-50">
                              <td className="border border-gray-300 p-2 font-medium">EBIT</td>
                              {model.statements.incomeStatement.ebit.values.map((value, index) => (
                                <td key={index} className="border border-gray-300 p-2 text-center font-medium text-blue-700">
                                  {formatCurrency(value)}
                                </td>
                              ))}
                            </tr>
                            <tr className="bg-green-50">
                              <td className="border border-gray-300 p-2 font-medium">Net Income</td>
                              {model.statements.incomeStatement.netIncome.values.map((value, index) => (
                                <td key={index} className="border border-gray-300 p-2 text-center font-medium text-green-700">
                                  {formatCurrency(value)}
                                </td>
                              ))}
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* Running scenario indicator */}
                  {runningScenario && (
                    <div className="mt-4 p-3 bg-blue-50 rounded border border-blue-200">
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-blue-600 animate-spin" />
                        <span className="text-sm text-blue-700">Running scenario analysis and updating model outputs...</span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {viewMode === 'scenarios' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Scenario Analysis</h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {(['base', 'upside', 'downside', 'stress'] as const).map((scenario) => (
                <Card key={scenario} className="cursor-pointer hover:shadow-md transition-all">
                  <CardHeader>
                    <CardTitle className="text-sm capitalize">{scenario} Case</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span>Rev Growth Y1:</span>
                        <span className="font-medium">{model.scenarios[scenario].revenueGrowth[0]}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>EBITDA Margin:</span>
                        <span className="font-medium">{model.scenarios[scenario].ebitdaMargin[0]}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Discount Rate:</span>
                        <span className="font-medium">{model.scenarios[scenario].discountRate}%</span>
                      </div>
                    </div>
                    
                    <Button 
                      size="sm" 
                      className="w-full mt-3"
                      onClick={() => handleRunScenario(scenario)}
                      disabled={runningScenario}
                    >
                      {runningScenario ? (
                        <Clock className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <PlayCircle className="w-4 h-4 mr-2" />
                      )}
                      Run Scenario
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }

  const renderTemplateSelection = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Choose Model Template</h3>
        <p className="text-gray-600">Select a financial model template that matches your deal type and analysis needs.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {modelTemplates.map((template) => (
          <Card 
            key={template.id}
            className={`cursor-pointer transition-all hover:shadow-md ${selectedTemplate === template.id ? 'ring-2 ring-blue-500' : ''}`}
            onClick={() => setSelectedTemplate(template.id)}
          >
            <CardHeader>
              <CardTitle className="text-lg">{template.name}</CardTitle>
              <p className="text-sm text-gray-600">{template.description}</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Estimated Time:</span>
                  <span className="font-medium">{template.estimatedTime} hours</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Complexity:</span>
                  <Badge variant={template.complexity === 'basic' ? 'secondary' : template.complexity === 'intermediate' ? 'default' : 'destructive'}>
                    {template.complexity}
                  </Badge>
                </div>
                <div className="text-sm">
                  <span className="text-gray-500">Industries:</span>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {template.industry.slice(0, 3).map((industry) => (
                      <Badge key={industry} variant="outline" className="text-xs">
                        {industry}
                      </Badge>
                    ))}
                    {template.industry.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{template.industry.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedTemplate && (
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={() => setSelectedTemplate(null)}>
            Cancel
          </Button>
          <Button onClick={handleCreateModel}>
            <Plus className="w-4 h-4 mr-2" />
            Create Model
          </Button>
          {currentMode.mode !== 'traditional' && (
            <Button variant="ai" onClick={handleCreateModel}>
              <Sparkles className="w-4 h-4 mr-2" />
              AI Create Model
            </Button>
          )}
        </div>
      )}
    </div>
  )

  const renderTraditionalView = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Financial Model Builder</h2>
          <p className="text-gray-600">Create comprehensive financial models for investment analysis</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Upload className="w-4 h-4 mr-2" />
            Import Data
          </Button>
          <Button onClick={() => setSelectedModel(null)}>
            <Plus className="w-4 h-4 mr-2" />
            New Model
          </Button>
        </div>
      </div>

      {!selectedModel ? (
        selectedTemplate ? renderTemplateSelection() : (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Financial Models ({financialModels.length})</h3>
              <Button variant="outline" onClick={() => setSelectedTemplate('dcf-growth')}>
                <Plus className="w-4 h-4 mr-2" />
                Create from Template
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {financialModels.map(renderModelCard)}
            </div>
          </div>
        )
      ) : (
        renderModelBuilder()
      )}
    </div>
  )

  const renderAssistedView = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold flex items-center">
            <Brain className="w-5 h-5 mr-2 text-purple-500" />
            AI Financial Modeling
            <Badge variant="ai" className="ml-3">Smart Building</Badge>
          </h2>
          <p className="text-gray-600">AI-powered financial modeling with automated data integration and analysis</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button 
            variant="ai"
            onClick={() => setSelectedTemplate('dcf-growth')}
          >
            <Sparkles className="w-4 h-4 mr-2" />
            AI Create Model
          </Button>
          <Button variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh Data
          </Button>
        </div>
      </div>

      {/* AI Modeling Summary */}
      <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-blue-50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Calculator className="w-6 h-6 text-purple-600" />
              <div>
                <h3 className="font-semibold text-purple-800">AI Modeling Engine</h3>
                <p className="text-sm text-purple-600">
                  Automated modeling with {Math.round(financialModels.reduce((acc, model) => acc + model.aiAssistance.confidenceLevel, 0) / financialModels.length * 100)}% average accuracy
                </p>
              </div>
            </div>
            <Badge variant="ai">Active AI</Badge>
          </div>
          
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {financialModels.filter(m => m.aiAssistance.autoPopulated.length > 0).length}
              </div>
              <div className="text-sm text-gray-600">AI-Enhanced Models</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {financialModels.reduce((acc, model) => acc + model.aiAssistance.autoPopulated.length, 0)}
              </div>
              <div className="text-sm text-gray-600">Auto-Populated Sections</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {Math.round(financialModels.reduce((acc, model) => acc + (model.aiAssistance.autoPopulated.length > 0 ? 8 : 0), 0))}h
              </div>
              <div className="text-sm text-gray-600">Time Saved</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {financialModels.filter(m => m.status === 'approved').length}
              </div>
              <div className="text-sm text-gray-600">Approved Models</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Include traditional view with AI enhancements */}
      {renderTraditionalView()}
    </div>
  )

  const renderAutonomousView = () => (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start space-x-4">
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
              <Calculator className="w-4 h-4 text-purple-600" />
            </div>
            <div className="flex-1">
              <div className="bg-purple-50 rounded-lg p-4 mb-4">
                <p className="text-sm mb-2">
                  <strong>Model Building Status:</strong> {financialModels.length} active financial models with {financialModels.filter(m => m.aiAssistance.autoPopulated.length > 0).length} AI-enhanced.
                </p>
                <p className="text-sm">
                  AI has automated {financialModels.reduce((acc, model) => acc + model.aiAssistance.autoPopulated.length, 0)} model sections, saving approximately {Math.round(financialModels.reduce((acc, model) => acc + (model.aiAssistance.autoPopulated.length > 0 ? 8 : 0), 0))} hours of modeling time.
                </p>
              </div>

              {/* Recent AI Activities */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                <h4 className="font-medium text-green-800 mb-3 flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Recent AI Model Updates
                </h4>
                <div className="space-y-2 text-sm text-green-700">
                  <div>• CloudTech DCF model: Income statement and cash flow automatically populated</div>
                  <div>• HealthTech LBO model: Debt schedule and returns analysis generated</div>
                  <div>• Benchmark data integrated across all models with 89% confidence</div>
                  <div>• Scenario analysis automated with Monte Carlo simulation</div>
                </div>
              </div>

              {/* Upcoming AI Actions */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-800 mb-3 flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  AI Modeling Schedule
                </h4>
                <div className="space-y-2 text-sm text-blue-700">
                  <div>• Daily: Market data updates and benchmark refreshes</div>
                  <div>• Weekly: Sensitivity analysis and scenario optimization</div>
                  <div>• On-demand: New model creation from due diligence data</div>
                  <div>• Real-time: Model validation and error checking</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  return (
    <div className="p-6">
      {currentMode.mode === 'traditional' && renderTraditionalView()}
      {currentMode.mode === 'assisted' && renderAssistedView()}
      {currentMode.mode === 'autonomous' && renderAutonomousView()}
    </div>
  )
}