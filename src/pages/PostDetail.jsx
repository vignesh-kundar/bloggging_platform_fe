import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { usePosts } from '../context/PostsContext';
import './PostDetail.css';

export default function PostDetail({ onBack }) {
  const { currentPost } = usePosts();
  const [imgError, setImgError] = useState(false);
  
  if (!currentPost) return <div className="loading-state">Loading post…</div>;

  const { title, content, tags = [], createdAt, updatedAt, author, avatarUrl } = currentPost;
  const authorAvatarSrc = avatarUrl && !imgError && author
    ? `${avatarUrl}?seed=${encodeURIComponent(author)}`
    : null;

  const formatDate = (dateStr) => {
    if (!dateStr) return null;
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatFullDateTime = (dateStr) => {
    if (!dateStr) return null;
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
    <article className="post">
      <button className="post__back" onClick={onBack}>
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="19" y1="12" x2="5" y2="12" />
          <polyline points="12 19 5 12 12 5" />
        </svg>
        Back to Posts
      </button>

      <header className="post__header">
        {tags.length > 0 && (
          <div className="post__tags">
            {tags.map((tag, index) => (
              <span key={`${tag}-${index}`} className="post__tag">{tag}</span>
            ))}
          </div>
        )}

        <h1 className="post__title">{title}</h1>

        <div className="post__meta">
          <div className="post__author">
            <div className="post__author-avatar">
              {authorAvatarSrc ? (
                <img
                  src={authorAvatarSrc}
                  alt={author}
                  onError={() => setImgError(true)}
                />
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              )}
            </div>
            <span className="post__author-name">{author}</span>
          </div>
          {formatDate(createdAt) && (
            <>
              <span className="post__meta-sep">·</span>
              <time className="post__date">{formatDate(createdAt)}</time>
            </>
          )}
        </div>
      </header>

      <div className="post__content">
        <ReactMarkdown>
          {content}
        </ReactMarkdown>
      </div>

      <footer className="post__footer">
        <div className="post__timestamps">
          {formatFullDateTime(createdAt) && (
            <span>Created {formatFullDateTime(createdAt)}</span>
          )}
          {updatedAt && updatedAt !== createdAt && formatFullDateTime(updatedAt) && (
            <span>· Updated {formatFullDateTime(updatedAt)}</span>
          )}
        </div>
      </footer>
    </article>
  );
}
