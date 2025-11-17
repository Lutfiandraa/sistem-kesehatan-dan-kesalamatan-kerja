import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Statistics from '../Statistics';
import api from '../../services/api';

// Mock API
jest.mock('../../services/api', () => ({
  get: jest.fn()
}));

const renderWithRouter = (component) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('Statistics Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render statistics page', async () => {
    api.get.mockResolvedValueOnce({
      data: {
        data: {
          incidents: []
        }
      }
    });
    
    renderWithRouter(<Statistics />);
    
    await waitFor(() => {
      expect(screen.getByText(/Statistik Laporan/i)).toBeInTheDocument();
    });
  });

  it('should display loading state', () => {
    api.get.mockImplementation(() => new Promise(() => {})); // Never resolves
    
    renderWithRouter(<Statistics />);
    
    expect(screen.getByText(/Memuat data/i)).toBeInTheDocument();
  });

  it('should fetch and display statistics', async () => {
    const mockIncidents = [
      {
        id: 1,
        incident_type: 'near_miss',
        severity: 'low',
        status: 'pending',
        created_at: new Date().toISOString()
      },
      {
        id: 2,
        incident_type: 'injury',
        severity: 'high',
        status: 'resolved',
        created_at: new Date().toISOString()
      }
    ];

    api.get.mockResolvedValueOnce({
      data: {
        data: {
          incidents: mockIncidents
        }
      }
    });
    
    renderWithRouter(<Statistics />);
    
    await waitFor(() => {
      expect(api.get).toHaveBeenCalledWith('/incidents');
    });
    
    await waitFor(() => {
      expect(screen.getByText(/Laporan Berdasarkan Jenis/i)).toBeInTheDocument();
      expect(screen.getByText(/Laporan Berdasarkan Tingkat Keparahan/i)).toBeInTheDocument();
      expect(screen.getByText(/Laporan Berdasarkan Status/i)).toBeInTheDocument();
    });
  });

  it('should display statistics by type', async () => {
    const mockIncidents = [
      {
        id: 1,
        incident_type: 'near_miss',
        severity: 'low',
        status: 'pending',
        created_at: new Date().toISOString()
      },
      {
        id: 2,
        incident_type: 'injury',
        severity: 'high',
        status: 'resolved',
        created_at: new Date().toISOString()
      }
    ];

    api.get.mockResolvedValueOnce({
      data: {
        data: {
          incidents: mockIncidents
        }
      }
    });
    
    renderWithRouter(<Statistics />);
    
    await waitFor(() => {
      expect(screen.getByText(/Near Miss/i)).toBeInTheDocument();
      expect(screen.getByText(/Cedera/i)).toBeInTheDocument();
    });
  });

  it('should display statistics by severity', async () => {
    const mockIncidents = [
      {
        id: 1,
        incident_type: 'near_miss',
        severity: 'low',
        status: 'pending',
        created_at: new Date().toISOString()
      },
      {
        id: 2,
        incident_type: 'injury',
        severity: 'high',
        status: 'resolved',
        created_at: new Date().toISOString()
      }
    ];

    api.get.mockResolvedValueOnce({
      data: {
        data: {
          incidents: mockIncidents
        }
      }
    });
    
    renderWithRouter(<Statistics />);
    
    await waitFor(() => {
      expect(screen.getByText(/Rendah/i)).toBeInTheDocument();
      expect(screen.getByText(/Tinggi/i)).toBeInTheDocument();
    });
  });

  it('should display statistics by status', async () => {
    const mockIncidents = [
      {
        id: 1,
        incident_type: 'near_miss',
        severity: 'low',
        status: 'pending',
        created_at: new Date().toISOString()
      },
      {
        id: 2,
        incident_type: 'injury',
        severity: 'high',
        status: 'resolved',
        created_at: new Date().toISOString()
      }
    ];

    api.get.mockResolvedValueOnce({
      data: {
        data: {
          incidents: mockIncidents
        }
      }
    });
    
    renderWithRouter(<Statistics />);
    
    await waitFor(() => {
      expect(screen.getByText(/Menunggu/i)).toBeInTheDocument();
      expect(screen.getByText(/Selesai/i)).toBeInTheDocument();
    });
  });

  it('should handle API error gracefully', async () => {
    api.get.mockRejectedValueOnce(new Error('API Error'));
    
    renderWithRouter(<Statistics />);
    
    await waitFor(() => {
      expect(api.get).toHaveBeenCalled();
    });
    
    // Component should still render
    expect(screen.getByText(/Statistik Laporan/i)).toBeInTheDocument();
  });
});

