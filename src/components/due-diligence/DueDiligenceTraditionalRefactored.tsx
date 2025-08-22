/**
 * Enhanced Due Diligence Traditional Component
 * Comprehensive risk assessment and project management platform
 */

'use client'

import * as React from 'react'
import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import type { TraditionalModeProps } from '@/types/shared'
import { formatCurrencySafe, formatDateSafe } from '@/hooks/use-client-date'
import { 
  CheckSquare,
  AlertTriangle,
  FileText,
  Users,
  MessageCircle,
  Calendar,
  Settings,
  Download,
  Share,
  ArrowLeft,
  User,
  Search,
  Plus,
  Eye,
  Edit,
  Clock,
  Target,
  Shield,
  TrendingUp,
  BarChart3,
  Activity,
  Brain,
  Zap,
  Award,
  Building,
  DollarSign,
  MapPin,
  Info
} from 'lucide-react'

// Comprehensive mock data for due diligence projects
const mockDDProjects = [
  {
    id: '1',
    name: 'TechCorp Acquisition',
    targetCompany: 'TechCorp Solutions',
    dealValue: 125000000,
    sector: 'Technology',
    stage: 'Series B',
    location: 'San Francisco, CA',
    status: 'In Progress',
    priority: 'High',
    progress: 78,
    riskLevel: 'Medium',
    startDate: '2024-10-15',
    targetClose: '2025-01-15',
    leadAnalyst: 'Sarah Johnson',
    teamSize: 8,
    totalTasks: 87,
    completedTasks: 68,
    findings: [
      { type: 'Critical', count: 2, description: 'Revenue concentration risk, regulatory compliance gaps' },
      { type: 'High', count: 5, description: 'Management team turnover, customer dependencies' },
      { type: 'Medium', count: 12, description: 'Technology debt, market competition' },
      { type: 'Low', count: 8, description: 'Documentation gaps, process improvements' }
    ],
    riskAssessment: {
      overall: 7.2,
      financial: 8.1,
      operational: 6.8,
      strategic: 7.5,
      legal: 7.0,
      market: 6.9
    },
    keyMetrics: {
      revenue: 45000000,
      ebitda: 12000000,
      employees: 120,
      marketShare: 15
    }
  },
  {
    id: '2',
    name: 'HealthTech Direct Investment',
    targetCompany: 'MedDevice Inc',
    dealValue: 85000000,
    sector: 'Healthcare',
    stage: 'Growth',
    location: 'Boston, MA',
    status: 'In Progress',
    priority: 'High',
    progress: 45,
    riskLevel: 'Low',
    startDate: '2024-11-01',
    targetClose: '2025-02-28',
    leadAnalyst: 'Michael Chen',
    teamSize: 6,
    totalTasks: 65,
    completedTasks: 29,
    findings: [
      { type: 'Critical', count: 0, description: 'None identified' },
      { type: 'High', count: 2, description: 'Regulatory approval timeline, IP protection' },
      { type: 'Medium', count: 8, description: 'Market competition, scaling challenges' },
      { type: 'Low', count: 5, description: 'Team structure, operational processes' }
    ],
    riskAssessment: {
      overall: 8.4,
      financial: 8.7,
      operational: 8.2,
      strategic: 8.6,
      legal: 8.1,
      market: 8.0
    },
    keyMetrics: {
      revenue: 28000000,
      ebitda: 8500000,
      employees: 85,
      marketShare: 8
    }
  },
  {
    id: '3',
    name: 'Infrastructure Co-Investment',
    targetCompany: 'Green Energy Partners',
    dealValue: 200000000,
    sector: 'Infrastructure',
    stage: 'Mature',
    location: 'Austin, TX',
    status: 'Final Review',
    priority: 'Medium',
    progress: 92,
    riskLevel: 'Low',
    startDate: '2024-08-20',
    targetClose: '2024-12-30',
    leadAnalyst: 'Emily Rodriguez',
    teamSize: 10,
    totalTasks: 103,
    completedTasks: 95,
    findings: [
      { type: 'Critical', count: 0, description: 'None identified' },
      { type: 'High', count: 1, description: 'Environmental compliance monitoring' },
      { type: 'Medium', count: 6, description: 'Regulatory changes, market dynamics' },
      { type: 'Low', count: 4, description: 'Process optimization opportunities' }
    ],
    riskAssessment: {
      overall: 8.8,
      financial: 9.1,
      operational: 8.5,
      strategic: 9.0,
      legal: 8.7,
      market: 8.4
    },
    keyMetrics: {
      revenue: 75000000,
      ebitda: 22000000,
      employees: 200,
      marketShare: 22
    }
  }
]

export function DueDiligenceTraditionalRefactored({ 
  metrics, 
  isLoading = false,
  onSwitchMode
}: TraditionalModeProps) {
  const [activeTab, setActiveTab] = useState('overview')
  const [selectedProject, setSelectedProject] = useState<string>(mockDDProjects[0].id)
  const [searchTerm, setSearchTerm] = useState('')

  const currentProject = mockDDProjects.find(p => p.id === selectedProject) || mockDDProjects[0]

  // Enhanced event handlers
  const handleCreateProject = () => {
    // Create a new project and add it to the list
    const newProject = {
      id: (mockDDProjects.length + 1).toString(),
      name: `New DD Project ${mockDDProjects.length + 1}`,
      targetCompany: 'New Target Company',
      dealValue: 50000000,
      sector: 'Technology',
      stage: 'Early Stage',
      location: 'TBD',
      status: 'In Progress',
      priority: 'Medium',
      progress: 0,
      riskLevel: 'Medium',
      startDate: new Date().toISOString().split('T')[0],
      targetClose: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      leadAnalyst: 'Current User',
      teamSize: 1,
      totalTasks: 0,
      completedTasks: 0,
      findings: [],
      riskAssessment: {
        overall: 5.0,
        financial: 5.0,
        operational: 5.0,
        strategic: 5.0,
        legal: 5.0,
        market: 5.0
      },
      keyMetrics: {
        revenue: 0,
        ebitda: 0,
        employees: 0,
        marketShare: 0
      }
    }
    
    mockDDProjects.push(newProject)
    setSelectedProject(newProject.id)
    alert(`Created new due diligence project: "${newProject.name}"\n\nNext steps:\n• Configure project parameters\n• Assign team members\n• Set up document workspace\n• Define risk framework\n• Create task checklist`)
  }

  const handleViewProject = (id: string) => {
    setSelectedProject(id)
    setActiveTab('overview')
    const project = mockDDProjects.find(p => p.id === id)
    if (project) {
      // In a real app, this would navigate to a dedicated project workspace
      alert(`Viewing project details for "${project.name}"\n\nCurrent Status:\n• Progress: ${project.progress}% (${project.completedTasks}/${project.totalTasks} tasks)\n• Risk Level: ${project.riskLevel}\n• Team Size: ${project.teamSize} members\n• Target Close: ${project.targetClose}\n\n✅ Project workspace is now loaded in the interface above`)
    }
  }

  const handleRiskAnalysis = (id: string) => {
    const project = mockDDProjects.find(p => p.id === id)
    if (project) {
      setSelectedProject(id)
      setActiveTab('risk-analysis')
      alert(`Risk Analysis Report for "${project.name}":\n\n📊 Overall Risk Score: ${project.riskAssessment.overall}/10\n💰 Financial Risk: ${project.riskAssessment.financial}/10\n⚙️ Operational Risk: ${project.riskAssessment.operational}/10\n🎯 Strategic Risk: ${project.riskAssessment.strategic}/10\n⚖️ Legal Risk: ${project.riskAssessment.legal}/10\n📈 Market Risk: ${project.riskAssessment.market}/10\n\n${project.riskAssessment.overall > 8 ? '✅ LOW RISK - Recommend proceed' : project.riskAssessment.overall > 6 ? '⚠️ MEDIUM RISK - Monitor closely' : '🚨 HIGH RISK - Detailed mitigation required'}\n\n📋 View detailed risk analysis in the Risk Analysis tab above`)
    }
  }

  const handleGenerateReport = (id: string) => {
    const project = mockDDProjects.find(p => p.id === id)
    if (project) {
      setSelectedProject(id)
      setActiveTab('reports')
      
      // Simulate report generation
      const sections = [
        'Executive Summary',
        'Company Overview',
        'Financial Analysis',
        'Risk Assessment',
        'Market Analysis',
        'Management Evaluation',
        'Legal Review',
        'Recommendations'
      ]
      
      const reportContent = sections.map(section => 
        `${section}: ${project.progress >= 50 ? 'Complete' : project.progress >= 25 ? 'In Progress' : 'Pending'}`
      ).join('\n• ')
      
      alert(`📄 Due Diligence Report Generated for "${project.name}"\n\nReport Sections:\n• ${reportContent}\n\n📈 Overall Completion: ${project.progress}%\n🎯 Recommendation: ${project.riskAssessment.overall > 8 ? 'PROCEED' : project.riskAssessment.overall > 6 ? 'PROCEED WITH CAUTION' : 'DETAILED REVIEW REQUIRED'}\n\n📋 View full report in the Reports tab above`)
    }
  }


  const getRiskColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'low': return 'bg-green-100 text-green-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'high': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'in progress': return 'bg-blue-100 text-blue-800'
      case 'final review': return 'bg-purple-100 text-purple-800'
      case 'completed': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-600 mb-4"></div>
        <h3 className="text-xl font-semibold text-gray-700">Loading Due Diligence Data...</h3>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mode Indicator with DD-specific metrics */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Badge className="bg-gray-100 text-gray-800 border border-gray-300 flex items-center space-x-1">
              <User className="h-3 w-3" />
              <span>Traditional Mode</span>
            </Badge>
            <span className="text-gray-600 text-sm">Advanced due diligence platform</span>
          </div>
          
          {/* Enhanced DD Metrics Display */}
          <div className="flex items-center space-x-6 text-sm text-gray-600">
            <div>
              <span className="font-medium">Active Projects:</span> {mockDDProjects.length}
            </div>
            <div>
              <span className="font-medium">Avg Risk Score:</span> {(mockDDProjects.reduce((sum, p) => sum + p.riskAssessment.overall, 0) / mockDDProjects.length).toFixed(1)}/10
            </div>
            <div>
              <span className="font-medium">Total Deal Value:</span> {formatCurrencySafe(mockDDProjects.reduce((sum, p) => sum + p.dealValue, 0))}
            </div>
            <div>
              <span className="font-medium">Avg Progress:</span> {Math.round(mockDDProjects.reduce((sum, p) => sum + p.progress, 0) / mockDDProjects.length)}%
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Project Overview</TabsTrigger>
            <TabsTrigger value="projects">Active Projects</TabsTrigger>
            <TabsTrigger value="risk-analysis">Risk Analysis</TabsTrigger>
            <TabsTrigger value="reports">Reports & Findings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* KPI Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Building className="h-8 w-8 text-blue-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Active Projects</p>
                      <p className="text-2xl font-bold text-gray-900">{mockDDProjects.length}</p>
                      <p className="text-xs text-blue-600">2 high priority</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Shield className="h-8 w-8 text-green-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Avg Risk Score</p>
                      <p className="text-2xl font-bold text-gray-900">{(mockDDProjects.reduce((sum, p) => sum + p.riskAssessment.overall, 0) / mockDDProjects.length).toFixed(1)}/10</p>
                      <p className="text-xs text-green-600">Low risk portfolio</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <DollarSign className="h-8 w-8 text-purple-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Total Deal Value</p>
                      <p className="text-2xl font-bold text-gray-900">{formatCurrencySafe(mockDDProjects.reduce((sum, p) => sum + p.dealValue, 0))}</p>
                      <p className="text-xs text-purple-600">Across 3 deals</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Target className="h-8 w-8 text-orange-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Avg Progress</p>
                      <p className="text-2xl font-bold text-gray-900">{Math.round(mockDDProjects.reduce((sum, p) => sum + p.progress, 0) / mockDDProjects.length)}%</p>
                      <p className="text-xs text-orange-600">On track</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Current Project Spotlight */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Eye className="h-5 w-5 mr-2 text-blue-600" />
                  Current Project Spotlight: {currentProject.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{currentProject.targetCompany}</h3>
                          <p className="text-gray-600">{currentProject.sector} • {currentProject.stage} • {currentProject.location}</p>
                          <p className="text-sm text-gray-500 mt-1">Lead: {currentProject.leadAnalyst} • Team: {currentProject.teamSize} members</p>
                        </div>
                        <div className="flex space-x-2">
                          <Badge className={getRiskColor(currentProject.riskLevel)}>
                            {currentProject.riskLevel.toUpperCase()} RISK
                          </Badge>
                          <Badge className={getStatusColor(currentProject.status)}>
                            {currentProject.status.toUpperCase()}
                          </Badge>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Deal Value</p>
                          <p className="text-lg font-semibold">{formatCurrencySafe(currentProject.dealValue)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Target Close</p>
                          <p className="text-lg font-semibold">{formatDateSafe(currentProject.targetClose)}</p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span>{currentProject.progress}% ({currentProject.completedTasks}/{currentProject.totalTasks} tasks)</span>
                        </div>
                        <Progress value={currentProject.progress} className="h-2" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Risk Assessment</h4>
                    <div className="space-y-3">
                      {Object.entries(currentProject.riskAssessment).map(([key, value]) => (
                        key !== 'overall' && (
                          <div key={key} className="flex items-center justify-between">
                            <span className="text-sm capitalize text-gray-600">{key}</span>
                            <span className={`text-sm font-medium ${
                              value >= 8 ? 'text-green-600' : value >= 6 ? 'text-yellow-600' : 'text-red-600'
                            }`}>
                              {value}/10
                            </span>
                          </div>
                        )
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="projects" className="space-y-6">
            {/* Project Management Tools */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                  <Input
                    placeholder="Search projects..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
              </div>
              <Button onClick={handleCreateProject}>
                <Plus className="h-4 w-4 mr-2" />
                New DD Project
              </Button>
            </div>

            {/* Projects Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {mockDDProjects.filter(project =>
                project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                project.targetCompany.toLowerCase().includes(searchTerm.toLowerCase())
              ).map((project) => (
                <Card key={project.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-lg">{project.name}</h3>
                        <p className="text-gray-600">{project.targetCompany}</p>
                        <p className="text-sm text-gray-500">{project.sector} • {project.stage} • {project.location}</p>
                      </div>
                      <div className="flex flex-col space-y-1">
                        <Badge className={getRiskColor(project.riskLevel)}>
                          {project.riskLevel} Risk
                        </Badge>
                        <Badge className={getStatusColor(project.status)}>
                          {project.status}
                        </Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-600">Deal Value</p>
                        <p className="font-semibold">{formatCurrencySafe(project.dealValue)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Progress</p>
                        <div className="flex items-center space-x-2">
                          <Progress value={project.progress} className="flex-1 h-2" />
                          <span className="text-sm font-medium">{project.progress}%</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
                      <div>
                        <p className="text-gray-600">Risk Score</p>
                        <p className={`font-medium ${
                          project.riskAssessment.overall >= 8 ? 'text-green-600' : 
                          project.riskAssessment.overall >= 6 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {project.riskAssessment.overall}/10
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">Team</p>
                        <p className="font-medium">{project.teamSize} members</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Tasks</p>
                        <p className="font-medium">{project.completedTasks}/{project.totalTasks}</p>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button 
                        size="sm" 
                        onClick={() => handleViewProject(project.id)}
                        className="flex-1"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View Project
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleRiskAnalysis(project.id)}
                        className="flex-1"
                      >
                        <Shield className="h-4 w-4 mr-1" />
                        Risk Analysis
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="risk-analysis" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="h-5 w-5 mr-2 text-red-600" />
                  Advanced Risk Assessment Dashboard
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {mockDDProjects.map((project) => (
                    <div key={project.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h4 className="font-semibold">{project.name}</h4>
                          <p className="text-sm text-gray-600">{project.targetCompany}</p>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                          project.riskAssessment.overall >= 8 ? 'bg-green-100 text-green-800' :
                          project.riskAssessment.overall >= 6 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {project.riskAssessment.overall}/10
                        </div>
                      </div>

                      <div className="space-y-3">
                        {Object.entries(project.riskAssessment).map(([key, value]) => (
                          key !== 'overall' && (
                            <div key={key}>
                              <div className="flex justify-between text-sm mb-1">
                                <span className="capitalize">{key} Risk</span>
                                <span>{value}/10</span>
                              </div>
                              <Progress value={value * 10} className="h-2" />
                            </div>
                          )
                        ))}
                      </div>

                      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                        <h5 className="font-medium text-sm mb-2">Key Findings</h5>
                        {project.findings.map((finding, index) => (
                          <div key={index} className="flex items-center justify-between text-xs mb-1">
                            <span className={`font-medium ${
                              finding.type === 'Critical' ? 'text-red-600' :
                              finding.type === 'High' ? 'text-orange-600' :
                              finding.type === 'Medium' ? 'text-yellow-600' :
                              'text-green-600'
                            }`}>
                              {finding.type}
                            </span>
                            <span>{finding.count} issues</span>
                          </div>
                        ))}
                      </div>

                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleRiskAnalysis(project.id)}
                        className="w-full mt-3"
                      >
                        <Brain className="h-4 w-4 mr-1" />
                        Detailed Analysis
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Due Diligence Reports</h2>
                <p className="text-gray-600">Generate comprehensive DD reports and analysis</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {mockDDProjects.map((project) => (
                <Card key={project.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-semibold">{project.name}</h3>
                        <p className="text-gray-600">{project.targetCompany}</p>
                        <p className="text-sm text-gray-500">Progress: {project.progress}% complete</p>
                      </div>
                      <Badge className={getStatusColor(project.status)}>
                        {project.status}
                      </Badge>
                    </div>

                    <div className="space-y-3 mb-4">
                      <div className="flex justify-between text-sm">
                        <span>Executive Summary</span>
                        <span className="text-green-600">✓ Ready</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Risk Assessment</span>
                        <span className="text-green-600">✓ Ready</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Financial Analysis</span>
                        <span className={project.progress >= 70 ? 'text-green-600' : 'text-yellow-600'}>
                          {project.progress >= 70 ? '✓ Ready' : '⏳ In Progress'}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Market Analysis</span>
                        <span className={project.progress >= 80 ? 'text-green-600' : 'text-gray-400'}>
                          {project.progress >= 80 ? '✓ Ready' : '⏸ Pending'}
                        </span>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button 
                        size="sm" 
                        onClick={() => handleGenerateReport(project.id)}
                        className="flex-1"
                        disabled={project.progress < 50}
                      >
                        <FileText className="h-4 w-4 mr-1" />
                        Generate Report
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="flex-1"
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Export Data
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}