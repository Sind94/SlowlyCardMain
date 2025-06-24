import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('slowlycard_token');
        if (token) {
          const userData = await authAPI.getCurrentUser();
          setUser(userData);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.removeItem('slowlycard_token');
        localStorage.removeItem('slowlycard_auth');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await authAPI.login(email, password);
      localStorage.setItem('slowlycard_token', response.access_token);
      localStorage.setItem('slowlycard_auth', JSON.stringify(response.user));
      setUser(response.user);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.detail || 'Errore durante il login' 
      };
    }
  };

  const register = async (email, nickname, password) => {
    try {
      const response = await authAPI.register(email, nickname, password);
      localStorage.setItem('slowlycard_token', response.access_token);
      localStorage.setItem('slowlycard_auth', JSON.stringify(response.user));
      setUser(response.user);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.detail || 'Errore durante la registrazione' 
      };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('slowlycard_token');
    localStorage.removeItem('slowlycard_auth');
  };

  const refreshUser = async () => {
    try {
      const userData = await authAPI.getCurrentUser();
      setUser(userData);
      localStorage.setItem('slowlycard_auth', JSON.stringify(userData));
    } catch (e) { /* ignore */ }
  };

  const value = {
    user,
    login,
    register,
    logout,
    isLoading,
    refreshUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};