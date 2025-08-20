import { NextRequest, NextResponse } from 'next/server';
import {
  DocumentWorkflow,
  ApprovalProcess,
  DocumentWorkflowExecution,
  ApprovalProcessExecution,
  WorkflowAnalytics,
  WorkflowAIInsight,
  AutomationRecommendation,
  DocumentType,
  WorkflowTriggerType,
  ApproverType,
  WorkflowExecutionStatus,
  ApprovalStatus,
  ApprovalProcessType,
  ApprovalPriority,
  EscalationReason,
  AutomationResult,
} from '@/types/workflow-automation';

// Mock data for Document Workflows
const mockDocumentWorkflows: DocumentWorkflow[] = [
  {
    id: 'wf-1',
    name: 'Investment Memorandum Review',
    description: 'Automated review and approval process for investment memorandums',
    documentType: DocumentType.INVESTMENT_MEMORANDUM,
    triggerType: WorkflowTriggerType.DOCUMENT_UPLOAD,
    triggerConditions: { minAmount: 1000000 },
    isActive: true,
    fundId: 'fund-1',
    createdById: 'user-1',
    approvalSteps: [
      {
        id: 'step-1',
        workflowId: 'wf-1',
        stepNumber: 1,
        stepName: 'Investment Team Review',
        approverType: ApproverType.ROLE_BASED,
        requiredApprovers: { roles: ['INVESTMENT_ANALYST', 'SENIOR_ANALYST'] },
        parallelApproval: true,
        timeoutHours: 48,
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-15'),
      },
      {
        id: 'step-2',
        workflowId: 'wf-1',
        stepNumber: 2,
        stepName: 'Investment Committee Approval',
        approverType: ApproverType.COMMITTEE,
        requiredApprovers: { committee: 'INVESTMENT_COMMITTEE' },
        parallelApproval: false,
        timeoutHours: 72,
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-15'),
      },
    ],
    automationRules: [
      {
        id: 'rule-1',
        workflowId: 'wf-1',
        ruleName: 'Send Notification on Upload',
        conditions: { trigger: 'document_uploaded' },
        actions: { 
          email: { template: 'new_document_notification', recipients: ['investment_team'] },
          slack: { channel: '#investments', message: 'New IM uploaded for review' }
        },
        priority: 1,
        isActive: true,
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-15'),
      },
    ],
    workflowExecutions: [],
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-20'),
  },
  {
    id: 'wf-2',
    name: 'Side Letter Execution',
    description: 'Streamlined process for side letter reviews and approvals',
    documentType: DocumentType.SIDE_LETTER,
    triggerType: WorkflowTriggerType.MANUAL,
    isActive: true,
    fundId: 'fund-1',
    createdById: 'user-2',
    approvalSteps: [
      {
        id: 'step-3',
        workflowId: 'wf-2',
        stepNumber: 1,
        stepName: 'Legal Review',
        approverType: ApproverType.SPECIFIC_USER,
        requiredApprovers: { users: ['legal-counsel-1', 'legal-counsel-2'] },
        parallelApproval: false,
        timeoutHours: 24,
        createdAt: new Date('2024-01-20'),
        updatedAt: new Date('2024-01-20'),
      },
    ],
    automationRules: [],
    workflowExecutions: [],
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-25'),
  },
  {
    id: 'wf-3',
    name: 'Compliance Report Processing',
    description: 'Automated compliance report generation and distribution',
    documentType: DocumentType.COMPLIANCE_REPORT,
    triggerType: WorkflowTriggerType.DATE_BASED,
    triggerConditions: { schedule: 'monthly', dayOfMonth: 1 },
    isActive: true,
    fundId: 'fund-2',
    createdById: 'user-3',
    approvalSteps: [
      {
        id: 'step-4',
        workflowId: 'wf-3',
        stepNumber: 1,
        stepName: 'Compliance Officer Review',
        approverType: ApproverType.ROLE_BASED,
        requiredApprovers: { roles: ['COMPLIANCE_OFFICER'] },
        parallelApproval: false,
        timeoutHours: 12,
        createdAt: new Date('2024-01-25'),
        updatedAt: new Date('2024-01-25'),
      },
    ],
    automationRules: [
      {
        id: 'rule-2',
        workflowId: 'wf-3',
        ruleName: 'Auto-generate Report',
        conditions: { trigger: 'monthly_schedule' },
        actions: { 
          generateDocument: { template: 'compliance_report_template' },
          notifyStakeholders: { groups: ['compliance_team', 'fund_managers'] }
        },
        priority: 0,
        isActive: true,
        createdAt: new Date('2024-01-25'),
        updatedAt: new Date('2024-01-25'),
      },
    ],
    workflowExecutions: [],
    createdAt: new Date('2024-01-25'),
    updatedAt: new Date('2024-01-30'),
  },
];

// Mock data for Approval Processes
const mockApprovalProcesses: ApprovalProcess[] = [
  {
    id: 'ap-1',
    name: 'Large Investment Approval',
    description: 'Multi-level approval process for investments above $5M',
    processType: ApprovalProcessType.INVESTMENT_APPROVAL,
    entityType: 'investment',
    fundId: 'fund-1',
    createdById: 'user-1',
    isActive: true,
    thresholds: { minimumAmount: 5000000 },
    approvalLevels: [
      {
        id: 'level-1',
        processId: 'ap-1',
        levelNumber: 1,
        levelName: 'Principal Review',
        requiredApprovers: { roles: ['PRINCIPAL'] },
        minimumApprovals: 1,
        parallelApproval: false,
        escalationHours: 24,
        createdAt: new Date('2024-01-10'),
        updatedAt: new Date('2024-01-10'),
      },
      {
        id: 'level-2',
        processId: 'ap-1',
        levelNumber: 2,
        levelName: 'Managing Partner Approval',
        requiredApprovers: { roles: ['MANAGING_PARTNER'] },
        minimumApprovals: 1,
        parallelApproval: false,
        escalationHours: 48,
        createdAt: new Date('2024-01-10'),
        updatedAt: new Date('2024-01-10'),
      },
    ],
    processExecutions: [],
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: 'ap-2',
    name: 'Expense Approval Process',
    description: 'Tiered approval for operational expenses',
    processType: ApprovalProcessType.EXPENSE_APPROVAL,
    entityType: 'expense',
    fundId: 'fund-1',
    createdById: 'user-2',
    isActive: true,
    thresholds: { 
      tier1: { max: 10000, approvers: ['OPERATIONS_MANAGER'] },
      tier2: { max: 50000, approvers: ['FINANCE_DIRECTOR'] },
      tier3: { max: 100000, approvers: ['MANAGING_PARTNER'] }
    },
    approvalLevels: [
      {
        id: 'level-3',
        processId: 'ap-2',
        levelNumber: 1,
        levelName: 'Manager Approval',
        requiredApprovers: { conditionalRoles: 'based_on_amount' },
        minimumApprovals: 1,
        parallelApproval: false,
        escalationHours: 24,
        createdAt: new Date('2024-01-12'),
        updatedAt: new Date('2024-01-12'),
      },
    ],
    processExecutions: [],
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-17'),
  },
];

// Mock data for Workflow Executions
const mockWorkflowExecutions: (DocumentWorkflowExecution | ApprovalProcessExecution)[] = [
  {
    id: 'exec-1',
    workflowId: 'wf-1',
    documentId: 'doc-123',
    documentType: DocumentType.INVESTMENT_MEMORANDUM,
    status: WorkflowExecutionStatus.IN_PROGRESS,
    currentStep: 1,
    startedById: 'user-1',
    startedBy: { id: 'user-1', name: 'Sarah Chen', email: 'sarah.chen@example.com' },
    approvalHistory: [
      {
        id: 'ah-1',
        executionId: 'exec-1',
        stepNumber: 1,
        approverId: 'user-4',
        approver: { id: 'user-4', name: 'Michael Rodriguez', email: 'michael.rodriguez@example.com' },
        status: ApprovalStatus.PENDING,
        createdAt: new Date('2024-01-28'),
      },
    ],
    automationLogs: [
      {
        id: 'al-1',
        executionId: 'exec-1',
        ruleId: 'rule-1',
        action: 'email_notification',
        result: AutomationResult.SUCCESS,
        resultMessage: 'Notification sent to investment team',
        executedAt: new Date('2024-01-28'),
      },
    ],
    metadata: { originalFileName: 'TechCorp_Investment_Memo_2024.pdf' },
    createdAt: new Date('2024-01-28'),
    updatedAt: new Date('2024-01-28'),
  } as DocumentWorkflowExecution,
  {
    id: 'exec-2',
    processId: 'ap-1',
    entityId: 'inv-456',
    entityType: 'investment',
    requestedById: 'user-2',
    requestedBy: { id: 'user-2', name: 'David Kim', email: 'david.kim@example.com' },
    status: WorkflowExecutionStatus.PENDING,
    currentLevel: 1,
    priority: ApprovalPriority.HIGH,
    deadline: new Date('2024-02-05'),
    approvalRecords: [
      {
        id: 'ar-1',
        executionId: 'exec-2',
        levelNumber: 1,
        approverId: 'user-5',
        approver: { id: 'user-5', name: 'Jennifer Liu', email: 'jennifer.liu@example.com' },
        status: ApprovalStatus.PENDING,
        createdAt: new Date('2024-01-30'),
      },
    ],
    escalationLogs: [],
    metadata: { 
      investmentAmount: 7500000, 
      companyName: 'TechCorp Solutions',
      sector: 'Enterprise Software'
    },
    createdAt: new Date('2024-01-30'),
    updatedAt: new Date('2024-01-30'),
  } as ApprovalProcessExecution,
  {
    id: 'exec-3',
    workflowId: 'wf-2',
    documentId: 'doc-789',
    documentType: DocumentType.SIDE_LETTER,
    status: WorkflowExecutionStatus.APPROVED,
    startedById: 'user-3',
    startedBy: { id: 'user-3', name: 'Emily Wang', email: 'emily.wang@example.com' },
    completedAt: new Date('2024-01-26'),
    approvalHistory: [
      {
        id: 'ah-2',
        executionId: 'exec-3',
        stepNumber: 1,
        approverId: 'user-6',
        approver: { id: 'user-6', name: 'Robert Taylor', email: 'robert.taylor@example.com' },
        status: ApprovalStatus.APPROVED,
        comments: 'Approved with minor redline comments',
        approvedAt: new Date('2024-01-26'),
        createdAt: new Date('2024-01-25'),
      },
    ],
    automationLogs: [],
    metadata: { lpName: 'Pension Fund Alpha', sideLetterType: 'Most Favored Nation' },
    createdAt: new Date('2024-01-25'),
    updatedAt: new Date('2024-01-26'),
  } as DocumentWorkflowExecution,
];

// Mock Analytics Data
const mockAnalytics: WorkflowAnalytics = {
  totalWorkflows: mockDocumentWorkflows.length,
  activeExecutions: mockWorkflowExecutions.filter(e => 
    [WorkflowExecutionStatus.PENDING, WorkflowExecutionStatus.IN_PROGRESS].includes(e.status)
  ).length,
  averageProcessingTime: 18.5,
  approvalSuccess: 89.2,
  pendingApprovals: 7,
  automationEfficiency: 73.4,
  workflowPerformance: [
    {
      workflowId: 'wf-1',
      workflowName: 'Investment Memorandum Review',
      executionsCount: 23,
      averageProcessingTime: 24.3,
      successRate: 91.3,
      automationRate: 68.2,
      bottlenecks: ['Investment Committee availability', 'Document quality issues'],
    },
    {
      workflowId: 'wf-2',
      workflowName: 'Side Letter Execution',
      executionsCount: 15,
      averageProcessingTime: 12.7,
      successRate: 93.3,
      automationRate: 40.0,
      bottlenecks: ['Legal counsel review time'],
    },
    {
      workflowId: 'wf-3',
      workflowName: 'Compliance Report Processing',
      executionsCount: 12,
      averageProcessingTime: 8.2,
      successRate: 100.0,
      automationRate: 95.0,
      bottlenecks: [],
    },
  ],
};

// Mock AI Insights
const mockAIInsights: WorkflowAIInsight[] = [
  {
    id: 'insight-1',
    type: 'bottleneck',
    title: 'Investment Committee Approval Bottleneck',
    description: 'The Investment Committee approval step is causing 65% of workflow delays. Average approval time has increased by 40% over the past month.',
    confidence: 92,
    impact: 'high',
    actionable: true,
    suggestedAction: 'Consider implementing parallel review for committee members or scheduling more frequent IC meetings.',
    relatedWorkflowId: 'wf-1',
  },
  {
    id: 'insight-2',
    type: 'optimization',
    title: 'Side Letter Automation Opportunity',
    description: 'Standard side letter approvals could be automated for amounts under $1M with pre-approved terms.',
    confidence: 87,
    impact: 'medium',
    actionable: true,
    suggestedAction: 'Create automated approval rules for standard side letters meeting specific criteria.',
    relatedWorkflowId: 'wf-2',
  },
  {
    id: 'insight-3',
    type: 'efficiency',
    title: 'Compliance Workflow Excellence',
    description: 'Your compliance report workflow is performing exceptionally well with 100% success rate and 95% automation.',
    confidence: 95,
    impact: 'low',
    actionable: false,
    suggestedAction: 'Consider using this workflow as a template for other recurring document processes.',
    relatedWorkflowId: 'wf-3',
  },
];

// Mock Automation Recommendations
const mockAutomationRecommendations: AutomationRecommendation[] = [
  {
    id: 'rec-1',
    workflowId: 'wf-1',
    stepNumber: 1,
    automationType: 'email',
    description: 'Automatically send weekly digest of pending investment reviews to committee members',
    potentialSavings: 3.5,
    complexity: 'low',
    riskLevel: 'low',
  },
  {
    id: 'rec-2',
    workflowId: 'wf-2',
    stepNumber: 1,
    automationType: 'approval_routing',
    description: 'Implement smart routing to available legal counsel based on workload and expertise',
    potentialSavings: 8.2,
    complexity: 'medium',
    riskLevel: 'low',
  },
  {
    id: 'rec-3',
    workflowId: 'wf-1',
    stepNumber: 2,
    automationType: 'document_generation',
    description: 'Auto-generate investment summary reports from memorandum data using AI extraction',
    potentialSavings: 12.0,
    complexity: 'high',
    riskLevel: 'medium',
  },
];

export async function GET(request: NextRequest) {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100));

    const data = {
      workflows: mockDocumentWorkflows,
      approvalProcesses: mockApprovalProcesses,
      executions: mockWorkflowExecutions,
      analytics: mockAnalytics,
      aiInsights: mockAIInsights,
      automationRecommendations: mockAutomationRecommendations,
    };

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching workflow automation data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch workflow automation data' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Creating new workflow or approval process:', body);

    // Here you would typically save to database
    // For now, just return a success response

    return NextResponse.json(
      { 
        message: 'Workflow/Process created successfully',
        id: `new-${Date.now()}`,
        ...body
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating workflow/process:', error);
    return NextResponse.json(
      { error: 'Failed to create workflow/process' },
      { status: 500 }
    );
  }
}