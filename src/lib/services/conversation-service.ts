/**
 * Conversation Service for DD-Hybrid
 * 
 * Enhanced AI conversation service with hybrid navigation
 * mode support and intelligent response generation.
 */

import { 
  Message, 
  MessageSender, 
  MessageContentType, 
  AssistantContext, 
  UserPreferences,
  Suggestion,
  NavigationMode
} from '../types/assistant/assistantTypes';

export interface ConversationSession {
  id: string;
  context: AssistantContext;
  userPreferences: UserPreferences;
  messageHistory: Message[];
  createdAt: string;
  navigationMode: NavigationMode;
}

export interface SendMessageOptions {
  generateSuggestions?: boolean;
  maxHistoryLength?: number;
  enableContextualAnalysis?: boolean;
  proactiveInsights?: boolean;
}

export interface SendMessageResult {
  userMessage: Message;
  assistantMessage: Message;
  suggestions?: Suggestion[];
  contextualInsights?: any[];
}

class ConversationService {
  private sessions: Map<string, ConversationSession> = new Map();

  startConversation(
    context: AssistantContext, 
    userPreferences: UserPreferences
  ): ConversationSession {
    const sessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const session: ConversationSession = {
      id: sessionId,
      context,
      userPreferences,
      messageHistory: [],
      createdAt: new Date().toISOString(),
      navigationMode: context.navigationMode || 'traditional'
    };
    
    this.sessions.set(sessionId, session);
    console.log(`Started conversation session: ${sessionId} in ${session.navigationMode} mode`);
    
    return session;
  }

  async sendMessage(
    sessionId: string,
    content: string,
    options: SendMessageOptions = {}
  ): Promise<SendMessageResult> {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error(`Session ${sessionId} not found`);
    }

    // Create user message
    const userMessage: Message = {
      id: `msg-${Date.now()}-user`,
      content,
      sender: MessageSender.USER,
      timestamp: new Date().toISOString(),
      contentType: MessageContentType.TEXT,
      navigationMode: session.navigationMode
    };

    // Generate AI response based on navigation mode
    const assistantResponse = await this.generateResponse(
      content, 
      session, 
      options
    );

    const assistantMessage: Message = {
      id: `msg-${Date.now()}-assistant`,
      content: assistantResponse.content,
      sender: MessageSender.ASSISTANT,
      timestamp: new Date().toISOString(),
      contentType: MessageContentType.TEXT,
      aiGenerated: session.navigationMode !== 'traditional',
      navigationMode: session.navigationMode,
      confidence: assistantResponse.confidence
    };

    // Update session history
    session.messageHistory.push(userMessage, assistantMessage);
    
    // Trim history if needed
    if (options.maxHistoryLength && session.messageHistory.length > options.maxHistoryLength) {
      session.messageHistory = session.messageHistory.slice(-options.maxHistoryLength);
    }

    const result: SendMessageResult = {
      userMessage,
      assistantMessage
    };

    // Generate suggestions based on mode
    if (options.generateSuggestions) {
      result.suggestions = this.generateSuggestions(content, session);
    }

    return result;
  }

  private async generateResponse(
    userMessage: string, 
    session: ConversationSession,
    options: SendMessageOptions
  ): Promise<{ content: string; confidence: number }> {
    const { navigationMode } = session;
    const lowerMessage = userMessage.toLowerCase();

    // Base responses
    let response = "I understand you're asking about that. Let me help you with the information I have.";
    let confidence = 0.7;

    // Enhanced responses based on content
    if (lowerMessage.includes('portfolio') && lowerMessage.includes('performance')) {
      response = navigationMode === 'traditional' 
        ? "I can show you the portfolio performance data from the dashboard. The current portfolio has an IRR of 17.4% and MOIC of 1.38x."
        : navigationMode === 'assisted'
        ? "Based on AI analysis, your portfolio shows strong performance with 17.4% IRR, outperforming the benchmark by 8.4%. I can provide deeper insights if you'd like."
        : "Your portfolio performance is exceptional at 17.4% IRR. AI analysis indicates optimal allocation in Financial Services (24%) and identifies 3 rebalancing opportunities for enhanced returns.";
      confidence = 0.9;
    } else if (lowerMessage.includes('risk')) {
      response = navigationMode === 'traditional'
        ? "The risk indicators show all metrics are within acceptable limits. Concentration risk is at 8.0% of the 10.0% limit."
        : navigationMode === 'assisted'
        ? "AI risk analysis shows healthy metrics across all categories. Concentration risk at 8.0% suggests room for strategic positioning."
        : "Proactive risk monitoring detects optimal risk positioning. AI recommends maintaining current concentration while exploring healthcare sector opportunities for risk-adjusted returns.";
      confidence = 0.85;
    } else if (lowerMessage.includes('recommendation') || lowerMessage.includes('suggest')) {
      response = navigationMode === 'traditional'
        ? "I can provide recommendations based on your current portfolio data and market conditions."
        : navigationMode === 'assisted'
        ? "AI analysis suggests portfolio rebalancing opportunities and 3 high-potential deals in your target sectors."
        : "Autonomous AI has identified 5 actionable recommendations: 2 rebalancing opportunities, 3 new deal prospects, and optimal timing for LP commitments.";
      confidence = 0.8;
    }

    // Simulate processing delay for AI modes
    if (navigationMode !== 'traditional') {
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
      confidence += 0.1;
    }

    return { content: response, confidence };
  }

  private generateSuggestions(
    userMessage: string, 
    session: ConversationSession
  ): Suggestion[] {
    const { navigationMode } = session;
    const lowerMessage = userMessage.toLowerCase();
    
    const baseSuggestions: Suggestion[] = [];
    
    if (lowerMessage.includes('portfolio')) {
      baseSuggestions.push({
        id: `suggestion-${Date.now()}-1`,
        text: 'Show sector allocation breakdown',
        category: 'portfolio',
        action: 'show_sector_allocation'
      });
    }
    
    if (lowerMessage.includes('performance')) {
      baseSuggestions.push({
        id: `suggestion-${Date.now()}-2`,
        text: 'Compare with benchmark',
        category: 'analysis',
        action: 'compare_benchmark'
      });
    }

    // Enhanced suggestions for AI modes
    if (navigationMode === 'assisted' || navigationMode === 'autonomous') {
      baseSuggestions.push({
        id: `suggestion-${Date.now()}-ai`,
        text: navigationMode === 'autonomous' 
          ? 'Generate proactive insights' 
          : 'Get AI recommendations',
        category: 'ai-analysis',
        action: 'generate_ai_insights',
        aiGenerated: true,
        navigationMode
      });
    }

    return baseSuggestions;
  }

  clearHistory(sessionId: string): void {
    const session = this.sessions.get(sessionId);
    if (session) {
      session.messageHistory = [];
      console.log(`Cleared history for session: ${sessionId}`);
    }
  }

  getSession(sessionId: string): ConversationSession | undefined {
    return this.sessions.get(sessionId);
  }
}

let conversationService: ConversationService;

export function getConversationService(): ConversationService {
  if (!conversationService) {
    conversationService = new ConversationService();
  }
  return conversationService;
}