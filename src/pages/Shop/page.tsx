import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

interface ProductItem {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
}

const productData: ProductItem[] = [
  { id: 'shop-1',  name: 'Apple Elite 14',              category: 'Laptops & PCs', price: 1663.85, image: '/images/laptops/Product1.jpg' },
  { id: 'shop-2',  name: 'MSI Premium 70',              category: 'Laptops & PCs', price: 938.84,  image: '/images/laptops/Product2.jpg' },
  { id: 'shop-3',  name: 'Asus Advanced 98',            category: 'Laptops & PCs', price: 1026.02, image: '/images/laptops/Product3.jpg' },
  { id: 'shop-4',  name: 'Asus Lite 31',                category: 'Laptops & PCs', price: 1960.94, image: '/images/laptops/Product4.jpg' },
  { id: 'shop-5',  name: 'Acer Mini 75',                category: 'Laptops & PCs', price: 161.93,  image: '/images/laptops/product5.jpeg' },
  { id: 'shop-6',  name: 'Razer Elite 48',              category: 'Laptops & PCs', price: 2815.55, image: '/images/laptops/Product6.jpg' },
  { id: 'shop-7',  name: 'Acer Advanced 62',            category: 'Laptops & PCs', price: 540.65,  image: '/images/laptops/Product7.jpg' },
  { id: 'shop-8',  name: 'MSI Lite 84',                 category: 'Laptops & PCs', price: 1909.42, image: '/images/laptops/Product8.jpg' },
  { id: 'shop-9',  name: 'Dell Mini 82',                category: 'Laptops & PCs', price: 349.16,  image: '/images/laptops/Product9.jpg' },
  { id: 'shop-10', name: 'HP Air 53',                   category: 'Laptops & PCs', price: 2226.16, image: '/images/laptops/Product10.jpg' },
  { id: 'shop-11', name: 'MSI Max 41',                  category: 'Laptops & PCs', price: 2525.47, image: '/images/laptops/Product11.jpg' },
  { id: 'shop-12', name: 'Razer Air 88',                category: 'Laptops & PCs', price: 1837.83, image: '/images/laptops/Product12.jpg' },
  { id: 'shop-13', name: 'HP Air 10',                   category: 'Laptops & PCs', price: 2898.79, image: '/images/laptops/Product13.jpg' },
  { id: 'shop-14', name: 'Oppo Elite 19',               category: 'Smartphones',   price: 981.51,  image: '/images/smartphones/Product1.jpg' },
  { id: 'shop-15', name: 'Apple Max 93',                category: 'Smartphones',   price: 2935.31, image: '/images/smartphones/Product2.jpg' },
  { id: 'shop-16', name: 'Sony Air 86',                 category: 'Smartphones',   price: 1593.86, image: '/images/smartphones/Product3.jpg' },
  { id: 'shop-17', name: 'Google Max 38',               category: 'Smartphones',   price: 2912.02, image: '/images/smartphones/Product4.jpg' },
  { id: 'shop-18', name: 'OnePlus Mini 93',             category: 'Smartphones',   price: 1009.82, image: '/images/smartphones/Product5.jpg' },
  { id: 'shop-19', name: 'Google Elite 12',             category: 'Smartphones',   price: 1254.22, image: '/images/smartphones/Product6.jpg' },
  { id: 'shop-20', name: 'Xiaomi Ultra 15',             category: 'Smartphones',   price: 2794.88, image: '/images/smartphones/Product7.jpg' },
  { id: 'shop-21', name: 'Sony Max 14',                 category: 'Smartphones',   price: 734.05,  image: '/images/smartphones/Product8.jpg' },
  { id: 'shop-22', name: 'Vivo Ultra 61',               category: 'Smartphones',   price: 1644.95, image: '/images/smartphones/Product9.jpg' },
  { id: 'shop-23', name: 'Xiaomi Max 16',               category: 'Smartphones',   price: 1851.71, image: '/images/smartphones/Product10.jpg' },
  { id: 'shop-24', name: 'Xiaomi Pro 28',               category: 'Smartphones',   price: 2813.73, image: '/images/smartphones/Product11.jpg' },
  { id: 'shop-25', name: 'Sony Max 13',                 category: 'Smartphones',   price: 1992.27, image: '/images/smartphones/Product12.jpg' },
  { id: 'shop-26', name: 'Xiaomi Premium 80',           category: 'Smartphones',   price: 1344.28, image: '/images/smartphones/Product13.jpg' },
  { id: 'shop-27', name: 'Jabra Mini 20',               category: 'Audio',         price: 1589.01, image: '/images/audio/Product1.jpg' },
  { id: 'shop-28', name: 'Apple Max 63',                category: 'Audio',         price: 1503.12, image: '/images/audio/Product2.jpg' },
  { id: 'shop-29', name: 'Beats Lite 30',               category: 'Audio',         price: 1652.18, image: '/images/audio/Product3.jpg' },
  { id: 'shop-30', name: 'Skullcandy Pro 83',           category: 'Audio',         price: 1867.33, image: '/images/audio/Product4.jpg' },
  { id: 'shop-31', name: 'Sennheiser Lite 20',          category: 'Audio',         price: 1835.78, image: '/images/audio/Product5.jpg' },
  { id: 'shop-32', name: 'Sony Ultra 69',               category: 'Audio',         price: 1605.36, image: '/images/audio/Product6.jpg' },
  { id: 'shop-33', name: 'Sennheiser Pro 75',           category: 'Audio',         price: 867.18,  image: '/images/audio/Product7.jpg' },
  { id: 'shop-34', name: 'Bose Pro 78',                 category: 'Audio',         price: 2800.25, image: '/images/audio/Product8.jpg' },
  { id: 'shop-35', name: 'Jabra Ultra 44',              category: 'Audio',         price: 1120.50, image: '/images/audio/Product9.jpg' },
  { id: 'shop-36', name: 'Beats Max 55',                category: 'Audio',         price: 980.00,  image: '/images/audio/Product10.jpg' },
  { id: 'shop-37', name: 'Sony Elite 32',               category: 'Audio',         price: 1450.75, image: '/images/audio/Product11.jpg' },
  { id: 'shop-38', name: 'Bose Air 21',                 category: 'Audio',         price: 2100.00, image: '/images/audio/Product12.jpg' },
  { id: 'shop-39', name: 'Sennheiser Max 90',           category: 'Audio',         price: 1750.00, image: '/images/audio/Product13.jpg' },
  { id: 'shop-40', name: 'Apple Watch Pro 1',           category: 'Wearables',     price: 799.99,  image: '/images/wearables/Product1.jpg' },
  { id: 'shop-41', name: 'Samsung Band 2',              category: 'Wearables',     price: 249.99,  image: '/images/wearables/Product2.jpg' },
  { id: 'shop-42', name: 'Fitbit Ultra 3',              category: 'Wearables',     price: 349.99,  image: '/images/wearables/Product3.jpg' },
  { id: 'shop-43', name: 'Garmin Elite 4',              category: 'Wearables',     price: 599.99,  image: '/images/wearables/Product4.jpg' },
  { id: 'shop-44', name: 'Apple Watch SE 5',            category: 'Wearables',     price: 499.99,  image: '/images/wearables/Product5.jpg' },
  { id: 'shop-45', name: 'Samsung Watch 6',             category: 'Wearables',     price: 399.99,  image: '/images/wearables/Product6.jpg' },
  { id: 'shop-46', name: 'Fitbit Charge 7',             category: 'Wearables',     price: 179.99,  image: '/images/wearables/Product7.jpg' },
  { id: 'shop-47', name: 'Garmin Fenix 8',              category: 'Wearables',     price: 899.99,  image: '/images/wearables/Product8.jpg' },
  { id: 'shop-48', name: 'Apple Watch Ultra 9',         category: 'Wearables',     price: 999.99,  image: '/images/wearables/Product9.jpg' },
  { id: 'shop-49', name: 'Samsung Gear 10',             category: 'Wearables',     price: 299.99,  image: '/images/wearables/Product10.jpg' },
  { id: 'shop-50', name: 'Fitbit Sense 11',             category: 'Wearables',     price: 279.99,  image: '/images/wearables/Product11.jpg' },
  { id: 'shop-51', name: 'Garmin Venu 12',              category: 'Wearables',     price: 449.99,  image: '/images/wearables/Product12.jpg' },
  { id: 'shop-52', name: 'Apple Band 13',               category: 'Wearables',     price: 149.99,  image: '/images/wearables/Product13.jpg' },
  { id: 'shop-53', name: 'Canon EOS R1',                category: 'Cameras',       price: 2499.99, image: '/images/cameras/Product1.jpg' },
  { id: 'shop-54', name: 'Sony Alpha A2',               category: 'Cameras',       price: 1999.99, image: '/images/cameras/Product2.jpg' },
  { id: 'shop-55', name: 'Nikon Z9 3',                  category: 'Cameras',       price: 3499.99, image: '/images/cameras/Product3.jpg' },
  { id: 'shop-56', name: 'Canon PowerShot 4',           category: 'Cameras',       price: 599.99,  image: '/images/cameras/Product4.jpg' },
  { id: 'shop-57', name: 'Sony ZV-E5',                  category: 'Cameras',       price: 999.99,  image: '/images/cameras/Product5.jpg' },
  { id: 'shop-58', name: 'Nikon D850 6',                category: 'Cameras',       price: 2799.99, image: '/images/cameras/Product6.jpg' },
  { id: 'shop-59', name: 'Canon M50 7',                 category: 'Cameras',       price: 849.99,  image: '/images/cameras/Product7.jpg' },
  { id: 'shop-60', name: 'Sony A7 IV 8',                category: 'Cameras',       price: 2499.99, image: '/images/cameras/Product8.jpg' },
  { id: 'shop-61', name: 'Nikon Z6 9',                  category: 'Cameras',       price: 1999.99, image: '/images/cameras/Product9.jpg' },
  { id: 'shop-62', name: 'Canon R6 10',                 category: 'Cameras',       price: 2299.99, image: '/images/cameras/Product10.jpg' },
  { id: 'shop-63', name: 'Sony A6400 11',               category: 'Cameras',       price: 899.99,  image: '/images/cameras/Product11.jpg' },
  { id: 'shop-64', name: 'Nikon Z50 12',                category: 'Cameras',       price: 799.99,  image: '/images/cameras/Product12.jpg' },
  { id: 'shop-65', name: 'Canon R50 13',                category: 'Cameras',       price: 679.99,  image: '/images/cameras/Product13.jpg' },
];

function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState('All Products');
  const [priceFrom, setPriceFrom] = useState('');
  const [priceTo, setPriceTo] = useState('');
  const [appliedFilters, setAppliedFilters] = useState({ category: 'All Products', priceFrom: '', priceTo: '', search: '' });
  const [sortBy, setSortBy] = useState('default');
  // Track which product IDs were just added for visual feedback
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const category = searchParams.get('category') || 'All Products';
    const from = searchParams.get('priceFrom') || '';
    const to = searchParams.get('priceTo') || '';
    const search = searchParams.get('search') || '';
    setSelectedCategory(category);
    setPriceFrom(from);
    setPriceTo(to);
    setAppliedFilters({ category, priceFrom: from, priceTo: to, search });
  }, [searchParams]);

  const filteredProducts = useMemo(() => {
    return productData
      .filter((product) => {
        // Search filter
        if (appliedFilters.search) {
          const q = appliedFilters.search.toLowerCase();
          if (!product.name.toLowerCase().includes(q) && !product.category.toLowerCase().includes(q)) return false;
        }
        if (appliedFilters.category !== 'All Products' && product.category !== appliedFilters.category) return false;
        if (appliedFilters.priceFrom) {
          const min = Number(appliedFilters.priceFrom);
          if (!Number.isNaN(min) && product.price < min) return false;
        }
        if (appliedFilters.priceTo) {
          const max = Number(appliedFilters.priceTo);
          if (!Number.isNaN(max) && product.price > max) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'latest') return b.id.localeCompare(a.id);
        if (sortBy === 'popularity') return a.id.localeCompare(b.id);
        if (sortBy === 'rating') return a.name.localeCompare(b.name);
        return 0;
      });
  }, [appliedFilters, sortBy]);

  const handleApplyFilters = () => {
    setAppliedFilters({ category: selectedCategory, priceFrom, priceTo, search: '' });
    const params = new URLSearchParams();
    if (selectedCategory && selectedCategory !== 'All Products') params.set('category', selectedCategory);
    if (priceFrom) params.set('priceFrom', priceFrom);
    if (priceTo) params.set('priceTo', priceTo);
    setSearchParams(params);
  };

  const handleAddToCart = (product: ProductItem) => {
    let cartItems: { id: string; name: string; price: number; image: string; category: string; qty: number }[] = [];
    try { cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]'); } catch { cartItems = []; }
    const idx = cartItems.findIndex((i) => i.id === product.id);
    if (idx > -1) {
      cartItems[idx].qty++;
    } else {
      cartItems.push({ id: product.id, name: product.name, price: product.price, image: product.image, category: product.category, qty: 1 });
    }
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    window.dispatchEvent(new Event('cartUpdated'));
    // Visual feedback
    setAddedIds((prev) => new Set(prev).add(product.id));
    setTimeout(() => {
      setAddedIds((prev) => { const next = new Set(prev); next.delete(product.id); return next; });
    }, 1500);
  };

  return (
    <main className="page">
      <section className="shop-hero">
        <h1>Our Products</h1>
        <p>Explore the best tech on the market.</p>
      </section>

      <section className="shop-layout">
        <aside className="shop-sidebar-card">
          <h3>Filters</h3>
          <div className="shop-filter-section">
            <h4>Categories</h4>
            {['All Products', 'Laptops & PCs', 'Smartphones', 'Audio', 'Wearables', 'Cameras'].map((category) => (
              <label key={category} className="shop-filter-label">
                <input
                  type="radio"
                  name="category"
                  value={category}
                  checked={selectedCategory === category}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="shop-filter-radio"
                />
                {category}
              </label>
            ))}
          </div>

          <div className="shop-filter-section">
            <h4>Price Range</h4>
            <div className="shop-price-row">
              <input
                type="number"
                placeholder="Min"
                className="shop-price-input"
                value={priceFrom}
                onChange={(e) => setPriceFrom(e.target.value)}
              />
              <span>-</span>
              <input
                type="number"
                placeholder="Max"
                className="shop-price-input"
                value={priceTo}
                onChange={(e) => setPriceTo(e.target.value)}
              />
            </div>
          </div>

          <button type="button" className="btn border-button" onClick={handleApplyFilters}>
            Apply Filters
          </button>
        </aside>

        <div>
          <div className="shop-results-bar">
            <p className="shop-result-count">
              Showing {filteredProducts.length} result{filteredProducts.length !== 1 ? 's' : ''}
              {appliedFilters.search ? ` for "${appliedFilters.search}"` : ''}
            </p>
            <select
              className="shop-sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="default">Default Sorting</option>
              <option value="popularity">Sort by Popularity</option>
              <option value="rating">Sort by Average Rating</option>
              <option value="latest">Sort by Latest</option>
              <option value="price-asc">Sort by Price: Low to High</option>
              <option value="price-desc">Sort by Price: High to Low</option>
            </select>
          </div>

          <div className="card-container shop-grid">
            {filteredProducts.map((product) => {
              const isAdded = addedIds.has(product.id);
              return (
                <article key={product.id} className="card" data-category={product.category}>
                  <Link to="/product">
                    <img src={product.image} alt={product.name} />
                  </Link>
                  <div className="card-body">
                    <Link to="/product">{product.name}</Link>
                    <span className="category-tag">{product.category}</span>
                    <div className="price-row">
                      <span className="price">${product.price.toFixed(2)}</span>
                      <button
                        type="button"
                        className={isAdded ? 'btn add-btn-added-green' : 'btn add-btn'}
                        aria-label="Add to cart"
                        onClick={() => handleAddToCart(product)}
                      >
                        <i className={`fas ${isAdded ? 'fa-check' : 'fa-plus'}`}></i>
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}

export default Shop;
