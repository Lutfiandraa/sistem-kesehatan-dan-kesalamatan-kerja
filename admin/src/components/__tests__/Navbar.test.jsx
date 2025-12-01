import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Navbar from '../Navbar';

// Mock AuthContext
const mockLogout = jest.fn();
jest.mock('../../context/AuthContext', () => ({
  ...jest.requireActual('../../context/AuthContext'),
  useAuth: () => ({
    user: {
      full_name: 'Test User',
      email: 'test@example.com'
    },
    logout: mockLogout
  })
}));

const renderWithRouter = (component, initialEntries = ['/dashboard']) => {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      {component}
    </MemoryRouter>
  );
};

describe('Navbar Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockLogout.mockClear();
  });

  it('should render navbar with logo and brand', () => {
    renderWithRouter(<Navbar />);
    
    expect(screen.getByText(/SafetyKU/i)).toBeInTheDocument();
    expect(screen.getByAltText(/SafetyKU Logo/i)).toBeInTheDocument();
  });

  it('should display navigation items', () => {
    renderWithRouter(<Navbar />);
    
    // Use getAllByText since there are multiple (desktop and mobile nav)
    const dashboardLinks = screen.getAllByText(/Dashboard/i);
    expect(dashboardLinks.length).toBeGreaterThan(0);
    
    const reportLinks = screen.getAllByText(/Pelaporan/i);
    expect(reportLinks.length).toBeGreaterThan(0);
    
    const historyLinks = screen.getAllByText(/Riwayat/i);
    expect(historyLinks.length).toBeGreaterThan(0);
    
    const statsLinks = screen.getAllByText(/Statistik/i);
    expect(statsLinks.length).toBeGreaterThan(0);
  });

  it('should display user name', () => {
    renderWithRouter(<Navbar />);
    
    expect(screen.getByText(/Test User/i)).toBeInTheDocument();
  });

  it('should call logout when logout button is clicked', async () => {
    renderWithRouter(<Navbar />);
    
    const logoutButton = screen.getByText(/Keluar/i);
    await userEvent.click(logoutButton);
    
    expect(mockLogout).toHaveBeenCalled();
  });

  it('should highlight active route', () => {
    renderWithRouter(<Navbar />, ['/dashboard']);
    
    // Get all Dashboard links and check the first one (desktop nav)
    const dashboardLinks = screen.getAllByText(/Dashboard/i);
    const dashboardLink = dashboardLinks[0].closest('a');
    expect(dashboardLink).toHaveClass('bg-green-100');
  });

  it('should have correct navigation links', () => {
    renderWithRouter(<Navbar />);
    
    // Get all links and check the first occurrence (desktop nav)
    const dashboardLinks = screen.getAllByText(/Dashboard/i);
    const dashboardLink = dashboardLinks[0].closest('a');
    expect(dashboardLink).toHaveAttribute('href', '/dashboard');
    
    const reportLinks = screen.getAllByText(/Pelaporan/i);
    const reportLink = reportLinks[0].closest('a');
    expect(reportLink).toHaveAttribute('href', '/report');
    
    const historyLinks = screen.getAllByText(/Riwayat/i);
    const historyLink = historyLinks[0].closest('a');
    expect(historyLink).toHaveAttribute('href', '/history');
    
    const statsLinks = screen.getAllByText(/Statistik/i);
    const statsLink = statsLinks[0].closest('a');
    expect(statsLink).toHaveAttribute('href', '/statistics');
  });
});

