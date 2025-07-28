import { NextRequest, NextResponse } from 'next/server';
import { Portfolio } from '@/types/portfolio';

// This would typically come from a database
const mockPortfolios: Portfolio[] = []; // Would be populated from the main route

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: portfolioId } = await params;
    
    // Mock portfolio data with assets for demonstration
    const mockPortfolio: Portfolio = {
      id: portfolioId,
      name: 'Main Portfolio',
      description: 'Primary investment portfolio with diversified assets',
      assetTypes: ['traditional', 'real_estate', 'infrastructure'],
      assets: [
        {
          id: 'asset-1',
          name: 'TechCorp Inc',
          assetType: 'traditional',
          description: 'B2B SaaS company specializing in workflow automation',
          acquisitionDate: '2021-03-15',
          acquisitionValue: 5000000,
          currentValue: 12000000,
          location: {
            country: 'United States',
            region: 'North America',
            city: 'San Francisco',
          },
          performance: {
            irr: 0.28,
            moic: 2.4,
            totalReturn: 0.32,
          },
          esgMetrics: {
            environmentalScore: 8.2,
            socialScore: 7.8,
            governanceScore: 9.1,
            overallScore: 8.4,
            jobsCreated: 150,
            sustainabilityCertifications: ['B-Corp'],
          },
          status: 'active',
          riskRating: 'medium',
          sector: 'Technology',
          tags: ['SaaS', 'B2B', 'Growth'],
          specificMetrics: {
            companyStage: 'series_b',
            fundingRounds: 3,
            employeeCount: 180,
            revenue: 15000000,
            ebitda: 3000000,
            debtToEquity: 0.2,
            boardSeats: 2,
            ownershipPercentage: 25,
          },
          companyInfo: {
            foundedYear: 2018,
            businessModel: 'SaaS Subscription',
            keyProducts: ['Workflow Automation', 'Team Collaboration'],
            competitiveAdvantages: ['AI-powered automation', 'Strong customer retention'],
          },
        },
        {
          id: 'asset-2',
          name: 'Downtown Office Complex',
          assetType: 'real_estate',
          description: 'Class A office building in downtown financial district',
          acquisitionDate: '2020-08-10',
          acquisitionValue: 25000000,
          currentValue: 28500000,
          location: {
            country: 'United States',
            region: 'North America',
            city: 'New York',
          },
          performance: {
            irr: 0.12,
            moic: 1.14,
            totalReturn: 0.14,
          },
          esgMetrics: {
            environmentalScore: 7.5,
            socialScore: 6.8,
            governanceScore: 8.9,
            overallScore: 7.7,
            carbonFootprint: 450,
            sustainabilityCertifications: ['LEED Gold'],
          },
          status: 'active',
          riskRating: 'low',
          sector: 'Real Estate',
          tags: ['Office', 'Class A', 'Core'],
          specificMetrics: {
            propertyType: 'office',
            totalSqFt: 150000,
            occupancyRate: 92,
            avgLeaseLength: 5.5,
            capRate: 5.2,
            noiYield: 6.8,
            vacancyRate: 8,
            avgRentPsf: 45,
          },
          propertyDetails: {
            yearBuilt: 2005,
            lastRenovation: 2018,
            parkingSpaces: 200,
            amenities: ['Fitness Center', 'Conference Rooms', 'Cafeteria'],
            zoning: 'Commercial',
            propertyTaxes: 180000,
          },
          leaseInfo: {
            majorTenants: [
              {
                name: 'Financial Services Corp',
                sqFt: 45000,
                leaseExpiry: '2026-12-31',
                rentPsf: 48,
              },
              {
                name: 'Legal Partners LLC',
                sqFt: 30000,
                leaseExpiry: '2025-06-30',
                rentPsf: 42,
              },
            ],
          },
        },
        {
          id: 'asset-3',
          name: 'Solar Energy Facility',
          assetType: 'infrastructure',
          description: '150MW solar photovoltaic power generation facility',
          acquisitionDate: '2019-11-20',
          acquisitionValue: 80000000,
          currentValue: 85000000,
          location: {
            country: 'United States',
            region: 'North America',
            city: 'Phoenix',
          },
          performance: {
            irr: 0.09,
            moic: 1.06,
            totalReturn: 0.11,
          },
          esgMetrics: {
            environmentalScore: 9.8,
            socialScore: 8.2,
            governanceScore: 8.5,
            overallScore: 8.8,
            carbonFootprint: -12000,
            jobsCreated: 25,
            sustainabilityCertifications: ['Green Energy Certified'],
          },
          status: 'active',
          riskRating: 'low',
          sector: 'Energy',
          tags: ['Solar', 'Renewable', 'Infrastructure'],
          specificMetrics: {
            assetCategory: 'energy',
            capacityUtilization: 88,
            operationalEfficiency: 94,
            maintenanceScore: 85,
            regulatoryCompliance: 98,
            contractedRevenue: 8500000,
            availabilityRate: 96,
            throughputCapacity: 150000,
            averageLifespan: 25,
          },
          operationalData: {
            commissionDate: '2020-01-15',
            designLife: 25,
            currentAge: 4,
            nextMajorMaintenance: '2024-06-01',
            operatingLicense: {
              licenseNumber: 'PWR-2020-001',
              expiryDate: '2030-01-15',
              renewalRequired: false,
            },
          },
          contractualInfo: {
            contractType: 'availability',
            contractorName: 'Green Energy Corp',
            contractExpiry: '2045-01-15',
            renewalOptions: 2,
          },
        },
      ],
      totalValue: 125500000,
      totalInvested: 110000000,
      totalRealized: 0,
      unrealizedValue: 15500000,
      performanceMetrics: {
        irr: 0.15,
        moic: 1.14,
        totalReturn: 0.16,
      },
      allocationTargets: {
        traditional: 0.6,
        real_estate: 0.25,
        infrastructure: 0.15,
      },
      riskProfile: 'medium',
      managerId: 'user-1',
      createdAt: new Date('2021-01-01').toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    if (!mockPortfolio) {
      return NextResponse.json(
        { error: 'Portfolio not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(mockPortfolio, { status: 200 });
  } catch (error) {
    console.error('Error fetching portfolio:', error);
    return NextResponse.json(
      { error: 'Failed to fetch portfolio' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: portfolioId } = await params;
    const body = await request.json();
    
    // In a real application, this would update the database
    const updatedPortfolio = {
      ...body,
      id: portfolioId,
      updatedAt: new Date().toISOString(),
    };
    
    return NextResponse.json(updatedPortfolio, { status: 200 });
  } catch (error) {
    console.error('Error updating portfolio:', error);
    return NextResponse.json(
      { error: 'Failed to update portfolio' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: portfolioId } = await params;
    
    // In a real application, this would delete from the database
    // with proper authorization checks
    
    return NextResponse.json(
      { message: 'Portfolio deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting portfolio:', error);
    return NextResponse.json(
      { error: 'Failed to delete portfolio' },
      { status: 500 }
    );
  }
}