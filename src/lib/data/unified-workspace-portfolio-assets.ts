/**
 * Unified Portfolio Assets - Enterprise Grade Mock Data
 * Based on secondary-edge-nextjs patterns for realistic PE portfolio data
 */

import { Portfolio, UnifiedAsset, TraditionalAsset, RealEstateAsset, InfrastructureAsset } from '@/types/portfolio';
import { UNIFIED_WORKSPACE_PROJECTS, UnifiedWorkspaceProject } from './unified-workspace-data';

// Generate realistic time series data
const generateTimeSeries = (startDate: string, periods: number, startValue: number, volatility: number = 0.15) => {
  const data = [];
  let currentValue = startValue;
  const start = new Date(startDate);
  
  for (let i = 0; i < periods; i++) {
    const date = new Date(start);
    date.setMonth(date.getMonth() + i);
    
    // Add realistic volatility and trend
    const randomShock = (Math.random() - 0.5) * volatility;
    const trend = 0.008; // 0.8% monthly growth trend
    currentValue = currentValue * (1 + trend + randomShock);
    
    data.push({
      date: date.toISOString().split('T')[0],
      value: currentValue
    });
  }
  
  return data;
};

// Enhanced ESG data generator
const createESGMetrics = (baseScore: number) => ({
  overallScore: Math.round((baseScore + Math.random() * 10 - 5) * 10) / 10,
  environmentalScore: Math.round((baseScore + Math.random() * 8 - 4) * 10) / 10,
  socialScore: Math.round((baseScore + Math.random() * 8 - 4) * 10) / 10,
  governanceScore: Math.round((baseScore + Math.random() * 6 - 3) * 10) / 10,
  carbonFootprint: Math.round(150 + Math.random() * 300),
  jobsCreated: Math.round(50 + Math.random() * 200),
  communityImpact: Math.round((6 + Math.random() * 3) * 10) / 10,
  diversityScore: Math.round((6.5 + Math.random() * 2.5) * 10) / 10,
  sustainabilityCertifications: ['ISO 14001', 'B Corp', 'GRI Standards'].slice(0, Math.floor(Math.random() * 3) + 1)
});

/**
 * Generate enterprise-grade portfolio assets from workspace projects
 */
export function generateEnterprisePortfolioAssets(): UnifiedAsset[] {
  const portfolioAssets: UnifiedAsset[] = [];
  
  // Asset 1: TechCorp - Traditional Private Equity Asset (Fintech)
  const techCorpProject = UNIFIED_WORKSPACE_PROJECTS.find(p => p.name === 'TechCorp Due Diligence');
  if (techCorpProject) {
    const techCorpAsset: TraditionalAsset = {
      id: 'asset-techcorp-001',
      name: 'TechCorp Solutions Ltd',
      assetType: 'traditional',
      description: 'Leading African fintech platform providing AI-powered payment processing, digital banking infrastructure, and regulatory compliance solutions across 12 African markets.',
      acquisitionDate: '2022-03-15',
      acquisitionValue: techCorpProject.metadata.dealValue || 50000000,
      currentValue: Math.round((techCorpProject.metadata.dealValue || 50000000) * (1 + (techCorpProject.progress / 100) * 0.4)), // Progress-based valuation
      location: {
        country: 'South Africa',
        region: 'Gauteng',
        city: 'Johannesburg',
        coordinates: { lat: -26.2041, lng: 28.0473 }
      },
      performance: {
        irr: 0.24 + (techCorpProject.progress - 75) / 1000, // 24% base IRR
        moic: 1.0 + (techCorpProject.progress / 100) * 0.6, // Progress affects MOIC
        tvpi: 1.0 + (techCorpProject.progress / 100) * 0.6,
        dpi: 0.15, // Some distributions made
        rvpi: 1.0 + (techCorpProject.progress / 100) * 0.45,
        currentYield: 0.0, // Growth asset
        totalReturn: (techCorpProject.progress / 100) * 0.6,
        benchmarkComparison: 0.09, // Outperforming benchmark
        riskAdjustedReturn: 0.19
      },
      esgMetrics: createESGMetrics(8.2),
      status: techCorpProject.status as 'active' | 'completed' | 'draft' | 'review',
      riskRating: techCorpProject.metadata.riskRating as 'low' | 'medium' | 'high',
      sector: 'Technology',
      tags: ['fintech', 'ai', 'payments', 'growth-stage', 'b2b-saas', 'africa'],
      lastUpdated: techCorpProject.lastActivity.toISOString().split('T')[0],
      nextReviewDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      specificMetrics: {
        companyStage: 'series_b',
        fundingRounds: 4,
        employeeCount: 320,
        revenue: 28500000,
        ebitda: 8200000,
        debtToEquity: 0.25,
        marketCap: 140000000,
        enterprise_value: 125000000,
        boardSeats: 3,
        ownershipPercentage: 0.35
      },
      companyInfo: {
        foundedYear: 2018,
        businessModel: 'B2B SaaS platform providing AI-powered financial services infrastructure including payment processing, fraud detection, regulatory compliance, and digital banking solutions for financial institutions across Africa.',
        keyProducts: [
          'TechCorp AI Risk Engine - Real-time fraud detection with 97% accuracy',
          'Compliance Automation Suite - Regulatory compliance management',
          'Multi-Currency Payment Gateway - Cross-border payment processing',
          'Digital Banking Infrastructure - Core banking system APIs',
          'Financial Analytics Dashboard - Business intelligence for banks'
        ],
        competitiveAdvantages: [
          'Proprietary AI algorithms with industry-leading fraud detection rates',
          'First-mover advantage in African regulatory compliance automation',
          'Strategic partnerships with 8 major African banks and 15 payment processors',
          'Deep regulatory expertise across 12 African jurisdictions',
          'Strong technical team with combined 200+ years financial services experience',
          'Government contracts and regulatory body endorsements'
        ]
      }
    };
    portfolioAssets.push(techCorpAsset);
  }

  // Asset 2: HealthCo - Traditional Healthcare Asset
  const healthCoProject = UNIFIED_WORKSPACE_PROJECTS.find(p => p.name === 'HealthCo Investment Committee');
  if (healthCoProject) {
    const healthCoAsset: TraditionalAsset = {
      id: 'asset-healthco-002',
      name: 'HealthCo Medical Systems',
      assetType: 'traditional',
      description: 'Pan-African healthcare technology platform providing telemedicine, electronic health records, medical device connectivity, and healthcare analytics across Sub-Saharan Africa.',
      acquisitionDate: '2021-08-20',
      acquisitionValue: healthCoProject.metadata.dealValue || 125000000,
      currentValue: Math.round((healthCoProject.metadata.dealValue || 125000000) * (1 + (healthCoProject.progress / 100) * 0.35)),
      location: {
        country: 'South Africa',
        region: 'Western Cape',
        city: 'Cape Town',
        coordinates: { lat: -33.9249, lng: 18.4241 }
      },
      performance: {
        irr: 0.28 + (healthCoProject.progress - 90) / 2000, // Strong performance
        moic: 1.0 + (healthCoProject.progress / 100) * 0.4,
        tvpi: 1.0 + (healthCoProject.progress / 100) * 0.4,
        dpi: 0.0, // No distributions yet
        rvpi: 1.0 + (healthCoProject.progress / 100) * 0.4,
        currentYield: 0.0,
        totalReturn: (healthCoProject.progress / 100) * 0.4,
        benchmarkComparison: 0.11,
        riskAdjustedReturn: 0.21
      },
      esgMetrics: createESGMetrics(8.7),
      status: healthCoProject.status as 'active' | 'completed' | 'draft' | 'review',
      riskRating: healthCoProject.metadata.riskRating as 'low' | 'medium' | 'high',
      sector: 'Healthcare',
      tags: ['healthtech', 'telemedicine', 'ehr', 'medical-devices', 'growth-stage', 'africa'],
      lastUpdated: healthCoProject.lastActivity.toISOString().split('T')[0],
      nextReviewDate: healthCoProject.deadline?.toISOString().split('T')[0] || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      specificMetrics: {
        companyStage: 'series_c',
        fundingRounds: 5,
        employeeCount: 280,
        revenue: 42000000,
        ebitda: 12600000,
        debtToEquity: 0.15,
        marketCap: 190000000,
        enterprise_value: 175000000,
        boardSeats: 2,
        ownershipPercentage: 0.28
      },
      companyInfo: {
        foundedYear: 2017,
        businessModel: 'B2B2C healthcare technology platform serving hospitals, clinics, and patients with integrated telemedicine, EHR, IoT medical device connectivity, and AI-powered diagnostic assistance.',
        keyProducts: [
          'HealthCo Telemedicine Platform - Video consultations and remote patient monitoring',
          'Integrated EHR System - Cloud-based electronic health records with multi-language support',
          'Medical IoT Hub - Device connectivity and real-time health data aggregation',
          'Patient Mobile App - Appointment booking, health tracking, and medication reminders',
          'AI Diagnostic Assistant - Machine learning-powered diagnostic recommendations'
        ],
        competitiveAdvantages: [
          'Largest telemedicine network in Sub-Saharan Africa with 2.1M registered patients',
          'Proprietary medical device integration technology supporting 150+ device types',
          'Strategic partnerships with 45 hospital chains and 200+ independent clinics',
          'Government contracts in 8 countries for public health initiatives',
          'Advanced AI diagnostic tools with clinical validation in African populations',
          'Multi-language platform supporting 12 local African languages'
        ]
      }
    };
    portfolioAssets.push(healthCoAsset);
  }

  // Asset 3: RetailCo - Real Estate Asset (Shopping Centers)
  const retailCoProject = UNIFIED_WORKSPACE_PROJECTS.find(p => p.name === 'RetailCo Deal Screening');
  if (retailCoProject) {
    const retailCoAsset: RealEstateAsset = {
      id: 'asset-retailco-003',
      name: 'RetailCo Premium Shopping Centers',
      assetType: 'real_estate',
      description: 'Portfolio of 6 premium shopping centers located in major European cities, featuring international anchor tenants, modern amenities, and strong foot traffic in prime retail locations.',
      acquisitionDate: '2020-11-10',
      acquisitionValue: 350000000, // Large real estate investment
      currentValue: Math.round(350000000 * (1 + (retailCoProject.progress / 100) * 0.2)), // More conservative real estate appreciation
      location: {
        country: 'Germany',
        region: 'North Rhine-Westphalia',
        city: 'Düsseldorf',
        coordinates: { lat: 51.2277, lng: 6.7735 }
      },
      performance: {
        irr: 0.12 + (retailCoProject.progress / 2000), // Lower IRR typical for real estate
        moic: 1.0 + (retailCoProject.progress / 100) * 0.15,
        tvpi: 1.0 + (retailCoProject.progress / 100) * 0.15,
        dpi: 0.05, // Regular income distributions
        rvpi: 1.0 + (retailCoProject.progress / 100) * 0.10,
        currentYield: 0.065, // Real estate generates current income
        totalReturn: (retailCoProject.progress / 100) * 0.15,
        benchmarkComparison: 0.025,
        riskAdjustedReturn: 0.095
      },
      esgMetrics: createESGMetrics(7.9),
      status: retailCoProject.status as 'active' | 'completed' | 'draft' | 'review',
      riskRating: retailCoProject.metadata.riskRating as 'low' | 'medium' | 'high',
      sector: 'Real Estate',
      tags: ['retail', 'shopping-centers', 'anchor-tenants', 'european-markets', 'income-generating'],
      lastUpdated: retailCoProject.lastActivity.toISOString().split('T')[0],
      nextReviewDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      specificMetrics: {
        propertyType: 'retail',
        totalSqFt: 1250000, // 6 properties averaging ~200k sq ft each
        occupancyRate: 0.87 + (retailCoProject.progress / 10000), // Progress affects occupancy
        avgLeaseLength: 6.2,
        capRate: 0.062,
        noiYield: 0.075,
        loanToValue: 0.55,
        debtServiceCoverageRatio: 1.65,
        vacancyRate: 0.13 - (retailCoProject.progress / 10000),
        avgRentPsf: 42
      },
      propertyDetails: {
        yearBuilt: 2008, // Mix of properties built around 2008
        lastRenovation: 2020, // Recent renovations at acquisition
        parkingSpaces: 4200, // Ample parking across portfolio
        amenities: [
          'Multi-level food courts with international dining options',
          'Underground and surface parking (4200+ spaces)',
          'Cinema complexes and entertainment zones',
          'Children\'s play areas and family facilities',
          'Electric vehicle charging stations',
          'Free high-speed WiFi throughout properties',
          'Advanced security systems with 24/7 monitoring',
          'Climate-controlled shopping environments',
          'Premium restroom facilities',
          'Event spaces for community activities'
        ],
        zoning: 'Commercial Retail',
        propertyTaxes: 2800000 // Annual property taxes for portfolio
      },
      leaseInfo: {
        majorTenants: [
          {
            name: 'MediaMarkt Electronics',
            sqFt: 85000,
            leaseExpiry: '2029-12-31',
            rentPsf: 48
          },
          {
            name: 'Zara Fashion Group',
            sqFt: 65000,
            leaseExpiry: '2027-06-30', 
            rentPsf: 52
          },
          {
            name: 'Carrefour Hypermarket',
            sqFt: 120000,
            leaseExpiry: '2031-03-31',
            rentPsf: 38
          },
          {
            name: 'H&M Retail',
            sqFt: 42000,
            leaseExpiry: '2026-09-30',
            rentPsf: 55
          },
          {
            name: 'Apple Store',
            sqFt: 25000,
            leaseExpiry: '2028-12-31',
            rentPsf: 85
          }
        ]
      }
    };
    portfolioAssets.push(retailCoAsset);
  }

  // Asset 4: Manufacturing Energy - Infrastructure Asset
  const manufacturingProject = UNIFIED_WORKSPACE_PROJECTS.find(p => p.name === 'Manufacturing Portfolio Review');
  if (manufacturingProject) {
    const manufacturingEnergyAsset: InfrastructureAsset = {
      id: 'asset-manufacturing-004',
      name: 'GreenPower Industrial Energy Complex',
      assetType: 'infrastructure',
      description: 'Integrated renewable energy infrastructure combining 150MW solar farm, 75MW wind facility, and 50MWh battery storage, specifically designed to provide reliable clean energy to industrial manufacturing facilities.',
      acquisitionDate: '2019-05-15',
      acquisitionValue: 280000000,
      currentValue: Math.round(280000000 * (1 + (manufacturingProject.progress / 100) * 0.1)), // Conservative infrastructure appreciation
      location: {
        country: 'South Africa',
        region: 'Northern Cape',
        city: 'Upington',
        coordinates: { lat: -28.4478, lng: 21.2561 }
      },
      performance: {
        irr: 0.08 + (manufacturingProject.progress / 5000), // Lower but stable infrastructure IRR
        moic: 1.0 + (manufacturingProject.progress / 100) * 0.08,
        tvpi: 1.0 + (manufacturingProject.progress / 100) * 0.08,
        dpi: 0.02, // Regular cash distributions from energy sales
        rvpi: 1.0 + (manufacturingProject.progress / 100) * 0.06,
        currentYield: 0.072, // Infrastructure generates steady income
        totalReturn: (manufacturingProject.progress / 100) * 0.08,
        benchmarkComparison: -0.01, // Underperforming due to maintenance issues
        riskAdjustedReturn: 0.065
      },
      esgMetrics: {
        ...createESGMetrics(8.9),
        carbonFootprint: -85000, // Negative due to clean energy generation
        sustainabilityCertifications: [
          'IFC Performance Standards',
          'Equator Principles', 
          'ISO 50001 Energy Management',
          'South African Renewable Energy Certification'
        ]
      },
      status: manufacturingProject.status as 'active' | 'completed' | 'draft' | 'review',
      riskRating: manufacturingProject.metadata.riskRating as 'low' | 'medium' | 'high',
      sector: 'Energy',
      tags: ['renewable-energy', 'solar', 'wind', 'battery-storage', 'industrial', 'manufacturing', 'esg'],
      lastUpdated: manufacturingProject.lastActivity.toISOString().split('T')[0],
      nextReviewDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      specificMetrics: {
        assetCategory: 'energy',
        capacityUtilization: 0.78 + (manufacturingProject.progress / 5000), // Below target, improving with progress
        operationalEfficiency: 0.82 + (manufacturingProject.progress / 5000),
        maintenanceScore: 74 + (manufacturingProject.progress / 10), // Improving maintenance
        regulatoryCompliance: 0.97,
        contractedRevenue: 38500000, // Long-term power purchase agreements
        availabilityRate: 0.91 + (manufacturingProject.progress / 10000),
        throughputCapacity: 185000, // MWh annually
        averageLifespan: 25
      },
      operationalData: {
        commissionDate: '2020-08-15',
        designLife: 25,
        currentAge: 4,
        nextMajorMaintenance: '2024-11-15',
        operatingLicense: {
          licenseNumber: 'REI-2020-0089-NC',
          expiryDate: '2035-08-14',
          renewalRequired: false
        }
      },
      contractualInfo: {
        contractType: 'power_purchase_agreement',
        contractorName: 'Industrial Manufacturing Consortium',
        contractExpiry: '2039-08-14',
        renewalOptions: 2
      }
    };
    portfolioAssets.push(manufacturingEnergyAsset);
  }

  // Asset 5: AfriTower Infrastructure - Telecommunications Infrastructure
  const additionalInfraAsset: InfrastructureAsset = {
    id: 'asset-afritower-005',
    name: 'AfriTower Telecommunications Infrastructure',
    assetType: 'infrastructure',
    description: 'Portfolio of 850 telecommunications towers and fiber-optic infrastructure across 8 African countries, providing critical connectivity infrastructure for mobile operators and internet service providers.',
    acquisitionDate: '2020-02-20',
    acquisitionValue: 180000000,
    currentValue: 195000000,
    location: {
      country: 'Kenya',
      region: 'Nairobi County',
      city: 'Nairobi',
      coordinates: { lat: -1.2921, lng: 36.8219 }
    },
    performance: {
      irr: 0.115,
      moic: 1.08,
      tvpi: 1.08,
      dpi: 0.08, // Regular tower lease income
      rvpi: 1.00,
      currentYield: 0.095, // Strong recurring income from tower leases
      totalReturn: 0.08,
      benchmarkComparison: 0.02,
      riskAdjustedReturn: 0.09
    },
    esgMetrics: {
      ...createESGMetrics(7.8),
      jobsCreated: 320,
      communityImpact: 9.1, // High impact through improved connectivity
      sustainabilityCertifications: [
        'ISO 14001',
        'TowerCo Sustainability Standards',
        'Green Tower Initiative'
      ]
    },
    status: 'active',
    riskRating: 'low',
    sector: 'Telecommunications',
    tags: ['telecom-infrastructure', 'towers', 'fiber-optic', 'connectivity', 'africa', 'recurring-income'],
    lastUpdated: '2024-07-25',
    nextReviewDate: '2024-10-25',
    specificMetrics: {
      assetCategory: 'telecommunications',
      capacityUtilization: 0.87,
      operationalEfficiency: 0.94,
      maintenanceScore: 88,
      regulatoryCompliance: 0.98,
      contractedRevenue: 42000000,
      availabilityRate: 0.98,
      throughputCapacity: 850, // Number of towers
      averageLifespan: 30
    },
    operationalData: {
      commissionDate: '2020-02-20',
      designLife: 30,
      currentAge: 4,
      nextMajorMaintenance: '2025-02-20',
      operatingLicense: {
        licenseNumber: 'TELECOM-2020-0045-KE',
        expiryDate: '2030-02-19',
        renewalRequired: false
      }
    },
    contractualInfo: {
      contractType: 'master_lease_agreement',
      contractorName: 'Major African Telecom Operators',
      contractExpiry: '2035-02-19',
      renewalOptions: 3
    }
  };
  portfolioAssets.push(additionalInfraAsset);

  // Asset 6: WaterTech Infrastructure - Water Treatment and Distribution
  const waterTechAsset: InfrastructureAsset = {
    id: 'asset-watertech-006',
    name: 'WaterTech Treatment & Distribution Systems',
    assetType: 'infrastructure',
    description: 'Water treatment and distribution infrastructure serving 2.5 million people across 12 municipalities in Southern Africa, including advanced filtration systems, distribution networks, and smart monitoring technology.',
    acquisitionDate: '2021-06-15',
    acquisitionValue: 220000000,
    currentValue: 235000000,
    location: {
      country: 'South Africa',
      region: 'KwaZulu-Natal',
      city: 'Durban',
      coordinates: { lat: -29.8587, lng: 31.0218 }
    },
    performance: {
      irr: 0.09,
      moic: 1.07,
      tvpi: 1.07,
      dpi: 0.04, // Utility-style distributions
      rvpi: 1.03,
      currentYield: 0.08, // Regulated utility returns
      totalReturn: 0.07,
      benchmarkComparison: 0.01,
      riskAdjustedReturn: 0.075
    },
    esgMetrics: {
      ...createESGMetrics(9.2),
      carbonFootprint: -5000, // Water conservation reduces carbon impact
      communityImpact: 9.8, // Essential water services
      sustainabilityCertifications: [
        'ISO 14001',
        'Water Stewardship Council',
        'UN Water Standards',
        'African Water Facility Certification'
      ]
    },
    status: 'active',
    riskRating: 'low',
    sector: 'Utilities',
    tags: ['water-infrastructure', 'utilities', 'essential-services', 'municipalities', 'africa', 'regulated'],
    lastUpdated: '2024-07-20',
    nextReviewDate: '2024-10-20',
    specificMetrics: {
      assetCategory: 'water_utilities',
      capacityUtilization: 0.82,
      operationalEfficiency: 0.89,
      maintenanceScore: 85,
      regulatoryCompliance: 0.99,
      contractedRevenue: 28000000,
      availabilityRate: 0.96,
      throughputCapacity: 250000000, // Liters per day
      averageLifespan: 35
    },
    operationalData: {
      commissionDate: '2021-06-15',
      designLife: 35,
      currentAge: 3,
      nextMajorMaintenance: '2026-06-15',
      operatingLicense: {
        licenseNumber: 'WATER-2021-0078-ZA',
        expiryDate: '2041-06-14',
        renewalRequired: false
      }
    },
    contractualInfo: {
      contractType: 'concession_agreement',
      contractorName: 'Municipal Water Consortium',
      contractExpiry: '2041-06-14',
      renewalOptions: 1
    }
  };
  portfolioAssets.push(waterTechAsset);

  // Asset 7: PremiumLiving Real Estate - Luxury Residential
  const premiumLivingAsset: RealEstateAsset = {
    id: 'asset-premiumliving-007',
    name: 'PremiumLiving Residential Portfolio',
    assetType: 'real_estate',
    description: 'Portfolio of 4 luxury residential developments in prime African urban locations, featuring 1,200 premium apartments and penthouses with modern amenities, security, and proximity to business districts.',
    acquisitionDate: '2021-09-10',
    acquisitionValue: 165000000,
    currentValue: 185000000,
    location: {
      country: 'South Africa',
      region: 'Western Cape',
      city: 'Cape Town',
      coordinates: { lat: -33.9249, lng: 18.4241 }
    },
    performance: {
      irr: 0.145,
      moic: 1.12,
      tvpi: 1.12,
      dpi: 0.08, // Rental income distributions
      rvpi: 1.04,
      currentYield: 0.075, // Rental yields
      totalReturn: 0.12,
      benchmarkComparison: 0.03,
      riskAdjustedReturn: 0.11
    },
    esgMetrics: createESGMetrics(8.1),
    status: 'active',
    riskRating: 'medium',
    sector: 'Real Estate',
    tags: ['residential', 'luxury', 'apartments', 'urban', 'rental-income', 'africa'],
    lastUpdated: '2024-07-28',
    nextReviewDate: '2024-10-28',
    specificMetrics: {
      propertyType: 'residential',
      totalSqFt: 1800000, // 1200 units averaging 1500 sq ft
      occupancyRate: 0.91,
      avgLeaseLength: 1.5, // Residential leases
      capRate: 0.068,
      noiYield: 0.078,
      loanToValue: 0.60,
      debtServiceCoverageRatio: 1.45,
      vacancyRate: 0.09,
      avgRentPsf: 18 // Per sq ft per month
    },
    propertyDetails: {
      yearBuilt: 2019,
      lastRenovation: 2023,
      parkingSpaces: 1800, // 1.5 spaces per unit
      amenities: [
        'Rooftop pools and entertainment areas',
        'State-of-the-art fitness centers',
        '24/7 concierge and security services',
        'Underground parking with EV charging',
        'Co-working spaces and business centers',
        'Children\'s play areas and parks',
        'High-speed fiber internet',
        'Smart home technology integration',
        'Retail spaces on ground floors',
        'Backup power systems'
      ],
      zoning: 'Mixed-Use Residential',
      propertyTaxes: 1200000
    },
    leaseInfo: {
      majorTenants: [
        {
          name: 'Individual Residential Tenants',
          sqFt: 1800000,
          leaseExpiry: 'Varying',
          rentPsf: 18
        }
      ]
    }
  };
  portfolioAssets.push(premiumLivingAsset);

  // Asset 8: OfficeHub Real Estate - Premium Office Buildings
  const officeHubAsset: RealEstateAsset = {
    id: 'asset-officehub-008',
    name: 'OfficeHub Premium Business Centers',
    assetType: 'real_estate',
    description: 'Portfolio of 3 Grade-A office buildings in major African financial districts, featuring modern workspace solutions, conference facilities, and premium amenities for multinational corporations and growing businesses.',
    acquisitionDate: '2020-04-15',
    acquisitionValue: 245000000,
    currentValue: 265000000,
    location: {
      country: 'Nigeria',
      region: 'Lagos State',
      city: 'Lagos',
      coordinates: { lat: 6.5244, lng: 3.3792 }
    },
    performance: {
      irr: 0.115,
      moic: 1.08,
      tvpi: 1.08,
      dpi: 0.06, // Office rental distributions
      rvpi: 1.02,
      currentYield: 0.07, // Office rental yields
      totalReturn: 0.08,
      benchmarkComparison: 0.02,
      riskAdjustedReturn: 0.09
    },
    esgMetrics: createESGMetrics(8.3),
    status: 'active',
    riskRating: 'medium',
    sector: 'Real Estate',
    tags: ['office', 'grade-a', 'business-centers', 'financial-district', 'corporate', 'africa'],
    lastUpdated: '2024-07-27',
    nextReviewDate: '2024-10-27',
    specificMetrics: {
      propertyType: 'office',
      totalSqFt: 950000, // 3 buildings
      occupancyRate: 0.85,
      avgLeaseLength: 4.8, // Commercial office leases
      capRate: 0.064,
      noiYield: 0.072,
      loanToValue: 0.58,
      debtServiceCoverageRatio: 1.55,
      vacancyRate: 0.15,
      avgRentPsf: 35 // Per sq ft per year
    },
    propertyDetails: {
      yearBuilt: 2017,
      lastRenovation: 2022,
      parkingSpaces: 2200,
      amenities: [
        'Executive conference and meeting facilities',
        'Premium lobby and reception areas',
        'High-speed elevator systems',
        'Advanced HVAC and climate control',
        'Backup generators and UPS systems',
        'Fiber-optic internet infrastructure',
        'On-site banking and financial services',
        'Food courts and premium dining options',
        'Fitness centers and wellness facilities',
        'Helipad access on primary building'
      ],
      zoning: 'Commercial Office',
      propertyTaxes: 1800000
    },
    leaseInfo: {
      majorTenants: [
        {
          name: 'Standard Bank Africa',
          sqFt: 180000,
          leaseExpiry: '2028-12-31',
          rentPsf: 38
        },
        {
          name: 'Deloitte Nigeria',
          sqFt: 120000,
          leaseExpiry: '2027-06-30',
          rentPsf: 36
        },
        {
          name: 'MTN Group',
          sqFt: 95000,
          leaseExpiry: '2029-03-31',
          rentPsf: 40
        },
        {
          name: 'Microsoft Africa',
          sqFt: 85000,
          leaseExpiry: '2026-12-31',
          rentPsf: 42
        }
      ]
    }
  };
  portfolioAssets.push(officeHubAsset);

  return portfolioAssets;
}

/**
 * Generate unified portfolio with enhanced metrics
 */
export function generateEnterprisePortfolio(): Portfolio {
  const assets = generateEnterprisePortfolioAssets();
  const totalInvested = assets.reduce((sum, asset) => sum + asset.acquisitionValue, 0);
  const totalValue = assets.reduce((sum, asset) => sum + asset.currentValue, 0);
  const weightedIRR = assets.reduce((sum, asset) => sum + (asset.performance.irr * asset.currentValue), 0) / totalValue;
  const weightedMOIC = assets.reduce((sum, asset) => sum + (asset.performance.moic * asset.currentValue), 0) / totalValue;
  
  return {
    id: 'unified-portfolio-enterprise',
    name: 'DD Hybrid Investment Fund I',
    description: 'Diversified private equity fund focused on high-growth technology companies, healthcare innovation, premium real estate, and sustainable infrastructure across emerging markets with emphasis on ESG impact.',
    assetTypes: ['traditional', 'real_estate', 'infrastructure'],
    assets,
    totalValue,
    totalInvested,
    totalRealized: assets.reduce((sum, asset) => sum + (asset.performance.dpi * asset.acquisitionValue), 0),
    unrealizedValue: totalValue - assets.reduce((sum, asset) => sum + (asset.performance.dpi * asset.acquisitionValue), 0),
    performanceMetrics: {
      irr: weightedIRR,
      moic: weightedMOIC,
      tvpi: weightedMOIC,
      dpi: assets.reduce((sum, asset) => sum + asset.performance.dpi, 0) / assets.length,
      rvpi: assets.reduce((sum, asset) => sum + asset.performance.rvpi, 0) / assets.length,
      currentYield: assets.reduce((sum, asset) => sum + asset.performance.currentYield, 0) / assets.length,
      totalReturn: (totalValue - totalInvested) / totalInvested,
      benchmarkComparison: 0.04,
      riskAdjustedReturn: assets.reduce((sum, asset) => sum + asset.performance.riskAdjustedReturn, 0) / assets.length
    },
    allocationTargets: {
      traditional: 0.40, // TechCorp + HealthCo
      real_estate: 0.35,  // RetailCo + Office + Residential  
      infrastructure: 0.25 // Energy + Telecom + Water
    },
    riskProfile: 'medium',
    managerId: 'unified-manager-001',
    createdAt: '2019-01-01',
    updatedAt: new Date().toISOString().split('T')[0]
  };
}