import React, { createContext, useContext } from 'react';
import useAuthHook from '../hooks/useAuth';

// Create context
const AuthContext = createContext();

/**
 * Auth provider component
 * @param {object} props - Component props
 * @returns {JSX.Element} - Provider component
 */
export const AuthProvider = ({ children }) => {
  const auth = useAuthHook();

  // Map the auth hook values to the expected context values
  const value = {
    currentUser: auth.user,
    loading: auth.loading,
    error: auth.error,
    signup: auth.signUp,
    login: auth.signIn,
    loginWithGoogle: auth.signInWithGoogle,
    logout: auth.signOut,
    resetPassword: auth.resetPassword,
    updateUserProfile: auth.updateProfile,
    isAuthenticated: auth.isAuthenticated
  };

  return (
    <AuthContext.Provider value={value}>
      {!auth.loading && children}
    </AuthContext.Provider>
  );
};

/**
 * Custom hook to use auth context
 * @returns {object} - Auth context value
 */
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};
