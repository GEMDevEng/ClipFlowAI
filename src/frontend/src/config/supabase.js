import { createClient } from '@supabase/supabase-js';

/**
 * Supabase configuration
 *
 * This file initializes the Supabase client with the appropriate credentials.
 * In production, these values should be set as environment variables.
 */

// Supabase URL and anonymous key
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://wkevcxbbnbtlndkkhtgr.supabase.co';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndrZXZjeGJibmJ0bG5ka2todGdyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ1NzQ5ODYsImV4cCI6MjA2MDE1MDk4Nn0.ZHQ10o6RMrENCu7TDqwauvaqZZLQ_ocli10XqRsHHyc';

// Initialize Supabase client with enhanced configuration
const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storageKey: 'clipflowai-auth',
  },
  global: {
    headers: {
      'x-application-name': 'ClipFlowAI',
    },
  },
  // Add retries for better reliability
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

// Export the Supabase client
export { supabase };

/**
 * Get the current user
 * @returns {Promise<object|null>} - User data or null if not signed in
 */
export const getCurrentUser = async () => {
  try {
    const { data, error } = await supabase.auth.getUser();
    if (error) {
      console.error('Error getting current user:', error);
      return null;
    }
    return data?.user || null;
  } catch (error) {
    console.error('Error getting current user:', error);
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
      console.error('Error getting session:', error);
      return null;
    }
    return data?.session || null;
  } catch (error) {
    console.error('Error getting session:', error);
    return null;
  }
};

/**
 * Refresh the session if needed
 * @returns {Promise<object|null>} - Updated session or null
 */
export const refreshSession = async () => {
  try {
    const { data, error } = await supabase.auth.refreshSession();
    if (error) {
      console.error('Error refreshing session:', error);
      return null;
    }
    return data?.session || null;
  } catch (error) {
    console.error('Error refreshing session:', error);
    return null;
  }
};
