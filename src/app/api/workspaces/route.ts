import { NextRequest, NextResponse } from 'next/server';
import { InvestmentWorkspace, WorkspaceCreateRequest, WorkspaceFilters } from '@/types/workspace';

// Mock data for development - replace with actual database queries
const mockWorkspaces: InvestmentWorkspace[] = [
  {
    id: '1',
    title: 'TechCorp Due Diligence',
    description: 'Comprehensive due diligence for TechCorp acquisition',
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
    tags: ['saas', 'b2b', 'growth'],
    participants: [
      { id: '1', userId: 'user-1', role: 'LEAD', joinedAt: new Date('2024-01-15') },
      { id: '2', userId: 'user-2', role: 'ANALYST', joinedAt: new Date('2024-01-16') },
      { id: '3', userId: 'user-3', role: 'REVIEWER', joinedAt: new Date('2024-01-17') }
    ],
    analysisComponents: [
      {
        id: '1',
        type: 'Financial Analysis',
        title: 'Revenue Model Analysis',
        description: 'Analyze recurring revenue streams and growth drivers',
        status: 'COMPLETED',
        progress: 100,
        assignedTo: 'user-2',
        completedAt: new Date('2024-01-18'),
        evidence: []
      },
      {
        id: '2',
        type: 'Market Analysis',
        title: 'Competitive Landscape',
        description: 'Map competitive positioning and market dynamics',
        status: 'IN_PROGRESS',
        progress: 70,
        assignedTo: 'user-1',
        dueDate: new Date('2024-01-25'),
        evidence: []
      },
      {
        id: '3',
        type: 'Technology Review',
        title: 'Technical Architecture Assessment',
        description: 'Evaluate technology stack and scalability',
        status: 'NOT_STARTED',
        progress: 0,
        assignedTo: 'user-3',
        dueDate: new Date('2024-01-30'),
        evidence: []
      }
    ],
    evidence: [
      {
        id: '1',
        type: 'DOCUMENT',
        title: 'Financial Statements (3 years)',
        description: 'Audited financial statements',
        attachedBy: 'user-1',
        attachedAt: new Date('2024-01-16'),
        relevanceScore: 0.95
      },
      {
        id: '2',
        type: 'INTERVIEW',
        title: 'CEO Interview Notes',
        description: 'Strategic vision and market outlook',
        attachedBy: 'user-2',
        attachedAt: new Date('2024-01-18'),
        relevanceScore: 0.88
      }
    ],
    comments: [
      {
        id: '1',
        content: 'Initial financial review looks promising. Revenue growth is strong.',
        authorId: 'user-1',
        authorName: 'John Analyst',
        createdAt: new Date('2024-01-17')
      },
      {
        id: '2',
        content: 'Need to dive deeper into customer concentration risk.',
        authorId: 'user-2',
        authorName: 'Sarah Manager',
        createdAt: new Date('2024-01-19'),
        parentId: '1'
      }
    ],
    activities: [
      {
        id: '1',
        type: 'CREATED',
        description: 'Workspace created',
        userId: 'user-1',
        userName: 'John Analyst',
        timestamp: new Date('2024-01-15')
      },
      {
        id: '2',
        type: 'COMPONENT_UPDATED',
        description: 'Completed Revenue Model Analysis',
        userId: 'user-2',
        userName: 'Sarah Manager',
        timestamp: new Date('2024-01-18')
      },
      {
        id: '3',
        type: 'EVIDENCE_ADDED',
        description: 'Added CEO Interview Notes',
        userId: 'user-2',
        userName: 'Sarah Manager',
        timestamp: new Date('2024-01-18')
      }
    ],
    aiRecommendations: [
      {
        id: '1',
        type: 'suggestion',
        priority: 'high',
        title: 'Similar Deal Pattern',
        description: 'This deal resembles CloudCorp from Q3 2023',
        confidence: 0.87
      }
    ]
  },
  {
    id: '2',
    title: 'HealthTech Screening',
    description: 'Initial screening for HealthTech opportunity',
    type: 'SCREENING',
    status: 'REVIEW',
    phase: 'REVIEW',
    dealName: 'HealthTech Series B',
    dealId: 'deal-2',
    createdBy: 'user-3',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-22'),
    targetCompletionDate: new Date('2024-01-25'),
    overallProgress: 90,
    completedComponents: 5,
    totalComponents: 6,
    sector: 'Healthcare',
    region: 'Europe',
    investmentSize: '$10M-25M',
    tags: ['healthtech', 'b2b', 'early-stage'],
    participants: [
      { id: '4', userId: 'user-3', role: 'LEAD', joinedAt: new Date('2024-01-10') },
      { id: '5', userId: 'user-1', role: 'REVIEWER', joinedAt: new Date('2024-01-12') }
    ],
    analysisComponents: [
      {
        id: '4',
        type: 'Market Sizing',
        title: 'TAM/SAM Analysis',
        description: 'Total addressable market assessment',
        status: 'COMPLETED',
        progress: 100,
        completedAt: new Date('2024-01-20'),
        evidence: []
      }
    ],
    evidence: [],
    comments: [],
    activities: []
  }
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Parse filters from query parameters
    const filters: WorkspaceFilters = {};
    
    const status = searchParams.get('status');
    if (status) {
      filters.status = status.split(',') as any[];
    }
    
    const type = searchParams.get('type');
    if (type) {
      filters.type = type.split(',') as any[];
    }
    
    const search = searchParams.get('search');
    if (search) {
      filters.search = search;
    }
    
    const assignedToMe = searchParams.get('assignedToMe');
    if (assignedToMe === 'true') {
      filters.assignedToMe = true;
    }
    
    // Get workspaces from SQLite database
    const { WorkspaceService } = await import('@/lib/services/database');
    const dbWorkspaces = WorkspaceService.getAll();
    
    // Convert database workspaces to API format
    let filteredWorkspaces = dbWorkspaces.map(ws => ({
      id: ws.id,
      name: ws.name,
      type: ws.type,
      status: ws.status,
      sector: ws.sector,
      geography: ws.geography,
      stage: ws.stage,
      priority: ws.priority || 'medium',
      dealValue: ws.deal_value, // In cents
      progress: ws.progress,
      team: ws.team_members,
      riskRating: ws.risk_rating,
      updatedAt: ws.updated_at,
      createdAt: ws.created_at,
      metadata: ws.metadata // Include metadata from database
    }));
    
    // Apply filters
    if (filters.status?.length) {
      filteredWorkspaces = filteredWorkspaces.filter(w => 
        filters.status!.includes(w.status)
      );
    }
    
    if (filters.type?.length) {
      filteredWorkspaces = filteredWorkspaces.filter(w => 
        filters.type!.includes(w.type)
      );
    }
    
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filteredWorkspaces = filteredWorkspaces.filter(w => 
        w.name.toLowerCase().includes(searchLower) ||
        w.sector?.toLowerCase().includes(searchLower) ||
        w.stage?.toLowerCase().includes(searchLower)
      );
    }
    
    return NextResponse.json({
      data: filteredWorkspaces,
      total: filteredWorkspaces.length,
      filters: filters
    });
    
  } catch (error) {
    console.error('Error fetching workspaces:', error);
    return NextResponse.json(
      { error: 'Failed to fetch workspaces' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: WorkspaceCreateRequest = await request.json();
    
    // Validate required fields
    if (!body.title || !body.type) {
      return NextResponse.json(
        { error: 'Title and type are required' },
        { status: 400 }
      );
    }
    
    // Create new workspace (mock implementation)
    const newWorkspace: InvestmentWorkspace = {
      id: `workspace-${Date.now()}`,
      title: body.title,
      description: body.description,
      type: body.type,
      status: 'DRAFT',
      phase: 'PLANNING',
      dealName: body.dealName,
      dealId: body.dealId,
      screeningOpportunityId: undefined,
      ddProjectId: undefined,
      structuringProjectId: undefined,
      createdBy: 'current-user', // Replace with actual user ID from session
      createdAt: new Date(),
      updatedAt: new Date(),
      targetCompletionDate: body.targetCompletionDate,
      overallProgress: 0,
      completedComponents: 0,
      totalComponents: 0,
      tags: body.tags,
      participants: body.participants?.map(p => ({
        id: `participant-${Date.now()}-${Math.random()}`,
        userId: p.userId,
        role: p.role,
        joinedAt: new Date()
      })) || [
        {
          id: `participant-${Date.now()}`,
          userId: 'current-user',
          role: 'LEAD',
          joinedAt: new Date()
        }
      ],
      analysisComponents: [],
      evidence: [],
      comments: [],
      activities: [
        {
          id: `activity-${Date.now()}`,
          type: 'CREATED',
          description: `Workspace "${body.title}" created`,
          userId: 'current-user',
          userName: 'Current User',
          timestamp: new Date()
        }
      ]
    };
    
    // In a real implementation, save to database here
    // await prisma.investmentWorkspace.create({ data: newWorkspace });
    
    return NextResponse.json(newWorkspace, { status: 201 });
    
  } catch (error) {
    console.error('Error creating workspace:', error);
    return NextResponse.json(
      { error: 'Failed to create workspace' },
      { status: 500 }
    );
  }
}