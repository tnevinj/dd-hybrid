import { useState, useCallback } from 'react';
import { AIScreeningService, AISuggestion } from '@/lib/services/ai-screening-service';
import { DealOpportunity, DealScreeningTemplate } from '@/types/deal-screening';

interface UseAISuggestionsOptions {
  useServerSide?: boolean; // Whether to use the API or client-side service
}

interface AISuggestionsResult {
  suggestions: Record<string, AISuggestion> | null;
  loading: boolean;
  error: string | null;
  generateSuggestions: (opportunity: DealOpportunity, template: DealScreeningTemplate) => Promise<void>;
  submitFeedback: (feedback: AISuggestionFeedback) => Promise<void>;
}

interface AISuggestionFeedback {
  templateId: string;
  acceptedSuggestions: string[];
  userScores: Record<string, number>;
  feedback?: string;
}

export const useAISuggestions = (options: UseAISuggestionsOptions = {}): AISuggestionsResult => {
  const [suggestions, setSuggestions] = useState<Record<string, AISuggestion> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateSuggestions = useCallback(async (
    opportunity: DealOpportunity, 
    template: DealScreeningTemplate
  ) => {
    setLoading(true);
    setError(null);
    
    try {
      if (options.useServerSide) {
        // Use the API endpoint for server-side generation
        const response = await fetch(
          `/api/deal-screening/opportunities/${opportunity.id}/ai-suggestions?templateId=${template.id}`
        );
        
        if (!response.ok) {
          throw new Error(`API request failed: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        if (!data.success) {
          throw new Error(data.error || 'Failed to generate suggestions');
        }
        
        setSuggestions(data.data.suggestions);
        
        console.log('Server-side AI suggestions generated:', {
          opportunity: data.data.opportunity.name,
          confidence: data.data.summaryInsights.overallConfidence,
          criteriaCount: data.data.summaryInsights.totalCriteria
        });
      } else {
        // Use client-side AI service for faster response
        const clientSuggestions = AIScreeningService.generateBatchSuggestions(opportunity, template);
        setSuggestions(clientSuggestions);
        
        console.log('Client-side AI suggestions generated:', {
          opportunity: opportunity.name,
          criteriaCount: Object.keys(clientSuggestions).length,
          avgConfidence: Object.values(clientSuggestions).reduce((sum, s) => sum + s.confidence, 0) / Object.keys(clientSuggestions).length
        });
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      console.error('Error generating AI suggestions:', err);
      
      // Fallback to client-side if server-side fails
      if (options.useServerSide) {
        console.log('Falling back to client-side AI suggestions...');
        try {
          const fallbackSuggestions = AIScreeningService.generateBatchSuggestions(opportunity, template);
          setSuggestions(fallbackSuggestions);
          setError(null); // Clear error since fallback worked
        } catch (fallbackErr) {
          console.error('Fallback also failed:', fallbackErr);
        }
      }
    } finally {
      setLoading(false);
    }
  }, [options.useServerSide]);

  const submitFeedback = useCallback(async (feedback: AISuggestionFeedback) => {
    if (!suggestions) return;
    
    try {
      // Extract opportunity ID from the first suggestion's context
      const firstSuggestion = Object.values(suggestions)[0];
      if (!firstSuggestion) return;
      
      // For now, we'll get the opportunity ID from the URL or context
      // In a real implementation, this would be passed as a parameter
      const opportunityId = window.location.pathname.split('/')[3]; // Extract from URL
      
      const response = await fetch(
        `/api/deal-screening/opportunities/${opportunityId}/ai-suggestions`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(feedback)
        }
      );
      
      if (response.ok) {
        console.log('AI suggestion feedback submitted successfully');
      } else {
        console.warn('Failed to submit feedback:', response.statusText);
      }
    } catch (err) {
      console.error('Error submitting feedback:', err);
    }
  }, [suggestions]);

  return {
    suggestions,
    loading,
    error,
    generateSuggestions,
    submitFeedback
  };
};