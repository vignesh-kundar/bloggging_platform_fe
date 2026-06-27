import './About.css';

export default function About() {
  return (
    <div className="about">
      <section className="about__hero">
        <h1 className="about__title">About Blogify</h1>
        <p className="about__subtitle">
          A quiet corner of the internet dedicated to thoughtful writing and meaningful ideas.
        </p>
      </section>

      <section className="about__section">
        <h2>Our Mission</h2>
        <p>
          In a world of constant noise and distraction, we believe in the power of focused, intentional content.
          Blogify was created to provide a calm, beautiful space where writers can share their thoughts
          and readers can engage deeply with ideas that matter.
        </p>
        <p>
          Our design philosophy is rooted in the concept of &ldquo;Digital Tactility&rdquo;&mdash;bridging the gap
          between a physical notebook and a modern reading experience. We believe that great writing deserves
          a worthy home.
        </p>
      </section>

      <div className="about__features">
        <div className="feature">
          <h3 className="feature__title">Thoughtful Design</h3>
          <p className="feature__text">
            Clean, minimal aesthetics that honor the written word. Every element is designed to
            enhance rather than distract from the reading experience.
          </p>
        </div>
        <div className="feature">
          <h3 className="feature__title">Quality Content</h3>
          <p className="feature__text">
            A curated space for writing that values depth over speed, meaning over noise, and
            substance over spectacle.
          </p>
        </div>
        <div className="feature">
          <h3 className="feature__title">Quiet Focus</h3>
          <p className="feature__text">
            An environment designed for deep reading and reflection. No pop-ups, no distractions&mdash;just
            words on a page.
          </p>
        </div>
      </div>

      <section className="about__section">
        <h2>The Story</h2>
        <p>
          Blogify began as a simple idea: what if we could create a blog platform that felt like
          holding a well-crafted book? A space that invited contemplation rather than quick scrolling?
        </p>
        <p>
          Drawing inspiration from the physical qualities of paper and ink&mdash;the warmth of cream-colored
          pages, the quiet dignity of serif type, the satisfying weight of a bound volume&mdash;we built an
          interface that feels tangible and calm. Every element is designed to honor the written word.
        </p>
        <p>
          Today, Blogify serves as a home for writers who value quality over quantity, and readers
          who appreciate the art of long-form content in an age of bite-sized media. It is, above all, a
          reminder that some things are worth reading slowly.
        </p>
      </section>
    </div>
  );
}
