import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  Plus,
  Eye,
  Clock,
  Target
} from 'lucide-react';

// Import standardized components
import { 
  StandardizedKPICard, 
  EfficiencyKPICard, 
  PerformanceKPICard 
} from '@/components/shared/StandardizedKPICard';
import { StandardizedSearchFilter } from '@/components/shared/StandardizedSearchFilter';
import { 
  StandardizedLoading, 
  NoResultsEmpty, 
  NoDataEmpty 
} from '@/components/shared/StandardizedStates';

// Import design system utilities
import { 
  getStatusColor, 
  getPriorityColor, 
  formatCurrency, 
  COMPONENTS, 
  TYPOGRAPHY 
} from '@/lib/design-system';

// Import consistent mock data
import { generateModuleData } from '@/lib/mock-data-generator';

interface DueDiligenceTraditionalStandardizedProps {
  project?: any;
  projects?: any[];
  metrics?: any;
  isLoading?: boolean;
  onSelectProject?: (project: any | undefined) => void;
  onCreateProject?: () => void;
  onViewProject?: (id: string) => void;
}

export const DueDiligenceTraditionalStandardized: React.FC<DueDiligenceTraditionalStandardizedProps> = ({
  project: propProject,
  projects: propProjects,
  metrics: propMetrics,
  isLoading = false,
  onSelectProject = () => {},
  onCreateProject = () => {},
  onViewProject = () => {},
}) => {
  // Use consistent mock data if no props provided
  const moduleData = generateModuleData('due_diligence');
  const projects = propProjects || moduleData.projects;
  const metrics = propMetrics || moduleData.metrics;
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
    { key: 'date', label: 'Start Date' }
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
      <StandardizedLoading
        mode="traditional"
        message="Loading Due Diligence Data..."
        submessage="Preparing project information and workstream details"
      />
    );
  }

  // If no project selected, show project list
  if (!project) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <div className="flex items-center space-x-3">
              <h1 className={TYPOGRAPHY.headings.h1}>Due Diligence Projects</h1>
              <Badge className="bg-gray-100 text-gray-800 border border-gray-300 flex items-center space-x-1">
                <User className="h-3 w-3" />
                <span>Traditional Mode</span>
              </Badge>
            </div>
            <p className={`${TYPOGRAPHY.body.base} text-gray-600 mt-1`}>
              Complete manual control over due diligence processes and workflows
            </p>
          </div>
          <div className="flex space-x-2">
            <Button onClick={onCreateProject} className="flex items-center space-x-2 bg-gray-700 hover:bg-gray-800">
              <Plus className="h-4 w-4" />
              <span>New Project</span>
            </Button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StandardizedKPICard
            title="Total Projects"
            value={metrics.totalProjects || 0}
            mode="traditional"
            icon={FileText}
            subtitle={`${metrics.activeProjects || 0} active`}
            trend="up"
            trendLabel="this quarter"
          />
          
          <StandardizedKPICard
            title="Completed Projects"
            value={metrics.completedProjects || 0}
            mode="traditional"
            icon={CheckSquare}
            status="positive"
            subtitle="Successfully closed"
          />
          
          <StandardizedKPICard
            title="Risk Flags"
            value={metrics.riskFlagsIdentified || 0}
            mode="traditional"
            icon={AlertTriangle}
            status="warning"
            subtitle="Require attention"
          />
          
          <EfficiencyKPICard
            title="Avg Project Time"
            value={100 - ((metrics.averageProjectTime || 60) / 2)}
            mode="traditional"
            timeSaved="vs industry avg"
            className="border-gray-200"
          />
        </div>

        {/* Search and Filter */}
        <StandardizedSearchFilter
          mode="traditional"
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          searchPlaceholder="Search projects, companies, sectors..."
          filters={filters}
          onFiltersChange={setFilters}
          filterConfigs={filterConfigs}
          sortOptions={sortOptions}
          totalResults={projects.length}
          filteredResults={filteredProjects.length}
          className="mb-6"
        />

        {/* Projects Grid */}
        <Card className={COMPONENTS.card.traditional.base}>
          <CardHeader>
            <CardTitle className="text-xl text-gray-900">Due Diligence Projects</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredProjects.length === 0 ? (
              searchTerm || Object.values(filters).some(f => f) ? (
                <NoResultsEmpty
                  mode="traditional"
                  searchTerm={searchTerm}
                  onClearFilters={() => {
                    setSearchTerm('');
                    setFilters({ status: '', priority: '', workstream: '' });
                  }}
                />
              ) : (
                <NoDataEmpty
                  mode="traditional"
                  dataType="due diligence projects"
                  onCreateNew={onCreateProject}
                />
              )
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredProjects.map((p) => (
                  <Card key={p.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => onSelectProject(p)}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-1">{p.name}</h3>
                          <p className="text-sm text-gray-600 mb-2">{p.targetCompany} • {p.sector}</p>
                          <Badge className={`${getStatusColor(p.status)} text-xs`}>
                            {p.status.replace('_', ' ')}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Progress</span>
                          <span className="font-medium">{p.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
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
                      
                      <Button size="sm" className="w-full mt-3" variant="outline" onClick={(e) => {
                        e.stopPropagation();
                        onViewProject(p.id);
                      }}>
                        <Eye className="h-4 w-4 mr-2" />
                        View Project
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

  // Project detail view
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Header with back button */}
      <div className="flex items-center space-x-4 mb-6">
        <Button variant="ghost" onClick={() => onSelectProject(undefined)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Projects
        </Button>
        
        <div className="flex-1">
          <div className="flex items-center space-x-3">
            <h1 className={TYPOGRAPHY.headings.h1}>{project.name}</h1>
            <Badge className="bg-gray-100 text-gray-800 border border-gray-300 flex items-center space-x-1">
              <User className="h-3 w-3" />
              <span>Traditional Mode</span>
            </Badge>
            <Badge className={getStatusColor(project.status)}>
              {project.status.replace('_', ' ')}
            </Badge>
          </div>
          <p className="text-gray-600 mt-1">{project.targetCompany} • {project.sector} • {formatCurrency(project.dealSize)}</p>
        </div>
        
        <div className="flex space-x-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline">
            <Share className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button>
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      {/* Project KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StandardizedKPICard
          title="Progress"
          value={project.progress}
          valueType="percentage"
          mode="traditional"
          icon={Target}
          status="positive"
          className="border-gray-200"
        />
        
        <StandardizedKPICard
          title="Workstreams"
          value={project.workstreams?.length || 4}
          mode="traditional"
          icon={FileText}
          subtitle="Active streams"
          className="border-gray-200"
        />
        
        <StandardizedKPICard
          title="Risk Flags"
          value={project.riskFlags || 0}
          mode="traditional"
          icon={AlertTriangle}
          status={project.riskFlags > 5 ? "warning" : "positive"}
          className="border-gray-200"
        />
        
        <StandardizedKPICard
          title="Team Members"
          value={project.teamMembers?.length || 5}
          mode="traditional"
          icon={Users}
          subtitle="Assigned to project"
          className="border-gray-200"
        />
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="workstreams">Workstreams</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="findings">Findings</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Workstream Progress */}
              <Card className={COMPONENTS.card.traditional.base}>
                <CardHeader>
                  <CardTitle>Workstream Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {project.workstreams?.map((workstream: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium">{workstream.name}</h4>
                            <span className="text-sm text-gray-600">{workstream.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                            <div 
                              className={`h-2 rounded-full ${
                                workstream.progress > 80 ? 'bg-green-500' : 
                                workstream.progress > 50 ? 'bg-blue-500' : 'bg-yellow-500'
                              }`}
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

              {/* Key Findings */}
              <Card className={COMPONENTS.card.traditional.base}>
                <CardHeader>
                  <CardTitle>Key Findings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {project.keyFindings?.map((finding: string, index: number) => (
                      <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
                        <p className="text-sm">{finding}</p>
                      </div>
                    )) || []}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Project Details */}
              <Card className={COMPONENTS.card.traditional.base}>
                <CardHeader>
                  <CardTitle className="text-lg">Project Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Start Date</span>
                      <span className="font-medium">{project.startDate?.toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Target Close</span>
                      <span className="font-medium">{project.targetCloseDate?.toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Deal Type</span>
                      <span className="font-medium">{project.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Lead Partner</span>
                      <span className="font-medium">{project.leadPartner}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card className={COMPONENTS.card.traditional.base}>
                <CardHeader>
                  <CardTitle className="text-lg">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { action: 'Financial review completed', user: 'Sarah Johnson', time: '2h ago' },
                      { action: 'Risk flag added', user: 'Mike Chen', time: '4h ago' },
                      { action: 'Document uploaded', user: 'Alex Thompson', time: '1d ago' }
                    ].map((activity, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-gray-400 rounded-full mt-2" />
                        <div className="flex-1">
                          <p className="text-sm font-medium">{activity.action}</p>
                          <p className="text-xs text-gray-600">{activity.user} • {activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="workstreams" className="mt-6">
          <Card className={COMPONENTS.card.traditional.base}>
            <CardHeader>
              <CardTitle>Workstream Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Detailed workstream management interface would go here...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents" className="mt-6">
          <Card className={COMPONENTS.card.traditional.base}>
            <CardHeader>
              <CardTitle>Document Repository</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Document management interface would go here...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="findings" className="mt-6">
          <Card className={COMPONENTS.card.traditional.base}>
            <CardHeader>
              <CardTitle>Findings & Issues</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Findings management interface would go here...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="team" className="mt-6">
          <Card className={COMPONENTS.card.traditional.base}>
            <CardHeader>
              <CardTitle>Team Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Team management interface would go here...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Traditional Process Notice */}
      <div className="mt-6 p-4 bg-gray-100 border border-gray-200 rounded-lg">
        <div className="flex items-start space-x-3">
          <User className="h-5 w-5 text-gray-600 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-gray-900 mb-1">Traditional Due Diligence Process</h4>
            <p className="text-sm text-gray-600">
              You have full manual control over due diligence processes. All document reviews, 
              workstream management, and risk assessments are performed manually without AI assistance. 
              Use the standardized tools to organize and track progress according to your preferences.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DueDiligenceTraditionalStandardized;