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

function AuthGate() {
  const [authPage, setAuthPage] = useState('login');
  const { showNotification } = useNotification();

  const handleSwitchToRegister = useCallback(() => {
    setAuthPage('register');
  }, []);

  const handleSwitchToLogin = useCallback(() => {
    showNotification('Account created! Please sign in.', 'success');
    setAuthPage('login');
  }, [showNotification]);

  if (authPage === 'register') {
    return <Register onSwitchToLogin={handleSwitchToLogin} />;
  }

  return <Login onSwitchToRegister={handleSwitchToRegister} />;
}

function AppContent() {
  const [activePage, setActivePage] = useState('home');
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
  const { showNotification, confirmAction } = useNotification();
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
    clearError();
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [clearError]);

  const handleLogout = useCallback(() => {
    logout();
    showNotification('Logged out successfully', 'info');
  }, [logout, showNotification]);

  // If not authenticated, show login/register
  if (!isAuthenticated) {
    return <AuthGate />;
  }

  return (
    <div className="app">
      <Navbar 
        activePage={activePage} 
        setActivePage={handleNavigate} 
        theme={theme}
        toggleTheme={toggleTheme}
        onLogout={handleLogout}
      />
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
              <section className="blog-grid">
                {posts.map((post) => (
                  <PostCard 
                    key={post.id} 
                    post={post} 
                    onDelete={() => handleDelete(post.id)}
                    onClick={() => handleViewPost(post)}
                  />
                ))}
              </section>
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
      <footer className="app__footer">
        <p>© 2026 Blogify. A space for mindful writing.</p>
        <p className="app__footer-credit">
          <a href="https://vigneshkundar.vercel.app" target="_blank" rel="noopener noreferrer">Vignesh Kundar</a>
        </p>
      </footer>
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

