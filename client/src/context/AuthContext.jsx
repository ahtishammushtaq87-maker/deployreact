import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const checkLogin = async () => {
      try {
        const response = await api.get('/auth/profile');
        setUser(response.data);
      } catch (error) {
        // Silent on 401
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkLogin();
  }, []);

  const login = async (phone, password) => {
    const response = await api.post('/auth/login', { phone, password });
    // Save token for mobile Bearer auth
    if (response.data.token) {
      localStorage.setItem('novapay_token', response.data.token);
    }
    setUser(response.data);
    return response.data;
  };

  const register = async (userData) => {
    const response = await api.post('/auth/register', userData);
    // Save token for mobile Bearer auth
    if (response.data.token) {
      localStorage.setItem('novapay_token', response.data.token);
    }
    setUser(response.data);
    return response.data;
  };

  const logout = async () => {
    await api.post('/auth/logout');
    localStorage.removeItem('novapay_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
