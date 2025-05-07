/**
 * Integration test for the authentication workflow
 */
const request = require('supertest');
const { createServer } = require('../../src/backend/server');
const { supabase } = require('../../src/backend/config/supabaseClient');

// Mock Supabase
jest.mock('../../src/backend/config/supabaseClient', () => ({
  supabase: {
    auth: {
      signUp: jest.fn(),
      signInWithPassword: jest.fn(),
      signInWithOAuth: jest.fn(),
      signOut: jest.fn(),
      resetPasswordForEmail: jest.fn(),
      updateUser: jest.fn()
    },
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    single: jest.fn().mockReturnThis(),
    insert: jest.fn(),
    update: jest.fn()
  }
}));

describe('Authentication Workflow', () => {
  let app;
  let server;
  
  beforeAll(() => {
    const { app: expressApp, server: httpServer } = createServer();
    app = expressApp;
    server = httpServer;
  });
  
  afterAll((done) => {
    if (server) {
      server.close(done);
    } else {
      done();
    }
  });
  
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  it('should register a new user', async () => {
    // Mock successful signup
    supabase.auth.signUp.mockResolvedValueOnce({
      data: {
        user: {
          id: 'user123',
          email: 'test@example.com',
          user_metadata: {
            name: 'Test User'
          }
        },
        session: {
          access_token: 'test-token',
          refresh_token: 'refresh-token'
        }
      },
      error: null
    });
    
    // Mock successful profile creation
    supabase.from().insert.mockResolvedValueOnce({
      data: { id: 'profile123' },
      error: null
    });
    
    const response = await request(app)
      .post('/api/auth/signup')
      .send({
        email: 'test@example.com',
        password: 'Password123!',
        name: 'Test User'
      });
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('user');
    expect(response.body.user).toHaveProperty('id', 'user123');
    expect(response.body.user).toHaveProperty('email', 'test@example.com');
    expect(response.body).toHaveProperty('session');
    expect(response.body.session).toHaveProperty('access_token', 'test-token');
    
    // Verify that signUp was called with the correct parameters
    expect(supabase.auth.signUp).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'Password123!',
      options: {
        data: {
          name: 'Test User'
        }
      }
    });
    
    // Verify that profile was created
    expect(supabase.from).toHaveBeenCalledWith('profiles');
    expect(supabase.from().insert).toHaveBeenCalledWith({
      id: 'user123',
      name: 'Test User',
      email: 'test@example.com'
    });
  });
  
  it('should login an existing user', async () => {
    // Mock successful login
    supabase.auth.signInWithPassword.mockResolvedValueOnce({
      data: {
        user: {
          id: 'user123',
          email: 'test@example.com',
          user_metadata: {
            name: 'Test User'
          }
        },
        session: {
          access_token: 'test-token',
          refresh_token: 'refresh-token'
        }
      },
      error: null
    });
    
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'Password123!'
      });
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('user');
    expect(response.body.user).toHaveProperty('id', 'user123');
    expect(response.body.user).toHaveProperty('email', 'test@example.com');
    expect(response.body).toHaveProperty('session');
    expect(response.body.session).toHaveProperty('access_token', 'test-token');
    
    // Verify that signInWithPassword was called with the correct parameters
    expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'Password123!'
    });
  });
  
  it('should handle login errors', async () => {
    // Mock login error
    supabase.auth.signInWithPassword.mockResolvedValueOnce({
      data: { user: null, session: null },
      error: { message: 'Invalid login credentials' }
    });
    
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'WrongPassword'
      });
    
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toContain('Invalid login credentials');
  });
  
  it('should logout a user', async () => {
    // Mock successful logout
    supabase.auth.signOut.mockResolvedValueOnce({
      error: null
    });
    
    const response = await request(app)
      .post('/api/auth/logout');
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toContain('Logged out successfully');
    
    // Verify that signOut was called
    expect(supabase.auth.signOut).toHaveBeenCalled();
  });
  
  it('should reset a user password', async () => {
    // Mock successful password reset
    supabase.auth.resetPasswordForEmail.mockResolvedValueOnce({
      data: {},
      error: null
    });
    
    const response = await request(app)
      .post('/api/auth/reset-password')
      .send({
        email: 'test@example.com'
      });
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toContain('Password reset email sent');
    
    // Verify that resetPasswordForEmail was called with the correct parameters
    expect(supabase.auth.resetPasswordForEmail).toHaveBeenCalledWith(
      'test@example.com'
    );
  });
  
  it('should update a user profile', async () => {
    // Mock successful profile update
    supabase.auth.updateUser.mockResolvedValueOnce({
      data: {
        user: {
          id: 'user123',
          email: 'test@example.com',
          user_metadata: {
            name: 'Updated Name'
          }
        }
      },
      error: null
    });
    
    // Mock successful profile update in database
    supabase.from().update.mockResolvedValueOnce({
      data: { id: 'profile123' },
      error: null
    });
    
    const response = await request(app)
      .put('/api/auth/profile')
      .send({
        userId: 'user123',
        name: 'Updated Name',
        bio: 'New bio'
      });
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('user');
    expect(response.body.user.user_metadata).toHaveProperty('name', 'Updated Name');
    
    // Verify that updateUser was called with the correct parameters
    expect(supabase.auth.updateUser).toHaveBeenCalledWith({
      data: {
        name: 'Updated Name'
      }
    });
    
    // Verify that profile was updated
    expect(supabase.from).toHaveBeenCalledWith('profiles');
    expect(supabase.from().update).toHaveBeenCalledWith({
      name: 'Updated Name',
      bio: 'New bio'
    });
  });
});
