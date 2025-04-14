import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Analytics from './Analytics';
import { AuthProvider } from '../context/AuthContext';

test('renders the Analytics component', () => {
  render(
    <BrowserRouter>
      <AuthProvider>
        <Analytics />
      </AuthProvider>
    </BrowserRouter>
  );
  const headingElement = screen.getByText(/Video Analytics/i);
  expect(headingElement).toBeInTheDocument();
});
