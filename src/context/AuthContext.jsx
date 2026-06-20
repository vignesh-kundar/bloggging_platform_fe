import { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import { authApi } from '../services/authApi';

const AuthContext = createContext(null);

const TOKEN_KEY = 'blogify_auth_token';
const USER_KEY  = 'blogify_auth_user';

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => sessionStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState(() => {
    const stored = sessionStorage.getItem(USER_KEY);
    return stored ? JSON.parse(stored) : null;
  });

  const isAuthenticated = !!token;

  const fetchProfile = useCallback(async () => {
    try {
      const profile = await authApi.getProfile();
      setUser(prev => {
        // Keep the seeded avatarUrl — backend returns a generic unseeded URL
        const merged = { ...prev, ...profile };
        if (profile.avatarUrl && !profile.avatarUrl.includes('?seed=') && prev?.avatarUrl?.includes('?seed=')) {
          merged.avatarUrl = prev.avatarUrl;
        }
        sessionStorage.setItem(USER_KEY, JSON.stringify(merged));
        return merged;
      });
    } catch {
      // Profile fetch is best-effort; basic user info from login is sufficient
    }
  }, []);

  const decodeJwtPayload = useCallback((token) => {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return null;
      return JSON.parse(atob(parts[1]));
    } catch {
      return null;
    }
  }, []);

  const login = useCallback(async (email, password) => {
    const data = await authApi.login(email, password);
    const jwt = data.token || data.jwt || data.accessToken || data;
    const tokenStr = typeof jwt === 'string' ? jwt : JSON.stringify(jwt);

    sessionStorage.setItem(TOKEN_KEY, tokenStr);
    setToken(tokenStr);

    // Extract user info from response or JWT claims
    const payload = decodeJwtPayload(tokenStr);
    const userEmail = data.email || payload?.sub || email;
    const userName = data.name || payload?.name || userEmail.split('@')[0];
    const avatarUrl = `https://api.dicebear.com/9.x/notionists/svg?seed=${encodeURIComponent(userEmail)}`;

    const userInfo = { email: userEmail, name: userName, avatarUrl };
    sessionStorage.setItem(USER_KEY, JSON.stringify(userInfo));
    setUser(userInfo);

    // Best-effort: try to fetch richer profile from backend
    fetchProfile();

    return data;
  }, [fetchProfile, decodeJwtPayload]);

  const register = useCallback(async (name, email, userName, password) => {
    const data = await authApi.register(name, email, userName, password);
    return data;
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(USER_KEY);
    setToken(null);
    setUser(null);
  }, []);

  // When apiClient receives a 403, it dispatches this event.
  // We react by clearing the session so React re-renders to the login gate.
  useEffect(() => {
    const handleExpired = () => logout();
    window.addEventListener('auth:expired', handleExpired);
    return () => window.removeEventListener('auth:expired', handleExpired);
  }, [logout]);

  // Kept for any call-sites that still pass headers explicitly
  const getAuthHeaders = useCallback(() => {
    if (!token) return {};
    return { Authorization: `Bearer ${token}` };
  }, [token]);

  const value = useMemo(() => ({
    token,
    user,
    isAuthenticated,
    login,
    register,
    logout,
    getAuthHeaders,
  }), [token, user, isAuthenticated, login, register, logout, getAuthHeaders]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
