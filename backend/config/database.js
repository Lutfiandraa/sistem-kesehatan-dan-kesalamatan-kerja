const { Pool } = require('pg');
require('dotenv').config();
const config = require('./config');

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'keselamatan',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD,
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000, // Increased to 10 seconds
  statement_timeout: 30000, // 30 seconds for query execution
  query_timeout: 30000,
});

// Test database connection
pool.on('connect', () => {
  console.log('✅ Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('❌ Unexpected error on idle client', err);
  // Don't exit process, just log the error
  // The retry logic in query() will handle reconnection
});

// Test connection function
const testConnection = async () => {
  try {
    const result = await pool.query('SELECT NOW()');
    console.log('✅ Database connection test successful:', result.rows[0].now);
    return true;
  } catch (error) {
    console.error('❌ Database connection test failed:', error.message);
    console.error('💡 Make sure:');
    console.error('   1. PostgreSQL service is running');
    console.error('   2. Database "keselamatan" exists');
    console.error('   3. Credentials in .env file are correct');
    return false;
  }
};

// Helper function to execute queries with retry logic
const query = async (text, params, retries = 2) => {
  const start = Date.now();
  let lastError;
  
  for (let i = 0; i <= retries; i++) {
    try {
      const res = await pool.query(text, params);
      const duration = Date.now() - start;
      if (process.env.NODE_ENV === 'development' || !process.env.NODE_ENV) {
        console.log('✅ Query executed', { 
          duration: `${duration}ms`, 
          rows: res.rowCount,
          query: text.substring(0, 100) + '...' 
        });
      }
      return res;
    } catch (error) {
      lastError = error;
      console.error(`❌ Database query error (attempt ${i + 1}/${retries + 1}):`, {
        message: error.message,
        code: error.code,
        detail: error.detail,
        hint: error.hint
      });
      
      // If it's a connection error and we have retries left, wait and retry
      if (i < retries && (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT' || error.code === '57P01')) {
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1))); // Exponential backoff
        continue;
      }
      
      // For other errors or no retries left, throw immediately
      throw error;
    }
  }
  
  throw lastError;
};

// Helper function to get a client from the pool for transactions
const getClient = async () => {
  const client = await pool.connect();
  const query = client.query.bind(client);
  const release = client.release.bind(client);
  
  // Set a timeout of 5 seconds
  const timeout = setTimeout(() => {
    console.error('A client has been checked out for more than 5 seconds!');
  }, 5000);
  
  client.release = () => {
    clearTimeout(timeout);
    return release();
  };
  
  return client;
};

module.exports = {
  pool,
  query,
  getClient,
  testConnection,
};

