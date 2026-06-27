import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import './NewPost.css';
import { useNotification } from '../context/NotificationContext';

export default function NewPost({ onPublish }) {
  const { showNotification } = useNotification();
  const [formData, setFormData] = useState({
    title: '',
    category: 'Technology',
    content: ''
  });
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [preview, setPreview] = useState(false);

  const CATEGORIES = ['Technology', 'Lifestyle', 'Nature', 'Design', 'Innovation', 'Wellness', 'Other'];

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) return;
    
    if (tags.length === 0) {
      showNotification('Please add at least one tag before publishing.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      await onPublish({
        ...formData,
        tags: tags
      });
      setFormData({ title: '', category: 'Technology', content: '' });
      setTags([]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="new-entry">
      <h1 className="new-entry__title">Create New Post</h1>
      <p className="new-entry__subtitle">Share your thoughts with the world.</p>

      <form className="new-entry-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            placeholder="Enter post title…"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
          >
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="tags">
            Tags <span className="required">*</span>
          </label>
          <div className="tag-input-row">
            <input
              type="text"
              id="tags"
              placeholder="Add a tag…"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddTag(e);
                }
              }}
            />
            <button type="button" className="tag-add-btn" onClick={handleAddTag}>
              Add
            </button>
          </div>
          {tags.length > 0 && (
            <div className="tag-chips">
              {tags.map(tag => (
                <span key={tag} className="tag-chip">
                  {tag}
                  <button type="button" onClick={() => removeTag(tag)} className="remove-tag">
                    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="form-group">
          <div className="content-header">
            <label htmlFor="content">Content</label>
            <div className="editor-tabs">
              <button
                type="button"
                className={`editor-tab ${!preview ? 'editor-tab--active' : ''}`}
                onClick={() => setPreview(false)}
              >
                Write
              </button>
              <button
                type="button"
                className={`editor-tab ${preview ? 'editor-tab--active' : ''}`}
                onClick={() => setPreview(true)}
              >
                Preview
              </button>
            </div>
          </div>
          {preview ? (
            <div className="preview-pane">
              {formData.content ? (
                <ReactMarkdown>{formData.content}</ReactMarkdown>
              ) : (
                <p className="preview-pane__empty">Nothing to preview yet.</p>
              )}
            </div>
          ) : (
            <textarea
              id="content"
              name="content"
              placeholder="Write your post content in markdown… (headings, **bold**, *italic*, lists, etc.)"
              rows="14"
              value={formData.content}
              onChange={handleChange}
              required
            ></textarea>
          )}
        </div>

        <div className="form-actions">
          <button type="submit" className="publish-btn" disabled={isSubmitting}>
            {isSubmitting ? 'Publishing…' : 'Publish Post'}
          </button>
        </div>
      </form>
    </div>
  );
}
