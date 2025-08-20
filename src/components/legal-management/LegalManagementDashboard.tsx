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
         TrendingUp, Search, Filter, Plus, Eye, Edit, Download, Share2,
         AlertCircle, BookOpen, Gavel, Scale } from 'lucide-react';

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
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Workflow Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Gavel className="h-12 w-12 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Workflow Management</h3>
                <p>Detailed workflow management interface would be implemented here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Compliance Framework
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Shield className="h-12 w-12 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Compliance Management</h3>
                <p>Comprehensive compliance framework and risk assessment tools would be implemented here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Legal Reports
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Legal Reporting</h3>
                <p>Advanced legal analytics and reporting capabilities would be implemented here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}