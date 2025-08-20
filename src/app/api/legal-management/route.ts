import { NextResponse } from 'next/server';
import {
  LegalManagementResponse,
  LegalDocument,
  LegalWorkflow,
  DeadlineSummary,
  ComplianceAlert,
  ActivitySummary,
  WorkflowSummary,
  LegalDashboardStats,
  ComplianceFramework,
  RiskAssessment,
  LegalEvent,
  LegalReminder
} from '@/types/legal-management';

// Mock data generation
const generateMockLegalDocuments = (): LegalDocument[] => {
  const documents: LegalDocument[] = [
    {
      id: 'doc-001',
      title: 'Series A Preferred Stock Purchase Agreement - TechStart Inc.',
      fileName: 'TechStart_Series_A_Agreement.pdf',
      filePath: '/documents/techstart_series_a.pdf',
      fileSize: 2456789,
      documentType: 'AGREEMENT',
      category: 'INVESTMENT',
      status: 'EXECUTED',
      priority: 'HIGH',
      confidentiality: 'CONFIDENTIAL',
      description: 'Comprehensive Series A investment agreement including liquidation preferences, anti-dilution provisions, and board composition terms.',
      summary: 'Series A investment of $15M with 2x liquidation preference and weighted average anti-dilution protection.',
      jurisdiction: 'Delaware',
      governingLaw: 'Delaware General Corporation Law',
      contractValue: 15000000,
      currency: 'USD',
      effectiveDate: new Date('2024-06-15'),
      expirationDate: new Date('2029-06-15'),
      parties: [
        { id: 'p1', name: 'TechStart Inc.', type: 'ORGANIZATION', role: 'Company' },
        { id: 'p2', name: 'Venture Capital Partners', type: 'ORGANIZATION', role: 'Lead Investor' }
      ],
      internalOwner: 'user-legal-001',
      externalCounsel: 'Wilson Sonsini Goodrich & Rosati',
      assignedTo: 'user-legal-002',
      complianceStatus: 'COMPLIANT',
      version: 3,
      isTemplate: false,
      createdBy: 'user-legal-001',
      createdAt: new Date('2024-05-15'),
      updatedBy: 'user-legal-002',
      updatedAt: new Date('2024-06-16'),
    },
    {
      id: 'doc-002',
      title: 'GDPR Data Processing Agreement - Portfolio Companies',
      fileName: 'GDPR_DPA_Template.pdf',
      filePath: '/documents/gdpr_dpa_template.pdf',
      fileSize: 1234567,
      documentType: 'AGREEMENT',
      category: 'REGULATORY',
      status: 'UNDER_REVIEW',
      priority: 'HIGH',
      confidentiality: 'INTERNAL',
      description: 'Standard Data Processing Agreement template for all portfolio companies operating in EU markets.',
      summary: 'GDPR-compliant DPA template covering data processing activities, security measures, and breach notification procedures.',
      jurisdiction: 'European Union',
      governingLaw: 'GDPR Article 28',
      effectiveDate: new Date('2024-07-01'),
      expirationDate: new Date('2026-07-01'),
      renewalDate: new Date('2025-07-01'),
      regulatoryReqs: [
        { id: 'req1', regulation: 'GDPR', requirement: 'Article 28 DPA Requirements', authority: 'EU Commission', status: 'PENDING' }
      ],
      complianceStatus: 'UNDER_REVIEW',
      version: 2,
      isTemplate: true,
      createdBy: 'user-legal-003',
      createdAt: new Date('2024-06-01'),
      updatedBy: 'user-legal-003',
      updatedAt: new Date('2024-06-20'),
    },
    {
      id: 'doc-003',
      title: 'Limited Partnership Agreement - Growth Fund III',
      fileName: 'Growth_Fund_III_LPA.pdf',
      filePath: '/documents/growth_fund_iii_lpa.pdf',
      fileSize: 3789456,
      documentType: 'AGREEMENT',
      category: 'INVESTMENT',
      status: 'APPROVED',
      priority: 'CRITICAL',
      confidentiality: 'CONFIDENTIAL',
      description: 'Limited Partnership Agreement for $500M Growth Fund III with institutional investors.',
      summary: 'Fund III LPA with 2.5% management fee, 25% carry, and 8% hurdle rate.',
      jurisdiction: 'Cayman Islands',
      governingLaw: 'Cayman Islands Partnership Law',
      contractValue: 500000000,
      currency: 'USD',
      effectiveDate: new Date('2024-08-01'),
      expirationDate: new Date('2034-08-01'),
      internalOwner: 'user-gp-001',
      externalCounsel: 'Maples and Calder',
      assignedTo: 'user-legal-001',
      complianceStatus: 'COMPLIANT',
      version: 4,
      isTemplate: false,
      createdBy: 'user-gp-001',
      createdAt: new Date('2024-04-01'),
      updatedBy: 'user-legal-001',
      updatedAt: new Date('2024-07-15'),
    },
    {
      id: 'doc-004',
      title: 'SEC Form D Filing - Growth Fund III',
      fileName: 'Form_D_Growth_Fund_III.pdf',
      documentType: 'COMPLIANCE',
      category: 'REGULATORY',
      status: 'DRAFT',
      priority: 'HIGH',
      confidentiality: 'INTERNAL',
      description: 'SEC Form D notice of exempt offering for Growth Fund III private placement.',
      summary: 'Form D filing for $500M fund raising under Rule 506(b) exemption.',
      jurisdiction: 'United States',
      governingLaw: 'Securities Act of 1933',
      effectiveDate: new Date('2024-08-15'),
      regulatoryReqs: [
        { id: 'req2', regulation: 'Securities Act', requirement: 'Form D Filing', authority: 'SEC', deadline: new Date('2024-08-30'), status: 'PENDING' }
      ],
      complianceStatus: 'PENDING',
      version: 1,
      isTemplate: false,
      createdBy: 'user-legal-002',
      createdAt: new Date('2024-07-01'),
      updatedBy: 'user-legal-002',
      updatedAt: new Date('2024-07-20'),
    },
    {
      id: 'doc-005',
      title: 'Employment Agreement - Chief Technology Officer',
      fileName: 'CTO_Employment_Agreement.pdf',
      documentType: 'CONTRACT',
      category: 'OPERATIONAL',
      status: 'EXECUTED',
      priority: 'MEDIUM',
      confidentiality: 'CONFIDENTIAL',
      description: 'Employment agreement for new CTO including equity compensation and non-compete terms.',
      jurisdiction: 'California',
      governingLaw: 'California Labor Code',
      effectiveDate: new Date('2024-07-01'),
      internalOwner: 'user-hr-001',
      assignedTo: 'user-legal-003',
      complianceStatus: 'COMPLIANT',
      version: 1,
      isTemplate: false,
      createdBy: 'user-hr-001',
      createdAt: new Date('2024-06-15'),
      updatedBy: 'user-legal-003',
      updatedAt: new Date('2024-06-30'),
    },
    {
      id: 'doc-006',
      title: 'Trademark Registration Application - Company Logo',
      fileName: 'Trademark_Application.pdf',
      documentType: 'OTHER',
      category: 'CORPORATE',
      status: 'UNDER_REVIEW',
      priority: 'MEDIUM',
      confidentiality: 'INTERNAL',
      description: 'USPTO trademark application for company logo and brand marks.',
      jurisdiction: 'United States',
      governingLaw: 'Trademark Act',
      effectiveDate: new Date('2024-07-10'),
      internalOwner: 'user-marketing-001',
      assignedTo: 'user-legal-001',
      complianceStatus: 'PENDING',
      version: 1,
      isTemplate: false,
      createdBy: 'user-marketing-001',
      createdAt: new Date('2024-07-05'),
      updatedBy: 'user-legal-001',
      updatedAt: new Date('2024-07-12'),
    }
  ];

  return documents;
};

const generateMockWorkflows = (): LegalWorkflow[] => {
  return [
    {
      id: 'wf-001',
      documentId: 'doc-002',
      workflowType: 'REVIEW',
      name: 'GDPR DPA Review Process',
      description: 'Multi-stage review process for GDPR compliance verification',
      status: 'IN_PROGRESS',
      priority: 'HIGH',
      stages: [
        { id: 's1', name: 'Legal Review', status: 'COMPLETED', assignedTo: 'user-legal-001' },
        { id: 's2', name: 'Privacy Officer Review', status: 'IN_PROGRESS', assignedTo: 'user-privacy-001' },
        { id: 's3', name: 'Final Approval', status: 'PENDING', assignedTo: 'user-legal-head' }
      ],
      currentStage: 1,
      initiatedBy: 'user-legal-003',
      assignedTo: 'user-privacy-001',
      startDate: new Date('2024-06-20'),
      dueDate: new Date('2024-07-31'),
      autoAdvance: false,
      createdAt: new Date('2024-06-20'),
      updatedAt: new Date('2024-07-15'),
      document: {} as LegalDocument // Would be populated with full document data
    },
    {
      id: 'wf-002',
      documentId: 'doc-004',
      workflowType: 'COMPLIANCE_CHECK',
      name: 'SEC Form D Compliance Review',
      description: 'Compliance verification and filing preparation for SEC Form D',
      status: 'PENDING',
      priority: 'CRITICAL',
      stages: [
        { id: 's1', name: 'Document Preparation', status: 'PENDING', assignedTo: 'user-legal-002' },
        { id: 's2', name: 'Compliance Review', status: 'PENDING', assignedTo: 'user-compliance-001' },
        { id: 's3', name: 'SEC Filing', status: 'PENDING', assignedTo: 'user-legal-head' }
      ],
      currentStage: 0,
      initiatedBy: 'user-legal-002',
      assignedTo: 'user-legal-002',
      startDate: new Date('2024-07-25'),
      dueDate: new Date('2024-08-30'),
      autoAdvance: false,
      createdAt: new Date('2024-07-20'),
      updatedAt: new Date('2024-07-20'),
      document: {} as LegalDocument
    }
  ];
};

const generateMockComplianceFrameworks = (): ComplianceFramework[] => {
  return [
    {
      id: 'cf-001',
      name: 'GDPR Compliance Framework',
      description: 'Comprehensive GDPR compliance requirements for EU operations',
      frameworkType: 'REGULATORY',
      jurisdiction: 'European Union',
      authority: 'European Data Protection Board',
      version: '2.0',
      effectiveDate: new Date('2024-01-01'),
      lastUpdated: new Date('2024-06-01'),
      requirements: [
        { id: 'req1', title: 'Data Processing Agreement', description: 'Article 28 DPA with all processors', mandatory: true, status: 'COMPLIANT' },
        { id: 'req2', title: 'Privacy Impact Assessment', description: 'DPIA for high-risk processing', mandatory: true, status: 'PENDING' },
        { id: 'req3', title: 'Data Breach Procedures', description: '72-hour breach notification process', mandatory: true, status: 'COMPLIANT' }
      ],
      riskLevel: 'HIGH',
      applicability: ['Portfolio Companies', 'Fund Operations', 'LP Communications'],
      status: 'ACTIVE',
      createdBy: 'user-privacy-001',
      createdAt: new Date('2024-01-01'),
      updatedBy: 'user-privacy-001',
      updatedAt: new Date('2024-06-01'),
    },
    {
      id: 'cf-002',
      name: 'SEC Investment Adviser Compliance',
      description: 'Investment Adviser Act compliance requirements',
      frameworkType: 'REGULATORY',
      jurisdiction: 'United States',
      authority: 'Securities and Exchange Commission',
      version: '1.5',
      effectiveDate: new Date('2024-03-01'),
      lastUpdated: new Date('2024-07-01'),
      requirements: [
        { id: 'req4', title: 'Form ADV Annual Update', description: 'Annual Form ADV filing and updates', mandatory: true, deadline: new Date('2024-12-31'), status: 'PENDING' },
        { id: 'req5', title: 'Custody Rule Compliance', description: 'Rule 206(4)-2 custody requirements', mandatory: true, status: 'COMPLIANT' },
        { id: 'req6', title: 'Code of Ethics', description: 'Personal trading compliance program', mandatory: true, status: 'COMPLIANT' }
      ],
      riskLevel: 'CRITICAL',
      applicability: ['Fund Management', 'Investment Operations'],
      status: 'ACTIVE',
      createdBy: 'user-compliance-001',
      createdAt: new Date('2024-03-01'),
      updatedBy: 'user-compliance-001',
      updatedAt: new Date('2024-07-01'),
    }
  ];
};

const generateMockRiskAssessments = (): RiskAssessment[] => {
  return [
    {
      id: 'ra-001',
      documentId: 'doc-002',
      frameworkId: 'cf-001',
      title: 'GDPR Cross-Border Data Transfer Risk',
      description: 'Assessment of risks related to international data transfers under GDPR',
      assessmentType: 'COMPLIANCE',
      status: 'COMPLETED',
      riskCategory: 'REGULATORY',
      probabilityScore: 3,
      impactScore: 4,
      overallRisk: 'HIGH',
      methodology: 'Qualitative risk assessment using GDPR Article 35 guidelines',
      scenarios: [
        { id: 'sc1', scenario: 'Data transfer to non-adequate country', probability: 3, impact: 4, mitigation: 'Implement Standard Contractual Clauses' }
      ],
      mitigationPlans: [
        { id: 'mp1', strategy: 'Implement Standard Contractual Clauses for all transfers', owner: 'user-privacy-001', status: 'COMPLETED', effectiveness: 4 }
      ],
      assessmentDate: new Date('2024-06-15'),
      nextReviewDue: new Date('2024-12-15'),
      assessor: 'user-privacy-001',
      reviewer: 'user-legal-001',
      approver: 'user-legal-head',
      createdBy: 'user-privacy-001',
      createdAt: new Date('2024-06-10'),
      updatedBy: 'user-privacy-001',
      updatedAt: new Date('2024-06-16'),
    },
    {
      id: 'ra-002',
      documentId: 'doc-003',
      title: 'Fund Structure Regulatory Risk',
      description: 'Assessment of regulatory risks in fund structure and operations',
      assessmentType: 'LEGAL',
      status: 'UNDER_REVIEW',
      riskCategory: 'REGULATORY',
      probabilityScore: 2,
      impactScore: 5,
      overallRisk: 'HIGH',
      methodology: 'Comprehensive legal and regulatory analysis',
      assessmentDate: new Date('2024-07-01'),
      nextReviewDue: new Date('2025-01-01'),
      assessor: 'user-legal-001',
      reviewer: 'user-legal-head',
      createdBy: 'user-legal-001',
      createdAt: new Date('2024-06-25'),
      updatedBy: 'user-legal-001',
      updatedAt: new Date('2024-07-10'),
    }
  ];
};

const generateMockWorkflowSummaries = (workflows: LegalWorkflow[]): WorkflowSummary[] => {
  return workflows.map(workflow => ({
    id: workflow.id,
    name: workflow.name,
    documentTitle: `Document ${workflow.documentId.slice(-3)}`,
    type: workflow.workflowType,
    status: workflow.status,
    progress: workflow.status === 'COMPLETED' ? 100 : 
             workflow.status === 'IN_PROGRESS' ? (workflow.currentStage + 1) / workflow.stages.length * 100 :
             0,
    dueDate: workflow.dueDate,
    assignedTo: workflow.assignedTo,
    priority: workflow.priority,
  }));
};

const generateMockUpcomingDeadlines = (): DeadlineSummary[] => {
  const today = new Date();
  return [
    {
      id: 'deadline-001',
      title: 'SEC Form D Filing - Growth Fund III',
      type: 'COMPLIANCE',
      dueDate: new Date(today.getTime() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
      priority: 'CRITICAL',
      status: 'PENDING',
      assignedTo: 'user-legal-002',
      daysUntilDue: 5,
    },
    {
      id: 'deadline-002',
      title: 'GDPR DPA Review Completion',
      type: 'DOCUMENT',
      dueDate: new Date(today.getTime() + 16 * 24 * 60 * 60 * 1000), // 16 days from now
      priority: 'HIGH',
      status: 'IN_PROGRESS',
      assignedTo: 'user-privacy-001',
      daysUntilDue: 16,
    },
    {
      id: 'deadline-003',
      title: 'Trademark Application Response',
      type: 'EVENT',
      dueDate: new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      priority: 'MEDIUM',
      status: 'SCHEDULED',
      assignedTo: 'user-legal-001',
      daysUntilDue: 30,
    },
    {
      id: 'deadline-004',
      title: 'Fund III LPA Amendment Review',
      type: 'REMINDER',
      dueDate: new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000), // 2 days ago (overdue)
      priority: 'HIGH',
      status: 'OVERDUE',
      assignedTo: 'user-legal-001',
      daysUntilDue: -2,
    },
    {
      id: 'deadline-005',
      title: 'Annual Compliance Audit',
      type: 'COMPLIANCE',
      dueDate: new Date(today.getTime() + 45 * 24 * 60 * 60 * 1000), // 45 days from now
      priority: 'HIGH',
      status: 'SCHEDULED',
      assignedTo: 'user-compliance-001',
      daysUntilDue: 45,
    },
  ];
};

const generateMockComplianceAlerts = (): ComplianceAlert[] => {
  return [
    {
      id: 'alert-001',
      title: 'GDPR Privacy Impact Assessment Overdue',
      description: 'DPIA for new customer data processing activity is 15 days overdue. Immediate action required to maintain compliance.',
      severity: 'CRITICAL',
      type: 'DEADLINE',
      dueDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      status: 'NON_COMPLIANT',
      assignedTo: 'user-privacy-001',
      documentId: 'doc-007',
    },
    {
      id: 'alert-002',
      title: 'SEC Form ADV Annual Update Due',
      description: 'Annual Form ADV update must be filed within 30 days. Schedule review meeting and prepare amendments.',
      severity: 'HIGH',
      type: 'REQUIREMENT',
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      status: 'PENDING',
      assignedTo: 'user-compliance-001',
    },
    {
      id: 'alert-003',
      title: 'Data Breach Notification Pending',
      description: 'Data breach occurred 48 hours ago. GDPR requires notification within 72 hours of awareness.',
      severity: 'CRITICAL',
      type: 'VIOLATION',
      dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
      status: 'UNDER_REVIEW',
      assignedTo: 'user-privacy-001',
    },
  ];
};

const generateMockRecentActivity = (): ActivitySummary[] => {
  return [
    {
      id: 'activity-001',
      type: 'CREATED',
      description: 'Created new trademark application document',
      userName: 'Sarah Johnson',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      documentTitle: 'Trademark Registration Application',
      documentId: 'doc-006',
    },
    {
      id: 'activity-002',
      type: 'APPROVED',
      description: 'Approved Series A investment agreement',
      userName: 'Michael Chen',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      documentTitle: 'Series A Preferred Stock Purchase Agreement',
      documentId: 'doc-001',
    },
    {
      id: 'activity-003',
      type: 'UPDATED',
      description: 'Updated GDPR DPA template with new clauses',
      userName: 'Emma Davis',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
      documentTitle: 'GDPR Data Processing Agreement',
      documentId: 'doc-002',
    },
    {
      id: 'activity-004',
      type: 'SHARED',
      description: 'Shared employment agreement with HR team',
      userName: 'David Wilson',
      timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
      documentTitle: 'Employment Agreement - CTO',
      documentId: 'doc-005',
    },
    {
      id: 'activity-005',
      type: 'VIEWED',
      description: 'Reviewed Limited Partnership Agreement',
      userName: 'Lisa Anderson',
      timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
      documentTitle: 'Limited Partnership Agreement - Growth Fund III',
      documentId: 'doc-003',
    },
  ];
};

export async function GET() {
  try {
    const documents = generateMockLegalDocuments();
    const workflows = generateMockWorkflows();
    const complianceFrameworks = generateMockComplianceFrameworks();
    const riskAssessments = generateMockRiskAssessments();
    const workflowSummaries = generateMockWorkflowSummaries(workflows);
    const upcomingDeadlines = generateMockUpcomingDeadlines();
    const complianceAlerts = generateMockComplianceAlerts();
    const recentActivity = generateMockRecentActivity();

    const stats: LegalDashboardStats = {
      totalDocuments: documents.length,
      activeWorkflows: workflows.filter(w => w.status === 'IN_PROGRESS' || w.status === 'PENDING').length,
      upcomingDeadlines: upcomingDeadlines.filter(d => d.daysUntilDue >= 0 && d.daysUntilDue <= 30).length,
      complianceIssues: complianceAlerts.filter(a => a.severity === 'CRITICAL' || a.severity === 'HIGH').length,
      highRiskItems: riskAssessments.filter(r => r.overallRisk === 'HIGH' || r.overallRisk === 'CRITICAL').length,
      overdueReminders: upcomingDeadlines.filter(d => d.daysUntilDue < 0).length,
      recentActivity: recentActivity.length,
      documentsThisMonth: documents.filter(d => {
        const docDate = new Date(d.createdAt);
        const now = new Date();
        return docDate.getMonth() === now.getMonth() && docDate.getFullYear() === now.getFullYear();
      }).length,
    };

    const response: LegalManagementResponse = {
      documents,
      stats,
      workflowSummaries,
      upcomingDeadlines,
      complianceAlerts,
      recentActivity,
      complianceFrameworks,
      riskAssessments,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error in legal management API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch legal management data' },
      { status: 500 }
    );
  }
}