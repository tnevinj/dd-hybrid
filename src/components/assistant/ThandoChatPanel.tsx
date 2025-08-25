'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { 
  X, 
  Search, 
  Settings, 
  Maximize2, 
  Minimize2,
  ListTodo,
  ThumbsUp,
  RefreshCw,
  Download,
  Upload,
  Brain,
  Zap,
  Target,
  BarChart3
} from 'lucide-react';
import { useAssistantStore } from '@/lib/stores/assistantStore';
import { getConversationService } from '@/lib/services/conversation-service';
import { getEntityRecognitionService } from '@/lib/services/entity-recognition-service';
import { getRecommendationService } from '@/lib/services/recommendation-service';
import ThandoAvatar from './ThandoAvatar';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import SuggestionChips from './SuggestionChips';
import SearchPanel from './SearchPanel';
import RecommendationPanel from './RecommendationPanel';
import TaskManagerPanel from './TaskManagerPanel';

interface ThandoChatPanelProps {
  isOpen: boolean;
  onClose: () => void;
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
 * ThandoChatPanel Component - Enhanced for DD-Hybrid
 * 
 * Enhanced chat panel with AI services integration and
 * hybrid navigation mode support.
 */
const ThandoChatPanel: React.FC<ThandoChatPanelProps> = ({
  isOpen,
  onClose,
  mode = 'traditional',
  aiCapabilities
}) => {
  // Zustand store state
  const {
    messages,
    suggestions,
    context,
    isTyping,
    avatarExpression,
    userPreferences,
    isExpanded,
    search,
    recommendations,
    tasks,
    addMessage,
    setIsTyping,
    setAvatarExpression,
    updateUserPreferences,
    setSuggestions,
    clearMessages,
    setExpanded,
    toggleSearch,
    setRecommendations,
    setRecommendationLoading
  } = useAssistantStore();

  // Local state for panels
  const [isTaskManagerOpen, setIsTaskManagerOpen] = useState(false);
  const [isRecommendationPanelOpen, setIsRecommendationPanelOpen] = useState(false);
  const [conversationSession, setConversationSession] = useState<string | null>(null);

  // Services
  const conversationService = getConversationService();
  const entityService = getEntityRecognitionService();
  const recommendationService = getRecommendationService();

  // Initialize conversation session with mode context
  useEffect(() => {
    if (isOpen && !conversationSession) {
      const enhancedPreferences = {
        ...userPreferences,
        navigationMode: mode,
        aiCapabilities
      };
      const session = conversationService.startConversation(context, enhancedPreferences);
      setConversationSession(session.id);
    }
  }, [isOpen, conversationSession, context, userPreferences, mode, aiCapabilities, conversationService]);

  // Handle sending a message with AI integration
  const handleSendMessage = useCallback(async (content: string) => {
    if (!conversationSession) return;

    setIsTyping(true);
    setAvatarExpression('thinking');

    try {
      // Extract entities from user message
      const entityExtraction = entityService.extractEntities(content, context);
      
      // Enhanced message processing based on mode
      const messageOptions = {
        generateSuggestions: mode !== 'traditional',
        maxHistoryLength: mode === 'autonomous' ? 50 : 20,
        enableContextualAnalysis: aiCapabilities?.automaticAnalysis || false,
        proactiveInsights: aiCapabilities?.proactiveInsights || false
      };
      
      // Send message through conversation service
      const result = await conversationService.sendMessage(
        conversationSession,
        content,
        messageOptions
      );

      // Add messages to store
      addMessage(result.userMessage);
      addMessage(result.assistantMessage);

      // Update suggestions if provided and AI capabilities allow
      if (result.suggestions && aiCapabilities?.smartSuggestions) {
        setSuggestions(result.suggestions);
      }

      // Generate proactive recommendations in autonomous mode
      if (mode === 'autonomous' && aiCapabilities?.contextualRecommendations) {
        setTimeout(() => {
          handleGenerateRecommendations();
        }, 2000);
      }

    } catch (error) {
      console.error('Error sending message:', error);
      setAvatarExpression('apologetic');
    } finally {
      setIsTyping(false);
      setAvatarExpression('neutral');
    }
  }, [conversationSession, entityService, conversationService, context, addMessage, setSuggestions, setIsTyping, setAvatarExpression, mode, aiCapabilities]);

  // Handle suggestion click
  const handleSuggestionClick = useCallback((suggestion: string) => {
    handleSendMessage(suggestion);
  }, [handleSendMessage]);

  // Generate contextual recommendations
  const handleGenerateRecommendations = useCallback(async () => {
    setRecommendationLoading(true);
    try {
      const recommendationContext = {
        userPreferences: {
          ...userPreferences,
          navigationMode: mode,
          aiCapabilities
        },
        currentContext: context,
        portfolioData: context.platformData?.currentPortfolio,
        mode: mode
      };

      const result = await recommendationService.generateRecommendations(recommendationContext);
      setRecommendations(result.recommendations);
      
      if (mode !== 'traditional') {
        setIsRecommendationPanelOpen(true);
      }
    } catch (error) {
      console.error('Error generating recommendations:', error);
    }
  }, [userPreferences, context, recommendationService, setRecommendationLoading, setRecommendations, mode, aiCapabilities]);

  // Handle settings updates
  const handleToggleDetailLevel = useCallback(() => {
    const newLevel = userPreferences.responseDetailLevel === 'concise' ? 'detailed' : 'concise';
    updateUserPreferences({ responseDetailLevel: newLevel });
  }, [userPreferences.responseDetailLevel, updateUserPreferences]);

  // Clear conversation
  const handleClearConversation = useCallback(() => {
    if (conversationSession) {
      conversationService.clearHistory(conversationSession);
      clearMessages();
    }
  }, [conversationSession, conversationService, clearMessages]);

  // Get mode-specific styling
  const getModeHeaderStyle = () => {
    switch (mode) {
      case 'autonomous':
        return 'bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950';
      case 'assisted':
        return 'bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950';
      default:
        return 'bg-gradient-to-r from-gray-50 to-gray-50 dark:from-gray-950 dark:to-gray-950';
    }
  };

  const getModeIcon = () => {
    switch (mode) {
      case 'autonomous':
        return <Zap className="h-4 w-4 text-blue-600" />;
      case 'assisted':
        return <Brain className="h-4 w-4 text-blue-600" />;
      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className={`${isExpanded ? 'max-w-6xl' : 'max-w-2xl'} h-[700px] flex flex-col p-0`}>
          <DialogHeader className={`p-4 border-b ${getModeHeaderStyle()}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <ThandoAvatar expression={avatarExpression} size={40} mode={mode} />
                <div>
                  <DialogTitle className="text-lg flex items-center gap-2">
                    Thando
                    {getModeIcon()}
                    {isTyping && (
                      <Badge variant="secondary" className="text-xs animate-pulse">
                        Thinking...
                      </Badge>
                    )}
                  </DialogTitle>
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    AI Investment Assistant
                    {mode !== 'traditional' && (
                      <Badge variant="outline" className="text-xs capitalize">
                        {mode} Mode
                      </Badge>
                    )}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                {/* Detail level toggle */}
                <div className="flex items-center space-x-2">
                  <span className="text-xs">
                    {userPreferences.responseDetailLevel === 'detailed' ? 'Detailed' : 'Concise'}
                  </span>
                  <Switch
                    checked={userPreferences.responseDetailLevel === 'detailed'}
                    onCheckedChange={handleToggleDetailLevel}
                    size="sm"
                  />
                </div>
                
                {/* AI-enhanced action buttons */}
                {mode !== 'traditional' && (
                  <>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setIsTaskManagerOpen(true)}
                      title="AI Task Manager"
                    >
                      <ListTodo className="h-4 w-4" />
                    </Button>
                    
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={handleGenerateRecommendations}
                      title="AI Insights & Recommendations"
                      disabled={recommendations.isLoading}
                    >
                      {recommendations.isLoading ? (
                        <RefreshCw className="h-4 w-4 animate-spin" />
                      ) : (
                        <Target className="h-4 w-4" />
                      )}
                    </Button>
                  </>
                )}
                
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setExpanded(!isExpanded)}
                  title={isExpanded ? "Minimize" : "Expand"}
                >
                  {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                </Button>
                
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={toggleSearch}
                  title="Search Knowledge"
                >
                  <Search className="h-4 w-4" />
                </Button>
                
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={handleClearConversation}
                  title="Clear Conversation"
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
                
                <Button variant="ghost" size="sm" onClick={onClose}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </DialogHeader>
          
          <div className="flex-1 flex flex-col min-h-0">
            <MessageList 
              messages={messages} 
              isTyping={isTyping}
              mode={mode}
            />
            
            {/* Enhanced suggestion chips for AI modes */}
            {mode !== 'traditional' && (
              <SuggestionChips
                suggestions={suggestions}
                onSuggestionClick={handleSuggestionClick}
                mode={mode}
              />
            )}
            
            <MessageInput
              onSendMessage={handleSendMessage}
              disabled={isTyping}
              placeholder={`Ask Thando about your investments... ${mode !== 'traditional' ? '(AI-Enhanced)' : ''}`}
              mode={mode}
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Enhanced Search Panel */}
      <SearchPanel 
        isOpen={search.isSearchOpen}
        onClose={toggleSearch}
        query={search.query}
        results={search.results}
        isSearching={search.isSearching}
        mode={mode}
      />

      {/* Enhanced Recommendation Panel */}
      <RecommendationPanel 
        isOpen={isRecommendationPanelOpen}
        onClose={() => setIsRecommendationPanelOpen(false)}
        recommendations={recommendations.recommendations}
        isLoading={recommendations.isLoading}
        mode={mode}
      />

      {/* Enhanced Task Manager Panel */}
      <TaskManagerPanel 
        isOpen={isTaskManagerOpen}
        onClose={() => setIsTaskManagerOpen(false)}
        tasks={tasks.tasks}
        isCreating={tasks.isCreating}
        activeTask={tasks.activeTask}
        mode={mode}
      />
    </>
  );
};

export default ThandoChatPanel;