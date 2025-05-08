import { useState, useEffect, useCallback } from 'react';
import * as authService from '../services/auth/authService';
import { initializeUserProfile } from '../services/database/databaseInitializer';

/**
 * Custom hook for authentication
 * @returns {object} - Auth state and methods
 */
const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get current user
        const currentUser = await authService.getCurrentUser();

        // If we have a user but the session might be expiring soon, refresh it
        if (currentUser) {
          await authService.refreshCurrentSession();

          // Initialize user profile in the database
          try {
            const profile = await initializeUserProfile(currentUser);
            console.log('User profile initialized:', profile);
          } catch (profileError) {
            console.error('Error initializing user profile:', profileError);
          }
        }

        setUser(currentUser);
      } catch (err) {
        console.error('Auth initialization error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    // Set up auth state change listener
    const unsubscribe = authService.onAuthStateChange((user, event) => {
      // Update user state when auth state changes
      setUser(user);

      // If the event is a token refresh, clear any previous errors
      if (event === 'TOKEN_REFRESHED') {
        setError(null);
      }
    });

    // Set up an interval to refresh the session periodically
    const refreshInterval = setInterval(async () => {
      if (user) {
        try {
          await authService.refreshCurrentSession();
        } catch (err) {
          console.error('Session refresh error:', err);
        }
      }
    }, 30 * 60 * 1000); // Refresh every 30 minutes

    // Clean up subscription and interval
    return () => {
      unsubscribe();
      clearInterval(refreshInterval);
    };
  }, [user]);

  // Sign up
  const signUp = useCallback(async (email, password, metadata = {}) => {
    try {
      setLoading(true);
      setError(null);

      const { user } = await authService.signUp(email, password, metadata);

      // Initialize user profile in the database
      if (user) {
        try {
          await initializeUserProfile(user);
        } catch (profileError) {
          console.error('Error initializing user profile:', profileError);
        }
      }

      return user;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Sign in
  const signIn = useCallback(async (email, password) => {
    try {
      setLoading(true);
      setError(null);

      const { user } = await authService.signIn(email, password);

      // Initialize user profile in the database
      if (user) {
        try {
          await initializeUserProfile(user);
        } catch (profileError) {
          console.error('Error initializing user profile:', profileError);
        }
      }

      return user;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Sign in with Google
  const signInWithGoogle = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { user } = await authService.signInWithGoogle();

      // Initialize user profile in the database
      if (user) {
        try {
          await initializeUserProfile(user);
        } catch (profileError) {
          console.error('Error initializing user profile:', profileError);
        }
      }

      return user;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Sign out
  const signOut = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      await authService.signOut();
      setUser(null);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Reset password
  const resetPassword = useCallback(async (email) => {
    try {
      setLoading(true);
      setError(null);

      await authService.resetPassword(email);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update profile
  const updateProfile = useCallback(async (updates) => {
    try {
      setLoading(true);
      setError(null);

      const { user } = await authService.updateProfile(updates);
      setUser(user);
      return user;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    user,
    loading,
    error,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    resetPassword,
    updateProfile,
    isAuthenticated: !!user,
  };
};

export default useAuth;
