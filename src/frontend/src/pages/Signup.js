import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { checkRateLimit, recordSuccessfulAuth } from '../services/securityService';
import './Login.css'; // Reuse the same styles

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { signup, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    try {
      setError('');
      setLoading(true);

      // Check rate limiting before attempting signup
      const isAllowed = await checkRateLimit(email, 'signup');
      if (!isAllowed) {
        setError('Too many signup attempts. Please try again later.');
        return;
      }

      // Attempt signup
      const user = await signup(email, password, name);

      // Record successful signup
      if (user?.id) {
        await recordSuccessfulAuth(email, 'signup', user.id);
      }

      // Redirect to dashboard after successful signup
      navigate('/dashboard');
    } catch (error) {
      console.error('Signup error:', error);

      // Provide more specific error messages
      if (error.message.includes('already registered')) {
        setError('Email is already registered. Please use a different email or try logging in.');
      } else if (error.message.includes('valid email')) {
        setError('Please enter a valid email address.');
      } else if (error.message.includes('password')) {
        setError('Password is too weak. Please use a stronger password.');
      } else if (error.message.includes('rate limit')) {
        setError('Too many signup attempts. Please try again later.');
      } else {
        setError(`Signup failed: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      setError('');
      setLoading(true);

      // Check rate limiting before attempting Google signup
      const isAllowed = await checkRateLimit(null, 'google_signup');
      if (!isAllowed) {
        setError('Too many signup attempts. Please try again later.');
        return;
      }

      // Attempt Google signup
      const user = await loginWithGoogle();

      // Record successful signup if we have user data
      if (user?.id) {
        await recordSuccessfulAuth(user.email, 'google_signup', user.id);
      }

      // Redirect to dashboard after successful signup
      navigate('/dashboard');
    } catch (error) {
      console.error('Google signup error:', error);

      if (error.message.includes('popup')) {
        setError('Google signup popup was closed. Please try again.');
      } else if (error.message.includes('network')) {
        setError('Network error. Please check your connection and try again.');
      } else {
        setError(`Failed to sign up with Google: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Sign Up</h1>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-block"
            disabled={loading}
          >
            {loading ? 'Signing up...' : 'Sign Up'}
          </button>
        </form>

        <div className="auth-divider">
          <span>OR</span>
        </div>

        <button
          className="btn btn-google btn-block"
          onClick={handleGoogleSignup}
          disabled={loading}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 48 48">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
          </svg>
          <span>Sign Up with Google</span>
        </button>

        <div className="auth-links">
          <Link to="/login">Already have an account? Log In</Link>
          <Link to="/">Back to Home</Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
