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

export default function Navbar({ activePage, setActivePage }) {
  return (
    <nav className="navbar">
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
      </ul>
    </nav>
  );
}
