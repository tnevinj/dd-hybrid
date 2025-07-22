import { NextRequest, NextResponse } from 'next/server';
import { UnifiedWorkspaceView } from '@/types/workspace';

// Mock unified view data - combines workspace data with related system data
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const workspaceId = params.id;
    
    if (workspaceId !== '1') {
      return NextResponse.json(
        { error: 'Workspace not found' },
        { status: 404 }
      );
    }
    
    // Mock unified view with cross-system data
    const unifiedView: UnifiedWorkspaceView = {
      workspace: {
        // ... workspace data from main route
        id: '1',
        title: 'TechCorp Due Diligence',
        description: 'Comprehensive due diligence for TechCorp acquisition',
        type: 'DUE_DILIGENCE',
        status: 'ACTIVE',
        phase: 'EXECUTION',
        dealName: 'TechCorp Acquisition',
        dealId: 'deal-1',
        screeningOpportunityId: 'screen-1',
        ddProjectId: 'dd-1',
        createdBy: 'user-1',
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-20'),
        targetCompletionDate: new Date('2024-02-15'),
        overallProgress: 65,
        completedComponents: 8,
        totalComponents: 12,
        participants: [],
        analysisComponents: [],
        evidence: [],
        comments: [],
        activities: []
      },
      
      // Data from Deal Screening system
      screeningData: {
        id: 'screen-1',
        dealName: 'TechCorp Acquisition',
        sector: 'Enterprise Software',
        stage: 'Series B',
        screeningScore: 8.5,
        keyMetrics: {
          revenue: 15000000, // $15M ARR
          growth: 0.45, // 45% YoY
          grossMargin: 0.82, // 82%
          burnRate: 800000 // $800K monthly
        },
        initialAssessment: 'Strong product-market fit with impressive growth metrics',
        riskFlags: ['Customer concentration', 'Competitive pressure'],
        recommendation: 'PROCEED_TO_DD',
        completedAt: new Date('2024-01-10')
      },
      
      // Data from Due Diligence system
      ddData: {
        id: 'dd-1',
        projectName: 'TechCorp DD Project',
        leadAnalyst: 'John Smith',
        status: 'IN_PROGRESS',
        completionPercentage: 65,
        keyFindings: [
          {
            category: 'Financial',
            severity: 'LOW',
            finding: 'Healthy unit economics with strong gross margins'
          },
          {
            category: 'Market',
            severity: 'MEDIUM',
            finding: 'Competitive landscape intensifying with new AI-native entrants'
          },
          {
            category: 'Technology',
            severity: 'LOW',
            finding: 'Modern, scalable architecture with good security practices'
          }
        ],
        riskRegister: [
          {
            id: 'risk-1',
            category: 'Market',
            description: 'New competitive threats from AI-native solutions',
            probability: 'MEDIUM',
            impact: 'HIGH',
            mitigation: 'Accelerate AI feature development roadmap'
          },
          {
            id: 'risk-2',
            category: 'Operational',
            description: 'Key person risk with CTO departure',
            probability: 'LOW',
            impact: 'MEDIUM',
            mitigation: 'Technical leadership succession planning'
          }
        ],
        nextMilestones: [
          {
            milestone: 'Management presentation',
            dueDate: new Date('2024-01-28'),
            responsible: 'John Smith'
          },
          {
            milestone: 'Legal review completion',
            dueDate: new Date('2024-02-05'),
            responsible: 'Legal Team'
          }
        ]
      },
      
      // External integrations status
      externalIntegrations: [
        {
          systemName: 'Deal Screening',
          status: 'connected',
          lastSync: new Date('2024-01-21T10:30:00Z'),
          dataCount: 1
        },
        {
          systemName: 'Due Diligence',
          status: 'connected', 
          lastSync: new Date('2024-01-21T09:15:00Z'),
          dataCount: 15
        },
        {
          systemName: 'Document Management',
          status: 'connected',
          lastSync: new Date('2024-01-21T11:45:00Z'),
          dataCount: 42
        },
        {
          systemName: 'Financial Models',
          status: 'connected',
          lastSync: new Date('2024-01-20T16:20:00Z'),
          dataCount: 3
        },
        {
          systemName: 'CRM',
          status: 'error',
          lastSync: new Date('2024-01-19T14:30:00Z'),
          dataCount: 0
        }
      ]
    };
    
    return NextResponse.json(unifiedView);
    
  } catch (error) {
    console.error('Error fetching unified workspace view:', error);
    return NextResponse.json(
      { error: 'Failed to fetch unified workspace view' },
      { status: 500 }
    );
  }
}