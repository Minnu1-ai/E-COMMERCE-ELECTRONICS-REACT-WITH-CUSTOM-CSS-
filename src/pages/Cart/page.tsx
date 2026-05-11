import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

interface CartItem {
  id?: string;
  name: string;
  price: number;
  image: string;
  category: string;
  qty: number;
}

const getCart = (): CartItem[] => {
  try { return JSON.parse(localStorage.getItem('cartItems') || '[]'); } catch { return []; }
};
const saveCart = (items: CartItem[]) => {
  localStorage.setItem('cartItems', JSON.stringify(items));
  window.dispatchEvent(new Event('cartUpdated'));
};

function Cart() {
  const [cart, setCart] = useState<CartItem[]>(getCart);
  const navigate = useNavigate();

  // Keep in sync if another tab updates cart
  useEffect(() => {
    const sync = () => setCart(getCart());
    window.addEventListener('cartUpdated', sync);
    return () => window.removeEventListener('cartUpdated', sync);
  }, []);

  const updateQty = (index: number, delta: number) => {
    const updated = [...cart];
    updated[index].qty = Math.max(1, updated[index].qty + delta);
    saveCart(updated);
    setCart([...updated]);
  };

  const setQty = (index: number, val: number) => {
    const updated = [...cart];
    updated[index].qty = Math.max(1, val || 1);
    saveCart(updated);
    setCart([...updated]);
  };

  const removeItem = (index: number) => {
    const updated = cart.filter((_, i) => i !== index);
    saveCart(updated);
    setCart(updated);
  };

  const clearCart = () => {
    if (window.confirm('Remove all items from your cart?')) {
      saveCart([]);
      setCart([]);
    }
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const tax = subtotal * 0.08;
  const total = subtotal + tax;
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);

  return (
    <main className="cart-page">
      <section className="cart-hero">
        <h1>Your Cart</h1>
        <p>Review your items before checkout.</p>
      </section>

      <section className="cart-layout">
        <div>
          <div className="cart-header-row">
            <h3>
              Cart Items{' '}
              {totalItems > 0 && (
                <span className="cart-item-count">({totalItems} item{totalItems !== 1 ? 's' : ''})</span>
              )}
            </h3>
            {cart.length > 0 && (
              <button type="button" className="cart-clear-btn" onClick={clearCart}>
                <i className="fas fa-trash"></i> Clear All
              </button>
            )}
          </div>

          <div className="cart-items-box">
            {cart.length === 0 ? (
              <div className="empty-cart">
                <i className="fas fa-shopping-cart"></i>
                <h3>Your cart is empty</h3>
                <p>Looks like you haven't added anything yet.</p>
                <Link to="/shop" className="btn-lg">Start Shopping</Link>
              </div>
            ) : (
              cart.map((item, i) => (
                <div key={i} className="cart-item-row">
                  <img
                    className="cart-item-img"
                    src={item.image}
                    alt={item.name}
                    onError={(e) => { (e.target as HTMLImageElement).src = '/images/laptops/Product1.jpg'; }}
                  />
                  <div className="cart-item-info">
                    <div className="cart-item-name">{item.name}</div>
                    <div className="cart-item-cat">{item.category}</div>
                    <div className="cart-item-unit">Unit: ${item.price.toFixed(2)}</div>
                  </div>
                  <div className="qty-control">
                    <button type="button" className="qty-dec" onClick={() => updateQty(i, -1)}>-</button>
                    <input
                      type="number"
                      value={item.qty}
                      min={1}
                      max={99}
                      className="qty-input"
                      onChange={(e) => setQty(i, parseInt(e.target.value))}
                    />
                    <button type="button" className="qty-inc" onClick={() => updateQty(i, 1)}>+</button>
                  </div>
                  <div className="cart-item-price">${(item.price * item.qty).toFixed(2)}</div>
                  <button
                    type="button"
                    className="remove-btn"
                    aria-label="Remove item"
                    onClick={() => removeItem(i)}
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </div>
              ))
            )}
          </div>

          <div className="cart-continue-row">
            <Link to="/shop" className="btn-outline">
              <i className="fas fa-arrow-left"></i> Continue Shopping
            </Link>
          </div>
        </div>

        <div className="summary-card">
          <h3 className="summary-title">Order Summary</h3>
          <p className="summary-subtitle">Prices include applicable taxes</p>
          <div className="summary-row">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>Shipping</span>
            <span className="summary-shipping">Free</span>
          </div>
          <div className="summary-row">
            <span>Tax (8%)</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <div className="summary-total">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <button
            type="button"
            className={`btn-checkout${cart.length === 0 ? ' btn-disabled' : ''}`}
            disabled={cart.length === 0}
            onClick={() => navigate('/checkout')}
          >
            Proceed to Checkout <i className="fas fa-arrow-right"></i>
          </button>
          <div className="summary-payment-icons">
            <i className="fab fa-cc-visa"></i>
            <i className="fab fa-cc-mastercard"></i>
            <i className="fab fa-cc-paypal"></i>
            <i className="fab fa-cc-apple-pay"></i>
          </div>
          <p className="summary-secure-note">
            <i className="fas fa-lock"></i> Secure checkout
          </p>
        </div>
      </section>
    </main>
  );
}

export default Cart;
