import './About.css';

const ContentIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
  </svg>
);

const HeartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l8.78-8.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const PenIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 19l7-7 3 3-7 7-3-3z" />
    <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
    <path d="M2 2l1.5 1.5" />
    <circle cx="11" cy="11" r="2" />
  </svg>
);

export default function About() {
  return (
    <div className="about-page">
      <section className="about-hero neo-out">
        <h1 className="about-hero__title">About Blogify</h1>
        <p className="about-hero__subtitle">
          A minimalist platform dedicated to thoughtful writing and meaningful conversations.
        </p>
      </section>

      <section className="about-mission neo-out">
        <h2 className="about-mission__title">Our Mission</h2>
        <div className="about-mission__content">
          <p>
            In a world of constant noise and distraction, we believe in the power of focused, intentional content. 
            Blogify was created to provide a calm, beautiful space where writers can share their thoughts and readers 
            can engage deeply with ideas that matter.
          </p>
          <p>
            Our neomorphic design isn't just aesthetic—it's intentional. The soft, tactile interface encourages you to 
            slow down, to read carefully, and to think deeply about what you're consuming.
          </p>
        </div>
      </section>

      <div className="about-features">
        <div className="feature-card neo-out">
          <div className="feature-card__icon neo-in">
            <ContentIcon />
          </div>
          <h3 className="feature-card__title">Quality Content</h3>
          <p className="feature-card__text">
            Every article is carefully curated to provide value and insight to our readers.
          </p>
        </div>

        <div className="feature-card neo-out">
          <div className="feature-card__icon neo-in">
            <HeartIcon />
          </div>
          <h3 className="feature-card__title">Thoughtful Design</h3>
          <p className="feature-card__text">
            Clean, minimal aesthetics that enhance rather than distract from the writing.
          </p>
        </div>

        <div className="feature-card neo-out">
          <div className="feature-card__icon neo-in">
            <PenIcon />
          </div>
          <h3 className="feature-card__title">Simplicity</h3>
          <p className="feature-card__text">
            Focus on what matters—great writing and meaningful ideas.
          </p>
        </div>
      </div>

      <section className="about-story neo-out">
        <h2 className="about-story__title">The Story</h2>
        <div className="about-story__content">
          <p>
            Blogify began as a simple idea: what if we could create a blog platform that felt like holding a well-crafted book? 
            A space that invited contemplation rather than quick scrolling?
          </p>
          <p>
            Drawing inspiration from neomorphism—a design trend that creates soft, extruded shapes—we built an interface 
            that feels tangible and calming. Each element has depth and presence, encouraging you to interact thoughtfully 
            with the content.
          </p>
          <p>
            Today, Blogify serves as a home for writers who value quality over quantity, and readers who appreciate 
            the art of long-form content in an age of bite-sized media.
          </p>
        </div>
      </section>
    </div>
  );
}
