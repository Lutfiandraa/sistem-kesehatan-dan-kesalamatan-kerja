import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import RiwayatPelaporan from '../RiwayatPelaporan';
import api from '../../../services/api';

// Mock API
jest.mock('../../../services/api', () => ({
  get: jest.fn(),
  put: jest.fn(),
  delete: jest.fn()
}));

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate
}));

// Mock window.confirm and window.alert
global.alert = jest.fn();
global.confirm = jest.fn(() => true);

const renderWithRouter = (component) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('RiwayatPelaporan Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.alert.mockClear();
    global.confirm.mockClear();
    mockNavigate.mockClear();
  });

  it('should render riwayat pelaporan page', async () => {
    api.get.mockResolvedValueOnce({ data: [] });
    
    renderWithRouter(<RiwayatPelaporan />);
    
    expect(screen.getByText(/Riwayat Pelaporan/i)).toBeInTheDocument();
  });

  it('should fetch and display reports', async () => {
    const mockReports = [
      {
        id: 1,
        title: 'Report 1',
        description: 'Description 1',
        date: '01 January 2025',
        severity: 'ringan',
        status: 'belum_dicek'
      },
      {
        id: 2,
        title: 'Report 2',
        description: 'Description 2',
        date: '02 January 2025',
        severity: 'berat',
        status: 'belum_dicek'
      }
    ];

    api.get.mockResolvedValueOnce({ data: mockReports });
    
    renderWithRouter(<RiwayatPelaporan />);
    
    await waitFor(() => {
      expect(api.get).toHaveBeenCalledWith('/public/reports');
    });

    await waitFor(() => {
      expect(screen.getByText('Report 1')).toBeInTheDocument();
      expect(screen.getByText('Report 2')).toBeInTheDocument();
    });
  });

  it('should display loading state', () => {
    api.get.mockImplementation(() => new Promise(() => {})); // Never resolves
    
    renderWithRouter(<RiwayatPelaporan />);
    
    expect(screen.getByText(/Memuat data/i)).toBeInTheDocument();
  });

  it('should display empty state when no reports', async () => {
    api.get.mockResolvedValueOnce({ data: [] });
    
    renderWithRouter(<RiwayatPelaporan />);
    
    await waitFor(() => {
      expect(screen.getByText(/Tidak ada laporan ditemukan/i)).toBeInTheDocument();
    });
  });

  it('should display notification icon for "Berat" reports', async () => {
    const mockReports = [
      {
        id: 1,
        title: 'Laporan Berat',
        description: 'Description',
        date: '01 January 2025',
        severity: 'berat',
        status: 'belum_dicek'
      }
    ];

    api.get.mockResolvedValueOnce({ data: mockReports });
    
    renderWithRouter(<RiwayatPelaporan />);
    
    await waitFor(() => {
      expect(screen.getByText('Laporan Berat')).toBeInTheDocument();
    });

    // Check for exclamation icon (might be rendered as SVG)
    const exclamationIcons = document.querySelectorAll('[class*="exclamation"]');
    expect(exclamationIcons.length).toBeGreaterThan(0);
  });

  it('should display image if available', async () => {
    const mockReports = [
      {
        id: 1,
        title: 'Report 1',
        description: 'Description',
        date: '01 January 2025',
        severity: 'ringan',
        status: 'belum_dicek',
        image: 'data:image/jpeg;base64,/9j/4AAQSkZJRg=='
      }
    ];

    api.get.mockResolvedValueOnce({ data: mockReports });
    
    renderWithRouter(<RiwayatPelaporan />);
    
    await waitFor(() => {
      expect(screen.getByText('Report 1')).toBeInTheDocument();
    });

    const images = screen.getAllByRole('img');
    expect(images.length).toBeGreaterThan(0);
  });

  it('should update report status', async () => {
    const mockReports = [
      {
        id: 1,
        title: 'Report 1',
        description: 'Description',
        date: '01 January 2025',
        severity: 'ringan',
        status: 'belum_dicek'
      }
    ];

    api.get.mockResolvedValueOnce({ data: mockReports });
    api.put.mockResolvedValueOnce({});
    
    renderWithRouter(<RiwayatPelaporan />);
    
    await waitFor(() => {
      expect(screen.getByText('Report 1')).toBeInTheDocument();
    });

    // Find and click status button
    const statusButton = await screen.findByText(/Belum di Cek/i);
    await userEvent.click(statusButton);
    
    // Wait for dropdown to appear and click on a status option
    const amanOption = await screen.findByText(/Aman!/i, {}, { timeout: 3000 });
    await userEvent.click(amanOption);
    
    await waitFor(() => {
      expect(api.put).toHaveBeenCalledWith(
        '/public/reports/1',
        expect.objectContaining({ status: 'aman' })
      );
    }, { timeout: 3000 });
  });

  it('should filter reports by category - Terberat', async () => {
    const mockReports = [
      {
        id: 1,
        title: 'Report Ringan',
        description: 'Description',
        date: '01 January 2025',
        severity: 'ringan',
        status: 'belum_dicek'
      },
      {
        id: 2,
        title: 'Report Berat',
        description: 'Description',
        date: '02 January 2025',
        severity: 'berat',
        status: 'belum_dicek'
      }
    ];

    api.get.mockResolvedValueOnce({ data: mockReports });
    
    renderWithRouter(<RiwayatPelaporan />);
    
    await waitFor(() => {
      expect(screen.getByText('Report Ringan')).toBeInTheDocument();
    });

    const kategoriButton = screen.getByText('Kategori');
    await userEvent.click(kategoriButton);
    
    // Wait for dropdown to appear
    const terberatOption = await screen.findByText('Terberat', {}, { timeout: 3000 });
    await userEvent.click(terberatOption);
    
    // Reports should be sorted by severity (berat first)
    // Wait a bit for sorting to complete
    await waitFor(() => {
      const reports = screen.getAllByText(/Report (Ringan|Berat)/i);
      // First report should be "Report Berat" (terberat)
      expect(reports[0].textContent).toContain('Berat');
    }, { timeout: 3000 });
  });

  it('should filter reports by category - Teringan', async () => {
    const mockReports = [
      {
        id: 1,
        title: 'Report Ringan',
        description: 'Description',
        date: '01 January 2025',
        severity: 'ringan',
        status: 'belum_dicek'
      },
      {
        id: 2,
        title: 'Report Berat',
        description: 'Description',
        date: '02 January 2025',
        severity: 'berat',
        status: 'belum_dicek'
      }
    ];

    api.get.mockResolvedValueOnce({ data: mockReports });
    
    renderWithRouter(<RiwayatPelaporan />);
    
    await waitFor(() => {
      expect(screen.getByText('Report Ringan')).toBeInTheDocument();
    });

    const kategoriButton = screen.getByText('Kategori');
    await userEvent.click(kategoriButton);
    
    // Wait for dropdown to appear
    const teringanOption = await screen.findByText('Teringan', {}, { timeout: 3000 });
    await userEvent.click(teringanOption);
    
    // Reports should be sorted by severity (ringan first)
    // Wait a bit for sorting to complete
    await waitFor(() => {
      const reports = screen.getAllByText(/Report (Ringan|Berat)/i);
      // First report should be "Report Ringan" (teringan)
      expect(reports[0].textContent).toContain('Ringan');
    }, { timeout: 3000 });
  });

  it('should toggle select mode', async () => {
    const mockReports = [
      {
        id: 1,
        title: 'Report 1',
        description: 'Description',
        date: '01 January 2025',
        severity: 'ringan',
        status: 'belum_dicek'
      }
    ];

    api.get.mockResolvedValueOnce({ data: mockReports });
    
    renderWithRouter(<RiwayatPelaporan />);
    
    await waitFor(() => {
      expect(screen.getByText('Report 1')).toBeInTheDocument();
    });

    // Find status button and open dropdown
    const statusButton = await screen.findByText(/Belum di Cek/i);
    await userEvent.click(statusButton);
    
    // Wait for dropdown and find "Pilih untuk Hapus" option
    const selectOption = await screen.findByText(/Pilih untuk Hapus/i, {}, { timeout: 3000 });
    await userEvent.click(selectOption);
    
    // Wait for select mode to be activated (checkboxes should appear)
    await waitFor(() => {
      const checkboxes = screen.getAllByRole('checkbox');
      expect(checkboxes.length).toBeGreaterThan(0);
    }, { timeout: 3000 });
  });

  it('should delete selected reports', async () => {
    const mockReports = [
      {
        id: 1,
        title: 'Report 1',
        description: 'Description',
        date: '01 January 2025',
        severity: 'ringan',
        status: 'belum_dicek'
      },
      {
        id: 2,
        title: 'Report 2',
        description: 'Description',
        date: '02 January 2025',
        severity: 'berat',
        status: 'belum_dicek'
      }
    ];

    api.get.mockResolvedValueOnce({ data: mockReports });
    api.delete.mockResolvedValueOnce({});
    
    renderWithRouter(<RiwayatPelaporan />);
    
    await waitFor(() => {
      expect(screen.getByText('Report 1')).toBeInTheDocument();
    });

    // Open select mode via status dropdown
    const statusButton = await screen.findByText(/Belum di Cek/i);
    await userEvent.click(statusButton);
    
    const selectOption = await screen.findByText(/Pilih untuk Hapus/i, {}, { timeout: 3000 });
    await userEvent.click(selectOption);

    // Wait for checkboxes to appear and click first one
    await waitFor(() => {
      const checkboxes = screen.getAllByRole('checkbox');
      expect(checkboxes.length).toBeGreaterThan(0);
    }, { timeout: 3000 });
    
    const checkboxes = screen.getAllByRole('checkbox');
    await userEvent.click(checkboxes[0]);

    // Open dropdown again to find delete button
    await userEvent.click(statusButton);
    const deleteButton = await screen.findByText(/Hapus \(\d+\)/i, {}, { timeout: 3000 });
    await userEvent.click(deleteButton);
    
    await waitFor(() => {
      expect(api.delete).toHaveBeenCalled();
    }, { timeout: 3000 });
  });

  it('should handle API error when fetching reports', async () => {
    api.get.mockRejectedValueOnce(new Error('API Error'));
    
    renderWithRouter(<RiwayatPelaporan />);
    
    await waitFor(() => {
      expect(api.get).toHaveBeenCalled();
    });
  });

  it('should handle API error when updating status', async () => {
    const mockReports = [
      {
        id: 1,
        title: 'Report 1',
        description: 'Description',
        date: '01 January 2025',
        severity: 'ringan',
        status: 'belum_dicek'
      }
    ];

    api.get.mockResolvedValueOnce({ data: mockReports });
    api.put.mockRejectedValueOnce(new Error('API Error'));
    
    renderWithRouter(<RiwayatPelaporan />);
    
    await waitFor(() => {
      expect(screen.getByText('Report 1')).toBeInTheDocument();
    });

    const statusButton = await screen.findByText(/Belum di Cek/i);
    await userEvent.click(statusButton);
    
    const amanOption = await screen.findByText(/Aman!/i, {}, { timeout: 3000 });
    await userEvent.click(amanOption);
    
    await waitFor(() => {
      expect(global.alert).toHaveBeenCalled();
    }, { timeout: 3000 });
  });

  it('should navigate back when back button is clicked', async () => {
    api.get.mockResolvedValueOnce({ data: [] });
    
    renderWithRouter(<RiwayatPelaporan />);
    
    const backButton = screen.getByRole('button');
    await userEvent.click(backButton);
    
    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });
});

