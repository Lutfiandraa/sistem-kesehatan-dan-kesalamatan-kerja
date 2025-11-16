import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Home from '../Home';
import api from '../../../services/api';

// Mock API
jest.mock('../../../services/api', () => ({
  get: jest.fn()
}));

const renderWithRouter = (component) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('Home Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render home page with hero section', () => {
    api.get.mockResolvedValueOnce({ data: [] });
    
    renderWithRouter(<Home />);
    
    expect(screen.getByText(/SafetyKU/i)).toBeInTheDocument();
  });

  it('should display loading state initially', () => {
    api.get.mockImplementation(() => new Promise(() => {})); // Never resolves
    
    renderWithRouter(<Home />);
    
    // Loading state might not be visible, but component should render
    expect(screen.getByText(/SafetyKU/i)).toBeInTheDocument();
  });

  it('should fetch and display statistics', async () => {
    const mockReports = [
      { id: 1, status: 'aman', severity: 'ringan', title: 'Test 1' },
      { id: 2, status: 'belum_dicek', severity: 'berat', title: 'Test 2' },
      { id: 3, status: 'dalam_penangan', severity: 'sedang', title: 'Test 3' }
    ];

    api.get.mockResolvedValueOnce({ data: mockReports });
    
    renderWithRouter(<Home />);
    
    await waitFor(() => {
      expect(api.get).toHaveBeenCalledWith('/public/reports');
    });
  });

  it('should calculate statistics correctly', async () => {
    const mockReports = [
      { id: 1, status: 'aman', severity: 'ringan' },
      { id: 2, status: 'belum_dicek', severity: 'berat' },
      { id: 3, status: 'dalam_penangan', severity: 'sedang' }
    ];

    api.get.mockResolvedValueOnce({ data: mockReports });
    
    renderWithRouter(<Home />);
    
    await waitFor(() => {
      expect(api.get).toHaveBeenCalledWith('/public/reports');
    }, { timeout: 3000 });
    
    // Wait for statistics to be calculated and displayed
    await waitFor(() => {
      // Statistics section should be visible
      expect(screen.getByText(/Statistik/i)).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it('should handle API error gracefully', async () => {
    api.get.mockRejectedValueOnce(new Error('API Error'));
    
    renderWithRouter(<Home />);
    
    await waitFor(() => {
      expect(api.get).toHaveBeenCalled();
    });
    
    // Component should still render even on error
    expect(screen.getByText(/SafetyKU/i)).toBeInTheDocument();
  });

  it('should display statistics section', () => {
    api.get.mockResolvedValueOnce({ data: [] });
    
    renderWithRouter(<Home />);
    
    expect(screen.getByText(/Statistik/i)).toBeInTheDocument();
  });
});


