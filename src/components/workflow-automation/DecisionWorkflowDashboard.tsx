"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  User, 
  Calendar,
  TrendingUp,
  Activity,
  Target,
  Zap,
  FileText,
  Users,
  AlertCircle,
  BarChart3
} from 'lucide-react';
import { 
  DecisionWorkflow, 
  DecisionWorkflowEngine, 
  WorkflowStatus,
  StakeholderRole,
  Priority,
  DecisionType
} from '@/lib/decision-workflow-engine';

interface DecisionWorkflowDashboardProps {
  userId: string;
  userRole: StakeholderRole;
}

export default function DecisionWorkflowDashboard({ userId, userRole }: DecisionWorkflowDashboardProps) {
  const [workflows, setWorkflows] = useState<DecisionWorkflow[]>([]);
  const [selectedWorkflow, setSelectedWorkflow] = useState<DecisionWorkflow | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending');
  const [approvalDialog, setApprovalDialog] = useState<{open: boolean, workflow: DecisionWorkflow | null}>({open: false, workflow: null});
  const [approvalDecision, setApprovalDecision] = useState<'approved' | 'rejected'>('approved');
  const [approvalComments, setApprovalComments] = useState('');

  const workflowEngine = new DecisionWorkflowEngine();

  useEffect(() => {
    loadWorkflows();
  }, [userId, userRole]);

  const loadWorkflows = async () => {
    setIsLoading(true);
    try {
      const userWorkflows = workflowEngine.getWorkflowsForUser(userId, userRole);
      setWorkflows(userWorkflows);
    } catch (error) {
      console.error('Failed to load workflows:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApproval = async () => {
    if (!approvalDialog.workflow) return;

    try {
      workflowEngine.processApproval(
        approvalDialog.workflow.id,
        userRole,
        approvalDecision,
        approvalComments
      );
      
      setApprovalDialog({open: false, workflow: null});
      setApprovalComments('');
      await loadWorkflows();
    } catch (error) {
      console.error('Failed to process approval:', error);
    }
  };

  const getStatusColor = (status: WorkflowStatus): string => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'pending_approval': return 'bg-yellow-100 text-yellow-800';
      case 'under_review': return 'bg-blue-100 text-blue-800';
      case 'on_hold': return 'bg-gray-100 text-gray-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  const getPriorityColor = (priority: Priority): string => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'urgent': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'high': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'medium': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeIcon = (type: DecisionType) => {
    switch (type) {
      case 'investment': return <TrendingUp className="w-4 h-4" />;
      case 'strategic': return <Target className="w-4 h-4" />;
      case 'operational': return <Activity className="w-4 h-4" />;
      case 'regulatory': return <FileText className="w-4 h-4" />;
      default: return <BarChart3 className="w-4 h-4" />;
    }
  };

  const filteredWorkflows = workflows.filter(workflow => {
    switch (activeTab) {
      case 'pending':
        return ['draft', 'under_review', 'pending_approval'].includes(workflow.status);
      case 'approved':
        return workflow.status === 'approved';
      case 'my_approvals':
        return workflow.requiredApprovals.some(a => a.role === userRole && !a.completed);
      default:
        return true;
    }
  });

  const calculateWorkflowProgress = (workflow: DecisionWorkflow): number => {
    const totalSteps = workflow.requiredApprovals.length;
    const completedSteps = workflow.requiredApprovals.filter(a => a.completed).length;
    return (completedSteps / totalSteps) * 100;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Decision Workflows</h1>
          <p className="text-gray-600 mt-1">Intelligent decision routing and approval management</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Zap className="w-4 h-4 mr-2" />
          Create Workflow
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold">{workflows.filter(w => ['draft', 'under_review', 'pending_approval'].includes(w.status)).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Approved</p>
                <p className="text-2xl font-bold">{workflows.filter(w => w.status === 'approved').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <User className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Awaiting My Approval</p>
                <p className="text-2xl font-bold">{workflows.filter(w => w.requiredApprovals.some(a => a.role === userRole && !a.completed)).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
              <div>
                <p className="text-sm text-gray-600">Overdue</p>
                <p className="text-2xl font-bold">{workflows.filter(w => new Date(w.timeline.targetDecision) < new Date() && !['approved', 'rejected'].includes(w.status)).length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="my_approvals">My Approvals</TabsTrigger>
          <TabsTrigger value="all">All</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          {filteredWorkflows.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No workflows found</h3>
                <p className="text-gray-600">No workflows match the current filter criteria.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredWorkflows.map((workflow) => (
                <Card key={workflow.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setSelectedWorkflow(workflow)}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        {getTypeIcon(workflow.type)}
                        <div>
                          <h3 className="font-semibold text-gray-900">{workflow.title}</h3>
                          <p className="text-sm text-gray-600">Created {new Date(workflow.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getPriorityColor(workflow.priority)}>{workflow.priority}</Badge>
                        <Badge className={getStatusColor(workflow.status)}>{workflow.status.replace('_', ' ')}</Badge>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Progress</span>
                        <span className="font-medium">{Math.round(calculateWorkflowProgress(workflow))}%</span>
                      </div>
                      <Progress value={calculateWorkflowProgress(workflow)} className="h-2" />

                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-600">Due {new Date(workflow.timeline.targetDecision).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Users className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-600">{workflow.stakeholders.length} stakeholders</span>
                          </div>
                        </div>
                        {workflow.requiredApprovals.some(a => a.role === userRole && !a.completed) && (
                          <Button 
                            size="sm" 
                            onClick={(e) => {
                              e.stopPropagation();
                              setApprovalDialog({open: true, workflow});
                            }}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            Review
                          </Button>
                        )}
                      </div>

                      {workflow.context.riskAssessment.overallRisk === 'high' && (
                        <Alert>
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription>
                            High risk decision - {workflow.context.riskAssessment.categories.length} risk factors identified
                          </AlertDescription>
                        </Alert>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Workflow Detail Dialog */}
      <Dialog open={!!selectedWorkflow} onOpenChange={() => setSelectedWorkflow(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedWorkflow && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center space-x-2">
                  {getTypeIcon(selectedWorkflow.type)}
                  <span>{selectedWorkflow.title}</span>
                  <Badge className={getStatusColor(selectedWorkflow.status)}>
                    {selectedWorkflow.status.replace('_', ' ')}
                  </Badge>
                </DialogTitle>
              </DialogHeader>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Current Stage</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <h4 className="font-medium">{selectedWorkflow.currentStage.name}</h4>
                        <p className="text-sm text-gray-600">{selectedWorkflow.currentStage.description}</p>
                        <div className="text-xs text-gray-500">
                          Estimated Duration: {selectedWorkflow.currentStage.estimatedDuration}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Required Approvals</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {selectedWorkflow.requiredApprovals.map((approval, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <span className="text-sm">{approval.role.replace('_', ' ')}</span>
                            {approval.completed ? (
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            ) : (
                              <Clock className="w-4 h-4 text-gray-400" />
                            )}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Risk Assessment</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Overall Risk</span>
                          <Badge className={selectedWorkflow.context.riskAssessment.overallRisk === 'high' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}>
                            {selectedWorkflow.context.riskAssessment.overallRisk}
                          </Badge>
                        </div>
                        <div className="space-y-2">
                          {selectedWorkflow.context.riskAssessment.categories.map((category, index) => (
                            <div key={index} className="text-sm">
                              <div className="flex justify-between">
                                <span className="capitalize">{category.type}</span>
                                <span className="text-gray-600">{category.level}</span>
                              </div>
                              <p className="text-xs text-gray-500 mt-1">{category.description}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Financial Impact</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm">Estimated Value</span>
                          <span className="font-medium">{selectedWorkflow.context.financialImpact.currency} {selectedWorkflow.context.financialImpact.estimatedValue.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Confidence Level</span>
                          <span className="text-sm">{(selectedWorkflow.context.financialImpact.confidenceLevel * 100).toFixed(0)}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Time Horizon</span>
                          <span className="text-sm">{selectedWorkflow.context.financialImpact.timeHorizon}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Decision Context</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-700">{selectedWorkflow.context.summary}</p>
                  {selectedWorkflow.context.strategicImplications.length > 0 && (
                    <div className="mt-4">
                      <h5 className="text-sm font-medium mb-2">Strategic Implications</h5>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {selectedWorkflow.context.strategicImplications.map((implication, index) => (
                          <li key={index}>• {implication}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Approval Dialog */}
      <Dialog open={approvalDialog.open} onOpenChange={(open) => setApprovalDialog({open, workflow: approvalDialog.workflow})}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Process Approval</DialogTitle>
          </DialogHeader>
          
          {approvalDialog.workflow && (
            <div className="space-y-4">
              <div>
                <h4 className="font-medium">{approvalDialog.workflow.title}</h4>
                <p className="text-sm text-gray-600 mt-1">{approvalDialog.workflow.context.summary}</p>
              </div>

              <div>
                <label className="text-sm font-medium">Decision</label>
                <Select value={approvalDecision} onValueChange={(value: 'approved' | 'rejected') => setApprovalDecision(value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="approved">Approve</SelectItem>
                    <SelectItem value="rejected">Reject</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium">Comments (Optional)</label>
                <Textarea
                  value={approvalComments}
                  onChange={(e) => setApprovalComments(e.target.value)}
                  placeholder="Add your comments or rationale..."
                  className="mt-1"
                  rows={3}
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setApprovalDialog({open: false, workflow: null})}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleApproval}
                  className={approvalDecision === 'approved' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}
                >
                  {approvalDecision === 'approved' ? 'Approve' : 'Reject'}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}