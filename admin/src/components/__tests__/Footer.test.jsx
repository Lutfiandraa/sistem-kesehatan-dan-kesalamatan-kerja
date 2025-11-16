import { render, screen } from '@testing-library/react';
import Footer from '../Footer';

describe('Footer Component', () => {
  it('should render copyright text', () => {
    render(<Footer />);
    
    expect(screen.getByText(/Copyright © 2025 SafetyKU/i)).toBeInTheDocument();
    expect(screen.getByText(/AndraIndustries/i)).toBeInTheDocument();
  });

  it('should render SafetyKU Indonesia text', () => {
    render(<Footer />);
    
    expect(screen.getByText(/SafetyKU Indonesia/i)).toBeInTheDocument();
  });

  it('should not render Hubungi Kami link', () => {
    render(<Footer />);
    
    expect(screen.queryByText(/Hubungi Kami/i)).not.toBeInTheDocument();
  });
});

