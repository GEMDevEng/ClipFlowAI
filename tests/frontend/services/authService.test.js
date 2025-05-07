import { 
  signUp, 
  signIn, 
  signInWithGoogle, 
  signOut, 
  getCurrentUser, 
  getSession, 
  resetPassword, 
  updateProfile, 
  onAuthStateChange 
} from '../../../src/frontend/src/services/auth/authService';
import { supabase } from '../../../src/frontend/src/config/supabase';
import { ERROR_MESSAGES } from '../../../src/frontend/src/config/constants';

// Mock the Supabase client
jest.mock('../../../src/frontend/src/config/supabase', () => ({
  supabase: {
    auth: {
      signUp: jest.fn(),
      signInWithPassword: jest.fn(),
      signInWithOAuth: jest.fn(),
      signOut: jest.fn(),
      getUser: jest.fn(),
      getSession: jest.fn(),
      resetPasswordForEmail: jest.fn(),
      updateUser: jest.fn(),
      onAuthStateChange: jest.fn(),
    }
  }
}));

describe('Authentication Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('signUp', () => {
    it('should sign up a user successfully', async () => {
      // Mock successful response
      const mockUser = { id: 'user123', email: 'test@example.com' };
      supabase.auth.signUp.mockResolvedValue({
        data: { user: mockUser },
        error: null
      });

      // Call the function
      const result = await signUp('test@example.com', 'password123', { name: 'Test User' });

      // Verify the result
      expect(result).toEqual({ user: mockUser });
      expect(supabase.auth.signUp).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
        options: {
          data: { name: 'Test User' }
        }
      });
    });

    it('should handle email already in use error', async () => {
      // Mock error response
      supabase.auth.signUp.mockResolvedValue({
        data: null,
        error: { message: 'User already registered' }
      });

      // Call the function and expect it to throw
      await expect(signUp('test@example.com', 'password123'))
        .rejects
        .toThrow(ERROR_MESSAGES.AUTH.EMAIL_IN_USE);

      expect(console.error).toHaveBeenCalled();
    });

    it('should handle generic error', async () => {
      // Mock error response
      const mockError = new Error('Network error');
      supabase.auth.signUp.mockRejectedValue(mockError);

      // Call the function and expect it to throw
      await expect(signUp('test@example.com', 'password123'))
        .rejects
        .toThrow('Network error');

      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('signIn', () => {
    it('should sign in a user successfully', async () => {
      // Mock successful response
      const mockUser = { id: 'user123', email: 'test@example.com' };
      supabase.auth.signInWithPassword.mockResolvedValue({
        data: { user: mockUser },
        error: null
      });

      // Call the function
      const result = await signIn('test@example.com', 'password123');

      // Verify the result
      expect(result).toEqual({ user: mockUser });
      expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123'
      });
    });

    it('should handle invalid credentials error', async () => {
      // Mock error response
      supabase.auth.signInWithPassword.mockResolvedValue({
        data: null,
        error: { message: 'Invalid login credentials' }
      });

      // Call the function and expect it to throw
      await expect(signIn('test@example.com', 'wrong-password'))
        .rejects
        .toThrow(ERROR_MESSAGES.AUTH.INVALID_CREDENTIALS);

      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('signInWithGoogle', () => {
    it('should initiate Google sign in', async () => {
      // Mock successful response
      supabase.auth.signInWithOAuth.mockResolvedValue({
        data: { provider: 'google' },
        error: null
      });

      // Call the function
      const result = await signInWithGoogle();

      // Verify the result
      expect(result).toEqual({ provider: 'google' });
      expect(supabase.auth.signInWithOAuth).toHaveBeenCalledWith({
        provider: 'google',
        options: {
          redirectTo: expect.any(String)
        }
      });
    });
  });

  describe('signOut', () => {
    it('should sign out a user successfully', async () => {
      // Mock successful response
      supabase.auth.signOut.mockResolvedValue({
        error: null
      });

      // Call the function
      await signOut();

      // Verify the function was called
      expect(supabase.auth.signOut).toHaveBeenCalled();
    });
  });

  describe('getCurrentUser', () => {
    it('should get the current user', async () => {
      // Mock successful response
      const mockUser = { id: 'user123', email: 'test@example.com' };
      supabase.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null
      });

      // Call the function
      const result = await getCurrentUser();

      // Verify the result
      expect(result).toEqual(mockUser);
      expect(supabase.auth.getUser).toHaveBeenCalled();
    });

    it('should return null if no user is found', async () => {
      // Mock response with no user
      supabase.auth.getUser.mockResolvedValue({
        data: { user: null },
        error: null
      });

      // Call the function
      const result = await getCurrentUser();

      // Verify the result
      expect(result).toBeNull();
    });
  });

  // Additional tests for other functions would follow the same pattern
});
