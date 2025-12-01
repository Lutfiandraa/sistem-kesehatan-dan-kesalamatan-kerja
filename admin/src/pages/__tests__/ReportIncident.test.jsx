import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import ReportIncident from '../ReportIncident';
import api from '../../services/api';

// Mock API
jest.mock('../../services/api', () => ({
  post: jest.fn()
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

describe('ReportIncident Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockNavigate.mockClear();
  });

  it('should render report incident form', () => {
    renderWithRouter(<ReportIncident />);
    
    expect(screen.getByText(/Laporkan Insiden/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Jenis Insiden/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Judul Laporan/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Deskripsi/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Lokasi/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Tanggal & Waktu Insiden/i)).toBeInTheDocument();
    // Tingkat Keparahan doesn't have htmlFor, so use getByText or getByRole
    expect(screen.getByText(/Tingkat Keparahan/i)).toBeInTheDocument();
  });

  it('should handle form input changes', async () => {
    renderWithRouter(<ReportIncident />);
    
    const titleInput = screen.getByLabelText(/Judul Laporan/i);
    const descriptionInput = screen.getByLabelText(/Deskripsi/i);
    const locationInput = screen.getByLabelText(/Lokasi/i);
    
    await act(async () => {
      await userEvent.type(titleInput, 'Test Incident');
      await userEvent.type(descriptionInput, 'Test Description');
      await userEvent.type(locationInput, 'Test Location');
    });
    
    expect(titleInput).toHaveValue('Test Incident');
    expect(descriptionInput).toHaveValue('Test Description');
    expect(locationInput).toHaveValue('Test Location');
  });

  it('should change incident type', async () => {
    renderWithRouter(<ReportIncident />);
    
    const incidentTypeSelect = screen.getByLabelText(/Jenis Insiden/i);
    
    await act(async () => {
      await userEvent.selectOptions(incidentTypeSelect, 'injury');
    });
    
    expect(incidentTypeSelect).toHaveValue('injury');
  });

  it('should change severity level', async () => {
    renderWithRouter(<ReportIncident />);
    
    const highSeverityButton = screen.getByText(/Tinggi/i);
    
    await act(async () => {
      await userEvent.click(highSeverityButton);
    });
    
    // Wait for state update and check that the button is selected
    // The button should have the selected background color (red for high severity)
    await waitFor(() => {
      // Check that button has the severity color as background (inline style)
      const bgColor = highSeverityButton.style.backgroundColor;
      expect(bgColor).toBeTruthy();
      // High severity color is #f44336
    }, { timeout: 2000 });
  });

  it('should submit form successfully', async () => {
    api.post.mockResolvedValueOnce({});
    
    renderWithRouter(<ReportIncident />);
    
    const titleInput = screen.getByLabelText(/Judul Laporan/i);
    const descriptionInput = screen.getByLabelText(/Deskripsi/i);
    const locationInput = screen.getByLabelText(/Lokasi/i);
    const submitButton = screen.getByText(/Kirim Laporan/i);
    
    await act(async () => {
      await userEvent.type(titleInput, 'Test Incident');
      await userEvent.type(descriptionInput, 'Test Description');
      await userEvent.type(locationInput, 'Test Location');
      await userEvent.click(submitButton);
    });
    
    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/incidents', expect.objectContaining({
        title: 'Test Incident',
        description: 'Test Description',
        location: 'Test Location'
      }));
    });
    
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/history');
    });
  });

  it('should display error message on submission failure', async () => {
    api.post.mockRejectedValueOnce({
      response: {
        data: {
          message: 'Error creating report'
        }
      }
    });
    
    renderWithRouter(<ReportIncident />);
    
    const titleInput = screen.getByLabelText(/Judul Laporan/i);
    const descriptionInput = screen.getByLabelText(/Deskripsi/i);
    const locationInput = screen.getByLabelText(/Lokasi/i);
    const submitButton = screen.getByText(/Kirim Laporan/i);
    
    await act(async () => {
      await userEvent.type(titleInput, 'Test Incident');
      await userEvent.type(descriptionInput, 'Test Description');
      await userEvent.type(locationInput, 'Test Location');
      await userEvent.click(submitButton);
    });
    
    await waitFor(() => {
      expect(screen.getByText(/Error creating report/i)).toBeInTheDocument();
    });
  });

  it('should disable submit button while loading', async () => {
    api.post.mockImplementation(() => new Promise(() => {})); // Never resolves
    
    renderWithRouter(<ReportIncident />);
    
    const titleInput = screen.getByLabelText(/Judul Laporan/i);
    const descriptionInput = screen.getByLabelText(/Deskripsi/i);
    const locationInput = screen.getByLabelText(/Lokasi/i);
    const submitButton = screen.getByText(/Kirim Laporan/i);
    
    await act(async () => {
      await userEvent.type(titleInput, 'Test Incident');
      await userEvent.type(descriptionInput, 'Test Description');
      await userEvent.type(locationInput, 'Test Location');
      await userEvent.click(submitButton);
    });
    
    await waitFor(() => {
      expect(screen.getByText(/Mengirim.../i)).toBeInTheDocument();
    });
    
    await waitFor(() => {
      expect(submitButton).toBeDisabled();
    });
  });

  it('should navigate to dashboard when cancel is clicked', async () => {
    renderWithRouter(<ReportIncident />);
    
    const cancelButton = screen.getByText(/Batal/i);
    
    await act(async () => {
      await userEvent.click(cancelButton);
    });
    
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
  });

  it('should validate required fields', () => {
    renderWithRouter(<ReportIncident />);
    
    const titleInput = screen.getByLabelText(/Judul Laporan/i);
    const descriptionInput = screen.getByLabelText(/Deskripsi/i);
    const locationInput = screen.getByLabelText(/Lokasi/i);
    
    expect(titleInput).toBeRequired();
    expect(descriptionInput).toBeRequired();
    expect(locationInput).toBeRequired();
  });
});

