import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Signup() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (!firstName.trim()) { setError('First name is required.'); return; }
    if (!lastName.trim()) { setError('Last name is required.'); return; }
    if (!email.trim()) { setError('Email is required.'); return; }
    if (!password) { setError('Password is required.'); return; }
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return; }
    if (password !== confirm) { setError('Passwords do not match.'); return; }
    if (!agreed) { setError('You must agree to the Terms & Conditions.'); return; }

    // Check for duplicate email
    let accounts: { email: string; password: string; firstName: string; lastName: string }[] = [];
    try { accounts = JSON.parse(localStorage.getItem('userAccounts') || '[]'); } catch { accounts = []; }

    if (accounts.some((a) => a.email.toLowerCase() === email.trim().toLowerCase())) {
      setError('An account with this email already exists.');
      return;
    }

    accounts.push({ email: email.trim().toLowerCase(), password, firstName: firstName.trim(), lastName: lastName.trim() });
    localStorage.setItem('userAccounts', JSON.stringify(accounts));
    navigate('/login');
  };

  return (
    <main className="page">
      <section className="auth-hero">
        <h1>Create an Account</h1>
        <p>Join TechHaven today.</p>
      </section>

      <section>
        <form className="form-container" onSubmit={handleSubmit}>
          <div className="form-title-center">
            <h2>Register</h2>
          </div>

          {error && (
            <div className="auth-error-banner visible">
              <i className="fas fa-exclamation-circle"></i>
              <span>{error}</span>
            </div>
          )}

          <div className="form-name-row">
            <div className="form-name-col">
              <label>First Name</label>
              <input
                type="text"
                required
                value={firstName}
                onChange={(e) => { setFirstName(e.target.value); setError(''); }}
              />
            </div>
            <div className="form-name-col">
              <label>Last Name</label>
              <input
                type="text"
                required
                value={lastName}
                onChange={(e) => { setLastName(e.target.value); setError(''); }}
              />
            </div>
          </div>
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
              placeholder="Min. 8 characters"
              required
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(''); }}
            />
          </div>
          <div>
            <label>Confirm Password</label>
            <input
              type="password"
              placeholder="••••••••"
              required
              value={confirm}
              onChange={(e) => { setConfirm(e.target.value); setError(''); }}
            />
          </div>
          <div>
            <label className="form-terms-label">
              <input
                type="checkbox"
                className="form-checkbox"
                checked={agreed}
                onChange={(e) => { setAgreed(e.target.checked); setError(''); }}
              />{' '}
              I agree to the Terms &amp; Conditions
            </label>
          </div>
          <button type="submit" className="btn-primary-lg form-submit-btn">Create Account</button>
          <div className="form-footer-text">
            Already have an account? <Link to="/login" className="form-footer-link">Login here</Link>
          </div>
        </form>
      </section>
    </main>
  );
}

export default Signup;
