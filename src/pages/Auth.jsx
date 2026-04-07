import { useState, useCallback, useEffect } from 'react';
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

export default function AuthPage({ onAuthSuccess }) {
  const { login, register } = useAuth();
  const [mode, setMode] = useState('login');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    userName: '',
    password: '',
    confirmPassword: ''
  });

  useEffect(() => {
    setError('');
  }, [mode]);

  const handleLoginSubmit = useCallback(async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      await login(loginData.email, loginData.password);
      onAuthSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }, [login, loginData, onAuthSuccess]);

  const handleRegisterSubmit = useCallback(async (e) => {
    e.preventDefault();
    setError('');

    if (registerData.password !== registerData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (registerData.password.length < 4) {
      setError('Password must be at least 4 characters');
      return;
    }

    setSubmitting(true);

    try {
      await register(
        registerData.name,
        registerData.email,
        registerData.userName,
        registerData.password
      );
      onAuthSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }, [register, registerData, onAuthSuccess]);

  const passwordsMatch = registerData.password === registerData.confirmPassword;
  const showPasswordError = registerData.confirmPassword.length > 0 && !passwordsMatch;

  return (
    <div className="auth-page">
      <div className="auth-card neo-out">
        <div className="auth-card__tabs">
          <button
            className={`auth-tab ${mode === 'login' ? 'auth-tab--active' : ''}`}
            onClick={() => setMode('login')}
          >
            Sign In
          </button>
          <button
            className={`auth-tab ${mode === 'register' ? 'auth-tab--active' : ''}`}
            onClick={() => setMode('register')}
          >
            Register
          </button>
        </div>

        <h1 className="auth-card__title">
          {mode === 'login' ? 'Welcome Back' : 'Create Account'}
        </h1>
        <p className="auth-card__subtitle">
          {mode === 'login'
            ? 'Sign in to your Blogify account'
            : 'Join Blogify and start writing'}
        </p>

        {error && (
          <div className="auth-card__error">
            {error}
          </div>
        )}

        {mode === 'login' ? (
          <form onSubmit={handleLoginSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="login-email" className="form-label">Email</label>
              <input
                id="login-email"
                type="email"
                className="form-input neo-in"
                value={loginData.email}
                onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
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
                  value={loginData.password}
                  onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
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
              disabled={submitting || !loginData.email || !loginData.password}
            >
              {submitting ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegisterSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="register-name" className="form-label">Full Name</label>
              <input
                id="register-name"
                type="text"
                className="form-input neo-in"
                value={registerData.name}
                onChange={(e) => setRegisterData(prev => ({ ...prev, name: e.target.value }))}
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
                value={registerData.userName}
                onChange={(e) => setRegisterData(prev => ({ ...prev, userName: e.target.value }))}
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
                value={registerData.email}
                onChange={(e) => setRegisterData(prev => ({ ...prev, email: e.target.value }))}
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
                  value={registerData.password}
                  onChange={(e) => setRegisterData(prev => ({ ...prev, password: e.target.value }))}
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
                value={registerData.confirmPassword}
                onChange={(e) => setRegisterData(prev => ({ ...prev, confirmPassword: e.target.value }))}
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
              disabled={submitting ||
                !registerData.name ||
                !registerData.email ||
                !registerData.userName ||
                !registerData.password ||
                !registerData.confirmPassword}
            >
              {submitting ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
