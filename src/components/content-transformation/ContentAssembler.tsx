'use client';

import React, { useReducer, useCallback, useRef, useEffect, useState } from 'react';
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
  SMART_TEMPLATES,
  getTemplatesByIndustry,
  getTemplatesByStage
} from '@/lib/templates/smart-templates';
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
import { useNavigationStoreRefactored } from '@/stores/navigation-store-refactored';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { 
  isSuccessResponse, 
  validateContentGenerationResponse,
  ContentGenerationErrorCodes 
} from '@/types/api-responses';

interface ContentAssemblerProps {
  template?: SmartTemplate;
  projectContext: ProjectContext;
  onSave: (workProduct: WorkProduct) => void;
  onCancel: () => void;
  onTemplateChange?: (template: SmartTemplate) => void;
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
  createdAt: string;
  lastModified: string;
}

interface AISuggestion {
  id: string;
  type: 'section' | 'content' | 'structure' | 'optimization';
  title: string;
  description: string;
  confidence: number;
  action: () => void;
  previewable: boolean;
  sectionId?: string; // Link to specific section
  createdAt: string;
}

interface AssemblerState {
  sections: SectionPreview[];
  aiSuggestions: AISuggestion[];
  pendingGenerations: Set<string>;
  errors: Record<string, string>;
  lastOperation: string | null;
  sectionCounter: number;
}

type AssemblerAction = 
  | { type: 'INITIALIZE_SECTIONS'; payload: SectionPreview[] }
  | { type: 'ADD_SECTION'; payload: Omit<SectionPreview, 'id' | 'createdAt' | 'lastModified'> }
  | { type: 'UPDATE_SECTION'; payload: { id: string; updates: Partial<SectionPreview> } }
  | { type: 'REMOVE_SECTION'; payload: string }
  | { type: 'REORDER_SECTIONS'; payload: { sourceIndex: number; destinationIndex: number } }
  | { type: 'START_GENERATION'; payload: string }
  | { type: 'COMPLETE_GENERATION'; payload: { id: string; content: string; quality: number; wordCount: number } }
  | { type: 'FAIL_GENERATION'; payload: { id: string; error: string } }
  | { type: 'ADD_AI_SUGGESTION'; payload: AISuggestion }
  | { type: 'REMOVE_AI_SUGGESTION'; payload: string }
  | { type: 'CLEAR_ERROR'; payload: string }
  | { type: 'SET_SECTIONS'; payload: SectionPreview[] };

// Utility functions
const generateSectionId = (counter: number): string => {
  return `section-${Date.now()}-${counter}-${Math.random().toString(36).substr(2, 9)}`;
};

const createTimestamp = (): string => new Date().toISOString();

// Reducer for atomic state management
const assemblerReducer = (state: AssemblerState, action: AssemblerAction): AssemblerState => {
  switch (action.type) {
    case 'INITIALIZE_SECTIONS':
      console.log('INITIALIZE_SECTIONS reducer called with:', action.payload.length, 'sections');
      console.log('Section titles:', action.payload.map(s => s.title));
      return {
        ...state,
        sections: action.payload,
        lastOperation: 'initialize',
        errors: {}
      };

    case 'ADD_SECTION': {
      const newSection: SectionPreview = {
        ...action.payload,
        id: generateSectionId(state.sectionCounter),
        createdAt: createTimestamp(),
        lastModified: createTimestamp()
      };
      
      return {
        ...state,
        sections: [...state.sections, newSection],
        sectionCounter: state.sectionCounter + 1,
        lastOperation: `add_section_${newSection.id}`,
        errors: { ...state.errors, [newSection.id]: undefined } // Clear any existing errors
      };
    }

    case 'UPDATE_SECTION': {
      const updatedSections = state.sections.map(section =>
        section.id === action.payload.id
          ? { 
              ...section, 
              ...action.payload.updates, 
              lastModified: createTimestamp(),
              wordCount: action.payload.updates.content 
                ? action.payload.updates.content.split(/\s+/).length 
                : section.wordCount
            }
          : section
      );

      return {
        ...state,
        sections: updatedSections,
        lastOperation: `update_section_${action.payload.id}`,
        errors: { ...state.errors, [action.payload.id]: undefined }
      };
    }

    case 'REMOVE_SECTION': {
      return {
        ...state,
        sections: state.sections.filter(section => section.id !== action.payload),
        pendingGenerations: new Set([...state.pendingGenerations].filter(id => id !== action.payload)),
        aiSuggestions: state.aiSuggestions.filter(suggestion => suggestion.sectionId !== action.payload),
        lastOperation: `remove_section_${action.payload}`,
        errors: { ...state.errors, [action.payload]: undefined }
      };
    }

    case 'REORDER_SECTIONS': {
      const newSections = Array.from(state.sections);
      const [reorderedSection] = newSections.splice(action.payload.sourceIndex, 1);
      newSections.splice(action.payload.destinationIndex, 0, reorderedSection);

      return {
        ...state,
        sections: newSections,
        lastOperation: 'reorder_sections'
      };
    }

    case 'START_GENERATION': {
      const updatedSections = state.sections.map(section =>
        section.id === action.payload
          ? { ...section, isGenerating: true, lastModified: createTimestamp() }
          : section
      );

      return {
        ...state,
        sections: updatedSections,
        pendingGenerations: new Set([...state.pendingGenerations, action.payload]),
        lastOperation: `start_generation_${action.payload}`,
        errors: { ...state.errors, [action.payload]: undefined }
      };
    }

    case 'COMPLETE_GENERATION': {
      const updatedSections = state.sections.map(section =>
        section.id === action.payload.id
          ? {
              ...section,
              content: action.payload.content,
              quality: action.payload.quality,
              wordCount: action.payload.wordCount,
              isGenerating: false,
              lastModified: createTimestamp()
            }
          : section
      );

      const newPendingGenerations = new Set(state.pendingGenerations);
      newPendingGenerations.delete(action.payload.id);

      return {
        ...state,
        sections: updatedSections,
        pendingGenerations: newPendingGenerations,
        lastOperation: `complete_generation_${action.payload.id}`,
        errors: { ...state.errors, [action.payload.id]: undefined }
      };
    }

    case 'FAIL_GENERATION': {
      const updatedSections = state.sections.map(section =>
        section.id === action.payload.id
          ? { ...section, isGenerating: false, lastModified: createTimestamp() }
          : section
      );

      const newPendingGenerations = new Set(state.pendingGenerations);
      newPendingGenerations.delete(action.payload.id);

      return {
        ...state,
        sections: updatedSections,
        pendingGenerations: newPendingGenerations,
        lastOperation: `fail_generation_${action.payload.id}`,
        errors: { ...state.errors, [action.payload.id]: action.payload.error }
      };
    }

    case 'ADD_AI_SUGGESTION':
      return {
        ...state,
        aiSuggestions: [action.payload, ...state.aiSuggestions.slice(0, 4)], // Keep max 5 suggestions
        lastOperation: `add_suggestion_${action.payload.id}`
      };

    case 'REMOVE_AI_SUGGESTION':
      return {
        ...state,
        aiSuggestions: state.aiSuggestions.filter(suggestion => suggestion.id !== action.payload),
        lastOperation: `remove_suggestion_${action.payload}`
      };

    case 'CLEAR_ERROR':
      return {
        ...state,
        errors: { ...state.errors, [action.payload]: undefined }
      };

    case 'SET_SECTIONS':
      return {
        ...state,
        sections: action.payload,
        lastOperation: 'set_sections'
      };

    default:
      return state;
  }
};

export function ContentAssembler({
  template,
  projectContext,
  onSave,
  onCancel,
  onTemplateChange,
  className = ''
}: ContentAssemblerProps) {
  const { currentMode } = useNavigationStoreRefactored();
  const navigationMode = currentMode?.mode || 'traditional';
  
  // Initialize reducer state
  const initialState: AssemblerState = {
    sections: [],
    aiSuggestions: [],
    pendingGenerations: new Set(),
    errors: {},
    lastOperation: null,
    sectionCounter: 0
  };

  const [state, dispatch] = useReducer(assemblerReducer, initialState);
  
  // Additional component state
  const [currentTemplate, setCurrentTemplate] = useState<SmartTemplate | undefined>(template);
  const [workProduct, setWorkProduct] = useState<Partial<WorkProduct>>({
    title: `${projectContext.projectName} - Document`,
    type: currentTemplate?.workProductType || 'INVESTMENT_SUMMARY',
    sections: [],
    metadata: { projectContext }
  });
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [showAISuggestions, setShowAISuggestions] = useState(navigationMode !== 'traditional');
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [editContent, setEditContent] = useState<string>('');
  const [showTemplateSelector, setShowTemplateSelector] = useState<boolean>(!currentTemplate);
  const [availableTemplates, setAvailableTemplates] = useState<SmartTemplate[]>([]);
  
  // Refs for drag and drop
  const dragEndTimeout = useRef<NodeJS.Timeout>();

  // Load available templates based on project context
  useEffect(() => {
    let templates = [...SMART_TEMPLATES];

    // Filter by industry if available
    if (projectContext.sector) {
      const industryTemplates = getTemplatesByIndustry(projectContext.sector);
      if (industryTemplates.length > 0) {
        templates = industryTemplates;
      }
    }

    // Filter by stage if available
    if (projectContext.stage) {
      const stageTemplates = getTemplatesByStage(projectContext.stage);
      if (stageTemplates.length > 0) {
        templates = templates.filter(t => stageTemplates.includes(t));
      }
    }

    setAvailableTemplates(templates);
  }, [projectContext]);

  // Note: Template initialization moved after handleTemplateSelect function definition

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (dragEndTimeout.current) {
        clearTimeout(dragEndTimeout.current);
      }
    };
  }, []);

  // Generate AI suggestions based on context
  const generateInitialAISuggestions = useCallback(async (
    template: SmartTemplate, 
    context: ProjectContext
  ) => {
    const suggestions: AISuggestion[] = [];

    // Content generation suggestions
    if (navigationMode === 'autonomous' || navigationMode === 'assisted') {
      suggestions.push({
        id: `suggestion-${Date.now()}-generate-all`,
        type: 'content',
        title: 'Generate All Content',
        description: `Use AI to generate all sections based on ${context.projectName} data`,
        confidence: 0.9,
        action: () => handleGenerateAllContent(),
        previewable: true,
        createdAt: createTimestamp()
      });

      suggestions.push({
        id: `suggestion-${Date.now()}-optimize`,
        type: 'optimization',
        title: 'Optimize for Executives',
        description: 'Adjust content tone and structure for executive audience',
        confidence: 0.85,
        action: () => handleOptimizeForAudience('executives'),
        previewable: true,
        createdAt: createTimestamp()
      });
    }

    // Structural suggestions
    if (context.sector === 'Technology') {
      suggestions.push({
        id: `suggestion-${Date.now()}-tech`,
        type: 'section',
        title: 'Add Technology Sections',
        description: 'Include technology-specific analysis sections',
        confidence: 0.8,
        action: () => handleAddTechSections(),
        previewable: false,
        createdAt: createTimestamp()
      });
    }

    if (context.dealValue && context.dealValue > 100000000) {
      suggestions.push({
        id: `suggestion-${Date.now()}-regulatory`,
        type: 'section',
        title: 'Add Regulatory Analysis',
        description: 'Large deals require enhanced regulatory considerations',
        confidence: 0.75,
        action: () => handleAddRegulatorySection(),
        previewable: false,
        createdAt: createTimestamp()
      });
    }

    // Add suggestions to state
    suggestions.forEach(suggestion => {
      dispatch({ type: 'ADD_AI_SUGGESTION', payload: suggestion });
    });
  }, [navigationMode]);

  // Content generation handlers
  const handleGenerateSection = useCallback(async (sectionId: string) => {
    // Check if section exists in current state
    const section = state.sections.find(s => s.id === sectionId);
    if (!section) {
      console.error(`Cannot generate content for section ${sectionId}: section not found`);
      dispatch({ 
        type: 'FAIL_GENERATION', 
        payload: { id: sectionId, error: 'Section not found. Please try again.' }
      });
      return;
    }

    // Check if already generating
    if (state.pendingGenerations.has(sectionId)) {
      console.warn(`Generation already in progress for section ${sectionId}`);
      return;
    }

    dispatch({ type: 'START_GENERATION', payload: sectionId });

    try {
      const generatedContent = await generateSectionContent(section, projectContext);
      
      dispatch({ 
        type: 'COMPLETE_GENERATION', 
        payload: {
          id: sectionId,
          content: generatedContent.content,
          quality: generatedContent.quality,
          wordCount: generatedContent.wordCount
        }
      });

      // Auto-expand the section after content generation
      setSelectedSection(sectionId);

      // Scroll to the section
      setTimeout(() => {
        const sectionElement = document.getElementById(`section-${sectionId}`);
        if (sectionElement) {
          sectionElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);

      // Add follow-up suggestions
      addFollowUpSuggestions(sectionId, generatedContent);

    } catch (error) {
      console.error('Section generation failed:', error);
      dispatch({ 
        type: 'FAIL_GENERATION', 
        payload: { 
          id: sectionId, 
          error: error instanceof Error ? error.message : 'Generation failed. Please try again.' 
        }
      });
    }
  }, [state.sections, state.pendingGenerations, projectContext]);

  const handleGenerateAllContent = useCallback(async () => {
    setIsGenerating(true);
    
    try {
      // Get all sections that don't have content yet
      const sectionsToGenerate = state.sections.filter(section => 
        !section.content && 
        !section.isGenerating && 
        !state.pendingGenerations.has(section.id)
      );
      
      if (sectionsToGenerate.length === 0) {
        console.log('All sections already have content');
        setIsGenerating(false);
        return;
      }

      console.log(`Generating content for ${sectionsToGenerate.length} sections...`);

      // Generate content for each section sequentially to avoid overwhelming the API
      let successCount = 0;
      let failureCount = 0;

      for (const section of sectionsToGenerate) {
        try {
          await handleGenerateSection(section.id);
          successCount++;
          
          // Small delay between generations to prevent rate limiting
          if (sectionsToGenerate.length > 1) {
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        } catch (error) {
          console.error(`Failed to generate section ${section.id}:`, error);
          failureCount++;
        }
      }

      // Add completion suggestion
      const completionMessage = failureCount === 0 
        ? `Successfully generated content for all ${successCount} sections`
        : `Generated ${successCount} sections successfully, ${failureCount} failed`;

      const completionSuggestion: AISuggestion = {
        id: `suggestion-${Date.now()}-bulk-complete`,
        type: 'optimization',
        title: 'Bulk Generation Complete',
        description: completionMessage,
        confidence: failureCount === 0 ? 0.95 : 0.7,
        action: () => setShowPreview(true),
        previewable: false,
        createdAt: createTimestamp()
      };

      dispatch({ type: 'ADD_AI_SUGGESTION', payload: completionSuggestion });

      // If there were failures, suggest retry
      if (failureCount > 0) {
        const retryFailuresSuggestion: AISuggestion = {
          id: `suggestion-${Date.now()}-retry-failures`,
          type: 'optimization',
          title: 'Retry Failed Sections',
          description: `${failureCount} sections failed to generate. Click to retry.`,
          confidence: 0.8,
          action: () => handleGenerateAllContent(),
          previewable: false,
          createdAt: createTimestamp()
        };

        dispatch({ type: 'ADD_AI_SUGGESTION', payload: retryFailuresSuggestion });
      }

    } catch (error) {
      console.error('Bulk generation failed:', error);
      
      const errorSuggestion: AISuggestion = {
        id: `suggestion-${Date.now()}-bulk-error`,
        type: 'optimization',
        title: 'Generation Error',
        description: 'Bulk generation encountered an error. Try generating sections individually.',
        confidence: 0.6,
        action: () => console.log('Bulk generation error'),
        previewable: false,
        createdAt: createTimestamp()
      };

      dispatch({ type: 'ADD_AI_SUGGESTION', payload: errorSuggestion });
    } finally {
      setIsGenerating(false);
    }
  }, [state.sections, state.pendingGenerations, handleGenerateSection]);

  // Section management
  const handleAddSection = useCallback((sectionType: DocumentSection['type']) => {
    const newSectionData = {
      title: `New ${sectionType.replace('_', ' ')} Section`,
      content: '',
      type: sectionType,
      generationStrategy: 'ai-generated' as const,
      isGenerating: false,
      quality: 0,
      wordCount: 0,
      estimatedTime: 2
    };

    dispatch({ type: 'ADD_SECTION', payload: newSectionData });

    // Add AI suggestion for new section in next tick
    if (navigationMode !== 'traditional') {
      setTimeout(() => {
        // Get the most recently added section (will have highest counter)
        const sections = state.sections;
        if (sections.length > 0) {
          const latestSection = sections[sections.length - 1];
          
          const addSuggestion: AISuggestion = {
            id: `suggestion-${Date.now()}-populate-${latestSection.id}`,
            type: 'content',
            title: `Populate ${latestSection.title}`,
            description: 'Generate content for the new section',
            confidence: 0.8,
            action: () => handleGenerateSection(latestSection.id),
            previewable: true,
            sectionId: latestSection.id,
            createdAt: createTimestamp()
          };

          dispatch({ type: 'ADD_AI_SUGGESTION', payload: addSuggestion });
        }
      }, 100);
    }
  }, [navigationMode, state.sections, handleGenerateSection]);

  const handleRemoveSection = useCallback((sectionId: string) => {
    dispatch({ type: 'REMOVE_SECTION', payload: sectionId });
  }, []);

  const handleSectionEdit = useCallback((sectionId: string, newContent: string) => {
    dispatch({ 
      type: 'UPDATE_SECTION', 
      payload: { 
        id: sectionId, 
        updates: { content: newContent }
      }
    });
  }, []);

  // Handle drag and drop reordering
  const handleDragEnd = useCallback((result: DropResult) => {
    if (!result.destination) return;

    dispatch({ 
      type: 'REORDER_SECTIONS', 
      payload: { 
        sourceIndex: result.source.index, 
        destinationIndex: result.destination.index 
      }
    });

    // Clear any existing timeout
    if (dragEndTimeout.current) {
      clearTimeout(dragEndTimeout.current);
    }

    // Add AI suggestion for reordering if in assisted/autonomous mode
    if (navigationMode !== 'traditional') {
      dragEndTimeout.current = setTimeout(() => {
        const reorderSuggestion: AISuggestion = {
          id: `suggestion-${Date.now()}-validate-order`,
          type: 'structure',
          title: 'Validate Section Order',
          description: 'Review if new section order improves document flow',
          confidence: 0.7,
          action: () => handleValidateOrder(state.sections),
          previewable: true,
          createdAt: createTimestamp()
        };
        
        dispatch({ type: 'ADD_AI_SUGGESTION', payload: reorderSuggestion });
      }, 1000);
    }
  }, [navigationMode, state.sections]);

  // AI suggestion handlers
  const handleOptimizeForAudience = async (audience: string) => {
    console.log(`Optimizing for ${audience}`);
  };

  const handleAddTechSections = () => {
    const techSections = [
      {
        title: 'Technology Stack Analysis',
        content: '',
        type: 'text' as const,
        generationStrategy: 'ai-generated' as const,
        isGenerating: false,
        quality: 0,
        wordCount: 0,
        estimatedTime: 3
      },
      {
        title: 'Digital Transformation Potential',
        content: '',
        type: 'text' as const,
        generationStrategy: 'ai-generated' as const,
        isGenerating: false,
        quality: 0,
        wordCount: 0,
        estimatedTime: 4
      }
    ];

    techSections.forEach(section => {
      dispatch({ type: 'ADD_SECTION', payload: section });
    });
  };

  const handleAddRegulatorySection = () => {
    const regulatorySection = {
      title: 'Regulatory and Compliance Analysis',
      content: '',
      type: 'text' as const,
      generationStrategy: 'ai-generated' as const,
      isGenerating: false,
      quality: 0,
      wordCount: 0,
      estimatedTime: 5
    };

    dispatch({ type: 'ADD_SECTION', payload: regulatorySection });
  };

  const handleValidateOrder = (sections: SectionPreview[]) => {
    console.log('Validating section order');
  };

  // Content editing functions
  const handleStartEdit = (sectionId: string) => {
    const section = state.sections.find(s => s.id === sectionId);
    if (section) {
      setEditingSection(sectionId);
      setEditContent(section.content);
    }
  };

  const handleSaveEdit = (sectionId: string) => {
    dispatch({
      type: 'UPDATE_SECTION',
      payload: {
        id: sectionId,
        updates: {
          content: editContent,
          wordCount: editContent.split(/\s+/).filter(word => word.length > 0).length,
          lastModified: createTimestamp()
        }
      }
    });
    setEditingSection(null);
    setEditContent('');
  };

  const handleCancelEdit = () => {
    setEditingSection(null);
    setEditContent('');
  };

  // Template selection handlers
  const handleTemplateSelect = (selectedTemplate: SmartTemplate) => {
    console.log('Template selected:', selectedTemplate.name);
    console.log('Template sections count:', selectedTemplate.sections.length);
    console.log('Template sections:', selectedTemplate.sections.map(s => ({ id: s.id, title: s.title })));
    
    // Update local template state
    setCurrentTemplate(selectedTemplate);
    
    // Update work product type
    setWorkProduct(prev => ({
      ...prev,
      type: selectedTemplate.workProductType,
      title: `${projectContext.projectName} - ${selectedTemplate.name}`
    }));
    
    // Initialize sections from the selected template
    const initialSections: SectionPreview[] = selectedTemplate.sections.map(templateSection => ({
      id: templateSection.id,
      title: templateSection.title,
      content: '',
      type: templateSection.type,
      generationStrategy: templateSection.generationStrategy,
      isGenerating: false,
      quality: 0,
      wordCount: 0,
      estimatedTime: templateSection.estimatedLength ? Math.ceil(templateSection.estimatedLength / 200) : 2,
      createdAt: createTimestamp(),
      lastModified: createTimestamp()
    }));
    
    console.log('Created sections:', initialSections.map(s => ({ id: s.id, title: s.title })));
    
    dispatch({ type: 'INITIALIZE_SECTIONS', payload: initialSections });
    
    // Hide template selector
    setShowTemplateSelector(false);
    
    // Notify parent if callback provided
    if (onTemplateChange) {
      onTemplateChange(selectedTemplate);
    }
    
    // Generate initial AI suggestions asynchronously
    if (navigationMode !== 'traditional') {
      setTimeout(() => generateInitialAISuggestions(selectedTemplate, projectContext), 100);
    }
  };

  const handleShowTemplateSelector = () => {
    setShowTemplateSelector(true);
  };

  // Initialize sections from external template prop (if provided)
  // This useEffect is placed here after handleTemplateSelect is defined
  useEffect(() => {
    if (template && !currentTemplate) {
      console.log('Initializing template from external prop:', template);
      setCurrentTemplate(template);
      setShowTemplateSelector(false);
      // Auto-trigger template selection to initialize sections
      handleTemplateSelect(template);
    }
  }, [template, currentTemplate]);

  const handleGenerateAIStructure = async () => {
    setIsGenerating(true);
    try {
      // Determine document type based on project context
      const documentType = getDocumentTypeFromProject(projectContext);
      
      const response = await fetch('/api/ai/generate-document-structure', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          documentType,
          projectContext,
          availableData: {}, // TODO: Get real data summary
          dataMetadata: {
            sources: ['project-context'],
            dataQuality: 0.7,
            completeness: 0.6
          }
        }),
      });

      if (response.ok) {
        const result = await response.json();
        const structure = result.structure;
        
        // Convert AI structure to sections
        const aiSections: SectionPreview[] = structure.sections.map((section: any, index: number) => ({
          id: section.id || `ai-section-${index}`,
          title: section.title,
          content: section.content || '',
          type: section.id.includes('exec') ? 'text' : 'text',
          generationStrategy: 'ai-generated' as const,
          isGenerating: false,
          quality: 0,
          wordCount: 0,
          estimatedTime: section.estimatedLength === 'short' ? 2 : section.estimatedLength === 'medium' ? 5 : 8,
          createdAt: createTimestamp(),
          lastModified: createTimestamp()
        }));

        // Update work product title with AI suggestion
        setWorkProduct(prev => ({
          ...prev,
          title: structure.title
        }));

        // Initialize sections with AI structure
        dispatch({ type: 'INITIALIZE_SECTIONS', payload: aiSections });
        
        // Create a custom template from the AI structure
        const aiTemplate: SmartTemplate = {
          id: `ai-generated-${Date.now()}`,
          name: structure.title,
          description: structure.description,
          category: documentType,
          industryFocus: [projectContext.sector || 'General'],
          dealStages: [projectContext.stage || 'All'],
          sections: structure.sections.map((section: any) => ({
            id: section.id,
            title: section.title,
            type: 'text' as const,
            required: section.priority === 'critical',
            estimatedTime: section.estimatedTime || 5,
            generationStrategy: 'ai-generated' as const,
            dataBindings: [],
            transformationRules: []
          })),
          dataBindings: [],
          successRate: 0.95,
          tags: [documentType, projectContext.sector || 'general'],
          createdAt: new Date(),
          lastUpdated: new Date()
        };

        setCurrentTemplate(aiTemplate);
        setShowTemplateSelector(false);
        
      } else {
        throw new Error('Failed to generate AI structure');
      }
    } catch (error) {
      console.error('Error generating AI structure:', error);
      // TODO: Show error message to user
    } finally {
      setIsGenerating(false);
    }
  };

  const getDocumentTypeFromProject = (context: ProjectContext): string => {
    switch (context.projectType) {
      case 'ic-preparation':
        return 'ic-memo';
      case 'due-diligence':
        return 'due-diligence';
      case 'deal-screening':
        return 'screening-report';
      case 'portfolio-monitoring':
        return 'portfolio-review';
      default:
        // Default based on sector or general due diligence
        return 'due-diligence';
    }
  };

  // Helper functions
  const generateSectionContent = async (section: SectionPreview, context: ProjectContext) => {
    try {
      // Determine document type from current template
      const documentType = currentTemplate ? getDocumentTypeFromTemplate(currentTemplate) : undefined;
      
      const response = await fetch('/api/content/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sectionId: section.id,
          sectionTitle: section.title,
          sectionType: section.type,
          documentType: documentType,
          projectContext: context,
          generationStrategy: section.generationStrategy,
          existingContent: section.content
        }),
      });

      const result = await response.json();
      
      // Handle standardized API response
      if (!isSuccessResponse(result)) {
        const errorMessage = result.error || 'Unknown error occurred';
        console.error('API Error:', result);
        
        // Handle specific error types
        if (result.data?.validationErrors) {
          throw new Error(`Validation failed: ${result.data.validationErrors.map(e => e.message).join(', ')}`);
        }
        
        throw new Error(errorMessage);
      }

      // Validate response structure
      if (!validateContentGenerationResponse(result)) {
        throw new Error('Invalid response format from content generation API');
      }
      
      return {
        content: result.data.content,
        quality: result.data.quality,
        wordCount: result.data.wordCount,
        metadata: result.data.metadata
      };
    } catch (error) {
      console.error('Error generating content:', error);
      
      // Enhanced fallback with error context
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      const fallbackContent = `# ${section.title}\n\n*⚠️ Content generation temporarily unavailable*\n\n**Error:** ${errorMessage}\n\nAI-generated content for ${section.title} section based on ${context.projectName} analysis will be available once the service is restored.\n\nThis section would provide comprehensive analysis relevant to the ${context.sector} sector investment opportunity.\n\n*Please try regenerating this section or contact support if the issue persists.*`;
      
      return {
        content: fallbackContent,
        quality: 0.4, // Lower quality for fallback content
        wordCount: fallbackContent.split(/\s+/).length,
        metadata: {
          isFallback: true,
          error: errorMessage,
          generationTime: 0
        }
      };
    }
  };

  const addFollowUpSuggestions = (sectionId: string, generatedContent: any) => {
    if (generatedContent.quality < 0.8) {
      const improveSuggestion: AISuggestion = {
        id: `suggestion-${Date.now()}-improve-${sectionId}`,
        type: 'optimization',
        title: 'Improve Section Quality',
        description: 'Content quality could be enhanced with additional data',
        confidence: 0.7,
        action: () => handleGenerateSection(sectionId),
        previewable: true,
        sectionId: sectionId,
        createdAt: createTimestamp()
      };

      dispatch({ type: 'ADD_AI_SUGGESTION', payload: improveSuggestion });
    }
  };

  const handleSaveWorkProduct = () => {
    const finalWorkProduct: WorkProduct = {
      id: `wp-${Date.now()}`,
      workspaceId: projectContext.projectId,
      title: workProduct.title || `${projectContext.projectName} - Document`,
      type: workProduct.type || 'INVESTMENT_SUMMARY',
      status: 'DRAFT',
      templateId: currentTemplate?.id,
      sections: state.sections.map(section => ({
        id: section.id,
        title: section.title,
        order: state.sections.indexOf(section),
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
      wordCount: state.sections.reduce((total, section) => total + section.wordCount, 0),
      readingTime: Math.ceil(state.sections.reduce((total, section) => total + section.wordCount, 0) / 200),
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

  const getDocumentTypeFromTemplate = (template: SmartTemplate): string => {
    // Map template names/categories to document types
    if (template.name.toLowerCase().includes('ic memo') || template.name.toLowerCase().includes('investment committee')) {
      return 'ic-memo';
    }
    if (template.name.toLowerCase().includes('due diligence') || template.category === 'due-diligence') {
      return 'due-diligence';
    }
    if (template.name.toLowerCase().includes('screening') || template.category === 'screening') {
      return 'screening-report';
    }
    if (template.name.toLowerCase().includes('portfolio') || template.category === 'portfolio') {
      return 'portfolio-review';
    }
    if (template.name.toLowerCase().includes('risk') || template.category === 'risk') {
      return 'risk-assessment';
    }
    
    // Default based on project type
    switch (projectContext.projectType) {
      case 'ic-preparation':
        return 'ic-memo';
      case 'due-diligence':
        return 'due-diligence';
      case 'deal-screening':
        return 'screening-report';
      case 'portfolio-monitoring':
        return 'portfolio-review';
      default:
        return 'due-diligence';
    }
  };

  return (
    <div className={`flex h-full bg-gray-50 ${className}`}>
      {/* Main Content Assembly Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <div className="flex-1 overflow-y-auto p-6">
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
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-sm text-gray-500">
                      {projectContext.projectName} • {projectContext.sector} • $
                      {(projectContext.dealValue || 0) / 1000000}M
                    </p>
                    {currentTemplate && (
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="text-xs">
                          {currentTemplate.name}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleShowTemplateSelector}
                          className="text-xs h-6 px-2"
                        >
                          <Settings className="w-3 h-3 mr-1" />
                          Change
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <span>{state.sections.reduce((total, section) => total + section.wordCount, 0)} words</span>
                  <span>•</span>
                  <span>{Math.ceil(state.sections.reduce((total, section) => total + section.wordCount, 0) / 200)} min read</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Template Selector */}
          {showTemplateSelector && (
            <Card className="mb-6 bg-blue-50 border-blue-200">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-blue-900">Choose Document Template</h3>
                    <p className="text-sm text-blue-700">
                      Select a template optimized for {projectContext.projectName} ({projectContext.sector})
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowTemplateSelector(false)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {availableTemplates.map((availableTemplate) => {
                    const IconComponent = getSectionIcon('text'); // Default icon
                    const isRecommended = availableTemplate.industryFocus.includes(projectContext.sector || '') ||
                                        availableTemplate.dealStages.includes(projectContext.stage || '');

                    return (
                      <Card
                        key={availableTemplate.id}
                        className={`cursor-pointer transition-all relative hover:shadow-md ${
                          currentTemplate?.id === availableTemplate.id ? 'ring-2 ring-blue-500 bg-blue-100' : 'bg-white'
                        }`}
                        onClick={() => handleTemplateSelect(availableTemplate)}
                      >
                        {isRecommended && (
                          <div className="absolute -top-2 -right-2 bg-yellow-500 text-white rounded-full p-1">
                            <Sparkles className="w-3 h-3" />
                          </div>
                        )}
                        
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center space-x-3">
                              <div className="p-2 rounded-lg bg-gray-100">
                                <IconComponent className="w-4 h-4 text-gray-600" />
                              </div>
                              <div>
                                <h4 className="font-semibold text-gray-900 text-sm">{availableTemplate.name}</h4>
                                <Badge className="text-xs bg-gray-100 text-gray-700 border-gray-300">
                                  {availableTemplate.category.replace('-', ' ')}
                                </Badge>
                              </div>
                            </div>
                            {currentTemplate?.id === availableTemplate.id && (
                              <CheckCircle className="w-4 h-4 text-blue-600" />
                            )}
                          </div>

                          <p className="text-xs text-gray-600 mb-3">{availableTemplate.description}</p>
                          
                          <div className="grid grid-cols-2 gap-3 mb-3">
                            <div className="text-center p-2 bg-gray-50 rounded">
                              <div className="text-sm font-semibold text-gray-900">
                                {availableTemplate.sections.length}
                              </div>
                              <div className="text-xs text-gray-500">Sections</div>
                            </div>
                            <div className="text-center p-2 bg-gray-50 rounded">
                              <div className="text-sm font-semibold text-green-600">
                                {Math.round(availableTemplate.successRate * 100)}%
                              </div>
                              <div className="text-xs text-gray-500">Success</div>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-1">
                            {availableTemplate.tags.slice(0, 2).map(tag => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                            {availableTemplate.tags.length > 2 && (
                              <Badge variant="secondary" className="text-xs">
                                +{availableTemplate.tags.length - 2}
                              </Badge>
                            )}
                          </div>

                          {isRecommended && (
                            <div className="mt-2 text-xs text-yellow-600 font-medium flex items-center">
                              <Sparkles className="w-3 h-3 mr-1" />
                              Recommended for your project
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>

                {availableTemplates.length === 0 && (
                  <div className="text-center py-8">
                    <FileText className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-gray-600">No templates available for this project type.</p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-2"
                      onClick={() => setAvailableTemplates(SMART_TEMPLATES)}
                    >
                      Show All Templates
                    </Button>
                  </div>
                )}

                {!currentTemplate && availableTemplates.length > 0 && (
                  <div className="mt-4 p-3 bg-white border border-blue-200 rounded-lg">
                    <div className="flex items-center space-x-2 text-sm text-blue-700">
                      <AlertCircle className="w-4 h-4" />
                      <span>Select a template to get started with structured content generation.</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Data Availability Preview */}
          {currentTemplate && (
            <Card className="mb-6 bg-green-50 border-green-200">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-green-900">Data Availability Preview</h3>
                    <p className="text-sm text-green-700">
                      Real data sources connected to your content generation
                    </p>
                  </div>
                  <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
                    Real Data Only
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="bg-white p-3 rounded-lg border border-green-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Project Data</span>
                      {projectContext.projectName ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-orange-500" />
                      )}
                    </div>
                    <div className="text-xs text-gray-600">
                      {projectContext.projectName ? (
                        <>Name, sector, geography available</>
                      ) : (
                        <>Limited project details</>
                      )}
                    </div>
                  </div>
                  
                  <div className="bg-white p-3 rounded-lg border border-green-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Financial Data</span>
                      {projectContext.dealValue ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-orange-500" />
                      )}
                    </div>
                    <div className="text-xs text-gray-600">
                      {projectContext.dealValue ? (
                        <>Deal value: ${(projectContext.dealValue / 1000000).toFixed(0)}M</>
                      ) : (
                        <>No financial metrics available</>
                      )}
                    </div>
                  </div>
                  
                  <div className="bg-white p-3 rounded-lg border border-green-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Team Data</span>
                      <AlertCircle className="w-4 h-4 text-orange-500" />
                    </div>
                    <div className="text-xs text-gray-600">
                      Team data will be extracted from workspace
                    </div>
                  </div>
                </div>
                
                <div className="bg-white p-3 rounded-lg border border-green-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <Shield className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium text-gray-700">Data Policy</span>
                  </div>
                  <p className="text-xs text-gray-600">
                    Content generation uses only real data from connected sources. No placeholder or synthetic content will be generated. 
                    Sections without sufficient real data will show "Data Not Available" instead of fabricated content.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* No Template Selected State */}
          {!currentTemplate && !showTemplateSelector && (
            <Card className="mb-6 text-center py-8">
              <CardContent>
                <Sparkles className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Template Selected</h3>
                <p className="text-gray-600 mb-4">
                  Choose a smart template to get started with data-driven content generation.
                </p>
                <div className="flex space-x-3">
                  <Button onClick={handleShowTemplateSelector}>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Choose Template
                  </Button>
                  <Button variant="outline" onClick={handleGenerateAIStructure}>
                    <Wand2 className="w-4 h-4 mr-2" />
                    AI Structure
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sections List - only show if template is selected */}
        {currentTemplate && (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="sections">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
                {state.sections.map((section, index) => (
                  <Draggable key={section.id} draggableId={section.id} index={index}>
                    {(provided, snapshot) => (
                      <Card
                        id={`section-${section.id}`}
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={`transition-shadow ${
                          snapshot.isDragging ? 'shadow-lg' : 'shadow-sm'
                        } ${selectedSection === section.id ? 'ring-2 ring-blue-500' : ''} ${
                          state.errors[section.id] ? 'border-red-300 bg-red-50' : ''
                        }`}
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
                                {state.errors[section.id] && (
                                  <div className="flex items-center space-x-1 text-sm text-red-600 mt-1">
                                    <AlertCircle className="w-4 h-4" />
                                    <span>{state.errors[section.id]}</span>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => dispatch({ type: 'CLEAR_ERROR', payload: section.id })}
                                      className="h-4 w-4 p-0 text-red-600 hover:text-red-700"
                                    >
                                      <X className="w-3 h-3" />
                                    </Button>
                                  </div>
                                )}
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
                                    <>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setSelectedSection(
                                          selectedSection === section.id ? null : section.id
                                        )}
                                        title="Toggle preview"
                                      >
                                        {selectedSection === section.id ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => {
                                          if (editingSection === section.id) {
                                            handleCancelEdit();
                                          } else {
                                            handleStartEdit(section.id);
                                          }
                                        }}
                                        title="Edit content"
                                      >
                                        <Edit3 className="w-4 h-4" />
                                      </Button>
                                    </>
                                  )}
                                  {(navigationMode === 'assisted' || navigationMode === 'autonomous') && (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleGenerateSection(section.id)}
                                      disabled={section.isGenerating || state.pendingGenerations.has(section.id)}
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
                        
                        {(selectedSection === section.id || showPreview || editingSection === section.id) && (
                          <CardContent className="pt-0">
                            {editingSection === section.id ? (
                              // Edit mode
                              <div className="space-y-4">
                                <textarea
                                  value={editContent}
                                  onChange={(e) => setEditContent(e.target.value)}
                                  className="w-full h-64 p-3 border border-gray-300 rounded-md resize-y focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
                                  placeholder="Enter your content here... (Markdown supported)"
                                />
                                <div className="flex justify-end space-x-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleCancelEdit}
                                  >
                                    Cancel
                                  </Button>
                                  <Button
                                    size="sm"
                                    onClick={() => handleSaveEdit(section.id)}
                                  >
                                    <CheckCircle className="w-4 h-4 mr-2" />
                                    Save Changes
                                  </Button>
                                </div>
                              </div>
                            ) : section.content ? (
                              // Preview mode
                              <div className="prose prose-sm max-w-none">
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                  {section.content}
                                </ReactMarkdown>
                              </div>
                            ) : (
                              // Empty state
                              <div className="text-center py-8 text-gray-500">
                                <FileText className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                                <p>No content generated yet</p>
                                {(navigationMode === 'assisted' || navigationMode === 'autonomous') && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleGenerateSection(section.id)}
                                    className="mt-2"
                                    disabled={section.isGenerating || state.pendingGenerations.has(section.id)}
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
        )}

        {/* Action Buttons - show even without template for template selection */}
        <div className="flex justify-between items-center mt-8 pt-6 border-t">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <div className="flex space-x-3">
            {!currentTemplate && (
              <Button onClick={handleShowTemplateSelector}>
                <Sparkles className="w-4 h-4 mr-2" />
                Choose Template
              </Button>
            )}
            {currentTemplate && (navigationMode === 'assisted' || navigationMode === 'autonomous') && (
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
            {currentTemplate && (
              <Button onClick={handleSaveWorkProduct}>
                <CheckCircle className="w-4 h-4 mr-2" />
                Save Document
              </Button>
            )}
          </div>
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
            {state.aiSuggestions.map((suggestion) => (
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
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => dispatch({ type: 'REMOVE_AI_SUGGESTION', payload: suggestion.id })}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}

            {state.aiSuggestions.length === 0 && (
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

// Export as default as well for convenience
export default ContentAssembler;