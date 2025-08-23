import db from '../src/lib/database';
import { v4 as uuidv4 } from 'uuid';

/**
 * Migration script to backfill investments table from existing portfolio_assets and deal_opportunities
 */
async function migrateToUnifiedInvestments() {
  console.log('🚀 Starting migration to unified investments model...');

  try {
    // Migrate portfolio assets (internal investments)
    console.log('📦 Migrating portfolio assets...');
    const portfolioAssets = db.prepare('SELECT * FROM portfolio_assets').all() as any[];
    
    for (const asset of portfolioAssets) {
      const investmentData = {
        id: asset.id,
        name: asset.name,
        investment_type: 'internal' as const,
        asset_type: asset.asset_type,
        description: asset.description,
        status: asset.status === 'divested' ? 'divested' : 'active' as const,
        current_value: asset.current_value,
        acquisition_value: asset.acquisition_value,
        geography: asset.location_country || asset.location_region || asset.location_city,
        sector: asset.sector,
        risk_rating: asset.risk_rating,
        esg_scores: {
          environmental: asset.environmental_score,
          social: asset.social_score,
          governance: asset.governance_score,
          overall: asset.overall_esg_score
        },
        specific_metrics: asset.specific_metrics ? JSON.parse(asset.specific_metrics) : {},
        portfolio_id: asset.portfolio_id,
        acquisition_date: asset.acquisition_date,
        location_country: asset.location_country,
        location_region: asset.location_region,
        location_city: asset.location_city,
        jobs_created: asset.jobs_created,
        carbon_footprint: asset.carbon_footprint,
        sustainability_certifications: asset.sustainability_certifications ? JSON.parse(asset.sustainability_certifications) : [],
        tags: asset.tags ? JSON.parse(asset.tags) : [],
        created_at: asset.created_at,
        updated_at: asset.updated_at
      };

      // Insert into investments table
      const stmt = db.prepare(`
        INSERT INTO investments (
          id, name, investment_type, asset_type, description, status,
          current_value, acquisition_value, geography, sector, risk_rating,
          esg_scores, specific_metrics, portfolio_id, acquisition_date,
          location_country, location_region, location_city, jobs_created,
          carbon_footprint, sustainability_certifications, tags, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      stmt.run(
        investmentData.id,
        investmentData.name,
        investmentData.investment_type,
        investmentData.asset_type,
        investmentData.description,
        investmentData.status,
        investmentData.current_value,
        investmentData.acquisition_value,
        investmentData.geography,
        investmentData.sector,
        investmentData.risk_rating,
        JSON.stringify(investmentData.esg_scores),
        JSON.stringify(investmentData.specific_metrics),
        investmentData.portfolio_id,
        investmentData.acquisition_date,
        investmentData.location_country,
        investmentData.location_region,
        investmentData.location_city,
        investmentData.jobs_created,
        investmentData.carbon_footprint,
        JSON.stringify(investmentData.sustainability_certifications),
        JSON.stringify(investmentData.tags),
        investmentData.created_at,
        investmentData.updated_at
      );
    }

    console.log(`✅ Migrated ${portfolioAssets.length} portfolio assets`);

    // Migrate deal opportunities (external investments)
    console.log('🤝 Migrating deal opportunities...');
    const dealOpportunities = db.prepare('SELECT * FROM deal_opportunities').all() as any[];
    
    for (const opportunity of dealOpportunities) {
      const investmentData = {
        id: opportunity.id,
        name: opportunity.name,
        investment_type: 'external' as const,
        asset_type: opportunity.asset_type,
        description: opportunity.description,
        status: opportunity.status === 'rejected' ? 'rejected' : 
                opportunity.status === 'approved' ? 'structuring' : 'screening' as const,
        target_value: opportunity.ask_price,
        expected_return: opportunity.expected_return,
        expected_risk: opportunity.expected_risk,
        expected_multiple: opportunity.expected_multiple,
        expected_irr: opportunity.expected_irr,
        expected_holding_period: opportunity.expected_holding_period,
        geography: opportunity.geography,
        sector: opportunity.sector,
        seller: opportunity.seller,
        vintage: opportunity.vintage,
        nav_percentage: opportunity.nav_percentage,
        due_diligence_project_id: opportunity.due_diligence_project_id,
        submission_id: opportunity.submission_id,
        ai_confidence: opportunity.ai_confidence,
        similar_investments: opportunity.similar_deals ? JSON.parse(opportunity.similar_deals) : [],
        ai_recommendations: opportunity.ai_recommendations ? JSON.parse(opportunity.ai_recommendations) : [],
        workspace_id: opportunity.workspace_id,
        created_at: opportunity.created_at,
        updated_at: opportunity.updated_at
      };

      // Insert into investments table - simplified to avoid column count mismatch
      const stmt = db.prepare(`
        INSERT INTO investments (
          id, name, investment_type, asset_type, description, status,
          target_value, expected_return, expected_risk, expected_multiple,
          expected_irr, expected_holding_period, geography, sector, seller,
          vintage, nav_percentage, due_diligence_project_id, submission_id,
          ai_confidence, similar_investments, ai_recommendations, workspace_id,
          created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      stmt.run(
        investmentData.id,
        investmentData.name,
        investmentData.investment_type,
        investmentData.asset_type,
        investmentData.description || null,
        investmentData.status,
        investmentData.target_value || null,
        investmentData.expected_return || null,
        investmentData.expected_risk || null,
        investmentData.expected_multiple || null,
        investmentData.expected_irr || null,
        investmentData.expected_holding_period || null,
        investmentData.geography || null,
        investmentData.sector || null,
        investmentData.seller || null,
        investmentData.vintage || null,
        investmentData.nav_percentage || null,
        investmentData.due_diligence_project_id || null,
        investmentData.submission_id || null,
        investmentData.ai_confidence || null,
        JSON.stringify(investmentData.similar_investments),
        JSON.stringify(investmentData.ai_recommendations),
        investmentData.workspace_id || null,
        investmentData.created_at,
        investmentData.updated_at
      );
    }

    console.log(`✅ Migrated ${dealOpportunities.length} deal opportunities`);

    // Verify migration
    const totalInvestments = db.prepare('SELECT COUNT(*) as count FROM investments').get() as { count: number };
    console.log(`📊 Total investments after migration: ${totalInvestments.count}`);

    // Show breakdown by type
    const byType = db.prepare('SELECT investment_type, COUNT(*) as count FROM investments GROUP BY investment_type').all();
    console.log('📈 Investment type breakdown:', byType);

    console.log('🎉 Migration completed successfully!');

  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

// Run migration if this script is executed directly
if (require.main === module) {
  migrateToUnifiedInvestments();
}

export { migrateToUnifiedInvestments };
