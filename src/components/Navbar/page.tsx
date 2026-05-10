import { useEffect, useRef, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

const getCartCount = (): number => {
  try {
    const items: { qty: number }[] = JSON.parse(localStorage.getItem('cartItems') || '[]');
    return items.reduce((sum, item) => sum + item.qty, 0);
  } catch {
    return 0;
  }
};

function Navbar() {
  const [menuOpen, setMenuOpen]       = useState(false);
  const [searchOpen, setSearchOpen]   = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [cartCount, setCartCount]     = useState(getCartCount);
  const searchInputRef                = useRef<HTMLInputElement>(null);
  const navigate                      = useNavigate();
  const activeClass = ({ isActive }: { isActive: boolean }) => (isActive ? 'active' : '');

  const toggleMenu  = () => setMenuOpen((o) => !o);
  const closeMenu   = () => setMenuOpen(false);

  const openSearch  = (e: React.MouseEvent) => {
    e.preventDefault();
    setSearchOpen(true);
    setTimeout(() => searchInputRef.current?.focus(), 50);
  };
  const closeSearch = () => { setSearchOpen(false); setSearchQuery(''); };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (q) {
      closeSearch();
      navigate(`/shop?search=${encodeURIComponent(q)}`);
    }
  };

  // Close search on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeSearch();
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        searchOpen ? closeSearch() : setSearchOpen(true);
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [searchOpen]);

  // Cart badge sync
  useEffect(() => {
    const update = () => setCartCount(getCartCount());
    window.addEventListener('cartUpdated', update);
    window.addEventListener('storage', update);
    return () => {
      window.removeEventListener('cartUpdated', update);
      window.removeEventListener('storage', update);
    };
  }, []);

  return (
    <>
      <header>
        <nav>
          <NavLink to="/" className="nav-logo-link" onClick={closeMenu}>
            <div className="nav-logo-box">TH</div>
            <span className="nav-logo-text">TechHaven</span>
          </NavLink>

          <button
            type="button"
            className="menu-toggle"
            aria-expanded={menuOpen}
            aria-label="Toggle navigation menu"
            onClick={toggleMenu}
          >
            <i className="fas fa-bars" aria-hidden="true" />
          </button>

          <ul className={menuOpen ? 'open' : ''}>
            <li><NavLink to="/" end className={activeClass} onClick={closeMenu}>Home</NavLink></li>
            <li><NavLink to="/shop" className={activeClass} onClick={closeMenu}>Shop</NavLink></li>
            <li><NavLink to="/contact" className={activeClass} onClick={closeMenu}>Contact</NavLink></li>
            <li><NavLink to="/dashboard" className={activeClass} onClick={closeMenu}>Dashboard</NavLink></li>
            <li className="nav-icons-item">
              {/* Search */}
              <a href="#" aria-label="Search" onClick={openSearch}>
                <i className="fas fa-search" aria-hidden="true" />
              </a>
              {/* User */}
              <NavLink to="/login" className={activeClass} onClick={closeMenu} aria-label="User account">
                <i className="fas fa-user" aria-hidden="true" />
              </NavLink>
              {/* Cart with badge */}
              <NavLink to="/cart" className="nav-cart-link" onClick={closeMenu} aria-label="View cart">
                <i className="fas fa-shopping-cart" aria-hidden="true" />
                {cartCount > 0 && (
                  <span className="nav-cart-badge">{cartCount}</span>
                )}
              </NavLink>
            </li>
          </ul>
        </nav>
      </header>

      {/* ── Search Overlay ── */}
      {searchOpen && (
        <div className="search-overlay" role="dialog" aria-modal="true" aria-label="Search">
          {/* Backdrop */}
          <div className="search-overlay-backdrop" onClick={closeSearch} />

          {/* Box */}
          <div className="search-overlay-box">
            <form className="search-overlay-form" onSubmit={handleSearchSubmit} autoComplete="off">
              <span className="search-overlay-icon"><i className="fas fa-search" /></span>
              <input
                ref={searchInputRef}
                type="text"
                className="search-overlay-input"
                placeholder="Search products..."
                aria-label="Search products"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                type="button"
                className="search-overlay-close"
                aria-label="Close search"
                onClick={closeSearch}
              >
                <i className="fas fa-times" />
              </button>
            </form>
            <p className="search-overlay-hint">Press Enter to search · Esc to close</p>
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;
