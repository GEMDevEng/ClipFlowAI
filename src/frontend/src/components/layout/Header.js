import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ROUTES } from '../../config/constants';
import './Header.css';

/**
 * Header component
 * @returns {JSX.Element} - Header component
 */
const Header = () => {
  const { currentUser, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  /**
   * Handle logout
   */
  const handleLogout = async () => {
    try {
      await logout();
      navigate(ROUTES.HOME);
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  /**
   * Toggle mobile menu
   */
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="bg-white shadow-md py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to={ROUTES.HOME} className="text-2xl font-bold text-purple-600">
          ClipFlowAI
        </Link>

        <button 
          className="md:hidden focus:outline-none" 
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
          </svg>
        </button>

        <nav className={`absolute md:relative top-16 left-0 right-0 bg-white md:top-0 md:flex transition-all duration-300 ease-in-out ${mobileMenuOpen ? 'block' : 'hidden md:block'} z-50`}>
          <ul className="flex flex-col md:flex-row md:items-center md:space-x-6 p-4 md:p-0">
            <li className="py-2 md:py-0">
              <Link 
                to={ROUTES.HOME} 
                className="text-gray-700 hover:text-purple-600"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
            </li>

            {currentUser ? (
              // Links for authenticated users
              <>
                <li className="py-2 md:py-0">
                  <Link 
                    to={ROUTES.DASHBOARD} 
                    className="text-gray-700 hover:text-purple-600"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                </li>
                <li className="py-2 md:py-0">
                  <Link 
                    to={ROUTES.ANALYTICS} 
                    className="text-gray-700 hover:text-purple-600"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Analytics
                  </Link>
                </li>
                <li className="py-2 md:py-0">
                  <Link 
                    to={ROUTES.CREATE_VIDEO} 
                    className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Create Video
                  </Link>
                </li>
                <li className="py-2 md:py-0 relative group">
                  <div className="flex items-center cursor-pointer">
                    <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center">
                      {currentUser.user_metadata?.avatar_url ? (
                        <img 
                          src={currentUser.user_metadata.avatar_url} 
                          alt="Profile" 
                          className="w-8 h-8 rounded-full"
                        />
                      ) : (
                        <span>
                          {currentUser.user_metadata?.name?.charAt(0) || 
                           currentUser.email?.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </div>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 hidden group-hover:block">
                    <Link 
                      to={ROUTES.PROFILE} 
                      className="block px-4 py-2 text-gray-700 hover:bg-purple-100"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Profile
                    </Link>
                    <button 
                      onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-purple-100"
                    >
                      Log Out
                    </button>
                  </div>
                </li>
              </>
            ) : (
              // Links for non-authenticated users
              <>
                <li className="py-2 md:py-0">
                  <Link 
                    to={ROUTES.LOGIN} 
                    className="text-gray-700 hover:text-purple-600"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Log In
                  </Link>
                </li>
                <li className="py-2 md:py-0">
                  <Link 
                    to={ROUTES.SIGNUP} 
                    className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
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
