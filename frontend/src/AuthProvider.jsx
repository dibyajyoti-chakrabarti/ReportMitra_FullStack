// src/AuthProvider.jsx
import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check for existing token on mount
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      // TODO: Validate token and fetch user data
      setIsAuthenticated(true);
    }
  }, []);

  // Placeholder functions - will implement in Phase 2
  const loginWithEmail = async (email, password) => {
    console.log('Email login - to be implemented');
    setIsLoading(true);
    try {
      // TODO: Implement JWT login
      alert('JWT Authentication will be implemented in Phase 2');
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    console.log('Google OAuth - to be implemented');
    alert('Google OAuth will be implemented in Phase 2');
  };

  const register = async (email, password, additionalData = {}) => {
    console.log('Registration - to be implemented');
    setIsLoading(true);
    try {
      // TODO: Implement JWT registration
      alert('Registration will be implemented in Phase 2');
      // After successful registration, could auto-login
      // setIsAuthenticated(true);
      // setUser({ email, ...additionalData });
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    window.location.href = '/login';
  };

  const getAuthHeaders = async () => {
    const token = localStorage.getItem('accessToken');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  };

  const value = {
    user,
    isLoading,
    isAuthenticated,
    loginWithEmail,
    loginWithGoogle,
    register,
    logout,
    getAuthHeaders,
    // Legacy support for existing components
    login: () => alert('Please use loginWithEmail or loginWithGoogle'),
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};