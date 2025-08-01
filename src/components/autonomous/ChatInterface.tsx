'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Send, Bot, User, Settings, MoreHorizontal } from 'lucide-react';
import { useAutonomousChat } from '@/hooks/use-autonomous-chat';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

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
  type: 'execute' | 'view' | 'analyze';
  label: string;
  description?: string;
  data?: any;
}

interface ChatInterfaceProps {
  projectId?: string;
  projectType: 'dashboard' | 'portfolio' | 'due-diligence' | 'workspace' | 'deal-screening';
  className?: string;
}

export function ChatInterface({ projectId, projectType, className = '' }: ChatInterfaceProps) {
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const {
    messages,
    sendMessage,
    executeAction,
    isLoading
  } = useAutonomousChat(projectId, projectType);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!message.trim() || isLoading) return;
    
    const messageText = message;
    setMessage('');
    setIsTyping(true);
    
    try {
      await sendMessage(messageText);
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleActionClick = async (action: ChatAction) => {
    try {
      await executeAction(action);
    } catch (error) {
      console.error('Failed to execute action:', error);
    }
  };

  const getProjectTypeLabel = () => {
    switch (projectType) {
      case 'dashboard': return 'Dashboard Analytics';
      case 'portfolio': return 'Portfolio Management';
      case 'due-diligence': return 'Due Diligence';
      case 'workspace': return 'Workspace';
      default: return 'AI Assistant';
    }
  };

  return (
    <div className={`flex flex-col h-full bg-white ${className}`}>
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="font-semibold text-gray-900">Thando AI Assistant</h2>
            <p className="text-sm text-gray-500">{getProjectTypeLabel()} • Enhanced Mode</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm">
            <Settings className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center py-12">
            <Bot className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Welcome to Enhanced Thando AI
            </h3>
            <p className="text-gray-500 mb-4">
              I'm your intelligent private equity assistant with comprehensive context about your portfolio, deals, and operations. I can provide deep analysis, execute actions, and offer strategic insights.
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              <Badge variant="secondary">Deep Analysis</Badge>
              <Badge variant="secondary">Portfolio Insights</Badge>
              <Badge variant="secondary">Deal Intelligence</Badge>
              <Badge variant="secondary">Action Execution</Badge>
              <Badge variant="secondary">Risk Assessment</Badge>
              <Badge variant="secondary">Report Generation</Badge>
            </div>
            <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800">
                💡 <strong>Try asking:</strong> "How is our portfolio performing?" or "Analyze the TechCorp deal" or "Generate an investment memo"
              </p>
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex space-x-3 max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                msg.role === 'user' 
                  ? 'bg-blue-600' 
                  : 'bg-gray-200'
              }`}>
                {msg.role === 'user' ? (
                  <User className="w-5 h-5 text-white" />
                ) : (
                  <Bot className="w-5 h-5 text-gray-600" />
                )}
              </div>
              
              <div className="space-y-2">
                <Card className={`${
                  msg.role === 'user' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-50'
                }`}>
                  <CardContent className="p-3">
                    {msg.role === 'assistant' ? (
                      <div className="prose prose-sm max-w-none">
                        <ReactMarkdown 
                          remarkPlugins={[remarkGfm]}
                          components={{
                            // Style headings
                            h1: ({children}) => <h1 className="text-lg font-semibold text-gray-900 mb-2">{children}</h1>,
                            h2: ({children}) => <h2 className="text-base font-semibold text-gray-900 mb-2">{children}</h2>,
                            h3: ({children}) => <h3 className="text-sm font-semibold text-gray-900 mb-1">{children}</h3>,
                            // Style lists
                            ul: ({children}) => <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">{children}</ul>,
                            ol: ({children}) => <ol className="list-decimal list-inside space-y-1 text-sm text-gray-700">{children}</ol>,
                            li: ({children}) => <li className="text-sm text-gray-700">{children}</li>,
                            // Style paragraphs
                            p: ({children}) => <p className="text-sm text-gray-700 mb-2">{children}</p>,
                            // Style emphasis
                            strong: ({children}) => <strong className="font-semibold text-gray-900">{children}</strong>,
                            em: ({children}) => <em className="italic text-gray-700">{children}</em>,
                            // Style code
                            code: ({children}) => <code className="bg-gray-100 px-1 py-0.5 rounded text-xs font-mono">{children}</code>,
                            // Style blockquotes
                            blockquote: ({children}) => <blockquote className="border-l-2 border-gray-300 pl-3 italic text-gray-600">{children}</blockquote>
                          }}
                        >
                          {msg.content}
                        </ReactMarkdown>
                      </div>
                    ) : (
                      <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                    )}
                    {msg.status === 'sending' && (
                      <div className="mt-2">
                        <div className="animate-pulse text-xs opacity-60">Sending...</div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Action Buttons */}
                {msg.actions && msg.actions.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {msg.actions.map((action) => (
                      <Button
                        key={action.id}
                        variant="outline"
                        size="sm"
                        onClick={() => handleActionClick(action)}
                        className="text-xs"
                      >
                        {action.label}
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Typing Indicator */}
        {(isTyping || isLoading) && (
          <div className="flex justify-start">
            <div className="flex space-x-3">
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                <Bot className="w-5 h-5 text-gray-600" />
              </div>
              <Card className="bg-gray-50">
                <CardContent className="p-3">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex space-x-3">
          <Input
            ref={inputRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me anything about your projects..."
            className="flex-1"
            disabled={isLoading}
          />
          <Button 
            onClick={handleSendMessage}
            disabled={!message.trim() || isLoading}
            className="px-4"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Press Enter to send, Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}