import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Home from './Home';

// Mock the auth context
jest.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    currentUser: null,
    loading: false,
    error: null
  })
}));

test('renders the Home component', () => {
  render(
    <BrowserRouter>
      <Home />
    </BrowserRouter>
  );
  const headingElement = screen.getByText(/Create Viral Videos with AI/i);
  expect(headingElement).toBeInTheDocument();

  // Check for call-to-action buttons
  const getStartedButton = screen.getByText(/Get Started/i);
  expect(getStartedButton).toBeInTheDocument();

  // Check for features section
  const featuresHeading = screen.getByText(/How It Works/i);
  expect(featuresHeading).toBeInTheDocument();
});
