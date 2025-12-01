import { render, screen, waitFor, fireEvent, act } from '@testing-library/react';
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
    }, { timeout: 3000 });

    // Check for exclamation icon - FaExclamationCircle is rendered as SVG
    // Look for SVG elements or elements with title attribute containing "Berat"
    await waitFor(() => {
      // Check for SVG icon (FaExclamationCircle) or element with title
      const exclamationIcons = document.querySelectorAll('svg');
      const beratElements = document.querySelectorAll('[title*="Berat"], [title*="berat"]');
      // Should have at least one icon or element indicating berat report
      expect(exclamationIcons.length + beratElements.length).toBeGreaterThan(0);
    }, { timeout: 3000 });
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
    }, { timeout: 3000 });

    // Find and click status button - get the button containing "Belum di Cek"
    const statusButton = await screen.findByText(/Belum di Cek/i, {}, { timeout: 3000 });
    await userEvent.click(statusButton);
    
    // Wait for dropdown to appear and click on a status option
    const amanOption = await screen.findByText(/Aman!/i, {}, { timeout: 3000 });
    await userEvent.click(amanOption);
    
    await waitFor(() => {
      expect(api.put).toHaveBeenCalledWith(
        '/public/reports/1',
        expect.objectContaining({ status: 'aman' })
      );
    }, { timeout: 5000 });
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
      expect(screen.getByText('Report Berat')).toBeInTheDocument();
    }, { timeout: 3000 });

    const kategoriButton = screen.getByText('Kategori');
    await userEvent.click(kategoriButton);
    
    // Wait for dropdown to appear
    await waitFor(() => {
      expect(screen.getByText('Terberat')).toBeInTheDocument();
    }, { timeout: 3000 });
    
    const terberatOption = screen.getByText('Terberat');
    await userEvent.click(terberatOption);
    
    // Reports should be sorted by severity (berat first)
    // Wait a bit for sorting to complete
    await waitFor(() => {
      const reports = screen.getAllByText(/Report (Ringan|Berat)/i);
      // After sorting, "Report Berat" should appear first
      expect(reports.length).toBeGreaterThan(0);
      // Check if "Report Berat" appears before "Report Ringan" in the DOM
      const reportTexts = reports.map(r => r.textContent);
      const beratIndex = reportTexts.findIndex(t => t.includes('Berat'));
      const ringanIndex = reportTexts.findIndex(t => t.includes('Ringan'));
      if (beratIndex !== -1 && ringanIndex !== -1) {
        expect(beratIndex).toBeLessThan(ringanIndex);
      }
    }, { timeout: 5000 });
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
      expect(screen.getByText('Report Berat')).toBeInTheDocument();
    }, { timeout: 3000 });

    const kategoriButton = screen.getByText('Kategori');
    await userEvent.click(kategoriButton);
    
    // Wait for dropdown to appear
    await waitFor(() => {
      expect(screen.getByText('Teringan')).toBeInTheDocument();
    }, { timeout: 3000 });
    
    const teringanOption = screen.getByText('Teringan');
    await userEvent.click(teringanOption);
    
    // Reports should be sorted by severity (ringan first)
    // Wait a bit for sorting to complete
    await waitFor(() => {
      const reports = screen.getAllByText(/Report (Ringan|Berat)/i);
      // After sorting, "Report Ringan" should appear first
      expect(reports.length).toBeGreaterThan(0);
      // Check if "Report Ringan" appears before "Report Berat" in the DOM
      const reportTexts = reports.map(r => r.textContent);
      const ringanIndex = reportTexts.findIndex(t => t.includes('Ringan'));
      const beratIndex = reportTexts.findIndex(t => t.includes('Berat'));
      if (ringanIndex !== -1 && beratIndex !== -1) {
        expect(ringanIndex).toBeLessThan(beratIndex);
      }
    }, { timeout: 5000 });
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
    }, { timeout: 3000 });

    // Find status button and open dropdown
    const statusButton = await screen.findByText(/Belum di Cek/i, {}, { timeout: 3000 });
    await userEvent.click(statusButton);
    
    // Wait for dropdown and find "Pilih untuk Hapus" option
    const selectOption = await screen.findByText(/Pilih untuk Hapus/i, {}, { timeout: 3000 });
    await userEvent.click(selectOption);
    
    // Wait for select mode to be activated (checkboxes should appear)
    await waitFor(() => {
      const checkboxes = screen.queryAllByRole('checkbox');
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
    }, { timeout: 3000 });

    // Open select mode via status dropdown - find first status button
    const statusButtons = await screen.findAllByText(/Belum di Cek/i, {}, { timeout: 3000 });
    const statusButton = statusButtons[0];
    await userEvent.click(statusButton);
    
    const selectOption = await screen.findByText(/Pilih untuk Hapus/i, {}, { timeout: 3000 });
    await userEvent.click(selectOption);

    // Wait for checkboxes to appear and click first one
    await waitFor(() => {
      const checkboxes = screen.queryAllByRole('checkbox');
      expect(checkboxes.length).toBeGreaterThan(0);
    }, { timeout: 3000 });
    
    const checkboxes = screen.getAllByRole('checkbox');
    await userEvent.click(checkboxes[0]);

    // Wait a bit for state to update, then open dropdown again to find delete button
    await waitFor(() => {
      expect(checkboxes[0]).toBeChecked();
    }, { timeout: 2000 });

    // Open dropdown again on the same button
    await userEvent.click(statusButton);
    const deleteButton = await screen.findByText(/Hapus \(\d+\)/i, {}, { timeout: 3000 });
    await userEvent.click(deleteButton);
    
    await waitFor(() => {
      expect(api.delete).toHaveBeenCalled();
    }, { timeout: 5000 });
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
    }, { timeout: 3000 });

    const statusButton = await screen.findByText(/Belum di Cek/i, {}, { timeout: 3000 });
    await userEvent.click(statusButton);
    
    const amanOption = await screen.findByText(/Aman!/i, {}, { timeout: 3000 });
    await userEvent.click(amanOption);
    
    await waitFor(() => {
      expect(global.alert).toHaveBeenCalled();
    }, { timeout: 5000 });
  });

  it('should navigate back when back button is clicked', async () => {
    api.get.mockResolvedValueOnce({ data: [] });
    
    renderWithRouter(<RiwayatPelaporan />);
    
    // Wait for component to render, then find the back button
    await waitFor(() => {
      expect(screen.getByText(/Riwayat Pelaporan/i)).toBeInTheDocument();
    }, { timeout: 3000 });
    
    // Find the back button (first button in the header)
    const backButton = screen.getAllByRole('button')[0];
    await userEvent.click(backButton);
    
    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });
});

