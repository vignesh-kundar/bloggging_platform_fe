import { useState, useMemo } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import PostCard from './components/PostCard';
import About from './components/About';
import NewPost from './components/NewPost';

const BLOG_POSTS = [
  {
    id: 1,
    title: 'The Future of Modern Web Development',
    excerpt:
      'The landscape of web development continues to evolve at a rapid pace. As we navigate through 2026, several key shifts are reshaping how we build and ship applications...',
    tags: ['Technology', 'Web Development', 'React', 'Vite'],
    date: 'Mar 14, 2026',
  },
  {
    id: 2,
    title: 'Crafting the Perfect Morning Routine',
    excerpt:
      "A well-crafted morning routine can set the tone for your entire day. It's not about waking up at 5 AM or following a rigid schedule, but about designing rituals that energize and focus you...",
    tags: ['Lifestyle', 'Productivity', 'Wellness'],
    date: 'Mar 12, 2026',
  },
  {
    id: 3,
    title: 'Finding Peace in Nature',
    excerpt:
      'In our hyper-connected world, the simple act of spending time in nature has become revolutionary. Research consistently shows that exposure to natural environments can reduce stress...',
    tags: ['Wellness', 'Nature', 'Mental Health'],
    date: 'Mar 10, 2026',
  },
  {
    id: 4,
    title: 'Design Thinking for Everyone',
    excerpt:
      "Design thinking isn't just for designers. This human-centered approach to problem solving can be applied across disciplines—from product development to organizational strategy...",
    tags: ['Design', 'Innovation', 'Problem Solving'],
    date: 'Mar 8, 2026',
  },
  {
    id: 5,
    title: 'Minimalism in Architecture',
    excerpt:
      "Less is more. This timeless principle drives minimalist architecture, where space, light, and material quality take precedence over ornamentation. We explore how modern architects are...",
    tags: ['Architecture', 'Design', 'Minimalism'],
    date: 'Mar 6, 2026',
  },
  {
    id: 6,
    title: 'The Art of Mindful Writing',
    excerpt:
      'Mindful writing is the practice of bringing full awareness to the act of putting words on a page. Whether journaling or crafting long-form essays, presence transforms the writing process...',
    tags: ['Writing', 'Mindfulness', 'Creativity'],
    date: 'Mar 4, 2026',
  },
  {
    id: 7,
    title: 'Machine Learning in Everyday Life',
    excerpt:
      'From your morning commute recommendations to fraud detection on your bank account, machine learning quietly powers many of the decisions that shape your daily experience...',
    tags: ['AI', 'Technology', 'Machine Learning'],
    date: 'Mar 2, 2026',
  },
  {
    id: 8,
    title: 'The Return of Analog Creativity',
    excerpt:
      "In a digital-saturated world, many creatives are turning back to analog tools—sketchbooks, film cameras, hand-lettering. We explore why going 'low-tech' can unlock fresh ideas...",
    tags: ['Creativity', 'Analog', 'Art'],
    date: 'Feb 28, 2026',
  },
  {
    id: 9,
    title: 'Building Resilience in Uncertain Times',
    excerpt:
      "Resilience isn't about bouncing back—it's about building forward. In this piece, we examine psychological research and practical strategies to help you navigate life's inevitable challenges...",
    tags: ['Wellness', 'Psychology', 'Resilience'],
    date: 'Feb 26, 2026',
  },
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
  const [posts, setPosts] = useState(BLOG_POSTS);

  const handlePublish = (newPost) => {
    setPosts([newPost, ...posts]);
    setActivePage('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filteredPosts = useMemo(() => {
    if (!searchQuery.trim()) return posts;
    const q = searchQuery.toLowerCase();
    return posts.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.excerpt.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
    );
  }, [searchQuery, posts]);

  return (
    <div className="app">
      <Navbar activePage={activePage} setActivePage={setActivePage} />
      <main className="app__main">
        {activePage === 'home' && (
          <>
            <Hero onSearch={setSearchQuery} />
            {filteredPosts.length === 0 ? (
              <EmptyState query={searchQuery} />
            ) : (
              <section className="blog-grid">
                {filteredPosts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </section>
            )}
          </>
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
