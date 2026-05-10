import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

interface CartItem {
  name: string;
  price: number;
  image: string;
  category: string;
  qty: number;
}

const getCart = (): CartItem[] => {
  try { return JSON.parse(localStorage.getItem('cartItems') || '[]'); } catch { return []; }
};

function Checkout() {
  const [cart, setCart] = useState<CartItem[]>(getCart);
  const [paymentMethod, setPaymentMethod] = useState('credit');
  const [placing, setPlacing] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderNum, setOrderNum] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const sync = () => setCart(getCart());
    window.addEventListener('cartUpdated', sync);
    return () => window.removeEventListener('cartUpdated', sync);
  }, []);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (cart.length === 0) { alert('Your cart is empty!'); return; }
    setPlacing(true);
    setTimeout(() => {
      localStorage.removeItem('cartItems');
      window.dispatchEvent(new Event('cartUpdated'));
      setOrderNum('#TH' + Math.floor(10000 + Math.random() * 90000));
      setOrderPlaced(true);
      setPlacing(false);
    }, 1800);
  };

  if (orderPlaced) {
    return (
      <main className="page">
        <div className="checkout-success">
          <div className="checkout-success-icon"><i className="fas fa-check"></i></div>
          <h2>Order Placed!</h2>
          <p>Thank you for shopping with TechHaven.</p>
          <p className="checkout-success-order">Order {orderNum}</p>
          <p>A confirmation email will be sent to you shortly.</p>
          <div className="checkout-success-actions">
            <Link to="/" className="btn lg-button">Back to Home</Link>
            <Link to="/shop" className="btn-outline-lg">Continue Shopping</Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="page">
      <section className="checkout-hero">
        <h1>Checkout</h1>
        <p>Complete your order securely.</p>
      </section>

      <div className="checkout-steps">
        <div className="checkout-step">
          <div className="checkout-step-num checkout-step-num-active">1</div>
          <span className="checkout-step-label-active">Cart</span>
        </div>
        <div className="checkout-step-line"><div className="checkout-step-line-active"></div></div>
        <div className="checkout-step">
          <div className="checkout-step-num checkout-step-num-active">2</div>
          <span className="checkout-step-label-active">Checkout</span>
        </div>
        <div className="checkout-step-line"><div className="checkout-step-line-inactive"></div></div>
        <div className="checkout-step">
          <div className="checkout-step-num checkout-step-num-inactive">3</div>
          <span className="checkout-step-label-inactive">Confirmation</span>
        </div>
      </div>

      <section className="checkout-layout">
        <div>
          <form id="checkout-form" onSubmit={handleSubmit}>
            <div className="checkout-form-card">
              <div className="section-title"><i className="fas fa-map-marker-alt"></i> Billing Details</div>
              <div className="form-row">
                <div className="form-group">
                  <label>First Name *</label>
                  <input type="text" placeholder="John" required />
                </div>
                <div className="form-group">
                  <label>Last Name *</label>
                  <input type="text" placeholder="Doe" required />
                </div>
              </div>
              <div className="form-group">
                <label>Company Name <span className="checkout-optional">(Optional)</span></label>
                <input type="text" placeholder="Your company" />
              </div>
              <div className="form-group">
                <label>Street Address *</label>
                <input type="text" placeholder="House number and street name" required />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Town / City *</label>
                  <input type="text" placeholder="New York" required />
                </div>
                <div className="form-group">
                  <label>ZIP Code *</label>
                  <input type="text" placeholder="10001" required />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Phone *</label>
                  <input type="tel" placeholder="+1 (555) 000-0000" required />
                </div>
                <div className="form-group">
                  <label>Email Address *</label>
                  <input type="email" placeholder="john@example.com" required />
                </div>
              </div>
            </div>

            <div className="checkout-form-card">
              <div className="section-title"><i className="fas fa-credit-card"></i> Payment Method</div>
              <div className="payment-option">
                <label>
                  <input
                    type="radio"
                    name="payment"
                    value="credit"
                    checked={paymentMethod === 'credit'}
                    onChange={() => setPaymentMethod('credit')}
                  />
                  <i className="fas fa-credit-card"></i> Credit / Debit Card
                  <span className="payment-icons">
                    <i className="fab fa-cc-visa"></i>
                    <i className="fab fa-cc-mastercard"></i>
                  </span>
                </label>
                {paymentMethod === 'credit' && (
                  <div id="credit-card-fields">
                    <div className="form-group">
                      <label>Card Number</label>
                      <input type="text" className="cc-input" placeholder="1234 5678 9012 3456" maxLength={19} required />
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Expiry Date</label>
                        <input type="text" className="cc-input" placeholder="MM / YY" maxLength={7} required />
                      </div>
                      <div className="form-group">
                        <label>CVC</label>
                        <input type="text" className="cc-input" placeholder="123" maxLength={4} required />
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="payment-option">
                <label>
                  <input
                    type="radio"
                    name="payment"
                    value="paypal"
                    checked={paymentMethod === 'paypal'}
                    onChange={() => setPaymentMethod('paypal')}
                  />
                  <i className="fab fa-paypal"></i> PayPal
                  <span className="payment-icons"><i className="fab fa-cc-paypal"></i></span>
                </label>
              </div>
              <div className="payment-option">
                <label>
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                  />
                  <i className="fas fa-money-bill-wave"></i> Cash on Delivery
                </label>
              </div>
            </div>
          </form>
        </div>

        <aside className="order-summary-card">
          <div className="order-summary-header-bar">
            <i className="fas fa-shopping-bag"></i> Your Order
          </div>
          <div className="order-items-list">
            {cart.length === 0 ? (
              <p className="checkout-empty-msg">Your cart is empty.</p>
            ) : (
              cart.map((item, i) => (
                <div key={i} className="order-item">
                  <img
                    className="order-item-img"
                    src={item.image}
                    alt={item.name}
                    onError={(e) => { (e.target as HTMLImageElement).src = '/images/laptops/Product1.jpg'; }}
                  />
                  <div className="order-item-details">
                    <div className="order-item-name">{item.name}</div>
                    <div className="order-item-qty">Qty: {item.qty} &times; ${item.price.toFixed(2)}</div>
                  </div>
                  <div className="order-item-price">${(item.price * item.qty).toFixed(2)}</div>
                </div>
              ))
            )}
          </div>
          <div className="order-totals-section">
            <div className="totals-row"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
            <div className="totals-row free"><span>Shipping</span><span>Free</span></div>
            <div className="totals-row"><span>Tax (8%)</span><span>${tax.toFixed(2)}</span></div>
            <div className="totals-total"><span>Total</span><span>${total.toFixed(2)}</span></div>
          </div>
          <div className="order-place-section">
            <button
              type="submit"
              form="checkout-form"
              className="btn-primary-lg checkout-place-btn"
              disabled={placing || cart.length === 0}
            >
              {placing
                ? <><i className="icon-fa-spinner"></i> Processing...</>
                : <><i className="fas fa-lock"></i> Place Order</>
              }
            </button>
          </div>
          <div className="order-secure-row">
            <i className="fab fa-cc-visa"></i>
            <i className="fab fa-cc-mastercard"></i>
            <i className="fab fa-cc-paypal"></i>
            <i className="fab fa-cc-apple-pay"></i>
            <span className="order-ssl-badge"><i className="icon-fa-ssl"></i>SSL Secured</span>
          </div>
        </aside>
      </section>
    </main>
  );
}

export default Checkout;
