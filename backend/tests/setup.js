// Test setup file
require('dotenv').config({ path: '.env.test' });

// Set test environment variables if not set
process.env.NODE_ENV = process.env.NODE_ENV || 'test';
process.env.DB_NAME = process.env.DB_NAME || 'keselamatan_test';
process.env.PORT = process.env.PORT || 3001;

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

