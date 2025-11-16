# Frontend Testing Guide

## Setup

1. Install dependencies:
```bash
npm install
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

### Run with coverage:
```bash
npm run test:coverage
```

## Test Structure

```
src/
├── components/
│   └── __tests__/          # Component tests
│       ├── PublicNavbar.test.jsx
│       └── Footer.test.jsx
├── pages/
│   └── public/
│       └── __tests__/      # Page tests
│           └── ProgramKerja.test.jsx
└── tests/
    ├── setup.js            # Jest setup
    └── helpers/            # Test helpers
        └── testHelpers.jsx
```

## Writing Tests

### Component Tests
Test React components using React Testing Library.

Example:
```javascript
import { render, screen } from '@testing-library/react';
import MyComponent from '../MyComponent';

describe('MyComponent', () => {
  it('should render correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });
});
```

### Testing User Interactions
Use `fireEvent` or `userEvent` to simulate user interactions.

Example:
```javascript
import { fireEvent } from '@testing-library/react';

fireEvent.click(screen.getByText('Submit'));
fireEvent.change(screen.getByLabelText('Name'), {
  target: { value: 'John' }
});
```

### Testing with Router
Use `renderWithRouter` helper for components that use React Router.

Example:
```javascript
import { renderWithRouter } from '../../tests/helpers/testHelpers';

renderWithRouter(<MyComponent />);
```

## Mocking

### Mock API calls
```javascript
jest.mock('../../services/api', () => ({
  get: jest.fn(),
  post: jest.fn()
}));
```

### Mock React Router
```javascript
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn()
}));
```

## Best Practices

1. **Test user behavior, not implementation details**
   - Test what users see and interact with
   - Avoid testing internal state or methods

2. **Use semantic queries**
   - Prefer `getByRole`, `getByLabelText`, `getByText`
   - Avoid `getByTestId` unless necessary

3. **Keep tests independent**
   - Each test should be able to run in isolation
   - Use `beforeEach` to reset state

4. **Test error states**
   - Test validation errors
   - Test API error handling
   - Test loading states

5. **Use async utilities**
   - Use `waitFor` for async operations
   - Use `findBy*` queries for elements that appear asynchronously

