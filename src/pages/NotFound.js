import React from 'react';
import { Typography, Box, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        textAlign: 'center',
        p: 3
      }}
    >
      <Typography variant="h1" component="h1" sx={{ mb: 2 }}>
        404
      </Typography>
      <Typography variant="h4" component="h2" sx={{ mb: 3 }}>
        Page Not Found
      </Typography>
      <Typography variant="body1" sx={{ mb: 4 }}>
        The page you are looking for doesn't exist or has been moved.
      </Typography>
      <Button 
        variant="contained" 
        color="primary" 
        component={Link} 
        to="/dashboard"
      >
        Go to Dashboard
      </Button>
    </Box>
  );
};

export default NotFound;
