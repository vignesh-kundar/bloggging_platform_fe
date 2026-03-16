import { useState } from 'react';
import './Hero.css';

const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

export default function Hero({ onSearch }) {
  const [value, setValue] = useState('');

  const handleChange = (e) => {
    setValue(e.target.value);
    onSearch(e.target.value);
  };

  return (
    <section className="hero neo-out">
      <h1 className="hero__title">Welcome to Blogify</h1>
      <p className="hero__subtitle">
        A clean, minimal space for thoughtful writing and meaningful stories.
      </p>
      <div className="hero__search neo-in">
        <SearchIcon />
        <input
          type="text"
          placeholder="Search posts by title, content, or tags..."
          value={value}
          onChange={handleChange}
          aria-label="Search posts"
        />
      </div>
    </section>
  );
}
