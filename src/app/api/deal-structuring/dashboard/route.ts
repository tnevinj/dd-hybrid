import { NextRequest, NextResponse } from 'next/server';
import { 
  DealStructuringProject, 
  DealStructuringMetrics, 
  DealStructuringActivity, 
  DealStructuringDeadline 
} from '@/types/deal-structuring';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const includeDetails = searchParams.get('includeDetails') === 'true';

    // Mock data - replace with actual database queries
    const metrics: DealStructuringMetrics = {
      activeDeals: 3,
      totalValue: 450000000,
      averageProgress: 67,
      upcomingDeadlines: 5,
      completedThisMonth: 2,
      pendingApprovals: 1
    };

    const deals: DealStructuringProject[] = [
      {
        id: '1',
        name: 'TechCorp Secondary',
        type: 'SINGLE_ASSET_CONTINUATION',
        stage: 'STRUCTURING',
        targetValue: 150000000,
        currentValuation: 145000000,
        progress: 75,
        team: [
          { id: '1', name: 'Sarah Chen', role: 'Lead Analyst' },
          { id: '2', name: 'Michael Park', role: 'Vice President' }
        ],
        lastUpdated: new Date().toISOString(),
        keyMetrics: {
          irr: 18.5,
          multiple: 2.3,
          paybackPeriod: 4.2,
          leverage: 3.5,
          equityContribution: 45000000
        },
        riskLevel: 'medium',
        nextMilestone: 'Financial Model Review',
        aiRecommendations: [
          {
            id: 'rec-1',
            type: 'suggestion',
            priority: 'high',
            title: 'Similar Deal Pattern Detected',
            description: 'This deal resembles CloudCo from Q2 2023. Consider using that DD template.',
            actions: [
              { label: 'Use Template', action: 'APPLY_TEMPLATE', params: { templateId: 'cloudco-2023' } }
            ],
            confidence: 0.87
          }
        ]
      },
      {
        id: '2', 
        name: 'GreenEnergy Fund II',
        type: 'MULTI_ASSET_CONTINUATION',
        stage: 'DUE_DILIGENCE',
        targetValue: 200000000,
        progress: 45,
        team: [
          { id: '3', name: 'Emma Rodriguez', role: 'Director' },
          { id: '4', name: 'David Kim', role: 'Associate' }
        ],
        lastUpdated: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        keyMetrics: {
          irr: 22.1,
          multiple: 2.8,
          paybackPeriod: 3.8,
          leverage: 2.9,
          equityContribution: 70000000
        },
        riskLevel: 'low',
        nextMilestone: 'Management Presentation'
      },
      {
        id: '3',
        name: 'HealthTech Acquisition',
        type: 'LBO_STRUCTURE',
        stage: 'INVESTMENT_COMMITTEE',
        targetValue: 100000000,
        progress: 90,
        team: [
          { id: '5', name: 'Jennifer Lee', role: 'Managing Director' },
          { id: '6', name: 'Alex Johnson', role: 'Principal' }
        ],
        lastUpdated: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
        keyMetrics: {
          irr: 25.3,
          multiple: 3.1,
          paybackPeriod: 3.2,
          leverage: 4.2,
          equityContribution: 25000000
        },
        riskLevel: 'high',
        nextMilestone: 'IC Vote'
      }
    ];

    const activities: DealStructuringActivity[] = [
      {
        id: 'act-1',
        title: 'DCF Model Updated',
        deal: 'TechCorp Secondary',
        type: 'financial',
        status: 'completed',
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        user: 'David Kim'
      },
      {
        id: 'act-2',
        title: 'Legal Structure Review',
        deal: 'GreenEnergy Fund II',
        type: 'legal',
        status: 'in_progress',
        date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        user: 'Jennifer Lee'
      },
      {
        id: 'act-3',
        title: 'Risk Assessment Completed',
        deal: 'TechCorp Secondary',
        type: 'strategic',
        status: 'completed',
        date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        user: 'Emma Rodriguez'
      }
    ];

    const deadlines: DealStructuringDeadline[] = [
      {
        id: 'dead-1',
        title: 'Financial Model Completion',
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        deal: 'TechCorp Secondary',
        priority: 'high'
      },
      {
        id: 'dead-2',
        title: 'Management Presentation',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        deal: 'GreenEnergy Fund II',
        priority: 'medium'
      },
      {
        id: 'dead-3',
        title: 'IC Meeting Preparation',
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
        deal: 'HealthTech Acquisition',
        priority: 'high'
      },
      {
        id: 'dead-4',
        title: 'Legal Documentation Review',
        dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
        deal: 'GreenEnergy Fund II',
        priority: 'low'
      },
      {
        id: 'dead-5',
        title: 'Final Investment Memo',
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
        deal: 'HealthTech Acquisition',
        priority: 'medium'
      }
    ];

    const response = {
      success: true,
      metrics,
      deals: includeDetails ? deals : deals.map(d => ({ id: d.id, name: d.name, stage: d.stage })),
      activities: includeDetails ? activities : [],
      deadlines: includeDetails ? deadlines : [],
      timestamp: new Date().toISOString()
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching deal structuring dashboard data:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch dashboard data',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}