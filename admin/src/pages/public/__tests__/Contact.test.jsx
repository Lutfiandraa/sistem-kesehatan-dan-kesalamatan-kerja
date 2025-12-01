import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import Contact from '../Contact';

const renderWithRouter = (component) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('Contact Component', () => {
  beforeEach(() => {
    // Cleanup any fake timers
    jest.useRealTimers();
    jest.clearAllTimers();
  });

  afterEach(() => {
    // Cleanup
    jest.useRealTimers();
    jest.clearAllTimers();
  });

  it('should render contact page', () => {
    renderWithRouter(<Contact />);
    
    expect(screen.getByText(/Hubungi Kami/i)).toBeInTheDocument();
  });

  it('should display contact information', () => {
    renderWithRouter(<Contact />);
    
    expect(screen.getByText(/Informasi Kontak/i)).toBeInTheDocument();
    expect(screen.getByText(/Alamat/i)).toBeInTheDocument();
    // Email appears in both contact info and form, use getAllByText
    const emailElements = screen.getAllByText(/Email/i);
    expect(emailElements.length).toBeGreaterThan(0);
    expect(screen.getByText(/Telepon/i)).toBeInTheDocument();
    expect(screen.getByText(/Jam Operasional/i)).toBeInTheDocument();
  });

  it('should display contact form', () => {
    renderWithRouter(<Contact />);
    
    // "Kirim Pesan" might appear multiple times, use getAllByText or getByRole
    const kirimPesanElements = screen.getAllByText(/Kirim Pesan/i);
    expect(kirimPesanElements.length).toBeGreaterThan(0);
    expect(screen.getByLabelText(/Nama/i)).toBeInTheDocument();
    // Email label appears in form, use getByLabelText with more specific context
    const emailLabel = screen.getAllByText(/Email/i).find(el => {
      const input = el.closest('div')?.querySelector('input[type="email"]');
      return input !== null;
    });
    expect(emailLabel).toBeTruthy();
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
    // Get submit button - use getByRole for button in form
    const submitButton = screen.getByRole('button', { name: /Kirim Pesan/i });
    
    await act(async () => {
      await userEvent.type(nameInput, 'Test User');
      await userEvent.type(emailInput, 'test@example.com');
      await userEvent.type(subjectInput, 'Test Subject');
      await userEvent.type(messageInput, 'Test Message');
      await userEvent.click(submitButton);
    });
    
    await waitFor(() => {
      expect(screen.getByText(/Pesan berhasil dikirim!/i)).toBeInTheDocument();
    }, { timeout: 4000 });
  });

  it('should validate required fields', () => {
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
    const submitButton = screen.getByRole('button', { name: /Kirim Pesan/i });
    
    // Fill form
    await act(async () => {
      await userEvent.type(nameInput, 'Test User');
      await userEvent.type(emailInput, 'test@example.com');
      await userEvent.type(subjectInput, 'Test Subject');
      await userEvent.type(messageInput, 'Test Message');
    });
    
    // Verify form is filled
    expect(nameInput).toHaveValue('Test User');
    expect(emailInput).toHaveValue('test@example.com');
    
    // Submit form
    await act(async () => {
      await userEvent.click(submitButton);
    });
    
    // Wait for success message
    await waitFor(() => {
      expect(screen.getByText(/Pesan berhasil dikirim!/i)).toBeInTheDocument();
    }, { timeout: 3000 });
    
    // Verify form was submitted successfully
    expect(screen.getByText(/Pesan berhasil dikirim!/i)).toBeInTheDocument();
    
    // The form reset happens via setTimeout(3000ms) in the component
    // Wait for form to reset - form will be visible again after 3000ms
    await waitFor(() => {
      // After reset, success message should disappear and form should be visible again
      const successMessage = screen.queryByText(/Pesan berhasil dikirim!/i);
      // Success message might still be there or gone, but form should be accessible
      const resetNameInput = screen.queryByLabelText(/Nama/i);
      expect(resetNameInput).toBeInTheDocument();
      
      // If form is visible, check that inputs are empty
      if (resetNameInput) {
        expect(resetNameInput).toHaveValue('');
        const resetEmailInput = screen.getByLabelText(/Email/i);
        const resetSubjectInput = screen.getByLabelText(/Subjek/i);
        const resetMessageInput = screen.getByLabelText(/Pesan/i);
        expect(resetEmailInput).toHaveValue('');
        expect(resetSubjectInput).toHaveValue('');
        expect(resetMessageInput).toHaveValue('');
      }
    }, { timeout: 5000 });
  }, 10000); // Increase test timeout to 10 seconds
});

