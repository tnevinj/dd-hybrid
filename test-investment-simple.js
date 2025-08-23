// Simple test script for InvestmentService - direct database test
const db = require('./src/lib/database').default;

try {
  // Test if we can query the investments table
  const stmt = db.prepare('SELECT COUNT(*) as count FROM investments');
  const result = stmt.get();
  
  console.log('✅ Database connection successful');
  console.log('📊 Investments count:', result.count);

  // Try to insert a test investment
  const insertStmt = db.prepare(`
    INSERT INTO investments (id, name, investment_type, asset_type, status, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  
  const testId = 'test-' + Date.now();
  const now = new Date().toISOString();
  
  insertStmt.run(
    testId,
    'Direct Test Investment',
    'internal',
    'traditional',
    'active',
    now,
    now
  );
  
  console.log('✅ Test investment inserted with ID:', testId);
  
  // Verify the insertion
  const verifyStmt = db.prepare('SELECT * FROM investments WHERE id = ?');
  const inserted = verifyStmt.get(testId);
  
  console.log('✅ Investment verified:', inserted.name);
  
} catch (error) {
  console.error('❌ Error:', error.message);
}
