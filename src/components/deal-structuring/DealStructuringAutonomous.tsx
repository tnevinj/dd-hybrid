'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Bot,
  CheckCircle,
  AlertTriangle,
  Clock,
  BarChart3,
  FileText,
  Calendar,
  Users,
  Settings,
  Brain,
  Zap,
  TrendingUp,
  MessageCircle
} from 'lucide-react';
import { useDealStructuring } from '@/hooks/use-deal-structuring';

interface ConversationMessage {
  id: string;
  type: 'ai' | 'user';
  content: string;
  timestamp: Date;
  actions?: { label: string; action: string; primary?: boolean }[];
}

const DealStructuringAutonomous: React.FC = () => {
  const { metrics, deals, isLoading, error } = useDealStructuring();
  const [messages, setMessages] = useState<ConversationMessage[]>([
    {
      id: '1',
      type: 'ai',
      content: `Good morning! I've analyzed your deal portfolio and completed several tasks overnight. Here's what needs your attention:`,
      timestamp: new Date(),
    }
  ]);

  const handleAction = (action: string) => {
    console.log('Executing action:', action);
    // Add user response
    const userMessage: ConversationMessage = {
      id: Date.now().toString(),
      type: 'user', 
      content: `Executed: ${action}`,
      timestamp: new Date()
    };
    
    // Add AI response
    const aiResponse: ConversationMessage = {
      id: (Date.now() + 1).toString(),
      type: 'ai',
      content: `Perfect! I've processed your request. Moving to the next priority...`,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage, aiResponse]);
  };

  const switchMode = (mode: string) => {
    console.log('Switching to mode:', mode);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 bg-blue-100 rounded-full">
            <Bot className="h-8 w-8 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Autonomous Deal Assistant</h1>
        </div>
        <p className="text-gray-600">AI handles routine tasks, you focus on strategic decisions</p>
      </div>

      {/* Conversation Interface */}
      <Card className="min-h-[600px] flex flex-col">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-blue-600" />
              <span className="font-semibold">AI Assistant</span>
              <Badge variant="default" className="bg-green-100 text-green-800">
                Active
              </Badge>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => switchMode('traditional')}
            >
              <Settings className="h-4 w-4 mr-2" />
              Switch to Traditional
            </Button>
          </div>
        </CardHeader>

        <CardContent className="flex-1 p-6 space-y-6">
          {/* Automated Completion Summary */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <h3 className="font-semibold text-green-900">Completed Automatically</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-3 w-3 text-green-500" />
                  <span>Updated TechCorp DCF model with Q3 actuals</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-3 w-3 text-green-500" />
                  <span>Generated risk assessment for GreenEnergy</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-3 w-3 text-green-500" />
                  <span>Scheduled IC prep meetings for HealthTech</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-3 w-3 text-green-500" />
                  <span>Benchmarked valuations against comps</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-3 w-3 text-green-500" />
                  <span>Updated team task assignments</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-3 w-3 text-green-500" />
                  <span>Prepared preliminary IC memos</span>
                </div>
              </div>
            </div>
          </div>

          {/* Decision Requests */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <Brain className="h-5 w-5 text-purple-600" />
              Decisions Required
            </h3>

            {/* Decision 1: Risk Assessment */}
            <Card className="border-l-4 border-l-amber-500">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-amber-600 mt-1" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-2">
                      TechCorp Leverage Concern
                    </h4>
                    <p className="text-sm text-gray-700 mb-3">
                      Updated financial model shows peak leverage of 6.2x EBITDA, above your typical 5.5x threshold. 
                      Customer concentration has also increased to 45% (top 3 clients).
                    </p>
                    <div className="bg-gray-50 p-3 rounded mb-3 text-xs">
                      <p><strong>Analysis:</strong> Similar deals in Q2 averaged 5.1x leverage with 35% concentration</p>
                      <p><strong>Risk Score:</strong> Medium → High (increased from yesterday)</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button 
                        size="sm" 
                        onClick={() => handleAction('FLAG_HIGH_RISK')}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        Flag as High Risk
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleAction('PROCEED_WITH_MONITORING')}
                      >
                        Proceed with Monitoring
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => handleAction('REQUEST_DEEP_DIVE')}
                      >
                        Request Deep Dive
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Decision 2: Technology Assessment */}
            <Card className="border-l-4 border-l-blue-500">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <BarChart3 className="h-5 w-5 text-blue-600 mt-1" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-2">
                      GreenEnergy Technical DD
                    </h4>
                    <p className="text-sm text-gray-700 mb-3">
                      Initial tech stack analysis reveals 60% legacy systems. Industry benchmark shows 
                      35% legacy is typical. Should I schedule a technical due diligence call with their CTO?
                    </p>
                    <div className="bg-blue-50 p-3 rounded mb-3 text-xs">
                      <p><strong>Recommendation:</strong> Schedule 2-hour technical deep dive</p>
                      <p><strong>Suggested attendees:</strong> CTO, Lead Developer, Infrastructure Head</p>
                      <p><strong>Focus areas:</strong> Modernization roadmap, technical debt, scalability</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button 
                        size="sm"
                        onClick={() => handleAction('SCHEDULE_TECH_DD')}
                      >
                        Schedule Tech DD
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleAction('FLAG_TECH_RISK')}
                      >
                        Flag Tech Risk
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => handleAction('CONTINUE_WITHOUT_DD')}
                      >
                        Continue Without DD
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Decision 3: Market Timing */}
            <Card className="border-l-4 border-l-green-500">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <TrendingUp className="h-5 w-5 text-green-600 mt-1" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-2">
                      HealthTech Market Window
                    </h4>
                    <p className="text-sm text-gray-700 mb-3">
                      HealthTech valuations are up 15% this quarter. Current exit multiple assumptions 
                      may be conservative. Should I update the base case from 12x to 14x EBITDA?
                    </p>
                    <div className="bg-green-50 p-3 rounded mb-3 text-xs">
                      <p><strong>Market data:</strong> Recent comps trading at 13.8x median</p>
                      <p><strong>Impact:</strong> +$23M equity value, IRR increases to 28.1%</p>
                      <p><strong>Risk:</strong> Market may correct, creating downside</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button 
                        size="sm"
                        onClick={() => handleAction('UPDATE_MULTIPLES')}
                      >
                        Update to 14x
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleAction('CONSERVATIVE_APPROACH')}
                      >
                        Keep Conservative
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => handleAction('CREATE_SCENARIOS')}
                      >
                        Create Scenarios
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Next Actions */}
          <div className="pt-6 border-t">
            <div className="flex items-center gap-2 mb-4">
              <Bot className="h-5 w-5 text-blue-600" />
              <span className="font-semibold">Ready for Next Phase</span>
            </div>
            <p className="text-sm text-gray-700 mb-4">
              Based on your decisions above, I'll prepare updated financial models and IC presentation materials. 
              I estimate this will take 45 minutes. Should I proceed?
            </p>
            <div className="flex gap-3">
              <Button onClick={() => handleAction('PROCEED_NEXT_PHASE')}>
                <Zap className="h-4 w-4 mr-2" />
                Yes, Proceed
              </Button>
              <Button variant="outline" onClick={() => handleAction('SHOW_DETAILED_PLAN')}>
                <FileText className="h-4 w-4 mr-2" />
                Show Detailed Plan
              </Button>
              <Button variant="ghost" onClick={() => handleAction('PAUSE_AUTOMATION')}>
                <Clock className="h-4 w-4 mr-2" />
                Pause for Now
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">16</div>
            <div className="text-sm text-gray-600">Tasks Completed</div>
            <div className="text-xs text-gray-500">Today</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">4.2h</div>
            <div className="text-sm text-gray-600">Time Saved</div>
            <div className="text-xs text-gray-500">This week</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">92%</div>
            <div className="text-sm text-gray-600">Accuracy Rate</div>
            <div className="text-xs text-gray-500">AI predictions</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-amber-600">3</div>
            <div className="text-sm text-gray-600">Pending Decisions</div>
            <div className="text-xs text-gray-500">Your input needed</div>
          </CardContent>
        </Card>
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6">
        <Button
          size="lg"
          className="rounded-full h-14 w-14 shadow-lg"
          onClick={() => switchMode('assisted')}
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
};

export default DealStructuringAutonomous;