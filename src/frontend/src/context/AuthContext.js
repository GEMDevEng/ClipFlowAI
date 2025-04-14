import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabase/config';
import * as authService from '../services/authService';

// Create context
const AuthContext = createContext();

// Provider component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Sign up with email and password
  const signup = async (email, password, displayName) => {
    try {
      setError(null);
      const { user } = await authService.signUp(email, password, { displayName });
      return user;
    } catch (error) {
      console.error('Auth context signup error:', error);
      setError(error.message);
      throw error;
    }
  };

  // Login with email and password
  const login = async (email, password) => {
    try {
      setError(null);
      const { user } = await authService.signIn(email, password);
      return user;
    } catch (error) {
      console.error('Auth context login error:', error);
      setError(error.message);
      throw error;
    }
  };

  // Login with Google
  const loginWithGoogle = async () => {
    try {
      setError(null);
      const { user } = await authService.signInWithGoogle();
      return user;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // Logout
  const logout = async () => {
    try {
      setError(null);
      await authService.signOut();
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // Reset password
  const resetPassword = async (email) => {
    try {
      setError(null);
      await authService.resetPassword(email);
    } catch (error) {
      console.error('Auth context reset password error:', error);
      setError(error.message);
      throw error;
    }
  };

  // Update user profile
  const updateUserProfile = async (displayName, avatarUrl) => {
    try {
      setError(null);
      const { user } = await authService.updateProfile({
        displayName: displayName || currentUser.user_metadata?.displayName,
        avatarUrl: avatarUrl || currentUser.user_metadata?.avatarUrl
      });

      // Update local user state
      setCurrentUser(user);
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // Listen for auth state changes
  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const user = await authService.getCurrentUser();
        setCurrentUser(user);
      } catch (error) {
        console.error('Error getting initial session:', error);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Set up auth state change listener
    const unsubscribe = authService.onAuthStateChange((user) => {
      setCurrentUser(user);
    });

    // Cleanup subscription
    return () => {
      unsubscribe();
    };
  }, []);

  const value = {
    currentUser,
    loading,
    error,
    signup,
    login,
    loginWithGoogle,
    logout,
    resetPassword,
    updateUserProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  return useContext(AuthContext);
};
