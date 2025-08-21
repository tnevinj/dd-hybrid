'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Calendar, AlertTriangle, CheckCircle, Clock, FileText, Users, Shield, 
         TrendingUp, TrendingDown, Search, Filter, Plus, Eye, Edit, Download, Share2,
         AlertCircle, BookOpen, Gavel, Scale, BarChart3 } from 'lucide-react';

import {
  NavigationMode,
  LegalManagementResponse,
  LegalDocument,
  LegalWorkflow,
  DeadlineSummary,
  ComplianceAlert,
  ActivitySummary,
  WorkflowSummary,
  LegalDashboardStats,
  DocumentFilter,
  Priority,
  DocumentStatus,
  DocumentCategory,
  ConfidentialityLevel,
  ComplianceStatus,
  HybridModeContent
} from '@/types/legal-management';

interface LegalManagementDashboardProps {
  navigationMode: NavigationMode;
  onModeChange: (mode: NavigationMode) => void;
}

export function LegalManagementDashboard({ navigationMode, onModeChange }: LegalManagementDashboardProps) {
  const [data, setData] = useState<LegalManagementResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<DocumentFilter>({});
  const [showFilters, setShowFilters] = useState(false);

  const hybridContent: HybridModeContent = {
    traditional: {
      showFullDetails: true,
      enableManualWorkflows: true,
      showAllDocuments: true,
    },
    assisted: {
      showRecommendations: true,
      autoSuggestTags: true,
      smartDeadlineReminders: true,
      riskAssessmentHints: true,
    },
    autonomous: {
      autoWorkflowAdvancement: true,
      smartDocumentClassification: true,
      predictiveComplianceAlerts: true,
      autoRiskAssessment: true,
      intelligentDocumentRouting: true,
    },
  };

  useEffect(() => {
    fetchLegalData();
  }, [navigationMode]);

  const fetchLegalData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/legal-management');
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error('Error fetching legal management data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority: Priority): string => {
    switch (priority) {
      case 'CRITICAL': return 'destructive';
      case 'HIGH': return 'destructive';
      case 'MEDIUM': return 'default';
      case 'LOW': return 'secondary';
      default: return 'default';
    }
  };

  const getStatusColor = (status: string): string => {
    switch (status.toLowerCase()) {
      case 'approved':
      case 'executed':
      case 'completed':
      case 'compliant': return 'default';
      case 'under_review':
      case 'in_progress':
      case 'pending': return 'secondary';
      case 'expired':
      case 'terminated':
      case 'non_compliant': return 'destructive';
      default: return 'outline';
    }
  };

  const formatDate = (date: Date | string): string => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getDaysUntilDue = (dueDate: Date | string): number => {
    const now = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-6">
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>Failed to load legal management data.</AlertDescription>
        </Alert>
      </div>
    );
  }

  const renderModeSelector = () => (
    <div className="flex items-center gap-2 mb-6">
      <label className="text-sm font-medium">Navigation Mode:</label>
      <Select value={navigationMode} onValueChange={onModeChange}>
        <SelectTrigger className="w-40">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="traditional">Traditional</SelectItem>
          <SelectItem value="assisted">Assisted</SelectItem>
          <SelectItem value="autonomous">Autonomous</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );

  const renderStatsCards = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Documents</p>
              <p className="text-2xl font-bold">{data.stats.totalDocuments}</p>
            </div>
            <FileText className="h-8 w-8 text-blue-600" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Active Workflows</p>
              <p className="text-2xl font-bold">{data.stats.activeWorkflows}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-600" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Upcoming Deadlines</p>
              <p className="text-2xl font-bold">{data.stats.upcomingDeadlines}</p>
            </div>
            <Clock className="h-8 w-8 text-orange-600" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Compliance Issues</p>
              <p className="text-2xl font-bold">{data.stats.complianceIssues}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderComplianceAlerts = () => (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Compliance Alerts
          {navigationMode === 'assisted' && (
            <Badge variant="outline">AI-Enhanced</Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {data.complianceAlerts.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            <CheckCircle className="h-12 w-12 mx-auto mb-2 text-green-600" />
            <p>All compliance requirements are up to date</p>
          </div>
        ) : (
          <div className="space-y-3">
            {data.complianceAlerts.slice(0, 5).map((alert) => (
              <Alert key={alert.id} className={
                alert.severity === 'CRITICAL' ? 'border-red-200 bg-red-50' :
                alert.severity === 'HIGH' ? 'border-orange-200 bg-orange-50' :
                'border-yellow-200 bg-yellow-50'
              }>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle className="flex items-center justify-between">
                  {alert.title}
                  <Badge variant={getPriorityColor(alert.severity)}>
                    {alert.severity}
                  </Badge>
                </AlertTitle>
                <AlertDescription className="mt-2">
                  {alert.description}
                  {alert.dueDate && (
                    <div className="mt-1 text-xs">
                      Due: {formatDate(alert.dueDate)} ({getDaysUntilDue(alert.dueDate)} days)
                    </div>
                  )}
                </AlertDescription>
              </Alert>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );

  const renderActiveWorkflows = () => (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Active Workflows
          {navigationMode === 'autonomous' && (
            <Badge variant="outline">Auto-Advancing</Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.workflowSummaries.slice(0, 5).map((workflow) => (
            <div key={workflow.id} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold">{workflow.name}</h4>
                <Badge variant={getStatusColor(workflow.status)}>
                  {workflow.status.replace('_', ' ')}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                Document: {workflow.documentTitle}
              </p>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm">Progress</span>
                <span className="text-sm font-medium">{workflow.progress}%</span>
              </div>
              <Progress value={workflow.progress} className="mb-2" />
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Type: {workflow.type.replace('_', ' ')}</span>
                {workflow.dueDate && (
                  <span>Due: {formatDate(workflow.dueDate)}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  const renderUpcomingDeadlines = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Upcoming Deadlines
          {navigationMode === 'assisted' && (
            <Badge variant="outline">Smart Reminders</Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {data.upcomingDeadlines.slice(0, 8).map((deadline) => (
            <div key={deadline.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex-1">
                <p className="font-medium">{deadline.title}</p>
                <p className="text-sm text-muted-foreground">
                  {deadline.type.replace('_', ' ')}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">
                  {formatDate(deadline.dueDate)}
                </p>
                <p className={`text-xs ${
                  deadline.daysUntilDue < 0 ? 'text-red-600' :
                  deadline.daysUntilDue < 7 ? 'text-orange-600' :
                  'text-muted-foreground'
                }`}>
                  {deadline.daysUntilDue < 0 ? 'Overdue' :
                   deadline.daysUntilDue === 0 ? 'Due Today' :
                   `${deadline.daysUntilDue} days`}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  const renderDocumentsList = () => (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Legal Documents
            {navigationMode === 'autonomous' && (
              <Badge variant="outline">Auto-Classified</Badge>
            )}
          </CardTitle>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search documents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4" />
            </Button>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              New Document
            </Button>
          </div>
        </div>
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="INVESTMENT">Investment</SelectItem>
                <SelectItem value="OPERATIONAL">Operational</SelectItem>
                <SelectItem value="REGULATORY">Regulatory</SelectItem>
                <SelectItem value="LITIGATION">Litigation</SelectItem>
                <SelectItem value="CORPORATE">Corporate</SelectItem>
                <SelectItem value="TAX">Tax</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="DRAFT">Draft</SelectItem>
                <SelectItem value="UNDER_REVIEW">Under Review</SelectItem>
                <SelectItem value="APPROVED">Approved</SelectItem>
                <SelectItem value="EXECUTED">Executed</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="LOW">Low</SelectItem>
                <SelectItem value="MEDIUM">Medium</SelectItem>
                <SelectItem value="HIGH">High</SelectItem>
                <SelectItem value="CRITICAL">Critical</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Confidentiality" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PUBLIC">Public</SelectItem>
                <SelectItem value="INTERNAL">Internal</SelectItem>
                <SelectItem value="CONFIDENTIAL">Confidential</SelectItem>
                <SelectItem value="RESTRICTED">Restricted</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {data.documents.slice(0, 10).map((document) => (
            <div key={document.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold">{document.title}</h4>
                <div className="flex items-center gap-2">
                  <Badge variant={getStatusColor(document.status)}>
                    {document.status.replace('_', ' ')}
                  </Badge>
                  <Badge variant={getPriorityColor(document.priority)}>
                    {document.priority}
                  </Badge>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground mb-3">
                <div>
                  <span className="font-medium">Type:</span> {document.documentType.replace('_', ' ')}
                </div>
                <div>
                  <span className="font-medium">Category:</span> {document.category}
                </div>
                <div>
                  <span className="font-medium">Updated:</span> {formatDate(document.updatedAt)}
                </div>
              </div>
              {document.description && (
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                  {document.description}
                </p>
              )}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {document.expirationDate && (
                    <div className="text-xs">
                      <span className="font-medium">Expires:</span> {formatDate(document.expirationDate)}
                    </div>
                  )}
                  {document.complianceStatus !== 'COMPLIANT' && (
                    <Badge variant="destructive" className="text-xs">
                      {document.complianceStatus.replace('_', ' ')}
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  const renderRecentActivity = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {data.recentActivity.slice(0, 8).map((activity) => (
            <div key={activity.id} className="flex items-center gap-3 p-3 border rounded-lg">
              <div className="h-2 w-2 bg-blue-600 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm">{activity.description}</p>
                <p className="text-xs text-muted-foreground">
                  by {activity.userName} • {formatDate(activity.timestamp)}
                </p>
              </div>
              {activity.documentTitle && (
                <Badge variant="outline" className="text-xs">
                  {activity.documentTitle}
                </Badge>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  const renderWorkflowManagement = () => (
    <div className="space-y-6">
      {/* Workflow Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Workflows</p>
                <p className="text-2xl font-bold">{data?.stats.activeWorkflows || 0}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Overdue Tasks</p>
                <p className="text-2xl font-bold text-red-600">3</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg. Processing Time</p>
                <p className="text-2xl font-bold">5.2 days</p>
              </div>
              <Clock className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Workflow Management */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Contract Review Pipeline
              </div>
              <Badge variant="secondary">12 Active</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: 'TechCorp Investment Agreement', stage: 'Legal Review', progress: 75, assignee: 'Sarah Johnson', dueDate: '2024-04-15', priority: 'HIGH' },
                { name: 'Fund IV Partnership Agreement', stage: 'Negotiation', progress: 45, assignee: 'Mike Chen', dueDate: '2024-04-20', priority: 'CRITICAL' },
                { name: 'LP Side Letter - Pension Fund', stage: 'Draft Review', progress: 90, assignee: 'Lisa Wong', dueDate: '2024-04-12', priority: 'MEDIUM' },
                { name: 'Management Services Agreement', stage: 'Final Approval', progress: 95, assignee: 'David Kim', dueDate: '2024-04-10', priority: 'LOW' }
              ].map((workflow, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-sm">{workflow.name}</h4>
                    <Badge variant={getPriorityColor(workflow.priority as Priority)}>
                      {workflow.priority}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Stage: {workflow.stage} • Assigned to: {workflow.assignee}
                  </p>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm">Progress</span>
                    <span className="text-sm font-medium">{workflow.progress}%</span>
                  </div>
                  <Progress value={workflow.progress} className="mb-2" />
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Due: {formatDate(workflow.dueDate)}</span>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gavel className="h-5 w-5" />
              Workflow Templates
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { name: 'Investment Agreement Review', usage: 45, avgTime: '7 days', efficiency: 92 },
                { name: 'Side Letter Negotiation', usage: 32, avgTime: '4 days', efficiency: 88 },
                { name: 'Regulatory Filing', usage: 28, avgTime: '3 days', efficiency: 95 },
                { name: 'Contract Amendment', usage: 15, avgTime: '2 days', efficiency: 97 },
                { name: 'Compliance Review', usage: 22, avgTime: '5 days', efficiency: 85 }
              ].map((template, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{template.name}</h4>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>Used {template.usage} times</span>
                      <span>Avg: {template.avgTime}</span>
                      <span className="text-green-600">Efficiency: {template.efficiency}%</span>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Advanced Workflow Analytics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Workflow Performance Analytics
            {navigationMode === 'autonomous' && (
              <Badge variant="outline">AI-Optimized</Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-900">Bottleneck Analysis</h4>
              <p className="text-sm text-blue-700 mt-1">
                Legal review stage averages 3.2 days longer than target. Consider parallel review process.
              </p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-semibold text-green-900">Efficiency Gains</h4>
              <p className="text-sm text-green-700 mt-1">
                Template standardization reduced processing time by 35% this quarter.
              </p>
            </div>
            <div className="p-4 bg-orange-50 rounded-lg">
              <h4 className="font-semibold text-orange-900">Resource Utilization</h4>
              <p className="text-sm text-orange-700 mt-1">
                Sarah Johnson is at 95% capacity. Consider workload redistribution.
              </p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <h4 className="font-semibold text-purple-900">Predictive Insights</h4>
              <p className="text-sm text-purple-700 mt-1">
                Q2 workload expected to increase 25%. Plan resource allocation accordingly.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderComplianceFramework = () => (
    <div className="space-y-6">
      {/* Compliance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Compliance Score</p>
                <p className="text-2xl font-bold text-green-600">94%</p>
              </div>
              <Shield className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Frameworks</p>
                <p className="text-2xl font-bold">8</p>
              </div>
              <BookOpen className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Risk Assessments</p>
                <p className="text-2xl font-bold">23</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Upcoming Audits</p>
                <p className="text-2xl font-bold">2</p>
              </div>
              <Calendar className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Regulatory Frameworks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Regulatory Frameworks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: 'AIFMD (Alternative Investment Fund Managers)', jurisdiction: 'EU', compliance: 98, lastReview: '2024-03-15', nextAudit: '2024-09-15', status: 'COMPLIANT' },
                { name: 'SEC Investment Advisers Act', jurisdiction: 'US', compliance: 95, lastReview: '2024-03-01', nextAudit: '2024-08-01', status: 'COMPLIANT' },
                { name: 'FCA COLL Sourcebook', jurisdiction: 'UK', compliance: 92, lastReview: '2024-02-28', nextAudit: '2024-07-28', status: 'MINOR_ISSUES' },
                { name: 'GDPR Data Protection', jurisdiction: 'EU', compliance: 97, lastReview: '2024-03-10', nextAudit: '2024-06-10', status: 'COMPLIANT' }
              ].map((framework, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-sm">{framework.name}</h4>
                    <Badge variant={framework.status === 'COMPLIANT' ? 'default' : 'destructive'}>
                      {framework.status.replace('_', ' ')}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Jurisdiction: {framework.jurisdiction}
                  </p>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm">Compliance Level</span>
                    <span className="text-sm font-medium text-green-600">{framework.compliance}%</span>
                  </div>
                  <Progress value={framework.compliance} className="mb-2" />
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Last Review: {formatDate(framework.lastReview)}</span>
                    <span>Next Audit: {formatDate(framework.nextAudit)}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Risk Assessment Matrix
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { category: 'Regulatory Risk', level: 'LOW', probability: 15, impact: 'MEDIUM', mitigation: 'Active monitoring program', owner: 'Legal Team' },
                { category: 'Operational Risk', level: 'MEDIUM', probability: 35, impact: 'HIGH', mitigation: 'Process automation', owner: 'Operations' },
                { category: 'Reputational Risk', level: 'LOW', probability: 20, impact: 'HIGH', mitigation: 'PR response plan', owner: 'Communications' },
                { category: 'Financial Risk', level: 'HIGH', probability: 45, impact: 'CRITICAL', mitigation: 'Enhanced controls', owner: 'Finance' },
                { category: 'Cyber Security Risk', level: 'MEDIUM', probability: 30, impact: 'HIGH', mitigation: 'Security protocols', owner: 'IT Security' }
              ].map((risk, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-sm">{risk.category}</h4>
                    <Badge variant={risk.level === 'LOW' ? 'secondary' : risk.level === 'MEDIUM' ? 'default' : 'destructive'}>
                      {risk.level}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground mb-2">
                    <div>
                      <span className="font-medium">Probability:</span> {risk.probability}%
                    </div>
                    <div>
                      <span className="font-medium">Impact:</span> {risk.impact}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">
                    <span className="font-medium">Mitigation:</span> {risk.mitigation}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    <span className="font-medium">Owner:</span> {risk.owner}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Compliance Intelligence */}
      {navigationMode !== 'traditional' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              AI-Powered Compliance Intelligence
              <Badge variant="outline">Smart Monitoring</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-900 flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Regulatory Changes
                </h4>
                <p className="text-sm text-blue-700 mt-1">
                  EU AIFMD amendments effective Q3 2024. Impact assessment completed - minor adjustments required.
                </p>
              </div>
              <div className="p-4 bg-amber-50 rounded-lg">
                <h4 className="font-semibold text-amber-900 flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  Deadline Monitoring
                </h4>
                <p className="text-sm text-amber-700 mt-1">
                  Form ADV filing due in 15 days. Auto-generated draft ready for review.
                </p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-semibold text-green-900 flex items-center">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Best Practices
                </h4>
                <p className="text-sm text-green-700 mt-1">
                  Peer analysis shows opportunity to improve ESG disclosures. Template created for standardization.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const renderLegalReports = () => (
    <div className="space-y-6">
      {/* Report Generation Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Reports Generated</p>
                <p className="text-2xl font-bold">47</p>
              </div>
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">This month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg. Generation Time</p>
                <p className="text-2xl font-bold">2.1 hrs</p>
              </div>
              <Clock className="h-8 w-8 text-green-600" />
            </div>
            <p className="text-xs text-green-600 mt-2">↓ 35% from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Automated Reports</p>
                <p className="text-2xl font-bold">78%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">Of total reports</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending Reviews</p>
                <p className="text-2xl font-bold">5</p>
              </div>
              <Eye className="h-8 w-8 text-orange-600" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">Awaiting approval</p>
          </CardContent>
        </Card>
      </div>

      {/* Report Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Standard Reports
              </div>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Generate Report
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { name: 'Quarterly Compliance Report', frequency: 'Quarterly', lastGenerated: '2024-03-31', nextDue: '2024-06-30', status: 'CURRENT' },
                { name: 'Annual Regulatory Filing Summary', frequency: 'Annual', lastGenerated: '2023-12-31', nextDue: '2024-12-31', status: 'CURRENT' },
                { name: 'Risk Assessment Summary', frequency: 'Monthly', lastGenerated: '2024-03-28', nextDue: '2024-04-30', status: 'DUE_SOON' },
                { name: 'Contract Lifecycle Report', frequency: 'Quarterly', lastGenerated: '2024-02-29', nextDue: '2024-05-31', status: 'OVERDUE' },
                { name: 'Legal Spend Analysis', frequency: 'Monthly', lastGenerated: '2024-03-25', nextDue: '2024-04-25', status: 'CURRENT' }
              ].map((report, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{report.name}</h4>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>{report.frequency}</span>
                      <span>Last: {formatDate(report.lastGenerated)}</span>
                      <span>Next: {formatDate(report.nextDue)}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={
                      report.status === 'CURRENT' ? 'default' :
                      report.status === 'DUE_SOON' ? 'secondary' :
                      'destructive'
                    }>
                      {report.status.replace('_', ' ')}
                    </Badge>
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Legal Analytics & Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { title: 'Contract Negotiation Cycle Time', metric: '14.2 days', trend: -8, insight: 'Improved by template standardization' },
                { title: 'Legal Review Efficiency', metric: '92%', trend: 5, insight: 'Automated initial screening implemented' },
                { title: 'Compliance Adherence Rate', metric: '97.8%', trend: 2, insight: 'Consistent across all frameworks' },
                { title: 'External Legal Spend', metric: '$2.4M', trend: -12, insight: 'Reduced through in-house capabilities' },
                { title: 'Risk Mitigation Success', metric: '89%', trend: 7, insight: 'Proactive risk management effective' }
              ].map((analytic, index) => (
                <div key={index} className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-medium text-sm">{analytic.title}</h4>
                    <div className="flex items-center gap-1">
                      <span className="text-lg font-bold">{analytic.metric}</span>
                      {analytic.trend > 0 ? (
                        <TrendingUp className="h-4 w-4 text-green-600" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-600" />
                      )}
                      <span className={`text-xs ${analytic.trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {Math.abs(analytic.trend)}%
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">{analytic.insight}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Advanced Reporting Features */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Custom Report Builder
            {navigationMode === 'autonomous' && (
              <Badge variant="outline">AI-Assisted</Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { name: 'Fund Formation Summary', description: 'Comprehensive fund setup documentation and compliance status', complexity: 'Advanced', estimatedTime: '2-3 hours' },
              { name: 'Investment Due Diligence Report', description: 'Legal risk assessment and documentation review summary', complexity: 'Expert', estimatedTime: '4-5 hours' },
              { name: 'Regulatory Change Impact Analysis', description: 'Assessment of new regulations on existing portfolio', complexity: 'Intermediate', estimatedTime: '1-2 hours' },
              { name: 'Contract Portfolio Health Check', description: 'Analysis of contract terms, renewals, and risk exposure', complexity: 'Advanced', estimatedTime: '3-4 hours' },
              { name: 'Legal Spend Optimization', description: 'Analysis of legal costs with recommendations for efficiency', complexity: 'Intermediate', estimatedTime: '1 hour' },
              { name: 'Compliance Dashboard for LPs', description: 'Investor-facing compliance status and regulatory updates', complexity: 'Basic', estimatedTime: '30 mins' }
            ].map((template, index) => (
              <div key={index} className="p-4 border rounded-lg hover:bg-gray-50">
                <h4 className="font-semibold text-sm mb-2">{template.name}</h4>
                <p className="text-xs text-muted-foreground mb-3">{template.description}</p>
                <div className="flex items-center justify-between text-xs">
                  <Badge variant={
                    template.complexity === 'Basic' ? 'secondary' :
                    template.complexity === 'Intermediate' ? 'default' :
                    'destructive'
                  }>
                    {template.complexity}
                  </Badge>
                  <span className="text-muted-foreground">{template.estimatedTime}</span>
                </div>
                <Button size="sm" className="w-full mt-3">
                  Generate Report
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Scale className="h-8 w-8 text-blue-600" />
            Legal Management
          </h1>
          <p className="text-muted-foreground">
            Document center, compliance tracking, and legal risk assessment
          </p>
        </div>
        {renderModeSelector()}
      </div>

      {renderStatsCards()}

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="workflows">Workflows</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              {renderComplianceAlerts()}
              {renderActiveWorkflows()}
            </div>
            <div className="space-y-6">
              {renderUpcomingDeadlines()}
              {renderRecentActivity()}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="documents">
          {renderDocumentsList()}
        </TabsContent>

        <TabsContent value="workflows">
          {renderWorkflowManagement()}
        </TabsContent>

        <TabsContent value="compliance">
          {renderComplianceFramework()}
        </TabsContent>

        <TabsContent value="reports">
          {renderLegalReports()}
        </TabsContent>
      </Tabs>
    </div>
  );
}