import { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { postsApi } from '../services/postsApi';
import { authApi } from '../services/authApi';

const AuthContext = createContext(null);

const getStoredAuth = () => {
  try {
    const token = sessionStorage.getItem('token');
    const userStr = sessionStorage.getItem('user');
    if (token && userStr) {
      return { token, user: JSON.parse(userStr) };
    }
  } catch {
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('token');
  }
  return { token: null, user: null };
};

export function AuthProvider({ children }) {
  const storedAuth = getStoredAuth();
  const [user, setUser] = useState(storedAuth.user);
  const [token, setToken] = useState(storedAuth.token);

  const validateToken = useCallback(async () => {
    const storedToken = sessionStorage.getItem('token');
    if (!storedToken) {
      return false;
    }

    try {
      await postsApi.getAll();
      return true;
    } catch (err) {
      if (err.message.includes('403') || err.message.includes('Unauthorized') || err.message.includes('unauthorized')) {
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('user');
        setToken(null);
        setUser(null);
        return false;
      }
      return true;
    }
  }, []);

  const login = useCallback(async (email, password) => {
    const data = await authApi.login(email, password);
    const { token: newToken } = data;
    sessionStorage.setItem('token', newToken);
    setToken(newToken);

    const payload = JSON.parse(atob(newToken.split('.')[1]));
    const userInfo = {
      email: payload.sub,
      id: payload.sub,
      name: payload.name || payload.sub.split('@')[0],
    };
    setUser(userInfo);
    sessionStorage.setItem('user', JSON.stringify(userInfo));
    return data;
  }, []);

  const register = useCallback(async (name, email, userName, password) => {
    const data = await authApi.register(name, email, userName, password);
    const { token: newToken } = data;
    sessionStorage.setItem('token', newToken);
    setToken(newToken);

    const payload = JSON.parse(atob(newToken.split('.')[1]));
    const userInfo = {
      email: payload.sub,
      id: payload.sub,
      name: payload.name || name,
      userName,
    };
    setUser(userInfo);
    sessionStorage.setItem('user', JSON.stringify(userInfo));
    return data;
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    setToken(null);
    setUser(null);
  }, []);

  const value = useMemo(() => ({
    user,
    token,
    isAuthenticated: !!token,
    login,
    register,
    logout,
    validateToken,
  }), [user, token, login, register, logout, validateToken]);

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
