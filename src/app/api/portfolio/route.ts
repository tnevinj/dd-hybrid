import { NextRequest, NextResponse } from 'next/server';
import { Portfolio, UnifiedAsset } from '@/types/portfolio';

// Mock data for development
const mockPortfolios: Portfolio[] = [
  {
    id: '1',
    name: 'Main Portfolio',
    description: 'Primary investment portfolio with diversified assets',
    assetTypes: ['traditional', 'real_estate', 'infrastructure'],
    assets: [],
    totalValue: 0,
    totalInvested: 0,
    totalRealized: 0,
    unrealizedValue: 0,
    performanceMetrics: {
      irr: 0.15,
      moic: 2.1,
      totalReturn: 0.18,
    },
    allocationTargets: {
      traditional: 0.6,
      real_estate: 0.25,
      infrastructure: 0.15,
    },
    riskProfile: 'medium',
    managerId: 'user-1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Growth Portfolio',
    description: 'High-growth focused portfolio',
    assetTypes: ['traditional'],
    assets: [],
    totalValue: 0,
    totalInvested: 0,
    totalRealized: 0,
    unrealizedValue: 0,
    performanceMetrics: {
      irr: 0.22,
      moic: 1.8,
      totalReturn: 0.24,
    },
    riskProfile: 'high',
    managerId: 'user-1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// Mock assets data
const mockAssets: UnifiedAsset[] = [
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
        {
          name: 'Consulting Group',
          sqFt: 25000,
          leaseExpiry: '2027-03-31',
          rentPsf: 44,
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
      carbonFootprint: -12000, // Carbon negative
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
];

// Add assets to portfolios
mockPortfolios[0].assets = mockAssets;
mockPortfolios[0].totalValue = mockAssets.reduce((sum, asset) => sum + asset.currentValue, 0);
mockPortfolios[0].totalInvested = mockAssets.reduce((sum, asset) => sum + asset.acquisitionValue, 0);
mockPortfolios[0].unrealizedValue = mockPortfolios[0].totalValue - mockPortfolios[0].totalInvested;

export async function GET(request: NextRequest) {
  console.log('Portfolio API: GET request received');
  try {
    // In a real application, this would fetch from a database
    // and include proper authentication/authorization
    
    const searchParams = request.nextUrl.searchParams;
    const managerId = searchParams.get('managerId') || 'user-1';
    console.log('Portfolio API: Looking for portfolios for manager:', managerId);
    
    // Filter portfolios by manager
    const userPortfolios = mockPortfolios.filter(portfolio => portfolio.managerId === managerId);
    console.log('Portfolio API: Found portfolios:', userPortfolios.length);
    
    return NextResponse.json(userPortfolios, { status: 200 });
  } catch (error) {
    console.error('Error fetching portfolios:', error);
    return NextResponse.json(
      { error: 'Failed to fetch portfolios' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Create new portfolio
    const newPortfolio: Portfolio = {
      id: `portfolio-${Date.now()}`,
      name: body.name,
      description: body.description,
      assetTypes: body.assetTypes || [],
      assets: [],
      totalValue: 0,
      totalInvested: 0,
      totalRealized: 0,
      unrealizedValue: 0,
      performanceMetrics: {
        irr: 0,
        moic: 0,
        totalReturn: 0,
      },
      allocationTargets: body.allocationTargets,
      riskProfile: body.riskProfile || 'medium',
      managerId: body.managerId || 'user-1',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    // In a real application, this would save to a database
    mockPortfolios.push(newPortfolio);
    
    return NextResponse.json(newPortfolio, { status: 201 });
  } catch (error) {
    console.error('Error creating portfolio:', error);
    return NextResponse.json(
      { error: 'Failed to create portfolio' },
      { status: 500 }
    );
  }
}