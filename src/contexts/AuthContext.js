import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    const checkAuth = async () => {
      if (token) {
        try {
          // Set default auth header for all requests
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          // Get user profile
          const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/user/profile`);
          setCurrentUser(response.data);
        } catch (error) {
          console.error('Authentication error:', error);
          // Clear token if invalid
          localStorage.removeItem('token');
          setToken(null);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, [token]);

  const login = () => {
    // Redirect to GitHub OAuth login
    window.location.href = `${process.env.REACT_APP_API_URL}/api/auth/github`;
  };

  const logout = async () => {
    try {
      await axios.get(`${process.env.REACT_APP_API_URL}/api/auth/logout`);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear token and user regardless of API response
      localStorage.removeItem('token');
      setToken(null);
      setCurrentUser(null);
      delete axios.defaults.headers.common['Authorization'];
    }
  };

  const setAuthToken = (newToken) => {
    if (newToken) {
      localStorage.setItem('token', newToken);
      setToken(newToken);
      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
    }
  };

  const generateApiKey = async () => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/user/api-key/generate`);
      // Update user with new API key
      setCurrentUser({
        ...currentUser,
        apiKey: response.data.apiKey
      });
      return response.data.apiKey;
    } catch (error) {
      console.error('Error generating API key:', error);
      throw error;
    }
  };

  const value = {
    currentUser,
    loading,
    login,
    logout,
    setAuthToken,
    generateApiKey,
    isAuthenticated: !!currentUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
