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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: workspaceId } = await params;
    
    // Get work products from SQLite database
    const { WorkProductService } = await import('@/lib/services/database');
    const dbWorkProducts = WorkProductService.getByWorkspaceId(workspaceId);
    
    // Convert database work products to legacy format for compatibility
    const workProducts = dbWorkProducts.map(wp => ({
      id: wp.id,
      workspaceId: wp.workspaceId,
      title: wp.title,
      type: wp.type,
      status: wp.status,
      templateId: wp.templateId,
      sections: wp.sections,
      metadata: wp.metadata,
      createdBy: wp.createdBy,
      lastEditedBy: wp.createdBy, // Legacy field
      assignedReviewers: [], // Legacy field
      currentReviewer: undefined, // Legacy field
      createdAt: wp.createdAt,
      updatedAt: wp.updatedAt,
      lastEditedAt: wp.updatedAt, // Legacy field
      reviewDueDate: undefined, // Legacy field
      version: wp.version,
      versionHistory: wp.versionHistory,
      wordCount: wp.wordCount,
      readingTime: wp.readingTime,
      collaboratorCount: wp.collaboratorCount,
      commentCount: wp.commentCount,
      editCount: wp.editCount
    }));
    
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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: workspaceId } = await params;
    const body: WorkProductCreateRequest = await request.json();
    
    // Validate required fields
    if (!body.title || !body.type) {
      return NextResponse.json(
        { error: 'Title and type are required' },
        { status: 400 }
      );
    }
    
    // Verify workspace exists
    const { WorkspaceService, WorkProductService } = await import('@/lib/services/database');
    const workspace = WorkspaceService.getById(workspaceId);
    if (!workspace) {
      return NextResponse.json(
        { error: 'Workspace not found' },
        { status: 404 }
      );
    }
    
    // Get template sections based on type
    const getTemplateSections = (type: string) => {
      switch (type) {
        case 'DD_REPORT':
          return [
            { id: 'exec-summary', title: 'Executive Summary', order: 1, content: '', type: 'text' as const, required: true, generationStrategy: 'ai-generated' as const },
            { id: 'investment-thesis', title: 'Investment Thesis', order: 2, content: '', type: 'text' as const, required: true, generationStrategy: 'ai-generated' as const },
            { id: 'financial-analysis', title: 'Financial Analysis', order: 3, content: '', type: 'financial_block' as const, required: true, generationStrategy: 'data-driven' as const },
            { id: 'market-analysis', title: 'Market Analysis', order: 4, content: '', type: 'text' as const, required: true, generationStrategy: 'ai-generated' as const },
            { id: 'risk-assessment', title: 'Risk Assessment', order: 5, content: '', type: 'text' as const, required: true, generationStrategy: 'ai-generated' as const },
            { id: 'recommendations', title: 'Recommendations', order: 6, content: '', type: 'text' as const, required: true, generationStrategy: 'ai-generated' as const }
          ];
        case 'IC_MEMO':
          return [
            { id: 'investment-overview', title: 'Investment Overview', order: 1, content: '', type: 'text' as const, required: true, generationStrategy: 'ai-generated' as const },
            { id: 'financial-highlights', title: 'Financial Highlights', order: 2, content: '', type: 'financial_block' as const, required: true, generationStrategy: 'data-driven' as const },
            { id: 'key-risks', title: 'Key Risks', order: 3, content: '', type: 'text' as const, required: true, generationStrategy: 'ai-generated' as const },
            { id: 'recommendation', title: 'Recommendation', order: 4, content: '', type: 'text' as const, required: true, generationStrategy: 'ai-generated' as const },
            { id: 'appendices', title: 'Appendices', order: 5, content: '', type: 'text' as const, required: false, generationStrategy: 'static' as const }
          ];
        case 'RISK_ASSESSMENT':
          return [
            { id: 'risk-overview', title: 'Risk Overview', order: 1, content: '', type: 'text' as const, required: true, generationStrategy: 'ai-generated' as const },
            { id: 'risk-categories', title: 'Risk Categories', order: 2, content: '', type: 'text' as const, required: true, generationStrategy: 'ai-generated' as const },
            { id: 'impact-analysis', title: 'Impact Analysis', order: 3, content: '', type: 'table' as const, required: true, generationStrategy: 'data-driven' as const },
            { id: 'mitigation-strategies', title: 'Mitigation Strategies', order: 4, content: '', type: 'text' as const, required: true, generationStrategy: 'ai-generated' as const }
          ];
        default:
          return [
            { id: 'overview', title: 'Overview', order: 1, content: '', type: 'text' as const, required: true, generationStrategy: 'ai-generated' as const },
            { id: 'content', title: 'Content', order: 2, content: '', type: 'text' as const, required: true, generationStrategy: 'ai-generated' as const }
          ];
      }
    };
    
    // Create work product in database
    const workProductData = {
      workspace_id: workspaceId,
      title: body.title,
      type: body.type,
      status: 'DRAFT' as const,
      template_id: body.templateId,
      sections: getTemplateSections(body.type),
      metadata: {
        ...body.metadata,
        projectContext: WorkspaceService.toProjectContext(workspace)
      },
      created_by: 'current-user' // Replace with actual user ID from session
    };
    
    const newWorkProduct = WorkProductService.create(workProductData);
    
    // Convert to legacy format for compatibility
    const legacyWorkProduct = {
      id: newWorkProduct.id,
      workspaceId: newWorkProduct.workspaceId,
      title: newWorkProduct.title,
      type: newWorkProduct.type,
      status: newWorkProduct.status,
      templateId: newWorkProduct.templateId,
      sections: newWorkProduct.sections,
      metadata: newWorkProduct.metadata,
      createdBy: newWorkProduct.createdBy,
      lastEditedBy: newWorkProduct.createdBy, // Legacy field
      assignedReviewers: body.assignedReviewers || [], // Legacy field
      currentReviewer: undefined, // Legacy field
      createdAt: newWorkProduct.createdAt,
      updatedAt: newWorkProduct.updatedAt,
      lastEditedAt: newWorkProduct.updatedAt, // Legacy field
      reviewDueDate: body.reviewDueDate, // Legacy field
      version: newWorkProduct.version,
      versionHistory: newWorkProduct.versionHistory,
      wordCount: newWorkProduct.wordCount,
      readingTime: newWorkProduct.readingTime,
      collaboratorCount: newWorkProduct.collaboratorCount,
      commentCount: newWorkProduct.commentCount,
      editCount: newWorkProduct.editCount
    };
    
    return NextResponse.json(legacyWorkProduct, { status: 201 });
    
  } catch (error) {
    console.error('Error creating work product:', error);
    return NextResponse.json(
      { error: 'Failed to create work product' },
      { status: 500 }
    );
  }
}