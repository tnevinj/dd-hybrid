import { Portfolio, UnifiedAsset, TraditionalAsset, RealEstateAsset, InfrastructureAsset } from '@/types/portfolio'

// Sample Traditional Assets
const traditionalAssets: TraditionalAsset[] = [
  {
    id: 'trad-001',
    name: 'TechCorp Innovation',
    assetType: 'traditional',
    description: 'Leading fintech company specializing in AI-powered financial services and blockchain solutions.',
    acquisitionDate: '2021-03-15',
    acquisitionValue: 15000000,
    currentValue: 22000000,
    location: {
      country: 'South Africa',
      region: 'Gauteng',
      city: 'Johannesburg',
      coordinates: { lat: -26.2041, lng: 28.0473 }
    },
    performance: {
      irr: 0.185,
      moic: 1.47,
      tvpi: 1.47,
      dpi: 0.0,
      rvpi: 1.47,
      currentYield: 0.0,
      totalReturn: 0.467,
      benchmarkComparison: 0.058,
      riskAdjustedReturn: 0.142
    },
    esgMetrics: {
      environmentalScore: 7.2,
      socialScore: 8.1,
      governanceScore: 8.5,
      overallScore: 7.9,
      carbonFootprint: 450,
      jobsCreated: 125,
      communityImpact: 7.5,
      diversityScore: 8.2,
      sustainabilityCertifications: ['B Corp', 'ISO 14001']
    },
    status: 'active',
    riskRating: 'medium',
    sector: 'Technology',
    tags: ['fintech', 'ai', 'blockchain', 'growth'],
    lastUpdated: '2024-01-15',
    nextReviewDate: '2024-07-15',
    specificMetrics: {
      companyStage: 'series_b',
      fundingRounds: 3,
      employeeCount: 150,
      revenue: 8500000,
      ebitda: 2100000,
      debtToEquity: 0.3,
      marketCap: 45000000,
      enterprise_value: 42000000,
      boardSeats: 2,
      ownershipPercentage: 0.25
    },
    companyInfo: {
      foundedYear: 2018,
      businessModel: 'SaaS platform providing AI-powered financial analytics and automated compliance solutions for banks and financial institutions.',
      keyProducts: ['AI Risk Engine', 'Compliance Automation Suite', 'Real-time Analytics Dashboard', 'Blockchain Settlement Network'],
      competitiveAdvantages: [
        'Proprietary AI algorithms with 95% accuracy in fraud detection',
        'First-mover advantage in African fintech regulatory compliance',
        'Strategic partnerships with 3 major banks',
        'Strong technical team with deep domain expertise'
      ]
    }
  }
]

// Sample Real Estate Assets
const realEstateAssets: RealEstateAsset[] = [
  {
    id: 're-001',
    name: 'Cape Town Central Office Complex',
    assetType: 'real_estate',
    description: 'Premium Grade-A office complex in Cape Town CBD with modern amenities and excellent transport links.',
    acquisitionDate: '2020-08-20',
    acquisitionValue: 45000000,
    currentValue: 52000000,
    location: {
      country: 'South Africa',
      region: 'Western Cape',
      city: 'Cape Town',
      coordinates: { lat: -33.9249, lng: 18.4241 }
    },
    performance: {
      irr: 0.142,
      moic: 1.16,
      tvpi: 1.16,
      dpi: 0.0,
      rvpi: 1.16,
      currentYield: 0.085,
      totalReturn: 0.156,
      benchmarkComparison: 0.032,
      riskAdjustedReturn: 0.118
    },
    esgMetrics: {
      environmentalScore: 8.5,
      socialScore: 7.8,
      governanceScore: 8.2,
      overallScore: 8.2,
      carbonFootprint: 850,
      jobsCreated: 0,
      communityImpact: 6.5,
      diversityScore: 7.0,
      sustainabilityCertifications: ['LEED Gold', 'Green Star SA', 'EDGE Certified']
    },
    status: 'active',
    riskRating: 'low',
    sector: 'Real Estate',
    tags: ['office', 'cbd', 'grade-a', 'sustainable'],
    lastUpdated: '2024-01-10',
    nextReviewDate: '2024-04-10',
    specificMetrics: {
      propertyType: 'office',
      totalSqFt: 185000,
      occupancyRate: 0.94,
      avgLeaseLength: 4.2,
      capRate: 0.078,
      noiYield: 0.085,
      loanToValue: 0.65,
      debtServiceCoverageRatio: 1.8,
      vacancyRate: 0.06,
      avgRentPsf: 280
    },
    propertyDetails: {
      yearBuilt: 2015,
      lastRenovation: 2022,
      parkingSpaces: 320,
      amenities: [
        'Concierge Service',
        'Fitness Center',
        'Conference Facilities',
        'Rooftop Garden',
        'Electric Vehicle Charging',
        'High-speed Internet',
        'Security System',
        '24/7 Access'
      ],
      zoning: 'Mixed Commercial',
      propertyTaxes: 890000
    },
    leaseInfo: {
      majorTenants: [
        {
          name: 'Global Tech Solutions',
          sqFt: 45000,
          leaseExpiry: '2027-12-31',
          rentPsf: 290
        },
        {
          name: 'African Mining Corp',
          sqFt: 32000,
          leaseExpiry: '2026-06-30',
          rentPsf: 275
        },
        {
          name: 'Legal Associates',
          sqFt: 18000,
          leaseExpiry: '2025-03-31',
          rentPsf: 285
        }
      ]
    }
  }
]

// Sample Infrastructure Assets
const infrastructureAssets: InfrastructureAsset[] = [
  {
    id: 'infra-001',
    name: 'Renewable Energy Park - Northern Cape',
    assetType: 'infrastructure',
    description: 'Large-scale solar and wind energy facility providing clean electricity to the national grid.',
    acquisitionDate: '2019-11-10',
    acquisitionValue: 125000000,
    currentValue: 165000000,
    location: {
      country: 'South Africa',
      region: 'Northern Cape',
      city: 'Upington',
      coordinates: { lat: -28.4478, lng: 21.2561 }
    },
    performance: {
      irr: 0.165,
      moic: 1.32,
      tvpi: 1.32,
      dpi: 0.0,
      rvpi: 1.32,
      currentYield: 0.092,
      totalReturn: 0.32,
      benchmarkComparison: 0.045,
      riskAdjustedReturn: 0.128
    },
    esgMetrics: {
      environmentalScore: 9.2,
      socialScore: 8.5,
      governanceScore: 8.8,
      overallScore: 8.8,
      carbonFootprint: -15000, // Negative due to clean energy generation
      jobsCreated: 85,
      communityImpact: 9.2,
      diversityScore: 7.8,
      sustainabilityCertifications: ['IFC Performance Standards', 'Equator Principles', 'ISO 50001']
    },
    status: 'active',
    riskRating: 'low',
    sector: 'Energy',
    tags: ['renewable', 'solar', 'wind', 'grid-connected'],
    lastUpdated: '2024-01-20',
    nextReviewDate: '2024-06-20',
    specificMetrics: {
      assetCategory: 'energy',
      capacityUtilization: 0.87,
      operationalEfficiency: 0.92,
      maintenanceScore: 88,
      regulatoryCompliance: 0.98,
      contractedRevenue: 28500000,
      availabilityRate: 0.962,
      throughputCapacity: 150000,
      averageLifespan: 25
    },
    operationalData: {
      commissionDate: '2020-06-15',
      designLife: 25,
      currentAge: 4,
      nextMajorMaintenance: '2024-09-15',
      operatingLicense: {
        licenseNumber: 'REI-2020-0045-NC',
        expiryDate: '2035-06-14',
        renewalRequired: false
      }
    },
    contractualInfo: {
      contractType: 'availability',
      contractorName: 'Eskom Holdings SOC Ltd',
      contractExpiry: '2040-06-14',
      renewalOptions: 2
    }
  }
]

// Sample Portfolio
export const samplePortfolio: Portfolio = {
  id: 'default',
  name: 'African Growth Fund I',
  description: 'Diversified private equity fund focused on high-growth opportunities across traditional, real estate, and infrastructure sectors in Africa.',
  assetTypes: ['traditional', 'real_estate', 'infrastructure'],
  assets: [...traditionalAssets, ...realEstateAssets, ...infrastructureAssets],
  totalValue: 239000000, // Sum of current values
  totalInvested: 185000000, // Sum of acquisition values
  totalRealized: 0,
  unrealizedValue: 239000000,
  performanceMetrics: {
    irr: 0.158,
    moic: 1.29,
    tvpi: 1.29,
    dpi: 0.0,
    rvpi: 1.29,
    currentYield: 0.075,
    totalReturn: 0.292,
    benchmarkComparison: 0.042,
    riskAdjustedReturn: 0.124
  },
  allocationTargets: {
    traditional: 0.35,
    real_estate: 0.40,
    infrastructure: 0.25
  },
  riskProfile: 'medium',
  managerId: 'manager-001',
  createdAt: '2019-01-01',
  updatedAt: '2024-01-20'
}

export const samplePortfolios: Portfolio[] = [samplePortfolio]