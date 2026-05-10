import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar/page';
import Footer from './components/Footer/page';
import Home from './pages/Home/page';
import About from './pages/About/page';
import Blog from './pages/Blog/page';
import Cart from './pages/Cart/page';
import Checkout from './pages/Checkout/page';
import Contact from './pages/Contact/page';
import Dashboard from './pages/Dashboard/page';
import Login from './pages/Login/page';
import Signup from './pages/Signup/page';
import Product from './pages/Product/page';
import Shop from './pages/Shop/page';

function App() {
  return (
    <div className="app-shell">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/product" element={<Product />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="*" element={<Home />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
