import { NextRequest, NextResponse } from 'next/server';
import type { 
  InvestmentCommittee,
  ICMember,
  ICMeeting,
  ICProposal,
  ICVote,
  ICDecision,
  ICActionItem,
  CommitteeType,
  MemberRole,
  MemberStatus,
  MeetingType,
  MeetingFormat,
  MeetingStatus,
  ProposalType,
  ProposalStatus,
  Priority,
  VotingStatus,
  VoteType,
  DecisionOutcome,
  DDStatus
} from '@/types/investment-committee';

// Mock Investment Committees
const mockCommittees: InvestmentCommittee[] = [
  {
    id: 'ic-1',
    name: 'Main Investment Committee',
    description: 'Primary investment decision committee for all new investments and major decisions',
    committeeType: CommitteeType.MAIN,
    isActive: true,
    quorumRequirement: 5,
    majorityThreshold: 0.6,
    superMajorityThreshold: 0.75,
    maxInvestmentAmount: 100000000,
    cumulativeLimit: 500000000,
    requiresUnanimity: false,
    chairPersonId: 'user-1',
    secretaryId: 'user-2',
    createdAt: new Date('2020-01-01'),
    updatedAt: new Date('2024-03-20')
  },
  {
    id: 'ic-2',
    name: 'Follow-On Investment Committee',
    description: 'Specialized committee for follow-on investments and portfolio company decisions',
    committeeType: CommitteeType.FOLLOW_ON,
    isActive: true,
    quorumRequirement: 3,
    majorityThreshold: 0.5,
    maxInvestmentAmount: 50000000,
    requiresUnanimity: false,
    chairPersonId: 'user-3',
    createdAt: new Date('2021-06-01'),
    updatedAt: new Date('2024-03-18')
  }
];

// Mock IC Members
const mockMembers: ICMember[] = [
  {
    id: 'member-1',
    committeeId: 'ic-1',
    userId: 'user-1',
    memberName: 'Sarah Johnson',
    memberTitle: 'Managing Partner',
    memberEmail: 'sarah.johnson@firm.com',
    role: MemberRole.CHAIR,
    status: MemberStatus.ACTIVE,
    votingRights: true,
    appointmentDate: new Date('2020-01-01'),
    isVotingMember: true,
    meetingsAttended: 48,
    meetingsEligible: 52,
    attendanceRate: 92.3,
    createdAt: new Date('2020-01-01'),
    updatedAt: new Date('2024-03-20')
  },
  {
    id: 'member-2',
    committeeId: 'ic-1',
    userId: 'user-2',
    memberName: 'Michael Chen',
    memberTitle: 'Partner',
    memberEmail: 'michael.chen@firm.com',
    role: MemberRole.MEMBER,
    status: MemberStatus.ACTIVE,
    votingRights: true,
    appointmentDate: new Date('2020-06-01'),
    isVotingMember: true,
    meetingsAttended: 45,
    meetingsEligible: 48,
    attendanceRate: 93.8,
    createdAt: new Date('2020-06-01'),
    updatedAt: new Date('2024-03-18')
  },
  {
    id: 'member-3',
    committeeId: 'ic-1',
    memberName: 'Emily Rodriguez',
    memberTitle: 'Principal',
    memberEmail: 'emily.rodriguez@firm.com',
    role: MemberRole.MEMBER,
    status: MemberStatus.ACTIVE,
    votingRights: true,
    appointmentDate: new Date('2021-01-01'),
    isVotingMember: true,
    meetingsAttended: 38,
    meetingsEligible: 40,
    attendanceRate: 95.0,
    createdAt: new Date('2021-01-01'),
    updatedAt: new Date('2024-03-15')
  }
];

// Mock IC Meetings
const mockMeetings: ICMeeting[] = [
  {
    id: 'meeting-1',
    committeeId: 'ic-1',
    meetingNumber: 24,
    meetingDate: new Date('2024-04-15'),
    meetingTime: '10:00 AM EST',
    duration: 180,
    meetingType: MeetingType.REGULAR,
    format: MeetingFormat.HYBRID,
    location: 'Conference Room A / Zoom',
    meetingLink: 'https://zoom.us/j/123456789',
    status: MeetingStatus.SCHEDULED,
    quorumMet: false,
    attendanceCount: 0,
    decisionsCount: 0,
    approvalsCount: 0,
    rejectionsCount: 0,
    deferredCount: 0,
    chairPersonId: 'user-1',
    secretaryId: 'user-2',
    preparedBy: 'user-2',
    materialsDeadline: new Date('2024-04-12'),
    rsvpDeadline: new Date('2024-04-13'),
    createdAt: new Date('2024-03-20'),
    updatedAt: new Date('2024-03-20')
  },
  {
    id: 'meeting-2',
    committeeId: 'ic-1',
    meetingNumber: 23,
    meetingDate: new Date('2024-03-18'),
    meetingTime: '10:00 AM EST',
    duration: 195,
    meetingType: MeetingType.REGULAR,
    format: MeetingFormat.HYBRID,
    location: 'Conference Room A / Zoom',
    status: MeetingStatus.COMPLETED,
    quorumMet: true,
    attendanceCount: 6,
    decisionsCount: 3,
    approvalsCount: 2,
    rejectionsCount: 1,
    deferredCount: 0,
    chairPersonId: 'user-1',
    secretaryId: 'user-2',
    minutes: 'Meeting minutes completed and distributed to all members.',
    createdAt: new Date('2024-02-20'),
    updatedAt: new Date('2024-03-19')
  }
];

// Mock IC Proposals
const mockProposals: ICProposal[] = [
  {
    id: 'proposal-1',
    meetingId: 'meeting-1',
    proposalNumber: 'IC-2024-008',
    proposalTitle: 'TechCorp Series B Investment',
    targetCompany: 'TechCorp Solutions',
    sector: 'Technology',
    geography: 'North America',
    proposalType: ProposalType.NEW_INVESTMENT,
    requestedAmount: 25000000,
    totalDealSize: 50000000,
    proposedValuation: 200000000,
    ownershipPercentage: 12.5,
    investmentType: 'Preferred Equity',
    securityType: 'Series B Preferred',
    liquidationPreference: '1x Non-Participating',
    boardSeats: 1,
    investmentThesis: 'Leading AI-powered enterprise software with strong market traction and experienced management team',
    keyRisks: [
      { category: 'MARKET', risk: 'Competitive market with established players', severity: 'MEDIUM', mitigation: 'Strong differentiation and patent portfolio' },
      { category: 'FINANCIAL', risk: 'Cash flow timing', severity: 'LOW', mitigation: 'Strong balance sheet and funding runway' }
    ],
    exitStrategy: 'Strategic acquisition or IPO in 4-5 years',
    expectedHoldingPeriod: 5,
    projectedIRR: 28.5,
    projectedMOIC: 3.2,
    baseCase: {
      year1Revenue: 15000000,
      year2Revenue: 25000000,
      year3Revenue: 40000000,
      year4Revenue: 65000000,
      year5Revenue: 100000000,
      terminalValue: 400000000,
      projectedIRR: 28.5,
      projectedMOIC: 3.2,
      assumptions: ['20% annual revenue growth', 'Margin expansion to 25%', 'Market multiple of 4x revenue']
    },
    ddStatus: DDStatus.COMPLETED,
    ddFindings: [
      { category: 'Financial', finding: 'Strong unit economics', severity: 'LOW', impact: 'Positive', recommendation: 'Proceed' },
      { category: 'Commercial', finding: 'High customer satisfaction', severity: 'LOW', impact: 'Positive', recommendation: 'Proceed' }
    ],
    ddRecommendation: 'Proceed with investment as proposed',
    status: ProposalStatus.SUBMITTED,
    priority: Priority.HIGH,
    presentingPartner: 'Michael Chen',
    presentationDuration: 45,
    votingStatus: VotingStatus.PENDING,
    votingDeadline: new Date('2024-04-20'),
    followUpRequired: false,
    aiRiskScore: 6.2,
    aiRecommendation: 'PROCEED_WITH_CONDITIONS',
    submittedBy: 'user-2',
    submittedAt: new Date('2024-04-01'),
    lastReviewed: new Date('2024-04-10'),
    reviewedBy: 'user-1',
    createdAt: new Date('2024-04-01'),
    updatedAt: new Date('2024-04-10')
  },
  {
    id: 'proposal-2',
    meetingId: 'meeting-2',
    proposalNumber: 'IC-2024-007',
    proposalTitle: 'GreenTech Follow-On Investment',
    targetCompany: 'GreenTech Innovations',
    sector: 'Clean Technology',
    geography: 'Europe',
    proposalType: ProposalType.FOLLOW_ON,
    requestedAmount: 15000000,
    totalDealSize: 30000000,
    proposedValuation: 150000000,
    ownershipPercentage: 10.0,
    investmentType: 'Convertible Note',
    expectedHoldingPeriod: 3,
    projectedIRR: 22.1,
    projectedMOIC: 2.1,
    ddStatus: DDStatus.IN_PROGRESS,
    status: ProposalStatus.APPROVED,
    priority: Priority.NORMAL,
    presentingPartner: 'Emily Rodriguez',
    presentationDuration: 30,
    votingStatus: VotingStatus.COMPLETED,
    decisionDate: new Date('2024-03-18'),
    decisionRationale: 'Strong follow-on opportunity with existing portfolio company showing good traction',
    followUpRequired: true,
    followUpDate: new Date('2024-04-15'),
    submittedBy: 'user-3',
    submittedAt: new Date('2024-03-01'),
    createdAt: new Date('2024-03-01'),
    updatedAt: new Date('2024-03-18')
  },
  {
    id: 'proposal-3',
    meetingId: 'meeting-2',
    proposalNumber: 'IC-2024-006',
    proposalTitle: 'FinServ Exit Strategy',
    targetCompany: 'FinServ Disruptor',
    sector: 'Financial Services',
    geography: 'Asia Pacific',
    proposalType: ProposalType.EXIT,
    requestedAmount: 0,
    totalDealSize: 85000000,
    ownershipPercentage: 15.0,
    exitStrategy: 'Strategic sale to major bank',
    projectedIRR: 24.8,
    projectedMOIC: 2.8,
    status: ProposalStatus.REJECTED,
    priority: Priority.NORMAL,
    presentingPartner: 'Sarah Johnson',
    votingStatus: VotingStatus.COMPLETED,
    decisionDate: new Date('2024-03-18'),
    decisionRationale: 'Valuation below committee expectations, recommend holding for better exit opportunity',
    submittedBy: 'user-1',
    submittedAt: new Date('2024-02-15'),
    createdAt: new Date('2024-02-15'),
    updatedAt: new Date('2024-03-18')
  }
];

// Mock IC Votes
const mockVotes: ICVote[] = [
  {
    id: 'vote-1',
    proposalId: 'proposal-2',
    memberId: 'member-1',
    vote: VoteType.APPROVE,
    voteCast: new Date('2024-03-18'),
    comments: 'Strong follow-on opportunity with good market traction',
    conflictDeclared: false,
    recusal: false,
    voteWeight: 1.0,
    isBindingVote: true,
    voteMethod: 'IN_MEETING',
    createdAt: new Date('2024-03-18'),
    updatedAt: new Date('2024-03-18')
  },
  {
    id: 'vote-2',
    proposalId: 'proposal-2',
    memberId: 'member-2',
    vote: VoteType.APPROVE,
    voteCast: new Date('2024-03-18'),
    comments: 'Agree with the strategic rationale',
    conflictDeclared: false,
    recusal: false,
    voteWeight: 1.0,
    isBindingVote: true,
    voteMethod: 'IN_MEETING',
    createdAt: new Date('2024-03-18'),
    updatedAt: new Date('2024-03-18')
  },
  {
    id: 'vote-3',
    proposalId: 'proposal-3',
    memberId: 'member-1',
    vote: VoteType.REJECT,
    voteCast: new Date('2024-03-18'),
    comments: 'Valuation is below our minimum return threshold',
    conflictDeclared: false,
    recusal: false,
    voteWeight: 1.0,
    isBindingVote: true,
    voteMethod: 'IN_MEETING',
    createdAt: new Date('2024-03-18'),
    updatedAt: new Date('2024-03-18')
  }
];

// Mock IC Decisions
const mockDecisions: ICDecision[] = [
  {
    id: 'decision-1',
    proposalId: 'proposal-2',
    decision: DecisionOutcome.APPROVED,
    decisionDate: new Date('2024-03-18'),
    totalVotes: 6,
    approvingVotes: 5,
    rejectingVotes: 1,
    abstentions: 0,
    recusals: 0,
    approvalPercentage: 83.3,
    quorumMet: true,
    majorityAchieved: true,
    unanimousDecision: false,
    decisionSummary: 'Committee approved the follow-on investment with conditions',
    approvalConditions: [
      { condition: 'Complete commercial due diligence', category: 'OPERATIONAL', deadline: new Date('2024-04-15'), responsibleParty: 'Emily Rodriguez', status: 'PENDING' }
    ],
    implementationStatus: 'PENDING',
    implementationDeadline: new Date('2024-05-01'),
    responsibleParty: 'Emily Rodriguez',
    legalReview: false,
    complianceSign: false,
    regulatoryNotification: false,
    disclosureRequired: false,
    createdAt: new Date('2024-03-18'),
    updatedAt: new Date('2024-03-18')
  },
  {
    id: 'decision-2',
    proposalId: 'proposal-3',
    decision: DecisionOutcome.REJECTED,
    decisionDate: new Date('2024-03-18'),
    totalVotes: 6,
    approvingVotes: 1,
    rejectingVotes: 4,
    abstentions: 1,
    recusals: 0,
    approvalPercentage: 16.7,
    quorumMet: true,
    majorityAchieved: false,
    unanimousDecision: false,
    decisionSummary: 'Committee rejected the exit proposal due to insufficient valuation',
    implementationStatus: 'COMPLETED',
    legalReview: true,
    complianceSign: true,
    regulatoryNotification: false,
    disclosureRequired: false,
    createdAt: new Date('2024-03-18'),
    updatedAt: new Date('2024-03-18')
  }
];

// Mock Action Items
const mockActionItems: ICActionItem[] = [
  {
    id: 'action-1',
    meetingId: 'meeting-1',
    proposalId: 'proposal-1',
    title: 'Complete technical due diligence for TechCorp',
    description: 'Engage external technical consultant to review TechCorp\'s technology stack and IP',
    category: 'DD_FOLLOWUP',
    assignedTo: 'Michael Chen',
    assignedBy: 'Sarah Johnson',
    assignedDate: new Date('2024-04-01'),
    dueDate: new Date('2024-04-20'),
    priority: Priority.HIGH,
    status: 'IN_PROGRESS',
    reminderSent: false,
    escalationLevel: 0,
    createdAt: new Date('2024-04-01'),
    updatedAt: new Date('2024-04-10')
  }
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');
  const committeeId = searchParams.get('committeeId');
  const meetingId = searchParams.get('meetingId');
  const proposalId = searchParams.get('proposalId');

  try {
    switch (type) {
      case 'overview':
        return NextResponse.json({
          success: true,
          data: {
            committees: mockCommittees,
            meetings: mockMeetings,
            proposals: mockProposals,
            summary: {
              totalCommittees: mockCommittees.length,
              totalMeetings: mockMeetings.length,
              totalProposals: mockProposals.length,
              pendingDecisions: mockProposals.filter(p => p.status === 'SUBMITTED' || p.status === 'UNDER_REVIEW').length,
              approvedProposals: mockProposals.filter(p => p.status === 'APPROVED').length,
              totalRequestedAmount: mockProposals.reduce((sum, p) => sum + p.requestedAmount, 0)
            }
          }
        });

      case 'committees':
        const filteredCommittees = committeeId 
          ? mockCommittees.filter(c => c.id === committeeId)
          : mockCommittees;
        return NextResponse.json({ success: true, data: filteredCommittees });

      case 'members':
        const members = committeeId 
          ? mockMembers.filter(m => m.committeeId === committeeId)
          : mockMembers;
        return NextResponse.json({ success: true, data: members });

      case 'meetings':
        let meetings = mockMeetings;
        if (committeeId) meetings = meetings.filter(m => m.committeeId === committeeId);
        if (meetingId) meetings = meetings.filter(m => m.id === meetingId);
        return NextResponse.json({ success: true, data: meetings });

      case 'proposals':
        let proposals = mockProposals;
        if (meetingId) proposals = proposals.filter(p => p.meetingId === meetingId);
        if (proposalId) proposals = proposals.filter(p => p.id === proposalId);
        return NextResponse.json({ success: true, data: proposals });

      case 'votes':
        const votes = proposalId 
          ? mockVotes.filter(v => v.proposalId === proposalId)
          : mockVotes;
        return NextResponse.json({ success: true, data: votes });

      case 'decisions':
        const decisions = proposalId 
          ? mockDecisions.filter(d => d.proposalId === proposalId)
          : mockDecisions;
        return NextResponse.json({ success: true, data: decisions });

      case 'action-items':
        let actionItems = mockActionItems;
        if (meetingId) actionItems = actionItems.filter(a => a.meetingId === meetingId);
        if (proposalId) actionItems = actionItems.filter(a => a.proposalId === proposalId);
        return NextResponse.json({ success: true, data: actionItems });

      case 'committee-analytics':
        const committee = mockCommittees.find(c => c.id === committeeId);
        if (!committee) {
          return NextResponse.json({ success: false, error: 'Committee not found' }, { status: 404 });
        }
        
        const committeeProposals = mockProposals.filter(p => 
          mockMeetings.some(m => m.id === p.meetingId && m.committeeId === committeeId)
        );
        
        const committeeMeetings = mockMeetings.filter(m => m.committeeId === committeeId);
        
        return NextResponse.json({
          success: true,
          data: {
            committeeId,
            totalProposals: committeeProposals.length,
            approvedProposals: committeeProposals.filter(p => p.status === 'APPROVED').length,
            rejectedProposals: committeeProposals.filter(p => p.status === 'REJECTED').length,
            pendingProposals: committeeProposals.filter(p => p.status === 'SUBMITTED' || p.status === 'UNDER_REVIEW').length,
            totalMeetings: committeeMeetings.length,
            completedMeetings: committeeMeetings.filter(m => m.status === 'COMPLETED').length,
            avgMeetingDuration: committeeMeetings.reduce((sum, m) => sum + (m.duration || 0), 0) / committeeMeetings.length,
            totalRequestedAmount: committeeProposals.reduce((sum, p) => sum + p.requestedAmount, 0),
            approvedAmount: committeeProposals.filter(p => p.status === 'APPROVED').reduce((sum, p) => sum + p.requestedAmount, 0),
            proposalsByType: {
              NEW_INVESTMENT: committeeProposals.filter(p => p.proposalType === 'NEW_INVESTMENT').length,
              FOLLOW_ON: committeeProposals.filter(p => p.proposalType === 'FOLLOW_ON').length,
              EXIT: committeeProposals.filter(p => p.proposalType === 'EXIT').length
            },
            proposalsBySector: committeeProposals.reduce((acc, p) => {
              acc[p.sector] = (acc[p.sector] || 0) + 1;
              return acc;
            }, {} as Record<string, number>)
          }
        });

      case 'voting-analytics':
        if (!proposalId) {
          return NextResponse.json({ success: false, error: 'Proposal ID required' }, { status: 400 });
        }
        
        const proposalVotes = mockVotes.filter(v => v.proposalId === proposalId);
        const totalVotes = proposalVotes.length;
        const approveVotes = proposalVotes.filter(v => v.vote === 'APPROVE').length;
        const rejectVotes = proposalVotes.filter(v => v.vote === 'REJECT').length;
        const abstainVotes = proposalVotes.filter(v => v.vote === 'ABSTAIN').length;
        
        return NextResponse.json({
          success: true,
          data: {
            proposalId,
            totalVotes,
            voteBreakdown: {
              approve: approveVotes,
              reject: rejectVotes,
              abstain: abstainVotes
            },
            approvalPercentage: totalVotes > 0 ? (approveVotes / totalVotes) * 100 : 0,
            votes: proposalVotes
          }
        });

      default:
        return NextResponse.json({
          success: true,
          data: {
            committees: mockCommittees,
            members: mockMembers,
            meetings: mockMeetings,
            proposals: mockProposals,
            votes: mockVotes,
            decisions: mockDecisions,
            actionItems: mockActionItems
          }
        });
    }
  } catch (error) {
    console.error('Investment Committee API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, type, data } = body;

    switch (action) {
      case 'create_proposal':
        return NextResponse.json({
          success: true,
          message: 'Proposal created successfully',
          data: {
            proposalId: `proposal-${Date.now()}`,
            proposalNumber: data.proposalNumber,
            meetingId: data.meetingId,
            status: 'SUBMITTED',
            createdAt: new Date()
          }
        });

      case 'cast_vote':
        return NextResponse.json({
          success: true,
          message: 'Vote cast successfully',
          data: {
            voteId: `vote-${Date.now()}`,
            proposalId: data.proposalId,
            memberId: data.memberId,
            vote: data.vote,
            voteCast: new Date()
          }
        });

      case 'schedule_meeting':
        return NextResponse.json({
          success: true,
          message: 'Meeting scheduled successfully',
          data: {
            meetingId: `meeting-${Date.now()}`,
            committeeId: data.committeeId,
            meetingNumber: data.meetingNumber,
            meetingDate: data.meetingDate,
            status: 'SCHEDULED',
            createdAt: new Date()
          }
        });

      case 'finalize_decision':
        return NextResponse.json({
          success: true,
          message: 'Decision finalized successfully',
          data: {
            decisionId: `decision-${Date.now()}`,
            proposalId: data.proposalId,
            decision: data.decision,
            decisionDate: new Date(),
            implementationStatus: 'PENDING'
          }
        });

      case 'add_member':
        return NextResponse.json({
          success: true,
          message: 'Committee member added successfully',
          data: {
            memberId: `member-${Date.now()}`,
            committeeId: data.committeeId,
            memberName: data.memberName,
            role: data.role,
            status: 'ACTIVE',
            appointmentDate: new Date()
          }
        });

      case 'create_action_item':
        return NextResponse.json({
          success: true,
          message: 'Action item created successfully',
          data: {
            actionItemId: `action-${Date.now()}`,
            title: data.title,
            assignedTo: data.assignedTo,
            dueDate: data.dueDate,
            priority: data.priority,
            status: 'OPEN',
            createdAt: new Date()
          }
        });

      case 'update_proposal_status':
        return NextResponse.json({
          success: true,
          message: 'Proposal status updated successfully',
          data: {
            proposalId: data.proposalId,
            oldStatus: data.oldStatus,
            newStatus: data.newStatus,
            updatedAt: new Date()
          }
        });

      case 'complete_meeting':
        return NextResponse.json({
          success: true,
          message: 'Meeting completed successfully',
          data: {
            meetingId: data.meetingId,
            status: 'COMPLETED',
            attendanceCount: data.attendanceCount,
            decisionsCount: data.decisionsCount,
            completedAt: new Date()
          }
        });

      default:
        return NextResponse.json(
          { success: false, error: 'Unknown action' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Investment Committee POST Error:', error);
    return NextResponse.json(
      { success: false, error: 'Invalid request body' },
      { status: 400 }
    );
  }
}