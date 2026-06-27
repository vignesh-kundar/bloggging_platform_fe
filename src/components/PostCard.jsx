import { useState } from 'react';
import './PostCard.css';

const MAX_VISIBLE_TAGS = 3;
const MAX_EXCERPT_LENGTH = 200;

export default function PostCard({ post, onClick }) {
  const { title, content, tags = [], createdAt, author, avatarUrl } = post;
  const [imgError, setImgError] = useState(false);
  const visibleTags = tags.slice(0, MAX_VISIBLE_TAGS);
  const extraCount = tags.length - MAX_VISIBLE_TAGS;

  const displayDate = createdAt ? new Date(createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }) : '';

  const stripMarkdown = (text) => {
    if (!text) return '';
    return text
      .replace(/#{1,6}\s/g, '')
      .replace(/(\*{1,2}|_{1,2})(.*?)\1/g, '$2')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/`{1,3}[^`]*`{1,3}/g, '')
      .replace(/>\s/g, '')
      .replace(/[-*+]\s/g, '')
      .replace(/\n{2,}/g, ' ')
      .trim();
  };

  const excerpt = content?.length > MAX_EXCERPT_LENGTH 
    ? stripMarkdown(content).slice(0, MAX_EXCERPT_LENGTH).trim() + '...'
    : stripMarkdown(content);

  return (
    <article className="entry" onClick={onClick}>
      <div className="entry__meta">
        <time className="entry__date">{displayDate}</time>
        {author && (
          <div className="entry__author">
            <div className="entry__author-avatar">
              {avatarUrl && !imgError ? (
                <img
                  key={avatarUrl}
                  src={`${avatarUrl}?seed=${encodeURIComponent(author || '')}`}
                  alt={author}
                  onError={() => setImgError(true)}
                />
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              )}
            </div>
            <span className="entry__author-name">{author}</span>
          </div>
        )}
      </div>

      <h2 className="entry__title">{title}</h2>
      <p className="entry__excerpt">{excerpt}</p>

      {tags.length > 0 && (
        <div className="entry__tags">
          {visibleTags.map((tag, index) => (
            <span key={`${tag}-${index}`} className="entry__tag">{tag}</span>
          ))}
          {extraCount > 0 && (
            <span className="entry__tag entry__tag--extra">+{extraCount}</span>
          )}
        </div>
      )}
    </article>
  );
}
