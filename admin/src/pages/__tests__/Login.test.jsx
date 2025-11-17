import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import Login from '../Login';
import { AuthProvider } from '../../context/AuthContext';

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate
}));

// Mock AuthContext
const mockLogin = jest.fn();
jest.mock('../../context/AuthContext', () => ({
  ...jest.requireActual('../../context/AuthContext'),
  useAuth: () => ({
    login: mockLogin,
    user: null
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

describe('Login Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockNavigate.mockClear();
    mockLogin.mockClear();
    sessionStorage.clear();
  });

  it('should render login form', () => {
    renderWithRouter(<Login />);
    
    expect(screen.getByText(/Masuk/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Kata Sandi/i)).toBeInTheDocument();
    expect(screen.getByText(/Lanjut/i)).toBeInTheDocument();
  });

  it('should toggle password visibility', async () => {
    renderWithRouter(<Login />);
    
    const passwordInput = screen.getByPlaceholderText(/Kata Sandi/i);
    const toggleButton = screen.getByRole('button', { name: /👁️/i });
    
    expect(passwordInput).toHaveAttribute('type', 'password');
    
    await act(async () => {
      await userEvent.click(toggleButton);
    });
    
    expect(passwordInput).toHaveAttribute('type', 'text');
  });

  it('should handle form submission with valid credentials', async () => {
    mockLogin.mockResolvedValueOnce({ success: true });
    
    renderWithRouter(<Login />);
    
    const emailInput = screen.getByPlaceholderText(/Email/i);
    const passwordInput = screen.getByPlaceholderText(/Kata Sandi/i);
    const submitButton = screen.getByText(/Lanjut/i);
    
    await act(async () => {
      await userEvent.type(emailInput, 'test@example.com');
      await userEvent.type(passwordInput, 'password123');
      await userEvent.click(submitButton);
    });
    
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123');
    });
    
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('should display error message on login failure', async () => {
    mockLogin.mockResolvedValueOnce({ 
      success: false, 
      message: 'Email atau Kata Sandi salah' 
    });
    
    renderWithRouter(<Login />);
    
    const emailInput = screen.getByPlaceholderText(/Email/i);
    const passwordInput = screen.getByPlaceholderText(/Kata Sandi/i);
    const submitButton = screen.getByText(/Lanjut/i);
    
    await act(async () => {
      await userEvent.type(emailInput, 'wrong@example.com');
      await userEvent.type(passwordInput, 'wrongpassword');
      await userEvent.click(submitButton);
    });
    
    await waitFor(() => {
      expect(screen.getByText(/Email atau Kata Sandi salah/i)).toBeInTheDocument();
    });
  });

  it('should disable submit button while loading', async () => {
    mockLogin.mockImplementation(() => new Promise(() => {})); // Never resolves
    
    renderWithRouter(<Login />);
    
    const emailInput = screen.getByPlaceholderText(/Email/i);
    const passwordInput = screen.getByPlaceholderText(/Kata Sandi/i);
    const submitButton = screen.getByText(/Lanjut/i);
    
    await act(async () => {
      await userEvent.type(emailInput, 'test@example.com');
      await userEvent.type(passwordInput, 'password123');
      await userEvent.click(submitButton);
    });
    
    await waitFor(() => {
      expect(screen.getByText(/Memproses.../i)).toBeInTheDocument();
    });
    
    expect(submitButton).toBeDisabled();
  });

  it('should validate required fields', async () => {
    renderWithRouter(<Login />);
    
    const submitButton = screen.getByText(/Lanjut/i);
    
    await act(async () => {
      await userEvent.click(submitButton);
    });
    
    // HTML5 validation should prevent submission
    const emailInput = screen.getByPlaceholderText(/Email/i);
    expect(emailInput).toBeRequired();
    
    const passwordInput = screen.getByPlaceholderText(/Kata Sandi/i);
    expect(passwordInput).toBeRequired();
  });
});

