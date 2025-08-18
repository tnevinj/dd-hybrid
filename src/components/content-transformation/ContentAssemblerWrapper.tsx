'use client';

import React from 'react';
import { ContentAssembler } from './ContentAssembler';
import ContentAssemblerErrorBoundary from './ContentAssemblerErrorBoundary';
import { SmartTemplate, ProjectContext, WorkProduct } from '@/types/work-product';

interface ContentAssemblerWrapperProps {
  template?: SmartTemplate;
  projectContext: ProjectContext;
  onSave: (workProduct: WorkProduct) => void;
  onCancel: () => void;
  className?: string;
}

/**
 * Wrapper component that provides error boundary protection for ContentAssembler
 * This is the recommended way to use the ContentAssembler component
 */
export function ContentAssemblerWrapper(props: ContentAssemblerWrapperProps) {
  return (
    <ContentAssemblerErrorBoundary>
      <ContentAssembler {...props} />
    </ContentAssemblerErrorBoundary>
  );
}

// Export with error boundary as default
export default ContentAssemblerWrapper;

/**
 * Usage Example:
 * 
 * ```tsx
 * import ContentAssemblerWrapper from './ContentAssemblerWrapper';
 * 
 * function MyComponent() {
 *   const projectContext = {
 *     projectId: 'proj-123',
 *     projectName: 'TechCorp Acquisition',
 *     projectType: 'due-diligence',
 *     sector: 'Technology',
 *     dealValue: 125000000,
 *     stage: 'growth',
 *     geography: 'North America',
 *     riskRating: 'medium',
 *     progress: 65,
 *     metadata: {}
 *   };
 * 
 *   const handleSave = (workProduct: WorkProduct) => {
 *     console.log('Saving work product:', workProduct);
 *     // Save to database/API
 *   };
 * 
 *   const handleCancel = () => {
 *     console.log('User cancelled');
 *     // Navigate away or close modal
 *   };
 * 
 *   return (
 *     <ContentAssemblerWrapper
 *       template={selectedTemplate}
 *       projectContext={projectContext}
 *       onSave={handleSave}
 *       onCancel={handleCancel}
 *       className="h-full"
 *     />
 *   );
 * }
 * ```
 */