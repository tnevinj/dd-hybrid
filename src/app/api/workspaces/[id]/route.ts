import { NextRequest, NextResponse } from 'next/server';
import { InvestmentWorkspace, WorkspaceUpdateRequest, UnifiedWorkspaceView } from '@/types/workspace';

// Mock workspace data - in real implementation, fetch from database
const mockWorkspace: InvestmentWorkspace = {
  id: '1',
  title: 'TechCorp Due Diligence',
  description: 'Comprehensive due diligence for TechCorp acquisition targeting enterprise SaaS market',
  type: 'DUE_DILIGENCE',
  status: 'ACTIVE',
  phase: 'EXECUTION',
  dealName: 'TechCorp Acquisition',
  dealId: 'deal-1',
  createdBy: 'user-1',
  createdAt: new Date('2024-01-15'),
  updatedAt: new Date('2024-01-20'),
  targetCompletionDate: new Date('2024-02-15'),
  overallProgress: 65,
  completedComponents: 8,
  totalComponents: 12,
  sector: 'Technology',
  region: 'North America',
  investmentSize: '$50M-100M',
  tags: ['saas', 'b2b', 'growth', 'enterprise'],
  participants: [
    { id: '1', userId: 'user-1', role: 'LEAD', joinedAt: new Date('2024-01-15'), lastActive: new Date('2024-01-21') },
    { id: '2', userId: 'user-2', role: 'ANALYST', joinedAt: new Date('2024-01-16'), lastActive: new Date('2024-01-20') },
    { id: '3', userId: 'user-3', role: 'REVIEWER', joinedAt: new Date('2024-01-17'), lastActive: new Date('2024-01-19') },
    { id: '4', userId: 'user-4', role: 'OBSERVER', joinedAt: new Date('2024-01-18') }
  ],
  analysisComponents: [
    {
      id: '1',
      type: 'Financial Analysis',
      title: 'Revenue Model Analysis',
      description: 'Deep dive into recurring revenue streams, unit economics, and growth drivers',
      status: 'COMPLETED',
      progress: 100,
      assignedTo: 'user-2',
      completedAt: new Date('2024-01-18'),
      findings: 'Strong ARR growth (45% YoY), healthy unit economics with LTV/CAC ratio of 4.2x, expanding gross margins.',
      evidence: [
        {
          id: '1',
          type: 'DOCUMENT',
          title: 'Financial Model v3.2',
          description: 'Updated financial projections with management input',
          attachedBy: 'user-2',
          attachedAt: new Date('2024-01-18'),
          relevanceScore: 0.98,
          reliabilityScore: 0.92
        }
      ]
    },
    {
      id: '2',
      type: 'Market Analysis',
      title: 'Competitive Landscape Assessment',
      description: 'Comprehensive analysis of competitive positioning and market dynamics',
      status: 'IN_PROGRESS',
      progress: 70,
      assignedTo: 'user-1',
      dueDate: new Date('2024-01-25'),
      findings: 'Differentiated product in growing market. Main competitors: Salesforce, HubSpot. Emerging threat from AI-native solutions.',
      evidence: [
        {
          id: '2',
          type: 'EXTERNAL_DATA',
          title: 'Gartner Market Report 2024',
          description: 'Industry analysis and competitive benchmarking',
          attachedBy: 'user-1',
          attachedAt: new Date('2024-01-20'),
          relevanceScore: 0.85,
          reliabilityScore: 0.95
        }
      ]
    },
    {
      id: '3',
      type: 'Technology Review',
      title: 'Technical Architecture Assessment',
      description: 'Evaluate technology stack, scalability, and technical risks',
      status: 'IN_PROGRESS',
      progress: 40,
      assignedTo: 'user-3',
      dueDate: new Date('2024-01-30'),
      evidence: []
    },
    {
      id: '4',
      type: 'Management Assessment',
      title: 'Leadership Team Evaluation',
      description: 'Assessment of management team capabilities and track record',
      status: 'NOT_STARTED',
      progress: 0,
      assignedTo: 'user-1',
      dueDate: new Date('2024-02-05'),
      evidence: []
    },
    {
      id: '5',
      type: 'Legal Review',
      title: 'Legal and Compliance Analysis',
      description: 'Review of legal structure, compliance, and regulatory risks',
      status: 'NOT_STARTED',
      progress: 0,
      dueDate: new Date('2024-02-10'),
      evidence: []
    },
    {
      id: '6',
      type: 'ESG Analysis',
      title: 'Environmental, Social & Governance',
      description: 'ESG risk assessment and impact evaluation',
      status: 'UNDER_REVIEW',
      progress: 85,
      assignedTo: 'user-4',
      evidence: []
    }
  ],
  evidence: [
    {
      id: '1',
      type: 'DOCUMENT',
      title: 'Audited Financial Statements (3 years)',
      description: 'Complete financial statements 2021-2023',
      attachedBy: 'user-1',
      attachedAt: new Date('2024-01-16'),
      relevanceScore: 0.95,
      reliabilityScore: 0.98
    },
    {
      id: '2',
      type: 'INTERVIEW',
      title: 'CEO Interview - Strategic Vision',
      description: 'In-depth discussion on company strategy and market outlook',
      attachedBy: 'user-2',
      attachedAt: new Date('2024-01-18'),
      relevanceScore: 0.88,
      reliabilityScore: 0.80
    },
    {
      id: '3',
      type: 'MODEL',
      title: 'DCF Valuation Model',
      description: 'Discounted cash flow analysis with multiple scenarios',
      attachedBy: 'user-1',
      attachedAt: new Date('2024-01-19'),
      relevanceScore: 0.92,
      reliabilityScore: 0.85
    },
    {
      id: '4',
      type: 'EXTERNAL_DATA',
      title: 'Industry Growth Projections',
      description: 'Third-party market research and growth forecasts',
      attachedBy: 'user-3',
      attachedAt: new Date('2024-01-20'),
      relevanceScore: 0.75,
      reliabilityScore: 0.90
    }
  ],
  comments: [
    {
      id: '1',
      content: 'Initial financial review completed. Revenue quality is excellent with 95% recurring revenue.',
      authorId: 'user-2',
      authorName: 'Sarah Chen',
      createdAt: new Date('2024-01-17'),
      replies: [
        {
          id: '2',
          content: 'Great work! What about the customer concentration risk we discussed?',
          authorId: 'user-1',
          authorName: 'John Smith',
          createdAt: new Date('2024-01-18'),
          parentId: '1'
        },
        {
          id: '3',
          content: 'Top 10 customers represent 35% of revenue, which is reasonable for this stage.',
          authorId: 'user-2',
          authorName: 'Sarah Chen',
          createdAt: new Date('2024-01-18'),
          parentId: '1'
        }
      ]
    },
    {
      id: '4',
      content: 'Market analysis progressing well. Competitive landscape is favorable.',
      authorId: 'user-1',
      authorName: 'John Smith',
      createdAt: new Date('2024-01-20')
    },
    {
      id: '5',
      content: 'ESG assessment nearly complete. Strong governance practices in place.',
      authorId: 'user-4',
      authorName: 'Mike Johnson',
      createdAt: new Date('2024-01-21')
    }
  ],
  activities: [
    {
      id: '1',
      type: 'CREATED',
      description: 'Workspace created for TechCorp Due Diligence',
      userId: 'user-1',
      userName: 'John Smith',
      timestamp: new Date('2024-01-15')
    },
    {
      id: '2',
      type: 'MEMBER_ADDED',
      description: 'Sarah Chen added as Analyst',
      userId: 'user-1',
      userName: 'John Smith',
      timestamp: new Date('2024-01-16')
    },
    {
      id: '3',
      type: 'EVIDENCE_ADDED',
      description: 'Uploaded financial statements',
      userId: 'user-1',
      userName: 'John Smith',
      timestamp: new Date('2024-01-16')
    },
    {
      id: '4',
      type: 'COMPONENT_UPDATED',
      description: 'Completed Revenue Model Analysis',
      userId: 'user-2',
      userName: 'Sarah Chen',
      timestamp: new Date('2024-01-18')
    },
    {
      id: '5',
      type: 'EVIDENCE_ADDED',
      description: 'Added CEO interview notes',
      userId: 'user-2',
      userName: 'Sarah Chen',
      timestamp: new Date('2024-01-18')
    },
    {
      id: '6',
      type: 'COMMENTED',
      description: 'Commented on financial analysis results',
      userId: 'user-1',
      userName: 'John Smith',
      timestamp: new Date('2024-01-18')
    },
    {
      id: '7',
      type: 'EVIDENCE_ADDED',
      description: 'Added DCF valuation model',
      userId: 'user-1',
      userName: 'John Smith',
      timestamp: new Date('2024-01-19')
    },
    {
      id: '8',
      type: 'STATUS_CHANGED',
      description: 'Changed ESG Analysis status to Under Review',
      userId: 'user-4',
      userName: 'Mike Johnson',
      timestamp: new Date('2024-01-21')
    }
  ],
  aiRecommendations: [
    {
      id: '1',
      type: 'suggestion',
      priority: 'high',
      title: 'Similar Deal Pattern Detected',
      description: 'This deal has 87% similarity to CloudCorp acquisition from Q3 2023, which was successful.',
      confidence: 0.87,
      reasoning: 'Both are B2B SaaS companies with similar revenue profiles and market positioning.',
      actions: [
        { label: 'View Comparison', action: 'VIEW_DEAL_COMPARISON', params: { dealId: 'cloudcorp-2023' } },
        { label: 'Apply Template', action: 'APPLY_TEMPLATE', params: { templateId: 'cloudcorp-dd' } }
      ]
    },
    {
      id: '2',
      type: 'automation',
      priority: 'medium',
      title: 'Automation Opportunity',
      description: 'I can automate customer reference checks and financial ratio calculations.',
      confidence: 0.92,
      actions: [
        { label: 'Review Tasks', action: 'REVIEW_AUTOMATION' },
        { label: 'Auto-Execute', action: 'EXECUTE_AUTOMATION' }
      ]
    },
    {
      id: '3',
      type: 'insight',
      priority: 'medium',
      title: 'Risk Alert',
      description: 'Customer concentration appears high based on preliminary data. Recommend deeper analysis.',
      confidence: 0.78,
      actions: [
        { label: 'Deep Dive', action: 'CREATE_RISK_ANALYSIS' },
        { label: 'Add to Findings', action: 'ADD_FINDING' }
      ]
    }
  ],
  aiInsights: [
    'Revenue growth trajectory suggests strong product-market fit',
    'Management team has successful track record in similar exits',
    'Technology stack is modern and scalable for projected growth',
    'Market timing appears favorable with increasing enterprise adoption'
  ]
};

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const workspaceId = params.id;
    
    // In real implementation, fetch from database
    // const workspace = await prisma.investmentWorkspace.findUnique({
    //   where: { id: workspaceId },
    //   include: { participants: true, analysisComponents: true, evidence: true, comments: true, activities: true }
    // });
    
    if (workspaceId !== '1') {
      return NextResponse.json(
        { error: 'Workspace not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(mockWorkspace);
    
  } catch (error) {
    console.error('Error fetching workspace:', error);
    return NextResponse.json(
      { error: 'Failed to fetch workspace' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const workspaceId = params.id;
    const updates: WorkspaceUpdateRequest = await request.json();
    
    // In real implementation, update in database
    // const updatedWorkspace = await prisma.investmentWorkspace.update({
    //   where: { id: workspaceId },
    //   data: updates
    // });
    
    if (workspaceId !== '1') {
      return NextResponse.json(
        { error: 'Workspace not found' },
        { status: 404 }
      );
    }
    
    // Mock update
    const updatedWorkspace = {
      ...mockWorkspace,
      ...updates,
      updatedAt: new Date()
    };
    
    return NextResponse.json(updatedWorkspace);
    
  } catch (error) {
    console.error('Error updating workspace:', error);
    return NextResponse.json(
      { error: 'Failed to update workspace' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const workspaceId = params.id;
    
    // In real implementation, soft delete or hard delete
    // await prisma.investmentWorkspace.update({
    //   where: { id: workspaceId },
    //   data: { status: 'ARCHIVED' }
    // });
    
    if (workspaceId !== '1') {
      return NextResponse.json(
        { error: 'Workspace not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error('Error deleting workspace:', error);
    return NextResponse.json(
      { error: 'Failed to delete workspace' },
      { status: 500 }
    );
  }
}