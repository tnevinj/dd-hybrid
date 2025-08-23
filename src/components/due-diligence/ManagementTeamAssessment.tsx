'use client'

import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { 
  Users,
  User,
  TrendingUp,
  TrendingDown,
  Target,
  AlertTriangle,
  CheckCircle,
  Brain,
  Award,
  Clock,
  Building,
  GraduationCap,
  Briefcase,
  Star,
  Shield,
  ArrowRight,
  Plus,
  Download,
  RefreshCw,
  Search,
  Filter,
  Eye,
  Calendar,
  BarChart3,
  Loader2
} from 'lucide-react'
import { QualificationAssessment } from './QualificationAssessment'

interface ManagementAssessmentData {
  id: string;
  project_id: string;
  workspace_id?: string;
  assessment_date: string;
  overall_team_score: number;
  leadership_score: number;
  strategic_thinking_score: number;
  execution_capability_score: number;
  financial_acumen_score: number;
  industry_expertise_score: number;
  team_dynamics_score: number;
  succession_readiness_score: number;
  retention_risk_score: number;
  status: 'draft' | 'in_progress' | 'completed' | 'approved';
  assessor_name?: string;
  key_strengths: any[];
  key_concerns: any[];
  succession_gaps: any[];
  retention_strategies: any[];
  teamMembers: any[];
  gpRelationships: any[];
  created_at: string;
  updated_at: string;
}

interface ManagementTeamAssessmentProps {
  projectId: string
  mode?: 'traditional' | 'assisted' | 'autonomous'
}

interface QualificationStatus {
  teamMemberId: string;
  status: 'completed' | 'pending' | 'in_progress';
  overallScore?: number;
  assessmentCount: number;
  lastUpdated?: string;
  confidenceLevel?: number;
}

export function ManagementTeamAssessment({ projectId, mode = 'assisted' }: ManagementTeamAssessmentProps) {
  const [selectedMember, setSelectedMember] = React.useState<string | null>(null)
  const [activeTab, setActiveTab] = React.useState<'overview' | 'team' | 'competencies' | 'qualification' | 'succession'>('overview')
  const [managementData, setManagementData] = React.useState<ManagementAssessmentData | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [qualificationStatuses, setQualificationStatuses] = React.useState<Record<string, QualificationStatus>>({})
  const [statusLoading, setStatusLoading] = React.useState(false)

  // Fetch management assessment data
  React.useEffect(() => {
    const fetchManagementData = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const response = await fetch(`/api/due-diligence/${projectId}/management-assessment`)
        
        if (response.status === 404) {
          // No assessment exists yet, create a default one
          const createResponse = await fetch(`/api/due-diligence/${projectId}/management-assessment`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              workspace_id: null,
              assessor_name: 'System',
              key_strengths: [],
              key_concerns: [],
              succession_gaps: [],
              retention_strategies: []
            })
          })
          
          if (createResponse.ok) {
            const newData = await createResponse.json()
            setManagementData(newData)
          } else {
            setError('Failed to create management assessment')
          }
        } else if (response.ok) {
          const data = await response.json()
          setManagementData(data)
        } else {
          setError('Failed to fetch management assessment')
        }
      } catch (err) {
        console.error('Error fetching management data:', err)
        setError('Failed to load management assessment')
      } finally {
        setLoading(false)
      }
    }

    fetchManagementData()
  }, [projectId])

  // Fetch qualification assessment statuses for all team members
  React.useEffect(() => {
    const fetchQualificationStatuses = async () => {
      if (!managementData?.teamMembers?.length) return;

      setStatusLoading(true);
      const statuses: Record<string, QualificationStatus> = {};

      try {
        // Fetch qualification status for each team member
        const promises = managementData.teamMembers.map(async (member) => {
          try {
            const response = await fetch(`/api/due-diligence/${projectId}/qualification-assessment/${member.id}`);
            
            if (response.ok) {
              const assessments = await response.json();
              
              if (Array.isArray(assessments) && assessments.length > 0) {
                // Calculate overall status from assessments
                const completedAssessments = assessments.filter(a => a.verification_status === 'completed');
                const totalAssessments = assessments.length;
                const avgScore = completedAssessments.length > 0 
                  ? completedAssessments.reduce((sum, a) => sum + (a.overall_qualification_score || 0), 0) / completedAssessments.length
                  : 0;
                
                let status: 'completed' | 'pending' | 'in_progress' = 'pending';
                if (completedAssessments.length === totalAssessments && totalAssessments > 0) {
                  status = 'completed';
                } else if (completedAssessments.length > 0) {
                  status = 'in_progress';
                }

                statuses[member.id] = {
                  teamMemberId: member.id,
                  status,
                  overallScore: avgScore > 0 ? Math.round(avgScore) : undefined,
                  assessmentCount: totalAssessments,
                  lastUpdated: assessments[0]?.updated_at,
                  confidenceLevel: completedAssessments.length > 0 
                    ? completedAssessments.reduce((sum, a) => sum + (a.confidence_level || 0), 0) / completedAssessments.length
                    : undefined
                };
              } else {
                statuses[member.id] = {
                  teamMemberId: member.id,
                  status: 'pending',
                  assessmentCount: 0
                };
              }
            } else {
              // API error or no data
              statuses[member.id] = {
                teamMemberId: member.id,
                status: 'pending',
                assessmentCount: 0
              };
            }
          } catch (err) {
            console.error(`Error fetching qualification status for ${member.name}:`, err);
            statuses[member.id] = {
              teamMemberId: member.id,
              status: 'pending',
              assessmentCount: 0
            };
          }
        });

        await Promise.all(promises);
        setQualificationStatuses(statuses);
      } catch (err) {
        console.error('Error fetching qualification statuses:', err);
      } finally {
        setStatusLoading(false);
      }
    };

    fetchQualificationStatuses();
  }, [managementData?.teamMembers, projectId]);

  // Helper function to get qualification status badge info
  const getQualificationStatusBadge = (teamMemberId: string) => {
    const status = qualificationStatuses[teamMemberId];
    
    if (statusLoading) {
      return {
        text: 'Checking...',
        variant: 'secondary' as const,
        color: 'text-gray-600'
      };
    }
    
    if (!status) {
      return {
        text: 'Pending Assessment',
        variant: 'secondary' as const,
        color: 'text-gray-600'
      };
    }
    
    switch (status.status) {
      case 'completed':
        return {
          text: `Completed${status.overallScore ? ` (${status.overallScore}%)` : ''}`,
          variant: 'default' as const,
          color: 'text-green-600'
        };
      case 'in_progress':
        return {
          text: `In Progress (${status.assessmentCount} assessments)`,
          variant: 'secondary' as const,
          color: 'text-blue-600'
        };
      default:
        return {
          text: 'Pending Assessment',
          variant: 'secondary' as const,
          color: 'text-orange-600'
        };
    }
  };

  // Update assessment scores
  const updateAssessment = async (updates: Partial<ManagementAssessmentData>) => {
    if (!managementData) return

    try {
      const response = await fetch(`/api/due-diligence/${projectId}/management-assessment`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates)
      })

      if (response.ok) {
        const updatedData = await response.json()
        setManagementData(updatedData)
      } else {
        setError('Failed to update assessment')
      }
    } catch (err) {
      console.error('Error updating assessment:', err)
      setError('Failed to update assessment')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-8 h-8 animate-spin" />
        <span className="ml-2">Loading management assessment...</span>
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

  if (!managementData) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-gray-600">No management assessment data available</p>
            <Button 
              onClick={() => window.location.reload()} 
              className="mt-4"
              variant="outline"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Transform database data for display compatibility
  const displayData = {
    id: managementData.id,
    projectId,
    assessmentDate: new Date(managementData.assessment_date),
    assessorId: managementData.assessor_name || 'Unknown',
    overallTeamScore: managementData.overall_team_score || 0,
    teamMembers: managementData.teamMembers?.map(member => ({
      id: member.id,
      name: member.name,
      role: member.position,
      tenure: member.tenure_years,
      previousExperience: member.previous_experience || [],
      educationBackground: member.education_background ? [{ 
        institution: member.education_background,
        degree: 'N/A',
        field: 'N/A',
        graduationYear: 2020,
        relevanceScore: 85
      }] : [],
      competencyScores: {
        leadership: member.leadership_score || 0,
        strategicThinking: member.strategic_thinking_score || 0,
        operationalExecution: member.execution_score || 0,
        financialAcumen: member.financial_acumen_score || 0,
        industryExpertise: member.industry_expertise_score || 0,
        teamCollaboration: member.team_collaboration_score || 0
      },
      performanceHistory: [{
        year: new Date().getFullYear(),
        kpiAchievement: 85,
        stakeholderFeedback: 85,
        teamSatisfaction: 85,
        majorAchievements: member.key_achievements || [],
        challenges: member.development_areas || []
      }],
      riskFactors: member.flight_risk_factors?.map((factor: any, index: number) => ({
        id: `risk-${index}`,
        description: factor,
        severity: member.retention_risk || 'medium',
        likelihood: 50,
        impact: 50,
        mitigationStrategy: 'Standard retention strategy',
        monitoringRequired: true
      })) || [],
      retentionRisk: member.retention_risk || 'medium',
      successorIdentified: member.succession_readiness > 70
    })) || [],
    teamDynamics: {
      cohesion: managementData.team_dynamics_score || 0,
      communication: managementData.team_dynamics_score || 0,
      conflictResolution: managementData.team_dynamics_score || 0,
      workDistribution: managementData.team_dynamics_score || 0,
      overallEffectiveness: managementData.team_dynamics_score || 0
    },
    keyRisks: managementData.key_concerns?.map((concern: any, index: number) => ({
      id: `risk-${index}`,
      description: concern.title || concern,
      severity: 'medium',
      likelihood: 60,
      impact: 65,
      mitigationStrategy: 'Standard mitigation approach',
      monitoringRequired: true
    })) || [],
    recommendations: managementData.retention_strategies?.map((strategy: any, index: number) => ({
      id: `rec-${index}`,
      description: strategy.title || strategy,
      priority: 'medium',
      estimatedImpact: 70,
      implementationTime: '3-4 months',
      cost: 50000,
      implementationComplexity: 'medium',
      aiGenerated: true,
      confidenceLevel: 0.8
    })) || [],
    confidenceLevel: 0.85,
    successionPlanning: {
      criticalRoles: managementData.teamMembers?.filter((member: any) => member.succession_readiness < 70).map((member: any) => ({
        role: member.position,
        currentHolder: member.name,
        readinessLevel: member.succession_readiness || 0,
        developmentPlan: member.development_areas || [],
        timeToReadiness: 18
      })) || [],
      timeToReplaceCriticalRoles: 12,
      successionReadiness: managementData.succession_readiness_score || 0
    },
    retentionStrategies: managementData.retention_strategies || []
  }

  // Render functions
  const renderTeamOverview = () => (
    <div className="space-y-6">
      {/* Overall Team Score */}
      <Card className="p-4">
        <h4 className="font-medium mb-4">Management Team Assessment Summary</h4>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-3xl font-bold text-blue-600">{displayData.overallTeamScore}</div>
            <div className="text-sm text-blue-700">Overall Team Score</div>
            <div className="text-xs text-blue-600 mt-1">
              {displayData.overallTeamScore > 85 ? '🟢 Excellent' : 
               displayData.overallTeamScore > 70 ? '🟡 Good' : '🔴 Needs Improvement'}
            </div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-3xl font-bold text-green-600">{displayData.teamMembers.length}</div>
            <div className="text-sm text-green-700">Key Team Members</div>
            <div className="text-xs text-green-600 mt-1">
              {displayData.teamMembers.filter(m => m.tenure > 3).length} with 3+ years tenure
            </div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-3xl font-bold text-purple-600">{displayData.successionPlanning.successionReadiness}%</div>
            <div className="text-sm text-purple-700">Succession Coverage</div>
            <div className="text-xs text-purple-600 mt-1">
              {displayData.successionPlanning.criticalRoles.length} key roles identified
            </div>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <div className="text-3xl font-bold text-orange-600">{Math.round(displayData.confidenceLevel * 100)}%</div>
            <div className="text-sm text-orange-700">Assessment Confidence</div>
            <div className="text-xs text-orange-600 mt-1">
              Based on {displayData.teamMembers.length} detailed evaluations
            </div>
          </div>
        </div>
      </Card>

      {/* Team Dynamics */}
      <Card className="p-4">
        <h4 className="font-medium mb-4">Team Dynamics Assessment</h4>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(displayData.teamDynamics).map(([key, value]) => {
            const dynamicNames: Record<string, string> = {
              cohesion: 'Team Cohesion',
              communication: 'Communication',
              decisionMaking: 'Decision Making',
              conflictResolution: 'Conflict Resolution',
              workDistribution: 'Work Distribution',
              overallEffectiveness: 'Overall Effectiveness'
            }

            const getScoreColor = (score: number) => {
              if (score >= 85) return 'text-green-600 bg-green-50'
              if (score >= 70) return 'text-yellow-600 bg-yellow-50'
              return 'text-red-600 bg-red-50'
            }

            return (
              <div key={key} className="p-3 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">{dynamicNames[key]}</span>
                  <div className={`px-2 py-1 rounded text-xs font-medium ${getScoreColor(value)}`}>
                    {value}%
                  </div>
                </div>
                <Progress value={value} className="h-2" />
              </div>
            )
          })}
        </div>
      </Card>

      {/* Key Risks and Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="p-4">
          <h4 className="font-medium mb-3 flex items-center">
            <AlertTriangle className="w-4 h-4 text-red-500 mr-2" />
            Key Management Risks
          </h4>
          <div className="space-y-3">
            {displayData.keyRisks.map((risk, index) => (
              <div key={index} className="p-3 border border-red-200 rounded-lg bg-red-50">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-red-800">{risk.description}</span>
                  <Badge variant="destructive" className="text-xs">
                    {risk.severity}
                  </Badge>
                </div>
                <div className="text-sm text-red-700 mb-2">
                  Impact: {risk.impact}% • Probability: {Math.round(risk.probability * 100)}%
                </div>
                {risk.mitigationStrategy && (
                  <div className="text-xs text-red-600 bg-red-100 p-2 rounded">
                    <strong>Mitigation:</strong> {risk.mitigationStrategy}
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-4">
          <h4 className="font-medium mb-3 flex items-center">
            <Target className="w-4 h-4 text-green-500 mr-2" />
            AI Recommendations
          </h4>
          <div className="space-y-3">
            {displayData.recommendations.map((rec) => (
              <div key={rec.id} className="p-3 border border-green-200 rounded-lg bg-green-50">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-green-800">{rec.description}</span>
                  <div className="flex items-center space-x-1">
                    <Badge variant={rec.priority === 'high' ? 'destructive' : 'secondary'} className="text-xs">
                      {rec.priority}
                    </Badge>
                    {rec.aiGenerated && (
                      <Badge variant="ai" className="text-xs">
                        <Brain className="w-3 h-3 mr-1" />
                        AI
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="text-sm text-green-700 mb-2">
                  Impact: {rec.expectedImpact}% • Timeline: {rec.timeframe}mo • Cost: ${(rec.estimatedCost / 1000).toFixed(0)}K
                </div>
                {rec.confidenceLevel && (
                  <div className="flex items-center text-xs text-green-600">
                    <span>AI Confidence:</span>
                    <Progress value={rec.confidenceLevel * 100} className="w-16 h-1 mx-2" />
                    <span>{Math.round(rec.confidenceLevel * 100)}%</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )

  const renderTeamMembers = () => (
    <div className="space-y-4">
      {displayData.teamMembers.length === 0 ? (
        <Card className="p-6 text-center">
          <div className="flex flex-col items-center space-y-4">
            <div className="p-3 bg-gray-100 rounded-full">
              <Users className="w-8 h-8 text-gray-400" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">No Team Members Added</h3>
              <p className="text-sm text-gray-600 mt-1">Add team members to begin management assessment</p>
            </div>
            <Button size="sm" className="mt-2">
              <Plus className="w-4 h-4 mr-2" />
              Add Team Member
            </Button>
          </div>
        </Card>
      ) : (
        displayData.teamMembers.map((member) => (
        <Card 
          key={member.id} 
          className={`cursor-pointer transition-all ${
            selectedMember === member.id ? 'ring-2 ring-blue-500' : ''
          }`}
          onClick={() => setSelectedMember(selectedMember === member.id ? null : member.id)}
        >
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">{member.name}</CardTitle>
                  <p className="text-gray-600">{member.role} • {member.tenure} years tenure</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant={member.retentionRisk === 'low' ? 'default' : 'destructive'}>
                  {member.retentionRisk} retention risk
                </Badge>
                {member.successorIdentified && (
                  <Badge variant="outline" className="text-xs">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Successor ID'd
                  </Badge>
                )}
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            {/* Competency Overview */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              {Object.entries(member.competencyScores).slice(0, 6).map(([competency, score]) => (
                <div key={competency} className="text-center p-2 bg-gray-50 rounded">
                  <div className="text-xs text-gray-600 capitalize">
                    {competency.replace(/([A-Z])/g, ' $1').trim()}
                  </div>
                  <div className="font-medium">{score}%</div>
                </div>
              ))}
            </div>

            {/* Expanded Details */}
            {selectedMember === member.id && (
              <div className="pt-4 border-t space-y-4">
                {/* Experience */}
                <div>
                  <h5 className="font-medium mb-2 flex items-center">
                    <Briefcase className="w-4 h-4 mr-2" />
                    Professional Experience
                  </h5>
                  <div className="space-y-2">
                    {member.previousExperience.map((exp, index) => (
                      <div key={index} className="p-3 bg-gray-50 rounded">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium">{exp.role} at {exp.company}</span>
                          <Badge variant="outline" className="text-xs">
                            {exp.relevanceScore}% relevant
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-600 mb-2">
                          {exp.duration} years • {exp.sector}
                        </div>
                        <div className="text-xs text-gray-700">
                          <strong>Key achievements:</strong> {exp.achievements.join(', ')}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Education */}
                <div>
                  <h5 className="font-medium mb-2 flex items-center">
                    <GraduationCap className="w-4 h-4 mr-2" />
                    Education
                  </h5>
                  <div className="space-y-2">
                    {member.educationBackground.map((edu, index) => (
                      <div key={index} className="flex items-center justify-between p-2 border rounded">
                        <div>
                          <div className="font-medium">{edu.degree} in {edu.field}</div>
                          <div className="text-sm text-gray-600">{edu.institution} ({edu.graduationYear})</div>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {edu.relevanceScore}% relevant
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Performance History */}
                <div>
                  <h5 className="font-medium mb-2 flex items-center">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Recent Performance
                  </h5>
                  <div className="space-y-2">
                    {member.performanceHistory.map((perf, index) => (
                      <div key={index} className="p-3 border rounded">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">{perf.year}</span>
                          <Badge variant={perf.kpiAchievement > 85 ? 'default' : 'secondary'}>
                            {perf.kpiAchievement}% KPI Achievement
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm mb-2">
                          <span>Revenue Growth: {perf.revenueGrowth}%</span>
                          <span>Team Satisfaction: {perf.teamSatisfaction}%</span>
                        </div>
                        <div className="text-xs text-gray-700">
                          <strong>Achievements:</strong> {perf.majorAchievements.join(', ')}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Risk Factors */}
                {member.riskFactors.length > 0 && (
                  <div>
                    <h5 className="font-medium mb-2 flex items-center">
                      <Shield className="w-4 h-4 mr-2" />
                      Risk Factors
                    </h5>
                    <div className="space-y-2">
                      {member.riskFactors.map((risk, index) => (
                        <div key={index} className="p-2 border-l-4 border-orange-400 bg-orange-50 rounded">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium">{risk.description}</span>
                            <Badge variant="secondary" className="text-xs">
                              {risk.severity}
                            </Badge>
                          </div>
                          <div className="text-sm text-gray-600">
                            Impact: {risk.impact}% • Probability: {Math.round(risk.probability * 100)}%
                          </div>
                          {risk.mitigationStrategy && (
                            <div className="text-xs text-gray-700 mt-1">
                              <strong>Mitigation:</strong> {risk.mitigationStrategy}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      ))
    )}
    </div>
  )

  const renderCompetencyMatrix = () => (
    <div className="space-y-6">
      <Card className="p-4">
        <h4 className="font-medium mb-4">Team Competency Matrix</h4>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Competency</th>
                {displayData.teamMembers.map((member) => (
                  <th key={member.id} className="text-center py-2 min-w-[100px]">
                    {member.name}
                  </th>
                ))}
                <th className="text-center py-2">Team Avg</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(displayData.teamMembers[0]?.competencyScores || {}).map((competency) => {
                const scores = displayData.teamMembers.map(m => m.competencyScores[competency as keyof typeof m.competencyScores])
                const average = scores.reduce((sum, score) => sum + score, 0) / scores.length
                
                return (
                  <tr key={competency} className="border-b">
                    <td className="py-2 font-medium capitalize">
                      {competency.replace(/([A-Z])/g, ' $1').trim()}
                    </td>
                    {scores.map((score, index) => (
                      <td key={index} className="text-center py-2">
                        <div className="flex flex-col items-center">
                          <span className="font-medium">{score}%</span>
                          <Progress value={score} className="w-16 h-1 mt-1" />
                        </div>
                      </td>
                    ))}
                    <td className="text-center py-2">
                      <div className="flex flex-col items-center">
                        <span className="font-bold">{Math.round(average)}%</span>
                        <Progress value={average} className="w-16 h-1 mt-1" />
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Strengths */}
        <Card className="p-4">
          <h4 className="font-medium mb-3 flex items-center">
            <Star className="w-4 h-4 text-yellow-500 mr-2" />
            Team Strengths
          </h4>
          <div className="space-y-2">
            {Object.entries(displayData.teamMembers[0]?.competencyScores || {})
              .map(([competency, _]) => {
                const scores = displayData.teamMembers.map(m => m.competencyScores[competency as keyof typeof m.competencyScores])
                const average = scores.reduce((sum, score) => sum + score, 0) / scores.length
                return { competency, average }
              })
              .sort((a, b) => b.average - a.average)
              .slice(0, 4)
              .map(({ competency, average }) => (
                <div key={competency} className="flex items-center justify-between p-2 bg-green-50 rounded">
                  <span className="capitalize font-medium">
                    {competency.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                  <div className="flex items-center space-x-2">
                    <Progress value={average} className="w-20 h-2" />
                    <span className="text-sm font-medium">{Math.round(average)}%</span>
                  </div>
                </div>
              ))}
          </div>
        </Card>

        {/* Development Areas */}
        <Card className="p-4">
          <h4 className="font-medium mb-3 flex items-center">
            <Target className="w-4 h-4 text-blue-500 mr-2" />
            Development Areas
          </h4>
          <div className="space-y-2">
            {Object.entries(displayData.teamMembers[0]?.competencyScores || {})
              .map(([competency, _]) => {
                const scores = displayData.teamMembers.map(m => m.competencyScores[competency as keyof typeof m.competencyScores])
                const average = scores.reduce((sum, score) => sum + score, 0) / scores.length
                return { competency, average }
              })
              .sort((a, b) => a.average - b.average)
              .slice(0, 4)
              .map(({ competency, average }) => (
                <div key={competency} className="flex items-center justify-between p-2 bg-yellow-50 rounded">
                  <span className="capitalize font-medium">
                    {competency.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                  <div className="flex items-center space-x-2">
                    <Progress value={average} className="w-20 h-2" />
                    <span className="text-sm font-medium">{Math.round(average)}%</span>
                  </div>
                </div>
              ))}
          </div>
        </Card>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Users className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">Management Team Assessment</h2>
            <p className="text-gray-600">Comprehensive leadership evaluation and risk analysis</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="text-sm">
            Score: {displayData.overallTeamScore}/100
          </Badge>
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
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'team', label: 'Team Members', icon: Users },
            { id: 'competencies', label: 'Competency Matrix', icon: Star },
            { id: 'qualification', label: 'Qualification Assessment', icon: Shield },
            { id: 'succession', label: 'Succession Planning', icon: Clock }
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
                    ? 'border-purple-500 text-purple-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'overview' && renderTeamOverview()}
        {activeTab === 'team' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Team Members Detailed Assessment</h3>
              <Button size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Team Member
              </Button>
            </div>
            {renderTeamMembers()}
          </div>
        )}
        {activeTab === 'competencies' && renderCompetencyMatrix()}
        {activeTab === 'qualification' && (
          <div>
            {selectedMember ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Qualification Assessment</h3>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setSelectedMember(null)}
                  >
                    Back to Team Overview
                  </Button>
                </div>
                {(() => {
                  const member = displayData.teamMembers.find(m => m.id === selectedMember);
                  return member ? (
                    <QualificationAssessment
                      projectId={projectId}
                      teamMemberId={member.id}
                      memberName={member.name}
                      memberRole={member.role}
                      mode={mode}
                    />
                  ) : (
                    <div className="text-center text-gray-600">
                      Selected team member not found
                    </div>
                  );
                })()}
              </div>
            ) : (
              <div>
                <h3 className="text-lg font-medium mb-4">Select Team Member for Qualification Assessment</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {displayData.teamMembers.map((member) => (
                    <Card 
                      key={member.id}
                      className="cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => setSelectedMember(member.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-green-100 rounded-lg">
                            <Shield className="w-5 h-5 text-green-600" />
                          </div>
                          <div>
                            <h4 className="font-medium">{member.name}</h4>
                            <p className="text-sm text-gray-600">{member.role}</p>
                          </div>
                        </div>
                        <div className="mt-3 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Qualification Status</span>
                            {(() => {
                              const badgeInfo = getQualificationStatusBadge(member.id);
                              return (
                                <Badge variant={badgeInfo.variant} className={`text-xs ${badgeInfo.color}`}>
                                  {badgeInfo.text}
                                </Badge>
                              );
                            })()}
                          </div>
                          {(() => {
                            const status = qualificationStatuses[member.id];
                            if (status && status.status !== 'pending') {
                              return (
                                <div className="text-xs text-gray-500">
                                  {status.assessmentCount} assessment{status.assessmentCount !== 1 ? 's' : ''}
                                  {status.confidenceLevel && (
                                    <span> • {Math.round(status.confidenceLevel * 100)}% confidence</span>
                                  )}
                                  {status.lastUpdated && (
                                    <span> • Updated {new Date(status.lastUpdated).toLocaleDateString()}</span>
                                  )}
                                </div>
                              );
                            }
                            return null;
                          })()}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                {displayData.teamMembers.length === 0 && (
                  <Card className="p-6 text-center">
                    <div className="flex flex-col items-center space-y-4">
                      <div className="p-3 bg-gray-100 rounded-full">
                        <Users className="w-8 h-8 text-gray-400" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">No Team Members</h3>
                        <p className="text-sm text-gray-600 mt-1">Add team members to enable qualification assessments</p>
                      </div>
                    </div>
                  </Card>
                )}
              </div>
            )}
          </div>
        )}
        {activeTab === 'succession' && (
          <div className="space-y-4">
            <Card className="p-4">
              <h4 className="font-medium mb-4">Succession Planning Status</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{displayData.successionPlanning.successionReadiness}%</div>
                  <div className="text-sm text-blue-700">Coverage</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{displayData.successionPlanning.criticalRoles.length}</div>
                  <div className="text-sm text-green-700">Key Roles</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">{displayData.successionPlanning.timeToReplaceCriticalRoles}mo</div>
                  <div className="text-sm text-orange-700">Replacement Time</div>
                </div>
              </div>
              
              <div className="space-y-3">
                {displayData.successionPlanning.criticalRoles.map((role, index) => (
                  <div key={index} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-medium">{role.role} Succession</h5>
                      <Badge variant={role.readinessLevel > 70 ? 'default' : 'secondary'}>
                        {role.readinessLevel}% ready
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-600 mb-2">
                      Current: {role.currentHolder} • Time to readiness: {role.timeToReadiness} months
                    </div>
                    <div className="text-xs text-gray-700">
                      <strong>Development Plan:</strong> {role.developmentPlan.join(', ')}
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-4">
              <h4 className="font-medium mb-4">Retention Strategies</h4>
              <div className="space-y-3">
                {displayData.retentionStrategies.map((strategy, index) => (
                  <div key={index} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h5 className="font-medium">{strategy.targetRole}</h5>
                        <p className="text-sm text-gray-600">{strategy.description}</p>
                      </div>
                      <div className="text-right">
                        <Badge variant={strategy.implementationStatus === 'active' ? 'default' : 'secondary'}>
                          {strategy.implementationStatus}
                        </Badge>
                        <div className="text-sm text-gray-600 mt-1">
                          {strategy.effectiveness}% effective
                        </div>
                      </div>
                    </div>
                    <div className="text-xs text-gray-700">
                      Annual cost: ${(strategy.cost / 1000).toFixed(0)}K • Strategy: {strategy.strategy}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}