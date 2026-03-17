import { useState } from 'react';
import './NewPost.css';

const SendIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);

export default function NewPost({ onPublish }) {
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    tags: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) return;

    const newPost = {
      ...formData,
      id: Date.now(),
      date: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }),
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '')
    };

    onPublish(newPost);
    // Reset form
    setFormData({ title: '', excerpt: '', content: '', tags: '' });
  };

  return (
    <div className="new-post-container">
      <div className="new-post-card neo-out">
        <h1 className="new-post__title">Create New Post</h1>
        <p className="new-post__subtitle">Share your stories and insights with the world.</p>

        <form className="new-post-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              name="title"
              placeholder="Give your story a title..."
              className="neo-in"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="excerpt">Excerpt</label>
            <input
              type="text"
              id="excerpt"
              name="excerpt"
              placeholder="A brief summary of your post..."
              className="neo-in"
              value={formData.excerpt}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="tags">Tags (comma separated)</label>
            <input
              type="text"
              id="tags"
              name="tags"
              placeholder="Technology, Web, Design..."
              className="neo-in"
              value={formData.tags}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="content">Content</label>
            <textarea
              id="content"
              name="content"
              placeholder="Write your story here..."
              className="neo-in"
              rows="12"
              value={formData.content}
              onChange={handleChange}
              required
            ></textarea>
          </div>

          <button type="submit" className="publish-btn">
            <SendIcon /> Publish Post
          </button>
        </form>
      </div>
    </div>
  );
}
