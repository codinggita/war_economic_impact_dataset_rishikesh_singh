import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../utils/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('jwt_token'));
  const [loading, setLoading] = useState(true);

  // Fetch current user details on mount or token update
  useEffect(() => {
    const fetchUser = async () => {
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }
      try {
        const response = await api.get('/auth/me');
        if (response.data && response.data.success) {
          setUser(response.data.data);
        } else {
          logout();
        }
      } catch (error) {
        console.error('Failed to load user profile:', error.message);
        logout();
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [token]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await api.post('/auth/login', { email, password });
      if (response.data && response.data.success) {
        const { token: receivedToken, user: userData } = response.data.data;
        localStorage.setItem('jwt_token', receivedToken);
        setToken(receivedToken);
        setUser(userData);
        return { success: true };
      }
      return { success: false, error: 'Failed to sign in. Please check response payload.' };
    } catch (error) {
      const msg = error.response?.data?.message || 'Login request encountered an error.';
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password, role = 'user') => {
    setLoading(true);
    try {
      const response = await api.post('/auth/register', { name, email, password, role });
      if (response.data && response.data.success) {
        const { token: receivedToken, user: userData } = response.data.data;
        localStorage.setItem('jwt_token', receivedToken);
        setToken(receivedToken);
        setUser(userData);
        return { success: true };
      }
      return { success: false, error: 'Registration failed.' };
    } catch (error) {
      const msg = error.response?.data?.message || 'Registration request encountered an error.';
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await api.post('/auth/logout');
    } catch (err) {
      console.warn('Logout call failed on server:', err.message);
    } finally {
      localStorage.removeItem('jwt_token');
      setToken(null);
      setUser(null);
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be consumed within an AuthProvider.');
  }
  return context;
};
