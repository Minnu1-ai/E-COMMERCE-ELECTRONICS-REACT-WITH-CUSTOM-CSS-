import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) { setError('Email is required.'); return; }
    if (!password) { setError('Password is required.'); return; }

    // Check against stored accounts if any exist
    let accounts: { email: string; password: string; firstName: string }[] = [];
    try { accounts = JSON.parse(localStorage.getItem('userAccounts') || '[]'); } catch { accounts = []; }

    if (accounts.length > 0) {
      // Validate against registered accounts
      const match = accounts.find(
        (a) => a.email.toLowerCase() === email.trim().toLowerCase() && a.password === password
      );
      if (!match) {
        setError('Invalid email or password.');
        return;
      }
      localStorage.setItem('userSession', JSON.stringify({ email: match.email, firstName: match.firstName }));
    } else {
      // No accounts registered yet — accept any credentials (demo mode)
      const firstName = email.split('@')[0];
      localStorage.setItem('userSession', JSON.stringify({ email: email.trim().toLowerCase(), firstName }));
    }

    navigate('/');
  };

  return (
    <main className="page">
      <section className="auth-hero">
        <h1>Welcome Back</h1>
        <p>Login to access your account.</p>
      </section>

      <section>
        <form className="form-container" onSubmit={handleSubmit}>
          <div className="form-title-center">
            <h2>Login</h2>
          </div>

          {error && (
            <div className="auth-error-banner visible">
              <i className="fas fa-exclamation-circle"></i>
              <span>{error}</span>
            </div>
          )}

          <div>
            <label>Email Address</label>
            <input
              type="email"
              placeholder="you@example.com"
              required
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(''); }}
            />
          </div>
          <div>
            <label>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              required
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(''); }}
            />
          </div>
          <div className="form-remember-row">
            <label className="form-remember-label">
              <input type="checkbox" className="form-checkbox" /> Remember me
            </label>
            <a href="#" className="form-forgot-link">Forgot Password?</a>
          </div>
          <button type="submit" className="btn-primary-lg form-submit-btn">Sign In</button>
          <div className="form-footer-text">
            Don't have an account? <Link to="/signup" className="form-footer-link">Register here</Link>
          </div>
        </form>
      </section>
    </main>
  );
}

export default Login;
