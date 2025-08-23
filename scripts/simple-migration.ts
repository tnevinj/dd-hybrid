import db from '../src/lib/database';

/**
 * Simple migration script that uses INSERT INTO SELECT to avoid column count issues
 */
async function simpleMigration() {
  console.log('🚀 Starting simple migration to unified investments model...');

  try {
    // Clear any existing data
    db.prepare('DELETE FROM investments').run();
    console.log('🧹 Cleared existing investments data');

    // Migrate portfolio assets using INSERT INTO SELECT
    console.log('📦 Migrating portfolio assets...');
    const portfolioResult = db.prepare(`
      INSERT INTO investments (
        id, name, investment_type, asset_type, description, status,
        current_value, acquisition_value, geography, sector, risk_rating,
        esg_scores, specific_metrics, portfolio_id, acquisition_date,
        location_country, location_region, location_city, jobs_created,
        carbon_footprint, sustainability_certifications, tags, created_at, updated_at
      )
      SELECT 
        id, name, 'internal' as investment_type, asset_type, description, 
        CASE WHEN status = 'divested' THEN 'divested' ELSE 'active' END as status,
        current_value, acquisition_value,
        COALESCE(location_country, location_region, location_city) as geography,
        sector, risk_rating,
        json_object(
          'environmental', environmental_score,
          'social', social_score,
          'governance', governance_score,
          'overall', overall_esg_score
        ) as esg_scores,
        specific_metrics, portfolio_id, acquisition_date,
        location_country, location_region, location_city, jobs_created,
        carbon_footprint, sustainability_certifications, tags, created_at, updated_at
      FROM portfolio_assets
    `).run();

    console.log(`✅ Migrated ${portfolioResult.changes} portfolio assets`);

    // Migrate deal opportunities using INSERT INTO SELECT
    console.log('🤝 Migrating deal opportunities...');
    const dealResult = db.prepare(`
      INSERT INTO investments (
        id, name, investment_type, asset_type, description, status,
        target_value, expected_return, expected_risk, expected_multiple,
        expected_irr, expected_holding_period, geography, sector, seller,
        vintage, nav_percentage, due_diligence_project_id, submission_id,
        ai_confidence, similar_investments, ai_recommendations, workspace_id,
        created_at, updated_at
      )
      SELECT 
        id, name, 'external' as investment_type, asset_type, description,
        CASE 
          WHEN status = 'rejected' THEN 'rejected'
          WHEN status = 'approved' THEN 'structuring'
          ELSE 'screening'
        END as status,
        ask_price as target_value, expected_return, expected_risk, expected_multiple,
        expected_irr, expected_holding_period, geography, sector, seller,
        vintage, nav_percentage, due_diligence_project_id, submission_id,
        ai_confidence, similar_deals as similar_investments, ai_recommendations, workspace_id,
        created_at, updated_at
      FROM deal_opportunities
    `).run();

    console.log(`✅ Migrated ${dealResult.changes} deal opportunities`);

    // Verify migration
    const totalInvestments = db.prepare('SELECT COUNT(*) as count FROM investments').get() as { count: number };
    console.log(`📊 Total investments after migration: ${totalInvestments.count}`);

    // Show breakdown by type
    const byType = db.prepare('SELECT investment_type, COUNT(*) as count FROM investments GROUP BY investment_type').all();
    console.log('📈 Investment type breakdown:', byType);

    console.log('🎉 Simple migration completed successfully!');

  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

// Run migration if this script is executed directly
if (require.main === module) {
  simpleMigration();
}

export { simpleMigration };
