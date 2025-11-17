import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Layout from '../Layout';

// Mock Navbar
jest.mock('../Navbar', () => {
  return function MockNavbar() {
    return <nav data-testid="navbar">Navbar</nav>;
  };
});

const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('Layout Component', () => {
  it('should render layout with navbar', () => {
    renderWithRouter(
      <Layout>
        <div>Test Content</div>
      </Layout>
    );
    
    expect(screen.getByTestId('navbar')).toBeInTheDocument();
    expect(screen.getByText(/Test Content/i)).toBeInTheDocument();
  });

  it('should render children content', () => {
    renderWithRouter(
      <Layout>
        <div>Child Content</div>
      </Layout>
    );
    
    expect(screen.getByText(/Child Content/i)).toBeInTheDocument();
  });
});

