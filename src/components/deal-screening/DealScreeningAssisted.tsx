import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Search,
  Filter,
  Plus,
  Lightbulb,
  Zap,
  BarChart3,
  TrendingUp,
  GitCompare,
  Sparkles,
  CheckCircle,
  Clock,
  AlertTriangle,
  X,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { DealOpportunity, AIRecommendation } from '@/types/deal-screening';

// AI Insights Panel Component
const AIInsightsPanel: React.FC<{
  recommendations: AIRecommendation[];
  onExecuteAction: (actionId: string) => void;
  onDismiss: (recommendationId: string) => void;
}> = ({ recommendations, onExecuteAction, onDismiss }) => (
  <Card className="mb-6 border-2 border-blue-200">
    <CardHeader>
      <div className="flex items-center space-x-2">
        <Sparkles className="h-5 w-5 text-blue-600" />
        <CardTitle className="text-blue-900">AI Assistant Insights</CardTitle>
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
          {rec.reasoning && (
            <p className="text-xs text-gray-500 italic">
              Confidence: {(rec.confidence * 100).toFixed(0)}%
            </p>
          )}
        </div>
      ))}
    </CardContent>
  </Card>
);

// Enhanced Opportunity Card with AI Features
const EnhancedOpportunityCard: React.FC<{
  opportunity: DealOpportunity;
  onView: () => void;
  onScreen: () => void;
  aiRecommendations?: AIRecommendation[];
}> = ({ opportunity, onView, onScreen, aiRecommendations = [] }) => {
  const [showInsights, setShowInsights] = useState(false);
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'screening':
      case 'analyzed': return 'bg-yellow-100 text-yellow-800';
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'rejected': return 'bg-red-100 text-red-800';
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
      return `$${value.toFixed(0)}`;
    }
  };

  const hasAIInsights = aiRecommendations.length > 0;
  const aiConfidence = opportunity.aiConfidence || 0;

  return (
    <Card className={`hover:shadow-lg transition-shadow ${hasAIInsights ? 'border-l-4 border-l-blue-500' : ''}`}>
      {hasAIInsights && (
        <div className="absolute top-2 right-2">
          <Badge variant="ai" className="text-xs">
            <Sparkles className="h-3 w-3 mr-1" />
            AI Enhanced
          </Badge>
        </div>
      )}
      
      <CardContent className={`p-4 ${hasAIInsights ? 'pt-8' : ''}`}>
        <div className="flex justify-between items-start mb-3">
          <h3 className={`font-semibold text-gray-900 truncate ${hasAIInsights ? 'max-w-[60%]' : 'max-w-[70%]'}`}>
            {opportunity.name}
          </h3>
          <Badge className={getStatusColor(opportunity.status)}>
            {opportunity.status.charAt(0).toUpperCase() + opportunity.status.slice(1)}
          </Badge>
        </div>
        
        {/* AI Confidence Bar */}
        {hasAIInsights && (
          <div className="mb-3">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-gray-600">AI Analysis Confidence</span>
              <span className="text-xs font-semibold">{(aiConfidence * 100).toFixed(0)}%</span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full">
              <div 
                className={`h-2 rounded-full ${
                  aiConfidence > 0.7 ? 'bg-green-500' : 
                  aiConfidence > 0.4 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${aiConfidence * 100}%` }}
              />
            </div>
          </div>
        )}
        
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {opportunity.description}
        </p>
        
        {/* AI Insights Toggle */}
        {hasAIInsights && (
          <div className="mb-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowInsights(!showInsights)}
              className="w-full justify-between text-blue-600 border-blue-200"
            >
              <div className="flex items-center">
                <Lightbulb className="h-4 w-4 mr-2" />
                AI Insights ({aiRecommendations.length})
              </div>
              {showInsights ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
            
            {showInsights && (
              <div className="mt-2 space-y-2">
                {aiRecommendations.slice(0, 3).map((rec, index) => (
                  <div key={index} className="flex items-start space-x-2 p-2 bg-blue-50 rounded">
                    <div className="mt-0.5">
                      {rec.type === 'suggestion' && <Lightbulb className="h-4 w-4 text-blue-600" />}
                      {rec.type === 'automation' && <Zap className="h-4 w-4 text-green-600" />}
                      {rec.type === 'warning' && <AlertTriangle className="h-4 w-4 text-yellow-600" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{rec.title}</p>
                      <p className="text-xs text-gray-600">{rec.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        
        {/* Similar Deals Indicator */}
        {opportunity.similarDeals && opportunity.similarDeals.length > 0 && (
          <div className="flex items-center mb-3 p-2 bg-green-50 rounded border border-green-200">
            <GitCompare className="h-4 w-4 text-green-600 mr-2" />
            <span className="text-sm text-green-800">
              {opportunity.similarDeals.length} similar deals found in portfolio
            </span>
          </div>
        )}
        
        {/* Financial Metrics */}
        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Expected IRR</span>
            <span className={`font-semibold ${opportunity.expectedIRR > 20 ? 'text-green-600' : 'text-gray-900'}`}>
              {opportunity.expectedIRR}%
            </span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Multiple</span>
            <span className="font-semibold">{opportunity.expectedMultiple.toFixed(1)}x</span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Ask Price</span>
            <span className="font-semibold">{formatCurrency(opportunity.askPrice)}</span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Sector</span>
            <span className="font-semibold">{opportunity.sector}</span>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex justify-end space-x-2">
          <Button size="sm" variant="outline" onClick={onView}>
            View Details
          </Button>
          <Button size="sm" onClick={onScreen} className="flex items-center space-x-1">
            {hasAIInsights && <Sparkles className="h-3 w-3" />}
            <span>{hasAIInsights ? 'AI-Assist Screen' : 'Screen Deal'}</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

// Quick Actions Panel
const QuickActionsPanel: React.FC<{
  onGenerateReport: () => void;
  onCompareDeals: () => void;
  onScheduleReview: () => void;
  onRunAnalysis: () => void;
}> = ({ onGenerateReport, onCompareDeals, onScheduleReview, onRunAnalysis }) => (
  <Card className="mb-6">
    <CardHeader>
      <CardTitle className="flex items-center space-x-2">
        <Zap className="h-5 w-5 text-blue-600" />
        <span>AI-Powered Quick Actions</span>
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Button variant="outline" onClick={onGenerateReport} className="justify-start">
          <BarChart3 className="h-4 w-4 mr-2" />
          Generate Screening Report
        </Button>
        <Button variant="outline" onClick={onCompareDeals} className="justify-start">
          <GitCompare className="h-4 w-4 mr-2" />
          Compare Selected Deals
        </Button>
        <Button variant="outline" onClick={onScheduleReview} className="justify-start">
          <Clock className="h-4 w-4 mr-2" />
          Schedule Review Meeting
        </Button>
        <Button variant="outline" onClick={onRunAnalysis} className="justify-start">
          <TrendingUp className="h-4 w-4 mr-2" />
          Run Market Analysis
        </Button>
      </div>
    </CardContent>
  </Card>
);

interface DealScreeningAssistedProps {
  opportunities: DealOpportunity[];
  aiRecommendations: AIRecommendation[];
  metrics: any;
  isLoading: boolean;
  onCreateOpportunity: () => void;
  onViewOpportunity: (id: string) => void;
  onScreenOpportunity: (id: string) => void;
  onExecuteAIAction: (actionId: string) => void;
  onDismissRecommendation: (id: string) => void;
}

export const DealScreeningAssisted: React.FC<DealScreeningAssistedProps> = ({
  opportunities = [],
  aiRecommendations = [],
  metrics = {},
  isLoading = false,
  onCreateOpportunity,
  onViewOpportunity,
  onScreenOpportunity,
  onExecuteAIAction,
  onDismissRecommendation,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredOpportunities, setFilteredOpportunities] = useState(opportunities);

  // Apply filtering
  useEffect(() => {
    let result = [...opportunities];
    
    if (searchTerm) {
      result = result.filter(opportunity => 
        opportunity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        opportunity.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredOpportunities(result);
  }, [opportunities, searchTerm]);

  const handleQuickAction = (action: string) => {
    console.log(`Executing quick action: ${action}`);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <h3 className="text-xl font-semibold text-gray-700">AI is analyzing deal opportunities...</h3>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Header with Mode Indicator */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Deal Screening Dashboard</h1>
          <div className="flex items-center space-x-2 mt-2">
            <Badge variant="ai" className="flex items-center space-x-1">
              <Sparkles className="h-3 w-3" />
              <span>AI-Assisted Mode</span>
            </Badge>
            <p className="text-gray-600">Enhanced with artificial intelligence</p>
          </div>
        </div>
        <Button onClick={onCreateOpportunity} className="flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>New Opportunity</span>
        </Button>
      </div>
      
      {/* AI Insights Panel */}
      {aiRecommendations.length > 0 && (
        <AIInsightsPanel
          recommendations={aiRecommendations}
          onExecuteAction={onExecuteAIAction}
          onDismiss={onDismissRecommendation}
        />
      )}
      
      {/* Quick Actions Panel */}
      <QuickActionsPanel
        onGenerateReport={() => handleQuickAction('generate-report')}
        onCompareDeals={() => handleQuickAction('compare-deals')}
        onScheduleReview={() => handleQuickAction('schedule-review')}
        onRunAnalysis={() => handleQuickAction('run-analysis')}
      />
      
      {/* Search and Filter */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl">
              Active Opportunities ({filteredOpportunities.length})
            </CardTitle>
            
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search opportunities..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Smart Filter
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          {/* AI Processing Status */}
          <div className="flex items-center space-x-4 mb-4 p-3 bg-green-50 rounded-lg border border-green-200">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <span className="text-green-800 font-medium">
              AI analysis complete for {opportunities.length} opportunities
            </span>
            <div className="flex items-center space-x-1 ml-auto">
              <Zap className="h-4 w-4 text-blue-600" />
              <span className="text-sm text-blue-600">Estimated time saved: 4.2 hours</span>
            </div>
          </div>
          
          {/* Opportunities Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredOpportunities.map(opportunity => (
              <EnhancedOpportunityCard
                key={opportunity.id}
                opportunity={opportunity}
                onView={() => onViewOpportunity(opportunity.id)}
                onScreen={() => onScreenOpportunity(opportunity.id)}
                aiRecommendations={opportunity.aiRecommendations}
              />
            ))}
          </div>
          
          {filteredOpportunities.length === 0 && (
            <div className="text-center py-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No opportunities match your search</h3>
              <p className="text-gray-600">Try adjusting your search terms or filters</p>
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
              <p className="text-blue-700">Today's impact on your deal screening workflow</p>
            </div>
            <div className="grid grid-cols-3 gap-6 text-center">
              <div>
                <p className="text-3xl font-bold text-green-600">4.2h</p>
                <p className="text-sm text-gray-600">Time Saved</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-blue-600">87%</p>
                <p className="text-sm text-gray-600">Accuracy</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-blue-600">12</p>
                <p className="text-sm text-gray-600">Tasks Automated</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DealScreeningAssisted;