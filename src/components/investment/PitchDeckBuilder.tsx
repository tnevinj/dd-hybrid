'use client'

import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useNavigationStore } from '@/stores/navigation-store'
import { useDueDiligenceContext } from '@/contexts/DueDiligenceContext'
import { DueDiligenceProject, DueDiligenceDocument, AIInsight } from '@/types/due-diligence'
import { 
  Presentation,
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
  Type,
  Palette,
  Layout,
  Move,
  RotateCw,
  Maximize,
  Minimize,
  Grid,
  Layers,
  PlayCircle,
  StopCircle,
  Monitor,
  Smartphone,
  FileText,
  Camera,
  Video,
  MousePointer
} from 'lucide-react'

// Pitch Deck Types - Ported from secondary-edge-nextjs
interface PitchDeck {
  id: string
  projectId?: string
  title: string
  purpose: 'investment_committee' | 'lp_presentation' | 'board_meeting' | 'fundraising' | 'management_presentation'
  status: 'draft' | 'in_progress' | 'review' | 'approved' | 'presented'
  
  // Deck structure
  structure: {
    template: string
    totalSlides: number
    estimatedDuration: number // minutes
    targetAudience: string[]
    presentationDate?: Date
    venue?: string
  }
  
  // Slides
  slides: PitchSlide[]
  
  // Design settings
  design: {
    theme: string
    colorPalette: {
      primary: string
      secondary: string
      accent: string
      background: string
      text: string
    }
    font: {
      primary: string
      secondary: string
    }
    logo?: string
    brandGuidelines?: string
  }
  
  // AI assistance
  aiAssistance: {
    generatedSlides: string[] // slide IDs that were AI-generated
    contentSuggestions: ContentSuggestion[]
    designRecommendations: DesignRecommendation[]
    confidenceLevel: number
    lastAiUpdate: Date
  }
  
  // Presentation analytics
  analytics?: {
    presentations: PresentationSession[]
    engagement: {
      avgTimePerSlide: number
      questionSlides: string[]
      skipRates: { [slideId: string]: number }
    }
    feedback: PresentationFeedback[]
  }
  
  // Collaboration
  team: {
    author: string
    contributors: string[]
    reviewers: string[]
    presenters: string[]
  }
  
  // Version control
  version: string
  createdAt: Date
  lastModified: Date
  dueDate?: Date
  
  // Integration
  sourceData: {
    financialModel?: string
    dueDiligenceProject?: string
    investmentMemo?: string
    portfolioData?: string[]
  }
}

interface PitchSlide {
  id: string
  order: number
  title: string
  type: SlideType
  layout: SlideLayout
  content: SlideContent
  notes?: string
  
  // AI enhancements
  aiGenerated: boolean
  aiSuggestions: string[]
  confidence?: number
  
  // Presentation settings
  transition: 'fade' | 'slide' | 'zoom' | 'none'
  duration?: number // seconds for auto-advance
  interactive: boolean
  
  // Analytics
  analytics?: {
    viewTime: number
    skipCount: number
    questionCount: number
  }
}

type SlideType = 
  | 'title'
  | 'agenda'
  | 'executive_summary'
  | 'investment_thesis'
  | 'market_opportunity'
  | 'competitive_landscape'
  | 'business_model'
  | 'financial_projections'
  | 'team'
  | 'deal_structure'
  | 'risk_analysis'
  | 'valuation'
  | 'next_steps'
  | 'appendix'
  | 'qa'
  | 'custom'

type SlideLayout = 
  | 'title_only'
  | 'title_content'
  | 'title_two_column'
  | 'title_three_column'
  | 'full_image'
  | 'image_text'
  | 'chart_focus'
  | 'comparison'
  | 'timeline'
  | 'process_flow'
  | 'blank'

interface SlideContent {
  text?: {
    title?: string
    subtitle?: string
    bullets?: string[]
    body?: string
  }
  visuals?: {
    charts?: ChartElement[]
    images?: ImageElement[]
    tables?: TableElement[]
    diagrams?: DiagramElement[]
  }
  layout?: {
    columns?: ColumnLayout[]
    sections?: SectionLayout[]
  }
}

interface ChartElement {
  id: string
  type: 'bar' | 'line' | 'pie' | 'area' | 'waterfall' | 'scatter'
  data: any
  title: string
  source?: string
  aiGenerated: boolean
}

interface ImageElement {
  id: string
  src: string
  alt: string
  caption?: string
  position: { x: number; y: number; width: number; height: number }
}

interface TableElement {
  id: string
  headers: string[]
  rows: string[][]
  formatting?: {
    headerStyle?: string
    rowStyle?: string
    alternating?: boolean
  }
}

interface DiagramElement {
  id: string
  type: 'flowchart' | 'orgchart' | 'process' | 'funnel' | 'timeline'
  elements: DiagramNode[]
  connections?: DiagramConnection[]
}

interface DiagramNode {
  id: string
  label: string
  position: { x: number; y: number }
  style?: string
}

interface DiagramConnection {
  from: string
  to: string
  label?: string
  style?: string
}

interface ColumnLayout {
  width: string
  content: SlideContent
}

interface SectionLayout {
  title: string
  content: SlideContent
}

interface ContentSuggestion {
  slideId: string
  type: 'content' | 'design' | 'structure'
  suggestion: string
  rationale: string
  confidence: number
}

interface DesignRecommendation {
  type: 'color' | 'font' | 'layout' | 'imagery'
  recommendation: string
  rationale: string
  impact: 'low' | 'medium' | 'high'
}

interface PresentationSession {
  id: string
  date: Date
  presenter: string
  audience: string[]
  venue: string
  duration: number // minutes
  outcome: 'successful' | 'needs_follow_up' | 'declined'
  notes?: string
}

interface PresentationFeedback {
  sessionId: string
  reviewer: string
  rating: number // 1-5
  comments: string
  suggestions: string[]
  timestamp: Date
}

interface DeckTemplate {
  id: string
  name: string
  description: string
  purpose: PitchDeck['purpose']
  slideTypes: SlideType[]
  estimatedSlides: number
  estimatedDuration: number
  complexity: 'basic' | 'intermediate' | 'advanced'
  industry?: string[]
}

interface PitchDeckBuilderProps {
  projectId?: string
  dealId?: string
}

export function PitchDeckBuilder({ projectId, dealId }: PitchDeckBuilderProps) {
  const { currentMode, trackInteraction, addRecommendation } = useNavigationStore()
  const { projects, documents, findings } = useDueDiligenceContext()
  
  const [selectedDeck, setSelectedDeck] = React.useState<string | null>(null)
  const [selectedSlide, setSelectedSlide] = React.useState<number>(0)
  const [viewMode, setViewMode] = React.useState<'builder' | 'presenter' | 'analytics'>('builder')
  const [editMode, setEditMode] = React.useState<'design' | 'content' | 'layout'>('content')
  const [presentationMode, setPresentationMode] = React.useState(false)
  const [selectedTemplate, setSelectedTemplate] = React.useState<string | null>(null)
  const [generatingSlides, setGeneratingSlides] = React.useState(false)

  // Deck templates from secondary-edge-nextjs
  const [deckTemplates] = React.useState<DeckTemplate[]>([
    {
      id: 'ic-presentation',
      name: 'Investment Committee Presentation',
      description: 'Comprehensive presentation for investment committee approval',
      purpose: 'investment_committee',
      slideTypes: ['title', 'executive_summary', 'investment_thesis', 'market_opportunity', 'business_model', 'financial_projections', 'team', 'deal_structure', 'risk_analysis', 'valuation', 'next_steps'],
      estimatedSlides: 15,
      estimatedDuration: 30,
      complexity: 'advanced',
      industry: ['all']
    },
    {
      id: 'lp-update',
      name: 'LP Update Presentation',
      description: 'Regular limited partner update presentation',
      purpose: 'lp_presentation',
      slideTypes: ['title', 'agenda', 'portfolio_highlights', 'financial_performance', 'new_investments', 'exits', 'market_outlook', 'next_steps'],
      estimatedSlides: 12,
      estimatedDuration: 20,
      complexity: 'intermediate',
      industry: ['all']
    },
    {
      id: 'management-pitch',
      name: 'Management Presentation',
      description: 'Presentation to management team and key stakeholders',
      purpose: 'management_presentation',
      slideTypes: ['title', 'executive_summary', 'business_overview', 'market_opportunity', 'growth_strategy', 'financial_overview', 'partnership_benefits', 'next_steps'],
      estimatedSlides: 10,
      estimatedDuration: 25,
      complexity: 'intermediate',
      industry: ['all']
    },
    {
      id: 'board-meeting',
      name: 'Board Meeting Presentation',
      description: 'Regular board meeting presentation template',
      purpose: 'board_meeting',
      slideTypes: ['title', 'agenda', 'business_update', 'financial_performance', 'operational_metrics', 'strategic_initiatives', 'risk_update', 'next_steps'],
      estimatedSlides: 14,
      estimatedDuration: 45,
      complexity: 'advanced',
      industry: ['all']
    }
  ])

  // Sample pitch decks
  const [pitchDecks] = React.useState<PitchDeck[]>([
    {
      id: 'deck-001',
      projectId: 'proj-001',
      title: 'CloudTech Solutions - Investment Committee Presentation',
      purpose: 'investment_committee',
      status: 'in_progress',
      structure: {
        template: 'ic-presentation',
        totalSlides: 15,
        estimatedDuration: 30,
        targetAudience: ['Investment Committee', 'Partners', 'Senior Associates'],
        presentationDate: new Date('2025-07-28T14:00:00'),
        venue: 'Conference Room A'
      },
      slides: [
        {
          id: 'slide-001',
          order: 1,
          title: 'CloudTech Solutions',
          type: 'title',
          layout: 'title_only',
          content: {
            text: {
              title: 'CloudTech Solutions',
              subtitle: 'Investment Committee Presentation',
              body: 'Series B Growth Equity Investment\n$25M Investment Opportunity\n\nPresented by: David Kim\nDate: July 28, 2025'
            }
          },
          aiGenerated: false,
          aiSuggestions: [],
          transition: 'fade',
          interactive: false
        },
        {
          id: 'slide-002',
          order: 2,
          title: 'Executive Summary',
          type: 'executive_summary',
          layout: 'title_content',
          content: {
            text: {
              title: 'Executive Summary',
              bullets: [
                'CloudTech is a leading cloud cost optimization platform with 300% revenue growth',
                'Proprietary AI technology reduces enterprise cloud costs by 40-60%',
                'Strong management team from AWS and Google Cloud with proven track record',
                'Large addressable market ($45B) with limited direct competition',
                'Seeking $25M Series B to fuel international expansion and product development'
              ]
            },
            visuals: {
              charts: [
                {
                  id: 'revenue-growth',
                  type: 'bar',
                  data: { labels: ['2023', '2024', '2025E'], values: [2, 8, 24] },
                  title: 'Revenue Growth ($M)',
                  aiGenerated: true
                }
              ]
            }
          },
          aiGenerated: true,
          aiSuggestions: ['Consider adding customer logos for credibility'],
          confidence: 0.91,
          transition: 'slide',
          interactive: false
        },
        {
          id: 'slide-003',
          order: 3,
          title: 'Investment Thesis',
          type: 'investment_thesis',
          layout: 'title_two_column',
          content: {
            text: {
              title: 'Investment Thesis'
            },
            layout: {
              columns: [
                {
                  width: '60%',
                  content: {
                    text: {
                      bullets: [
                        'Proven Technology: 40-60% cost reduction validated by enterprise customers',
                        'Market Leadership: First-mover advantage in AI-powered cloud optimization',
                        'Strong Unit Economics: 98% retention, 135% NRR, 8-month payback',
                        'Experienced Team: Leadership from AWS, Google Cloud, and Salesforce',
                        'Large Market: $45B TAM growing at 25% annually'
                      ]
                    }
                  }
                },
                {
                  width: '40%',
                  content: {
                    visuals: {
                      charts: [
                        {
                          id: 'unit-economics',
                          type: 'area',
                          data: { labels: ['Yr 1', 'Yr 2', 'Yr 3'], values: [100, 135, 180] },
                          title: 'Customer Value Expansion',
                          aiGenerated: true
                        }
                      ]
                    }
                  }
                }
              ]
            }
          },
          aiGenerated: true,
          aiSuggestions: ['Add customer testimonial quote'],
          confidence: 0.89,
          transition: 'slide',
          interactive: false
        },
        {
          id: 'slide-004',
          order: 4,
          title: 'Financial Projections',
          type: 'financial_projections',
          layout: 'chart_focus',
          content: {
            text: {
              title: 'Financial Projections',
              subtitle: '5-Year Revenue and Profitability Outlook'
            },
            visuals: {
              charts: [
                {
                  id: 'financial-projections',
                  type: 'line',
                  data: {
                    labels: ['2024A', '2025E', '2026E', '2027E', '2028E', '2029E'],
                    series: [
                      { name: 'Revenue', values: [8, 24, 45, 78, 125, 185] },
                      { name: 'EBITDA', values: [1.2, 6, 14, 28, 47, 74] }
                    ]
                  },
                  title: 'Revenue & EBITDA Projection ($M)',
                  source: 'Management projections, Partner analysis',
                  aiGenerated: true
                }
              ],
              tables: [
                {
                  id: 'key-metrics',
                  headers: ['Metric', '2025E', '2026E', '2027E', '2028E', '2029E'],
                  rows: [
                    ['Revenue ($M)', '24', '45', '78', '125', '185'],
                    ['Growth Rate', '200%', '88%', '73%', '60%', '48%'],
                    ['EBITDA Margin', '25%', '31%', '36%', '38%', '40%'],
                    ['ARR ($M)', '22', '41', '71', '114', '168']
                  ],
                  formatting: {
                    headerStyle: 'bg-blue-100 font-bold',
                    alternating: true
                  }
                }
              ]
            }
          },
          notes: 'Conservative projections based on current customer growth trends and market expansion',
          aiGenerated: true,
          aiSuggestions: ['Include sensitivity analysis', 'Add key assumption callouts'],
          confidence: 0.87,
          transition: 'slide',
          interactive: true
        }
      ],
      design: {
        theme: 'professional-blue',
        colorPalette: {
          primary: '#1e40af',
          secondary: '#3b82f6',
          accent: '#60a5fa',
          background: '#ffffff',
          text: '#1f2937'
        },
        font: {
          primary: 'Inter',
          secondary: 'Inter'
        },
        logo: '/assets/logos/firm-logo.png',
        brandGuidelines: 'Follow firm brand guidelines for colors and typography'
      },
      aiAssistance: {
        generatedSlides: ['slide-002', 'slide-003', 'slide-004'],
        contentSuggestions: [
          {
            slideId: 'slide-002',
            type: 'content',
            suggestion: 'Add customer logos to build credibility',
            rationale: 'Visual proof points strengthen the value proposition',
            confidence: 0.85
          }
        ],
        designRecommendations: [
          {
            type: 'layout',
            recommendation: 'Use consistent slide layouts throughout presentation',
            rationale: 'Maintains professional appearance and flow',
            impact: 'medium'
          }
        ],
        confidenceLevel: 0.89,
        lastAiUpdate: new Date('2025-07-20T15:30:00')
      },
      team: {
        author: 'David Kim',
        contributors: ['Sarah Johnson'],
        reviewers: ['Partner Jane Smith'],
        presenters: ['David Kim', 'Partner Jane Smith']
      },
      version: '2.1',
      createdAt: new Date('2025-07-16T10:00:00'),
      lastModified: new Date('2025-07-20T15:30:00'),
      dueDate: new Date('2025-07-28T09:00:00'),
      sourceData: {
        financialModel: 'model-001',
        dueDiligenceProject: 'proj-001',
        investmentMemo: 'memo-001'
      }
    },
    {
      id: 'deck-002',
      title: 'Q2 2025 LP Update Presentation',
      purpose: 'lp_presentation',
      status: 'approved',
      structure: {
        template: 'lp-update',
        totalSlides: 12,
        estimatedDuration: 20,
        targetAudience: ['Limited Partners', 'Fund Investors'],
        presentationDate: new Date('2025-08-05T10:00:00'),
        venue: 'Virtual Meeting'
      },
      slides: [], // Simplified for brevity
      design: {
        theme: 'fund-branded',
        colorPalette: {
          primary: '#059669',
          secondary: '#10b981',
          accent: '#34d399',
          background: '#ffffff',
          text: '#1f2937'
        },
        font: {
          primary: 'Source Sans Pro',
          secondary: 'Source Sans Pro'
        }
      },
      aiAssistance: {
        generatedSlides: ['slide-003', 'slide-004', 'slide-005'],
        contentSuggestions: [],
        designRecommendations: [],
        confidenceLevel: 0.82,
        lastAiUpdate: new Date('2025-07-19T11:00:00')
      },
      team: {
        author: 'Sarah Johnson',
        contributors: ['Michael Chen'],
        reviewers: ['Partner Jane Smith'],
        presenters: ['Partner Jane Smith']
      },
      version: '1.5',
      createdAt: new Date('2025-07-12T14:00:00'),
      lastModified: new Date('2025-07-19T11:00:00'),
      sourceData: {
        portfolioData: ['portfolio-001', 'portfolio-002']
      }
    }
  ])

  // AI recommendations
  React.useEffect(() => {
    if (currentMode.mode !== 'traditional') {
      const incompleteDecks = pitchDecks.filter(deck => deck.status !== 'approved')
      
      if (incompleteDecks.length > 0) {
        addRecommendation({
          id: `incomplete-decks-${dealId}`,
          type: 'automation',
          priority: 'high',
          title: `${incompleteDecks.length} Presentations Need Completion`,
          description: 'AI can help complete slide content using due diligence findings and financial models.',
          actions: [{
            id: 'complete-decks',
            label: 'AI Complete Presentations',
            action: 'AI_COMPLETE_PRESENTATIONS',
            primary: true,
            estimatedTimeSaving: incompleteDecks.length * 120
          }],
          confidence: 0.86,
          moduleContext: 'pitch_deck',
          timestamp: new Date()
        })
      }

      // Template recommendation for new decks
      if (pitchDecks.length === 0 || (dealId && !pitchDecks.find(d => d.projectId === dealId))) {
        addRecommendation({
          id: `new-deck-template-${dealId}`,
          type: 'insight',
          priority: 'medium',
          title: 'Create AI-Powered Presentation',
          description: 'AI can auto-generate presentation slides using available investment memos and financial models.',
          actions: [{
            id: 'create-ai-deck',
            label: 'Create AI Presentation',
            action: 'CREATE_AI_PRESENTATION'
          }],
          confidence: 0.84,
          moduleContext: 'pitch_deck',
          timestamp: new Date()
        })
      }

      // Content optimization opportunities
      if (documents && documents.length > 0) {
        const analyzedDocs = documents.filter(doc => 
          doc.status === 'processed' && doc.aiExtracted
        )
        
        if (analyzedDocs.length > 0) {
          addRecommendation({
            id: `optimize-presentation-content-${dealId}`,
            type: 'automation',
            priority: 'medium',
            title: 'Optimize Presentation Content',
            description: `${analyzedDocs.length} analyzed documents can enhance presentation content with key insights.`,
            actions: [{
              id: 'optimize-content',
              label: 'AI Optimize Content',
              action: 'AI_OPTIMIZE_PRESENTATION_CONTENT'
            }],
            confidence: 0.79,
            moduleContext: 'pitch_deck',
            timestamp: new Date()
          })
        }
      }
    }
  }, [currentMode.mode, dealId, addRecommendation, documents])

  const handleGenerateSlides = async (templateId: string) => {
    setGeneratingSlides(true)
    trackInteraction({
      interactionType: 'automation_approved',
      userAction: 'accepted',
      module: 'pitch_deck',
      context: {
        action: 'generate_slides',
        template: templateId,
        deckId: selectedDeck
      }
    })

    // Simulate slide generation
    setTimeout(() => {
      setGeneratingSlides(false)
    }, 5000)
  }

  const handleCreateDeck = () => {
    trackInteraction({
      interactionType: 'feature_used',
      userAction: 'clicked',
      module: 'pitch_deck',
      context: {
        action: 'create_deck',
        template: selectedTemplate
      }
    })
  }

  const getStatusColor = (status: PitchDeck['status']) => {
    switch (status) {
      case 'draft': return 'text-gray-600 bg-gray-50'
      case 'in_progress': return 'text-blue-600 bg-blue-50'
      case 'review': return 'text-orange-600 bg-orange-50'
      case 'approved': return 'text-green-600 bg-green-50'
      case 'presented': return 'text-purple-600 bg-purple-50'
    }
  }

  const renderDeckCard = (deck: PitchDeck) => (
    <Card 
      key={deck.id}
      className={`cursor-pointer transition-all hover:shadow-md ${selectedDeck === deck.id ? 'ring-2 ring-blue-500' : ''} ${deck.aiAssistance.generatedSlides.length > 0 ? 'border-l-4 border-l-purple-400' : ''}`}
      onClick={() => setSelectedDeck(deck.id)}
    >
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">{deck.title}</CardTitle>
            <p className="text-sm text-gray-600">
              {deck.purpose.replace('_', ' ')} • {deck.structure.totalSlides} slides • {deck.structure.estimatedDuration}min
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Badge className={`text-xs ${getStatusColor(deck.status)}`}>
              {deck.status.replace('_', ' ')}
            </Badge>
            {deck.aiAssistance.generatedSlides.length > 0 && (
              <Badge variant="ai" className="text-xs">
                AI: {Math.round(deck.aiAssistance.confidenceLevel * 100)}%
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-3">
          {/* Progress and key info */}
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Slides</span>
              <div className="font-medium">{deck.structure.totalSlides}</div>
            </div>
            <div>
              <span className="text-gray-500">Duration</span>
              <div className="font-medium">{deck.structure.estimatedDuration}min</div>
            </div>
            <div>
              <span className="text-gray-500">Due Date</span>
              <div className="font-medium">{deck.dueDate?.toISOString().split('T')[0] || 'TBD'}</div>
            </div>
          </div>

          {/* AI assistance summary */}
          {deck.aiAssistance.generatedSlides.length > 0 && currentMode.mode !== 'traditional' && (
            <div className="bg-purple-50 rounded p-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-purple-700">AI Generated: {deck.aiAssistance.generatedSlides.length} slides</span>
                <Badge variant="ai" className="text-xs">
                  {Math.round(deck.aiAssistance.confidenceLevel * 100)}% confidence
                </Badge>
              </div>
            </div>
          )}

          {/* Team and version */}
          <div className="flex items-center justify-between text-xs">
            <div className="text-gray-500">
              Presenter: {deck.team.presenters.join(', ')}
            </div>
            <div className="text-gray-500">
              v{deck.version} • {deck.lastModified.toISOString().split('T')[0]}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  const renderSlideEditor = () => {
    const deck = pitchDecks.find(d => d.id === selectedDeck)
    if (!deck || !deck.slides[selectedSlide]) return null

    const slide = deck.slides[selectedSlide]

    return (
      <div className="space-y-6">
        {/* Deck Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">{deck.title}</h2>
            <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
              <span>Slide {selectedSlide + 1} of {deck.slides.length}</span>
              <span>Version {deck.version}</span>
              <span>Due: {deck.dueDate?.toISOString().split('T')[0]}</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setPresentationMode(true)}
            >
              <PlayCircle className="w-4 h-4 mr-2" />
              Present
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

        {/* Edit Mode Toggle */}
        <div className="flex space-x-2">
          {[
            { id: 'content', label: 'Content', icon: Type },
            { id: 'design', label: 'Design', icon: Palette },
            { id: 'layout', label: 'Layout', icon: Layout }
          ].map(({ id, label, icon: Icon }) => (
            <Button
              key={id}
              variant={editMode === id ? 'default' : 'outline'}
              size="sm"
              onClick={() => setEditMode(id as any)}
            >
              <Icon className="w-4 h-4 mr-2" />
              {label}
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-4 gap-6">
          {/* Slide Navigation */}
          <div className="col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Slides ({deck.slides.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {deck.slides.map((slide, index) => (
                    <button
                      key={slide.id}
                      onClick={() => setSelectedSlide(index)}
                      className={`w-full text-left p-2 rounded text-sm transition-colors ${
                        selectedSlide === index 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">Slide {index + 1}</div>
                          <div className="text-xs text-gray-500 truncate">{slide.title}</div>
                        </div>
                        {slide.aiGenerated && (
                          <Brain className="w-3 h-3 text-purple-500" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
                
                {currentMode.mode !== 'traditional' && (
                  <Button 
                    size="sm" 
                    variant="ai" 
                    className="w-full mt-3"
                    onClick={() => handleGenerateSlides(deck.structure.template)}
                    disabled={generatingSlides}
                  >
                    {generatingSlides ? (
                      <Clock className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Sparkles className="w-4 h-4 mr-2" />
                    )}
                    AI Add Slide
                  </Button>
                )}
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
                      <span className="text-purple-700 font-medium">AI Slides: </span>
                      <span>{deck.aiAssistance.generatedSlides.length}</span>
                    </div>
                    
                    <div>
                      <span className="text-purple-700 font-medium">Confidence: </span>
                      <Badge variant="ai" className="text-xs">
                        {Math.round(deck.aiAssistance.confidenceLevel * 100)}%
                      </Badge>
                    </div>

                    {slide.aiSuggestions.length > 0 && (
                      <div>
                        <span className="text-purple-700 font-medium">Suggestions:</span>
                        <ul className="mt-1 space-y-1 text-xs">
                          {slide.aiSuggestions.slice(0, 2).map((suggestion, index) => (
                            <li key={index} className="text-purple-600">• {suggestion}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <Button 
                      size="sm" 
                      variant="ai" 
                      className="w-full"
                      disabled={generatingSlides}
                    >
                      {generatingSlides ? (
                        <Clock className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Sparkles className="w-4 h-4 mr-2" />
                      )}
                      Enhance Slide
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Slide Editor */}
          <div className="col-span-3">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Slide {selectedSlide + 1}: {slide.title}</CardTitle>
                    <p className="text-sm text-gray-600">{slide.type.replace('_', ' ')}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {slide.aiGenerated && (
                      <Badge variant="ai" className="text-xs">
                        AI Generated • {Math.round((slide.confidence || 0) * 100)}%
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Slide Preview */}
                <div className="bg-white border-2 border-gray-200 rounded-lg p-8 mb-6 min-h-96" style={{ aspectRatio: '16/9' }}>
                  {slide.type === 'title' && (
                    <div className="h-full flex flex-col justify-center items-center text-center">
                      <h1 className="text-4xl font-bold mb-4 text-blue-900">{slide.content.text?.title}</h1>
                      <h2 className="text-xl text-gray-600 mb-8">{slide.content.text?.subtitle}</h2>
                      <div className="text-sm text-gray-500 whitespace-pre-line">{slide.content.text?.body}</div>
                    </div>
                  )}
                  
                  {slide.type === 'executive_summary' && (
                    <div className="h-full">
                      <h2 className="text-2xl font-bold mb-6 text-blue-900">{slide.content.text?.title}</h2>
                      <div className="grid grid-cols-2 gap-8 h-5/6">
                        <div>
                          <ul className="space-y-3 text-sm">
                            {slide.content.text?.bullets?.map((bullet, index) => (
                              <li key={index} className="flex items-start">
                                <span className="text-blue-600 mr-2">•</span>
                                <span>{bullet}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="flex items-center justify-center">
                          {slide.content.visuals?.charts?.[0] && (
                            <div className="w-full h-64 bg-blue-50 rounded flex items-center justify-center border">
                              <div className="text-center">
                                <BarChart3 className="w-16 h-16 text-blue-600 mx-auto mb-2" />
                                <div className="text-sm font-medium">{slide.content.visuals.charts[0].title}</div>
                                <div className="text-xs text-gray-500 mt-1">Chart Preview</div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {slide.type === 'financial_projections' && (
                    <div className="h-full">
                      <div className="text-center mb-6">
                        <h2 className="text-2xl font-bold text-blue-900">{slide.content.text?.title}</h2>
                        <p className="text-gray-600">{slide.content.text?.subtitle}</p>
                      </div>
                      
                      <div className="grid grid-cols-1 gap-6">
                        {slide.content.visuals?.charts?.[0] && (
                          <div className="h-48 bg-blue-50 rounded flex items-center justify-center border">
                            <div className="text-center">
                              <LineChart className="w-20 h-20 text-blue-600 mx-auto mb-2" />
                              <div className="font-medium">{slide.content.visuals.charts[0].title}</div>
                              <div className="text-xs text-gray-500 mt-1">Interactive Chart</div>
                            </div>
                          </div>
                        )}
                        
                        {slide.content.visuals?.tables?.[0] && (
                          <div className="text-xs">
                            <table className="w-full border-collapse">
                              <thead>
                                <tr className="bg-blue-100">
                                  {slide.content.visuals.tables[0].headers.map((header, index) => (
                                    <th key={index} className="border border-gray-300 p-1 text-left font-medium">
                                      {header}
                                    </th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody>
                                {slide.content.visuals.tables[0].rows.map((row, rowIndex) => (
                                  <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                                    {row.map((cell, cellIndex) => (
                                      <td key={cellIndex} className="border border-gray-300 p-1">
                                        {cell}
                                      </td>
                                    ))}
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Content Editor based on edit mode */}
                {editMode === 'content' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Slide Title</label>
                      <input 
                        type="text" 
                        defaultValue={slide.title}
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    
                    {slide.content.text?.bullets && (
                      <div>
                        <label className="block text-sm font-medium mb-2">Bullet Points</label>
                        <div className="space-y-2">
                          {slide.content.text.bullets.map((bullet, index) => (
                            <div key={index} className="flex items-center space-x-2">
                              <input 
                                type="text" 
                                defaultValue={bullet}
                                className="flex-1 p-2 border rounded focus:ring-2 focus:ring-blue-500 text-sm"
                              />
                              <Button variant="ghost" size="sm">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          ))}
                          <Button variant="outline" size="sm">
                            <Plus className="w-4 h-4 mr-2" />
                            Add Bullet
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Generation status */}
                {generatingSlides && (
                  <div className="mt-4 p-3 bg-purple-50 rounded border border-purple-200">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-purple-600 animate-spin" />
                      <span className="text-sm text-purple-700">AI is generating slide content and visuals...</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  const renderTemplateSelection = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Choose Presentation Template</h3>
        <p className="text-gray-600">Select a template that matches your presentation purpose and audience.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {deckTemplates.map((template) => (
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
                  <span className="text-gray-500">Slides:</span>
                  <span className="font-medium">{template.estimatedSlides}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Duration:</span>
                  <span className="font-medium">{template.estimatedDuration}min</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Complexity:</span>
                  <Badge variant={template.complexity === 'basic' ? 'secondary' : template.complexity === 'intermediate' ? 'default' : 'destructive'}>
                    {template.complexity}
                  </Badge>
                </div>
                <div className="text-sm">
                  <span className="text-gray-500">Key Slides:</span>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {template.slideTypes.slice(0, 4).map((slideType) => (
                      <Badge key={slideType} variant="outline" className="text-xs">
                        {slideType.replace('_', ' ')}
                      </Badge>
                    ))}
                    {template.slideTypes.length > 4 && (
                      <Badge variant="outline" className="text-xs">
                        +{template.slideTypes.length - 4} more
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
          <Button onClick={handleCreateDeck}>
            <Plus className="w-4 h-4 mr-2" />
            Create Presentation
          </Button>
          {currentMode.mode !== 'traditional' && (
            <Button variant="ai" onClick={handleCreateDeck}>
              <Sparkles className="w-4 h-4 mr-2" />
              AI Create Presentation
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
          <h2 className="text-xl font-bold">Pitch Deck Builder</h2>
          <p className="text-gray-600">Create professional presentations for investment decisions</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Upload className="w-4 h-4 mr-2" />
            Import Slides
          </Button>
          <Button onClick={() => setSelectedDeck(null)}>
            <Plus className="w-4 h-4 mr-2" />
            New Presentation
          </Button>
        </div>
      </div>

      {!selectedDeck ? (
        selectedTemplate ? renderTemplateSelection() : (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Presentations ({pitchDecks.length})</h3>
              <Button variant="outline" onClick={() => setSelectedTemplate('ic-presentation')}>
                <Plus className="w-4 h-4 mr-2" />
                Create from Template
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pitchDecks.map(renderDeckCard)}
            </div>
          </div>
        )
      ) : (
        renderSlideEditor()
      )}
    </div>
  )

  const renderAssistedView = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold flex items-center">
            <Brain className="w-5 h-5 mr-2 text-purple-500" />
            AI Presentation Builder
            <Badge variant="ai" className="ml-3">Smart Creation</Badge>
          </h2>
          <p className="text-gray-600">AI-powered presentation creation with automated content and design</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button 
            variant="ai"
            onClick={() => setSelectedTemplate('ic-presentation')}
          >
            <Sparkles className="w-4 h-4 mr-2" />
            AI Create Presentation
          </Button>
          <Button variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh Content
          </Button>
        </div>
      </div>

      {/* AI Presentation Summary */}
      <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-blue-50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Presentation className="w-6 h-6 text-purple-600" />
              <div>
                <h3 className="font-semibold text-purple-800">AI Presentation Engine</h3>
                <p className="text-sm text-purple-600">
                  Automated slide creation with {Math.round(pitchDecks.reduce((acc, deck) => acc + deck.aiAssistance.confidenceLevel, 0) / pitchDecks.length * 100)}% average quality
                </p>
              </div>
            </div>
            <Badge variant="ai">Active AI</Badge>
          </div>
          
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {pitchDecks.filter(d => d.aiAssistance.generatedSlides.length > 0).length}
              </div>
              <div className="text-sm text-gray-600">AI-Enhanced Decks</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {pitchDecks.reduce((acc, deck) => acc + deck.aiAssistance.generatedSlides.length, 0)}
              </div>
              <div className="text-sm text-gray-600">AI-Generated Slides</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {Math.round(pitchDecks.reduce((acc, deck) => acc + (deck.aiAssistance.generatedSlides.length > 0 ? 4 : 0), 0))}h
              </div>
              <div className="text-sm text-gray-600">Time Saved</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {pitchDecks.filter(d => d.status === 'approved').length}
              </div>
              <div className="text-sm text-gray-600">Approved Decks</div>
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
              <Presentation className="w-4 h-4 text-purple-600" />
            </div>
            <div className="flex-1">
              <div className="bg-purple-50 rounded-lg p-4 mb-4">
                <p className="text-sm mb-2">
                  <strong>Presentation Status:</strong> {pitchDecks.length} active presentations with {pitchDecks.filter(d => d.aiAssistance.generatedSlides.length > 0).length} AI-enhanced.
                </p>
                <p className="text-sm">
                  AI has created {pitchDecks.reduce((acc, deck) => acc + deck.aiAssistance.generatedSlides.length, 0)} slides automatically, saving approximately {Math.round(pitchDecks.reduce((acc, deck) => acc + (deck.aiAssistance.generatedSlides.length > 0 ? 4 : 0), 0))} hours of design time.
                </p>
              </div>

              {/* Recent AI Activities */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                <h4 className="font-medium text-green-800 mb-3 flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Recent AI Slide Creation
                </h4>
                <div className="space-y-2 text-sm text-green-700">
                  <div>• CloudTech IC presentation: 12 slides auto-generated with financial charts</div>
                  <div>• Q2 LP update: Portfolio performance slides created from live data</div>
                  <div>• All presentations optimized for target audience and timing</div>
                  <div>• Design consistency maintained across all decks</div>
                </div>
              </div>

              {/* Upcoming AI Actions */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-800 mb-3 flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  AI Presentation Schedule
                </h4>
                <div className="space-y-2 text-sm text-blue-700">
                  <div>• Daily: Content updates from live data sources</div>
                  <div>• Weekly: Design optimization and template updates</div>
                  <div>• On-demand: New presentation creation from deal data</div>
                  <div>• Real-time: Slide content adaptation based on audience</div>
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