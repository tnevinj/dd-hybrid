'use client'

import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useNavigationStore } from '@/stores/navigation-store'
import { 
  AlertTriangle,
  CheckCircle,
  Clock,
  Brain,
  Zap,
  Target,
  TrendingUp,
  BarChart3,
  FileText,
  Users,
  DollarSign,
  Shield,
  Lightbulb,
  Sparkles,
  RefreshCw,
  Download,
  Eye,
  Edit,
  Copy,
  Play,
  Pause,
  Settings,
  ChevronRight,
  ChevronDown,
  ArrowRight,
  MessageSquare,
  Calendar,
  Star,
  Filter,
  Search,
  Plus,
  MoreHorizontal,
  Wand2,
  BookOpen,
  Globe
} from 'lucide-react'

interface Finding {
  id: string
  title: string
  description: string
  category: 'financial' | 'commercial' | 'legal' | 'technical' | 'operational' | 'strategic'
  severity: 'low' | 'medium' | 'high' | 'critical'
  status: 'draft' | 'under_review' | 'approved' | 'disputed' | 'resolved'
  
  // AI generation details
  aiGenerated: boolean
  confidence: number
  generationMethod: 'document_analysis' | 'pattern_matching' | 'risk_assessment' | 'benchmark_analysis' | 'manual'
  sourceData: string[]
  
  // Impact assessment
  impact: {
    financial: number // estimated $ impact
    operational: 'low' | 'medium' | 'high'
    strategic: 'low' | 'medium' | 'high'
    timeline: string
  }
  
  // Evidence and support
  evidence: {
    documents: string[]
    dataPoints: string[]
    benchmarks: string[]
    precedents: string[]
  }
  
  // Recommendations
  recommendations: {
    immediate: string[]
    shortTerm: string[]
    longTerm: string[]
  }
  
  // Management response
  managementResponse?: {
    status: 'pending' | 'received' | 'satisfactory' | 'unsatisfactory'
    response: string
    followUpRequired: boolean
    dueDate?: Date
  }
  
  // Workflow tracking
  createdAt: Date
  createdBy: string
  lastUpdated: Date
  reviewers: string[]
  approvedBy?: string
  approvedAt?: Date
}

interface AutomatedFindingsGenerationProps {
  projectId: string
  dealData: {
    name: string
    sector: string
    revenue: number
    growth: number
  }
}

export function AutomatedFindingsGeneration({ projectId, dealData }: AutomatedFindingsGenerationProps) {
  const { currentMode, trackInteraction, addRecommendation } = useNavigationStore()
  const [generationRunning, setGenerationRunning] = React.useState(false)
  const [selectedCategory, setSelectedCategory] = React.useState<string>('all')
  const [expandedFindings, setExpandedFindings] = React.useState<Set<string>>(new Set())
  const [filterStatus, setFilterStatus] = React.useState<string>('all')

  // Sample findings data with AI-generated findings
  const [findings] = React.useState<Finding[]>([
    {
      id: 'finding-001',
      title: 'Customer Concentration Risk',
      description: 'Top 3 customers represent 67% of total revenue, significantly exceeding industry benchmarks and creating substantial business risk.',
      category: 'financial',
      severity: 'high',
      status: 'approved',
      aiGenerated: true,
      confidence: 0.95,
      generationMethod: 'document_analysis',
      sourceData: ['customer-contracts.xlsx', 'revenue-analysis.pdf', 'management-presentation.pptx'],
      impact: {
        financial: -1400000,
        operational: 'high',
        strategic: 'high',
        timeline: 'Immediate risk if any major customer churns'
      },
      evidence: {
        documents: ['Customer Contract Analysis', 'Revenue Breakdown 2022-2024'],
        dataPoints: [
          'Customer A: 28% of revenue ($3.5M)',
          'Customer B: 21% of revenue ($2.6M)', 
          'Customer C: 18% of revenue ($2.3M)',
          'Industry benchmark: 15-20% for top customer'
        ],
        benchmarks: ['SaaS industry standard: <35% for top 3 customers'],
        precedents: ['Similar concentration led to 15% valuation discount in CloudCo deal']
      },
      recommendations: {
        immediate: [
          'Implement customer diversification strategy',
          'Strengthen relationships with top 3 customers',
          'Negotiate extended contract terms where possible'
        ],
        shortTerm: [
          'Expand mid-market customer acquisition',
          'Develop enterprise sales capability',
          'Create customer success programs'
        ],
        longTerm: [
          'Geographic expansion to reduce regional concentration',
          'Product diversification to attract new customer segments'
        ]
      },
      managementResponse: {
        status: 'received',
        response: 'Management acknowledges the risk and has initiated a customer diversification program. Timeline: 18-month plan to reduce top 3 to <50%.',
        followUpRequired: true,
        dueDate: new Date('2025-08-15')
      },
      createdAt: new Date('2025-07-21T10:30:00'),
      createdBy: 'AI Analysis Engine',
      lastUpdated: new Date('2025-07-21T14:20:00'),
      reviewers: ['Sarah Johnson', 'Mike Chen'],
      approvedBy: 'Sarah Johnson',
      approvedAt: new Date('2025-07-21T15:45:00')
    },
    {
      id: 'finding-002',
      title: 'EBITDA Margin Deterioration',
      description: 'EBITDA margins have declined from 28% to 23% over the past 18 months, indicating potential operational inefficiencies or competitive pressure.',
      category: 'financial',
      severity: 'medium',
      status: 'under_review',
      aiGenerated: true,
      confidence: 0.89,
      generationMethod: 'pattern_matching',
      sourceData: ['financial-statements-2024.pdf', 'p&l-analysis.xlsx'],
      impact: {
        financial: -800000,
        operational: 'medium',
        strategic: 'medium',
        timeline: 'Ongoing impact on profitability'
      },
      evidence: {
        documents: ['Financial Statements 2022-2024', 'Management Commentary'],
        dataPoints: [
          'Q1 2023: 28% EBITDA margin',
          'Q3 2023: 25% EBITDA margin',
          'Q1 2024: 23% EBITDA margin',
          'Primary drivers: increased S&M spend, higher cloud costs'
        ],
        benchmarks: ['Industry median: 25% for similar SaaS companies'],
        precedents: ['Similar decline pattern seen in SaasTech deal - attributed to market maturation']
      },
      recommendations: {
        immediate: [
          'Conduct detailed cost structure analysis',
          'Review S&M efficiency metrics',
          'Assess cloud infrastructure optimization opportunities'
        ],
        shortTerm: [
          'Implement cost optimization program',
          'Renegotiate key vendor contracts',
          'Automate routine operational processes'
        ],
        longTerm: [
          'Develop pricing power through differentiation',
          'Scale economies through growth',
          'Operational excellence initiatives'
        ]
      },
      managementResponse: {
        status: 'pending',
        response: '',
        followUpRequired: true,
        dueDate: new Date('2025-07-28')
      },
      createdAt: new Date('2025-07-21T09:15:00'),
      createdBy: 'AI Pattern Recognition',
      lastUpdated: new Date('2025-07-21T11:30:00'),
      reviewers: ['Alex Thompson'],
      approvedBy: undefined,
      approvedAt: undefined
    },
    {
      id: 'finding-003',
      title: 'Technology Architecture Scalability Concerns',
      description: 'Current technology stack shows signs of technical debt and may face scalability challenges as the business grows beyond 200% of current size.',
      category: 'technical',
      severity: 'medium',
      status: 'draft',
      aiGenerated: true,
      confidence: 0.82,
      generationMethod: 'risk_assessment',
      sourceData: ['tech-architecture-review.docx', 'infrastructure-assessment.pdf'],
      impact: {
        financial: -450000,
        operational: 'high',
        strategic: 'medium',
        timeline: '12-18 months before constraints manifest'
      },
      evidence: {
        documents: ['Technical Architecture Assessment', 'CTO Interview Notes'],
        dataPoints: [
          'Monolithic architecture limiting deployment flexibility',
          'Database performance issues at 2x current load',
          'Limited automated testing coverage (65%)',
          'Manual deployment processes'
        ],
        benchmarks: ['Best practice: microservices architecture for scalability'],
        precedents: ['Technical debt cost $2M+ in Enterprise Solutions modernization']
      },
      recommendations: {
        immediate: [
          'Complete comprehensive technical audit',
          'Prioritize critical performance bottlenecks',
          'Implement monitoring and alerting systems'
        ],
        shortTerm: [
          'Begin migration to microservices architecture',
          'Increase automated testing coverage to 90%+',
          'Implement CI/CD pipeline'
        ],
        longTerm: [
          'Complete platform modernization',
          'Implement cloud-native architecture',
          'Build platform team for ongoing optimization'
        ]
      },
      createdAt: new Date('2025-07-21T08:45:00'),
      createdBy: 'AI Risk Assessment',
      lastUpdated: new Date('2025-07-21T08:45:00'),
      reviewers: [],
      approvedBy: undefined,
      approvedAt: undefined
    },
    {
      id: 'finding-004',
      title: 'Key Person Dependency - Founder/CTO',
      description: 'Heavy reliance on founder who serves dual role as CEO/CTO creates significant operational and knowledge transfer risks.',
      category: 'operational',
      severity: 'high',
      status: 'approved',
      aiGenerated: false,
      confidence: 0,
      generationMethod: 'manual',
      sourceData: ['management-interviews.pdf', 'org-chart.pdf'],
      impact: {
        financial: -1200000,
        operational: 'high',
        strategic: 'high',
        timeline: 'Immediate risk if founder unavailable'
      },
      evidence: {
        documents: ['Management Team Analysis', 'Interview Transcripts'],
        dataPoints: [
          'Founder involved in all major technical decisions',
          'Limited technical documentation',
          'No designated successor for CTO role',
          '80% of architectural knowledge concentrated with founder'
        ],
        benchmarks: ['Best practice: clear succession planning and knowledge distribution'],
        precedents: ['Key person departure cost Enterprise Solutions 6 months recovery time']
      },
      recommendations: {
        immediate: [
          'Implement retention agreement with founder',
          'Begin technical knowledge documentation',
          'Identify potential CTO successor candidates'
        ],
        shortTerm: [
          'Hire senior technical leadership',
          'Create technical advisory board',
          'Implement pair programming and knowledge sharing'
        ],
        longTerm: [
          'Develop autonomous technical organization',
          'Complete knowledge transfer program',
          'Establish technical governance framework'
        ]
      },
      managementResponse: {
        status: 'satisfactory',
        response: 'Founder has agreed to 3-year retention with progressive transition plan. VP Engineering hire in progress.',
        followUpRequired: false
      },
      createdAt: new Date('2025-07-20T16:20:00'),
      createdBy: 'Legal Team',
      lastUpdated: new Date('2025-07-21T13:15:00'),
      reviewers: ['Sarah Johnson', 'Legal Team'],
      approvedBy: 'Sarah Johnson',
      approvedAt: new Date('2025-07-21T13:15:00')
    },
    {
      id: 'finding-005',
      title: 'Regulatory Compliance Gap - Data Privacy',
      description: 'GDPR compliance framework incomplete for EU operations, creating potential regulatory and reputational risks.',
      category: 'legal',
      severity: 'medium',
      status: 'disputed',
      aiGenerated: true,
      confidence: 0.76,
      generationMethod: 'benchmark_analysis',
      sourceData: ['privacy-policy.pdf', 'eu-operations-summary.docx'],
      impact: {
        financial: -250000,
        operational: 'low',
        strategic: 'medium',
        timeline: 'Potential issue within 6-12 months of EU expansion'
      },
      evidence: {
        documents: ['Privacy Policy Review', 'GDPR Compliance Checklist'],
        dataPoints: [
          'Privacy policy last updated 18 months ago',
          'No formal GDPR compliance officer',
          'Limited data processing documentation',
          'EU customer data stored in US without proper agreements'
        ],
        benchmarks: ['GDPR requires explicit consent and data processing documentation'],
        precedents: ['Average GDPR fine: €500K for similar violations']
      },
      recommendations: {
        immediate: [
          'Engage GDPR compliance specialist',
          'Audit current data processing practices',
          'Update privacy policies and consent mechanisms'
        ],
        shortTerm: [
          'Implement data processing agreements',
          'Train staff on GDPR requirements',
          'Establish data retention and deletion procedures'
        ],
        longTerm: [
          'Build privacy-by-design into product development',
          'Regular compliance monitoring and audits',
          'Consider EU data residency options'
        ]
      },
      managementResponse: {
        status: 'unsatisfactory',
        response: 'Management believes current practices are adequate. Disputes severity assessment.',
        followUpRequired: true,
        dueDate: new Date('2025-08-01')
      },
      createdAt: new Date('2025-07-20T14:30:00'),
      createdBy: 'AI Compliance Analysis',
      lastUpdated: new Date('2025-07-21T10:20:00'),
      reviewers: ['Legal Team'],
      approvedBy: undefined,
      approvedAt: undefined
    }
  ])

  // AI workflow recommendations
  React.useEffect(() => {
    if (currentMode.mode !== 'traditional') {
      const aiGeneratedFindings = findings.filter(f => f.aiGenerated).length
      const pendingFindings = findings.filter(f => f.status === 'draft' || f.status === 'under_review').length
      const highSeverityFindings = findings.filter(f => f.severity === 'high' || f.severity === 'critical').length

      if (pendingFindings > 0) {
        addRecommendation({
          id: `findings-review-${projectId}`,
          type: 'suggestion',
          priority: 'high',
          title: `${pendingFindings} Findings Need Review`,
          description: `${aiGeneratedFindings} AI-generated findings require review and approval. ${highSeverityFindings} are high severity requiring immediate attention.`,
          actions: [{
            id: 'review-findings',
            label: 'Review Findings',
            action: 'REVIEW_AI_FINDINGS',
            primary: true,
            estimatedTimeSaving: pendingFindings * 15
          }, {
            id: 'bulk-approve',
            label: 'Bulk Actions',
            action: 'BULK_FINDINGS_ACTIONS'
          }],
          confidence: 0.91,
          moduleContext: 'due-diligence',
          timestamp: new Date()
        })
      }

      // Auto-generation recommendation
      const totalFinancialImpact = findings.reduce((sum, f) => sum + Math.abs(f.impact.financial), 0)
      addRecommendation({
        id: `auto-generate-${projectId}`,
        type: 'automation',
        priority: 'medium',
        title: 'Generate Additional Findings',
        description: `AI can analyze remaining documents and data to generate additional findings. Current findings represent ${new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD', minimumFractionDigits: 0}).format(totalFinancialImpact)} in identified impacts.`,
        actions: [{
          id: 'generate-more',
          label: 'Generate Additional Findings',
          action: 'AUTO_GENERATE_FINDINGS',
          estimatedTimeSaving: 120
        }],
        confidence: 0.85,
        moduleContext: 'due-diligence',
        timestamp: new Date()
      })

      // Management response follow-up
      const pendingResponses = findings.filter(f => 
        f.managementResponse?.followUpRequired && 
        f.managementResponse.status === 'pending'
      )
      
      if (pendingResponses.length > 0) {
        addRecommendation({
          id: `mgmt-followup-${projectId}`,
          type: 'suggestion',
          priority: 'medium',
          title: `${pendingResponses.length} Management Responses Overdue`,
          description: 'Several findings require management responses to complete the due diligence process.',
          actions: [{
            id: 'followup-mgmt',
            label: 'Send Follow-up',
            action: 'FOLLOWUP_MANAGEMENT_RESPONSES'
          }],
          confidence: 0.95,
          moduleContext: 'due-diligence',
          timestamp: new Date()
        })
      }
    }
  }, [currentMode.mode, projectId, addRecommendation])

  const handleGenerateFindings = async () => {
    setGenerationRunning(true)
    
    trackInteraction({
      interactionType: 'automation_approved',
      userAction: 'accepted',
      module: 'due-diligence',
      context: {
        action: 'generate_findings',
        dealData,
        existingFindings: findings.length
      }
    })

    // Simulate AI generation
    setTimeout(() => {
      setGenerationRunning(false)
    }, 4000)
  }

  const toggleFindingExpansion = (findingId: string) => {
    const newExpanded = new Set(expandedFindings)
    if (newExpanded.has(findingId)) {
      newExpanded.delete(findingId)
    } else {
      newExpanded.add(findingId)
    }
    setExpandedFindings(newExpanded)
  }

  const getSeverityColor = (severity: Finding['severity']) => {
    switch (severity) {
      case 'critical': return 'text-red-800 bg-red-100 border-red-300'
      case 'high': return 'text-red-700 bg-red-50 border-red-200'
      case 'medium': return 'text-orange-700 bg-orange-50 border-orange-200'
      case 'low': return 'text-green-700 bg-green-50 border-green-200'
    }
  }

  const getStatusColor = (status: Finding['status']) => {
    switch (status) {
      case 'draft': return 'text-gray-600 bg-gray-50 border-gray-200'
      case 'under_review': return 'text-blue-600 bg-blue-50 border-blue-200'
      case 'approved': return 'text-green-600 bg-green-50 border-green-200'
      case 'disputed': return 'text-orange-600 bg-orange-50 border-orange-200'
      case 'resolved': return 'text-purple-600 bg-purple-50 border-purple-200'
    }
  }

  const getCategoryIcon = (category: Finding['category']) => {
    switch (category) {
      case 'financial': return <DollarSign className="w-4 h-4" />
      case 'commercial': return <TrendingUp className="w-4 h-4" />
      case 'legal': return <Shield className="w-4 h-4" />
      case 'technical': return <Brain className="w-4 h-4" />
      case 'operational': return <Users className="w-4 h-4" />
      case 'strategic': return <Target className="w-4 h-4" />
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const categories = [
    { id: 'all', label: 'All Findings', count: findings.length },
    { id: 'financial', label: 'Financial', count: findings.filter(f => f.category === 'financial').length },
    { id: 'commercial', label: 'Commercial', count: findings.filter(f => f.category === 'commercial').length },
    { id: 'legal', label: 'Legal', count: findings.filter(f => f.category === 'legal').length },
    { id: 'technical', label: 'Technical', count: findings.filter(f => f.category === 'technical').length },
    { id: 'operational', label: 'Operational', count: findings.filter(f => f.category === 'operational').length },
    { id: 'strategic', label: 'Strategic', count: findings.filter(f => f.category === 'strategic').length }
  ]

  const statuses = ['all', 'draft', 'under_review', 'approved', 'disputed', 'resolved']

  const filteredFindings = findings.filter(finding => {
    if (selectedCategory !== 'all' && finding.category !== selectedCategory) return false
    if (filterStatus !== 'all' && finding.status !== filterStatus) return false
    return true
  })

  const stats = {
    total: findings.length,
    aiGenerated: findings.filter(f => f.aiGenerated).length,
    highSeverity: findings.filter(f => f.severity === 'high' || f.severity === 'critical').length,
    pending: findings.filter(f => f.status === 'draft' || f.status === 'under_review').length,
    totalImpact: findings.reduce((sum, f) => sum + Math.abs(f.impact.financial), 0)
  }

  const renderFindingCard = (finding: Finding) => (
    <Card key={finding.id} className={`
      transition-all duration-200 hover:shadow-md
      ${finding.aiGenerated ? 'border-l-4 border-l-purple-400' : ''}
      ${finding.severity === 'critical' ? 'border-red-200 bg-red-50' : ''}
    `}>
      <CardHeader 
        className="cursor-pointer"
        onClick={() => toggleFindingExpansion(finding.id)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {getCategoryIcon(finding.category)}
            <div>
              <CardTitle className="text-lg">{finding.title}</CardTitle>
              <p className="text-sm text-gray-600 line-clamp-2">{finding.description}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Badge className={`text-xs ${getSeverityColor(finding.severity)}`}>
              {finding.severity}
            </Badge>
            <Badge className={`text-xs ${getStatusColor(finding.status)}`}>
              {finding.status.replace('_', ' ')}
            </Badge>
            {finding.aiGenerated && (
              <Badge variant="ai" className="text-xs">
                AI: {Math.round(finding.confidence * 100)}%
              </Badge>
            )}
            {expandedFindings.has(finding.id) ? 
              <ChevronDown className="w-4 h-4" /> : 
              <ChevronRight className="w-4 h-4" />
            }
          </div>
        </div>
      </CardHeader>

      {expandedFindings.has(finding.id) && (
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Impact Analysis */}
            <div>
              <h4 className="font-medium mb-3 flex items-center">
                <BarChart3 className="w-4 h-4 mr-2 text-blue-600" />
                Impact Analysis
              </h4>
              <div className="space-y-3">
                <div className="p-3 bg-gray-50 rounded">
                  <div className="text-sm font-medium mb-2">Financial Impact</div>
                  <div className="text-xl font-bold text-red-600">
                    {formatCurrency(finding.impact.financial)}
                  </div>
                  <div className="text-xs text-gray-600">{finding.impact.timeline}</div>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center p-2 bg-orange-50 rounded">
                    <div className="text-sm font-medium">Operational</div>
                    <div className={`text-sm capitalize ${
                      finding.impact.operational === 'high' ? 'text-red-600' :
                      finding.impact.operational === 'medium' ? 'text-orange-600' : 'text-green-600'
                    }`}>
                      {finding.impact.operational}
                    </div>
                  </div>
                  <div className="text-center p-2 bg-blue-50 rounded">
                    <div className="text-sm font-medium">Strategic</div>
                    <div className={`text-sm capitalize ${
                      finding.impact.strategic === 'high' ? 'text-red-600' :
                      finding.impact.strategic === 'medium' ? 'text-orange-600' : 'text-green-600'
                    }`}>
                      {finding.impact.strategic}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Evidence & Support */}
            <div>
              <h4 className="font-medium mb-3 flex items-center">
                <FileText className="w-4 h-4 mr-2 text-green-600" />
                Evidence & Support
              </h4>
              <div className="space-y-3">
                <div>
                  <span className="text-sm font-medium text-gray-700">Source Documents:</span>
                  <div className="text-sm text-gray-600 mt-1">
                    {finding.evidence.documents.join(', ')}
                  </div>
                </div>
                
                <div>
                  <span className="text-sm font-medium text-gray-700">Key Data Points:</span>
                  <ul className="text-sm text-gray-600 mt-1 space-y-1">
                    {finding.evidence.dataPoints.slice(0, 3).map((point, index) => (
                      <li key={index}>• {point}</li>
                    ))}
                  </ul>
                </div>

                {finding.evidence.benchmarks.length > 0 && (
                  <div>
                    <span className="text-sm font-medium text-gray-700">Benchmarks:</span>
                    <div className="text-sm text-gray-600 mt-1">
                      {finding.evidence.benchmarks[0]}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div className="mt-6">
            <h4 className="font-medium mb-3 flex items-center">
              <Lightbulb className="w-4 h-4 mr-2 text-yellow-600" />
              Recommendations
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-3 bg-red-50 rounded">
                <h5 className="font-medium text-red-800 mb-2">Immediate Actions</h5>
                <ul className="text-sm text-red-700 space-y-1">
                  {finding.recommendations.immediate.map((rec, index) => (
                    <li key={index}>• {rec}</li>
                  ))}
                </ul>
              </div>
              
              <div className="p-3 bg-orange-50 rounded">
                <h5 className="font-medium text-orange-800 mb-2">Short Term (3-6M)</h5>
                <ul className="text-sm text-orange-700 space-y-1">
                  {finding.recommendations.shortTerm.map((rec, index) => (
                    <li key={index}>• {rec}</li>
                  ))}
                </ul>
              </div>
              
              <div className="p-3 bg-blue-50 rounded">
                <h5 className="font-medium text-blue-800 mb-2">Long Term (6M+)</h5>
                <ul className="text-sm text-blue-700 space-y-1">
                  {finding.recommendations.longTerm.map((rec, index) => (
                    <li key={index}>• {rec}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Management Response */}
          {finding.managementResponse && (
            <div className="mt-6">
              <h4 className="font-medium mb-3 flex items-center">
                <MessageSquare className="w-4 h-4 mr-2 text-purple-600" />
                Management Response
              </h4>
              <div className={`p-3 rounded border ${
                finding.managementResponse.status === 'satisfactory' ? 'bg-green-50 border-green-200' :
                finding.managementResponse.status === 'unsatisfactory' ? 'bg-red-50 border-red-200' :
                'bg-gray-50 border-gray-200'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <Badge className={`text-xs ${
                    finding.managementResponse.status === 'satisfactory' ? 'bg-green-100 text-green-800' :
                    finding.managementResponse.status === 'unsatisfactory' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {finding.managementResponse.status}
                  </Badge>
                  {finding.managementResponse.dueDate && (
                    <span className="text-xs text-gray-600">
                      Due: {finding.managementResponse.dueDate.toISOString().split('T')[0]}
                    </span>
                  )}
                </div>
                <p className="text-sm">{finding.managementResponse.response}</p>
              </div>
            </div>
          )}

          {/* AI Analysis Details */}
          {finding.aiGenerated && (
            <div className="mt-6 p-4 bg-purple-50 rounded-lg">
              <h4 className="font-medium mb-2 flex items-center text-purple-800">
                <Brain className="w-4 h-4 mr-2" />
                AI Generation Details
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="font-medium text-purple-700">Method:</span>
                  <div className="text-purple-600 capitalize">
                    {finding.generationMethod.replace('_', ' ')}
                  </div>
                </div>
                <div>
                  <span className="font-medium text-purple-700">Confidence:</span>
                  <div className="text-purple-600">
                    {Math.round(finding.confidence * 100)}%
                  </div>
                </div>
                <div>
                  <span className="font-medium text-purple-700">Sources:</span>
                  <div className="text-purple-600">
                    {finding.sourceData.length} documents
                  </div>
                </div>
                <div>
                  <span className="font-medium text-purple-700">Created:</span>
                  <div className="text-purple-600">
                    {finding.createdAt.toISOString().split('T')[0]}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-6 flex space-x-3">
            {finding.status === 'draft' && (
              <Button size="sm">
                <CheckCircle className="w-4 h-4 mr-2" />
                Approve Finding
              </Button>
            )}
            <Button variant="outline" size="sm">
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
            <Button variant="outline" size="sm">
              <Copy className="w-4 h-4 mr-2" />
              Duplicate
            </Button>
            <Button variant="outline" size="sm">
              <Eye className="w-4 h-4 mr-2" />
              Full Details
            </Button>
          </div>
        </CardContent>
      )}
    </Card>
  )

  const renderTraditionalView = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Findings Management</h2>
          <p className="text-gray-600">Track and manage due diligence findings</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Finding
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
            <div className="text-sm text-gray-600">Total Findings</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{stats.highSeverity}</div>
            <div className="text-sm text-gray-600">High Severity</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">{stats.pending}</div>
            <div className="text-sm text-gray-600">Pending Review</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(stats.totalImpact).replace('$', '$')}
            </div>
            <div className="text-sm text-gray-600">Total Impact</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex space-x-4">
        <select 
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="border rounded px-3 py-2"
        >
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>
              {cat.label} ({cat.count})
            </option>
          ))}
        </select>
        
        <select 
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="border rounded px-3 py-2"
        >
          {statuses.map(status => (
            <option key={status} value={status}>
              {status === 'all' ? 'All Status' : status.replace('_', ' ')}
            </option>
          ))}
        </select>
      </div>

      {/* Findings List */}
      <div className="space-y-4">
        {filteredFindings.map(renderFindingCard)}
      </div>
    </div>
  )

  const renderAssistedView = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold flex items-center">
            <Brain className="w-5 h-5 mr-2 text-purple-500" />
            AI-Enhanced Findings Generation
            <Badge variant="ai" className="ml-3">Smart Generation</Badge>
          </h2>
          <p className="text-gray-600">Automated findings generation with intelligent analysis</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button 
            onClick={handleGenerateFindings}
            disabled={generationRunning}
            variant="ai"
            size="sm"
          >
            {generationRunning ? (
              <Clock className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Wand2 className="w-4 h-4 mr-2" />
            )}
            {generationRunning ? 'Generating...' : 'Generate Findings'}
          </Button>
          <Button variant="outline" size="sm">
            <Sparkles className="w-4 h-4 mr-2" />
            AI Insights
          </Button>
        </div>
      </div>

      {/* AI Generation Status */}
      {generationRunning && (
        <Card className="border-purple-200 bg-purple-50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Wand2 className="w-5 h-5 text-purple-600" />
              <div>
                <h3 className="font-semibold text-purple-800">AI Findings Generation in Progress</h3>
                <p className="text-sm text-purple-600">
                  Analyzing documents, benchmarks, and patterns to generate comprehensive findings...
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Enhanced Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-purple-400">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">AI Generated</span>
              <Brain className="w-4 h-4 text-purple-500" />
            </div>
            <div className="text-2xl font-bold text-purple-600">{stats.aiGenerated}</div>
            <div className="text-xs text-purple-600 mb-2">of {stats.total} total</div>
            <div className="text-xs text-purple-600 bg-purple-50 p-2 rounded">
              🤖 {Math.round((stats.aiGenerated / stats.total) * 100)}% automated
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-red-400">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Critical Issues</span>
              <AlertTriangle className="w-4 h-4 text-red-500" />
            </div>
            <div className="text-2xl font-bold text-red-600">{stats.highSeverity}</div>
            <div className="text-xs text-red-600 mb-2">High/Critical severity</div>
            <div className="text-xs text-red-600 bg-red-50 p-2 rounded">
              🚨 Immediate attention
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-400">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Financial Impact</span>
              <DollarSign className="w-4 h-4 text-orange-500" />
            </div>
            <div className="text-2xl font-bold text-orange-600">
              {formatCurrency(stats.totalImpact)}
            </div>
            <div className="text-xs text-orange-600 mb-2">Total exposure</div>
            <div className="text-xs text-orange-600 bg-orange-50 p-2 rounded">
              💰 Quantified risk
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-400">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Avg Confidence</span>
              <Target className="w-4 h-4 text-blue-500" />
            </div>
            <div className="text-2xl font-bold text-blue-600">
              {Math.round(findings.filter(f => f.aiGenerated).reduce((acc, f) => acc + f.confidence, 0) / Math.max(1, findings.filter(f => f.aiGenerated).length) * 100)}%
            </div>
            <div className="text-xs text-blue-600 mb-2">AI accuracy</div>
            <div className="text-xs text-blue-600 bg-blue-50 p-2 rounded">
              🎯 High confidence
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Rest of the view similar to traditional but with AI enhancements */}
      <div className="flex space-x-4">
        {categories.map(cat => (
          <Button
            key={cat.id}
            variant={selectedCategory === cat.id ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(cat.id)}
          >
            {cat.label} ({cat.count})
            {cat.id !== 'all' && findings.filter(f => f.category === cat.id && f.aiGenerated).length > 0 && (
              <Badge variant="ai" className="ml-2 text-xs">AI</Badge>
            )}
          </Button>
        ))}
      </div>

      <div className="space-y-4">
        {filteredFindings.map(renderFindingCard)}
      </div>
    </div>
  )

  const renderAutonomousView = () => {
    const criticalFindings = findings.filter(f => f.severity === 'critical' || f.severity === 'high')
    
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <Wand2 className="w-4 h-4 text-purple-600" />
              </div>
              <div className="flex-1">
                <div className="bg-purple-50 rounded-lg p-4 mb-4">
                  <p className="text-sm mb-2">
                    <strong>Findings Generation Complete:</strong> Generated {stats.aiGenerated} AI-powered findings with {Math.round(findings.filter(f => f.aiGenerated).reduce((acc, f) => acc + f.confidence, 0) / Math.max(1, findings.filter(f => f.aiGenerated).length) * 100)}% average confidence.
                  </p>
                  <p className="text-sm">
                    Identified {formatCurrency(stats.totalImpact)} in potential financial impact across {stats.total} findings.
                  </p>
                </div>

                {/* Critical Findings */}
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                  <h4 className="font-medium text-red-800 mb-3 flex items-center">
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    High Priority Findings
                  </h4>
                  <div className="space-y-3">
                    {criticalFindings.slice(0, 3).map((finding) => (
                      <div key={finding.id} className="bg-white rounded p-3">
                        <div className="flex justify-between items-start mb-2">
                          <h5 className="font-medium">{finding.title}</h5>
                          <Badge className={`text-xs ${getSeverityColor(finding.severity)}`}>
                            {finding.severity}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{finding.description}</p>
                        <div className="text-sm mb-2">
                          <span className="font-medium">Impact:</span> 
                          <span className="text-red-600 ml-1">{formatCurrency(finding.impact.financial)}</span>
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm">Address Now</Button>
                          <Button size="sm" variant="outline">Request Response</Button>
                          <Button size="sm" variant="outline">Add to Report</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* AI Generated Summary */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-medium text-green-800 mb-3 flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    AI Analysis Summary
                  </h4>
                  <div className="grid grid-cols-2 gap-4 text-sm text-green-700">
                    <div>• Generated {stats.aiGenerated} findings automatically</div>
                    <div>• Analyzed {findings.flatMap(f => f.sourceData).length} source documents</div>
                    <div>• Identified {criticalFindings.length} critical issues</div>
                    <div>• Quantified {formatCurrency(stats.totalImpact)} total exposure</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-6">
      {currentMode.mode === 'traditional' && renderTraditionalView()}
      {currentMode.mode === 'assisted' && renderAssistedView()}
      {currentMode.mode === 'autonomous' && renderAutonomousView()}
    </div>
  )
}