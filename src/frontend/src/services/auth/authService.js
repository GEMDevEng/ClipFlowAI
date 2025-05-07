import { supabase } from '../../config/supabase';
import { ERROR_MESSAGES } from '../../config/constants';

/**
 * Authentication service for Supabase
 */

/**
 * Sign up a new user with email and password
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @param {object} metadata - Additional user metadata
 * @returns {Promise<object>} - User data
 */
export const signUp = async (email, password, metadata = {}) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata
      }
    });

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Sign up error:', error);
    
    // Handle specific error cases
    if (error.message.includes('already registered')) {
      throw new Error(ERROR_MESSAGES.AUTH.EMAIL_IN_USE);
    }
    
    throw error;
  }
};

/**
 * Sign in a user with email and password
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @returns {Promise<object>} - User data
 */
export const signIn = async (email, password) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Sign in error:', error);
    
    // Handle specific error cases
    if (error.message.includes('Invalid login credentials')) {
      throw new Error(ERROR_MESSAGES.AUTH.INVALID_CREDENTIALS);
    }
    
    throw error;
  }
};

/**
 * Sign in a user with Google OAuth
 * @returns {Promise<object>} - User data
 */
export const signInWithGoogle = async () => {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin + '/login'
      }
    });

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Sign in with Google error:', error);
    throw error;
  }
};

/**
 * Sign out the current user
 * @returns {Promise<void>}
 */
export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      throw error;
    }
  } catch (error) {
    console.error('Sign out error:', error);
    throw error;
  }
};

/**
 * Get the current user
 * @returns {Promise<object|null>} - User data or null if not signed in
 */
export const getCurrentUser = async () => {
  try {
    const { data, error } = await supabase.auth.getUser();

    if (error) {
      throw error;
    }

    return data?.user || null;
  } catch (error) {
    console.error('Get current user error:', error);
    return null;
  }
};

/**
 * Get the current session
 * @returns {Promise<object|null>} - Session data or null if not signed in
 */
export const getSession = async () => {
  try {
    const { data, error } = await supabase.auth.getSession();

    if (error) {
      throw error;
    }

    return data.session;
  } catch (error) {
    console.error('Get session error:', error);
    return null;
  }
};

/**
 * Reset password for a user
 * @param {string} email - User's email
 * @returns {Promise<void>}
 */
export const resetPassword = async (email) => {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    });

    if (error) {
      throw error;
    }
  } catch (error) {
    console.error('Reset password error:', error);
    throw error;
  }
};

/**
 * Update user profile
 * @param {object} updates - Profile updates
 * @returns {Promise<object>} - Updated user data
 */
export const updateProfile = async (updates) => {
  try {
    const { data, error } = await supabase.auth.updateUser({
      data: updates
    });

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Update profile error:', error);
    throw error;
  }
};

/**
 * Set up auth state change listener
 * @param {function} callback - Callback function to handle auth state changes
 * @returns {function} - Unsubscribe function
 */
export const onAuthStateChange = (callback) => {
  try {
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      callback(session?.user || null, event);
    });

    return data.subscription.unsubscribe;
  } catch (error) {
    console.error('Auth state change error:', error);
    return () => {};
  }
};
