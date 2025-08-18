'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  SmartTemplate,
  TemplateSection,
  DocumentSection,
  WorkProduct,
  ContentGenerationRequest,
  ProjectContext,
  WorkProductType
} from '@/types/work-product';
import { 
  DragDropContext, 
  Droppable, 
  Draggable,
  DropResult
} from '@hello-pangea/dnd';
import { 
  Plus,
  GripVertical,
  Wand2,
  Eye,
  EyeOff,
  Settings,
  FileText,
  BarChart3,
  Calculator,
  Shield,
  TrendingUp,
  Sparkles,
  Clock,
  CheckCircle,
  AlertCircle,
  X,
  Edit3,
  Download,
  Share2
} from 'lucide-react';
import { useNavigationStore } from '@/stores/navigation-store';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface ContentAssemblerProps {
  template?: SmartTemplate;
  projectContext: ProjectContext;
  onSave: (workProduct: WorkProduct) => void;
  onCancel: () => void;
  className?: string;
}

interface SectionPreview {
  id: string;
  title: string;
  content: string;
  type: DocumentSection['type'];
  generationStrategy: DocumentSection['generationStrategy'];
  isGenerating: boolean;
  quality: number;
  wordCount: number;
  estimatedTime: number;
}

interface AISuggestion {
  id: string;
  type: 'section' | 'content' | 'structure' | 'optimization';
  title: string;
  description: string;
  confidence: number;
  action: () => void;
  previewable: boolean;
}

export function ContentAssembler({
  template,
  projectContext,
  onSave,
  onCancel,
  className = ''
}: ContentAssemblerProps) {
  const { currentMode } = useNavigationStore();
  const navigationMode = currentMode?.mode || 'traditional';
  
  // State management
  const [workProduct, setWorkProduct] = useState<Partial<WorkProduct>>({
    title: `${projectContext.projectName} - Document`,
    type: template?.workProductType || 'INVESTMENT_SUMMARY',
    sections: [],
    metadata: { projectContext }
  });
  
  const [sections, setSections] = useState<SectionPreview[]>([]);
  const [aiSuggestions, setAISuggestions] = useState<AISuggestion[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [showAISuggestions, setShowAISuggestions] = useState(navigationMode !== 'traditional');
  
  // Refs for drag and drop
  const dragEndTimeout = useRef<NodeJS.Timeout>();

  // Initialize sections from template
  useEffect(() => {
    if (template) {
      const initialSections: SectionPreview[] = template.sections.map(templateSection => ({
        id: templateSection.id,
        title: templateSection.title,
        content: '',
        type: templateSection.type,
        generationStrategy: templateSection.generationStrategy,
        isGenerating: false,
        quality: 0,
        wordCount: 0,
        estimatedTime: templateSection.estimatedLength ? Math.ceil(templateSection.estimatedLength / 200) : 2
      }));
      
      setSections(initialSections);
      generateInitialAISuggestions(template, projectContext);
    }
  }, [template, projectContext]);

  // Generate AI suggestions based on context
  const generateInitialAISuggestions = useCallback(async (
    template: SmartTemplate, 
    context: ProjectContext
  ) => {
    const suggestions: AISuggestion[] = [];

    // Content generation suggestions
    if (navigationMode === 'autonomous' || navigationMode === 'assisted') {
      suggestions.push({
        id: 'generate-all-content',
        type: 'content',
        title: 'Generate All Content',
        description: `Use AI to generate all sections based on ${context.projectName} data`,
        confidence: 0.9,
        action: () => handleGenerateAllContent(),
        previewable: true
      });

      suggestions.push({
        id: 'optimize-for-audience',
        type: 'optimization',
        title: 'Optimize for Executives',
        description: 'Adjust content tone and structure for executive audience',
        confidence: 0.85,
        action: () => handleOptimizeForAudience('executives'),
        previewable: true
      });
    }

    // Structural suggestions
    if (context.sector === 'Technology') {
      suggestions.push({
        id: 'add-tech-sections',
        type: 'section',
        title: 'Add Technology Sections',
        description: 'Include technology-specific analysis sections',
        confidence: 0.8,
        action: () => handleAddTechSections(),
        previewable: false
      });
    }

    if (context.dealValue && context.dealValue > 100000000) {
      suggestions.push({
        id: 'add-regulatory-section',
        type: 'section',
        title: 'Add Regulatory Analysis',
        description: 'Large deals require enhanced regulatory considerations',
        confidence: 0.75,
        action: () => handleAddRegulatorySection(),
        previewable: false
      });
    }

    // Data integration suggestions
    suggestions.push({
      id: 'integrate-financial-data',
      type: 'content',
      title: 'Integrate Financial Data',
      description: 'Pull live financial metrics from deal data',
      confidence: 0.9,
      action: () => handleIntegrateFinancialData(),
      previewable: true
    });

    setAISuggestions(suggestions);
  }, [navigationMode]);

  // Handle drag and drop reordering
  const handleDragEnd = useCallback((result: DropResult) => {
    if (!result.destination) return;

    const newSections = Array.from(sections);
    const [reorderedSection] = newSections.splice(result.source.index, 1);
    newSections.splice(result.destination.index, 0, reorderedSection);

    setSections(newSections);

    // Clear any existing timeout
    if (dragEndTimeout.current) {
      clearTimeout(dragEndTimeout.current);
    }

    // Add AI suggestion for reordering if in assisted/autonomous mode
    if (navigationMode !== 'traditional') {
      dragEndTimeout.current = setTimeout(() => {
        const reorderSuggestion: AISuggestion = {
          id: 'validate-reorder',
          type: 'structure',
          title: 'Validate Section Order',
          description: 'Review if new section order improves document flow',
          confidence: 0.7,
          action: () => handleValidateOrder(newSections),
          previewable: true
        };
        
        setAISuggestions(prev => [reorderSuggestion, ...prev.slice(0, 4)]);
      }, 1000);
    }
  }, [sections, navigationMode]);

  // Content generation handlers
  const handleGenerateSection = useCallback(async (sectionId: string) => {
    // Check if section exists first
    const sectionExists = sections.some(s => s.id === sectionId);
    if (!sectionExists) {
      console.error(`Cannot generate content for section ${sectionId}: section not found`);
      return;
    }

    setSections(prev => prev.map(section => 
      section.id === sectionId 
        ? { ...section, isGenerating: true }
        : section
    ));

    try {
      // Simulate AI content generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const generatedContent = await generateSectionContent(sectionId, projectContext);
      
      setSections(prev => prev.map(section => 
        section.id === sectionId 
          ? { 
              ...section, 
              content: generatedContent.content,
              isGenerating: false,
              quality: generatedContent.quality,
              wordCount: generatedContent.wordCount
            }
          : section
      ));

      // Add follow-up suggestions
      addFollowUpSuggestions(sectionId, generatedContent);

    } catch (error) {
      setSections(prev => prev.map(section => 
        section.id === sectionId 
          ? { ...section, isGenerating: false }
          : section
      ));
      console.error('Section generation failed:', error);
    }
  }, [projectContext]);

  const handleGenerateAllContent = useCallback(async () => {
    setIsGenerating(true);
    
    try {
      const request: ContentGenerationRequest = {
        templateId: template?.id || 'default',
        workspaceId: projectContext.projectId,
        projectContext,
        generationMode: navigationMode,
        options: {
          includeDataBindings: true,
          generateAllSections: true,
          validateContent: true,
          optimizeForReadability: true
        }
      };

      const response = await fetch('/api/content-transformation/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request)
      });

      if (!response.ok) throw new Error('Generation failed');

      const result = await response.json();
      const generatedWorkProduct = result.data.workProduct;

      // Update sections with generated content
      const updatedSections = generatedWorkProduct.sections.map((section: DocumentSection) => ({
        id: section.id,
        title: section.title,
        content: section.content,
        type: section.type,
        generationStrategy: section.generationStrategy,
        isGenerating: false,
        quality: section.qualityScore || 0.85,
        wordCount: section.content.split(/\s+/).length,
        estimatedTime: Math.ceil(section.content.split(/\s+/).length / 200)
      }));

      setSections(updatedSections);
      setWorkProduct(prev => ({ ...prev, ...generatedWorkProduct }));

      // Add success suggestion
      const successSuggestion: AISuggestion = {
        id: 'generation-complete',
        type: 'optimization',
        title: 'Content Generated Successfully',
        description: `Generated ${updatedSections.length} sections with ${Math.round(result.data.generationMetrics.qualityScore * 100)}% quality score`,
        confidence: 1.0,
        action: () => setShowPreview(true),
        previewable: true
      };

      setAISuggestions(prev => [successSuggestion, ...prev]);

    } catch (error) {
      console.error('Content generation failed:', error);
    } finally {
      setIsGenerating(false);
    }
  }, [template, projectContext, navigationMode]);

  // Section management
  const handleAddSection = useCallback((sectionType: DocumentSection['type']) => {
    const newSection: SectionPreview = {
      id: `custom-section-${Date.now()}`,
      title: `New ${sectionType.replace('_', ' ')} Section`,
      content: '',
      type: sectionType,
      generationStrategy: 'ai-generated',
      isGenerating: false,
      quality: 0,
      wordCount: 0,
      estimatedTime: 2
    };

    setSections(prev => {
      const updatedSections = [...prev, newSection];
      
      // Add AI suggestion for new section after state update
      if (navigationMode !== 'traditional') {
        // Use setTimeout to ensure the state has been updated
        setTimeout(() => {
          const addSuggestion: AISuggestion = {
            id: `populate-${newSection.id}-${Math.random().toString(36).substr(2, 9)}`,
            type: 'content',
            title: `Populate ${newSection.title}`,
            description: 'Generate content for the new section',
            confidence: 0.8,
            action: () => handleGenerateSection(newSection.id),
            previewable: true
          };

          setAISuggestions(prev => {
            // Remove any existing suggestions for the same section
            const filteredSuggestions = prev.filter(s => !s.id.includes(`populate-${newSection.id}`));
            return [addSuggestion, ...filteredSuggestions.slice(0, 4)];
          });
        }, 100);
      }
      
      return updatedSections;
    });
  }, [navigationMode, handleGenerateSection]);

  const handleRemoveSection = useCallback((sectionId: string) => {
    setSections(prev => prev.filter(section => section.id !== sectionId));
  }, []);

  const handleSectionEdit = useCallback((sectionId: string, newContent: string) => {
    setSections(prev => prev.map(section => 
      section.id === sectionId 
        ? { 
            ...section, 
            content: newContent,
            wordCount: newContent.split(/\s+/).length,
            estimatedTime: Math.ceil(newContent.split(/\s+/).length / 200)
          }
        : section
    ));
  }, []);

  // AI suggestion handlers
  const handleOptimizeForAudience = async (audience: string) => {
    // Implementation for audience optimization
    console.log(`Optimizing for ${audience}`);
  };

  const handleAddTechSections = () => {
    const techSections: SectionPreview[] = [
      {
        id: 'tech-stack-analysis',
        title: 'Technology Stack Analysis',
        content: '',
        type: 'text',
        generationStrategy: 'ai-generated',
        isGenerating: false,
        quality: 0,
        wordCount: 0,
        estimatedTime: 3
      },
      {
        id: 'digital-transformation',
        title: 'Digital Transformation Potential',
        content: '',
        type: 'text',
        generationStrategy: 'ai-generated',
        isGenerating: false,
        quality: 0,
        wordCount: 0,
        estimatedTime: 4
      }
    ];

    setSections(prev => [...prev, ...techSections]);
  };

  const handleAddRegulatorySection = () => {
    const regulatorySection: SectionPreview = {
      id: 'regulatory-analysis',
      title: 'Regulatory and Compliance Analysis',
      content: '',
      type: 'text',
      generationStrategy: 'ai-generated',
      isGenerating: false,
      quality: 0,
      wordCount: 0,
      estimatedTime: 5
    };

    setSections(prev => [...prev, regulatorySection]);
  };

  const handleIntegrateFinancialData = async () => {
    // Implementation for financial data integration
    console.log('Integrating financial data');
  };

  const handleValidateOrder = (sections: SectionPreview[]) => {
    // Implementation for section order validation
    console.log('Validating section order');
  };

  // Helper functions
  const generateSectionContent = async (sectionId: string, context: ProjectContext) => {
    // Get the current sections state to find the section
    const currentSections = sections;
    let section = currentSections.find(s => s.id === sectionId);
    
    // If not found, this might be a new section that hasn't been added to state yet
    // Create a default section object for generation
    if (!section) {
      console.warn(`Section ${sectionId} not found in current state, using defaults`);
      section = {
        id: sectionId,
        title: sectionId.includes('custom-section') ? 'Custom Section' : 'New Section',
        content: '',
        type: 'text' as const,
        generationStrategy: 'ai-generated' as const,
        isGenerating: false,
        quality: 0,
        wordCount: 0,
        estimatedTime: 2
      };
    }

    try {
      // Call the real AI generation API
      const response = await fetch('/api/content/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sectionId,
          sectionTitle: section.title,
          sectionType: section.type,
          projectContext: context,
          generationStrategy: section.generationStrategy || 'ai-generated',
          existingContent: section.content
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to generate content: ${response.statusText}`);
      }

      const result = await response.json();
      
      return {
        content: result.content,
        quality: result.quality,
        wordCount: result.wordCount
      };
    } catch (error) {
      console.error('Error generating content:', error);
      
      // Fallback to basic generated content if API fails
      const fallbackContent = `# ${section.title}\n\nAI-generated content for ${section.title} section based on ${context.projectName} analysis.\n\nThis section provides comprehensive analysis relevant to the ${context.sector} sector investment opportunity.\n\n*Note: This is fallback content due to generation service unavailability.*`;
      
      return {
        content: fallbackContent,
        quality: 0.65,
        wordCount: fallbackContent.split(/\s+/).length
      };
    }
  };

  const addFollowUpSuggestions = (sectionId: string, generatedContent: any) => {
    if (generatedContent.quality < 0.8) {
      const improveSuggestion: AISuggestion = {
        id: `improve-${sectionId}`,
        type: 'optimization',
        title: 'Improve Section Quality',
        description: 'Content quality could be enhanced with additional data',
        confidence: 0.7,
        action: () => handleGenerateSection(sectionId),
        previewable: true
      };

      setAISuggestions(prev => [improveSuggestion, ...prev.slice(0, 4)]);
    }
  };

  const handleSaveWorkProduct = () => {
    const finalWorkProduct: WorkProduct = {
      id: `wp-${Date.now()}`,
      workspaceId: projectContext.projectId,
      title: workProduct.title || `${projectContext.projectName} - Document`,
      type: workProduct.type || 'INVESTMENT_SUMMARY',
      status: 'DRAFT',
      templateId: template?.id,
      sections: sections.map(section => ({
        id: section.id,
        title: section.title,
        order: sections.indexOf(section),
        content: section.content,
        type: section.type,
        required: true,
        generationStrategy: section.generationStrategy,
        qualityScore: section.quality
      })),
      metadata: workProduct.metadata || {},
      createdBy: 'content-assembler',
      createdAt: new Date(),
      updatedAt: new Date(),
      version: '1.0',
      versionHistory: [],
      wordCount: sections.reduce((total, section) => total + section.wordCount, 0),
      readingTime: Math.ceil(sections.reduce((total, section) => total + section.wordCount, 0) / 200),
      collaboratorCount: 1,
      commentCount: 0,
      editCount: 0
    };

    onSave(finalWorkProduct);
  };

  const getSectionIcon = (type: DocumentSection['type']) => {
    switch (type) {
      case 'financial_block': return Calculator;
      case 'chart': return BarChart3;
      case 'data_block': return TrendingUp;
      default: return FileText;
    }
  };

  const getQualityColor = (quality: number) => {
    if (quality >= 0.9) return 'text-green-600';
    if (quality >= 0.7) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className={`flex h-full bg-gray-50 ${className}`}>
      {/* Main Content Assembly Area */}
      <div className="flex-1 p-6">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Content Assembler</h1>
              <p className="text-gray-600">
                Build and customize your document with AI assistance
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Badge variant="outline" className={`${
                navigationMode === 'autonomous' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                navigationMode === 'assisted' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                'bg-gray-50 text-gray-700 border-gray-200'
              }`}>
                {navigationMode.charAt(0).toUpperCase() + navigationMode.slice(1)} Mode
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowPreview(!showPreview)}
              >
                {showPreview ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                {showPreview ? 'Hide Preview' : 'Show Preview'}
              </Button>
            </div>
          </div>

          {/* Document Header */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <Input
                    value={workProduct.title}
                    onChange={(e) => setWorkProduct(prev => ({ ...prev, title: e.target.value }))}
                    className="text-lg font-semibold border-none shadow-none text-gray-900 p-0"
                    placeholder="Document title..."
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    {projectContext.projectName} • {projectContext.sector} • $
                    {(projectContext.dealValue || 0) / 1000000}M
                  </p>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <span>{sections.reduce((total, section) => total + section.wordCount, 0)} words</span>
                  <span>•</span>
                  <span>{Math.ceil(sections.reduce((total, section) => total + section.wordCount, 0) / 200)} min read</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sections List */}
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="sections">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
                {sections.map((section, index) => (
                  <Draggable key={section.id} draggableId={section.id} index={index}>
                    {(provided, snapshot) => (
                      <Card
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={`transition-shadow ${
                          snapshot.isDragging ? 'shadow-lg' : 'shadow-sm'
                        } ${selectedSection === section.id ? 'ring-2 ring-blue-500' : ''}`}
                      >
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div
                                {...provided.dragHandleProps}
                                className="text-gray-400 hover:text-gray-600 cursor-move"
                              >
                                <GripVertical className="w-5 h-5" />
                              </div>
                              {React.createElement(getSectionIcon(section.type), {
                                className: "w-5 h-5 text-gray-600"
                              })}
                              <div>
                                <h3 className="font-semibold text-gray-900">{section.title}</h3>
                                <div className="flex items-center space-x-2 text-sm text-gray-500">
                                  <span>{section.type.replace('_', ' ')}</span>
                                  <span>•</span>
                                  <span>{section.wordCount} words</span>
                                  {section.quality > 0 && (
                                    <>
                                      <span>•</span>
                                      <span className={getQualityColor(section.quality)}>
                                        {Math.round(section.quality * 100)}% quality
                                      </span>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              {section.isGenerating ? (
                                <div className="flex items-center space-x-2 text-blue-600">
                                  <div className="animate-spin w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                                  <span className="text-sm">Generating...</span>
                                </div>
                              ) : (
                                <>
                                  {section.content && (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => setSelectedSection(
                                        selectedSection === section.id ? null : section.id
                                      )}
                                    >
                                      <Edit3 className="w-4 h-4" />
                                    </Button>
                                  )}
                                  {(navigationMode === 'assisted' || navigationMode === 'autonomous') && (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleGenerateSection(section.id)}
                                      disabled={section.isGenerating}
                                    >
                                      <Wand2 className="w-4 h-4" />
                                    </Button>
                                  )}
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleRemoveSection(section.id)}
                                  >
                                    <X className="w-4 h-4" />
                                  </Button>
                                </>
                              )}
                            </div>
                          </div>
                        </CardHeader>
                        
                        {(selectedSection === section.id || showPreview) && (
                          <CardContent className="pt-0">
                            {section.content ? (
                              <div className="prose prose-sm max-w-none">
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                  {section.content}
                                </ReactMarkdown>
                              </div>
                            ) : (
                              <div className="text-center py-8 text-gray-500">
                                <FileText className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                                <p>No content generated yet</p>
                                {(navigationMode === 'assisted' || navigationMode === 'autonomous') && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleGenerateSection(section.id)}
                                    className="mt-2"
                                  >
                                    <Wand2 className="w-4 h-4 mr-2" />
                                    Generate Content
                                  </Button>
                                )}
                              </div>
                            )}
                          </CardContent>
                        )}
                      </Card>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
                
                {/* Add Section Button */}
                <Card className="border-dashed border-2 border-gray-300 hover:border-gray-400 transition-colors">
                  <CardContent className="p-6">
                    <div className="text-center">
                      <Plus className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                      <p className="text-gray-600 mb-4">Add a new section</p>
                      <div className="flex justify-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleAddSection('text')}
                        >
                          <FileText className="w-4 h-4 mr-2" />
                          Text
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleAddSection('financial_block')}
                        >
                          <Calculator className="w-4 h-4 mr-2" />
                          Financial
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleAddSection('chart')}
                        >
                          <BarChart3 className="w-4 h-4 mr-2" />
                          Chart
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </Droppable>
        </DragDropContext>

        {/* Action Buttons */}
        <div className="flex justify-between items-center mt-8 pt-6 border-t">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <div className="flex space-x-3">
            {(navigationMode === 'assisted' || navigationMode === 'autonomous') && (
              <Button
                variant="outline"
                onClick={handleGenerateAllContent}
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <div className="flex items-center">
                    <div className="animate-spin w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full mr-2"></div>
                    Generating...
                  </div>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate All Content
                  </>
                )}
              </Button>
            )}
            <Button onClick={handleSaveWorkProduct}>
              <CheckCircle className="w-4 h-4 mr-2" />
              Save Document
            </Button>
          </div>
        </div>
      </div>

      {/* AI Suggestions Sidebar */}
      {showAISuggestions && (
        <div className="w-80 bg-white border-l p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">AI Suggestions</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAISuggestions(false)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="space-y-3">
            {aiSuggestions.map((suggestion) => (
              <Card key={suggestion.id} className="transition-shadow hover:shadow-md">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Sparkles className="w-4 h-4 text-blue-500" />
                      <span className="text-sm font-medium text-gray-900">
                        {suggestion.title}
                      </span>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {Math.round(suggestion.confidence * 100)}%
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    {suggestion.description}
                  </p>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      onClick={suggestion.action}
                      className="flex-1"
                    >
                      Apply
                    </Button>
                    {suggestion.previewable && (
                      <Button variant="outline" size="sm">
                        Preview
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}

            {aiSuggestions.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Sparkles className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <p>No suggestions available</p>
                <p className="text-sm">Start adding content to get AI recommendations</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}