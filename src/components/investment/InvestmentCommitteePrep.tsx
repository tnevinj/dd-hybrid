'use client'

import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useNavigationStore } from '@/stores/navigation-store'
import { 
  Users,
  FileText,
  Calendar,
  Clock,
  CheckCircle,
  AlertTriangle,
  Brain,
  Zap,
  Target,
  TrendingUp,
  BarChart3,
  PieChart,
  DollarSign,
  Percent,
  Building,
  Star,
  Award,
  Eye,
  Edit,
  Download,
  Send,
  Mail,
  MessageSquare,
  Play,
  Pause,
  RefreshCw,
  Lightbulb,
  Sparkles,
  Filter,
  Search,
  Plus,
  ChevronRight,
  ChevronDown,
  MoreHorizontal,
  Briefcase,
  Globe,
  MapPin,
  Activity,
  Database,
  FileCheck,
  Presentation,
  ThumbsUp,
  ThumbsDown,
  Scale,
  Shield
} from 'lucide-react'

interface InvestmentMemo {
  id: string
  dealId: string
  companyName: string
  memoType: 'initial' | 'full_investment' | 'follow_on' | 'exit'
  version: number
  status: 'draft' | 'review' | 'finalized' | 'approved' | 'rejected'
  
  // Content sections
  content: {
    executiveSummary: string
    investmentThesis: string
    marketAnalysis: string
    businessModel: string
    financialAnalysis: string
    managementAssessment: string
    riskAnalysis: string
    valueCreationPlan: string
    exitStrategy: string
    recommendation: 'strong_buy' | 'buy' | 'hold' | 'pass'
  }
  
  // Key metrics
  keyMetrics: {
    dealSize: number
    valuation: number
    ownership: number
    targetIRR: number
    targetMultiple: number
    holdPeriod: number
    revenue: number
    revenueGrowth: number
    ebitda: number
    ebitdaMargin: number
  }
  
  // Committee details
  committee: {
    meetingDate?: Date
    presenter: string
    attendees: string[]
    duration: number // minutes
    materialsDue: Date
    votingMembers: string[]
  }
  
  // AI assistance
  aiGenerated?: {
    contentSections: string[]
    confidence: number
    timeGenerated: Date
    reviewRequired: string[]
    suggestedEdits: string[]
  }
  
  // Process tracking
  timeline: {
    created: Date
    lastModified: Date
    submitted?: Date
    reviewed?: Date
    approved?: Date
  }
  
  comments: {
    id: string
    author: string
    comment: string
    section: string
    timestamp: Date
    resolved: boolean
  }[]
  
  attachments: {
    name: string
    type: string
    size: string
    uploadedAt: Date
    category: 'financials' | 'market_research' | 'legal' | 'technical' | 'other'
  }[]
}

interface ICMeeting {
  id: string
  meetingDate: Date
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled'
  agenda: {
    id: string
    itemType: 'investment' | 'portfolio_update' | 'market_review' | 'admin'
    dealId?: string
    companyName?: string
    presenter: string
    timeAllocated: number
    materials: string[]
    decision?: 'approved' | 'rejected' | 'deferred'
    conditions?: string[]
  }[]
  
  // Attendees
  attendees: {
    name: string
    role: string
    attendance: 'attending' | 'remote' | 'absent' | 'pending'
    votingMember: boolean
  }[]
  
  // Meeting logistics
  logistics: {
    duration: number
    location: string
    virtualLink?: string
    materials: string[]
    deadline: Date
    coordinator: string
  }
  
  // AI preparation
  aiPrep?: {
    agendaOptimized: boolean
    materialsReviewed: boolean
    comparativeAnalysis: string[]
    riskAssessment: string[]
    recommendedQuestions: string[]
    marketContext: string[]
  }
  
  // Outcomes
  outcomes?: {
    decisionsCount: number
    approvalsCount: number
    deferralsCount: number
    totalValue: number
    followUpActions: string[]
    nextMeeting?: Date
  }
}

interface CommitteeMember {
  id: string
  name: string
  role: string
  expertise: string[]
  votingWeight: number
  attendance: {
    totalMeetings: number
    attended: number
    attendanceRate: number
  }
  
  // Decision patterns (AI analysis)
  patterns?: {
    sectors: string[]
    dealSizes: { min: number; max: number }
    avgApprovalTime: number
    keyQuestions: string[]
    riskTolerance: 'low' | 'medium' | 'high'
    focusAreas: string[]
  }
}

interface InvestmentCommitteePrepProps {
  fundId?: string
}

export function InvestmentCommitteePrep({ fundId }: InvestmentCommitteePrepProps) {
  const { currentMode, trackInteraction, addRecommendation } = useNavigationStore()
  const [selectedView, setSelectedView] = React.useState<'memos' | 'meetings' | 'members' | 'dashboard'>('dashboard')
  const [selectedMemo, setSelectedMemo] = React.useState<string | null>(null)
  const [expandedMemos, setExpandedMemos] = React.useState<Set<string>>(new Set())
  const [aiAssisting, setAiAssisting] = React.useState(false)

  // Sample investment memos
  const [investmentMemos] = React.useState<InvestmentMemo[]>([
    {
      id: 'memo-001',
      dealId: 'deal-001',
      companyName: 'DataFlow Technologies',
      memoType: 'full_investment',
      version: 3,
      status: 'review',
      content: {
        executiveSummary: 'DataFlow Technologies represents a compelling growth investment opportunity in the rapidly expanding data analytics market...',
        investmentThesis: 'Leading position in enterprise data analytics with strong technology moat and experienced management team',
        marketAnalysis: 'The global data analytics market is expected to grow at 25% CAGR through 2028, driven by digital transformation initiatives',
        businessModel: 'SaaS-based enterprise data analytics platform with recurring revenue model and strong unit economics',
        financialAnalysis: 'Revenue growth of 67% with improving margins and path to profitability by Q4 2026',
        managementAssessment: 'Experienced leadership team with proven track record in scaling B2B SaaS companies',
        riskAnalysis: 'Key risks include customer concentration, competitive pressure from incumbents, and talent retention',
        valueCreationPlan: 'International expansion, product development, and strategic partnerships to accelerate growth',
        exitStrategy: 'Strategic sale to large enterprise software company or IPO in 4-5 years',
        recommendation: 'strong_buy'
      },
      keyMetrics: {
        dealSize: 45000000,
        valuation: 150000000,
        ownership: 30,
        targetIRR: 25,
        targetMultiple: 3.2,
        holdPeriod: 5,
        revenue: 18500000,
        revenueGrowth: 67,
        ebitda: 4200000,
        ebitdaMargin: 23
      },
      committee: {
        meetingDate: new Date('2025-07-30'),
        presenter: 'Sarah Johnson',
        attendees: ['Michael Chen', 'David Miller', 'Jennifer Rodriguez', 'Alex Thompson'],
        duration: 45,
        materialsDue: new Date('2025-07-28'),
        votingMembers: ['Michael Chen', 'David Miller', 'Jennifer Rodriguez']
      },
      aiGenerated: {
        contentSections: ['marketAnalysis', 'businessModel', 'riskAnalysis'],
        confidence: 0.89,
        timeGenerated: new Date('2025-07-20T14:30:00'),
        reviewRequired: ['financialAnalysis', 'managementAssessment'],
        suggestedEdits: [
          'Add customer reference validation data',
          'Include competitive positioning analysis',
          'Expand on technology differentiation'
        ]
      },
      timeline: {
        created: new Date('2025-07-15'),
        lastModified: new Date('2025-07-20'),
        submitted: new Date('2025-07-21')
      },
      comments: [
        {
          id: 'comment-001',
          author: 'Michael Chen',
          comment: 'Need more detail on customer concentration risk mitigation',
          section: 'riskAnalysis',
          timestamp: new Date('2025-07-21T10:30:00'),
          resolved: false
        },
        {
          id: 'comment-002',
          author: 'David Miller',
          comment: 'Financial projections look aggressive - can we validate assumptions?',
          section: 'financialAnalysis',
          timestamp: new Date('2025-07-21T11:15:00'),
          resolved: false
        }
      ],
      attachments: [
        { name: 'DataFlow_Financials_2024.xlsx', type: 'excel', size: '2.4 MB', uploadedAt: new Date('2025-07-20'), category: 'financials' },
        { name: 'Market_Research_Report.pdf', type: 'pdf', size: '8.1 MB', uploadedAt: new Date('2025-07-19'), category: 'market_research' },
        { name: 'Management_Presentations.pptx', type: 'powerpoint', size: '15.2 MB', uploadedAt: new Date('2025-07-18'), category: 'other' }
      ]
    },
    {
      id: 'memo-002',
      dealId: 'deal-002',
      companyName: 'HealthCare Solutions Inc',
      memoType: 'full_investment',
      version: 1,
      status: 'draft',
      content: {
        executiveSummary: 'HealthCare Solutions presents a defensive healthcare IT investment with strong recurring revenue characteristics...',
        investmentThesis: 'Market-leading healthcare IT platform with defensive moat and consolidation opportunities',
        marketAnalysis: 'Healthcare IT market growing at 15% CAGR driven by digital transformation and regulatory requirements',
        businessModel: 'Subscription-based healthcare IT solutions with high switching costs and customer stickiness',
        financialAnalysis: 'Stable 23% revenue growth with strong margins and predictable cash flows',
        managementAssessment: 'Seasoned healthcare IT management team with deep industry relationships',
        riskAnalysis: 'Regulatory compliance risks and potential for technology disruption from new entrants',
        valueCreationPlan: 'Add-on acquisitions, product expansion, and operational improvements',
        exitStrategy: 'Strategic sale to healthcare conglomerate or private equity exit',
        recommendation: 'buy'
      },
      keyMetrics: {
        dealSize: 125000000,
        valuation: 180000000,
        ownership: 70,
        targetIRR: 22,
        targetMultiple: 2.8,
        holdPeriod: 4,
        revenue: 28500000,
        revenueGrowth: 23,
        ebitda: 8200000,
        ebitdaMargin: 29
      },
      committee: {
        meetingDate: new Date('2025-08-15'),
        presenter: 'Mike Chen',
        attendees: ['Michael Chen', 'David Miller', 'Jennifer Rodriguez'],
        duration: 30,
        materialsDue: new Date('2025-08-13'),
        votingMembers: ['Michael Chen', 'David Miller', 'Jennifer Rodriguez']
      },
      timeline: {
        created: new Date('2025-07-18'),
        lastModified: new Date('2025-07-22')
      },
      comments: [],
      attachments: []
    }
  ])

  // Sample IC meetings
  const [icMeetings] = React.useState<ICMeeting[]>([
    {
      id: 'meeting-001',
      meetingDate: new Date('2025-07-30'),
      status: 'scheduled',
      agenda: [
        {
          id: 'agenda-001',
          itemType: 'investment',
          dealId: 'deal-001',
          companyName: 'DataFlow Technologies',
          presenter: 'Sarah Johnson',
          timeAllocated: 45,
          materials: ['Investment Memo v3', 'Financial Model', 'Market Analysis']
        },
        {
          id: 'agenda-002',
          itemType: 'portfolio_update',
          companyName: 'CloudTech Solutions',
          presenter: 'Alex Thompson',
          timeAllocated: 15,
          materials: ['Q2 Board Pack', 'Performance Summary']
        },
        {
          id: 'agenda-003',
          itemType: 'market_review',
          presenter: 'Jennifer Rodriguez',
          timeAllocated: 20,
          materials: ['Q2 Market Update', 'Sector Analysis']
        }
      ],
      attendees: [
        { name: 'Michael Chen', role: 'Managing Partner', attendance: 'attending', votingMember: true },
        { name: 'David Miller', role: 'Investment Partner', attendance: 'attending', votingMember: true },
        { name: 'Jennifer Rodriguez', role: 'Principal', attendance: 'remote', votingMember: true },
        { name: 'Sarah Johnson', role: 'VP', attendance: 'attending', votingMember: false },
        { name: 'Alex Thompson', role: 'Associate', attendance: 'attending', votingMember: false }
      ],
      logistics: {
        duration: 120,
        location: 'Conference Room A',
        virtualLink: 'https://zoom.us/j/123456789',
        materials: ['Meeting Pack', 'Agenda', 'Previous Minutes'],
        deadline: new Date('2025-07-28'),
        coordinator: 'Sarah Johnson'
      },
      aiPrep: {
        agendaOptimized: true,
        materialsReviewed: true,
        comparativeAnalysis: ['Similar data analytics investments', 'Recent SaaS valuations', 'Market comparable deals'],
        riskAssessment: ['Customer concentration analysis', 'Competitive landscape review', 'Market timing considerations'],
        recommendedQuestions: [
          'How defensible is the technology moat?',
          'What is the customer acquisition strategy?',
          'How do we mitigate key person risk?'
        ],
        marketContext: ['Data analytics market trends', 'Recent M&A activity', 'Valuation multiples evolution']
      }
    },
    {
      id: 'meeting-002',
      meetingDate: new Date('2025-08-15'),
      status: 'scheduled',
      agenda: [
        {
          id: 'agenda-004',
          itemType: 'investment',
          dealId: 'deal-002',
          companyName: 'HealthCare Solutions Inc',
          presenter: 'Mike Chen',
          timeAllocated: 30,
          materials: ['Investment Memo v1', 'Due Diligence Summary']
        }
      ],
      attendees: [
        { name: 'Michael Chen', role: 'Managing Partner', attendance: 'pending', votingMember: true },
        { name: 'David Miller', role: 'Investment Partner', attendance: 'pending', votingMember: true },
        { name: 'Jennifer Rodriguez', role: 'Principal', attendance: 'pending', votingMember: true }
      ],
      logistics: {
        duration: 60,
        location: 'Conference Room B',
        materials: [],
        deadline: new Date('2025-08-13'),
        coordinator: 'Mike Chen'
      }
    }
  ])

  // Sample committee members
  const [committeeMembers] = React.useState<CommitteeMember[]>([
    {
      id: 'member-001',
      name: 'Michael Chen',
      role: 'Managing Partner',
      expertise: ['Technology', 'Healthcare', 'B2B SaaS'],
      votingWeight: 1.0,
      attendance: {
        totalMeetings: 24,
        attended: 23,
        attendanceRate: 0.96
      },
      patterns: {
        sectors: ['Technology', 'Healthcare'],
        dealSizes: { min: 25000000, max: 200000000 },
        avgApprovalTime: 2.3,
        keyQuestions: ['Customer economics', 'Market defensibility', 'Management quality'],
        riskTolerance: 'medium',
        focusAreas: ['Revenue quality', 'Competitive moats', 'Scalability']
      }
    },
    {
      id: 'member-002',
      name: 'David Miller',
      role: 'Investment Partner',
      expertise: ['FinTech', 'Enterprise Software', 'Growth Equity'],
      votingWeight: 1.0,
      attendance: {
        totalMeetings: 24,
        attended: 22,
        attendanceRate: 0.92
      },
      patterns: {
        sectors: ['FinTech', 'Software'],
        dealSizes: { min: 50000000, max: 300000000 },
        avgApprovalTime: 1.8,
        keyQuestions: ['Financial projections', 'Unit economics', 'Exit strategy'],
        riskTolerance: 'low',
        focusAreas: ['Financial discipline', 'Risk management', 'Exit planning']
      }
    },
    {
      id: 'member-003',
      name: 'Jennifer Rodriguez',
      role: 'Principal',
      expertise: ['Consumer', 'Retail', 'E-commerce'],
      votingWeight: 1.0,
      attendance: {
        totalMeetings: 24,
        attended: 21,
        attendanceRate: 0.88
      },
      patterns: {
        sectors: ['Consumer', 'Retail'],
        dealSizes: { min: 15000000, max: 100000000 },
        avgApprovalTime: 2.7,
        keyQuestions: ['Brand strength', 'Customer loyalty', 'Market trends'],
        riskTolerance: 'high',
        focusAreas: ['Brand equity', 'Customer experience', 'Market positioning']
      }
    }
  ])

  // AI recommendations
  React.useEffect(() => {
    if (currentMode.mode !== 'traditional') {
      const pendingMemos = investmentMemos.filter(memo => 
        memo.status === 'draft' || (memo.status === 'review' && memo.comments.filter(c => !c.resolved).length > 0)
      )

      if (pendingMemos.length > 0) {
        addRecommendation({
          id: `ic-prep-${fundId}`,
          type: 'automation',
          priority: 'high',
          title: `${pendingMemos.length} Memos Need Preparation`,
          description: `AI can help complete memo sections, address committee comments, and prepare presentation materials.`,
          actions: [{
            id: 'complete-memos',
            label: 'AI Complete Memos',
            action: 'AI_COMPLETE_MEMOS',
            primary: true,
            estimatedTimeSaving: pendingMemos.length * 180
          }, {
            id: 'review-comments',
            label: 'Address Comments',
            action: 'ADDRESS_MEMO_COMMENTS'
          }],
          confidence: 0.91,
          moduleContext: 'investment-committee',
          timestamp: new Date()
        })
      }

      // Meeting preparation
      const upcomingMeetings = icMeetings.filter(meeting => 
        meeting.status === 'scheduled' && 
        meeting.meetingDate > new Date() &&
        (meeting.meetingDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24) <= 7
      )

      if (upcomingMeetings.length > 0) {
        addRecommendation({
          id: `meeting-prep-${fundId}`,
          type: 'suggestion',
          priority: 'high',
          title: 'IC Meeting This Week',
          description: `Upcoming investment committee meeting on ${upcomingMeetings[0].meetingDate.toISOString().split('T')[0]}. AI can optimize agenda and prepare briefing materials.`,
          actions: [{
            id: 'prepare-meeting',
            label: 'Prepare Meeting',
            action: 'PREPARE_IC_MEETING',
            primary: true
          }],
          confidence: 0.88,
          moduleContext: 'investment-committee',
          timestamp: new Date()
        })
      }

      // AI memo generation opportunity
      const draftMemos = investmentMemos.filter(memo => memo.status === 'draft')
      if (draftMemos.length > 0) {
        addRecommendation({
          id: `ai-memo-gen-${fundId}`,
          type: 'automation',
          priority: 'medium',
          title: 'AI Memo Generation Available',
          description: `AI can generate comprehensive investment memo sections based on due diligence findings and market data.`,
          actions: [{
            id: 'generate-memo-sections',
            label: 'Generate Memo Sections',
            action: 'GENERATE_AI_MEMO_SECTIONS',
            estimatedTimeSaving: 240
          }],
          confidence: 0.85,
          moduleContext: 'investment-committee',
          timestamp: new Date()
        })
      }
    }
  }, [currentMode.mode, fundId, addRecommendation])

  const handleMemoAction = (memoId: string, action: string) => {
    trackInteraction({
      interactionType: 'automation_approved',
      userAction: 'accepted',
      module: 'investment-committee',
      context: {
        action,
        memoId,
        memosCount: investmentMemos.length
      }
    })
  }

  const handleAIAssist = async () => {
    setAiAssisting(true)
    trackInteraction({
      interactionType: 'automation_approved',
      userAction: 'accepted',
      module: 'investment-committee',
      context: {
        action: 'ai_memo_assistance',
        memosCount: investmentMemos.length
      }
    })

    // Simulate AI processing
    setTimeout(() => {
      setAiAssisting(false)
    }, 3000)
  }

  const toggleMemoExpansion = (memoId: string) => {
    const newExpanded = new Set(expandedMemos)
    if (newExpanded.has(memoId)) {
      newExpanded.delete(memoId)
    } else {
      newExpanded.add(memoId)
    }
    setExpandedMemos(newExpanded)
  }

  const getStatusColor = (status: InvestmentMemo['status']) => {
    switch (status) {
      case 'draft': return 'text-gray-600 bg-gray-50 border-gray-200'
      case 'review': return 'text-orange-600 bg-orange-50 border-orange-200'
      case 'finalized': return 'text-blue-600 bg-blue-50 border-blue-200'
      case 'approved': return 'text-green-600 bg-green-50 border-green-200'
      case 'rejected': return 'text-red-600 bg-red-50 border-red-200'
    }
  }

  const getRecommendationColor = (rec: InvestmentMemo['content']['recommendation']) => {
    switch (rec) {
      case 'strong_buy': return 'text-green-800 bg-green-100'
      case 'buy': return 'text-blue-800 bg-blue-100'
      case 'hold': return 'text-yellow-800 bg-yellow-100'
      case 'pass': return 'text-red-800 bg-red-100'
    }
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

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* IC Dashboard Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{investmentMemos.length}</div>
            <div className="text-sm text-gray-600">Active Memos</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {icMeetings.filter(m => m.status === 'scheduled').length}
            </div>
            <div className="text-sm text-gray-600">Scheduled Meetings</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">
              {investmentMemos.filter(m => m.status === 'review').length}
            </div>
            <div className="text-sm text-gray-600">Under Review</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">
              {investmentMemos.reduce((sum, memo) => sum + memo.comments.filter(c => !c.resolved).length, 0)}
            </div>
            <div className="text-sm text-gray-600">Open Comments</div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Meetings */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Upcoming IC Meetings</CardTitle>
            <Button variant="outline" size="sm" onClick={() => setSelectedView('meetings')}>
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {icMeetings.filter(m => m.status === 'scheduled').slice(0, 2).map((meeting) => (
              <div key={meeting.id} className="flex items-center justify-between p-4 border rounded">
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  <div>
                    <h4 className="font-medium">{meeting.meetingDate.toISOString().split('T')[0]}</h4>
                    <p className="text-sm text-gray-600">
                      {meeting.agenda.length} items • {meeting.logistics.duration} minutes
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className="text-xs bg-blue-100 text-blue-800">
                    {meeting.attendees.filter(a => a.attendance === 'attending').length} attending
                  </Badge>
                  <Button size="sm">Prepare</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Memo Status */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Investment Memos Status</CardTitle>
            <Button variant="outline" size="sm" onClick={() => setSelectedView('memos')}>
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {investmentMemos.slice(0, 3).map((memo) => (
              <div key={memo.id} className="flex items-center justify-between p-3 border rounded">
                <div className="flex items-center space-x-3">
                  <FileText className="w-5 h-5 text-purple-600" />
                  <div>
                    <h4 className="font-medium">{memo.companyName}</h4>
                    <p className="text-sm text-gray-600">
                      v{memo.version} • {memo.memoType.replace('_', ' ')} • {memo.timeline.lastModified.toISOString().split('T')[0]}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={`text-xs ${getStatusColor(memo.status)}`}>
                    {memo.status.replace('_', ' ')}
                  </Badge>
                  {memo.comments.filter(c => !c.resolved).length > 0 && (
                    <Badge variant="outline" className="text-xs">
                      {memo.comments.filter(c => !c.resolved).length} comments
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderMemoCard = (memo: InvestmentMemo) => (
    <Card key={memo.id} className={`
      transition-all duration-200 hover:shadow-md
      ${memo.aiGenerated ? 'border-l-4 border-l-purple-400' : ''}
      ${memo.status === 'review' ? 'border-l-4 border-l-orange-400' : ''}
    `}>
      <CardHeader 
        className="cursor-pointer"
        onClick={() => toggleMemoExpansion(memo.id)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <FileText className="w-5 h-5 text-purple-600" />
            <div>
              <CardTitle className="text-lg">{memo.companyName}</CardTitle>
              <p className="text-sm text-gray-600">
                {memo.memoType.replace('_', ' ')} • v{memo.version} • {formatCurrency(memo.keyMetrics.dealSize)}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Badge className={`text-sm ${getRecommendationColor(memo.content.recommendation)}`}>
              {memo.content.recommendation.replace('_', ' ')}
            </Badge>
            <Badge className={`text-xs ${getStatusColor(memo.status)}`}>
              {memo.status.replace('_', ' ')}
            </Badge>
            {memo.aiGenerated && (
              <Badge variant="ai" className="text-xs">
                AI: {Math.round(memo.aiGenerated.confidence * 100)}%
              </Badge>
            )}
            {expandedMemos.has(memo.id) ? 
              <ChevronDown className="w-4 h-4" /> : 
              <ChevronRight className="w-4 h-4" />
            }
          </div>
        </div>
      </CardHeader>

      {expandedMemos.has(memo.id) && (
        <CardContent>
          <div className="space-y-4">
            {/* Key Metrics */}
            <div>
              <h4 className="font-medium mb-3">Investment Summary</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Deal Size:</span>
                  <div className="font-medium">{formatCurrency(memo.keyMetrics.dealSize)}</div>
                </div>
                <div>
                  <span className="text-gray-600">Ownership:</span>
                  <div className="font-medium">{memo.keyMetrics.ownership}%</div>
                </div>
                <div>
                  <span className="text-gray-600">Target IRR:</span>
                  <div className="font-medium">{memo.keyMetrics.targetIRR}%</div>
                </div>
                <div>
                  <span className="text-gray-600">Target Multiple:</span>
                  <div className="font-medium">{memo.keyMetrics.targetMultiple}x</div>
                </div>
              </div>
            </div>

            {/* Investment Thesis */}
            <div>
              <h4 className="font-medium mb-2">Investment Thesis</h4>
              <p className="text-sm text-gray-600">{memo.content.investmentThesis}</p>
            </div>

            {/* AI Generated Content */}
            {memo.aiGenerated && currentMode.mode !== 'traditional' && (
              <div className="p-3 bg-purple-50 rounded">
                <h4 className="font-medium mb-3 text-purple-800 flex items-center">
                  <Brain className="w-4 h-4 mr-1" />
                  AI Assistance
                  <Badge className="ml-2 text-xs bg-purple-100 text-purple-800">
                    {Math.round(memo.aiGenerated.confidence * 100)}% confidence
                  </Badge>
                </h4>
                
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="font-medium text-purple-700">AI Generated Sections:</span>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {memo.aiGenerated.contentSections.map((section) => (
                        <Badge key={section} variant="secondary" className="text-xs">
                          {section.replace(/([A-Z])/g, ' $1').trim()}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  {memo.aiGenerated.suggestedEdits.length > 0 && (
                    <div>
                      <span className="font-medium text-purple-700">Suggested Improvements:</span>
                      <ul className="mt-1 text-purple-600 space-y-1">
                        {memo.aiGenerated.suggestedEdits.slice(0, 3).map((edit, index) => (
                          <li key={index} className="text-xs">• {edit}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Committee Comments */}
            {memo.comments.length > 0 && (
              <div>
                <h4 className="font-medium mb-2 flex items-center">
                  Committee Comments
                  <Badge variant="outline" className="ml-2 text-xs">
                    {memo.comments.filter(c => !c.resolved).length} unresolved
                  </Badge>
                </h4>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {memo.comments.map((comment) => (
                    <div key={comment.id} className="p-2 border-l-4 border-l-orange-400 bg-orange-50 text-sm">
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-medium">{comment.author}</span>
                        <span className="text-xs text-gray-500">{comment.section}</span>
                      </div>
                      <p className="text-gray-700">{comment.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Committee Meeting Info */}
            {memo.committee.meetingDate && (
              <div>
                <h4 className="font-medium mb-2">Committee Presentation</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Meeting Date:</span>
                    <div className="font-medium">{memo.committee.meetingDate.toISOString().split('T')[0]}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Duration:</span>
                    <div className="font-medium">{memo.committee.duration} minutes</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Presenter:</span>
                    <div className="font-medium">{memo.committee.presenter}</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Materials Due:</span>
                    <div className="font-medium">{memo.committee.materialsDue.toISOString().split('T')[0]}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex space-x-2 pt-3 border-t">
              <Button 
                size="sm"
                onClick={() => handleMemoAction(memo.id, 'edit_memo')}
              >
                <Edit className="w-4 h-4 mr-1" />
                Edit Memo
              </Button>
              <Button variant="outline" size="sm">
                <Eye className="w-4 h-4 mr-1" />
                Preview
              </Button>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-1" />
                Export PDF
              </Button>
              <Button variant="outline" size="sm">
                <Send className="w-4 h-4 mr-1" />
                Submit
              </Button>
              {currentMode.mode !== 'traditional' && memo.status === 'draft' && (
                <Button 
                  variant="ai" 
                  size="sm"
                  onClick={() => handleMemoAction(memo.id, 'ai_complete_memo')}
                >
                  <Sparkles className="w-4 h-4 mr-1" />
                  AI Complete
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  )

  const renderTraditionalView = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Investment Committee</h2>
          <p className="text-gray-600">Prepare investment memos and manage committee meetings</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Plus className="w-4 h-4 mr-2" />
            New Memo
          </Button>
          <Button variant="outline" size="sm">
            <Calendar className="w-4 h-4 mr-2" />
            Schedule Meeting
          </Button>
        </div>
      </div>

      {/* View Tabs */}
      <div className="flex space-x-4">
        {[
          { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
          { id: 'memos', label: 'Memos', icon: FileText },
          { id: 'meetings', label: 'Meetings', icon: Calendar },
          { id: 'members', label: 'Members', icon: Users }
        ].map(({ id, label, icon: Icon }) => (
          <Button
            key={id}
            variant={selectedView === id ? 'default' : 'outline'}
            onClick={() => setSelectedView(id as any)}
            className="flex items-center"
          >
            <Icon className="w-4 h-4 mr-2" />
            {label}
          </Button>
        ))}
      </div>

      {/* View Content */}
      {selectedView === 'dashboard' && renderDashboard()}
      
      {selectedView === 'memos' && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Investment Memos ({investmentMemos.length})</h3>
          <div className="space-y-4">
            {investmentMemos.map(renderMemoCard)}
          </div>
        </div>
      )}

      {selectedView === 'meetings' && (
        <div>
          <h3 className="text-lg font-semibold mb-4">IC Meetings</h3>
          <div className="space-y-4">
            {icMeetings.map((meeting) => (
              <Card key={meeting.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="font-medium">{meeting.meetingDate.toISOString().split('T')[0]}</h4>
                      <p className="text-sm text-gray-600">
                        {meeting.logistics.duration} minutes • {meeting.logistics.location}
                      </p>
                    </div>
                    <Badge className={`text-sm ${
                      meeting.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                      meeting.status === 'completed' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {meeting.status}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <h5 className="font-medium">Agenda Items ({meeting.agenda.length})</h5>
                    {meeting.agenda.map((item) => (
                      <div key={item.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <div>
                          <span className="font-medium">{item.companyName || item.itemType}</span>
                          <span className="text-sm text-gray-600 ml-2">• {item.presenter}</span>
                        </div>
                        <span className="text-sm">{item.timeAllocated}min</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {selectedView === 'members' && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Committee Members</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {committeeMembers.map((member) => (
              <Card key={member.id}>
                <CardContent className="p-4">
                  <div className="text-center mb-4">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Users className="w-8 h-8 text-blue-600" />
                    </div>
                    <h4 className="font-medium">{member.name}</h4>
                    <p className="text-sm text-gray-600">{member.role}</p>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-gray-600">Attendance:</span>
                      <span className="ml-1 font-medium">{Math.round(member.attendance.attendanceRate * 100)}%</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Expertise:</span>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {member.expertise.map((skill) => (
                          <Badge key={skill} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )

  const renderAssistedView = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold flex items-center">
            <Brain className="w-5 h-5 mr-2 text-purple-500" />
            AI Investment Committee
            <Badge variant="ai" className="ml-3">Smart Preparation</Badge>
          </h2>
          <p className="text-gray-600">AI-powered memo writing and meeting preparation</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button 
            onClick={handleAIAssist}
            disabled={aiAssisting}
            variant="ai"
          >
            {aiAssisting ? (
              <Clock className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4 mr-2" />
            )}
            AI Memo Assistant
          </Button>
          <Button variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh Insights
          </Button>
        </div>
      </div>

      {/* AI IC Assistant */}
      <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-blue-50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Brain className="w-6 h-6 text-purple-600" />
              <div>
                <h3 className="font-semibold text-purple-800">AI Investment Committee Assistant</h3>
                <p className="text-sm text-purple-600">
                  Managing {investmentMemos.length} memos and {icMeetings.filter(m => m.status === 'scheduled').length} upcoming meetings
                </p>
              </div>
            </div>
            <Badge variant="ai">95% Accuracy</Badge>
          </div>
          
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {investmentMemos.filter(m => m.aiGenerated).length}
              </div>
              <div className="text-sm text-gray-600">AI Generated</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {investmentMemos.reduce((sum, m) => sum + m.comments.filter(c => !c.resolved).length, 0)}
              </div>
              <div className="text-sm text-gray-600">Comments to Address</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {icMeetings.filter(m => m.aiPrep?.agendaOptimized).length}
              </div>
              <div className="text-sm text-gray-600">AI Optimized</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {Math.round(investmentMemos.filter(m => m.aiGenerated).reduce((sum, m) => sum + (m.aiGenerated?.confidence || 0), 0) / Math.max(1, investmentMemos.filter(m => m.aiGenerated).length) * 100)}%
              </div>
              <div className="text-sm text-gray-600">Avg AI Confidence</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Processing Status */}
      {aiAssisting && (
        <Card className="border-purple-200 bg-purple-50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Clock className="w-5 h-5 text-purple-600 animate-spin" />
              <div>
                <h3 className="font-semibold text-purple-800">AI Processing Memos</h3>
                <p className="text-sm text-purple-600">
                  Analyzing deal data, market research, and generating investment memo sections...
                </p>
              </div>
            </div>
            <div className="mt-2 bg-purple-200 rounded-full h-2">
              <div className="bg-purple-600 h-2 rounded-full animate-pulse" style={{ width: '75%' }} />
            </div>
          </CardContent>
        </Card>
      )}

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
              <Users className="w-4 h-4 text-purple-600" />
            </div>
            <div className="flex-1">
              <div className="bg-purple-50 rounded-lg p-4 mb-4">
                <p className="text-sm mb-2">
                  <strong>IC Preparation Status:</strong> {investmentMemos.filter(m => m.status === 'finalized').length} memos ready for committee review.
                </p>
                <p className="text-sm">
                  Next meeting: {icMeetings.find(m => m.status === 'scheduled')?.meetingDate.toISOString().split('T')[0]} with {icMeetings.find(m => m.status === 'scheduled')?.agenda.length} agenda items.
                </p>
              </div>

              {/* Actions Required */}
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
                <h4 className="font-medium text-orange-800 mb-3 flex items-center">
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Actions Required Before Committee
                </h4>
                <div className="space-y-3">
                  {investmentMemos
                    .filter(m => m.status === 'review' || m.comments.filter(c => !c.resolved).length > 0)
                    .map((memo) => (
                    <div key={memo.id} className="bg-white rounded p-3">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-medium">{memo.companyName}</h5>
                        <Badge className="bg-orange-100 text-orange-800 text-xs">{memo.status}</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        {memo.comments.filter(c => !c.resolved).length} unresolved comments
                      </p>
                      <div className="flex space-x-2">
                        <Button size="sm">Address Comments</Button>
                        <Button size="sm" variant="outline">AI Complete</Button>
                        <Button size="sm" variant="outline">Schedule Review</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Meeting Preparation */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-800 mb-3 flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  Meeting Preparation Complete
                </h4>
                <div className="space-y-2 text-sm text-blue-700">
                  <div>• Agenda optimized for maximum efficiency</div>
                  <div>• Materials distributed to all voting members</div>
                  <div>• Comparative analysis prepared for all deals</div>
                  <div>• Recommended questions generated for each proposal</div>
                  <div>• Market context and risk assessments updated</div>
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