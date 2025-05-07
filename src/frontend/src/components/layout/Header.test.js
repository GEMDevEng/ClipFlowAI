import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Header from './Header';
import { useAuth } from '../../context/AuthContext';
import { ROUTES } from '../../config/constants';

// Mock the useAuth hook
jest.mock('../../context/AuthContext', () => ({
  useAuth: jest.fn()
}));

// Mock the useNavigate hook
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate
}));

describe('Header Component', () => {
  const renderWithRouter = (ui) => {
    return render(
      <BrowserRouter>
        {ui}
      </BrowserRouter>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders logo and navigation links', () => {
    // Mock unauthenticated user
    useAuth.mockReturnValue({
      currentUser: null,
      logout: jest.fn()
    });

    renderWithRouter(<Header />);
    
    // Check logo
    expect(screen.getByText('ClipFlowAI')).toBeInTheDocument();
    
    // Check navigation links for unauthenticated users
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Log In')).toBeInTheDocument();
    expect(screen.getByText('Sign Up')).toBeInTheDocument();
    
    // Authenticated links should not be present
    expect(screen.queryByText('Dashboard')).not.toBeInTheDocument();
    expect(screen.queryByText('Analytics')).not.toBeInTheDocument();
    expect(screen.queryByText('Create Video')).not.toBeInTheDocument();
    expect(screen.queryByText('Profile')).not.toBeInTheDocument();
  });

  test('renders authenticated navigation when user is logged in', () => {
    // Mock authenticated user
    useAuth.mockReturnValue({
      currentUser: {
        email: 'test@example.com',
        user_metadata: {
          name: 'Test User'
        }
      },
      logout: jest.fn()
    });

    renderWithRouter(<Header />);
    
    // Check authenticated navigation links
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Analytics')).toBeInTheDocument();
    expect(screen.getByText('Create Video')).toBeInTheDocument();
    
    // Unauthenticated links should not be present
    expect(screen.queryByText('Log In')).not.toBeInTheDocument();
    expect(screen.queryByText('Sign Up')).not.toBeInTheDocument();
  });

  test('toggles mobile menu when button is clicked', () => {
    // Mock unauthenticated user
    useAuth.mockReturnValue({
      currentUser: null,
      logout: jest.fn()
    });

    renderWithRouter(<Header />);
    
    // Mobile menu should be hidden initially
    const nav = screen.getByRole('navigation');
    expect(nav).toHaveClass('hidden');
    
    // Click the toggle button
    const toggleButton = screen.getByLabelText('Toggle menu');
    fireEvent.click(toggleButton);
    
    // Mobile menu should be visible
    expect(nav).toHaveClass('block');
    
    // Click the toggle button again
    fireEvent.click(toggleButton);
    
    // Mobile menu should be hidden again
    expect(nav).toHaveClass('hidden');
  });

  test('calls logout and navigates to home when logout button is clicked', async () => {
    // Mock authenticated user and logout function
    const mockLogout = jest.fn().mockResolvedValue();
    useAuth.mockReturnValue({
      currentUser: {
        email: 'test@example.com',
        user_metadata: {
          name: 'Test User'
        }
      },
      logout: mockLogout
    });

    renderWithRouter(<Header />);
    
    // Find and click the logout button
    // Note: We need to make the dropdown visible first
    const profileDropdown = screen.getByText('T'); // First letter of Test User
    fireEvent.mouseEnter(profileDropdown.closest('.group'));
    
    const logoutButton = screen.getByText('Log Out');
    fireEvent.click(logoutButton);
    
    // Check if logout was called
    expect(mockLogout).toHaveBeenCalled();
    
    // Check if navigation occurred
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith(ROUTES.HOME);
    });
  });

  test('displays user avatar when available', () => {
    // Mock authenticated user with avatar
    useAuth.mockReturnValue({
      currentUser: {
        email: 'test@example.com',
        user_metadata: {
          name: 'Test User',
          avatar_url: 'https://example.com/avatar.jpg'
        }
      },
      logout: jest.fn()
    });

    renderWithRouter(<Header />);
    
    // Check if avatar is displayed
    const avatar = screen.getByAltText('Profile');
    expect(avatar).toBeInTheDocument();
    expect(avatar).toHaveAttribute('src', 'https://example.com/avatar.jpg');
  });

  test('displays first letter of name when avatar is not available', () => {
    // Mock authenticated user without avatar
    useAuth.mockReturnValue({
      currentUser: {
        email: 'test@example.com',
        user_metadata: {
          name: 'Test User'
        }
      },
      logout: jest.fn()
    });

    renderWithRouter(<Header />);
    
    // Check if first letter is displayed
    expect(screen.getByText('T')).toBeInTheDocument();
  });

  test('displays first letter of email when name and avatar are not available', () => {
    // Mock authenticated user without name or avatar
    useAuth.mockReturnValue({
      currentUser: {
        email: 'test@example.com',
        user_metadata: {}
      },
      logout: jest.fn()
    });

    renderWithRouter(<Header />);
    
    // Check if first letter of email is displayed
    expect(screen.getByText('T')).toBeInTheDocument();
  });
});
