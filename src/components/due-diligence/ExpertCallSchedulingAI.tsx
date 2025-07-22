'use client'

import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useNavigationStore } from '@/stores/navigation-store'
import { 
  Calendar,
  Clock,
  Users,
  Brain,
  Zap,
  CheckCircle,
  Phone,
  Video,
  MessageSquare,
  Star,
  AlertTriangle,
  Target,
  TrendingUp,
  Building,
  MapPin,
  DollarSign,
  Award,
  Eye,
  Edit,
  Send,
  Lightbulb,
  Sparkles,
  RefreshCw,
  Filter,
  Search,
  ChevronRight,
  ChevronDown,
  Play,
  Calendar as CalendarIcon
} from 'lucide-react'

interface ExpertProfile {
  id: string
  name: string
  title: string
  company: string
  expertise: string[]
  location: string
  timezone: string
  languages: string[]
  
  // Experience metrics
  experience: {
    yearsInIndustry: number
    dealsCompleted: number
    avgDealSize: number
    successRate: number
    industries: string[]
    dealTypes: string[]
  }
  
  // Availability
  availability: {
    preferredTimes: string[]
    blackoutDates: Date[]
    responseTime: string // '2-4 hours', 'same day'
    minNotice: number // hours
  }
  
  // Ratings and feedback
  ratings: {
    overall: number
    communication: number
    expertise: number
    reliability: number
    valueAdd: number
  }
  
  // Recent engagements
  recentDeals: {
    dealName: string
    role: string
    outcome: 'successful' | 'neutral' | 'challenging'
    feedback?: string
  }[]
  
  // AI matching score
  aiMatchScore?: number
  matchingReasons?: string[]
}

interface ExpertCall {
  id: string
  expertId: string
  expertName: string
  title: string
  purpose: string
  status: 'scheduled' | 'completed' | 'cancelled' | 'pending_confirmation'
  scheduledAt: Date
  duration: number // minutes
  format: 'phone' | 'video' | 'in_person'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  
  // DD context
  ddAreas: string[]
  prepMaterials: string[]
  keyQuestions: string[]
  expectedOutcomes: string[]
  
  // AI insights
  aiPrep: {
    suggestedQuestions: string[]
    backgroundResearch: string
    riskAreas: string[]
    benchmarkData?: any
  }
  
  // Results
  outcomes?: {
    keyInsights: string[]
    redFlags: string[]
    followUpActions: string[]
    confidence: number
    recommendation: string
  }
  
  cost: number
  estimatedValue: number
}

interface ExpertCallSchedulingAIProps {
  projectId: string
  currentDeal?: {
    name: string
    sector: string
    dealSize: number
    stage: string
  }
}

export function ExpertCallSchedulingAI({ projectId, currentDeal }: ExpertCallSchedulingAIProps) {
  const { currentMode, trackInteraction, addRecommendation } = useNavigationStore()
  const [selectedExpert, setSelectedExpert] = React.useState<string | null>(null)
  const [schedulingMode, setSchedulingMode] = React.useState<'browse' | 'ai_recommend' | 'schedule'>('ai_recommend')
  const [expandedCalls, setExpandedCalls] = React.useState<Set<string>>(new Set())
  const [filterExpertise, setFilterExpertise] = React.useState<string>('all')

  // Sample expert profiles
  const [experts] = React.useState<ExpertProfile[]>([
    {
      id: 'exp-001',
      name: 'Dr. Sarah Chen',
      title: 'Former SaaS CFO',
      company: 'CloudTech Advisory',
      expertise: ['SaaS Finance', 'Revenue Recognition', 'Unit Economics', 'Pricing Strategy'],
      location: 'San Francisco, CA',
      timezone: 'PT',
      languages: ['English', 'Mandarin'],
      experience: {
        yearsInIndustry: 15,
        dealsCompleted: 47,
        avgDealSize: 85000000,
        successRate: 0.92,
        industries: ['SaaS', 'Enterprise Software', 'B2B Tech'],
        dealTypes: ['growth', 'acquisition', 'buyout']
      },
      availability: {
        preferredTimes: ['9-11am PT', '2-4pm PT'],
        blackoutDates: [new Date('2025-07-25'), new Date('2025-08-01')],
        responseTime: '2-4 hours',
        minNotice: 24
      },
      ratings: {
        overall: 4.9,
        communication: 4.8,
        expertise: 5.0,
        reliability: 4.9,
        valueAdd: 4.8
      },
      recentDeals: [
        {
          dealName: 'TechStart Acquisition',
          role: 'Financial DD Expert',
          outcome: 'successful',
          feedback: 'Identified critical revenue recognition issues early'
        },
        {
          dealName: 'CloudCorp Growth',
          role: 'SaaS Metrics Review',
          outcome: 'successful',
          feedback: 'Excellent unit economics analysis'
        }
      ],
      aiMatchScore: 0.96,
      matchingReasons: [
        'Perfect SaaS expertise match',
        'Strong track record in similar deal sizes',
        'Excellent ratings for financial analysis',
        'Available on short notice'
      ]
    },
    {
      id: 'exp-002',
      name: 'Marcus Thompson',
      title: 'Technology Due Diligence Partner',
      company: 'TechDD Partners',
      expertise: ['Cloud Architecture', 'Security Assessment', 'Technical Debt', 'Scalability'],
      location: 'New York, NY',
      timezone: 'ET',
      languages: ['English'],
      experience: {
        yearsInIndustry: 12,
        dealsCompleted: 34,
        avgDealSize: 125000000,
        successRate: 0.89,
        industries: ['SaaS', 'FinTech', 'Enterprise Software'],
        dealTypes: ['acquisition', 'buyout', 'growth']
      },
      availability: {
        preferredTimes: ['10am-12pm ET', '3-5pm ET'],
        blackoutDates: [new Date('2025-07-30')],
        responseTime: 'same day',
        minNotice: 48
      },
      ratings: {
        overall: 4.7,
        communication: 4.6,
        expertise: 4.9,
        reliability: 4.8,
        valueAdd: 4.7
      },
      recentDeals: [
        {
          dealName: 'DataFlow Systems',
          role: 'CTO Interview & Tech Review',
          outcome: 'successful',
          feedback: 'Uncovered significant scalability concerns'
        }
      ],
      aiMatchScore: 0.87,
      matchingReasons: [
        'Strong technical DD background',
        'Experience with similar tech stacks',
        'Available within required timeframe'
      ]
    },
    {
      id: 'exp-003',
      name: 'Jennifer Rodriguez',
      title: 'Commercial DD Specialist',
      company: 'Market Insights Group',
      expertise: ['Market Analysis', 'Customer Interviews', 'Competitive Intelligence', 'GTM Strategy'],
      location: 'Chicago, IL',
      timezone: 'CT',
      languages: ['English', 'Spanish'],
      experience: {
        yearsInIndustry: 10,
        dealsCompleted: 28,
        avgDealSize: 65000000,
        successRate: 0.93,
        industries: ['SaaS', 'B2B Services', 'Healthcare Tech'],
        dealTypes: ['growth', 'acquisition']
      },
      availability: {
        preferredTimes: ['9am-11am CT', '1-3pm CT'],
        blackoutDates: [],
        responseTime: '1-2 hours',
        minNotice: 12
      },
      ratings: {
        overall: 4.8,
        communication: 5.0,
        expertise: 4.7,
        reliability: 4.9,
        valueAdd: 4.8
      },
      recentDeals: [
        {
          dealName: 'ServicePro Growth',
          role: 'Customer Reference Calls',
          outcome: 'successful',
          feedback: 'Excellent customer insights and market positioning analysis'
        }
      ],
      aiMatchScore: 0.91,
      matchingReasons: [
        'Specialized in commercial DD',
        'High communication ratings',
        'Quick response time',
        'Available immediately'
      ]
    }
  ])

  // Sample scheduled calls
  const [scheduledCalls] = React.useState<ExpertCall[]>([
    {
      id: 'call-001',
      expertId: 'exp-001',
      expertName: 'Dr. Sarah Chen',
      title: 'SaaS Financial Metrics Deep Dive',
      purpose: 'Review unit economics, cohort analysis, and revenue recognition practices',
      status: 'scheduled',
      scheduledAt: new Date('2025-07-24T14:00:00'),
      duration: 60,
      format: 'video',
      priority: 'high',
      ddAreas: ['Financial Analysis', 'SaaS Metrics'],
      prepMaterials: ['Financial statements', 'Customer cohort data', 'Pricing model docs'],
      keyQuestions: [
        'What are the biggest red flags in these unit economics?',
        'How do these metrics compare to industry benchmarks?',
        'What revenue recognition risks should we be concerned about?'
      ],
      expectedOutcomes: ['Risk assessment', 'Benchmark comparison', 'Action items'],
      aiPrep: {
        suggestedQuestions: [
          'Can you validate our LTV:CAC ratio calculations?',
          'What churn patterns concern you most in this data?',
          'How sustainable is this growth rate given the metrics?'
        ],
        backgroundResearch: 'Dr. Chen has reviewed 12 similar SaaS deals in the past 18 months. Her analysis typically focuses on cohort behavior and unit economics sustainability.',
        riskAreas: ['Customer concentration', 'Churn acceleration', 'Unit economics deterioration'],
        benchmarkData: {
          industryCAC: '$1,250',
          industryChurn: '5.2% monthly',
          industryLTV: '$23,400'
        }
      },
      cost: 2500,
      estimatedValue: 15000
    },
    {
      id: 'call-002',
      expertId: 'exp-002',
      expertName: 'Marcus Thompson',
      title: 'Technical Architecture Assessment',
      purpose: 'Evaluate scalability, security posture, and technical debt',
      status: 'completed',
      scheduledAt: new Date('2025-07-22T15:00:00'),
      duration: 90,
      format: 'video',
      priority: 'medium',
      ddAreas: ['Technical Review'],
      prepMaterials: ['Architecture diagrams', 'Security audit', 'Code quality reports'],
      keyQuestions: [
        'What are the biggest technical risks for scaling?',
        'How much technical debt needs addressing?',
        'Are there any security vulnerabilities of concern?'
      ],
      expectedOutcomes: ['Risk mitigation plan', 'Technical roadmap review', 'Investment requirements'],
      aiPrep: {
        suggestedQuestions: [
          'What would it cost to address the technical debt?',
          'How long would a security compliance upgrade take?',
          'What are the scaling bottlenecks in this architecture?'
        ],
        backgroundResearch: 'Marcus specializes in cloud-native architectures and has identified critical issues in 78% of his technical reviews.',
        riskAreas: ['Database scalability', 'API rate limiting', 'Security compliance gaps']
      },
      outcomes: {
        keyInsights: [
          'Architecture is well-designed for current scale',
          'Security posture is above average for stage',
          'Technical debt is manageable (~6 months to address)'
        ],
        redFlags: [
          'Database queries becoming inefficient at scale',
          'Missing disaster recovery procedures'
        ],
        followUpActions: [
          'Schedule follow-up on DR planning',
          'Get detailed database optimization plan',
          'Review security compliance roadmap'
        ],
        confidence: 0.87,
        recommendation: 'Proceed with minor technical conditions'
      },
      cost: 3750,
      estimatedValue: 25000
    },
    {
      id: 'call-003',
      expertId: 'exp-003',
      expertName: 'Jennifer Rodriguez',
      title: 'Customer Reference Interviews',
      purpose: 'Conduct structured interviews with top 10 customers',
      status: 'pending_confirmation',
      scheduledAt: new Date('2025-07-26T10:00:00'),
      duration: 120,
      format: 'phone',
      priority: 'high',
      ddAreas: ['Commercial Analysis', 'Customer Satisfaction'],
      prepMaterials: ['Customer list', 'Interview templates', 'Product roadmap'],
      keyQuestions: [
        'What do customers see as biggest value drivers?',
        'Any concerns about product direction or competition?',
        'How sticky is the product in their workflow?'
      ],
      expectedOutcomes: ['Customer sentiment analysis', 'Churn risk assessment', 'Competitive insights'],
      aiPrep: {
        suggestedQuestions: [
          'How likely are you to increase usage next year?',
          'What would make you consider switching providers?',
          'How does this compare to previous solutions?'
        ],
        backgroundResearch: 'Jennifer has conducted 150+ customer interviews for PE deals. Her approach uncovers hidden churn risks and competitive threats.',
        riskAreas: ['Feature dissatisfaction', 'Competitive pressure', 'Budget constraints']
      },
      cost: 4200,
      estimatedValue: 20000
    }
  ])

  // AI recommendations
  React.useEffect(() => {
    if (currentMode.mode !== 'traditional') {
      // Recommend expert calls based on DD progress
      const recommendedExperts = experts.filter(exp => exp.aiMatchScore && exp.aiMatchScore > 0.85)
      
      if (recommendedExperts.length > 0) {
        addRecommendation({
          id: `expert-calls-${projectId}`,
          type: 'suggestion',
          priority: 'high',
          title: `${recommendedExperts.length} Expert Calls Recommended`,
          description: `AI has identified ${recommendedExperts.length} high-match experts who can accelerate your DD process and provide critical insights.`,
          actions: [{
            id: 'schedule-experts',
            label: 'Schedule Expert Calls',
            action: 'SCHEDULE_EXPERT_CALLS',
            primary: true,
            estimatedTimeSaving: 480 // 8 hours of research time saved
          }, {
            id: 'review-experts',
            label: 'Review Recommendations',
            action: 'REVIEW_EXPERT_MATCHES'
          }],
          confidence: 0.91,
          moduleContext: 'due-diligence',
          timestamp: new Date()
        })
      }

      // Risk mitigation from completed calls
      const completedCalls = scheduledCalls.filter(call => call.status === 'completed' && call.outcomes)
      const criticalFindings = completedCalls.flatMap(call => call.outcomes?.redFlags || [])

      if (criticalFindings.length > 0) {
        addRecommendation({
          id: `expert-findings-${projectId}`,
          type: 'warning',
          priority: 'critical',
          title: `${criticalFindings.length} Critical Issues from Expert Calls`,
          description: 'Expert interviews have identified critical risks that need immediate attention and follow-up.',
          actions: [{
            id: 'address-findings',
            label: 'Address Critical Findings',
            action: 'ADDRESS_EXPERT_FINDINGS',
            primary: true
          }],
          confidence: 0.95,
          moduleContext: 'due-diligence',
          timestamp: new Date()
        })
      }
    }
  }, [currentMode.mode, projectId, addRecommendation])

  const handleScheduleExpert = (expertId: string) => {
    trackInteraction({
      interactionType: 'automation_approved',
      userAction: 'accepted',
      module: 'due-diligence',
      context: {
        action: 'schedule_expert_call',
        expertId,
        matchScore: experts.find(e => e.id === expertId)?.aiMatchScore
      }
    })
    setSchedulingMode('schedule')
    setSelectedExpert(expertId)
  }

  const toggleCallExpansion = (callId: string) => {
    const newExpanded = new Set(expandedCalls)
    if (newExpanded.has(callId)) {
      newExpanded.delete(callId)
    } else {
      newExpanded.add(callId)
    }
    setExpandedCalls(newExpanded)
  }

  const getStatusColor = (status: ExpertCall['status']) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-50 border-green-200'
      case 'scheduled': return 'text-blue-600 bg-blue-50 border-blue-200'
      case 'pending_confirmation': return 'text-orange-600 bg-orange-50 border-orange-200'
      case 'cancelled': return 'text-red-600 bg-red-50 border-red-200'
    }
  }

  const getStatusIcon = (status: ExpertCall['status']) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'scheduled': return <Calendar className="w-4 h-4 text-blue-600" />
      case 'pending_confirmation': return <Clock className="w-4 h-4 text-orange-600" />
      case 'cancelled': return <AlertTriangle className="w-4 h-4 text-red-600" />
    }
  }

  const getPriorityColor = (priority: ExpertCall['priority']) => {
    switch (priority) {
      case 'urgent': return 'text-red-600 bg-red-50'
      case 'high': return 'text-orange-600 bg-orange-50'
      case 'medium': return 'text-yellow-600 bg-yellow-50'
      case 'low': return 'text-green-600 bg-green-50'
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

  const renderExpertCard = (expert: ExpertProfile) => (
    <Card key={expert.id} className={`
      transition-all duration-200 hover:shadow-md
      ${expert.aiMatchScore && expert.aiMatchScore > 0.9 ? 'border-l-4 border-l-green-400' : ''}
      ${selectedExpert === expert.id ? 'ring-2 ring-purple-200 bg-purple-50' : ''}
    `}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-lg">{expert.name}</CardTitle>
              <p className="text-sm text-gray-600">{expert.title}</p>
              <p className="text-sm text-gray-500">{expert.company} • {expert.location}</p>
              <div className="flex items-center space-x-2 mt-2">
                <div className="flex items-center">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-sm font-medium ml-1">{expert.ratings.overall}</span>
                </div>
                <Badge variant="outline" className="text-xs">
                  {expert.experience.dealsCompleted} deals
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {expert.availability.responseTime}
                </Badge>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {expert.aiMatchScore && (
              <Badge className={`text-sm ${
                expert.aiMatchScore > 0.9 ? 'bg-green-100 text-green-800' :
                expert.aiMatchScore > 0.8 ? 'bg-blue-100 text-blue-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {Math.round(expert.aiMatchScore * 100)}% Match
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {/* Expertise */}
          <div>
            <h4 className="font-medium text-sm mb-2">Expertise</h4>
            <div className="flex flex-wrap gap-1">
              {expert.expertise.map((skill) => (
                <Badge key={skill} variant="secondary" className="text-xs">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>

          {/* AI Matching Reasons */}
          {expert.matchingReasons && currentMode.mode !== 'traditional' && (
            <div className="p-3 bg-green-50 rounded">
              <h4 className="font-medium text-sm mb-2 text-green-800 flex items-center">
                <Brain className="w-4 h-4 mr-1" />
                Why This Expert Matches
              </h4>
              <ul className="text-xs text-green-700 space-y-1">
                {expert.matchingReasons.map((reason, index) => (
                  <li key={index}>• {reason}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Experience Metrics */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Experience:</span>
              <div className="font-medium">{expert.experience.yearsInIndustry} years</div>
            </div>
            <div>
              <span className="text-gray-600">Success Rate:</span>
              <div className="font-medium">{Math.round(expert.experience.successRate * 100)}%</div>
            </div>
            <div>
              <span className="text-gray-600">Avg Deal Size:</span>
              <div className="font-medium">{formatCurrency(expert.experience.avgDealSize)}</div>
            </div>
            <div>
              <span className="text-gray-600">Availability:</span>
              <div className="font-medium">{expert.availability.minNotice}h notice</div>
            </div>
          </div>

          {/* Recent Deal */}
          {expert.recentDeals.length > 0 && (
            <div className="p-2 bg-gray-50 rounded">
              <div className="text-xs text-gray-600">Recent: {expert.recentDeals[0].dealName}</div>
              <div className="text-xs text-gray-500">{expert.recentDeals[0].feedback}</div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-2">
            <Button 
              onClick={() => handleScheduleExpert(expert.id)}
              size="sm"
              className="flex-1"
            >
              <Calendar className="w-4 h-4 mr-1" />
              Schedule Call
            </Button>
            <Button variant="outline" size="sm">
              <Eye className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm">
              <MessageSquare className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  const renderCallCard = (call: ExpertCall) => (
    <Card key={call.id} className="hover:shadow-md transition-shadow">
      <CardHeader 
        className="cursor-pointer"
        onClick={() => toggleCallExpansion(call.id)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {getStatusIcon(call.status)}
            <div>
              <CardTitle className="text-lg">{call.title}</CardTitle>
              <p className="text-sm text-gray-600">
                with {call.expertName} • {call.scheduledAt.toISOString().split('T')[0]} • {call.duration}min
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Badge className={`text-xs ${getPriorityColor(call.priority)}`}>
              {call.priority}
            </Badge>
            <Badge className={`text-xs ${getStatusColor(call.status)}`}>
              {call.status.replace('_', ' ')}
            </Badge>
            {expandedCalls.has(call.id) ? 
              <ChevronDown className="w-4 h-4" /> : 
              <ChevronRight className="w-4 h-4" />
            }
          </div>
        </div>
      </CardHeader>

      {expandedCalls.has(call.id) && (
        <CardContent>
          <div className="space-y-4">
            {/* Purpose and Context */}
            <div>
              <h4 className="font-medium mb-2">Purpose</h4>
              <p className="text-sm text-gray-600">{call.purpose}</p>
            </div>

            {/* Key Questions */}
            <div>
              <h4 className="font-medium mb-2">Key Questions</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                {call.keyQuestions.map((question, index) => (
                  <li key={index}>• {question}</li>
                ))}
              </ul>
            </div>

            {/* AI Preparation */}
            {call.aiPrep && currentMode.mode !== 'traditional' && (
              <div className="p-3 bg-purple-50 rounded">
                <h4 className="font-medium mb-2 text-purple-800 flex items-center">
                  <Brain className="w-4 h-4 mr-1" />
                  AI Preparation
                </h4>
                <div className="text-sm text-purple-700 mb-2">{call.aiPrep.backgroundResearch}</div>
                <div className="space-y-2">
                  <div>
                    <span className="font-medium">AI Suggested Questions:</span>
                    <ul className="mt-1 space-y-1">
                      {call.aiPrep.suggestedQuestions.map((q, index) => (
                        <li key={index} className="text-xs">• {q}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Outcomes (if completed) */}
            {call.outcomes && call.status === 'completed' && (
              <div className="space-y-3">
                <div className="p-3 bg-green-50 rounded">
                  <h4 className="font-medium mb-2 text-green-800">Key Insights</h4>
                  <ul className="text-sm text-green-700 space-y-1">
                    {call.outcomes.keyInsights.map((insight, index) => (
                      <li key={index}>• {insight}</li>
                    ))}
                  </ul>
                </div>
                
                {call.outcomes.redFlags.length > 0 && (
                  <div className="p-3 bg-red-50 rounded">
                    <h4 className="font-medium mb-2 text-red-800">Red Flags</h4>
                    <ul className="text-sm text-red-700 space-y-1">
                      {call.outcomes.redFlags.map((flag, index) => (
                        <li key={index}>• {flag}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="p-3 bg-blue-50 rounded">
                  <h4 className="font-medium mb-2 text-blue-800">Follow-up Actions</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    {call.outcomes.followUpActions.map((action, index) => (
                      <li key={index}>• {action}</li>
                    ))}
                  </ul>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-4">
                    <span>Confidence: {Math.round(call.outcomes.confidence * 100)}%</span>
                    <span className="font-medium">{call.outcomes.recommendation}</span>
                  </div>
                  <div className="text-gray-500">
                    ROI: {Math.round((call.estimatedValue / call.cost) * 100)}%
                  </div>
                </div>
              </div>
            )}

            {/* Cost and Value */}
            <div className="flex items-center justify-between text-sm text-gray-600 pt-3 border-t">
              <div className="flex items-center space-x-4">
                <span>Cost: {formatCurrency(call.cost)}</span>
                <span>Est. Value: {formatCurrency(call.estimatedValue)}</span>
                <span>Format: {call.format}</span>
              </div>
              <div className="flex space-x-2">
                <Button variant="ghost" size="sm">
                  <Edit className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <CalendarIcon className="w-4 h-4" />
                </Button>
                {call.status === 'scheduled' && (
                  <Button variant="ghost" size="sm">
                    <Play className="w-4 h-4" />
                  </Button>
                )}
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
          <h2 className="text-xl font-bold">Expert Calls & Interviews</h2>
          <p className="text-gray-600">Schedule and manage expert consultations</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Search className="w-4 h-4 mr-2" />
            Find Experts
          </Button>
          <Button variant="outline" size="sm">
            <Calendar className="w-4 h-4 mr-2" />
            Schedule
          </Button>
        </div>
      </div>

      {/* Scheduled Calls */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Scheduled Calls ({scheduledCalls.length})</h3>
        <div className="space-y-4">
          {scheduledCalls.map(renderCallCard)}
        </div>
      </div>

      {/* Available Experts */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Available Experts ({experts.length})</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {experts.map(renderExpertCard)}
        </div>
      </div>
    </div>
  )

  const renderAssistedView = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold flex items-center">
            <Brain className="w-5 h-5 mr-2 text-purple-500" />
            AI Expert Call Management
            <Badge variant="ai" className="ml-3">Smart Matching</Badge>
          </h2>
          <p className="text-gray-600">AI-powered expert matching and call optimization</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="ai">
            <Sparkles className="w-4 h-4 mr-2" />
            Generate Call Plan
          </Button>
          <Button variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh Matches
          </Button>
        </div>
      </div>

      {/* AI Recommendations */}
      <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-blue-50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Brain className="w-6 h-6 text-purple-600" />
              <div>
                <h3 className="font-semibold text-purple-800">Smart Expert Matching</h3>
                <p className="text-sm text-purple-600">
                  Found {experts.filter(e => e.aiMatchScore && e.aiMatchScore > 0.85).length} high-match experts for your deal
                </p>
              </div>
            </div>
            <Badge variant="ai">94% Accuracy</Badge>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{scheduledCalls.filter(c => c.status === 'completed').length}</div>
              <div className="text-sm text-gray-600">Calls Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{formatCurrency(scheduledCalls.reduce((acc, call) => acc + call.estimatedValue, 0))}</div>
              <div className="text-sm text-gray-600">Est. Value Added</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{Math.round(scheduledCalls.reduce((acc, call) => acc + (call.estimatedValue / call.cost), 0) / Math.max(1, scheduledCalls.length) * 100)}%</div>
              <div className="text-sm text-gray-600">Avg ROI</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Top AI Recommendations */}
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Target className="w-5 h-5 mr-2" />
          AI Recommended Experts
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {experts
            .filter(expert => expert.aiMatchScore && expert.aiMatchScore > 0.85)
            .sort((a, b) => (b.aiMatchScore || 0) - (a.aiMatchScore || 0))
            .map(renderExpertCard)}
        </div>
      </div>

      {/* Scheduled Calls */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Scheduled & Completed Calls</h3>
        <div className="space-y-4">
          {scheduledCalls.map(renderCallCard)}
        </div>
      </div>
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
                  <strong>Expert Call Analysis Complete:</strong> I've identified {experts.filter(e => e.aiMatchScore && e.aiMatchScore > 0.9).length} top-tier experts perfect for your {currentDeal?.sector} deal.
                </p>
                <p className="text-sm">
                  Based on {scheduledCalls.filter(c => c.status === 'completed').length} completed calls, the projected value add is {formatCurrency(scheduledCalls.reduce((acc, call) => acc + call.estimatedValue, 0))}.
                </p>
              </div>

              {/* Recommended Next Calls */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <h4 className="font-medium text-blue-800 mb-3 flex items-center">
                  <Lightbulb className="w-4 h-4 mr-2" />
                  Recommended Next Expert Calls
                </h4>
                <div className="space-y-3">
                  {experts
                    .filter(e => e.aiMatchScore && e.aiMatchScore > 0.9)
                    .slice(0, 2)
                    .map((expert) => (
                    <div key={expert.id} className="bg-white rounded p-3">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-medium">{expert.name} - {expert.title}</h5>
                        <Badge className="bg-green-100 text-green-800 text-xs">
                          {Math.round(expert.aiMatchScore! * 100)}% Match
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{expert.expertise.join(', ')}</p>
                      <p className="text-sm text-blue-600 mb-2">{expert.matchingReasons?.[0]}</p>
                      <div className="flex space-x-2">
                        <Button size="sm">Schedule Now</Button>
                        <Button size="sm" variant="outline">View Profile</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Critical Insights from Calls */}
              {scheduledCalls.some(call => call.outcomes?.redFlags.length) && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h4 className="font-medium text-red-800 mb-3 flex items-center">
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    Critical Findings from Expert Calls
                  </h4>
                  <div className="space-y-2">
                    {scheduledCalls
                      .filter(call => call.outcomes?.redFlags.length)
                      .flatMap(call => call.outcomes!.redFlags)
                      .slice(0, 3)
                      .map((flag, index) => (
                      <div key={index} className="bg-white rounded p-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">• {flag}</span>
                          <Button size="sm" variant="destructive">Address</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
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