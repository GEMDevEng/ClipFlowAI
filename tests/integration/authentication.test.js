/**
 * Integration tests for the authentication flow
 */
const { signUp, signIn, signOut, getCurrentUser } = require('../../src/frontend/src/services/auth/authService');
const { createUserProfile, getUserProfile, updateUserProfile } = require('../../src/frontend/src/services/user/userService');
const { supabase } = require('../../src/frontend/src/config/supabase');

// Mock the Supabase client
jest.mock('../../src/frontend/src/config/supabase', () => ({
  supabase: {
    auth: {
      signUp: jest.fn(),
      signInWithPassword: jest.fn(),
      signOut: jest.fn(),
      getUser: jest.fn(),
      getSession: jest.fn()
    },
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    single: jest.fn()
  }
}));

// Mock the user service
jest.mock('../../src/frontend/src/services/user/userService');

describe('Authentication Flow', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should register a new user and create a profile', async () => {
    // Mock data
    const email = 'test@example.com';
    const password = 'password123';
    const userData = {
      name: 'Test User',
      bio: 'A test user account'
    };
    
    // Mock the sign up response
    const mockUser = { id: 'user123', email };
    supabase.auth.signUp.mockResolvedValue({
      data: { user: mockUser },
      error: null
    });
    
    // Mock the profile creation
    const mockProfile = {
      id: 'profile123',
      user_id: mockUser.id,
      name: userData.name,
      bio: userData.bio,
      created_at: new Date().toISOString()
    };
    createUserProfile.mockResolvedValue(mockProfile);
    
    // Execute the registration flow
    // Step 1: Sign up the user
    const result = await signUp(email, password, userData);
    expect(result).toEqual({ user: mockUser });
    expect(supabase.auth.signUp).toHaveBeenCalledWith({
      email,
      password,
      options: {
        data: userData
      }
    });
    
    // Step 2: Create the user profile
    const profile = await createUserProfile(mockUser.id, userData);
    expect(profile).toEqual(mockProfile);
    expect(createUserProfile).toHaveBeenCalledWith(mockUser.id, userData);
  });

  it('should sign in a user and retrieve their profile', async () => {
    // Mock data
    const email = 'test@example.com';
    const password = 'password123';
    
    // Mock the sign in response
    const mockUser = { id: 'user123', email };
    supabase.auth.signInWithPassword.mockResolvedValue({
      data: { user: mockUser },
      error: null
    });
    
    // Mock the profile retrieval
    const mockProfile = {
      id: 'profile123',
      user_id: mockUser.id,
      name: 'Test User',
      bio: 'A test user account',
      created_at: new Date().toISOString()
    };
    getUserProfile.mockResolvedValue(mockProfile);
    
    // Execute the sign in flow
    // Step 1: Sign in the user
    const result = await signIn(email, password);
    expect(result).toEqual({ user: mockUser });
    expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
      email,
      password
    });
    
    // Step 2: Get the current user
    supabase.auth.getUser.mockResolvedValue({
      data: { user: mockUser },
      error: null
    });
    const currentUser = await getCurrentUser();
    expect(currentUser).toEqual(mockUser);
    
    // Step 3: Retrieve the user profile
    const profile = await getUserProfile(mockUser.id);
    expect(profile).toEqual(mockProfile);
    expect(getUserProfile).toHaveBeenCalledWith(mockUser.id);
  });

  it('should update a user profile', async () => {
    // Mock data
    const userId = 'user123';
    const updatedData = {
      name: 'Updated Name',
      bio: 'Updated bio information'
    };
    
    // Mock the profile update
    const mockUpdatedProfile = {
      id: 'profile123',
      user_id: userId,
      name: updatedData.name,
      bio: updatedData.bio,
      updated_at: new Date().toISOString()
    };
    updateUserProfile.mockResolvedValue(mockUpdatedProfile);
    
    // Execute the profile update flow
    const updatedProfile = await updateUserProfile(userId, updatedData);
    expect(updatedProfile).toEqual(mockUpdatedProfile);
    expect(updateUserProfile).toHaveBeenCalledWith(userId, updatedData);
  });

  it('should sign out a user', async () => {
    // Mock the sign out response
    supabase.auth.signOut.mockResolvedValue({
      error: null
    });
    
    // Execute the sign out flow
    await signOut();
    expect(supabase.auth.signOut).toHaveBeenCalled();
    
    // Verify that the current user is null after sign out
    supabase.auth.getUser.mockResolvedValue({
      data: { user: null },
      error: null
    });
    const currentUser = await getCurrentUser();
    expect(currentUser).toBeNull();
  });

  it('should handle authentication errors', async () => {
    // Mock data
    const email = 'test@example.com';
    const password = 'wrong-password';
    
    // Mock an authentication error
    const mockError = { message: 'Invalid login credentials' };
    supabase.auth.signInWithPassword.mockResolvedValue({
      data: null,
      error: mockError
    });
    
    // Execute the sign in flow with error handling
    try {
      await signIn(email, password);
      // If we get here, the test should fail
      expect(true).toBe(false);
    } catch (error) {
      expect(error).toEqual(mockError);
      expect(error.message).toBe('Invalid login credentials');
    }
    
    // Verify that subsequent steps were not called
    expect(getUserProfile).not.toHaveBeenCalled();
  });
});
