import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Dashboard from '../Dashboard';
import api from '../../services/api';
import { AuthProvider } from '../../context/AuthContext';

// Mock API
jest.mock('../../services/api', () => ({
  get: jest.fn()
}));

// Mock AuthContext
jest.mock('../../context/AuthContext', () => ({
  ...jest.requireActual('../../context/AuthContext'),
  useAuth: () => ({
    user: {
      full_name: 'Test User',
      email: 'test@example.com'
    }
  })
}));

const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        {component}
      </AuthProvider>
    </BrowserRouter>
  );
};

describe('Dashboard Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render dashboard with welcome message', async () => {
    api.get.mockResolvedValueOnce({
      data: {
        data: {
          incidents: []
        }
      }
    });
    
    renderWithRouter(<Dashboard />);
    
    await waitFor(() => {
      expect(screen.getByText(/Selamat Datang/i)).toBeInTheDocument();
    });
  });

  it('should display user name in welcome message', async () => {
    api.get.mockResolvedValueOnce({
      data: {
        data: {
          incidents: []
        }
      }
    });
    
    renderWithRouter(<Dashboard />);
    
    await waitFor(() => {
      expect(screen.getByText(/Test User/i)).toBeInTheDocument();
    });
  });

  it('should fetch and display statistics', async () => {
    const mockIncidents = [
      { id: 1, status: 'pending', created_at: new Date().toISOString() },
      { id: 2, status: 'resolved', created_at: new Date().toISOString() },
      { id: 3, status: 'closed', created_at: new Date().toISOString() }
    ];

    api.get.mockResolvedValueOnce({
      data: {
        data: {
          incidents: mockIncidents
        }
      }
    });
    
    renderWithRouter(<Dashboard />);
    
    await waitFor(() => {
      expect(api.get).toHaveBeenCalledWith('/incidents');
    });
    
    // Wait for loading to finish
    await waitFor(() => {
      expect(screen.queryByText('...')).not.toBeInTheDocument();
    }, { timeout: 3000 });
    
    // Check statistics using more specific selectors based on context
    await waitFor(() => {
      // Find Total Laporan card and check its value
      const totalLabel = screen.getByText('Total Laporan');
      const totalCard = totalLabel.closest('.bg-white');
      expect(totalCard).toHaveTextContent('3');
    }, { timeout: 3000 });
  });

  it('should display loading state', () => {
    api.get.mockImplementation(() => new Promise(() => {})); // Never resolves
    
    renderWithRouter(<Dashboard />);
    
    // There are multiple "..." elements (one for each stat card), so use getAllByText
    const loadingElements = screen.getAllByText('...');
    expect(loadingElements.length).toBeGreaterThan(0);
  });

  it('should display quick action links', async () => {
    api.get.mockResolvedValueOnce({
      data: {
        data: {
          incidents: []
        }
      }
    });
    
    renderWithRouter(<Dashboard />);
    
    await waitFor(() => {
      expect(screen.getByText(/Aksi Cepat/i)).toBeInTheDocument();
      expect(screen.getByText(/Laporkan Insiden/i)).toBeInTheDocument();
      expect(screen.getByText(/Riwayat Laporan/i)).toBeInTheDocument();
      expect(screen.getByText(/Statistik/i)).toBeInTheDocument();
    });
  });

  it('should display information sections', async () => {
    api.get.mockResolvedValueOnce({
      data: {
        data: {
          incidents: []
        }
      }
    });
    
    renderWithRouter(<Dashboard />);
    
    await waitFor(() => {
      expect(screen.getByText(/Tentang SafetyKU/i)).toBeInTheDocument();
      expect(screen.getByText(/K3 Indonesia/i)).toBeInTheDocument();
    });
  });

  it('should handle API error gracefully', async () => {
    api.get.mockRejectedValueOnce(new Error('API Error'));
    
    renderWithRouter(<Dashboard />);
    
    await waitFor(() => {
      expect(api.get).toHaveBeenCalled();
    });
    
    // Component should still render
    expect(screen.getByText(/Selamat Datang/i)).toBeInTheDocument();
  });

  it('should calculate statistics correctly', async () => {
    const mockIncidents = [
      { id: 1, status: 'pending', created_at: new Date().toISOString() },
      { id: 2, status: 'pending', created_at: new Date().toISOString() },
      { id: 3, status: 'resolved', created_at: new Date().toISOString() },
      { id: 4, status: 'closed', created_at: new Date().toISOString() }
    ];

    api.get.mockResolvedValueOnce({
      data: {
        data: {
          incidents: mockIncidents
        }
      }
    });
    
    renderWithRouter(<Dashboard />);
    
    // Wait for loading to finish
    await waitFor(() => {
      expect(screen.queryByText('...')).not.toBeInTheDocument();
    }, { timeout: 3000 });
    
    // Check statistics using more specific selectors based on context
    await waitFor(() => {
      // Find Total Laporan card and check its value
      const totalLabel = screen.getByText('Total Laporan');
      const totalCard = totalLabel.closest('.bg-white');
      expect(totalCard).toHaveTextContent('4');
      
      // Find Menunggu card and check its value
      const pendingLabel = screen.getByText('Menunggu');
      const pendingCard = pendingLabel.closest('.bg-white');
      expect(pendingCard).toHaveTextContent('2');
      
      // Find Selesai card and check its value
      const resolvedLabel = screen.getByText('Selesai');
      const resolvedCard = resolvedLabel.closest('.bg-white');
      expect(resolvedCard).toHaveTextContent('2');
    }, { timeout: 3000 });
  });
});

