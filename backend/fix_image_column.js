// Script to fix image column type from VARCHAR(500) to TEXT
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'keselamatan',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD,
});

async function fixImageColumn() {
  try {
    console.log('🔄 Connecting to database...');
    
    // Test connection first
    try {
      const testResult = await pool.query('SELECT NOW()');
      console.log('✅ Database connection successful');
    } catch (connError) {
      console.error('❌ Database connection failed:', connError.message);
      console.error('💡 Make sure:');
      console.error('   1. PostgreSQL service is running');
      console.error('   2. Database credentials in .env are correct');
      process.exit(1);
    }
    
    console.log('🔄 Checking current image column type...');
    
    // Check current column type
    const checkResult = await pool.query(`
      SELECT data_type, character_maximum_length 
      FROM information_schema.columns 
      WHERE table_name = 'reports' AND column_name = 'image';
    `);
    
    if (checkResult.rows.length === 0) {
      console.log('❌ Table "reports" or column "image" does not exist!');
      console.log('💡 Please run database_setup.sql first');
      process.exit(1);
    }
    
    const currentType = checkResult.rows[0].data_type;
    const maxLength = checkResult.rows[0].character_maximum_length;
    
    console.log(`📊 Current image column type: ${currentType}${maxLength ? `(${maxLength})` : ''}`);
    
    if (currentType === 'text' || (currentType === 'character varying' && !maxLength)) {
      console.log('✅ Image column is already TEXT type. No changes needed.');
      await pool.end();
      process.exit(0);
    }
    
    console.log('🔧 Altering image column from VARCHAR to TEXT...');
    
    // Alter the column
    await pool.query(`
      ALTER TABLE reports 
      ALTER COLUMN image TYPE TEXT;
    `);
    
    console.log('✅ Successfully changed image column to TEXT type!');
    
    // Verify the change
    const verifyResult = await pool.query(`
      SELECT data_type 
      FROM information_schema.columns 
      WHERE table_name = 'reports' AND column_name = 'image';
    `);
    
    console.log(`✅ Verified: Image column is now ${verifyResult.rows[0].data_type}`);
    console.log('🎉 Done! You can now upload images without size restrictions.');
    
  } catch (error) {
    console.error('❌ Error fixing image column:', error.message);
    console.error('Error code:', error.code);
    console.error('Error details:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

fixImageColumn();

