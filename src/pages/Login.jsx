import { useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

const EyeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOffIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

export default function Login({ onNavigate }) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      await login(email, password);
      onNavigate('home');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }, [login, email, password, onNavigate]);

  return (
    <div className="auth-page">
      <div className="auth-card neo-out">
        <h1 className="auth-card__title">Welcome Back</h1>
        <p className="auth-card__subtitle">Sign in to your Blogify account</p>

        {error && (
          <div className="auth-card__error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="login-email" className="form-label">Email</label>
            <input
              id="login-email"
              type="email"
              className="form-input neo-in"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="login-password" className="form-label">Password</label>
            <div className="password-input-wrapper">
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                className="form-input neo-in"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="auth-submit neo-btn"
            disabled={submitting || !email || !password}
          >
            {submitting ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="auth-card__footer">
          Don&apos;t have an account?{' '}
          <button className="auth-link" onClick={() => onNavigate('register')}>
            Create one
          </button>
        </p>
      </div>
    </div>
  );
}
