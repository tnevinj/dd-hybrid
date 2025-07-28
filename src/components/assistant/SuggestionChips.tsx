'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Brain, Zap, Sparkles, Target, TrendingUp, PieChart } from 'lucide-react';
import { Suggestion } from '@/lib/types/assistant/assistantTypes';

interface SuggestionChipsProps {
  suggestions: Suggestion[];
  onSuggestionClick: (suggestion: string) => void;
  mode?: 'traditional' | 'assisted' | 'autonomous';
}

/**
 * SuggestionChips Component - Enhanced for DD-Hybrid
 * 
 * Displays a list of suggestion chips that the user can click on
 * to quickly send common messages. Enhanced with mode-specific
 * styling and intelligent suggestions.
 */
const SuggestionChips: React.FC<SuggestionChipsProps> = ({
  suggestions,
  onSuggestionClick,
  mode = 'traditional'
}) => {
  if (!suggestions || suggestions.length === 0) {
    return null;
  }

  // Get mode-specific styling
  const getModeChipStyle = () => {
    switch (mode) {
      case 'autonomous':
        return 'hover:bg-purple-50 hover:border-purple-200 hover:text-purple-700 border-purple-100';
      case 'assisted':
        return 'hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 border-blue-100';
      default:
        return 'hover:bg-gray-50 hover:border-gray-200';
    }
  };

  // Get suggestion icon based on content
  const getSuggestionIcon = (suggestionText: string) => {
    const text = suggestionText.toLowerCase();
    
    if (text.includes('analyze') || text.includes('analysis')) {
      return <TrendingUp className="h-3 w-3" />;
    } else if (text.includes('portfolio') || text.includes('allocation')) {
      return <PieChart className="h-3 w-3" />;
    } else if (text.includes('target') || text.includes('recommend')) {
      return <Target className="h-3 w-3" />;
    } else if (mode !== 'traditional') {
      return <Sparkles className="h-3 w-3" />;
    }
    
    return null;
  };

  // Get mode icon
  const getModeIcon = () => {
    switch (mode) {
      case 'autonomous':
        return <Zap className="h-3 w-3 text-purple-600" />;
      case 'assisted':
        return <Brain className="h-3 w-3 text-blue-600" />;
      default:
        return null;
    }
  };
  
  return (
    <div className="border-t p-3 bg-gray-50/50">
      {mode !== 'traditional' && (
        <div className="flex items-center gap-2 mb-2">
          {getModeIcon()}
          <span className="text-xs font-medium text-gray-700">AI Suggestions</span>
          <Badge variant="secondary" className="text-xs">
            {mode}
          </Badge>
        </div>
      )}
      
      <div className="flex flex-wrap gap-2">
        {suggestions.map((suggestion) => {
          const icon = getSuggestionIcon(suggestion.text);
          
          return (
            <Button
              key={suggestion.id}
              variant="outline"
              size="sm"
              onClick={() => onSuggestionClick(suggestion.text)}
              className={`
                rounded-full text-xs h-7 px-3 transition-all duration-200
                flex items-center gap-1.5
                ${getModeChipStyle()}
              `}
            >
              {icon}
              <span>{suggestion.text}</span>
              {mode !== 'traditional' && (
                <Sparkles className="h-2 w-2 opacity-60" />
              )}
            </Button>
          );
        })}
      </div>

      {/* Enhanced suggestions info for AI modes */}
      {mode !== 'traditional' && suggestions.length > 0 && (
        <div className="mt-2 text-xs text-gray-500 flex items-center gap-1">
          <Sparkles className="h-3 w-3" />
          <span>
            {mode === 'autonomous' 
              ? 'Proactive AI suggestions based on your context'
              : 'AI-assisted suggestions to help guide your analysis'
            }
          </span>
        </div>
      )}
    </div>
  );
};

export default SuggestionChips;