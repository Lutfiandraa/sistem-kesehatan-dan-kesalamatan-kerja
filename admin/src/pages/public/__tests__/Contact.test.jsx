import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import Contact from '../Contact';

const renderWithRouter = (component) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('Contact Component', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('should render contact page', () => {
    renderWithRouter(<Contact />);
    
    expect(screen.getByText(/Hubungi Kami/i)).toBeInTheDocument();
  });

  it('should display contact information', () => {
    renderWithRouter(<Contact />);
    
    expect(screen.getByText(/Informasi Kontak/i)).toBeInTheDocument();
    expect(screen.getByText(/Alamat/i)).toBeInTheDocument();
    expect(screen.getByText(/Email/i)).toBeInTheDocument();
    expect(screen.getByText(/Telepon/i)).toBeInTheDocument();
    expect(screen.getByText(/Jam Operasional/i)).toBeInTheDocument();
  });

  it('should display contact form', () => {
    renderWithRouter(<Contact />);
    
    expect(screen.getByText(/Kirim Pesan/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Nama/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Subjek/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Pesan/i)).toBeInTheDocument();
  });

  it('should handle form input changes', async () => {
    renderWithRouter(<Contact />);
    
    const nameInput = screen.getByLabelText(/Nama/i);
    const emailInput = screen.getByLabelText(/Email/i);
    const subjectInput = screen.getByLabelText(/Subjek/i);
    const messageInput = screen.getByLabelText(/Pesan/i);
    
    await act(async () => {
      await userEvent.type(nameInput, 'Test User');
      await userEvent.type(emailInput, 'test@example.com');
      await userEvent.type(subjectInput, 'Test Subject');
      await userEvent.type(messageInput, 'Test Message');
    });
    
    expect(nameInput).toHaveValue('Test User');
    expect(emailInput).toHaveValue('test@example.com');
    expect(subjectInput).toHaveValue('Test Subject');
    expect(messageInput).toHaveValue('Test Message');
  });

  it('should submit form successfully', async () => {
    renderWithRouter(<Contact />);
    
    const nameInput = screen.getByLabelText(/Nama/i);
    const emailInput = screen.getByLabelText(/Email/i);
    const subjectInput = screen.getByLabelText(/Subjek/i);
    const messageInput = screen.getByLabelText(/Pesan/i);
    const submitButton = screen.getByText(/Kirim Pesan/i);
    
    await act(async () => {
      await userEvent.type(nameInput, 'Test User');
      await userEvent.type(emailInput, 'test@example.com');
      await userEvent.type(subjectInput, 'Test Subject');
      await userEvent.type(messageInput, 'Test Message');
      await userEvent.click(submitButton);
    });
    
    await waitFor(() => {
      expect(screen.getByText(/Pesan berhasil dikirim!/i)).toBeInTheDocument();
    });
  });

  it('should validate required fields', async () => {
    renderWithRouter(<Contact />);
    
    const nameInput = screen.getByLabelText(/Nama/i);
    const emailInput = screen.getByLabelText(/Email/i);
    const subjectInput = screen.getByLabelText(/Subjek/i);
    const messageInput = screen.getByLabelText(/Pesan/i);
    
    expect(nameInput).toBeRequired();
    expect(emailInput).toBeRequired();
    expect(subjectInput).toBeRequired();
    expect(messageInput).toBeRequired();
  });

  it('should reset form after submission', async () => {
    renderWithRouter(<Contact />);
    
    const nameInput = screen.getByLabelText(/Nama/i);
    const emailInput = screen.getByLabelText(/Email/i);
    const subjectInput = screen.getByLabelText(/Subjek/i);
    const messageInput = screen.getByLabelText(/Pesan/i);
    const submitButton = screen.getByText(/Kirim Pesan/i);
    
    await act(async () => {
      await userEvent.type(nameInput, 'Test User');
      await userEvent.type(emailInput, 'test@example.com');
      await userEvent.type(subjectInput, 'Test Subject');
      await userEvent.type(messageInput, 'Test Message');
      await userEvent.click(submitButton);
    });
    
    await waitFor(() => {
      expect(screen.getByText(/Pesan berhasil dikirim!/i)).toBeInTheDocument();
    });
    
    // Fast-forward timers to trigger reset
    act(() => {
      jest.advanceTimersByTime(3000);
    });
    
    await waitFor(() => {
      expect(nameInput).toHaveValue('');
      expect(emailInput).toHaveValue('');
      expect(subjectInput).toHaveValue('');
      expect(messageInput).toHaveValue('');
    });
  });
});

