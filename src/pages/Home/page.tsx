import { useState } from 'react';
import { Link } from 'react-router-dom';

interface TrendingProduct {
  id: string;
  name: string;
  category: string;
  price: string;
  image: string;
}

const trendingProducts: TrendingProduct[] = [
  { id: 'trend-1', name: 'Premium Wireless Headphones', category: 'Audio',        price: '349.99',  image: '/images/top products/Product1.jpg' },
  { id: 'trend-2', name: 'Ultra-Slim Creator Laptop 16"', category: 'Laptops & PCs', price: '2,499.00', image: '/images/top products/Product2.jpg' },
  { id: 'trend-3', name: 'Pro Max Smartphone 5G',        category: 'Smartphones', price: '1,199.00', image: '/images/top products/Product3.jpg' },
  { id: 'trend-4', name: 'Mirrorless Digital Camera',    category: 'Cameras',     price: '1,799.00', image: '/images/top products/Product4.jpg' },
];

function Home() {
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());

  const handleAddToCart = (product: TrendingProduct) => {
    let cartItems: { id: string; name: string; price: number; image: string; category: string; qty: number }[] = [];
    try { cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]'); } catch { cartItems = []; }
    const idx = cartItems.findIndex((i) => i.id === product.id);
    if (idx > -1) {
      cartItems[idx].qty++;
    } else {
      cartItems.push({
        id: product.id,
        name: product.name,
        price: parseFloat(product.price.replace(/,/g, '')),
        image: product.image,
        category: product.category,
        qty: 1,
      });
    }
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    window.dispatchEvent(new Event('cartUpdated'));
    setAddedIds((prev) => new Set(prev).add(product.id));
    setTimeout(() => {
      setAddedIds((prev) => { const next = new Set(prev); next.delete(product.id); return next; });
    }, 1500);
  };

  return (
    <main className="page">

      {/* Hero */}
      <section className="index-hero">
        <h1 className="index-hero-heading">Next-Gen Tech For Your Lifestyle</h1>
        <p className="index-hero-subtext">
          Discover our latest collection of premium electronics, smart home devices, and
          cutting-edge accessories designed to elevate your everyday experience.
        </p>
        <div className="index-hero-actions">
          <Link to="/shop" className="btn-primary-lg">Shop Collection &rarr;</Link>
          <Link to="/contact" className="btn-hero-offers">View Offers</Link>
        </div>
      </section>

      {/* Shop by Category */}
      <section>
        <div className="section-title-row">
          <h2 className="h2-no-margin">Shop by Category</h2>
          <Link to="/shop" className="btn-outline">View all categories &rarr;</Link>
        </div>

        <div className="card-container">
          <div className="card">
            <img src="/images/categories/cat1.jpg" alt="Laptops" />
            <div className="card-body">
              <Link to="/shop?category=Laptops%20%26%20PCs">Laptops &amp; PCs</Link>
              <p>120+ Products</p>
            </div>
          </div>
          <div className="card">
            <img src="/images/categories/cat2.jpg" alt="Smartphones" />
            <div className="card-body">
              <Link to="/shop?category=Smartphones">Smartphones</Link>
              <p>85+ Products</p>
            </div>
          </div>
          <div className="card">
            <img src="/images/categories/cat3.jpg" alt="Audio" />
            <div className="card-body">
              <Link to="/shop?category=Audio">Audio</Link>
              <p>64+ Products</p>
            </div>
          </div>
          <div className="card">
            <img src="/images/categories/cat4.jpg" alt="Wearables" />
            <div className="card-body">
              <Link to="/shop?category=Wearables">Wearables</Link>
              <p>42+ Products</p>
            </div>
          </div>
        </div>
      </section>

      {/* Trending Now */}
      <section>
        <div className="trending-section-header">
          <h2>Trending Now</h2>
          <p className="home-section-sub">Top picks from our community</p>
        </div>

        <div className="trending-grid">
          {trendingProducts.map((product) => {
            const isAdded = addedIds.has(product.id);
            return (
              <div key={product.id} className="card">
                <Link to="/product">
                  <img src={product.image} alt={product.name} />
                </Link>
                <div className="card-body">
                  <Link to="/product">{product.name}</Link>
                  <span className="category-tag">{product.category}</span>
                  <div className="price-row">
                    <span className="price">${product.price}</span>
                    <button
                      type="button"
                      className={isAdded ? 'add-btn-added-green' : 'add-btn'}
                      aria-label="Add to cart"
                      onClick={() => handleAddToCart(product)}
                    >
                      <i className={`fas ${isAdded ? 'fa-check' : 'fa-plus'}`}></i>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

    </main>
  );
}

export default Home;
