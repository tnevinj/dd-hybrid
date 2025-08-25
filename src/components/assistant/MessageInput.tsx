'use client';

import React, { useState, KeyboardEvent, useRef, ChangeEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Send, 
  Mic, 
  X, 
  Paperclip, 
  Image as ImageIcon,
  FileText,
  File,
  Brain,
  Zap,
  Sparkles
} from 'lucide-react';

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  onSendMultiModalMessage?: (message: string, files: File[]) => void;
  disabled?: boolean;
  placeholder?: string;
  supportsMultimodal?: boolean;
  mode?: 'traditional' | 'assisted' | 'autonomous';
}

/**
 * Get appropriate icon for a file type
 */
const getFileIcon = (file: File) => {
  const type = file.type;
  
  if (type.startsWith('image/')) {
    return <ImageIcon className="w-4 h-4" />;
  } else if (type.includes('document') || type.includes('word') || type === 'text/plain') {
    return <FileText className="w-4 h-4" />;
  } else {
    return <File className="w-4 h-4" />;
  }
};

/**
 * Format file size in a readable way
 */
const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) {
    return `${bytes} bytes`;
  } else if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  } else {
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }
};

/**
 * MessageInput Component - Enhanced for DD-Hybrid
 * 
 * Provides an input field for the user to type messages
 * and send them to the assistant, with support for file attachments
 * and hybrid navigation mode enhancements.
 */
const MessageInput: React.FC<MessageInputProps> = ({
  onSendMessage,
  onSendMultiModalMessage,
  disabled = false,
  placeholder = 'Type your message...',
  supportsMultimodal = false,
  mode = 'traditional'
}) => {
  const [message, setMessage] = useState('');
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle sending the message
  const handleSend = () => {
    if (message.trim() || attachedFiles.length > 0) {
      if (attachedFiles.length > 0 && onSendMultiModalMessage) {
        onSendMultiModalMessage(message.trim(), attachedFiles);
      } else {
        onSendMessage(message.trim());
      }
      setMessage('');
      setAttachedFiles([]);
    }
  };

  // Handle keyboard events
  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Handle file selection
  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setAttachedFiles(prev => [...prev, ...files]);
    
    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Remove attached file
  const removeAttachedFile = (index: number) => {
    setAttachedFiles(prev => prev.filter((_, i) => i !== index));
  };

  // Toggle voice recording (placeholder functionality)
  const toggleRecording = () => {
    setIsRecording(!isRecording);
    // Voice recording implementation would go here
  };

  // Get mode-specific styling and features
  const getModeInputStyle = () => {
    switch (mode) {
      case 'autonomous':
        return 'border-blue-200 focus:border-blue-500 focus:ring-blue-200';
      case 'assisted':
        return 'border-blue-200 focus:border-blue-500 focus:ring-blue-200';
      default:
        return 'border-gray-200 focus:border-gray-500 focus:ring-gray-200';
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

  const getSendButtonStyle = () => {
    switch (mode) {
      case 'autonomous':
        return 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700';
      case 'assisted':
        return 'bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700';
      default:
        return 'bg-blue-500 hover:bg-blue-600';
    }
  };

  return (
    <div className="border-t bg-white p-4">
      {/* Attached files display */}
      {attachedFiles.length > 0 && (
        <div className="mb-3">
          <div className="flex flex-wrap gap-2">
            {attachedFiles.map((file, index) => (
              <Card key={index} className="p-2 flex items-center space-x-2 bg-gray-50">
                {getFileIcon(file)}
                <div className="text-sm">
                  <div className="font-medium truncate max-w-32" title={file.name}>
                    {file.name}
                  </div>
                  <div className="text-xs text-gray-500">
                    {formatFileSize(file.size)}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeAttachedFile(index)}
                  className="p-1 h-auto"
                >
                  <X className="w-3 h-3" />
                </Button>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Input area */}
      <div className="flex items-end space-x-2">
        {/* File attachment button */}
        {supportsMultimodal && (
          <>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={disabled}
              className="shrink-0"
            >
              <Paperclip className="h-4 w-4" />
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleFileSelect}
              className="hidden"
              accept="image/*,application/pdf,.doc,.docx,.txt"
            />
          </>
        )}

        {/* Voice recording button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleRecording}
          disabled={disabled}
          className={`shrink-0 ${isRecording ? 'text-red-500' : ''}`}
        >
          <Mic className={`h-4 w-4 ${isRecording ? 'animate-pulse' : ''}`} />
        </Button>

        {/* Message input */}
        <div className="flex-1 relative">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            disabled={disabled}
            className={`pr-12 ${getModeInputStyle()}`}
          />
          
          {/* Mode indicator in input */}
          {mode !== 'traditional' && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              {getModeIcon()}
            </div>
          )}
        </div>

        {/* Send button */}
        <Button
          onClick={handleSend}
          disabled={disabled || (!message.trim() && attachedFiles.length === 0)}
          className={`shrink-0 text-white ${getSendButtonStyle()}`}
          size="sm"
        >
          <Send className="h-4 w-4" />
          {mode !== 'traditional' && (
            <Sparkles className="h-3 w-3 ml-1" />
          )}
        </Button>
      </div>

      {/* AI mode indicator */}
      {mode !== 'traditional' && (
        <div className="mt-2 flex items-center justify-center">
          <Badge variant="outline" className="text-xs flex items-center gap-1">
            {getModeIcon()}
            <span>AI-Enhanced Chat ({mode})</span>
          </Badge>
        </div>
      )}
    </div>
  );
};

export default MessageInput;