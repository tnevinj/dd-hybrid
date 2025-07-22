'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { WorkProduct, DocumentSection, WorkProductStatus } from '@/types/work-product';
import { 
  Save,
  Download,
  Share2,
  MessageSquare,
  Eye,
  EyeOff,
  Users,
  Clock,
  ArrowLeft,
  Settings,
  FileText,
  Wand2,
  Sparkles,
  ChevronRight,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useNavigationStore } from '@/stores/navigation-store';

interface DocumentEditorProps {
  workProduct: WorkProduct;
  onSave?: (sections: DocumentSection[]) => void;
  onStatusChange?: (status: WorkProductStatus) => void;
  onBack?: () => void;
}

export function DocumentEditor({ workProduct, onSave, onStatusChange, onBack }: DocumentEditorProps) {
  const { navigationMode } = useNavigationStore();
  const [sections, setSections] = useState<DocumentSection[]>(workProduct.sections);
  const [activeSection, setActiveSection] = useState<string>(sections[0]?.id || '');
  const [showPreview, setShowPreview] = useState(false);
  const [showAIAssistant, setShowAIAssistant] = useState(navigationMode !== 'traditional');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const currentSection = sections.find(s => s.id === activeSection);

  const handleContentChange = (sectionId: string, content: string) => {
    setSections(prev => prev.map(section => 
      section.id === sectionId 
        ? { ...section, content }
        : section
    ));
    setHasUnsavedChanges(true);
  };

  const handleSave = () => {
    onSave?.(sections);
    setHasUnsavedChanges(false);
  };

  const renderAIAssistant = () => {
    if (!showAIAssistant || navigationMode === 'traditional') return null;

    return (
      <Card className="p-4 mb-4 bg-gradient-to-r from-violet-50 to-purple-50 border-violet-200">
        <div className="flex items-start gap-3">
          <Wand2 className="w-5 h-5 text-violet-600 mt-1" />
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-violet-900 mb-2">
              🤖 AI Writing Assistant
              {navigationMode === 'autonomous' && <Badge className="ml-2 bg-purple-100 text-purple-700">Autonomous</Badge>}
            </h3>
            
            {navigationMode === 'assisted' && (
              <div className="space-y-2">
                <div className="p-3 bg-white rounded border border-violet-200">
                  <p className="text-sm text-gray-700">
                    💡 I can help generate content for the "{currentSection?.title}" section using your workspace data.
                    This will save approximately 15-20 minutes.
                  </p>
                  <div className="flex gap-2 mt-2">
                    <Button size="sm" variant="outline">Generate Content</Button>
                    <Button size="sm" variant="ghost">Show Sources</Button>
                  </div>
                </div>
                
                <div className="p-3 bg-white rounded border border-violet-200">
                  <p className="text-sm text-gray-700">
                    📊 I can insert financial metrics from your analysis components automatically.
                    Current data: Revenue growth (45% YoY), Gross margin (82%).
                  </p>
                  <Button size="sm" variant="outline" className="mt-2">Insert Metrics</Button>
                </div>
              </div>
            )}

            {navigationMode === 'autonomous' && (
              <div className="space-y-2">
                <div className="p-3 bg-white rounded border border-purple-200">
                  <p className="text-sm text-gray-700">
                    🔄 I'm continuously updating document sections as new evidence is added to the workspace.
                    Last update: 2 minutes ago (Financial Analysis section).
                  </p>
                  <Button size="sm" variant="outline" className="mt-2">View Recent Changes</Button>
                </div>
                
                <div className="p-3 bg-white rounded border border-purple-200">
                  <p className="text-sm text-gray-700">
                    ✍️ I can complete the remaining sections based on established patterns and data.
                    Estimated completion time: 8 minutes for 4 remaining sections.
                  </p>
                  <Button size="sm" variant="outline" className="mt-2">Auto-Complete Document</Button>
                </div>
              </div>
            )}
          </div>
          
          <Button variant="ghost" size="sm" onClick={() => setShowAIAssistant(false)}>×</Button>
        </div>
      </Card>
    );
  };

  const renderSectionNav = () => (
    <Card className="w-80 h-fit">
      <div className="p-4 border-b">
        <h3 className="font-semibold text-gray-900 mb-2">Document Sections</h3>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <FileText className="w-4 h-4" />
          <span>{sections.length} sections</span>
          <span>•</span>
          <span>{workProduct.wordCount} words</span>
        </div>
      </div>
      
      <div className="p-2">
        {sections.map((section, index) => {
          const isActive = section.id === activeSection;
          const isComplete = section.content.length > 50; // Simple completion check
          
          return (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`w-full p-3 rounded-lg mb-1 text-left transition-colors ${
                isActive 
                  ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                  : 'hover:bg-gray-50 text-gray-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium text-sm">{section.title}</span>
                {isComplete ? (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                ) : (
                  <div className="w-4 h-4 rounded-full border-2 border-gray-300" />
                )}
              </div>
              
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span>Step {section.order}</span>
                {section.required && <Badge variant="outline" className="text-xs">Required</Badge>}
              </div>
              
              <div className="mt-1 text-xs text-gray-400">
                {section.content.length > 0 ? `${section.content.length} characters` : 'Not started'}
              </div>
            </button>
          );
        })}
      </div>
    </Card>
  );

  const renderEditor = () => (
    <div className="flex-1 space-y-4">
      {/* Section Header */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{currentSection?.title}</h2>
            <p className="text-sm text-gray-600">
              Section {currentSection?.order} of {sections.length}
              {currentSection?.required && <span className="ml-2 text-red-600">• Required</span>}
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowPreview(!showPreview)}
              className="flex items-center gap-2"
            >
              {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              {showPreview ? 'Edit' : 'Preview'}
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              Comments
            </Button>
          </div>
        </div>
        
        {/* Progress indicator */}
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <div className="flex-1 bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ 
                width: `${Math.min((currentSection?.content.length || 0) / 500 * 100, 100)}%` 
              }}
            ></div>
          </div>
          <span>{currentSection?.content.length || 0} / ~500 chars</span>
        </div>
      </Card>

      {/* Content Editor */}
      <Card className="p-6">
        {showPreview ? (
          <div className="prose max-w-none">
            <div
              dangerouslySetInnerHTML={{ 
                __html: currentSection?.content?.replace(/\n/g, '<br>') || '<p class="text-gray-500">No content yet. Click Edit to start writing.</p>' 
              }}
            />
          </div>
        ) : (
          <div className="space-y-4">
            {/* Toolbar */}
            <div className="flex items-center gap-2 p-2 border-b">
              <Button variant="ghost" size="sm">Bold</Button>
              <Button variant="ghost" size="sm">Italic</Button>
              <Button variant="ghost" size="sm">Underline</Button>
              <div className="w-px h-4 bg-gray-300 mx-2"></div>
              <Button variant="ghost" size="sm">H1</Button>
              <Button variant="ghost" size="sm">H2</Button>
              <Button variant="ghost" size="sm">H3</Button>
              <div className="w-px h-4 bg-gray-300 mx-2"></div>
              <Button variant="ghost" size="sm">List</Button>
              <Button variant="ghost" size="sm">Table</Button>
              <Button variant="ghost" size="sm">Link</Button>
              
              {navigationMode !== 'traditional' && (
                <>
                  <div className="w-px h-4 bg-gray-300 mx-2"></div>
                  <Button variant="ghost" size="sm" className="flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    AI Suggest
                  </Button>
                </>
              )}
            </div>
            
            {/* Text Editor */}
            <textarea
              value={currentSection?.content || ''}
              onChange={(e) => handleContentChange(activeSection, e.target.value)}
              placeholder={`Write your ${currentSection?.title.toLowerCase()} here...`}
              className="w-full h-96 p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
            />
            
            {/* AI Content Suggestions */}
            {navigationMode !== 'traditional' && (
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="text-sm font-medium text-blue-900 mb-2">💡 AI Content Suggestions</h4>
                <div className="space-y-2">
                  <button className="text-left p-2 bg-white rounded border border-blue-200 hover:border-blue-300 transition-colors w-full">
                    <p className="text-sm text-gray-700">"Based on the financial analysis, TechCorp demonstrates strong growth potential with..."</p>
                  </button>
                  <button className="text-left p-2 bg-white rounded border border-blue-200 hover:border-blue-300 transition-colors w-full">
                    <p className="text-sm text-gray-700">"Key investment highlights include: 1) Proven market leadership 2) Scalable platform..."</p>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </Card>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{workProduct.title}</h1>
            <div className="flex items-center gap-2 mt-1">
              <Badge className="bg-blue-100 text-blue-700">{workProduct.type}</Badge>
              <Badge className="bg-gray-100 text-gray-700">v{workProduct.version}</Badge>
              <Badge className={
                workProduct.status === 'DRAFT' ? 'bg-yellow-100 text-yellow-700' :
                workProduct.status === 'IN_REVIEW' ? 'bg-orange-100 text-orange-700' :
                workProduct.status === 'APPROVED' ? 'bg-green-100 text-green-700' :
                'bg-gray-100 text-gray-700'
              }>
                {workProduct.status}
              </Badge>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {hasUnsavedChanges && (
            <span className="text-sm text-orange-600 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              Unsaved changes
            </span>
          )}
          
          <Button variant="outline" size="sm">
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
          
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          
          <Button onClick={handleSave} disabled={!hasUnsavedChanges}>
            <Save className="w-4 h-4 mr-2" />
            Save
          </Button>
          
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* AI Assistant */}
      {renderAIAssistant()}

      {/* Editor Layout */}
      <div className="flex gap-6">
        {/* Section Navigation */}
        {renderSectionNav()}
        
        {/* Main Editor */}
        {renderEditor()}
      </div>

      {/* Status Bar */}
      <Card className="p-4">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center gap-4">
            <span>{workProduct.wordCount} words</span>
            <span>{workProduct.readingTime} min read</span>
            <span className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              {workProduct.collaboratorCount} collaborators
            </span>
            <span className="flex items-center gap-1">
              <MessageSquare className="w-4 h-4" />
              {workProduct.commentCount} comments
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>Last saved: {new Date(workProduct.updatedAt).toLocaleString()}</span>
          </div>
        </div>
      </Card>
    </div>
  );
}