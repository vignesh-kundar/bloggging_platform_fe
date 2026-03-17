import { useState } from 'react';
import './NewPost.css';

const SendIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);

const XIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

export default function NewPost({ onPublish }) {
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: ''
  });
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddTag = (e) => {
    e.preventDefault();
    const tag = tagInput.trim();
    if (tag && !tags.includes(tag)) {
      setTags([...tags, tag]);
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
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
      tags: tags
    };

    onPublish(newPost);
    // Reset form
    setFormData({ title: '', excerpt: '', content: '' });
    setTags([]);
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
              placeholder="Enter post title..."
              className="neo-in"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="tags">Tags</label>
            <div className="tag-input-wrapper">
              <input
                type="text"
                id="tags"
                placeholder="Add a tag..."
                className="neo-in"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag(e);
                  }
                }}
              />
              <button type="button" onClick={handleAddTag} className="add-tag-btn neo-out">
                Add
              </button>
            </div>
            {tags.length > 0 && (
              <div className="tag-chips">
                {tags.map(tag => (
                  <span key={tag} className="tag-chip neo-out">
                    {tag}
                    <button type="button" onClick={() => removeTag(tag)} className="remove-tag">
                      <XIcon />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="content">Content</label>
            <textarea
              id="content"
              name="content"
              placeholder="Write your post content..."
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
