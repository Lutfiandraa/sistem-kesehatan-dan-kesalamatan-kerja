# Backend Testing Guide

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env.test` file (optional, for test-specific environment variables):
```env
NODE_ENV=test
DB_NAME=keselamatan_test
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
```

## Running Tests

### Run all tests:
```bash
npm test
```

### Run tests in watch mode:
```bash
npm run test:watch
```

### Run only unit tests:
```bash
npm run test:unit
```

### Run only integration tests:
```bash
npm run test:integration
```

### Run with coverage:
```bash
npm test -- --coverage
```

## Test Structure

```
tests/
├── unit/              # Unit tests for controllers, services, etc.
│   ├── reportsController.test.js
│   └── materialsController.test.js
├── integration/        # Integration tests for API endpoints
│   └── publicRoutes.test.js
├── helpers/           # Test helper functions
│   └── testHelpers.js
└── setup.js           # Test setup and configuration
```

## Writing Tests

### Unit Tests
Unit tests test individual functions in isolation, using mocks for dependencies.

Example:
```javascript
describe('Reports Controller', () => {
  it('should create a report successfully', async () => {
    // Test implementation
  });
});
```

### Integration Tests
Integration tests test the full flow of API endpoints.

Example:
```javascript
describe('POST /api/public/reports', () => {
  it('should create a report with valid data', async () => {
    // Test implementation
  });
});
```

## Test Coverage

The test suite aims to cover:
- ✅ Controller functions (create, read, update, delete)
- ✅ Input validation
- ✅ Error handling
- ✅ API endpoints
- ✅ Database interactions (mocked)

## Notes

- Unit tests use mocks for database queries
- Integration tests may require a test database (optional)
- All tests should be independent and not rely on each other
- Use `beforeEach` to reset mocks between tests

