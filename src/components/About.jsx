import './About.css';

export default function About() {
  return (
    <div className="about-container">
      <section className="about-hero neo-out">
        <h1 className="about-hero__title">About Blogify</h1>
        <p className="about-hero__subtitle">
          Where thoughts find their home in a clean, minimal, and focused space.
        </p>
      </section>

      <div className="about-content">
        <section className="about-section neo-out">
          <h2 className="about-section__title">Our Mission</h2>
          <p className="about-section__text">
            In an era of digital noise and constant distractions, Blogify was born from a desire for 
            simplicity. We believe that great writing deserves a space that doesn't compete for your 
            attention with blinking ads or cluttered sidebars.
          </p>
        </section>

        <section className="about-section neo-out">
          <h2 className="about-section__title">The Design</h2>
          <p className="about-section__text">
            Our platform utilizes <strong>Neomorphism</strong>—a design style that merges the best of 
            minimalism and skeuomorphism. By using soft shadows and highlights, we create a tactile, 
            physical feel that makes reading and writing a more sensorial experience.
          </p>
        </section>

        <section className="about-section neo-out">
          <h2 className="about-section__title">Join the Journey</h2>
          <p className="about-section__text">
            Whether you're a professional writer, a hobbyist poet, or someone who just wants to share 
            their morning thoughts, Blogify is for you. Start your mindful writing journey today.
          </p>
          <div className="about-cta neo-in">
            <span>Happy Writing!</span>
          </div>
        </section>
      </div>
    </div>
  );
}
