'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  WorkProductType, 
  WorkProductCreateRequest, 
  DocumentTemplate 
} from '@/types/work-product';
import { 
  Plus, 
  FileText, 
  PresentationChart, 
  Calculator, 
  Shield, 
  TrendingUp,
  Users,
  Clock,
  Wand2,
  Sparkles
} from 'lucide-react';
import { useNavigationStore } from '@/stores/navigation-store';

interface WorkProductCreatorProps {
  workspaceId: string;
  onCreateWorkProduct: (request: WorkProductCreateRequest) => void;
  onCancel?: () => void;
}

const workProductTypes = [
  {
    type: 'DD_REPORT' as WorkProductType,
    title: 'Due Diligence Report',
    description: 'Comprehensive analysis report with executive summary, financial review, and risk assessment',
    icon: FileText,
    estimatedTime: '4-6 hours',
    complexity: 'Complex',
    sections: ['Executive Summary', 'Investment Thesis', 'Financial Analysis', 'Market Analysis', 'Risk Assessment', 'Recommendations']
  },
  {
    type: 'IC_MEMO' as WorkProductType,
    title: 'Investment Committee Memo',
    description: 'Formal investment recommendation for committee review and decision',
    icon: PresentationChart,
    estimatedTime: '2-3 hours',
    complexity: 'Standard',
    sections: ['Investment Overview', 'Financial Highlights', 'Key Risks', 'Recommendation', 'Appendices']
  },
  {
    type: 'INVESTMENT_SUMMARY' as WorkProductType,
    title: 'Investment Summary',
    description: 'Executive-level summary of investment opportunity and key metrics',
    icon: TrendingUp,
    estimatedTime: '1-2 hours',
    complexity: 'Simple',
    sections: ['Overview', 'Financial Metrics', 'Market Position', 'Investment Rationale']
  },
  {
    type: 'MARKET_ANALYSIS' as WorkProductType,
    title: 'Market Analysis',
    description: 'Detailed market sizing, competitive landscape, and growth projections',
    icon: TrendingUp,
    estimatedTime: '3-4 hours',
    complexity: 'Standard',
    sections: ['Market Overview', 'Size & Growth', 'Competitive Landscape', 'Market Trends', 'Opportunity Assessment']
  },
  {
    type: 'RISK_ASSESSMENT' as WorkProductType,
    title: 'Risk Assessment',
    description: 'Comprehensive risk analysis with mitigation strategies and impact assessment',
    icon: Shield,
    estimatedTime: '2-3 hours',
    complexity: 'Standard',
    sections: ['Risk Overview', 'Risk Categories', 'Impact Analysis', 'Probability Assessment', 'Mitigation Strategies']
  },
  {
    type: 'FINANCIAL_MODEL' as WorkProductType,
    title: 'Financial Model',
    description: 'Interactive financial projections with scenarios and sensitivity analysis',
    icon: Calculator,
    estimatedTime: '6-8 hours',
    complexity: 'Complex',
    sections: ['Model Assumptions', 'Financial Projections', 'Scenario Analysis', 'Sensitivity Analysis', 'Valuation']
  }
];

export function WorkProductCreator({ workspaceId, onCreateWorkProduct, onCancel }: WorkProductCreatorProps) {
  const { navigationMode } = useNavigationStore();
  const [selectedType, setSelectedType] = useState<WorkProductType | null>(null);
  const [title, setTitle] = useState('');
  const [customizeTemplate, setCustomizeTemplate] = useState(false);
  const [showAIAssistant, setShowAIAssistant] = useState(navigationMode !== 'traditional');

  const handleQuickCreate = (type: WorkProductType) => {
    const typeConfig = workProductTypes.find(t => t.type === type);
    const request: WorkProductCreateRequest = {
      workspaceId,
      title: title || `${typeConfig?.title} - ${new Date().toLocaleDateString()}`,
      type,
      templateId: `${type.toLowerCase()}-standard`
    };
    
    onCreateWorkProduct(request);
  };

  const handleCustomCreate = () => {
    if (!selectedType) return;
    
    const request: WorkProductCreateRequest = {
      workspaceId,
      title: title,
      type: selectedType,
      templateId: `${selectedType.toLowerCase()}-standard`
    };
    
    onCreateWorkProduct(request);
  };

  const renderAIAssistant = () => {
    if (!showAIAssistant || navigationMode === 'traditional') return null;

    return (
      <Card className="p-4 mb-6 bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200">
        <div className="flex items-start gap-3">
          <Wand2 className="w-5 h-5 text-indigo-600 mt-1" />
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-indigo-900 mb-2">
              🤖 AI Work Product Assistant
              {navigationMode === 'autonomous' && (
                <Badge className="ml-2 bg-purple-100 text-purple-700">Autonomous Mode</Badge>
              )}
            </h3>
            
            {navigationMode === 'assisted' && (
              <div className="space-y-2">
                <div className="p-3 bg-white rounded border border-indigo-200">
                  <p className="text-sm text-gray-700">
                    💡 Based on your workspace analysis, I recommend starting with a <strong>Due Diligence Report</strong>.
                    I can populate it with your existing evidence and findings.
                  </p>
                  <div className="flex gap-2 mt-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => {
                        setSelectedType('DD_REPORT');
                        setTitle('Due Diligence Report - AI Generated');
                      }}
                    >
                      Use Recommendation
                    </Button>
                    <Button size="sm" variant="ghost">Show Data Sources</Button>
                  </div>
                </div>
                
                <div className="p-3 bg-white rounded border border-indigo-200">
                  <p className="text-sm text-gray-700">
                    ⚡ I can automatically generate document sections using your workspace data.
                    This includes financial metrics, risk analysis, and market insights.
                  </p>
                  <div className="flex gap-2 mt-2">
                    <Button size="sm" variant="outline">Auto-Generate Content</Button>
                    <Button size="sm" variant="ghost">Preview Sections</Button>
                  </div>
                </div>
              </div>
            )}

            {navigationMode === 'autonomous' && (
              <div className="space-y-2">
                <div className="p-3 bg-white rounded border border-purple-200">
                  <p className="text-sm text-gray-700">
                    🔄 I've pre-selected the optimal document types for your workspace stage.
                    Ready to create: DD Report (recommended), Risk Assessment (supplementary).
                  </p>
                  <Button size="sm" variant="outline" className="mt-2">Create Recommended Set</Button>
                </div>
                
                <div className="p-3 bg-white rounded border border-purple-200">
                  <p className="text-sm text-gray-700">
                    📊 I can create all documents simultaneously and maintain cross-references between them.
                    This ensures consistency across your work product suite.
                  </p>
                  <Button size="sm" variant="outline" className="mt-2">Create Document Suite</Button>
                </div>
              </div>
            )}
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAIAssistant(false)}
          >
            ×
          </Button>
        </div>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Create Work Product</h2>
          <p className="text-gray-600 mt-1">Choose a document type to get started</p>
        </div>
        
        {onCancel && (
          <Button variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>

      {/* AI Assistant */}
      {renderAIAssistant()}

      {/* Document Info */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Document Details</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Document Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter document title..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </Card>

      {/* Document Types */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Choose Document Type</h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {workProductTypes.map((typeConfig) => {
            const Icon = typeConfig.icon;
            const isSelected = selectedType === typeConfig.type;
            
            return (
              <Card 
                key={typeConfig.type}
                className={`p-6 cursor-pointer transition-all ${
                  isSelected 
                    ? 'ring-2 ring-blue-500 bg-blue-50' 
                    : 'hover:shadow-md hover:border-blue-200'
                }`}
                onClick={() => setSelectedType(typeConfig.type)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-3">
                    <Icon className="w-6 h-6 text-blue-600 mt-1" />
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-1">
                        {typeConfig.title}
                      </h4>
                      <p className="text-sm text-gray-600 mb-3">
                        {typeConfig.description}
                      </p>
                    </div>
                  </div>
                  
                  <Badge 
                    className={
                      typeConfig.complexity === 'Simple' ? 'bg-green-100 text-green-700' :
                      typeConfig.complexity === 'Standard' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }
                  >
                    {typeConfig.complexity}
                  </Badge>
                </div>
                
                {/* Sections Preview */}
                <div className="mb-4">
                  <h5 className="text-xs font-medium text-gray-700 mb-2">INCLUDES:</h5>
                  <div className="flex flex-wrap gap-1">
                    {typeConfig.sections.slice(0, 3).map((section, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {section}
                      </Badge>
                    ))}
                    {typeConfig.sections.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{typeConfig.sections.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{typeConfig.estimatedTime}</span>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    className="flex-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleQuickCreate(typeConfig.type);
                    }}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create Now
                  </Button>
                  
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedType(typeConfig.type);
                      setCustomizeTemplate(true);
                    }}
                  >
                    Customize
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Custom Creation */}
      {selectedType && customizeTemplate && (
        <Card className="p-6 border-blue-200 bg-blue-50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-600" />
              Customize "{workProductTypes.find(t => t.type === selectedType)?.title}"
            </h3>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => {
                setSelectedType(null);
                setCustomizeTemplate(false);
              }}
            >
              ×
            </Button>
          </div>
          
          <div className="bg-white p-4 rounded border border-blue-200 mb-4">
            <h4 className="font-medium text-gray-900 mb-2">Template Preview</h4>
            <p className="text-sm text-gray-600 mb-3">
              {workProductTypes.find(t => t.type === selectedType)?.description}
            </p>
            
            <div className="space-y-2">
              <h5 className="text-xs font-medium text-gray-700">DOCUMENT SECTIONS:</h5>
              <div className="grid grid-cols-2 gap-2">
                {workProductTypes.find(t => t.type === selectedType)?.sections.map((section, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <input type="checkbox" defaultChecked className="rounded" />
                    <span>{section}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="flex gap-3">
            <Button onClick={handleCustomCreate} className="flex-1">
              Create Work Product
            </Button>
            <Button 
              variant="outline" 
              onClick={() => {
                setSelectedType(null);
                setCustomizeTemplate(false);
              }}
            >
              Back to Types
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}