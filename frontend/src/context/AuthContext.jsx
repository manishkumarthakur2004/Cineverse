import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        try {
          const response = await api.get('/users/profile');
          if (response.data.success) {
            setUser(response.data.data);
          }
        } catch (error) {
          // Silently ignore or handle failure on server for user context

        }
      }
      setLoading(false);
    };

    checkAuth();

    // Listen for global auth expiration event triggered by api interceptor
    const handleAuthExpired = () => {
      setUser(null);
    };
    window.addEventListener('auth-expired', handleAuthExpired);

    return () => window.removeEventListener('auth-expired', handleAuthExpired);
  }, []);

  const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.success) {
      const { accessToken, refreshToken, user: userData } = response.data.data;
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      setUser(userData);
      return response.data;
    }
    throw new Error(response.data.message || 'Login failed');
  };

  const register = async (email, password, fullName, username) => {
    const response = await api.post('/auth/register', { email, password, fullName, username });
    if (response.data.success) {
      return response.data; // Require manual login after register depending on backend logic
    }
    throw new Error(response.data.message || 'Registration failed');
  };

  const logout = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        await api.post('/auth/logout', { refreshToken });
      }
    } catch (error) {
      // Ignore server logout errors on client

    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      setUser(null);
    }
  };

  const updateProfile = async (fullName, profileImageUrl) => {
    const response = await api.put('/users/profile', { fullName, profileImageUrl });
    if (response.data.success) {
      setUser(prev => ({ ...prev, fullName, profileImageUrl }));
    }
    return response.data;
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateProfile,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
