import { NextRequest, NextResponse } from 'next/server';
import { WorkProduct, WorkProductUpdateRequest } from '@/types/work-product';
import { WorkProductService } from '@/lib/services/database';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; workProductId: string }> }
) {
  try {
    const { id: workspaceId, workProductId } = await params;
    
    // Get work product from SQLite database
    const dbWorkProduct = WorkProductService.getById(workProductId);
    
    if (!dbWorkProduct || dbWorkProduct.workspaceId !== workspaceId) {
      return NextResponse.json(
        { error: 'Work product not found' },
        { status: 404 }
      );
    }
    
    // Convert database format to legacy API format for compatibility
    const workProduct: WorkProduct = {
      id: dbWorkProduct.id,
      workspaceId: dbWorkProduct.workspaceId,
      title: dbWorkProduct.title,
      type: dbWorkProduct.type,
      status: dbWorkProduct.status,
      templateId: dbWorkProduct.templateId,
      sections: dbWorkProduct.sections,
      metadata: dbWorkProduct.metadata,
      createdBy: dbWorkProduct.createdBy,
      lastEditedBy: dbWorkProduct.createdBy, // Legacy field mapping
      assignedReviewers: [], // Legacy field - could be added to database if needed
      currentReviewer: undefined, // Legacy field
      createdAt: new Date(dbWorkProduct.createdAt),
      updatedAt: new Date(dbWorkProduct.updatedAt),
      lastEditedAt: new Date(dbWorkProduct.updatedAt), // Legacy field mapping
      reviewDueDate: undefined, // Legacy field - could be added if needed
      version: dbWorkProduct.version,
      versionHistory: dbWorkProduct.versionHistory,
      wordCount: dbWorkProduct.wordCount,
      readingTime: dbWorkProduct.readingTime,
      collaboratorCount: dbWorkProduct.collaboratorCount,
      commentCount: dbWorkProduct.commentCount,
      editCount: dbWorkProduct.editCount
    };
    
    return NextResponse.json(workProduct);
    
  } catch (error) {
    console.error('Error fetching work product:', error);
    return NextResponse.json(
      { error: 'Failed to fetch work product' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; workProductId: string }> }
) {
  try {
    const { id: workspaceId, workProductId } = await params;
    const updates: WorkProductUpdateRequest = await request.json();
    
    // Verify work product exists and belongs to workspace
    const existing = WorkProductService.getById(workProductId);
    if (!existing || existing.workspaceId !== workspaceId) {
      return NextResponse.json(
        { error: 'Work product not found' },
        { status: 404 }
      );
    }
    
    // Update work product in database
    const updatedWorkProduct = WorkProductService.update(workProductId, {
      title: updates.title,
      status: updates.status,
      sections: updates.sections,
      metadata: updates.metadata
    });
    
    if (!updatedWorkProduct) {
      return NextResponse.json(
        { error: 'Failed to update work product' },
        { status: 500 }
      );
    }
    
    // Convert to legacy format
    const legacyWorkProduct: WorkProduct = {
      id: updatedWorkProduct.id,
      workspaceId: updatedWorkProduct.workspaceId,
      title: updatedWorkProduct.title,
      type: updatedWorkProduct.type,
      status: updatedWorkProduct.status,
      templateId: updatedWorkProduct.templateId,
      sections: updatedWorkProduct.sections,
      metadata: updatedWorkProduct.metadata,
      createdBy: updatedWorkProduct.createdBy,
      lastEditedBy: updatedWorkProduct.createdBy,
      assignedReviewers: updates.assignedReviewers || [],
      currentReviewer: updates.currentReviewer,
      createdAt: new Date(updatedWorkProduct.createdAt),
      updatedAt: new Date(updatedWorkProduct.updatedAt),
      lastEditedAt: new Date(updatedWorkProduct.updatedAt),
      reviewDueDate: updates.reviewDueDate ? new Date(updates.reviewDueDate) : undefined,
      version: updatedWorkProduct.version,
      versionHistory: updatedWorkProduct.versionHistory,
      wordCount: updatedWorkProduct.wordCount,
      readingTime: updatedWorkProduct.readingTime,
      collaboratorCount: updatedWorkProduct.collaboratorCount,
      commentCount: updatedWorkProduct.commentCount,
      editCount: updatedWorkProduct.editCount
    };
    
    return NextResponse.json(legacyWorkProduct);
    
  } catch (error) {
    console.error('Error updating work product:', error);
    return NextResponse.json(
      { error: 'Failed to update work product' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; workProductId: string }> }
) {
  try {
    const { id: workspaceId, workProductId } = await params;
    
    // Verify work product exists and belongs to workspace
    const existing = WorkProductService.getById(workProductId);
    if (!existing || existing.workspaceId !== workspaceId) {
      return NextResponse.json(
        { error: 'Work product not found' },
        { status: 404 }
      );
    }
    
    // Delete from database
    const success = WorkProductService.delete(workProductId);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Failed to delete work product' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error('Error deleting work product:', error);
    return NextResponse.json(
      { error: 'Failed to delete work product' },
      { status: 500 }
    );
  }
}