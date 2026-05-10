import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer>
      <div className="footer-container">
        <div>
          <Link to="/" className="footer-logo-link">
            <div className="nav-logo-box">TH</div>
            TechHaven
          </Link>
          <p>Your ultimate destination for the latest and greatest in consumer electronics.</p>
        </div>
        <div>
          <h4>Quick Links</h4>
          <Link to="/about">About Us</Link>
          <Link to="/contact">Contact Us</Link>
          <Link to="/blog">Blog</Link>
        </div>
        <div>
          <h4>Categories</h4>
          <Link to="/shop">Laptops & Computers</Link>
          <Link to="/shop">Smartphones & Tablets</Link>
          <Link to="/shop">Audio & Headphones</Link>
        </div>
      </div>
      <div className="footer-bottom-bar">
        <p className="footer-copyright">&copy; 2026 TechHaven Electronics. All rights reserved.</p>
        <div className="footer-payment-icons">
          <i className="fab fa-cc-visa"></i>
          <i className="fab fa-cc-mastercard"></i>
          <i className="fab fa-cc-paypal"></i>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
