import { NextRequest, NextResponse } from 'next/server';
import type { 
  LPEntity, 
  LPCommitment, 
  LPCapitalCall, 
  LPDistribution, 
  LPCoInvestment, 
  LPElection,
  LPDocument,
  LPCommunication,
  LPPortfolioPerformance 
} from '@/types/lp-portal';

// Mock data for LP Portal
const mockLPEntities: LPEntity[] = [
  {
    id: 'lp-1',
    name: 'Strategic Capital Partners',
    type: 'pension_fund',
    aum: 15000000000,
    location: 'New York, NY',
    contactEmail: 'partnerships@strategiccap.com',
    status: 'active',
    createdAt: new Date('2020-01-15'),
    updatedAt: new Date('2024-03-15')
  },
  {
    id: 'lp-2',
    name: 'Global Endowment Foundation',
    type: 'endowment',
    aum: 8500000000,
    location: 'Boston, MA',
    contactEmail: 'investments@globalendowment.org',
    status: 'active',
    createdAt: new Date('2019-06-10'),
    updatedAt: new Date('2024-02-28')
  }
];

const mockCommitments: LPCommitment[] = [
  {
    id: 'commitment-1',
    lpEntityId: 'lp-1',
    fundName: 'Growth Equity Fund IV',
    commitmentAmount: 50000000,
    calledAmount: 32500000,
    remainingCommitment: 17500000,
    distributionAmount: 28750000,
    navAmount: 45200000,
    irr: 18.4,
    moic: 1.42,
    dpi: 0.89,
    tvpi: 1.39,
    status: 'active',
    commitmentDate: new Date('2022-03-15'),
    finalClosingDate: new Date('2022-06-30')
  },
  {
    id: 'commitment-2',
    lpEntityId: 'lp-1',
    fundName: 'Private Equity Fund VII',
    commitmentAmount: 75000000,
    calledAmount: 48750000,
    remainingCommitment: 26250000,
    distributionAmount: 35600000,
    navAmount: 62100000,
    irr: 22.1,
    moic: 1.67,
    dpi: 0.73,
    tvpi: 1.33,
    status: 'active',
    commitmentDate: new Date('2021-09-20'),
    finalClosingDate: new Date('2021-12-15')
  }
];

const mockCapitalCalls: LPCapitalCall[] = [
  {
    id: 'call-1',
    commitmentId: 'commitment-1',
    callNumber: 8,
    callAmount: 2500000,
    dueDate: new Date('2024-04-15'),
    status: 'pending',
    purpose: 'New investment - TechCorp acquisition',
    managementFeeAmount: 125000,
    dealExpenseAmount: 75000,
    createdAt: new Date('2024-03-15'),
    responseDeadline: new Date('2024-04-10')
  },
  {
    id: 'call-2',
    commitmentId: 'commitment-2',
    callNumber: 12,
    callAmount: 1800000,
    dueDate: new Date('2024-04-22'),
    status: 'pending',
    purpose: 'Follow-on investment - MedTech expansion',
    managementFeeAmount: 90000,
    dealExpenseAmount: 45000,
    createdAt: new Date('2024-03-18'),
    responseDeadline: new Date('2024-04-17')
  }
];

const mockDistributions: LPDistribution[] = [
  {
    id: 'dist-1',
    commitmentId: 'commitment-1',
    distributionNumber: 15,
    distributionAmount: 3200000,
    distributionDate: new Date('2024-02-28'),
    type: 'realized_gains',
    source: 'Sale of HealthTech portfolio company',
    returnOfCapital: 1200000,
    capitalGains: 2000000,
    taxWithholding: 0,
    createdAt: new Date('2024-02-15')
  },
  {
    id: 'dist-2',
    commitmentId: 'commitment-2',
    distributionNumber: 22,
    distributionAmount: 1850000,
    distributionDate: new Date('2024-01-31'),
    type: 'dividend_income',
    source: 'Dividend from CleanTech holding',
    returnOfCapital: 850000,
    capitalGains: 1000000,
    taxWithholding: 0,
    createdAt: new Date('2024-01-15')
  }
];

const mockCoInvestments: LPCoInvestment[] = [
  {
    id: 'coinvest-1',
    name: 'CleanEnergy Solutions Acquisition',
    description: 'Direct co-investment opportunity in renewable energy infrastructure',
    minimumInvestment: 5000000,
    maximumInvestment: 25000000,
    targetClosingDate: new Date('2024-05-15'),
    status: 'open',
    responseDeadline: new Date('2024-04-30'),
    sector: 'Clean Energy',
    geography: 'North America',
    investmentThesis: 'Growing demand for renewable energy infrastructure with strong regulatory support',
    createdAt: new Date('2024-03-20'),
    invitedLPs: ['lp-1', 'lp-2']
  }
];

const mockElections: LPElection[] = [
  {
    id: 'election-1',
    title: 'Advisory Committee Seat Election',
    description: 'Election for LP representative on the Fund Advisory Committee',
    type: 'advisory_committee',
    status: 'open',
    votingDeadline: new Date('2024-05-01'),
    options: [
      { id: 'candidate-1', label: 'Sarah Johnson (Pension Fund Rep)', description: '15+ years PE experience' },
      { id: 'candidate-2', label: 'Michael Chen (Endowment Rep)', description: '12+ years institutional investing' }
    ],
    eligibleLPs: ['lp-1', 'lp-2'],
    createdAt: new Date('2024-03-25')
  }
];

const mockDocuments: LPDocument[] = [
  {
    id: 'doc-1',
    title: 'Q1 2024 Quarterly Report',
    type: 'quarterly_report',
    category: 'reporting',
    fileUrl: '/documents/q1-2024-report.pdf',
    uploadDate: new Date('2024-04-01'),
    confidentialityLevel: 'confidential',
    fundName: 'Growth Equity Fund IV',
    quarter: 'Q1',
    year: 2024
  },
  {
    id: 'doc-2',
    title: 'Annual Meeting Presentation 2024',
    type: 'presentation',
    category: 'meetings',
    fileUrl: '/documents/annual-meeting-2024.pdf',
    uploadDate: new Date('2024-03-15'),
    confidentialityLevel: 'confidential',
    fundName: 'Private Equity Fund VII',
    description: 'Strategy update and portfolio review'
  }
];

const mockCommunications: LPCommunication[] = [
  {
    id: 'comm-1',
    subject: 'Capital Call Notice - Growth Equity Fund IV',
    type: 'capital_call',
    priority: 'high',
    status: 'sent',
    sentDate: new Date('2024-03-15'),
    fundName: 'Growth Equity Fund IV',
    recipientLPs: ['lp-1'],
    content: 'Please review the attached capital call notice for $2.5M due April 15, 2024.'
  },
  {
    id: 'comm-2',
    subject: 'Co-Investment Opportunity - CleanEnergy Solutions',
    type: 'co_investment',
    priority: 'medium',
    status: 'sent',
    sentDate: new Date('2024-03-20'),
    recipientLPs: ['lp-1', 'lp-2'],
    content: 'Exclusive co-investment opportunity in renewable energy infrastructure.'
  }
];

const mockPortfolioPerformance: LPPortfolioPerformance = {
  totalCommitments: 125000000,
  totalCalled: 81250000,
  totalDistributions: 64350000,
  currentNav: 107300000,
  overallIrr: 20.1,
  overallMoic: 1.54,
  overallDpi: 0.79,
  overallTvpi: 1.32,
  numberOfFunds: 2,
  vintage: '2021-2022',
  lastUpdated: new Date('2024-03-31')
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');
  const lpId = searchParams.get('lpId');

  try {
    switch (type) {
      case 'entities':
        return NextResponse.json({ success: true, data: mockLPEntities });
      
      case 'commitments':
        const commitments = lpId 
          ? mockCommitments.filter(c => c.lpEntityId === lpId)
          : mockCommitments;
        return NextResponse.json({ success: true, data: commitments });
      
      case 'capital-calls':
        return NextResponse.json({ success: true, data: mockCapitalCalls });
      
      case 'distributions':
        return NextResponse.json({ success: true, data: mockDistributions });
      
      case 'co-investments':
        return NextResponse.json({ success: true, data: mockCoInvestments });
      
      case 'elections':
        return NextResponse.json({ success: true, data: mockElections });
      
      case 'documents':
        return NextResponse.json({ success: true, data: mockDocuments });
      
      case 'communications':
        return NextResponse.json({ success: true, data: mockCommunications });
      
      case 'performance':
        return NextResponse.json({ success: true, data: mockPortfolioPerformance });
      
      default:
        return NextResponse.json({
          success: true,
          data: {
            entities: mockLPEntities,
            commitments: mockCommitments,
            capitalCalls: mockCapitalCalls,
            distributions: mockDistributions,
            coInvestments: mockCoInvestments,
            elections: mockElections,
            documents: mockDocuments,
            communications: mockCommunications,
            performance: mockPortfolioPerformance
          }
        });
    }
  } catch (error) {
    console.error('LP Portal API Error:', error);
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
      case 'respond_capital_call':
        // Mock response to capital call
        return NextResponse.json({
          success: true,
          message: 'Capital call response recorded',
          data: { callId: data.callId, response: data.response }
        });
      
      case 'submit_co_investment':
        // Mock co-investment submission
        return NextResponse.json({
          success: true,
          message: 'Co-investment submission recorded',
          data: { 
            coInvestmentId: data.coInvestmentId, 
            amount: data.amount,
            submittedAt: new Date()
          }
        });
      
      case 'cast_vote':
        // Mock election vote
        return NextResponse.json({
          success: true,
          message: 'Vote recorded successfully',
          data: { 
            electionId: data.electionId, 
            selectedOption: data.selectedOption,
            votedAt: new Date()
          }
        });
      
      case 'update_contact':
        // Mock contact information update
        return NextResponse.json({
          success: true,
          message: 'Contact information updated',
          data: { lpId: data.lpId, updatedFields: data.fields }
        });
      
      default:
        return NextResponse.json(
          { success: false, error: 'Unknown action' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('LP Portal POST Error:', error);
    return NextResponse.json(
      { success: false, error: 'Invalid request body' },
      { status: 400 }
    );
  }
}