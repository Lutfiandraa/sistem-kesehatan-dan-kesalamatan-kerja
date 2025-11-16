// Test helper functions

/**
 * Create a mock request object
 */
const createMockRequest = (body = {}, params = {}, query = {}) => {
  return {
    body,
    params,
    query,
    headers: {},
    user: null
  };
};

/**
 * Create a mock response object
 */
const createMockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  res.cookie = jest.fn().mockReturnValue(res);
  res.clearCookie = jest.fn().mockReturnValue(res);
  return res;
};

/**
 * Create a mock next function
 */
const createMockNext = () => {
  return jest.fn();
};

/**
 * Generate mock report data
 */
const generateMockReport = (overrides = {}) => {
  return {
    id: 1,
    title: 'Test Report',
    description: 'Test Description',
    location: 'Test Location',
    incident_date: new Date('2025-01-15'),
    severity: 'ringan',
    status: 'belum_dicek',
    jenis_insiden: 'Test Incident',
    image: null,
    created_at: new Date(),
    updated_at: new Date(),
    ...overrides
  };
};

/**
 * Generate mock material data
 */
const generateMockMaterial = (overrides = {}) => {
  return {
    id: 1,
    title: 'Test Material',
    category: 'Safety',
    description: 'Test Description',
    content: 'Test Content',
    created_at: new Date(),
    updated_at: new Date(),
    ...overrides
  };
};

/**
 * Mock database query result
 */
const createMockQueryResult = (rows = []) => {
  return {
    rows,
    rowCount: rows.length,
    command: 'SELECT',
    oid: null,
    fields: []
  };
};

module.exports = {
  createMockRequest,
  createMockResponse,
  createMockNext,
  generateMockReport,
  generateMockMaterial,
  createMockQueryResult
};

