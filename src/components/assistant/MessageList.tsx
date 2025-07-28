'use client';

import React, { useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, Zap, User } from 'lucide-react';
import { Message } from '@/lib/types/assistant/assistantTypes';
import ThandoAvatar from './ThandoAvatar';

interface MessageListProps {
  messages: Message[];
  isTyping: boolean;
  mode?: 'traditional' | 'assisted' | 'autonomous';
}

/**
 * MessageList Component - Enhanced for DD-Hybrid
 * 
 * Displays a list of messages in the chat with hybrid
 * navigation mode-specific styling and features.
 */
const MessageList: React.FC<MessageListProps> = ({ 
  messages, 
  isTyping,
  mode = 'traditional'
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Scroll to the bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);
  
  // Format the timestamp - convert ISO string to readable time
  const formatTimestamp = (timestamp: string) => {
    try {
      const date = new Date(timestamp);
      
      // Check if the date is valid
      if (isNaN(date.getTime())) {
        console.warn('Invalid timestamp:', timestamp);
        return 'Invalid time';
      }
      
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (error) {
      console.error('Error formatting timestamp:', error, timestamp);
      return 'Invalid time';
    }
  };

  // Get mode-specific styling for assistant messages
  const getAssistantMessageStyle = () => {
    switch (mode) {
      case 'autonomous':
        return 'bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200 text-gray-900';
      case 'assisted':
        return 'bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200 text-gray-900';
      default:
        return 'bg-gray-100 text-gray-900';
    }
  };

  // Get mode-specific icon
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
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message) => (
        <div key={message.id} className="flex items-start space-x-2">
          {message.sender === 'assistant' ? (
            <ThandoAvatar 
              expression="default"
              size={32}
              mode={mode}
            />
          ) : (
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <User className="h-4 w-4 text-white" />
            </div>
          )}
          
          <div className="flex-1">
            <Card className={`
              p-3 max-w-[85%] w-fit border
              ${message.sender === 'user' 
                ? 'ml-auto bg-blue-500 text-white rounded-br-sm border-blue-600' 
                : `mr-auto ${getAssistantMessageStyle()} rounded-bl-sm`
              }
            `}>
              <div className="whitespace-pre-wrap break-words">
                {message.content}
              </div>
              <div className={`
                text-xs mt-1 opacity-70 flex items-center gap-1
                ${message.sender === 'user' ? 'justify-end' : 'justify-start'}
              `}>
                {message.sender === 'assistant' && mode !== 'traditional' && getModeIcon()}
                <span>{formatTimestamp(message.timestamp)}</span>
                {message.sender === 'assistant' && mode !== 'traditional' && (
                  <Badge variant="secondary" className="text-xs ml-1">
                    AI
                  </Badge>
                )}
              </div>
            </Card>
          </div>
        </div>
      ))}
      
      {/* Typing indicator */}
      {isTyping && (
        <div className="flex items-start space-x-2">
          <ThandoAvatar 
            expression="thinking"
            size={32}
            mode={mode}
            pulseAnimation={true}
          />
          <div className="flex-1">
            <Card className={`
              p-3 max-w-[85%] w-fit mr-auto border
              ${getAssistantMessageStyle()} rounded-bl-sm
            `}>
              <div className="flex items-center space-x-1">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
                <span className="text-xs text-gray-500 ml-2">Thando is thinking...</span>
                {mode !== 'traditional' && getModeIcon()}
              </div>
            </Card>
          </div>
        </div>
      )}
      
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;