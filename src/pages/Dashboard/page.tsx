import { useEffect, useMemo, useRef, useState } from 'react';
import { Chart, BarElement, ArcElement, CategoryScale, LinearScale, Tooltip, Legend, DoughnutController, BarController } from 'chart.js';
Chart.register(BarController, DoughnutController, BarElement, ArcElement, CategoryScale, LinearScale, Tooltip, Legend);

//  Types 
interface AdminAccount { username: string; email: string; password: string; }
interface AdminSession { username: string; email: string; expiresAt: number; }
interface Product { id: string; name: string; category: string; brand: string; price: number; stock: number; rating: number; available: boolean; image: string; }

//  Storage keys 
const ACCOUNTS_KEY = 'adminAccounts';
const SESSION_KEY  = 'adminSession';
const STOCK_KEY    = 'techhavenStock';
const SESSION_7D   = 7 * 24 * 60 * 60 * 1000;

//  Auth helpers 
const readAccounts  = (): AdminAccount[] => { try { return JSON.parse(localStorage.getItem(ACCOUNTS_KEY) || '[]'); } catch { return []; } };
const writeAccounts = (a: AdminAccount[]) => localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(a));
const writeSession  = (s: AdminSession)   => localStorage.setItem(SESSION_KEY,  JSON.stringify(s));
const clearSession  = ()                  => localStorage.removeItem(SESSION_KEY);
const readSession   = (): AdminSession | null => { try { return JSON.parse(localStorage.getItem(SESSION_KEY) || 'null'); } catch { return null; } };
const isAuthenticated = (): boolean => {
  const s = readSession();
  if (!s) return false;
  if (s.expiresAt === Infinity || (s.expiresAt as unknown as string) === 'Infinity') return true;
  if (Date.now() > s.expiresAt) { clearSession(); return false; }
  return true;
};

//  Stock helpers 
function uuid() { return Date.now().toString(36) + Math.random().toString(36).slice(2); }

const SEED_PRODUCTS: Omit<Product, 'id'>[] = [
  { name: 'Apple Elite 14',    category: 'Laptops & PCs', brand: 'Apple',      price: 1663.85, stock: 12, rating: 4.5, available: true,  image: '/images/laptops/Product1.jpg' },
  { name: 'MSI Premium 70',    category: 'Laptops & PCs', brand: 'MSI',        price: 938.84,  stock: 8,  rating: 4.2, available: true,  image: '/images/laptops/Product2.jpg' },
  { name: 'Asus Advanced 98',  category: 'Laptops & PCs', brand: 'Asus',       price: 1026.02, stock: 3,  rating: 4.0, available: true,  image: '/images/laptops/Product3.jpg' },
  { name: 'Oppo Elite 19',     category: 'Smartphones',   brand: 'Oppo',       price: 981.51,  stock: 15, rating: 4.3, available: true,  image: '/images/smartphones/Product1.jpg' },
  { name: 'Apple Max 93',      category: 'Smartphones',   brand: 'Apple',      price: 2935.31, stock: 6,  rating: 4.8, available: true,  image: '/images/smartphones/Product2.jpg' },
  { name: 'Sony Air 86',       category: 'Smartphones',   brand: 'Sony',       price: 1593.86, stock: 2,  rating: 4.1, available: true,  image: '/images/smartphones/Product3.jpg' },
  { name: 'Jabra Mini 20',     category: 'Audio',         brand: 'Jabra',      price: 1589.01, stock: 9,  rating: 4.4, available: true,  image: '/images/audio/Product1.jpg' },
  { name: 'Skullcandy Pro 83', category: 'Audio',         brand: 'Skullcandy', price: 1867.33, stock: 1,  rating: 3.9, available: true,  image: '/images/audio/Product4.jpg' },
  { name: 'Bose Pro 78',       category: 'Audio',         brand: 'Bose',       price: 2800.25, stock: 7,  rating: 4.7, available: true,  image: '/images/audio/Product8.jpg' },
  { name: 'Apple Watch Pro 1', category: 'Wearables',     brand: 'Apple',      price: 799.99,  stock: 11, rating: 4.6, available: true,  image: '/images/wearables/Product1.jpg' },
  { name: 'Garmin Elite 4',    category: 'Wearables',     brand: 'Garmin',     price: 599.99,  stock: 4,  rating: 4.2, available: true,  image: '/images/wearables/Product4.jpg' },
  { name: 'Canon EOS R1',      category: 'Cameras',       brand: 'Canon',      price: 2499.99, stock: 5,  rating: 4.9, available: true,  image: '/images/cameras/Product1.jpg' },
  { name: 'Nikon D850 6',      category: 'Cameras',       brand: 'Nikon',      price: 2799.99, stock: 2,  rating: 4.7, available: true,  image: '/images/cameras/Product6.jpg' },
  { name: 'Sony Alpha A2',     category: 'Cameras',       brand: 'Sony',       price: 1999.99, stock: 0,  rating: 4.5, available: false, image: '/images/cameras/Product2.jpg' },
  { name: 'Fitbit Ultra 3',    category: 'Wearables',     brand: 'Fitbit',     price: 349.99,  stock: 18, rating: 4.0, available: true,  image: '/images/wearables/Product3.jpg' },
];

function getProducts(): Product[] {
  try {
    const raw = localStorage.getItem(STOCK_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* fall through */ }
  const seeded = SEED_PRODUCTS.map(p => ({ ...p, id: uuid() }));
  localStorage.setItem(STOCK_KEY, JSON.stringify(seeded));
  return seeded;
}
function saveProducts(products: Product[]) { localStorage.setItem(STOCK_KEY, JSON.stringify(products)); }

//  KPI computation 
function computeKPIs(products: Product[]) {
  const total = products.length;
  const totalStock = products.reduce((s, p) => s + p.stock, 0);
  const outOfStock = products.filter(p => p.stock === 0).length;
  const totalValue = products.reduce((s, p) => s + p.price * p.stock, 0);
  const lowStock = products.filter(p => p.stock > 0 && p.stock <= 5);
  return { total, totalStock, outOfStock, totalValue, lowStock };
}

//  Charts 
const CATS   = ['Laptops & PCs', 'Smartphones', 'Audio', 'Wearables', 'Cameras'];
const COLORS = ['#2563eb', '#16a34a', '#d97706', '#dc2626', '#7c3aed'];

function DashboardCharts({ products }: { products: Product[] }) {
  const barRef     = useRef<HTMLCanvasElement>(null);
  const doughRef   = useRef<HTMLCanvasElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const barInst    = useRef<Chart<any> | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const doughInst  = useRef<Chart<any> | null>(null);

  useEffect(() => {
    const perCatCount = CATS.map(c => products.filter(p => p.category === c).length);
    const perCatStock = CATS.map(c => products.filter(p => p.category === c).reduce((s, p) => s + p.stock, 0));

    if (barRef.current) {
      barInst.current?.destroy();
      barInst.current = new Chart(barRef.current, {
        type: 'bar',
        data: { labels: CATS, datasets: [{ label: 'Products', data: perCatCount, backgroundColor: COLORS, borderRadius: 6, borderSkipped: false as const }] },
        options: {
          responsive: true,
          plugins: { legend: { display: false }, tooltip: { backgroundColor: '#0f172a', padding: 10, cornerRadius: 8 } },
          scales: {
            y: { beginAtZero: true, ticks: { color: '#94a3b8', font: { size: 11 } }, grid: { color: '#f1f5f9' } },
            x: { ticks: { color: '#64748b', font: { size: 11 } }, grid: { display: false } },
          },
        },
      });
    }

    if (doughRef.current) {
      doughInst.current?.destroy();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      doughInst.current = new Chart(doughRef.current, {
        type: 'doughnut',
        data: { labels: CATS, datasets: [{ data: perCatStock, backgroundColor: COLORS, borderWidth: 3, borderColor: '#fff', hoverOffset: 6 }] },
        options: {
          responsive: true,
          cutout: '65%',
          plugins: {
            legend: { position: 'bottom', labels: { padding: 14, font: { size: 11 }, color: '#334155', usePointStyle: true, pointStyleWidth: 8 } },
            tooltip: { backgroundColor: '#0f172a', padding: 10, cornerRadius: 8 },
          },
        },
      } as any);
    }

    return () => { barInst.current?.destroy(); doughInst.current?.destroy(); };
  }, [products]);

  return (
    <div className="charts-grid">
      <div className="chart-card">
        <div className="chart-card-header">
          <h3 className="chart-card-title chart-card-title-blue">
            <i className="fas fa-chart-bar"></i> Products by Category
          </h3>
        </div>
        <canvas ref={barRef} aria-label="Products per category"></canvas>
      </div>
      <div className="chart-card">
        <div className="chart-card-header">
          <h3 className="chart-card-title chart-card-title-purple">
            <i className="fas fa-chart-pie"></i> Stock Distribution
          </h3>
        </div>
        <canvas ref={doughRef} aria-label="Stock units per category"></canvas>
      </div>
    </div>
  );
}

//  Stock badge 
function StockBadge({ stock }: { stock: number }) {
  if (stock === 0) return <span className="stock-badge-out">Out of Stock</span>;
  if (stock <= 5)  return <span className="stock-badge-low"><i className="fas fa-exclamation-triangle"></i> {stock} left</span>;
  return <span className="stock-badge-ok">{stock} in stock</span>;
}

//  Admin Shell 
type AdminView = 'home' | 'stock' | 'stockForm' | 'cart';

const PAGE_SIZE = 10;

function AdminShell({ onLogout }: { onLogout: () => void }) {
  const session = readSession()!;
  const [view, setView]           = useState<AdminView>('home');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [products, setProducts]   = useState<Product[]>(getProducts);
  const [notification, setNotification] = useState('');

  // Stock list state
  const [searchQ, setSearchQ]     = useState('');
  const [catFilter, setCatFilter] = useState('');
  const [page, setPage]           = useState(1);

  // Stock form state
  const [editId, setEditId]       = useState<string | null>(null);
  const [fName, setFName]         = useState('');
  const [fCat, setFCat]           = useState('');
  const [fBrand, setFBrand]       = useState('');
  const [fPrice, setFPrice]       = useState('');
  const [fStock, setFStock]       = useState('');
  const [fRating, setFRating]     = useState('');
  const [fImage, setFImage]       = useState('');
  const [fAvail, setFAvail]       = useState(true);
  const [formError, setFormError] = useState('');

  const navigate = (v: AdminView) => { setView(v); setSidebarOpen(false); };

  const showNotif = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 4000);
  };

  const openAddForm = () => {
    setEditId(null); setFName(''); setFCat(''); setFBrand('');
    setFPrice(''); setFStock(''); setFRating(''); setFImage(''); setFAvail(true); setFormError('');
    navigate('stockForm');
  };

  const openEditForm = (p: Product) => {
    setEditId(p.id); setFName(p.name); setFCat(p.category); setFBrand(p.brand);
    setFPrice(String(p.price)); setFStock(String(p.stock)); setFRating(String(p.rating));
    setFImage(p.image); setFAvail(p.available); setFormError('');
    navigate('stockForm');
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fName.trim()) { setFormError('Product name is required.'); return; }
    if (!fCat)         { setFormError('Category is required.'); return; }
    if (!fBrand.trim()){ setFormError('Brand is required.'); return; }
    if (!fPrice)       { setFormError('Price is required.'); return; }
    if (!fStock)       { setFormError('Stock quantity is required.'); return; }

    const updated = [...products];
    if (editId) {
      const idx = updated.findIndex(p => p.id === editId);
      if (idx > -1) updated[idx] = { id: editId, name: fName.trim(), category: fCat, brand: fBrand.trim(), price: parseFloat(fPrice), stock: parseInt(fStock), rating: parseFloat(fRating) || 0, available: fAvail, image: fImage.trim() };
    } else {
      updated.push({ id: uuid(), name: fName.trim(), category: fCat, brand: fBrand.trim(), price: parseFloat(fPrice), stock: parseInt(fStock), rating: parseFloat(fRating) || 0, available: fAvail, image: fImage.trim() });
    }
    saveProducts(updated);
    setProducts(updated);
    showNotif(editId ? 'Product updated successfully.' : 'Product added successfully.');
    navigate('stock');
  };

  const handleDelete = (id: string, name: string) => {
    if (!window.confirm(`Delete "${name}"?`)) return;
    const updated = products.filter(p => p.id !== id);
    saveProducts(updated);
    setProducts(updated);
    showNotif('Product deleted.');
  };

  // Filtered + paginated stock list
  const filtered = useMemo(() => {
    return products.filter(p => {
      const q = searchQ.toLowerCase();
      if (q && !p.name.toLowerCase().includes(q) && !p.brand.toLowerCase().includes(q)) return false;
      if (catFilter && p.category !== catFilter) return false;
      return true;
    });
  }, [products, searchQ, catFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const kpi = computeKPIs(products);
  const titles: Record<AdminView, string> = { home: 'Dashboard', stock: 'Stock Management', stockForm: editId ? 'Edit Product' : 'Add Product', cart: 'Cart View' };

  return (
    <div className="admin-wrap">
      <div className={`sidebar-overlay${sidebarOpen ? ' active' : ''}`} onClick={() => setSidebarOpen(false)} />

      <aside className={`admin-sidebar${sidebarOpen ? ' sidebar-open' : ''}`} aria-label="Admin navigation">
        <div className="admin-sidebar-header">
          <div className="admin-logo">TH</div>
          <div>
            <p className="admin-brand-name">TechHaven</p>
            <p className="admin-brand-sub">Admin Panel</p>
          </div>
        </div>
        <nav>
          <span className="sidebar-section-label">Main</span>
          <a href="#" className={view === 'home' ? 'active' : ''} onClick={e => { e.preventDefault(); navigate('home'); }}><i className="fas fa-tachometer-alt"></i> Dashboard</a>
          <span className="sidebar-section-label">Inventory</span>
          <a href="#" className={view === 'stock' ? 'active' : ''} onClick={e => { e.preventDefault(); navigate('stock'); }}><i className="fas fa-boxes"></i> All Products</a>
          <a href="#" className={view === 'stockForm' && !editId ? 'active' : ''} onClick={e => { e.preventDefault(); openAddForm(); }}><i className="fas fa-plus-circle"></i> Add Product</a>
          <span className="sidebar-section-label">Store</span>
          <a href="#" className={view === 'cart' ? 'active' : ''} onClick={e => { e.preventDefault(); navigate('cart'); }}><i className="fas fa-shopping-cart"></i> Cart View</a>
          <a href="/shop"><i className="fas fa-store"></i> Visit Store</a>
          <a href="/"><i className="fas fa-home"></i> Homepage</a>
        </nav>
        <div className="admin-sidebar-footer">
          <button type="button" className="admin-logout-btn" onClick={onLogout}><i className="fas fa-sign-out-alt"></i> Sign Out</button>
        </div>
      </aside>

      <div className="admin-main">
        <div className="admin-topbar">
          <div className="admin-topbar-left">
            <button type="button" className="sidebar-toggle" aria-label="Toggle sidebar" onClick={() => setSidebarOpen(o => !o)}><i className="fas fa-bars"></i></button>
            <h2 className="admin-topbar-title">{titles[view]}</h2>
          </div>
          <div className="admin-topbar-right">
            <a href="/shop" className="topbar-icon-btn" title="Visit Store"><i className="fas fa-store"></i></a>
            <div className="topbar-user-pill">
              <div className="topbar-avatar">{session.username.charAt(0).toUpperCase()}</div>
              <span className="topbar-username">{session.username}</span>
            </div>
            <button type="button" className="topbar-logout-btn" onClick={onLogout}><i className="fas fa-sign-out-alt"></i> Logout</button>
          </div>
        </div>

        <div className="admin-content">
          {/*  HOME VIEW  */}
          {view === 'home' && (
            <div>
              <div className="admin-welcome-banner">
                <div>
                  <h2>Welcome back, {session.username}</h2>
                  <p>Here is what is happening with your inventory today.</p>
                </div>
                <a href="#" className="admin-welcome-btn" onClick={e => { e.preventDefault(); openAddForm(); }}>
                  <i className="fas fa-plus"></i> Add New Product
                </a>
              </div>

              <div className="kpi-grid">
                <div className="kpi-card kpi-blue">
                  <div className="kpi-icon kpi-blue"><i className="fas fa-box-open"></i></div>
                  <div className="kpi-content"><p className="kpi-value">{kpi.total}</p><p className="kpi-label">Total Products</p></div>
                </div>
                <div className="kpi-card kpi-green">
                  <div className="kpi-icon kpi-green"><i className="fas fa-cubes"></i></div>
                  <div className="kpi-content"><p className="kpi-value">{kpi.totalStock.toLocaleString()}</p><p className="kpi-label">Stock Units</p></div>
                </div>
                <div className="kpi-card kpi-red">
                  <div className="kpi-icon kpi-red"><i className="fas fa-times-circle"></i></div>
                  <div className="kpi-content"><p className="kpi-value">{kpi.outOfStock}</p><p className="kpi-label">Out of Stock</p></div>
                </div>
                <div className="kpi-card kpi-amber">
                  <div className="kpi-icon kpi-amber"><i className="fas fa-dollar-sign"></i></div>
                  <div className="kpi-content"><p className="kpi-value">${(kpi.totalValue / 1000).toFixed(1)}K</p><p className="kpi-label">Inventory Value</p></div>
                </div>
              </div>

              <DashboardCharts products={products} />

              <div className="dash-section-header">
                <h3 className="section-title section-title-amber"><i className="fas fa-bolt"></i> Quick Actions</h3>
              </div>
              <div className="quick-actions-grid">
                <a href="#" className="quick-action-card" onClick={e => { e.preventDefault(); navigate('stock'); }}><i className="fas fa-boxes"></i><span>View All Stock</span></a>
                <a href="#" className="quick-action-card" onClick={e => { e.preventDefault(); openAddForm(); }}><i className="fas fa-plus-circle"></i><span>Add New Product</span></a>
                <a href="#" className="quick-action-card" onClick={e => { e.preventDefault(); navigate('cart'); }}><i className="fas fa-shopping-cart"></i><span>View Cart</span></a>
                <a href="/shop" className="quick-action-card"><i className="fas fa-store"></i><span>Visit Store</span></a>
              </div>

              <div className="dash-section-header">
                <h3 className="section-title section-title-amber"><i className="fas fa-exclamation-triangle"></i> Low Stock Alerts</h3>
                <a href="#" className="section-link" onClick={e => { e.preventDefault(); navigate('stock'); }}>View all</a>
              </div>
              <div className="alert-table">
                {kpi.lowStock.length === 0 ? (
                  <div className="alert-table-empty"><i className="dash-all-good-icon"></i><strong>All good!</strong> No products are running low.</div>
                ) : (
                  <table>
                    <thead><tr><th>Product</th><th>Category</th><th>Brand</th><th>Stock</th><th>Action</th></tr></thead>
                    <tbody>
                      {kpi.lowStock.map(p => (
                        <tr key={p.id}>
                          <td className="stock-product-name">{p.name}</td>
                          <td><span className="category-tag">{p.category}</span></td>
                          <td>{p.brand}</td>
                          <td><StockBadge stock={p.stock} /></td>
                          <td><a href="#" className="edit-product-btn" onClick={e => { e.preventDefault(); openEditForm(p); }}><i className="fas fa-edit"></i> Update</a></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}

          {/*  STOCK LIST VIEW  */}
          {view === 'stock' && (
            <div>
              {notification && <div className="notification-bar success"><i className="fas fa-check-circle"></i><span>{notification}</span></div>}
              <div className="admin-search-bar">
                <input type="text" placeholder="Search by name or brand..." value={searchQ} onChange={e => { setSearchQ(e.target.value); setPage(1); }} />
                <select value={catFilter} onChange={e => { setCatFilter(e.target.value); setPage(1); }}>
                  <option value="">All Categories</option>
                  <option>Laptops &amp; PCs</option>
                  <option>Smartphones</option>
                  <option>Audio</option>
                  <option>Wearables</option>
                  <option>Cameras</option>
                </select>
              </div>
              <div className="table-wrapper">
                <table className="stock-table">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Category</th>
                      <th>Brand</th>
                      <th>Price</th>
                      <th>Stock</th>
                      <th>Available</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pageItems.length === 0 ? (
                      <tr><td colSpan={7} className="table-empty">No products found.</td></tr>
                    ) : pageItems.map(p => (
                      <tr key={p.id}>
                        <td className="stock-product-name">{p.name}</td>
                        <td><span className="category-tag">{p.category}</span></td>
                        <td>{p.brand}</td>
                        <td>${p.price.toFixed(2)}</td>
                        <td><StockBadge stock={p.stock} /></td>
                        <td className={p.available ? 'status-available' : 'status-unavailable'}>{p.available ? 'Yes' : 'No'}</td>
                        <td>
                          <div className="action-btns">
                            <button type="button" className="btn-edit" onClick={() => openEditForm(p)}><i className="fas fa-edit"></i> Edit</button>
                            <button type="button" className="btn-delete" onClick={() => handleDelete(p.id, p.name)}><i className="fas fa-trash"></i> Delete</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="pagination">
                  <span className="pagination-info">Showing {Math.min((page - 1) * PAGE_SIZE + 1, filtered.length)}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}</span>
                  <div className="pagination-controls">
                    <button className="page-btn" disabled={page === 1} onClick={() => setPage(p => p - 1)}><i className="fas fa-chevron-left"></i></button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                      <button key={n} className={`page-btn${n === page ? ' active' : ''}`} onClick={() => setPage(n)}>{n}</button>
                    ))}
                    <button className="page-btn" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}><i className="fas fa-chevron-right"></i></button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/*  STOCK FORM VIEW  */}
          {view === 'stockForm' && (
            <div className="form-card">
              {formError && <div className="error-banner visible"><i className="fas fa-exclamation-circle"></i><span>{formError}</span></div>}
              <form onSubmit={handleSave}>
                <div className="form-grid">
                  <div className="form-field full-width">
                    <label>Product Name <span className="required-star">*</span></label>
                    <input type="text" placeholder="e.g. Apple MacBook Pro 14" value={fName} onChange={e => setFName(e.target.value)} required />
                  </div>
                  <div className="form-field">
                    <label>Category <span className="required-star">*</span></label>
                    <select value={fCat} onChange={e => setFCat(e.target.value)} required>
                      <option value="">Select category...</option>
                      <option>Laptops &amp; PCs</option>
                      <option>Smartphones</option>
                      <option>Audio</option>
                      <option>Wearables</option>
                      <option>Cameras</option>
                    </select>
                  </div>
                  <div className="form-field">
                    <label>Brand <span className="required-star">*</span></label>
                    <input type="text" placeholder="e.g. Apple" value={fBrand} onChange={e => setFBrand(e.target.value)} required />
                  </div>
                  <div className="form-field">
                    <label>Price ($) <span className="required-star">*</span></label>
                    <input type="number" placeholder="0.00" min={0} step={0.01} value={fPrice} onChange={e => setFPrice(e.target.value)} required />
                  </div>
                  <div className="form-field">
                    <label>Stock Quantity <span className="required-star">*</span></label>
                    <input type="number" placeholder="0" min={0} step={1} value={fStock} onChange={e => setFStock(e.target.value)} required />
                  </div>
                  <div className="form-field">
                    <label>Rating (0–5)</label>
                    <input type="number" placeholder="4.5" min={0} max={5} step={0.1} value={fRating} onChange={e => setFRating(e.target.value)} />
                  </div>
                  <div className="form-field full-width">
                    <label>Image Path</label>
                    <input type="text" placeholder="e.g. /images/laptops/Product1.jpg" value={fImage} onChange={e => setFImage(e.target.value)} />
                  </div>
                  <div className="form-field full-width">
                    <div className="checkbox-row">
                      <input type="checkbox" id="f-available" checked={fAvail} onChange={e => setFAvail(e.target.checked)} />
                      <label htmlFor="f-available">Available for purchase</label>
                    </div>
                  </div>
                </div>
                <div className="form-actions">
                  <button type="submit" className="btn lg-button"><i className="fas fa-save"></i> Save Product</button>
                  <button type="button" className="btn-outline-lg" onClick={() => navigate('stock')}><i className="fas fa-times"></i> Cancel</button>
                </div>
              </form>
            </div>
          )}

          {/*  CART VIEW  */}
          {view === 'cart' && (
            <div>
              <div className="read-only-badge"><i className="fas fa-eye"></i> Read-only — customer cart snapshot</div>
              {(() => {
                let items: { name: string; price: number; qty: number; image: string; category: string }[] = [];
                try { items = JSON.parse(localStorage.getItem('cartItems') || '[]'); } catch { items = []; }
                if (items.length === 0) return <div className="admin-empty-state dash-cart-empty"><i className="fas fa-shopping-cart"></i><h3>Cart is empty</h3><p>No items in the customer cart.</p></div>;
                const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
                return (
                  <div className="table-wrapper dash-cart-table-wrap">
                    <table className="stock-table">
                      <thead><tr><th>Product</th><th>Category</th><th>Unit Price</th><th>Qty</th><th>Total</th></tr></thead>
                      <tbody>
                        {items.map((item, i) => (
                          <tr key={i}>
                            <td className="stock-product-name">{item.name}</td>
                            <td><span className="category-tag">{item.category}</span></td>
                            <td>${item.price.toFixed(2)}</td>
                            <td>{item.qty}</td>
                            <td className="cart-total-price">${(item.price * item.qty).toFixed(2)}</td>
                          </tr>
                        ))}
                        <tr className="cart-subtotal-row">
                          <td colSpan={4} className="cart-subtotal-label">Subtotal</td>
                          <td className="cart-subtotal-value">${subtotal.toFixed(2)}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                );
              })()}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

//  Main Dashboard (auth gate) 
function Dashboard() {
  const [mode, setMode]       = useState<'login' | 'register'>('login');
  const [loggedIn, setLoggedIn] = useState(isAuthenticated);

  const [loginEmail, setLoginEmail]       = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [rememberMe, setRememberMe]       = useState(false);
  const [loginError, setLoginError]       = useState('');

  const [regUsername, setRegUsername] = useState('');
  const [regEmail, setRegEmail]       = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirm, setRegConfirm]   = useState('');
  const [regError, setRegError]       = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault(); setLoginError('');
    if (!loginEmail.trim()) { setLoginError('Email is required.'); return; }
    if (!loginPassword)     { setLoginError('Password is required.'); return; }
    const accounts = readAccounts();
    if (accounts.length === 0) {
      // Demo mode — accept any credentials
      writeSession({ username: loginEmail.split('@')[0], email: loginEmail.trim().toLowerCase(), expiresAt: rememberMe ? Date.now() + SESSION_7D : Infinity });
      setLoggedIn(true); return;
    }
    const account = accounts.find(a => a.email.toLowerCase() === loginEmail.trim().toLowerCase() && a.password === loginPassword);
    if (!account) { setLoginError('Invalid email or password.'); return; }
    writeSession({ username: account.username, email: account.email, expiresAt: rememberMe ? Date.now() + SESSION_7D : Infinity });
    setLoggedIn(true);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault(); setRegError('');
    if (!regUsername.trim())    { setRegError('Full name is required.'); return; }
    if (!regEmail.trim())       { setRegError('Email is required.'); return; }
    if (!regPassword)           { setRegError('Password is required.'); return; }
    if (regPassword.length < 8) { setRegError('Password must be at least 8 characters.'); return; }
    if (regPassword !== regConfirm) { setRegError('Passwords do not match.'); return; }
    const accounts = readAccounts();
    if (accounts.some(a => a.email.toLowerCase() === regEmail.trim().toLowerCase())) { setRegError('An account with this email already exists.'); return; }
    accounts.push({ username: regUsername.trim(), email: regEmail.trim().toLowerCase(), password: regPassword });
    writeAccounts(accounts);
    setMode('login'); setLoginEmail(regEmail.trim().toLowerCase());
    setRegUsername(''); setRegEmail(''); setRegPassword(''); setRegConfirm('');
  };

  const handleLogout = () => { clearSession(); setLoggedIn(false); setMode('login'); };

  if (loggedIn) return <AdminShell onLogout={handleLogout} />;

  return (
    <div className="auth-page-wrapper">
      <div className="auth-page">
        <div className="auth-left">
          <div className="auth-left-content">
            <div className="auth-logo-row">
              <div className="auth-logo-box">TH</div>
              <span className="auth-logo-text">TechHaven</span>
            </div>
            <h1 className="auth-left-heading">{mode === 'login' ? 'Manage your store with confidence' : 'Get started in minutes'}</h1>
            <p className="auth-left-sub">{mode === 'login' ? 'Full control over inventory, orders, and store performance.' : 'Create your admin account and take full control.'}</p>
            <ul className="auth-features">
              <li><div className="auth-feature-icon"><i className="fas fa-chart-line"></i></div> Real-time inventory analytics</li>
              <li><div className="auth-feature-icon"><i className="fas fa-boxes"></i></div> Full stock CRUD management</li>
              <li><div className="auth-feature-icon"><i className="fas fa-shield-alt"></i></div> Secure session-based access</li>
              <li><div className="auth-feature-icon"><i className="fas fa-bell"></i></div> Low stock alerts</li>
            </ul>
          </div>
        </div>

        <div className="auth-right">
          <h2 className="auth-right-heading">{mode === 'login' ? 'Sign in' : 'Create account'}</h2>
          <p className="auth-right-sub">{mode === 'login' ? 'Enter your credentials to access the admin panel' : 'Register to access the TechHaven admin panel'}</p>

          {mode === 'login' && (
            <form onSubmit={handleLogin}>
              {loginError && <div className="auth-error-banner visible"><i className="fas fa-exclamation-circle"></i><span>{loginError}</span></div>}
              <div className="auth-form-group">
                <label htmlFor="login-email">Email address</label>
                <div className="auth-input-wrap"><i className="fas fa-envelope"></i>
                  <input type="email" id="login-email" placeholder="admin@techhaven.com" value={loginEmail} onChange={e => { setLoginEmail(e.target.value); setLoginError(''); }} />
                </div>
              </div>
              <div className="auth-form-group">
                <label htmlFor="login-password">Password</label>
                <div className="auth-input-wrap"><i className="fas fa-lock"></i>
                  <input type="password" id="login-password" placeholder="" value={loginPassword} onChange={e => { setLoginPassword(e.target.value); setLoginError(''); }} />
                </div>
              </div>
              <div className="auth-remember-row">
                <label className="auth-remember-label"><input type="checkbox" checked={rememberMe} onChange={e => setRememberMe(e.target.checked)} /> Remember me for 7 days</label>
              </div>
              <button type="submit" className="auth-submit-btn"><i className="fas fa-sign-in-alt"></i> Sign In to Dashboard</button>
            </form>
          )}

          {mode === 'register' && (
            <form onSubmit={handleRegister}>
              {regError && <div className="auth-error-banner visible"><i className="fas fa-exclamation-circle"></i><span>{regError}</span></div>}
              <div className="auth-form-group">
                <label htmlFor="reg-username">Full Name</label>
                <div className="auth-input-wrap"><i className="fas fa-user"></i>
                  <input type="text" id="reg-username" placeholder="John Doe" value={regUsername} onChange={e => { setRegUsername(e.target.value); setRegError(''); }} />
                </div>
              </div>
              <div className="auth-form-group">
                <label htmlFor="reg-email">Email address</label>
                <div className="auth-input-wrap"><i className="fas fa-envelope"></i>
                  <input type="email" id="reg-email" placeholder="admin@techhaven.com" value={regEmail} onChange={e => { setRegEmail(e.target.value); setRegError(''); }} />
                </div>
              </div>
              <div className="auth-form-group">
                <label htmlFor="reg-password">Password</label>
                <div className="auth-input-wrap"><i className="fas fa-lock"></i>
                  <input type="password" id="reg-password" placeholder="Min. 8 characters" value={regPassword} onChange={e => { setRegPassword(e.target.value); setRegError(''); }} />
                </div>
                <p className="auth-password-hint">Must be at least 8 characters</p>
              </div>
              <div className="auth-form-group">
                <label htmlFor="reg-confirm">Confirm Password</label>
                <div className="auth-input-wrap"><i className="fas fa-lock"></i>
                  <input type="password" id="reg-confirm" placeholder="Repeat your password" value={regConfirm} onChange={e => { setRegConfirm(e.target.value); setRegError(''); }} />
                </div>
              </div>
              <button type="submit" className="auth-submit-btn"><i className="fas fa-user-plus"></i> Create Admin Account</button>
            </form>
          )}

          <div className="auth-divider">or</div>
          <div className="auth-footer-link">
            {mode === 'login' ? 'No account?' : 'Already have an account?'}{' '}
            <button type="button" className="link-button" onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setLoginError(''); setRegError(''); }}>
              {mode === 'login' ? 'Create one here' : 'Sign in here'}
            </button>
          </div>
          <div className="auth-footer-link"><a href="/"> Back to store</a></div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
