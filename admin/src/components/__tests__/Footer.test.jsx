import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Footer from '../Footer';

const renderWithRouter = (component) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('Footer Component', () => {
  it('should render copyright text', () => {
    renderWithRouter(<Footer />);
    
    expect(screen.getByText(/Copyright © 2025 SafetyKU/i)).toBeInTheDocument();
    expect(screen.getByText(/AndraIndustries/i)).toBeInTheDocument();
  });

  it('should render SafetyKU Indonesia text', () => {
    renderWithRouter(<Footer />);
    
    expect(screen.getByText(/SafetyKU/i)).toBeInTheDocument();
    expect(screen.getByText(/Indonesia/i)).toBeInTheDocument();
  });

  it('should not render Hubungi Kami link', () => {
    renderWithRouter(<Footer />);
    
    expect(screen.queryByText(/Hubungi Kami/i)).not.toBeInTheDocument();
  });
});

