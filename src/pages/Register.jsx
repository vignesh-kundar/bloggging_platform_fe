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

export default function Register({ onNavigate }) {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const passwordsMatch = password === confirmPassword && password.length > 0;
  const showPasswordError = confirmPassword.length > 0 && !passwordsMatch;

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setError('');

    if (!passwordsMatch) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 4) {
      setError('Password must be at least 4 characters');
      return;
    }

    setSubmitting(true);

    try {
      await register(name, email, userName, password);
      onNavigate('home');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }, [register, name, email, userName, password, passwordsMatch, onNavigate]);

  return (
    <div className="auth-page">
      <div className="auth-card neo-out">
        <h1 className="auth-card__title">Create Account</h1>
        <p className="auth-card__subtitle">Join Blogify and start writing</p>

        {error && (
          <div className="auth-card__error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="register-name" className="form-label">Full Name</label>
            <input
              id="register-name"
              type="text"
              className="form-input neo-in"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              required
              autoComplete="name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="register-username" className="form-label">Username</label>
            <input
              id="register-username"
              type="text"
              className="form-input neo-in"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="johndoe"
              required
              autoComplete="username"
            />
          </div>

          <div className="form-group">
            <label htmlFor="register-email" className="form-label">Email</label>
            <input
              id="register-email"
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
            <label htmlFor="register-password" className="form-label">Password</label>
            <div className="password-input-wrapper">
              <input
                id="register-password"
                type={showPassword ? 'text' : 'password'}
                className="form-input neo-in"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 4 characters"
                required
                autoComplete="new-password"
                minLength={4}
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

          <div className="form-group">
            <label htmlFor="register-confirm-password" className="form-label">Confirm Password</label>
            <input
              id="register-confirm-password"
              type="password"
              className={`form-input neo-in ${showPasswordError ? 'form-input--error' : ''}`}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter your password"
              required
              autoComplete="new-password"
            />
            {showPasswordError && (
              <span className="form-error">Passwords do not match</span>
            )}
          </div>

          <button
            type="submit"
            className="auth-submit neo-btn"
            disabled={submitting || !name || !email || !userName || !password || !confirmPassword}
          >
            {submitting ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <p className="auth-card__footer">
          Already have an account?{' '}
          <button className="auth-link" onClick={() => onNavigate('login')}>
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
}
