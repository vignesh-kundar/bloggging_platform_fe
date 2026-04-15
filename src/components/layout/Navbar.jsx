import './Navbar.css';

const BookIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
  </svg>
);

const PlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const SunIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1" x2="12" y2="3" />
    <line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" />
    <line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
);

const MoonIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

const LogoutIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

export default function Navbar({ activePage, setActivePage, theme, toggleTheme, onLogout }) {
  return (
    <nav className="navbar neo-out">
      <div className="navbar__logo neo-out" onClick={() => setActivePage('home')}>
        <BookIcon />
        <span>Blogify</span>
      </div>
      <ul className="navbar__links">
        <li>
          <button
            className={`nav-link ${activePage === 'home' ? 'nav-link--active' : ''}`}
            onClick={() => setActivePage('home')}
          >
            Home
          </button>
        </li>
        <li>
          <button
            className={`nav-link nav-link--new ${activePage === 'new' ? 'nav-link--active' : ''}`}
            onClick={() => setActivePage('new')}
          >
            <PlusIcon /> New Post
          </button>
        </li>
        <li>
          <button
            className={`nav-link ${activePage === 'about' ? 'nav-link--active' : ''}`}
            onClick={() => setActivePage('about')}
          >
            About
          </button>
        </li>
        <li className="navbar__theme-toggle">
          <button className="theme-toggle neo-btn" onClick={toggleTheme}>
            {theme === 'light' ? <MoonIcon /> : <SunIcon />}
          </button>
        </li>
        {onLogout && (
          <li className="navbar__theme-toggle">
            <button className="theme-toggle neo-btn" onClick={onLogout} title="Logout">
              <LogoutIcon />
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
}

