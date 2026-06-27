import { useState, useCallback, useEffect } from 'react';
import './App.css';
import { PostsProvider, usePosts } from './context/PostsContext';
import { NotificationProvider, useNotification } from './context/NotificationContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/layout/Navbar';
import Hero from './components/Hero';
import PostCard from './components/PostCard';
import About from './pages/About';
import NewPost from './pages/NewPost';
import PostDetail from './pages/PostDetail';
import Login from './pages/Login';
import Register from './pages/Register';

function EmptyState({ query }) {
  return (
    <div className="empty-state">
      <div className="empty-state__icon">📝</div>
      <h3>No posts found</h3>
      {query ? (
        <p>Nothing matched &ldquo;{query}&rdquo;. Try a different search.</p>
      ) : (
        <p>Be the first to create a post!</p>
      )}
    </div>
  );
}

function ErrorDisplay({ message, onRetry }) {
  return (
    <div className="error-state">
      <h3>Something went wrong</h3>
      <p>{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="retry-btn">
          Try Again
        </button>
      )}
    </div>
  );
}

function AuthModal({ mode, onClose, onSwitch }) {
  const { showNotification } = useNotification();

  const handleSwitchToRegister = useCallback(() => {
    onSwitch('register');
  }, [onSwitch]);

  const handleSwitchToLogin = useCallback(() => {
    showNotification('Account created! Please sign in.', 'success');
    onSwitch('login');
  }, [showNotification, onSwitch]);

  return (
    <div className="auth-overlay" onClick={onClose}>
      <div className="auth-overlay__card" onClick={e => e.stopPropagation()}>
        <button className="auth-overlay__close" onClick={onClose}>&times;</button>
        {mode === 'register' ? (
          <Register onSwitchToLogin={handleSwitchToLogin} />
        ) : (
          <Login onSwitchToRegister={handleSwitchToRegister} />
        )}
      </div>
    </div>
  );
}

function AppContent() {
  const [activePage, setActivePage] = useState('home');
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
  const [authModal, setAuthModal] = useState(null);
  const [showBanner, setShowBanner] = useState(true);
  const { showNotification } = useNotification();
  const { isAuthenticated, logout } = useAuth();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  }, []);

  const {
    posts,
    loading,
    loadingMore,
    error,
    searchQuery,
    hasMore,
    fetchPosts,
    loadMore,
    setCurrentPost,
    createPost,
    clearError
  } = usePosts();

  const requireAuth = useCallback((mode = 'login') => {
    if (!isAuthenticated) setAuthModal(mode);
  }, [isAuthenticated]);

  const handleSearch = useCallback((term) => {
    clearError();
    setActivePage('home');
    fetchPosts(term);
  }, [clearError, fetchPosts]);

  const handlePublish = useCallback(async (newPostData) => {
    try {
      await createPost(newPostData);
      setActivePage('home');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      showNotification('Post published successfully!', 'success');
    } catch (err) {
      showNotification('Failed to publish post: ' + err.message, 'error');
    }
  }, [createPost, showNotification]);

  const handleViewPost = useCallback((post) => {
    setCurrentPost(post);
    setActivePage('post');
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [setCurrentPost]);

  const handleNavigate = useCallback((page) => {
    clearError();
    if (!isAuthenticated && page === 'new') {
      requireAuth();
      return;
    }
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [clearError, isAuthenticated, requireAuth]);

  const handleLogout = useCallback(() => {
    logout();
    showNotification('Signed out successfully.', 'info');
  }, [logout, showNotification]);

  const dismissBanner = useCallback(() => setShowBanner(false), []);

  return (
    <div className="app">
      <Navbar 
        activePage={activePage} 
        setActivePage={handleNavigate}
        requireAuth={requireAuth}
        theme={theme}
        toggleTheme={toggleTheme}
        onLogout={handleLogout}
      />
      <main className="app__main">
        {activePage === 'home' && (
          <>
            {!isAuthenticated && showBanner && (
              <div className="banner">
                <span>
                  <button className="banner__link" onClick={() => requireAuth('login')}>Sign in</button>
                  &nbsp;or&nbsp;
                  <button className="banner__link" onClick={() => requireAuth('register')}>create an account</button>
                  &nbsp;to start writing.
                </span>
                <button className="banner__close" onClick={dismissBanner}>&times;</button>
              </div>
            )}
            <Hero onSearch={handleSearch} />
            {loading ? (
              <div className="loading-state">Loading posts…</div>
            ) : error ? (
              <ErrorDisplay message={error} onRetry={() => fetchPosts(searchQuery)} />
            ) : posts.length === 0 ? (
              <EmptyState query={searchQuery} />
            ) : (
              <section className="journal">
                {posts.map((post) => (
                  <PostCard 
                    key={post.id} 
                    post={post} 
                    onClick={() => handleViewPost(post)}
                  />
                ))}
              </section>
            )}
            {hasMore && (
              <div className="load-more-wrapper">
                <button
                  className="load-more-btn"
                  onClick={loadMore}
                  disabled={loadingMore}
                >
                  {loadingMore ? 'Loading…' : 'Load More'}
                </button>
              </div>
            )}
          </>
        )}

        {activePage === 'post' && (
          <PostDetail onBack={() => handleNavigate('home')} />
        )}
        
        {activePage === 'new' && isAuthenticated && (
          <NewPost onPublish={handlePublish} />
        )}

        {activePage === 'about' && (
          <About />
        )}
      </main>
      <footer className="app__footer">
        <p>© 2026 Blogify. A space for mindful writing.</p>
        <p className="app__footer-credit">
          <a href="https://vigneshkundar.vercel.app" target="_blank" rel="noopener noreferrer">Vignesh Kundar</a>
        </p>
      </footer>

      {authModal && !isAuthenticated && (
        <AuthModal
          mode={authModal}
          onClose={() => setAuthModal(null)}
          onSwitch={setAuthModal}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <NotificationProvider>
      <AuthProvider>
        <PostsProvider>
          <AppContent />
        </PostsProvider>
      </AuthProvider>
    </NotificationProvider>
  );
}
