import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import PublicLayout from '../PublicLayout';

// Mock PublicNavbar and Footer
jest.mock('../PublicNavbar', () => {
  return function MockPublicNavbar() {
    return <nav data-testid="public-navbar">PublicNavbar</nav>;
  };
});

jest.mock('../Footer', () => {
  return function MockFooter() {
    return <footer data-testid="footer">Footer</footer>;
  };
});

const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('PublicLayout Component', () => {
  it('should render layout with navbar and footer', () => {
    renderWithRouter(
      <PublicLayout>
        <div>Test Content</div>
      </PublicLayout>
    );
    
    expect(screen.getByTestId('public-navbar')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
    expect(screen.getByText(/Test Content/i)).toBeInTheDocument();
  });

  it('should render children content', () => {
    renderWithRouter(
      <PublicLayout>
        <div>Child Content</div>
      </PublicLayout>
    );
    
    expect(screen.getByText(/Child Content/i)).toBeInTheDocument();
  });
});

