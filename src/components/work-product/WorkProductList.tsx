'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { WorkProduct, WorkProductType, WorkProductStatus } from '@/types/work-product';
import { 
  Plus, 
  FileText, 
  Eye, 
  Edit, 
  Share2, 
  Download, 
  Clock,
  Users,
  MessageSquare,
  CheckCircle,
  AlertCircle,
  Loader
} from 'lucide-react';
import { useNavigationStore } from '@/stores/navigation-store';

interface WorkProductListProps {
  workspaceId: string;
  workProducts: WorkProduct[];
  loading?: boolean;
  onCreateWorkProduct?: () => void;
  onSelectWorkProduct?: (workProduct: WorkProduct) => void;
  onEditWorkProduct?: (workProduct: WorkProduct) => void;
  onShareWorkProduct?: (workProduct: WorkProduct) => void;
}

const getStatusColor = (status: WorkProductStatus): string => {
  switch (status) {
    case 'DRAFT': return 'bg-gray-100 text-gray-700';
    case 'IN_REVIEW': return 'bg-yellow-100 text-yellow-700';
    case 'UNDER_REVISION': return 'bg-orange-100 text-orange-700';
    case 'APPROVED': return 'bg-green-100 text-green-700';
    case 'FINAL': return 'bg-blue-100 text-blue-700';
    case 'ARCHIVED': return 'bg-gray-100 text-gray-500';
    default: return 'bg-gray-100 text-gray-700';
  }
};

const getTypeIcon = (type: WorkProductType) => {
  switch (type) {
    case 'DD_REPORT': return '📋';
    case 'IC_MEMO': return '📝';
    case 'INVESTMENT_SUMMARY': return '📊';
    case 'MARKET_ANALYSIS': return '📈';
    case 'RISK_ASSESSMENT': return '⚠️';
    case 'FINANCIAL_MODEL': return '💹';
    case 'PRESENTATION': return '🖼️';
    case 'TERM_SHEET': return '📄';
    default: return '📁';
  }
};

const getStatusIcon = (status: WorkProductStatus) => {
  switch (status) {
    case 'DRAFT': return <Edit className="w-4 h-4 text-gray-500" />;
    case 'IN_REVIEW': return <Loader className="w-4 h-4 text-yellow-500 animate-spin" />;
    case 'UNDER_REVISION': return <AlertCircle className="w-4 h-4 text-orange-500" />;
    case 'APPROVED': return <CheckCircle className="w-4 h-4 text-green-500" />;
    case 'FINAL': return <CheckCircle className="w-4 h-4 text-blue-500" />;
    case 'ARCHIVED': return <div className="w-4 h-4 rounded-full bg-gray-300" />;
    default: return <Edit className="w-4 h-4 text-gray-500" />;
  }
};

export function WorkProductList({
  workspaceId,
  workProducts,
  loading = false,
  onCreateWorkProduct,
  onSelectWorkProduct,
  onEditWorkProduct,
  onShareWorkProduct
}: WorkProductListProps) {
  const { navigationMode } = useNavigationStore();
  const [showAIInsights, setShowAIInsights] = useState(navigationMode !== 'traditional');

  const renderAIInsights = () => {
    if (!showAIInsights || navigationMode === 'traditional') return null;

    return (
      <Card className="p-4 mb-6 bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-green-900 mb-2 flex items-center gap-2">
              🤖 Work Product AI Insights
              {navigationMode === 'autonomous' && <Badge className="bg-purple-100 text-purple-700">Autonomous Mode</Badge>}
            </h3>
            
            <div className="space-y-2">
              {navigationMode === 'assisted' && (
                <>
                  <div className="p-3 bg-white rounded border border-green-200">
                    <p className="text-sm text-gray-700">
                      💡 I can generate a Due Diligence Report template based on your analysis components.
                      This will save approximately 2-3 hours of initial setup.
                    </p>
                    <div className="flex gap-2 mt-2">
                      <Button size="sm" variant="outline">Generate Template</Button>
                      <Button size="sm" variant="ghost">Preview Structure</Button>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-white rounded border border-green-200">
                    <p className="text-sm text-gray-700">
                      📊 Your financial analysis data can be automatically populated into an Investment Summary.
                      Would you like me to create a draft?
                    </p>
                    <div className="flex gap-2 mt-2">
                      <Button size="sm" variant="outline">Create Draft</Button>
                      <Button size="sm" variant="ghost">Show Data Sources</Button>
                    </div>
                  </div>
                </>
              )}

              {navigationMode === 'autonomous' && (
                <div className="space-y-2">
                  <div className="p-3 bg-white rounded border border-purple-200">
                    <p className="text-sm text-gray-700">
                      🔄 I've automatically generated document outlines for your workspace.
                      Ready to populate: DD Report (85% complete), Risk Assessment (60% complete).
                    </p>
                    <Button size="sm" variant="outline" className="mt-2">Review Generated Documents</Button>
                  </div>
                  
                  <div className="p-3 bg-white rounded border border-purple-200">
                    <p className="text-sm text-gray-700">
                      📝 I can automatically update all work products when new evidence is added.
                      Current queue: 3 documents pending updates.
                    </p>
                    <Button size="sm" variant="outline" className="mt-2">Enable Auto-Updates</Button>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAIInsights(false)}
          >
            ×
          </Button>
        </div>
      </Card>
    );
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {renderAIInsights()}
        {[1, 2, 3].map(i => (
          <Card key={i} className="p-6 animate-pulse">
            <div className="flex items-start justify-between">
              <div className="space-y-2 flex-1">
                <div className="h-5 bg-gray-200 rounded w-64"></div>
                <div className="h-4 bg-gray-200 rounded w-32"></div>
                <div className="h-3 bg-gray-200 rounded w-48"></div>
              </div>
              <div className="flex space-x-2">
                <div className="h-6 bg-gray-200 rounded w-16"></div>
                <div className="h-6 bg-gray-200 rounded w-20"></div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {renderAIInsights()}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Work Products</h3>
          <p className="text-gray-600 mt-1">Documents and deliverables for this workspace</p>
        </div>
        
        <Button onClick={onCreateWorkProduct} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Create Document
        </Button>
      </div>

      {/* Work Products Grid */}
      <div className="grid grid-cols-1 gap-4">
        {workProducts.map((workProduct) => (
          <Card 
            key={workProduct.id} 
            className="p-6 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => onSelectWorkProduct?.(workProduct)}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-3">
                <div className="text-2xl">
                  {getTypeIcon(workProduct.type)}
                </div>
                
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-gray-900 mb-1">
                    {workProduct.title}
                  </h4>
                  <p className="text-sm text-gray-600 mb-2">
                    {workProduct.type.replace('_', ' ')} • Version {workProduct.version}
                  </p>
                  
                  {workProduct.reviewDueDate && (
                    <p className="text-xs text-orange-600 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Due {new Date(workProduct.reviewDueDate).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
              
              <div className="flex flex-col gap-2 items-end">
                <Badge className={getStatusColor(workProduct.status)}>
                  {workProduct.status}
                </Badge>
                
                <div className="flex items-center gap-1">
                  {getStatusIcon(workProduct.status)}
                </div>
              </div>
            </div>
            
            {/* Metadata */}
            <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  <span>{workProduct.collaboratorCount} collaborators</span>
                </div>
                
                <div className="flex items-center gap-1">
                  <MessageSquare className="w-3 h-3" />
                  <span>{workProduct.commentCount} comments</span>
                </div>
                
                <div className="flex items-center gap-1">
                  <FileText className="w-3 h-3" />
                  <span>{workProduct.wordCount} words</span>
                </div>
                
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{workProduct.readingTime} min read</span>
                </div>
              </div>
              
              <div>
                Updated {new Date(workProduct.updatedAt).toLocaleDateString()}
              </div>
            </div>
            
            {/* Actions */}
            <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onSelectWorkProduct?.(workProduct)}
                className="flex items-center gap-1"
              >
                <Eye className="w-3 h-3" />
                View
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEditWorkProduct?.(workProduct)}
                className="flex items-center gap-1"
              >
                <Edit className="w-3 h-3" />
                Edit
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => onShareWorkProduct?.(workProduct)}
                className="flex items-center gap-1"
              >
                <Share2 className="w-3 h-3" />
                Share
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1"
              >
                <Download className="w-3 h-3" />
                Export
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {workProducts.length === 0 && !loading && (
        <Card className="p-12 text-center">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No work products yet
          </h3>
          <p className="text-gray-600 mb-4">
            Create your first document to start building deliverables for this workspace
          </p>
          <Button onClick={onCreateWorkProduct} className="flex items-center gap-2 mx-auto">
            <Plus className="w-4 h-4" />
            Create Work Product
          </Button>
        </Card>
      )}
    </div>
  );
}