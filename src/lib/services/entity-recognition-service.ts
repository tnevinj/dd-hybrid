/**
 * Entity Recognition Service for DD-Hybrid
 * 
 * Enhanced AI service for extracting and understanding entities
 * from user messages in different navigation modes.
 */

import { AssistantContext } from '../types/assistant/assistantTypes';

export interface EntityExtractionResult {
  entities: {
    type: string;
    value: string;
    confidence: number;
    startIndex: number;
    endIndex: number;
  }[];
  intent: string;
  confidence: number;
  context: Record<string, any>;
}

class EntityRecognitionService {
  private context: AssistantContext | null = null;

  initialize(context: AssistantContext) {
    this.context = context;
    console.log('Entity Recognition Service initialized with context:', context);
  }

  extractEntities(message: string, context?: AssistantContext): EntityExtractionResult {
    // Placeholder implementation
    // In a real implementation, this would use NLP models to extract entities
    
    const entities = [];
    const lowerMessage = message.toLowerCase();
    
    // Simple keyword-based entity extraction
    if (lowerMessage.includes('portfolio')) {
      entities.push({
        type: 'portfolio',
        value: 'portfolio',
        confidence: 0.9,
        startIndex: lowerMessage.indexOf('portfolio'),
        endIndex: lowerMessage.indexOf('portfolio') + 9
      });
    }
    
    if (lowerMessage.includes('performance') || lowerMessage.includes('returns')) {
      entities.push({
        type: 'metric',
        value: 'performance',
        confidence: 0.8,
        startIndex: lowerMessage.indexOf('performance') || lowerMessage.indexOf('returns'),
        endIndex: (lowerMessage.indexOf('performance') || lowerMessage.indexOf('returns')) + 11
      });
    }
    
    // Determine intent based on context and entities
    let intent = 'general_inquiry';
    if (entities.some(e => e.type === 'portfolio')) {
      intent = 'portfolio_analysis';
    } else if (entities.some(e => e.type === 'metric')) {
      intent = 'performance_inquiry';
    }
    
    return {
      entities,
      intent,
      confidence: 0.75,
      context: this.context || {}
    };
  }

  // Enhanced methods for hybrid navigation modes
  extractContextualEntities(message: string, navigationMode: string): EntityExtractionResult {
    const baseResult = this.extractEntities(message);
    
    // Enhance extraction based on navigation mode
    if (navigationMode === 'autonomous' || navigationMode === 'assisted') {
      // In AI modes, we could use more sophisticated NLP
      baseResult.confidence += 0.1;
      baseResult.context.aiEnhanced = true;
    }
    
    return baseResult;
  }
}

let entityRecognitionService: EntityRecognitionService;

export function getEntityRecognitionService(): EntityRecognitionService {
  if (!entityRecognitionService) {
    entityRecognitionService = new EntityRecognitionService();
  }
  return entityRecognitionService;
}