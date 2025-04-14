import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { checkRateLimit, recordSuccessfulAuth } from '../services/securityService';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Get the redirect path from location state or default to dashboard
  const from = location.state?.from || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setError('');
      setLoading(true);

      // Check rate limiting before attempting login
      const isAllowed = await checkRateLimit(email, 'login');
      if (!isAllowed) {
        setError('Too many login attempts. Please try again later.');
        return;
      }

      // Attempt login
      const user = await login(email, password);

      // Record successful login
      await recordSuccessfulAuth(email, 'login', user.id);

      // Redirect to the page they were trying to access or dashboard
      navigate(from, { replace: true });
    } catch (error) {
      console.error('Login error:', error);

      // Provide more specific error messages
      if (error.message.includes('Invalid login credentials')) {
        setError('Invalid email or password. Please try again.');
      } else if (error.message.includes('Email not confirmed')) {
        setError('Please confirm your email before logging in.');
      } else if (error.message.includes('rate limit')) {
        setError('Too many login attempts. Please try again later.');
      } else {
        setError(`Login failed: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setError('');
      setLoading(true);

      // Check rate limiting before attempting Google login
      const isAllowed = await checkRateLimit(null, 'google_login');
      if (!isAllowed) {
        setError('Too many login attempts. Please try again later.');
        return;
      }

      // Attempt Google login
      const user = await loginWithGoogle();

      // Record successful login if we have user data
      if (user?.id) {
        await recordSuccessfulAuth(user.email, 'google_login', user.id);
      }

      // Redirect to the page they were trying to access or dashboard
      navigate(from, { replace: true });
    } catch (error) {
      console.error('Google login error:', error);

      if (error.message.includes('popup')) {
        setError('Google login popup was closed. Please try again.');
      } else if (error.message.includes('network')) {
        setError('Network error. Please check your connection and try again.');
      } else {
        setError(`Failed to log in with Google: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Log In</h1>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
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
            <div className="forgot-password">
              <Link to="/forgot-password">Forgot Password?</Link>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-block"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </form>

        <div className="auth-divider">
          <span>OR</span>
        </div>

        <button
          className="btn btn-google btn-block"
          onClick={handleGoogleLogin}
          disabled={loading}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 48 48">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
          </svg>
          <span>Log In with Google</span>
        </button>

        <div className="auth-links">
          <Link to="/signup">Don't have an account? Sign Up</Link>
          <Link to="/">Back to Home</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
