import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

const AuthCallback = () => {
  const { setAuthToken } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleCallback = () => {
      // Extract token from URL query parameters
      const queryParams = new URLSearchParams(location.search);
      const token = queryParams.get('token');

      if (token) {
        // Set the token in auth context
        setAuthToken(token);
        
        // Redirect to dashboard
        navigate('/dashboard', { replace: true });
      } else {
        // If no token, redirect to login
        navigate('/login', { replace: true });
      }
    };

    handleCallback();
  }, [location, navigate, setAuthToken]);

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <CircularProgress />
      <Box sx={{ ml: 2 }}>Authenticating...</Box>
    </Box>
  );
};

export default AuthCallback;
