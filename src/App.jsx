import { useState, useMemo } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import PostCard from './components/PostCard';
import About from './components/About';
import NewPost from './components/NewPost';
import PostDetail from './components/PostDetail';

const INITIAL_POSTS = [
  {
    id: 1,
    title: 'Getting Started with Modern Web Development',
    content: 'Web development has evolved tremendously over the years. From simple HTML pages to complex single-page applications, the landscape continues to change. In this post, we explore the fundamental concepts that every developer should know...\n\nModern web development involves understanding the DOM, CSS layout systems, JavaScript ES6+ features, and component-based architectures. Whether you are building a simple blog or a complex web application, these fundamentals will serve as your foundation.',
    category: 'Technology',
    tags: ['Web Dev', 'JavaScript', 'Beginners'],
    createdAt: '2026-03-15T10:30:00Z',
    author: 'John Developer'
  },
  {
    id: 2,
    title: 'The Art of Minimalist Design',
    content: 'Less is more. This principle lies at the heart of minimalist design. By removing unnecessary elements, we allow the essential to shine through. In this article, we discuss how to achieve balance and harmony in your designs...\n\nMinimalism is not about deprivation—it is about intentionality. Every element on the page should serve a purpose. When we strip away the excess, we are left with clarity and focus.',
    category: 'Design',
    tags: ['Minimalism', 'UI/UX', 'Design'],
    createdAt: '2026-03-10T14:20:00Z',
    author: 'Sarah Designer'
  },
  {
    id: 3,
    title: 'Finding Peace in Nature',
    content: 'There is something profoundly restorative about spending time in nature. The rustle of leaves, the song of birds, the gentle breeze—these simple pleasures ground us in the present moment...\n\nResearch shows that even brief exposure to natural environments can reduce stress hormones and improve mental well-being. Whether it is a walk in the park or a hike in the mountains, nature offers us a sanctuary from the chaos of modern life.',
    category: 'Nature',
    tags: ['Nature', 'Wellness', 'Mindfulness'],
    createdAt: '2026-03-05T09:15:00Z',
    author: 'Mike Nature'
  },
  {
    id: 4,
    title: 'Innovations Shaping Our Future',
    content: 'From artificial intelligence to quantum computing, technological innovations are reshaping our world at an unprecedented pace. This post explores the trends that will define the coming decade...\n\nArtificial intelligence is no longer science fiction—it is woven into our daily lives. Machine learning algorithms power our recommendations, voice assistants, and even medical diagnoses. As we look ahead, the possibilities seem limitless.',
    category: 'Innovation',
    tags: ['AI', 'Future', 'Technology'],
    createdAt: '2026-03-01T16:45:00Z',
    author: 'Alex Innovator'
  },
  {
    id: 5,
    title: 'A Guide to Holistic Wellness',
    content: 'True wellness encompasses more than just physical health. It is a harmonious balance of mind, body, and spirit. This guide explores holistic approaches to living well...\n\nNutrition, exercise, sleep, and mental health are all interconnected. When we nurture each aspect of our well-being, we create a foundation for a vibrant, fulfilling life.',
    category: 'Wellness',
    tags: ['Health', 'Wellness', 'Lifestyle'],
    createdAt: '2026-02-25T11:00:00Z',
    author: 'Dr. Emily Wellness'
  }
];

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
