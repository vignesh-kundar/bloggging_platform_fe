import { useState, useMemo } from 'react';
import './App.css';
import Navbar from './components/layout/Navbar';
import Hero from './components/Hero';
import PostCard from './components/PostCard';
import About from './pages/About';
import NewPost from './pages/NewPost';
import PostDetail from './pages/PostDetail';
import { INITIAL_POSTS } from './data/posts';

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
  const [posts, setPosts] = useState(INITIAL_POSTS);
  const [currentPost, setCurrentPost] = useState(null);
  const [loading, setLoading] = useState(false);

  const filteredPosts = useMemo(() => {
    if (!searchQuery.trim()) return posts;
    const term = searchQuery.toLowerCase();
    return posts.filter(post => 
      post.title.toLowerCase().includes(term) ||
      post.content.toLowerCase().includes(term) ||
      post.category.toLowerCase().includes(term) ||
      post.tags.some(tag => tag.toLowerCase().includes(term))
    );
  }, [posts, searchQuery]);

  const handleSearch = (term) => {
    setSearchQuery(term);
  };

  const handlePublish = (newPostData) => {
    const newPost = {
      ...newPostData,
      id: Date.now(),
      createdAt: new Date().toISOString(),
      author: 'You'
    };
    setPosts([newPost, ...posts]);
    setActivePage('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    setPosts(posts.filter(p => p.id !== id));
    if (currentPost?.id === id) {
      setCurrentPost(null);
      setActivePage('home');
    }
  };

  const handleViewPost = (id) => {
    const post = posts.find(p => p.id === id);
    if (post) {
      setCurrentPost(post);
      setActivePage('post');
      window.scrollTo({ top: 0, behavior: 'auto' });
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
            ) : filteredPosts.length === 0 ? (
              <EmptyState query={searchQuery} />
            ) : (
              <section className="blog-grid">
                {filteredPosts.map((post) => (
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
