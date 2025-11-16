const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');
const config = require('./config/config');
const { errorHandler, notFound } = require('./middleware/errorHandler');
const { testConnection } = require('./config/database');

// Import routes
const authRoutes = require('./routes/auth');
const incidentRoutes = require('./routes/incidents');
const publicRoutes = require('./routes/public');

// Initialize Express app
const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: config.cors.origin,
  credentials: true
}));

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging middleware
if (config.nodeEnv === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, config.upload.uploadPath);
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Database health check endpoint
app.get('/health/db', async (req, res) => {
  try {
    const { testConnection } = require('./config/database');
    const isConnected = await testConnection();
    res.json({
      success: isConnected,
      message: isConnected ? 'Database is connected' : 'Database connection failed',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(503).json({
      success: false,
      message: 'Database health check failed',
      error: error.message
    });
  }
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/incidents', incidentRoutes);
app.use('/api/public', publicRoutes);

// 404 handler
app.use(notFound);

// Error handler middleware (must be last)
app.use(errorHandler);

// Start server
const PORT = config.port;

// Test database connection before starting server
const startServer = async () => {
  console.log('🔄 Testing database connection...');
  const dbConnected = await testConnection();
  
  if (!dbConnected) {
    console.log('⚠️  Server will start but database operations may fail');
    console.log('💡 Please check your database configuration in .env file');
  }
  
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📝 Environment: ${config.nodeEnv}`);
    console.log(`🌐 CORS enabled for: ${config.cors.origin}`);
    console.log(`📊 Database: ${config.database.name}`);
    console.log('\n✅ Ready to accept requests!');
  }).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`❌ Port ${PORT} is already in use!`);
      console.error('💡 Solutions:');
      console.error(`   1. Kill the process using port ${PORT}:`);
      console.error(`      netstat -ano | findstr :${PORT}`);
      console.error(`      taskkill /PID <PID> /F`);
      console.error(`   2. Or change PORT in .env file`);
      process.exit(1);
    } else {
      throw err;
    }
  });
};

startServer();

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server');
  process.exit(0);
});

module.exports = app;

