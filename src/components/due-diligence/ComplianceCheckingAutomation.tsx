'use client'

import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useNavigationStore } from '@/stores/navigation-store'
import { 
  Shield,
  FileCheck,
  AlertTriangle,
  CheckCircle,
  Clock,
  Brain,
  Zap,
  Scale,
  Globe,
  Building,
  Users,
  Lock,
  Eye,
  Download,
  Search,
  Filter,
  RefreshCw,
  Lightbulb,
  Sparkles,
  Target,
  TrendingUp,
  BarChart3,
  Calendar,
  MapPin,
  FileText,
  Star,
  Play,
  Pause,
  ChevronRight,
  ChevronDown,
  ExternalLink,
  Database,
  Cpu,
  Wifi
} from 'lucide-react'

interface ComplianceRequirement {
  id: string
  framework: 'GDPR' | 'SOX' | 'HIPAA' | 'PCI-DSS' | 'SOC2' | 'ISO27001' | 'CCPA' | 'NIST' | 'FTC' | 'Custom'
  category: 'data_privacy' | 'financial_reporting' | 'security' | 'operational' | 'industry_specific'
  requirement: string
  description: string
  applicability: string[]
  severity: 'low' | 'medium' | 'high' | 'critical'
  status: 'compliant' | 'non_compliant' | 'partial' | 'not_applicable' | 'in_review' | 'needs_assessment'
  
  // Assessment details
  assessmentDate?: Date
  assessedBy?: string
  evidenceRequired: string[]
  evidenceProvided: string[]
  gapAnalysis?: string
  
  // Remediation
  remediationPlan?: {
    actions: string[]
    timeline: number // days
    cost: number
    owner: string
    priority: 'low' | 'medium' | 'high' | 'critical'
  }
  
  // AI insights
  aiAssessment?: {
    confidence: number
    reasoning: string
    suggestedEvidence: string[]
    riskLevel: 'low' | 'medium' | 'high' | 'critical'
    industryBenchmark?: string
  }
  
  // Links and references
  linkedDocuments: string[]
  regulatoryReferences: string[]
  lastUpdated: Date
}

interface ComplianceFramework {
  id: string
  name: string
  fullName: string
  description: string
  applicableRegions: string[]
  applicableIndustries: string[]
  totalRequirements: number
  assessedRequirements: number
  complianceScore: number
  criticalGaps: number
  lastAssessment?: Date
}

interface ComplianceCheckingAutomationProps {
  projectId: string
  targetCompany?: {
    name: string
    industry: string
    region: string
    size: 'startup' | 'growth' | 'enterprise'
    dataProcessing: boolean
  }
}

export function ComplianceCheckingAutomation({ projectId, targetCompany }: ComplianceCheckingAutomationProps) {
  const { currentMode, trackInteraction, addRecommendation } = useNavigationStore()
  const [selectedFramework, setSelectedFramework] = React.useState<string>('all')
  const [expandedRequirements, setExpandedRequirements] = React.useState<Set<string>>(new Set())
  const [scanningInProgress, setScanningInProgress] = React.useState(false)
  const [selectedCategory, setSelectedCategory] = React.useState<string>('all')

  // Compliance frameworks data
  const [frameworks] = React.useState<ComplianceFramework[]>([
    {
      id: 'gdpr',
      name: 'GDPR',
      fullName: 'General Data Protection Regulation',
      description: 'European Union data protection regulation',
      applicableRegions: ['EU', 'EEA', 'Global (if processing EU data)'],
      applicableIndustries: ['All industries processing personal data'],
      totalRequirements: 47,
      assessedRequirements: 42,
      complianceScore: 0.78,
      criticalGaps: 3,
      lastAssessment: new Date('2025-07-20')
    },
    {
      id: 'sox',
      name: 'SOX',
      fullName: 'Sarbanes-Oxley Act',
      description: 'US financial reporting compliance',
      applicableRegions: ['US', 'US-listed companies'],
      applicableIndustries: ['Public Companies', 'Financial Services'],
      totalRequirements: 31,
      assessedRequirements: 28,
      complianceScore: 0.85,
      criticalGaps: 1,
      lastAssessment: new Date('2025-07-18')
    },
    {
      id: 'soc2',
      name: 'SOC 2',
      fullName: 'Service Organization Control 2',
      description: 'Security and availability controls',
      applicableRegions: ['US', 'Global'],
      applicableIndustries: ['SaaS', 'Cloud Services', 'Technology'],
      totalRequirements: 64,
      assessedRequirements: 58,
      complianceScore: 0.72,
      criticalGaps: 5,
      lastAssessment: new Date('2025-07-19')
    },
    {
      id: 'iso27001',
      name: 'ISO 27001',
      fullName: 'Information Security Management Systems',
      description: 'International security standard',
      applicableRegions: ['Global'],
      applicableIndustries: ['All industries'],
      totalRequirements: 114,
      assessedRequirements: 89,
      complianceScore: 0.68,
      criticalGaps: 8,
      lastAssessment: new Date('2025-07-15')
    }
  ])

  // Sample compliance requirements
  const [requirements] = React.useState<ComplianceRequirement[]>([
    {
      id: 'gdpr-001',
      framework: 'GDPR',
      category: 'data_privacy',
      requirement: 'Data Processing Legal Basis',
      description: 'Establish and document legal basis for processing personal data',
      applicability: ['EU operations', 'Customer data processing'],
      severity: 'critical',
      status: 'partial',
      assessmentDate: new Date('2025-07-20'),
      assessedBy: 'Privacy Team',
      evidenceRequired: ['Privacy policy', 'Data processing agreements', 'Legal basis documentation'],
      evidenceProvided: ['Privacy policy v2.1', 'Customer agreements'],
      gapAnalysis: 'Missing legal basis documentation for marketing communications',
      remediationPlan: {
        actions: [
          'Draft legal basis documentation',
          'Update privacy policy section 4',
          'Implement consent management for marketing',
          'Train staff on legal basis requirements'
        ],
        timeline: 30,
        cost: 25000,
        owner: 'Legal & Privacy Team',
        priority: 'critical'
      },
      aiAssessment: {
        confidence: 0.89,
        reasoning: 'High-risk non-compliance identified. Marketing consent mechanisms missing.',
        suggestedEvidence: ['Consent logs', 'Marketing opt-in records', 'Legal review documentation'],
        riskLevel: 'high',
        industryBenchmark: '92% of SaaS companies have documented legal basis'
      },
      linkedDocuments: ['privacy-policy.pdf', 'customer-agreements.pdf'],
      regulatoryReferences: ['GDPR Article 6', 'GDPR Recital 40'],
      lastUpdated: new Date('2025-07-20')
    },
    {
      id: 'soc2-001',
      framework: 'SOC2',
      category: 'security',
      requirement: 'System Access Controls',
      description: 'Implement logical access controls to prevent unauthorized system access',
      applicability: ['All systems', 'Production environment'],
      severity: 'high',
      status: 'compliant',
      assessmentDate: new Date('2025-07-19'),
      assessedBy: 'Security Audit Team',
      evidenceRequired: ['Access control policies', 'User access reviews', 'MFA implementation'],
      evidenceProvided: ['IAM policy v3.2', 'Q2 access review', 'MFA rollout report'],
      aiAssessment: {
        confidence: 0.94,
        reasoning: 'Strong access controls implemented with regular reviews and MFA.',
        suggestedEvidence: ['Privileged access logs', 'Password policy enforcement logs'],
        riskLevel: 'low',
        industryBenchmark: '87% compliance rate for access controls in tech companies'
      },
      linkedDocuments: ['iam-policy.pdf', 'access-review-q2.xlsx'],
      regulatoryReferences: ['SOC 2 CC6.1', 'SOC 2 CC6.2'],
      lastUpdated: new Date('2025-07-19')
    },
    {
      id: 'sox-001',
      framework: 'SOX',
      category: 'financial_reporting',
      requirement: 'Internal Controls Over Financial Reporting (ICFR)',
      description: 'Establish and maintain adequate internal control over financial reporting',
      applicability: ['Financial reporting', 'Revenue recognition'],
      severity: 'critical',
      status: 'in_review',
      assessmentDate: new Date('2025-07-18'),
      assessedBy: 'External Auditors',
      evidenceRequired: ['ICFR documentation', 'Process walkthroughs', 'Control testing'],
      evidenceProvided: ['ICFR framework v1.0', 'Process documentation'],
      gapAnalysis: 'Control testing documentation incomplete for Q2',
      remediationPlan: {
        actions: [
          'Complete control testing for Q2',
          'Document control deficiencies',
          'Implement management review controls',
          'Prepare ICFR certification'
        ],
        timeline: 45,
        cost: 75000,
        owner: 'CFO & External Auditors',
        priority: 'critical'
      },
      aiAssessment: {
        confidence: 0.91,
        reasoning: 'ICFR framework in place but testing documentation needs completion.',
        suggestedEvidence: ['Control test results', 'Management certifications', 'Deficiency reports'],
        riskLevel: 'medium',
        industryBenchmark: '78% of similar-stage companies have complete ICFR'
      },
      linkedDocuments: ['icfr-framework.pdf', 'process-docs.docx'],
      regulatoryReferences: ['SOX Section 302', 'SOX Section 404'],
      lastUpdated: new Date('2025-07-18')
    },
    {
      id: 'iso-001',
      framework: 'ISO27001',
      category: 'security',
      requirement: 'Information Security Risk Management',
      description: 'Establish systematic approach to managing information security risks',
      applicability: ['All business operations', 'IT systems'],
      severity: 'high',
      status: 'non_compliant',
      assessmentDate: new Date('2025-07-15'),
      assessedBy: 'ISO Consultant',
      evidenceRequired: ['Risk register', 'Risk assessment methodology', 'Risk treatment plans'],
      evidenceProvided: ['Preliminary risk assessment'],
      gapAnalysis: 'No formal risk register or treatment plans documented',
      remediationPlan: {
        actions: [
          'Conduct comprehensive risk assessment',
          'Develop risk register',
          'Create risk treatment plans',
          'Implement risk monitoring process'
        ],
        timeline: 60,
        cost: 45000,
        owner: 'CISO & Security Team',
        priority: 'high'
      },
      aiAssessment: {
        confidence: 0.87,
        reasoning: 'Critical gap in risk management framework. High priority for remediation.',
        suggestedEvidence: ['Asset inventory', 'Threat modeling', 'Vulnerability assessments'],
        riskLevel: 'high',
        industryBenchmark: '85% of enterprises have formal risk management'
      },
      linkedDocuments: ['prelim-risk-assessment.pdf'],
      regulatoryReferences: ['ISO 27001 A.12.6', 'ISO 27001 A.8.2'],
      lastUpdated: new Date('2025-07-15')
    },
    {
      id: 'gdpr-002',
      framework: 'GDPR',
      category: 'data_privacy',
      requirement: 'Data Subject Rights Implementation',
      description: 'Implement processes for handling data subject access requests',
      applicability: ['Customer data', 'EU data subjects'],
      severity: 'high',
      status: 'needs_assessment',
      evidenceRequired: ['DSAR process', 'Request handling logs', 'Response procedures'],
      evidenceProvided: [],
      aiAssessment: {
        confidence: 0.73,
        reasoning: 'Critical GDPR requirement not yet assessed. High risk of non-compliance.',
        suggestedEvidence: ['DSAR workflow', 'Identity verification process', 'Response templates'],
        riskLevel: 'critical',
        industryBenchmark: '71% of companies have automated DSAR processes'
      },
      linkedDocuments: [],
      regulatoryReferences: ['GDPR Article 15-22'],
      lastUpdated: new Date('2025-07-21')
    }
  ])

  // AI compliance recommendations
  React.useEffect(() => {
    if (currentMode.mode !== 'traditional') {
      const criticalGaps = requirements.filter(req => 
        (req.status === 'non_compliant' || req.status === 'needs_assessment') && 
        req.severity === 'critical'
      )
      
      const totalRemediationCost = requirements
        .filter(req => req.remediationPlan)
        .reduce((acc, req) => acc + (req.remediationPlan?.cost || 0), 0)

      if (criticalGaps.length > 0) {
        addRecommendation({
          id: `compliance-critical-${projectId}`,
          type: 'warning',
          priority: 'critical',
          title: `${criticalGaps.length} Critical Compliance Gaps`,
          description: `Identified ${criticalGaps.length} critical compliance issues that require immediate attention to avoid regulatory risks.`,
          actions: [{
            id: 'address-compliance',
            label: 'Start Remediation Plan',
            action: 'START_COMPLIANCE_REMEDIATION',
            primary: true
          }, {
            id: 'compliance-report',
            label: 'Generate Compliance Report',
            action: 'GENERATE_COMPLIANCE_REPORT'
          }],
          confidence: 0.93,
          moduleContext: 'due-diligence',
          timestamp: new Date()
        })
      }

      // AI scanning recommendation
      const needsAssessment = requirements.filter(req => req.status === 'needs_assessment').length
      if (needsAssessment > 10) {
        addRecommendation({
          id: `compliance-scan-${projectId}`,
          type: 'automation',
          priority: 'high',
          title: 'Automate Compliance Assessment',
          description: `${needsAssessment} requirements need assessment. AI can automatically evaluate ${Math.round(needsAssessment * 0.7)} of these.`,
          actions: [{
            id: 'ai-scan',
            label: 'Start AI Compliance Scan',
            action: 'START_AI_COMPLIANCE_SCAN',
            primary: true,
            estimatedTimeSaving: needsAssessment * 45
          }],
          confidence: 0.88,
          moduleContext: 'due-diligence',
          timestamp: new Date()
        })
      }

      // Cost optimization recommendation
      if (totalRemediationCost > 100000) {
        addRecommendation({
          id: `compliance-cost-${projectId}`,
          type: 'insight',
          priority: 'medium',
          title: 'Compliance Cost Optimization',
          description: `Total remediation cost: $${Math.round(totalRemediationCost/1000)}k. AI can help prioritize and reduce costs by ~25%.`,
          actions: [{
            id: 'optimize-compliance',
            label: 'Optimize Compliance Plan',
            action: 'OPTIMIZE_COMPLIANCE_PLAN'
          }],
          confidence: 0.79,
          moduleContext: 'due-diligence',
          timestamp: new Date()
        })
      }
    }
  }, [currentMode.mode, projectId, addRecommendation])

  const handleAIComplanceScan = async () => {
    setScanningInProgress(true)
    trackInteraction({
      interactionType: 'automation_approved',
      userAction: 'accepted',
      module: 'due-diligence',
      context: {
        action: 'ai_compliance_scan',
        frameworks: frameworks.map(f => f.id),
        requirementsCount: requirements.length
      }
    })

    // Simulate AI scanning process
    setTimeout(() => {
      setScanningInProgress(false)
    }, 5000)
  }

  const toggleRequirementExpansion = (reqId: string) => {
    const newExpanded = new Set(expandedRequirements)
    if (newExpanded.has(reqId)) {
      newExpanded.delete(reqId)
    } else {
      newExpanded.add(reqId)
    }
    setExpandedRequirements(newExpanded)
  }

  const getStatusColor = (status: ComplianceRequirement['status']) => {
    switch (status) {
      case 'compliant': return 'text-green-600 bg-green-50 border-green-200'
      case 'non_compliant': return 'text-red-600 bg-red-50 border-red-200'
      case 'partial': return 'text-orange-600 bg-orange-50 border-orange-200'
      case 'in_review': return 'text-blue-600 bg-blue-50 border-blue-200'
      case 'needs_assessment': return 'text-gray-600 bg-gray-50 border-gray-200'
      case 'not_applicable': return 'text-gray-400 bg-gray-25 border-gray-100'
    }
  }

  const getStatusIcon = (status: ComplianceRequirement['status']) => {
    switch (status) {
      case 'compliant': return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'non_compliant': return <AlertTriangle className="w-4 h-4 text-red-600" />
      case 'partial': return <Clock className="w-4 h-4 text-orange-600" />
      case 'in_review': return <Eye className="w-4 h-4 text-blue-600" />
      case 'needs_assessment': return <Search className="w-4 h-4 text-gray-600" />
      case 'not_applicable': return <FileCheck className="w-4 h-4 text-gray-400" />
    }
  }

  const getSeverityColor = (severity: ComplianceRequirement['severity']) => {
    switch (severity) {
      case 'critical': return 'text-red-800 bg-red-100'
      case 'high': return 'text-orange-800 bg-orange-100'
      case 'medium': return 'text-yellow-800 bg-yellow-100'
      case 'low': return 'text-green-800 bg-green-100'
    }
  }

  const getFrameworkIcon = (framework: ComplianceRequirement['framework']) => {
    switch (framework) {
      case 'GDPR': return <Shield className="w-4 h-4" />
      case 'SOX': return <BarChart3 className="w-4 h-4" />
      case 'SOC2': return <Lock className="w-4 h-4" />
      case 'ISO27001': return <Globe className="w-4 h-4" />
      case 'HIPAA': return <Users className="w-4 h-4" />
      case 'PCI-DSS': return <Database className="w-4 h-4" />
      default: return <FileCheck className="w-4 h-4" />
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

  const filteredRequirements = requirements.filter(req => {
    const matchesFramework = selectedFramework === 'all' || req.framework.toLowerCase() === selectedFramework
    const matchesCategory = selectedCategory === 'all' || req.category === selectedCategory
    return matchesFramework && matchesCategory
  })

  const categories = [
    { id: 'all', label: 'All Categories', count: requirements.length },
    { id: 'data_privacy', label: 'Data Privacy', count: requirements.filter(r => r.category === 'data_privacy').length },
    { id: 'security', label: 'Security', count: requirements.filter(r => r.category === 'security').length },
    { id: 'financial_reporting', label: 'Financial', count: requirements.filter(r => r.category === 'financial_reporting').length },
    { id: 'operational', label: 'Operational', count: requirements.filter(r => r.category === 'operational').length },
    { id: 'industry_specific', label: 'Industry', count: requirements.filter(r => r.category === 'industry_specific').length }
  ]

  const renderComplianceStats = () => (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <Card>
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{requirements.length}</div>
          <div className="text-sm text-gray-600">Total Requirements</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{requirements.filter(r => r.status === 'compliant').length}</div>
          <div className="text-sm text-gray-600">Compliant</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-red-600">{requirements.filter(r => r.status === 'non_compliant' || r.severity === 'critical').length}</div>
          <div className="text-sm text-gray-600">Critical Issues</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-purple-600">
            {Math.round((requirements.filter(r => r.status === 'compliant').length / requirements.length) * 100)}%
          </div>
          <div className="text-sm text-gray-600">Overall Score</div>
        </CardContent>
      </Card>
    </div>
  )

  const renderRequirementCard = (req: ComplianceRequirement) => (
    <Card key={req.id} className={`
      transition-all duration-200 hover:shadow-md
      ${req.aiAssessment ? 'border-l-4 border-l-purple-400' : ''}
      ${req.severity === 'critical' ? 'border-l-4 border-l-red-400' : ''}
    `}>
      <CardHeader 
        className="cursor-pointer"
        onClick={() => toggleRequirementExpansion(req.id)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {getFrameworkIcon(req.framework)}
            <div>
              <CardTitle className="text-lg">{req.requirement}</CardTitle>
              <p className="text-sm text-gray-600">{req.framework} • {req.category.replace('_', ' ')}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Badge className={`text-xs ${getSeverityColor(req.severity)}`}>
              {req.severity}
            </Badge>
            <Badge className={`text-xs ${getStatusColor(req.status)}`}>
              {req.status.replace('_', ' ')}
            </Badge>
            {req.aiAssessment && (
              <Badge variant="ai" className="text-xs">
                AI: {Math.round(req.aiAssessment.confidence * 100)}%
              </Badge>
            )}
            {expandedRequirements.has(req.id) ? 
              <ChevronDown className="w-4 h-4" /> : 
              <ChevronRight className="w-4 h-4" />
            }
          </div>
        </div>
      </CardHeader>

      {expandedRequirements.has(req.id) && (
        <CardContent>
          <div className="space-y-4">
            {/* Description */}
            <div>
              <h4 className="font-medium mb-2">Description</h4>
              <p className="text-sm text-gray-600">{req.description}</p>
            </div>

            {/* AI Assessment */}
            {req.aiAssessment && currentMode.mode !== 'traditional' && (
              <div className="p-3 bg-purple-50 rounded">
                <h4 className="font-medium mb-2 text-purple-800 flex items-center">
                  <Brain className="w-4 h-4 mr-1" />
                  AI Assessment
                </h4>
                <div className="text-sm text-purple-700 mb-2">{req.aiAssessment.reasoning}</div>
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="font-medium">Risk Level:</span>
                    <Badge className={`ml-1 text-xs ${
                      req.aiAssessment.riskLevel === 'critical' ? 'bg-red-100 text-red-800' :
                      req.aiAssessment.riskLevel === 'high' ? 'bg-orange-100 text-orange-800' :
                      req.aiAssessment.riskLevel === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {req.aiAssessment.riskLevel}
                    </Badge>
                  </div>
                  {req.aiAssessment.industryBenchmark && (
                    <div>
                      <span className="font-medium">Benchmark:</span>
                      <span className="ml-1">{req.aiAssessment.industryBenchmark}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Gap Analysis */}
            {req.gapAnalysis && (
              <div className="p-3 bg-orange-50 rounded">
                <h4 className="font-medium mb-2 text-orange-800">Gap Analysis</h4>
                <p className="text-sm text-orange-700">{req.gapAnalysis}</p>
              </div>
            )}

            {/* Evidence Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-2">Evidence Required</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  {req.evidenceRequired.map((evidence, index) => (
                    <li key={index}>• {evidence}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Evidence Provided</h4>
                {req.evidenceProvided.length > 0 ? (
                  <ul className="text-sm text-green-600 space-y-1">
                    {req.evidenceProvided.map((evidence, index) => (
                      <li key={index}>✓ {evidence}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-red-600">No evidence provided</p>
                )}
              </div>
            </div>

            {/* Remediation Plan */}
            {req.remediationPlan && (
              <div className="p-3 bg-blue-50 rounded">
                <h4 className="font-medium mb-3 text-blue-800 flex items-center justify-between">
                  <span>Remediation Plan</span>
                  <div className="flex items-center space-x-2 text-xs">
                    <Badge className="bg-blue-100 text-blue-800">
                      {req.remediationPlan.timeline} days
                    </Badge>
                    <Badge className="bg-blue-100 text-blue-800">
                      {formatCurrency(req.remediationPlan.cost)}
                    </Badge>
                  </div>
                </h4>
                <div className="space-y-2">
                  <div>
                    <span className="font-medium text-sm">Actions:</span>
                    <ul className="text-sm text-blue-700 mt-1 space-y-1">
                      {req.remediationPlan.actions.map((action, index) => (
                        <li key={index}>• {action}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span><strong>Owner:</strong> {req.remediationPlan.owner}</span>
                    <Badge className={`text-xs ${getSeverityColor(req.remediationPlan.priority)}`}>
                      {req.remediationPlan.priority} priority
                    </Badge>
                  </div>
                </div>
              </div>
            )}

            {/* Metadata */}
            <div className="flex items-center justify-between text-sm text-gray-500 pt-3 border-t">
              <div className="flex items-center space-x-4">
                {req.assessedBy && <span>Assessed by: {req.assessedBy}</span>}
                {req.assessmentDate && <span>Date: {req.assessmentDate.toISOString().split('T')[0]}</span>}
                {req.linkedDocuments.length > 0 && (
                  <div className="flex items-center space-x-1">
                    <FileText className="w-4 h-4" />
                    <span>{req.linkedDocuments.length} docs</span>
                  </div>
                )}
              </div>
              <div className="flex space-x-2">
                <Button variant="ghost" size="sm">
                  <Eye className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Download className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </div>
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
          <h2 className="text-xl font-bold">Compliance Assessment</h2>
          <p className="text-gray-600">Review regulatory compliance status</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Search className="w-4 h-4 mr-2" />
            Search
          </Button>
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {renderComplianceStats()}

      {/* Framework Overview */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Compliance Frameworks</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {frameworks.map((framework) => (
            <Card key={framework.id} className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold">{framework.fullName}</h4>
                  <Badge variant="outline">
                    {Math.round(framework.complianceScore * 100)}%
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 mb-3">{framework.description}</p>
                <div className="flex items-center justify-between text-sm">
                  <span>{framework.assessedRequirements}/{framework.totalRequirements} assessed</span>
                  {framework.criticalGaps > 0 && (
                    <Badge variant="destructive" className="text-xs">
                      {framework.criticalGaps} critical gaps
                    </Badge>
                  )}
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${framework.complianceScore * 100}%` }}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Category Filters */}
      <div className="flex space-x-2 overflow-x-auto mb-4">
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(category.id)}
          >
            {category.label} ({category.count})
          </Button>
        ))}
      </div>

      {/* Requirements List */}
      <div className="space-y-4">
        {filteredRequirements.map(renderRequirementCard)}
      </div>
    </div>
  )

  const renderAssistedView = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold flex items-center">
            <Brain className="w-5 h-5 mr-2 text-purple-500" />
            AI Compliance Management
            <Badge variant="ai" className="ml-3">Automated Assessment</Badge>
          </h2>
          <p className="text-gray-600">Intelligent compliance monitoring and gap analysis</p>
        </div>
        <div className="flex items-center space-x-2">
          {requirements.filter(r => r.status === 'needs_assessment').length > 0 && (
            <Button 
              onClick={handleAIComplanceScan}
              disabled={scanningInProgress}
              variant="ai"
            >
              {scanningInProgress ? (
                <Clock className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Zap className="w-4 h-4 mr-2" />
              )}
              AI Compliance Scan
            </Button>
          )}
          <Button variant="outline" size="sm">
            <Sparkles className="w-4 h-4 mr-2" />
            Generate Report
          </Button>
        </div>
      </div>

      {/* AI Scanning Status */}
      {scanningInProgress && (
        <Card className="border-purple-200 bg-purple-50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Brain className="w-5 h-5 text-purple-600" />
              <div>
                <h3 className="font-semibold text-purple-800">AI Compliance Scan in Progress</h3>
                <p className="text-sm text-purple-600">
                  Analyzing {requirements.length} requirements across {frameworks.length} frameworks...
                </p>
              </div>
            </div>
            <div className="mt-2 bg-purple-200 rounded-full h-2">
              <div className="bg-purple-600 h-2 rounded-full animate-pulse" style={{ width: '70%' }} />
            </div>
          </CardContent>
        </Card>
      )}

      {renderComplianceStats()}

      {/* Enhanced Framework Overview */}
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Target className="w-5 h-5 mr-2" />
          Compliance Frameworks Status
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {frameworks.map((framework) => (
            <Card key={framework.id} className="cursor-pointer hover:shadow-md transition-shadow border-l-4 border-l-blue-400">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    {getFrameworkIcon(framework.name as any)}
                    <h4 className="font-semibold">{framework.fullName}</h4>
                  </div>
                  <Badge className={`text-sm ${
                    framework.complianceScore >= 0.8 ? 'bg-green-100 text-green-800' :
                    framework.complianceScore >= 0.6 ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {Math.round(framework.complianceScore * 100)}%
                  </Badge>
                </div>
                
                <div className="grid grid-cols-3 gap-2 mb-3 text-sm">
                  <div className="text-center p-2 bg-green-50 rounded">
                    <div className="font-bold text-green-700">{framework.assessedRequirements}</div>
                    <div className="text-xs text-green-600">Assessed</div>
                  </div>
                  <div className="text-center p-2 bg-orange-50 rounded">
                    <div className="font-bold text-orange-700">{framework.totalRequirements - framework.assessedRequirements}</div>
                    <div className="text-xs text-orange-600">Pending</div>
                  </div>
                  <div className="text-center p-2 bg-red-50 rounded">
                    <div className="font-bold text-red-700">{framework.criticalGaps}</div>
                    <div className="text-xs text-red-600">Critical</div>
                  </div>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className={`h-3 rounded-full ${
                      framework.complianceScore >= 0.8 ? 'bg-green-500' :
                      framework.complianceScore >= 0.6 ? 'bg-yellow-500' :
                      'bg-red-500'
                    }`}
                    style={{ width: `${framework.complianceScore * 100}%` }}
                  />
                </div>

                <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
                  <span>Last: {framework.lastAssessment?.toISOString().split('T')[0]}</span>
                  <Button size="sm" variant="outline" className="text-xs">
                    Deep Scan
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Category Filters with AI indicators */}
      <div className="flex space-x-2 overflow-x-auto mb-4">
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(category.id)}
          >
            {category.label} ({category.count})
            {category.id !== 'all' && requirements.filter(r => r.category === category.id && r.aiAssessment).length > 0 && (
              <Badge variant="ai" className="ml-2 text-xs">AI</Badge>
            )}
          </Button>
        ))}
      </div>

      {/* Requirements List */}
      <div className="space-y-4">
        {filteredRequirements.map(renderRequirementCard)}
      </div>
    </div>
  )

  const renderAutonomousView = () => (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start space-x-4">
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
              <Shield className="w-4 h-4 text-purple-600" />
            </div>
            <div className="flex-1">
              <div className="bg-purple-50 rounded-lg p-4 mb-4">
                <p className="text-sm mb-2">
                  <strong>Compliance Assessment Complete:</strong> Analyzed {requirements.length} requirements across {frameworks.length} frameworks.
                </p>
                <p className="text-sm">
                  Identified {requirements.filter(r => r.severity === 'critical' && r.status !== 'compliant').length} critical gaps requiring immediate attention.
                </p>
              </div>

              {/* Critical Issues */}
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <h4 className="font-medium text-red-800 mb-3 flex items-center">
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Critical Compliance Issues
                </h4>
                <div className="space-y-3">
                  {requirements
                    .filter(req => req.severity === 'critical' && req.status !== 'compliant')
                    .slice(0, 3)
                    .map((req) => (
                    <div key={req.id} className="bg-white rounded p-3">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-medium">{req.requirement}</h5>
                        <Badge className="bg-red-100 text-red-800 text-xs">{req.framework}</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{req.description}</p>
                      {req.remediationPlan && (
                        <p className="text-sm text-red-600 mb-2">
                          Est. remediation: {req.remediationPlan.timeline} days, {formatCurrency(req.remediationPlan.cost)}
                        </p>
                      )}
                      <div className="flex space-x-2">
                        <Button size="sm" variant="destructive">Start Remediation</Button>
                        <Button size="sm" variant="outline">Schedule Review</Button>
                        <Button size="sm" variant="outline">Get Legal Input</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Automated Actions Taken */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-medium text-green-800 mb-3 flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Automated Assessment Results
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm text-green-700">
                  <div>• {requirements.filter(r => r.aiAssessment).length} AI-assessed requirements</div>
                  <div>• {requirements.filter(r => r.status === 'compliant').length} confirmed compliant items</div>
                  <div>• {frameworks.length} frameworks analyzed</div>
                  <div>• {requirements.filter(r => r.remediationPlan).length} remediation plans generated</div>
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