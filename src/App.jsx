import { useState, useCallback, useEffect } from 'react';
import './App.css';
import { PostsProvider, usePosts } from './context/PostsContext';
import Navbar from './components/layout/Navbar';
import Hero from './components/Hero';
import PostCard from './components/PostCard';
import About from './pages/About';
import NewPost from './pages/NewPost';
import PostDetail from './pages/PostDetail';

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

function AppContent() {
  const [activePage, setActivePage] = useState('home');
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');

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
    } catch (err) {
      alert('Failed to publish post: ' + err.message);
    }
  }, [createPost]);

  const handleDelete = useCallback(async (id) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    try {
      await deletePost(id);
      if (activePage === 'post') {
        setActivePage('home');
      }
    } catch (err) {
      alert('Failed to delete post: ' + err.message);
    }
  }, [deletePost, activePage]);

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

  return (
    <div className="app">
      <Navbar 
        activePage={activePage} 
        setActivePage={handleNavigate} 
        theme={theme}
        toggleTheme={toggleTheme}
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
    <PostsProvider>
      <AppContent />
    </PostsProvider>
  );
}
