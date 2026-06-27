import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

const MenuIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="4" y1="6" x2="20" y2="6" />
    <line x1="4" y1="12" x2="20" y2="12" />
    <line x1="4" y1="18" x2="20" y2="18" />
  </svg>
);

const XIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

export default function Navbar({ activePage, setActivePage, requireAuth, theme, toggleTheme, onLogout }) {
  const { user, isAuthenticated } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [imgError, setImgError] = useState(false);

  const avatarUrl = user?.avatarUrl;
  const userName = user?.name || user?.userName || 'User';
  const userEmail = user?.email || '';

  const handleClickOutside = useCallback((e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setDropdownOpen(false);
    }
  }, []);

  useEffect(() => {
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownOpen, handleClickOutside]);

  const handleNewPost = useCallback(() => {
    if (!isAuthenticated) {
      requireAuth();
    } else {
      setActivePage('new');
    }
    setMobileMenuOpen(false);
  }, [isAuthenticated, requireAuth, setActivePage]);

  const handleNavigate = useCallback((page) => {
    setActivePage(page);
    setMobileMenuOpen(false);
  }, [setActivePage]);

  const showAvatar = avatarUrl && !imgError;

  return (
    <nav className="navbar">
      <div className="navbar__inner">
        <button className="navbar__logo" onClick={() => handleNavigate('home')}>
          Bloogigy
        </button>

        <button className="navbar__mobile-toggle" onClick={() => setMobileMenuOpen(prev => !prev)}>
          {mobileMenuOpen ? <XIcon /> : <MenuIcon />}
        </button>

        <div className={`navbar__right ${mobileMenuOpen ? 'navbar__right--open' : ''}`}>
          <div className="navbar__links">
            <button
              className={`nav-link ${activePage === 'home' ? 'nav-link--active' : ''}`}
              onClick={() => handleNavigate('home')}
            >
              Home
            </button>
            <button
              className={`nav-link ${activePage === 'about' ? 'nav-link--active' : ''}`}
              onClick={() => handleNavigate('about')}
            >
              About
            </button>
            <button className="nav-link nav-link--new" onClick={handleNewPost}>
              Write
            </button>
          </div>

          <div className="navbar__divider" />

          <div className="navbar__actions">
            <div className="navbar__avatar-wrapper" ref={dropdownRef}>
              {isAuthenticated ? (
                <>
                  <button
                    className="navbar__avatar-btn"
                    onClick={() => setDropdownOpen(prev => !prev)}
                    title={userName}
                  >
                    {showAvatar ? (
                      <img
                        key={avatarUrl}
                        src={avatarUrl}
                        alt={userName}
                        className="navbar__avatar-img"
                        onError={() => setImgError(true)}
                      />
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                    )}
                  </button>
                  {dropdownOpen && (
                    <div className="user-dropdown">
                      <div className="user-dropdown__header">
                        <span className="user-dropdown__name">{userName}</span>
                        {userEmail && <span className="user-dropdown__email">{userEmail}</span>}
                      </div>
                      <div className="user-dropdown__divider" />
                      <button className="user-dropdown__item" onClick={toggleTheme}>
                        {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
                      </button>
                      <div className="user-dropdown__divider" />
                      <button className="user-dropdown__item user-dropdown__item--danger" onClick={onLogout}>
                        Sign out
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <button className="nav-link nav-link--signin" onClick={() => requireAuth()}>
                  Sign In
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
