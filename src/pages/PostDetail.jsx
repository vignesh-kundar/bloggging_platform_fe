import { usePosts } from '../context/PostsContext';
import './PostDetail.css';

const ArrowLeftIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </svg>
);

const TagIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
    <line x1="7" y1="7" x2="7.01" y2="7" />
  </svg>
);

const CalendarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

export default function PostDetail({ onBack }) {
  const { currentPost, loading, error } = usePosts();
  
  if (!currentPost) return <div className="loading-state">Loading post...</div>;

  const { title, content, tags = [], createdAt, updatedAt } = currentPost;

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatFullDateTime = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="post-detail-container">
      <button className="back-btn neo-out" onClick={onBack}>
        <ArrowLeftIcon /> Back to Posts
      </button>

      <article className="post-detail neo-out">
        <div className="post-detail__header">
          <div className="post-detail__tags">
            {tags.map((tag, index) => (
              <span key={`${tag}-${index}`} className="post-detail__tag neo-tag">
                <TagIcon /> {tag}
              </span>
            ))}
          </div>
          <h1 className="post-detail__title">{title}</h1>
          <div className="post-detail__meta">
            <CalendarIcon />
            <span>Created: {formatDate(createdAt)}</span>
          </div>
        </div>

        <div className="post-detail__content">
          {content.split('\n').filter(p => p.trim()).map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>

        <div className="post-detail__footer neo-in">
          <div className="timestamp-group">
            <span className="timestamp-label">Created:</span>
            <span className="timestamp-value">{formatFullDateTime(createdAt)}</span>
          </div>
          <div className="timestamp-group">
            <span className="timestamp-label">Last Updated:</span>
            <span className="timestamp-value">{formatFullDateTime(updatedAt)}</span>
          </div>
        </div>
      </article>
    </div>
  );
}
