import { Link } from 'react-router-dom';

function Header() {
  return (
    <section className="page-section">
      <div className="section-title-row">
        <div>
          <h1>Next-Gen Tech For Your Lifestyle</h1>
          <p>
            Discover premium electronics, smart home devices, and cutting-edge accessories designed to elevate your everyday experience.
          </p>
        </div>
        <div className="button-row">
          <Link to="/contact" className="link-button">
            Contact Sales
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Header;
