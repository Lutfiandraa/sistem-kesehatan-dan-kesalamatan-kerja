# Testing Guide - SafetyKU

Panduan lengkap untuk menjalankan dan menulis unit tests untuk aplikasi SafetyKU.

## 📋 Daftar Isi

1. [Backend Testing](#backend-testing)
2. [Frontend Testing](#frontend-testing)
3. [Menjalankan Tests](#menjalankan-tests)
4. [Best Practices](#best-practices)

---

## 🔧 Backend Testing

### Setup

1. Install dependencies:
```bash
cd backend
npm install
```

2. (Optional) Buat file `.env.test` untuk test environment:
```env
NODE_ENV=test
DB_NAME=keselamatan_test
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
```

### Menjalankan Tests

```bash
# Semua tests
npm test

# Watch mode
npm run test:watch

# Unit tests saja
npm run test:unit

# Integration tests saja
npm run test:integration

# Dengan coverage
npm test -- --coverage
```

### Struktur Tests

```
backend/tests/
├── unit/                      # Unit tests
│   ├── reportsController.test.js
│   └── materialsController.test.js
├── integration/              # Integration tests
│   └── publicRoutes.test.js
├── helpers/                  # Test helpers
│   └── testHelpers.js
└── setup.js                  # Test setup
```

### Contoh Test

```javascript
describe('Reports Controller', () => {
  it('should create a report successfully', async () => {
    const mockRequest = createMockRequest({
      title: 'Test Report',
      description: 'Test Description',
      location: 'Test Location',
      incident_date: '2025-01-15'
    });
    const mockResponse = createMockResponse();

    // Mock database query
    query.mockResolvedValueOnce(createMockQueryResult([mockReport]));

    await reportsController.createReport(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(201);
  });
});
```

---

## ⚛️ Frontend Testing

### Setup

1. Install dependencies:
```bash
cd admin
npm install
```

### Menjalankan Tests

```bash
# Semua tests
npm test

# Watch mode
npm run test:watch

# Dengan coverage
npm run test:coverage
```

### Struktur Tests

```
admin/src/
├── components/
│   └── __tests__/           # Component tests
│       ├── PublicNavbar.test.jsx
│       └── Footer.test.jsx
├── pages/
│   └── public/
│       └── __tests__/       # Page tests
│           └── ProgramKerja.test.jsx
└── tests/
    ├── setup.js             # Jest setup
    └── helpers/             # Test helpers
        └── testHelpers.jsx
```

### Contoh Test

```javascript
import { render, screen, fireEvent } from '@testing-library/react';
import MyComponent from '../MyComponent';

describe('MyComponent', () => {
  it('should render correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });

  it('should handle user interaction', () => {
    render(<MyComponent />);
    const button = screen.getByText('Click me');
    fireEvent.click(button);
    expect(screen.getByText('Clicked!')).toBeInTheDocument();
  });
});
```

---

## 🚀 Menjalankan Tests

### Backend

```bash
cd backend
npm test
```

### Frontend

```bash
cd admin
npm test
```

### Keduanya (dari root)

```bash
# Backend
cd backend && npm test

# Frontend
cd admin && npm test
```

---

## 📚 Best Practices

### 1. Test Naming
- Gunakan deskripsi yang jelas: `should create a report successfully`
- Group tests dengan `describe` blocks

### 2. Test Structure (AAA Pattern)
```javascript
it('should do something', () => {
  // Arrange - Setup
  const mockData = { ... };
  
  // Act - Execute
  const result = functionToTest(mockData);
  
  // Assert - Verify
  expect(result).toBe(expected);
});
```

### 3. Mocking
- Mock external dependencies (API, database)
- Mock React Router untuk components yang menggunakan routing
- Mock file uploads untuk testing file input

### 4. Coverage
- Target minimal 70% coverage
- Fokus pada critical paths
- Test error cases, not just happy paths

### 5. Independent Tests
- Setiap test harus independent
- Gunakan `beforeEach` untuk reset state
- Jangan bergantung pada urutan test execution

### 6. Async Testing
```javascript
// Gunakan async/await
it('should handle async operation', async () => {
  await waitFor(() => {
    expect(screen.getByText('Loaded')).toBeInTheDocument();
  });
});
```

---

## 🐛 Troubleshooting

### Backend Tests

**Error: Cannot find module**
```bash
# Pastikan dependencies terinstall
npm install
```

**Error: Database connection**
- Pastikan PostgreSQL berjalan
- Atau gunakan mock database untuk unit tests

### Frontend Tests

**Error: SyntaxError: Unexpected token**
```bash
# Pastikan babel config sudah benar
# Check babel.config.js
```

**Error: Cannot find module 'identity-obj-proxy'**
```bash
npm install --save-dev identity-obj-proxy
```

---

## 📊 Coverage Reports

Setelah menjalankan tests dengan coverage, lihat report di:
- Backend: `backend/coverage/`
- Frontend: `admin/coverage/`

Buka `index.html` di browser untuk melihat coverage report interaktif.

---

## 📝 Writing New Tests

### Backend Controller Test

1. Import controller dan dependencies
2. Mock database query
3. Create mock request/response
4. Call controller function
5. Assert expected behavior

### Frontend Component Test

1. Import component dan testing utilities
2. Mock external dependencies (API, Router)
3. Render component
4. Query elements
5. Simulate user interactions
6. Assert expected behavior

---

## ✅ Checklist

Sebelum commit, pastikan:
- [ ] Semua tests passing
- [ ] Coverage minimal 70%
- [ ] No console errors/warnings
- [ ] Tests are independent
- [ ] Error cases are tested
- [ ] Edge cases are covered

---

## 📖 Resources

- [Jest Documentation](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/react)
- [Supertest](https://github.com/visionmedia/supertest)

