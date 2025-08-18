import { DealOpportunityService, DealScreeningTemplateService, DealScoreService } from './services/database';

export function seedDealScreening() {
  console.log('Seeding deal screening data...');

  // Create default screening templates
  const defaultTemplate = DealScreeningTemplateService.create({
    name: 'Comprehensive Deal Screening',
    description: 'Standard template for evaluating private equity opportunities',
    criteria: [
      {
        id: 'financial-metrics',
        name: 'Financial Performance',
        category: 'financial',
        description: 'Evaluation of revenue, EBITDA, and growth metrics',
        weight: 0.35,
        scoreFunction: 'linear',
        minValue: 0,
        maxValue: 100,
        isRequired: true,
        isActive: true
      },
      {
        id: 'market-position',
        name: 'Market Position',
        category: 'strategic', 
        description: 'Competitive positioning and market share',
        weight: 0.25,
        scoreFunction: 'linear',
        minValue: 0,
        maxValue: 100,
        isRequired: true,
        isActive: true
      },
      {
        id: 'management-team',
        name: 'Management Quality',
        category: 'operational',
        description: 'Leadership team experience and track record',
        weight: 0.20,
        scoreFunction: 'linear',
        minValue: 0,
        maxValue: 100,
        isRequired: true,
        isActive: true
      },
      {
        id: 'risk-factors',
        name: 'Risk Assessment',
        category: 'risk',
        description: 'Industry, operational, and financial risks',
        weight: 0.15,
        scoreFunction: 'linear',
        minValue: 0,
        maxValue: 100,
        isRequired: true,
        isActive: true
      },
      {
        id: 'esg-score',
        name: 'ESG Factors',
        category: 'esg',
        description: 'Environmental, social, and governance considerations',
        weight: 0.05,
        scoreFunction: 'linear',
        minValue: 0,
        maxValue: 100,
        isRequired: false,
        isActive: true
      }
    ],
    is_default: true,
    ai_enhanced: true,
    automation_level: 'assisted'
  });

  const techTemplate = DealScreeningTemplateService.create({
    name: 'Technology Sector Focus',
    description: 'Specialized template for technology investments',
    criteria: [
      {
        id: 'tech-innovation',
        name: 'Technology & Innovation',
        category: 'strategic',
        description: 'IP portfolio, R&D capabilities, and technical moat',
        weight: 0.30,
        scoreFunction: 'exponential',
        minValue: 0,
        maxValue: 100,
        isRequired: true,
        isActive: true
      },
      {
        id: 'market-scalability',
        name: 'Market Scalability',
        category: 'strategic',
        description: 'Addressable market size and growth potential',
        weight: 0.25,
        scoreFunction: 'linear',
        minValue: 0,
        maxValue: 100,
        isRequired: true,
        isActive: true
      },
      {
        id: 'recurring-revenue',
        name: 'Revenue Model',
        category: 'financial',
        description: 'Recurring revenue streams and customer retention',
        weight: 0.25,
        scoreFunction: 'threshold',
        minValue: 0,
        maxValue: 100,
        thresholdValue: 70,
        isRequired: true,
        isActive: true
      },
      {
        id: 'digital-moat',
        name: 'Competitive Moat',
        category: 'strategic',
        description: 'Network effects, switching costs, and barriers to entry',
        weight: 0.20,
        scoreFunction: 'exponential',
        minValue: 0,
        maxValue: 100,
        isRequired: true,
        isActive: true
      }
    ],
    is_default: false,
    ai_enhanced: true,
    automation_level: 'autonomous'
  });

  // Create sample deal opportunities
  const opportunity1 = DealOpportunityService.create({
    name: 'TechFlow Solutions',
    description: 'B2B SaaS platform for workflow automation in manufacturing',
    seller: 'Growth Capital Partners',
    asset_type: 'direct',
    vintage: '2024',
    sector: 'Technology',
    geography: 'North America',
    ask_price: 12500000000, // $125M in cents
    nav_percentage: 85,
    expected_return: 25,
    expected_risk: 15,
    expected_multiple: 2.8,
    expected_irr: 28,
    expected_holding_period: 48 // 4 years
  });

  const opportunity2 = DealOpportunityService.create({
    name: 'Healthcare Analytics Corp',
    description: 'AI-powered healthcare data analytics and insights platform',
    seller: 'MedTech Ventures',
    asset_type: 'co-investment',
    vintage: '2024',
    sector: 'Healthcare',
    geography: 'North America',
    ask_price: 7500000000, // $75M in cents
    nav_percentage: 90,
    expected_return: 22,
    expected_risk: 18,
    expected_multiple: 2.5,
    expected_irr: 24,
    expected_holding_period: 60 // 5 years
  });

  const opportunity3 = DealOpportunityService.create({
    name: 'Industrial Robotics Fund III',
    description: 'Growth equity fund focused on industrial automation companies',
    seller: 'RoboTech Capital',
    asset_type: 'fund',
    vintage: '2024',
    sector: 'Industrial',
    geography: 'Europe',
    ask_price: 5000000000, // $50M in cents
    nav_percentage: 80,
    expected_return: 18,
    expected_risk: 12,
    expected_multiple: 2.2,
    expected_irr: 20,
    expected_holding_period: 72 // 6 years
  });

  // Create scores for TechFlow Solutions using the default template
  DealScoreService.create(
    opportunity1.id,
    defaultTemplate.id,
    'financial-metrics',
    'Financial Performance',
    85,
    0.35,
    'Strong revenue growth of 40% YoY with improving margins',
    'System'
  );

  DealScoreService.create(
    opportunity1.id,
    defaultTemplate.id,
    'market-position',
    'Market Position',
    75,
    0.25,
    'Leading position in manufacturing workflow automation niche',
    'System'
  );

  DealScoreService.create(
    opportunity1.id,
    defaultTemplate.id,
    'management-team',
    'Management Quality',
    90,
    0.20,
    'Experienced team with track record of successful exits',
    'System'
  );

  DealScoreService.create(
    opportunity1.id,
    defaultTemplate.id,
    'risk-factors',
    'Risk Assessment',
    70,
    0.15,
    'Moderate competitive risk, stable customer base',
    'System'
  );

  DealScoreService.create(
    opportunity1.id,
    defaultTemplate.id,
    'esg-score',
    'ESG Factors',
    80,
    0.05,
    'Good governance practices, positive environmental impact',
    'System'
  );

  // Create scores for Healthcare Analytics Corp
  DealScoreService.create(
    opportunity2.id,
    defaultTemplate.id,
    'financial-metrics',
    'Financial Performance',
    78,
    0.35,
    'Solid ARR growth, path to profitability within 18 months',
    'System'
  );

  DealScoreService.create(
    opportunity2.id,
    defaultTemplate.id,
    'market-position',
    'Market Position',
    88,
    0.25,
    'Strong differentiation in healthcare AI analytics market',
    'System'
  );

  DealScoreService.create(
    opportunity2.id,
    defaultTemplate.id,
    'management-team',
    'Management Quality',
    82,
    0.20,
    'Strong technical leadership, recruiting experienced sales team',
    'System'
  );

  DealScoreService.create(
    opportunity2.id,
    defaultTemplate.id,
    'risk-factors',
    'Risk Assessment',
    65,
    0.15,
    'Regulatory compliance risks in healthcare, competitive landscape',
    'System'
  );

  DealScoreService.create(
    opportunity2.id,
    defaultTemplate.id,
    'esg-score',
    'ESG Factors',
    85,
    0.05,
    'Positive social impact in healthcare outcomes',
    'System'
  );

  console.log('Deal screening data seeded successfully');
  console.log(`Created ${DealScreeningTemplateService.getAll().length} templates`);
  console.log(`Created ${DealOpportunityService.getAll().length} opportunities`);
  console.log(`Created ${DealScoreService.getByOpportunityId(opportunity1.id).length + DealScoreService.getByOpportunityId(opportunity2.id).length} scores`);
}

// Run seeding if this file is executed directly
if (require.main === module) {
  seedDealScreening();
}