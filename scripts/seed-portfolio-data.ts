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

  return {
    techCorp,
    healthTechCorp,
    officeComplex,
    retailCenter,
    solarFacility,
    windFarm
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