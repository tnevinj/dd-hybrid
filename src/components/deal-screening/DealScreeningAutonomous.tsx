import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Bot,
  User,
  Send,
  MessageCircle,
  Zap,
  Brain,
  CheckCircle,
  Clock,
  AlertTriangle,
  TrendingUp,
  Play,
  Pause,
  Settings,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Minimize2,
  Maximize2,
  RefreshCw,
} from 'lucide-react';
import { DealOpportunity, AIRecommendation, AutomatedAction, PendingApproval } from '@/types/deal-screening';

// Conversation Message Component
interface ConversationMessage {
  id: string;
  type: 'ai' | 'user';
  content: string;
  timestamp: Date;
  actions?: Array<{ label: string; primary?: boolean; onClick: () => void }>;
  status?: 'sending' | 'sent' | 'processing';
}

const MessageBubble: React.FC<{
  message: ConversationMessage;
}> = ({ message }) => {
  const isAI = message.type === 'ai';
  
  return (
    <div className={`flex mb-4 ${isAI ? 'justify-start' : 'justify-end'}`}>
      {isAI && (
        <div className="flex-shrink-0 w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center mr-3 mt-1">
          <Bot className="h-4 w-4 text-white" />
        </div>
      )}
      
      <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
        isAI 
          ? 'bg-purple-100 text-purple-900 border border-purple-200' 
          : 'bg-purple-600 text-white'
      }`}>
        <p className="text-sm">{message.content}</p>
        
        {message.actions && (
          <div className="flex flex-wrap gap-2 mt-3">
            {message.actions.map((action, index) => (
              <Button
                key={index}
                size="sm"
                variant={action.primary ? 'default' : 'outline'}
                className={`text-xs ${
                  isAI 
                    ? 'bg-purple-600 hover:bg-purple-700 text-white border-purple-600' 
                    : 'bg-white text-purple-600 border-white hover:bg-purple-50'
                }`}
                onClick={action.onClick}
              >
                {action.label}
              </Button>
            ))}
          </div>
        )}
        
        {message.status === 'processing' && (
          <div className="flex items-center mt-2 text-xs text-purple-600">
            <div className="animate-spin rounded-full h-3 w-3 border-b border-purple-600 mr-2" />
            <span>AI is thinking...</span>
          </div>
        )}
      </div>
      
      {!isAI && (
        <div className="flex-shrink-0 w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center ml-3 mt-1">
          <User className="h-4 w-4 text-white" />
        </div>
      )}
    </div>
  );
};

// Quick Action Suggestions
const QuickActionSuggestions: React.FC<{
  suggestions: Array<{ label: string; icon: React.ReactNode; onClick: () => void }>;
}> = ({ suggestions }) => {
  if (suggestions.length === 0) return null;
  
  return (
    <div className="mb-4">
      <p className="text-sm text-gray-600 mb-2">Quick actions:</p>
      <div className="flex flex-wrap gap-2">
        {suggestions.map((suggestion, index) => (
          <Button
            key={index}
            variant="outline"
            size="sm"
            onClick={suggestion.onClick}
            className="flex items-center space-x-1 text-purple-600 border-purple-300 hover:bg-purple-50"
          >
            {suggestion.icon}
            <span>{suggestion.label}</span>
          </Button>
        ))}
      </div>
    </div>
  );
};

// AI Status Indicator
const AIStatusIndicator: React.FC<{
  status: 'idle' | 'thinking' | 'processing' | 'speaking';
  currentTask?: string;
}> = ({ status, currentTask }) => {
  const getStatusInfo = () => {
    switch (status) {
      case 'idle':
        return { icon: <Brain className="h-4 w-4" />, text: 'Ready', color: 'text-gray-600 bg-gray-100' };
      case 'thinking':
        return { icon: <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600" />, text: 'Thinking...', color: 'text-purple-600 bg-purple-100' };
      case 'processing':
        return { icon: <RefreshCw className="h-4 w-4 animate-spin" />, text: 'Processing', color: 'text-blue-600 bg-blue-100' };
      case 'speaking':
        return { icon: <Volume2 className="h-4 w-4" />, text: 'Speaking', color: 'text-green-600 bg-green-100' };
    }
  };
  
  const { icon, text, color } = getStatusInfo();
  
  return (
    <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full ${color}`}>
      {icon}
      <span className="text-sm font-medium">{text}</span>
      {currentTask && status !== 'idle' && (
        <span className="text-xs opacity-75"> • {currentTask}</span>
      )}
    </div>
  );
};

// Conversation Input Component
const ConversationInput: React.FC<{
  onSendMessage: (message: string) => void;
  isProcessing: boolean;
  placeholder?: string;
}> = ({ onSendMessage, isProcessing, placeholder = "Ask me anything about deal screening..." }) => {
  const [message, setMessage] = useState('');
  const [isListening, setIsListening] = useState(false);
  
  const handleSend = () => {
    if (message.trim() && !isProcessing) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
  
  return (
    <div className="flex items-center space-x-2 p-3 bg-white border border-purple-200 rounded-2xl shadow-sm">
      <Input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder={placeholder}
        disabled={isProcessing}
        className="border-0 focus:ring-0 bg-transparent"
      />
      
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsListening(!isListening)}
        className={`p-2 rounded-full ${
          isListening ? 'bg-red-100 text-red-600' : 'text-gray-500 hover:bg-gray-100'
        }`}
      >
        {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
      </Button>
      
      <Button
        onClick={handleSend}
        disabled={!message.trim() || isProcessing}
        size="sm"
        className="p-2 rounded-full bg-purple-600 hover:bg-purple-700 text-white"
      >
        <Send className="h-4 w-4" />
      </Button>
    </div>
  );
};

// Processing Status Component
const ProcessingStatus: React.FC<{
  currentTask: string;
  progress: number;
  tasksCompleted: number;
  totalTasks: number;
  estimatedTimeRemaining: string;
}> = ({ currentTask, progress, tasksCompleted, totalTasks, estimatedTimeRemaining }) => (
  <Card className="mb-4 border-2 border-blue-300 bg-blue-50">
    <CardContent className="p-4">
      <div className="flex items-center space-x-2 mb-3">
        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600" />
        <h3 className="font-semibold text-blue-900">AI Processing in Progress</h3>
      </div>
      
      <p className="text-sm text-gray-700 mb-3">Current: {currentTask}</p>
      
      <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
        <div 
          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
      
      <div className="flex justify-between text-xs text-gray-600">
        <span>{tasksCompleted} of {totalTasks} tasks completed</span>
        <span>~{estimatedTimeRemaining} remaining</span>
      </div>
    </CardContent>
  </Card>
);

// Floating Control Panel
const FloatingControls: React.FC<{
  onSwitchMode: (mode: 'traditional' | 'assisted') => void;
  onPauseAI: () => void;
  onSettings: () => void;
  isPaused: boolean;
  isMinimized: boolean;
  onToggleMinimize: () => void;
}> = ({ onSwitchMode, onPauseAI, onSettings, isPaused, isMinimized, onToggleMinimize }) => (
  <div className="fixed bottom-4 right-4 flex flex-col space-y-2">
    <Button
      size="sm"
      variant="outline"
      onClick={onToggleMinimize}
      className="rounded-full w-10 h-10 p-0 bg-white shadow-lg border-purple-200"
      title={isMinimized ? 'Expand' : 'Minimize'}
    >
      {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
    </Button>
    
    <Button
      size="sm"
      variant={isPaused ? 'default' : 'destructive'}
      onClick={onPauseAI}
      className="rounded-full w-10 h-10 p-0 shadow-lg"
      title={isPaused ? 'Resume AI' : 'Pause AI'}
    >
      {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
    </Button>
    
    <Button
      size="sm"
      variant="outline"
      onClick={onSettings}
      className="rounded-full w-10 h-10 p-0 bg-white shadow-lg border-gray-200"
      title="Settings"
    >
      <Settings className="h-4 w-4" />
    </Button>
  </div>
);

interface DealScreeningAutonomousProps {
  opportunities: DealOpportunity[];
  automatedActions: AutomatedAction[];
  pendingApprovals: PendingApproval[];
  aiRecommendations: AIRecommendation[];
  isProcessing: boolean;
  onApproveAction: (approvalId: string) => void;
  onRejectAction: (approvalId: string) => void;
  onSwitchMode: (mode: 'traditional' | 'assisted') => void;
  onPauseAI: () => void;
  onResumeAI: () => void;
  isPaused: boolean;
  onCreateOpportunity?: () => void;
  onViewOpportunity?: (id: string) => void;
  onScreenOpportunity?: (id: string) => void;
}

export const DealScreeningAutonomous: React.FC<DealScreeningAutonomousProps> = ({
  opportunities = [],
  automatedActions = [],
  pendingApprovals = [],
  aiRecommendations = [],
  isProcessing = false,
  onApproveAction,
  onRejectAction,
  onSwitchMode,
  onPauseAI,
  onResumeAI,
  isPaused = false,
  onCreateOpportunity,
  onViewOpportunity,
  onScreenOpportunity,
}) => {
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [aiStatus, setAiStatus] = useState<'idle' | 'thinking' | 'processing' | 'speaking'>('idle');
  const [isMinimized, setIsMinimized] = useState(false);
  const [currentTask, setCurrentTask] = useState<string>();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize conversation
  useEffect(() => {
    const initialMessages: ConversationMessage[] = [
      {
        id: '1',
        type: 'ai',
        content: `Hello! I'm your AI Deal Screening Assistant. I've been analyzing your pipeline and I'm ready to help you make intelligent investment decisions. I can autonomously screen deals, provide insights, and recommend actions. What would you like to focus on today?`,
        timestamp: new Date(),
        actions: [
          { label: 'Show Pipeline', primary: true, onClick: () => handleAIAction('show-pipeline') },
          { label: 'Screen New Deals', onClick: () => handleAIAction('screen-deals') },
          { label: 'Generate Report', onClick: () => handleAIAction('generate-report') }
        ]
      }
    ];
    setMessages(initialMessages);
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Simulate AI processing
  useEffect(() => {
    if (isProcessing && !isPaused) {
      setAiStatus('thinking');
      const tasks = [
        'Analyzing deal metrics',
        'Comparing to portfolio',
        'Calculating risk scores',
        'Generating insights',
        'Preparing recommendations'
      ];
      
      const interval = setInterval(() => {
        const task = tasks[Math.floor(Math.random() * tasks.length)];
        setCurrentTask(task);
      }, 2000);
      
      return () => clearInterval(interval);
    } else {
      setAiStatus('idle');
      setCurrentTask(undefined);
    }
  }, [isProcessing, isPaused]);

  const handleSendMessage = (content: string) => {
    // Add user message
    const userMessage: ConversationMessage = {
      id: Date.now().toString(),
      type: 'user',
      content,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    // Simulate AI response
    setAiStatus('thinking');
    setTimeout(() => {
      const aiResponse = generateAIResponse(content);
      setMessages(prev => [...prev, aiResponse]);
      setAiStatus('idle');
    }, 1500);
  };

  const generateAIResponse = (userInput: string): ConversationMessage => {
    // Simple response generation based on user input
    let response = "I understand. Let me help you with that.";
    let actions: Array<{ label: string; primary?: boolean; onClick: () => void }> = [];
    
    if (userInput.toLowerCase().includes('screen') || userInput.toLowerCase().includes('analyze')) {
      response = `I'll analyze your deal opportunities right away. Based on your current pipeline of ${opportunities.length} deals, I recommend focusing on the highest-potential opportunities first. I can automatically screen these using our advanced AI models.`;
      actions = [
        { label: 'Start Screening', primary: true, onClick: () => handleAIAction('start-screening') },
        { label: 'Show Details', onClick: () => handleAIAction('show-details') }
      ];
    } else if (userInput.toLowerCase().includes('report') || userInput.toLowerCase().includes('summary')) {
      response = "I'll generate a comprehensive screening report for you. This will include deal rankings, risk assessments, and investment recommendations based on your criteria.";
      actions = [
        { label: 'Generate Report', primary: true, onClick: () => handleAIAction('generate-report') },
        { label: 'Customize Format', onClick: () => handleAIAction('customize-report') }
      ];
    } else if (userInput.toLowerCase().includes('risk') || userInput.toLowerCase().includes('concern')) {
      response = "I'll perform a thorough risk analysis across all opportunities. I can identify potential red flags, concentration risks, and market concerns that might impact your investment decisions.";
      actions = [
        { label: 'Run Risk Analysis', primary: true, onClick: () => handleAIAction('risk-analysis') },
        { label: 'Show Risk Matrix', onClick: () => handleAIAction('risk-matrix') }
      ];
    }
    
    return {
      id: Date.now().toString(),
      type: 'ai',
      content: response,
      timestamp: new Date(),
      actions
    };
  };

  const handleAIAction = (action: string) => {
    console.log(`AI Action executed: ${action}`);
    
    // Add contextual AI message based on action
    const contextualResponses: Record<string, string> = {
      'show-pipeline': `Here's your current pipeline: ${opportunities.length} opportunities with a total value of $2.4B. 3 deals are high-priority and ready for immediate screening.`,
      'screen-deals': 'I\'ve initiated autonomous screening for your top 5 opportunities. This process will take approximately 3 minutes and will provide detailed scoring and recommendations.',
      'generate-report': 'Generating comprehensive deal screening report with executive summary, detailed analysis, and investment recommendations. ETA: 2 minutes.',
      'start-screening': 'Autonomous screening initiated. I\'m analyzing financial metrics, market position, management quality, and strategic fit for each opportunity.',
      'risk-analysis': 'Comprehensive risk analysis in progress. Evaluating market risks, operational risks, financial risks, and ESG factors across all opportunities.'
    };
    
    const response = contextualResponses[action] || 'Action completed successfully.';
    
    const aiMessage: ConversationMessage = {
      id: Date.now().toString(),
      type: 'ai',
      content: response,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, aiMessage]);
  };

  const quickSuggestions = [
    { label: 'Analyze Pipeline', icon: <TrendingUp className="h-3 w-3" />, onClick: () => handleSendMessage('Analyze my current pipeline') },
    { label: 'Screen Top Deals', icon: <CheckCircle className="h-3 w-3" />, onClick: () => handleSendMessage('Screen my top 5 deals') },
    { label: 'Risk Assessment', icon: <AlertTriangle className="h-3 w-3" />, onClick: () => handleSendMessage('Perform risk assessment') },
    { label: 'Generate Report', icon: <TrendingUp className="h-3 w-3" />, onClick: () => handleSendMessage('Generate screening report') }
  ];

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 w-80 h-16 bg-white border border-purple-200 rounded-2xl shadow-xl flex items-center p-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
            <Bot className="h-4 w-4 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">AI Assistant</p>
            <AIStatusIndicator status={aiStatus} currentTask={currentTask} />
          </div>
        </div>
        <FloatingControls
          onSwitchMode={onSwitchMode}
          onPauseAI={isPaused ? onResumeAI : onPauseAI}
          onSettings={() => console.log('Settings')}
          isPaused={isPaused}
          isMinimized={isMinimized}
          onToggleMinimize={() => setIsMinimized(false)}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 p-4">
      {/* Header */}
      <div className="mb-6 text-center">
        <div className="inline-flex items-center space-x-3 bg-white px-6 py-3 rounded-2xl shadow-sm border border-purple-200">
          <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
            <Bot className="h-4 w-4 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">AI Deal Screening Assistant</h1>
            <div className="flex items-center space-x-2 mt-1">
              <Badge className="bg-purple-100 text-purple-800 border border-purple-300 flex items-center space-x-1">
                <Zap className="h-3 w-3" />
                <span>Autonomous Mode</span>
              </Badge>
              <AIStatusIndicator status={aiStatus} currentTask={currentTask} />
            </div>
          </div>
        </div>
      </div>

      {/* Main Conversation Container */}
      <div className="max-w-4xl mx-auto">
        <Card className="bg-white/80 backdrop-blur-sm border border-purple-200 shadow-xl">
          <CardContent className="p-0">
            {/* Conversation Area */}
            <div className="h-96 overflow-y-auto p-6 space-y-4">
              {messages.map((message) => (
                <MessageBubble key={message.id} message={message} />
              ))}
              <div ref={messagesEndRef} />
            </div>
            
            {/* Quick Actions */}
            <div className="px-6 py-4 border-t border-purple-100">
              <QuickActionSuggestions suggestions={quickSuggestions} />
            </div>
            
            {/* Input Area */}
            <div className="p-6 border-t border-purple-100">
              <ConversationInput
                onSendMessage={handleSendMessage}
                isProcessing={aiStatus !== 'idle'}
                placeholder={isPaused ? 'AI is paused. Resume to continue...' : 'Ask me anything about deal screening...'}
              />
            </div>
          </CardContent>
        </Card>
        
        {/* Performance Summary */}
        <Card className="mt-6 bg-gradient-to-r from-purple-100 to-indigo-100 border border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-purple-900 mb-1">Today's AI Performance</h3>
                <p className="text-purple-700 text-sm">Autonomous screening and analysis impact</p>
              </div>
              <div className="grid grid-cols-4 gap-6 text-center">
                <div>
                  <p className="text-2xl font-bold text-green-600">8.5h</p>
                  <p className="text-xs text-gray-600">Time Saved</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-blue-600">94%</p>
                  <p className="text-xs text-gray-600">Accuracy</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-purple-600">{opportunities.length}</p>
                  <p className="text-xs text-gray-600">Deals Processed</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-orange-600">18</p>
                  <p className="text-xs text-gray-600">Actions Automated</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Floating Controls */}
      <FloatingControls
        onSwitchMode={onSwitchMode}
        onPauseAI={isPaused ? onResumeAI : onPauseAI}
        onSettings={() => console.log('Settings')}
        isPaused={isPaused}
        isMinimized={isMinimized}
        onToggleMinimize={() => setIsMinimized(true)}
      />
    </div>
  );
};

export default DealScreeningAutonomous;