'use client';

import React, { useEffect } from 'react';
import { useAssistantStore } from '@/lib/stores/assistantStore';
import { getEntityRecognitionService } from '@/lib/services/entity-recognition-service';
import { getConversationService } from '@/lib/services/conversation-service';
import ThandoButton from './ThandoButton';
import ThandoChatPanel from './ThandoChatPanel';

interface ThandoAssistantProps {
  mode?: 'traditional' | 'assisted' | 'autonomous';
  context?: {
    page?: string;
    dealId?: string;
    workspaceId?: string;
    userId?: string;
  };
}

/**
 * ThandoAssistant Component - Enhanced for DD-Hybrid
 * 
 * The main component that integrates all the assistant components
 * and manages the assistant state using Zustand store.
 * Enhanced with hybrid navigation mode support.
 */
const ThandoAssistant: React.FC<ThandoAssistantProps> = ({ 
  mode = 'traditional',
  context: externalContext = {}
}) => {
  const { 
    isOpen, 
    avatarExpression, 
    context, 
    userPreferences,
    unreadCount,
    toggleAssistant,
    updateContext
  } = useAssistantStore();
  
  // Initialize the assistant when the component mounts
  useEffect(() => {
    console.log(`Thando Assistant initialized in ${mode} mode with advanced services`);
    
    // Update context with current page information and navigation mode
    if (typeof window !== 'undefined') {
      const currentPage = window.location.pathname.split('/')[1] || 'dashboard';
      const contextUpdate = { 
        page: currentPage,
        visibleElements: [],
        navigationMode: mode,
        platformData: {
          // This would typically be populated from actual data
          currentPortfolio: {
            id: 'portfolio-1',
            name: 'DD-Hybrid Portfolio',
            metrics: {},
            allocation: {},
            performance: {}
          },
          ...externalContext
        }
      };
      
      updateContext(contextUpdate);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]); // Re-run when mode changes

  // Separate effect to initialize entity service when context changes
  useEffect(() => {
    const entityService = getEntityRecognitionService();
    entityService.initialize(context);
  }, [context]);

  // Enhanced AI capabilities based on navigation mode
  const getAICapabilities = () => {
    switch (mode) {
      case 'autonomous':
        return {
          proactiveInsights: true,
          automaticAnalysis: true,
          smartSuggestions: true,
          contextualRecommendations: true,
          realTimeAlerts: true
        };
      case 'assisted':
        return {
          proactiveInsights: false,
          automaticAnalysis: true,
          smartSuggestions: true,
          contextualRecommendations: true,
          realTimeAlerts: false
        };
      default: // traditional
        return {
          proactiveInsights: false,
          automaticAnalysis: false,
          smartSuggestions: false,
          contextualRecommendations: false,
          realTimeAlerts: false
        };
    }
  };

  const aiCapabilities = getAICapabilities();
  
  return (
    <>
      {/* Floating button with unread indicator and mode-specific styling */}
      <ThandoButton 
        onClick={toggleAssistant} 
        expression={avatarExpression}
        pulseAnimation={!isOpen && unreadCount > 0}
        unreadCount={unreadCount}
        mode={mode}
        aiCapabilities={aiCapabilities}
      />
      
      {/* Enhanced chat panel with hybrid navigation support */}
      <ThandoChatPanel 
        isOpen={isOpen} 
        onClose={toggleAssistant}
        mode={mode}
        aiCapabilities={aiCapabilities}
      />
    </>
  );
};

export default ThandoAssistant;