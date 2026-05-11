function About() {
  return (
    <main className="page">
      <section className="hero-section">
        <h1 className="hero-heading">About TechHaven</h1>
        <p className="hero-subtext">Our story, our mission, and our values.</p>
      </section>

      <section className="about-story-section">
        <div className="about-story-img-col">
          <img src="/images/categories/cat1.jpg" alt="Our Team" className="about-story-img" />
        </div>
        <div className="about-story-text-col">
          <h2>Our Story</h2>
          <p>Founded in 2026, TechHaven started with a simple idea: to make premium consumer electronics accessible to everyone. We believe that technology has the power to elevate our daily lives, and we're passionate about bringing the best and most innovative products to our community.</p>
          <p>What began as a small online storefront has grown into a premier destination for tech enthusiasts, professionals, and everyday consumers alike. We carefully curate our catalog to ensure that every product we sell meets our high standards for quality, performance, and design.</p>
          <div className="about-stats-row">
            <div>
              <h3 className="about-stat-value">10k+</h3>
              <p className="about-stat-label">Happy Customers</p>
            </div>
            <div>
              <h3 className="about-stat-value">500+</h3>
              <p className="about-stat-label">Premium Products</p>
            </div>
            <div>
              <h3 className="about-stat-value">24/7</h3>
              <p className="about-stat-label">Customer Support</p>
            </div>
          </div>
        </div>
      </section>

      <section className="about-why-section">
        <div className="about-why-header">
          <h2>Why Choose Us?</h2>
          <p>We're more than just an electronics store.</p>
        </div>
        <div className="about-cards-grid">
          <div className="about-feature-card">
            <div className="about-feature-icon"><i className="fas fa-shipping-fast"></i></div>
            <h3>Fast Shipping</h3>
            <p>Free standard shipping on all orders over $50. Need it faster? We offer expedited options too.</p>
          </div>
          <div className="about-feature-card">
            <div className="about-feature-icon"><i className="fas fa-shield-alt"></i></div>
            <h3>Secure Checkout</h3>
            <p>Your data is safe with us. We use industry-leading encryption to protect your personal information.</p>
          </div>
          <div className="about-feature-card">
            <div className="about-feature-icon"><i className="fas fa-undo"></i></div>
            <h3>Easy Returns</h3>
            <p>Not completely satisfied? Return your item within 30 days for a full refund or exchange.</p>
          </div>
        </div>
      </section>
    </main>
  );
}

export default About;
