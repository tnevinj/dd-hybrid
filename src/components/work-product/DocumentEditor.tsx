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
  AlertCircle,
  TrendingUp
} from 'lucide-react';
import { useNavigationStoreRefactored } from '@/stores/navigation-store-refactored';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface DocumentEditorProps {
  workProduct: WorkProduct;
  onSave?: (sections: DocumentSection[]) => void;
  onStatusChange?: (status: WorkProductStatus) => void;
  onBack?: () => void;
}

export function DocumentEditor({ workProduct, onSave, onStatusChange, onBack }: DocumentEditorProps) {
  const { navigationMode } = useNavigationStoreRefactored();
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

  const [aiSuggestions, setAISuggestions] = useState<any[]>([]);
  const [isGeneratingContent, setIsGeneratingContent] = useState(false);
  const [writingAssistance, setWritingAssistance] = useState<{
    suggestions: string[];
    improvements: string[];
    dataInsights: string[];
  }>({
    suggestions: [],
    improvements: [],
    dataInsights: []
  });

  // Real-time writing assistance
  useEffect(() => {
    if (currentSection && navigationMode !== 'traditional') {
      generateWritingAssistance(currentSection);
    }
  }, [currentSection, navigationMode]);

  const generateWritingAssistance = async (section: DocumentSection) => {
    // Generate contextual suggestions based on section content and type
    const suggestions = [];
    const improvements = [];
    const dataInsights = [];

    // Content suggestions based on section type
    if (section.type === 'financial_block') {
      suggestions.push('Include key financial metrics and ratios');
      suggestions.push('Add benchmark comparisons');
      suggestions.push('Highlight growth trends and projections');
      dataInsights.push('Deal value: $50M in Technology sector');
      dataInsights.push('EBITDA margin: 30% above industry average');
    } else if (section.title.toLowerCase().includes('executive')) {
      suggestions.push('Start with the investment recommendation');
      suggestions.push('Highlight key value drivers');
      suggestions.push('Include risk mitigation strategies');
    } else if (section.title.toLowerCase().includes('market')) {
      suggestions.push('Define total addressable market');
      suggestions.push('Analyze competitive landscape');
      suggestions.push('Identify growth catalysts');
    }

    // Content improvements based on current content
    if (section.content.length < 100) {
      improvements.push('Section content appears brief - consider adding more detail');
    }
    if (!section.content.includes('$') && section.type === 'financial_block') {
      improvements.push('Add specific financial figures and metrics');
    }
    if (section.content.length > 1000) {
      improvements.push('Consider breaking down into subsections for clarity');
    }

    setWritingAssistance({ suggestions, improvements, dataInsights });
  };

  const handleGenerateContent = async (sectionId: string) => {
    setIsGeneratingContent(true);
    
    try {
      // Mock API call for content generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockGeneratedContent = generateMockContent(currentSection);
      handleContentChange(sectionId, mockGeneratedContent);
      
      // Update AI suggestions after generation
      const newSuggestions = [
        {
          id: 'content-generated',
          type: 'success',
          title: 'Content Generated Successfully',
          description: 'AI has generated initial content. Review and customize as needed.',
          action: 'review'
        },
        {
          id: 'optimize-content',
          type: 'improvement',
          title: 'Optimize for Executive Audience',
          description: 'Adjust tone and structure for executive presentation.',
          action: 'optimize'
        }
      ];
      
      setAISuggestions(newSuggestions);
    } catch (error) {
      console.error('Content generation failed:', error);
    } finally {
      setIsGeneratingContent(false);
    }
  };

  const generateMockContent = (section: DocumentSection | undefined) => {
    if (!section) return '';
    
    const mockContent = {
      'Executive Summary': `# Executive Summary

TechCorp represents a compelling investment opportunity in the rapidly growing technology sector. With a deal value of $50M, this growth-stage investment aligns with our strategic focus on scalable technology platforms.

## Key Investment Highlights
- **Market Leadership**: Dominant position in the B2B SaaS market with 40% market share
- **Strong Financials**: $15M ARR with 35% YoY growth and 85% gross margins
- **Experienced Team**: Proven management team with successful exits
- **Clear Value Creation**: Identified opportunities for 3x revenue growth over 5 years

## Investment Recommendation
We recommend proceeding with the $50M investment at a pre-money valuation of $150M, targeting a 25% IRR over a 5-year hold period.`,

      'Financial Analysis': `# Financial Analysis

## Revenue Analysis
**Annual Recurring Revenue (ARR)**: $15M
**Growth Rate**: 35% YoY
**Customer Metrics**:
- 150 enterprise customers
- $100K average contract value
- 98% retention rate
- 125% net revenue retention

## Profitability Metrics
**Gross Margin**: 85%
**EBITDA Margin**: 25%
**Free Cash Flow**: $2.5M positive
**Unit Economics**: LTV/CAC ratio of 4.2x

## Financial Projections
Based on our analysis, we project:
- **Year 1**: $20M ARR (33% growth)
- **Year 3**: $40M ARR (26% CAGR)
- **Year 5**: $75M ARR (21% CAGR)

The financial model supports a potential exit valuation of $450-600M in Year 5.`
    };

    return mockContent[section.title as keyof typeof mockContent] || 
           `Generated content for ${section.title} section with relevant analysis and insights.`;
  };

  const handleInsertMetrics = () => {
    if (!currentSection) return;
    
    const metricsContent = `

**Key Metrics:**
- Deal Value: $50M
- Sector: Technology
- Team Size: 4 members
- Risk Rating: Medium
- Expected IRR: 25%
- Hold Period: 5 years
`;

    const updatedContent = currentSection.content + metricsContent;
    handleContentChange(currentSection.id, updatedContent);
  };

  const handleOptimizeContent = async () => {
    if (!currentSection) return;

    try {
      const response = await fetch('/api/content-transformation/optimize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workProduct: {
            title: workProduct.title,
            sections: sections,
            metadata: workProduct.metadata
          },
          optimizationOptions: {
            audience: 'executives',
            tone: 'professional',
            length: 'standard',
            industry: 'technology'
          }
        })
      });

      if (response.ok) {
        const result = await response.json();
        const optimizedSection = result.data.optimizedWorkProduct.sections.find(
          (s: any) => s.id === currentSection.id
        );
        
        if (optimizedSection) {
          handleContentChange(currentSection.id, optimizedSection.content);
        }
      }
    } catch (error) {
      console.error('Optimization failed:', error);
    }
  };

  const renderAIAssistant = () => {
    if (!showAIAssistant || navigationMode === 'traditional') return null;

    return (
      <Card className="p-4 mb-4 bg-gradient-to-r from-violet-50 to-blue-50 border-violet-200">
        <div className="flex items-start gap-3">
          <Wand2 className="w-5 h-5 text-violet-600 mt-1" />
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-violet-900 mb-2">
              🤖 AI Writing Assistant
              {navigationMode === 'autonomous' && <Badge className="ml-2 bg-blue-100 text-blue-700">Autonomous</Badge>}
            </h3>
            
            {/* Content Generation */}
            <div className="space-y-3">
              <div className="p-3 bg-white rounded border border-violet-200">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-gray-900">Content Generation</h4>
                  {isGeneratingContent && (
                    <div className="flex items-center text-blue-600">
                      <div className="animate-spin w-3 h-3 border border-blue-600 border-t-transparent rounded-full mr-1"></div>
                      <span className="text-xs">Generating...</span>
                    </div>
                  )}
                </div>
                <p className="text-sm text-gray-700 mb-2">
                  Generate AI-powered content for "{currentSection?.title}" using project context and industry best practices.
                </p>
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleGenerateContent(currentSection?.id || '')}
                    disabled={isGeneratingContent || !currentSection}
                  >
                    <Sparkles className="w-3 h-3 mr-1" />
                    Generate Content
                  </Button>
                  <Button size="sm" variant="ghost" onClick={handleInsertMetrics}>
                    📊 Insert Metrics
                  </Button>
                </div>
              </div>

              {/* Writing Suggestions */}
              {writingAssistance.suggestions.length > 0 && (
                <div className="p-3 bg-white rounded border border-violet-200">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Writing Suggestions</h4>
                  <ul className="space-y-1">
                    {writingAssistance.suggestions.map((suggestion, index) => (
                      <li key={index} className="text-sm text-gray-700 flex items-start">
                        <span className="text-violet-500 mr-2">•</span>
                        {suggestion}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Content Improvements */}
              {writingAssistance.improvements.length > 0 && (
                <div className="p-3 bg-white rounded border border-orange-200 bg-orange-50">
                  <h4 className="text-sm font-medium text-orange-900 mb-2">
                    <AlertCircle className="w-4 h-4 inline mr-1" />
                    Content Improvements
                  </h4>
                  <ul className="space-y-1">
                    {writingAssistance.improvements.map((improvement, index) => (
                      <li key={index} className="text-sm text-orange-700 flex items-start">
                        <span className="text-orange-500 mr-2">•</span>
                        {improvement}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Data Insights */}
              {writingAssistance.dataInsights.length > 0 && (
                <div className="p-3 bg-white rounded border border-blue-200 bg-blue-50">
                  <h4 className="text-sm font-medium text-blue-900 mb-2">
                    📊 Available Data
                  </h4>
                  <ul className="space-y-1">
                    {writingAssistance.dataInsights.map((insight, index) => (
                      <li key={index} className="text-sm text-blue-700 flex items-start">
                        <span className="text-blue-500 mr-2">•</span>
                        {insight}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {navigationMode === 'autonomous' && (
                <div className="p-3 bg-white rounded border border-blue-200">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Autonomous Actions</h4>
                  <div className="space-y-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={handleOptimizeContent}
                    >
                      <Wand2 className="w-3 h-3 mr-2" />
                      Auto-optimize for executives
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="w-full justify-start"
                    >
                      <TrendingUp className="w-3 h-3 mr-2" />
                      Update with latest data
                    </Button>
                  </div>
                </div>
              )}

              {/* AI Suggestions */}
              {aiSuggestions.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-900">Smart Suggestions</h4>
                  {aiSuggestions.map((suggestion) => (
                    <div key={suggestion.id} className={`p-2 rounded border text-sm ${
                      suggestion.type === 'success' ? 'bg-green-50 border-green-200' :
                      suggestion.type === 'improvement' ? 'bg-blue-50 border-blue-200' :
                      'bg-gray-50 border-gray-200'
                    }`}>
                      <div className="font-medium">{suggestion.title}</div>
                      <div className="text-gray-600 text-xs mt-1">{suggestion.description}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {navigationMode === 'autonomous' && (
              <div className="space-y-2">
                <div className="p-3 bg-white rounded border border-blue-200">
                  <p className="text-sm text-gray-700">
                    🔄 I continuously monitor your TechCorp Due Diligence workspace for updates and will automatically refresh document sections when new data becomes available.
                    Current status: Active project (75% complete), 4 team members, 8 work products.
                  </p>
                  <div className="flex gap-2 mt-2">
                    <Button size="sm" variant="outline">View Project Status</Button>
                    <Button size="sm" variant="outline">Data Sources</Button>
                  </div>
                </div>
              </div>
            )}
          </div>
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
          <div className="prose prose-sm max-w-none">
            {currentSection?.content ? (
              <ReactMarkdown 
                remarkPlugins={[remarkGfm]}
                components={{
                  // Style headings
                  h1: ({children}) => <h1 className="text-2xl font-bold text-gray-900 mb-4 mt-6 first:mt-0">{children}</h1>,
                  h2: ({children}) => <h2 className="text-xl font-semibold text-gray-900 mb-3 mt-5 first:mt-0">{children}</h2>,
                  h3: ({children}) => <h3 className="text-lg font-semibold text-gray-900 mb-2 mt-4 first:mt-0">{children}</h3>,
                  h4: ({children}) => <h4 className="text-base font-semibold text-gray-900 mb-2 mt-3 first:mt-0">{children}</h4>,
                  // Style lists
                  ul: ({children}) => <ul className="list-disc list-inside space-y-1 text-gray-700 mb-4">{children}</ul>,
                  ol: ({children}) => <ol className="list-decimal list-inside space-y-1 text-gray-700 mb-4">{children}</ol>,
                  li: ({children}) => <li className="text-gray-700">{children}</li>,
                  // Style paragraphs
                  p: ({children}) => <p className="text-gray-700 mb-3 leading-relaxed">{children}</p>,
                  // Style emphasis
                  strong: ({children}) => <strong className="font-semibold text-gray-900">{children}</strong>,
                  em: ({children}) => <em className="italic text-gray-700">{children}</em>,
                  // Style code
                  code: ({children}) => <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono text-gray-800">{children}</code>,
                  pre: ({children}) => <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto mb-4">{children}</pre>,
                  // Style blockquotes
                  blockquote: ({children}) => <blockquote className="border-l-4 border-gray-300 pl-4 italic text-gray-600 my-4">{children}</blockquote>,
                  // Style tables
                  table: ({children}) => <table className="min-w-full border border-gray-200 mb-4">{children}</table>,
                  thead: ({children}) => <thead className="bg-gray-50">{children}</thead>,
                  tbody: ({children}) => <tbody>{children}</tbody>,
                  tr: ({children}) => <tr className="border-b border-gray-200">{children}</tr>,
                  th: ({children}) => <th className="px-4 py-2 text-left font-semibold text-gray-900">{children}</th>,
                  td: ({children}) => <td className="px-4 py-2 text-gray-700">{children}</td>,
                  // Style links
                  a: ({children, href}) => <a href={href} className="text-blue-600 hover:text-blue-800 underline">{children}</a>,
                  // Style horizontal rules
                  hr: () => <hr className="border-gray-300 my-6" />
                }}
              >
                {currentSection.content}
              </ReactMarkdown>
            ) : (
              <p className="text-gray-500 italic">No content yet. Click Edit to start writing.</p>
            )}
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
                    <p className="text-sm text-gray-700">"TechCorp Due Diligence shows strong fundamentals: $50M deal value, Technology sector, 75% completion with medium risk rating..."</p>
                  </button>
                  <button className="text-left p-2 bg-white rounded border border-blue-200 hover:border-blue-300 transition-colors w-full">
                    <p className="text-sm text-gray-700">"Team of 4 members (Sarah Chen, Mike Rodriguez, Alex Johnson, Lisa Park) has delivered 8 work products to date..."</p>
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