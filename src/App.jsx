import { useState, useCallback, useEffect } from 'react';
import './App.css';
import { AuthProvider, useAuth } from './context/AuthContext';
import { PostsProvider, usePosts } from './context/PostsContext';
import { NotificationProvider, useNotification } from './context/NotificationContext';
import Navbar from './components/layout/Navbar';
import Hero from './components/Hero';
import PostCard from './components/PostCard';
import About from './pages/About';
import NewPost from './pages/NewPost';
import PostDetail from './pages/PostDetail';
import AuthPage from './pages/Auth';

function EmptyState({ query }) {
  return (
    <div className="empty-state">
      <div className="empty-state__icon">📝</div>
      <h3>No posts found</h3>
      {query ? (
        <p>No posts matched &ldquo;{query}&rdquo;. Try a different search.</p>
      ) : (
        <p>Be the first to create a post!</p>
      )}
    </div>
  );
}

function ErrorDisplay({ message, onRetry }) {
  return (
    <div className="error-state">
      <div className="error-state__icon">⚠️</div>
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

function Dashboard({ onAuthRequired }) {
  const [activePage, setActivePage] = useState('home');
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
  const [viewMode, setViewMode] = useState('grid');
  const { isAuthenticated, logout, token } = useAuth();
  const { showNotification, confirmAction } = useNotification();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    if (!token) {
      onAuthRequired();
    }
  }, [token, onAuthRequired]);

  const toggleTheme = useCallback(() => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  }, []);

  const {
    posts,
    loading,
    error,
    searchQuery,
    fetchPosts,
    deletePost,
    setCurrentPost,
    createPost,
    clearError
  } = usePosts();

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

  const handleDelete = useCallback(async (id) => {
    confirmAction('Are you sure you want to delete this post?', async () => {
      try {
        await deletePost(id);
        showNotification('Post deleted successfully', 'success');
        if (activePage === 'post') {
          setActivePage('home');
        }
      } catch (err) {
        showNotification('Failed to delete post: ' + err.message, 'error');
      }
    });
  }, [deletePost, activePage, showNotification, confirmAction]);

  const handleViewPost = useCallback((post) => {
    setCurrentPost(post);
    setActivePage('post');
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [setCurrentPost]);

  const handleNavigate = useCallback((page) => {
    if (page === 'new' && !isAuthenticated) {
      onAuthRequired();
      showNotification('Please sign in to create a post', 'info');
      return;
    }
    clearError();
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [clearError, isAuthenticated, showNotification, onAuthRequired]);

  const handleLogout = useCallback(() => {
    logout();
    showNotification('Signed out successfully', 'success');
  }, [logout, showNotification]);

  const showNavbar = activePage !== 'login' && activePage !== 'register';

  return (
    <div className="app">
      {showNavbar && (
        <Navbar
          activePage={activePage}
          setActivePage={handleNavigate}
          theme={theme}
          toggleTheme={toggleTheme}
          isAuthenticated={isAuthenticated}
          onLogout={handleLogout}
        />
      )}
      <main className="app__main">
        {activePage === 'home' && (
          <>
            <Hero onSearch={handleSearch} />
            {loading ? (
              <div className="loading-state">Loading posts...</div>
            ) : error ? (
              <ErrorDisplay message={error} onRetry={() => fetchPosts(searchQuery)} />
            ) : posts.length === 0 ? (
              <EmptyState query={searchQuery} />
            ) : (
              <div className="blog-posts-container">
                <div className="blog-posts-header">
                  <h2 className="blog-posts-title">Recent Posts</h2>
                  <div className="view-toggle">
                    <button
                      className={`view-toggle__btn ${viewMode === 'grid' ? 'active' : ''}`}
                      onClick={() => setViewMode('grid')}
                      aria-label="Grid view"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="3" width="7" height="7"></rect>
                        <rect x="14" y="3" width="7" height="7"></rect>
                        <rect x="14" y="14" width="7" height="7"></rect>
                        <rect x="3" y="14" width="7" height="7"></rect>
                      </svg>
                    </button>
                    <button
                      className={`view-toggle__btn ${viewMode === 'list' ? 'active' : ''}`}
                      onClick={() => setViewMode('list')}
                      aria-label="List view"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="8" y1="6" x2="21" y2="6"></line>
                        <line x1="8" y1="12" x2="21" y2="12"></line>
                        <line x1="8" y1="18" x2="21" y2="18"></line>
                        <line x1="3" y1="6" x2="3.01" y2="6"></line>
                        <line x1="3" y1="12" x2="3.01" y2="12"></line>
                        <line x1="3" y1="18" x2="3.01" y2="18"></line>
                      </svg>
                    </button>
                  </div>
                </div>
                <section className={`blog-grid ${viewMode === 'list' ? 'blog-grid--list' : ''}`}>
                  {posts.map((post) => (
                    <PostCard
                      key={post.id}
                      post={post}
                      onDelete={() => handleDelete(post.id)}
                      onClick={() => handleViewPost(post)}
                    />
                  ))}
                </section>
              </div>
            )}
          </>
        )}

        {activePage === 'post' && (
          <PostDetail onBack={() => handleNavigate('home')} />
        )}

        {activePage === 'new' && (
          <NewPost onPublish={handlePublish} />
        )}

        {activePage === 'about' && (
          <About />
        )}
      </main>
      {showNavbar && (
        <footer className="app__footer">
          <p>© 2026 Blogify. A space for mindful writing.</p>
          <p className="app__footer-credit">
            <a href="https://vigneshkundar.vercel.app" target="_blank" rel="noopener noreferrer">Vignesh Kundar</a>
          </p>
        </footer>
      )}
    </div>
  );
}

function AppContent() {
  const [authChecked, setAuthChecked] = useState(false);
  const { validateToken, isAuthenticated } = useAuth();

  useEffect(() => {
    const checkAuth = async () => {
      const token = sessionStorage.getItem('token');

      if (token) {
        await validateToken();
      }
      setAuthChecked(true);
    };

    checkAuth();
  }, [validateToken]);

  const handleAuthSuccess = useCallback(() => {
    window.location.reload();
  }, []);

  const handleAuthRequired = useCallback(() => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    window.location.reload();
  }, []);

  if (!authChecked) {
    return (
      <div className="app app--loading">
        <div className="loading-state">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AuthPage onAuthSuccess={handleAuthSuccess} />;
  }

  return (
    <Dashboard onAuthRequired={handleAuthRequired} />
  );
}

export default function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <PostsProvider>
          <AppContent />
        </PostsProvider>
      </NotificationProvider>
    </AuthProvider>
  );
}
