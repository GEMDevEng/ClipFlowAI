import React from 'react';
import '@testing-library/jest-dom'; // Import jest-dom
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom'; // Import BrowserRouter
import Home from './Home';

test('renders the Home component', () => {
  render(
    <BrowserRouter> {/* Wrap Home component with BrowserRouter */}
      <Home />
    </BrowserRouter>
  );
  const headingElement = screen.getByText(/Create Viral Videos with AI/i);
  expect(headingElement).toBeInTheDocument();
});
