import { NextRequest, NextResponse } from 'next/server';
import type { 
  Fund,
  FundCommitment,
  FundCapitalCall,
  FundDistribution,
  FundExpense,
  NAVReport,
  FundUpdate,
  FundType,
  FundStatus,
  InvestorType,
  CapitalCallPurpose,
  CapitalCallStatus,
  DistributionSourceType,
  ExpenseCategory,
  ExpenseType,
  ExpenseStatus,
  NAVReportType,
  NAVReportStatus
} from '@/types/fund-operations';

// Mock Fund Data
const mockFunds: Fund[] = [
  {
    id: 'fund-1',
    name: 'Growth Equity Fund IV',
    fundNumber: 'Fund IV',
    fundType: FundType.GROWTH_EQUITY,
    strategy: 'Growth equity investments in technology and healthcare companies',
    targetSize: 500000000,
    hardCap: 600000000,
    minimumSize: 400000000,
    managementFee: 2.0,
    carriedInterest: 20.0,
    hurdleRate: 8.0,
    status: FundStatus.INVESTING,
    vintage: 2022,
    fundLife: 10,
    investmentPeriod: 5,
    totalCommitments: 485000000,
    totalCalled: 195000000,
    totalInvested: 175000000,
    totalDistributed: 85000000,
    currentNAV: 275000000,
    firstCloseDate: new Date('2022-06-30'),
    finalCloseDate: new Date('2022-12-15'),
    investmentPeriodEnd: new Date('2027-06-30'),
    fundMaturityDate: new Date('2032-06-30'),
    grossIRR: 22.4,
    netIRR: 18.7,
    grossMOIC: 1.42,
    netMOIC: 1.28,
    dpi: 0.44,
    rvpi: 1.41,
    tvpi: 1.85,
    totalManagementFees: 19400000,
    totalCarriedInterest: 8500000,
    totalExpenses: 3200000,
    domicile: 'Delaware, USA',
    regulatoryStatus: 'SEC Registered',
    auditFirm: 'PwC',
    administrator: 'State Street',
    createdBy: 'fund-manager-1',
    createdAt: new Date('2022-01-15'),
    updatedAt: new Date('2024-03-20')
  },
  {
    id: 'fund-2',
    name: 'Buyout Fund III',
    fundNumber: 'Fund III',
    fundType: FundType.BUYOUT,
    strategy: 'Middle-market buyout investments across diversified sectors',
    targetSize: 750000000,
    hardCap: 850000000,
    minimumSize: 600000000,
    managementFee: 2.0,
    carriedInterest: 20.0,
    hurdleRate: 8.0,
    status: FundStatus.HARVESTING,
    vintage: 2019,
    fundLife: 10,
    investmentPeriod: 5,
    totalCommitments: 725000000,
    totalCalled: 580000000,
    totalInvested: 565000000,
    totalDistributed: 425000000,
    currentNAV: 685000000,
    firstCloseDate: new Date('2019-03-31'),
    finalCloseDate: new Date('2019-09-30'),
    investmentPeriodEnd: new Date('2024-03-31'),
    fundMaturityDate: new Date('2029-03-31'),
    grossIRR: 28.5,
    netIRR: 24.2,
    grossMOIC: 1.89,
    netMOIC: 1.72,
    dpi: 0.73,
    rvpi: 1.18,
    tvpi: 1.91,
    totalManagementFees: 87000000,
    totalCarriedInterest: 42500000,
    totalExpenses: 12800000,
    domicile: 'Delaware, USA',
    regulatoryStatus: 'SEC Registered',
    auditFirm: 'KPMG',
    administrator: 'BNY Mellon',
    createdBy: 'fund-manager-2',
    createdAt: new Date('2019-01-10'),
    updatedAt: new Date('2024-03-18')
  }
];

// Mock Fund Commitments
const mockCommitments: FundCommitment[] = [
  {
    id: 'commitment-1',
    fundId: 'fund-1',
    investorName: 'Strategic Capital Partners',
    investorType: InvestorType.LP_ENTITY,
    investorId: 'lp-1',
    commitmentAmount: 50000000,
    currency: 'USD',
    commitmentDate: new Date('2022-06-30'),
    managementFeeRate: 2.0,
    carriedInterestRate: 20.0,
    preferredReturn: 8.0,
    status: 'ACTIVE',
    calledAmount: 20000000,
    distributedAmount: 8500000,
    currentNAV: 27500000,
    keyPersonClause: true,
    noFaultClause: false,
    mostFavoredNation: true,
    createdAt: new Date('2022-06-30'),
    updatedAt: new Date('2024-03-20')
  },
  {
    id: 'commitment-2',
    fundId: 'fund-1',
    investorName: 'Global Endowment Foundation',
    investorType: InvestorType.LP_ENTITY,
    investorId: 'lp-2',
    commitmentAmount: 40000000,
    currency: 'USD',
    commitmentDate: new Date('2022-12-15'),
    status: 'ACTIVE',
    calledAmount: 16000000,
    distributedAmount: 6800000,
    currentNAV: 22000000,
    keyPersonClause: true,
    noFaultClause: false,
    mostFavoredNation: false,
    createdAt: new Date('2022-12-15'),
    updatedAt: new Date('2024-03-18')
  }
];

// Mock Capital Calls
const mockCapitalCalls: FundCapitalCall[] = [
  {
    id: 'call-1',
    fundId: 'fund-1',
    callNumber: 8,
    callDate: new Date('2024-03-01'),
    dueDate: new Date('2024-04-15'),
    totalCallAmount: 25000000,
    currency: 'USD',
    purpose: CapitalCallPurpose.INVESTMENT,
    description: 'Capital call for TechCorp acquisition and management fees',
    targetInvestment: 'TechCorp Solutions',
    investmentAmount: 22000000,
    managementFeeAmount: 2500000,
    expenseAmount: 500000,
    status: CapitalCallStatus.ISSUED,
    issuedDate: new Date('2024-03-01'),
    acknowledgmentDeadline: new Date('2024-04-08'),
    totalAcknowledged: 22000000,
    totalFunded: 18500000,
    totalOutstanding: 6500000,
    aiRiskScore: 0.15,
    automatedReminders: true,
    createdAt: new Date('2024-03-01'),
    updatedAt: new Date('2024-03-20')
  },
  {
    id: 'call-2',
    fundId: 'fund-1',
    callNumber: 7,
    callDate: new Date('2024-01-01'),
    dueDate: new Date('2024-01-15'),
    totalCallAmount: 30000000,
    currency: 'USD',
    purpose: CapitalCallPurpose.INVESTMENT,
    description: 'Capital call for HealthTech investment',
    targetInvestment: 'HealthTech Innovations',
    investmentAmount: 28000000,
    managementFeeAmount: 1500000,
    expenseAmount: 500000,
    status: CapitalCallStatus.FUNDED,
    issuedDate: new Date('2024-01-01'),
    totalFunded: 30000000,
    totalOutstanding: 0,
    automatedReminders: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-20')
  }
];

// Mock Distributions
const mockDistributions: FundDistribution[] = [
  {
    id: 'dist-1',
    fundId: 'fund-1',
    distributionNumber: 15,
    distributionDate: new Date('2024-03-18'),
    totalDistributionAmount: 45000000,
    currency: 'USD',
    sourceType: DistributionSourceType.REALIZATION,
    sourceDescription: 'Exit proceeds from TechCorp sale',
    returnOfCapital: 18000000,
    capitalGains: 25000000,
    dividendIncome: 2000000,
    interestIncome: 0,
    carriedInterest: 5000000,
    totalTaxableAmount: 27000000,
    witholdingTax: 1350000,
    taxReportingStatus: 'COMPLETED',
    status: 'PAID',
    paymentDate: new Date('2024-03-25'),
    recordDate: new Date('2024-03-15'),
    createdAt: new Date('2024-03-18'),
    updatedAt: new Date('2024-03-25')
  },
  {
    id: 'dist-2',
    fundId: 'fund-2',
    distributionNumber: 22,
    distributionDate: new Date('2024-01-20'),
    totalDistributionAmount: 35000000,
    currency: 'USD',
    sourceType: DistributionSourceType.DIVIDEND,
    sourceDescription: 'Quarterly dividend from portfolio companies',
    returnOfCapital: 15000000,
    capitalGains: 18000000,
    dividendIncome: 2000000,
    totalTaxableAmount: 20000000,
    witholdingTax: 1000000,
    taxReportingStatus: 'COMPLETED',
    status: 'PAID',
    paymentDate: new Date('2024-01-27'),
    recordDate: new Date('2024-01-15'),
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-27')
  }
];

// Mock Expenses
const mockExpenses: FundExpense[] = [
  {
    id: 'expense-1',
    fundId: 'fund-1',
    expenseDate: new Date('2024-03-15'),
    description: 'Legal fees for TechCorp acquisition',
    amount: 125000,
    currency: 'USD',
    category: ExpenseCategory.LEGAL,
    subcategory: 'M&A Legal',
    expenseType: ExpenseType.DEAL_EXPENSE,
    vendorName: 'BigLaw LLP',
    vendorType: 'LAW_FIRM',
    invoiceNumber: 'INV-2024-0315',
    invoiceDate: new Date('2024-03-10'),
    status: ExpenseStatus.APPROVED,
    approvedBy: 'fund-manager-1',
    approvedDate: new Date('2024-03-15'),
    allocationType: 'DEAL_RELATED',
    allocationNotes: 'Allocated to TechCorp acquisition',
    receiptAttached: true,
    budgetCategory: 'Deal Expenses',
    budgetYear: 2024,
    createdAt: new Date('2024-03-10'),
    updatedAt: new Date('2024-03-15')
  },
  {
    id: 'expense-2',
    fundId: 'fund-1',
    expenseDate: new Date('2024-02-28'),
    description: 'Annual audit fees',
    amount: 85000,
    currency: 'USD',
    category: ExpenseCategory.AUDIT,
    expenseType: ExpenseType.FUND_EXPENSE,
    vendorName: 'PwC',
    vendorType: 'AUDITOR',
    invoiceNumber: 'PWC-2024-001',
    invoiceDate: new Date('2024-02-25'),
    status: ExpenseStatus.PAID,
    approvedBy: 'fund-manager-1',
    approvedDate: new Date('2024-02-28'),
    paidDate: new Date('2024-03-05'),
    allocationType: 'PRO_RATA',
    receiptAttached: true,
    budgetCategory: 'Operating Expenses',
    budgetYear: 2024,
    createdAt: new Date('2024-02-25'),
    updatedAt: new Date('2024-03-05')
  }
];

// Mock NAV Reports
const mockNAVReports: NAVReport[] = [
  {
    id: 'nav-1',
    fundId: 'fund-1',
    reportDate: new Date('2024-03-31'),
    reportPeriod: 'Q1_2024',
    reportType: NAVReportType.QUARTERLY,
    grossAssetValue: 285000000,
    cashAndEquivalents: 15000000,
    otherAssets: 2000000,
    totalAssets: 302000000,
    managementFees: 12000000,
    carriedInterest: 8500000,
    accruals: 4500000,
    otherLiabilities: 2000000,
    totalLiabilities: 27000000,
    netAssetValue: 275000000,
    navPerUnit: 1.41,
    periodReturn: 8.5,
    sinceInceptionReturn: 42.3,
    quarterlyReturn: 8.5,
    annualizedReturn: 18.7,
    capitalCalled: 195000000,
    capitalDistributed: 85000000,
    netCashFlow: -110000000,
    valuationDate: new Date('2024-03-31'),
    status: NAVReportStatus.PUBLISHED,
    preparedBy: 'nav-analyst-1',
    reviewedBy: 'fund-manager-1',
    approvedBy: 'managing-partner-1',
    approvedDate: new Date('2024-04-15'),
    publishedDate: new Date('2024-04-20'),
    previousNAV: 253000000,
    createdAt: new Date('2024-04-01'),
    updatedAt: new Date('2024-04-20')
  },
  {
    id: 'nav-2',
    fundId: 'fund-2',
    reportDate: new Date('2023-12-31'),
    reportPeriod: 'Q4_2023',
    reportType: NAVReportType.QUARTERLY,
    grossAssetValue: 695000000,
    cashAndEquivalents: 25000000,
    otherAssets: 5000000,
    totalAssets: 725000000,
    managementFees: 18000000,
    carriedInterest: 15000000,
    accruals: 5000000,
    otherLiabilities: 2000000,
    totalLiabilities: 40000000,
    netAssetValue: 685000000,
    navPerUnit: 0.94,
    periodReturn: 12.3,
    sinceInceptionReturn: 91.2,
    quarterlyReturn: 12.3,
    annualizedReturn: 24.2,
    capitalCalled: 580000000,
    capitalDistributed: 425000000,
    netCashFlow: -155000000,
    valuationDate: new Date('2023-12-31'),
    status: NAVReportStatus.PUBLISHED,
    preparedBy: 'nav-analyst-2',
    reviewedBy: 'fund-manager-2',
    approvedBy: 'managing-partner-1',
    approvedDate: new Date('2024-01-15'),
    publishedDate: new Date('2024-01-20'),
    previousNAV: 610000000,
    createdAt: new Date('2024-01-02'),
    updatedAt: new Date('2024-01-20')
  }
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');
  const fundId = searchParams.get('fundId');

  try {
    switch (type) {
      case 'overview':
        return NextResponse.json({
          success: true,
          data: {
            funds: mockFunds,
            summary: {
              totalFunds: mockFunds.length,
              totalCommitments: mockFunds.reduce((sum, f) => sum + f.totalCommitments, 0),
              totalCalled: mockFunds.reduce((sum, f) => sum + f.totalCalled, 0),
              totalNAV: mockFunds.reduce((sum, f) => sum + f.currentNAV, 0),
              avgNetIRR: mockFunds.reduce((sum, f) => sum + (f.netIRR || 0), 0) / mockFunds.length,
              activeFunds: mockFunds.filter(f => f.status === 'INVESTING' || f.status === 'HARVESTING').length
            }
          }
        });

      case 'funds':
        const filteredFunds = fundId
          ? mockFunds.filter(f => f.id === fundId)
          : mockFunds;
        return NextResponse.json({ success: true, data: filteredFunds });

      case 'commitments':
        const commitments = fundId
          ? mockCommitments.filter(c => c.fundId === fundId)
          : mockCommitments;
        return NextResponse.json({ success: true, data: commitments });

      case 'capital-calls':
        const capitalCalls = fundId
          ? mockCapitalCalls.filter(c => c.fundId === fundId)
          : mockCapitalCalls;
        return NextResponse.json({ success: true, data: capitalCalls });

      case 'distributions':
        const distributions = fundId
          ? mockDistributions.filter(d => d.fundId === fundId)
          : mockDistributions;
        return NextResponse.json({ success: true, data: distributions });

      case 'expenses':
        const expenses = fundId
          ? mockExpenses.filter(e => e.fundId === fundId)
          : mockExpenses;
        return NextResponse.json({ success: true, data: expenses });

      case 'nav-reports':
        const navReports = fundId
          ? mockNAVReports.filter(r => r.fundId === fundId)
          : mockNAVReports;
        return NextResponse.json({ success: true, data: navReports });

      case 'fund-performance':
        const fund = mockFunds.find(f => f.id === fundId);
        if (!fund) {
          return NextResponse.json({ success: false, error: 'Fund not found' }, { status: 404 });
        }
        return NextResponse.json({
          success: true,
          data: {
            fundId: fund.id,
            performance: {
              netIRR: fund.netIRR,
              grossIRR: fund.grossIRR,
              netMOIC: fund.netMOIC,
              grossMOIC: fund.grossMOIC,
              dpi: fund.dpi,
              rvpi: fund.rvpi,
              tvpi: fund.tvpi
            },
            cashFlow: {
              totalCommitments: fund.totalCommitments,
              totalCalled: fund.totalCalled,
              totalInvested: fund.totalInvested,
              totalDistributed: fund.totalDistributed,
              currentNAV: fund.currentNAV
            },
            status: fund.status,
            vintage: fund.vintage
          }
        });

      case 'expense-analysis':
        const fundExpenses = fundId
          ? mockExpenses.filter(e => e.fundId === fundId)
          : mockExpenses;
        
        const expensesByCategory = fundExpenses.reduce((acc, expense) => {
          acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
          return acc;
        }, {} as Record<string, number>);

        const totalExpenses = fundExpenses.reduce((sum, e) => sum + e.amount, 0);
        
        return NextResponse.json({
          success: true,
          data: {
            totalExpenses,
            expensesByCategory,
            expensesByStatus: {
              pending: fundExpenses.filter(e => e.status === 'PENDING').length,
              approved: fundExpenses.filter(e => e.status === 'APPROVED').length,
              paid: fundExpenses.filter(e => e.status === 'PAID').length
            },
            recentExpenses: fundExpenses.slice(0, 5)
          }
        });

      default:
        return NextResponse.json({
          success: true,
          data: {
            funds: mockFunds,
            commitments: mockCommitments,
            capitalCalls: mockCapitalCalls,
            distributions: mockDistributions,
            expenses: mockExpenses,
            navReports: mockNAVReports
          }
        });
    }
  } catch (error) {
    console.error('Fund Operations API Error:', error);
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
      case 'create_capital_call':
        return NextResponse.json({
          success: true,
          message: 'Capital call created successfully',
          data: {
            capitalCallId: `call-${Date.now()}`,
            fundId: data.fundId,
            callNumber: data.callNumber,
            amount: data.amount,
            dueDate: data.dueDate,
            status: 'ISSUED',
            createdAt: new Date()
          }
        });

      case 'process_distribution':
        return NextResponse.json({
          success: true,
          message: 'Distribution processed successfully',
          data: {
            distributionId: `dist-${Date.now()}`,
            fundId: data.fundId,
            amount: data.amount,
            distributionDate: data.distributionDate,
            status: 'PROCESSING',
            processedAt: new Date()
          }
        });

      case 'record_expense':
        return NextResponse.json({
          success: true,
          message: 'Expense recorded successfully',
          data: {
            expenseId: `expense-${Date.now()}`,
            fundId: data.fundId,
            description: data.description,
            amount: data.amount,
            category: data.category,
            status: 'PENDING',
            recordedAt: new Date()
          }
        });

      case 'generate_nav':
        return NextResponse.json({
          success: true,
          message: 'NAV report generation initiated',
          data: {
            navReportId: `nav-${Date.now()}`,
            fundId: data.fundId,
            reportPeriod: data.reportPeriod,
            status: 'DRAFT',
            estimatedCompletion: new Date(Date.now() + 30 * 60 * 1000) // 30 minutes
          }
        });

      case 'add_commitment':
        return NextResponse.json({
          success: true,
          message: 'Commitment added successfully',
          data: {
            commitmentId: `commitment-${Date.now()}`,
            fundId: data.fundId,
            investorName: data.investorName,
            commitmentAmount: data.commitmentAmount,
            status: 'ACTIVE',
            createdAt: new Date()
          }
        });

      case 'approve_expense':
        return NextResponse.json({
          success: true,
          message: 'Expense approved successfully',
          data: {
            expenseId: data.expenseId,
            approvedBy: data.approvedBy,
            approvedAt: new Date(),
            status: 'APPROVED'
          }
        });

      case 'fund_capital_call':
        return NextResponse.json({
          success: true,
          message: 'Capital call funding recorded',
          data: {
            capitalCallId: data.capitalCallId,
            allocationId: data.allocationId,
            fundedAmount: data.fundedAmount,
            fundedAt: new Date(),
            status: 'FUNDED'
          }
        });

      case 'publish_nav':
        return NextResponse.json({
          success: true,
          message: 'NAV report published successfully',
          data: {
            navReportId: data.navReportId,
            publishedBy: data.publishedBy,
            publishedAt: new Date(),
            status: 'PUBLISHED'
          }
        });

      default:
        return NextResponse.json(
          { success: false, error: 'Unknown action' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Fund Operations POST Error:', error);
    return NextResponse.json(
      { success: false, error: 'Invalid request body' },
      { status: 400 }
    );
  }
}