import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes, faUser, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../context/AuthContext';
import { signOutUser } from '../firebase/auth';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { currentUser, userData } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOutUser();
      navigate('/');
      setIsMenuOpen(false);
    } catch (error) {
      // Silently handle logout error
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-2">
          {/* Logo - Compact */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-saffron to-green rounded-full flex items-center justify-center p-1">
              <img
                src="/darshan_logo.png"
                alt="Bharat Darshan Logo"
                className="w-full h-full object-contain rounded-full"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'block';
                }}
              />
              <span className="text-white font-bold text-sm hidden">भ</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-navy">Bharat Darshan</h1>
              <p className="text-xs text-gray-600 hidden sm:block">Heritage & Culture</p>
            </div>
          </Link>

          {/* Desktop Navigation - Compact */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              to="/"
              className="text-darkGray hover:text-saffron transition-colors duration-300 font-medium text-sm"
            >
              Home
            </Link>

            {currentUser && userData?.role === 'admin' && (
              <>
                <Link
                  to="/admin"
                  className="text-darkGray hover:text-saffron transition-colors duration-300 font-medium text-sm"
                >
                  Dashboard
                </Link>
                <Link
                  to="/admin/new"
                  className="bg-saffron text-white px-3 py-1.5 rounded-lg hover:bg-orange-600 transition-colors duration-300 text-sm"
                >
                  New Post
                </Link>
              </>
            )}

            {currentUser ? (
              <div className="flex items-center space-x-3">
                <span className="text-darkGray text-sm">
                  <FontAwesomeIcon icon={faUser} className="mr-1 text-xs" />
                  {userData?.name}
                  {userData?.role === 'admin' && (
                    <span className="ml-1 bg-saffron text-white px-1.5 py-0.5 rounded-full text-xs">
                      Admin
                    </span>
                  )}
                </span>

                <button
                  onClick={handleSignOut}
                  className="text-red-600 hover:text-red-800 transition-colors duration-300"
                >
                  <FontAwesomeIcon icon={faSignOutAlt} className="text-sm" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="text-darkGray hover:text-saffron transition-colors duration-300 font-medium text-sm"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="bg-green text-white px-3 py-1.5 rounded-lg hover:bg-green-700 transition-colors duration-300 text-sm"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden text-darkGray hover:text-saffron transition-colors duration-300"
          >
            <FontAwesomeIcon icon={isMenuOpen ? faTimes : faBars} size="lg" />
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <nav className="flex flex-col space-y-4">
              <Link 
                to="/" 
                onClick={() => setIsMenuOpen(false)}
                className="text-darkGray hover:text-saffron transition-colors duration-300 font-medium"
              >
                Home
              </Link>
              
              {currentUser && userData?.role === 'admin' && (
                <>
                  <Link 
                    to="/admin" 
                    onClick={() => setIsMenuOpen(false)}
                    className="text-darkGray hover:text-saffron transition-colors duration-300 font-medium"
                  >
                    Dashboard
                  </Link>
                  <Link 
                    to="/admin/new" 
                    onClick={() => setIsMenuOpen(false)}
                    className="text-darkGray hover:text-saffron transition-colors duration-300 font-medium"
                  >
                    New Post
                  </Link>
                </>
              )}

              {currentUser ? (
                <div className="flex flex-col space-y-2">
                  <span className="text-darkGray">
                    <FontAwesomeIcon icon={faUser} className="mr-2" />
                    {userData?.name}
                    {userData?.role === 'admin' && (
                      <span className="ml-2 bg-saffron text-white px-2 py-1 rounded-full text-xs">
                        Admin
                      </span>
                    )}
                  </span>

                  <button
                    onClick={handleSignOut}
                    className="text-red-600 hover:text-red-800 transition-colors duration-300 text-left"
                  >
                    <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="flex flex-col space-y-2">
                  <Link
                    to="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="text-darkGray hover:text-saffron transition-colors duration-300 font-medium"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setIsMenuOpen(false)}
                    className="text-green hover:text-green-600 transition-colors duration-300 font-medium"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
