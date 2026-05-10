import { useState } from 'react';
import { Link } from 'react-router-dom';

const PRODUCT = {
  id: 'prod-1',
  name: 'Premium Wireless Headphones',
  price: 349.99,
  category: 'Audio',
  images: [
    '/images/audio/Product1.jpg',
    '/images/audio/Product2.jpg',
    '/images/audio/Product3.jpg',
  ],
};

function Product() {
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    let cartItems: { id: string; name: string; price: number; image: string; category: string; qty: number }[] = [];
    try { cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]'); } catch { cartItems = []; }
    const idx = cartItems.findIndex((i) => i.id === PRODUCT.id);
    if (idx > -1) {
      cartItems[idx].qty += qty;
    } else {
      cartItems.push({ id: PRODUCT.id, name: PRODUCT.name, price: PRODUCT.price, image: PRODUCT.images[0], category: PRODUCT.category, qty });
    }
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    window.dispatchEvent(new Event('cartUpdated'));
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleThumbClick = (index: number) => {
    setActiveImg(index);
  };

  return (
    <main className="page">
      <div className="product-breadcrumb">
        <Link to="/">Home</Link> /
        <Link to="/shop">Audio</Link> /
        <span className="product-breadcrumb-current">Premium Wireless Headphones</span>
      </div>

      <section>
        <div className="card product-layout">
          <div className="product-gallery-col">
            <div className="product-main-img-box">
              <img src={PRODUCT.images[activeImg]} alt="Premium Wireless Headphones" className="product-main-img" />
            </div>
            <div className="product-thumbs">
              {PRODUCT.images.map((src, i) => (
                <div
                  key={i}
                  className={`product-thumb${activeImg === i ? ' product-thumb-active' : ''}`}
                  onClick={() => handleThumbClick(i)}
                >
                  <img
                    src={src}
                    alt={`View ${i + 1}`}
                    className={activeImg === i ? 'product-thumb-img' : 'product-thumb-img-dim'}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="product-info-col">
            <div>
              <h1>Premium Wireless Headphones</h1>
              <div className="product-rating-row">
                <div className="product-stars">
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star-half-alt"></i>
                </div>
                <span className="product-review-count">(124 Reviews)</span>
              </div>
              <p className="product-price">$349.99</p>
            </div>

            <p>Industry-leading noise cancellation, exceptional sound quality, and up to 30 hours of battery life. These headphones are designed for the ultimate listening experience.</p>

            <div className="product-features">
              <ul className="product-feature-list">
                <li><i className="icon-check-green"></i> Advanced Noise Cancellation</li>
                <li><i className="icon-check-green"></i> Hi-Res Audio Compatible</li>
                <li><i className="icon-check-green"></i> Built-in Alexa &amp; Google Assistant</li>
                <li><i className="icon-check-green"></i> Touch Controls</li>
              </ul>
            </div>

            <div className="product-qty-row">
              <div className="product-qty-box">
                <button
                  type="button"
                  className="btn-qty-left"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <input
                  type="number"
                  value={qty}
                  min={1}
                  className="product-qty-input"
                  onChange={(e) => setQty(Math.max(1, parseInt(e.target.value) || 1))}
                />
                <button
                  type="button"
                  className="btn-qty-right"
                  onClick={() => setQty((q) => q + 1)}
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
              <button
                type="button"
                className={`btn-add-to-cart${added ? ' btn-added-green' : ''}`}
                onClick={handleAddToCart}
              >
                <i className={`fas ${added ? 'fa-check' : 'fa-shopping-cart'}`}></i>{' '}
                {added ? 'Added!' : 'Add to Cart'}
              </button>
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2>Product Details</h2>
        <div className="card product-details-card">
          <div className="product-desc-col">
            <h3>Description</h3>
            <p>Experience your music like never before. With two processors controlling eight microphones, our Auto NC Optimizer automatically optimizes noise canceling based on your wearing conditions and environment.</p>
            <p>With up to 30 hours of battery life, you'll have enough power for long trips. And if you need to top up in a hurry, you can get 3 hours' worth of charge after just 3 minutes.</p>
          </div>
          <div className="product-spec-col">
            <h3>Specifications</h3>
            <div className="product-spec-list">
              <div className="product-spec-row">
                <span className="product-spec-label">Weight</span>
                <span className="product-spec-value">250g</span>
              </div>
              <div className="product-spec-row">
                <span className="product-spec-label">Battery Life</span>
                <span className="product-spec-value">Up to 30 Hours</span>
              </div>
              <div className="product-spec-row">
                <span className="product-spec-label">Bluetooth</span>
                <span className="product-spec-value">Version 5.2</span>
              </div>
              <div className="product-spec-row">
                <span className="product-spec-label">Charging Time</span>
                <span className="product-spec-value">Approx. 3.5 Hours</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Product;
