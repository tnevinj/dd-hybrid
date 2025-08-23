// Simple test script for InvestmentService
const { InvestmentService } = require('./src/lib/services/database/investment-service');

try {
  // Create a test investment
  const investment = InvestmentService.create({
    name: 'Test Unified Investment',
    investment_type: 'internal',
    asset_type: 'traditional',
    status: 'active',
    current_value: 1000000,
    target_value: 1500000,
    description: 'Test investment for unified investment model',
    geography: 'North America',
    sector: 'Technology',
    risk_rating: 'medium'
  });

  console.log('✅ Investment created successfully:');
  console.log('ID:', investment.id);
  console.log('Name:', investment.name);
  console.log('Type:', investment.investment_type);
  console.log('Status:', investment.status);
  console.log('Value:', investment.current_value);

  // Get all investments
  const allInvestments = InvestmentService.getAll();
  console.log('\n📊 Total investments:', allInvestments.length);

  // Get statistics
  const stats = InvestmentService.getStatistics();
  console.log('\n📈 Investment Statistics:');
  console.log('Total:', stats.total);
  console.log('By Type:', stats.byType);
  console.log('By Status:', stats.byStatus);
  console.log('Total Value:', stats.totalValue);

} catch (error) {
  console.error('❌ Error:', error.message);
}
