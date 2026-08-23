import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiService } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('medicare_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('medicare_token') || null);
  const [loading, setLoading] = useState(true);

  // Sync token to API headers and validate session
  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        try {
          if (apiService.setAuthToken) {
            apiService.setAuthToken(token);
          }
          const res = await apiService.getProfile();
          const activeUser = res.user || res.data?.user || res;
          setUser(activeUser);
          localStorage.setItem('medicare_user', JSON.stringify(activeUser));
        } catch (err) {
          console.error('Session restore failed:', err);
          logout();
        }
      } else {
        if (apiService.clearAuthToken) {
          apiService.clearAuthToken();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, [token]);

  const login = async (email, password) => {
    const res = await apiService.login(email, password);
    const authToken = res.token || res.data?.token;
    const authUser = res.user || res.data?.user;

    localStorage.setItem('medicare_token', authToken);
    localStorage.setItem('medicare_user', JSON.stringify(authUser));

    if (apiService.setAuthToken) {
      apiService.setAuthToken(authToken);
    }

    setToken(authToken);
    setUser(authUser);
    return authUser;
  };

  const register = async (userData) => {
    const res = await apiService.register(userData);
    const authToken = res.token || res.data?.token;
    const authUser = res.user || res.data?.user;

    localStorage.setItem('medicare_token', authToken);
    localStorage.setItem('medicare_user', JSON.stringify(authUser));

    if (apiService.setAuthToken) {
      apiService.setAuthToken(authToken);
    }

    setToken(authToken);
    setUser(authUser);
    return authUser;
  };

  const logout = () => {
    // 1. Wipe all local storage auth keys
    localStorage.removeItem('medicare_token');
    localStorage.removeItem('medicare_user');

    // 2. Clear API Authorization headers immediately
    if (apiService.clearAuthToken) {
      apiService.clearAuthToken();
    }

    // 3. Reset application state
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        isAdmin: user?.role === 'admin',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);