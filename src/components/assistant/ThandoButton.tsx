'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Brain, Zap } from 'lucide-react';
import ThandoAvatar from './ThandoAvatar';
import { ZIndex, getZIndexStyle } from '@/styles/z-index';

interface ThandoButtonProps {
  onClick: () => void;
  expression?: 'default' | 'thinking' | 'speaking' | 'listening';
  pulseAnimation?: boolean;
  unreadCount?: number;
  mode?: 'traditional' | 'assisted' | 'autonomous';
  aiCapabilities?: {
    proactiveInsights: boolean;
    automaticAnalysis: boolean;
    smartSuggestions: boolean;
    contextualRecommendations: boolean;
    realTimeAlerts: boolean;
  };
}

/**
 * ThandoButton Component - Enhanced for DD-Hybrid
 * 
 * A floating action button that displays the Thando avatar
 * and opens the assistant when clicked. Enhanced with hybrid
 * navigation mode indicators.
 */
const ThandoButton: React.FC<ThandoButtonProps> = ({
  onClick,
  expression = 'default',
  pulseAnimation = false,
  unreadCount = 0,
  mode = 'traditional',
  aiCapabilities
}) => {
  const getModeColor = () => {
    switch (mode) {
      case 'autonomous':
        return 'from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700';
      case 'assisted':
        return 'from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700';
      default:
        return 'from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700';
    }
  };

  const getModeTitle = () => {
    switch (mode) {
      case 'autonomous':
        return 'Ask Thando (Autonomous AI Mode)';
      case 'assisted':
        return 'Ask Thando (AI-Assisted Mode)';
      default:
        return 'Ask Thando for help';
    }
  };

  return (
    <div 
      className="fixed bottom-6 right-6"
      style={getZIndexStyle(ZIndex.FLOATING_BUTTON)}
      title={getModeTitle()}
    >
      <div className="relative">
        <Button
          onClick={onClick}
          className={`
            w-16 h-16 rounded-full p-0 shadow-lg hover:shadow-xl transition-all duration-200
            bg-gradient-to-br ${getModeColor()}
            ${pulseAnimation ? 'animate-pulse' : ''}
            border-0
          `}
          size="lg"
        >
          <div className="relative">
            <ThandoAvatar 
              expression={expression} 
              size={40} 
              pulseAnimation={pulseAnimation}
              mode={mode}
            />
            
            {/* Mode indicator */}
            {mode !== 'traditional' && (
              <div className="absolute -top-1 -right-1">
                {mode === 'autonomous' ? (
                  <Zap className="h-3 w-3 text-yellow-300" />
                ) : (
                  <Brain className="h-3 w-3 text-blue-300" />
                )}
              </div>
            )}
          </div>
        </Button>
        
        {/* Unread count indicator */}
        {unreadCount > 0 && (
          <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full min-w-5 h-5 flex items-center justify-center z-10">
            {unreadCount > 9 ? '9+' : unreadCount}
          </div>
        )}

        {/* AI capabilities indicator */}
        {mode !== 'traditional' && aiCapabilities && (
          <div className="absolute -bottom-1 -left-1">
            <Badge 
              variant="secondary" 
              className={`text-xs px-1 py-0.5 ${
                mode === 'autonomous' ? 'bg-blue-100 text-blue-800' : 'bg-blue-100 text-blue-800'
              }`}
            >
              AI
            </Badge>
          </div>
        )}
      </div>
    </div>
  );
};

export default ThandoButton;