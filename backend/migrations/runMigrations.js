const fs = require('fs');
const path = require('path');
const { query } = require('../config/database');

async function runMigrations() {
  try {
    console.log('🔄 Starting database migrations...');
    
    // Read migration files in order
    const migrationsDir = path.join(__dirname);
    const migrationFiles = fs.readdirSync(migrationsDir)
      .filter(file => file.endsWith('.sql'))
      .sort();
    
    if (migrationFiles.length === 0) {
      console.log('⚠️  No migration files found');
      return;
    }
    
    // Create migrations tracking table
    await query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        id SERIAL PRIMARY KEY,
        filename VARCHAR(255) UNIQUE NOT NULL,
        executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Execute each migration
    for (const file of migrationFiles) {
      const filePath = path.join(migrationsDir, file);
      
      // Check if migration already executed
      const checkResult = await query(
        'SELECT * FROM schema_migrations WHERE filename = $1',
        [file]
      );
      
      if (checkResult.rows.length > 0) {
        console.log(`⏭️  Skipping ${file} (already executed)`);
        continue;
      }
      
      console.log(`📄 Executing migration: ${file}`);
      const sql = fs.readFileSync(filePath, 'utf8');
      
      // Execute migration
      await query(sql);
      
      // Record migration
      await query(
        'INSERT INTO schema_migrations (filename) VALUES ($1)',
        [file]
      );
      
      console.log(`✅ Completed migration: ${file}`);
    }
    
    console.log('✅ All migrations completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

runMigrations();

