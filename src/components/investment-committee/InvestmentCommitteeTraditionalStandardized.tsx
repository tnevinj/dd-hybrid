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
  User,
  Gavel,
  MessageSquare
} from 'lucide-react';

// Import standardized components
import { StandardizedKPICard, EfficiencyKPICard, PerformanceKPICard } from '@/components/shared/StandardizedKPICard';
import { StandardizedSearchFilter } from '@/components/shared/StandardizedSearchFilter';
import { StandardizedLoading, NoResultsEmpty, NoDataEmpty } from '@/components/shared/StandardizedStates';

// Import design system utilities
import { 
  getStatusColor, 
  getPriorityColor, 
  formatCurrency, 
  COMPONENTS, 
  TYPOGRAPHY 
} from '@/lib/design-system';

// Import consistent mock data
import { generateModuleData } from '@/lib/mock-data-generator';

import type { 
  ICProposal,
  ICMeeting 
} from '@/types/investment-committee';

interface InvestmentCommitteeTraditionalProps {
  proposals?: ICProposal[];
  meetings?: ICMeeting[];
  metrics?: any;
  isLoading?: boolean;
  onCreateProposal?: () => void;
  onViewProposal?: (id: string) => void;
  onScheduleMeeting?: () => void;
}

export const InvestmentCommitteeTraditionalStandardized: React.FC<InvestmentCommitteeTraditionalProps> = ({
  proposals: propProposals,
  meetings: propMeetings,
  metrics: propMetrics,
  isLoading = false,
  onCreateProposal = () => {},
  onViewProposal = () => {},
  onScheduleMeeting = () => {},
}) => {
  // Use consistent mock data if no props provided
  const moduleData = generateModuleData('investment_committee');
  const proposals = propProposals || moduleData.proposals;
  const metrics = propMetrics || moduleData.metrics;
  
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
    { key: 'date', label: 'Date' }
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

    // Apply sorting
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
        mode="traditional"
        message="Loading Investment Committee Data..."
        submessage="Preparing proposal analytics and committee information"
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
            <Badge className="bg-gray-100 text-gray-800 border border-gray-300 flex items-center space-x-1">
              <User className="h-3 w-3" />
              <span>Traditional Mode</span>
            </Badge>
          </div>
          <p className={`${TYPOGRAPHY.body.base} text-gray-600 mt-1`}>
            Complete manual control over committee operations and decision-making
          </p>
        </div>
        <div className="flex space-x-2">
          <Button onClick={onCreateProposal} className="flex items-center space-x-2 bg-gray-700 hover:bg-gray-800">
            <Plus className="h-4 w-4" />
            <span>New Proposal</span>
          </Button>
          <Button onClick={onScheduleMeeting} variant="outline" className="flex items-center space-x-2">
            <Calendar className="h-4 w-4" />
            <span>Schedule Meeting</span>
          </Button>
        </div>
      </div>
      
      {/* Standardized KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <StandardizedKPICard
          title="Total Proposals"
          value={metrics.totalProposals || 0}
          mode="traditional"
          icon={FileText}
          subtitle={`${metrics.activeProposals || 0} active`}
          trend="up"
          trendLabel="this quarter"
        />
        
        <StandardizedKPICard
          title="Approved"
          value={metrics.approvedProposals || 0}
          mode="traditional"
          icon={CheckCircle}
          status="positive"
          subtitle="Committee decisions"
        />
        
        <StandardizedKPICard
          title="Scheduled Meetings"
          value={metrics.scheduledMeetings || 0}
          mode="traditional"
          icon={Calendar}
          subtitle={`${metrics.completedMeetings || 0} completed`}
        />
        
        <PerformanceKPICard
          title="Approval Rate"
          value={metrics.approvalRate || 0}
          mode="traditional"
          benchmark="+5% vs benchmark"
          className="border-gray-200"
        />
        
        <EfficiencyKPICard
          title="Decision Time"
          value={100 - ((metrics.averageDecisionTime || 12) * 5)}
          mode="traditional"
          timeSaved="vs industry avg"
          className="border-gray-200"
        />
      </div>

      {/* Standardized Search and Filter */}
      <StandardizedSearchFilter
        mode="traditional"
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search proposals, companies, sectors..."
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
        totalResults={proposals.length}
        filteredResults={filteredProposals.length}
        className="mb-6"
      />

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Proposals List */}
        <div className="lg:col-span-3">
          <Card className={COMPONENTS.card.traditional.base}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl text-gray-900">Investment Proposals & Decisions</CardTitle>
                  <p className="text-sm text-gray-600 mt-1">Track proposals through the committee decision process</p>
                </div>
                <Button onClick={onCreateProposal} className="bg-gray-700 hover:bg-gray-800">
                  <Gavel className="h-4 w-4 mr-2" />
                  Schedule Vote
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {filteredProposals.length === 0 ? (
                searchTerm || Object.values(filters).some(f => f) ? (
                  <NoResultsEmpty
                    mode="traditional"
                    searchTerm={searchTerm}
                    onClearFilters={() => {
                      setSearchTerm('');
                      setFilters({ status: '', priority: '', type: '' });
                    }}
                  />
                ) : (
                  <NoDataEmpty
                    mode="traditional"
                    dataType="proposals"
                    onCreateNew={onCreateProposal}
                  />
                )
              ) : (
                <div className="space-y-4">
                  {filteredProposals.map((proposal) => (
                    <div key={proposal.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-4">
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

                      {/* Key Metrics using consistent formatting */}
                      {proposal.keyMetrics && (
                        <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg mb-4">
                          <div className="text-center">
                            <p className="text-sm text-gray-500 mb-1">Target IRR</p>
                            <p className="text-lg font-semibold text-green-600">{proposal.keyMetrics.irr?.toFixed(1)}%</p>
                          </div>
                          <div className="text-center">
                            <p className="text-sm text-gray-500 mb-1">Multiple</p>
                            <p className="text-lg font-semibold text-purple-600">{proposal.keyMetrics.multiple?.toFixed(1)}x</p>
                          </div>
                          <div className="text-center">
                            <p className="text-sm text-gray-500 mb-1">Payback</p>
                            <p className="text-lg font-semibold text-orange-600">{proposal.keyMetrics.paybackPeriod?.toFixed(1)}y</p>
                          </div>
                        </div>
                      )}

                      {/* Voting Interface using consistent styling */}
                      {proposal.committeeVotes && (
                        <div className="border-t pt-4">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-medium text-gray-900">Committee Voting Status</h4>
                            <span className="text-sm text-gray-600">
                              {(proposal.committeeVotes.for + proposal.committeeVotes.against + proposal.committeeVotes.abstain)}/{proposal.committeeVotes.total} votes cast
                            </span>
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

                          {/* Action Buttons using consistent patterns */}
                          <div className="flex items-center justify-between">
                            <div className="flex space-x-2">
                              <Button size="sm" variant="outline" onClick={() => onViewProposal(proposal.id)}>
                                <Eye className="h-4 w-4 mr-1" />
                                View Details
                              </Button>
                              <Button size="sm" variant="outline">
                                <FileText className="h-4 w-4 mr-1" />
                                Documents
                              </Button>
                              <Button size="sm" variant="outline">
                                <MessageSquare className="h-4 w-4 mr-1" />
                                Discussion
                              </Button>
                            </div>
                            
                            {proposal.status === 'UNDER_REVIEW' && (
                              <div className="flex space-x-2">
                                <Button size="sm" className="bg-green-600 hover:bg-green-700">
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                  Vote For
                                </Button>
                                <Button size="sm" variant="outline" className="border-red-300 text-red-600 hover:bg-red-50">
                                  <XCircle className="h-4 w-4 mr-1" />
                                  Vote Against
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

        {/* Sidebar using consistent layout patterns */}
        <div className="space-y-6">
          {/* Committee Overview Card */}
          <Card className={COMPONENTS.card.traditional.base}>
            <CardHeader>
              <CardTitle className="text-lg">Committee Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <StandardizedKPICard
                  title="Active Members"
                  value={7}
                  mode="traditional"
                  icon={Users}
                  subtitle="94% attendance rate"
                  className="border-none shadow-none bg-blue-50"
                />
                
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-center p-2 bg-green-50 rounded">
                    <p className="text-lg font-bold text-green-900">89%</p>
                    <p className="text-xs text-green-700">Consensus</p>
                  </div>
                  <div className="text-center p-2 bg-purple-50 rounded">
                    <p className="text-lg font-bold text-purple-900">120m</p>
                    <p className="text-xs text-purple-700">Avg Meeting</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Meetings Card using consistent structure */}
          <Card className={COMPONENTS.card.traditional.base}>
            <CardHeader>
              <CardTitle className="text-lg">Upcoming Meetings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { 
                    date: '2024-01-30', 
                    time: '2:00 PM', 
                    agenda: 'TechVenture Investment Review',
                    proposals: 2
                  },
                  { 
                    date: '2024-02-15', 
                    time: '10:00 AM', 
                    agenda: 'Q1 Portfolio Review',
                    proposals: 5
                  }
                ].map((meeting, index) => (
                  <div key={index} className="p-3 border border-gray-200 rounded-lg">
                    <h5 className="font-medium text-sm">{meeting.agenda}</h5>
                    <p className="text-xs text-gray-600">{meeting.date} at {meeting.time}</p>
                    <p className="text-xs text-gray-600">{meeting.proposals} proposals</p>
                  </div>
                ))}
                
                <Button className="w-full mt-4" variant="outline" size="sm" onClick={onScheduleMeeting}>
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Meeting
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Traditional Process Notice using consistent messaging */}
      <div className="mt-6 p-4 bg-gray-100 border border-gray-200 rounded-lg">
        <div className="flex items-start space-x-3">
          <User className="h-5 w-5 text-gray-600 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-gray-900 mb-1">Traditional Committee Process</h4>
            <p className="text-sm text-gray-600">
              You have full manual control over investment committee operations. All proposal reviews, 
              meeting scheduling, and decision tracking are performed manually without AI assistance. 
              Use the standardized search, filter, and sort tools to organize proposals according to your preferences.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvestmentCommitteeTraditionalStandardized;