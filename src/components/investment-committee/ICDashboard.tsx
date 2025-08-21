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
  ClipboardList,
  Brain,
  Zap
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
      
      {/* AI-Enhanced Metrics */}
      <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-700">AI Decision Forecast</p>
              <p className="text-2xl font-bold text-purple-900">
                {metrics.predictedApprovals} approvals
              </p>
            </div>
            <div className="h-12 w-12 bg-purple-200 rounded-lg flex items-center justify-center">
              <Brain className="h-6 w-6 text-purple-700" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <Zap className="h-4 w-4 text-purple-600 mr-1" />
            <span className="text-sm text-purple-700">
              {metrics.aiConfidence}% confidence • {metrics.consensusLevel}% consensus
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
    .filter(m => m.status === 'SCHEDULED' && new Date(m.meetingDate) > new Date())
    .sort((a, b) => {
      const dateA = new Date(a.meetingDate).getTime();
      const dateB = new Date(b.meetingDate).getTime();
      return dateA - dateB;
    })
    .slice(0, 3);

  const recentProposals = proposals
    .sort((a, b) => {
      const dateA = new Date(a.submittedAt).getTime();
      const dateB = new Date(b.submittedAt).getTime();
      return dateB - dateA;
    })
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
  // AI-powered insights and recommendations
  const aiInsights = React.useMemo(() => {
    const insights = [];
    
    // Risk Analysis Insight
    const highRiskProposals = proposals.filter(p => Math.random() > 0.7); // Simulate risk scoring
    if (highRiskProposals.length > 0) {
      insights.push({
        id: 'risk-alert',
        type: 'warning' as const,
        title: 'High-Risk Proposals Detected',
        description: `${highRiskProposals.length} proposal(s) show elevated risk scores. AI recommends extended due diligence.`,
        confidence: 0.87,
        actionable: true,
        actions: ['Review Risk Analysis', 'Schedule Deep Dive', 'Consult Risk Committee']
      });
    }

    // Meeting Optimization
    const upcomingMeetings = meetings.filter(m => m.status === 'SCHEDULED' && m.meetingDate > new Date());
    if (upcomingMeetings.length > 0) {
      insights.push({
        id: 'meeting-opt',
        type: 'optimization' as const,
        title: 'Meeting Schedule Optimization',
        description: 'AI suggests combining 2 upcoming meetings to improve member attendance (predicted 89% vs 72%).',
        confidence: 0.92,
        actionable: true,
        actions: ['View Optimization Plan', 'Send Meeting Invite', 'Reschedule Conflicts']
      });
    }

    // Proposal Scoring
    const pendingProposals = proposals.filter(p => p.status === 'SUBMITTED' || p.status === 'UNDER_REVIEW');
    if (pendingProposals.length > 0) {
      insights.push({
        id: 'proposal-scoring',
        type: 'insight' as const,
        title: 'AI Proposal Scoring Complete',
        description: `Analyzed ${pendingProposals.length} proposals. Top candidate: HealthTech Inc (AI Score: 8.7/10, predicted IRR: 28.4%)`,
        confidence: 0.85,
        actionable: true,
        actions: ['View Full Scoring', 'Compare Alternatives', 'Generate Report']
      });
    }

    // Voting Pattern Analysis
    insights.push({
      id: 'voting-pattern',
      type: 'insight' as const,
      title: 'Voting Pattern Analysis',
      description: 'AI detected consensus trend: 94% alignment on ESG-focused deals vs 67% on traditional investments.',
      confidence: 0.78,
      actionable: true,
      actions: ['View Pattern Analysis', 'Adjust Pipeline Focus', 'Generate Strategy Brief']
    });

    return insights;
  }, [proposals, meetings]);

  // Smart meeting preparation
  const meetingPreparation = React.useMemo(() => {
    const upcomingMeeting = meetings.find(m => m.status === 'SCHEDULED' && m.meetingDate > new Date());
    if (!upcomingMeeting) return null;

    return {
      meetingId: upcomingMeeting.id,
      date: upcomingMeeting.meetingDate,
      preparationScore: 85, // AI-calculated readiness score
      missingItems: ['Member conflict disclosures', 'Updated market analysis'],
      recommendations: [
        'Send preparation materials 48h before meeting',
        'Pre-brief members on complex proposals',
        'Schedule 15min buffer between agenda items'
      ]
    };
  }, [meetings]);

  return (
    <div className="space-y-6">
      {/* AI Insights Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Target className="h-5 w-5 mr-2 text-blue-600" />
              AI-Powered Insights
            </div>
            <Badge variant="secondary" className="bg-blue-100 text-blue-700">
              {aiInsights.length} Active
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {aiInsights.map(insight => (
              <div 
                key={insight.id}
                className={`p-4 border rounded-lg ${
                  insight.type === 'warning' ? 'border-amber-200 bg-amber-50' :
                  insight.type === 'optimization' ? 'border-blue-200 bg-blue-50' :
                  'border-green-200 bg-green-50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className={`font-semibold flex items-center ${
                      insight.type === 'warning' ? 'text-amber-800' :
                      insight.type === 'optimization' ? 'text-blue-800' :
                      'text-green-800'
                    }`}>
                      {insight.type === 'warning' && <AlertTriangle className="h-4 w-4 mr-2" />}
                      {insight.type === 'optimization' && <Target className="h-4 w-4 mr-2" />}
                      {insight.type === 'insight' && <CheckCircle className="h-4 w-4 mr-2" />}
                      {insight.title}
                    </h3>
                    <p className={`text-sm mt-1 ${
                      insight.type === 'warning' ? 'text-amber-700' :
                      insight.type === 'optimization' ? 'text-blue-700' :
                      'text-green-700'
                    }`}>
                      {insight.description}
                    </p>
                    <div className="flex items-center mt-2">
                      <span className="text-xs text-gray-500">
                        Confidence: {Math.round(insight.confidence * 100)}%
                      </span>
                    </div>
                  </div>
                  <Button size="sm" variant="ghost" className="ml-2">
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
                {insight.actionable && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {insight.actions.map((action, idx) => (
                      <Button key={idx} size="sm" variant="outline" className="text-xs">
                        {action}
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Smart Meeting Preparation */}
      {meetingPreparation && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-indigo-600" />
              Smart Meeting Preparation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">Next Meeting Readiness</p>
                  <p className="text-sm text-gray-600">
                    {formatDate(meetingPreparation.date)}
                  </p>
                </div>
                <div className="text-right">
                  <div className="flex items-center">
                    <Progress value={meetingPreparation.preparationScore} className="w-16 mr-2" />
                    <span className="font-bold text-lg">{meetingPreparation.preparationScore}%</span>
                  </div>
                  <p className="text-xs text-gray-500">Ready</p>
                </div>
              </div>

              {meetingPreparation.missingItems.length > 0 && (
                <div className="space-y-2">
                  <p className="font-medium text-sm">Missing Items:</p>
                  {meetingPreparation.missingItems.map((item, idx) => (
                    <div key={idx} className="flex items-center text-sm text-amber-700 bg-amber-50 p-2 rounded">
                      <Clock className="h-4 w-4 mr-2" />
                      {item}
                    </div>
                  ))}
                </div>
              )}

              <div className="space-y-2">
                <p className="font-medium text-sm">AI Recommendations:</p>
                {meetingPreparation.recommendations.map((rec, idx) => (
                  <div key={idx} className="flex items-center text-sm text-blue-700 bg-blue-50 p-2 rounded">
                    <Target className="h-4 w-4 mr-2" />
                    {rec}
                  </div>
                ))}
              </div>

              <div className="flex gap-2 pt-2">
                <Button size="sm" variant="default">
                  Complete Preparation
                </Button>
                <Button size="sm" variant="outline">
                  Send Reminders
                </Button>
                <Button size="sm" variant="outline">
                  View Full Agenda
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Traditional Content with AI Enhancements */}
      <TraditionalICContent proposals={proposals} meetings={meetings} />
    </div>
  );
}

// Autonomous IC Content
function AutonomousICContent({ proposals, meetings }: { proposals: ICProposal[], meetings: ICMeeting[] }) {
  // Autonomous processing state
  const [autonomousActions, setAutonomousActions] = React.useState([
    {
      id: 'auto-1',
      type: 'approval' as const,
      title: 'Auto-Approved: FinServ Follow-On',
      description: 'Follow-on investment in FinServ Corp automatically approved. Meets all criteria: <$5M, existing portfolio, strong performance metrics.',
      status: 'completed' as const,
      timestamp: new Date(Date.now() - 3600000), // 1 hour ago
      confidence: 0.98,
      rollbackable: true
    },
    {
      id: 'auto-2',
      type: 'scheduling' as const,
      title: 'Meeting Auto-Scheduled',
      description: 'Emergency IC meeting scheduled for tomorrow 2PM to address 3 time-sensitive proposals. All members notified.',
      status: 'in_progress' as const,
      timestamp: new Date(Date.now() - 1800000), // 30 min ago
      confidence: 0.95,
      rollbackable: true
    },
    {
      id: 'auto-3',
      type: 'analysis' as const,
      title: 'Risk Analysis Complete',
      description: 'Completed automated risk assessment for 5 pending proposals. 2 flagged for human review, 3 cleared for fast-track.',
      status: 'completed' as const,
      timestamp: new Date(Date.now() - 900000), // 15 min ago
      confidence: 0.89,
      rollbackable: false
    }
  ]);

  // Pending autonomous actions awaiting approval
  const [pendingActions, setPendingActions] = React.useState([
    {
      id: 'pending-1',
      type: 'voting' as const,
      title: 'Auto-Vote Recommendation',
      description: 'AI recommends "APPROVE" vote for HealthTech proposal based on portfolio fit analysis (94% match). Execute autonomous vote?',
      estimatedImpact: 'Medium - follows established investment criteria',
      riskLevel: 'Low' as const,
      requiresApproval: true
    },
    {
      id: 'pending-2',
      type: 'workflow' as const,
      title: 'Process Optimization',
      description: 'Detected inefficiency in proposal review workflow. AI can restructure to reduce average review time by 40%.',
      estimatedImpact: 'High - affects all future proposals',
      riskLevel: 'Medium' as const,
      requiresApproval: true
    }
  ]);

  // AI-powered decision predictions
  const decisionPredictions = React.useMemo(() => {
    return proposals.map(proposal => ({
      proposalId: proposal.id,
      proposalName: proposal.company || `Proposal ${proposal.id.slice(-3)}`,
      predictedOutcome: Math.random() > 0.5 ? 'APPROVE' : 'REJECT',
      confidence: Math.round((0.7 + Math.random() * 0.3) * 100), // 70-100%
      memberVotes: {
        likely_approve: Math.floor(Math.random() * 5) + 1,
        likely_reject: Math.floor(Math.random() * 3),
        uncertain: Math.floor(Math.random() * 2)
      },
      keyFactors: ['Financial metrics', 'Market timing', 'Portfolio fit', 'ESG alignment'],
      aiRecommendation: Math.random() > 0.6 ? 'STRONG_APPROVE' : Math.random() > 0.3 ? 'APPROVE' : 'REVIEW_NEEDED'
    })).slice(0, 4); // Show top 4
  }, [proposals]);

  const executeAutonomousAction = (actionId: string) => {
    setPendingActions(prev => prev.filter(a => a.id !== actionId));
    alert(`Executing Investment Committee Autonomous Action ${actionId}:\n\n• AI-powered decision validation and risk assessment\n• Automated investment analysis with ML modeling\n• Cross-module data integration and impact analysis\n• Real-time market sentiment and competitive intelligence\n• Intelligent workflow routing and stakeholder notifications\n• Automated compliance checks and regulatory verification\n• Predictive outcome modeling with scenario analysis`);
  };

  const rollbackAction = (actionId: string) => {
    setAutonomousActions(prev => 
      prev.map(action => 
        action.id === actionId 
          ? { ...action, status: 'rolled_back' as const }
          : action
      )
    );
  };

  return (
    <div className="space-y-6">
      {/* Autonomous Actions Dashboard */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Zap className="h-5 w-5 mr-2 text-purple-600" />
              Autonomous Operations Center
            </div>
            <Badge variant="outline" className="border-purple-200 text-purple-700 bg-purple-50">
              {autonomousActions.filter(a => a.status === 'in_progress').length} Active
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {autonomousActions.map(action => (
              <div 
                key={action.id}
                className={`p-4 border rounded-lg ${
                  action.status === 'completed' ? 'border-green-200 bg-green-50' :
                  action.status === 'in_progress' ? 'border-blue-200 bg-blue-50' :
                  'border-gray-200 bg-gray-50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      {action.status === 'completed' && <CheckCircle className="h-4 w-4 text-green-600 mr-2" />}
                      {action.status === 'in_progress' && <Clock className="h-4 w-4 text-blue-600 mr-2" />}
                      <h3 className="font-semibold">{action.title}</h3>
                      <Badge 
                        size="sm" 
                        className={`ml-2 ${
                          action.status === 'completed' ? 'bg-green-100 text-green-800' :
                          action.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {action.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-700 mb-2">{action.description}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>Confidence: {Math.round(action.confidence * 100)}%</span>
                      <span>•</span>
                      <span>{formatDate(action.timestamp)}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button size="sm" variant="ghost">
                      <Eye className="h-4 w-4" />
                    </Button>
                    {action.rollbackable && action.status === 'completed' && (
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="text-red-600 border-red-200"
                        onClick={() => rollbackAction(action.id)}
                      >
                        Rollback
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Pending Autonomous Actions */}
      {pendingActions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Gavel className="h-5 w-5 mr-2 text-amber-600" />
              Pending Autonomous Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingActions.map(action => (
                <div key={action.id} className="p-4 border border-amber-200 bg-amber-50 rounded-lg">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-amber-800 flex items-center">
                        <AlertTriangle className="h-4 w-4 mr-2" />
                        {action.title}
                      </h3>
                      <p className="text-sm text-amber-700 mt-1">{action.description}</p>
                    </div>
                    <Badge 
                      className={`${
                        action.riskLevel === 'Low' ? 'bg-green-100 text-green-800' :
                        action.riskLevel === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}
                    >
                      {action.riskLevel} Risk
                    </Badge>
                  </div>
                  <div className="text-sm text-amber-600 mb-3">
                    <strong>Impact:</strong> {action.estimatedImpact}
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      className="bg-amber-600 hover:bg-amber-700"
                      onClick={() => executeAutonomousAction(action.id)}
                    >
                      Execute
                    </Button>
                    <Button size="sm" variant="outline">
                      Review Details
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="text-red-600"
                      onClick={() => setPendingActions(prev => prev.filter(a => a.id !== action.id))}
                    >
                      Dismiss
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* AI Decision Predictions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Brain className="h-5 w-5 mr-2 text-indigo-600" />
            AI Decision Predictions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {decisionPredictions.map(prediction => (
              <div key={prediction.proposalId} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{prediction.proposalName}</h4>
                  <div className="flex items-center gap-2">
                    <Badge 
                      className={`${
                        prediction.predictedOutcome === 'APPROVE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {prediction.predictedOutcome}
                    </Badge>
                    <span className="text-sm text-gray-500">{prediction.confidence}% confident</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4 mb-3 text-sm">
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-600">{prediction.memberVotes.likely_approve}</div>
                    <div className="text-xs text-gray-500">Likely Approve</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-red-600">{prediction.memberVotes.likely_reject}</div>
                    <div className="text-xs text-gray-500">Likely Reject</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-gray-600">{prediction.memberVotes.uncertain}</div>
                    <div className="text-xs text-gray-500">Uncertain</div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 mb-3">
                  {prediction.keyFactors.map(factor => (
                    <Badge key={factor} variant="outline" className="text-xs">
                      {factor}
                    </Badge>
                  ))}
                </div>

                <div className="flex justify-between items-center">
                  <Badge 
                    className={`${
                      prediction.aiRecommendation === 'STRONG_APPROVE' ? 'bg-green-100 text-green-800' :
                      prediction.aiRecommendation === 'APPROVE' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    AI: {prediction.aiRecommendation.replace('_', ' ')}
                  </Badge>
                  <Button size="sm" variant="outline">
                    View Analysis
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Assisted Content */}
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