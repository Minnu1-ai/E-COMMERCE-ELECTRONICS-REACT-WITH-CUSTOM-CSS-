function Blog() {
  return (
    <main className="page">
      <section className="blog-hero">
        <h1>Tech Insights</h1>
        <p>The latest news, reviews, and buying guides.</p>
      </section>

      <section>
        <div className="card-container">
          <article className="blog-card">
            <img src="/images/laptops/Product1.jpg" alt="Laptop Buying Guide" className="blog-card-img" />
            <div className="card-body">
              <span className="blog-tag">Buying Guide</span>
              <a href="#" className="blog-card-title">The Ultimate Laptop Buying Guide for 2026</a>
              <p className="blog-card-excerpt">Struggling to find the perfect laptop? We break down everything you need to know, from processors and RAM to screen types and battery life.</p>
              <div className="blog-card-meta">
                <span><i className="far fa-calendar"></i> April 24, 2026</span>
                <span>By Alex Johnson</span>
              </div>
            </div>
          </article>

          <article className="blog-card">
            <img src="/images/audio/Product1.jpg" alt="Headphone Comparison" className="blog-card-img" />
            <div className="card-body">
              <span className="blog-tag">Review</span>
              <a href="#" className="blog-card-title">Sony WH-1000XM5 vs Apple AirPods Max</a>
              <p className="blog-card-excerpt">We put the top two noise-canceling headphones head-to-head to see which one reigns supreme for audio quality, comfort, and battery life.</p>
              <div className="blog-card-meta">
                <span><i className="far fa-calendar"></i> April 18, 2026</span>
                <span>By Sarah Chen</span>
              </div>
            </div>
          </article>

          <article className="blog-card">
            <img src="/images/wearables/Product1.jpg" alt="Wearable Technology" className="blog-card-img" />
            <div className="card-body">
              <span className="blog-tag">News</span>
              <a href="#" className="blog-card-title">What's Next for Wearable Technology?</a>
              <p className="blog-card-excerpt">From advanced health tracking to seamless smart home integration, explore the upcoming trends that will define the next generation of smartwatches.</p>
              <div className="blog-card-meta">
                <span><i className="far fa-calendar"></i> April 12, 2026</span>
                <span>By Mike Rivera</span>
              </div>
            </div>
          </article>

          <article className="blog-card">
            <img src="/images/cameras/Product1.jpg" alt="Mirrorless Camera Guide" className="blog-card-img" />
            <div className="card-body">
              <span className="blog-tag">Tutorial</span>
              <a href="#" className="blog-card-title">Getting Started with Mirrorless Cameras</a>
              <p className="blog-card-excerpt">Making the switch from your smartphone to a dedicated camera? Here are our top 10 tips for beginners looking to master manual photography.</p>
              <div className="blog-card-meta">
                <span><i className="far fa-calendar"></i> April 05, 2026</span>
                <span>By Emily Wong</span>
              </div>
            </div>
          </article>
        </div>

        <div className="blog-load-more">
          <button className="btn-outline">Load More Articles</button>
        </div>
      </section>
    </main>
  );
}

export default Blog;
