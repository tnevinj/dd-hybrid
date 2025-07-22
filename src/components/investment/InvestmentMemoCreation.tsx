'use client'

import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useNavigationStore } from '@/stores/navigation-store'
import { useDueDiligenceContext } from '@/contexts/DueDiligenceContext'
import { DueDiligenceProject, DueDiligenceDocument, DueDiligenceFinding, AIInsight } from '@/types/due-diligence'
import { 
  FileText,
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
  ImageIcon,
  Table,
  AlignLeft,
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Quote,
  Code,
  Paperclip
} from 'lucide-react'

interface InvestmentMemo {
  id: string
  companyName: string
  status: 'draft' | 'in_review' | 'approved' | 'declined' | 'archived'
  dealType: 'growth_equity' | 'buyout' | 'venture' | 'special_situations'
  sector: string
  stage: string
  
  // Core memo sections
  sections: {
    executiveSummary: {
      content: string
      aiGenerated: boolean
      confidence?: number
      lastUpdated: Date
    }
    investmentThesis: {
      content: string
      keyPoints: string[]
      aiGenerated: boolean
      confidence?: number
      lastUpdated: Date
    }
    companyOverview: {
      businessModel: string
      marketPosition: string
      competitiveAdvantages: string[]
      managementTeam: {
        name: string
        role: string
        background: string
      }[]
      aiGenerated: boolean
      lastUpdated: Date
    }
    marketAnalysis: {
      marketSize: string
      growthDrivers: string[]
      competitiveLandscape: string
      risks: string[]
      aiGenerated: boolean
      lastUpdated: Date
    }
    financialAnalysis: {
      historicalPerformance: string
      projections: string
      keyMetrics: {
        metric: string
        value: string
        benchmark: string
      }[]
      valuation: string
      aiGenerated: boolean
      lastUpdated: Date
    }
    dealStructure: {
      investmentAmount: number
      valuation: number
      ownership: number
      boardSeats: number
      liquidityRights: string[]
      terms: string
      aiGenerated: boolean
      lastUpdated: Date
    }
    riskAnalysis: {
      keyRisks: {
        category: string
        risk: string
        mitigation: string
        severity: 'low' | 'medium' | 'high'
      }[]
      scenario_analysis: string
      aiGenerated: boolean
      lastUpdated: Date
    }
    recommendation: {
      decision: 'recommend' | 'conditional' | 'decline'
      rationale: string
      nextSteps: string[]
      aiGenerated: boolean
      lastUpdated: Date
    }
  }
  
  // Work product details
  workProduct: {
    template: string
    format: 'doc' | 'pdf' | 'slides'
    length: number // pages/slides
    completionPercentage: number
    requiredSections: string[]
    optionalSections: string[]
  }
  
  // Collaboration
  team: {
    author: string
    contributors: string[]
    reviewers: string[]
    approvers: string[]
  }
  
  // AI assistance tracking
  aiAssistance: {
    sectionsGenerated: string[]
    totalAiContent: number // percentage
    confidenceLevel: number
    lastAiUpdate: Date
    suggestedImprovements: string[]
  }
  
  // Version control
  version: string
  createdAt: Date
  lastModified: Date
  dueDate?: Date
  
  // Source data
  sourceDocuments: {
    name: string
    type: string
    analyzedBy: 'human' | 'ai'
    keyInsights: string[]
  }[]
  
  // Attachments
  attachments: {
    name: string
    type: string
    size: string
    category: 'financial_model' | 'market_research' | 'legal_docs' | 'presentations'
  }[]
}

interface MemoTemplate {
  id: string
  name: string
  description: string
  sections: string[]
  estimatedTime: number // minutes
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  useCase: string[]
}

interface InvestmentMemoCreationProps {
  dealId?: string
}

export function InvestmentMemoCreation({ dealId }: InvestmentMemoCreationProps) {
  const { currentMode, trackInteraction, addRecommendation } = useNavigationStore()
  const [selectedMemo, setSelectedMemo] = React.useState<string | null>(null)
  const [selectedSection, setSelectedSection] = React.useState<string>('executiveSummary')
  const [expandedSections, setExpandedSections] = React.useState<Set<string>>(new Set(['executiveSummary']))
  const [generatingContent, setGeneratingContent] = React.useState(false)
  const [selectedTemplate, setSelectedTemplate] = React.useState<string | null>(null)
  const [viewMode, setViewMode] = React.useState<'editor' | 'preview' | 'outline'>('editor')

  // Sample memo templates
  const [memoTemplates] = React.useState<MemoTemplate[]>([
    {
      id: 'growth-equity',
      name: 'Growth Equity Investment Memo',
      description: 'Comprehensive template for growth equity investments',
      sections: ['executiveSummary', 'investmentThesis', 'companyOverview', 'marketAnalysis', 'financialAnalysis', 'dealStructure', 'riskAnalysis', 'recommendation'],
      estimatedTime: 180,
      difficulty: 'intermediate',
      useCase: ['growth_equity', 'expansion_capital']
    },
    {
      id: 'buyout',
      name: 'Buyout Investment Memo',
      description: 'Detailed template for buyout and control investments',
      sections: ['executiveSummary', 'investmentThesis', 'companyOverview', 'marketAnalysis', 'financialAnalysis', 'dealStructure', 'riskAnalysis', 'operationalPlan', 'recommendation'],
      estimatedTime: 240,
      difficulty: 'advanced',
      useCase: ['buyout', 'control_investment']
    },
    {
      id: 'venture',
      name: 'Venture Capital Memo',
      description: 'Template optimized for early-stage venture investments',
      sections: ['executiveSummary', 'investmentThesis', 'companyOverview', 'marketAnalysis', 'teamAssessment', 'productAnalysis', 'dealStructure', 'recommendation'],
      estimatedTime: 120,
      difficulty: 'beginner',
      useCase: ['venture', 'seed', 'series_a']
    }
  ])

  // Sample investment memos
  const [investmentMemos] = React.useState<InvestmentMemo[]>([
    {
      id: 'memo-001',
      companyName: 'CloudTech Solutions',
      status: 'draft',
      dealType: 'growth_equity',
      sector: 'Software',
      stage: 'Series B',
      sections: {
        executiveSummary: {
          content: 'CloudTech Solutions presents an attractive growth equity investment opportunity in the rapidly expanding cloud infrastructure software market. The company has demonstrated strong product-market fit with 300% revenue growth over the past two years and an impressive customer base including Fortune 500 enterprises. Our proposed $25M investment would fuel international expansion and product development to capitalize on the $45B addressable market.',
          aiGenerated: true,
          confidence: 0.91,
          lastUpdated: new Date('2025-07-20T10:30:00')
        },
        investmentThesis: {
          content: 'CloudTech is well-positioned to become a category leader in cloud infrastructure management, driven by three key factors: (1) Proprietary technology that reduces cloud costs by 40-60%, (2) Strong management team with proven track record of scaling SaaS businesses, and (3) Large and growing addressable market with limited direct competition.',
          keyPoints: [
            'Proven technology with 40-60% cost reduction for enterprise clients',
            'Strong customer retention rate of 98% with expanding usage patterns',
            'Experienced management team from leading cloud companies',
            'Large addressable market ($45B) with 25% annual growth',
            'Clear path to market leadership in underserved segment'
          ],
          aiGenerated: true,
          confidence: 0.89,
          lastUpdated: new Date('2025-07-20T10:45:00')
        },
        companyOverview: {
          businessModel: 'CloudTech operates a SaaS platform that helps enterprises optimize their cloud infrastructure costs through AI-powered analysis and automated optimization recommendations.',
          marketPosition: 'Leading position in the cloud cost optimization segment with differentiated technology and strong customer relationships.',
          competitiveAdvantages: [
            'Proprietary AI algorithms for cost optimization',
            'Multi-cloud platform supporting AWS, Azure, and GCP',
            'Strong enterprise customer relationships',
            'Proven ROI of 5-8x for customers'
          ],
          managementTeam: [
            {
              name: 'Sarah Chen',
              role: 'CEO & Founder',
              background: 'Former VP of Engineering at AWS, 15 years cloud infrastructure experience'
            },
            {
              name: 'Michael Rodriguez',
              role: 'CTO & Co-Founder',
              background: 'Former Principal Engineer at Google Cloud, PhD in Computer Science from Stanford'
            },
            {
              name: 'Jennifer Kim',
              role: 'VP of Sales',
              background: 'Former Sales Director at Salesforce, proven track record scaling enterprise sales teams'
            }
          ],
          aiGenerated: false,
          lastUpdated: new Date('2025-07-19T16:20:00')
        },
        marketAnalysis: {
          marketSize: 'The global cloud cost management market is valued at $45B and growing at 25% annually, driven by increasing cloud adoption and cost optimization needs.',
          growthDrivers: [
            'Accelerating cloud adoption across all industries',
            'Increasing complexity of multi-cloud environments',
            'Growing focus on cloud cost optimization and efficiency',
            'Regulatory requirements for cost transparency'
          ],
          competitiveLandscape: 'Limited direct competition with most solutions focused on monitoring rather than optimization. Key competitors include CloudHealth (acquired by VMware) and Cloudability (acquired by Apptio).',
          risks: [
            'Cloud providers developing native cost optimization tools',
            'Economic downturn reducing enterprise IT spending',
            'Increased competition from well-funded startups'
          ],
          aiGenerated: true,
          confidence: 0.85,
          lastUpdated: new Date('2025-07-20T11:15:00')
        },
        financialAnalysis: {
          historicalPerformance: 'Strong historical growth with revenue increasing from $2M (2023) to $8M (2024) to projected $24M (2025). Gross margins of 85% with improving unit economics.',
          projections: 'Five-year revenue projection of $150M by 2029 with 30% EBITDA margins. Conservative assumptions based on current customer growth and expansion patterns.',
          keyMetrics: [
            { metric: 'ARR Growth Rate', value: '300%', benchmark: '100-150%' },
            { metric: 'Gross Revenue Retention', value: '98%', benchmark: '90%+' },
            { metric: 'Net Revenue Retention', value: '135%', benchmark: '110%+' },
            { metric: 'CAC Payback Period', value: '8 months', benchmark: '12-18 months' },
            { metric: 'LTV/CAC Ratio', value: '7.2x', benchmark: '3x+' }
          ],
          valuation: 'Pre-money valuation of $75M represents 9.4x 2025 revenue multiple, in line with comparable growth-stage SaaS companies.',
          aiGenerated: false,
          lastUpdated: new Date('2025-07-19T14:30:00')
        },
        dealStructure: {
          investmentAmount: 25000000,
          valuation: 75000000,
          ownership: 25,
          boardSeats: 1,
          liquidityRights: ['Participation rights in future rounds', 'Tag-along rights', 'Drag-along rights'],
          terms: 'Series B Preferred Stock with standard protective provisions and anti-dilution rights.',
          aiGenerated: false,
          lastUpdated: new Date('2025-07-19T15:45:00')
        },
        riskAnalysis: {
          keyRisks: [
            {
              category: 'Market',
              risk: 'Cloud providers develop native cost optimization features',
              mitigation: 'Focus on multi-cloud optimization and advanced AI capabilities',
              severity: 'medium'
            },
            {
              category: 'Competition',
              risk: 'Well-funded competitors enter the market',
              mitigation: 'Build strong moats through technology and customer relationships',
              severity: 'medium'
            },
            {
              category: 'Execution',
              risk: 'Challenges scaling enterprise sales organization',
              mitigation: 'Experienced sales leadership and proven go-to-market strategy',
              severity: 'low'
            },
            {
              category: 'Technology',
              risk: 'Difficulty maintaining technology leadership',
              mitigation: 'Strong R&D team and continuous innovation focus',
              severity: 'low'
            }
          ],
          scenario_analysis: 'Base case projects 25x return, bull case 50x+ return, bear case 3-5x return based on different market penetration scenarios.',
          aiGenerated: true,
          confidence: 0.82,
          lastUpdated: new Date('2025-07-20T12:00:00')
        },
        recommendation: {
          decision: 'recommend',
          rationale: 'CloudTech represents an exceptional growth equity opportunity with proven product-market fit, strong unit economics, and significant market opportunity. The management team has demonstrated execution capability and the technology provides clear customer value.',
          nextSteps: [
            'Complete management presentations and reference calls',
            'Finalize term sheet negotiations',
            'Conduct technical due diligence with external experts',
            'Schedule Investment Committee presentation for next week'
          ],
          aiGenerated: false,
          lastUpdated: new Date('2025-07-20T16:00:00')
        }
      },
      workProduct: {
        template: 'growth-equity',
        format: 'doc',
        length: 15,
        completionPercentage: 85,
        requiredSections: ['executiveSummary', 'investmentThesis', 'financialAnalysis', 'dealStructure', 'recommendation'],
        optionalSections: ['competitiveAnalysis', 'operationalPlan']
      },
      team: {
        author: 'David Kim',
        contributors: ['Sarah Johnson', 'Michael Chen'],
        reviewers: ['Partner Jane Smith'],
        approvers: ['Investment Committee']
      },
      aiAssistance: {
        sectionsGenerated: ['executiveSummary', 'investmentThesis', 'marketAnalysis', 'riskAnalysis'],
        totalAiContent: 60,
        confidenceLevel: 0.87,
        lastAiUpdate: new Date('2025-07-20T12:00:00'),
        suggestedImprovements: [
          'Add competitive benchmarking analysis',
          'Include detailed customer reference information',
          'Expand on international market opportunity'
        ]
      },
      version: '2.1',
      createdAt: new Date('2025-07-15T09:00:00'),
      lastModified: new Date('2025-07-20T16:00:00'),
      dueDate: new Date('2025-07-25T17:00:00'),
      sourceDocuments: [
        {
          name: 'CloudTech_Financial_Model_v3.xlsx',
          type: 'Financial Model',
          analyzedBy: 'ai',
          keyInsights: ['Strong unit economics', 'Conservative growth assumptions', 'Healthy cash flow projections']
        },
        {
          name: 'Market_Research_Cloud_Management.pdf',
          type: 'Market Research',
          analyzedBy: 'ai',
          keyInsights: ['Large addressable market', 'High growth rate', 'Limited direct competition']
        },
        {
          name: 'Management_Presentation_July2025.pptx',
          type: 'Presentation',
          analyzedBy: 'human',
          keyInsights: ['Strong team credentials', 'Clear go-to-market strategy', 'Impressive customer traction']
        }
      ],
      attachments: [
        { name: 'Financial_Model_CloudTech.xlsx', type: 'excel', size: '2.1 MB', category: 'financial_model' },
        { name: 'Market_Analysis_Report.pdf', type: 'pdf', size: '890 KB', category: 'market_research' },
        { name: 'Legal_DD_Summary.docx', type: 'word', size: '456 KB', category: 'legal_docs' }
      ]
    },
    {
      id: 'memo-002',
      companyName: 'HealthTech Innovations',
      status: 'in_review',
      dealType: 'buyout',
      sector: 'Healthcare',
      stage: 'Growth',
      sections: {
        executiveSummary: {
          content: 'HealthTech Innovations is a leading provider of healthcare analytics software with strong market position and proven business model...',
          aiGenerated: false,
          lastUpdated: new Date('2025-07-18T14:20:00')
        },
        investmentThesis: {
          content: 'Strong healthcare technology platform with recurring revenue model and significant market opportunity...',
          keyPoints: [
            'Market-leading healthcare analytics platform',
            'Strong recurring revenue base with 95% retention',
            'Experienced management team',
            'Clear consolidation opportunity'
          ],
          aiGenerated: false,
          lastUpdated: new Date('2025-07-18T14:30:00')
        },
        companyOverview: {
          businessModel: 'B2B SaaS platform serving healthcare providers with analytics and workflow optimization tools.',
          marketPosition: 'Top 3 player in healthcare analytics market with strong brand recognition.',
          competitiveAdvantages: ['Proprietary healthcare data', 'Deep customer relationships', 'Regulatory expertise'],
          managementTeam: [
            {
              name: 'Dr. Lisa Thompson',
              role: 'CEO',
              background: 'Former healthcare executive with 20 years industry experience'
            }
          ],
          aiGenerated: false,
          lastUpdated: new Date('2025-07-18T15:00:00')
        },
        marketAnalysis: {
          marketSize: 'Healthcare analytics market valued at $15B with 12% annual growth driven by regulatory requirements and cost pressures.',
          growthDrivers: ['Regulatory compliance requirements', 'Cost optimization needs', 'Digital transformation'],
          competitiveLandscape: 'Fragmented market with opportunity for consolidation and market share gains.',
          risks: ['Regulatory changes', 'Competitive pressure from large tech companies'],
          aiGenerated: true,
          confidence: 0.78,
          lastUpdated: new Date('2025-07-19T10:30:00')
        },
        financialAnalysis: {
          historicalPerformance: 'Consistent revenue growth of 15-20% annually with strong EBITDA margins of 25%.',
          projections: 'Conservative growth projections with focus on operational efficiency improvements.',
          keyMetrics: [
            { metric: 'Revenue CAGR', value: '18%', benchmark: '15%+' },
            { metric: 'EBITDA Margin', value: '25%', benchmark: '20%+' },
            { metric: 'Customer Retention', value: '95%', benchmark: '85%+' }
          ],
          valuation: 'Acquisition multiple of 6x EBITDA, consistent with healthcare software comparables.',
          aiGenerated: false,
          lastUpdated: new Date('2025-07-18T16:45:00')
        },
        dealStructure: {
          investmentAmount: 150000000,
          valuation: 150000000,
          ownership: 100,
          boardSeats: 3,
          liquidityRights: ['Full control', 'Management equity participation'],
          terms: 'Acquisition with management rollover equity and performance-based earnout.',
          aiGenerated: false,
          lastUpdated: new Date('2025-07-18T17:00:00')
        },
        riskAnalysis: {
          keyRisks: [
            {
              category: 'Regulatory',
              risk: 'Changes in healthcare regulations affecting demand',
              mitigation: 'Strong regulatory expertise and adaptive product development',
              severity: 'medium'
            },
            {
              category: 'Competition',
              risk: 'Large technology companies entering healthcare analytics',
              mitigation: 'Deep healthcare domain expertise and customer relationships',
              severity: 'high'
            }
          ],
          scenario_analysis: 'Base case 3x return over 5 years, upside scenario 5x+ with successful add-on acquisitions.',
          aiGenerated: true,
          confidence: 0.75,
          lastUpdated: new Date('2025-07-19T11:00:00')
        },
        recommendation: {
          decision: 'conditional',
          rationale: 'Strong business with good fundamentals, but execution risks require careful management transition planning.',
          nextSteps: [
            'Complete management reference checks',
            'Finalize management incentive structure',
            'Develop detailed integration plan'
          ],
          aiGenerated: false,
          lastUpdated: new Date('2025-07-19T16:30:00')
        }
      },
      workProduct: {
        template: 'buyout',
        format: 'doc',
        length: 22,
        completionPercentage: 95,
        requiredSections: ['executiveSummary', 'investmentThesis', 'financialAnalysis', 'dealStructure', 'recommendation'],
        optionalSections: []
      },
      team: {
        author: 'Michael Chen',
        contributors: ['David Kim'],
        reviewers: ['Partner Jane Smith', 'Partner John Davis'],
        approvers: ['Investment Committee']
      },
      aiAssistance: {
        sectionsGenerated: ['marketAnalysis', 'riskAnalysis'],
        totalAiContent: 25,
        confidenceLevel: 0.76,
        lastAiUpdate: new Date('2025-07-19T11:00:00'),
        suggestedImprovements: [
          'Add more detailed competitive analysis',
          'Include customer concentration analysis'
        ]
      },
      version: '3.2',
      createdAt: new Date('2025-07-10T10:00:00'),
      lastModified: new Date('2025-07-19T16:30:00'),
      dueDate: new Date('2025-07-22T17:00:00'),
      sourceDocuments: [
        {
          name: 'HealthTech_CIM.pdf',
          type: 'Confidential Information Memorandum',
          analyzedBy: 'human',
          keyInsights: ['Strong market position', 'Consistent financial performance']
        }
      ],
      attachments: [
        { name: 'HealthTech_Financial_Model.xlsx', type: 'excel', size: '3.2 MB', category: 'financial_model' },
        { name: 'Legal_DD_Report.pdf', type: 'pdf', size: '1.8 MB', category: 'legal_docs' }
      ]
    }
  ])

  // AI recommendations based on mode
  React.useEffect(() => {
    if (currentMode.mode !== 'traditional') {
      const incompleteMemos = investmentMemos.filter(memo => memo.workProduct.completionPercentage < 100)
      
      if (incompleteMemos.length > 0) {
        addRecommendation({
          id: `incomplete-memos-${dealId}`,
          type: 'automation',
          priority: 'high',
          title: `${incompleteMemos.length} Memos Need Completion`,
          description: 'AI can help complete missing sections and enhance existing content in draft memos.',
          actions: [{
            id: 'complete-memos',
            label: 'AI Complete Memos',
            action: 'AI_COMPLETE_MEMOS',
            primary: true,
            estimatedTimeSaving: incompleteMemos.length * 120
          }],
          confidence: 0.91,
          moduleContext: 'memo_creation',
          timestamp: new Date()
        })
      }

      // Template recommendation for new memos
      if (investmentMemos.length === 0 || (dealId && !investmentMemos.find(m => m.id === dealId))) {
        addRecommendation({
          id: `new-memo-template-${dealId}`,
          type: 'insight',
          priority: 'medium',
          title: 'Start with AI-Powered Template',
          description: 'AI can pre-populate memo sections based on deal type and available data sources.',
          actions: [{
            id: 'create-ai-memo',
            label: 'Create AI Memo',
            action: 'CREATE_AI_MEMO'
          }],
          confidence: 0.89,
          moduleContext: 'memo_creation',
          timestamp: new Date()
        })
      }

      // Content quality improvement
      const lowConfidenceSections = investmentMemos.flatMap(memo => 
        Object.entries(memo.sections).filter(([_, section]) => 
          section.aiGenerated && (section.confidence || 0) < 0.8
        )
      )
      
      if (lowConfidenceSections.length > 0) {
        addRecommendation({
          id: `improve-memo-quality-${dealId}`,
          type: 'warning',
          priority: 'medium',
          title: 'AI Content Needs Review',
          description: `${lowConfidenceSections.length} AI-generated sections have low confidence scores and may need improvement.`,
          actions: [{
            id: 'improve-ai-content',
            label: 'Improve AI Content',
            action: 'IMPROVE_AI_CONTENT'
          }],
          confidence: 0.85,
          moduleContext: 'memo_creation',
          timestamp: new Date()
        })
      }
    }
  }, [currentMode.mode, dealId, addRecommendation])

  const handleGenerateContent = async (sectionName: string) => {
    setGeneratingContent(true)
    trackInteraction({
      interactionType: 'automation_approved',
      userAction: 'accepted',
      module: 'memo_creation',
      context: {
        action: 'generate_content',
        section: sectionName,
        memoId: selectedMemo
      }
    })

    // Simulate AI content generation
    setTimeout(() => {
      setGeneratingContent(false)
    }, 3000)
  }

  const handleCreateNewMemo = () => {
    trackInteraction({
      interactionType: 'feature_used',
      userAction: 'clicked',
      module: 'memo_creation',
      context: {
        action: 'create_new_memo',
        template: selectedTemplate
      }
    })
  }

  const toggleSection = (sectionName: string) => {
    const newExpanded = new Set(expandedSections)
    if (newExpanded.has(sectionName)) {
      newExpanded.delete(sectionName)
    } else {
      newExpanded.add(sectionName)
    }
    setExpandedSections(newExpanded)
  }

  const getStatusColor = (status: InvestmentMemo['status']) => {
    switch (status) {
      case 'draft': return 'text-gray-600 bg-gray-50'
      case 'in_review': return 'text-orange-600 bg-orange-50'
      case 'approved': return 'text-green-600 bg-green-50'
      case 'declined': return 'text-red-600 bg-red-50'
      case 'archived': return 'text-purple-600 bg-purple-50'
    }
  }

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(0)}M`
    } else if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(0)}K`
    }
    return `$${amount.toLocaleString()}`
  }

  const renderMemoCard = (memo: InvestmentMemo) => (
    <Card 
      key={memo.id} 
      className={`cursor-pointer transition-all hover:shadow-md ${selectedMemo === memo.id ? 'ring-2 ring-blue-500' : ''} ${memo.aiAssistance.totalAiContent > 50 ? 'border-l-4 border-l-purple-400' : ''}`}
      onClick={() => setSelectedMemo(memo.id)}
    >
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">{memo.companyName}</CardTitle>
            <p className="text-sm text-gray-600">
              {memo.dealType.replace('_', ' ')} • {memo.sector} • {formatCurrency(memo.sections.dealStructure.investmentAmount)}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Badge className={`text-xs ${getStatusColor(memo.status)}`}>
              {memo.status.replace('_', ' ')}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {memo.workProduct.completionPercentage}% complete
            </Badge>
            {memo.aiAssistance.totalAiContent > 0 && (
              <Badge variant="ai" className="text-xs">
                AI: {memo.aiAssistance.totalAiContent}%
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-3">
          {/* Progress bar */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span>Completion</span>
              <span>{memo.workProduct.completionPercentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full" 
                style={{ width: `${memo.workProduct.completionPercentage}%` }}
              />
            </div>
          </div>

          {/* Key metrics */}
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Investment</span>
              <div className="font-medium">{formatCurrency(memo.sections.dealStructure.investmentAmount)}</div>
            </div>
            <div>
              <span className="text-gray-500">Ownership</span>
              <div className="font-medium">{memo.sections.dealStructure.ownership}%</div>
            </div>
            <div>
              <span className="text-gray-500">Due Date</span>
              <div className="font-medium">{memo.dueDate?.toISOString().split('T')[0] || 'TBD'}</div>
            </div>
          </div>

          {/* AI assistance summary */}
          {memo.aiAssistance.totalAiContent > 0 && currentMode.mode !== 'traditional' && (
            <div className="bg-purple-50 rounded p-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-purple-700">AI Generated: {memo.aiAssistance.sectionsGenerated.length} sections</span>
                <Badge variant="ai" className="text-xs">
                  {Math.round(memo.aiAssistance.confidenceLevel * 100)}% confidence
                </Badge>
              </div>
            </div>
          )}

          {/* Team */}
          <div className="flex items-center justify-between text-xs">
            <div className="text-gray-500">
              Author: {memo.team.author} • Contributors: {memo.team.contributors.length}
            </div>
            <div className="text-gray-500">
              v{memo.version} • {memo.lastModified.toISOString().split('T')[0]}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  const renderMemoEditor = () => {
    const memo = investmentMemos.find(m => m.id === selectedMemo)
    if (!memo) return null

    return (
      <div className="space-y-6">
        {/* Memo Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">{memo.companyName} Investment Memo</h2>
            <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
              <span>{memo.dealType.replace('_', ' ')} • {memo.sector}</span>
              <span>Version {memo.version}</span>
              <span>Last updated: {memo.lastModified.toISOString().split('T')[0]}</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <History className="w-4 h-4 mr-2" />
              Version History
            </Button>
            <Button variant="outline" size="sm">
              <Share className="w-4 h-4 mr-2" />
              Share
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
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
            { id: 'editor', label: 'Editor', icon: Edit3 },
            { id: 'preview', label: 'Preview', icon: Eye },
            { id: 'outline', label: 'Outline', icon: List }
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
        {viewMode === 'editor' && (
          <div className="grid grid-cols-4 gap-6">
            {/* Section Navigation */}
            <div className="col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Sections</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {Object.entries(memo.sections).map(([sectionName, section]) => (
                      <button
                        key={sectionName}
                        onClick={() => setSelectedSection(sectionName)}
                        className={`w-full text-left p-2 rounded text-sm transition-colors ${
                          selectedSection === sectionName 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'hover:bg-gray-100'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span>{sectionName.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</span>
                          <div className="flex items-center space-x-1">
                            {section.aiGenerated && (
                              <Brain className="w-3 h-3 text-purple-500" />
                            )}
                            <CheckCircle className="w-3 h-3 text-green-500" />
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* AI Assistance Panel */}
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
                        <span className="text-purple-700 font-medium">AI Content: </span>
                        <span>{memo.aiAssistance.totalAiContent}%</span>
                      </div>
                      
                      <div>
                        <span className="text-purple-700 font-medium">Confidence: </span>
                        <Badge variant="ai" className="text-xs">
                          {Math.round(memo.aiAssistance.confidenceLevel * 100)}%
                        </Badge>
                      </div>

                      {memo.aiAssistance.suggestedImprovements.length > 0 && (
                        <div>
                          <span className="text-purple-700 font-medium">Suggestions:</span>
                          <ul className="mt-1 space-y-1 text-xs">
                            {memo.aiAssistance.suggestedImprovements.slice(0, 2).map((suggestion, index) => (
                              <li key={index} className="text-purple-600">• {suggestion}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <Button 
                        size="sm" 
                        variant="ai" 
                        className="w-full"
                        onClick={() => handleGenerateContent(selectedSection)}
                        disabled={generatingContent}
                      >
                        {generatingContent ? (
                          <Clock className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <Sparkles className="w-4 h-4 mr-2" />
                        )}
                        Enhance Section
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Content Editor */}
            <div className="col-span-3">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>
                      {selectedSection.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </CardTitle>
                    <div className="flex items-center space-x-2">
                      {memo.sections[selectedSection as keyof typeof memo.sections]?.aiGenerated && (
                        <Badge variant="ai" className="text-xs">
                          AI Generated • {Math.round((memo.sections[selectedSection as keyof typeof memo.sections]?.confidence || 0) * 100)}%
                        </Badge>
                      )}
                      {currentMode.mode !== 'traditional' && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleGenerateContent(selectedSection)}
                          disabled={generatingContent}
                        >
                          {generatingContent ? (
                            <Clock className="w-4 h-4 mr-2 animate-spin" />
                          ) : (
                            <Sparkles className="w-4 h-4 mr-2" />
                          )}
                          AI Enhance
                        </Button>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Rich Text Editor Toolbar */}
                  <div className="border-b pb-3 mb-4">
                    <div className="flex items-center space-x-1">
                      <Button variant="ghost" size="sm">
                        <Bold className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Italic className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Underline className="w-4 h-4" />
                      </Button>
                      <div className="w-px h-4 bg-gray-300 mx-2" />
                      <Button variant="ghost" size="sm">
                        <List className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <ListOrdered className="w-4 h-4" />
                      </Button>
                      <div className="w-px h-4 bg-gray-300 mx-2" />
                      <Button variant="ghost" size="sm">
                        <Table className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <ImageIcon className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Link className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Content Area */}
                  <div className="min-h-96 p-4 border rounded focus-within:ring-2 focus-within:ring-blue-500">
                    <div className="prose max-w-none">
                      {selectedSection === 'executiveSummary' && (
                        <div>
                          <p className="text-gray-800 leading-relaxed">
                            {memo.sections.executiveSummary.content}
                          </p>
                        </div>
                      )}
                      
                      {selectedSection === 'investmentThesis' && (
                        <div>
                          <p className="text-gray-800 leading-relaxed mb-4">
                            {memo.sections.investmentThesis.content}
                          </p>
                          
                          <h4 className="font-semibold mb-2">Key Investment Points:</h4>
                          <ul className="space-y-1">
                            {memo.sections.investmentThesis.keyPoints.map((point, index) => (
                              <li key={index} className="text-gray-700">• {point}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {selectedSection === 'financialAnalysis' && (
                        <div>
                          <div className="mb-4">
                            <h4 className="font-semibold mb-2">Historical Performance</h4>
                            <p className="text-gray-700">{memo.sections.financialAnalysis.historicalPerformance}</p>
                          </div>
                          
                          <div className="mb-4">
                            <h4 className="font-semibold mb-2">Key Metrics</h4>
                            <div className="overflow-x-auto">
                              <table className="w-full border-collapse border border-gray-300">
                                <thead>
                                  <tr className="bg-gray-50">
                                    <th className="border border-gray-300 p-2 text-left">Metric</th>
                                    <th className="border border-gray-300 p-2 text-left">Value</th>
                                    <th className="border border-gray-300 p-2 text-left">Benchmark</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {memo.sections.financialAnalysis.keyMetrics.map((metric, index) => (
                                    <tr key={index}>
                                      <td className="border border-gray-300 p-2">{metric.metric}</td>
                                      <td className="border border-gray-300 p-2">{metric.value}</td>
                                      <td className="border border-gray-300 p-2">{metric.benchmark}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>

                          <div>
                            <h4 className="font-semibold mb-2">Valuation</h4>
                            <p className="text-gray-700">{memo.sections.financialAnalysis.valuation}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* AI Content Generation Status */}
                  {generatingContent && (
                    <div className="mt-4 p-3 bg-purple-50 rounded border border-purple-200">
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-purple-600 animate-spin" />
                        <span className="text-sm text-purple-700">AI is generating enhanced content for this section...</span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {viewMode === 'preview' && (
          <Card>
            <CardContent className="p-8">
              <div className="prose max-w-none">
                <div className="text-center mb-8">
                  <h1 className="text-3xl font-bold mb-2">{memo.companyName}</h1>
                  <h2 className="text-xl text-gray-600">Investment Memorandum</h2>
                  <div className="text-sm text-gray-500 mt-2">
                    {memo.dealType.replace('_', ' ')} • {formatCurrency(memo.sections.dealStructure.investmentAmount)} Investment
                  </div>
                </div>

                {Object.entries(memo.sections).map(([sectionName, section]) => (
                  <div key={sectionName} className="mb-8">
                    <h3 className="text-xl font-semibold mb-4 border-b pb-2">
                      {sectionName.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </h3>
                    <div className="text-gray-700 leading-relaxed">
                      {typeof section.content === 'string' ? section.content : JSON.stringify(section.content)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {viewMode === 'outline' && (
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                {Object.entries(memo.sections).map(([sectionName, section]) => (
                  <div key={sectionName} className="border rounded p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">
                        {sectionName.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                      </h4>
                      <div className="flex items-center space-x-2">
                        {section.aiGenerated && (
                          <Badge variant="ai" className="text-xs">
                            AI • {Math.round((section.confidence || 0) * 100)}%
                          </Badge>
                        )}
                        <Badge variant="outline" className="text-xs">
                          {section.lastUpdated.toISOString().split('T')[0]}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {typeof section.content === 'string' 
                        ? section.content.substring(0, 150) + '...' 
                        : 'Complex content structure'
                      }
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    )
  }

  const renderTemplateSelection = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Choose Memo Template</h3>
        <p className="text-gray-600">Select a template that matches your investment type and deal structure.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {memoTemplates.map((template) => (
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
                  <span className="font-medium">{template.estimatedTime} minutes</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Difficulty:</span>
                  <Badge variant={template.difficulty === 'beginner' ? 'secondary' : template.difficulty === 'intermediate' ? 'default' : 'destructive'}>
                    {template.difficulty}
                  </Badge>
                </div>
                <div className="text-sm">
                  <span className="text-gray-500">Sections:</span>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {template.sections.slice(0, 3).map((section) => (
                      <Badge key={section} variant="outline" className="text-xs">
                        {section.replace(/([A-Z])/g, ' $1').trim()}
                      </Badge>
                    ))}
                    {template.sections.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{template.sections.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="text-sm">
                  <span className="text-gray-500">Use Cases:</span>
                  <div className="mt-1 text-xs text-gray-600">
                    {template.useCase.join(', ')}
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
          <Button onClick={handleCreateNewMemo}>
            <Plus className="w-4 h-4 mr-2" />
            Create Memo
          </Button>
          {currentMode.mode !== 'traditional' && (
            <Button variant="ai" onClick={handleCreateNewMemo}>
              <Sparkles className="w-4 h-4 mr-2" />
              AI Create Memo
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
          <h2 className="text-xl font-bold">Investment Memo Creation</h2>
          <p className="text-gray-600">Create comprehensive investment memos for deal evaluation</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Upload className="w-4 h-4 mr-2" />
            Import Template
          </Button>
          <Button onClick={() => setSelectedMemo(null)}>
            <Plus className="w-4 h-4 mr-2" />
            New Memo
          </Button>
        </div>
      </div>

      {!selectedMemo ? (
        selectedTemplate ? renderTemplateSelection() : (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Investment Memos ({investmentMemos.length})</h3>
              <Button variant="outline" onClick={() => setSelectedTemplate('growth-equity')}>
                <Plus className="w-4 h-4 mr-2" />
                Create from Template
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {investmentMemos.map(renderMemoCard)}
            </div>
          </div>
        )
      ) : (
        renderMemoEditor()
      )}
    </div>
  )

  const renderAssistedView = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold flex items-center">
            <Brain className="w-5 h-5 mr-2 text-purple-500" />
            AI Memo Creation
            <Badge variant="ai" className="ml-3">Smart Writing</Badge>
          </h2>
          <p className="text-gray-600">AI-powered investment memo creation with intelligent content generation</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button 
            variant="ai"
            onClick={() => setSelectedTemplate('growth-equity')}
          >
            <Sparkles className="w-4 h-4 mr-2" />
            AI Create Memo
          </Button>
          <Button variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh AI
          </Button>
        </div>
      </div>

      {/* AI Creation Summary */}
      <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-blue-50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Brain className="w-6 h-6 text-purple-600" />
              <div>
                <h3 className="font-semibold text-purple-800">AI Writing Assistant</h3>
                <p className="text-sm text-purple-600">
                  Smart content generation with {Math.round(investmentMemos.reduce((acc, memo) => acc + memo.aiAssistance.confidenceLevel, 0) / investmentMemos.length * 100)}% average confidence
                </p>
              </div>
            </div>
            <Badge variant="ai">Active AI</Badge>
          </div>
          
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {investmentMemos.filter(m => m.aiAssistance.totalAiContent > 0).length}
              </div>
              <div className="text-sm text-gray-600">AI-Enhanced Memos</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {investmentMemos.reduce((acc, memo) => acc + memo.aiAssistance.sectionsGenerated.length, 0)}
              </div>
              <div className="text-sm text-gray-600">AI Sections Generated</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {Math.round(investmentMemos.reduce((acc, memo) => acc + (memo.aiAssistance.totalAiContent > 0 ? 180 : 0), 0) / 60)}h
              </div>
              <div className="text-sm text-gray-600">Time Saved</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {investmentMemos.filter(m => m.workProduct.completionPercentage >= 90).length}
              </div>
              <div className="text-sm text-gray-600">Near Complete</div>
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
              <FileText className="w-4 h-4 text-purple-600" />
            </div>
            <div className="flex-1">
              <div className="bg-purple-50 rounded-lg p-4 mb-4">
                <p className="text-sm mb-2">
                  <strong>Memo Creation Status:</strong> {investmentMemos.length} active investment memos with {investmentMemos.filter(m => m.aiAssistance.totalAiContent > 50).length} AI-generated.
                </p>
                <p className="text-sm">
                  AI has completed {investmentMemos.reduce((acc, memo) => acc + memo.aiAssistance.sectionsGenerated.length, 0)} memo sections, saving approximately {Math.round(investmentMemos.reduce((acc, memo) => acc + (memo.aiAssistance.totalAiContent > 0 ? 180 : 0), 0) / 60)} hours of writing time.
                </p>
              </div>

              {/* Recent AI Activities */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                <h4 className="font-medium text-green-800 mb-3 flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Recent AI Completions
                </h4>
                <div className="space-y-2 text-sm text-green-700">
                  <div>• CloudTech Solutions memo: Executive summary and investment thesis generated</div>
                  <div>• HealthTech Innovations: Market analysis and risk assessment completed</div>
                  <div>• 4 memo sections enhanced with improved content and analysis</div>
                  <div>• All memos automatically formatted and structured</div>
                </div>
              </div>

              {/* Upcoming AI Actions */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-800 mb-3 flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  AI Writing Schedule
                </h4>
                <div className="space-y-2 text-sm text-blue-700">
                  <div>• Daily: Content quality analysis and improvement suggestions</div>
                  <div>• Weekly: Memo structure optimization and consistency checks</div>
                  <div>• On-demand: New memo creation from deal data and templates</div>
                  <div>• Real-time: Content generation for incomplete sections</div>
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