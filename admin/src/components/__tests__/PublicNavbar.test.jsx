import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import PublicNavbar from '../PublicNavbar';

const renderWithRouter = (component) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('PublicNavbar Component', () => {
  it('should render SafetyKU logo and text', () => {
    renderWithRouter(<PublicNavbar />);
    
    expect(screen.getByText(/SafetyKU/i)).toBeInTheDocument();
    expect(screen.getByText(/Indonesia/i)).toBeInTheDocument();
  });

  it('should render navigation links', () => {
    renderWithRouter(<PublicNavbar />);
    
    expect(screen.getByText(/Home/i)).toBeInTheDocument();
    expect(screen.getByText(/Catatan/i)).toBeInTheDocument();
    expect(screen.getByText(/Riwayat Pelaporan/i)).toBeInTheDocument();
    expect(screen.getByText(/Kegiatan/i)).toBeInTheDocument();
  });

  it('should not render Hubungi Kami link', () => {
    renderWithRouter(<PublicNavbar />);
    
    expect(screen.queryByText(/Hubungi Kami/i)).not.toBeInTheDocument();
  });
});

