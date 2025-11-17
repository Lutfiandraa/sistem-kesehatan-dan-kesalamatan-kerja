import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import History from '../History';
import api from '../../services/api';

// Mock API
jest.mock('../../services/api', () => ({
  get: jest.fn()
}));

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate
}));

const renderWithRouter = (component) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('History Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockNavigate.mockClear();
  });

  it('should render history page', async () => {
    api.get.mockResolvedValueOnce({
      data: {
        data: {
          incidents: []
        }
      }
    });
    
    renderWithRouter(<History />);
    
    await waitFor(() => {
      expect(screen.getByText(/Riwayat Laporan/i)).toBeInTheDocument();
    });
  });

  it('should fetch and display incidents', async () => {
    const mockIncidents = [
      {
        id: 1,
        title: 'Test Incident 1',
        description: 'Description 1',
        location: 'Location 1',
        incident_date: new Date().toISOString(),
        status: 'pending',
        severity: 'low'
      },
      {
        id: 2,
        title: 'Test Incident 2',
        description: 'Description 2',
        location: 'Location 2',
        incident_date: new Date().toISOString(),
        status: 'resolved',
        severity: 'high'
      }
    ];

    api.get.mockResolvedValueOnce({
      data: {
        data: {
          incidents: mockIncidents
        }
      }
    });
    
    renderWithRouter(<History />);
    
    await waitFor(() => {
      expect(api.get).toHaveBeenCalledWith('/incidents?');
    });
    
    await waitFor(() => {
      expect(screen.getByText('Test Incident 1')).toBeInTheDocument();
      expect(screen.getByText('Test Incident 2')).toBeInTheDocument();
    });
  });

  it('should display loading state', () => {
    api.get.mockImplementation(() => new Promise(() => {})); // Never resolves
    
    renderWithRouter(<History />);
    
    expect(screen.getByText(/Memuat data/i)).toBeInTheDocument();
  });

  it('should filter incidents by status', async () => {
    const mockIncidents = [
      {
        id: 1,
        title: 'Pending Incident',
        status: 'pending',
        severity: 'low',
        incident_date: new Date().toISOString()
      },
      {
        id: 2,
        title: 'Resolved Incident',
        status: 'resolved',
        severity: 'low',
        incident_date: new Date().toISOString()
      }
    ];

    api.get.mockResolvedValueOnce({
      data: {
        data: {
          incidents: mockIncidents
        }
      }
    });
    
    renderWithRouter(<History />);
    
    await waitFor(() => {
      expect(screen.getByText('Pending Incident')).toBeInTheDocument();
    });
    
    // Find status filter select (first select element)
    const statusFilter = document.querySelector('select');
    if (statusFilter) {
      await act(async () => {
        await userEvent.selectOptions(statusFilter, 'pending');
      });
      
      await waitFor(() => {
        expect(api.get).toHaveBeenCalledWith(expect.stringContaining('status=pending'));
      }, { timeout: 3000 });
    }
  });

  it('should handle API error gracefully', async () => {
    api.get.mockRejectedValueOnce(new Error('API Error'));
    
    renderWithRouter(<History />);
    
    await waitFor(() => {
      expect(api.get).toHaveBeenCalled();
    });
    
    // Component should still render
    expect(screen.getByText(/Riwayat Laporan/i)).toBeInTheDocument();
  });

  it('should display empty state when no incidents', async () => {
    api.get.mockResolvedValueOnce({
      data: {
        data: {
          incidents: []
        }
      }
    });
    
    renderWithRouter(<History />);
    
    await waitFor(() => {
      expect(screen.getByText(/Belum ada laporan/i)).toBeInTheDocument();
    }, { timeout: 3000 });
  });
});

