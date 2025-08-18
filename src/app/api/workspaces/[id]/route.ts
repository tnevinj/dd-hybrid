import { NextRequest, NextResponse } from 'next/server';
import { InvestmentWorkspace, WorkspaceUpdateRequest, UnifiedWorkspaceView } from '@/types/workspace';
import { UnifiedWorkspaceDataService } from '@/lib/data/unified-workspace-data';

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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: workspaceId } = await params;
    
    // Try to get workspace from SQLite database first
    const { WorkspaceService } = await import('@/lib/services/database');
    const dbWorkspace = WorkspaceService.getById(workspaceId);
    
    if (dbWorkspace) {
      // Convert database workspace to InvestmentWorkspace format
      const workspace: InvestmentWorkspace = {
        id: dbWorkspace.id,
        title: dbWorkspace.name,
        description: `${dbWorkspace.sector || 'General'} ${dbWorkspace.type} project`,
        type: dbWorkspace.type === 'deal' ? 'DUE_DILIGENCE' :
              dbWorkspace.type === 'portfolio' ? 'MONITORING' :
              dbWorkspace.type === 'analysis' ? 'SCREENING' : 'UNIFIED',
        status: dbWorkspace.status === 'active' ? 'ACTIVE' :
                dbWorkspace.status === 'review' ? 'REVIEW' :
                dbWorkspace.status === 'draft' ? 'DRAFT' :
                dbWorkspace.status === 'completed' ? 'COMPLETED' : 'ACTIVE',
        phase: 'EXECUTION',
        dealName: `${dbWorkspace.name}`,
        dealId: `deal-${dbWorkspace.id}`,
        createdBy: 'user-1',
        createdAt: new Date(dbWorkspace.created_at),
        updatedAt: new Date(dbWorkspace.updated_at),
        targetCompletionDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        overallProgress: dbWorkspace.progress || 0,
        completedComponents: Math.floor((dbWorkspace.team_members?.length || 1) * ((dbWorkspace.progress || 0) / 100)),
        totalComponents: dbWorkspace.team_members?.length || 3,
        sector: dbWorkspace.sector || 'Technology',
        region: dbWorkspace.geography || 'North America',
        investmentSize: dbWorkspace.deal_value ? `$${Math.round((dbWorkspace.deal_value / 100) / 1000000)}M` : '$50M-100M',
        tags: [
          dbWorkspace.sector?.toLowerCase() || 'technology',
          dbWorkspace.stage || 'growth',
          dbWorkspace.type.replace('-', '')
        ],
        participants: (dbWorkspace.team_members || ['Team Lead']).map((member, index) => ({
          id: `${index + 1}`,
          userId: `user-${index + 1}`,
          role: index === 0 ? 'LEAD' : index === 1 ? 'ANALYST' : index === 2 ? 'REVIEWER' : 'OBSERVER',
          joinedAt: new Date(dbWorkspace.created_at),
          lastActive: new Date(dbWorkspace.updated_at)
        })),
        analysisComponents: [
          {
            id: '1',
            type: 'Financial Analysis',
            title: 'Financial Model Analysis',
            description: 'Analysis of financial performance and projections',
            status: (dbWorkspace.progress || 0) > 80 ? 'COMPLETED' : (dbWorkspace.progress || 0) > 40 ? 'IN_PROGRESS' : 'NOT_STARTED',
            progress: Math.min((dbWorkspace.progress || 0) + 10, 100),
            assignedTo: 'user-2',
            evidence: []
          },
          {
            id: '2', 
            type: 'Market Analysis',
            title: 'Market Assessment',
            description: 'Market size and competitive analysis',
            status: (dbWorkspace.progress || 0) > 60 ? 'IN_PROGRESS' : 'NOT_STARTED',
            progress: Math.max((dbWorkspace.progress || 0) - 20, 0),
            assignedTo: 'user-1',
            evidence: []
          }
        ],
        evidence: [],
        comments: [],
        activities: [
          {
            id: '1',
            type: 'CREATED',
            description: `Workspace created for ${dbWorkspace.name}`,
            userId: 'user-1',
            userName: dbWorkspace.team_members?.[0] || 'Team Lead',
            timestamp: new Date(dbWorkspace.created_at)
          }
        ],
        aiRecommendations: [],
        aiInsights: []
      };
      
      return NextResponse.json(workspace);
    }
    
    // Fallback to unified data service for backward compatibility
    const allProjects = UnifiedWorkspaceDataService.getAllProjects();
    const targetProject = allProjects.find(p => {
      // Try both formats: with and without 'workspace-proj-' prefix
      return p.id === workspaceId || 
             p.id === `workspace-proj-${workspaceId}` ||
             p.id.replace('workspace-proj-', '') === workspaceId;
    });
    
    if (!targetProject) {
      return NextResponse.json(
        { error: 'Workspace not found' },
        { status: 404 }
      );
    }
    
    // Convert unified project to workspace format
    const workspace: InvestmentWorkspace = {
      id: workspaceId,
      title: targetProject.name,
      description: `${targetProject.displayType} workspace for ${targetProject.name}`,
      type: targetProject.type === 'due-diligence' ? 'DUE_DILIGENCE' :
            targetProject.type === 'ic-preparation' ? 'IC_PREPARATION' :
            targetProject.type === 'deal-screening' ? 'SCREENING' :
            targetProject.type === 'portfolio-monitoring' ? 'MONITORING' : 'UNIFIED',
      status: targetProject.status === 'active' ? 'ACTIVE' :
              targetProject.status === 'review' ? 'REVIEW' :
              targetProject.status === 'draft' ? 'DRAFT' :
              targetProject.status === 'completed' ? 'COMPLETED' : 'ACTIVE',
      phase: 'EXECUTION',
      dealName: `${targetProject.name} Deal`,
      dealId: `deal-${workspaceId}`,
      createdBy: 'user-1',
      createdAt: new Date(targetProject.lastActivity.getTime() - 7 * 24 * 60 * 60 * 1000), // 1 week before last activity
      updatedAt: targetProject.lastActivity,
      targetCompletionDate: targetProject.deadline || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      overallProgress: targetProject.progress,
      completedComponents: Math.floor(targetProject.workProducts * (targetProject.progress / 100)),
      totalComponents: targetProject.workProducts,
      sector: targetProject.metadata.sector || 'Technology',
      region: targetProject.metadata.geography || 'North America',
      investmentSize: targetProject.metadata.dealValue ? `$${(targetProject.metadata.dealValue / 1000000).toFixed(0)}M` : '$50M-100M',
      tags: [
        targetProject.metadata.sector?.toLowerCase() || 'technology',
        targetProject.metadata.stage || 'growth',
        targetProject.type.replace('-', '')
      ],
      participants: targetProject.teamMembers.map((member, index) => ({
        id: `${index + 1}`,
        userId: `user-${index + 1}`,
        role: index === 0 ? 'LEAD' : index === 1 ? 'ANALYST' : index === 2 ? 'REVIEWER' : 'OBSERVER',
        joinedAt: new Date(targetProject.lastActivity.getTime() - (targetProject.teamMembers.length - index) * 24 * 60 * 60 * 1000),
        lastActive: new Date(targetProject.lastActivity.getTime() - index * 60 * 60 * 1000)
      })),
      analysisComponents: [
        {
          id: '1',
          type: 'Financial Analysis',
          title: 'Revenue Model Analysis',
          description: 'Analysis of revenue streams and financial performance',
          status: targetProject.progress > 80 ? 'COMPLETED' : targetProject.progress > 40 ? 'IN_PROGRESS' : 'NOT_STARTED',
          progress: Math.min(targetProject.progress + 10, 100),
          assignedTo: 'user-2',
          ...(targetProject.progress > 80 ? { completedAt: new Date(targetProject.lastActivity.getTime() - 24 * 60 * 60 * 1000) } : {}),
          findings: targetProject.progress > 40 ? 'Analysis shows strong fundamentals and growth potential.' : undefined,
          evidence: []
        },
        {
          id: '2',
          type: 'Market Analysis',
          title: 'Competitive Assessment',
          description: 'Market positioning and competitive landscape analysis',
          status: targetProject.progress > 60 ? 'IN_PROGRESS' : 'NOT_STARTED',
          progress: Math.max(targetProject.progress - 20, 0),
          assignedTo: 'user-1',
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          findings: targetProject.progress > 60 ? 'Market conditions favorable for this investment.' : undefined,
          evidence: []
        }
      ],
      evidence: [],
      comments: [],
      activities: [
        {
          id: '1',
          type: 'CREATED',
          description: `Workspace created for ${targetProject.name}`,
          userId: 'user-1',
          userName: targetProject.teamMembers[0] || 'Team Lead',
          timestamp: new Date(targetProject.lastActivity.getTime() - 7 * 24 * 60 * 60 * 1000)
        },
        {
          id: '2',
          type: 'STATUS_CHANGED',
          description: `Status updated to ${targetProject.displayStatus}`,
          userId: 'user-1',
          userName: targetProject.teamMembers[0] || 'Team Lead',
          timestamp: targetProject.lastActivity
        }
      ],
      aiRecommendations: [],
      aiInsights: targetProject.aiData?.insights?.map(insight => insight.summary) || []
    };
    
    return NextResponse.json(workspace);
    
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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: workspaceId } = await params;
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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: workspaceId } = await params;
    
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