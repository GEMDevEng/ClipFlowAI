import { supabase } from '../supabase/config';

/**
 * Sign up a new user with email and password
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @param {object} metadata - Additional user metadata
 * @returns {Promise<object>} - User data
 */
export const signUp = async (email, password, metadata = {}) => {
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
};

/**
 * Sign in a user with email and password
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @returns {Promise<object>} - User data
 */
export const signIn = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    throw error;
  }

  return data;
};

/**
 * Sign in a user with Google OAuth
 * @returns {Promise<object>} - User data
 */
export const signInWithGoogle = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: 'https://gemdeveng.github.io/ClipFlowAI/login'
    }
  });

  if (error) {
    throw error;
  }

  return data;
};

/**
 * Sign out the current user
 * @returns {Promise<void>}
 */
export const signOut = async () => {
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw error;
  }
};

/**
 * Get the current user
 * @returns {Promise<object|null>} - User data or null if not signed in
 */
export const getCurrentUser = async () => {
  const { data, error } = await supabase.auth.getUser();

  if (error) {
    throw error;
  }

  return data?.user || null;
};

/**
 * Get the current session
 * @returns {Promise<object|null>} - Session data or null if not signed in
 */
export const getSession = async () => {
  const { data, error } = await supabase.auth.getSession();

  if (error) {
    throw error;
  }

  return data.session;
};

/**
 * Reset password for a user
 * @param {string} email - User's email
 * @returns {Promise<void>}
 */
export const resetPassword = async (email) => {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`
  });

  if (error) {
    throw error;
  }
};

/**
 * Update user profile
 * @param {object} updates - Profile updates
 * @returns {Promise<object>} - Updated user data
 */
export const updateProfile = async (updates) => {
  const { data, error } = await supabase.auth.updateUser({
    data: updates
  });

  if (error) {
    throw error;
  }

  return data;
};

/**
 * Set up auth state change listener
 * @param {function} callback - Callback function to handle auth state changes
 * @returns {function} - Unsubscribe function
 */
export const onAuthStateChange = (callback) => {
  const { data } = supabase.auth.onAuthStateChange((event, session) => {
    callback(session?.user || null, event);
  });

  return data.subscription.unsubscribe;
};
