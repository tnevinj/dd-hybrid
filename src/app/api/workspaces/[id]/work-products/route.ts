import { NextRequest, NextResponse } from 'next/server';
import { WorkProduct, WorkProductCreateRequest } from '@/types/work-product';

// Mock work products for development
const mockWorkProducts: WorkProduct[] = [
  {
    id: 'wp-1',
    workspaceId: '1',
    title: 'TechCorp Due Diligence Report',
    type: 'DD_REPORT',
    status: 'IN_REVIEW',
    templateId: 'dd_report-standard',
    sections: [
      {
        id: 'exec-summary',
        title: 'Executive Summary',
        order: 1,
        content: '# Executive Summary\n\nTechCorp represents a compelling investment opportunity in the enterprise SaaS market...',
        type: 'text',
        required: true
      },
      {
        id: 'investment-thesis',
        title: 'Investment Thesis',
        order: 2,
        content: '# Investment Thesis\n\n## Key Investment Highlights\n\n1. Strong market position\n2. Proven management team\n3. Scalable technology platform',
        type: 'text',
        required: true
      },
      {
        id: 'financial-analysis',
        title: 'Financial Analysis',
        order: 3,
        content: '',
        type: 'financial_block',
        required: true,
        template: 'financial-metrics-table'
      }
    ],
    metadata: {
      dealName: 'TechCorp Acquisition',
      sector: 'Technology',
      investmentSize: '$50M'
    },
    createdBy: 'user-1',
    lastEditedBy: 'user-2',
    assignedReviewers: ['user-3', 'user-4'],
    currentReviewer: 'user-3',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-21'),
    lastEditedAt: new Date('2024-01-21'),
    reviewDueDate: new Date('2024-01-25'),
    version: '1.2',
    versionHistory: [
      {
        id: 'v1',
        version: '1.0',
        createdBy: 'user-1',
        createdAt: new Date('2024-01-15'),
        changeLog: 'Initial document creation',
        snapshot: []
      },
      {
        id: 'v2',
        version: '1.1',
        createdBy: 'user-2',
        createdAt: new Date('2024-01-18'),
        changeLog: 'Added financial analysis section',
        snapshot: []
      }
    ],
    wordCount: 2847,
    readingTime: 12,
    collaboratorCount: 3,
    commentCount: 8,
    editCount: 24
  },
  {
    id: 'wp-2',
    workspaceId: '1',
    title: 'TechCorp Risk Assessment',
    type: 'RISK_ASSESSMENT',
    status: 'DRAFT',
    templateId: 'risk_assessment-standard',
    sections: [
      {
        id: 'risk-overview',
        title: 'Risk Overview',
        order: 1,
        content: '# Risk Assessment Overview\n\nThis assessment identifies key investment risks...',
        type: 'text',
        required: true
      },
      {
        id: 'market-risks',
        title: 'Market Risks',
        order: 2,
        content: '## Competitive Landscape\n\nThe enterprise software market is highly competitive...',
        type: 'text',
        required: true
      }
    ],
    metadata: {
      riskLevel: 'Medium',
      lastReviewed: new Date('2024-01-20')
    },
    createdBy: 'user-2',
    createdAt: new Date('2024-01-18'),
    updatedAt: new Date('2024-01-20'),
    version: '1.0',
    versionHistory: [],
    wordCount: 1243,
    readingTime: 5,
    collaboratorCount: 2,
    commentCount: 3,
    editCount: 8
  }
];

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const workspaceId = params.id;
    
    // Filter work products for this workspace
    const workProducts = mockWorkProducts.filter(wp => wp.workspaceId === workspaceId);
    
    return NextResponse.json({
      workProducts,
      total: workProducts.length
    });
    
  } catch (error) {
    console.error('Error fetching work products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch work products' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const workspaceId = params.id;
    const body: WorkProductCreateRequest = await request.json();
    
    // Validate required fields
    if (!body.title || !body.type) {
      return NextResponse.json(
        { error: 'Title and type are required' },
        { status: 400 }
      );
    }
    
    // Get template sections based on type
    const getTemplateSections = (type: string) => {
      switch (type) {
        case 'DD_REPORT':
          return [
            { id: 'exec-summary', title: 'Executive Summary', order: 1, content: '', type: 'text', required: true },
            { id: 'investment-thesis', title: 'Investment Thesis', order: 2, content: '', type: 'text', required: true },
            { id: 'financial-analysis', title: 'Financial Analysis', order: 3, content: '', type: 'financial_block', required: true },
            { id: 'market-analysis', title: 'Market Analysis', order: 4, content: '', type: 'text', required: true },
            { id: 'risk-assessment', title: 'Risk Assessment', order: 5, content: '', type: 'text', required: true },
            { id: 'recommendations', title: 'Recommendations', order: 6, content: '', type: 'text', required: true }
          ];
        case 'IC_MEMO':
          return [
            { id: 'investment-overview', title: 'Investment Overview', order: 1, content: '', type: 'text', required: true },
            { id: 'financial-highlights', title: 'Financial Highlights', order: 2, content: '', type: 'financial_block', required: true },
            { id: 'key-risks', title: 'Key Risks', order: 3, content: '', type: 'text', required: true },
            { id: 'recommendation', title: 'Recommendation', order: 4, content: '', type: 'text', required: true },
            { id: 'appendices', title: 'Appendices', order: 5, content: '', type: 'text', required: false }
          ];
        case 'RISK_ASSESSMENT':
          return [
            { id: 'risk-overview', title: 'Risk Overview', order: 1, content: '', type: 'text', required: true },
            { id: 'risk-categories', title: 'Risk Categories', order: 2, content: '', type: 'text', required: true },
            { id: 'impact-analysis', title: 'Impact Analysis', order: 3, content: '', type: 'table', required: true },
            { id: 'mitigation-strategies', title: 'Mitigation Strategies', order: 4, content: '', type: 'text', required: true }
          ];
        default:
          return [
            { id: 'overview', title: 'Overview', order: 1, content: '', type: 'text', required: true },
            { id: 'content', title: 'Content', order: 2, content: '', type: 'text', required: true }
          ];
      }
    };
    
    // Create new work product
    const newWorkProduct: WorkProduct = {
      id: `wp-${Date.now()}`,
      workspaceId,
      title: body.title,
      type: body.type,
      status: 'DRAFT',
      templateId: body.templateId,
      sections: getTemplateSections(body.type),
      metadata: body.metadata || {},
      createdBy: 'current-user', // Replace with actual user ID from session
      createdAt: new Date(),
      updatedAt: new Date(),
      version: '1.0',
      versionHistory: [
        {
          id: `v1-${Date.now()}`,
          version: '1.0',
          createdBy: 'current-user',
          createdAt: new Date(),
          changeLog: 'Initial document creation',
          snapshot: []
        }
      ],
      wordCount: 0,
      readingTime: 0,
      collaboratorCount: 1,
      commentCount: 0,
      editCount: 0,
      assignedReviewers: body.assignedReviewers,
      reviewDueDate: body.reviewDueDate
    };
    
    // In a real implementation, save to database here
    // await prisma.workProduct.create({ data: newWorkProduct });
    
    return NextResponse.json(newWorkProduct, { status: 201 });
    
  } catch (error) {
    console.error('Error creating work product:', error);
    return NextResponse.json(
      { error: 'Failed to create work product' },
      { status: 500 }
    );
  }
}