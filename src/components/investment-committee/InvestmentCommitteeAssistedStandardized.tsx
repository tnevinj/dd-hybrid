import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Plus,
  Calendar,
  FileText,
  Users,
  CheckCircle,
  XCircle,
  Clock,
  Target,
  Eye,
  Edit,
  Brain,
  Sparkles,
  Zap,
  MessageSquare
} from 'lucide-react';

// Import standardized components
import { StandardizedKPICard, AIScoreKPICard, EfficiencyKPICard, PerformanceKPICard } from '@/components/shared/StandardizedKPICard';
import { StandardizedAIPanel, QuickAIInsights, AIProcessingStatus } from '@/components/shared/StandardizedAIPanel';
import { StandardizedSearchFilter } from '@/components/shared/StandardizedSearchFilter';
import { StandardizedLoading, NoResultsEmpty, NoDataEmpty } from '@/components/shared/StandardizedStates';

// Import design system utilities
import { 
  getStatusColor, 
  getPriorityColor, 
  formatCurrency, 
  COMPONENTS, 
  TYPOGRAPHY,
  AI_ELEMENTS,
  getAIScoreColor
} from '@/lib/design-system';

// Import consistent mock data
import { generateModuleData } from '@/lib/mock-data-generator';

import type { 
  ICProposal,
  ICMeeting 
} from '@/types/investment-committee';

interface InvestmentCommitteeAssistedProps {
  proposals?: ICProposal[];
  meetings?: ICMeeting[];
  metrics?: any;
  aiRecommendations?: any[];
  isLoading?: boolean;
  onCreateProposal?: () => void;
  onViewProposal?: (id: string) => void;
  onScheduleMeeting?: () => void;
  onExecuteAIAction?: (actionId: string) => void;
  onDismissRecommendation?: (id: string) => void;
}

export const InvestmentCommitteeAssistedStandardized: React.FC<InvestmentCommitteeAssistedProps> = ({
  proposals: propProposals,
  meetings: propMeetings,
  metrics: propMetrics,
  aiRecommendations: propRecommendations,
  isLoading = false,
  onCreateProposal = () => {},
  onViewProposal = () => {},
  onScheduleMeeting = () => {},
  onExecuteAIAction = () => {},
  onDismissRecommendation = () => {},
}) => {
  // Use consistent mock data if no props provided
  const moduleData = generateModuleData('investment_committee');
  const proposals = propProposals || moduleData.proposals;
  const metrics = propMetrics || moduleData.metrics;
  const aiRecommendations = propRecommendations || moduleData.recommendations;
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    type: ''
  });
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Filter configurations using design system
  const filterConfigs = [
    {
      key: 'status',
      label: 'Status',
      type: 'select' as const,
      placeholder: 'All Statuses',
      options: [
        { value: 'SUBMITTED', label: 'Submitted' },
        { value: 'UNDER_REVIEW', label: 'Under Review' },
        { value: 'APPROVED', label: 'Approved' },
        { value: 'REJECTED', label: 'Rejected' },
        { value: 'DEFERRED', label: 'Deferred' }
      ]
    },
    {
      key: 'priority',
      label: 'Priority',
      type: 'select' as const,
      placeholder: 'All Priorities',
      options: [
        { value: 'LOW', label: 'Low' },
        { value: 'MEDIUM', label: 'Medium' },
        { value: 'HIGH', label: 'High' },
        { value: 'CRITICAL', label: 'Critical' }
      ]
    }
  ];

  const sortOptions = [
    { key: 'title', label: 'Title' },
    { key: 'status', label: 'Status' },
    { key: 'amount', label: 'Amount' },
    { key: 'date', label: 'Date' },
    { key: 'ai_score', label: 'AI Score' }
  ];

  // AI search suggestions
  const aiSuggestions = [
    'High IRR opportunities',
    'Technology sector deals',
    'Ready for committee review',
    'Similar to successful exits'
  ];

  // Apply filtering and sorting using standardized approach
  const filteredProposals = useMemo(() => {
    let result = [...proposals];
    
    // Apply search filter
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      result = result.filter(proposal => 
        proposal.proposalTitle?.toLowerCase().includes(lowerSearchTerm) ||
        proposal.targetCompany?.toLowerCase().includes(lowerSearchTerm) ||
        proposal.sector?.toLowerCase().includes(lowerSearchTerm)
      );
    }
    
    // Apply filters
    if (filters.status) {
      result = result.filter(proposal => proposal.status === filters.status);
    }
    if (filters.priority) {
      result = result.filter(proposal => proposal.priority === filters.priority);
    }

    // Apply sorting with AI-enhanced options
    result.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortBy) {
        case 'title':
          aValue = a.proposalTitle || '';
          bValue = b.proposalTitle || '';
          break;
        case 'amount':
          aValue = a.requestedAmount || 0;
          bValue = b.requestedAmount || 0;
          break;
        case 'date':
          aValue = a.submittedAt ? new Date(a.submittedAt).getTime() : 0;
          bValue = b.submittedAt ? new Date(b.submittedAt).getTime() : 0;
          break;
        case 'ai_score':
          aValue = a.aiScore || 0;
          bValue = b.aiScore || 0;
          break;
        default:
          aValue = a.status || '';
          bValue = b.status || '';
      }
      
      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });
    
    return result;
  }, [proposals, searchTerm, filters, sortBy, sortOrder]);

  if (isLoading) {
    return (
      <StandardizedLoading
        mode="assisted"
        message="AI is analyzing committee data..."
        submessage="Processing proposals and generating insights"
        showProgress={true}
        progress={78}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Header - Using design system typography */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <div className="flex items-center space-x-3">
            <h1 className={TYPOGRAPHY.headings.h1}>Investment Committee Dashboard</h1>
            <Badge className="bg-blue-100 text-blue-800 border border-blue-300 flex items-center space-x-1">
              <Brain className="h-3 w-3" />
              <span>AI-Assisted Mode</span>
            </Badge>
          </div>
          <p className={`${TYPOGRAPHY.body.base} text-blue-700 mt-1`}>
            Enhanced with artificial intelligence for smarter decision-making
          </p>
        </div>
        <div className="flex space-x-2">
          <Button onClick={onCreateProposal} className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700">
            <Sparkles className="h-4 w-4" />
            <span>Smart Proposal</span>
          </Button>
          <Button onClick={onScheduleMeeting} variant="outline" className="flex items-center space-x-2 border-blue-300 text-blue-700">
            <Calendar className="h-4 w-4" />
            <span>AI Schedule</span>
          </Button>
        </div>
      </div>

      {/* AI Insights Panel */}
      {aiRecommendations && aiRecommendations.length > 0 && (
        <StandardizedAIPanel
          recommendations={aiRecommendations}
          metrics={{
            timeSaved: metrics.timeSaved || 6.3,
            accuracy: metrics.aiAccuracy || 94,
            tasksAutomated: 15,
            efficiency: metrics.efficiency || 35
          }}
          title="AI Investment Committee Insights"
          moduleContext="Investment Committee"
          onExecuteAction={onExecuteAIAction}
          onDismissRecommendation={onDismissRecommendation}
          className="mb-6"
        />
      )}
      
      {/* AI-Enhanced KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <AIScoreKPICard
          title="AI Committee Score"
          score={87}
          confidence={94}
          insight="12% improvement this quarter"
          className="border-blue-200"
        />

        <StandardizedKPICard
          title="Success Prediction"
          value={94}
          valueType="percentage"
          mode="assisted"
          icon={Target}
          status="positive"
          trend="up"
          trendValue="+8%"
          trendLabel="AI forecast accuracy"
          isAIEnhanced={true}
        />

        <StandardizedKPICard
          title="Decision Time"
          value={metrics.averageDecisionTime ? metrics.averageDecisionTime - 3 : 9}
          valueType="duration"
          mode="assisted"
          icon={Zap}
          status="positive"
          trend="up"
          trendValue="25% faster"
          trendLabel="with AI"
          isAIEnhanced={true}
        />

        <StandardizedKPICard
          title="Member Alignment"
          value={89}
          valueType="percentage"
          mode="assisted"
          icon={Users}
          status="positive"
          subtitle="Consensus prediction"
          isAIEnhanced={true}
        />

        <EfficiencyKPICard
          title="AI Efficiency Gains"
          value={35}
          mode="assisted"
          timeSaved="6.3h saved today"
          className="border-blue-200"
        />
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
            <AIProcessingStatus
              status="complete"
              className="border-none shadow-none"
            />
            
            <div className="bg-white rounded-lg p-4 border border-blue-200">
              <div className="flex items-center space-x-2 mb-2">
                <Target className="h-4 w-4 text-yellow-600" />
                <span className="text-sm font-medium">Preparation Items</span>
              </div>
              <p className="text-lg font-bold text-gray-900">3 pending</p>
              <p className="text-xs text-gray-600">AI will auto-complete 2 items</p>
            </div>
            
            <QuickAIInsights
              insights={[
                "Next meeting readiness: 85%",
                "5 AI recommendations ready",
                "Pre-meeting brief generated"
              ]}
              className="border-blue-200"
            />
          </div>
        </CardContent>
      </Card>

      {/* AI-Enhanced Search and Filter */}
      <StandardizedSearchFilter
        mode="assisted"
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search proposals with AI assistance..."
        filters={filters}
        onFiltersChange={setFilters}
        filterConfigs={filterConfigs}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSortChange={(field, order) => {
          setSortBy(field);
          setSortOrder(order);
        }}
        sortOptions={sortOptions}
        aiSuggestions={aiSuggestions}
        smartFilterEnabled={true}
        onSmartFilter={() => console.log('Smart filter activated')}
        totalResults={proposals.length}
        filteredResults={filteredProposals.length}
        className="mb-6"
      />

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* AI-Enhanced Proposals List */}
        <div className="lg:col-span-3">
          <Card className={COMPONENTS.card.assisted.base}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl text-blue-900">AI-Enhanced Proposal Review</CardTitle>
                  <p className="text-sm text-blue-700 mt-1">Proposals ranked by AI analysis and committee fit</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className="bg-green-100 text-green-800 border-green-300">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    AI analysis complete
                  </Badge>
                  <Button onClick={onCreateProposal} className="bg-blue-600 hover:bg-blue-700">
                    <Sparkles className="h-4 w-4 mr-2" />
                    AI-Enhanced Vote
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {filteredProposals.length === 0 ? (
                searchTerm || Object.values(filters).some(f => f) ? (
                  <NoResultsEmpty
                    mode="assisted"
                    searchTerm={searchTerm}
                    onClearFilters={() => {
                      setSearchTerm('');
                      setFilters({ status: '', priority: '', type: '' });
                    }}
                  />
                ) : (
                  <NoDataEmpty
                    mode="assisted"
                    dataType="proposals"
                    onCreateNew={onCreateProposal}
                  />
                )
              ) : (
                <div className="space-y-4">
                  {/* AI Processing Status */}
                  <div className="flex items-center space-x-4 mb-4 p-3 bg-green-50 rounded-lg border border-green-200">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="text-green-800 font-medium">
                      AI analysis complete for {filteredProposals.length} proposals
                    </span>
                    <div className="flex items-center space-x-1 ml-auto">
                      <Zap className="h-4 w-4 text-blue-600" />
                      <span className="text-sm text-blue-600">Estimated time saved: 6.3 hours</span>
                    </div>
                  </div>

                  {filteredProposals.map((proposal) => (
                    <div key={proposal.id} className={`border rounded-lg p-6 transition-shadow ${COMPONENTS.card.assisted.accent} ${COMPONENTS.card.assisted.hover}`}>
                      {/* AI Enhancement Indicator */}
                      <div className="absolute top-2 right-2">
                        <Badge className="bg-blue-100 text-blue-800 border border-blue-300 text-xs">
                          <Sparkles className="h-3 w-3 mr-1" />
                          AI Enhanced
                        </Badge>
                      </div>

                      <div className="flex items-start justify-between mb-4 pt-6">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-lg text-gray-900">{proposal.proposalTitle}</h3>
                            <Badge className={`${getStatusColor(proposal.status)} border`}>
                              {proposal.status.replace('_', ' ')}
                            </Badge>
                            <Badge className={`${getPriorityColor(proposal.priority)} border`} variant="outline">
                              {proposal.priority}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                            <span><strong>Target:</strong> {proposal.targetCompany}</span>
                            <span><strong>Sector:</strong> {proposal.sector}</span>
                            <span><strong>Presenter:</strong> {proposal.presentingPartner}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-blue-600">{formatCurrency(proposal.requestedAmount || 0)}</p>
                          <p className="text-sm text-gray-500">{proposal.meetingDate?.toLocaleDateString?.() || 'TBD'}</p>
                        </div>
                      </div>

                      {/* AI Score Bar */}
                      {proposal.aiScore && (
                        <div className="mb-4">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm text-blue-600 font-medium">AI Committee Score</span>
                            <span className="text-sm font-semibold text-blue-800">{proposal.aiScore}%</span>
                          </div>
                          <div className="w-full h-3 bg-gray-200 rounded-full">
                            <div 
                              className={`h-3 rounded-full ${getAIScoreColor(proposal.aiScore)}`}
                              style={{ width: `${proposal.aiScore}%` }}
                            />
                          </div>
                        </div>
                      )}

                      {/* AI Insights */}
                      {proposal.aiInsights && (
                        <div className="mb-4 space-y-2">
                          {proposal.aiInsights.slice(0, 2).map((insight, index) => (
                            <div key={index} className="p-2 bg-blue-50 border border-blue-200 rounded">
                              <div className="flex items-center space-x-2">
                                <Brain className="h-4 w-4 text-blue-600" />
                                <span className="text-sm text-blue-800">{insight}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Key Metrics using consistent formatting */}
                      {proposal.keyMetrics && (
                        <div className="grid grid-cols-3 gap-4 p-4 bg-gradient-to-r from-blue-50 to-blue-50 rounded-lg mb-4 border border-blue-200">
                          <div className="text-center">
                            <p className="text-sm text-blue-600 mb-1">AI-Verified IRR</p>
                            <p className="text-lg font-semibold text-green-600">{proposal.keyMetrics.irr?.toFixed(1)}%</p>
                          </div>
                          <div className="text-center">
                            <p className="text-sm text-blue-600 mb-1">Multiple</p>
                            <p className="text-lg font-semibold text-blue-600">{proposal.keyMetrics.multiple?.toFixed(1)}x</p>
                          </div>
                          <div className="text-center">
                            <p className="text-sm text-blue-600 mb-1">Payback</p>
                            <p className="text-lg font-semibold text-orange-600">{proposal.keyMetrics.paybackPeriod?.toFixed(1)}y</p>
                          </div>
                        </div>
                      )}

                      {/* Enhanced Voting Interface */}
                      {proposal.committeeVotes && (
                        <div className="border-t pt-4">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-medium text-gray-900">AI-Predicted Voting Outcome</h4>
                            <div className="flex items-center space-x-2">
                              <Badge className="bg-blue-100 text-blue-800 border-blue-300">
                                <Target className="h-3 w-3 mr-1" />
                                {proposal.aiConfidence}% confidence
                              </Badge>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-3 gap-4 mb-4">
                            <div className="text-center p-3 bg-green-50 border border-green-200 rounded">
                              <p className="text-2xl font-bold text-green-900">{proposal.committeeVotes.for}</p>
                              <p className="text-sm text-green-700">For</p>
                            </div>
                            <div className="text-center p-3 bg-red-50 border border-red-200 rounded">
                              <p className="text-2xl font-bold text-red-900">{proposal.committeeVotes.against}</p>
                              <p className="text-sm text-red-700">Against</p>
                            </div>
                            <div className="text-center p-3 bg-gray-50 border border-gray-200 rounded">
                              <p className="text-2xl font-bold text-gray-900">{proposal.committeeVotes.abstain}</p>
                              <p className="text-sm text-gray-700">Abstain</p>
                            </div>
                          </div>

                          {/* AI-Enhanced Action Buttons */}
                          <div className="flex items-center justify-between">
                            <div className="flex space-x-2">
                              <Button size="sm" variant="outline" onClick={() => onViewProposal(proposal.id)} className="border-blue-300 text-blue-700">
                                <Eye className="h-4 w-4 mr-1" />
                                AI Analysis
                              </Button>
                              <Button size="sm" variant="outline" className="border-blue-300 text-blue-700">
                                <FileText className="h-4 w-4 mr-1" />
                                Smart Docs
                              </Button>
                              <Button size="sm" variant="outline" className="border-blue-300 text-blue-700">
                                <Brain className="h-4 w-4 mr-1" />
                                AI Insights
                              </Button>
                            </div>
                            
                            {proposal.status === 'UNDER_REVIEW' && (
                              <div className="flex space-x-2">
                                <Button size="sm" className="bg-green-600 hover:bg-green-700">
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                  AI Recommends
                                </Button>
                                <Button size="sm" variant="outline" className="border-red-300 text-red-600 hover:bg-red-50">
                                  <XCircle className="h-4 w-4 mr-1" />
                                  Override AI
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* AI-Enhanced Sidebar */}
        <div className="space-y-6">
          {/* Committee Overview Card */}
          <Card className={COMPONENTS.card.assisted.base}>
            <CardHeader>
              <CardTitle className="text-lg text-blue-900">AI Committee Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <AIScoreKPICard
                  title="Member Alignment"
                  score={89}
                  confidence={94}
                  insight="AI predicts 94% attendance"
                  className="border-none shadow-none bg-blue-50"
                />
                
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-center p-2 bg-green-50 rounded border border-green-200">
                    <p className="text-lg font-bold text-green-900">96%</p>
                    <p className="text-xs text-green-700">AI Accuracy</p>
                  </div>
                  <div className="text-center p-2 bg-blue-50 rounded border border-blue-200">
                    <p className="text-lg font-bold text-blue-900">85m</p>
                    <p className="text-xs text-blue-700">AI Optimized</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AI Performance Summary */}
          <Card className={`${COMPONENTS.card.assisted.base} bg-gradient-to-r from-blue-50 to-blue-50`}>
            <CardHeader>
              <CardTitle className="text-lg text-blue-900">AI Assistant Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center">
                  <p className="text-3xl font-bold text-green-600">6.3h</p>
                  <p className="text-sm text-gray-600">Time Saved Today</p>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center p-2 bg-white/70 rounded border">
                    <p className="text-lg font-bold text-blue-600">94%</p>
                    <p className="text-xs text-gray-600">Prediction Accuracy</p>
                  </div>
                  <div className="text-center p-2 bg-white/70 rounded border">
                    <p className="text-lg font-bold text-blue-600">15</p>
                    <p className="text-xs text-gray-600">Tasks Automated</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default InvestmentCommitteeAssistedStandardized;