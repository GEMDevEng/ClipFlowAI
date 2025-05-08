import { supabase } from '../config/supabase';

/**
 * Check if the current IP is rate limited for a specific action
 * @param {string} email - User's email (optional)
 * @param {string} attemptType - Type of attempt (login, signup, reset_password)
 * @returns {Promise<boolean>} - True if allowed, false if rate limited
 */
export const checkRateLimit = async (email = null, attemptType) => {
  try {
    // Get client IP (this will be the server IP in production, but works for demo)
    const ipAddress = '127.0.0.1'; // In a real app, you'd get this from the server

    const { data, error } = await supabase.rpc('check_auth_rate_limit', {
      p_ip_address: ipAddress,
      p_email: email,
      p_attempt_type: attemptType
    });

    if (error) throw error;

    return data; // true if allowed, false if rate limited
  } catch (error) {
    console.error('Error checking rate limit:', error);
    return true; // Default to allowing if there's an error
  }
};

/**
 * Record a successful authentication attempt
 * @param {string} email - User's email
 * @param {string} attemptType - Type of attempt (login, signup, reset_password)
 * @param {string} userId - User ID
 * @returns {Promise<void>}
 */
export const recordSuccessfulAuth = async (email, attemptType, userId) => {
  try {
    // Get client IP (this will be the server IP in production, but works for demo)
    const ipAddress = '127.0.0.1'; // In a real app, you'd get this from the server

    await supabase.rpc('record_successful_auth', {
      p_ip_address: ipAddress,
      p_email: email,
      p_attempt_type: attemptType,
      p_user_id: userId
    });
  } catch (error) {
    console.error('Error recording successful auth:', error);
  }
};

/**
 * Get authentication history for a user
 * @param {string} userId - User ID
 * @returns {Promise<Array>} - Authentication history
 */
export const getAuthHistory = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('auth_attempts')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) throw error;

    return data;
  } catch (error) {
    console.error('Error getting auth history:', error);
    return [];
  }
};
