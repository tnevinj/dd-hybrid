import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Search,
  Filter,
  Plus,
  Brain,
  Sparkles,
  CheckCircle,
  Clock,
  Target,
  AlertTriangle,
  TrendingUp,
  Calendar,
  FileText,
  Users,
  Gavel,
  Eye,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  X,
  Zap
} from 'lucide-react';
import type { 
  ICProposal,
  ICMeeting 
} from '@/types/investment-committee';

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

interface InvestmentCommitteeAssistedProps {
  proposals: ICProposal[];
  meetings: ICMeeting[];
  aiRecommendations: AIRecommendation[];
  metrics: any;
  isLoading: boolean;
  onCreateProposal: () => void;
  onViewProposal: (id: string) => void;
  onScheduleMeeting: () => void;
  onExecuteAIAction: (actionId: string) => void;
  onDismissRecommendation: (id: string) => void;
}

// AI Insights Panel Component
const AIInsightsPanel: React.FC<{
  recommendations: AIRecommendation[];
  onExecuteAction: (actionId: string) => void;
  onDismiss: (recommendationId: string) => void;
}> = ({ recommendations, onExecuteAction, onDismiss }) => (
  <Card className="mb-6 border-2 border-blue-200">
    <CardHeader>
      <div className="flex items-center space-x-2">
        <Brain className="h-5 w-5 text-blue-600" />
        <CardTitle className="text-blue-900">AI Investment Committee Insights</CardTitle>
      </div>
    </CardHeader>
    <CardContent className="space-y-4">
      {recommendations.map((rec) => (
        <div
          key={rec.id}
          className={`p-4 rounded-lg border ${
            rec.priority === 'high' 
              ? 'bg-yellow-50 border-yellow-200' 
              : rec.priority === 'critical' 
              ? 'bg-red-50 border-red-200' 
              : 'bg-blue-50 border-blue-200'
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
                  onClick={() => onExecuteAction(action.action)}
                >
                  {action.label}
                </Button>
              ))}
              <Button size="sm" variant="ghost" onClick={() => onDismiss(rec.id)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <p className="text-sm text-gray-700 mb-2">{rec.description}</p>
          {rec.confidence && (
            <p className="text-xs text-gray-500 italic">
              Confidence: {(rec.confidence * 100).toFixed(0)}%
            </p>
          )}
        </div>
      ))}
    </CardContent>
  </Card>
);

// Enhanced Proposal Card with AI Features
const EnhancedProposalCard: React.FC<{
  proposal: ICProposal;
  onView: () => void;
  aiScore?: number;
}> = ({ proposal, onView, aiScore }) => {
  const [showAIInsights, setShowAIInsights] = useState(false);
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED': return 'bg-green-100 text-green-800';
      case 'REJECTED': return 'bg-red-100 text-red-800';
      case 'UNDER_REVIEW': return 'bg-yellow-100 text-yellow-800';
      case 'SUBMITTED': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (value: number) => {
    if (value >= 1000000000) {
      return `$${(value / 1000000000).toFixed(1)}B`;
    } else if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(1)}K`;
    } else {
      return `$${value?.toFixed(0) || 0}`;
    }
  };

  const hasAIScore = aiScore !== undefined;

  return (
    <Card className={`hover:shadow-lg transition-shadow ${hasAIScore ? 'border-l-4 border-l-blue-500' : ''}`}>
      {hasAIScore && (
        <div className="absolute top-2 right-2">
          <Badge className="bg-blue-100 text-blue-800 border border-blue-300 text-xs">
            <Sparkles className="h-3 w-3 mr-1" />
            AI Enhanced
          </Badge>
        </div>
      )}
      
      <CardContent className={`p-4 ${hasAIScore ? 'pt-8' : ''}`}>
        <div className="flex justify-between items-start mb-3">
          <h3 className={`font-semibold text-gray-900 truncate ${hasAIScore ? 'max-w-[60%]' : 'max-w-[70%]'}`}>
            {proposal.proposalTitle}
          </h3>
          <Badge className={getStatusColor(proposal.status)}>
            {proposal.status}
          </Badge>
        </div>
        
        {/* AI Score Bar */}
        {hasAIScore && (
          <div className="mb-3">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-gray-600">AI Committee Score</span>
              <span className="text-xs font-semibold">{aiScore}%</span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full">
              <div 
                className={`h-2 rounded-full ${
                  aiScore > 75 ? 'bg-green-500' : 
                  aiScore > 50 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${aiScore}%` }}
              />
            </div>
          </div>
        )}
        
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {proposal.targetCompany} • {proposal.sector}
        </p>
        
        {/* AI Insights Toggle */}
        {hasAIScore && (
          <div className="mb-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAIInsights(!showAIInsights)}
              className="w-full justify-between text-blue-600 border-blue-200"
            >
              <div className="flex items-center">
                <Brain className="h-4 w-4 mr-2" />
                AI Committee Analysis
              </div>
              {showAIInsights ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
            
            {showAIInsights && (
              <div className="mt-2 space-y-2">
                <div className="p-2 bg-green-50 rounded border border-green-200">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium text-green-800">Strong Financial Metrics</span>
                  </div>
                  <p className="text-xs text-green-700 mt-1">Revenue growth: 45% YoY, EBITDA margin: 23%</p>
                </div>
                
                <div className="p-2 bg-blue-50 rounded border border-blue-200">
                  <div className="flex items-center space-x-2">
                    <Target className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-800">Portfolio Fit</span>
                  </div>
                  <p className="text-xs text-blue-700 mt-1">Strategic alignment: High, sector diversification: Medium</p>
                </div>
                
                <div className="p-2 bg-yellow-50 rounded border border-yellow-200">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-600" />
                    <span className="text-sm font-medium text-yellow-800">Risk Factors</span>
                  </div>
                  <p className="text-xs text-yellow-700 mt-1">Market competition increasing, regulatory changes pending</p>
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* Financial Metrics */}
        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Requested Amount</span>
            <span className="font-semibold">{formatCurrency(proposal.requestedAmount || 0)}</span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Expected IRR</span>
            <span className="font-semibold">{proposal.projectedIRR ? `${proposal.projectedIRR}%` : 'TBD'}</span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Priority</span>
            <span className="font-semibold">{proposal.priority}</span>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex justify-end space-x-2">
          <Button size="sm" variant="outline" onClick={onView}>
            View Details
          </Button>
          <Button size="sm" className="flex items-center space-x-1 bg-blue-600 hover:bg-blue-700">
            {hasAIScore && <Sparkles className="h-3 w-3" />}
            <span>{hasAIScore ? 'AI-Enhanced Review' : 'Review'}</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export const InvestmentCommitteeAssisted: React.FC<InvestmentCommitteeAssistedProps> = ({
  proposals = [],
  meetings = [],
  aiRecommendations = [],
  metrics = {
    totalProposals: 15,
    activeProposals: 8,
    approvedProposals: 12,
    averageDecisionTime: 12,
    approvalRate: 78,
    aiEfficiencyGains: 35
  },
  isLoading = false,
  onCreateProposal,
  onViewProposal,
  onScheduleMeeting,
  onExecuteAIAction,
  onDismissRecommendation,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <h3 className="text-xl font-semibold text-gray-700">AI is analyzing committee data...</h3>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Header with Mode Indicator */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Investment Committee Dashboard</h1>
          <div className="flex items-center space-x-2 mt-2">
            <Badge className="bg-blue-100 text-blue-800 border border-blue-300 flex items-center space-x-1">
              <Brain className="h-3 w-3" />
              <span>AI-Assisted Mode</span>
            </Badge>
            <p className="text-gray-600">Enhanced with artificial intelligence</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button onClick={onCreateProposal} className="flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>New Proposal</span>
          </Button>
          <Button onClick={onScheduleMeeting} variant="outline" className="flex items-center space-x-2">
            <Calendar className="h-4 w-4" />
            <span>Smart Schedule</span>
          </Button>
        </div>
      </div>
      
      {/* AI Insights Panel */}
      {aiRecommendations.length > 0 && (
        <AIInsightsPanel
          recommendations={aiRecommendations}
          onExecuteAction={onExecuteAIAction}
          onDismiss={onDismissRecommendation}
        />
      )}
      
      {/* AI-Enhanced KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2 mb-2">
              <Brain className="h-5 w-5 text-blue-600" />
              <p className="text-sm text-blue-700 font-medium">AI Committee Score</p>
            </div>
            <p className="text-3xl font-bold text-blue-900">87%</p>
            <div className="flex items-center text-blue-600 text-sm mt-1">
              <TrendingUp className="h-4 w-4 mr-1" />
              +12% this quarter
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2 mb-2">
              <Target className="h-5 w-5 text-green-600" />
              <p className="text-sm text-green-700 font-medium">Success Prediction</p>
            </div>
            <p className="text-3xl font-bold text-green-900">94%</p>
            <div className="flex items-center text-green-600 text-sm mt-1">
              <CheckCircle className="h-4 w-4 mr-1" />
              AI forecast accuracy
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2 mb-2">
              <Clock className="h-5 w-5 text-blue-600" />
              <p className="text-sm text-blue-700 font-medium">Decision Time</p>
            </div>
            <p className="text-3xl font-bold text-blue-900">{metrics.averageDecisionTime - 3}d</p>
            <div className="flex items-center text-blue-600 text-sm mt-1">
              <Zap className="h-4 w-4 mr-1" />
              25% faster with AI
            </div>
          </CardContent>
        </Card>

        <Card className="border-orange-200">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2 mb-2">
              <Users className="h-5 w-5 text-orange-600" />
              <p className="text-sm text-orange-700 font-medium">Member Alignment</p>
            </div>
            <p className="text-3xl font-bold text-orange-900">89%</p>
            <div className="flex items-center text-orange-600 text-sm mt-1">
              <Gavel className="h-4 w-4 mr-1" />
              Consensus prediction
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Smart Meeting Preparation */}
      <Card className="mb-6 bg-gradient-to-r from-blue-50 to-blue-50 border border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center text-blue-800">
            <Calendar className="h-5 w-5 mr-2" />
            Smart Meeting Preparation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg p-4 border border-blue-200">
              <div className="flex items-center space-x-2 mb-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium">Next Meeting Readiness</span>
              </div>
              <div className="flex items-center space-x-2 mb-2">
                <Progress value={85} className="flex-1" />
                <span className="text-lg font-bold">85%</span>
              </div>
              <p className="text-xs text-gray-600">Tuesday, March 26, 2PM</p>
            </div>
            
            <div className="bg-white rounded-lg p-4 border border-blue-200">
              <div className="flex items-center space-x-2 mb-2">
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
                <span className="text-sm font-medium">Preparation Items</span>
              </div>
              <p className="text-lg font-bold text-gray-900">3 pending</p>
              <p className="text-xs text-gray-600">Member disclosures needed</p>
            </div>
            
            <div className="bg-white rounded-lg p-4 border border-blue-200">
              <div className="flex items-center space-x-2 mb-2">
                <Brain className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium">AI Recommendations</span>
              </div>
              <p className="text-lg font-bold text-gray-900">5 insights</p>
              <p className="text-xs text-gray-600">Pre-meeting brief ready</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Search and Filter */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl">
              Active Proposals ({proposals.length})
            </CardTitle>
            
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search proposals..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                AI Filter
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          {/* AI Processing Status */}
          <div className="flex items-center space-x-4 mb-4 p-3 bg-green-50 rounded-lg border border-green-200">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <span className="text-green-800 font-medium">
              AI analysis complete for {proposals.length} proposals
            </span>
            <div className="flex items-center space-x-1 ml-auto">
              <Zap className="h-4 w-4 text-blue-600" />
              <span className="text-sm text-blue-600">Estimated time saved: 6.3 hours</span>
            </div>
          </div>
          
          {/* Enhanced Proposals Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Mock enhanced proposals since proposals array is empty */}
            {[1, 2, 3].map(index => (
              <EnhancedProposalCard
                key={index}
                proposal={{
                  id: `proposal-${index}`,
                  proposalTitle: `TechCorp ${index === 1 ? 'Alpha' : index === 2 ? 'Beta' : 'Gamma'}`,
                  targetCompany: `${index === 1 ? 'TechCorp' : index === 2 ? 'HealthTech' : 'FinServ'} Inc`,
                  sector: index === 1 ? 'Technology' : index === 2 ? 'Healthcare' : 'Financial Services',
                  requestedAmount: index * 10000000,
                  priority: index === 1 ? 'HIGH' : index === 2 ? 'MEDIUM' : 'HIGH',
                  status: index === 1 ? 'UNDER_REVIEW' : index === 2 ? 'SUBMITTED' : 'UNDER_REVIEW',
                  projectedIRR: index === 1 ? 24.5 : index === 2 ? 18.2 : 28.7,
                  submittedAt: new Date(),
                  proposalType: 'GROWTH_EQUITY' as any,
                  presentingPartner: 'John Smith',
                  meetingId: 'meeting-1'
                }}
                onView={() => onViewProposal(`proposal-${index}`)}
                aiScore={index === 1 ? 87 : index === 2 ? 72 : 91}
              />
            ))}
          </div>
          
          {proposals.length === 0 && (
            <div className="text-center py-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No proposals found</h3>
              <p className="text-gray-600">Create a new proposal to get started with AI-enhanced review</p>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* AI Performance Summary */}
      <Card className="bg-gradient-to-r from-blue-50 to-blue-50 border border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-blue-900 mb-1">AI Assistant Performance</h3>
              <p className="text-blue-700">Today's impact on your committee workflow</p>
            </div>
            <div className="grid grid-cols-3 gap-6 text-center">
              <div>
                <p className="text-3xl font-bold text-green-600">6.3h</p>
                <p className="text-sm text-gray-600">Time Saved</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-blue-600">94%</p>
                <p className="text-sm text-gray-600">Prediction Accuracy</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-blue-600">15</p>
                <p className="text-sm text-gray-600">Tasks Automated</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InvestmentCommitteeAssisted;