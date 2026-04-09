import React, { createContext, useState, useContext, useEffect } from 'react';
import { getCurrentUser, login as authLogin, logout as authLogout } from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = getCurrentUser();
    setUser(userData);
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    const response = await authLogin(username, password);
    if (response.success) {
      setUser(response.user);
    }
    return response;
  };

  const logout = () => {
    authLogout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};