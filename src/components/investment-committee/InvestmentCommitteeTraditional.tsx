import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Search,
  Filter,
  ArrowUpDown,
  Plus,
  MoreVertical,
  Calendar,
  FileText,
  Users,
  CheckCircle,
  XCircle,
  Clock,
  Target,
  AlertCircle,
  Eye,
  Edit,
  User,
  Gavel
} from 'lucide-react';
import type { 
  ICProposal,
  ICMeeting 
} from '@/types/investment-committee';

interface InvestmentCommitteeTraditionalProps {
  proposals: ICProposal[];
  meetings: ICMeeting[];
  metrics: any;
  isLoading: boolean;
  onCreateProposal: () => void;
  onViewProposal: (id: string) => void;
  onScheduleMeeting: () => void;
}

export const InvestmentCommitteeTraditional: React.FC<InvestmentCommitteeTraditionalProps> = ({
  proposals = [],
  meetings = [],
  metrics = {
    totalProposals: 15,
    activeProposals: 8,
    approvedProposals: 12,
    rejectedProposals: 3,
    scheduledMeetings: 2,
    completedMeetings: 24,
    averageDecisionTime: 12,
    approvalRate: 78,
    averageMeetingDuration: 120
  },
  isLoading = false,
  onCreateProposal,
  onViewProposal,
  onScheduleMeeting,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'title' | 'status' | 'amount' | 'date'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedFilters, setSelectedFilters] = useState({
    status: '',
    priority: '',
    type: ''
  });

  // Apply filtering and sorting with useMemo to prevent infinite re-renders
  const filteredProposals = useMemo(() => {
    let result = [...proposals];
    
    // Apply search filter
    if (searchTerm) {
      result = result.filter(proposal => 
        proposal.proposalTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        proposal.targetCompany?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        proposal.sector?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply filters
    if (selectedFilters.status) {
      result = result.filter(proposal => proposal.status === selectedFilters.status);
    }
    if (selectedFilters.priority) {
      result = result.filter(proposal => proposal.priority === selectedFilters.priority);
    }
    if (selectedFilters.type) {
      result = result.filter(proposal => proposal.type === selectedFilters.type);
    }

    // Apply sorting
    result.sort((a, b) => {
      let aValue, bValue;
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
          aValue = a[sortBy];
          bValue = b[sortBy];
      }
      
      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });
    
    return result;
  }, [proposals, searchTerm, selectedFilters.status, selectedFilters.priority, selectedFilters.type, sortBy, sortOrder]);

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'REJECTED':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'UNDER_REVIEW':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'SUBMITTED':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-600 mb-4"></div>
        <h3 className="text-xl font-semibold text-gray-700">Loading Investment Committee Data...</h3>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Header - Traditional Theme */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <div className="flex items-center space-x-3">
            <h1 className="text-3xl font-bold text-gray-900">Investment Committee Dashboard</h1>
            <Badge className="bg-gray-100 text-gray-800 border border-gray-300 flex items-center space-x-1">
              <User className="h-3 w-3" />
              <span>Traditional Mode</span>
            </Badge>
          </div>
          <p className="text-gray-600 mt-1">Complete manual control over committee operations and decision-making</p>
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
      
      {/* KPI Cards - Traditional Focus */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <Card className="border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2 mb-2">
              <FileText className="h-5 w-5 text-gray-600" />
              <p className="text-sm text-gray-600 font-medium">Total Proposals</p>
            </div>
            <p className="text-3xl font-bold text-gray-900">{metrics.totalProposals}</p>
            <div className="flex items-center text-gray-500 text-sm mt-1">
              <Target className="h-4 w-4 mr-1" />
              {metrics.activeProposals} active
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2 mb-2">
              <CheckCircle className="h-5 w-5 text-gray-600" />
              <p className="text-sm text-gray-600 font-medium">Approved</p>
            </div>
            <p className="text-3xl font-bold text-gray-900">{metrics.approvedProposals}</p>
            <div className="flex items-center text-gray-500 text-sm mt-1">
              <Users className="h-4 w-4 mr-1" />
              Committee decision
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2 mb-2">
              <Calendar className="h-5 w-5 text-gray-600" />
              <p className="text-sm text-gray-600 font-medium">Meetings</p>
            </div>
            <p className="text-3xl font-bold text-gray-900">{metrics.scheduledMeetings}</p>
            <div className="flex items-center text-gray-500 text-sm mt-1">
              <Clock className="h-4 w-4 mr-1" />
              {metrics.completedMeetings} completed
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-gray-200">
          <CardContent className="p-6">
            <p className="text-sm text-gray-600 font-medium mb-2">Approval Rate</p>
            <p className="text-3xl font-bold text-gray-900">{metrics.approvalRate}%</p>
            <div className="flex items-center text-gray-500 text-sm mt-1">
              <Gavel className="h-4 w-4 mr-1" />
              Manual review
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-gray-200">
          <CardContent className="p-6">
            <p className="text-sm text-gray-600 font-medium mb-2">Avg. Decision Time</p>
            <p className="text-3xl font-bold text-gray-900">{metrics.averageDecisionTime}d</p>
            <div className="flex items-center text-gray-500 text-sm mt-1">
              <User className="h-4 w-4 mr-1" />
              Committee process
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter Controls */}
      <Card className="mb-6 border-gray-200">
        <CardHeader>
          <CardTitle className="text-xl text-gray-900">Manual Search & Filter Controls</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search proposals, companies, sectors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-gray-300 focus:border-gray-500"
              />
            </div>
            
            <div className="flex space-x-2">
              <select
                value={selectedFilters.status}
                onChange={(e) => setSelectedFilters(prev => ({ ...prev, status: e.target.value }))}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="">All Statuses</option>
                <option value="SUBMITTED">Submitted</option>
                <option value="UNDER_REVIEW">Under Review</option>
                <option value="APPROVED">Approved</option>
                <option value="REJECTED">Rejected</option>
              </select>
              
              <select
                value={selectedFilters.priority}
                onChange={(e) => setSelectedFilters(prev => ({ ...prev, priority: e.target.value }))}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="">All Priorities</option>
                <option value="HIGH">High</option>
                <option value="MEDIUM">Medium</option>
                <option value="LOW">Low</option>
              </select>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {(['title', 'status', 'amount', 'date'] as const).map((field) => (
              <Button
                key={field}
                variant={sortBy === field ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  if (sortBy === field) {
                    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                  } else {
                    setSortBy(field);
                    setSortOrder('asc');
                  }
                }}
                className={`flex items-center space-x-2 ${
                  sortBy === field 
                    ? 'bg-gray-700 text-white' 
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span className="capitalize">{field}</span>
                {sortBy === field && (
                  <ArrowUpDown className="h-3 w-3" />
                )}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Proposals and Meeting Management */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Proposals List */}
        <div className="lg:col-span-3">
          <Card className="border-gray-200">
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
                <div className="text-center py-12">
                  <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No proposals found</h3>
                  <p className="text-gray-600 mb-4">Try adjusting your search criteria or filters</p>
                  <Button onClick={() => {
                    setSearchTerm('');
                    setSelectedFilters({ status: '', priority: '', type: '' });
                  }} variant="outline">
                    Clear Filters
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {[
                    {
                      id: '1',
                      proposalTitle: 'TechVenture Growth Investment',
                      targetCompany: 'AI Healthcare Solutions',
                      sector: 'Healthcare Technology',
                      requestedAmount: 25000000,
                      status: 'UNDER_REVIEW',
                      priority: 'HIGH',
                      submittedAt: '2024-01-15',
                      meetingDate: '2024-01-30',
                      presenter: 'Sarah Johnson',
                      voteStatus: 'pending',
                      committeeVotes: { for: 0, against: 0, abstain: 0, total: 7 },
                      keyMetrics: { irr: 18.5, multiple: 2.3, paybackPeriod: 4.2 },
                      riskFactors: ['Market competition', 'Regulatory changes', 'Technology obsolescence']
                    },
                    {
                      id: '2',
                      proposalTitle: 'Manufacturing Expansion Fund',
                      targetCompany: 'GreenTech Manufacturing',
                      sector: 'Clean Technology',
                      requestedAmount: 45000000,
                      status: 'APPROVED',
                      priority: 'MEDIUM',
                      submittedAt: '2024-01-10',
                      meetingDate: '2024-01-25',
                      presenter: 'Michael Chen',
                      voteStatus: 'approved',
                      committeeVotes: { for: 6, against: 1, abstain: 0, total: 7 },
                      keyMetrics: { irr: 15.2, multiple: 2.1, paybackPeriod: 5.1 },
                      riskFactors: ['Supply chain disruption', 'ESG compliance']
                    },
                    {
                      id: '3',
                      proposalTitle: 'Biotech Innovation Investment',
                      targetCompany: 'NextGen Therapeutics',
                      sector: 'Biotechnology',
                      requestedAmount: 35000000,
                      status: 'REJECTED',
                      priority: 'HIGH',
                      submittedAt: '2024-01-08',
                      meetingDate: '2024-01-22',
                      presenter: 'Rachel Martinez',
                      voteStatus: 'rejected',
                      committeeVotes: { for: 2, against: 4, abstain: 1, total: 7 },
                      keyMetrics: { irr: 12.8, multiple: 1.9, paybackPeriod: 6.5 },
                      riskFactors: ['FDA approval risk', 'Long development timeline', 'Competition from big pharma']
                    }
                  ].map((proposal) => (
                    <div key={proposal.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-lg text-gray-900">{proposal.proposalTitle}</h3>
                            <Badge className={`${getStatusColor(proposal.status)} border`}>
                              {proposal.status.replace('_', ' ')}
                            </Badge>
                            <Badge className={proposal.priority === 'HIGH' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'} variant="outline">
                              {proposal.priority}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                            <span><strong>Target:</strong> {proposal.targetCompany}</span>
                            <span><strong>Sector:</strong> {proposal.sector}</span>
                            <span><strong>Presenter:</strong> {proposal.presenter}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-blue-600">{formatCurrency(proposal.requestedAmount)}</p>
                          <p className="text-sm text-gray-500">{proposal.meetingDate}</p>
                        </div>
                      </div>

                      {/* Key Metrics */}
                      <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg mb-4">
                        <div className="text-center">
                          <p className="text-sm text-gray-500 mb-1">Target IRR</p>
                          <p className="text-lg font-semibold text-green-600">{proposal.keyMetrics.irr}%</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-gray-500 mb-1">Multiple</p>
                          <p className="text-lg font-semibold text-purple-600">{proposal.keyMetrics.multiple}x</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-gray-500 mb-1">Payback</p>
                          <p className="text-lg font-semibold text-orange-600">{proposal.keyMetrics.paybackPeriod}y</p>
                        </div>
                      </div>

                      {/* Voting Interface */}
                      <div className="border-t pt-4">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-medium text-gray-900">Committee Voting Status</h4>
                          <span className="text-sm text-gray-600">
                            {proposal.committeeVotes.for + proposal.committeeVotes.against + proposal.committeeVotes.abstain}/{proposal.committeeVotes.total} votes cast
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

                        {/* Risk Factors */}
                        <div className="mb-4">
                          <h5 className="font-medium text-gray-900 mb-2">Key Risk Factors</h5>
                          <div className="flex flex-wrap gap-2">
                            {proposal.riskFactors.map((risk, index) => (
                              <span key={index} className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                                {risk}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Action Buttons */}
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
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Committee Management Sidebar */}
        <div className="space-y-6">
          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle className="text-lg">Committee Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-center">
                  <p className="text-2xl font-bold text-blue-900">7</p>
                  <p className="text-sm text-blue-700">Active Members</p>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-center p-2 bg-green-50 rounded">
                    <p className="text-lg font-bold text-green-900">94%</p>
                    <p className="text-xs text-green-700">Attendance</p>
                  </div>
                  <div className="text-center p-2 bg-purple-50 rounded">
                    <p className="text-lg font-bold text-purple-900">89%</p>
                    <p className="text-xs text-purple-700">Consensus</p>
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <h5 className="font-medium mb-3">Active Members</h5>
                  <div className="space-y-2">
                    {[
                      { name: 'John Smith', role: 'Chairman', status: 'active' },
                      { name: 'Sarah Johnson', role: 'Managing Partner', status: 'active' },
                      { name: 'Michael Chen', role: 'Investment Partner', status: 'active' },
                      { name: 'Rachel Martinez', role: 'Operating Partner', status: 'active' },
                      { name: 'David Kim', role: 'External Advisor', status: 'inactive' }
                    ].slice(0, 4).map((member, index) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <span className="font-medium">{member.name}</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-600">{member.role}</span>
                          <div className={`w-2 h-2 rounded-full ${
                            member.status === 'active' ? 'bg-green-500' : 'bg-gray-300'
                          }`}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200">
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
                    proposals: 2,
                    type: 'Regular'
                  },
                  { 
                    date: '2024-02-15', 
                    time: '10:00 AM', 
                    agenda: 'Q1 Portfolio Review',
                    proposals: 5,
                    type: 'Quarterly'
                  },
                  { 
                    date: '2024-02-28', 
                    time: '3:00 PM', 
                    agenda: 'Strategic Planning Session',
                    proposals: 1,
                    type: 'Strategic'
                  }
                ].map((meeting, index) => (
                  <div key={index} className="p-3 border border-gray-200 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h5 className="font-medium text-sm">{meeting.agenda}</h5>
                        <p className="text-xs text-gray-600">{meeting.date} at {meeting.time}</p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {meeting.type}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-600">{meeting.proposals} proposals on agenda</p>
                  </div>
                ))}
              </div>
              
              <Button className="w-full mt-4" variant="outline" size="sm" onClick={onScheduleMeeting}>
                <Calendar className="h-4 w-4 mr-2" />
                Schedule Meeting
              </Button>
            </CardContent>
          </Card>

          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle className="text-lg">Decision Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-center p-2 bg-gray-50 rounded">
                    <p className="text-lg font-bold text-gray-900">12d</p>
                    <p className="text-xs text-gray-600">Avg Decision Time</p>
                  </div>
                  <div className="text-center p-2 bg-gray-50 rounded">
                    <p className="text-lg font-bold text-gray-900">78%</p>
                    <p className="text-xs text-gray-600">Approval Rate</p>
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <h5 className="font-medium mb-3">Recent Decisions</h5>
                  <div className="space-y-2">
                    {[
                      { proposal: 'GreenTech Manufacturing', decision: 'Approved', date: '2024-01-25' },
                      { proposal: 'NextGen Therapeutics', decision: 'Rejected', date: '2024-01-22' },
                      { proposal: 'FinTech Solutions', decision: 'Approved', date: '2024-01-18' }
                    ].map((decision, index) => (
                      <div key={index} className="text-xs">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium">{decision.proposal}</span>
                          <Badge className={`text-xs ${
                            decision.decision === 'Approved' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {decision.decision}
                          </Badge>
                        </div>
                        <p className="text-gray-500">{decision.date}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Manual Process Notice */}
      <div className="mt-6 p-4 bg-gray-100 border border-gray-200 rounded-lg">
        <div className="flex items-start space-x-3">
          <User className="h-5 w-5 text-gray-600 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-gray-900 mb-1">Traditional Committee Process</h4>
            <p className="text-sm text-gray-600">
              You have full manual control over investment committee operations. All proposal reviews, 
              meeting scheduling, and decision tracking are performed manually without AI assistance. 
              Use the search, filter, and sort tools above to organize proposals according to your preferences.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvestmentCommitteeTraditional;