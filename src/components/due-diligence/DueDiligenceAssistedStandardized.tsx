import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Brain,
  Zap,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Users,
  FileText,
  Lightbulb,
  Target,
  ArrowRight,
  Star,
  ArrowLeft,
  Sparkles,
  Plus,
  Eye,
  Settings,
  Download,
  Share
} from 'lucide-react';

// Import standardized components
import { 
  StandardizedKPICard, 
  AIScoreKPICard, 
  EfficiencyKPICard, 
  PerformanceKPICard 
} from '@/components/shared/StandardizedKPICard';
import { 
  StandardizedAIPanel, 
  QuickAIInsights, 
  AIProcessingStatus 
} from '@/components/shared/StandardizedAIPanel';
import { StandardizedSearchFilter } from '@/components/shared/StandardizedSearchFilter';
import { 
  StandardizedLoading, 
  AIAnalysisLoading, 
  NoResultsEmpty, 
  NoDataEmpty 
} from '@/components/shared/StandardizedStates';

// Import design system utilities
import { 
  getStatusColor, 
  getPriorityColor, 
  formatCurrency, 
  COMPONENTS, 
  TYPOGRAPHY,
  getAIScoreColor
} from '@/lib/design-system';

// Import consistent mock data
import { generateModuleData } from '@/lib/mock-data-generator';

interface DueDiligenceAssistedStandardizedProps {
  project?: any;
  projects?: any[];
  aiRecommendations?: any[];
  metrics?: any;
  isLoading?: boolean;
  onSelectProject?: (project: any | undefined) => void;
  onCreateProject?: () => void;
  onViewProject?: (id: string) => void;
  onExecuteAIAction?: (actionId: string) => void;
  onDismissRecommendation?: (id: string) => void;
}

export const DueDiligenceAssistedStandardized: React.FC<DueDiligenceAssistedStandardizedProps> = ({
  project: propProject,
  projects: propProjects,
  aiRecommendations: propRecommendations,
  metrics: propMetrics,
  isLoading = false,
  onSelectProject = () => {},
  onCreateProject = () => {},
  onViewProject = () => {},
  onExecuteAIAction = () => {},
  onDismissRecommendation = () => {},
}) => {
  // Use consistent mock data if no props provided
  const moduleData = generateModuleData('due_diligence');
  const projects = propProjects || moduleData.projects;
  const metrics = propMetrics || moduleData.metrics;
  const aiRecommendations = propRecommendations || moduleData.recommendations;
  const project = propProject || (projects.length > 0 ? projects[0] : null);

  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    workstream: ''
  });

  // Filter configurations using design system
  const filterConfigs = [
    {
      key: 'status',
      label: 'Status',
      type: 'select' as const,
      placeholder: 'All Statuses',
      options: [
        { value: 'NOT_STARTED', label: 'Not Started' },
        { value: 'IN_PROGRESS', label: 'In Progress' },
        { value: 'PENDING_REVIEW', label: 'Pending Review' },
        { value: 'COMPLETED', label: 'Completed' },
        { value: 'FLAGGED', label: 'Flagged' }
      ]
    },
    {
      key: 'priority',
      label: 'Priority',
      type: 'select' as const,
      placeholder: 'All Priorities',
      options: [
        { value: 'LOW', label: 'Low' },
        { value: 'MEDIUM', label: 'Medium' },
        { value: 'HIGH', label: 'High' },
        { value: 'CRITICAL', label: 'Critical' }
      ]
    }
  ];

  const sortOptions = [
    { key: 'name', label: 'Name' },
    { key: 'status', label: 'Status' },
    { key: 'progress', label: 'Progress' },
    { key: 'ai_score', label: 'AI Risk Score' },
    { key: 'date', label: 'Start Date' }
  ];

  // AI search suggestions
  const aiSuggestions = [
    'High-risk projects',
    'Technology sector deals',
    'Near completion',
    'Requires attention'
  ];

  // Filter projects based on search and filters
  const filteredProjects = useMemo(() => {
    let result = [...projects];
    
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      result = result.filter(p => 
        p.name?.toLowerCase().includes(lowerSearchTerm) ||
        p.targetCompany?.toLowerCase().includes(lowerSearchTerm) ||
        p.sector?.toLowerCase().includes(lowerSearchTerm)
      );
    }
    
    if (filters.status) {
      result = result.filter(p => p.status === filters.status);
    }
    if (filters.priority) {
      result = result.filter(p => p.priority === filters.priority);
    }
    
    return result;
  }, [projects, searchTerm, filters]);

  if (isLoading) {
    return (
      <AIAnalysisLoading
        analysisType="due diligence data"
        itemsProcessed={78}
        totalItems={120}
      />
    );
  }

  // If no project selected, show AI-enhanced project list
  if (!project) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <div className="flex items-center space-x-3">
              <h1 className={TYPOGRAPHY.headings.h1}>Due Diligence Projects</h1>
              <Badge className="bg-purple-100 text-purple-800 border border-purple-300 flex items-center space-x-1">
                <Brain className="h-3 w-3" />
                <span>AI-Assisted Mode</span>
              </Badge>
            </div>
            <p className={`${TYPOGRAPHY.body.base} text-purple-700 mt-1`}>
              Enhanced with AI-powered risk analysis and workflow automation
            </p>
          </div>
          <div className="flex space-x-2">
            <Button onClick={onCreateProject} className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700">
              <Sparkles className="h-4 w-4" />
              <span>AI-Assisted Project</span>
            </Button>
          </div>
        </div>

        {/* AI Insights Panel */}
        {aiRecommendations && aiRecommendations.length > 0 && (
          <StandardizedAIPanel
            recommendations={aiRecommendations}
            metrics={{
              timeSaved: metrics.timeSaved || 8.7,
              accuracy: metrics.aiAccuracy || 96,
              tasksAutomated: 28,
              efficiency: metrics.efficiency || 45
            }}
            title="AI Due Diligence Insights"
            moduleContext="Due Diligence"
            onExecuteAction={onExecuteAIAction}
            onDismissRecommendation={onDismissRecommendation}
            className="mb-6"
          />
        )}

        {/* AI-Enhanced KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <AIScoreKPICard
            title="AI Risk Analysis"
            score={94}
            confidence={96}
            insight="Risk patterns identified across portfolio"
            className="border-purple-200"
          />
          
          <StandardizedKPICard
            title="Automated Tasks"
            value={156}
            mode="assisted"
            icon={Zap}
            status="positive"
            trend="up"
            trendValue="28 today"
            trendLabel="AI completed"
            isAIEnhanced={true}
          />
          
          <StandardizedKPICard
            title="Time Saved"
            value={8.7}
            valueType="duration"
            mode="assisted"
            icon={Clock}
            status="positive"
            trend="up"
            trendValue="vs manual"
            isAIEnhanced={true}
          />
          
          <EfficiencyKPICard
            title="AI Efficiency"
            value={45}
            mode="assisted"
            timeSaved="8.7h saved today"
            className="border-purple-200"
          />
        </div>

        {/* Smart Process Preparation */}
        <Card className="mb-6 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center text-blue-800">
              <Brain className="h-5 w-5 mr-2" />
              AI Due Diligence Assistant
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <AIProcessingStatus
                status="complete"
                className="border-none shadow-none"
              />
              
              <div className="bg-white rounded-lg p-4 border border-blue-200">
                <div className="flex items-center space-x-2 mb-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  <span className="text-sm font-medium">Risk Alerts</span>
                </div>
                <p className="text-lg font-bold text-gray-900">5 flagged</p>
                <p className="text-xs text-gray-600">AI detected high-risk items</p>
              </div>
              
              <QuickAIInsights
                insights={[
                  "Document analysis: 95% complete",
                  "23 optimization opportunities",
                  "Risk assessment automated"
                ]}
                className="border-blue-200"
              />
            </div>
          </CardContent>
        </Card>

        {/* AI-Enhanced Search and Filter */}
        <StandardizedSearchFilter
          mode="assisted"
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          searchPlaceholder="Search projects with AI assistance..."
          filters={filters}
          onFiltersChange={setFilters}
          filterConfigs={filterConfigs}
          sortOptions={sortOptions}
          aiSuggestions={aiSuggestions}
          smartFilterEnabled={true}
          onSmartFilter={() => console.log('Smart filter activated')}
          totalResults={projects.length}
          filteredResults={filteredProjects.length}
          className="mb-6"
        />

        {/* AI-Enhanced Projects Grid */}
        <Card className={COMPONENTS.card.assisted.base}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl text-purple-900">AI-Enhanced Project Analysis</CardTitle>
                <p className="text-sm text-purple-700 mt-1">Projects analyzed and ranked by AI risk assessment</p>
              </div>
              <Badge className="bg-green-100 text-green-800 border-green-300">
                <CheckCircle className="h-3 w-3 mr-1" />
                AI analysis complete
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {filteredProjects.length === 0 ? (
              searchTerm || Object.values(filters).some(f => f) ? (
                <NoResultsEmpty
                  mode="assisted"
                  searchTerm={searchTerm}
                  onClearFilters={() => {
                    setSearchTerm('');
                    setFilters({ status: '', priority: '', workstream: '' });
                  }}
                />
              ) : (
                <NoDataEmpty
                  mode="assisted"
                  dataType="due diligence projects"
                  onCreateNew={onCreateProject}
                />
              )
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredProjects.map((p) => (
                  <Card key={p.id} className={`hover:shadow-md transition-shadow cursor-pointer ${COMPONENTS.card.assisted.accent}`} onClick={() => onSelectProject(p)}>
                    <CardContent className="p-4">
                      {/* AI Enhancement Indicator */}
                      <div className="absolute top-2 right-2">
                        <Badge className="bg-purple-100 text-purple-800 border border-purple-300 text-xs">
                          <Sparkles className="h-3 w-3 mr-1" />
                          AI Enhanced
                        </Badge>
                      </div>

                      <div className="flex items-start justify-between mb-3 pt-6">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-1">{p.name}</h3>
                          <p className="text-sm text-gray-600 mb-2">{p.targetCompany} • {p.sector}</p>
                          <Badge className={`${getStatusColor(p.status)} text-xs`}>
                            {p.status.replace('_', ' ')}
                          </Badge>
                        </div>
                      </div>

                      {/* AI Risk Score */}
                      {p.aiRiskScore && (
                        <div className="mb-3">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-xs text-purple-600 font-medium">AI Risk Score</span>
                            <span className="text-xs font-semibold text-purple-800">{100 - p.aiRiskScore}%</span>
                          </div>
                          <div className="w-full h-2 bg-gray-200 rounded-full">
                            <div 
                              className={getAIScoreColor(100 - p.aiRiskScore)}
                              style={{ width: `${100 - p.aiRiskScore}%` }}
                            />
                          </div>
                        </div>
                      )}

                      {/* AI Insights Preview */}
                      <div className="mb-3 p-2 bg-purple-50 border border-purple-200 rounded text-xs">
                        <div className="flex items-center space-x-1 mb-1">
                          <Brain className="h-3 w-3 text-purple-600" />
                          <span className="text-purple-800 font-medium">AI Insight</span>
                        </div>
                        <p className="text-purple-700">
                          {p.aiRiskScore > 50 ? 'High attention required' : p.aiRiskScore > 30 ? 'Monitor closely' : 'Low risk profile'}
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Progress</span>
                          <span className="font-medium">{p.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-purple-600 h-2 rounded-full" 
                            style={{ width: `${p.progress}%` }}
                          />
                        </div>
                        
                        <div className="flex justify-between text-sm pt-2">
                          <span className="text-gray-500">Deal Size</span>
                          <span className="font-medium">{formatCurrency(p.dealSize || 0)}</span>
                        </div>
                        
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Lead Partner</span>
                          <span className="font-medium">{p.leadPartner}</span>
                        </div>
                      </div>
                      
                      <Button size="sm" className="w-full mt-3 bg-purple-600 hover:bg-purple-700" onClick={(e) => {
                        e.stopPropagation();
                        onViewProject(p.id);
                      }}>
                        <Sparkles className="h-4 w-4 mr-2" />
                        AI Analysis
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // AI-Enhanced Project Detail View
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Header with back button */}
      <div className="flex items-center space-x-4 mb-6">
        <Button variant="ghost" onClick={() => onSelectProject(undefined)} className="text-purple-600 hover:text-purple-700">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Projects
        </Button>
        
        <div className="flex-1">
          <div className="flex items-center space-x-3">
            <h1 className={TYPOGRAPHY.headings.h1}>{project.name}</h1>
            <Badge className="bg-purple-100 text-purple-800 border border-purple-300 flex items-center space-x-1">
              <Brain className="h-3 w-3" />
              <span>AI-Assisted Mode</span>
            </Badge>
            <Badge className={getStatusColor(project.status)}>
              {project.status.replace('_', ' ')}
            </Badge>
          </div>
          <p className="text-purple-700 mt-1">{project.targetCompany} • {project.sector} • {formatCurrency(project.dealSize)}</p>
        </div>
        
        <div className="flex space-x-2">
          <Button variant="outline" className="border-purple-300 text-purple-700">
            <Download className="h-4 w-4 mr-2" />
            AI Report
          </Button>
          <Button variant="outline" className="border-purple-300 text-purple-700">
            <Share className="h-4 w-4 mr-2" />
            Share Insights
          </Button>
          <Button className="bg-purple-600 hover:bg-purple-700">
            <Sparkles className="h-4 w-4 mr-2" />
            AI Settings
          </Button>
        </div>
      </div>

      {/* AI-Enhanced Project KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <AIScoreKPICard
          title="AI Risk Assessment"
          score={100 - (project.aiRiskScore || 25)}
          confidence={94}
          insight="Low risk profile detected"
          className="border-purple-200"
        />
        
        <StandardizedKPICard
          title="AI Completion"
          value={project.aiCompletionScore || 87}
          valueType="percentage"
          mode="assisted"
          icon={Target}
          status="positive"
          isAIEnhanced={true}
          className="border-purple-200"
        />
        
        <StandardizedKPICard
          title="Risk Flags"
          value={project.riskFlags || 0}
          mode="assisted"
          icon={AlertTriangle}
          status={project.riskFlags > 5 ? "warning" : "positive"}
          aiInsight="AI monitoring 24/7"
          className="border-purple-200"
        />
        
        <StandardizedKPICard
          title="Team Efficiency"
          value={95}
          valueType="percentage"
          mode="assisted"
          icon={Users}
          trend="up"
          trendValue="+15%"
          trendLabel="with AI"
          isAIEnhanced={true}
          className="border-purple-200"
        />
      </div>

      {/* AI Insights for Current Project */}
      <StandardizedAIPanel
        recommendations={aiRecommendations}
        title="AI Project Insights"
        moduleContext={`Project: ${project.name}`}
        onExecuteAction={onExecuteAIAction}
        onDismissRecommendation={onDismissRecommendation}
        className="mb-6"
      />

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="ai-analysis">AI Analysis</TabsTrigger>
          <TabsTrigger value="workstreams">Workstreams</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="findings">Findings</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* AI-Enhanced Workstream Progress */}
              <Card className={COMPONENTS.card.assisted.base}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>AI-Enhanced Workstream Analysis</CardTitle>
                    <Badge className="bg-purple-100 text-purple-800 border-purple-300">
                      <Brain className="h-3 w-3 mr-1" />
                      AI Optimized
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {project.workstreams?.map((workstream: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-4 border border-purple-200 rounded-lg bg-gradient-to-r from-purple-50 to-blue-50">
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-purple-900">{workstream.name}</h4>
                            <div className="flex items-center space-x-2">
                              <span className="text-sm text-purple-700">{workstream.progress}%</span>
                              <Badge className="bg-blue-100 text-blue-800 text-xs">AI Tracked</Badge>
                            </div>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                            <div 
                              className="bg-purple-600 h-2 rounded-full"
                              style={{ width: `${workstream.progress}%` }}
                            />
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Assigned: {workstream.assignee}</span>
                            <Badge className={getStatusColor(workstream.status)} variant="outline">
                              {workstream.status.replace('_', ' ')}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    )) || []}
                  </div>
                </CardContent>
              </Card>

              {/* AI-Generated Key Findings */}
              <Card className={COMPONENTS.card.assisted.base}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>AI-Generated Key Findings</CardTitle>
                    <Badge className="bg-green-100 text-green-800 border-green-300">
                      <Sparkles className="h-3 w-3 mr-1" />
                      AI Verified
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {project.keyFindings?.map((finding: string, index: number) => (
                      <div key={index} className="flex items-start space-x-3 p-3 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200">
                        <Brain className="h-4 w-4 text-purple-600 mt-1 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-sm text-purple-900 font-medium">{finding}</p>
                          <p className="text-xs text-purple-600 mt-1">AI confidence: {90 + index}%</p>
                        </div>
                      </div>
                    )) || []}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* AI-Enhanced Sidebar */}
            <div className="space-y-6">
              {/* AI Project Analysis */}
              <Card className={COMPONENTS.card.assisted.base}>
                <CardHeader>
                  <CardTitle className="text-lg text-purple-900">AI Project Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <AIScoreKPICard
                      title="Overall Risk Score"
                      score={100 - (project.aiRiskScore || 25)}
                      confidence={94}
                      insight="Based on 1,247 data points"
                      className="border-none shadow-none bg-purple-50"
                    />
                    
                    <QuickAIInsights
                      insights={[
                        `${project.progress}% completion predicted`,
                        "Customer concentration risk detected",
                        "Management strength: Above average"
                      ]}
                      className="border-purple-200"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* AI Performance Summary */}
              <Card className={`${COMPONENTS.card.assisted.base} bg-gradient-to-r from-purple-50 to-blue-50`}>
                <CardHeader>
                  <CardTitle className="text-lg text-purple-900">AI Assistant Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-green-600">8.7h</p>
                      <p className="text-sm text-gray-600">Time Saved</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div className="text-center p-2 bg-white/70 rounded border">
                        <p className="text-lg font-bold text-purple-600">96%</p>
                        <p className="text-xs text-gray-600">Analysis Accuracy</p>
                      </div>
                      <div className="text-center p-2 bg-white/70 rounded border">
                        <p className="text-lg font-bold text-blue-600">28</p>
                        <p className="text-xs text-gray-600">Auto-Approvals</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="ai-analysis" className="mt-6">
          <Card className={COMPONENTS.card.assisted.base}>
            <CardHeader>
              <CardTitle className="text-purple-900">Comprehensive AI Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-purple-700">Detailed AI risk analysis and recommendations would go here...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="workstreams" className="mt-6">
          <Card className={COMPONENTS.card.assisted.base}>
            <CardHeader>
              <CardTitle className="text-purple-900">AI-Optimized Workstreams</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-purple-700">AI-enhanced workstream management interface would go here...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents" className="mt-6">
          <Card className={COMPONENTS.card.assisted.base}>
            <CardHeader>
              <CardTitle className="text-purple-900">Smart Document Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-purple-700">AI-powered document analysis interface would go here...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="findings" className="mt-6">
          <Card className={COMPONENTS.card.assisted.base}>
            <CardHeader>
              <CardTitle className="text-purple-900">AI-Generated Findings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-purple-700">AI-generated findings and insights interface would go here...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="team" className="mt-6">
          <Card className={COMPONENTS.card.assisted.base}>
            <CardHeader>
              <CardTitle className="text-purple-900">AI-Enhanced Team Collaboration</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-purple-700">AI-enhanced team management interface would go here...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DueDiligenceAssistedStandardized;