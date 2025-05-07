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

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

// Export the Supabase client
export { supabase };

// Export a function to get the current user
export const getCurrentUser = async () => {
  try {
    const { data, error } = await supabase.auth.getUser();
    if (error) throw error;
    return data?.user || null;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

// Export a function to get the current session
export const getSession = async () => {
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return data?.session || null;
  } catch (error) {
    console.error('Error getting session:', error);
    return null;
  }
};
