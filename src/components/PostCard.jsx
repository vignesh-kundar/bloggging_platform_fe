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

const MAX_VISIBLE_TAGS = 2;

export default function PostCard({ post }) {
  const { title, excerpt, tags = [], date } = post;
  const visibleTags = tags.slice(0, MAX_VISIBLE_TAGS);
  const extraCount = tags.length - MAX_VISIBLE_TAGS;

  return (
    <article className="post-card neo-out">
      <div className="post-card__tags">
        {visibleTags.map((tag) => (
          <span key={tag} className="post-card__tag">
            <TagIcon /> {tag}
          </span>
        ))}
        {extraCount > 0 && (
          <span className="post-card__tag post-card__tag--extra">+{extraCount}</span>
        )}
      </div>
      <h2 className="post-card__title">{title}</h2>
      <p className="post-card__excerpt">{excerpt}</p>
      <div className="post-card__meta">
        <CalendarIcon />
        <time>{date}</time>
      </div>
    </article>
  );
}
