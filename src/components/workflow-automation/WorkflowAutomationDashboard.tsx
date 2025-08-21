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
  BarChart3,
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
    // Load comprehensive mock data instead of API call
    loadMockWorkflowData();
  }, []);

  const loadMockWorkflowData = () => {
    // Mock Workflows
    const mockWorkflows: DocumentWorkflow[] = [
      {
        id: 'wf-1',
        name: 'Investment Memorandum Review',
        description: 'Automated review and approval process for investment memorandums',
        documentType: 'INVESTMENT_MEMORANDUM' as any,
        triggerType: 'DOCUMENT_UPLOAD' as any,
        isActive: true,
        fundId: 'fund-1',
        createdById: 'user-1',
        approvalSteps: [
          {
            id: 'step-1',
            workflowId: 'wf-1',
            stepNumber: 1,
            stepName: 'Investment Team Review',
            approverType: 'ROLE_BASED' as any,
            parallelApproval: false,
            timeoutHours: 24,
            createdAt: new Date('2024-10-01'),
            updatedAt: new Date('2024-10-01')
          },
          {
            id: 'step-2',
            workflowId: 'wf-1',
            stepNumber: 2,
            stepName: 'IC Approval',
            approverType: 'COMMITTEE' as any,
            parallelApproval: true,
            timeoutHours: 72,
            createdAt: new Date('2024-10-01'),
            updatedAt: new Date('2024-10-01')
          }
        ],
        automationRules: [
          {
            id: 'rule-1',
            workflowId: 'wf-1',
            ruleName: 'Auto-route by deal size',
            conditions: { dealSize: { greaterThan: 50000000 } },
            actions: { skipStep: 1, goToCommittee: true },
            priority: 1,
            isActive: true,
            createdAt: new Date('2024-10-01'),
            updatedAt: new Date('2024-10-01')
          },
          {
            id: 'rule-2',
            workflowId: 'wf-1',
            ruleName: 'Fast-track for repeat investments',
            conditions: { isRepeatInvestment: true },
            actions: { reduceTimeout: 12 },
            priority: 2,
            isActive: true,
            createdAt: new Date('2024-10-01'),
            updatedAt: new Date('2024-10-01')
          }
        ],
        workflowExecutions: [],
        createdAt: new Date('2024-10-01'),
        updatedAt: new Date('2024-11-15')
      },
      {
        id: 'wf-2',
        name: 'Compliance Document Workflow',
        description: 'Streamlined approval for regulatory compliance documents',
        documentType: 'COMPLIANCE_REPORT' as any,
        triggerType: 'DATE_BASED' as any,
        isActive: true,
        fundId: 'fund-1',
        createdById: 'user-2',
        approvalSteps: [
          {
            id: 'step-3',
            workflowId: 'wf-2',
            stepNumber: 1,
            stepName: 'Compliance Officer Review',
            approverType: 'SPECIFIC_USER' as any,
            parallelApproval: false,
            timeoutHours: 48,
            createdAt: new Date('2024-10-05'),
            updatedAt: new Date('2024-10-05')
          }
        ],
        automationRules: [
          {
            id: 'rule-3',
            workflowId: 'wf-2',
            ruleName: 'Auto-generate compliance reports',
            conditions: { scheduleType: 'quarterly' },
            actions: { generateReport: true, notifyStakeholders: true },
            priority: 1,
            isActive: true,
            createdAt: new Date('2024-10-05'),
            updatedAt: new Date('2024-10-05')
          }
        ],
        workflowExecutions: [],
        createdAt: new Date('2024-10-05'),
        updatedAt: new Date('2024-11-10')
      },
      {
        id: 'wf-3',
        name: 'Side Letter Processing',
        description: 'Efficient processing and approval of investor side letters',
        documentType: 'SIDE_LETTER' as any,
        triggerType: 'MANUAL' as any,
        isActive: false,
        fundId: 'fund-1',
        createdById: 'user-3',
        approvalSteps: [
          {
            id: 'step-4',
            workflowId: 'wf-3',
            stepNumber: 1,
            stepName: 'Legal Review',
            approverType: 'ROLE_BASED' as any,
            parallelApproval: false,
            timeoutHours: 96,
            createdAt: new Date('2024-09-20'),
            updatedAt: new Date('2024-09-20')
          }
        ],
        automationRules: [],
        workflowExecutions: [],
        createdAt: new Date('2024-09-20'),
        updatedAt: new Date('2024-11-01')
      }
    ];

    // Mock Approval Processes
    const mockApprovalProcesses: ApprovalProcess[] = [
      {
        id: 'ap-1',
        name: 'Investment Committee Approval',
        description: 'Multi-level approval process for new investments',
        processType: 'INVESTMENT_APPROVAL' as any,
        entityType: 'INVESTMENT',
        fundId: 'fund-1',
        createdById: 'user-1',
        isActive: true,
        approvalLevels: [
          {
            id: 'level-1',
            processId: 'ap-1',
            levelNumber: 1,
            levelName: 'Investment Team',
            requiredApprovers: { roles: ['investment_analyst', 'investment_director'] },
            minimumApprovals: 2,
            parallelApproval: true,
            escalationHours: 48,
            createdAt: new Date('2024-10-01'),
            updatedAt: new Date('2024-10-01')
          },
          {
            id: 'level-2',
            processId: 'ap-1',
            levelNumber: 2,
            levelName: 'Senior Management',
            requiredApprovers: { roles: ['managing_partner', 'cio'] },
            minimumApprovals: 1,
            parallelApproval: false,
            escalationHours: 72,
            createdAt: new Date('2024-10-01'),
            updatedAt: new Date('2024-10-01')
          }
        ],
        processExecutions: [],
        thresholds: { dealSize: 10000000, riskRating: 'medium' },
        createdAt: new Date('2024-10-01'),
        updatedAt: new Date('2024-11-15')
      },
      {
        id: 'ap-2',
        name: 'Expense Authorization',
        description: 'Tiered approval process for fund expenses',
        processType: 'EXPENSE_APPROVAL' as any,
        entityType: 'EXPENSE',
        fundId: 'fund-1',
        createdById: 'user-2',
        isActive: true,
        approvalLevels: [
          {
            id: 'level-3',
            processId: 'ap-2',
            levelNumber: 1,
            levelName: 'Department Head',
            requiredApprovers: { roles: ['department_head'] },
            minimumApprovals: 1,
            parallelApproval: false,
            escalationHours: 24,
            createdAt: new Date('2024-10-10'),
            updatedAt: new Date('2024-10-10')
          }
        ],
        processExecutions: [],
        thresholds: { amount: 5000 },
        createdAt: new Date('2024-10-10'),
        updatedAt: new Date('2024-11-12')
      }
    ];

    // Mock Executions with cross-module data
    const mockExecutions: (DocumentWorkflowExecution | ApprovalProcessExecution)[] = [
      {
        id: 'exec-1',
        workflowId: 'wf-1',
        documentId: 'doc-1',
        documentType: 'INVESTMENT_MEMORANDUM' as any,
        status: 'IN_PROGRESS' as any,
        currentStep: 2,
        startedById: 'user-1',
        startedBy: { id: 'user-1', name: 'Sarah Johnson', email: 'sarah.johnson@fund.com' },
        approvalHistory: [
          {
            id: 'hist-1',
            executionId: 'exec-1',
            stepNumber: 1,
            approverId: 'user-2',
            approver: { id: 'user-2', name: 'Michael Chen', email: 'michael.chen@fund.com' },
            status: 'APPROVED' as any,
            comments: 'Deal metrics look solid, proceeding to IC',
            approvedAt: new Date('2024-11-20'),
            createdAt: new Date('2024-11-20')
          }
        ],
        automationLogs: [
          {
            id: 'log-1',
            executionId: 'exec-1',
            ruleId: 'rule-1',
            action: 'route_to_committee',
            result: 'SUCCESS' as any,
            resultMessage: 'Auto-routed to IC due to deal size > $50M',
            executedAt: new Date('2024-11-20'),
            metadata: { dealSize: 125000000, trigger: 'deal_size_threshold' }
          }
        ],
        metadata: { dealName: 'TechCorp Acquisition', sector: 'Technology', dealValue: 125000000 },
        createdAt: new Date('2024-11-18'),
        updatedAt: new Date('2024-11-20')
      } as DocumentWorkflowExecution,
      {
        id: 'exec-2',
        processId: 'ap-1',
        entityId: 'inv-2',
        entityType: 'INVESTMENT',
        requestedById: 'user-3',
        requestedBy: { id: 'user-3', name: 'Emily Rodriguez', email: 'emily.rodriguez@fund.com' },
        status: 'PENDING' as any,
        currentLevel: 1,
        priority: 'HIGH' as any,
        deadline: new Date('2024-12-15'),
        approvalRecords: [],
        escalationLogs: [],
        metadata: { dealName: 'HealthTech Direct Investment', sector: 'Healthcare', dealValue: 85000000 },
        createdAt: new Date('2024-11-22'),
        updatedAt: new Date('2024-11-22')
      } as ApprovalProcessExecution,
      {
        id: 'exec-3',
        processId: 'ap-2',
        entityId: 'exp-1',
        entityType: 'EXPENSE',
        requestedById: 'user-4',
        requestedBy: { id: 'user-4', name: 'David Park', email: 'david.park@fund.com' },
        status: 'APPROVED' as any,
        priority: 'NORMAL' as any,
        completedAt: new Date('2024-11-19'),
        approvalRecords: [
          {
            id: 'rec-1',
            executionId: 'exec-3',
            levelNumber: 1,
            approverId: 'user-5',
            approver: { id: 'user-5', name: 'Lisa Wang', email: 'lisa.wang@fund.com' },
            status: 'APPROVED' as any,
            comments: 'Approved within budget limits',
            approvedAt: new Date('2024-11-19'),
            createdAt: new Date('2024-11-19')
          }
        ],
        escalationLogs: [],
        metadata: { expenseCategory: 'Legal Services', amount: 15000, vendor: 'Smith & Associates' },
        createdAt: new Date('2024-11-18'),
        updatedAt: new Date('2024-11-19')
      } as ApprovalProcessExecution
    ];

    // Mock Analytics with realistic performance data
    const mockAnalytics: WorkflowAnalytics = {
      totalWorkflows: mockWorkflows.length,
      activeExecutions: mockExecutions.filter(e => e.status === 'IN_PROGRESS' || e.status === 'PENDING').length,
      averageProcessingTime: 32,
      approvalSuccess: 94,
      pendingApprovals: mockExecutions.filter(e => e.status === 'PENDING').length,
      automationEfficiency: 78,
      workflowPerformance: [
        {
          workflowId: 'wf-1',
          workflowName: 'Investment Memorandum Review',
          executionsCount: 45,
          averageProcessingTime: 28,
          successRate: 96,
          automationRate: 85,
          bottlenecks: ['IC scheduling conflicts', 'Document quality review']
        },
        {
          workflowId: 'wf-2',
          workflowName: 'Compliance Document Workflow',
          executionsCount: 12,
          averageProcessingTime: 18,
          successRate: 100,
          automationRate: 95,
          bottlenecks: []
        }
      ]
    };

    // Mock AI Insights with cross-module intelligence
    const mockAIInsights: WorkflowAIInsight[] = [
      {
        id: 'insight-1',
        type: 'optimization',
        title: 'Investment Committee Scheduling Bottleneck Identified',
        description: 'IC meetings are causing 65% of approval delays. Consider implementing asynchronous approval for deals under $25M.',
        confidence: 87,
        impact: 'high',
        actionable: true,
        suggestedAction: 'Configure async approval rule for sub-$25M deals with 48hr response window',
        relatedWorkflowId: 'wf-1'
      },
      {
        id: 'insight-2',
        type: 'automation',
        title: 'Due Diligence Data Integration Opportunity',
        description: 'DD risk scores could automatically influence approval routing. High-risk deals (score < 6.0) should bypass standard workflow.',
        confidence: 92,
        impact: 'medium',
        actionable: true,
        suggestedAction: 'Create conditional routing rule based on DD module risk assessment scores'
      },
      {
        id: 'insight-3',
        type: 'efficiency',
        title: 'Cross-Module Data Sync Performance',
        description: 'Workflow execution times could be reduced by 23% with real-time portfolio and market data integration.',
        confidence: 79,
        impact: 'high',
        actionable: true,
        suggestedAction: 'Enable real-time data feeds from Portfolio Management and Market Intelligence modules'
      }
    ];

    // Mock Automation Recommendations with cross-module suggestions
    const mockAutomationRecommendations: AutomationRecommendation[] = [
      {
        id: 'rec-1',
        workflowId: 'wf-1',
        stepNumber: 1,
        automationType: 'approval_routing' as any,
        description: 'Auto-route investments based on Deal Screening module scoring and sector alignment',
        potentialSavings: 8,
        complexity: 'medium' as any,
        riskLevel: 'low' as any
      },
      {
        id: 'rec-2',
        workflowId: 'wf-2',
        stepNumber: 1,
        automationType: 'document_generation' as any,
        description: 'Generate compliance reports using Portfolio Management performance data',
        potentialSavings: 12,
        complexity: 'high' as any,
        riskLevel: 'low' as any
      },
      {
        id: 'rec-3',
        workflowId: 'wf-1',
        stepNumber: 2,
        automationType: 'notification' as any,
        description: 'Smart notifications based on LP Portal investor preferences and communication cadence',
        potentialSavings: 5,
        complexity: 'low' as any,
        riskLevel: 'low' as any
      }
    ];

    // Set all mock data
    setWorkflows(mockWorkflows);
    setApprovalProcesses(mockApprovalProcesses);
    setExecutions(mockExecutions);
    setAnalytics(mockAnalytics);
    setAIInsights(mockAIInsights);
    setAutomationRecommendations(mockAutomationRecommendations);
    setLoading(false);
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

  // Enhanced event handlers with cross-module integration
  const handleCreateWorkflow = () => {
    alert('Advanced Workflow Creation Wizard would open here:\n\n• Document type selection with AI suggestions\n• Approval step configuration with role-based routing\n• Integration with Deal Screening, Due Diligence, and Portfolio modules\n• Automation rule builder with cross-module data triggers\n• Template library with fund industry best practices\n• Real-time testing and validation environment')
  };

  const handleViewWorkflow = (workflowId: string) => {
    const workflow = workflows.find(w => w.id === workflowId);
    if (workflow) {
      alert(`Opening comprehensive workflow management interface for "${workflow.name}":\n\n• Visual workflow designer with drag-and-drop steps\n• Real-time execution monitoring and analytics\n• Cross-module data integration settings\n• Automation rule configuration and testing\n• Approval history and audit trail\n• Performance metrics and optimization suggestions`)
    }
  };

  const handleCreateApprovalProcess = () => {
    alert('Advanced Approval Process Builder would launch:\n\n• Multi-level approval hierarchy designer\n• Role-based and conditional approval routing\n• Integration with organizational charts and permissions\n• Threshold-based automatic routing (deal size, risk scores)\n• Escalation policies and delegation management\n• Cross-module trigger configuration (from DD, Portfolio, etc.)')
  };

  const handleViewApprovalProcess = (processId: string) => {
    const process = approvalProcesses.find(p => p.id === processId);
    if (process) {
      alert(`Opening approval process management interface for "${process.name}":\n\n• Process flow visualization and modification\n• Approval level configuration and threshold management\n• Real-time execution tracking and bottleneck analysis\n• Integration with user management and role assignments\n• Performance analytics and process optimization\n• Automated reporting and compliance tracking`)
    }
  };

  const handleViewExecution = (executionId: string) => {
    const execution = executions.find(e => e.id === executionId);
    if (execution) {
      alert(`Opening detailed execution view for workflow execution:\n\n• Step-by-step progress tracking with timestamps\n• Approval history and comments from all participants\n• Automation log showing rule executions and results\n• Cross-module data that influenced routing decisions\n• Real-time notifications and escalation status\n• Document versions and audit trail`)
    }
  };

  const handleImplementRecommendation = (recommendationId: string) => {
    const recommendation = automationRecommendations.find(r => r.id === recommendationId);
    if (recommendation) {
      alert(`Implementing automation recommendation:\n\n"${recommendation.description}"\n\n• Configuration wizard would guide setup\n• Cross-module data connections would be established\n• Testing environment for validation\n• Rollback plan and monitoring setup\n• Expected savings: ${recommendation.potentialSavings} hours/week\n• Complexity: ${recommendation.complexity}, Risk: ${recommendation.riskLevel}`)
    }
  };

  const handleApplyInsight = (insightId: string) => {
    const insight = aiInsights.find(i => i.id === insightId);
    if (insight) {
      alert(`Applying AI insight: "${insight.title}"\n\n${insight.description}\n\nSuggested Action: ${insight.suggestedAction}\n\n• Confidence level: ${insight.confidence}%\n• Expected impact: ${insight.impact}\n• Implementation wizard would guide the setup\n• A/B testing framework for validation\n• Performance monitoring and rollback capabilities`)
    }
  };

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
                    <Button variant="ghost" size="sm" onClick={() => handleViewExecution(execution.id)}>
                      View
                    </Button>
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
                        <div className="mt-3">
                          <p className="text-sm text-blue-600">
                            💡 {insight.suggestedAction}
                          </p>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="mt-2"
                            onClick={() => handleApplyInsight(insight.id)}
                          >
                            Apply Insight
                          </Button>
                        </div>
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
        
        <Button onClick={handleCreateWorkflow}>
          <Plus className="w-4 h-4 mr-2" />
          Create Workflow
        </Button>
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
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleViewWorkflow(workflow.id)}
                    >
                      <Settings className="w-4 h-4 mr-1" />
                      Configure
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleViewWorkflow(workflow.id)}
                    >
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
        <Button onClick={handleCreateApprovalProcess}>
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
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleViewApprovalProcess(process.id)}
                  >
                    <Settings className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleViewApprovalProcess(process.id)}
                  >
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Performance Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2 text-blue-600" />
                  Workflow Performance Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics?.workflowPerformance.map((workflow) => (
                    <div key={workflow.workflowId} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium text-sm">{workflow.workflowName}</h4>
                        <Badge variant="outline">{workflow.executionsCount} executions</Badge>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Success Rate</p>
                          <div className="flex items-center space-x-2">
                            <Progress value={workflow.successRate} className="flex-1 h-2" />
                            <span className="font-medium">{workflow.successRate}%</span>
                          </div>
                        </div>
                        <div>
                          <p className="text-gray-600">Automation Rate</p>
                          <div className="flex items-center space-x-2">
                            <Progress value={workflow.automationRate} className="flex-1 h-2" />
                            <span className="font-medium">{workflow.automationRate}%</span>
                          </div>
                        </div>
                        <div>
                          <p className="text-gray-600">Avg Time</p>
                          <p className="font-medium">{workflow.averageProcessingTime}h</p>
                        </div>
                      </div>

                      {workflow.bottlenecks.length > 0 && (
                        <div className="mt-2">
                          <p className="text-xs text-amber-600 mb-1">Identified bottlenecks:</p>
                          <div className="flex flex-wrap gap-1">
                            {workflow.bottlenecks.map((bottleneck, index) => (
                              <Badge key={index} variant="destructive" className="text-xs">
                                {bottleneck}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Cross-Module Integration Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="w-5 h-5 mr-2 text-green-600" />
                  Cross-Module Integration Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">24</div>
                      <div className="text-sm text-gray-600">Deal Screening → Workflow</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">18</div>
                      <div className="text-sm text-gray-600">DD → Approval Routing</div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Portfolio Data Integration</span>
                        <span>87% success rate</span>
                      </div>
                      <Progress value={87} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Market Intel Triggers</span>
                        <span>94% success rate</span>
                      </div>
                      <Progress value={94} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>LP/GP Portal Notifications</span>
                        <span>91% delivery rate</span>
                      </div>
                      <Progress value={91} className="h-2" />
                    </div>
                  </div>

                  <div className="mt-4 p-3 bg-purple-50 rounded-lg">
                    <h5 className="font-medium text-purple-800 mb-2">Integration Opportunities</h5>
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span>Advanced Analytics → Auto-reporting</span>
                        <span className="text-purple-600">High impact</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Legal Management → Document workflow</span>
                        <span className="text-purple-600">Medium impact</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Fund Operations → Expense approval</span>
                        <span className="text-purple-600">Low impact</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Workflow Execution Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-orange-600" />
                Recent Execution Timeline & Performance Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {executions.slice(0, 8).map((execution) => (
                  <div key={execution.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="flex flex-col items-center">
                        <div className={`w-3 h-3 rounded-full ${getStatusColor(execution.status).includes('green') ? 'bg-green-500' : 
                          getStatusColor(execution.status).includes('blue') ? 'bg-blue-500' : 
                          getStatusColor(execution.status).includes('yellow') ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
                        <div className="text-xs text-gray-400 mt-1">
                          {new Date(execution.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      
                      <div>
                        <div className="font-medium">
                          {'workflowId' in execution ? 'Document Workflow' : 'Approval Process'}
                        </div>
                        <div className="text-sm text-gray-600">
                          {execution.metadata?.dealName || execution.metadata?.expenseCategory || 'Unknown entity'}
                        </div>
                        <div className="text-xs text-gray-500">
                          By {('startedBy' in execution ? execution.startedBy?.name : 
                               'requestedBy' in execution ? execution.requestedBy?.name : 'Unknown')}
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <Badge className={getStatusColor(execution.status)}>
                        {execution.status}
                      </Badge>
                      <div className="text-xs text-gray-500 mt-1">
                        {execution.metadata?.dealValue ? `$${(execution.metadata.dealValue / 1000000).toFixed(0)}M` : 
                         execution.metadata?.amount ? `$${execution.metadata.amount.toLocaleString()}` : ''}
                      </div>
                    </div>
                  </div>
                ))}
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
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleImplementRecommendation(rec.id)}
                      >
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