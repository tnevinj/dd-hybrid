import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Brain,
  Sparkles,
  Shield,
  AlertTriangle,
  CheckCircle,
  FileText,
  Clock,
  Target,
  TrendingUp,
  Zap,
  Eye,
  X
} from 'lucide-react';

interface AIRecommendation {
  id: string;
  type: 'suggestion' | 'automation' | 'warning' | 'insight';
  priority: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  actions: Array<{
    id: string;
    label: string;
    action: string;
    primary?: boolean;
    estimatedTimeSaving?: number;
  }>;
  confidence: number;
  moduleContext: string;
  timestamp: Date;
}

interface LegalManagementAssistedProps {
  documents: any[];
  workflows: any[];
  aiRecommendations: AIRecommendation[];
  metrics: any;
  isLoading: boolean;
  onCreateDocument: () => void;
  onViewDocument: (id: string) => void;
  onManageCompliance: () => void;
  onExecuteAIAction: (actionId: string) => void;
  onDismissRecommendation: (id: string) => void;
}

export const LegalManagementAssisted: React.FC<LegalManagementAssistedProps> = ({
  aiRecommendations = [],
  metrics,
  isLoading,
  onCreateDocument,
  onManageCompliance,
  onExecuteAIAction,
  onDismissRecommendation,
}) => {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mb-4"></div>
        <h3 className="text-xl font-semibold text-gray-700">AI is analyzing legal documents...</h3>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Legal Management</h1>
          <div className="flex items-center space-x-2 mt-2">
            <Badge className="bg-purple-100 text-purple-800 border border-purple-300 flex items-center space-x-1">
              <Brain className="h-3 w-3" />
              <span>AI-Assisted Mode</span>
            </Badge>
            <p className="text-gray-600">Enhanced with artificial intelligence</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button onClick={onCreateDocument} className="flex items-center space-x-2">
            <Sparkles className="h-4 w-4" />
            <span>Smart Document</span>
          </Button>
          <Button onClick={onManageCompliance} variant="outline" className="flex items-center space-x-2">
            <Shield className="h-4 w-4" />
            <span>AI Compliance</span>
          </Button>
        </div>
      </div>

      {/* AI Insights Panel */}
      {aiRecommendations.length > 0 && (
        <Card className="mb-6 border-2 border-purple-200">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Brain className="h-5 w-5 text-purple-600" />
              <CardTitle className="text-purple-900">AI Legal Insights</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {aiRecommendations.map((rec) => (
              <div
                key={rec.id}
                className={`p-4 rounded-lg border ${
                  rec.priority === 'critical' ? 'bg-red-50 border-red-200' : 
                  rec.priority === 'high' ? 'bg-yellow-50 border-yellow-200' : 
                  'bg-blue-50 border-blue-200'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-gray-900">{rec.title}</h4>
                  <div className="flex items-center space-x-2">
                    {rec.actions?.map((action, index) => (
                      <Button
                        key={index}
                        size="sm"
                        variant="outline"
                        onClick={() => onExecuteAIAction(action.action)}
                      >
                        {action.label}
                      </Button>
                    ))}
                    <Button size="sm" variant="ghost" onClick={() => onDismissRecommendation(rec.id)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-gray-700 mb-2">{rec.description}</p>
                <p className="text-xs text-gray-500 italic">
                  Confidence: {(rec.confidence * 100).toFixed(0)}%
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* AI-Enhanced KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2 mb-2">
              <Brain className="h-5 w-5 text-purple-600" />
              <p className="text-sm text-purple-700 font-medium">AI Risk Score</p>
            </div>
            <p className="text-3xl font-bold text-purple-900">92%</p>
            <div className="flex items-center text-purple-600 text-sm mt-1">
              <Shield className="h-4 w-4 mr-1" />
              Low risk detected
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2 mb-2">
              <Target className="h-5 w-5 text-green-600" />
              <p className="text-sm text-green-700 font-medium">Auto-Compliance</p>
            </div>
            <p className="text-3xl font-bold text-green-900">87%</p>
            <div className="flex items-center text-green-600 text-sm mt-1">
              <CheckCircle className="h-4 w-4 mr-1" />
              AI-verified compliance
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2 mb-2">
              <Clock className="h-5 w-5 text-blue-600" />
              <p className="text-sm text-blue-700 font-medium">Review Time</p>
            </div>
            <p className="text-3xl font-bold text-blue-900">2.1d</p>
            <div className="flex items-center text-blue-600 text-sm mt-1">
              <Zap className="h-4 w-4 mr-1" />
              65% faster with AI
            </div>
          </CardContent>
        </Card>

        <Card className="border-orange-200">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2 mb-2">
              <FileText className="h-5 w-5 text-orange-600" />
              <p className="text-sm text-orange-700 font-medium">Auto-Generated</p>
            </div>
            <p className="text-3xl font-bold text-orange-900">156</p>
            <div className="flex items-center text-orange-600 text-sm mt-1">
              <TrendingUp className="h-4 w-4 mr-1" />
              Documents this month
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Smart Document Analysis */}
      <Card className="mb-6 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center text-blue-800">
            <Sparkles className="h-5 w-5 mr-2" />
            Smart Document Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg p-4 border border-blue-200">
              <div className="flex items-center space-x-2 mb-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium">Analysis Complete</span>
              </div>
              <div className="flex items-center space-x-2 mb-2">
                <Progress value={95} className="flex-1" />
                <span className="text-lg font-bold">95%</span>
              </div>
              <p className="text-xs text-gray-600">847 documents processed</p>
            </div>
            
            <div className="bg-white rounded-lg p-4 border border-blue-200">
              <div className="flex items-center space-x-2 mb-2">
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
                <span className="text-sm font-medium">Risk Alerts</span>
              </div>
              <p className="text-lg font-bold text-gray-900">5 flagged</p>
              <p className="text-xs text-gray-600">High-risk clauses detected</p>
            </div>
            
            <div className="bg-white rounded-lg p-4 border border-blue-200">
              <div className="flex items-center space-x-2 mb-2">
                <Brain className="h-4 w-4 text-purple-600" />
                <span className="text-sm font-medium">AI Suggestions</span>
              </div>
              <p className="text-lg font-bold text-gray-900">23 ready</p>
              <p className="text-xs text-gray-600">Optimization opportunities</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Mock Enhanced Documents */}
      <Card>
        <CardHeader>
          <CardTitle>AI-Enhanced Document Review</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map(index => (
              <div key={index} className="p-4 border rounded-lg bg-gradient-to-r from-white to-purple-50">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {index === 1 ? 'TechCorp Service Agreement' : 
                       index === 2 ? 'Fund Formation Documents' : 
                       'ESG Compliance Report'}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {index === 1 ? 'Contract • High Priority' : 
                       index === 2 ? 'Fund Docs • Critical' : 
                       'Compliance • Medium Priority'}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className="bg-purple-100 text-purple-800">AI Score: {90 + index}%</Badge>
                    <Button size="sm" variant="outline">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="text-sm text-green-700 mb-2">
                  ✓ AI verified: Low risk, compliant with regulations
                </div>
                <Progress value={85 + index * 5} className="mb-2" />
                <p className="text-xs text-gray-500">
                  AI analysis complete • Estimated time saved: {2 + index} hours
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI Performance Summary */}
      <Card className="mt-6 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-purple-900 mb-1">AI Assistant Performance</h3>
              <p className="text-purple-700">Today's impact on your legal workflow</p>
            </div>
            <div className="grid grid-cols-3 gap-6 text-center">
              <div>
                <p className="text-3xl font-bold text-green-600">8.7h</p>
                <p className="text-sm text-gray-600">Time Saved</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-purple-600">96%</p>
                <p className="text-sm text-gray-600">Analysis Accuracy</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-blue-600">28</p>
                <p className="text-sm text-gray-600">Auto-Approvals</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LegalManagementAssisted;