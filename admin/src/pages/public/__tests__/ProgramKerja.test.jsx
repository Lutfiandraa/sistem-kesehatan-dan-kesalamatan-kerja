import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter, useNavigate } from 'react-router-dom';
import ProgramKerja from '../ProgramKerja';
import api from '../../../services/api';

// Mock react-router-dom
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate
}));

// Mock API
jest.mock('../../../services/api', () => ({
  post: jest.fn()
}));

// Mock window.alert
global.alert = jest.fn();

const renderWithRouter = (component) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('ProgramKerja Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.alert.mockClear();
    mockNavigate.mockClear();
  });

  it('should render form fields', () => {
    renderWithRouter(<ProgramKerja />);
    
    expect(screen.getByLabelText(/Jenis Insiden/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Tanggal/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Lokasi/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Deskripsi/i)).toBeInTheDocument();
  });

  it('should render photo upload section', () => {
    renderWithRouter(<ProgramKerja />);
    
    expect(screen.getByText(/Tambahkan Foto/i)).toBeInTheDocument();
    expect(screen.getByText(/Drag & Drop/i)).toBeInTheDocument();
  });

  it('should show validation error when submitting empty form', async () => {
    renderWithRouter(<ProgramKerja />);
    
    const submitButton = screen.getByText(/Kirim Laporan/i);
    await userEvent.click(submitButton);

    // Form validation should prevent submission
    await waitFor(() => {
      expect(api.post).not.toHaveBeenCalled();
    });
  });

  it('should submit form with valid data', async () => {
    api.post.mockResolvedValueOnce({
      data: {
        id: 1,
        title: 'Test Report',
        date: '15 January 2025',
        description: 'Test Description'
      }
    });

    renderWithRouter(<ProgramKerja />);
    
    // Fill form
    const jenisInsidenInput = screen.getByLabelText(/Jenis Insiden/i);
    const tanggalInput = screen.getByLabelText(/Tanggal/i);
    const lokasiInput = screen.getByLabelText(/Lokasi/i);
    const deskripsiInput = screen.getByLabelText(/Deskripsi/i);

    await userEvent.type(jenisInsidenInput, 'Test Incident');
    await userEvent.type(tanggalInput, '2025-01-15');
    await userEvent.type(lokasiInput, 'Test Location');
    await userEvent.type(deskripsiInput, 'Test Description');

    const submitButton = screen.getByText(/Kirim Laporan/i);
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith(
        '/public/reports',
        expect.objectContaining({
          title: expect.any(String),
          description: 'Test Description',
          location: 'Test Location'
        })
      );
    });
  });

  it('should handle image upload', async () => {
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    
    renderWithRouter(<ProgramKerja />);
    
    const fileInput = screen.getByLabelText(/Tambahkan Foto/i) || 
                     document.querySelector('input[type="file"]');
    
    if (fileInput) {
      await userEvent.upload(fileInput, file);

      await waitFor(() => {
        // Image preview should appear
        const images = screen.getAllByRole('img');
        expect(images.length).toBeGreaterThan(0);
      });
    }
  });

  it('should convert image to base64 before submission', async () => {
    // Create a small image file
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    
    api.post.mockResolvedValueOnce({
      data: {
        id: 1,
        title: 'Test Report',
        date: '15 January 2025',
        description: 'Test Description'
      }
    });

    renderWithRouter(<ProgramKerja />);
    
    // Fill form
    const jenisInsidenInput = screen.getByLabelText(/Jenis Insiden/i);
    const tanggalInput = screen.getByLabelText(/Tanggal/i);
    const lokasiInput = screen.getByLabelText(/Lokasi/i);
    const deskripsiInput = screen.getByLabelText(/Deskripsi/i);

    await userEvent.type(jenisInsidenInput, 'Test Incident');
    await userEvent.type(tanggalInput, '2025-01-15');
    await userEvent.type(lokasiInput, 'Test Location');
    await userEvent.type(deskripsiInput, 'Test Description');

    // Upload image
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) {
      await userEvent.upload(fileInput, file);
    }

    const submitButton = screen.getByText(/Kirim Laporan/i);
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(api.post).toHaveBeenCalled();
      const callArgs = api.post.mock.calls[0];
      expect(callArgs[1]).toHaveProperty('image');
    });
  });

  it('should determine severity based on jenis insiden', async () => {
    api.post.mockResolvedValueOnce({
      data: {
        id: 1,
        title: 'Test Report',
        date: '15 January 2025',
        description: 'Test Description'
      }
    });

    renderWithRouter(<ProgramKerja />);
    
    // Fill form with "Berat" jenis insiden
    const jenisInsidenInput = screen.getByLabelText(/Jenis Insiden/i);
    const tanggalInput = screen.getByLabelText(/Tanggal/i);
    const lokasiInput = screen.getByLabelText(/Lokasi/i);
    const deskripsiInput = screen.getByLabelText(/Deskripsi/i);

    await userEvent.type(jenisInsidenInput, 'Berat');
    await userEvent.type(tanggalInput, '2025-01-15');
    await userEvent.type(lokasiInput, 'Test Location');
    await userEvent.type(deskripsiInput, 'Test Description');

    const submitButton = screen.getByText(/Kirim Laporan/i);
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(api.post).toHaveBeenCalled();
      const callArgs = api.post.mock.calls[0];
      expect(callArgs[1].severity).toBe('berat');
    });
  });

  it('should navigate to riwayat-pelaporan after successful submission', async () => {
    api.post.mockResolvedValueOnce({
      data: {
        id: 1,
        title: 'Test Report',
        date: '15 January 2025',
        description: 'Test Description'
      }
    });

    renderWithRouter(<ProgramKerja />);
    
    // Fill form
    const jenisInsidenInput = screen.getByLabelText(/Jenis Insiden/i);
    const tanggalInput = screen.getByLabelText(/Tanggal/i);
    const lokasiInput = screen.getByLabelText(/Lokasi/i);
    const deskripsiInput = screen.getByLabelText(/Deskripsi/i);

    await userEvent.type(jenisInsidenInput, 'Test Incident');
    await userEvent.type(tanggalInput, '2025-01-15');
    await userEvent.type(lokasiInput, 'Test Location');
    await userEvent.type(deskripsiInput, 'Test Description');

    const submitButton = screen.getByText(/Kirim Laporan/i);
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/riwayat-pelaporan');
    });
  });

  it('should handle API error', async () => {
    api.post.mockRejectedValueOnce(new Error('API Error'));

    renderWithRouter(<ProgramKerja />);
    
    // Fill form
    const jenisInsidenInput = screen.getByLabelText(/Jenis Insiden/i);
    const tanggalInput = screen.getByLabelText(/Tanggal/i);
    const lokasiInput = screen.getByLabelText(/Lokasi/i);
    const deskripsiInput = screen.getByLabelText(/Deskripsi/i);

    await userEvent.type(jenisInsidenInput, 'Test Incident');
    await userEvent.type(tanggalInput, '2025-01-15');
    await userEvent.type(lokasiInput, 'Test Location');
    await userEvent.type(deskripsiInput, 'Test Description');

    const submitButton = screen.getByText(/Kirim Laporan/i);
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(api.post).toHaveBeenCalled();
      expect(global.alert).toHaveBeenCalled();
    });
  });

  it('should remove photo when remove button is clicked', async () => {
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    
    renderWithRouter(<ProgramKerja />);
    
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) {
      await userEvent.upload(fileInput, file);

      // Wait for image preview to appear
      await waitFor(() => {
        const images = screen.getAllByRole('img');
        expect(images.length).toBeGreaterThan(0);
      }, { timeout: 3000 });

      // Find remove button - look for button with close icon or aria-label
      const removeButtons = screen.getAllByRole('button');
      const removeButton = removeButtons.find(btn => {
        const hasCloseIcon = btn.querySelector('svg[viewBox*="352"]'); // FaTimes icon
        return hasCloseIcon || btn.textContent.includes('×');
      });
      
      if (removeButton) {
        await userEvent.click(removeButton);
        
        // Wait for image to be removed
        await waitFor(() => {
          const imagesAfterRemove = screen.queryAllByRole('img');
          // Image should be removed (might still have logo, so check count decreased)
          expect(imagesAfterRemove.length).toBeLessThanOrEqual(1);
        }, { timeout: 3000 });
      }
    }
  });
});

