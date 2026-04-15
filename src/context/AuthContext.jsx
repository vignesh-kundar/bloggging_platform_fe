import { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { authApi } from '../services/authApi';

const AuthContext = createContext(null);

const TOKEN_KEY = 'blogify_auth_token';
const USER_KEY = 'blogify_auth_user';

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => sessionStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState(() => {
    const stored = sessionStorage.getItem(USER_KEY);
    return stored ? JSON.parse(stored) : null;
  });

  const isAuthenticated = !!token;

  const login = useCallback(async (email, password) => {
    const data = await authApi.login(email, password);
    const jwt = data.token || data.jwt || data.accessToken || data;
    const tokenStr = typeof jwt === 'string' ? jwt : JSON.stringify(jwt);

    sessionStorage.setItem(TOKEN_KEY, tokenStr);
    setToken(tokenStr);

    // Store user info if the response includes it
    if (data.user || data.name || data.email) {
      const userInfo = data.user || { name: data.name, email: data.email };
      sessionStorage.setItem(USER_KEY, JSON.stringify(userInfo));
      setUser(userInfo);
    }

    return data;
  }, []);

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
