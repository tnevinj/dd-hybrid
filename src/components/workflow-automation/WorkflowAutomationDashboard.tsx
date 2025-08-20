'use client';

import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  Clock,
  CheckCircle2,
  AlertTriangle,
  Settings,
  Plus,
  FileText,
  Users,
  Zap,
  TrendingUp,
  Activity,
  RotateCw,
  Brain,
  Filter,
  Search,
  Calendar,
  Archive,
} from 'lucide-react';

import {
  DocumentWorkflow,
  ApprovalProcess,
  DocumentWorkflowExecution,
  ApprovalProcessExecution,
  WorkflowAnalytics,
  WorkflowAIInsight,
  AutomationRecommendation,
  WorkflowNavigationMode,
} from '@/types/workflow-automation';

interface WorkflowAutomationDashboardProps {
  navigationMode: 'traditional' | 'assisted' | 'autonomous';
  onModeChange: (mode: 'traditional' | 'assisted' | 'autonomous') => void;
}

export function WorkflowAutomationDashboard({
  navigationMode,
  onModeChange,
}: WorkflowAutomationDashboardProps) {
  const [workflows, setWorkflows] = useState<DocumentWorkflow[]>([]);
  const [approvalProcesses, setApprovalProcesses] = useState<ApprovalProcess[]>([]);
  const [executions, setExecutions] = useState<(DocumentWorkflowExecution | ApprovalProcessExecution)[]>([]);
  const [analytics, setAnalytics] = useState<WorkflowAnalytics | null>(null);
  const [aiInsights, setAIInsights] = useState<WorkflowAIInsight[]>([]);
  const [automationRecommendations, setAutomationRecommendations] = useState<AutomationRecommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    fetchWorkflowData();
  }, []);

  const fetchWorkflowData = async () => {
    try {
      const response = await fetch('/api/workflow-automation');
      const data = await response.json();
      
      setWorkflows(data.workflows || []);
      setApprovalProcesses(data.approvalProcesses || []);
      setExecutions(data.executions || []);
      setAnalytics(data.analytics || null);
      setAIInsights(data.aiInsights || []);
      setAutomationRecommendations(data.automationRecommendations || []);
    } catch (error) {
      console.error('Error fetching workflow data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      IN_PROGRESS: 'bg-blue-100 text-blue-800',
      APPROVED: 'bg-green-100 text-green-800',
      REJECTED: 'bg-red-100 text-red-800',
      COMPLETED: 'bg-green-100 text-green-800',
      CANCELLED: 'bg-gray-100 text-gray-800',
      ESCALATED: 'bg-orange-100 text-orange-800',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      LOW: 'bg-gray-100 text-gray-600',
      NORMAL: 'bg-blue-100 text-blue-600',
      HIGH: 'bg-orange-100 text-orange-600',
      URGENT: 'bg-red-100 text-red-600',
      CRITICAL: 'bg-red-200 text-red-800',
    };
    return colors[priority as keyof typeof colors] || 'bg-gray-100 text-gray-600';
  };

  const renderNavigationControls = () => (
    <div className="flex items-center gap-4 mb-6">
      <div className="flex items-center gap-2">
        <Label htmlFor="nav-mode" className="text-sm font-medium">Navigation Mode:</Label>
        <Select value={navigationMode} onValueChange={onModeChange}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="traditional">Traditional</SelectItem>
            <SelectItem value="assisted">AI Assisted</SelectItem>
            <SelectItem value="autonomous">Autonomous</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {navigationMode === 'assisted' && (
        <Badge variant="secondary" className="flex items-center gap-1">
          <Brain className="w-3 h-3" />
          AI Suggestions Active
        </Badge>
      )}
      
      {navigationMode === 'autonomous' && (
        <Badge variant="outline" className="flex items-center gap-1">
          <Zap className="w-3 h-3" />
          Auto-routing Enabled
        </Badge>
      )}
    </div>
  );

  const renderOverviewTab = () => (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Workflows</p>
                <p className="text-2xl font-bold">{workflows.filter(w => w.isActive).length}</p>
              </div>
              <Settings className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending Approvals</p>
                <p className="text-2xl font-bold">{analytics?.pendingApprovals || 0}</p>
              </div>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Automation Rate</p>
                <p className="text-2xl font-bold">{analytics?.automationEfficiency || 0}%</p>
              </div>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Processing Time</p>
                <p className="text-2xl font-bold">{analytics?.averageProcessingTime || 0}h</p>
              </div>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Executions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Recent Workflow Executions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Workflow</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Started By</TableHead>
                <TableHead>Started</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {executions.slice(0, 5).map((execution) => (
                <TableRow key={execution.id}>
                  <TableCell className="font-medium">
                    {'workflowId' in execution ? 'Document Workflow' : 'Approval Process'}
                  </TableCell>
                  <TableCell>
                    {'documentType' in execution ? execution.documentType : execution.entityType}
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(execution.status)}>
                      {execution.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="text-xs">
                          {'startedBy' in execution ? execution.startedBy.name.charAt(0) : 
                           'requestedBy' in execution ? execution.requestedBy.name.charAt(0) : 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm">
                        {'startedBy' in execution ? execution.startedBy.name : 
                         'requestedBy' in execution ? execution.requestedBy.name : 'Unknown'}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {new Date(execution.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">View</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* AI Insights */}
      {(navigationMode === 'assisted' || navigationMode === 'autonomous') && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5" />
              AI Insights & Recommendations
            </CardTitle>
            <CardDescription>
              Intelligent analysis of your workflow performance and automation opportunities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {aiInsights.slice(0, 3).map((insight) => (
                <div key={insight.id} className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant={insight.impact === 'high' ? 'destructive' : 
                                      insight.impact === 'medium' ? 'default' : 'secondary'}>
                          {insight.type.toUpperCase()}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {insight.confidence}% confidence
                        </span>
                      </div>
                      <h4 className="font-medium">{insight.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1">{insight.description}</p>
                      {insight.suggestedAction && (
                        <p className="text-sm text-blue-600 mt-2">
                          💡 {insight.suggestedAction}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const renderWorkflowsTab = () => (
    <div className="space-y-6">
      {/* Workflow Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search workflows..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 w-64"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Workflows</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Workflow
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Create New Workflow</DialogTitle>
              <DialogDescription>
                Define a new document workflow with approval steps and automation rules.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Name</Label>
                <Input id="name" className="col-span-3" placeholder="Workflow name" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="type" className="text-right">Document Type</Label>
                <Select>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select document type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="INVESTMENT_MEMORANDUM">Investment Memorandum</SelectItem>
                    <SelectItem value="SIDE_LETTER">Side Letter</SelectItem>
                    <SelectItem value="COMPLIANCE_REPORT">Compliance Report</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">Description</Label>
                <Textarea id="description" className="col-span-3" placeholder="Workflow description" />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline">Cancel</Button>
              <Button>Create Workflow</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Workflows Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {workflows.map((workflow) => (
          <Card key={workflow.id} className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{workflow.name}</CardTitle>
                  <CardDescription>{workflow.description}</CardDescription>
                </div>
                <Badge variant={workflow.isActive ? "default" : "secondary"}>
                  {workflow.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Document Type</span>
                  <span>{workflow.documentType.replace(/_/g, ' ')}</span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Trigger Type</span>
                  <span>{workflow.triggerType.replace(/_/g, ' ')}</span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Approval Steps</span>
                  <span>{workflow.approvalSteps.length}</span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Automation Rules</span>
                  <span>{workflow.automationRules.length}</span>
                </div>

                <div className="pt-2 border-t">
                  <div className="flex items-center justify-between">
                    <Button variant="ghost" size="sm">
                      <Settings className="w-4 h-4 mr-1" />
                      Configure
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Archive className="w-4 h-4 mr-1" />
                      History
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderApprovalsTab = () => (
    <div className="space-y-6">
      {/* Approval Controls */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Approval Processes</h3>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Create Approval Process
        </Button>
      </div>

      {/* Approval Processes */}
      <div className="grid gap-4">
        {approvalProcesses.map((process) => (
          <Card key={process.id}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-medium">{process.name}</h4>
                    <Badge className={getStatusColor(process.isActive ? 'ACTIVE' : 'INACTIVE')}>
                      {process.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-3">{process.description}</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Process Type:</span>
                      <div className="font-medium">{process.processType.replace(/_/g, ' ')}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Entity Type:</span>
                      <div className="font-medium">{process.entityType}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Approval Levels:</span>
                      <div className="font-medium">{process.approvalLevels.length}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Executions:</span>
                      <div className="font-medium">{process.processExecutions.length}</div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm">
                    <Settings className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Activity className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Workflow Automation</h1>
          <p className="text-muted-foreground">
            Manage document workflows and approval processes with intelligent automation
          </p>
        </div>
      </div>

      {renderNavigationControls()}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="workflows">Document Workflows</TabsTrigger>
          <TabsTrigger value="approvals">Approval Processes</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="automation">Automation</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {renderOverviewTab()}
        </TabsContent>

        <TabsContent value="workflows" className="space-y-4">
          {renderWorkflowsTab()}
        </TabsContent>

        <TabsContent value="approvals" className="space-y-4">
          {renderApprovalsTab()}
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Workflow Analytics</CardTitle>
              <CardDescription>Performance metrics and trends for your automation processes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center text-muted-foreground py-8">
                Analytics dashboard coming soon...
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="automation" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Automation Recommendations</CardTitle>
              <CardDescription>AI-powered suggestions to optimize your workflows</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {automationRecommendations.map((rec) => (
                  <div key={rec.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge>{rec.automationType.replace(/_/g, ' ')}</Badge>
                          <Badge variant="outline" className={getPriorityColor(rec.complexity.toUpperCase())}>
                            {rec.complexity} complexity
                          </Badge>
                        </div>
                        <p className="font-medium">{rec.description}</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Potential savings: {rec.potentialSavings} hours/week
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        Implement
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}