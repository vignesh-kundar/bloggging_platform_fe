import { useState, useEffect, useRef } from 'react';
import './Hero.css';

export default function Hero({ onSearch }) {
  const [value, setValue] = useState('');
  const debounceRef = useRef(null);
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      onSearch(value);
    }, 300);
    
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [value, onSearch]);

  const handleChange = (e) => {
    setValue(e.target.value);
  };

  return (
    <section className="hero">
      <div className="hero__inner">
        <h1 className="hero__title">Blogify</h1>
        <p className="hero__subtitle">
          A mindful space for thoughtful writing, quiet reflections, and stories that linger.
        </p>
        <div className="hero__search">
          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Search posts by title, content, or tags..."
            value={value}
            onChange={handleChange}
            aria-label="Search posts"
          />
        </div>
      </div>
    </section>
  );
}
