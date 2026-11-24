import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('taskflow_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem('taskflow_token') || null);
  const [loading, setLoading] = useState(true);

  // Validate session on app initialization
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('taskflow_token');
      if (storedToken) {
        try {
          const res = await api.auth.getMe();
          if (res.success && res.user) {
            setUser(res.user);
            localStorage.setItem('taskflow_user', JSON.stringify(res.user));
          }
        } catch {
          // Token expired or invalid
          setUser(null);
          setToken(null);
          localStorage.removeItem('taskflow_token');
          localStorage.removeItem('taskflow_user');
        }
      }
      setLoading(false);
    };

    initializeAuth();

    // Listen for session expired events
    const handleExpired = () => {
      setUser(null);
      setToken(null);
      localStorage.removeItem('taskflow_token');
      localStorage.removeItem('taskflow_user');
    };

    window.addEventListener('taskflow:session-expired', handleExpired);
    return () => window.removeEventListener('taskflow:session-expired', handleExpired);
  }, []);

  const login = async (email, password) => {
    const res = await api.auth.login({ email, password });
    if (res.success) {
      const accessToken = res.session?.access_token || 'session_token';
      const currentUser = res.user;

      setToken(accessToken);
      setUser(currentUser);

      localStorage.setItem('taskflow_token', accessToken);
      localStorage.setItem('taskflow_user', JSON.stringify(currentUser));
      return { success: true };
    }
    return { success: false, message: res.message };
  };

  const register = async (userData) => {
    const res = await api.auth.register(userData);
    if (res.success) {
      if (res.session?.access_token) {
        const accessToken = res.session.access_token;
        setToken(accessToken);
        setUser(res.user);
        localStorage.setItem('taskflow_token', accessToken);
        localStorage.setItem('taskflow_user', JSON.stringify(res.user));
      }
      return { success: true, message: res.message, hasSession: !!res.session };
    }
    return { success: false, message: res.message };
  };

  const logout = async () => {
    try {
      await api.auth.logout();
    } catch {
      // Continue client cleanup even if network fails
    } finally {
      setUser(null);
      setToken(null);
      localStorage.removeItem('taskflow_token');
      localStorage.removeItem('taskflow_user');
    }
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!token && !!user,
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
