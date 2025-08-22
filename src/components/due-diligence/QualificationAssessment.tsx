'use client'

import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { 
  Shield,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Phone,
  Mail,
  Award,
  Clock,
  FileText,
  Star,
  Eye,
  Plus,
  Download,
  RefreshCw,
  Target,
  User,
  Brain,
  Building,
  GraduationCap,
  Briefcase,
  TrendingUp,
  TrendingDown,
  Activity,
  Loader2
} from 'lucide-react'

interface QualificationAssessmentData {
  id: string;
  team_member_id: string;
  assessment_type: 'skills' | 'references' | 'performance' | 'competency' | 'cultural_fit';
  overall_qualification_score: number;
  verification_status: 'pending' | 'in_progress' | 'completed' | 'failed';
  confidence_level: number;
  findings: any[];
  recommendations: any[];
  red_flags: any[];
  skillValidations: SkillValidation[];
  referenceChecks: ReferenceCheck[];
  performanceValidations: PerformanceValidation[];
  competencyValidations: CompetencyValidation[];
  culturalFitAssessments: CulturalFitAssessment[];
  documents: QualificationDocument[];
}

interface SkillValidation {
  id: string;
  skill_category: string;
  skill_name: string;
  claimed_proficiency: number;
  validated_proficiency: number;
  validation_method: string;
  evidence_quality: number;
  industry_relevance: number;
}

interface ReferenceCheck {
  id: string;
  reference_name: string;
  reference_position?: string;
  reference_company?: string;
  relationship_to_candidate: string;
  response_status: 'pending' | 'completed' | 'declined' | 'unreachable';
  overall_rating: number;
  would_rehire?: boolean;
  leadership_rating: number;
  performance_rating: number;
  integrity_rating: number;
  collaboration_rating: number;
  strengths_mentioned: string[];
  concerns_mentioned: string[];
  red_flags: string[];
}

interface PerformanceValidation {
  id: string;
  performance_period_start: string;
  performance_period_end: string;
  company_name?: string;
  role_title?: string;
  claimed_achievements: string[];
  validated_achievements: string[];
  revenue_impact: number;
  cost_savings: number;
  stakeholder_feedback_score: number;
  validation_confidence: number;
  discrepancies_found: string[];
}

interface CompetencyValidation {
  id: string;
  competency_category: string;
  competency_name: string;
  required_level: number;
  demonstrated_level: number;
  assessment_method: string;
  competency_gaps: string[];
  future_potential_score: number;
  assessor_confidence: number;
}

interface CulturalFitAssessment {
  id: string;
  values_alignment_score: number;
  work_style_compatibility: number;
  communication_style_fit: number;
  leadership_style_fit: number;
  team_integration_potential: number;
  cultural_red_flags: string[];
  integration_strategies: string[];
}

interface QualificationDocument {
  id: string;
  document_type: string;
  document_name: string;
  verification_status: 'pending' | 'verified' | 'discrepancy' | 'fake';
  authenticity_score: number;
  relevance_score: number;
  quality_score: number;
  discrepancies: string[];
}

interface QualificationAssessmentProps {
  projectId: string
  teamMemberId: string
  memberName: string
  memberRole: string
  mode?: 'traditional' | 'assisted' | 'autonomous'
}

export function QualificationAssessment({ 
  projectId, 
  teamMemberId, 
  memberName, 
  memberRole,
  mode = 'assisted' 
}: QualificationAssessmentProps) {
  const [assessments, setAssessments] = React.useState<QualificationAssessmentData[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [activeTab, setActiveTab] = React.useState<'overview' | 'skills' | 'references' | 'performance' | 'documents'>('overview')
  const [selectedAssessment, setSelectedAssessment] = React.useState<QualificationAssessmentData | null>(null)

  // Fetch qualification assessments
  React.useEffect(() => {
    const fetchAssessments = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const response = await fetch(`/api/due-diligence/${projectId}/qualification-assessment/${teamMemberId}`)
        
        if (response.ok) {
          const data = await response.json()
          setAssessments(data)
          if (data.length > 0) {
            setSelectedAssessment(data[0])
          }
        } else {
          setError('Failed to fetch qualification assessments')
        }
      } catch (err) {
        console.error('Error fetching qualification assessments:', err)
        setError('Failed to load qualification assessments')
      } finally {
        setLoading(false)
      }
    }

    fetchAssessments()
  }, [projectId, teamMemberId])

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-8 h-8 animate-spin" />
        <span className="ml-2">Loading qualification assessment...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <p className="text-red-800">{error}</p>
            </div>
            <Button 
              onClick={() => window.location.reload()} 
              className="mt-4"
              variant="outline"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const currentAssessment = selectedAssessment || (assessments.length > 0 ? assessments[0] : null)

  const getVerificationStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'in_progress': return <Clock className="w-4 h-4 text-blue-500" />
      case 'failed': return <XCircle className="w-4 h-4 text-red-500" />
      default: return <Clock className="w-4 h-4 text-gray-500" />
    }
  }

  const getVerificationStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-50 text-green-700 border-green-200'
      case 'in_progress': return 'bg-blue-50 text-blue-700 border-blue-200'
      case 'failed': return 'bg-red-50 text-red-700 border-red-200'
      default: return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  const renderOverview = () => {
    if (!currentAssessment) {
      return (
        <Card className="p-6 text-center">
          <div className="flex flex-col items-center space-y-4">
            <div className="p-3 bg-gray-100 rounded-full">
              <Shield className="w-8 h-8 text-gray-400" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">No Qualification Assessment</h3>
              <p className="text-sm text-gray-600 mt-1">Start a qualification assessment for this team member</p>
            </div>
            <Button size="sm" className="mt-2">
              <Plus className="w-4 h-4 mr-2" />
              Start Assessment
            </Button>
          </div>
        </Card>
      )
    }

    return (
      <div className="space-y-6">
        {/* Assessment Summary */}
        <Card className="p-4">
          <h4 className="font-medium mb-4">Qualification Assessment Summary</h4>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-3xl font-bold text-blue-600">{currentAssessment.overall_qualification_score}%</div>
              <div className="text-sm text-blue-700">Overall Qualification</div>
              <div className="text-xs text-blue-600 mt-1">
                {currentAssessment.overall_qualification_score > 85 ? '🟢 Excellent' : 
                 currentAssessment.overall_qualification_score > 70 ? '🟡 Good' : '🔴 Needs Review'}
              </div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-3xl font-bold text-green-600">{Math.round(currentAssessment.confidence_level * 100)}%</div>
              <div className="text-sm text-green-700">Assessment Confidence</div>
              <div className="text-xs text-green-600 mt-1 flex items-center justify-center">
                {getVerificationStatusIcon(currentAssessment.verification_status)}
                <span className="ml-1">{currentAssessment.verification_status}</span>
              </div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-3xl font-bold text-purple-600">{currentAssessment.referenceChecks.length}</div>
              <div className="text-sm text-purple-700">References Checked</div>
              <div className="text-xs text-purple-600 mt-1">
                {currentAssessment.referenceChecks.filter(r => r.response_status === 'completed').length} completed
              </div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-3xl font-bold text-orange-600">{currentAssessment.red_flags.length}</div>
              <div className="text-sm text-orange-700">Red Flags</div>
              <div className="text-xs text-orange-600 mt-1">
                {currentAssessment.red_flags.length === 0 ? 'None identified' : 'Requires attention'}
              </div>
            </div>
          </div>
        </Card>

        {/* Skills Validation Summary */}
        <Card className="p-4">
          <h4 className="font-medium mb-4">Skills Validation Overview</h4>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {Object.entries(
              currentAssessment.skillValidations.reduce((acc: any, skill) => {
                if (!acc[skill.skill_category]) {
                  acc[skill.skill_category] = []
                }
                acc[skill.skill_category].push(skill)
                return acc
              }, {})
            ).map(([category, skills]: [string, any[]]) => {
              const avgClaimed = skills.reduce((sum, s) => sum + s.claimed_proficiency, 0) / skills.length
              const avgValidated = skills.reduce((sum, s) => sum + s.validated_proficiency, 0) / skills.length
              const variance = avgValidated - avgClaimed
              
              return (
                <div key={category} className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-medium capitalize">{category.replace('_', ' ')}</h5>
                    <Badge variant={variance >= 0 ? 'default' : 'destructive'} className="text-xs">
                      {variance >= 0 ? '+' : ''}{Math.round(variance)}% variance
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Claimed Proficiency</span>
                      <div className="flex items-center space-x-2">
                        <Progress value={avgClaimed} className="w-20 h-2" />
                        <span className="font-medium">{Math.round(avgClaimed)}%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Validated Proficiency</span>
                      <div className="flex items-center space-x-2">
                        <Progress value={avgValidated} className="w-20 h-2" />
                        <span className="font-medium">{Math.round(avgValidated)}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </Card>

        {/* Reference Checks Summary */}
        <Card className="p-4">
          <h4 className="font-medium mb-4">Reference Checks Summary</h4>
          <div className="space-y-3">
            {currentAssessment.referenceChecks.slice(0, 3).map((reference) => (
              <div key={reference.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <User className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-medium">{reference.reference_name}</div>
                    <div className="text-sm text-gray-600">
                      {reference.reference_position} at {reference.reference_company}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge 
                    variant={reference.response_status === 'completed' ? 'default' : 'secondary'}
                    className="text-xs"
                  >
                    {reference.response_status}
                  </Badge>
                  {reference.response_status === 'completed' && (
                    <div className="text-right">
                      <div className="text-sm font-medium">{reference.overall_rating}%</div>
                      <div className="text-xs text-gray-600">Overall Rating</div>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {currentAssessment.referenceChecks.length > 3 && (
              <div className="text-center text-sm text-gray-600">
                And {currentAssessment.referenceChecks.length - 3} more references...
              </div>
            )}
          </div>
        </Card>

        {/* Red Flags */}
        {currentAssessment.red_flags.length > 0 && (
          <Card className="p-4 border-red-200 bg-red-50">
            <h4 className="font-medium mb-3 flex items-center">
              <AlertTriangle className="w-4 h-4 text-red-500 mr-2" />
              Red Flags Identified
            </h4>
            <div className="space-y-2">
              {currentAssessment.red_flags.map((flag, index) => (
                <div key={index} className="p-2 bg-red-100 rounded border-l-4 border-red-400">
                  <div className="text-sm text-red-800">{flag.description || flag}</div>
                  {flag.severity && (
                    <div className="text-xs text-red-600 mt-1">
                      Severity: {flag.severity} • Source: {flag.source || 'Assessment'}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    )
  }

  const renderSkillsValidation = () => {
    if (!currentAssessment || currentAssessment.skillValidations.length === 0) {
      return (
        <Card className="p-6 text-center">
          <div className="flex flex-col items-center space-y-4">
            <div className="p-3 bg-gray-100 rounded-full">
              <Award className="w-8 h-8 text-gray-400" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">No Skills Validated</h3>
              <p className="text-sm text-gray-600 mt-1">Add skills validation to assess competencies</p>
            </div>
            <Button size="sm" className="mt-2">
              <Plus className="w-4 h-4 mr-2" />
              Add Skill Validation
            </Button>
          </div>
        </Card>
      )
    }

    return (
      <div className="space-y-4">
        {currentAssessment.skillValidations.map((skill) => {
          const variance = skill.validated_proficiency - skill.claimed_proficiency
          const isValidated = skill.validated_proficiency > 0
          
          return (
            <Card key={skill.id} className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h5 className="font-medium">{skill.skill_name}</h5>
                  <p className="text-sm text-gray-600 capitalize">{skill.skill_category.replace('_', ' ')}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={isValidated ? 'default' : 'secondary'} className="text-xs">
                    {skill.validation_method}
                  </Badge>
                  <Badge 
                    variant={variance >= 0 ? 'default' : 'destructive'} 
                    className="text-xs"
                  >
                    {variance >= 0 ? '+' : ''}{variance}% variance
                  </Badge>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                <div>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-600">Claimed Proficiency</span>
                    <span className="font-medium">{skill.claimed_proficiency}%</span>
                  </div>
                  <Progress value={skill.claimed_proficiency} className="h-2" />
                </div>
                <div>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-600">Validated Proficiency</span>
                    <span className="font-medium">{skill.validated_proficiency}%</span>
                  </div>
                  <Progress value={skill.validated_proficiency} className="h-2" />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Evidence Quality</span>
                  <div className="flex items-center space-x-2">
                    <Progress value={skill.evidence_quality} className="w-16 h-1" />
                    <span className="text-xs">{skill.evidence_quality}%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Industry Relevance</span>
                  <div className="flex items-center space-x-2">
                    <Progress value={skill.industry_relevance} className="w-16 h-1" />
                    <span className="text-xs">{skill.industry_relevance}%</span>
                  </div>
                </div>
              </div>
            </Card>
          )
        })}
      </div>
    )
  }

  const renderReferenceChecks = () => {
    if (!currentAssessment || currentAssessment.referenceChecks.length === 0) {
      return (
        <Card className="p-6 text-center">
          <div className="flex flex-col items-center space-y-4">
            <div className="p-3 bg-gray-100 rounded-full">
              <Phone className="w-8 h-8 text-gray-400" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">No Reference Checks</h3>
              <p className="text-sm text-gray-600 mt-1">Add reference checks to validate background</p>
            </div>
            <Button size="sm" className="mt-2">
              <Plus className="w-4 h-4 mr-2" />
              Add Reference Check
            </Button>
          </div>
        </Card>
      )
    }

    return (
      <div className="space-y-4">
        {currentAssessment.referenceChecks.map((reference) => (
          <Card key={reference.id} className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h5 className="font-medium">{reference.reference_name}</h5>
                  <p className="text-sm text-gray-600">
                    {reference.reference_position} at {reference.reference_company}
                  </p>
                  <p className="text-xs text-gray-500 capitalize">
                    {reference.relationship_to_candidate.replace('_', ' ')}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <Badge 
                  variant={reference.response_status === 'completed' ? 'default' : 'secondary'}
                  className="mb-2"
                >
                  {reference.response_status}
                </Badge>
                {reference.response_status === 'completed' && (
                  <div className="text-sm">
                    <div className="font-medium">{reference.overall_rating}%</div>
                    <div className="text-xs text-gray-600">Overall Rating</div>
                  </div>
                )}
              </div>
            </div>

            {reference.response_status === 'completed' && (
              <div className="space-y-4">
                {/* Rating Breakdown */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  {[
                    { label: 'Leadership', value: reference.leadership_rating },
                    { label: 'Performance', value: reference.performance_rating },
                    { label: 'Integrity', value: reference.integrity_rating },
                    { label: 'Collaboration', value: reference.collaboration_rating }
                  ].map((rating) => (
                    <div key={rating.label} className="text-center p-2 bg-gray-50 rounded">
                      <div className="text-sm font-medium">{rating.value}%</div>
                      <div className="text-xs text-gray-600">{rating.label}</div>
                    </div>
                  ))}
                </div>

                {/* Would Rehire */}
                {reference.would_rehire !== undefined && (
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">Would rehire:</span>
                    <Badge variant={reference.would_rehire ? 'default' : 'destructive'}>
                      {reference.would_rehire ? 'Yes' : 'No'}
                    </Badge>
                  </div>
                )}

                {/* Strengths */}
                {reference.strengths_mentioned.length > 0 && (
                  <div>
                    <h6 className="text-sm font-medium mb-2 text-green-700">Strengths Mentioned</h6>
                    <div className="flex flex-wrap gap-1">
                      {reference.strengths_mentioned.map((strength, index) => (
                        <Badge key={index} variant="outline" className="text-xs bg-green-50 text-green-700">
                          {strength}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Concerns */}
                {reference.concerns_mentioned.length > 0 && (
                  <div>
                    <h6 className="text-sm font-medium mb-2 text-orange-700">Concerns Mentioned</h6>
                    <div className="flex flex-wrap gap-1">
                      {reference.concerns_mentioned.map((concern, index) => (
                        <Badge key={index} variant="outline" className="text-xs bg-orange-50 text-orange-700">
                          {concern}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Red Flags */}
                {reference.red_flags.length > 0 && (
                  <div>
                    <h6 className="text-sm font-medium mb-2 text-red-700">Red Flags</h6>
                    <div className="space-y-1">
                      {reference.red_flags.map((flag, index) => (
                        <div key={index} className="text-xs text-red-600 bg-red-50 p-2 rounded border-l-2 border-red-200">
                          {flag}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </Card>
        ))}
      </div>
    )
  }

  const renderPerformanceValidation = () => {
    if (!currentAssessment || currentAssessment.performanceValidations.length === 0) {
      return (
        <Card className="p-6 text-center">
          <div className="flex flex-col items-center space-y-4">
            <div className="p-3 bg-gray-100 rounded-full">
              <Target className="w-8 h-8 text-gray-400" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">No Performance Validations</h3>
              <p className="text-sm text-gray-600 mt-1">Add performance validations to verify achievements</p>
            </div>
            <Button size="sm" className="mt-2">
              <Plus className="w-4 h-4 mr-2" />
              Add Performance Validation
            </Button>
          </div>
        </Card>
      )
    }

    return (
      <div className="space-y-4">
        {currentAssessment.performanceValidations.map((performance) => (
          <Card key={performance.id} className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Briefcase className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h5 className="font-medium">{performance.role_title}</h5>
                  <p className="text-sm text-gray-600">{performance.company_name}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(performance.performance_period_start).toLocaleDateString()} - {new Date(performance.performance_period_end).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium">{Math.round(performance.validation_confidence * 100)}%</div>
                <div className="text-xs text-gray-600">Validation Confidence</div>
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-lg font-bold text-green-600">
                  ${(performance.revenue_impact / 1000000).toFixed(1)}M
                </div>
                <div className="text-xs text-green-700">Revenue Impact</div>
              </div>
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-lg font-bold text-blue-600">
                  ${(performance.cost_savings / 1000000).toFixed(1)}M
                </div>
                <div className="text-xs text-blue-700">Cost Savings</div>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <div className="text-lg font-bold text-purple-600">{performance.stakeholder_feedback_score}%</div>
                <div className="text-xs text-purple-700">Stakeholder Rating</div>
              </div>
            </div>

            {/* Achievements Comparison */}
            <div className="space-y-4">
              <div>
                <h6 className="text-sm font-medium mb-2 text-gray-700">Claimed Achievements</h6>
                <div className="space-y-1">
                  {performance.claimed_achievements.map((achievement, index) => (
                    <div key={index} className="text-sm p-2 bg-gray-50 rounded border-l-2 border-gray-300">
                      {achievement}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h6 className="text-sm font-medium mb-2 text-green-700">Validated Achievements</h6>
                <div className="space-y-1">
                  {performance.validated_achievements.map((achievement, index) => (
                    <div key={index} className="text-sm p-2 bg-green-50 rounded border-l-2 border-green-300">
                      ✓ {achievement}
                    </div>
                  ))}
                </div>
              </div>

              {/* Discrepancies */}
              {performance.discrepancies_found.length > 0 && (
                <div>
                  <h6 className="text-sm font-medium mb-2 text-red-700">Discrepancies Found</h6>
                  <div className="space-y-1">
                    {performance.discrepancies_found.map((discrepancy, index) => (
                      <div key={index} className="text-sm p-2 bg-red-50 rounded border-l-2 border-red-300 text-red-700">
                        ⚠ {discrepancy}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
    )
  }

  const renderDocumentVerification = () => {
    if (!currentAssessment || currentAssessment.documents.length === 0) {
      return (
        <Card className="p-6 text-center">
          <div className="flex flex-col items-center space-y-4">
            <div className="p-3 bg-gray-100 rounded-full">
              <FileText className="w-8 h-8 text-gray-400" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">No Documents to Verify</h3>
              <p className="text-sm text-gray-600 mt-1">Upload documents for verification and authenticity checks</p>
            </div>
            <Button size="sm" className="mt-2">
              <Plus className="w-4 h-4 mr-2" />
              Upload Document
            </Button>
          </div>
        </Card>
      )
    }

    return (
      <div className="space-y-4">
        {currentAssessment.documents.map((document) => {
          const getStatusColor = (status: string) => {
            switch (status) {
              case 'verified': return 'bg-green-50 text-green-700 border-green-200'
              case 'discrepancy': return 'bg-orange-50 text-orange-700 border-orange-200'
              case 'fake': return 'bg-red-50 text-red-700 border-red-200'
              default: return 'bg-gray-50 text-gray-700 border-gray-200'
            }
          }

          const getStatusIcon = (status: string) => {
            switch (status) {
              case 'verified': return <CheckCircle className="w-4 h-4 text-green-500" />
              case 'discrepancy': return <AlertTriangle className="w-4 h-4 text-orange-500" />
              case 'fake': return <XCircle className="w-4 h-4 text-red-500" />
              default: return <Clock className="w-4 h-4 text-gray-500" />
            }
          }

          return (
            <Card key={document.id} className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <FileText className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h5 className="font-medium">{document.document_name}</h5>
                    <p className="text-sm text-gray-600 capitalize">{document.document_type.replace('_', ' ')}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(document.verification_status)}
                  <Badge className={`text-xs ${getStatusColor(document.verification_status)}`}>
                    {document.verification_status}
                  </Badge>
                </div>
              </div>

              {/* Verification Scores */}
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center p-2 bg-gray-50 rounded">
                  <div className="text-sm font-medium">{document.authenticity_score}%</div>
                  <div className="text-xs text-gray-600">Authenticity</div>
                  <Progress value={document.authenticity_score} className="w-full h-1 mt-1" />
                </div>
                <div className="text-center p-2 bg-gray-50 rounded">
                  <div className="text-sm font-medium">{document.relevance_score}%</div>
                  <div className="text-xs text-gray-600">Relevance</div>
                  <Progress value={document.relevance_score} className="w-full h-1 mt-1" />
                </div>
                <div className="text-center p-2 bg-gray-50 rounded">
                  <div className="text-sm font-medium">{document.quality_score}%</div>
                  <div className="text-xs text-gray-600">Quality</div>
                  <Progress value={document.quality_score} className="w-full h-1 mt-1" />
                </div>
              </div>

              {/* Discrepancies */}
              {document.discrepancies.length > 0 && (
                <div>
                  <h6 className="text-sm font-medium mb-2 text-orange-700">Discrepancies Found</h6>
                  <div className="space-y-1">
                    {document.discrepancies.map((discrepancy, index) => (
                      <div key={index} className="text-sm p-2 bg-orange-50 rounded border-l-2 border-orange-300 text-orange-700">
                        ⚠ {discrepancy}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-between mt-4 pt-3 border-t">
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4 mr-2" />
                    View Document
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </div>
                {document.verification_status === 'pending' && (
                  <Button size="sm">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Re-verify
                  </Button>
                )}
              </div>
            </Card>
          )
        })}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-green-100 rounded-lg">
            <Shield className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">Qualification Assessment</h2>
            <p className="text-gray-600">{memberName} - {memberRole}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {currentAssessment && (
            <Badge variant="outline" className="text-sm">
              Score: {currentAssessment.overall_qualification_score}/100
            </Badge>
          )}
          {mode === 'assisted' && (
            <Badge variant="ai" className="text-sm">
              <Brain className="w-3 h-3 mr-1" />
              AI Enhanced
            </Badge>
          )}
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Update Assessment
          </Button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b">
        <nav className="flex space-x-8">
          {[
            { id: 'overview', label: 'Overview', icon: Eye },
            { id: 'skills', label: 'Skills Validation', icon: Award },
            { id: 'references', label: 'Reference Checks', icon: Phone },
            { id: 'performance', label: 'Performance Validation', icon: Target },
            { id: 'documents', label: 'Document Verification', icon: FileText }
          ].map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`
                  flex items-center space-x-2 py-3 border-b-2 text-sm font-medium transition-colors
                  ${isActive 
                    ? 'border-green-500 text-green-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.id === 'references' && currentAssessment && (
                  <Badge variant="secondary" className="text-xs">
                    {currentAssessment.referenceChecks.length}
                  </Badge>
                )}
                {tab.id === 'skills' && currentAssessment && (
                  <Badge variant="secondary" className="text-xs">
                    {currentAssessment.skillValidations.length}
                  </Badge>
                )}
              </button>
            )
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'skills' && renderSkillsValidation()}
        {activeTab === 'references' && renderReferenceChecks()}
        {activeTab === 'performance' && renderPerformanceValidation()}
        {activeTab === 'documents' && renderDocumentVerification()}
      </div>
    </div>
  )
}
