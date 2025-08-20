import { PortfolioService, PortfolioAssetService } from '../src/lib/services/database';

const seedPortfolios = () => {
  console.log('Seeding portfolios...');
  
  // Create main portfolio
  const mainPortfolio = PortfolioService.create({
    name: 'Main Portfolio',
    description: 'Primary investment portfolio with diversified assets',
    asset_types: ['traditional', 'real_estate', 'infrastructure'],
    allocation_targets: {
      traditional: 0.6,
      real_estate: 0.25,
      infrastructure: 0.15
    },
    risk_profile: 'medium',
    manager_id: 'user-1'
  });
  
  console.log(`✓ Created portfolio: ${mainPortfolio.name}`);

  // Create growth portfolio
  const growthPortfolio = PortfolioService.create({
    name: 'Growth Portfolio',
    description: 'High-growth focused portfolio targeting technology and innovation',
    asset_types: ['traditional'],
    allocation_targets: {
      traditional: 1.0
    },
    risk_profile: 'high',
    manager_id: 'user-1'
  });
  
  console.log(`✓ Created portfolio: ${growthPortfolio.name}`);

  // Create conservative portfolio
  const conservativePortfolio = PortfolioService.create({
    name: 'Conservative Portfolio',
    description: 'Low-risk portfolio focused on stable returns',
    asset_types: ['real_estate', 'infrastructure'],
    allocation_targets: {
      real_estate: 0.7,
      infrastructure: 0.3
    },
    risk_profile: 'low',
    manager_id: 'user-2'
  });
  
  console.log(`✓ Created portfolio: ${conservativePortfolio.name}`);

  return { mainPortfolio, growthPortfolio, conservativePortfolio };
};

const seedAssets = (portfolios: any) => {
  console.log('Seeding portfolio assets...');
  
  // Traditional assets for main portfolio
  const techCorp = PortfolioAssetService.create({
    portfolio_id: portfolios.mainPortfolio.id,
    name: 'TechCorp Inc',
    asset_type: 'traditional',
    description: 'B2B SaaS company specializing in workflow automation',
    acquisition_date: '2021-03-15',
    acquisition_value: 500000000, // $5M in cents
    current_value: 1200000000, // $12M in cents
    location_country: 'United States',
    location_region: 'North America',
    location_city: 'San Francisco',
    sector: 'Technology',
    tags: ['SaaS', 'B2B', 'Growth'],
    risk_rating: 'medium',
    specific_metrics: {
      companyStage: 'series_b',
      fundingRounds: 3,
      employeeCount: 180,
      revenue: 1500000000, // $15M in cents
      ebitda: 300000000, // $3M in cents
      debtToEquity: 0.2,
      boardSeats: 2,
      ownershipPercentage: 25
    }
  });
  
  console.log(`✓ Created asset: ${techCorp.name}`);

  const healthTechCorp = PortfolioAssetService.create({
    portfolio_id: portfolios.growthPortfolio.id,
    name: 'HealthTech Solutions',
    asset_type: 'traditional',
    description: 'Digital health platform for emerging markets',
    acquisition_date: '2022-06-20',
    acquisition_value: 2500000000, // $25M in cents
    current_value: 4500000000, // $45M in cents
    location_country: 'United States',
    location_region: 'North America',
    location_city: 'Boston',
    sector: 'Healthcare',
    tags: ['HealthTech', 'Digital Health', 'B2B'],
    risk_rating: 'high',
    specific_metrics: {
      companyStage: 'series_c',
      fundingRounds: 4,
      employeeCount: 320,
      revenue: 3500000000, // $35M in cents
      ebitda: 700000000, // $7M in cents
      debtToEquity: 0.1,
      boardSeats: 3,
      ownershipPercentage: 35
    }
  });
  
  console.log(`✓ Created asset: ${healthTechCorp.name}`);

  // Real estate asset for main portfolio
  const officeComplex = PortfolioAssetService.create({
    portfolio_id: portfolios.mainPortfolio.id,
    name: 'Downtown Office Complex',
    asset_type: 'real_estate',
    description: 'Class A office building in downtown financial district',
    acquisition_date: '2020-08-10',
    acquisition_value: 2500000000, // $25M in cents
    current_value: 2850000000, // $28.5M in cents
    location_country: 'United States',
    location_region: 'North America',
    location_city: 'New York',
    sector: 'Real Estate',
    tags: ['Office', 'Class A', 'Core'],
    risk_rating: 'low',
    specific_metrics: {
      propertyType: 'office',
      totalSqFt: 150000,
      occupancyRate: 92,
      avgLeaseLength: 5.5,
      capRate: 5.2,
      noiYield: 6.8,
      vacancyRate: 8,
      avgRentPsf: 45
    }
  });
  
  console.log(`✓ Created asset: ${officeComplex.name}`);

  const retailCenter = PortfolioAssetService.create({
    portfolio_id: portfolios.conservativePortfolio.id,
    name: 'Suburban Retail Center',
    asset_type: 'real_estate',
    description: 'Neighborhood shopping center with anchor tenant',
    acquisition_date: '2019-12-05',
    acquisition_value: 1800000000, // $18M in cents
    current_value: 2100000000, // $21M in cents
    location_country: 'United States',
    location_region: 'North America',
    location_city: 'Atlanta',
    sector: 'Real Estate',
    tags: ['Retail', 'Neighborhood', 'Stable'],
    risk_rating: 'low',
    specific_metrics: {
      propertyType: 'retail',
      totalSqFt: 85000,
      occupancyRate: 95,
      avgLeaseLength: 8.2,
      capRate: 6.8,
      noiYield: 7.5,
      vacancyRate: 5,
      avgRentPsf: 28
    }
  });
  
  console.log(`✓ Created asset: ${retailCenter.name}`);

  // Infrastructure asset for main portfolio
  const solarFacility = PortfolioAssetService.create({
    portfolio_id: portfolios.mainPortfolio.id,
    name: 'Solar Energy Facility',
    asset_type: 'infrastructure',
    description: '150MW solar photovoltaic power generation facility',
    acquisition_date: '2019-11-20',
    acquisition_value: 8000000000, // $80M in cents
    current_value: 8500000000, // $85M in cents
    location_country: 'United States',
    location_region: 'North America',
    location_city: 'Phoenix',
    sector: 'Energy',
    tags: ['Solar', 'Renewable', 'Infrastructure'],
    risk_rating: 'low',
    specific_metrics: {
      assetCategory: 'energy',
      capacityUtilization: 88,
      operationalEfficiency: 94,
      maintenanceScore: 85,
      regulatoryCompliance: 98,
      contractedRevenue: 850000000, // $8.5M in cents
      availabilityRate: 96,
      throughputCapacity: 150000,
      averageLifespan: 25
    }
  });
  
  console.log(`✓ Created asset: ${solarFacility.name}`);

  const windFarm = PortfolioAssetService.create({
    portfolio_id: portfolios.conservativePortfolio.id,
    name: 'Prairie Wind Farm',
    asset_type: 'infrastructure',
    description: '200MW wind power generation facility',
    acquisition_date: '2020-03-15',
    acquisition_value: 12000000000, // $120M in cents
    current_value: 13500000000, // $135M in cents
    location_country: 'United States',
    location_region: 'North America',
    location_city: 'Kansas City',
    sector: 'Energy',
    tags: ['Wind', 'Renewable', 'Infrastructure'],
    risk_rating: 'medium',
    specific_metrics: {
      assetCategory: 'energy',
      capacityUtilization: 85,
      operationalEfficiency: 91,
      maintenanceScore: 88,
      regulatoryCompliance: 97,
      contractedRevenue: 1200000000, // $12M in cents
      availabilityRate: 94,
      throughputCapacity: 200000,
      averageLifespan: 20
    }
  });
  
  console.log(`✓ Created asset: ${windFarm.name}`);

  // Additional diverse assets for main portfolio
  const finTechStartup = PortfolioAssetService.create({
    portfolio_id: portfolios.mainPortfolio.id,
    name: 'PayFlow Technologies',
    asset_type: 'traditional',
    description: 'Digital payments platform for SMEs in Latin America',
    acquisition_date: '2022-01-15',
    acquisition_value: 1500000000, // $15M in cents
    current_value: 2800000000, // $28M in cents
    location_country: 'Brazil',
    location_region: 'South America',
    location_city: 'São Paulo',
    sector: 'Financial Services',
    tags: ['FinTech', 'Payments', 'B2B', 'LATAM'],
    risk_rating: 'high',
    specific_metrics: {
      companyStage: 'series_b',
      fundingRounds: 3,
      employeeCount: 145,
      revenue: 1200000000, // $12M in cents
      ebitda: 180000000, // $1.8M in cents
      debtToEquity: 0.15,
      boardSeats: 2,
      ownershipPercentage: 28
    }
  });

  const bioTechCorp = PortfolioAssetService.create({
    portfolio_id: portfolios.growthPortfolio.id,
    name: 'GenoMed Therapeutics',
    asset_type: 'traditional',
    description: 'Gene therapy company developing treatments for rare diseases',
    acquisition_date: '2021-09-10',
    acquisition_value: 8000000000, // $80M in cents
    current_value: 15000000000, // $150M in cents
    location_country: 'Switzerland',
    location_region: 'Europe',
    location_city: 'Basel',
    sector: 'Biotechnology',
    tags: ['Biotech', 'Gene Therapy', 'Pharmaceuticals'],
    risk_rating: 'high',
    specific_metrics: {
      companyStage: 'series_c',
      fundingRounds: 4,
      employeeCount: 280,
      revenue: 500000000, // $5M in cents
      ebitda: -2000000000, // -$20M in cents (R&D heavy)
      debtToEquity: 0.05,
      boardSeats: 2,
      ownershipPercentage: 22
    }
  });

  const industrialManufacturing = PortfolioAssetService.create({
    portfolio_id: portfolios.mainPortfolio.id,
    name: 'Precision Components GmbH',
    asset_type: 'traditional',
    description: 'Automotive parts manufacturer specializing in electric vehicle components',
    acquisition_date: '2020-05-20',
    acquisition_value: 4500000000, // $45M in cents
    current_value: 6200000000, // $62M in cents
    location_country: 'Germany',
    location_region: 'Europe',
    location_city: 'Stuttgart',
    sector: 'Manufacturing',
    tags: ['Automotive', 'EV Components', 'Manufacturing'],
    risk_rating: 'medium',
    specific_metrics: {
      companyStage: 'mature',
      fundingRounds: 1,
      employeeCount: 520,
      revenue: 8500000000, // $85M in cents
      ebitda: 1200000000, // $12M in cents
      debtToEquity: 0.45,
      boardSeats: 3,
      ownershipPercentage: 65
    }
  });

  // More real estate variety
  const luxuryHotel = PortfolioAssetService.create({
    portfolio_id: portfolios.mainPortfolio.id,
    name: 'Meridian Luxury Resort',
    asset_type: 'real_estate',
    description: '5-star beachfront resort with 180 rooms and spa facilities',
    acquisition_date: '2019-03-12',
    acquisition_value: 12000000000, // $120M in cents
    current_value: 13800000000, // $138M in cents
    location_country: 'Thailand',
    location_region: 'Asia',
    location_city: 'Phuket',
    sector: 'Hospitality',
    tags: ['Hotel', 'Luxury', 'Resort', 'Hospitality'],
    risk_rating: 'medium',
    specific_metrics: {
      propertyType: 'hospitality',
      totalRooms: 180,
      occupancyRate: 78,
      avgDailyRate: 42500, // $425 in cents
      revPAR: 33150, // $331.50 in cents
      staffCount: 280,
      seasonalityFactor: 0.65
    }
  });

  const industrialWarehouse = PortfolioAssetService.create({
    portfolio_id: portfolios.conservativePortfolio.id,
    name: 'Metro Logistics Hub',
    asset_type: 'real_estate',
    description: 'Last-mile distribution center serving major metropolitan area',
    acquisition_date: '2021-08-30',
    acquisition_value: 3500000000, // $35M in cents
    current_value: 4200000000, // $42M in cents
    location_country: 'United Kingdom',
    location_region: 'Europe',
    location_city: 'London',
    sector: 'Industrial',
    tags: ['Warehouse', 'Logistics', 'Industrial', 'Last-Mile'],
    risk_rating: 'low',
    specific_metrics: {
      propertyType: 'industrial',
      totalSqFt: 250000,
      occupancyRate: 100,
      avgLeaseLength: 12,
      capRate: 5.8,
      noiYield: 6.9,
      clearHeight: 32,
      truckDoors: 48
    }
  });

  const studentHousing = PortfolioAssetService.create({
    portfolio_id: portfolios.growthPortfolio.id,
    name: 'University Village Residences',
    asset_type: 'real_estate',
    description: 'Purpose-built student accommodation near major university',
    acquisition_date: '2020-07-15',
    acquisition_value: 2800000000, // $28M in cents
    current_value: 3200000000, // $32M in cents
    location_country: 'Australia',
    location_region: 'Oceania',
    location_city: 'Melbourne',
    sector: 'Student Housing',
    tags: ['Student Housing', 'Education', 'Residential'],
    risk_rating: 'medium',
    specific_metrics: {
      propertyType: 'residential',
      totalBeds: 324,
      occupancyRate: 96,
      avgWeeklyRent: 32500, // $325 in cents
      studentSatisfaction: 4.3,
      proximityToUni: 0.8,
      academicYearOccupancy: 98
    }
  });

  // More infrastructure variety
  const tollRoad = PortfolioAssetService.create({
    portfolio_id: portfolios.conservativePortfolio.id,
    name: 'Highway 401 Concession',
    asset_type: 'infrastructure',
    description: '50km toll road concession with 30-year operating agreement',
    acquisition_date: '2018-11-10',
    acquisition_value: 25000000000, // $250M in cents
    current_value: 27500000000, // $275M in cents
    location_country: 'Canada',
    location_region: 'North America',
    location_city: 'Toronto',
    sector: 'Transportation',
    tags: ['Toll Road', 'Transportation', 'Concession'],
    risk_rating: 'low',
    specific_metrics: {
      assetCategory: 'transportation',
      dailyTrafficVolume: 45000,
      averageTollRevenue: 850000000, // $8.5M in cents annually
      concessionYearsRemaining: 22,
      maintenanceScore: 92,
      regulatoryCompliance: 99,
      capacityUtilization: 72,
      weatherAdjustedRevenue: 0.95
    }
  });

  const dataCenter = PortfolioAssetService.create({
    portfolio_id: portfolios.mainPortfolio.id,
    name: 'CloudCore Data Center',
    asset_type: 'infrastructure',
    description: 'Tier III data center facility serving hyperscale cloud providers',
    acquisition_date: '2021-04-25',
    acquisition_value: 18000000000, // $180M in cents
    current_value: 21600000000, // $216M in cents
    location_country: 'Ireland',
    location_region: 'Europe',
    location_city: 'Dublin',
    sector: 'Digital Infrastructure',
    tags: ['Data Center', 'Cloud', 'Digital Infrastructure'],
    risk_rating: 'medium',
    specific_metrics: {
      assetCategory: 'digital',
      powerCapacity: 25000, // 25MW
      occupancyRate: 87,
      contractedRevenue: 1800000000, // $18M in cents
      pue: 1.35, // Power Usage Effectiveness
      uptime: 99.98,
      hyperscaleClientPercentage: 78,
      renewableEnergyPercentage: 85
    }
  });

  const waterTreatment = PortfolioAssetService.create({
    portfolio_id: portfolios.conservativePortfolio.id,
    name: 'AquaPure Treatment Facility',
    asset_type: 'infrastructure',
    description: 'Municipal water treatment facility serving 500k residents',
    acquisition_date: '2019-09-18',
    acquisition_value: 15000000000, // $150M in cents
    current_value: 16500000000, // $165M in cents
    location_country: 'Netherlands',
    location_region: 'Europe',
    location_city: 'Amsterdam',
    sector: 'Utilities',
    tags: ['Water', 'Utilities', 'Municipal', 'ESG'],
    risk_rating: 'low',
    specific_metrics: {
      assetCategory: 'utilities',
      dailyCapacity: 180000, // cubic meters
      populationServed: 500000,
      contractedRevenue: 1200000000, // $12M in cents
      regulatoryCompliance: 100,
      waterQualityScore: 98,
      operationalEfficiency: 94,
      esgCertifications: ['ISO14001', 'EU_TAXONOMY']
    }
  });

  // Add assets to growth portfolio
  const agriTech = PortfolioAssetService.create({
    portfolio_id: portfolios.growthPortfolio.id,
    name: 'FarmBot Precision Agriculture',
    asset_type: 'traditional',
    description: 'AI-powered precision agriculture and crop monitoring platform',
    acquisition_date: '2022-02-20',
    acquisition_value: 800000000, // $8M in cents
    current_value: 1600000000, // $16M in cents
    location_country: 'India',
    location_region: 'Asia',
    location_city: 'Bangalore',
    sector: 'Agriculture Technology',
    tags: ['AgTech', 'AI', 'Agriculture', 'Sustainability'],
    risk_rating: 'high',
    specific_metrics: {
      companyStage: 'series_a',
      fundingRounds: 2,
      employeeCount: 85,
      revenue: 400000000, // $4M in cents
      ebitda: -200000000, // -$2M in cents
      debtToEquity: 0.1,
      boardSeats: 1,
      ownershipPercentage: 35
    }
  });

  const cleanTech = PortfolioAssetService.create({
    portfolio_id: portfolios.growthPortfolio.id,
    name: 'BatteryNext Energy Storage',
    asset_type: 'traditional',
    description: 'Next-generation battery technology for grid-scale energy storage',
    acquisition_date: '2021-11-05',
    acquisition_value: 3000000000, // $30M in cents
    current_value: 5500000000, // $55M in cents
    location_country: 'South Korea',
    location_region: 'Asia',
    location_city: 'Seoul',
    sector: 'Clean Technology',
    tags: ['CleanTech', 'Battery', 'Energy Storage', 'Grid'],
    risk_rating: 'high',
    specific_metrics: {
      companyStage: 'series_b',
      fundingRounds: 3,
      employeeCount: 195,
      revenue: 1500000000, // $15M in cents
      ebitda: -500000000, // -$5M in cents
      debtToEquity: 0.12,
      boardSeats: 2,
      ownershipPercentage: 25
    }
  });

  console.log(`✓ Created additional diverse assets`);

  return {
    techCorp,
    healthTechCorp,
    officeComplex,
    retailCenter,
    solarFacility,
    windFarm,
    finTechStartup,
    bioTechCorp,
    industrialManufacturing,
    luxuryHotel,
    industrialWarehouse,
    studentHousing,
    tollRoad,
    dataCenter,
    waterTreatment,
    agriTech,
    cleanTech
  };
};

// Run seeding
console.log('🌱 Starting portfolio database seeding...');

try {
  const portfolios = seedPortfolios();
  const assets = seedAssets(portfolios);
  
  console.log('✅ Portfolio database seeding completed successfully!');
  
  // Print summary
  console.log('\n📊 Portfolio Database Statistics:');
  const allPortfolios = PortfolioService.getAll();
  const allAssets = PortfolioAssetService.getAll();
  
  console.log(`- Portfolios: ${allPortfolios.length}`);
  console.log(`- Assets: ${allAssets.length}`);
  
  allPortfolios.forEach(portfolio => {
    const portfolioAssets = PortfolioAssetService.getByPortfolioId(portfolio.id);
    const totalValue = portfolioAssets.reduce((sum, asset) => sum + asset.current_value, 0);
    console.log(`  - ${portfolio.name}: ${portfolioAssets.length} assets, $${(totalValue / 100 / 1000000).toFixed(1)}M total value`);
  });
  
} catch (error) {
  console.error('❌ Portfolio seeding failed:', error);
  process.exit(1);
}