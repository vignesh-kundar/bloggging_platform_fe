import { useState, useEffect } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import PostCard from './components/PostCard';
import About from './components/About';
import NewPost from './components/NewPost';
import PostDetail from './components/PostDetail';
import { api } from './services/api';

function EmptyState({ query }) {
  return (
    <div className="empty-state">
      <div className="empty-state__icon">🔍</div>
      <h3>No posts found</h3>
      <p>No posts matched &ldquo;{query}&rdquo;. Try a different search.</p>
    </div>
  );
}

export default function App() {
  const [activePage, setActivePage] = useState('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [posts, setPosts] = useState([]);
  const [currentPost, setCurrentPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async (term = '') => {
    try {
      setLoading(true);
      const data = await api.getPosts(term);
      setPosts(data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Could not load posts. Please make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (term) => {
    setSearchQuery(term);
    fetchPosts(term);
  };

  const handlePublish = async (newPostData) => {
    try {
      const createdPost = await api.createPost(newPostData);
      setPosts([createdPost, ...posts]);
      setActivePage('home');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error(err);
      alert('Failed to publish post: ' + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    try {
      await api.deletePost(id);
      setPosts(posts.filter(p => p.id !== id));
    } catch (err) {
      console.error(err);
      alert('Failed to delete post: ' + err.message);
    }
  };

  const handleViewPost = async (id) => {
    try {
      setLoading(true);
      const post = await api.getPostById(id);
      setCurrentPost(post);
      setActivePage('post');
      window.scrollTo({ top: 0, behavior: 'auto' });
    } catch (err) {
      console.error(err);
      alert('Failed to load post details');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <Navbar activePage={activePage} setActivePage={setActivePage} />
      <main className="app__main">
        {activePage === 'home' && (
          <>
            <Hero onSearch={handleSearch} />
            {loading ? (
              <div className="loading-state">Loading posts...</div>
            ) : error ? (
              <div className="error-state">{error}</div>
            ) : posts.length === 0 ? (
              <EmptyState query={searchQuery} />
            ) : (
              <section className="blog-grid">
                {posts.map((post) => (
                  <PostCard 
                    key={post.id} 
                    post={post} 
                    onDelete={() => handleDelete(post.id)}
                    onClick={() => handleViewPost(post.id)}
                  />
                ))}
              </section>
            )}
          </>
        )}

        {activePage === 'post' && (
          <PostDetail post={currentPost} onBack={() => setActivePage('home')} />
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
      </footer>
    </div>
  );
}
