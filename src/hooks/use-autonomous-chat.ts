'use client';

import { useState, useCallback, useRef } from 'react';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  actions?: ChatAction[];
  status?: 'sending' | 'sent' | 'error';
}

interface ChatAction {
  id: string;
  type: 'execute' | 'view' | 'analyze' | 'generate' | 'update';
  label: string;
  description?: string;
  data?: any;
  estimatedTime?: string;
  riskLevel?: 'low' | 'medium' | 'high';
  prerequisites?: string[];
  impacts?: string[];
}

interface UseAutonomousChatReturn {
  messages: Message[];
  sendMessage: (content: string) => Promise<void>;
  executeAction: (action: ChatAction) => Promise<void>;
  clearChat: () => void;
  isLoading: boolean;
  error: string | null;
}

// Mock AI responses for different project types
const generateAIResponse = (
  message: string, 
  projectType: string, 
  projectId?: string
): { content: string; actions?: ChatAction[] } => {
  const lowerMessage = message.toLowerCase();
  
  // Analysis requests
  if (lowerMessage.includes('analyze') || lowerMessage.includes('analysis')) {
    return {
      content: `I'll analyze the ${projectType} data for you. Based on the current metrics, I can see several key insights:\n\n• Performance is trending positively with a 15% increase over last quarter\n• Risk factors are within acceptable parameters\n• Cash flow projections look strong for the next 6 months\n\nWould you like me to generate a detailed report or dive deeper into any specific area?`,
      actions: [
        {
          id: 'generate-report',
          type: 'generate',
          label: 'Generate Full Report',
          description: 'Create a comprehensive analysis report with charts and recommendations',
          estimatedTime: '2-3 minutes',
          riskLevel: 'low',
          impacts: ['PDF report generated', 'Stakeholders can be notified', 'Data exported to dashboard']
        },
        {
          id: 'deep-dive',
          type: 'analyze',
          label: 'Deep Dive Analysis',
          description: 'Perform detailed analysis on specific metrics',
          estimatedTime: '5-7 minutes',
          riskLevel: 'low'
        }
      ]
    };
  }
  
  // Performance queries
  if (lowerMessage.includes('performance') || lowerMessage.includes('metrics')) {
    return {
      content: `Here's a quick performance overview:\n\n**Financial Metrics:**\n• Current Value: $50M (+12% MoM)\n• IRR: 18.5%\n• Multiple: 2.3x\n\n**Operational Metrics:**\n• Deal velocity: 15% above target\n• Pipeline health: Strong\n• Team utilization: 85%\n\nThe overall performance is exceeding expectations. Would you like me to update the dashboard or schedule a review with stakeholders?`,
      actions: [
        {
          id: 'update-dashboard',
          type: 'update',
          label: 'Update Dashboard',
          description: 'Refresh all dashboard metrics with latest data',
          estimatedTime: '30 seconds',
          riskLevel: 'low'
        },
        {
          id: 'schedule-review',
          type: 'execute',
          label: 'Schedule Review',
          description: 'Set up stakeholder meeting to discuss performance',
          estimatedTime: '1 minute',
          riskLevel: 'low'
        }
      ]
    };
  }
  
  // Risk assessment
  if (lowerMessage.includes('risk') || lowerMessage.includes('exposure')) {
    return {
      content: `Risk Assessment Summary:\n\n**Current Risk Level: MEDIUM**\n\n**Key Risk Factors:**\n• Market volatility (Impact: Medium)\n• Regulatory changes (Impact: Low)\n• Concentration risk (Impact: High)\n\n**Mitigation Strategies:**\n• Diversification across sectors\n• Regular stress testing\n• Enhanced monitoring protocols\n\nI recommend implementing additional risk controls. Shall I prepare a risk mitigation plan?`,
      actions: [
        {
          id: 'create-mitigation-plan',
          type: 'generate',
          label: 'Create Mitigation Plan',
          description: 'Generate comprehensive risk mitigation strategy',
          estimatedTime: '3-5 minutes',
          riskLevel: 'medium',
          prerequisites: ['Risk committee approval may be required'],
          impacts: ['New risk controls implemented', 'Compliance documentation updated']
        }
      ]
    };
  }
  
  // General help
  if (lowerMessage.includes('help') || lowerMessage.includes('what can you do')) {
    return {
      content: `I can help you with various ${projectType} tasks:\n\n**Analysis & Insights:**\n• Performance analysis\n• Risk assessment\n• Market research\n• Competitive analysis\n\n**Actions & Automation:**\n• Generate reports\n• Update dashboards\n• Schedule meetings\n• Send notifications\n\n**Data Management:**\n• Export data\n• Create visualizations\n• Track KPIs\n• Monitor alerts\n\nWhat would you like to work on first?`,
      actions: [
        {
          id: 'show-capabilities',
          type: 'view',
          label: 'Show All Capabilities',
          description: 'Display detailed list of available functions',
          estimatedTime: 'Instant',
          riskLevel: 'low'
        }
      ]
    };
  }
  
  // Default response
  return {
    content: `I understand you're asking about "${message}". I'm here to help you manage your ${projectType} projects more effectively.\n\nI can assist with analysis, generate reports, execute actions, and provide insights. What specific task would you like me to help you with?`,
    actions: [
      {
        id: 'suggest-actions',
        type: 'view',
        label: 'Suggest Actions',
        description: 'Show relevant actions for this project',
        estimatedTime: 'Instant',
        riskLevel: 'low'
      }
    ]
  };
};

export function useAutonomousChat(
  projectId?: string,
  projectType: 'dashboard' | 'portfolio' | 'due-diligence' | 'workspace' | 'deal-screening' = 'dashboard'
): UseAutonomousChatReturn {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messageIdCounter = useRef(0);

  const generateMessageId = () => {
    messageIdCounter.current += 1;
    return `msg-${messageIdCounter.current}-${Date.now()}`;
  };

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;

    const userMessage: Message = {
      id: generateMessageId(),
      content,
      role: 'user',
      timestamp: new Date(),
      status: 'sent'
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

      const aiResponse = generateAIResponse(content, projectType, projectId);
      
      const assistantMessage: Message = {
        id: generateMessageId(),
        content: aiResponse.content,
        role: 'assistant',
        timestamp: new Date(),
        actions: aiResponse.actions,
        status: 'sent'
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      setError('Failed to send message. Please try again.');
      console.error('Error sending message:', err);
    } finally {
      setIsLoading(false);
    }
  }, [projectId, projectType]);

  const executeAction = useCallback(async (action: ChatAction) => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate action execution
      await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 3000));

      const confirmationMessage: Message = {
        id: generateMessageId(),
        content: `✅ Action "${action.label}" has been executed successfully!\n\n${action.description || 'The requested action has been completed.'}\n\nYou can find the results in your dashboard or the relevant section of the application.`,
        role: 'assistant',
        timestamp: new Date(),
        status: 'sent'
      };

      setMessages(prev => [...prev, confirmationMessage]);
    } catch (err) {
      setError('Failed to execute action. Please try again.');
      console.error('Error executing action:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearChat = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  return {
    messages,
    sendMessage,
    executeAction,
    clearChat,
    isLoading,
    error
  };
}