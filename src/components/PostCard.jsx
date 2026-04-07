import './PostCard.css';

const TagIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
    <line x1="7" y1="7" x2="7.01" y2="7" />
  </svg>
);

const CalendarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const TrashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    <line x1="10" y1="11" x2="10" y2="17" />
    <line x1="14" y1="11" x2="14" y2="17" />
  </svg>
);

const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const MAX_VISIBLE_TAGS = 3;
const MAX_EXCERPT_LENGTH = 150;

export default function PostCard({ post, onDelete, onClick }) {
  const { title, content, tags = [], createdAt, id, author } = post;
  const visibleTags = tags.slice(0, MAX_VISIBLE_TAGS);
  const extraCount = tags.length - MAX_VISIBLE_TAGS;

  const displayDate = createdAt ? new Date(createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }) : 'Loading...';

  const excerpt = content?.length > MAX_EXCERPT_LENGTH 
    ? content.slice(0, MAX_EXCERPT_LENGTH).trim() + '...'
    : content;

  return (
    <article className="post-card neo-out" onClick={onClick}>
      <div className="post-card__tags">
        {visibleTags.map((tag, index) => (
          <span key={`${tag}-${index}`} className="post-card__tag">
            <TagIcon /> {tag}
          </span>
        ))}
        {extraCount > 0 && (
          <span className="post-card__tag post-card__tag--extra">+{extraCount}</span>
        )}
      </div>
      <h2 className="post-card__title">{title}</h2>
      <p className="post-card__excerpt">{excerpt}</p>
      <div className="post-card__footer">
        <div className="post-card__meta">
          {author && (
            <span className="post-card__author">
              <UserIcon /> {author.name}
            </span>
          )}
          <span className="post-card__date">
            <CalendarIcon /> {displayDate}
          </span>
        </div>
        <button className="post-card__delete neo-tag" onClick={(e) => {
          e.stopPropagation();
          onDelete(id);
        }}>
          <TrashIcon />
        </button>
      </div>
    </article>
  );
}
