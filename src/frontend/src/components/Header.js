import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Header.css';

const Header = () => {
  const { currentUser, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="header">
      <div className="container header-content">
        <Link to="/" className="logo">
          <h1>ClipFlowAI</h1>
        </Link>

        <button className="mobile-menu-button" onClick={toggleMobileMenu}>
          <span className="menu-icon"></span>
        </button>

        <nav className={`nav ${mobileMenuOpen ? 'mobile-open' : ''}`}>
          <ul>
            <li>
              <Link to="/" onClick={() => setMobileMenuOpen(false)}>Home</Link>
            </li>

            {currentUser ? (
              // Links for authenticated users
              <>
                <li>
                  <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)}>Dashboard</Link>
                </li>
                <li>
                  <Link to="/create" className="btn" onClick={() => setMobileMenuOpen(false)}>Create Video</Link>
                </li>
                <li className="user-menu">
                  <div className="user-avatar">
                    {currentUser.photoURL ? (
                      <img src={currentUser.photoURL} alt="Profile" />
                    ) : (
                      <span>{currentUser.displayName?.charAt(0) || currentUser.email?.charAt(0)}</span>
                    )}
                  </div>
                  <div className="dropdown-menu">
                    <Link to="/profile" onClick={() => setMobileMenuOpen(false)}>Profile</Link>
                    <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }}>Log Out</button>
                  </div>
                </li>
              </>
            ) : (
              // Links for non-authenticated users
              <>
                <li>
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)}>Log In</Link>
                </li>
                <li>
                  <Link to="/signup" className="btn" onClick={() => setMobileMenuOpen(false)}>Sign Up</Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
