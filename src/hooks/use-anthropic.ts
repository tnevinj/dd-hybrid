import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface AnthropicInsightsOptions {
  maxTokens?: number;
  temperature?: number;
  model?: string;
}

export interface UseAnthropicReturn {
  generateInsights: (prompt: string, options?: AnthropicInsightsOptions) => Promise<string[]>;
  isLoading: boolean;
  error: string | null;
}

export function useAnthropic(): UseAnthropicReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const generateInsights = useCallback(async (
    prompt: string, 
    options: AnthropicInsightsOptions = {}
  ): Promise<string[]> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/ai/generate-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          maxTokens: options.maxTokens || 1000,
          temperature: options.temperature || 0.7,
          model: options.model || 'claude-3-5-sonnet-20241022',
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      // Extract insights from the response
      const insights = data.content 
        ? data.content.split('\n').filter((line: string) => line.trim().length > 0)
        : ['No insights generated'];

      return insights;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate AI insights';
      setError(errorMessage);
      toast({
        title: 'AI Generation Failed',
        description: errorMessage,
        variant: 'destructive',
      });
      return ['Failed to generate insights. Please try again.'];
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  return {
    generateInsights,
    isLoading,
    error,
  };
}
