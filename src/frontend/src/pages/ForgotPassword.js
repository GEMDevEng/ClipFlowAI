import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css'; // Reuse the same styles

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  
  const { resetPassword } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setError('Please enter your email address');
      return;
    }
    
    try {
      setError('');
      setMessage('');
      setLoading(true);
      
      await resetPassword(email);
      
      // Show success message
      setMessage('Password reset link has been sent to your email. Please check your inbox.');
    } catch (error) {
      console.error('Password reset error:', error);
      
      // Provide more specific error messages
      if (error.message.includes('user not found')) {
        setError('No account found with this email address.');
      } else if (error.message.includes('rate limit')) {
        setError('Too many requests. Please try again later.');
      } else {
        setError(`Failed to reset password: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Reset Password</h1>
        
        {error && <div className="error-message">{error}</div>}
        {message && <div className="success-message">{message}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <p className="form-help">Enter the email address associated with your account, and we'll send you a link to reset your password.</p>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <button 
            type="submit" 
            className="btn btn-primary btn-block"
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>
        
        <div className="auth-links">
          <Link to="/login">Back to Login</Link>
          <Link to="/">Back to Home</Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
