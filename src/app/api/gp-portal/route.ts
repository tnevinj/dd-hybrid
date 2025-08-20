import { NextRequest, NextResponse } from 'next/server';
import { database } from '@/lib/database';
import type { 
  GPAPIResponse, 
  GPCompany, 
  GPDealSubmission, 
  GPMetrics,
  GPOnboardingProgress 
} from '@/types/gp-portal';

// GET /api/gp-portal - Get GP dashboard data
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json<GPAPIResponse<null>>({
        success: false,
        error: 'User ID is required'
      }, { status: 400 });
    }

    // In a real implementation, you would:
    // 1. Verify user authentication and GP permissions
    // 2. Query the database for user's GP companies and deals
    // 3. Calculate metrics and progress
    
    // For now, return mock data
    const mockData = {
      companies: [
        {
          id: '1',
          name: 'TechStartup Alpha',
          description: 'AI-powered fintech solutions',
          sector: 'Technology',
          subsector: 'Fintech',
          geography: 'North America',
          foundedYear: 2020,
          employeeCount: 45,
          headquarters: 'San Francisco, CA',
          primaryContactName: 'John Smith',
          primaryContactEmail: 'john@techstartup.com',
          primaryContactPhone: '+1-555-0123',
          businessModel: 'B2B SaaS',
          onboardingStatus: 'UNDER_REVIEW' as const,
          verificationStatus: 'PENDING' as const,
          createdAt: new Date('2024-01-15'),
          lastUpdated: new Date(),
          deals: [],
          documents: [],
          communications: []
        },
        {
          id: '2',
          name: 'HealthTech Innovators',
          description: 'Digital health platform for remote patient monitoring',
          sector: 'Healthcare',
          subsector: 'Digital Health',
          geography: 'Europe',
          foundedYear: 2019,
          employeeCount: 120,
          headquarters: 'London, UK',
          primaryContactName: 'Sarah Johnson',
          primaryContactEmail: 'sarah@healthtech.com',
          primaryContactPhone: '+44-20-7123-4567',
          businessModel: 'B2B2C Platform',
          onboardingStatus: 'APPROVED' as const,
          verificationStatus: 'VERIFIED' as const,
          createdAt: new Date('2024-02-01'),
          lastUpdated: new Date(),
          deals: [],
          documents: [],
          communications: []
        }
      ] as GPCompany[],
      
      activeDeals: [
        {
          id: 'deal_1',
          companyId: '1',
          dealName: 'Series B Funding Round',
          targetCompanyName: 'TechStartup Alpha',
          targetCompanyDescription: 'Leading AI fintech platform',
          dealType: 'INVESTMENT' as const,
          investmentType: 'PRIMARY' as const,
          dealSize: 15000000,
          proposedInvestment: 10000000,
          targetValuation: 50000000,
          enterpriseValue: 50000000,
          revenue: 8000000,
          ebitda: 2000000,
          revenueMultiple: 6.25,
          ebitdaMultiple: 25,
          targetIRR: 25,
          targetMultiple: 3.5,
          targetOwnership: 20,
          boardSeats: 2,
          liquidationPreference: '1x Non-Participating',
          useOfFunds: ['Product Development', 'Market Expansion', 'Team Growth'],
          investmentThesis: 'Market-leading AI technology with strong growth trajectory',
          riskFactors: ['Market competition', 'Regulatory changes', 'Key person risk'],
          exitStrategy: 'Strategic acquisition or IPO within 5-7 years',
          competitivePosition: 'Strong moat with proprietary AI algorithms',
          status: 'UNDER_REVIEW' as const,
          submissionStage: 'DETAILED' as const,
          priority: 'HIGH' as const,
          sourceDate: new Date('2024-01-20'),
          submittedAt: new Date('2024-01-22'),
          reviewStartedAt: new Date('2024-01-25'),
          targetClosingDate: new Date('2024-04-15'),
          assignedAnalyst: 'Michael Chen',
          createdAt: new Date('2024-01-20'),
          updatedAt: new Date(),
          documents: [],
          communications: []
        }
      ] as GPDealSubmission[],
      
      metrics: {
        totalSubmissions: 15,
        activeSubmissions: 8,
        approvedDeals: 3,
        averageProcessingTime: 14,
        successRate: 0.67
      } as GPMetrics,
      
      onboardingProgress: [
        {
          currentStep: 'TRACK_RECORD' as const,
          completedSteps: ['COMPANY_INFO', 'INVESTMENT_FOCUS'],
          totalSteps: 6,
          progressPercentage: 33,
          estimatedTimeRemaining: 5,
          blockers: []
        }
      ] as GPOnboardingProgress[],
      
      recentActivity: [
        {
          id: 'activity_1',
          type: 'DEAL_SUBMISSION',
          title: 'New deal submitted: Series B TechStartup Alpha',
          timestamp: new Date('2024-01-22'),
          userId: userId
        },
        {
          id: 'activity_2',
          type: 'DOCUMENT_UPLOAD',
          title: 'Financial statements uploaded for HealthTech Innovators',
          timestamp: new Date('2024-01-20'),
          userId: userId
        }
      ]
    };

    return NextResponse.json<GPAPIResponse<typeof mockData>>({
      success: true,
      data: mockData,
      message: 'GP dashboard data retrieved successfully'
    });

  } catch (error) {
    console.error('Error fetching GP dashboard data:', error);
    return NextResponse.json<GPAPIResponse<null>>({
      success: false,
      error: 'Failed to fetch dashboard data'
    }, { status: 500 });
  }
}

// POST /api/gp-portal - Create new GP company or deal
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, data } = body;
    
    if (!type || !data) {
      return NextResponse.json<GPAPIResponse<null>>({
        success: false,
        error: 'Type and data are required'
      }, { status: 400 });
    }

    // In a real implementation, you would:
    // 1. Validate the data against schemas
    // 2. Check user permissions
    // 3. Save to database
    // 4. Trigger any necessary workflows
    
    let result;
    
    switch (type) {
      case 'company':
        // Create new GP company
        result = {
          id: `company_${Date.now()}`,
          ...data,
          createdAt: new Date(),
          lastUpdated: new Date(),
          onboardingStatus: 'DRAFT',
          verificationStatus: 'PENDING'
        };
        break;
        
      case 'deal':
        // Create new deal submission
        result = {
          id: `deal_${Date.now()}`,
          ...data,
          createdAt: new Date(),
          updatedAt: new Date(),
          status: 'DRAFT',
          submissionStage: 'INITIAL',
          priority: 'MEDIUM',
          sourceDate: new Date()
        };
        break;
        
      default:
        return NextResponse.json<GPAPIResponse<null>>({
          success: false,
          error: 'Invalid type'
        }, { status: 400 });
    }

    return NextResponse.json<GPAPIResponse<typeof result>>({
      success: true,
      data: result,
      message: `${type} created successfully`
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating GP entity:', error);
    return NextResponse.json<GPAPIResponse<null>>({
      success: false,
      error: 'Failed to create entity'
    }, { status: 500 });
  }
}