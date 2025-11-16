import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ReactNode } from 'react';

/**
 * Render component with router wrapper
 */
export const renderWithRouter = (ui, { route = '/' } = {}) => {
  window.history.pushState({}, 'Test page', route);
  return render(ui, { wrapper: BrowserRouter });
};

/**
 * Mock API response
 */
export const mockApiResponse = (data, status = 200) => {
  return {
    data,
    status,
    statusText: 'OK',
    headers: {},
    config: {}
  };
};

/**
 * Create mock file for file input testing
 */
export const createMockFile = (name = 'test.jpg', size = 1024, type = 'image/jpeg') => {
  const file = new File(['test content'], name, { type });
  Object.defineProperty(file, 'size', { value: size, writable: false });
  return file;
};

/**
 * Wait for async operations
 */
export const waitForAsync = () => new Promise(resolve => setTimeout(resolve, 0));

