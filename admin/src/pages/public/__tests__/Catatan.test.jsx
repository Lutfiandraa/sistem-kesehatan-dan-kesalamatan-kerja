import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Catatan from '../Catatan';

const renderWithRouter = (component) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('Catatan Component', () => {
  it('should render catatan page', () => {
    renderWithRouter(<Catatan />);
    
    expect(screen.getByText(/Catatan/i)).toBeInTheDocument();
  });

  it('should display pembuatan pelaporan card', () => {
    renderWithRouter(<Catatan />);
    
    expect(screen.getByText(/Pembuatan Pelaporan/i)).toBeInTheDocument();
    expect(screen.getByText(/Buat laporan insiden baru/i)).toBeInTheDocument();
  });

  it('should display hasil pelaporan card', () => {
    renderWithRouter(<Catatan />);
    
    expect(screen.getByText(/Hasil Pelaporan/i)).toBeInTheDocument();
    expect(screen.getByText(/Lihat riwayat pelaporan/i)).toBeInTheDocument();
  });

  it('should have correct links', () => {
    renderWithRouter(<Catatan />);
    
    const pembuatanLink = screen.getByText(/Pembuatan Pelaporan/i).closest('a');
    expect(pembuatanLink).toHaveAttribute('href', '/program-kerja');
    
    const hasilLink = screen.getByText(/Hasil Pelaporan/i).closest('a');
    expect(hasilLink).toHaveAttribute('href', '/riwayat-pelaporan');
  });

  it('should render icons', () => {
    renderWithRouter(<Catatan />);
    
    // Icons are rendered as SVG elements
    const icons = document.querySelectorAll('svg');
    expect(icons.length).toBeGreaterThan(0);
  });
});

