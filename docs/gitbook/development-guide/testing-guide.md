# Testing Guide

This guide provides comprehensive information on testing practices for the ClipFlowAI project.

## Testing Philosophy

Testing is a critical part of our development process. We follow these principles:

1. **Test-Driven Development (TDD)**: Write tests before implementing features when possible
2. **Comprehensive Coverage**: Aim for high test coverage across all parts of the codebase
3. **Realistic Testing**: Tests should reflect real-world usage scenarios
4. **Maintainable Tests**: Tests should be easy to understand and maintain

## Types of Tests

### Unit Tests

Unit tests verify that individual functions, methods, and components work correctly in isolation.

- **Frontend**: Test React components, hooks, and utility functions
- **Backend**: Test individual services, controllers, and utility functions

### Integration Tests

Integration tests verify that different parts of the application work together correctly.

- **Frontend**: Test interactions between components and services
- **Backend**: Test API endpoints and database interactions

### End-to-End Tests

End-to-end tests verify complete user flows from the frontend to the backend.

- Test user journeys like registration, login, video creation, etc.

## Testing Tools

### Frontend Testing

- **Jest**: Test runner and assertion library
- **React Testing Library**: Testing React components
- **Mock Service Worker**: Mocking API requests

### Backend Testing

- **Jest**: Test runner and assertion library
- **Supertest**: Testing HTTP requests

## Writing Tests

### Frontend Component Tests

```jsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import LoginForm from './LoginForm';

// Mock the auth context
jest.mock('../../context/AuthContext', () => ({
  useAuth: () => ({
    login: jest.fn(),
    error: null
  })
}));

test('renders login form with email and password fields', () => {
  render(
    <BrowserRouter>
      <LoginForm />
    </BrowserRouter>
  );
  
  // Check that form elements are rendered
  expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
});

test('submits form with user input', () => {
  const { login } = require('../../context/AuthContext').useAuth();
  
  render(
    <BrowserRouter>
      <LoginForm />
    </BrowserRouter>
  );
  
  // Fill out the form
  fireEvent.change(screen.getByLabelText(/email/i), {
    target: { value: 'test@example.com' }
  });
  
  fireEvent.change(screen.getByLabelText(/password/i), {
    target: { value: 'password123' }
  });
  
  // Submit the form
  fireEvent.click(screen.getByRole('button', { name: /login/i }));
  
  // Check that login was called with the correct arguments
  expect(login).toHaveBeenCalledWith('test@example.com', 'password123');
});
```

### Frontend Service Tests

```jsx
import { signIn, signUp } from './authService';
import { supabase } from '../config/supabase';

// Mock the Supabase client
jest.mock('../config/supabase', () => ({
  supabase: {
    auth: {
      signInWithPassword: jest.fn(),
      signUp: jest.fn()
    }
  }
}));

describe('authService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  describe('signIn', () => {
    it('should sign in a user with email and password', async () => {
      // Mock successful response
      supabase.auth.signInWithPassword.mockResolvedValue({
        data: { user: { id: 'user123' } },
        error: null
      });
      
      // Call the function
      const result = await signIn('test@example.com', 'password123');
      
      // Check the result
      expect(result).toEqual({ user: { id: 'user123' } });
      
      // Check that Supabase was called correctly
      expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123'
      });
    });
    
    it('should throw an error if sign in fails', async () => {
      // Mock error response
      supabase.auth.signInWithPassword.mockResolvedValue({
        data: null,
        error: { message: 'Invalid credentials' }
      });
      
      // Call the function and expect it to throw
      await expect(signIn('test@example.com', 'wrong-password'))
        .rejects
        .toEqual({ message: 'Invalid credentials' });
    });
  });
});
```

### Backend API Tests

```javascript
const request = require('supertest');
const app = require('../app');
const { supabase } = require('../config/supabase');

// Mock Supabase
jest.mock('../config/supabase', () => ({
  supabase: {
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis()
  }
}));

describe('Video API', () => {
  describe('GET /api/videos', () => {
    it('should return a list of videos', async () => {
      // Mock Supabase response
      supabase.from().select().eq.mockResolvedValue({
        data: [
          { id: 'video1', title: 'Test Video 1' },
          { id: 'video2', title: 'Test Video 2' }
        ],
        error: null
      });
      
      // Make the request
      const response = await request(app)
        .get('/api/videos')
        .set('Authorization', 'Bearer test-token');
      
      // Check the response
      expect(response.status).toBe(200);
      expect(response.body.data).toHaveLength(2);
      expect(response.body.data[0].title).toBe('Test Video 1');
    });
  });
});
```

## Running Tests

### Running Frontend Tests

```bash
# Run all frontend tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run a specific test file
npm test -- src/components/LoginForm.test.js
```

### Running Backend Tests

```bash
# Run all backend tests
npm run test:backend

# Run tests in watch mode
npm run test:backend:watch

# Run tests with coverage
npm run test:backend:coverage

# Run a specific test file
npm run test:backend -- services/videoService.test.js
```

### Running All Tests

```bash
# Run all tests (frontend and backend)
npm run test:all

# Run all tests with coverage
npm run test:all:coverage
```

## Test Coverage

We aim for high test coverage across the codebase:

- **Statements**: 80%
- **Branches**: 70%
- **Functions**: 80%
- **Lines**: 80%

To view coverage reports:

1. Run tests with coverage: `npm run test:coverage`
2. Open the coverage report: `open coverage/lcov-report/index.html`

## Continuous Integration

Tests are automatically run in our CI/CD pipeline:

1. When a pull request is opened or updated
2. When code is pushed to the main branch

Pull requests cannot be merged if tests are failing.

## Best Practices

1. **Keep tests focused**: Each test should verify one specific behavior
2. **Use descriptive test names**: Test names should clearly describe what is being tested
3. **Avoid test interdependence**: Tests should not depend on the state from other tests
4. **Mock external dependencies**: Use mocks for external services, APIs, and databases
5. **Test edge cases**: Include tests for error conditions and edge cases
6. **Maintain test quality**: Refactor tests when needed to keep them maintainable
