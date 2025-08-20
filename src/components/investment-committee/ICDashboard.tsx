'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users,
  Calendar,
  Vote,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  Target,
  Activity,
  MessageSquare,
  BookOpen,
  Plus,
  Search,
  Filter,
  Download,
  RefreshCw,
  Eye,
  Edit,
  Send,
  UserCheck,
  Calendar as CalendarIcon,
  Gavel,
  ClipboardList
} from 'lucide-react';
import type { 
  InvestmentCommittee,
  ICMeeting,
  ICProposal,
  ICMember,
  ICDecision,
  MeetingStatus,
  ProposalStatus,
  VoteType,
  DecisionOutcome
} from '@/types/investment-committee';
import { formatCurrency, formatPercentage, formatDate } from '@/lib/utils';

interface ICDashboardProps {
  navigationMode?: 'traditional' | 'assisted' | 'autonomous';
  onModeChange?: (mode: 'traditional' | 'assisted' | 'autonomous') => void;
}

export function ICDashboard({ 
  navigationMode = 'traditional', 
  onModeChange 
}: ICDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedCommittee, setSelectedCommittee] = useState<string>('');
  const [committees, setCommittees] = useState<InvestmentCommittee[]>([]);
  const [meetings, setMeetings] = useState<ICMeeting[]>([]);
  const [proposals, setProposals] = useState<ICProposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadICData();
  }, []);

  const loadICData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/investment-committee?type=overview');
      const result = await response.json();
      if (result.success && result.data) {
        setCommittees(result.data.committees);
        setMeetings(result.data.meetings);
        setProposals(result.data.proposals);
        if (result.data.committees.length > 0 && !selectedCommittee) {
          setSelectedCommittee(result.data.committees[0].id);
        }
      }
    } catch (error) {
      console.error('Failed to load IC data:', error);
    } finally {
      setLoading(false);
    }
  };

  const currentCommittee = committees.find(c => c.id === selectedCommittee);
  const currentMeetings = meetings.filter(m => m.committeeId === selectedCommittee);
  const currentProposals = proposals.filter(p => 
    currentMeetings.some(m => m.id === p.meetingId)
  );

  const calculateICMetrics = () => {
    const totalProposals = currentProposals.length;
    const approvedProposals = currentProposals.filter(p => p.status === 'APPROVED').length;
    const pendingProposals = currentProposals.filter(p => p.status === 'SUBMITTED' || p.status === 'UNDER_REVIEW').length;
    const upcomingMeetings = currentMeetings.filter(m => m.status === 'SCHEDULED' && m.meetingDate > new Date()).length;
    const completedMeetings = currentMeetings.filter(m => m.status === 'COMPLETED').length;
    
    const totalRequestedAmount = currentProposals.reduce((sum, p) => sum + p.requestedAmount, 0);
    const approvedAmount = currentProposals
      .filter(p => p.status === 'APPROVED')
      .reduce((sum, p) => sum + p.requestedAmount, 0);
    
    const approvalRate = totalProposals > 0 ? (approvedProposals / totalProposals) * 100 : 0;
    const avgMeetingDuration = currentMeetings.length > 0 
      ? currentMeetings.reduce((sum, m) => sum + (m.duration || 0), 0) / currentMeetings.length 
      : 0;

    return {
      totalProposals,
      approvedProposals,
      pendingProposals,
      upcomingMeetings,
      completedMeetings,
      totalRequestedAmount,
      approvedAmount,
      approvalRate,
      avgMeetingDuration
    };
  };

  const metrics = calculateICMetrics();

  const renderModeSpecificContent = () => {
    switch (navigationMode) {
      case 'assisted':
        return <AssistedICContent proposals={currentProposals} meetings={currentMeetings} />;
      case 'autonomous':
        return <AutonomousICContent proposals={currentProposals} meetings={currentMeetings} />;
      default:
        return <TraditionalICContent proposals={currentProposals} meetings={currentMeetings} />;
    }
  };

  const renderKPICards = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Proposals</p>
              <p className="text-2xl font-bold text-gray-900">{metrics.totalProposals}</p>
            </div>
            <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <span className="text-sm text-gray-600">
              {metrics.pendingProposals} pending review
            </span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Approval Rate</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatPercentage(metrics.approvalRate)}
              </p>
            </div>
            <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <span className="text-sm text-gray-600">
              {metrics.approvedProposals} approved
            </span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Approved Amount</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(metrics.approvedAmount)}
              </p>
            </div>
            <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <span className="text-sm text-gray-600">
              of {formatCurrency(metrics.totalRequestedAmount)}
            </span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Upcoming Meetings</p>
              <p className="text-2xl font-bold text-gray-900">{metrics.upcomingMeetings}</p>
            </div>
            <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Calendar className="h-6 w-6 text-orange-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <span className="text-sm text-gray-600">
              {metrics.completedMeetings} completed this year
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Investment Committee</h1>
          <p className="text-gray-600">
            Meeting management, proposal tracking, and decision workflows
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Navigation Mode Switcher */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            {(['traditional', 'assisted', 'autonomous'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => onModeChange?.(mode)}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  navigationMode === mode
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {mode.charAt(0).toUpperCase() + mode.slice(1)}
              </button>
            ))}
          </div>
          
          <Button variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            New Proposal
          </Button>
          
          <Button onClick={loadICData} size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      {renderKPICards()}

      {/* Committee Selector */}
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <div className="flex items-center space-x-3">
          <label className="text-sm font-medium text-gray-700">Committee:</label>
          <select
            value={selectedCommittee}
            onChange={(e) => setSelectedCommittee(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {committees.map(committee => (
              <option key={committee.id} value={committee.id}>
                {committee.name} ({committee.committeeType})
              </option>
            ))}
          </select>
        </div>

        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search proposals..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <Button variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Committee Info Card */}
      {currentCommittee && (
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <p className="text-sm font-medium text-gray-600">Committee Type</p>
                <Badge variant="default">{currentCommittee.committeeType}</Badge>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Quorum Requirement</p>
                <p className="text-lg font-semibold">{currentCommittee.quorumRequirement} members</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Majority Threshold</p>
                <p className="text-lg font-semibold">{formatPercentage(currentCommittee.majorityThreshold * 100)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Max Investment</p>
                <p className="text-lg font-semibold">
                  {currentCommittee.maxInvestmentAmount 
                    ? formatCurrency(currentCommittee.maxInvestmentAmount)
                    : 'Unlimited'
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="proposals">Proposals</TabsTrigger>
          <TabsTrigger value="meetings">Meetings</TabsTrigger>
          <TabsTrigger value="decisions">Decisions</TabsTrigger>
          <TabsTrigger value="members">Members</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {renderModeSpecificContent()}
        </TabsContent>

        <TabsContent value="proposals" className="space-y-6">
          <ProposalsView proposals={currentProposals} />
        </TabsContent>

        <TabsContent value="meetings" className="space-y-6">
          <MeetingsView meetings={currentMeetings} />
        </TabsContent>

        <TabsContent value="decisions" className="space-y-6">
          <DecisionsView proposals={currentProposals} />
        </TabsContent>

        <TabsContent value="members" className="space-y-6">
          <MembersView committeeId={selectedCommittee} />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <AnalyticsView proposals={currentProposals} meetings={currentMeetings} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Traditional IC Content
function TraditionalICContent({ proposals, meetings }: { proposals: ICProposal[], meetings: ICMeeting[] }) {
  const upcomingMeetings = meetings
    .filter(m => m.status === 'SCHEDULED' && m.meetingDate > new Date())
    .sort((a, b) => a.meetingDate.getTime() - b.meetingDate.getTime())
    .slice(0, 3);

  const recentProposals = proposals
    .sort((a, b) => b.submittedAt.getTime() - a.submittedAt.getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Upcoming Meetings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingMeetings.map((meeting) => (
                <div key={meeting.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium">Meeting #{meeting.meetingNumber}</h4>
                    <p className="text-sm text-gray-600">
                      {formatDate(meeting.meetingDate)} • {meeting.format}
                    </p>
                    <p className="text-sm text-gray-500">
                      {meeting.proposals?.length || 0} proposals
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={meeting.quorumMet ? 'default' : 'secondary'}>
                      {meeting.status}
                    </Badge>
                    <Button size="sm" variant="outline">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
              {upcomingMeetings.length === 0 && (
                <p className="text-gray-500 text-center py-4">No upcoming meetings scheduled</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              Recent Proposals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentProposals.map((proposal) => (
                <div key={proposal.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium">{proposal.proposalTitle}</h4>
                    <p className="text-sm text-gray-600">{proposal.targetCompany} • {proposal.sector}</p>
                    <p className="text-sm text-gray-500">
                      {formatCurrency(proposal.requestedAmount)} • {proposal.presentingPartner}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={getProposalStatusVariant(proposal.status)}>
                      {proposal.status}
                    </Badge>
                    <Button size="sm" variant="outline">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Assisted IC Content
function AssistedICContent({ proposals, meetings }: { proposals: ICProposal[], meetings: ICMeeting[] }) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Target className="h-5 w-5 mr-2" />
            AI Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 border rounded-lg border-amber-200 bg-amber-50">
              <h3 className="font-semibold text-amber-800 flex items-center">
                <AlertTriangle className="h-4 w-4 mr-2" />
                High-Risk Proposal Alert
              </h3>
              <p className="text-sm text-amber-700 mt-1">
                TechCorp proposal shows elevated market risk (score: 8.2/10). Consider extended due diligence.
              </p>
              <div className="flex gap-2 mt-3">
                <Button size="sm" className="bg-amber-600 hover:bg-amber-700">Review Analysis</Button>
                <Button size="sm" variant="outline">Schedule DD</Button>
              </div>
            </div>
            
            <div className="p-4 border rounded-lg border-blue-200 bg-blue-50">
              <h3 className="font-semibold text-blue-800">Meeting Efficiency Insight</h3>
              <p className="text-sm text-blue-700 mt-1">
                Average meeting duration increased 15% this quarter. AI suggests agenda optimization.
              </p>
              <Button size="sm" className="mt-3 bg-blue-600 hover:bg-blue-700">View Suggestions</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <TraditionalICContent proposals={proposals} meetings={meetings} />
    </div>
  );
}

// Autonomous IC Content
function AutonomousICContent({ proposals, meetings }: { proposals: ICProposal[], meetings: ICMeeting[] }) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Gavel className="h-5 w-5 mr-2" />
            Decision Queue
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 border rounded-lg border-red-200 bg-red-50">
              <h3 className="font-semibold text-red-800 flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                Urgent: Voting Deadline Tomorrow
              </h3>
              <p className="text-sm text-red-700 mt-1">
                GreenTech proposal (IC-2024-008) requires decision by EOD. 3 votes pending.
              </p>
              <div className="flex gap-2 mt-3">
                <Button size="sm" className="bg-red-600 hover:bg-red-700">Send Reminders</Button>
                <Button size="sm" variant="outline">Extend Deadline</Button>
              </div>
            </div>
            
            <div className="p-4 border rounded-lg border-green-200 bg-green-50">
              <h3 className="font-semibold text-green-800">Auto-Approved: Compliance Cleared</h3>
              <p className="text-sm text-green-700 mt-1">
                FinServ follow-on investment automatically approved - meets all predefined criteria.
              </p>
              <Button size="sm" className="mt-3 bg-green-600 hover:bg-green-700">View Details</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <AssistedICContent proposals={proposals} meetings={meetings} />
    </div>
  );
}

// Proposals View
function ProposalsView({ proposals }: { proposals: ICProposal[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            Investment Proposals
          </div>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            New Proposal
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {proposals.map((proposal) => (
            <div key={proposal.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
              <div className="flex-1">
                <div className="flex items-center space-x-4 mb-2">
                  <h4 className="font-semibold">{proposal.proposalTitle}</h4>
                  <Badge variant={getProposalStatusVariant(proposal.status)}>
                    {proposal.status}
                  </Badge>
                  <Badge variant="outline">{proposal.priority}</Badge>
                </div>
                <p className="text-sm text-gray-600">
                  {proposal.targetCompany} • {proposal.sector} • {proposal.proposalType}
                </p>
                <p className="text-sm text-gray-500">
                  {formatCurrency(proposal.requestedAmount)} • Submitted: {formatDate(proposal.submittedAt)}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="text-right">
                  <p className="text-sm text-gray-600">Projected IRR</p>
                  <p className="font-semibold">{formatPercentage(proposal.projectedIRR || 0)}</p>
                </div>
                <Button size="sm" variant="outline">
                  <Eye className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="outline">
                  <Vote className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Meetings View
function MeetingsView({ meetings }: { meetings: ICMeeting[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <CalendarIcon className="h-5 w-5 mr-2" />
            Committee Meetings
          </div>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Schedule Meeting
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {meetings.map((meeting) => (
            <div key={meeting.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
              <div className="flex-1">
                <div className="flex items-center space-x-4 mb-2">
                  <h4 className="font-semibold">Meeting #{meeting.meetingNumber}</h4>
                  <Badge variant={getMeetingStatusVariant(meeting.status)}>
                    {meeting.status}
                  </Badge>
                  <Badge variant="outline">{meeting.format}</Badge>
                </div>
                <p className="text-sm text-gray-600">
                  {formatDate(meeting.meetingDate)} • {meeting.meetingTime || 'Time TBD'}
                </p>
                <p className="text-sm text-gray-500">
                  {meeting.proposals?.length || 0} proposals • {meeting.attendanceCount} attendees
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="text-right">
                  <p className="text-sm text-gray-600">Duration</p>
                  <p className="font-semibold">{meeting.duration || '--'} min</p>
                </div>
                <Button size="sm" variant="outline">
                  <Eye className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="outline">
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Decisions View
function DecisionsView({ proposals }: { proposals: ICProposal[] }) {
  const decidedProposals = proposals.filter(p => 
    p.status === 'APPROVED' || p.status === 'REJECTED' || p.status === 'DEFERRED'
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <CheckCircle className="h-5 w-5 mr-2" />
          Investment Decisions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {decidedProposals.map((proposal) => (
            <div key={proposal.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
              <div className="flex-1">
                <div className="flex items-center space-x-4 mb-2">
                  <h4 className="font-semibold">{proposal.proposalTitle}</h4>
                  <Badge variant={getProposalStatusVariant(proposal.status)}>
                    {proposal.status}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600">
                  {proposal.targetCompany} • {formatCurrency(proposal.requestedAmount)}
                </p>
                <p className="text-sm text-gray-500">
                  Decision: {proposal.decisionDate ? formatDate(proposal.decisionDate) : 'Pending'}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Button size="sm" variant="outline">
                  <Eye className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="outline">
                  <FileText className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Members View
function MembersView({ committeeId }: { committeeId: string }) {
  const [members, setMembers] = useState<ICMember[]>([]);

  useEffect(() => {
    if (committeeId) {
      // Load committee members
      setMembers([
        {
          id: 'member-1',
          committeeId,
          memberName: 'Sarah Johnson',
          memberTitle: 'Managing Partner',
          memberEmail: 'sarah.johnson@firm.com',
          role: 'CHAIR',
          status: 'ACTIVE',
          votingRights: true,
          appointmentDate: new Date('2020-01-01'),
          isVotingMember: true,
          meetingsAttended: 45,
          meetingsEligible: 48,
          attendanceRate: 93.8,
          createdAt: new Date('2020-01-01'),
          updatedAt: new Date('2024-03-20')
        }
      ]);
    }
  }, [committeeId]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <Users className="h-5 w-5 mr-2" />
            Committee Members
          </div>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Member
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {members.map((member) => (
            <div key={member.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
              <div className="flex-1">
                <div className="flex items-center space-x-4 mb-2">
                  <h4 className="font-semibold">{member.memberName}</h4>
                  <Badge variant={member.role === 'CHAIR' ? 'default' : 'secondary'}>
                    {member.role}
                  </Badge>
                  <Badge variant={member.status === 'ACTIVE' ? 'default' : 'secondary'}>
                    {member.status}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600">{member.memberTitle}</p>
                <p className="text-sm text-gray-500">
                  Attendance: {formatPercentage(member.attendanceRate)} ({member.meetingsAttended}/{member.meetingsEligible})
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="text-right">
                  <p className="text-sm text-gray-600">Voting Rights</p>
                  <p className="font-semibold">{member.votingRights ? 'Yes' : 'No'}</p>
                </div>
                <Button size="sm" variant="outline">
                  <UserCheck className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Analytics View
function AnalyticsView({ proposals, meetings }: { proposals: ICProposal[], meetings: ICMeeting[] }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Proposal Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center text-gray-500">
            [Proposal Trends Chart Placeholder]
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Decision Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-600">Average Decision Time</p>
              <p className="text-2xl font-bold">14 days</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Meeting Efficiency</p>
              <p className="text-2xl font-bold">85%</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Member Participation</p>
              <p className="text-2xl font-bold">92%</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Helper functions
function getProposalStatusVariant(status: ProposalStatus): "default" | "secondary" | "destructive" | "outline" {
  switch (status) {
    case 'APPROVED':
      return 'default';
    case 'REJECTED':
      return 'destructive';
    case 'UNDER_REVIEW':
      return 'secondary';
    default:
      return 'outline';
  }
}

function getMeetingStatusVariant(status: MeetingStatus): "default" | "secondary" | "destructive" | "outline" {
  switch (status) {
    case 'COMPLETED':
      return 'default';
    case 'IN_PROGRESS':
      return 'secondary';
    case 'CANCELLED':
      return 'destructive';
    default:
      return 'outline';
  }
}